'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiUser, 
  FiCalendar, 
  FiFileText, 
  FiCheckCircle,
  FiArrowRight,
  FiClock,
  FiAward,
  FiUsers,
  FiBook,
  FiHome,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiStar,
  FiHelpCircle,
  FiPlay,
  FiShare2,
  FiChevronDown,
  FiBarChart2,
  FiHeart,
  FiTarget,
  FiGlobe,
  FiBookOpen,
  FiCpu,
  FiMusic,
  FiActivity,
  FiZap,
  FiTrendingUp,
  FiEye,
  FiLayers,
  FiPlus,
  FiX,
  FiFilter,
  FiSearch,
  FiRotateCw,
  FiRefreshCw, 
  FiEdit3,
  FiTrash2,
  FiMessageCircle,
  FiAlertTriangle,
  FiSave,
  FiImage,
  FiUpload,
  FiVideo,
  FiDollarSign,
  FiFile,
  FiClipboard,
  FiCreditCard,
  FiInfo,
  FiGrid,
  FiFolder,
  FiList,
  FiSettings,
  FiPieChart,
  FiTool,
  FiSmartphone,
  FiCode,
  FiShield,
  FiTarget as FiTargetIcon,
  FiBookmark,
  FiCalendar as FiCalendarIcon,
  FiBriefcase,
  FiGlobe as FiGlobeIcon,
  FiMic,
  FiCamera,
  FiMonitor,
  FiTrendingUp as FiTrendingUpIcon,
  FiTool as FiToolIcon,
  FiPenTool,
  FiDatabase,
  FiCloud,
  FiLock,
  FiShoppingBag,
  FiDroplet,
  FiTruck,
  FiScissors,
  FiChevronUp,
  FiChevronsDown,
  FiCoffee,
  FiChef,
  FiMusic as FiMusicIcon,
  FiArrowUpRight 
} from 'react-icons/fi';
import { 
  IoSchoolOutline,
  IoDocumentsOutline,
  IoSpeedometerOutline,
  IoPeopleOutline,
  IoLibraryOutline,
  IoStatsChartOutline,
  IoRocketOutline,
  IoBookOutline,
  IoCalculatorOutline,
  IoSparkles,
  IoAccessibilityOutline,
  IoBuildOutline,
  IoAnalyticsOutline,
  IoBulbOutline,
  IoCheckmarkCircleOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoReceiptOutline,
  IoShirtOutline,
  IoVideocamOutline,
  IoCloudDownloadOutline,
  IoEyeOutline,
  IoMedkitOutline,
  IoConstructOutline,
  IoCarOutline,
  IoRestaurantOutline,
  IoFlaskOutline,
  IoCodeSlashOutline,
  IoBusinessOutline,
  IoNewspaperOutline,
  IoLanguageOutline
} from 'react-icons/io5';
import { IoCheckmarkCircle, IoArrowForward, IoFlash } from 'react-icons/io5';

const formatDateWithOrdinal = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  
  // Safety check for invalid dates
  if (isNaN(date.getTime())) return '';

  const n = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  // Your preserved ordinal logic, condensed for refinement
  const getOrdinal = (num) => {
    const lastTwo = num % 100;
    if (lastTwo >= 11 && lastTwo <= 13) return num + 'th';
    
    switch (num % 10) {
      case 1:  return num + 'st';
      case 2:  return num + 'nd';
      case 3:  return num + 'rd';
      default: return num + 'th';
    }
  };

  return `${getOrdinal(n)} ${month} ${year}`;
};

// Result: formatDateWithOrdinal("2026-01-23") -> "23rd Jan 2026"


import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

// Modern Modal Component - Mobile Responsive


