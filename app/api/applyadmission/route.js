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

const SCHOOL_NAME = 'Mary Immaculate Girls Secondary School';
const SCHOOL_LOCATION = 'Kiganjo, Nyeri County';
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
  return `NSS/${year}/${randomNum}`;
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
        <title>Application Confirmation</title>
        <style type="text/css">
          body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          .container { max-width: 600px; width: 100% !important; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
          @media screen and (max-width: 600px) { .padding-content { padding: 20px !important; } }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif;">
        <center style="width: 100%; background-color: #f4f7f6;">
          <div style="max-width: 600px; margin: 0 auto;" class="container">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td align="center" style="background-color: #1e3c72; color: white; padding: 40px 30px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: bold; line-height: 1.2;">
                    🏫 ${SCHOOL_NAME} Admissions
                  </h1>
                  <p style="margin: 10px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9);">
                    ${SCHOOL_LOCATION}
                  </p>
                </td>
              </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #ffffff;">
              <tr>
                <td style="padding: 40px 30px 20px 30px;" class="padding-content">
                  <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px;">
                    Dear Parent/Guardian,
                  </p>
                  <p style="margin: 0 0 25px 0; color: #333333; font-size: 16px;">
                    Thank you for submitting an application for <strong>${applicantName}</strong> to ${SCHOOL_NAME}. 
                    We have successfully received the admission application details.
                  </p>

                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 8px;">
                        <p style="margin: 0 0 10px 0; color: #1b5e20; font-size: 14px; font-weight: bold;">
                          Applicant Name:
                        </p>
                        <h2 style="margin: 0; color: #047857; font-size: 20px; font-weight: bold; line-height: 1.2;">
                          ${applicantName}
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f0f9ff; border: 1px solid #e0f2fe; padding: 20px; border-radius: 8px; margin-top: 15px;">
                        <p style="margin: 0 0 10px 0; color: #075985; font-size: 14px; font-weight: bold;">
                          Application Number:
                        </p>
                        <h2 style="margin: 0; color: #0369a1; font-size: 20px; font-weight: bold; line-height: 1.2;">
                          ${applicationNumber}
                        </h2>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 25px 0 25px 0; color: #333333; font-size: 16px;">
                    <strong>Important Information:</strong> Please keep your application number (<strong>${applicationNumber}</strong>) for future reference.
                    We will use the email address <strong>${toEmail}</strong> for all communications regarding the admission status.
                  </p>
                  
                  <div style="background-color: #f8fafc; border-left: 4px solid #1e3c72; padding: 15px; margin: 20px 0; border-radius: 6px;">
                    <p style="margin: 0 0 10px 0; color: #1e3c72; font-size: 14px; font-weight: bold;">
                      About Our School:
                    </p>
                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                      ${SCHOOL_NAME} is a public day school located in ${SCHOOL_LOCATION}, providing quality education to 400+ students 
                      through the 8-4-4 curriculum system. Our motto is "<strong>${SCHOOL_MOTTO}</strong>".
                    </p>
                  </div>
                  
                  <p style="margin: 20px 0 25px 0; color: #333333; font-size: 16px;">
                    For any inquiries regarding the admission process, please contact our admissions office:
                    <br>
                    📞 <strong>${CONTACT_PHONE}</strong> | 📧 <strong>${CONTACT_EMAIL}</strong>
                  </p>
                  
                  <p style="margin: 0; color: #333333; font-size: 16px;">
                    Best regards,<br>
                    <strong>The ${SCHOOL_NAME} Admissions Team</strong><br>
                    ${SCHOOL_LOCATION}
                  </p>
                </td>
              </tr>
            </table>
            
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td align="center" style="background-color: #f4f7f6; padding: 20px 30px; color: #777777; font-size: 12px; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                  <p style="margin: 0 0 5px 0;">
                    © ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.
                  </p>
                  <p style="margin: 0 0 5px 0; font-size: 11px; color: #9ca3af;">
                    ${SCHOOL_MOTTO}
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </center>
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
        <title>New Application - ${SCHOOL_NAME}</title>
        <style type="text/css">
          body { font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          .header { background-color: #1e3c72; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
          .content { padding: 30px; }
          .detail-row { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .detail-row strong { color: #1e3c72; display: inline-block; width: 180px; }
          .alert { background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 15px; border-radius: 4px; margin-top: 20px; color: #856404;}
          .highlight { background-color: #e8f5e9; padding: 10px; border-radius: 4px; border-left: 4px solid #388e3c; }
          .school-info { background-color: #f0f7ff; padding: 15px; border-radius: 4px; border-left: 4px solid #1e3c72; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">🔔 New Admission Application Received!</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">${SCHOOL_NAME}</p>
            <p style="margin: 2px 0 0 0; font-size: 12px; opacity: 0.8;">${SCHOOL_LOCATION}</p>
          </div>
          <div class="content">
            
            <div class="school-info">
              <h3 style="margin: 0 0 10px 0; color: #1e3c72;">${SCHOOL_NAME} Admissions System</h3>
              <p style="margin: 0; color: #4b5563;">A new application has been submitted to our public day school admissions system.</p>
            </div>
            
            <div class="highlight">
              <h3 style="margin-top: 0; color: #1e3c72;">Application Number: ${applicationNumber}</h3>
            </div>
            
            <p style="color: #4b5563;">A new student application has been submitted to ${SCHOOL_NAME}'s admissions system.</p>
            
            <div class="detail-row">
              <strong>Applicant Name:</strong> <span>${applicantData.firstName} ${applicantData.lastName}</span>
            </div>
            <div class="detail-row">
              <strong>Date of Birth:</strong> <span>${new Date(applicantData.dateOfBirth).toLocaleDateString()} (Age: ${calculateAge(applicantData.dateOfBirth)})</span>
            </div>
            <div class="detail-row">
              <strong>Gender:</strong> <span>${applicantData.gender}</span>
            </div>
            <div class="detail-row">
              <strong>County:</strong> <span>${applicantData.county}</span>
            </div>
            <div class="detail-row">
              <strong>Previous School:</strong> <span>${applicantData.previousSchool}</span>
            </div>
            <div class="detail-row">
              <strong>KCPE Marks:</strong> <span>${applicantData.kcpeMarks || 'Not provided'}</span>
            </div>
            <div class="detail-row">
              <strong>Contact Email:</strong> <span>${applicantData.email}</span>
            </div>
            <div class="detail-row">
              <strong>Contact Phone:</strong> <span>${applicantData.phone || 'Not provided'}</span>
            </div>
            <div class="detail-row">
              <strong>Blood Group:</strong> <span>${applicantData.bloodGroup || 'Not provided'}</span>
            </div>
            <div class="detail-row">
              <strong>Submitted At:</strong> <span>${new Date().toLocaleString('en-US')}</span>
            </div>
            <div class="detail-row">
              <strong>Application Type:</strong> <span>Public Day School Admission</span>
            </div>

            <div class="alert">
              <p><strong>Action required:</strong> Please log into the ${SCHOOL_NAME} admissions portal to review and process this application.</p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Portal: Your School Admissions Dashboard</p>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background-color: #f9fafb; border-radius: 6px;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                <strong>School Information:</strong><br>
                ${SCHOOL_NAME} | ${SCHOOL_LOCATION}<br>
                Phone: ${CONTACT_PHONE} | Email: ${CONTACT_EMAIL}<br>
                Motto: "${SCHOOL_MOTTO}" | Students: 400+
              </p>
            </div>
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
      'email', 'postalAddress',
      'previousSchool', 'previousClass'
    ];

    const missingFields = requiredFields.filter(field => !data[field]?.trim());
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
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

    // Check for existing email
    const existing = await prisma.admissionApplication.findUnique({
      where: { email: data.email.toLowerCase() }
    });
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: "Email already registered" 
      }, { status: 400 });
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
      email: data.email.trim().toLowerCase(),
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
      await sendApplicantConfirmation(application.email, fullName, application.applicationNumber);
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