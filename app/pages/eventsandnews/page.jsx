'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiArrowRight,
  FiShare2,
  FiSearch,
  FiHeart,
  FiX,
  FiLink,
  FiPlus,
  FiFilter,
  FiRotateCw,
  FiEye,
  FiBookmark,
  FiChevronRight,
  FiChevronLeft,
  FiGrid,
  FiList,
  FiDownload,
  FiExternalLink,
  FiVideo,
  FiMusic,
  FiAward,
  FiTrendingUp,
  FiZap,
  FiGlobe,
  FiMessageCircle,
  FiCopy,
  FiBell
} from 'react-icons/fi';
import { 
  IoNewspaperOutline,
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
  IoShareOutline
} from 'react-icons/io5';

import { CircularProgress, Box, Typography, Stack } from '@mui/material';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegram, FaEnvelope } from 'react-icons/fa';

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

// Glass Card Component
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg shadow-black/5 ${className}`}>
    {children}
  </div>
);

// Modern Event Card with Enhanced Design
const ModernEventCard = ({ event, onView, onShare, onCalendar, onBookmark, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

const getCategoryStyle = (category) => {
  const styles = {
    academic: { 
      gradient: 'from-blue-500 to-cyan-500', 
      bg: 'bg-blue-50', 
      text: 'text-blue-700',
      border: 'border-blue-200', // Add this
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    cultural: { 
      gradient: 'from-purple-500 to-pink-500', 
      bg: 'bg-purple-50', 
      text: 'text-purple-700',
      border: 'border-purple-200', // Add this
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    sports: { 
      gradient: 'from-emerald-500 to-green-500', 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      border: 'border-emerald-200', // Add this
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    workshop: { 
      gradient: 'from-orange-500 to-amber-500', 
      bg: 'bg-orange-50', 
      text: 'text-orange-700',
      border: 'border-orange-200', // Add this
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  };
  return styles[category] || styles.academic;
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
      return 'TBD';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'All Day';
    return timeString;
  };

  const categoryStyle = getCategoryStyle(event.category);

// Modern Event Card - Grid View (Modernized & Static)
if (viewMode === 'grid') {
  const theme = getCategoryStyle(event.category);
  
  return (
    <div 
      onClick={() => onView(event)}
      className="relative bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden cursor-pointer"
    >
      {/* 1. Static Image Header */}
      <div className="relative h-52 w-full shrink-0">
        <img
          src={event.image || '/default-event.jpg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        
        {/* Permanent Badges (Top Left) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${theme.bg} ${theme.text} ${theme.border}`}>
            {event.category || 'Event'}
          </span>
          {event.featured && (
            <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <IoSparkles className="text-amber-400" /> Featured
            </span>
          )}
        </div>

        {/* Permanent Bookmark Button (Top Right) */}
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(event);
            }}
            className={`p-2.5 rounded-xl backdrop-blur-md border shadow-sm ${
              isBookmarked 
                ? 'bg-amber-500 border-amber-500 text-white' 
                : 'bg-white/90 border-white/10 text-slate-700'
            }`}
          >
            <FiBookmark className={isBookmarked ? 'fill-current' : ''} size={16} />
          </button>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
          {event.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
          {event.description || 'Join us for this upcoming school event and explore new opportunities.'}
        </p>

        {/* 3. Bento-Style Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className={`p-1.5 rounded-lg ${theme.iconBg}`}>
              <FiCalendar className={`${theme.iconColor}`} size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
              {formatDate(event.date)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className={`p-1.5 rounded-lg ${theme.iconBg}`}>
              <FiClock className={`${theme.iconColor}`} size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
              {event.time || 'TBD'}
            </span>
          </div>

          <div className="col-span-2 flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
            <div className={`p-1.5 rounded-lg ${theme.iconBg}`}>
              <FiMapPin className={`${theme.iconColor}`} size={14} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
              {event.location || 'Main Campus Hall'}
            </span>
          </div>
        </div>

        {/* 4. Final Action Button */}
        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          View Event Details
          <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

  // List View
  return (
    <div 
      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-5 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-blue-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(event)}
    >
      <div className="flex items-start gap-4">
        {/* Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={event.image || '/default-event.jpg'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-500"
          />
          {event.featured && (
            <div className="absolute top-1 right-1">
              <IoSparkles className="text-amber-500 w-3 h-3" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryStyle.gradient}`}>
                  {event.category || 'Event'}
                </span>
                {event.featured && (
                  <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                  onBookmark(event);
                }}
                className={`p-1.5 rounded-lg ${isBookmarked ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <FiBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(event);
                }}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <FiShare2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.description || 'Join us for an exciting event!'}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <FiCalendar className="text-blue-500 w-4 h-4" />
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="text-emerald-500 w-4 h-4" />
              <span className="font-medium">{formatTime(event.time)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiMapPin className="text-rose-500 w-4 h-4" />
              <span className="font-medium truncate max-w-[120px]">{event.location || 'TBD'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern News Card
const ModernNewsCard = ({ news, onView, onShare, onBookmark, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

const getCategoryStyle = (category) => {
  const styles = {
    achievement: { 
      gradient: 'from-emerald-500 to-green-500', 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      border: 'border-emerald-200', // Add this
      icon: <FiAward className="w-4 h-4" />
    },
    announcement: { 
      gradient: 'from-blue-500 to-cyan-500', 
      bg: 'bg-blue-50', 
      text: 'text-blue-700',
      border: 'border-blue-200', // Add this
      icon: <FiBell className="w-4 h-4" />
    },
    development: { 
      gradient: 'from-purple-500 to-pink-500', 
      bg: 'bg-purple-50', 
      text: 'text-purple-700',
      border: 'border-purple-200', // Add this
      icon: <FiTrendingUp className="w-4 h-4" />
    },
    sports: { 
      gradient: 'from-orange-500 to-amber-500', 
      bg: 'bg-orange-50', 
      text: 'text-orange-700',
      border: 'border-orange-200', // Add this
      icon: <FiZap className="w-4 h-4" />
    }
  };
  return styles[category] || styles.announcement;
};

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Yesterday';
      if (diff < 7) return `${diff} days ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const categoryStyle = getCategoryStyle(news.category);

if (viewMode === 'grid') {
  const theme = getCategoryStyle(news.category);
  
  return (
    <div 
      onClick={() => onView(news)}
      className="flex flex-col bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden cursor-pointer"
    >
      {/* 1. Full-Bleed Image Section */}
      <div className="relative h-48 w-full shrink-0">
        <img
          src={news.image || '/default-news.jpg'}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        
        {/* Static Category Tag (Top Left) */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${theme.bg} ${theme.text} ${theme.border}`}>
            {news.category || 'Announcement'}
          </span>
        </div>

        {/* Static Bookmark (Top Right) */}
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(news);
            }}
            className="p-2.5 rounded-xl backdrop-blur-md bg-white/90 border border-white/20 text-slate-700 shadow-sm"
          >
            <FiBookmark size={16} />
          </button>
        </div>

        {/* Gradient Scrim for Date (Bottom) */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            Published {formatDate(news.date)}
          </span>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight tracking-tight">
          {news.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
          {news.excerpt || news.description || 'Explore the latest updates and stories from our school community.'}
        </p>

        {/* 3. Author & Social Bar */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black">{news.author?.charAt(0) || 'A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-900 leading-none mb-0.5">
                {news.author || 'School Admin'}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Contributor</span>
            </div>
          </div>

          {/* Static Engagement Icon */}
          <div className="flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
            <FiHeart className="text-rose-500" size={12} />
            <span className="text-[11px] font-bold text-slate-600">{news.likes || 0}</span>
          </div>
        </div>

        {/* 4. Action Button */}
        <button className="mt-5 w-full py-3.5 bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-slate-100 active:bg-slate-100 transition-colors">
          Read Full Story
          <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

  // List View
// Modernized News Card (Static & Responsive)
return (
  <div 
    onClick={() => onView(news)}
    className="relative bg-white rounded-[24px] border border-slate-100 p-4 shadow-sm cursor-pointer transition-colors active:bg-slate-50"
  >
    <div className="flex gap-5">
      
      {/* 1. Image Container - Static & Sharp */}
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm">
        <img
          src={news.image || '/default-news.jpg'}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay to make image feel premium */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl"></div>
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
                {news.category || 'Insights'}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {formatDate(news.date)}
              </span>
            </div>
            
            {/* Action Buttons - Always visible but subtle */}
            <div className="flex items-center gap-1">
               <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(news);
                }}
                className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'}`}
              >
                <FiBookmark className={isBookmarked ? 'fill-current' : ''} size={14} />
              </button>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
            {news.title}
          </h3>
        </div>

        {/* 3. Footer: Author & Interaction */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center border border-white shadow-sm shrink-0">
              <span className="text-[10px] text-white font-black leading-none">
                {news.author?.charAt(0) || 'S'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-600 truncate max-w-[100px]">
              {news.author || 'School Admin'}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-blue-600 font-bold text-[11px] uppercase tracking-wider">
            Read More
            <FiArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

// Modern Share Modal
const ModernShareModal = ({ item, type = 'event', onClose }) => {
  const [copied, setCopied] = useState(false);

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: () => {
        const text = `${item.title}\n\n${type === 'event' ? '🎉 Event Details:' : '📰 News:'}\n${item.description}\n\n${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-sky-500',
      hoverColor: 'hover:bg-sky-600',
      action: () => {
        const text = `${item.title} - Check out this ${type === 'event' ? 'event' : 'news'}!`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      action: () => {
        const text = `${item.title}\n\n${item.description}`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700',
      action: () => {
        const subject = `${item.title} - ${type === 'event' ? 'Event' : 'News'}`;
        const body = `${item.description}\n\n${window.location.href}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getShareTitle = () => {
    return type === 'event' ? 'Share Event' : 'Share News';
  };

  return (
<ModernModal open={true} onClose={onClose} maxWidth="480px">
  {/* 1. Refined Header */}
  <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
    {/* Background Detail */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
    
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/10">
        <IoShareSocialOutline className="text-2xl text-white" />
      </div>
      <h2 className="text-2xl font-black tracking-tight">{getShareTitle()}</h2>
      <p className="text-slate-400 text-sm mt-1">
        Invite others to join the conversation
      </p>
    </div>
  </div>

  {/* 2. Content Area */}
  <div className="p-8 bg-white">
    {/* Social Platforms - Clean Grid */}
    <div className="grid grid-cols-4 gap-4 mb-8">
      {socialPlatforms.map((platform, index) => {
        const Icon = platform.icon;
        return (
          <button
            key={index}
            onClick={platform.action}
            className="flex flex-col items-center gap-2 group"
          >
            {/* Minimalist Icon Circle */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors bg-slate-50 text-slate-600 border border-slate-100 active:bg-slate-200`}>
              <Icon className="text-xl" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {platform.name}
            </span>
          </button>
        );
      })}
    </div>

    {/* 3. Modern Copy Section */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Direct Access Link
        </label>
      </div>
      
      <div className="relative group">
        <div className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 pr-32">
          <p className="text-xs font-mono text-slate-500 truncate">
            {window.location.href}
          </p>
        </div>
        
        <button
          onClick={copyToClipboard}
          className={`absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 ${
            copied 
            ? 'bg-emerald-500 text-white' 
            : 'bg-slate-900 text-white active:scale-95'
          }`}
        >
          {copied ? (
            <>Done!</>
          ) : (
            <>
              <FiCopy /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  </div>
</ModernModal>
  );
};



const ModernDetailModal = ({ item, type = 'event', onClose, onAddToCalendar, onShare }) => {
  if (!item) return null;

  const formatFullDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return dateString || 'Date not set'; }
  };

return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Close Button - Floating & Premium */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90"
        >
          <IoClose size={20}  />
        </button>

        {/* 1. Full-Bleed Hero Image */}
        <div className="relative h-[30vh] sm:h-[350px] w-full shrink-0">
          <img
            src={item.image || (type === 'event' ? '/default-event.jpg' : '/default-news.jpg')}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          
          {/* Badge Overlays */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex gap-2">
            <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white shadow-xl rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-blue-600">
              {item.category || type}
            </span>
            {item.featured && (
              <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-slate-900 text-white rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest flex items-center gap-1">
                <IoSparkles className="text-amber-400 w-3 h-3 sm:w-4 sm:h-4" /> 
                <span className="hidden sm:inline">Featured</span>
                <span className="sm:hidden">★</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 custom-scrollbar bg-white">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Title & Metadata */}
            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {item.title}
              </h2>
              
              {/* Quick Info Bar */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-2 sm:gap-y-3 gap-x-6 text-xs sm:text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <IoCalendarClearOutline className="text-blue-500 text-base sm:text-lg" />
                  {formatFullDate(item.date)}
                </div>
                {type === 'event' && item.location && (
                  <div className="flex items-center gap-2">
                    <IoLocationOutline className="text-rose-500 text-base sm:text-lg" />
                    {item.location}
                  </div>
                )}
                {type === 'news' && (
                  <div className="flex items-center gap-2">
                    <IoPersonOutline className="text-purple-500 text-base sm:text-lg" />
                    By {item.author || 'School Admin'}
                  </div>
                )}
              </div>
            </section>

            {/* Description Block */}
            <section className="space-y-3 sm:space-y-4">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">
                About this {type}
              </h3>
              <div className="text-slate-700 leading-relaxed text-sm sm:text-base md:text-lg">
                {item.description || item.excerpt || 'No description available.'}
              </div>
              
              {/* If news has full content, show it here without tabs */}
              {type === 'news' && item.fullContent && (
                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 text-slate-600 text-xs sm:text-sm md:text-base whitespace-pre-line italic">
                  {item.fullContent}
                </div>
              )}
            </section>

            {/* Event Specific Specs (Stats grid style) */}
            {type === 'event' && (
              <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4">
                <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100">
                  <IoTimeOutline className="text-blue-600 mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Time</p>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm md:text-base truncate">{item.time || 'All Day'}</p>
                </div>
                <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100">
                  <IoPersonOutline className="text-purple-600 mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Attendees</p>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm md:text-base truncate">{item.attendees || 'Open'}</p>
                </div>
                {item.speaker && (
                  <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 col-span-2 sm:col-span-1">
                    <IoSparkles className="text-amber-500 mb-1 sm:mb-2 w-4 h-4 sm:w-5 sm:h-5" />
                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Special Guest</p>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm md:text-base truncate">{item.speaker}</p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>

{/* 3. Action Footer - Sticky at bottom */}
<div className="shrink-0 p-4 sm:p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100">
  <div className="max-w-2xl mx-auto flex flex-row items-center gap-2 sm:gap-3">
    {type === 'event' ? (
      <button
        onClick={onAddToCalendar}
        className="flex-[2] min-w-0 h-11 sm:h-14 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
      >
        <IoCalendarClearOutline size={16} className="shrink-0 sm:size-[20px]" />
        <span className="truncate">Add to Calendar</span>
      </button>
    ) : (
      <button
        className="flex-[2] min-w-0 h-11 sm:h-14 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        onClick={onClose}
      >
        <IoNewspaperOutline size={16} className="shrink-0 sm:size-[20px]" />
        <span className="truncate">See articles</span>
      </button>
    )}
    
    <button
      onClick={onShare}
      className="flex-1 min-w-0 h-11 sm:h-14 bg-white border-2 border-slate-200 text-slate-900 rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
    >
      <IoShareOutline size={16} className="shrink-0 sm:size-[20px]" />
      <span className="truncate">Share</span>
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

// Modern Pagination Component
const ModernPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }
      
      if (start > 2) pages.push('...');
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (end < totalPages - 1) pages.push('...');
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-gray-200">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
              page === '...'
                ? 'text-gray-500'
                : currentPage === page
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Main Component
export default function ModernEventsNewsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());
  const [bookmarkedNews, setBookmarkedNews] = useState(new Set());
  const itemsPerPage = 9;

  // Categories
  const categories = [
    { id: 'all', name: 'All Events', icon: IoCalendarClearOutline, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'academic', name: 'Academic', icon: IoNewspaperOutline, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { id: 'cultural', name: 'Cultural', icon: FiMusic, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'sports', name: 'Sports', icon: FiTrendingUp, color: 'bg-gradient-to-r from-emerald-500 to-green-500' },
    { id: 'workshop', name: 'Workshops', icon: FiZap, color: 'bg-gradient-to-r from-orange-500 to-amber-500' }
  ];

  // Stats data
  const stats = [
    { 
      icon: IoCalendarClearOutline, 
      number: '15+', 
      label: 'Upcoming Events', 
      sublabel: 'This month',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: IoNewspaperOutline, 
      number: '8+', 
      label: 'News Articles', 
      sublabel: 'Latest updates',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      icon: IoRibbonOutline, 
      number: '5', 
      label: 'Featured', 
      sublabel: 'Highlights',
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      icon: IoPeopleCircle, 
      number: '100%', 
      label: 'Engagement', 
      sublabel: 'Community',
      gradient: 'from-emerald-500 to-green-500'
    }
  ];

  // Fetch data from APIs
  const fetchEvents = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEventsData(data.events || getSampleEvents());
        if (showRefresh) toast.success('Events refreshed!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setEventsData(getSampleEvents());
    } finally {
      if (showRefresh) setRefreshing(false);
    }
  };

const fetchNews = async (showRefresh = false) => {
  try {
    const response = await fetch('/api/news');
    const data = await response.json();
    
    // FIX HERE: Use data.data instead of data.news
    if (data.success && Array.isArray(data.data)) {
      setNewsData(data.data || getSampleNews());
      if (showRefresh) toast.success('News refreshed!');
    } else if (data.success && Array.isArray(data.news)) {
      // Fallback to data.news if data.data doesn't exist
      setNewsData(data.news || getSampleNews());
      if (showRefresh) toast.success('News refreshed!');
    } else {
      throw new Error(data.error || 'Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    toast.error('Failed to load news');
    setNewsData(getSampleNews());
  }
};

  const fetchData = async (showRefresh = false) => {
    if (!showRefresh) setLoading(true);
    try {
      await Promise.all([fetchEvents(showRefresh), fetchNews(showRefresh)]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (!showRefresh) setLoading(false);
    }
  };




  useEffect(() => {
    fetchData();
  }, []);

  // Filter events
  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || event.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const filteredNews = newsData.filter(news => {
    return searchTerm === '' || 
      news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCalendar = (event) => {
    try {
      const startDate = new Date(event.date);
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
      window.open(googleCalendarUrl, '_blank');
      toast.success('Added to Google Calendar');
    } catch (error) {
      toast.error('Failed to add to calendar');
    }
  };

  const handleBookmarkEvent = (event) => {
    const newBookmarked = new Set(bookmarkedEvents);
    if (newBookmarked.has(event.id)) {
      newBookmarked.delete(event.id);
      toast.success('Removed from bookmarks');
    } else {
      newBookmarked.add(event.id);
      toast.success('Bookmarked event');
    }
    setBookmarkedEvents(newBookmarked);
  };

  const handleBookmarkNews = (news) => {
    const newBookmarked = new Set(bookmarkedNews);
    if (newBookmarked.has(news.id)) {
      newBookmarked.delete(news.id);
      toast.success('Removed from bookmarks');
    } else {
      newBookmarked.add(news.id);
      toast.success('Bookmarked news');
    }
    setBookmarkedNews(newBookmarked);
  };

  const refreshData = () => {
    fetchData(true)
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
Loading for our school latest news and events to stay updated
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            className="flex items-center gap-1"
          >
            Fetching latest events & news
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
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-3">
              <IoSparkles className="text-blue-500" />
              <span className="text-blue-700 font-bold text-sm uppercase tracking-wider">
                Latest Updates
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-2">
              School <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Events & News</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl">
              Stay updated with our latest happenings, achievements, and announcements
            </p>
          </div>
          
          <div className="flex items-center gap-3">

<button
  onClick={refreshData}
  disabled={refreshing}
  className="
    inline-flex items-center gap-2
    px-4 sm:px-5
    py-2.5 sm:py-3
    rounded-xl
    bg-white text-slate-700
    border border-slate-200
    font-medium text-sm sm:text-base
    shadow-sm
    transition-all duration-300
    hover:shadow-md
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  {refreshing && (
    <CircularProgress
      size={18}
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

            <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-10">
  {stats.map((stat, index) => {
    const Icon = stat.icon;
    
    return (
      <div 
        key={index} 
        className="relative flex flex-col justify-between overflow-hidden bg-white border border-slate-100 p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm"
      >
        {/* Top Section: Icon & Badge */}
        <div className="flex items-start justify-between mb-4 md:mb-8">
          <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.gradient} bg-opacity-[0.08] text-slate-700`}>
            {/* Responsive Icon size: Smaller on mobile, larger on desktop */}
            <Icon className="text-lg md:text-2xl" />
          </div>
          
          {/* Status Dot (Hidden on very small screens to save space) */}
          <div className="hidden xs:block h-2 w-2 rounded-full bg-slate-200" />
        </div>

        {/* Content Section */}
        <div className="space-y-1">
          {/* Label: Smaller text on mobile */}
          <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {stat.label}
          </p>
          
          <div className="flex items-baseline gap-1">
            {/* Number: Responsive font sizes */}
            <h3 className="text-xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              {stat.number}
            </h3>
          </div>

          {/* Sublabel: Truncate on mobile to prevent layout breaking */}
          <p className="text-[10px] md:text-sm font-medium text-slate-500 leading-tight line-clamp-1 md:line-clamp-none">
            {stat.sublabel}
          </p>
        </div>

        {/* Decorative Background Element (Desktop only for cleanliness) */}
        <div className={`absolute -bottom-2 -right-2 w-12 h-12 md:w-20 md:h-20 opacity-[0.03] rounded-full bg-gradient-to-br ${stat.gradient} hidden md:block`} />
      </div>
    );
  })}
</div>

<div className="relative mb-6 sm:mb-8">
  {/* The Main Container: Switched from GlassCard to a cleaner, floating bar aesthetic */}
  <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-2 sm:p-3 rounded-2xl sm:rounded-[28px] md:rounded-full shadow-lg shadow-slate-200/40">
    <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3">
      
      {/* Modernized Search Section */}
      <div className="relative w-full flex-1 group">
        {/* The Search Container */}
        <div className="relative flex items-center bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm transition-all focus-within:border-slate-900 focus-within:ring-2 sm:focus-within:ring-4 focus-within:ring-slate-900/5">
          
          {/* Search Icon - Always Static */}
          <div className="pl-3 sm:pl-4 md:pl-5 pr-2 sm:pr-3 flex items-center justify-center pointer-events-none">
            <FiSearch className="text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16}  />
          </div>

          <input
            type="text"
            placeholder="Search events, news, or resources..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-3 sm:py-4 bg-transparent text-slate-900 placeholder:text-slate-400 font-medium sm:font-semibold text-sm focus:outline-none placeholder:text-xs sm:placeholder:text-sm"
          />

          {/* Dynamic Action Area */}
          <div className="pr-2 flex items-center gap-1 sm:gap-2">
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1.5 sm:p-2 bg-slate-100 text-slate-900 rounded-lg sm:rounded-xl active:scale-90 transition-transform"
              >
                <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            ) : (
              /* Subtle "Command K" style hint for Desktop */
              <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Search</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Stacked on mobile, Inline on desktop */}
      <div className="flex items-center w-full md:w-auto gap-2 sm:gap-3 border-t border-slate-100 md:border-t-0 md:border-l md:border-slate-100 pt-2 sm:pt-3 md:pt-0 md:pl-3">
        
        {/* Category Selector: Styled as a modern button-menu */}
        <div className="relative flex-1 md:flex-none min-w-0">
          <select 
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-40 appearance-none px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3 bg-slate-50 md:bg-transparent border-none rounded-xl sm:rounded-2xl md:rounded-full font-medium sm:font-semibold text-slate-600 text-xs sm:text-sm cursor-pointer focus:ring-1 sm:focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {/* Custom Chevron for a cleaner look */}
          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Reset Button: Minimalist Icon on mobile, Label on desktop */}
        <button
          onClick={() => {
            setSearchTerm('');
            setActiveTab('all');
            setCurrentPage(1);
          }}
          className="p-2.5 sm:p-3 md:px-6 md:py-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl md:rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 sm:gap-2 flex-shrink-0"
          title="Reset Filters"
        >
          <FiFilter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden md:inline">Reset</span>
          <span className="md:hidden text-[10px] font-bold">Clear</span>
        </button>
      </div>
    </div>
  </div>
</div>

    {/* Main Content Layout */}
<div className="flex flex-col lg:flex-row gap-8">
  
  {/* Left Column: Events (The main feed) */}
  <div className="flex-1 min-w-0 space-y-8">
    
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-900 rounded-2xl shadow-lg">
          <IoCalendarClearOutline className="text-white text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Upcoming Events</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filteredEvents?.length || 0} Discoveries Found
          </p>
        </div>
      </div>
    </div>

    {/* Modern Category Pills - Responsive Scroll */}
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeTab === category.id;
        return (
          <button
            key={category.id}
            onClick={() => { setActiveTab(category.id); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${
              isActive 
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {Icon && <Icon className={isActive ? "text-white" : "text-slate-400"} />}
            {category.name}
          </button>
        );
      })}
    </div>

    {/* Events Feed */}
    <div className="relative">
      {!paginatedEvents || paginatedEvents.length === 0 ? (
        <div className="bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 py-16 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <IoCalendarClearOutline className="text-slate-300 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No events found</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">Try adjusting your filters or search.</p>
          <button 
            onClick={() => { setSearchTerm(''); setActiveTab('all'); }}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-full font-bold text-slate-700 hover:bg-slate-50 transition-all text-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
          {paginatedEvents.map((event, index) => (
            <ModernEventCard 
              key={event.id || index} 
              event={event} 
              onView={setSelectedEvent}
              onBookmark={handleBookmarkEvent}
            />
          ))}
        </div>
      )}
    </div>

    {totalPages > 1 && (
      <ModernPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    )}
  </div>

  {/* Right Column: News & Insights (Fixed width on desktop) */}
  <div className="lg:w-[380px] space-y-6">
    <div className="lg:sticky lg:top-24 space-y-6">
      
      {/* News Sidebar Card */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <IoNewspaperOutline className="text-purple-600 text-xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Latest News</h2>
        </div>

        <div className="space-y-5">
          {filteredNews?.slice(0, 4).map((news, index) => (
            <ModernNewsCard 
              key={news.id || index} 
              news={news} 
              onView={setSelectedNews}
             onBookmark={handleBookmarkNews}  // Add this line
               onShare={() => {
    setSelectedNews(news);
    setShowShareModal(true);
  }}

            />
          ))}
        </div>
      </div>

      {/* Analytics "Bento" Stats */}
      <div className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 blur-[50px]" />
        <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Stats At A Glance</h4>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div>
            <p className="text-2xl font-bold">{eventsData?.length || 0}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Events</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{newsData?.length || 0}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Articles</p>
          </div>
          <div className="col-span-2 pt-2 border-t border-slate-800">
            <p className="text-sm font-bold text-blue-400">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Last Updated</p>
          </div>
        </div>
      </div>


    </div>
  </div>
</div>

<div className="relative overflow-hidden bg-slate-900 rounded-3xl p-5 md:p-8 shadow-xl">
  {/* Abstract Background Decoration - Reduced Opacity for better text legibility when zoomed */}
  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full -mr-24 -mt-24" />
  <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 blur-[80px] rounded-full -ml-24 -mb-24" />

  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
    
    {/* Left Side: Scaled down Icon */}
    <div className="shrink-0">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg">
        <FiMessageCircle className="text-slate-900 text-2xl md:text-3xl" />
      </div>
    </div>

    {/* Right Side: Main Content */}
    <div className="flex-1 text-center md:text-left">
      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
        Stay Connected.
      </h3>
      <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
        The hub for school updates. Sync schedules, collaborate, and stay on track.
      </p>

      {/* Feature Grid - Compact & Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {[
          { label: 'Sharing', icon: FiShare2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Sync', icon: FiCalendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Save', icon: FiBookmark, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Alerts', icon: FiBell, color: 'text-purple-400', bg: 'bg-purple-400/10' }
        ].map((feature, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
          >
            <div className={`p-1.5 rounded-md ${feature.bg} ${feature.color} shrink-0`}>
              <feature.icon size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 truncate">
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

      </div>

      {/* Event Detail Modal */}
      {selectedEvent && !showShareModal && (
        <ModernDetailModal
          item={selectedEvent}
          type="event"
          onClose={() => setSelectedEvent(null)}
          onAddToCalendar={() => handleAddToCalendar(selectedEvent)}
          onShare={() => {
            setShowShareModal(true);
          }}
        />
      )}

      {/* News Detail Modal */}
      {selectedNews && !showShareModal && (
        <ModernDetailModal
          item={selectedNews}
          type="news"
          onClose={() => setSelectedNews(null)}
          onAddToCalendar={() => {}}
          onShare={() => {
            setShowShareModal(true);
          }}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (selectedEvent || selectedNews) && (
        <ModernShareModal
          item={selectedEvent || selectedNews}
          type={selectedEvent ? 'event' : 'news'}
          onClose={() => {
            setShowShareModal(false);
            setSelectedEvent(null);
            setSelectedNews(null);
          }}
        />
      )}
    </div>
  );
}