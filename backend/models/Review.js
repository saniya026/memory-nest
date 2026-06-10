import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Design' }, // optional
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 500 },
  adminReply: {
    text: { type: String, default: '' },
    repliedAt: Date,
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  isApproved: { type: Boolean, default: true } // admin chahe to hide kar sake
}, { timestamps: true });

// Ek user ek order pe sirf 1 review
reviewSchema.index({ user: 1, order: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);