import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";

// ============ HELPER FUNCTIONS ============

// Validate YouTube URL
const isValidYouTubeUrl = (url) => {
  if (!url || url.trim() === '') return false;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url.trim());
};

// Parse and validate date
const parseDate = (dateString) => {
  if (!dateString || dateString.trim() === '') {
    return null;
  }
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Parse numeric fields
const parseNumber = (value) => {
  if (!value || value.trim() === '') {
    return null;
  }
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

// Parse integer fields
const parseIntField = (value) => {
  if (!value || value.trim() === '') {
    return null;
  }
  const num = parseInt(value);
  return isNaN(num) ? null : num;
};

// Parse JSON fields
const parseJsonField = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return fieldName === 'subjects' || fieldName === 'departments' || fieldName === 'admissionDocumentsRequired' ? [] : null;
  }
  
  // Handle case where value is already an array
  if (Array.isArray(value)) {
    return value;
  }
  
  try {
    return JSON.parse(value);
  } catch (parseError) {
    console.warn(`Failed to parse ${fieldName}, using empty array:`, parseError);
    return [];
  }
};

// ============ CLOUDINARY FUNCTIONS ============

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder, resourceType = 'auto') => {
  if (!file || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: `school/${folder}`,
          public_id: `${timestamp}-${sanitizedFileName}`,
          ...(resourceType === 'raw' && { 
            resource_type: 'raw',
            format: file.type.includes('pdf') ? 'pdf' : undefined 
          }),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes,
      format: result.format
    };
  } catch (error) {
    console.error(`❌ Cloudinary upload error for ${folder}:`, error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (url) => {
  if (!url) return;
  
  try {
    // Extract public_id from Cloudinary URL
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    if (matches && matches[1]) {
      const publicId = matches[1];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
  }
};

// Handle video upload with Cloudinary
const handleVideoUpload = async (youtubeLink, videoTourFile, thumbnailFile, existingVideo = null, isUpdateOperation = false) => {
  let videoUrl = existingVideo?.videoTour || null;
  let videoType = existingVideo?.videoType || null;
  let thumbnailUrl = existingVideo?.videoThumbnail || null;

  // If YouTube link is provided
  if (youtubeLink !== null && youtubeLink !== undefined && youtubeLink.trim() !== '') {
    // Delete old video from Cloudinary if exists
    if (existingVideo?.videoType === 'file' && existingVideo?.videoTour) {
      await deleteFromCloudinary(existingVideo.videoTour);
    }
    
    // Delete old thumbnail if exists
    if (thumbnailUrl) {
      await deleteFromCloudinary(thumbnailUrl);
    }
    
    if (!isValidYouTubeUrl(youtubeLink)) {
      throw new Error("Invalid YouTube URL format. Please provide a valid YouTube watch URL or youtu.be link.");
    }
    
    videoUrl = youtubeLink.trim();
    videoType = "youtube";
    thumbnailUrl = null;
    
    return { videoUrl, videoType, thumbnailUrl };
  }
  
  // If local video file upload is provided
  if (videoTourFile && videoTourFile.size > 0) {
    // Delete old video from Cloudinary if exists
    if (existingVideo?.videoTour && existingVideo?.videoType === 'file') {
      await deleteFromCloudinary(existingVideo.videoTour);
    }

    // Validate file type
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedVideoTypes.includes(videoTourFile.type)) {
      throw new Error("Invalid video format. Only MP4, WebM, and OGG files are allowed.");
    }

    // Validate file size (4.25MB limit)
    const maxSize = 4.25 * 1024 * 1024;
    if (videoTourFile.size > maxSize) {
      throw new Error("Video file too large. Maximum size: 4.25MB");
    }

    // Upload video to Cloudinary
    const videoResult = await uploadToCloudinary(videoTourFile, 'videos', 'video');
    videoUrl = videoResult.url;
    videoType = "file";
    
    // Handle thumbnail if provided
    if (thumbnailFile && thumbnailFile.size > 0) {
      // Validate thumbnail is an image
      if (!thumbnailFile.type.startsWith('image/')) {
        throw new Error("Thumbnail must be an image file");
      }
      
      const thumbnailResult = await uploadToCloudinary(thumbnailFile, 'thumbnails', 'image');
      thumbnailUrl = thumbnailResult.url;
    } else {
      // If no thumbnail provided, delete existing one
      if (thumbnailUrl) {
        await deleteFromCloudinary(thumbnailUrl);
        thumbnailUrl = null;
      }
    }
    
    return { videoUrl, videoType, thumbnailUrl };
  }

  // If removing video
  if ((!youtubeLink || youtubeLink.trim() === '') && !videoTourFile) {
    if (videoUrl && videoType === 'file') {
      await deleteFromCloudinary(videoUrl);
    }
    if (thumbnailUrl) {
      await deleteFromCloudinary(thumbnailUrl);
    }
    return { videoUrl: null, videoType: null, thumbnailUrl: null };
  }

  // For updates, preserve existing if not changed
  if (isUpdateOperation && !youtubeLink && !videoTourFile) {
    return { videoUrl, videoType, thumbnailUrl };
  }

  return { videoUrl, videoType, thumbnailUrl };
};

// Clean school response for frontend
const cleanSchoolResponse = (school) => {
  try {
    // Parse JSON fields safely
    let subjects = [];
    let departments = [];
    let admissionDocumentsRequired = [];
    
    try {
      subjects = typeof school.subjects === 'string' 
        ? JSON.parse(school.subjects || '[]') 
        : (school.subjects || []);
    } catch (e) {
      console.warn("Error parsing subjects:", e);
    }
    
    try {
      departments = typeof school.departments === 'string' 
        ? JSON.parse(school.departments || '[]') 
        : (school.departments || []);
    } catch (e) {
      console.warn("Error parsing departments:", e);
    }
    
    try {
      admissionDocumentsRequired = typeof school.admissionDocumentsRequired === 'string'
        ? JSON.parse(school.admissionDocumentsRequired || '[]')
        : (school.admissionDocumentsRequired || []);
    } catch (e) {
      console.warn("Error parsing admission documents:", e);
    }

    return {
      id: school.id,
      name: school.name,
      description: school.description,
      motto: school.motto,
      vision: school.vision,
      mission: school.mission,
      videoTour: school.videoTour,
      videoType: school.videoType,
      videoThumbnail: school.videoThumbnail,
      studentCount: school.studentCount,
      staffCount: school.staffCount,
      
      // Fees
      feesDay: school.feesDay,
      feesBoarding: school.feesBoarding,
      admissionFee: school.admissionFee,
      
      // Academic Calendar
      openDate: school.openDate,
      closeDate: school.closeDate,
      
      // Academic Information
      subjects,
      departments,
      
      // Admission Information
      admissionOpenDate: school.admissionOpenDate,
      admissionCloseDate: school.admissionCloseDate,
      admissionRequirements: school.admissionRequirements,
      admissionCapacity: school.admissionCapacity,
      admissionContactEmail: school.admissionContactEmail,
      admissionContactPhone: school.admissionContactPhone,
      admissionWebsite: school.admissionWebsite,
      admissionLocation: school.admissionLocation,
      admissionOfficeHours: school.admissionOfficeHours,
      admissionDocumentsRequired,
      
      // Timestamps
      createdAt: school.createdAt,
      updatedAt: school.updatedAt
    };
  } catch (error) {
    console.error("Error cleaning school response:", error);
    return school;
  }
};

// Validate required fields for CREATE operation
const validateRequiredFieldsCreate = (formData) => {
  const required = [
    'name', 'studentCount', 'staffCount', 
    'openDate', 'closeDate'
  ];
  
  const missing = required.filter(field => {
    const value = formData.get(field);
    return !value || value.trim() === '';
  });
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields for creation: ${missing.join(', ')}`);
  }
};

// Validate required fields for UPDATE operation
const validateRequiredFieldsUpdate = (formData) => {
  const required = [
    'name'
  ];
  
  const missing = required.filter(field => {
    const value = formData.get(field);
    return !value || value.trim() === '';
  });
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields for update: ${missing.join(', ')}`);
  }
};

