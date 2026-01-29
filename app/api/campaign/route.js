import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// School information
const SCHOOL_NAME = 'Katwanyaa High  School';
const SCHOOL_LOCATION = 'Matungulu, Machakos County';
const SCHOOL_MOTTO = 'Education is Light';

// Email templates
const emailTemplates = {
  admission: (data) => ({
    subject: `🎓 Admissions Now Open for ${data.schoolYear || '2025'} - ${SCHOOL_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { margin:0; padding:0; font-family: 'Inter', sans-serif; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color:white; font-size: 28px; font-weight: 700; margin: 0;">🎓 Admissions Open</h1>
            <p style="color:rgba(255,255,255,0.9); font-size: 16px; margin: 8px 0 0;">${SCHOOL_NAME}</p>
            <p style="color:rgba(255,255,255,0.8); font-size: 14px; margin: 4px 0 0;">${SCHOOL_LOCATION}</p>
          </div>
          
          <div class="content">
            <h2 style="color:#1e293b; font-size: 24px; font-weight: 600; margin: 0 0 20px;">Begin Your Educational Journey</h2>
            <p style="color:#475569; font-size: 16px; line-height: 1.6;">
              We are thrilled to announce that admissions for the <strong>${data.schoolYear || '2025'}</strong> academic year are now open! 
              Join our community of excellence and embark on an educational journey that shapes futures at our Public Mixed  Day and Boarding School.
            </p>
            
            <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color:#1e40af; font-size: 18px; font-weight: 600; margin: 0 0 10px;">Quick Facts:</h3>
              <ul style="color:#475569; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Public Mixed  Day and Boarding School in Matungulu, Machakos</li>
                <li>1200+ students community</li>
                <li>8-4-4 Curriculum System</li>
                <li>Quality education for all</li>
              </ul>
            </div>
            
            ${data.deadline ? `<p style="color:#059669; font-size: 16px; font-weight: 600;">📅 Application Deadline: ${data.deadline}</p>` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="/pages/admissions" class="cta-button">Apply Now →</a>
            </div>
            
            <p style="color:#64748b; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
              For more information, contact our admissions office at <strong>+254720123456</strong> or email <strong>admissions@katwanyaahighSchool.sc.ke</strong>
            </p>
          </div>

          <div class="footer">
            <p style="color:#1e293b; font-size: 18px; font-weight: 600; margin: 0 0 8px;">${SCHOOL_NAME}</p>
            <p style="color:#64748b; font-size: 14px; margin: 0 0 8px;">${SCHOOL_MOTTO}</p>
            <p style="color:#94a3b8; font-size: 12px; margin: 8px 0 0;">© 2024 ${SCHOOL_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  newsletter: (data) => ({
    subject: `📰 ${data.month || 'November'} Newsletter - ${SCHOOL_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { margin:0; padding:0; font-family: 'Inter', sans-serif; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color:white; font-size: 28px; font-weight: 700; margin: 0;">📰 Monthly Newsletter</h1>
            <p style="color:rgba(255,255,255,0.9); font-size: 16px; margin: 8px 0 0;">${data.month || 'November'} Updates</p>
            <p style="color:rgba(255,255,255,0.8); font-size: 14px; margin: 4px 0 0;">${SCHOOL_NAME}</p>
          </div>
          
          <div class="content">
            <h2 style="color:#1e293b; font-size: 24px; font-weight: 600; margin: 0 0 20px;">What's Happening at Our School</h2>
            <p style="color:#475569; font-size: 16px; line-height: 1.6;">
              ${data.customMessage || 'Stay updated with the latest news, events, and achievements from our school community of 1200+ students.'}
            </p>
            
            ${data.events ? `
            <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h3 style="color:#92400e; font-size: 18px; font-weight: 600; margin: 0 0 10px;">Upcoming Events:</h3>
              <div style="color:#92400e; font-size: 14px; line-height: 1.6;">
                ${data.events}
              </div>
            </div>
            ` : ''}
            
            ${data.achievements ? `
            <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h3 style="color:#1e40af; font-size: 18px; font-weight: 600; margin: 0 0 10px;">Recent Achievements:</h3>
              <div style="color:#1e40af; font-size: 14px; line-height: 1.6;">
                ${data.achievements}
              </div>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p style="color:#1e293b; font-size: 18px; font-weight: 600; margin: 0 0 8px;">${SCHOOL_NAME}</p>
            <p style="color:#64748b; font-size: 14px; margin: 0 0 8px;">${SCHOOL_LOCATION}</p>
            <p style="color:#94a3b8; font-size: 12px; margin: 8px 0 0;">© 2024 ${SCHOOL_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  event: (data) => ({
    subject: `🎉 You're Invited: ${data.eventName || 'School Event'} - ${SCHOOL_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { margin:0; padding:0; font-family: 'Inter', sans-serif; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color:white; font-size: 28px; font-weight: 700; margin: 0;">🎉 You're Invited!</h1>
            <p style="color:rgba(255,255,255,0.9); font-size: 16px; margin: 8px 0 0;">${data.eventName || 'School Event'}</p>
            <p style="color:rgba(255,255,255,0.8); font-size: 14px; margin: 4px 0 0;">${SCHOOL_NAME}</p>
          </div>
          
          <div class="content">
            <h2 style="color:#1e293b; font-size: 24px; font-weight: 600; margin: 0 0 20px;">Join Us for a Special Event</h2>
            <p style="color:#475569; font-size: 16px; line-height: 1.6;">
              ${data.customMessage || `We cordially invite you to join us for this special occasion at our school in ${SCHOOL_LOCATION}. Your presence would mean a lot to our community of 1200+ students.`}
            </p>
            
            <div style="background: #faf5ff; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #7c3aed;">
              <h3 style="color:#6b21a8; font-size: 18px; font-weight: 600; margin: 0 0 10px;">Event Details:</h3>
              ${data.date ? `<p style="color:#6b21a8; font-size: 16px; margin: 5px 0;"><strong>📅 Date:</strong> ${data.date}</p>` : ''}
              ${data.time ? `<p style="color:#6b21a8; font-size: 16px; margin: 5px 0;"><strong>⏰ Time:</strong> ${data.time}</p>` : ''}
              ${data.location ? `<p style="color:#6b21a8; font-size: 16px; margin: 5px 0;"><strong>📍 Location:</strong> ${data.location}</p>` : ''}
              <p style="color:#6b21a8; font-size: 16px; margin: 5px 0;"><strong>🏫 Venue:</strong> ${SCHOOL_NAME}, ${SCHOOL_LOCATION}</p>
            </div>
            
            <p style="color:#64748b; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
              Please RSVP by calling <strong>+254720123456</strong> or emailing <strong>info@katwanyaa highSchool.sc.ke</strong>
            </p>
          </div>

          <div class="footer">
            <p style="color:#1e293b; font-size: 18px; font-weight: 600; margin: 0 0 8px;">${SCHOOL_NAME}</p>
            <p style="color:#64748b; font-size: 14px; margin: 0 0 8px;">${SCHOOL_MOTTO}</p>
            <p style="color:#94a3b8; font-size: 12px; margin: 8px 0 0;">© 2024 ${SCHOOL_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  custom: (data) => ({
    subject: data.subject || `Important Update - ${SCHOOL_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { margin:0; padding:0; font-family: 'Inter', sans-serif; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color:white; font-size: 28px; font-weight: 700; margin: 0;">${data.subject || 'Important Update'}</h1>
            <p style="color:rgba(255,255,255,0.9); font-size: 16px; margin: 8px 0 0;">${SCHOOL_NAME}</p>
            <p style="color:rgba(255,255,255,0.8); font-size: 14px; margin: 4px 0 0;">${SCHOOL_LOCATION}</p>
          </div>
          
          <div class="content">
            <div style="color:#475569; font-size: 16px; line-height: 1.6; white-space: pre-line;">
              ${data.customMessage}
            </div>
          </div>

          <div class="footer">
            <p style="color:#1e293b; font-size: 18px; font-weight: 600; margin: 0 0 8px;">${SCHOOL_NAME}</p>
            <p style="color:#64748b; font-size: 14px; margin: 0 0 8px;">${SCHOOL_MOTTO}</p>
            <p style="color:#94a3b8; font-size: 12px; margin: 8px 0 0;">© 2024 ${SCHOOL_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

export async function POST(request) {
  try {
    const { subscribers, template, subject, customMessage, templateData } = await request.json();

    if (!subscribers || !Array.isArray(subscribers) || subscribers.length === 0) {
      return NextResponse.json({ error: 'No subscribers provided' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: 'Email configuration missing' }, { status: 500 });
    }

    const emailTemplate = emailTemplates[template] || emailTemplates.custom;
    const emailContent = emailTemplate({
      ...templateData,
      subject: subject || `Important Update - ${SCHOOL_NAME}`,
      customMessage
    });

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        await transporter.sendMail({
          from: `"${SCHOOL_NAME}" <${process.env.EMAIL_USER}>`,
          to: subscriber.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });
        return { email: subscriber.email, status: 'sent' };
      } catch (error) {
        return { email: subscriber.email, status: 'failed', error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const sentCount = results.filter(r => r.status === 'sent').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${sentCount} subscribers${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
      results
    }, { status: 200 });

  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json({ error: 'Failed to send campaign' }, { status: 500 });
  }
}