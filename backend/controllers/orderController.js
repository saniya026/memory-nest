import Order from '../models/Order.js';
import Service from '../models/Service.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import { AppError } from '../middleware/errorHandler.js';
import nodemailer from 'nodemailer';

export const createOrder = async (req, res, next) => {
  try {
    const { occasion, theme, message, specialInstructions, serviceId, amount, captions } = req.body;
    let service = null;
    let orderAmount = Number(amount) || 999;

    if (serviceId) {
      service = await Service.findById(serviceId);
      if (service) orderAmount = service.price;
    }

    const photos = [];
    const captionList = captions ? JSON.parse(captions) : [];

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

    const order = await Order.create({
      user: req.user._id,
      service: service?._id,
      photos,
      occasion,
      theme,
      message: message || '',
      specialInstructions: specialInstructions || '',
      amount: orderAmount,
      status: 'pending',
    });

    const populated = await Order.findById(order._id).populate('service');
    res.status(201).json({ success: true, order: populated });
  } catch (e) {
    next(e);
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
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'name email')
      .populate('service');
    if (!order) throw new AppError('Order not found', 404);
    res.json({ success: true, order });
  } catch (e) {
    next(e);
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
