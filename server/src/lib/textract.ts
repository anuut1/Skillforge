import {
  TextractClient,
  DetectDocumentTextCommand,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand,
  Block,
} from '@aws-sdk/client-textract';

const REGION = process.env.AWS_REGION || process.env.COGNITO_REGION || 'ap-south-1';

export const textractClient = new TextractClient({
  region: REGION,
});

export interface TextExtractionResult {
  text: string;
  lineCount: number;
  confidenceAverage: number;
  pageCount: number;
  isMultiPage: boolean;
  hasTablesOrColumns: boolean;
}

/**
 * Normalizes OCR text, fixing ligatures, stray bullet characters, and encoding artifacts.
 */
function cleanOcrText(rawText: string): string {
  return rawText
    // Normalize Unicode ligatures
    .replace(/\uFB00/g, 'ff')
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl')
    .replace(/\uFB03/g, 'ffi')
    .replace(/\uFB04/g, 'ffl')
    // Standardize bullet points
    .replace(/[\u2022\u2023\u25E6\u2043\u2219\u25CF\u25A0\u25B6\u27A4\u27A2]/g, '- ')
    // Normalize dashes and quotes
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, '-')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // Remove non-printable control characters (except newline, tab, cr)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize multiple horizontal spaces
    .replace(/[ \t]+/g, ' ')
    // Remove excessive consecutive blank lines
    .replace(/\n{3,}/g, '\n\n');
}

/**
 * Reconstructs natural reading order for multi-column and messy resumes using BoundingBox geometry.
 */
function reconstructReadingOrder(blocks: Block[]): { orderedText: string; hasColumns: boolean } {
  const lineBlocks = blocks.filter(b => b.BlockType === 'LINE' && b.Text && (b.Confidence ?? 100) >= 45);
  if (lineBlocks.length === 0) return { orderedText: '', hasColumns: false };

  // Group by page
  const pages = new Map<number, Block[]>();
  for (const block of lineBlocks) {
    const pageNum = block.Page || 1;
    if (!pages.has(pageNum)) pages.set(pageNum, []);
    pages.get(pageNum)!.push(block);
  }

  const fullDocumentLines: string[] = [];
  let detectedColumns = false;

  const sortedPages = Array.from(pages.keys()).sort((a, b) => a - b);
  for (const pageNum of sortedPages) {
    const pageBlocks = pages.get(pageNum)!;

    // Analyze horizontal layout to determine if this page is dual-column
    // In dual-column layouts, significant clusters of blocks have Left < 0.45 while others have Left >= 0.45
    const leftCol = pageBlocks.filter(b => (b.Geometry?.BoundingBox?.Left ?? 0) < 0.45);
    const rightCol = pageBlocks.filter(b => (b.Geometry?.BoundingBox?.Left ?? 0) >= 0.45);

    const isDualColumn = leftCol.length >= 4 && rightCol.length >= 4 &&
      // Check if left and right columns overlap substantially in vertical space (Top)
      leftCol.some(l => rightCol.some(r => Math.abs((l.Geometry?.BoundingBox?.Top ?? 0) - (r.Geometry?.BoundingBox?.Top ?? 0)) < 0.05));

    if (isDualColumn) {
      detectedColumns = true;
      // Sort left column top to bottom, then right column top to bottom
      leftCol.sort((a, b) => (a.Geometry?.BoundingBox?.Top ?? 0) - (b.Geometry?.BoundingBox?.Top ?? 0));
      rightCol.sort((a, b) => (a.Geometry?.BoundingBox?.Top ?? 0) - (b.Geometry?.BoundingBox?.Top ?? 0));

      for (const b of leftCol) if (b.Text) fullDocumentLines.push(b.Text);
      fullDocumentLines.push(''); // Section separator between columns
      for (const b of rightCol) if (b.Text) fullDocumentLines.push(b.Text);
    } else {
      // Standard single column: sort strictly by Top vertical position
      pageBlocks.sort((a, b) => {
        const topA = a.Geometry?.BoundingBox?.Top ?? 0;
        const topB = b.Geometry?.BoundingBox?.Top ?? 0;
        if (Math.abs(topA - topB) > 0.008) return topA - topB;
        return (a.Geometry?.BoundingBox?.Left ?? 0) - (b.Geometry?.BoundingBox?.Left ?? 0);
      });
      for (const b of pageBlocks) if (b.Text) fullDocumentLines.push(b.Text);
    }
  }

  return {
    orderedText: fullDocumentLines.join('\n'),
    hasColumns: detectedColumns,
  };
}

