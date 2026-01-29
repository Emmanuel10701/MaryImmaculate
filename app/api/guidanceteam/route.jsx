import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary"; // Changed from supabase to cloudinary


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

// 🔹 GET all team members
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json({
      success: true,
      members,
      count: members.length,
    });
  } catch (error) {
    console.error("❌ GET All Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// 🔹 POST create new team member
export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const name = formData.get("name") || "";
    const role = formData.get("role") || "teacher";
    const title = formData.get("title") || null;
    const phone = formData.get("phone") || null;
    const email = formData.get("email") || null;
    const bio = formData.get("bio") || null;
    const imageFile = formData.get("image");
    
    // Validate required fields
    if (!name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }
    
    let imageUrl = null;
    
    // Handle image upload if provided
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
      
      // Upload image to Cloudinary
      imageUrl = await uploadImageToCloudinary(imageFile);
      if (!imageUrl) {
        return NextResponse.json(
          { success: false, error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }
    
    // Create new team member
    const newMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        title,
        phone,
        email,
        bio,
        image: imageUrl,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Team member created successfully",
      member: newMember,
    }, { status: 201 });
    
  } catch (error) {
    console.error("❌ POST Error:", error);
    
    // Handle unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return NextResponse.json(
        { success: false, error: `A team member with this ${field} already exists` },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to create team member" },
      { status: 500 }
    );
  }
}