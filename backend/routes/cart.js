const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Cart = require('../models/Cart');
const Service = require('../models/Service'); // Service model import kar
const auth = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});

// POST /api/cart/add-custom
router.post('/add-custom', auth, upload.array('photos', 5), async (req, res) => {
  try {
    const { serviceId, style, color, message, instructions } = req.body;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Upload at least 1 photo' });
    }

    // Service ki details nikal le price/name ke liye
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // 1. Photos Cloudinary pe upload
    const uploadPromises = req.files.map(file => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      return cloudinary.uploader.upload(dataURI, {
        folder: 'memory-nest/custom-orders',
        resource_type: 'image',
      });
    });

    const results = await Promise.all(uploadPromises);
    const photoUrls = results.map(r => r.secure_url);

    // 2. Cart item ka sahi structure - model ke hisaab se
    const customCartItem = {
      service: serviceId,
      name: service.name,
      image: photoUrls[0], // First photo thumbnail ke liye
      price: service.price,
      qty: 1,
      customization: {
        photos: photoUrls,
        style,
        color,
        message,
        instructions,
      }
    };

    // 3. Cart me save karo - cartItems use kar, items nahi
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, cartItems: [customCartItem] });
    } else {
      cart.cartItems.push(customCartItem); // ✅ cartItems hai, items nahi
      await cart.save();
    }

    console.log('[Cart Success]', { userId, photoCount: photoUrls.length });

    res.json({
      success: true,
      message: 'Added to cart',
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

module.exports = router;