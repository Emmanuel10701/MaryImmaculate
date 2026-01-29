import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import nodemailer from 'nodemailer'; 
import { randomBytes } from "crypto";

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

const SCHOOL_NAME = 'Katwanyaa High  School';
const SCHOOL_LOCATION = 'Matungulu, Machakos County';
const SCHOOL_MOTTO = 'Education is Light';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'admissions@katwanyaahighSchool.sc.ke';

// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const randomNum = randomBytes(4).toString('hex').toUpperCase();
  return `Katz/${year}/${randomNum}`;
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^(07|01)\d{8}$/;
  return regex.test(cleaned);
}

function getStatusLabel(status) {
  const statusMap = {
    'PENDING': 'Pending',
    'UNDER_REVIEW': 'Under Review',
    'INTERVIEW_SCHEDULED': 'Interview Scheduled',
    'INTERVIEWED': 'Interviewed',
    'ACCEPTED': 'Accepted',
    'CONDITIONAL_ACCEPTANCE': 'Conditional Acceptance',
    'WAITLISTED': 'Waitlisted',
    'REJECTED': 'Rejected',
    'WITHDRAWN': 'Withdrawn'
  };
  return statusMap[status] || status;
}

function getStreamLabel(stream) {
  const streamMap = {
    'SCIENCE': 'Science',
    'ARTS': 'Arts',
    'BUSINESS': 'Business',
    'TECHNICAL': 'Technical'
  };
  return streamMap[stream] || stream;
}

