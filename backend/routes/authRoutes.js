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
import { protect } from '../middleware/auth.js'; // agar middleware hai to

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); 
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/reset-password-otp', resetPasswordWithOtp);

export default router;