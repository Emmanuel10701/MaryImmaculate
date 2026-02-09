import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

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
        
        // Check user role - only admins can manage team members
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'STAFF', 'HR_MANAGER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage team members' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Team management authentication successful for user:', adminPayload.name || 'Unknown');
      
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
          message: "Authentication required to manage team members.",
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

// Helper: Upload image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "school_team",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto:good" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    return null;
  }
};

// Helper: Delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;

  try {
    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) return;
    
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Error deleting image from Cloudinary:", error);
    // Silent fail
  }
};

// 🔹 GET single team member (PUBLIC - no authentication required)
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("❌ GET Single Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

// 🔹 PUT update team member (PROTECTED - authentication required)
export async function PUT(req, { params }) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`✏️ Team member update request from: ${auth.user.name} (${auth.user.role})`);

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid member ID",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Check if member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Team member not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    
    const name = formData.get("name") || "";
    const role = formData.get("role") || "teacher";
    const title = formData.get("title") || null;
    const phone = formData.get("phone") || null;
    const email = formData.get("email") || null;
    const bio = formData.get("bio") || null;
    
    // Validate required fields
    if (!name.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Name is required",
          authenticated: true
        },
        { status: 400 }
      );
    }
    
    // Handle image update
    let image = existingMember.image;
    const imageFile = formData.get("image");
    
    // Check if new image is uploaded
    if (imageFile && imageFile.size > 0) {
      // Validate image type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(imageFile.type)) {
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
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Image size too large. Maximum size is 5MB.",
            authenticated: true
          },
          { status: 400 }
        );
      }
      
      // Delete old image from Cloudinary if exists
      if (existingMember.image) {
        await deleteImageFromCloudinary(existingMember.image);
      }
      
      // Upload new image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageFile);
      if (imageUrl) {
        image = imageUrl;
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: "Failed to upload image",
            authenticated: true
          },
          { status: 500 }
        );
      }
    }
    
    // Check if image should be removed
    const removeImage = formData.get("removeImage") === "true";
    if (removeImage && existingMember.image) {
      await deleteImageFromCloudinary(existingMember.image);
      image = null;
    }
    
    // Update team member with audit trail
    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        title,
        phone,
        email,
        bio,
        image,
        // Audit trail
               updatedAt: new Date(),
      }
    });

    console.log(`✅ Team member updated by ${auth.user.name}: ${updatedMember.name}`);
    
    return NextResponse.json({
      success: true,
      message: "Team member updated successfully",
      member: updatedMember,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Team member not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return NextResponse.json(
        { 
          success: false, 
          error: `A team member with this ${field} already exists`,
          authenticated: true
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to update team member",
        authenticated: true
      },
      { status: 500 }
    );
  }
}

// 🔹 DELETE team member (PROTECTED - authentication required)
export async function DELETE(req, { params }) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`🗑️ Team member delete request from: ${auth.user.name} (${auth.user.role})`);

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid member ID",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Check if member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Team member not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if exists
    if (existingMember.image) {
      await deleteImageFromCloudinary(existingMember.image);
    }

    // Delete member from database
    await prisma.teamMember.delete({
      where: { id }
    });

    console.log(`✅ Team member deleted by ${auth.user.name}: ${existingMember.name}`);
    
    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
      deletedMember: existingMember.name,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Team member not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Cannot delete team member because they are referenced in other records",
          authenticated: true
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to delete team member",
        authenticated: true
      },
      { status: 500 }
    );
  }
}