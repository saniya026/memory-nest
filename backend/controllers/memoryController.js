import Memory from '../models/memory.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';
import { AppError } from '../middleware/errorHandler.js';

export const createMemory = async (req, res, next) => {
  try {
    const { title, description, date } = req.body;
    if (!title?.trim()) throw new AppError('Title is required', 400);
    if (!req.file) throw new AppError('Please upload an image', 400);

    const result = await uploadToCloudinary(req.file.buffer, 'memorynest/memories');
    const memory = await Memory.create({
      title: title.trim(),
      description: description?.trim() || '',
      imageUrl: result.secure_url,
      date: date ? new Date(date) : new Date(),
      userId: req.user._id,
    });

    res.status(201).json({ success: true, memory });
  } catch (e) {
    next(e);
  }
};

export const getMyMemories = async (req, res, next) => {
  try {
    const memories = await Memory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, memories });
  } catch (e) {
    next(e);
  }
};

export const deleteMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findOne({ _id: req.params.id, userId: req.user._id });
    if (!memory) throw new AppError('Memory not found', 404);
    await memory.deleteOne();
    res.json({ success: true, message: 'Memory deleted' });
  } catch (e) {
    next(e);
  }
};
