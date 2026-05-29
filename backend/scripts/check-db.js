import 'dotenv/config';
import { connectDB, disconnectDB, getMongoUri } from '../config/db.js';

console.log('Testing MongoDB connection...');
console.log('URI:', getMongoUri().replace(/:([^:@/]+)@/, ':***@'));

try {
  await connectDB();
  console.log('SUCCESS: MongoDB is connected. Signup/login will work.');
  await disconnectDB();
  process.exit(0);
} catch (err) {
  console.error('FAILED:', err.message);
  process.exit(1);
}
