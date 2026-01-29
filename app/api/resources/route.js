import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { FileManager } from "../../../libs/superbase"; // Changed from cloudinary

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
    // Skip empty files
    if (!file.name || file.size === 0) continue;
    
    const result = await uploadFileToSupabase(file);
    if (result) {
      uploadedFiles.push({
        url: result.url,
        name: result.name,
        size: formatFileSize(result.size),
        extension: result.extension,
        uploadedAt: result.uploadedAt,
      });
    }
  }

  return uploadedFiles;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileType = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();

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

const determineMainTypeFromFiles = (files) => {
  if (!files || files.length === 0) return "document";

  const types = files.map((file) => getFileType(file.name));
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

    return NextResponse.json({ 
      success: true, 
      resources, 
      count: resources.length 
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

    // Upload files to Supabase
    const uploadedFiles = await uploadMultipleFilesToSupabase(validFiles);
    if (uploadedFiles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to upload files" 
      }, { status: 500 });
    }

    const mainType = determineMainTypeFromFiles(validFiles);

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