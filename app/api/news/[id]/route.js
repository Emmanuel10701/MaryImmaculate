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

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "school_news",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 1200, height: 800, crop: "fill" },
            { quality: "auto:good" }
          ]
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

// Helper: Delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl?.includes('cloudinary.com')) return;

  try {
    const urlMatch = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    if (!urlMatch) return;
    
    const publicId = urlMatch[1];
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch {
    // Silent fail
  }
};

// 🔹 GET single news item - CLEAN VERSION
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 }
      );
    }

    const newsItem = await prisma.news.findUnique({ 
      where: { id },
      select: {
        id: true,
        title: true,
        excerpt: true,
        fullContent: true,
        date: true,
        category: true,
        author: true,
        image: true,
      }
    });

    if (!newsItem) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: newsItem 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch news" 
    }, { status: 500 });
  }
}

// 🔹 PUT (update) news item - CLEAN VERSION
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 }
      );
    }

    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const updateData = {};

    // Basic fields
    const title = formData.get("title")?.trim();
    const excerpt = formData.get("excerpt")?.trim();
    const fullContent = formData.get("fullContent")?.trim();
    const dateStr = formData.get("date");
    const category = formData.get("category")?.trim();
    const author = formData.get("author")?.trim();

    if (title !== null) updateData.title = title;
    if (excerpt !== null) updateData.excerpt = excerpt;
    if (fullContent !== null) updateData.fullContent = fullContent;
    if (category !== null) updateData.category = category;
    if (author !== null) updateData.author = author;
    
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        updateData.date = date;
      }
    }

    // Handle image
    const file = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";
    
    if (file && file.size > 0) {
      if (existingNews.image) {
        await deleteImageFromCloudinary(existingNews.image);
      }
      
      const result = await uploadImageToCloudinary(file);
      if (result) {
        updateData.image = result.secure_url;
      }
    } else if (removeImage && existingNews.image) {
      await deleteImageFromCloudinary(existingNews.image);
      updateData.image = null;
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        excerpt: true,
        date: true,
        category: true,
        author: true,
        image: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedNews 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to update news" 
    }, { status: 500 });
  }
}

// 🔹 DELETE news item - CLEAN VERSION
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 }
      );
    }

    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    if (existingNews.image) {
      await deleteImageFromCloudinary(existingNews.image);
    }

    await prisma.news.delete({ where: { id } });

    return NextResponse.json({ 
      success: true 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to delete news" 
    }, { status: 500 });
  }
}