import { Router } from 'express';
import { getLectures, getLecture, createLecture } from '../controllers/lectureController';
import { getLectureQuiz } from '../controllers/quizController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { requireEnrollment } from '../middleware/requireEnrollment';

const router = Router({ mergeParams: true });
router.get('/', authenticate, requireEnrollment, getLectures);
router.get('/:id', authenticate, requireEnrollment, getLecture);
router.post('/', authenticate, authorize('INSTRUCTOR'), createLecture);
router.get('/:lectureId/quiz', authenticate, requireEnrollment, getLectureQuiz);
export default router;
