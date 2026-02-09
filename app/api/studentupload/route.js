import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from '../../../libs/prisma';

// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager
class DeviceTokenManager {
  static validateTokensFromHeaders(headers, options = {}) {
    try {
      // Extract tokens from headers
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      // Validate admin token format (basic check)
      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      // Validate device token
      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ''}`
        };
      }

      // Parse admin token payload
      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        // Check expiration
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        // Check user role - only admins/staff can manage students
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'STAFF', 'HR_MANAGER', 'TEACHER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage students' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Student management authentication successful for user:', adminPayload.name || 'Unknown');
      
      return { 
        valid: true, 
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole
        },
        deviceInfo: deviceValid.payload
      };

    } catch (error) {
      console.error('❌ Token validation error:', error);
      return { 
        valid: false, 
        reason: 'validation_error', 
        message: 'Authentication validation failed',
        error: error.message 
      };
    }
  }

  // Validate device token
  static validateDeviceToken(token) {
    try {
      // Handle base64 decoding safely
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      // Check expiration
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
      // Check age (30 days max)
      const createdAt = new Date(payload.createdAt || payload.iat * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      if (createdAt < thirtyDaysAgo) {
        return { valid: false, reason: 'age_expired', payload, error: 'Device token is too old' };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, reason: 'invalid_format', error: error.message };
    }
  }
}

// Authentication middleware for protected requests
const authenticateRequest = (req) => {
  const headers = req.headers;
  
  // Validate tokens
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: "Authentication required to manage student data.",
          details: validationResult.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validationResult.user,
    deviceInfo: validationResult.deviceInfo
  };
};

// ========== HELPER FUNCTIONS ==========

// Helper to parse dates consistently
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  const str = String(dateStr).trim();
  
  // Reject extended year formats
  if (str.match(/^[+-]\d{6}/)) return null;
  
  // Try Excel serial number
  if (!isNaN(str) && Number(str) > 0) {
    const excelDate = Number(str);
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      if (year >= 1900 && year <= new Date().getFullYear() + 5) {
        return date;
      }
    }
  }
  
  // Try ISO string
  let date = new Date(str);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    if (year >= 1900 && year <= new Date().getFullYear() + 5) {
      return date;
    }
  }
  
  // Try common formats
  const formats = [
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
  ];
  
  for (const format of formats) {
    const match = str.match(format);
    if (match) {
      let year, month, day;
      
      if (match[1].length === 4) {
        // YYYY-MM-DD or YYYY/MM/DD
        year = parseInt(match[1]);
        month = parseInt(match[2]) - 1;
        day = parseInt(match[3]);
      } else {
        // DD/MM/YYYY or MM/DD/YYYY
        const part1 = parseInt(match[1]);
        const part2 = parseInt(match[2]);
        const part3 = parseInt(match[3]);
        
        if (part3 > 31) {
          // DD/MM/YYYY or MM/DD/YYYY with 4-digit year
          if (part1 > 12) {
            // DD/MM/YYYY
            day = part1;
            month = part2 - 1;
            year = part3;
          } else {
            // MM/DD/YYYY
            month = part1 - 1;
            day = part2;
            year = part3;
          }
        } else {
          // Ambiguous, assume DD/MM/YYYY
          day = part1;
          month = part2 - 1;
          year = part3 < 100 ? 2000 + part3 : part3;
        }
      }
      
      if (year && month >= 0 && day) {
        date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          const finalYear = date.getFullYear();
          if (finalYear >= 1900 && finalYear <= new Date().getFullYear() + 5) {
            return date;
          }
        }
      }
    }
  }
  
  return null;
};

// Build WHERE clause from query parameters
const buildWhereClause = (params) => {
  const { form, stream, gender, status, search } = params;
  const where = {};
  
  if (form && form !== 'all') where.form = form;
  if (stream && stream !== 'all') where.stream = stream;
  if (gender && gender !== 'all') where.gender = gender;
  if (status && status !== 'all') where.status = status;
  
  if (search && search.trim()) {
    const searchTerm = search.toLowerCase();
    
    where.OR = [
      { admissionNumber: { contains: searchTerm } },
      { firstName: { contains: searchTerm } },
      { middleName: { contains: searchTerm } },
      { lastName: { contains: searchTerm } },
      { email: { contains: searchTerm } },
      { parentPhone: { contains: searchTerm } }
    ];
  }
  
  return where;
};

// Calculate statistics from WHERE clause
const calculateStatistics = async (whereClause = {}) => {
  try {
    // Get form distribution
    const formStats = await prisma.databaseStudent.groupBy({
      by: ['form'],
      where: whereClause,
      _count: { id: true }
    });

    // Get total count
    const totalStudents = await prisma.databaseStudent.count({
      where: whereClause
    });

    // Convert to structured format
    const formStatsObj = formStats.reduce((acc, stat) => ({
      ...acc,
      [stat.form]: stat._count.id
    }), {});

    const stats = {
      totalStudents,
      form1: formStatsObj['Form 1'] || 0,
      form2: formStatsObj['Form 2'] || 0,
      form3: formStatsObj['Form 3'] || 0,
      form4: formStatsObj['Form 4'] || 0,
      updatedAt: new Date()
    };

    // Validate consistency
    const formSum = stats.form1 + stats.form2 + stats.form3 + stats.form4;
    const isValid = formSum === totalStudents;

    return {
      stats,
      validation: {
        isValid,
        totalStudents,
        sumOfForms: formSum,
        difference: totalStudents - formSum,
        hasDiscrepancy: !isValid
      }
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    throw error;
  }
};

// Update cached statistics
const updateCachedStats = async (stats) => {
  try {
    await prisma.studentStats.upsert({
      where: { id: 'global_stats' },
      update: {
        totalStudents: stats.totalStudents,
        form1: stats.form1,
        form2: stats.form2,
        form3: stats.form3,
        form4: stats.form4,
        updatedAt: new Date()
      },
      create: {
        id: 'global_stats',
        ...stats
      }
    });
  } catch (error) {
    console.error('Error updating cached stats:', error);
  }
};

// ========== UPLOAD STRATEGY FUNCTIONS ==========

// Validate and normalize form selection
const validateFormSelection = (forms) => {
  if (!forms || forms.length === 0) {
    throw new Error('Please select at least one form to upload');
  }
  
  const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const normalizedForms = [];
  
  forms.forEach(form => {
    const trimmed = form.trim();
    const formMap = {
      'form1': 'Form 1',
      'form 1': 'Form 1',
      '1': 'Form 1',
      'form2': 'Form 2',
      'form 2': 'Form 2',
      '2': 'Form 2',
      'form3': 'Form 3',
      'form 3': 'Form 3',
      '3': 'Form 3',
      'form4': 'Form 4',
      'form 4': 'Form 4',
      '4': 'Form 4'
    };
    
    const normalized = formMap[trimmed.toLowerCase()] || trimmed;
    if (validForms.includes(normalized)) {
      normalizedForms.push(normalized);
    }
  });
  
  if (normalizedForms.length === 0) {
    throw new Error('Please select valid forms (Form 1, Form 2, Form 3, Form 4)');
  }
  
  return normalizedForms;
};

// Check for duplicate admission numbers
const checkDuplicateAdmissionNumbers = async (students, targetForm = null) => {
  const admissionNumbers = students.map(s => s.admissionNumber);
  
  const whereClause = {
    admissionNumber: { in: admissionNumbers }
  };
  
  if (targetForm) {
    whereClause.form = targetForm;
  }
  
  const existingStudents = await prisma.databaseStudent.findMany({
    where: whereClause,
    select: {
      admissionNumber: true,
      firstName: true,
      lastName: true,
      form: true
    }
  });
  
  const duplicates = students
    .map((student, index) => {
      const existing = existingStudents.find(s => s.admissionNumber === student.admissionNumber);
      if (existing) {
        return {
          row: index + 2,
          admissionNumber: student.admissionNumber,
          name: `${student.firstName} ${student.lastName}`,
          form: student.form,
          existingName: `${existing.firstName} ${existing.lastName}`,
          existingForm: existing.form
        };
      }
      return null;
    })
    .filter(dup => dup !== null);
  
  return duplicates;
};

// Process New Upload
const processNewUpload = async (students, uploadBatchId, selectedForms, duplicateAction = 'skip') => {
  const stats = {
    totalRows: students.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: [],
    createdStudents: []
  };
  
  // Filter students to only include selected forms
  const filteredStudents = students.filter(student => 
    selectedForms.includes(student.form)
  );
  
  if (filteredStudents.length === 0) {
    throw new Error(`No students found for selected forms: ${selectedForms.join(', ')}`);
  }
  
  // Get existing admission numbers across all forms
  const existingAdmissionNumbers = new Set();
  const existingStudents = await prisma.databaseStudent.findMany({
    where: {
      admissionNumber: { 
        in: filteredStudents.map(s => s.admissionNumber) 
      }
    },
    select: {
      admissionNumber: true,
      form: true
    }
  });
  
  existingStudents.forEach(s => existingAdmissionNumbers.add(s.admissionNumber));
  
  const studentsToCreate = [];
  const seenAdmissionNumbers = new Set();
  
  for (const [index, student] of filteredStudents.entries()) {
    const validation = validateStudent(student, index);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }
    
    const admissionNumber = student.admissionNumber;
    
    // Check duplicates within the file
    if (seenAdmissionNumbers.has(admissionNumber)) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Duplicate admission number in file: ${admissionNumber}`);
      continue;
    }
    seenAdmissionNumbers.add(admissionNumber);
    
    // Check if admission number already exists in database
    if (existingAdmissionNumbers.has(admissionNumber)) {
      if (duplicateAction === 'skip') {
        stats.skippedRows++;
        stats.errors.push(`Row ${index + 2}: Skipped - admission number already exists: ${admissionNumber}`);
        continue;
      } else if (duplicateAction === 'replace') {
        // For replace action, we need to update existing student
        try {
          const updatedStudent = await prisma.databaseStudent.updateMany({
            where: {
              admissionNumber: admissionNumber,
              form: student.form
            },
            data: {
              firstName: student.firstName,
              middleName: student.middleName || null,
              lastName: student.lastName,
              stream: student.stream || null,
              dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
              gender: student.gender || null,
              parentPhone: student.parentPhone || null,
              email: student.email || null,
              address: student.address || null,
              uploadBatchId: uploadBatchId,
              status: 'active',
              updatedAt: new Date()
            }
          });
          
          if (updatedStudent.count === 0) {
            // Student exists but in different form - skip
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: Cannot replace - student exists in different form. Use Update Upload for specific forms.`);
            continue;
          }
          
          stats.validRows++;
          continue;
        } catch (error) {
          stats.skippedRows++;
          stats.errors.push(`Row ${index + 2}: Failed to replace student ${admissionNumber}: ${error.message}`);
          continue;
        }
      }
    }
    
    // Add to create list
    studentsToCreate.push({
      admissionNumber,
      firstName: student.firstName,
      middleName: student.middleName || null,
      lastName: student.lastName,
      form: student.form,
      stream: student.stream || null,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
      gender: student.gender || null,
      parentPhone: student.parentPhone || null,
      email: student.email || null,
      address: student.address || null,
      uploadBatchId,
      status: 'active'
    });
    
    stats.validRows++;
  }
  
  // Insert students
  if (studentsToCreate.length > 0) {
    try {
      await prisma.databaseStudent.createMany({
        data: studentsToCreate,
        skipDuplicates: false // We handle duplicates manually
      });
      
      stats.createdStudents = studentsToCreate;
    } catch (error) {
      console.error('Error creating students:', error);
      stats.errorRows += studentsToCreate.length;
      stats.errors.push(`Failed to create ${studentsToCreate.length} students: ${error.message}`);
    }
  }
  
  return stats;
};

// Process Update Upload
const processUpdateUpload = async (students, uploadBatchId, targetForm) => {
  const stats = {
    totalRows: students.length,
    validRows: 0,
    updatedRows: 0,
    createdRows: 0,
    deactivatedRows: 0,
    errorRows: 0,
    errors: [],
    updatedStudents: [],
    createdStudents: []
  };
  
  // Filter students to only include the target form
  const filteredStudents = students.filter(student => 
    student.form === targetForm
  );
  
  if (filteredStudents.length === 0) {
    throw new Error(`No students found for form ${targetForm}. Make sure the form column matches the selected form.`);
  }
  
  // Get existing students in this form
  const existingStudents = await prisma.databaseStudent.findMany({
    where: {
      form: targetForm,
      status: 'active'
    },
    select: {
      id: true,
      admissionNumber: true,
      uploadBatchId: true
    }
  });
  
  const existingAdmissionMap = new Map(
    existingStudents.map(s => [s.admissionNumber, { 
      id: s.id, 
      uploadBatchId: s.uploadBatchId 
    }])
  );
  
  const seenAdmissionNumbers = new Set();
  const admissionNumbersInNewUpload = new Set();
  
  // Process each student in the upload
  for (const [index, student] of filteredStudents.entries()) {
    const validation = validateStudent(student, index);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }
    
    const admissionNumber = student.admissionNumber;
    
    // Check duplicates within the file
    if (seenAdmissionNumbers.has(admissionNumber)) {
      stats.errorRows++;
      stats.errors.push(`Row ${index + 2}: Duplicate admission number in file: ${admissionNumber}`);
      continue;
    }
    seenAdmissionNumbers.add(admissionNumber);
    admissionNumbersInNewUpload.add(admissionNumber);
    
    // Check if student exists in this form
    const existingStudent = existingAdmissionMap.get(admissionNumber);
    
    if (existingStudent) {
      // Update existing student
      try {
        const updatedStudent = await prisma.databaseStudent.update({
          where: { id: existingStudent.id },
          data: {
            firstName: student.firstName,
            middleName: student.middleName || null,
            lastName: student.lastName,
            stream: student.stream || null,
            dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
            gender: student.gender || null,
            parentPhone: student.parentPhone || null,
            email: student.email || null,
            address: student.address || null,
            uploadBatchId: uploadBatchId,
            status: 'active',
            updatedAt: new Date()
          }
        });
        
        stats.updatedRows++;
        stats.updatedStudents.push(updatedStudent);
      } catch (error) {
        stats.errorRows++;
        stats.errors.push(`Row ${index + 2}: Failed to update student ${admissionNumber}: ${error.message}`);
        continue;
      }
    } else {
      // Create new student
      try {
        const newStudent = await prisma.databaseStudent.create({
          data: {
            admissionNumber,
            firstName: student.firstName,
            middleName: student.middleName || null,
            lastName: student.lastName,
            form: targetForm,
            stream: student.stream || null,
            dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
            gender: student.gender || null,
            parentPhone: student.parentPhone || null,
            email: student.email || null,
            address: student.address || null,
            uploadBatchId,
            status: 'active'
          }
        });
        
        stats.createdRows++;
        stats.createdStudents.push(newStudent);
      } catch (error) {
        stats.errorRows++;
        stats.errors.push(`Row ${index + 2}: Failed to create student ${admissionNumber}: ${error.message}`);
        continue;
      }
    }
    
    stats.validRows++;
  }
  
  // Deactivate students in this form that are not in the new upload
  const studentsToDeactivate = existingStudents.filter(s => 
    !admissionNumbersInNewUpload.has(s.admissionNumber)
  );
  
  if (studentsToDeactivate.length > 0) {
    await prisma.databaseStudent.updateMany({
      where: {
        id: { in: studentsToDeactivate.map(s => s.id) }
      },
      data: {
        status: 'inactive',
        updatedAt: new Date()
      }
    });
    
    stats.deactivatedRows = studentsToDeactivate.length;
  }
  
  return stats;
};

// ========== CSV PARSING ==========
const parseCSV = async (file) => {
  try {
    const text = await file.text();
    console.log('CSV content preview:', text.substring(0, 500));
    
    const delimiters = ['\t', ',', ';'];
    
    for (const delimiter of delimiters) {
      try {
        return await new Promise((resolve, reject) => {
          parse(text, {
            header: true,
            skipEmptyLines: true,
            delimiter,
            transformHeader: (header) => {
              // Clean and normalize the header
              const normalized = header.trim().toLowerCase().replace(/[_\s]+/g, '');
              
              // Map to expected column names
              if (normalized.includes('admission') || normalized.includes('admno')) {
                return 'admissionNumber';
              }
              if (normalized.includes('firstname') || normalized.includes('first')) {
                return 'firstName';
              }
              if (normalized.includes('middlename') || normalized.includes('middle')) {
                return 'middleName';
              }
              if (normalized.includes('lastname') || normalized.includes('last') || normalized.includes('surname')) {
                return 'lastName';
              }
              if (normalized.includes('form') || normalized.includes('class') || normalized.includes('grade')) {
                return 'form';
              }
              if (normalized.includes('stream')) {
                return 'stream';
              }
              if (normalized.includes('dateofbirth') || normalized === 'dob') {
                return 'dateOfBirth';
              }
              if (normalized.includes('gender') || normalized === 'sex') {
                return 'gender';
              }
              if (normalized.includes('parentphone') || normalized.includes('phone')) {
                return 'parentPhone';
              }
              if (normalized.includes('email')) {
                return 'email';
              }
              if (normalized.includes('address')) {
                return 'address';
              }
              
              return normalized;
            },
            complete: (results) => {
              const headers = results.meta.fields || [];
              console.log('CSV headers:', headers);
              
              if (headers.length === 0) {
                reject(new Error('No headers found in CSV file'));
                return;
              }
              
              // Check for required columns
              const requiredColumns = ['admissionNumber', 'firstName', 'lastName', 'form'];
              const missingColumns = requiredColumns.filter(col => !headers.includes(col));
              
              if (missingColumns.length > 0) {
                reject(new Error(`Missing required columns: ${missingColumns.join(', ')}. Found headers: ${headers.join(', ')}`));
                return;
              }
              
              const data = results.data
                .map((row, index) => {
                  try {
                    // Get values from row
                    const admissionNumber = String(row.admissionNumber || '').trim();
                    const firstName = String(row.firstName || '').trim();
                    const lastName = String(row.lastName || '').trim();
                    const form = String(row.form || '').trim();
                    
                    // Get optional values
                    const middleName = row.middleName ? String(row.middleName).trim() : null;
                    const stream = row.stream ? String(row.stream).trim() : null;
                    const dateOfBirth = parseDate(row.dateOfBirth || row.dob || '');
                    const gender = row.gender ? String(row.gender).trim() : null;
                    const parentPhone = row.parentPhone ? String(row.parentPhone).trim() : null;
                    const email = row.email ? String(row.email).trim() : null;
                    const address = row.address ? String(row.address).trim() : null;
                    
                    // Check if we have the minimum required data
                    if (admissionNumber && firstName && lastName && form) {
                      // Normalize form
                      const formValue = form.toLowerCase().trim();
                      const formMap = {
                        'form1': 'Form 1',
                        'form 1': 'Form 1',
                        '1': 'Form 1',
                        'form2': 'Form 2',
                        'form 2': 'Form 2',
                        '2': 'Form 2',
                        'form3': 'Form 3',
                        'form 3': 'Form 3',
                        '3': 'Form 3',
                        'form4': 'Form 4',
                        'form 4': 'Form 4',
                        '4': 'Form 4'
                      };
                      
                      const normalizedForm = formMap[formValue] || form;
                      
                      return {
                        admissionNumber,
                        firstName,
                        middleName,
                        lastName,
                        form: normalizedForm,
                        stream,
                        dateOfBirth,
                        gender,
                        parentPhone,
                        email,
                        address
                      };
                    }
                    
                    return null;
                  } catch (error) {
                    console.error(`Error parsing CSV row ${index + 2}:`, error);
                    return null;
                  }
                })
                .filter(item => item !== null);
              
              console.log(`CSV parsing completed: ${data.length} valid rows out of ${results.data.length}`);
              
              if (data.length === 0) {
                reject(new Error('No valid student data found in CSV file. Please check your file format.'));
                return;
              }
              
              resolve(data);
            },
            error: reject
          });
        });
      } catch (delimiterError) {
        console.log(`Delimiter "${delimiter}" failed:`, delimiterError.message);
        continue;
      }
    }
    
    throw new Error('Could not parse CSV. Please check that your file contains required columns: admissionNumber, firstName, lastName, form');
    
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
};

// ========== EXCEL PARSING - SIMPLIFIED VERSION ==========
const parseExcel = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON - this should preserve your exact headers
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',
      raw: false,
      dateNF: 'yyyy-mm-dd'
    });
    
    console.log(`Excel raw data: ${jsonData.length} rows`);
    
    if (jsonData.length === 0) {
      throw new Error('Excel file appears to be empty');
    }
    
    // Log the exact structure
    console.log('First Excel row:', jsonData[0]);
    console.log('All headers:', Object.keys(jsonData[0]));
    
    const data = jsonData
      .map((row, index) => {
        try {
          // Direct mapping - use the exact headers from your error message
          const admissionNumber = String(row.admissionNumber || row.AdmissionNumber || '').trim();
          const firstName = String(row.firstName || row.FirstName || '').trim();
          const middleName = String(row.middleName || row.MiddleName || '').trim() || null;
          const lastName = String(row.lastName || row.LastName || '').trim();
          const form = String(row.form || row.Form || '').trim();
          const stream = String(row.stream || row.Stream || '').trim() || null;
          const dateOfBirthRaw = row.dateOfBirth || row.DateOfBirth || row.dob || row.DOB || '';
          const dateOfBirth = dateOfBirthRaw ? parseDate(dateOfBirthRaw) : null;
          const gender = String(row.gender || row.Gender || '').trim() || null;
          const parentPhone = String(row.parentPhone || row.ParentPhone || '').trim() || null;
          const email = String(row.email || row.Email || '').trim() || null;
          const address = String(row.address || row.Address || '').trim() || null;
          const status = String(row.status || row.Status || 'active').trim();
          
          // Normalize form value
          const normalizedForm = (() => {
            const formValue = form.toLowerCase().trim();
            const formMap = {
              'form1': 'Form 1',
              'form 1': 'Form 1',
              '1': 'Form 1',
              'form2': 'Form 2',
              'form 2': 'Form 2',
              '2': 'Form 2',
              'form3': 'Form 3',
              'form 3': 'Form 3',
              '3': 'Form 3',
              'form4': 'Form 4',
              'form 4': 'Form 4',
              '4': 'Form 4'
            };
            
            return formMap[formValue] || form;
          })();
          
          // Check if we have the minimum required data
          if (admissionNumber && firstName && lastName && normalizedForm) {
            const student = {
              admissionNumber,
              firstName,
              middleName,
              lastName,
              form: normalizedForm,
              stream,
              dateOfBirth,
              gender,
              parentPhone,
              email,
              address,
              status
            };
            
            if (index < 3) {
              console.log(`Parsed student ${index + 1}:`, student);
            }
            
            return student;
          } else {
            console.log(`Row ${index + 2} skipped - missing required fields:`, {
              admissionNumber: !!admissionNumber,
              firstName: !!firstName,
              lastName: !!lastName,
              form: !!form,
              normalizedForm
            });
            return null;
          }
        } catch (error) {
          console.error(`Error parsing Excel row ${index + 2}:`, error);
          return null;
        }
      })
      .filter(item => item !== null);
    
    console.log(`Excel parsing completed: ${data.length} valid rows out of ${jsonData.length}`);
    
    if (data.length === 0) {
      throw new Error('No valid student data found in Excel file. Required columns: admissionNumber, firstName, lastName, form. Make sure your Excel has these exact column names in the first row.');
    }
    
    return data;
    
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== VALIDATION ==========
const validateStudent = (student, index) => {
  const errors = [];
  
  // Admission number
  if (!student.admissionNumber) {
    errors.push(`Row ${index + 2}: Admission number is required`);
  } else if (!/^\d{4,10}$/.test(student.admissionNumber)) {
    errors.push(`Row ${index + 2}: Admission number must be 4-10 digits (got: ${student.admissionNumber})`);
  }
  
  // Names
  if (!student.firstName) {
    errors.push(`Row ${index + 2}: First name is required`);
  } else if (student.firstName.length > 100) {
    errors.push(`Row ${index + 2}: First name too long (max 100 chars)`);
  }
  
  if (!student.lastName) {
    errors.push(`Row ${index + 2}: Last name is required`);
  } else if (student.lastName.length > 100) {
    errors.push(`Row ${index + 2}: Last name too long (max 100 chars)`);
  }
  
  // Form validation
  const formValue = student.form.trim();
  const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  
  if (!validForms.includes(formValue)) {
    errors.push(`Row ${index + 2}: Form must be one of: ${validForms.join(', ')} (got: ${formValue})`);
  }
  
  // Update student with normalized form
  student.form = formValue;
  
  // Date of birth
  if (student.dateOfBirth) {
    const dob = new Date(student.dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.push(`Row ${index + 2}: Invalid date of birth format`);
    } else {
      const year = dob.getFullYear();
      const currentYear = new Date().getFullYear();
      
      if (dob > new Date()) {
        errors.push(`Row ${index + 2}: Date of birth cannot be in the future`);
      }
      
      if (year < 1900) {
        errors.push(`Row ${index + 2}: Date of birth year must be after 1900`);
      }
      
      const age = currentYear - year;
      if (age < 4) {
        errors.push(`Row ${index + 2}: Student appears to be too young (${age} years old)`);
      }
      
      if (age > 30) {
        errors.push(`Row ${index + 2}: Student appears to be too old (${age} years old)`);
      }
    }
  }
  
  // Optional fields
  if (student.middleName && student.middleName.length > 100) {
    errors.push(`Row ${index + 2}: Middle name too long (max 100 chars)`);
  }
  
  if (student.stream && student.stream.length > 50) {
    errors.push(`Row ${index + 2}: Stream too long (max 50 chars)`);
  }
  
  if (student.gender && student.gender.length > 20) {
    errors.push(`Row ${index + 2}: Gender too long (max 20 chars)`);
  }
  
  if (student.parentPhone) {
    const phoneRegex = /^[+]?[0-9\s\-()]{10,20}$/;
    if (!phoneRegex.test(student.parentPhone)) {
      errors.push(`Row ${index + 2}: Parent phone number is invalid`);
    } else if (student.parentPhone.length > 20) {
      errors.push(`Row ${index + 2}: Parent phone too long (max 20 chars)`);
    }
  }
  
  if (student.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
      errors.push(`Row ${index + 2}: Email is invalid`);
    } else if (student.email.length > 100) {
      errors.push(`Row ${index + 2}: Email too long (max 100 chars)`);
    }
  }
  
  if (student.address && student.address.length > 255) {
    errors.push(`Row ${index + 2}: Address too long (max 255 chars)`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// ========== API ENDPOINTS ==========

// GET - Main endpoint with consistent statistics (PUBLIC - no authentication required)
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const form = url.searchParams.get('form') || '';
    const stream = url.searchParams.get('stream') || '';
    const gender = url.searchParams.get('gender') || '';
    const status = url.searchParams.get('status') || 'active';
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const includeStats = url.searchParams.get('includeStats') !== 'false';

    // Build filters
    const filters = { form, stream, gender, status, search };
    const where = buildWhereClause(filters);

if (action === 'uploads') {
  const uploads = await prisma.studentBulkUpload.findMany({
    orderBy: { uploadDate: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      fileName: true,
      fileType: true,
      status: true,
      uploadDate: true,
      uploadedBy: true,
      processedDate: true,
      totalRows: true,
      validRows: true,
      skippedRows: true,
      errorRows: true,
      errorLog: true
    }
  });

  const total = await prisma.studentBulkUpload.count();
  
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
    if (action === 'stats') {
      // Calculate fresh statistics with filters
      const statsResult = await calculateStatistics(where);
      
      // Update cache for consistency
      if (Object.keys(where).length === 0) {
        await updateCachedStats(statsResult.stats);
      }
      
      return NextResponse.json({
        success: true,
        data: {
          stats: statsResult.stats,
          filters,
          validation: statsResult.validation,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Get students with pagination
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [students, total] = await Promise.all([
      prisma.databaseStudent.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          admissionNumber: true,
          firstName: true,
          middleName: true,
          lastName: true,
          form: true,
          stream: true,
          dateOfBirth: true,
          gender: true,
          parentPhone: true,
          email: true,
          address: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          uploadBatchId: true,
          uploadBatch: {
            select: {
              fileName: true,
              uploadDate: true
            }
          }
        }
      }),
      prisma.databaseStudent.count({ where })
    ]);

    // Calculate statistics for this filtered set
    let statsResult = null;
    if (includeStats) {
      statsResult = await calculateStatistics(where);
      
      // If no filters, update cache
      if (Object.keys(where).length === 0) {
        await updateCachedStats(statsResult.stats);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        students,
        stats: statsResult?.stats || null,
        filters,
        validation: statsResult?.validation || null,
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST - Bulk upload with new strategy (with authentication)
export async function POST(request) {
  try {
    // Step 1: Authenticate the POST request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Student bulk upload request from: ${auth.user.name} (${auth.user.role})`);

    const formData = await request.formData();
    const file = formData.get('file');
    const uploadType = formData.get('uploadType'); // 'new' or 'update'
    const formsInput = formData.get('forms'); // JSON string for forms
    const targetForm = formData.get('targetForm'); // Single form for updates
    const checkDuplicates = formData.get('checkDuplicates') === 'true';
    const duplicateAction = formData.get('duplicateAction') || 'skip'; // 'skip' or 'replace'
    
    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No file provided',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    if (!uploadType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Upload type is required (new or update)',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    // Validate form selection based on upload type
    let selectedForms = [];
    if (uploadType === 'new') {
      if (!formsInput) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Please select at least one form for new upload',
            authenticated: true 
          },
          { status: 400 }
        );
      }
      try {
        const forms = JSON.parse(formsInput);
        selectedForms = validateFormSelection(forms);
      } catch (error) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid form selection',
            authenticated: true 
          },
          { status: 400 }
        );
      }
    } else if (uploadType === 'update') {
      if (!targetForm) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Target form is required for update upload',
            authenticated: true 
          },
          { status: 400 }
        );
      }
      selectedForms = validateFormSelection([targetForm]);
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid upload type. Must be "new" or "update"',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    
    const validExtensions = ['csv', 'xlsx', 'xls'];
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type. Please upload CSV or Excel (xlsx/xls) files.',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    // Create batch record with uploader info from authentication
    const batchId = `BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const uploadBatch = await prisma.studentBulkUpload.create({
      data: {
        id: batchId,
        fileName: file.name,
        fileType: fileExtension,
        uploadedBy: auth.user.name, // Use authenticated user's name
        status: 'processing',
        metadata: {
          uploadType,
          selectedForms,
          targetForm: uploadType === 'update' ? targetForm : null,
          uploadedBy: auth.user.name,
          userRole: auth.user.role,
          timestamp: new Date()
        }
      }
    });
    
    try {
      // Parse file
      let rawData = [];
      
      if (fileExtension === 'csv') {
        rawData = await parseCSV(file);
      } else {
        rawData = await parseExcel(file);
      }
      
      if (rawData.length === 0) {
        throw new Error(`No valid student data found.`);
      }
      
      // If just checking for duplicates
      if (checkDuplicates) {
        let duplicates = [];
        
        if (uploadType === 'new') {
          // Check for duplicates across all forms
          duplicates = await checkDuplicateAdmissionNumbers(rawData);
        } else if (uploadType === 'update') {
          // Check for duplicates in the target form
          duplicates = await checkDuplicateAdmissionNumbers(rawData, targetForm);
        }
        
        return NextResponse.json({
          success: true,
          hasDuplicates: duplicates.length > 0,
          duplicates: duplicates,
          totalRows: rawData.length,
          authenticated: true,
          uploadedBy: auth.user.name,
          message: duplicates.length > 0 
            ? `Found ${duplicates.length} duplicate admission numbers` 
            : 'No duplicates found'
        });
      }
      
      let processingStats;
      
// Use transaction for consistency with increased timeout
await prisma.$transaction(async (tx) => {
  if (uploadType === 'new') {
    // Process new upload
    processingStats = await processNewUpload(rawData, batchId, selectedForms, duplicateAction);
    
    // Update batch with new upload stats
    await tx.studentBulkUpload.update({
      where: { id: batchId },
      data: {
        status: 'completed',
        processedDate: new Date(),
        totalRows: processingStats.totalRows,
        validRows: processingStats.validRows,
        skippedRows: processingStats.skippedRows,
        errorRows: processingStats.errorRows,
        errorLog: processingStats.errors.length > 0 ? processingStats.errors.slice(0, 50) : undefined
      }
    });
    
    // Update statistics - OPTIMIZED VERSION
    if (processingStats.createdStudents.length > 0) {
      const formCounts = {};
      processingStats.createdStudents.forEach(student => {
        formCounts[student.form] = (formCounts[student.form] || 0) + 1;
      });
      
      // Update stats in bulk without recalculating everything
      await tx.studentStats.upsert({
        where: { id: 'global_stats' },
        update: {
          totalStudents: { increment: processingStats.createdStudents.length },
          ...(formCounts['Form 1'] && { form1: { increment: formCounts['Form 1'] } }),
          ...(formCounts['Form 2'] && { form2: { increment: formCounts['Form 2'] } }),
          ...(formCounts['Form 3'] && { form3: { increment: formCounts['Form 3'] } }),
          ...(formCounts['Form 4'] && { form4: { increment: formCounts['Form 4'] } }),
          updatedAt: new Date()
        },
        create: {
          id: 'global_stats',
          totalStudents: processingStats.createdStudents.length,
          form1: formCounts['Form 1'] || 0,
          form2: formCounts['Form 2'] || 0,
          form3: formCounts['Form 3'] || 0,
          form4: formCounts['Form 4'] || 0
        }
      });
    }
    
  } else if (uploadType === 'update') {
    // Process update upload
    processingStats = await processUpdateUpload(rawData, batchId, targetForm);
    
    // Update batch with update stats
    await tx.studentBulkUpload.update({
      where: { id: batchId },
      data: {
        status: 'completed',
        processedDate: new Date(),
        totalRows: processingStats.totalRows,
        validRows: processingStats.validRows,
        skippedRows: processingStats.errorRows,
        errorRows: processingStats.errorRows,
        errorLog: processingStats.errors.length > 0 ? processingStats.errors.slice(0, 50) : undefined,
        metadata: {
          ...uploadBatch.metadata,
          updatedRows: processingStats.updatedRows,
          createdRows: processingStats.createdRows,
          deactivatedRows: processingStats.deactivatedRows
        }
      }
    });
    
    // OPTIMIZED: Only recalculate statistics if needed
    // Skip full recalculation if no deactivations
    if (processingStats.deactivatedRows > 0) {
      const formStats = await tx.databaseStudent.groupBy({
        by: ['form'],
        where: { status: 'active' },
        _count: { id: true }
      });
      
      const formStatsObj = {};
      formStats.forEach(stat => {
        formStatsObj[stat.form] = stat._count.id;
      });
      
      await tx.studentStats.upsert({
        where: { id: 'global_stats' },
        update: {
          totalStudents: formStats.reduce((sum, stat) => sum + stat._count.id, 0),
          form1: formStatsObj['Form 1'] || 0,
          form2: formStatsObj['Form 2'] || 0,
          form3: formStatsObj['Form 3'] || 0,
          form4: formStatsObj['Form 4'] || 0,
          updatedAt: new Date()
        },
        create: {
          id: 'global_stats',
          totalStudents: formStats.reduce((sum, stat) => sum + stat._count.id, 0),
          form1: formStatsObj['Form 1'] || 0,
          form2: formStatsObj['Form 2'] || 0,
          form3: formStatsObj['Form 3'] || 0,
          form4: formStatsObj['Form 4'] || 0
        }
      });
    } else {
      // Simple increment/decrement for update operations
      const netChange = processingStats.createdRows - processingStats.updatedRows;
      await tx.studentStats.update({
        where: { id: 'global_stats' },
        data: {
          totalStudents: { increment: netChange },
          ...(targetForm === 'Form 1' && { form1: { increment: netChange } }),
          ...(targetForm === 'Form 2' && { form2: { increment: netChange } }),
          ...(targetForm === 'Form 3' && { form3: { increment: netChange } }),
          ...(targetForm === 'Form 4' && { form4: { increment: netChange } }),
          updatedAt: new Date()
        }
      });
    }
  }
}, {
  maxWait: 15000,    // Increased from default
  timeout: 30000     // 30 seconds timeout
});
      
      // Recalculate to ensure consistency
      const finalStats = await calculateStatistics({});
      
      console.log(`✅ Student upload completed by ${auth.user.name}: ${processingStats.validRows} students processed`);
      
      return NextResponse.json({
        success: true,
        message: uploadType === 'new' 
          ? `Successfully processed ${processingStats.validRows} new students` 
          : `Successfully updated form ${targetForm}: ${processingStats.updatedRows} updated, ${processingStats.createdRows} created, ${processingStats.deactivatedRows} deactivated`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          status: 'completed',
          uploadType,
          selectedForms
        },
        stats: finalStats.stats,
        validation: finalStats.validation,
        processingStats: processingStats,
        authenticated: true,
        uploadedBy: auth.user.name, 
        errors: processingStats.errors.slice(0, 20),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      
      // Update batch as failed
      await prisma.studentBulkUpload.update({
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
        error: error.message || 'Upload failed',
        authenticated: true,
        suggestion: 'Check that your file has the required columns: admissionNumber, firstName, lastName, form'
      },
      { status: 500 }
    );
  }
}


// PUT - Update student with transaction (PROTECTED - authentication required)
export async function PUT(request) {
  try {
    // Step 1: Authenticate the PUT request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Student update request from: ${auth.user.name} (${auth.user.role})`);

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required', authenticated: true },
        { status: 400 }
      );
    }

    // Use transaction for consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get current student
      const currentStudent = await tx.databaseStudent.findUnique({
        where: { id }
      });

      if (!currentStudent) {
        throw new Error('Student not found');
      }

      // Check admission number uniqueness
      if (updateData.admissionNumber && updateData.admissionNumber !== currentStudent.admissionNumber) {
        const existing = await tx.databaseStudent.findFirst({
          where: {
            admissionNumber: updateData.admissionNumber,
            NOT: { id: id }
          }
        });

        if (existing) {
          throw new Error('Admission number already exists');
        }
      }

      // Parse date if provided
      if (updateData.dateOfBirth) {
        try {
          updateData.dateOfBirth = new Date(updateData.dateOfBirth);
          if (isNaN(updateData.dateOfBirth.getTime())) {
            throw new Error('Invalid date format');
          }
        } catch (dateError) {
          throw new Error('Invalid date format');
        }
      }

      // Update student with audit info
      const updatedStudent = await tx.databaseStudent.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
          
        }
      });

      // Update stats if form changed
      if (updateData.form && updateData.form !== currentStudent.form) {
        // Decrement count from old form
        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            ...(currentStudent.form === 'Form 1' && { form1: { decrement: 1 } }),
            ...(currentStudent.form === 'Form 2' && { form2: { decrement: 1 } }),
            ...(currentStudent.form === 'Form 3' && { form3: { decrement: 1 } }),
            ...(currentStudent.form === 'Form 4' && { form4: { decrement: 1 } })
          }
        });

        // Increment count to new form
        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            ...(updateData.form === 'Form 1' && { form1: { increment: 1 } }),
            ...(updateData.form === 'Form 2' && { form2: { increment: 1 } }),
            ...(updateData.form === 'Form 3' && { form3: { increment: 1 } }),
            ...(updateData.form === 'Form 4' && { form4: { increment: 1 } })
          }
        });
      }

      return updatedStudent;
    });

    // Recalculate to ensure consistency
    const finalStats = await calculateStatistics({});

    console.log(`✅ Student updated by ${auth.user.name}: ${result.firstName} ${result.lastName}`);

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      data: {
        student: result,
        stats: finalStats.stats,
        validation: finalStats.validation
      },
      authenticated: true,

    });

  } catch (error) {
    console.error('PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Student not found', authenticated: true },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Update failed',
        authenticated: true
      },
      { status: 500 }
    );
  }
}

