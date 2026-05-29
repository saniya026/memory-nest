import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getTestimonials,
  manageTestimonials,
  updateTestimonial,
  deleteTestimonial,
  getPricing,
  getAllPricing,
  createPricing,
  updatePricing,
  deletePricing,
  getAllUsers,
  submitContact,
} from '../controllers/contentController.js';
import { protect, admin, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public — browse designs & landing content
router.get('/services', getServices);
router.get('/services/:id', getService);
router.get('/testimonials', getTestimonials);
router.get('/pricing', getPricing);
router.post('/contact', submitContact);

// Admin — manage catalog, pricing, users
router.post('/services', ...adminOnly, createService);
router.put('/services/:id', ...adminOnly, updateService);
router.delete('/services/:id', ...adminOnly, deleteService);

router.get('/admin/testimonials', ...adminOnly, manageTestimonials);
router.post('/admin/testimonials', ...adminOnly, manageTestimonials);
router.put('/admin/testimonials/:id', ...adminOnly, updateTestimonial);
router.delete('/admin/testimonials/:id', ...adminOnly, deleteTestimonial);

router.get('/admin/pricing', ...adminOnly, getAllPricing);
router.post('/admin/pricing', ...adminOnly, createPricing);
router.put('/admin/pricing/:id', ...adminOnly, updatePricing);
router.delete('/admin/pricing/:id', ...adminOnly, deletePricing);

router.get('/admin/users', ...adminOnly, getAllUsers);

export default router;
