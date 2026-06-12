const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Cart = require('../models/Cart');
const Service = require('../models/Service');
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

router.post('/add-custom', auth, upload.array('photos'), async (req, res) => {
  try {
    const { serviceId, style, color, colorName, message, instructions } = req.body;
    const userId = req.user.id;

    console.log('[Cart] Received files:', req.files?.length);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Upload at least 1 photo' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

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

    console.log('[Cart Success]', { userId, photoCount: photoUrls.length });

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