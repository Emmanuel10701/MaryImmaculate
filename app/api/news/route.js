import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";

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
    // Silent fail on delete
  }
};

// 🔹 GET all news - CLEAN VERSION
export async function GET() {
  try {
    const newsList = await prisma.news.findMany({
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        date: true,
        category: true,
        author: true,
        image: true,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      data: newsList 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch news" 
    }, { status: 500 });
  }
}

// 🔹 POST new news item - CLEAN VERSION
export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.trim() || "";
    const excerpt = formData.get("excerpt")?.trim() || "";
    const fullContent = formData.get("fullContent")?.trim() || "";
    const dateStr = formData.get("date");
    const category = formData.get("category")?.trim() || "General";
    const author = formData.get("author")?.trim() || "Admin";

    // Validate required fields
    if (!title || !excerpt || !fullContent || !dateStr) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Parse date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date" },
        { status: 400 }
      );
    }

    // Handle image upload
    let imageUrl = null;
    const file = formData.get("image");
    
    if (file && file.size > 0) {
      const result = await uploadImageToCloudinary(file);
      if (result) {
        imageUrl = result.secure_url;
      }
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        excerpt,
        fullContent,
        date,
        category,
        author,
        image: imageUrl,
      },
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
      data: newNews 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create news" 
    }, { status: 500 });
  }
}