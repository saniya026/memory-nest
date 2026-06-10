// backend/models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Design', 'Photo', 'Video', 'Print', 'Other']
  },
  imageUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;