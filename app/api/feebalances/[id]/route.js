import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prisma'; // ✅ named import

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
        
        // Check user role - only admins/staff can manage fees
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'STAFF', 'HR_MANAGER', 'TEACHER', 'ACCOUNTANT'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage fee balances' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Fee management authentication successful for user:', adminPayload.name || 'Unknown');
      
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
          message: "Authentication required to manage fee balances.",
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

// Helper function to calculate balance and payment status
const calculateFeeStats = (amount, amountPaid) => {
  const balance = Math.max(0, amount - (amountPaid || 0));
  const paymentStatus = balance <= 0 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending';
  return { balance, paymentStatus };
};

// Helper function to sort fee balances
const sortFeeBalances = (feeBalances) => {
  return feeBalances.sort((a, b) => {
    // First sort by academic year
    const yearA = a.academicYear || '';
    const yearB = b.academicYear || '';
    if (yearA > yearB) return -1;
    if (yearA < yearB) return 1;
    
    // Then sort by term (Term 1, Term 2, Term 3)
    const termOrder = { 'Term 1': 1, 'Term 2': 2, 'Term 3': 3 };
    const termA = termOrder[a.term] || 99;
    const termB = termOrder[b.term] || 99;
    
    return termA - termB;
  });
};

// Helper function to parse date safely
const parseDateSafely = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

// ========== API ENDPOINTS ==========

// GET fee balances by admission number (PUBLIC - no authentication required)
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Validate admission number
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Admission number is required' },
        { status: 400 }
      );
    }
    
    const admissionNumber = String(id).trim();

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
            status: true
          }
        }
      },
      orderBy: [
        { academicYear: 'desc' },
        { term: 'asc' }
      ]
    });

    // Apply custom ordering for terms (Term 1, Term 2, Term 3)
    const orderedFeeBalances = sortFeeBalances(feeBalances);

    if (!orderedFeeBalances || orderedFeeBalances.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No fee balance records found for this admission number',
          data: { feeBalances: [], summary: { totalAmount: 0, totalPaid: 0, totalBalance: 0 } }
        },
        { status: 200 }
      );
    }

    // Calculate summary
    const summary = orderedFeeBalances.reduce((acc, fee) => {
      acc.totalAmount += fee.amount || 0;
      acc.totalPaid += fee.amountPaid || 0;
      acc.totalBalance += fee.balance || 0;
      return acc;
    }, { totalAmount: 0, totalPaid: 0, totalBalance: 0 });

    // Get student info
    const studentInfo = orderedFeeBalances.length > 0 
      ? orderedFeeBalances[0].student 
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

    return NextResponse.json({
      success: true,
      data: {
        feeBalances: orderedFeeBalances,
        summary,
        student: studentInfo,
        metadata: {
          totalRecords: orderedFeeBalances.length,
          fetchedAt: new Date().toISOString(),
          admissionNumber
        }
      }
    });
  } catch (error) {
    console.error('GET fee balances by admission number error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch fee balance records',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST create new fee balance for admission number (PROTECTED - authentication required)
export async function POST(request, { params }) {
  try {
    // Step 1: Authenticate the POST request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Create fee balance request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    const admissionNumber = String(id).trim();
    const data = await request.json();

    // Validate required fields
    if (!data.term || !data.academicYear || data.amount === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Term, academic year, and amount are required',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    if (data.amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Amount must be greater than 0',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    // Check if the student exists
    const studentExists = await prisma.databaseStudent.findUnique({
      where: { admissionNumber }
    });

    if (!studentExists) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Student with this admission number does not exist',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    // Validate amountPaid doesn't exceed amount
    const amountPaid = data.amountPaid || 0;
    if (amountPaid > data.amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Amount paid cannot exceed total amount',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    // Calculate balance and payment status
    const { balance, paymentStatus } = calculateFeeStats(data.amount, amountPaid);

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
          message: 'Fee entry already exists for this student, term, and academic year',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    // Prepare data for creation
    const feeData = {
      admissionNumber,
      term: data.term,
      academicYear: data.academicYear,
      amount: parseFloat(data.amount),
      amountPaid: parseFloat(amountPaid),
      balance,
      paymentStatus,
      dueDate: parseDateSafely(data.dueDate),
      uploadBatchId: data.uploadBatchId || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newFeeBalance = await prisma.feeBalance.create({
      data: {
        ...feeData,
        student: {
          connect: { admissionNumber }
        }
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

    console.log(`✅ Fee balance created by ${auth.user.name}: Student ${admissionNumber} - ${data.term} ${data.academicYear}`);

    return NextResponse.json({
      success: true,
      message: 'Fee balance created successfully',
      data: {
        feeBalance: newFeeBalance
      },
      authenticated: true,
    }, { status: 201 });
  } catch (error) {
    console.error('Create fee balance error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee entry already exists for this student, term, and academic year',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create fee balance',
        authenticated: true 
      },
      { status: 500 }
    );
  }
}

// PUT - Update single fee balance (PROTECTED - authentication required)
// PUT update fee balance (PROTECTED - authentication required)
export async function PUT(request, { params }) {
  try {
    // Step 1: Authenticate the PUT request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`📝 Update fee balance request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params; // Get fee ID from URL params
    const data = await request.json();
    
    // Get feeBalanceId from request body (for backward compatibility)
    const feeBalanceId = data.feeBalanceId || id;
    
    if (!feeBalanceId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee balance ID is required',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    // Get current fee balance
    const currentFee = await prisma.feeBalance.findUnique({
      where: { id: feeBalanceId },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!currentFee) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee balance record not found',
          authenticated: true 
        },
        { status: 404 }
      );
    }

    // Calculate values for update
    const amount = data.amount !== undefined ? parseFloat(data.amount) : currentFee.amount;
    const amountPaid = data.amountPaid !== undefined ? parseFloat(data.amountPaid) : currentFee.amountPaid;

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Amount must be greater than 0',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    // Validate amountPaid doesn't exceed amount
    if (amountPaid > amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Amount paid cannot exceed total amount',
          authenticated: true 
        },
        { status: 400 }
      );
    }

    // Calculate balance and payment status
    const balance = Math.max(0, amount - amountPaid);
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
            message: 'Fee entry already exists for this student, term, and academic year',
            authenticated: true 
          },
          { status: 400 }
        );
      }
    }

    // Prepare update data - handle dueDate conversion
    const updateData = {};
    
    // Only include fields that are being updated
    if (data.admissionNumber !== undefined) updateData.admissionNumber = data.admissionNumber;
    if (data.term !== undefined) updateData.term = data.term;
    if (data.academicYear !== undefined) updateData.academicYear = data.academicYear;
    if (data.form !== undefined) updateData.form = data.form;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    
    // Always update these calculated fields
    updateData.amount = amount;
    updateData.amountPaid = amountPaid;
    updateData.balance = balance;
    updateData.paymentStatus = paymentStatus;
    updateData.updatedAt = new Date();

    // Handle dueDate specially - convert string to Date object
    if (data.dueDate !== undefined) {
      if (data.dueDate === null || data.dueDate === '' || data.dueDate === 'null') {
        updateData.dueDate = null;
      } else {
        // Ensure it's a Date object
        const dateObj = new Date(data.dueDate);
        updateData.dueDate = isNaN(dateObj.getTime()) ? null : dateObj;
        console.log(`📅 Date conversion: ${data.dueDate} -> ${updateData.dueDate}`);
      }
    }

    console.log('🔍 Update data prepared:', updateData);

    const updatedFeeBalance = await prisma.feeBalance.update({
      where: { id: feeBalanceId },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            form: true,
            admissionNumber: true,
            email: true,
            parentPhone: true
          }
        }
      }
    });

    console.log(`✅ Fee balance updated by ${auth.user.name}: Student ${updatedFeeBalance.admissionNumber} - ${updatedFeeBalance.term} ${updatedFeeBalance.academicYear}`);

    return NextResponse.json({
      success: true,
      message: 'Fee balance updated successfully',
      data: {
        feeBalance: updatedFeeBalance
      },
      authenticated: true,
      updatedBy: auth.user.name
    });
  } catch (error) {
    console.error('Update fee balance error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta
    });
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee balance record not found',
          authenticated: true 
        },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee entry already exists for this student, term, and academic year',
          authenticated: true 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update fee balance',
        authenticated: true 
      },
      { status: 500 }
    );
  }
}

