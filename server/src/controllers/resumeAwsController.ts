import { Request, Response } from 'express';
import { generateResumeUploadUrl, generateDocumentDownloadUrl, isS3Configured } from '../lib/s3';
import { extractTextFromS3Document } from '../lib/textract';
import { queueResumeAnalysisJob, publishDomainEvent } from '../lib/messaging';
import { analyzeResumeWithBedrockOrFallback } from '../services/bedrockAiService';
import prisma from '../lib/prisma';

/**
 * Request a presigned upload URL for direct S3 upload
 * POST /api/resume/upload-url
 */
export async function getResumeUploadUrl(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { fileName, contentType = 'application/pdf' } = req.body;
    if (!fileName) {
      return res.status(400).json({ message: 'fileName is required' });
    }

    const presigned = await generateResumeUploadUrl(userId, fileName, contentType);

    // Record initial metadata in database
    await publishDomainEvent('resume', 'ResumeUploaded', {
      userId,
      fileName,
      s3Key: presigned.s3Key,
      bucket: presigned.bucket,
    }).catch(() => {});

    res.json(presigned);
  } catch (error: any) {
    console.error('Error generating resume upload URL:', error);
    res.status(500).json({ message: 'Could not generate upload URL', error: error.message });
  }
}

/**
 * Process a resume that has been uploaded to S3
 * POST /api/resume/process-s3
 */
export async function processUploadedResume(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { s3Key, bucket, fileName, targetRole = 'Software Engineer', jobDescription = '', asyncMode = false } = req.body;

    if (!s3Key) {
      return res.status(400).json({ message: 's3Key is required' });
    }

    const targetBucket = bucket || process.env.S3_USER_DATA_BUCKET || 'skillforge-user-data';

    // If asyncMode is true, enqueue to SQS and respond immediately
    if (asyncMode) {
      await queueResumeAnalysisJob({
        userId,
        s3Bucket: targetBucket,
        s3Key,
        fileName: fileName || 'Uploaded Resume',
        targetRole,
        jobDescription,
      });

      return res.status(202).json({
        message: 'Resume queued for asynchronous Textract and Bedrock processing.',
        status: 'PROCESSING',
        s3Key,
      });
    }

    // Synchronous execution: Textract -> Bedrock / Heuristic -> Database
    let extractedText = '';
    try {
      const textractResult = await extractTextFromS3Document(targetBucket, s3Key);
      extractedText = textractResult.text;
    } catch (textractError: any) {
      console.warn('[Textract] Textract extraction failed:', textractError.message);
      return res.status(422).json({
        message: 'Failed to extract text from the document. Please ensure the file is a clean, readable PDF.',
        error: textractError.message,
      });
    }

    const analysis = await analyzeResumeWithBedrockOrFallback(extractedText, targetRole, jobDescription);

    // Persist analysis to database
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
      },
    });

    await publishDomainEvent('resume', 'ResumeAnalyzed', {
      userId,
      analysisId: savedRecord.id,
      atsScore: analysis.atsScore,
      skillsMatchScore: analysis.skillsMatchScore,
    }).catch(() => {});

    res.json({
      ...analysis,
      id: savedRecord.id,
      createdAt: savedRecord.createdAt,
      extractedText,
    });
  } catch (error: any) {
    console.error('Error processing uploaded resume:', error);
    res.status(500).json({ message: 'Error processing resume', error: error.message });
  }
}
