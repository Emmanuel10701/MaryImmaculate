import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import nodemailer from "nodemailer";

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
const SCHOOL_NAME = process.env.SCHOOL_NAME || 'Nyaribu Secondary School';
const SCHOOL_LOCATION = process.env.SCHOOL_LOCATION || 'Kiganjo, Nyeri County';
const SCHOOL_MOTTO = process.env.SCHOOL_MOTTO || 'Soaring for Excellence';
const CONTACT_PHONE = process.env.CONTACT_PHONE || '+254720123456';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'admissions@nyaribusecondary.sc.ke';
const SCHOOL_WEBSITE = process.env.SCHOOL_WEBSITE || 'https://nyaribusecondary.sc.ke';

// Social Media Configuration
const SOCIAL_MEDIA = {
  facebook: {
    url: process.env.SCHOOL_FACEBOOK || 'https://facebook.com/nyaribusecondary',
    color: '#1877F2',
  },
  instagram: {
    url: process.env.SCHOOL_INSTAGRAM || 'https://instagram.com/nyaribusecondary',
    color: '#E4405F',
  },
  youtube: {
    url: process.env.SCHOOL_YOUTUBE || 'https://youtube.com/c/nyaribusecondary',
    color: '#FF0000',
  },
  tiktok: {
    url: process.env.SCHOOL_TIKTOK || 'https://tiktok.com/@nyaribusecondary',
    color: '#000000',
  },
  linkedin: {
    url: process.env.SCHOOL_LINKEDIN || 'https://linkedin.com/school/nyaribu-secondary',
    color: '#0A66C2',
  },
  twitter: {
    url: process.env.SCHOOL_TWITTER || 'https://twitter.com/nyaribusecondary',
    color: '#1DA1F2',
  }
};

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
  const safeContent = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '');
  
  return safeContent.replace(/\n/g, '<br>');
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
        
        /* SOCIAL ICONS - FIXED SIZE & VISIBILITY */
        .social-icons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 25px 0;
          flex-wrap: wrap;
        }
        
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50%;
          text-decoration: none;
          transition: transform 0.2s ease;
          box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15);
        }
        
        .social-icon:hover {
          transform: translateY(-2px);
        }
        
        .social-icon svg {
          width: 20px !important;
          height: 20px !important;
          fill: currentColor;
        }
        
        /* FACEBOOK */
        .social-facebook {
          background: #1877F2 !important;
          color: white !important;
        }
        
        /* INSTAGRAM */
        .social-instagram {
          background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D) !important;
          color: white !important;
        }
        
        /* YOUTUBE */
        .social-youtube {
          background: #FF0000 !important;
          color: white !important;
        }
        
        /* TIKTOK */
        .social-tiktok {
          background: #000000 !important;
          color: white !important;
        }
        
        /* LINKEDIN */
        .social-linkedin {
          background: #0A66C2 !important;
          color: white !important;
        }
        
        /* TWITTER */
        .social-twitter {
          background: #1DA1F2 !important;
          color: white !important;
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
            font-size: 15px !important;
            line-height: 1.6;
          }
          
          .message-card p {
            font-size: 15px !important;
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
          
          .social-icon {
            width: 36px !important;
            height: 36px !important;
          }
          
          .social-icon svg {
            width: 18px !important;
            height: 18px !important;
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
          
          .social-icons {
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
          
          <!-- Social Media Icons - FIXED -->
          <div class="social-icons">
            <a href="${SOCIAL_MEDIA.facebook.url}" target="_blank" class="social-icon social-facebook" title="Follow us on Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            <a href="${SOCIAL_MEDIA.instagram.url}" target="_blank" class="social-icon social-instagram" title="Follow us on Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
              </svg>
            </a>
            
            <a href="${SOCIAL_MEDIA.youtube.url}" target="_blank" class="social-icon social-youtube" title="Subscribe on YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816z"/>
              </svg>
            </a>
            
            <a href="${SOCIAL_MEDIA.tiktok.url}" target="_blank" class="social-icon social-tiktok" title="Follow us on TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            
            <a href="${SOCIAL_MEDIA.linkedin.url}" target="_blank" class="social-icon social-linkedin" title="Connect on LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            <a href="${SOCIAL_MEDIA.twitter.url}" target="_blank" class="social-icon social-twitter" title="Follow us on Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.99 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
          
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

async function sendModernEmails(campaign) {
  const startTime = Date.now();
  
  const recipients = campaign.recipients.split(",").map(r => r.trim());
  const recipientType = campaign.recipientType || 'all';
  
  const sentRecipients = [];
  const failedRecipients = [];
  
  // Optimized sequential processing
  for (const recipient of recipients) {
    try {
      const htmlContent = getModernEmailTemplate({
        subject: campaign.subject,
        content: campaign.content,
        senderName: 'School Administration',
        recipientType: recipientType
      });

      const mailOptions = {
        from: `"${SCHOOL_NAME} Administration" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: `${campaign.subject} • ${SCHOOL_NAME}`,
        html: htmlContent,
        text: campaign.content.replace(/<[^>]*>/g, ''),
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

// ====================================================================
// API HANDLERS
// ====================================================================

// 🔹 POST - Create a new email campaign
export async function POST(req) {
  let campaign = null;
  
  try {
    const { title, subject, content, recipients, status = "draft", recipientType = "all" } = await req.json();

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

  } catch (error) {
    console.error(`POST Error:`, error);
    
    let statusCode = 500;
    let errorMessage = error.message || "Failed to create campaign";
    
    if (error.code === 'P2000') {
      statusCode = 400;
      errorMessage = "Data too long for database column. Please shorten your content.";
    } else if (error.code === 'P2002') {
      statusCode = 409;
      errorMessage = "A campaign with similar data already exists";
    } else if (error.code === 'P2021' || error.code === 'P1001') {
      errorMessage = "Database connection error. Please try again later.";
    }

    return NextResponse.json({ 
      success: false, 
      error: errorMessage
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
          createdAt: true,
          updatedAt: true,
        }
      })
    ]);
    
    // Format response
    const formattedCampaigns = campaigns.map(campaign => {
      const recipientCount = campaign.recipients.split(',').length;
      const recipientType = campaign.recipientType || 'all';
      
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