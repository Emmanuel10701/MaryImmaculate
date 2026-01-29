import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import cloudinary from "../../../../libs/cloudinary";

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
            { width: 1200, height: 800, crop: "fill" },
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

// 🔹 GET single event by ID
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({ 
      where: { id },
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

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      event 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Single Event Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PUT (update) event by ID
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({ 
      where: { id },
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
      }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    
    const dataToUpdate = {
      title: formData.get("title")?.trim() || existingEvent.title,
      category: formData.get("category")?.trim() || existingEvent.category,
      description: formData.get("description")?.trim() || existingEvent.description,
      time: formData.get("time")?.trim() || existingEvent.time,
      type: formData.get("type")?.trim() || existingEvent.type,
      location: formData.get("location")?.trim() || existingEvent.location,
      featured: formData.get("featured") === "true",
      attendees: formData.get("attendees") || existingEvent.attendees,
      speaker: formData.get("speaker")?.trim() || existingEvent.speaker,
      updatedAt: new Date(),
    };

    // Handle date if provided
    const dateStr = formData.get("date");
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        dataToUpdate.date = date;
      }
    }

    // Handle optional file upload to Cloudinary
    const file = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";
    
    if (file && file.size > 0) {
      // Delete old image from Cloudinary if exists
      if (existingEvent.image) {
        await deleteImageFromCloudinary(existingEvent.image);
      }
      
      // Upload new image to Cloudinary
      const result = await uploadImageToCloudinary(file);
      if (result) {
        dataToUpdate.image = result.secure_url;
        console.log(`✅ Event image updated on Cloudinary: ${result.secure_url}`);
      }
    } else if (removeImage && existingEvent.image) {
      // Remove image if requested
      await deleteImageFromCloudinary(existingEvent.image);
      dataToUpdate.image = null;
      console.log('🗑️ Event image removed from Cloudinary');
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: dataToUpdate,
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
      message: "Event updated successfully",
      event: updatedEvent 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ PUT Event Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 DELETE event by ID
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({ 
      where: { id },
      select: {
        id: true,
        title: true,
        image: true,
      }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if exists
    if (existingEvent.image) {
      console.log('🗑️ Deleting event image from Cloudinary...');
      await deleteImageFromCloudinary(existingEvent.image);
      console.log('✅ Event image deleted from Cloudinary');
    }

    // Delete from database
    const deletedEvent = await prisma.event.delete({ 
      where: { id },
      select: {
        id: true,
        title: true,
        category: true,
        date: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Event deleted successfully",
      event: deletedEvent 
    }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Event Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}