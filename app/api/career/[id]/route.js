import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";

// Helper functions
const parseNumber = (value) => {
  if (!value || value.toString().trim() === '') return null;
  const num = parseInt(value);
  return isNaN(num) ? null : num;
};

const parseDate = (dateString) => {
  if (!dateString || dateString.trim() === '') return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// --------------------- GET single job ---------------------
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const job = await prisma.careerJob.findUnique({ where: { id } });
    if (!job) return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("❌ GET single Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}

// --------------------- PUT / Update job ---------------------
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    const job = await prisma.careerJob.update({
      where: { id },
      data: {
        jobTitle: data.jobTitle,
        department: data.department,
        category: data.category,
        jobDescription: data.jobDescription,
        requirements: data.requirements,
        experience: data.experience,
        qualifications: data.qualifications,
        positionsAvailable: parseNumber(data.positionsAvailable),
        jobType: data.jobType,
        applicationDeadline: parseDate(data.applicationDeadline),
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
      },
    });

    return NextResponse.json({ success: true, message: "Job updated successfully", job });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}

// --------------------- DELETE / Delete job ---------------------
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const job = await prisma.careerJob.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Job deleted successfully", job });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}
