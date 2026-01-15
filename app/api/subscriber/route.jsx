import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import nodemailer from 'nodemailer';

// School Information
const SCHOOL_NAME = 'Mary Immaculate Girls Secondary School';
const SCHOOL_LOCATION = 'Mweiga, Nyeri County';
const SCHOOL_MOTTO = 'Soaring for Excellence';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'admissions@maryimmaculategirls.sc.ke';
// Email Templates
const emailTemplates = {
  admin: ({ email }) => `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);margin-top:40px;margin-bottom:40px;">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1e3c72 0%,#2a5298 100%);padding:40px 30px;text-align:center;">
            <h1 style="color:white;font-size:26px;font-weight:700;margin:0;">📩 New Subscriber</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:8px 0 0;">${SCHOOL_NAME}</p>
            <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:4px 0 0;">${SCHOOL_LOCATION}</p>
          </div>

          <!-- Content -->
          <div style="padding:40px 30px;text-align:center;">
            <h2 style="color:#1a202c;font-size:22px;font-weight:600;margin:0 0 20px;">New Newsletter Subscriber</h2>
            <div style="background:#f0f9ff;border-radius:12px;padding:20px;margin:0 auto 20px;max-width:400px;border:1px solid #e0f2fe;">
              <p style="color:#075985;font-size:14px;margin:0 0 8px;font-weight:600;">Subscriber Email:</p>
              <p style="color:#1e40af;font-size:16px;margin:0;font-weight:700;">${email}</p>
            </div>
            <p style="color:#718096;font-size:14px;margin-top:15px;">Subscribed on ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}</p>
            
            <div style="background:#f0f7ff;border-radius:10px;padding:15px;margin:25px auto 0;max-width:450px;border-left:4px solid #1e3c72;">
              <p style="color:#1e3c72;font-size:13px;margin:0;font-weight:600;">School Information:</p>
              <p style="color:#4b5563;font-size:12px;margin:5px 0 0;line-height:1.4;">
                ${SCHOOL_NAME}<br>
                ${SCHOOL_LOCATION}<br>
                Public Day School | 400+ Students | 8-4-4 Curriculum
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f8fafc;padding:25px 30px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#718096;font-size:14px;margin:0;">This notification was sent from ${SCHOOL_NAME} subscription system</p>
            <p style="color:#a0aec0;font-size:12px;margin:8px 0 0;">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  user: ({ email }) => `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);margin-top:40px;margin-bottom:40px;">

          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1e3c72 0%,#2a5298 100%);padding:40px 30px;text-align:center;">
            <h1 style="color:white;font-size:28px;font-weight:700;margin:0;">🏫 Welcome to ${SCHOOL_NAME}</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:16px;margin:8px 0 0;">Newsletter Subscription Confirmed</p>
            <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:4px 0 0;">${SCHOOL_MOTTO}</p>
          </div>

          <!-- Content -->
          <div style="padding:40px 30px;text-align:center;">
            <p style="color:#1a202c;font-size:18px;line-height:1.6;">Hello! 👋</p>
            <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:10px 0 20px;">
              Thank you for subscribing to <strong>${SCHOOL_NAME}</strong> newsletter with email <strong>${email}</strong>.<br/>
              You'll now receive important school updates, announcements, events, and academic information from our public day school.
            </p>
            
            <div style="background:#f0f7ff;border-radius:12px;padding:20px;margin:25px auto;max-width:500px;text-align:left;">
              <p style="color:#1e3c72;font-size:16px;font-weight:600;margin:0 0 15px;">📬 What you'll receive:</p>
              <ul style="color:#4b5563;font-size:14px;line-height:1.6;margin:0;padding-left:20px;">
                <li>School announcements and updates</li>
                <li>Academic calendar and events</li>
                <li>Student achievements and news</li>
                <li>Important deadline reminders</li>
                <li>Admission information</li>
              </ul>
            </div>
            
            <div style="background:#f0f9ff;border-radius:10px;padding:15px;margin:25px auto 0;max-width:450px;">
              <p style="color:#075985;font-size:13px;margin:0 0 5px;font-weight:600;">School Contacts:</p>
              <p style="color:#4b5563;font-size:12px;margin:0;line-height:1.4;">
                📞 ${CONTACT_PHONE} | 📧 ${CONTACT_EMAIL}<br>
                📍 ${SCHOOL_LOCATION}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f8fafc;padding:25px 30px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#1a202c;font-size:16px;font-weight:700;margin:0;">${SCHOOL_NAME}</p>
            <p style="color:#718096;font-size:12px;margin:4px 0 0;">${SCHOOL_MOTTO}</p>
            <p style="color:#a0aec0;font-size:12px;margin-top:10px;">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
            <p style="color:#9ca3af;font-size:11px;margin-top:8px;">Public Day School | Kiganjo, Nyeri | 400+ Students</p>
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