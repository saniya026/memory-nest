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

import {
  protect,
  adminOnly,
} from '../middleware/auth.js';

import { upload } from '../middleware/upload.js';

const router = express.Router();

// ==========================================
// RAZORPAY
// ==========================================

router.post(
  '/create-razorpay-order',
  protect,
  createRazorpayOrder
);

router.post(
  '/verify-payment',
  protect,
  verifyPayment
);

// ==========================================
// CUSTOMER - CREATE ORDER
// ==========================================

router.post(
  '/',
  protect,
  upload.array('photos', 20),
  async (req, res, next) => {
    try {
      const order = await createOrder(req);

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// CUSTOMER - MY ORDERS
// ==========================================

router.get(
  '/my',
  protect,
  getMyOrders
);

// ==========================================
// ADMIN - ALL ORDERS
// ==========================================

router.get(
  '/',
  adminOnly,
  getAllOrders
);

// ==========================================
// SINGLE ORDER
// ==========================================

router.get(
  '/:id',
  protect,
  getOrder
);

// ==========================================
// ADMIN - UPDATE STATUS
// ==========================================

router.patch(
  '/:id/status',
  adminOnly,
  updateOrderStatus
);

// ==========================================
// ADMIN - UPLOAD DESIGN
// ==========================================

router.post(
  '/:id/design',
  adminOnly,
  upload.single('design'),
  uploadCompletedDesign
);

export default router;