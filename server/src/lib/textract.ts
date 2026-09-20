import {
  TextractClient,
  DetectDocumentTextCommand,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand,
  Block,
} from '@aws-sdk/client-textract';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3';
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

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

async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Extract text directly from an S3 document object using Amazon Textract
 * with automatic multi-page async fallback, geometric column sort, OCR artifact cleaning,
 * native DOCX parser, and safe PDF fallback if Textract subscription is restricted.
 */
export async function extractTextFromS3Document(
  bucket: string,
  key: string
): Promise<TextExtractionResult> {
  const isDocx = key.toLowerCase().endsWith('.docx') || key.toLowerCase().endsWith('.doc');

  // DOCX files: Textract does not process OpenXML binary formats directly.
  // We stream from S3 and extract clean text using Mammoth.
  if (isDocx) {
    try {
      const getObjCmd = new GetObjectCommand({ Bucket: bucket, Key: key });
      const s3Obj = await s3Client.send(getObjCmd);
      const fileBuffer = await streamToBuffer(s3Obj.Body);
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      const cleaned = cleanOcrText(result.value).trim();
      const lines = cleaned.split('\n').filter(Boolean);
      return {
        text: cleaned,
        lineCount: lines.length,
        confidenceAverage: 98,
        pageCount: Math.max(1, Math.ceil(lines.length / 40)),
        isMultiPage: lines.length > 40,
        hasTablesOrColumns: false,
      };
    } catch (docxErr: any) {
      throw new Error(`Failed to extract text from DOCX file: ${docxErr.message}`);
    }
  }

  // PDF / Image Document processing via AWS Textract
  let blocks: Block[] = [];
  let isMultiPage = false;
  let textractFailed = false;

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
      try {
        console.info(`[Textract] Multi-page document detected for ${key}. Switching to asynchronous pipeline...`);
        isMultiPage = true;
        blocks = await extractMultiPageAsync(bucket, key);
      } catch (asyncErr: any) {
        console.warn(`[Textract] Async Textract failed: ${asyncErr.message}`);
        textractFailed = true;
      }
    } else {
      console.warn(`[Textract] Sync Textract returned error (${errorName}): ${errorMsg}`);
      textractFailed = true;
    }
  }

  // If Textract successfully retrieved text blocks
  if (!textractFailed && blocks && blocks.length > 0) {
    const { orderedText, hasColumns } = reconstructReadingOrder(blocks);
    const cleanedText = cleanOcrText(orderedText).trim();
    if (cleanedText) {
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
  }

  // Safe High-Precision Fallback for PDF text extraction from S3
  // Handles cases where AWS Textract requires explicit account activation/subscription
  try {
    console.info(`[DocumentParser] Extracting text directly from S3 document buffer for ${key}...`);
    const getObjCmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    const s3Obj = await s3Client.send(getObjCmd);
    const fileBuffer = await streamToBuffer(s3Obj.Body);
    const parsedPdf = await pdfParse(fileBuffer);
    const cleaned = cleanOcrText(parsedPdf.text).trim();
    const lines = cleaned.split('\n').filter(Boolean);
    if (!cleaned) {
      throw new Error('Document contained no readable text characters.');
    }
    return {
      text: cleaned,
      lineCount: lines.length,
      confidenceAverage: 95,
      pageCount: parsedPdf.numpages || 1,
      isMultiPage: (parsedPdf.numpages || 1) > 1,
      hasTablesOrColumns: false,
    };
  } catch (pdfErr: any) {
    throw new Error(`Failed to extract readable text from document: ${pdfErr.message}`);
  }
}
