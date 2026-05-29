import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import { AppError } from '../middleware/errorHandler.js';

export const getPublicReviews = async (req, res, next) => {
  try {
    const { serviceId, occasion, limit = 12 } = req.query;
    const filter = { status: 'approved' };
    if (serviceId) filter.service = serviceId;
    if (occasion) filter.occasion = occasion;

    const reviews = await Review.find(filter)
      .sort('-createdAt')
      .limit(Math.min(Number(limit) || 12, 50))
      .select('-user -order');

    res.json({ success: true, reviews });
  } catch (e) {
    next(e);
  }
};

export const getEligibleOrders = async (req, res, next) => {
  try {
    const completed = await Order.find({ user: req.user._id, status: 'completed' })
      .populate('service')
      .sort('-createdAt');
    const existing = await Review.find({ user: req.user._id }).select('order');
    const reviewedIds = new Set(existing.map((r) => r.order.toString()));
    const orders = completed.filter((o) => !reviewedIds.has(o._id.toString()));
    res.json({ success: true, orders });
  } catch (e) {
    next(e);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { orderId, rating, content } = req.body;
    if (!orderId || !rating || !content?.trim()) {
      throw new AppError('Order, rating, and review text are required', 400);
    }
    const stars = Number(rating);
    if (stars < 1 || stars > 5) throw new AppError('Rating must be between 1 and 5', 400);

    const order = await Order.findById(orderId).populate('service');
    if (!order) throw new AppError('Order not found', 404);
    if (order.user.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }
    if (order.status !== 'completed') {
      throw new AppError('You can only review completed orders', 400);
    }

    const exists = await Review.findOne({ order: order._id });
    if (exists) throw new AppError('You already reviewed this order', 400);

    let photo;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'memorynest/reviews');
      photo = { url: result.secure_url, publicId: result.public_id };
    }

    const review = await Review.create({
      user: req.user._id,
      order: order._id,
      service: order.service?._id,
      occasion: order.occasion,
      customerName: req.user.name,
      rating: stars,
      content: content.trim(),
      photo,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      review,
      message: 'Thank you! Your review will appear after approval.',
    });
  } catch (e) {
    next(e);
  }
};

export const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('service', 'title')
      .populate('order', 'occasion status')
      .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (e) {
    next(e);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'hidden', 'pending'].includes(status)) {
      throw new AppError('Invalid status', 400);
    }
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) throw new AppError('Review not found', 404);
    res.json({ success: true, review });
  } catch (e) {
    next(e);
  }
};
