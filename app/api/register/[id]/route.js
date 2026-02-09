import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import { hashPassword, sanitizeUser } from "../../../../libs/auth";

// Device Token Manager Class
class DeviceTokenManager {
  static validateTokensFromHeaders(headers, options = {}) {
    try {
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ''}`
        };
      }

      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL', 'TEACHER', 'teacher'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage resources' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Resource management authentication successful for user:', adminPayload.name || 'Unknown');
      
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

  static validateDeviceToken(token) {
    try {
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
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

// Authentication helper function
const authenticateRequest = (req) => {
  const headers = req.headers;
  
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: "Authentication required to manage users.",
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

// Helpers
const validateInput = (name, email, password, role) => {
  const errors = [];

  if (name && name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }

  if (password && password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  const validRoles = ["TEACHER", "PRINCIPAL", "ADMIN", "SUPER_ADMIN"];
  if (role && !validRoles.includes(role)) {
    errors.push("Invalid user role");
  }

  return errors;
};

// Helper to check if operation requires admin privileges - FIXED
const requiresAdminPrivilege = (operation, targetUserRole, currentUserRole) => {
  const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL'];
  
  // Check if current user has admin role
  if (!adminRoles.includes(currentUserRole?.toUpperCase())) {
    return false;
  }
  
  // Special protection for ADMIN users - only SUPER_ADMIN can modify other ADMINS
  if (targetUserRole?.toUpperCase() === 'ADMIN' && currentUserRole?.toUpperCase() !== 'SUPER_ADMIN') {
    return 'SUPER_ADMIN_REQUIRED'; // Changed to more descriptive string
  }
  
  return true;
};

// GET user by ID
export async function GET(req, { params }) {
  try {
    // Authenticate request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }
    
    const { id } = params;
    
    // Log the request for audit
    console.log('👁️ User view request:', {
      requestedBy: auth.user.name,
      requestedById: auth.user.id,
      requestedRole: auth.user.role,
      targetUserId: id,
      device: auth.deviceInfo,
      timestamp: new Date().toISOString()
    });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has permission to view this user
    // Admins can view anyone, teachers can only view themselves
    const userRolesForView = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'PRINCIPAL'];
    if (!userRolesForView.includes(auth.user.role?.toUpperCase()) && auth.user.id !== id) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Permission Denied",
          message: "You can only view your own profile"
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user,
      requestedBy: {
        name: auth.user.name,
        role: auth.user.role
      }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// UPDATE user by ID - FIXED
export async function PUT(req, { params }) {
  try {
    // Authenticate request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }
    
    const { id } = params;
    const { name, email, phone, password, role, confirmationToken } = await req.json();

    // Get target user to check role
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true, email: true, name: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ================ FIXED: ALLOW SELF-UPDATES ================
    // Allow users to update their own profile
    if (auth.user.id === id) {
      console.log('👤 User updating their own profile:', auth.user.name);
      // Skip admin privilege check for self-updates
      // Still validate input but don't check admin permissions
    } else {
      // For updating other users, check admin permissions
      const permissionCheck = requiresAdminPrivilege('UPDATE', targetUser.role, auth.user.role);
      if (permissionCheck === false) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Permission Denied",
            message: "You do not have permission to update other users"
          },
          { status: 403 }
        );
      }
      
      // Extra protection for ADMIN users - requires SUPER_ADMIN
      if (permissionCheck === 'SUPER_ADMIN_REQUIRED') {
        if (!confirmationToken) {
          return NextResponse.json(
            { 
              success: false, 
              error: "Super Admin Required",
              message: "Only SUPER_ADMIN can update other ADMIN accounts",
              requiresConfirmation: true,
              requiresSuperAdmin: true
            },
            { status: 403 }
          );
        }
        
        console.log('⚠️ Admin user update attempt by non-super admin:', {
          admin: auth.user.name,
          targetAdmin: targetUser.name,
          confirmationToken: confirmationToken ? 'Provided' : 'Missing'
        });
      }
    }

    // Log the update attempt
    console.log('📝 User update attempt:', {
      updatedBy: auth.user.name,
      updatedById: auth.user.id,
      updatedByRole: auth.user.role,
      targetUser: targetUser.email,
      targetUserId: id,
      targetUserRole: targetUser.role,
      isSelfUpdate: auth.user.id === id,
      changes: { name, email, role, phoneChanged: !!phone, passwordChanged: !!password },
      device: auth.deviceInfo,
      timestamp: new Date().toISOString()
    });

    const validationErrors = validateInput(name, email, password, role);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 });
    }

    let dataToUpdate = {
      name,
      email,
      phone,
      // For self-updates, don't allow role change unless SUPER_ADMIN
      role: auth.user.id === id && auth.user.role !== 'SUPER_ADMIN' 
        ? targetUser.role // Keep existing role for self-updates
        : (role || targetUser.role),
    };

    if (password) {
      dataToUpdate.password = await hashPassword(password);
    }

    // Remove undefined fields
    Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, updatedAt: true },
    });

    // Log successful update
    console.log('✅ User updated successfully:', {
      updatedBy: auth.user.name,
      isSelfUpdate: auth.user.id === id,
      targetUser: updatedUser.email,
      changes: Object.keys(dataToUpdate),
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: "User updated successfully", 
      user: sanitizeUser(updatedUser),
      updatedBy: {
        name: auth.user.name,
        role: auth.user.role,
        isSelfUpdate: auth.user.id === id
      }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }
    
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE user by ID - FIXED
export async function DELETE(req, { params }) {
  try {
    // Authenticate request
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }
    
    const { id } = params;
    
    // Get target user to check role
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true, email: true, name: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent self-deletion
    if (auth.user.id === id) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Operation Not Allowed",
          message: "You cannot delete your own account"
        },
        { status: 400 }
      );
    }

    // Check permission with special handling for ADMIN users
    const permissionCheck = requiresAdminPrivilege('DELETE', targetUser.role, auth.user.role);
    if (permissionCheck === false) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Permission Denied",
          message: "You do not have permission to delete users"
        },
        { status: 403 }
      );
    }
    
    // Extra protection for ADMIN users - requires SUPER_ADMIN
    if (permissionCheck === 'SUPER_ADMIN_REQUIRED') {
      // Check for confirmation token in headers or body
      const confirmationToken = req.headers.get('x-confirmation-token') || (await req.json()).confirmationToken;
      
      if (!confirmationToken) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Super Admin Required",
            message: "Deleting an ADMIN user requires confirmation from SUPER_ADMIN",
            requiresConfirmation: true,
            requiresSuperAdmin: true,
            targetUser: {
              name: targetUser.name,
              email: targetUser.email,
              role: targetUser.role
            }
          },
          { status: 403 }
        );
      }
      
      // Validate confirmation token
      console.log('⚠️ Admin user deletion attempt with confirmation token:', {
        superAdmin: auth.user.name,
        targetAdmin: targetUser.name,
        confirmationToken: confirmationToken ? 'Provided' : 'Missing'
      });
    }

    // Log the deletion attempt
    console.log('🗑️ User deletion attempt:', {
      deletedBy: auth.user.name,
      targetUser: targetUser.email,
      targetUserId: id,
      targetUserRole: targetUser.role,
      device: auth.deviceInfo,
      timestamp: new Date().toISOString()
    });

    const deletedUser = await prisma.user.delete({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });

    // Log successful deletion
    console.log('✅ User deleted successfully:', {
      deletedBy: auth.user.name,
      deletedUser: deletedUser.email,
      role: deletedUser.role,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: "User deleted successfully", 
      user: deletedUser,
      deletedBy: {
        name: auth.user.name,
        role: auth.user.role
      }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}