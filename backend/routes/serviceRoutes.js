// backend/routes/serviceRoutes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { 
      _id: "1", 
      title: "Birthday Memories Special", 
      description: "Capture your birthday", 
      price: 3499,
      isActive: true 
    },
    { 
      _id: "2", 
      title: "Wedding Anniversary", 
      description: "Celebrate your love story", 
      price: 4999,
      isActive: true 
    }
  ]);
});

export default router;