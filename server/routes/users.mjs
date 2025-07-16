import express from 'express';
import jwt from 'jsonwebtoken';
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

// Get all users with pagination and filters
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') {
      query.role = role;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const users = await db.collection('admins')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .project({ password: 0 }) // Exclude password from results
      .toArray();

    const total = await db.collection('admins').countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Approve a pending user
router.post('/approve/:id', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await db.collection('admins').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'pending') {
      return res.status(400).json({ message: 'User is not pending approval' });
    }

    await db.collection('admins').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          role: 'admin',
          status: 'active',
          approvedAt: new Date(),
          approvedBy: req.user.userId
        }
      }
    );

    res.json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Server error while approving user' });
  }
});

// Update user role
router.put('/role/:id', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const userId = req.params.id;
    const { role } = req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be admin or user.' });
    }

    // Only superadmin can change roles to/from superadmin
    if (role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can assign superadmin role' });
    }

    const user = await db.collection('admins').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    await db.collection('admins').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          role,
          updatedAt: new Date(),
          updatedBy: req.user.userId
        }
      }
    );

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
});

// Delete user (superadmin only)
router.delete('/:id', verifySuperAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await db.collection('admins').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Prevent deleting other superadmins
    if (user.role === 'superadmin') {
      return res.status(400).json({ message: 'Cannot delete superadmin accounts' });
    }

    await db.collection('admins').deleteOne({ _id: new ObjectId(userId) });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

// Update user status
router.put('/status/:id', verifyAdmin, async (req, res) => {
  try {
    const db = getDb().connection;
    const userId = req.params.id;
    const { status } = req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await db.collection('admins').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent changing own status
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot change your own status' });
    }

    await db.collection('admins').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          status,
          updatedAt: new Date(),
          updatedBy: req.user.userId
        }
      }
    );

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

export default router;