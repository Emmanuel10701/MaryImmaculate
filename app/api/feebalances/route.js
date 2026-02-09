import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from '../../../libs/prisma';

// ==================== AUTHENTICATION UTILITIES ====================

// Device Token Manager (SAME AS STUDENT API)
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
        
        // Check user role - only admins/staff can manage fees
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'STAFF', 'HR_MANAGER', 'TEACHER', 'FINANCE'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage fees' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Fees management authentication successful for user:', adminPayload.name || 'Unknown');
      
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
          message: "Authentication required to manage fee data.",
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

// Enhanced date parsing
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const str = String(dateStr).trim();
  
  // Try Excel serial number
  if (!isNaN(str) && Number(str) > 0) {
    const excelDate = Number(str);
    if (excelDate > 0 && excelDate < 50000) {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        if (year >= 1900 && year <= 2100) return date;
      }
    }
  }
  
  // Try ISO format
  const date = new Date(str);
  if (!isNaN(date.getTime())) return date;
  
  return null;
};

// Enhanced form normalization with better logging
const normalizeForm = (formValue) => {
  if (!formValue) {
    console.warn('⚠️ No form value provided to normalizeForm');
    return null;
  }
  
  const str = String(formValue).trim();
  const original = str; // Keep for debugging
  
  // Handle numeric forms
  if (/^\d+$/.test(str)) {
    const num = parseInt(str);
    if (num >= 1 && num <= 4) {
      console.log(`✅ Numeric form ${num} normalized to Form ${num}`);
      return `Form ${num}`;
    }
  }
  
  // Handle "Form X" variations
  const formMatch = str.match(/form[\s_-]?(\d+)/i);
  if (formMatch) {
    const num = parseInt(formMatch[1]);
    if (num >= 1 && num <= 4) {
      console.log(`✅ Form pattern matched: ${original} -> Form ${num}`);
      return `Form ${num}`;
    }
  }
  
  const formMap = {
    // Form 1 variations
    'form1': 'Form 1',
    'form 1': 'Form 1',
    '1': 'Form 1',
    'one': 'Form 1',
    'f1': 'Form 1',
    'class 1': 'Form 1',
    'grade 1': 'Form 1',
    'std 1': 'Form 1',
    'standard 1': 'Form 1',
    
    // Form 2 variations
    'form2': 'Form 2',
    'form 2': 'Form 2',
    '2': 'Form 2',
    'two': 'Form 2',
    'f2': 'Form 2',
    'class 2': 'Form 2',
    'grade 2': 'Form 2',
    'std 2': 'Form 2',
    'standard 2': 'Form 2',
    
    // Form 3 variations
    'form3': 'Form 3',
    'form 3': 'Form 3',
    '3': 'Form 3',
    'three': 'Form 3',
    'f3': 'Form 3',
    'class 3': 'Form 3',
    'grade 3': 'Form 3',
    'std 3': 'Form 3',
    'standard 3': 'Form 3',
    
    // Form 4 variations
    'form4': 'Form 4',
    'form 4': 'Form 4',
    '4': 'Form 4',
    'four': 'Form 4',
    'f4': 'Form 4',
    'class 4': 'Form 4',
    'grade 4': 'Form 4',
    'std 4': 'Form 4',
    'standard 4': 'Form 4'
  };
  
  const normalized = formMap[str.toLowerCase()];
  if (normalized) {
    console.log(`✅ Form mapped: ${original} -> ${normalized}`);
  } else {
    console.warn(`❌ Form not recognized: ${original}`);
  }
  
  return normalized || null;
};

// Normalize term values
const normalizeTerm = (termValue) => {
  if (!termValue) {
    console.warn('⚠️ No term value provided');
    return null;
  }
  
  const str = String(termValue).trim().toLowerCase();
  console.log(`🔍 Term normalization input: "${termValue}" -> "${str}"`);
  
  const termMap = {
    'term1': 'Term 1',
    'term 1': 'Term 1',
    '1': 'Term 1',
    'first term': 'Term 1',
    'first': 'Term 1',
    'term2': 'Term 2',
    'term 2': 'Term 2',
    '2': 'Term 2',
    'second term': 'Term 2',
    'second': 'Term 2',
    'term3': 'Term 3',
    'term 3': 'Term 3',
    '3': 'Term 3',
    'third term': 'Term 3',
    'third': 'Term 3'
  };
  
  const normalized = termMap[str] || str;
  console.log(`✅ Term normalized: "${termValue}" -> "${normalized}"`);
  return normalized;
};

// Normalize academic year with validation
const normalizeAcademicYear = (yearValue) => {
  if (!yearValue) {
    console.warn('⚠️ No academic year provided');
    return null;
  }
  
  const str = String(yearValue).trim();
  console.log(`🔍 Academic year input: "${str}"`);
  
  // Check if already in format 2024/2025
  if (/^\d{4}\/\d{4}$/.test(str)) {
    const [year1, year2] = str.split('/').map(Number);
    if (year2 === year1 + 1) {
      console.log(`✅ Academic year already in correct format: ${str}`);
      return str;
    }
  }
  
  // Check if single year like 2024 or 2026
  if (/^\d{4}$/.test(str)) {
    const year = parseInt(str);
    if (year >= 1900 && year <= 2100) {
      const result = `${year}/${year + 1}`;
      console.log(`✅ Single year converted: ${str} -> ${result}`);
      return result;
    }
  }
  
  // Try to extract years from other formats (e.g., "2026/2027")
  const yearMatch = str.match(/(\d{4})[\/\-](\d{4})/);
  if (yearMatch) {
    const year1 = parseInt(yearMatch[1]);
    const year2 = parseInt(yearMatch[2]);
    if (year1 >= 1900 && year1 <= 2100 && year2 >= 1900 && year2 <= 2100) {
      const result = `${year1}/${year2}`;
      console.log(`✅ Extracted years: ${str} -> ${result}`);
      return result;
    }
  }
  
  // Try to fix malformed years like "2026/2027" (should already match above)
  const malformedMatch = str.match(/(\d{4})\s*\/\s*(\d{4})/);
  if (malformedMatch) {
    const year1 = parseInt(malformedMatch[1]);
    const year2 = parseInt(malformedMatch[2]);
    if (year1 >= 1900 && year1 <= 2100 && year2 >= 1900 && year2 <= 2100) {
      const result = `${year1}/${year2}`;
      console.log(`✅ Fixed malformed year: ${str} -> ${result}`);
      return result;
    }
  }
  
  console.warn(`❌ Could not normalize academic year: ${str}`);
  return str;
};

// Parse amount values
const parseAmount = (value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  
  if (typeof value === 'number') {
    return Math.round(value * 100) / 100;
  }
  
  const str = String(value).trim();
  
  // Handle currency symbols and formatting
  const cleaned = str
    .replace(/[^\d.-]/g, '')
    .replace(/(\..*)\./g, '$1');
  
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) {
    const numberMatch = str.match(/(\d[\d,]*\.?\d*)/);
    if (numberMatch) {
      const numberStr = numberMatch[0].replace(/,/g, '');
      const parsedNumber = parseFloat(numberStr);
      return isNaN(parsedNumber) ? 0 : Math.round(parsedNumber * 100) / 100;
    }
    return 0;
  }
  
  return Math.round(parsed * 100) / 100;
};

// Calculate balance
const calculateBalance = (amount, amountPaid) => {
  const total = parseAmount(amount);
  const paid = parseAmount(amountPaid);
  const balance = Math.max(0, total - paid);
  console.log(`💰 Balance calculation: ${total} - ${paid} = ${balance}`);
  return balance;
};

// Determine payment status
const determinePaymentStatus = (amount, amountPaid) => {
  const total = parseAmount(amount);
  const paid = parseAmount(amountPaid);
  
  if (paid <= 0) return 'pending';
  if (paid >= total) return 'paid';
  return 'partial';
};

// ========== VALIDATION FUNCTIONS ==========

