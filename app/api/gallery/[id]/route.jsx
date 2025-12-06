import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadDir = path.join(process.cwd(), "public/gallery");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Valid categories
const validCategories = [
  'GENERAL', 'CLASSROOMS', 'LABORATORIES', 'DORMITORIES', 
  'DINING_HALL', 'SPORTS_FACILITIES', 'TEACHING', 
  'SCIENCE_LAB', 'COMPUTER_LAB', 'SPORTS_DAY', 
  'MUSIC_FESTIVAL', 'DRAMA_PERFORMANCE', 'ART_EXHIBITION', 
  'DEBATE_COMPETITION', 'SCIENCE_FAIR', 'ADMIN_OFFICES', 'STAFF', 
  'PRINCIPAL', 'BOARD', 'GRADUATION', 'AWARD_CEREMONY', 'PARENTS_DAY', 
  'OPEN_DAY', 'VISITORS', 'STUDENT_ACTIVITIES', 'CLUBS', 'COUNCIL', 
  'LEADERSHIP', 'OTHER'
];

// 🔹 GET single gallery
export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: "Valid gallery ID is required" },
        { status: 400 }
      );
    }

    const gallery = await prisma.galleryImage.findUnique({ 
      where: { id: parseInt(id) } 
    });
    
    if (!gallery) {
      return NextResponse.json(
        { success: false, error: "Gallery not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, gallery });
  } catch (error) {
    console.error("❌ GET Single Gallery Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery details" }, 
      { status: 500 }
    );
  }
}

// 🔹 PUT update gallery with file management
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: "Valid gallery ID is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");

    // Check if gallery exists
    const existingGallery = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingGallery) {
      return NextResponse.json(
        { success: false, error: "Gallery not found" },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { success: false, error: "Title and category are required" },
        { status: 400 }
      );
    }

    // Validate category
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    let updatedFiles = [...existingGallery.files];
    
    // Handle files to remove
    const filesToRemove = formData.getAll("filesToRemove");
    if (filesToRemove.length > 0) {
      // Filter out files marked for removal
      updatedFiles = updatedFiles.filter(file => !filesToRemove.includes(file));
      
      // Delete the removed files from storage
      filesToRemove.forEach((filePath) => {
        const fileName = filePath.replace('/gallery/', '');
        const fullPath = path.join(uploadDir, fileName);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`🗑️ Deleted file: ${fullPath}`);
        }
      });
    }

    // Handle new file uploads
    const newFileEntries = formData.getAll("files");
    if (newFileEntries.length > 0) {
      const newFiles = [];
      
      for (const file of newFileEntries) {
        if (file && file.size > 0) {
          // Validate file type
          const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
            'image/webp', 'image/bmp', 'image/svg+xml',
            'video/mp4', 'video/mpeg', 'video/avi', 'video/mov',
            'video/wmv', 'video/flv', 'video/webm', 'video/mkv'
          ];
          
          if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
              { success: false, error: `Invalid file type: ${file.type}. Allowed: images and videos` },
              { status: 400 }
            );
          }

          // Validate file size (max 10MB)
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (file.size > maxSize) {
            return NextResponse.json(
              { success: false, error: `File ${file.name} is too large. Max size is 10MB` },
              { status: 400 }
            );
          }

          const buffer = Buffer.from(await file.arrayBuffer());
          const fileName = `${randomUUID()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, buffer);
          
          newFiles.push(`/gallery/${fileName}`);
          console.log(`📤 Uploaded new file: ${fileName}`);
        }
      }
      
      // Add new files to the updated files array
      updatedFiles = [...updatedFiles, ...newFiles];
    }

    // Check if we have at least one file remaining
    if (updatedFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "Gallery must contain at least one file" },
        { status: 400 }
      );
    }

    const updatedGallery = await prisma.galleryImage.update({
      where: { id: parseInt(id) },
      data: { 
        title, 
        description, 
        category,
        files: updatedFiles 
      },
    });

    return NextResponse.json({ 
      success: true, 
      gallery: updatedGallery,
      message: `Gallery updated successfully. ${filesToRemove.length} files removed, ${newFileEntries.length} files added.` 
    });
  } catch (error) {
    console.error("❌ PUT Gallery Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Gallery not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update gallery" }, 
      { status: 500 }
    );
  }
}

// 🔹 DELETE gallery
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: "Valid gallery ID is required" },
        { status: 400 }
      );
    }

    // Find gallery to get file paths for cleanup
    const gallery = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id) }
    });

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: "Gallery not found" },
        { status: 404 }
      );
    }

    // Delete files from storage
    if (Array.isArray(gallery.files)) {
      gallery.files.forEach((filePath) => {
        const fileName = filePath.replace('/gallery/', '');
        const fullPath = path.join(uploadDir, fileName);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`🗑️ Deleted gallery file: ${fullPath}`);
        }
      });
    }

    // Delete from database
    await prisma.galleryImage.delete({ 
      where: { id: parseInt(id) } 
    });

    return NextResponse.json({ 
      success: true, 
      message: "Gallery deleted successfully" 
    });
  } catch (error) {
    console.error("❌ DELETE Gallery Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Gallery not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete gallery" }, 
      { status: 500 }
    );
  }
}