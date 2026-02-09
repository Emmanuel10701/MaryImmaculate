'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck,
  Key,
  Cpu,
  Database,
  Shield,
  Users,
  Building,
  Server,
  Network,
  Smartphone,
  CheckCircle,
  Globe,
  X,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Verification Modal States
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationReason, setVerificationReason] = useState('');
  const [requiresPasswordAfterVerification, setRequiresPasswordAfterVerification] = useState(false);
  const [passwordAfterVerification, setPasswordAfterVerification] = useState('');

  // Password Reset Modal
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const router = useRouter();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Device Fingerprint Generator
  class DeviceFingerprint {
    static generate() {
      const fingerprint = {
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio
        },
        language: navigator.language || navigator.userLanguage,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        languages: navigator.languages
      };

      return {
        raw: fingerprint,
        hash: this.hashFingerprint(fingerprint)
      };
    }

    static hashFingerprint(fingerprint) {
      const str = JSON.stringify(fingerprint);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36);
    }
  }

class LocalStorageManager {
    static KEYS = {
        DEVICE_FINGERPRINT: 'device_fingerprint',
        DEVICE_TOKEN: 'device_token',
        LOGIN_COUNT: 'login_count',
        LAST_LOGIN: 'last_login',
        ADMIN_TOKEN: 'admin_token',
        ADMIN_USER: 'admin_user',
        DASHBOARD_ACCESS: 'last_dashboard_access'
    };



static checkAdminTokenValidity() {
    try {
        const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
        
        if (!token) {
            return { isValid: false, reason: 'no_token' };
        }
        
        // Parse token to check expiration
        const tokenData = this.parseJwt(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (tokenData.exp && tokenData.exp <= currentTime) {
            console.log('🔑 Admin token expired');
            return { isValid: false, reason: 'expired' };
        }
        
        return { isValid: true, expiresAt: new Date(tokenData.exp * 1000) };
    } catch (error) {
        console.error('❌ Error checking admin token:', error);
        return { isValid: false, reason: 'parse_error' };
    }
}



    // Helper function for base64 URL decoding
    static base64UrlDecode(str) {
        // Replace URL-safe characters
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        const pad = str.length % 4;
        if (pad) {
            if (pad === 1) {
                throw new Error('Invalid base64 string');
            }
            str += '==='.slice(pad);
        }
        
        return atob(str);
    }

    // Helper function to parse JWT
    static parseJwt(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }
            
            const payload = parts[1];
            const decoded = this.base64UrlDecode(payload);
            return JSON.parse(decoded);
        } catch (error) {
            console.error('JWT parsing error:', error);
            throw error;
        }
    }
