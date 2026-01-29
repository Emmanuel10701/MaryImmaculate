import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";

// Upload PDF to Cloudinary
const uploadPdfToCloudinary = async (file, folder) => {
  if (!file || file.size === 0) return null;

  try {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!['.pdf', '.doc', '.docx'].includes(fileExtension)) {
      throw new Error(`Only PDF, DOC, and DOCX files are allowed`);
    }

    const maxSize = 4.5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const resourceType = fileExtension === '.pdf' ? 'raw' : 'raw';
    const format = fileExtension === '.pdf' ? 'pdf' : 
                   fileExtension === '.doc' ? 'doc' : 'docx';
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: `school/documents/${folder}`,
          public_id: `${timestamp}-${sanitizedFileName}`,
          format: format,
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
      format: result.format,
      original_name: file.name
    };
  } catch (error) {
    console.error(`❌ Cloudinary PDF upload error:`, error);
    throw error;
  }
};

// REMOVE THIS FUNCTION - Additional files upload
// const uploadAdditionalFileToCloudinary = async (file, folder) => {
//   ... REMOVE ENTIRE FUNCTION ...
// };

const deleteFromCloudinary = async (url) => {
  if (!url) return;
  
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    if (matches && matches[1]) {
      const publicId = matches[1];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
  }
};

const parseIntField = (value) => {
  if (!value || value.trim() === '') return null;
  const num = parseInt(value);
  return isNaN(num) ? null : num;
};

const parseStringField = (value) => {
  if (!value || value.trim() === '') return null;
  return value.trim();
};

const cleanDocumentResponse = (document) => {
  if (!document) return null;
  
  return {
    id: document.id,
    
    // Curriculum PDF
    curriculumPDF: document.curriculumPDF,
    curriculumPdfName: document.curriculumPdfName,
    curriculumPdfSize: document.curriculumPdfSize,
    curriculumPdfUploadDate: document.curriculumPdfUploadDate,
    curriculumDescription: document.curriculumDescription,
    curriculumYear: document.curriculumYear,
    curriculumTerm: document.curriculumTerm,
    
    // Day School Fees PDF
    feesDayDistributionPdf: document.feesDayDistributionPdf,
    feesDayPdfName: document.feesDayPdfName,
    feesDayPdfSize: document.feesDayPdfSize,
    feesDayPdfUploadDate: document.feesDayPdfUploadDate,
    feesDayDescription: document.feesDayDescription,
    feesDayYear: document.feesDayYear,
    feesDayTerm: document.feesDayTerm,
    
    // Boarding School Fees PDF
    feesBoardingDistributionPdf: document.feesBoardingDistributionPdf,
    feesBoardingPdfName: document.feesBoardingPdfName,
    feesBoardingPdfSize: document.feesBoardingPdfSize,
    feesBoardingPdfUploadDate: document.feesBoardingPdfUploadDate,
    feesBoardingDescription: document.feesBoardingDescription,
    feesBoardingYear: document.feesBoardingYear,
    feesBoardingTerm: document.feesBoardingTerm,
    
    // Admission Fee PDF
    admissionFeePdf: document.admissionFeePdf,
    admissionFeePdfName: document.admissionFeePdfName,
    admissionFeePdfSize: document.admissionFeePdfSize,
    admissionFeePdfUploadDate: document.admissionFeePdfUploadDate,
    admissionFeeDescription: document.admissionFeeDescription,
    admissionFeeYear: document.admissionFeeYear,
    admissionFeeTerm: document.admissionFeeTerm,
    
    // Fee breakdown JSON fields
    feesDayDistributionJson: document.feesDayDistributionJson,
    feesBoardingDistributionJson: document.feesBoardingDistributionJson,
    admissionFeeDistribution: document.admissionFeeDistribution,
    
    // Form 1 Results PDF
    form1ResultsPdf: document.form1ResultsPdf,
    form1ResultsPdfName: document.form1ResultsPdfName,
    form1ResultsPdfSize: document.form1ResultsPdfSize,
    form1ResultsDescription: document.form1ResultsDescription,
    form1ResultsYear: document.form1ResultsYear,
    form1ResultsTerm: document.form1ResultsTerm,
    form1ResultsUploadDate: document.form1ResultsUploadDate,
    
    // Form 2 Results PDF
    form2ResultsPdf: document.form2ResultsPdf,
    form2ResultsPdfName: document.form2ResultsPdfName,
    form2ResultsPdfSize: document.form2ResultsPdfSize,
    form2ResultsDescription: document.form2ResultsDescription,
    form2ResultsYear: document.form2ResultsYear,
    form2ResultsTerm: document.form2ResultsTerm,
    form2ResultsUploadDate: document.form2ResultsUploadDate,
    
    // Form 3 Results PDF
    form3ResultsPdf: document.form3ResultsPdf,
    form3ResultsPdfName: document.form3ResultsPdfName,
    form3ResultsPdfSize: document.form3ResultsPdfSize,
    form3ResultsDescription: document.form3ResultsDescription,
    form3ResultsYear: document.form3ResultsYear,
    form3ResultsTerm: document.form3ResultsTerm,
    form3ResultsUploadDate: document.form3ResultsUploadDate,
    
    // Form 4 Results PDF
    form4ResultsPdf: document.form4ResultsPdf,
    form4ResultsPdfName: document.form4ResultsPdfName,
    form4ResultsPdfSize: document.form4ResultsPdfSize,
    form4ResultsDescription: document.form4ResultsDescription,
    form4ResultsYear: document.form4ResultsYear,
    form4ResultsTerm: document.form4ResultsTerm,
    form4ResultsUploadDate: document.form4ResultsUploadDate,
    
    // Mock Exams PDF
    mockExamsResultsPdf: document.mockExamsResultsPdf,
    mockExamsPdfName: document.mockExamsPdfName,
    mockExamsPdfSize: document.mockExamsPdfSize,
    mockExamsDescription: document.mockExamsDescription,
    mockExamsYear: document.mockExamsYear,
    mockExamsTerm: document.mockExamsTerm,
    mockExamsUploadDate: document.mockExamsUploadDate,
    
    // KCSE Results PDF
    kcseResultsPdf: document.kcseResultsPdf,
    kcsePdfName: document.kcsePdfName,
    kcsePdfSize: document.kcsePdfSize,
    kcseDescription: document.kcseDescription,
    kcseYear: document.kcseYear,
    kcseTerm: document.kcseTerm,
    kcseUploadDate: document.kcseUploadDate,
    
    // REMOVED: additionalDocuments
    // additionalDocuments: document.additionalDocuments || [],
    
    createdAt: document.createdAt,
    updatedAt: document.updatedAt
  };
};

