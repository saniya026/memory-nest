import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  caption: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
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
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    completedDesign: {
      url: String,
      publicId: String,
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
