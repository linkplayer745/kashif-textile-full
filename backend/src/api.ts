import mongoose from 'mongoose';
import { config } from './config/config';
import app from './app';

const globalAny: any = global;

let cached = globalAny.mongoose;

if (!cached) {
  cached = globalAny.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(config.mongoose.url, config.mongoose.options)
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

const handler = async (req: any, res: any) => {
  await connectToDatabase(); // Safe, cached
  return app(req, res);
};

export default handler;