// GET - Fetch all documents
export async function GET() {
  try {
    console.log("📥 GET Request received");
    
    const document = await prisma.schoolDocument.findFirst({
      // REMOVED: include additionalDocuments
    });

    if (!document) {
      return NextResponse.json({
        success: true,
        message: "No documents found",
        document: null
      });
    }
    
    return NextResponse.json({
      success: true,
      document: cleanDocumentResponse(document)
    });

  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update all documents
export async function POST(req) {
  try {
    console.log("📥 POST Request received");
    const formData = await req.formData();
    
    let existingDocument = await prisma.schoolDocument.findFirst({
      // REMOVED: include additionalDocuments
    });

    console.log("📄 Existing document:", existingDocument ? `Found (ID: ${existingDocument.id})` : "Not found");

    const uploadPromises = {};
    const uploadResults = {};

    // Define document fields with their metadata
    const documentFields = [
      { 
        key: 'curriculum', 
        name: 'curriculumPDF', 
        year: 'curriculumYear',
        term: 'curriculumTerm',
        description: 'curriculumDescription',
        folder: 'curriculum' 
      },
      { 
        key: 'feesDay', 
        name: 'feesDayDistributionPdf', 
        year: 'feesDayYear',
        term: 'feesDayTerm',
        description: 'feesDayDescription',
        folder: 'day-fees' 
      },
      { 
        key: 'feesBoarding', 
        name: 'feesBoardingDistributionPdf', 
        year: 'feesBoardingYear',
        term: 'feesBoardingTerm',
        description: 'feesBoardingDescription',
        folder: 'boarding-fees' 
      },
      { 
        key: 'admissionFee', 
        name: 'admissionFeePdf', 
        year: 'admissionFeeYear',
        term: 'admissionFeeTerm',
        description: 'admissionFeeDescription',
        folder: 'admission' 
      },
    ];

    // Exam fields
    const examFields = [
      { 
        key: 'form1Results', 
        name: 'form1ResultsPdf', 
        year: 'form1ResultsYear', 
        term: 'form1ResultsTerm',
        description: 'form1ResultsDescription', 
        folder: 'exam-results' 
      },
      { 
        key: 'form2Results', 
        name: 'form2ResultsPdf', 
        year: 'form2ResultsYear', 
        term: 'form2ResultsTerm',
        description: 'form2ResultsDescription', 
        folder: 'exam-results' 
      },
      { 
        key: 'form3Results', 
        name: 'form3ResultsPdf', 
        year: 'form3ResultsYear', 
        term: 'form3ResultsTerm',
        description: 'form3ResultsDescription', 
        folder: 'exam-results' 
      },
      { 
        key: 'form4Results', 
        name: 'form4ResultsPdf', 
        year: 'form4ResultsYear', 
        term: 'form4ResultsTerm',
        description: 'form4ResultsDescription', 
        folder: 'exam-results' 
      },
      { 
        key: 'mockExams', 
        name: 'mockExamsResultsPdf', 
        year: 'mockExamsYear', 
        term: 'mockExamsTerm',
        description: 'mockExamsDescription', 
        folder: 'exam-results' 
      },
      { 
        key: 'kcse', 
        name: 'kcseResultsPdf', 
        year: 'kcseYear', 
        term: 'kcseTerm',
        description: 'kcseDescription', 
        folder: 'exam-results' 
      }
    ];

    // Process all document uploads
    const allFields = [...documentFields, ...examFields];
    
    for (const field of allFields) {
      const pdfFile = formData.get(field.name);
      if (pdfFile && pdfFile.size > 0) {
        console.log(`📤 Uploading ${field.key} file:`, pdfFile.name);
        uploadPromises[field.key] = uploadPdfToCloudinary(pdfFile, field.folder);
      }
    }

    const uploadEntries = Object.entries(uploadPromises);
    console.log("🔄 Total uploads to process:", uploadEntries.length);
    
    const results = await Promise.allSettled(uploadEntries.map(([key, promise]) => promise));
    
    results.forEach((result, index) => {
      const [key] = uploadEntries[index];
      if (result.status === 'fulfilled' && result.value) {
        uploadResults[key] = result.value;
        console.log(`✅ Upload successful for ${key}:`, result.value.original_name);
      } else if (result.status === 'rejected') {
        console.error(`❌ Upload failed for ${key}:`, result.reason);
      }
    });

    // REMOVED: All additional files processing

    // Delete old files if replacing
    const filesToDelete = [];
    
    if (existingDocument) {
      // REMOVED: Additional documents deletion logic
    }

    // Delete old main files if replacing
    for (const field of allFields) {
      if (uploadResults[field.key] && existingDocument && existingDocument[field.name]) {
        console.log(`🗑️ Replacing old file for ${field.key}:`, existingDocument[field.name]);
        filesToDelete.push(deleteFromCloudinary(existingDocument[field.name]));
      }
    }

    if (filesToDelete.length > 0) {
      console.log("🗑️ Deleting old files:", filesToDelete.length);
      await Promise.all(filesToDelete);
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date()
    };

    // Parse JSON fields
    const feesDayDistributionJson = formData.get("feesDayDistributionJson");
    const feesBoardingDistributionJson = formData.get("feesBoardingDistributionJson");
    const admissionFeeDistribution = formData.get("admissionFeeDistribution");

    if (feesDayDistributionJson) {
      try {
        updateData.feesDayDistributionJson = JSON.parse(feesDayDistributionJson);
      } catch (e) {
        console.error("❌ Error parsing feesDayDistributionJson:", e);
      }
    }
    
    if (feesBoardingDistributionJson) {
      try {
        updateData.feesBoardingDistributionJson = JSON.parse(feesBoardingDistributionJson);
      } catch (e) {
        console.error("❌ Error parsing feesBoardingDistributionJson:", e);
      }
    }
    
    if (admissionFeeDistribution) {
      try {
        updateData.admissionFeeDistribution = JSON.parse(admissionFeeDistribution);
      } catch (e) {
        console.error("❌ Error parsing admissionFeeDistribution:", e);
      }
    }

    // Process all fields (documents + exams)
    for (const field of allFields) {
      // Handle file upload data
      if (uploadResults[field.key]) {
        const prismaFieldMap = {
          // Document fields
          'curriculum': {
            pdf: 'curriculumPDF',
            name: 'curriculumPdfName',
            size: 'curriculumPdfSize',
            uploadDate: 'curriculumPdfUploadDate'
          },
          'feesDay': {
            pdf: 'feesDayDistributionPdf',
            name: 'feesDayPdfName',
            size: 'feesDayPdfSize',
            uploadDate: 'feesDayPdfUploadDate'
          },
          'feesBoarding': {
            pdf: 'feesBoardingDistributionPdf',
            name: 'feesBoardingPdfName',
            size: 'feesBoardingPdfSize',
            uploadDate: 'feesBoardingPdfUploadDate'
          },
          'admissionFee': {
            pdf: 'admissionFeePdf',
            name: 'admissionFeePdfName',
            size: 'admissionFeePdfSize',
            uploadDate: 'admissionFeePdfUploadDate'
          },
          // Exam fields
          'form1Results': {
            pdf: 'form1ResultsPdf',
            name: 'form1ResultsPdfName',
            size: 'form1ResultsPdfSize',
            uploadDate: 'form1ResultsUploadDate'
          },
          'form2Results': {
            pdf: 'form2ResultsPdf',
            name: 'form2ResultsPdfName',
            size: 'form2ResultsPdfSize',
            uploadDate: 'form2ResultsUploadDate'
          },
          'form3Results': {
            pdf: 'form3ResultsPdf',
            name: 'form3ResultsPdfName',
            size: 'form3ResultsPdfSize',
            uploadDate: 'form3ResultsUploadDate'
          },
          'form4Results': {
            pdf: 'form4ResultsPdf',
            name: 'form4ResultsPdfName',
            size: 'form4ResultsPdfSize',
            uploadDate: 'form4ResultsUploadDate'
          },
          'mockExams': {
            pdf: 'mockExamsResultsPdf',
            name: 'mockExamsPdfName',
            size: 'mockExamsPdfSize',
            uploadDate: 'mockExamsUploadDate'
          },
          'kcse': {
            pdf: 'kcseResultsPdf',
            name: 'kcsePdfName',
            size: 'kcsePdfSize',
            uploadDate: 'kcseUploadDate'
          }
        };
        
        const fields = prismaFieldMap[field.key];
        if (fields) {
          updateData[fields.pdf] = uploadResults[field.key].url;
          updateData[fields.name] = uploadResults[field.key].original_name;
          updateData[fields.size] = uploadResults[field.key].bytes;
          updateData[fields.uploadDate] = new Date();
        }
      }
      
      // Handle year, term, and description fields
      const year = formData.get(field.year);
      const description = formData.get(field.description);
      const term = field.term ? formData.get(field.term) : null;

      if (year !== null) {
        updateData[field.year] = parseIntField(year);
      }
      if (description !== null) {
        updateData[field.description] = parseStringField(description);
      }
      if (field.term && term !== null) {
        updateData[field.term] = parseStringField(term);
      }
    }

    console.log("📝 Update data prepared:", updateData);

    // Create or update document
    let finalDocument;
    
    if (existingDocument) {
      console.log("🔄 Updating existing document ID:", existingDocument.id);
      const updatedDocument = await prisma.schoolDocument.update({
        where: { id: existingDocument.id },
        data: updateData
      });

      finalDocument = await prisma.schoolDocument.findUnique({
        where: { id: existingDocument.id }
      });

      console.log("✅ Document update successful");

      return NextResponse.json({
        success: true,
        message: "School documents updated successfully",
        document: cleanDocumentResponse(finalDocument)
      });

    } else {
      console.log("🆕 Creating new document");
      const newDocument = await prisma.schoolDocument.create({
        data: updateData
      });

      finalDocument = await prisma.schoolDocument.findUnique({
        where: { id: newDocument.id }
      });

      console.log("✅ Document creation successful");

      return NextResponse.json({
        success: true,
        message: "School documents created successfully",
        document: cleanDocumentResponse(finalDocument)
      }, { status: 201 });
    }

  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        details: error.stack
      },
      { status: 500 }
    );
  }
}

