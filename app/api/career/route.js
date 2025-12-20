import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";

// Validate required fields
const validateJobFields = (data) => {
  const required = [
    'jobTitle', 'department', 'category', 'jobDescription',
    'requirements', 'experience', 'qualifications',
    'positionsAvailable', 'jobType', 'applicationDeadline'
  ];

  const missing = required.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

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

// --------------------- POST / Create Job ---------------------
// --------------------- POST / Create Job ---------------------
export async function POST(req) {
  try {
    const data = await req.json();
    try {
      validateJobFields(data);
    } catch (validationError) {
      return NextResponse.json({ success: false, error: validationError.message }, { status: 400 });
    }

    const job = await prisma.careerJob.create({
      data: {
        jobTitle: data.jobTitle,
        department: data.department,
        category: data.category,
        jobDescription: data.jobDescription,
        requirements: data.requirements,
        experience: data.experience,
        qualifications: data.qualifications,
        positionsAvailable: parseNumber(data.positionsAvailable) || 1,
        jobType: data.jobType,
        applicationDeadline: parseDate(data.applicationDeadline),
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
      },
    });

    // Return all fields
    return NextResponse.json({
      success: true,
      message: "Job created successfully",
      job, // includes all fields from Prisma model, including id
    });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}

// --------------------- GET / List Jobs ---------------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const department = searchParams.get('department');
    const jobType = searchParams.get('jobType');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const where = {};

    if (category) where.category = category;
    if (department) where.department = department;
    if (jobType) where.jobType = jobType;

    if (search) {
      where.OR = [
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { jobDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.careerJob.count({ where });

    const jobs = await prisma.careerJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Return all fields directly
    return NextResponse.json({
      success: true,
      jobs, // each job includes all Prisma fields: id, jobTitle, department, jobDescription, etc.
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}