// Enhanced validation with detailed logging
const validateFeeBalance = (feeBalance, index) => {
  const errors = [];
  const warnings = [];
  
  console.log(`\n🔍 Validating row ${index + 2}:`, feeBalance);
  
  // Admission number
  if (!feeBalance.admissionNumber) {
    errors.push(`Row ${index + 2}: Admission number is required`);
    console.error(`❌ Row ${index + 2}: Missing admission number`);
  } else {
    const admissionStr = String(feeBalance.admissionNumber).trim();
    if (!/^\d{4,10}$/.test(admissionStr)) {
      errors.push(`Row ${index + 2}: Admission number must be 4-10 digits (got: ${admissionStr})`);
      console.error(`❌ Row ${index + 2}: Invalid admission number format: ${admissionStr}`);
    } else {
      feeBalance.admissionNumber = admissionStr;
      console.log(`✅ Row ${index + 2}: Valid admission number: ${admissionStr}`);
    }
  }
  
  // Form validation with enhanced logging
  const originalForm = feeBalance.form;
  const normalizedForm = normalizeForm(feeBalance.form);
  const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  
  if (!normalizedForm) {
    errors.push(`Row ${index + 2}: Form is required (got: ${originalForm || 'empty'})`);
    console.error(`❌ Row ${index + 2}: Form normalization failed: ${originalForm} -> null`);
  } else if (!validForms.includes(normalizedForm)) {
    errors.push(`Row ${index + 2}: Form must be one of: ${validForms.join(', ')} (got: ${originalForm}, normalized: ${normalizedForm})`);
    console.error(`❌ Row ${index + 2}: Invalid form: ${originalForm} -> ${normalizedForm}`);
  } else {
    feeBalance.form = normalizedForm;
    console.log(`✅ Row ${index + 2}: Form validated: ${originalForm} -> ${normalizedForm}`);
  }
  
  // Term validation
  const originalTerm = feeBalance.term;
  const normalizedTerm = normalizeTerm(feeBalance.term);
  const validTerms = ['Term 1', 'Term 2', 'Term 3'];
  
  if (!normalizedTerm) {
    errors.push(`Row ${index + 2}: Term is required (got: ${originalTerm || 'empty'})`);
    console.error(`❌ Row ${index + 2}: Term normalization failed: ${originalTerm} -> null`);
  } else if (!validTerms.includes(normalizedTerm)) {
    warnings.push(`Row ${index + 2}: Term might be invalid: ${normalizedTerm} (expected: ${validTerms.join(', ')})`);
    console.warn(`⚠️ Row ${index + 2}: Unusual term: ${originalTerm} -> ${normalizedTerm}`);
  }
  
  feeBalance.term = normalizedTerm;
  
  // Academic year validation
  const originalYear = feeBalance.academicYear;
  const normalizedYear = normalizeAcademicYear(feeBalance.academicYear);
  
  if (!normalizedYear) {
    errors.push(`Row ${index + 2}: Academic year is required (got: ${originalYear || 'empty'})`);
    console.error(`❌ Row ${index + 2}: Academic year normalization failed: ${originalYear} -> null`);
  } else {
    feeBalance.academicYear = normalizedYear;
    console.log(`✅ Row ${index + 2}: Academic year: ${originalYear} -> ${normalizedYear}`);
  }
  
  // Amount validation
  const amount = parseAmount(feeBalance.amount);
  if (amount < 0) {
    errors.push(`Row ${index + 2}: Amount cannot be negative (got: ${feeBalance.amount})`);
    console.error(`❌ Row ${index + 2}: Negative amount: ${feeBalance.amount}`);
  }
  
  const amountPaid = parseAmount(feeBalance.amountPaid);
  if (amountPaid < 0) {
    errors.push(`Row ${index + 2}: Amount paid cannot be negative (got: ${feeBalance.amountPaid})`);
    console.error(`❌ Row ${index + 2}: Negative amount paid: ${feeBalance.amountPaid}`);
  }
  
  if (amountPaid > amount) {
    warnings.push(`Row ${index + 2}: Amount paid (${amountPaid}) is greater than total amount (${amount})`);
    console.warn(`⚠️ Row ${index + 2}: Amount paid > total: ${amountPaid} > ${amount}`);
  }
  
  // Auto-calculate balance and status
  feeBalance.amount = amount;
  feeBalance.amountPaid = amountPaid;
  feeBalance.balance = calculateBalance(amount, amountPaid);
  feeBalance.paymentStatus = determinePaymentStatus(amount, amountPaid);
  
  console.log(`✅ Row ${index + 2} validated:`, {
    admission: feeBalance.admissionNumber,
    form: feeBalance.form,
    term: feeBalance.term,
    year: feeBalance.academicYear,
    amount: feeBalance.amount,
    paid: feeBalance.amountPaid,
    balance: feeBalance.balance,
    status: feeBalance.paymentStatus
  });
  
  return { 
    isValid: errors.length === 0, 
    errors: [...errors, ...warnings],
    hasErrors: errors.length > 0,
    hasWarnings: warnings.length > 0
  };
};

// Check for duplicate fee balances (for validation)
const checkDuplicateFeeBalances = async (feeBalances, targetForm = null, term = null, academicYear = null) => {
  console.log(`\n🔍 Checking duplicates for overwrite:`, {
    targetForm,
    term,
    academicYear,
    feeCount: feeBalances.length
  });
  
  const admissionNumbers = feeBalances.map(f => f.admissionNumber);
  
  const whereClause = {
    admissionNumber: { in: admissionNumbers },
    isActive: true
  };
  
  if (targetForm) {
    const normalizedTargetForm = normalizeForm(targetForm);
    if (normalizedTargetForm) {
      whereClause.form = normalizedTargetForm;
      console.log(`🔍 Filtering by form: ${normalizedTargetForm}`);
    }
  }
  
  if (term) {
    const normalizedTerm = normalizeTerm(term);
    if (normalizedTerm) {
      whereClause.term = normalizedTerm;
      console.log(`🔍 Filtering by term: ${normalizedTerm}`);
    }
  }
  
  if (academicYear) {
    const normalizedYear = normalizeAcademicYear(academicYear);
    if (normalizedYear) {
      whereClause.academicYear = normalizedYear;
      console.log(`🔍 Filtering by year: ${normalizedYear}`);
    }
  }
  
  console.log('🔍 Query where clause:', whereClause);
  
  const existingFees = await prisma.feeBalance.findMany({
    where: whereClause,
    select: {
      admissionNumber: true,
      form: true,
      term: true,
      academicYear: true,
      id: true
    }
  });
  
  console.log(`📊 Found ${existingFees.length} existing fees that will be overwritten`);
  
  // Map for quick lookup
  const existingFeeMap = new Map();
  existingFees.forEach(fee => {
    const key = `${fee.admissionNumber}_${fee.form}_${fee.term}_${fee.academicYear}`;
    existingFeeMap.set(key, fee);
  });
  
  const duplicates = feeBalances
    .map((fee, index) => {
      const feeTerm = term || normalizeTerm(fee.term);
      const feeYear = academicYear || normalizeAcademicYear(fee.academicYear);
      const feeForm = targetForm || normalizeForm(fee.form);
      
      const key = `${fee.admissionNumber}_${feeForm}_${feeTerm}_${feeYear}`;
      
      if (existingFeeMap.has(key)) {
        const existing = existingFeeMap.get(key);
        return {
          row: index + 2,
          admissionNumber: fee.admissionNumber,
          form: existing.form,
          term: existing.term,
          academicYear: existing.academicYear,
          feeId: existing.id
        };
      }
      return null;
    })
    .filter(dup => dup !== null);
  
  console.log(`🔍 Found ${duplicates.length} duplicates that will be replaced`);
  return duplicates;
};

