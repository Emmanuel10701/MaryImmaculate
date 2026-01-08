import { NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from '../../../libs/prisma';

// ========== HELPER FUNCTIONS ==========

const parseScore = (value) => {
  if (!value && value !== 0) return null;
  
  const str = String(value).trim();
  const cleaned = str.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? null : Math.round(parsed * 100) / 100;
};

const calculateGrade = (score, subjectName = '') => {
  if (score === null || score === undefined) return 'N/A';
  
  const isMathematics = subjectName.toLowerCase().includes('mathematics');
  
  if (isMathematics) {
    if (score >= 75) return 'A';
    if (score >= 70) return 'A-';
    if (score >= 65) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 55) return 'B-';
    if (score >= 50) return 'C+';
    if (score >= 45) return 'C';
    if (score >= 40) return 'C-';
    if (score >= 35) return 'D+';
    if (score >= 30) return 'D';
    return 'E';
  } else {
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
  }
};

const generateSubjectComment = (score, subjectName = '') => {
  if (score === null || score === undefined) return '';
  
  const grade = calculateGrade(score, subjectName);
  
  const commentTemplates = {
    'A': {
      excellent: [
        "Outstanding performance! Demonstrates exceptional mastery of concepts. Keep setting the bar high!",
        "Exceptional work! Shows deep understanding and excellent application skills. Maintain this excellence!",
        "Brilliant performance! Your dedication and hard work are clearly evident. Continue to excel!"
      ],
      standard: [
        "Excellent performance! Shows strong command of the subject. Keep up the great work!",
        "Very impressive work! Demonstrates thorough understanding of concepts. Keep it up!",
        "Superb performance! Consistent effort and understanding are evident. Well done!"
      ]
    },
    'A-': [
      "Very good performance! Shows clear understanding and consistent effort. Aim for even higher!",
      "Strong work! Demonstrates good grasp of concepts with minor areas for improvement.",
      "Impressive performance! Maintain this level and strive for perfection in next assessments."
    ],
    'B+': [
      "Good performance! Understanding is evident with room for growth in application.",
      "Solid work! Shows competence in most areas. Focus on strengthening weaker topics.",
      "Promising performance! With continued effort, you can achieve even better results."
    ],
    'B': [
      "Satisfactory performance. Understands basic concepts but needs to work on depth.",
      "Adequate performance. Shows potential but requires more consistent practice.",
      "Fair understanding demonstrated. Focus on regular revision to improve."
    ],
    'B-': [
      "Fair performance. Basic understanding present but application needs improvement.",
      "Average performance. Would benefit from additional practice and attention to detail.",
      "Shows some understanding. Needs to work on consistency and thoroughness."
    ],
    'C+': [
      "Below average performance. Requires more focused study and regular practice.",
      "Needs improvement. Basic concepts need reinforcement through additional practice.",
      "Shows partial understanding. Would benefit from seeking extra help or resources."
    ],
    'C': [
      "Poor performance. Fundamental concepts need serious attention and review.",
      "Below standard. Requires significant improvement through dedicated study.",
      "Struggling with core concepts. Seek teacher guidance and additional support."
    ],
    'C-': [
      "Very poor performance. Immediate intervention and remedial work needed.",
      "Significant improvement required. Focus on foundational concepts first.",
      "Serious attention needed. Consider extra classes or tutoring to catch up."
    ],
    'D+': [
      "Minimal understanding demonstrated. Requires urgent attention and support.",
      "Below expectations. Needs comprehensive review of all subject materials.",
      "Struggling significantly. Must dedicate substantial time to improve."
    ],
    'D': [
      "Marginal performance. Lacks basic understanding of core concepts.",
      "Very weak performance. Requires complete revision from basics.",
      "Failing to grasp fundamental concepts. Immediate remedial action needed."
    ],
    'E': [
      "Failed to meet minimum requirements. Requires complete relearning of subject.",
      "Insufficient understanding demonstrated. Needs to restart learning from basics.",
      "Performance below acceptable standards. Mandatory remedial work required."
    ]
  };

  let selectedComment = '';
  
  if (grade === 'A') {
    if (score >= 90) {
      const excellentComments = commentTemplates.A.excellent;
      selectedComment = excellentComments[Math.floor(Math.random() * excellentComments.length)];
    } else {
      const standardComments = commentTemplates.A.standard;
      selectedComment = standardComments[Math.floor(Math.random() * standardComments.length)];
    }
  } else {
    const gradeComments = commentTemplates[grade];
    if (gradeComments && Array.isArray(gradeComments)) {
      selectedComment = gradeComments[Math.floor(Math.random() * gradeComments.length)];
    } else {
      selectedComment = `Performance graded as ${grade}. ${score >= 50 ? 'Keep working hard!' : 'Needs significant improvement.'}`;
    }
  }

  return selectedComment;
};

