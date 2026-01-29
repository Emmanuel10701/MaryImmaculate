import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

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
          folder: "school_staff",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 500, height: 500, crop: "fill", gravity: "face" },
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
    // Silent fail - don't block operation if delete fails
  }
};

// 🔹 Check principal/deputy principal limits
async function checkRoleLimits(role, staffId = null) {
  if (role === "Principal") {
    const existingPrincipal = await prisma.staff.findFirst({
      where: { 
        role: "Principal",
        ...(staffId && { id: { not: staffId } }) // Exclude current staff if updating
      }
    });
    
    if (existingPrincipal) {
      throw new Error("A principal already exists. There can only be one principal.");
    }
  } else if (role === "Deputy Principal") {
    const existingDeputies = await prisma.staff.findMany({
      where: { 
        role: "Deputy Principal",
        ...(staffId && { id: { not: staffId } }) // Exclude current staff if updating
      }
    });
    
    if (existingDeputies.length >= 3) {
      throw new Error("Maximum of three deputy principals allowed. Current count: " + existingDeputies.length);
    }
  }
}

// 🔹 GET single staff by ID
export async function GET(req, { params }) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: Number(params.id) },
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, staff });
  } catch (error) {
    console.error("❌ GET Staff Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

// 🔹 UPDATE staff by ID
export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    const formData = await req.formData();
    const data = {};

    // Fetch existing staff (for image cleanup)
    const existingStaff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!existingStaff) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    // Check if role is being changed
    const newRole = formData.get("role");
    if (newRole && newRole !== existingStaff.role) {
      // Validate role limits BEFORE processing other data
      await checkRoleLimits(newRole, id);
    }

    // Include ALL fields from your Prisma schema
    if (formData.get("name")) data.name = formData.get("name");
    if (formData.get("role")) data.role = formData.get("role");
    if (formData.get("position")) data.position = formData.get("position");
    if (formData.get("department")) data.department = formData.get("department");
    if (formData.get("email")) data.email = formData.get("email");
    if (formData.get("phone")) data.phone = formData.get("phone");
    if (formData.get("bio")) data.bio = formData.get("bio");
    if (formData.get("quote")) data.quote = formData.get("quote");
    if (formData.get("education")) data.education = formData.get("education");
    if (formData.get("experience")) data.experience = formData.get("experience");
    if (formData.get("gender")) data.gender = formData.get("gender");
    if (formData.get("status")) data.status = formData.get("status");
    if (formData.get("joinDate")) data.joinDate = formData.get("joinDate");

    // JSON fields (safe parsing)
    if (formData.get("responsibilities")) {
      try {
        data.responsibilities = JSON.parse(formData.get("responsibilities"));
      } catch (e) {
        console.error("Error parsing responsibilities:", e);
      }
    }

    if (formData.get("expertise")) {
      try {
        data.expertise = JSON.parse(formData.get("expertise"));
      } catch (e) {
        console.error("Error parsing expertise:", e);
      }
    }

    if (formData.get("achievements")) {
      try {
        data.achievements = JSON.parse(formData.get("achievements"));
      } catch (e) {
        console.error("Error parsing achievements:", e);
      }
    }

    // Optional image upload (replace old one)
    const file = formData.get("image");
    
    // Check if it's an actual file upload
    if (file && typeof file !== "string" && file.size > 0) {
      // Validate image type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: "Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed." },
          { status: 400 }
        );
      }
      
      // Validate image size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: "Image size too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }
      
      // Remove old image from Cloudinary if it exists
      if (existingStaff.image) {
        await deleteImageFromCloudinary(existingStaff.image);
      }

      // Upload new image to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(file);
      if (!cloudinaryUrl) {
        return NextResponse.json(
          { success: false, error: "Failed to upload image" },
          { status: 500 }
        );
      }
      data.image = cloudinaryUrl;
    } else if (typeof file === "string" && file.trim() !== "") {
      // It's a string (either existing Cloudinary URL or default)
      data.image = file;
    }
    // If file is null/undefined, keep existing image

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, staff: updatedStaff });
  } catch (error) {
    console.error("❌ PUT Staff Error:", error);
    
    // Handle role limit errors
    if (error.message.includes("principal") || error.message.includes("deputy")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 DELETE staff by ID
export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);

    const staff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 }
      );
    }

    // Remove image from Cloudinary
    if (staff.image) {
      await deleteImageFromCloudinary(staff.image);
    }

    await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE Staff Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}