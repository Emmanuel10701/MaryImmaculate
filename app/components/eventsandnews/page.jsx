'use client';

import React, { useState, useEffect } from 'react';

// Feather Icons (Consolidated)
import { 
  FiAlertCircle,
  FiAlertTriangle,
  FiAward,
  FiBell,
  FiBook,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEdit,
  FiEye,
  FiGlobe,
  FiImage,
  FiInfo, 
  FiMapPin,
  FiPlus, 
  FiRotateCw,
  FiSearch, 
  FiShare2,
  FiStar,
  FiTag,
  FiTrash2,
  FiTrendingUp,
  FiUpload,
  FiUser,
  FiUsers,
  FiX,
  FiZap
} from 'react-icons/fi';

// IonIcons (Consolidated)
import { 
  IoNewspaperOutline, 
  IoCalendarClearOutline 
} from 'react-icons/io5';

// Material UI (Consolidated)
import { Modal, Box, CircularProgress } from '@mui/material';

// Modern Loading Spinner Component
const Spinner = ({ size = 40, color = 'inherit', thickness = 3.6, variant = 'indeterminate', value = 0 }) => {
  return (
    <div className="inline-flex items-center justify-center">
      <svg 
        className={`animate-spin ${variant === 'indeterminate' ? '' : ''}`} 
        width={size} 
        height={size} 
        viewBox="0 0 44 44"
      >
        {variant === 'determinate' ? (
          <>
            <circle 
              className="text-gray-200" 
              stroke="currentColor" 
              strokeWidth={thickness} 
              fill="none" 
              cx="22" 
              cy="22" 
              r="20"
            />
            <circle 
              className="text-blue-600" 
              stroke="currentColor" 
              strokeWidth={thickness} 
              strokeLinecap="round" 
              fill="none" 
              cx="22" 
              cy="22" 
              r="20" 
              strokeDasharray="125.6" 
              strokeDashoffset={125.6 - (125.6 * value) / 100}
              transform="rotate(-90 22 22)"
            />
          </>
        ) : (
          <circle 
            className="text-blue-600" 
            stroke="currentColor" 
            strokeWidth={thickness} 
            strokeLinecap="round" 
            fill="none" 
            cx="22" 
            cy="22" 
            r="20" 
            strokeDasharray="30 100"
          />
        )}
      </svg>
    </div>
  );
};

