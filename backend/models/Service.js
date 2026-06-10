// backend/models/Service.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js'; // ← Ye line add kar

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes); // ← Ye line add kar

console.log('[Server] Services API: http://localhost:10000/api/services'); // ← Ye bhi add kar

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`[Server] Running at http://localhost:${PORT}`);
});