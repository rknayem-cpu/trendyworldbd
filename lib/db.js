import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGO_URL || "mongodb+srv://printingcardsnlabel_db_user:oTbcn0J6jHf0YlQb@cluster0.fegwooq.mongodb.net/?appName=Cluster0";

if (!MONGODB_URL) {
  throw new Error('Please define the MONGO_URL environment variable inside .env.local');
}

// Global connection caching for Next.js hot-reloading
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'trendyworld',
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
      console.log('MongoDB Connected Successfully!');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;