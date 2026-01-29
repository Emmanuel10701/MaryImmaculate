import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";

// Helper: upload image to Cloudinary
async function uploadImageToCloudinary(file) {
  if (!file || !file.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    
    // Clean filename
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "school_events",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 1200, height: 800, crop: "fill" }, // Banner-style image
            { quality: "auto:good" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(buffer);
    });
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err);
    return null;
  }
}

// Helper: delete image from Cloudinary
async function deleteImageFromCloudinary(imageUrl) {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;
    
    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const publicId = fileName.split('.')[0];
    
    await cloudinary.uploader.destroy(`school_events/${publicId}`, {
      resource_type: "image",
    });
    console.log(`✅ Deleted event image from Cloudinary: ${publicId}`);
  } catch (err) {
    console.warn("⚠️ Could not delete Cloudinary image:", err.message);
  }
}

// 🔹 GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        date: true,
        time: true,
        type: true,
        location: true,
        featured: true,
        image: true,
        attendees: true,
        speaker: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      events,
      count: events.length 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Events Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// 🔹 POST new event
export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.trim() || "";
    const category = formData.get("category")?.trim() || "";
    const description = formData.get("description")?.trim() || "";
    const dateStr = formData.get("date");
    const time = formData.get("time")?.trim() || "";
    const type = formData.get("type")?.trim() || "";
    const location = formData.get("location")?.trim() || "";
    const featured = formData.get("featured") === "true";
    const attendees = formData.get("attendees") || "students"; // "students" or "staff"
    const speaker = formData.get("speaker")?.trim() || "";

    // Validate required fields
    if (!title || !category || !description || !dateStr || !time || !type || !location) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Parse and validate date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Handle optional image upload to Cloudinary
    let imageUrl = null;
    const file = formData.get("image");
    if (file && file.size > 0) {
      const result = await uploadImageToCloudinary(file);
      if (result) {
        imageUrl = result.secure_url;
        console.log(`✅ Event image uploaded to Cloudinary: ${imageUrl}`);
      }
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        category,
        description,
        date,
        time,
        type,
        location,
        featured,
        image: imageUrl, // Cloudinary URL
        attendees,
        speaker,
      },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        date: true,
        time: true,
        type: true,
        location: true,
        featured: true,
        image: true,
        attendees: true,
        speaker: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    }, { status: 201 });
  } catch (error) {
    console.error("❌ POST Event Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}