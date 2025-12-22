// app/api/school/route.js
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
const pdfDir = path.join(process.cwd(), "public/infomation/pdfs");
const thumbnailDir = path.join(process.cwd(), "public/infomation/thumbnails");
const dayFeesDir = path.join(pdfDir, "day-fees");
const boardingFeesDir = path.join(pdfDir, "boarding-fees");
const curriculumDir = path.join(pdfDir, "curriculum");
const admissionDir = path.join(pdfDir, "admission");
const examResultsDir = path.join(pdfDir, "exam-results");

// Create all directories
[pdfDir, videoDir, thumbnailDir, dayFeesDir, boardingFeesDir, curriculumDir, admissionDir, examResultsDir].forEach(dir => ensureDir(dir));

// Helper function to validate required fields
const validateRequiredFields = (formData) => {
  const required = [
    'name', 'studentCount', 'staffCount', 
    'openDate', 'closeDate', 'subjects', 'departments'
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
  if (!url || url.trim() === '') return false;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url.trim());
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

// Helper function to parse JSON fields
const parseJsonField = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (parseError) {
    throw new Error(`Invalid JSON format in ${fieldName}: ${parseError.message}`);
  }
};

// Helper to parse fee distribution JSON specifically
const parseFeeDistributionJson = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return null;
  }
  try {
    const parsed = JSON.parse(value);
    // Validate it's an object (not array or other types)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error(`${fieldName} must be a JSON object`);
    }
    return parsed;
  } catch (parseError) {
    throw new Error(`Invalid JSON format in ${fieldName}: ${parseError.message}`);
  }
};

// MAIN PDF UPLOAD HANDLER
const handlePdfUpload = async (pdfFile, uploadDir, fieldName, existingFilePath = null) => {
  if (!pdfFile || pdfFile.size === 0) {
    return {
      path: existingFilePath,
      name: null,
      size: null
    };
  }

  // Delete old file if exists
  if (existingFilePath) {
    await deleteOldFile(existingFilePath);
  }

  // Validate file type
  if (pdfFile.type !== 'application/pdf') {
    throw new Error(`Only PDF files are allowed for ${fieldName}`);
  }

  // Validate file size (20MB limit)
  const maxSize = 20 * 1024 * 1024;
  if (pdfFile.size > maxSize) {
    throw new Error(`${fieldName} PDF file too large. Maximum size: 20MB`);
  }

  const buffer = Buffer.from(await pdfFile.arrayBuffer());
  const fileName = `${Date.now()}_${fieldName}_${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `/infomation/pdfs/${uploadDir}/${fileName}`;
  
  await writeFile(path.join(process.cwd(), "public", filePath), buffer);
  
  return {
    path: filePath,
    name: pdfFile.name,
    size: pdfFile.size
  };
};

// Helper to handle thumbnail upload (for MP4 videos only)
const handleThumbnailUpload = async (thumbnailData, existingThumbnail = null) => {
  if (!thumbnailData || thumbnailData.trim() === '') {
    // Delete old thumbnail if exists
    if (existingThumbnail) {
      await deleteOldFile(existingThumbnail);
    }
    return null;
  }

  // Check if it's a data URL (base64)
  if (thumbnailData.startsWith('data:image/')) {
    // Delete old thumbnail if exists
    if (existingThumbnail) {
      await deleteOldFile(existingThumbnail);
    }

    // Extract base64 data
    const matches = thumbnailData.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 thumbnail data");
    }

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Validate file size (max 2MB for thumbnails)
    if (buffer.length > 2 * 1024 * 1024) {
      throw new Error("Thumbnail too large. Maximum size: 2MB");
    }

    const fileName = `thumbnail_${Date.now()}.${extension}`;
    const filePath = `/infomation/thumbnails/${fileName}`;
    
    await writeFile(path.join(process.cwd(), "public", filePath), buffer);
    return {
      path: filePath,
      type: 'generated'
    };
  }

  // If it's already a file path, return as-is
  return {
    path: thumbnailData,
    type: 'existing'
  };
};

// Helper to handle video upload with thumbnail support
const handleVideoUpload = async (youtubeLink, videoTourFile, thumbnailData, existingVideo = null, existingThumbnail = null) => {
  let videoPath = existingVideo?.videoTour || null;
  let videoType = existingVideo?.videoType || null;
  let thumbnailPath = existingThumbnail?.path || null;
  let thumbnailType = existingThumbnail?.type || null;

  // Handle thumbnail first (if provided) - ONLY for MP4 videos
  if (thumbnailData !== undefined && thumbnailData !== null) {
    try {
      const thumbnailResult = await handleThumbnailUpload(thumbnailData, existingThumbnail?.path);
      if (thumbnailResult) {
        thumbnailPath = thumbnailResult.path;
        thumbnailType = thumbnailResult.type;
      } else {
        thumbnailPath = null;
        thumbnailType = null;
      }
    } catch (thumbnailError) {
      console.warn('Thumbnail upload failed:', thumbnailError.message);
      // Don't fail the whole upload if thumbnail fails
    }
  }

  // If YouTube link is provided
  if (youtubeLink !== null && youtubeLink !== undefined) {
    if (youtubeLink.trim() !== '') {
      // Delete old video file if exists (if it was a local file)
      if (existingVideo?.videoType === 'file' && existingVideo?.videoTour) {
        await deleteOldFile(existingVideo.videoTour);
      }
      
      // Clear thumbnail when switching to YouTube
      if (existingThumbnail?.path) {
        await deleteOldFile(existingThumbnail.path);
        thumbnailPath = null;
        thumbnailType = null;
      }
      
      if (!isValidYouTubeUrl(youtubeLink)) {
        throw new Error("Invalid YouTube URL format. Please provide a valid YouTube watch URL or youtu.be link.");
      }
      videoPath = youtubeLink.trim();
      videoType = "youtube";
    } else if (existingVideo?.videoType === 'youtube') {
      videoPath = null;
      videoType = null;
    }
  }
  
  // If local video file upload is provided (MP4 mode)
  if (videoTourFile && videoTourFile.size > 0) {
    // Delete old video file if exists
    if (existingVideo?.videoTour && existingVideo?.videoType === 'file') {
      await deleteOldFile(existingVideo.videoTour);
    }

    // Validate file type
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedVideoTypes.includes(videoTourFile.type)) {
      throw new Error("Invalid video format. Only MP4, WebM, and OGG files are allowed.");
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (videoTourFile.size > maxSize) {
      throw new Error("Video file too large. Maximum size: 100MB");
    }

    const buffer = Buffer.from(await videoTourFile.arrayBuffer());
    const fileName = `${Date.now()}_${videoTourFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `/infomation/videos/${fileName}`;
    await writeFile(path.join(process.cwd(), "public", filePath), buffer);
    videoPath = filePath;
    videoType = "file";
    
    // If no thumbnail was provided with MP4 upload, clear any existing thumbnail
    if (thumbnailData === undefined && existingThumbnail?.path) {
      await deleteOldFile(existingThumbnail.path);
      thumbnailPath = null;
      thumbnailType = null;
    }
  }

  // If video is being removed completely, also remove thumbnail
  if ((!youtubeLink || youtubeLink.trim() === '') && !videoTourFile && existingVideo?.videoTour) {
    if (existingThumbnail?.path) {
      await deleteOldFile(existingThumbnail.path);
      thumbnailPath = null;
      thumbnailType = null;
    }
  }

  return { videoPath, videoType, thumbnailPath, thumbnailType };
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

    // Handle video upload with thumbnail
    let videoPath = null;
    let videoType = null;
    let thumbnailPath = null;
    let thumbnailType = null;
    try {
      const youtubeLink = formData.get("youtubeLink");
      const videoTour = formData.get("videoTour");
      const thumbnail = formData.get("videoThumbnail");
      const videoResult = await handleVideoUpload(youtubeLink, videoTour, thumbnail);
      videoPath = videoResult.videoPath;
      videoType = videoResult.videoType;
      thumbnailPath = videoResult.thumbnailPath;
      thumbnailType = videoResult.thumbnailType;
    } catch (videoError) {
      return NextResponse.json(
        { success: false, error: videoError.message },
        { status: 400 }
      );
    }

    // Handle ALL PDF uploads
    let pdfUploads = {};
    
    try {
      // Curriculum PDF
      const curriculumPDF = formData.get("curriculumPDF");
      if (curriculumPDF) {
        pdfUploads.curriculum = await handlePdfUpload(curriculumPDF, "curriculum", "curriculum");
      }

      // Day fees PDF
      const feesDayDistributionPdf = formData.get("feesDayDistributionPdf");
      if (feesDayDistributionPdf) {
        pdfUploads.dayFees = await handlePdfUpload(feesDayDistributionPdf, "day-fees", "day_fees");
      }

      // Boarding fees PDF
      const feesBoardingDistributionPdf = formData.get("feesBoardingDistributionPdf");
      if (feesBoardingDistributionPdf) {
        pdfUploads.boardingFees = await handlePdfUpload(feesBoardingDistributionPdf, "boarding-fees", "boarding_fees");
      }

      // Admission fee PDF
      const admissionFeePdf = formData.get("admissionFeePdf");
      if (admissionFeePdf) {
        pdfUploads.admissionFee = await handlePdfUpload(admissionFeePdf, "admission", "admission_fee");
      }

      // Exam results PDFs
      const examFields = [
        { key: 'form1', name: 'form1ResultsPdf', year: 'form1ResultsYear' },
        { key: 'form2', name: 'form2ResultsPdf', year: 'form2ResultsYear' },
        { key: 'form3', name: 'form3ResultsPdf', year: 'form3ResultsYear' },
        { key: 'form4', name: 'form4ResultsPdf', year: 'form4ResultsYear' },
        { key: 'mockExams', name: 'mockExamsResultsPdf', year: 'mockExamsYear' },
        { key: 'kcse', name: 'kcseResultsPdf', year: 'kcseYear' }
      ];

      for (const exam of examFields) {
        const pdfFile = formData.get(exam.name);
        if (pdfFile) {
          pdfUploads[exam.key] = {
            pdfData: await handlePdfUpload(pdfFile, "exam-results", exam.key),
            year: parseIntField(formData.get(exam.year))
          };
        }
      }
    } catch (pdfError) {
      return NextResponse.json(
        { success: false, error: pdfError.message },
        { status: 400 }
      );
    }

    // Parse JSON fields
    let subjects, departments, admissionDocumentsRequired, additionalResultsFiles;
    let feesDayDistributionJson, feesBoardingDistributionJson, admissionFeeDistribution;
    
    try {
      // Parse academic JSON fields
      subjects = parseJsonField(formData.get("subjects") || "[]", "subjects");
      departments = parseJsonField(formData.get("departments") || "[]", "departments");
      
      const admissionDocsStr = formData.get("admissionDocumentsRequired");
      admissionDocumentsRequired = admissionDocsStr ? parseJsonField(admissionDocsStr, "admissionDocumentsRequired") : [];
      
      const additionalResultsStr = formData.get("additionalResultsFiles");
      additionalResultsFiles = additionalResultsStr ? parseJsonField(additionalResultsStr, "additionalResultsFiles") : [];
      
      // Parse fee distribution JSON fields
      const dayDistributionStr = formData.get("feesDayDistributionJson");
      if (dayDistributionStr) {
        feesDayDistributionJson = parseFeeDistributionJson(dayDistributionStr, "feesDayDistributionJson");
      }
      
      const boardingDistributionStr = formData.get("feesBoardingDistributionJson");
      if (boardingDistributionStr) {
        feesBoardingDistributionJson = parseFeeDistributionJson(boardingDistributionStr, "feesBoardingDistributionJson");
      }
      
      const admissionFeeDistributionStr = formData.get("admissionFeeDistribution");
      if (admissionFeeDistributionStr) {
        admissionFeeDistribution = parseFeeDistributionJson(admissionFeeDistributionStr, "admissionFeeDistribution");
      }
      
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: parseError.message },
        { status: 400 }
      );
    }

    const school = await prisma.schoolInfo.create({
      data: {
        name: formData.get("name"),
        description: formData.get("description") || null,
        motto: formData.get("motto") || null,
        vision: formData.get("vision") || null,
        mission: formData.get("mission") || null,
        videoTour: videoPath,
        videoType,
        videoThumbnail: thumbnailPath,
        videoThumbnailType: thumbnailType,
        studentCount: parseIntField(formData.get("studentCount")) || 0,
        staffCount: parseIntField(formData.get("staffCount")) || 0,
        
        // Day School Fees - BOTH JSON AND PDF
        feesDay: parseNumber(formData.get("feesDay")),
        feesDayDistributionJson: feesDayDistributionJson || {},
        feesDayDistributionPdf: pdfUploads.dayFees?.path || null,
        feesDayPdfName: pdfUploads.dayFees?.name || null,
        feesDayPdfSize: pdfUploads.dayFees?.size || null,
        feesDayPdfUploadDate: pdfUploads.dayFees?.path ? new Date() : null,
        
        // Boarding School Fees - BOTH JSON AND PDF
        feesBoarding: parseNumber(formData.get("feesBoarding")),
        feesBoardingDistributionJson: feesBoardingDistributionJson || {},
        feesBoardingDistributionPdf: pdfUploads.boardingFees?.path || null,
        feesBoardingPdfName: pdfUploads.boardingFees?.name || null,
        feesBoardingPdfSize: pdfUploads.boardingFees?.size || null,
        feesBoardingPdfUploadDate: pdfUploads.boardingFees?.path ? new Date() : null,
        
        // Academic Calendar
        openDate: parseDate(formData.get("openDate")) || new Date(),
        closeDate: parseDate(formData.get("closeDate")) || new Date(),
        
        // Academic Information
        subjects,
        departments,
        
        // Curriculum
        curriculumPDF: pdfUploads.curriculum?.path || null,
        curriculumPdfName: pdfUploads.curriculum?.name || null,
        curriculumPdfSize: pdfUploads.curriculum?.size || null,
        
        // Admission Information - BOTH JSON AND PDF
        admissionOpenDate: parseDate(formData.get("admissionOpenDate")),
        admissionCloseDate: parseDate(formData.get("admissionCloseDate")),
        admissionRequirements: formData.get("admissionRequirements") || null,
        admissionFee: parseNumber(formData.get("admissionFee")),
        admissionFeeDistribution: admissionFeeDistribution || {},
        admissionCapacity: parseIntField(formData.get("admissionCapacity")),
        admissionContactEmail: formData.get("admissionContactEmail") || null,
        admissionContactPhone: formData.get("admissionContactPhone") || null,
        admissionWebsite: formData.get("admissionWebsite") || null,
        admissionLocation: formData.get("admissionLocation") || null,
        admissionOfficeHours: formData.get("admissionOfficeHours") || null,
        admissionDocumentsRequired,
        admissionFeePdf: pdfUploads.admissionFee?.path || null,
        admissionFeePdfName: pdfUploads.admissionFee?.name || null,
        
        // Exam Results
        form1ResultsPdf: pdfUploads.form1?.pdfData.path || null,
        form1ResultsPdfName: pdfUploads.form1?.pdfData.name || null,
        form1ResultsPdfSize: pdfUploads.form1?.pdfData.size || null,
        form1ResultsYear: pdfUploads.form1?.year || null,
        
        form2ResultsPdf: pdfUploads.form2?.pdfData.path || null,
        form2ResultsPdfName: pdfUploads.form2?.pdfData.name || null,
        form2ResultsPdfSize: pdfUploads.form2?.pdfData.size || null,
        form2ResultsYear: pdfUploads.form2?.year || null,
        
        form3ResultsPdf: pdfUploads.form3?.pdfData.path || null,
        form3ResultsPdfName: pdfUploads.form3?.pdfData.name || null,
        form3ResultsPdfSize: pdfUploads.form3?.pdfData.size || null,
        form3ResultsYear: pdfUploads.form3?.year || null,
        
        form4ResultsPdf: pdfUploads.form4?.pdfData.path || null,
        form4ResultsPdfName: pdfUploads.form4?.pdfData.name || null,
        form4ResultsPdfSize: pdfUploads.form4?.pdfData.size || null,
        form4ResultsYear: pdfUploads.form4?.year || null,
        
        mockExamsResultsPdf: pdfUploads.mockExams?.pdfData.path || null,
        mockExamsPdfName: pdfUploads.mockExams?.pdfData.name || null,
        mockExamsPdfSize: pdfUploads.mockExams?.pdfData.size || null,
        mockExamsYear: pdfUploads.mockExams?.year || null,
        
        kcseResultsPdf: pdfUploads.kcse?.pdfData.path || null,
        kcsePdfName: pdfUploads.kcse?.pdfData.name || null,
        kcsePdfSize: pdfUploads.kcse?.pdfData.size || null,
        kcseYear: pdfUploads.kcse?.year || null,
        
        // Additional Results
        additionalResultsFiles,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "School info created successfully",
      school: cleanSchoolResponse(school)
    });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}

// 🟡 GET school info - CLEANED RESPONSE
export async function GET() {
  try {
    const school = await prisma.schoolInfo.findFirst();
    if (!school) {
      return NextResponse.json(
        { success: false, message: "No school info found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      school: cleanSchoolResponse(school)
    });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}

// Helper function to clean school response
const cleanSchoolResponse = (school) => {
  // Parse JSON fields
  const subjects = typeof school.subjects === 'object' ? school.subjects : JSON.parse(school.subjects || '[]');
  const departments = typeof school.departments === 'object' ? school.departments : JSON.parse(school.departments || '[]');
  const feesDayDistributionJson = typeof school.feesDayDistributionJson === 'object' ? school.feesDayDistributionJson : JSON.parse(school.feesDayDistributionJson || '{}');
  const feesBoardingDistributionJson = typeof school.feesBoardingDistributionJson === 'object' ? school.feesBoardingDistributionJson : JSON.parse(school.feesBoardingDistributionJson || '{}');
  const admissionFeeDistribution = typeof school.admissionFeeDistribution === 'object' ? school.admissionFeeDistribution : JSON.parse(school.admissionFeeDistribution || '{}');
  const admissionDocumentsRequired = typeof school.admissionDocumentsRequired === 'object' ? school.admissionDocumentsRequired : JSON.parse(school.admissionDocumentsRequired || '[]');
  const additionalResultsFiles = typeof school.additionalResultsFiles === 'object' ? school.additionalResultsFiles : JSON.parse(school.additionalResultsFiles || '[]');

  // Build clean response
  const response = {
    id: school.id,
    name: school.name,
    description: school.description,
    motto: school.motto,
    vision: school.vision,
    mission: school.mission,
    videoTour: school.videoTour,
    videoType: school.videoType,
    videoThumbnail: school.videoThumbnail,
    videoThumbnailType: school.videoThumbnailType,
    studentCount: school.studentCount,
    staffCount: school.staffCount,
    
    // Day School Fees - BOTH JSON AND PDF
    feesDay: school.feesDay,
    feesDayDistribution: feesDayDistributionJson,
    ...(school.feesDayDistributionPdf && { feesDayDistributionPdf: school.feesDayDistributionPdf }),
    ...(school.feesDayPdfName && { feesDayPdfName: school.feesDayPdfName }),
    
    // Boarding School Fees - BOTH JSON AND PDF
    feesBoarding: school.feesBoarding,
    feesBoardingDistribution: feesBoardingDistributionJson,
    ...(school.feesBoardingDistributionPdf && { feesBoardingDistributionPdf: school.feesBoardingDistributionPdf }),
    ...(school.feesBoardingPdfName && { feesBoardingPdfName: school.feesBoardingPdfName }),
    
    // Academic Calendar
    openDate: school.openDate,
    closeDate: school.closeDate,
    
    // Academic Information
    subjects,
    departments,
    
    // Curriculum
    ...(school.curriculumPDF && { curriculumPDF: school.curriculumPDF }),
    ...(school.curriculumPdfName && { curriculumPdfName: school.curriculumPdfName }),
    
    // Admission Information - BOTH JSON AND PDF
    admissionOpenDate: school.admissionOpenDate,
    admissionCloseDate: school.admissionCloseDate,
    admissionRequirements: school.admissionRequirements,
    admissionFee: school.admissionFee,
    admissionFeeDistribution: admissionFeeDistribution,
    admissionCapacity: school.admissionCapacity,
    admissionContactEmail: school.admissionContactEmail,
    admissionContactPhone: school.admissionContactPhone,
    admissionWebsite: school.admissionWebsite,
    admissionLocation: school.admissionLocation,
    admissionOfficeHours: school.admissionOfficeHours,
    admissionDocumentsRequired: admissionDocumentsRequired,
    ...(school.admissionFeePdf && { admissionFeePdf: school.admissionFeePdf }),
    ...(school.admissionFeePdfName && { admissionFeePdfName: school.admissionFeePdfName }),
    
    // Exam Results - Clean format
    examResults: {
      ...(school.form1ResultsPdf && {
        form1: {
          pdf: school.form1ResultsPdf,
          name: school.form1ResultsPdfName,
          year: school.form1ResultsYear
        }
      }),
      ...(school.form2ResultsPdf && {
        form2: {
          pdf: school.form2ResultsPdf,
          name: school.form2ResultsPdfName,
          year: school.form2ResultsYear
        }
      }),
      ...(school.form3ResultsPdf && {
        form3: {
          pdf: school.form3ResultsPdf,
          name: school.form3ResultsPdfName,
          year: school.form3ResultsYear
        }
      }),
      ...(school.form4ResultsPdf && {
        form4: {
          pdf: school.form4ResultsPdf,
          name: school.form4ResultsPdfName,
          year: school.form4ResultsYear
        }
      }),
      ...(school.mockExamsResultsPdf && {
        mockExams: {
          pdf: school.mockExamsResultsPdf,
          name: school.mockExamsPdfName,
          year: school.mockExamsYear
        }
      }),
      ...(school.kcseResultsPdf && {
        kcse: {
          pdf: school.kcseResultsPdf,
          name: school.kcsePdfName,
          year: school.kcseYear
        }
      })
    },
    
    // Additional Results
    ...(additionalResultsFiles.length > 0 && { additionalResultsFiles }),
    
    // Timestamps
    createdAt: school.createdAt,
    updatedAt: school.updatedAt
  };

  // Remove empty examResults object
  if (Object.keys(response.examResults).length === 0) {
    delete response.examResults;
  }

  return response;
};

// 🟠 PUT update existing info - FIXED video update handling
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
    
    // Handle video upload with thumbnail
    let videoPath = existing.videoTour;
    let videoType = existing.videoType;
    let thumbnailPath = existing.videoThumbnail;
    let thumbnailType = existing.videoThumbnailType;
    
    try {
      const youtubeLink = formData.get("youtubeLink");
      const videoTour = formData.get("videoTour");
      const thumbnail = formData.get("videoThumbnail");
      
      const videoResult = await handleVideoUpload(
        youtubeLink, 
        videoTour, 
        thumbnail, 
        existing,
        { path: existing.videoThumbnail, type: existing.videoThumbnailType }
      );
      
      videoPath = videoResult.videoPath !== null ? videoResult.videoPath : existing.videoTour;
      videoType = videoResult.videoType !== null ? videoResult.videoType : existing.videoType;
      thumbnailPath = videoResult.thumbnailPath !== null ? videoResult.thumbnailPath : existing.videoThumbnail;
      thumbnailType = videoResult.thumbnailType !== null ? videoResult.thumbnailType : existing.videoThumbnailType;
    } catch (videoError) {
      return NextResponse.json(
        { success: false, error: videoError.message },
        { status: 400 }
      );
    }

    // Handle ALL PDF uploads
    let pdfUploads = {};
    
    try {
      // Curriculum PDF
      const curriculumPDF = formData.get("curriculumPDF");
      if (curriculumPDF) {
        pdfUploads.curriculum = await handlePdfUpload(curriculumPDF, "curriculum", "curriculum", existing.curriculumPDF);
      }

      // Day fees PDF
      const feesDayDistributionPdf = formData.get("feesDayDistributionPdf");
      if (feesDayDistributionPdf) {
        pdfUploads.dayFees = await handlePdfUpload(feesDayDistributionPdf, "day-fees", "day_fees", existing.feesDayDistributionPdf);
      }

      // Boarding fees PDF
      const feesBoardingDistributionPdf = formData.get("feesBoardingDistributionPdf");
      if (feesBoardingDistributionPdf) {
        pdfUploads.boardingFees = await handlePdfUpload(feesBoardingDistributionPdf, "boarding-fees", "boarding_fees", existing.feesBoardingDistributionPdf);
      }

      // Admission fee PDF
      const admissionFeePdf = formData.get("admissionFeePdf");
      if (admissionFeePdf) {
        pdfUploads.admissionFee = await handlePdfUpload(admissionFeePdf, "admission", "admission_fee", existing.admissionFeePdf);
      }

      // Exam results PDFs
      const examFields = [
        { key: 'form1', name: 'form1ResultsPdf', year: 'form1ResultsYear', existing: existing.form1ResultsPdf },
        { key: 'form2', name: 'form2ResultsPdf', year: 'form2ResultsYear', existing: existing.form2ResultsPdf },
        { key: 'form3', name: 'form3ResultsPdf', year: 'form3ResultsYear', existing: existing.form3ResultsPdf },
        { key: 'form4', name: 'form4ResultsPdf', year: 'form4ResultsYear', existing: existing.form4ResultsPdf },
        { key: 'mockExams', name: 'mockExamsResultsPdf', year: 'mockExamsYear', existing: existing.mockExamsResultsPdf },
        { key: 'kcse', name: 'kcseResultsPdf', year: 'kcseYear', existing: existing.kcseResultsPdf }
      ];

      for (const exam of examFields) {
        const pdfFile = formData.get(exam.name);
        if (pdfFile) {
          pdfUploads[exam.key] = {
            pdfData: await handlePdfUpload(pdfFile, "exam-results", exam.key, exam.existing),
            year: formData.get(exam.year) ? parseIntField(formData.get(exam.year)) : null
          };
        }
      }
    } catch (pdfError) {
      return NextResponse.json(
        { success: false, error: pdfError.message },
        { status: 400 }
      );
    }

    // Parse JSON fields
    let subjects = existing.subjects;
    let departments = existing.departments;
    let admissionDocumentsRequired = existing.admissionDocumentsRequired;
    let additionalResultsFiles = existing.additionalResultsFiles;
    let feesDayDistributionJson = existing.feesDayDistributionJson;
    let feesBoardingDistributionJson = existing.feesBoardingDistributionJson;
    let admissionFeeDistribution = existing.admissionFeeDistribution;

    // Parse subjects
    if (formData.get("subjects")) {
      try {
        subjects = parseJsonField(formData.get("subjects"), "subjects");
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: parseError.message },
          { status: 400 }
        );
      }
    }

    // Parse departments
    if (formData.get("departments")) {
      try {
        departments = parseJsonField(formData.get("departments"), "departments");
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: parseError.message },
          { status: 400 }
        );
      }
    }

    // Parse admission documents
    if (formData.get("admissionDocumentsRequired")) {
      try {
        admissionDocumentsRequired = parseJsonField(formData.get("admissionDocumentsRequired"), "admissionDocumentsRequired");
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: parseError.message },
          { status: 400 }
        );
      }
    }

    // Parse additional results files
    if (formData.get("additionalResultsFiles")) {
      try {
        additionalResultsFiles = parseJsonField(formData.get("additionalResultsFiles"), "additionalResultsFiles");
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: parseError.message },
          { status: 400 }
        );
      }
    }

    // Parse fee distribution JSON fields
    try {
      if (formData.get("feesDayDistributionJson")) {
        feesDayDistributionJson = parseFeeDistributionJson(formData.get("feesDayDistributionJson"), "feesDayDistributionJson");
      }
      
      if (formData.get("feesBoardingDistributionJson")) {
        feesBoardingDistributionJson = parseFeeDistributionJson(formData.get("feesBoardingDistributionJson"), "feesBoardingDistributionJson");
      }
      
      if (formData.get("admissionFeeDistribution")) {
        admissionFeeDistribution = parseFeeDistributionJson(formData.get("admissionFeeDistribution"), "admissionFeeDistribution");
      }
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: parseError.message },
        { status: 400 }
      );
    }

    // Update school with all fields - WITH JSON DISTRIBUTIONS
    const updated = await prisma.schoolInfo.update({
      where: { id: existing.id },
      data: {
        name: formData.get("name") || existing.name,
        description: formData.get("description") !== null ? formData.get("description") : existing.description,
        motto: formData.get("motto") !== null ? formData.get("motto") : existing.motto,
        vision: formData.get("vision") !== null ? formData.get("vision") : existing.vision,
        mission: formData.get("mission") !== null ? formData.get("mission") : existing.mission,
        videoTour: videoPath,
        videoType,
        videoThumbnail: thumbnailPath,
        videoThumbnailType: thumbnailType,
        studentCount: formData.get("studentCount") ? parseIntField(formData.get("studentCount")) : existing.studentCount,
        staffCount: formData.get("staffCount") ? parseIntField(formData.get("staffCount")) : existing.staffCount,
        
        // Day School Fees - WITH JSON DISTRIBUTION
        feesDay: formData.get("feesDay") ? parseNumber(formData.get("feesDay")) : existing.feesDay,
        feesDayDistributionJson: feesDayDistributionJson !== undefined ? feesDayDistributionJson : existing.feesDayDistributionJson,
        feesDayDistributionPdf: pdfUploads.dayFees?.path || existing.feesDayDistributionPdf,
        feesDayPdfName: pdfUploads.dayFees?.name || existing.feesDayPdfName,
        feesDayPdfSize: pdfUploads.dayFees?.size || existing.feesDayPdfSize,
        feesDayPdfUploadDate: pdfUploads.dayFees?.path ? new Date() : existing.feesDayPdfUploadDate,
        
        // Boarding School Fees - WITH JSON DISTRIBUTION
        feesBoarding: formData.get("feesBoarding") ? parseNumber(formData.get("feesBoarding")) : existing.feesBoarding,
        feesBoardingDistributionJson: feesBoardingDistributionJson !== undefined ? feesBoardingDistributionJson : existing.feesBoardingDistributionJson,
        feesBoardingDistributionPdf: pdfUploads.boardingFees?.path || existing.feesBoardingDistributionPdf,
        feesBoardingPdfName: pdfUploads.boardingFees?.name || existing.feesBoardingPdfName,
        feesBoardingPdfSize: pdfUploads.boardingFees?.size || existing.feesBoardingPdfSize,
        feesBoardingPdfUploadDate: pdfUploads.boardingFees?.path ? new Date() : existing.feesBoardingPdfUploadDate,
        
        // Academic Calendar
        openDate: formData.get("openDate") ? parseDate(formData.get("openDate")) : existing.openDate,
        closeDate: formData.get("closeDate") ? parseDate(formData.get("closeDate")) : existing.closeDate,
        
        // Academic Information
        subjects,
        departments,
        
        // Curriculum
        curriculumPDF: pdfUploads.curriculum?.path || existing.curriculumPDF,
        curriculumPdfName: pdfUploads.curriculum?.name || existing.curriculumPdfName,
        curriculumPdfSize: pdfUploads.curriculum?.size || existing.curriculumPdfSize,
        
        // Admission Information - WITH JSON DISTRIBUTION
        admissionOpenDate: formData.get("admissionOpenDate") ? parseDate(formData.get("admissionOpenDate")) : existing.admissionOpenDate,
        admissionCloseDate: formData.get("admissionCloseDate") ? parseDate(formData.get("admissionCloseDate")) : existing.admissionCloseDate,
        admissionRequirements: formData.get("admissionRequirements") !== null ? formData.get("admissionRequirements") : existing.admissionRequirements,
        admissionFee: formData.get("admissionFee") ? parseNumber(formData.get("admissionFee")) : existing.admissionFee,
        admissionFeeDistribution: admissionFeeDistribution !== undefined ? admissionFeeDistribution : existing.admissionFeeDistribution,
        admissionCapacity: formData.get("admissionCapacity") ? parseIntField(formData.get("admissionCapacity")) : existing.admissionCapacity,
        admissionContactEmail: formData.get("admissionContactEmail") !== null ? formData.get("admissionContactEmail") : existing.admissionContactEmail,
        admissionContactPhone: formData.get("admissionContactPhone") !== null ? formData.get("admissionContactPhone") : existing.admissionContactPhone,
        admissionWebsite: formData.get("admissionWebsite") !== null ? formData.get("admissionWebsite") : existing.admissionWebsite,
        admissionLocation: formData.get("admissionLocation") !== null ? formData.get("admissionLocation") : existing.admissionLocation,
        admissionOfficeHours: formData.get("admissionOfficeHours") !== null ? formData.get("admissionOfficeHours") : existing.admissionOfficeHours,
        admissionDocumentsRequired,
        admissionFeePdf: pdfUploads.admissionFee?.path || existing.admissionFeePdf,
        admissionFeePdfName: pdfUploads.admissionFee?.name || existing.admissionFeePdfName,
        
        // Exam Results
        form1ResultsPdf: pdfUploads.form1?.pdfData.path || existing.form1ResultsPdf,
        form1ResultsPdfName: pdfUploads.form1?.pdfData.name || existing.form1ResultsPdfName,
        form1ResultsPdfSize: pdfUploads.form1?.pdfData.size || existing.form1ResultsPdfSize,
        form1ResultsYear: pdfUploads.form1?.year !== undefined ? pdfUploads.form1?.year : existing.form1ResultsYear,
        
        form2ResultsPdf: pdfUploads.form2?.pdfData.path || existing.form2ResultsPdf,
        form2ResultsPdfName: pdfUploads.form2?.pdfData.name || existing.form2ResultsPdfName,
        form2ResultsPdfSize: pdfUploads.form2?.pdfData.size || existing.form2ResultsPdfSize,
        form2ResultsYear: pdfUploads.form2?.year !== undefined ? pdfUploads.form2?.year : existing.form2ResultsYear,
        
        form3ResultsPdf: pdfUploads.form3?.pdfData.path || existing.form3ResultsPdf,
        form3ResultsPdfName: pdfUploads.form3?.pdfData.name || existing.form3ResultsPdfName,
        form3ResultsPdfSize: pdfUploads.form3?.pdfData.size || existing.form3ResultsPdfSize,
        form3ResultsYear: pdfUploads.form3?.year !== undefined ? pdfUploads.form3?.year : existing.form3ResultsYear,
        
        form4ResultsPdf: pdfUploads.form4?.pdfData.path || existing.form4ResultsPdf,
        form4ResultsPdfName: pdfUploads.form4?.pdfData.name || existing.form4ResultsPdfName,
        form4ResultsPdfSize: pdfUploads.form4?.pdfData.size || existing.form4ResultsPdfSize,
        form4ResultsYear: pdfUploads.form4?.year !== undefined ? pdfUploads.form4?.year : existing.form4ResultsYear,
        
        mockExamsResultsPdf: pdfUploads.mockExams?.pdfData.path || existing.mockExamsResultsPdf,
        mockExamsPdfName: pdfUploads.mockExams?.pdfData.name || existing.mockExamsPdfName,
        mockExamsPdfSize: pdfUploads.mockExams?.pdfData.size || existing.mockExamsPdfSize,
        mockExamsYear: pdfUploads.mockExams?.year !== undefined ? pdfUploads.mockExams?.year : existing.mockExamsYear,
        
        kcseResultsPdf: pdfUploads.kcse?.pdfData.path || existing.kcseResultsPdf,
        kcsePdfName: pdfUploads.kcse?.pdfData.name || existing.kcsePdfName,
        kcsePdfSize: pdfUploads.kcse?.pdfData.size || existing.kcsePdfSize,
        kcseYear: pdfUploads.kcse?.year !== undefined ? pdfUploads.kcse?.year : existing.kcseYear,
        
        // Additional Results
        additionalResultsFiles,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "School info updated successfully",
      school: cleanSchoolResponse(updated)
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

    // Delete all associated files including thumbnails
    const filesToDelete = [
      existing.videoType === 'file' ? existing.videoTour : null,
      existing.videoThumbnail, // Add thumbnail to deletion list
      existing.curriculumPDF,
      existing.feesDayDistributionPdf,
      existing.feesBoardingDistributionPdf,
      existing.admissionFeePdf,
      existing.form1ResultsPdf,
      existing.form2ResultsPdf,
      existing.form3ResultsPdf,
      existing.form4ResultsPdf,
      existing.mockExamsResultsPdf,
      existing.kcseResultsPdf,
    ].filter(Boolean);

    // Delete additional results files
    let additionalResultsFiles = [];
    try {
      additionalResultsFiles = typeof existing.additionalResultsFiles === 'object'
        ? existing.additionalResultsFiles
        : JSON.parse(existing.additionalResultsFiles || '[]');
    } catch (e) {
      console.warn("Could not parse additional results for deletion:", e.message);
    }

    // Add additional results files to deletion list
    additionalResultsFiles.forEach(result => {
      if (result.filepath) {
        filesToDelete.push(result.filepath);
      }
    });

    // Delete each file
    for (const filePath of filesToDelete) {
      await deleteOldFile(filePath);
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