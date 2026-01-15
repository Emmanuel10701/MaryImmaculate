import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import { hashPassword, generateToken, sanitizeUser } from '../../../libs/auth';

// Constants
const SCHOOL_NAME = 'Mary Immaculate Girls Secondary School';

// Helpers
const validateEnvironment = () => {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set.');
    return false;
  }
  return true;
};

const validateInput = (name, email, password, role) => {
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  const validRoles = ['TEACHER', 'PRINCIPAL', 'ADMIN'];
  if (!validRoles.includes(role)) {
    errors.push('Invalid user role');
  }

  return errors;
};

// Main POST
export async function POST(request) {
  try {
const { name, email, password, phone, role = 'ADMIN' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    // Skip format validation intentionally
    if (!validateEnvironment()) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const validationErrors = validateInput(name, email, password, role);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }

    // Check duplicates
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Save user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { 
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        role: role
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        phone: true, 
        role: true, 
        image: true,
        emailVerified: true,
        createdAt: true, 
        updatedAt: true 
      },
    });

    // Generate token
    const token = generateToken(user);

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: sanitizeUser(user),
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error registering user:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        createdAt: true 
      },
    });
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}