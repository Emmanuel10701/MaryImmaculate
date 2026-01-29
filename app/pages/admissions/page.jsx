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
    <div className="group relative bg-slate-50 rounded-[2.5rem] p-2 transition-all duration-500 hover:shadow-2xl">
      {/* Outer Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[2.5rem]`} />
      
      <div className="relative bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Top Header - High Contrast Bento Style */}
        <div className={`relative h-40 p-8 md:p-10 bg-gradient-to-br ${color} overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/20 blur-[90px] rounded-full -mr-36 -mt-36 animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 blur-[50px] rounded-full" />
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              {system.name}
            </h3>
            <p className="text-white/90 text-[11px] font-black tracking-[0.3em] mt-3 uppercase opacity-80">
              {system.fullName}
            </p>
          </div>
        </div>

        {/* Floating Icon - More Visible Border */}
        <div className="relative px-8">
          <div className="absolute -top-10 md:-top-12 right-8 p-1 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100">
            <div className={`p-4 md:p-5 rounded-[1.2rem] bg-gradient-to-br ${color} text-white shadow-inner active:scale-95 transition-transform`}>
              <Icon className="text-3xl md:text-4xl" />
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-8 md:p-10 pt-12">
          <div className="relative mb-10">
            <span className="absolute -top-4 -left-2 text-6xl text-slate-100 font-black pointer-events-none">“</span>
            <p className="relative z-10 text-slate-500 leading-relaxed text-sm md:text-base font-bold italic">
              {description}
            </p>
          </div>

          {/* Educational Structure - High Visibility Bento */}
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 ml-1">Academic Path</h4>
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10">
            {structure.map((stage, idx) => (
              <div key={idx} className="relative overflow-hidden p-4 md:p-5 rounded-[1.5rem] bg-[#0F172A] border border-slate-800 transition-transform hover:-translate-y-1">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
                <div className="font-black text-white text-2xl md:text-3xl leading-none tabular-nums">
                  {stage.years}
                </div>
                <div className="text-[9px] text-blue-400 font-black uppercase tracking-widest mt-3 leading-tight">
                  {stage.name}
                </div>
              </div>
            ))}
          </div>

          {/* Features - Clean Minimalist Grid */}
          <div className="space-y-6 mb-10">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 ml-1">
               System Pillars
             </h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4 items-start group/feat">
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full bg-gradient-to-r ${color} mt-1.5 group-hover/feat:scale-125 transition-transform`} />
                    <div className="min-w-0">
                      <h5 className="font-black text-slate-900 text-[13px] uppercase tracking-tight leading-tight mb-1">
                        {feature.title}
                      </h5>
                      <p className="text-slate-400 text-[11px] font-bold leading-snug">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Advantages - Modern Pill Tags */}
          <div className="pt-8 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
              {advantages.map((advantage, idx) => (
                <span key={idx} className="px-4 py-2 bg-slate-100 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] hover:bg-slate-900 hover:text-white transition-colors cursor-default">
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
  feeType, 
  total, 
  distribution = [], 
  pdfPath, 
  pdfName, 
  description,
  year,
  term,
  icon: Icon, 
  variant = "dark", // 'dark' (slate) or 'light' (white)
  badge,
  features = []
}) => {
  const isDark = variant === "dark";

  return (
    <div className={`relative rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-2xl border ${
      isDark ? 'bg-[#0F172A] border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
    }`}>
      
      {/* Header Section */}
      <div className="p-8 md:p-10 border-b border-white/5">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border ${
              isDark ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
            }`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                {feeType}
              </h3>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Session {year || '2026'} • {term || 'Full Term'}
              </p>
            </div>
          </div>
          {badge && (
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
              isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-600 text-white'
            }`}>
              {badge}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
            Total Payable Amount
          </p>
          <div className={`text-4xl md:text-6xl font-black tracking-tighter tabular-nums ${isDark ? 'text-blue-400' : 'text-slate-900'}`}>
            KSh {total?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Breakdown Section - Mapped from API */}
      <div className="p-8 md:p-10">
        <div className="space-y-4">
          <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
            Detailed Breakdown
          </h4>
          <div className="grid gap-3">
            {distribution.map((item, idx) => (
              <div key={item.id || idx} className={`flex justify-between items-center py-3 border-b ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                <div className="flex flex-col">
                  <span className="font-black text-sm uppercase tracking-tight">{item.name}</span>
                  <span className={`text-[10px] font-bold ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{item.description}</span>
                </div>
                <span className="font-black text-base tabular-nums">KSh {item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features List */}
        {features.length > 0 && (
          <div className="mt-10">
            <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-4 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
              Included Amenities
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                  <span className="font-black text-[10px] uppercase tracking-wide opacity-80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Action */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <a 
            href={pdfPath} 
            target="_blank" 
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              isDark ? 'bg-white text-slate-900 hover:bg-blue-50' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <IoCloudDownloadOutline size={18} />
            Download PDF
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
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-600/90 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                  <FiPlay className="text-white text-2xl md:text-4xl ml-1.5" />
                </div>
                
                {/* Background Thumbnail */}
                {videoThumbnail && (
                  <div className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Bento Grid with reduced scaling */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* 1. Vision Card - Compact & Modern */}
        <div className="md:col-span-7 bg-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 mb-4">
              <IoEyeOutline className="text-blue-400 text-lg" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Vision</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight uppercase italic">
              The <span className="text-blue-500">Future</span> we build
            </h3>
            <p className="text-slate-400 text-sm md:text-base font-bold leading-snug max-w-lg">
              {vision || "To be a premier center of academic excellence in Machakos, nurturing globally competitive leaders through integrity."}
            </p>
          </div>
        </div>

        {/* 2. Mission Card - High Contrast */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-md flex flex-col justify-between min-h-[220px]">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 mb-4">
            <FiTarget className="text-blue-600 text-xl" />
          </div>
          
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Our Mission</h3>
            <p className="text-slate-600 text-xs md:text-sm font-bold leading-relaxed">
              {mission || "Providing quality education via modern infrastructure, fostering discipline, innovation, and self-reliance."}
            </p>
          </div>
        </div>

        {/* 3. Motto Banner - Slimmed Down */}
        <div className="md:col-span-12 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-lg">
          <FiZap className="absolute right-0 top-1/2 -translate-y-1/2 text-white/5 text-8xl -rotate-12 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 shrink-0">
                <FiAward className="text-white text-2xl" />
              </div>
              <div className="text-left">
                <span className="text-blue-200 text-[9px] font-black uppercase tracking-widest block">The Spirit of Katwanyaa</span>
                <h3 className="text-white text-lg font-black tracking-tighter uppercase">School Motto</h3>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-center">
                <p className="text-white text-xl md:text-2xl font-black italic tracking-tighter">
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



// Updated Modern Uniform Requirements Component
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
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden max-w-full">
      
      {/* Header Section: Now uses the high-end Slate-900 look */}
      <div className="relative p-6 md:p-10 bg-[#0F172A] text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
              <IoShirtOutline className="text-blue-400 text-2xl md:text-3xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-2xl font-black uppercase tracking-tighter">Admission Breakdown</h3>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">
                {admissionFeeYear || '2026'} • {admissionFeeTerm || 'Full Session'}
              </p>
              {admissionFeeDescription && (
                <p className="text-white/40 text-[10px] mt-1 italic font-bold truncate">{admissionFeeDescription}</p>
              )}
            </div>
          </div>
          
          {admissionFeePdf && (
            <a 
              href={admissionFeePdf}
              download={admissionFeePdfName}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40 shrink-0 active:scale-95"
            >
              <IoCloudDownloadOutline className="text-lg" />
              <span>Download PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Content Section: Individual Item Cards */}
      <div className="p-5 md:p-10 bg-slate-50/50">
        {uniformItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {uniformItems.map((item, index) => (
              <div 
                key={item.id || index}
                className="group bg-white border border-slate-200 rounded-2xl p-5 transition-all hover:shadow-xl hover:border-blue-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-wider mb-1 truncate">
                      {item.name}
                    </h4>
                    <p className="text-slate-400 text-[10px] font-bold leading-tight line-clamp-2">
                      {item.description || 'Standard requirement'}
                    </p>
                  </div>
                  <div className={`p-1.5 rounded-lg shrink-0 ${item.optional ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {item.optional ? <FiCheckCircle size={14} /> : <IoCheckmarkCircleOutline size={14} />}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</span>
                    <span className="text-lg font-black text-slate-900 tabular-nums">
                      KSh {parseInt(item.amount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {item.optional && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black uppercase">Optional</span>}
                    {item.boardingOnly && <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-black uppercase">Boarding</span>}
                  </div>
                </div>
                
                {/* Visual Progress Bar - Boldened */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${item.optional ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem]">
            <FiAlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-slate-900 font-black uppercase tracking-widest text-sm">No items found</h4>
            <p className="text-slate-400 text-xs font-bold mt-2">The admission list is being updated by the registrar.</p>
          </div>
        )}

        {/* Total Cost Summary Bento - Sticky-ready for Mobile */}
        {uniformItems.length > 0 && (
          <div className="mt-10 p-6 md:p-8 bg-slate-900 rounded-[2rem] text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                <FiDollarSign size={24} className="text-white" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">
                  Cumulative Total
                </h4>
                <div className="text-3xl md:text-5xl font-black tracking-tighter tabular-nums leading-none">
                  KSh {totalCost.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Mandatory</span>
                <span className="text-xl font-black text-white">{uniformItems.filter(i => !i.optional).length} Items</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Optional</span>
                <span className="text-xl font-black text-emerald-400">{uniformItems.filter(i => i.optional).length} Items</span>
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
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
      
      {/* Header Section - Dark Bento Style */}
      <div className="relative p-6 md:p-10 bg-[#0F172A] text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <IoStatsChartOutline className="text-blue-400 text-2xl md:text-3xl" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Academic Reports</h3>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">Official Performance Archives</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
            <FiAward className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Verified Data</span>
          </div>
        </div>
      </div>

      {/* Main Grid - Results Cards */}
      <div className="p-5 md:p-10 bg-slate-50/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {availableResults.map((result, index) => (
            <div 
              key={index}
              className="group bg-white border border-slate-200 rounded-[2rem] p-6 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl ${result.bg} ${result.accent}`}>
                  <result.icon size={24} />
                </div>
                <div className="text-right">
                  <span className="block text-lg font-black text-slate-900 leading-none">{result.year}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{result.term || 'Annual'}</span>
                </div>
              </div>
              
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-2 truncate">
                {result.name}
              </h4>
              
              {result.description && (
                <p className="text-slate-400 text-[10px] font-bold leading-relaxed mb-6 line-clamp-2 h-8">
                  {result.description}
                </p>
              )}
              
              <a 
                href={result.pdf}
                download={result.pdfName}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-blue-600 active:scale-95"
              >
                <IoCloudDownloadOutline size={16} />
                <span>Download Report</span>
              </a>
            </div>
          ))}
        </div>

        {/* Additional Documents - Horizontal Bento */}
        {documentData?.additionalDocuments && documentData.additionalDocuments.length > 0 && (
          <div className="mt-12 pt-10 border-t border-slate-200">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-2">
              School Resource Archive
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentData.additionalDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 group transition-all hover:border-blue-400">
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
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-90"
                  >
                    <FiDownload size={16} />
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
<header className="relative bg-[#0F172A] rounded-2xl md:rounded-[2rem] p-5 md:p-8 text-white overflow-hidden shadow-2xl border border-white/5 mb-8">
  {/* Subtle Mesh Accents - scaled down to prevent clutter */}
  <div className="absolute top-[-20%] right-[-10%] w-[250px] h-[250px] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
  
  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
    
    {/* Left: Branding & Title - Tighter Spacing */}
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,99,235,0.5)]" />
        <div className="flex flex-col">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 leading-none">
            {schoolData?.name || 'Katwanyaa High School'}
          </h2>
          <p className="text-[9px] font-bold text-white/40 tracking-[0.2em] uppercase mt-1">
            "Education is Light"
          </p>
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">
          Admissions <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-400">Portal</span>
        </h1>
        <span className="hidden sm:block text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/20 uppercase">
          {schoolData?.academicYear || '2026'} Session
        </span>
      </div>
    </div>

    {/* Right: Modern Compact Action Hub */}
    <div className="flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl self-start md:self-center">
      
      {/* Sync Button */}
<button
  onClick={refreshData}
  disabled={loading}
  title="Refresh latest information"
  className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl
             transition-all font-black text-[10px] uppercase tracking-widest
             bg-white/5 hover:bg-white/10 text-white/70
             active:scale-100 disabled:opacity-50"
>
  {loading ? (
    <>
      <CircularProgress size={14} thickness={6} sx={{ color: '#3b82f6' }} />
      Refreshing...
    </>
  ) : (
    <>
      <FiRefreshCw className="transition-transform duration-300 group-hover:rotate-180" />
      <span className="hidden sm:inline">Refresh Info</span>
    </>
  )}
</button>

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
        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-400/20' 
        : 'bg-gradient-to-r from-slate-800 to-slate-950 border-slate-700'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Status Section */}
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl backdrop-blur-md border shadow-inner ${
            isOpen ? 'bg-white/20 border-white/30' : 'bg-slate-800 border-slate-700'
          }`}>
            <IoCalendarOutline className={`w-7 h-7 ${isOpen ? 'text-white' : 'text-slate-500'}`} />
          </div>
          <div>
            <h3 className="font-black text-xl md:text-2xl text-white tracking-tighter uppercase">
              {isOpen ? 'Admissions Now Open' : 'Admissions Currently Closed'}
            </h3>
            <p className={`text-sm font-bold leading-tight ${isOpen ? 'text-emerald-100' : 'text-slate-400'}`}>
              {isOpen 
                ? 'Join Katwanyaa High School for the upcoming academic year.' 
                : 'The application window has officially ended for this period.'}
            </p>
          </div>
        </div>

        {/* Dynamic Date Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-10 px-6 py-4 bg-black/20 rounded-2xl border border-white/5">
          <div className="text-left md:text-center">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isOpen ? 'text-emerald-300' : 'text-slate-500'}`}>
              Applications are Opened
            </p>
            <p className="font-black text-lg text-white tabular-nums">
              {formatDate(schoolData.admissionOpenDate)}
            </p>
          </div>
          <div className="text-left md:text-center border-l border-white/10 pl-4 md:pl-0 md:border-l-0">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isOpen ? 'text-emerald-300' : 'text-slate-500'}`}>
              Final Deadline
            </p>
            <p className="font-black text-lg text-white tabular-nums">
              {formatDate(schoolData.admissionCloseDate)}
            </p>
          </div>
        </div>

        {/* Interactive Action Button */}
        <button
          disabled={!isOpen}
          onClick={() => router.push('/pages/apply-for-admissions')}
          className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] shadow-xl transition-all active:scale-95 ${
            isOpen 
              ? 'bg-white text-emerald-700 hover:shadow-emerald-500/20' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
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
                  text-2xl sm:text-3xl md:text-3xl lg:text-5xl
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

<div className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto bg-white">
  {/* Modernized Tight Header */}
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-8 border-b-2 border-slate-100">
    <div className="flex-1">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-md mb-4 border border-slate-200">
        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
          Institutional Profile
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
        Why <span className="text-blue-600">Katwanyaa High?</span>
      </h2>
    </div>
    
    <div className="sm:text-right">
      <p className="text-slate-600 text-sm md:text-base font-bold leading-tight max-w-xs">
        Building strong foundations in Machakos through discipline and academic rigor.
      </p>
      <div className="flex items-center sm:justify-end gap-3 mt-4">
        <div className="flex items-center gap-1 text-xs text-slate-500 font-black">
          <FiAward className="text-blue-600" />
          <span>KICD APPROVED</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        <div className="flex items-center gap-1 text-xs text-slate-500 font-black">
          <FiUsers className="text-blue-600" />
          <span>COMMUNITY DRIVEN</span>
        </div>
      </div>
    </div>
  </div>

  {/* Modern Bento Grid - No Hovers */}
  <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[180px] md:auto-rows-[200px] gap-4">
    
    {/* 1. Academic Performance - Real Information */}
    <div className="md:col-span-7 relative overflow-hidden rounded-3xl bg-slate-50 border-2 border-slate-200 p-6 md:p-8">
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200">
          <IoBulbOutline size={24} />
        </div>
        <div>
          <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Academic Achievement</h4>
          <p className="text-slate-600 text-sm font-bold leading-snug max-w-md">
            Consistently producing strong KCSE results with a specialized focus on STEM subjects and early career guidance.
          </p>
        </div>
      </div>
    </div>

    {/* 2. TSC Certified Faculty */}
    <div className="md:col-span-5 relative overflow-hidden rounded-3xl bg-slate-900 p-6 md:p-8 text-white">
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center">
          <FiUsers size={24} className="text-white" />
        </div>
        <div>
          <h4 className="text-xl font-black mb-2 uppercase tracking-tight text-blue-400">Expert Educators</h4>
          <p className="text-slate-300 text-sm font-bold leading-snug">
            Staffed by TSC-certified professionals dedicated to individualized student mentorship and CBC implementation.
          </p>
        </div>
      </div>
    </div>

    {/* 3. Facilities & Infrastructure */}
    <div className="md:col-span-12 relative overflow-hidden rounded-3xl bg-white border-2 border-slate-900 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
        <FiCpu size={32} />
      </div>

      <div className="flex-1 text-center md:text-left">
        <h4 className="text-xl font-black text-slate-900 mb-1 uppercase">Modern Learning Resources</h4>
        <p className="text-slate-600 text-sm md:text-base font-bold leading-relaxed max-w-2xl">
          Investment in functional science laboratories, computer literacy programs, and spacious classrooms to enhance the student experience.
        </p>
      </div>

      {/* Capacity Indicator */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 shrink-0">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300" />
          ))}
        </div>
        <span className="text-[11px] font-black text-slate-900 uppercase">
          10k+ Alumni
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
                      Katwanyaa High School offers a future-ready curriculum designed to cultivate critical thinking, 
                      innovation, and global leadership.
                    </p>
                  </div>

                  {documentData?.curriculumPDF && (
                    <a 
                      href={documentData.curriculumPDF}
                      download={documentData.curriculumPdfName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn relative inline-flex items-center gap-4 px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white rounded-2xl overflow-hidden transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 transition-opacity duration-300" />
                      <FiDownload className="relative z-10 text-xl" />
                      <div className="relative z-10">
                        <div className="font-bold text-sm tracking-tight">Download Curriculum</div>
                        {documentData.curriculumYear && (
                          <div className="text-xs opacity-80">
                            {documentData.curriculumYear} • {documentData.curriculumTerm || 'All Terms'}
                          </div>
                        )}
                      </div>
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
                      <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight mb-4">Academic Calendar</h3>
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

  {/* Important Notes - High Visibility Section */}
  <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden border border-white/5 shadow-2xl">
    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-amber-500 rounded-xl">
          <FiAlertTriangle className="text-slate-900 text-xl" />
        </div>
        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">
          Important Submission Notes
        </h4>
      </div>
      
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-5">
        {[
          "All documents must be original or certified copies",
          "Documents should be submitted in a clear plastic folder",
          "Incomplete applications will not be processed",
          "Submit copies along with originals for verification"
        ].map((note, i) => (
          <div key={i} className="flex items-start gap-4 group">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed group-hover:text-white transition-colors">
              {note}
            </p>
          </div>
        ))}
      </div>
    </div>
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
                      <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg">
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
                        <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transform translate-x-full -translate-y-1/2">
                          <div className="absolute -right-2 top-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transform -translate-y-1/2 animate-pulse"></div>
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
                      className="px-4 py-3 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg"
                    >
                      Start Transfer Process
                    </button>
                  </div>
                </div>
              </div>

         
            </div>
          )}

{activeTab === 'fees' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
    
    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 px-2">
      
      {/* Boarding Section - REAL MAPPING */}
      <ModernFeeCard
        variant="dark"
        feeType="Boarding School"
        total={documentData?.feesBoardingDistributionJson?.reduce((sum, i) => sum + i.amount, 0)}
        distribution={documentData?.feesBoardingDistributionJson}
        pdfPath={documentData?.feesBoardingDistributionPdf}
        year={documentData?.feesBoardingYear || "2026"}
        term={documentData?.feesBoardingTerm || "Term 1"}
        icon={IoBookOutline}
        badge="Full Board"
        features={[
          '24/7 Supervision',
          'Full Accommodation',
          'All Meals Included',
          'Study Support',
          'Health Services'
        ]}
      />

      {/* Day Section - REAL MAPPING */}
      <ModernFeeCard
        variant="light"
        feeType="Day School"
        total={documentData?.feesDayDistributionJson?.reduce((sum, i) => sum + i.amount, 0)}
        distribution={documentData?.feesDayDistributionJson}
        pdfPath={documentData?.feesDayDistributionPdf}
        year={documentData?.feesDayYear || "2026"}
        term={documentData?.feesDayTerm || "Term 1"}
        icon={FiHome}
        badge="Standard"
        features={[
          'Lunch Provided',
          'Library Access',
          'Sports Facilities',
          'Day Study Space',
          'Lab Access'
        ]}
      />
    </div>


  </div>
)}

          {/* NEW: Results Tab */}
          {activeTab === 'results' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-12">
              
              {/* Hero Header */}
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Academic Performance</span>
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 px-2">
                  Examination <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Results</span>
                </h2>
                <p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-2">
                  Access past examination results, performance reports, and academic achievements.
                </p>
              </div>

              {/* Academic Results Section */}
              <AcademicResultsSection documentData={documentData} />



              {/* Results Archive Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-white rounded-xl">
                    <FiInfo className="text-blue-500 text-lg md:text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">Results Archive Information</h4>
                    <p className="text-blue-700 text-sm">
                      All examination results are available for download in PDF format. Results are typically uploaded 
                      within 2 weeks after official release. For any missing results or technical issues, please contact 
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