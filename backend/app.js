import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();

const getAllowedOrigins = () =>
  [
    process.env.CLIENT_URL,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.VERCEL_BRANCH_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const allowed = getAllowedOrigins();
      if (
        allowed.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({
      success: true,
      message: 'MemoryNest API is running',
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      success: false,
      message: 'API running but database is disconnected',
      database: 'disconnected',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', contentRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(errorHandler);

export default app;