// DELETE fee balance (PROTECTED - authentication required)
export async function DELETE(request, { params }) {
  try {
    // Step 1: Authenticate the DELETE request
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Log authentication info
    console.log(`🗑️ Delete fee balance request from: ${auth.user.name} (${auth.user.role})`);

    const { id } = params;
    const admissionNumber = String(id).trim();
    
    const url = new URL(request.url);
    const feeBalanceId = url.searchParams.get('feeBalanceId');

    if (feeBalanceId) {
      // Delete specific fee balance by its ID
      const feeBalance = await prisma.feeBalance.findUnique({
        where: { id: feeBalanceId }
      });

      if (!feeBalance) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Fee balance record not found',
            authenticated: true 
          },
          { status: 404 }
        );
      }

      const deletedFeeBalance = await prisma.feeBalance.delete({
        where: { id: feeBalanceId }
      });

      console.log(`✅ Fee balance deleted by ${auth.user.name}: Student ${deletedFeeBalance.admissionNumber} - ${deletedFeeBalance.term} ${deletedFeeBalance.academicYear}`);

      return NextResponse.json({
        success: true,
        message: 'Fee balance deleted successfully',
        data: {
          feeBalance: deletedFeeBalance
        },
        authenticated: true,
      });
    } else {
      // Delete all fee balances for this admission number
      const feeBalances = await prisma.feeBalance.findMany({
        where: { admissionNumber },
        select: {
          id: true,
          admissionNumber: true,
          term: true,
          academicYear: true
        }
      });

      if (feeBalances.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'No fee balances found for this admission number',
            authenticated: true 
          },
          { status: 404 }
        );
      }

      const deletedCount = await prisma.feeBalance.deleteMany({
        where: { admissionNumber }
      });

      console.log(`✅ Mass fee deletion by ${auth.user.name}: ${deletedCount.count} fee balances for admission number ${admissionNumber}`);

      return NextResponse.json({
        success: true,
        message: `Deleted ${deletedCount.count} fee balance records for admission number ${admissionNumber}`,
        data: {
          count: deletedCount.count,
          admissionNumber
        },
        authenticated: true,
      });
    }
  } catch (error) {
    console.error('Delete fee balance(s) error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fee balance record not found',
          authenticated: true 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete fee balance(s)',
        authenticated: true 
      },
      { status: 500 }
    );
  }
}