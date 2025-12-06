


import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {prisma} from '../../../libs/prisma';

// GET method to verify token validity
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    console.log('🔍 Token Verification Request');
    console.log('Token to verify:', token);

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    // Hash the token to match what's stored
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Hashed token for verification:', hashedToken);

    // Try to find the reset request with hashed token first
    let resetRequest = await prisma.passwordReset.findUnique({
      where: { token: hashedToken },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    console.log('Reset request found with hashed token:', resetRequest);

    // If not found with hashed token, try with raw token (for backward compatibility)
    if (!resetRequest) {
      console.log('🔄 Trying with raw token...');
      resetRequest = await prisma.passwordReset.findUnique({
        where: { token: token }, // Try raw token
        include: {
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      });
      console.log('Reset request found with raw token:', resetRequest);
      
      // If found with raw token, update it to hashed for consistency
      if (resetRequest) {
        console.log('🔄 Updating raw token to hashed token for consistency...');
        await prisma.passwordReset.update({
          where: { id: resetRequest.id },
          data: { token: hashedToken }
        });
        console.log('✅ Token updated to hashed version');
      }
    }

    if (!resetRequest) {
      console.log('❌ No reset request found for this token');
      
      // Get all tokens for debugging
      const allResetRequests = await prisma.passwordReset.findMany({
        include: {
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      });
      
      console.log('All reset requests in DB:', allResetRequests.map(t => ({
        id: t.id,
        userEmail: t.user?.email,
        token: t.token,
        tokenLength: t.token.length,
        tokenType: t.token.length === 64 ? 'HASHED' : 'RAW',
        expires: t.expires,
        isExpired: t.expires < new Date()
      })));
      
      return NextResponse.json(
        { 
          valid: false,
          message: 'Invalid or expired token',
          debug: {
            totalTokensInDB: allResetRequests.length,
            tokenTypes: allResetRequests.map(t => ({
              type: t.token.length === 64 ? 'HASHED' : 'RAW',
              length: t.token.length
            }))
          }
        },
        { status: 400 }
      );
    }

    // Check expiry
    const isExpired = resetRequest.expires < new Date();
    console.log('Token expires:', resetRequest.expires);
    console.log('Current time:', new Date());
    console.log('Is expired:', isExpired);

    if (isExpired) {
      console.log('❌ Token has expired');
      // Auto-delete expired token
      await prisma.passwordReset.delete({ where: { id: resetRequest.id } });
      return NextResponse.json({ 
        valid: false,
        message: 'Token expired' 
      }, { status: 400 });
    }

    console.log('✅ Token is valid');
    return NextResponse.json({
      valid: true,
      message: 'Token is valid',
      user: {
        email: resetRequest.user.email,
        name: resetRequest.user.name
      },
      expires: resetRequest.expires,
      timeRemaining: Math.max(0, resetRequest.expires - new Date())
    });

  } catch (error) {
    console.error('❌ Token verification error:', error);
    return NextResponse.json(
      { 
        valid: false,
        message: 'Internal server error during token verification' 
      },
      { status: 500 }
    );
  }
}

// POST method to reset password
export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    console.log('🔐 Password Reset Request Received');
    console.log('Token received:', token);
    console.log('New password length:', newPassword?.length);

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // Hash the incoming token to match what's stored
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Hashed token:', hashedToken);

    // Try to find the reset request with hashed token first
    let resetRequest = await prisma.passwordReset.findUnique({
      where: { token: hashedToken },
    });

    console.log('Reset request found with hashed token:', resetRequest);

    // If not found with hashed token, try with raw token
    if (!resetRequest) {
      console.log('🔄 Trying with raw token...');
      resetRequest = await prisma.passwordReset.findUnique({
        where: { token: token }, // Try raw token
      });
      console.log('Reset request found with raw token:', resetRequest);
    }

    if (!resetRequest) {
      console.log('❌ No reset request found for this token');
      
      // Get all tokens for debugging
      const allResetRequests = await prisma.passwordReset.findMany();
      console.log('All reset requests in DB:', allResetRequests.map(t => ({
        id: t.id,
        token: t.token,
        tokenLength: t.token.length,
        tokenType: t.token.length === 64 ? 'HASHED' : 'RAW',
        expires: t.expires
      })));
      
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check expiry
    console.log('Token expires:', resetRequest.expires);
    console.log('Current time:', new Date());
    
    if (resetRequest.expires < new Date()) {
      console.log('❌ Token has expired');
      await prisma.passwordReset.delete({ where: { id: resetRequest.id } });
      return NextResponse.json({ message: 'Token expired' }, { status: 400 });
    }

    console.log('✅ Token is valid, proceeding with password reset');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashedPassword },
    });

    // Delete the reset token so it can't be reused
    await prisma.passwordReset.delete({ where: { id: resetRequest.id } });

    console.log('✅ Password reset successfully for user:', resetRequest.userId);

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('❌ Password reset error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}