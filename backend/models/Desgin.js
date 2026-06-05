import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: String,
  price: { type: Number, default: 0 },
  description: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Design', designSchema);