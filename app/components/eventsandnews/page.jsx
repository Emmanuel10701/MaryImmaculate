'use client';
import { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiClock,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
  FiX,
  FiImage,
  FiBook,
  FiUpload,
  FiRotateCw,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiEdit,
  FiTrash2,
  FiEye,
  FiInfo, 
  FiCheck,
  FiCheckCircle,
  FiGlobe,
  FiBell,
  FiUser,
  FiAlertTriangle,
  FiAlertCircle,
  FiBriefcase 
} from 'react-icons/fi';
import { 
  IoNewspaperOutline,
  IoCalendarClearOutline 
} from 'react-icons/io5';
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

// Modern Item Detail Modal
function ModernItemDetailModal({ item, type, onClose, onEdit }) {
  if (!item) return null

  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
      return type === 'news' ? '/default-news.jpg' : '/default-event.jpg';
    }
    
    // If it's already a full URL or starts with /, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // If it's a base64 string (from file upload), return as is
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // If it's a path from API (without leading slash), add it
    if (imagePath.startsWith('news/') || imagePath.startsWith('events/')) {
      return `/${imagePath}`;
    }
    
    // Default fallback
    return type === 'news' ? '/default-news.jpg' : '/default-event.jpg';
  };

  const imageUrl = getImageUrl(item.image);
  
  const categories = {
    news: {
      'achievement': { label: 'Achievements', color: 'emerald' },
      'sports': { label: 'Sports', color: 'blue' },
      'academic': { label: 'Academic', color: 'purple' },
      'infrastructure': { label: 'Infrastructure', color: 'orange' },
      'community': { label: 'Community', color: 'rose' }
    },
    events: {
      'academic': { label: 'Academic', color: 'purple' },
      'sports': { label: 'Sports', color: 'blue' },
      'cultural': { label: 'Cultural', color: 'emerald' },
      'social': { label: 'Social', color: 'orange' }
    }
  };

  const categoryInfo = categories[type][item.category];

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '95vh', bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #fef3f7 100%)'
      }}>
        {/* Header */}
        <div className={`p-6 text-white ${
          type === 'news' 
            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-700'
            : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                {type === 'news' ? 
                  <IoNewspaperOutline className="text-xl" /> : 
                  <IoCalendarClearOutline className="text-xl" />
                }
              </div>
              <div>
                <h2 className="text-2xl font-bold">{type === 'news' ? 'News' : 'Event'} Details</h2>
                <p className="text-white/90 opacity-90 mt-1">
                  Complete overview of {type === 'news' ? 'news article' : 'event'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onEdit(item)} 
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg cursor-pointer"
              >
                <FiEdit /> Edit
              </button>
              <button 
                onClick={onClose} 
                className="p-2 bg-white/10 text-white rounded-full cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Image and Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = type === 'news' ? '/default-news.jpg' : '/default-event.jpg';
                    }}
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        categoryInfo ? `bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800` : 'bg-gray-100 text-gray-800'
                      }`}>
                        {categoryInfo?.label || item.category}
                      </span>
                      {item.featured && (
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 font-medium">
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2 border-b border-purple-100 pb-2">
                  <FiBriefcase className="text-purple-600 text-xs" />
                  {type === 'news' ? 'Article' : 'Event'} Information
                </h3>

                <div className="grid grid-cols-1 gap-4 text-[13px]">
                  {/* Date */}
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase tracking-wide">Date</span>
                    <span className="text-gray-700 font-medium">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Time for Events */}
                  {type === 'events' && item.time && (
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-[10px] uppercase tracking-wide">Time</span>
                      <span className="text-gray-700 font-medium">{item.time}</span>
                    </div>
                  )}

                  {/* Location for Events */}
                  {type === 'events' && item.location && (
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-[10px] uppercase tracking-wide">Location</span>
                      <span className="text-gray-700 font-medium">{item.location}</span>
                    </div>
                  )}

                  {/* Author for News */}
                  {type === 'news' && item.author && (
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-[10px] uppercase tracking-wide">Author</span>
                      <span className="text-gray-700 font-medium">{item.author}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiBook className="text-blue-600" />
                Description
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {item.description || item.excerpt || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Full Content for News */}
            {type === 'news' && item.fullContent && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiBook className="text-purple-600" />
                  Full Content
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {item.fullContent}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info for Events */}
            {type === 'events' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {item.speaker && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FiUser className="text-green-600" />
                      Speaker
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <p className="text-gray-700 font-medium">{item.speaker}</p>
                    </div>
                  </div>
                )}
                
                {item.attendees && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FiUsers className="text-orange-600" />
                      Attendees
                    </h3>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                      <p className="text-gray-700 font-medium capitalize">{item.attendees}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <button 
              onClick={onClose} 
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
            >
              Close
            </button>
            <button 
              onClick={() => onEdit(item)} 
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
            >
              <FiEdit /> Edit {type === 'news' ? 'News' : 'Event'}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

// MODERN CARD COMPONENT (Matching Staff Style)
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
            src={imageUrl} 
            alt={itemData.title} 
            onClick={() => onView(itemData)}
            className="w-full h-full object-cover object-top cursor-pointer hover:scale-100 transition-transform duration-300"
            onError={() => setImageError(true)} 
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

        {/* Overlay: Category & Featured */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm pointer-events-auto">
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              categoryInfo ? `bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800 border border-${categoryInfo.color}-200` : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              {categoryInfo?.label || itemData.category}
            </span>
          </div>
          
          {itemData.featured && (
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
  const [formData, setFormData] = useState({
    title: item?.title || '',
    date: item?.date || new Date().toISOString().split('T')[0],
    time: item?.time || '',
    location: item?.location || '',
    category: item?.category || (type === 'news' ? 'achievement' : 'academic'),
    description: item?.description || (item?.excerpt || ''),
    content: item?.content || (item?.fullContent || ''),
    author: item?.author || 'School Administration',
    image: item?.image || '',
    featured: item?.featured || false,
    status: item?.status || 'draft',
    // Event specific fields
    type: item?.type || 'internal',
    attendees: item?.attendees || 'students',
    speaker: item?.speaker || ''
  });

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(item?.image || '')

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

  useEffect(() => {
    if (item?.image) {
      const getPreviewUrl = (imgPath) => {
        if (!imgPath) return '';
        if (imgPath.startsWith('/') || imgPath.startsWith('http') || imgPath.startsWith('data:image')) {
          return imgPath;
        }
        if (imgPath.startsWith('news/') || imgPath.startsWith('events/')) {
          return `/${imgPath}`;
        }
        return '';
      };
      
      setImagePreview(getPreviewUrl(item.image));
    }
  }, [item]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare form data
    const submitData = new FormData();
    
    // Common fields
    submitData.append('title', formData.title.trim());
    submitData.append('category', formData.category);
    submitData.append('date', formData.date);
    submitData.append('featured', formData.featured.toString());
    submitData.append('description', formData.description.trim());
    
    // Type specific fields
    if (type === 'news') {
      submitData.append('excerpt', formData.description.trim());
      submitData.append('fullContent', (formData.content || formData.description).trim());
      submitData.append('author', formData.author.trim());
    } else {
      submitData.append('time', formData.time.trim());
      submitData.append('location', formData.location.trim());
      submitData.append('type', formData.type);
      submitData.append('attendees', formData.attendees);
      submitData.append('speaker', formData.speaker.trim());
    }
    
    // Handle image
    if (imageFile) {
      submitData.append('image', imageFile);
    }
    
    await onSave(submitData, item?.id);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal open={true} onClose={loading ? undefined : onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '95vh', bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #faf5ff 100%)'
      }}>
        {/* Header */}
        <div className={`p-6 text-white ${
          type === 'news' 
            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-700'
            : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                {type === 'news' ? 
                  <IoNewspaperOutline className="text-xl" /> : 
                  <IoCalendarClearOutline className="text-xl" />
                }
              </div>
              <div>
                <h2 className="text-2xl font-bold">{item ? 'Edit' : 'Create'} {type === 'news' ? 'News' : 'Event'}</h2>
                <p className="text-white/90 opacity-90 mt-1">
                  Manage {type === 'news' ? 'news article' : 'event'} information
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

        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className=" text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                    <FiImage className="text-purple-600 text-lg" /> 
                    Featured Image
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            {type === 'news' ? 
                              <IoNewspaperOutline className="text-2xl text-gray-400" /> : 
                              <IoCalendarClearOutline className="text-2xl text-gray-400" />
                            }
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <div className="px-4 py-3 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <FiUpload className="text-purple-500" />
                            <span className="text-sm font-bold text-gray-700">
                              {imageFile ? 'Change Image' : 'Upload Image'}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className=" text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
                    <FiBook className="text-blue-600 text-lg" /> 
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder={`Enter ${type === 'news' ? 'news' : 'event'} title`}
                  />
                </div>

                {/* Category and Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                    >
                      {categories[type].map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Event Specific Fields */}
                {type === 'events' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">Time</label>
                        <input
                          type="text"
                          value={formData.time}
                          onChange={(e) => handleChange('time', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                          placeholder="e.g., 9:00 AM - 5:00 PM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">Type</label>
                        <select
                          value={formData.type}
                          onChange={(e) => handleChange('type', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        >
                          <option value="internal">Internal</option>
                          <option value="external">External</option>
                          <option value="online">Online</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                        placeholder="Enter event location"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">Attendees</label>
                        <select
                          value={formData.attendees}
                          onChange={(e) => handleChange('attendees', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                        >
                          <option value="students">Students</option>
                          <option value="staff">Staff</option>
                          <option value="parents">Parents</option>
                          <option value="all">All</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">Speaker</label>
                        <input
                          type="text"
                          value={formData.speaker}
                          onChange={(e) => handleChange('speaker', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                          placeholder="Enter speaker name"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Author for News */}
                {type === 'news' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                      placeholder="Enter author name"
                    />
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                    <FiBook className="text-purple-600 text-lg" /> 
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                    placeholder={`Write a brief description...`}
                  />
                </div>

                {/* Full Content (News only) */}
                {type === 'news' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-xl border border-indigo-200">
                      <FiBook className="text-indigo-600 text-lg" /> 
                      Full Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleChange('content', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                      placeholder="Write the full article content..."
                    />
                  </div>
                )}

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleChange('featured', e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-bold text-gray-700">Featured Item</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button 
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={loading}
                className={`px-8 py-3 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2 ${
                  type === 'news' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                }`}
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} className="text-white" />
                    {item ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FiCheck />
                    {item ? 'Update' : 'Create'} {type === 'news' ? 'News' : 'Event'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  )
}

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
const fetchNews = async () => {
  try {
    const response = await fetch('/api/news');
    const data = await response.json();
    
    if (data.success) {
      // Map API response to component expected structure
      const mappedNews = (data.data || data.news || []).map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt || item.description || '',
        description: item.excerpt || item.description || '',
        fullContent: item.fullContent || item.content || '',
        date: item.date,
        category: item.category || 'general',
        author: item.author || 'Admin',
        image: item.image || '',
        featured: item.featured || false,
        status: item.status || 'published'
      }));
      
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
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEvents(data.events || []);
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

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(true);
    try {
      const endpoint = activeSection === 'news' 
        ? `/api/news/${itemToDelete.id}` 
        : `/api/events/${itemToDelete.id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchData();
        showNotification('success', 'Deleted', `${activeSection === 'news' ? 'News' : 'Event'} deleted successfully!`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Error deleting ${activeSection}:`, error);
      showNotification('error', 'Delete Failed', `Failed to delete ${activeSection}`);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

const handleSubmit = async (formData, id) => {
  setSaving(true);
  try {
    let response;
    let endpoint;
    
    // Add loading notification
    showNotification('info', 'Saving', `${id ? 'Updating' : 'Creating'} ${activeSection}...`);
    
    if (id) {
      endpoint = activeSection === 'news' ? `/api/news/${id}` : `/api/events/${id}`;
      response = await fetch(endpoint, {
        method: 'PUT',
        body: formData,
      });
    } else {
      endpoint = activeSection === 'news' ? '/api/news' : '/api/events';
      response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
    }

    const result = await response.json();
    
    console.log('API Response:', result); // Debug log

    if (result.success) {
      await fetchData();
      setShowModal(false);
      showNotification(
        'success',
        id ? 'Updated' : 'Created',
        `${activeSection === 'news' ? 'News' : 'Event'} ${id ? 'updated' : 'created'} successfully!`
      );
    } else {
      throw new Error(result.error || `Failed to ${id ? 'update' : 'create'} ${activeSection}`);
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
          <p className="text-gray-400 text-sm mt-1">
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
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Featured News</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.featuredNews}</p>
              </div>
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
                <FiAward className="text-lg" />
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