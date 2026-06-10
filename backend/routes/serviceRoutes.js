// backend/routes/serviceRoutes.js
import express from 'express';
// import Service from '../models/Service.js'; ← Isko comment kar
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/services - Public
router.get('/', async (req, res) => {
  // try {
  //   const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
  //   res.json(services);
  // } catch (error) {
  //   res.status(500).json({ message: 'Failed to fetch services' });
  // }
  
  // TEMP DUMMY DATA
  res.json([
    { 
      _id: "test1", 
      title: "Birthday Memories Special", 
      description: "Test chal raha hai", 
      price: 50,
           isActive: true 
    }
  ]);
});

export default router;