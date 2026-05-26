import Memory from '../models/memory.js'; // ya Memory.js - check kar file ka naam
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Pricing from '../models/Pricing.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'alisaniya026@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Jub@id@1982';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/memorynest');

  // Single admin — demote any other admin accounts (no additional admins allowed)
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
// Add Real Designs/Products
  const designs = [
    {
      name: "Classic Scrapbook",
      price: 499,
      image: "https://res.cloudinary.com/demo/image/upload/v1/samples/bike.jpg",
      description: "Timeless memory book with 20 pages",
      category: "scrapbook"
    },
    {
      name: "Modern Layout", 
      price: 699,
      image: "https://res.cloudinary.com/demo/image/upload/v1/samples/animals/cat.jpg",
      description: "Clean & minimal design with 30 pages",
      category: "scrapbook"
    },
    {
      name: "Vintage Style",
      price: 599,
      image: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/architecture-signs.jpg",
      description: "Retro memories with 25 pages",
      category: "scrapbook"
    }
  ];

  await Memory.deleteMany();
  await Memory.insertMany(designs);
  console.log('Real Designs Added to DB 🔥');
  console.log('Seed completed — admin-only site ready');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  mongoose.disconnect();
  console.log('Seeding Complete');
  process.exit();
  process.exit(1);
});
