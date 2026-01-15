import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
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
const SCHOOL_MOTTO = process.env.SCHOOL_MOTTO || 'Soaring for Excellence';
const CONTACT_PHONE = process.env.CONTACT_PHONE || '+254720123456';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'admissions@maryimmaculategirls.sc.ke';
const SCHOOL_WEBSITE = process.env.SCHOOL_WEBSITE || 'https://maryimmaculategirls.sc.ke';

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
  // Remove font-size styles and font tags
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
                ${attachment.filename}
                ${attachment.fileSize ? `<span class="attachment-size">(${formatFileSize(attachment.fileSize)})</span>` : ''}
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
  if (!bytes) return '';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      filename: attachment.filename,
      path: filePath,
      contentType: getContentType(attachment.fileType)
    };
  });

  // Optimized sequential processing to avoid Gmail timeouts
  for (const recipient of recipients) {
    try {
      // Generate email content with attachments
      const htmlContent = getModernEmailTemplate({
        subject: campaign.subject,
        content: campaign.content,
        attachments: campaign.attachments,
        senderName: 'School Administration',
        campaignTitle: campaign.title,
        recipientType: recipientType
      });

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

// ====================================================================
// API HANDLERS - INDIVIDUAL CAMPAIGN ROUTE
// ====================================================================

// 🔹 GET - Get single campaign by ID
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });
    
    if (!campaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    const emailList = campaign.recipients.split(",").map(r => r.trim()).filter(r => r.length > 0);
    const uniqueEmails = [...new Set(emailList)];
    
    // Parse attachments
    let attachments = [];
    try {
      if (campaign.attachments) {
        attachments = JSON.parse(campaign.attachments);
      }
    } catch (error) {
      console.error('Error parsing attachments:', error);
    }
    
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
      attachments: attachments,
      hasAttachments: attachments.length > 0,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
      successRate: campaign.sentCount && uniqueEmails.length > 0 
        ? Math.round((campaign.sentCount / uniqueEmails.length) * 100)
        : 0
    };
    
    const headers = isProduction ? {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      'CDN-Cache-Control': 'public, max-age=300',
    } : {};
    
    return NextResponse.json({ 
      success: true, 
      campaign: responseData 
    }, { headers });
    
  } catch (error) {
    console.error(`GET Error:`, error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to retrieve campaign"
    }, { status: 500 });
  }
}

