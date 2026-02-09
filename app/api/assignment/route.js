import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";

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
    const originalName = file.name;
    const fileExtension = '.' + originalName.split('.').pop().toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    
    // FIXED: Keep the extension in the filename (like school-documents API)
    const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Determine resource type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    const isPDF = fileExtension === '.pdf';
    const isDocument = ['.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx', '.csv'].includes(fileExtension);
    
    const resourceType = isVideo ? "video" : isImage ? "image" : "raw";
    
    return await new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: resourceType,
        folder: `school/assignments/${folder}`, // FIXED: Changed to school/assignments/files like school-documents
        public_id: `${timestamp}-${sanitizedFileName}`, // FIXED: Includes extension
        overwrite: false,
        // REMOVED: format parameter - let Cloudinary auto-detect from filename
      };

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
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            let fileType = 'document';
            if (isImage) fileType = 'image';
            else if (isVideo) fileType = 'video';
            else if (isPDF) fileType = 'pdf';
            else if (isDocument) fileType = 'document';

            console.log('✅ Assignment file uploaded (with extension):', {
              url: result.secure_url,
              extension: fileExtension,
              hasExtension: result.secure_url.includes(fileExtension),
              publicId: result.public_id
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

const deleteFileFromCloudinary = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // Extract full public ID including extension (FIXED for new folder structure)
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
    
    const resourceType = isVideo ? "video" : isRaw ? "raw" : "image";
    
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`✅ Deleted from Cloudinary: ${publicId}`);
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

// FIXED: Get file info from URL with proper extension extraction
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

// FIXED: Clean assignment response with properly formatted files
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

// GET - Fetch all assignments (PUBLIC)
export async function GET(request) {
  try {
    console.log("📥 GET /api/assignments");
    
    // Optional query parameters for filtering
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const className = searchParams.get('className');
    const teacher = searchParams.get('teacher');
    const status = searchParams.get('status');
    
    const whereClause = {};
    if (subject) whereClause.subject = { contains: subject, mode: 'insensitive' };
    if (className) whereClause.className = { contains: className, mode: 'insensitive' };
    if (teacher) whereClause.teacher = { contains: teacher, mode: 'insensitive' };
    if (status) whereClause.status = status;
    
    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    const formattedAssignments = assignments.map(cleanAssignmentResponse);

    return NextResponse.json({ 
      success: true, 
      assignments: formattedAssignments, 
      count: formattedAssignments.length 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ GET Assignments Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch assignments",
      message: error.message 
    }, { status: 500 });
  }
}

// POST - Create assignment (PROTECTED)
// POST - Create assignment (PROTECTED)
export async function POST(request) {
  try {
    // Authenticate
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("📝 POST /api/assignments - Creating assignment");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);

    const formData = await request.formData();

    // Get form fields
    const title = formData.get("title")?.toString().trim() || "";
    const subject = formData.get("subject")?.toString().trim() || "";
    const className = formData.get("className")?.toString().trim() || "";
    const teacher = formData.get("teacher")?.toString().trim() || auth.user.name;
    const dueDate = formData.get("dueDate")?.toString();
    const status = formData.get("status")?.toString() || "pending";
    const description = formData.get("description")?.toString().trim() || "";
    const instructions = formData.get("instructions")?.toString().trim() || "";
    const priority = formData.get("priority")?.toString() || "medium";
    const estimatedTime = formData.get("estimatedTime")?.toString().trim() || "";
    const additionalWork = formData.get("additionalWork")?.toString().trim() || "";
    const teacherRemarks = formData.get("teacherRemarks")?.toString().trim() || "";
    const learningObjectives = formData.get("learningObjectives")?.toString();

    // Validate required fields
    if (!title || !subject || !className || !teacher) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Title, subject, class name, and teacher are required" 
        },
        { status: 400 }
      );
    }

    // Parse learning objectives
    let learningObjectivesArray = [];
    if (learningObjectives) {
      try {
        learningObjectivesArray = JSON.parse(learningObjectives);
      } catch (error) {
        console.error('Error parsing learning objectives:', error);
      }
    }

    // Upload files to Cloudinary (NOW WITH EXTENSIONS)
    const newAssignmentFiles = formData.getAll("assignmentFiles");
    const newAttachments = formData.getAll("attachments");
    
    let assignmentFiles = [];
    let attachments = [];
    
    if (newAssignmentFiles.length > 0 && newAssignmentFiles[0].name) {
      try {
        const uploadedFiles = await uploadMultipleFilesToCloudinary(newAssignmentFiles, "assignment-files");
        assignmentFiles = uploadedFiles.map(f => f.url).filter(url => url);
        console.log('✅ Uploaded assignment files (with extensions):', assignmentFiles.length);
        
        // Log file URLs to verify extensions
        uploadedFiles.forEach((file, index) => {
          console.log(`  File ${index + 1}: ${file.url} - Extension: ${file.extension}`);
        });
      } catch (error) {
        console.error('❌ Error uploading assignment files:', error);
      }
    }
    
    if (newAttachments.length > 0 && newAttachments[0].name) {
      try {
        const uploadedFiles = await uploadMultipleFilesToCloudinary(newAttachments, "attachments");
        attachments = uploadedFiles.map(f => f.url).filter(url => url);
        console.log('✅ Uploaded attachments (with extensions):', attachments.length);
      } catch (error) {
        console.error('❌ Error uploading attachments:', error);
      }
    }

    // FIX: Create assignment with dateAssigned field
    const assignment = await prisma.assignment.create({
      data: {
        title,
        subject,
        className,
        teacher,
        dueDate: dueDate ? new Date(dueDate) : null,
        dateAssigned: new Date(), // FIX: Added required field
        status,
        description,
        instructions,
        priority,
        estimatedTime,
        additionalWork,
        teacherRemarks,
        assignmentFiles,
        attachments,
        learningObjectives: learningObjectivesArray,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });

    console.log(`✅ Assignment created with ID: ${assignment.id}`);

    return NextResponse.json(
      { 
        success: true, 
        message: `Assignment created successfully`, 
        assignment: cleanAssignmentResponse(assignment)
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ POST Assignment Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create assignment",
      message: error.message
    }, { status: 500 });
  }
}