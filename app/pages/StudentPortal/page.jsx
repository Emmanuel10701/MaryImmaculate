'use client';

import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import StudentLoginModal from '../../components/studentloginmodel/page';
import NavigationSidebar from '../../components/studentportalcomponents/aside/page.jsx';
import ResultsView from '../../components/studentportalcomponents/result/page.jsx';
import ResourcesAssignmentsView from '../../components/studentportalcomponents/ass/page.jsx';
import GuidanceEventsView from '../../components/studentportalcomponents/session/page';
import LoadingScreen from '../../components/studentportalcomponents/loading/page';
import FeesView from '../../components/studentportalcomponents/feebalance/page'; // ADDED IMPORT

/// Font Awesome 6 - Modern versions
import { 
   FaBell, FaBars, FaCalendar, FaBook, FaAward, FaDollarSign, 
  FaClock, FaChartLine, FaChartBar, FaFolder, FaComments,
  FaRocket, FaPalette, FaGem, FaChartPie, FaTrendingUp, FaCrown,
  FaLightbulb, FaBrain, FaHandshake, FaHeart, FaLock, FaGlobe, 
  FaArrowRight, FaFire, FaBolt, FaCalendarCheck, FaUserPlus, 
  FaUserCheck, FaRoute, FaDirections, FaQrcode, FaFingerprint, 
  FaIdCard, FaDesktop, FaWandMagic, FaUser
} from 'react-icons/fa6';

import { useRouter } from 'next/navigation';
 
import Image from 'next/image';

// Font Awesome 5 (Legacy)
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

import { FaCheckCircle } from "react-icons/fa6";



