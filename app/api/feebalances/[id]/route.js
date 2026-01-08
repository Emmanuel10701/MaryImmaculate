import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prisma'; // ✅ named import

// GET fee balances by admission number
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Assuming 'id' in params is actually the admissionNumber
    const admissionNumber = id;

    // Get all fee balances for this admission number
    const feeBalances = await prisma.feeBalance.findMany({
      where: { admissionNumber },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            form: true,
            stream: true,
            admissionNumber: true,
            parentPhone: true,
            email: true
          }
        },
        uploadBatch: {
          select: {
            fileName: true,
            uploadDate: true,
            uploadedBy: true,
            status: true
          }
        }
      },
      orderBy: [
        { academicYear: 'desc' },
        { term: 'asc' } // Simple string ordering - will sort alphabetically
      ]
    });

    // If you need custom ordering for terms (Term 1, Term 2, Term 3),
    // we'll do it manually after fetching
    const orderedFeeBalances = feeBalances.sort((a, b) => {
      // First sort by academic year (already done by Prisma, but just in case)
      if (a.academicYear > b.academicYear) return -1;
      if (a.academicYear < b.academicYear) return 1;
      
      // Then sort by term (Term 1, Term 2, Term 3)
      const termOrder = { 'Term 1': 1, 'Term 2': 2, 'Term 3': 3 };
      const termA = termOrder[a.term] || 99;
      const termB = termOrder[b.term] || 99;
      
      return termA - termB;
    });

    if (!orderedFeeBalances || orderedFeeBalances.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fee balance records found for this admission number' },
        { status: 404 }
      );
    }

    // Calculate summary
    const summary = orderedFeeBalances.reduce((acc, fee) => {
      acc.totalAmount += fee.amount;
      acc.totalPaid += fee.amountPaid;
      acc.totalBalance += fee.balance;
      return acc;
    }, { totalAmount: 0, totalPaid: 0, totalBalance: 0 });

    return NextResponse.json({
      success: true,
      data: {
        feeBalances: orderedFeeBalances,
        summary
      }
    });
  } catch (error) {
    console.error('GET fee balances by admission number error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch fee balance records' },
      { status: 500 }
    );
  }
}

// POST create new fee balance for admission number
export async function POST(request, { params }) {
  try {
    const { id } = params;
    const admissionNumber = id;
    const data = await request.json();

    // Validate required fields
    if (!data.term || !data.academicYear || !data.amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Term, academic year, and amount are required' 
        },
        { status: 400 }
      );
    }

    if (data.amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if the student exists
    const studentExists = await prisma.databaseStudent.findUnique({
      where: { admissionNumber }
    });

    if (!studentExists) {
      return NextResponse.json(
        { success: false, message: 'Student with this admission number does not exist' },
        { status: 400 }
      );
    }

    // Validate amountPaid doesn't exceed amount
    const amountPaid = data.amountPaid || 0;
    if (amountPaid > data.amount) {
      return NextResponse.json(
        { success: false, message: 'Amount paid cannot exceed total amount' },
        { status: 400 }
      );
    }

    // Calculate balance and payment status
    const balance = data.amount - amountPaid;
    const paymentStatus = balance <= 0 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending';

    // Check for duplicate fee entry (same student, term, academic year)
    const existingFee = await prisma.feeBalance.findFirst({
      where: {
        admissionNumber,
        term: data.term,
        academicYear: data.academicYear
      }
    });

    if (existingFee) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee entry already exists for this student, term, and academic year' 
        },
        { status: 400 }
      );
    }

    const newFeeBalance = await prisma.feeBalance.create({
      data: {
        admissionNumber,
        term: data.term,
        academicYear: data.academicYear,
        amount: data.amount,
        amountPaid: amountPaid,
        balance: balance,
        paymentStatus: paymentStatus,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        student: {
          connect: { admissionNumber }
        },
        uploadBatchId: data.uploadBatchId || null
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
      message: 'Fee balance created successfully',
      feeBalance: newFeeBalance
    }, { status: 201 });
  } catch (error) {
    console.error('Create fee balance error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee entry already exists for this student, term, and academic year' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create fee balance' },
      { status: 500 }
    );
  }
}

// PUT update fee balance
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Get feeBalanceId from request body or query params
    const feeBalanceId = data.feeBalanceId;
    
    if (!feeBalanceId) {
      return NextResponse.json(
        { success: false, message: 'Fee balance ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (data.amount !== undefined && data.amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Get current fee balance
    const currentFee = await prisma.feeBalance.findUnique({
      where: { id: feeBalanceId }
    });

    if (!currentFee) {
      return NextResponse.json(
        { success: false, message: 'Fee balance record not found' },
        { status: 404 }
      );
    }

    // Validate amountPaid doesn't exceed amount
    const amount = data.amount !== undefined ? data.amount : currentFee.amount;
    const amountPaid = data.amountPaid !== undefined ? data.amountPaid : currentFee.amountPaid;
    
    if (amountPaid > amount) {
      return NextResponse.json(
        { success: false, message: 'Amount paid cannot exceed total amount' },
        { status: 400 }
      );
    }

    // Calculate balance and payment status
    const balance = amount - amountPaid;
    const paymentStatus = balance <= 0 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending';

    // Check for duplicate if updating admissionNumber, term, or academicYear
    if (data.admissionNumber || data.term || data.academicYear) {
      const admissionNumber = data.admissionNumber || currentFee.admissionNumber;
      const term = data.term || currentFee.term;
      const academicYear = data.academicYear || currentFee.academicYear;

      const existingFee = await prisma.feeBalance.findFirst({
        where: {
          admissionNumber,
          term,
          academicYear,
          NOT: { id: feeBalanceId }
        }
      });

      if (existingFee) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Fee entry already exists for this student, term, and academic year' 
          },
          { status: 400 }
        );
      }
    }

    const updatedFeeBalance = await prisma.feeBalance.update({
      where: { id: feeBalanceId },
      data: {
        ...data,
        amount,
        amountPaid,
        balance,
        paymentStatus,
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
      feeBalance: updatedFeeBalance
    });
  } catch (error) {
    console.error('Update fee balance error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Fee balance record not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee entry already exists for this student, term, and academic year' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update fee balance' },
      { status: 500 }
    );
  }
}

// DELETE fee balance
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const url = new URL(request.url);
    const feeBalanceId = url.searchParams.get('feeBalanceId');

    if (feeBalanceId) {
      // Delete specific fee balance by its ID
      const deletedFeeBalance = await prisma.feeBalance.delete({
        where: { id: feeBalanceId }
      });

      return NextResponse.json({
        success: true,
        message: 'Fee balance deleted successfully',
        feeBalance: deletedFeeBalance
      });
    } else {
      // Delete all fee balances for this admission number
      const deletedCount = await prisma.feeBalance.deleteMany({
        where: { admissionNumber: id }
      });

      return NextResponse.json({
        success: true,
        message: `Deleted ${deletedCount.count} fee balance records for admission number ${id}`,
        count: deletedCount.count
      });
    }
  } catch (error) {
    console.error('Delete fee balance(s) error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Fee balance record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to delete fee balance(s)' },
      { status: 500 }
    );
  }
}