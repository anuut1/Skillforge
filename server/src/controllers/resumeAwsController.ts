import { Request, Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { generateResumeUploadUrl, generateDocumentDownloadUrl, isS3Configured } from '../lib/s3';
import { extractTextFromS3Document } from '../lib/textract';
import { isBedrockConfigured } from '../lib/bedrock';
import { queueResumeAnalysisJob, publishDomainEvent } from '../lib/messaging';
import { analyzeResumeWithBedrockOrFallback } from '../services/bedrockAiService';
import { extractTextFromPdfBuffer } from '../lib/pdfExtractor';
import { extractTextFromDocxBuffer } from '../lib/docxExtractor';
import prisma from '../lib/prisma';
import crypto from 'crypto';

const uploadStorage = multer.memoryStorage();
export const resumeUploadMiddleware = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
}).single('file');

/**
 * Request a presigned upload URL for direct S3 upload and initialize database record
 * POST /api/resume/upload-url
 */
export async function getResumeUploadUrl(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { fileName, contentType = 'application/pdf', fileSize = 0 } = req.body;
    if (!fileName) {
      return res.status(400).json({ message: 'fileName is required' });
    }

    // Supported formats: PDF, DOCX, DOC
    const lowerName = fileName.toLowerCase();
    const isSupported = lowerName.endsWith('.pdf') || lowerName.endsWith('.docx') || lowerName.endsWith('.doc');
    if (!isSupported) {
      return res.status(400).json({ message: 'Unsupported file type. Please upload a PDF or DOCX document.' });
    }

    // Size limit: 5MB
    const MAX_BYTES = 5 * 1024 * 1024;
    if (fileSize && fileSize > MAX_BYTES) {
      return res.status(400).json({ message: `File size exceeds 5MB limit (${(fileSize / (1024 * 1024)).toFixed(1)}MB).` });
    }

    const resumeId = `res_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const presigned = await generateResumeUploadUrl(userId, fileName, contentType, resumeId);

    // Create tracking record in database
    const record = await prisma.resumeRecord.create({
      data: {
        resumeId,
        userId,
        filename: fileName,
        s3Key: presigned.s3Key,
        fileType: contentType,
        fileSize: fileSize || 0,
        uploadStatus: 'UPLOADING',
        analysisStatus: 'PENDING',
      }
    });

    // Record initial metadata event
    await publishDomainEvent('resume', 'ResumeUploaded', {
      resumeId,
      userId,
      fileName,
      s3Key: presigned.s3Key,
      bucket: presigned.bucket,
    }).catch(() => {});

    res.json({
      ...presigned,
      resumeId: record.resumeId,
      uploadStatus: record.uploadStatus,
      analysisStatus: record.analysisStatus
    });
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

    const {
      resumeId: clientResumeId,
      s3Key,
      bucket,
      fileName,
      targetRole = 'Software Engineer',
      jobDescription = '',
      asyncMode = false
    } = req.body;

    if (!s3Key) {
      return res.status(400).json({ message: 's3Key is required' });
    }

    // Enforce isolation: ensure s3Key belongs to this authenticated user
    if (!s3Key.startsWith(`users/${userId}/`) && !s3Key.startsWith(`resumes/${userId}/`)) {
      return res.status(403).json({ message: 'Forbidden: Access to another user\'s resume is strictly prohibited.' });
    }

    const targetBucket = bucket || process.env.S3_USER_DATA_BUCKET || 'skillforge-user-data-prod';
    const effectiveResumeId = clientResumeId || `res_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Upsert tracking record
    await prisma.resumeRecord.upsert({
      where: { resumeId: effectiveResumeId },
      update: {
        uploadStatus: 'UPLOADED',
        analysisStatus: 'PROCESSING',
        targetRole,
        jobDescription
      },
      create: {
        resumeId: effectiveResumeId,
        userId,
        filename: fileName || 'Uploaded Resume',
        s3Key,
        fileType: fileName?.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf',
        fileSize: 0,
        uploadStatus: 'UPLOADED',
        analysisStatus: 'PROCESSING',
        targetRole,
        jobDescription
      }
    });

    // If asyncMode is true, enqueue to SQS and return immediately
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
        resumeId: effectiveResumeId,
        status: 'PROCESSING',
        s3Key,
      });
    }

    // Synchronous execution: Textract / DOCX -> Bedrock / Heuristic -> Database
    let extractedText = '';
    try {
      const textractResult = await extractTextFromS3Document(targetBucket, s3Key);
      extractedText = textractResult.text;
    } catch (textractError: any) {
      console.warn('[Textract] Extraction failed:', textractError.message);
      await prisma.resumeRecord.update({
        where: { resumeId: effectiveResumeId },
        data: {
          analysisStatus: 'FAILED',
          errorMessage: textractError.message || 'Failed to extract text from document.'
        }
      }).catch(() => {});

      return res.status(422).json({
        message: 'Failed to extract text from the document. Please ensure the file is a readable PDF or DOCX.',
        error: textractError.message,
      });
    }

    // Pass extracted text to Bedrock (Claude 3) or fallback
    let analysis;
    try {
      analysis = await analyzeResumeWithBedrockOrFallback(extractedText, targetRole, jobDescription);
    } catch (aiErr: any) {
      await prisma.resumeRecord.update({
        where: { resumeId: effectiveResumeId },
        data: {
          analysisStatus: 'FAILED',
          errorMessage: aiErr.message || 'AI analysis failed.'
        }
      }).catch(() => {});

      return res.status(500).json({
        message: 'Failed to complete AI resume analysis.',
        error: aiErr.message
      });
    }

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
        scoreDrivers: JSON.stringify(analysis.scoreDrivers || []),
      },
    });

    // Update resume record to COMPLETED
    await prisma.resumeRecord.update({
      where: { resumeId: effectiveResumeId },
      data: {
        uploadStatus: 'COMPLETED',
        analysisStatus: 'COMPLETED',
        analysisId: savedRecord.id,
        extractedText
      }
    }).catch(() => {});

    await publishDomainEvent('resume', 'ResumeAnalyzed', {
      userId,
      resumeId: effectiveResumeId,
      analysisId: savedRecord.id,
      atsScore: analysis.atsScore,
      skillsMatchScore: analysis.skillsMatchScore,
    }).catch(() => {});

    res.json({
      ...analysis,
      id: savedRecord.id,
      resumeId: effectiveResumeId,
      createdAt: savedRecord.createdAt,
      extractedText,
      status: 'COMPLETED'
    });
  } catch (error: any) {
    console.error('Error processing uploaded resume:', error);
    res.status(500).json({ message: 'Error processing resume', error: error.message });
  }
}

