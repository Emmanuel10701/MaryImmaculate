import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from "../../../libs/prisma";

// ========== HELPER FUNCTIONS ==========

const parseAmount = (value) => {
  if (!value) return 0;
  const str = String(value).trim();
  const cleaned = str.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

const normalizeTerm = (term) => {
  if (!term) return term;
  const termStr = String(term).trim().toLowerCase();
  const termMap = {
    'term1': 'Term 1', 'term 1': 'Term 1', '1': 'Term 1', 'first term': 'Term 1',
    'term2': 'Term 2', 'term 2': 'Term 2', '2': 'Term 2', 'second term': 'Term 2',
    'term3': 'Term 3', 'term 3': 'Term 3', '3': 'Term 3', 'third term': 'Term 3'
  };
  return termMap[termStr] || termStr.charAt(0).toUpperCase() + termStr.slice(1);
};

const normalizeAcademicYear = (year) => {
  if (!year) return year;
  const yearStr = String(year).trim();
  if (/^\d{4}$/.test(yearStr)) {
    const startYear = parseInt(yearStr);
    return `${startYear}/${startYear + 1}`;
  }
  if (/^\d{4}\/\d{4}$/.test(yearStr)) return yearStr;
  return yearStr;
};

const calculatePaymentStatus = (amount, amountPaid) => {
  const balance = amount - amountPaid;
  if (balance <= 0) return 'paid';
  if (amountPaid > 0) return 'partial';
  return 'pending';
};

// ========== STATISTICS FUNCTIONS ==========

const calculateFeeStatistics = async (where = {}) => {
  try {
    console.log('Calculating statistics with where:', where);
    
    // Get basic aggregates
    const aggregates = await prisma.feeBalance.aggregate({
      where,
      _sum: {
        amount: true,
        amountPaid: true,
        balance: true
      },
      _count: {
        _all: true
      }
    });

    // Get counts by payment status
    const statusCounts = await prisma.feeBalance.groupBy({
      by: ['paymentStatus'],
      where,
      _count: {
        _all: true
      }
    });

    // Get counts by term
    const termCounts = await prisma.feeBalance.groupBy({
      by: ['term'],
      where,
      _count: {
        _all: true
      }
    });

    // Get counts by academic year
    const yearCounts = await prisma.feeBalance.groupBy({
      by: ['academicYear'],
      where,
      _count: {
        _all: true
      }
    });

    // Get counts by form
    const formCounts = await prisma.feeBalance.groupBy({
      by: ['form'],
      where,
      _count: {
        _all: true
      }
    });

    // Calculate distributions
    const statusDistribution = statusCounts.reduce((acc, item) => ({
      ...acc,
      [item.paymentStatus]: item._count._all
    }), { paid: 0, partial: 0, pending: 0 });

    const termDistribution = termCounts.reduce((acc, item) => ({
      ...acc,
      [item.term]: item._count._all
    }), { 'Term 1': 0, 'Term 2': 0, 'Term 3': 0 });

    const yearDistribution = yearCounts.reduce((acc, item) => ({
      ...acc,
      [item.academicYear]: item._count._all
    }), {});

    const formDistribution = formCounts.reduce((acc, item) => ({
      ...acc,
      [item.form]: item._count._all
    }), { 'Form 1': 0, 'Form 2': 0, 'Form 3': 0, 'Form 4': 0 });

    return {
      totalRecords: aggregates._count._all || 0,
      totalAmount: aggregates._sum.amount || 0,
      totalPaid: aggregates._sum.amountPaid || 0,
      totalBalance: aggregates._sum.balance || 0,
      formDistribution,
      termDistribution,
      yearDistribution,
      statusDistribution,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    // Return default values
    return {
      totalRecords: 0,
      totalAmount: 0,
      totalPaid: 0,
      totalBalance: 0,
      formDistribution: { 'Form 1': 0, 'Form 2': 0, 'Form 3': 0, 'Form 4': 0 },
      termDistribution: { 'Term 1': 0, 'Term 2': 0, 'Term 3': 0 },
      yearDistribution: {},
      statusDistribution: { paid: 0, partial: 0, pending: 0 },
      updatedAt: new Date().toISOString()
    };
  }
};

// ========== VALIDATION FUNCTIONS ==========

const validateFormSelection = (form) => {
  const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const formMap = {
    'form1': 'Form 1', 'form 1': 'Form 1', '1': 'Form 1',
    'form2': 'Form 2', 'form 2': 'Form 2', '2': 'Form 2',
    'form3': 'Form 3', 'form 3': 'Form 3', '3': 'Form 3',
    'form4': 'Form 4', 'form 4': 'Form 4', '4': 'Form 4'
  };
  
  const normalized = formMap[form.toLowerCase()] || form;
  
  if (!validForms.includes(normalized)) {
    throw new Error('Invalid form selection. Must be Form 1, Form 2, Form 3, or Form 4');
  }
  
  return normalized;
};

// ========== PARSING FUNCTIONS ==========

const parseCSV = async (file) => {
  const text = await file.text();
  
  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
          .map((row, index) => {
            try {
              const admissionNumber = String(
                row.admissionNumber || row.admission || 
                row.admno || row.AdmNo || row.adm || row.ADM || ''
              ).trim();
              
              if (!admissionNumber) {
                return null;
              }
              
              const form = row.form || row.Form || row.FORM || row.class || row.Class || '';
              const term = row.term || row.Term || row.TERM || '';
              const academicYear = row.academicYear || row.academicyear || row.year || row.Year || row.session || row.Session || '';
              const amount = parseAmount(row.amount || row.fee || row.balance || row.total || 0);
              const amountPaid = parseAmount(row.amountPaid || row.paid || row['amount paid'] || 0);
              const balance = parseAmount(row.balance || row.Balance || 0) || (amount - amountPaid);
              const dueDate = parseDate(row.dueDate || row['due date'] || row.duedate || row['Due Date'] || '');
              
              return {
                admissionNumber,
                form,
                term,
                academicYear,
                amount,
                amountPaid,
                balance,
                dueDate,
                paymentStatus: calculatePaymentStatus(amount, amountPaid)
              };
            } catch (error) {
              console.error(`Error parsing CSV row ${index}:`, error);
              return null;
            }
          })
          .filter(item => item !== null);
        
        resolve(data);
      },
      error: reject
    });
  });
};

