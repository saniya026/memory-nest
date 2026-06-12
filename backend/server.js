import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB, getMongoHelpMessage } from './config/db.js';
import memoryRoutes from './routes/memoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import designRoutes from './routes/designRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cart.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS FIX - Ab kabhi URL change ka tension nahi
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin like Postman, mobile apps
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    // Localhost ya koi bhi .vercel.app domain allow karo
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Render/old browsers ke liye zaroori
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MemoryNest API Running' });
});

const startServer = async () => {
  console.log('--- MemoryNest API ---');
  console.log(`[Env] PORT=${PORT}`);
  console.log(`[Env] MONGODB_URI set: ${Boolean(process.env.MONGODB_URI || process.env.MONGO_URI)}`);

  try {
    await connectDB();
  } catch (err) {
    console.error('\n[FATAL] Cannot start server without MongoDB.\n');
    if (process.env.NODE_ENV !== 'production') {
      console.error(getMongoHelpMessage());
    }
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[Server] Auth API: http://localhost:${PORT}/api/auth/register`);
    console.log(`[Server] Orders API: http://localhost:${PORT}/api/orders`);
    console.log(`[Server] Services API: http://localhost:${PORT}/api/services`);
    console.log(`[Server] Reviews API: http://localhost:${PORT}/api/reviews`);
    console.log(`[Server] Wishlist API: http://localhost:${PORT}/api/wishlist`);
    console.log(`[Server] Cart API: http://localhost:${PORT}/api/cart/add-custom`);
  });
};

startServer();