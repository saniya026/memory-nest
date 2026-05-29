import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Pricing from '../models/Pricing.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

const FALLBACK_SERVICES = [
  {
    _id: 'fallback-classic',
    title: 'Classic Scrapbook',
    description: 'Soft pastel polaroid layout with handwritten captions.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1518199266791-5375a57590ae?w=600',
    features: ['20 photo slots', 'Pastel theme'],
    isActive: true,
  },
  {
    _id: 'fallback-lavender',
    title: 'Dreamy Lavender',
    description: 'Lavender tones with floating photo frames and sparkles.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
    features: ['25 photo slots', 'Lavender theme'],
    isActive: true,
  },
];

export const getServices = async (req, res, next) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { isActive: true };
    const services = await Service.find(query).sort('sortOrder');
    if (services.length === 0 && req.user?.role !== 'admin') {
      return res.json({ success: true, services: FALLBACK_SERVICES, fallback: true });
    }
    res.json({ success: true, services });
  } catch (e) {
    next(e);
  }
};

export const getService = async (req, res, next) => {
  try {
    const fallback = FALLBACK_SERVICES.find((s) => s._id === req.params.id);
    if (fallback) return res.json({ success: true, service: fallback });

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

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      throw new AppError('Name, email, and message are required', 400);
    }

    const { sendEmail } = await import('../utils/sendEmail.js');
    const adminEmail = process.env.CONTACT_EMAIL || 'alisaniya026@gmail.com';
    await sendEmail({
      to: adminEmail,
      subject: `MemoryNest contact from ${name.trim()}`,
      html: `<p><b>Name:</b> ${name.trim()}</p><p><b>Email:</b> ${email.trim()}</p><p><b>Message:</b></p><p>${message.trim().replace(/\n/g, '<br>')}</p>`,
    });

    console.log('[Contact]', { name: name.trim(), email: email.trim() });
    res.json({ success: true, message: 'Thank you! We will get back to you soon.' });
  } catch (e) {
    next(e);
  }
};