/**
 * Get status of a resume processing record
 * GET /api/resume/status/:resumeId
 */
export async function getResumeStatus(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { resumeId } = req.params;

    const record = await prisma.resumeRecord.findUnique({
      where: { resumeId }
    });

    if (!record) {
      return res.status(404).json({ message: 'Resume record not found' });
    }

    if (record.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    let analysis = null;
    if (record.analysisId) {
      analysis = await prisma.resumeAnalysis.findUnique({
        where: { id: record.analysisId }
      });
    }

    res.json({
      record,
      analysis
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Error checking status', error: err.message });
  }
}

/**
 * List all uploaded resumes for the current authenticated user
 * GET /api/resume/list
 */
export async function getUploadedResumes(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const records = await prisma.resumeRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json(records);
  } catch (err: any) {
    res.status(500).json({ message: 'Error retrieving uploaded resumes', error: err.message });
  }
}

/**
 * Delete an uploaded resume (owner only)
 * DELETE /api/resume/:resumeId
 */
export async function deleteUploadedResume(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { resumeId } = req.params;

    const record = await prisma.resumeRecord.findUnique({
      where: { resumeId }
    });

    if (!record) {
      return res.status(404).json({ message: 'Resume record not found' });
    }

    if (record.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.resumeRecord.delete({
      where: { resumeId }
    });

    res.json({ message: 'Resume record deleted successfully', resumeId });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting resume', error: err.message });
  }
}

/**
 * Extract clean, plain text from buffer using PDF/DOCX parsers
 */
export async function extractTextFromBuffer(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const lowerName = filename.toLowerCase();

  if (mimeType.includes('pdf') || lowerName.endsWith('.pdf')) {
    try {
      const pdfParser = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any).default || (pdfParse as any);
      const parsed = await pdfParser(buffer);
      const text = parsed?.text?.trim() || '';
      if (!text || text.startsWith('%PDF-') || text.length < 20) {
        throw new Error('PDF document contained no searchable plain text (scanned or image-only).');
      }
      return text;
    } catch (err: any) {
      throw new Error(`PDF extraction failed for ${filename}: ${err.message || 'Corrupted or unreadable PDF'}`);
    }
  }

  if (mimeType.includes('word') || mimeType.includes('docx') || lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
    try {
      const parsed = await mammoth.extractRawText({ buffer });
      const text = parsed?.value?.trim() || '';
      if (!text || text.length < 20) {
        throw new Error('Word document contained no extractable text.');
      }
      return text;
    } catch (err: any) {
      throw new Error(`DOCX extraction failed for ${filename}: ${err.message || 'Corrupted document'}`);
    }
  }

  // For plain text files (.txt, .md)
  const text = buffer.toString('utf-8');
  if (text.startsWith('%PDF-') || text.includes('\0')) {
    throw new Error('File contains unreadable binary content.');
  }
  return text;
}

/**
 * Direct file upload handler (with memory buffer parsing and Bedrock/heuristic fallback)
 * POST /api/resume/upload
 */