// Delete Confirmation Modal (Matching Staff Style)
function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  type = 'single',
  itemName = '',
  itemType = 'item',
  loading = false 
}) {
  return (
    <Modal open={open} onClose={loading ? undefined : onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '500px',
        bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #fef3f7 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiAlertTriangle className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Confirm Deletion</h2>
                <p className="text-red-100 opacity-90 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
            {!loading && (
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl cursor-pointer">
                <FiX className="text-xl" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <FiAlertTriangle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete "{itemName}"?
              </h3>
              <p className="text-gray-600">
                This {itemType} will be permanently deleted. All associated data will be removed.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">
                <span className="font-bold">Warning:</span> This action cannot be undone. Please make sure you want to proceed.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            
            <button 
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <CircularProgress size={16} className="text-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 />
                  Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                </>
              )}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

// Notification Component (Matching Staff Style)
function Notification({ 
  open, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  duration = 5000 
}) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (open) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (elapsed >= duration) {
          clearInterval(interval);
          onClose();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [open, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          iconBg: 'bg-green-100',
          progress: 'bg-green-500',
          title: 'text-green-800'
        };
      case 'error':
        return {
          bg: 'from-red-50 to-orange-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          iconBg: 'bg-red-100',
          progress: 'bg-red-500',
          title: 'text-red-800'
        };
      case 'warning':
        return {
          bg: 'from-yellow-50 to-orange-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          progress: 'bg-yellow-500',
          title: 'text-yellow-800'
        };
      case 'info':
        return {
          bg: 'from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
          progress: 'bg-blue-500',
          title: 'text-blue-800'
        };
      default:
        return {
          bg: 'from-gray-50 to-gray-100',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          iconBg: 'bg-gray-100',
          progress: 'bg-gray-500',
          title: 'text-gray-800'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <FiCheckCircle className="text-xl" />;
      case 'error': return <FiAlertCircle className="text-xl" />;
      case 'warning': return <FiAlertTriangle className="text-xl" />;
      case 'info': return <FiInfo className="text-xl" />;
      default: return <FiInfo className="text-xl" />;
    }
  };

  const styles = getTypeStyles();

  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md animate-slide-in">
      <div className={`bg-gradient-to-r ${styles.bg} border-2 ${styles.border} rounded-2xl shadow-xl overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 ${styles.iconBg} rounded-xl ${styles.icon}`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <h4 className={`font-bold ${styles.title} mb-1`}>{title}</h4>
              <p className="text-gray-700 text-sm">{message}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-200 hover:bg-opacity-50 rounded-lg cursor-pointer text-gray-500"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-200">
          <div 
            className={`h-full ${styles.progress} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Clean View Detail Modal Component
function ModernItemDetailModal({ item, type, onClose, onEdit }) {
  if (!item) return null;

  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
      return type === 'news' ? '/default-news.jpg' : '/default-event.jpg';
    }
    if (imagePath.startsWith('http') || imagePath.startsWith('/') || imagePath.startsWith('data:image')) {
      return imagePath;
    }
    return `/${imagePath}`;
  };

  const themeGradient = type === 'news' 
    ? 'from-purple-700 via-pink-600 to-rose-600' 
    : 'from-blue-700 via-cyan-600 to-teal-600';

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95%', maxWidth: '900px', maxHeight: '95vh',
        bgcolor: '#ffffff', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden', outline: 'none'
      }}>
        
        {/* Header - Matching Create Modal */}
        <div className={`p-8 text-white bg-gradient-to-r ${themeGradient}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl">
                {type === 'news' ? <IoNewspaperOutline size={32} /> : <IoCalendarClearOutline size={32} />}
              </div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                  {item.title}
                </h2>
                <p className="text-white/80 font-bold text-xs mt-1 tracking-widest uppercase">
                  {type === 'news' ? 'News Article Details' : 'Event Details'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-black/10 hover:bg-black/20 rounded-full transition-all active:scale-90">
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(95vh-160px)] overflow-y-auto bg-slate-50/50">
          <div className="p-8 sm:p-12 space-y-8">
            
            {/* Hero Section with Image */}
            <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-200">
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = type === 'news' ? '/default-news.jpg' : '/default-event.jpg';
                }}
              />
              {item.featured && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  Featured
                </div>
              )}
            </div>

            {/* Details Grid - Clean Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Category</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">{item.category}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Date</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  {type === 'news' && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Author</span>
                      <p className="text-sm font-bold text-slate-800 mt-1">{item.author}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Specific Info or Status */}
              {type === 'events' ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Event Details</h3>
                  <div className="space-y-4">
                    {item.time && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Time</span>
                        <p className="text-sm font-bold text-slate-800 mt-1">{item.time}</p>
                      </div>
                    )}
                    {item.location && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Location</span>
                        <p className="text-sm font-bold text-slate-800 mt-1">{item.location}</p>
                      </div>
                    )}
                    {item.speaker && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Speaker</span>
                        <p className="text-sm font-bold text-slate-800 mt-1">{item.speaker}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Status</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Status</span>
                      <p className="text-sm font-bold text-slate-800 mt-1">{item.status || 'Published'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

      {/* Description - Updated to prioritize excerpt since API doesn't have 'description' */}
<div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
  <div className="p-8 bg-slate-50/50">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-4 bg-purple-500 rounded-full" />
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
        Quick Summary
      </h3>
    </div>
    <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line italic">
      "{item.excerpt || 'No summary available.'}"
    </p>
  </div>

  {/* Visual Divider */}
  <div className="border-t border-dashed border-slate-200" />

  {/* Full Content Section */}
  {type === 'news' && item.fullContent && (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-4 bg-blue-500 rounded-full" />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
          Full Content
        </h3>
      </div>
      <div className="text-slate-700 leading-relaxed whitespace-pre-line">
        {item.fullContent}
      </div>
    </div>
  )}
</div>

    {/* Action Buttons */}
<div className="flex items-center justify-between pt-8 border-t border-slate-100">
  <button 
    onClick={onClose} 
    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm active:bg-slate-200 transition-colors"
  >
    Close
  </button>
  
  <div className="flex items-center gap-3">
    <button 
      onClick={onClose} 
      className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm active:bg-slate-200 transition-colors"
    >
      Back to List
    </button>
    
    <button 
      onClick={() => {
        onClose();      // First: Close the view modal
        onEdit(item);   // Second: Trigger the edit logic
      }} 
      /* Removed hover:brightness-110 per previous preference */
      className={`px-6 py-3 text-white rounded-2xl font-bold text-sm shadow-lg active:scale-95 bg-gradient-to-r ${themeGradient}`}
    >
      <div className="flex items-center gap-2">
        <FiEdit /> Edit {type === 'news' ? 'Article' : 'Event'}
      </div>
    </button>
  </div>
</div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
// Modern Item Card Component with better data handling
function ModernItemCard({ item, type, onEdit, onDelete, onView }) {
  const [imageError, setImageError] = useState(false)

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
      return type === 'news' ? '/default-news.jpg' : '/default-event.jpg';
    }
    
    // Handle Cloudinary URLs
    if (imagePath.includes('cloudinary.com')) {
      return imagePath;
    }
    
    // Handle local paths
    if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Handle base64 images
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // Default fallback
    return type === 'news' ? '/default-news.jpg' : '/default-event.jpg';
  };

  // Safely get item properties with fallbacks
  const itemData = {
    id: item?.id || '',
    title: item?.title || 'Untitled',
    excerpt: item?.excerpt || item?.description || 'No description available.',
    description: item?.description || item?.excerpt || '',
    date: item?.date || new Date().toISOString(),
    category: item?.category || (type === 'news' ? 'general' : 'academic'),
    author: item?.author || 'School Admin',
    image: item?.image || '',
    featured: item?.featured || false,
    time: item?.time || '',
    location: item?.location || '',
    speaker: item?.speaker || '',
    attendees: item?.attendees || 'students'
  };

  const categories = {
    news: {
      'achievement': { label: 'Achievements', color: 'emerald' },
      'sports': { label: 'Sports', color: 'blue' },
      'academic': { label: 'Academic', color: 'purple' },
      'infrastructure': { label: 'Infrastructure', color: 'orange' },
      'community': { label: 'Community', color: 'rose' },
      'general': { label: 'General', color: 'gray' }
    },
    events: {
      'academic': { label: 'Academic', color: 'purple' },
      'sports': { label: 'Sports', color: 'blue' },
      'cultural': { label: 'Cultural', color: 'emerald' },
      'social': { label: 'Social', color: 'orange' },
      'general': { label: 'General', color: 'gray' }
    }
  };

  const categoryInfo = categories[type][itemData.category] || categories[type]['general'];
  const imageUrl = getImageUrl(itemData.image);

  // Rest of your ModernItemCard component remains the same...
  // Just replace all references to `item` with `itemData`
  
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 w-full max-w-md overflow-hidden transition-none">
  {/* Image Section */}
<div className="relative h-64 w-full bg-gray-50 overflow-hidden">
  {!imageError ? (
    <img
      src={getImageUrl(item.image)}
      alt={item.title}
      /* Cleaned up classes: removed fixed width/height and internal rounding */
      className="w-full h-full object-cover shadow-2xl transition-transform duration-500 hover:scale-[1.05]"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = type === 'news' ? '/default-news.jpg' : '/default-event.jpg';
      }}
    />
  ) : (
    <div 
      onClick={() => onView(itemData)} 
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 cursor-pointer"
    >
      {type === 'news' ? (
        <IoNewspaperOutline className="text-5xl mb-3" />
      ) : (
        <IoCalendarClearOutline className="text-5xl mb-3" />
      )}
      <span className="text-sm font-medium">No Image</span>
    </div>
  )}

