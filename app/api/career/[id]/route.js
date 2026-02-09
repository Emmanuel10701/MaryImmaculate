import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";

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

// Helper functions
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

// --------------------- GET single job (Public) ---------------------
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const job = await prisma.careerJob.findUnique({ 
      where: { id },
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
        updatedAt: true,
        // Don't show createdBy info publicly unless authenticated
      }
    });
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("❌ GET single Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}

// --------------------- PUT / Update job (Authenticated Only) ---------------------
export async function PUT(req, { params }) {
  try {
    // Step 1: Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`✏️ Job update request from: ${auth.user.name} (${auth.user.role})`);

    // Step 2: Get job ID and data
    const { id } = params;
    const data = await req.json();

    // Step 3: Check if job exists
    const existingJob = await prisma.careerJob.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!existingJob) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Job not found",
          authenticated: true
        }, 
        { status: 404 }
      );
    }

    // Optional: Check if user has permission to update this job
    // You can implement role-based or ownership-based checks here
    // For example, only allow creator or admins to update:
    // if (existingJob.createdBy && existingJob.createdBy !== auth.user.id && auth.user.role !== 'SUPER_ADMIN') {
    //   return NextResponse.json(
    //     { 
    //       success: false, 
    //       error: "Access Denied",
    //       message: "You can only update jobs you created",
    //       authenticated: true
    //     }, 
    //     { status: 403 }
    //   );
    // }

    // Step 4: Update the job
    const job = await prisma.careerJob.update({
      where: { id },
      data: {
        jobTitle: data.jobTitle,
        department: data.department,
        category: data.category,
        jobDescription: data.jobDescription,
        requirements: data.requirements,
        experience: data.experience,
        qualifications: data.qualifications,
        positionsAvailable: parseNumber(data.positionsAvailable),
        jobType: data.jobType,
        applicationDeadline: parseDate(data.applicationDeadline),
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        // Track who updated
        updatedAt: new Date()
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Job updated successfully", 
      job,
      updatedBy: auth.user.name,
      authenticated: true
    });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Job not found",
          authenticated: true
        }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        authenticated: true
      }, 
      { status: 500 }
    );
  }
}

// --------------------- DELETE / Delete job (Authenticated Only) ---------------------
export async function DELETE(req, { params }) {
  try {
    // Step 1: Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`🗑️ Job deletion request from: ${auth.user.name} (${auth.user.role})`);

    // Step 2: Get job ID
    const { id } = params;

    // Step 3: Check if job exists
    const existingJob = await prisma.careerJob.findUnique({
      where: { id },
      select: { 
        id: true, 
        jobTitle: true,
      }
    });

    if (!existingJob) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Job not found",
          authenticated: true
        }, 
        { status: 404 }
      );
    }

    // Optional: Check if user has permission to delete this job
    // For example, only allow creator or admins to delete:
    // if (existingJob.createdBy && existingJob.createdBy !== auth.user.id && auth.user.role !== 'SUPER_ADMIN') {
    //   return NextResponse.json(
    //     { 
    //       success: false, 
    //       error: "Access Denied",
    //       message: "You can only delete jobs you created",
    //       authenticated: true
    //     }, 
    //     { status: 403 }
    //   );
    // }

    // Step 4: Delete the job (with logging)
    console.log(`🗑️ Deleting job: "${existingJob.jobTitle}" (ID: ${id})`);
    
    const job = await prisma.careerJob.delete({ 
      where: { id },
      select: {
        id: true,
        jobTitle: true,
        department: true,
        // Get basic info for confirmation
      }
    });

    // Log the deletion
    console.log(`✅ Job deleted: "${job.jobTitle}" by ${auth.user.name}`);

    return NextResponse.json({ 
      success: true, 
      message: "Job deleted successfully", 
      job,
      authenticated: true
    });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Job not found",
          authenticated: true
        }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        authenticated: true
      }, 
      { status: 500 }
    );
  }
}