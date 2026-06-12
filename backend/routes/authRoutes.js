import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  resetPasswordWithOtp
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/reset-password-otp', resetPasswordWithOtp);

// Protected Routes - Login Required
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router; // ✅ Ye line sabse important hai, iske bina crash hoga