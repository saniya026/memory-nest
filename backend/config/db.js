import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/** Supports MONGODB_URI (primary) or MONGO_URI (common alias) */
export const getMongoUri = () =>
  process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/memorynest';

export const isMongoConnectionError = (err) =>
  err?.name === 'MongooseServerSelectionError' ||
  err?.code === 'ECONNREFUSED' ||
  err?.message?.includes('ECONNREFUSED');

export const getMongoHelpMessage = () => `
MongoDB is not reachable.

Your URI: ${getMongoUri()}

Fix (pick one):
  1) MongoDB Atlas (recommended, free):
     - Create cluster at https://www.mongodb.com/cloud/atlas
     - Database Access → create user
     - Network Access → Add IP → "Allow Access from Anywhere" (0.0.0.0/0)
     - Connect → Drivers → copy connection string
     - Set in backend/.env:
       MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/memorynest

  2) Docker: from project root run
     docker compose up -d

  3) Local install (Windows):
     - Install MongoDB Community Server
     - Start service: net start MongoDB

Then run: npm run check-db
         npm run seed
`;

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = getMongoUri();

  if (!cached.promise) {
    console.log('[MongoDB] Connecting...');
    console.log('[MongoDB] URI:', uri.replace(/:([^:@/]+)@/, ':***@'));

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      })
      .then((instance) => {
        console.log(`[MongoDB] Connected → ${instance.connection.host} / ${instance.connection.name}`);
        return instance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('[MongoDB] Connection failed:', err.message);
        console.error(getMongoHelpMessage());
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export const disconnectDB = async () => {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('[MongoDB] Disconnected');
  }
};
