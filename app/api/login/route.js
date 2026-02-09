// /app/api/login/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import { verifyPassword, generateToken, sanitizeUser } from '../../../libs/auth';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Constants
const MAX_FAILED_ATTEMPTS = 3;
const MAX_LOGIN_ATTEMPTS_BEFORE_VERIFY = 15; // Auto-expire after 15 logins
const VERIFICATION_CODE_EXPIRY_MINUTES = 15;
const VERIFICATION_CODE_LENGTH = 6;
const DEVICE_TOKEN_EXPIRY_DAYS = 10; // Token expires after 10 days

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ====================
// EMAIL TEMPLATE FOR VERIFICATION CODE
// ====================
function getVerificationEmailTemplate(user, verificationCode) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <title>Verification Code - Mary Immaculate girls </title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f7fafc; padding: 20px; }
        .container { max-width: 550px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
        .header p { opacity: 0.9; font-size: 14px; }
        .content { padding: 35px; }
        .code-box { background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; border: 1px solid #a5d6a7; }
        .code { font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #047857; font-family: monospace; margin: 15px 0; }
        .instructions { color: #4a5568; font-size: 15px; line-height: 1.7; margin: 20px 0; }
        .warning { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
        .details-box { background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin: 25px 0; }
        .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edf2f7; }
        .detail-item:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #4a5568; }
        .detail-value { color: #2d3748; font-weight: 500; }
        .footer { background: #1a202c; color: #cbd5e0; padding: 25px; text-align: center; font-size: 12px; }
        .footer a { color: #63b3ed; text-decoration: none; }
        .expiry-note { color: #718096; font-size: 13px; text-align: center; margin-top: 15px; }
        .resend-info { text-align: center; margin-top: 20px; font-size: 13px; color: #718096; }
        @media (max-width: 600px) {
          .content { padding: 20px; }
          .code { font-size: 32px; letter-spacing: 8px; }
          .header { padding: 25px 20px; }
          .header h1 { font-size: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Login Verification</h1>
          <p>Mary Immaculate  School Admin System</p>
        </div>
        
        <div class="content">
          <h2 style="color: #2d3748; margin-bottom: 10px;">Hello ${user.name},</h2>
          <p class="instructions">
            We detected a login attempt to your admin account. To complete your login, please use the verification code below:
          </p>
          
          <div class="code-box">
            <p style="color: #047857; font-weight: 600; margin-bottom: 10px;">Your 6-digit verification code:</p>
            <div class="code">${verificationCode}</div>
            <p style="color: #2e7d32; font-size: 14px; margin-top: 10px;">Enter this code on the login verification page</p>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <p style="margin-top: 8px;">
              If you didn't attempt to login to your account, please change your password immediately and contact support.
              This could indicate unauthorized access attempts.
            </p>
          </div>
          
          <div class="details-box">
            <div class="detail-item">
              <span class="detail-label">👤 Account:</span>
              <span class="detail-value">${user.email}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">👑 Role:</span>
              <span class="detail-value">${user.role}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">🕒 Time:</span>
              <span class="detail-value">${new Date().toLocaleString()}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">🌐 IP Address:</span>
              <span class="detail-value">[Detected during login]</span>
            </div>
          </div>
          
          <p class="expiry-note">
            ⏰ This code will expire in <strong>${VERIFICATION_CODE_EXPIRY_MINUTES} minutes</strong>.
            Do not share this code with anyone.
          </p>
          
          <div class="resend-info">
            <p>Didn't receive the code? You can request a new one on the login page.</p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin-bottom: 10px; font-size: 14px; color: #e2e8f0;">
            <strong>Mary Immaculate Girls School</strong><br>
            Mweiga, Nyeri County
          </p>
          <p style="margin-bottom: 10px;">
            📞 +254720123456 | 📧 info@maryimmaculategirls.sc.ke
          </p>
          <p style="font-size: 11px; opacity: 0.8;">
            This is an automated security message. Please do not reply to this email.<br>
            © ${new Date().getFullYear()} Mary Immaculate Girls School. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ====================
// HELPER FUNCTIONS
// ====================

// Node.js compatible base64 functions
function base64Encode(str) {
  return Buffer.from(str, 'utf-8').toString('base64');
}

function base64Decode(str) {
  return Buffer.from(str, 'base64').toString('utf-8');
}

// Base64 URL decode
function base64UrlDecode(str) {
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  const pad = str.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error('Invalid base64 string');
    }
    str += '==='.slice(pad);
  }
  
  return Buffer.from(str, 'base64').toString('utf-8');
}

// Generate 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate device hash with more parameters
function generateDeviceHash(req) {
  const userAgent = req.headers.get('user-agent') || '';
  const accept = req.headers.get('accept') || '';
  const language = req.headers.get('accept-language') || '';
  const platform = req.headers.get('sec-ch-ua-platform') || '';
  const screen = req.headers.get('sec-ch-ua-resolution') || 'unknown';
  
  // Include more device info for better fingerprint
  const deviceString = `${userAgent}|${accept}|${language}|${platform}|${screen}`;
  return crypto.createHash('sha256').update(deviceString).digest('hex').substring(0, 32);
}

// Check recent failed attempts
async function checkFailedAttempts(email) {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  
  const failedAttempts = await prisma.loginAttempt.count({
    where: {
      email: email.toLowerCase(),
      status: 'failed',
      reason: 'wrong_password',
      attemptedAt: { gte: fifteenMinutesAgo }
    }
  });
  
  return failedAttempts;
}

// Store verification code
async function storeVerificationCode(email, code, deviceHash) {
  const expires = new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000);
  
  // Delete any existing codes for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email }
  });
  
  // Store new code
  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: code,
      expires: expires
    }
  });
  
  return verificationToken;
}

// Send verification email
async function sendVerificationEmail(user, verificationCode) {
  try {
    const mailOptions = {
      from: {
        name: 'Mary Immaculate Girls School Security',
        address: process.env.EMAIL_USER
      },
      to: user.email,
      subject: `🔐 Your Verification Code: ${verificationCode} - Mary Immaculate Girls School`,
      html: getVerificationEmailTemplate(user, verificationCode)
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Verification code sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw error;
  }
}

// Generate device token for localStorage
function generateDeviceToken(userId, deviceHash, currentLoginCount = 1) {
  const payload = {
    userId: userId,
    deviceHash: deviceHash,
    loginCount: currentLoginCount,
    createdAt: new Date().toISOString(),
    exp: Math.floor(Date.now() / 1000) + (DEVICE_TOKEN_EXPIRY_DAYS * 24 * 60 * 60),
    iat: Math.floor(Date.now() / 1000),
    version: '1.0'
  };
  
  const payloadStr = JSON.stringify(payload);
  return base64Encode(payloadStr);
}

function verifyDeviceToken(token, deviceHash) {
    try {
        console.log('🔐 Verifying token format...');
        let payloadStr;
        
        // Check if it's a JWT (has dots)
        if (token.includes('.')) {
            const parts = token.split('.');
            if (parts.length === 3) {
                // JWT format - decode the payload (middle part)
                payloadStr = Buffer.from(parts[1], 'base64').toString('utf-8');
                console.log('📝 Token is JWT format');
            } else {
                return { valid: false, reason: 'invalid_jwt_format' };
            }
        } else {
            // Try as simple base64
            try {
                payloadStr = Buffer.from(token, 'base64').toString('utf-8');
                console.log('📝 Token is simple base64');
            } catch (e) {
                // Try URL-safe base64
                try {
                    payloadStr = Buffer.from(token.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
                    console.log('📝 Token is URL-safe base64');
                } catch (e2) {
                    return { valid: false, reason: 'invalid_base64' };
                }
            }
        }
        
        const payload = JSON.parse(payloadStr);
        
        console.log('📊 Token payload:', {
            userId: payload.userId,
            deviceHash: payload.deviceHash ? `${payload.deviceHash.substring(0, 10)}...` : 'missing',
            loginCount: payload.loginCount,
            exp: payload.exp,
            createdAt: payload.createdAt
        });
        
        // Check expiration
        if (!payload.exp) {
            return { valid: false, reason: 'missing_expiry' };
        }
        
        if (payload.exp * 1000 <= Date.now()) {
            return { valid: false, reason: 'expired' };
        }
        
        // Check device hash matches
        if (payload.deviceHash && payload.deviceHash !== deviceHash) {
            return { valid: false, reason: 'device_mismatch' };
        }
        
        return { valid: true, payload };
    } catch (error) {
        console.error('❌ Token verification error:', error);
        return { valid: false, reason: 'invalid_token' };
    }
}

// ====================
// RESET DEVICE COUNTS FUNCTION
// ====================
async function resetDeviceCounts(userId, deviceHash) {
    try {
        console.log('🔄 Resetting device counts for:', { 
            userId, 
            deviceHash: deviceHash.substring(0, 10) + '...' 
        });
        
        const expiresAt = new Date(Date.now() + DEVICE_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        
        const device = await prisma.deviceToken.upsert({
            where: {
                userId_deviceHash: {
                    userId: userId,
                    deviceHash: deviceHash
                }
            },
            update: {
                lastUsed: new Date(),
                expiresAt: expiresAt,
                isTrusted: true,
                loginCount: 1, // RESET to 1 (current login)
                countsResetAt: new Date(), // Track when counts were reset
                isCountsReset: true
            },
            create: {
                userId: userId,
                deviceHash: deviceHash,
                deviceName: 'Device after verification',
                lastUsed: new Date(),
                expiresAt: expiresAt,
                isTrusted: true,
                loginCount: 1,
                countsResetAt: new Date(),
                isCountsReset: true
            }
        });
        
        console.log('✅ Device counts reset:', {
            loginCount: device.loginCount,
            expiresAt: device.expiresAt.toISOString(),
            countsResetAt: device.countsResetAt.toISOString()
        });
        
        return device;
    } catch (error) {
        console.error('❌ Error resetting device counts:', error);
        throw error;
    }
}

async function checkDeviceVerification(userId, deviceHash, clientLoginCount = 0, clientDeviceToken = null) {
    try {
        console.log('🔍 Device verification check:', { 
            userId, 
            deviceHash: deviceHash.substring(0, 10) + '...',
            hasToken: !!clientDeviceToken,
            tokenLength: clientDeviceToken ? clientDeviceToken.length : 0
        });
        
        // CASE 1: No client device token - treat as new device
        if (!clientDeviceToken) {
            console.log('📱 No client device token - new device');
            return { 
                requiresVerification: true, 
                reason: 'new_device',
                shouldResetAfterVerification: true
            };
        }

        // CASE 2: Validate client device token
        console.log('🔐 Token to verify:', clientDeviceToken.substring(0, 50) + '...');
        const tokenValid = verifyDeviceToken(clientDeviceToken, deviceHash);
        
        if (!tokenValid.valid) {
            console.log('❌ Client token invalid:', tokenValid.reason);
            return { 
                requiresVerification: true, 
                reason: tokenValid.reason,
                shouldResetAfterVerification: tokenValid.reason === 'expired' || tokenValid.reason === 'max_logins_reached'
            };
        }

        console.log('✅ Token structure valid, payload:', {
            userId: tokenValid.payload.userId,
            loginCount: tokenValid.payload.loginCount,
            expiresAt: new Date(tokenValid.payload.exp * 1000).toLocaleString()
        });

        // CASE 3: Check if token has expired or expiring soon
        const currentTime = Math.floor(Date.now() / 1000);
        const tokenExpiry = tokenValid.payload.exp;
        
        // Already expired
        if (tokenExpiry <= currentTime) {
            console.log('⏰ Token expired:', {
                expiry: new Date(tokenExpiry * 1000).toLocaleString(),
                current: new Date(currentTime * 1000).toLocaleString()
            });
            return { 
                requiresVerification: true, 
                reason: 'expired',
                shouldResetAfterVerification: true
            };
        }

        // Check if expiring within 1 day
        const oneDayInSeconds = 24 * 60 * 60;
        if (tokenExpiry <= (currentTime + oneDayInSeconds)) {
            console.log('⚠️ Token expiring soon');
            return { 
                requiresVerification: true, 
                reason: 'token_expiring_soon',
                shouldResetAfterVerification: false
            };
        }

        // CASE 4: Check max login attempts from token
        const loginCount = tokenValid.payload.loginCount || 0;
        if (loginCount >= MAX_LOGIN_ATTEMPTS_BEFORE_VERIFY) {
            console.log('🚫 Max login attempts reached in token:', loginCount);
            return { 
                requiresVerification: true, 
                reason: 'max_logins_reached',
                shouldResetAfterVerification: true
            };
        }

        // CASE 5: Check database for device trust status
        const device = await prisma.deviceToken.findFirst({
            where: {
                userId: userId,
                deviceHash: deviceHash,
                isBlocked: false
            }
        });

        // No device record found in database - new device
        if (!device) {
            console.log('📱 No device record in database');
            return { 
                requiresVerification: true, 
                reason: 'no_device_record',
                shouldResetAfterVerification: true
            };
        }

        // Device is not trusted
        if (!device.isTrusted) {
            console.log('🔐 Device not trusted in database');
            return { 
                requiresVerification: true, 
                reason: 'device_not_trusted',
                shouldResetAfterVerification: false
            };
        }

        // Check if device token has expired in database
        if (device.expiresAt <= new Date()) {
            console.log('⏰ Device token expired in database');
            return { 
                requiresVerification: true, 
                reason: 'device_expired',
                shouldResetAfterVerification: true
            };
        }

        // Check database login count
        if (device.loginCount >= MAX_LOGIN_ATTEMPTS_BEFORE_VERIFY) {
            console.log('🚫 Max login attempts reached in database:', device.loginCount);
            return { 
                requiresVerification: true, 
                reason: 'max_logins_reached',
                shouldResetAfterVerification: true
            };
        }

        // DEVICE IS TRUSTED AND VALID - NO VERIFICATION NEEDED
        console.log('✅ Device trusted - no verification required. Login count:', device.loginCount);
        return { 
            requiresVerification: false,
            deviceId: device.id,
            currentLoginCount: device.loginCount,
            expiresAt: device.expiresAt,
            shouldResetAfterVerification: false
        };

    } catch (error) {
        console.error('❌ Error checking device verification:', error);
        return { 
            requiresVerification: true, 
            reason: 'verification_error',
            shouldResetAfterVerification: false
        };
    }
}

// Update device login count (regular increment)
async function updateDeviceLoginCount(userId, deviceHash, userAgent, shouldReset = false) {
  const expiresAt = new Date(Date.now() + DEVICE_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  const updateData = {
    lastUsed: new Date(),
    expiresAt: expiresAt,
    isTrusted: true,
    loginCount: shouldReset ? 1 : { increment: 1 }
  };
  
  // If resetting, add reset tracking
  if (shouldReset) {
    updateData.countsResetAt = new Date();
    updateData.isCountsReset = true;
  }
  
  const device = await prisma.deviceToken.upsert({
    where: {
      userId_deviceHash: {
        userId: userId,
        deviceHash: deviceHash
      }
    },
    update: updateData,
    create: {
      userId: userId,
      deviceHash: deviceHash,
      deviceName: userAgent.substring(0, 100),
      lastUsed: new Date(),
      expiresAt: expiresAt,
      isTrusted: true,
      loginCount: 1,
      countsResetAt: shouldReset ? new Date() : null,
      isCountsReset: shouldReset || false
    }
  });
  
  return device;
}

// ====================
// VERIFICATION ENDPOINT
// ====================
async function handleVerification(email, code, deviceHash, req, clientLoginCount = 0, password = null) {
  try {
    // Find verification code
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code,
        expires: { gt: new Date() }
      }
    });

    if (!verificationToken) {
      return {
        success: false,
        error: 'Invalid or expired verification code'
      };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Check if this verification was triggered by multiple failed attempts
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const recentFailedPasswordAttempts = await prisma.loginAttempt.count({
      where: {
        email: email.toLowerCase(),
        status: 'failed',
        reason: 'wrong_password',
        attemptedAt: { gte: fifteenMinutesAgo }
      }
    });

// Always verify password if provided
if (password) {
  const isPasswordValid = await verifyPassword(password, user.password);
  
  if (!isPasswordValid) {
    return {
      success: false,
      error: 'Incorrect password',
      email: email
    };
  }
}


    // Regular login flow (password was correct or no password needed)
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Check if we need to reset counts (check device verification status)
    const deviceVerificationCheck = await checkDeviceVerification(
      user.id,
      deviceHash,
      clientLoginCount,
      null // Don't pass token to force fresh check
    );
    
    const shouldResetCounts = deviceVerificationCheck.shouldResetAfterVerification || 
                             deviceVerificationCheck.reason === 'max_logins_reached' ||
                             deviceVerificationCheck.reason === 'expired' ||
                             deviceVerificationCheck.reason === 'device_expired';
    
    // Store/update device in database WITH RESET if needed
    const device = await updateDeviceLoginCount(
      user.id,
      deviceHash,
      userAgent,
      shouldResetCounts
    );
    
    // Delete used verification code
    await prisma.verificationToken.delete({
      where: { token: code }
    });

    // Generate tokens with RESET login count
    const authToken = generateToken(user);
    const deviceToken = generateDeviceToken(user.id, deviceHash);
    
    // Update login count in device token (use reset value if applicable)
    const deviceTokenPayload = JSON.parse(base64Decode(deviceToken));
    deviceTokenPayload.loginCount = device.loginCount;
    const updatedDeviceToken = base64Encode(JSON.stringify(deviceTokenPayload));
    
    const userData = sanitizeUser(user);

    return {
      success: true,
      message: 'Login successful',
      user: userData,
      email: user.email,
      token: authToken,
      deviceToken: updatedDeviceToken,
      storeInLocalStorage: true,
      loginCount: device.loginCount,
      verificationCompleted: true,
      countsWereReset: shouldResetCounts
    };

  } catch (error) {
    console.error('❌ Verification error:', error);
    return {
      success: false,
      error: 'Verification failed. Please try again.',
      email: email
    };
  }
}

// ====================
// ====================
// MAIN LOGIN HANDLER - COMPLETE FIXED VERSION
// ====================
export async function POST(request) {
  try {
    // Parse the request body ONCE and store all variables
    const requestBody = await request.json();
    
    // Destructure ALL needed fields from the SINGLE parsed body
    const { 
      email, 
      password, 
      verificationCode, 
      action,
      clientDeviceToken,
      clientLoginCount,
      clientDeviceHash,
      shouldResetCounts, // Add this
      skipDeviceCheck // Add this if using
    } = requestBody;
    
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const serverDeviceHash = generateDeviceHash(request);
    const deviceHash = clientDeviceHash || serverDeviceHash;

    console.log('🔍 Login request:', { 
      email: email ? `${email.substring(0, 3)}...` : 'none', 
      action,
      hasVerificationCode: !!verificationCode,
      hasPassword: !!password,
      hasDeviceToken: !!clientDeviceToken,
      shouldResetCounts: shouldResetCounts
    });

    // ====================
    // 1. VERIFY CODE FLOW (OTP verification)
    // ====================
    if (action === 'verify' && verificationCode) {
      console.log('🔐 OTP verification flow for:', email);
      
      // Find verification code
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          identifier: email,
          token: verificationCode,
          expires: { gt: new Date() }
        }
      });

      if (!verificationToken) {
        return NextResponse.json({
          success: false,
          error: 'Invalid or expired verification code'
        }, { status: 400 });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email }
      });

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 });
      }

      // Determine if we should reset counts
      // Get verification reason from somewhere (you need to pass this from frontend)
      // For now, we'll use shouldResetCounts from the request body
      const shouldReset = shouldResetCounts === true;
      
      console.log('🔄 Reset check:', {
        shouldResetCounts: shouldResetCounts,
        shouldReset: shouldReset
      });
      
      if (shouldReset) {
        console.log('🔄 Resetting device counts...');
        
        // RESET device counts (start fresh from 1)
        const device = await resetDeviceCounts(user.id, deviceHash);
        
        // Delete used verification code
        await prisma.verificationToken.delete({
          where: { token: verificationCode }
        });

        // Generate tokens with RESET login count (1)
        const authToken = generateToken(user);
        const deviceToken = generateDeviceToken(user.id, deviceHash);
        
        // Update login count in device token
        const deviceTokenPayload = JSON.parse(base64Decode(deviceToken));
        deviceTokenPayload.loginCount = 1;
        const updatedDeviceToken = base64Encode(JSON.stringify(deviceTokenPayload));
        
        const userData = sanitizeUser(user);

        // Log successful verification with reset
        await prisma.loginAttempt.create({
          data: {
            userId: user.id,
            email: user.email,
            ipAddress: ipAddress,
            userAgent: userAgent,
            deviceHash: deviceHash,
            status: 'success',
            reason: 'otp_verified_counts_reset'
          }
        });

        console.log('✅ OTP verification successful with RESET counts for:', user.email);

        return NextResponse.json({
          success: true,
          message: 'Login successful! Device verification counts have been reset.',
          user: userData,
          email: user.email,
          token: authToken,
          deviceToken: updatedDeviceToken,
          storeInLocalStorage: true,
          loginCount: 1,
          directLogin: true,
          countsWereReset: true
        }, { status: 200 });
      } else {
        // Regular verification without reset
        // Update device login count (increment by 1)
        const device = await updateDeviceLoginCount(
          user.id,
          deviceHash,
          userAgent,
          false // Don't reset
        );
        
        // Delete used verification code
        await prisma.verificationToken.delete({
          where: { token: verificationCode }
        });

        // Generate tokens with incremented login count
        const authToken = generateToken(user);
        const deviceToken = generateDeviceToken(user.id, deviceHash);
        
        // Update login count in device token
        const deviceTokenPayload = JSON.parse(base64Decode(deviceToken));
        deviceTokenPayload.loginCount = device.loginCount;
        const updatedDeviceToken = base64Encode(JSON.stringify(deviceTokenPayload));
        
        const userData = sanitizeUser(user);

        // Log successful verification
        await prisma.loginAttempt.create({
          data: {
            userId: user.id,
            email: user.email,
            ipAddress: ipAddress,
            userAgent: userAgent,
            deviceHash: deviceHash,
            status: 'success',
            reason: 'otp_verified'
          }
        });

        console.log('✅ OTP verification successful for:', user.email);

        return NextResponse.json({
          success: true,
          message: 'Login successful!',
          user: userData,
          email: user.email,
          token: authToken,
          deviceToken: updatedDeviceToken,
          storeInLocalStorage: true,
          loginCount: device.loginCount,
          directLogin: true,
          countsWereReset: false
        }, { status: 200 });
      }
    }

    // ====================
    // 2. PASSWORD + VERIFICATION FLOW (for failed attempts)
    // ====================
    if (action === 'verify_password' && verificationCode && password) {
      console.log('🔐 Password + OTP flow for:', email);
      
      // Find verification code
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          identifier: email,
          token: verificationCode,
          expires: { gt: new Date() }
        }
      });

      if (!verificationToken) {
        return NextResponse.json({
          success: false,
          error: 'Invalid or expired verification code'
        }, { status: 400 });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email }
      });

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 });
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        // Password is wrong after OTP
        return NextResponse.json({
          success: false,
          error: 'Incorrect password'
        }, { status: 401 });
      }

      // Password is correct - complete login with RESET COUNTS
      // RESET device counts (start fresh from 1)
      const device = await resetDeviceCounts(user.id, deviceHash);
      
      // Delete used verification code
      await prisma.verificationToken.delete({
        where: { token: verificationCode }
      });

      // Generate tokens with RESET login count (1)
      const authToken = generateToken(user);
      const deviceToken = generateDeviceToken(user.id, deviceHash);
      
      // Update login count in device token
      const deviceTokenPayload = JSON.parse(base64Decode(deviceToken));
      deviceTokenPayload.loginCount = 1; // Always reset to 1 after verification
      const updatedDeviceToken = base64Encode(JSON.stringify(deviceTokenPayload));
      
      const userData = sanitizeUser(user);

      // Log successful login
      await prisma.loginAttempt.create({
        data: {
          userId: user.id,
          email: user.email,
          ipAddress: ipAddress,
          userAgent: userAgent,
          deviceHash: deviceHash,
          status: 'success',
          reason: 'password_correct_after_otp_counts_reset'
        }
      });

      console.log('✅ Password + OTP verification successful with RESET counts for:', user.email);

      return NextResponse.json({
        success: true,
        message: 'Login successful! Device verification counts have been reset.',
        user: userData,
        email: user.email,
        token: authToken,
        deviceToken: updatedDeviceToken,
        storeInLocalStorage: true,
        loginCount: 1, // Always 1 after reset
        directLogin: true,
        countsWereReset: true
      }, { status: 200 });
    }

    // ====================
    // 3. RESEND CODE FLOW
    // ====================
    if (action === 'resend') {
      console.log('🔄 Resend code for:', email);
      const user = await prisma.user.findUnique({ 
        where: { email: email.toLowerCase().trim() } 
      });
      
      if (!user) {
        return NextResponse.json({ 
          success: false,
          error: 'User not found' 
        }, { status: 404 });
      }

      // Generate new code
      const newCode = generateVerificationCode();
      await storeVerificationCode(email, newCode, deviceHash);
      await sendVerificationEmail(user, newCode);

      return NextResponse.json({
        success: true,
        message: 'New verification code sent to your email'
      }, { status: 200 });
    }

    // ====================
    // 4. NORMAL LOGIN FLOW
    // ====================
    if (!email || !password) {
      return NextResponse.json({ 
        success: false,
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    console.log('🔑 Normal login attempt for:', email);

    // Find user
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });
    
    if (!user) {
      console.log('❌ User not found:', email);
      // Log failed attempt
      await prisma.loginAttempt.create({
        data: {
          email: email.toLowerCase(),
          ipAddress: ipAddress,
          userAgent: userAgent,
          deviceHash: deviceHash,
          status: 'failed',
          reason: 'user_not_found'
        }
      });
      
      return NextResponse.json({ 
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    console.log('👤 User found:', user.id, 'Role:', user.role);

    // Check password
    if (!user.password) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid authentication method' 
      }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      // Log failed attempt
      await prisma.loginAttempt.create({
        data: {
          userId: user.id,
          email: user.email,
          ipAddress: ipAddress,
          userAgent: userAgent,
          deviceHash: deviceHash,
          status: 'failed',
          reason: 'wrong_password'
        }
      });
      
      // Check failed attempts
      const failedCount = await checkFailedAttempts(user.email);
      
      return NextResponse.json({ 
        success: false,
        error: 'Invalid email or password',
        attemptsLeft: MAX_FAILED_ATTEMPTS - failedCount - 1
      }, { status: 401 });
    }

    console.log('✅ Password correct for:', email);
    
    // ✅ PASSWORD IS CORRECT!
    
    // Log successful attempt
    await prisma.loginAttempt.create({
      data: {
        userId: user.id,
        email: user.email,
        ipAddress: ipAddress,
        userAgent: userAgent,
        deviceHash: deviceHash,
        status: 'success',
        reason: 'password_correct'
      }
    });

    // ====================
    // DEVICE VERIFICATION CHECK
    // ====================
    console.log('🔍 Checking device verification...');
    
    const finalDeviceHash = clientDeviceHash || deviceHash;
    
    // Check device verification status
    const deviceVerificationCheck = await checkDeviceVerification(
      user.id,
      finalDeviceHash,
      clientLoginCount,
      clientDeviceToken
    );
    
    let requiresVerification = deviceVerificationCheck.requiresVerification;
    let verificationReason = deviceVerificationCheck.reason || 'security_check';
    let shouldResetAfterVerification = deviceVerificationCheck.shouldResetAfterVerification || false;
    
    console.log('📊 Device verification result:', {
      requiresVerification,
      verificationReason,
      shouldResetAfterVerification,
      clientLoginCount,
      hasDeviceToken: !!clientDeviceToken
    });
    
    // ====================
    // HANDLE VERIFICATION OR LOGIN
    // ====================
    if (requiresVerification) {
      console.log('🔐 Verification required for:', email, 'Reason:', verificationReason);
      
      // Generate verification code
      const verificationCode = generateVerificationCode();
      await storeVerificationCode(user.email, verificationCode, deviceHash);
      await sendVerificationEmail(user, verificationCode);
      
      // If max attempts reached or expired, tell frontend to reset counts after verification
      const resetHint = shouldResetAfterVerification ? 
        'Counts will be reset after verification.' : 
        'Regular verification required.';
      
      return NextResponse.json({
        success: false,
        requiresVerification: true,
        message: `Verification code sent to your email. ${resetHint}`,
        email: user.email,
        userEmail: user.email,
        user: sanitizeUser(user),
        reason: verificationReason,
        deviceHash: deviceHash,
        shouldResetAfterVerification: shouldResetAfterVerification,
        actionRequired: 'verify',
        passwordRequired: false
      }, { status: 200 });
    }

    console.log('✅ Device trusted, proceeding with login');
    
    // Device is trusted - proceed with login
    const expiresAt = new Date(Date.now() + DEVICE_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const device = await prisma.deviceToken.upsert({
      where: {
        userId_deviceHash: {
          userId: user.id,
          deviceHash: finalDeviceHash
        }
      },
      update: {
        lastUsed: new Date(),
        expiresAt: expiresAt,
        isTrusted: true,
        loginCount: {
          increment: 1
        }
      },
      create: {
        userId: user.id,
        deviceHash: finalDeviceHash,
        deviceName: userAgent.substring(0, 100),
        lastUsed: new Date(),
        expiresAt: expiresAt,
        isTrusted: true,
        loginCount: 1
      }
    });
    
    // Calculate new login count
    let newLoginCount = device.loginCount || 1;
    
    // Generate new device token
    const deviceToken = generateDeviceToken(user.id, finalDeviceHash);
    const deviceTokenPayload = JSON.parse(base64Decode(deviceToken));
    deviceTokenPayload.loginCount = newLoginCount;
    const updatedDeviceToken = base64Encode(JSON.stringify(deviceTokenPayload));
    
    // Generate auth token
    const token = generateToken(user);
    
    // Log successful login
    await prisma.loginAttempt.create({
      data: {
        userId: user.id,
        email: user.email,
        ipAddress: ipAddress,
        userAgent: userAgent,
        deviceHash: finalDeviceHash,
        status: 'success',
        reason: 'password_correct'
      }
    });
    
    const userData = sanitizeUser(user);

    console.log('🎉 Login successful for:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      email: user.email,
      token: token,
      deviceToken: updatedDeviceToken,
      storeInLocalStorage: true,
      loginCount: newLoginCount,
      deviceTrusted: true,
      deviceHash: finalDeviceHash
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error during login:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
// ====================
// GET LOGIN INFO
// ====================
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Login endpoint with verification',
      security: {
        maxFailedAttempts: MAX_FAILED_ATTEMPTS,
        maxLoginAttemptsBeforeVerify: MAX_LOGIN_ATTEMPTS_BEFORE_VERIFY,
        verificationCodeLength: VERIFICATION_CODE_LENGTH,
        verificationExpiryMinutes: VERIFICATION_CODE_EXPIRY_MINUTES,
        deviceTokenExpiryDays: DEVICE_TOKEN_EXPIRY_DAYS,
        otpPolicy: 'OTP only sent on valid credentials + device verification required',
        resetPolicy: 'Login counts and expiration reset to 0 after successful verification'
      },
      status: 'operational'
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching login info:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}