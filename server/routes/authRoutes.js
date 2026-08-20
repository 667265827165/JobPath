import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  socialAuth,
  forgotPassword,
  resetPassword,
  sendVerification,
  verifyEmail,
} from '../controllers/authController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/social', socialAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/send-verification', optionalAuth, sendVerification);
router.post('/verify-email', optionalAuth, verifyEmail);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
