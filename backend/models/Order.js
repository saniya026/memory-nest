import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  caption: { type: String, default: '' },
});

const orderItemSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Design', required: false },
  photos: [photoSchema],
  occasion: {
    type: String,
    enum: [
      'Birthday',
      'Wedding',
      'Love',
      'Custom'
    ], // ✅ Sirf 4 occasions
    required: true,
  },
  theme: { type: String, required: true },
  customOccasionName: { type: String, default: '' },
  customColorPreset: { type: String, default: '' },
  customColorPrimary: { type: String, default: '' },
  customColorSecondary: { type: String, default: '' },
  message: { type: String, default: '' },
  specialInstructions: { type: String, default: '' },
  amount: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },

    // ✅ Delivery Address Field
    deliveryAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      pincode: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      landmark: { type: String, default: '' },
    },

    status: {
      type: String,
      enum: ['pending', 'created', 'paid', 'processing', 'completed', 'cancelled', 'Paid'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
    completedDesign: {
      url: String,
      publicId: String,
    },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);