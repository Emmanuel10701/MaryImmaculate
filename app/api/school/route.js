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
const boardingFeesDir = path.join(pdfDir, "boarding-fees");
const curriculumDir = path.join(pdfDir, "curriculum");
const admissionDir = path.join(pdfDir, "admission");
const examResultsDir = path.join(pdfDir, "exam-results");
const additionalResultsDir = path.join(pdfDir, "additional-results");

// Create all directories (removed day-fees directory)
[pdfDir, videoDir, thumbnailDir, boardingFeesDir, curriculumDir, admissionDir, examResultsDir, additionalResultsDir].forEach(dir => ensureDir(dir));

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

// NEW: Handle Additional Files Upload (supports multiple file types)
const handleAdditionalFileUpload = async (file, existingFilePath = null) => {
  if (!file || file.size === 0) {
    return {
      path: existingFilePath,
      name: null,
      size: null,
      type: null
    };
  }

  // Delete old file if exists
  if (existingFilePath) {
    await deleteOldFile(existingFilePath);
  }

  // Allowed file types for additional results
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ];

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: PDF, Word, Excel, PowerPoint, Images, Text`);
  }

  // Validate file size (50MB limit)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size: 50MB`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `/infomation/pdfs/additional-results/${fileName}`;
  
  await writeFile(path.join(process.cwd(), "public", filePath), buffer);
  
  // Determine file type for display
  const fileType = getFileTypeFromMime(file.type);
  
  return {
    path: filePath,
    name: file.name,
    size: file.size,
    type: fileType
  };
};

// Helper to determine file type from MIME type
const getFileTypeFromMime = (mimeType) => {
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
  if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'xls';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'ppt';
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('text')) return 'text';
  return 'document';
};

