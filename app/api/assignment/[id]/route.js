import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

// ==================== TOKEN VERIFICATION ====================
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
            message: 'User does not have permission to manage assignments' 
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

// ==================== CLOUDINARY HELPERS (FIXED FOR EXTENSIONS) ====================
const uploadFileToCloudinary = async (file, folder = "files") => {
  if (!file?.name || file.size === 0) return null;

  try {
    // Get file extension properly
    const originalName = file.name;
    const fileExtension = '.' + originalName.split('.').pop().toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    
    // FIXED: Keep the extension in the filename
    const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Determine resource type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    const isPDF = fileExtension === '.pdf';
    const isDocument = ['.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx', '.csv'].includes(fileExtension);
    const isAudio = file.type.startsWith('audio/');
    
    const resourceType = isVideo ? "video" : isImage ? "image" : "raw";
    
    return await new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: resourceType,
        folder: `school/assignments/${folder}`, // FIXED: Changed to school/assignments/files
        public_id: `${timestamp}-${sanitizedFileName}`, // FIXED: Includes extension
        overwrite: false,
        // REMOVED: format parameter - let Cloudinary auto-detect from filename
      };

      // Add transformations for images only
      if (isImage) {
        uploadOptions.transformation = [
          { width: 1200, crop: "scale" },
          { quality: "auto:good" }
        ];
      } else if (isVideo) {
        uploadOptions.transformation = [
          { width: 1280, crop: "scale" },
          { quality: "auto" }
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

            console.log('✅ Assignment file uploaded (with extension):', {
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
    return null;
  }
};

const uploadMultipleFilesToCloudinary = async (files, folder = "files") => {
  if (!files || files.length === 0) return [];
  
  const uploadedFiles = [];
  for (const file of files) {
    if (file && file.name && file.size > 0) {
      try {
        const uploadedFile = await uploadFileToCloudinary(file, folder);
        if (uploadedFile) {
          uploadedFiles.push(uploadedFile);
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      }
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

const deleteFilesFromCloudinary = async (fileUrls) => {
  if (!Array.isArray(fileUrls) && !fileUrls) return;

  try {
    const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
    
    const deletePromises = urls.map(async (fileUrl) => {
      if (!fileUrl?.includes('cloudinary.com')) return;
      await deleteFileFromCloudinary(fileUrl);
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.warn("⚠️ Could not delete files from Cloudinary:", error.message);
  }
};

// FIXED: Get file info from URL - updated regex to handle new folder structure
const getFileInfoFromUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Extract the public ID and reconstruct filename
    const pathParts = pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // Get the public ID (timestamp-filename.extension)
    const publicIdMatch = lastPart.match(/^(\d+)-(.*)$/);
    let fileName = lastPart;
    let extension = '';
    
    if (publicIdMatch) {
      const timestamp = publicIdMatch[1];
      const nameWithExt = publicIdMatch[2];
      
      // Find the extension
      const extensionMatch = nameWithExt.match(/\.([a-zA-Z0-9]+)$/);
      if (extensionMatch) {
        extension = '.' + extensionMatch[1].toLowerCase();
        fileName = nameWithExt.replace(/^\d+-/, ''); // Remove timestamp prefix
      } else {
        // If no extension in URL, check format from Cloudinary response
        if (url.includes('.pdf')) extension = '.pdf';
        else if (url.includes('.docx')) extension = '.docx';
        else if (url.includes('.doc')) extension = '.doc';
        else if (url.includes('.jpg') || url.includes('.jpeg')) extension = '.jpg';
        else if (url.includes('.png')) extension = '.png';
        else if (url.includes('.gif')) extension = '.gif';
        else if (url.includes('.mp4')) extension = '.mp4';
        else if (url.includes('.mp3')) extension = '.mp3';
        else if (url.includes('.txt')) extension = '.txt';
        else if (url.includes('.xlsx')) extension = '.xlsx';
        else if (url.includes('.csv')) extension = '.csv';
      }
    } else {
      // Fallback: extract extension from URL
      const extensionMatch = lastPart.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
      if (extensionMatch) {
        extension = '.' + extensionMatch[1].toLowerCase();
        fileName = lastPart;
      }
    }
    
    // Decode URI component to get original filename
    fileName = decodeURIComponent(fileName);
    
    // Determine file type from extension
    const getFileTypeFromExtension = (ext) => {
      const typeMap = {
        '.pdf': 'PDF Document',
        '.doc': 'Word Document',
        '.docx': 'Word Document',
        '.txt': 'Text File',
        '.jpg': 'Image',
        '.jpeg': 'Image',
        '.png': 'Image',
        '.gif': 'Image',
        '.webp': 'Image',
        '.mp4': 'Video',
        '.mov': 'Video',
        '.avi': 'Video',
        '.wmv': 'Video',
        '.mp3': 'Audio',
        '.wav': 'Audio',
        '.xls': 'Excel Spreadsheet',
        '.xlsx': 'Excel Spreadsheet',
        '.ppt': 'Presentation',
        '.pptx': 'Presentation',
        '.zip': 'Archive',
        '.rar': 'Archive',
        '.csv': 'CSV File'
      };
      
      return typeMap[ext] || 'Document';
    };

    const fileType = getFileTypeFromExtension(extension);
    
    return {
      url,
      name: fileName,
      fileName: fileName,
      extension: extension,
      fileType: fileType,
      storageType: 'cloudinary'
    };
  } catch (error) {
    console.error("Error parsing URL:", url, error);
    return {
      url,
      name: 'download',
      fileName: 'download',
      extension: '',
      fileType: 'File',
      storageType: 'cloudinary'
    };
  }
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// FIXED: Clean assignment response with formatted files
const cleanAssignmentResponse = (assignment) => {
  if (!assignment) return null;
  
  const assignmentFileAttachments = (assignment.assignmentFiles || []).map((url) => {
    const fileInfo = getFileInfoFromUrl(url);
    if (fileInfo) {
      return {
        ...fileInfo,
        formattedSize: formatFileSize(0) // Size not available from URL alone
      };
    }
    return null;
  }).filter(Boolean);
  
  const attachmentAttachments = (assignment.attachments || []).map((url) => {
    const fileInfo = getFileInfoFromUrl(url);
    if (fileInfo) {
      return {
        ...fileInfo,
        formattedSize: formatFileSize(0) // Size not available from URL alone
      };
    }
    return null;
  }).filter(Boolean);
  
  return {
    ...assignment,
    assignmentFileAttachments,
    attachmentAttachments
  };
};

// ==================== API ENDPOINTS ====================

// GET - Get single assignment by ID (PUBLIC)
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const assignmentId = parseInt(id);
    
    if (isNaN(assignmentId)) {
      return NextResponse.json(
        { success: false, error: "Valid assignment ID is required" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.findUnique({ 
      where: { id: assignmentId } 
    });
    
    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      assignment: cleanAssignmentResponse(assignment) 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Single Assignment Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assignment" }, 
      { status: 500 }
    );
  }
}

// PUT - Update an assignment (PROTECTED)
export async function PUT(request, { params }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("✏️ PUT /api/assignments/[id] - Updating assignment");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    const assignmentId = parseInt(id);
    
    if (isNaN(assignmentId)) {
      return NextResponse.json(
        { success: false, error: "Valid assignment ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    console.log('📥 PUT Update - Received form fields:', Array.from(formData.keys()));

    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Extract form fields
    const title = formData.get("title")?.toString().trim() || existingAssignment.title;
    const subject = formData.get("subject")?.toString().trim() || existingAssignment.subject;
    const className = formData.get("className")?.toString().trim() || existingAssignment.className;
    const teacher = formData.get("teacher")?.toString().trim() || existingAssignment.teacher;
    const dueDate = formData.get("dueDate")?.toString() || existingAssignment.dueDate;
    const status = formData.get("status")?.toString() || existingAssignment.status;
    const description = formData.get("description")?.toString().trim() || existingAssignment.description;
    const instructions = formData.get("instructions")?.toString().trim() || existingAssignment.instructions;
    const priority = formData.get("priority")?.toString() || existingAssignment.priority;
    const estimatedTime = formData.get("estimatedTime")?.toString().trim() || existingAssignment.estimatedTime;
    const additionalWork = formData.get("additionalWork")?.toString().trim() || existingAssignment.additionalWork;
    const teacherRemarks = formData.get("teacherRemarks")?.toString().trim() || existingAssignment.teacherRemarks;
    const learningObjectives = formData.get("learningObjectives")?.toString();
    const dateAssigned = formData.get("dateAssigned")?.toString() || existingAssignment.dateAssigned;
    
    console.log('📝 Fields extracted:', { title, subject, className, teacher, dueDate });

    let updatedAssignmentFiles = [...existingAssignment.assignmentFiles];
    let updatedAttachments = [...existingAssignment.attachments];
    
    const existingAssignmentFilesStr = formData.get("existingAssignmentFiles");
    const existingAttachmentsStr = formData.get("existingAttachments");
    
    console.log('📁 File data:', {
      existingAssignmentFilesStr: existingAssignmentFilesStr?.substring(0, 100),
      existingAttachmentsStr: existingAttachmentsStr?.substring(0, 100)
    });
    
    if (existingAssignmentFilesStr) {
      try {
        const existingFiles = JSON.parse(existingAssignmentFilesStr);
        updatedAssignmentFiles = existingFiles.filter(file => typeof file === 'string' && file.trim() !== '');
        console.log('✅ Parsed existing assignment files:', updatedAssignmentFiles.length);
      } catch (error) {
        console.error('❌ Error parsing existingAssignmentFiles:', error);
      }
    }
    
    if (existingAttachmentsStr) {
      try {
        const existingFiles = JSON.parse(existingAttachmentsStr);
        updatedAttachments = existingFiles.filter(file => typeof file === 'string' && file.trim() !== '');
        console.log('✅ Parsed existing attachments:', updatedAttachments.length);
      } catch (error) {
        console.error('❌ Error parsing existingAttachments:', error);
      }
    }
    
    const assignmentFilesToRemoveStr = formData.get("assignmentFilesToRemove");
    const attachmentsToRemoveStr = formData.get("attachmentsToRemove");
    
    console.log('🗑️ Files to remove:', {
      assignmentFilesToRemoveStr: assignmentFilesToRemoveStr?.substring(0, 100),
      attachmentsToRemoveStr: attachmentsToRemoveStr?.substring(0, 100)
    });
    
    if (assignmentFilesToRemoveStr) {
      try {
        const filesToRemove = JSON.parse(assignmentFilesToRemoveStr);
        if (Array.isArray(filesToRemove) && filesToRemove.length > 0) {
          await deleteFilesFromCloudinary(filesToRemove);
          updatedAssignmentFiles = updatedAssignmentFiles.filter(file => !filesToRemove.includes(file));
          console.log('✅ Removed assignment files from Cloudinary:', filesToRemove.length);
        }
      } catch (error) {
        console.error('❌ Error parsing assignmentFilesToRemove:', error);
      }
    }
    
    if (attachmentsToRemoveStr) {
      try {
        const filesToRemove = JSON.parse(attachmentsToRemoveStr);
        if (Array.isArray(filesToRemove) && filesToRemove.length > 0) {
          await deleteFilesFromCloudinary(filesToRemove);
          updatedAttachments = updatedAttachments.filter(file => !filesToRemove.includes(file));
          console.log('✅ Removed attachments from Cloudinary:', filesToRemove.length);
        }
      } catch (error) {
        console.error('❌ Error parsing attachmentsToRemove:', error);
      }
    }
    
    const newAssignmentFiles = formData.getAll("assignmentFiles");
    const newAttachments = formData.getAll("attachments");
    
    console.log('📤 New files to upload:', {
      newAssignmentFiles: newAssignmentFiles.length,
      newAttachments: newAttachments.length
    });
    
    if (newAssignmentFiles.length > 0 && newAssignmentFiles[0].name) {
      try {
        const uploadedFiles = await uploadMultipleFilesToCloudinary(newAssignmentFiles, "assignment-files");
        const newUrls = uploadedFiles.map(f => f.url).filter(url => url);
        updatedAssignmentFiles = [...updatedAssignmentFiles, ...newUrls];
        console.log('✅ Added new assignment files (with extensions):', newUrls.length);
        
        // Log new file URLs
        uploadedFiles.forEach((file, index) => {
          console.log(`  New file ${index + 1}: ${file.url} - Extension: ${file.extension}`);
        });
      } catch (error) {
        console.error('❌ Error uploading new assignment files:', error);
      }
    }
    
    if (newAttachments.length > 0 && newAttachments[0].name) {
      try {
        const uploadedFiles = await uploadMultipleFilesToCloudinary(newAttachments, "attachments");
        const newUrls = uploadedFiles.map(f => f.url).filter(url => url);
        updatedAttachments = [...updatedAttachments, ...newUrls];
        console.log('✅ Added new attachments (with extensions):', newUrls.length);
      } catch (error) {
        console.error('❌ Error uploading new attachments:', error);
      }
    }
    
    let learningObjectivesArray = existingAssignment.learningObjectives;
    if (learningObjectives) {
      try {
        learningObjectivesArray = JSON.parse(learningObjectives);
        console.log('✅ Parsed learning objectives:', learningObjectivesArray?.length || 0);
      } catch (error) {
        console.error('❌ Error parsing learning objectives:', error);
      }
    }
    
    console.log('💾 Saving to database...');
    console.log('📊 Final file counts:', {
      assignmentFiles: updatedAssignmentFiles.length,
      attachments: updatedAttachments.length
    });
    
    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: { 
        title,
        subject,
        className,
        teacher,
        dueDate: dueDate ? new Date(dueDate) : existingAssignment.dueDate,
        dateAssigned: dateAssigned ? new Date(dateAssigned) : existingAssignment.dateAssigned, // FIX: Added dateAssigned
        status,
        description,
        instructions,
        priority,
        estimatedTime,
        additionalWork,
        teacherRemarks,
        assignmentFiles: updatedAssignmentFiles,
        attachments: updatedAttachments,
        learningObjectives: learningObjectivesArray,
        updatedAt: new Date()
      },
    });

    console.log('✅ Update successful:', updatedAssignment.id);
    
    return NextResponse.json({ 
      success: true, 
      assignment: cleanAssignmentResponse(updatedAssignment),
      message: "Assignment updated successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT Assignment Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update assignment" }, 
      { status: 500 }
    );
  }
}

// DELETE - Delete an assignment (PROTECTED)
export async function DELETE(request, { params }) {
  try {
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("🗑️ DELETE /api/assignments/[id] - Deleting assignment");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    const assignmentId = parseInt(id);
    
    if (isNaN(assignmentId)) {
      return NextResponse.json(
        { success: false, error: "Valid assignment ID is required" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    const allFiles = [
      ...(assignment.assignmentFiles || []),
      ...(assignment.attachments || [])
    ];
    
    if (allFiles.length > 0) {
      console.log(`🗑️ Deleting ${allFiles.length} files from Cloudinary...`);
      await deleteFilesFromCloudinary(allFiles);
      console.log(`✅ Deleted ${allFiles.length} files from Cloudinary`);
    }

    await prisma.assignment.delete({ 
      where: { id: assignmentId } 
    });

    console.log(`✅ Assignment deleted: ${assignment.title} (ID: ${assignmentId})`);

    return NextResponse.json({ 
      success: true, 
      message: "Assignment deleted successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Assignment Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete assignment" }, 
      { status: 500 }
    );
  }
}