import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Cart from '../models/Cart.js';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'memory-nest/custom',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Auto resize
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 }, // ✅ 10MB limit fix
});

// POST /api/cart/add-custom
router.post('/add-custom', protect, upload.array('photos', 10), async (req, res) => {
  try {
    const { serviceId, style, color, colorName, message, instructions } = req.body;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No photos uploaded'
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const photoUrls = req.files.map(file => file.path);

    const customCartItem = {
      service: serviceId,
      name: service.name,
      image: photoUrls[0],
      price: service.price,
      qty: 1,
      customization: {
        photos: photoUrls,
        style: style || '',
        color: color || '',
        colorName: colorName || '',
        message: message || '',
        instructions: instructions || '',
      }
    };

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        cartItems: [customCartItem]
      });
    } else {
      cart.cartItems.push(customCartItem);
      await cart.save();
    }

    res.json({
      success: true,
      message: `${photoUrls.length} photos added to cart`,
      cartId: cart._id
    });

  } catch (err) {
    console.error('[Cart Error]', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Upload failed'
    });
  }
});

export default router;