// 🔹 PUT - Update a campaign with FormData support
export async function PUT(req, { params }) {
  let emailResults = null;
  
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    // Check if request is FormData (for file uploads)
    const contentType = req.headers.get('content-type') || '';
    
    let title, subject, content, recipients, status, recipientType, existingAttachmentsJson;
    let newAttachments = [];
    let attachmentsString = null;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData with file uploads
      const formData = await req.formData();
      
      // Extract text fields
      title = formData.get('title')?.toString() || '';
      subject = formData.get('subject')?.toString() || '';
      content = formData.get('content')?.toString() || '';
      recipients = formData.get('recipients')?.toString() || '';
      status = formData.get('status')?.toString() || 'draft';
      recipientType = formData.get('recipientType')?.toString() || 'all';
      existingAttachmentsJson = formData.get('existingAttachments')?.toString();
      
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
      attachmentsString = allAttachments.length > 0 ? JSON.stringify(allAttachments) : null;
      
    } else {
      // Handle JSON request (backwards compatibility)
      const data = await req.json();
      title = data.title;
      subject = data.subject;
      content = data.content;
      recipients = data.recipients;
      status = data.status || 'draft';
      recipientType = data.recipientType || 'all';
      attachmentsString = data.attachments || null;
    }
    
    // Check if campaign exists
    const existingCampaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });
    
    if (!existingCampaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
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
    
    // Build update data
    const updateData = {
      title: title.trim(),
      subject: subject.trim(),
      content: content,
      recipients: uniqueEmails.join(', '),
      recipientType: recipientType,
      status: status,
      ...(attachmentsString !== undefined && { attachments: attachmentsString }),
      updatedAt: new Date()
    };
    
    // Check if we're changing status from draft to published
    const isChangingToPublished = existingCampaign.status === 'draft' && status === 'published';
    
    // If changing to published, we need to send emails
    if (isChangingToPublished) {
      // First update the campaign with the new data
      const updatedCampaign = await prisma.emailCampaign.update({
        where: { id },
        data: updateData,
      });
      
      // Then send the emails
      try {
        emailResults = await sendModernEmails(updatedCampaign);
        
        // Fetch the updated campaign with email stats
        const finalCampaign = await prisma.emailCampaign.findUnique({
          where: { id },
        });
        
        // Parse attachments for response
        let campaignAttachments = [];
        try {
          if (finalCampaign.attachments) {
            campaignAttachments = JSON.parse(finalCampaign.attachments);
          }
        } catch (error) {
          console.error('Error parsing attachments:', error);
        }
        
        const responseData = {
          id: finalCampaign.id,
          title: finalCampaign.title,
          subject: finalCampaign.subject,
          content: finalCampaign.content,
          recipients: finalCampaign.recipients,
          recipientCount: uniqueEmails.length,
          recipientType: finalCampaign.recipientType || 'all',
          recipientTypeLabel: getRecipientTypeLabel(finalCampaign.recipientType || 'all'),
          status: finalCampaign.status,
          sentAt: finalCampaign.sentAt,
          sentCount: finalCampaign.sentCount,
          failedCount: finalCampaign.failedCount,
          attachments: campaignAttachments,
          hasAttachments: campaignAttachments.length > 0,
          createdAt: finalCampaign.createdAt,
          updatedAt: finalCampaign.updatedAt,
        };
        
        return NextResponse.json({ 
          success: true, 
          campaign: responseData,
          emailResults,
          message: `Campaign updated and sent to ${emailResults.summary.successful} recipients successfully`
        });
        
      } catch (emailError) {
        console.error(`Email sending failed:`, emailError);
        
        // If email sending fails, revert status to draft
        await prisma.emailCampaign.update({
          where: { id },
          data: { 
            status: 'draft',
            failedCount: uniqueEmails.length
          },
        });
        
        return NextResponse.json({ 
          success: false, 
          error: `Failed to send emails: ${emailError.message}`
        }, { status: 500 });
      }
    } else {
      // Regular update without email sending
      const campaign = await prisma.emailCampaign.update({
        where: { id },
        data: updateData,
      });
      
      // Parse attachments for response
      let campaignAttachments = [];
      try {
        if (campaign.attachments) {
          campaignAttachments = JSON.parse(campaign.attachments);
        }
      } catch (error) {
        console.error('Error parsing attachments:', error);
      }
      
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
        attachments: campaignAttachments,
        hasAttachments: campaignAttachments.length > 0,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      };
      
      return NextResponse.json({ 
        success: true, 
        campaign: responseData,
        message: "Campaign updated successfully" + (status === 'published' && existingCampaign.sentAt ? " (already sent)" : "")
      });
    }
    
  } catch (error) {
    console.error(`PUT Error:`, error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    } else if (error.code === 'P2000') {
      return NextResponse.json({ 
        success: false, 
        error: "Data too long for database column" 
      }, { status: 400 });
    } else if (error.code === 'P2002') {
      return NextResponse.json({ 
        success: false, 
        error: "A campaign with similar data already exists" 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to update campaign"
    }, { status: 500 });
  }
}

