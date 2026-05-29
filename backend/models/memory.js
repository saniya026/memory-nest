import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Memory', memorySchema);