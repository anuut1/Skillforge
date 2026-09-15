import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  getNotifications,
  markNotificationRead,
  forgotPassword,
  resetPassword
} from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.get('/notifications', authenticate, getNotifications);
router.patch('/notifications/:id/read', authenticate, markNotificationRead);
export default router;

