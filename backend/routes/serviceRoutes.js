// backend/routes/serviceRoutes.js
import express from 'express';
import Service from '../models/Service.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/services - Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// POST /api/services - Admin Only
router.post('/', protect, admin, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/services/:id - Admin Only
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

export default router;