// PUT - Update specific document field
export async function PUT(req) {
  try {
    console.log("📥 PUT Request received");
    
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json(
        { success: false, error: "Document ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { field, data } = body;

    if (!field || !data) {
      return NextResponse.json(
        { success: false, error: "Field and data are required" },
        { status: 400 }
      );
    }

    console.log(`🔄 Updating field: ${field} with data:`, data);

    const updateData = {
      [field]: data,
      updatedAt: new Date()
    };

    const updatedDocument = await prisma.schoolDocument.update({
      where: { id: parseInt(documentId) },
      data: updateData
    });

    console.log("✅ Document field updated successfully");

    return NextResponse.json({
      success: true,
      message: "Document field updated successfully",
      document: cleanDocumentResponse(updatedDocument)
    });

  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (for deleting specific files)
export async function PATCH(req) {
  try {
    console.log("📥 PATCH Request received");
    
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');
    const field = searchParams.get('field');
    
    if (!documentId || !field) {
      return NextResponse.json(
        { success: false, error: "Document ID and field are required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { action, fileId } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    console.log(`🔄 PATCH action: ${action} on field: ${field}, fileId: ${fileId}`);

    if (action === 'deleteFile') {
      // Find the document first
      const document = await prisma.schoolDocument.findUnique({
        where: { id: parseInt(documentId) }
      });

      if (!document) {
        return NextResponse.json(
          { success: false, error: "Document not found" },
          { status: 404 }
        );
      }

      let fileUrlToDelete = null;

      // REMOVED: Additional documents handling

      if (document[field]) {
        // Delete main document field
        fileUrlToDelete = document[field];
        
        // Get field mapping to clear related fields
        const fieldMappings = {
          // Document fields
          'curriculumPDF': {
            name: 'curriculumPdfName',
            size: 'curriculumPdfSize',
            uploadDate: 'curriculumPdfUploadDate',
            description: 'curriculumDescription',
            year: 'curriculumYear',
            term: 'curriculumTerm'
          },
          'feesDayDistributionPdf': {
            name: 'feesDayPdfName',
            size: 'feesDayPdfSize',
            uploadDate: 'feesDayPdfUploadDate',
            description: 'feesDayDescription',
            year: 'feesDayYear',
            term: 'feesDayTerm'
          },
          'feesBoardingDistributionPdf': {
            name: 'feesBoardingPdfName',
            size: 'feesBoardingPdfSize',
            uploadDate: 'feesBoardingPdfUploadDate',
            description: 'feesBoardingDescription',
            year: 'feesBoardingYear',
            term: 'feesBoardingTerm'
          },
          'admissionFeePdf': {
            name: 'admissionFeePdfName',
            size: 'admissionFeePdfSize',
            uploadDate: 'admissionFeePdfUploadDate',
            description: 'admissionFeeDescription',
            year: 'admissionFeeYear',
            term: 'admissionFeeTerm'
          },
          // Exam fields
          'form1ResultsPdf': {
            name: 'form1ResultsPdfName',
            size: 'form1ResultsPdfSize',
            uploadDate: 'form1ResultsUploadDate',
            description: 'form1ResultsDescription',
            year: 'form1ResultsYear',
            term: 'form1ResultsTerm'
          },
          // ... add other exam fields similarly
        };

        const clearData = {
          [field]: null,
          updatedAt: new Date()
        };

        const mapping = fieldMappings[field];
        if (mapping) {
          clearData[mapping.name] = null;
          clearData[mapping.size] = null;
          clearData[mapping.uploadDate] = null;
        }
        
        await prisma.schoolDocument.update({
          where: { id: parseInt(documentId) },
          data: clearData
        });
      }

      // Delete file from Cloudinary
      if (fileUrlToDelete) {
        await deleteFromCloudinary(fileUrlToDelete);
      }

      const updatedDocument = await prisma.schoolDocument.findUnique({
        where: { id: parseInt(documentId) }
      });

      return NextResponse.json({
        success: true,
        message: "File deleted successfully",
        document: cleanDocumentResponse(updatedDocument)
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("❌ PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete entire document
export async function DELETE(req) {
  try {
    console.log("🗑️ DELETE Request received");
    
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      // If no ID, delete the first document (legacy behavior)
      return handleDeleteFirstDocument();
    }

    return handleDeleteDocumentById(parseInt(documentId));

  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleDeleteFirstDocument() {
  const document = await prisma.schoolDocument.findFirst();

  if (!document) {
    console.log("📭 No document found to delete");
    return NextResponse.json(
      { success: false, message: "No document found to delete" },
      { status: 404 }
    );
  }

  console.log("🗑️ Deleting document:", document.id);
  return deleteDocumentAndFiles(document);
}

async function handleDeleteDocumentById(documentId) {
  const document = await prisma.schoolDocument.findUnique({
    where: { id: documentId }
  });

  if (!document) {
    console.log("📭 No document found to delete");
    return NextResponse.json(
      { success: false, message: "Document not found" },
      { status: 404 }
    );
  }

  console.log("🗑️ Deleting document:", document.id);
  return deleteDocumentAndFiles(document);
}

async function deleteDocumentAndFiles(document) {
  const filesToDelete = [
    document.curriculumPDF,
    document.feesDayDistributionPdf,
    document.feesBoardingDistributionPdf,
    document.admissionFeePdf,
    document.form1ResultsPdf,
    document.form2ResultsPdf,
    document.form3ResultsPdf,
    document.form4ResultsPdf,
    document.mockExamsResultsPdf,
    document.kcseResultsPdf,
  ].filter(Boolean);


  console.log("🗑️ Files to delete:", filesToDelete.length);

  await Promise.all(filesToDelete.map(file => deleteFromCloudinary(file)));

  await prisma.schoolDocument.delete({
    where: { id: document.id }
  });

  console.log("✅ Document deleted successfully");

  return NextResponse.json({
    success: true,
    message: "School documents deleted successfully"
  });
}