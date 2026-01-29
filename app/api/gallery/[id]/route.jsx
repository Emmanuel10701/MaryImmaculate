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

    const isVideo = file.type.startsWith('video/');
    
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: isVideo ? "video" : "image",
          folder: "school_gallery",
          public_id: `${timestamp}-${sanitizedFileName}`,
          ...(isVideo ? {
            transformation: [
              { width: 1280, crop: "scale" },
              { quality: "auto" }
            ]
          } : {
            transformation: [
              { width: 1200, height: 800, crop: "fill" },
              { quality: "auto:good" }
            ]
          })
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
  } catch {
    return null;
  }
};

// Helper: Delete files from Cloudinary
const deleteFilesFromCloudinary = async (fileUrls) => {
  if (!Array.isArray(fileUrls) && !fileUrls) return;

  try {
    const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
    
    const deletePromises = urls.map(async (fileUrl) => {
      if (!fileUrl?.includes('cloudinary.com')) return;

      try {
        const urlMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+(?:$|\?)/);
        if (!urlMatch) return;
        
        const publicId = urlMatch[1];
        const isVideo = fileUrl.includes('/video/') || 
                       fileUrl.match(/\.(mp4|mpeg|avi|mov|wmv|flv|webm|mkv)$/i);
        
        await cloudinary.uploader.destroy(publicId, { 
          resource_type: isVideo ? "video" : "image" 
        });
      } catch {
        // Silent fail on individual file delete
      }
    });

    await Promise.all(deletePromises);
  } catch {
    // Silent fail
  }
};

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
      // Delete files from Cloudinary
      await deleteFilesFromCloudinary(filesToRemove);
      
      // Filter out files marked for removal
      updatedFiles = updatedFiles.filter(file => !filesToRemove.includes(file));
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

          const result = await uploadFileToCloudinary(file);
          if (result) {
            newFiles.push(result.secure_url);
          }
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

    // Find gallery to get file URLs for cleanup
    const gallery = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id) }
    });

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: "Gallery not found" },
        { status: 404 }
      );
    }

    // Delete files from Cloudinary
    if (Array.isArray(gallery.files) && gallery.files.length > 0) {
      await deleteFilesFromCloudinary(gallery.files);
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