import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile, unlink } from "fs/promises";

// Helpers (same as your working POST API)
const ensureUploadDir = (uploadDir) => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const uploadFiles = async (files, uploadDir) => {
  const uploadedFiles = [];
  
  for (const file of files) {
    if (file && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      uploadedFiles.push(`/assignments/${fileName}`);
    }
  }
  
  return uploadedFiles;
};

const deleteOldFiles = async (filePaths) => {
  if (!filePaths || !Array.isArray(filePaths)) return;
  
  for (const filePath of filePaths) {
    try {
      const fullPath = path.join(process.cwd(), 'public', filePath);
      if (fs.existsSync(fullPath)) {
        await unlink(fullPath);
        console.log(`✅ Deleted file: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error deleting file ${filePath}:`, error);
    }
  }
};

// 🔹 GET — Get single assignment by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const assignmentId = parseInt(id);

    if (isNaN(assignmentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid assignment ID" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        assignment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching assignment:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PUT — Update assignment with file upload support
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const assignmentId = parseInt(id);

    if (isNaN(assignmentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid assignment ID" },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const uploadDir = path.join(process.cwd(), "public/assignments");
    ensureUploadDir(uploadDir);

    // Initialize update data
    const updateData = {};

    // Handle text fields
    const textFields = [
      'title', 'subject', 'className', 'teacher', 'status', 'description',
      'instructions', 'priority', 'estimatedTime', 'additionalWork',
      'teacherRemarks', 'feedback', 'grade'
    ];

    for (const field of textFields) {
      const value = formData.get(field);
      if (value !== null && value !== '') {
        updateData[field] = value;
      }
    }

    // Handle date fields
    const dueDate = formData.get('dueDate');
    const dateAssigned = formData.get('dateAssigned');
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (dateAssigned) updateData.dateAssigned = new Date(dateAssigned);

    // Handle learning objectives
    const learningObjectives = formData.get('learningObjectives');
    if (learningObjectives && learningObjectives !== '') {
      try {
        updateData.learningObjectives = JSON.parse(learningObjectives);
      } catch (error) {
        console.error("Error parsing learning objectives:", error);
      }
    }

    // Handle file uploads - assignmentFiles
    const newAssignmentFiles = formData.getAll("assignmentFiles");
    if (newAssignmentFiles.length > 0 && newAssignmentFiles[0].name) {
      console.log(`📁 Uploading ${newAssignmentFiles.length} new assignment files`);
      
      // Delete old assignment files if they exist
      if (existingAssignment.assignmentFiles && Array.isArray(existingAssignment.assignmentFiles)) {
        await deleteOldFiles(existingAssignment.assignmentFiles);
      }
      
      // Upload new files
      const uploadedFiles = await uploadFiles(newAssignmentFiles, uploadDir);
      updateData.assignmentFiles = uploadedFiles;
      console.log(`✅ Uploaded assignment files:`, uploadedFiles);
    }

    // Handle file uploads - attachments
    const newAttachments = formData.getAll("attachments");
    if (newAttachments.length > 0 && newAttachments[0].name) {
      console.log(`📁 Uploading ${newAttachments.length} new attachments`);
      
      // Delete old attachments if they exist
      if (existingAssignment.attachments && Array.isArray(existingAssignment.attachments)) {
        await deleteOldFiles(existingAssignment.attachments);
      }
      
      // Upload new files
      const uploadedAttachments = await uploadFiles(newAttachments, uploadDir);
      updateData.attachments = uploadedAttachments;
      console.log(`✅ Uploaded attachments:`, uploadedAttachments);
    }

    // Handle file removal flags
    const removeAssignmentFiles = formData.get("removeAssignmentFiles");
    const removeAttachments = formData.get("removeAttachments");

    if (removeAssignmentFiles === "true") {
      console.log("🗑️ Removing assignment files");
      // Delete old assignment files
      if (existingAssignment.assignmentFiles && Array.isArray(existingAssignment.assignmentFiles)) {
        await deleteOldFiles(existingAssignment.assignmentFiles);
      }
      updateData.assignmentFiles = [];
    }

    if (removeAttachments === "true") {
      console.log("🗑️ Removing attachments");
      // Delete old attachments
      if (existingAssignment.attachments && Array.isArray(existingAssignment.attachments)) {
        await deleteOldFiles(existingAssignment.attachments);
      }
      updateData.attachments = [];
    }

    console.log("📝 Update data:", updateData);

    const assignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Assignment updated successfully",
        assignment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating assignment:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 DELETE — Delete assignment with file cleanup
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const assignmentId = parseInt(id);

    if (isNaN(assignmentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid assignment ID" },
        { status: 400 }
      );
    }

    // Check if assignment exists and get file paths
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Delete associated files
    if (existingAssignment.assignmentFiles && Array.isArray(existingAssignment.assignmentFiles)) {
      await deleteOldFiles(existingAssignment.assignmentFiles);
    }
    
    if (existingAssignment.attachments && Array.isArray(existingAssignment.attachments)) {
      await deleteOldFiles(existingAssignment.attachments);
    }

    // Delete the assignment from database
    await prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Assignment deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting assignment:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}