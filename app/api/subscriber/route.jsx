import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import nodemailer from 'nodemailer';

// School Information
const SCHOOL_NAME = 'Mary Immculate Girls High School';
const SCHOOL_LOCATION = 'Mweiga, Nyeri  County';
const SCHOOL_MOTTO = 'Prayer, Discipline and Hardwork ';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'info@katwanyaa highSchool.sc.ke';

// Email Templates
const emailTemplates = {
  admin: ({ email }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>New Subscriber - ${SCHOOL_NAME}</title>
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
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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
            font-weight: 700;
            margin: 0;
            position: relative;
            z-index: 1;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
            margin: 8px 0 0 0;
            position: relative;
            z-index: 1;
          }
          
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          
          .subscriber-card {
            background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
            border-radius: 12px;
            padding: 24px;
            margin: 20px auto;
            max-width: 400px;
            border: 1px solid #e0f2fe;
          }
          
          .card-label {
            color: #075985;
            font-size: 13px;
            margin: 0 0 8px 0;
            font-weight: 600;
            text-transform: uppercase;
          }
          
          .card-value {
            color: #1e40af;
            font-size: 16px;
            margin: 0;
            font-weight: 700;
            word-break: break-word;
          }
          
          .info-box {
            background: #f0f7ff;
            border-radius: 10px;
            padding: 16px;
            margin: 24px auto 0;
            max-width: 450px;
            border-left: 4px solid #1e3c72;
            text-align: left;
          }
          
          .info-title {
            color: #1e3c72;
            font-size: 13px;
            margin: 0 0 8px 0;
            font-weight: 600;
          }
          
          .info-text {
            color: #4b5563;
            font-size: 12px;
            margin: 0;
            line-height: 1.5;
          }
          
          .timestamp {
            color: #718096;
            font-size: 13px;
            margin-top: 16px;
          }
          
          .footer {
            background: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer-title {
            color: #1a202c;
            font-size: 14px;
            margin: 0;
            font-weight: 600;
          }
          
          .footer-text {
            color: #718096;
            font-size: 12px;
            margin: 6px 0 0 0;
          }
          
          .footer-small {
            color: #a0aec0;
            font-size: 11px;
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
              font-size: 22px;
            }
            
            .header p {
              font-size: 13px;
              margin-top: 4px;
            }
            
            .content {
              padding: 28px 20px;
            }
            
            .subscriber-card {
              padding: 20px;
              margin: 16px auto;
            }
            
            .card-label {
              font-size: 12px;
            }
            
            .card-value {
              font-size: 14px;
            }
            
            .info-box {
              padding: 14px;
              margin: 20px auto 0;
            }
            
            .info-title {
              font-size: 12px;
            }
            
            .info-text {
              font-size: 11px;
            }
            
            .timestamp {
              font-size: 12px;
            }
            
            .footer {
              padding: 20px;
            }
            
            .footer-text {
              font-size: 11px;
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
              padding: 24px 16px;
            }
            
            .header h1 {
              font-size: 20px;
            }
            
            .header p {
              font-size: 12px;
              margin-top: 4px;
            }
            
            .content {
              padding: 20px 14px;
            }
            
            .subscriber-card {
              padding: 16px;
              margin: 14px auto;
              max-width: none;
            }
            
            .card-label {
              font-size: 11px;
              margin-bottom: 6px;
            }
            
            .card-value {
              font-size: 13px;
            }
            
            .info-box {
              padding: 12px;
              margin: 16px auto 0;
              max-width: none;
            }
            
            .info-title {
              font-size: 11px;
            }
            
            .info-text {
              font-size: 10px;
            }
            
            .timestamp {
              font-size: 11px;
              margin-top: 12px;
            }
            
            .footer {
              padding: 16px;
            }
            
            .footer-title {
              font-size: 13px;
            }
            
            .footer-text {
              font-size: 10px;
              margin-top: 4px;
            }
            
            .footer-small {
              font-size: 9px;
              margin-top: 6px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📩 New Subscriber</h1>
            <p>${SCHOOL_NAME}</p>
            <p>${SCHOOL_LOCATION}</p>
          </div>

          <div class="content">
            <h2 style="color: #1a202c; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">New Newsletter Subscriber</h2>
            
            <div class="subscriber-card">
              <p class="card-label">📧 Subscriber Email</p>
              <p class="card-value">${email}</p>
            </div>
            
            <p class="timestamp">Subscribed on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}</p>
            
            <div class="info-box">
              <p class="info-title">🏫 School Information</p>
              <p class="info-text">
                <strong>${SCHOOL_NAME}</strong><br>
                ${SCHOOL_LOCATION}<br>
                Private Girl's Boarding School | 1200+ Students | 8-4-4 Curriculum and CBC System
              </p>
            </div>
          </div>

          <div class="footer">
            <p class="footer-title">${SCHOOL_NAME}</p>
            <p class="footer-text">Newsletter notification system</p>
            <p class="footer-small">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  user: ({ email }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>Welcome - ${SCHOOL_NAME}</title>
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
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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
            font-weight: 700;
            margin: 0;
            position: relative;
            z-index: 1;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
            margin: 6px 0 0 0;
            position: relative;
            z-index: 1;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .welcome-text {
            color: #1a202c;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 20px 0;
          }
          
          .info-card {
            background: #f0f7ff;
            border-radius: 12px;
            padding: 20px;
            margin: 24px auto;
            max-width: 500px;
            border: 1px solid #e0f2fe;
          }
          
          .card-title {
            color: #1e3c72;
            font-size: 15px;
            font-weight: 600;
            margin: 0 0 14px 0;
          }
          
          .card-list {
            color: #4b5563;
            font-size: 13px;
            line-height: 1.8;
            margin: 0;
            padding-left: 20px;
          }
          
          .card-list li {
            margin-bottom: 8px;
          }
          
          .contact-card {
            background: #f0f9ff;
            border-radius: 10px;
            padding: 16px;
            margin: 24px auto 0;
            max-width: 450px;
            text-align: center;
          }
          
          .contact-label {
            color: #075985;
            font-size: 12px;
            margin: 0 0 6px 0;
            font-weight: 600;
          }
          
          .contact-text {
            color: #4b5563;
            font-size: 12px;
            margin: 0;
            line-height: 1.5;
          }
          
          .footer {
            background: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer-title {
            color: #1a202c;
            font-size: 15px;
            margin: 0;
            font-weight: 700;
          }
          
          .footer-text {
            color: #718096;
            font-size: 12px;
            margin: 4px 0 0 0;
          }
          
          .footer-small {
            color: #9ca3af;
            font-size: 11px;
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
              font-size: 22px;
            }
            
            .header p {
              font-size: 13px;
              margin-top: 4px;
            }
            
            .content {
              padding: 28px 20px;
            }
            
            .welcome-text {
              font-size: 15px;
            }
            
            .info-card {
              padding: 18px;
              margin: 20px auto;
            }
            
            .card-title {
              font-size: 14px;
              margin-bottom: 12px;
            }
            
            .card-list {
              font-size: 12px;
              padding-left: 18px;
            }
            
            .card-list li {
              margin-bottom: 6px;
            }
            
            .contact-card {
              padding: 14px;
              margin: 20px auto 0;
            }
            
            .contact-label {
              font-size: 11px;
            }
            
            .contact-text {
              font-size: 11px;
            }
            
            .footer {
              padding: 20px;
            }
            
            .footer-title {
              font-size: 14px;
            }
            
            .footer-text {
              font-size: 11px;
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
              padding: 24px 14px;
            }
            
            .header h1 {
              font-size: 20px;
            }
            
            .header p {
              font-size: 12px;
              margin-top: 4px;
            }
            
            .content {
              padding: 20px 12px;
            }
            
            .welcome-text {
              font-size: 14px;
              margin-bottom: 16px;
            }
            
            .info-card {
              padding: 16px;
              margin: 16px auto;
              max-width: none;
            }
            
            .card-title {
              font-size: 13px;
              margin-bottom: 10px;
            }
            
            .card-list {
              font-size: 11px;
              padding-left: 16px;
            }
            
            .card-list li {
              margin-bottom: 6px;
            }
            
            .contact-card {
              padding: 12px;
              margin: 16px auto 0;
              max-width: none;
            }
            
            .contact-label {
              font-size: 10px;
            }
            
            .contact-text {
              font-size: 10px;
            }
            
            .footer {
              padding: 16px;
            }
            
            .footer-title {
              font-size: 13px;
            }
            
            .footer-text {
              font-size: 10px;
              margin-top: 3px;
            }
            
            .footer-small {
              font-size: 9px;
              margin-top: 6px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏫 Welcome to ${SCHOOL_NAME}</h1>
            <p>Newsletter Subscription Confirmed</p>
            <p>${SCHOOL_MOTTO}</p>
          </div>

          <div class="content">
            <p class="welcome-text">
              Hello! 👋<br><br>
              Thank you for subscribing to <strong>${SCHOOL_NAME}</strong> newsletter with email <strong>${email}</strong>. You'll now receive important school updates, announcements, events, and academic information from our Public Mixed Day and Boarding School.
            </p>
            
            <div class="info-card">
              <p class="card-title">📬 What you'll receive:</p>
              <ul class="card-list">
                <li>School announcements and updates</li>
                <li>Academic calendar and events</li>
                <li>Student achievements and news</li>
                <li>Important deadline reminders</li>
                <li>Admission information</li>
              </ul>
            </div>
            
            <div class="contact-card">
              <p class="contact-label">📞 School Contacts</p>
              <p class="contact-text">
                <strong>${CONTACT_PHONE}</strong> | ${CONTACT_EMAIL}<br>
                📍 ${SCHOOL_LOCATION}
              </p>
            </div>
          </div>

          <div class="footer">
            <p class="footer-title">${SCHOOL_NAME}</p>
            <p class="footer-text">${SCHOOL_MOTTO}</p>
            <p class="footer-small">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
            <p class="footer-small">Public Mixed Day and Boarding School | ${SCHOOL_LOCATION} | 1200+ Students</p>
          </div>
        </div>
      </body>
    </html>
  `,
};

// Helpers
const validateEnvironment = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(`❌ EMAIL_USER and EMAIL_PASS are not set for ${SCHOOL_NAME}.`);
    return false;
  }
  return true;
};

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Main POST
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Skip format validation intentionally
    if (!validateEnvironment()) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Check duplicates
    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });
    if (existingSubscriber) {
      return NextResponse.json({ 
        error: 'This email is already subscribed to our newsletter',
        school: SCHOOL_NAME 
      }, { status: 409 });
    }

    // Save subscriber - REMOVED school field from data creation
    const subscriber = await prisma.subscriber.create({
      data: { 
        email,
        // REMOVED: school: SCHOOL_NAME
      },
      select: { 
        id: true, 
        email: true, 
        createdAt: true,
        // REMOVED: school: true
      },
    });

    // Send emails
    const transporter = createTransporter();
    const adminMail = {
      from: `"${SCHOOL_NAME} Newsletter" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Newsletter Subscriber - ${SCHOOL_NAME}`,
      html: emailTemplates.admin({ email }),
    };
    const userMail = {
      from: `"${SCHOOL_NAME} Newsletter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🏫 Welcome to ${SCHOOL_NAME} Newsletter!`,
      html: emailTemplates.user({ email }),
    };

    await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(userMail),
    ]);

    console.log(`✅ New subscriber added to ${SCHOOL_NAME}: ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully subscribed to ${SCHOOL_NAME} newsletter.`,
        subscriber: {
          ...subscriber,
          school: SCHOOL_NAME, // Still include school in response
          message: "You'll receive school updates and announcements"
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`❌ Error adding subscriber to ${SCHOOL_NAME}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to subscribe. Please try again.',
        school: SCHOOL_NAME
      },
      { status: 500 }
    );
  }
}

// GET subscribers
export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        email: true, 
        createdAt: true,
        // REMOVED: school: true 
      },
    });
    
    // Add school name to each subscriber in the response
    const subscribersWithSchool = subscribers.map(subscriber => ({
      ...subscriber,
      school: SCHOOL_NAME
    }));
    
    return NextResponse.json({ 
      success: true, 
      subscribers: subscribersWithSchool,
      school: SCHOOL_NAME,
      count: subscribers.length,
      schoolInfo: {
        name: SCHOOL_NAME,
        location: SCHOOL_LOCATION,
        motto: SCHOOL_MOTTO
      }
    }, { status: 200 });
  } catch (error) {
    console.error(`❌ Error fetching subscribers for ${SCHOOL_NAME}:`, error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      school: SCHOOL_NAME 
    }, { status: 500 });
  }
}