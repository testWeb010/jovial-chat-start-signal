import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from "../db/conn.mjs";
import { sendApprovalRequestEmail, sendApprovalNotification } from '../utils/emailService.mjs';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();

// JWT secret key from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  try {
    const db = getDb().connection;
    const { username, password } = req.body;

    // Check if credentials are provided
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Both username and password are required.'
      });
    }

    // Find admin by username (not email)
    const admin = await db.collection("admins").findOne({ username: username.trim() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this username.'
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.'
      });
    }

    // Block login if role is pending
    if (admin.role === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is still pending approval. Please wait for admin confirmation.'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Respond with success and data
    return res.status(200).json({
      success: true,
      message: 'Login successful as admin.',
      // token,
      // data: {
      //   userId: admin._id,
      //   username: admin.username,
      //   email: admin.email,
      //   role: admin.role
      // }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during login. Please try again later.'
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.cookie('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0) // Set to a past date to expire immediately
  });
  res.status(200).json({ success: true, message: 'Logout successful' });
});


router.post('/register', async (req, res) => {
  try {
    const db = getDb().connection;
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: username, email, and password.'
      });
    }

    const trimmedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date();

    const existingUser = await db.collection('admins').findOne({
      $or: [{ username: trimmedUsername }, { email: normalizedEmail }]
    });

    // CASE 1: Already Approved Admin
    if (existingUser && existingUser.role !== 'pending') {
      return res.status(400).json({
        success: false,
        message:
          existingUser.username === trimmedUsername
            ? 'Username is already taken.'
            : 'Email is already registered.'
      });
    }

    // CASE 2: Pending User Logic
    if (existingUser && existingUser.role === 'pending') {
      // Step 1: Handle expired block and reset
      if (existingUser.blockUntil && now > new Date(existingUser.blockUntil)) {
        await db.collection('admins').updateOne(
          { _id: existingUser._id },
          {
            $set: {
              registrationAttempts: 0,
              blockUntil: null
            }
          }
        );
        return res.status(409).json({
          success: false,
          message: 'Account already exists and is pending approval. Please wait for admin approval.'
        });
      }

      // Step 2: Check if user is blocked
      if (existingUser.blockUntil && now <= new Date(existingUser.blockUntil)) {
        const minutesLeft = Math.ceil(
          (new Date(existingUser.blockUntil) - now) / 60000
        );

        return res.status(429).json({
          success: false,
          message: `Too many registration attempts. Please try again in ${minutesLeft} minute(s).`
        });
      }

      // Step 3: Not blocked — increment attempts
      const attempts = (existingUser.registrationAttempts || 0) + 1;

      // If attempts >= 3, block for 10 mins
      if (attempts >= 3) {
        await db.collection('admins').updateOne(
          { _id: existingUser._id },
          {
            $set: {
              registrationAttempts: attempts,
              blockUntil: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            }
          }
        );

        return res.status(429).json({
          success: false,
          message: 'Too many registration attempts. Please try again in 10 minute(s).'
        });
      }

      // Step 4: Less than 3 — update attempts
      await db.collection('admins').updateOne(
        { _id: existingUser._id },
        {
          $set: {
            registrationAttempts: attempts
          }
        }
      );

      return res.status(409).json({
        success: false,
        message: 'Account already exists and is pending approval. Please wait for admin approval.'
      });
    }

    // CASE 3: New User — proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate approval token and expiry
    const crypto = await import('crypto');
    const approvalToken = crypto.randomBytes(32).toString('hex');
    const approvalTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Generate a short-lived session token for PendingApproval page (for frontend use)
    const pendingSessionToken = crypto.randomBytes(16).toString('hex');

    const newUser = {
      username: trimmedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'pending',
      registrationAttempts: 0,
      blockUntil: null,
      createdAt: now,
      approvalToken,
      approvalTokenExpires
    };

    const result = await db.collection('admins').insertOne(newUser);

    // Notify Superadmin
    try {
      const superadmin = await db.collection('admins').findOne({ role: 'superadmin' });
      if (superadmin) {
        const emailResult = await sendApprovalRequestEmail(superadmin.email, newUser); // newUser now has approvalToken
      } else {
        console.warn('No superadmin found to notify.');
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Awaiting admin approval.',
      user: {
        userId: result.insertedId,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      pendingSessionToken // Send token to frontend for session management
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during registration. Please try again later.'
    });
  }
});


// Approve admin (for superadmin only)
router.post('/approve/:id', async (req, res) => {
  try {
    // Extract token from cookie
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    // Verify token and check role
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Unauthorized: Only superadmins can approve admins' });
    }

    const adminId = req.params.id;
    // Use direct collection for consistency with other routes
    const db = getDb().connection;
    const admin = await db.collection('admins').findOne({ _id: adminId });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role !== 'pending') {
      return res.status(400).json({ message: 'Admin is already approved or has a different status' });
    }

    // Update role
    await db.collection('admins').updateOne(
      { _id: adminId },
      { $set: { role: 'admin' } }
    );

    // Send approval notification email to the approved admin
    try {
      const emailResult = await sendApprovalNotification(admin.email, admin.username);
    } catch (emailError) {
      console.error('Failed to send approval notification:', emailError.message);
      // Don't fail the approval process if email sending fails
    }

    res.json({ message: `Admin ${admin.username} approved successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin approval' });
  }
});

// Check auth status
router.get('/check-status', async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.json({ isAuthenticated: false });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // Check if the admin still exists in the database
      const db = getDb().connection;
      const admin = await db.collection('admins').findOne({ username: decoded.username });
      if (!admin) {
        res.clearCookie('auth_token');
        return res.json({ isAuthenticated: false });
      }
      // Check if the role is still pending
      if (admin.role === 'pending') {
        return res.json({ isAuthenticated: true, pendingApproval: true, role: admin.role });
      }
      return res.json({ isAuthenticated: true, pendingApproval: false, role: admin.role });
    } catch (error) {
      res.clearCookie('auth_token');
      return res.json({ isAuthenticated: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during status check' });
  }
});

// Get pending admins (for superadmin only)
router.get('/pending', async (req, res) => {
  try {
    // Extract token from cookie
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    // Verify token and check role
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Unauthorized: Only superadmins can view pending admins' });
    }

    const db = getDb().connection;
    const pendingAdmins = await db.collection('admins').find({ role: 'pending' }).toArray();
    res.json(pendingAdmins);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching pending admins' });
  }
});

export default router;
