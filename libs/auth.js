import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'tomarryimmaculate  -highschool-secret-key-2024';
const JWT_EXPIRES_IN = '12h';

// Helpers
const validateEnvironment = () => {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set.');
    return false;
  }
  return true;
};

// Password Hashing
export const hashPassword = async (password) => {
  try {
    if (!validateEnvironment()) {
      throw new Error('Server configuration error');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    throw new Error('Password processing failed');
  }
};

// Password Verification
export const verifyPassword = async (password, hashedPassword) => {
  try {
    if (!validateEnvironment()) {
      throw new Error('Server configuration error');
    }

    if (!password || !hashedPassword) {
      throw new Error('Password and hashed password are required');
    }

    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('❌ Error verifying password:', error);
    throw new Error('Password verification failed');
  }
};

// JWT Token Generation
export const generateToken = (user) => {
  try {
    if (!validateEnvironment()) {
      throw new Error('Server configuration error');
    }

    if (!user || !user.id || !user.email) {
      throw new Error('Valid user data is required');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iss: 'marryimmaculate  -highschool',
      aud: 'marryimmaculate  -highschool-app',
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      algorithm: 'HS256'
    });
  } catch (error) {
    console.error('❌ Error generating token:', error);
    throw new Error('Token generation failed');
  }
};

// JWT Token Verification
export const verifyToken = (token) => {
  try {
    if (!validateEnvironment()) {
      throw new Error('Server configuration error');
    }

    if (!token) {
      throw new Error('Token is required');
    }

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      throw new Error('Token has expired');
    }

    return decoded;
  } catch (error) {
    console.error('❌ Error verifying token:', error);
    
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    
    throw new Error('Token verification failed');
  }
};

// Extract token from request headers
export const getTokenFromHeaders = (headers) => {
  try {
    if (!headers) {
      throw new Error('Headers are required');
    }

    const authHeader = headers.get('authorization');
    if (!authHeader) {
      return null;
    }

    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return authHeader;
  } catch (error) {
    console.error('❌ Error extracting token from headers:', error);
    throw new Error('Token extraction failed');
  }
};

// User data sanitization
export const sanitizeUser = (user) => {
  try {
    if (!user) {
      return null;
    }

    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  } catch (error) {
    console.error('❌ Error sanitizing user data:', error);
    throw new Error('User data sanitization failed');
  }
};

// Token refresh
export const refreshToken = (oldToken) => {
  try {
    if (!validateEnvironment()) {
      throw new Error('Server configuration error');
    }

    if (!oldToken) {
      throw new Error('Old token is required');
    }

    const decoded = verifyToken(oldToken);
    
    // Remove iat and exp from old token
    const { iat, exp, ...userPayload } = decoded;
    
    // Generate new token with fresh expiry
    return jwt.sign(userPayload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      algorithm: 'HS256'
    });
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    throw new Error('Token refresh failed');
  }
};

// Check if token is about to expire (within 1 hour)
export const isTokenExpiringSoon = (token) => {
  try {
    const decoded = verifyToken(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;
    const oneHour = 60 * 60;
    
    return timeUntilExpiry <= oneHour;
  } catch (error) {
    console.error('❌ Error checking token expiry:', error);
    return true;
  }
};

// Get token expiration timestamp
export const getTokenExpiryTimestamp = () => {
  return Date.now() + (12 * 60 * 60 * 1000); // 12 hours from now
};
