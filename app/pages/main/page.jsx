'use client';

import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import StudentLoginModal from '../../components/studentloginmodel/page';
import NavigationSidebar from '../../components/studentportalcomponents/aside/page.jsx';
import ResultsView from '../../components/studentportalcomponents/result/page.jsx';
import ResourcesAssignmentsView from '../../components/studentportalcomponents/ass/page.jsx';
import GuidanceEventsView from '../../components/studentportalcomponents/session/page';
import LoadingScreen from '../../components/studentportalcomponents/loading/page';

/// Font Awesome 6 - Modern versions (Some names are slightly different)
import { 
   FaBell, FaBars, FaCalendar, FaBook, FaAward, FaDollarSign, 
  FaClock, FaChartLine, FaCheckCircle, FaChartBar, FaFolder, FaComments,
  FaRocket, FaPalette, FaGem, FaChartPie, FaTrendingUp, FaCrown,
  FaLightbulb, FaBrain, FaHandshake, FaHeart, FaLock, FaGlobe, 
  FaArrowRight, FaFire, FaBolt, FaCalendarCheck, FaUserPlus, 
  FaUserCheck, FaRoute, FaDirections, FaQrcode, FaFingerprint, 
  FaIdCard, FaDesktop, FaWandMagic, FaUser
} from 'react-icons/fa6';

// Font Awesome 5 (Legacy) - Use these for the names that failed in fa6
import { 
  FaHome, 
  FaSearch,
  FaTimes, 
  FaSync, 
  FaExclamationCircle, 
  FaCircleExclamation, 
  FaSparkles,
  FaCloudUpload,
  FaUserFriends,
  FaQuestionCircle
} from 'react-icons/fa';
import { HiSparkles } from "react-icons/hi2";



