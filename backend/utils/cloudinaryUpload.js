console.log('=== CLOUDINARY FILE IMPORTED ==='); // Ye sabse upar

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('[Cloudinary Init]', {
  name: process.env.CLOUDINARY_CLOUD_NAME || 'MISSING',
  key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
  secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
});

export const uploadToCloudinary = (buffer, folder = 'memorynest') => 
  new Promise((resolve, reject) => {
    console.log('Upload function called'); // Ye bhi add kar
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [{ width: 1200, crop: 'limit' }]
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]', JSON.stringify(error, null, 2));
          reject(error);
        } else {
          console.log('[Cloudinary Success]', result.secure_url);
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });