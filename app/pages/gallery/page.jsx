'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiSearch, FiFilter, FiX, FiHome, FiChevronLeft, FiChevronRight,
  FiDownload, FiShare2, FiHeart, FiImage, FiVideo, FiPlay, FiPause,
  FiVolume2, FiVolumeX, FiGrid, FiList, FiChevronUp, FiChevronDown,
  FiUsers, FiBook, FiAward, FiMusic, FiMic, FiCamera, FiCalendar,
  FiUser, FiBookOpen, FiTarget, FiStar, FiGlobe, FiMessageSquare,
  FiFacebook, FiTwitter, FiFileText, FiInfo, FiRefreshCw, FiEye,
  FiBookmark, FiExternalLink, FiZap, FiTrendingUp, FiCopy, FiBell,
  FiUserPlus, FiArrowRight, FiPlus, FiRotateCw, FiEdit3, FiTrash2,
  FiSave, FiUpload, FiMapPin, FiAlertTriangle, FiMail, FiPhone, FiFolder, FiLock 
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaCopy } from 'react-icons/fa';
import { 
  IoClose, IoMenu, IoSparkles
} from 'react-icons/io5';
import {
  IoCalendarClearOutline,
  IoRibbonOutline,
  IoPeopleCircle,
  IoStatsChart,
  IoShareSocialOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoShareOutline,
  IoNewspaperOutline
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

// Modern Card Component
const GlassCard = ({ children, className = '', hover = true }) => (
  <div className={`
    bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 
    shadow-lg shadow-black/5 transition-all duration-300
    ${hover ? 'hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1' : ''}
    ${className}
  `}>
    {children}
  </div>
);

// Modern Hero Banner Component
const ModernHeroBanner = ({ stats, onRefresh }) => {
  return (
    <div className="relative bg-[#0F172A] rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white overflow-hidden shadow-2xl border border-white/5 mb-8">
      {/* Abstract Mesh Gradient Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            {/* Institutional Branding */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,99,235,0.5)]" />
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
                  Katwanyaa High School
                </h2>
                <p className="text-[10px] italic font-medium text-white/60 tracking-widest uppercase">
                  "Education is Light"
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 w-fit">
                <IoSparkles className="text-2xl sm:text-3xl text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                School <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200">Gallery</span>
              </h1>
            </div>
          </div>
          
          {/* Modern Glass Refresh Button */}
          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm tracking-wide transition-all hover:bg-white/20 w-full sm:w-fit"
          >
            <FiRefreshCw className="text-lg" />
            <span>REFRESH GALLERY</span>
          </button>
        </div>
        
        {/* Summary Text */}
        <div className="mb-8">
          <p className="text-blue-100/80 text-base sm:text-md font-medium leading-relaxed">
            Explore <span className="text-white font-bold underline decoration-blue-500/50 decoration-2 underline-offset-4">{stats.totalFiles} media files</span> 
            across <span className="text-white font-bold underline decoration-purple-500/50 decoration-2 underline-offset-4 mx-2">{stats.totalCategories} categories</span> 
            capturing our school's journey. This month: <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-400/20 mx-1">{stats.thisMonth} new galleries</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

// Modern Gallery Card Component (Matching Counseling Session Card Design)
const ModernGalleryCard = ({ gallery, onView, onFavorite, viewMode = 'grid', onShare }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getCategoryStyle = (category) => {
    const styles = {
      GENERAL: { 
        gradient: 'from-blue-500 to-cyan-500', 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      CLASSROOMS: { 
        gradient: 'from-emerald-500 to-green-500', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      },
      TEACHING: { 
        gradient: 'from-purple-500 to-pink-500', 
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      LABORATORIES: { 
        gradient: 'from-indigo-500 to-purple-500', 
        bg: 'bg-indigo-50', 
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600'
      },
      SPORTS_DAY: { 
        gradient: 'from-amber-500 to-orange-500', 
        bg: 'bg-amber-50', 
        text: 'text-amber-700',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600'
      },
      GRADUATION: { 
        gradient: 'from-rose-500 to-red-500', 
        bg: 'bg-rose-50', 
        text: 'text-rose-700',
        border: 'border-rose-200',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600'
      }
    };
    return styles[category] || styles.GENERAL;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently added';
    }
  };

  // Modern Grid View (Matching Counseling Card)
  if (viewMode === 'grid') {
    const theme = getCategoryStyle(gallery.category);
    
    return (
      <div 
        onClick={() => onView(gallery)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer"
      >
        <div className="relative bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          {/* 1. Static Image Header */}
          <div className="relative h-52 w-full shrink-0">
            {gallery.files && gallery.files[0] ? (
              <img
                src={gallery.files[0]}
                alt={gallery.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${theme.gradient}`} />
            )}
            
            {/* Permanent Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${theme.bg} ${theme.text} ${theme.border}`}>
                {gallery.category.replace(/_/g, ' ') || 'Gallery'}
              </span>
              {gallery.year && (
                <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                  <IoSparkles className="text-amber-400" /> {gallery.year}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              {/* Share Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(gallery);
                }}
                className="p-2.5 rounded-xl backdrop-blur-md border shadow-sm bg-white/90 border-white/10 text-slate-700 hover:bg-white"
              >
                <FiShare2 size={16} />
              </button>
              
              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite(gallery);
                  setIsFavorite(!isFavorite);
                }}
                className={`p-2.5 rounded-xl backdrop-blur-md border shadow-sm ${
                  isFavorite 
                    ? 'bg-amber-500 border-amber-500 text-white' 
                    : 'bg-white/90 border-white/10 text-slate-700 hover:bg-white'
                }`}
              >
                <FiBookmark className={isFavorite ? 'fill-current' : ''} size={16} />
              </button>
            </div>

            {/* File Count Overlay */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                {gallery.files?.length || 0} files
              </span>
            </div>
          </div>

          {/* 2. Content Area */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
              {gallery.title}
            </h3>
            
            <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
              {gallery.description || 'School gallery collection.'}
            </p>

            {/* 3. Bento-Style Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={`p-1.5 rounded-lg ${theme.iconBg}`}>
                  <FiCalendar className={`${theme.iconColor}`} size={14} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                  {formatDate(gallery.date)}
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={`p-1.5 rounded-lg ${theme.iconBg}`}>
                  <FiImage className={`${theme.iconColor}`} size={14} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
                  {gallery.files?.length || 0} items
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={`p-1.5 rounded-lg ${theme.iconBg}`}>
                  <FiFolder className={`${theme.iconColor}`} size={14} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
                  {gallery.category.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* 4. Status Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Collection
                </span>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-700 border-emerald-200`}>
                Published
              </div>
            </div>

            {/* 5. Final Action Button */}
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:shadow-lg">
              View Gallery
              <FiArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div 
      onClick={() => onView(gallery)}
      className="relative bg-white rounded-[24px] border border-slate-100 p-4 shadow-sm cursor-pointer transition-colors active:bg-slate-50 group"
    >
      <div className="flex gap-5">
        {/* Image Container */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm">
          {gallery.files && gallery.files[0] ? (
            <img
              src={gallery.files[0]}
              alt={gallery.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getCategoryStyle(gallery.category).gradient}`} />
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl"></div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Metadata Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  getCategoryStyle(gallery.category).bg
                } ${getCategoryStyle(gallery.category).text} ${
                  getCategoryStyle(gallery.category).border
                }`}>
                  {gallery.category.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {formatDate(gallery.date)}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(gallery);
                  }}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <FiShare2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite(gallery);
                    setIsFavorite(!isFavorite);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isFavorite ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  <FiBookmark className={isFavorite ? 'fill-current' : ''} size={14} />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
              {gallery.title}
            </h3>

            <p className="text-slate-500 text-xs line-clamp-2 mb-3">
              {gallery.description || 'School gallery collection.'}
            </p>
          </div>

          {/* Footer: Details & Action */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <FiImage className="text-slate-400" size={12} />
                <span className="font-semibold">{gallery.files?.length || 0} files</span>
              </div>
              <div className="flex items-center gap-1">
                <FiCalendar className="text-slate-400" size={12} />
                <span>{gallery.year}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-blue-600 font-bold text-[11px] uppercase tracking-wider">
              View
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

// Share Modal Component
const ShareModal = ({ isOpen, onClose, gallery }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen || !gallery) return null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/gallery/${gallery.id}`
    : '';

  const shareTitle = `Check out this school gallery: ${gallery.title}`;
  const shareText = `${gallery.title} - ${gallery.description?.substring(0, 100)}...`;

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: FiCopy,
      color: 'bg-slate-100',
      iconColor: 'text-slate-600',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Gallery link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareText}\n${shareUrl}`)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-sky-50',
      iconColor: 'text-sky-600',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Email',
      icon: FiMail,
      color: 'bg-rose-50',
      iconColor: 'text-rose-600',
      action: () => {
        const subject = encodeURIComponent(shareTitle);
        const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
        const url = `mailto:?subject=${subject}&body=${body}`;
        window.location.href = url;
      }
    },
    {
      name: 'Telegram',
      icon: FiShare2,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-[40px] w-full max-w-md max-h-[90vh] overflow-hidden border border-slate-200 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900">Share Gallery</h3>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="text-slate-500 text-sm">
              Share "{gallery.title}" with others
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Item Preview */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                {gallery.files && gallery.files[0] ? (
                  <img src={gallery.files[0]} alt={gallery.title} className="w-full h-full object-cover" />
                ) : (
                  <FiImage className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate">{gallery.title}</h4>
                <p className="text-xs text-slate-500 truncate">{gallery.files?.length || 0} files</p>
              </div>
            </div>

            {/* Share Options Grid */}
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.action}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${option.color}`}>
                    <option.icon className={`text-lg ${option.iconColor}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{option.name}</span>
                  {option.name === 'Copy Link' && copied && (
                    <span className="text-[10px] text-emerald-600 font-bold mt-1">Copied!</span>
                  )}
                </button>
              ))}
            </div>

            {/* URL Preview */}
            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Gallery Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 truncate"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('Link copied!');
                  }}
                  className="px-4 py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Modern Gallery Detail Modal
// Modern Gallery Detail Modal with WORKING Download
const ModernGalleryDetailModal = ({ gallery, onClose, onDownload, onShare }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);

  if (!gallery) return null;

  const getCategoryStyle = (category) => {
    const styles = {
      GENERAL: { gradient: 'from-blue-500 to-cyan-500', icon: FiGlobe },
      CLASSROOMS: { gradient: 'from-emerald-500 to-green-500', icon: FiBookOpen },
      TEACHING: { gradient: 'from-purple-500 to-pink-500', icon: FiBook },
      LABORATORIES: { gradient: 'from-indigo-500 to-purple-500', icon: FiTarget },
      SPORTS_DAY: { gradient: 'from-amber-500 to-orange-500', icon: FiAward },
      GRADUATION: { gradient: 'from-rose-500 to-red-500', icon: FiAward }
    };
    return styles[category] || { gradient: 'from-slate-500 to-slate-600', icon: FiImage };
  };

  const categoryStyle = getCategoryStyle(gallery.category);
  const CategoryIcon = categoryStyle.icon;

  const isVideoFile = (filename) => {
    if (!filename) return false;
    const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const isImageFile = (filename) => {
    if (!filename) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  // WORKING DOWNLOAD FUNCTION - Downloads each file individually
  const downloadAllFiles = async () => {
    if (!gallery || !gallery.files || gallery.files.length === 0) {
      toast.error('No files available to download');
      return;
    }

    setDownloading(true);
    const toastId = toast.loading(`Starting download of ${gallery.files.length} files...`);
    
    try {
      const files = gallery.files;
      let downloadedCount = 0;
      
      // Download each file one by one
      for (let i = 0; i < files.length; i++) {
        const fileUrl = files[i];
        const fileName = fileUrl.split('/').pop() || `file_${i + 1}`;
        
        try {
          // Update progress
          toast.loading(`Downloading ${i + 1}/${files.length}: ${fileName}`, { id: toastId });
          
          // Create a hidden anchor element
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = fileName;
          link.style.display = 'none';
          
          // Add to document and trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          downloadedCount++;
          
          // Small delay between downloads to avoid browser blocking
          if (i < files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
        } catch (error) {
          console.error(`Failed to download ${fileName}:`, error);
        }
      }
      
      // Show success message
      toast.dismiss(toastId);
      toast.success(`Successfully downloaded ${downloadedCount}/${files.length} files!`, {
        duration: 5000
      });
      
      if (downloadedCount < files.length) {
        toast.info(`${files.length - downloadedCount} files may need to be downloaded manually`, {
          duration: 7000
        });
      }
      
    } catch (error) {
      console.error('Error in download process:', error);
      toast.dismiss(toastId);
      toast.error('Download failed. Please try downloading files individually.');
    } finally {
      setDownloading(false);
    }
  };

  // Alternative: Download selected file only
  const downloadSelectedFile = async () => {
    if (!gallery.files || !gallery.files[selectedIndex]) {
      toast.error('No file selected to download');
      return;
    }
    
    const fileUrl = gallery.files[selectedIndex];
    const fileName = fileUrl.split('/').pop() || `gallery_file_${selectedIndex + 1}`;
    
    try {
      const toastId = toast.loading(`Downloading ${fileName}...`);
      
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss(toastId);
      toast.success(`Downloaded: ${fileName}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90"
        >
          <IoClose size={24} />
        </button>

        {/* 1. Hero Image */}
        <div className="relative h-[40vh] sm:h-[350px] w-full shrink-0">
          {gallery.files && gallery.files[selectedIndex] ? (
            <img
              src={gallery.files[selectedIndex]}
              alt={gallery.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${categoryStyle.gradient}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          
          {/* Badge Overlays */}
          <div className="absolute bottom-6 left-6 flex gap-2">
            <span className="px-4 py-1.5 bg-white shadow-xl rounded-full text-xs font-bold uppercase tracking-widest text-slate-900">
              {gallery.category.replace(/_/g, ' ')}
            </span>
            <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <IoSparkles className="text-amber-400" /> {gallery.year}
            </span>
          </div>
        </div>

        {/* 2. Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Title & Category */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${categoryStyle.gradient}`}>
                  <CategoryIcon className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                    {gallery.title}
                  </h2>
                  <p className="text-slate-600 text-lg">{gallery.category.replace(/_/g, ' ')} Collection</p>
                </div>
              </div>

              {/* Quick Info Bar */}
              <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <IoCalendarClearOutline className="text-blue-500 text-lg" />
                  {new Date(gallery.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <IoPersonOutline className="text-emerald-500 text-lg" />
                  {gallery.files?.length || 0} files
                </div>
                <div className="flex items-center gap-2">
                  <IoLocationOutline className="text-rose-500 text-lg" />
                  School Archives
                </div>
              </div>
            </section>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex gap-8">
                <button
                  className={`pb-3 font-bold text-sm border-b-2 transition-colors ${
                    activeTab === 'preview' 
                      ? `border-blue-500 text-blue-600` 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('preview')}
                >
                  <FiEye className="inline mr-2" />
                  Preview
                </button>
                <button
                  className={`pb-3 font-bold text-sm border-b-2 transition-colors ${
                    activeTab === 'files' 
                      ? `border-blue-500 text-blue-600` 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('files')}
                >
                  <FiImage className="inline mr-2" />
                  All Files ({gallery.files?.length || 0})
                </button>
                <button
                  className={`pb-3 font-bold text-sm border-b-2 transition-colors ${
                    activeTab === 'info' 
                      ? `border-blue-500 text-blue-600` 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab('info')}
                >
                  <FiInfo className="inline mr-2" />
                  Info
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'preview' && (
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Gallery Preview</h3>
                
                {/* Thumbnail Grid */}
                {gallery.files && gallery.files.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {gallery.files.slice(0, 6).map((file, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${
                          selectedIndex === index ? 'border-blue-500' : 'border-transparent'
                        }`}
                      >
                        {isVideoFile(file) ? (
                          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                            <FiVideo className="text-white text-xl" />
                          </div>
                        ) : (
                          <img
                            src={file}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-slate-700 leading-snug sm:leading-relaxed text-sm sm:text-base md:text-lg break-words">
                  {gallery.description || 'No description available.'}
                </div>
              </section>
            )}

            {activeTab === 'files' && (
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">All Files</h3>
                <div className="space-y-3">
                  {gallery.files?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="p-2 bg-white rounded-lg">
                        {isVideoFile(file) ? (
                          <FiVideo className="text-blue-600" />
                        ) : (
                          <FiImage className="text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {file.split('/').pop()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isVideoFile(file) ? 'Video File' : 'Image File'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedIndex(index);
                            setActiveTab('preview');
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          View
                        </button>
                        <button
                          onClick={async () => {
                            const fileName = file.split('/').pop() || `file_${index + 1}`;
                            try {
                              const link = document.createElement('a');
                              link.href = file;
                              link.download = fileName;
                              link.style.display = 'none';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              toast.success(`Downloaded: ${fileName}`);
                            } catch (error) {
                              toast.error('Failed to download file');
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'info' && (
              <section className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Gallery Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-1">Category</h4>
                      <p className="text-slate-700">{gallery.category.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-1">Year</h4>
                      <p className="text-slate-700">{gallery.year}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-1">Total Files</h4>
                      <p className="text-slate-700">{gallery.files?.length || 0}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-1">Date Added</h4>
                      <p className="text-slate-700">{new Date(gallery.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">File Types</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-slate-600">Images: {gallery.files?.filter(f => isImageFile(f)).length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-slate-600">Videos: {gallery.files?.filter(f => isVideoFile(f)).length || 0}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Gallery Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full bg-emerald-500`} />
                  <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                </div>
                <p className="font-bold text-slate-900 capitalize">Published</p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <FiImage size={16} />
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Images</p>
                <p className="font-bold text-slate-900">{gallery.files?.filter(f => isImageFile(f)).length || 0}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                  <FiVideo size={16} />
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Videos</p>
                <p className="font-bold text-slate-900">{gallery.files?.filter(f => isVideoFile(f)).length || 0}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                  <FiStar size={16} />
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Quality</p>
                <p className="font-bold text-slate-900">High</p>
              </div>
            </section>
          </div>
        </div>

        {/* 3. Action Footer - Sticky */}
 <div className="shrink-0 p-4 sm:p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100">
  <div className="max-w-2xl mx-auto flex flex-row gap-2 sm:gap-3 px-1">
    


    {/* Download Selected Button */}
    <button
      onClick={downloadSelectedFile}
      disabled={!gallery.files || !gallery.files[selectedIndex]}
      className={`
        flex-1 min-w-0
        h-11 sm:h-14
        rounded-xl sm:rounded-2xl
        font-semibold sm:font-bold
        text-[10px] sm:text-sm
        flex items-center justify-center gap-1.5 sm:gap-2
        transition-all
        ${
          (!gallery.files || !gallery.files[selectedIndex])
            ? "opacity-50 cursor-not-allowed bg-slate-200 text-slate-500"
            : "bg-white border-2 border-slate-200 text-slate-900 active:scale-95"
        }
      `}
    >
      <FiDownload className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      <span className="truncate">Download Selected</span>
    </button>

    {/* Share Button */}
    <button
      onClick={() => onShare(gallery)}
      className="
        flex-1 min-w-0
        h-11 sm:h-14
        bg-white border-2 border-slate-200
        text-slate-900
        rounded-xl sm:rounded-2xl
        font-semibold sm:font-bold
        text-[10px] sm:text-sm
        flex items-center justify-center gap-1.5 sm:gap-2
        active:scale-95 transition-all
      "
    >
      <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      <span className="truncate">Share</span>
    </button>

  </div>
</div>

      </div>
    </div>
  );
};

export default function ModernGallery() {
  const [activeCategory, setActiveCategory] = useState('GENERAL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [categories, setCategories] = useState([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [galleryToShare, setGalleryToShare] = useState(null);

  // Categories for filtering
  const categoryOptions = [
    { id: 'all', name: 'All Galleries', icon: FiGlobe, gradient: 'from-slate-500 to-slate-600' },
    { id: 'GENERAL', name: 'General', icon: FiGlobe, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'CLASSROOMS', name: 'Classrooms', icon: FiBookOpen, gradient: 'from-emerald-500 to-green-500' },
    { id: 'TEACHING', name: 'Teaching', icon: FiBook, gradient: 'from-purple-500 to-pink-500' },
    { id: 'LABORATORIES', name: 'Laboratories', icon: FiTarget, gradient: 'from-indigo-500 to-purple-500' },
    { id: 'SPORTS_DAY', name: 'Sports Day', icon: FiAward, gradient: 'from-amber-500 to-orange-500' },
    { id: 'GRADUATION', name: 'Graduation', icon: FiAward, gradient: 'from-rose-500 to-red-500' }
  ];

  const [stats, setStats] = useState([
    { 
      icon: FiImage, 
      number: '0', 
      label: 'Media Files', 
      sublabel: 'Total files',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: FiFolder, 
      number: '0', 
      label: 'Galleries', 
      sublabel: 'Collections',
      gradient: 'from-emerald-500 to-green-500'
    },
    { 
      icon: FiGrid, 
      number: '0', 
      label: 'Categories', 
      sublabel: 'Available',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      icon: FiCalendar, 
      number: new Date().getFullYear().toString(),
      label: 'Latest', 
      sublabel: 'This year',
      gradient: 'from-amber-500 to-orange-500'
    }
  ]);

  // Fetch galleries from API
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        
        if (data.success && data.galleries) {
          setGalleries(data.galleries);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(data.galleries.map(g => g?.category).filter(Boolean))];
          setCategories(uniqueCategories);
          
          // Calculate file count
          const totalFiles = data.galleries.reduce((acc, gallery) => acc + (gallery?.files?.length || 0), 0);
          
          // Update stats
          setStats([
            { 
              icon: FiImage, 
              number: totalFiles.toString(), 
              label: 'Media Files', 
              sublabel: 'Total files',
              gradient: 'from-blue-500 to-cyan-500'
            },
            { 
              icon: FiFolder, 
              number: data.galleries.length.toString(), 
              label: 'Galleries', 
              sublabel: 'Collections',
              gradient: 'from-emerald-500 to-green-500'
            },
            { 
              icon: FiGrid, 
              number: uniqueCategories.length.toString(), 
              label: 'Categories', 
              sublabel: 'Available',
              gradient: 'from-purple-500 to-pink-500'
            },
            { 
              icon: FiCalendar, 
              number: '2024', 
              label: 'Latest', 
              sublabel: 'This year',
              gradient: 'from-amber-500 to-orange-500'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching galleries:', error);
        toast.error('Failed to load galleries');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Transform API data
  const transformedGalleries = useMemo(() => {
    return (galleries || []).map(gallery => ({
      id: gallery.id || Math.random().toString(),
      category: gallery.category || 'GENERAL',
      title: gallery.title || 'Untitled Gallery',
      description: gallery.description || 'No description available',
      files: gallery.files || [],
      date: gallery.createdAt || new Date().toISOString(),
      year: gallery.createdAt ? new Date(gallery.createdAt).getFullYear() : new Date().getFullYear()
    }));
  }, [galleries]);

  // Get available years
  const years = useMemo(() => {
    const yearSet = new Set();
    galleries.forEach(gallery => {
      if (gallery?.createdAt) {
        const year = new Date(gallery.createdAt).getFullYear();
        yearSet.add(year);
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [galleries]);

  // Filter galleries
  const filteredGalleries = useMemo(() => {
    let filtered = transformedGalleries.filter(gallery => {
      const matchesCategory = activeCategory === 'all' || gallery.category === activeCategory;
      const matchesYear = selectedYear === 'all' || gallery.year.toString() === selectedYear;
      const matchesSearch = searchTerm === '' || 
        gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (gallery.description && gallery.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesYear && matchesSearch;
    });
    
    // Sort by newest first
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return filtered;
  }, [activeCategory, searchTerm, selectedYear, transformedGalleries]);

  const handleFavorite = (gallery) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(gallery.id)) {
      newFavorites.delete(gallery.id);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(gallery.id);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  const handleViewGallery = (gallery) => {
    setSelectedGallery(gallery);
  };

  const handleDownload = (gallery) => {
    // Download all files function will be called from the modal
    setSelectedGallery(gallery);
  };

  const handleShare = (gallery) => {
    setGalleryToShare(gallery);
    setShareModalOpen(true);
  };

  const refreshData = async () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
      toast.success('Gallery refreshed!');
    }, 1000);
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
              sx={{ color: '#f1f5f9' }}
            />
            {/* Actual Animated Loader */}
            <CircularProgress
              variant="indeterminate"
              disableShrink
              size={64}
              thickness={4}
              sx={{
                color: '#2563eb',
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
              Loading School Gallery...
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              className="flex items-center gap-1"
            >
              Fetching memories and moments
            </Typography>
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Modern Hero Banner */}
        <ModernHeroBanner 
          stats={{
            totalFiles: stats[0].number,
            totalCategories: stats[2].number,
            thisMonth: transformedGalleries.length
          }} 
          onRefresh={refreshData}
        />

        {/* Dynamic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10">
          {stats.map((stat, index) => (
            <ModernStatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Galleries */}
          <div className="flex-1 min-w-0 space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-900 rounded-2xl shadow-lg">
                  <FiImage className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">School Galleries</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {filteredGalleries.length} Galleries Available
                  </p>
                </div>
              </div>
            </div>

            {/* Modern Search & Filter Section */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-3 rounded-[28px] shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative w-full flex-1 group">
                  <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm transition-all focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/5">
                    <div className="pl-5 pr-3 flex items-center justify-center pointer-events-none">
                      <FiSearch className="text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search galleries, categories, or years..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-4 bg-transparent text-slate-900 placeholder:text-slate-400 font-semibold text-sm focus:outline-none"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="pr-4 text-slate-400 hover:text-slate-600"
                      >
                        <FiX size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Selector */}
                <div className="relative w-full md:w-auto">
                  <select 
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full md:w-48 appearance-none px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-semibold text-slate-600 text-sm cursor-pointer focus:ring-2 focus:ring-purple-500/20 transition-all"
                  >
                    {categoryOptions.map((category) => {
                      const Icon = category.icon;
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Year Selector */}
                <div className="relative w-full md:w-auto">
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full md:w-36 appearance-none px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-semibold text-slate-600 text-sm cursor-pointer focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="all">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                    setSelectedYear('all');
                  }}
                  className="px-6 py-3.5 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-md shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <FiFilter size={16} />
                  Reset
                </button>
              </div>
            </div>

            {/* Modern Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
              {categoryOptions.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${
                      isActive 
                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {Icon && <Icon className={isActive ? "text-white" : "text-slate-400"} />}
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{filteredGalleries.length}</span> galleries found
              </div>
              <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-purple-50 text-purple-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <FiList />
                </button>
              </div>
            </div>

            {/* Galleries Grid/List */}
            <div className="relative">
              {filteredGalleries.length === 0 ? (
                <div className="bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 py-16 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <FiImage className="text-slate-300 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No galleries found</h3>
                  <p className="text-slate-500 text-sm mt-1 mb-6">Try adjusting your filters or search.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setActiveCategory('all'); setSelectedYear('all'); }}
                    className="px-6 py-2.5 bg-white border border-slate-200 rounded-full font-bold text-slate-700 hover:bg-slate-50 transition-all text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredGalleries.map((gallery, index) => (
                    <ModernGalleryCard 
                      key={gallery.id || index} 
                      gallery={gallery} 
                      onView={handleViewGallery}
                      onFavorite={handleFavorite}
                      onShare={handleShare}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Actions & Info */}
          <div className="lg:w-[380px] space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              
              {/* Quick Actions Card */}
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <FiZap className="text-purple-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                </div>

                <div className="space-y-3">


                  <button
                    onClick={() => {
                      const mostRecent = filteredGalleries[0];
                      if (mostRecent) {
                        handleViewGallery(mostRecent);
                      }
                    }}
                    className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center justify-between hover:bg-emerald-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-xl">
                        <FiEye className="text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold">Latest Gallery</p>
                        <p className="text-xs text-emerald-600">View most recent</p>
                      </div>
                    </div>
                    <FiArrowRight className="text-emerald-400" />
                  </button>

                  <button
                    onClick={() => toast.info('Favorites feature coming soon!')}
                    className="w-full p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 flex items-center justify-between hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-xl">
                        <FiHeart className="text-amber-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold">My Favorites</p>
                        <p className="text-xs text-amber-600">{favorites.size} saved</p>
                      </div>
                    </div>
                    <FiArrowRight className="text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Year Info Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-[32px] p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-blue-100 rounded-xl">
                    <FiCalendar className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Gallery Years</h4>
                    <p className="text-sm text-slate-600">Browse by year</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-slate-700">All Years</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600">{transformedGalleries.length}</span>
                  </div>
                  
                  {years.slice(0, 3).map(year => (
                    <div key={year} className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-medium text-slate-700">{year}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">
                        {transformedGalleries.filter(g => g.year === year).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidentiality Banner */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-[32px] p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-[50px]" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                    <FiLock className="text-white text-xl" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">School Memories</h4>
                  <p className="text-sm text-purple-200 mb-4">
                    Preserving our school's legacy through photos and videos.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>High quality media</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>Organized by category</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>Easy to download & share</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-800 rounded-3xl p-5 md:p-8 shadow-xl">
          {/* Abstract Background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-[80px] rounded-full -mr-24 -mt-24" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full -ml-24 -mb-24" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            
            {/* Icon */}
            <div className="shrink-0">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                <FiImage className="text-purple-600 text-2xl md:text-3xl" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                Preserving School History.
              </h3>
              <p className="text-purple-200 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
                Every photo tells a story. Explore decades of academic excellence, achievements, and memories.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {[
                  { label: 'High Quality', icon: FiStar, color: 'text-blue-300', bg: 'bg-blue-400/10' },
                  { label: 'Organized', icon: FiFolder, color: 'text-emerald-300', bg: 'bg-emerald-400/10' },
                  { label: 'Downloadable', icon: FiDownload, color: 'text-purple-300', bg: 'bg-purple-400/10' },
                  { label: 'Shareable', icon: FiShare2, color: 'text-pink-300', bg: 'bg-pink-400/10' }
                ].map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className={`p-1.5 rounded-md ${feature.bg} ${feature.color} shrink-0`}>
                      <feature.icon size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 truncate">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Detail Modal */}
      {selectedGallery && (
        <ModernGalleryDetailModal
          gallery={selectedGallery}
          onClose={() => setSelectedGallery(null)}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setGalleryToShare(null);
        }}
        gallery={galleryToShare}
      />
    </div>
  );
}