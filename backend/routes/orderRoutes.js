import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
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

router.use(protect); // sab routes protected

// ✅ RAZORPAY ROUTES - Naye add kiye

// 1. Create Razorpay Order + Save in DB
router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount, serviceId, ...orderData } = req.body;

    const options = {
      amount: amount * 100, // paise me
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // DB me save with razorpayOrderId
    const order = await createOrder({
      ...req,
      body: {
        ...orderData,
        serviceId,
        amount,
        razorpayOrderId: razorpayOrder.id,
        status: 'Created'
      }
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order._id
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Verify Payment after success
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment success - update order status
      await updateOrderStatus({
        params: { id: req.body.orderId },
        body: { status: 'Paid', razorpayPaymentId: razorpay_payment_id }
      }, res);
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer - own orders only
router.post('/', upload.array('photos', 20), createOrder);
router.get('/my', getMyOrders);

// Admin - all orders
router.get('/', admin, getAllOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', adminOnly, updateOrderStatus);
router.post('/:id/design', adminOnly, upload.single('design'), uploadCompletedDesign);

export default router;
