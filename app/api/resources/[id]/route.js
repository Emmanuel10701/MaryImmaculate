import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

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

// Helper: Get update message
function getUpdateMessage(action, fileCount) {
  switch (action) {
    case "addFiles":
      return `Added ${fileCount} file(s) to resource`;
    case "removeFile":
      return "File removed from resource";
    default:
      return "Resource updated successfully";
  }
}

// 🔹 GET — Get single resource by ID
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

    // Format file sizes for display
    if (resource.files && Array.isArray(resource.files)) {
      resource.files = resource.files.map(file => ({
        ...file,
        formattedSize: formatFileSize(file.size || 0)
      }));
    }

    return NextResponse.json({ success: true, resource }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching resource:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// 🔹 PUT — Update a resource
export async function PUT(request, { params }) {
  try {
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
      resource 
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
    const action = formData.get("action") || "update";

    let updateData = {};

    console.log("🔄 Update Action:", action);
    console.log("📄 Existing resource files:", existingResource.files?.length || 0);

    switch (action) {
      case "update":
      default:
        // Get form fields
        const title = formData.get("title")?.trim();
        const subject = formData.get("subject")?.trim();
        const className = formData.get("className")?.trim();
        const teacher = formData.get("teacher")?.trim();
        const description = formData.get("description")?.trim();
        const category = formData.get("category")?.trim();
        const accessLevel = formData.get("accessLevel")?.trim();
        const uploadedBy = formData.get("uploadedBy")?.trim();
        const isActive = formData.get("isActive");

        if (title !== null && title !== undefined) updateData.title = title;
        if (subject !== null && subject !== undefined) updateData.subject = subject;
        if (className !== null && className !== undefined) updateData.className = className;
        if (teacher !== null && teacher !== undefined) updateData.teacher = teacher;
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
        console.log("- existingFilesStr length:", existingFilesStr?.length || 0);
        console.log("- filesToRemoveStr:", filesToRemoveStr);
        console.log("- New files:", newFiles.length);

        // Initialize final files array
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
                  // Delete from Cloudinary
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

        // Upload new files
        if (newFiles.length > 0 && newFiles[0].name) {
          console.log("- Uploading new files...");
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
          updateData.type = "document"; // Default if no files
        }
        break;
    }

    updateData.updatedAt = new Date();

    console.log("💾 Saving to database...");
    console.log("- Update data:", {
      ...updateData,
      files: `Array(${updateData.files?.length || 0} files)`
    });

    const resource = await prisma.resource.update({
      where: { id: id },
      data: updateData,
    });

    console.log("✅ Update successful");
    console.log("- Updated resource ID:", resource.id);

    return NextResponse.json({ 
      success: true, 
      message: `Resource updated successfully with ${updateData.files?.length || 0} file(s)`, 
      resource 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in form update:", error);
    console.error("- Error details:", error.message);
    console.error("- Error stack:", error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: "Check server logs for more information"
    }, { status: 500 });
  }
}

// 🔹 DELETE — Delete a resource
export async function DELETE(request, { params }) {
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

    // Delete files from Cloudinary
    if (resource.files && Array.isArray(resource.files)) {
      const fileUrls = resource.files.map(file => file.url).filter(url => url);
      if (fileUrls.length > 0) {
        const deletePromises = fileUrls.map(url => deleteFileFromCloudinary(url));
        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${fileUrls.length} files from Cloudinary`);
      }
    }

    await prisma.resource.delete({ where: { id: resourceId } });

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

// 🔹 PATCH — Increment download count
export async function PATCH(request, { params }) {
  try {
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