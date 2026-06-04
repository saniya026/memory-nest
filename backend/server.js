import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB, getMongoHelpMessage } from './config/db.js';
import memoryRoutes from './routes/memoryRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Ye import missing tha

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Ye line missing thi - isliye signup kaam nahi kar raha
app.use('/api/memories', memoryRoutes);

// Health check route
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
  });
};

startServer();