/**
 * Asynchronous text detection for multi-page documents
 */
async function extractMultiPageAsync(bucket: string, key: string): Promise<Block[]> {
  const startCmd = new StartDocumentTextDetectionCommand({
    DocumentLocation: {
      S3Object: {
        Bucket: bucket,
        Name: key,
      },
    },
  });

  const startRes = await textractClient.send(startCmd);
  const jobId = startRes.JobId;
  if (!jobId) {
    throw new Error('Failed to start asynchronous Textract detection: no JobId received.');
  }

  // Poll for completion with progressive backoff (max 35 seconds)
  const maxAttempts = 15;
  let delayMs = 1500;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, delayMs));

    let nextToken: string | undefined = undefined;
    const allBlocks: Block[] = [];

    do {
      const getCmd: GetDocumentTextDetectionCommand = new GetDocumentTextDetectionCommand({
        JobId: jobId,
        NextToken: nextToken,
      });

      const getRes = await textractClient.send(getCmd);
      const status = getRes.JobStatus;

      if (status === 'FAILED') {
        throw new Error(`Textract async job failed: ${getRes.StatusMessage || 'Unknown error'}`);
      }

      if (status === 'SUCCEEDED') {
        if (getRes.Blocks) allBlocks.push(...getRes.Blocks);
        nextToken = getRes.NextToken;
      } else {
        // Still IN_PROGRESS, break pagination loop and wait next attempt
        break;
      }
    } while (nextToken);

    if (allBlocks.length > 0) {
      return allBlocks;
    }

    delayMs = Math.min(4000, delayMs + 500);
  }

  throw new Error('Asynchronous Textract job timed out after 35 seconds.');
}

/**
 * Extract text directly from an S3 document object using Amazon Textract
 * with automatic multi-page async fallback, geometric column sort, and OCR artifact cleaning.
 */
export async function extractTextFromS3Document(
  bucket: string,
  key: string
): Promise<TextExtractionResult> {
  if (!process.env.AWS_REGION && !process.env.AWS_DEFAULT_REGION && !REGION) {
    throw new Error('AWS credentials or region not configured for Textract');
  }

  let blocks: Block[] = [];
  let isMultiPage = false;

  // 1. Try synchronous single-page detection first for speed (1-3 seconds)
  try {
    const syncCommand = new DetectDocumentTextCommand({
      Document: {
        S3Object: {
          Bucket: bucket,
          Name: key,
        },
      },
    });
    const syncRes = await textractClient.send(syncCommand);
    blocks = syncRes.Blocks || [];
  } catch (syncError: any) {
    const errorName = syncError?.name || '';
    const errorMsg = syncError?.message || '';

    // If multi-page PDF, DetectDocumentText throws UnsupportedDocumentException
    if (
      errorName === 'UnsupportedDocumentException' ||
      errorMsg.includes('multi-page') ||
      errorMsg.includes('too many pages') ||
      key.toLowerCase().endsWith('.pdf')
    ) {
      console.info(`[Textract] Multi-page document detected for ${key}. Switching to asynchronous pipeline...`);
      isMultiPage = true;
      blocks = await extractMultiPageAsync(bucket, key);
    } else {
      throw syncError;
    }
  }

  if (!blocks || blocks.length === 0) {
    throw new Error('Textract detected no readable text. Document may be empty or corrupted image.');
  }

  // 2. Reconstruct column-aware reading order
  const { orderedText, hasColumns } = reconstructReadingOrder(blocks);

  // 3. Clean OCR noise, ligatures, and formatting
  const cleanedText = cleanOcrText(orderedText).trim();
  if (!cleanedText) {
    throw new Error('Textract detected no usable text after OCR noise filtering.');
  }

  // 4. Compute statistics
  let totalConfidence = 0;
  let countedBlocks = 0;
  let maxPage = 1;

  for (const block of blocks) {
    if (block.BlockType === 'LINE' && block.Text) {
      if (block.Confidence) {
        totalConfidence += block.Confidence;
        countedBlocks++;
      }
      if (block.Page && block.Page > maxPage) {
        maxPage = block.Page;
      }
    }
  }

  const lines = cleanedText.split('\n').filter(Boolean);

  return {
    text: cleanedText,
    lineCount: lines.length,
    confidenceAverage: countedBlocks > 0 ? Math.round(totalConfidence / countedBlocks) : 0,
    pageCount: maxPage,
    isMultiPage: maxPage > 1 || isMultiPage,
    hasTablesOrColumns: hasColumns,
  };
}