const calculatePoints = (score, subjectName = '') => {
  if (score === null) return null;
  
  const grade = calculateGrade(score, subjectName);
  
  const subjectLower = subjectName.toLowerCase().trim();
  const optionalSubjects = ['agriculture', 'business studies', 'home science', 'computer studies', 'german', 'french', 'art', 'music', 'drama'];
  const isOptional = optionalSubjects.some(sub => subjectLower.includes(sub));
  const subjectType = isOptional ? 'optional' : 'main';
  
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
    'eng': 'English',
    'kiswahili': 'Kiswahili',
    'kiswa': 'Kiswahili',
    'kisw': 'Kiswahili',
    'mathematics': 'Mathematics',
    'maths': 'Mathematics',
    'math': 'Mathematics',
    'biology': 'Biology',
    'bio': 'Biology',
    'chemistry': 'Chemistry',
    'chem': 'Chemistry',
    'physics': 'Physics',
    'phy': 'Physics',
    'history': 'History',
    'hist': 'History',
    'geography': 'Geography',
    'geo': 'Geography',
    'cre': 'CRE',
    'christian religious education': 'CRE',
    'ire': 'IRE',
    'islamic religious education': 'IRE',
    'hre': 'HRE',
    'hindu religious education': 'HRE',
    'business studies': 'Business Studies',
    'business': 'Business Studies',
    'bus': 'Business Studies',
    'agriculture': 'Agriculture',
    'agric': 'Agriculture',
    'agri': 'Agriculture',
    'home science': 'Home Science',
    'home science': 'Home Science',
    'computer studies': 'Computer Studies',
    'computer': 'Computer Studies',
    'comp': 'Computer Studies',
    'ict': 'Computer Studies',
    'german': 'German',
    'french': 'French',
    'art': 'Art and Design',
    'music': 'Music',
    'physical education': 'Physical Education',
    'pe': 'Physical Education'
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

// ========== BUILD WHERE CLAUSE ==========
const buildWhereClause = (params) => {
  const { admissionNumber, form, term, academicYear, search } = params;
  const where = {};
  
  if (admissionNumber) where.admissionNumber = admissionNumber;
  if (form) where.form = form;
  if (term) where.term = term;
  if (academicYear) where.academicYear = academicYear;
  
  if (search && search.trim()) {
    const searchTerm = search.toLowerCase();
    where.OR = [
      { admissionNumber: { contains: searchTerm } }
    ];
  }
  
  return where;
};

// ========== CALCULATE STATISTICS ==========
const calculateStatistics = async (whereClause = {}) => {
  try {
    // Get all results for calculations
    const allResults = await prisma.studentResult.findMany({
      where: whereClause,
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
        return;
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
          const grade = subject.grade || calculateGrade(score, subjectName);
          
          // Update subject performance
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

    const stats = {
      totalResults: allResults.length,
      totalStudents: uniqueStudents.size,
      averageScore: parseFloat(averageScore.toFixed(2)),
      topScore: parseFloat(topScore.toFixed(2)),
      formDistribution,
      termDistribution,
      gradeDistribution,
      subjectPerformance: formattedSubjectPerformance,
      updatedAt: new Date()
    };

    return {
      stats,
      validation: {
        isValid: true,
        totalResults: allResults.length,
        uniqueStudents: uniqueStudents.size,
        calculatedScore: parseFloat(averageScore.toFixed(2))
      }
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    throw error;
  }
};

// ========== UPDATE CACHED STATS ==========
const updateCachedStats = async (stats) => {
  try {
    await prisma.resultsStats.upsert({
      where: { id: 'global_stats' },
      update: {
        totalResults: stats.totalResults,
        totalStudents: stats.totalStudents,
        averageScore: stats.averageScore,
        topScore: stats.topScore,
        formDistribution: stats.formDistribution,
        termDistribution: stats.termDistribution,
        gradeDistribution: stats.gradeDistribution,
        subjectPerformance: stats.subjectPerformance,
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

const checkDuplicateResults = async (results, targetForm = null, term = null, academicYear = null) => {
  const admissionNumbers = results.map(r => r.admissionNumber);
  
  const whereClause = {
    admissionNumber: { in: admissionNumbers }
  };
  
  if (targetForm) whereClause.form = targetForm;
  if (term) whereClause.term = term;
  if (academicYear) whereClause.academicYear = academicYear;
  
  const existingResults = await prisma.studentResult.findMany({
    where: whereClause,
    select: {
      admissionNumber: true,
      form: true,
      term: true,
      academicYear: true
    }
  });
  
  const duplicates = results
    .map((result, index) => {
      const existing = existingResults.find(r => 
        r.admissionNumber === result.admissionNumber &&
        r.form === (targetForm || result.form) &&
        r.term === (term || result.term) &&
        r.academicYear === (academicYear || result.academicYear)
      );
      if (existing) {
        return {
          row: index + 2,
          admissionNumber: result.admissionNumber,
          form: existing.form,
          term: existing.term,
          academicYear: existing.academicYear
        };
      }
      return null;
    })
    .filter(dup => dup !== null);
  
  return duplicates;
};

// Compare results for changes
const compareResults = (oldSubjects, newSubjects) => {
  if (!Array.isArray(oldSubjects) || !Array.isArray(newSubjects)) {
    return { hasChanges: true, changedSubjects: [] };
  }
  
  const changedSubjects = [];
  const oldSubjectsMap = new Map();
  const newSubjectsMap = new Map();
  
  // Create maps for comparison
  oldSubjects.forEach(subject => {
    const key = subject.subject?.toLowerCase() || '';
    oldSubjectsMap.set(key, subject);
  });
  
  newSubjects.forEach(subject => {
    const key = subject.subject?.toLowerCase() || '';
    newSubjectsMap.set(key, subject);
  });
  
  // Check for changed scores
  for (const [subjectKey, oldSubject] of oldSubjectsMap.entries()) {
    const newSubject = newSubjectsMap.get(subjectKey);
    
    if (newSubject) {
      const oldScore = parseFloat(oldSubject.score) || 0;
      const newScore = parseFloat(newSubject.score) || 0;
      
      if (Math.abs(oldScore - newScore) > 0.01) {
        changedSubjects.push({
          subject: subjectKey,
          oldScore,
          newScore,
          change: newScore - oldScore
        });
      }
    } else {
      // Subject removed from new results
      changedSubjects.push({
        subject: subjectKey,
        oldScore: parseFloat(oldSubject.score) || 0,
        newScore: 0,
        change: 'removed'
      });
    }
  }
  
  // Check for new subjects added
  for (const [subjectKey, newSubject] of newSubjectsMap.entries()) {
    if (!oldSubjectsMap.has(subjectKey)) {
      changedSubjects.push({
        subject: subjectKey,
        oldScore: 0,
        newScore: parseFloat(newSubject.score) || 0,
        change: 'added'
      });
    }
  }
  
  return {
    hasChanges: changedSubjects.length > 0,
    changedSubjects
  };
};

// Validate result data
const validateResult = (result, index) => {
  const errors = [];
  
  // Admission number
  if (!result.admissionNumber) {
    errors.push(`Row ${index + 2}: Admission number is required`);
  } else if (!/^\d{4,10}$/.test(result.admissionNumber)) {
    errors.push(`Row ${index + 2}: Admission number must be 4-10 digits (got: ${result.admissionNumber})`);
  }
  
  // Form validation
  if (!result.form) {
    errors.push(`Row ${index + 2}: Form is required`);
  } else {
    const formValue = result.form.trim();
    const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
    if (!validForms.includes(formValue)) {
      errors.push(`Row ${index + 2}: Form must be one of: ${validForms.join(', ')} (got: ${formValue})`);
    }
  }
  
  // Term validation
  if (!result.term) {
    errors.push(`Row ${index + 2}: Term is required`);
  } else {
    const termValue = normalizeTerm(result.term);
    const validTerms = ['Term 1', 'Term 2', 'Term 3'];
    if (!validTerms.includes(termValue)) {
      errors.push(`Row ${index + 2}: Term must be one of: ${validTerms.join(', ')} (got: ${termValue})`);
    }
  }
  
  // Academic year validation
  if (!result.academicYear) {
    errors.push(`Row ${index + 2}: Academic year is required`);
  }
  
  // Subjects validation
  if (!result.subjects || !Array.isArray(result.subjects) || result.subjects.length === 0) {
    errors.push(`Row ${index + 2}: At least one subject score is required`);
  } else {
    result.subjects.forEach((subject, subIndex) => {
      if (!subject.subject) {
        errors.push(`Row ${index + 2}: Subject name is required for subject ${subIndex + 1}`);
      }
      if (subject.score === null || subject.score === undefined) {
        errors.push(`Row ${index + 2}: Score is required for ${subject.subject || `subject ${subIndex + 1}`}`);
      } else if (subject.score < 0 || subject.score > 100) {
        errors.push(`Row ${index + 2}: Score for ${subject.subject} must be between 0 and 100 (got: ${subject.score})`);
      }
    });
  }
  
  return { isValid: errors.length === 0, errors };
};

// ========== PROCESSING FUNCTIONS ==========
const processNewResultsUpload = async (results, uploadBatchId, selectedForms, duplicateAction = 'skip') => {
  const stats = {
    totalRows: results.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    newRecords: 0,
    updatedRecords: 0,
    duplicateRecords: 0,
    errors: [],
    warnings: []
  };
  
  // Filter results to only include selected forms
  const filteredResults = results.filter(result => 
    selectedForms.includes(result.form)
  );
  
  if (filteredResults.length === 0) {
    throw new Error(`No results found for selected forms: ${selectedForms.join(', ')}`);
  }
  
  // Check if students exist
  const admissionNumbers = filteredResults.map(r => r.admissionNumber);
  const existingStudents = await prisma.databaseStudent.findMany({
    where: {
      admissionNumber: { in: admissionNumbers },
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
  
  // Check for existing results
  const existingResults = await prisma.studentResult.findMany({
    where: {
      admissionNumber: { in: admissionNumbers }
    },
    select: {
      admissionNumber: true,
      form: true,
      term: true,
      academicYear: true,
      id: true,
      subjects: true
    }
  });
  
  const existingResultMap = new Map();
  existingResults.forEach(result => {
    const key = `${result.admissionNumber}_${result.form}_${result.term}_${result.academicYear}`;
    existingResultMap.set(key, result);
  });
  
  const seenAdmissionNumbers = new Set();
  const resultsToCreate = [];
  const resultsToUpdate = [];
  
  for (const [index, result] of filteredResults.entries()) {
    const validation = validateResult(result, index);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }
    
    const admissionNumber = result.admissionNumber;
    
    // Check duplicates within the file
    const resultKey = `${admissionNumber}_${result.form}_${result.term}_${result.academicYear}`;
    if (seenAdmissionNumbers.has(resultKey)) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Duplicate result combination in file: ${admissionNumber} - ${result.form} ${result.term} ${result.academicYear}`);
      continue;
    }
    seenAdmissionNumbers.add(resultKey);
    
    // Check if student exists
    const student = studentMap.get(admissionNumber);
    if (!student) {
      stats.errorRows++;
      stats.errors.push(`Row ${index + 2}: Student ${admissionNumber} not found in database`);
      continue;
    }
    
    // Check if student form matches
    if (student.form !== result.form) {
      stats.errorRows++;
      stats.errors.push(`Row ${index + 2}: Student ${admissionNumber} is in ${student.form}, not ${result.form}`);
      continue;
    }
    
    // Check if result already exists
    const existingResult = existingResultMap.get(resultKey);
    
    if (existingResult) {
      if (duplicateAction === 'skip') {
        stats.duplicateRecords++;
        stats.skippedRows++;
        stats.warnings.push(`Row ${index + 2}: Skipped - result already exists for ${admissionNumber} - ${result.form} ${result.term} ${result.academicYear}`);
        continue;
      } else if (duplicateAction === 'replace') {
        // Check for actual changes
        let oldSubjects = [];
        try {
          if (typeof existingResult.subjects === 'string') {
            oldSubjects = JSON.parse(existingResult.subjects);
          } else if (Array.isArray(existingResult.subjects)) {
            oldSubjects = existingResult.subjects;
          }
        } catch (e) {
          console.error('Error parsing existing subjects:', e);
          oldSubjects = [];
        }
        
        const comparison = compareResults(oldSubjects, result.subjects);
        
        if (comparison.hasChanges) {
          resultsToUpdate.push({
            id: existingResult.id,
            data: {
              subjects: result.subjects,
              updatedAt: new Date(),
              uploadBatchId: uploadBatchId
            }
          });
          stats.updatedRecords++;
          stats.warnings.push(`Row ${index + 2}: Updated ${student.firstName} ${student.lastName}'s results. Changes: ${comparison.changedSubjects.map(c => `${c.subject}: ${c.oldScore} → ${c.newScore}`).join(', ')}`);
        } else {
          stats.duplicateRecords++;
          stats.skippedRows++;
          stats.warnings.push(`Row ${index + 2}: No changes detected for ${student.firstName} ${student.lastName}. Skipped update.`);
        }
      }
    } else {
      // New result
      resultsToCreate.push({
        admissionNumber: result.admissionNumber,
        form: result.form,
        term: normalizeTerm(result.term),
        academicYear: normalizeAcademicYear(result.academicYear),
        subjects: result.subjects,
        uploadBatchId: uploadBatchId
      });
      stats.newRecords++;
    }
    
    stats.validRows++;
  }
  
  // Execute database operations
  if (resultsToCreate.length > 0) {
    try {
      await prisma.studentResult.createMany({
        data: resultsToCreate,
        skipDuplicates: true
      });
    } catch (error) {
      console.error('Error creating results:', error);
      stats.errorRows += resultsToCreate.length;
      stats.errors.push(`Failed to create ${resultsToCreate.length} results: ${error.message}`);
    }
  }
  
  if (resultsToUpdate.length > 0) {
    for (const update of resultsToUpdate) {
      try {
        await prisma.studentResult.update({
          where: { id: update.id },
          data: update.data
        });
      } catch (error) {
        console.error('Error updating result:', error);
        stats.errorRows++;
        stats.errors.push(`Failed to update result: ${error.message}`);
      }
    }
  }
  
  return stats;
};

const processUpdateResultsUpload = async (results, uploadBatchId, targetForm, term, academicYear) => {
  const stats = {
    totalRows: results.length,
    validRows: 0,
    skippedRows: 0,
    errorRows: 0,
    newRecords: 0,
    updatedRecords: 0,
    unchangedRecords: 0,
    errors: [],
    warnings: []
  };
  
  // Filter results to only include the target form
  const filteredResults = results.filter(result => 
    result.form === targetForm
  );
  
  if (filteredResults.length === 0) {
    throw new Error(`No results found for form ${targetForm}. Make sure the form column matches the selected form.`);
  }
  
  // Check if students exist
  const admissionNumbers = filteredResults.map(r => r.admissionNumber);
  const existingStudents = await prisma.databaseStudent.findMany({
    where: {
      admissionNumber: { in: admissionNumbers },
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
  
  // Get existing results for this form/term/year
  const existingResults = await prisma.studentResult.findMany({
    where: {
      form: targetForm,
      term: normalizeTerm(term),
      academicYear: normalizeAcademicYear(academicYear)
    },
    select: {
      admissionNumber: true,
      id: true,
      subjects: true
    }
  });
  
  const existingResultMap = new Map();
  existingResults.forEach(result => {
    existingResultMap.set(result.admissionNumber, result);
  });
  
  const seenAdmissionNumbers = new Set();
  const resultsToCreate = [];
  const resultsToUpdate = [];
  
  for (const [index, result] of filteredResults.entries()) {
    const validation = validateResult(result, index);
    
    if (!validation.isValid) {
      stats.errorRows++;
      stats.errors.push(...validation.errors);
      continue;
    }
    
    const admissionNumber = result.admissionNumber;
    
    // Check duplicates within the file
    if (seenAdmissionNumbers.has(admissionNumber)) {
      stats.skippedRows++;
      stats.errors.push(`Row ${index + 2}: Duplicate admission number in file: ${admissionNumber}`);
      continue;
    }
    seenAdmissionNumbers.add(admissionNumber);
    
    // Check if student exists
    const student = studentMap.get(admissionNumber);
    if (!student) {
      stats.errorRows++;
      stats.errors.push(`Row ${index + 2}: Student ${admissionNumber} not found in database`);
      continue;
    }
    
    // Check if student form matches target form
    if (student.form !== targetForm) {
      stats.skippedRows++;
      stats.warnings.push(`Row ${index + 2}: Student ${student.firstName} ${student.lastName} (${admissionNumber}) is in ${student.form}, not ${targetForm}. Skipped.`);
      continue;
    }
    
    // Check if result already exists for this term/year
    const existingResult = existingResultMap.get(admissionNumber);
    
    if (existingResult) {
      // Check for actual changes
      let oldSubjects = [];
      try {
        if (typeof existingResult.subjects === 'string') {
          oldSubjects = JSON.parse(existingResult.subjects);
        } else if (Array.isArray(existingResult.subjects)) {
          oldSubjects = existingResult.subjects;
        }
      } catch (e) {
        console.error('Error parsing existing subjects:', e);
        oldSubjects = [];
      }
      
      const comparison = compareResults(oldSubjects, result.subjects);
      
      if (comparison.hasChanges) {
        resultsToUpdate.push({
          id: existingResult.id,
          data: {
            subjects: result.subjects,
            updatedAt: new Date(),
            uploadBatchId: uploadBatchId
          }
        });
        stats.updatedRecords++;
        stats.warnings.push(`Row ${index + 2}: Updated ${student.firstName} ${student.lastName}'s results. Changes: ${comparison.changedSubjects.map(c => `${c.subject}: ${c.oldScore} → ${c.newScore}`).join(', ')}`);
      } else {
        stats.unchangedRecords++;
        stats.skippedRows++;
        stats.warnings.push(`Row ${index + 2}: No changes detected for ${student.firstName} ${student.lastName}. Skipped update.`);
      }
    } else {
      // New result for this term/year
      resultsToCreate.push({
        admissionNumber: result.admissionNumber,
        form: targetForm,
        term: normalizeTerm(term),
        academicYear: normalizeAcademicYear(academicYear),
        subjects: result.subjects,
        uploadBatchId: uploadBatchId
      });
      stats.newRecords++;
    }
    
    stats.validRows++;
  }
  
  // Execute database operations
  if (resultsToCreate.length > 0) {
    try {
      await prisma.studentResult.createMany({
        data: resultsToCreate,
        skipDuplicates: true
      });
    } catch (error) {
      console.error('Error creating results:', error);
      stats.errorRows += resultsToCreate.length;
      stats.errors.push(`Failed to create ${resultsToCreate.length} results: ${error.message}`);
    }
  }
  
  if (resultsToUpdate.length > 0) {
    for (const update of resultsToUpdate) {
      try {
        await prisma.studentResult.update({
          where: { id: update.id },
          data: update.data
        });
      } catch (error) {
        console.error('Error updating result:', error);
        stats.errorRows++;
        stats.errors.push(`Failed to update result: ${error.message}`);
      }
    }
  }
  
  return stats;
};

// ========== PARSING FUNCTIONS ==========
const parseResultsCSV = async (file) => {
  try {
    const text = await file.text();
    
    return await new Promise((resolve, reject) => {
      parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data
            .map((row, index) => {
              try {
                const admissionNumber = row.admissionNumber || row.admissionnumber || 
                                      row.admno || row.AdmNo || row.admission || row.Admission ||
                                      Object.values(row).find(val => /^3[0-5]\d{2}$/.test(String(val))) || '';
                
                if (!admissionNumber) {
                  return null;
                }
                
                const subjects = [];
                const processedSubjects = new Set();
                
                // Extract subject scores
                for (const [columnName, value] of Object.entries(row)) {
                  const columnStr = String(columnName).trim();
                  
                  // Skip non-subject columns
                  if (columnStr.toLowerCase().includes('admission') ||
                      columnStr.toLowerCase().includes('form') ||
                      columnStr.toLowerCase().includes('stream') ||
                      columnStr.toLowerCase().includes('term') ||
                      columnStr.toLowerCase().includes('year') ||
                      columnStr.toLowerCase().includes('total') ||
                      columnStr.toLowerCase().includes('average') ||
                      columnStr.toLowerCase().includes('grade') && !columnStr.toLowerCase().includes('_grade') ||
                      columnStr.toLowerCase().includes('points') && !columnStr.toLowerCase().includes('_points') ||
                      columnStr.toLowerCase().includes('comment') && !columnStr.toLowerCase().includes('_comment') ||
                      columnStr.toLowerCase().includes('position') ||
                      columnStr.toLowerCase().includes('remark') ||
                      columnStr.toLowerCase().includes('date') ||
                      columnStr.toLowerCase().includes('status')) {
                    continue;
                  }
                  
                  // Check if this is a score column
                  if (columnStr.endsWith('_Score') || 
                      columnStr.toLowerCase().endsWith(' score') ||
                      columnStr.toLowerCase().includes('score') && !columnStr.toLowerCase().includes('total')) {
                    
                    let subjectName = columnStr.replace(/_Score$/i, '').replace(/ score$/i, '').trim();
                    
                    if (processedSubjects.has(subjectName.toLowerCase())) {
                      continue;
                    }
                    
                    const score = parseScore(value);
                    if (score === null || score < 0 || score > 100) {
                      continue;
                    }
                    
                    const normalizedSubject = normalizeSubjectName(subjectName);
                    
                    // Auto-generate grade, points, and comment
                    const grade = calculateGrade(score, normalizedSubject);
                    const points = calculatePoints(score, normalizedSubject);
                    const comment = generateSubjectComment(score, normalizedSubject);
                    
                    subjects.push({
                      subject: normalizedSubject,
                      score: score,
                      grade: grade,
                      points: points,
                      comment: comment
                    });
                    
                    processedSubjects.add(subjectName.toLowerCase());
                  }
                }
                
                // Also check for columns that might just be subject names with scores
                for (const [columnName, value] of Object.entries(row)) {
                  const columnStr = String(columnName).trim();
                  const lowerCol = columnStr.toLowerCase();
                  
                  if (lowerCol.includes('admission') || 
                      lowerCol.includes('form') || 
                      lowerCol.includes('term') ||
                      lowerCol.includes('year') ||
                      lowerCol.includes('total') ||
                      lowerCol.includes('average') ||
                      lowerCol.includes('position') ||
                      lowerCol.includes('remark') ||
                      lowerCol.includes('status') ||
                      lowerCol.includes('date')) {
                    continue;
                  }
                  
                  const isProcessed = Array.from(processedSubjects).some(processed => 
                    lowerCol.startsWith(processed) && 
                    (lowerCol.endsWith('_grade') || lowerCol.endsWith('_points') || lowerCol.endsWith('_comment'))
                  );
                  
                  if (isProcessed) {
                    continue;
                  }
                  
                  const score = parseScore(value);
                  if (score !== null && score >= 0 && score <= 100) {
                    const normalizedCol = normalizeSubjectName(columnStr);
                    if (!processedSubjects.has(normalizedCol.toLowerCase())) {
                      const grade = calculateGrade(score, normalizedCol);
                      const points = calculatePoints(score, normalizedCol);
                      const comment = generateSubjectComment(score, normalizedCol);
                      
                      subjects.push({
                        subject: normalizedCol,
                        score: score,
                        grade: grade,
                        points: points,
                        comment: comment
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
                  form: String(row.form || '').trim() || 'Form 1',
                  term: row.term || '',
                  academicYear: row.academicYear || row.academicyear || '',
                  subjects
                };
              } catch (error) {
                console.error(`Error parsing row ${index}:`, error);
                return null;
              }
            })
            .filter(item => item !== null);
          
          if (data.length === 0) {
            reject(new Error('No valid result data found in CSV file'));
            return;
          }
          
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
            'ADMISSION_NUMBER', 'admno', 'AdmNo', 'admission', 'Admission',
            'Adm', 'adm', 'RegNo', 'regno', 'Registration', 'registration'
          ]);
          
          if (!admissionNumber) {
            return null;
          }
          
          const subjects = [];
          const processedSubjects = new Set();
          
          // Extract all subject scores
          for (const [columnName, value] of Object.entries(row)) {
            const columnStr = String(columnName).trim();
            
            // Skip non-subject columns
            if (columnStr.toLowerCase().includes('admission') ||
                columnStr.toLowerCase().includes('form') ||
                columnStr.toLowerCase().includes('stream') ||
                columnStr.toLowerCase().includes('term') ||
                columnStr.toLowerCase().includes('year') ||
                columnStr.toLowerCase().includes('total') ||
                columnStr.toLowerCase().includes('average') ||
                columnStr.toLowerCase().includes('grade') && !columnStr.toLowerCase().includes('_grade') ||
                columnStr.toLowerCase().includes('points') && !columnStr.toLowerCase().includes('_points') ||
                columnStr.toLowerCase().includes('comment') && !columnStr.toLowerCase().includes('_comment') ||
                columnStr.toLowerCase().includes('position') ||
                columnStr.toLowerCase().includes('remark') ||
                columnStr.toLowerCase().includes('date') ||
                columnStr.toLowerCase().includes('status')) {
              continue;
            }
            
            // Check if this is a score column
            if (columnStr.endsWith('_Score') || 
                columnStr.toLowerCase().endsWith(' score') ||
                columnStr.toLowerCase().includes('score') && !columnStr.toLowerCase().includes('total')) {
              
              let subjectName = columnStr.replace(/_Score$/i, '').replace(/ score$/i, '').trim();
              
              if (processedSubjects.has(subjectName.toLowerCase())) {
                continue;
              }
              
              const score = parseScore(value);
              if (score === null || score < 0 || score > 100) {
                continue;
              }
              
              const normalizedSubject = normalizeSubjectName(subjectName);
              
              // AUTO-GENERATE GRADE, POINTS, AND COMMENT
              const grade = calculateGrade(score, normalizedSubject);
              const points = calculatePoints(score, normalizedSubject);
              const comment = generateSubjectComment(score, normalizedSubject);
              
              subjects.push({
                subject: normalizedSubject,
                score: score,
                grade: grade,
                points: points,
                comment: comment
              });
              
              processedSubjects.add(subjectName.toLowerCase());
            }
          }
          
          // Also check for columns that might just be subject names with scores
          for (const [columnName, value] of Object.entries(row)) {
            const columnStr = String(columnName).trim();
            const lowerCol = columnStr.toLowerCase();
            
            if (lowerCol.includes('admission') || 
                lowerCol.includes('form') || 
                lowerCol.includes('term') ||
                lowerCol.includes('year') ||
                lowerCol.includes('total') ||
                lowerCol.includes('average') ||
                lowerCol.includes('position') ||
                lowerCol.includes('remark') ||
                lowerCol.includes('status') ||
                lowerCol.includes('date')) {
              continue;
            }
            
            const isProcessed = Array.from(processedSubjects).some(processed => 
              lowerCol.startsWith(processed) && 
              (lowerCol.endsWith('_grade') || lowerCol.endsWith('_points') || lowerCol.endsWith('_comment'))
            );
            
            if (isProcessed) {
              continue;
            }
            
            const score = parseScore(value);
            if (score !== null && score >= 0 && score <= 100) {
              const normalizedCol = normalizeSubjectName(columnStr);
              if (!processedSubjects.has(normalizedCol.toLowerCase())) {
                const grade = calculateGrade(score, normalizedCol);
                const points = calculatePoints(score, normalizedCol);
                const comment = generateSubjectComment(score, normalizedCol);
                
                subjects.push({
                  subject: normalizedCol,
                  score: score,
                  grade: grade,
                  points: points,
                  comment: comment
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
            form: findValue(['form', 'Form']) || 'Form 1',
            term: findValue(['term', 'Term']) || '',
            academicYear: findValue(['academicYear', 'academicyear', 'year', 'Year', 'academic_year']) || '',
            subjects
          };
        } catch (error) {
          console.error(`Error parsing Excel row ${index}:`, error);
          return null;
        }
      })
      .filter(item => item !== null);
    
    if (data.length === 0) {
      throw new Error('No valid result data found in Excel file');
    }
    
    return data;
    
  } catch (error) {
    console.error('Excel parsing error:', error);
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
};

// ========== API ENDPOINTS ==========

// POST - Bulk upload with new strategy
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const uploadType = formData.get('uploadType'); // 'new' or 'update'
    const formsInput = formData.get('forms'); // JSON string for forms
    const targetForm = formData.get('targetForm'); // Single form for updates
    const term = formData.get('term') || '';
    const academicYear = formData.get('academicYear') || '';
    const checkDuplicates = formData.get('checkDuplicates') === 'true';
    const duplicateAction = formData.get('duplicateAction') || 'skip'; // 'skip' or 'replace'
    
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
    
    // Validate form selection based on upload type
    let selectedForms = [];
    if (uploadType === 'new') {
      if (!formsInput) {
        return NextResponse.json(
          { success: false, error: 'Please select at least one form for new upload' },
          { status: 400 }
        );
      }
      try {
        const forms = JSON.parse(formsInput);
        selectedForms = validateFormSelection(forms);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid form selection' },
          { status: 400 }
        );
      }
    } else if (uploadType === 'update') {
      if (!targetForm) {
        return NextResponse.json(
          { success: false, error: 'Target form is required for update upload' },
          { status: 400 }
        );
      }
      if (!term || !academicYear) {
        return NextResponse.json(
          { success: false, error: 'Term and academic year are required for update upload' },
          { status: 400 }
        );
      }
      selectedForms = validateFormSelection([targetForm]);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid upload type. Must be "new" or "update"' },
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
          error: 'Invalid file type. Please upload CSV or Excel (xlsx/xls) files.' 
        },
        { status: 400 }
      );
    }
    
    // Create batch record
    const batchId = `RESULT_BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const uploadBatch = await prisma.resultUpload.create({
      data: {
        id: batchId,
        fileName: file.name,
        fileType: fileExtension,
        uploadedBy: 'System Upload',
        status: 'processing',
        term: term || null,
        academicYear: academicYear || null,
        uploadMode: uploadType,
        totalRows: 0,
        validRows: 0,
        skippedRows: 0,
        errorRows: 0
      }
    });
    
    try {
      // Parse file
      let rawData = [];
      
      if (fileExtension === 'csv') {
        rawData = await parseResultsCSV(file);
      } else {
        rawData = await parseResultsExcel(file);
      }
      
      if (rawData.length === 0) {
        throw new Error(`No valid result data found.`);
      }
      
      // If just checking for duplicates
      if (checkDuplicates) {
        let duplicates = [];
        
        if (uploadType === 'new') {
          // Check for duplicates across all forms
          duplicates = await checkDuplicateResults(rawData);
        } else if (uploadType === 'update') {
          // Check for duplicates in the target form/term/year
          duplicates = await checkDuplicateResults(rawData, targetForm, term, academicYear);
        }
        
        return NextResponse.json({
          success: true,
          hasDuplicates: duplicates.length > 0,
          duplicates: duplicates,
          totalRows: rawData.length,
          message: duplicates.length > 0 
            ? `Found ${duplicates.length} duplicate result combinations` 
            : 'No duplicates found'
        });
      }
      
      let processingStats;
      
      // Use transaction for consistency
      await prisma.$transaction(async (tx) => {
        if (uploadType === 'new') {
          // Process new upload
          processingStats = await processNewResultsUpload(rawData, batchId, selectedForms, duplicateAction);
          
          // Update batch with new upload stats
          await tx.resultUpload.update({
            where: { id: batchId },
            data: {
              status: 'completed',
              processedDate: new Date(),
              totalRows: processingStats.totalRows,
              validRows: processingStats.validRows,
              skippedRows: processingStats.skippedRows,
              errorRows: processingStats.errorRows,
              newRecords: processingStats.newRecords,
              updatedRecords: processingStats.updatedRecords,
              duplicateRecords: processingStats.duplicateRecords,
              errorLog: processingStats.errors.length > 0 ? processingStats.errors.slice(0, 50) : undefined,
              warningLog: processingStats.warnings.length > 0 ? processingStats.warnings.slice(0, 50) : undefined
            }
          });
          
        } else if (uploadType === 'update') {
          // Process update upload
          processingStats = await processUpdateResultsUpload(rawData, batchId, targetForm, term, academicYear);
          
          // Update batch with update stats
          await tx.resultUpload.update({
            where: { id: batchId },
            data: {
              status: 'completed',
              processedDate: new Date(),
              totalRows: processingStats.totalRows,
              validRows: processingStats.validRows,
              skippedRows: processingStats.skippedRows,
              errorRows: processingStats.errorRows,
              newRecords: processingStats.newRecords,
              updatedRecords: processingStats.updatedRecords,
              duplicateRecords: processingStats.unchangedRecords,
              errorLog: processingStats.errors.length > 0 ? processingStats.errors.slice(0, 50) : undefined,
              warningLog: processingStats.warnings.length > 0 ? processingStats.warnings.slice(0, 50) : undefined
            }
          });
        }
        
        // Update statistics
        const finalStats = await calculateStatistics({});
        await updateCachedStats(finalStats.stats);
      });
      
      // Recalculate to ensure consistency
      const finalStats = await calculateStatistics({});
      
      return NextResponse.json({
        success: true,
        message: uploadType === 'new' 
          ? `Successfully processed ${processingStats.validRows} result records (${processingStats.newRecords} new, ${processingStats.updatedRecords} updated, ${processingStats.duplicateRecords} duplicates)` 
          : `Successfully updated form ${targetForm} - ${term} ${academicYear}: ${processingStats.updatedRecords} updated, ${processingStats.newRecords} created, ${processingStats.unchangedRecords} unchanged`,
        batch: {
          id: batchId,
          fileName: uploadBatch.fileName,
          status: 'completed',
          uploadType,
          selectedForms,
          targetForm: uploadType === 'update' ? targetForm : null
        },
        stats: finalStats.stats,
        validation: finalStats.validation,
        processingStats: processingStats,
        errors: processingStats.errors.slice(0, 20),
        warnings: processingStats.warnings.slice(0, 20)
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      
      // Update batch as failed
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
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Upload failed',
        suggestion: 'Please ensure your file has columns for admission number (3000-3500), term, academic year, and subject scores. Comments are automatically generated.'
      },
      { status: 500 }
    );
  }
}

// GET - Main endpoint with consistent statistics
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const admissionNumber = url.searchParams.get('admissionNumber');
    const form = url.searchParams.get('form') || '';
    const term = url.searchParams.get('term') || '';
    const academicYear = url.searchParams.get('academicYear') || '';
    const subject = url.searchParams.get('subject');
    const minScore = url.searchParams.get('minScore');
    const maxScore = url.searchParams.get('maxScore');
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const includeStudent = url.searchParams.get('includeStudent') === 'true';
    const includeStats = url.searchParams.get('includeStats') !== 'false';
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
          uploadMode: true,
          validRows: true,
          skippedRows: true,
          errorRows: true,
          newRecords: true,
          updatedRecords: true,
          duplicateRecords: true,
          errorLog: true,
          warningLog: true
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
      // Build filters for stats
      const filters = { form, term, academicYear, search };
      const where = buildWhereClause(filters);
      
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

    if (action === 'student-report' && admissionNumber) {
      const results = await prisma.studentResult.findMany({
        where: { admissionNumber },
        orderBy: [{ academicYear: 'desc' }, { term: 'desc' }],
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
          overallGrade: calculateGrade(averageScore),
          student: result.student || null
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

    // Build WHERE clause for regular results query
    const filters = { admissionNumber, form, term, academicYear, search };
    const where = buildWhereClause(filters);

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [results, total] = await Promise.all([
      prisma.studentResult.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      prisma.studentResult.count({ where })
    ]);

    // Parse subjects and calculate averages
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
        overallGrade: calculateGrade(averageScore),
        student: result.student || null
      };
    });

    // Apply additional filters
    let filteredResults = parsedResults;
    
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

    // Calculate statistics if requested
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
        results: paginatedResults,
        stats: statsResult?.stats || null,
        validation: statsResult?.validation || null,
        filters,
        pagination: {
          page,
          limit,
          total: totalFiltered,
          pages: Math.ceil(totalFiltered / limit)
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('GET error:', error);
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

// PUT - Update result with transaction
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

    // Use transaction for consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get current result
      const currentResult = await tx.studentResult.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      if (!currentResult) {
        throw new Error('Result not found');
      }

      // Update result
      const updatedResult = await tx.studentResult.update({
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

      // Update statistics
      const finalStats = await calculateStatistics({});
      await updateCachedStats(finalStats.stats);

      return updatedResult;
    });

    // Recalculate to ensure consistency
    const finalStats = await calculateStatistics({});

    return NextResponse.json({
      success: true,
      message: 'Result updated successfully',
      data: {
        result: result,
        stats: finalStats.stats,
        validation: finalStats.validation
      }
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

// DELETE - Result or batch with transaction
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    const resultId = url.searchParams.get('resultId');
    const hardDelete = url.searchParams.get('hardDelete') === 'true';

    if (batchId) {
      const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.resultUpload.findUnique({
          where: { id: batchId },
          select: {
            fileName: true,
            validRows: true
          }
        });

        if (!batch) {
          throw new Error('Upload batch not found');
        }

        // Delete all results from this batch
        const deleteResult = await tx.studentResult.deleteMany({
          where: { uploadBatchId: batchId }
        });

        // Delete batch record
        await tx.resultUpload.delete({
          where: { id: batchId }
        });

        return { 
          batch, 
          deletedCount: deleteResult.count
        };
      });

      // Recalculate statistics
      const finalStats = await calculateStatistics({});
      await updateCachedStats(finalStats.stats);

      return NextResponse.json({
        success: true,
        message: `Deleted batch ${result.batch.fileName} and ${result.deletedCount} results`,
        data: {
          stats: finalStats.stats,
          validation: finalStats.validation
        }
      });
    }

    if (resultId) {
      const result = await prisma.$transaction(async (tx) => {
        const resultData = await tx.studentResult.findUnique({
          where: { id: resultId },
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        });

        if (!resultData) {
          throw new Error('Result not found');
        }

        // Delete result
        await tx.studentResult.delete({
          where: { id: resultId }
        });

        return resultData;
      });

      // Recalculate statistics
      const finalStats = await calculateStatistics({});
      await updateCachedStats(finalStats.stats);

      return NextResponse.json({
        success: true,
        message: `Deleted result for ${result.student?.firstName} ${result.student?.lastName} (${result.admissionNumber})`,
        data: {
          stats: finalStats.stats,
          validation: finalStats.validation
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide batchId or resultId' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}