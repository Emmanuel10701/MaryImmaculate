import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import { verifyPassword, generateToken, sanitizeUser } from '../../../libs/auth';

// Constants
const SCHOOL_NAME = 'Katwanyaa  High School';

// Helpers
const validateEnvironment = () => {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set.');
    return false;
  }
  return true;
};

const validateCredentials = (email, password) => {
  if (!email || !password) {
    return 'Email and password are required';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Valid email is required';
  }

  return null;
};

// Main POST
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Skip format validation intentionally
    if (!validateEnvironment()) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const validationError = validateCredentials(email, password);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if user has password
    if (!user.password) {
      return NextResponse.json({ error: 'Invalid authentication method' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate token
    const token = generateToken(user);

    // Prepare response data
    const userData = sanitizeUser(user);

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userData,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error during login:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET login info
export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Login endpoint',
      requirements: {
        email: 'string (valid email format)',
        password: 'string (min 6 characters)'
      }
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching login info:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}