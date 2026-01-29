'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiMail,
  FiPhone,
  FiUser,
  FiAward,
  FiBook,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiEye,
  FiStar,
  FiShield,
  FiRotateCw,
  FiUpload,
  FiCheck,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
  FiAlertCircle,
  FiTag
} from 'react-icons/fi';
import { 
  FaEdit, 
  FaUserPlus, 
  FaTimes, 
  FaCheck, 
  FaUser, 
  FaEnvelope, 
  FaUserCircle, 
  FaInfoCircle, 
  FaPhoneAlt, 
  FaUserTie, 
  FaBriefcase, 
  FaBuilding, 
  FaCalendarAlt, 
  FaUserCheck, 
  FaQuoteLeft, 
  FaQuoteRight, 
  FaStar, 
  FaTrophy, 
  FaClipboardCheck, 
  FaSave,
  FaMale,
  FaFemale,
  FaUpload,
  FaGraduationCap,
  FaCrown,
  FaShieldAlt,
  FaUsers,
  FaBook,
  FaCheckCircle,
  FaCalendar,
  FaTimesCircle,
  FaHandsHelping,
  FaChalkboardTeacher
} from 'react-icons/fa';
import { 
  IoPeopleCircle,
  IoRocketOutline,
  IoSchoolOutline
} from 'react-icons/io5';
import CircularProgress from '@mui/material/CircularProgress';

// Custom Spinner Component using Material-UI CircularProgress
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