// ============ API ROUTES ============

// 🟡 GET school info
export async function GET() {
  try {
    console.log("🔍 GET /api/school - Fetching school info");
    
    const school = await prisma.schoolInfo.findFirst();
    
    if (!school) {
      console.log("📭 No school found in database");
      return NextResponse.json(
        { 
          success: true, 
          message: "No school information found",
          school: null 
        }, 
        { status: 200 }
      );
    }

    console.log("✅ School found:", school.name);
    
    return NextResponse.json({ 
      success: true, 
      message: "School information retrieved successfully",
      school: cleanSchoolResponse(school)
    });

  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        message: "Failed to fetch school information"
      }, 
      { status: 500 }
    );
  }
}

// 🟢 CREATE School Info (POST - CREATE ONLY)
export async function POST(req) {
  try {
    console.log("📝 POST /api/school - Creating school info");
    
    const formData = await req.formData();
    
    // Check if school already exists
    const existing = await prisma.schoolInfo.findFirst();
    
    if (existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: "School information already exists. Use PUT to update.",
          message: "School already exists. Use update instead."
        },
        { status: 409 } // Conflict
      );
    }

    // Validate required fields for CREATE
    try {
      validateRequiredFieldsCreate(formData);
    } catch (validationError) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationError.message 
        },
        { status: 400 }
      );
    }

    // Handle video upload
    let videoUrl = null;
    let videoType = null;
    let thumbnailUrl = null;
    
    try {
      const youtubeLink = formData.get("youtubeLink");
      const videoTour = formData.get("videoTour");
      const thumbnail = formData.get("videoThumbnail");
      
      const videoResult = await handleVideoUpload(
        youtubeLink, 
        videoTour, 
        thumbnail, 
        null, // No existing video for CREATE
        false // Not an update operation
      );
      videoUrl = videoResult.videoUrl;
      videoType = videoResult.videoType;
      thumbnailUrl = videoResult.thumbnailUrl;
    } catch (videoError) {
      return NextResponse.json(
        { 
          success: false, 
          error: videoError.message 
        },
        { status: 400 }
      );
    }

    // Parse JSON fields
    let subjects = [];
    let departments = [];
    let admissionDocumentsRequired = [];
    
    try {
      subjects = parseJsonField(formData.get("subjects") || "[]", "subjects");
      departments = parseJsonField(formData.get("departments") || "[]", "departments");
      admissionDocumentsRequired = parseJsonField(
        formData.get("admissionDocumentsRequired") || "[]", 
        "admissionDocumentsRequired"
      );
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false, 
          error: parseError.message 
        },
        { status: 400 }
      );
    }

    // Create new school
    const schoolData = {
      name: formData.get("name"),
      description: formData.get("description") || null,
      motto: formData.get("motto") || null,
      vision: formData.get("vision") || null,
      mission: formData.get("mission") || null,
      videoTour: videoUrl,
      videoType,
      videoThumbnail: thumbnailUrl,
      studentCount: parseIntField(formData.get("studentCount")) || 0,
      staffCount: parseIntField(formData.get("staffCount")) || 0,
      feesDay: parseNumber(formData.get("feesDay")),
      feesBoarding: parseNumber(formData.get("feesBoarding")),
      admissionFee: parseNumber(formData.get("admissionFee")),
      openDate: parseDate(formData.get("openDate")) || new Date(),
      closeDate: parseDate(formData.get("closeDate")) || new Date(),
      subjects,
      departments,
      admissionOpenDate: parseDate(formData.get("admissionOpenDate")),
      admissionCloseDate: parseDate(formData.get("admissionCloseDate")),
      admissionRequirements: formData.get("admissionRequirements") || null,
      admissionCapacity: parseIntField(formData.get("admissionCapacity")),
      admissionContactEmail: formData.get("admissionContactEmail") || null,
      admissionContactPhone: formData.get("admissionContactPhone") || null,
      admissionWebsite: formData.get("admissionWebsite") || null,
      admissionLocation: formData.get("admissionLocation") || null,
      admissionOfficeHours: formData.get("admissionOfficeHours") || null,
      admissionDocumentsRequired,
    };

    const school = await prisma.schoolInfo.create({
      data: schoolData,
    });
    
    console.log("✅ School created successfully:", school.name);
    
    return NextResponse.json({ 
      success: true, 
      message: "School information created successfully",
      school: cleanSchoolResponse(school)
    });
    
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        message: "Failed to create school information"
      }, 
      { status: 500 }
    );
  }
}

