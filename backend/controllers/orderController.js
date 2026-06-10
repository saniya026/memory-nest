import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Design from '../models/Design.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import { AppError } from '../middleware/errorHandler.js';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ YE 2 FUNCTION ADD KAR
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, items } = req.body;

    if (!amount || amount < 1) {
      throw new AppError('Invalid amount', 400);
    }

    // 1. Pehle DB me order create kar with status pending
    const orderItems = items.map(item => ({
      service: item.service || null,
      amount: item.amount,
      occasion: item.occasion,
      theme: item.theme,
      message: item.message,
      specialInstructions: item.specialInstructions,
      customOccasionName: item.customOccasionName,
      customColorPreset: item.customColorPreset,
      customColorPrimary: item.customColorPrimary,
      customColorSecondary: item.customColorSecondary,
      photos: item.photos || []
    }));

    const dbOrder = await Order.create({
      user: req.user._id,
      items: orderItems,
      amount: amount,
      status: 'pending'
    });

    // 2. Razorpay order banao - amount * 100 karna zaroori hai
    const options = {
      amount: amount * 100, // ₹50 ko 5000 paise me convert kiya
      currency: "INR",
      receipt: `receipt_${dbOrder._id}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 3. DB order me razorpayOrderId save kar
    dbOrder.razorpayOrderId = razorpayOrder.id;
    await dbOrder.save();

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      razorpayOrderId: razorpayOrder.id,
      orderId: dbOrder._id
    });

  } catch (e) {
    next(e);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // 1. Signature verify kar
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
     .update(sign.toString())
     .digest("hex");

    if (razorpay_signature!== expectedSign) {
      throw new AppError('Invalid payment signature', 400);
    }

    // 2. Order status update kar
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    ).populate('user', 'name email');

    if (!order) throw new AppError('Order not found', 404);

    // 3. Email bhejo
    await sendOrderEmail(order);

    res.json({ success: true, order });
  } catch (e) {
    next(e);
  }
};

//...baaki tera purana code same rahega