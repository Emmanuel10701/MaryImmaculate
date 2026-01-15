import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '../../../libs/prisma'; // ✅ named import
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// School Information
const SCHOOL_NAME = 'Mary Immaculate Girls Secondary School';
const SCHOOL_LOCATION = 'Mweiga, Nyeri County';
const SCHOOL_MOTTO = 'Prayer, Discipline and Hardwork';
const CONTACT_EMAIL = 'admissions@maryimmaculategirls.sc.ke';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Delete old tokens
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    const token = uuidv4();
    
    // Hash the token before storing (for security)
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: hashedToken, // Store hashed token
        expires,
      },
    });

    // Use NEXT_PUBLIC_URL for dynamic URL
    const baseUrl = process.env.NEXT_PUBLIC_URL || 
                   process.env.NEXTAUTH_URL || 
                   'http://localhost:3001';
    
    // Updated reset link structure to match your app
    const resetLink = `${baseUrl}/pages/resetpassword?token=${token}`;
    
    // For debugging
    console.log('🔐 Password Reset Request -', SCHOOL_NAME);
    console.log('User email:', email);
    console.log('Generated token (raw):', token);
    console.log('Generated token (hashed):', hashedToken);
    console.log('Reset link:', resetLink);
    console.log('Base URL:', baseUrl);

    // Enhanced email template
    await transporter.sendMail({
      from: {
        name: `${SCHOOL_NAME} Support`,
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `Password Reset Request - ${SCHOOL_NAME}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - ${SCHOOL_NAME}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f8fafc;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            }
            .header {
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .header p {
              margin: 10px 0 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .school-info {
              margin: 5px 0 0;
              font-size: 14px;
              opacity: 0.8;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #1a202c;
              margin: 0 0 20px;
              font-size: 22px;
              font-weight: 600;
            }
            .content p {
              color: #4a5568;
              line-height: 1.6;
              margin: 0 0 20px;
              font-size: 16px;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              text-align: center;
              margin: 25px 0;
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .reset-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(30, 60, 114, 0.2);
            }
            .warning {
              background-color: #fff8e1;
              border-left: 4px solid #ffb300;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .warning p {
              color: #5d4037;
              margin: 0;
              font-size: 14px;
            }
            .footer {
              background-color: #f7fafc;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer p {
              color: #718096;
              margin: 0 0 10px;
              font-size: 14px;
            }
            .token-info {
              background-color: #f1f8ff;
              padding: 12px;
              border-radius: 6px;
              margin: 20px 0;
              font-family: 'Courier New', monospace;
              font-size: 13px;
              color: #0366d6;
              word-break: break-all;
            }
            .expiry-note {
              background-color: #f3e5f5;
              padding: 12px;
              border-radius: 6px;
              margin: 20px 0;
              font-size: 14px;
              color: #7b1fa2;
              border-left: 4px solid #9c27b0;
            }
            .school-details {
              background-color: #f0f9ff;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #1e3c72;
            }
            .school-details p {
              margin: 0;
              font-size: 13px;
              color: #1e40af;
            }
            @media (max-width: 600px) {
              .container {
                margin: 10px;
                border-radius: 8px;
              }
              .header, .content, .footer {
                padding: 25px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .content h2 {
                font-size: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏫 ${SCHOOL_NAME}</h1>
              <p>${SCHOOL_MOTTO}</p>
              <p class="school-info">${SCHOOL_LOCATION}</p>
            </div>
            
            <div class="content">
              <h2>Hello ${user.name || 'User'},</h2>
              
              <p>We received a request to reset the password for your <strong>${SCHOOL_NAME}</strong> account associated with <strong>${email}</strong>.</p>
              
              <div class="school-details">
                <p><strong>School Portal:</strong> ${SCHOOL_NAME} Administrative System<br>
                <strong>Account Type:</strong> ${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}<br>
                <strong>Request Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}</p>
              </div>
              
              <p>To set a new password, please click the button below:</p>
              
              <div style="text-align: center;">
                <a 
                  href="${resetLink}" 
                  class="reset-button"
                  style="color: white; text-decoration: none;"
                >
                  🔑 Reset Your Password
                </a>
              </div>
              
              <div class="expiry-note">
                <p><strong>⚠️ Link Expires:</strong> This link will expire in <strong>1 hour</strong> for security reasons.</p>
              </div>
              
              <div class="warning">
                <p><strong>Important:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure, and no changes have been made.</p>
              </div>
              
              <p>If the button above doesn't work, copy and paste this link into your browser:</p>
              
              <div class="token-info">
                ${resetLink}
              </div>
              
              <p>For security reasons, this link is one-time use only and will be invalidated after you reset your password.</p>
              
              <p>Best regards,<br>
              <strong>The ${SCHOOL_NAME} Administration Team</strong><br>
              <span style="font-size: 14px; color: #6b7280;">${SCHOOL_LOCATION}</span></p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
              <p>This email was sent to ${email} for ${SCHOOL_NAME} portal password reset.</p>
              <p>If you need assistance, contact school administration at ${CONTACT_EMAIL}</p>
              <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
                Public Day School | 400+ Students | 8-4-4 Curriculum System
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Password Reset Request - ${SCHOOL_NAME}\n\nHello ${user.name || 'User'},\n\nWe received a request to reset your password for ${SCHOOL_NAME} portal.\n\nPlease use this link to reset your password:\n\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe ${SCHOOL_NAME} Administration Team\n${SCHOOL_LOCATION}`
    });

    console.log(`✅ Password reset email sent successfully to ${email} for ${SCHOOL_NAME}`);

    return NextResponse.json({ 
      message: 'Password reset link sent successfully.',
      details: {
        emailSent: true,
        tokenGenerated: true,
        expiresAt: expires,
        school: SCHOOL_NAME
      }
    });

  } catch (error) {
    console.error(`❌ Error in password reset API for ${SCHOOL_NAME}:`, error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message,
      school: SCHOOL_NAME
    }, { status: 500 });
  }
}