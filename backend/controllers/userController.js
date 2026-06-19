import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

// ✅ GET - User profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ✅ PUT - Update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) throw new AppError('User not found', 404);

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET - Saare addresses
export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (err) {
    next(err);
  }
};

// ✅ POST - Naya address add karo
export const addAddress = async (req, res, next) => {
  try {
    const { name, phone, pincode, address, city, state, landmark, isDefault } = req.body;

    if (!name ||!phone ||!pincode ||!address ||!city ||!state) {
      throw new AppError('All fields required except landmark', 400);
    }

    const user = await User.findById(req.user._id);

    // Agar isDefault true hai to baaki sab false kar do
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({ name, phone, pincode, address, city, state, landmark, isDefault });
    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE - Address delete karo
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: { _id: req.params.addressId } } },
      { new: true }
    ).select('addresses');

    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

// ✅ PATCH - Default address set karo
export const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === req.params.addressId;
    });

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};