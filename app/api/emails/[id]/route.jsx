import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import nodemailer from "nodemailer";
import cloudinary from "../../../../libs/cloudinary";

// ==================== TOKEN VERIFICATION FOR PUT/DELETE/PATCH ====================
class DeviceTokenManager {
  static validateTokensFromHeaders(headers, options = {}) {
    try {
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ''}`
        };
      }

      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'TEACHER', 'HR_MANAGER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage email campaigns' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Email campaign management authentication successful for user:', adminPayload.name || 'Unknown');
      
      return { 
        valid: true, 
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole
        },
        deviceInfo: deviceValid.payload
      };

    } catch (error) {
      console.error('❌ Token validation error:', error);
      return { 
        valid: false, 
        reason: 'validation_error', 
        message: 'Authentication validation failed',
        error: error.message 
      };
    }
  }

  static validateDeviceToken(token) {
    try {
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
      const createdAt = new Date(payload.createdAt || payload.iat * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      if (createdAt < thirtyDaysAgo) {
        return { valid: false, reason: 'age_expired', payload, error: 'Device token is too old' };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, reason: 'invalid_format', error: error.message };
    }
  }
}

const authenticateRequest = (req) => {
  const headers = req.headers;
  
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: "Authentication required to manage email campaigns.",
          details: validationResult.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validationResult.user,
    deviceInfo: validationResult.devInfo
  };
};
// ==================== END TOKEN VERIFICATION ====================

// ====================================================================
// CONFIGURATION
// ====================================================================

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
const SCHOOL_NAME = process.env.SCHOOL_NAME || 'Mary  Immaculate Girls secondary school ';
const SCHOOL_LOCATION = process.env.SCHOOL_LOCATION || 'Mweiga, Nyeri County';
const SCHOOL_MOTTO = process.env.SCHOOL_MOTTO || 'Prayer, Displine and hardwork';
const CONTACT_PHONE = process.env.CONTACT_PHONE || '+254720123456';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'admissions@maryimmaculategirls.sc.ke';
const SCHOOL_WEBSITE = process.env.SCHOOL_WEBSITE || 'https://mary-immaculate.vercel.app';

// Social Media Configuration
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
  
  safeContent = safeContent.replace(/\n/g, '<br>');
  safeContent = safeContent.replace(/style\s*=\s*["'][^"']*font[^"']*["']/gi, '');

  return safeContent;
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
    'zip': '📦',
    'rar': '📦',
    'mp3': '🎵',
    'mp4': '🎬',
    'webp': '🖼️',
    'svg': '🖼️'
  };
  
  return icons[fileType?.toLowerCase()] || '📎';
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
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
    'mp4': 'video/mp4',
    'webp': 'image/webp',
    'svg': 'image/svg+xml'
  };
  
  return mimeTypes[fileType?.toLowerCase()] || 'application/octet-stream';
}

// FULL MOBILE-RESPONSIVE EMAIL TEMPLATE FUNCTION WITH INLINE STYLING
function getModernEmailTemplate({ 
  subject = '', 
  content = '',
  senderName = 'School Administration',
  recipientType = 'all',
  attachments = []
}) {
  const recipientTypeLabel = getRecipientTypeLabel(recipientType);
  const sanitizedContent = sanitizeContent(content);
  
  // Generate attachments HTML if there are attachments
  let attachmentsHTML = '';
  if (attachments && attachments.length > 0) {
    attachmentsHTML = `
      <div>
        <div>📎 Attachments (${attachments.length}):</div>
        <div>
          ${attachments.map(attachment => {
            const fileSize = formatFileSize(attachment.fileSize);
            return `
            <div>
              <a href="${attachment.url}" target="_blank">${attachment.originalName || attachment.filename}</a>
              <span> (${fileSize})</span>
            </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body>
    <div>
        <!-- Header -->
        <div>
            <h1>${SCHOOL_NAME}</h1>
            <p>${SCHOOL_MOTTO}</p>
            <div>${recipientTypeLabel}</div>
        </div>
        
        <!-- Subject -->
        <h2>${subject}</h2>
        
        <!-- Recipient Info -->
        <div>
            <div>For: ${recipientTypeLabel}</div>
            <div>Date: ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</div>
        </div>
        
        <!-- Message Content -->
        <div>
            ${sanitizedContent}
        </div>
        
        <!-- Attachments -->
        ${attachmentsHTML}
        
        <!-- Notice -->
        <div>
            Official communication from ${SCHOOL_NAME}. Do not reply to this email.
        </div>
    </div>
    
    <!-- Footer with Social Media -->
    <div style="background: #f8f9fa; padding: 20px; border-top: 1px solid #dee2e6; text-align: center;">
        <div style="margin-bottom: 15px;">
            <strong>${SCHOOL_NAME}</strong><br>
            ${SCHOOL_LOCATION}
        </div>
        
        <div style="margin-bottom: 15px;">
            Email: <a href="mailto:${CONTACT_EMAIL}" style="color: #0066cc;">${CONTACT_EMAIL}</a><br>
            Phone: <a href="tel:${CONTACT_PHONE}" style="color: #0066cc;">${CONTACT_PHONE}</a><br>
            Website: <a href="${SCHOOL_WEBSITE}" target="_blank" style="color: #0066cc;">${SCHOOL_WEBSITE}</a>
        </div>
        
        <!-- Social Media Section -->
        <div style="margin-bottom: 15px;">
            <div style="font-weight: bold; margin-bottom: 10px;">Follow Us</div>
            <div style="display: flex; justify-content: center; gap: 10px;">
                <a href="${SOCIAL_MEDIA.facebook.url}" target="_blank" style="color: #1877F2; text-decoration: none;">Facebook</a> |
                <a href="${SOCIAL_MEDIA.youtube.url}" target="_blank" style="color: #FF0000; text-decoration: none;">YouTube</a> |
                <a href="${SOCIAL_MEDIA.linkedin.url}" target="_blank" style="color: #0A66C2; text-decoration: none;">LinkedIn</a> |
                <a href="${SOCIAL_MEDIA.twitter.url}" target="_blank" style="color: #000000; text-decoration: none;">Twitter</a>
            </div>
        </div>
        
        <div style="font-size: 12px; color: #666;">
            Sent by: ${senderName}<br>
            ${SCHOOL_NAME} Administration<br>
            Confidential communication for authorized recipients only.
        </div>
    </div>
</body>
</html>`;
}

// 🔹 GET - Retrieve a specific campaign by ID (PUBLIC)
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    // Fetch campaign from database
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id }
    });
    
