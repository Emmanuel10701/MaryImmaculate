import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../libs/prisma';

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'Katwanyaa-student-secret-key-2024';
const STUDENT_TOKEN_EXPIRY = '2h'; // Changed from 15m to 2 hours

// Generate student JWT token
const generateStudentToken = (student) => {
  return jwt.sign(
    {
      studentId: student.id,
      admissionNumber: student.admissionNumber,
      name: `${student.firstName} ${student.lastName}`,
      form: student.form,
      stream: student.stream,
      role: 'student',
    },
    JWT_SECRET,
    { expiresIn: STUDENT_TOKEN_EXPIRY }
  );
};

// Clean and normalize name for comparison
const normalizeName = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^a-z\s]/g, '') // Remove special characters and numbers
    .split(' ')
    .filter(word => word.length > 0) // Remove empty strings
    .sort(); // Sort alphabetically for comparison
};

// Find student by admission number with flexible name matching
const findStudentByName = (student, nameParts) => {
  // Get all possible name combinations from database student
  const dbNameVariations = [
    student.firstName?.toLowerCase() || '',
    student.lastName?.toLowerCase() || '',
    student.middleName?.toLowerCase() || ''
  ].filter(name => name && name.length > 0);

  // Sort both arrays for comparison
  const sortedNameParts = [...nameParts].sort();
  const sortedDbNames = [...dbNameVariations].sort();

  // Check if all entered name parts exist in database names
  const allPartsMatch = sortedNameParts.every(part => {
    return sortedDbNames.some(dbName => {
      // Exact match or partial match (for abbreviations)
      return dbName === part || 
             dbName.startsWith(part) || 
             part.startsWith(dbName) ||
             (part.length === 1 && dbName[0] === part); // Handle initials
    });
  });

  return allPartsMatch;
};

// Validate student credentials with flexible name matching
const validateStudentCredentials = async (fullName, admissionNumber) => {
  try {
    // Clean inputs
    const cleanAdmissionNumber = admissionNumber.trim().toUpperCase();
    const cleanFullName = fullName.trim();

    // Parse and normalize name parts
    const nameParts = normalizeName(cleanFullName);
    
    if (nameParts.length < 1) {
      return { 
        success: false, 
        error: 'Please enter your name',
        requiresContact: false 
      };
    }

    // Find student by admission number
    const student = await prisma.databaseStudent.findUnique({
      where: { 
        admissionNumber: cleanAdmissionNumber
      }
    });

    if (!student) {
      return { 
        success: false, 
        error: 'Student not found with this admission number. Please contact your class teacher or the school administrator/secretary to add or confirm your records.',
        requiresContact: true 
      };
    }

    // Check if student is active
    if (student.status !== 'active') {
      return { 
        success: false, 
        error: 'Student account is not active. Please contact your class teacher or the school administrator/secretary.',
        requiresContact: true 
      };
    }

    // Check name match with flexible matching
    const isNameMatch = findStudentByName(student, nameParts);

    if (!isNameMatch) {
      return { 
        success: false, 
        error: 'Name does not match admission number. Please check and try again, or contact your class teacher or the school administrator/secretary to confirm your details.',
        requiresContact: true 
      };
    }

    return { 
      success: true, 
      student 
    };

  } catch (error) {
    console.error('Student validation error:', error);
    return { 
      success: false, 
      error: 'Authentication failed. Please try again.',
      requiresContact: false 
    };
  }
};

// POST - Student Login
export async function POST(request) {
  try {
    const { fullName, admissionNumber } = await request.json();

    if (!fullName || !admissionNumber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Full name and admission number are required' 
        },
        { status: 400 }
      );
    }

    // Validate student credentials with flexible name matching
    const validation = await validateStudentCredentials(fullName, admissionNumber);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          requiresContact: validation.requiresContact || false
        },
        { status: validation.requiresContact ? 404 : 401 }
      );
    }

    const student = validation.student;

    // Generate JWT token with 2-hour expiry
    const token = generateStudentToken(student);

    // Create student session record with 2-hour expiry
    try {
      await prisma.studentSession.create({
        data: {
          studentId: student.id,
          admissionNumber: student.admissionNumber,
          name: `${student.firstName} ${student.lastName}`,
          token,
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      });
    } catch (sessionError) {
      console.warn('Could not create student session (might not be in schema yet):', sessionError);
      // Continue without session tracking for now
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        middleName: student.middleName,
        fullName: `${student.firstName} ${student.lastName}`,
        form: student.form,
        stream: student.stream,
        email: student.email,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        parentPhone: student.parentPhone,
        address: student.address
      },
      token,
      expiresIn: '2 hours',
      permissions: {
        canViewResources: true,
        canViewAssignments: true,
        canDownloadMaterials: true
      }
    }, {
      status: 200,
      headers: {
        'Set-Cookie': `student_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=7200; Secure=${process.env.NODE_ENV === 'production'}`
      }
    });

  } catch (error) {
    console.error('Student login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// GET - Verify student token
export async function GET(request) {
  try {
    // Try to get token from cookie first
    const cookieHeader = request.headers.get('cookie');
    let token = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.student_token;
    }
    
    // Fallback to Authorization header
    if (!token) {
      token = request.headers.get('authorization')?.replace('Bearer ', '');
    }

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          error: 'No token provided' 
        },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if token is for student
    if (decoded.role !== 'student') {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          error: 'Invalid token type' 
        },
        { status: 401 }
      );
    }

    // FIXED: Use findUnique with only unique field (id), then check status separately
    const student = await prisma.databaseStudent.findUnique({
      where: { 
        id: decoded.studentId  // Only unique field here
      }
    });

    // Check if student exists AND is active
    if (!student || student.status !== 'active') {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          error: 'Student not found or inactive' 
        },
        { status: 401 }
      );
    }

    // Try to check session if available
    try {
      const session = await prisma.studentSession?.findFirst?.({
        where: {
          token: token,
          expiresAt: {
            gt: new Date()
          }
        }
      });

      if (!session) {
        // If session table doesn't exist or session expired, just warn but don't block
        console.warn('Session not found or expired, but continuing with token validation');
      }
    } catch (sessionError) {
      console.warn('Session check failed, continuing with token validation:', sessionError);
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        middleName: student.middleName,
        name: `${student.firstName} ${student.lastName}`,
        fullName: `${student.firstName} ${student.lastName}`,
        form: student.form,
        stream: student.stream,
        email: student.email,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        parentPhone: student.parentPhone,
        address: student.address
      },
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false,
          error: 'Session expired. Please log in again.',
          requiresReauth: true 
        },
        { status: 401 }
      );
    }

    console.error('Token verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        authenticated: false,
        error: 'Invalid token' 
      },
      { status: 401 }
    );
  }
}

// DELETE - Student Logout
export async function DELETE(request) {
  try {
    // Get token from cookie or Authorization header
    const cookieHeader = request.headers.get('cookie');
    let token = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.student_token;
    }
    
    if (!token) {
      token = request.headers.get('authorization')?.replace('Bearer ', '');
    }

    // If we have a token and studentSession exists, try to delete the session
    if (token && prisma.studentSession) {
      try {
        await prisma.studentSession.deleteMany({
          where: {
            token: token
          }
        });
      } catch (error) {
        console.warn('Error deleting session (might not exist in schema):', error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      },
      {
        headers: {
          'Set-Cookie': `student_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure=${process.env.NODE_ENV === 'production'}`
        }
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}