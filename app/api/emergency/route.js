import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

const SCHOOL_NAME = 'Katwanyaa High School';
const SCHOOL_LOCATION = 'Matungulu, Machakos County';
const SCHOOL_MOTTO = 'Education is Light';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'info@katwanyaa highSchool.sc.ke';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
const COUNSELOR_EMAIL = process.env.COUNSELOR_EMAIL || 'guidance@school.edu';

// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

function validatePhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^(07|01|\+2547|\+2541)\d{8}$/;
  return regex.test(cleaned);
}

function generateEmergencyReference() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EMERG-${year}${month}${day}-${randomNum}`;
}

function getUrgencyColor(urgency) {
  switch(urgency) {
    case 'critical': return '#dc2626'; // red-600
    case 'high': return '#ea580c'; // orange-600
    case 'medium': return '#ca8a04'; // yellow-600
    case 'low': return '#16a34a'; // green-600
    default: return '#4b5563'; // gray-600
  }
}

function getUrgencyLabel(urgency) {
  switch(urgency) {
    case 'critical': return '🚨 CRITICAL EMERGENCY';
    case 'high': return '⚠️ HIGH PRIORITY';
    case 'medium': return '📋 MEDIUM PRIORITY';
    case 'low': return '📝 LOW PRIORITY';
    default: return '📋 STANDARD';
  }
}

// ====================================================================
// EMAIL TEMPLATES
// ====================================================================

async function sendEmergencyAlert(emergencyData, referenceNumber) {
  const urgencyColor = getUrgencyColor(emergencyData.urgency);
  const urgencyLabel = getUrgencyLabel(emergencyData.urgency);
  
  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} Emergency Alert System`,
      address: process.env.EMAIL_USER
    },
    to: ADMIN_EMAIL,
    cc: COUNSELOR_EMAIL,
    subject: `${urgencyLabel.split(' ')[0]} Emergency Alert: ${emergencyData.emergencyType} - ${referenceNumber}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Emergency Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
          .header { background-color: ${urgencyColor}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #ffffff; }
          .section { margin-bottom: 20px; padding: 15px; border-radius: 6px; }
          .emergency-info { background-color: #fef2f2; border-left: 4px solid ${urgencyColor}; }
          .student-info { background-color: #f0f9ff; border-left: 4px solid #0369a1; }
          .contact-info { background-color: #f0fdf4; border-left: 4px solid #16a34a; }
          .label { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
          .value { color: #1f2937; margin-bottom: 10px; }
          .urgent { background-color: #fef2f2; padding: 10px; border-radius: 6px; margin: 15px 0; }
          .footer { background-color: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">${urgencyLabel}</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${SCHOOL_NAME} Emergency Alert</p>
          </div>
          
          <div class="content">
            <!-- Emergency Summary -->
            <div class="section emergency-info">
              <h2 style="color: ${urgencyColor}; margin-top: 0;">🚨 Emergency Details</h2>
              <div class="label">Reference Number:</div>
              <div class="value" style="font-size: 18px; font-weight: bold;">${referenceNumber}</div>
              
              <div class="label">Emergency Type:</div>
              <div class="value" style="font-size: 16px; font-weight: bold;">${emergencyData.emergencyType}</div>
              
              <div class="label">Urgency Level:</div>
              <div class="value" style="color: ${urgencyColor}; font-weight: bold;">${urgencyLabel}</div>
              
              <div class="label">Time Submitted:</div>
              <div class="value">${new Date().toLocaleString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}</div>
            </div>
            
            <!-- Student Information -->
            <div class="section student-info">
              <h2 style="color: #0369a1; margin-top: 0;">👨‍🎓 Student Information</h2>
              <div class="label">Student Name:</div>
              <div class="value">${emergencyData.studentName || 'Not provided'}</div>
              
              <div class="label">Class:</div>
              <div class="value">Form ${emergencyData.studentForm || 'N/A'} ${emergencyData.studentStream || ''}</div>
              
              <div class="label">Student ID:</div>
              <div class="value">${emergencyData.studentId || 'Not provided'}</div>
            </div>
            
            <!-- Emergency Description -->
            <div class="section" style="background-color: #f8fafc;">
              <h2 style="color: #1f2937; margin-top: 0;">📝 Emergency Description</h2>
              <div style="background-color: white; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb;">
                ${emergencyData.description.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <!-- Contact Information -->
            <div class="section contact-info">
              <h2 style="color: #16a34a; margin-top: 0;">📞 Contact Information</h2>
              <div class="label">Contact Email:</div>
              <div class="value">${emergencyData.contactEmail}</div>
              
              <div class="label">Contact Phone:</div>
              <div class="value">${emergencyData.contactPhone || 'Not provided'}</div>
            </div>
            
            <!-- Action Required -->
            <div class="urgent">
              <h3 style="color: #dc2626; margin-top: 0;">⚠️ ACTION REQUIRED</h3>
              <p>Please respond to this emergency within <strong>1 hour</strong> for critical/high priority cases.</p>
              <p>Contact the student/parent immediately and log the response in the school emergency system.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${SCHOOL_NAME}</p>
            <p>${SCHOOL_LOCATION} | ${SCHOOL_MOTTO}</p>
            <p>Emergency Hotline: ${CONTACT_PHONE} | Email: ${CONTACT_EMAIL}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Emergency alert sent: ${referenceNumber}`);
    return true;
  } catch (error) {
    console.error('Failed to send emergency alert:', error);
    return false;
  }
}

