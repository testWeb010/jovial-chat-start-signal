import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { body, validationResult } from 'express-validator';
import validator from 'validator';

// Security Headers Middleware - Protects against XSS, clickjacking, and other attacks
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3001"],
      frameSrc: ["'self'", "https://www.youtube.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  // frameguard is handled by CSP's frame-src directive
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Brute Force Protection - Rate limiting for login attempts
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes.',
    type: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true,
  // Custom key generator for additional security
  keyGenerator: (req) => {
    return req.ip + ':' + req.headers['user-agent'];
  }
});

// Progressive delay for suspicious activity - Password Spraying Protection
export const progressiveDelay = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 10, // Allow 2 requests per windowMs without delay
  delayMs: (req) => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// Account lockout tracking (in-memory store - use Redis in production)
const accountLockouts = new Map();
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;

export const accountLockoutMiddleware = (req, res, next) => {
  const { username } = req.body;
  
  if (!username) {
    return next();
  }

  const lockoutKey = username.toLowerCase();
  const lockoutData = accountLockouts.get(lockoutKey);

  if (lockoutData && Date.now() < lockoutData.lockedUntil) {
    const remainingTime = Math.ceil((lockoutData.lockedUntil - Date.now()) / 1000 / 60);
    return res.status(423).json({
      error: `Account temporarily locked due to multiple failed login attempts. Try again in ${remainingTime} minutes.`,
      type: 'ACCOUNT_LOCKED'
    });
  }

  // Clean expired lockouts
  if (lockoutData && Date.now() >= lockoutData.lockedUntil) {
    accountLockouts.delete(lockoutKey);
  }

  next();
};

// Function to handle failed login attempts
export const handleFailedLogin = (username) => {
  const lockoutKey = username.toLowerCase();
  const lockoutData = accountLockouts.get(lockoutKey) || { attempts: 0, firstAttempt: Date.now() };

  lockoutData.attempts++;
  lockoutData.lastAttempt = Date.now();

  if (lockoutData.attempts >= MAX_FAILED_ATTEMPTS) {
    lockoutData.lockedUntil = Date.now() + LOCKOUT_DURATION;
    console.log(`Account ${username} locked due to ${lockoutData.attempts} failed attempts`);
  }

  accountLockouts.set(lockoutKey, lockoutData);
};

// Function to handle successful login (reset failed attempts)
export const handleSuccessfulLogin = (username) => {
  const lockoutKey = username.toLowerCase();
  accountLockouts.delete(lockoutKey);
};

// Input validation and sanitization - SQL Injection & XSS Protection
export const validateLoginInput = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    .customSanitizer(value => validator.escape(value)),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
];

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Invalid input data',
      details: errors.array(),
      type: 'VALIDATION_ERROR'
    });
  }
  next();
};

// Session security configuration
export const sessionConfig = {
  httpOnly: true, // Prevents XSS attacks by making cookies inaccessible to JavaScript
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  sameSite: 'strict', // Prevents CSRF attacks
  maxAge: 15 * 60 * 1000, // 15 minutes session timeout
  path: '/'
};

// Anomaly detection for unusual login patterns
const loginPatterns = new Map();

export const detectAnomalousActivity = (req, res, next) => {
  const clientInfo = {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: Date.now()
  };

  const patternKey = `${clientInfo.ip}:${clientInfo.userAgent}`;
  const recentActivity = loginPatterns.get(patternKey) || [];
  
  // Keep only last 10 attempts for pattern analysis
  recentActivity.push(clientInfo.timestamp);
  if (recentActivity.length > 10) {
    recentActivity.shift();
  }

  // Detect rapid-fire attempts (more than 3 attempts in 30 seconds)
  const recentAttempts = recentActivity.filter(time => 
    Date.now() - time < 30 * 1000
  );

  if (recentAttempts.length > 3) {
    req.suspiciousActivity = true;
    console.log(`Suspicious login pattern detected from ${clientInfo.ip}`);
  }

  loginPatterns.set(patternKey, recentActivity);
  next();
};

// Clean up old pattern data periodically
setInterval(() => {
  const cutoff = Date.now() - (60 * 60 * 1000); // 1 hour
  for (const [key, timestamps] of loginPatterns.entries()) {
    const recentTimestamps = timestamps.filter(time => time > cutoff);
    if (recentTimestamps.length === 0) {
      loginPatterns.delete(key);
    } else {
      loginPatterns.set(key, recentTimestamps);
    }
  }
}, 10 * 60 * 1000);
