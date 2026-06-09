import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  caption: { type: String, default: '' },
});

const orderItemSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Design', required: true },
  photos: [photoSchema],
  occasion: {
    type: String,
    enum: [
      'Birthday',
      'Anniversary',
      'Wedding',
      'Graduation',
      'Baby Shower',
      "Valentine's Day",
      "Mother's Day",
      "Father's Day",
      'Friendship',
      'Farewell',
      'Custom',
    ],
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