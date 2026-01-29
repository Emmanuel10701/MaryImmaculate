import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { FileManager } from "../../../../libs/superbase"; // Changed from cloudinary

// Helper functions
const uploadFileToSupabase = async (file) => {
  if (!file || !file.name || file.size === 0) return null;

  try {
    const result = await FileManager.uploadFile(file, `resources/files`);
    
    if (!result) return null;
    
    return {
      url: result.url,
      name: result.fileName,
      size: result.fileSize,
      extension: result.fileName.substring(result.fileName.lastIndexOf('.')).toLowerCase(),
      uploadedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("❌ Supabase upload error:", err);
    return null;
  }
};

const uploadMultipleFilesToSupabase = async (files) => {
  if (!files || files.length === 0) return [];

  const uploadedFiles = [];

  for (const file of files) {
    if (!file.name || file.size === 0) continue;
    
    const result = await uploadFileToSupabase(file);
    if (result) {
      uploadedFiles.push({
        url: result.url,
        name: result.name,
        size: result.size, // Store the size in bytes
        extension: result.extension,
        uploadedAt: result.uploadedAt,
      });
    }
  }

  return uploadedFiles;
};



const deleteFileFromSupabase = async (fileUrl) => {
  try {
    if (!fileUrl) return;
    
    // Use FileManager to delete file
    await FileManager.deleteFiles(fileUrl);
    console.log(`✅ Deleted from Supabase: ${fileUrl}`);
  } catch (err) {
    console.warn("⚠️ Could not delete Supabase file:", err.message);
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};



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

const determineMainTypeFromFiles = (fileNames) => {
  if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
    return "document";
  }

  const types = fileNames
    .map((fileName) => {
      if (!fileName || typeof fileName !== 'string') {
        return "document";
      }
      return getFileType(fileName);
    })
    .filter(type => type); // Remove undefined/null

  if (types.length === 0) return "document";

  const typeCount = {};
  types.forEach((type) => {
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  return Object.keys(typeCount).reduce((a, b) =>
    typeCount[a] > typeCount[b] ? a : b
  );
};

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
                  // Delete from Supabase
                  deleteFileFromSupabase(file.url).catch(err => 
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
          const uploadedNewFiles = await uploadMultipleFilesToSupabase(newFiles);
          console.log("- Successfully uploaded:", uploadedNewFiles.length);
          
          // Add new files to finalFiles
          finalFiles = [...finalFiles, ...uploadedNewFiles];
        }

        console.log("- Final file count:", finalFiles.length);
        
        // Update files array in database
        updateData.files = finalFiles;
        
        // Determine file type safely
        if (finalFiles.length > 0) {
          // Extract file names safely
          const fileNames = finalFiles
            .map(file => file?.name || '')
            .filter(name => name && name.trim() !== '');
          
          if (fileNames.length > 0) {
            updateData.type = determineMainTypeFromFiles(fileNames);
            console.log("- Determined type:", updateData.type);
          } else {
            updateData.type = "document"; // Default
          }
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

    // Delete files from Supabase
    if (resource.files && Array.isArray(resource.files)) {
      const fileUrls = resource.files.map(file => file.url).filter(url => url);
      if (fileUrls.length > 0) {
        await FileManager.deleteFiles(fileUrls);
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