// DELETE - Student or batch with transaction (PROTECTED - authentication required)
export async function DELETE(request) {
  try {
    // Step 1: Authenticate the DELETE request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`🗑️ Student delete request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const studentId = url.searchParams.get('studentId');
    const hardDelete = url.searchParams.get('hardDelete') === 'true';

    if (batchId) {
      const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.studentBulkUpload.findUnique({
          where: { id: batchId }
        });

        if (!batch) {
          throw new Error('Batch not found');
        }

        const batchStudents = await tx.databaseStudent.findMany({
          where: { uploadBatchId: batchId },
          select: { form: true, status: true }
        });

        const formCounts = batchStudents.reduce((acc, student) => {
          if (student.status === 'active') {
            acc[student.form] = (acc[student.form] || 0) + 1;
          }
          return acc;
        }, {});

        if (hardDelete) {
          // Hard delete students
          await tx.databaseStudent.deleteMany({
            where: { uploadBatchId: batchId }
          });
        } else {
          // Soft delete students (mark as inactive)
          await tx.databaseStudent.updateMany({
            where: { uploadBatchId: batchId },
            data: {
              status: 'inactive',
              updatedAt: new Date(),
              
            }
          });
        }

        // Update stats if hard deleting
        if (hardDelete) {
          await tx.studentStats.update({
            where: { id: 'global_stats' },
            data: {
              totalStudents: { decrement: batchStudents.length },
              form1: { decrement: formCounts['Form 1'] || 0 },
              form2: { decrement: formCounts['Form 2'] || 0 },
              form3: { decrement: formCounts['Form 3'] || 0 },
              form4: { decrement: formCounts['Form 4'] || 0 }
            }
          });
        }

        // Delete batch record
        await tx.studentBulkUpload.delete({
          where: { id: batchId }
        });

        return { 
          batch, 
          deletedCount: batchStudents.length,
          deletionType: hardDelete ? 'hard' : 'soft'
        };
      });

      // Recalculate to ensure consistency
      const finalStats = await calculateStatistics({});

      console.log(`✅ Batch deleted by ${auth.user.name}: ${result.batch.fileName} (${result.deletedCount} students)`);

      return NextResponse.json({
        success: true,
        message: `${result.deletionType === 'hard' ? 'Hard deleted' : 'Soft deleted'} batch ${result.batch.fileName} and ${result.deletedCount} students`,
        data: {
          stats: finalStats.stats,
          validation: finalStats.validation
        },
        authenticated: true,
      });
    }

    if (studentId) {
      const result = await prisma.$transaction(async (tx) => {
        const student = await tx.databaseStudent.findUnique({
          where: { id: studentId }
        });

        if (!student) {
          throw new Error('Student not found');
        }

        if (hardDelete) {
          // Hard delete student
          await tx.databaseStudent.delete({
            where: { id: studentId }
          });

          // Update stats
          await tx.studentStats.update({
            where: { id: 'global_stats' },
            data: {
              totalStudents: { decrement: 1 },
              ...(student.form === 'Form 1' && { form1: { decrement: 1 } }),
              ...(student.form === 'Form 2' && { form2: { decrement: 1 } }),
              ...(student.form === 'Form 3' && { form3: { decrement: 1 } }),
              ...(student.form === 'Form 4' && { form4: { decrement: 1 } })
            }
          });
        } else {
          // Soft delete student (mark as inactive)
          await tx.databaseStudent.update({
            where: { id: studentId },
            data: {
              status: 'inactive',
              updatedAt: new Date(),
             
            }
          });
        }

        return { student, deletionType: hardDelete ? 'hard' : 'soft' };
      });

      // Recalculate to ensure consistency
      const finalStats = await calculateStatistics({});

      console.log(`✅ Student deleted by ${auth.user.name}: ${result.student.firstName} ${result.student.lastName}`);

      return NextResponse.json({
        success: true,
        message: `${result.deletionType === 'hard' ? 'Hard deleted' : 'Soft deleted'} student ${result.student.firstName} ${result.student.lastName}`,
        data: {
          stats: finalStats.stats,
          validation: finalStats.validation
        },
        authenticated: true,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide batchId or studentId', authenticated: true },
      { status: 400 }
    );

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed', authenticated: true },
      { status: 500 }
    );
  }
}

