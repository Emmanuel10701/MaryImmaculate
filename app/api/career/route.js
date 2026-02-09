import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";

// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager (copied from dashboard)
class DeviceTokenManager {
  static KEYS = {
    DEVICE_TOKEN: 'device_token',
    DEVICE_FINGERPRINT: 'device_fingerprint',
    LOGIN_COUNT: 'login_count',
    LAST_LOGIN: 'last_login'
  };

  // Validate both admin token and device token
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
        
        // Check user role
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { valid: false, reason: 'invalid_role', message: 'User does not have required permissions' };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Authentication successful for user:', adminPayload.name || 'Unknown');
      
      return { 
        valid: true, 
        adminToken: adminToken,
        deviceToken: deviceToken,
        user: {
          id: adminPayload.id,
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

// Authentication middleware
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
          message: "It seems you're not authenticated to automate this action. Please login again.",
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

// ==================== VALIDATION UTILITIES ====================

const validateJobFields = (data) => {
  const required = [
    'jobTitle', 'department', 'category', 'jobDescription',
    'requirements', 'experience', 'qualifications',
    'positionsAvailable', 'jobType', 'applicationDeadline'
  ];

  const missing = required.filter(field => !data[field] || data[field].toString().trim() === '');
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

const parseNumber = (value) => {
  if (!value || value.toString().trim() === '') return null;
  const num = parseInt(value);
  return isNaN(num) ? null : num;
};

const parseDate = (dateString) => {
  if (!dateString || dateString.trim() === '') return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// ==================== API ENDPOINTS ====================

// --------------------- POST / Create Job (Authenticated Only) ---------------------
export async function POST(req) {
  try {
    // Step 1: Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info (optional)
    console.log(`📝 Job creation request from: ${auth.user.name} (${auth.user.role})`);

    // Step 2: Parse and validate request data
    const data = await req.json();
    
    try {
      validateJobFields(data);
    } catch (validationError) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationError.message,
          authenticated: true // User is authenticated but data is invalid
        }, 
        { status: 400 }
      );
    }

    // Step 3: Create the job
    const job = await prisma.careerJob.create({
      data: {
        jobTitle: data.jobTitle,
        department: data.department,
        category: data.category,
        jobDescription: data.jobDescription,
        requirements: data.requirements,
        experience: data.experience,
        qualifications: data.qualifications,
        positionsAvailable: parseNumber(data.positionsAvailable) || 1,
        jobType: data.jobType,
        applicationDeadline: parseDate(data.applicationDeadline),
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        // Optional: Track who created this job
      },
    });

    // Step 4: Return success response
    return NextResponse.json({
      success: true,
      message: "Job created successfully",
      job,
    });
    
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        authenticated: true // User was authenticated before error
      }, 
      { status: 500 }
    );
  }
}

// --------------------- GET / List Jobs (Public) ---------------------
export async function GET(req) {
  try {
    // Note: GET is public, no authentication required
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const department = searchParams.get('department');
    const jobType = searchParams.get('jobType');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const where = {};

    if (category) where.category = category;
    if (department) where.department = department;
    if (jobType) where.jobType = jobType;

    if (search) {
      where.OR = [
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { jobDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.careerJob.count({ where });

    const jobs = await prisma.careerJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      // Optionally hide sensitive fields
      select: {
        id: true,
        jobTitle: true,
        department: true,
        category: true,
        jobDescription: true,
        requirements: true,
        experience: true,
        qualifications: true,
        positionsAvailable: true,
        jobType: true,
        applicationDeadline: true,
        contactEmail: true,
        contactPhone: true,
        createdAt: true,
        // Don't show createdBy info publicly
      }
    });

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}