// FIXED: Feather icons from 'react-icons/fi'
import { 
  FiMenu, FiX, FiRefreshCw, FiBookOpen,
  FiExternalLink, FiShield, FiExpand, FiCompress,
  FiMapPin, FiSmartphone, FiTablet
} from 'react-icons/fi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ==================== MODERN STUDENT HEADER ====================
function ModernStudentHeader({ 
  student, 
  searchTerm, 
  setSearchTerm, 
  onRefresh,
  onMenuToggle,
  isMenuOpen,
  currentView 
}) {
  
  const getInitials = (name) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const getGradientColor = (name) => {
    const char = name.trim().charAt(0).toUpperCase();
    const gradients = {
      A: "bg-gradient-to-r from-red-500 to-pink-600",
      B: "bg-gradient-to-r from-blue-500 to-cyan-600",
      C: "bg-gradient-to-r from-green-500 to-emerald-600",
      D: "bg-gradient-to-r from-purple-500 to-pink-600",
      E: "bg-gradient-to-r from-emerald-500 to-teal-600",
      F: "bg-gradient-to-r from-pink-500 to-rose-600",
      G: "bg-gradient-to-r from-orange-500 to-amber-600",
      H: "bg-gradient-to-r from-indigo-500 to-violet-600",
      I: "bg-gradient-to-r from-cyan-500 to-blue-600",
      J: "bg-gradient-to-r from-rose-500 to-red-600",
      K: "bg-gradient-to-r from-amber-500 to-yellow-600",
      L: "bg-gradient-to-r from-violet-500 to-purple-600",
      M: "bg-gradient-to-r from-lime-500 to-green-600",
      N: "bg-gradient-to-r from-sky-500 to-blue-600",
      O: "bg-gradient-to-r from-fuchsia-500 to-purple-600",
      P: "bg-gradient-to-r from-teal-500 to-emerald-600",
      Q: "bg-gradient-to-r from-slate-600 to-gray-700",
      R: "bg-gradient-to-r from-red-400 to-pink-500",
      S: "bg-gradient-to-r from-blue-400 to-cyan-500",
      T: "bg-gradient-to-r from-emerald-400 to-green-500",
      U: "bg-gradient-to-r from-indigo-400 to-purple-500",
      V: "bg-gradient-to-r from-purple-400 to-pink-500",
      W: "bg-gradient-to-r from-orange-400 to-amber-500",
      X: "bg-gradient-to-r from-gray-500 to-slate-600",
      Y: "bg-gradient-to-r from-yellow-400 to-amber-500",
      Z: "bg-gradient-to-r from-zinc-700 to-gray-900",
    };
    return gradients[char] || "bg-gradient-to-r from-blue-500 to-purple-600";
  };

  const getViewIcon = (view) => {
    switch(view) {
      case 'home': return <FaHome className="text-blue-500" />;
      case 'results': return <FaChartBar className="text-green-500" />;
      case 'resources': return <FaFolder className="text-purple-500" />;
      case 'guidance': return <FaComments className="text-amber-500" />;
      default: return <FaHome className="text-blue-500" />;
    }
  };

  return (
<header className="bg-gradient-to-r from-white via-gray-50 to-blue-50 border-b border-gray-200/50 shadow-xl sticky top-0 z-30 backdrop-blur-sm bg-white/80">
  <div className="container mx-auto px-6">
    <div className="flex items-center justify-between h-20">

      {/* Left Section: Student Info + Mobile Menu */}
      <div className="flex items-center gap-5">

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm hover:shadow-md transition-all"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes className="text-gray-700" /> : <FaBars className="text-gray-700" />}
        </button>

        {/* Student Info */}
        {student && (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative group">
              <div
                className={`absolute inset-0 ${getGradientColor(student.fullName)} rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity`}
              />
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-white shadow-lg">
                {getInitials(student.fullName)}
              </div>
            </div>

            {/* Name & Form/Stream */}
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-bold text-gray-900">
                {student.fullName}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {student.form} • {student.stream}
                </span>
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current View (Mobile Only) */}
      <div className="lg:hidden flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-sm">
          {getViewIcon(currentView)}
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {currentView === 'home' && 'Dashboard'}
            {currentView === 'results' && 'Academic Results'}
            {currentView === 'resources' && 'Resources'}
            {currentView === 'guidance' && 'Guidance'}
          </h1>
          <p className="text-xs text-gray-500">Student Portal</p>
        </div>
      </div>

    </div>
  </div>
</header>

  );
}

// ==================== MODERN HOME VIEW ====================
function ModernHomeView({ student, feeBalance, feeLoading }) {
  const [showFeeDetails, setShowFeeDetails] = useState(false);

  const stats = [
    { 
      label: 'Current Form', 
      value: `${student?.form || 'N/A'}`, 
      icon: <FaUser className="text-lg" />, 
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    { 
      label: 'Stream', 
      value: student?.stream || 'N/A', 
      icon: <FaBook className="text-lg" />, 
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-100'
    },
    { 
      label: 'Admission No', 
      value: student?.admissionNumber || 'N/A', 
      icon: <FaAward className="text-lg" />, 
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-100'
    },
    { 
      label: 'Academic Year', 
      value: '2024', 
      icon: <FaCalendar className="text-lg" />, 
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-100'
    },
  ];

  const quickActions = [
    {
      title: 'Pending Assignments',
      description: 'Check and submit your pending assignments',
      icon: <FaClock className="text-xl" />,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-100',
      action: 'View Assignments →'
    },
    {
      title: 'Recent Results',
      description: 'View your latest exam results and progress',
      icon: <FaChartLine className="text-xl" />,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-100',
      action: 'Check Results →'
    },
    {
      title: 'Learning Resources',
      description: 'Access study materials and resources',
      icon: <FiBookOpen className="text-xl" />,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-100',
      action: 'Browse Resources →'
    },
  ];

  const getFeeStatusColor = (balance) => {
    if (balance <= 0) return 'from-emerald-500 to-green-600';
    if (balance < 1000) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-20"></div>
      <div className="relative p-4 sm:p-6 lg:p-8 text-white">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
    {/* Icon */}
    <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm w-fit">
      <FaRocket className="text-xl sm:text-2xl" />
    </div>

    {/* Text */}
    <div>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
        Welcome back, {student?.fullName?.split(" ")[0] || "Student"}! 🚀
      </h2>

      <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 max-w-2xl">
        Ready to continue your learning journey? Check assignments, view results, and track progress.
      </p>
    </div>
  </div>

  {/* Badges */}
  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
    <span className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm font-bold">
      <HiSparkles className="text-yellow-300 text-sm sm:text-base" />
      Active Student
    </span>

    <span className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm font-bold">
      <FaCalendarCheck className="text-blue-200 text-sm sm:text-base" />
Katz    </span>
  </div>
</div>

      </div>

   {/* Quick Stats */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
  {stats.map((stat, index) => (
    <div key={index} className="group relative">
      {/* Background Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>

      {/* Main Card */}
      <div
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 
        border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
        hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        {/* Subtle Decorative Pattern */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />

        <div className="flex flex-col h-full">
          {/* Top Row: Icon and Trends */}
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 bg-gradient-to-br ${stat.gradient}
              rounded-2xl text-white shadow-lg shadow-blue-500/20 
              group-hover:scale-110 transition-transform duration-300`}
            >
              {/* Ensure your icons are correctly imported as discussed earlier */}
              {stat.icon}
            </div>
            
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {stat.category || 'School Update'}
              </span>
              <div className="flex items-center text-emerald-500 font-bold text-xs mt-1">
                <span>↑ {stat.trend || '12%'}</span>
              </div>
            </div>
          </div>

          {/* Value and Label */}
          <div className="mt-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {stat.value}
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {stat.label}
            </p>
          </div>

          {/* School Info Footer (Replaces Progress Bar) */}
          <div className="mt-5 flex items-center justify-between py-3 border-t border-gray-100">
            <div className="flex -space-x-2">
              {/* Small User Avatars for "Students Active" feel */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400">
                +
              </div>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 italic">
              Updated: {stat.lastUpdate || 'Just Now'}
            </span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


{/* Fee Balance Card */}
<div className="relative group">
  {/* Glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity" />

  {/* Card */}
  <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-gray-200/50 shadow-lg sm:shadow-xl overflow-hidden">
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl sm:rounded-2xl">
            <FaDollarSign className="text-blue-600 text-xl sm:text-2xl" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Fee Balance
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              Current outstanding fees
            </p>
          </div>
        </div>

        <div
          className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${getFeeStatusColor(
            feeBalance?.summary?.totalBalance || 0
          )} bg-clip-text text-transparent`}
        >
          KES {feeBalance?.summary?.totalBalance?.toLocaleString() || "0"}
        </div>
      </div>

      {/* Loading */}
      {feeLoading ? (
        <div className="space-y-3">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 animate-pulse" />
        </div>
      ) : feeBalance ? (
        <div className="space-y-5 sm:space-y-6">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <FaChartPie className="text-gray-400 text-sm sm:text-base" />
                <span className="text-xs sm:text-sm font-bold text-gray-600">
                  Payment Progress
                </span>
              </div>

              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                {feeBalance.summary.totalAmount > 0
                  ? `${Math.round(
                      (feeBalance.summary.totalPaid /
                        feeBalance.summary.totalAmount) *
                        100
                    )}%`
                  : "0%"}
              </span>
            </div>

            <div className="h-2.5 sm:h-3 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all"
                style={{
                  width:
                    feeBalance.summary.totalAmount > 0
                      ? `${
                          (feeBalance.summary.totalPaid /
                            feeBalance.summary.totalAmount) *
                          100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>

          {/* Fee Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-200 text-center transition-transform sm:group-hover:scale-105">
              <div className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                Total Fees
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                KES {feeBalance.summary.totalAmount.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-emerald-200 text-center transition-transform sm:group-hover:scale-105">
              <div className="text-emerald-600 text-xs sm:text-sm mb-1 sm:mb-2">
                Total Paid
              </div>
              <div className="text-lg sm:text-2xl font-bold text-emerald-700">
                KES {feeBalance.summary.totalPaid.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-red-200 text-center transition-transform sm:group-hover:scale-105">
              <div className="text-red-600 text-xs sm:text-sm mb-1 sm:mb-2">
                Outstanding
              </div>
              <div className="text-lg sm:text-2xl font-bold text-red-700">
                KES {feeBalance.summary.totalBalance.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FaExclamationCircle className="text-gray-400 text-xl sm:text-2xl" />
          </div>
          <p className="text-gray-500 text-sm">
            No fee data available
          </p>
        </div>
      )}
    </div>
  </div>
</div>

 {/* Quick Actions */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
  {quickActions.map((action, index) => (
    <div key={index} className="group relative">
      {/* Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${action.gradient} rounded-2xl sm:rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity`}
      ></div>

      {/* Card */}
      <div
        className={`relative bg-gradient-to-br ${action.bgGradient} rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-gray-200/50 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div
            className={`p-2.5 sm:p-3 bg-gradient-to-r ${action.gradient} rounded-xl sm:rounded-2xl text-white shadow-lg flex items-center justify-center`}
          >
            {action.icon}
          </div>
          <h4 className="text-lg sm:text-xl md:text-xl font-bold text-gray-900">
            {action.title}
          </h4>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm md:text-sm mb-4 sm:mb-5 leading-relaxed">
          {action.description}
        </p>

        {/* Action Button */}
        <button className="text-blue-600 text-xs sm:text-sm font-bold hover:text-blue-800 flex items-center gap-1.5 sm:gap-2 group-hover:gap-2.5 transition-all">
          {action.action}
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

// ==================== MAIN MODERN COMPONENT ====================
export default function ModernStudentPortalPage() {
  // Authentication State
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [requiresContact, setRequiresContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // View State
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Data State
  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [feeBalance, setFeeBalance] = useState(null);
  
  // Loading States
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [feeLoading, setFeeLoading] = useState(false);

  // Error States
  const [assignmentsError, setAssignmentsError] = useState(null);
  const [resourcesError, setResourcesError] = useState(null);
  const [resultsError, setResultsError] = useState(null);
  const [feeError, setFeeError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('student_token');
        if (!savedToken) {
          setShowLoginModal(true);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/studentlogin', {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        });

        const data = await response.json();

        if (data.success && data.authenticated) {
          setStudent(data.student);
          setToken(savedToken);
          setShowLoginModal(false);
          
          const logoutTimer = setTimeout(() => {
            toast.success('Your 2-hour session has expired. Please log in again.');
            handleLogout();
          }, 2 * 60 * 60 * 1000);

          return () => clearTimeout(logoutTimer);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (student && token) {
      fetchAllData();
    }
  }, [student, token]);

  // Close sidebar when switching views on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    if (window.innerWidth < 1024) {
      setIsMenuOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentView]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    if (!token) return;

    try {
      await Promise.all([
        fetchAssignments(),
        fetchResources(),
        fetchStudentResults(),
        fetchFeeBalance()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load some data');
    }
  }, [token]);

  // Individual fetch functions
  const fetchAssignments = async () => {
    setAssignmentsLoading(true);
    setAssignmentsError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/assignment?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setAssignments(data.assignments || []);
      } else {
        throw new Error(data.error || 'Failed to fetch assignments');
      }
    } catch (error) {
      setAssignmentsError(error.message);
      toast.error('Failed to load assignments');
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const fetchResources = async () => {
    setResourcesLoading(true);
    setResourcesError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setResources(data.resources || []);
      } else {
        throw new Error(data.error || 'Failed to fetch resources');
      }
    } catch (error) {
      setResourcesError(error.message);
      toast.error('Failed to load resources');
    } finally {
      setResourcesLoading(false);
    }
  };

  const fetchStudentResults = async () => {
    if (!student?.admissionNumber) return;
    
    setResultsLoading(true);
    setResultsError(null);
    try {
      const response = await fetch(`/api/results?action=student-results&admissionNumber=${encodeURIComponent(student.admissionNumber)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setStudentResults(data.results || []);
      } else {
        throw new Error(data.error || 'Failed to fetch results');
      }
    } catch (error) {
      setResultsError(error.message);
    } finally {
      setResultsLoading(false);
    }
  };

  const fetchFeeBalance = async () => {
    if (!student?.admissionNumber) return;
    
    setFeeLoading(true);
    setFeeError(null);
    try {
      const response = await fetch(`/api/feebalances?admissionNumber=${student.admissionNumber}&action=student-fees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setFeeBalance({
          summary: data.summary || {
            totalAmount: 0,
            totalPaid: 0,
            totalBalance: 0,
            recordCount: 0
          },
          details: data.feeBalances || [],
          student: data.student
        });
      } else {
        throw new Error(data.error || 'Failed to fetch fee balance');
      }
    } catch (error) {
      setFeeError(error.message);
      toast.error('Could not load fee balance');
    } finally {
      setFeeLoading(false);
    }
  };

  // Handle login
  const handleStudentLogin = async (fullName, admissionNumber) => {
    setLoginLoading(true);
    setLoginError(null);
    setRequiresContact(false);

    try {
      const response = await fetch('/api/studentlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, admissionNumber })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('student_token', data.token);
        setStudent(data.student);
        setToken(data.token);
        setShowLoginModal(false);
        
        toast.success('🎉 Login successful!', {
          description: `Welcome ${data.student.fullName}`
        });

        fetchAllData();
      } else {
        setLoginError(data.error);
        setRequiresContact(data.requiresContact || false);
        
        if (data.requiresContact) {
          toast.error('Student record not found', {
            description: 'Please contact your class teacher or school administrator'
          });
        } else {
          toast.error(data.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/studentlogin', { method: 'DELETE' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('student_token');
      setStudent(null);
      setToken(null);
      setShowLoginModal(true);
      setAssignments([]);
      setResources([]);
      setStudentResults([]);
      setFeeBalance(null);
      
      toast.success('👋 You have been logged out');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    
    fetchAllData();
    toast.success('🔄 Refreshing data...');
  };

  // Handle download
  const handleDownload = (item) => {
    toast.success(`📥 Downloading ${item.title || 'file'}...`);
  };

  // Handle view details
  const handleViewDetails = (item) => {
    toast.success(`🔍 Viewing details for ${item.title}`);
  };

  // Toggle menu function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu function for mobile
  const closeMenuOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsMenuOpen(false);
    }
  };

  // Handle view change with mobile consideration
  const handleViewChange = (view) => {
    setCurrentView(view);
    closeMenuOnMobile();
  };

  // Use your LoadingScreen component
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show login modal if not authenticated
  if (!student || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Toaster position="top-right" expand={true} richColors theme="light" />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
              <div className="relative p-10">
                <div className="relative w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50"></div>
                  <span className="text-white text-3xl font-bold relative">NS</span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Student Portal Login</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Access your academic resources and information
                </p>
                
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Login to Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        <StudentLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleStudentLogin}
          isLoading={loginLoading}
          error={loginError}
          requiresContact={requiresContact}
        />
      </div>
    );
  }

  // Main portal layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Toaster position="top-right" expand={true} richColors theme="light" />
      
      {/* Login Modal */}
      <StudentLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleStudentLogin}
        isLoading={loginLoading}
        error={loginError}
        requiresContact={requiresContact}
      />

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
          onClick={toggleMenu}
        />
      )}

      {/* Main Layout Container */}
      <div className="flex">
        {/* Navigation Sidebar - Modern Responsive */}
        <div className={`
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:sticky lg:top-0
          h-screen z-50 transition-transform duration-300 ease-in-out
          flex-shrink-0
          w-full sm:w-4/5 md:w-3/5 lg:w-72 xl:w-80
          shadow-2xl
        `}>
          <NavigationSidebar
            student={student}
            feeBalance={feeBalance}
            feeLoading={feeLoading}
            feeError={feeError}
            onLogout={handleLogout}
            currentView={currentView}
            setCurrentView={handleViewChange}
            onRefresh={handleRefresh}
            onMenuClose={closeMenuOnMobile}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen w-full lg:w-[calc(100%-18rem)] xl:w-[calc(100%-20rem)] transition-all duration-300">
          {/* Header */}
          <ModernStudentHeader
            student={student}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={handleRefresh}
            onMenuToggle={toggleMenu}
            isMenuOpen={isMenuOpen}
            currentView={currentView}
          />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto px-6 py-8 container mx-auto max-w-7xl">
            {/* Modern HomeView */}
            {currentView === 'home' && (
              <ModernHomeView
                student={student}
                feeBalance={feeBalance}
                feeLoading={feeLoading}
              />
            )}
            {currentView === 'results' && (
              <ResultsView
                student={student}
                studentResults={studentResults}
                resultsLoading={resultsLoading}
                resultsError={resultsError}
                onRefreshResults={fetchStudentResults}
              />
            )}

            {currentView === 'resources' && (
              <ResourcesAssignmentsView
                student={student}
                assignments={assignments}
                resources={resources}
                assignmentsLoading={assignmentsLoading}
                resourcesLoading={resourcesLoading}
                onDownload={handleDownload}
                onViewDetails={handleViewDetails}
              />
            )}

            {currentView === 'guidance' && (
              <GuidanceEventsView />
            )}
          </main>

          {/* Modern Footer */}
          <footer className="border-t border-gray-200/50 bg-gradient-to-r from-white via-gray-50 to-blue-50 py-8 backdrop-blur-sm">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-gray-700 text-sm font-bold">
                    © {new Date().getFullYear()} Nyaribu Secondary School
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Student Portal v3.0 • Soaring for Excellence in Education
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Session Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                    Terms of Use
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                    Help Center
                  </a>
                  <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                    <FaGlobe />
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}