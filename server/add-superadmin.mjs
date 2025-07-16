import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connectToDatabase } from './db/conn.mjs';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Define Admin schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  role: { type: String, default: 'pending', enum: ['pending', 'admin', 'superadmin'] },
  createdAt: { type: Date, default: Date.now }
});

// Create Admin model
const Admin = mongoose.model('Admin', AdminSchema, 'admins');

async function addSuperadmin() {
  try {
    // First establish the connection
    await connectToDatabase();
    console.log('Database connection established');
    
    const superadminData = {
      username: 'superadmin',
      password: await bcrypt.hash('SuperAdminPass123!', 10),
      email: 'mdzaidtalha9696@gmail.com',
      role: 'superadmin',
      createdAt: new Date()
    };
    
    // Check if superadmin already exists
    const existingSuperadmin = await Admin.findOne({ email: superadminData.email });
    if (existingSuperadmin) {
      console.log('Superadmin already exists with email:', superadminData.email);
      return;
    }
    
    // Create new superadmin
    const superadmin = new Admin(superadminData);
    const result = await superadmin.save();
    console.log('Superadmin created successfully:', superadminData.username);
    console.log('Inserted ID:', result._id);
    
    // Verify by fetching all superadmins
    const superadmins = await Admin.find({ role: 'superadmin' }).select('-password');
    console.log('Superadmins in database:', superadmins);
    
  } catch (error) {
    console.error('Error creating superadmin:', error);
  }
}

addSuperadmin();
