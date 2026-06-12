import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name ||!email ||!password) {
    return res.status(400).json({ msg: "Name, email, password required" });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      msg: "Signup successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email ||!password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ YE FUNCTION FIX HUA HAI
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      token: generateToken(updatedUser._id)
    });

  } catch (error) {
    console.log('Update Profile Error:', error);
    res.status(400).json({
      message: 'Update failed',
      error: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({ message: "If email exists, reset link has been sent" });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password - Memory Nest',
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Click the button below:</p>
          <a href="${resetUrl}" style="display:inline-block;margin:20px 0;padding:12px 24px;background:#ec4899;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
          <p>Or copy this link: ${resetUrl}</p>
          <p><b>This link expires in 15 minutes.</b></p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `
    });

    res.json({ message: "If email exists, reset link has been sent" });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: "Failed to send email. Please try again." });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  res.json({ msg: "Reset password with OTP logic here" });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token ||!password) {
    return res.status(400).json({ message: "Token and password required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.password = password;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(400).json({ message: "Token expired or invalid" });
  }
};