// Feather icons
import { 
  FiMenu, FiX, FiRefreshCw, FiBookOpen,
  FiExternalLink, FiShield, FiExpand, FiCompress,
  FiMapPin, FiSmartphone, FiTablet
} from 'react-icons/fi';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Add responsive styles for small screens
const responsiveStyles = `
@media (max-width: 768px) {
  /* Hide scrollbars but keep scrolling functional */
  .mobile-scroll-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .mobile-scroll-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Improved touch targets */
  .mobile-touch-friendly {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Prevent text overflow */
  .mobile-text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Stack cards vertically */
  .mobile-stack {
    flex-direction: column !important;
  }
  
  /* Reduce spacing on mobile */
  .mobile-compact {
    padding: 0.75rem !important;
    margin: 0.5rem !important;
  }
  
  /* Full-width on mobile */
  .mobile-full-width {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  /* Adjust modal for mobile */
  .mobile-modal-fix {
    max-height: 80vh !important;
    margin: 1rem !important;
  }
}

@media (max-width: 640px) {
  /* Extra small screen adjustments */
  .xs-text-sm {
    font-size: 0.875rem !important;
  }
  
  .xs-p-2 {
    padding: 0.5rem !important;
  }
  
  .xs-gap-2 {
    gap: 0.5rem !important;
  }
}

/* Ensure images and content don't overflow */
.mobile-contain {
  max-width: 100% !important;
  height: auto !important;
}
`;

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
      case 'fees': return <FaDollarSign className="text-amber-500" />; // ADDED
      default: return <FaHome className="text-blue-500" />;
    }
  };



  return (
    <>
      <style jsx global>{responsiveStyles}</style>
      <header className="bg-gradient-to-r from-white via-gray-50 to-blue-50 border-b border-gray-200/50 shadow-xl sticky top-0 z-30 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Left Section: Student Info + Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 sm:p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm hover:shadow-md transition-all mobile-touch-friendly"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? 
                  <FaTimes className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" /> : 
                  <FaBars className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
                }
              </button>

              {/* Student Info */}
              {student && (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Avatar */}
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 ${getGradientColor(student.fullName)} rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity`}
                    />
                    <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-white text-base sm:text-lg md:text-xl bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-white shadow-lg">
                      {getInitials(student.fullName)}
                    </div>
                  </div>

                  {/* Name & Form/Stream */}
                  <div className="hidden xs:flex flex-col">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mobile-text-truncate max-w-[120px] sm:max-w-[160px] md:max-w-none">
                      {student.fullName}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-gray-500 mobile-text-truncate max-w-[100px] sm:max-w-none">
                        {student.form} • {student.stream}
                      </span>
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current View (Mobile Only) */}
            <div className="lg:hidden flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-sm">
                {getViewIcon(currentView)}
              </div>
              <div className="max-w-[140px] sm:max-w-none">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mobile-text-truncate">
                  {currentView === 'home' && 'Dashboard'}
                  {currentView === 'results' && 'Results'}
                  {currentView === 'resources' && 'Resources'}
                  {currentView === 'guidance' && 'Guidance'}
                  {currentView === 'fees' && 'Fee Balance'} {/* ADDED */}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Student Portal</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// ==================== MODERN HOME VIEW ====================
function ModernHomeView({ student, feeBalance, feeLoading, token }) {
  const [showFeeDetails, setShowFeeDetails] = useState(false);

  const stats = [
    { 
      label: 'Current Form', 
      value: `${student?.form || 'N/A'}`, 
      icon: <FaUser className="text-base sm:text-lg md:text-xl" />, 
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    { 
      label: 'Stream', 
      value: student?.stream || 'N/A', 
      icon: <FaBook className="text-base sm:text-lg md:text-xl" />, 
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-100'
    },
    { 
      label: 'Admission No', 
      value: student?.admissionNumber || 'N/A', 
      icon: <FaAward className="text-base sm:text-lg md:text-xl" />, 
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-100'
    },
    { 
      label: 'Academic Year', 
      value: new Date().getFullYear().toString(),
      icon: <FaCalendar className="text-base sm:text-lg md:text-xl" />, 
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-100'
    },
  ];

  const quickActions = [
    {
      tab: 'learning',
      title: 'Learning Hub',
      description: 'Access all your academic learning tools in one place, including assignments, revision materials, notes, and other essential learning resources provided by your teachers to support your daily studies and exam preparation.',
      icon: <FiBookOpen className="text-lg sm:text-xl md:text-2xl" />,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
      actions: ['View Assignments', 'Browse Learning Resources']
    },
    {
      tab: 'results',
      title: 'Results',
      description: 'Review your academic performance in detail by accessing both class-wide results and your personal examination results, allowing you to track progress, identify strengths, and understand areas that need improvement.',
      icon: <FaChartLine className="text-lg sm:text-xl md:text-2xl" />,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-100',
      actions: ['Class Results', 'My Results']
    },
    {
      tab: 'support',
      title: 'Student Support',
      description: 'Stay informed and supported through access to guidance and counselling services, important school announcements, upcoming events, and news updates designed to support your academic, personal, and social wellbeing.',
      icon: <FaUserFriends className="text-lg sm:text-xl md:text-2xl" />,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-100',
      actions: ['Guidance & Counselling', 'School News & Events']
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 mobile-scroll-hide">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-20"></div>
        <div className="relative p-4 sm:p-6 md:p-8 text-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-5 mb-3 sm:mb-4 md:mb-6">
            {/* Icon */}
            <div className="p-3 sm:p-4 bg-white bg-opacity-20 rounded-xl sm:rounded-2xl backdrop-blur-sm w-fit">
              <FaRocket className="text-xl sm:text-2xl md:text-3xl" />
            </div>

            {/* Text */}
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Welcome back, {student?.fullName?.split(" ")[0] || "Student"}! 🚀
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 max-w-2xl">
                Ready to continue your learning journey? Check assignments, view results, and track progress.
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-6">
            <span className="inline-flex items-center gap-1 sm:gap-2 bg-white bg-opacity-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm font-bold">
              <HiSparkles className="text-yellow-300 text-xs sm:text-sm md:text-base" />
              Active Student
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-2 bg-white bg-opacity-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm font-bold">
              <FaCalendarCheck className="text-blue-200 text-xs sm:text-sm md:text-base" />
              Katz
            </span>
          </div>
        </div>
      </div>

    {/* Quick Stats - Mobile 2x2 Grid, Desktop 4-column */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
  {stats.map((stat, index) => (
    <div key={index} className="group relative w-full">
      {/* Background Glow - Hidden on mobile to save space */}
      <div 
        className={`hidden sm:block absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-lg sm:rounded-xl md:rounded-2xl blur-xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      {/* Main Card - Compact on mobile */}
      <div className="relative bg-white/95 sm:bg-white/90 md:bg-white/80 backdrop-blur-xs sm:backdrop-blur-sm md:backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 border border-gray-100 sm:border-gray-150 md:border-white shadow-sm sm:shadow-md hover:shadow-md transition-all duration-300 overflow-hidden h-full">
        
        {/* Decorative Pattern - Smaller on mobile */}
        <div className="absolute -right-1.5 -top-1.5 sm:-right-2 sm:-top-2 md:-right-3 md:-top-3 lg:-right-4 lg:-top-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-50/30 to-transparent rounded-full opacity-40 md:opacity-50 group-hover:scale-100 transition-transform duration-500" />

        <div className="flex flex-col h-full">
          {/* Top Row: Icon and Trends - Stacked vertically on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
            {/* Icon Container - Centered on mobile */}
            <div className={`flex justify-center sm:justify-start p-1.5 sm:p-2 md:p-2.5 lg:p-3 bg-gradient-to-br ${stat.gradient} rounded-lg sm:rounded-xl md:rounded-2xl text-white shadow-xs sm:shadow-sm md:shadow-lg group-hover:scale-100 transition-transform duration-300 self-center sm:self-auto mb-1 sm:mb-0`}>
              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7">
                {stat.icon}
              </div>
            </div>
            
            {/* Trends - Right aligned, smaller on mobile */}
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-tight sm:tracking-wider text-gray-500 md:text-gray-400 text-center sm:text-right">
                {stat.category || 'Update'}
              </span>
              <div className="flex items-center text-emerald-500 font-bold text-[9px] sm:text-[10px] md:text-xs mt-0.5">
                <span className="text-[8px] sm:text-[10px]">↑</span>
                <span className="ml-0.5">{stat.trend || 'Good'}</span>
              </div>
            </div>
          </div>

          {/* Value and Label - Centered on mobile */}
          <div className="mt-0.5 sm:mt-1 md:mt-2 flex-grow text-center sm:text-left">
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-gray-900 tracking-tight leading-none sm:leading-tight">
              {stat.value}
            </h3>
            <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium text-gray-600 md:text-gray-500 mt-0.5 sm:mt-1 line-clamp-2">
              {stat.label}
            </p>
          </div>

          {/* School Info Footer - Simplified on mobile */}
          <div className="mt-1.5 sm:mt-2 md:mt-3 lg:mt-4 md:pt-2 lg:pt-3 border-t border-gray-100 pt-1.5 sm:pt-2">
            <div className="flex items-center justify-between">
              {/* Avatars - Hidden on smallest screens, show from sm */}
              <div className="hidden xs:flex -space-x-1 sm:-space-x-1.5 md:-space-x-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border border-white bg-gray-200"
                  />
                ))}
                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[6px] sm:text-[7px] md:text-[8px] font-bold text-gray-500">
                  +
                </div>
              </div>
              
              {/* Updated Date - Smaller on mobile */}
              <span className="text-[7px] sm:text-[8px] md:text-[10px] lg:text-[11px] font-medium text-gray-500 md:text-gray-400 italic truncate">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
