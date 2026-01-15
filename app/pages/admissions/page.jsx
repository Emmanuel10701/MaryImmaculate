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

import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

// Modern Modal Component - Mobile Responsive
const ModernModal = ({ children, open, onClose, maxWidth = '700px' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden w-full"
        style={{ 
          maxWidth: maxWidth,
          maxHeight: '85vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// New: Career Department Card Component - Removed div hover effects
const ModernCareerDepartmentCard = ({ department, icon: Icon, color, subjects, careerPaths, description }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const baseColor = color.split('from-')[1]?.split('-500')[0] || 'blue';

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-white rounded-[2rem] border border-slate-200/60 p-4 md:p-7 cursor-pointer transition-all active:scale-95"
      >
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Icon Header */}
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${color} p-0.5 shadow-md`}>
            <div className="w-full h-full bg-slate-900 rounded-[calc(1rem+2px)] flex items-center justify-center">
              <Icon className="text-xl md:text-2xl text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
              {department}
            </h3>
            <p className="text-slate-500 text-sm font-medium mt-2 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Quick Subject Tags */}
          <div className="flex flex-wrap gap-2">
            {subjects.slice(0, 3).map((s, i) => (
              <span key={i} className="px-2 py-1 md:px-3 md:py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                {s}
              </span>
            ))}
          </div>

          <div className={`mt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-${baseColor}-600`}>
            Explore Careers <FiArrowRight />
          </div>
        </div>
      </div>

      {/* Career Portal Modal - Centered with Dark Backdrop */}
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
  if (!isOpen) return null;

  // Function to limit text length
  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Function to truncate career examples
  const truncateExamples = (examples, maxLength = 40) => {
    if (examples.length <= maxLength) return examples;
    return examples.substring(0, maxLength) + '...';
  };

  return (
    <>
      {/* Dark Backdrop */}
      <div 
        className="fixed inset-0  backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Centered Modal Container */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-2 md:p-4 pointer-events-none">
        {/* Modal Content - Mobile Responsive */}
        <div 
          className="relative bg-white w-full max-w-full md:max-w-3xl max-h-[110vh] md:max-h-[100vh] overflow-y-auto rounded-xl md:rounded-[2rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 pointer-events-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header Banner - Mobile Responsive */}
          <div className={`relative h-32 md:h-40 bg-gradient-to-br ${data.color} p-4 md:p-8 flex items-end`}>
            <button 
              onClick={onClose} 
              className="absolute top-3 right-3 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 bg-black/30 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10"
            >
              <FiX className="text-lg md:text-xl" />
            </button>
            
            <div className="relative z-10 flex items-center gap-3 md:gap-4 w-full">
              <div className="p-2 md:p-3 bg-white/90 backdrop-blur-sm rounded-lg md:rounded-xl shadow-lg">
                <data.Icon className={`text-xl md:text-2xl text-${data.baseColor}-600`} />
              </div>
              <div>
                <span className="px-2 py-1 md:px-3 md:py-1 bg-black/30 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-2 inline-block">
                  Career Portal
                </span>
                <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  {data.department}
                </h2>
              </div>
            </div>
          </div>

          {/* Modal Content - Mobile Responsive */}
          <div className="p-4 md:p-8">
            <div className="grid md:grid-cols-3 gap-4 md:gap-8">
              
              {/* Left Column: Overview & Subjects */}
              <div className="md:col-span-1 space-y-4 md:space-y-6">
                {/* Overview - Reduced Text */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    Overview
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {truncateText(data.description, 100)}
                  </p>
                </div>
                
                {/* Core Subjects - Compact Display */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    Core Subjects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.subjects.slice(0, 4).map((s, i) => (
                      <span 
                        key={i} 
                        className={`px-2 py-1 md:px-3 md:py-1.5 bg-${data.baseColor}-50 text-white rounded-lg text-xs font-semibold border border-${data.baseColor}-100`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Career Paths:</span>
                    <span className="font-bold text-slate-700">{data.careerPaths.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-medium mt-2">
                    <span>Subjects:</span>
                    <span className="font-bold text-slate-700">{data.subjects.length}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Career Trajectories - Mobile Responsive */}
              <div className="md:col-span-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Career Pathways
                </h4>
                <div className="space-y-3">
                  {data.careerPaths.slice(0, 4).map((career, idx) => (
                    <div 
                      key={idx} 
                      className="bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-${data.baseColor}-500`}>
                          0{idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-bold text-slate-900 mb-1 leading-tight">
                            {career.title}
                          </h5>
                          <p className="text-slate-500 text-xs leading-relaxed mb-2 line-clamp-2">
                            {truncateText(career.description, 80)}
                          </p>
                          
                          {career.examples && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Roles:
                              </span>
                              <span className={`text-[10px] font-medium text-${data.baseColor}-600 bg-white px-2 py-1 rounded border border-slate-200 line-clamp-1`}>
                                {truncateExamples(career.examples, 35)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View More Indicator */}
                {data.careerPaths.length > 4 && (
                  <div className="mt-4 text-center">
                    <span className="text-xs text-slate-400 font-medium">
                      +{data.careerPaths.length - 4} more career paths available
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Modal Footer - Mobile Responsive */}
          <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-700">{data.department}</span> Faculty
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-2 md:px-4 md:py-2 border border-slate-300 text-slate-700 rounded-lg font-medium transition-all duration-200 text-xs"
                >
                  Close
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
    <div className="group relative bg-slate-50 rounded-2xl md:rounded-[2rem] p-2 transition-all duration-500">
      {/* Outer Glow / Border Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-500 rounded-2xl md:rounded-[2rem]`} />
      
      <div className="relative bg-white rounded-xl md:rounded-[1.8rem] border border-slate-200/60 overflow-hidden">
        
        {/* Top Header - Sleeker Gradient */}
        <div className={`relative h-32 p-6 md:p-8 bg-gradient-to-br ${color} overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full -mr-32 -mt-32 animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 blur-[40px] rounded-full" />
          
          <div className="relative z-10">
            <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase">{system.name}</h3>
            <p className="text-white/80 text-xs font-bold tracking-[0.2em] mt-1 uppercase">{system.fullName}</p>
          </div>
        </div>

        {/* Floating Icon Section */}
        <div className="relative px-6 md:px-8">
          <div className={`absolute -top-6 md:-top-8 right-6 md:right-8 p-3 md:p-4 bg-white rounded-xl md:rounded-2xl shadow-xl border border-slate-100 transition-transform duration-500`}>
            <div className={`p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${color} text-white shadow-inner`}>
              <Icon className="text-2xl md:text-3xl" />
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-6 md:p-8 pt-8 md:pt-10">
          <p className="text-slate-500 leading-relaxed text-sm font-medium mb-6 md:mb-8 italic">
            "{description}"
          </p>

          {/* Educational Structure - Bento Style */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
            {structure.map((stage, idx) => (
              <div key={idx} className="relative overflow-hidden p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color} opacity-40`} />
                <div className="font-black text-slate-900 text-xl md:text-2xl leading-none">{stage.years}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-2">{stage.name}</div>
              </div>
            ))}
          </div>

          {/* Features - Clean Minimalist Grid */}
          <div className="space-y-3 mb-6 md:mb-8">
             <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
               Core System Features
             </h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3 md:gap-4 items-center">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r ${color}`} />
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm leading-tight">{feature.title}</h5>
                      <p className="text-slate-400 text-[11px] font-medium leading-tight">{feature.description}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Advantages - Modern Pill Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {advantages.map((advantage, idx) => (
              <span key={idx} className="px-2 py-1 md:px-3 md:py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {advantage}
              </span>
            ))}
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
// Feature Card Component
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
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight italic">
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
        <div className="p-2.5 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 rounded-xl shadow-sm">
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
  feeType, 
  total, 
  distribution, 
  pdfPath, 
  pdfName, 
  icon: Icon, 
  gradient, 
  term = "Annual",
  badge,
  features = []
}) => {
  const baseColor = gradient.split('-')[1] || 'orange';
  
  return (
    <div className="relative w-full min-w-full bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden mx-auto">
      {/* Header Section - Full Width with Responsive Padding */}
      <div className={`relative w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 bg-gradient-to-r ${gradient} text-white`}>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/10 blur-[40px] sm:blur-[60px] md:blur-[80px] rounded-full -mr-16 sm:-mr-24 md:-mr-32 -mt-16 sm:-mt-24 md:-mt-32"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 md:p-3 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/30">
              <Icon className="text-white text-xl sm:text-2xl md:text-2xl" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{feeType}</h3>
              <p className="text-white/90 text-sm sm:text-base">{term} Fee Structure</p>
            </div>
          </div>
          
          {badge && (
            <span className="self-start sm:self-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        
     {/* Total Fee Display - Condensed Modern Version */}
<div className="text-center py-3 sm:py-5 border-t border-white/10 bg-white/5 backdrop-blur-sm rounded-b-2xl">
  <div className="flex flex-col items-center gap-0 sm:gap-1">
    <span className="text-[10px] sm:text-xs md:text-sm font-bold text-white/70 uppercase tracking-[0.2em]">
      Total {term} Boarding Fees
    </span>
    
    <div className="flex items-baseline gap-1 sm:gap-2 ">
      <span className="text-lg sm:text-xl md:text-2xl font-light text-white/60">KSh</span>
      <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
        {total?.toLocaleString() || '0'}
      </span>
    </div>
    
    {/* Subtle indicator for Boarding Only status */}
    <div className="mt-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-[9px] sm:text-[10px] text-orange-200 font-medium tracking-wide">
      FULL BOARDING INCLUSIVE
    </div>
  </div>
</div>
      </div>
      
      {/* Content Section - Responsive Spacing */}
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
{/* Features List - Modernized for Boarding School */}
{features.length > 0 && (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 animate-pulse"></div>
      <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 uppercase tracking-widest">
        Boarding Highlights
      </h4>
    </div>

    {/* Responsive Grid: 1 column mobile, 2 columns tablet, 3 columns desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {features.slice(0, 6).map((feature, idx) => (
        <div 
          key={idx} 
          className="group flex items-center gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 
                     shadow-sm hover:shadow-md hover:border-orange-200  
                     transition-all duration-300 ease-out cursor-default"
        >
          {/* Icon with Zoom Effect */}
          <div className="transform  transition-transform duration-300">
            <IoCheckmarkCircleOutline className="text-orange-500 text-lg sm:text-xl -0" />
          </div>

          <span className="font-semibold text-gray-700 text-sm sm:text-base group-hover:text-orange-600 transition-colors">
            {feature}
          </span>
        </div>
      ))}
    </div>
  </div>
)}
        
{/* Fee Breakdown - Modern Floating Cards */}
{distribution && (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex items-center justify-between px-2 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-orange-500 to-amber-500"></div>
        <h4 className="text-xs sm:text-sm font-black text-gray-500 uppercase tracking-[0.2em]">
          Boarding Fee Breakdown
        </h4>
      </div>
      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
        PER TERM
      </span>
    </div>
    
    <div className="grid grid-cols-1 gap-3 sm:gap-4">
      {Object.entries(distribution).slice(0, 6).map(([category, amount], idx) => (
        <div 
          key={idx}
          className="group relative flex items-center justify-between 
                     px-6 sm:px-8 py-4 
                     bg-white border border-gray-100 rounded-2xl
                     transition-all duration-300 ease-out
                     hover:shadow-xl hover:shadow-gray-200/50
                     hover:border-orange-200 hover:z-10 cursor-default"
        >
          {/* Decorative hover background */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>

          {/* Left section */}
          <div className="relative flex items-center gap-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-orange-100 group-hover:rotate-6 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-md font-bold text-slate-600 uppercase tracking-wider mb-0.5">
                Category
              </span>
              <span className="font-bold text-gray-800 text-md sm:text-md capitalize group-hover:text-orange-700 transition-colors">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          </div>

          {/* Right section */}
          <div className="relative text-right pr-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Amount
            </div>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-md font-medium text-slate-400">KSh</span>
              <span className="font-black text-gray-900 text-md sm:text-xl group-hover:text-orange-600 transition-colors">
                {parseInt(amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {Object.keys(distribution).length > 6 && (
      <div className="relative flex justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <button className="relative px-4 bg-white text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors">
          +{Object.keys(distribution).length - 6} more details in PDF
        </button>
      </div>
    )}
  </div>
)}

        

{/* Action Section - Compact & Modern */}
<div className="flex flex-col md:flex-row items-end justify-between gap-6 pt-4 border-t border-gray-100">
  
  {/* Download Section */}
  <div className="w-full md:w-auto space-y-2">
    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
      Resources
    </h5>

    {pdfPath && (
      <a 
        href={pdfPath} 
        download={pdfName}
        className="group w-1/2 md:w-auto max-w-[220px]
                   flex items-center justify-between gap-3
                   px-4 py-2
                   bg-gray-900/90 hover:bg-gray-900
                   text-white rounded-xl
                   transition-all duration-300
                   shadow-sm hover:shadow-lg"
      >
        <div className="flex items-center gap-2">
          <IoCloudDownloadOutline className="text-orange-400 text-sm transition-transform group-hover:-translate-y-0.5" />
          <span className="text-md font-semibold whitespace-nowrap">
            Download PDF
          </span>
        </div>

        <span className="text-[10px] text-gray-400 font-mono hidden sm:block">
          FILE
        </span>
      </a>
    )}
  </div>

  {/* Help Section */}
  <div className="w-full md:w-auto space-y-2">
    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
      Support
    </h5>

    <button 
      onClick={() => router.push('/pages/contact')}
      className="group w-1/2 md:w-auto max-w-[220px]
                 flex items-center justify-center gap-2
                 px-4 py-2
                 bg-white/80 backdrop-blur
                 border border-gray-200
                 text-gray-700 rounded-xl
                 text-md font-bold
                 transition-all duration-300
                 hover:border-orange-400
                 hover:text-orange-600
                 hover:bg-orange-50/40"
    >
      <span>Contact Bursar</span>
      <span className="text-orange-500 transition-transform group-hover:translate-x-1">
        →
      </span>
    </button>
  </div>
</div>


      </div>
    </div>
  );
};

// Video Tour Component
const VideoTourSection = ({ videoTour, videoType, videoThumbnail }) => {
  if (!videoTour) return null;

  // Function to extract YouTube video ID
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = videoType === 'youtube' ? getYouTubeId(videoTour) : null;

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-100/80 shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="relative p-4 md:p-8 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[60px] rounded-full -mr-24 -mt-24"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/30">
              <IoVideocamOutline className="text-white text-xl md:text-2xl" />
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-bold">Virtual Campus Tour</h3>
              <p className="text-blue-100 text-sm mt-1">Experience our campus from anywhere</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
            <span className="text-xs font-bold uppercase tracking-wider">HD Tour</span>
          </div>
        </div>
      </div>

      {/* Video Container - Reduced size on larger screens */}
      <div className="p-4 md:p-6">
        <div className="relative mx-auto" style={{ maxWidth: '800px' }}>
          {/* Video Player */}
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 bg-black">
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                <FiPlay className="text-white text-xl md:text-3xl ml-1" />
              </div>
            </div>
            
            {/* Video Thumbnail Background */}
            {videoThumbnail && (
              <div className="absolute inset-0 bg-cover bg-center opacity-30" 
                   style={{ backgroundImage: `url(${videoThumbnail})` }} />
            )}
            
            {/* Video Player */}
            <div className="relative aspect-video w-full">
              {videoType === 'youtube' && videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full"
                  title="Virtual Campus Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              ) : videoType === 'file' && videoTour ? (
                <video
                  controls
                  className="absolute inset-0 w-full h-full"
                  poster={videoThumbnail || ''}
                  preload="metadata"
                >
                  <source src={videoTour} type="video/mp4" />
                  <source src={videoTour} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </div>
          </div>

          {/* Video Info Footer */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiClock className="text-blue-500" />
                <span>3:45 min</span>
              </div>
              <div className="flex items-center gap-2">
                <FiEye className="text-cyan-500" />
                <span>HD Quality</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-300"></div>
                ))}
              </div>
              <span className="text-xs font-medium text-slate-500">500+ watched</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            <span className="font-bold text-slate-800">Take the full tour</span> with our interactive campus map
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-medium">
            <FiMapPin className="text-blue-500" />
            <span>Explore school  Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Vision & Mission Section
const VisionMissionSection = ({ vision, mission, motto }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Vision Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm border border-blue-200/60 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-500 rounded-xl shadow-sm">
            <IoEyeOutline className="text-white text-xl" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Our Vision</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {vision || "To be a leading center of academic excellence and character development, nurturing future leaders who demonstrate high academic achievement, strong ethical values, and leadership skills."}
        </p>
      </div>

      {/* Mission Card */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl shadow-sm border border-purple-200/60 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-purple-500 rounded-xl shadow-sm">
            <FiTarget className="text-white text-xl" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Our Mission</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {mission || "To provide quality and relevant education through effective teaching, continuous assessment, and strong mentorship. We foster discipline, teamwork, innovation, and self-reliance while promoting integrity and respect for others."}
        </p>
      </div>

      {/* Motto Card */}
      {motto && (
        <div className="md:col-span-2 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl shadow-sm border border-emerald-200/60 p-4 md:p-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-500 rounded-xl mb-4 shadow-sm">
              <FiAward className="text-white text-2xl" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">School Motto</h3>
            <p className="text-gray-700 text-xl font-semibold italic">"{motto}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Modernized Uniform Requirements Component
const ModernUniformRequirementsSection = ({ admissionFeeDistribution, admissionFeePdf, admissionFeePdfName }) => {
  const uniformItems = admissionFeeDistribution || {};

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-100/80 shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className={`relative p-4 md:p-8 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/30">
              <IoShirtOutline className="text-white text-xl md:text-2xl" />
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-bold">Admission Uniform Requirements</h3>
              <p className="text-blue-100 mt-1">Complete kit for academic excellence</p>
            </div>
          </div>
          
          {admissionFeePdf && (
            <a 
              href={admissionFeePdf}
              download={admissionFeePdfName}
              className="group inline-flex items-center gap-3 px-4 py-3 md:px-6 md:py-3 bg-white text-blue-600 rounded-xl font-bold transition-all duration-200 shadow-lg"
            >
              <div className="p-2 bg-blue-50 rounded-lg transition-transform">
                <IoCloudDownloadOutline className="text-blue-600" />
              </div>
              <span>Download Uniform List</span>
            </a>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-8">
        {Object.keys(uniformItems).length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(uniformItems).map(([item, cost], index) => (
              <div 
                key={index}
                className="group bg-white border border-slate-200/60 rounded-xl md:rounded-2xl p-4 md:p-5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                      <IoCheckmarkCircleOutline className="text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight capitalize">
                        {item.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">KSh {parseInt(cost).toLocaleString()}</div>
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center justify-center">
              <FiAlertTriangle className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />
            </div>
            <h4 className="text-lg md:text-xl font-bold text-slate-700 mb-2">Uniform Requirements</h4>
            <p className="text-slate-500 max-w-md mx-auto">
              Complete uniform specifications will be provided upon admission confirmation
            </p>
          </div>
        )}

        {/* Total Cost Summary */}
        {Object.keys(uniformItems).length > 0 && (
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 rounded-lg">
                  <FiDollarSign className="text-white text-xl" />
                </div>
          <div>
  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
    Total Uniform Cost Estimate
  </h4>

  <p className="text-xs text-slate-500 mb-1">
    This is an approximate cost covering both boys’ and girls’ uniforms.
  </p>

  <p className="text-xs text-slate-500 mb-3">
    Actual expenses may be lower depending on whether the student is a boy or a girl.
  </p>

  <div className="text-xl md:text-3xl font-bold text-slate-900">
    KSh{" "}
    {Object.values(uniformItems)
      .reduce((sum, cost) => sum + parseInt(cost), 0)
      .toLocaleString()}
  </div>
</div>

              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span>All items mandatory</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                  <span>One-time purchase</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// FAQ Item Component
const ModernFAQItem = ({ faq, index, openFaq, setOpenFaq }) => {
  const isOpen = openFaq === index;
  
  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/80 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpenFaq(isOpen ? null : index)}
        className="w-full px-4 md:px-6 py-4 md:py-5 text-left flex items-center justify-between active:bg-slate-50/50"
      >
        <div className="flex items-start gap-3 md:gap-4 flex-1">
          <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center justify-center mt-0.5">
            <span className="text-blue-600 font-bold text-xs md:text-sm">{index + 1}</span>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-slate-900 text-sm md:text-lg leading-tight pr-4 md:pr-8">
              {faq.question}
            </h3>
          </div>
        </div>
        <FiChevronDown 
          className={`text-blue-500 transition-transform duration-300 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2">
          <div className="pl-10 md:pl-12">
            <div className="h-px w-full bg-gradient-to-r from-blue-100 to-cyan-100 mb-4"></div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-lg">
              {faq.answer}
            </p>
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

  // Fetch school data from API
  useEffect(() => {
    const fetchSchoolData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/school');
        const data = await response.json();
        if (data.success) {
          setSchoolData(data.school);
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        toast.error('Failed to load school information');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
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

const admissionPaths = [
  {
    title: 'Form 1 Boarding Entry',
    icon: FiBookOpen,
    description: 'Join our Form 1 residential boarding program with comprehensive academic curriculum, full boarding facilities, and extracurricular activities',
    features: ['Full Boarding', 'Academic Excellence', 'Residential Life', 'Extracurricular Activities', 'Talent Development'],
    deadline: schoolData?.admissionCloseDate ? new Date(schoolData.admissionCloseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'May 30, 2024',
    color: 'from-blue-500 to-cyan-500',
    type: 'grade7'
  },
  {
    title: 'Transfer to Boarding',
    icon: FiArrowRight,
    description: 'Seamless transfer to our residential boarding program with credit recognition, boarding placement, and orientation support',
    features: ['Credit Transfer', 'Boarding Placement', 'Records Review', 'Residential Orientation', 'Support Integration'],
    deadline: 'Rolling Admission',
    color: 'from-purple-500 to-pink-500',
    type: 'transfer'
  }
];

const innovativeFeatures = [
  {
    icon: IoRocketOutline,
    title: 'Academic Excellence',
    description: 'Comprehensive residential curriculum with focus on core subjects and practical skills development',
    features: ['Quality Teaching', 'Boarding Study Support', 'Exam Preparation', 'Academic Mentoring'],
    badge: 'Advanced',
    color: 'from-blue-500 to-cyan-500',
    stats: { students: '500+', success: '95%' }
  },
  {
    icon: IoAccessibilityOutline,
    title: 'Holistic Development',
    description: 'Focus on academic, social, emotional, and physical growth through residential programs',
    features: ['Residential Life', 'Clubs & Societies', 'Leadership Training', 'Character Building'],
    badge: 'Comprehensive',
    color: 'from-purple-500 to-pink-500',
    stats: { students: '100%', success: '98%' }
  },
  {
    icon: IoBuildOutline,
    title: 'Residential Facilities',
    description: 'Safe, supportive boarding environment with 24/7 supervision and community living',
    features: ['Secure Campus', '24/7 Supervision', 'Health Services', 'Community Activities'],
    badge: 'Residential',
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
      answer: 'Admission requires completion of primary education, KCPE results, birth certificate, and medical records. Transfer students need additional documents including previous school reports and transfer letter.'
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
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          
          {/* Left Section: Branding & Title */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white shadow-sm">
                <IoSchoolOutline size={18} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Academic Enrollment 2026
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Admissions Portal
              </h1>
              <div className="flex items-center gap-2 text-slate-500 font-medium italic">
                <span className="w-4 h-[1px] bg-slate-300 inline-block"></span>
                <p className="text-sm md:text-base">
                  {schoolData?.name || 'Katwanyaa High School'} — Shape Your Future
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Action Bento Box */}
          <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[24px] self-start lg:self-center shadow-sm">
            
            <button
              onClick={refreshData}
              disabled={loading}
              className={`flex items-center justify-center gap-3 h-12 px-4 md:px-5 rounded-2xl border transition-all shadow-sm
                ${loading 
                  ? 'bg-slate-50 border-slate-200 cursor-not-allowed' 
                  : 'bg-white border-slate-200 active:bg-slate-100 active:scale-95'
                }`}
            >
              {loading ? (
                <>
                  {/* Material UI Circular Progress */}
                  <CircularProgress 
                    size={18} 
                    thickness={6} 
                    sx={{ color: '#0f172a' }} // Slate-900
                  />
                  {/* Loading Text */}
                  <span className="text-xs font-black text-slate-900">
                    Refreshing...
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs font-black text-slate-500">
                    Refresh
                  </span>
                </>
              )}
            </button>

            {/* Primary Apply CTA */}
            <button
              onClick={() => router.push('/pages/apply-for-admissions')}
              className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wide shadow-xl active:scale-95 transition-all"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center">
                <FiPlus size={14} />
              </div>
              <span>Apply Online</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {dynamicStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Admission Dates Banner - Prominently Displayed */}
        {schoolData && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  <IoCalendarOutline className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl">Admission Period Now Open</h3>
                  <p className="text-blue-100 opacity-90 text-sm">
                    Secure your place for the upcoming academic year
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-blue-100">Application Opens</p>
                  <p className="font-bold text-lg">{formatDate(schoolData.admissionOpenDate)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-blue-100">Application Closes</p>
                  <p className="font-bold text-lg">{formatDate(schoolData.admissionCloseDate)}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/pages/apply-for-admissions')}
                className="px-4 py-3 md:px-6 md:py-3 bg-white text-blue-600 rounded-lg font-bold transition-all duration-200 shadow-md"
              >
                Apply Now
              </button>
            </div>
          </div>
        )}

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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 md:space-y-24">
              
              {/* 1. Hero / Introduction Section */}
              <div className="relative pt-6 pb-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Admissions Open {new Date().getFullYear()}</span>
                </div>
                <h2 className="
                  text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                  font-extrabold text-slate-900
                  mb-3 sm:mb-5
                  tracking-tight
                  leading-snug sm:leading-[1.2]
                  break-words
                  text-balance
                ">
                  Welcome to{" "}
                  <span className="
                    text-transparent bg-clip-text
                    bg-gradient-to-r from-blue-600 to-indigo-500
                    break-words
                  ">
                    {schoolData?.name || "Our School"}
                  </span>
                </h2>
                
                <p className="
                  text-slate-500
                  max-w-xl sm:max-w-2xl
                  mx-auto
                  text-sm sm:text-base md:text-lg
                  leading-relaxed sm:leading-loose
                  px-4
                  break-words
                ">
                  {schoolData?.description ||
                    "We are committed to nurturing well-rounded learners through quality education, strong values, and modern facilities that support academic excellence, creativity, and personal growth."}
                </p>
              </div>

              {/* 2. Interactive Vision/Mission Cards */}
              <div className="px-2 md:px-4">
                <VisionMissionSection 
                  vision={schoolData?.vision}
                  mission={schoolData?.mission}
                  motto={schoolData?.motto}
                />
              </div>

              {/* 3. Admission Paths - High Impact Layout */}
              <section className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 rounded-3xl md:rounded-[40px] md:mx-4">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-200/20 blur-3xl rounded-full" />
                
                <div className="relative z-10 max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
                    <div className="text-left">
                      <h3 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Your <span className="text-blue-600">Future</span> Starts Here
                      </h3>
                      <p className="text-slate-500 text-base md:text-lg max-w-xl">
                        Select the enrollment track that matches your goals. Our process is seamless and digital-first.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
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

              {/* 4. Video Tour - Immersive Experience */}
              {schoolData?.videoTour && (
                <div className="px-2 md:px-4 max-w-7xl mx-auto">
                  <div className="rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10">
                    <VideoTourSection 
                      videoTour={schoolData.videoTour}
                      videoType={schoolData.videoType}
                      videoThumbnail={schoolData.videoThumbnail}
                    />
                  </div>
                </div>
              )}

              <div className="py-8 md:py-12 px-4 md:px-6 max-w-6xl mx-auto">
                {/* Tight Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-slate-200/60">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-100/80 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-900 via-orange-900 to-red-900"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                        Our Advantages
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                      Why Choose <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Our School?</span>
                    </h2>
                  </div>
                  
                  <div className="sm:text-right">
                    <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-xs">
                      Where <span className="font-bold text-blue-600">excellence</span> meets <span className="font-bold text-cyan-600">innovation</span> in education
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <FiAward className="text-amber-500" />
                        <span className="font-medium">Proven Excellence</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <FiUsers className="text-blue-500" />
                        <span className="font-medium">Personalized</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reduced row height from 280px to 200px */}
                <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[180px] md:auto-rows-[200px] gap-3">
                  
                  {/* 1. Academic Excellence - Compact */}
                  <div className="md:col-span-7 group relative overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-slate-200 p-4 md:p-6 transition-all">
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <IoBulbOutline size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">Academic Excellence</h4>
                        <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                          Ivy-league ready curriculum designed for top-tier academic performance.
                        </p>
                      </div>
                    </div>
                    <FiArrowUpRight className="absolute top-4 md:top-6 right-4 md:right-6 text-slate-300" />
                  </div>

                  {/* 2. Expert Faculty - High Contrast Compact */}
                  <div className="md:col-span-5 relative overflow-hidden rounded-2xl md:rounded-3xl bg-slate-900 p-4 md:p-6 text-white transition-all">
                    <div className="absolute -top-4 -right-4 text-white/5">
                      <FiUsers size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center mb-4">
                        <FiUsers size={20} className="text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-1 leading-tight">Expert Faculty</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Mentors committed to personalized student growth.
                      </p>
                    </div>
                  </div>

                  {/* 3. Digital-First Campus - Slim Banner */}
                  <div className="md:col-span-12 relative overflow-hidden rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-200 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                      <FiCpu size={20} />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 mb-0.5">Digital-First Campus</h4>
                      <p className="text-slate-500 text-xs leading-snug max-w-xl">
                        Immersive learning spaces with high-speed fiber and smart lab integration.
                      </p>
                    </div>

                    {/* Social Proof - Smaller Icons */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-slate-50 bg-slate-200" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        +500 Students
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academics' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12 md:space-y-20">
              
              {/* Section 1: Hero Header */}
              <div className="relative group">
                {/* Background Glow */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl opacity-0 transition-opacity duration-700" />
                
                <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-slate-100 pb-8 md:pb-12">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-full mb-6">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Academic Excellence</span>
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                      Academic <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Programs</span>
                    </h2>
                    <p className="text-slate-500 text-base md:text-xl font-medium leading-relaxed">
                     Mary Immaculate Girlsoffers a future-ready curriculum designed to cultivate critical thinking, 
                      innovation, and global leadership.
                    </p>
                  </div>

                  {schoolData?.curriculumPDF && (
                    <a 
                      href={schoolData.curriculumPDF}
                      className="group/btn relative inline-flex items-center gap-4 px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white rounded-2xl overflow-hidden transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 transition-opacity duration-300" />
                      <FiDownload className="relative z-10 text-xl" />
                      <span className="relative z-10 font-bold tracking-tight">Download Curriculum</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Section 2: Education Systems - Bento Layout */}
              <section>
                <div className="flex flex-col mb-8 md:mb-12">
                  <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Paths to Success</h3>
                  <h4 className="text-2xl md:text-3xl font-bold text-slate-900">Education Systems</h4>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
                  {educationSystems.map((system, index) => (
                    <ModernEducationSystemCard key={index} {...system} />
                  ))}
                </div>
              </section>

              {/* Section 3: Subject Tiles - Visual Grid */}
              <section className="relative overflow-hidden bg-slate-50 rounded-2xl md:rounded-[3rem] p-6 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Subjects Offered</h3>
                    <p className="text-slate-500 font-medium">Core and elective disciplines for holistic mastery.</p>
                  </div>
                  <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-sm font-bold text-slate-700">
                    {schoolData?.subjects?.length || 0} Specialties
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {schoolData?.subjects?.map((subject, index) => {
                    const SubjectIcon = getSubjectIcon(subject);
                    return (
                      <div 
                        key={index}
                        className="group bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 transition-all duration-300"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 mb-4 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center">
                          <SubjectIcon className="text-blue-600 text-xl" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm tracking-tight leading-tight">{subject}</h4>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 4: Departments - Minimalist Cards */}
              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 md:mb-8 text-center">Departmental Faculties</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {schoolData?.departments?.map((department, index) => {
                    const DepartmentIcon = getDepartmentIcon(department);
                    return (
                      <div key={index} className="group relative p-6 md:p-8 bg-white rounded-xl md:rounded-[2rem] border border-slate-100">
                        <div className="mb-4 md:mb-6 inline-block p-3 md:p-4 bg-purple-50 rounded-xl md:rounded-2xl">
                          <DepartmentIcon className="text-purple-600 text-2xl" />
                        </div>
                        <h4 className="font-black text-slate-900 text-lg md:text-xl mb-4 leading-tight">{department}</h4>
                        <div className="w-8 h-1 bg-slate-100" />
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 5: Stats & Calendar - Dark Banner */}
              {schoolData?.openDate && (
                <div className="relative overflow-hidden bg-slate-900 rounded-2xl md:rounded-[3rem] p-8 md:p-16">
                  {/* Abstract Background Shapes */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full -mr-48 -mt-48" />
                  
                  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12">
                    <div className="text-center lg:text-left">
                      <h3 className="text-white text-2xl md:text-4xl font-black tracking-tight mb-4">Academic Calendar</h3>
                      <p className="text-slate-400 text-base md:text-lg">Mark your journey. Stay ahead of the curve.</p>
                    </div>

                    <div className="flex gap-4 md:gap-8">
                      <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-xl md:rounded-[2rem] border border-white/10 text-center min-w-[140px] md:min-w-[160px]">
                        <div className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-3">Year Opens</div>
                        <div className="text-white text-xl md:text-2xl font-bold">{formatDate(schoolData.openDate)}</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-xl md:rounded-[2rem] border border-white/10 text-center min-w-[140px] md:min-w-[160px]">
                        <div className="text-rose-400 font-black text-[10px] uppercase tracking-widest mb-3">Year Closes</div>
                        <div className="text-white text-xl md:text-2xl font-bold">{formatDate(schoolData.closeDate)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Career Paths Tab - Modern */}
          {activeTab === 'career-paths' && (
            <div className="space-y-12 md:space-y-16">
              {/* Hero Section */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Career Readiness</span>
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                  Future <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Pathways</span>
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  Strategic academic planning for diverse career trajectories. Our curriculum integrates industry-relevant skills with traditional excellence.
                </p>
              </div>

              {/* Career Guidance Banner - Modern */}
              <div className="relative overflow-hidden bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[80px] rounded-full -mr-48 -mt-48" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                        <FiTarget className="text-blue-300 text-lg md:text-xl" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold">Professional Development Program</h3>
                    </div>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                      Personalized career mapping, university placement strategy, and industry immersion experiences. 
                      We bridge academic learning with professional reality.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="px-6 py-3 md:px-8 md:py-4 bg-white text-slate-900 rounded-xl md:rounded-2xl font-bold tracking-tight flex items-center gap-3">
                      <span>Schedule Consultation</span>
                      <FiArrowRight className="transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Career Departments - Modern Grid */}
              <div>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 border-b border-slate-100 pb-4 md:pb-6">
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold text-slate-900">Academic Tracks</h3>
                    <p className="text-slate-500 mt-2">Structured pathways aligned with industry demands</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-sm text-slate-400 font-medium">
                      {careerDepartments.length} Specialized Domains
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {careerDepartments.map((dept, index) => (
                    <ModernCareerDepartmentCard key={index} {...dept} />
                  ))}
                </div>
              </div>

              {/* University Pathways - Modern */}
              <div className="bg-slate-50 rounded-xl md:rounded-[2.5rem] p-6 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">University Access</h3>
                    <p className="text-slate-500">Global and local higher education partnerships</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white rounded-full border border-slate-200">
                      <FiGlobe className="text-blue-500" />
                      <span className="text-sm font-medium text-slate-700">Global Network</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  {/* Local Universities */}
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center">
                        <IoSchoolOutline className="text-blue-600 text-lg md:text-xl" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">National Institutions</h4>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                      {[
                        { name: 'University of Nairobi', rank: '#1 National' },
                        { name: 'Kenyatta University', rank: 'Top 5 Nationally' },
                        { name: 'Moi University', rank: 'Research Intensive' },
                        { name: 'Technical University of Kenya', rank: 'STEM Focus' }
                      ].map((uni, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 md:py-3 border-b border-slate-100 last:border-0">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-slate-800 text-sm md:text-base">{uni.name}</span>
                          </div>
                          <span className="text-xs md:text-sm text-slate-500 font-medium">{uni.rank}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* International Opportunities */}
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-lg md:rounded-xl flex items-center justify-center">
                        <FiGlobe className="text-green-600 text-lg md:text-xl" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">Global Partnerships</h4>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                      {[
                        { program: 'Scholarship Programs', countries: 'USA, UK, Canada' },
                        { program: 'Student Exchange', partners: '20+ Countries' },
                        { program: 'Dual Degrees', status: 'Available' },
                        { program: 'Online Degrees', platforms: 'Coursera, edX' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 md:py-3 border-b border-slate-100 last:border-0">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-slate-800 text-sm md:text-base">{item.program}</span>
                          </div>
                          <span className="text-xs md:text-sm text-slate-500 font-medium">{item.countries || item.partners || item.status || item.platforms}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modernized Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-12">
              
              {/* Hero Header */}
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Admission Checklist</span>
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                  Application <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Requirements</span>
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                  Everything you need to prepare for a successful application journey.
                </p>
              </div>

              {/* Uniform Requirements - Modern Card */}
              <ModernUniformRequirementsSection 
                admissionFeeDistribution={schoolData?.admissionFeeDistribution}
                admissionFeePdf={schoolData?.admissionFeePdf}
                admissionFeePdfName={schoolData?.admissionFeePdfName}
              />

              {/* Required Documents - Modern Grid */}
              <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-100/80 shadow-lg p-4 md:p-8">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <div className="p-2 md:p-2.5 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 rounded-xl shadow-sm">
                        <IoDocumentTextOutline className="text-white text-lg md:text-xl" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900">Required Documents</h3>
                    </div>
                    <p className="text-slate-500">Essential paperwork for admission processing</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
                    <IoCheckmarkCircleOutline className="text-blue-500" />
                    <span>Complete Set</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schoolData?.admissionDocumentsRequired?.map((doc, index) => (
                    <div 
                      key={index}
                      className="group bg-white border border-slate-200/60 rounded-xl md:rounded-2xl p-4 md:p-5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center">
                              <IoDocumentTextOutline className="text-white text-xs md:text-sm" />
                            </div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight">{doc}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                              Required
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transfer Process - Modern Timeline */}
              <div className="bg-slate-900 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <div className="p-2 md:p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <FiArrowRight className="text-white text-lg md:text-xl" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold">Transfer Student Process</h3>
                    </div>
                    <p className="text-slate-300">Seamless transition with 4-step verification</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                    <FiClock className="text-yellow-400" />
                    <span className="text-sm font-medium">2-3 Weeks Total</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {transferProcess.map((step, index) => (
                    <div 
                      key={index}
                      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-300"
                    >
                      {/* Step Number */}
                      <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg">
                        {step.step}
                      </div>
                      
                      {/* Step Content */}
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-start justify-between">
                          <h4 className="text-base md:text-lg font-bold leading-tight">{step.title}</h4>
                          <div className="flex items-center gap-1 text-yellow-300 text-xs font-bold">
                            <FiClock className="text-sm" />
                            {step.duration}
                          </div>
                        </div>
                        
                        <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
                        
                        {/* Requirements List */}
                        <div className="space-y-2 pt-3 md:pt-4 border-t border-white/10">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Requirements</span>
                          <ul className="space-y-2">
                            {step.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Connector Line for Desktop */}
                      {index < transferProcess.length - 1 && (
                        <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-0.5 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 transform translate-x-full -translate-y-1/2">
                          <div className="absolute -right-2 top-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 transform -translate-y-1/2 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Process Completion Indicator */}
                <div className="mt-8 md:mt-10 p-4 md:p-6 bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 md:p-2.5 bg-green-500/20 rounded-xl">
                        <IoCheckmarkCircleOutline className="text-green-400 text-lg md:text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Ready to Transfer?</h4>
                        <p className="text-slate-300 text-sm">Complete all 4 steps for admission approval</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push('/pages/apply-for-admissions')}
                      className="px-4 py-3 md:px-6 md:py-3 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white rounded-xl font-bold transition-all duration-200 shadow-lg"
                    >
                      Start Transfer Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modernized Fee Structure Tab */}
          {activeTab === 'fees' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-12">
              
              {/* Hero Header */}
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Financial Transparency</span>
                </div>
<h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
  Boarding <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Fee Structure</span>
</h2>
<p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
  Comprehensive boarding fee breakdown with transparent payment plans designed for residential education.
</p>
              </div>

              {/* Fee Comparison Cards - Modern Grid */}
              <div>
                <ModernFeeCard
                  feeType="Boarding School"
                  total={schoolData?.feesBoarding || 58700}
                  distribution={schoolData?.feesBoardingDistribution}
                  pdfPath={schoolData?.feesBoardingDistributionPdf}
                  pdfName={schoolData?.feesBoardingPdfName}
                  icon={IoBookOutline}
                  gradient="from-blue-500 to-cyan-500"
                  term="Annual"
                  badge="Full Immersion"
features={[
  '24/7 Supervision',
  'Full Accommodation',
  'All Meals Included',
  'Structured Study Support',
  'Guidance and Counselling Services',
  'Health & Wellness Support',
  'Co-curricular & Talent Development',
  'Spiritual & Moral Development',
  'Safe & Secure Boarding Environment',
  'Mentorship & Life Skills Training'
]}
                />
  
              </div>

              {/* Admission Fee - Premium Banner */}
              {schoolData?.admissionFee && (
                <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 blur-[60px] rounded-full -ml-24 -mb-24"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/30">
                          <IoReceiptOutline className="text-white text-xl md:text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold">All Uniform fees requirements</h3>
                          <p className="text-amber-100">Secure your place with this initial investment</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-amber-100 mb-1">One-Time Payment</div>
                        <div className="text-3xl md:text-5xl font-black">KSh {schoolData.admissionFee.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 md:pt-6 border-t border-white/20">
                      <div className="text-amber-100 text-sm">
                        Includes registration, processing, and administrative setup
                      </div>
                      
                      {schoolData.admissionFeePdf && (
                        <a 
                          href={schoolData.admissionFeePdf}
                          download={schoolData.admissionFeePdfName}
                          className="group inline-flex items-center gap-3 px-4 py-3 md:px-6 md:py-3 bg-white text-amber-600 rounded-xl font-bold transition-all duration-200 shadow-lg"
                        >
                          <div className="p-2 bg-amber-50 rounded-lg transition-transform">
                            <IoCloudDownloadOutline className="text-amber-600" />
                          </div>
                          <span>Uniform Details</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
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

              {/* Contact Support - Responsive Layout */}
              <div className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-100/80 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 md:gap-4 mb-4">
                      <div className="p-2 md:p-3 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 rounded-xl md:rounded-2xl">
                        <FiMessageCircle className="text-white text-lg md:text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-2xl font-bold text-slate-900">Still have questions?</h3>
                        <p className="text-slate-500 mt-1">Our admissions team is ready to assist you.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span>Available Mon-Fri, 8AM-5PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        <span>Response within 24 hours</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Stacked on mobile */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href={`tel:${schoolData?.admissionContactPhone || '+254793472960'}`}
                      className="flex items-center justify-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-sm"
                    >
                      <div className="p-1 md:p-1.5 bg-white/20 rounded-lg">
                        <FiPhone className="text-white text-base" />
                      </div>
                      <span>Call Admissions</span>
                    </a>
                    
                    <button 
                      onClick={() => router.push('/pages/apply-for-admissions')}
                      className="flex items-center justify-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-3.5 border border-slate-300 text-slate-700 rounded-xl font-bold text-sm"
                    >
                      <div className="p-1 md:p-1.5 bg-slate-100 rounded-lg">
                        <FiEdit3 className="text-slate-600 text-base" />
                      </div>
                      <span>Apply Online</span>
                    </button>
                  </div>
                </div>
                
                {/* Additional Contact Info */}
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-blue-100/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-3 p-3 bg-white border border-slate-200/60 rounded-xl">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FiClock className="text-blue-500 text-lg" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Office Hours</p>
                        <p className="text-sm font-medium text-slate-800">Mon-Fri: 8AM - 5PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 p-3 bg-white border border-slate-200/60 rounded-xl">
                      <div className="p-2 bg-cyan-50 rounded-lg">
                        <FiMail className="text-cyan-500 text-lg" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email Response</p>
                        <p className="text-sm font-medium text-slate-800">Within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 p-3 bg-white border border-slate-200/60 rounded-xl">
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <FiCheckCircle className="text-emerald-500 text-lg" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Support Type</p>
                        <p className="text-sm font-medium text-slate-800">Phone & In-Person</p>
                      </div>
                    </div>
                  </div>
                </div>
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
            <h2 className="text-xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight text-balance">
              Ready to Begin Your <span className="text-blue-400">Academic Journey This year</span>
            </h2>
            
            {/* Description: Scaled down to base size for better reading density */}
            <p className="text-slate-400 mb-6 md:mb-8 text-sm md:text-base leading-relaxed max-w-lg mx-auto text-balance">
              Join a community dedicated to nurturing future leaders through personalized attention and holistic development.
            </p>

          {/* Action Buttons – always flex row, no wrap */}
<div className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 w-full overflow-x-auto">
  
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