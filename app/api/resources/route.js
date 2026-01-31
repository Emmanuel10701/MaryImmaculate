import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";

// Helper: Upload file to Cloudinary
const uploadFileToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");
    const extension = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();

    // Determine file type and resource type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    const isPDF = extension === '.pdf';
    const isDocument = ['.doc', '.docx', '.txt'].includes(extension);
    const isSpreadsheet = ['.xls', '.xlsx', '.csv'].includes(extension);
    const isPresentation = ['.ppt', '.pptx'].includes(extension);
    const isArchive = ['.zip', '.rar', '.7z'].includes(extension);
    const isAudio = file.type.startsWith('audio/');
    
    const resourceType = isVideo ? "video" : isImage ? "image" : "raw";
    
    return await new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: resourceType,
        folder: "school_resources/files",
        public_id: `${timestamp}-${sanitizedFileName}`,
        use_filename: false,
        unique_filename: true,
        overwrite: false,
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
          if (error) reject(error);
          else {
            // Determine file type for display
            let fileType = 'document';
            if (isImage) fileType = 'image';
            else if (isVideo) fileType = 'video';
            else if (isPDF) fileType = 'pdf';
            else if (isDocument) fileType = 'document';
            else if (isSpreadsheet) fileType = 'spreadsheet';
            else if (isPresentation) fileType = 'presentation';
            else if (isArchive) fileType = 'archive';
            else if (isAudio) fileType = 'audio';

            resolve({
              url: result.secure_url,
              name: originalName,
              size: file.size,
              extension: extension,
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

// Helper: Upload multiple files to Cloudinary
const uploadMultipleFilesToCloudinary = async (files) => {
  if (!files || files.length === 0) return [];

  const uploadedFiles = [];

  for (const file of files) {
    if (!file.name || file.size === 0) continue;
    
    const result = await uploadFileToCloudinary(file);
    if (result) {
      uploadedFiles.push({
        url: result.url,
        name: result.name,
        size: result.size,
        extension: result.extension,
        uploadedAt: result.uploadedAt,
        fileType: result.fileType
      });
    }
  }

  return uploadedFiles;
};

// Helper: Delete files from Cloudinary
const deleteFileFromCloudinary = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    const urlMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+(?:$|\?)/);
    if (!urlMatch) return;
    
    const publicId = urlMatch[1];
    const isVideo = fileUrl.includes('/video/') || 
                   fileUrl.match(/\.(mp4|mpeg|avi|mov|wmv|flv|webm|mkv)$/i);
    const isRaw = fileUrl.includes('/raw/') || 
                 fileUrl.match(/\.(pdf|doc|docx|txt|ppt|pptx|xls|xlsx|csv|zip|rar|7z|mp3|wav|m4a|ogg)$/i);
    
    const resourceType = isVideo ? "video" : isRaw ? "raw" : "image";
    
    await cloudinary.uploader.destroy(publicId, { 
      resource_type: resourceType 
    });
    console.log(`✅ Deleted from Cloudinary: ${fileUrl}`);
  } catch (error) {
    console.warn("⚠️ Could not delete Cloudinary file:", error.message);
  }
};

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper: Get file type from name
const getFileType = (fileName) => {
  if (!fileName || typeof fileName !== 'string') {
    return "document";
  }
  
  const parts = fileName.split(".");
  if (parts.length < 2) {
    return "document";
  }
  
  const ext = parts.pop().toLowerCase();

  const typeMap = {
    pdf: "pdf",
    doc: "document",
    docx: "document",
    txt: "document",
    ppt: "presentation",
    pptx: "presentation",
    xls: "spreadsheet",
    xlsx: "spreadsheet",
    csv: "spreadsheet",
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    webp: "image",
    bmp: "image",
    svg: "image",
    mp4: "video",
    mov: "video",
    avi: "video",
    wmv: "video",
    flv: "video",
    webm: "video",
    mkv: "video",
    mp3: "audio",
    wav: "audio",
    m4a: "audio",
    ogg: "audio",
    zip: "archive",
    rar: "archive",
    "7z": "archive",
  };

  return typeMap[ext] || "document";
};

// Helper: Determine main type from files
const determineMainTypeFromFiles = (files) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return "document";
  }

  const types = files
    .map((file) => {
      if (file && file.fileType) {
        return file.fileType;
      }
      if (file && file.name) {
        return getFileType(file.name);
      }
      return "document";
    })
    .filter(type => type);

  if (types.length === 0) return "document";

  const typeCount = {};
  types.forEach((type) => {
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  return Object.keys(typeCount).reduce((a, b) =>
    typeCount[a] > typeCount[b] ? a : b
  );
};

// 🔹 GET — Fetch all resources
export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Format file sizes for display
    const formattedResources = resources.map(resource => {
      if (resource.files && Array.isArray(resource.files)) {
        const formattedFiles = resource.files.map(file => ({
          ...file,
          formattedSize: formatFileSize(file.size || 0)
        }));
        return { ...resource, files: formattedFiles };
      }
      return resource;
    });

    return NextResponse.json({ 
      success: true, 
      resources: formattedResources, 
      count: formattedResources.length 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching resources:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// 🔹 POST — Create resource with multiple files
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract fields
    const title = formData.get("title")?.trim() || "";
    const subject = formData.get("subject")?.trim() || "";
    const className = formData.get("className")?.trim() || "";
    const teacher = formData.get("teacher")?.trim() || "";
    const description = formData.get("description")?.trim() || "";
    const category = formData.get("category")?.trim() || "general";
    const accessLevel = formData.get("accessLevel")?.trim() || "student";
    const uploadedBy = formData.get("uploadedBy")?.trim() || "System";
    const isActive = formData.get("isActive") !== "false";

    if (!title || !subject || !className || !teacher) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Title, subject, class, and teacher are required" 
        },
        { status: 400 }
      );
    }

    const files = formData.getAll("files");
    const validFiles = files.filter(file => file && file.name && file.size > 0);
    
    if (validFiles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "At least one valid file is required" 
      }, { status: 400 });
    }

    // Upload files to Cloudinary
    const uploadedFiles = await uploadMultipleFilesToCloudinary(validFiles);
    if (uploadedFiles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to upload files" 
      }, { status: 500 });
    }

    const mainType = determineMainTypeFromFiles(uploadedFiles);

    // Save resource to database
    const resource = await prisma.resource.create({
      data: {
        title,
        subject,
        className,
        teacher,
        description,
        category,
        type: mainType,
        files: uploadedFiles,
        accessLevel,
        uploadedBy,
        downloads: 0,
        isActive,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: `Resource created with ${uploadedFiles.length} file(s)`, 
        resource 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating resource:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}