// New: Career Department Card Component - Removed div hover effects
const ModernCareerDepartmentCard = ({ department, icon: Icon, color, subjects, careerPaths, description }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const baseColor = color.split('from-')[1]?.split('-500')[0] || 'blue';

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-white rounded-[2rem] border border-slate-200 p-6 md:p-8 cursor-pointer transition-all duration-100  "
      >
        <div className="flex flex-col gap-5">
          {/* Icon Header */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} p-0.5 shadow-lg group-hover:rotate-3 transition-transform`}>
            <div className="w-full h-full bg-slate-900 rounded-[calc(1rem+2px)] flex items-center justify-center">
              <Icon className="text-2xl text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              {department}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm font-bold mt-3 leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          {/* Quick Subject Tags */}
          <div className="flex flex-wrap gap-2">
            {subjects.slice(0, 3).map((s, i) => (
              <span key={i} className="px-2 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-100">
                {s}
              </span>
            ))}
          </div>

          <div className={`mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-${baseColor}-600 group-hover:gap-4 transition-all`}>
            Explore Careers <FiArrowRight />
          </div>
        </div>
      </div>

      <CareerPortalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={{ department, Icon, color, subjects, careerPaths, description, baseColor }}
      />
    </>
  );
};

// Updated CareerPortalModal - Mobile Responsive with hidden scrollbar
const CareerPortalModal = ({ isOpen, onClose, data }) => {
  // Prevent background scrolling when modal is active
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with high Z-index */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999] "
        onClick={onClose}
      />
      
      {/* Container: Bottom-aligned on mobile (Drawer style), Centered on desktop */}
      <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
        <div 
          className="relative bg-white w-full md:max-w-4xl h-[94vh] md:h-auto md:max-h-[90vh] overflow-hidden rounded-t-[2.5rem] md:rounded-[3rem] shadow-xl animate-in slide-in-from-bottom-full duration-500 pointer-events-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner - Edge to Edge */}
          <div className={`relative shrink-0 h-40 md:h-52 bg-gradient-to-br ${data.color} p-8 flex items-end overflow-hidden`}>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
            
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-xl transition-all z-20"
            >
              <FiX className="text-xl" />
            </button>
            
            <div className="relative z-10 flex items-center gap-5">
              <div className="p-3 bg-white rounded-2xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                <data.Icon className={`text-2xl md:text-3xl text-slate-900`} />
              </div>
              <div>
                <span className="px-2 py-0.5 bg-black/20 rounded-full text-white text-[9px] font-black uppercase tracking-[0.3em] mb-2 inline-block">
                  Career Portal
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                  {data.department}
                </h2>
              </div>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Side: Stats & About */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Domain Focus</h4>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed font-bold italic">
                    "{data.description}"
                  </p>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Core Prerequisites</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.subjects.map((s, i) => (
                      <span key={i} className={`px-3 py-1.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-tight`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Career Grid */}
              <div className="lg:col-span-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Career Trajectories</h4>
                <div className="space-y-4">
                  {data.careerPaths.map((career, idx) => (
                    <div key={idx} className="group/item bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 hover:border-blue-500 transition-all hover:shadow-lg">
                      <div className="flex gap-5">
                        <div className="text-2xl font-black text-slate-100 group-hover/item:text-blue-500 transition-colors">0{idx + 1}</div>
                        <div>
                          <h5 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{career.title}</h5>
                          <p className="text-slate-500 text-sm leading-relaxed mb-4 font-medium">{career.description}</p>
                          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[9px] font-black text-blue-600 uppercase">Key Roles:</span>
                            <span className="text-[10px] font-bold text-slate-500">{career.examples}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

  {/* Sticky Footer - Refined Flex Layout */}
<div className="shrink-0 p-6 md:p-8 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
    
    {/* Left: Inquiry Info - Hidden on tiny screens if space is tight, or centered */}
    <div className="text-center sm:text-left">
      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
        Inquiry Reference
      </p>
      <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight">
        DEPT-{data.department.substring(0,3)}-2026
      </p>
    </div>

    {/* Right: Button Group - Always Flex */}
    <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
      {/* Secondary Close Button - Visible only on mobile for better UX */}
      <button
        onClick={onClose}
        className="flex-1 sm:hidden px-6 py-4 bg-slate-200 text-slate-700 rounded-[1.2rem] font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
      >
        Close
      </button>

      {/* Main Action Button */}
      <button 
        onClick={() => router.push('/pages/contact')}
        className="flex-[2] sm:flex-none px-6 md:px-10 py-4 bg-slate-900 text-white rounded-[1.2rem] md:rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] md:text-[11px] hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2"
      >
        <span>Ask <span className="hidden xs:inline">About Path</span></span>
        <FiArrowRight className="text-blue-400" />
      </button>
    </div>
  </div>
</div>
        </div>
      </div>
    </>
  );
};

const ModernEducationSystemCard = ({ system, icon: Icon, color, description, features, structure, advantages }) => {
  return (
    /* Removed p-2 on mobile so the card is edge-to-edge; kept rounded for desktop */
    <div className="group relative bg-slate-50 md:rounded-[2.5rem] p-0 md:p-2 ">
      {/* Outer Glow Effect - Hidden on mobile to keep edge clean */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 md:rounded-[2.5rem] hidden md:block`} />
      
      <div className="relative bg-white md:rounded-[2rem] border-y md:border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Top Header - Adjusted height for mobile screens */}
        <div className={`relative h-32 md:h-40 p-6 md:p-10 bg-gradient-to-br ${color} overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 md:w-72 h-64 md:h-72 bg-white/20 blur-[70px] md:blur-[90px] rounded-full -mr-32 -mt-32 animate-pulse" />
          
          <div className="relative z-10">
            <h3 className="text-xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              {system.name}
            </h3>
            <p className="text-white/90 text-[9px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.3em] mt-2 md:mt-3 uppercase opacity-80">
              {system.fullName}
            </p>
          </div>
        </div>

        {/* Floating Icon - Smaller on mobile */}
        <div className="relative px-6 md:px-8">
          <div className="absolute -top-8 md:-top-12 right-6 md:right-8 p-1 bg-white rounded-[1.2rem] md:rounded-[1.5rem] shadow-2xl border border-slate-100">
            <div className={`p-3 md:p-5 rounded-[1rem] md:rounded-[1.2rem] bg-gradient-to-br ${color} text-white shadow-inner active:scale-95 transition-transform`}>
              <Icon className="text-2xl md:text-4xl" />
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-6 md:p-10 pt-10 md:pt-12">
          <div className="relative mb-8 md:mb-10">
            <span className="absolute -top-4 -left-2 text-4xl md:text-6xl text-slate-100 font-black pointer-events-none">“</span>
            <p className="relative z-10 text-slate-500 leading-relaxed text-xs md:text-base font-bold italic">
              {description}
            </p>
          </div>

          {/* Educational Structure - 3 Columns preserved, font adjusted for small width */}
          <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-1">Academic Path</h4>
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-10">
            {structure.map((stage, idx) => (
              <div key={idx} className="relative overflow-hidden p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] bg-[#0F172A] border border-slate-800 transition-transform hover:-translate-y-1">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
                <div className="font-black text-white text-xl md:text-3xl leading-none tabular-nums">
                  {stage.years}
                </div>
                <div className="text-[8px] md:text-[9px] text-blue-400 font-black uppercase tracking-widest mt-2 md:mt-3 leading-tight">
                  {stage.name}
                </div>
              </div>
            ))}
          </div>

          {/* Features - Optimized spacing for narrow screens */}
          <div className="space-y-6 mb-8 md:mb-10">
             <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-1">
               System Pillars
             </h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 md:gap-y-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3 md:gap-4 items-start group/feat">
                    <div className={`flex-shrink-0 w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r ${color} mt-1.5`} />
                    <div className="min-w-0">
                      <h5 className="font-black text-slate-900 text-[11px] md:text-[13px] uppercase tracking-tight leading-tight mb-1">
                        {feature.title}
                      </h5>
                      <p className="text-slate-400 text-[10px] md:text-[11px] font-bold leading-snug">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Advantages - Pill Tags scrollable/wrap behavior */}
          <div className="pt-6 md:pt-8 border-t border-slate-100">
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {advantages.map((advantage, idx) => (
                <span key={idx} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-100 text-slate-900 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-wider md:tracking-[0.15em]">
                  {advantage}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const AdmissionPathCard = ({ path, onApply, index }) => {
  const getLocalImage = (type) => {
    const images = {
      grade7: '/im2.jpeg',
      transfer: '/student.jpg',
    };
    return images[type] || '/im2.jpeg';
  };

  // Dynamic theme color selection
  const themeColor = path.color.includes('blue') ? 'blue' : 'purple';

  return (
    <div className="relative bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 overflow-hidden transition-all duration-500 flex flex-col h-full">
      
      {/* 1. Image Section: Taller on mobile for visual impact */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={getLocalImage(path.type)}
          alt={path.title}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Mobile-optimized Status Badge */}
        <div className="absolute top-4 left-4">
          <span className="flex items-center gap-1.5 backdrop-blur-md bg-black/40 border border-white/20 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-white">
            <IoFlash className="text-yellow-400" />
            {path.deadline === 'Rolling Admission' ? 'Open' : 'Limited Seats'}
          </span>
        </div>
      </div>

      {/* 2. Content Body: Responsive Padding */}
      <div className="p-4 md:p-8 flex flex-col flex-1">
        
        {/* Layout: Icon + Title */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${path.color} p-0.5 shadow-lg`}>
            <div className="w-full h-full bg-white rounded-[calc(1rem-1px)] flex items-center justify-center">
               {path.icon({ className: `text-xl md:text-2xl text-${themeColor}-600` })}
            </div>
          </div>
          <h3 className="font-black text-slate-800 text-xl md:text-2xl tracking-tight leading-tight">
            {path.title}
          </h3>
        </div>

        <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
          {path.description}
        </p>

        {/* Features: Adaptive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 md:mb-8">
          {path.features.slice(0, 4).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
              <IoCheckmarkCircle className={`text-${themeColor}-500 shrink-0`} />
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>

        {/* 3. Footer: Vertical on tiny phones, Horizontal on tablet+ */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 bg-slate-100 rounded-full">
               <IoCalendarOutline className="text-slate-500 text-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Apply Before</span>
              <span className="text-sm font-bold text-slate-700">{path.deadline}</span>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/pages/apply-for-admissions')}
            className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r ${path.color} text-white rounded-xl md:rounded-2xl text-sm md:text-base font-bold transition-all active:scale-95 shadow-lg`}
          >
            Get Started
            <IoArrowForward className="ml-2 text-xl transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ feature, onLearnMore }) => {
  const FeatureIcon = feature.icon;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 overflow-hidden transition-all duration-300">
      {/* Icon Header */}
      <div className={`p-4 md:p-5 bg-gradient-to-r ${feature.color} bg-opacity-10`}>
        <div className="flex items-center justify-between">
          <div className="p-2 md:p-2.5 bg-white rounded-xl shadow-xs">
            <FeatureIcon className={`text-xl ${feature.color.split('from-')[1].split('to-')[0].replace('-500', '-600')}`} />
          </div>
          <span className="text-xs font-semibold px-2 py-1 md:px-3 md:py-1 bg-white/90 rounded-full text-gray-700">
            {feature.badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-3">{feature.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {feature.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50/70 rounded-lg p-3 text-center">
            <div className="font-bold text-gray-900">{feature.stats.students}</div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
          <div className="bg-gray-50/70 rounded-lg p-3 text-center">
            <div className="font-bold text-gray-900">{feature.stats.success}</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {feature.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
              <IoCheckmarkCircleOutline className="text-green-500 flex-shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onLearnMore}
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold transition-all duration-200"
        >
          Explore Feature
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ stat }) => {
  const StatIcon = stat.icon;

  return (
    <div className="group relative overflow-hidden rounded-xl md:rounded-[24px] bg-white p-1 transition-all duration-500">
      {/* Outer Border Glow - Only visible on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-500`} />
      
      {/* Inner Card Content */}
      <div className="relative h-full w-full rounded-lg md:rounded-[22px] bg-white p-4 md:p-6">
        <div className="flex flex-col h-full justify-between gap-4 md:gap-6">
          
          <div className="flex items-center justify-between">
            {/* Minimalist Glass Icon */}
            <div className={`relative flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-2xl`}>
              <StatIcon className="text-xl md:text-2xl transform transition-transform duration-500" />
              {/* Soft Glow behind icon */}
              <div className={`absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.color} blur-lg opacity-40 transition-opacity`} />
            </div>

            {/* Micro-Interaction Button */}
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
               </svg>
            </div>
          </div>

          <div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic">
                  {stat.number}
                </h3>
              </div>
            </div>
            
            {/* Decorative progress track */}
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full w-2/3 bg-gradient-to-r ${stat.color} rounded-full transform transition-transform duration-700 ease-out`} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {stat.sublabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these functions after your imports and before any component definitions
const getSubjectIcon = (subjectName) => {
  const subjectMap = {
    'Biology': FiActivity,
    'Chemistry': FiZap,
    'Physics': FiZap,
    'Mathematics': FiCpu,
    'English': FiBook,
    'Kiswahili': FiGlobe,
    'Geography': FiGlobe,
    'Geogrpahy': FiGlobe, // Added for typo in API
    'History': FiBook,
    'CRE': FiHeart,
    'HRE': FiHeart,
    'IRe': FiHeart,
    'Technical skills': FiActivity,
    'Technica skills': FiActivity, // Added for typo in API
    'Agriculture': FiActivity,
    'Business Studies': FiBarChart2,
    'Business studies': FiBarChart2, // Added for consistency
    'Home science': FiHome,
    'Computer studies': FiCpu,
    'CBC': FiBookOpen
  };
  
  return subjectMap[subjectName] || FiBook;
};

const getDepartmentIcon = (deptName) => {
  const deptMap = {
    'CBC': FiBookOpen,
    'Humanities': FiBook,
    'Humannisties': FiBook, // Added for typo in API
    'Mathematics': FiCpu,
    'Physical sciences': FiZap,
    'Physical Sciences': FiZap, // Added for API
    'Languages': FiGlobe,
    'Technical skills': FiActivity,
    'Teachnicals': FiActivity, // Added for typo in API
    'Computer': FiCpu,
    'ADministration': FiSettings, // Added for typo in API
    'Administration': FiSettings
  };
  
  return deptMap[deptName] || FiBook;
};

// Subject Card Component
const SubjectCard = ({ subject, index }) => {
  const SubjectIcon = getSubjectIcon(subject);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-4 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-sm">
          <SubjectIcon className="text-white text-lg" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{subject}</h4>
        </div>
      </div>
    </div>
  );
};

// Department Card Component
const DepartmentCard = ({ department, index }) => {
  const DepartmentIcon = getDepartmentIcon(department);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-4 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-sm">
          <DepartmentIcon className="text-white text-lg" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{department}</h4>
        </div>
      </div>
    </div>
  );
};

const ModernFeeCard = ({ 
  feeType, total, distribution = [], pdfPath, 
  year, term, icon: Icon, variant = "dark", badge 
}) => {
  const isDark = variant === "dark";

  return (
    <div className={`
      relative transition-all duration-500 shadow-2xl
      /* Mobile: Full Screen / Desktop: Rounded Card */
      rounded-none md:rounded-[3rem] 
      border-x-0 md:border
      ${isDark ? 'bg-[#0F172A] border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'}
    `}>
      
      {/* Top Header - Adjusted for Mobile Spacing */}
      <div className="p-6 md:p-12 border-b border-white/5">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border ${
              isDark ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
            }`}>
              <Icon className="text-xl md:text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter truncate leading-none">
                {feeType}
              </h3>
              <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Session {year} • {term}
              </p>
            </div>
          </div>
          {badge && (
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
              isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-600 text-white'
            }`}>
              {badge}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40`}>
            Total Payable Amount
          </p>
          <div className={`text-4xl md:text-6xl font-black tracking-tighter tabular-nums ${isDark ? 'text-blue-400' : 'text-slate-900'}`}>
            KSh {total?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Breakdown Section - Mapped from Distribution JSON */}
      <div className="p-6 md:p-12">
        <h4 className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-6 opacity-30`}>
          Detailed Breakdown
        </h4>
        
        <div className="space-y-1">
          {distribution.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex justify-between items-center py-4 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-slate-50'}`}
            >
              <div className="flex flex-col min-w-0 pr-4">
                <span className="font-black text-[13px] md:text-base uppercase tracking-tight truncate">
                  {item.name}
                </span>
                {item.description && (
                  <span className={`text-[10px] font-bold truncate opacity-40`}>
                    {item.description}
                  </span>
                )}
              </div>
              <span className="font-black text-sm md:text-lg tabular-nums shrink-0">
                {item.amount?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Download Link */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <a 
            href={pdfPath} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
              isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
            }`}
          >
            <IoCloudDownloadOutline size={20} />
            Download PDF Structure
          </a>
        </div>
      </div>
    </div>
  );
};
// Video Tour Component


const VideoTourSection = ({ videoTour, videoType, videoThumbnail }) => {
  // State to manage overlay visibility
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoTour) return null;

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = videoType === 'youtube' ? getYouTubeId(videoTour) : null;

  // Handler to hide overlay when playing
  const handlePlay = () => setIsPlaying(true);

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-100/80 shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* Header Section */}
      <div className="relative p-4 md:p-8 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/30 shadow-inner">
              <IoVideocamOutline className="text-white text-xl md:text-3xl" />
            </div>
            <div>
              <h3 className="text-xl md:text-3xl font-extrabold tracking-tight">Virtual School Tour</h3>
              <p className="text-blue-100/90 text-sm md:text-base font-medium mt-1">Experience our campus in immersive detail</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ultra HD 4K</span>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="p-4 md:p-10">
        <div className="relative mx-auto" style={{ maxWidth: '900px' }}>
          
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200/50 bg-black group">
            
            {/* Play Button Overlay - Now conditional on !isPlaying */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer group-hover:bg-black/20 transition-all duration-500"
                onClick={handlePlay}
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-600/90 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl transform group-110 transition-transform">
                  <FiPlay className="text-white text-2xl md:text-4xl ml-1.5" />
                </div>
                
                {/* Background Thumbnail */}
                {videoThumbnail && (
                  <div className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-700 group-105" 
                       style={{ backgroundImage: `url(${videoThumbnail})` }} />
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}
            
            {/* Video Player Interface */}
            <div className="relative aspect-video w-full">
              {videoType === 'youtube' && videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=${isPlaying ? 1 : 0}`}
                  className="absolute inset-0 w-full h-full"
                  title="Virtual school Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  onPlay={handlePlay}
                  onPause={() => setIsPlaying(false)}
                  controls
                  className="absolute inset-0 w-full h-full"
                  poster={videoThumbnail || ''}
                  preload="metadata"
                >
                  <source src={videoTour} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 rounded-lg"><FiClock className="text-blue-600 font-bold" /></div>
                <span className="text-sm font-bold text-slate-700">3:45 Duration</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-cyan-50 rounded-lg"><FiEye className="text-cyan-600 font-bold" /></div>
                <span className="text-sm font-bold text-slate-700">Premium Quality</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-100/50 p-2 rounded-2xl pr-4">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-slate-300 to-slate-400 shadow-sm"></div>
                ))}
              </div>
              <span className="text-xs font-black text-slate-600 uppercase tracking-tight">1.2k+ Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-6 md:p-8 border-t border-slate-100 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-slate-600 font-medium text-center sm:text-left">
            Want a more detailed view? <span className="font-extrabold text-indigo-600">Open the Interactive Map</span>
          </p>
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold transition-all shadow-lg active:scale-95">
            <FiMapPin className="text-lg" />
            <span>Launch School Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// Vision & Mission Section