// 🔹 PATCH - Update campaign status only (for send/unsend operations)
export async function PATCH(req, { params }) {
  let emailResults = null;
  
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    const { status, forceResend = false } = await req.json();
    
    if (!status) {
      return NextResponse.json({ 
        success: false, 
        error: "Status is required" 
      }, { status: 400 });
    }
    
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });
    
    if (!campaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    if (status === 'published') {
      // Check if already sent and not forcing resend
      if (campaign.sentAt && !forceResend) {
        return NextResponse.json({ 
          success: false, 
          error: "Campaign has already been sent. Use forceResend=true to resend."
        }, { status: 400 });
      }
      
      // Send emails
      try {
        emailResults = await sendModernEmails(campaign);
        
        const updatedCampaign = await prisma.emailCampaign.findUnique({
          where: { id },
        });
        
        const emailList = updatedCampaign.recipients.split(",").map(r => r.trim()).filter(r => r.length > 0);
        const uniqueEmails = [...new Set(emailList)];
        
        // Parse attachments for response
        let campaignAttachments = [];
        try {
          if (updatedCampaign.attachments) {
            campaignAttachments = JSON.parse(updatedCampaign.attachments);
          }
        } catch (error) {
          console.error('Error parsing attachments:', error);
        }
        
        return NextResponse.json({ 
          success: true, 
          campaign: {
            id: updatedCampaign.id,
            title: updatedCampaign.title,
            subject: updatedCampaign.subject,
            content: updatedCampaign.content,
            recipients: updatedCampaign.recipients,
            recipientCount: uniqueEmails.length,
            recipientType: updatedCampaign.recipientType || 'all',
            recipientTypeLabel: getRecipientTypeLabel(updatedCampaign.recipientType || 'all'),
            status: updatedCampaign.status,
            sentAt: updatedCampaign.sentAt,
            sentCount: updatedCampaign.sentCount,
            failedCount: updatedCampaign.failedCount,
            attachments: campaignAttachments,
            hasAttachments: campaignAttachments.length > 0,
            successRate: updatedCampaign.sentCount && uniqueEmails.length > 0 
              ? Math.round((updatedCampaign.sentCount / uniqueEmails.length) * 100)
              : 0
          },
          emailResults,
          message: `Campaign sent successfully to ${emailResults.summary.successful} recipients`
        });
        
      } catch (emailError) {
        console.error(`Email sending failed:`, emailError);
        
        // Revert to draft if sending fails
        await prisma.emailCampaign.update({
          where: { id },
          data: { 
            status: 'draft',
            failedCount: campaign.recipients.split(',').length
          },
        });
        
        return NextResponse.json({ 
          success: false, 
          error: `Failed to send emails: ${emailError.message}`
        }, { status: 500 });
      }
      
    } else if (status === 'draft') {
      // Just update status to draft
      await prisma.emailCampaign.update({
        where: { id },
        data: { 
          status: 'draft',
          updatedAt: new Date()
        },
      });
      
      // Parse attachments for response
      let campaignAttachments = [];
      try {
        if (campaign.attachments) {
          campaignAttachments = JSON.parse(campaign.attachments);
        }
      } catch (error) {
        console.error('Error parsing attachments:', error);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: "Campaign moved to draft",
        campaign: {
          id: campaign.id,
          title: campaign.title,
          subject: campaign.subject,
          status: 'draft',
          attachments: campaignAttachments,
          hasAttachments: campaignAttachments.length > 0
        }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid status. Use 'published' or 'draft'." 
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error(`PATCH Error:`, error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to update campaign status"
    }, { status: 500 });
  }
}

// 🔹 DELETE - Delete a campaign and associated files
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    // Check if campaign exists
    const existingCampaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });
    
    if (!existingCampaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    // Delete associated files from attachments directory
    if (existingCampaign.attachments) {
      try {
        const attachments = JSON.parse(existingCampaign.attachments);
        attachments.forEach(attachment => {
          const filePath = path.join(ATTACHMENTS_DIR, attachment.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      } catch (error) {
        console.error('Error deleting attachment files:', error);
      }
    }
    
    await prisma.emailCampaign.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Campaign and associated files deleted successfully",
      deletedCampaign: {
        id: existingCampaign.id,
        title: existingCampaign.title,
        subject: existingCampaign.subject
      }
    });
    
  } catch (error) {
    console.error(`DELETE Error:`, error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to delete campaign"
    }, { status: 500 });
  }
}