// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ====================================================================
// CONFIGURATION
// ====================================================================
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const SCHOOL_NAME = 'Mary Immaculate Girls Secondary School';
const SCHOOL_LOCATION = 'Mweiga, Nyeri County';
const SCHOOL_MOTTO = 'Prayer, Discipline and Hardwork';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'info@maryimmaculategirls.sc.ke';
// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

function validatePhone(phone) {
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^(07|01)\d{8}$/;
  return regex.test(cleaned);
}

function generateReferenceNumber() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CONT-${year}-${randomNum}`;
}

// ====================================================================
// EMAIL TEMPLATES (Consistent with admissions style)
// ====================================================================

async function sendContactConfirmation(toEmail, name, subject, referenceNumber) {
  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} Contact Center`,
      address: process.env.EMAIL_USER
    },
    to: toEmail,
    subject: `✅ Contact Form Received - ${SCHOOL_NAME}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Confirmation</title>
        <style type="text/css">
          body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          .container { max-width: 600px; width: 100% !important; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
          @media screen and (max-width: 600px) { .padding-content { padding: 20px !important; } }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif;">
        <center style="width: 100%; background-color: #f4f7f6;">
          <div style="max-width: 600px; margin: 0 auto;" class="container">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td align="center" style="background-color: #1e3c72; color: white; padding: 40px 30px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: bold; line-height: 1.2;">
                    📞 ${SCHOOL_NAME} Contact Center
                  </h1>
                  <p style="margin: 10px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9);">
                    ${SCHOOL_LOCATION}
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.8);">
                    ${SCHOOL_MOTTO}
                  </p>
                </td>
              </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #ffffff;">
              <tr>
                <td style="padding: 40px 30px 20px 30px;" class="padding-content">
                  <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px;">
                    Dear ${name},
                  </p>
                  <p style="margin: 0 0 25px 0; color: #333333; font-size: 16px;">
                    Thank you for contacting ${SCHOOL_NAME}. We have successfully received your inquiry and our team will get back to you as soon as possible.
                  </p>

                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 8px;">
                        <p style="margin: 0 0 10px 0; color: #1b5e20; font-size: 14px; font-weight: bold;">
                          Inquiry Subject:
                        </p>
                        <h2 style="margin: 0; color: #047857; font-size: 20px; font-weight: bold; line-height: 1.2;">
                          ${subject}
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f0f9ff; border: 1px solid #e0f2fe; padding: 20px; border-radius: 8px; margin-top: 15px;">
                        <p style="margin: 0 0 10px 0; color: #075985; font-size: 14px; font-weight: bold;">
                          Reference Number:
                        </p>
                        <h2 style="margin: 0; color: #0369a1; font-size: 20px; font-weight: bold; line-height: 1.2;">
                          ${referenceNumber}
                        </h2>
                      </td>
                    </tr>
                  </table>

                  <div style="background-color: #f8fafc; border-left: 4px solid #1e3c72; padding: 15px; margin: 20px 0; border-radius: 6px;">
                    <p style="margin: 0 0 10px 0; color: #1e3c72; font-size: 14px; font-weight: bold;">
                      What Happens Next:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.5;">
                      <li>Our team reviews your inquiry</li>
                      <li>We contact you via your preferred method</li>
                      <li>Provide the information or assistance you need</li>
                    </ul>
                  </div>
                  
                  <p style="margin: 20px 0 25px 0; color: #333333; font-size: 16px;">
                    <strong>Response Time:</strong> We aim to respond to all inquiries within <strong>24 hours</strong> during working days.
                  </p>
                  
                  <div style="background-color: #1e3c72; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                    <h3 style="color: white; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">Need Immediate Assistance?</h3>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0;">
                      📞 ${CONTACT_PHONE} | 📧 ${CONTACT_EMAIL}
                    </p>
                  </div>
                  
                  <p style="margin: 0; color: #333333; font-size: 16px;">
                    Best regards,<br>
                    <strong>The ${SCHOOL_NAME} Contact Team</strong><br>
                    ${SCHOOL_LOCATION}
                  </p>
                </td>
              </tr>
            </table>
            
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td align="center" style="background-color: #f4f7f6; padding: 20px 30px; color: #777777; font-size: 12px; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                  <p style="margin: 0 0 5px 0;">
                    © ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.
                  </p>
                  <p style="margin: 0 0 5px 0; font-size: 11px; color: #9ca3af;">
                    ${SCHOOL_MOTTO}
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                    ${SCHOOL_LOCATION}
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </center>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}

async function sendAdminNotification(contactData, referenceNumber) {
  const adminEmail = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
  
  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} Contact Form`,
      address: process.env.EMAIL_USER
    },
    to: adminEmail,
    subject: `📩 NEW CONTACT INQUIRY: ${contactData.subject} (${referenceNumber})`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Inquiry - ${SCHOOL_NAME}</title>
        <style type="text/css">
          body { font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          .header { background-color: #1e3c72; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
          .content { padding: 30px; }
          .detail-row { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .detail-row strong { color: #1e3c72; display: inline-block; width: 180px; }
          .alert { background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 15px; border-radius: 4px; margin-top: 20px; color: #856404;}
          .highlight { background-color: #e8f5e9; padding: 10px; border-radius: 4px; border-left: 4px solid #388e3c; }
          .school-info { background-color: #f0f7ff; padding: 15px; border-radius: 4px; border-left: 4px solid #1e3c72; margin-bottom: 20px; }
          .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">📩 New Contact Form Submission</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">${SCHOOL_NAME}</p>
            <p style="margin: 2px 0 0 0; font-size: 12px; opacity: 0.8;">${SCHOOL_LOCATION}</p>
          </div>
          <div class="content">
            
            <div class="school-info">
              <h3 style="margin: 0 0 10px 0; color: #1e3c72;">${SCHOOL_NAME} Contact System</h3>
              <p style="margin: 0; color: #4b5563;">A new inquiry has been submitted through the school contact form.</p>
            </div>
            
            <div class="highlight">
              <h3 style="margin-top: 0; color: #1e3c72;">Reference Number: ${referenceNumber}</h3>
              <p style="margin: 5px 0 0 0; color: #4b5563;">Submitted at: ${new Date().toLocaleString('en-US')}</p>
            </div>
            
            <div class="detail-row">
              <strong>From:</strong> <span>${contactData.name}</span>
            </div>
            <div class="detail-row">
              <strong>Email:</strong> <span>${contactData.email}</span>
            </div>
            <div class="detail-row">
              <strong>Phone:</strong> <span>${contactData.phone}</span>
            </div>
            <div class="detail-row">
              <strong>Student Grade:</strong> <span>${contactData.studentGrade || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <strong>Inquiry Type:</strong> <span>${contactData.inquiryType}</span>
            </div>
            <div class="detail-row">
              <strong>Contact Preference:</strong> <span>${contactData.contactMethod}</span>
            </div>
            <div class="detail-row">
              <strong>Subject:</strong> <span><strong>${contactData.subject}</strong></span>
            </div>
            
            <div class="message-box">
              <h4 style="margin: 0 0 15px 0; color: #1e3c72;">Message:</h4>
              <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${contactData.message}</p>
            </div>

            <div class="alert">
              <p><strong>Action Required:</strong> Please respond to this inquiry via <strong>${contactData.contactMethod}</strong> within 24 hours.</p>
              <div style="margin-top: 10px;">
                <p style="margin: 5px 0;"><strong>Contact Details:</strong></p>
                <p style="margin: 5px 0;">📧 Email: ${contactData.email}</p>
                <p style="margin: 5px 0;">📞 Phone: ${contactData.phone}</p>
                ${contactData.studentGrade ? `<p style="margin: 5px 0;">🎓 Grade: ${contactData.studentGrade}</p>` : ''}
              </div>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background-color: #f9fafb; border-radius: 6px;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                <strong>School Information:</strong><br>
                ${SCHOOL_NAME} | ${SCHOOL_LOCATION}<br>
                Phone: ${CONTACT_PHONE} | Email: ${CONTACT_EMAIL}<br>
                Motto: "${SCHOOL_MOTTO}"
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}

// ====================================================================
// VALIDATION FUNCTIONS
// ====================================================================

function validateInput(data) {
  const { name, email, phone, subject, message } = data;
  
  if (!name || !email || !phone || !subject || !message) {
    return 'Name, email, phone, subject, and message are required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address.';
  }

  const phoneRegex = /^(07|01)\d{8}$/;
  const cleanedPhone = phone.replace(/\s/g, '');
  if (!phoneRegex.test(cleanedPhone)) {
    return 'Invalid phone format. Use 07XXXXXXXX or 01XXXXXXXX';
  }

  return null;
}

function validateEnvironment() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error('Environment variables EMAIL_USER and EMAIL_PASS are not set.');
    return false;
  }

  return true;
}

// ====================================================================
// MAIN HANDLER
// ====================================================================

export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, phone, subject, message, contactMethod, studentGrade, inquiryType } = formData;

    // 1. VALIDATION
    const validationError = validateInput(formData);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    // 2. ENVIRONMENT VALIDATION
    if (!validateEnvironment()) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    // 3. CLEAN AND PREPARE DATA
    const cleanedPhone = phone.replace(/\s/g, '');
    const referenceNumber = generateReferenceNumber();
    
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanedPhone,
      subject: subject.trim(),
      message: message.trim(),
      contactMethod: contactMethod || 'email',
      studentGrade: studentGrade?.trim() || '',
      inquiryType: inquiryType || 'general',
      submittedAt: new Date().toISOString()
    };

    // 4. SEND EMAILS
    try {
      await sendContactConfirmation(contactData.email, contactData.name, contactData.subject, referenceNumber);
      await sendAdminNotification(contactData, referenceNumber);
    } catch (emailError) {
      console.warn("Email sending failed:", emailError);
      // Don't fail the request
    }

    // 5. RETURN RESPONSE
    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! We will get back to you as soon as possible.',
        referenceNumber: referenceNumber,
        data: {
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          submittedAt: contactData.submittedAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ====================================================================
// GET HANDLER
// ====================================================================

export async function GET(request) {
  try {
    return NextResponse.json(
      {
        success: true,
        school: SCHOOL_NAME,
        location: SCHOOL_LOCATION,
        motto: SCHOOL_MOTTO,
        contact: {
          phone: CONTACT_PHONE,
          email: CONTACT_EMAIL,
          location: SCHOOL_LOCATION
        },
        message: 'Contact API is operational',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}