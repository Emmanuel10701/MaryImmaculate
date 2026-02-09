import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '../../../libs/prisma';
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
const SCHOOL_NAME = 'Mary Immculate Girls High School';
const SCHOOL_LOCATION = 'Mweiga, Nyeri  County';
const SCHOOL_MOTTO = 'Prayer, Discipline and Hardwork ';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'info@marryimmaculate   highSchool.sc.ke';

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
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 3600000);

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expires,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL || 
                   process.env.NEXTAUTH_URL || 
                   'https://marryimmaculate  .vercel.app';
    
    const resetLink = `${baseUrl}/pages/resetpassword?token=${token}`;
    
    console.log('🔐 Password Reset Request -', SCHOOL_NAME);
    console.log('User email:', email);
    console.log('Reset link:', resetLink);

    // Modern email template
    await transporter.sendMail({
      from: {
        name: `${SCHOOL_NAME} Security`,
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `🔐 Password Reset Request - ${SCHOOL_NAME}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <title>Password Reset - ${SCHOOL_NAME}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
              margin: 0;
              -webkit-font-smoothing: antialiased;
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            
            .header {
              background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
              background-size: 20px 20px;
              opacity: 0.1;
            }
            
            .header h1 {
              font-size: 26px;
              font-weight: 800;
              margin: 0 0 8px 0;
              position: relative;
              z-index: 1;
            }
            
            .header p {
              font-size: 14px;
              opacity: 0.95;
              margin: 4px 0;
              position: relative;
              z-index: 1;
            }
            
            .alert-banner {
              background: #fef2f2;
              border-bottom: 3px solid #dc2626;
              padding: 16px 30px;
              text-align: center;
            }
            
            .alert-text {
              color: #991b1b;
              font-size: 14px;
              font-weight: 600;
              margin: 0;
            }
            
            .content {
              padding: 40px 30px;
            }
            
            .greeting {
              color: #333;
              font-size: 16px;
              line-height: 1.7;
              margin: 0 0 20px 0;
            }
            
            .info-card {
              background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
              padding: 20px;
              border-radius: 12px;
              margin: 20px 0;
              border: 1px solid #fecaca;
            }
            
            .info-row {
              display: flex;
              padding: 8px 0;
              font-size: 14px;
              color: #4b5563;
            }
            
            .info-label {
              font-weight: 600;
              color: #991b1b;
              width: 40%;
            }
            
            .info-value {
              color: #333;
              width: 60%;
              word-break: break-word;
            }
            
            .reset-section {
              background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
              padding: 28px;
              border-radius: 12px;
              margin: 28px 0;
              text-align: center;
              border: 1px solid #86efac;
            }
            
            .reset-title {
              color: #15803d;
              font-size: 17px;
              font-weight: 700;
              margin: 0 0 12px 0;
            }
            
            .reset-btn {
              display: inline-block;
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              color: white;
              padding: 16px 40px;
              text-decoration: none;
              border-radius: 10px;
              font-weight: 700;
              font-size: 16px;
              transition: all 0.2s ease;
              border: none;
              cursor: pointer;
            }
            
            .reset-btn:hover {
              transform: translateY(-3px);
              box-shadow: 0 15px 30px rgba(5, 150, 105, 0.3);
            }
            
            .expiry-box {
              background: #fff7ed;
              border: 1px solid #fed7aa;
              border-radius: 10px;
              padding: 16px;
              margin: 20px 0;
              text-align: center;
            }
            
            .expiry-title {
              color: #d97706;
              font-weight: 700;
              font-size: 14px;
              margin: 0 0 4px 0;
            }
            
            .expiry-text {
              color: #92400e;
              font-size: 13px;
              margin: 0;
            }
            
            .link-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 16px;
              margin: 20px 0;
              word-break: break-all;
              font-size: 12px;
              color: #0369a1;
              font-family: 'Courier New', monospace;
              line-height: 1.4;
            }
            
            .warning-box {
              background: linear-gradient(135deg, #fef3c7 0%, #fef08a 100%);
              border-left: 4px solid #f59e0b;
              padding: 16px;
              margin: 20px 0;
              border-radius: 8px;
            }
            
            .warning-title {
              color: #92400e;
              font-weight: 700;
              font-size: 14px;
              margin: 0 0 6px 0;
            }
            
            .warning-text {
              color: #78350f;
              font-size: 13px;
              margin: 0;
              line-height: 1.5;
            }
            
            .security-tips {
              background: #f0f7ff;
              border: 1px solid #dbeafe;
              border-radius: 10px;
              padding: 16px;
              margin: 20px 0;
            }
            
            .security-title {
              color: #075985;
              font-weight: 700;
              font-size: 14px;
              margin: 0 0 10px 0;
            }
            
            .security-list {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            
            .security-list li {
              color: #4b5563;
              font-size: 13px;
              padding: 6px 0;
              display: flex;
              gap: 8px;
            }
            
            .support-box {
              background: #f0f9ff;
              border: 1px solid #dbeafe;
              border-radius: 10px;
              padding: 16px;
              margin: 20px 0;
              text-align: center;
            }
            
            .support-title {
              color: #0369a1;
              font-weight: 600;
              font-size: 14px;
              margin: 0 0 8px 0;
            }
            
            .support-text {
              color: #4b5563;
              font-size: 13px;
              margin: 0;
            }
            
            .footer {
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              color: #cbd5e1;
              padding: 28px 30px;
              text-align: center;
              border-top: 1px solid #334155;
            }
            
            .footer-title {
              font-size: 15px;
              font-weight: 700;
              color: white;
              margin: 0 0 6px 0;
            }
            
            .footer-text {
              font-size: 12px;
              margin: 4px 0;
            }
            
            .footer-small {
              font-size: 11px;
              opacity: 0.7;
              margin-top: 8px;
            }
            
            @media (max-width: 768px) {
              body {
                padding: 12px;
              }
              
              .header {
                padding: 32px 20px;
              }
              
              .header h1 {
                font-size: 24px;
              }
              
              .alert-banner {
                padding: 14px 20px;
              }
              
              .alert-text {
                font-size: 13px;
              }
              
              .content {
                padding: 28px 20px;
              }
              
              .greeting {
                font-size: 15px;
                margin-bottom: 16px;
              }
              
              .info-card {
                padding: 16px;
                margin: 16px 0;
              }
              
              .info-row {
                font-size: 13px;
                padding: 6px 0;
              }
              
              .reset-section {
                padding: 24px;
                margin: 24px 0;
              }
              
              .reset-title {
                font-size: 16px;
              }
              
              .reset-btn {
                padding: 14px 36px;
                font-size: 15px;
              }
              
              .expiry-box {
                padding: 14px;
              }
              
              .expiry-title {
                font-size: 13px;
              }
              
              .expiry-text {
                font-size: 12px;
              }
              
              .link-box {
                font-size: 11px;
                padding: 14px;
              }
              
              .warning-box {
                padding: 14px;
              }
              
              .warning-title {
                font-size: 13px;
              }
              
              .warning-text {
                font-size: 12px;
              }
              
              .security-tips {
                padding: 14px;
              }
              
              .security-title {
                font-size: 13px;
              }
              
              .security-list li {
                font-size: 12px;
                padding: 5px 0;
              }
              
              .support-box {
                padding: 14px;
              }
              
              .support-title {
                font-size: 13px;
              }
              
              .support-text {
                font-size: 12px;
              }
              
              .footer {
                padding: 24px 20px;
              }
            }
            
            @media (max-width: 480px) {
              body {
                padding: 8px;
              }
              
              .header {
                padding: 24px 12px;
              }
              
              .header h1 {
                font-size: 20px;
                margin-bottom: 6px;
              }
              
              .header p {
                font-size: 12px;
                margin: 3px 0;
              }
              
              .alert-banner {
                padding: 12px 12px;
              }
              
              .alert-text {
                font-size: 12px;
              }
              
              .content {
                padding: 20px 12px;
              }
              
              .greeting {
                font-size: 14px;
                margin-bottom: 14px;
                line-height: 1.6;
              }
              
              .info-card {
                padding: 14px;
                margin: 14px 0;
              }
              
              .info-row {
                flex-direction: column;
                font-size: 12px;
                padding: 5px 0;
              }
              
              .info-label {
                width: 100%;
                margin-bottom: 2px;
              }
              
              .info-value {
                width: 100%;
              }
              
              .reset-section {
                padding: 20px;
                margin: 20px 0;
              }
              
              .reset-title {
                font-size: 15px;
                margin-bottom: 12px;
              }
              
              .reset-btn {
                padding: 12px 28px;
                font-size: 14px;
              }
              
              .expiry-box {
                padding: 12px;
                margin: 16px 0;
              }
              
              .expiry-title {
                font-size: 12px;
              }
              
              .expiry-text {
                font-size: 11px;
              }
              
              .link-box {
                font-size: 10px;
                padding: 12px;
              }
              
              .warning-box {
                padding: 12px;
              }
              
              .warning-title {
                font-size: 12px;
              }
              
              .warning-text {
                font-size: 11px;
              }
              
              .security-tips {
                padding: 12px;
              }
              
              .security-title {
                font-size: 12px;
                margin-bottom: 8px;
              }
              
              .security-list li {
                font-size: 11px;
                padding: 4px 0;
                gap: 6px;
              }
              
              .support-box {
                padding: 12px;
              }
              
              .support-title {
                font-size: 12px;
              }
              
              .support-text {
                font-size: 11px;
              }
              
              .footer {
                padding: 16px;
              }
              
              .footer-title {
                font-size: 13px;
              }
              
              .footer-text {
                font-size: 11px;
              }
              
              .footer-small {
                font-size: 9px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- HEADER -->
            <div class="header">
              <h1>🔐 Password Reset</h1>
              <p>${SCHOOL_NAME}</p>
              <p>${SCHOOL_MOTTO}</p>
            </div>
            
            <!-- ALERT BANNER -->
            <div class="alert-banner">
              <p class="alert-text">⚠️ You requested a password reset. This link expires in 1 hour.</p>
            </div>
            
            <!-- CONTENT -->
            <div class="content">
              <p class="greeting">
                Hello <strong>${user.name || 'User'}</strong>,
                <br><br>
                We received a request to reset the password for your <strong>${SCHOOL_NAME}</strong> account associated with <strong>${email}</strong>.
              </p>
              
              <div class="info-card">
                <div class="info-row">
                  <span class="info-label">📧 Account Email:</span>
                  <span class="info-value">${email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">👤 Account Type:</span>
                  <span class="info-value">${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : 'User'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">🕐 Request Time:</span>
                  <span class="info-value">${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}</span>
                </div>
              </div>
              
              <div class="reset-section">
                <h3 class="reset-title">Click the button below to reset your password:</h3>
                <a href="${resetLink}" class="reset-btn">
                  🔑 Reset Password
                </a>
              </div>
              
              <div class="expiry-box">
                <p class="expiry-title">⏰ Security Notice</p>
                <p class="expiry-text">This link will expire in <strong>1 hour</strong>. After that, you'll need to request a new password reset.</p>
              </div>
              
              <p style="font-size: 14px; color: #333; margin: 0 0 12px 0;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              
              <div class="link-box">
                ${resetLink}
              </div>
              
              <div class="warning-box">
                <p class="warning-title">❌ Didn't Request This?</p>
                <p class="warning-text">If you didn't request a password reset, please ignore this email. Your account is secure, and no changes have been made.</p>
              </div>
              
              <div class="security-tips">
                <p class="security-title">🛡️ Security Tips:</p>
                <ul class="security-list">
                  <li><span>✓</span> Use a strong, unique password</li>
                  <li><span>✓</span> Never share your password with anyone</li>
                  <li><span>✓</span> Don't click reset links in unexpected emails</li>
                  <li><span>✓</span> Log out from other devices after resetting</li>
                </ul>
              </div>
              
              <div class="support-box">
                <p class="support-title">💬 Need Help?</p>
                <p class="support-text">
                  Contact IT Support:<br>
                  <strong>${CONTACT_PHONE}</strong> | <strong>${CONTACT_EMAIL}</strong>
                </p>
              </div>
            </div>
            
            <!-- FOOTER -->
            <div class="footer">
              <p class="footer-title">${SCHOOL_NAME}</p>
              <p class="footer-text">${SCHOOL_LOCATION}</p>
              <p class="footer-text">Private Girls Boarding School</p>
              <p class="footer-small">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
              <p class="footer-small">This email was sent to ${email} for your account security.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Password Reset Request - ${SCHOOL_NAME}\n\nHello ${user.name || 'User'},\n\nWe received a request to reset your password for ${SCHOOL_NAME}.\n\nPlease click this link to reset your password:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe ${SCHOOL_NAME} Security Team\n${SCHOOL_LOCATION}`
    });

    console.log(`✅ Password reset email sent successfully to ${email}`);

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
    console.error(`❌ Error in password reset API:`, error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message,
    }, { status: 500 });
  }
}