import express from 'express';
import {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  uploadCompletedDesign,
} from '../controllers/orderController.js';
import { protect, admin, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// ✅ Razorpay ka saara logic ab controller mein hai (demo mode ke saath).
// Isse route file mein alag se "new Razorpay" banane ki zaroorat nahi, aur server crash nahi hota.

// CREATE RAZORPAY ORDER
router.post('/create-razorpay-order', protect, createRazorpayOrder);

// VERIFY PAYMENT
router.post('/verify-payment', protect, verifyPayment);

// Customer - order create (createOrder khud response nahi bhejta, isliye yahan wrap kiya)
router.post('/', protect, upload.array('photos', 20), async (req, res, next) => {
  try {
    const order = await createOrder(req);
    res.status(201).json({ success: true, order });
  } catch (e) {
    next(e);
  }
});

// Customer - own orders only
router.get('/my', protect, getMyOrders);

// Admin - all orders
router.get('/', admin, getAllOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id/status', adminOnly, updateOrderStatus);
router.post('/:id/design', adminOnly, upload.single('design'), uploadCompletedDesign);

export default router;