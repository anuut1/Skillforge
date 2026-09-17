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

import { getResumeUploadUrl, processUploadedResume } from '../controllers/resumeAwsController';

// AI Resume Analysis & Versions
router.post('/resume/upload-url', authenticate, getResumeUploadUrl);
router.post('/resume/process-s3', authenticate, processUploadedResume);
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
