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

const SCHOOL_NAME = 'Mary Immaculate Girls Secondary School';
const SCHOOL_LOCATION = 'Mweiga, Nyeri County';
const SCHOOL_MOTTO = 'Prayer, Discipline and Hardwork';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'admissions@maryimmaculategirls.sc.ke';

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
  return `MIGS/${year}/${randomNum}`;
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
// EMAIL TEMPLATE FUNCTIONS - FULLY MOBILE RESPONSIVE
// ====================================================================

function getApplicantConfirmationTemplate(name, appNumber) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Application Received - ${SCHOOL_NAME}</title>
      <style>
        /* MOBILE-FIRST RESPONSIVE STYLES */
        * {
          Margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
          line-height: 1.4;
          color: #333333;
          margin: 0;
          padding: 0;
          width: 100% !important;
          background-color: #f5f7fa;
        }
        
        .container {
          max-width: 600px !important;
          width: 100% !important;
          margin: 0 auto;
          background: #ffffff;
        }
        
        /* HEADER */
        .header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: #ffffff;
          padding: 30px 20px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 24px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 8px 0;
        }
        
        .header h2 {
          font-size: 16px;
          font-weight: 400;
          opacity: 0.9;
          margin: 0;
        }
        
        /* CONTENT */
        .content {
          padding: 30px 20px;
        }
        
        /* SUCCESS CARD */
        .success-card {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          padding: 25px 20px;
          margin: 20px 0;
          border-radius: 10px;
          text-align: center;
        }
        
        .success-icon {
          font-size: 48px;
          margin-bottom: 15px;
          display: block;
        }
        
        .badge {
          display: inline-block;
          background: #4caf50;
          color: white;
          padding: 8px 20px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 14px;
          margin: 10px 0;
        }
        
        /* INFO GRID */
        .info-grid {
          display: block;
          margin: 20px 0;
        }
        
        @media (min-width: 400px) {
          .info-grid {
            display: flex;
            gap: 12px;
          }
        }
        
        .info-box {
          background: #f8f9fa;
          padding: 18px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          margin-bottom: 12px;
        }
        
        @media (min-width: 400px) {
          .info-box {
            flex: 1;
            margin-bottom: 0;
          }
        }
        
        /* TEXT STYLES */
        .text-large {
          font-size: 18px;
          font-weight: 700;
          color: #1e3c72;
          margin: 8px 0;
          line-height: 1.3;
        }
        
        .text-medium {
          font-size: 16px;
          color: #333333;
          margin: 12px 0;
          line-height: 1.5;
        }
        
        .text-small {
          font-size: 13px;
          color: #666666;
          margin: 4px 0;
        }
        
        /* NEXT STEPS */
        .next-steps {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        
        .steps-list {
          list-style: none;
          padding: 0;
          margin: 15px 0 0 0;
        }
        
        .steps-list li {
          padding: 12px 0;
          border-bottom: 1px solid rgba(30, 60, 114, 0.1);
          display: flex;
          align-items: flex-start;
        }
        
        .steps-list li:last-child {
          border-bottom: none;
        }
        
        .step-icon {
          font-size: 20px;
          margin-right: 12px;
          min-width: 30px;
        }
        
        /* CONTACT INFO */
        .contact-info {
          background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
          padding: 25px 20px;
          border-radius: 10px;
          margin-top: 25px;
          text-align: center;
        }
        
        .contact-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 20px 0;
        }
        
        @media (min-width: 400px) {
          .contact-items {
            flex-direction: row;
            justify-content: center;
          }
        }
        
        .contact-item {
          text-align: center;
        }
        
        .contact-icon {
          font-size: 22px;
          margin-bottom: 8px;
          display: block;
        }
        
        /* IMPORTANT NOTES */
        .important-notes {
          background: #fff3cd;
          padding: 18px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #ff9800;
        }
        
        /* FOOTER */
        .footer {
          background: #1a1a2e;
          color: #b0b0b0;
          padding: 25px 20px;
          text-align: center;
        }
        
        .footer-links {
          margin: 15px 0;
        }
        
        .footer-links a {
          color: #667eea;
          text-decoration: none;
          margin: 0 10px;
          font-size: 14px;
        }
        
        /* RESPONSIVE MEDIA QUERIES */
        @media only screen and (max-width: 480px) {
          .header {
            padding: 25px 15px;
          }
          
          .header h1 {
            font-size: 22px;
          }
          
          .header h2 {
            font-size: 14px;
          }
          
          .content {
            padding: 25px 15px;
          }
          
          .success-card {
            padding: 20px 15px;
          }
          
          .text-large {
            font-size: 17px;
          }
          
          .text-medium {
            font-size: 15px;
          }
          
          .footer {
            padding: 20px 15px;
          }
        }
        
        /* FORCE MOBILE OPTIMIZATION */
        @media only screen and (max-width: 600px) {
          .container {
            min-width: 320px !important;
          }
          
          img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          table, tbody, tr, td {
            display: block !important;
            width: 100% !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ APPLICATION RECEIVED</h1>
          <h2>${SCHOOL_NAME}</h2>
        </div>
        
        <div class="content">
          <div class="success-card">
            <span class="success-icon">🎉</span>
            <span class="badge">Application Submitted Successfully!</span>
            <h3 style="color: #2e7d32; margin: 12px 0 0 0; font-size: 20px;">
              Welcome to ${SCHOOL_NAME} Admissions
            </h3>
          </div>
          
          <p class="text-medium">
            Dear <strong style="color: #1e3c72;">${name}</strong>,
            <br><br>
            Thank you for choosing ${SCHOOL_NAME} for your secondary education journey. 
            We have successfully received your admission application and it is now under review.
          </p>
          
          <div class="info-grid">
            <div class="info-box">
              <p class="text-small">Applicant Name</p>
              <p class="text-large">${name}</p>
            </div>
            <div class="info-box">
              <p class="text-small">Application Number</p>
              <p class="text-large">${appNumber}</p>
            </div>
          </div>
          
          <div class="next-steps">
            <h4 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 18px;">📋 What Happens Next?</h4>
            <ul class="steps-list">
              <li>
                <span class="step-icon">🔍</span>
                <span><strong>Application Review:</strong> Our admissions team will review your application within 7-14 working days</span>
              </li>
              <li>
                <span class="step-icon">📧</span>
                <span><strong>Status Updates:</strong> You will receive email notifications at every stage of the process</span>
              </li>
              <li>
                <span class="step-icon">📞</span>
                <span><strong>Verification:</strong> We may contact you for additional information or clarification</span>
              </li>
              <li>
                <span class="step-icon">🎯</span>
                <span><strong>Decision:</strong> Final admission decision will be communicated via email</span>
              </li>
            </ul>
          </div>
          
          <div class="important-notes">
            <h4 style="color: #d35400; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Notes</h4>
            <p class="text-medium">
              • Keep your application number (<strong>${appNumber}</strong>) safe for future reference<br>
              • All communications will be sent to this email address<br>
              • Do not share your application details with unauthorized persons<br>
              • Application review typically takes 2-3 weeks
            </p>
          </div>
          
          <div class="contact-info">
            <h4 style="color: #1e3c72; margin: 0 0 15px 0; font-size: 18px;">📞 Need Help?</h4>
            <p class="text-medium">
              Our admissions team is here to assist you:
            </p>
            <div class="contact-items">
              <div class="contact-item">
                <span class="contact-icon">📱</span>
                <p style="margin: 0; font-weight: 600; font-size: 15px;">${CONTACT_PHONE}</p>
                <p class="text-small">Call Us</p>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <p style="margin: 0; font-weight: 600; font-size: 15px;">${CONTACT_EMAIL}</p>
                <p class="text-small">Email Us</p>
              </div>
            </div>
            <p style="margin-top: 15px; font-size: 13px; color: #666;">
              Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="font-size: 17px; color: #1e3c72; font-weight: 600; margin-bottom: 10px;">
              We look forward to reviewing your application!
            </p>
            <p style="font-size: 15px; color: #333;">
              Best regards,<br>
              <strong>The Admissions Team</strong><br>
              ${SCHOOL_NAME}
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 15px;">
            <p style="font-size: 18px; color: #ffffff; margin: 0 0 8px 0; font-weight: 600;">${SCHOOL_NAME}</p>
            <p style="margin: 0 0 5px 0; font-size: 14px;">${SCHOOL_LOCATION}</p>
            <p style="margin: 0 0 12px 0; font-style: italic; font-size: 13px;">"${SCHOOL_MOTTO}"</p>
          </div>
          <div class="footer-links">
            <a href="mailto:${CONTACT_EMAIL}">Email Us</a>
            <a href="tel:${CONTACT_PHONE}">Call Us</a>
            <a href="#">Visit Website</a>
          </div>
          <p style="color: #888888; margin: 15px 0 0 0; font-size: 11px; line-height: 1.4;">
            © ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.<br>
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
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>New Application - ${SCHOOL_NAME}</title>
      <style>
        /* MOBILE-FIRST RESPONSIVE STYLES */
        * {
          Margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #333333;
          margin: 0;
          padding: 0;
          width: 100% !important;
          background-color: #f5f7fa;
        }
        
        .container {
          max-width: 600px !important;
          width: 100% !important;
          margin: 0 auto;
          background: #ffffff;
        }
        
        /* HEADER */
        .header {
          background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
          color: #ffffff;
          padding: 25px 20px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 8px 0;
        }
        
        .header h2 {
          font-size: 15px;
          font-weight: 400;
          opacity: 0.9;
          margin: 0;
        }
        
        /* ALERT BANNER */
        .alert-banner {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 18px 15px;
          text-align: center;
        }
        
        .badge {
          display: inline-block;
          background: #2196f3;
          color: white;
          padding: 6px 16px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 10px;
        }
        
        /* CONTENT */
        .content {
          padding: 25px 20px;
        }
        
        /* APPLICATION INFO */
        .app-info {
          background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
          padding: 22px 18px;
          border-radius: 10px;
          margin: 15px 0;
          text-align: center;
        }
        
        .app-title {
          color: #1e3c72;
          font-size: 19px;
          font-weight: 600;
          margin: 0 0 10px 0;
        }
        
        .app-name {
          font-size: 18px;
          font-weight: 700;
          color: #1e3c72;
          margin: 0 0 8px 0;
        }
        
        /* DETAILS TABLE - MOBILE FRIENDLY */
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        .details-table tr {
          display: block;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .details-table tr:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .details-table td {
          display: block;
          width: 100% !important;
          padding: 4px 0;
          border: none;
        }
        
        .details-table td:first-child {
          font-weight: 600;
          color: #1e3c72;
          font-size: 14px;
        }
        
        .details-table td:last-child {
          font-size: 15px;
          color: #333;
          padding-bottom: 4px;
        }
        
        /* ACTION BOX */
        .action-box {
          background: #e8f5e9;
          border: 2px solid #4caf50;
          padding: 20px 18px;
          border-radius: 10px;
          margin: 20px 0;
        }
        
        .action-box h4 {
          color: #2e7d32;
          font-size: 17px;
          margin: 0 0 15px 0;
          text-align: center;
        }
        
        .action-box ol {
          margin: 0;
          padding-left: 20px;
        }
        
        .action-box li {
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        /* STATS GRID */
        .stats-grid {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          margin: 15px 0;
          gap: 15px;
        }
        
        .stat-item {
          text-align: center;
          flex: 1;
          min-width: 80px;
        }
        
        .stat-number {
          font-size: 22px;
          font-weight: 700;
          color: #1e3c72;
          margin: 0;
        }
        
        .stat-label {
          font-size: 12px;
          color: #666666;
          margin: 3px 0 0 0;
        }
        
        /* FOOTER */
        .footer {
          background: #2c3e50;
          color: #b0b0b0;
          padding: 22px 18px;
          text-align: center;
        }
        
        .footer-title {
          font-size: 16px;
          color: #ffffff;
          font-weight: 600;
          margin: 0 0 8px 0;
        }
        
        /* RESPONSIVE MEDIA QUERIES */
        @media only screen and (max-width: 480px) {
          .header {
            padding: 22px 15px;
          }
          
          .header h1 {
            font-size: 20px;
          }
          
          .content {
            padding: 20px 15px;
          }
          
          .app-info {
            padding: 20px 15px;
          }
          
          .app-title {
            font-size: 17px;
          }
          
          .app-name {
            font-size: 16px;
          }
          
          .footer {
            padding: 20px 15px;
          }
        }
        
        @media only screen and (min-width: 481px) {
          .details-table {
            display: table;
          }
          
          .details-table tr {
            display: table-row;
            border-bottom: 1px solid #e9ecef;
            margin: 0;
            padding: 0;
          }
          
          .details-table td {
            display: table-cell;
            width: auto !important;
            padding: 10px 12px;
            border-bottom: 1px solid #e9ecef;
          }
          
          .details-table td:first-child {
            width: 40%;
          }
        }
        
        /* FORCE MOBILE OPTIMIZATION */
        @media only screen and (max-width: 600px) {
          .container {
            min-width: 320px !important;
          }
          
          img {
            max-width: 100% !important;
            height: auto !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 NEW APPLICATION SUBMITTED</h1>
          <h2>${SCHOOL_NAME} Admissions System</h2>
        </div>
        
        <div class="alert-banner">
          <span class="badge">ACTION REQUIRED</span>
          <p style="margin: 10px 0 0 0; font-weight: 600; color: #856404; font-size: 14px;">
            A new student application requires review in the admissions portal
          </p>
        </div>
        
        <div class="content">
          <div class="app-info">
            <p class="app-title">Application: ${applicationNumber}</p>
            <p class="app-name">${applicantData.firstName} ${applicantData.lastName}</p>
            <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Submitted: ${formattedDate}</p>
          </div>
          
          <h4 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 17px;">📋 Application Details</h4>
          
          <table class="details-table">
            <tr>
              <td>Applicant Name:</td>
              <td>${applicantData.firstName} ${applicantData.middleName || ''} ${applicantData.lastName}</td>
            </tr>
            <tr>
              <td>Date of Birth:</td>
              <td>${formatDate(applicantData.dateOfBirth)} (Age: ${age})</td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>${applicantData.gender}</td>
            </tr>
            <tr>
              <td>Nationality:</td>
              <td>${applicantData.nationality}</td>
            </tr>
            <tr>
              <td>County:</td>
              <td>${applicantData.county}</td>
            </tr>
            <tr>
              <td>Preferred Stream:</td>
              <td>${getStreamLabel(applicantData.preferredStream)}</td>
            </tr>
            <tr>
              <td>Previous School:</td>
              <td>${applicantData.previousSchool}</td>
            </tr>
            <tr>
              <td>KCPE Marks:</td>
              <td>${kcpeMarks}</td>
            </tr>
            <tr>
              <td>Contact Email:</td>
              <td>${applicantData.email}</td>
            </tr>
            <tr>
              <td>Contact Phone:</td>
              <td>${applicantData.phone}</td>
            </tr>
          </table>
          
          <div class="action-box">
            <h4>✅ Next Steps</h4>
            <ol>
              <li>Review application completeness</li>
              <li>Verify academic credentials</li>
              <li>Check for any missing documents</li>
              <li>Update application status in portal</li>
              <li>Schedule interview if required</li>
            </ol>
            <p style="margin-top: 15px; font-weight: 600; text-align: center; color: #2e7d32;">
              ⏰ Please process within 48 hours
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 18px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1e3c72; margin: 0 0 12px 0; font-size: 16px;">📊 School Statistics</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <p class="stat-number">400+</p>
                <p class="stat-label">Total Students</p>
              </div>
              <div class="stat-item">
                <p class="stat-number">4</p>
                <p class="stat-label">Streams</p>
              </div>
              <div class="stat-item">
                <p class="stat-number">98%</p>
                <p class="stat-label">Transition Rate</p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e9ecef;">
            <p style="font-size: 14px; color: #666; margin: 0 0 5px 0;">
              <strong>School Information:</strong>
            </p>
            <p style="font-size: 13px; color: #666; margin: 0 0 3px 0;">
              ${SCHOOL_NAME}
            </p>
            <p style="font-size: 13px; color: #666; margin: 0 0 3px 0;">
              ${SCHOOL_LOCATION}
            </p>
            <p style="font-size: 12px; color: #666; margin: 0;">
              Motto: "${SCHOOL_MOTTO}"
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-title">${SCHOOL_NAME} Admissions Portal</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 1.4;">
            This is an automated notification from the admissions system.<br>
            Please log in to the portal to take action.
          </p>
          <p style="margin: 15px 0 0 0; font-size: 11px; color: #888888;">
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
  
  switch (newStatus) {
    case 'ACCEPTED':
      subjectIcon = '🎉';
      title = 'Congratulations! Admission Offer';
      message = `We are pleased to inform you that your application to ${SCHOOL_NAME} has been <strong>ACCEPTED</strong>. Welcome to our school community!`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 20px; border-radius: 10px; margin: 15px 0;">
          <h4 style="color: #2e7d32; margin: 0 0 12px 0; font-size: 17px;">✅ Next Steps to Complete Admission:</h4>
          <ol style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 6px; font-size: 14px;">Complete the admission acceptance form</li>
            <li style="margin-bottom: 6px; font-size: 14px;">Submit all required documents (Birth Certificate, KCPE Certificate, etc.)</li>
            <li style="margin-bottom: 6px; font-size: 14px;">Pay admission fees as per fee structure</li>
            <li style="font-size: 14px;">Report on: <strong>${updateData.reportingDate ? formatDate(updateData.reportingDate) : 'To be communicated'}</strong></li>
          </ol>
          ${updateData.assignedStream ? `<p style="margin-top: 12px; font-size: 14px;"><strong>Assigned Stream:</strong> ${getStreamLabel(updateData.assignedStream)}</p>` : ''}
          ${updateData.admissionClass ? `<p style="font-size: 14px;"><strong>Class:</strong> ${updateData.admissionClass}</p>` : ''}
        </div>
      `;
      break;
      
    case 'REJECTED':
      subjectIcon = '📄';
      title = 'Application Status Update';
      message = `After careful review, we regret to inform you that your application to ${SCHOOL_NAME} has not been successful at this time.`;
      actionSection = `
        <div style="background: #f8f9fa; padding: 18px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #6c757d;">
          <h4 style="color: #343a40; margin: 0 0 8px 0; font-size: 16px;">Application Feedback:</h4>
          <p style="font-size: 14px; margin: 0 0 6px 0;"><strong>Reason:</strong> ${updateData.rejectionReason || 'Application did not meet the admission criteria at this time.'}</p>
          ${updateData.alternativeSuggestions ? `<p style="font-size: 14px; margin: 0 0 6px 0;"><strong>Suggestions:</strong> ${updateData.alternativeSuggestions}</p>` : ''}
          ${updateData.decisionNotes ? `<p style="font-size: 14px; margin: 0;"><strong>Notes:</strong> ${updateData.decisionNotes}</p>` : ''}
        </div>
      `;
      break;
      
    case 'INTERVIEW_SCHEDULED':
      subjectIcon = '📅';
      title = 'Interview Scheduled';
      message = `Your application to ${SCHOOL_NAME} has progressed to the interview stage. We would like to invite you for an interview.`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #f3e5f5, #e1bee7); padding: 20px; border-radius: 10px; margin: 15px 0;">
          <h4 style="color: #7b1fa2; margin: 0 0 12px 0; font-size: 17px;">📅 Interview Details:</h4>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <p style="margin: 0 0 5px 0; font-size: 13px; color: #666;">Date</p>
              <p style="margin: 0; font-weight: 600; color: #333; font-size: 15px;">${updateData.interviewDate ? formatDate(updateData.interviewDate) : 'To be confirmed'}</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <p style="margin: 0 0 5px 0; font-size: 13px; color: #666;">Time</p>
              <p style="margin: 0; font-weight: 600; color: #333; font-size: 15px;">${updateData.interviewTime || 'To be confirmed'}</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <p style="margin: 0 0 5px 0; font-size: 13px; color: #666;">Venue</p>
              <p style="margin: 0; font-weight: 600; color: #333; font-size: 15px;">${updateData.interviewVenue || 'Main Administration Building, ' + SCHOOL_LOCATION}</p>
            </div>
          </div>
          <p style="margin-top: 12px; font-size: 13px; color: #666;">
            <strong>Please bring:</strong> Original documents, parents/guardian if under 18, and any relevant certificates.
          </p>
        </div>
      `;
      break;
      
    case 'WAITLISTED':
      subjectIcon = '⏳';
      title = 'Application Waitlisted';
      message = `Your application to ${SCHOOL_NAME} has been placed on a <strong>WAITLIST</strong>. We will contact you if a space becomes available.`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 18px; border-radius: 8px; margin: 15px 0;">
          <h4 style="color: #1565c0; margin: 0 0 8px 0; font-size: 16px;">Waitlist Information:</h4>
          <p style="font-size: 14px; margin: 0 0 6px 0;"><strong>Position:</strong> ${updateData.waitlistPosition || 'Not specified'}</p>
          ${updateData.waitlistNotes ? `<p style="font-size: 14px; margin: 0 0 6px 0;"><strong>Notes:</strong> ${updateData.waitlistNotes}</p>` : ''}
          <p style="margin-top: 8px; font-size: 13px;">
            We will contact you immediately if a space becomes available. You may check your status periodically.
          </p>
        </div>
      `;
      break;
      
    case 'CONDITIONAL_ACCEPTANCE':
      subjectIcon = '📝';
      title = 'Conditional Admission Offer';
      message = `Your application to ${SCHOOL_NAME} has received a <strong>CONDITIONAL ACCEPTANCE</strong>. Please review the conditions below.`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #fff3cd, #ffeaa7); padding: 20px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #ffc107;">
          <h4 style="color: #d35400; margin: 0 0 12px 0; font-size: 17px;">📋 Conditions to Fulfill:</h4>
          <div style="background: white; padding: 18px; border-radius: 8px; margin-top: 12px;">
            <p style="font-size: 14px; margin: 0;">${updateData.conditions || 'Please contact the admissions office for specific conditions.'}</p>
          </div>
          ${updateData.conditionDeadline ? `
            <div style="background: #f8f9fa; padding: 14px; border-radius: 6px; margin-top: 12px;">
              <p style="margin: 0; font-weight: 600; font-size: 14px;">⏰ Deadline: ${formatDate(updateData.conditionDeadline)}</p>
              <p style="margin: 5px 0 0 0; font-size: 13px;">All conditions must be met by this date to secure your admission.</p>
            </div>
          ` : ''}
        </div>
      `;
      break;
      
    default:
      subjectIcon = '📧';
      title = 'Application Status Update';
      message = `Your application status has been updated to: <strong>${statusLabel}</strong>.`;
      actionSection = updateData.decisionNotes ? `
        <div style="background: #f8f9fa; padding: 18px; border-radius: 8px; margin: 15px 0;">
          <p style="font-size: 14px; margin: 0;"><strong>Notes:</strong> ${updateData.decisionNotes}</p>
        </div>
      ` : '';
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Status Update - ${SCHOOL_NAME}</title>
      <style>
        /* MOBILE-FIRST RESPONSIVE STYLES */
        * {
          Margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #333333;
          margin: 0;
          padding: 0;
          width: 100% !important;
          background-color: #f5f7fa;
        }
        
        .container {
          max-width: 600px !important;
          width: 100% !important;
          margin: 0 auto;
          background: #ffffff;
        }
        
        .header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: #ffffff;
          padding: 25px 20px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 5px 0;
        }
        
        .header h2 {
          font-size: 14px;
          font-weight: 400;
          opacity: 0.9;
          margin: 0;
        }
        
        .content {
          padding: 25px 20px;
        }
        
        .status-card {
          background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
          padding: 22px 18px;
          border-radius: 10px;
          margin: 15px 0;
          text-align: center;
        }
        
        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 15px 0;
        }
        
        @media (min-width: 400px) {
          .info-grid {
            flex-direction: row;
          }
        }
        
        .info-box {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          margin-bottom: 10px;
        }
        
        @media (min-width: 400px) {
          .info-box {
            flex: 1;
            margin-bottom: 0;
          }
        }
        
        .label {
          font-size: 12px;
          color: #666666;
          margin: 0 0 5px 0;
        }
        
        .value {
          font-size: 16px;
          font-weight: 600;
          color: #1e3c72;
          margin: 0;
          line-height: 1.3;
        }
        
        .contact-info {
          background: #e3f2fd;
          padding: 20px 18px;
          border-radius: 10px;
          margin: 20px 0;
        }
        
        .contact-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin: 15px 0;
        }
        
        @media (min-width: 400px) {
          .contact-items {
            flex-direction: row;
            justify-content: center;
          }
        }
        
        .contact-item {
          text-align: center;
        }
        
        .footer {
          background: #1a1a2e;
          color: #b0b0b0;
          padding: 22px 18px;
          text-align: center;
        }
        
        /* RESPONSIVE MEDIA QUERIES */
        @media only screen and (max-width: 480px) {
          .header {
            padding: 22px 15px;
          }
          
          .header h1 {
            font-size: 18px;
          }
          
          .content {
            padding: 20px 15px;
          }
          
          .status-card {
            padding: 20px 15px;
          }
          
          .info-box {
            padding: 14px;
          }
          
          .value {
            font-size: 15px;
          }
          
          .contact-info {
            padding: 18px 15px;
          }
          
          .footer {
            padding: 20px 15px;
          }
        }
        
        /* FORCE MOBILE OPTIMIZATION */
        @media only screen and (max-width: 600px) {
          .container {
            min-width: 320px !important;
          }
          
          img {
            max-width: 100% !important;
            height: auto !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subjectIcon} ${title}</h1>
          <h2>${SCHOOL_NAME}</h2>
        </div>
        
        <div class="content">
          <div class="status-card">
            <h3 style="color: #1e3c72; margin: 0 0 10px 0; font-size: 18px;">
              Status: ${statusLabel}
            </h3>
            <p style="font-size: 15px; line-height: 1.5; margin: 0;">
              ${message}
            </p>
          </div>
          
          <div class="info-grid">
            <div class="info-box">
              <p class="label">Applicant Name</p>
              <p class="value">${applicantName}</p>
            </div>
            <div class="info-box">
              <p class="label">Application Number</p>
              <p class="value">${applicationNumber}</p>
            </div>
          </div>
          
          ${actionSection}
          
          <div class="contact-info">
            <h4 style="color: #1e3c72; margin: 0 0 12px 0; font-size: 16px; text-align: center;">📞 Need Assistance?</h4>
            <p style="font-size: 14px; text-align: center; margin: 0 0 15px 0;">Our admissions team is here to help:</p>
            <div class="contact-items">
              <div class="contact-item">
                <p style="margin: 0; font-weight: 600; font-size: 14px;">${CONTACT_PHONE}</p>
                <p class="label">Call Us</p>
              </div>
              <div class="contact-item">
                <p style="margin: 0; font-weight: 600; font-size: 14px;">${CONTACT_EMAIL}</p>
                <p class="label">Email Us</p>
              </div>
      
            </div>
            <p style="margin-top: 12px; font-size: 12px; color: #666; text-align: center;">
              Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 18px; border-top: 1px solid #e9ecef;">
            <p style="font-size: 16px; color: #1e3c72; font-weight: 600; margin-bottom: 8px;">
              Thank you for your interest in ${SCHOOL_NAME}
            </p>
            <p style="font-size: 14px; color: #333; margin: 0;">
              Best regards,<br>
              <strong>The Admissions Team</strong><br>
              ${SCHOOL_NAME}
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 12px;">
            <p style="font-size: 16px; color: #ffffff; margin: 0 0 6px 0; font-weight: 600;">${SCHOOL_NAME}</p>
            <p style="margin: 0 0 4px 0; font-size: 13px;">${SCHOOL_LOCATION}</p>
            <p style="margin: 0 0 10px 0; font-style: italic; font-size: 12px;">"${SCHOOL_MOTTO}"</p>
          </div>
          <p style="color: #888888; margin: 0; font-size: 11px; line-height: 1.4;">
            © ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.<br>
            This is an automated email. Please do not reply to this email.
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
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Application Deleted - ${SCHOOL_NAME}</title>
      <style>
        /* MOBILE-FIRST RESPONSIVE STYLES */
        * {
          Margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #333333;
          margin: 0;
          padding: 0;
          width: 100% !important;
          background-color: #f5f5f5;
        }
        
        .container {
          max-width: 600px !important;
          width: 100% !important;
          margin: 0 auto;
          background: #ffffff;
        }
        
        .header {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: #ffffff;
          padding: 25px 20px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 8px 0;
        }
        
        .header p {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .content {
          padding: 25px 20px;
        }
        
        .alert-box {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 18px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .info-box {
          background: #f8f9fa;
          padding: 18px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .info-box h4 {
          color: #495057;
          font-size: 16px;
          margin: 0 0 12px 0;
        }
        
        .info-box p {
          font-size: 14px;
          margin: 0 0 8px 0;
          color: #333;
        }
        
        .footer {
          background: #343a40;
          color: #b0b0b0;
          padding: 22px 18px;
          text-align: center;
        }
        
        /* RESPONSIVE MEDIA QUERIES */
        @media only screen and (max-width: 480px) {
          .header {
            padding: 22px 15px;
          }
          
          .header h1 {
            font-size: 18px;
          }
          
          .content {
            padding: 20px 15px;
          }
          
          .alert-box, .info-box {
            padding: 15px;
          }
          
          .footer {
            padding: 20px 15px;
          }
        }
        
        @media only screen and (max-width: 600px) {
          .container {
            min-width: 320px !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗑️ Application Deleted</h1>
          <p>${SCHOOL_NAME}</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <h3 style="color: #721c24; margin: 0 0 10px 0; font-size: 16px;">⚠️ Application Record Deleted</h3>
            <p style="margin: 0; color: #721c24; font-size: 14px;">
              An application record has been permanently deleted from the admissions system.
            </p>
          </div>
          
          <div class="info-box">
            <h4>Deleted Application Details:</h4>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <p><strong>Application Number:</strong> ${applicationNumber}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Deleted On:</strong> ${deletionDate}</p>
            <p><strong>Deleted By:</strong> ${deletedBy}</p>
            <p><strong>Reason:</strong> Application record permanently removed from database</p>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #495057; font-size: 13px;">
              <strong>Note:</strong> This deletion is permanent and cannot be undone. 
              All associated data has been removed from the system.
            </p>
          </div>
          
          <p style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 13px;">
            This is an automated notification from the ${SCHOOL_NAME} Admissions System.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #fff;">${SCHOOL_NAME}</p>
          <p style="margin: 0 0 5px 0; font-size: 13px;">${SCHOOL_LOCATION}</p>
          <p style="margin: 0; font-style: italic; font-size: 12px;">"${SCHOOL_MOTTO}"</p>
          <p style="margin: 15px 0 0 0; color: #888; font-size: 10px;">
            © ${new Date().getFullYear()} ${SCHOOL_NAME}. Confidential - For internal use only.
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