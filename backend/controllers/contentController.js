import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Pricing from '../models/Pricing.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

export const getServices = async (req, res, next) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { isActive: true };
    const services = await Service.find(query).sort('sortOrder');
    res.json({ success: true, services });
  } catch (e) {
    next(e);
  }
};

export const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) throw new AppError('Service not found', 404);
    res.json({ success: true, service });
  } catch (e) {
    next(e);
  }
};

export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (e) {
    next(e);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) throw new AppError('Service not found', 404);
    res.json({ success: true, service });
  } catch (e) {
    next(e);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (e) {
    next(e);
  }
};

export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort('-createdAt');
    res.json({ success: true, testimonials });
  } catch (e) {
    next(e);
  }
};

export const manageTestimonials = async (req, res, next) => {
  try {
    if (req.method === 'GET') {
      const testimonials = await Testimonial.find().sort('-createdAt');
      return res.json({ success: true, testimonials });
    }
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (e) {
    next(e);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, testimonial });
  } catch (e) {
    next(e);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const getPricing = async (req, res, next) => {
  try {
    const pricing = await Pricing.find({ isActive: true }).sort('sortOrder');
    res.json({ success: true, pricing });
  } catch (e) {
    next(e);
  }
};

export const getAllPricing = async (req, res, next) => {
  try {
    const pricing = await Pricing.find().sort('sortOrder');
    res.json({ success: true, pricing });
  } catch (e) {
    next(e);
  }
};

export const createPricing = async (req, res, next) => {
  try {
    const plan = await Pricing.create(req.body);
    res.status(201).json({ success: true, pricing: plan });
  } catch (e) {
    next(e);
  }
};

export const updatePricing = async (req, res, next) => {
  try {
    const plan = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, pricing: plan });
  } catch (e) {
    next(e);
  }
};

export const deletePricing = async (req, res, next) => {
  try {
    await Pricing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, users });
  } catch (e) {
    next(e);
  }
};

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;
  console.log('[Contact]', { name, email, message });
  res.json({ success: true, message: 'Thank you! We will get back to you soon.' });
};
