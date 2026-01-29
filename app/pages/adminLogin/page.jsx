'use client';

import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

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

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isForgotMode) {
      if (!agreedToTerms) {
        toast.error("Verification Required: Please accept the Terms of Access before proceeding.", {
          duration: 5000,
          icon: '⚠️',
          style: {
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fbbf24',
          }
        });
        return;
      }

      // Validate form data
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all required fields", {
          duration: 3000,
          icon: '📝',
        });
        return;
      }
    } else {
      // Handle forgot password mode
      if (!formData.email) {
        toast.error("Please enter your email address", {
          duration: 3000,
          icon: '📧',
        });
        return;
      }
      
      toast.loading("Sending recovery instructions...", { duration: 2000 });
      setTimeout(() => {
        toast.success("Recovery email sent! Check your inbox.", {
          duration: 4000,
          icon: '✅',
        });
        setIsForgotMode(false);
      }, 2000);
      return;
    }

    setIsLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Authenticating...', {
      duration: Infinity,
    });

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok && data.success) {
        // Store token in localStorage or cookies
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
          localStorage.setItem('admin_user', JSON.stringify(data.user));
        }

        // Success toast - modernized
        toast.success(`Welcome back, ${data.user.name || 'Admin'}! 🎉`, {
          duration: 3000,
          icon: '✅',
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '14px',
            padding: '18px 22px',
            fontSize: '15px',
            fontWeight: '600',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#059669',
          },
        });

        // Delay redirect to show success message
        setTimeout(() => {
          router.push('/MainDashboard');
        }, 1500);
      } else {
        // Error toast - modernized
        toast.error(data.error || 'Login failed. Please try again.', {
          duration: 4000,
          icon: '⚠️',
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '14px',
            padding: '18px 22px',
            fontSize: '15px',
            fontWeight: '600',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#dc2626',
          },
        });
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Network error toast - modernized
      toast.error('Network error. Please check your connection.', {
        duration: 4000,
        icon: '📡',
        style: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '14px',
          padding: '18px 22px',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
        },
        iconTheme: {
          primary: 'white',
          secondary: '#d97706',
        },
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position={isMobile ? "top-center" : "top-right"}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '14px',
            boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.1)',
            maxWidth: isMobile ? 'calc(100vw - 32px)' : 'auto',
            fontSize: isMobile ? '14px' : '16px',
          },
          success: {
            style: {
              background: '#d1fae5',
              color: '#065f46',
              border: '1px solid #10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #f87171',
            },
            iconTheme: {
              primary: '#f87171',
              secondary: '#fff',
            },
          },
          loading: {
            style: {
              background: '#f0f9ff',
              color: '#0369a1',
              border: '1px solid #0ea5e9',
            },
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-3 sm:p-4 md:p-6 font-sans">
        {/* Modern Glass Container */}
        <div className="max-w-6xl w-full bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-xl sm:shadow-2xl shadow-slate-900/10 border border-white/40 overflow-hidden flex flex-col md:flex-row min-h-[500px] sm:min-h-[600px] md:min-h-[720px]">
          
          {/* Left Panel: Cyberpunk Security Interface - Hidden on small mobile */}
          <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 relative overflow-hidden p-8 md:p-10 flex-col justify-between">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse"></div>
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `linear-gradient(90deg, #fff 1px, transparent 1px),
                                linear-gradient(180deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}></div>

            <div className="relative z-10">
              {/* Title - School name updated */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 sm:mb-8 tracking-tighter leading-[0.95]">
                Katz  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">Admin Portal</span>
              </h1>

              {/* Security Features Grid */}
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

              {/* System Metrics */}
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

            {/* Bottom Status */}
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
            {/* Mobile Header - Only shown on small screens */}
            <div className="md:hidden flex flex-col items-center mb-6 sm:mb-8">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl shadow-blue-500/30">
                  <ShieldCheck className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center border-3 sm:border-4 border-white">
                  <Key className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                </div>
              </div>
              {/* Mobile title updated */}
              <h2 className="text-lg sm:text-xl font-black text-slate-900 text-center">Katz Admin Portal</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2 text-center">Secure Admin Access</p>
            </div>

            <div className="max-w-md mx-auto w-full px-2 sm:px-0">
              {/* Header */}
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Email Field */}
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
                      placeholder="admin@katwanyaahighschool.sc.ke"
                      className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-slate-50 border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 font-medium text-slate-900 placeholder-slate-400 text-sm sm:text-base"
                    />
                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                {/* Password Field */}
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

                {/* Security Options */}
                {!isForgotMode && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Terms */}
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

                    {/* Remember Device */}
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

                {/* Submit Button */}
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

                {/* Back to Login */}
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

              {/* Security Footer */}
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

        {/* Floating Security Elements - Adjusted for mobile */}
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