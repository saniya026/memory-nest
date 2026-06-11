import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Design from '../models/Design.js';

const router = express.Router();

// @desc Get user wishlist
// @route GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc Add to wishlist
// @route POST /api/wishlist/save
router.post('/save', protect, async (req, res) => {
  try {
    const { designId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(designId)) {
      user.wishlist.push(designId);
      await user.save();
    }

    res.json({ message: 'Design saved to wishlist' });
  } catch (error) {
    console.error('Wishlist save error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc Remove from wishlist
// @route DELETE /api/wishlist/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Wishlist delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;