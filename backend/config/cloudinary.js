import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Debug log - Render logs me check karna
console.log('[Cloudinary Check]', {
  name: process.env.CLOUDINARY_CLOUD_NAME || 'MISSING',
  key: process.env.CLOUDINARY_API_KEY? 'SET' : 'MISSING',
  secret: process.env.CLOUDINARY_API_SECRET? 'SET' : 'MISSING'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'memorynest',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'heic'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }] // Large image compress ho jayegi
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 } // 10MB limit
});

export { cloudinary, upload };