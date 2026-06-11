import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  service: { // Service ke liye alag field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  name: String,
  image: String, // Main thumbnail
  price: Number,
  qty: { type: Number, default: 1 },

  // ✅ Customization ke liye naya object
  customization: {
    photos: [{ type: String }], // Cloudinary URLs array
    style: { type: String },
    color: { type: String }, // "Rose Pink" ya "#FF5733"
    message: { type: String },
    instructions: { type: String },
  },
  isCustom: { type: Boolean, default: false } // Custom order hai ya normal product
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // 1 user ka 1 hi cart
  },
  cartItems: [cartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;