// Helper to handle thumbnail upload (for MP4 videos only)
const handleThumbnailUpload = async (thumbnailData, existingThumbnail = null, isUpdateOperation = false) => {
  // If no thumbnail data is provided
  if (!thumbnailData || (typeof thumbnailData === 'string' && thumbnailData.trim() === '')) {
    // During update operations, preserve existing thumbnail if no new one is provided
    if (isUpdateOperation) {
      return existingThumbnail ? {
        path: existingThumbnail.path,
        type: 'existing'
      } : null;
    }
    // During create operations, delete existing thumbnail if provided
    if (existingThumbnail) {
      await deleteOldFile(existingThumbnail);
    }
    return null;
  }

  // Delete old thumbnail if exists (only when explicitly replacing)
  if (existingThumbnail) {
    await deleteOldFile(existingThumbnail);
  }

  // If it's a File object
  if (thumbnailData instanceof File || (typeof thumbnailData === 'object' && thumbnailData.name)) {
    try {
      // Validate it's an image file
      if (!thumbnailData.type.startsWith('image/')) {
        throw new Error("Thumbnail must be an image file");
      }

      // Validate file size (max 2MB for thumbnails)
      if (thumbnailData.size > 2 * 1024 * 1024) {
        throw new Error("Thumbnail too large. Maximum size: 2MB");
      }

      const buffer = Buffer.from(await thumbnailData.arrayBuffer());
      const fileName = `thumbnail_${Date.now()}_${thumbnailData.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `/infomation/thumbnails/${fileName}`;
      
      await writeFile(path.join(process.cwd(), "public", filePath), buffer);
      return {
        path: filePath,
        type: 'generated'
      };
    } catch (fileError) {
      console.error('File thumbnail upload error:', fileError);
      throw fileError;
    }
  }

  // Check if it's a data URL (base64)
  if (typeof thumbnailData === 'string' && thumbnailData.startsWith('data:image/')) {
    try {
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
    } catch (base64Error) {
      console.error('Base64 thumbnail upload error:', base64Error);
      throw base64Error;
    }
  }

  // If it's already a file path, return as-is
  if (typeof thumbnailData === 'string' && thumbnailData.startsWith('/')) {
    return {
      path: thumbnailData,
      type: 'existing'
    };
  }

  throw new Error("Invalid thumbnail data format");
};

// Update the handleVideoUpload function to properly store thumbnails
const handleVideoUpload = async (youtubeLink, videoTourFile, thumbnailData, existingVideo = null, existingThumbnail = null, isUpdateOperation = false) => {
  let videoPath = existingVideo?.videoTour || null;
  let videoType = existingVideo?.videoType || null;
  let thumbnailPath = existingThumbnail?.path || null;
  let thumbnailType = existingThumbnail?.type || null;

  // If YouTube link is provided
  if (youtubeLink !== null && youtubeLink !== undefined) {
    if (youtubeLink.trim() !== '') {
      // Delete old video file if exists (if it was a local file)
      if (existingVideo?.videoType === 'file' && existingVideo?.videoTour) {
        await deleteOldFile(existingVideo.videoTour);
      }
      
      // Delete old thumbnail when switching to YouTube
      if (thumbnailPath) {
        await deleteOldFile(thumbnailPath);
        thumbnailPath = null;
        thumbnailType = null;
      }
      
      if (!isValidYouTubeUrl(youtubeLink)) {
        throw new Error("Invalid YouTube URL format. Please provide a valid YouTube watch URL or youtu.be link.");
      }
      videoPath = youtubeLink.trim();
      videoType = "youtube";
      // YouTube doesn't need custom thumbnail storage
      thumbnailPath = null;
      thumbnailType = null;
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
    
    // Handle thumbnail for MP4 videos
    if (thumbnailData) {
      try {
        const thumbnailResult = await handleThumbnailUpload(thumbnailData, thumbnailPath, isUpdateOperation);
        if (thumbnailResult) {
          thumbnailPath = thumbnailResult.path;
          thumbnailType = thumbnailResult.type;
        }
      } catch (thumbnailError) {
        console.warn('Thumbnail upload failed:', thumbnailError.message);
        // Don't fail the whole upload if thumbnail fails
      }
    } else if (isUpdateOperation && existingVideo?.videoType === 'file' && thumbnailPath) {
      // During update, preserve existing thumbnail if no new one provided
      thumbnailType = existingVideo?.videoThumbnailType || 'existing';
    } else {
      // No thumbnail for this MP4 video
      thumbnailPath = null;
      thumbnailType = null;
    }
  } else if (isUpdateOperation && existingVideo?.videoType === 'file' && !videoTourFile) {
    // During update, if video is not changed, preserve existing thumbnail
    if (existingVideo?.videoThumbnail) {
      thumbnailPath = existingVideo.videoThumbnail;
      thumbnailType = existingVideo.videoThumbnailType || 'existing';
    }
  }

  // If video is being removed completely, also remove thumbnail
  if ((!youtubeLink || youtubeLink.trim() === '') && !videoTourFile && existingVideo?.videoTour) {
    if (thumbnailPath) {
      await deleteOldFile(thumbnailPath);
      thumbnailPath = null;
      thumbnailType = null;
    }
  }

  return { videoPath, videoType, thumbnailPath, thumbnailType };
};

// Helper to parse existing additional files from database
const parseExistingAdditionalFiles = (existingAdditionalFilesString) => {
  try {
    if (!existingAdditionalFilesString) return [];
    
    if (typeof existingAdditionalFilesString === 'string') {
      return JSON.parse(existingAdditionalFilesString);
    } else if (Array.isArray(existingAdditionalFilesString)) {
      return existingAdditionalFilesString;
    }
    return [];
  } catch (e) {
    console.warn('Failed to parse existing additional files:', e.message);
    return [];
  }
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
      const videoResult = await handleVideoUpload(youtubeLink, videoTour, thumbnail, null, null, false);
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

    // Handle ALL PDF uploads (removed day-fees)
    let pdfUploads = {};
    
    try {
      // Curriculum PDF
      const curriculumPDF = formData.get("curriculumPDF");
      if (curriculumPDF) {
        pdfUploads.curriculum = await handlePdfUpload(curriculumPDF, "curriculum", "curriculum");
      }

      // Boarding fees PDF ONLY
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

    // Handle additional results files
    let additionalResultsFiles = [];

    try {
      // Helper to push uploaded file object into array
      const pushUploadedAdditional = (arr, uploadResult, year = '', description = '') => {
        if (!uploadResult || !uploadResult.path) return;
        arr.push({
          filename: uploadResult.name,
          filepath: uploadResult.path,
          filetype: uploadResult.type,
          year: year ? year.trim() : null,
          description: description ? description.trim() : null,
          filesize: uploadResult.size
        });
      };

      // Handle "modal" style multiple files
      const modalFiles = formData.getAll('additionalFiles') || [];
      for (let i = 0; i < modalFiles.length; i++) {
        const file = modalFiles[i];
        if (file && file.size > 0) {
          try {
            const uploadResult = await handleAdditionalFileUpload(file, null);
            pushUploadedAdditional(additionalResultsFiles, uploadResult, null, null);
          } catch (err) {
            console.warn(`Failed to upload modal additional file ${i}:`, err.message);
          }
        }
      }

      // Handle indexed pattern additionalResultsFile_{i}
      const newFileEntries = [];
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('additionalResultsFile_')) {
          const index = key.replace('additionalResultsFile_', '');
          newFileEntries.push({
            index,
            file: value,
            year: formData.get(`additionalResultsYear_${index}`) || '',
            description: formData.get(`additionalResultsDesc_${index}`) || ''
          });
        }
      }

      for (const entry of newFileEntries) {
        if (entry.file && entry.file.size > 0) {
          try {
            const existingFilePathField = formData.get(`existingAdditionalFilepath_${entry.index}`) || formData.get(`replaceAdditionalFilepath_${entry.index}`) || null;
            const uploadResult = await handleAdditionalFileUpload(entry.file, existingFilePathField || null);
            pushUploadedAdditional(additionalResultsFiles, uploadResult, entry.year, entry.description);
          } catch (err) {
            console.warn(`Failed to upload indexed additional file ${entry.index}:`, err.message);
          }
        }
      }

      // Deduplicate by filepath
      const unique = [];
      const seenPaths = new Set();
      for (const f of additionalResultsFiles) {
        const p = f.filepath || f.path || f.file;
        if (p && !seenPaths.has(p)) {
          seenPaths.add(p);
          unique.push(f);
        }
      }
      additionalResultsFiles = unique;

    } catch (additionalError) {
      console.warn('Additional files upload error:', additionalError.message);
      additionalResultsFiles = [];
    }
    

    // Parse JSON fields
    let subjects, departments, admissionDocumentsRequired;
    let feesBoardingDistributionJson, admissionFeeDistribution;
    
    try {
      // Parse academic JSON fields
      subjects = parseJsonField(formData.get("subjects") || "[]", "subjects");
      departments = parseJsonField(formData.get("departments") || "[]", "departments");
      
      const admissionDocsStr = formData.get("admissionDocumentsRequired");
      admissionDocumentsRequired = admissionDocsStr ? parseJsonField(admissionDocsStr, "admissionDocumentsRequired") : [];
      
      // Parse fee distribution JSON fields - BOARDING ONLY
      const boardingDistributionStr = formData.get("feesBoardingDistributionJson");
      if (boardingDistributionStr) {
        feesBoardingDistributionJson = parseFeeDistributionJson(boardingDistributionStr, "feesBoardingDistributionJson");
      } else {
        // Default distribution for all-girls boarding school
        feesBoardingDistributionJson = {
          boarding: 100,
          description: "All-inclusive boarding fees for all-girls boarding school"
        };
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
        
        // BOARDING SCHOOL FEES ONLY
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
        
        // Admission Information
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
        additionalResultsFiles: additionalResultsFiles.length > 0 ? JSON.stringify(additionalResultsFiles) : '[]',
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
  const feesBoardingDistributionJson = typeof school.feesBoardingDistributionJson === 'object' ? school.feesBoardingDistributionJson : JSON.parse(school.feesBoardingDistributionJson || '{}');
  const admissionFeeDistribution = typeof school.admissionFeeDistribution === 'object' ? school.admissionFeeDistribution : JSON.parse(school.admissionFeeDistribution || '{}');
  const admissionDocumentsRequired = typeof school.admissionDocumentsRequired === 'object' ? school.admissionDocumentsRequired : JSON.parse(school.admissionDocumentsRequired || '[]');
  
  // Parse additional results files
  let additionalResultsFiles = [];
  try {
    if (school.additionalResultsFiles) {
      if (typeof school.additionalResultsFiles === 'string') {
        const parsed = JSON.parse(school.additionalResultsFiles || '[]');
        additionalResultsFiles = Array.isArray(parsed) ? parsed.map(file => ({
          filename: file.filename || file.name || 'Document',
          filepath: file.filepath || file.pdf || file.path || '',
          filetype: file.filetype || getFileTypeFromMime(file.type) || 'pdf',
          year: file.year || null,
          description: file.description || file.desc || '',
          filesize: file.filesize || file.size || 0
        })) : [];
      } else if (Array.isArray(school.additionalResultsFiles)) {
        additionalResultsFiles = school.additionalResultsFiles.map(file => ({
          filename: file.filename || file.name || 'Document',
          filepath: file.filepath || file.pdf || file.path || '',
          filetype: file.filetype || getFileTypeFromMime(file.type) || 'pdf',
          year: file.year || null,
          description: file.description || file.desc || '',
          filesize: file.filesize || file.size || 0
        }));
      }
    }
  } catch (e) {
    console.warn('Failed to parse additionalResultsFiles:', e.message);
    additionalResultsFiles = [];
  }

  // Build clean response for ALL-GIRLS BOARDING SCHOOL
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
    
    // BOARDING SCHOOL FEES ONLY
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
    
    // Admission Information
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
          year: school.form1ResultsYear,
          size: school.form1ResultsPdfSize
        }
      }),
      ...(school.form2ResultsPdf && {
        form2: {
          pdf: school.form2ResultsPdf,
          name: school.form2ResultsPdfName,
          year: school.form2ResultsYear,
          size: school.form2ResultsPdfSize
        }
      }),
      ...(school.form3ResultsPdf && {
        form3: {
          pdf: school.form3ResultsPdf,
          name: school.form3ResultsPdfName,
          year: school.form3ResultsYear,
          size: school.form3ResultsPdfSize
        }
      }),
      ...(school.form4ResultsPdf && {
        form4: {
          pdf: school.form4ResultsPdf,
          name: school.form4ResultsPdfName,
          year: school.form4ResultsYear,
          size: school.form4ResultsPdfSize
        }
      }),
      ...(school.mockExamsResultsPdf && {
        mockExams: {
          pdf: school.mockExamsResultsPdf,
          name: school.mockExamsPdfName,
          year: school.mockExamsYear,
          size: school.mockExamsPdfSize
        }
      }),
      ...(school.kcseResultsPdf && {
        kcse: {
          pdf: school.kcseResultsPdf,
          name: school.kcsePdfName,
          year: school.kcseYear,
          size: school.kcsePdfSize
        }
      })
    },
    
    // Additional Results Files
    additionalResultsFiles: additionalResultsFiles,
    
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
        { path: existing.videoThumbnail, type: existing.videoThumbnailType },
        true
      );
      
      // Only update if we have new values
      videoPath = videoResult.videoPath !== undefined ? videoResult.videoPath : existing.videoTour;
      videoType = videoResult.videoType !== undefined ? videoResult.videoType : existing.videoType;
      thumbnailPath = videoResult.thumbnailPath !== undefined ? videoResult.thumbnailPath : existing.videoThumbnail;
      thumbnailType = videoResult.thumbnailType !== undefined ? videoResult.thumbnailType : existing.videoThumbnailType;
    } catch (videoError) {
      return NextResponse.json(
        { success: false, error: videoError.message },
        { status: 400 }
      );
    }

    // Handle ALL PDF uploads (removed day-fees)
    let pdfUploads = {};
    
    try {
      // Curriculum PDF
      const curriculumPDF = formData.get("curriculumPDF");
      if (curriculumPDF) {
        pdfUploads.curriculum = await handlePdfUpload(curriculumPDF, "curriculum", "curriculum", existing.curriculumPDF);
      }

      // Boarding fees PDF ONLY
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

    // Handle additional results files
    let additionalResultsFiles = [];
    try {
      let existingAdditionalFiles = parseExistingAdditionalFiles(existing.additionalResultsFiles);

      const removedAdditionalFilesJson = formData.get('removedAdditionalFiles');
      let removedFiles = [];
      
      if (removedAdditionalFilesJson && removedAdditionalFilesJson.trim() !== '') {
        try {
          removedFiles = JSON.parse(removedAdditionalFilesJson);
          if (!Array.isArray(removedFiles)) {
            removedFiles = [];
          }
        } catch (e) {
          console.warn('Failed to parse removedAdditionalFiles:', e.message);
          removedFiles = [];
        }
      }

      const cancelledAdditionalFilesJson = formData.get('cancelledAdditionalFiles');
      let replacedFiles = [];
      
      if (cancelledAdditionalFilesJson && cancelledAdditionalFilesJson.trim() !== '') {
        try {
          replacedFiles = JSON.parse(cancelledAdditionalFilesJson);
          if (!Array.isArray(replacedFiles)) {
            replacedFiles = [];
          }
        } catch (e) {
          console.warn('Failed to parse cancelledAdditionalFiles:', e.message);
          replacedFiles = [];
        }
      }

      // Start with existing files, remove marked ones
      let finalFiles = existingAdditionalFiles.filter(file => {
        const filepath = file.filepath || file.filename || '';
        const shouldRemove = removedFiles.some(removedFile => 
          (removedFile.filepath || removedFile.filename) === filepath
        );
        const shouldReplace = replacedFiles.some(replacedFile => 
          (replacedFile.filepath || replacedFile.filename) === filepath
        );
        return !shouldRemove && !shouldReplace;
      });

      // Process metadata updates for existing files
      const existingUpdateEntries = [];
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('existingAdditionalFilepath_')) {
          const index = key.replace('existingAdditionalFilepath_', '');
          existingUpdateEntries.push({
            index,
            filepath: value,
            year: formData.get(`existingAdditionalYear_${index}`) || '',
            description: formData.get(`existingAdditionalDesc_${index}`) || ''
          });
        }
      }

      // Apply updates to existing files
      for (const update of existingUpdateEntries) {
        if (update.filepath) {
          const existingFileIndex = finalFiles.findIndex(file => 
            (file.filepath === update.filepath || file.filename === update.filepath)
          );
          
          if (existingFileIndex !== -1) {
            // Update metadata
            if (update.year !== null && update.year !== undefined && update.year.trim() !== '') {
              finalFiles[existingFileIndex].year = update.year.trim();
            }
            if (update.description !== null && update.description !== undefined && update.description.trim() !== '') {
              finalFiles[existingFileIndex].description = update.description.trim();
            }
          }
        }
      }

      // Process NEW additional files
      const newFileEntries = [];
      
      // Collect all indexed file entries
      for (let i = 0; i < 100; i++) {
        const fileField = `additionalResultsFile_${i}`;
        const file = formData.get(fileField);
        
        if (!file) break;
        
        newFileEntries.push({
          index: i,
          file: file,
          year: formData.get(`additionalResultsYear_${i}`) || '',
          description: formData.get(`additionalResultsDesc_${i}`) || '',
          replacesFilepath: formData.get(`replacesAdditionalFilepath_${i}`) || null
        });
      }

      // Process each new file entry
      for (const entry of newFileEntries) {
        if (entry.file && entry.file.size > 0) {
          try {
            let oldFilePath = null;
            if (entry.replacesFilepath) {
              oldFilePath = entry.replacesFilepath;
              // Remove the old file from finalFiles if it exists
              finalFiles = finalFiles.filter(f => 
                (f.filepath || f.filename) !== oldFilePath
              );
            }

            const uploadResult = await handleAdditionalFileUpload(entry.file, oldFilePath);
            
            if (uploadResult && uploadResult.path) {
              finalFiles.push({
                filename: uploadResult.name,
                filepath: uploadResult.path,
                filetype: uploadResult.type,
                year: entry.year ? entry.year.trim() : null,
                description: entry.description ? entry.description.trim() : null,
                filesize: uploadResult.size
              });
            }
          } catch (uploadError) {
            console.warn(`Failed to upload additional file ${entry.index}:`, uploadError.message);
          }
        }
      }

      // Remove duplicates
      const uniqueFiles = [];
      const seenFilepaths = new Set();
      
      for (const file of finalFiles) {
        const filepath = file.filepath;
        if (filepath && !seenFilepaths.has(filepath)) {
          seenFilepaths.add(filepath);
          uniqueFiles.push(file);
        }
      }
      
      additionalResultsFiles = uniqueFiles;

    } catch (additionalError) {
      console.error('❌ Additional files processing error:', additionalError);
      additionalResultsFiles = parseExistingAdditionalFiles(existing.additionalResultsFiles);
    }

    // Parse JSON fields
    let subjects = existing.subjects;
    let departments = existing.departments;
    let admissionDocumentsRequired = existing.admissionDocumentsRequired;
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

    // Parse fee distribution JSON fields - BOARDING ONLY
    try {
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

    // Update school with all fields
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
        
        // BOARDING SCHOOL FEES ONLY
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
        
        // Admission Information
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
        additionalResultsFiles: additionalResultsFiles.length > 0 ? JSON.stringify(additionalResultsFiles) : '[]',
        
        // Update timestamp
        updatedAt: new Date(),
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
      existing.videoThumbnail,
      existing.curriculumPDF,
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
    let additionalResultsFiles = parseExistingAdditionalFiles(existing.additionalResultsFiles);

    // Add additional results files to deletion list
    additionalResultsFiles.forEach(result => {
      if (result.filepath || result.pdf || result.path) {
        filesToDelete.push(result.filepath || result.pdf || result.path);
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