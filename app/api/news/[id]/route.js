import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

// ==================== AUTHENTICATION UTILITIES ====================

class DeviceTokenManager {
  static decodeBase64(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) throw new Error('Invalid base64 string');
      base64 += '==='.slice(0, 4 - pad);
    }
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  static validateTokensFromHeaders(headers) {
    try {
      const adminToken = headers.get('x-admin-token') || 
                         headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken || !deviceToken) {
        return { valid: false, reason: 'missing_tokens', message: 'Both admin and device tokens are required' };
      }

      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_jwt_format', message: 'Invalid JWT format' };
      }

      try {
        const payloadStr = this.decodeBase64(adminParts[1]);
        const payload = JSON.parse(payloadStr);
        
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          return { valid: false, reason: 'token_expired', message: 'Token has expired' };
        }

        const userRole = payload.role;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL', 'STAFF', 'EDITOR', 'NEWS_MANAGER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { valid: false, reason: 'invalid_role', message: 'Insufficient permissions' };
        }

        // Validate device token
        try {
          const devicePayloadStr = Buffer.from(deviceToken, 'base64').toString('utf-8');
          const devicePayload = JSON.parse(devicePayloadStr);
          
          if (devicePayload.exp && devicePayload.exp * 1000 <= Date.now()) {
            return { valid: false, reason: 'device_expired', message: 'Device token expired' };
          }
        } catch {
          return { valid: false, reason: 'invalid_device_token', message: 'Invalid device token' };
        }

        return { 
          valid: true,
          user: {
            id: payload.userId || payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role
          }
        };

      } catch {
        return { valid: false, reason: 'token_parsing_error', message: 'Failed to parse token' };
      }

    } catch {
      return { valid: false, reason: 'validation_error', message: 'Authentication failed' };
    }
  }
}

const authenticateProtectedRequest = (req, operation) => {
  const validation = DeviceTokenManager.validateTokensFromHeaders(req.headers);
  
  if (!validation.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Authentication Failed",
          message: `Please login again to ${operation} this news article.`,
          details: validation.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validation.user
  };
};

// Helper functions
const uploadImageToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "school_news",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 1200, height: 800, crop: "fill" },
            { quality: "auto:good" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
  } catch {
    return null;
  }
};

const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl?.includes('cloudinary.com')) return;

  try {
    const urlMatch = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    if (!urlMatch) return;
    
    const publicId = urlMatch[1];
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch {
    // Silent fail
  }
};

// 🔹 GET single news (PUBLIC)
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid news ID" },
        { status: 400 }
      );
    }

    const newsItem = await prisma.news.findUnique({ 
      where: { id },
      select: {
        id: true,
        title: true,
        excerpt: true,
        fullContent: true,
        date: true,
        category: true,
        author: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!newsItem) {
      return NextResponse.json(
        { success: false, error: "News article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: newsItem 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Single News Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch news article" 
    }, { status: 500 });
  }
}

// 🔹 PUT (update) news (PROTECTED)
export async function PUT(req, { params }) {
  try {
    const auth = authenticateProtectedRequest(req, 'update');
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`✏️ News update by: ${auth.user.name}`);

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid news ID",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Check if news exists and get creator info
    const existingNews = await prisma.news.findUnique({ 
      where: { id },
      select: {
        id: true,
        title: true,
        image: true,
      }
    });

    if (!existingNews) {
      return NextResponse.json(
        { 
          success: false, 
          error: "News article not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Check permissions (only creator or admin can update)
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN' && auth.user.role !== 'administrator') {
      if (existingNews.createdBy && existingNews.createdBy !== auth.user.id) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Permission Denied",
            message: "You can only update articles you created",
            authenticated: true
          },
          { status: 403 }
        );
      }
    }

    const formData = await req.formData();
    const updateData = {};

    // Process form fields
    const fields = ['title', 'excerpt', 'fullContent', 'category', 'author'];
    fields.forEach(field => {
      const value = formData.get(field)?.trim();
      if (value !== null && value !== undefined) updateData[field] = value;
    });

    // Handle date
    const dateStr = formData.get("date");
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        updateData.date = date;
      }
    }

    // Handle image
    const file = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";
    
    if (file && file.size > 0) {
      // Delete old image if exists
      if (existingNews.image) {
        await deleteImageFromCloudinary(existingNews.image);
      }
      
      // Upload new image
      const result = await uploadImageToCloudinary(file);
      if (result) {
        updateData.image = result.secure_url;
        console.log(`📸 Image updated by ${auth.user.name}`);
      }
    } else if (removeImage && existingNews.image) {
      await deleteImageFromCloudinary(existingNews.image);
      updateData.image = null;
      console.log(`🗑️ Image removed by ${auth.user.name}`);
    }

    updateData.updatedAt = new Date();

    const updatedNews = await prisma.news.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        excerpt: true,
        fullContent: true,
        date: true,
        category: true,
        author: true,
        image: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "News article updated successfully",
      data: updatedNews,
      updatedBy: auth.user.name
    }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT News Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to update news",
      authenticated: true
    }, { status: 500 });
  }
}

// 🔹 DELETE news (PROTECTED)
export async function DELETE(req, { params }) {
  try {
    const auth = authenticateProtectedRequest(req, 'delete');
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`🗑️ News deletion by: ${auth.user.name}`);

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid news ID",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Check if news exists and get creator info
    const existingNews = await prisma.news.findUnique({ 
      where: { id },
      select: {
        id: true,
        title: true,
        image: true,
      }
    });

    if (!existingNews) {
      return NextResponse.json(
        { 
          success: false, 
          error: "News article not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Check permissions (only creator or admin can delete)
    if (auth.user.role !== 'ADMIN' && auth.user.role !== 'SUPER_ADMIN' && auth.user.role !== 'administrator') {
      if (existingNews.createdBy && existingNews.createdBy !== auth.user.id) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Permission Denied",
            message: "You can only delete articles you created",
            authenticated: true
          },
          { status: 403 }
        );
      }
    }

    // Delete image from Cloudinary if exists
    if (existingNews.image) {
      await deleteImageFromCloudinary(existingNews.image);
      console.log(`🗑️ Image deleted by ${auth.user.name}`);
    }

    // Delete from database
    await prisma.news.delete({ 
      where: { id },
      select: { id: true, title: true }
    });

    return NextResponse.json({ 
      success: true, 
      message: "News article deleted successfully",
      deletedId: id,
      deletedTitle: existingNews.title,
      deletedBy: auth.user.name
    }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE News Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to delete news",
      authenticated: true
    }, { status: 500 });
  }
}