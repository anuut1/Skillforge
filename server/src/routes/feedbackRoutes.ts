import { Router } from 'express';
import { submitRecommendationFeedback, getUserRecommendationFeedback } from '../controllers/feedbackController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/', authenticate, submitRecommendationFeedback);
router.get('/', authenticate, getUserRecommendationFeedback);

export default router;