async function sendStudentConfirmation(emergencyData, referenceNumber) {
  if (!emergencyData.contactEmail) return false;
  
  const mailOptions = {
    from: {
      name: `${SCHOOL_NAME} Guidance & Counseling`,
      address: process.env.EMAIL_USER
    },
    to: emergencyData.contactEmail,
    subject: `✅ Emergency Request Received - Reference: ${referenceNumber}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Emergency Request Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 25px; text-align: center; }
          .content { padding: 25px; background-color: #ffffff; }
          .reference-box { background-color: #f0f9ff; border: 2px solid #0369a1; padding: 15px; border-radius: 6px; margin: 15px 0; text-align: center; }
          .info-box { background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #10b981; }
          .action-box { background-color: #fff7ed; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f97316; }
          .contact-box { background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #dc2626; }
          .footer { background-color: #1e3c72; padding: 20px; text-align: center; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">✅ Emergency Request Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${SCHOOL_NAME} Guidance & Counseling Department</p>
          </div>
          
          <div class="content">
            <p>Dear ${emergencyData.studentName || 'Student'},</p>
            
            <p>We have received your emergency request and our team is already reviewing it.</p>
            
            <div class="reference-box">
              <h3 style="margin: 0 0 10px 0; color: #0369a1;">Your Reference Number</h3>
              <p style="font-size: 20px; font-weight: bold; color: #1e3c72; margin: 0;">${referenceNumber}</p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
                Please keep this number for future reference
              </p>
            </div>
            
            <div class="info-box">
              <h4 style="margin: 0 0 10px 0; color: #047857;">📋 Request Details</h4>
              <p><strong>Emergency Type:</strong> ${emergencyData.emergencyType}</p>
              <p><strong>Urgency Level:</strong> ${getUrgencyLabel(emergencyData.urgency)}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-US')}</p>
            </div>
            
            <div class="action-box">
              <h4 style="margin: 0 0 10px 0; color: #ea580c;">⏰ What Happens Next?</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Our guidance team will review your request within 1 hour</li>
                <li>You will be contacted via your provided contact information</li>
                <li>We will schedule an immediate appointment if needed</li>
                <li>Follow-up support will be provided based on your needs</li>
              </ul>
            </div>
            
            <div class="contact-box">
              <h4 style="margin: 0 0 10px 0; color: #dc2626;">🚨 Immediate Assistance Needed?</h4>
              <p>If this is a life-threatening emergency, please:</p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Call 999 (Emergency Services)</li>
                <li>Contact School Emergency: <strong>${CONTACT_PHONE}</strong></li>
                <li>Visit the nearest hospital</li>
              </ul>
            </div>
            
            <p>Thank you for reaching out. Your well-being is our priority.</p>
            
            <p>Best regards,<br>
            <strong>Guidance & Counseling Department</strong><br>
            ${SCHOOL_NAME}</p>
          </div>
          
          <div class="footer">
            <p style="margin: 0; font-size: 14px;">${SCHOOL_LOCATION} | ${SCHOOL_MOTTO}</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">
              Emergency Hotline: ${CONTACT_PHONE} | Email: ${CONTACT_EMAIL}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation sent to student: ${referenceNumber}`);
    return true;
  } catch (error) {
    console.error('Failed to send student confirmation:', error);
    return false;
  }
}

