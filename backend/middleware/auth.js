import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized Access' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized Access' });
    }
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized Access' });
  }
};

export const admin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized Access' });
  }
  next();
};

/** Requires valid JWT + admin role */
export const adminOnly = [protect, admin];
