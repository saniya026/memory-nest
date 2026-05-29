import express from 'express';
import {
  getPublicReviews,
  getEligibleOrders,
  createReview,
  getAllReviewsAdmin,
  updateReviewStatus,
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPublicReviews);
router.get('/eligible', protect, getEligibleOrders);
router.post('/', protect, upload.single('photo'), createReview);

router.get('/admin/all', ...adminOnly, getAllReviewsAdmin);
router.patch('/admin/:id', ...adminOnly, updateReviewStatus);

export default router;
