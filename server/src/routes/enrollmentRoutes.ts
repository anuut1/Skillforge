import { Router } from 'express';
import { getMyEnrollments } from '../controllers/enrollmentController';
import { authenticate } from '../middleware/authenticate';

const router = Router();
router.get('/my', authenticate, getMyEnrollments);
export default router;