const VisionMissionSection = ({ vision, mission, motto }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 py-6 md:py-8">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* 1. Vision Card - Responsive height */}
        <div className="md:col-span-7 bg-slate-900 rounded-[2rem] p-6 md:p-8 relative overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-center md:justify-between min-h-[180px] md:min-h-[220px]">
          <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-blue-600/10 blur-[50px] md:blur-[60px] rounded-full -mr-10 -mt-10"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 mb-3 md:mb-4">
              <IoEyeOutline className="text-blue-400 text-base md:text-lg" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-100">Vision</span>
            </div>
            <h3 className="text-lg md:text-2xl font-black text-white mb-2 md:mb-3 tracking-tight uppercase italic">
              The <span className="text-blue-500">Future</span> we build
            </h3>
            <p className="text-slate-400 text-[13px] md:text-base font-bold leading-snug max-w-lg">
              {vision || "To be a premier center of academic excellence in Machakos, nurturing globally competitive leaders through integrity."}
            </p>
          </div>
        </div>

        {/* 2. Mission Card - Tighter for mobile */}
        <div className="md:col-span-5 bg-white rounded-[2rem] p-6 md:p-8 border-2 border-slate-100 shadow-md flex flex-col justify-center md:justify-between min-h-[160px] md:min-h-[220px]">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 mb-4 shrink-0">
            <FiTarget className="text-blue-600 text-xl" />
          </div>
          
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900 mb-1.5 md:mb-2 uppercase tracking-tight">Our Mission</h3>
            <p className="text-slate-600 text-[12px] md:text-sm font-bold leading-relaxed">
              {mission || "Providing quality education via modern infrastructure, fostering discipline, innovation, and self-reliance."}
            </p>
          </div>
        </div>

        {/* 3. Motto Banner - Stacked layout on mobile */}
        <div className="md:col-span-12 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2rem] p-5 md:p-6 relative overflow-hidden shadow-lg">
          <FiZap className="absolute right-[-5%] top-1/2 -translate-y-1/2 text-white/5 text-7xl md:text-8xl -rotate-12 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 self-start md:self-center">
              <div className="w-11 h-11 md:w-12 md:h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 shrink-0">
                <FiAward className="text-white text-xl md:text-2xl" />
              </div>
              <div className="text-left">
                <span className="text-blue-200 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] block mb-0.5">The Spirit of Katwanyaa</span>
                <h3 className="text-white text-base md:text-lg font-black tracking-tighter uppercase">School Motto</h3>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 md:px-8 py-3 rounded-2xl md:rounded-3xl text-center">
                <p className="text-white text-lg md:text-2xl font-black italic tracking-tighter leading-none">
                  "{motto || "Strive for Excellence"}"
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


const ModernUniformRequirementsSection = ({ 
  admissionFeeDistribution, 
  admissionFeePdf, 
  admissionFeePdfName,
  admissionFeeDescription,
  admissionFeeYear,
  admissionFeeTerm
}) => {
  const uniformItems = admissionFeeDistribution || [];
  const totalCost = uniformItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    /* Removed margins and rounding on mobile (rounded-none), restored for desktop */
    <div className="bg-white rounded-none md:rounded-[2.5rem] border-x-0 border-t-0 md:border border-slate-100 shadow-2xl overflow-hidden max-w-full">
      
      {/* Header Section: Edge-to-edge on mobile */}
      <div className="relative p-6 md:p-12 bg-[#0F172A] text-white">
        {/* Glow effect - adjusted for mobile center */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] md:blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
              <IoShirtOutline className="text-blue-400 text-2xl md:text-3xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-tight">
                Admission <span className="text-blue-500">Breakdown</span>
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  {admissionFeeYear || '2026'} • {admissionFeeTerm || 'Full Session'}
                </p>
                {admissionFeeDescription && (
                  <span className="hidden md:inline text-white/20 text-[10px]">•</span>
                )}
                {admissionFeeDescription && (
                  <p className="text-white/40 text-[10px] italic font-bold truncate max-w-[150px] md:max-w-none">
                    {admissionFeeDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {admissionFeePdf && (
            <a 
              href={admissionFeePdf}
              download={admissionFeePdfName}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 active:scale-95"
            >
              <IoCloudDownloadOutline className="text-lg" />
              <span>Full Document (PDF)</span>
            </a>
          )}
        </div>
      </div>

      {/* Content Section: Individual Item Cards */}
      <div className="p-4 md:p-12 bg-slate-50/50">
        {uniformItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {uniformItems.map((item, index) => (
              <div 
                key={item.id || index}
                className="group bg-white border border-slate-200 rounded-2xl p-6 transition-all shadow-sm md:hover:shadow-xl md:hover:border-blue-200"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-900 text-[12px] uppercase tracking-wider mb-1">
                      {item.name}
                    </h4>
                    <p className="text-slate-400 text-[10px] font-bold leading-relaxed line-clamp-2">
                      {item.description || 'Standard requirement'}
                    </p>
                  </div>
                  <div className={`p-2 rounded-xl shrink-0 ${item.optional ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {item.optional ? <FiCheckCircle size={16} /> : <IoCheckmarkCircleOutline size={16} />}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee Amount</span>
                    <span className="text-xl font-black text-slate-900 tabular-nums">
                      KSh {parseInt(item.amount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {item.optional && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-black uppercase tracking-tighter">Optional</span>
                    )}
                    {item.boardingOnly && (
                      <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-black uppercase tracking-tighter">Boarding</span>
                    )}
                  </div>
                </div>
                
                {/* Visual Progress Line */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${item.optional ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[2rem]">
            <FiAlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-slate-900 font-black uppercase tracking-widest text-sm">No items found</h4>
            <p className="text-slate-400 text-xs font-bold mt-2">The admission list is being updated by the registrar.</p>
          </div>
        )}

        {/* Total Cost Summary Bento - Full width on Mobile */}
        {uniformItems.length > 0 && (
          <div className="mt-8 md:mt-12 p-8 md:p-12 bg-slate-900 rounded-[2rem] text-white shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-10 border border-white/5">
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
              <div className="p-5 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-600/20">
                <FiDollarSign size={28} className="text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-[10px] md:text-xs font-black text-blue-400 uppercase tracking-[0.4em] mb-2">
                  Total Admission Cost
                </h4>
                <div className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums leading-none">
                  KSh {totalCost.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-around w-full lg:w-auto lg:border-l border-white/10 lg:pl-12 gap-10 border-t lg:border-t-0 pt-8 lg:pt-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Mandatory</span>
                <span className="text-2xl font-black text-white">{uniformItems.filter(i => !i.optional).length} Items</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Optional</span>
                <span className="text-2xl font-black text-emerald-400">{uniformItems.filter(i => i.optional).length} Items</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// NEW: Academic Results Section Component
const AcademicResultsSection = ({ documentData }) => {
  const resultsData = [
    {
      name: 'Form 1 Results',
      pdf: documentData?.form1ResultsPdf,
      pdfName: documentData?.form1ResultsPdfName,
      description: documentData?.form1ResultsDescription,
      year: documentData?.form1ResultsYear,
      term: documentData?.form1ResultsTerm,
      icon: FiBook,
      accent: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      name: 'Form 2 Results',
      pdf: documentData?.form2ResultsPdf,
      pdfName: documentData?.form2ResultsPdfName,
      description: documentData?.form2ResultsDescription,
      year: documentData?.form2ResultsYear,
      term: documentData?.form2ResultsTerm,
      icon: FiBookOpen,
      accent: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      name: 'Form 3 Results',
      pdf: documentData?.form3ResultsPdf,
      pdfName: documentData?.form3ResultsPdfName,
      description: documentData?.form3ResultsDescription,
      year: documentData?.form3ResultsYear,
      term: documentData?.form3ResultsTerm,
      icon: FiLayers,
      accent: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    {
      name: 'Form 4 Results',
      pdf: documentData?.form4ResultsPdf,
      pdfName: documentData?.form4ResultsPdfName,
      description: documentData?.form4ResultsDescription,
      year: documentData?.form4ResultsYear,
      term: documentData?.form4ResultsTerm,
      icon: FiAward,
      accent: 'text-amber-400',
      bg: 'bg-amber-400/10'
    },
    {
      name: 'Mock Exams',
      pdf: documentData?.mockExamsResultsPdf,
      pdfName: documentData?.mockExamsPdfName,
      description: documentData?.mockExamsDescription,
      year: documentData?.mockExamsYear,
      term: documentData?.mockExamsTerm,
      icon: FiFileText,
      accent: 'text-rose-400',
      bg: 'bg-rose-400/10'
    },
    {
      name: 'KCSE Results',
      pdf: documentData?.kcseResultsPdf,
      pdfName: documentData?.kcsePdfName,
      description: documentData?.kcseDescription,
      year: documentData?.kcseYear,
      term: documentData?.kcseTerm,
      icon: FiTrendingUp,
      accent: 'text-indigo-400',
      bg: 'bg-indigo-400/10'
    }
  ];

  const availableResults = resultsData.filter(result => result.pdf);
  if (availableResults.length === 0) return null;

  return (
    /* Responsive Wrapper: Full width (rounded-none) on mobile, Elegant Card on desktop */
    <div className="bg-white rounded-none md:rounded-[2.5rem] border-x-0 md:border border-slate-100 shadow-2xl overflow-hidden">
      
      {/* Header Section - Edge-to-edge look */}
      <div className="relative p-6 md:p-12 bg-[#0F172A] text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] md:blur-[100px] rounded-full -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
              <IoStatsChartOutline className="text-blue-400 text-2xl md:text-3xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter">Academic <span className="text-blue-400">Reports</span></h3>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">Official Performance Archives</p>
            </div>
          </div>
          <div className="flex items-center self-start md:self-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
            <FiAward className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Verified Data</span>
          </div>
        </div>
      </div>

      {/* Main Grid - Results Cards */}
      <div className="p-4 md:p-12 bg-slate-50/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {availableResults.map((result, index) => (
            <div 
              key={index}
              className="group bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] p-6 transition-all hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl ${result.bg} ${result.accent} shrink-0`}>
                  <result.icon size={22} className="md:size-6" />
                </div>
                <div className="text-right">
                  <span className="block text-xl font-black text-slate-900 leading-none">{result.year}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{result.term || 'Annual'}</span>
                </div>
              </div>
              
              <h4 className="font-black text-slate-900 text-[13px] md:text-sm uppercase tracking-tight mb-2 truncate">
                {result.name}
              </h4>
              
              {result.description && (
                <p className="text-slate-400 text-[10px] font-bold leading-relaxed mb-6 line-clamp-2 min-h-[30px]">
                  {result.description}
                </p>
              )}
              
              <a 
                href={result.pdf}
                download={result.pdfName}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
              >
                <IoCloudDownloadOutline size={16} />
                <span>Get Report</span>
              </a>
            </div>
          ))}
        </div>

        {/* Additional Documents - Horizontal Bento */}
        {documentData?.additionalDocuments && documentData.additionalDocuments.length > 0 && (
          <div className="mt-10 md:mt-16 pt-10 border-t border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-1">
              Resources & Support Docs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documentData.additionalDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 md:p-6 bg-white rounded-2xl border border-slate-200 group transition-all">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors shrink-0">
                      <IoDocumentTextOutline className="text-slate-500 group-hover:text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-black text-slate-900 text-[11px] uppercase tracking-wide truncate">
                        {doc.description || doc.filename}
                      </h5>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {doc.year} • {doc.term || 'General'}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={doc.filepath}
                    download={doc.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-900 text-white rounded-xl active:scale-90"
                  >
                    <FiDownload size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ModernFAQItem = ({ faq, index, openFaq, setOpenFaq }) => {
  const isOpen = openFaq === index;
  
  return (
    /* Responsive rounding: rounded-none on mobile for edge-to-edge feel */
    <div className={`
      transition-all duration-300 border-b md:border border-slate-200/80 
      md:rounded-2xl overflow-hidden 
      ${isOpen ? 'bg-white shadow-xl md:shadow-blue-900/5' : 'bg-transparent md:bg-white/50'}
    `}>
      <button
        onClick={() => setOpenFaq(isOpen ? null : index)}
        className="w-full px-5 md:px-8 py-5 md:py-6 text-left flex items-center justify-between transition-colors active:bg-slate-50"
      >
        <div className="flex items-start gap-4 md:gap-6 flex-1">
          {/* Number badge - refined sizing */}
          <div className={`
            flex-shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center mt-0.5 transition-colors
            ${isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}
          `}>
            <span className="font-black text-[10px] md:text-xs">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`
              font-black tracking-tight text-[13px] md:text-lg transition-colors
              ${isOpen ? 'text-blue-600' : 'text-slate-900'}
            `}>
              {faq.question}
            </h3>
          </div>
        </div>

        {/* Improved Icon with background ring */}
        <div className={`
          ml-4 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all
          ${isOpen ? 'rotate-180 border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'}
        `}>
          <FiChevronDown className={isOpen ? 'text-blue-600' : 'text-slate-400'} size={14} />
        </div>
      </button>
      
      {/* Animated Answer Section */}
      {isOpen && (
        <div className="px-5 md:px-8 pb-6 md:pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="pl-[44px] md:pl-[60px]"> {/* Aligns text perfectly with the start of the question text */}
            <div className="h-px w-full bg-slate-100 mb-5" />
            <p className="text-slate-600 font-medium leading-relaxed text-xs md:text-base">
              {faq.answer}
            </p>
            
            {/* Contextual Action - Optional visual touch */}
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Official School Policy
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ComprehensiveAdmissions() {
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [documentData, setDocumentData] = useState(null);

  const router = useRouter();

  // Data for Career Departments
  const careerDepartments = [
    {
      department: 'SCIENCES',
      icon: IoFlaskOutline,
      color: 'from-blue-600 to-cyan-500',
      description: 'Explore the world through scientific inquiry and discovery',
      subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'Agriculture'],
      careerPaths: [
        {
          title: 'Medical & Health Sciences',
          description: 'Pursue careers in healthcare and medical research',
          examples: 'Doctors, Nurses, Pharmacists, Medical Researchers, Dentists'
        },
        {
          title: 'Engineering & Technology',
          description: 'Design and build innovative solutions for the future',
          examples: 'Civil Engineers, Electrical Engineers, Mechanical Engineers, Architects'
        },
        {
          title: 'Environmental Sciences',
          description: 'Protect and preserve our natural environment',
          examples: 'Environmental Scientists, Conservationists, Wildlife Biologists'
        },
        {
          title: 'Research & Development',
          description: 'Advance scientific knowledge through research',
          examples: 'Research Scientists, Laboratory Technicians, Biotechnologists'
        }
      ]
    },
    {
      department: 'MATHEMATICS',
      icon: IoCalculatorOutline,
      color: 'from-purple-600 to-pink-500',
      description: 'Master logical thinking and problem-solving skills',
      subjects: ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Business Mathematics'],
      careerPaths: [
        {
          title: 'Finance & Banking',
          description: 'Excel in financial analysis and economic planning',
          examples: 'Accountants, Financial Analysts, Bankers, Actuaries'
        },
        {
          title: 'Data Science & Analytics',
          description: 'Transform data into valuable insights',
          examples: 'Data Scientists, Statisticians, Market Researchers'
        },
        {
          title: 'Engineering & Architecture',
          description: 'Apply mathematical principles to design and construction',
          examples: 'Structural Engineers, Architects, Quantity Surveyors'
        },
        {
          title: 'Education & Research',
          description: 'Share mathematical knowledge and conduct research',
          examples: 'Mathematics Teachers, University Lecturers, Researchers'
        }
      ]
    },
    {
      department: 'LANGUAGES',
      icon: IoLanguageOutline,
      color: 'from-green-600 to-emerald-500',
      description: 'Develop communication skills and cultural understanding',
      subjects: ['English', 'Kiswahili', 'French', 'German', 'Chinese'],
      careerPaths: [
        {
          title: 'Communication & Media',
          description: 'Excel in writing, broadcasting, and media production',
          examples: 'Journalists, Editors, Translators, Content Writers'
        },
        {
          title: 'International Relations',
          description: 'Bridge cultural gaps in global contexts',
          examples: 'Diplomats, UN Officers, International Business Consultants'
        },
        {
          title: 'Education & Publishing',
          description: 'Teach languages and contribute to literary works',
          examples: 'Language Teachers, Publishers, Literary Critics'
        },
        {
          title: 'Tourism & Hospitality',
          description: 'Connect with people from around the world',
          examples: 'Tour Guides, Hotel Managers, Flight Attendants'
        }
      ]
    },
    {
      department: 'HUMANITIES',
      icon: IoNewspaperOutline,
      color: 'from-amber-600 to-orange-500',
      description: 'Understand human society, culture, and behavior',
      subjects: ['History', 'Geography', 'CRE/IRE/HRE', 'Life Skills', 'Government'],
      careerPaths: [
        {
          title: 'Law & Governance',
          description: 'Shape legal systems and public policy',
          examples: 'Lawyers, Judges, Policy Analysts, Human Rights Officers'
        },
        {
          title: 'Social Services',
          description: 'Support communities and individuals in need',
          examples: 'Social Workers, Counselors, Community Developers'
        },
        {
          title: 'Cultural Heritage',
          description: 'Preserve and promote cultural identity',
          examples: 'Museum Curators, Historians, Cultural Officers'
        },
        {
          title: 'Urban Planning',
          description: 'Design sustainable communities and cities',
          examples: 'Urban Planners, Environmental Consultants'
        }
      ]
    },
    {
      department: 'TECHNICAL & VOCATIONAL',
      icon: IoConstructOutline,
      color: 'from-red-600 to-rose-500',
      description: 'Develop practical skills for immediate employment',
      subjects: ['Computer Studies', 'Business Studies', 'Home Science', 'Agriculture', 'Art & Design'],
      careerPaths: [
        {
          title: 'Information Technology',
          description: 'Drive digital transformation and innovation',
          examples: 'Software Developers, Network Administrators, Cybersecurity Experts'
        },
        {
          title: 'Business & Entrepreneurship',
          description: 'Start and manage successful enterprises',
          examples: 'Business Owners, Marketing Managers, Financial Analysts'
        },
        {
          title: 'Hospitality & Home Economics',
          description: 'Excel in food, nutrition, and hospitality services',
          examples: 'Chefs, Nutritionists, Hotel Managers, Fashion Designers'
        },
        {
          title: 'Creative Arts & Design',
          description: 'Express creativity through various media',
          examples: 'Graphic Designers, Artists, Multimedia Specialists'
        }
      ]
    }
  ];

  // Data for Education Systems
  const educationSystems = [
    {
      system: {
        name: '8-4-4 SYSTEM',
        fullName: '8 Years Primary, 4 Years Secondary, 4 Years University'
      },
      icon: IoSchoolOutline,
      color: 'from-indigo-600 to-purple-500',
      description: 'The 8-4-4 system focuses on providing students with practical skills alongside academic knowledge. It emphasizes technical subjects and prepares students for both higher education and immediate employment opportunities.',
      structure: [
        { years: '8', name: 'Primary' },
        { years: '4', name: 'Secondary' },
        { years: '4', name: 'University' }
      ],
      features: [
        {
          title: 'Technical Emphasis',
          description: 'Strong focus on technical and vocational subjects'
        },
        {
          title: 'National Exams',
          description: 'KCPE at primary level and KCSE at secondary level'
        },
        {
          title: 'University Pathway',
          description: 'Direct progression to university education'
        },
        {
          title: 'Practical Skills',
          description: 'Emphasis on hands-on learning and real-world application'
        }
      ],
      advantages: [
        'Proven track record with decades of implementation',
        'Clear progression path to higher education',
        'Strong emphasis on technical and practical skills',
        'Nationally recognized certification (KCSE)',
        'Well-established university entry system'
      ]
    },
    {
      system: {
        name: 'CBC',
        fullName: 'Competency Based Curriculum'
      },
      icon: FiBookOpen,
      color: 'from-teal-600 to-green-500',
      description: 'The CBC system focuses on developing seven core competencies: communication, collaboration, critical thinking, creativity, citizenship, digital literacy, and learning to learn. It emphasizes practical skills and values over rote memorization.',
      structure: [
        { years: '2', name: 'Pre-Primary' },
        { years: '6', name: 'Primary' },
        { years: '6', name: 'Junior & Senior School' }
      ],
      features: [
        {
          title: 'Competency Based',
          description: 'Focus on skills and competencies rather than content'
        },
        {
          title: 'Continuous Assessment',
          description: 'Regular assessment throughout the learning process'
        },
        {
          title: 'Parental Involvement',
          description: 'Strong emphasis on parent-teacher collaboration'
        },
        {
          title: 'Digital Integration',
          description: 'Incorporation of technology in learning'
        }
      ],
      advantages: [
        'Develops practical life skills',
        'Encourages creativity and innovation',
        'Personalized learning paths',
        'Strong focus on values and citizenship',
        'Better preparation for the modern workforce'
      ]
    }
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch school data
        const schoolResponse = await fetch('/api/school');
        if (schoolResponse.ok) {
          const schoolData = await schoolResponse.json();
          if (schoolData.success) {
            setSchoolData(schoolData.school);
          }
        }

        // Fetch document data
        const documentsResponse = await fetch('/api/schooldocuments');
        if (documentsResponse.ok) {
          const documentsData = await documentsResponse.json();
          if (documentsData.success && documentsData.document) {
            setDocumentData(documentsData.document);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Dynamic stats from API data
  const dynamicStats = [
    { 
      icon: IoPeopleOutline, 
      number: schoolData?.studentCount ? schoolData.studentCount.toString() : '1,200+', 
      label: 'Total Students', 
      sublabel: 'Currently Enrolled',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: FiTrendingUp, 
      number: schoolData?.admissionCapacity ? schoolData.admissionCapacity.toString() : '300', 
      label: 'Admission Capacity', 
      sublabel: 'Annual Intake',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: IoSparkles, 
      number: schoolData?.staffCount ? `${schoolData.staffCount}:1` : '20:1', 
      label: 'Student-Teacher', 
      sublabel: 'Personalized Ratio',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: FiAward, 
      number: '98%', 
      label: 'Success Rate', 
      sublabel: 'Academic Excellence',
      color: 'from-orange-500 to-red-500'
    },
  ];

  // Admission paths - Updated based on your school's focus
  const admissionPaths = [
    {
      title: 'Form 1 Entry',
      icon: FiBookOpen,
      description: 'Join our Form 1 program with comprehensive academic curriculum and extracurricular activities',
      features: ['Academic Excellence', 'Extra-curricular Activities', 'Digital Literacy', 'Talent Development'],
      deadline: schoolData?.admissionCloseDate ? new Date(schoolData.admissionCloseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'May 30, 2024',
      color: 'from-blue-500 to-cyan-500',
      type: 'grade7'
    },
    {
      title: 'Transfer Students',
      icon: FiArrowRight,
      description: 'Seamless transfer from other schools with credit recognition and orientation support',
      features: ['Credit Transfer', 'Placement Assessment', 'Records Review', 'Orientation Program'],
      deadline: 'Rolling Admission',
      color: 'from-purple-500 to-pink-500',
      type: 'transfer'
    }
  ];

  // Academic Features
  const innovativeFeatures = [
    {
      icon: IoRocketOutline,
      title: 'Academic Excellence',
      description: 'Comprehensive curriculum with focus on core subjects and practical skills development',
      features: ['Quality Teaching', 'Regular Assessments', 'Exam Preparation', 'Academic Support'],
      badge: 'Advanced',
      color: 'from-blue-500 to-cyan-500',
      stats: { students: '500+', success: '95%' }
    },
    {
      icon: IoAccessibilityOutline,
      title: 'Holistic Development',
      description: 'Focus on academic, social, emotional, and physical growth through various programs',
      features: ['Sports Programs', 'Clubs & Societies', 'Leadership Training', 'Character Building'],
      badge: 'Comprehensive',
      color: 'from-purple-500 to-pink-500',
      stats: { students: '100%', success: '98%' }
    },
    {
      icon: IoBuildOutline,
      title: 'Practical Skills',
      description: 'Emphasis on practical competencies and real-world application of knowledge',
      features: ['Laboratory Work', 'Field Trips', 'Project Work', 'Skill Development'],
      badge: 'Practical',
      color: 'from-green-500 to-emerald-500',
      stats: { students: '300+', success: '90%' }
    }
  ];

  // Updated tabs based on your academic page design
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBook },
    { id: 'academics', label: 'Academics', icon: FiBookOpen },
    { id: 'career-paths', label: 'Career Paths', icon: FiBriefcase },
    { id: 'requirements', label: 'Requirements', icon: FiFileText },
    { id: 'fees', label: 'Fee Structure', icon: IoReceiptOutline },
    { id: 'results', label: 'Results', icon: IoStatsChartOutline }, // New Results tab
    { id: 'faq', label: 'FAQ', icon: FiHelpCircle },
  ];

  // Process steps for transfer
  const transferProcess = [
    {
      step: 1,
      title: 'Application Submission',
      description: 'Submit transfer documents and academic records for evaluation',
      duration: '2-3 days',
      requirements: ['Current school report', 'Birth certificate', 'Transfer letter']
    },
    {
      step: 2,
      title: 'Assessment & Placement',
      description: 'Academic assessment for proper grade placement and subject allocation',
      duration: '1 week',
      requirements: ['Placement tests', 'Subject evaluation', 'Skill assessment']
    },
    {
      step: 3,
      title: 'Credit Evaluation',
      description: 'Review and transfer of completed coursework and competencies',
      duration: '3-5 days',
      requirements: ['Transcript analysis', 'Credit approval', 'CBC competency mapping']
    },
    {
      step: 4,
      title: 'Admission & Orientation',
      description: 'Final admission and comprehensive student orientation program',
      duration: '1 week',
      requirements: ['Parent meeting', 'Student orientation', 'Resource distribution']
    }
  ];

  // Facilities Data from your academic page
  const facilitiesData = [
    {
      icon: FiCpu,
      title: 'Computer Labs',
      description: 'Modern computer labs with high-speed internet and latest software',
      features: ['Programming', 'Digital Literacy', 'Research', 'Online Learning']
    },
    {
      icon: FiActivity,
      title: 'Science Labs',
      description: 'Fully equipped laboratories for Physics, Chemistry and Biology',
      features: ['Experiments', 'Research', 'Practical Skills', 'Innovation']
    },
    {
      icon: IoLibraryOutline,
      title: 'Library',
      description: 'Digital and physical library with extensive resources',
      features: ['E-Books', 'Study Spaces', 'Research', 'Quiet Zones']
    },
    {
      icon: FiSmartphone,
      title: 'Smart Classrooms',
      description: 'Technology-enabled classrooms for interactive learning',
      features: ['Projectors', 'Digital Boards', 'Online Resources', 'Collaboration']
    }
  ];

  // FAQ Data updated with admission-specific questions
  const faqs = [
    {
      question: 'What are the admission requirements?',
      answer: schoolData?.admissionRequirements || 'Admission requires completion of primary education, KCPE results, birth certificate, and medical records. Transfer students need additional documents including previous school reports and transfer letter.'
    },
    {
      question: 'What is the fee structure and payment options?',
      answer: 'We offer both day and boarding options with transparent fee structures. Fees can be paid annually, per term, or in installments. We accept bank transfers, MPesa, and cash payments at the finance office.'
    },
    {
      question: 'Are there scholarships or financial aid available?',
      answer: 'Yes, we offer merit-based scholarships for academic excellence, talent scholarships in sports and arts, and need-based financial aid. Contact our admissions office for eligibility criteria and application details.'
    },
    {
      question: 'What curriculum do you follow?',
      answer: 'We follow the national curriculum with both CBC and 8-4-4 systems. We also integrate digital literacy and practical skills development across all subjects.'
    }
  ];

  const handleApply = (path) => {
    setShowApplicationForm(true);
  };

  const handleLearnMore = (feature) => {
    toast.success(`Learn more about ${feature.title}`);
  };

  const refreshData = () => {
    setLoading(true);
    const fetchSchoolData = async () => {
      try {
        const response = await fetch('/api/school');
        const data = await response.json();
        if (data.success) {
          setSchoolData(data.school);
          toast.success('Data refreshed successfully!');
        }
      } catch (error) {
        toast.error('Failed to refresh data');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  };

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Modernized Admissions Portal Header with MUI Loader */}
<header className="relative bg-[#0F172A] rounded-2xl md:rounded-[2rem] p-4 sm:p-5 md:p-8 text-white overflow-hidden shadow-2xl border border-white/5 mb-8">
  {/* Subtle Mesh Accents - Adjusted for mobile position */}
  <div className="absolute top-[-10%] right-[-5%] w-[180px] md:w-[250px] h-[180px] md:h-[250px] bg-blue-600/20 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />
  
  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6">
    
    {/* Left: Branding & Title */}
    <div className="flex flex-col gap-2.5 md:gap-3">
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Adjusted bar height for mobile */}
        <div className="h-8 md:h-10 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,99,235,0.5)]" />
        <div className="flex flex-col min-w-0"> {/* min-w-0 allows truncation/proper flex shrinking */}
          <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-blue-400 leading-tight truncate">
            {schoolData?.name || 'Mary Immaculate Girls High School'}
          </h2>
          <p className="text-[8px] md:text-[9px] font-bold text-white/40 tracking-[0.1em] sm:tracking-[0.2em] uppercase mt-0.5 sm:mt-1 italic">
            "Prayer, Discipline and Hardwork"
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">
          Admissions <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-400">Portal</span>
        </h1>
        {/* Mobile-friendly session badge */}
        <span className="text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/10 uppercase whitespace-nowrap">
          {schoolData?.academicYear || '2026'} Session
        </span>
      </div>
    </div>

    {/* Right: Modern Compact Action Hub */}
    <div className="flex items-center self-start md:self-center">
      <div className="p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl">
        <button
          onClick={refreshData}
          disabled={loading}
          className="flex items-center justify-center gap-2 h-9 md:h-10 px-3 md:px-4 rounded-lg md:rounded-xl
                     transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest
                     bg-white/5 hover:bg-white/10 text-white/70
                     active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <CircularProgress size={12} thickness={6} sx={{ color: '#3b82f6' }} />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <FiRefreshCw className={`text-xs md:text-base ${loading ? 'animate-spin' : ''}`} />
              {/* Show text on small screens too, but smaller */}
              <span className="inline">Refresh Info</span>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
</header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {dynamicStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

{schoolData && (() => {
  // Logic to check status against current date (2026)
  const today = new Date();
  const openDate = new Date(schoolData.admissionOpenDate);
  const closeDate = new Date(schoolData.admissionCloseDate);
  const isOpen = today >= openDate && today <= closeDate;

return (
  <div className={`rounded-2xl p-5 md:p-8 shadow-2xl border-2 transition-all duration-500 ${
    isOpen 
      ? 'bg-gradient-to-br from-emerald-600 to-teal-800 border-emerald-400/20' 
      : 'bg-gradient-to-br from-slate-800 to-slate-950 border-slate-700'
  }`}>
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      
      {/* Status Section */}
      <div className="flex items-start sm:items-center gap-4">
        <div className={`p-3 md:p-4 rounded-2xl backdrop-blur-md border shadow-inner shrink-0 ${
          isOpen ? 'bg-white/20 border-white/30' : 'bg-slate-800 border-slate-700'
        }`}>
          <IoCalendarOutline className={`w-6 h-6 md:w-7 md:h-7 ${isOpen ? 'text-white' : 'text-slate-500'}`} />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-lg md:text-2xl text-white tracking-tighter uppercase leading-tight">
            {isOpen ? 'Admissions Now Open' : 'Admissions Currently Closed'}
          </h3>
          <p className={`text-[11px] md:text-sm font-bold leading-snug mt-1 ${isOpen ? 'text-emerald-100' : 'text-slate-400'}`}>
            {isOpen 
              ? 'Join Mary Immaculate Girls High School for the upcoming academic year.' 
              : 'The application window has officially ended for this period.'}
          </p>
        </div>
      </div>

      {/* Dynamic Date Grid - Optimized for Mobile */}
      <div className="grid grid-cols-2 gap-0 py-3 px-2 sm:px-6 sm:py-4 bg-black/20 rounded-2xl border border-white/5">
        <div className="px-4 border-r border-white/10">
          <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isOpen ? 'text-emerald-300' : 'text-slate-500'}`}>
            Open Date
          </p>
          <p className="font-black text-sm md:text-lg text-white tabular-nums">
            {formatDate(schoolData.admissionOpenDate)}
          </p>
        </div>
        <div className="px-4">
          <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isOpen ? 'text-emerald-300' : 'text-slate-500'}`}>
            Final Deadline
          </p>
          <p className="font-black text-sm md:text-lg text-white tabular-nums">
            {formatDate(schoolData.admissionCloseDate)}
          </p>
        </div>
      </div>

      {/* Interactive Action Button - Full width on mobile */}
      <button
        disabled={!isOpen}
        onClick={() => router.push('/pages/apply-for-admissions')}
        className={`w-full lg:w-auto px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
          isOpen 
            ? 'bg-white text-emerald-800 hover:bg-emerald-50 hover:shadow-emerald-500/20' 
            : 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700'
        }`}
      >
        {isOpen ? 'Apply Now' : 'Closed'}
      </button>
    </div>
  </div>
);
})()}

        {/* Navigation Tabs - Modernized */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 overflow-hidden mb-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 font-semibold transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-600'
                  }`}
                >
                  <TabIcon className="text-lg" />
                  <span className="text-sm md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-4 md:p-5">
    {activeTab === 'overview' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 md:space-y-24">
    
    {/* 1. Hero / Introduction Section */}
    <div className="relative pt-4 pb-2 text-center px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4 md:mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-blue-700">
          Admissions Open {new Date().getFullYear()}
        </span>
      </div>
      
      <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-[1.1] text-balance">
        Welcome to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
          {schoolData?.name || "Our School"}
        </span>
      </h2>
      
      <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-base md:text-lg leading-relaxed px-2 text-balance">
        {schoolData?.description || "We are committed to nurturing well-rounded learners through quality education and strong values."}
      </p>
    </div>

    {/* 2. Vision/Mission Section */}
    <div className="px-2 md:px-4">
      <VisionMissionSection 
        vision={schoolData?.vision}
        mission={schoolData?.mission}
        motto={schoolData?.motto}
      />
    </div>

    {/* 3. Admission Paths - Mobile Optimized Grid */}
    <section className="relative overflow-hidden py-10 px-4 sm:px-8 bg-slate-50 rounded-3xl md:rounded-[40px] md:mx-4">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-blue-200/20 blur-3xl rounded-full" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h3 className="text-xl md:text-5xl font-black text-slate-900 tracking-tighter mb-3">
            Your <span className="text-blue-600">Future</span> Starts Here
          </h3>
          <p className="text-slate-500 text-xs md:text-lg max-w-xl mx-auto md:mx-0">
            Select the enrollment track that matches your goals.
          </p>
        </div>

        {/* Ensure cards don't get too tall on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
          {admissionPaths.map((path, index) => (
            <AdmissionPathCard
              key={path.title}
              path={path}
              index={index}
              onApply={() => router.push('/pages/apply-for-admissions')}
            />
          ))}
        </div>
      </div>
    </section>

    {/* 4. Bento Grid - Refined for Small Screens */}
    <div className="py-10 md:py-16 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-100">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-md mb-3 border border-slate-200">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Institutional Profile</span>
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            Why <span className="text-blue-600 whitespace-nowrap">Mary Immaculate?</span>
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-black uppercase">
            <FiAward className="text-blue-600" />
            <span>KICD APPROVED</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-black uppercase">
            <FiUsers className="text-blue-600" />
            <span>COMMUNITY</span>
          </div>
        </div>
      </div>

      {/* Bento Grid: Rows adjusted for mobile readability */}
      <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-min md:auto-rows-[200px] gap-4">
        
        {/* Academic Card */}
        <div className="md:col-span-7 relative rounded-3xl bg-slate-50 border-2 border-slate-200 p-6">
          <div className="flex flex-col h-full gap-4">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-200 shrink-0">
              <IoBulbOutline size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">Academic Achievement</h4>
              <p className="text-slate-600 text-[11px] sm:text-sm font-bold leading-snug">
                Consistently producing strong KCSE results with a focus on STEM subjects.
              </p>
            </div>
          </div>
        </div>

        {/* Faculty Card */}
        <div className="md:col-span-5 relative rounded-3xl bg-slate-900 p-6 text-white">
          <div className="flex flex-col h-full gap-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shrink-0">
              <FiUsers size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-black mb-1 uppercase tracking-tight text-blue-400">Expert Educators</h4>
              <p className="text-slate-300 text-[11px] sm:text-sm font-bold leading-snug">
                TSC-certified professionals dedicated to student mentorship.
              </p>
            </div>
          </div>
        </div>

        {/* Infrastructure Card - Full width, row flex on mobile */}
        <div className="md:col-span-12 relative rounded-3xl bg-white border-2 border-slate-900 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
              <FiCpu size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase">Modern Resources</h4>
          </div>
          <p className="text-slate-600 text-xs sm:text-base font-bold leading-relaxed">
            Science laboratories, computer programs, and spacious classrooms.
          </p>
          <div className="flex items-center gap-3 mt-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 self-start">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
              10k+ Alumni
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{activeTab === 'academics' && (
  <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10 md:space-y-20">
    
    {/* Section 1: Hero Header - Mobile Optimized */}
    <div className="relative pt-2">
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-slate-100 pb-8 md:pb-12 px-2">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-full mb-4 md:mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            <span className="text-[9px] md:text-[10px] text-white font-black uppercase tracking-[0.2em]">Academic Excellence</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-4">
            Academic <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Programs</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-xl font-medium leading-relaxed max-w-2xl">
            Mary Immaculate Girls High School offers a future-ready curriculum designed to cultivate critical thinking and global leadership.
          </p>
        </div>

        {/* Download Button - Fixed width for mobile */}
        {documentData?.curriculumPDF && (
          <a 
            href={documentData.curriculumPDF}
            download={documentData.curriculumPdfName}
            target="_blank"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-6 py-4 bg-slate-900 text-white rounded-2xl active:scale-95 transition-all shadow-xl"
          >
            <FiDownload className="text-xl text-blue-400" />
            <div className="text-left">
              <div className="font-bold text-xs md:text-sm tracking-tight">Download Curriculum</div>
              {documentData.curriculumYear && (
                <div className="text-[10px] opacity-60">
                  {documentData.curriculumYear} • {documentData.curriculumTerm || 'Full Year'}
                </div>
              )}
            </div>
          </a>
        )}
      </div>
    </div>

    {/* Section 2: Education Systems */}
    <section className="px-2">
      <div className="flex flex-col mb-6 md:mb-12">
        <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">Paths to Success</h3>
        <h4 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Education Systems</h4>
      </div>
      
      {/* Grid: 1 column on mobile, 2 on large */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {educationSystems.map((system, index) => (
          <ModernEducationSystemCard key={index} {...system} />
        ))}
      </div>
    </section>

    {/* Section 3 & 4: Subject Tiles & Departments (Unified Visuals) */}
    {[
      { title: "Subjects Offered", desc: "Core and elective disciplines.", count: schoolData?.subjects?.length, data: schoolData?.subjects, iconColor: "text-blue-600", bgColor: "bg-blue-50" },
      { title: "Departments", desc: "Academic and administrative wings.", count: schoolData?.departments?.length, data: schoolData?.departments, iconColor: "text-purple-600", bgColor: "bg-purple-50" }
    ].map((sect, i) => (
      <section key={i} className="relative bg-slate-50 rounded-[2rem] p-6 md:p-12 mx-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{sect.title}</h3>
            <p className="text-slate-500 text-xs font-medium">{sect.desc}</p>
          </div>
          <div className="px-3 py-1.5 bg-white self-start rounded-full shadow-sm border border-slate-200 text-[10px] font-black text-slate-600 uppercase">
            {sect.count || 0} Specialties
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {sect.data?.map((item, idx) => {
            const Icon = i === 0 ? getSubjectIcon(item) : getDepartmentIcon(item);
            return (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <div className={`w-10 h-10 mb-3 rounded-xl ${sect.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`${sect.iconColor} text-lg`} />
                </div>
                <h4 className="font-bold text-slate-800 text-[11px] leading-tight uppercase tracking-tight">{item}</h4>
              </div>
            );
          })}
        </div>
      </section>
    ))}

{/* Section 5: Stats & Calendar - Refined Responsive Dates */}
{schoolData?.openDate && (
  <div className="relative overflow-hidden bg-slate-900 md:rounded-[3rem] p-8 md:p-16 w-full">
    {/* Decorative Glow */}
    <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-blue-500/10 blur-[60px] md:blur-[100px] rounded-full -mr-24 -mt-24" />
    
    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12">
      <div className="text-center lg:text-left max-w-sm">
        <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight mb-3 uppercase">
          Academic <span className="text-blue-500">Calendar</span>
        </h3>
        <p className="text-slate-400 text-xs md:text-lg font-medium leading-relaxed">
          Mark your journey. Stay ahead of the curve with our key enrollment dates.
        </p>
      </div>


<div className="grid grid-cols-2 gap-3 md:gap-8 w-full lg:w-auto">
        
  {/* Year Opens Card */}
  <div className="bg-white/5 backdrop-blur-xl p-4 md:p-8 rounded-2xl border border-white/10 text-center min-w-0 flex flex-col justify-center">
    <div className="text-blue-400 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] mb-2 md:mb-3">
      Year Opens
    </div>
    <div className="text-white font-black tracking-tighter tabular-nums leading-tight">
      {/* On mobile, we use a slightly smaller, tighter font size 
         to ensure the "Ordinal Jan Year" format fits on one line.
      */}
      <span className="block md:hidden text-[11px] whitespace-nowrap">
        {formatDateWithOrdinal(schoolData.openDate)}
      </span>
      {/* Desktop View */}
      <span className="hidden md:block text-2xl lg:text-3xl">
        {formatDateWithOrdinal(schoolData.openDate)}
      </span>
    </div>
  </div>

  {/* Year Closes Card */}
  <div className="bg-white/5 backdrop-blur-xl p-4 md:p-8 rounded-2xl border border-white/10 text-center min-w-0 flex flex-col justify-center">
    <div className="text-rose-400 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] mb-2 md:mb-3">
      Year Closes
    </div>
    <div className="text-white font-black tracking-tighter tabular-nums leading-tight">
      {/* Mobile View */}
      <span className="block md:hidden text-[11px] whitespace-nowrap">
        {formatDateWithOrdinal(schoolData.closeDate)}
      </span>
      {/* Desktop View */}
      <span className="hidden md:block text-2xl lg:text-3xl">
        {formatDateWithOrdinal(schoolData.closeDate)}
      </span>
    </div>
  </div>

</div>
    </div>
  </div>
)}
  </div>
)}

{/* Career Paths Tab - Modern */}
{activeTab === 'career-paths' && (
  <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
    {/* Hero Section */}
    <div className="text-center px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Career Readiness</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
        Future <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Pathways</span>
      </h2>
      <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
        Strategic academic planning for diverse career trajectories. Our curriculum integrates industry-relevant skills with traditional excellence.
      </p>
    </div>

    {/* Career Guidance Banner - Full Width on Mobile */}
    <div className="relative overflow-hidden bg-slate-900 md:rounded-[2.5rem] p-8 md:p-12 text-white w-full">
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/20 blur-[60px] md:blur-[100px] rounded-full -mr-32 -mt-32" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center">
              <FiTarget className="text-blue-300 text-xl" />
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Professional Development</h3>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
            Personalized career mapping, university placement strategy, and industry immersion experiences. 
            We bridge academic learning with professional reality.
          </p>
        </div>
    <button 
  onClick={() => router.push('/pages/contact')}
  className="
    /* Layout */
    flex items-center justify-center gap-2 md:gap-3
    w-full lg:w-auto 
    
    /* Sizing & Shape */
    px-5 md:px-10 
    py-3.5 md:py-5 
    rounded-xl md:rounded-2xl 
    
    /* Aesthetics */
    bg-white text-slate-900 
    border border-slate-200 
    shadow-sm
    
    /* Typography */
    font-black uppercase 
    tracking-[0.1em] md:tracking-[0.2em] 
    text-[10px] md:text-[11px]
    
    /* Interactions (Simplified) */
    transition-transform active:scale-95
  "
>
  <span className="whitespace-nowrap">
    Schedule <span className="hidden xs:inline">Consultation</span>
    <span className="xs:hidden">Now</span>
  </span>
  
  <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-900 text-white">
    <FiArrowRight className="text-[10px] md:text-[12px]" />
  </div>
</button>
      </div>
    </div>

    {/* Career Departments Grid */}
    <div className="px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">Academic Tracks</h3>
          <p className="text-slate-500 mt-1 text-sm">Structured pathways aligned with industry demands</p>
        </div>
        <div className="mt-4 md:mt-0 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          {careerDepartments.length} Specialized Domains
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {careerDepartments.map((dept, index) => (
          <ModernCareerDepartmentCard key={index} {...dept} />
        ))}
      </div>
    </div>
  </div>
)}

          {activeTab === 'requirements' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-12">
              
              {/* Hero Header */}
              <div className="text-center mb-8 md:mb-12 px-2 md:px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Admission Checklist</span>
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 px-2">
                  Application <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Requirements</span>
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-2">
                  Everything you need to prepare for a successful application journey.
                </p>
              </div>

              {/* Uniform Requirements - Modern Card with API Data */}
              <ModernUniformRequirementsSection 
                admissionFeeDistribution={documentData?.admissionFeeDistribution}
                admissionFeePdf={documentData?.admissionFeePdf}
                admissionFeePdfName={documentData?.admissionFeePdfName}
                admissionFeeDescription={documentData?.admissionFeeDescription}
                admissionFeeYear={documentData?.admissionFeeYear}
                admissionFeeTerm={documentData?.admissionFeeTerm}
              />

      {/* Required Documents - Modern Grid */}
<div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-6 md:p-10 overflow-hidden">
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
          <IoDocumentTextOutline className="text-white text-2xl md:text-3xl" />
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
          Required Documents
        </h3>
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
        Essential paperwork for admission processing
      </p>
    </div>
    
    <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
      <IoCheckmarkCircleOutline className="text-lg" />
      <span className="text-[10px] font-black uppercase tracking-widest">Mandatory Set</span>
    </div>
  </div>

  {/* Document Cards Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {(schoolData?.admissionDocumentsRequired?.length > 0 ? schoolData.admissionDocumentsRequired : [
      "Original KCPE Certificate",
      "Birth Certificate",
      "Passport Size Photos (4)",
      "Medical Report",
      "Transfer Letter (if applicable)",
      "Previous School Reports"
    ]).map((doc, index) => (
      <div 
        key={index}
        className="group relative bg-white border-2 border-slate-50 rounded-[2rem] p-6 transition-all hover:border-blue-400 hover:shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <IoDocumentTextOutline className="text-slate-400 group-hover:text-white text-xl" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-4 border-white">
              {index + 1}
            </div>
          </div>
          
          <div className="min-w-0">
            <h4 className="font-black text-slate-900 text-sm leading-tight uppercase tracking-tight truncate group-hover:whitespace-normal">
              {doc}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                Required
              </span>
              {index === 0 && (
                <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  Original
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

{/* Important Notes - Full-Screen Mobile Strategy */}
<div className="mt-8 md:mt-12 p-6 md:p-12 bg-slate-900 rounded-none md:rounded-[2.5rem] relative overflow-hidden border-y border-white/5 md:border shadow-2xl">
  {/* Amber Glow - Repositioned for mobile visibility */}
  <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-amber-500/10 blur-[60px] md:blur-[80px] rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32"></div>
  
  <div className="relative z-10">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-2.5 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
        <FiAlertTriangle className="text-slate-900 text-lg md:text-xl" />
      </div>
      <h4 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.3em] md:tracking-[0.4em]">
        Important <span className="text-amber-500">Submission</span> Notes
      </h4>
    </div>
    
    {/* Grid: 1 column on mobile, 2 on desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-5">
      {[
        "All documents must be original or certified copies",
        "Documents should be submitted in a clear plastic folder",
        "Incomplete applications will not be processed",
        "Submit copies along with originals for verification"
      ].map((note, i) => (
        <div key={i} className="flex items-start gap-4 group">
          {/* Bullet Point with subtle pulse for high visibility */}
          <div className="relative mt-1.5 shrink-0">
            <div className="w-2 h-2 rounded-full bg-amber-500 z-10 relative" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-amber-500 animate-ping opacity-20" />
          </div>
          
          <p className="text-[12px] md:text-[13px] font-bold text-slate-400 leading-relaxed transition-colors group-hover:text-white">
            {note}
          </p>
        </div>
      ))}
    </div>
  </div>
</div>
</div>

{/* Transfer Process - Modern Timeline Optimized for All Screens */}
<div className="bg-slate-900 rounded-none md:rounded-[3rem] p-6 md:p-12 text-white relative overflow-hidden">
  {/* Decorative Background Glow */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32 invisible md:visible" />

  <div className="relative z-10">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 md:mb-16 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
            <FiArrowRight className="text-white text-xl" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
            Transfer <span className="text-blue-400">Process</span>
          </h3>
        </div>
        <p className="text-slate-400 text-sm md:text-base font-medium">Seamless transition with 4-step verification</p>
      </div>
      
      {/* Time Badge - Styled for mobile */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
        <FiClock className="text-yellow-400 text-sm" />
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-300">2-3 Weeks Total</span>
      </div>
    </div>

    {/* Steps Grid: Stacked on mobile, Grid on Tablet/Desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
      {transferProcess.map((step, index) => (
        <div 
          key={index}
          className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:bg-white/[0.07]"
        >
          {/* Step Number Badge */}
          <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-blue-900/40 z-20">
            {step.step}
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  {step.title}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-yellow-500/80 text-[10px] font-black uppercase tracking-widest">
                <FiClock className="text-xs" />
                {step.duration}
              </div>
            </div>
            
            <p className="text-slate-400 text-xs md:text-sm font-bold leading-relaxed">
              {step.description}
            </p>
            
            {/* Requirements List */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Checklist</span>
              <ul className="space-y-2.5">
                {step.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[11px] md:text-xs text-slate-300 font-medium">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500/50 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desktop Connector Line */}
          {index < transferProcess.length - 1 && (
            <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-[1px] bg-white/10 z-0" />
          )}
        </div>
      ))}
    </div>

    {/* CTA Footer - Bento Style */}
    <div className="mt-12 md:mt-16 p-6 md:p-8 bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-[2rem]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <IoCheckmarkCircleOutline className="text-emerald-400 text-3xl" />
          </div>
          <div>
            <h4 className="text-xl font-black text-white">Ready to Join Us?</h4>
            <p className="text-slate-400 text-sm font-medium">Complete all steps for official admission approval</p>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/pages/apply-for-admissions')}
       className="hidden md:flex w-auto px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-50 transition-all active:scale-95 shadow-2xl shadow-white/5"
        >
          Start Application
        </button>
      </div>
    </div>
  </div>
</div>

         
            </div>
          )}

