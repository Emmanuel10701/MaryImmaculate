import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";

// ==================== AUTHENTICATION UTILITIES ====================

class DeviceTokenManager {
  static decodeBase64(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) throw new Error('Invalid base64 string');
      base64 += '==='.slice(0, 4 - pad);
    }
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  static validateTokensFromHeaders(headers) {
    try {
      const adminToken = headers.get('x-admin-token') || 
                         headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken || !deviceToken) {
        return { valid: false, reason: 'missing_tokens', message: 'Both admin and device tokens are required' };
      }

      // Validate JWT format
      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_jwt_format', message: 'Invalid JWT format' };
      }

      try {
        // Parse JWT payload
        const payloadStr = this.decodeBase64(adminParts[1]);
        const payload = JSON.parse(payloadStr);
        
        // Check expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          return { valid: false, reason: 'token_expired', message: 'Token has expired' };
        }

        // Check role
        const userRole = payload.role;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL', 'STAFF', 'EDITOR', 'NEWS_MANAGER'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { valid: false, reason: 'invalid_role', message: 'Insufficient permissions' };
        }

        // Validate device token
        try {
          const devicePayloadStr = Buffer.from(deviceToken, 'base64').toString('utf-8');
          const devicePayload = JSON.parse(devicePayloadStr);
          
          if (devicePayload.exp && devicePayload.exp * 1000 <= Date.now()) {
            return { valid: false, reason: 'device_expired', message: 'Device token expired' };
          }

        } catch (deviceError) {
          return { valid: false, reason: 'invalid_device_token', message: 'Invalid device token' };
        }

        return { 
          valid: true,
          user: {
            id: payload.userId || payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role
          }
        };

      } catch (error) {
        return { valid: false, reason: 'token_parsing_error', message: 'Failed to parse token' };
      }

    } catch (error) {
      return { valid: false, reason: 'validation_error', message: 'Authentication failed' };
    }
  }
}

const authenticatePostRequest = (req) => {
  const validation = DeviceTokenManager.validateTokensFromHeaders(req.headers);
  
  if (!validation.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Authentication Failed",
          message: "Please login again to perform this action.",
          details: validation.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validation.user
  };
};

// Helper: Upload image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  if (!file?.name || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedFileName = nameWithoutExt.replace(/[^a-zA-Z0-9.-]/g, "_");

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "school_news",
          public_id: `${timestamp}-${sanitizedFileName}`,
          transformation: [
            { width: 1200, height: 800, crop: "fill" },
            { quality: "auto:good" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
  } catch {
    return null;
  }
};

// 🔹 GET all news (PUBLIC)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const where = {};

    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },

        { author: { contains: search, mode: 'insensitive' } },
        { fullContent: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [newsList, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          excerpt: true,
          fullContent: true,
          date: true,
          category: true,
          author: true,
          image: true,
        },
      }),
      prisma.news.count({ where })
    ]);

    return NextResponse.json({ 
      success: true, 
      data: newsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ GET News Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch news" 
    }, { status: 500 });
  }
}

// 🔹 POST new news (PROTECTED)
export async function POST(req) {
  try {
    // Authenticate request
    const auth = authenticatePostRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log(`📝 News creation by: ${auth.user.name}`);

    const formData = await req.formData();

    // Extract form data
    const title = formData.get("title")?.trim();
    const excerpt = formData.get("excerpt")?.trim();
    const fullContent = formData.get("fullContent")?.trim();
    const dateStr = formData.get("date");
    const category = formData.get("category")?.trim() || "General";
    const author = formData.get("author")?.trim() || auth.user.name;

    // Validate required fields
    if (!title || !excerpt || !fullContent || !dateStr) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation Error",
          message: "Title, excerpt, content and date are required",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Parse date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid Date",
          message: "Please provide a valid date",
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Handle image upload
    let imageUrl = null;
    const file = formData.get("image");
    if (file && file.size > 0) {
      const result = await uploadImageToCloudinary(file);
      if (result) {
        imageUrl = result.secure_url;
        console.log(`📸 Image uploaded by ${auth.user.name}`);
      }
    }

    // Create news
    const newNews = await prisma.news.create({
      data: {
        title,
        excerpt,
        fullContent,
        date,
        category,
        author,
        image: imageUrl,
        createdBy: auth.user.id,
        createdByName: auth.user.name,
        createdByRole: auth.user.role
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        date: true,
        category: true,
        author: true,
        image: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "News article created successfully",
      data: newNews,
      createdBy: auth.user.name
    }, { status: 201 });
  } catch (error) {
    console.error("❌ POST News Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create news",
      authenticated: true
    }, { status: 500 });
  }
}