import express from 'express';
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  getUserProfile, // ← add kiya
  updateUserProfile // ← add kiya
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Profile routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Address routes
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.patch('/addresses/:addressId/default', protect, setDefaultAddress);

export default router;