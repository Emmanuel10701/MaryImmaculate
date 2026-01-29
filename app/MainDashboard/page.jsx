'use client';
import { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiBook, 
  FiCalendar,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiUser,
  FiMail,
  FiDollarSign,
  FiUserPlus,
  FiImage,
  FiShield,
  FiMessageCircle,
  FiInfo,
  FiTrendingUp,
  FiAward,
  FiClipboard,
  FiMonitor,
  FiSmartphone,
FiArrowLeft,
FiArchive
} from 'react-icons/fi';
import { 
  IoStatsChart,
  IoPeopleCircle,
  IoNewspaper,
  IoSparkles
} from 'react-icons/io5';

import { useRouter } from 'next/navigation';

// Import components
import AdminSidebar from '../components/sidebar/page';
import DashboardOverview from '../components/dashbaord/page';
import AssignmentsManager from '../components/AssignmentsManager/page';
import NewsEventsManager from '../components/eventsandnews/page';
import StaffManager from '../components/staff/page';
import SubscriberManager from '../components/subscriber/page';
import EmailManager from '../components/email/page';
import GalleryManager from '../components/gallery/page';
import AdminManager from '../components/adminsandprofile/page';
import GuidanceCounselingTab from '../components/guidance/page';
import SchoolInfoTab from '../components/schoolinfo/page';
import ApplicationsManager from '../components/applications/page';
import Resources from '../components/resources/page';
import Careers from "../components/career/page";
import Student from "../components/student/page";
import Fees from "../components/fees/page";
import Results from "../components/resultsUpload/page";
import SchoolDocs from "../components/schooldocuments/page"; // Added import for School Documents

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [realStats, setRealStats] = useState({
    totalStaff: 0,
    totalSubscribers: 0,
    upcomingEvents: 0,
    totalNews: 0,
    activeAssignments: 0,
    galleryItems: 0,
    guidanceSessions: 0,
    totalApplications: 0,
    pendingApplications: 0,
    Resources: 0,
    Careers: 0,
    totalStudent: 0,
    totalFees: 0,
    totalResults: 0

  });

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      // For phones only (screen width <= 768px)
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Show warning only on mobile phones
      if (mobile) {
        setShowMobileWarning(true);
        // Auto-close sidebar on mobile
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


const router =useRouter()


  // Mobile Warning Modal Component
  const MobileWarningModal = () => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FiSmartphone className="text-xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mobile Access Detected</h3>
                <p className="text-gray-400 text-sm">Limited Space</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-xl border border-blue-800/50">
            <FiMonitor className="text-blue-400 text-lg" />
            <p className="text-blue-300 text-sm">
              <span className="font-semibold">Recommendation:</span> Use a desktop for the best experience
            </p>
          </div>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiSmartphone className="text-red-400 text-xs" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Limited Features</h4>
                <p className="text-gray-400 text-sm">
                  Some admin features are optimized for desktop and may not work properly on mobile.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiMonitor className="text-green-400 text-xs" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Desktop Recommended</h4>
                <p className="text-gray-400 text-sm">
                  For full functionality, data management, and better navigation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <IoSparkles className="text-yellow-400 text-xs" />
              </div>
              <div>
<h4 className="text-white font-semibold mb-1">Go Back</h4>
<p className="text-gray-400 text-sm">
  Return to the previous page to review or change your settings and Navigate it with the Desktop or Laptop.
</p>

              </div>
            </div>
          </div>
          
          {/* Device info */}
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs mb-1">Screen Width</p>
                <p className="text-white font-bold">{window.innerWidth}px</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Device Type</p>
                <p className="text-white font-bold">Mobile Phone</p>
              </div>
            </div>
          </div>
          
        
        </div>
  {/* Footer */}
<div className="p-6 bg-gray-900/50 border-t border-gray-800 space-y-4">
  <div className="flex justify-center">
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full border border-gray-700 transition-all active:scale-95 shadow-lg"
    >
      <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm font-bold">Go Back</span>
    </button>
  </div>

  <p className="text-gray-500 text-[10px] sm:text-xs text-center max-w-xs mx-auto leading-relaxed">
    For optimal experience, use a device with screen width greater than 768px
  </p>
</div>

      </div>
    </div>
  );

  // Simple Mobile Banner (alternative to modal)
  const MobileBanner = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-red-500/95 to-orange-500/95 backdrop-blur-lg border-t border-white/20">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <FiSmartphone className="text-white text-xl" />
          <div>
            <p className="text-white font-bold text-sm">Admin Panel on Mobile</p>
            <p className="text-white/90 text-xs">Some features may be limited. Use desktop for full experience.</p>
          </div>
        </div>
        <button
          onClick={() => setShowMobileWarning(false)}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-semibold transition-colors duration-200 backdrop-blur-sm"
        >
          Dismiss
        </button>
      </div>
    </div>
  );

  // Modern Loading Screen with Enhanced Design
  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 z-50 flex flex-col items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Loader */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md">
        {/* Animated Rings - Scaled for small screens (w-24), original (w-32) on md+ */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8">
          <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
          <div className="absolute inset-3 md:inset-4 border-4 border-amber-500/30 rounded-full animate-ping"></div>
          <div className="absolute inset-6 md:inset-8 border-4 border-white/40 rounded-full animate-spin"></div>
          
          {/* Center Logo - Scaled for small screens (w-12), original (w-16) on md+ */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden">
              <img 
                src="/ll.png" 
                alt="Mary Immaculate Girls Secondary Logo" 
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>
        </div>
        
        {/* Loading Content */}
        <div className="text-center space-y-4 md:space-y-6 px-2">
          {/* School Name - Scaled text-xl for small screens, text-3xl for md+ */}
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
              Mary Immaculate Girls Secondary School
            </h2>
            <div className="h-1 w-32 md:w-48 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-4">
            <p className="text-white/80 text-base md:text-lg">Preparing an exceptional learning experience</p>
            
            {/* Animated Dots */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            
            {/* Progress Bar - Scaled width for small screens */}
            <div className="w-48 md:w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-loading"></div>
            </div>
            
            <p className="text-white/60 text-xs md:text-sm">Loading resources...</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Fetch student count from the new API
  const fetchStudentCount = async () => {
    try {
      const response = await fetch('/api/studentupload?action=stats');
      if (!response.ok) {
        console.error('Failed to fetch student stats');
        return 0;
      }
      
      const data = await response.json();
      
      // Extract student count from different possible response structures
      if (data.success) {
        if (data.data?.stats?.totalStudents) {
          return data.data.stats.totalStudents;
        } else if (data.stats?.totalStudents) {
          return data.stats.totalStudents;
        } else if (data.totalStudents) {
          return data.totalStudents;
        }
      }
      
      // Fallback: Fetch all students and count them
      const allStudentsRes = await fetch('/api/studentupload');
      if (allStudentsRes.ok) {
        const allStudentsData = await allStudentsRes.json();
        if (allStudentsData.success) {
          const students = allStudentsData.data?.students || allStudentsData.students || [];
          return students.length;
        }
      }
      
      return 0;
    } catch (error) {
      console.error('Error fetching student count:', error);
      return 0;
    }
  };

  // Fetch real counts from all APIs
  const fetchRealCounts = async () => {
    try {
      // Get student count first
      const studentCount = await fetchStudentCount();
      
      // Then fetch other data in parallel
      const [
        staffRes,
        subscribersRes,
        eventsRes,
        newsRes,
        assignmentsRes,
        galleryRes,
        guidanceRes,
        admissionsRes,
        resourcesRes,
        careersRes,
        studentRes,
        feesRes,
        schooldocumentsRes, // Added this
        resultsRes
      ] = await Promise.allSettled([
        fetch('/api/staff'),
        fetch('/api/subscriber'),
        fetch('/api/events'),
        fetch('/api/news'),
        fetch('/api/assignment'),
        fetch('/api/gallery'),
        fetch('/api/guidance'),
        fetch('/api/applyadmission'),
        fetch('/api/resources'),
        fetch('/api/career'),
        fetch('/api/studentupload'), // Modified to use studentupload API
        fetch('/api/feebalances'),
        fetch('/api/results'),
        fetch('/api/schooldocuments') // Added this

      ]);

      // Process responses and get actual counts
      const staff = staffRes.status === 'fulfilled' ? await staffRes.value.json() : { staff: [] };
      const subscribers = subscribersRes.status === 'fulfilled' ? await subscribersRes.value.json() : { subscribers: [] };
      const events = eventsRes.status === 'fulfilled' ? await eventsRes.value.json() : { events: [] };
      const news = newsRes.status === 'fulfilled' ? await newsRes.value.json() : { news: [] };
      const assignments = assignmentsRes.status === 'fulfilled' ? await assignmentsRes.value.json() : { assignments: [] };
      const gallery = galleryRes.status === 'fulfilled' ? await galleryRes.value.json() : { galleries: [] };
      const guidance = guidanceRes.status === 'fulfilled' ? await guidanceRes.value.json() : { events: [] };
      const admissions = admissionsRes.status === 'fulfilled' ? await admissionsRes.value.json() : { applications: [] };
      const resources = resourcesRes.status === 'fulfilled' ? await resourcesRes.value.json() : { resources: [] };
      const careers = careersRes.status === 'fulfilled' ? await careersRes.value.json() : { careers: [] };
      const student = studentRes.status === 'fulfilled' ? await studentRes.value.json() : { students: [] };
      const fees = feesRes.status === 'fulfilled' ? await feesRes.value.json() : { feebalances: [] };
      const results = resultsRes.status === 'fulfilled' ? await resultsRes.value.json() : { results: [] };

      const schoolDocs = schooldocumentsRes.status === 'fulfilled' ? await schooldocumentsRes.value.json() : { documents: [] };


  
      
      const activeAssignments = assignments.assignments?.filter(a => a.status === 'assigned').length || 0;
      
      // Admission statistics
      const admissionsData = admissions.applications || [];
      const pendingApps = admissionsData.filter(app => app.status === 'PENDING').length || 0;

      setRealStats({
        totalStaff: staff.staff?.length || 0,
        totalSubscribers: subscribers.subscribers?.length || 0,
        upcomingEvents,
        totalNews: news.news?.length || 0,
        activeAssignments,
        galleryItems: gallery.galleries?.length || 0,
        guidanceSessions: guidance.events?.length || 0,
        totalApplications: admissionsData.length || 0,
        pendingApplications: pendingApps,
        Resources: resources.resources?.length || 0,
        Careers: careers.careers?.length || 0,
        totalStudent: student.students?.length || 0,
        totalFees: fees.feebalances?.length || 0,
        totalResults: results.results?.length || 0,
        schooldocuments: schoolDocs.documents?.length || 0 // Added this

      });

    } catch (error) {
      console.error('Error fetching real counts:', error);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      
      try {
        console.log('🔍 Checking localStorage for user data...');
        
        // Check ALL possible localStorage keys for user data
        const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
        const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
        
        let userData = null;
        let token = null;
        
        // Find user data in any possible key
        for (const key of possibleUserKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`✅ Found user data in key: ${key}`, data);
            userData = data;
            break;
          }
        }
        
        // Find token in any possible key
        for (const key of possibleTokenKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`✅ Found token in key: ${key}`);
            token = data;
            break;
          }
        }
        
        if (!userData) {
          console.log('❌ No user data found in localStorage');
          window.location.href = '/pages/adminLogin';
          return;
        }

        // Parse user data
        const user = JSON.parse(userData);
        console.log('📋 Parsed user data:', user);
        
        // Verify token is still valid (if available)
        if (token) {
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (tokenPayload.exp < currentTime) {
              console.log('❌ Token expired');
              // Clear all auth data
              possibleUserKeys.forEach(key => localStorage.removeItem(key));
              possibleTokenKeys.forEach(key => localStorage.removeItem(key));
              window.location.href = '/pages/adminLogin';
              return;
            }
            console.log('✅ Token is valid');
          } catch (tokenError) {
            console.log('⚠️ Token validation skipped:', tokenError.message);
          }
        }

        // Check if user has valid role
        const userRole = user.role;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          console.log('❌ User does not have valid role:', userRole);
          window.location.href = '/pages/adminLogin';
          return;
        }

        console.log('✅ User authenticated successfully:', user.name);
        setUser(user);

        // Fetch real counts from APIs
        await fetchRealCounts();
        
      } catch (error) {
        console.error('❌ Error initializing dashboard:', error);
        // Clear all auth data on error
        localStorage.clear();
        window.location.href = '/pages/adminLogin';
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Refresh counts when tab changes
  useEffect(() => {
    if (!loading) {
      fetchRealCounts();
    }
  }, [activeTab]);

  const handleLogout = () => {
    // Clear ALL possible auth data
    const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
    const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
    
    possibleUserKeys.forEach(key => localStorage.removeItem(key));
    possibleTokenKeys.forEach(key => localStorage.removeItem(key));
    
    window.location.href = '/pages/adminLogin';
  };

  const renderContent = () => {
    if (loading) return null;

    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'school-info':
        return <SchoolInfoTab />;

     case 'schooldocuments': // Added this case
         return <SchoolDocs />;
      case 'guidance-counseling':
        return <GuidanceCounselingTab />;
      
      case 'staff':
        return <StaffManager />;
      case 'assignments':
        return <AssignmentsManager />;
      case 'admissions':
        return <ApplicationsManager />;
      case 'resources':
        return <Resources />;
      case 'results':
        return <Results />;  
      case 'newsevents':
        return <NewsEventsManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'careers':
        return <Careers />; 
      case 'subscribers':
        return <SubscriberManager />;
      case 'email':
        return <EmailManager />;
      case 'student':
        return <Student />;  
      case 'fees':
        return <Fees />;
      case 'admins-profile':
        return <AdminManager user={user} />;
      default:
        return <DashboardOverview />;
    }
  };

  // Navigation items without counts
  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Dashboard Overview', 
      icon: FiHome,
      badge: 'primary'
    },
    { 
      id: 'school-info', 
      label: 'School Information', 
      icon: FiInfo,
      badge: 'info'
    },
    { 
      id: 'guidance-counseling', 
      label: 'Guidance Counseling', 
      icon: FiMessageCircle,
      badge: 'purple'
    },

