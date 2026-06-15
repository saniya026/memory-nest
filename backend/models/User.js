import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ✅ Address ka sub-schema
const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  landmark: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
}, { _id: true, timestamps: true });

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String, default: '' },
  role: { type: String, default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Design' }],
  addresses: [addressSchema], // ✅ Addresses array add kiya
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;