// Item Input Component for array fields
const ItemInput = ({ 
  label, 
  value = [], 
  onChange, 
  placeholder = "Add item...",
  type = "text",
  icon: Icon = FiTag,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleAddItem = () => {
    if (!inputValue.trim()) return;
    
    const trimmedValue = inputValue.trim();
    if (!value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveItem(value.length - 1);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-800 mb-2">
        {label} ({value.length} items)
      </label>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className="text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type={type}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          disabled={!inputValue.trim() || disabled}
          className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200 min-h-[60px]">
          {value.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:border-red-300 transition-colors"
            >
              <span className="text-gray-800 font-medium">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                disabled={disabled}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Delete Confirmation Modal
function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  type = 'single',
  count = 1,
  staffName = '',
  loading = false 
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
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
                {type === 'bulk' 
                  ? `Delete ${count} staff ${count === 1 ? 'member' : 'members'}?`
                  : `Delete "${staffName}"?`
                }
              </h3>
              <p className="text-gray-600">
                {type === 'bulk'
                  ? `You are about to delete ${count} staff ${count === 1 ? 'member' : 'members'}. All associated data will be permanently removed.`
                  : 'This staff member will be permanently deleted. All associated data will be removed.'
                }
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
                  <Spinner size={16} color="white" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <FiTrash2 />
                  {type === 'bulk' ? `Delete ${count} Staff` : 'Delete Staff Member'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Component
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
  );
}

// Modern Staff Detail Modal
function ModernStaffDetailModal({ staff, onClose, onEdit }) {
  if (!staff) return null;
const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return staff?.gender === 'female' ? '/female.png' : '/male.png';
  }
  
  // Handle different image path formats
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }
  
  // Assume it's a relative path without leading slash
  return `/${imagePath}`;
};
  const imageUrl = getImageUrl(staff.image);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-4xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiEye className="text-xl" />
              </div>
              <div className="px-4 py-2 sm:px-0"> 
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Staff Details
                </h2>
                <p className="text-xs md:text-sm text-orange-100 opacity-90 mt-0.5 md:mt-1 leading-tight">
                  Complete overview of staff member
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
           
              <button 
                onClick={onClose} 
                className="p-2 bg-white/10 text-white rounded-full cursor-pointer flex-shrink-0"
              >
                <FiX className="text-lg sm:text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4">
                <img
                  src={imageUrl}
                  alt={staff.name}
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/male.png';
                  }}
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{staff.name}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' :
                      staff.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.status || 'active'}
                    </span>
                    <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {staff.role}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">{staff.position}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl p-5 border border-gray-200 w-full lg:max-w-md shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2 border-b border-orange-100 pb-2">
                <FiBriefcase className="text-orange-600 text-xs" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 gap-4 text-[13px]">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wide">Department</span>
                  <span className="text-gray-700 font-medium">{staff.department}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wide">Email Address</span>
                  <span className="text-gray-700 font-medium break-all leading-tight">{staff.email}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wide">Phone Number</span>
                  <span className="text-gray-700 font-medium">{staff.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {staff.bio && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiUser className="text-blue-600" />
                  Bio
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{staff.bio}</p>
                </div>
              </div>
            )}

            {staff.expertise && staff.expertise.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiStar className="text-purple-600" />
                  Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {staff.expertise.map((exp, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {staff.responsibilities && staff.responsibilities.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiBriefcase className="text-green-600" />
                Key Responsibilities
              </h3>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <ul className="space-y-2">
                  {staff.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <FiCheck className="text-green-600 mt-1 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {staff.achievements && staff.achievements.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiAward className="text-yellow-600" />
                Achievements
              </h3>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <ul className="space-y-3">
                  {staff.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-xl">
                        <FiAward className="text-sm" />
                      </div>
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
    onClick={() => {
      onClose(); 
      onEdit(staff); // Then call edit function
    }} 
    className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
  >
    <FiEdit /> Edit Staff
  </button>
</div>
      </div>
    </div>
  );
}

// Modern Staff Card Component - Complete Updated Version
function ModernStaffCard({ staff, onEdit, onDelete, onView, selected, onSelect, actionLoading }) {
  const [imageError, setImageError] = useState(false);

const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return staff?.gender === 'female' ? '/female.png' : '/male.png';
  }
  
  // Handle different image path formats
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('data:image')) {
    return imagePath;
  }
  
  // Assume it's a relative path without leading slash
  return `/${imagePath}`;
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const imageUrl = getImageUrl(staff.image);
  const isDefaultImage = !staff.image || staff.image === '';

  return (
    <div className={`bg-white rounded-[2rem] shadow-xl border ${
      selected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-100'
    } w-full max-w-md overflow-hidden transition-none`}>
      
      {/* Image Section */}
      <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
        <div className="relative h-full w-full">
          {!imageError ? (
            <img 
              src={imageUrl} 
              alt={staff.name} 
              onClick={() => onView(staff)}
              className="w-full h-full object-cover object-top cursor-pointer"
              onError={() => setImageError(true)} 
            />
          ) : (
            <div 
              onClick={() => onView(staff)} 
              className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 cursor-pointer"
            >
              <FiUser className="text-5xl" />
              <span className="text-xs mt-2">No image</span>
            </div>
          )}
          {isDefaultImage && !imageError && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
              <FiUser className="text-gray-300 text-4xl" />
            </div>
          )}
        </div>

        {/* Overlay: Selection & Status */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm pointer-events-auto">
            <input 
              type="checkbox" 
              checked={selected} 
              onChange={(e) => onSelect(staff.id, e.target.checked)}
              className="w-4 h-4 text-orange-600 border-gray-200 rounded-full focus:ring-0 cursor-pointer" 
            />
          </div>
          
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${getStatusColor(staff.status)} pointer-events-auto`}>
            {staff.status || 'active'}
          </span>
        </div>
      </div>

      {/* Information Section */}
      <div className="p-6">
        <div className="mb-6">
          <h3 
            onClick={() => onView(staff)} 
            className="text-2xl font-black text-slate-900 leading-tight cursor-pointer truncate"
          >
            {staff.name}
          </h3>
          {/* Email Mapping */}
          <p className="text-sm font-medium text-slate-400 mt-1 truncate">
            {staff.email || 'no-email@company.com'}
          </p>
        </div>
        
        {/* Grid Info Mapping */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
          {/* Department Mapping */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Department</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
              <span className="text-xs font-bold text-slate-700 truncate">{staff.department}</span>
            </div>
          </div>
          
          {/* Role Mapping */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Role</span>
            <span className="text-xs font-bold text-slate-700 truncate block">{staff.role}</span>
          </div>

          {/* Phone Mapping */}
          <div className="col-span-2 p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100/50">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Phone Number</span>
              <span className="text-xs font-bold text-slate-800 truncate">{staff.phone}</span>
            </div>
            <FiBriefcase className="text-slate-300 text-lg shrink-0 ml-2" />
          </div>
          
          {/* Expertise Preview (if available) */}
          {staff.expertise && staff.expertise.length > 0 && (
            <div className="col-span-2 space-y-1">
              <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Expertise</span>
              <div className="flex flex-wrap gap-1">
                {staff.expertise.slice(0, 2).map((exp, index) => (
                  <span 
                    key={index} 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-lg text-xs font-bold"
                  >
                    {exp}
                  </span>
                ))}
                {staff.expertise.length > 2 && (
                  <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    +{staff.expertise.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modern Action Bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onView(staff)} 
            className="px-5 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-none active:bg-slate-200"
          >
            View
          </button>
          
          <button 
            onClick={() => onEdit(staff)} 
            disabled={actionLoading}
            className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-50 transition-none active:scale-[0.98]"
          >
            Edit Staff
          </button>
          
          <button 
            onClick={() => onDelete(staff)} 
            disabled={actionLoading}
            className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 disabled:opacity-50 transition-none active:bg-red-100"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
function ModernStaffModal({ onClose, onSave, staff, loading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    role: staff?.role || 'Teacher',
    position: staff?.position || '',
    department: staff?.department || 'Sciences',
    email: staff?.email || '',
    phone: staff?.phone || '',
    image: staff?.image || '',
    gender: staff?.gender || 'male',
    bio: staff?.bio || '',
    responsibilities: Array.isArray(staff?.responsibilities) ? staff.responsibilities : [],
    expertise: Array.isArray(staff?.expertise) ? staff.expertise : [],
    achievements: Array.isArray(staff?.achievements) ? staff.achievements : [],
    status: staff?.status || 'active',
    quote: staff?.quote || '',
    joinDate: staff?.joinDate || new Date().toISOString().split('T')[0],
    education: staff?.education || '',
    experience: staff?.experience || ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(staff?.image || '');
  const [imageError, setImageError] = useState('');


  const steps = [
    { id: 'basic', label: 'Basic Info', icon: FaUser, description: 'Personal details & role' },
    { id: 'contact', label: 'Contact', icon: FaEnvelope, description: 'Contact information' },
    { id: 'profile', label: 'Profile', icon: FaUserCircle, description: 'Image & bio' },
    { id: 'details', label: 'Details', icon: FaInfoCircle, description: 'Additional information' }
  ];

  const ROLES = [
    { value: 'Teacher', label: 'Teacher', icon: FaChalkboardTeacher, color: 'text-blue-500' },
    { value: 'Principal', label: 'Principal', icon: FaCrown, color: 'text-purple-500' },
    { value: 'Deputy Principal', label: 'Deputy Principal', icon: FaUserTie, color: 'text-green-500' },
    { value: 'BOM Member', label: 'BOM Member', icon: FaShieldAlt, color: 'text-red-500' },
    { value: 'Support Staff', label: 'Support Staff', icon: FaUsers, color: 'text-yellow-500' },
    { value: 'Librarian', label: 'Librarian', icon: FaBook, color: 'text-indigo-500' },
    { value: 'Counselor', label: 'Counselor', icon: FaHandsHelping, color: 'text-pink-500' }
  ];

  const DEPARTMENTS = [
    'Sciences', 'Mathematics', 'Languages', 'Humanities', 
    'Administration', 'Sports', 'Guidance', 'Arts', 'Technology'
  ];

  const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', icon: FaCheckCircle, color: 'text-green-600' },
    { value: 'on-leave', label: 'On Leave', icon: FaCalendar, color: 'text-yellow-600' },
    { value: 'inactive', label: 'Inactive', icon: FaTimesCircle, color: 'text-red-600' }
  ];

  useEffect(() => {
    if (staff?.image && typeof staff.image === 'string') {
      const formattedImage = staff.image.startsWith('/') ? staff.image : `/${staff.image}`;
      setImagePreview(formattedImage);
    }
  }, [staff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      return;
    }

    // Validate image is uploaded
    if (!imageFile && !staff?.image && !imagePreview) {
      setImageError('Staff image is required. Please upload an image.');
      setCurrentStep(2); // Go to profile step
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Append all form data INCLUDING gender, education, experience
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else if (key !== 'image') { // Don't append image as string
            formDataToSend.append(key, formData[key].toString());
          }
        }
      });
      
      // 🔹 IMAGE HANDLING: Image upload is REQUIRED
      // Send imageFile if exists, otherwise send empty string (backend will handle validation)
      if (imageFile) {
        // If a new file was uploaded, send it
        formDataToSend.append('image', imageFile);
      } else if (staff?.image && typeof staff.image === 'string' && staff.image.trim() !== '') {
        // If editing and image exists, send the image path
        formDataToSend.append('image', staff.image);
      } else {
        // For new staff, send empty string - backend will validate
        formDataToSend.append('image', '');
      }
      
      await onSave(formDataToSend, staff?.id);
    } catch (error) {
      throw error;
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1 && isStepValid()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleImageChange = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      setImageError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
    setImageError('');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, items) => {
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleGenderChange = (gender) => {
    setFormData(prev => ({ 
      ...prev, 
      gender 
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() && formData.role.trim();
      case 1:
        return formData.email.trim() && formData.phone.trim();
      case 2:
        // Image is required - check if we have imageFile or existing image
        return (imageFile || staff?.image || imagePreview) && !imageError;
      case 3:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-4xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                {staff ? <FaEdit className="text-xl" /> : <FaUserPlus className="text-xl" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{staff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                <p className="text-orange-100 opacity-90 mt-1">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 cursor-pointer">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3 flex-shrink-0">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg' 
                    : index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {index < currentStep ? <FaCheck className="text-xs" /> : <step.icon className="text-xs" />}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">{step.label}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-xl border border-orange-200">
                        <FaUser className="text-orange-600 text-lg" /> 
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter full name..."
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                        <FaUserTie className="text-purple-600 text-lg" /> 
                        Role <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {ROLES.map((role) => (
                          <div 
                            key={role.value} 
                            onClick={() => handleChange('role', role.value)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.role === role.value 
                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <role.icon className={`text-lg ${role.color}`} />
                              <span className="font-bold text-gray-900 text-sm">{role.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                        <FaBriefcase className="text-green-600 text-lg" /> 
                        Position
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => handleChange('position', e.target.value)}
                        placeholder="e.g., Head of Department, Class Teacher..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
                        <FaBuilding className="text-blue-600 text-lg" /> 
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 cursor-pointer"
                      >
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200">
                        <FaCalendarAlt className="text-yellow-600 text-lg" /> 
                        Join Date
                      </label>
                      <input
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => handleChange('joinDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-xl border border-pink-200">
                        <FaUserCheck className="text-pink-600 text-lg" /> 
                        Status
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {STATUS_OPTIONS.map((status) => (
                          <div 
                            key={status.value} 
                            onClick={() => handleChange('status', status.value)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.status === status.value 
                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <status.icon className={`text-lg ${status.color}`} />
                              <span className="text-xs font-bold text-gray-900">{status.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information - WITH EDUCATION & EXPERIENCE */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaPhoneAlt className="text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">Email Address <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="staff@school.edu"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">Phone Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+254 700 000 000"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Education and Experience fields - ADDED BACK */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaGraduationCap className="text-purple-600" />
                      Education
                    </h4>
                    <textarea
                      value={formData.education}
                      onChange={(e) => handleChange('education', e.target.value)}
                      placeholder="Educational background, degrees, certifications..."
                      rows="4"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-gray-50 font-medium"
                    />
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaBriefcase className="text-green-600" />
                      Experience
                    </h4>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => handleChange('experience', e.target.value)}
                      placeholder="Previous experience, years of service, special achievements..."
                      rows="4"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-gray-50 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Profile & Bio - SIMPLIFIED WITHOUT GENDER IMAGES */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaUserCircle className="text-orange-600" />
                    Profile Image & Information
                  </h3>
                  
                  {/* Gender Selection - SIMPLIFIED WITHOUT IMAGE DEPENDENCY */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Select Gender:</p>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleGenderChange('male')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 ${
                          formData.gender === 'male'
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        } transition-colors`}
                      >
                        <div className={`p-3 rounded-full ${
                          formData.gender === 'male' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <FaMale className={`text-lg ${
                            formData.gender === 'male' ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <span className={`text-sm font-bold ${
                          formData.gender === 'male' ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          Male
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGenderChange('female')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 ${
                          formData.gender === 'female'
                            ? 'border-pink-500 bg-pink-50 shadow-md' 
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        } transition-colors`}
                      >
                        <div className={`p-3 rounded-full ${
                          formData.gender === 'female' ? 'bg-pink-100' : 'bg-gray-100'
                        }`}>
                          <FaFemale className={`text-lg ${
                            formData.gender === 'female' ? 'text-pink-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <span className={`text-sm font-bold ${
                          formData.gender === 'female' ? 'text-pink-700' : 'text-gray-600'
                        }`}>
                          Female
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Image Upload - REQUIRED */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleImageRemove}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <FiX className="text-sm" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50">
                            <FiUser className="text-gray-400 text-2xl" />
                            <span className="text-xs text-gray-500 mt-1">Upload image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files[0])}
                            className="hidden"
                            id="staff-image-upload"
                            required={!staff?.image}
                          />
                          <div className="px-4 py-3 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <FaUpload className="text-orange-500" />
                            <span className="text-sm font-bold text-gray-700">
                              {imagePreview ? 'Change Image' : 'Upload Staff Image'}
                            </span>
                          </div>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          <span className="text-red-500 font-bold">* Required:</span> Upload a clear photo of the staff member (JPEG, PNG, max 5MB)
                        </p>
                        {imageError && (
                          <p className="text-xs text-red-600 mt-2 font-medium">
                            {imageError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio and Quote */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaQuoteLeft className="text-blue-600" />
                      Biography
                    </h4>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Write a brief biography about the staff member..."
                      rows="6"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-gray-50 font-medium"
                    />
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaQuoteRight className="text-purple-600" />
                      Quote
                    </h4>
                    <textarea
                      value={formData.quote}
                      onChange={(e) => handleChange('quote', e.target.value)}
                      placeholder="Inspirational quote or motto..."
                      rows="3"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-gray-50 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Additional Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaStar className="text-orange-600" />
                    Expertise & Achievements
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <ItemInput
                        label="Expertise"
                        value={formData.expertise}
                        onChange={(items) => handleArrayChange('expertise', items)}
                        placeholder="Add expertise area..."
                        icon={FiStar}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <ItemInput
                        label="Responsibilities"
                        value={formData.responsibilities}
                        onChange={(items) => handleArrayChange('responsibilities', items)}
                        placeholder="Add responsibility..."
                        icon={FiBriefcase}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <ItemInput
                    label="Achievements"
                    value={formData.achievements}
                    onChange={(items) => handleArrayChange('achievements', items)}
                    placeholder="Add achievement..."
                    icon={FaTrophy}
                    disabled={loading}
                  />
                </div>

                {/* Summary Preview */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaClipboardCheck className="text-green-600" />
                    Staff Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-bold text-gray-900 truncate">{formData.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-bold text-gray-900">{formData.role}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-bold text-gray-900">{formData.department}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-bold text-gray-900 truncate">{formData.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-bold text-gray-900">{formData.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-bold text-gray-900 capitalize">{formData.gender}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          formData.status === 'active' ? 'bg-green-100 text-green-800' : 
                          formData.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {formData.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Join Date:</span>
                        <span className="font-bold text-gray-900">{formData.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Image:</span>
                        <span className={`font-bold ${imageFile || imagePreview || staff?.image ? 'text-green-600' : 'text-red-600'}`}>
                          {imageFile || imagePreview || staff?.image ? '✓ Uploaded' : '✗ Required'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {formData.expertise.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Expertise: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.expertise.slice(0, 3).map((exp, index) => (
                          <span 
                            key={index} 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-lg text-xs font-bold"
                          >
                            {exp}
                          </span>
                        ))}
                        {formData.expertise.length > 3 && (
                          <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            +{formData.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.status === 'active' ? 'bg-green-500' : 
                    formData.status === 'on-leave' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="capitalize font-semibold">{formData.status}</span>
                </div>
                {currentStep === steps.length - 1 && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                    (imageFile || staff?.image || imagePreview) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(imageFile || staff?.image || imagePreview) ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                    {(imageFile || staff?.image || imagePreview) ? 'Ready to Save' : 'Image Required'}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition duration-200 font-bold disabled:opacity-50 cursor-pointer"
                  >
                    ← Previous
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button 
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepValid()}
                    className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition duration-200 font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    Continue →
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={loading || !isStepValid()}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-200 font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Spinner size={16} color="white" />
                        {staff ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <FaSave />
                        {staff ? 'Update Staff' : 'Save Staff'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
// Main Staff Manager Component
export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [stats, setStats] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
 const [refreshing, setRefreshing] = useState(false);

  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState('single');
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: ''
  });

  const roles = ['Principal', 'Deputy Principal', 'Teacher', 'BOM Member', 'Support Staff', 'Librarian', 'Counselor'];
  const departments = ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Administration', 'Sports', 'Guidance'];
const fetchStaff = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      setRefreshing(true); // Set refreshing to true for button spinner
    } else {
      setLoading(true); // Set loading to true for initial load
    }
    
    const response = await fetch('/api/staff');
    const data = await response.json();
    
    if (data.success) {
      setStaff(data.staff || []);
      setFilteredStaff(data.staff || []);
    } else {
      console.error('Failed to fetch staff:', data.error);
      setStaff([]);
      setFilteredStaff([]);
      showNotification('error', 'Fetch Failed', 'Failed to fetch staff data');
    }
  } catch (error) {
    console.error('Error fetching staff:', error);
    setStaff([]);
    setFilteredStaff([]);
    showNotification('error', 'Error', 'Error fetching staff data');
  } finally {
    if (isRefresh) {
      setRefreshing(false); // Turn off refreshing spinner
    } else {
      setLoading(false); // Turn off loading spinner
    }
  }
};

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    let filtered = staff;

    if (searchTerm) {
      filtered = filtered.filter(staffMember =>
        staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(staffMember => staffMember.department === selectedDepartment);
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(staffMember => staffMember.role === selectedRole);
    }

    setFilteredStaff(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedRole, staff]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showNotification = (type, title, message) => {
    setNotification({
      open: true,
      type,
      title,
      message
    });
  };

  const handleCreate = () => {
    setEditingStaff(null);
    setShowModal(true);
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setShowModal(true);
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDetailModal(true);
  };

  const handleDelete = (staffMember) => {
    setStaffToDelete(staffMember);
    setDeleteType('single');
    setShowDeleteModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedPosts.size === 0) {
      showNotification('warning', 'No Selection', 'No staff members selected for deletion');
      return;
    }
    setDeleteType('bulk');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === 'single' && staffToDelete) {
        setBulkDeleting(true);
        const response = await fetch(`/api/staff/${staffToDelete.id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          await fetchStaff();
          showNotification('success', 'Deleted', `Staff member "${staffToDelete.name}" deleted successfully!`);
        } else {
          showNotification('error', 'Delete Failed', result.error || 'Failed to delete staff member');
        }
      } else if (deleteType === 'bulk') {
        setBulkDeleting(true);
        const deletedIds = [];
        const failedIds = [];
        
        for (const staffId of selectedPosts) {
          try {
            const response = await fetch(`/api/staff/${staffId}`, {
              method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (result.success) {
              deletedIds.push(staffId);
            } else {
              console.error(`Failed to delete staff member ${staffId}:`, result.error);
              failedIds.push(staffId);
            }
          } catch (error) {
            console.error(`Error deleting staff member ${staffId}:`, error);
            failedIds.push(staffId);
          }
        }
        
        await fetchStaff();
        setSelectedPosts(new Set());
        
        if (deletedIds.length > 0 && failedIds.length === 0) {
          showNotification('success', 'Bulk Delete Successful', `Successfully deleted ${deletedIds.length} staff member(s)`);
        } else if (deletedIds.length > 0 && failedIds.length > 0) {
          showNotification('warning', 'Partial Success', `Deleted ${deletedIds.length} staff member(s), failed to delete ${failedIds.length}`);
        } else {
          showNotification('error', 'Delete Failed', 'Failed to delete selected staff members');
        }
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      showNotification('error', 'Error', 'Error during deletion');
    } finally {
      setBulkDeleting(false);
      setShowDeleteModal(false);
      setStaffToDelete(null);
    }
  };

  const handlePostSelect = (staffId, selected) => {
    setSelectedPosts(prev => { 
      const newSet = new Set(prev); 
      selected ? newSet.add(staffId) : newSet.delete(staffId); 
      return newSet; 
    });
  };
const handleSubmit = async (formData, id) => {
  setSaving(true);
  try {
    let response;
    if (id) {
      response = await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        body: formData,
      });
    } else {
      response = await fetch('/api/staff', {
        method: 'POST',
        body: formData,
      });
    }

    const result = await response.json();

    if (result.success) {
      await fetchStaff();
      setShowModal(false);
      showNotification('success', id ? 'Updated' : 'Created', 
        `Staff member ${id ? 'updated' : 'created'} successfully!`);
    } else {
      // Handle specific error for missing image
      if (result.error?.includes('image') || result.error?.includes('Image')) {
        showNotification('error', 'Image Required', 
          'Staff image is required. Please upload an image.');
      } else {
        showNotification('error', 'Save Failed', 
          result.error || `Failed to ${id ? 'update' : 'create'} staff member`);
      }
    }
  } catch (error) {
    console.error('Error saving staff member:', error);
    showNotification('error', 'Error', 'Error saving staff member');
  } finally {
    setSaving(false);
  }
};

  useEffect(() => {
    const calculatedStats = {
      total: staff.length,
      teaching: staff.filter(s => s.role === 'Teacher').length,
      administration: staff.filter(s => s.role === 'Principal' || s.role === 'Deputy Principal').length,
      bom: staff.filter(s => s.role === 'BOM Member').length,
      active: staff.filter(s => s.status === 'active').length,
      onLeave: staff.filter(s => s.status === 'on-leave').length,
    };
    setStats(calculatedStats);
  }, [staff]);

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700 font-medium">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStaff.length)} of {filteredStaff.length} staff members
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
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
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

  if (loading && staff.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <Spinner size={48} />
          <p className="text-gray-700 text-lg mt-4 font-medium">
            Loading Staff…
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Please wait while we fetch staff data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      <Notification
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => !bulkDeleting && setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        type={deleteType}
        count={deleteType === 'bulk' ? selectedPosts.size : 1}
        staffName={deleteType === 'single' ? staffToDelete?.name : ''}
        loading={bulkDeleting}
      />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg border border-orange-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Staff & BOM Management</h1>
            <p className="text-gray-600 text-sm lg:text-base">Manage teaching staff, administration, and board members</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
<button 
  onClick={() => fetchStaff(true)} 
  disabled={refreshing}
  className="flex items-center gap-2 bg-gray-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-bold shadow-lg disabled:opacity-70 cursor-pointer text-sm"
>
  {refreshing ? (
    <>
      <div className="w-4 h-4">
        <CircularProgress size={16} color="inherit" />
      </div>
      Refreshing...
    </>
  ) : (
    <>
      <FiRotateCw className="text-xs" /> Refresh
    </>
  )}
</button>
            <button onClick={handleCreate} className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm">
              <FiPlus className="text-xs" /> Add Staff
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
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Total Staff</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <FiUser className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Teaching Staff</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.teaching}</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <FiBook className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Administration</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.administration}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <FiAward className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">BOM Members</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.bom}</p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                <FiShield className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Active</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <FiCheckCircle className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">On Leave</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.onLeave}</p>
              </div>
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
                <FiCalendar className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff members by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-gray-50"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.size > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <FiTrash2 className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg">
                  {selectedPosts.size} staff {selectedPosts.size === 1 ? 'member' : 'members'} selected
                </h3>
                <p className="text-red-700 text-sm">
                  You can perform bulk actions on selected items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedPosts(new Set())}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm"
              >
                Clear Selection
              </button>
              <button 
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2 text-sm"
              >
                {bulkDeleting ? (
                  <>
                    <Spinner size={16} color="white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete Selected ({selectedPosts.size})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {currentStaff.map((staffMember) => (
          <ModernStaffCard 
            key={staffMember.id} 
            staff={staffMember} 
            onEdit={handleEdit} 
            onDelete={() => handleDelete(staffMember)} 
            onView={handleViewDetails} 
            selected={selectedPosts.has(staffMember.id)} 
            onSelect={handlePostSelect} 
            actionLoading={saving}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentStaff.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
          <FiUser className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No staff members found' : 'No staff members available'}
          </h3>
          <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first staff member'}
          </p>
          <button 
            onClick={handleCreate} 
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 mx-auto text-sm lg:text-base cursor-pointer"
          >
            <FiPlus /> Add Your First Staff Member
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredStaff.length > 0 && (
        <Pagination />
      )}

      {/* Modals */}
      {showModal && (
        <ModernStaffModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSubmit} 
          staff={editingStaff} 
          loading={saving} 
        />
      )}
      {showDetailModal && selectedStaff && (
        <ModernStaffDetailModal 
          staff={selectedStaff} 
          onClose={() => setShowDetailModal(false)} 
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}