    if (!campaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    // Parse attachments
    let attachments = [];
    try {
      if (campaign.attachments) {
        attachments = JSON.parse(campaign.attachments);
      }
    } catch (error) {
      console.error('Error parsing attachments:', error);
    }
    
    const recipientCount = campaign.recipients ? campaign.recipients.split(',').length : 0;
    
    const responseData = {
      id: campaign.id,
      title: campaign.title,
      subject: campaign.subject,
      content: campaign.content,
      recipients: campaign.recipients,
      recipientCount,
      recipientType: campaign.recipientType,
      recipientTypeLabel: getRecipientTypeLabel(campaign.recipientType),
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
    
    return NextResponse.json({
      success: true,
      campaign: responseData
    });
    
  } catch (error) {
    console.error(`GET [id] Error:`, error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to retrieve campaign"
    }, { status: 500 });
  }
}

// 🔹 PUT - Update an existing campaign (PROTECTED)
export async function PUT(req, { params }) {
  try {
    // ==================== ADD AUTHENTICATION HERE ====================
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("✏️ PUT /api/email-campaigns/[id] - Updating campaign");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);
    // ==================== END AUTHENTICATION ====================

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    const data = await req.json();
    const { title, subject, content, recipients, status, recipientType, attachments } = data;
    
    // Check if campaign exists
    const existingCampaign = await prisma.emailCampaign.findUnique({
      where: { id }
    });
    
    if (!existingCampaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    // Build update data
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (subject !== undefined) updateData.subject = subject;
    if (content !== undefined) {
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
    if (attachments !== undefined) {
      updateData.attachments = attachments ? JSON.stringify(attachments) : null;
    }
    
  
    
    // Update campaign in database
    const updatedCampaign = await prisma.emailCampaign.update({
      where: { id },
      data: updateData,
    });
    
    // Send emails if status changed to published
    let emailResults = null;
    if (status === 'published' && existingCampaign.status !== 'published') {
      try {
        emailResults = await sendModernEmails(updatedCampaign);
        
        // Update campaign with email results
        await prisma.emailCampaign.update({
          where: { id },
          data: { 
            sentAt: new Date(),
            sentCount: emailResults.summary.successful,
            failedCount: emailResults.summary.failed
          },
        });
        
        // Refresh the updated campaign
        const refreshedCampaign = await prisma.emailCampaign.findUnique({
          where: { id }
        });
        
        updatedCampaign.sentAt = refreshedCampaign.sentAt;
        updatedCampaign.sentCount = refreshedCampaign.sentCount;
        updatedCampaign.failedCount = refreshedCampaign.failedCount;
        
      } catch (emailError) {
        console.error(`Email sending failed:`, emailError);
        emailResults = {
          error: emailError.message,
          summary: {
            successful: 0,
            failed: updatedCampaign.recipients ? updatedCampaign.recipients.split(',').length : 0
          }
        };
      }
    }
    
    // Parse attachments for response
    let responseAttachments = [];
    try {
      if (updatedCampaign.attachments) {
        responseAttachments = JSON.parse(updatedCampaign.attachments);
      }
    } catch (error) {
      console.error('Error parsing attachments:', error);
    }
    
    const recipientCount = updatedCampaign.recipients.split(',').length;
    
    const response = {
      success: true,
      campaign: {
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        subject: updatedCampaign.subject,
        content: updatedCampaign.content,
        recipients: updatedCampaign.recipients,
        recipientCount,
        recipientType: updatedCampaign.recipientType || 'all',
        recipientTypeLabel: getRecipientTypeLabel(updatedCampaign.recipientType || 'all'),
        status: updatedCampaign.status,
        sentAt: updatedCampaign.sentAt,
        sentCount: updatedCampaign.sentCount,
        failedCount: updatedCampaign.failedCount,
        attachments: responseAttachments,
        hasAttachments: responseAttachments.length > 0,
        createdAt: updatedCampaign.createdAt,
        updatedAt: updatedCampaign.updatedAt
      },
      emailResults,
      message: status === 'published' && existingCampaign.status !== 'published'
        ? `Campaign updated and ${emailResults?.summary?.successful || 0} emails sent successfully`
        : 'Campaign updated successfully'
    };
    
    return NextResponse.json(response);
    
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

// 🔹 DELETE - Delete a campaign (PROTECTED)
export async function DELETE(req, { params }) {
  try {
    // ==================== ADD AUTHENTICATION HERE ====================
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("🗑️ DELETE /api/email-campaigns/[id] - Deleting campaign");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);
    // ==================== END AUTHENTICATION ====================

    const { id } = await params;
    
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
    
    if (!campaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    // Delete campaign from database
    await prisma.emailCampaign.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Campaign deleted successfully',
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

// 🔹 PATCH - Partial update (e.g., update status only) (PROTECTED)
export async function PATCH(req, { params }) {
  try {
    // ==================== ADD AUTHENTICATION HERE ====================
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("📝 PATCH /api/email-campaigns/[id] - Partial update");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);
    // ==================== END AUTHENTICATION ====================

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign ID is required" 
      }, { status: 400 });
    }
    
    const data = await req.json();
    const { status, ...otherUpdates } = data;
    
    // Check if campaign exists
    const existingCampaign = await prisma.emailCampaign.findUnique({
      where: { id }
    });
    
    if (!existingCampaign) {
      return NextResponse.json({ 
        success: false, 
        error: "Campaign not found" 
      }, { status: 404 });
    }
    
    // Build update data
    const updateData = {};
    
    if (status !== undefined) {
      if (status === 'published' && existingCampaign.status !== 'published') {
        updateData.status = status;
      } else if (status !== 'published') {
        updateData.status = status;
      }
    }
    
    // Add any other partial updates
    Object.keys(otherUpdates).forEach(key => {
      if (otherUpdates[key] !== undefined) {
        updateData[key] = otherUpdates[key];
      }
    });
    

    
    // Update campaign
    const updatedCampaign = await prisma.emailCampaign.update({
      where: { id },
      data: updateData,
    });
    
    // Send emails if status changed to published
    let emailResults = null;
    if (status === 'published' && existingCampaign.status !== 'published') {
      try {
        emailResults = await sendModernEmails(updatedCampaign);
        
        // Update campaign with email results
        await prisma.emailCampaign.update({
          where: { id },
          data: { 
            sentAt: new Date(),
            sentCount: emailResults.summary.successful,
            failedCount: emailResults.summary.failed
          },
        });
        
        // Refresh the updated campaign
        const refreshedCampaign = await prisma.emailCampaign.findUnique({
          where: { id }
        });
        
        updatedCampaign.sentAt = refreshedCampaign.sentAt;
        updatedCampaign.sentCount = refreshedCampaign.sentCount;
        updatedCampaign.failedCount = refreshedCampaign.failedCount;
        
      } catch (emailError) {
        console.error(`Email sending failed:`, emailError);
        emailResults = {
          error: emailError.message,
          summary: {
            successful: 0,
            failed: updatedCampaign.recipients ? updatedCampaign.recipients.split(',').length : 0
          }
        };
      }
    }
    
    // Parse attachments for response
    let responseAttachments = [];
    try {
      if (updatedCampaign.attachments) {
        responseAttachments = JSON.parse(updatedCampaign.attachments);
      }
    } catch (error) {
      console.error('Error parsing attachments:', error);
    }
    
    const recipientCount = updatedCampaign.recipients.split(',').length;
    
    const response = {
      success: true,
      campaign: {
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        subject: updatedCampaign.subject,
        content: updatedCampaign.content,
        recipients: updatedCampaign.recipients,
        recipientCount,
        recipientType: updatedCampaign.recipientType || 'all',
        recipientTypeLabel: getRecipientTypeLabel(updatedCampaign.recipientType || 'all'),
        status: updatedCampaign.status,
        sentAt: updatedCampaign.sentAt,
        sentCount: updatedCampaign.sentCount,
        failedCount: updatedCampaign.failedCount,
        attachments: responseAttachments,
        hasAttachments: responseAttachments.length > 0,
        createdAt: updatedCampaign.createdAt,
        updatedAt: updatedCampaign.updatedAt
      },
      emailResults,
      message: status === 'published' && existingCampaign.status !== 'published'
        ? `Campaign sent to ${emailResults?.summary?.successful || 0} recipients successfully`
        : 'Campaign updated successfully'
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`PATCH Error:`, error);
    
    let statusCode = 500;
    let errorMessage = error.message || "Failed to update campaign";
    
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

// Helper function to send emails (missing from original code)
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
      attachmentsArray = Array.isArray(campaign.attachments) ? 
        campaign.attachments : 
        JSON.parse(campaign.attachments);
    }
  } catch (error) {
    console.error('Error parsing attachments:', error);
  }
  
  // Prepare email attachments for nodemailer
  const emailAttachments = attachmentsArray.map(attachment => {
    return {
      filename: attachment.originalName || attachment.filename,
      path: attachment.url,
      contentType: getContentType(attachment.fileType)
    };
  });

  // Optimized sequential processing
  for (const recipient of recipients) {
    try {
      // Generate email content
      const htmlContent = getModernEmailTemplate({
        subject: campaign.subject,
        content: campaign.content,
        senderName: 'School Administration',
        recipientType: recipientType,
        attachments: attachmentsArray
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

// Helper to validate email addresses (missing from original code)
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