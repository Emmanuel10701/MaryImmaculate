import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { FileManager } from "../../../../libs/superbase";

// Helper: Upload file to Supabase and return detailed object
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

// 🔹 GET single assignment
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: "Valid assignment ID is required" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.findUnique({ 
      where: { id: parseInt(id) } 
    });
    
    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" }, 
        { status: 404 }
      );
    }
    
    // Process assignment to add file information
    const assignmentFileAttachments = (assignment.assignmentFiles || []).map((url) => {
      return getFileInfoFromUrl(url);
    }).filter(Boolean);
    
    const attachmentAttachments = (assignment.attachments || []).map((url) => {
      return getFileInfoFromUrl(url);
    }).filter(Boolean);
    
    const processedAssignment = {
      ...assignment,
      assignmentFileAttachments,
      attachmentAttachments
    };
    
    return NextResponse.json({ 
      success: true, 
      assignment: processedAssignment 
    });
  } catch (error) {
    console.error("❌ GET Single Assignment Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assignment" }, 
      { status: 500 }
    );
  }
}

// 🔹 PUT update assignment
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: "Valid assignment ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    console.log('📥 PUT Update - Received form fields:', Array.from(formData.keys()));

    // Check if assignment exists
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Extract updated fields
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
    
    console.log('📝 Fields extracted:', { title, subject, className, teacher, dueDate });

    // Handle file updates
    let updatedAssignmentFiles = [...existingAssignment.assignmentFiles];
    let updatedAttachments = [...existingAssignment.attachments];
    
    // Handle existing files
    const existingAssignmentFilesStr = formData.get("existingAssignmentFiles");
    const existingAttachmentsStr = formData.get("existingAttachments");
    
    console.log('📁 File data:', {
      existingAssignmentFilesStr: existingAssignmentFilesStr?.substring(0, 100),
      existingAttachmentsStr: existingAttachmentsStr?.substring(0, 100)
    });
    
    // Parse existing files that should remain
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
    
    // Remove files if specified
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
          await FileManager.deleteFiles(filesToRemove);
          console.log('✅ Removed assignment files from storage:', filesToRemove.length);
        }
      } catch (error) {
        console.error('❌ Error parsing assignmentFilesToRemove:', error);
      }
    }
    
    if (attachmentsToRemoveStr) {
      try {
        const filesToRemove = JSON.parse(attachmentsToRemoveStr);
        if (Array.isArray(filesToRemove) && filesToRemove.length > 0) {
          await FileManager.deleteFiles(filesToRemove);
          console.log('✅ Removed attachments from storage:', filesToRemove.length);
        }
      } catch (error) {
        console.error('❌ Error parsing attachmentsToRemove:', error);
      }
    }
    
    // Add new files
    const newAssignmentFiles = formData.getAll("assignmentFiles");
    const newAttachments = formData.getAll("attachments");
    
    console.log('📤 New files to upload:', {
      newAssignmentFiles: newAssignmentFiles.length,
      newAttachments: newAttachments.length
    });
    
    if (newAssignmentFiles.length > 0 && newAssignmentFiles[0].name) {
      try {
        const uploadedFiles = await uploadFilesToSupabase(newAssignmentFiles, "assignment-files");
        const newUrls = uploadedFiles.map(f => f.url).filter(url => url);
        updatedAssignmentFiles = [...updatedAssignmentFiles, ...newUrls];
        console.log('✅ Added new assignment files:', newUrls.length);
      } catch (error) {
        console.error('❌ Error uploading new assignment files:', error);
      }
    }
    
    if (newAttachments.length > 0 && newAttachments[0].name) {
      try {
        const uploadedFiles = await uploadFilesToSupabase(newAttachments, "attachments");
        const newUrls = uploadedFiles.map(f => f.url).filter(url => url);
        updatedAttachments = [...updatedAttachments, ...newUrls];
        console.log('✅ Added new attachments:', newUrls.length);
      } catch (error) {
        console.error('❌ Error uploading new attachments:', error);
      }
    }
    
    // Parse learning objectives
    let learningObjectivesArray = existingAssignment.learningObjectives;
    if (learningObjectives) {
      try {
        learningObjectivesArray = JSON.parse(learningObjectives);
        console.log('✅ Parsed learning objectives:', learningObjectivesArray?.length || 0);
      } catch (error) {
        console.error('❌ Error parsing learning objectives:', error);
      }
    }
    
    // Update assignment
    console.log('💾 Saving to database...');
    const updatedAssignment = await prisma.assignment.update({
      where: { id: parseInt(id) },
      data: { 
        title,
        subject,
        className,
        teacher,
        dueDate: dueDate ? new Date(dueDate) : existingAssignment.dueDate,
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
      },
    });

    console.log('✅ Update successful:', updatedAssignment.id);
    
    return NextResponse.json({ 
      success: true, 
      assignment: updatedAssignment,
      message: "Assignment updated successfully" 
    });
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

// 🔹 DELETE assignment
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: "Valid assignment ID is required" },
        { status: 400 }
      );
    }

    // Find assignment to get file URLs
    const assignment = await prisma.assignment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Delete all files from Supabase
    const allFiles = [
      ...(assignment.assignmentFiles || []),
      ...(assignment.attachments || [])
    ];
    
    if (allFiles.length > 0) {
      await FileManager.deleteFiles(allFiles);
    }

    // Delete from database
    await prisma.assignment.delete({ 
      where: { id: parseInt(id) } 
    });

    return NextResponse.json({ 
      success: true, 
      message: "Assignment deleted successfully" 
    });
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