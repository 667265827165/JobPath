import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    'mongodb://127.0.0.1:27017/hrflow';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      console.warn(
        `⚠️  Tip: If deploying on Render/Cloud, set the 'MONGO_URI' or 'MONGODB_URI' environment variable in your Render Dashboard (e.g. MongoDB Atlas connection string).`
      );
    }
    // Attempt reconnection in background after 5s without crashing server
    setTimeout(connectDB, 5000);
  }
};

