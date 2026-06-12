// backend/routes/serviceRoutes.js
import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// GET /api/services - Sabhi active services dikhao
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ✅ Ye naya route add kar - Single service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    if (!service.isActive) {
      return res.status(404).json({ message: 'Service not available' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Invalid service ID', error: error.message });
  }
});

// POST /api/services - Nayi service add karo
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