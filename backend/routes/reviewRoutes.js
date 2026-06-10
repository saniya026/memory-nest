import express from 'express';
import {
  createReview,
  getAllReviews,
  getMyReviews,
  replyToReview,
  toggleReviewApproval
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getAllReviews);

// Customer
router.post('/', protect, createReview);
router.get('/my', protect, getMyReviews);

// Admin
router.patch('/:id/reply', protect, admin, replyToReview);
router.patch('/:id/toggle', protect, admin, toggleReviewApproval);

export default router;