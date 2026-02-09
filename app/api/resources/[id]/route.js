import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

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
// FIXED: Works EXACTLY like school-documents API
const uploadFileToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const originalName = file.name;
    const fileExtension = '.' + originalName.split('.').pop().toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    
    // FIXED: Keep extension in filename
    const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Determine resource type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    const isPDF = fileExtension === '.pdf';
    const isDocument = ['.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx', '.csv'].includes(fileExtension);
    
    // Set resource type
    const resourceType = isVideo ? "video" : isImage ? "image" : "raw";
    
    return await new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: resourceType,
        folder: "school/resources/files", // FIXED: Match school-documents structure
        public_id: `${timestamp}-${sanitizedFileName}`, // FIXED: Includes extension
        overwrite: false,
        // REMOVED: format parameter - let Cloudinary auto-detect
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
          if (error) reject(error);
          else {
            let fileType = 'document';
            if (isImage) fileType = 'image';
            else if (isVideo) fileType = 'video';
            else if (isPDF) fileType = 'pdf';
            else if (isDocument) fileType = 'document';

            console.log('✅ Upload successful (like school-documents):', {
              url: result.secure_url,
              extension: fileExtension,
              format: result.format,
              hasExtension: result.secure_url.includes(fileExtension)
            });

            resolve({
              url: result.secure_url,
              name: originalName,
              size: file.size,
              extension: fileExtension,
              uploadedAt: new Date().toISOString(),
              fileType: fileType,
              publicId: result.public_id,
              format: result.format
            });
          }
        }
      );
      stream.end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

const uploadMultipleFilesToCloudinary = async (files) => {
  if (!files || files.length === 0) return [];
  
  const uploadedFiles = [];
  for (const file of files) {
    if (!file.name || file.size === 0) continue;
    
    const result = await uploadFileToCloudinary(file);
    if (result) {
      uploadedFiles.push(result);
    }
  }
  
  return uploadedFiles;
};

// FIXED: Delete function for new folder structure
const deleteFileFromCloudinary = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // Extract full public ID including extension
    const urlMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)/);
    if (!urlMatch) return;
    
    const publicId = urlMatch[1];
    const isVideo = fileUrl.includes('/video/') || 
                   fileUrl.match(/\.(mp4|mpeg|avi|mov|wmv|flv|webm|mkv)$/i);
    const isRaw = fileUrl.includes('/raw/') || 
                 fileUrl.match(/\.(pdf|doc|docx|txt|ppt|pptx|xls|xlsx|csv)$/i);
    const isImage = fileUrl.includes('/image/') || 
                   fileUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);
    
    const resourceType = isVideo ? "video" : isRaw ? "raw" : isImage ? "image" : "raw";
    
    await cloudinary.uploader.destroy(publicId, { 
      resource_type: resourceType,
      invalidate: true
    });
    
    console.log(`✅ Deleted from Cloudinary: ${publicId}`);
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
      formattedSize: formatFileSize(file.size || 0)
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