// Check if students exist in database with form validation
const checkStudentsExist = async (admissionNumbers, targetForm = null, tx = prisma) => {
  console.log(`\n🔍 Checking students exist:`, {
    admissionCount: admissionNumbers.length,
    targetForm
  });
  
  const whereClause = {
    admissionNumber: { in: admissionNumbers },
    status: 'active'
  };
  
  if (targetForm) {
    const normalizedForm = normalizeForm(targetForm);
    if (normalizedForm) {
      whereClause.form = normalizedForm;
    }
  }
  
  const existingStudents = await tx.databaseStudent.findMany({
    where: whereClause,
    select: {
      id: true,
      admissionNumber: true,
      firstName: true,
      lastName: true,
      form: true,
      email: true
    }
  });
  
  console.log(`📊 Found ${existingStudents.length} existing students`);
  
  // Check for form mismatches
  const missingStudents = [];
  const formMismatchStudents = [];
  
  admissionNumbers.forEach(num => {
    const student = existingStudents.find(s => s.admissionNumber === num);
    if (!student) {
      missingStudents.push(num);
    } else if (targetForm && student.form !== targetForm) {
      formMismatchStudents.push({
        admissionNumber: num,
        currentForm: student.form,
        expectedForm: targetForm
      });
    }
  });
  
  return {
    existingStudents,
    missingStudents,
    formMismatchStudents,
    existingStudentMap: new Map(existingStudents.map(s => [s.admissionNumber, s]))
  };
};

// ========== FILE PARSING FUNCTIONS ==========

const parseFeeCSV = async (file, uploadStrategy) => {
  try {
    const text = await file.text();
    
    return await new Promise((resolve, reject) => {
      parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          // SAME header normalization as student uploads
          const headerMap = {
            'admission no': 'admissionNumber',
            'admission number': 'admissionNumber',
            'adm no': 'admissionNumber',
            'adm': 'admissionNumber',
            'total amount': 'amount',
            'amount': 'amount',
            'fee amount': 'amount',
            'paid amount': 'amountPaid',
            'amount paid': 'amountPaid',
            'paid': 'amountPaid',
            'balance': 'balance',
            'due date': 'dueDate',
            'due': 'dueDate',
            'term': 'term',
            'academic year': 'academicYear',
            'academic': 'academicYear',
            'year': 'academicYear',
            'form': 'form',
            'class': 'form',
            'grade': 'form'
          };
          return headerMap[header.toLowerCase()] || header;
        },
        complete: (results) => {
          console.log('\n📄 CSV Parsing Results:');
          console.log('Headers:', results.meta.fields);
          console.log('Total rows:', results.data.length);
          
          if (uploadStrategy) {
            console.log('Using upload strategy:', {
              uploadType: uploadStrategy.uploadType,
              selectedForm: uploadStrategy.selectedForm,
              term: uploadStrategy.term,
              academicYear: uploadStrategy.academicYear
            });
          }
          
          const data = results.data
            .map((row, index) => {
              try {
                // CRITICAL: Use same validation as student uploads
                const admissionNumber = String(
                  row.admissionNumber || 
                  row.admission || 
                  row['Admission No'] || 
                  row['Admission Number'] || 
                  ''
                ).trim();
                
                if (!admissionNumber) {
                  console.warn(`Row ${index + 2}: Skipped - no admission number`);
                  return null;
                }
                
                // CRITICAL FIX: Always use strategy values, NOT file values
                const parsedData = {
                  admissionNumber,
                  // ALWAYS use selectedForm from strategy
                  form: uploadStrategy ? uploadStrategy.selectedForm : normalizeForm(row.form || 'Form 1'),
                  
                  // For NEW uploads: Extract from file (first row)
                  // For UPDATE uploads: Use from strategy
                  term: uploadStrategy?.uploadType === 'update' 
                    ? (uploadStrategy.term || normalizeTerm(row.term || 'Term 1'))
                    : normalizeTerm(row.term || 'Term 1'),
                  
                  academicYear: uploadStrategy?.uploadType === 'update'
                    ? (uploadStrategy.academicYear || normalizeAcademicYear(row.academicYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`))
                    : normalizeAcademicYear(row.academicYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`),
                  
                  amount: parseAmount(row.amount || 0),
                  amountPaid: parseAmount(row.amountPaid || 0),
                  dueDate: parseDate(row.dueDate)
                };
                
                // Auto-calculate (SAME as student system)
                parsedData.balance = calculateBalance(parsedData.amount, parsedData.amountPaid);
                parsedData.paymentStatus = determinePaymentStatus(parsedData.amount, parsedData.amountPaid);
                
                console.log(`✅ Row ${index + 2} parsed:`, {
                  admission: parsedData.admissionNumber,
                  form: parsedData.form,
                  term: parsedData.term,
                  year: parsedData.academicYear,
                  amount: parsedData.amount,
                  paid: parsedData.amountPaid,
                  balance: parsedData.balance,
                  status: parsedData.paymentStatus
                });
                
                return parsedData;
              } catch (error) {
                console.error(`❌ Error parsing CSV row ${index}:`, error, row);
                return null;
              }
            })
            .filter(item => item !== null);
          
          console.log(`\n✅ CSV Parsing Complete: ${data.length} valid rows`);
          resolve(data);
        },
        error: reject
      });
    });
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
};

