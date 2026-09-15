import { Router } from 'express';
import { getCourses, getCourse, createCourse, updateCourse, enroll, getCourseCategories } from '../controllers/courseController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();
router.get('/categories', getCourseCategories);
router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', authenticate, authorize('INSTRUCTOR'), createCourse);
router.put('/:id', authenticate, authorize('INSTRUCTOR'), updateCourse);
router.post('/:id/enroll', authenticate, authorize('STUDENT'), enroll);
export default router;