// GET - Get single resource by ID (PUBLIC)
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const resourceId = parseInt(id);
    
    if (isNaN(resourceId)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid resource ID" 
      }, { status: 400 });
    }

    const resource = await prisma.resource.findUnique({ 
      where: { id: resourceId } 
    });
    
    if (!resource) {
      return NextResponse.json({ 
        success: false, 
        error: "Resource not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      resource: cleanResourceResponse(resource) 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching resource:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT - Update a resource (PROTECTED)
export async function PUT(request, { params }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("✏️ PUT /api/resources/[id] - Updating resource");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    const resourceId = parseInt(id);
    
    if (isNaN(resourceId)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid resource ID" 
      }, { status: 400 });
    }

    const existingResource = await prisma.resource.findUnique({ 
      where: { id: resourceId } 
    });
    
    if (!existingResource) {
      return NextResponse.json({ 
        success: false, 
        error: "Resource not found" 
      }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      return await handleFormUpdate(request, resourceId, existingResource);
    } else {
      return await handleJsonUpdate(request, resourceId);
    }
  } catch (error) {
    console.error("❌ Error updating resource:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

async function handleJsonUpdate(request, id) {
  try {
    const body = await request.json();
    const { id: _, createdAt, downloads, files, ...updateData } = body;

    const resource = await prisma.resource.update({
      where: { id: id },
      data: { 
        ...updateData, 
        updatedAt: new Date() 
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Resource updated successfully", 
      resource: cleanResourceResponse(resource)
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in JSON update:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

async function handleFormUpdate(request, id, existingResource) {
  try {
    const formData = await request.formData();

    const title = formData.get("title")?.trim();
    const subject = formData.get("subject")?.trim();
    const teacher = formData.get("teacher")?.trim();
    const className = formData.get("className")?.trim();
    const description = formData.get("description")?.trim();
    const category = formData.get("category")?.trim();
    const accessLevel = formData.get("accessLevel")?.trim();
    const uploadedBy = formData.get("uploadedBy")?.trim();
    const isActive = formData.get("isActive");

    let updateData = {
      updatedAt: new Date()
    };

    if (title !== null && title !== undefined) updateData.title = title;
    if (subject !== null && subject !== undefined) updateData.subject = subject;
    if (teacher !== null && teacher !== undefined) updateData.teacher = teacher;
    if (className !== null && className !== undefined) updateData.className = className;
    if (description !== null && description !== undefined) updateData.description = description;
    if (category !== null && category !== undefined) updateData.category = category;
    if (accessLevel !== null && accessLevel !== undefined) updateData.accessLevel = accessLevel;
    if (uploadedBy !== null && uploadedBy !== undefined) updateData.uploadedBy = uploadedBy;
    if (isActive !== null && isActive !== undefined) updateData.isActive = isActive === "true";

    // Handle file updates
    const existingFilesStr = formData.get("existingFiles");
    const filesToRemoveStr = formData.get("filesToRemove");
    const newFiles = formData.getAll("files");

    console.log("📁 File Update Details:");
    console.log("- New files:", newFiles.length);

    let finalFiles = [];

    // Parse existing files that should remain
    if (existingFilesStr) {
      try {
        const parsedFiles = JSON.parse(existingFilesStr);
        if (Array.isArray(parsedFiles)) {
          finalFiles = parsedFiles;
          console.log("- Existing files to keep:", parsedFiles.length);
        }
      } catch (error) {
        console.error("❌ Error parsing existingFiles:", error);
      }
    }

    // Parse and remove files marked for deletion
    if (filesToRemoveStr) {
      try {
        const filesToRemove = JSON.parse(filesToRemoveStr);
        if (Array.isArray(filesToRemove)) {
          console.log("- Files to remove:", filesToRemove.length);
          
          // Remove from finalFiles and delete from storage
          finalFiles = finalFiles.filter(file => {
            const shouldRemove = filesToRemove.includes(file.url);
            if (shouldRemove && file.url) {
              deleteFileFromCloudinary(file.url).catch(err => 
                console.warn("⚠️ Could not delete file:", file.url, err.message)
              );
            }
            return !shouldRemove;
          });
        }
      } catch (error) {
        console.error("❌ Error parsing filesToRemove:", error);
      }
    }

    // Upload new files (now with extensions like school-documents)
    if (newFiles.length > 0 && newFiles[0].name) {
      console.log("- Uploading new files with extensions...");
      const uploadedNewFiles = await uploadMultipleFilesToCloudinary(newFiles);
      console.log("- Successfully uploaded:", uploadedNewFiles.length);
      
      // Add new files to finalFiles
      finalFiles = [...finalFiles, ...uploadedNewFiles];
    }

    console.log("- Final file count:", finalFiles.length);
    
    // Update files array in database
    updateData.files = finalFiles;
    
    // Determine file type safely
    if (finalFiles.length > 0) {
      updateData.type = determineMainTypeFromFiles(finalFiles);
      console.log("- Determined type:", updateData.type);
    } else {
      updateData.type = "document";
    }

    console.log("💾 Saving to database...");

    const resource = await prisma.resource.update({
      where: { id: id },
      data: updateData,
    });

    console.log("✅ Update successful");
    console.log("- Updated resource ID:", resource.id);

    return NextResponse.json({ 
      success: true, 
      message: `Resource updated successfully with ${updateData.files?.length || 0} file(s)`, 
      resource: cleanResourceResponse(resource)
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in form update:", error);
    console.error("- Error details:", error.message);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: "Check server logs for more information"
    }, { status: 500 });
  }
}

// DELETE - Delete a resource (PROTECTED)
export async function DELETE(request, { params }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("🗑️ DELETE /api/resources/[id] - Deleting resource");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    const resourceId = parseInt(id);
    
    if (isNaN(resourceId)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid resource ID" 
      }, { status: 400 });
    }

    const resource = await prisma.resource.findUnique({ 
      where: { id: resourceId } 
    });
    
    if (!resource) {
      return NextResponse.json({ 
        success: false, 
        error: "Resource not found" 
      }, { status: 404 });
    }

    // Delete files from Cloudinary (now with proper extension handling)
    if (resource.files && Array.isArray(resource.files)) {
      const fileUrls = resource.files.map(file => file.url).filter(url => url);
      if (fileUrls.length > 0) {
        const deletePromises = fileUrls.map(url => deleteFileFromCloudinary(url));
        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${fileUrls.length} files from Cloudinary`);
      }
    }

    await prisma.resource.delete({ where: { id: resourceId } });

    console.log(`✅ Resource deleted: ${resource.title} (ID: ${resourceId})`);

    return NextResponse.json({ 
      success: true, 
      message: "Resource and all associated files deleted successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting resource:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// PATCH - Increment download count (PROTECTED)
export async function PATCH(request, { params }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("📥 PATCH /api/resources/[id] - Updating download count");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    const resourceId = parseInt(id);
    
    if (isNaN(resourceId)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid resource ID" 
      }, { status: 400 });
    }

    const existingResource = await prisma.resource.findUnique({ 
      where: { id: resourceId } 
    });
    
    if (!existingResource) {
      return NextResponse.json({ 
        success: false, 
        error: "Resource not found" 
      }, { status: 404 });
    }

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: { 
        downloads: { increment: 1 }, 
        updatedAt: new Date() 
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Download count updated", 
      downloads: resource.downloads 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating download count:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}