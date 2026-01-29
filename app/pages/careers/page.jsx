'use client';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import {
  FiBriefcase,
  FiFilter,
  FiCalendar,
  FiUsers,
  FiGraduationCap,
  FiClock,
  FiArrowUpRight,
  FiMail,
  FiPhone,
  FiArrowRight,
  FiHeart,
  FiDownload,
  FiShare2,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiX,
  FiBookmark,
  FiExternalLink,
  FiAward,
  FiStar,
  FiShield,
  FiZap,
  FiTrendingUp,
  FiGlobe,
  FiCopy,
  FiBell,
  FiList,
  FiMapPin, 
  FiFileText,
  FiSend
} from 'react-icons/fi';
import { FaGraduationCap, FaBuilding as FiBuilding } from 'react-icons/fa';


import {
  IoCalendarClearOutline,
  IoSparkles,
  IoRibbonOutline,
  IoPeopleCircle,
  IoStatsChart,
  IoShareSocialOutline,
  IoClose,
  IoLocationOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoShareOutline,
  IoNewspaperOutline,
  IoSchoolOutline,
  IoBusinessOutline
} from 'react-icons/io5';
import { CircularProgress, Box, Typography, Stack } from '@mui/material';




// Modern Modal Component with Glass Morphism
const ModernModal = ({ children, open, onClose, maxWidth = '800px', blur = true }) => {
  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${blur ? 'backdrop-blur-md' : 'bg-black/50'}`}>
      <div 
        className="relative bg-white/95 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-white/40"
        style={{ 
          width: '90%',
          maxWidth: maxWidth,
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)'
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white cursor-pointer border border-gray-200 shadow-sm"
          >
            <FiX className="text-gray-600 w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Modern Job Card Component
const ModernJobCard = ({ job, onView, onBookmark, onShare, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getJobTypeStyle = (type) => {
    const styles = {
      'full-time': { 
        gradient: 'from-emerald-500 to-green-500', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200'
      },
      'part-time': { 
        gradient: 'from-blue-500 to-cyan-500', 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200'
      },
      'contract': { 
        gradient: 'from-purple-500 to-pink-500', 
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200'
      },
      'internship': { 
        gradient: 'from-amber-500 to-orange-500', 
        bg: 'bg-amber-50', 
        text: 'text-amber-700',
        border: 'border-amber-200'
      }
    };
    return styles[type] || styles['full-time'];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'teaching': FaGraduationCap,
      'administrative': FiBriefcase,
      'support': FiUsers,
      'technical': FiZap,
      'medical': FiShield,
      'maintenance': FiTrendingUp
    };
    return icons[category] || FiBriefcase;
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Open until filled';
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Tomorrow';
      if (diff < 0) return 'Closed';
      if (diff < 7) return `${diff} days`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Open';
    }
  };

  const CategoryIcon = getCategoryIcon(job?.category);

  // Modern Grid View
  if (viewMode === 'grid') {
    const theme = getJobTypeStyle(job?.jobType);
    const daysLeft = formatDate(job?.applicationDeadline);
    const isUrgent = daysLeft === 'Today' || daysLeft === 'Tomorrow';

    return (
      <div 
        onClick={() => onView(job)}
        className="relative bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden cursor-pointer"
      >
        {/* Header with Gradient */}
        <div className={`relative h-4 bg-gradient-to-r ${theme.gradient}`}>
          {isUrgent && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-3 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
              Urgent
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category and Bookmark */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${theme.bg} ${theme.text} border ${theme.border}`}>
                <CategoryIcon size={18} />
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${theme.text}`}>
                {job?.category || 'General'}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(job);
              }}
              className={`p-2 rounded-lg ${isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'}`}
            >
              <FiBookmark className={isBookmarked ? 'fill-current' : ''} size={16} />
            </button>
          </div>

          {/* Job Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
            {job?.jobTitle || 'Position Available'}
          </h3>

          {/* Department */}
          <div className="flex items-center gap-2 mb-4">
            <FiBuilding className="text-slate-400" size={14} />
            <span className="text-sm font-medium text-slate-600">
              {job?.department || 'School Department'}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
            {job?.jobDescription || 'Join our dedicated team at Katwanyaa High School. We are looking for passionate individuals to contribute to our educational mission.'}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
              <div className={`p-1.5 rounded-lg ${theme.bg}`}>
                <FiCalendar className={`${theme.text}`} size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Deadline</p>
                <p className="text-xs font-bold text-slate-900">{daysLeft}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
              <div className={`p-1.5 rounded-lg ${theme.bg}`}>
                <FiUsers className={`${theme.text}`} size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Positions</p>
                <p className="text-xs font-bold text-slate-900">{job?.positionsAvailable || 1}</p>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
              <div className={`p-1.5 rounded-lg ${theme.bg}`}>
                <FiClock className={`${theme.text}`} size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Type</p>
                <p className="text-xs font-bold text-slate-900 capitalize">
                  {job?.jobType?.replace('-', ' ') || 'Full-time'}
                </p>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiAward className="text-amber-500" size={14} />
                <span className="text-xs font-medium text-slate-600">Experience</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{job?.experience || 'Not specified'}</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            View Details
            <FiArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div 
      onClick={() => onView(job)}
      className="relative bg-white rounded-[24px] border border-slate-100 p-4 shadow-sm cursor-pointer transition-colors active:bg-slate-50"
    >
      <div className="flex gap-5">
        {/* Icon Container */}
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm">
          <div className={`w-full h-full bg-gradient-to-br ${getJobTypeStyle(job?.jobType).gradient} flex items-center justify-center`}>
            <CategoryIcon className="text-white text-2xl" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Metadata Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                  getJobTypeStyle(job?.jobType).bg
                } ${getJobTypeStyle(job?.jobType).text} ${
                  getJobTypeStyle(job?.jobType).border
                }`}>
                  {job?.jobType?.replace('-', ' ') || 'Full-time'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {formatDate(job?.applicationDeadline)}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark(job);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'}`}
                >
                  <FiBookmark className={isBookmarked ? 'fill-current' : ''} size={14} />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
              {job?.jobTitle || 'Position Available'}
            </h3>

            <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
              <div className="flex items-center gap-1">
                <FiBuilding size={12} />
                <span>{job?.department || 'Department'}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiUsers size={12} />
                <span>{job?.positionsAvailable || 1} position(s)</span>
              </div>
            </div>

            <p className="text-slate-500 text-xs line-clamp-2 mb-3">
              {job?.jobDescription || 'Join our dedicated team at Katwanyaa High School.'}
            </p>
          </div>

          {/* Footer: Details & Action */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                <FiAward className="text-amber-500" size={12} />
                <span className="text-[11px] font-bold text-slate-600">{job?.experience || 'Flexible'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-blue-600 font-bold text-[11px] uppercase tracking-wider">
              Apply Now
              <FiArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Stats Card Component
const ModernStatCard = ({ stat }) => {
  const Icon = stat.icon;
  
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-white border border-slate-100 p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm">
      {/* Top Section: Icon & Badge */}
      <div className="flex items-start justify-between mb-4 md:mb-8">
        <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.gradient} bg-opacity-[0.08] text-slate-700`}>
          <Icon className="text-lg md:text-2xl" />
        </div>
        
        {/* Status Dot */}
        <div className="hidden xs:block h-2 w-2 rounded-full bg-slate-200" />
      </div>

      {/* Content Section */}
      <div className="space-y-1">
        {/* Label */}
        <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
          {stat.label}
        </p>
        
        <div className="flex items-baseline gap-1">
          {/* Number */}
          <h3 className="text-xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            {stat.number}
          </h3>
        </div>

        {/* Sublabel */}
        <p className="text-[10px] md:text-sm font-medium text-slate-500 leading-tight line-clamp-1 md:line-clamp-none">
          {stat.sublabel}
        </p>
      </div>

      {/* Decorative Background Element */}
      <div className={`absolute -bottom-2 -right-2 w-12 h-12 md:w-20 md:h-20 opacity-[0.03] rounded-full bg-gradient-to-br ${stat.gradient} hidden md:block`} />
    </div>
  );
};

// Modern Job Detail Modal
const ModernJobDetailModal = ({ job, onClose, onApply }) => {
  if (!job) return null;

  const getJobTypeStyle = (type) => {
    const styles = {
      'full-time': { gradient: 'from-emerald-500 to-green-500' },
      'part-time': { gradient: 'from-blue-500 to-cyan-500' },
      'contract': { gradient: 'from-purple-500 to-pink-500' },
      'internship': { gradient: 'from-amber-500 to-orange-500' }
    };
    return styles[type] || { gradient: 'from-slate-500 to-slate-600' };
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return 'Open until filled';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const daysLeft = (dateString) => {
    if (!dateString) return 'Open';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) return 'Ends today';
      if (diff === 1) return 'Ends tomorrow';
      if (diff < 0) return 'Closed';
      return `${diff} days left`;
    } catch {
      return 'Open';
    }
  };

  const theme = getJobTypeStyle(job.jobType);

return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90"
        >
          <IoClose size={20}/>
        </button>

        {/* 1. Header with Gradient */}
        <div className={`relative h-4 sm:h-6 bg-gradient-to-r ${theme.gradient}`} />

        {/* 2. Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-white">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Title & Category */}
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-start sm:items-center gap-3 mb-2">
                <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${theme.gradient}`}>
                  <FiBriefcase className="text-white text-xl sm:text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                    {job.jobTitle}
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg">{job.department || 'School Department'}</p>
                </div>
              </div>

              {/* Quick Info Bar */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-2 sm:gap-y-3 gap-x-6 text-xs sm:text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <IoCalendarClearOutline className="text-blue-500 text-base sm:text-lg" />
                  {formatFullDate(job.applicationDeadline)}
                </div>
                <div className="flex items-center gap-2">
                  <IoTimeOutline className="text-emerald-500 text-base sm:text-lg" />
                  {daysLeft(job.applicationDeadline)}
                </div>
                <div className="flex items-center gap-2">
                  <IoBusinessOutline className="text-purple-500 text-base sm:text-lg" />
                  {job.jobType?.replace('-', ' ') || 'Full-time'}
                </div>
              </div>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-100">
                <FiUsers className="text-blue-600 mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Positions</p>
                <p className="font-bold text-slate-900 text-sm sm:text-base">{job.positionsAvailable || 1}</p>
              </div>
              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-100">
                <FiAward className="text-amber-500 mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Experience</p>
                <p className="font-bold text-slate-900 text-sm sm:text-base truncate">{job.experience || 'Flexible'}</p>
              </div>
              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-100">
                <FiClock className="text-emerald-500 mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Type</p>
                <p className="font-bold text-slate-900 text-sm sm:text-base capitalize">{job.jobType?.replace('-', ' ') || 'Full-time'}</p>
              </div>
              <div className="p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-100">
                <FaGraduationCap className="text-purple-500 mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Category</p>
                <p className="font-bold text-slate-900 text-sm sm:text-base">{job.category || 'General'}</p>
              </div>
            </section>

            {/* Description Block */}
            <section className="space-y-3 sm:space-y-4">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">Job Description</h3>
              <div className="text-slate-700 leading-relaxed text-sm sm:text-base md:text-lg bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-100">
                {job.jobDescription || 'Join our dedicated team at Katwanyaa High School. We are looking for passionate individuals to contribute to our educational mission.'}
              </div>
            </section>

            {/* Requirements */}
            {job.requirements && (
              <section className="space-y-3 sm:space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">Requirements</h3>
                <div className="text-slate-700 leading-relaxed text-sm sm:text-base bg-emerald-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl md:rounded-3xl border border-emerald-100">
                  {job.requirements}
                </div>
              </section>
            )}

            {/* Qualifications */}
            {job.qualifications && (
              <section className="space-y-3 sm:space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">Qualifications</h3>
                <div className="text-slate-700 leading-relaxed text-sm sm:text-base bg-purple-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl md:rounded-3xl border border-purple-100">
                  {job.qualifications}
                </div>
              </section>
            )}

            {/* Application Instructions */}
            <section className="bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 border border-blue-200">
              <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-4">
                <div className="p-2.5 sm:p-3 bg-blue-500 rounded-xl sm:rounded-2xl">
                  <FiSend className="text-white text-xl sm:text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">How to Apply</h3>
                  <p className="text-slate-600 text-sm sm:text-base">Submit your application through any of the methods below</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMail className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Email Application</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3">
                      Send your CV, certificates, and cover letter to:
                    </p>
                    <a 
                      href={`mailto:${job.contactEmail || 'careers@katwanyaa.sc.ke'}?subject=Job Application: ${job.jobTitle}`}
                      className="text-blue-600 font-medium hover:text-blue-800 text-sm sm:text-base break-all"
                    >
                      {job.contactEmail || 'careers@katwanyaa.sc.ke'}
                    </a>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FiPhone className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Phone Inquiry</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3">
                      Contact our HR department for inquiries:
                    </p>
                    <a 
                      href={`tel:${job.contactPhone || '+254712345678'}`}
                      className="text-green-600 font-medium hover:text-green-800 text-sm sm:text-base"
                    >
                      {job.contactPhone || '+254 712 345 678'}
                    </a>
                  </div>
                </div>
                
                <div className="pt-3 sm:pt-4 border-t border-blue-200">
                  <p className="text-xs sm:text-sm text-slate-600">
                    <strong>Note:</strong> Please include all relevant documents and mention the position title in your application.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 3. Action Footer - Sticky */}
        <div className="shrink-0 p-4 sm:p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100">
 <div className="max-w-2xl mx-auto flex flex-row items-center justify-center px-4 sm:px-0">
  <button
    onClick={onClose}
    className="flex-1 max-w-[200px] sm:max-w-none h-11 sm:h-14 bg-white border-2 border-slate-200 text-slate-900 rounded-xl sm:rounded-2xl font-bold text-[12px] sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
  >
    <IoClose size={18} className="shrink-0" />
    <span>Close</span>
  </button>
</div>
        </div>
      </div>
    </div>
  );
};

