const Wishlist = require('../models/wishlistModel');

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { designId, designName, designImage, price, category } = req.body;
    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      designId, designName, designImage, price, category
    });
    res.status(201).json(wishlistItem);
  } catch (error) {
    if(error.code === 11000) return res.status(400).json({ message: 'Already saved' });
    res.status(500).json({ message: error.message });
  }
};

// Get user wishlist
const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user._id });
  res.json(wishlist);
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Removed from wishlist' });
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };