'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  FiPlus,
  FiSearch,
  FiCalendar,
  FiUsers,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUpload,
  FiRotateCw,
  FiTrendingUp,
  FiAward,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheck,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiBriefcase,
  FiPaperclip,
  FiFileText,
  FiDownload,
  FiSend,
  FiTarget,
  FiBarChart,
  FiPercent,
  FiStar,
  FiBookOpen,
  FiArchive,
  FiTag,
  FiMail,
  FiUserCheck,
  FiFilter,
  FiHardDrive,
  FiGlobe,
  FiShield,
  FiFolder,
  FiVideo,
  FiImage,
  FiMusic,
  FiFile,
  FiGrid,
  FiSliders,
  FiSortAlphaDown,
  FiSortAlphaUp
} from 'react-icons/fi';

import {
  IoDocumentTextOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoBookOutline,
  IoStatsChartOutline,
  IoChevronForwardOutline,
  IoCheckmarkCircleOutline
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

// Delete Confirmation Modal
function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  type = 'single',
  itemName = '',
  itemType = 'resource',
  loading = false,
  count = 1
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
                  ? `Delete ${count} ${count === 1 ? 'resource' : 'resources'}?`
                  : `Delete "${itemName}"?`
                }
              </h3>
              <p className="text-gray-600">
                {type === 'bulk'
                  ? `You are about to delete ${count} ${count === 1 ? 'resource' : 'resources'}. All associated files will be permanently removed.`
                  : `This ${itemType} will be permanently deleted. All associated files will be removed.`
                }
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">
                <span className="font-bold">Warning:</span> This action cannot be undone. All files will be permanently deleted.
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
                  {type === 'bulk' ? `Delete ${count} Resources` : `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}
                </>
              )}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  )
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
      case 'info': return <FiAlertCircle className="text-xl" />;
      default: return <FiAlertCircle className="text-xl" />;
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

      </div>
    </div>
  )
}

// Modern Resource Detail Modal
function ModernResourceDetailModal({ resource, onClose, onEdit }) {
  if (!resource) return null;

  // File type colors
  const getFileTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'document': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'video': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      case 'presentation': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
      case 'image': return { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' };
      case 'audio': return { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' };
      case 'spreadsheet': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  // Access level colors
  const getAccessColor = (access) => {
    switch (access?.toLowerCase()) {
      case 'student': return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'teacher': return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'admin': return { bg: 'bg-purple-100', text: 'text-purple-800' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const typeColor = getFileTypeColor(resource.type);
  const accessColor = getAccessColor(resource.accessLevel);

  // Get file icon based on type
  const getFileIcon = () => {
    switch (resource.type?.toLowerCase()) {
      case 'pdf': return <FiFileText className="text-red-600 text-2xl" />;
      case 'document': return <FiFileText className="text-blue-600 text-2xl" />;
      case 'video': return <FiVideo className="text-purple-600 text-2xl" />;
      case 'presentation': return <FiBarChart className="text-orange-600 text-2xl" />;
      case 'image': return <FiImage className="text-pink-600 text-2xl" />;
      case 'audio': return <FiMusic className="text-indigo-600 text-2xl" />;
      case 'spreadsheet': return <FiGrid className="text-green-600 text-2xl" />;
      default: return <FiFile className="text-gray-600 text-2xl" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95%',
        maxWidth: '900px',
        maxHeight: '95vh', bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f8ff 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiFolder className="text-xl sm:text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold truncate">Resource Details</h2>
                <p className="text-white/90 opacity-90 mt-1 text-sm sm:text-lg">
                  Complete educational resource information
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
             
              <button 
                onClick={onClose} 
                className="p-2 sm:p-3 bg-white/10 text-white rounded-full cursor-pointer"
              >
                <FiX className="text-xl sm:text-2xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(95vh-140px)] overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8 space-y-8">
            {/* Resource Title and Status */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 break-words">
                {resource.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${typeColor.bg} ${typeColor.text} border ${typeColor.border}`}>
                  {resource.type?.charAt(0).toUpperCase() + resource.type?.slice(1) || 'Document'}
                </span>
                {resource.accessLevel && (
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${accessColor.bg} ${accessColor.text}`}>
                    {resource.accessLevel} Access
                  </span>
                )}
                {resource.category && (
                  <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    {resource.category}
                  </span>
                )}
                {resource.className && (
                  <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-800 border border-blue-200">
                    Class: {resource.className}
                  </span>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Description and Files */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description - Full Width */}
                <div className="w-full">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <IoDocumentTextOutline className="text-blue-600" />
                    Description
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                      {resource.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                {/* Files Section - Full Width */}
                {Array.isArray(resource.files) && resource.files.length > 0 && (
                  <div className="w-full space-y-4">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <FiPaperclip className="text-orange-600" />
                      Files ({resource.files.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {resource.files.slice(0, 4).map((file, index) => (
                        <div key={index} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-orange-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                {getFileIcon()}
                              </div>
                              <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate">
  {file.name.replace(/^[\d-]+/, "")}
</h4>
                            
                              </div>
                            </div>
                          
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            {file.extension && (
                              <span className="font-medium text-gray-700">
                                {file.extension.toUpperCase()}
                              </span>
                            )}
                            {file.uploadedAt && (
                              <span className="text-gray-500">
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Information Panel */}
<div className="space-y-6">
  {/* Modernized Resource Information Card */}
  <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center gap-2 mb-6 px-1">
      <div className="p-2 bg-blue-50 rounded-lg">
        <FiBriefcase className="text-blue-600" size={18} />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
        Resource Metadata
      </h3>
    </div>

    {/* Information Grid */}
    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
      {/* Teacher Row - Full width if needed or half */}
      {resource.teacher && (
        <div className="col-span-2 flex flex-col p-3 bg-slate-50/50 rounded-2xl border border-slate-50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">Lead Teacher</span>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
               <FiUserCheck className="text-white" size={16} />
            </div>
            <span className="text-slate-700 font-bold text-sm sm:text-base truncate">
              {resource.teacher}
            </span>
          </div>
        </div>
      )}

      {/* Uploaded By */}
      <div className="flex flex-col px-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Publisher</span>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
            <FiUsers className="text-emerald-500" size={14} />
          </div>
          <span className="text-slate-700 font-bold text-xs sm:text-sm truncate">
            {resource.uploadedBy || 'System'}
          </span>
        </div>
      </div>

      {/* Files Count */}
      <div className="flex flex-col px-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Assets</span>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0">
            <FiFile className="text-purple-500" size={14} />
          </div>
          <span className="text-slate-700 font-bold text-xs sm:text-sm">
            {resource.files?.length || 0} items
          </span>
        </div>
      </div>

      {/* Downloads Stats */}
      <div className="flex flex-col px-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Popularity</span>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
            <FiDownload className="text-red-500" size={14} />
          </div>
        
        </div>
      </div>
    </div>
  </div>
</div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                onClick={onClose} 
                className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg cursor-pointer text-sm sm:text-base"
              >
                Close
              </button>
              <button 
                onClick={() => onEdit(resource)} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg cursor-pointer text-sm sm:text-base"
              >
                <FiEdit size={16} /> Edit Resource
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Modern Resource Card Component - UPDATED WITH SELECTION CHECKBOX
function ModernResourceCard({ resource, onEdit, onDelete, onView, selected, onSelect, actionLoading }) {
  // File type colors
  const getFileTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
      case 'document': return { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' };
      case 'video': return { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' };
      case 'presentation': return { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' };
      case 'image': return { bg: 'bg-pink-100', text: 'text-pink-800', dot: 'bg-pink-500' };
      case 'audio': return { bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-500' };
      case 'spreadsheet': return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };
    }
  };

  // Access level colors
  const getAccessColor = (access) => {
    switch (access?.toLowerCase()) {
      case 'student': return 'text-blue-500';
      case 'teacher': return 'text-green-500';
      case 'admin': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const typeColor = getFileTypeColor(resource.type);
  const accessColor = getAccessColor(resource.accessLevel);

  // Get file icon based on type
  const getFileIcon = () => {
    switch (resource.type?.toLowerCase()) {
      case 'pdf': return <FiFileText className="text-red-500" />;
      case 'document': return <FiFileText className="text-blue-500" />;
      case 'video': return <FiVideo className="text-purple-500" />;
      case 'presentation': return <FiBarChart className="text-orange-500" />;
      case 'image': return <FiImage className="text-pink-500" />;
      case 'audio': return <FiMusic className="text-indigo-500" />;
      case 'spreadsheet': return <FiGrid className="text-green-500" />;
      default: return <FiFile className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate total size
  const totalSize = Array.isArray(resource.files) 
    ? resource.files.reduce((acc, file) => acc + (file.size || 0), 0)
    : resource.size || 0;

  return (
    <div className={`bg-white rounded-[2rem] shadow-xl border ${
      selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-100'
    } w-full max-w-md overflow-hidden transition-none hover:shadow-2xl  cursor-pointer`} onClick={() => onView(resource)}>
      
      {/* Header with Type and Selection Checkbox */}
      <div className={`p-6 ${typeColor.bg} border-b ${typeColor.text} border-opacity-20 relative`}>
        {/* Selection Checkbox */}
        <div className="absolute top-4 left-4 z-10">
          <input 
            type="checkbox" 
            checked={selected} 
            onChange={(e) => {
              e.stopPropagation();
              onSelect(resource.id, e.target.checked);
            }}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div className="flex items-center justify-between mb-4 pl-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${typeColor.dot}`}></div>
            <span className={`text-xs font-bold ${typeColor.text} uppercase tracking-wider`}>
              {resource.type || 'Document'}
            </span>
          </div>
          {resource.accessLevel && (
            <div className="flex items-center gap-1">
              <FiShield className={`text-xs ${accessColor}`} />
              <span className={`text-xs font-bold ${accessColor}`}>
                {resource.accessLevel}
              </span>
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 leading-tight line-clamp-2">
          {resource.title}
        </h3>
        
        <p className="text-sm font-medium text-slate-400 mt-2 line-clamp-2">
          {resource.description || 'No description available.'}
        </p>
      </div>

      {/* Information Section */}
      <div className="p-6">
        {/* Grid Info Mapping */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
          {/* Subject */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Subject</span>
            <div className="flex items-center gap-2">
              <IoBookOutline className="text-blue-400 text-sm" />
              <span className="text-xs font-bold text-slate-700 truncate">
                {resource.subject || 'No Subject'}
              </span>
            </div>
          </div>
          
          {/* Class */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Class</span>
            <div className="flex items-center gap-2">
              <FiUsers className="text-purple-400 text-sm" />
              <span className="text-xs font-bold text-slate-700">
                {resource.className}
              </span>
            </div>
          </div>

          {/* Teacher */}
          {resource.teacher && (
            <div className="col-span-2 p-3 bg-blue-50 rounded-2xl flex items-center justify-between border border-blue-100/50">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-blue-400 font-black uppercase tracking-[0.1em]">Teacher</span>
                <span className="text-xs font-bold text-blue-800 truncate">{resource.teacher}</span>
              </div>
              <FiUserCheck className="text-blue-300 text-lg shrink-0 ml-2" />
            </div>
          )}

          {/* Files */}
          <div className="col-span-2 p-3 bg-emerald-50 rounded-2xl flex items-center justify-between border border-emerald-100/50">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.1em]">Files</span>
              <span className="text-xs font-bold text-emerald-800 truncate">
                {Array.isArray(resource.files) ? `${resource.files.length} file(s)` : '1 file'} • {formatFileSize(totalSize)}
              </span>
            </div>
            <FiPaperclip className="text-emerald-300 text-lg shrink-0 ml-2" />
          </div>
        </div>



        {/* Modern Action Bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onView(resource);
            }}
            className="px-5 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-none active:bg-slate-200 cursor-pointer"
          >
            View
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(resource);
            }}
            disabled={actionLoading}
            className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-50 transition-none active:scale-[0.98] cursor-pointer"
          >
            Edit
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(resource);
            }}
            disabled={actionLoading}
            className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 disabled:opacity-50 transition-none active:bg-red-100 cursor-pointer"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Modern Resource Modal Component (Create/Edit) - WITH MULTIPLE FILE SUPPORT
function ModernResourceModal({ onClose, onSave, resource, loading }) {
 // At the top of ModernResourceModal component, make sure you have:
const [formData, setFormData] = useState({
  title: resource?.title || '',
  description: resource?.description || '',
  subject: resource?.subject || '',
  className: resource?.className || '',
  teacher: resource?.teacher || '',
  category: resource?.category || 'General',
  accessLevel: resource?.accessLevel || 'student',
  uploadedBy: resource?.uploadedBy || 'Admin',
  isActive: resource?.isActive ?? true
});

const [files, setFiles] = useState([]); // New files to upload
const [existingFiles, setExistingFiles] = useState([]); // Existing files from resource
const [filesToRemove, setFilesToRemove] = useState([]); // Files to delete

// Add this useEffect to properly initialize existingFiles
useEffect(() => {
  if (resource?.files) {
    try {
      // Handle different file formats
      const filesArray = Array.isArray(resource.files) ? resource.files : [];
      const formattedFiles = filesArray.map(file => {
        // Ensure each file has required properties
        const fileName = file.name || (typeof file === 'string' ? file : 'Unknown');
        const fileUrl = file.url || (typeof file === 'string' ? file : '');
        
        return {
          url: fileUrl,
          name: fileName,
          size: file.size || 0,
          extension: file.extension || fileName.split('.').pop()?.toLowerCase() || 'unknown',
          uploadedAt: file.uploadedAt || new Date().toISOString()
        };
      });
      
      setExistingFiles(formattedFiles);
    } catch (error) {
      console.error('Error parsing resource files:', error);
      setExistingFiles([]);
    }
  }
}, [resource]);
  // Class options
  const classOptions = [
    'Form 1',
    'Form 2', 
    'Form 3',
    'Form 4',
    'Form 5',
    'Form 6'
  ];

  // Subject options
  const subjectOptions = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Art',
    'Music',
    'Physical Education',
    'Geography'
  ];

  // Category options
  const categoryOptions = [
    'General',
    'Lesson Notes',
    'Past Papers',
    'Reference Materials',
    'Study Guides',
    'Worksheets',
    'Presentations',
    'Videos',
    'Audio Resources',
    'Other'
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));
    setFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

const removeFile = (index, isExisting = false) => {
  if (isExisting) {
    const file = existingFiles[index];
    if (file?.url) {
      setFilesToRemove(prev => [...prev, file.url]);
    }
    setExistingFiles(prev => prev.filter((_, i) => i !== index));
  } else {
    // Remove preview URL if it exists
    if (files[index]?.preview) {
      URL.revokeObjectURL(files[index].preview);
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!formData.title.trim() || !formData.subject || !formData.className || !formData.teacher) {
    alert('Please fill in all required fields');
    return;
  }
  
  if (files.length === 0 && existingFiles.length === 0 && !resource) {
    alert('Please upload at least one file');
    return;
  }

  // Create FormData for submission
  const formDataToSend = new FormData();
  
  // Add form data
  Object.keys(formData).forEach(key => {
    if (key === 'isActive') {
      formDataToSend.append(key, formData[key] ? 'true' : 'false');
    } else {
      formDataToSend.append(key, formData[key]);
    }
  });

  // Add action type
  formDataToSend.append('action', 'update');

  // Handle files for CREATE vs UPDATE
  if (resource) {
// When preparing existing files for the update:
const filesToKeep = existingFiles
  .filter(file => !filesToRemove.some(url => url === file.url))
  .map(file => {
    // Ensure file has required properties
    return {
      url: file.url || '',
      name: file.name || 'Unknown File',
      size: file.size || 0,
      extension: file.extension || file.name?.split('.').pop()?.toLowerCase() || 'unknown',
      uploadedAt: file.uploadedAt || new Date().toISOString()
    };
  });

if (filesToKeep.length > 0) {
  formDataToSend.append('existingFiles', JSON.stringify(filesToKeep));
}
    // Add files to remove
    if (filesToRemove.length > 0) {
      formDataToSend.append('filesToRemove', JSON.stringify(filesToRemove));
    }
  }

  // Add new files (for both CREATE and UPDATE)
  files.forEach(fileObj => {
    if (fileObj.file && !fileObj.isExisting) {
      formDataToSend.append('files', fileObj.file);
    }
  });

  await onSave(formDataToSend, resource?.id);
};

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal open={true} onClose={loading ? undefined : onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95%',
        maxWidth: '900px',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #faf5ff 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiFolder className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{resource ? 'Edit' : 'Create'} Resource</h2>
                <p className="text-white/90 opacity-90 mt-1 text-sm">
                  Upload educational materials and resources
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

        <div className="max-h-[calc(95vh-150px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title - Full Width */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Resource Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 font-bold py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Enter resource title"
              />
            </div>

            {/* Subject and Class in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Subject *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                >
                  <option value="">Select Subject</option>
                  {subjectOptions.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Class *
                </label>
                <select
                  required
                  value={formData.className}
                  onChange={(e) => handleChange('className', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                >
                  <option value="">Select Class</option>
                  {classOptions.map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Teacher - Full Width */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Teacher *
              </label>
              <input
                type="text"
                required
                value={formData.teacher}
                onChange={(e) => handleChange('teacher', e.target.value)}
                className="w-full px-4 py-3 font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                placeholder="Enter teacher's name"
              />
            </div>

            {/* Description - Full Width */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Describe the resource..."
              />
            </div>

            {/* Category and Access Level in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Access Level
                </label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) => handleChange('accessLevel', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Uploaded By and Active Status in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Uploaded By
                </label>
                <input
                  type="text"
                  value={formData.uploadedBy}
                  onChange={(e) => handleChange('uploadedBy', e.target.value)}
                  className="w-full px-4 py-3 font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                  placeholder="Enter uploader name"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-base font-bold text-gray-800 cursor-pointer">
                  Active (Visible to users)
                </label>
              </div>
            </div>

<div className="w-full lg:w-[75%] mx-auto flex flex-col space-y-8">
  <section className="bg-white rounded-[32px] p-2 sm:p-4">
    <div className="flex items-center gap-3 mb-6 px-2">
      <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
      <label className="text-xl font-black text-slate-800 tracking-tight">
        Upload Resources *
      </label>
    </div>

    <div className="space-y-6">
      {/* 1. Modern Dropzone Area */}
      <div className="relative group">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="resourceFiles"
        />
        <label 
          htmlFor="resourceFiles" 
          className="cursor-pointer w-full py-10 border-2 border-dashed border-slate-200 rounded-[24px] bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-400 transition-all flex flex-col items-center justify-center text-center px-6"
        >
          <div className="p-4 bg-white shadow-sm rounded-2xl mb-4 group-hover:scale-100 transition-transform">
            <FiUpload className="text-blue-600 text-3xl" />
          </div>
          <p className="text-lg font-bold text-slate-800 mb-1">
            Drag & drop files or <span className="text-blue-600">browse</span>
          </p>
          <p className="text-slate-500 text-sm max-w-xs">
            PDF, DOC, PPT, XLS, Images, Videos, or Audio
          </p>
          <div className="mt-4 flex gap-3">
             <span className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Max 10MB
             </span>
          </div>
        </label>
      </div>

      {/* 2. Uploaded Files List */}
      {(files.length > 0 || existingFiles.length > 0) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Selected Assets ({files.length + existingFiles.length})
            </h4>
          </div>

          <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {/* New Files Segment */}
            {files.map((fileObj, index) => (
              <div key={`new-${index}`} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <FiFileText className="text-emerald-600 text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{fileObj.name}</p>
                    <p className="text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
                      Ready to Upload • {formatFileSize(fileObj.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index, false)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            ))}

            {/* Existing Files Segment */}
            {existingFiles.map((file, index) => (
              <div key={`exist-${index}`} className="group flex items-center justify-between p-4 bg-blue-50/30 border border-blue-100 rounded-2xl hover:shadow-sm transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <FiFileText className="text-white text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">{file.name || 'Cloud Resource'}</p>
                    <p className="text-blue-600 text-[11px] font-bold uppercase tracking-wider">
                      Stored in Cloud • {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index, true)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
</div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button 
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 cursor-pointer text-sm"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-sm"
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} className="text-white" />
                    {resource ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    {resource ? <FiEdit /> : <FiUpload />}
                    {resource ? 'Update Resource' : 'Upload Resource'}
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

// Main Resources Manager Component
export default function ResourcesManager() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState(null);
  
  // NEW: Bulk delete states
  const [selectedResources, setSelectedResources] = useState(new Set());
  const [deleteType, setDeleteType] = useState('single');
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' }
  ];

  // Type options
  const typeOptions = [
    { value: 'all', label: 'All Types', color: 'gray', icon: <FiFolder /> },
    { value: 'document', label: 'Document', color: 'blue', icon: <FiFileText /> },
    { value: 'pdf', label: 'PDF', color: 'red', icon: <FiFileText /> },
    { value: 'video', label: 'Video', color: 'purple', icon: <FiVideo /> },
    { value: 'presentation', label: 'Presentation', color: 'orange', icon: <FiBarChart /> },
    { value: 'spreadsheet', label: 'Spreadsheet', color: 'green', icon: <FiGrid /> },
    { value: 'image', label: 'Image', color: 'pink', icon: <FiImage /> },
    { value: 'audio', label: 'Audio', color: 'indigo', icon: <FiMusic /> },
    { value: 'archive', label: 'Archive', color: 'gray', icon: <FiArchive /> }
  ];

  // Priority options
  const accessOptions = [
    { value: 'all', label: 'All Access', color: 'gray' },
    { value: 'student', label: 'Student', color: 'blue' },
    { value: 'teacher', label: 'Teacher', color: 'green' },
    { value: 'admin', label: 'Admin', color: 'purple' }
  ];

  // Subject options
  const subjectOptions = [
    'All Subjects',
    'Mathematics',
    'Science',
    'English',
    'History',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Art',
    'Music',
    'Physical Education',
    'Geography'
  ];

  // Category options
  const categoryOptions = [
    'All Categories',
    'General',
    'Lesson Notes',
    'Past Papers',
    'Reference Materials',
    'Study Guides',
    'Worksheets',
    'Presentations',
    'Videos',
    'Audio Resources',
    'Other'
  ];

  // Class options
  const classOptions = [
    'All Classes',
    'Form 1',
    'Form 2', 
    'Form 3',
    'Form 4',
    'Form 5',
    'Form 6'
  ];

  // Notification handler
  const showNotification = (type, title, message) => {
    setNotification({
      open: true,
      type,
      title,
      message
    });
  };

  // Map API data to our component structure
  const mapResourceData = (apiResource) => {
    return {
      id: apiResource.id,
      title: apiResource.title || 'Untitled Resource',
      description: apiResource.description || '',
      subject: apiResource.subject || 'General',
      className: apiResource.className || '',
      teacher: apiResource.teacher || '',
      category: apiResource.category || 'General',
      type: apiResource.type || 'document',
      files: apiResource.files || [],
      accessLevel: apiResource.accessLevel || 'student',
      uploadedBy: apiResource.uploadedBy || 'System',
      downloads: apiResource.downloads || 0,
      isActive: apiResource.isActive ?? true,
      createdAt: apiResource.createdAt || new Date().toISOString(),
      updatedAt: apiResource.updatedAt || new Date().toISOString(),
      
      // Legacy fields for compatibility
      size: apiResource.size || 0
    };
  };

  // NEW: Handle resource selection for bulk delete
  const handleResourceSelect = (resourceId, selected) => {
    setSelectedResources(prev => { 
      const newSet = new Set(prev); 
      selected ? newSet.add(resourceId) : newSet.delete(resourceId); 
      return newSet; 
    });
  };

  // NEW: Bulk delete function
  const handleBulkDelete = () => {
    if (selectedResources.size === 0) {
      showNotification('warning', 'No Selection', 'No resources selected for deletion');
      return;
    }
    setDeleteType('bulk');
    setShowDeleteModal(true);
  };

  // Fetch resources
  const fetchResources = async (isRefresh = false) => {
    setSelectedType('all');
    setSelectedSubject('All Subjects');
    setSelectedCategory('All Categories');
    setSelectedClass('All Classes');
    setSelectedAccessLevel('all');
    setSelectedStatus('all');
    setSearchTerm('');
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await fetch('/api/resources', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && Array.isArray(result.resources)) {
        const mappedResources = result.resources.map(mapResourceData);
        setResources(mappedResources);
        setFilteredResources(mappedResources);
        calculateStats(mappedResources);
        
        if (mappedResources.length === 0) {
          showNotification('info', 'No Resources', 'No resources found in the system.');
        } else {
          showNotification('success', 'Loaded', `${mappedResources.length} resources loaded successfully!`);
        }
      } else if (result.success && result.resources === null) {
        setResources([]);
        setFilteredResources([]);
        calculateStats([]);
        showNotification('info', 'No Resources', 'No resources found in the system.');
      } else {
        throw new Error(result.error || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      showNotification('error', 'Load Failed', error.message || 'Failed to load resources. Please try again.');
      setResources([]);
      setFilteredResources([]);
      calculateStats([]);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Calculate statistics
  const calculateStats = (resourcesList) => {
    const stats = {
      total: resourcesList.length,
      active: resourcesList.filter(r => r.isActive === true).length,
      inactive: resourcesList.filter(r => r.isActive === false).length,
      totalFiles: resourcesList.reduce((acc, r) => acc + (Array.isArray(r.files) ? r.files.length : 1), 0),
      totalDownloads: resourcesList.reduce((acc, r) => acc + (r.downloads || 0), 0),
      studentAccess: resourcesList.filter(r => r.accessLevel === 'student').length,
      teacherAccess: resourcesList.filter(r => r.accessLevel === 'teacher').length,
      adminAccess: resourcesList.filter(r => r.accessLevel === 'admin').length,
      
      // Class stats
      form1: resourcesList.filter(r => r.className === 'Form 1').length,
      form2: resourcesList.filter(r => r.className === 'Form 2').length,
      form3: resourcesList.filter(r => r.className === 'Form 3').length,
      form4: resourcesList.filter(r => r.className === 'Form 4').length
    };
    setStats(stats);
  };

  // Initial load
  useEffect(() => {
    fetchResources();
  }, []);

  // Filter resources
  useEffect(() => {
    let filtered = resources;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.subject && resource.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.teacher && resource.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Subject filter
    if (selectedSubject !== 'All Subjects') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Class filter
    if (selectedClass !== 'All Classes') {
      filtered = filtered.filter(resource => resource.className === selectedClass);
    }

    // Access level filter
    if (selectedAccessLevel !== 'all') {
      filtered = filtered.filter(resource => resource.accessLevel === selectedAccessLevel);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(resource => 
        selectedStatus === 'active' ? resource.isActive === true : resource.isActive === false
      );
    }

    setFilteredResources(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedSubject, selectedCategory, selectedClass, selectedAccessLevel, selectedStatus, resources]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // View resource
  const handleView = (resource) => {
    setSelectedResource(resource);
    setShowDetailModal(true);
  };

  // Edit resource
  const handleEdit = (resource) => {
    setEditingResource(resource);
    setShowModal(true);
  };

  // Delete resource - single
  const handleDeleteClick = (resource) => {
    setResourceToDelete(resource);
    setDeleteType('single');
    setShowDeleteModal(true);
  };

  // Confirm delete - handles both single and bulk
  const confirmDelete = async () => {
    if (deleteType === 'single' && !resourceToDelete) return;
    
    setDeleting(true);
    setBulkDeleting(true);
    
    try {
      if (deleteType === 'single' && resourceToDelete) {
        // Single delete
        const response = await fetch(`/api/resources/${resourceToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const result = await response.json();
        
        if (result.success) {
          setResources(prev => prev.filter(r => r.id !== resourceToDelete.id));
          setFilteredResources(prev => prev.filter(r => r.id !== resourceToDelete.id));
          showNotification('success', 'Deleted', 'Resource deleted successfully!');
        } else {
          throw new Error(result.error);
        }
      } else if (deleteType === 'bulk') {
        // Bulk delete
        const deletedIds = [];
        const failedIds = [];
        
        // Delete each selected resource
        for (const resourceId of selectedResources) {
          try {
            const response = await fetch(`/api/resources/${resourceId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            const result = await response.json();
            
            if (result.success) {
              deletedIds.push(resourceId);
            } else {
              console.error(`Failed to delete resource ${resourceId}:`, result.error);
              failedIds.push(resourceId);
            }
          } catch (error) {
            console.error(`Error deleting resource ${resourceId}:`, error);
            failedIds.push(resourceId);
          }
        }
        
        // Refresh the list
        await fetchResources();
        setSelectedResources(new Set());
        
        if (deletedIds.length > 0 && failedIds.length === 0) {
          showNotification('success', 'Bulk Delete Successful', `Successfully deleted ${deletedIds.length} resource(s)`);
        } else if (deletedIds.length > 0 && failedIds.length > 0) {
          showNotification('warning', 'Partial Success', `Deleted ${deletedIds.length} resource(s), failed to delete ${failedIds.length}`);
        } else {
          showNotification('error', 'Delete Failed', 'Failed to delete selected resources');
        }
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      showNotification('error', 'Delete Failed', 'Failed to delete resource');
    } finally {
      setDeleting(false);
      setBulkDeleting(false);
      setShowDeleteModal(false);
      setResourceToDelete(null);
    }
  };

const handleSubmit = async (formData, id) => {
  setSaving(true);
  try {
    let response;
    
    if (id) {
      // Update existing resource
      response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type for FormData
      });
    } else {
      // Create new resource
      response = await fetch('/api/resources', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type for FormData
      });
    }
    
    const result = await response.json();

    if (result.success) {
      // Refresh the list
      await fetchResources();
      setShowModal(false);
      showNotification(
        'success',
        id ? 'Updated' : 'Created',
        `Resource ${id ? 'updated' : 'created'} successfully!`
      );
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error saving resource:', error);
    showNotification('error', 'Save Failed', error.message || `Failed to ${id ? 'update' : 'create'} resource`);
  } finally {
    setSaving(false);
  }
};
  // Create new resource
  const handleCreate = () => {
    setEditingResource(null);
    setShowModal(true);
  };

  // Pagination Component
  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700 font-medium">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredResources.length)} of {filteredResources.length} resources
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
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
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

  // Loading state
  if (loading && resources.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <div className="text-center">
          <Spinner size={48} />
          <p className="text-gray-700 text-lg mt-4 font-medium">
            Loading Resources
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Please wait while we fetch educational resources.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
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
        onClose={() => !deleting && !bulkDeleting && setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        type={deleteType}
        count={deleteType === 'bulk' ? selectedResources.size : 1}
        itemName={deleteType === 'single' ? resourceToDelete?.title : ''}
        itemType="resource"
        loading={deleting || bulkDeleting}
      />


{/* Modern Responsive Header with Bronze Gradient */}
<div className="relative mb-6 sm:mb-8 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-700 p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl">
  {/* Background Pattern - Optimized for performance */}
  <div className="absolute inset-0 opacity-[0.08] sm:opacity-10 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-yellow-500/5" />
  </div>
  
  {/* Gold Glow Effect - Responsive sizes */}
 <div className="absolute -right-16 sm:-right-24 -top-16 sm:-top-24 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full opacity-15 sm:opacity-20 blur-xl sm:blur-2xl md:blur-3xl" />

<div className="absolute -left-16 sm:-left-24 -bottom-16 sm:-bottom-24 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full opacity-10 sm:opacity-15 blur-xl sm:blur-2xl md:blur-3xl" />

  <div className="relative z-10">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
      {/* Left Content - Title & Description */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Icon Container */}
          <div className="relative self-start shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-60 sm:opacity-70" />
           
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            {/* Badge - Hidden on smallest screens */}
            <div className="hidden xs:inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2 sm:mb-3 max-w-max">
              <FiShield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              <span className="text-[10px] xs:text-xs font-bold text-white uppercase tracking-wide sm:tracking-widest">Secure Portal</span>
            </div>
            
            {/* Title */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
              Resources <span className="block sm:inline">& </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-200">
                Manager
              </span>
            </h1>
            
            {/* Description - Responsive sizing and line clamping */}
            <p className="text-amber-100/90 mt-2 sm:mt-3 text-sm xs:text-base sm:text-lg font-medium max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
  Centralized hub for uploading, organizing, and securely managing learning resources and documents.
</p>

          </div>
        </div>
      </div>
      
      {/* Right Content - Stats & Buttons */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between lg:flex-col lg:items-end gap-3 sm:gap-4">
        {/* Today's Sessions Counter - Responsive positioning */}
        <div className="flex items-center gap-2 xs:gap-3 lg:hidden">
          <div className="flex flex-col items-start">
            <span className="text-[10px] xs:text-xs font-bold text-amber-200/70 uppercase tracking-wide">Today</span>
            <span className="text-xl xs:text-2xl font-black text-white">{stats.today || 0}</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
        </div>
        
         {/* Buttons */}
      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">
        
        {/* Refresh */}
        <button
          onClick={() => fetchResources(true)}
          disabled={refreshing}
          className="group relative flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3
                     bg-white/10 backdrop-blur-sm border border-white/20
                     rounded-xl sm:rounded-2xl text-white font-semibold
                     hover:bg-white/15 active:scale-95 transition-all
                     disabled:opacity-60 w-full xs:w-auto"
        >
          {refreshing ? (
            <>
              <CircularProgress size={16} color="inherit" />
              <span className="text-xs sm:text-sm">Refreshing...</span>
            </>
          ) : (
            <>
              <FiRotateCw className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Refresh</span>
            </>
          )}
        </button>

        {/* Upload */}
        <button
          onClick={handleCreate}
          className="group relative overflow-hidden px-4 sm:px-5 py-2.5 sm:py-3
                     bg-gradient-to-r from-blue-500 to-cyan-500
                     text-white rounded-xl sm:rounded-2xl font-semibold
                     hover:shadow-xl hover:shadow-cyan-500/30
                     active:scale-95 transition-all w-full xs:w-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-2">
            <FiPlus className="w-4 h-4" />
            <span className="text-xs sm:text-sm whitespace-nowrap">
              Upload Resource
            </span>
          </div>
        </button>
      </div>

      </div>
    </div>
  </div>
</div>


      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          
          {/* Total Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform-gpu">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 truncate">Total</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{stats.total}</p>
              </div>
              <div className="flex-shrink-0 ml-3 p-2.5 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl">
                <FiFolder className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Total Files Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform-gpu">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 truncate">Total Files</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{stats.totalFiles}</p>
              </div>
              <div className="flex-shrink-0 ml-3 p-2.5 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-2xl">
                <FiFileText className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Form 1 Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform-gpu">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 truncate">Form 1</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{stats.form1 || 0}</p>
              </div>
              <div className="flex-shrink-0 ml-3 p-2.5 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl">
                <FiUsers className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Form 2 Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform-gpu">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 truncate">Form 2</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{stats.form2 || 0}</p>
              </div>
              <div className="flex-shrink-0 ml-3 p-2.5 sm:p-3 bg-gradient-to-br from-green-50 to-green-100 text-green-600 rounded-2xl">
                <FiUsers className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Form 3 Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform-gpu">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 truncate">Form 3</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{stats.form3 || 0}</p>
              </div>
              <div className="flex-shrink-0 ml-3 p-2.5 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-2xl">
                <FiUsers className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Form 4 Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform-gpu">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 truncate">Form 4</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{stats.form4 || 0}</p>
              </div>
              <div className="flex-shrink-0 ml-3 p-2.5 sm:p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-600 rounded-2xl">
                <FiUsers className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Section - NEW */}
      {selectedResources.size > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <FiTrash2 className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg">
                  {selectedResources.size} resource{selectedResources.size === 1 ? '' : 's'} selected
                </h3>
                <p className="text-red-700 text-sm">
                  You can perform bulk actions on selected items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedResources(new Set())}
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
                    <CircularProgress size={16} className="text-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete Selected ({selectedResources.size})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources by title, description, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10    font-bold pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Types</option>
            {typeOptions.filter(opt => opt.value !== 'all').map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 cursor-pointer text-sm"
          >
            {subjectOptions.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 cursor-pointer text-sm"
          >
            {categoryOptions.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-50 cursor-pointer text-sm"
          >
            {classOptions.map(className => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Second Row of Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <select
            value={selectedAccessLevel}
            onChange={(e) => setSelectedAccessLevel(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Access Levels</option>
            {accessOptions.filter(opt => opt.value !== 'all').map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 cursor-pointer text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {(selectedType !== 'all' || selectedSubject !== 'All Subjects' || selectedCategory !== 'All Categories' || 
            selectedClass !== 'All Classes' || selectedAccessLevel !== 'all' || selectedStatus !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedSubject('All Subjects');
                setSelectedCategory('All Categories');
                setSelectedClass('All Classes');
                setSelectedAccessLevel('all');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {currentItems.map((resource) => (
              <ModernResourceCard 
                key={resource.id} 
                resource={resource}
                onEdit={handleEdit} 
                onDelete={handleDeleteClick} 
                onView={handleView}
                selected={selectedResources.has(resource.id)} 
                onSelect={handleResourceSelect} 
                actionLoading={saving}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredResources.length > itemsPerPage && (
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
              <Pagination />
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
          <FiFolder className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            {searchTerm || selectedType !== 'all' || selectedSubject !== 'All Subjects' ? 'No resources found' : 'No resources available'}
          </h3>
          <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
            {searchTerm || selectedType !== 'all' || selectedSubject !== 'All Subjects' ? 
              'Try adjusting your search criteria' : 
              'Start by uploading your first resource'}
          </p>
          <button 
            onClick={handleCreate} 
            className="text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 mx-auto text-sm lg:text-base cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600"
          >
            <FiUpload /> Upload Resource
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <ModernResourceModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSubmit} 
          resource={editingResource}
          loading={saving} 
        />
      )}
      
      {/* Resource Detail Modal */}
      {showDetailModal && selectedResource && (
        <ModernResourceDetailModal 
          resource={selectedResource}
          onClose={() => setShowDetailModal(false)} 
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}