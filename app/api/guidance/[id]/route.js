import { NextResponse } from "next/server";
import { prisma } from '../../../../libs/prisma';
import cloudinary from '../../../../libs/cloudinary'; // Changed to cloudinary

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
          folder: "counseling_events",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 800, height: 600, crop: "fill" },
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
    
    await cloudinary.uploader.destroy(`counseling_events/${publicId}`, {
      resource_type: "image",
    });
    console.log(`✅ Deleted counseling image from Cloudinary: ${publicId}`);
  } catch (err) {
    console.warn("⚠️ Could not delete Cloudinary image:", err.message);
  }
}

// 🔹 GET single event
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const event = await prisma.counselingEvent.findUnique({ 
      where: { id },
      select: {
        id: true,
        counselor: true,
        category: true,
        description: true,
        notes: true,
        date: true,
        time: true,
        type: true,
        priority: true,
        image: true,
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
    console.error("❌ GET Single Counseling Event Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 PUT — update event
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const existingEvent = await prisma.counselingEvent.findUnique({ 
      where: { id } 
    });
    
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    
    const updateData = {
      counselor: formData.get("counselor")?.trim() || existingEvent.counselor,
      category: formData.get("category")?.trim() || existingEvent.category,
      description: formData.get("description")?.trim() || existingEvent.description,
      notes: formData.get("notes")?.trim() || existingEvent.notes,
      time: formData.get("time")?.trim() || existingEvent.time,
      type: formData.get("type")?.trim() || existingEvent.type,
      priority: formData.get("priority")?.trim() || existingEvent.priority,
      updatedAt: new Date(),
    };

    // Handle date if provided
    const dateStr = formData.get("date");
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        updateData.date = date;
      }
    }

    // Handle image update with Cloudinary
    const file = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";
    
    if (file && file.size > 0) {
      console.log('🔄 Updating counseling event image on Cloudinary...');
      
      // Delete old image if exists
      if (existingEvent.image) {
        await deleteImageFromCloudinary(existingEvent.image);
      }
      
      // Upload new image to Cloudinary
      const result = await uploadImageToCloudinary(file);
      if (result) {
        updateData.image = result.secure_url;
        console.log('✅ Image updated on Cloudinary:', result.secure_url);
      }
    } else if (removeImage && existingEvent.image) {
      console.log('🗑️ Removing counseling event image from Cloudinary...');
      
      // Delete existing image from Cloudinary
      await deleteImageFromCloudinary(existingEvent.image);
      updateData.image = null;
      console.log('✅ Image removed from Cloudinary');
    }

    // Update database record
    const updatedEvent = await prisma.counselingEvent.update({ 
      where: { id }, 
      data: updateData,
      select: {
        id: true,
        counselor: true,
        category: true,
        description: true,
        notes: true,
        date: true,
        time: true,
        type: true,
        priority: true,
        image: true,
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
    console.error("❌ PUT Counseling Event Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 DELETE — remove event
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const existingEvent = await prisma.counselingEvent.findUnique({ 
      where: { id } 
    });
    
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if exists
    if (existingEvent.image) {
      console.log('🗑️ Deleting counseling event image from Cloudinary...');
      await deleteImageFromCloudinary(existingEvent.image);
      console.log('✅ Image deleted from Cloudinary');
    }

    // Delete from database
    await prisma.counselingEvent.delete({ 
      where: { id } 
    });
    
    console.log('✅ Counseling event deleted from database');
    
    return NextResponse.json({ 
      success: true, 
      message: "Event deleted successfully",
      deletedEvent: {
        id: existingEvent.id,
        counselor: existingEvent.counselor,
        category: existingEvent.category,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Counseling Event Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}