import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager
class DeviceTokenManager {
  static validateTokensFromHeaders(headers) {
    try {
      // Extract tokens from headers
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      // Validate admin token format (basic check)
      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      // Validate device token
      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ''}`
        };
      }

      // Parse admin token payload
      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        // Check expiration
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        // Check user role - only authorized users can send campaigns
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'TEACHER', 'MARKETING', 'COMMUNICATION'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to send email campaigns' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Email campaign authentication successful for user:', adminPayload.name || 'Unknown');
      
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

  // Validate device token
  static validateDeviceToken(token) {
    try {
      // Handle base64 decoding safely
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      // Check expiration
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
      // Check age (30 days max)
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

// Authentication middleware for campaign requests
const authenticateCampaignRequest = (req) => {
  const headers = req.headers;
  
  // Validate tokens
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: "Authentication required to send email campaigns.",
          details: validationResult.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validationResult.user,
    deviceInfo: validationResult.deviceInfo
  };
};

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const SCHOOL_NAME = 'Mary  Immculate Girls High  School';
const SCHOOL_LOCATION = 'Mweiga, Nyeri  County';
const SCHOOL_MOTTO = 'Prayer, Discipline and Hardwork ';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'admissions@maryimmaculategirls.sc.ke';




// Format date function
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

// Extract dynamic data from template data
const extractAgendaData = (templateData, agendaData) => {
  const result = {
    admissionDetails: null,
    announcementDetails: null,
    eventDetails: null
  };

  if (templateData.selectedAdmissionDate && agendaData.admissionDates) {
    result.admissionDetails = agendaData.admissionDates.find(
      ad => ad.id === templateData.selectedAdmissionDate
    );
  }

  if (templateData.selectedAnnouncement && agendaData.announcements) {
    result.announcementDetails = agendaData.announcements.find(
      ann => ann.id === templateData.selectedAnnouncement
    );
  }

  if (templateData.selectedEvent && agendaData.schoolEvents) {
    result.eventDetails = agendaData.schoolEvents.find(
      ev => ev.id === templateData.selectedEvent
    );
  }

  return result;
};

// Email templates with dynamic data from React component
const emailTemplates = {
  admission: (data, customMessage = '', agendaData = {}) => {
    const { admissionDetails, eventDetails, announcementDetails } = extractAgendaData(data, agendaData);
    const admission = admissionDetails || {};
    const event = eventDetails || {};
    const announcement = announcementDetails || {};

    return {
      subject: data.subject || `🎓 Admissions Now Open for ${data.schoolYear || '2025'} - ${SCHOOL_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
          <title>Admissions Open - ${SCHOOL_NAME}</title>
        </head>
        <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; line-height: 1.6; color: #333; -webkit-text-size-adjust: 100%;">
          <!-- Container -->
          <div style="max-width: 100%; width: 100%; min-width: 320px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); padding: 10% 5% 8%; text-align: center; color: white;">
              <h1 style="color: white; font-size: clamp(24px, 6vw, 32px); font-weight: 700; margin: 0 0 8px; line-height: 1.2;">🎓 Admissions Open</h1>
              <p style="color: rgba(255,255,255,0.95); font-size: clamp(14px, 4vw, 18px); margin: 0 0 4px; font-weight: 500;">${SCHOOL_NAME}</p>
              <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 0; font-weight: 400;">${SCHOOL_LOCATION}</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 8% 5%;">
              <h2 style="color: #1e293b; font-size: clamp(20px, 5vw, 28px); font-weight: 600; margin: 0 0 5%; line-height: 1.3;">Begin Your Educational Journey</h2>
              
              ${customMessage ? `
                <!-- Custom Message -->
                <div style="background: #fef3c7; border-radius: 12px; padding: 5%; margin: 0 0 5%; border-left: 4px solid #f59e0b;">
                  <h3 style="color: #92400e; font-size: clamp(16px, 4vw, 18px); font-weight: 600; margin: 0 0 3%;">Additional Message:</h3>
                  <p style="color: #78350f; font-size: clamp(14px, 3.5vw, 16px); line-height: 1.5; margin: 0;">${customMessage}</p>
                </div>
              ` : ''}
              
              <!-- Admissions Information -->
              <div style="background: #f8fafc; border-radius: 12px; padding: 5%; margin: 0 0 5%; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; font-size: clamp(18px, 4.5vw, 22px); font-weight: 600; margin: 0 0 4%;">📚 Admissions Information</h3>
                
                ${admission.title ? `
                  <p style="color: #1e40af; font-size: clamp(16px, 4vw, 20px); font-weight: 600; margin: 0 0 2%;">
                    ${admission.title}
                  </p>
                ` : ''}
                
                <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); line-height: 1.6; margin: 0 0 4%;">
                  We are thrilled to announce that admissions for the <strong>${data.schoolYear || admission.schoolYear || '2025'}</strong> 
                  academic year are now open! Join our community of excellence at our Public Mixed Day and Boarding School.
                </p>
                
                ${admission.deadline ? `
                  <p style="color: #059669; font-size: clamp(15px, 3.8vw, 17px); font-weight: 600; margin: 4% 0;">
                    📅 Application Deadline: ${formatDate(admission.deadline)}
                  </p>
                ` : data.deadline ? `
                  <p style="color: #059669; font-size: clamp(15px, 3.8vw, 17px); font-weight: 600; margin: 4% 0;">
                    📅 Application Deadline: ${data.deadline}
                  </p>
                ` : ''}
                
                ${admission.date ? `
                  <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); margin: 3% 0 0;">
                    📆 Admission Date: ${formatDate(admission.date)}
                  </p>
                ` : ''}
              </div>
              
              <!-- Quick Facts -->
              <div style="background: #f0f9ff; border-radius: 12px; padding: 5%; margin: 0 0 6%; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; font-size: clamp(18px, 4.5vw, 22px); font-weight: 600; margin: 0 0 4%;">Quick Facts:</h3>
                <ul style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); line-height: 1.6; margin: 0; padding-left: 5%;">
                  <li style="margin: 0 0 2%;">Private Girls Boarding School in Mweiga, Nyeri</li>
                  <li style="margin: 0 0 2%;">1200+ students community</li>
                  <li style="margin: 0 0 2%;">8-4-4 Curriculum System</li>
                  <li style="margin: 0;">Quality education for all</li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 8% 0;">
                <a href="/pages/admissions" 
                   style="display: inline-block; 
                          width: 100%; 
                          max-width: 280px; 
                          background: linear-gradient(135deg, #059669 0%, #047857 100%); 
                          color: white; 
                          padding: 16px 8px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          font-size: clamp(16px, 4vw, 18px); 
                          margin: 0 auto; 
                          text-align: center;
                          border: none;
                          cursor: pointer;">Apply Now →</a>
              </div>
              
              <!-- Contact Info -->
              <p style="color: #64748b; font-size: clamp(13px, 3.2vw, 15px); line-height: 1.6; margin: 6% 0 0; text-align: center;">
                For more information, contact our admissions office at <strong>${SCHOOL_PHONE}</strong> or email <strong>${SCHOOL_EMAIL}</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f1f5f9; padding: 8% 5%; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #1e293b; font-size: clamp(16px, 4vw, 20px); font-weight: 600; margin: 0 0 3%;">${SCHOOL_NAME}</p>
              <p style="color: #64748b; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 3%; font-style: italic;">${SCHOOL_MOTTO}</p>
              <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 13px); margin: 3% 0 0;">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  newsletter: (data, customMessage = '', agendaData = {}) => {
    const { admissionDetails, eventDetails, announcementDetails } = extractAgendaData(data, agendaData);
    
