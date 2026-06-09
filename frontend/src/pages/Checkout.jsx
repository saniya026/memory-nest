import Order from '../models/Order.js';
import Design from '../models/Design.js'; // Service ki jagah Design
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import { AppError } from '../middleware/errorHandler.js';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

async function sendOrderEmail(orderDetails) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'alisaniya026@gmail.com',
      subject: `New Order Paid - ${orderDetails._id}`,
      html: `
        <h2>New Order Details</h2>
        <p><b>Order ID:</b> ${orderDetails._id}</p>
        <p><b>Occasion:</b> ${orderDetails.customOccasionName || orderDetails.occasion}</p>
        <p><b>Theme:</b> ${orderDetails.theme}</p>
        ${orderDetails.customColorPreset? `<p><b>Custom colors:</b> ${orderDetails.customColorPreset} (${orderDetails.customColorPrimary} / ${orderDetails.customColorSecondary})</p>` : ''}
        <p><b>Message:</b> ${orderDetails.message}</p>
        <p><b>Amount:</b> ₹${orderDetails.amount}</p>
        <p><b>Status:</b> ${orderDetails.status}</p>
        <p><b>Payment ID:</b> ${orderDetails.razorpayPaymentId || 'N/A'}</p>
        <p><b>Photos:</b> ${orderDetails.photos.length} uploaded</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order email sent successfully');
  } catch (error) {
    console.log('Email error:', error);
  }
}

export const createOrder = async (req) => {
  try {
    const {
      occasion,
      theme,
      message,
      specialInstructions,
      serviceId, // ye ab Design ka ID hai
      amount,
      captions,
      customOccasionName,
      customColorPreset,
      customColorPrimary,
      customColorSecondary,
      razorpayOrderId,
      status,
      photos: photoUrls
    } = req.body;

    let design = null;
    let orderAmount = Number(amount) || 999;

    if (serviceId) {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new AppError("Invalid design selected. Please refresh and try again.", 400);
      }

      design = await Design.findById(serviceId);
      if (!design) {
        throw new AppError("Design not found", 404);
      }
      orderAmount = design.price;
    }

    const photos = [];
    const captionList = captions? (typeof captions === 'string'? JSON.parse(captions) : captions) : [];

    // Agar file upload hai
    if (req.files?.length) {
      for (let i = 0; i < req.files.length; i++) {
        const result = await uploadToCloudinary(req.files[i].buffer, 'memorynest/orders');
        photos.push({
          url: result.secure_url,
          publicId: result.public_id,
          caption: captionList[i] || '',
        });
      }
    }

    // Agar photo URLs already hain - Razorpay flow me
    if (photoUrls?.length) {
      photoUrls.forEach((url, i) => {
        photos.push({
          url,
          publicId: '',
          caption: captionList[i] || '',
        });
      });
    }

    const order = await Order.create({
      user: req.user._id,
      service: design?._id, // Design ka ID
      photos,
      occasion,
      theme,
      customOccasionName: customOccasionName || '',
      customColorPreset: customColorPreset || '',
      customColorPrimary: customColorPrimary || '',
      customColorSecondary: customColorSecondary || '',
      message: message || '',
      specialInstructions: specialInstructions || '',
      amount: orderAmount,
      status: status || 'pending',
      razorpayOrderId: razorpayOrderId || '',
    });

    // Email sirf paid hone par bhejo
    if (status === 'paid') {
      await sendOrderEmail(order);
    }

    const populated = await Order.findById(order._id).populate('service');
    return populated;
  } catch (e) {
    throw e;
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
     .populate('service')
     .sort('-createdAt');
    res.json({ success: true, orders });
  } catch (e) {
    next(e);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('service');
    if (!order) throw new AppError('Order not found', 404);
    if (order.user.toString()!== req.user._id.toString() && req.user.role!== 'admin') {
      throw new AppError('Not authorized', 403);
    }
    res.json({ success: true, order });
  } catch (e) {
    next(e);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
     .populate('user', 'name email')
     .populate('service')
     .sort('-createdAt');
    res.json({ success: true, orders });
  } catch (e) {
    next(e);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, razorpayPaymentId, razorpaySignature } = req.body;
    const updateData = { status };

    if (razorpayPaymentId) updateData.razorpayPaymentId = razorpayPaymentId;
    if (razorpaySignature) updateData.razorpaySignature = razorpaySignature;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
     .populate('user', 'name email')
     .populate('service');

    if (!order) throw new AppError('Order not found', 404);

    // Paid hone par email bhejo
    if (status === 'paid') {
      await sendOrderEmail(order);
    }

    if (res) res.json({ success: true, order });
    return order;
  } catch (e) {
    if (res) res.status(500).json({ error: e.message });
    throw e;
  }
};

export const uploadCompletedDesign = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('Design file required', 400);
    const result = await uploadToCloudinary(req.file.buffer, 'memorynest/designs');
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        completedDesign: { url: result.secure_url, publicId: result.public_id },
        status: 'completed',
      },
      { new: true }
    ).populate('user', 'name email');
    res.json({ success: true, order });
  } catch (e) {
    next(e);
  }
};