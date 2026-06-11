const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  designId: { type: String, required: true },
  designName: { type: String, required: true },
  designImage: { type: String, required: true },
  price: { type: Number, required: true },
  category: String
}, { timestamps: true });

wishlistSchema.index({ user: 1, designId: 1 }, { unique: true }); // Duplicate save nahi hoga

module.exports = mongoose.model('Wishlist', wishlistSchema);