    return {
      subject: data.subject || `📰 ${data.month || new Date().toLocaleString('default', { month: 'long' })} Newsletter - ${SCHOOL_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
          <title>${data.month || 'Monthly'} Newsletter - ${SCHOOL_NAME}</title>
        </head>
        <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; line-height: 1.6; color: #333; -webkit-text-size-adjust: 100%;">
          <!-- Container -->
          <div style="max-width: 100%; width: 100%; min-width: 320px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); padding: 10% 5% 8%; text-align: center; color: white;">
              <h1 style="color: white; font-size: clamp(24px, 6vw, 32px); font-weight: 700; margin: 0 0 8px; line-height: 1.2;">📰 ${data.month || 'This Month'}'s Newsletter</h1>
              <p style="color: rgba(255,255,255,0.95); font-size: clamp(14px, 4vw, 18px); margin: 0 0 4px; font-weight: 500;">${SCHOOL_NAME}</p>
              <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 0; font-weight: 400;">${SCHOOL_LOCATION}</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 8% 5%;">
              <h2 style="color: #1e293b; font-size: clamp(20px, 5vw, 28px); font-weight: 600; margin: 0 0 5%; line-height: 1.3;">Monthly Updates & Announcements</h2>
              
              ${customMessage ? `
                <!-- Custom Message -->
                <p style="color: #475569; font-size: clamp(15px, 3.8vw, 17px); line-height: 1.6; margin: 0 0 6%; padding: 0 2%;">
                  ${customMessage}
                </p>
              ` : ''}
              
              ${announcementDetails ? `
                <!-- Announcement -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 5%; margin: 0 0 5%; border-left: 4px solid #f59e0b;">
                  <h3 style="color: #92400e; font-size: clamp(17px, 4.2vw, 20px); font-weight: 600; margin: 0 0 3%;">📢 ${announcementDetails.title || 'Important Announcement'}</h3>
                  ${announcementDetails.date ? `
                    <p style="color: #b45309; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 4%;">
                      Date: ${formatDate(announcementDetails.date)}
                    </p>
                  ` : ''}
                  ${announcementDetails.description ? `
                    <p style="color: #78350f; font-size: clamp(14px, 3.5vw, 16px); line-height: 1.6; margin: 0;">
                      ${announcementDetails.description}
                    </p>
                  ` : ''}
                </div>
              ` : ''}
              
              ${eventDetails ? `
                <!-- Event -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 5%; margin: 0 0 5%; border-left: 4px solid #10b981;">
                  <h3 style="color: #065f46; font-size: clamp(17px, 4.2vw, 20px); font-weight: 600; margin: 0 0 3%;">🎉 ${eventDetails.title || 'Upcoming Event'}</h3>
                  ${eventDetails.date ? `
                    <p style="color: #047857; font-size: clamp(14px, 3.5vw, 16px); margin: 2% 0;">
                      📅 Date: ${formatDate(eventDetails.date)}
                    </p>
                  ` : ''}
                  ${eventDetails.time ? `
                    <p style="color: #047857; font-size: clamp(14px, 3.5vw, 16px); margin: 2% 0;">
                      ⏰ Time: ${eventDetails.time}
                    </p>
                  ` : ''}
                  ${eventDetails.location ? `
                    <p style="color: #047857; font-size: clamp(14px, 3.5vw, 16px); margin: 2% 0 4%;">
                      📍 Location: ${eventDetails.location}
                    </p>
                  ` : ''}
                  ${eventDetails.description ? `
                    <p style="color: #065f46; font-size: clamp(14px, 3.5vw, 16px); line-height: 1.6; margin: 0;">
                      ${eventDetails.description}
                    </p>
                  ` : ''}
                </div>
              ` : ''}
              
              ${admissionDetails ? `
                <!-- Admission -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 5%; margin: 0 0 5%; border-left: 4px solid #3b82f6;">
                  <h3 style="color: #1e40af; font-size: clamp(17px, 4.2vw, 20px); font-weight: 600; margin: 0 0 3%;">🎓 ${admissionDetails.title || 'Admissions Update'}</h3>
                  ${admissionDetails.deadline ? `
                    <p style="color: #1d4ed8; font-size: clamp(14px, 3.5vw, 16px); margin: 2% 0 4%;">
                      📅 Deadline: ${formatDate(admissionDetails.deadline)}
                    </p>
                  ` : ''}
                  ${admissionDetails.description ? `
                    <p style="color: #1e3a8a; font-size: clamp(14px, 3.5vw, 16px); line-height: 1.6; margin: 0;">
                      ${admissionDetails.description}
                    </p>
                  ` : ''}
                </div>
              ` : ''}
              
              <!-- Stay Connected -->
              <div style="background: #f0f9ff; border-radius: 12px; padding: 5%; margin: 6% 0;">
                <h3 style="color: #1e40af; font-size: clamp(18px, 4.5vw, 22px); font-weight: 600; margin: 0 0 4%;">Stay Connected</h3>
                <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); line-height: 1.6; margin: 0;">
                  Follow us on social media for daily updates, photos, and more exciting news from our school community.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f1f5f9; padding: 8% 5%; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #1e293b; font-size: clamp(16px, 4vw, 20px); font-weight: 600; margin: 0 0 3%;">${SCHOOL_NAME}</p>
              <p style="color: #64748b; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 3%; font-style: italic;">${SCHOOL_MOTTO}</p>
              <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 13px); margin: 3% 0 0;">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  event: (data, customMessage = '', agendaData = {}) => {
    const { eventDetails } = extractAgendaData(data, agendaData);
    const event = eventDetails || {};
    
    return {
      subject: data.subject || `🎉 Event Invitation: ${data.eventName || event.title || 'School Event'} - ${SCHOOL_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
          <title>Event Invitation - ${SCHOOL_NAME}</title>
        </head>
        <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; line-height: 1.6; color: #333; -webkit-text-size-adjust: 100%;">
          <!-- Container -->
          <div style="max-width: 100%; width: 100%; min-width: 320px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 10% 5% 8%; text-align: center; color: white;">
              <h1 style="color: white; font-size: clamp(24px, 6vw, 32px); font-weight: 700; margin: 0 0 8px; line-height: 1.2;">🎉 You're Invited!</h1>
              <p style="color: rgba(255,255,255,0.95); font-size: clamp(14px, 4vw, 18px); margin: 0 0 4px; font-weight: 500;">${SCHOOL_NAME}</p>
              <p style="color: rgba(255,255,255,0.85); font-size: clamp(12px, 3vw, 14px); margin: 0; font-weight: 400;">${SCHOOL_LOCATION}</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 8% 5%;">
              <h2 style="color: #1e293b; font-size: clamp(20px, 5vw, 28px); font-weight: 600; margin: 0 0 5%; line-height: 1.3;">${data.eventName || event.title || 'Special School Event'}</h2>
              
              ${customMessage ? `
                <!-- Custom Message -->
                <p style="color: #475569; font-size: clamp(15px, 3.8vw, 17px); line-height: 1.6; margin: 0 0 6%;">
                  ${customMessage}
                </p>
              ` : ''}
              
              <!-- Event Details -->
              <div style="background: #f0fdf4; border-radius: 12px; padding: 5%; margin: 0 0 6%;">
                <h3 style="color: #065f46; font-size: clamp(18px, 4.5vw, 22px); font-weight: 600; margin: 0 0 5%;">Event Details</h3>
                
                <!-- Date -->
                <div style="margin: 0 0 4%;">
                  <p style="color: #065f46; font-size: clamp(15px, 3.8vw, 17px); font-weight: 600; margin: 0 0 2%;">📅 Date:</p>
                  <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); margin: 0;">${formatDate(event.date || data.date || 'To be announced')}</p>
                </div>
                
                ${(event.time || data.time) ? `
                  <!-- Time -->
                  <div style="margin: 0 0 4%;">
                    <p style="color: #065f46; font-size: clamp(15px, 3.8vw, 17px); font-weight: 600; margin: 0 0 2%;">⏰ Time:</p>
                    <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); margin: 0;">${event.time || data.time}</p>
                  </div>
                ` : ''}
                
                ${(event.location || data.location) ? `
                  <!-- Location -->
                  <div style="margin: 0 0 4%;">
                    <p style="color: #065f46; font-size: clamp(15px, 3.8vw, 17px); font-weight: 600; margin: 0 0 2%;">📍 Location:</p>
                    <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); margin: 0;">${event.location || data.location || SCHOOL_NAME}</p>
                  </div>
                ` : ''}
                
                ${event.description ? `
                  <!-- Description -->
                  <div style="margin: 4% 0 0;">
                    <p style="color: #065f46; font-size: clamp(15px, 3.8vw, 17px); font-weight: 600; margin: 0 0 2%;">📝 Description:</p>
                    <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); margin: 0; line-height: 1.6;">${event.description}</p>
                  </div>
                ` : ''}
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 8% 0;">
                <a href="/pages/events" 
                   style="display: inline-block; 
                          width: 100%; 
                          max-width: 280px; 
                          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); 
                          color: white; 
                          padding: 16px 8px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          font-size: clamp(16px, 4vw, 18px); 
                          margin: 0 auto; 
                          text-align: center;
                          border: none;
                          cursor: pointer;">View Event Details →</a>
              </div>
              
