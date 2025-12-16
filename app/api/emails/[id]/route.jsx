import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
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
  maxConnections: 3, // Reduced for better stability
  maxMessages: 50,
  rateDelta: 2000, // Send 1 email every 2 seconds
  rateLimit: 5, // 5 emails per rateDelta (2000ms)
});

// School Information
const SCHOOL_NAME = process.env.SCHOOL_NAME || 'Nyaribu Secondary School';

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
        <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: #ffffff; padding: 30px 20px; text-align: center;">
          <h1 style="font-size: 24px; font-weight: 700; line-height: 1.3; margin: 0 0 8px 0;">📧 ${subject}</h1>
          <h2 style="font-size: 16px; font-weight: 400; opacity: 0.9; margin: 0;">${SCHOOL_NAME}</h2>
        </div>
        
        <div style="padding: 30px 20px;">
          <div style="background: linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%); padding: 25px 20px; margin: 20px 0; border-radius: 10px; text-align: center;">
            <h3 style="color: #1e3c72; font-size: 20px; font-weight: 600; margin: 0 0 10px 0;">${campaignTitle || 'School Communication'}</h3>
            <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 20px; border-radius: 50px; font-weight: 600; font-size: 13px; margin: 10px 0;">${recipientTypeLabel}</div>
            <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px;">
              Official Communication from ${SCHOOL_NAME} Administration
            </p>
          </div>
          
          <div style="background: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb; font-size: 16px; line-height: 1.6; color: #4b5563;">
            ${safeContent}
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

  // Sequential processing to avoid Gmail timeouts
  for (const recipient of recipients) {
    try {
      const templateData = {
        subject: campaign.subject,
        content: campaign.content,
        senderName: 'School Administration',
        campaignTitle: campaign.title,
        recipientType: recipientType
      };

      const htmlContent = getModernEmailTemplate(templateData);

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
    
    const recipientCount = campaign.recipients.split(',').length;
    const recipientType = campaign.recipientType || 'all';
    
    const responseData = {
      id: campaign.id,
      title: campaign.title,
      subject: campaign.subject,
      content: campaign.content, // Return full content for single view
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

// 🔹 PUT - Update a campaign
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    const { title, subject, content, recipients, status, recipientType } = await req.json();
    
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
    
    // Validate content length if provided
    if (content && content.length > 65535) {
      return NextResponse.json({ 
        success: false, 
        error: "Content is too long. Maximum 65535 characters allowed.",
        currentLength: content.length
      }, { status: 400 });
    }
    
    // Validate recipients format if provided
    if (recipients) {
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
    }
    
    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subject !== undefined) updateData.subject = subject;
    if (content !== undefined) updateData.content = content;
    if (recipients !== undefined) updateData.recipients = recipients;
    if (status !== undefined) updateData.status = status;
    if (recipientType !== undefined) updateData.recipientType = recipientType;
    updateData.updatedAt = new Date();
    
    const campaign = await prisma.emailCampaign.update({
      where: { id },
      data: updateData,
    });
    
    // If updating status to published and hasn't been sent before, send emails
    let emailResults = null;
    if (status === 'published' && !existingCampaign.sentAt) {
      emailResults = await sendModernEmails(campaign);
    }
    
    const emailList = campaign.recipients.split(",").map(r => r.trim());
    const uniqueEmails = [...new Set(emailList)];
    
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
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    };
    
    return NextResponse.json({ 
      success: true, 
      campaign: responseData,
      emailResults,
      message: "Campaign updated successfully" + (emailResults ? ` and sent to ${emailResults.summary.successful} recipients` : '')
    });
    
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
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to update campaign"
    }, { status: 500 });
  }
}

// 🔹 DELETE - Delete a campaign
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
    
    await prisma.emailCampaign.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Campaign deleted successfully",
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

// 🔹 PATCH - Update campaign status (send emails)
export async function PATCH(req, { params }) {
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
      
      const emailResults = await sendModernEmails(campaign);
      
      const updatedCampaign = await prisma.emailCampaign.findUnique({
        where: { id },
      });
      
      const recipientCount = updatedCampaign.recipients.split(',').length;
      
      return NextResponse.json({ 
        success: true, 
        campaign: {
          id: updatedCampaign.id,
          title: updatedCampaign.title,
          subject: updatedCampaign.subject,
          status: updatedCampaign.status,
          sentAt: updatedCampaign.sentAt,
          sentCount: updatedCampaign.sentCount,
          failedCount: updatedCampaign.failedCount,
          recipientCount,
          successRate: updatedCampaign.sentCount && recipientCount > 0 
            ? Math.round((updatedCampaign.sentCount / recipientCount) * 100)
            : 0
        },
        emailResults,
        message: `Campaign sent successfully to ${emailResults.summary.successful} recipients`
      });
      
    } else if (status === 'draft') {
      await prisma.emailCampaign.update({
        where: { id },
        data: { 
          status: 'draft',
          updatedAt: new Date()
        },
      });
      
      return NextResponse.json({ 
        success: true, 
        message: "Campaign moved to draft"
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