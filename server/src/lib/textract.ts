import {
  TextractClient,
  DetectDocumentTextCommand,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand,
} from '@aws-sdk/client-textract';

const REGION = process.env.AWS_REGION || process.env.COGNITO_REGION || 'ap-south-1';

export const textractClient = new TextractClient({
  region: REGION,
});

export interface TextExtractionResult {
  text: string;
  lineCount: number;
  confidenceAverage: number;
}

/**
 * Extract text directly from an S3 document object using Amazon Textract
 */
export async function extractTextFromS3Document(
  bucket: string,
  key: string
): Promise<TextExtractionResult> {
  if (!process.env.AWS_REGION && !process.env.AWS_DEFAULT_REGION) {
    throw new Error('AWS credentials or region not configured for Textract');
  }

  const command = new DetectDocumentTextCommand({
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: key,
      },
    },
  });

  const response = await textractClient.send(command);

  const lines: string[] = [];
  let totalConfidence = 0;
  let blockCount = 0;

  for (const block of response.Blocks || []) {
    if (block.BlockType === 'LINE' && block.Text) {
      lines.push(block.Text);
      if (block.Confidence) {
        totalConfidence += block.Confidence;
        blockCount++;
      }
    }
  }

  const text = lines.join('\n').trim();
  if (!text) {
    throw new Error('Textract detected no readable text. Document may be empty or corrupted image.');
  }

  return {
    text,
    lineCount: lines.length,
    confidenceAverage: blockCount > 0 ? totalConfidence / blockCount : 0,
  };
}
