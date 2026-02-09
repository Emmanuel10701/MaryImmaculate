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

const SCHOOL_NAME = 'Mary Immculate Girls High  School';
const SCHOOL_LOCATION = 'Mweiga, Nyeri  County';
const SCHOOL_MOTTO = 'Prayer, Discipline and Hardwork ';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'info@marryimmaculate   highSchool.sc.ke';

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
// EMAIL TEMPLATES (Fully Mobile Responsive with Modern Design)
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
        <meta name="x-apple-disable-message-reformatting">
        <title>Contact Form Confirmation - ${SCHOOL_NAME}</title>
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
            background-color: #f8fafc;
            padding: 16px;
            margin: 0;
            -webkit-font-smoothing: antialiased;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
          }
          
          .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 40px 20px;
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
          
          .header-subtitle {
            font-size: 14px;
            opacity: 0.9;
            margin: 6px 0 0 0;
            position: relative;
            z-index: 1;
          }
          
          .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.15);
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
            padding: 40px 28px;
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
            font-size: 48px;
            display: block;
            margin-bottom: 12px;
          }
          
          .success-text {
            color: #2e7d32;
            font-size: 18px;
            font-weight: 700;
            margin: 0;
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
            color: #0369a1;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
          }
          
          .info-value {
            font-size: 20px;
            font-weight: 700;
            color: #075985;
            word-break: break-word;
            line-height: 1.3;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e3c72;
            margin: 28px 0 16px 0;
            border-left: 4px solid #4c7cf3;
            padding-left: 12px;
          }
          
          .process-box {
            background: #e3f2fd;
            padding: 24px;
            border-radius: 12px;
            margin: 24px 0;
          }
          
          .process-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .process-list li {
            padding: 14px 0;
            border-bottom: 1px solid rgba(30, 60, 114, 0.1);
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }
          
          .process-list li:last-child {
            border-bottom: none;
          }
          
          .step-icon {
            font-size: 24px;
            min-width: 30px;
            flex-shrink: 0;
          }
          
          .step-text {
            font-size: 14px;
            color: #333;
            line-height: 1.6;
          }
          
          .response-time {
            background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
            border: 1px solid #dbeafe;
            padding: 20px;
            border-radius: 12px;
            margin: 24px 0;
            text-align: center;
          }
          
          .response-title {
            font-size: 16px;
            font-weight: 700;
            color: #1e3c72;
            margin: 0 0 8px 0;
          }
          
          .response-text {
            font-size: 15px;
            color: #075985;
            margin: 0;
          }
          
          .contact-section {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 28px;
            border-radius: 12px;
            margin: 28px 0;
            text-align: center;
          }
          
          .contact-title {
            font-size: 18px;
            font-weight: 700;
            margin: 0 0 16px 0;
          }
          
          .contact-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin: 20px 0;
          }
          
          @media (min-width: 480px) {
            .contact-buttons {
              flex-direction: row;
              justify-content: center;
              gap: 14px;
            }
          }
          
          .contact-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 16px;
            background: white;
            border: none;
            border-radius: 10px;
            text-decoration: none;
            transition: all 0.2s ease;
            flex: 1;
            justify-content: center;
            font-size: 13px;
            color: #1e3c72;
            font-weight: 600;
            cursor: pointer;
          }
          
          .contact-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .contact-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: white;
            font-weight: bold;
            flex-shrink: 0;
          }
          
          .contact-icon.phone {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          }
          
          .contact-icon.email {
            background: linear-gradient(135deg, #d97706 0%, #ea580c 100%);
          }
          
          .important-box {
            background: rgba(234, 179, 8, 0.1);
            border: 1px solid rgba(234, 179, 8, 0.3);
            padding: 20px;
            border-radius: 12px;
            margin: 24px 0;
          }
          
          .important-title {
            font-size: 15px;
            font-weight: 700;
            color: #92400e;
            margin: 0 0 12px 0;
          }
          
          .important-text {
            font-size: 14px;
            color: #78350f;
            margin: 8px 0;
            line-height: 1.6;
          }
          
          .important-text:first-child {
            margin-top: 0;
          }
          
          .footer {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #cbd5e1;
            padding: 28px;
            text-align: center;
          }
          
          .footer-title {
            font-size: 18px;
            font-weight: 700;
            color: white;
            margin: 0 0 8px 0;
          }
          
          .footer-text {
            font-size: 13px;
            margin: 4px 0;
          }
          
          .footer-motto {
            font-size: 12px;
            font-style: italic;
            margin: 12px 0;
          }
          
          @media (max-width: 768px) {
            body {
              padding: 12px;
            }
            
            .header {
              padding: 32px 16px;
            }
            
            .header h1 {
              font-size: 24px;
            }
            
            .header p {
              font-size: 14px;
            }
            
            .header-subtitle {
              font-size: 13px;
              margin-top: 4px;
            }
            
            .content {
              padding: 24px 16px;
            }
            
            .success-card {
              padding: 20px;
            }
            
            .success-icon {
              font-size: 40px;
            }
            
            .success-text {
              font-size: 16px;
            }
            
            .info-card {
              padding: 16px;
            }
            
            .info-value {
              font-size: 18px;
            }
            
            .section-title {
              font-size: 17px;
              margin: 24px 0 14px 0;
            }
            
            .process-box {
              padding: 20px;
              margin: 20px 0;
            }
            
            .process-list li {
              padding: 12px 0;
            }
            
            .step-icon {
              font-size: 20px;
            }
            
            .step-text {
              font-size: 13px;
            }
            
            .response-time {
              padding: 18px;
              margin: 20px 0;
            }
            
            .response-title {
              font-size: 15px;
            }
            
            .response-text {
              font-size: 14px;
            }
            
            .contact-section {
              padding: 24px;
              margin: 24px 0;
            }
            
            .contact-title {
              font-size: 16px;
              margin-bottom: 14px;
            }
            
            .contact-btn {
              padding: 12px 14px;
              font-size: 12px;
            }
            
            .contact-icon {
              width: 32px;
              height: 32px;
              font-size: 16px;
            }
            
            .important-box {
              padding: 16px;
              margin: 20px 0;
            }
            
            .important-title {
              font-size: 14px;
            }
            
            .important-text {
              font-size: 13px;
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
            
            .header-subtitle {
              font-size: 11px;
              margin-top: 3px;
            }
            
            .badge {
              font-size: 10px;
              padding: 6px 14px;
              margin-top: 10px;
            }
            
            .content {
              padding: 16px 12px;
            }
            
            .success-card {
              padding: 16px;
              margin: 16px 0;
            }
            
            .success-icon {
              font-size: 36px;
              margin-bottom: 10px;
            }
            
            .success-text {
              font-size: 15px;
            }
            
            .info-cards {
              gap: 12px;
              margin: 16px 0;
            }
            
            .info-card {
              padding: 14px;
            }
            
            .info-label {
              font-size: 10px;
              margin-bottom: 6px;
            }
            
            .info-value {
              font-size: 16px;
            }
            
            .section-title {
              font-size: 16px;
              margin: 20px 0 12px 0;
              padding-left: 10px;
            }
            
            .process-box {
              padding: 16px;
              margin: 16px 0;
            }
            
            .process-list li {
              padding: 10px 0;
              gap: 10px;
            }
            
            .step-icon {
              font-size: 18px;
            }
            
            .step-text {
              font-size: 12px;
            }
            
            .response-time {
              padding: 14px;
              margin: 16px 0;
            }
            
            .response-title {
              font-size: 14px;
            }
            
            .response-text {
              font-size: 13px;
            }
            
            .contact-section {
              padding: 16px;
              margin: 16px 0;
            }
            
            .contact-title {
              font-size: 15px;
              margin-bottom: 12px;
            }
            
            .contact-buttons {
              gap: 10px;
              margin: 14px 0;
            }
            
            .contact-btn {
              padding: 11px 10px;
              font-size: 11px;
              flex-direction: column;
            }
            
            .contact-icon {
              width: 28px;
              height: 28px;
              font-size: 14px;
            }
            
            .important-box {
              padding: 14px;
              margin: 16px 0;
            }
            
            .important-title {
              font-size: 13px;
              margin-bottom: 8px;
            }
            
            .important-text {
              font-size: 12px;
              margin: 4px 0;
            }
            
            .footer {
              padding: 16px;
            }
            
            .footer-title {
              font-size: 16px;
              margin-bottom: 6px;
            }
            
            .footer-text {
              font-size: 11px;
              margin: 2px 0;
            }
            
            .footer-motto {
              font-size: 10px;
              margin: 8px 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- HEADER -->
          <div class="header">
            <h1>📞 ${SCHOOL_NAME}</h1>
            <p>${SCHOOL_LOCATION}</p>
            <p class="header-subtitle">${SCHOOL_MOTTO}</p>
            <div class="badge">Contact Form Received</div>
          </div>
          
          <!-- CONTENT -->
          <div class="content">
            <div class="success-card">
              <span class="success-icon">✅</span>
              <p class="success-text">Your Message Has Been Received!</p>
            </div>
            
            <p style="font-size: 16px; color: #333; margin: 20px 0; line-height: 1.6;">
              Dear <strong style="color: #1e3c72;">${name}</strong>,
              <br><br>
              Thank you for contacting ${SCHOOL_NAME}. We have successfully received your inquiry and greatly appreciate you reaching out to us.
            </p>
            
            <div class="info-cards">
              <div class="info-card">
                <div class="info-label">📝 Inquiry Subject</div>
                <div class="info-value">${subject}</div>
              </div>
              <div class="info-card">
                <div class="info-label">🔐 Reference Number</div>
                <div class="info-value">${referenceNumber}</div>
              </div>
            </div>
            
            <div class="section-title">⏱️ What Happens Next?</div>
            <div class="process-box">
              <ul class="process-list">
                <li>
                  <span class="step-icon">🔍</span>
                  <span class="step-text"><strong>Review:</strong> Our team will carefully review your inquiry</span>
                </li>
                <li>
                  <span class="step-icon">📧</span>
                  <span class="step-text"><strong>Contact:</strong> We will reach out to you via your preferred method</span>
                </li>
                <li>
                  <span class="step-icon">💬</span>
                  <span class="step-text"><strong>Assistance:</strong> Our team will provide the information you need</span>
                </li>
                <li>
                  <span class="step-icon">✔️</span>
                  <span class="step-text"><strong>Follow-up:</strong> We will ensure your inquiry is fully resolved</span>
                </li>
              </ul>
            </div>
            
            <div class="response-time">
              <h3 class="response-title">📅 Response Timeline</h3>
              <p class="response-text">We aim to respond to all inquiries within <strong>24 hours</strong> during working days</p>
            </div>
            
            <div class="important-box">
              <h4 class="important-title">⚠️ Important Information</h4>
              <p class="important-text">• Please keep this reference number <strong>${referenceNumber}</strong> for your records</p>
              <p class="important-text">• All responses will be sent to <strong>${toEmail}</strong></p>
              <p class="important-text">• Check your email inbox and spam folder for our response</p>
              <p class="important-text">• Do not share this reference number with unauthorized persons</p>
            </div>
            
            <div class="contact-section">
              <h3 class="contact-title">📞 Need Immediate Help?</h3>
              <p style="margin: 0 0 16px 0; font-size: 14px;">
                Contact our team directly:
              </p>
              <div class="contact-buttons">
                <a href="tel:${CONTACT_PHONE}" class="contact-btn">
                  <div class="contact-icon phone">☎</div>
                  <span>${CONTACT_PHONE}</span>
                </a>
                <a href="mailto:${CONTACT_EMAIL}" class="contact-btn">
                  <div class="contact-icon email">✉</div>
                  <span>Email Us</span>
                </a>
              </div>
              <p style="margin-top: 12px; font-size: 12px; opacity: 0.95;">
                Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
              <p style="font-size: 16px; color: #1e3c72; font-weight: 600; margin-bottom: 8px;">
                We appreciate your inquiry!
              </p>
              <p style="font-size: 15px; color: #333; margin: 0;">
                Best regards,<br>
                <strong>The ${SCHOOL_NAME} Contact Team</strong><br>
                ${SCHOOL_LOCATION}
              </p>
            </div>
          </div>
          
          <!-- FOOTER -->
          <div class="footer">
            <p class="footer-title">${SCHOOL_NAME}</p>
            <p class="footer-text">${SCHOOL_LOCATION}</p>
            <p class="footer-motto">"${SCHOOL_MOTTO}"</p>
            <p class="footer-text" style="margin-top: 12px;">
              © ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.
            </p>
            <p class="footer-text" style="opacity: 0.7;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
          </div>
        </div>
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
      name: `${SCHOOL_NAME} Contact System`,
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
        <meta name="x-apple-disable-message-reformatting">
        <title>New Contact Inquiry - ${SCHOOL_NAME}</title>
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
            background-color: #f8fafc;
            padding: 16px;
            margin: 0;
            -webkit-font-smoothing: antialiased;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
          }
          
          .header {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 32px 20px;
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
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 6px 0;
            position: relative;
            z-index: 1;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.95;
            margin: 0;
            position: relative;
            z-index: 1;
          }
          
          .alert-banner {
            background: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 16px 20px;
            text-align: center;
          }
          
          .badge {
            display: inline-block;
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
            color: white;
            padding: 8px 18px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 12px;
            margin-bottom: 8px;
          }
          
          .content {
            padding: 28px;
          }
          
          .inquiry-card {
            background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
            padding: 24px;
            border-radius: 12px;
            margin: 20px 0;
            text-align: center;
            border: 1px solid #dbeafe;
          }
          
          .inquiry-ref {
            color: #1e3c72;
            font-size: 14px;
            font-weight: 600;
            margin: 0 0 8px 0;
          }
          
          .inquiry-subject {
            font-size: 22px;
            font-weight: 700;
            color: #075985;
            margin: 0 0 8px 0;
            word-break: break-word;
            line-height: 1.3;
          }
          
          .inquiry-time {
            font-size: 12px;
            color: #666;
            margin: 0;
          }
          
          .section-title {
            font-size: 17px;
            font-weight: 700;
            color: #dc2626;
            margin: 24px 0 14px 0;
            border-bottom: 2px solid #fee2e2;
            padding-bottom: 8px;
          }
          
          .info-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .info-row:last-child {
            border-bottom: none;
          }
          
          .info-label {
            font-weight: 700;
            color: #1e3c72;
            width: 35%;
            font-size: 13px;
          }
          
          .info-value {
            color: #4b5563;
            width: 65%;
            font-size: 13px;
            word-break: break-word;
          }
          
          .message-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .message-title {
            font-size: 15px;
            font-weight: 700;
            color: #1e3c72;
            margin: 0 0 12px 0;
          }
          
          .message-content {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
            margin: 0;
            white-space: pre-wrap;
            word-break: break-word;
          }
          
          .action-box {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 1px solid #ffc107;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .action-title {
            font-size: 16px;
            font-weight: 700;
            color: #d35400;
            margin: 0 0 12px 0;
          }
          
          .action-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .action-list li {
            padding: 8px 0;
            font-size: 13px;
            color: #856404;
          }
          
          .contact-info {
            background: #f8fafc;
            padding: 16px;
            border-radius: 10px;
            margin: 20px 0;
          }
          
          .footer {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #cbd5e1;
            padding: 24px;
            text-align: center;
          }
          
          .footer-title {
            font-size: 16px;
            font-weight: 700;
            color: white;
            margin: 0 0 6px 0;
          }
          
          .footer-text {
            font-size: 12px;
            margin: 3px 0;
          }
          
          @media (max-width: 768px) {
            body {
              padding: 12px;
            }
            
            .header {
              padding: 28px 16px;
            }
            
            .header h1 {
              font-size: 22px;
            }
            
            .header p {
              font-size: 13px;
            }
            
            .content {
              padding: 20px;
            }
            
            .inquiry-card {
              padding: 20px;
            }
            
            .inquiry-subject {
              font-size: 20px;
            }
            
            .section-title {
              font-size: 16px;
              margin: 20px 0 12px 0;
            }
            
            .info-label {
              font-size: 12px;
            }
            
            .info-value {
              font-size: 12px;
            }
            
            .message-box {
              padding: 16px;
              margin: 16px 0;
            }
            
            .message-title {
              font-size: 14px;
            }
            
            .message-content {
              font-size: 13px;
            }
            
            .action-box {
              padding: 16px;
              margin: 16px 0;
            }
            
            .action-title {
              font-size: 15px;
            }
            
            .action-list li {
              font-size: 12px;
            }
            
            .footer {
              padding: 20px;
            }
          }
          
          @media (max-width: 480px) {
            body {
              padding: 8px;
            }
            
            .header {
              padding: 20px 12px;
            }
            
            .header h1 {
              font-size: 20px;
            }
            
            .header p {
              font-size: 12px;
            }
            
            .alert-banner {
              padding: 12px 12px;
            }
            
            .badge {
              font-size: 11px;
              padding: 6px 14px;
            }
            
            .content {
              padding: 16px;
            }
            
            .inquiry-card {
              padding: 16px;
              margin: 14px 0;
            }
            
            .inquiry-ref {
              font-size: 12px;
            }
            
            .inquiry-subject {
              font-size: 18px;
            }
            
            .inquiry-time {
              font-size: 11px;
            }
            
            .section-title {
              font-size: 15px;
              margin: 16px 0 10px 0;
            }
            
            .info-row {
              flex-direction: column;
              padding: 8px 0;
            }
            
            .info-label {
              width: 100%;
              margin-bottom: 3px;
              font-size: 11px;
            }
            
            .info-value {
              width: 100%;
              font-size: 12px;
            }
            
            .message-box {
              padding: 14px;
              margin: 14px 0;
            }
            
            .message-title {
              font-size: 13px;
            }
            
            .message-content {
              font-size: 12px;
            }
            
            .action-box {
              padding: 14px;
              margin: 14px 0;
            }
            
            .action-title {
              font-size: 14px;
            }
            
            .action-list li {
              font-size: 11px;
              padding: 6px 0;
            }
            
            .contact-info {
              padding: 14px;
              font-size: 12px;
            }
            
            .footer {
              padding: 16px;
            }
            
            .footer-title {
              font-size: 14px;
            }
            
            .footer-text {
              font-size: 11px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- HEADER -->
          <div class="header">
            <h1>🚨 NEW CONTACT INQUIRY</h1>
            <p>${SCHOOL_NAME} Contact System</p>
          </div>
          
          <!-- ALERT BANNER -->
          <div class="alert-banner">
            <div class="badge">ACTION REQUIRED</div>
            <p style="margin: 8px 0 0 0; font-weight: 600; color: #991b1b; font-size: 14px;">
              A new contact inquiry requires response
            </p>
          </div>
          
          <!-- CONTENT -->
          <div class="content">
            <div class="inquiry-card">
              <p class="inquiry-ref">Reference: ${referenceNumber}</p>
              <p class="inquiry-subject">${contactData.subject}</p>
              <p class="inquiry-time">Submitted: ${new Date().toLocaleString('en-US')}</p>
            </div>
            
            <h2 class="section-title">👤 Sender Information</h2>
            <div class="info-row">
              <div class="info-label">Full Name:</div>
              <div class="info-value">${contactData.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value">${contactData.email}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone:</div>
              <div class="info-value">${contactData.phone}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Inquiry Type:</div>
              <div class="info-value">${contactData.inquiryType}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Contact Method:</div>
              <div class="info-value" style="text-transform: capitalize;">${contactData.contactMethod}</div>
            </div>
                        ${contactData.studentGrade ? `
                        <div class="info-row">
                          <div class="info-label">Student Grade:</div>
                          <div class="info-value">${contactData.studentGrade}</div>
                        </div>
                        ` : ''}
                        
                        <h2 class="section-title">📝 Message</h2>
                        <div class="message-box">
                          <p class="message-content">${contactData.message}</p>
                        </div>
                        
                        <div class="action-box">
                          <h3 class="action-title">⚡ Action Required</h3>
                          <ul class="action-list">
                            <li>✓ Review the inquiry details above</li>
                            <li>✓ Respond to the sender within 24 hours</li>
                            <li>✓ Reference number: ${referenceNumber}</li>
                          </ul>
                        </div>
                      </div>
                      
                      <!-- FOOTER -->
                      <div class="footer">
                        <p class="footer-title">${SCHOOL_NAME}</p>
                        <p class="footer-text">© ${new Date().getFullYear()} All rights reserved.</p>
                        <p class="footer-text">This is an automated notification. Please respond promptly.</p>
                      </div>
                    </div>
                  </body>
                  </html>
                `
              };
            
              await transporter.sendMail(mailOptions);
            }
            
            // ====================================================================
            // POST REQUEST HANDLER
            // ====================================================================
            
            export async function POST(request) {
              try {
                const body = await request.json();
                
                const { name, email, phone, message, subject, inquiryType, contactMethod, studentGrade } = body;
                
                // Validation
                if (!name || !email || !phone || !message || !subject) {
                  return NextResponse.json(
                    { error: 'Missing required fields' },
                    { status: 400 }
                  );
                }
                
                if (!validatePhone(phone)) {
                  return NextResponse.json(
                    { error: 'Invalid phone number' },
                    { status: 400 }
                  );
                }
                
                const referenceNumber = generateReferenceNumber();
                
                // Send confirmation email to user
                await sendContactConfirmation(email, name, subject, referenceNumber);
                
                // Send notification to admin
                await sendAdminNotification(
                  { name, email, phone, message, subject, inquiryType, contactMethod, studentGrade },
                  referenceNumber
                );
                
                return NextResponse.json(
                  { 
                    success: true,
                    message: 'Contact form submitted successfully',
                    referenceNumber: referenceNumber
                  },
                  { status: 200 }
                );
              } catch (error) {
                console.error('Contact form error:', error);
                return NextResponse.json(
                  { error: 'Failed to submit contact form' },
                  { status: 500 }
                );
              }
            }