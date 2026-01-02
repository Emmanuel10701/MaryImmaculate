// app/api/results/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

// Helper function to calculate grade
const calculateGrade = (score) => {
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

const calculatePoints = (score) => {
  const grade = calculateGrade(score);
  const pointMap = {
    'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
    'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'E': 1
  };
  return pointMap[grade] || 0;
};

// Helper function to parse and calculate result stats
const parseResultWithStats = (result) => {
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
  const totalPoints = subjects.reduce((sum, s) => sum + (s.points || 0), 0);

  return {
    ...result,
    subjects,
    totalScore,
    averageScore: parseFloat(averageScore.toFixed(2)),
    overallGrade: calculateGrade(averageScore),
    totalPoints
  };
};

// GET single result by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const result = await prisma.studentResult.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            admissionNumber: true,
            form: true,
            stream: true,
            gender: true,
            email: true,
            parentPhone: true
          }
        },
        uploadBatch: {
          select: {
            id: true,
            fileName: true,
            uploadDate: true,
            uploadedBy: true,
            status: true
          }
        }
      }
    });

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Academic result not found' },
        { status: 404 }
      );
    }

    const parsedResult = parseResultWithStats(result);

    return NextResponse.json({
      success: true,
      data: parsedResult
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch academic result', error: error.message },
      { status: 500 }
    );
  }
}

// PUT update result
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const existingResult = await prisma.studentResult.findUnique({
      where: { id }
    });

    if (!existingResult) {
      return NextResponse.json(
        { success: false, message: 'Academic result not found' },
        { status: 404 }
      );
    }

    const requiredFields = ['form', 'term', 'academicYear', 'subjects'];
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if (!Array.isArray(data.subjects)) {
      return NextResponse.json(
        { success: false, message: 'Subjects must be an array' },
        { status: 400 }
      );
    }

    if (data.subjects.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one subject is required' },
        { status: 400 }
      );
    }

    const processedSubjects = data.subjects.map(subject => {
      const score = parseFloat(subject.score) || 0;
      const grade = subject.grade || calculateGrade(score);
      const points = subject.points || calculatePoints(score);
      
      return {
        subject: subject.subject || '',
        score: score,
        grade: grade,
        points: points,
        comment: subject.comment || ''
      };
    });

    const updatedResult = await prisma.studentResult.update({
      where: { id },
      data: {
        form: data.form,
        term: data.term,
        academicYear: data.academicYear,
        subjects: processedSubjects,
        updatedAt: new Date()
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNumber: true,
            form: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Academic result updated successfully',
      data: updatedResult
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Academic result not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update academic result', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE result
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await prisma.studentResult.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            admissionNumber: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Academic result not found' },
        { status: 404 }
      );
    }

    await prisma.studentResult.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: `Academic result deleted successfully for student ${result.student.firstName} ${result.student.lastName} (${result.student.admissionNumber})`
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Academic result not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to delete academic result', error: error.message },
      { status: 500 }
    );
  }
}