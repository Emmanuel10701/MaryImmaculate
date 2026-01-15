import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// ====================================================================
// CONFIGURATION
// ====================================================================
const isProduction = process.env.NODE_ENV === 'production';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
  rateDelta: 2000,
  rateLimit: 5,
});

// School Information
const SCHOOL_NAME = process.env.SCHOOL_NAME || 'Mary Immaculate Girls Secondary School';
const SCHOOL_LOCATION = process.env.SCHOOL_LOCATION || 'Mweiga, Nyeri County';
const SCHOOL_MOTTO = process.env.SCHOOL_MOTTO || 'Prayer, Discipline and Hardwork';
const CONTACT_PHONE = process.env.CONTACT_PHONE || '+254720123456';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'admissions@maryimmaculategirls.sc.ke';
const SCHOOL_WEBSITE = process.env.SCHOOL_WEBSITE || 'https://maryimmaculategirls.sc.ke';

// Social Media Configuration (Removed TikTok and Instagram as requested)
const SOCIAL_MEDIA = {
  facebook: {
    url: process.env.SCHOOL_FACEBOOK || 'https://facebook.com/maryimmaculategirls',
    color: '#1877F2',
  },
  youtube: {
    url: process.env.SCHOOL_YOUTUBE || 'https://youtube.com/c/maryimmaculategirls',
    color: '#FF0000',
  },
  linkedin: {
    url: process.env.SCHOOL_LINKEDIN || 'https://linkedin.com/school/maryimmaculategirls',
    color: '#0A66C2',
  },
  twitter: {
    url: process.env.SCHOOL_TWITTER || 'https://twitter.com/maryimmaculategirls',
    color: '#1DA1F2',
  }
};

// Path for attachments storage
const ATTACHMENTS_DIR = path.join(process.cwd(), 'public', 'emailattachments');

// Ensure attachments directory exists
if (!fs.existsSync(ATTACHMENTS_DIR)) {
  fs.mkdirSync(ATTACHMENTS_DIR, { recursive: true });
}

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

function getRecipientTypeLabel(type) {
  const labels = {
    'all': 'All Recipients',
    'parents': 'Parents & Guardians',
    'teachers': 'Teaching Staff',
    'administration': 'Administration',
    'bom': 'Board of Management',
    'support': 'Support Staff',
    'staff': 'All School Staff'
  };
  return labels[type] || type;
}

