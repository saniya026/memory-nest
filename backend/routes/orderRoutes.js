import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE RAZORPAY ORDER
router.post('/create-razorpay-order', protect, async (req, res) => {
  try {
    const { amount, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const options = {
      amount: Math.round(amount * 100), // paise me convert
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = await Order.create({
      user: req.user._id,
      items: items,
      totalAmount: amount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'created',
      status: 'created'
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order._id
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ message: err.message || 'Payment init failed' });
  }
});

// VERIFY PAYMENT
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
     .update(sign.toString())
     .digest('hex');

    if (razorpay_signature === expectedSign) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid'
      });
      return res.json({ success: true, message: 'Payment verified' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customer - own orders only
router.post('/', protect, upload.array('photos', 20), createOrder);
router.get('/my', protect, getMyOrders);

// Admin - all orders
router.get('/', admin, getAllOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', adminOnly, updateOrderStatus);
router.post('/:id/design', adminOnly, upload.single('design'), uploadCompletedDesign);

export default router;