// 🔵 UPDATE School Info (PUT - UPDATE ONLY)
export async function PUT(req) {
  try {
    console.log("✏️ PUT /api/school - Updating school info");
    
    const existing = await prisma.schoolInfo.findFirst();
    if (!existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: "No school information found to update.",
          message: "No school info to update. Create school first."
        }, 
        { status: 404 }
      );
    }

    const formData = await req.formData();
    
    // Validate required fields for UPDATE
    try {
      validateRequiredFieldsUpdate(formData);
    } catch (validationError) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationError.message 
        },
        { status: 400 }
      );
    }

    // Handle video upload
    let videoUrl = existing.videoTour;
    let videoType = existing.videoType;
    let thumbnailUrl = existing.videoThumbnail;
    
    try {
      const youtubeLink = formData.get("youtubeLink");
      const videoTour = formData.get("videoTour");
      const thumbnail = formData.get("videoThumbnail");
      
      console.log("📹 Processing video update...");
      console.log("- YouTube Link:", youtubeLink ? "Provided" : "Not provided");
      console.log("- Video File:", videoTour ? `Yes (${videoTour.size} bytes)` : "Not provided");
      console.log("- Thumbnail:", thumbnail ? `Yes (${thumbnail.size} bytes)` : "Not provided");
      
      const videoResult = await handleVideoUpload(
        youtubeLink, 
        videoTour, 
        thumbnail, 
        existing,
        true // This is an update operation
      );
      
      videoUrl = videoResult.videoUrl !== undefined ? videoResult.videoUrl : existing.videoTour;
      videoType = videoResult.videoType !== undefined ? videoResult.videoType : existing.videoType;
      thumbnailUrl = videoResult.thumbnailUrl !== undefined ? videoResult.thumbnailUrl : existing.videoThumbnail;
      
      console.log("✅ Video update processed:", { 
        videoType, 
        videoUrl: videoUrl ? "Set" : "Not set", 
        thumbnailUrl: thumbnailUrl ? "Set" : "Not set" 
      });
    } catch (videoError) {
      console.error("❌ Video update error:", videoError);
      return NextResponse.json(
        { 
          success: false, 
          error: videoError.message 
        },
        { status: 400 }
      );
    }

    // Parse JSON fields
    let subjects = existing.subjects;
    let departments = existing.departments;
    let admissionDocumentsRequired = existing.admissionDocumentsRequired;

    // Parse subjects
    if (formData.get("subjects")) {
      try {
        subjects = parseJsonField(formData.get("subjects"), "subjects");
      } catch (parseError) {
        console.warn("Error parsing subjects:", parseError);
      }
    }

    // Parse departments
    if (formData.get("departments")) {
      try {
        departments = parseJsonField(formData.get("departments"), "departments");
      } catch (parseError) {
        console.warn("Error parsing departments:", parseError);
      }
    }

    // Parse admission documents
    if (formData.get("admissionDocumentsRequired")) {
      try {
        admissionDocumentsRequired = parseJsonField(formData.get("admissionDocumentsRequired"), "admissionDocumentsRequired");
      } catch (parseError) {
        console.warn("Error parsing admission documents:", parseError);
      }
    }

    console.log("💾 Updating school in database...");
    
    // Update school with all fields
    const updated = await prisma.schoolInfo.update({
      where: { id: existing.id },
      data: {
        name: formData.get("name") || existing.name,
        description: formData.get("description") !== null ? formData.get("description") : existing.description,
        motto: formData.get("motto") !== null ? formData.get("motto") : existing.motto,
        vision: formData.get("vision") !== null ? formData.get("vision") : existing.vision,
        mission: formData.get("mission") !== null ? formData.get("mission") : existing.mission,
        videoTour: videoUrl,
        videoType,
        videoThumbnail: thumbnailUrl,
        studentCount: formData.get("studentCount") ? parseIntField(formData.get("studentCount")) : existing.studentCount,
        staffCount: formData.get("staffCount") ? parseIntField(formData.get("staffCount")) : existing.staffCount,
        
        // Fees
        feesDay: formData.get("feesDay") ? parseNumber(formData.get("feesDay")) : existing.feesDay,
        feesBoarding: formData.get("feesBoarding") ? parseNumber(formData.get("feesBoarding")) : existing.feesBoarding,
        admissionFee: formData.get("admissionFee") ? parseNumber(formData.get("admissionFee")) : existing.admissionFee,
        
        // Academic Calendar
        openDate: formData.get("openDate") ? parseDate(formData.get("openDate")) : existing.openDate,
        closeDate: formData.get("closeDate") ? parseDate(formData.get("closeDate")) : existing.closeDate,
        
        // Academic Information
        subjects,
        departments,
        
        // Admission Information
        admissionOpenDate: formData.get("admissionOpenDate") ? parseDate(formData.get("admissionOpenDate")) : existing.admissionOpenDate,
        admissionCloseDate: formData.get("admissionCloseDate") ? parseDate(formData.get("admissionCloseDate")) : existing.admissionCloseDate,
        admissionRequirements: formData.get("admissionRequirements") !== null ? formData.get("admissionRequirements") : existing.admissionRequirements,
        admissionCapacity: formData.get("admissionCapacity") ? parseIntField(formData.get("admissionCapacity")) : existing.admissionCapacity,
        admissionContactEmail: formData.get("admissionContactEmail") !== null ? formData.get("admissionContactEmail") : existing.admissionContactEmail,
        admissionContactPhone: formData.get("admissionContactPhone") !== null ? formData.get("admissionContactPhone") : existing.admissionContactPhone,
        admissionWebsite: formData.get("admissionWebsite") !== null ? formData.get("admissionWebsite") : existing.admissionWebsite,
        admissionLocation: formData.get("admissionLocation") !== null ? formData.get("admissionLocation") : existing.admissionLocation,
        admissionOfficeHours: formData.get("admissionOfficeHours") !== null ? formData.get("admissionOfficeHours") : existing.admissionOfficeHours,
        admissionDocumentsRequired,
        
        // Update timestamp
        updatedAt: new Date(),
      },
    });

    console.log("✅ School updated successfully:", updated.name);
    
    return NextResponse.json({ 
      success: true, 
      message: "School information updated successfully",
      school: cleanSchoolResponse(updated)
    });
    
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        message: "Failed to update school information"
      }, 
      { status: 500 }
    );
  }
}

// 🔴 DELETE all school info
export async function DELETE() {
  try {
    console.log("🗑️ DELETE /api/school - Deleting school info");
    
    const existing = await prisma.schoolInfo.findFirst();
    if (!existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: "No school information found to delete",
          message: "No school info to delete" 
        }, 
        { status: 404 }
      );
    }

    // Delete files from Cloudinary
    if (existing.videoType === 'file' && existing.videoTour) {
      console.log("Deleting video from Cloudinary:", existing.videoTour);
      await deleteFromCloudinary(existing.videoTour);
    }
    if (existing.videoThumbnail) {
      console.log("Deleting thumbnail from Cloudinary:", existing.videoThumbnail);
      await deleteFromCloudinary(existing.videoThumbnail);
    }

    await prisma.schoolInfo.deleteMany();
    
    console.log("✅ School deleted successfully");
    
    return NextResponse.json({ 
      success: true, 
      message: "School information deleted successfully" 
    });
    
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        message: "Failed to delete school information"
      }, 
      { status: 500 }
    );
  }
}