const parseExcel = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    const data = jsonData
      .map((row, index) => {
        try {
          const findValue = (possibleKeys) => {
            for (const key of possibleKeys) {
              if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
                return String(row[key]).trim();
              }
              const lowerKey = key.toLowerCase();
              for (const rowKey in row) {
                if (rowKey.toLowerCase() === lowerKey) {
                  const value = row[rowKey];
                  if (value !== undefined && value !== null && value !== '') {
                    return String(value).trim();
                  }
                }
              }
            }
            return '';
          };
          
          const admissionNumber = findValue([
            'admissionNumber', 'AdmissionNumber', 'Admission Number', 
            'ADMISSION_NUMBER', 'admno', 'AdmNo', 'AdmissionNo', 'AdmissionNO',
            'admission', 'Admission', 'ADMISSION', 'Adm', 'adm', 'ADM',
            'RegNo', 'regno', 'Registration', 'registration'
          ]);
          
          if (!admissionNumber) {
            return null;
          }
          
          const form = findValue(['form', 'Form', 'FORM', 'class', 'Class']);
          const term = findValue(['term', 'Term', 'TERM']);
          const academicYear = findValue(['academicYear', 'AcademicYear', 'Academic Year', 'year', 'Year', 'YEAR', 'session', 'Session']);
          const amount = parseAmount(findValue(['amount', 'Amount', 'AMOUNT', 'fee', 'Fee', 'FEE', 'balance', 'Balance', 'BALANCE', 'total', 'Total']));
          const amountPaid = parseAmount(findValue(['amountPaid', 'AmountPaid', 'Amount Paid', 'paid', 'Paid', 'PAID']));
          const balance = parseAmount(findValue(['balance', 'Balance', 'BALANCE'])) || (amount - amountPaid);
          const dueDateStr = findValue(['dueDate', 'DueDate', 'Due Date', 'duedate', 'Duedate']);
          const dueDate = parseDate(dueDateStr);
          
          return {
            admissionNumber: String(admissionNumber).trim(),
            form,
            term,
            academicYear,
            amount,
            amountPaid,
            balance,
            dueDate,
            paymentStatus: calculatePaymentStatus(amount, amountPaid)
          };
        } catch (error) {
          console.error(`Error parsing Excel row ${index}:`, error);
          return null;
        }
      })
      .filter(item => item !== null);
    
    return data;
    
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== UPLOAD STRATEGY FUNCTIONS ==========

