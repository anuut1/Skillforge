import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { extractTextFromS3Document } from '../lib/textract';
import { analyzeResumeWithBedrockOrFallback } from './bedrockAiService';
import { publishDomainEvent } from '../lib/messaging';
import prisma from '../lib/prisma';

const REGION = process.env.AWS_REGION || process.env.COGNITO_REGION || 'ap-south-1';
const QUEUE_URL = process.env.SQS_RESUME_QUEUE_URL || '';

const sqsClient = new SQSClient({ region: REGION });

let isRunning = false;

export async function processQueueMessage(message: any) {
  if (!message.Body) return;

  let payload: any;
  try {
    payload = JSON.parse(message.Body);
  } catch (err) {
    console.error('[Worker] Malformed SQS message JSON:', message.Body);
    return;
  }

  const {
    resumeId,
    userId,
    s3Bucket,
    s3Key,
    fileName,
    targetRole = 'Software Engineer',
    jobDescription = '',
  } = payload;

  if (!userId || !s3Key) {
    console.warn('[Worker] SQS message missing required userId or s3Key:', payload);
    return;
  }

  console.info(`[Worker] Processing resume analysis for user=${userId}, resumeId=${resumeId || 'new'}, file=${fileName}`);

  // Update status to PROCESSING
  if (resumeId) {
    await prisma.resumeRecord.update({
      where: { resumeId },
      data: {
        uploadStatus: 'UPLOADED',
        analysisStatus: 'PROCESSING',
      }
    }).catch(() => {});
  }

  try {
    // 1. Text Extraction: Textract / DOCX / PDF
    const textractResult = await extractTextFromS3Document(s3Bucket, s3Key);
    const extractedText = textractResult.text;

    if (!extractedText) {
      throw new Error('No readable text could be extracted from document.');
    }

    // 2. AI Analysis: Amazon Bedrock Claude 3 / Heuristic engine
    const analysis = await analyzeResumeWithBedrockOrFallback(extractedText, targetRole, jobDescription);

    // 3. Save Analysis Record
    const savedRecord = await prisma.resumeAnalysis.create({
      data: {
        userId,
        targetRole: analysis.targetRole,
        jobTitle: analysis.jobTitle,
        companyName: analysis.companyName,
        resumeVersionName: fileName || 'Uploaded Resume',
        resumeText: extractedText,
        jobDescription: jobDescription || '',
        atsScore: analysis.atsScore,
        skillsMatchScore: analysis.skillsMatchScore,
        experienceMatchScore: analysis.experienceMatchScore,
        keywordMatchScore: analysis.keywordMatchScore,
        projectMatchScore: analysis.projectMatchScore,
        atsFormattingScore: analysis.atsFormattingScore,
        jobBreakdown: JSON.stringify(analysis.jobBreakdown),
        matchingSkills: JSON.stringify(analysis.matchingSkills),
        missingSkills: JSON.stringify(analysis.missingSkills),
        partialSkills: JSON.stringify(analysis.partialSkills),
        atsIssues: JSON.stringify(analysis.atsIssues),
        keywordOptimization: JSON.stringify(analysis.keywordOptimization),
        sectionFeedback: JSON.stringify(analysis.sectionFeedback),
        fixerSuggestions: JSON.stringify(analysis.fixerSuggestions),
        scoreDrivers: JSON.stringify(analysis.scoreDrivers || []),
      }
    });

    // 4. Update ResumeRecord status
    if (resumeId) {
      await prisma.resumeRecord.update({
        where: { resumeId },
        data: {
          uploadStatus: 'COMPLETED',
          analysisStatus: 'COMPLETED',
          analysisId: savedRecord.id,
          extractedText,
          errorMessage: null,
        }
      }).catch(() => {});
    }

    // 5. Emit EventBridge Domain Event
    await publishDomainEvent('resume', 'ResumeAnalyzed', {
      userId,
      resumeId,
      analysisId: savedRecord.id,
      atsScore: analysis.atsScore,
      skillsMatchScore: analysis.skillsMatchScore,
    }).catch(() => {});

    console.info(`[Worker] Successfully processed resumeId=${resumeId} (atsScore=${analysis.atsScore})`);
  } catch (procErr: any) {
    console.error(`[Worker] Processing failed for resumeId=${resumeId}:`, procErr.message);
    if (resumeId) {
      await prisma.resumeRecord.update({
        where: { resumeId },
        data: {
          analysisStatus: 'FAILED',
          errorMessage: procErr.message || 'Processing failed',
        }
      }).catch(() => {});
    }
  }
}

/**
 * Continuously polls SQS queue for incoming resume processing messages
 */
export async function startResumeQueueWorker() {
  if (!QUEUE_URL) {
    console.warn('[Worker] SQS_RESUME_QUEUE_URL not defined. Worker polling disabled.');
    return;
  }

  if (isRunning) return;
  isRunning = true;
  console.info(`[Worker] SQS Resume Worker started. Polling queue: ${QUEUE_URL}`);

  while (isRunning) {
    try {
      const receiveCmd = new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 10, // Long polling
        VisibilityTimeout: 300, // 5 minutes processing window
      });

      const response = await sqsClient.send(receiveCmd);
      if (response.Messages && response.Messages.length > 0) {
        for (const msg of response.Messages) {
          try {
            await processQueueMessage(msg);
            // Remove from queue after successful execution
            if (msg.ReceiptHandle) {
              await sqsClient.send(new DeleteMessageCommand({
                QueueUrl: QUEUE_URL,
                ReceiptHandle: msg.ReceiptHandle,
              }));
            }
          } catch (itemErr: any) {
            console.error('[Worker] Error processing message item:', itemErr);
          }
        }
      }
    } catch (pollErr: any) {
      // Prevent rapid error loops if network or permissions fail
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

export function stopResumeQueueWorker() {
  isRunning = false;
}
