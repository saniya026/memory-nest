import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetOtp: String,
    resetOtpExpire: Date,
  },
  { timestamps: true }
);

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'alisaniya026@gmail.com').toLowerCase();

userSchema.pre('save', async function (next) {
  // Only the designated admin email may hold admin role
  if (this.role === 'admin' && this.email !== ADMIN_EMAIL) {
    this.role = 'user';
  }
  if (this.isModified('role') && this.role === 'admin' && this.email !== ADMIN_EMAIL) {
    this.role = 'user';
  }
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