const processNewUpload = async (fees, uploadBatchId, selectedForm, action = 'skip') => {
  const stats = {
    totalRows: fees.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: [],
    createdFees: []
  };
  
  const filteredFees = fees.filter(fee => 
    validateFormSelection(fee.form || selectedForm) === selectedForm
  );
  
  if (filteredFees.length === 0) {
    throw new Error(`No fees found for form ${selectedForm}. Make sure the form column matches the selected form.`);
  }
  
  // Get students in selected form
  const admissionNumbers = filteredFees.map(f => f.admissionNumber);
  const students = await prisma.databaseStudent.findMany({
    where: {
      admissionNumber: { in: admissionNumbers },
      form: selectedForm,
      status: 'active'
    },
    select: {
      admissionNumber: true,
      firstName: true,
      lastName: true
    }
  });
  
  const studentMap = new Map();
  students.forEach(student => {
    studentMap.set(student.admissionNumber, student);
  });
  
  // Process each fee WITHOUT checking for existing fees (just validate students exist)
  const feesToCreate = [];
  
  for (const [index, fee] of filteredFees.entries()) {
    try {
      // Validate required fields
      if (!fee.admissionNumber || !fee.term || !fee.academicYear || !fee.amount) {
        stats.errorRows++;
        stats.errors.push(`Row ${index + 2}: Missing required fields (admissionNumber, term, academicYear, amount)`);
        continue;
      }
      
      // Check if student exists in selected form and is active
      const student = studentMap.get(fee.admissionNumber);
      
      if (!student) {
        stats.errorRows++;
        stats.errors.push(`Row ${index + 2}: Student ${fee.admissionNumber} not found in ${selectedForm} or is inactive`);
        continue;
      }
      
      const normalizedTerm = normalizeTerm(fee.term);
      const normalizedYear = normalizeAcademicYear(fee.academicYear);
      const normalizedForm = validateFormSelection(fee.form || selectedForm);
      
      // Create fee data (always create, never check duplicates for new uploads)
      const feeData = {
        admissionNumber: fee.admissionNumber,
        form: normalizedForm,
        term: normalizedTerm,
        academicYear: normalizedYear,
        amount: fee.amount,
        amountPaid: fee.amountPaid || 0,
        balance: fee.balance || (fee.amount - (fee.amountPaid || 0)),
        dueDate: fee.dueDate ? new Date(fee.dueDate) : null,
        paymentStatus: calculatePaymentStatus(fee.amount, fee.amountPaid || 0),
        uploadBatchId: uploadBatchId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Just create the fee (database will handle duplicates via unique constraints if any)
      feesToCreate.push(feeData);
      stats.createdFees.push({
        admissionNumber: fee.admissionNumber,
        term: normalizedTerm,
        academicYear: normalizedYear
      });
      stats.validRows++;
      
    } catch (error) {
      stats.errorRows++;
      stats.errors.push(`Row ${index + 2}: ${error.message}`);
      continue;
    }
  }
  
  // Create all fees in a batch
  if (feesToCreate.length > 0) {
    await prisma.feeBalance.createMany({
      data: feesToCreate,
      skipDuplicates: true // Let database skip duplicates automatically
    });
  }
  
  return stats;
};

const processUpdateUpload = async (fees, uploadBatchId, selectedForm) => {
  const stats = {
    totalRows: fees.length,
    validRows: 0,
    updatedRows: 0,
    createdRows: 0,
    deletedRows: 0,
    errorRows: 0,
    errors: [],
    updatedFees: [],
    createdFees: []
  };
  
  // Filter fees to only include the target form
  const filteredFees = fees.filter(fee => 
    validateFormSelection(fee.form || selectedForm) === selectedForm
  );
  
  if (filteredFees.length === 0) {
    throw new Error(`No fees found for form ${selectedForm}. Make sure the form column matches the selected form.`);
  }
  
  // Get all existing fees in this form
  const existingFees = await prisma.feeBalance.findMany({
    where: {
      form: selectedForm
    },
    select: {
      id: true,
      admissionNumber: true,
      term: true,
      academicYear: true,
      uploadBatchId: true
    }
  });
  
  // Create a map of existing fees by composite key
  const existingFeeMap = new Map();
  existingFees.forEach(fee => {
    const key = `${fee.admissionNumber}-${normalizeTerm(fee.term)}-${normalizeAcademicYear(fee.academicYear)}`;
    existingFeeMap.set(key, { 
      id: fee.id, 
      uploadBatchId: fee.uploadBatchId 
    });
  });
  
  const seenKeys = new Set();
  const feeKeysInNewUpload = new Set();
  
  // Process each fee in the upload
  for (const [index, fee] of filteredFees.entries()) {
    try {
      // Validate required fields
      if (!fee.admissionNumber || !fee.term || !fee.academicYear || !fee.amount) {
        stats.errorRows++;
        stats.errors.push(`Row ${index + 2}: Missing required fields (admissionNumber, term, academicYear, amount)`);
        continue;
      }
      
      // Check if student exists in selected form and is active
      const student = await prisma.databaseStudent.findFirst({
        where: {
          admissionNumber: fee.admissionNumber,
          form: selectedForm,
          status: 'active'
        }
      });
      
      if (!student) {
        stats.errorRows++;
        stats.errors.push(`Row ${index + 2}: Student ${fee.admissionNumber} not found in ${selectedForm} or is inactive`);
        continue;
      }
      
      const normalizedTerm = normalizeTerm(fee.term);
      const normalizedYear = normalizeAcademicYear(fee.academicYear);
      const normalizedForm = validateFormSelection(fee.form || selectedForm);
      
      const feeKey = `${fee.admissionNumber}-${normalizedTerm}-${normalizedYear}`;
      
      // Check duplicates within the file
      if (seenKeys.has(feeKey)) {
        stats.errorRows++;
        stats.errors.push(`Row ${index + 2}: Duplicate fee in file: ${fee.admissionNumber} (${normalizedTerm} ${normalizedYear})`);
        continue;
      }
      seenKeys.add(feeKey);
      feeKeysInNewUpload.add(feeKey);
      
      const feeData = {
        admissionNumber: fee.admissionNumber,
        form: normalizedForm,
        term: normalizedTerm,
        academicYear: normalizedYear,
        amount: fee.amount,
        amountPaid: fee.amountPaid || 0,
        balance: fee.balance || (fee.amount - (fee.amountPaid || 0)),
        dueDate: fee.dueDate ? new Date(fee.dueDate) : null,
        paymentStatus: calculatePaymentStatus(fee.amount, fee.amountPaid || 0),
        uploadBatchId: uploadBatchId,
        updatedAt: new Date()
      };
      
      // Check if fee exists
      const existingFee = existingFeeMap.get(feeKey);
      
      if (existingFee) {
        // Update existing fee
        await prisma.feeBalance.update({
          where: { id: existingFee.id },
          data: feeData
        });
        stats.updatedRows++;
        stats.updatedFees.push({
          admissionNumber: fee.admissionNumber,
          term: normalizedTerm,
          academicYear: normalizedYear
        });
      } else {
        // Create new fee
        await prisma.feeBalance.create({
          data: {
            ...feeData,
            createdAt: new Date()
          }
        });
        stats.createdRows++;
        stats.createdFees.push({
          admissionNumber: fee.admissionNumber,
          term: normalizedTerm,
          academicYear: normalizedYear
        });
      }
      
      stats.validRows++;
      
    } catch (error) {
      stats.errorRows++;
      stats.errors.push(`Row ${index + 2}: ${error.message}`);
      continue;
    }
  }
  
  // Delete fees in this form that are not in the new upload
  const feesToDelete = existingFees.filter(fee => {
    const key = `${fee.admissionNumber}-${normalizeTerm(fee.term)}-${normalizeAcademicYear(fee.academicYear)}`;
    return !feeKeysInNewUpload.has(key);
  });
  
  if (feesToDelete.length > 0) {
    await prisma.feeBalance.deleteMany({
      where: {
        id: { in: feesToDelete.map(f => f.id) }
      }
    });
    
    stats.deletedRows = feesToDelete.length;
  }
  
  return stats;
};

// ========== API ENDPOINTS ==========

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const uploadType = formData.get('uploadType'); // 'new' or 'update'
    const selectedForm = formData.get('selectedForm');
    const checkDuplicates = formData.get('checkDuplicates') === 'true';
    const duplicateAction = formData.get('duplicateAction') || 'skip';
    const uploadedBy = formData.get('uploadedBy') || 'System';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!uploadType) {
      return NextResponse.json(
        { success: false, error: 'Upload type is required (new or update)' },
        { status: 400 }
      );
    }
    
    if (!selectedForm) {
      return NextResponse.json(
        { success: false, error: 'Please select a form' },
        { status: 400 }
      );
    }
    
    // Validate form selection
    let targetForm;
    try {
      targetForm = validateFormSelection(selectedForm);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload CSV or Excel files.' },
        { status: 400 }
      );
    }
    
    // Parse file first to get data for validation
    let rawData = [];
    
    if (fileExtension === 'csv') {
      rawData = await parseCSV(file);
    } else {
      rawData = await parseExcel(file);
    }
    
    if (rawData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fee data found in file.' },
        { status: 400 }
      );
    }
