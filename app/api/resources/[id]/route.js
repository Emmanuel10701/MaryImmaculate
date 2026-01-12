import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { unlink, writeFile } from "fs/promises";

// Helpers
const ensureUploadDir = (uploadDir) => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const uploadFile = async (file, uploadDir) => {
  if (!file || !file.name) return null;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}-${sanitizedFileName}`;
  const filePath = path.join(uploadDir, fileName);
  
  await writeFile(filePath, buffer);
  return {
    url: `/resources/${fileName}`,
    name: file.name,
    size: formatFileSize(file.size),
    extension: file.name.split('.').pop().toLowerCase()
  };
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileType = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  
  const typeMap = {
    pdf: 'pdf',
    doc: 'document', docx: 'document',
    ppt: 'presentation', pptx: 'presentation',
    xls: 'spreadsheet', xlsx: 'spreadsheet',
    jpg: 'image', jpeg: 'image', png: 'image',
    mp4: 'video', mp3: 'audio',
    zip: 'archive',
  };
  
  return typeMap[ext] || 'document';
};

// 🔹 GET — Get single resource by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        resource,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching resource:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PUT — Update a resource
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Check content type
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      return await handleFileUpdate(request, id, existingResource);
    } else {
      return await handleJsonUpdate(request, id);
    }
  } catch (error) {
    console.error("❌ Error updating resource:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handle JSON update (no file change)
async function handleJsonUpdate(request, id) {
  const body = await request.json();
  
  // Remove fields that shouldn't be updated
  const { id: _, createdAt, downloads, ...updateData } = body;
  
  // Update resource
  const resource = await prisma.resource.update({
    where: { id: parseInt(id) },
    data: {
      ...updateData,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Resource updated successfully",
      resource,
    },
    { status: 200 }
  );
}

// Handle file update with new file upload
async function handleFileUpdate(request, id, existingResource) {
  const formData = await request.formData();
  
  // Extract fields from FormData
  const title = formData.get("title")?.trim() || existingResource.title;
  const subject = formData.get("subject")?.trim() || existingResource.subject;
  const className = formData.get("className")?.trim() || existingResource.className; // ADDED
  const description = formData.get("description")?.trim() || existingResource.description;
  const category = formData.get("category")?.trim() || existingResource.category;
  const accessLevel = formData.get("accessLevel")?.trim() || existingResource.accessLevel;
  const uploadedBy = formData.get("uploadedBy")?.trim() || existingResource.uploadedBy;
  const gradeLevel = formData.get("gradeLevel")?.trim() || existingResource.gradeLevel;
  const isActive = formData.get("isActive") || existingResource.isActive.toString();
  const teacher = formData.get("teacher")?.trim() || existingResource.teacher;
  
  // Handle file upload if provided
  const file = formData.get("file");
  let updateData = {
    title,
    subject,
    className, // ADDED
    description,
    category,
    accessLevel,
    uploadedBy,
    teacher,
    gradeLevel,
    isActive: isActive === "true",
    updatedAt: new Date(),
  };

  if (file && file.name) {
    // Delete old file
    try {
      const oldFilePath = path.join(process.cwd(), 'public', existingResource.fileUrl);
      if (fs.existsSync(oldFilePath)) {
        await unlink(oldFilePath);
      }
    } catch (fileError) {
      console.warn("Could not delete old file:", fileError.message);
    }

    // Upload new file
    const uploadDir = path.join(process.cwd(), "public/resources");
    ensureUploadDir(uploadDir);
    
    const fileData = await uploadFile(file, uploadDir);
    if (fileData) {
      const fileType = getFileType(fileData.name);
      updateData = {
        ...updateData,
        type: fileType,
        fileUrl: fileData.url,
        fileName: fileData.name,
        fileSize: fileData.size,
        extension: fileData.extension,
      };
    }
  }

  // Update resource in database
  const resource = await prisma.resource.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  return NextResponse.json(
    {
      success: true,
      message: file && file.name ? "Resource and file updated successfully" : "Resource updated successfully",
      resource,
    },
    { status: 200 }
  );
}

// 🔹 DELETE — Delete a resource
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    // Get resource first to delete the file
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Delete the file from storage
    try {
      const filePath = path.join(process.cwd(), 'public', resource.fileUrl);
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (fileError) {
      console.warn("Could not delete file:", fileError.message);
    }

    // Delete from database
    await prisma.resource.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resource deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting resource:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PATCH — Increment download count
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Increment download count
    const resource = await prisma.resource.update({
      where: { id: parseInt(id) },
      data: {
        downloads: {
          increment: 1
        },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Download count updated",
        downloads: resource.downloads,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating download count:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}