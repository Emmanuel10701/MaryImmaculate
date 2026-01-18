'use client';

import Image from 'next/image';
import { 
  FiLogOut, 
  FiX, 
  FiSettings, 
  FiHelpCircle, 
  FiChevronRight,
  FiBook, 
  FiImage,
  FiMail,
  FiUser,
  FiShield,
  FiUsers,
  FiUserCheck,
  FiInfo,
  FiMessageCircle,
  FiCalendar,
  FiUserPlus,
  FiClipboard,
  FiFileText,
  FiCheckCircle,
  FiDownload,
  FiFilter,
  FiSearch,FiDollarSign,
  FiFolder,
  FiFile,
  FiVideo,
  FiMusic,
  FiArchive,
  FiTrendingUp,
  FiDatabase,
  FiPieChart,
  FiLayers,
  FiUpload
} from 'react-icons/fi';


import { 
  IoSparkles, 
  IoStatsChart,
  IoRocket,
  IoNewspaper,
  IoPeopleCircle,
  IoSchool
} from 'react-icons/io5';

import { 
  MdAdminPanelSettings,
  MdPersonOutline
} from 'react-icons/md';
import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, tabs }) {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [realStats, setRealStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalSubscribers: 0,
    studentCouncil: 0,
    upcomingEvents: 0,
    totalNews: 0,
    activeAssignments: 0,
    galleryItems: 0,
    guidanceSessions: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    totalResources: 0,
    recentResources: 0,
    totalStudent: 0,
    totalFees:0,
    totalResults:0,
    activeResources: 0,
    totalCareers: 0,
    resourcesByType: {
      documents: 0,
      videos: 0,
      pdfs: 0,
      presentations: 0
    }
  });

  // Get user data from localStorage same way as dashboard
  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      
      try {
        console.log('🔍 Sidebar: Checking localStorage for user data...');
        
        // Check ALL possible localStorage keys for user data (same as dashboard)
        const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
        const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
        
        let userData = null;
        let token = null;
        
        // Find user data in any possible key
        for (const key of possibleUserKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`✅ Sidebar: Found user data in key: ${key}`);
            userData = data;
            break;
          }
        }
        
        // Find token in any possible key
        for (const key of possibleTokenKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`✅ Sidebar: Found token in key: ${key}`);
            token = data;
            break;
          }
        }
        
        if (!userData) {
          console.log('❌ Sidebar: No user data found in localStorage');
          window.location.href = '/pages/adminLogin';
          return;
        }

        // Parse user data
        const user = JSON.parse(userData);
        console.log('📋 Sidebar: Parsed user data:', user);
        
        // Verify token is still valid (if available) - same as dashboard
        if (token) {
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (tokenPayload.exp < currentTime) {
              console.log('❌ Sidebar: Token expired');
              // Clear all auth data
              possibleUserKeys.forEach(key => localStorage.removeItem(key));
              possibleTokenKeys.forEach(key => localStorage.removeItem(key));
              window.location.href = '/pages/adminLogin';
              return;
            }
            console.log('✅ Sidebar: Token is valid');
          } catch (tokenError) {
            console.log('⚠️ Sidebar: Token validation skipped:', tokenError.message);
          }
        }

        // Check if user has valid role - same as dashboard
        const userRole = user.role;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          console.log('❌ Sidebar: User does not have valid role:', userRole);
          window.location.href = '/pages/adminLogin';
          return;
        }

        console.log('✅ Sidebar: User authenticated successfully:', user.name);
        setUser(user);
        
      } catch (error) {
        console.error('❌ Sidebar: Error initializing user:', error);
        // Clear all auth data on error
        localStorage.clear();
        window.location.href = '/pages/adminLogin';
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Fetch real counts from APIs including resources
  const fetchRealCounts = async () => {
    try {
      const [
        studentsRes,
        staffRes,
        subscribersRes,
        councilRes,
        eventsRes,
        newsRes,
        assignmentsRes,
        galleryRes,
        guidanceRes,
        admissionsRes,
        resourcesRes,
        careersRes,
        resultsRes,
        studentRes
      ] = await Promise.allSettled([
        fetch('/api/staff'),
        fetch('/api/subscriber'),
        fetch('/api/events'),
        fetch('/api/news'),
        fetch('/api/assignment'),
        fetch('/api/gallery'),
        fetch('/api/guidance'),
        fetch('/api/applyadmission'),
        fetch('/api/resources?accessLevel=admin&limit=100'),
        fetch('/api/career'),
        fetch('/api/student'),
        fetch('/api/feebalances'),
        fetch('/api/results')
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
      const fees = studentRes.status === 'fulfilled' ? await studentRes.value.json() : { feebalances: [] };
      const results = resultsRes.status === 'fulfilled' ? await resultsRes.value.json() : { results: [] };


      const activeStudents = students.students?.filter(s => s.status === 'Active').length || 0;
      const activeCouncil = council.councilMembers?.filter(c => c.status === 'Active').length || 0;
      const upcomingEvents = events.events?.filter(e => new Date(e.date) > new Date()).length || 0;
      const activeAssignments = assignments.assignments?.filter(a => a.status === 'assigned').length || 0;
      
      // Admission statistics
      const admissionsData = admissions.applications || [];
      const pendingApps = admissionsData.filter(app => app.status === 'PENDING').length || 0;
      const acceptedApps = admissionsData.filter(app => app.status === 'ACCEPTED').length || 0;
      const rejectedApps = admissionsData.filter(app => app.status === 'REJECTED').length || 0;

      // Resource statistics
      const resourcesData = resources.resources || [];
      const activeResources = resourcesData.filter(r => r.isActive !== false).length || 0;
      
      // Calculate resources by type
      const resourcesByType = {
        documents: resourcesData.filter(r => r.type === 'document' || r.type === 'worksheet').length || 0,
        videos: resourcesData.filter(r => r.type === 'video').length || 0,
        pdfs: resourcesData.filter(r => r.type === 'pdf').length || 0,
        presentations: resourcesData.filter(r => r.type === 'presentation').length || 0
      };

      // Calculate recent resources (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentResources = resourcesData.filter(r => 
        r.createdAt && new Date(r.createdAt) > sevenDaysAgo
      ).length || 0;

      setRealStats({
        totalStudents: students.students?.length || 0,

        activeStudents,
        totalStaff: staff.staff?.length || 0,
        totalSubscribers: subscribers.subscribers?.length || 0,
        studentCouncil: activeCouncil,
        upcomingEvents,
        totalNews: news.news?.length || 0,
        activeAssignments,
        galleryItems: gallery.galleries?.length || 0,
        guidanceSessions: guidance.events?.length || 0,
        totalApplications: admissionsData.length || 0,
        pendingApplications: pendingApps,
        acceptedApplications: acceptedApps,
        rejectedApplications: rejectedApps,
        totalResources: resourcesData.length || 0,
        recentResources,
        activeResources,
        resourcesByType,
        totalCareers: careers.careers?.length || 0
      });

    } catch (error) {
      console.error('Error fetching real counts:', error);
    }
  };

  // Fetch counts when component mounts
  useEffect(() => {
    if (!loading) {
      fetchRealCounts();
    }
  }, [loading]);

  // Detect screen size and set initial sidebar state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      
      // Auto-open sidebar on large screens, close on small screens
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [setSidebarOpen]);

  const handleLogout = () => {
    // Clear ALL possible auth data - same as dashboard
    const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
    const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
    
    possibleUserKeys.forEach(key => localStorage.removeItem(key));
    possibleTokenKeys.forEach(key => localStorage.removeItem(key));
    
    window.location.href = '/pages/adminLogin';
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Only close sidebar on mobile screens
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSupportClick = () => {
    setShowSupportModal(true);
  };

  // Enhanced quick stats with real data including resources
  const quickStats = [

    { 
      label: 'Resources', 
      value: realStats.totalResources?.toLocaleString() || '0', 
      icon: FiFolder, 
      color: 'emerald', 
      change: `${realStats.recentResources || 0} recent` 
    },
    { 
      label: 'Applications', 
      value: realStats.totalApplications?.toLocaleString() || '0', 
      icon: FiFileText, 
      color: 'purple', 
      change: realStats.pendingApplications > 0 ? `${realStats.pendingApplications} pending` : '+8%' 
    }
  ];

  // Resource specific stats for the expanded view
  const resourceStats = [
    { 
      label: 'Documents', 
      value: realStats.resourcesByType?.documents?.toLocaleString() || '0', 
      icon: FiFileText, 
      color: 'blue' 
    },
    { 
      label: 'Videos', 
      value: realStats.resourcesByType?.videos?.toLocaleString() || '0', 
      icon: FiVideo, 
      color: 'purple' 
    },
    { 
      label: 'PDFs', 
      value: realStats.resourcesByType?.pdfs?.toLocaleString() || '0', 
      icon: FiFileText, 
      color: 'red' 
    },
    { 
      label: 'Presentations', 
      value: realStats.resourcesByType?.presentations?.toLocaleString() || '0', 
      icon: FiFolder, 
      color: 'orange' 
    }
  ];

  // Define default tabs if none provided - now with resource tab (counts removed)
  const defaultTabs = [
    { 
      id: 'overview', 
      label: 'Dashboard Overview', 
      icon: FiUser,
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
      id: 'results',
      label: 'Exam Results',
      icon: FiClipboard,
      badge: 'teal'
    },
    { 
      id: 'staff', 
      label: 'Staff Management', 
      icon: FiUserCheck,
      badge: 'orange'
    },
    { 
      id: 'assignments', 
      label: 'Assignments', 
      icon: FiBook,
      badge: 'red'
    },
{
id: 'careers',
      label: 'Careers',
      icon: FiCalendar,
      badge: 'lime'
},
    {
      id: 'student',
      label: 'Student Records',
      icon: FiInfo,
      badge: 'cyan'
}
,
    { 
      id: 'resources', 
      label: 'Learning Resources', 
      icon: FiFolder,
      badge: 'emerald',
    },
    {
      id: 'feebalances',
      label: 'Fee Balances',
      icon: FiDollarSign,
      badge: 'yellow'
    },

    { 
      id: 'admissions', 
      label: 'Admission Applications', 
      icon: FiClipboard,
      badge: 'purple',
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
      icon: IoPeopleCircle,
      badge: 'teal'
    },
    { 
      id: 'email', 
      label: 'Email Manager', 
      icon: FiMail,
      badge: 'indigo'
    },
    { 
      id: 'admins-profile', 
      label: 'Admins & Profile', 
      icon: MdAdminPanelSettings,
      badge: 'gray'
    }
  ];

  // Use provided tabs if non-empty, otherwise fall back to defaults
  const safeTabs = Array.isArray(tabs) && tabs.length > 0 ? tabs : defaultTabs;

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-full max-w-[320px] lg:max-w-[280px] xl:max-w-[320px] bg-white shadow-xl border-r border-gray-200 backdrop-blur-xl overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no user but loading is false, it means we're redirecting
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Support Modal */}
      {showSupportModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setShowSupportModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiHelpCircle className="text-blue-500" />
                Technical Support
              </h3>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <FiX className="text-lg text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Need help with the admin panel? I'm here to provide technical assistance anytime!
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors duration-200">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                    <FiMessageCircle className="text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">WhatsApp</p>
                    <p className="text-gray-600">079347260</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200 hover:border-purple-300 transition-colors duration-200">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                    <FiMail className="text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-600">emmannuelmakau90@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  💡 Available for technical assistance, bug fixes, and feature requests
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSupportModal(false)}
                className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 rounded-xl transition-all duration-200 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Open WhatsApp
                  window.open('https://wa.me/25479347260', '_blank');
                }}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 font-semibold"
              >
                Contact WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-full max-w-[320px] lg:max-w-[280px] xl:max-w-[320px] 2xl:max-w-[350px] bg-white shadow-xl border-r border-gray-200 backdrop-blur-xl overflow-hidden transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 lg:p-5 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <img 
                    src="/katz.png" 
                    alt="School Logo" 
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h1 className="text-sm lg:text-lg font-bold text-gray-800 truncate">
                  Katwanyaa High School
                </h1>
                <p className="text-gray-600 text-xs lg:text-sm font-medium truncate">Admin Portal</p>
              </div>
            </div>
            
            {/* Close button - only show on mobile */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <FiX className="text-xl" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 lg:p-5 overflow-y-auto hide-scrollbar">
            <div className="space-y-1 lg:space-y-2">
              {safeTabs.map((tab) => {
                const TabIcon = tab.icon || FiUser;
                return (
                 <button
                   key={tab.id}
                   onClick={() => handleTabClick(tab.id)}
                   className={`w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-3 lg:py-4 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                     activeTab === tab.id
                       ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-lg shadow-blue-500/10 backdrop-blur-sm border border-blue-200'
                       : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                   }`}
                 >
                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 lg:h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full shadow-lg shadow-blue-400/50"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`relative p-2 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800'
                  }`}>
                    <TabIcon className="text-sm lg:text-lg relative z-10" />
                  </div>

                  {/* Label */}
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="font-semibold text-xs lg:text-sm xl:text-base relative z-10 text-left truncate">
                      {tab.label}
                    </span>
                  </div>

                  {/* Active chevron */}
                  {activeTab === tab.id && (
                    <div className="text-blue-500">
                      <FiChevronRight className="text-sm lg:text-lg" />
                    </div>
                  )}
                </button>
              );
            })}
            </div>

            {/* Quick Stats with Real Data */}
            <div className="mt-6 lg:mt-8 space-y-3 lg:space-y-4">
              {/* Main Stats */}
              <div className="p-4 lg:p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-3 lg:mb-4">
                  <IoSparkles className="text-sm lg:text-lg" />
                  <span className="font-semibold text-xs lg:text-sm">Live Stats</span>
                </div>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  {quickStats.map((stat, index) => {
                    const StatIcon = stat.icon || FiUser;
                    return (
                     <div
                       key={stat.label}
                       className="text-center p-2 lg:p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer shadow-sm"
                     >
                      <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-${stat.color}-100 flex items-center justify-center mx-auto mb-1 lg:mb-2`}>
                        <StatIcon className={`text-${stat.color}-600 text-xs lg:text-sm`} />
                      </div>
                      <div className="text-gray-800 font-bold text-xs lg:text-sm">{stat.value}</div>
                      <div className="text-gray-600 text-[10px] lg:text-xs mt-1 truncate">{stat.label}</div>
                      <div className={`text-${stat.color}-600 text-[10px] lg:text-xs font-semibold mt-1 truncate`}>
                        {stat.change}
                      </div>
                     </div>
                    );
                  })}
                </div>
              </div>

              {/* Resource Type Breakdown */}
              {realStats.totalResources > 0 && (
                <div className="p-3 lg:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2 lg:mb-3">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <FiFolder className="text-sm lg:text-lg" />
                      <span className="font-semibold text-xs lg:text-sm">Resource Types</span>
                    </div>
                    <span className="text-emerald-600 text-[10px] lg:text-xs font-bold">
                      {realStats.totalResources} total
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 lg:gap-2">
                    {resourceStats.map((stat, index) => {
                      const StatIcon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className="flex items-center gap-1 lg:gap-2 p-1 lg:p-2 bg-white/80 rounded-lg border border-emerald-100 hover:border-emerald-200 transition-colors duration-200"
                        >
                          <div className={`w-5 h-5 lg:w-7 lg:h-7 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                            <StatIcon className={`text-${stat.color}-600 text-[10px] lg:text-xs`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-emerald-800 font-bold text-xs lg:text-sm truncate">{stat.value}</div>
                            <div className="text-gray-600 text-[10px] lg:text-xs truncate">{stat.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 lg:p-5 border-t border-gray-200 flex-shrink-0">
            {/* User Profile */}
            <div 
              className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-2xl border border-gray-200 mb-3 lg:mb-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-200"
              onClick={() => handleTabClick('admins-profile')}
            >
              <div className="relative">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                  {user.name?.charAt(0) || 'A'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-xs lg:text-sm truncate">
                  {user.name}
                </p>
                <p className="text-gray-600 text-[10px] lg:text-xs truncate">
                  {user.email}
                </p>
                <div className="flex items-center gap-1 mt-0.5 lg:mt-1">
                  <FiShield className="text-emerald-500 text-[10px] lg:text-xs" />
                  <span className="text-emerald-600 text-[10px] lg:text-xs font-medium capitalize truncate">
                    {user.role?.replace('_', ' ') || 'administrator'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-1 lg:gap-2 mb-2 lg:mb-3">
              <button
                className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-2 text-gray-600 hover:text-gray-800 rounded-xl transition-all duration-200 text-xs lg:text-sm hover:bg-gray-100"
                onClick={() => handleTabClick('admins-profile')}
              >
                <FiSettings className="text-sm lg:text-base" />
                <span className="truncate">Settings</span>
              </button>
              <button
                className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-2 text-gray-600 hover:text-gray-800 rounded-xl transition-all duration-200 text-xs lg:text-sm hover:bg-gray-100"
                onClick={handleSupportClick}
              >
                <FiHelpCircle className="text-sm lg:text-base" />
                <span className="truncate">Support</span>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 text-red-600 hover:text-red-700 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 hover:bg-red-50 group"
            >
              <div className="group-hover:rotate-180 transition-transform duration-300">
                <FiLogOut className="text-sm lg:text-lg" />
              </div>
              <span className="font-semibold text-xs lg:text-sm truncate">Sign Out</span>
            </button>

            {/* Version Info */}
            <div className="text-center mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-gray-200">
              <p className="text-gray-400 text-[10px] lg:text-xs">
                v2.1.0 • Katwanyaa High  School
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}