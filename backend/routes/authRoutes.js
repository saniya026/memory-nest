import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const updateProfile = async (req, res) => {
  try {
    // ✅ req.user._id middleware se aata hai
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Sirf jo fields bheji hain wahi update karo
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;

    // ✅ Password change karna ho to alag route banao
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      token: generateToken(updatedUser._id) // ✅ Naya token bhej
    });

  } catch (error) {
    console.log('Update Profile Error:', error); // ✅ Backend terminal me error dekh
    res.status(400).json({ 
      message: 'Update failed', 
      error: error.message 
    });
  }
};