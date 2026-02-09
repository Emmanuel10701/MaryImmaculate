import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";
import { randomUUID } from "crypto";

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
        
        // Check user role - only authorized users can upload gallery items
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'TEACHER', 'STAFF', 'PHOTOGRAPHER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to upload gallery items' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Gallery upload authentication successful for user:', adminPayload.name || 'Unknown');
      
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
          message: "Authentication required to upload gallery items.",
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
  if (!Array.isArray(fileUrls)) return;

  try {
    const deletePromises = fileUrls.map(async (fileUrl) => {
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

// 🔹 GET all galleries (PUBLIC - no authentication required)
export async function GET() {
  try {
    const galleries = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, galleries });
  } catch (error) {
    console.error("❌ GET Gallery Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}

// 🔹 POST new gallery (PROTECTED - authentication required)
export async function POST(req) {
  try {
    // Authenticate the POST request
    const auth = authenticatePostRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`📸 Gallery upload request from: ${auth.user.name} (${auth.user.role})`);

    const formData = await req.formData();

    let title = formData.get("title")?.toString() || "";
    let description = formData.get("description")?.toString() || "";
    let category = formData.get("category")?.toString() || "";

    // TRIM and validate inputs
    title = title.trim();
    description = description.trim();
    category = category.trim();

    // VALIDATION: Check required fields
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

    // VALIDATION: Check length limits (adjust based on your schema)
    const MAX_TITLE_LENGTH = 200; // Adjust based on your schema
    const MAX_DESCRIPTION_LENGTH = 2000; // Adjust based on your schema
    const MAX_CATEGORY_LENGTH = 50; // Adjust based on your schema

    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Title is too long. Maximum ${MAX_TITLE_LENGTH} characters allowed.`,
          authenticated: true
        },
        { status: 400 }
      );
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      // Option 1: Truncate automatically
      description = description.substring(0, MAX_DESCRIPTION_LENGTH);
      
      // Option 2: Return error (comment out above line and use this)
      /*
      return NextResponse.json(
        { 
          success: false, 
          error: `Description is too long. Maximum ${MAX_DESCRIPTION_LENGTH} characters allowed.`,
          authenticated: true
        },
        { status: 400 }
      );
      */
    }

    if (category.length > MAX_CATEGORY_LENGTH) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Category is too long. Maximum ${MAX_CATEGORY_LENGTH} characters allowed.`,
          authenticated: true
        },
        { status: 400 }
      );
    }

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

    // Handle multiple files (images/videos)
    const files = [];
    const fileEntries = formData.getAll("files");
    
    if (fileEntries.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "At least one file is required",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Upload files to Cloudinary
    for (const file of fileEntries) {
      if (file && file.size > 0) {
        // Validate file type
        const allowedTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
          'image/bmp', 'image/svg+xml',
          'video/mp4', 'video/mpeg', 'video/avi', 'video/mov',
          'video/wmv', 'video/flv', 'video/webm', 'video/mkv'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Invalid file type: ${file.type}`,
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
          files.push(result.secure_url);
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to upload files",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Create gallery entry with audit trail
    const newGallery = await prisma.galleryImage.create({
      data: { 
        title, 
        description: description || null, // Use null if empty string
        category,
        files,
        // Audit trail
       
      },
    });

    console.log(`✅ Gallery uploaded by ${auth.user.name}: ${newGallery.title} (${files.length} files)`);

    return NextResponse.json({ 
      success: true, 
      gallery: newGallery,
      message: "Gallery uploaded successfully",
      filesCount: files.length,
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (error) {
    console.error("❌ POST Gallery Error:", error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2000') {
      return NextResponse.json({ 
        success: false, 
        error: "Input data is too long. Please shorten your description or title.",
        authenticated: true
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to upload gallery",
      authenticated: true
    }, { status: 500 });
  }
}