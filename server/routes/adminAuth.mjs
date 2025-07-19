import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from "../db/conn.mjs";
import { sendApprovalRequestEmail, sendApprovalNotification } from '../utils/emailService.mjs';
import mongoose from 'mongoose';
import { 
  loginRateLimit, 
  progressiveDelay, 
  accountLockoutMiddleware, 
  handleFailedLogin, 
  handleSuccessfulLogin,
  validateLoginInput,
  handleValidationErrors,
  sessionConfig,
  detectAnomalousActivity
} from '../middleware/securityMiddleware.mjs';
import { 
  validatePasswordStrength, 
  hashPassword, 
  comparePassword, 
  generateJWT, 
  verifyJWT, 
  generateCaptchaChallenge,
  sanitizeInput,
  logSecurityEvent
} from '../utils/securityUtils.mjs';

const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();

// JWT secret key from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// CAPTCHA challenge storage (use Redis in production)
const captchaChallenges = new Map();

// Generate CAPTCHA endpoint
router.get('/captcha', (req, res) => {
  try {
    const challenge = generateCaptchaChallenge();
    captchaChallenges.set(challenge.id, {
      answer: challenge.answer,
      expiresAt: challenge.expiresAt
    });
    
    // Clean expired challenges
    setTimeout(() => {
      captchaChallenges.delete(challenge.id);
    }, 5 * 60 * 1000);
    
    res.json({
      id: challenge.id,
      question: challenge.question
    });
  } catch (error) {
    logSecurityEvent('CAPTCHA_GENERATION_ERROR', { error: error.message }, req);
    res.status(500).json({ error: 'Failed to generate CAPTCHA' });
  }
});

// Enhanced Login route with comprehensive security
router.post('/login', 
  loginRateLimit, 
  progressiveDelay, 
  accountLockoutMiddleware,
  detectAnomalousActivity,
  validateLoginInput,
  handleValidationErrors,
  async (req, res) => {
  try {
    const db = getDb().connection;
    const { username, password, captchaId, captchaAnswer } = req.body;

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    
    // Verify CAPTCHA if suspicious activity detected or after multiple failed attempts
    if (req.suspiciousActivity || captchaId) {
      if (!captchaId || !captchaAnswer) {
        logSecurityEvent('LOGIN_MISSING_CAPTCHA', { username: sanitizedUsername }, req);
        return res.status(400).json({ 
          error: 'CAPTCHA verification required',
          type: 'CAPTCHA_REQUIRED'
        });
      }

      const challenge = captchaChallenges.get(captchaId);
      if (!challenge || Date.now() > challenge.expiresAt || challenge.answer !== captchaAnswer) {
        logSecurityEvent('LOGIN_INVALID_CAPTCHA', { username: sanitizedUsername }, req);
        captchaChallenges.delete(captchaId);
        return res.status(400).json({ 
          error: 'Invalid or expired CAPTCHA',
          type: 'CAPTCHA_INVALID'
        });
      }
      
      // Clean up used CAPTCHA
      captchaChallenges.delete(captchaId);
    }

    // Find admin by username with timing attack protection
    const admin = await db.collection("admins").findOne({ username: sanitizedUsername.trim() });
    
    // Always perform password comparison to prevent timing attacks
    let isValidPassword = false;
    if (admin && admin.role !== 'pending') {
      isValidPassword = await comparePassword(password, admin.password);
    } else {
      // Perform dummy comparison to maintain consistent timing
      await comparePassword(password, '$2b$12$dummy.hash.to.prevent.timing.attacks');
    }

    // Check if account exists and is not pending
    if (!admin) {
      handleFailedLogin(sanitizedUsername);
      logSecurityEvent('LOGIN_INVALID_ACCOUNT', { 
        username: sanitizedUsername,
        accountExists: false
      }, req);
      
      return res.status(401).json({ 
        error: 'Invalid credentials',
        type: 'INVALID_CREDENTIALS'
      });
    }

    if (admin.role === 'pending') {
      handleFailedLogin(sanitizedUsername);
      logSecurityEvent('LOGIN_PENDING_ACCOUNT', { 
        username: sanitizedUsername,
        isPending: true
      }, req);
      
      return res.status(403).json({
        error: 'Your account is still pending approval. Please wait for admin confirmation.',
        type: 'ACCOUNT_PENDING'
      });
    }

    // Validate password
    if (!isValidPassword) {
      handleFailedLogin(sanitizedUsername);
      logSecurityEvent('LOGIN_INVALID_PASSWORD', { username: sanitizedUsername }, req);
      
      return res.status(401).json({ 
        error: 'Invalid credentials',
        type: 'INVALID_CREDENTIALS'
      });
    }

    // Successful login - reset failed attempts
    handleSuccessfulLogin(sanitizedUsername);
    
    // Generate secure JWT
    const token = generateJWT({
      userId: admin._id,
      username: admin.username,
      role: admin.role,
      sessionId: Date.now() // For session tracking
    }, '15m'); // Shorter session for security

    // Set secure HTTP-only cookie
    res.cookie('auth_token', token, sessionConfig);

    // Log successful login
    logSecurityEvent('LOGIN_SUCCESS', {
      username: sanitizedUsername,
      userId: admin._id,
      role: admin.role
    }, req);

    return res.status(200).json({
      success: true,
      message: 'Login successful as admin.',
      sessionTimeout: sessionConfig.maxAge
    });

  } catch (error) {
    logSecurityEvent('LOGIN_ERROR', { 
      error: error.message,
      stack: error.stack 
    }, req);
    
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred during login. Please try again later.',
      type: 'SERVER_ERROR'
    });
  }
});

// Enhanced Logout route
router.post('/logout', (req, res) => {
  try {
    const token = req.cookies.auth_token;
    
    if (token) {
      try {
        const decoded = verifyJWT(token);
        logSecurityEvent('LOGOUT_SUCCESS', {
          username: decoded.username,
          userId: decoded.userId
        }, req);
      } catch (error) {
        // Token was invalid, but we still want to clear the cookie
        logSecurityEvent('LOGOUT_INVALID_TOKEN', {}, req);
      }
    }

    // Clear cookie with same options as when it was set
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Set to a past date to expire immediately
      path: '/'
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Logout successful',
      type: 'SUCCESS'
    });
  } catch (error) {
    logSecurityEvent('LOGOUT_ERROR', { error: error.message }, req);
    res.status(500).json({ 
      error: 'Logout failed',
      type: 'SERVER_ERROR'
    });
  }
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
