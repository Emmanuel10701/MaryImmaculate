import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";

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
        
        // Check user role - only admins/staff can manage subscribers
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'STAFF', 'MARKETING_MANAGER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage subscribers' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Subscriber management authentication successful for user:', adminPayload.name || 'Unknown');
      
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
          message: "Authentication required to manage subscribers.",
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

// ✅ Get single subscriber (PUBLIC - no authentication required)
export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const subscriber = await prisma.subscriber.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, subscriber }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching subscriber:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ Update subscriber (PROTECTED - authentication required)
export async function PUT(request, context) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`📝 Subscriber update request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = await context.params;
    const { email, name, active } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email is required",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Check if subscriber exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { id },
    });

    if (!existingSubscriber) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Subscriber not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Check if email is already taken by another subscriber
    if (email !== existingSubscriber.email) {
      const emailExists = await prisma.subscriber.findFirst({
        where: {
          email,
          NOT: { id }
        }
      });

      if (emailExists) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Email already registered by another subscriber",
            authenticated: true
          },
          { status: 409 }
        );
      }
    }

    // Update subscriber with who updated it
    const updatedSubscriber = await prisma.subscriber.update({
      where: { id },
      data: { 
        email, 
        name: name || null,
        active: active !== undefined ? active : true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Subscriber updated successfully",
        subscriber: updatedSubscriber,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating subscriber:", error);
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

// ✅ Delete subscriber (PROTECTED - authentication required)
export async function DELETE(request, context) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`🗑️ Subscriber delete request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = await context.params;

    // Check if subscriber exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { id },
    });

    if (!existingSubscriber) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Subscriber not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Delete subscriber with who deleted it info
    await prisma.subscriber.delete({
      where: { id },
    });

    // Log the deletion
    console.log(`✅ Subscriber deleted by ${auth.user.name}: ${existingSubscriber.email}`);

    return NextResponse.json(
      { 
        success: true, 
        message: "Subscriber deleted successfully",
        deletedEmail: existingSubscriber.email,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting subscriber:", error);
    
    // Handle Prisma foreign key constraint errors
    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Cannot delete subscriber because it is referenced in other records",
          authenticated: true
        },
        { status: 409 }
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