{/* Overlay: Category & Featured - ONLY for Events */}
<div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm pointer-events-auto">
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
      categoryInfo ? `bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800 border border-${categoryInfo.color}-200` : 'bg-gray-100 text-gray-800 border border-gray-200'
    }`}>
      {categoryInfo?.label || itemData.category}
    </span>
  </div>
  
  {/* ✅ Featured badge ONLY for Events */}
  {type === 'events' && itemData.featured && (
    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-yellow-200 pointer-events-auto">
      Featured
    </span>
  )}
</div>
</div>

      {/* Information Section */}
      <div className="p-6">
        <div className="mb-6">
          <h3 
            onClick={() => onView(itemData)} 
            className="text-2xl font-black text-slate-900 leading-tight cursor-pointer line-clamp-2 hover:text-purple-600 transition-colors"
          >
            {itemData.title}
          </h3>
          <p className="text-sm font-medium text-slate-400 mt-2 line-clamp-2">
            {itemData.excerpt}
          </p>
        </div>
        
        {/* Grid Info Mapping */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
          {/* Date */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Date</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div>
              <span className="text-xs font-bold text-slate-700">
                {new Date(itemData.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {/* Time for Events */}
          {type === 'events' && itemData.time && (
            <div className="space-y-1">
              <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Time</span>
              <span className="text-xs font-bold text-slate-700">{itemData.time}</span>
            </div>
          )}

          {/* Location for Events - Full width */}
          {type === 'events' && itemData.location && (
            <div className="col-span-2 p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100/50">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Location</span>
                <span className="text-xs font-bold text-slate-800 truncate">{itemData.location}</span>
              </div>
              <FiMapPin className="text-slate-300 text-lg shrink-0 ml-2" />
            </div>
          )}

          {/* Author for News */}
          {type === 'news' && itemData.author && (
            <div className="col-span-2 p-3 bg-blue-50 rounded-2xl flex items-center justify-between border border-blue-100/50">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-blue-400 font-black uppercase tracking-[0.1em]">Author</span>
                <span className="text-xs font-bold text-blue-800 truncate">{itemData.author}</span>
              </div>
              <FiUser className="text-blue-300 text-lg shrink-0 ml-2" />
            </div>
          )}
        </div>

        {/* Modern Action Bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onView(itemData)} 
            className="px-5 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-none active:bg-slate-200"
          >
            View
          </button>
          
          <button 
            onClick={() => onEdit(itemData)} 
            className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-none active:scale-[0.98]"
          >
            Edit
          </button>
          
          <button 
            onClick={() => onDelete(itemData)} 
            className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 transition-none active:bg-red-100"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
// Modern Item Modal Component
function ModernItemModal({ onClose, onSave, item, type, loading }) {
  // Initialize state with ALL possible fields
  const [formData, setFormData] = useState({
    // Common fields
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: type === 'news' ? 'achievement' : 'academic',
    image: '',
    featured: false,
    status: 'published',
    
    // News fields (using proper API field names)
    excerpt: '',
    fullContent: '',
    author: '',
    
    // Event fields
    description: '',
    time: '',
    location: '',
    speaker: '',
    attendees: 'students',
    type: 'internal'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

useEffect(() => {
  console.log('🔄 Loading item for editing:', item);
  
  if (item) {
    const newFormData = { ...formData };
    
    if (item.title) newFormData.title = item.title;
    
    if (item.date) {
      try {
        const dateObj = new Date(item.date);
        if (!isNaN(dateObj.getTime())) {
          newFormData.date = dateObj.toISOString().split('T')[0];
        }
      } catch (e) {
        console.error('Error parsing date:', e);
      }
    }
    
    // Map category
    if (item.category) newFormData.category = item.category;
    
    // Map image
    if (item.image) {
      newFormData.image = item.image;
      setImagePreview(item.image);
    }
    
    // Map featured ONLY for events
    if (type === 'events' && item.featured !== undefined) {
      newFormData.featured = item.featured;
    }
    
    // Map status
    if (item.status) newFormData.status = item.status;
    
    // 🚨 CRITICAL: For NEWS - PRESERVE existing excerpt and fullContent
    if (type === 'news') {
      // Map excerpt from either excerpt or description
      if (item.excerpt) {
        newFormData.excerpt = item.excerpt;
      } else if (item.description) {
        newFormData.excerpt = item.description;
      }
      
      // Map fullContent from either fullContent or content
      if (item.fullContent) {
        newFormData.fullContent = item.fullContent;
      } else if (item.content) {
        newFormData.fullContent = item.content;
      }
      
      // Map author
      if (item.author) newFormData.author = item.author;
    } 
    // 🚨 CRITICAL: For EVENTS - PRESERVE existing description
    else if (type === 'events') {
      // Map description
      if (item.description) {
        newFormData.description = item.description;
      } else if (item.excerpt) {
        newFormData.description = item.excerpt;
      }
      
      // Map other event fields
      if (item.time) newFormData.time = item.time;
      if (item.location) newFormData.location = item.location;
      if (item.speaker) newFormData.speaker = item.speaker;
      if (item.attendees) newFormData.attendees = item.attendees;
      if (item.type) newFormData.type = item.type;
    }
    
    console.log('✅ Form data loaded (preserved existing content):', newFormData);
    setFormData(newFormData);
  }
}, [item, type]);

  const categories = {
    news: [
      { value: 'achievement', label: 'Achievements', color: 'emerald' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'infrastructure', label: 'Infrastructure', color: 'orange' },
      { value: 'community', label: 'Community', color: 'rose' },
      { value: 'general', label: 'General', color: 'gray' }
    ],
    events: [
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'cultural', label: 'Cultural', color: 'emerald' },
      { value: 'social', label: 'Social', color: 'orange' },
      { value: 'general', label: 'General', color: 'gray' }
    ]
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field, value) => {
    console.log(`Changing ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 🔥 FIXED: Proper form submission with ALL data
