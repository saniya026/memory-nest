import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { AppError } from '../middleware/errorHandler.js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'alisaniya026@gmail.com').toLowerCase();

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new AppError('Please provide name, email and password', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail === ADMIN_EMAIL) {
      throw new AppError('This email is reserved. Please use a different email to sign up.', 400);
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) throw new AppError('Email already registered', 400);

    // Customers only — never create admin via signup
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: 'user',
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase()?.trim() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase()?.trim() });
    if (!user) {
      return res.json({ success: true, message: 'If email exists, reset link sent' });
    }
    if (user.role === 'admin') {
      return res.json({ success: true, message: 'If email exists, reset link sent' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'MemoryNest Password Reset',
      html: `<p>Click to reset: <a href="${resetUrl}">${resetUrl}</a></p><p>Expires in 1 hour.</p>`,
    });
    res.json({ success: true, message: 'If email exists, reset link sent' });
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) throw new AppError('Invalid or expired token', 400);
    if (user.role === 'admin') {
      throw new AppError('Password reset not available for this account', 403);
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ success: true, token: generateToken(user._id), message: 'Password updated' });
  } catch (e) {
    next(e);
  }
};
