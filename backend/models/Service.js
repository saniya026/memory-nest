// backend/models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Birthday', 'Love', 'Anniversary', 'Wedding', 'Graduation', 'Custom'],
    required: true 
  },
  price: { type: Number, required: true },
  description: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);