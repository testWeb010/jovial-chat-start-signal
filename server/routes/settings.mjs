import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from "../db/conn.mjs";
import mongoose from 'mongoose';


const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to verify superadmin access
const verifySuperAdmin = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Superadmin privileges required.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get site-wide settings
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    
    // Get or create default settings
    let settings = await db.collection('settings').findOne({ type: 'site' });
    
    if (!settings) {
      // Create default settings
      const defaultSettings = {
        type: 'site',
        siteName: 'AcrossMedia Admin',
        siteDescription: 'Professional media management platform',
        theme: 'dark',
        emailNotifications: true,
        autoApprove: false,
        maxFileSize: 10, // MB
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
        timezone: 'UTC',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('settings').insertOne(defaultSettings);
      settings = defaultSettings;
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error while fetching settings' });
  }
});

// Update site-wide settings (superadmin only)
router.put('/', verifySuperAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const {
      siteName,
      siteDescription,
      theme,
      emailNotifications,
      autoApprove,
      maxFileSize,
      allowedFileTypes,
      timezone
    } = req.body;

    const updateData = {
      siteName,
      siteDescription,
      theme,
      emailNotifications,
      autoApprove,
      maxFileSize,
      allowedFileTypes,
      timezone,
      updatedAt: new Date(),
      updatedBy: req.user.userId
    };

    await db.collection('settings').updateOne(
      { type: 'site' },
      { $set: updateData },
      { upsert: true }
    );

    const updatedSettings = await db.collection('settings').findOne({ type: 'site' });
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error while updating settings' });
  }
});

// Get current admin profile
router.get('/profile', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const admin = await db.collection('admins').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update admin profile
router.put('/profile', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const { username, email, currentPassword, newPassword } = req.body;

    const admin = await db.collection('admins').findOne({ _id: new ObjectId(req.user.userId) });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const updateData = {};

    // Update username if provided and different
    if (username && username !== admin.username) {
      // Check if username is already taken
      const existingUser = await db.collection('admins').findOne({ 
        username, 
        _id: { $ne: new ObjectId(req.user.userId) } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      updateData.username = username;
    }

    // Update email if provided and different
    if (email && email !== admin.email) {
      // Check if email is already taken
      const existingUser = await db.collection('admins').findOne({ 
        email, 
        _id: { $ne: new ObjectId(req.user.userId) } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
      updateData.email = email;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set new password' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No changes to update' });
    }

    updateData.updatedAt = new Date();

    await db.collection('admins').updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $set: updateData }
    );

    const updatedAdmin = await db.collection('admins').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    res.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

export default router;