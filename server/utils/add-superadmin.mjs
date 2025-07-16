import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string with fallback
const uri = process.env.NODE_ENV === 'production' ? process.env.ATLAS_URI : process.env.MONGODB_URI;
const fallbackUri = 'mongodb+srv://acrossmedia:Iy9CQ55qhn0GDrUo@cluster0.wf98jeu.mongodb.net/';

console.log('Environment:', process.env.NODE_ENV);
console.log('Using MongoDB URI:', uri || fallbackUri);

async function connectToDB() {
  try {
    const client = new MongoClient(uri || fallbackUri);
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('across-media');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function addSuperadmin() {
  const db = await connectToDB();
  
  const superadminData = {
    username: 'superadmin',
    password: await bcrypt.hash('SuperAdminPass123!', 10),
    email: 'mdzaidtalha9696@gmail.com',
    role: 'superadmin',
    createdAt: new Date()
  };
  
  try {
    const adminsCollection = db.collection('admins');
    // Check if superadmin already exists
    const existingSuperadmin = await adminsCollection.findOne({ email: superadminData.email });
    if (existingSuperadmin) {
      console.log('Superadmin already exists with email:', superadminData.email);
      return;
    }
    
    // Create new superadmin
    const result = await adminsCollection.insertOne(superadminData);
    console.log('Superadmin created successfully:', superadminData.username);
    console.log('Inserted ID:', result.insertedId);
    
    // Verify by fetching all superadmins
    const superadmins = await adminsCollection.find({ role: 'superadmin' }).project({ password: 0 }).toArray();
    console.log('Superadmins in database:', superadmins);
    
  } catch (error) {
    console.error('Error creating superadmin:', error);
  }
}

addSuperadmin();
