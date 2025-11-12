import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 GET all events
export async function GET() {
  try {
    const events = await prisma.counselingEvent.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch counseling events" },
      { status: 500 }
    );
  }
}

// 🔹 POST new event
export async function POST(req) {
  try {
    const formData = await req.formData();

    const counselor = formData.get("counselor");
    const category = formData.get("category");
    const description = formData.get("description");
    const notes = formData.get("notes") || null;
    const date = new Date(formData.get("date"));
    const time = formData.get("time");
    const type = formData.get("type");
    const priority = formData.get("priority");

    // Handle optional file upload
    let imagePath = null;
    const file = formData.get("image");

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${randomUUID()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const newEvent = await prisma.counselingEvent.create({
      data: {
        counselor,
        category,
        description,
        notes,
        date,
        time,
        type,
        priority,
        image: imagePath,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Counseling event recorded successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
