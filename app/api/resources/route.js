import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";

// ==================== AUTHENTICATION ====================
class DeviceTokenManager {
  static validateTokensFromHeaders(headers) {
    try {
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token error: ${deviceValid.error || 'Invalid token'}`
        };
      }

      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp && adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        const userRole = adminPayload.role || adminPayload.userRole || '';
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'TEACHER', 'teacher'];
        
        if (!validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage resources' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Authentication successful for user:', adminPayload.name || 'Unknown');
      
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

  static validateDeviceToken(token) {
    try {
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
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

const authenticateRequest = (req) => {
  const headers = req.headers;
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: validationResult.message,
          details: validationResult.reason
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

// ==================== CLOUDINARY HELPERS ====================
// FIXED: UPDATED to work EXACTLY like school-documents API
const uploadFileToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const originalName = file.name;
    const fileExtension = '.' + originalName.split('.').pop().toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    
    // FIX: Keep the extension in the filename like school-documents API
    const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Determine resource type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    const isPDF = fileExtension === '.pdf';
    const isDocument = ['.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx', '.csv'].includes(fileExtension);
    const isAudio = file.type.startsWith('audio/');
    
    // Set resource type (raw for documents, pdf, etc.)
    const resourceType = isVideo ? "video" : isImage ? "image" : "raw";
    
    return await new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: resourceType,
        folder: "school/resources/files", // FIXED: Match school-documents folder structure
        public_id: `${timestamp}-${sanitizedFileName}`, // FIXED: This now includes extension
        overwrite: false,
        // REMOVED: format parameter - let Cloudinary auto-detect from filename
      };

      // Add transformations for images only
      if (isImage) {
        uploadOptions.transformation = [
          { width: 1200, crop: "scale" },
          { quality: "auto:good" }
        ];
      }

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error details:", error);
            reject(error);
          } else {
            // Determine file type for display
            let fileType = 'document';
            if (isImage) fileType = 'image';
            else if (isVideo) fileType = 'video';
            else if (isPDF) fileType = 'pdf';
            else if (isDocument) fileType = 'document';
            else if (isAudio) fileType = 'audio';

            console.log('✅ Upload successful (like school-documents):', {
              url: result.secure_url,
              format: result.format,
              publicId: result.public_id,
              originalName,
              hasExtension: result.secure_url.includes(fileExtension)
            });

            resolve({
              url: result.secure_url,
              name: originalName,
              size: file.size,
              extension: fileExtension,
              uploadedAt: new Date().toISOString(),
              fileType: fileType,
              storageType: 'cloudinary',
              publicId: result.public_id,
              format: result.format,
              resourceType: result.resource_type
            });
          }
        }
      );
      stream.end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

const uploadMultipleFilesToCloudinary = async (files) => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = files.map(file => uploadFileToCloudinary(file));
  const results = await Promise.allSettled(uploadPromises);
  
  const uploadedFiles = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      uploadedFiles.push(result.value);
    } else {
      console.error(`Failed to upload file ${files[index]?.name}:`, result.reason);
    }
  });
  
  return uploadedFiles;
};

// FIXED: Delete function updated for new folder structure
const deleteFileFromCloudinary = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // Extract public ID from URL - updated for new folder structure
    const urlMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)/);
    if (!urlMatch) {
      console.warn(`Could not extract public ID from URL: ${fileUrl}`);
      return;
    }
    
    const publicId = urlMatch[1];
    const isVideo = fileUrl.includes('/video/') || 
                   fileUrl.match(/\.(mp4|mpeg|avi|mov|wmv|flv|webm|mkv)$/i);
    const isRaw = fileUrl.includes('/raw/') || 
                 fileUrl.match(/\.(pdf|doc|docx|txt|ppt|pptx|xls|xlsx|csv)$/i);
    const isImage = fileUrl.includes('/image/') || 
                   fileUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);
    
    const resourceType = isVideo ? "video" : isRaw ? "raw" : isImage ? "image" : "raw";
    
    console.log(`Deleting from Cloudinary: ${publicId} (${resourceType})`);
    
    await cloudinary.uploader.destroy(publicId, { 
      resource_type: resourceType 
    });
    
    console.log(`✅ Deleted from Cloudinary: ${fileUrl}`);
  } catch (error) {
    console.warn("⚠️ Could not delete Cloudinary file:", error.message);
  }
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileType = (fileName) => {
  if (!fileName) return "document";
  
  const ext = fileName.split('.').pop().toLowerCase();
  const typeMap = {
    pdf: "pdf",
    doc: "document", docx: "document", txt: "document",
    ppt: "presentation", pptx: "presentation",
    xls: "spreadsheet", xlsx: "spreadsheet", csv: "spreadsheet",
    jpg: "image", jpeg: "image", png: "image", gif: "image", webp: "image",
    mp4: "video", mov: "video", avi: "video", mkv: "video",
    mp3: "audio", wav: "audio", m4a: "audio",
    zip: "archive", rar: "archive",
  };

  return typeMap[ext] || "document";
};

const determineMainTypeFromFiles = (files) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return "document";
  }

  const typeCount = {};
  files.forEach(file => {
    const type = file.fileType || getFileType(file.name);
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  return Object.keys(typeCount).reduce((a, b) => typeCount[a] > typeCount[b] ? a : b);
};

// FIXED: Clean response to match school-documents structure
const cleanResourceResponse = (resource) => {
  if (!resource) return null;
  
  return {
    id: resource.id,
    title: resource.title,
    subject: resource.subject,
    teacher: resource.teacher,
    className: resource.className,
    description: resource.description,
    category: resource.category,
    type: resource.type,
    files: (resource.files || []).map(file => ({
      url: file.url,
      name: file.name,
      size: file.size,
      extension: file.extension || '.' + file.name.split('.').pop().toLowerCase(),
      fileType: file.fileType || getFileType(file.name),
      uploadedAt: file.uploadedAt,
      formattedSize: formatFileSize(file.size || 0),
      publicId: file.publicId,
      format: file.format
    })),
    accessLevel: resource.accessLevel,
    uploadedBy: resource.uploadedBy,
    downloads: resource.downloads,
    isActive: resource.isActive,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt
  };
};

// ==================== API ENDPOINTS ====================

// GET - Fetch all resources (PUBLIC)
export async function GET() {
  try {
    console.log("📥 GET /api/resources");
    
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });

    const formattedResources = resources.map(cleanResourceResponse);

    return NextResponse.json({ 
      success: true, 
      resources: formattedResources, 
      count: formattedResources.length 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch resources",
      message: error.message 
    }, { status: 500 });
  }
}

// POST - Create resource (PROTECTED)
export async function POST(request) {
  try {
    // Authenticate
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("📝 POST /api/resources - Creating resource");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);

    const formData = await request.formData();

    // Get form fields
    const title = formData.get("title")?.trim() || "";
    const subject = formData.get("subject")?.trim() || "";
    const teacher = formData.get("teacher")?.trim() || "";
    const className = formData.get("className")?.trim() || "";
    const description = formData.get("description")?.trim() || "";
    const category = formData.get("category")?.trim() || "general";
    const accessLevel = formData.get("accessLevel")?.trim() || "student";
    const uploadedBy = formData.get("uploadedBy")?.trim() || auth.user.name;

    // Validate required fields
    if (!title || !subject || !teacher || !className) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Title, subject, teacher, and class name are required" 
        },
        { status: 400 }
      );
    }

    // Get and validate files
    const files = formData.getAll("files");
    const validFiles = Array.from(files).filter(file => file?.name && file.size > 0);
    
    if (validFiles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "At least one file is required" 
      }, { status: 400 });
    }

    // Upload files to Cloudinary
    console.log(`📤 Uploading ${validFiles.length} file(s) to Cloudinary...`);
    const uploadedFiles = await uploadMultipleFilesToCloudinary(validFiles);
    
    if (uploadedFiles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to upload files to Cloudinary" 
      }, { status: 500 });
    }

    console.log(`✅ Successfully uploaded ${uploadedFiles.length} file(s)`);
    
    // Log uploaded file details
    uploadedFiles.forEach((file, index) => {
      console.log(`File ${index + 1}:`, {
        name: file.name,
        url: file.url,
        extension: file.extension,
        size: file.size,
        hasExtension: file.url.includes(file.extension)
      });
    });

    // Determine main type
    const mainType = determineMainTypeFromFiles(uploadedFiles);

    // Create resource in database
    const resource = await prisma.resource.create({
      data: {
        title,
        subject,
        teacher,
        className,
        description,
        category,
        type: mainType,
        files: uploadedFiles,
        accessLevel,
        uploadedBy,
        downloads: 0,
        isActive: true,
      },
    });

    console.log(`✅ Resource created with ID: ${resource.id}`);

    return NextResponse.json(
      { 
        success: true, 
        message: `Resource created with ${uploadedFiles.length} file(s)`, 
        resource: cleanResourceResponse(resource)
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create resource",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}