// In ModernItemModal component, update the formData initialization
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('🚀 Submitting form with data:', formData);
  
  const submitData = new FormData();
  
  // 🚨 CRITICAL: For NEWS, ALWAYS include both excerpt and fullContent
  if (type === 'news') {
    // Always include these fields - empty fields will be handled by backend
    submitData.append('title', formData.title.trim());
    submitData.append('excerpt', formData.excerpt.trim());
    submitData.append('fullContent', formData.fullContent.trim());
    submitData.append('category', formData.category);
    submitData.append('author', formData.author.trim());
    submitData.append('date', formData.date);
    
    // If editing, include the ID
    if (item?.id) {
      submitData.append('id', item.id.toString());
    }
  } 
  // 🚨 For EVENTS, send event fields
  else if (type === 'events') {
    submitData.append('title', formData.title.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('category', formData.category);
    submitData.append('date', formData.date);
    
    // Event-specific fields
    if (formData.time) submitData.append('time', formData.time);
    if (formData.location) submitData.append('location', formData.location);
    if (formData.speaker) submitData.append('speaker', formData.speaker);
    if (formData.attendees) submitData.append('attendees', formData.attendees);
    if (formData.type) submitData.append('type', formData.type);
    
    // ✅ ONLY for events: Include featured field
    if (formData.featured !== undefined) {
      submitData.append('featured', formData.featured.toString());
    }
    
    // If editing, include the ID
    if (item?.id) {
      submitData.append('id', item.id.toString());
    }
  }
  
  // Add image if changed
  if (imageFile) {
    submitData.append('image', imageFile);
  }
  
  console.log('📤 Sending form data to parent:');
  for (let [key, value] of submitData.entries()) {
    console.log(`${key}: ${value instanceof File ? `File (${value.name})` : value}`);
  }
  
  await onSave(submitData, item?.id);
};

  const themeGradient = type === 'news' 
    ? 'from-purple-700 via-pink-600 to-rose-600' 
    : 'from-blue-700 via-cyan-600 to-teal-600';

  return (
    <Modal open={true} onClose={loading ? undefined : onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95%', maxWidth: '1100px', maxHeight: '95vh',
        bgcolor: '#ffffff', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden', outline: 'none'
      }}>
        
        {/* Header */}
        <div className={`p-8 text-white bg-gradient-to-r ${themeGradient}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl">
                {type === 'news' ? <IoNewspaperOutline size={32} /> : <IoCalendarClearOutline size={32} />}
              </div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                  {item ? `EDITING: ${item.title?.substring(0, 30)}${item.title?.length > 30 ? '...' : ''}` : `CREATE NEW ${type.toUpperCase()}`}
                </h2>
                <p className="text-white/80 font-bold text-xs mt-1 tracking-widest uppercase">
                  {item ? 'Edit existing content' : 'Add new content'}
                </p>
              </div>
            </div>
            {!loading && (
              <button onClick={onClose} className="p-3 bg-black/10 hover:bg-black/20 rounded-full transition-all active:scale-90">
                <FiX size={24} />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[calc(95vh-160px)] overflow-y-auto bg-slate-50/50">
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
            
            {/* Title Input */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 shrink-0">
                <FiStar className="text-amber-500 text-xs" />
                Headline
              </label>

              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="
                  flex-1
                  px-4 py-3
                  bg-transparent
                  border border-slate-300
                  rounded-lg
                  focus:border-purple-500
                  focus:ring-1 focus:ring-purple-500
                  transition
                  text-lg sm:text-xl
                  font-semibold
                  text-slate-900
                  placeholder:text-slate-400
                  outline-none
                "
                placeholder="Enter a catchy title..."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column - Visuals & Media */}
              <div className="lg:col-span-4 space-y-8">
                <div className="relative group">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
                    Featured Media {formData.image && '(Existing image loaded)'}
                  </label>
                  <div className="relative aspect-video sm:aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-200">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                         <FiImage size={48} className="opacity-20" />
                         <span className="text-[10px] font-bold">NO IMAGE SELECTED</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                      <FiUpload size={30} />
                      <span className="font-black text-xs mt-2 uppercase tracking-widest">Change Photo</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Featured Toggle */}
{type === 'events' && (
  <div 
    onClick={() => handleChange('featured', !formData.featured)}
    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
      formData.featured ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100 hover:border-slate-200'
    }`}
  >
    <div>
      <p className={`font-black text-sm uppercase ${formData.featured ? 'text-amber-700' : 'text-slate-700'}`}>Promote to Featured</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase">Displays in homepage slider</p>
    </div>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formData.featured ? 'bg-amber-500 text-white' : 'bg-slate-100'}`}>
      <FiStar />
    </div>
  </div>
)}
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Category Selection */}
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-800 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                  >
                    {categories[type].map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>

                {/* Date Input */}
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-800 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                  />
                </div>

                {/* Type-specific fields */}
                {type === 'events' ? (
                  <>
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Event Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 08:00 AM - 04:00 PM"
                        value={formData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Venue / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. School Main Hall"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Article Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-800 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all"
                    />
                  </div>
                )}

                {/* Long Text Areas */}
                <div className="sm:col-span-2 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-800 mb-2 ml-1">
                      {type === 'news' ? 'Excerpt (Short Description)' : 'Description'}
                    </label>
                    <textarea
                      rows="8"
                      value={type === 'news' ? formData.excerpt : formData.description}
                      onChange={(e) => handleChange(type === 'news' ? 'excerpt' : 'description', e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all placeholder:text-slate-300"
                      placeholder={type === 'news' ? 'Write a brief summary of this news article...' : 'Write a brief description...'}
                    />
                  </div>
        
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-100">
              <button 
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancel Changes
              </button>
              
<button 
  type="submit"
  disabled={loading}

  // Removed hover:brightness-110 and transition-all
  className={`w-full sm:w-auto px-12 py-4 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 flex items-center justify-center gap-3 bg-gradient-to-r ${themeGradient} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