export async function uploadDirectResume(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const file = req.file || (req as any).files?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded. Expected multipart form field "file".' });
    }

    const { targetRole = 'Software Engineer', jobDescription = '' } = req.body;
    const fileName = file.originalname || 'Uploaded_Resume.pdf';
    const mimeType = file.mimetype || 'application/pdf';

    const extractedText = await extractTextFromBuffer(file.buffer, mimeType, fileName);
    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(422).json({
        message: 'Could not extract readable text from document. Please ensure the document contains searchable text.'
      });
    }

    const effectiveResumeId = `res_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const analysis = await analyzeResumeWithBedrockOrFallback(extractedText, targetRole, jobDescription);

    const savedRecord = await prisma.resumeAnalysis.create({
      data: {
        userId,
        targetRole: analysis.targetRole,
        jobTitle: analysis.jobTitle,
        companyName: analysis.companyName,
        resumeVersionName: fileName,
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
      },
    });

    await prisma.resumeRecord.create({
      data: {
        resumeId: effectiveResumeId,
        userId,
        filename: fileName,
        s3Key: `direct-uploads/${userId}/${fileName}`,
        fileType: mimeType,
        fileSize: file.size || 0,
        uploadStatus: 'COMPLETED',
        analysisStatus: 'COMPLETED',
        analysisId: savedRecord.id,
        extractedText,
        targetRole,
        jobDescription
      }
    }).catch(() => {});

    await publishDomainEvent('resume', 'ResumeAnalyzed', {
      userId,
      resumeId: effectiveResumeId,
      analysisId: savedRecord.id,
      atsScore: analysis.atsScore,
      skillsMatchScore: analysis.skillsMatchScore,
    }).catch(() => {});

    res.json({
      ...analysis,
      id: savedRecord.id,
      resumeId: effectiveResumeId,
      createdAt: savedRecord.createdAt,
      extractedText,
      status: 'COMPLETED'
    });
  } catch (error: any) {
    console.error('Error during direct resume upload:', error);
    res.status(500).json({ message: 'Error processing resume upload', error: error.message });
  }
}

/**
 * Direct file upload handler strictly using extractTextFromPdfBuffer (AWS independent)
 * POST /api/resume/upload-direct
 */
export async function uploadAndAnalyzeResumeDirect(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const file = req.file || (req as any).files?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded. Expected multipart form field "file".' });
    }

    const { targetRole = 'Software Engineer', jobDescription = '' } = req.body;
    const fileName = file.originalname || 'Uploaded_Resume.pdf';
    const lowerName = fileName.toLowerCase();
    const mime = file.mimetype || '';

    // Validate PDF or DOCX mime type / extension
    const isPdf = mime === 'application/pdf' || lowerName.endsWith('.pdf');
    const isDocx = mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   mime === 'application/msword' ||
                   lowerName.endsWith('.docx') ||
                   lowerName.endsWith('.doc');

    if (!isPdf && !isDocx) {
      return res.status(400).json({
        message: 'Invalid file format. Only PDF documents (.pdf) and Word documents (.docx) are supported for direct upload.'
      });
    }

    let extractedText = '';
    try {
      if (isPdf) {
        extractedText = await extractTextFromPdfBuffer(file.buffer);
      } else {
        extractedText = await extractTextFromDocxBuffer(file.buffer);
      }
    } catch (parseErr: any) {
      return res.status(422).json({
        message: parseErr.message || `Could not extract readable text from ${isPdf ? 'PDF' : 'Word (.docx)'} document.`,
        error: parseErr.message
      });
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(422).json({
        message: `${isPdf ? 'PDF' : 'Word (.docx)'} document contained no searchable plain text (scanned or image-only).`
      });
    }

    const effectiveResumeId = `res_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const analysis = await analyzeResumeWithBedrockOrFallback(extractedText, targetRole, jobDescription);

    const savedRecord = await prisma.resumeAnalysis.create({
      data: {
        userId,
        targetRole: analysis.targetRole,
        jobTitle: analysis.jobTitle,
        companyName: analysis.companyName,
        resumeVersionName: fileName,
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
      },
    });

    await prisma.resumeRecord.create({
      data: {
        resumeId: effectiveResumeId,
        userId,
        filename: fileName,
        s3Key: `direct-uploads/${userId}/${fileName}`,
        fileType: isPdf ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileSize: file.size || 0,
        uploadStatus: 'COMPLETED',
        analysisStatus: 'COMPLETED',
        analysisId: savedRecord.id,
        extractedText,
        targetRole,
        jobDescription
      }
    }).catch(() => {});

    await publishDomainEvent('resume', 'ResumeAnalyzed', {
      userId,
      resumeId: effectiveResumeId,
      analysisId: savedRecord.id,
      atsScore: analysis.atsScore,
      skillsMatchScore: analysis.skillsMatchScore,
    }).catch(() => {});

    res.json({
      ...analysis,
      id: savedRecord.id,
      resumeId: effectiveResumeId,
      createdAt: savedRecord.createdAt,
      extractedText,
      status: 'COMPLETED'
    });
  } catch (error: any) {
    console.error('Error in uploadAndAnalyzeResumeDirect:', error);
    res.status(500).json({ message: 'Error processing resume upload', error: error.message });
  }
}

/**
 * Get available resume upload & AI capabilities
 * GET /api/resume/capabilities
 */
export async function getResumeCapabilities(req: Request, res: Response) {
  res.json({
    directUploadSupported: true,
    s3UploadSupported: isS3Configured(),
    bedrockSupported: isBedrockConfigured()
  });
}
