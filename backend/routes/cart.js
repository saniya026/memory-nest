import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Cart from '../models/Cart.js';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js'; // ✅ Yahan change kiya

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'memory-nest/custom',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 }
});

router.post('/add-custom', protect, upload.array('photos'), async (req, res) => { // ✅ Yahan bhi protect
  // ... baaki code same
});

export default router;