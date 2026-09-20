import { Router } from 'express';
import {
  getStudentProfile,
  saveOnboarding,
  getSkillGapAnalysis,
  getPersonalizedRoadmap,
  askAiTutor,
  getCodingProblems,
  getCodingProblem,
  submitCodingSolution,
  getPlaygroundStats,
  getPlaygroundCategories,
  getAdaptiveQuiz,
  submitAdaptiveQuiz,
  getDueRevisions,
  completeRevision,
  getProjects,
  submitProject,
  analyzeResume,
  getResumeHistory,
  getResumeVersions,
  saveResumeVersion,
  startInterview,
  respondInterview,
  getInterviewHistory,
  addSkillsToProfile,
  getDailyChallenge,
  getArenaLeaderboard,
  getStudyRooms,
  postStudyMessage,
  aiGenerateCourse,
  getCourseQualityReport,
  getCareerCopilotAdvice,
  getDailyMission,
  completeMissionTask,
  getMistakeMemory,
  getLearningDna
} from '../controllers/adaptiveController';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

// Student Profile & Onboarding
router.get('/profile', authenticate, getStudentProfile);
router.post('/onboarding', authenticate, saveOnboarding);

// Skill Gap & Roadmap
router.get('/skills/gap-analysis', authenticate, getSkillGapAnalysis);
router.get('/roadmap', authenticate, getPersonalizedRoadmap);

// AI Tutor
router.post('/ai/tutor', authenticate, askAiTutor);

// Coding Playground
router.get('/coding/categories', getPlaygroundCategories);
router.get('/coding/stats', optionalAuthenticate, getPlaygroundStats);
router.get('/coding/problems', optionalAuthenticate, getCodingProblems);
router.get('/coding/problems/:slug', optionalAuthenticate, getCodingProblem);
router.post('/coding/submit', authenticate, submitCodingSolution);

// Adaptive Quizzes
router.get('/quizzes/adaptive/:quizId', authenticate, getAdaptiveQuiz);
router.post('/quizzes/adaptive/submit', authenticate, submitAdaptiveQuiz);

// Spaced Repetition / Revisions
router.get('/revisions/due', authenticate, getDueRevisions);
router.post('/revisions/:id/complete', authenticate, completeRevision);

// Projects & AI Evaluation
router.get('/projects', authenticate, getProjects);
router.post('/projects/submit', authenticate, submitProject);

import multer from 'multer';
import {
  getResumeUploadUrl,
  processUploadedResume,
  getResumeStatus,
  getUploadedResumes,
  deleteUploadedResume,
  uploadDirectResume,
  uploadAndAnalyzeResumeDirect,
  resumeUploadMiddleware,
  getResumeCapabilities
} from '../controllers/resumeAwsController';

// Direct PDF Upload Multer Config (Memory storage, 10MB limit, strictly application/pdf)
const directPdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      const err = new Error('Invalid file format. Only PDF documents (.pdf) are supported for direct upload.');
      (err as any).status = 400;
      return cb(err);
    }
    cb(null, true);
  }
}).single('file');

const wrappedDirectUploadMiddleware = (req: any, res: any, next: any) => {
  directPdfUpload(req, res, (err: any) => {
    if (err) {
      const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 400 : 400);
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'File size exceeds 10MB limit.'
        : err.message || 'File upload error.';
      return res.status(status).json({ message, error: message });
    }
    next();
  });
};

// AI Resume Analysis, Uploads & Versions
router.get('/resume/capabilities', optionalAuthenticate, getResumeCapabilities);
router.post('/resume/upload-direct', authenticate, wrappedDirectUploadMiddleware, uploadAndAnalyzeResumeDirect);
router.post('/resume/upload', authenticate, resumeUploadMiddleware, uploadDirectResume);
router.post('/resume/upload-url', authenticate, getResumeUploadUrl);
router.post('/resume/process-s3', authenticate, processUploadedResume);
router.get('/resume/status/:resumeId', authenticate, getResumeStatus);
router.get('/resume/list', authenticate, getUploadedResumes);
router.delete('/resume/:resumeId', authenticate, deleteUploadedResume);
router.post('/resume/analyze', authenticate, analyzeResume);
router.get('/resume/history', authenticate, getResumeHistory);
router.get('/resume/versions', authenticate, getResumeVersions);
router.post('/resume/versions', authenticate, saveResumeVersion);
router.post('/profile/add-skills', authenticate, addSkillsToProfile);

// AI Interview Simulator & History
router.post('/interview/start', authenticate, startInterview);
router.post('/interview/respond', authenticate, respondInterview);
router.get('/interview/history', authenticate, getInterviewHistory);

// Daily Challenge & Arena
router.get('/daily-challenge', authenticate, getDailyChallenge);
router.get('/arena/leaderboard', authenticate, getArenaLeaderboard);

// Study Rooms
router.get('/study-rooms', authenticate, getStudyRooms);
router.post('/study-rooms/message', authenticate, postStudyMessage);

// Instructor AI Assistant & Quality
router.post('/instructor/ai/generate-course', authenticate, authorize('INSTRUCTOR'), aiGenerateCourse);
router.get('/instructor/course-quality/:courseId', authenticate, authorize('INSTRUCTOR'), getCourseQualityReport);

// Signature AI & Adaptive Features
router.post('/copilot/advice', authenticate, getCareerCopilotAdvice);
router.get('/mission/daily', authenticate, getDailyMission);
router.post('/mission/complete-task', authenticate, completeMissionTask);
router.get('/learning/mistake-memory', authenticate, getMistakeMemory);
router.get('/learning/dna', authenticate, getLearningDna);

export default router;
