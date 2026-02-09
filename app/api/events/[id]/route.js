import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager (for PUT and DELETE authentication only)
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
        
        // Check user role - only admins/staff can modify events
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL', 'STAFF', 'EVENT_MANAGER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to modify events' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Event modification authentication successful for user:', adminPayload.name || 'Unknown');
      
      return { 
        valid: true, 
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

// Authentication middleware for protected requests
const authenticateProtectedRequest = (req, operation = 'modify') => {
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
          message: `It seems you're not authenticated to ${operation} events. Please login again.`,
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
          folder: "school_events",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 1200, height: 800, crop: "fill" },
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
    
    await cloudinary.uploader.destroy(`school_events/${publicId}`, {
      resource_type: "image",
    });
    console.log(`✅ Deleted event image from Cloudinary: ${publicId}`);
  } catch (err) {
    console.warn("⚠️ Could not delete Cloudinary image:", err.message);
  }
}

// 🔹 GET single event by ID (PUBLIC - no authentication required)
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({ 
      where: { id },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        date: true,
        time: true,
        type: true,
        location: true,
        featured: true,
        image: true,
        attendees: true,
        speaker: true,
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
    console.error("❌ GET Single Event Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PUT (update) event by ID (PROTECTED - authentication required)
export async function PUT(req, { params }) {
  try {
    // Step 1: Authenticate the PUT request
    const auth = authenticateProtectedRequest(req, 'update');
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Event update request from: ${auth.user.name} (${auth.user.role})`);

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

    // Step 2: Check if event exists
    const existingEvent = await prisma.event.findUnique({ 
      where: { id },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        date: true,
        time: true,
        type: true,
        location: true,
        featured: true,
        image: true,
        attendees: true,
        speaker: true,
      }
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

    // Optional: Check if user owns this event (for teachers/staff)
    // Only allow original creator or admin to modify
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN' && auth.user.role !== 'administrator') {
      if (existingEvent.createdBy && existingEvent.createdBy !== auth.user.id) {
        return NextResponse.json(
          { 
            success: false, 
            error: "You can only update events you created",
            authenticated: true
          },
          { status: 403 }
        );
      }
    }

    const formData = await req.formData();
    
    // Step 3: Prepare data for update
    const dataToUpdate = {
      title: formData.get("title")?.trim() || existingEvent.title,
      category: formData.get("category")?.trim() || existingEvent.category,
      description: formData.get("description")?.trim() || existingEvent.description,
      time: formData.get("time")?.trim() || existingEvent.time,
      type: formData.get("type")?.trim() || existingEvent.type,
      location: formData.get("location")?.trim() || existingEvent.location,
      featured: formData.get("featured") === "true",
      attendees: formData.get("attendees") || existingEvent.attendees,
      speaker: formData.get("speaker")?.trim() || existingEvent.speaker,
      updatedAt: new Date(),
      // Track who updated this event
      updatedBy: auth.user.id,
      updatedByName: auth.user.name,
      updatedByRole: auth.user.role
    };

    // Handle date if provided
    const dateStr = formData.get("date");
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        dataToUpdate.date = date;
      }
    }

    // Step 4: Handle image operations
    const file = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";
    
    if (file && file.size > 0) {
      // Delete old image from Cloudinary if exists
      if (existingEvent.image) {
        await deleteImageFromCloudinary(existingEvent.image);
      }
      
      // Upload new image to Cloudinary
      const result = await uploadImageToCloudinary(file);
      if (result) {
        dataToUpdate.image = result.secure_url;
        console.log(`✅ Event image updated on Cloudinary by ${auth.user.name}: ${result.secure_url}`);
      }
    } else if (removeImage && existingEvent.image) {
      // Remove image if requested
      await deleteImageFromCloudinary(existingEvent.image);
      dataToUpdate.image = null;
      console.log(`🗑️ Event image removed from Cloudinary by ${auth.user.name}`);
    }

    // Step 5: Update the event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        date: true,
        time: true,
        type: true,
        location: true,
        featured: true,
        image: true,
        attendees: true,
        speaker: true,
        createdAt: true,
        updatedAt: true,
        updatedBy: true,
        updatedByName: true,
        updatedByRole: true
      }
    });

    // Step 6: Return success response
    return NextResponse.json({ 
      success: true, 
      message: "Event updated successfully",
      event: updatedEvent,
      updatedBy: auth.user.name,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT Event Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        authenticated: true // User was authenticated before error
      },
      { status: 500 }
    );
  }
}

// 🔹 DELETE event by ID (PROTECTED - authentication required)
export async function DELETE(req, { params }) {
  try {
    // Step 1: Authenticate the DELETE request
    const auth = authenticateProtectedRequest(req, 'delete');
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Event delete request from: ${auth.user.name} (${auth.user.role})`);

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

    // Step 2: Check if event exists
    const existingEvent = await prisma.event.findUnique({ 
      where: { id },
      select: {
        id: true,
        title: true,
        image: true,
      }
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

    // Step 3: Check permissions
    // Only admins can delete events they didn't create
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN' && auth.user.role !== 'administrator') {
      if (existingEvent.createdBy && existingEvent.createdBy !== auth.user.id) {
        return NextResponse.json(
          { 
            success: false, 
            error: "You can only delete events you created",
            authenticated: true
          },
          { status: 403 }
        );
      }
    }

    // Step 4: Delete image from Cloudinary if exists
    if (existingEvent.image) {
      console.log(`🗑️ Deleting event image from Cloudinary by ${auth.user.name}...`);
      await deleteImageFromCloudinary(existingEvent.image);
      console.log('✅ Event image deleted from Cloudinary');
    }

    // Step 5: Delete from database
    const deletedEvent = await prisma.event.delete({ 
      where: { id },
      select: {
        id: true,
        title: true,
        category: true,
        date: true,
      }
    });



    // Step 6: Return success response
    return NextResponse.json({ 
      success: true, 
      message: "Event deleted successfully",
      event: deletedEvent,
      deletedBy: auth.user.name,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Event Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        authenticated: true // User was authenticated before error
      },
      { status: 500 }
    );
  }
}