{activeTab === 'fees' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-12">
    
    {/* Layout shifts between 1 and 2 columns based on data availability */}
    <div className={`grid gap-0 md:gap-12 ${
      documentData?.feesDayDistributionJson?.length > 0 && documentData?.feesBoardingDistributionJson?.length > 0 
      ? "lg:grid-cols-2" 
      : "grid-cols-1"
    }`}>
      
      {/* Boarding Section */}
      {documentData?.feesBoardingDistributionJson?.length > 0 && (
        <ModernFeeCard
          variant="dark"
          feeType="Boarding School"
          total={documentData?.feesBoardingDistributionJson?.reduce((sum, i) => sum + (i.amount || 0), 0)}
          distribution={documentData?.feesBoardingDistributionJson}
          pdfPath={documentData?.feesBoardingDistributionPdf}
          year={documentData?.feesBoardingYear || "2026"}
          term={documentData?.feesBoardingTerm || "Term 1"}
          icon={IoBookOutline}
          badge="Full Board"
        />
      )}

      {/* Day Section */}
      {documentData?.feesDayDistributionJson?.length > 0 && (
        <ModernFeeCard
          variant="light"
          feeType="Day School"
          total={documentData?.feesDayDistributionJson?.reduce((sum, i) => sum + (i.amount || 0), 0)}
          distribution={documentData?.feesDayDistributionJson}
          pdfPath={documentData?.feesDayDistributionPdf}
          year={documentData?.feesDayYear || "2026"}
          term={documentData?.feesDayTerm || "Term 1"}
          icon={FiHome}
          badge="Standard"
        />
      )}
    </div>

    {/* Optional: Empty State */}
    {!documentData?.feesDayDistributionJson?.length && !documentData?.feesBoardingDistributionJson?.length && (
      <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Fees Structure Not Available</p>
      </div>
    )}
  </div>
)}