function sanitizeContent(content) {
  // Reduce font-size styles
  let safeContent = content
    .replace(/font-size\s*:\s*[^;]+;/gi, '')
    .replace(/<font[^>]*>/gi, '')
    .replace(/<\/font>/gi, '')
    .replace(/size\s*=\s*["'][^"']*["']/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');
  
  // Convert newlines to <br> tags
  safeContent = safeContent.replace(/\n/g, '<br>');
  
  // Remove extra font styles
  safeContent = safeContent.replace(/style\s*=\s*["'][^"']*font[^"']*["']/gi, '');

  return safeContent;
}
function getModernEmailTemplate({ 
  subject = '', 
  content = '',
  senderName = 'School Administration',
  recipientType = 'all'
}) {
  
  const recipientTypeLabel = getRecipientTypeLabel(recipientType);
  const safeContent = sanitizeContent(content);
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>${subject} | ${SCHOOL_NAME}</title>
      <style>
        /* RESET & BASE STYLES */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 20px;
          width: 100% !important;
          background-color: #f5f7fa;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        /* CONTAINER - RESPONSIVE */
        .container {
          max-width: 600px !important;
          width: 100% !important;
          margin: 0 auto !important;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        /* HEADER - FIXED FOR MOBILE */
        .header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: #ffffff;
          padding: 40px 25px;
          text-align: center;
          position: relative;
        }
        
        .school-name {
          font-size: 26px !important;
          font-weight: 700;
          line-height: 1.3;
          margin: 0 0 15px 0;
          letter-spacing: -0.3px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .email-subject {
          font-size: 20px !important;
          font-weight: 600;
          opacity: 0.95;
          margin: 0 0 15px 0;
          color: #f0f7ff;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .school-motto {
          font-size: 15px !important;
          font-style: italic;
          font-weight: 400;
          opacity: 0.9;
          margin: 15px 0 0 0;
          color: #dbeafe;
        }
        
        /* CONTENT SECTION - RESPONSIVE */
        .content {
          padding: 30px 25px !important;
        }
        
        /* CAMPAIGN BADGE - SMALLER FOR MOBILE */
        .campaign-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
          padding: 10px 20px;
          border-radius: 50px;
          margin-bottom: 20px;
          border: 1px solid #e5e7eb;
          font-size: 14px !important;
        }
        
        .badge-icon {
          margin-right: 8px;
          font-size: 16px;
          color: #1e3c72;
        }
        
        .recipient-type {
          color: #1e3c72;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        
        /* MESSAGE CARD - RESPONSIVE */
        .message-card {
          background: #ffffff;
          padding: 30px 25px !important;
          border-radius: 12px;
          margin: 20px 0 30px 0;
          border: 1px solid #e5e7eb;
          font-size: 16px !important;
          line-height: 1.7;
          color: #4b5563;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .message-card p {
          margin: 0 0 20px 0;
          font-size: 16px !important;
          line-height: 1.7;
        }
        
        .message-card p:last-child {
          margin-bottom: 0;
        }
        
        /* ATTACHMENTS SECTION */
        .attachments-section {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #e5e7eb;
        }
        
        .attachments-title {
          font-size: 16px !important;
          color: #1e3c72;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .attachments-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .attachment-item {
          display: flex;
          align-items: center;
          padding: 10px;
          margin-bottom: 8px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        
        .attachment-icon {
          margin-right: 12px;
          font-size: 18px;
          color: #1e3c72;
        }
        
        .attachment-name {
          flex: 1;
          font-size: 14px !important;
          color: #374151;
        }
        
        /* CONTACT INFO - STACK ON MOBILE */
        .contact-info {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 25px !important;
          border-radius: 12px;
          margin: 30px 0;
          text-align: center;
        }
        
        .contact-title {
          font-size: 16px !important;
          color: #1e3c72;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .contact-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 20px 0;
        }
        
        .contact-item {
          flex: 1;
          min-width: 0;
        }
        
        .contact-label {
          font-size: 12px !important;
          color: #6b7280;
          margin: 0 0 5px 0;
        }
        
        .contact-value {
          font-size: 15px !important;
          color: #1e3c72;
          font-weight: 600;
          margin: 0;
          word-break: break-all;
        }
        
        /* SENDER INFO - RESPONSIVE */
        .sender-info {
          text-align: center;
          margin-top: 30px;
          padding: 25px;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
        }
        
        .sender-name {
          font-size: 16px !important;
          color: #1e3c72;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .sender-title {
          font-size: 15px !important;
          color: #333;
          margin: 0 0 8px 0;
          line-height: 1.5;
        }
        
        .sender-note {
          margin-top: 15px;
          font-size: 13px !important;
          color: #6b7280;
          line-height: 1.6;
        }
        
        /* FOOTER - RESPONSIVE */
        .footer {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #b0b0b0;
          padding: 40px 25px 30px;
          text-align: center;
          position: relative;
        }
        
        .footer-school {
          font-size: 20px !important;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 10px 0;
          letter-spacing: 0.3px;
        }
        
        .footer-location {
          font-size: 15px !important;
          color: #d1d5db;
          margin: 0 0 8px 0;
        }
        
        .footer-motto {
          font-size: 14px !important;
          font-style: italic;
          color: #9ca3af;
          margin: 0 0 25px 0;
          font-weight: 400;
        }
        
        /* SOCIAL MEDIA LINKS - TEXT-ONLY VERSION */
        .social-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 15px;
          margin: 25px 0;
          padding: 0;
          list-style: none;
        }
        
        .social-link {
          display: inline-block;
        }
        
        .social-link a {
          display: inline-block;
          padding: 8px 16px;
          background-color: #2d3748;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px !important;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid #4a5568;
        }
        
        .social-link a:hover {
          background-color: #4a5568;
          transform: translateY(-1px);
        }
        
        /* Social media specific colors */
        .social-facebook a {
          background-color: #1877F2;
          border-color: #1877F2;
        }
        
        .social-facebook a:hover {
          background-color: #0d65d9;
        }
        
        .social-youtube a {
          background-color: #FF0000;
          border-color: #FF0000;
        }
        
        .social-youtube a:hover {
          background-color: #cc0000;
        }
        
        .social-linkedin a {
          background-color: #0A66C2;
          border-color: #0A66C2;
        }
        
        .social-linkedin a:hover {
          background-color: #0959a6;
        }
        
        .social-twitter a {
          background-color: #1DA1F2;
          border-color: #1DA1F2;
        }
        
        .social-twitter a:hover {
          background-color: #0c8bd9;
        }
        
        /* COPYRIGHT */
        .copyright {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #374151;
          font-size: 12px !important;
          color: #9ca3af;
          line-height: 1.6;
        }
        
        /* RESPONSIVE MEDIA QUERIES */
        @media only screen and (max-width: 480px) {
          body {
            padding: 10px !important;
          }
          
          .container {
            border-radius: 8px;
          }
          
          .header {
            padding: 30px 20px !important;
          }
          
          .school-name {
            font-size: 22px !important;
            margin-bottom: 12px;
          }
          
          .email-subject {
            font-size: 18px !important;
            margin-bottom: 12px;
          }
          
          .school-motto {
            font-size: 14px !important;
          }
          
          .content {
            padding: 25px 20px !important;
          }
          
          .message-card {
            padding: 25px 20px !important;
            font-size: 14px !important;
            line-height: 1.6;
          }
          
          .message-card p {
            font-size: 14px !important;
            line-height: 1.6;
          }
          
          .contact-info {
            padding: 20px !important;
          }
          
          .contact-title {
            font-size: 15px !important;
          }
          
          .contact-value {
            font-size: 14px !important;
          }
          
          .social-link a {
            padding: 4.2px 8.4px !important;
            font-size: 9.1px !important;
            transform: scale(0.7);
            transform-origin: center;
            margin: -3px;
          }
          
          .social-links {
            gap: 7px !important;
          }
          
          .footer {
            padding: 30px 20px 25px !important;
          }
          
          .footer-school {
            font-size: 18px !important;
          }
          
          .footer-location {
            font-size: 14px !important;
          }
          
          .footer-motto {
            font-size: 13px !important;
          }
        }
        
        @media only screen and (min-width: 481px) and (max-width: 600px) {
          .social-link a {
            padding: 5.6px 11.2px !important;
            font-size: 9.8px !important;
            transform: scale(0.7);
            transform-origin: center;
            margin: -3px;
          }
          
          .social-links {
            gap: 10.5px !important;
          }
          
          .contact-grid {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .contact-item {
            min-width: 150px;
          }
        }
        
        @media only screen and (min-width: 601px) {
          .social-link a {
            padding: 5.6px 11.2px !important;
            font-size: 9.8px !important;
          }
          
          .social-links {
            gap: 14px !important;
          }
          
          .contact-grid {
            flex-direction: row;
            justify-content: center;
            gap: 30px;
          }
        }
        
        /* PRINT STYLES */
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
          }
          
          .container {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
          }
          
          .social-links {
            display: none !important;
          }
        }
        
        /* OUTLOOK SPECIFIC FIXES */
        .ExternalClass {
          width: 100%;
        }
        
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        
        /* FORCE TABLES ON OLD EMAIL CLIENTS */
        table {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        
        img {
          -ms-interpolation-mode: bicubic;
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- HEADER -->
        <div class="header">
          <h1 class="school-name">${SCHOOL_NAME}</h1>
          <h2 class="email-subject">${subject}</h2>
          <p class="school-motto">"${SCHOOL_MOTTO}"</p>
        </div>
        
        <!-- CONTENT -->
        <div class="content">
          <!-- Campaign Badge -->
          <div class="campaign-badge">
            <span class="badge-icon">📨</span>
            <span class="recipient-type">${recipientTypeLabel}</span>
          </div>
          
          <!-- Message Content -->
          <div class="message-card">
            ${safeContent}
          </div>
          
          <!-- Sender Info -->
          <div class="sender-info">
            <p class="sender-name">Best Regards,</p>
            <p class="sender-title">
              <strong>${senderName}</strong><br>
              <span>${SCHOOL_NAME} Administration</span>
            </p>
            <p class="sender-note">
              This is an official communication from ${SCHOOL_NAME}.<br>
              Please do not reply directly to this automated message.
            </p>
          </div>
        </div>
        
        <!-- FOOTER -->
        <div class="footer">
          <h3 class="footer-school">${SCHOOL_NAME}</h3>
          <p class="footer-location">${SCHOOL_LOCATION}</p>
          <p class="footer-motto">"${SCHOOL_MOTTO}"</p>
          
          <!-- Social Media Links - TEXT ONLY VERSION -->
          <ul class="social-links">
            <li class="social-link social-facebook">
              <a href="${SOCIAL_MEDIA.facebook.url}" target="_blank" title="Follow us on Facebook">
                Facebook
              </a>
            </li>
            
            <li class="social-link social-youtube">
              <a href="${SOCIAL_MEDIA.youtube.url}" target="_blank" title="Subscribe on YouTube">
                YouTube
              </a>
            </li>
            
            <li class="social-link social-linkedin">
              <a href="${SOCIAL_MEDIA.linkedin.url}" target="_blank" title="Connect on LinkedIn">
                LinkedIn
              </a>
            </li>
            
            <li class="social-link social-twitter">
              <a href="${SOCIAL_MEDIA.twitter.url}" target="_blank" title="Follow us on Twitter">
                X (Twitter)
              </a>
            </li>
          </ul>
          
          <!-- Copyright -->
          <div class="copyright">
            © ${currentYear} ${SCHOOL_NAME}. All rights reserved.<br>
            <span>This email was sent to you as an important member of our school community.</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
function getFileIcon(fileType) {
  const icons = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'xls': '📊',
    'xlsx': '📊',
    'ppt': '📽️',
    'pptx': '📽️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'txt': '📃',
    'zip': '🗜️',
    'rar': '🗜️',
    'mp3': '🎵',
    'mp4': '🎬',
    'avi': '🎬',
    'mov': '🎬'
  };
  
  const ext = fileType.toLowerCase();
  return icons[ext] || '📎';
}

function generateAttachmentHTML(attachments) {
  if (!attachments || attachments.length === 0) return '';
  
  try {
    const attachmentsArray = JSON.parse(attachments);
    if (!Array.isArray(attachmentsArray) || attachmentsArray.length === 0) return '';
    
    return `
      <div class="attachments-section">
        <h3 class="attachments-title">📎 Attachments</h3>
        <ul class="attachments-list">
          ${attachmentsArray.map(attachment => `
            <li class="attachment-item">
              <span class="attachment-icon">${getFileIcon(attachment.fileType)}</span>
              <span class="attachment-name">
                ${attachment.originalName || attachment.filename}
                ${attachment.fileSize ? `<br><small>${formatFileSize(attachment.fileSize)}</small>` : ''}
              </span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  } catch (error) {
    console.error('Error parsing attachments:', error);
    return '';
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function sendModernEmails(campaign) {
  const startTime = Date.now();
  
  const recipients = campaign.recipients.split(",").map(r => r.trim());
  const recipientType = campaign.recipientType || 'all';
  
  const sentRecipients = [];
  const failedRecipients = [];
  
  // Parse attachments
  let attachmentsArray = [];
  try {
    if (campaign.attachments) {
      attachmentsArray = JSON.parse(campaign.attachments);
    }
  } catch (error) {
    console.error('Error parsing attachments:', error);
  }
  
  // Prepare email attachments for nodemailer
  const emailAttachments = attachmentsArray.map(attachment => {
    const filePath = path.join(ATTACHMENTS_DIR, attachment.filename);
    return {
      filename: attachment.originalName || attachment.filename,
      path: filePath,
      contentType: getContentType(attachment.fileType)
    };
  });

  // Optimized sequential processing
  for (const recipient of recipients) {
    try {
      // Generate email content with attachments section
      let htmlContent = getModernEmailTemplate({
        subject: campaign.subject,
        content: campaign.content,
        senderName: 'School Administration',
        recipientType: recipientType
      });

      // Add attachments section if there are attachments
      if (campaign.attachments) {
        const attachmentsSection = generateAttachmentHTML(campaign.attachments);
        // Insert attachments section before sender info
        htmlContent = htmlContent.replace(
          '<!-- Sender Info -->',
          `${attachmentsSection}\n<!-- Sender Info -->`
        );
      }

      const mailOptions = {
        from: `"${SCHOOL_NAME} Administration" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: `${campaign.subject} • ${SCHOOL_NAME}`,
        html: htmlContent,
        text: campaign.content.replace(/<[^>]*>/g, ''),
        attachments: emailAttachments,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      const info = await transporter.sendMail(mailOptions);
      
      sentRecipients.push({
        email: recipient,
        messageId: info.messageId,
        timestamp: new Date().toISOString()
      });

      // Small delay between emails to prevent rate limiting
      if (sentRecipients.length % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      failedRecipients.push({ 
        recipient, 
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });
      
      // If we get a timeout error, wait a bit before continuing
      if (error.message.includes('Timeout') || error.code === 'ETIMEDOUT') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  try {
    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { 
        sentAt: new Date(),
        sentCount: sentRecipients.length,
        failedCount: failedRecipients.length,
        status: 'published',
      },
    });
  } catch (dbError) {
    console.error(`Failed to update campaign statistics:`, dbError);
  }

  const processingTime = Date.now() - startTime;
  const summary = {
    total: recipients.length,
    successful: sentRecipients.length,
    failed: failedRecipients.length,
    successRate: recipients.length > 0 ? Math.round((sentRecipients.length / recipients.length) * 100) : 0,
    processingTime: `${processingTime}ms`
  };

  return { 
    sentRecipients, 
    failedRecipients,
    summary
  };
}

function getContentType(fileType) {
  const mimeTypes = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'txt': 'text/plain',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4'
  };
  
  return mimeTypes[fileType.toLowerCase()] || 'application/octet-stream';
}

// Helper to validate email addresses
function validateEmailList(emailList) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validEmails = [];
  const invalidEmails = [];
  
  emailList.forEach(email => {
    if (emailRegex.test(email.trim())) {
      validEmails.push(email.trim());
    } else {
      invalidEmails.push(email);
    }
  });
  
  return { validEmails, invalidEmails };
}

// Helper to save uploaded file
async function saveUploadedFile(file) {
  if (!file || file.size === 0) return null;
  
  const originalName = file.name;
  const fileExtension = path.extname(originalName).toLowerCase();
  const uniqueFilename = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(ATTACHMENTS_DIR, uniqueFilename);
  
  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  fs.writeFileSync(filePath, buffer);
  
  return {
    filename: uniqueFilename,
    originalName: originalName,
    fileType: fileExtension.replace('.', ''),
    fileSize: file.size,
    uploadedAt: new Date().toISOString()
  };
}

// Validate attachment size before saving
function validateAttachmentSize(attachmentsArray) {
  const MAX_ATTACHMENTS_SIZE = 50000; // 50KB max for metadata
  
  const jsonString = JSON.stringify(attachmentsArray);
  if (jsonString.length > MAX_ATTACHMENTS_SIZE) {
    throw new Error(`Attachments metadata is too large (${jsonString.length} bytes). Maximum allowed is ${MAX_ATTACHMENTS_SIZE} bytes.`);
  }
  return true;
}

// ====================================================================
// API HANDLERS
// ====================================================================

// 🔹 POST - Create a new email campaign with FormData
export async function POST(req) {
  let campaign = null;
  
  try {
    // Check if request is FormData (for file uploads)
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData with file uploads
      const formData = await req.formData();
      
      // Extract text fields
      const title = formData.get('title')?.toString() || '';
      const subject = formData.get('subject')?.toString() || '';
      const content = formData.get('content')?.toString() || '';
      const recipients = formData.get('recipients')?.toString() || '';
      const status = formData.get('status')?.toString() || 'draft';
      const recipientType = formData.get('recipientType')?.toString() || 'all';
      const existingAttachmentsJson = formData.get('existingAttachments')?.toString();
      
      // Parse existing attachments if provided
      let existingAttachments = [];
      if (existingAttachmentsJson) {
        try {
          existingAttachments = JSON.parse(existingAttachmentsJson);
        } catch (error) {
          console.error('Error parsing existing attachments:', error);
        }
      }
      
      // Process new file uploads
      const newAttachments = [];
      const attachmentFiles = formData.getAll('attachments');
      
      for (const file of attachmentFiles) {
        if (file && file.size > 0) {
          const savedFile = await saveUploadedFile(file);
          if (savedFile) {
            newAttachments.push(savedFile);
          }
        }
      }
      
      // Combine existing and new attachments
      const allAttachments = [...existingAttachments, ...newAttachments];
      
      // Validate attachment size
      if (allAttachments.length > 0) {
        validateAttachmentSize(allAttachments);
      }
      
      // Validate required fields
      if (!title || !subject || !content || !recipients) {
        return NextResponse.json({ 
          success: false, 
          error: "All fields are required: title, subject, content, and recipients" 
        }, { status: 400 });
      }
      
      // Validate content length
      const MAX_CONTENT_LENGTH = 65535;
      if (content.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json({ 
          success: false, 
          error: `Content is too long. Maximum ${MAX_CONTENT_LENGTH} characters allowed.`,
          currentLength: content.length
        }, { status: 400 });
      }
      
      // Validate recipients
      const emailList = recipients.split(",").map(r => r.trim()).filter(r => r.length > 0);
      if (emailList.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: "At least one valid email address is required" 
        }, { status: 400 });
      }
      
      const { validEmails, invalidEmails } = validateEmailList(emailList);
      if (invalidEmails.length > 0) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid email addresses detected",
          invalidEmails 
        }, { status: 400 });
      }
      
      // Deduplicate emails
      const uniqueEmails = [...new Set(validEmails)];
      
      // Optimize attachment data to reduce size
      const optimizedAttachments = allAttachments.map(attachment => ({
        filename: attachment.filename,
        originalName: attachment.originalName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        uploadedAt: attachment.uploadedAt
      }));
      
      // Create campaign in database
      campaign = await prisma.emailCampaign.create({
        data: { 
          title, 
          subject, 
          content, 
          recipients: uniqueEmails.join(', '),
          recipientType,
          status,
          attachments: optimizedAttachments.length > 0 ? JSON.stringify(optimizedAttachments) : null,
          ...(status === 'published' && { sentAt: new Date() })
        },
      });
      
      let emailResults = null;
      
      // Send emails immediately if published
      if (status === "published") {
        try {
          emailResults = await sendModernEmails(campaign);
          
          // Update campaign with email results
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { 
              sentCount: emailResults.summary.successful,
              failedCount: emailResults.summary.failed
            },
          });
        } catch (emailError) {
          console.error(`Email sending failed:`, emailError);
          
          // Update campaign to reflect failure
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { 
              failedCount: uniqueEmails.length,
              status: 'draft',
            },
          });
          
          emailResults = {
            error: emailError.message,
            sentRecipients: [],
            failedRecipients: uniqueEmails.map(email => ({ 
              recipient: email, 
              error: emailError.message 
            })),
            summary: {
              total: uniqueEmails.length,
              successful: 0,
              failed: uniqueEmails.length,
              successRate: 0
            }
          };
        }
      }
      
      // Format response
      const responseData = {
        id: campaign.id,
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content,
        recipients: campaign.recipients,
        recipientCount: uniqueEmails.length,
        recipientType: campaign.recipientType || 'all',
        recipientTypeLabel: getRecipientTypeLabel(campaign.recipientType || 'all'),
        status: campaign.status,
        sentAt: campaign.sentAt,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        attachments: optimizedAttachments,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      };
      
      const response = {
        success: true, 
        campaign: responseData,
        emailResults,
        message: status === "published" 
          ? `Campaign created and ${emailResults?.summary?.successful || 0} emails sent successfully` 
          : `Campaign saved as draft successfully`
      };
      
      return NextResponse.json(response, { 
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
    } else {
      // Handle JSON request (for backwards compatibility)
      const { title, subject, content, recipients, status = "draft", recipientType = "all", attachments = null } = await req.json();
      
      // Validate required fields
      if (!title || !subject || !content || !recipients) {
        return NextResponse.json({ 
          success: false, 
          error: "All fields are required: title, subject, content, and recipients" 
        }, { status: 400 });
      }
      
      // Validate content length
      const MAX_CONTENT_LENGTH = 65535;
      if (content.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json({ 
          success: false, 
          error: `Content is too long. Maximum ${MAX_CONTENT_LENGTH} characters allowed.`,
          currentLength: content.length
        }, { status: 400 });
      }
      
      // Validate recipients format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailList = recipients.split(",").map(r => r.trim()).filter(r => r.length > 0);
      
      if (emailList.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: "At least one valid email address is required" 
        }, { status: 400 });
      }
      
      const invalidEmails = emailList.filter(email => !emailRegex.test(email));
      
      if (invalidEmails.length > 0) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid email addresses detected",
          invalidEmails 
        }, { status: 400 });
      }
      
      // Deduplicate emails
      const uniqueEmails = [...new Set(emailList)];
      
      // Create campaign in database
      campaign = await prisma.emailCampaign.create({
        data: { 
          title, 
          subject, 
          content, 
          recipients: uniqueEmails.join(', '),
          recipientType,
          status: status || "draft",
          attachments: attachments,
        },
      });
      
      let emailResults = null;
      
      // Send emails immediately if published
      if (status === "published") {
        try {
          emailResults = await sendModernEmails(campaign);
        } catch (emailError) {
          console.error(`Email sending failed:`, emailError);
          
          // Update campaign to reflect failure
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: { 
              failedCount: uniqueEmails.length,
              status: 'draft',
            },
          });
          
          emailResults = {
            error: emailError.message,
            sentRecipients: [],
            failedRecipients: uniqueEmails.map(email => ({ 
              recipient: email, 
              error: emailError.message 
            })),
            summary: {
              total: uniqueEmails.length,
              successful: 0,
              failed: uniqueEmails.length,
              successRate: 0
            }
          };
        }
      }
      
      // Format response
      const responseData = {
        id: campaign.id,
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content.substring(0, 200) + (campaign.content.length > 200 ? '...' : ''),
        recipients: campaign.recipients,
        recipientCount: uniqueEmails.length,
        recipientType: campaign.recipientType || 'all',
        recipientTypeLabel: getRecipientTypeLabel(campaign.recipientType || 'all'),
        status: campaign.status,
        sentAt: campaign.sentAt,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        attachments: campaign.attachments ? JSON.parse(campaign.attachments) : [],
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      };
      
      const response = {
        success: true, 
        campaign: responseData,
        emailResults,
        message: status === "published" 
          ? `Campaign created and ${emailResults?.summary?.successful || 0} emails sent successfully` 
          : `Campaign saved as draft successfully`
      };
      
      return NextResponse.json(response, { 
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }
    
  } catch (error) {
    console.error(`POST Error:`, error);
    
    let statusCode = 500;
    let errorMessage = error.message || "Failed to create campaign";
    
    if (error.code === 'P2000') {
      statusCode = 400;
      errorMessage = "Data too long for database column. Please shorten your content or attachments metadata.";
    } else if (error.code === 'P2002') {
      statusCode = 409;
      errorMessage = "A campaign with similar data already exists";
    } else if (error.code === 'P2021' || error.code === 'P1001') {
      errorMessage = "Database connection error. Please try again later.";
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: error.message
    }, { status: statusCode });
  }
}

// 🔹 GET - Get all campaigns with filtering and pagination
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Build filter conditions
    const where = {};
    
    if (searchParams.has('status')) {
      where.status = searchParams.get('status');
    }
    
    if (searchParams.has('recipientType')) {
      where.recipientType = searchParams.get('recipientType');
    }
    
    if (searchParams.has('search')) {
      const searchTerm = searchParams.get('search');
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { subject: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
    
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;
    
    // Get total count and campaigns
    const [totalCount, campaigns] = await Promise.all([
      prisma.emailCampaign.count({ where }),
      prisma.emailCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          subject: true,
          content: true,
          recipients: true,
          recipientType: true,
          status: true,
          sentAt: true,
          sentCount: true,
          failedCount: true,
          attachments: true,
          createdAt: true,
          updatedAt: true,
        }
      })
    ]);
    
    // Format response
    const formattedCampaigns = campaigns.map(campaign => {
      const recipientCount = campaign.recipients.split(',').length;
      const recipientType = campaign.recipientType || 'all';
      
      // Parse attachments
      let attachments = [];
      try {
        if (campaign.attachments) {
          attachments = JSON.parse(campaign.attachments);
        }
      } catch (error) {
        console.error('Error parsing attachments:', error);
      }
      
      return {
        id: campaign.id,
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content.length > 500 
          ? campaign.content.substring(0, 500) + '...' 
          : campaign.content,
        recipients: campaign.recipients,
        recipientCount,
        recipientType,
        recipientTypeLabel: getRecipientTypeLabel(recipientType),
        status: campaign.status,
        sentAt: campaign.sentAt,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        attachments,
        hasAttachments: attachments.length > 0,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        successRate: campaign.sentCount && recipientCount > 0 
          ? Math.round((campaign.sentCount / recipientCount) * 100)
          : 0
      };
    });
    
    // Calculate summary statistics
    const summary = {
      totalCampaigns: totalCount,
      sentEmails: formattedCampaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0),
      failedEmails: formattedCampaigns.reduce((sum, c) => sum + (c.failedCount || 0), 0),
      totalRecipients: formattedCampaigns.reduce((sum, c) => sum + (c.recipientCount || 0), 0),
      draftCampaigns: formattedCampaigns.filter(c => c.status === 'draft').length,
      publishedCampaigns: formattedCampaigns.filter(c => c.status === 'published').length,
      campaignsWithAttachments: formattedCampaigns.filter(c => c.hasAttachments).length,
      averageSuccessRate: formattedCampaigns.length > 0
        ? Math.round(formattedCampaigns.reduce((sum, c) => sum + c.successRate, 0) / formattedCampaigns.length)
        : 0
    };
    
    const response = {
      success: true,
      campaigns: formattedCampaigns,
      summary,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPreviousPage: page > 1
      }
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
        'CDN-Cache-Control': 'public, max-age=60',
      }
    });
    
  } catch (error) {
    console.error(`GET Error:`, error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to retrieve campaigns"
    }, { status: 500 });
  }
}

// 🔹 PUT - Update an existing campaign
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData update with file uploads
      const formData = await req.formData();
      
      // Extract text fields
      const title = formData.get('title')?.toString();
      const subject = formData.get('subject')?.toString();
      const content = formData.get('content')?.toString();
      const recipients = formData.get('recipients')?.toString();
      const status = formData.get('status')?.toString();
      const recipientType = formData.get('recipientType')?.toString();
      const existingAttachmentsJson = formData.get('existingAttachments')?.toString();
      
      // Parse existing attachments if provided
      let existingAttachments = [];
      if (existingAttachmentsJson) {
        try {
          existingAttachments = JSON.parse(existingAttachmentsJson);
        } catch (error) {
          console.error('Error parsing existing attachments:', error);
        }
      }
      
      // Process new file uploads
      const newAttachments = [];
      const attachmentFiles = formData.getAll('attachments');
      
      for (const file of attachmentFiles) {
        if (file && file.size > 0) {
          const savedFile = await saveUploadedFile(file);
          if (savedFile) {
            newAttachments.push(savedFile);
          }
        }
      }
      
      // Combine existing and new attachments
      const allAttachments = [...existingAttachments, ...newAttachments];
      
      // Validate attachment size
      if (allAttachments.length > 0) {
        validateAttachmentSize(allAttachments);
      }
      
      // Build update data
      const updateData = {};
      
      if (title !== undefined) updateData.title = title;
      if (subject !== undefined) updateData.subject = subject;
      if (content !== undefined) {
        // Validate content length
        const MAX_CONTENT_LENGTH = 65535;
        if (content.length > MAX_CONTENT_LENGTH) {
          return NextResponse.json({ 
            success: false, 
            error: `Content is too long. Maximum ${MAX_CONTENT_LENGTH} characters allowed.`,
            currentLength: content.length
          }, { status: 400 });
        }
        updateData.content = content;
      }
      if (recipients !== undefined) {
        // Validate recipients
        const emailList = recipients.split(",").map(r => r.trim()).filter(r => r.length > 0);
        if (emailList.length === 0) {
          return NextResponse.json({ 
            success: false, 
            error: "At least one valid email address is required" 
          }, { status: 400 });
        }
        
        const { validEmails, invalidEmails } = validateEmailList(emailList);
        if (invalidEmails.length > 0) {
          return NextResponse.json({ 
            success: false, 
            error: "Invalid email addresses detected",
            invalidEmails 
          }, { status: 400 });
        }
        
        const uniqueEmails = [...new Set(validEmails)];
        updateData.recipients = uniqueEmails.join(', ');
      }
      if (recipientType !== undefined) updateData.recipientType = recipientType;
      if (status !== undefined) updateData.status = status;
      
      // Optimize and add attachments
      if (allAttachments.length > 0) {
        const optimizedAttachments = allAttachments.map(attachment => ({
          filename: attachment.filename,
          originalName: attachment.originalName,
          fileType: attachment.fileType,
          fileSize: attachment.fileSize,
          uploadedAt: attachment.uploadedAt
        }));
        updateData.attachments = JSON.stringify(optimizedAttachments);
      } else {
        updateData.attachments = null;
      }
      
      // Update campaign in database
      const updatedCampaign = await prisma.emailCampaign.update({
        where: { id },
        data: updateData,
      });
      
      // Send emails if status changed to published
      let emailResults = null;
      if (status === 'published' && updateData.recipients) {
        try {
          emailResults = await sendModernEmails(updatedCampaign);
        } catch (emailError) {
          console.error(`Email sending failed:`, emailError);
          emailResults = {
            error: emailError.message,
            summary: {
              successful: 0,
              failed: updatedCampaign.recipients.split(',').length
            }
          };
        }
      }
      
      const response = {
        success: true,
        campaign: updatedCampaign,
        emailResults,
        message: status === 'published' 
          ? `Campaign updated and ${emailResults?.summary?.successful || 0} emails sent successfully`
          : 'Campaign updated successfully'
      };
      
      return NextResponse.json(response);
      
    } else {
      // Handle JSON update
      const data = await req.json();
      const { id: bodyId, ...updateData } = data;
      
      const campaignId = id || bodyId;
      
      if (!campaignId) {
        return NextResponse.json({ 
          success: false, 
          error: "Campaign ID is required" 
        }, { status: 400 });
      }
      
      // Validate content length if provided
      if (updateData.content && updateData.content.length > 65535) {
        return NextResponse.json({ 
          success: false, 
          error: "Content is too long. Maximum 65535 characters allowed." 
        }, { status: 400 });
      }
      
      // Validate recipients if provided
      if (updateData.recipients) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailList = updateData.recipients.split(",").map(r => r.trim()).filter(r => r.length > 0);
        
        if (emailList.length === 0) {
          return NextResponse.json({ 
            success: false, 
            error: "At least one valid email address is required" 
          }, { status: 400 });
        }
        
        const invalidEmails = emailList.filter(email => !emailRegex.test(email));
        
        if (invalidEmails.length > 0) {
          return NextResponse.json({ 
            success: false, 
            error: "Invalid email addresses detected",
            invalidEmails 
          }, { status: 400 });
        }
        
        // Deduplicate emails
        const uniqueEmails = [...new Set(emailList)];
        updateData.recipients = uniqueEmails.join(', ');
      }
      
      // Update campaign
      const updatedCampaign = await prisma.emailCampaign.update({
        where: { id: campaignId },
        data: updateData,
      });
      
      const response = {
        success: true,
        campaign: updatedCampaign,
        message: 'Campaign updated successfully'
      };
      
      return NextResponse.json(response);
    }
    
  } catch (error) {
    console.error(`PUT Error:`, error);
    
    let statusCode = 500;
    let errorMessage = error.message || "Failed to update campaign";
    
    if (error.code === 'P2000') {
      statusCode = 400;
      errorMessage = "Data too long for database column. Please shorten your content.";
    } else if (error.code === 'P2025') {
      statusCode = 404;
      errorMessage = "Campaign not found";
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: statusCode });
  }
}

// 🔹 DELETE - Delete a campaign
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    // First, get the campaign to check for attachments
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      select: { attachments: true }
    });
    
    // Delete physical attachment files if they exist
    if (campaign?.attachments) {
      try {
        const attachments = JSON.parse(campaign.attachments);
        for (const attachment of attachments) {
          const filePath = path.join(ATTACHMENTS_DIR, attachment.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (error) {
        console.error('Error deleting attachment files:', error);
      }
    }
    
    // Delete campaign from database
    await prisma.emailCampaign.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Campaign deleted successfully' 
    });
    
  } catch (error) {
    console.error(`DELETE Error:`, error);
    
    let statusCode = 500;
    let errorMessage = error.message || "Failed to delete campaign";
    
    if (error.code === 'P2025') {
      statusCode = 404;
      errorMessage = "Campaign not found";
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: statusCode });
  }
}