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

// GET - Single design by ID  ← YE NAYA HAI
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }
    res.json(design);
  } catch (error) {
    res.status(400).json({ error: 'Invalid design ID' });
  }
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