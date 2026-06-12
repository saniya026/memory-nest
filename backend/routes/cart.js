const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Cart = require('../models/Cart');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'memory-nest/custom',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 } // 5MB per file
});

// ✅ Ye route hona zaruri hai
router.post('/add-custom', auth, upload.array('photos'), async (req, res) => {
  try {
    const { serviceId, style, color, colorName, message, instructions } = req.body;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No photos uploaded' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
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
        style,
        color,
        colorName,
        message,
        instructions,
      }
    };

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, cartItems: [customCartItem] });
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

module.exports = router;