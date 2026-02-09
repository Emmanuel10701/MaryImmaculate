import { NextResponse } from "next/server";
import { prisma } from '../../../../libs/prisma';
import cloudinary from '../../../../libs/cloudinary';

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
        
        // Check user role - only counselors/admins can manage counseling events
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'COUNSELOR', 'TEACHER', 'STAFF'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage counseling events' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Counseling event management authentication successful for user:', adminPayload.name || 'Unknown');
      
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
          message: "Authentication required to manage counseling events.",
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

// 🔹 GET single event (PUBLIC - no authentication required)
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const event = await prisma.counselingEvent.findUnique({ 
      where: { id },
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
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      event 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Single Counseling Event Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PUT — update event (PROTECTED - authentication required)
export async function PUT(req, { params }) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`✏️ Counseling event update request from: ${auth.user.name} (${auth.user.role})`);

    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid event ID",
          authenticated: true
        },
        { status: 400 }
      );
    }

    const existingEvent = await prisma.counselingEvent.findUnique({ 
      where: { id } 
    });
    
    if (!existingEvent) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Event not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    
    const updateData = {
      counselor: formData.get("counselor")?.trim() || existingEvent.counselor,
      category: formData.get("category")?.trim() || existingEvent.category,
      description: formData.get("description")?.trim() || existingEvent.description,
      notes: formData.get("notes")?.trim() || existingEvent.notes,
      time: formData.get("time")?.trim() || existingEvent.time,
      type: formData.get("type")?.trim() || existingEvent.type,
      priority: formData.get("priority")?.trim() || existingEvent.priority,
      updatedAt: new Date(),
      // Audit trail
    };

    // Handle date if provided
    const dateStr = formData.get("date");
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        updateData.date = date;
      }
    }

    // Handle image update with Cloudinary
    const file = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";
    
    if (file && file.size > 0) {
      console.log(`🔄 Updating counseling event image by ${auth.user.name}...`);
      
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
      
      // Delete old image if exists
      if (existingEvent.image) {
        await deleteImageFromCloudinary(existingEvent.image);
      }
      
      // Upload new image to Cloudinary
      const result = await uploadImageToCloudinary(file);
      if (result) {
        updateData.image = result.secure_url;
        console.log(`✅ Image updated by ${auth.user.name}:`, result.secure_url);
      }
    } else if (removeImage && existingEvent.image) {
      console.log(`🗑️ Removing counseling event image by ${auth.user.name}...`);
      
      // Delete existing image from Cloudinary
      await deleteImageFromCloudinary(existingEvent.image);
      updateData.image = null;
      console.log(`✅ Image removed by ${auth.user.name}`);
    }

    // Update database record
    const updatedEvent = await prisma.counselingEvent.update({ 
      where: { id }, 
      data: updateData,
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
    
    console.log(`✅ Counseling event updated by ${auth.user.name}: ${updatedEvent.description}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Event updated successfully", 
      event: updatedEvent,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT Counseling Event Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to update counseling event",
        authenticated: true
      },
      { status: 500 }
    );
  }
}

// 🔹 DELETE — remove event (PROTECTED - authentication required)
export async function DELETE(req, { params }) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`🗑️ Counseling event delete request from: ${auth.user.name} (${auth.user.role})`);

    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid event ID",
          authenticated: true
        },
        { status: 400 }
      );
    }

    const existingEvent = await prisma.counselingEvent.findUnique({ 
      where: { id } 
    });
    
    if (!existingEvent) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Event not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if exists
    if (existingEvent.image) {
      console.log(`🗑️ Deleting counseling event image by ${auth.user.name}...`);
      await deleteImageFromCloudinary(existingEvent.image);
      console.log(`✅ Image deleted by ${auth.user.name}`);
    }

    // Delete from database
    await prisma.counselingEvent.delete({ 
      where: { id } 
    });
    
    console.log(`✅ Counseling event deleted by ${auth.user.name}: ${existingEvent.description}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Event deleted successfully",
      deletedEvent: {
        id: existingEvent.id,
        counselor: existingEvent.counselor,
        category: existingEvent.category,
        description: existingEvent.description,
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Counseling Event Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to delete counseling event",
        authenticated: true
      },
      { status: 500 }
    );
  }
}