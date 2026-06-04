import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Pricing from '../models/Pricing.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'alisaniya026@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/memorynest');

  await User.updateMany(
    { email: { $ne: ADMIN_EMAIL.toLowerCase() }, role: 'admin' },
    { $set: { role: 'user' } }
  );

  let admin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log('Admin account created:', ADMIN_EMAIL);
  } else {
    admin.role = 'admin';
    admin.password = ADMIN_PASSWORD;
    await admin.save();
    console.log('Admin account updated:', ADMIN_EMAIL);
  }

  await Promise.all([
    Service.deleteMany({}),
    Testimonial.deleteMany({}),
    Pricing.deleteMany({}),
  ]);

  await Service.insertMany([
    {
      title: 'Classic Scrapbook',
      description: 'Timeless memory book with soft pastel polaroid layout and handwritten captions.',
      price: 100,
      image: 'https://images.unsplash.com/photo-1518199266791-5375a57590ae?w=600',
      features: ['20 photo slots', 'Pastel theme', 'Delivery in 3 days'],
      category: 'memory-page',
      isActive: true,
      sortOrder: 0,
    },
    {
      title: 'Dreamy Lavender',
      description: 'Lavender tones with floating photo frames, sparkles, and romantic captions.',
      price: 100,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
      features: ['25 photo slots', 'Lavender theme', 'Premium fonts'],
      category: 'memory-page',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'Modern Minimal',
      description: 'Clean minimal design with generous whitespace and elegant typography.',
      price: 699,
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600',
      features: ['30 photo slots', 'Modern layout', 'Fast delivery'],
      category: 'memory-page',
      isActive: true,
      sortOrder: 2,
    },
    {
      title: 'Golden Vintage',
      description: 'Retro scrapbook feel with warm gold accents and film-style borders.',
      price: 549,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
      features: ['22 photo slots', 'Vintage filters', 'Gift-ready PDF'],
      category: 'memory-page',
      isActive: true,
      sortOrder: 3,
    },
  ]);
  console.log('Services (designs) added to database');

  await Testimonial.insertMany([
    {
      name: 'Priya S.',
      role: 'Birthday surprise',
      content: 'MemoryNest turned our photos into the sweetest digital scrapbook. My mom cried happy tears!',
      rating: 5,
    },
    {
      name: 'Rahul & Meera',
      role: 'Anniversary',
      content: 'The lavender theme was exactly what we wanted. Professional and so personal.',
      rating: 5,
    },
  ]);

  await Pricing.insertMany([
    {
      name: 'Basic',
      price: 100,
      description: 'Perfect to get started',
      features: ['1 custom memory page', 'Basic design', 'Delivery in 2 days'],
      isPopular: true,
      sortOrder: 0,
    },
  ]);

  console.log('Seed completed — admin + services ready');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
