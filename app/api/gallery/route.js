import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public/gallery");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET all galleries
export async function GET() {
  try {
    const galleries = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, galleries });
  } catch (error) {
    console.error("❌ GET Gallery Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}

// 🔹 POST new gallery
export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category"); // Single category field

    if (!title || !category) {
      return NextResponse.json(
        { success: false, error: "Title and category are required" },
        { status: 400 }
      );
    }

    // Valid categories (removed CAMPUS and LIBRARY)
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

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    // Handle multiple files (images/videos)
    const files = [];
    const fileEntries = formData.getAll("files");
    
    if (fileEntries.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one file is required" },
        { status: 400 }
      );
    }

    for (const file of fileEntries) {
      if (file && file.size > 0) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mpeg'];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { success: false, error: `Invalid file type: ${file.type}` },
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
        const fileName = `${randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        files.push(`/gallery/${fileName}`);
      }
    }

    // Create gallery entry
    const newGallery = await prisma.galleryImage.create({
      data: { 
        title, 
        description, 
        category, // Single category field
        files 
      },
    });

    return NextResponse.json({ 
      success: true, 
      gallery: newGallery,
      message: "Gallery image uploaded successfully" 
    });
  } catch (error) {
    console.error("❌ POST Gallery Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to upload gallery image" 
    }, { status: 500 });
  }
}