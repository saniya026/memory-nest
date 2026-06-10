// backend/routes/serviceRoutes.js
import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// GET /api/services - Sabhi services dikhao
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/services - Nayi service add karo, auth ke bina
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;