// If just checking for duplicates (pre-validation)
if (checkDuplicates) {
  // Check if this is for update upload only (frontend should only call for update)
  // But we'll handle both cases for safety
  
  const admissionNumbers = rawData.map(f => f.admissionNumber);
  
  // Get existing students in the target form
  const existingStudents = await prisma.databaseStudent.findMany({
    where: {
      admissionNumber: { in: admissionNumbers },
      form: targetForm,
      status: 'active'
    },
    select: {
      admissionNumber: true,
      firstName: true,
      lastName: true,
      form: true
    }
  });
  
  const studentMap = new Map();
  existingStudents.forEach(student => {
    studentMap.set(student.admissionNumber, student);
  });
  
  // Also check for existing fee duplicates (same admission + term + year)
  const existingFees = await prisma.feeBalance.findMany({
    where: {
      admissionNumber: { in: admissionNumbers },
      form: targetForm
    },
    select: {
      admissionNumber: true,
      term: true,
      academicYear: true
    }
  });
  
  const existingFeeMap = new Map();
  existingFees.forEach(fee => {
    const key = `${fee.admissionNumber}-${normalizeTerm(fee.term)}-${normalizeAcademicYear(fee.academicYear)}`;
    existingFeeMap.set(key, fee);
  });
  
  const duplicates = rawData
    .map((fee, index) => {
      const existingStudent = studentMap.get(fee.admissionNumber);
      const normalizedTerm = normalizeTerm(fee.term);
      const normalizedYear = normalizeAcademicYear(fee.academicYear);
      const feeKey = `${fee.admissionNumber}-${normalizedTerm}-${normalizedYear}`;
      const existingFee = existingFeeMap.get(feeKey);
      
      // Check if student exists in form
      if (existingStudent) {
        return {
          row: index + 2,
          admissionNumber: fee.admissionNumber,
          name: `${existingStudent.firstName} ${existingStudent.lastName}`,
          form: existingStudent.form,
          term: normalizedTerm,
          academicYear: normalizedYear,
          existingFee: !!existingFee, // Whether an exact fee already exists
          matchType: existingFee ? 'exact_fee' : 'student_exists'
        };
      }
      
      // Student doesn't exist in form
      return {
        row: index + 2,
        admissionNumber: fee.admissionNumber,
        name: 'Student not found in form',
        form: targetForm,
        term: normalizedTerm,
        academicYear: normalizedYear,
        existingFee: !!existingFee,
        matchType: 'student_not_found'
      };
    })
    .filter(dup => dup !== null);
  
  return NextResponse.json({
    success: true,
    hasDuplicates: duplicates.length > 0,
    duplicates: duplicates,
    totalRows: rawData.length,
    message: duplicates.length > 0 
      ? `Found ${duplicates.length} entries that need attention` 
      : `All entries are ready for processing`
  });
}
    
    // Create batch record
    const batchId = `FEE_BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const uploadBatch = await prisma.feeBalanceUpload.create({
      data: {
        id: batchId,
        fileName: file.name,
        fileType: fileExtension,
        uploadedBy: uploadedBy,
        status: 'processing',
        term: '',
        academicYear: ''
      }
    });
    
    try {
      let processingStats;
      
      // Process upload based on type
      if (uploadType === 'new') {
        processingStats = await processNewUpload(
          rawData, 
          batchId, 
          targetForm, 
          duplicateAction
        );
      } else if (uploadType === 'update') {
        processingStats = await processUpdateUpload(
          rawData, 
          batchId, 
          targetForm
        );
      }
      
      // Update batch with stats - WITHOUT METADATA
      await prisma.feeBalanceUpload.update({
        where: { id: batchId },
        data: {
          status: 'completed',
          processedDate: new Date(),
          totalRows: processingStats.totalRows,
          validRows: processingStats.validRows,
          skippedRows: processingStats.skippedRows || 0,
          errorRows: processingStats.errorRows,
          errorLog: processingStats.errors.length > 0 ? processingStats.errors.slice(0, 50) : undefined
        }
      });
      
      // Calculate statistics
      const stats = await calculateFeeStatistics();
      
      return NextResponse.json({
        success: true,
        message: uploadType === 'new' 
          ? `Successfully processed ${processingStats.validRows} new fees for ${targetForm} (${processingStats.skippedRows} skipped, ${processingStats.replacedRows} replaced)` 
          : `Successfully updated ${targetForm} fees: ${processingStats.updatedRows} updated, ${processingStats.createdRows} created, ${processingStats.deletedRows} deleted`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          status: 'completed',
          uploadType,
          targetForm,
          duplicateAction
        },
        processingStats: {
          totalRows: processingStats.totalRows,
          validRows: processingStats.validRows,
          skippedRows: processingStats.skippedRows || 0,
          replacedRows: processingStats.replacedRows || 0,
          updatedRows: processingStats.updatedRows || 0,
          createdRows: processingStats.createdRows || 0,
          deletedRows: processingStats.deletedRows || 0,
          errorRows: processingStats.errorRows,
          errors: processingStats.errors.slice(0, 20)
        },
        stats: stats,
        errors: processingStats.errors.slice(0, 20)
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      
      await prisma.feeBalanceUpload.update({
        where: { id: batchId },
        data: {
          status: 'failed',
          processedDate: new Date(),
          errorRows: 1,
          errorLog: [error.message]
        }
      });
      
      throw error;
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Upload failed'
      },
      { status: 500 }
    );
  }
}

// [Rest of the GET, PUT, DELETE endpoints remain the same as before...]
// Just copy the GET, PUT, DELETE endpoints from your previous working version

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const term = url.searchParams.get('term');
    const academicYear = url.searchParams.get('academicYear');
    const paymentStatus = url.searchParams.get('paymentStatus');
    const form = url.searchParams.get('form');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const includeStudent = url.searchParams.get('includeStudent') === 'true';
    const sortBy = url.searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    
    // Get upload history
    if (action === 'uploads') {
      const uploads = await prisma.feeBalanceUpload.findMany({
        orderBy: { uploadDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      });
      
      const total = await prisma.feeBalanceUpload.count();
      
      return NextResponse.json({
        success: true,
        uploads,
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        }
      });
    }
    
    // Get statistics
    if (action === 'stats') {
      const where = {};
      
      if (form) where.form = form;
      if (term) where.term = term;
      if (academicYear) where.academicYear = academicYear;
      if (paymentStatus) where.paymentStatus = paymentStatus;
      
      const stats = await calculateFeeStatistics(where);
      
      return NextResponse.json({
        success: true,
        stats
      });
    }
    
    // Get fee balances for a specific student
    if (action === 'student-fees' && admissionNumber) {
      const [feeBalances, student] = await Promise.all([
        prisma.feeBalance.findMany({
          where: { admissionNumber },
          orderBy: { updatedAt: 'desc' }
        }),
        includeStudent ? prisma.databaseStudent.findUnique({
          where: { admissionNumber },
          select: {
            firstName: true,
            lastName: true,
            form: true,
            stream: true,
            parentPhone: true,
            email: true
          }
        }) : Promise.resolve(null)
      ]);
      
      // Calculate student summary
      const studentSummary = feeBalances.reduce((acc, fee) => ({
        totalAmount: acc.totalAmount + fee.amount,
        totalPaid: acc.totalPaid + fee.amountPaid,
        totalBalance: acc.totalBalance + fee.balance,
        recordCount: acc.recordCount + 1
      }), { totalAmount: 0, totalPaid: 0, totalBalance: 0, recordCount: 0 });
      
      return NextResponse.json({
        success: true,
        student,
        feeBalances,
        summary: studentSummary
      });
    }
    
    // Default: Get fee balances with filters
    const where = {};
    
    if (admissionNumber) {
      where.admissionNumber = admissionNumber;
    }
    
    if (form) {
      where.form = form;
    }
    
    if (term) {
      where.term = term;
    }
    
    if (academicYear) {
      where.academicYear = academicYear;
    }
    
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    
    if (search) {
      where.OR = [
        { admissionNumber: { contains: search } }
      ];
    }
    
    // Build orderBy
    const orderBy = {};
    orderBy[sortBy] = sortOrder;
    
    // Get fee balances with student info
    const [feeBalances, total] = await Promise.all([
      prisma.feeBalance.findMany({
        where,
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              form: true,
              stream: true
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.feeBalance.count({ where })
    ]);
    
    // Calculate summary
    const summary = await prisma.feeBalance.aggregate({
      where,
      _sum: {
        amount: true,
        amountPaid: true,
        balance: true
      },
      _count: {
        _all: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        schoolFees: feeBalances,
        summary: {
          totalAmount: summary._sum.amount || 0,
          totalPaid: summary._sum.amountPaid || 0,
          totalBalance: summary._sum.balance || 0,
          totalRecords: summary._count._all || 0
        },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch fee balances'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Fee balance ID is required' },
        { status: 400 }
      );
    }
    
    // Calculate balance if amount or amountPaid is updated
    if (updateData.amount !== undefined || updateData.amountPaid !== undefined) {
      const currentFee = await prisma.feeBalance.findUnique({
        where: { id }
      });
      
      if (!currentFee) {
        return NextResponse.json(
          { success: false, error: 'Fee balance not found' },
          { status: 404 }
        );
      }
      
      const newAmount = updateData.amount !== undefined ? updateData.amount : currentFee.amount;
      const newAmountPaid = updateData.amountPaid !== undefined ? updateData.amountPaid : currentFee.amountPaid;
      const newBalance = newAmount - newAmountPaid;
      
      updateData.balance = newBalance;
      updateData.paymentStatus = calculatePaymentStatus(newAmount, newAmountPaid);
    }
    
    // Update fee balance
    const updatedFee = await prisma.feeBalance.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            form: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Fee balance updated successfully',
      data: updatedFee
    });
    
  } catch (error) {
    console.error('PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Fee balance not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Update failed'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const feeId = url.searchParams.get('feeId');
    
    if (batchId) {
      const batch = await prisma.feeBalanceUpload.findUnique({
        where: { id: batchId }
      });
      
      if (!batch) {
        return NextResponse.json(
          { success: false, error: 'Upload batch not found' },
          { status: 404 }
        );
      }
      
      // Get count of fees from this batch
      const feeCount = await prisma.feeBalance.count({
        where: { uploadBatchId: batchId }
      });
      
      // Delete fees from this batch
      await prisma.feeBalance.deleteMany({
        where: { uploadBatchId: batchId }
      });
      
      // Delete batch
      await prisma.feeBalanceUpload.delete({
        where: { id: batchId }
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted upload batch "${batch.fileName}" and ${feeCount} fee records`,
        deletedCount: feeCount
      });
    }
    
    if (feeId) {
      const fee = await prisma.feeBalance.findUnique({
        where: { id: feeId }
      });
      
      if (!fee) {
        return NextResponse.json(
          { success: false, error: 'Fee balance not found' },
          { status: 404 }
        );
      }
      
      await prisma.feeBalance.delete({
        where: { id: feeId }
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted fee balance for ${fee.admissionNumber} (${fee.term} ${fee.academicYear})`
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Provide batchId or feeId' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}