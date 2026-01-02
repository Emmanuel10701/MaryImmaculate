import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from "../../../libs/prisma";

// ========== HELPER FUNCTIONS ==========

const parseScore = (value) => {
  if (!value && value !== 0) return null;
  
  const str = String(value).trim();
  const cleaned = str.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? null : Math.round(parsed * 100) / 100;
};

const calculateGrade = (score) => {
  if (score === null || score === undefined) return 'N/A';
  
  if (score >= 80) return 'A';
  if (score >= 70) return 'A-';
  if (score >= 60) return 'B+';
  if (score >= 55) return 'B';
  if (score >= 50) return 'B-';
  if (score >= 45) return 'C+';
  if (score >= 40) return 'C';
  if (score >= 35) return 'C-';
  if (score >= 30) return 'D+';
  if (score >= 25) return 'D';
  return 'E';
};

const calculateResultAverage = (result) => {
  if (!result.subjects) return 0;
  
  let subjects = result.subjects;
  
  if (typeof subjects === 'string') {
    try {
      subjects = JSON.parse(subjects);
    } catch (e) {
      return 0;
    }
  }
  
  if (!Array.isArray(subjects) || subjects.length === 0) return 0;
  
  const totalScore = subjects.reduce((sum, s) => {
    const score = parseFloat(s.score) || 0;
    return sum + score;
  }, 0);
  
  return subjects.length > 0 ? parseFloat((totalScore / subjects.length).toFixed(2)) : 0;
};

const calculatePoints = (score, subjectType = 'main') => {
  if (score === null) return null;
  
  const grade = calculateGrade(score);
  const pointMap = {
    'A': subjectType === 'main' ? 12 : 7,
    'A-': subjectType === 'main' ? 11 : 6,
    'B+': subjectType === 'main' ? 10 : 5,
    'B': subjectType === 'main' ? 9 : 4,
    'B-': subjectType === 'main' ? 8 : 3,
    'C+': subjectType === 'main' ? 7 : 2,
    'C': subjectType === 'main' ? 6 : 1,
    'C-': subjectType === 'main' ? 5 : 0,
    'D+': subjectType === 'main' ? 4 : 0,
    'D': subjectType === 'main' ? 3 : 0,
    'E': 0
  };
  
  return pointMap[grade] || 0;
};

