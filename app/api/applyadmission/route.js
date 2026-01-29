import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
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
  if (!phone || phone.trim() === '') return true; // Phone is now optional
  
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

// ====================================================================
// EMAIL FUNCTIONS
// ====================================================================

async function sendApplicantConfirmation(toEmail, applicantName, applicationNumber) {
  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} Admissions`,
      address: process.env.EMAIL_USER
    },
    to: toEmail,
    subject: `✅ Application Received: ${SCHOOL_NAME} - ${applicantName}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>Application Confirmation - ${SCHOOL_NAME}</title>
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            padding: 16px;
            margin: 0;
            -webkit-font-smoothing: antialiased;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
          }
          
          /* HEADER */
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
          
          .school-logo {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
            position: relative;
            z-index: 1;
          }
          
          .school-location {
            font-size: 14px;
            opacity: 0.95;
            margin-bottom: 16px;
            font-weight: 500;
            position: relative;
            z-index: 1;
          }
          
          .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 8px 20px;
            border-radius: 24px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            z-index: 1;
            letter-spacing: 0.5px;
          }
          
          /* CONTENT */
          .content {
            padding: 40px 32px;
          }
          
          .greeting {
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
          }
          
          .intro-text {
            font-size: 15px;
            color: #475569;
            margin-bottom: 24px;
            line-height: 1.6;
          }
          
          /* INFO CARDS */
          .info-cards {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin: 28px 0;
          }
          
          .info-card {
            background: linear-gradient(135deg, #f0f7ff 0%, #f8fafc 100%);
            border: 1px solid #dbeafe;
            border-radius: 12px;
            padding: 20px;
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
            font-size: 22px;
            font-weight: 700;
            color: #075985;
            word-break: break-word;
            line-height: 1.4;
          }
          
          .info-card.applicant {
            background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
            border-color: #dcfce7;
          }
          
          .info-card.applicant .info-label {
            color: #166534;
          }
          
          .info-card.applicant .info-value {
            color: #047857;
          }
          
          /* IMPORTANT SECTION */
          .important-section {
            background: rgba(234, 179, 8, 0.1);
            border: 1px solid rgba(234, 179, 8, 0.3);
            border-radius: 12px;
            padding: 20px;
            margin: 28px 0;
          }
          
          .important-title {
            font-size: 14px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 12px;
          }
          
          .important-text {
            font-size: 13px;
            color: #78350f;
            line-height: 1.6;
            margin-bottom: 8px;
          }
          
          .important-text:last-child {
            margin-bottom: 0;
          }
          
          /* SCHOOL INFO */
          .school-info {
            background: #f8fafc;
            border-left: 4px solid #1e3c72;
            border-radius: 8px;
            padding: 20px;
            margin: 28px 0;
          }
          
          .school-info-title {
            font-size: 14px;
            font-weight: 700;
            color: #1e3c72;
            margin-bottom: 12px;
          }
          
          .school-info-text {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.6;
          }
          
          /* CONTACT SECTION */
          .contact-section {
            margin: 28px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
          }
          
          .contact-title {
            font-size: 14px;
            font-weight: 700;
            color: #1e3c72;
            margin-bottom: 16px;
          }
          
          .contact-items {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
          }
          
          .contact-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
          }
          
          .contact-icon.phone {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
          }
          
          .contact-icon.email {
            background: linear-gradient(135deg, #d97706 0%, #ea580c 100%);
            color: white;
          }
          
          .contact-text {
            color: #4b5563;
            word-break: break-word;
          }
          
          /* CALL TO ACTION */
          .cta-box {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 28px 0;
          }
          
          .cta-text {
            font-size: 14px;
            margin-bottom: 12px;
          }
          
          .cta-highlight {
            font-size: 16px;
            font-weight: 700;
          }
          
          /* FOOTER */
          .footer {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #cbd5e1;
            padding: 28px 20px;
            text-align: center;
          }
          
          .footer-text {
            font-size: 12px;
            margin-bottom: 8px;
          }
          
          .footer-text:last-child {
            margin-bottom: 0;
          }
          
          .footer-highlight {
            color: #e2e8f0;
            font-weight: 600;
          }
          
          /* MOBILE RESPONSIVE */
          @media (max-width: 768px) {
            body {
              padding: 12px;
            }
            
            .header {
              padding: 32px 16px;
            }
            
            .school-logo {
              font-size: 24px;
            }
            
            .school-location {
              font-size: 13px;
            }
            
            .content {
              padding: 24px 16px;
            }
            
            .greeting {
              font-size: 15px;
            }
            
            .intro-text {
              font-size: 14px;
              margin-bottom: 20px;
            }
            
            .info-cards {
              gap: 14px;
              margin: 20px 0;
            }
            
            .info-card {
              padding: 16px;
            }
            
            .info-label {
              font-size: 10px;
              margin-bottom: 6px;
            }
            
            .info-value {
              font-size: 18px;
            }
            
            .important-section {
              padding: 16px;
              margin: 20px 0;
            }
            
            .important-title {
              font-size: 13px;
              margin-bottom: 10px;
            }
            
            .important-text {
              font-size: 12px;
              margin-bottom: 6px;
            }
            
            .school-info {
              padding: 16px;
              margin: 20px 0;
            }
            
            .school-info-title {
              font-size: 13px;
              margin-bottom: 10px;
            }
            
            .school-info-text {
              font-size: 12px;
            }
            
            .contact-section {
              padding: 16px;
              margin: 20px 0;
            }
            
            .contact-title {
              font-size: 13px;
              margin-bottom: 12px;
            }
            
            .contact-item {
              font-size: 12px;
              gap: 10px;
            }
            
            .contact-icon {
              width: 28px;
              height: 28px;
              font-size: 14px;
            }
            
            .cta-box {
              padding: 16px;
              margin: 20px 0;
            }
            
            .cta-text {
              font-size: 13px;
              margin-bottom: 10px;
            }
            
            .cta-highlight {
              font-size: 15px;
            }
            
            .footer {
              padding: 20px 16px;
            }
            
            .footer-text {
              font-size: 11px;
              margin-bottom: 6px;
            }
          }
          
          @media (max-width: 480px) {
            body {
              padding: 8px;
            }
            
            .header {
              padding: 24px 12px;
            }
            
            .school-logo {
              font-size: 20px;
              margin-bottom: 6px;
            }
            
            .school-location {
              font-size: 12px;
              margin-bottom: 12px;
            }
            
            .badge {
              font-size: 10px;
              padding: 6px 14px;
            }
            
            .content {
              padding: 16px 12px;
            }
            
            .greeting {
              font-size: 14px;
              margin-bottom: 16px;
            }
            
            .intro-text {
              font-size: 13px;
              margin-bottom: 16px;
            }
            
            .info-cards {
              gap: 12px;
              margin: 16px 0;
            }
            
            .info-card {
              padding: 14px;
            }
            
            .info-label {
              font-size: 9px;
              margin-bottom: 6px;
            }
            
            .info-value {
              font-size: 16px;
            }
            
            .important-section {
              padding: 14px;
              margin: 16px 0;
            }
            
            .important-title {
              font-size: 12px;
            }
            
            .important-text {
              font-size: 11px;
              margin-bottom: 6px;
            }
            
            .school-info {
              padding: 14px;
              margin: 16px 0;
            }
            
            .school-info-title {
              font-size: 12px;
            }
            
            .school-info-text {
              font-size: 11px;
            }
            
            .contact-section {
              padding: 14px;
              margin: 16px 0;
            }
            
            .contact-title {
              font-size: 12px;
            }
            
            .contact-item {
              font-size: 11px;
              gap: 8px;
            }
            
            .contact-icon {
              width: 24px;
              height: 24px;
              font-size: 12px;
            }
            
            .cta-box {
              padding: 14px;
              margin: 16px 0;
            }
            
            .cta-text {
              font-size: 12px;
            }
            
            .cta-highlight {
              font-size: 14px;
            }
            
            .footer {
              padding: 16px 12px;
            }
            
            .footer-text {
              font-size: 10px;
              margin-bottom: 4px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- HEADER -->
          <div class="header">
            <h1 class="school-logo">🏫 ${SCHOOL_NAME}</h1>
            <p class="school-location">${SCHOOL_LOCATION}</p>
            <div class="badge">Application Received</div>
          </div>
          
          <!-- CONTENT -->
          <div class="content">
            <p class="greeting">Dear Parent/Guardian,</p>
            
            <p class="intro-text">
              Thank you for submitting an admission application to <strong>${SCHOOL_NAME}</strong>. 
              We have successfully received the application for <strong>${applicantName}</strong>. 
              Your application is now under review by our admissions team.
            </p>
            
            <!-- INFO CARDS -->
            <div class="info-cards">
              <div class="info-card applicant">
                <div class="info-label">📝 Applicant Name</div>
                <div class="info-value">${applicantName}</div>
              </div>
              
              <div class="info-card">
                <div class="info-label">🔐 Application Number</div>
                <div class="info-value">${applicationNumber}</div>
              </div>
            </div>
            
            <!-- IMPORTANT SECTION -->
            <div class="important-section">
              <p class="important-title">⚠️ Important Information</p>
              <p class="important-text">
                Please keep your <strong>Application Number (${applicationNumber})</strong> for future reference and inquiries.
              </p>
              <p class="important-text">
                All further communications regarding your application will be sent to: <strong>${toEmail}</strong>
              </p>
              <p class="important-text">
                You will receive updates on your application status via email. Please check your inbox regularly, including spam folder.
              </p>
            </div>
            
            <!-- SCHOOL INFO -->
            <div class="school-info">
              <h3 class="school-info-title">About ${SCHOOL_NAME}</h3>
              <p class="school-info-text">
                ${SCHOOL_NAME} is a Public Mixed Day and Boarding School located in ${SCHOOL_LOCATION}. 
                We provide quality education to 1200+ students through the 8-4-4 curriculum system. 
                Our motto is "<strong>${SCHOOL_MOTTO}</strong>".
              </p>
            </div>
            
            <!-- CONTACT SECTION -->
            <div class="contact-section">
              <h3 class="contact-title">📞 Contact Our Admissions Office</h3>
              <div class="contact-items">
                <div class="contact-item">
                  <div class="contact-icon phone">☎</div>
                  <div class="contact-text">
                    <strong>${CONTACT_PHONE}</strong>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon email">✉</div>
                  <div class="contact-text">
                    <strong>${CONTACT_EMAIL}</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- CTA -->
            <div class="cta-box">
              <p class="cta-text">Your application status:</p>
              <p class="cta-highlight">🟡 Pending Review</p>
              <p class="cta-text" style="margin-top: 12px; font-size: 12px;">
                We will notify you of any updates within 2-4 weeks
              </p>
            </div>
          </div>
          
          <!-- FOOTER -->
          <div class="footer">
            <p class="footer-text">
              © ${new Date().getFullYear()} <span class="footer-highlight">${SCHOOL_NAME}</span>. All rights reserved.
            </p>
            <p class="footer-text">
              <span class="footer-highlight">"${SCHOOL_MOTTO}"</span>
            </p>
            <p class="footer-text">
              ${SCHOOL_LOCATION}
            </p>
            <p class="footer-text" style="margin-top: 12px; opacity: 0.7;">
              This is an automated message. Please do not reply directly to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}

async function sendAdminNotification(applicantData, applicationNumber) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("⚠️ ADMIN_EMAIL is not set in environment variables. Admin notification skipped.");
    return;
  }

  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} Admissions System`,
      address: process.env.EMAIL_USER
    },
    to: adminEmail,
    subject: `🚨 NEW APPLICATION SUBMITTED: ${applicantData.firstName} ${applicantData.lastName} (${applicationNumber})`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>New Application - ${SCHOOL_NAME}</title>
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            padding: 16px;
            margin: 0;
            -webkit-font-smoothing: antialiased;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
          }
          
          /* HEADER */
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
          
          .header-title {
            font-size: 24px;
            font-weight: 800;
            margin: 0;
            position: relative;
            z-index: 1;
          }
          
          .header-subtitle {
            font-size: 13px;
            opacity: 0.9;
            margin: 8px 0 0 0;
            position: relative;
            z-index: 1;
          }
          
          /* CONTENT */
          .content {
            padding: 28px 20px;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #dc2626;
            margin: 24px 0 16px 0;
            border-bottom: 2px solid #fee2e2;
            padding-bottom: 10px;
          }
          
          .section-title:first-child {
            margin-top: 0;
          }
          
          /* INFO TABLE */
          .info-table {
            width: 100%;
            margin-bottom: 16px;
          }
          
          .info-row {
            display: flex;
            border-bottom: 1px solid #e5e7eb;
            padding: 12px 0;
          }
          
          .info-row:last-child {
            border-bottom: none;
          }
          
          .info-label {
            font-weight: 700;
            color: #1e3c72;
            width: 40%;
            font-size: 13px;
          }
          
          .info-value {
            color: #4b5563;
            width: 60%;
            font-size: 13px;
            word-break: break-word;
          }
          
          /* ALERT BOX */
          .alert-box {
            background: #fef2f2;
            border: 2px solid #fee2e2;
            border-radius: 12px;
            padding: 16px;
            margin: 24px 0;
          }
          
          .alert-title {
            font-size: 14px;
            font-weight: 700;
            color: #991b1b;
            margin-bottom: 8px;
          }
          
          .alert-text {
            font-size: 12px;
            color: #7f1d1d;
            line-height: 1.5;
          }
          
          /* HIGHLIGHT BOX */
          .highlight-box {
            background: linear-gradient(135deg, #f0f7ff 0%, #f8fafc 100%);
            border: 1px solid #dbeafe;
            border-radius: 12px;
            padding: 16px;
            margin: 16px 0;
          }
          
          .highlight-label {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #0369a1;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
          }
          
          .highlight-value {
            font-size: 16px;
            font-weight: 700;
            color: #075985;
            word-break: break-word;
          }
          
          /* FOOTER */
          .footer {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #cbd5e1;
            padding: 20px;
            text-align: center;
            font-size: 11px;
          }
          
          .footer-text {
            margin-bottom: 6px;
          }
          
          .footer-text:last-child {
            margin-bottom: 0;
          }
          
          /* MOBILE RESPONSIVE */
          @media (max-width: 768px) {
            body {
              padding: 12px;
            }
            
            .header {
              padding: 24px 16px;
            }
            
            .header-title {
              font-size: 20px;
            }
            
            .header-subtitle {
              font-size: 12px;
            }
            
            .content {
              padding: 20px 16px;
            }
            
            .section-title {
              font-size: 15px;
              margin: 20px 0 12px 0;
            }
            
            .info-label {
              font-size: 12px;
              width: 38%;
            }
            
            .info-value {
              font-size: 12px;
              width: 62%;
            }
            
            .alert-box {
              padding: 14px;
              margin: 20px 0;
            }
            
            .alert-title {
              font-size: 13px;
            }
            
            .alert-text {
              font-size: 11px;
            }
            
            .highlight-box {
              padding: 14px;
              margin: 14px 0;
            }
            
            .highlight-label {
              font-size: 10px;
            }
            
            .highlight-value {
              font-size: 14px;
            }
            
            .footer {
              padding: 16px;
              font-size: 10px;
            }
          }
          
          @media (max-width: 480px) {
            body {
              padding: 8px;
            }
            
            .header {
              padding: 20px 12px;
            }
            
            .header-title {
              font-size: 18px;
            }
            
            .header-subtitle {
              font-size: 11px;
              margin-top: 6px;
            }
            
            .content {
              padding: 16px 12px;
            }
            
            .section-title {
              font-size: 14px;
              margin: 16px 0 10px 0;
            }
            
            .info-row {
              flex-direction: column;
              padding: 10px 0;
            }
            
            .info-label {
              width: 100%;
              margin-bottom: 4px;
              font-size: 11px;
            }
            
            .info-value {
              width: 100%;
              font-size: 11px;
            }
            
            .alert-box {
              padding: 12px;
              margin: 16px 0;
            }
            
            .alert-title {
              font-size: 12px;
            }
            
            .alert-text {
              font-size: 10px;
            }
            
            .highlight-box {
              padding: 12px;
              margin: 12px 0;
            }
            
            .highlight-label {
              font-size: 9px;
            }
            
            .highlight-value {
              font-size: 13px;
            }
            
            .footer {
              padding: 12px;
              font-size: 9px;
            }
            
            .footer-text {
              margin-bottom: 4px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- HEADER -->
          <div class="header">
            <h1 class="header-title">🔔 New Application Received!</h1>
            <p class="header-subtitle">${SCHOOL_NAME} | ${SCHOOL_LOCATION}</p>
          </div>
          
          <!-- CONTENT -->
          <div class="content">
            <div class="highlight-box">
              <div class="highlight-label">Application Number</div>
              <div class="highlight-value">${applicationNumber}</div>
            </div>
            
            <!-- PERSONAL INFO SECTION -->
            <h2 class="section-title">👤 Personal Information</h2>
            <div class="info-table">
              <div class="info-row">
                <div class="info-label">Full Name:</div>
                <div class="info-value">${applicantData.firstName} ${applicantData.middleName ? applicantData.middleName + ' ' : ''}${applicantData.lastName}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Date of Birth:</div>
                <div class="info-value">${new Date(applicantData.dateOfBirth).toLocaleDateString()} (Age: ${calculateAge(applicantData.dateOfBirth)})</div>
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
            </div>
            
            <!-- ACADEMIC INFO SECTION -->
            <h2 class="section-title">🎓 Academic Information</h2>
            <div class="info-table">
              <div class="info-row">
                <div class="info-label">Previous School:</div>
                <div class="info-value">${applicantData.previousSchool}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Previous Class:</div>
                <div class="info-value">${applicantData.previousClass}</div>
              </div>
              <div class="info-row">
                <div class="info-label">KCPE Marks:</div>
                <div class="info-value">${applicantData.kcpeMarks || 'Not provided'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">KCPE Index:</div>
                <div class="info-value">${applicantData.kcpeIndex || 'Not provided'}</div>
              </div>
            </div>
            
            <!-- CONTACT INFO SECTION -->
            <h2 class="section-title">📞 Contact Information</h2>
            <div class="info-table">
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${applicantData.email || 'Not provided'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">${applicantData.phone || 'Not provided'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">County:</div>
                <div class="info-value">${applicantData.county}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Postal Address:</div>
                <div class="info-value">${applicantData.postalAddress}</div>
              </div>
            </div>
            
            <!-- MEDICAL INFO SECTION -->
            <h2 class="section-title">🏥 Medical Information</h2>
            <div class="info-table">
              <div class="info-row">
                <div class="info-label">Blood Group:</div>
                <div class="info-value">${applicantData.bloodGroup || 'Not provided'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Medical Condition:</div>
                <div class="info-value">${applicantData.medicalCondition || 'None reported'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Allergies:</div>
                <div class="info-value">${applicantData.allergies || 'None reported'}</div>
              </div>
            </div>
            
            <!-- ACTION ALERT -->
            <div class="alert-box">
              <p class="alert-title">⚠️ Action Required</p>
              <p class="alert-text">
                Please log into the admissions portal to review and process this application. 
                Mark as under review, schedule an interview, or take appropriate action.
              </p>
            </div>
            
            <!-- SCHOOL INFO -->
            <div class="highlight-box" style="background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%); border-color: #dcfce7;">
              <div class="highlight-label" style="color: #166534;">School Details</div>
              <div class="highlight-value" style="color: #047857;">${SCHOOL_NAME}</div>
              <p style="font-size: 12px; color: #4b5563; margin-top: 8px;">
                Location: ${SCHOOL_LOCATION}<br>
                Motto: "${SCHOOL_MOTTO}"<br>
                Phone: ${CONTACT_PHONE}
              </p>
            </div>
          </div>
          
          <!-- FOOTER -->
          <div class="footer">
            <p class="footer-text">© ${new Date().getFullYear()} ${SCHOOL_NAME} Admissions System</p>
            <p class="footer-text">This is an automated notification. Please do not reply to this email.</p>
            <p class="footer-text">${SCHOOL_LOCATION}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}

// ====================================================================
// POST HANDLER - CREATE APPLICATION
// ====================================================================

export async function POST(req) {
  try {
    const data = await req.json();

    // 1. VALIDATION
    const requiredFields = [
      'firstName', 'lastName', 'gender', 'dateOfBirth',
      'nationality', 'county', 'constituency', 'ward',
      'postalAddress',
      'previousSchool', 'previousClass'
    ];

    const missingFields = requiredFields.filter(field => !data[field]?.trim());
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Email validation (email is now optional, but validate if provided)
    if (data.email && data.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
      }
      
      // Check for existing email only if email is provided
      const existing = await prisma.admissionApplication.findUnique({
        where: { email: data.email.toLowerCase() }
      });
      if (existing) {
        return NextResponse.json({ 
          success: false, 
          error: "Email already registered" 
        }, { status: 400 });
      }
    }

    // Phone validation (phone is now optional, but validate if provided)
    if (data.phone && data.phone.trim() !== '') {
      if (!validatePhone(data.phone)) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid phone format. Use 07XXXXXXXX or 01XXXXXXXX (or leave empty)" 
        }, { status: 400 });
      }
    }

    // 2. PREPARE DATA
    const applicationNumber = generateApplicationNumber();

    const applicationData = {
      applicationNumber,
      // Personal
      firstName: data.firstName.trim(),
      middleName: data.middleName?.trim(),
      lastName: data.lastName.trim(),
      gender: data.gender,
      dateOfBirth: new Date(data.dateOfBirth),
      nationality: data.nationality.trim(),
      county: data.county.trim(),
      constituency: data.constituency.trim(),
      ward: data.ward.trim(),
      village: data.village?.trim(),
      
      // Contact
      email: data.email ? data.email.trim().toLowerCase() : null,
      phone: data.phone ? data.phone.replace(/\s/g, '') : null,
      alternativePhone: data.alternativePhone?.replace(/\s/g, ''),
      postalAddress: data.postalAddress.trim(),
      postalCode: data.postalCode?.trim(),
      
      // Parent/Guardian
      fatherName: data.fatherName?.trim(),
      fatherPhone: data.fatherPhone?.replace(/\s/g, ''),
      fatherEmail: data.fatherEmail?.trim().toLowerCase(),
      fatherOccupation: data.fatherOccupation?.trim(),
      motherName: data.motherName?.trim(),
      motherPhone: data.motherPhone?.replace(/\s/g, ''),
      motherEmail: data.motherEmail?.trim().toLowerCase(),
      motherOccupation: data.motherOccupation?.trim(),
      guardianName: data.guardianName?.trim(),
      guardianPhone: data.guardianPhone?.replace(/\s/g, ''),
      guardianEmail: data.guardianEmail?.trim().toLowerCase(),
      guardianOccupation: data.guardianOccupation?.trim(),
      
      // Academic
      previousSchool: data.previousSchool.trim(),
      previousClass: data.previousClass.trim(),
      kcpeYear: data.kcpeYear ? parseInt(data.kcpeYear) : null,
      kcpeIndex: data.kcpeIndex?.trim(),
      kcpeMarks: data.kcpeMarks ? parseInt(data.kcpeMarks) : null,
      meanGrade: data.meanGrade?.trim(),
      
      // Medical
      medicalCondition: data.medicalCondition?.trim(),
      allergies: data.allergies?.trim(),
      bloodGroup: data.bloodGroup?.trim(),
      
      // Extracurricular
      sportsInterests: data.sportsInterests?.trim(),
      clubsInterests: data.clubsInterests?.trim(),
      talents: data.talents?.trim(),
      
      // Status (default)
      status: 'PENDING'
    };

    // 3. CREATE APPLICATION
    const application = await prisma.admissionApplication.create({
      data: applicationData
    });

    // 4. SEND EMAILS
    try {
      const fullName = `${application.firstName} ${application.lastName}`;
      // Only send confirmation email if email was provided
      if (application.email) {
        await sendApplicantConfirmation(application.email, fullName, application.applicationNumber);
      }
      await sendAdminNotification(application, application.applicationNumber);
    } catch (emailError) {
      console.warn("Email sending failed:", emailError);
      // Don't fail the request
    }

    // 5. RETURN RESPONSE
    return NextResponse.json({
      success: true,
      applicationNumber: application.applicationNumber,
      message: `Application submitted successfully to ${SCHOOL_NAME}`,
      data: {
        id: application.id,
        name: `${application.firstName} ${application.lastName}`,
        email: application.email,
        phone: application.phone,
        submittedAt: application.createdAt
      }
    });

  } catch (error) {
    console.error("Application error:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: "Duplicate entry detected" },
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
// GET HANDLER - GET ALL APPLICATIONS
// ====================================================================

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Check if there are query parameters for filtering
    const applicationNumber = searchParams.get('applicationNumber');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    let applications;
    
    // If searching by specific criteria
    if (applicationNumber) {
      applications = await prisma.admissionApplication.findUnique({
        where: { applicationNumber }
      });
      applications = applications ? [applications] : [];
    } 
    else if (email) {
      applications = await prisma.admissionApplication.findUnique({
        where: { email }
      });
      applications = applications ? [applications] : [];
    }
    else if (phone) {
      applications = await prisma.admissionApplication.findMany({
        where: { phone: { contains: phone } }
      });
    }
    else {
      // Get all applications
      applications = await prisma.admissionApplication.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    // Format the applications
    const formattedApplications = applications.map(app => ({
      id: app.id,
      applicationNumber: app.applicationNumber,
      
      // Personal Information
      firstName: app.firstName,
      middleName: app.middleName,
      lastName: app.lastName,
      gender: app.gender,
      dateOfBirth: app.dateOfBirth.toISOString().split('T')[0],
      nationality: app.nationality,
      county: app.county,
      constituency: app.constituency,
      ward: app.ward,
      village: app.village,
      
      // Contact Information
      email: app.email,
      phone: app.phone,
      alternativePhone: app.alternativePhone,
      postalAddress: app.postalAddress,
      postalCode: app.postalCode,
      
      // Parent/Guardian
      fatherName: app.fatherName,
      fatherPhone: app.fatherPhone,
      fatherEmail: app.fatherEmail,
      fatherOccupation: app.fatherOccupation,
      motherName: app.motherName,
      motherPhone: app.motherPhone,
      motherEmail: app.motherEmail,
      motherOccupation: app.motherOccupation,
      guardianName: app.guardianName,
      guardianPhone: app.guardianPhone,
      guardianEmail: app.guardianEmail,
      guardianOccupation: app.guardianOccupation,
      
      // Academic
      previousSchool: app.previousSchool,
      previousClass: app.previousClass,
      kcpeYear: app.kcpeYear,
      kcpeIndex: app.kcpeIndex,
      kcpeMarks: app.kcpeMarks,
      meanGrade: app.meanGrade,
      
      // Medical
      medicalCondition: app.medicalCondition,
      allergies: app.allergies,
      bloodGroup: app.bloodGroup,
      
      // Extracurricular
      sportsInterests: app.sportsInterests,
      clubsInterests: app.clubsInterests,
      talents: app.talents,
      
      // Status
      status: app.status,
      decisionNotes: app.decisionNotes,
      admissionOfficer: app.admissionOfficer,
      decisionDate: app.decisionDate?.toISOString().split('T')[0],
      admissionDate: app.admissionDate?.toISOString().split('T')[0],
      assignedStream: app.assignedStream,
      reportingDate: app.reportingDate?.toISOString().split('T')[0],
      admissionLetterSent: app.admissionLetterSent,
      rejectionDate: app.rejectionDate?.toISOString().split('T')[0],
      rejectionReason: app.rejectionReason,
      alternativeSuggestions: app.alternativeSuggestions,
      waitlistPosition: app.waitlistPosition,
      waitlistNotes: app.waitlistNotes,
      interviewDate: app.interviewDate?.toISOString().split('T')[0],
      interviewTime: app.interviewTime,
      interviewVenue: app.interviewVenue,
      interviewNotes: app.interviewNotes,
      conditions: app.conditions,
      conditionDeadline: app.conditionDeadline?.toISOString().split('T')[0],
      houseAssigned: app.houseAssigned,
      admissionClass: app.admissionClass,
      admissionType: app.admissionType,
      documentsVerified: app.documentsVerified,
      documentsNotes: app.documentsNotes,
      
      // Computed fields
      fullName: `${app.firstName} ${app.middleName ? app.middleName + ' ' : ''}${app.lastName}`,
      age: calculateAge(app.dateOfBirth),
      statusLabel: getStatusLabel(app.status),
      school: SCHOOL_NAME,
      
      // Timestamps
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString()
    }));

    return NextResponse.json({ 
      success: true, 
      school: SCHOOL_NAME,
      location: SCHOOL_LOCATION,
      motto: SCHOOL_MOTTO,
      count: formattedApplications.length,
      applications: formattedApplications 
    });

  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch applications from ${SCHOOL_NAME}` },
      { status: 500 }
    );
  }
}