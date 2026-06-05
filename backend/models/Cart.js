import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      image: String,
      price: Number,
      qty: Number,
    }
  ],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;