const normalizeTerm = (term) => {
  if (!term) return term;
  
  const termStr = String(term).trim().toLowerCase();
  const termMap = {
    'term1': 'Term 1',
    'term 1': 'Term 1',
    '1': 'Term 1',
    'first term': 'Term 1',
    'term2': 'Term 2',
    'term 2': 'Term 2',
    '2': 'Term 2',
    'second term': 'Term 2',
    'term3': 'Term 3',
    'term 3': 'Term 3',
    '3': 'Term 3',
    'third term': 'Term 3'
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
  
  if (/^\d{4}\/\d{4}$/.test(yearStr)) {
    return yearStr;
  }
  
  return yearStr;
};

const normalizeSubjectName = (subjectName) => {
  if (!subjectName) return '';
  
  const lowerName = subjectName.toLowerCase().trim();
  
  const subjectMap = {
    'english': 'English',
    'kiswahili': 'Kiswahili',
    'mathematics': 'Mathematics',
    'biology': 'Biology',
    'chemistry': 'Chemistry',
    'physics': 'Physics',
    'history': 'History',
    'geography': 'Geography',
    'cre': 'CRE',
    'business studies': 'Business Studies',
    'business': 'Business Studies',
    'bus': 'Business Studies',
    'agriculture': 'Agriculture',
    'agric': 'Agriculture',
    'computer studies': 'Computer Studies',
    'computer': 'Computer Studies',
    'comp': 'Computer Studies'
  };
  
  if (subjectMap[lowerName]) {
    return subjectMap[lowerName];
  }
  
  for (const [key, value] of Object.entries(subjectMap)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }
  
  return subjectName
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// ========== UPDATED PARSING FUNCTIONS ==========

const parseResultsCSV = async (file) => {
  const text = await file.text();
  
  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
          .map((row, index) => {
            try {
              const admissionNumber = row.admissionNumber || row.admissionnumber || 
                                    Object.values(row).find(val => /^3[0-5]\d{2}$/.test(String(val))) || '';
              const form = row.form || '';
              const term = row.term || '';
              const academicYear = row.academicYear || row.academicyear || '';
              
              if (!admissionNumber || !form || !term || !academicYear) {
                return null;
              }
              
              const subjects = [];
              const processedSubjects = new Set();
              
              for (const [columnName, value] of Object.entries(row)) {
                const columnStr = String(columnName).trim();
                
                if (columnStr.endsWith('_Score') || columnStr.toLowerCase().endsWith(' score')) {
                  let subjectName = columnStr.replace(/_Score$/i, '').replace(/ score$/i, '').trim();
                  
                  if (processedSubjects.has(subjectName.toLowerCase())) {
                    continue;
                  }
                  
                  const score = parseScore(value);
                  if (score === null || score < 0 || score > 100) {
                    continue;
                  }
                  
                  const grade = row[`${subjectName}_Grade`] || 
                               row[`${subjectName} Grade`] || 
                               calculateGrade(score);
                  
                  const points = row[`${subjectName}_Points`] ? 
                                parseFloat(row[`${subjectName}_Points`]) :
                                row[`${subjectName} Points`] ?
                                parseFloat(row[`${subjectName} Points`]) :
                                calculatePoints(score);
                  
                  const comment = row[`${subjectName}_Comment`] || 
                                 row[`${subjectName} Comment`] || 
                                 '';
                  
                  const normalizedSubject = normalizeSubjectName(subjectName);
                  
                  subjects.push({
                    subject: normalizedSubject,
                    score: score,
                    grade: String(grade).trim(),
                    points: typeof points === 'number' ? points : (parseFloat(points) || 0),
                    comment: String(comment).trim()
                  });
                  
                  processedSubjects.add(subjectName.toLowerCase());
                }
              }
              
              for (const [columnName, value] of Object.entries(row)) {
                const columnStr = String(columnName).trim();
                const lowerCol = columnStr.toLowerCase();
                
                if (lowerCol.includes('admission') || lowerCol.includes('form') || 
                    lowerCol.includes('term') || lowerCol.includes('year') ||
                    lowerCol.includes('total') || lowerCol.includes('average') ||
                    lowerCol.includes('grade') || lowerCol.includes('points') ||
                    lowerCol.includes('comment') || lowerCol.includes('position') ||
                    lowerCol.includes('stream') || lowerCol.includes('exam') ||
                    lowerCol.includes('status') || lowerCol.includes('date') ||
                    lowerCol.includes('remark')) {
                  continue;
                }
                
                const score = parseScore(value);
                if (score !== null && score >= 0 && score <= 100) {
                  const normalizedCol = normalizeSubjectName(columnStr);
                  if (!processedSubjects.has(normalizedCol.toLowerCase())) {
                    subjects.push({
                      subject: normalizedCol,
                      score: score,
                      grade: calculateGrade(score),
                      points: calculatePoints(score),
                      comment: ''
                    });
                    
                    processedSubjects.add(normalizedCol.toLowerCase());
                  }
                }
              }
              
              if (subjects.length === 0) {
                return null;
              }
              
              return {
                admissionNumber: String(admissionNumber).trim(),
                form: form.startsWith('Form ') ? form : `Form ${form}`,
                term: term.startsWith('Term ') ? term : `Term ${term}`,
                academicYear: String(academicYear).trim(),
                subjects
              };
            } catch (error) {
              return null;
            }
          })
          .filter(item => item !== null);
        
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const parseResultsExcel = async (file) => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    const data = jsonData
      .map((row, index) => {
        try {
          const admissionNumber = row.admissionNumber || row.admissionnumber || 
                                Object.values(row).find(val => /^3[0-5]\d{2}$/.test(String(val))) || '';
          const form = row.form || '';
          const term = row.term || '';
          const academicYear = row.academicYear || row.academicyear || '';
          
          if (!admissionNumber || !form || !term || !academicYear) {
            return null;
          }
          
          const subjects = [];
          const processedSubjects = new Set();
          
          for (const [columnName, value] of Object.entries(row)) {
            const columnStr = String(columnName).trim();
            
            if (columnStr.endsWith('_Score') || columnStr.toLowerCase().endsWith(' score')) {
              let subjectName = columnStr.replace(/_Score$/i, '').replace(/ score$/i, '').trim();
              
              if (processedSubjects.has(subjectName.toLowerCase())) {
                continue;
              }
              
              const score = parseScore(value);
              if (score === null || score < 0 || score > 100) {
                continue;
              }
              
              const grade = row[`${subjectName}_Grade`] || 
                           row[`${subjectName} Grade`] || 
                           calculateGrade(score);
              
              const points = row[`${subjectName}_Points`] ? 
                            parseFloat(row[`${subjectName}_Points`]) :
                            row[`${subjectName} Points`] ?
                            parseFloat(row[`${subjectName} Points`]) :
                            calculatePoints(score);
              
              const comment = row[`${subjectName}_Comment`] || 
                             row[`${subjectName} Comment`] || 
                             '';
              
              const normalizedSubject = normalizeSubjectName(subjectName);
              
              subjects.push({
                subject: normalizedSubject,
                score: score,
                grade: String(grade).trim(),
                points: typeof points === 'number' ? points : (parseFloat(points) || 0),
                comment: String(comment).trim()
              });
              
              processedSubjects.add(subjectName.toLowerCase());
            }
          }
          
          for (const [columnName, value] of Object.entries(row)) {
            const columnStr = String(columnName).trim();
            const lowerCol = columnStr.toLowerCase();
            
            if (lowerCol.includes('admission') || lowerCol.includes('form') || 
                lowerCol.includes('term') || lowerCol.includes('year') ||
                lowerCol.includes('total') || lowerCol.includes('average') ||
                lowerCol.includes('grade') || lowerCol.includes('points') ||
                lowerCol.includes('comment') || lowerCol.includes('position') ||
                lowerCol.includes('stream') || lowerCol.includes('exam') ||
                lowerCol.includes('status') || lowerCol.includes('date') ||
                lowerCol.includes('remark')) {
              continue;
            }
            
            const score = parseScore(value);
            if (score !== null && score >= 0 && score <= 100) {
              const normalizedCol = normalizeSubjectName(columnStr);
              if (!processedSubjects.has(normalizedCol.toLowerCase())) {
                subjects.push({
                  subject: normalizedCol,
                  score: score,
                  grade: calculateGrade(score),
                  points: calculatePoints(score),
                  comment: ''
                });
                
                processedSubjects.add(normalizedCol.toLowerCase());
              }
            }
          }
          
          if (subjects.length === 0) {
            return null;
          }
          
          return {
            admissionNumber: String(admissionNumber).trim(),
            form: form.startsWith('Form ') ? form : `Form ${form}`,
            term: term.startsWith('Term ') ? term : `Term ${term}`,
            academicYear: String(academicYear).trim(),
            subjects
          };
        } catch (error) {
          return null;
        }
      })
      .filter(item => item !== null);
    
    return data;
    
  } catch (error) {
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== POST ENDPOINT - UPLOAD RESULTS ==========

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const term = formData.get('term') || '';
    const academicYear = formData.get('academicYear') || '';
    const uploadedBy = formData.get('uploadedBy') || 'System';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!term || !academicYear) {
      return NextResponse.json(
        { success: false, error: 'Term and academic year are required' },
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
    
    const normalizedTerm = normalizeTerm(term);
    const normalizedAcademicYear = normalizeAcademicYear(academicYear);
    
    const batchId = `RESULT_BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const uploadBatch = await prisma.resultUpload.create({
      data: {
        id: batchId,
        fileName: file.name,
        fileType: fileExtension,
        uploadedBy,
        term: normalizedTerm,
        academicYear: normalizedAcademicYear,
        status: 'processing'
      }
    });
    
    try {
      let rawData = [];
      
      if (fileExtension === 'csv') {
        rawData = await parseResultsCSV(file);
      } else {
        rawData = await parseResultsExcel(file);
      }
      
      if (rawData.length === 0) {
        throw new Error(`No valid result data found in file. Parsed ${rawData.length} records. Please check file format.`);
      }
      
      const stats = {
        totalRows: rawData.length,
        validRows: 0,
        skippedRows: 0,
        errorRows: 0,
        errors: []
      };
      
      for (const [index, record] of rawData.entries()) {
        try {
          if (!record.admissionNumber) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: Missing admission number`);
            continue;
          }
          
          if (!record.form) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: Missing form`);
            continue;
          }
          
          if (!record.subjects || record.subjects.length === 0) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: No subject scores found`);
            continue;
          }
          
          const student = await prisma.databaseStudent.findUnique({
            where: { admissionNumber: record.admissionNumber }
          });
          
          if (!student) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: Student ${record.admissionNumber} not found in database`);
            continue;
          }
          
          const cleanSubjects = record.subjects
            .map(subject => ({
              subject: subject.subject,
              score: Math.max(0, Math.min(100, subject.score || 0)),
              grade: subject.grade || calculateGrade(subject.score || 0),
              points: subject.points || calculatePoints(subject.score || 0),
              comment: subject.comment || ''
            }))
            .filter(subject => 
              subject.subject && 
              !subject.subject.toLowerCase().includes('admission') &&
              !subject.subject.toLowerCase().includes('total') &&
              !subject.subject.toLowerCase().includes('average') &&
              !subject.subject.toLowerCase().includes('position') &&
              !subject.subject.toLowerCase().includes('date')
            );
          
          if (cleanSubjects.length === 0) {
            stats.skippedRows++;
            stats.errors.push(`Row ${index + 2}: No valid subjects after cleaning`);
            continue;
          }
          
          const existingResult = await prisma.studentResult.findFirst({
            where: {
              admissionNumber: record.admissionNumber,
              term: normalizedTerm,
              academicYear: normalizedAcademicYear
            }
          });
          
          if (existingResult) {
            await prisma.studentResult.update({
              where: { id: existingResult.id },
              data: {
                subjects: cleanSubjects,
                updatedAt: new Date(),
                uploadBatchId: batchId
              }
            });
          } else {
            await prisma.studentResult.create({
              data: {
                admissionNumber: record.admissionNumber,
                form: record.form,
                term: normalizedTerm,
                academicYear: normalizedAcademicYear,
                subjects: cleanSubjects,
                uploadBatchId: batchId
              }
            });
          }
          
          stats.validRows++;
          
        } catch (error) {
          stats.errorRows++;
          const errorMsg = `Row ${index + 2}: ${error.message}`;
          stats.errors.push(errorMsg);
        }
      }
      
      await prisma.resultUpload.update({
        where: { id: batchId },
        data: {
          status: stats.validRows > 0 ? 'completed' : 'failed',
          processedDate: new Date(),
          totalRows: stats.totalRows,
          validRows: stats.validRows,
          skippedRows: stats.skippedRows,
          errorRows: stats.errorRows,
          errorLog: stats.errors.length > 0 ? stats.errors.slice(0, 50) : null
        }
      });
      
      const response = {
        success: stats.validRows > 0,
        message: stats.validRows > 0 
          ? `Successfully processed ${stats.validRows} out of ${stats.totalRows} records`
          : `Failed to process any records.`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          term: normalizedTerm,
          academicYear: normalizedAcademicYear,
          status: stats.validRows > 0 ? 'completed' : 'failed'
        },
        statistics: {
          total: stats.totalRows,
          valid: stats.validRows,
          skipped: stats.skippedRows,
          errors: stats.errorRows
        },
        errors: stats.errors.slice(0, 10)
      };
      
      if (rawData.length > 0) {
        response.sample = {
          admissionNumber: rawData[0].admissionNumber,
          form: rawData[0].form,
          subjectsCount: rawData[0].subjects?.length || 0,
          subjectsSample: rawData[0].subjects?.slice(0, 3) || []
        };
      }
      
      return NextResponse.json(response);
      
    } catch (error) {
      await prisma.resultUpload.update({
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
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Results upload failed',
        suggestion: 'Please ensure your file has columns for admission number (3000-3500), form, and subject scores. Sample format: admissionNumber, form, English_Score, English_Grade, etc.'
      },
      { status: 500 }
    );
  }
}

// ========== GET ENDPOINT ==========
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const form = url.searchParams.get('form');
    const term = url.searchParams.get('term');
    const academicYear = url.searchParams.get('academicYear');
    const subject = url.searchParams.get('subject');
    const minScore = url.searchParams.get('minScore');
    const maxScore = url.searchParams.get('maxScore');
    const sortBy = url.searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const includeStudent = url.searchParams.get('includeStudent') === 'true';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    if (action === 'uploads') {
      const uploads = await prisma.resultUpload.findMany({
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
          totalRows: true,
          validRows: true,
          skippedRows: true,
          errorRows: true,
          errorLog: true
        }
      });

      const total = await prisma.resultUpload.count();

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
      // Get total results count
      const totalResults = await prisma.studentResult.count();
      
      // Get all results for calculations
      const allResults = await prisma.studentResult.findMany({
        select: {
          id: true,
          form: true,
          term: true,
          subjects: true,
          admissionNumber: true
        }
      });

      let totalScore = 0;
      let resultCount = 0;
      let topScore = 0;
      
      // Initialize with all forms (even if zero)
      const formDistribution = {
        'Form 1': 0,
        'Form 2': 0,
        'Form 3': 0,
        'Form 4': 0
      };
      
      const termDistribution = {
        'Term 1': 0,
        'Term 2': 0,
        'Term 3': 0
      };
      
      const gradeDistribution = {
        'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0,
        'C+': 0, 'C': 0, 'C-': 0, 'D+': 0, 'D': 0, 'E': 0
      };
      
      const subjectPerformance = {};
      const uniqueStudents = new Set();
      
      // Process each result
      allResults.forEach(result => {
        // Track unique students
        uniqueStudents.add(result.admissionNumber);
        
        // Update form distribution
        if (result.form) {
          const formKey = result.form.includes('Form ') ? result.form : `Form ${result.form}`;
          if (formDistribution[formKey] !== undefined) {
            formDistribution[formKey] = (formDistribution[formKey] || 0) + 1;
          }
        }
        
        // Update term distribution
        if (result.term) {
          const termKey = result.term.includes('Term ') ? result.term : `Term ${result.term}`;
          if (termDistribution[termKey] !== undefined) {
            termDistribution[termKey] = (termDistribution[termKey] || 0) + 1;
          }
        }
        
        // Parse subjects
        let subjects = [];
        try {
          if (typeof result.subjects === 'string') {
            subjects = JSON.parse(result.subjects);
          } else if (Array.isArray(result.subjects)) {
            subjects = result.subjects;
          }
        } catch (e) {
          console.error('Error parsing subjects:', e);
          return; // Skip this result if subjects can't be parsed
        }
        
        // Calculate average score for this result
        if (subjects.length > 0) {
          const resultTotal = subjects.reduce((sum, s) => sum + (parseFloat(s.score) || 0), 0);
          const avg = resultTotal / subjects.length;
          
          totalScore += avg;
          resultCount++;
          
          if (avg > topScore) topScore = avg;
          
          // Process each subject
          subjects.forEach(subject => {
            const score = parseFloat(subject.score) || 0;
            const subjectName = subject.subject || 'Unknown';
            const grade = subject.grade || calculateGrade(score);
            
            // Update subject performance (average score per subject)
            if (!subjectPerformance[subjectName]) {
              subjectPerformance[subjectName] = {
                totalScore: 0,
                count: 0,
                average: 0
              };
            }
            subjectPerformance[subjectName].totalScore += score;
            subjectPerformance[subjectName].count++;
            subjectPerformance[subjectName].average = 
              subjectPerformance[subjectName].totalScore / subjectPerformance[subjectName].count;
            
            // Update grade distribution
            if (gradeDistribution[grade] !== undefined) {
              gradeDistribution[grade]++;
            } else {
              // For any unexpected grades, add them
              gradeDistribution[grade] = 1;
            }
          });
        }
      });

      // Calculate overall averages
      const averageScore = resultCount > 0 ? totalScore / resultCount : 0;
      
      // Format subject performance for response
      const formattedSubjectPerformance = {};
      Object.keys(subjectPerformance).forEach(subject => {
        formattedSubjectPerformance[subject] = {
          averageScore: parseFloat(subjectPerformance[subject].average.toFixed(2)),
          totalResults: subjectPerformance[subject].count
        };
      });

      return NextResponse.json({
        success: true,
        stats: {
          totalResults,
          totalStudents: uniqueStudents.size,
          averageScore: parseFloat(averageScore.toFixed(2)),
          topScore: parseFloat(topScore.toFixed(2)),
          formDistribution,
          termDistribution,
          gradeDistribution,
          subjectPerformance: formattedSubjectPerformance,
          updatedAt: new Date().toISOString()
        }
      });
    }

    if (action === 'student-report' && admissionNumber) {
      const results = await prisma.studentResult.findMany({
        where: { admissionNumber },
        orderBy: [{ academicYear: 'desc' }, { term: 'desc' }]
      });

      const parsedResults = results.map(result => {
        let subjects = [];
        try {
          if (typeof result.subjects === 'string') {
            subjects = JSON.parse(result.subjects);
          } else if (Array.isArray(result.subjects)) {
            subjects = result.subjects;
          }
        } catch (e) {
          subjects = [];
        }

        const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
        const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;

        return {
          ...result,
          subjects,
          totalScore,
          averageScore: parseFloat(averageScore.toFixed(2)),
          overallGrade: calculateGrade(averageScore)
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          admissionNumber,
          results: parsedResults,
          summary: {
            totalResults: results.length,
            latestResult: parsedResults[0] || null
          }
        }
      });
    }

    if (action === 'student-results' && admissionNumber) {
      const student = await prisma.databaseStudent.findUnique({
        where: { admissionNumber },
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          admissionNumber: true,
          form: true,
          stream: true,
          gender: true,
          dateOfBirth: true,
          email: true,
          parentPhone: true,
          address: true,
          status: true
        }
      });

      if (!student) {
        return NextResponse.json({
          success: false,
          error: 'Student not found'
        }, { status: 404 });
      }

      const results = await prisma.studentResult.findMany({
        where: { admissionNumber },
        orderBy: [{ academicYear: 'desc' }, { term: 'desc' }]
      });

      const parsedResults = results.map(result => {
        let subjects = [];
        try {
          if (typeof result.subjects === 'string') {
            subjects = JSON.parse(result.subjects);
          } else if (Array.isArray(result.subjects)) {
            subjects = result.subjects;
          }
        } catch (e) {
          subjects = [];
        }

        const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
        const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;

        return {
          ...result,
          subjects,
          totalScore,
          averageScore: parseFloat(averageScore.toFixed(2)),
          overallGrade: calculateGrade(averageScore)
        };
      });

      return NextResponse.json({
        success: true,
        student,
        results: parsedResults
      });
    }

    const where = {};

    if (admissionNumber) where.admissionNumber = admissionNumber;
    if (form) where.form = form;
    if (term) where.term = term;
    if (academicYear) where.academicYear = academicYear;

    const orderBy = {};
    if (sortBy === 'averageScore') {
      orderBy.updatedAt = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const allMatchingResults = await prisma.studentResult.findMany({
      where,
      orderBy,
      include: includeStudent ? {
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            admissionNumber: true,
            form: true,
            stream: true,
            email: true
          }
        }
      } : undefined
    });

    const allParsedResults = allMatchingResults.map(result => {
      let subjects = [];
      try {
        if (typeof result.subjects === 'string') {
          subjects = JSON.parse(result.subjects);
        } else if (Array.isArray(result.subjects)) {
          subjects = result.subjects;
        }
      } catch (e) {
        subjects = [];
      }

      const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
      const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;

      return {
        ...result,
        subjects,
        totalScore,
        averageScore: parseFloat(averageScore.toFixed(2)),
        overallGrade: calculateGrade(averageScore),
        student: result.student || null
      };
    });

    let filteredResults = allParsedResults;
    
    if (subject) {
      filteredResults = filteredResults.filter(result => {
        return result.subjects.some(s => 
          s.subject.toLowerCase().includes(subject.toLowerCase())
        );
      });
    }

    if (minScore) {
      const min = parseFloat(minScore);
      filteredResults = filteredResults.filter(result => 
        result.averageScore >= min
      );
    }

    if (maxScore) {
      const max = parseFloat(maxScore);
      filteredResults = filteredResults.filter(result => 
        result.averageScore <= max
      );
    }

    const totalFiltered = filteredResults.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        results: paginatedResults,
        pagination: {
          page,
          limit,
          total: totalFiltered,
          pages: Math.ceil(totalFiltered / limit)
        }
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch results data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// ========== PUT ENDPOINT ==========

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, subjects, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Result ID is required' },
        { status: 400 }
      );
    }
    
    if (subjects) {
      if (!Array.isArray(subjects)) {
        return NextResponse.json(
          { success: false, error: 'Subjects must be an array' },
          { status: 400 }
        );
      }
      
      for (const subject of subjects) {
        if (subject.score < 0 || subject.score > 100) {
          return NextResponse.json(
            { success: false, error: `Score for ${subject.subject} must be between 0-100` },
            { status: 400 }
          );
        }
      }
    }
    
    const updatedResult = await prisma.studentResult.update({
      where: { id },
      data: {
        ...(subjects && { subjects }),
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
      message: 'Result updated successfully',
      data: updatedResult
    });
    
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Result not found' },
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

// ========== DELETE ENDPOINT ==========
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const resultId = url.searchParams.get('resultId');
    
    if (batchId) {
      const batch = await prisma.resultUpload.findUnique({
        where: { id: batchId },
        select: {
          fileName: true,
          validRows: true
        }
      });
      
      if (!batch) {
        return NextResponse.json(
          { success: false, error: 'Upload batch not found' },
          { status: 404 }
        );
      }
      
      await prisma.resultUpload.delete({
        where: { id: batchId }
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted upload batch "${batch.fileName}" and ${batch.validRows || 0} result records`
      });
    }
    
    if (resultId) {
      const result = await prisma.studentResult.findUnique({
        where: { id: resultId }
      });
      
      if (!result) {
        return NextResponse.json(
          { success: false, error: 'Result not found' },
          { status: 404 }
        );
      }
      
      await prisma.studentResult.delete({
        where: { id: resultId }
      });
      
      return NextResponse.json({
        success: true,
        message: `Deleted result for admission ${result.admissionNumber}`
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Provide batchId or resultId' },
      { status: 400 }
    );
    
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2028' || error.code === 'P2034') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database operation timed out. Please try again or delete in smaller batches.',
          suggestion: 'Try deleting individual results instead of the entire batch.'
        },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Delete operation failed',
        code: error.code
      },
      { status: 500 }
    );
  }
}