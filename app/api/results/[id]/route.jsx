// app/api/results/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prisma'; // ✅ named import

// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager
class DeviceTokenManager {
  static validateTokensFromHeaders(headers, options = {}) {
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
        
        // Check user role - only admins/staff can manage results
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'STAFF', 'HR_MANAGER', 'TEACHER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage student results' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Results management authentication successful for user:', adminPayload.name || 'Unknown');
      
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

// Authentication middleware for protected requests
const authenticateRequest = (req) => {
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
          message: "Authentication required to manage academic results.",
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

// Helper function to calculate grade
const calculateGrade = (score) => {
  if (score >= 80) return 'A';
  if (score >= 70) return 'A-';
  if (score >= 60) return 'B+';
  if (score >= 55) return 'B';
  if (score >= 50) return 'B-';
  if (score >= 45) return 'C+';
  if (score >= 40) return 'C';
  if (score >= 35) return 'C-';
  if (score >= 30) return 'D+';
  if (score >= 25) return 'D';
  return 'E';
};

const calculatePoints = (score) => {
  const grade = calculateGrade(score);
  const pointMap = {
    'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
    'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'E': 1
  };
  return pointMap[grade] || 0;
};

// Helper function to parse and calculate result stats
const parseResultWithStats = (result) => {
  let subjects = [];
  try {
    if (typeof result.subjects === 'string') {
      subjects = JSON.parse(result.subjects);
    } else if (Array.isArray(result.subjects)) {
      subjects = result.subjects;
    }
  } catch (e) {
    subjects = [];
  }

  const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
  const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;
  const totalPoints = subjects.reduce((sum, s) => sum + (s.points || 0), 0);

  return {
    ...result,
    subjects,
    totalScore,
    averageScore: parseFloat(averageScore.toFixed(2)),
    overallGrade: calculateGrade(averageScore),
    totalPoints
  };
};

// GET single result by ID (PUBLIC - no authentication required)
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const result = await prisma.studentResult.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            admissionNumber: true,
            form: true,
            stream: true,
            gender: true,
            email: true,
            parentPhone: true
          }
        },
        uploadBatch: {
          select: {
            id: true,
            fileName: true,
            uploadDate: true,
            uploadedBy: true,
            status: true
          }
        }
      }
    });

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Academic result not found' },
        { status: 404 }
      );
    }

    const parsedResult = parseResultWithStats(result);

    return NextResponse.json({
      success: true,
      data: parsedResult
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch academic result', error: error.message },
      { status: 500 }
    );
  }
}

// PUT update result (PROTECTED - authentication required)
export async function PUT(request, { params }) {
  try {
    // Step 1: Authenticate the PUT request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Individual result update request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    const data = await request.json();

    const existingResult = await prisma.studentResult.findUnique({
      where: { id }
    });

    if (!existingResult) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Academic result not found',
          authenticated: true 
        },
        { status: 404 }
      );
    }

    const requiredFields = ['form', 'term', 'academicYear', 'subjects'];
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { 
            success: false, 
            message: `${field} is required`,
            authenticated: true 
          },
          { status: 400 }
        );
      }
    }

    if (!Array.isArray(data.subjects)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Subjects must be an array',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    if (data.subjects.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'At least one subject is required',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    const processedSubjects = data.subjects.map(subject => {
      const score = parseFloat(subject.score) || 0;
      const grade = subject.grade || calculateGrade(score);
      const points = subject.points || calculatePoints(score);
      
      return {
        subject: subject.subject || '',
        score: score,
        grade: grade,
        points: points,
        comment: subject.comment || ''
      };
    });

    const updatedResult = await prisma.studentResult.update({
      where: { id },
      data: {
        form: data.form,
        term: data.term,
        academicYear: data.academicYear,
        subjects: processedSubjects,
        updatedAt: new Date(),
        
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNumber: true,
            form: true
          }
        }
      }
    });

    console.log(`✅ Individual result updated by ${auth.user.name}: Student ${updatedResult.student?.firstName} ${updatedResult.student?.lastName} (${updatedResult.admissionNumber})`);

    return NextResponse.json({
      success: true,
      message: 'Academic result updated successfully',
      data: updatedResult,
      authenticated: true,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Academic result not found',
          authenticated: true 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update academic result', 
        error: error.message,
        authenticated: true 
      },
      { status: 500 }
    );
  }
}

// DELETE result (PROTECTED - authentication required)
export async function DELETE(request, { params }) {
  try {
    // Step 1: Authenticate the DELETE request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`🗑️ Individual result delete request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;

    const result = await prisma.studentResult.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            admissionNumber: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!result) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Academic result not found',
          authenticated: true 
        },
        { status: 404 }
      );
    }

    await prisma.studentResult.delete({
      where: { id }
    });

    console.log(`✅ Individual result deleted by ${auth.user.name}: Student ${result.student.firstName} ${result.student.lastName} (${result.student.admissionNumber})`);

    return NextResponse.json({
      success: true,
      message: `Academic result deleted successfully for student ${result.student.firstName} ${result.student.lastName} (${result.student.admissionNumber})`,
      authenticated: true,
      deletedBy: auth.user.name,
      deletedResult: {
        studentName: `${result.student.firstName} ${result.student.lastName}`,
        admissionNumber: result.student.admissionNumber,
        form: result.form,
        term: result.term,
        academicYear: result.academicYear
      }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Academic result not found',
          authenticated: true 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete academic result', 
        error: error.message,
        authenticated: true 
      },
      { status: 500 }
    );
  }
}