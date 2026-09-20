import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION || process.env.COGNITO_REGION || 'ap-south-1';
const USER_DATA_BUCKET = process.env.S3_USER_DATA_BUCKET || 'skillforge-user-data-prod';

export const s3Client = new S3Client({
  region: REGION,
});

export interface PresignedUrlResult {
  uploadUrl: string;
  s3Key: string;
  bucket: string;
  expiresInSeconds: number;
}

/**
 * Generate a secure presigned PUT URL for client-side direct upload to S3
 * Strictly isolates keys by userId under users/{userId}/resumes/{resumeId}/{filename}
 */
export async function generateResumeUploadUrl(
  userId: string,
  fileName: string,
  contentType: string = 'application/pdf',
  customResumeId?: string
): Promise<PresignedUrlResult> {
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const resumeId = customResumeId || `res_${Date.now()}`;
  const s3Key = `users/${userId}/resumes/${resumeId}/${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: USER_DATA_BUCKET,
    Key: s3Key,
    ContentType: contentType,
    ServerSideEncryption: 'aws:kms',
    Metadata: {
      'uploaded-by': userId,
      'original-name': sanitizedFileName,
      'resume-id': resumeId,
    },
  });

  const expiresInSeconds = 900; // 15 minutes expiration
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });

  return {
    uploadUrl,
    s3Key,
    bucket: USER_DATA_BUCKET,
    expiresInSeconds,
  };
}

/**
 * Generate a secure presigned GET URL for downloading private documents
 */
export async function generateDocumentDownloadUrl(
  s3Key: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: USER_DATA_BUCKET,
    Key: s3Key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

export function isS3Configured(): boolean {
  return !!process.env.S3_USER_DATA_BUCKET;
}