const parseFeeExcel = async (file, uploadStrategy) => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
    
    console.log('\n📄 Excel Parsing Results:');
    console.log('Total rows:', jsonData.length);
    
    if (uploadStrategy) {
      console.log('Using upload strategy:', uploadStrategy);
    }
    
    // SAME header normalization as CSV
    const normalizeHeaders = (obj) => {
      const newObj = {};
      for (const key in obj) {
        const keyLower = String(key).toLowerCase().trim();
        if (keyLower.includes('admission')) {
          newObj.admissionNumber = String(obj[key]).trim();
        } else if (keyLower.includes('amount') && keyLower.includes('paid')) {
          newObj.amountPaid = obj[key];
        } else if (keyLower.includes('due')) {
          newObj.dueDate = obj[key];
        } else if (keyLower.includes('academic') || keyLower.includes('year')) {
          newObj.academicYear = String(obj[key]).trim();
        } else if (keyLower.includes('form') || keyLower.includes('class') || keyLower.includes('grade')) {
          newObj.form = String(obj[key]).trim();
        } else if (keyLower.includes('term')) {
          newObj.term = String(obj[key]).trim();
        } else if (keyLower.includes('amount') && !keyLower.includes('paid')) {
          newObj.amount = obj[key];
        } else if (keyLower.includes('balance')) {
          newObj.balance = obj[key];
        } else {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    };
    
    const data = jsonData
      .map((row, index) => {
        try {
          const normalizedRow = normalizeHeaders(row);
          
          const admissionNumber = normalizedRow.admissionNumber || '';
          if (!admissionNumber) {
            console.warn(`Row ${index + 2}: Skipped - no admission number`);
            return null;
          }
          
          // CRITICAL: Same logic as CSV parsing
          const parsedData = {
            admissionNumber,
            // ALWAYS use selectedForm from strategy
            form: uploadStrategy ? uploadStrategy.selectedForm : normalizeForm(normalizedRow.form || 'Form 1'),
            
            term: uploadStrategy?.uploadType === 'update'
              ? (uploadStrategy.term || normalizeTerm(normalizedRow.term || 'Term 1'))
              : normalizeTerm(normalizedRow.term || 'Term 1'),
            
            academicYear: uploadStrategy?.uploadType === 'update'
              ? (uploadStrategy.academicYear || normalizeAcademicYear(normalizedRow.academicYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`))
              : normalizeAcademicYear(normalizedRow.academicYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`),
            
            amount: parseAmount(normalizedRow.amount || 0),
            amountPaid: parseAmount(normalizedRow.amountPaid || 0),
            dueDate: parseDate(normalizedRow.dueDate)
          };
          
          // Auto-calculate (SAME as student system)
          parsedData.balance = calculateBalance(parsedData.amount, parsedData.amountPaid);
          parsedData.paymentStatus = determinePaymentStatus(parsedData.amount, parsedData.amountPaid);
          
          console.log(`✅ Row ${index + 2} parsed:`, {
            admission: parsedData.admissionNumber,
            form: parsedData.form,
            term: parsedData.term,
            year: parsedData.academicYear
          });
          
          return parsedData;
        } catch (error) {
          console.error(`❌ Error parsing Excel row ${index}:`, error, row);
          return null;
        }
      })
      .filter(item => item !== null);
    
    console.log(`\n✅ Excel Parsing Complete: ${data.length} valid rows`);
    return data;
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== PROCESSING FUNCTIONS ==========

const processUpdateFeeUpload = async (fees, uploadBatchId, uploadStrategy) => {
  console.log(`\n🔄 PROCESSING UPDATE UPLOAD (Complete Replace):`);
  console.log('Strategy:', uploadStrategy);
  
  const normalizedForm = normalizeForm(uploadStrategy.selectedForm);
  const normalizedTerm = normalizeTerm(uploadStrategy.term);
  const normalizedYear = normalizeAcademicYear(uploadStrategy.academicYear);
  
  console.log(`🎯 Target for complete replace: ${normalizedForm} - ${normalizedTerm} ${normalizedYear}`);
  
  const stats = {
    totalRows: fees.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: [],
    created: 0,
    replaced: 0,
    metadata: {}
  };
  
  try {
    // Start transaction for atomic replace
    const result = await prisma.$transaction(async (tx) => {
      // STEP 1: Find and log existing fees before deletion
      const existingFees = await tx.feeBalance.findMany({
        where: {
          form: normalizedForm,
          term: normalizedTerm,
          academicYear: normalizedYear
        },
        select: {
          id: true,
          admissionNumber: true,
          amount: true,
          amountPaid: true,
          form: true,
          term: true,
          academicYear: true
        }
      });
      
      console.log(`📊 Found ${existingFees.length} existing fees to replace`);
      
      // STEP 2: Create audit log before deletion
      if (existingFees.length > 0) {
        await tx.feeBalanceAuditLog.createMany({
          data: existingFees.map(fee => ({
            action: 'REPLACE_DELETE',
            feeId: fee.id,
            admissionNumber: fee.admissionNumber,
            form: fee.form,
            term: fee.term,
            academicYear: fee.academicYear,
            oldAmount: fee.amount,
            oldAmountPaid: fee.amountPaid,
            uploadBatchId: uploadBatchId,
            timestamp: new Date()
          }))
        });
      }
      
      // STEP 3: HARD DELETE all existing fees (true replace)
      const deleteResult = await tx.feeBalance.deleteMany({
        where: {
          form: normalizedForm,
          term: normalizedTerm,
          academicYear: normalizedYear
        }
      });
      
      stats.replaced = deleteResult.count;
      console.log(`🗑️ HARD DELETED ${deleteResult.count} existing fees`);
      
      // STEP 4: Log batch deletion
      if (deleteResult.count > 0) {
        await tx.batchDeletionLog.create({
          data: {
            batchId: uploadBatchId,
            entityType: 'FeeBalance',
            form: normalizedForm,
            term: normalizedTerm,
            academicYear: normalizedYear,
            deletedCount: deleteResult.count,
            deletionReason: 'replace_upload',
            deletedAt: new Date()
          }
        });
      }
      
      // STEP 5: Check students exist for new data
      const admissionNumbers = fees.map(f => f.admissionNumber);
      const studentCheck = await checkStudentsExist(admissionNumbers, normalizedForm, tx);
      
      const seenAdmissionNumbers = new Set();
      const feeCreations = [];
      
      // STEP 6: Validate and prepare new fees
      for (const [index, fee] of fees.entries()) {
        const rowNum = index + 2;
        
        // Skip duplicates within same file
        if (seenAdmissionNumbers.has(fee.admissionNumber)) {
          stats.skippedRows++;
          stats.errors.push(`Row ${rowNum}: Duplicate admission number in file: ${fee.admissionNumber}`);
          continue;
        }
        seenAdmissionNumbers.add(fee.admissionNumber);
        
        // Validate fee
        const validation = validateFeeBalance(fee, index);
        if (!validation.isValid) {
          stats.errorRows++;
          stats.errors.push(...validation.errors);
          continue;
        }
        
        // Check student exists
        const student = studentCheck.existingStudentMap.get(fee.admissionNumber);
        if (!student) {
          stats.skippedRows++;
          stats.errors.push(`Row ${rowNum}: Student ${fee.admissionNumber} not found in ${normalizedForm}`);
          continue;
        }
        
        // Prepare new fee
        feeCreations.push({
          admissionNumber: fee.admissionNumber,
          form: normalizedForm,
          term: normalizedTerm,
          academicYear: normalizedYear,
          amount: fee.amount,
          amountPaid: fee.amountPaid,
          balance: fee.balance,
          paymentStatus: fee.paymentStatus,
          dueDate: fee.dueDate,
          uploadBatchId: uploadBatchId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        stats.validRows++;
      }
      
      // STEP 7: INSERT all new fees
      if (feeCreations.length > 0) {
        const createdFees = await tx.feeBalance.createMany({
          data: feeCreations,
          skipDuplicates: false
        });
        
        stats.created = createdFees.count;
        console.log(`✅ INSERTED ${createdFees.count} new fees`);
        
        // Create audit log for new fees
        await tx.feeBalanceAuditLog.createMany({
          data: feeCreations.map(fee => ({
            action: 'REPLACE_CREATE',
            admissionNumber: fee.admissionNumber,
            form: fee.form,
            term: fee.term,
            academicYear: fee.academicYear,
            newAmount: fee.amount,
            newAmountPaid: fee.amountPaid,
            uploadBatchId: uploadBatchId,
            timestamp: new Date()
          }))
        });
      }
      
      return { 
        deletedCount: deleteResult.count, 
        createdCount: stats.created 
      };
    }, {
      maxWait: 15000,
      timeout: 45000,
      isolationLevel: 'Serializable'
    });
    
    // STEP 8: Update statistics
    stats.metadata = {
      operation: 'complete_replace',
      targetForm: normalizedForm,
      targetTerm: normalizedTerm,
      targetYear: normalizedYear,
      oldDeleted: stats.replaced,
      newInserted: stats.created,
      totalProcessed: stats.validRows,
      fileDuplicates: stats.skippedRows,
      validationErrors: stats.errorRows,
      netChange: stats.created - stats.replaced,
      timestamp: new Date().toISOString()
    };
    
    console.log('\n📊 REPLACE OPERATION COMPLETE:', stats.metadata);
    
    return stats;
    
  } catch (error) {
    console.error('❌ Replace transaction failed:', error);
    
    // User-friendly error messages
    if (error.code === 'P2002') {
      throw new Error('Duplicate fee entries detected. Please ensure each student has only one fee per term/year.');
    }
    
    if (error.code === 'P2003') {
      throw new Error('Student record not found. Verify all students exist in the selected form.');
    }
    
    if (error.message.includes('timeout') || error.code === 'P2024') {
      throw new Error('Operation timed out. Please try with a smaller file or contact support.');
    }
    
    throw new Error(`Replace operation failed: ${error.message}`);
  }
};

const processNewFeeUpload = async (fees, uploadBatchId, uploadStrategy) => {
  console.log(`\n📤 PROCESSING NEW UPLOAD:`);
  console.log('Strategy:', uploadStrategy);
  
  const normalizedForm = normalizeForm(uploadStrategy.selectedForm);
  const firstRow = fees[0];
  const normalizedTerm = normalizeTerm(firstRow?.term || 'Term 1');
  const normalizedYear = normalizeAcademicYear(firstRow?.academicYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`);
  
  console.log(`🎯 New upload for: ${normalizedForm} - ${normalizedTerm} ${normalizedYear}`);
  
  const stats = {
    totalRows: fees.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: [],
    created: 0,
    skippedDuplicates: 0,
    metadata: {}
  };
  
  try {
    await prisma.$transaction(async (tx) => {
      // Check for existing fees to skip
      const admissionNumbers = fees.map(f => f.admissionNumber);
      const existingFees = await tx.feeBalance.findMany({
        where: {
          admissionNumber: { in: admissionNumbers },
          form: normalizedForm,
          term: normalizedTerm,
          academicYear: normalizedYear
        },
        select: {
          admissionNumber: true
        }
      });
      
      const existingAdmissionNumbers = new Set(existingFees.map(f => f.admissionNumber));
      const seenInFile = new Set();
      const feeCreations = [];
      
      // Process each fee
      for (const [index, fee] of fees.entries()) {
        const rowNum = index + 2;
        
        // Skip duplicates within same file
        if (seenInFile.has(fee.admissionNumber)) {
          stats.skippedRows++;
          stats.errors.push(`Row ${rowNum}: Duplicate in file: ${fee.admissionNumber}`);
          continue;
        }
        seenInFile.add(fee.admissionNumber);
        
        // Skip existing fees
        if (existingAdmissionNumbers.has(fee.admissionNumber)) {
          stats.skippedDuplicates++;
          continue;
        }
        
        // Validate
        const validation = validateFeeBalance(fee, index);
        if (!validation.isValid) {
          stats.errorRows++;
          stats.errors.push(...validation.errors);
          continue;
        }
        
        // Check student exists
        const admissionNumbers = [fee.admissionNumber];
        const studentCheck = await checkStudentsExist(admissionNumbers, normalizedForm, tx);
        if (!studentCheck.existingStudentMap.has(fee.admissionNumber)) {
          stats.skippedRows++;
          stats.errors.push(`Row ${rowNum}: Student ${fee.admissionNumber} not found`);
          continue;
        }
        
        // Prepare new fee
        feeCreations.push({
          admissionNumber: fee.admissionNumber,
          form: normalizedForm,
          term: normalizedTerm,
          academicYear: normalizedYear,
          amount: fee.amount,
          amountPaid: fee.amountPaid,
          balance: fee.balance,
          paymentStatus: fee.paymentStatus,
          dueDate: fee.dueDate,
          uploadBatchId: uploadBatchId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        stats.validRows++;
      }
      
      // Insert new fees
      if (feeCreations.length > 0) {
        const createdFees = await tx.feeBalance.createMany({
          data: feeCreations,
          skipDuplicates: true
        });
        
        stats.created = createdFees.count;
        
        // Audit log
        await tx.feeBalanceAuditLog.createMany({
          data: feeCreations.map(fee => ({
            action: 'NEW_CREATE',
            admissionNumber: fee.admissionNumber,
            form: fee.form,
            term: fee.term,
            academicYear: fee.academicYear,
            newAmount: fee.amount,
            newAmountPaid: fee.amountPaid,
            uploadBatchId: uploadBatchId,
            timestamp: new Date()
          }))
        });
      }
    });
    
    stats.metadata = {
      operation: 'new_upload',
      targetForm: normalizedForm,
      targetTerm: normalizedTerm,
      targetYear: normalizedYear,
      newInserted: stats.created,
      duplicatesSkipped: stats.skippedDuplicates,
      totalProcessed: stats.validRows,
      timestamp: new Date().toISOString()
    };
    
    console.log('\n📊 NEW UPLOAD COMPLETE:', stats.metadata);
    
    return stats;
    
  } catch (error) {
    console.error('New upload error:', error);
    throw error;
  }
};

// ========== API ENDPOINTS ==========

// POST - Bulk upload (PROTECTED - authentication required)
export async function POST(request) {
  try {
    // Step 1: Authenticate the POST request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Fees bulk upload request from: ${auth.user.name} (${auth.user.role})`);

    const formData = await request.formData();
    const file = formData.get('file');
    const uploadType = formData.get('uploadType'); // 'new' or 'update'
    const selectedForm = formData.get('selectedForm');
    const checkDuplicates = formData.get('checkDuplicates') === 'true';
    const term = formData.get('term');
    const academicYear = formData.get('academicYear');
    
    console.log('\n📤 FEE UPLOAD REQUEST:');
    console.log('File:', file?.name);
    console.log('Upload Type:', uploadType);
    console.log('Selected Form:', selectedForm);
    console.log('Term:', term);
    console.log('Academic Year:', academicYear);
    console.log('Check Duplicates:', checkDuplicates);
    console.log('Uploaded By:', auth.user.name);
    
    // Validate required fields
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided',
        authenticated: true 
      }, { status: 400 });
    }
    
    if (!uploadType || !selectedForm) {
      return NextResponse.json({ 
        success: false, 
        error: 'Upload type and form selection are required',
        authenticated: true 
      }, { status: 400 });
    }
    
    // Validate form
    const normalizedForm = normalizeForm(selectedForm);
    if (!normalizedForm) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid form: ${selectedForm}. Must be one of: Form 1, Form 2, Form 3, Form 4`,
        authenticated: true 
      }, { status: 400 });
    }
    
    // For UPDATE uploads, term and academicYear are REQUIRED
    if (uploadType === 'update' && (!term || !academicYear)) {
      return NextResponse.json({
        success: false, 
        error: 'For update uploads, term and academic year are required',
        authenticated: true 
      }, { status: 400 });
    }
    
    // Create upload strategy object
    const uploadStrategy = {
      uploadType,
      selectedForm: normalizedForm,
      term: uploadType === 'update' ? term : undefined,
      academicYear: uploadType === 'update' ? academicYear : undefined
    };
    
    console.log('📋 Upload Strategy:', uploadStrategy);
    
    // Parse file with strategy
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    
    let parsedData;
    if (fileExtension === 'csv') {
      parsedData = await parseFeeCSV(file, uploadStrategy);
    } else {
      parsedData = await parseFeeExcel(file, uploadStrategy);
    }
    
    if (!parsedData || parsedData.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No valid fee data found in file',
        authenticated: true 
      }, { status: 400 });
    }
    
    console.log(`✅ Parsed ${parsedData.length} rows`);
    
    // For NEW uploads, ensure all rows have same term/year (from first row)
    if (uploadType === 'new') {
      const firstRow = parsedData[0];
      const commonTerm = normalizeTerm(firstRow.term);
      const commonYear = normalizeAcademicYear(firstRow.academicYear);
      
      parsedData = parsedData.map(row => ({
        ...row,
        term: commonTerm,
        academicYear: commonYear,
        form: normalizedForm // Ensure all rows have correct form
      }));
      
      console.log(`📝 Normalized NEW upload: Term=${commonTerm}, Year=${commonYear}`);
    }
    
    // If just checking duplicates
    if (checkDuplicates) {
      const duplicates = await checkDuplicateFeeBalances(
        parsedData, 
        normalizedForm,
        uploadType === 'update' ? term : parsedData[0]?.term,
        uploadType === 'update' ? academicYear : parsedData[0]?.academicYear
      );
      
      return NextResponse.json({
        success: true,
        hasDuplicates: duplicates.length > 0,
        duplicates: duplicates,
        totalRows: parsedData.length,
        form: normalizedForm,
        term: uploadType === 'update' ? term : parsedData[0]?.term,
        academicYear: uploadType === 'update' ? academicYear : parsedData[0]?.academicYear,
        uploadType: uploadType,
        authenticated: true,
        uploadedBy: auth.user.name,
        message: duplicates.length > 0 
          ? `Found ${duplicates.length} existing fees` 
          : 'No duplicates found'
      });
    }
    
    // Create batch record with uploader info
    const batchId = `FEE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await prisma.feeBalanceUpload.create({
      data: {
        id: batchId,
        fileName: file.name,
        fileType: fileExtension,
        uploadedBy: auth.user.name, // Use authenticated user's name
        status: 'processing',
        targetForm: normalizedForm,
        term: uploadType === 'update' ? term : parsedData[0]?.term,
        academicYear: uploadType === 'update' ? academicYear : parsedData[0]?.academicYear,
        totalRows: parsedData.length,
        validRows: 0,
        skippedRows: 0,
        errorRows: 0,
        uploadType: uploadType,
        uploadDate: new Date(),
        metadata: {
          uploadedBy: auth.user.name,
          userRole: auth.user.role,
          uploadTimestamp: new Date().toISOString()
        }
      }
    });
    
    // Process upload based on type
    let processingStats;
    if (uploadType === 'new') {
      processingStats = await processNewFeeUpload(parsedData, batchId, uploadStrategy);
    } else {
      processingStats = await processUpdateFeeUpload(parsedData, batchId, uploadStrategy);
    }
    
    // Update batch record
    await prisma.feeBalanceUpload.update({
      where: { id: batchId },
      data: {
        status: 'completed',
        processedDate: new Date(),
        validRows: processingStats.validRows,
        skippedRows: processingStats.skippedRows,
        errorRows: processingStats.errorRows,
       errorLog: processingStats.errors.length > 0 
            ? processingStats.errors.join('\n').substring(0, 4000)  // Truncate to 4000 chars
            : null,
        metadata: {
          uploadedBy: auth.user.name,
          userRole: auth.user.role,
          uploadTimestamp: new Date().toISOString(),
          created: processingStats.created || 0,
          updated: processingStats.updated || 0,
          replaced: processingStats.replaced || 0,
          errors: processingStats.errorRows || 0,
          warnings: processingStats.errors.filter(e => 
            e.includes('warning') || e.includes('Warning')).length
        }
      }
    });
    
    console.log('\n✅ UPLOAD COMPLETE:', {
      batchId,
      valid: processingStats.validRows,
      created: processingStats.created,
      updated: processingStats.updated,
      replaced: processingStats.replaced,
      skipped: processingStats.skippedRows,
      errors: processingStats.errorRows,
      uploadedBy: auth.user.name
    });
    
    return NextResponse.json({
      success: true,
      message: uploadType === 'new'
        ? `Uploaded ${processingStats.created} new fees for ${normalizedForm}`
        : `Updated ${processingStats.created} fees for ${normalizedForm} ${term} ${academicYear}`,
      data: {
        uploadId: batchId,
        processed: processingStats.validRows,
        created: processingStats.created,
        updated: processingStats.updated,
        replaced: processingStats.replaced,
        skipped: processingStats.skippedRows,
        errors: processingStats.errors,
        form: normalizedForm,
        term: uploadType === 'update' ? term : parsedData[0]?.term,
        academicYear: uploadType === 'update' ? academicYear : parsedData[0]?.academicYear
      },
      authenticated: true,
      uploadedBy: auth.user.name,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Upload failed',
        authenticated: true,
        suggestion: 'Check that your file has the required columns and data format matches the template.'
      },
      { status: 500 }
    );
  }
}

// GET - Fetch fee balances, uploads, or statistics (PUBLIC - no authentication required)
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const form = url.searchParams.get('form') || '';
    const term = url.searchParams.get('term') || '';
    const academicYear = url.searchParams.get('academicYear') || '';
    const paymentStatus = url.searchParams.get('paymentStatus') || '';
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const includeStudent = url.searchParams.get('includeStudent') === 'true';
    const includeStats = url.searchParams.get('includeStats') !== 'false';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const uploadType = url.searchParams.get('uploadType') || '';
    const showInactive = url.searchParams.get('showInactive') === 'true';
    const showAll = url.searchParams.get('showAll') === 'true';
    
    console.log('🔍 GET request:', { 
      action, 
      form, 
      term, 
      academicYear, 
      showInactive,
      page, 
      limit 
    });

    // ========== HELPER FUNCTIONS ==========

    // Build WHERE clause for fee balances with isActive filter
    const buildFeeWhereClause = (params) => {
      const { 
        admissionNumber, 
        form, 
        term, 
        academicYear, 
        paymentStatus, 
        search, 
        showInactive = false,
        showAll = false
      } = params;
      
      const where = {};
      
      // Handle isActive filter - by default only show active, unless explicitly requested
      if (!showAll) {
        where.isActive = showInactive ? false : true;
      }
      // If showAll is true, don't filter by isActive at all
      
      // Standard filters
      if (admissionNumber) where.admissionNumber = admissionNumber;
      if (form) where.form = form;
      if (term) where.term = term;
      if (academicYear) where.academicYear = academicYear;
      if (paymentStatus) where.paymentStatus = paymentStatus;
      
      // Search across admission number and student names
      if (search && search.trim()) {
        const searchTerm = search.toLowerCase();
        where.OR = [
          { admissionNumber: { contains: searchTerm } },
          { student: { 
            OR: [
              { firstName: { contains: searchTerm } },
              { lastName: { contains: searchTerm } },
              { middleName: { contains: searchTerm } }
            ]
          }}
        ];
      }
      
      return where;
    };

    // ========== ACTION HANDLERS ==========
if (action === 'uploads') {
  // Fetch upload history with optional filtering
  const uploadWhere = {};
  if (form) uploadWhere.targetForm = form;
  if (uploadType) uploadWhere.uploadType = uploadType;
  
  const [uploads, total] = await Promise.all([
    prisma.feeBalanceUpload.findMany({
      where: uploadWhere,
      orderBy: { uploadDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        fileName: true,
        fileType: true,
        status: true,
        uploadedBy: true,
        uploadDate: true,
        processedDate: true,
        term: true,
        academicYear: true,
        targetForm: true,
        totalRows: true,
        validRows: true,
        skippedRows: true,
        errorRows: true,
        errorLog: true,
        uploadType: true,
        metadata: true
      }
    }),
    prisma.feeBalanceUpload.count({ where: uploadWhere })
  ]);
  
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
      // Get current academic year
      const currentYear = new Date().getFullYear();
      const currentAcademicYear = `${currentYear}/${currentYear + 1}`;
      
      // Build WHERE clause for active records only
      const statsWhere = {
        isActive: true,
        ...(form && { form }),
        ...(term && { term }),
        ...(academicYear && { academicYear }),
        ...(paymentStatus && { paymentStatus })
      };
      
      // Get ALL active fees (for accurate statistics)
      const allActiveFees = await prisma.feeBalance.findMany({
        where: statsWhere,
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
      
      // Calculate comprehensive statistics
      const forms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
      const statsByForm = {};
      
      forms.forEach(formName => {
        const formFees = allActiveFees.filter(fee => fee.form === formName);
        const totalAmount = formFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
        const totalPaid = formFees.reduce((sum, fee) => sum + (fee.amountPaid || 0), 0);
        const totalBalance = formFees.reduce((sum, fee) => sum + (fee.balance || 0), 0);
        
        statsByForm[formName] = {
          count: formFees.length,
          totalAmount,
          totalPaid,
          totalBalance,
          paidCount: formFees.filter(f => f.paymentStatus === 'paid').length,
          partialCount: formFees.filter(f => f.paymentStatus === 'partial').length,
          pendingCount: formFees.filter(f => f.paymentStatus === 'pending').length,
          collectionRate: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0,
          averageFee: formFees.length > 0 ? totalAmount / formFees.length : 0
        };
      });
      
      // Overall statistics
      const totalRecords = allActiveFees.length;
      const totalAmount = allActiveFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
      const totalPaid = allActiveFees.reduce((sum, fee) => sum + (fee.amountPaid || 0), 0);
      const totalBalance = allActiveFees.reduce((sum, fee) => sum + (fee.balance || 0), 0);
      
      const overallStats = {
        totalRecords,
        totalAmount,
        totalPaid,
        totalBalance,
        paidCount: allActiveFees.filter(f => f.paymentStatus === 'paid').length,
        partialCount: allActiveFees.filter(f => f.paymentStatus === 'partial').length,
        pendingCount: allActiveFees.filter(f => f.paymentStatus === 'pending').length,
        collectionRate: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0,
        averageFeePerStudent: totalRecords > 0 ? totalAmount / totalRecords : 0,
        forms: statsByForm,
        
        // Active/Inactive counts
        activeCount: await prisma.feeBalance.count({ where: { isActive: true } }),
        inactiveCount: await prisma.feeBalance.count({ where: { isActive: false } }),
        
        // Current academic year focus
        currentAcademicYear: {
          year: currentAcademicYear,
          count: allActiveFees.filter(f => f.academicYear === currentAcademicYear).length,
          amount: allActiveFees
            .filter(f => f.academicYear === currentAcademicYear)
            .reduce((sum, fee) => sum + (fee.amount || 0), 0),
          paid: allActiveFees
            .filter(f => f.academicYear === currentAcademicYear)
            .reduce((sum, fee) => sum + (fee.amountPaid || 0), 0)
        }
      };
      
      return NextResponse.json({
        success: true,
        data: {
          stats: overallStats,
          filters: { form, term, academicYear, paymentStatus },
          generatedAt: new Date().toISOString(),
          note: 'Statistics reflect only active fee records (isActive: true)'
        }
      });
    }

    if (action === 'inactive-fees') {
      // Special endpoint to view inactive fees (audit trail)
      const inactiveWhere = buildFeeWhereClause({
        admissionNumber, form, term, academicYear, paymentStatus, search,
        showInactive: true,
        showAll: false
      });
      
      const [inactiveFees, total] = await Promise.all([
        prisma.feeBalance.findMany({
          where: inactiveWhere,
          orderBy: { updatedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                admissionNumber: true,
                form: true
              }
            },
            uploadBatch: {
              select: {
                fileName: true,
                uploadDate: true,
                uploadType: true
              }
            }
          }
        }),
        prisma.feeBalance.count({ where: inactiveWhere })
      ]);
      
      return NextResponse.json({
        success: true,
        data: {
          inactiveFees,
          pagination: { 
            page, 
            limit, 
            total, 
            pages: Math.ceil(total / limit) 
          }
        }
      });
    }

    if (action === 'student-fees') {
      // Get all fees for a specific student across ALL terms and years
      if (!admissionNumber) {
        return NextResponse.json(
          { success: false, error: 'admissionNumber is required for student-fees action' },
          { status: 400 }
        );
      }
      
      console.log(`📊 Fetching ALL fees for student: ${admissionNumber}`);
      
      // Get all fees for this student (active and inactive)
      const allStudentFees = await prisma.feeBalance.findMany({
        where: {
          admissionNumber,
          ...(form && { form }),
          ...(term && { term }),
          ...(academicYear && { academicYear })
        },
        orderBy: [
          { academicYear: 'desc' },  // Newest year first
          { term: 'desc' },          // Term 3, Term 2, Term 1
          { updatedAt: 'desc' }
        ],
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              admissionNumber: true,
              form: true,
              stream: true,
              email: true,
              parentPhone: true
            }
          }
        }
      });
      
      console.log(`✅ Found ${allStudentFees.length} fee records for ${admissionNumber}`);
      
      // Separate active and inactive
      const activeFees = allStudentFees.filter(fee => fee.isActive);
      const inactiveFees = allStudentFees.filter(fee => !fee.isActive);
      
      // ====== COMPREHENSIVE SUMMARY CALCULATION ======
      
      // Overall totals (ALL fees)
      const overallTotal = {
        totalAmount: allStudentFees.reduce((sum, fee) => sum + (fee.amount || 0), 0),
        totalPaid: allStudentFees.reduce((sum, fee) => sum + (fee.amountPaid || 0), 0),
        totalBalance: allStudentFees.reduce((sum, fee) => sum + (fee.balance || 0), 0),
        totalRecords: allStudentFees.length
      };
      
      // Active fees only totals
      const activeTotal = {
        totalAmount: activeFees.reduce((sum, fee) => sum + (fee.amount || 0), 0),
        totalPaid: activeFees.reduce((sum, fee) => sum + (fee.amountPaid || 0), 0),
        totalBalance: activeFees.reduce((sum, fee) => sum + (fee.balance || 0), 0),
        totalRecords: activeFees.length
      };
      
      // ====== GROUP BY ACADEMIC YEAR ======
      const feesByYear = {};
      
      allStudentFees.forEach(fee => {
        const year = fee.academicYear || 'Unknown';
        if (!feesByYear[year]) {
          feesByYear[year] = {
            academicYear: year,
            terms: {},
            totalAmount: 0,
            totalPaid: 0,
            totalBalance: 0,
            records: []
          };
        }
        
        // Add to year totals
        feesByYear[year].totalAmount += fee.amount || 0;
        feesByYear[year].totalPaid += fee.amountPaid || 0;
        feesByYear[year].totalBalance += fee.balance || 0;
        feesByYear[year].records.push(fee);
        
        // Group by term within this year
        const term = fee.term || 'Unknown';
        if (!feesByYear[year].terms[term]) {
          feesByYear[year].terms[term] = {
            term: term,
            totalAmount: 0,
            totalPaid: 0,
            totalBalance: 0,
            status: fee.paymentStatus,
            records: []
          };
        }
        
        feesByYear[year].terms[term].totalAmount += fee.amount || 0;
        feesByYear[year].terms[term].totalPaid += fee.amountPaid || 0;
        feesByYear[year].terms[term].totalBalance += fee.balance || 0;
        feesByYear[year].terms[term].records.push(fee);
      });
      
      // Convert terms object to array for each year
      Object.keys(feesByYear).forEach(year => {
        feesByYear[year].terms = Object.values(feesByYear[year].terms);
        // Sort terms: Term 3, Term 2, Term 1
        feesByYear[year].terms.sort((a, b) => {
          const termOrder = { 'Term 3': 3, 'Term 2': 2, 'Term 1': 1 };
          return (termOrder[b.term] || 0) - (termOrder[a.term] || 0);
        });
      });
      
      // Convert to sorted array (newest year first)
      const feesByYearArray = Object.values(feesByYear).sort((a, b) => {
        // Extract years for comparison (e.g., "2024/2025" -> 2024)
        const yearA = parseInt(a.academicYear.split('/')[0]) || 0;
        const yearB = parseInt(b.academicYear.split('/')[0]) || 0;
        return yearB - yearA; // Descending
      });
      
      // ====== PAYMENT STATUS SUMMARY ======
      const statusSummary = {
        paid: activeFees.filter(f => f.paymentStatus === 'paid').length,
        partial: activeFees.filter(f => f.paymentStatus === 'partial').length,
        pending: activeFees.filter(f => f.paymentStatus === 'pending').length,
        totalActive: activeFees.length,
        totalInactive: inactiveFees.length
      };
      
      // ====== STUDENT INFO ======
      const studentInfo = allStudentFees.length > 0 
        ? allStudentFees[0].student 
        : await prisma.databaseStudent.findUnique({
            where: { admissionNumber },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              admissionNumber: true,
              form: true,
              stream: true,
              email: true
            }
          });
      
      console.log(`💰 Fee Summary for ${admissionNumber}:`);
      console.log(`   Total Amount: KES ${overallTotal.totalAmount.toLocaleString()}`);
      console.log(`   Total Paid: KES ${overallTotal.totalPaid.toLocaleString()}`);
      console.log(`   Total Balance: KES ${overallTotal.totalBalance.toLocaleString()}`);
      console.log(`   Active Records: ${activeFees.length}`);
      console.log(`   Years with fees: ${feesByYearArray.length}`);
      
      // ====== RETURN COMPLETE DATA ======
      return NextResponse.json({
        success: true,
        
        // Main fee data
        feeBalances: activeFees,           // Current active fees only
        allFees: allStudentFees,           // ALL historical fees (active + inactive)
        inactiveFees: inactiveFees,        // Only inactive/archived fees
        
        // Summary data for quick display
        summary: {
          // Overall totals (ALL historical)
          overall: overallTotal,
          
          // Current/active totals only
          current: activeTotal,
          
          // Status breakdown
          status: statusSummary,
          
          // Form/Class info
          currentForm: studentInfo?.form || 'N/A',
          currentStream: studentInfo?.stream || 'N/A',
          
          // Payment status labels
          isFullyPaid: activeTotal.totalBalance === 0,
          hasPendingFees: activeTotal.totalBalance > 0,
          paymentPercentage: activeTotal.totalAmount > 0 
            ? Math.round((activeTotal.totalPaid / activeTotal.totalAmount) * 100) 
            : 0
        },
        
        // Organized by academic year (for detailed breakdown)
        organizedByYear: feesByYearArray,
        
        // Student information
        student: studentInfo,
        
        // Metadata
        metadata: {
          fetchedAt: new Date().toISOString(),
          admissionNumber,
          totalRecords: allStudentFees.length,
          academicYears: feesByYearArray.map(y => y.academicYear),
          termsCovered: [...new Set(allStudentFees.map(f => f.term).filter(Boolean))]
        }
      });
    }

    // ========== DEFAULT: GET FEE BALANCES ==========
    
    // Build WHERE clause for main query
    const where = buildFeeWhereClause({
      admissionNumber, form, term, academicYear, paymentStatus, search,
      showInactive,
      showAll
    });
    
    // Get orderBy
    const orderBy = {};
    orderBy[sortBy] = sortOrder;
    
    // Get fee balances with pagination
    const [feeBalances, total] = await Promise.all([
      prisma.feeBalance.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: includeStudent ? {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              middleName: true,
              admissionNumber: true,
              form: true,
              stream: true,
              email: true,
              parentPhone: true
            }
          }
        } : undefined
      }),
      prisma.feeBalance.count({ where })
    ]);
    
    // Calculate form distribution for stats (respecting isActive filter)
    const formDistribution = await prisma.feeBalance.groupBy({
      by: ['form'],
      where,
      _count: true,
      _sum: {
        amount: true,
        amountPaid: true,
        balance: true
      }
    });
    
    const stats = {
      totalRecords: total,
      activeRecords: await prisma.feeBalance.count({ 
        where: { ...where, isActive: true } 
      }),
      inactiveRecords: await prisma.feeBalance.count({ 
        where: { ...where, isActive: false } 
      }),
      totalAmount: formDistribution.reduce((sum, f) => sum + (f._sum.amount || 0), 0),
      totalPaid: formDistribution.reduce((sum, f) => sum + (f._sum.amountPaid || 0), 0),
      totalBalance: formDistribution.reduce((sum, f) => sum + (f._sum.balance || 0), 0),
      formDistribution: formDistribution.reduce((acc, f) => {
        acc[f.form] = {
          count: f._count,
          amount: f._sum.amount || 0,
          paid: f._sum.amountPaid || 0,
          balance: f._sum.balance || 0
        };
        return acc;
      }, {})
    };
    
    const response = {
      success: true,
      data: {
        feeBalances,
        stats: includeStats ? stats : null,
        filters: { 
          form, 
          term, 
          academicYear, 
          paymentStatus, 
          search,
          showInactive,
          showAll 
        },
        pagination: { 
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit) 
        },
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch fee balances',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// PUT - Update single fee balance (PROTECTED - authentication required)
export async function PUT(request) {
  try {
    // Step 1: Authenticate the PUT request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Fee balance update request from: ${auth.user.name} (${auth.user.role})`);

    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Fee ID is required', authenticated: true },
        { status: 400 }
      );
    }
    
    // Auto-calculate balance if amount or amountPaid is updated
    if (updateData.amount !== undefined || updateData.amountPaid !== undefined) {
      const currentFee = await prisma.feeBalance.findUnique({
        where: { id },
        select: { amount: true, amountPaid: true }
      });
      
      const amount = updateData.amount !== undefined ? updateData.amount : currentFee.amount;
      const amountPaid = updateData.amountPaid !== undefined ? updateData.amountPaid : currentFee.amountPaid;
      
      updateData.balance = calculateBalance(amount, amountPaid);
      updateData.paymentStatus = determinePaymentStatus(amount, amountPaid);
    }
    
    // Normalize data
    if (updateData.form) updateData.form = normalizeForm(updateData.form);
    if (updateData.term) updateData.term = normalizeTerm(updateData.term);
    if (updateData.academicYear) updateData.academicYear = normalizeAcademicYear(updateData.academicYear);
    
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
            form: true,
            admissionNumber: true
          }
        }
      }
    });

    console.log(`✅ Fee balance updated by ${auth.user.name}: ${updatedFee.admissionNumber}`);
    
    return NextResponse.json({
      success: true,
      message: 'Fee balance updated successfully',
      data: {
        feeBalance: updatedFee
      },
      authenticated: true,
      updatedBy: auth.user.name
    });
    
  } catch (error) {
    console.error('PUT error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Fee balance not found', authenticated: true },
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

// DELETE - Delete fee balance or batch (PROTECTED - authentication required)
export async function DELETE(request) {
  try {
    // Step 1: Authenticate the DELETE request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`🗑️ Fee delete request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const feeId = url.searchParams.get('feeId');
    const form = url.searchParams.get('form');
    const term = url.searchParams.get('term');
    const academicYear = url.searchParams.get('academicYear');
    
    if (batchId) {
      // Delete batch and associated fees
      const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.feeBalanceUpload.findUnique({
          where: { id: batchId }
        });
        
        if (!batch) {
          throw new Error('Batch not found');
        }
        
        // Delete all fees from this batch
        const deleteResult = await tx.feeBalance.deleteMany({
          where: { uploadBatchId: batchId }
        });
        
        // Delete batch record
        await tx.feeBalanceUpload.delete({
          where: { id: batchId }
        });
        
        return { 
          batch, 
          deletedCount: deleteResult.count
        };
      });

      console.log(`✅ Batch deleted by ${auth.user.name}: ${result.batch.fileName} (${result.deletedCount} fee balances)`);
      
      return NextResponse.json({
        success: true,
        message: `Deleted batch ${result.batch.fileName} and ${result.deletedCount} fee balances`,
        authenticated: true,
        deletedBy: auth.user.name
      });
    }
    
    if (feeId) {
      // Delete single fee balance
      const fee = await prisma.feeBalance.delete({
        where: { id: feeId }
      });

      console.log(`✅ Fee deleted by ${auth.user.name}: ${fee.admissionNumber} - ${fee.form} ${fee.term} ${fee.academicYear}`);
      
      return NextResponse.json({
        success: true,
        message: `Deleted fee balance for ${fee.admissionNumber} - ${fee.form} ${fee.term} ${fee.academicYear}`,
        authenticated: true,
        deletedBy: auth.user.name
      });
    }
    
    if (form && term && academicYear) {
      // Delete all fees for a specific form/term/year
      const deleteResult = await prisma.feeBalance.deleteMany({
        where: {
          form: form,
          term: term,
          academicYear: academicYear
        }
      });

      console.log(`✅ Fees deleted by ${auth.user.name}: ${deleteResult.count} fee balances for ${form} - ${term} ${academicYear}`);
      
      return NextResponse.json({
        success: true,
        message: `Deleted ${deleteResult.count} fee balances for ${form} - ${term} ${academicYear}`,
        authenticated: true,
        deletedBy: auth.user.name
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Provide batchId, feeId, or form/term/year combination', authenticated: true },
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

// PATCH - Reactivate inactive fees (PROTECTED - authentication required)
export async function PATCH(request) {
  try {
    // Step 1: Authenticate the PATCH request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Fee reactivate request from: ${auth.user.name} (${auth.user.role})`);

    const url = new URL(request.url);
    const feeId = url.searchParams.get('feeId');
    const batchId = url.searchParams.get('batchId');
    
    if (feeId) {
      // Reactivate single fee
      const fee = await prisma.feeBalance.update({
        where: { id: feeId },
        data: {
          isActive: true,
          updatedAt: new Date()
        }
      });

      console.log(`✅ Fee reactivated by ${auth.user.name}: ${fee.admissionNumber}`);
      
      return NextResponse.json({
        success: true,
        message: `Fee balance for ${fee.admissionNumber} reactivated`,
        data: { fee },
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }
    
    if (batchId) {
      // Reactivate all fees in a batch
      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.feeBalance.updateMany({
          where: { 
            uploadBatchId: batchId,
            isActive: false
          },
          data: {
            isActive: true,
            updatedAt: new Date()
          }
        });

        return { count: updated.count };
      });

      console.log(`✅ Batch reactivated by ${auth.user.name}: ${result.count} fee balances`);
      
      return NextResponse.json({
        success: true,
        message: `Reactivated ${result.count} fee balances from batch`,
        data: result,
        authenticated: true,
        reactivatedBy: auth.user.name
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Provide feeId or batchId', authenticated: true },
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