// PATCH - Reactivate inactive students (PROTECTED - authentication required)
export async function PATCH(request) {
  try {
    // Step 1: Authenticate the PATCH request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Student reactivate request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    const batchId = url.searchParams.get('batchId');
    const form = url.searchParams.get('form');

    if (studentId) {
      // Reactivate single student
      const student = await prisma.databaseStudent.update({
        where: { id: studentId },
        data: {
          status: 'active',
          updatedAt: new Date(),
          
        }
      });

      console.log(`✅ Student reactivated by ${auth.user.name}: ${student.firstName} ${student.lastName}`);

      return NextResponse.json({
        success: true,
        message: `Student ${student.firstName} ${student.lastName} reactivated`,
        data: { student },
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }

    if (batchId) {
      // Reactivate all students in a batch
      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.databaseStudent.updateMany({
          where: { 
            uploadBatchId: batchId,
            status: 'inactive'
          },
          data: {
            status: 'active',
            updatedAt: new Date(),
            
          }
        });

        // Update statistics
        const batchStudents = await tx.databaseStudent.findMany({
          where: { uploadBatchId: batchId },
          select: { form: true }
        });

        const formCounts = batchStudents.reduce((acc, student) => {
          acc[student.form] = (acc[student.form] || 0) + 1;
          return acc;
        }, {});

        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            totalStudents: { increment: updated.count },
            form1: { increment: formCounts['Form 1'] || 0 },
            form2: { increment: formCounts['Form 2'] || 0 },
            form3: { increment: formCounts['Form 3'] || 0 },
            form4: { increment: formCounts['Form 4'] || 0 }
          }
        });

        return { count: updated.count };
      });

      console.log(`✅ Batch reactivated by ${auth.user.name}: ${result.count} students`);

      return NextResponse.json({
        success: true,
        message: `Reactivated ${result.count} students from batch`,
        data: result,
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }

    if (form) {
      // Reactivate all inactive students in a form
      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.databaseStudent.updateMany({
          where: { 
            form: form,
            status: 'inactive'
          },
          data: {
            status: 'active',
            updatedAt: new Date(),
            
          }
        });

        // Update statistics
        await tx.studentStats.update({
          where: { id: 'global_stats' },
          data: {
            totalStudents: { increment: updated.count },
            ...(form === 'Form 1' && { form1: { increment: updated.count } }),
            ...(form === 'Form 2' && { form2: { increment: updated.count } }),
            ...(form === 'Form 3' && { form3: { increment: updated.count } }),
            ...(form === 'Form 4' && { form4: { increment: updated.count } })
          }
        });

        return { count: updated.count };
      });

      console.log(`✅ Form reactivated by ${auth.user.name}: ${result.count} students in ${form}`);

      return NextResponse.json({
        success: true,
        message: `Reactivated ${result.count} students in ${form}`,
        data: result,
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide studentId, batchId, or form', authenticated: true },
      { status: 400 }
    );

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Reactivate failed', authenticated: true },
      { status: 500 }
    );
  }
}