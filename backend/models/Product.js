import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: Number,
  comment: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String }], // Cloudinary URLs
  brand: String,
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true }, // For discount show
  countInStock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;