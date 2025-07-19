import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Password strength validation
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const maxLength = 128;
  
  const checks = {
    length: password.length >= minLength && password.length <= maxLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
    noCommon: !isCommonPassword(password),
    noRepeating: !hasRepeatingPatterns(password)
  };

  const strength = Object.values(checks).filter(Boolean).length;
  
  return {
    isValid: Object.values(checks).every(Boolean),
    strength: strength / Object.keys(checks).length,
    checks,
    suggestions: generatePasswordSuggestions(checks)
  };
};

// Check against common passwords (simplified list)
const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 
  'password123', 'admin', 'letmein', 'welcome', 'monkey'
];

const isCommonPassword = (password) => {
  return commonPasswords.includes(password.toLowerCase());
};

// Detect repeating patterns
const hasRepeatingPatterns = (password) => {
  // Check for 3+ repeating characters
  const repeatingChar = /(.)\1{2,}/.test(password);
  
  // Check for simple sequences
  const sequences = ['123', 'abc', 'qwe', 'asd', 'zxc'];
  const hasSequence = sequences.some(seq => 
    password.toLowerCase().includes(seq) || 
    password.toLowerCase().includes(seq.split('').reverse().join(''))
  );
  
  return repeatingChar || hasSequence;
};

const generatePasswordSuggestions = (checks) => {
  const suggestions = [];
  
  if (!checks.length) suggestions.push('Use at least 8 characters');
  if (!checks.uppercase) suggestions.push('Add uppercase letters');
  if (!checks.lowercase) suggestions.push('Add lowercase letters');
  if (!checks.number) suggestions.push('Add numbers');
  if (!checks.special) suggestions.push('Add special characters (@$!%*?&)');
  if (!checks.noCommon) suggestions.push('Avoid common passwords');
  if (!checks.noRepeating) suggestions.push('Avoid repeating patterns');
  
  return suggestions;
};

// Secure password hashing
export const hashPassword = async (password) => {
  const saltRounds = 12; // Higher cost for better security
  return await bcrypt.hash(password, saltRounds);
};

// Secure password comparison with timing attack protection
export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    // Always take the same amount of time even if hash is invalid
    await bcrypt.compare(password, '$2b$12$dummy.hash.to.prevent.timing.attacks');
    return false;
  }
};

// Generate secure session tokens
export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate JWT with secure settings
export const generateJWT = (payload, expiresIn = '15m') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
    issuer: 'across-media-app',
    audience: 'across-media-users',
    algorithm: 'HS256'
  });
};

// Verify JWT with enhanced security
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'across-media-app',
      audience: 'across-media-users',
      algorithm: 'HS256'
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Generate CSRF token
export const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('base64');
};

// Generate secure random challenges for MFA
export const generateMFAChallenge = () => {
  return {
    challenge: crypto.randomBytes(32).toString('base64'),
    timestamp: Date.now(),
    expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
  };
};

// Secure random number generation for CAPTCHA
export const generateCaptchaChallenge = () => {
  const operations = ['+', '-', '*'];
  const operation = operations[crypto.randomInt(0, operations.length)];
  
  let num1, num2, answer;
  
  switch (operation) {
    case '+':
      num1 = crypto.randomInt(1, 50);
      num2 = crypto.randomInt(1, 50);
      answer = num1 + num2;
      break;
    case '-':
      num1 = crypto.randomInt(10, 100);
      num2 = crypto.randomInt(1, num1);
      answer = num1 - num2;
      break;
    case '*':
      num1 = crypto.randomInt(2, 12);
      num2 = crypto.randomInt(2, 12);
      answer = num1 * num2;
      break;
  }
  
  return {
    question: `${num1} ${operation} ${num2} = ?`,
    answer: answer.toString(),
    id: crypto.randomBytes(16).toString('hex'),
    expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
  };
};

// Input sanitization utility
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>\"'&]/g, (match) => {
      const entityMap = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entityMap[match];
    });
};

// Rate limiting key generation with enhanced uniqueness
export const generateRateLimitKey = (req) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';
  const forwarded = req.headers['x-forwarded-for'] || '';
  
  // Create a hash of identifying information
  const identifier = crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}:${forwarded}`)
    .digest('hex')
    .substring(0, 16);
    
  return identifier;
};

// Security event logging
export const logSecurityEvent = (eventType, details, req) => {
  const event = {
    timestamp: new Date().toISOString(),
    type: eventType,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    details: details
  };
  
  // In production, send to security monitoring system
  console.log('SECURITY EVENT:', JSON.stringify(event, null, 2));
  
  return event;
};