static checkVerificationRequirement(forceCheck = false) {
    try {
        console.log('🔍 Checking verification requirement:', { forceCheck });
        
        // If we're not forcing a check and have a valid device token, skip deep check
        if (!forceCheck) {
            const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            const storedFingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
            const currentFingerprint = DeviceFingerprint.generate();
            
            // Quick check: if we have a token and fingerprint matches, likely valid
            if (deviceToken && storedFingerprint === currentFingerprint.hash) {
                console.log('✅ Quick check passed - likely valid device');
                return { 
                    requiresVerification: false,
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }
        }
        
        // Full check (only when forced or quick check fails)
        const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
        const storedFingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
        const currentFingerprint = DeviceFingerprint.generate();
        
        console.log('📱 Full device data check:', {
            hasDeviceToken: !!deviceToken,
            hasStoredFingerprint: !!storedFingerprint,
            currentFingerprint: currentFingerprint.hash.substring(0, 10) + '...',
            storedFingerprint: storedFingerprint ? storedFingerprint.substring(0, 10) + '...' : 'none'
        });

        // CASE 1: No device token at all - new device
        if (!deviceToken) {
            console.log('📱 No device token found - NEW DEVICE');
            return { 
                requiresVerification: true, 
                reason: 'new_device',
                deviceToken: null,
                deviceHash: currentFingerprint.hash
            };
        }

        // CASE 2: Validate device token structure
        try {
            let tokenData;
            
            // Check if it's a JWT (has dots) or custom base64 token
            if (deviceToken.includes('.')) {
                // It's a JWT
                tokenData = this.parseJwt(deviceToken);
            } else {
                // Try to decode as custom base64 token
                const decodedStr = this.base64UrlDecode(deviceToken);
                tokenData = JSON.parse(decodedStr);
            }
            
            console.log('🔑 Token data parsed:', {
                deviceHash: tokenData.deviceHash ? `${tokenData.deviceHash.substring(0, 10)}...` : 'missing',
                loginCount: tokenData.loginCount || 0,
                exp: tokenData.exp ? new Date(tokenData.exp * 1000).toLocaleString() : 'missing'
            });

            // Check expiration (token.exp is in seconds)
            const currentTime = Math.floor(Date.now() / 1000);
            const tokenExpiry = tokenData.exp;
            
            if (!tokenExpiry) {
                console.log('❌ Token missing expiry');
                return { 
                    requiresVerification: true, 
                    reason: 'token_invalid',
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }

            // Check if token is expired
            if (tokenExpiry <= currentTime) {
                console.log('⏰ Token expired');
                return { 
                    requiresVerification: true, 
                    reason: 'token_expired',
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }

            // Check max login attempts (15)
            const loginCount = tokenData.loginCount || 0;
            if (loginCount >= 15) {
                console.log('🚫 Max login attempts reached:', loginCount);
                return { 
                    requiresVerification: true, 
                    reason: 'max_logins_reached',
                    deviceToken: deviceToken,
                    loginCount: loginCount,
                    deviceHash: currentFingerprint.hash
                };
            }

            // Check fingerprint matches
            if (storedFingerprint !== currentFingerprint.hash) {
                console.log('⚠️ Device fingerprint mismatch');
                return { 
                    requiresVerification: true, 
                    reason: 'device_mismatch',
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }

            // Check if device hash in token matches current fingerprint
            if (tokenData.deviceHash && tokenData.deviceHash !== currentFingerprint.hash) {
                console.log('🔐 Token device hash mismatch');
                return { 
                    requiresVerification: true, 
                    reason: 'token_device_mismatch',
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }

            console.log('✅ Device token is VALID');
            return { 
                requiresVerification: false, 
                deviceToken: deviceToken, 
                loginCount: loginCount,
                deviceHash: currentFingerprint.hash 
            };

        } catch (tokenError) {
            console.error('❌ Token parsing error:', tokenError);
            return { 
                requiresVerification: true, 
                reason: 'invalid_token_format',
                deviceToken: deviceToken,
                deviceHash: currentFingerprint.hash
            };
        }

    } catch (error) {
        console.error('❌ LocalStorage check error:', error);
        return { 
            requiresVerification: true, 
            reason: 'storage_error',
            deviceToken: null,
            deviceHash: null
        };
    }
}

    static storeDeviceData(deviceToken, deviceHash, loginCount) {
        try {
            console.log('💾 Storing device data:', {
                deviceTokenLength: deviceToken ? deviceToken.length : 0,
                deviceHash: deviceHash.substring(0, 10) + '...',
                loginCount: loginCount
            });
            
            localStorage.setItem(this.KEYS.DEVICE_TOKEN, deviceToken);
            localStorage.setItem(this.KEYS.DEVICE_FINGERPRINT, deviceHash);
            localStorage.setItem(this.KEYS.LAST_LOGIN, new Date().toISOString());
            localStorage.setItem(this.KEYS.LOGIN_COUNT, loginCount.toString());
            
            // Remove any old requires_verification flag
            localStorage.removeItem('requires_verification');
            
            console.log('✅ Device data stored successfully');
            
            // Verify storage
            const storedToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            const storedHash = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
            console.log('🔍 Storage verification:', {
                tokenStored: !!storedToken,
                hashStored: !!storedHash,
                tokenMatches: storedToken === deviceToken
            });
            
        } catch (error) {
            console.error('❌ Error storing device data:', error);
        }
    }

    static storeAuthData(authToken, userData) {
        try {
            localStorage.setItem(this.KEYS.ADMIN_TOKEN, authToken);
            localStorage.setItem(this.KEYS.ADMIN_USER, JSON.stringify(userData));
            console.log('🔐 Auth data stored');
        } catch (error) {
            console.error('❌ Error storing auth data:', error);
        }
    }

    static storeDashboardAccess() {
        try {
            localStorage.setItem(this.KEYS.DASHBOARD_ACCESS, new Date().toISOString());
            console.log('📊 Dashboard access timestamp stored');
        } catch (error) {
            console.error('❌ Error storing dashboard access:', error);
        }
    }

    static getLastDashboardAccess() {
        try {
            const timestamp = localStorage.getItem(this.KEYS.DASHBOARD_ACCESS);
            return timestamp ? new Date(timestamp) : null;
        } catch (error) {
            console.error('❌ Error getting dashboard access:', error);
            return null;
        }
    }

    static getAuthData() {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
            const user = userStr ? JSON.parse(userStr) : null;
            
            return { token, user };
        } catch (error) {
            console.error('❌ Error getting auth data:', error);
            return { token: null, user: null };
        }
    }

    static getDeviceData() {
        try {
            const token = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            const fingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
            const loginCount = parseInt(localStorage.getItem(this.KEYS.LOGIN_COUNT) || '0', 10);
            const lastLogin = localStorage.getItem(this.KEYS.LAST_LOGIN);
            
            return { token, fingerprint, loginCount, lastLogin };
        } catch (error) {
            console.error('❌ Error getting device data:', error);
            return { token: null, fingerprint: null, loginCount: 0, lastLogin: null };
        }
    }

    static clearLoginData() {
        try {
            localStorage.removeItem(this.KEYS.DEVICE_TOKEN);
            localStorage.removeItem(this.KEYS.DEVICE_FINGERPRINT);
            localStorage.removeItem(this.KEYS.LOGIN_COUNT);
            localStorage.removeItem(this.KEYS.LAST_LOGIN);
            localStorage.removeItem('requires_verification');
            console.log('🧹 Cleared all device login data');
        } catch (error) {
            console.error('❌ Error clearing login data:', error);
        }
    }

    static clearAllAuthData() {
        try {
            this.clearLoginData();
            localStorage.removeItem(this.KEYS.ADMIN_TOKEN);
            localStorage.removeItem(this.KEYS.ADMIN_USER);
            localStorage.removeItem(this.KEYS.DASHBOARD_ACCESS);
            console.log('🧹 Cleared all authentication data');
        } catch (error) {
            console.error('❌ Error clearing auth data:', error);
        }
    }

    static isAuthenticated() {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
            
            if (!token || !userStr) {
                return false;
            }
            
            // Optional: Check if token is expired (if it's a JWT)
            if (token.includes('.')) {
                try {
                    const tokenData = this.parseJwt(token);
                    const currentTime = Math.floor(Date.now() / 1000);
                    
                    if (tokenData.exp && tokenData.exp <= currentTime) {
                        console.log('🔑 Auth token expired');
                        return false;
                    }
                } catch (e) {
                    console.warn('Could not parse auth token for expiration check:', e);
                }
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error checking authentication:', error);
            return false;
        }
    }

    static getUser() {
        try {
            const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
            if (!userStr) {
                return null;
            }
            
            return JSON.parse(userStr);
        } catch (error) {
            console.error('❌ Error getting user:', error);
            return null;
        }
    }

    static getToken() {
        try {
            return localStorage.getItem(this.KEYS.ADMIN_TOKEN);
        } catch (error) {
            console.error('❌ Error getting token:', error);
            return null;
        }
    }

    static hasValidDeviceToken() {
        try {
            const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            if (!deviceToken) {
                return false;
            }
            
            const checkResult = this.checkVerificationRequirement();
            return !checkResult.requiresVerification;
        } catch (error) {
            console.error('❌ Error checking device token:', error);
            return false;
        }
    }

    static getLoginCount() {
        try {
            const count = localStorage.getItem(this.KEYS.LOGIN_COUNT);
            return count ? parseInt(count, 10) : 0;
        } catch (error) {
            console.error('❌ Error getting login count:', error);
            return 0;
        }
    }

    static incrementLoginCount() {
        try {
            const currentCount = this.getLoginCount();
            const newCount = currentCount + 1;
            localStorage.setItem(this.KEYS.LOGIN_COUNT, newCount.toString());
            
            // Also update the device token if it exists
            const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            if (deviceToken) {
                try {
                    let tokenData;
                    if (deviceToken.includes('.')) {
                        tokenData = this.parseJwt(deviceToken);
                    } else {
                        const decodedStr = this.base64UrlDecode(deviceToken);
                        tokenData = JSON.parse(decodedStr);
                    }
                    
                    // Update login count in token
                    tokenData.loginCount = newCount;
                    
                    // Re-encode the token (simple base64 for now)
                    const updatedToken = btoa(JSON.stringify(tokenData));
                    localStorage.setItem(this.KEYS.DEVICE_TOKEN, updatedToken);
                    
                    console.log('📈 Login count incremented to:', newCount);
                } catch (tokenError) {
                    console.error('❌ Error updating token login count:', tokenError);
                }
            }
            
            return newCount;
        } catch (error) {
            console.error('❌ Error incrementing login count:', error);
            return 0;
        }
    }

    static setRequiresVerification(reason = 'security_check') {
        try {
            localStorage.setItem('requires_verification', 'true');
            localStorage.setItem('verification_reason', reason);
            console.log('⚠️ Verification required set:', reason);
        } catch (error) {
            console.error('❌ Error setting verification requirement:', error);
        }
    }

    static clearVerificationFlag() {
        try {
            localStorage.removeItem('requires_verification');
            localStorage.removeItem('verification_reason');
            console.log('✅ Verification flags cleared');
        } catch (error) {
            console.error('❌ Error clearing verification flags:', error);
        }
    }

    static shouldShowVerification() {
        try {
            const requiresVerification = localStorage.getItem('requires_verification');
            const reason = localStorage.getItem('verification_reason');
            
            return {
                requires: requiresVerification === 'true',
                reason: reason || 'unknown'
            };
        } catch (error) {
            console.error('❌ Error checking verification flag:', error);
            return { requires: false, reason: 'error' };
        }
    }

    static debugAllStorage() {
        try {
            console.log('📋 === LOCALSTORAGE DEBUG INFO ===');
            
            // Device data
            const deviceData = this.getDeviceData();
            console.log('📱 Device Data:', deviceData);
            
            // Auth data
            const authData = this.getAuthData();
            console.log('🔐 Auth Data:', {
                hasToken: !!authData.token,
                tokenLength: authData.token ? authData.token.length : 0,
                user: authData.user ? {
                    id: authData.user.id,
                    name: authData.user.name,
                    email: authData.user.email,
                    role: authData.user.role
                } : null
            });
            
            // All localStorage items
            console.log('🗂️ All localStorage items:');
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                console.log(`  ${key}: ${value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : 'null'}`);
            }
            
            console.log('📋 === END DEBUG INFO ===');
        } catch (error) {
            console.error('❌ Error debugging storage:', error);
        }
    }
}

  // Handle verification code input
  const handleVerificationCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value.replace(/\D/g, '');
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`verification-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    setVerificationCode(newCode);
  };

  // Handle backspace
  const handleVerificationKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`verification-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

// Handle OTP verification
const handleVerifyCode = async (e) => {
  if (e) e.preventDefault();
  
  const code = verificationCode.join('');
  if (code.length !== 6) {
    toast.error('Please enter the complete 6-digit code');
    return;
  }

  setVerificationLoading(true);

  try {
    const deviceFingerprint = DeviceFingerprint.generate();
    
    // Get pending verification info
    const pendingVerification = JSON.parse(localStorage.getItem('pending_verification_device') || '{}');
    
    // Always use the stored verificationEmail
    const emailToUse = verificationEmail || formData.email;
    
    if (!emailToUse) {
      toast.error('Email not found. Please try logging in again.');
      setVerificationLoading(false);
      return;
    }
    
    console.log('🔐 Verifying OTP with reset info:', {
      email: emailToUse,
      deviceHash: deviceFingerprint.hash,
      pendingReason: pendingVerification.reason,
      shouldReset: pendingVerification.reason === 'max_logins_reached' || 
                  pendingVerification.reason === 'expired'
    });
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailToUse,
        verificationCode: code,
        action: 'verify',
        clientDeviceHash: deviceFingerprint.hash,
        // Tell backend to reset counts if max was reached
        shouldResetCounts: pendingVerification.reason === 'max_logins_reached' || 
                         pendingVerification.reason === 'expired'
      }),
    });

    const data = await response.json();
    console.log('📩 OTP verification response:', {
      success: data.success,
      countsWereReset: data.countsWereReset,
      loginCount: data.loginCount
    });

    if (response.ok && data.success) {
      // Clear the pending verification flag
      localStorage.removeItem('pending_verification_device');
      
      // Clear OLD device data if counts were reset
      if (data.countsWereReset) {
        console.log('🔄 Backend reset device counts. New count:', data.loginCount);
        
        // Clear ALL old device data
        LocalStorageManager.clearLoginData();
        
        // Store fresh device data with reset count (should be 1)
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(
            data.deviceToken, 
            deviceFingerprint.hash, 
            data.loginCount || 1
          );
        }
        
        toast.success(`Login successful! Device verification counts have been reset.`);
      } else {
        // Regular verification without reset
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(
            data.deviceToken, 
            deviceFingerprint.hash, 
            data.loginCount || 1
          );
        }
        
        toast.success(`Login successful! Welcome back ${data.user?.name || ''}.`);
      }
      
      // Store auth token
      if (data.token) {
        LocalStorageManager.storeAuthData(data.token, data.user);
      }
      
      // Clear all verification states
      setShowVerificationModal(false);
      setVerificationCode(['', '', '', '', '', '']);
      setVerificationEmail('');
      setPasswordAfterVerification('');
      setRequiresPasswordAfterVerification(false);
      
      // Show special message if counts were reset
      if (data.countsWereReset) {
        toast.info('Device verification counts have been reset. You now have 15 fresh logins available.');
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/MainDashboard');
      }, 1000);
    } else {
      // Check if password is required after verification
      if (data.requiresPassword === true) {
        setRequiresPasswordAfterVerification(true);
        setVerificationEmail(emailToUse);
        toast.info('Please enter your password to complete login.');
      } else {
        toast.error(data.error || 'Invalid verification code');
        setVerificationCode(['', '', '', '', '', '']);
        if (document.getElementById('verification-input-0')) {
          document.getElementById('verification-input-0').focus();
        }
      }
    }
  } catch (error) {
    toast.error('Network error. Please try again.');
    console.error('❌ Verification error:', error);
  } finally {
    setVerificationLoading(false);
  }
};

  // Resend verification code
  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);

    try {
      const deviceFingerprint = DeviceFingerprint.generate();
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verificationEmail,
          action: 'resend',
          clientDeviceHash: deviceFingerprint.hash,
          clientDeviceToken: localStorage.getItem('device_token')
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('New verification code sent! Check your email.');
        setCountdown(60);
        setVerificationCode(['', '', '', '', '', '']);
        if (document.getElementById('verification-input-0')) {
          document.getElementById('verification-input-0').focus();
        }
      } else {
        toast.error(data.error || 'Failed to resend code');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // Handle main login form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('🚀 Login form submitted');
  console.log('📧 Email:', formData.email);
  
  if (!isForgotMode) {
    if (!agreedToTerms) {
      toast.error("Verification Required: Please accept the Terms of Access before proceeding.");
      return;
    }

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
  } else {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }
    
    const loadingToast = toast.loading("Sending recovery instructions...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Recovery email sent! Check your inbox.");
      setIsForgotMode(false);
    }, 2000);
    return;
  }

  setIsLoading(true);
  
  const loadingToast = toast.loading('Authenticating...');

  try {
    // FIRST: Check if device verification is required
    const localStorageCheck = LocalStorageManager.checkVerificationRequirement(true); // Force full check on login
    const deviceFingerprint = DeviceFingerprint.generate();
    
    console.log('📊 Device verification check result:', {
      requiresVerification: localStorageCheck.requiresVerification,
      reason: localStorageCheck.reason,
      loginCount: localStorageCheck.loginCount,
      hasDeviceToken: !!localStorageCheck.deviceToken
    });
    
    // SCENARIO 1: Device is trusted - attempt direct login
    if (!localStorageCheck.requiresVerification && localStorageCheck.deviceToken) {
      console.log('✅ Device is trusted - attempting direct login');
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          clientDeviceToken: localStorageCheck.deviceToken,
          clientLoginCount: localStorageCheck.loginCount || 0,
          clientDeviceHash: deviceFingerprint.hash,
          action: 'login',
          skipDeviceCheck: true // Tell backend device is already verified
        }),
      });

      const data = await response.json();
      
      console.log('📩 Direct login response:', {
        success: data.success,
        hasToken: !!data.token,
        deviceTrusted: data.deviceTrusted
      });

      toast.dismiss(loadingToast);

      if (response.ok && data.success) {
        // Direct login successful - increment login count
        const newLoginCount = LocalStorageManager.incrementLoginCount();
        
        if (data.token) {
          LocalStorageManager.storeAuthData(data.token, data.user);
        }
        
        // Update device token if new one provided
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(data.deviceToken, deviceFingerprint.hash, newLoginCount);
        }
        
        toast.success(`Welcome back, ${data.user?.name || 'Admin'}! 🎉`);
        
        console.log('✅ Direct login successful. Login count:', newLoginCount);

        setTimeout(() => {
          router.push('/MainDashboard');
        }, 1500);
        
        return; // Stop here - login successful
      } else {
        // Direct login failed - fall back to normal flow
        console.log('⚠️ Direct login failed, falling back to normal flow');
        toast.dismiss(loadingToast);
      }
    }
    
    // SCENARIO 2: Device verification IS required OR direct login failed
    console.log('🔐 Device verification required, reason:', localStorageCheck.reason);
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        clientDeviceToken: localStorageCheck.deviceToken,
        clientLoginCount: localStorageCheck.loginCount || 0,
        clientDeviceHash: deviceFingerprint.hash,
        action: 'login'
      }),
    });

    const data = await response.json();
    
    console.log('📩 Login response:', {
      success: data.success,
      requiresVerification: data.requiresVerification,
      reason: data.reason,
      shouldResetAfterVerification: data.shouldResetAfterVerification
    });

    toast.dismiss(loadingToast);



    if (response.ok && data.requiresVerification === true) {
      console.log('🔐 Verification required, reason:', data.reason);
      
      setVerificationReason(data.reason || 'security_check');
      setVerificationEmail(data.email || formData.email);
      setShowVerificationModal(true);
      setCountdown(60);
     
      // Check if verification will reset counts
      const resetHint = data.shouldResetAfterVerification 
        ? "After verification, your device login counts will be reset to give you 15 fresh logins."
        : "";
      
      if (data.shouldResetAfterVerification) {
        toast.info(`Device verification required. ${resetHint}`);
      } else {
        toast.info('Device verification required. Check your email.');
      }
      
      // Clear the verification reason
      setRequiresPasswordAfterVerification(false);
      setPasswordAfterVerification('');
      
    } else if (data.success) {
      // Login successful without verification (new device or other scenario)
      console.log('✅ Login successful - No OTP needed');
      
      if (data.token) {
        LocalStorageManager.storeAuthData(data.token, data.user);
      }

      if (data.deviceToken) {
        LocalStorageManager.storeDeviceData(data.deviceToken, deviceFingerprint.hash, data.loginCount || 1);
      }

      toast.success(`Welcome back, ${data.user.name || 'Admin'}! 🎉`);

      setTimeout(() => {
        router.push('/MainDashboard');
      }, 1500);
      
    } else {
      // Login failed - password was wrong
      console.log('❌ Login failed:', data.error);
      toast.error(data.error || 'Login failed. Please try again.');
    }
    
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error('Network error. Please check your connection.');
    console.error('❌ Login error:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Close verification modal
  const closeVerificationModal = () => {
    setShowVerificationModal(false);
    setVerificationCode(['', '', '', '', '', '']);
    setVerificationLoading(false);
    setRequiresPasswordAfterVerification(false);
    setPasswordAfterVerification('');
  };

  // Handle password submit after verification
// Handle password submit after verification
const handlePasswordAfterVerification = async () => {
  if (!passwordAfterVerification) {
    toast.error('Please enter your password');
    return;
  }
  
  setVerificationLoading(true);
  
  try {
    const deviceFingerprint = DeviceFingerprint.generate();
    const localStorageCheck = LocalStorageManager.checkVerificationRequirement();
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: verificationEmail,
        password: passwordAfterVerification,
        verificationCode: verificationCode.join(''),
        action: 'verify_password',
        clientDeviceToken: localStorageCheck.deviceToken,
        clientLoginCount: localStorageCheck.loginCount,
        clientDeviceHash: deviceFingerprint.hash
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      // Check if counts were reset
      if (data.countsWereReset) {
        console.log('🔄 Backend reset device counts. New count:', data.loginCount);
        
        // Clear old device data to start fresh
        LocalStorageManager.clearLoginData();
        
        // Store fresh device data with reset count (should be 1)
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(
            data.deviceToken, 
            deviceFingerprint.hash, 
            data.loginCount || 1
          );
        }
        
        toast.success('Login successful! Device verification counts have been reset.');
      } else {
        // Regular login without reset
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(data.deviceToken, deviceFingerprint.hash, data.loginCount || 1);
        }
        
        toast.success('Login successful!');
      }
      
      // Store auth token
      if (data.token) {
        LocalStorageManager.storeAuthData(data.token, data.user);
      }
      
      // Clear all verification states
      setShowVerificationModal(false);
      setVerificationCode(['', '', '', '', '', '']);
      setVerificationEmail('');
      setPasswordAfterVerification('');
      setRequiresPasswordAfterVerification(false);
      
      // Show special message if counts were reset
      if (data.countsWereReset) {
        toast.info('Device verification counts have been reset. You now have 15 fresh logins available.');
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/MainDashboard');
      }, 1000);
    } else {
      toast.error(data.error || 'Invalid credentials');
      setPasswordAfterVerification('');
    }
  } catch (error) {
    toast.error('Network error. Please try again.');
    console.error('❌ Password verification error:', error);
  } finally {
    setVerificationLoading(false);
  }
};


  // Security features and system metrics
  const securityFeatures = [
    { icon: <Shield className="w-4 h-4" />, label: "Secure Student Data", color: "emerald" },
    { icon: <Cpu className="w-4 h-4" />, label: "Automated Fee Tracking", color: "blue" },
    { icon: <Database className="w-4 h-4" />, label: "Daily Cloud Backups", color: "purple" },
    { icon: <Network className="w-4 h-4" />, label: "Portal Access Control", color: "orange" },
  ];

  const systemMetrics = [
    { label: "Manage Students", value: "1000+", icon: <Users className="w-4 h-4" /> },
    { label: "School Status", value: "Online", icon: <Server className="w-4 h-4" /> },
    { label: "Manage Events", value: "12", icon: <Shield className="w-4 h-4" /> },
  ];

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Sonner Toaster */}
      <Toaster
        position={isMobile ? "top-center" : "top-right"}
        expand={false}
        richColors
        closeButton
      />

      {/* Password Reset Modal */}
      {showPasswordResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-[9999]">
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Password Reset Required
              </h3>
              <p className="text-slate-600">
                Multiple incorrect password attempts detected. For security reasons, you must reset your password.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  router.push(resetLink);
                  setShowPasswordResetModal(false);
                }}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
              >
                Reset Password Now
              </button>
              
              <button
                onClick={() => {
                  setShowPasswordResetModal(false);
                  setFormData({ email: '', password: '' });
                }}
                className="w-full py-3 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
{showVerificationModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 z-[9999] animate-fade-in overflow-y-auto">
    {/* Main Modal Container - Added max-h-screen and flex-col to handle internal scrolling */}
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md my-auto bg-gradient-to-br from-white to-slate-50 rounded-2xl md:rounded-3xl shadow-2xl border border-white/30 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
      
      {/* Modal Header - Shrink-0 prevents header from disappearing when zoomed */}
      <div className="relative p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shrink-0">
        <button
          onClick={closeVerificationModal}
          className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-xl transition-colors active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-black truncate">
              {requiresPasswordAfterVerification ? 'Enter Password' : 'Security Verification'}
            </h3>
            <p className="text-blue-100 text-xs mt-0.5 opacity-90 truncate">
              {requiresPasswordAfterVerification ? 'Complete your login' : 'Verify identity'}
            </p>
          </div>
        </div>
        
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full">
          <AlertCircle className="w-3 h-3" />
          <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap uppercase tracking-wider">
            {verificationReason?.replace(/_/g, ' ') || 'Action Required'}
          </span>
        </div>
      </div>
      
      {/* Scrollable Modal Content */}
      <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        {!requiresPasswordAfterVerification ? (
          <>
            <div className="mb-4 text-center">
              <p className="text-slate-600 text-xs sm:text-sm mb-3">
                6-digit code sent to:
              </p>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                <p className="text-blue-800 font-black text-sm break-all">{verificationEmail}</p>
              </div>
            </div>
            
            <div className="mb-6">
              {/* Input Grid - Grid layout handles zoom better than flex-center with gaps */}
              <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-4">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`verification-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                    className="w-full aspect-square text-center text-lg sm:text-xl font-black bg-white border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Expires: <span className="text-blue-600 font-mono">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span></span>
              </div>
            </div>
          </>
        ) : (
          <div className="mb-6">
            <p className="text-slate-600 text-sm mb-4 font-medium">
              Code verified! Enter password to finish.
            </p>
            <div className="relative group">
              <input
                type="password"
                value={passwordAfterVerification}
                onChange={(e) => setPasswordAfterVerification(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 pl-4 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                autoFocus
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={requiresPasswordAfterVerification ? handlePasswordAfterVerification : handleVerifyCode}
            disabled={verificationLoading || (!requiresPasswordAfterVerification && verificationCode.join('').length !== 6)}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {verificationLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{requiresPasswordAfterVerification ? 'COMPLETE LOGIN' : 'VERIFY CODE'}</span>
              </>
            )}
          </button>

          {!requiresPasswordAfterVerification && (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || countdown > 0}
              className="w-full py-3 text-slate-500 font-bold text-xs hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              Didn't get a code? <span className="underline">Resend</span>
            </button>
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
              This is a secure, encrypted verification. Your session is protected by 256-bit encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* MAIN LOGIN PAGE */}
      <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-3 sm:p-4 md:p-6 font-sans">
        <div className="max-w-6xl w-full scale-[0.95]  bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-xl sm:shadow-2xl shadow-slate-900/10 border border-white/40 overflow-hidden flex flex-col md:flex-row min-h-[500px] sm:min-h-[600px] md:min-h-[720px]">
          
          {/* Left Panel */}
          <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 relative overflow-hidden p-8 md:p-10 flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse"></div>
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `linear-gradient(90deg, #fff 1px, transparent 1px),
                                linear-gradient(180deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}></div>

            <div className="relative z-10">
              <h1 className="text-2xl sm:text-2xl lg:text-2xl font-black text-white mb-6 sm:mb-8 tracking-tighter leading-[0.95]">
                Mary I  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">Admin Portal</span>
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {securityFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="group p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-${feature.color}-500/20 mb-2 sm:mb-3`}>
                      <div className={`text-${feature.color}-400 scale-75 sm:scale-100`}>
                        {feature.icon}
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-white tracking-tight leading-tight">{feature.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mt-[14%]">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full "></div>
                  <h3 className="text-lg font-bold text-white">Live System Metrics</h3>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-4">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="text-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl">
                      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <div className="text-blue-300 scale-75 sm:scale-100">{metric.icon}</div>
                        <div className="text-lg sm:text-2xl font-black text-white">{metric.value}</div>
                      </div>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-tight">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-300">System Status</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                  All Systems Operational
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Login Interface */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center bg-white relative">
            <div className="md:hidden flex flex-col items-center mb-6 sm:mb-8">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl shadow-blue-500/30">
                  <ShieldCheck className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center border-3 sm:border-4 border-white">
                  <Key className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 text-center">MIGS Admin Portal</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2 text-center">Secure Admin Access</p>
            </div>

            <div className="max-w-md mx-auto w-full px-2 sm:px-0">
              <div className="mb-8 sm:mb-10 md:mb-12 text-center md:text-left">
                <div className="flex items-center gap-3 mb-3 sm:mb-4 justify-center md:justify-start">
                  <div className="w-2 h-4 sm:h-6 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full"></div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    {isForgotMode ? "Access Recovery" : "Secure Authentication"}
                  </h2>
                </div>
                <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed text-center md:text-left">
                  {isForgotMode 
                    ? "Provide your registered email to receive recovery instructions." 
                    : "Authenticate with your administrative credentials to access the control dashboard."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="group">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Workstation Email
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="admin@maryimmaculate.sc.ke"
                      className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-slate-50 border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 font-medium text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                    />
                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                {!isForgotMode && (
                  <div className="group">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Password
                        </label>
                      </div>
                      <button 
                        type="button"
                        onClick={() => (router.push("/pages/forgotpassword"))}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Key className="w-2 h-2 sm:w-3 sm:h-3" />
                        <span className="hidden xs:inline">Forgot password</span>
                        <span className="xs:hidden">Forgot password</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your password"
                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-slate-50 border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 font-medium text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                      />
                      <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg"
                      >
                        {showPassword ? 
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        }
                      </button>
                    </div>
                  </div>
                )}

                {!isForgotMode && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl border border-blue-100">
                      <label className="flex items-start gap-3 sm:gap-4 cursor-pointer group">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input 
                            type="checkbox" 
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer rounded border-2 border-blue-300 bg-white checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 mb-1">
                            Terms and Agreement
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            I understand this session is monitored, encrypted, and recorded for security auditing in compliance with institutional policies.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-800">Remember me on this device</p>
                          <p className="text-xs text-slate-500 hidden sm:block">Stay signed in without entering a code</p>
                          <p className="text-xs text-slate-500 sm:hidden">Stay signed in</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRememberDevice(!rememberDevice)}
                        className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                          rememberDevice ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                            rememberDevice ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg sm:shadow-xl shadow-blue-500/30 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                    {agreedToTerms ? (
                      isLoading ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="text-sm sm:text-base">Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm sm:text-base">{isForgotMode ? "Request Access" : "Access Dashboard"}</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      )
                    ) : (
                      <span className="text-sm sm:text-base text-slate-300">Please agree to Terms</span>
                    )}
                  </div>
                </button>

                {isForgotMode && (
                  <button 
                    type="button"
                    onClick={() => setIsForgotMode(false)}
                    className="w-full text-center text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors py-2 sm:py-3"
                  >
                    ← Return to authentication
                  </button>
                )}
              </form>

              <div className="mt-8 sm:mt-12 md:mt-16 pt-4 sm:pt-6 md:pt-8 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                    <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
                      Data Center: Matungulu, Machakos
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                    <a href="/pages/TermsandPrivacy" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
                      Security Protocol
                    </a>
                    <a href="#" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
                      Compliance
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse z-50"></div>
        <div className={`fixed ${isMobile ? 'bottom-2 right-2' : 'bottom-4 right-4'} z-50`}>
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-slate-900/90 backdrop-blur-md rounded-full border border-white/10">
            <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="text-base font-bold text-white  inline">Prayer, Discipline and Hardwork</span>
          </div>
        </div>
      </div>
    </>
  );
}