{activeTab === 'results' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 md:space-y-12">
    
    {/* Hero Header - Adjusted for Mobile */}
    <div className="text-center mb-6 md:mb-12 pt-4 md:pt-0">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-full mb-4 md:mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-700">Academic Performance</span>
      </div>
      
      <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 px-4 leading-tight">
        Examination <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Results</span>
      </h2>
      
      <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-6">
        Access past examination results, performance reports, and academic archives.
      </p>
    </div>

    {/* Academic Results Section - This will now occupy full width on mobile inside its component */}
    <div className="-mx-4 md:mx-0">
       <AcademicResultsSection documentData={documentData} />
    </div>

    {/* Results Archive Notice - Full bleed on mobile */}
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-y md:border border-blue-200/60 rounded-none md:rounded-3xl p-6 md:p-8 -mx-4 md:mx-0">
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
        <div className="p-3 bg-white rounded-2xl shadow-sm shadow-blue-200/50">
          <FiInfo className="text-blue-500 text-xl md:text-2xl" />
        </div>
        <div className="space-y-2">
          <h4 className="font-black text-blue-900 text-sm md:text-lg uppercase tracking-tight">
            Results Archive Information
          </h4>
          <p className="text-blue-700/80 text-xs md:text-base font-medium leading-relaxed">
            All examination results are available for download in PDF format. Results are typically uploaded 
            within <span className="text-blue-900 font-bold">2 weeks</span> after official release. For any missing results or technical issues, please contact 
            the academic office.
          </p>
        </div>
      </div>
    </div>
  </div>
)}

          {/* FAQ Tab - Modern & Responsive */}
          {activeTab === 'faq' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-10">
              
              {/* Hero Header */}
              <div className="text-center mb-8 md:mb-10 px-2 md:px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Quick Answers</span>
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 px-2">
                  Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Questions</span>
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-2">
                  Clear answers to common queries about admissions, curriculum, fees, and school policies.
                </p>
              </div>

              {/* FAQ Items - Clean & Responsive */}
              <div className="space-y-3 md:space-y-4 px-2 md:px-0">
                {faqs.map((faq, index) => (
                  <ModernFAQItem
                    key={index}
                    faq={faq}
                    index={index}
                    openFaq={openFaq}
                    setOpenFaq={setOpenFaq}
                  />
                ))}
              </div>

    
            </div>
          )}
        </div>

        {/* Modernized CTA Section - Refined Typography */}
        <div className="relative overflow-hidden bg-slate-900 rounded-xl md:rounded-[24px] p-4 md:p-12 text-center shadow-2xl">
          
          {/* Static Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            
            {/* 1. Modern Badge */}
            <div className="mb-4 md:mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                Enrollment Open {new Date().getFullYear()}
              </span>
            </div>

            {/* 2. Responsive Typography (Reduced Sizes) */}
            <h2 className="text-xl md:text-3xl font-black text-white mb-4 tracking-tight leading-tight text-balance">
              Ready to Begin Your <span className="text-blue-400">Academic Journey This year</span>
            </h2>
            
            {/* Description: Scaled down to base size for better reading density */}
            <p className="text-slate-400 mb-6 md:mb-8 text-sm md:text-base leading-relaxed max-w-lg mx-auto text-balance">
              Join a community dedicated to nurturing future leaders through personalized attention and holistic development.
            </p>

            {/* Action Buttons – always flex row, no wrap */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
              
              {/* Primary Button */}
              <button
                onClick={() => router.push('/pages/apply-for-admissions')}
                className="flex-shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5 
                           bg-white text-slate-900 rounded-xl font-bold text-xs sm:text-sm 
                           tracking-wide flex items-center justify-center gap-2 
                           active:scale-95 transition-transform"
              >
                Apply Online
                <FiArrowRight size={14} />
              </button>

            </div>

            {/* 4. Trust Indicator */}
            <p className="mt-4 md:mt-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold opacity-60">
              Application takes ~5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}