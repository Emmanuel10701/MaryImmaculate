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
        
        // Check user role - only authorized users can manage gallery items
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'TEACHER', 'STAFF', 'PHOTOGRAPHER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage gallery items' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Gallery management authentication successful for user:', adminPayload.name || 'Unknown');
      
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
          message: "Authentication required to manage gallery items.",
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

// Helper: Upload file to Cloudinary
const uploadFileToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");

    const isVideo = file.type.startsWith('video/');
    
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: isVideo ? "video" : "image",
          folder: "school_gallery",
          public_id: `${timestamp}-${sanitizedFileName}`,
          ...(isVideo ? {
            transformation: [
              { width: 1280, crop: "scale" },
              { quality: "auto" }
            ]
          } : {
            transformation: [
              { width: 1200, height: 800, crop: "fill" },
              { quality: "auto:good" }
            ]
          })
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

// Helper: Delete files from Cloudinary
const deleteFilesFromCloudinary = async (fileUrls) => {
  if (!Array.isArray(fileUrls) && !fileUrls) return;

  try {
    const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
    
    const deletePromises = urls.map(async (fileUrl) => {
      if (!fileUrl?.includes('cloudinary.com')) return;

      try {
        const urlMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+(?:$|\?)/);
        if (!urlMatch) return;
        
        const publicId = urlMatch[1];
        const isVideo = fileUrl.includes('/video/') || 
                       fileUrl.match(/\.(mp4|mpeg|avi|mov|wmv|flv|webm|mkv)$/i);
        
        await cloudinary.uploader.destroy(publicId, { 
          resource_type: isVideo ? "video" : "image" 
        });
      } catch {
        // Silent fail on individual file delete
      }
    });

    await Promise.all(deletePromises);
  } catch {
    // Silent fail
  }
};

// Valid categories
const validCategories = [
  'GENERAL', 'CLASSROOMS', 'LABORATORIES', 'DORMITORIES', 
  'DINING_HALL', 'SPORTS_FACILITIES', 'TEACHING', 
  'SCIENCE_LAB', 'COMPUTER_LAB', 'SPORTS_DAY', 
  'MUSIC_FESTIVAL', 'DRAMA_PERFORMANCE', 'ART_EXHIBITION', 
  'DEBATE_COMPETITION', 'SCIENCE_FAIR', 'ADMIN_OFFICES', 'STAFF', 
  'PRINCIPAL', 'BOARD', 'GRADUATION', 'AWARD_CEREMONY', 'PARENTS_DAY', 
  'OPEN_DAY', 'VISITORS', 'STUDENT_ACTIVITIES', 'CLUBS', 'COUNCIL', 
  'LEADERSHIP', 'OTHER'
];

// 🔹 GET single gallery (PUBLIC - no authentication required)
export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: "Valid gallery ID is required" },
        { status: 400 }
      );
    }

    const gallery = await prisma.galleryImage.findUnique({ 
      where: { id: parseInt(id) } 
    });
    
    if (!gallery) {
      return NextResponse.json(
        { success: false, error: "Gallery not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, gallery });
  } catch (error) {
    console.error("❌ GET Single Gallery Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery details" }, 
      { status: 500 }
    );
  }
}

// 🔹 PUT update gallery with file management (PROTECTED - authentication required)
export async function PUT(req, { params }) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`✏️ Gallery update request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Valid gallery ID is required",
          authenticated: true
        },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");

    // Check if gallery exists
    const existingGallery = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingGallery) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Gallery not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Title and category are required",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Validate category
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid category",
          authenticated: true
        },
        { status: 400 }
      );
    }

    let updatedFiles = [...existingGallery.files];
    
    // Handle files to remove
    const filesToRemove = formData.getAll("filesToRemove");
    if (filesToRemove.length > 0) {
      // Delete files from Cloudinary
      await deleteFilesFromCloudinary(filesToRemove);
      
      // Filter out files marked for removal
      updatedFiles = updatedFiles.filter(file => !filesToRemove.includes(file));
    }

    // Handle new file uploads
    const newFileEntries = formData.getAll("files");
    if (newFileEntries.length > 0) {
      const newFiles = [];
      
      for (const file of newFileEntries) {
        if (file && file.size > 0) {
          // Validate file type
          const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
            'image/webp', 'image/bmp', 'image/svg+xml',
            'video/mp4', 'video/mpeg', 'video/avi', 'video/mov',
            'video/wmv', 'video/flv', 'video/webm', 'video/mkv'
          ];
          
          if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
              { 
                success: false, 
                error: `Invalid file type: ${file.type}. Allowed: images and videos`,
                authenticated: true
              },
              { status: 400 }
            );
          }

          // Validate file size (max 10MB)
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (file.size > maxSize) {
            return NextResponse.json(
              { 
                success: false, 
                error: `File ${file.name} is too large. Max size is 10MB`,
                authenticated: true
              },
              { status: 400 }
            );
          }

          const result = await uploadFileToCloudinary(file);
          if (result) {
            newFiles.push(result.secure_url);
          }
        }
      }
      
      // Add new files to the updated files array
      updatedFiles = [...updatedFiles, ...newFiles];
    }

    // Check if we have at least one file remaining
    if (updatedFiles.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Gallery must contain at least one file",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Update gallery with audit trail
    const updatedGallery = await prisma.galleryImage.update({
      where: { id: parseInt(id) },
      data: { 
        title, 
        description, 
        category,
        files: updatedFiles,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Gallery updated by ${auth.user.name}: ${updatedGallery.title}`);

    return NextResponse.json({ 
      success: true, 
      gallery: updatedGallery,
      message: `Gallery updated successfully. ${filesToRemove.length} files removed, ${newFileEntries.length} files added.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ PUT Gallery Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Gallery not found",
          authenticated: true
        },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          error: "A gallery with similar data already exists",
          authenticated: true
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to update gallery",
        authenticated: true
      }, 
      { status: 500 }
    );
  }
}

// 🔹 DELETE gallery (PROTECTED - authentication required)
export async function DELETE(req, { params }) {
  try {
    // Authenticate the request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`🗑️ Gallery delete request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Valid gallery ID is required",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Find gallery to get file URLs for cleanup
    const gallery = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id) }
    });

    if (!gallery) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Gallery not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    // Delete files from Cloudinary
    if (Array.isArray(gallery.files) && gallery.files.length > 0) {
      console.log(`🗑️ Deleting ${gallery.files.length} files from Cloudinary...`);
      await deleteFilesFromCloudinary(gallery.files);
    }

    // Delete from database
    await prisma.galleryImage.delete({ 
      where: { id: parseInt(id) } 
    });

    console.log(`✅ Gallery deleted by ${auth.user.name}: ${gallery.title}`);

    return NextResponse.json({ 
      success: true, 
      message: "Gallery deleted successfully",
      deletedGallery: gallery.title,
      deletedFilesCount: Array.isArray(gallery.files) ? gallery.files.length : 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ DELETE Gallery Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Gallery not found",
          authenticated: true
        },
        { status: 404 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Cannot delete gallery because it is referenced in other records",
          authenticated: true
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to delete gallery",
        authenticated: true
      }, 
      { status: 500 }
    );
  }
}