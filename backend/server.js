import memoryRoutes from './routes/memoryRoutes.js';
import 'dotenv/config';
import app from './app.js';
import { connectDB, getMongoHelpMessage } from './config/db.js';

const PORT = process.env.PORT || 5000;

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
app.use('/api/memories', memoryRoutes);
  app.listen(PORT, () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[Server] Auth API: http://localhost:${PORT}/api/auth/register`);
  });
};

startServer();
