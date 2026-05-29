import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { AppError } from '../middleware/errorHandler.js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'alisaniya026@gmail.com').toLowerCase();

const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp)).digest('hex');

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      throw new AppError('Please provide name, email and password', 400);
    }
    if (!phone?.trim()) {
      throw new AppError('Phone number is required', 400);
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
      phone: phone.trim(),
      role: 'user',
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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
    const email = req.body.email?.toLowerCase()?.trim();
    const user = await User.findOne({ email });
    if (!user || user.role === 'admin') {
      return res.json({ success: true, message: 'If email exists, an OTP has been sent' });
    }

    const otp = generateOtp();
    user.resetOtp = hashOtp(otp);
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: 'MemoryNest — Password reset OTP',
      html: `
        <div style="font-family:sans-serif;max-width:480px">
          <h2 style="color:#e11d48">Your MemoryNest reset code</h2>
          <p>Use this 6-digit OTP to reset your password. It expires in 10 minutes.</p>
          <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#7c3aed">${otp}</p>
          <p style="color:#666;font-size:14px">If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'If email exists, an OTP has been sent' });
  } catch (e) {
    next(e);
  }
};

export const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      throw new AppError('Email, OTP, and new password are required', 400);
    }
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || user.role === 'admin') {
      throw new AppError('Invalid or expired OTP', 400);
    }
    if (!user.resetOtp || !user.resetOtpExpire || user.resetOtpExpire < Date.now()) {
      throw new AppError('Invalid or expired OTP', 400);
    }
    if (user.resetOtp !== hashOtp(otp)) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    user.password = password;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      message: 'Password updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
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
