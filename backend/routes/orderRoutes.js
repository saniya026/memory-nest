import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  uploadCompletedDesign,
} from '../controllers/orderController.js';
import { protect, admin, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

// Customer — own orders only
router.post('/', upload.array('photos', 20), createOrder);
router.get('/my', getMyOrders);

// Admin — all orders (before /:id)
router.get('/', admin, getAllOrders);

router.get('/:id', getOrder);
router.patch('/:id/status', ...adminOnly, updateOrderStatus);
router.post('/:id/design', ...adminOnly, upload.single('design'), uploadCompletedDesign);

export default router;