>
  {loading ? (
    <>
      <CircularProgress size={18} thickness={6} sx={{ color: 'white' }} />
      <span>Saving updates...</span> {/* Fixed: Wrapped text in a tag */}
    </>
  ) : (
    <>
      <FiCheck size={18} />
      {item ? 'Save Updates' : `Create ${type === 'news' ? 'News' : 'Event'}`}
    </>
  )}
</button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
// Helper function to get authentication headers from localStorage
const getAuthHeaders = () => {
  try {
    const adminToken = localStorage.getItem('admin_token');
    const deviceToken = localStorage.getItem('device_token');
    
    if (!adminToken || !deviceToken) {
      console.error('❌ Authentication tokens not found in localStorage');
      return {};
    }
    
    return {
      'x-admin-token': adminToken,
      'x-device-token': deviceToken
    };
  } catch (error) {
    console.error('❌ Error getting auth headers:', error);
    return {};
  }
};

// Main News & Events Manager Component
export default function NewsEventsManager() {
  const [activeSection, setActiveSection] = useState('news');
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: ''
  });

  const categories = {
    news: [
      { value: 'achievement', label: 'Achievements', color: 'emerald' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'infrastructure', label: 'Infrastructure', color: 'orange' },
      { value: 'community', label: 'Community', color: 'rose' }
    ],
    events: [
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'cultural', label: 'Cultural', color: 'emerald' },
      { value: 'social', label: 'Social', color: 'orange' }
    ]
  };

  // Notification handler
  const showNotification = (type, title, message) => {
    setNotification({
      open: true,
      type,
      title,
      message
    });
  };

  // Fetch news from API
