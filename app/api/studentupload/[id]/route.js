// app/api/studentupload/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prisma'; // ✅ named import

// GET single student by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const student = await prisma.databaseStudent.findUnique({
      where: { id },
      include: {
        uploadBatch: {
          select: {
            fileName: true,
            uploadDate: true,
            status: true
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student
    });
  } catch (error) {
    console.error('GET student error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PUT update student
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.form) {
      return NextResponse.json(
        { success: false, message: 'First name, last name, and form are required' },
        { status: 400 }
      );
    }

    const validForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
    if (!validForms.includes(data.form)) {
      return NextResponse.json(
        { success: false, message: `Form must be one of: ${validForms.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if admission number is being changed and if it already exists
    if (data.admissionNumber) {
      const existingStudent = await prisma.databaseStudent.findFirst({
        where: {
          admissionNumber: data.admissionNumber,
          id: { not: id }
        }
      });

      if (existingStudent) {
        return NextResponse.json(
          { success: false, message: 'Admission number already exists' },
          { status: 400 }
        );
      }
    }

    const updatedStudent = await prisma.databaseStudent.update({
      where: { id },
      data: {
        admissionNumber: data.admissionNumber,
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.lastName,
        form: data.form,
        stream: data.stream || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
        parentPhone: data.parentPhone || null,
        email: data.email || null,
        address: data.address || null,
        status: data.status || 'active'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Update student error:', error);
    
    // Handle Prisma not found error
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update student' },
      { status: 500 }
    );
  }
}

// DELETE student
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const deletedStudent = await prisma.databaseStudent.delete({
      where: { id }
    });

    // Update stats
    await prisma.studentStats.update({
      where: { id: 'global_stats' },
      data: {
        totalStudents: { decrement: 1 },
        ...(deletedStudent.form === 'Form 1' && { form1: { decrement: 1 } }),
        ...(deletedStudent.form === 'Form 2' && { form2: { decrement: 1 } }),
        ...(deletedStudent.form === 'Form 3' && { form3: { decrement: 1 } }),
        ...(deletedStudent.form === 'Form 4' && { form4: { decrement: 1 } })
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    
    // Handle Prisma not found error
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to delete student' },
      { status: 500 }
    );
  }
}