<FeesView student={student} token={token} />   
      {/* Dashboard Overview */}
      <section className="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
        {/* Section Header */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Student Dashboard
          </h2>
          <p className="mt-1 text-xs sm:text-sm md:text-base text-gray-600 max-w-3xl">
            This dashboard gives you quick access to your learning resources, assignments, academic results, and student support services.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-5 lg:gap-6">
          {quickActions.map((action, index) => (
            <div key={index} className="relative group mobile-full-width">
              {/* Soft Glow (desktop only) */}
              <div className={`hidden sm:block absolute inset-0 bg-gradient-to-r ${action.gradient} rounded-2xl sm:rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity`} />

              {/* Card */}
              <div className="relative h-full bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/60 p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col mobile-full-width">
                {/* Header */}
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4 mb-2.5 sm:mb-3 md:mb-4">
                  <div className={`p-2.5 sm:p-3 md:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-sm sm:shadow-md`}>
                    {action.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight mobile-text-truncate">
                      {action.title}
                    </h4>
                    <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500 mobile-text-truncate">
                      {action.tab === 'learning' && 'Assignments & materials'}
                      {action.tab === 'results' && 'Class & personal results'}
                      {action.tab === 'support' && 'Guidance, news & events'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1 mb-3 sm:mb-4 md:mb-5 line-clamp-3 sm:line-clamp-4">
                  {action.description}
                </p>

                {/* Footer Action */}
                <button className="mt-auto inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mobile-touch-friendly">
                  <span>Explore</span>
                  <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
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

const router = useRouter();


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
      const response = await fetch(`/api/feebalances/${student.admissionNumber}`, { // UPDATED ENDPOINT
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setFeeBalance(data.data); // UPDATED DATA STRUCTURE
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
  // Define features array here since it's only used in the login view
  const features = [
    { 
      icon: <FaBook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />, 
      title: "Learning Resources", 
      desc: "Access digital notes, revision e-books, and past papers." 
    },
    { 
      icon: <FaAward className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />, 
      title: "Assignments", 
      desc: "View and submit your subject tasks and holiday projects." 
    },
    { 
      icon: <FaChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />, 
      title: "Academic Results", 
      desc: "Personalized performance tracking vs class & KCSE targets." 
    },
    { 
      icon: <FaDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />, 
      title: "Fee Structures", 
      desc: "Check balance, download statements, and payment slips." 
    },
    { 
      icon: <FaCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />, 
      title: "School Events", 
      desc: "Academic calendar, sports days, and parent-teacher meets." 
    },
    { 
      icon: <FaComments className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />, 
      title: "School News", 
      desc: "Latest updates from the administration and student body." 
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans overflow-x-hidden">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <Toaster position="top-right" expand={true} richColors theme="light" />
      
      <main className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar - Enhanced Mobile */}
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/60 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <Image
                src="/katz.png"
                alt="Katwanyaa High School Logo"
                width={32}
                height={32}
                className="rounded-md w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                priority
              />

              <div>
                <span className="text-sm xs:text-base sm:text-lg md:text-xl font-black tracking-tighter block leading-none">
                  KATWANYAA
                </span>
                <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-blue-600 
                  tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                  High School Portal
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Secure Login</span>
              </div>
              <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Help Desk</button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg 
              bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95">
              <FaBars className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </button>
          </div>
        </nav>

        {/* Hero Section with Login - Enhanced Mobile */}
        <section className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12 lg:py-20 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 
                text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-slate-500 whitespace-nowrap">
                <HiSparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                Empowering Excellence Since 1978
              </div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                font-black tracking-tighter leading-[0.85] xs:leading-[0.9] text-slate-950">
                EDUCATION  
                <span className="block text-blue-600 italic mt-1 xs:mt-2">IS LIGHT.</span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-slate-500 font-medium 
                max-w-full xs:max-w-xs sm:max-w-md leading-relaxed xs:leading-snug">
                Welcome to the Katwanyaa High School Digital Student Portal. Your unified hub for academics, finance, and communication.
              </p>
              
              {/* Login Button - Enhanced Mobile */}
              <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 max-w-full xs:max-w-xs sm:max-w-md">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 
                    px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 
                    bg-slate-950 text-white rounded-lg xs:rounded-xl sm:rounded-2xl font-bold 
                    hover:bg-blue-600 transition-all duration-300 active:scale-[0.98]
                    shadow-lg sm:shadow-xl shadow-slate-200/50 
                    group w-full xs:w-auto"
                >
                  <span className="text-xs xs:text-sm sm:text-base">Access Portal</span>
                  <FaArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
            {/* Mobile Help Desk Button */}
<button
  onClick={() => router.push("/pages/contact")}
  className="
    md:hidden
    flex items-center justify-center gap-2
    px-6 xs:px-7
    py-3 xs:py-3.5
    bg-white border border-slate-200
    text-slate-700
    rounded-xl
    font-semibold
    hover:bg-slate-50
    transition-all
    active:scale-[0.98]
    text-sm
    w-[70%] mx-auto
  "
>
  Help Desk
</button>

              </div>
            </div>

            {/* Quick Status / Communication Box - Enhanced Mobile */}
            <div className="relative group mt-4 xs:mt-6 sm:mt-0">
              <div className="absolute -inset-2 xs:-inset-3 sm:-inset-4 bg-blue-100/40 rounded-[2rem] xs:rounded-[2.5rem] 
                blur-xl xs:blur-2xl sm:blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-white border border-slate-200 shadow-lg xs:shadow-xl 
                rounded-[1.5rem] xs:rounded-[2rem] sm:rounded-[2.5rem] p-4 xs:p-5 sm:p-6 md:p-8 space-y-4 xs:space-y-5 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 xs:pb-4">
                  <h3 className="font-black text-xs xs:text-sm uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    Portal Features
                  </h3>
                  <FaBrain className="w-4 h-4 xs:w-5 xs:h-5 text-blue-500" />
                </div>
                <div className="space-y-3 xs:space-y-4">
                  <div className="p-3 xs:p-4 bg-slate-50/80 rounded-xl xs:rounded-2xl border border-slate-100">
                    <p className="text-[10px] xs:text-xs font-bold text-blue-600 mb-0.5 xs:mb-1">Academic Resources</p>
                    <p className="text-xs xs:text-sm font-semibold text-slate-800 leading-tight">
                      Digital notes, e-books, and past papers available.
                    </p>
                  </div>
                  <div className="p-3 xs:p-4 bg-slate-50/80 rounded-xl xs:rounded-2xl border border-slate-100">
                    <p className="text-[10px] xs:text-xs font-bold text-emerald-600 mb-0.5 xs:mb-1">Performance Tracking</p>
                    <p className="text-xs xs:text-sm font-semibold text-slate-800 leading-tight">
                      Monitor your progress vs KCSE targets.
                    </p>
                  </div>
                  <div className="p-3 xs:p-4 bg-slate-50/80 rounded-xl xs:rounded-2xl border border-slate-100">
                    <p className="text-[10px] xs:text-xs font-bold text-purple-600 mb-0.5 xs:mb-1">Fee Management</p>
                    <p className="text-xs xs:text-sm font-semibold text-slate-800 leading-tight">
                      Check balance and download payment slips.
                    </p>
                  </div>
                </div>
                <button className="w-full py-2.5 xs:py-3 text-center text-[10px] xs:text-xs font-black 
                  uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors duration-300">
                  View All Features
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid: School Features - Enhanced Mobile */}
        <section className="bg-slate-50/50 border-y border-slate-200/60 py-8 xs:py-12 sm:py-16 md:py-20 
          px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 xs:mb-8 sm:mb-10 md:mb-12 px-2">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-1 xs:mb-2">
                Portal Modules
              </h2>
              <p className="text-slate-500 font-medium text-sm xs:text-base">
                Everything you need to navigate your school journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 px-2">
              {features.map((feature, i) => (
                <div key={i} className="group p-4 xs:p-5 sm:p-6 md:p-8 
                  bg-white border border-slate-200/80 
                  rounded-[1.5rem] xs:rounded-[1.75rem] sm:rounded-[2rem] 
                  hover:shadow-xl hover:shadow-slate-200/30 
                  hover:-translate-y-0.5 active:translate-y-0
                  transition-all duration-300">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 
                    bg-slate-50 rounded-lg xs:rounded-xl sm:rounded-2xl 
                    flex items-center justify-center mb-3 xs:mb-4 sm:mb-6 
                    group-hover:scale-105 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl 
                    font-bold text-slate-950 mb-1.5 xs:mb-2 sm:mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-xs xs:text-sm leading-relaxed mb-3 xs:mb-4 sm:mb-6 
                    line-clamp-2 xs:line-clamp-3">
                    {feature.desc}
                  </p>
                  <div className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs font-black 
                    uppercase tracking-widest text-slate-400 
                    group-hover:text-blue-600 transition-colors duration-300 cursor-pointer">
                    Login to Access 
                    <FaArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer - Enhanced Mobile */}
        <footer className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-6 xs:py-8 sm:py-10 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center 
            gap-6 xs:gap-8 sm:gap-10 md:gap-12">
            <div className="flex flex-col items-center lg:items-start gap-3 xs:gap-4 text-center lg:text-left">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-slate-100 rounded-lg 
                  flex items-center justify-center">
                  <FaBrain className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                </div>
                <span className="text-sm xs:text-base font-bold tracking-tight">Katwanyaa Technical Lab</span>
              </div>
              <p className="text-[9px] xs:text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                ©2024 Katwanyaa High School. All Rights Reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 xs:gap-6 sm:gap-8 md:gap-10">
              <div className="space-y-1 xs:space-y-2 text-center">
                <p className="text-[9px] xs:text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Academic Hub
                </p>
                <p className="text-xs font-bold hover:text-blue-600 cursor-pointer transition-colors duration-300">
                  KNEC Portal
                </p>
              </div>
              <div className="space-y-1 xs:space-y-2 text-center">
                <p className="text-[9px] xs:text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Financials
                </p>
                <p className="text-xs font-bold hover:text-blue-600 cursor-pointer transition-colors duration-300">
                  Payment Gateways
                </p>
              </div>
              <div className="space-y-1 xs:space-y-2 text-center">
                <p className="text-[9px] xs:text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Support
                </p>
                <p className="text-xs font-bold hover:text-blue-600 cursor-pointer transition-colors duration-300">
                  IT Service Desk
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Login Modal */}
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
          w-[85vw] sm:w-4/5 md:w-3/5 lg:w-72 xl:w-80
          shadow-2xl mobile-scroll-hide
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
          <main className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 container mx-auto max-w-7xl mobile-scroll-hide sm:overflow-y-auto">
            {/* Modern HomeView */}
            {currentView === 'home' && (
              <ModernHomeView
                student={student}
                feeBalance={feeBalance}
                feeLoading={feeLoading}
                    token={token} // ADD THIS LINE

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

            {/* ADDED: Fees View */}
            {currentView === 'fees' && (
              <FeesView
                student={student}
                token={token}
              />
            )}
          </main>

          {/* Modern Footer */}
          <footer className="border-t border-gray-200/50 bg-gradient-to-r from-white via-gray-50 to-blue-50 py-4 sm:py-6 md:py-8 backdrop-blur-sm">
            <div className="container mx-auto px-3 sm:px-4 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div className="text-center md:text-left">
                  <p className="text-gray-700 text-sm font-bold">
                    © {new Date().getFullYear()} Katwanyaa High  School
                  </p>
                  <p className="text-gray-500 text-xs mt-1 sm:mt-2">
                    Student Portal v3.0 • Education is Light
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Session Active</span>
                  </div>
                </div>
<div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
  <button
    onClick={() => router.push('/pages/TermsandPrivacy')}
    className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm font-medium transition-colors mobile-touch-friendly"
  >
    Privacy
  </button>

  <button
    onClick={() => router.push('/pages/TermsandPrivacy')}
    className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm font-medium transition-colors mobile-touch-friendly"
  >
    Terms
  </button>

  <button
    onClick={() => router.push('/pages/TermsandPrivacy')}
    className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm font-medium transition-colors mobile-touch-friendly"
  >
    Help
  </button>

  <button
    onClick={() => router.push('/pages/TermsandPrivacy')}
    className="text-gray-500 hover:text-gray-700 transition-colors mobile-touch-friendly"
    aria-label="Language & Policies"
  >
    <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4" />
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