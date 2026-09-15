import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const REGION = process.env.AWS_REGION || process.env.COGNITO_REGION || 'ap-south-1';

export const sqsClient = new SQSClient({ region: REGION });
export const eventBridgeClient = new EventBridgeClient({ region: REGION });
export const snsClient = new SNSClient({ region: REGION });

const RESUME_QUEUE_URL = process.env.SQS_RESUME_QUEUE_URL || '';
const EVENT_BUS_NAME = process.env.EVENTBRIDGE_BUS_NAME || 'skillforge-events';
const NOTIFICATION_TOPIC_ARN = process.env.SNS_NOTIFICATION_TOPIC_ARN || '';

/**
 * Queue a resume extraction and Bedrock AI analysis job asynchronously
 */
export async function queueResumeAnalysisJob(payload: {
  userId: string;
  s3Bucket: string;
  s3Key: string;
  fileName: string;
  targetRole: string;
  jobDescription?: string;
  versionName?: string;
}) {
  if (!RESUME_QUEUE_URL) {
    console.warn('[SQS] SQS_RESUME_QUEUE_URL not configured. Running job synchronously or locally.');
    return null;
  }

  const command = new SendMessageCommand({
    QueueUrl: RESUME_QUEUE_URL,
    MessageBody: JSON.stringify({
      ...payload,
      timestamp: new Date().toISOString(),
    }),
    MessageAttributes: {
      userId: { DataType: 'String', StringValue: payload.userId },
      eventType: { DataType: 'String', StringValue: 'RESUME_UPLOADED' },
    },
  });

  return sqsClient.send(command);
}

/**
 * Publish domain events to EventBridge for decoupled async workflows
 */
export async function publishDomainEvent(
  source: string,
  detailType: 'ResumeUploaded' | 'ResumeAnalyzed' | 'DSAQuestionSolved' | 'CourseCompleted' | 'QuizCompleted' | 'InterviewCompleted' | 'SkillGapUpdated' | 'AchievementUnlocked',
  detail: Record<string, any>
) {
  if (!process.env.EVENTBRIDGE_BUS_NAME) {
    return null;
  }

  const command = new PutEventsCommand({
    Entries: [
      {
        Source: `skillforge.${source}`,
        DetailType: detailType,
        Detail: JSON.stringify(detail),
        EventBusName: EVENT_BUS_NAME,
        Time: new Date(),
      },
    ],
  });

  return eventBridgeClient.send(command);
}

/**
 * Send critical student alert or notification via Amazon SNS
 */
export async function sendNotificationMessage(subject: string, message: string, targetUserId?: string) {
  if (!NOTIFICATION_TOPIC_ARN) {
    return null;
  }

  const command = new PublishCommand({
    TopicArn: NOTIFICATION_TOPIC_ARN,
    Subject: subject,
    Message: message,
    MessageAttributes: targetUserId ? {
      userId: { DataType: 'String', StringValue: targetUserId },
    } : undefined,
  });

  return snsClient.send(command);
}
