import { Router } from 'express';
import { createQuiz, attemptQuiz, getAttempts, getStats } from '../controllers/quizController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { requireEnrollment } from '../middleware/requireEnrollment';

const router = Router();
router.post('/', authenticate, authorize('INSTRUCTOR'), createQuiz);
router.post('/:id/attempt', authenticate, requireEnrollment, attemptQuiz);
router.get('/:id/attempts', authenticate, requireEnrollment, getAttempts);
router.get('/:id/stats', authenticate, authorize('INSTRUCTOR'), getStats);
export default router;