function formatDate(date) {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ====================================================================
// EMAIL TEMPLATE FUNCTIONS - FULLY MOBILE RESPONSIVE WITH SIMPLE BUTTONS
// ====================================================================

function getApplicantConfirmationTemplate(name, appNumber) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <title>Application Confirmation - ${SCHOOL_NAME}</title>
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
        }
        
        .success-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
        }
        
        .success-badge {
          display: inline-block;
          background: #4caf50;
          color: white;
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 14px;
          margin: 12px 0;
        }
        
        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 28px 0;
        }
        
        @media (min-width: 480px) {
          .info-grid {
            flex-direction: row;
          }
        }
        
        .info-box {
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
        
        .steps-box {
          background: #e3f2fd;
          padding: 24px;
          border-radius: 12px;
          margin: 24px 0;
        }
        
        .steps-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .steps-list li {
          padding: 14px 0;
          border-bottom: 1px solid rgba(30, 60, 114, 0.1);
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        
        .steps-list li:last-child {
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
        
        .contact-section {
          background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
          padding: 28px;
          border-radius: 12px;
          margin: 28px 0;
          text-align: center;
        }
        
        .contact-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e3c72;
          margin: 0 0 20px 0;
        }
        
        .contact-buttons {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 20px 0;
        }
        
        @media (min-width: 480px) {
          .contact-buttons {
            flex-direction: row;
            justify-content: center;
          }
        }
        
        .contact-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border: 2px solid #dbeafe;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
          flex: 1;
          justify-content: center;
        }
        
        .contact-btn:hover {
          background: #f0f7ff;
          border-color: #0284c7;
        }
        
        .contact-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
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
        
        .contact-text {
          color: #1e3c72;
          font-weight: 600;
          font-size: 14px;
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
          
          .content {
            padding: 24px 16px;
          }
          
          .success-card {
            padding: 20px;
          }
          
          .info-box {
            padding: 16px;
          }
          
          .info-value {
            font-size: 18px;
          }
          
          .section-title {
            font-size: 17px;
            margin: 24px 0 14px 0;
          }
          
          .steps-box {
            padding: 20px;
            margin: 20px 0;
          }
          
          .steps-list li {
            padding: 12px 0;
          }
          
          .step-icon {
            font-size: 20px;
          }
          
          .step-text {
            font-size: 13px;
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
            margin: 6px 0;
          }
          
          .contact-section {
            padding: 24px;
            margin: 24px 0;
          }
          
          .contact-title {
            font-size: 16px;
            margin-bottom: 18px;
          }
          
          .contact-btn {
            padding: 14px;
            font-size: 13px;
          }
          
          .contact-icon {
            width: 36px;
            height: 36px;
            font-size: 18px;
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
            font-size: 40px;
            margin-bottom: 10px;
          }
          
          .success-badge {
            font-size: 12px;
            padding: 8px 16px;
          }
          
          .info-grid {
            gap: 12px;
            margin: 16px 0;
          }
          
          .info-box {
            padding: 14px;
            margin-bottom: 0;
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
          
          .steps-box {
            padding: 16px;
            margin: 16px 0;
          }
          
          .steps-list li {
            padding: 10px 0;
            gap: 10px;
          }
          
          .step-icon {
            font-size: 18px;
          }
          
          .step-text {
            font-size: 12px;
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
          
          .contact-section {
            padding: 16px;
            margin: 16px 0;
          }
          
          .contact-title {
            font-size: 15px;
            margin-bottom: 14px;
          }
          
          .contact-buttons {
            gap: 10px;
            margin: 12px 0;
          }
          
          .contact-btn {
            padding: 12px;
            gap: 10px;
            flex-direction: column;
          }
          
          .contact-icon {
            width: 32px;
            height: 32px;
            font-size: 16px;
          }
          
          .contact-text {
            font-size: 12px;
          }
          
          .footer {
            padding: 16px;
          }
          
          .footer-title {
            font-size: 16px;
          }
          
          .footer-text {
            font-size: 11px;
          }
          
          .footer-motto {
            font-size: 11px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Application Received</h1>
          <p>${SCHOOL_NAME}</p>
          <div class="badge">Welcome to Our Admissions Process</div>
        </div>
        
        <div class="content">
          <div class="success-card">
            <span class="success-icon">🎉</span>
            <span class="success-badge">Application Submitted Successfully!</span>
            <h3 style="color: #2e7d32; margin: 16px 0 0 0; font-size: 22px;">
              Welcome to ${SCHOOL_NAME} Admissions
            </h3>
          </div>
          
          <p style="font-size: 16px; color: #333; margin: 20px 0; line-height: 1.6;">
            Dear <strong style="color: #1e3c72;">${name}</strong>,
            <br><br>
            Thank you for choosing ${SCHOOL_NAME} for your education journey. 
            We have successfully received your admission application and it is now under review by our team.
          </p>
          
          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">📝 Applicant Name</div>
              <div class="info-value">${name}</div>
            </div>
            <div class="info-box">
              <div class="info-label">🔐 Application Number</div>
              <div class="info-value">${appNumber}</div>
            </div>
          </div>
          
          <div class="section-title">📋 What Happens Next?</div>
          <div class="steps-box">
            <ul class="steps-list">
              <li>
                <span class="step-icon">🔍</span>
                <span class="step-text"><strong>Application Review:</strong> Our admissions team will review your application within 7-14 working days</span>
              </li>
              <li>
                <span class="step-icon">📧</span>
                <span class="step-text"><strong>Status Updates:</strong> You will receive email notifications at every stage of the process</span>
              </li>
              <li>
                <span class="step-icon">📞</span>
                <span class="step-text"><strong>Verification:</strong> We may contact you for additional information or clarification</span>
              </li>
              <li>
                <span class="step-icon">🎯</span>
                <span class="step-text"><strong>Decision:</strong> Final admission decision will be communicated via email</span>
              </li>
            </ul>
          </div>
          
          <div class="important-box">
            <h4 class="important-title">⚠️ Important Notes</h4>
            <p class="important-text">• Keep your application number <strong>${appNumber}</strong> safe for future reference</p>
            <p class="important-text">• All communications will be sent to this email address</p>
            <p class="important-text">• Do not share your application details with unauthorized persons</p>
            <p class="important-text">• Application review typically takes 2-3 weeks</p>
          </div>
          
          <div class="contact-section">
            <h3 class="contact-title">📞 Need Help?</h3>
            <p style="font-size: 14px; color: #1e3c72; margin: 0 0 16px 0;">
              Our admissions team is here to assist you:
            </p>
            <div class="contact-buttons">
              <a href="tel:${CONTACT_PHONE}" class="contact-btn">
                <div class="contact-icon phone">☎</div>
                <div class="contact-text">${CONTACT_PHONE}</div>
              </a>
              <a href="mailto:${CONTACT_EMAIL}" class="contact-btn">
                <div class="contact-icon email">✉</div>
                <div class="contact-text">${CONTACT_EMAIL}</div>
              </a>
            </div>
            <p style="margin-top: 14px; font-size: 12px; color: #666;">
              Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
            <p style="font-size: 16px; color: #1e3c72; font-weight: 600; margin-bottom: 8px;">
              We look forward to reviewing your application!
            </p>
            <p style="font-size: 15px; color: #333; margin: 0;">
              Best regards,<br>
              <strong>The Admissions Team</strong><br>
              ${SCHOOL_NAME}
            </p>
          </div>
        </div>
        
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
  `;
}

function getAdminNotificationTemplate(applicantData, applicationNumber) {
  const age = calculateAge(applicantData.dateOfBirth);
  const kcpeMarks = applicantData.kcpeMarks || 'Not provided';
  const formattedDate = formatDate(new Date());
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <title>New Application - ${SCHOOL_NAME}</title>
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
        
        .app-card {
          background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
          padding: 24px;
          border-radius: 12px;
          margin: 20px 0;
          text-align: center;
        }
        
        .app-number {
          color: #1e3c72;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }
        
        .app-name {
          font-size: 22px;
          font-weight: 700;
          color: #075985;
          margin: 0 0 8px 0;
        }
        
        .app-date {
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
          color: #666;
          width: 40%;
          font-size: 13px;
        }
        
        .info-value {
          color: #333;
          width: 60%;
          font-size: 13px;
          word-break: break-word;
        }
        
        .action-box {
          background: #e8f5e9;
          border: 2px solid #4caf50;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }
        
        .action-title {
          color: #2e7d32;
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 12px 0;
        }
        
        .action-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .action-list li {
          padding: 8px 0;
          color: #2e7d32;
          font-size: 13px;
        }
        
        .urgency-notice {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 14px;
          margin: 20px 0;
          text-align: center;
          font-weight: 600;
          color: #856404;
          font-size: 13px;
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
          
          .app-card {
            padding: 20px;
            margin: 16px 0;
          }
          
          .app-name {
            font-size: 20px;
          }
          
          .section-title {
            font-size: 16px;
            margin: 20px 0 12px 0;
          }
          
          .info-row {
            padding: 10px 0;
          }
          
          .info-label {
            font-size: 12px;
          }
          
          .info-value {
            font-size: 12px;
          }
          
          .action-box {
            padding: 16px;
            margin: 20px 0;
          }
          
          .action-title {
            font-size: 15px;
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
          
          .content {
            padding: 16px;
          }
          
          .app-card {
            padding: 16px;
            margin: 12px 0;
          }
          
          .app-number {
            font-size: 14px;
            margin-bottom: 6px;
          }
          
          .app-name {
            font-size: 18px;
          }
          
          .app-date {
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
          
          .action-box {
            padding: 14px;
            margin: 16px 0;
          }
          
          .action-title {
            font-size: 14px;
          }
          
          .action-list li {
            font-size: 12px;
            padding: 6px 0;
          }
          
          .urgency-notice {
            padding: 12px;
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
        <div class="header">
          <h1>🚨 NEW APPLICATION</h1>
          <p>${SCHOOL_NAME} Admissions System</p>
        </div>
        
        <div class="alert-banner">
          <div class="badge">ACTION REQUIRED</div>
          <p style="margin: 8px 0 0 0; font-weight: 600; color: #991b1b; font-size: 14px;">
            A new student application requires review
          </p>
        </div>
        
        <div class="content">
          <div class="app-card">
            <p class="app-number">Application: ${applicationNumber}</p>
            <p class="app-name">${applicantData.firstName} ${applicantData.lastName}</p>
            <p class="app-date">Submitted: ${formattedDate}</p>
          </div>
          
          <h2 class="section-title">📋 Application Details</h2>
          <div class="info-row">
            <div class="info-label">Full Name:</div>
            <div class="info-value">${applicantData.firstName} ${applicantData.middleName || ''} ${applicantData.lastName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Date of Birth:</div>
            <div class="info-value">${formatDate(applicantData.dateOfBirth)} (Age: ${age})</div>
          </div>
          <div class="info-row">
            <div class="info-label">Gender:</div>
            <div class="info-value">${applicantData.gender}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Nationality:</div>
            <div class="info-value">${applicantData.nationality}</div>
          </div>
          <div class="info-row">
            <div class="info-label">County:</div>
            <div class="info-value">${applicantData.county}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Preferred Stream:</div>
            <div class="info-value">${getStreamLabel(applicantData.preferredStream)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Previous School:</div>
            <div class="info-value">${applicantData.previousSchool}</div>
          </div>
          <div class="info-row">
            <div class="info-label">KCPE Marks:</div>
            <div class="info-value">${kcpeMarks}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Contact Email:</div>
            <div class="info-value">${applicantData.email}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Contact Phone:</div>
            <div class="info-value">${applicantData.phone}</div>
          </div>
          
          <div class="action-box">
            <h3 class="action-title">✅ Next Steps</h3>
            <ol class="action-list">
              <li>1. Review application completeness</li>
              <li>2. Verify academic credentials</li>
              <li>3. Check for any missing documents</li>
              <li>4. Update application status in portal</li>
              <li>5. Schedule interview if required</li>
            </ol>
          </div>
          
          <div class="urgency-notice">
            ⏰ Please process this application within 48 hours
          </div>
          
          <div style="background: #f8fafc; padding: 16px; border-radius: 10px; margin: 20px 0;">
            <p style="font-size: 13px; color: #666; margin: 0;">
              <strong>School:</strong> ${SCHOOL_NAME}<br>
              <strong>Location:</strong> ${SCHOOL_LOCATION}<br>
              <strong>Motto:</strong> "${SCHOOL_MOTTO}"
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-title">${SCHOOL_NAME} Admissions Portal</p>
          <p class="footer-text">This is an automated notification from the admissions system.</p>
          <p class="footer-text">Please log in to the portal to take action.</p>
          <p class="footer-text" style="margin-top: 12px;">
            © ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getStatusUpdateTemplate(application, newStatus, updateData = {}) {
  const statusLabel = getStatusLabel(newStatus);
  const applicantName = `${application.firstName} ${application.lastName}`;
  const applicationNumber = application.applicationNumber;
  
  let subjectIcon = '';
  let title = '';
  let message = '';
  let actionSection = '';
  let headerGradient = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
  
  switch (newStatus) {
    case 'ACCEPTED':
      subjectIcon = '🎉';
      title = 'Congratulations! Admission Offer';
      headerGradient = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
      message = `We are pleased to inform you that your application to ${SCHOOL_NAME} has been <strong>ACCEPTED</strong>. Welcome to our school community!`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 24px; border-radius: 12px; margin: 20px 0;">
          <h4 style="color: #2e7d32; margin: 0 0 14px 0; font-size: 17px;">✅ Next Steps to Complete Admission:</h4>
          <ol style="margin: 0; padding-left: 20px; color: #2e7d32;">
            <li style="margin-bottom: 8px; font-size: 14px;">Complete the admission acceptance form</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Submit all required documents</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Pay admission fees as per fee structure</li>
            <li style="font-size: 14px;">Report on: <strong>${updateData.reportingDate ? formatDate(updateData.reportingDate) : 'To be communicated'}</strong></li>
          </ol>
          ${updateData.assignedStream ? `<p style="margin-top: 12px; font-size: 14px; color: #2e7d32;"><strong>Assigned Stream:</strong> ${getStreamLabel(updateData.assignedStream)}</p>` : ''}
        </div>
      `;
      break;
      
    case 'REJECTED':
      subjectIcon = '📄';
      headerGradient = 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
      title = 'Application Status Update';
      message = `After careful review, we regret to inform you that your application to ${SCHOOL_NAME} has not been successful at this time.`;
      actionSection = `
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h4 style="color: #7f1d1d; margin: 0 0 8px 0; font-size: 15px;">Application Feedback:</h4>
          <p style="font-size: 13px; margin: 0 0 6px 0; color: #333;"><strong>Reason:</strong> ${updateData.rejectionReason || 'Application did not meet admission criteria.'}</p>
        </div>
      `;
      break;
      
    case 'INTERVIEW_SCHEDULED':
      subjectIcon = '📅';
      headerGradient = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
      title = 'Interview Scheduled';
      message = `Your application to ${SCHOOL_NAME} has progressed to the interview stage. We would like to invite you for an interview.`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #f3e5f5, #e1bee7); padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h4 style="color: #6a1b9a; margin: 0 0 14px 0; font-size: 16px;">📅 Interview Details:</h4>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: white; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 3px 0; font-size: 12px; color: #666;">Date</p>
              <p style="margin: 0; font-weight: 700; color: #333; font-size: 15px;">${updateData.interviewDate ? formatDate(updateData.interviewDate) : 'To be confirmed'}</p>
            </div>
            <div style="background: white; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 3px 0; font-size: 12px; color: #666;">Time</p>
              <p style="margin: 0; font-weight: 700; color: #333; font-size: 15px;">${updateData.interviewTime || 'To be confirmed'}</p>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'WAITLISTED':
      subjectIcon = '⏳';
      headerGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      title = 'Application Waitlisted';
      message = `Your application to ${SCHOOL_NAME} has been placed on a <strong>WAITLIST</strong>. We will contact you if a space becomes available.`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #fef3c7, #fef08a); padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 13px; margin: 0; color: #92400e;">We will notify you immediately if a space becomes available.</p>
        </div>
      `;
      break;
      
    case 'CONDITIONAL_ACCEPTANCE':
      subjectIcon = '📝';
      headerGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      title = 'Conditional Admission Offer';
      message = `Your application to ${SCHOOL_NAME} has received a <strong>CONDITIONAL ACCEPTANCE</strong>. Please review the conditions below.`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #fff3cd, #ffeaa7); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h4 style="color: #d35400; margin: 0 0 12px 0; font-size: 16px;">📋 Conditions to Fulfill:</h4>
          <div style="background: white; padding: 14px; border-radius: 8px;">
            <p style="font-size: 13px; margin: 0; color: #333;">${updateData.conditions || 'Please contact admissions for specific conditions.'}</p>
          </div>
        </div>
      `;
      break;
      
    default:
      title = 'Application Status Update';
      message = `Your application status has been updated to: <strong>${statusLabel}</strong>.`;
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <title>Status Update - ${SCHOOL_NAME}</title>
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
          background: ${headerGradient};
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
        
        .content {
          padding: 28px;
        }
        
        .status-card {
          background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
          padding: 24px;
          border-radius: 12px;
          margin: 20px 0;
          text-align: center;
          border: 1px solid #bfdbfe;
        }
        
        .status-title {
          color: #1e3c72;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 12px 0;
        }
        
        .status-message {
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
          color: #333;
        }
        
        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 20px 0;
        }
        
        @media (min-width: 480px) {
          .info-grid {
            flex-direction: row;
          }
        }
        
        .info-box {
          background: #f8fafc;
          padding: 16px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          flex: 1;
        }
        
        .info-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #0369a1;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        
        .info-value {
          font-size: 16px;
          font-weight: 700;
          color: #075985;
          word-break: break-word;
        }
        
        .contact-section {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 12px;
          margin: 24px 0;
          text-align: center;
        }
        
        .contact-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e3c72;
          margin: 0 0 16px 0;
        }
        
        .contact-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        @media (min-width: 480px) {
          .contact-buttons {
            flex-direction: row;
            justify-content: center;
            gap: 12px;
          }
        }
        
        .contact-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: white;
          border: 1px solid #90caf9;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          flex: 1;
          justify-content: center;
          font-size: 13px;
          color: #1e3c72;
          font-weight: 600;
        }
        
        .contact-btn:hover {
          background: #f0f7ff;
          border-color: #0284c7;
        }
        
        .contact-icon {
          font-size: 18px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
          color: white;
          border-radius: 6px;
          font-weight: bold;
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
          
          .content {
            padding: 20px;
          }
          
          .status-card {
            padding: 20px;
          }
          
          .info-box {
            padding: 14px;
          }
          
          .info-value {
            font-size: 14px;
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
          
          .content {
            padding: 16px;
          }
          
          .status-card {
            padding: 16px;
            margin: 16px 0;
          }
          
          .status-title {
            font-size: 18px;
          }
          
          .status-message {
            font-size: 14px;
          }
          
          .info-grid {
            gap: 10px;
            margin: 16px 0;
          }
          
          .info-box {
            padding: 12px;
          }
          
          .info-label {
            font-size: 10px;
          }
          
          .info-value {
            font-size: 14px;
          }
          
          .contact-section {
            padding: 16px;
            margin: 16px 0;
          }
          
          .contact-buttons {
            gap: 8px;
          }
          
          .contact-btn {
            padding: 10px 12px;
            font-size: 12px;
          }
          
          .contact-icon {
            font-size: 16px;
            width: 24px;
            height: 24px;
          }
          
          .footer {
            padding: 16px;
          }
          
          .footer-title {
            font-size: 16px;
          }
          
          .footer-text {
            font-size: 11px;
          }
          
          .footer-motto {
            font-size: 11px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subjectIcon} ${title}</h1>
          <p>${SCHOOL_NAME}</p>
        </div>
        
        <div class="content">
          <div class="status-card">
            <h3 class="status-title">Status: ${statusLabel}</h3>
            <p class="status-message">${message}</p>
          </div>
          
          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Applicant Name</div>
              <div class="info-value">${applicantName}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Application Number</div>
              <div class="info-value">${applicationNumber}</div>
            </div>
          </div>
          
          ${actionSection}
          
          <div class="contact-section">
            <h3 class="contact-title">📞 Need Assistance?</h3>
            <div class="contact-buttons">
              <a href="tel:${CONTACT_PHONE}" class="contact-btn">
                <div class="contact-icon">☎</div>
                <span>${CONTACT_PHONE}</span>
              </a>
              <a href="mailto:${CONTACT_EMAIL}" class="contact-btn">
                <div class="contact-icon">✉</div>
                <span>Email Us</span>
              </a>
            </div>
            <p style="margin-top: 12px; font-size: 12px; color: #666;">
              Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 15px; color: #1e3c72; font-weight: 600; margin-bottom: 8px;">
              Thank you for your interest in ${SCHOOL_NAME}
            </p>
            <p style="font-size: 14px; color: #333, margin: 0;">
              Best regards,<br>
              <strong>The Admissions Team</strong>
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-title">${SCHOOL_NAME}</p>
          <p class="footer-text">${SCHOOL_LOCATION}</p>
          <p class="footer-text" style="margin-top: 10px;">© ${new Date().getFullYear()} ${SCHOOL_NAME}</p>
          <p class="footer-text" style="opacity: 0.7;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getDeletionNotificationTemplate(application, deletedBy) {
  const applicantName = `${application.firstName} ${application.lastName}`;
  const applicationNumber = application.applicationNumber;
  const deletionDate = formatDate(new Date());
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <title>Application Deleted - ${SCHOOL_NAME}</title>
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
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
        
        .content {
          padding: 28px;
        }
        
        .alert-box {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .alert-title {
          font-size: 16px;
          font-weight: 700;
          color: #721c24;
          margin: 0 0 8px 0;
        }
        
        .alert-text {
          font-size: 14px;
          color: #721c24;
          margin: 0;
          line-height: 1.6;
        }
        
        .info-box {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
          border: 1px solid #e2e8f0;
        }
        
        .info-box h4 {
          color: #1e3c72;
          font-size: 16px;
          margin: 0 0 14px 0;
        }
        
        .info-row {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .info-row:last-child {
          border-bottom: none;
        }
        
        .info-label {
          font-weight: 700;
          color: #666;
          width: 35%;
          font-size: 13px;
        }
        
        .info-value {
          color: #333;
          width: 65%;
          font-size: 13px;
          word-break: break-word;
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
          
          .content {
            padding: 20px;
          }
          
          .alert-box {
            padding: 16px;
          }
          
          .info-box {
            padding: 16px;
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
          
          .content {
            padding: 16px;
          }
          
          .alert-box {
            padding: 14px;
          }
          
          .alert-title {
            font-size: 14px;
          }
          
          .alert-text {
            font-size: 12px;
          }
          
          .info-box {
            padding: 14px;
          }
          
          .info-box h4 {
            font-size: 14px;
          }
          
          .info-row {
            padding: 6px 0;
          }
          
          .info-label {
            font-size: 12px;
          }
          
          .info-value {
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
        <div class="header">
          <h1>🗑️ Application Deleted</h1>
          <p>${SCHOOL_NAME} Admissions System</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <h3 class="alert-title">⚠️ Application Record Deleted</h3>
            <p class="alert-text">
              An application record has been permanently deleted from the admissions system.
            </p>
          </div>
          
          <div class="info-box">
            <h4>Deleted Application Details:</h4>
            <div class="info-row">
              <div class="info-label">Applicant:</div>
              <div class="info-value">${applicantName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">App Number:</div>
              <div class="info-value">${applicationNumber}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value">${application.email}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone:</div>
              <div class="info-value">${application.phone}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Deleted On:</div>
              <div class="info-value">${deletionDate}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Deleted By:</div>
              <div class="info-value">${deletedBy}</div>
            </div>
          </div>
          
          <div style="background: #e9ecef; padding: 14px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #495057; font-size: 13px;">
              <strong>Note:</strong> This deletion is permanent and cannot be undone. All data has been removed.
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-title">${SCHOOL_NAME}</p>
          <p class="footer-text">${SCHOOL_LOCATION}</p>
          <p class="footer-text">"${SCHOOL_MOTTO}"</p>
          <p class="footer-text" style="margin-top: 12px; opacity: 0.7;">
            © ${new Date().getFullYear()} ${SCHOOL_NAME}. Confidential.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ====================================================================
// POST HANDLER - CREATE APPLICATION
// ====================================================================

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'email', 'phone', 'preferredStream', 'previousSchool'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate phone number
    if (!validatePhone(data.phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format. Use 07XXXXXXXX or 01XXXXXXXX" },
        { status: 400 }
      );
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Generate application number
    const applicationNumber = generateApplicationNumber();
    
    // Prepare application data
    const applicationData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      middleName: data.middleName ? data.middleName.trim() : null,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender,
      nationality: data.nationality || 'Kenyan',
      county: data.county || '',
      email: data.email.trim().toLowerCase(),
      phone: data.phone.replace(/\s/g, ''),
      preferredStream: data.preferredStream,
      previousSchool: data.previousSchool.trim(),
      kcpeMarks: data.kcpeMarks || null,
      disability: data.disability || null,
      specialNeeds: data.specialNeeds || null,
      applicationNumber: applicationNumber,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create application in database
    const application = await prisma.admissionApplication.create({
      data: applicationData
    });
    
    // Send confirmation email to applicant
    try {
      const applicantMailOptions = {
        from: {
          name: `${SCHOOL_NAME} Admissions`,
          address: process.env.EMAIL_USER
        },
        to: application.email,
        subject: `Application Confirmation: ${applicationNumber} - ${SCHOOL_NAME}`,
        html: getApplicantConfirmationTemplate(`${application.firstName} ${application.lastName}`, applicationNumber)
      };
      
      await transporter.sendMail(applicantMailOptions);
    } catch (emailError) {
      console.warn("Confirmation email failed:", emailError);
    }
    
    // Send notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
      const adminMailOptions = {
        from: {
          name: `${SCHOOL_NAME} Admissions System`,
          address: process.env.EMAIL_USER
        },
        to: adminEmail,
        subject: `🚨 New Application: ${application.firstName} ${application.lastName} (${applicationNumber})`,
        html: getAdminNotificationTemplate(applicationData, applicationNumber)
      };
      
      await transporter.sendMail(adminMailOptions);
    } catch (emailError) {
      console.warn("Admin notification email failed:", emailError);
    }
    
    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      data: {
        id: application.id,
        applicationNumber: application.applicationNumber,
        name: `${application.firstName} ${application.lastName}`,
        email: application.email,
        status: getStatusLabel(application.status),
        createdAt: application.createdAt
      }
    });
    
  } catch (error) {
    console.error("Create application error:", error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: "Email or phone number already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to submit application",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ====================================================================
// GET HANDLER - RETRIEVE APPLICATIONS
// ====================================================================

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Build filter conditions
    const where = {};
    
    if (searchParams.has('status')) {
      where.status = searchParams.get('status');
    }
    
    if (searchParams.has('stream')) {
      where.preferredStream = searchParams.get('stream');
    }
    
    if (searchParams.has('search')) {
      const searchTerm = searchParams.get('search');
      where.OR = [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { applicationNumber: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Get total count
    const totalCount = await prisma.admissionApplication.count({ where });
    
    // Get applications with pagination
    const applications = await prisma.admissionApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        dateOfBirth: true,
        gender: true,
        email: true,
        phone: true,
        preferredStream: true,
        previousSchool: true,
        kcpeMarks: true,
        applicationNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    // Format response data
    const formattedApplications = applications.map(app => ({
      ...app,
      age: calculateAge(app.dateOfBirth),
      statusLabel: getStatusLabel(app.status),
      streamLabel: getStreamLabel(app.preferredStream)
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedApplications,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPreviousPage: page > 1
      }
    });
    
  } catch (error) {
    console.error("Get applications error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to retrieve applications",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ====================================================================
// PATCH HANDLER - UPDATE APPLICATION
// ====================================================================

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    const data = await req.json();
    
    // Check if application exists
    const existingApplication = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date(),
    };

    // Update basic fields if provided
    if (data.firstName) updateData.firstName = data.firstName.trim();
    if (data.lastName) updateData.lastName = data.lastName.trim();
    if (data.middleName !== undefined) updateData.middleName = data.middleName?.trim();
    if (data.gender) updateData.gender = data.gender;
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.email) updateData.email = data.email.trim().toLowerCase();
    if (data.phone) updateData.phone = data.phone.replace(/\s/g, '');
    if (data.preferredStream) updateData.preferredStream = data.preferredStream;
    
    // Update status and related fields
    if (data.status) {
      updateData.status = data.status;
      
      // Handle status-specific updates
      if (data.status === 'ACCEPTED' || data.status === 'CONDITIONAL_ACCEPTANCE') {
        updateData.decisionDate = new Date();
        updateData.admissionOfficer = data.admissionOfficer || 'System';
        if (data.decisionNotes) updateData.decisionNotes = data.decisionNotes;
        
        if (data.assignedStream) updateData.assignedStream = data.assignedStream;
        if (data.admissionClass) updateData.admissionClass = data.admissionClass;
        if (data.houseAssigned) updateData.houseAssigned = data.houseAssigned;
        if (data.reportingDate) updateData.reportingDate = new Date(data.reportingDate);
        if (data.admissionDate) updateData.admissionDate = new Date(data.admissionDate);
        
        if (data.status === 'CONDITIONAL_ACCEPTANCE') {
          if (data.conditions) updateData.conditions = data.conditions;
          if (data.conditionDeadline) updateData.conditionDeadline = new Date(data.conditionDeadline);
        }
      }
      
      else if (data.status === 'REJECTED') {
        updateData.rejectionDate = new Date();
        updateData.rejectionReason = data.rejectionReason || null;
        updateData.alternativeSuggestions = data.alternativeSuggestions || null;
        updateData.decisionNotes = data.decisionNotes || null;
        updateData.admissionOfficer = data.admissionOfficer || 'System';
      }
      
      else if (data.status === 'WAITLISTED') {
        updateData.waitlistPosition = data.waitlistPosition || null;
        updateData.waitlistNotes = data.waitlistNotes || null;
        updateData.decisionNotes = data.decisionNotes || null;
        updateData.admissionOfficer = data.admissionOfficer || 'System';
      }
      
      else if (data.status === 'INTERVIEW_SCHEDULED' || data.status === 'INTERVIEWED') {
        if (data.interviewDate) updateData.interviewDate = new Date(data.interviewDate);
        if (data.interviewTime) updateData.interviewTime = data.interviewTime;
        if (data.interviewVenue) updateData.interviewVenue = data.interviewVenue;
        if (data.interviewNotes) updateData.interviewNotes = data.interviewNotes;
        updateData.admissionOfficer = data.admissionOfficer || 'System';
        
        if (data.status === 'INTERVIEWED') {
          updateData.decisionNotes = data.decisionNotes || null;
        }
      }
    }

    // Update other fields
    if (data.decisionNotes !== undefined) updateData.decisionNotes = data.decisionNotes;
    if (data.admissionOfficer !== undefined) updateData.admissionOfficer = data.admissionOfficer;
    if (data.documentsVerified !== undefined) updateData.documentsVerified = data.documentsVerified;
    if (data.documentsNotes !== undefined) updateData.documentsNotes = data.documentsNotes;

    // Update the application
    const updatedApplication = await prisma.admissionApplication.update({
      where: { id },
      data: updateData,
    });

    // Send status update email if status changed
    if (data.status && data.status !== existingApplication.status) {
      try {
        const mailOptions = {
          from: {
            name: `${SCHOOL_NAME} Admissions`,
            address: process.env.EMAIL_USER
          },
          to: updatedApplication.email,
          subject: `Application Status Update: ${SCHOOL_NAME}`,
          html: getStatusUpdateTemplate(updatedApplication, data.status, data)
        };
        
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.warn("Status update email failed:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application updated successfully`,
      data: {
        id: updatedApplication.id,
        applicationNumber: updatedApplication.applicationNumber,
        name: `${updatedApplication.firstName} ${updatedApplication.lastName}`,
        status: getStatusLabel(updatedApplication.status),
        updatedAt: updatedApplication.updatedAt,
      }
    });

  } catch (error) {
    console.error("Update error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update application",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ====================================================================
// DELETE HANDLER - DELETE APPLICATION
// ====================================================================

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Check if application exists
    const application = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Get the user who is deleting (from request headers or body)
    const data = await req.json().catch(() => ({}));
    const deletedBy = data.deletedBy || 'System Administrator';
    const reason = data.reason || 'Administrative action';

    // Store application data before deletion for notification
    const applicationData = { ...application };

    // Delete the application
    await prisma.admissionApplication.delete({
      where: { id }
    });

    // Send deletion notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const deletionMailOptions = {
          from: {
            name: `${SCHOOL_NAME} Admissions System`,
            address: process.env.EMAIL_USER
          },
          to: adminEmail,
          subject: `🗑️ APPLICATION DELETED: ${applicationData.firstName} ${applicationData.lastName} (${applicationData.applicationNumber})`,
          html: getDeletionNotificationTemplate(applicationData, deletedBy)
        };
        
        await transporter.sendMail(deletionMailOptions);
      }
    } catch (emailError) {
      console.warn("Deletion notification email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Application deleted successfully`,
      data: {
        applicationNumber: applicationData.applicationNumber,
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        deletedAt: new Date().toISOString(),
        deletedBy: deletedBy,
        reason: reason
      }
    });

  } catch (error) {
    console.error("Delete error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete application",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}