'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Box, CircularProgress } from '@mui/material';

// Consolidated Feather Icons (Fi) - All Duplicates Removed
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
  FiEdit2,
  FiEdit3,
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
  FiSortAlphaUp,
  FiLock,
  FiUnlock,
  FiExternalLink,
  FiMoreVertical,
  FiCopy,
  FiShare2,
  FiHeart
} from 'react-icons/fi';

// Consolidated Heroicons (Hi)
import {
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlinePresentationChartBar,
  HiOutlineSparkles
} from 'react-icons/hi';

// Consolidated Ionicons (Io5)
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
// Rest of your component logic goes here...

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
              <p className="text-red-700 text-md ">
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
              <p className="text-gray-700 text-md ">{message}</p>
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

function ModernResourceDetailModal({ resource, onClose, onEdit }) {
  if (!resource) return null;

  // Modern Color Palette
  const getFileTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: 'bg-rose-500' };
      case 'video': return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', icon: 'bg-indigo-500' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', icon: 'bg-slate-500' };
    }
  };

  const typeColor = getFileTypeColor(resource.type);

  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return <FiFileText />;
      case 'video': return <FiVideo />;
      case 'image': return <FiImage />;
      case 'presentation': return <FiBarChart />;
      default: return <FiFile />;
    }
  };

  return (
    <Modal open={true} onClose={onClose} className="flex items-center justify-center p-4 backdrop-blur-sm">
      <Box sx={{
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        bgcolor: 'white',
        borderRadius: '32px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none'
      }}>
        {/* Modern Header - Clean & Minimal */}
        <div className="relative p-8 pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white p-1.5 rounded-lg">
                  <FiFolder size={16} />
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-blue-600/70">Educational Resource</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {resource.title}
              </h1>
            </div>
            <button 
              onClick={onClose} 
              className="group p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all duration-300"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Tags Bar */}
          <div className="flex flex-wrap gap-2 mt-6">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${typeColor.bg} ${typeColor.text} border ${typeColor.border}`}>
              <span className={`w-2 h-2 rounded-full ${typeColor.icon}`}></span>
              {resource.type || 'Resource'}
            </div>
            {resource.category && (
              <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">
                #{resource.category}
              </div>
            )}
            {resource.className && (
              <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                {resource.className}
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Description & Files */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Description Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <IoDocumentTextOutline />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Overview</h3>
                </div>
                <div className="bg-slate-50/50 p-6 rounded-[24px] border border-slate-100">
                  <p className="text-slate-600 leading-relaxed text-base">
                    {resource.description || "No detailed description provided."}
                  </p>
                </div>
              </section>

              {/* Files Grid - Modernized */}
              {resource.files?.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <FiPaperclip />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Attachments ({resource.files.length})</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resource.files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {getFileIcon(file.extension)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {file.name.replace(/^[\d-]+/, "")}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                            {file.extension} • {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Metadata Cards */}
            <div className="lg:col-span-4">
              <div className="sticky top-0 space-y-4">
                <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Metadata</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                        <FiUserCheck className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase">Instructor</p>
                        <p className="text-sm font-bold">{resource.teacher || 'Unassigned'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                        <FiUsers className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase">Publisher</p>
                        <p className="text-sm font-bold">{resource.uploadedBy || 'System'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                        <FiClock className="text-amber-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase">Last Updated</p>
                        <p className="text-sm font-bold">Today</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100">
                   <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Security</p>
                   <p className="text-xs font-bold text-blue-900/70 leading-relaxed">
                     This resource is restricted to <span className="text-blue-600 underline font-black">{resource.accessLevel}</span> roles only.
                   </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-white border-t border-slate-50 flex flex-col sm:flex-row justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-2xl font-black text-slate-400 hover:text-slate-900 transition-colors"
          >
            Dismiss
          </button>
          <button 
            onClick={() => onEdit(resource)}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black transition-all duration-300 shadow-lg shadow-slate-200"
          >
            <FiEdit size={18} /> Edit Resource
          </button>
        </div>
      </Box>
    </Modal>
  );
}


function ModernResourceModal({ onClose, onSave, resource, loading }) {
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

  // File states
  const [files, setFiles] = useState([]); // New files to upload
  const [existingFiles, setExistingFiles] = useState([]); // Existing files from resource
  const [filesToRemove, setFilesToRemove] = useState([]); // Files to delete
  const [totalSizeMB, setTotalSizeMB] = useState(0); // Total file size in MB
  const [fileSizeError, setFileSizeError] = useState(''); // Size error message


  // Add this function inside ResourcesManager component







// In ModernResourceModal component, replace the useEffect with:
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
  
  // Optional: Check auth but don't call fetchResources
  const checkAuth = () => {
    const adminToken = localStorage.getItem('admin_token');
    const deviceToken = localStorage.getItem('device_token');
    
    console.log('Resource Modal Auth check:', {
      hasAdminToken: !!adminToken,
      hasDeviceToken: !!deviceToken
    });
  };
  
  checkAuth();
}, [resource]); // Only depend on resource
  // Disable submit button based on conditions
  const isSubmitDisabled = 
    loading || 
    !formData.title.trim() || 
    !formData.subject || 
    !formData.className || 
    !formData.teacher ||
    (files.length === 0 && existingFiles.length === 0 && !resource) ||
    totalSizeMB > 4.5 ||
    fileSizeError;

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
    
    if (selectedFiles.length === 0) return;
    
    // Calculate current total size of new files
    let currentTotalBytes = 0;
    files.forEach(fileObj => {
      if (fileObj.file && fileObj.file.size) {
        currentTotalBytes += fileObj.file.size;
      }
    });
    
    // Calculate current total size of existing files (not marked for removal)
    let existingTotalBytes = 0;
    existingFiles.forEach((file) => {
      if (!filesToRemove.includes(file.url)) {
        existingTotalBytes += file.size || 0;
      }
    });
    
    // Calculate total current size
    const currentTotalBytesAll = currentTotalBytes + existingTotalBytes;
    
    // Filter and validate new files
    const validFiles = selectedFiles.filter(file => {
      if (!file || !file.type) {
        return false;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'audio/mpeg'
      ];
      
      const isValidType = allowedTypes.some(type => file.type.startsWith(type.split('/')[0]));
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB per file
      
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      alert('Please select valid files (max 10MB each, supported formats: PDF, DOC, PPT, XLS, Images, Videos, Audio)');
      return;
    }



    // Calculate new total size if we add these files
    let newFilesTotalBytes = 0;
    validFiles.forEach(file => {
      newFilesTotalBytes += file.size;
    });

    const newTotalBytes = currentTotalBytesAll + newFilesTotalBytes;
    const newTotalMB = newTotalBytes / (1024 * 1024);
    const VERCEL_LIMIT_MB = 4.5;

    // Check Vercel total size limit
    if (newTotalMB > VERCEL_LIMIT_MB) {
      const availableSpace = VERCEL_LIMIT_MB - (currentTotalBytesAll / (1024 * 1024));
      alert(
        `Cannot add these files. Available space: ${availableSpace.toFixed(1)}MB\n` +
        `Total would be: ${newTotalMB.toFixed(1)}MB (Limit: ${VERCEL_LIMIT_MB}MB)`
      );
      e.target.value = '';
      return;
    }

    // Create file objects
    const newFiles = validFiles.map(file => ({
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

    // Check Vercel size limit before proceeding
    const VERCEL_LIMIT_MB = 4.5;
    if (totalSizeMB > VERCEL_LIMIT_MB) {
      alert(`Total file size (${totalSizeMB.toFixed(1)}MB) exceeds Vercel's ${VERCEL_LIMIT_MB}MB limit. Please remove some files.`);
      return;
    }

    // Calculate total size for API validation (optional extra check)
    let apiTotalBytes = 0;
    files.forEach(fileObj => {
      if (fileObj.file && fileObj.file.size) {
        apiTotalBytes += fileObj.file.size;
      }
    });
    const apiTotalMB = apiTotalBytes / (1024 * 1024);
    
    if (apiTotalMB > VERCEL_LIMIT_MB) {
      alert(`New files total (${apiTotalMB.toFixed(1)}MB) exceeds limit. Please reduce file sizes.`);
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
      // Filter out files marked for removal
      const filesToKeep = existingFiles.filter(file => !filesToRemove.includes(file.url));
      
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

    // Add size validation info (optional, for backend to double-check)
    formDataToSend.append('totalSizeMB', totalSizeMB.toString());
    formDataToSend.append('vercelLimit', '4.5');

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
                <p className="text-white/90 opacity-90 mt-1 text-md ">
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
            {/* File Size Warning */}
            {fileSizeError && (
              <div className="bg-gradient-to-r from-red-50 to-pink-100 border border-red-200 rounded-2xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-700 text-md  font-bold">
                      File Size Limit Exceeded!
                    </p>
                    <p className="text-red-600 text-xs mt-1">
                      {fileSizeError}
                    </p>
                  </div>
                </div>
              </div>
            )}

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

            {/* File Upload Section */}
            <div className="w-full lg:w-[75%] mx-auto flex flex-col space-y-8">
              <section className="bg-white rounded-[32px] p-2 sm:p-4">
                <div className="flex items-center justify-between gap-3 mb-6 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <label className="text-xl font-black text-slate-800 tracking-tight">
                      Upload Resources *
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      totalSizeMB > 4.5 
                        ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700' 
                        : totalSizeMB > 3.5
                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700'
                        : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                    }`}>
                      {totalSizeMB.toFixed(1)} / 4.5 MB
                    </div>
                  </div>
                </div>

                {/* Vercel Size Warning */}
                {totalSizeMB > 4.5 && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-100 border border-red-200 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-red-700 text-md  font-bold">
                          Vercel Size Limit Exceeded!
                        </p>
                        <p className="text-red-600 text-xs mt-1">
                          Total file size ({totalSizeMB.toFixed(1)}MB) exceeds the 4.5MB limit. 
                          Remove files to continue.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          // Remove all files
                          setFiles([]);
                          setFilesToRemove([]);
                        }}
                        className="text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-red-200 to-pink-200 text-red-700 hover:from-red-300 hover:to-pink-300 transition-all"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}

                {/* Size Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Storage Used</span>
                    <span className="font-bold">{totalSizeMB.toFixed(1)}MB / 4.5MB</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        totalSizeMB > 4.5 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                          : totalSizeMB > 3.5
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}
                      style={{ width: `${Math.min((totalSizeMB / 4.5) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Modern Dropzone Area */}
                  <div className="relative group">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="resourceFiles"
                      disabled={totalSizeMB > 4.5}
                    />
                    <label 
                      htmlFor="resourceFiles" 
                      className={`cursor-pointer w-full py-10 border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center text-center px-6 transition-all ${
                        totalSizeMB > 4.5
                          ? 'border-red-300 bg-red-50/30 opacity-60'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-400'
                      }`}
                    >
                      <div className={`p-4 rounded-2xl mb-4 transition-transform ${
                        totalSizeMB > 4.5 
                          ? 'bg-red-100' 
                          : 'bg-white shadow-sm group-hover:scale-100'
                      }`}>
                        <FiUpload className={`text-3xl ${
                          totalSizeMB > 4.5 ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <p className={`text-lg font-bold mb-1 ${
                        totalSizeMB > 4.5 ? 'text-red-800' : 'text-slate-800'
                      }`}>
                        {totalSizeMB > 4.5 ? 'Storage Full' : 'Drag & drop files or browse'}
                      </p>
                      <p className="text-slate-800  text-md  max-w-xs mb-3">
                        {totalSizeMB > 4.5 
                          ? 'Remove files to free up space' 
                          : 'PDF, DOC, PPT, XLS, Images, Videos, or Audio'
                        }
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          totalSizeMB > 4.5
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-white border border-slate-100 text-slate-400'
                        }`}>
                          Max 10MB per file
                        </span>
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          totalSizeMB > 4.5
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-white border border-slate-100 text-slate-400'
                        }`}>
                          Total: 4.5MB limit
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Uploaded Files List */}
                  {(files.length > 0 || existingFiles.length > 0) && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-md  font-black uppercase tracking-widest text-slate-400">
                          Selected Assets ({files.length + existingFiles.length - filesToRemove.length})
                        </h4>
                        {totalSizeMB > 4.5 && (
                          <button
                            onClick={() => {
                              setFiles([]);
                              setFilesToRemove([]);
                            }}
                            className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-red-200 to-pink-200 text-red-700"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {/* New Files Segment */}
                        {files.map((fileObj, index) => {
                          const fileSizeMB = fileObj.size ? (fileObj.size / (1024 * 1024)).toFixed(1) : 0;
                          
                          return (
                            <div key={`new-${index}`} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              totalSizeMB > 4.5
                                ? 'bg-red-50/50 border-red-200'
                                : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm'
                            }`}>
                              <div className="flex items-center gap-4 min-w-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  parseFloat(fileSizeMB) > 3
                                    ? 'bg-red-100 text-red-600'
                                    : parseFloat(fileSizeMB) > 1
                                    ? 'bg-amber-100 text-amber-600'
                                    : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                  <FiFileText className="text-lg" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-md  font-bold text-slate-800 truncate">
                                    {fileObj.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                      totalSizeMB > 4.5 ? 'text-red-600' : 'text-emerald-600'
                                    }`}>
                                      Ready to Upload • {fileSizeMB}MB
                                    </span>
                                  </div>
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
                          );
                        })}

                        {/* Existing Files Segment */}
                        {existingFiles.map((file, index) => {
                          if (filesToRemove.includes(file.url)) return null;
                          
                          const fileSizeMB = file.size ? (file.size / (1024 * 1024)).toFixed(1) : 0;
                          
                          return (
                            <div key={`exist-${index}`} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              totalSizeMB > 4.5
                                ? 'bg-red-50/30 border-red-200'
                                : 'bg-blue-50/30 border-blue-100 hover:shadow-sm'
                            }`}>
                              <div className="flex items-center gap-4 min-w-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  parseFloat(fileSizeMB) > 3
                                    ? 'bg-red-600 text-white'
                                    : parseFloat(fileSizeMB) > 1
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-blue-600 text-white'
                                }`}>
                                  <FiFileText className="text-lg" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-md  font-bold text-slate-700 truncate">
                                    {file.name || 'Cloud Resource'}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                      totalSizeMB > 4.5 ? 'text-red-600' : 'text-blue-600'
                                    }`}>
                                      Stored in Cloud • {fileSizeMB}MB
                                    </span>
                                  </div>
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
                          );
                        })}
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
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 cursor-pointer text-md "
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={isSubmitDisabled}
                className="px-6 py-3 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-md  hover:from-blue-700 hover:to-cyan-700 transition-all"
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



  const getAuthHeaders = () => {
  const adminToken = localStorage.getItem('admin_token');
  const deviceToken = localStorage.getItem('device_token');
  
  console.log('🔐 Getting auth headers:', {
    hasAdminToken: !!adminToken,
    hasDeviceToken: !!deviceToken
  });
  
  if (!adminToken || !deviceToken) {
    throw new Error('Authentication required. Please login to perform this action.');
  }
  
  return {
    'x-admin-token': adminToken,
    'x-device-token': deviceToken
  };
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
    // Get authentication headers
    const headers = getAuthHeaders();
    
    if (deleteType === 'single' && resourceToDelete) {
      // Single delete
      console.log(`🗑️ Deleting resource ${resourceToDelete.id} with headers:`, headers);
      const response = await fetch(`/api/resources/${resourceToDelete.id}`, {
        method: 'DELETE',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      });
      
      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('device_token');
        localStorage.removeItem('device_fingerprint');
        throw new Error('Session expired. Please login again.');
      }
      
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
      console.log(`🗑️ Bulk deleting ${selectedResources.size} resources with headers:`, headers);
      const deletedIds = [];
      const failedIds = [];
      
      // Delete each selected resource
      for (const resourceId of selectedResources) {
        try {
          const response = await fetch(`/api/resources/${resourceId}`, {
            method: 'DELETE',
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
          });
          
          // Handle authentication errors
          if (response.status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            localStorage.removeItem('device_token');
            localStorage.removeItem('device_fingerprint');
            throw new Error('Session expired. Please login again.');
          }
          
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
    console.error('❌ Error deleting resource:', error);
    
    // Handle authentication errors
    if (error.message.includes('Authentication required') || 
        error.message.includes('Session expired')) {
      showNotification('error', 'Authentication Required', 'Please login to continue');
      setTimeout(() => {
        window.location.href = '/pages/adminLogin';
      }, 2000);
    } else {
      showNotification('error', 'Delete Failed', error.message || 'Failed to delete resource');
    }
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
    // Get authentication headers
    const headers = getAuthHeaders();
    
    let response;
    
    if (id) {
      // Update existing resource
      console.log(`🔄 Updating resource ${id} with headers:`, headers);
      response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: headers, // ✅ Add auth headers
        body: formData,
        // Don't set Content-Type for FormData
      });
    } else {
      // Create new resource
      console.log(`🆕 Creating resource with headers:`, headers);
      response = await fetch('/api/resources', {
        method: 'POST',
        headers: headers, // ✅ Add auth headers
        body: formData,
        // Don't set Content-Type for FormData
      });
    }
    
    console.log('📥 Response status:', response.status);
    
    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('device_token');
      localStorage.removeItem('device_fingerprint');
      
      throw new Error('Session expired. Please login again.');
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
    console.error('❌ Error saving resource:', error);
    
    // Handle authentication errors
    if (error.message.includes('Authentication required') || 
        error.message.includes('Session expired')) {
      showNotification('error', 'Authentication Required', 'Please login to continue');
      setTimeout(() => {
        window.location.href = '/pages/adminLogin';
      }, 2000);
    } else {
      showNotification('error', 'Save Failed', error.message || `Failed to ${id ? 'update' : 'create'} resource`);
    }
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
      <p className="text-md  text-gray-700 font-medium">
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
          <p className="text-gray-400 text-md  mt-1">
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
            <p className="text-amber-100/90 mt-2 sm:mt-3 text-md  xs:text-base sm:text-lg font-medium max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
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
              <span className="text-xs sm:text-md ">Refreshing...</span>
            </>
          ) : (
            <>
              <FiRotateCw className="w-4 h-4" />
              <span className="text-xs sm:text-md ">Refresh</span>
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
            <span className="text-xs sm:text-md  whitespace-nowrap">
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
                <p className="text-xs sm:text-md  font-semibold text-gray-600 mb-1 truncate">Total</p>
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
                <p className="text-xs sm:text-md  font-semibold text-gray-600 mb-1 truncate">Total Files</p>
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
                <p className="text-xs sm:text-md  font-semibold text-gray-600 mb-1 truncate">Form 1</p>
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
                <p className="text-xs sm:text-md  font-semibold text-gray-600 mb-1 truncate">Form 2</p>
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
                <p className="text-xs sm:text-md  font-semibold text-gray-600 mb-1 truncate">Form 3</p>
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
                <p className="text-xs sm:text-md  font-semibold text-gray-600 mb-1 truncate">Form 4</p>
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
                <p className="text-red-700 text-md ">
                  You can perform bulk actions on selected items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedResources(new Set())}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-md "
              >
                Clear Selection
              </button>
              <button 
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2 text-md "
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
              className="w-full pl-10    font-bold pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-md  bg-gray-50"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 cursor-pointer text-md "
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
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 cursor-pointer text-md "
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
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 cursor-pointer text-md "
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
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-50 cursor-pointer text-md "
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
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 cursor-pointer text-md "
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
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50 cursor-pointer text-md "
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
              className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-md  hover:bg-gray-50 cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>


      {filteredResources.length > 0 ? (
        <>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/5 border border-slate-200/50 overflow-hidden relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
            
            {/* Enhanced Table Header */}
            <div className="border-b border-slate-200/50">
              <div className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedResources.size === currentItems.length && currentItems.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const newSelection = new Set(selectedResources);
                          currentItems.forEach(resource => newSelection.add(resource.id));
                          setSelectedResources(newSelection);
                        } else {
                          const newSelection = new Set(selectedResources);
                          currentItems.forEach(resource => newSelection.delete(resource.id));
                          setSelectedResources(newSelection);
                        }
                      }}
                      className="w-5 h-5 rounded-xl border-2 border-slate-300 bg-white checked:bg-gradient-to-r checked:from-blue-500 checked:to-purple-600 checked:border-0 focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-200"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Digital Resources
                      <span className="ml-2 px-2.5 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold rounded-full">
                        {filteredResources.length} items
                      </span>
                    </h3>
                    <p className="text-md  text-slate-800  mt-1 flex items-center gap-2">
                      <FiClock className="w-3 h-3" />
                      Updated  
                    </p>
                  </div>
                </div>
                
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm">
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800  uppercase tracking-[0.2em] w-16">
                      Select
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800  uppercase tracking-[0.2em] min-w-[300px]">
                      <div className="flex items-center gap-2">
                        <HiOutlineSparkles className="w-4 h-4 text-blue-500" />
                        Resource
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800  uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <FiUsers className="w-4 h-4 text-emerald-500" />
                        Class & Subject
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800  uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <FiLock className="w-4 h-4 text-amber-500" />
                        Access 
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800  uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <FiUserCheck className="w-4 h-4 text-purple-500" />
                        Teacher
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800  uppercase tracking-[0.2em]">
                      Status
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800  uppercase tracking-[0.2em]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {currentItems.map((resource) => (
                    <tr 
                      key={resource.id} 
                      className={`group hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/20 transition-all duration-300  ${
                        selectedResources.has(resource.id) ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/30' : ''
                      }`}
                    >
                      {/* Checkbox Column */}
                      <td className="py-5 px-8" onClick={(e) => e.stopPropagation()}>
<div className="flex items-center">
  <input
    type="checkbox"
    checked={selectedResources.has(resource.id)}
    onChange={(e) => handleResourceSelect(resource.id, e.target.checked)}
    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors"
  />
</div>
                      </td>

                      {/* Resource Details Column */}
                      <td className="py-5 px-8 cursor-pointer"  onClick={() => handleView(resource)}
>
                        <div className="flex items-start gap-4">
                          <div className={`relative p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                            resource.type?.toLowerCase() === 'pdf' 
                              ? 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 shadow-sm shadow-red-500/10' 
                              : resource.type?.toLowerCase() === 'video' 
                              ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-sm shadow-blue-500/10'
                              : resource.type?.toLowerCase() === 'image' 
                              ? 'bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 shadow-sm shadow-purple-500/10'
                              : resource.type?.toLowerCase() === 'document' 
                              ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm shadow-emerald-500/10'
                              : 'bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 shadow-sm shadow-slate-500/10'
                          }`}>
                            {resource.type?.toLowerCase() === 'pdf' ? (
                              <HiOutlineDocumentText className="text-xl text-red-600" />
                            ) : resource.type?.toLowerCase() === 'video' ? (
                              <FiVideo className="text-xl text-blue-600" />
                            ) : resource.type?.toLowerCase() === 'image' ? (
                              <HiOutlinePhotograph className="text-xl text-purple-600" />
                            ) : resource.type?.toLowerCase() === 'presentation' ? (
                              <HiOutlinePresentationChartBar className="text-xl text-amber-600" />
                            ) : (
                              <FiFileText className="text-xl text-emerald-600" />
                            )}
                            {resource.isFeatured && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                <FiStar className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-bold text-slate-900 text-md  leading-tight group-hover:text-blue-600 transition-colors">
                                {resource.title || 'Untitled Resource'}
                              </h4>
              
                            </div>
                            <p className="text-slate-900 text-xs line-clamp-2 mb-3">
                              {resource.description || 'No description provided'}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-800 ">
                              <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
                                <FiFile className="w-3 h-3" />
                                {resource.files?.length || 0} files
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Class Column */}
                      <td className="py-5 px-8">
                        <div className="space-y-3">
                          <div className="inline-flex flex-col gap-1.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-100">
                              <FiUsers className="w-3 h-3" />
                              {resource.className || 'All Classes'}
                            </span>
                            <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
                              {resource.subject || 'General Studies'}
                            </span>
                          </div>
                          {resource.students && (
                            <p className="text-xs text-slate-800  font-medium">
                              {resource.students} students enrolled
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Type & Access Column */}
                      <td className="py-5 px-8">
                        <div className="space-y-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                                resource.type?.toLowerCase() === 'pdf' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                resource.type?.toLowerCase() === 'video' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                resource.type?.toLowerCase() === 'image' ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
                                resource.type?.toLowerCase() === 'document' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                'bg-gradient-to-r from-slate-500 to-gray-500'
                              }`} />
                              <span className="text-xs font-bold text-slate-900 capitalize">
                                {resource.type || 'File'}
                              </span>
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                              resource.accessLevel === 'student' 
                                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-100' 
                                : resource.accessLevel === 'teacher' 
                                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-100'
                                : resource.accessLevel === 'admin' 
                                ? 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-100'
                                : 'bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-100'
                            }`}>
                              {resource.accessLevel === 'admin' ? <FiLock className="w-3 h-3" /> : <FiUnlock className="w-3 h-3" />}
                              {resource.accessLevel || 'student'} access
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Teacher Column */}
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-3 group/author">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-md  shadow-md shadow-blue-500/25">
                              {resource.teacher?.split(' ').map(n => n[0]).join('') || 'A'}
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-600/0 group-hover/author:from-blue-500/20 group-hover/author:to-purple-600/20 transition-all duration-300"></div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-md  font-bold text-slate-900 group-hover/author:text-blue-600 transition-colors">
                              {resource.teacher || 'System Admin'}
                            </span>
                            <span className="text-xs text-slate-800  font-medium">
                              {resource.role || 'Teacher'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-5 px-8">
                        <div className="relative">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
                            resource.isActive === true
                              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 group-hover:shadow-lg group-hover:shadow-emerald-500/20'
                              : 'bg-gradient-to-r from-slate-50 to-gray-50 text-slate-600 border-slate-200'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              resource.isActive === true 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse' 
                                : 'bg-slate-400'
                            }`}></div>
                            {resource.isActive === true ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>

            <td className="py-5 px-8 text-right">
  <div className="flex items-center justify-end gap-4">
    <button
      onClick={() => handleView(resource)}
      className="flex items-center gap-1.5 text-blue-600 font-bold text-sm cursor-pointer"
    >
      <FiEye className="w-4 h-4" />
      <span>View</span>
    </button>
    
    <button
      onClick={() => handleEdit(resource)}
      className="flex items-center gap-1.5 text-slate-600 font-bold text-sm cursor-pointer"
    >
      <FiEdit2 className="w-4 h-4" />
      <span>Edit</span>
    </button>
  </div>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modern Table Footer */}
            <div className="px-8 py-6 border-t border-slate-200/50 bg-gradient-to-r from-white to-slate-50/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="text-md  text-slate-600 font-medium">
                  <span className="font-bold text-slate-900">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredResources.length)}</span> 
                  of <span className="font-bold text-slate-900">{filteredResources.length}</span> resources
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all duration-200 group"
                  >
                    <FiChevronLeft className="w-5 h-5 text-slate-800  group-hover:text-blue-600" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-slate-400">...</span>
                        )}
                        <button
                          onClick={() => paginate(page)}
                          className={`px-4 py-2 rounded-xl font-medium text-md  transition-all duration-200 ${
                            currentPage === page 
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all duration-200 group"
                  >
                    <FiChevronRight className="w-5 h-5 text-slate-800  group-hover:text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Modern Empty State */
        <div className="relative bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/5 border border-blue-100/50 text-center py-16 px-8 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400"></div>
          </div>
          
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10">
              <FiFolder className="text-4xl text-gradient-to-r from-blue-500 to-purple-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {searchTerm || selectedType !== 'all' || selectedSubject !== 'All Subjects' 
                ? 'No resources match your search' 
                : 'Your resource library is empty'}
            </h3>
            
            <p className="text-slate-600 text-base mb-8 max-w-md mx-auto">
              {searchTerm || selectedType !== 'all' || selectedSubject !== 'All Subjects' 
                ? 'Try adjusting your filters or search keywords to find what you need.' 
                : 'Start building your digital classroom by uploading your first resource.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={handleCreate} 
                className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 flex items-center gap-2 mx-auto transition-all duration-300 hover:-translate-y-0.5"
              >
                <FiUpload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Upload Resource
              </button>
              
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedSubject('All Subjects');
                }}
                className="px-6 py-3.5 rounded-2xl font-semibold border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:bg-white transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
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