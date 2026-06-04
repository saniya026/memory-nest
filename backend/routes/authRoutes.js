import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT - .env se secret le
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: "7d" // 7 din tak login save rahega
  });
};

// Register (Signup)
export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Name, email, password required" });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Password hash YAHAN MAT KAR - User.js me pre('save') khud karega
    user = await User.create({ 
      name, 
      email, 
      password, // plain password bhej, hashing User.js karega
      phone: phone || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({ 
      msg: "Signup successful", 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // IMPORTANT: .select('+password') lagana zaruri hai warna password nahi milega
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // User.js ka matchPassword method use kar
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({ 
      msg: "Login successful", 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Forgot password (skeleton)
export const forgotPassword = async (req, res) => {
  res.json({ msg: "Forgot password logic here" });
};

// Reset password with OTP (skeleton)
export const resetPasswordWithOtp = async (req, res) => {
  res.json({ msg: "Reset password with OTP logic here" });
};

// Reset password with token (skeleton)
export const resetPassword = async (req, res) => {
  res.json({ msg: "Reset password with token logic here" });
};