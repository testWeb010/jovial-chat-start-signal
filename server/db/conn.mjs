import mongoose from 'mongoose';
import "dotenv/config";

const connectionString = process.env.ATLAS_URI + 'across-media?retryWrites=true&w=majority';

let dbInstance;

export const connectToDatabase = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await mongoose.connect(connectionString);
    console.log("MongoDB connected successfully");
    // console.log("Connection String:", connectionString);
    // console.log("Database Name:", dbInstance.connection.name);
    return dbInstance;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export const getDb = () => {
  if (!dbInstance) {
    throw new Error("Database not connected");
  }
  return dbInstance;
};