// ====================================================================
// DATABASE FUNCTIONS (Mock - replace with actual database in production)
// ====================================================================

async function logEmergencyToDatabase(emergencyData, referenceNumber) {
  // In production, replace this with actual database logic
  // For now, we'll log to console and potentially a file
  const logEntry = {
    referenceNumber,
    ...emergencyData,
    timestamp: new Date().toISOString(),
    status: 'pending',
    assignedTo: null,
    notes: []
  };
  
  
  // You could save to a JSON file or database here
  // Example: Save to a local JSON file (for development)
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const logFile = path.join(process.cwd(), 'emergency-logs.json');
      let logs = [];
      
      if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      }
      
      logs.push(logEntry);
      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.warn('Could not save to local log file:', error);
    }
  }
  
  return true;
}

// ====================================================================
// API HANDLERS
// ====================================================================

export async function POST(request) {
  try {
    // 1. Parse and validate request
    const emergencyData = await request.json();
    
    // Required fields validation
    const requiredFields = ['emergencyType', 'description', 'urgency', 'contactEmail'];
    const missingFields = requiredFields.filter(field => !emergencyData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emergencyData.contactEmail)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Please enter a valid email address",
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }
    
    // Phone validation (if provided)
    if (emergencyData.contactPhone && !validatePhone(emergencyData.contactPhone)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid phone format. Use 07XXXXXXXX, 01XXXXXXXX, or +2547XXXXXXXX",
          code: 'INVALID_PHONE'
        },
        { status: 400 }
      );
    }
    
    // 2. Generate reference number
    const referenceNumber = generateEmergencyReference();
    
    // 3. Prepare emergency record
    const emergencyRecord = {
      ...emergencyData,
      referenceNumber,
      submittedAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('remote-addr'),
      userAgent: request.headers.get('user-agent')
    };
    
    // 4. Check email configuration
    let emailSuccess = true;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        // Send alert to admin/counselor
        await sendEmergencyAlert(emergencyRecord, referenceNumber);
        
        // Send confirmation to student
        await sendStudentConfirmation(emergencyRecord, referenceNumber);
      } catch (emailError) {
        console.warn('Email sending failed:', emailError);
        emailSuccess = false;
        // Don't fail the request if email fails
      }
    } else {
      console.warn('Email credentials not configured. Skipping email notifications.');
      emailSuccess = false;
    }
    
    // 5. Log to database (mock)
    await logEmergencyToDatabase(emergencyRecord, referenceNumber);
    
    // 6. Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Emergency request submitted successfully. Our team will contact you shortly.',
        referenceNumber,
        emailSent: emailSuccess,
        data: {
          emergencyType: emergencyData.emergencyType,
          urgency: emergencyData.urgency,
          studentName: emergencyData.studentName,
          submittedAt: emergencyRecord.submittedAt
        },
        contactInfo: {
          school: SCHOOL_NAME,
          emergencyPhone: CONTACT_PHONE,
          email: CONTACT_EMAIL,
          responseTime: 'Within 1 hour for urgent cases'
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error processing emergency request:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit emergency request. Please try again or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        contact: {
          phone: CONTACT_PHONE,
          email: CONTACT_EMAIL
        }
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // GET handler for testing/verification
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');
    
    if (test === 'email') {
      // Test email configuration
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return NextResponse.json(
          {
            success: false,
            message: 'Email credentials not configured',
            required: ['EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL'],
            current: {
              EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
              ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'Not set'
            }
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        {
          success: true,
          message: 'Emergency API is working',
          emailConfigured: true,
          school: SCHOOL_NAME,
          contact: {
            phone: CONTACT_PHONE,
            email: CONTACT_EMAIL
          }
        },
        { status: 200 }
      );
    }
    
    // Return general API info
    return NextResponse.json(
      {
        success: true,
        message: 'Emergency API',
        description: 'Handles emergency appointment requests for students',
        endpoints: {
          POST: '/api/emergency - Submit emergency request',
          GET: '/api/emergency - API information'
        },
        school: SCHOOL_NAME,
        contact: {
          phone: CONTACT_PHONE,
          email: CONTACT_EMAIL
        },
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}