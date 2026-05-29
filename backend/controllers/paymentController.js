import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { AppError } from '../middleware/errorHandler.js';

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    if (order.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.json({
        success: true,
        demo: true,
        orderId: order._id,
        amount: order.amount,
        currency: 'INR',
        message: 'Configure RAZORPAY keys for live payments. Use demo verify endpoint.',
      });
    }

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(order.amount * 100),
      currency: 'INR',
      receipt: `order_${order._id}`,
    });

    const payment = await Payment.create({
      user: req.user._id,
      order: order._id,
      razorpayOrderId: rzpOrder.id,
      amount: order.amount,
      status: 'created',
    });

    await Order.findByIdAndUpdate(order._id, { payment: payment._id });

    res.json({
      success: true,
      razorpayOrderId: rzpOrder.id,
      amount: order.amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
    });
  } catch (e) {
    next(e);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      demo,
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    if (demo || !process.env.RAZORPAY_KEY_SECRET) {
      const payment = await Payment.findOneAndUpdate(
        { order: orderId },
        { status: 'paid', razorpayPaymentId: 'demo_payment' },
        { new: true, upsert: false }
      );
      await Order.findByIdAndUpdate(orderId, { status: 'paid' });
      return res.json({ success: true, message: 'Demo payment confirmed', order, payment });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      throw new AppError('Invalid payment signature', 400);
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
      },
      { new: true }
    );

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'paid' },
      { new: true }
    ).populate('service');

    res.json({ success: true, message: 'Payment verified', order: updatedOrder, payment });
  } catch (e) {
    next(e);
  }
};
