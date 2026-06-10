import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Service from '../models/Service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const services = [
  {
    title: "Birthday Memories",
    description: "Adorable birthday card for kids & adults. Add custom name & photo.",
    price: 50,
    category: "Design", // Design category
    imageUrl:"https://res.cloudinary.com/dipj3tdyn/image/upload/v1781077029/WhatsApp_Image_2026-06-10_at_12.39.20_ep7bap.jpg",
    isActive: true
  },
  {
    title: "Anniversary", 
    description: "Minimal anniversary card for your special one. Add couple names & date…",
    price: 50,
    category: "Design", // Design category
    imageUrl: "https://res.cloudinary.com/dipj3tdyn/image/upload/v1781077030/WhatsApp_Image_2026-06-10_at_12.41.55_gku7hs.jpg",
    isActive: true
  },
  {
    title: "Love",
    description: "Simple hand-drawn heart to express your love. Add personal message.",
    price: 50,
    category: "Design", // Design category
    imageUrl: "https://res.cloudinary.com/dipj3tdyn/image/upload/v1781077029/WhatsApp_Image_2026-06-10_at_12.42.37_hl2ik5.jpg",
    isActive: true
  },
  {
    title: "Custom",
    description: "Don't see what you want? Tell us your idea & we'll design it for you.",
    price: 50,
    category: "Other", // Other category
    imageUrl: "https://res.cloudinary.com/dipj3tdyn/image/upload/v1781077039/WhatsApp_Image_2026-06-10_at_12.54.42_scdijv.jpg",
    isActive: true
  }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    await Service.deleteMany({}); 
    await Service.insertMany(services);
    console.log('4 Services added successfully 🔥');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedDB();