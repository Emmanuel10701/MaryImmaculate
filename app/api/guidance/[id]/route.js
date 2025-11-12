import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile, unlink } from "fs/promises";
import { randomUUID } from "crypto";

// Upload folder setup
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Helper: delete old files
async function deleteFiles(filePaths) {
  if (!Array.isArray(filePaths)) return;
  for (const filePath of filePaths) {
    try {
      const fullPath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""));
      if (fs.existsSync(fullPath)) await unlink(fullPath);
    } catch (error) {
      console.error(`❌ Error deleting file ${filePath}:`, error);
    }
  }
}

// Helper: upload files
async function uploadFile(file) {
  if (!file || !file.name || file.size === 0) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

// 🔹 GET single event
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });

    const event = await prisma.counselingEvent.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 PUT — update event
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });

    const existingEvent = await prisma.counselingEvent.findUnique({ where: { id } });
    if (!existingEvent) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });

    const formData = await req.formData();
    const updateData = {
      counselor: formData.get("counselor"),
      category: formData.get("category"),
      description: formData.get("description"),
      notes: formData.get("notes") || null,
      date: formData.get("date") ? new Date(formData.get("date")) : undefined,
      time: formData.get("time"),
      type: formData.get("type"),
      priority: formData.get("priority"),
    };

    // Handle optional file
    const file = formData.get("image");
    if (file && file.size > 0) {
      // Delete old file if exists
      if (existingEvent.image) await deleteFiles([existingEvent.image]);
      updateData.image = await uploadFile(file);
    }

    const updatedEvent = await prisma.counselingEvent.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 DELETE — remove event
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });

    const existingEvent = await prisma.counselingEvent.findUnique({ where: { id } });
    if (!existingEvent) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });

    // Delete image if exists
    if (existingEvent.image) await deleteFiles([existingEvent.image]);

    await prisma.counselingEvent.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