{
    id: 'schooldocuments',
    label: 'School Documents',
    icon: FiArchive, 
    badge: 'indigo'
  },
    { 
      id: 'staff', 
      label: 'Staff & BOM', 
      icon: IoPeopleCircle,
      badge: 'orange'
    },
    { 
      id: 'assignments', 
      label: 'Assignments', 
      icon: FiBook,
      badge: 'red'
    },
    { 
      id: 'admissions',
      label: 'Admission Applications', 
      icon: FiClipboard,
      badge: 'purple'
    },
    { 
      id: 'resources', 
      label: 'Resources',
      icon: FiFileText,
      badge: 'cyan' 
    },
    {
      id: 'results',
      label: 'Exam Results',
      icon: FiClipboard,
      badge: 'teal'
    },
    {
      id: 'student',
      label: 'Student Records',
      icon: FiInfo,
      badge: 'cyan'
    },
    {
      id: 'fees',
      label: 'Fee Balances',
      icon: FiDollarSign,
      badge: 'yellow'
    },
    {
      id: 'careers',
      label: 'Careers',
      icon: FiCalendar,
      badge: 'lime'
    },
    { 
      id: 'newsevents', 
      label: 'News & Events', 
      icon: IoNewspaper,
      badge: 'yellow'
    },
    { 
      id: 'gallery', 
      label: 'Media Gallery', 
      icon: FiImage,
      badge: 'pink'
    },
    { 
      id: 'subscribers', 
      label: 'Subscribers', 
      icon: FiUserPlus,
      badge: 'teal'
    },
    { 
      id: 'email', 
      label: 'Email Campaigns', 
      icon: FiMail,
      badge: 'indigo'
    },
    { 
      id: 'admins-profile', 
      label: 'Admins & Profile', 
      icon: FiShield,
      badge: 'gray'
    },
  ];

  // Header stats component with simple hover effect
  const HeaderStat = ({ icon: Icon, value, label, color = 'blue', trend = 'up' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      teal: 'bg-teal-100 text-teal-600',
      orange: 'bg-orange-100 text-orange-600',
      cyan: 'bg-cyan-100 text-cyan-600',
      lime: 'bg-lime-100 text-lime-600',
      gray: 'bg-gray-100 text-gray-600'
    };

    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors duration-200">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="text-lg" />
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{value?.toLocaleString() || '0'}</p>
          <p className="text-xs text-gray-500 capitalize">{label}</p>
        </div>
        {trend && (
          <div className={`p-1 rounded ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
            {trend === 'up' ? (
              <FiTrendingUp className="text-green-600 text-sm" />
            ) : (
              <FiTrendingUp className="text-red-600 text-sm transform rotate-180" />
            )}
          </div>
        )}
      </div>
    );
  };

  // Show loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // If no user but loading is false, it means we're redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden">
      {/* Mobile Warning Modal */}
      {showMobileWarning && <MobileWarningModal />}
      
      {/* Mobile Banner (alternative) */}
      {/* {showMobileWarning && <MobileBanner />} */}

      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        tabs={navigationItems}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200"
              >
                <FiMenu className="text-xl text-gray-600" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl items-center justify-center shadow-lg">
                  <FiAward className="text-xl text-white" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Stats - Hidden on small screens */}
              <div className="hidden xl:flex items-center gap-3">
                <HeaderStat 
                  icon={FiUsers} 
                  value={realStats.totalStudent} 
                  label="Students" 
                  color="blue"
                  trend="up"
                />
                <HeaderStat 
                  icon={IoPeopleCircle} 
                  value={realStats.totalStaff} 
                  label="Staff" 
                  color="green"
                  trend="up"
                />
                               
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end justify-center">
                  <span className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1">
                    {user?.name?.split(' ')[0]}
                  </span>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 shadow-sm">
                    <IoSparkles className="text-amber-500 text-[10px] animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700">
                      {user?.role?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity duration-200">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Add CSS animations
const styles = `
  @keyframes scale-in {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out forwards;
  }
`;

// Add styles to head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}