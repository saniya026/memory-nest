import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    occasion: { type: String, default: '' },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true, trim: true },
    photo: {
      url: String,
      publicId: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'hidden'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