              <!-- Contact Info -->
              <p style="color: #64748b; font-size: clamp(13px, 3.2vw, 15px); line-height: 1.6; margin: 6% 0 0; text-align: center;">
                We look forward to seeing you at this exciting event! For any questions, please contact us at <strong>${SCHOOL_PHONE}</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f1f5f9; padding: 8% 5%; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #1e293b; font-size: clamp(16px, 4vw, 20px); font-weight: 600; margin: 0 0 3%;">${SCHOOL_NAME}</p>
              <p style="color: #64748b; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 3%; font-style: italic;">${SCHOOL_MOTTO}</p>
              <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 13px); margin: 3% 0 0;">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  custom: (data, customMessage = '', agendaData = {}) => {
    const { admissionDetails, eventDetails, announcementDetails } = extractAgendaData(data, agendaData);
    
    return {
      subject: data.subject || `📧 Message from ${SCHOOL_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
          <title>Message from ${SCHOOL_NAME}</title>
        </head>
        <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; line-height: 1.6; color: #333; -webkit-text-size-adjust: 100%;">
          <!-- Container -->
          <div style="max-width: 100%; width: 100%; min-width: 320px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4b5563 0%, #1f2937 100%); padding: 10% 5% 8%; text-align: center; color: white;">
              <h1 style="color: white; font-size: clamp(24px, 6vw, 32px); font-weight: 700; margin: 0 0 8px; line-height: 1.2;">📧 Message from ${SCHOOL_NAME}</h1>
              <p style="color: rgba(255,255,255,0.95); font-size: clamp(14px, 4vw, 18px); margin: 0 0 4px; font-weight: 500;">${SCHOOL_LOCATION}</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 8% 5%;">
              <h2 style="color: #1e293b; font-size: clamp(20px, 5vw, 28px); font-weight: 600; margin: 0 0 5%; line-height: 1.3;">${data.subject || 'Important Message'}</h2>
              
              <!-- Main Message -->
              <div style="background: #fef3c7; border-radius: 12px; padding: 5%; margin: 0 0 6%;">
                <p style="color: #92400e; font-size: clamp(15px, 3.8vw, 17px); line-height: 1.6; margin: 0;">
                  ${customMessage || 'This is an important message from the school administration.'}
                </p>
              </div>
              
              <!-- Related Information -->
              <div style="margin: 6% 0;">
                ${admissionDetails || eventDetails || announcementDetails ? `
                  <h3 style="color: #1e293b; font-size: clamp(18px, 4.5vw, 22px); font-weight: 600; margin: 0 0 4%;">📅 Related Information</h3>
                ` : ''}
                
                ${admissionDetails ? `
                  <!-- Admission Item -->
                  <div style="background: #f8fafc; border-radius: 8px; padding: 4%; margin: 0 0 4%; border-left: 4px solid #3b82f6;">
                    <h4 style="color: #1e40af; font-size: clamp(16px, 4vw, 18px); font-weight: 600; margin: 0 0 3%;">🎓 ${admissionDetails.title || 'Admissions'}</h4>
                    ${admissionDetails.deadline ? `
                      <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 2%;">Deadline: ${formatDate(admissionDetails.deadline)}</p>
                    ` : ''}
                    ${admissionDetails.description ? `
                      <p style="color: #64748b; font-size: clamp(14px, 3.5vw, 16px); margin: 0; line-height: 1.5;">${admissionDetails.description}</p>
                    ` : ''}
                  </div>
                ` : ''}
                
                ${eventDetails ? `
                  <!-- Event Item -->
                  <div style="background: #f8fafc; border-radius: 8px; padding: 4%; margin: 0 0 4%; border-left: 4px solid #10b981;">
                    <h4 style="color: #065f46; font-size: clamp(16px, 4vw, 18px); font-weight: 600; margin: 0 0 3%;">🎉 ${eventDetails.title || 'Event'}</h4>
                    ${eventDetails.date ? `
                      <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 2%;">Date: ${formatDate(eventDetails.date)}</p>
                    ` : ''}
                    ${eventDetails.time ? `
                      <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 2%;">Time: ${eventDetails.time}</p>
                    ` : ''}
                    ${eventDetails.description ? `
                      <p style="color: #64748b; font-size: clamp(14px, 3.5vw, 16px); margin: 0; line-height: 1.5;">${eventDetails.description}</p>
                    ` : ''}
                  </div>
                ` : ''}
                
                ${announcementDetails ? `
                  <!-- Announcement Item -->
                  <div style="background: #f8fafc; border-radius: 8px; padding: 4%; margin: 0 0 4%; border-left: 4px solid #f59e0b;">
                    <h4 style="color: #92400e; font-size: clamp(16px, 4vw, 18px); font-weight: 600; margin: 0 0 3%;">📢 ${announcementDetails.title || 'Announcement'}</h4>
                    ${announcementDetails.date ? `
                      <p style="color: #475569; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 2%;">Date: ${formatDate(announcementDetails.date)}</p>
                    ` : ''}
                    ${announcementDetails.description ? `
                      <p style="color: #64748b; font-size: clamp(14px, 3.5vw, 16px); margin: 0; line-height: 1.5;">${announcementDetails.description}</p>
                    ` : ''}
                  </div>
                ` : ''}
              </div>
              
              <!-- Closing Message -->
              <p style="color: #64748b; font-size: clamp(13px, 3.2vw, 15px); line-height: 1.6; margin: 6% 0 0; text-align: center;">
                Thank you for being part of our school community. For any questions, please contact us at <strong>${SCHOOL_PHONE}</strong> or <strong>${SCHOOL_EMAIL}</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f1f5f9; padding: 8% 5%; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #1e293b; font-size: clamp(16px, 4vw, 20px); font-weight: 600; margin: 0 0 3%;">${SCHOOL_NAME}</p>
              <p style="color: #64748b; font-size: clamp(14px, 3.5vw, 16px); margin: 0 0 3%; font-style: italic;">${SCHOOL_MOTTO}</p>
              <p style="color: #94a3b8; font-size: clamp(11px, 2.8vw, 13px); margin: 3% 0 0;">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
};

export async function POST(request) {
  try {
    // Step 1: Authenticate the request
    const auth = authenticateCampaignRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`📧 Email campaign request from: ${auth.user.name} (${auth.user.role})`);

    // Step 2: Parse request body (including agenda data)
    const body = await request.json();
    const { 
      subscribers, 
      template, 
      subject, 
      customMessage, 
      templateData,
      agendaData = {}  // Include agenda data from frontend
    } = body;

    // Step 3: Validate required fields
    if (!subscribers || !Array.isArray(subscribers) || subscribers.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'No subscribers provided',
        authenticated: true
      }, { status: 400 });
    }

    if (!subject || subject.trim() === '') {
      return NextResponse.json({ 
        success: false,
        error: 'Email subject is required',
        authenticated: true
      }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ 
        success: false,
        error: 'Email configuration missing',
        authenticated: true
      }, { status: 500 });
    }

    // Validate maximum number of recipients
    const MAX_RECIPIENTS = 1000;
    if (subscribers.length > MAX_RECIPIENTS) {
      return NextResponse.json({ 
        success: false,
        error: `Maximum ${MAX_RECIPIENTS} recipients allowed per campaign`,
        authenticated: true
      }, { status: 400 });
    }

    // Validate email addresses
    const validSubscribers = [];
    const invalidEmails = [];

    subscribers.forEach(subscriber => {
      const email = subscriber.email;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && emailRegex.test(email)) {
        validSubscribers.push(subscriber);
      } else {
        invalidEmails.push(email);
      }
    });

    if (validSubscribers.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'No valid email addresses found',
        invalidEmails,
        authenticated: true
      }, { status: 400 });
    }

    if (invalidEmails.length > 0) {
      console.warn(`⚠️ Found ${invalidEmails.length} invalid email addresses:`, invalidEmails);
    }

    // Step 4: Get email template with dynamic data
    const templateFunction = emailTemplates[template] || emailTemplates.admission;
    const emailContent = templateFunction(
      templateData || {}, 
      customMessage || '', 
      agendaData || {}
    );

    // Step 5: Send emails with rate limiting
    const BATCH_SIZE = 50;
    const results = [];
    const sentBy = auth.user.name;

    console.log(`📧 Sending ${template} campaign to ${validSubscribers.length} subscribers...`);

    for (let i = 0; i < validSubscribers.length; i += BATCH_SIZE) {
      const batch = validSubscribers.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (subscriber) => {
        try {
          await transporter.sendMail({
            from: `"${SCHOOL_NAME}" <${process.env.EMAIL_USER}>`,
            to: subscriber.email,
            subject: emailContent.subject,
            html: emailContent.html,
            headers: {
              'X-Campaign-Type': template,
              'X-Sent-By': sentBy,
              'X-School-Name': SCHOOL_NAME,
              'X-Template-Data': JSON.stringify(templateData)
            }
          });
          return { email: subscriber.email, status: 'sent', sentAt: new Date().toISOString() };
        } catch (error) {
          console.error(`❌ Failed to send to ${subscriber.email}:`, error.message);
          return { 
            email: subscriber.email, 
            status: 'failed', 
            error: error.message,
            sentAt: new Date().toISOString() 
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Log progress
      const sentCount = results.filter(r => r.status === 'sent').length;
      const failedCount = results.filter(r => r.status === 'failed').length;
      console.log(`📊 Progress: ${sentCount} sent, ${failedCount} failed`);

      // Add delay between batches
      if (i + BATCH_SIZE < validSubscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Step 6: Return results
    const sentCount = results.filter(r => r.status === 'sent').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    console.log(`✅ Campaign completed: ${sentCount} sent, ${failedCount} failed`);

    return NextResponse.json({
      success: true,
      message: `Campaign sent successfully`,
      details: {
        totalRecipients: validSubscribers.length,
        sent: sentCount,
        failed: failedCount,
        sentBy: auth.user.name,
        timestamp: new Date().toISOString(),
        template: template,
        subject: emailContent.subject,
        templateData: templateData
      },
      results,
      authenticated: true
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error sending campaign:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to send campaign',
      authenticated: true
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const auth = authenticateCampaignRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign API is active',
      authenticated: true,
      user: {
        name: auth.user.name,
        role: auth.user.role,
        permissions: ['send_campaigns']
      },
      availableTemplates: Object.keys(emailTemplates),
      schoolInfo: {
        name: SCHOOL_NAME,
        location: SCHOOL_LOCATION,
        motto: SCHOOL_MOTTO,
        email: SCHOOL_EMAIL,
        phone: SCHOOL_PHONE
      }
    });

  } catch (error) {
    console.error('❌ GET Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      authenticated: true
    }, { status: 500 });
  }
}