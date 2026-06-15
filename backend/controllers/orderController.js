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

async function sendOrderEmail(orderDetails) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const address = orderDetails.deliveryAddress;
    const addressHtml = address? `
      <h3>Delivery Address:</h3>
      <p>
        <b>${address.name}</b><br/>
        ${address.address}, ${address.landmark? address.landmark + ',' : ''}<br/>
        ${address.city}, ${address.state} - ${address.pincode}<br/>
        Phone: ${address.phone}
      </p>
    ` : '';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'alisaniya026@gmail.com',
      subject: `New Order Paid - ${orderDetails._id}`,
      html: `
        <h2>New Order Details</h2>
        <p><b>Order ID:</b> ${orderDetails._id}</p>
        <p><b>Amount:</b> ₹${orderDetails.totalAmount}</p>
        <p><b>Status:</b> ${orderDetails.status}</p>
        <p><b>Payment ID:</b> ${orderDetails.razorpayPaymentId || 'N/A'}</p>
        <p><b>Items:</b> ${orderDetails.items.length}</p>
        ${addressHtml}
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order email sent successfully');
  } catch (error) {
    console.log('Email error:', error);
  }
}

// ✅ CREATE RAZORPAY ORDER - deliveryAddress add kiya
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, items, deliveryAddress } = req.body; // ✅ Address le liya

    if (!items || items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    if (!amount || amount < 1) {
      throw new AppError('Invalid amount', 400);
    }

    // ✅ Address validation
    if (!deliveryAddress ||!deliveryAddress.name ||!deliveryAddress.phone ||!deliveryAddress.pincode) {
      throw new AppError('Complete delivery address is required', 400);
    }

    const formattedItems = items.map(item => ({
      service: item.service || undefined,
      amount: Number(item.amount),
      occasion: item.occasion || 'Custom',
      theme: item.theme || 'Default',
      message: item.message || '',
      specialInstructions: item.specialInstructions || '',
      customOccasionName: item.customOccasionName || '',
      customColorPreset: item.customColorPreset || '',
      customColorPrimary: item.customColorPrimary || '',
      customColorSecondary: item.customColorSecondary || '',
      photos: (item.photos || []).map(url => ({
        url: typeof url === 'string'? url : url.url,
        publicId: '',
        caption: ''
      }))
    }));

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = await Order.create({
      user: req.user._id,
      items: formattedItems,
      totalAmount: amount,
      deliveryAddress, // ✅ Address save ho gaya
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
  } catch (e) {
    next(e);
  }
};

// ✅ VERIFY PAYMENT - Same rahega
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
   .update(sign.toString())
   .digest('hex');

    if (razorpay_signature!== expectedSign) {
      throw new AppError('Invalid payment signature', 400);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'paid',
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    ).populate('user', 'name email');

    if (!order) throw new AppError('Order not found', 404);

    await sendOrderEmail(order);

    res.json({ success: true, order });
  } catch (e) {
    next(e);
  }
};

export const createOrder = async (req) => {
  try {
    const {
      occasion,
      theme,
      message,
      specialInstructions,
      serviceId,
      amount,
      captions,
      customOccasionName,
      customColorPreset,
      customColorPrimary,
      customColorSecondary,
      razorpayOrderId,
      status,
      photos: photoUrls,
      deliveryAddress // ✅ Add kiya
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
      items: [{
        service: design?._id,
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
      }],
      totalAmount: orderAmount,
      deliveryAddress: deliveryAddress || undefined, // ✅ Address save
      status: status || 'pending',
      razorpayOrderId: razorpayOrderId || '',
    });

    if (status === 'paid') {
      await sendOrderEmail(order);
    }

    const populated = await Order.findById(order._id).populate('items.service');
    return populated;
  } catch (e) {
    throw e;
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
  .populate('items.service')
  .sort('-createdAt');
    res.json({ success: true, orders });
  } catch (e) {
    next(e);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.service');
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
  .populate('items.service')
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
  .populate('items.service');

    if (!order) throw new AppError('Order not found', 404);

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