// Fetch news from API
// Fetch news from API - FIXED MAPPING
const fetchNews = async () => {
  try {
    const response = await fetch('/api/news');
    const data = await response.json();
    
    console.log('News API Response:', data); // Debug log
    
    if (data.success) {
      const newsArray = data.data || [];
      
      // 🚨 FIX: News has both excerpt AND fullContent
      const mappedNews = newsArray.map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt || '', // News has excerpt
        description: item.excerpt || '', // Also use excerpt as description
        fullContent: item.fullContent || '', // News has fullContent
        date: item.date,
        category: item.category || 'general',
        author: item.author || 'School Administration',
        image: item.image || '',
        featured: false, // News doesn't have featured
        status: item.status || 'published'
      }));
      
      console.log('Mapped News (Fixed):', mappedNews);
      setNews(mappedNews);
    } else {
      throw new Error(data.error || 'Failed to fetch news');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    setNews([]);
    showNotification('error', 'Fetch Error', 'Failed to fetch news');
  }
};
  // Fetch events from API
// Fetch events from API
const fetchEvents = async () => {
  try {
    const response = await fetch('/api/events');
    const data = await response.json();
    
    console.log('Events API Response:', data); // Debug log
    
    if (data.success) {
      // Handle both "events" and "data" property names
      const eventsArray = data.events || data.data || [];
      const mappedEvents = eventsArray.map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.description || item.excerpt || '',
        description: item.description || item.excerpt || '',
        date: item.date,
        category: item.category || 'general',
        image: item.image || '',
        featured: item.featured || false,
        time: item.time || '',
        location: item.location || '',
        speaker: item.speaker || '',
        attendees: item.attendees || 'students',
        status: item.status || 'published'
      }));
      
      console.log('Mapped Events:', mappedEvents); // Debug log
      setEvents(mappedEvents);
    } else {
      throw new Error(data.error || 'Failed to fetch events');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    setEvents([]);
    showNotification('error', 'Fetch Error', 'Failed to fetch events');
  }
};

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchNews(), fetchEvents()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('error', 'Fetch Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const items = activeSection === 'news' ? news : events;
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [activeSection, searchTerm, selectedCategory, news, events]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // UPDATED: Delete function with authentication headers
const confirmDelete = async () => {
  if (!itemToDelete) return;
  
  setDeleting(true);
  try {
    const endpoint = activeSection === 'news' 
      ? `/api/news/${itemToDelete.id}` 
      : `/api/events/${itemToDelete.id}`;
    
    // Get authentication headers
    const authHeaders = getAuthHeaders();
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        ...authHeaders,
      },
    });
    
    const result = await response.json();
    
    if (result.success) {
      await fetchData();
      showNotification('success', 'Deleted', `${activeSection === 'news' ? 'News' : 'Event'} deleted successfully!`);
    } else {
      throw new Error(result.error || result.message);
    }
  } catch (error) {
    console.error(`Error deleting ${activeSection}:`, error);
    showNotification('error', 'Delete Failed', error.message || `Failed to delete ${activeSection}`);
  } finally {
    setDeleting(false);
    setShowDeleteModal(false);
    setItemToDelete(null);
  }
};

