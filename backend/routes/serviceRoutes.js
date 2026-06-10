// backend/routes/serviceRoutes.js
import express from 'express';
import Service from '../models/Service.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/services - Sabhi services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/services - Nayi service add karo, admin only
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role!== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const service = new Service(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;