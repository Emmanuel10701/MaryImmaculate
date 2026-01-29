import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { FileManager } from "../../../libs/superbase";

// Helper: Upload file to Supabase (for ALL file types)
const uploadFileToSupabase = async (file, folder = "assignments") => {
  if (!file?.name || file.size === 0) return null;

  try {
    const result = await FileManager.uploadFile(file, `assignments/${folder}`);
    
    if (!result) return null;
    
    return {
      url: result.url,
      name: result.fileName,
      size: result.fileSize,
      type: result.fileType,
      extension: result.fileName.substring(result.fileName.lastIndexOf('.')).toLowerCase(),
      storageType: 'supabase'
    };
  } catch (error) {
    console.error("❌ Supabase upload error:", error);
    return null;
  }
};

// Helper: Delete file from Supabase
const deleteFileFromSupabase = async (fileUrl) => {
  if (!fileUrl) return;
  
  try {
    await FileManager.deleteFile(fileUrl);
  } catch (error) {
    console.error("❌ Error deleting file from Supabase:", error);
  }
};

// Helper: Upload multiple files to Supabase
const uploadFilesToSupabase = async (files, folder = "assignments") => {
  const uploadedFiles = [];
  
  for (const file of files) {
    if (file && file.name && file.size > 0) {
      try {
        const uploadedFile = await uploadFileToSupabase(file, folder);
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

// Helper: Get file info from URL (Supabase URLs)
const getFileInfoFromUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Extract filename from URL
    const pathParts = pathname.split('/');
    let fileName = pathParts[pathParts.length - 1];
    
    // Decode URL-encoded filename
    fileName = decodeURIComponent(fileName);
    
    // Extract extension
    const extension = fileName.includes('.') 
      ? fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
      : '';
    
    // Determine file type
    const getFileType = (ext) => {
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
        '.bmp': 'Image',
        '.svg': 'Image',
        '.mp4': 'Video',
        '.mov': 'Video',
        '.avi': 'Video',
        '.wmv': 'Video',
        '.flv': 'Video',
        '.webm': 'Video',
        '.mkv': 'Video',
        '.mp3': 'Audio',
        '.wav': 'Audio',
        '.m4a': 'Audio',
        '.ogg': 'Audio',
        '.xls': 'Excel Spreadsheet',
        '.xlsx': 'Excel Spreadsheet',
        '.ppt': 'Presentation',
        '.pptx': 'Presentation',
        '.zip': 'Archive',
        '.rar': 'Archive',
        '.7z': 'Archive'
      };
      
      return typeMap[ext] || 'File';
    };

    return {
      url,
      fileName,
      extension,
      fileType: getFileType(extension),
      storageType: 'supabase'
    };
  } catch (error) {
    console.error("Error parsing URL:", url, error);
    return {
      url,
      fileName: 'download',
      extension: '',
      fileType: 'File',
      storageType: 'supabase'
    };
  }
};

// 🔹 POST — Create a new assignment (Supabase only)
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract fields
    const title = formData.get("title")?.toString().trim() || "";
    const subject = formData.get("subject")?.toString().trim() || "";
    const className = formData.get("className")?.toString().trim() || "";
    const teacher = formData.get("teacher")?.toString().trim() || "";
    const dueDate = formData.get("dueDate")?.toString() || "";
    const dateAssigned = formData.get("dateAssigned")?.toString() || new Date().toISOString();
    const status = formData.get("status")?.toString() || "assigned";
    const description = formData.get("description")?.toString().trim() || "";
    const instructions = formData.get("instructions")?.toString().trim() || "";
    const priority = formData.get("priority")?.toString() || "medium";
    const estimatedTime = formData.get("estimatedTime")?.toString().trim() || "";
    const additionalWork = formData.get("additionalWork")?.toString().trim() || "";
    const teacherRemarks = formData.get("teacherRemarks")?.toString().trim() || "";
    const learningObjectives = formData.get("learningObjectives")?.toString() || "[]";

    // Validate required fields
    if (!title || !subject || !className || !teacher || !dueDate) {
      return NextResponse.json(
        { success: false, error: "Title, subject, class, teacher, and due date are required" },
        { status: 400 }
      );
    }

    // Handle file uploads to Supabase
    let assignmentFiles = [];
    let attachments = [];
    
    try {
      // Upload assignment files
      const assignmentFileInputs = formData.getAll("assignmentFiles");
      const uploadedAssignmentFiles = await uploadFilesToSupabase(assignmentFileInputs, "assignment-files");
      assignmentFiles = uploadedAssignmentFiles.map(file => file.url);
      console.log(`✅ Uploaded assignment files:`, uploadedAssignmentFiles.map(f => f.name));
      
      // Upload attachments
      const attachmentInputs = formData.getAll("attachments");
      const uploadedAttachments = await uploadFilesToSupabase(attachmentInputs, "attachments");
      attachments = uploadedAttachments.map(file => file.url);
      console.log(`✅ Uploaded attachments:`, uploadedAttachments.map(f => f.name));
      
    } catch (fileError) {
      console.error("File upload error:", fileError);
      return NextResponse.json(
        { success: false, error: "Failed to upload files. Please try again." },
        { status: 500 }
      );
    }

    // Parse learning objectives
    let learningObjectivesArray = [];
    try {
      learningObjectivesArray = JSON.parse(learningObjectives);
    } catch (error) {
      console.error("Error parsing learning objectives:", error);
      learningObjectivesArray = [];
    }

    // Create assignment in database
    const assignment = await prisma.assignment.create({
      data: {
        title,
        subject,
        className,
        teacher,
        dueDate: new Date(dueDate),
        dateAssigned: new Date(dateAssigned),
        status,
        description,
        instructions,
        priority,
        estimatedTime,
        additionalWork,
        teacherRemarks,
        assignmentFiles: assignmentFiles,
        attachments: attachments,
        learningObjectives: learningObjectivesArray,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Assignment created successfully",
        assignment,
        fileCounts: {
          assignmentFiles: assignmentFiles.length,
          attachments: attachments.length
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating assignment:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// 🔹 GET — Fetch all assignments with filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const className = searchParams.get("class");
    const subject = searchParams.get("subject");
    const status = searchParams.get("status");
    const teacher = searchParams.get("teacher");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {
      AND: [
        className && className !== "all" ? { className } : {},
        subject && subject !== "all" ? { subject } : {},
        status && status !== "all" ? { status } : {},
        teacher && teacher !== "all" ? { teacher } : {},
        search ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { teacher: { contains: search, mode: "insensitive" } },
            { subject: { contains: search, mode: "insensitive" } },
            { className: { contains: search, mode: "insensitive" } },
          ],
        } : {},
      ].filter(condition => Object.keys(condition).length > 0),
    };

    // Get assignments with pagination
    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.assignment.count({ where }),
    ]);

    // Process assignments to add file information
    const processedAssignments = assignments.map(assignment => {
      const assignmentFileAttachments = (assignment.assignmentFiles || []).map((url, index) => {
        const fileInfo = getFileInfoFromUrl(url);
        return fileInfo;
      }).filter(Boolean);
      
      const attachmentAttachments = (assignment.attachments || []).map((url, index) => {
        const fileInfo = getFileInfoFromUrl(url);
        return fileInfo;
      }).filter(Boolean);
      
      return {
        ...assignment,
        assignmentFileAttachments,
        attachmentAttachments
      };
    });

    return NextResponse.json(
      {
        success: true,
        assignments: processedAssignments,
        pagination: {
          current: page,
          totalPages: Math.ceil(total / limit),
          totalAssignments: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching assignments:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}