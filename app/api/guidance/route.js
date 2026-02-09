import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";

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
        
        // Check user role - only counselors/admins can create counseling events
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'COUNSELOR', 'TEACHER', 'STAFF'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to record counseling events' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Counseling event authentication successful for user:', adminPayload.name || 'Unknown');
      
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
const authenticatePostRequest = (req) => {
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
          message: "Authentication required to record counseling events.",
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

// Helper: upload image to Cloudinary
async function uploadImageToCloudinary(file) {
  if (!file || !file.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    
    // Clean filename
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "counseling_events",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 800, height: 600, crop: "fill" },
            { quality: "auto:good" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(buffer);
    });
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err);
    return null;
  }
}

// Helper: delete image from Cloudinary
async function deleteImageFromCloudinary(imageUrl) {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;
    
    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const publicId = fileName.split('.')[0];
    
    await cloudinary.uploader.destroy(`counseling_events/${publicId}`, {
      resource_type: "image",
    });
    console.log(`✅ Deleted counseling image from Cloudinary: ${publicId}`);
  } catch (err) {
    console.warn("⚠️ Could not delete Cloudinary image:", err.message);
  }
}

// 🔹 GET all events (PUBLIC - no authentication required)
export async function GET() {
  try {
    const events = await prisma.counselingEvent.findMany({
      orderBy: { date: "desc" },
      select: {
        id: true,
        counselor: true,
        category: true,
        description: true,
        notes: true,
        date: true,
        time: true,
        type: true,
        priority: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      events,
      count: events.length 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Counseling Events Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch counseling events" },
      { status: 500 }
    );
  }
}

// 🔹 POST new event (PROTECTED - authentication required)
export async function POST(req) {
  try {
    // Authenticate the POST request
    const auth = authenticatePostRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`📝 Counseling event creation request from: ${auth.user.name} (${auth.user.role})`);

    const formData = await req.formData();

    const counselor = formData.get("counselor")?.trim() || "";
    const category = formData.get("category")?.trim() || "";
    const description = formData.get("description")?.trim() || "";
    const notes = formData.get("notes")?.trim() || null;
    const dateStr = formData.get("date");
    const time = formData.get("time")?.trim() || "";
    const type = formData.get("type")?.trim() || "";
    const priority = formData.get("priority")?.trim() || "medium";

    // Validate required fields
    if (!counselor || !category || !description || !dateStr || !time || !type) {
      return NextResponse.json(
        { 
          success: false, 
          error: "All required fields must be filled",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Parse and validate date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid date format",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Handle image upload to Cloudinary
    let imageUrl = null;
    const file = formData.get("image");

    if (file && file.size > 0) {
      // Validate image type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed.",
            authenticated: true
          },
          { status: 400 }
        );
      }

      // Validate image size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Image size too large. Maximum size is 5MB.",
            authenticated: true
          },
          { status: 400 }
        );
      }

      const result = await uploadImageToCloudinary(file);
      if (result) {
        imageUrl = result.secure_url;
        console.log(`✅ Image uploaded to Cloudinary by ${auth.user.name}: ${imageUrl}`);
      }
    }

    // Create event in database with audit trail
    const newEvent = await prisma.counselingEvent.create({
      data: {
        counselor,
        category,
        description,
        notes,
        date,
        time,
        type,
        priority,
        image: imageUrl, // Cloudinary URL
      },
      select: {
        id: true,
        counselor: true,
        category: true,
        description: true,
        notes: true,
        date: true,
        time: true,
        type: true,
        priority: true,
        image: true,
        createdAt: true,
        updatedAt: true,
     
      }
    });

    console.log(`✅ Counseling event recorded by ${auth.user.name}: ${newEvent.description}`);

    return NextResponse.json({
      success: true,
      message: "Counseling event recorded successfully",
      event: newEvent,
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error("❌ POST Counseling Event Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to record counseling event",
        authenticated: true
      },
      { status: 500 }
    );
  }
}