const handleSubmit = async (formData, id) => {
  setSaving(true);
  try {
    console.log('📥 Received from modal:', formData);
    
    // Get authentication headers
    const authHeaders = getAuthHeaders();
    
    showNotification('info', 'Saving', `${id ? 'Updating' : 'Creating'} ${activeSection}...`);
    
    const endpoint = id 
      ? (activeSection === 'news' ? `/api/news/${id}` : `/api/events/${id}`)
      : (activeSection === 'news' ? '/api/news' : '/api/events');
    
    const method = id ? 'PUT' : 'POST';
    
    // 🚨 CRITICAL: Ensure ALL existing data is included when updating
    if (id && editingItem) {
      console.log('🔄 Including existing data for update:', editingItem);
      
      // For News - ensure excerpt and fullContent are preserved if not changed
      if (activeSection === 'news') {
        const excerpt = formData.get('excerpt');
        const fullContent = formData.get('fullContent');
        
        // If excerpt is empty but we have existing excerpt, use existing
        if (!excerpt && editingItem.excerpt) {
          formData.set('excerpt', editingItem.excerpt);
        }
        
        // If fullContent is empty but we have existing fullContent, use existing
        if (!fullContent && editingItem.fullContent) {
          formData.set('fullContent', editingItem.fullContent);
        }
      }
      
      // For Events - ensure description is preserved if not changed
      if (activeSection === 'events') {
        const description = formData.get('description');
        if (!description && editingItem.description) {
          formData.set('description', editingItem.description);
        }
      }
    }
    
    // Debug: Show what's being sent
    console.log('📤 Sending to API:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? `File (${value.name})` : value}`);
    }
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        ...authHeaders,
      },
      body: formData,
    });

    const result = await response.json();
    console.log('✅ API Response:', result);

    if (result.success) {
      // 🚨 AUTO-CLOSE MODAL on success
      setShowModal(false);
      
      // 🚨 Refresh data
      await fetchData();
      
      showNotification(
        'success',
        id ? 'Updated' : 'Created',
        `${activeSection === 'news' ? 'News' : 'Event'} ${id ? 'updated' : 'created'} successfully!`
      );
    } else {
      throw new Error(result.error || result.message || `Failed to ${id ? 'update' : 'create'} ${activeSection}`);
    }
  } catch (error) {
    console.error(`Error saving ${activeSection}:`, error);
    showNotification('error', 'Save Failed', error.message || `Failed to ${id ? 'update' : 'create'} ${activeSection}`);
  } finally {
    setSaving(false);
  }
};


  useEffect(() => {
    const calculatedStats = {
      totalNews: news.length,
      totalEvents: events.length,
      featuredNews: news.filter(n => n.featured).length,
      featuredEvents: events.filter(e => e.featured).length,
      todayNews: news.filter(n => {
        const itemDate = new Date(n.date);
        const today = new Date();
        return itemDate.toDateString() === today.toDateString();
      }).length,
      upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
    };
    setStats(calculatedStats);
  }, [news, events]);

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700 font-medium">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiChevronLeft className="text-lg" />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => 
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, index, array) => (
            <div key={page} className="flex items-center">
              {index > 0 && array[index - 1] !== page - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => paginate(page)}
                className={`px-3 py-2 rounded-xl font-bold ${
                  currentPage === page
                    ? activeSection === 'news'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-700'
                }`}
              >
                {page}
              </button>
            </div>
          ))
        }

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );

   if (loading && news.length === 0 && events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <Spinner size={48} />
          <p className="text-gray-700 text-lg mt-4 font-medium">
            Loading Events and News
          </p>
          <p className="text-gray-800 text-sm mt-1">
            Please wait while we fetch school Events and News articles.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Custom Notification */}
      <Notification
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.title}
        itemType={activeSection === 'news' ? 'news article' : 'event'}
        loading={deleting}
      />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">News & Events Manager</h1>
            <p className="text-gray-600 text-sm lg:text-base">Manage school news articles and events</p>
          </div>
          <div className="flex items-center gap-3">
   <button
  onClick={fetchData}
  className={`flex items-center gap-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
              text-white px-5 py-3 rounded-2xl font-semibold shadow-lg 
              hover:scale-105 hover:shadow-xl transition-transform duration-300
              cursor-pointer text-sm`}
