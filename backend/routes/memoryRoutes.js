import express from 'express';
import Memory from '../models/memory.js';
import { upload } from '../config/cloudinary.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create Memory + Upload Photo
router.post('/create', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const newMemory = await Memory.create({
      title,
      description,
      imageUrl: req.file.path,
      date: date || Date.now(),
      userId: req.user.id
    });

    res.status(201).json(newMemory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get All Memories of Logged-in User
router.get('/my-memories', protect, async (req, res) => {
  try {
    const memories = await Memory.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
