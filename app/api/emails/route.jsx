import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import nodemailer from "nodemailer";

// ====================================================================
// CONFIGURATION
// ====================================================================
const isProduction = process.env.NODE_ENV === 'production';

// Email transporter configuration - REMOVED ALL DEBUGGING
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 3, // Reduced connections for better stability
  maxMessages: 50,
  rateDelta: 2000, // Send 1 email every 2 seconds
  rateLimit: 5, // 5 emails per rateDelta (2000ms)
});

// School Information
const SCHOOL_NAME = process.env.SCHOOL_NAME || 'Nyaribu Secondary School';
const SCHOOL_LOCATION = process.env.SCHOOL_LOCATION || 'Kiganjo, Nyeri County';
const SCHOOL_MOTTO = process.env.SCHOOL_MOTTO || 'Soaring for Excellence';
const CONTACT_PHONE = process.env.CONTACT_PHONE || '+254720123456';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'admissions@nyaribusecondary.sc.ke';
const SCHOOL_WEBSITE = process.env.SCHOOL_WEBSITE || 'https://nyaribusecondary.sc.ke';

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
  campaignTitle = '',
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>${subject} | ${SCHOOL_NAME}</title>
      <style>
        /* MOBILE-FIRST RESPONSIVE STYLES */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
          line-height: 1.5;
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
          line-height: 1.3;
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
        
        /* CAMPAIGN INFO */
        .campaign-info {
          background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%);
          padding: 25px 20px;
          margin: 20px 0;
          border-radius: 10px;
          text-align: center;
        }
        
        .campaign-title {
          color: #1e3c72;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 10px 0;
        }
        
        .recipient-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 13px;
          margin: 10px 0;
        }
        
        /* MESSAGE CONTENT */
        .message-content {
          background: #ffffff;
          padding: 25px;
          border-radius: 8px;
          margin: 25px 0;
          border: 1px solid #e5e7eb;
          font-size: 16px;
          line-height: 1.6;
          color: #4b5563;
        }
        
        .message-content p {
          margin: 0 0 18px 0;
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
          
          .campaign-info {
            padding: 22px 18px;
          }
          
          .message-content {
            padding: 20px;
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
          <h2>${subject}</h2>
          <h2>${SCHOOL_NAME}</h2>
        </div>
        
        <div class="content">
          <div class="message-content">
            ${safeContent}
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid #e9ecef;">
            <p style="font-size: 17px; color: #1e3c72; font-weight: 600; margin-bottom: 12px;">
              Best Regards,
            </p>
            <p style="font-size: 15px; color: #333; margin: 0;">
              <strong>${senderName}</strong><br>
              ${SCHOOL_NAME} Administration
            </p>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              <strong>Contact Information:</strong><br>
              Phone: ${CONTACT_PHONE} | Email: ${CONTACT_EMAIL}<br>
              Website: ${SCHOOL_WEBSITE}
            </p>
          </div>
        </div>
        
        <div style="background: #1a1a2e; color: #b0b0b0; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #ffffff;">${SCHOOL_NAME}</p>
          <p style="margin: 0 0 8px 0;">${SCHOOL_LOCATION}</p>
          <p style="margin: 0 0 8px 0; font-style: italic;">"${SCHOOL_MOTTO}"</p>
          <p style="margin: 20px 0 0 0; padding-top: 15px; border-top: 1px solid #374151;">
            © ${currentYear} ${SCHOOL_NAME}. All rights reserved.<br>
            This is an official school communication.
          </p>
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
  
  // Optimized sequential processing to avoid Gmail timeouts
  // Using sequential instead of parallel to avoid "Timeout - closing connection" errors
  for (const recipient of recipients) {
    try {
      const htmlContent = getModernEmailTemplate({
        subject: campaign.subject,
        content: campaign.content,
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
// API HANDLERS - MAIN ROUTE
// ====================================================================

// 🔹 POST - Create a new campaign
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