import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary"; // Changed from supabase to cloudinary


// Helper: Upload image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "school_team",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto:good" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    return null;
  }
};

// Helper: Delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;

  try {
    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) return;
    
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("❌ Error deleting image from Cloudinary:", error);
    // Silent fail
  }
};

// 🔹 GET single team member
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("❌ GET Single Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

// 🔹 PUT update team member
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    // Check if member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    
    const name = formData.get("name") || "";
    const role = formData.get("role") || "teacher";
    const title = formData.get("title") || null;
    const phone = formData.get("phone") || null;
    const email = formData.get("email") || null;
    const bio = formData.get("bio") || null;
    
    // Validate required fields
    if (!name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }
    
    // Handle image update
    let image = existingMember.image;
    const imageFile = formData.get("image");
    
    // Check if new image is uploaded
    if (imageFile && imageFile.size > 0) {
      // Validate image type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { success: false, error: "Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed." },
          { status: 400 }
        );
      }
      
      // Validate image size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { success: false, error: "Image size too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }
      
      // Delete old image from Cloudinary if exists
      if (existingMember.image) {
        await deleteImageFromCloudinary(existingMember.image);
      }
      
      // Upload new image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageFile);
      if (imageUrl) {
        image = imageUrl;
      } else {
        return NextResponse.json(
          { success: false, error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }
    
    // Check if image should be removed
    const removeImage = formData.get("removeImage") === "true";
    if (removeImage && existingMember.image) {
      await deleteImageFromCloudinary(existingMember.image);
      image = null;
    }
    
    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        title,
        phone,
        email,
        bio,
        image,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Team member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE team member
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    // Check if member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if exists
    if (existingMember.image) {
      await deleteImageFromCloudinary(existingMember.image);
    }

    // Delete member from database
    await prisma.teamMember.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}