>
  {/* Loading spinner */}
  {loading && (
    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
  
  {loading ? 'Refreshing...' : 'Refresh'}
</button>

            <button onClick={handleCreate} className={`flex items-center gap-2 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm ${
              activeSection === 'news' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'bg-gradient-to-r from-blue-600 to-cyan-600'
            }`}>
              <FiPlus className="text-xs" /> Create {activeSection === 'news' ? 'News' : 'Event'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Total News</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalNews}</p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                <IoNewspaperOutline className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Total Events</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <IoCalendarClearOutline className="text-lg" />
              </div>
            </div>
          </div>

 

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Featured Events</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.featuredEvents}</p>
              </div>
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <FiTrendingUp className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Today's News</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.todayNews}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <FiClock className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Upcoming Events</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-2xl">
                <FiCalendar className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-full max-w-md">
          {[
            { id: 'news', label: 'News Articles', count: news.length, icon: IoNewspaperOutline },
            { id: 'events', label: 'Events', count: events.length, icon: IoCalendarClearOutline }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                  isActive
                    ? tab.id === 'news'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeSection} by title or description...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-gray-50"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Categories</option>
            {categories[activeSection].map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <button className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <FiShare2 /> Export
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {currentItems.map((item) => (
          <ModernItemCard 
            key={item.id} 
            item={item} 
            type={activeSection}
            onEdit={handleEdit} 
            onDelete={handleDeleteClick} 
            onView={handleView}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentItems.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
          {activeSection === 'news' ? (
            <IoNewspaperOutline className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
          ) : (
            <IoCalendarClearOutline className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
          )}
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No items found' : `No ${activeSection} available`}
          </h3>
          <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : `Start by creating your first ${activeSection === 'news' ? 'news article' : 'event'}`}
          </p>
          <button 
            onClick={handleCreate} 
            className={`text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 mx-auto text-sm lg:text-base cursor-pointer ${
              activeSection === 'news' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'bg-gradient-to-r from-blue-600 to-cyan-600'
            }`}
          >
            <FiPlus /> Create {activeSection === 'news' ? 'News' : 'Event'}
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
          <Pagination />
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ModernItemModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSubmit} 
          item={editingItem} 
          type={activeSection}
          loading={saving} 
        />
      )}
      
      {showDetailModal && selectedItem && (
        <ModernItemDetailModal 
          item={selectedItem} 
          type={activeSection}
          onClose={() => setShowDetailModal(false)} 
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}