/**
 * config/db.js - MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');

let retryTimer = null;
let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is not set. Server will run without DB connectivity.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`MongoDB connection error: ${error.message}`);

    if (!retryTimer) {
      retryTimer = setInterval(async () => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(retryTimer);
          retryTimer = null;
          isConnected = true;
          return;
        }

        try {
          await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
          isConnected = true;
          console.log('MongoDB reconnected.');
          clearInterval(retryTimer);
          retryTimer = null;
        } catch (err) {
          isConnected = false;
          console.error(`MongoDB retry failed: ${err.message}`);
        }
      }, 30000);
    }

    return false;
  }
};

const getDbStatus = () => ({
  connected: isConnected || mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
});

module.exports = { connectDB, getDbStatus };
