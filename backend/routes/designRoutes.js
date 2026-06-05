import express from 'express';
import Design from '../models/Design.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// GET - Sab users dekh sakte hain
router.get('/', async (req, res) => {
  const designs = await Design.find().sort({ createdAt: -1 });
  res.json(designs);
});

// POST - Sirf admin add kar sakta hai
router.post('/', protect, admin, async (req, res) => {
  const design = await Design.create({
    ...req.body,
    uploadedBy: req.user._id
  });
  res.status(201).json(design);
});

export default router;