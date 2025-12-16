import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { mkdirSync, existsSync } from "fs";

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

const videoDir = path.join(process.cwd(), "public/infomation/videos");
const pdfDir = path.join(process.cwd(), "public/infomation/curriculum");

ensureDir(videoDir);
ensureDir(pdfDir);

// Helper function to validate required fields
const validateRequiredFields = (formData) => {
  const required = [
    'name', 'studentCount', 'staffCount', 'feesBoarding', 'feesDay',
    'feesDistribution', 'openDate', 'closeDate', 'subjects', 'departments'
  ];
  
  const missing = required.filter(field => !formData.get(field));
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

// Helper function to delete old files
const deleteOldFile = async (filePath) => {
  if (filePath && !filePath.startsWith('http') && !filePath.includes('youtube.com') && !filePath.includes('youtu.be')) {
    try {
      const fullPath = path.join(process.cwd(), 'public', filePath);
      if (existsSync(fullPath)) {
        await unlink(fullPath);
      }
    } catch (error) {
      console.warn('⚠️ Could not delete old file:', error);
    }
  }
};

// Helper to validate YouTube URL
const isValidYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
};

// Helper function to parse and validate date
const parseDate = (dateString) => {
  if (!dateString || dateString.trim() === '') {
    return null;
  }
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Helper function to parse numeric fields
const parseNumber = (value) => {
  if (!value || value.trim() === '') {
    return null;
  }
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

// Helper function to parse integer fields
const parseIntField = (value) => {
  if (!value || value.trim() === '') {
    return null;
  }
  const num = parseInt(value);
  return isNaN(num) ? null : num;
};

// 🟢 CREATE (only once)
export async function POST(req) {
  try {
    const existing = await prisma.schoolInfo.findFirst();
    if (existing) {
      return NextResponse.json(
        { success: false, message: "School info already exists. Please update instead." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    
    // Validate required fields
    try {
      validateRequiredFields(formData);
    } catch (validationError) {
      return NextResponse.json(
        { success: false, error: validationError.message },
        { status: 400 }
      );
    }

    const name = formData.get("name");
    const description = formData.get("description");
    const youtubeLink = formData.get("youtubeLink");
    const videoTour = formData.get("videoTour");
    const curriculumPDF = formData.get("curriculumPDF");

    // Parse admission fields
    const admissionOpenDate = parseDate(formData.get("admissionOpenDate"));
    const admissionCloseDate = parseDate(formData.get("admissionCloseDate"));
    const admissionRequirements = formData.get("admissionRequirements");
    const admissionFee = parseNumber(formData.get("admissionFee"));
    const admissionCapacity = parseIntField(formData.get("admissionCapacity"));
    const admissionContactEmail = formData.get("admissionContactEmail");
    const admissionContactPhone = formData.get("admissionContactPhone");
    const admissionWebsite = formData.get("admissionWebsite");
    const admissionLocation = formData.get("admissionLocation");
    const admissionOfficeHours = formData.get("admissionOfficeHours");

    let videoPath = null;
    let videoType = null;

    // Validate video input (only one allowed)
    if (youtubeLink && videoTour) {
      return NextResponse.json(
        { success: false, error: "Please provide either YouTube link OR video file, not both." },
        { status: 400 }
      );
    }

    // If YouTube link is provided
    if (youtubeLink) {
      if (!isValidYouTubeUrl(youtubeLink)) {
        return NextResponse.json(
          { success: false, error: "Invalid YouTube URL format. Please provide a valid YouTube watch URL or youtu.be link." },
          { status: 400 }
        );
      }
      videoPath = youtubeLink;
      videoType = "youtube";
    }
    // If local MP4 file upload
    else if (videoTour && videoTour.size > 0) {
      // Validate file type
      const allowedVideoTypes = ['video/mp4'];
      if (!allowedVideoTypes.includes(videoTour.type)) {
        return NextResponse.json(
          { success: false, error: "Invalid video format. Only MP4 files are allowed." },
          { status: 400 }
        );
      }

      // Validate file size (100MB limit)
      const maxSize = 100 * 1024 * 1024;
      if (videoTour.size > maxSize) {
        return NextResponse.json(
          { success: false, error: "Video file too large. Maximum size: 100MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await videoTour.arrayBuffer());
      const fileName = `${Date.now()}_${videoTour.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `/infomation/videos/${fileName}`;
      await writeFile(path.join(process.cwd(), "public", filePath), buffer);
      videoPath = filePath;
      videoType = "file";
    }

    // Curriculum PDF upload
    let curriculumPath = null;
    if (curriculumPDF && curriculumPDF.size > 0) {
      // Validate file type
      if (curriculumPDF.type !== 'application/pdf') {
        return NextResponse.json(
          { success: false, error: "Only PDF files are allowed for curriculum" },
          { status: 400 }
        );
      }

      // Validate file size (20MB limit)
      const maxSize = 20 * 1024 * 1024;
      if (curriculumPDF.size > maxSize) {
        return NextResponse.json(
          { success: false, error: "PDF file too large. Maximum size: 20MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await curriculumPDF.arrayBuffer());
      const fileName = `${Date.now()}_${curriculumPDF.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `/infomation/curriculum/${fileName}`;
      await writeFile(path.join(process.cwd(), "public", filePath), buffer);
      curriculumPath = filePath;
    }

    // Parse JSON fields with error handling
    let feesDistribution, subjects, departments, admissionDocumentsRequired;
    try {
      feesDistribution = JSON.parse(formData.get("feesDistribution"));
      subjects = JSON.parse(formData.get("subjects"));
      departments = JSON.parse(formData.get("departments"));
      
      // Parse admission documents if provided
      const admissionDocsStr = formData.get("admissionDocumentsRequired");
      if (admissionDocsStr) {
        admissionDocumentsRequired = JSON.parse(admissionDocsStr);
      }
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON format in one of the JSON fields" },
        { status: 400 }
      );
    }

    const school = await prisma.schoolInfo.create({
      data: {
        name,
        description: description || null,
        videoTour: videoPath,
        videoType,
        studentCount: Number(formData.get("studentCount")),
        staffCount: Number(formData.get("staffCount")),
        feesBoarding: parseFloat(formData.get("feesBoarding")),
        feesDay: parseFloat(formData.get("feesDay")),
        feesDistribution,
        openDate: new Date(formData.get("openDate")),
        closeDate: new Date(formData.get("closeDate")),
        subjects,
        departments,
        curriculumPDF: curriculumPath,
        
        // Admission fields
        admissionOpenDate,
        admissionCloseDate,
        admissionRequirements,
        admissionFee,
        admissionCapacity,
        admissionContactEmail,
        admissionContactPhone,
        admissionWebsite,
        admissionLocation,
        admissionOfficeHours,
        admissionDocumentsRequired: admissionDocumentsRequired || [],
      },
    });

    return NextResponse.json({ 
      success: true, 
      school: {
        ...school,
        feesDistribution: typeof school.feesDistribution === 'object' ? school.feesDistribution : JSON.parse(school.feesDistribution),
        subjects: typeof school.subjects === 'object' ? school.subjects : JSON.parse(school.subjects),
        departments: typeof school.departments === 'object' ? school.departments : JSON.parse(school.departments),
        admissionDocumentsRequired: typeof school.admissionDocumentsRequired === 'object' 
          ? school.admissionDocumentsRequired 
          : (school.admissionDocumentsRequired ? JSON.parse(school.admissionDocumentsRequired) : []),
      }
    });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}

// 🟡 GET school info
export async function GET() {
  try {
    const school = await prisma.schoolInfo.findFirst();
    if (!school) {
      return NextResponse.json(
        { success: false, message: "No school info found" }, 
        { status: 404 }
      );
    }

    // Parse JSON fields for response
    const responseSchool = {
      ...school,
      feesDistribution: typeof school.feesDistribution === 'object' ? school.feesDistribution : JSON.parse(school.feesDistribution),
      subjects: typeof school.subjects === 'object' ? school.subjects : JSON.parse(school.subjects),
      departments: typeof school.departments === 'object' ? school.departments : JSON.parse(school.departments),
      admissionDocumentsRequired: typeof school.admissionDocumentsRequired === 'object' 
        ? school.admissionDocumentsRequired 
        : (school.admissionDocumentsRequired ? JSON.parse(school.admissionDocumentsRequired) : []),
    };

    return NextResponse.json({ success: true, school: responseSchool });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}

// 🟠 PUT update existing info
export async function PUT(req) {
  try {
    const existing = await prisma.schoolInfo.findFirst();
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "No school info to update." }, 
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const youtubeLink = formData.get("youtubeLink");
    const videoTour = formData.get("videoTour");
    const curriculumPDF = formData.get("curriculumPDF");

    // Parse admission fields
    const admissionOpenDate = parseDate(formData.get("admissionOpenDate"));
    const admissionCloseDate = parseDate(formData.get("admissionCloseDate"));
    const admissionRequirements = formData.get("admissionRequirements");
    const admissionFee = parseNumber(formData.get("admissionFee"));
    const admissionCapacity = parseIntField(formData.get("admissionCapacity"));
    const admissionContactEmail = formData.get("admissionContactEmail");
    const admissionContactPhone = formData.get("admissionContactPhone");
    const admissionWebsite = formData.get("admissionWebsite");
    const admissionLocation = formData.get("admissionLocation");
    const admissionOfficeHours = formData.get("admissionOfficeHours");

    let videoPath = existing.videoTour;
    let videoType = existing.videoType;

    // Validate video input (only one allowed)
    if (youtubeLink && videoTour && videoTour.size > 0) {
      return NextResponse.json(
        { success: false, error: "Please provide either YouTube link OR video file, not both." },
        { status: 400 }
      );
    }

    // Handle video updates
    if (youtubeLink) {
      // Delete old video file if exists (if it was a local file)
      if (existing.videoType === 'file' && existing.videoTour) {
        await deleteOldFile(existing.videoTour);
      }
      
      if (!isValidYouTubeUrl(youtubeLink)) {
        return NextResponse.json(
          { success: false, error: "Invalid YouTube URL format. Please provide a valid YouTube watch URL or youtu.be link." },
          { status: 400 }
        );
      }
      videoPath = youtubeLink;
      videoType = "youtube";
    } else if (videoTour && videoTour.size > 0) {
      // Delete old video file if exists
      if (existing.videoType === 'file' && existing.videoTour) {
        await deleteOldFile(existing.videoTour);
      }

      // Validate file type
      const allowedVideoTypes = ['video/mp4'];
      if (!allowedVideoTypes.includes(videoTour.type)) {
        return NextResponse.json(
          { success: false, error: "Invalid video format. Only MP4 files are allowed." },
          { status: 400 }
        );
      }

      // Validate file size (100MB limit)
      const maxSize = 100 * 1024 * 1024;
      if (videoTour.size > maxSize) {
        return NextResponse.json(
          { success: false, error: "Video file too large. Maximum size: 100MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await videoTour.arrayBuffer());
      const fileName = `${Date.now()}_${videoTour.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `/infomation/videos/${fileName}`;
      await writeFile(path.join(process.cwd(), "public", filePath), buffer);
      videoPath = filePath;
      videoType = "file";
    }

    // Handle curriculum PDF updates
    let curriculumPath = existing.curriculumPDF;
    if (curriculumPDF && curriculumPDF.size > 0) {
      // Delete old PDF file if exists
      if (existing.curriculumPDF) {
        await deleteOldFile(existing.curriculumPDF);
      }

      // Validate file type
      if (curriculumPDF.type !== 'application/pdf') {
        return NextResponse.json(
          { success: false, error: "Only PDF files are allowed for curriculum" },
          { status: 400 }
        );
      }

      // Validate file size (20MB limit)
      const maxSize = 20 * 1024 * 1024;
      if (curriculumPDF.size > maxSize) {
        return NextResponse.json(
          { success: false, error: "PDF file too large. Maximum size: 20MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await curriculumPDF.arrayBuffer());
      const fileName = `${Date.now()}_${curriculumPDF.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `/infomation/curriculum/${fileName}`;
      await writeFile(path.join(process.cwd(), "public", filePath), buffer);
      curriculumPath = filePath;
    }

    // Parse JSON fields with error handling
    let feesDistribution = existing.feesDistribution;
    let subjects = existing.subjects;
    let departments = existing.departments;
    let admissionDocumentsRequired = existing.admissionDocumentsRequired;

    if (formData.get("feesDistribution")) {
      try {
        feesDistribution = JSON.parse(formData.get("feesDistribution"));
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: "Invalid JSON format in feesDistribution" },
          { status: 400 }
        );
      }
    }

    if (formData.get("subjects")) {
      try {
        subjects = JSON.parse(formData.get("subjects"));
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: "Invalid JSON format in subjects" },
          { status: 400 }
        );
      }
    }

    if (formData.get("departments")) {
      try {
        departments = JSON.parse(formData.get("departments"));
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: "Invalid JSON format in departments" },
          { status: 400 }
        );
      }
    }

    if (formData.get("admissionDocumentsRequired")) {
      try {
        admissionDocumentsRequired = JSON.parse(formData.get("admissionDocumentsRequired"));
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: "Invalid JSON format in admissionDocumentsRequired" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.schoolInfo.update({
      where: { id: existing.id },
      data: {
        name: formData.get("name") || existing.name,
        description: formData.get("description") || existing.description,
        videoTour: videoPath,
        videoType,
        studentCount: formData.get("studentCount") ? Number(formData.get("studentCount")) : existing.studentCount,
        staffCount: formData.get("staffCount") ? Number(formData.get("staffCount")) : existing.staffCount,
        feesBoarding: formData.get("feesBoarding") ? parseFloat(formData.get("feesBoarding")) : existing.feesBoarding,
        feesDay: formData.get("feesDay") ? parseFloat(formData.get("feesDay")) : existing.feesDay,
        feesDistribution,
        openDate: formData.get("openDate") ? new Date(formData.get("openDate")) : existing.openDate,
        closeDate: formData.get("closeDate") ? new Date(formData.get("closeDate")) : existing.closeDate,
        subjects,
        departments,
        curriculumPDF: curriculumPath,
        
        // Admission fields - update only if provided
        admissionOpenDate: admissionOpenDate !== undefined ? admissionOpenDate : existing.admissionOpenDate,
        admissionCloseDate: admissionCloseDate !== undefined ? admissionCloseDate : existing.admissionCloseDate,
        admissionRequirements: admissionRequirements !== null ? admissionRequirements : existing.admissionRequirements,
        admissionFee: admissionFee !== null ? admissionFee : existing.admissionFee,
        admissionCapacity: admissionCapacity !== null ? admissionCapacity : existing.admissionCapacity,
        admissionContactEmail: admissionContactEmail !== null ? admissionContactEmail : existing.admissionContactEmail,
        admissionContactPhone: admissionContactPhone !== null ? admissionContactPhone : existing.admissionContactPhone,
        admissionWebsite: admissionWebsite !== null ? admissionWebsite : existing.admissionWebsite,
        admissionLocation: admissionLocation !== null ? admissionLocation : existing.admissionLocation,
        admissionOfficeHours: admissionOfficeHours !== null ? admissionOfficeHours : existing.admissionOfficeHours,
        admissionDocumentsRequired: admissionDocumentsRequired !== undefined ? admissionDocumentsRequired : existing.admissionDocumentsRequired,
      },
    });

    return NextResponse.json({ 
      success: true, 
      school: {
        ...updated,
        feesDistribution: typeof updated.feesDistribution === 'object' ? updated.feesDistribution : JSON.parse(updated.feesDistribution),
        subjects: typeof updated.subjects === 'object' ? updated.subjects : JSON.parse(updated.subjects),
        departments: typeof updated.departments === 'object' ? updated.departments : JSON.parse(updated.departments),
        admissionDocumentsRequired: typeof updated.admissionDocumentsRequired === 'object' 
          ? updated.admissionDocumentsRequired 
          : (updated.admissionDocumentsRequired ? JSON.parse(updated.admissionDocumentsRequired) : []),
      }
    });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}

// 🔴 DELETE all info
export async function DELETE() {
  try {
    const existing = await prisma.schoolInfo.findFirst();
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "No school info to delete" }, 
        { status: 404 }
      );
    }

    // Delete associated files
    if (existing.videoType === 'file' && existing.videoTour) {
      await deleteOldFile(existing.videoTour);
    }
    if (existing.curriculumPDF) {
      await deleteOldFile(existing.curriculumPDF);
    }

    await prisma.schoolInfo.deleteMany();
    return NextResponse.json({ 
      success: true, 
      message: "School info deleted successfully" 
    });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}