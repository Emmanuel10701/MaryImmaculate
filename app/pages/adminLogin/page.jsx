'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { 
  FiUser, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiLogIn, 
  FiShield,
  FiSettings,
  FiDatabase,
  FiBarChart2,
  FiUsers,
  FiBook,
  FiMail,
  FiPhone,
  FiLoader,
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
  FiTarget,
  FiBookOpen,
  FiAward,
  FiStar,
  FiChevronRight,
  FiHome,
  FiClock,
  FiActivity
} from 'react-icons/fi';
import { FaChalkboardTeacher, FaUserGraduate, FaRunning } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();

  // Fetch real stats from backend when component loads
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);
        
        const [
          studentsRes,
          staffRes,
          subscribersRes,
          assignmentsRes,
          eventsRes
        ] = await Promise.allSettled([
          fetch('/api/student'),
          fetch('/api/staff'),
          fetch('/api/subscriber'),
          fetch('/api/assignment'),
          fetch('/api/events')
        ]);

        const students = studentsRes.status === 'fulfilled' ? await studentsRes.value.json() : { students: [] };
        const staff = staffRes.status === 'fulfilled' ? await staffRes.value.json() : { staff: [] };
        const subscribers = subscribersRes.status === 'fulfilled' ? await subscribersRes.value.json() : { subscribers: [] };
        const assignments = assignmentsRes.status === 'fulfilled' ? await assignmentsRes.value.json() : { assignments: [] };
        const events = eventsRes.status === 'fulfilled' ? await eventsRes.value.json() : { events: [] };

        const activeStudents = students.students?.filter(s => s.status === 'Active').length || 0;
        const totalStudents = students.students?.length || 0;
        const activeAssignments = assignments.assignments?.filter(a => a.status === 'active').length || 0;
        const upcomingEvents = events.events?.filter(e => new Date(e.date) > new Date()).length || 0;

        setStats({
          totalStudents,
          activeStudents,
          totalStaff: staff.staff?.length || 0,
          totalSubscribers: subscribers.subscribers?.length || 0,
          activeAssignments,
          upcomingEvents,
          classesToday: calculateTodaysClasses(events.events),
          pendingTasks: calculatePendingTasks(assignments.assignments),
          averageAttendance: 94.7,
          topPerformers: 12,
          newAdmissions: 8
        });

      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalStudents: 452,
          activeStudents: 447,
          totalStaff: 38,
          totalSubscribers: 125,
          activeAssignments: 23,
          upcomingEvents: 7,
          classesToday: 12,
          pendingTasks: 9,
          averageAttendance: 94.7,
          topPerformers: 12,
          newAdmissions: 8
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const calculateTodaysClasses = (events = []) => {
    const today = new Date().toDateString();
    return events.filter(event => 
      new Date(event.date).toDateString() === today && 
      event.type === 'class'
    ).length;
  };

  const calculatePendingTasks = (assignments = []) => {
    return assignments.filter(assignment => 
      assignment.status === 'pending' || assignment.status === 'assigned'
    ).length;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Login successful!', {
          description: 'Welcome back to the admin dashboard',
          icon: '🎯',
        });
        
        setTimeout(() => {
          router.push('/MainDashboard');
        }, 1500);
      } else {
        throw new Error(data.message || 'Login failed');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessages = {
        'user not found': 'User not found. Please check your email.',
        'invalid password': 'Incorrect password. Please try again.',
        'network': 'Network error. Check your connection.'
      };
      
      const lowerError = error.message.toLowerCase();
      let message = 'Login failed. Please try again.';
      
      Object.entries(errorMessages).forEach(([key, value]) => {
        if (lowerError.includes(key)) {
          message = value;
        }
      });
      
      toast.error('Access Denied', {
        description: message,
        icon: '🔒',
      });
      
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const adminFeatures = [
    {
      icon: FiUsers,
      title: 'Student Management',
      description: `Manage ${stats?.totalStudents || 452} student records`,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      icon: FaChalkboardTeacher,
      title: 'Academic Planning',
      description: `${stats?.activeAssignments || 23} active assignments`,
      color: 'from-emerald-600 to-emerald-700',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-100'
    },
    {
      icon: FiBarChart2,
      title: 'Analytics Dashboard',
      description: 'Real-time performance insights',
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100'
    },
    {
      icon: FiDatabase,
      title: 'Data Management',
      description: `${stats?.totalStaff || 38} staff members`,
      color: 'from-orange-600 to-orange-700',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100'
    }
  ];

  const quickStats = stats ? [
    { 
      label: 'Active Students', 
      value: stats.activeStudents,
      icon: FaUserGraduate,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+5%'
    },
    { 
      label: 'Teaching Staff', 
      value: stats.totalStaff,
      icon: FiUsers,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: 'Full'
    },
    { 
      label: 'Classes Today', 
      value: stats.classesToday,
      icon: FiCalendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '12 sessions'
    },
    { 
      label: 'Top Performers', 
      value: stats.topPerformers || 12,
      icon: FiStar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      trend: 'A+ average'
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 font-sans relative overflow-hidden">
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
        theme="light"
        className="font-sans"
      />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <Link href="/" className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-200/50 shadow-lg mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                NSS
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-gray-900">Nyaribu Secondary School</div>
                <div className="text-xs text-gray-600">Soaring for Excellence</div>
              </div>
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Admin Portal
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Secure access to comprehensive school management tools and analytics
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Login Form */}
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-6 sm:p-8 md:p-10 relative overflow-hidden">
                  {/* Form Decorative */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="relative">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-6 shadow-xl">
                        <FiShield className="text-white text-3xl" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                        Secure Sign In
                      </h2>
                      <p className="text-gray-600">
                        Enter your credentials to access the admin dashboard
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-1">
                        <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                          <FiMail className="text-blue-600" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full border-2 ${
                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                          } rounded-xl px-5 py-4 text-gray-700 focus:outline-none focus:ring-3 focus:ring-blue-500/20 transition-all text-base`}
                          placeholder="admin@nyaribosecondary.ac.ke"
                          disabled={isLoading}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className=" text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                          <FiLock className="text-blue-600" />
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full border-2 ${
                              errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                            } rounded-xl px-5 py-4 text-gray-700 focus:outline-none focus:ring-3 focus:ring-blue-500/20 transition-all text-base pr-12`}
                            placeholder="••••••••"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                          >
                            {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {errors.password}
                          </p>
                        )}
                      </div>
<div className="flex items-center justify-between">
  {/* Remember me */}
  <label className="flex items-center gap-3 text-gray-700 text-sm cursor-pointer group">
    {/* Hidden real checkbox */}
    <input
      type="checkbox"
      checked={formData.rememberMe}
      onChange={(e) =>
        setFormData({ ...formData, rememberMe: e.target.checked })
      }
      className="sr-only"
    />

    {/* Custom checkbox UI */}
    <div
      className={`relative w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all
        ${
          formData.rememberMe
            ? "bg-blue-600 border-blue-600"
            : "bg-white border-gray-300 group-hover:border-blue-400"
        }`}
    >
      {formData.rememberMe && (
        <FiCheckCircle className="text-white text-xs" />
      )}
    </div>

    <span className="font-medium select-none">Remember me</span>
  </label>

  {/* Forgot password */}
  <button
    type="button"
    disabled={isLoading}
    className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
    onClick={() => router.push("/pages/forgotpassword")}
  >
    Forgot password? <FiChevronRight />
  </button>
</div>


                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl  transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <FiLogIn className="text-xl" />
                            <span>Sign In to Dashboard</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Security Badge */}
                    <div className="mt-8 p-5 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <FiShield className="text-white text-xl" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Enterprise-Grade Security</div>
                          <div className="text-sm text-gray-600">256-bit encryption & multi-factor authentication</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Dashboard Preview */}
            <div className="space-y-6 sm:space-y-8">
              {/* School Motto */}
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FaRunning className="text-2xl" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold opacity-90 tracking-wider">OUR MOTTO</div>
                    <div className="text-2xl sm:text-3xl font-bold mt-1">Soaring for Excellence</div>
                  </div>
                </div>
                <p className="text-blue-100 text-sm sm:text-base leading-relaxed opacity-90">
                  Nyaribu Secondary School is committed to providing world-class education 
                  that empowers students to reach their highest potential and achieve academic excellence.
                </p>
              </div>

              {/* Live Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {statsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-5 shadow-sm">
                      <div className="animate-pulse">
                        <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  quickStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <stat.icon className={`${stat.color} text-xl`} />
                        </div>
                        <div className="text-xs font-semibold px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg text-gray-600">
                          {stat.trend}
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Features with Enhanced Design */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {adminFeatures.map((feature, index) => (
                  <div
                    key={feature.title}
                    className={`${feature.bgColor} rounded-2xl border border-gray-200/50 p-5 hover:shadow-lg transition-all group cursor-pointer`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <feature.icon className={`text-xl ${feature.color.replace('from-', 'text-').split(' ')[0]}`} />
                      </div>
                      <h3 className="text-gray-900 font-bold text-base">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-gray-700">
                      <span>Access Now</span>
                      <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact & Support */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200/50 p-6 shadow-sm">
                <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <FiSettings className="text-white text-lg" />
                  </div>
                  <span>Technical Support</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200/50">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FiMail className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email Support</div>
                      <div className="text-sm font-semibold text-gray-900">support@nyaribosecondary.ac.ke</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200/50">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <FiPhone className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Emergency Line</div>
                      <div className="text-sm font-semibold text-gray-900">+254 700 000 000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 sm:mt-12 pt-6 border-t border-gray-200/50 text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Nyaribu Secondary School. 
              <span className="mx-2">•</span>
              <span className="font-semibold text-blue-600">Excellence in Education Since 1998</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}