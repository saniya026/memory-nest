import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { AppError } from '../middleware/errorHandler.js';

// Customer: Review create karo
export const createReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    if (order.user.toString()!== req.user._id.toString()) {
      throw new AppError('Not authorized for this order', 403);
    }

    if (order.status!== 'completed') {
      throw new AppError('You can review only after order is completed', 400);
    }

    const existing = await Review.findOne({ order: orderId, user: req.user._id });
    if (existing) throw new AppError('You have already reviewed this order', 400);

    const review = await Review.create({
      user: req.user._id,
      order: orderId,
      service: order.items[0]?.service || null,
      rating,
      comment
    });

    const populated = await Review.findById(review._id).populate('user', 'name');
    res.json({ success: true, review: populated });
  } catch (e) {
    next(e);
  }
};

// Sab reviews lao - public page ke liye
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: true })
     .populate('user', 'name')
     .populate('service', 'title')
     .populate('adminReply.repliedBy', 'name')
     .sort('-createdAt')
     .limit(20);

    res.json({ success: true, reviews });
  } catch (e) {
    next(e);
  }
};

// Customer: Apne reviews
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
     .populate('order', '_id totalAmount')
     .populate('service', 'title')
     .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (e) {
    next(e);
  }
};

// Admin: Reply 
export const replyToReview = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) throw new AppError('Reply text required', 400);

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: {
          text,
          repliedAt: new Date(),
          repliedBy: req.user._id
        }
      },
      { new: true }
    ).populate('user', 'name').populate('adminReply.repliedBy', 'name');

    if (!review) throw new AppError('Review not found', 404);
    res.json({ success: true, review });
  } catch (e) {
    next(e);
  }
};

// Admin: Hide/Show review
export const toggleReviewApproval = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw new AppError('Review not found', 404);

    review.isApproved =!review.isApproved;
    await review.save();

    res.json({ success: true, review });
  } catch (e) {
    next(e);
  }
};