import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

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
    // Documents
    pdf: 'pdf',
    doc: 'document', docx: 'document',
    txt: 'document', rtf: 'document',
    
    // Presentations
    ppt: 'presentation', pptx: 'presentation',
    
    // Spreadsheets
    xls: 'spreadsheet', xlsx: 'spreadsheet', csv: 'spreadsheet',
    
    // Images
    jpg: 'image', jpeg: 'image', png: 'image', gif: 'image',
    bmp: 'image', svg: 'image', webp: 'image',
    
    // Videos
    mp4: 'video', mov: 'video', avi: 'video', mkv: 'video', webm: 'video',
    
    // Audio
    mp3: 'audio', wav: 'audio', ogg: 'audio', m4a: 'audio',
    
    // Archives
    zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive'
  };
  
  return typeMap[ext] || 'document';
};

export async function GET(request) {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(
      {
        success: true,
        resources,
        count: resources.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching resources:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 POST — Create/Upload a new resource
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract fields from FormData
    const title = formData.get("title")?.trim() || "";
    const subject = formData.get("subject")?.trim() || "";
    const className = formData.get("className")?.trim() || ""; // ADDED: Get class
    const description = formData.get("description")?.trim() || "";
    const category = formData.get("category")?.trim() || "general";
    const accessLevel = formData.get("accessLevel")?.trim() || "student";
    const uploadedBy = formData.get("uploadedBy")?.trim() || "System";
    const gradeLevel = formData.get("gradeLevel")?.trim() || null;
    const isActive = formData.get("isActive") !== "false";
    const teacher = formData.get("teacher")?.trim() || "";

    // Validate required fields
    if (!title || !subject || !className) { // ADDED: Validate class
      return NextResponse.json(
        { success: false, error: "Title, subject, and class are required" },
        { status: 400 }
      );
    }

    // Handle file upload
    const file = formData.get("file");
    if (!file || !file.name) {
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 }
      );
    }

    // Upload file
    const uploadDir = path.join(process.cwd(), "public/resources");
    ensureUploadDir(uploadDir);
    
    const fileData = await uploadFile(file, uploadDir);
    if (!fileData) {
      return NextResponse.json(
        { success: false, error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Determine file type
    const fileType = getFileType(fileData.name);

    // Create resource in database
    const resource = await prisma.resource.create({
      data: {
        title,
        subject,
        className, // ADDED: Include class
        description,
        category,
        type: fileType,
        fileUrl: fileData.url,
        fileName: fileData.name,
        fileSize: fileData.size,
        extension: fileData.extension,
        accessLevel,
        uploadedBy,
        teacher, // ADDED: Include teacher
        gradeLevel,
        downloads: 0,
        isActive,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resource uploaded successfully",
        resource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating resource:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: "Please check your database connection and schema"
      },
      { status: 500 }
    );
  }
}