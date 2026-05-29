import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: 'Happy Customer' },
    content: { type: String, required: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
