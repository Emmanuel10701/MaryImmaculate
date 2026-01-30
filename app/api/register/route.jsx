import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import { hashPassword, generateToken, sanitizeUser } from '../../../libs/auth';
import nodemailer from 'nodemailer';

// Constants
const SCHOOL_NAME = 'Marry Immaculate Girls High School';
const SCHOOL_LOCATION = 'Mweiga, Nyeri  County';
const SCHOOL_MOTTO = 'Prayer, Discipline and Hardwork ';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'info@maryimmaculategirls.sc.ke';

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ====================================================================
// EMAIL TEMPLATE - REGISTRATION SUCCESS
// ====================================================================

function getRegistrationSuccessTemplate(user) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <title>Account Created - ${SCHOOL_NAME}</title>
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
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
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
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px 0;
          position: relative;
          z-index: 1;
        }
        
        .header p {
          font-size: 15px;
          opacity: 0.95;
          margin: 0;
          position: relative;
          z-index: 1;
        }
        
        .badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 20px;
          border-radius: 24px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 12px;
          position: relative;
          z-index: 1;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .success-card {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          padding: 28px;
          margin: 24px 0;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #a5d6a7;
        }
        
        .success-icon {
          font-size: 52px;
          display: block;
          margin-bottom: 12px;
        }
        
        .success-title {
          color: #2e7d32;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }
        
        .success-text {
          color: #558b2f;
          font-size: 15px;
          margin: 0;
          line-height: 1.5;
        }
        
        .welcome-text {
          color: #333;
          font-size: 16px;
          line-height: 1.7;
          margin: 20px 0;
        }
        
        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 28px 0;
        }
        
        @media (min-width: 480px) {
          .info-cards {
            flex-direction: row;
          }
        }
        
        .info-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          flex: 1;
        }
        
        .info-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #059669;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        
        .info-value {
          font-size: 15px;
          font-weight: 700;
          color: #047857;
          word-break: break-word;
          line-height: 1.3;
        }
        
        .features-section {
          background: #f0fdf4;
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
          border: 1px solid #dcfce7;
        }
        
        .features-title {
          font-size: 17px;
          font-weight: 700;
          color: #047857;
          margin: 0 0 16px 0;
          border-left: 4px solid #059669;
          padding-left: 12px;
        }
        
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .features-list li {
          padding: 12px 0;
          border-bottom: 1px solid #d1fae5;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: #333;
        }
        
        .features-list li:last-child {
          border-bottom: none;
        }
        
        .feature-icon {
          font-size: 20px;
          min-width: 24px;
          flex-shrink: 0;
        }
        
        .feature-text {
          line-height: 1.5;
        }
        
        .cta-box {
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
          text-align: center;
          border: 1px solid #7dd3fc;
        }
        
        .cta-title {
          color: #0369a1;
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 12px 0;
        }
        
        .cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #0369a1 0%, #0284c7 100%);
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(3, 105, 161, 0.3);
        }
        
        .credentials-box {
          background: #fef3c7;
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }
        
        .credentials-title {
          color: #92400e;
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 12px 0;
        }
        
        .credential {
          background: white;
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
        }
        
        .credential-label {
          font-size: 11px;
          color: #92400e;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .credential-value {
          font-size: 14px;
          color: #333;
          font-weight: 700;
          margin-top: 4px;
          word-break: break-word;
        }
        
        .support-box {
          background: #f0f7ff;
          border: 1px solid #dbeafe;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }
        
        .support-title {
          color: #0369a1;
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 12px 0;
        }
        
        .support-text {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        }
        
        .footer {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #cbd5e1;
          padding: 28px;
          text-align: center;
        }
        
        .footer-title {
          font-size: 17px;
          font-weight: 700;
          color: white;
          margin: 0 0 6px 0;
        }
        
        .footer-text {
          font-size: 13px;
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
          
          .header p {
            font-size: 14px;
          }
          
          .content {
            padding: 28px 20px;
          }
          
          .success-card {
            padding: 20px;
          }
          
          .success-icon {
            font-size: 44px;
          }
          
          .success-title {
            font-size: 18px;
          }
          
          .success-text {
            font-size: 14px;
          }
          
          .welcome-text {
            font-size: 15px;
            margin: 16px 0;
          }
          
          .info-card {
            padding: 16px;
          }
          
          .info-value {
            font-size: 14px;
          }
          
          .features-section {
            padding: 20px;
          }
          
          .features-title {
            font-size: 16px;
          }
          
          .features-list li {
            padding: 10px 0;
            font-size: 13px;
          }
          
          .feature-icon {
            font-size: 18px;
          }
          
          .cta-box {
            padding: 20px;
          }
          
          .cta-title {
            font-size: 15px;
          }
          
          .cta-btn {
            padding: 12px 28px;
            font-size: 14px;
          }
          
          .credentials-box {
            padding: 16px;
          }
          
          .credentials-title {
            font-size: 14px;
          }
          
          .credential {
            padding: 10px;
          }
          
          .credential-label {
            font-size: 10px;
          }
          
          .credential-value {
            font-size: 13px;
          }
          
          .support-box {
            padding: 16px;
          }
          
          .support-title {
            font-size: 14px;
          }
          
          .support-text {
            font-size: 12px;
          }
          
          .footer {
            padding: 24px;
          }
          
          .footer-title {
            font-size: 16px;
          }
          
          .footer-text {
            font-size: 12px;
          }
          
          .footer-small {
            font-size: 10px;
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
          }
          
          .badge {
            font-size: 10px;
            padding: 6px 14px;
            margin-top: 10px;
          }
          
          .content {
            padding: 20px 12px;
          }
          
          .success-card {
            padding: 16px;
            margin: 16px 0;
          }
          
          .success-icon {
            font-size: 40px;
            margin-bottom: 10px;
          }
          
          .success-title {
            font-size: 17px;
          }
          
          .success-text {
            font-size: 13px;
          }
          
          .welcome-text {
            font-size: 14px;
            margin: 14px 0;
            line-height: 1.6;
          }
          
          .info-cards {
            gap: 12px;
            margin: 20px 0;
          }
          
          .info-card {
            padding: 14px;
          }
          
          .info-label {
            font-size: 10px;
          }
          
          .info-value {
            font-size: 13px;
          }
          
          .features-section {
            padding: 16px;
            margin: 20px 0;
          }
          
          .features-title {
            font-size: 15px;
            margin-bottom: 12px;
          }
          
          .features-list li {
            padding: 8px 0;
            font-size: 12px;
            gap: 10px;
          }
          
          .feature-icon {
            font-size: 16px;
            min-width: 20px;
          }
          
          .cta-box {
            padding: 16px;
            margin: 20px 0;
          }
          
          .cta-title {
            font-size: 14px;
          }
          
          .cta-btn {
            padding: 11px 24px;
            font-size: 13px;
          }
          
          .credentials-box {
            padding: 14px;
            margin: 16px 0;
          }
          
          .credentials-title {
            font-size: 13px;
          }
          
          .credential {
            padding: 10px;
            margin: 6px 0;
          }
          
          .credential-label {
            font-size: 9px;
          }
          
          .credential-value {
            font-size: 12px;
            margin-top: 3px;
          }
          
          .support-box {
            padding: 14px;
            margin: 16px 0;
          }
          
          .support-title {
            font-size: 13px;
          }
          
          .support-text {
            font-size: 11px;
          }
          
          .footer {
            padding: 16px;
          }
          
          .footer-title {
            font-size: 15px;
          }
          
          .footer-text {
            font-size: 11px;
            margin: 2px 0;
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
          <h1>🎉 Welcome to ${SCHOOL_NAME}</h1>
          <p>Your Account Has Been Successfully Created</p>
          <div class="badge">Account Active</div>
        </div>
        
        <!-- CONTENT -->
        <div class="content">
          <div class="success-card">
            <span class="success-icon">✅</span>
            <h2 class="success-title">Welcome Aboard!</h2>
            <p class="success-text">Your account is now fully active and ready to use</p>
          </div>
          
          <p class="welcome-text">
            Dear <strong>${user.name}</strong>,
            <br><br>
            Congratulations! Your staff account at ${SCHOOL_NAME} has been successfully created. You now have full access to the school management dashboard and all system privileges.
          </p>
          
          <div class="info-cards">
            <div class="info-card">
              <div class="info-label">👤 Account Role</div>
              <div class="info-value">${user.role}</div>
            </div>
            <div class="info-card">
              <div class="info-label">📧 Email Address</div>
              <div class="info-value">${user.email}</div>
            </div>
          </div>
          
          <div class="features-section">
            <h3 class="features-title">✨ Dashboard Features & Privileges</h3>
            <ul class="features-list">
              <li>
                <span class="feature-icon">📊</span>
                <span class="feature-text"><strong>Dashboard Access:</strong> Monitor school operations and statistics</span>
              </li>
              <li>
                <span class="feature-icon">👨‍🎓</span>
                <span class="feature-text"><strong>Student Management:</strong> Manage student records and information</span>
              </li>
              <li>
                <span class="feature-icon">📝</span>
                <span class="feature-text"><strong>Admissions:</strong> Handle admission applications and enrollment</span>
              </li>
              <li>
                <span class="feature-icon">📅</span>
                <span class="feature-text"><strong>Academic Calendar:</strong> Manage school events and schedules</span>
              </li>
              <li>
                <span class="feature-icon">📢</span>
                <span class="feature-text"><strong>Communications:</strong> Send announcements and newsletters</span>
              </li>
              <li>
                <span class="feature-icon">⚙️</span>
                <span class="feature-text"><strong>System Settings:</strong> Configure school information and policies</span>
              </li>
              <li>
                <span class="feature-icon">📊</span>
                <span class="feature-text"><strong>Reports:</strong> Generate and view school reports</span>
              </li>
            </ul>
          </div>
          
          <div class="cta-box">
            <h3 class="cta-title">🚀 Get Started Now</h3>
            <p style="margin: 0 0 14px 0; font-size: 14px; color: #0369a1;">Access your dashboard and start managing the school system</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/dashboard" class="cta-btn">
              Open Dashboard
            </a>
          </div>
          
          <div class="credentials-box">
            <h3 class="credentials-title">🔐 Login Information</h3>
            <div class="credential">
              <div class="credential-label">📧 Email</div>
              <div class="credential-value">${user.email}</div>
            </div>
            <div class="credential">
              <div class="credential-label">🔑 Password</div>
              <div class="credential-value">Use the password you set during registration</div>
            </div>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #92400e;">
              ⚠️ <strong>Important:</strong> Keep your login credentials safe and never share them with anyone.
            </p>
          </div>
          
          <div class="support-box">
            <h3 class="support-title">💡 Need Help?</h3>
            <p class="support-text">
              If you have any questions or need assistance with the dashboard, please contact the IT department or school administrator at <strong>${CONTACT_EMAIL}</strong> or <strong>${CONTACT_PHONE}</strong>.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
            <p style="font-size: 16px; color: #047857; font-weight: 600; margin-bottom: 6px;">
              Thank you for joining our team!
            </p>
            <p style="font-size: 14px; color: #333; margin: 0;">
              Together, we are making a difference in education.<br>
              <strong>${SCHOOL_MOTTO}</strong>
            </p>
          </div>
        </div>
        
        <!-- FOOTER -->
        <div class="footer">
          <p class="footer-title">${SCHOOL_NAME}</p>
          <p class="footer-text">${SCHOOL_LOCATION}</p>
          <p class="footer-text">Private Girl's Boarding School</p>
          <p class="footer-small">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
          <p class="footer-small">📞 ${CONTACT_PHONE} | 📧 ${CONTACT_EMAIL}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ====================================================================
// SEND REGISTRATION EMAIL
// ====================================================================

async function sendRegistrationEmail(user) {
  try {
    const mailOptions = {
      from: {
        name: `${SCHOOL_NAME} - Staff Management`,
        address: process.env.EMAIL_USER
      },
      to: user.email,
      subject: `✅ Account Created Successfully - ${SCHOOL_NAME}`,
      html: getRegistrationSuccessTemplate(user)
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Registration email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending registration email:', error);
  }
}

// Helpers
const validateEnvironment = () => {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set.');
    return false;
  }
  return true;
};

const validateInput = (name, email, password, role) => {
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  const validRoles = ['TEACHER', 'PRINCIPAL', 'ADMIN'];
  if (!validRoles.includes(role)) {
    errors.push('Invalid user role');
  }

  return errors;
};

// Main POST
export async function POST(request) {
  try {
    const { name, email, password, phone, role = 'ADMIN' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (!validateEnvironment()) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const validationErrors = validateInput(name, email, password, role);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }

    // Check duplicates
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Save user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { 
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        role: role
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        phone: true, 
        role: true, 
        image: true,
        emailVerified: true,
        createdAt: true, 
        updatedAt: true 
      },
    });

    // Send registration email
    await sendRegistrationEmail(user);

    // Generate token
    const token = generateToken(user);

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: sanitizeUser(user),
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error registering user:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        createdAt: true 
      },
    });
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}