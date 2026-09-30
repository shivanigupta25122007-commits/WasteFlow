import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const localMongoUri = 'mongodb://127.0.0.1:27017/waste_management';

export const connectDb = async () => {
  const dbUri = process.env.DB_URI || localMongoUri;

  try {
    await mongoose.connect(dbUri, {
      dbName: 'waste_management',
      family:4,
    });

    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed. Start a local MongoDB instance or set DB_URI in server/.env to a reachable database.');
    throw error;
  }
};

export const closeDb = async () => {
  await mongoose.disconnect();
};

export const ensureSeedData = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@waste.com' });

  if (!existingAdmin) {
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'System Admin',
      email: 'admin@waste.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log('Seed admin user created');
  }
};