// Modern Empty State Component
const ModernEmptyState = ({ onClearFilters }) => {
  return (
    <div className="bg-white rounded-[32px] border-2 border-dashed border-slate-200 py-16 px-8 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <FiBriefcase className="text-slate-300 text-4xl" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">No Current Openings</h3>
      <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
        There are currently no job opportunities available. Check back soon for new positions or submit your CV for future consideration.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onClearFilters}
          className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm"
        >
          Check All Categories
        </button>

      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <FiBell className="text-blue-500 text-xl mb-2" />
          <h4 className="font-bold text-slate-900 mb-1">Get Notified</h4>
          <p className="text-sm text-slate-600">We'll notify you when new positions open</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <FiBookmark className="text-emerald-500 text-xl mb-2" />
          <h4 className="font-bold text-slate-900 mb-1">Save Your Search</h4>
          <p className="text-sm text-slate-600">Save this page and check back regularly</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <FiMail className="text-purple-500 text-xl mb-2" />
          <h4 className="font-bold text-slate-900 mb-1">Contact HR</h4>
          <p className="text-sm text-slate-600">Inquire about upcoming opportunities</p>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ModernCareersPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Stats data
  const stats = [
    { 
      icon: FiBriefcase, 
      number: '0', 
      label: 'Open Positions', 
      sublabel: 'Currently available',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: FiUsers, 
      number: '50+', 
      label: 'Staff Members', 
      sublabel: 'Our current team',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      icon: FaGraduationCap, 
      number: '8', 
      label: 'Departments', 
      sublabel: 'Academic & support',
      gradient: 'from-emerald-500 to-green-500'
    },
    { 
      icon: FiAward, 
      number: '25+', 
      label: 'Years Excellence', 
      sublabel: 'Educational experience',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Positions', icon: FiBriefcase, gradient: 'from-slate-500 to-slate-600' },
    { id: 'teaching', name: 'Teaching', icon: FaGraduationCap, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'administrative', name: 'Administrative', icon: FiBriefcase, gradient: 'from-purple-500 to-pink-500' },
    { id: 'support', name: 'Support Staff', icon: FiUsers, gradient: 'from-emerald-500 to-green-500' },
    { id: 'technical', name: 'Technical', icon: FiZap, gradient: 'from-amber-500 to-orange-500' },
    { id: 'medical', name: 'Medical', icon: FiShield, gradient: 'from-red-500 to-rose-500' }
  ];

  // Job types
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/career');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
          
          // Update the open positions stat
          if (stats[0]) {
            stats[0].number = data.jobs.length.toString();
          }
        } else {
          console.error('Invalid API response format:', data);
          toast.error('Invalid data format received from server');
          setJobs([]);
          setFilteredJobs([]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load job listings. Please try again.');
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); // Empty dependency array to run only once on mount

  // Filter jobs based on search and category
  useEffect(() => {
    let filtered = [...jobs];
    
    // Filter by category
    if (activeTab !== 'all') {
      filtered = filtered.filter(job => 
        job?.category?.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    // Filter by search
    if (search) {
      filtered = filtered.filter(job => 
        job?.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        job?.department?.toLowerCase().includes(search.toLowerCase()) ||
        job?.jobDescription?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredJobs(filtered);
  }, [jobs, search, activeTab]);

  const handleBookmark = (job) => {
    const newBookmarked = new Set(bookmarkedJobs);
    if (newBookmarked.has(job.id)) {
      newBookmarked.delete(job.id);
      toast.success('Removed from bookmarks');
    } else {
      newBookmarked.add(job.id);
      toast.success('Job saved to bookmarks');
    }
    setBookmarkedJobs(newBookmarked);
  };

  const handleShare = (job) => {
    if (navigator.share) {
      navigator.share({
        title: `${job.jobTitle} - Katwanyaa High School`,
        text: `Check out this job opportunity at Katwanyaa High School: ${job.jobTitle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleApply = (job) => {
    toast.success(`Application process for ${job.jobTitle} will open soon!`);
    // In a real app, this would redirect to application form or open modal
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/career');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
        toast.success(`Refreshed! ${data.jobs.length} positions loaded`);
      }
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast.error('Failed to refresh job listings');
    } finally {
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTab('all');
  };

 if (loading) {
   return (
     <Box 
       className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6"
     >
       <Stack 
         spacing={3} 
         alignItems="center"
         className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100"
       >
         {/* Modern Layered Loader */}
         <Box className="relative flex items-center justify-center">
           {/* Background Ring */}
           <CircularProgress
             variant="determinate"
             value={100}
             size={64}
             thickness={4}
             sx={{ color: '#f1f5f9' }} // Very light gray track
           />
           {/* Actual Animated Loader */}
           <CircularProgress
             variant="indeterminate"
             disableShrink
             size={64}
             thickness={4}
             sx={{
               color: '#2563eb', // Modern Blue
               animationDuration: '800ms',
               position: 'absolute',
               left: 0,
               [`& .MuiCircularProgress-circle`]: {
                 strokeLinecap: 'round',
               },
             }}
           />
           {/* Center Icon */}
           <Box className="absolute">
             <IoSparkles className="text-blue-500 text-xl animate-pulse" />
           </Box>
         </Box>
 
         {/* Clean Typography */}
         <Stack spacing={0.5} alignItems="center">
           <Typography 
             variant="body1" 
             fontWeight="600" 
             color="text.primary"
             sx={{ letterSpacing: '-0.01em' }}
           >
 Loading for our school latest Jobs Careers to stay updated
           </Typography>
           <Typography 
             variant="caption" 
             color="text.secondary"
             className="flex items-center gap-1"
           >
             Fetching latest latest Careers in Our School
           </Typography>
         </Stack>
       </Stack>
     </Box>
   );
 }

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-3 sm:p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-2 sm:mb-3">
              <IoSparkles className="text-blue-500 w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-blue-700 font-bold text-xs sm:text-sm uppercase tracking-wider">
                Career Opportunities
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight mb-1 sm:mb-2">
              Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Academic Team</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl">
              Shape the future of education at Katwanyaa High School
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="
                inline-flex items-center gap-1.5 sm:gap-2
                px-3 sm:px-4 md:px-5
                py-2 sm:py-2.5 md:py-3
                rounded-lg sm:rounded-xl
                bg-white text-slate-700
                border border-slate-200
                font-medium text-xs sm:text-sm md:text-base
                shadow-sm
                transition-all duration-300
                hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {refreshing && (
                <CircularProgress
                  size={14}
                  thickness={4}
                  sx={{
                    color: "#0284c7", // tailwind cyan-600
                  }}
                />
              )}

              <span className="whitespace-nowrap">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
            
            <div className="flex bg-white rounded-lg sm:rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 sm:p-3 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <FiTrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 sm:p-3 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <FiList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats - Updated with real job count */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 sm:mb-8 md:mb-10">
          {stats.map((stat, index) => {
            // Update the open positions stat with real count
            const updatedStat = { ...stat };
            if (index === 0) {
              updatedStat.number = jobs.length.toString();
            }
            return <ModernStatCard key={index} stat={updatedStat} />;
          })}
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          
          {/* Left Column: Filters & Info */}
          <div className="lg:w-1/4 space-y-4 sm:space-y-6">
            {/* School Info Card */}
            <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl md:rounded-[32px] p-4 sm:p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <IoSchoolOutline className="text-blue-600 text-lg sm:text-xl" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Katwanyaa High School</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                  <FiMapPin className="text-rose-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">Location</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Matungulu SUb County Machakos, Kenya</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                  <FiMail className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">HR Email</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">careers@katwanyaa.sc.ke</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                  <FiPhone className="text-emerald-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">Contact</p>
                    <p className="text-[10px] sm:text-xs text-slate-500">+254 712 345 678</p>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 italic">
                    "Excellence Through Discipline and Hard Work"
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Application Card - Removed CV submission button */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl sm:rounded-3xl md:rounded-[32px] p-4 sm:p-5 md:p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 blur-[40px] sm:blur-[50px]" />
              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <FiBriefcase className="text-white text-lg sm:text-xl" />
                </div>
                <h4 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2">Career Information</h4>
                <p className="text-xs sm:text-sm text-blue-200 mb-3 sm:mb-4">
                  {jobs.length} positions currently available
                </p>
                <button
                  onClick={() => toast.info('Contact HR for general inquiries')}
                  className="w-full py-2.5 sm:py-3 bg-white text-blue-900 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-blue-50 transition-colors"
                >
                  Contact HR
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Job Listings */}
          <div className="lg:w-3/4 space-y-4 sm:space-y-6 md:space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 px-1">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-slate-900 rounded-xl sm:rounded-2xl shadow-lg">
                  <FiBriefcase className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Current Openings</h2>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest">
                    {filteredJobs.length} Positions Available
                  </p>
                </div>
              </div>
            </div>

            {/* Modern Search & Filter Bar */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl md:rounded-[28px] shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3">
                {/* Search */}
                <div className="relative w-full flex-1 group">
                  <div className="relative flex items-center bg-white border border-slate-200 rounded-lg sm:rounded-xl md:rounded-2xl shadow-sm transition-all focus-within:border-slate-900 focus-within:ring-2 sm:focus-within:ring-4 focus-within:ring-slate-900/5">
                    <div className="pl-3 sm:pl-4 md:pl-5 pr-2 sm:pr-3 flex items-center justify-center pointer-events-none">
                      <FiSearch className="text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search positions..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full py-2.5 sm:py-3 md:py-4 bg-transparent text-slate-900 placeholder:text-slate-400 font-medium sm:font-semibold text-sm focus:outline-none placeholder:text-xs sm:placeholder:text-sm"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="pr-3 sm:pr-4 text-slate-400 hover:text-slate-600"
                      >
                        <FiX size={16}  />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Selector */}
                <div className="relative w-full md:w-auto">
                  <select 
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full md:w-48 appearance-none px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 bg-slate-50 border-none rounded-lg sm:rounded-xl md:rounded-2xl font-medium sm:font-semibold text-slate-600 text-xs sm:text-sm cursor-pointer focus:ring-1 sm:focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={clearFilters}
                  className="w-full md:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 bg-blue-600 text-white rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <FiFilter size={14} />
                  Reset
                </button>
              </div>
            </div>

            {/* Modern Category Pills */}
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-4 no-scrollbar -mx-2 px-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeTab === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full whitespace-nowrap text-xs sm:text-sm font-bold transition-all border ${
                      isActive 
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {Icon && <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />}
                    <span className="truncate">{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Job Listings */}
            <div className="relative">
              {filteredJobs.length === 0 ? (
                <ModernEmptyState onClearFilters={clearFilters} />
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6' : 'space-y-3 sm:space-y-4'}>
                  {filteredJobs.map((job, index) => (
                    <ModernJobCard 
                      key={job.id || index} 
                      job={job} 
                      onView={setSelectedJob}
                      onBookmark={handleBookmark}
                      onShare={handleShare}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Call to Action Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-blue-900 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white/5 blur-[40px] sm:blur-[60px] md:blur-[80px] rounded-full -mr-12 sm:-mr-16 md:-mr-24 -mt-12 sm:-mt-16 md:-mt-24" />
              <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-blue-500/10 blur-[40px] sm:blur-[60px] md:blur-[80px] rounded-full -ml-12 sm:-ml-16 md:-ml-24 -mb-12 sm:-mb-16 md:-mb-24" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                
                {/* Icon */}
                <div className="shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-lg">
                    <FiBriefcase className="text-slate-900 text-xl sm:text-2xl md:text-3xl" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-1.5 sm:mb-2 tracking-tight">
                    Build Your Career With Us.
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
                    Join a team dedicated to educational excellence and student success.
                  </p>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
                    {[
                      { label: 'Professional Growth', icon: FiTrendingUp, color: 'text-blue-300', bg: 'bg-blue-400/10' },
                      { label: 'Competitive Package', icon: FiAward, color: 'text-amber-300', bg: 'bg-amber-400/10' },
                      { label: 'Supportive Environment', icon: FiUsers, color: 'text-emerald-300', bg: 'bg-emerald-400/10' },
                      { label: 'Career Development', icon: FaGraduationCap, color: 'text-purple-300', bg: 'bg-purple-400/10' }
                    ].map((feature, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10"
                      >
                        <div className={`p-1 sm:p-1.5 rounded-md ${feature.bg} ${feature.color} shrink-0`}>
                          <feature.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-300 truncate">
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <ModernJobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
        />
      )}
    </div>
  );
}