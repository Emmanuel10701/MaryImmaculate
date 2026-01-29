'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  FiGrid, FiList, FiSearch, FiFilter, FiDownload, FiEye, FiFileText, FiVideo, FiImage,
  FiMic, FiCalendar, FiUser, FiClock, FiCheckCircle, FiArrowRight, FiX, FiBook, FiFile,
  FiRefreshCw, FiExternalLink, FiPaperclip, FiSettings, FiChevronDown, FiChevronUp,
  FiCheck, FiStar, FiBarChart2, FiTrendingUp, FiTrendingDown, FiInfo, FiPrinter,
  FiShare2, FiBell, FiBookOpen, FiTag, FiSchool, FiBookmark, FiHeart, FiMessageSquare
} from 'react-icons/fi';

import {
  IoDocumentsOutline, IoFolderOpen, IoStatsChart, IoAnalytics, IoSparkles,
  IoClose, IoFilter, IoSchool, IoDocumentAttach, IoStar, IoTime, IoCheckmarkCircle,
  IoWarning, IoInformation, IoArrowDown, IoArrowUp, IoCloudDownload, IoEye,
  IoCalendar, IoPerson, IoDocument, IoImages, IoVideocam, IoMusicalNotes,
  IoColorPalette, IoGameController, IoCode, IoBuild, IoCalculator
} from 'react-icons/io5';

import {
  CircularProgress, Tooltip, Badge, Chip, LinearProgress, Avatar,
  IconButton, Button, ToggleButton, ToggleButtonGroup
} from '@mui/material';

import { motion, AnimatePresence } from 'framer-motion';

// ==================== HELPER FUNCTIONS ====================

const extractFileInfoFromUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const pathParts = pathname.split('/');
    let fileName = pathParts[pathParts.length - 1];
    fileName = decodeURIComponent(fileName);
    
    const extension = fileName.includes('.') 
      ? fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
      : '';
    
    const getFileType = (ext) => {
      const typeMap = {
        '.pdf': 'PDF Document', '.doc': 'Word Document', '.docx': 'Word Document',
        '.txt': 'Text File', '.jpg': 'Image', '.jpeg': 'Image', '.png': 'Image',
        '.gif': 'Image', '.webp': 'Image', '.bmp': 'Image', '.svg': 'Image',
        '.mp4': 'Video', '.mov': 'Video', '.avi': 'Video', '.wmv': 'Video',
        '.flv': 'Video', '.webm': 'Video', '.mkv': 'Video', '.mp3': 'Audio',
        '.wav': 'Audio', '.m4a': 'Audio', '.ogg': 'Audio', '.flac': 'Audio',
        '.xls': 'Excel Spreadsheet', '.xlsx': 'Excel Spreadsheet', '.csv': 'Spreadsheet',
        '.ppt': 'Presentation', '.pptx': 'Presentation', '.zip': 'Archive',
        '.rar': 'Archive', '.7z': 'Archive', '.tar': 'Archive', '.gz': 'Archive'
      };
      return typeMap[ext] || 'File';
    };

    return {
      url,
      fileName,
      extension,
      fileType: getFileType(extension),
      storageType: 'supabase'
    };
  } catch (error) {
    return {
      url,
      fileName: 'download',
      extension: '',
      fileType: 'File',
      storageType: 'supabase'
    };
  }
};

const getFileIcon = (fileType, extension, size = 20) => {
  const type = fileType?.toLowerCase() || extension?.toLowerCase() || '';
  
  if (type.includes('pdf')) return <FiFileText className="text-red-500" size={size} />;
  if (type.includes('word') || ['doc', 'docx'].includes(type)) return <IoDocument className="text-blue-500" size={size} />;
  if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(type)) return <IoImages className="text-pink-500" size={size} />;
  if (type.includes('video') || ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'].includes(type)) return <IoVideocam className="text-purple-500" size={size} />;
  if (type.includes('audio') || ['mp3', 'wav', 'm4a', 'ogg', 'flac'].includes(type)) return <IoMusicalNotes className="text-indigo-500" size={size} />;
  if (type.includes('excel') || ['xls', 'xlsx', 'csv'].includes(type)) return <IoCalculator className="text-emerald-500" size={size} />;
  if (type.includes('powerpoint') || ['ppt', 'pptx'].includes(type)) return <IoColorPalette className="text-orange-500" size={size} />;
  if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar')) return <IoFolderOpen className="text-amber-500" size={size} />;
  return <IoDocument className="text-gray-600" size={size} />;
};

// ==================== DOWNLOAD FUNCTIONS ====================

const downloadFile = (fileUrl, fileName) => {
  if (!fileUrl) {
    alert('No file available for download');
    return;
  }
  
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName || 'download';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadMultipleFiles = async (files) => {
  if (!files || files.length === 0) {
    alert('No files available for download');
    return;
  }

  const loadingAlert = document.createElement('div');
  loadingAlert.className = 'fixed top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl shadow-2xl z-[10000] backdrop-blur-sm border border-white/20';
  loadingAlert.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
      <div>
        <p class="font-bold">Preparing Download</p>
        <p class="text-sm opacity-90">Processing ${files.length} files...</p>
      </div>
    </div>
  `;
  document.body.appendChild(loadingAlert);

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.url) {
        downloadFile(file.url, file.fileName);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    loadingAlert.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="h-6 w-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
          <IoCheckmarkCircle className="text-white" size={16} />
        </div>
        <div>
          <p class="font-bold">Download Complete</p>
          <p class="text-sm opacity-90">${files.length} files downloaded!</p>
        </div>
      </div>
    `;
    
    setTimeout(() => {
      document.body.removeChild(loadingAlert);
    }, 3000);

  } catch (error) {
    console.error('Error downloading files:', error);
    loadingAlert.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="h-6 w-6 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center">
          <IoWarning className="text-white" size={16} />
        </div>
        <div>
          <p class="font-bold">Download Failed</p>
          <p class="text-sm opacity-90">Please try again</p>
        </div>
      </div>
    `;
    setTimeout(() => {
      document.body.removeChild(loadingAlert);
    }, 3000);
  }
};

// ==================== COMPONENTS ====================

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="relative">
            <CircularProgress 
              size={80} 
              thickness={4}
              className="text-blue-600"
              sx={{
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-12 h-12 flex items-center justify-center">
                <IoDocumentsOutline className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-xl opacity-30"></div>
        </div>
        
        <div className="mt-8 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-gray-800"
          >
            Loading Resources
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            Fetching your latest assignments...
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.6, duration: 1.5 }}
            className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          ></motion.div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, trend, unit = '', description, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-md`}>
          <Icon className={`text-white ${compact ? 'text-lg' : 'text-xl'}`} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          trend > 0 
            ? 'bg-green-100 text-green-800' 
            : trend < 0 
            ? 'bg-red-100 text-red-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {trend > 0 ? <IoArrowUp className="text-xs" /> : <IoArrowDown className="text-xs" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="space-y-1">
        <div className={`font-bold text-gray-900 ${compact ? 'text-2xl' : 'text-3xl'}`}>
          {value}
          {unit && <span className="text-lg text-gray-600 ml-1">{unit}</span>}
        </div>
        <div className="text-sm font-bold text-gray-700 truncate">{title}</div>
        {description && (
          <div className="text-xs text-gray-500 truncate">{description}</div>
        )}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status, size = "md" }) {
  const getStatusConfig = (status) => {
    const configs = {
      'completed': { bg: 'from-emerald-500 to-teal-400', text: 'Completed', icon: <IoCheckmarkCircle /> },
      'assigned': { bg: 'from-blue-500 to-cyan-400', text: 'Assigned', icon: <IoTime /> },
      'pending': { bg: 'from-amber-500 to-orange-400', text: 'Pending', icon: <IoTime /> },
      'reviewed': { bg: 'from-purple-500 to-violet-400', text: 'Reviewed', icon: <IoCheckmarkCircle /> },
      'overdue': { bg: 'from-rose-500 to-pink-400', text: 'Overdue', icon: <IoWarning /> },
      'submitted': { bg: 'from-indigo-500 to-blue-400', text: 'Submitted', icon: <IoDocument /> }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`inline-flex items-center gap-2 ${sizeClasses[size]} bg-gradient-to-r ${config.bg} text-white rounded-full font-bold shadow-md`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}

function FilePreviewCard({ file, onDownload, onPreview, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getFileIcon(file.fileType, file.extension, 20)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 truncate">{file.fileName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{file.fileType}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{file.extension}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => onPreview?.(file)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <IoEye size={16} />
            <span>Preview</span>
          </button>
          <button
            onClick={() => onDownload?.(file)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold shadow-md"
          >
            <IoCloudDownload size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AssignmentResourceCard({ item, type, onView, onDownload, onBookmark, isBookmarked = false }) {
  const isResource = type === 'resource';
  const totalFiles = isResource 
    ? (item.mainAttachment ? 1 : 0)
    : ((item.assignmentFileAttachments?.length || 0) + (item.attachmentAttachments?.length || 0));
  
  const isOverdue = !isResource && new Date(item.dueDate) < new Date() && item.status !== 'completed';

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className={`p-4 sm:p-5 bg-gradient-to-r ${
        isResource 
          ? 'from-blue-500 to-indigo-600' 
          : isOverdue
          ? 'from-rose-500 to-pink-600'
          : 'from-purple-500 to-violet-600'
      } text-white`}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl">
              {isResource ? (
                getFileIcon(item.type, item.extension, 20)
              ) : (
                <IoDocument className="text-white w-4 h-4 sm:w-6 sm:h-6" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                {isResource ? item.type?.toUpperCase() : 'ASSIGNMENT'}
              </span>
              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                <span className="text-xs bg-white/20 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-bold">
                  {item.subject}
                </span>
                {isOverdue && (
                  <span className="text-xs bg-rose-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1 font-bold">
                    <IoWarning className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onBookmark?.(item)}
              className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg ${
                isBookmarked 
                  ? 'text-yellow-300 bg-white/20' 
                  : 'text-white/70 bg-white/10'
              }`}
            >
              <FiBookmark className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            </button>
            <div className="text-xs font-bold bg-white/20 px-1.5 py-0.5 sm:px-2 sm:yp-1 rounded-full">
              {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
            </div>
                    <h3 className="text-lg sm:text-lg font-bold line-clamp-2">{item.form}</h3>

          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold line-clamp-2">{item.title}</h3>
      </div>
      
      {/* Card Body */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              {isResource ? 'Class' : 'Teacher'}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-900 font-bold">
              {isResource ? (
                <IoSchool className="text-blue-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <IoPerson className="text-purple-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
              <span className="truncate text-sm sm:text-base">{isResource ? item.className : item.teacher}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              {isResource ? 'Date Added' : 'Due Date'}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-900 font-bold">
              <IoCalendar className="text-amber-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-sm sm:text-base">
                {isResource 
                  ? new Date(item.createdAt || item.dateAdded).toLocaleDateString()
                  : new Date(item.dueDate).toLocaleDateString()
                }
              </span>
            </div>
          </div>
        </div>
        
        {item.description && (
          <div className="mb-3 sm:mb-4">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5 sm:mb-2">
              Description
            </div>
            <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">{item.description}</p>
          </div>
        )}
        
        {!isResource && item.status && (
          <div className="mb-3 sm:mb-4">
            <StatusBadge status={item.status} size="sm" />
          </div>
        )}
        
        {/* Action Buttons - FLEX LAYOUT ONLY (not stacked on mobile) */}
        <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
          <button
            onClick={() => onView?.(item)}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm"
          >
            <span>View Details</span>
            <IoArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          
          <button
            onClick={() => onDownload?.(item)}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-bold shadow-md text-xs sm:text-sm"
            title={`Download ${totalFiles} ${totalFiles === 1 ? 'file' : 'files'}`}
          >
            <IoCloudDownload className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
function DetailModal({ item, type, onClose, onDownload }) {
  if (!item) return null;

  const isResource = type === 'resource';
  const isOverdue = !isResource && new Date(item.dueDate) < new Date() && item.status !== 'completed';

return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className={`p-4 sm:p-6 md:p-8 text-white ${
          isResource 
            ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800' 
            : isOverdue
            ? 'bg-gradient-to-r from-rose-600 via-rose-700 to-pink-800'
            : 'bg-gradient-to-r from-purple-600 via-purple-700 to-violet-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl">
                {isResource ? (
                  getFileIcon(item.type, item.extension, 20)
                ) : (
                  <IoDocument className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{item.title}</h2>
                <div className="flex items-center gap-2 mt-1 sm:mt-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold opacity-90">{item.subject}</span>
                  <span className="text-xs sm:text-sm opacity-90">•</span>
                  <span className="text-xs sm:text-sm font-bold opacity-90">{item.className}</span>
                  {!isResource && (
                    <>
                      <span className="text-xs sm:text-sm opacity-90">•</span>
                      <span className="text-xs sm:text-sm font-bold opacity-90 truncate">{item.teacher}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 rounded-lg sm:rounded-xl ml-2 sm:ml-4"
            >
              <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Status & Info */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {!isResource && <StatusBadge status={item.status} size="md" />}
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-bold">
              {item.className}
            </span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-100 text-indigo-800 rounded-full text-xs sm:text-sm font-bold">
              {item.subject}
            </span>
            {isOverdue && (
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-rose-100 text-rose-800 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                <IoWarning className="w-3 h-3 sm:w-4 sm:h-4" />
                Overdue
              </span>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {!isResource && (
              <>
                <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl">
                  <div className="text-xs sm:text-sm text-gray-600 font-bold">Due Date</div>
                  <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mt-1 sm:mt-2">
                    {new Date(item.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl">
                  <div className="text-xs sm:text-sm text-gray-600 font-bold">Priority</div>
                  <div className={`text-sm sm:text-base md:text-lg font-bold mt-1 sm:mt-2 ${
                    item.priority === 'high' ? 'text-rose-600' :
                    item.priority === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {item.priority?.toUpperCase()}
                  </div>
                </div>
              </>
            )}
            <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl">
              <div className="text-xs sm:text-sm text-gray-600 font-bold">Teacher</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mt-1 sm:mt-2 truncate">{item.teacher}</div>
            </div>
            <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl">
              <div className="text-xs sm:text-sm text-gray-600 font-bold">Files</div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mt-1 sm:mt-2">
                {isResource 
                  ? (item.mainAttachment ? 1 : 0)
                  : ((item.assignmentFileAttachments?.length || 0) + (item.attachmentAttachments?.length || 0))
                }
              </div>
            </div>
          </div>

          {/* Description */}
          {(item.description || item.instructions) && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {item.description && (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2 sm:gap-3">
                    <IoInformation className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Description</span>
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line">{item.description}</p>
                </div>
              )}
              
              {!isResource && item.instructions && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2 sm:gap-3">
                    <IoDocument className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Instructions</span>
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line">{item.instructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Files Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {isResource && item.mainAttachment && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-200">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 sm:gap-3">
                  <IoCloudDownload className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Resource File</span>
                </h3>
                <FilePreviewCard 
                  file={item.mainAttachment}
                  onDownload={() => downloadFile(item.mainAttachment.url, item.mainAttachment.fileName)}
                  onPreview={() => window.open(item.mainAttachment.url, '_blank')}
                  index={0}
                />
              </div>
            )}

            {!isResource && (
              <>
                {(item.assignmentFileAttachments?.length || 0) > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <IoDocument className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Assignment Files ({item.assignmentFileAttachments?.length || 0})</span>
                      </h3>
                      <button
                        onClick={() => downloadMultipleFiles(item.assignmentFileAttachments || [])}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-bold shadow-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <IoCloudDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                        Download All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      {item.assignmentFileAttachments?.map((file, index) => (
                        <FilePreviewCard
                          key={index}
                          file={file}
                          onDownload={() => downloadFile(file.url, file.fileName)}
                          onPreview={() => window.open(file.url, '_blank')}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {(item.attachmentAttachments?.length || 0) > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-emerald-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <IoDocumentAttach className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Additional Attachments ({item.attachmentAttachments?.length || 0})</span>
                      </h3>
                      <button
                        onClick={() => downloadMultipleFiles(item.attachmentAttachments || [])}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-bold shadow-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <IoCloudDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                        Download All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      {item.attachmentAttachments?.map((file, index) => (
                        <FilePreviewCard
                          key={index}
                          file={file}
                          onDownload={() => downloadFile(file.url, file.fileName)}
                          onPreview={() => window.open(file.url, '_blank')}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
<div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200">
  <button
    onClick={onClose}
    /* min-w-0 and flex-1 ensures it doesn't push the other button off screen */
    className="flex-1 min-w-0 h-11 sm:h-14 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-[12px] sm:text-base md:text-lg flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all"
  >
    <IoClose className="shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
    <span className="truncate">Close</span>
  </button>
  
  <button
    onClick={() => onDownload?.(item)}
    /* flex-[2] makes Download the primary focus while keeping it in the same row */
    className="flex-[2] min-w-0 h-11 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-[12px] sm:text-base md:text-lg shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all"
  >
    <IoCloudDownload className="shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
    {/* Shortened text for small screens to prevent overlap */}
    <span className="truncate sm:hidden">Download</span>
    <span className="hidden sm:inline">Download All Files</span>
  </button>
</div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function ModernResourcesAssignmentsView({
  student,
  onDownload,
  onViewDetails
}) {
  const [activeTab, setActiveTab] = useState('assignments');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedResourceType, setSelectedResourceType] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  
  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAssignments: 0,
    pendingAssignments: 0,
    totalResources: 0,
    completedAssignments: 0,
    averageCompletion: 0
  });

  // Fetch data
  const fetchAssignments = useCallback(async () => {
    setAssignmentsLoading(true);
    try {
      const response = await fetch('/api/assignment');
      const data = await response.json();
      if (data.success) {
        const processedAssignments = (data.assignments || []).map((assignment) => ({
          ...assignment,
          assignmentFileAttachments: (assignment.assignmentFiles || []).map((url) => ({
            ...extractFileInfoFromUrl(url),
            url
          })),
          attachmentAttachments: (assignment.attachments || []).map((url) => ({
            ...extractFileInfoFromUrl(url),
            url
          }))
        }));
        setAssignments(processedAssignments);
      } else {
        setAssignments([]);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  }, []);

  const fetchResources = useCallback(async () => {
    setResourcesLoading(true);
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      if (data.success) {
        const processedResources = (data.resources || []).map((resource) => ({
          ...resource,
          mainAttachment: {
            url: resource.fileUrl,
            fileName: resource.fileName,
            fileSize: resource.fileSize,
            extension: resource.extension,
            fileType: resource.type
          }
        }));
        setResources(processedResources);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([]);
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
    fetchResources();
  }, [fetchAssignments, fetchResources]);

  // Calculate statistics
  useEffect(() => {
    const totalAssignments = assignments.length;
    const pendingAssignments = assignments.filter(a => 
      ['assigned', 'pending', 'in-progress'].includes(a.status)
    ).length;
    const totalResources = resources.length;
    const completedAssignments = assignments.filter(a => 
      ['completed', 'reviewed'].includes(a.status)
    ).length;
    const averageCompletion = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100) 
      : 0;

    setStats({
      totalAssignments,
      pendingAssignments,
      totalResources,
      completedAssignments,
      averageCompletion
    });
  }, [assignments, resources]);

  // Filter and sort logic
  const classes = useMemo(() => {
    const items = activeTab === 'assignments' ? assignments : resources;
    const uniqueClasses = ['all', ...new Set(items.map(item => item.className).filter(Boolean))];
    return uniqueClasses;
  }, [assignments, resources, activeTab]);

  const subjects = useMemo(() => {
    const items = activeTab === 'assignments' ? assignments : resources;
    return ['all', ...new Set(items.map(item => item.subject).filter(Boolean))];
  }, [assignments, resources, activeTab]);

  const statuses = useMemo(() => {
    return [
      { id: 'all', label: 'All Status', color: 'from-gray-500 to-gray-600' },
      { id: 'assigned', label: 'Assigned', color: 'from-blue-500 to-blue-600' },
      { id: 'pending', label: 'Pending', color: 'from-amber-500 to-amber-600' },
      { id: 'completed', label: 'Completed', color: 'from-emerald-500 to-emerald-600' },
      { id: 'reviewed', label: 'Reviewed', color: 'from-purple-500 to-purple-600' },
      { id: 'overdue', label: 'Overdue', color: 'from-rose-500 to-rose-600' }
    ];
  }, []);

  const resourceTypes = useMemo(() => {
    const uniqueTypes = ['all', ...new Set(resources.map(r => r.type).filter(Boolean))];
    return uniqueTypes.map(type => ({
      id: type,
      label: type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)
    }));
  }, [resources]);

  // Filter items
  const filteredAssignments = useMemo(() => {
    let filtered = assignments.filter(assignment => {
      const matchesClass = selectedClass === 'all' || assignment.className === selectedClass;
      const matchesSubject = selectedSubject === 'all' || assignment.subject === selectedSubject;
      const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        assignment.title?.toLowerCase().includes(searchLower) ||
        assignment.description?.toLowerCase().includes(searchLower) ||
        assignment.subject?.toLowerCase().includes(searchLower) ||
        assignment.teacher?.toLowerCase().includes(searchLower);
      
      const matchesBookmark = !showBookmarkedOnly || bookmarkedItems.has(assignment.id);
      
      return matchesClass && matchesSubject && matchesStatus && matchesSearch && matchesBookmark;
    });

    // Sort by due date, then priority
    return filtered.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
  }, [assignments, selectedClass, selectedSubject, selectedStatus, searchTerm, bookmarkedItems, showBookmarkedOnly]);

  const filteredResources = useMemo(() => {
    let filtered = resources.filter(resource => {
      const matchesType = selectedResourceType === 'all' || resource.type === selectedResourceType;
      const matchesClass = selectedClass === 'all' || resource.className === selectedClass;
      const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        resource.title?.toLowerCase().includes(searchLower) ||
        resource.description?.toLowerCase().includes(searchLower) ||
        resource.subject?.toLowerCase().includes(searchLower);
      
      const matchesBookmark = !showBookmarkedOnly || bookmarkedItems.has(resource.id);
      
      return matchesType && matchesClass && matchesSubject && matchesSearch && matchesBookmark;
    });

    return filtered.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  }, [resources, selectedResourceType, selectedClass, selectedSubject, searchTerm, bookmarkedItems, showBookmarkedOnly]);

  // Bookmark functions
  const toggleBookmark = useCallback((item) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(item.id)) {
      newBookmarks.delete(item.id);
    } else {
      newBookmarks.add(item.id);
    }
    setBookmarkedItems(newBookmarks);
  }, [bookmarkedItems]);

  // Download functions
  const handleDownload = useCallback((item) => {
    if (activeTab === 'resources') {
      if (item.mainAttachment?.url) {
        downloadFile(item.mainAttachment.url, item.mainAttachment.fileName);
      }
    } else {
      const allFiles = [
        ...(item.assignmentFileAttachments || []),
        ...(item.attachmentAttachments || [])
      ];
      if (allFiles.length === 1) {
        downloadFile(allFiles[0].url, allFiles[0].fileName);
      } else {
        downloadMultipleFiles(allFiles);
      }
    }
    onDownload?.(item);
  }, [activeTab, onDownload]);

  const handleDownloadAll = useCallback(() => {
    const items = activeTab === 'assignments' ? filteredAssignments : filteredResources;
    const allFiles = [];
    
    items.forEach(item => {
      if (activeTab === 'resources' && item.mainAttachment) {
        allFiles.push({
          url: item.mainAttachment.url,
          fileName: item.mainAttachment.fileName
        });
      } else if (activeTab === 'assignments') {
        (item.assignmentFileAttachments || []).forEach(file => 
          allFiles.push({ url: file.url, fileName: file.fileName })
        );
        (item.attachmentAttachments || []).forEach(file => 
          allFiles.push({ url: file.url, fileName: file.fileName })
        );
      }
    });
    
    if (allFiles.length > 0) {
      downloadMultipleFiles(allFiles);
    } else {
      alert('No files available for download');
    }
  }, [activeTab, filteredAssignments, filteredResources]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSelectedClass('all');
    setSelectedSubject('all');
    setSelectedStatus('all');
    setSelectedResourceType('all');
    setSearchTerm('');
    setShowBookmarkedOnly(false);
  }, []);

  const isLoading = assignmentsLoading || resourcesLoading;

  if (isLoading && assignments.length === 0 && resources.length === 0) {
    return <LoadingSpinner />;
  }

  const currentItems = activeTab === 'assignments' ? filteredAssignments : filteredResources;
  const totalItems = activeTab === 'assignments' ? assignments.length : resources.length;
  const filteredCount = currentItems.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-2 sm:p-4 md:p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 rounded-3xl p-4 sm:p-6 md:p-8 text-white overflow-hidden mb-4 sm:mb-6 md:mb-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full -ml-24 -mb-24 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <IoDocumentsOutline className="text-xl sm:text-2xl text-yellow-300" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Learning Hub</h1>
              </div>
              <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
                Access assignments, resources, and study materials all in one place
                {student && (
                  <span className="ml-2 text-yellow-300 font-bold">
                    ({student.form} {student.stream})
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={activeTab === 'assignments' ? fetchAssignments : fetchResources}
                className="px-4 py-2 sm:px-5 sm:py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2"
              >
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

 {/* Stats Grid - 2 columns on small mobile, 4 on desktop */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
  <StatsCard
    title="Total Assignments"
    value={stats.totalAssignments}
    icon={IoDocument}
    color="from-purple-500 to-purple-600"
    trend={5}
    description={`${stats.pendingAssignments} pending`}
  />
  
  <StatsCard
    title="Learning Resources"
    value={stats.totalResources}
    icon={IoDocumentsOutline}
    color="from-blue-500 to-blue-600"
    trend={12}
    description="Available files"
  />
  
  <StatsCard
    title="Completion Rate"
    value={stats.averageCompletion}
    icon={IoCheckmarkCircle}
    color="from-emerald-500 to-emerald-600"
    trend={stats.averageCompletion > 75 ? 8 : -3}
    unit="%"
    description="Completed"
  />
  
  <StatsCard
    title="Bookmarked Items"
    value={bookmarkedItems.size}
    icon={IoStar}
    color="from-amber-500 to-amber-600"
    trend={bookmarkedItems.size > 0 ? 15 : 0}
    description="Saved items"
  />
</div>

      {/* Main Content Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        {/* Tabs & Controls */}
        <div className="space-y-4 sm:space-y-6">
          {/* Tabs */}
          <div className="flex bg-gradient-to-r from-gray-50 to-white/50 rounded-2xl p-1 border border-gray-200 overflow-hidden">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 py-3 sm:py-4 px-2 rounded-xl flex items-center justify-center gap-2 sm:gap-3 ${
                activeTab === 'assignments'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 text-white'
                  : 'text-gray-600'
              }`}
            >
       
              <div className="text-left">
                <div className="text-sm font-bold">Assignments</div>
                <div className={`text-xs ${activeTab === 'assignments' ? 'text-white/80' : 'text-gray-400'}`}>
                  {assignments.length} active
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 py-3 sm:py-4 px-2 rounded-xl flex items-center justify-center gap-2 sm:gap-3 ${
                activeTab === 'resources'
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg shadow-purple-500/20 text-white'
                  : 'text-gray-600'
              }`}
            >
              <div className="text-left">
                <div className="text-sm font-bold">Resources</div>
                <div className={`text-xs ${activeTab === 'resources' ? 'text-white/80' : 'text-gray-400'}`}>
                  {resources.length} files
                </div>
              </div>
            </button>
          </div>

          {/* Search & Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeTab === 'assignments' ? 'assignments...' : 'resources...'}`}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 bg-white/80 backdrop-blur-sm rounded-2xl focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <IoClose className="text-base sm:text-lg" />
                  </button>
                )}
              </div>
            </div>

            {/* View & Filter Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Bookmark Toggle */}
              <button
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                className={`p-2.5 sm:p-3 rounded-2xl border ${
                  showBookmarkedOnly
                    ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200 text-amber-600 shadow-lg shadow-amber-500/10'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <IoStar className="text-lg sm:text-xl" />
              </button>

              {/* View Toggle */}
              <div className="flex bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-2xl p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-3 rounded-xl flex items-center gap-2 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                      : 'text-gray-600'
                  }`}
                >
                  <FiGrid className="text-base sm:text-lg" />
                  <span className="text-sm font-bold hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 rounded-xl flex items-center gap-2 ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                      : 'text-gray-600'
                  }`}
                >
                  <FiList className="text-base sm:text-lg" />
                  <span className="text-sm font-bold hidden sm:inline">List</span>
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`p-2.5 sm:p-3 rounded-2xl border ${
                  showAdvancedFilters
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 border-blue-200 text-blue-600 shadow-lg shadow-blue-500/10'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <IoFilter className="text-lg sm:text-xl" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 sm:pt-6 border-t border-gray-200 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Class Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <IoSchool className="text-blue-500" />
                        Class
                      </label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 bg-white rounded-2xl focus:outline-none focus:border-blue-500"
                      >
                        {classes.map(cls => (
                          <option key={cls} value={cls}>
                            {cls === 'all' ? 'All Classes' : cls}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subject Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <FiBookOpen className="text-indigo-500" />
                        Subject
                      </label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 bg-white rounded-2xl focus:outline-none focus:border-blue-500"
                      >
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>
                            {subject === 'all' ? 'All Subjects' : subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status/Type Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        {activeTab === 'assignments' ? (
                          <>
                            <FiCheckCircle className="text-emerald-500" />
                            Status
                          </>
                        ) : (
                          <>
                            <FiTag className="text-purple-500" />
                            Type
                          </>
                        )}
                      </label>
                      <select
                        value={activeTab === 'assignments' ? selectedStatus : selectedResourceType}
                        onChange={(e) => 
                          activeTab === 'assignments' 
                            ? setSelectedStatus(e.target.value)
                            : setSelectedResourceType(e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 bg-white rounded-2xl focus:outline-none focus:border-blue-500"
                      >
                        {activeTab === 'assignments' ? (
                          statuses.map(status => (
                            <option key={status.id} value={status.id}>
                              {status.label}
                            </option>
                          ))
                        ) : (
                          resourceTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.label}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="flex items-end">
                      {(selectedClass !== 'all' || selectedSubject !== 'all' || 
                        selectedStatus !== 'all' || selectedResourceType !== 'all' || 
                        searchTerm || showBookmarkedOnly) && (
                        <button
                          onClick={clearFilters}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                        >
                          <IoClose />
                          <span className="font-bold">Clear All</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(selectedClass !== 'all' || selectedSubject !== 'all' || 
                    selectedStatus !== 'all' || selectedResourceType !== 'all' ||
                    showBookmarkedOnly) && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-500">Active filters:</span>
                      {selectedClass !== 'all' && (
                        <span className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-bold border border-blue-100">
                          <IoSchool className="text-xs sm:text-sm" />
                          {selectedClass}
                          <button onClick={() => setSelectedClass('all')} className="ml-1 text-blue-500">
                            <IoClose className="text-xs sm:text-sm" />
                          </button>
                        </span>
                      )}
                      {selectedSubject !== 'all' && (
                        <span className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs sm:text-sm font-bold border border-indigo-100">
                          <FiBookOpen className="text-xs sm:text-sm" />
                          {selectedSubject}
                          <button onClick={() => setSelectedSubject('all')} className="ml-1 text-indigo-500">
                            <IoClose className="text-xs sm:text-sm" />
                          </button>
                        </span>
                      )}
                      {activeTab === 'assignments' && selectedStatus !== 'all' && (
                        <span className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs sm:text-sm font-bold border border-emerald-100">
                          <FiCheckCircle className="text-xs sm:text-sm" />
                          {statuses.find(s => s.id === selectedStatus)?.label}
                          <button onClick={() => setSelectedStatus('all')} className="ml-1 text-emerald-500">
                            <IoClose className="text-xs sm:text-sm" />
                          </button>
                        </span>
                      )}
                      {activeTab === 'resources' && selectedResourceType !== 'all' && (
                        <span className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-bold border border-purple-100">
                          <FiTag className="text-xs sm:text-sm" />
                          {resourceTypes.find(t => t.id === selectedResourceType)?.label}
                          <button onClick={() => setSelectedResourceType('all')} className="ml-1 text-purple-500">
                            <IoClose className="text-xs sm:text-sm" />
                          </button>
                        </span>
                      )}
                      {showBookmarkedOnly && (
                        <span className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs sm:text-sm font-bold border border-amber-100">
                          <IoStar className="text-xs sm:text-sm" />
                          Bookmarked Only
                          <button onClick={() => setShowBookmarkedOnly(false)} className="ml-1 text-amber-500">
                            <IoClose className="text-xs sm:text-sm" />
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-3 sm:p-4 md:p-6">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {activeTab === 'assignments' ? 'Assignments' : 'Learning Resources'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Showing {filteredCount} of {totalItems} items
              {searchTerm && ` • Search: "${searchTerm}"`}
              {showBookmarkedOnly && ` • Bookmarked only`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-500">
              {isLoading ? 'Loading...' : 'Updated just now'}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredCount === 0 && !isLoading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 sm:py-12 md:py-16"
          >
            <div className="inline-block p-4 sm:p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl mb-4 sm:mb-6">
              <IoDocumentsOutline className="text-gray-400 text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              No {activeTab === 'assignments' ? 'assignments' : 'resources'} found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
              {searchTerm || selectedClass !== 'all' || selectedSubject !== 'all' || 
               selectedStatus !== 'all' || selectedResourceType !== 'all' || showBookmarkedOnly
                ? 'Try adjusting your filters or search terms'
                : `No ${activeTab === 'assignments' ? 'assignments' : 'resources'} available yet`}
            </p>
            {(searchTerm || selectedClass !== 'all' || selectedSubject !== 'all' || 
              selectedStatus !== 'all' || selectedResourceType !== 'all' || showBookmarkedOnly) && (
              <button
                onClick={clearFilters}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold shadow-lg"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {currentItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AssignmentResourceCard
                  item={item}
                  type={activeTab}
                  onView={() => setSelectedItem(item)}
                  onDownload={() => handleDownload(item)}
                  onBookmark={() => toggleBookmark(item)}
                  isBookmarked={bookmarkedItems.has(item.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* List View */
          <div className="space-y-3 sm:space-y-4">
            {currentItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 shadow p-3 sm:p-4 md:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  {/* Icon & Status */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-2xl ${
                      activeTab === 'assignments' 
                        ? 'bg-gradient-to-r from-purple-100 to-purple-200' 
                        : 'bg-gradient-to-r from-blue-100 to-blue-200'
                    }`}>
                      {activeTab === 'assignments' ? (
                        <IoDocument className="text-purple-600 text-lg sm:text-xl" />
                      ) : (
                        getFileIcon(item.type, item.extension, 20)
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {activeTab === 'assignments' ? 'Assignment' : item.type}
                        </span>
                        {activeTab === 'assignments' && item.status && (
                          <StatusBadge status={item.status} size="sm" />
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1">{item.title}</h3>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Subject</div>
                      <div className="font-bold text-gray-900">{item.subject}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Class</div>
                      <div className="font-bold text-gray-900">{item.className}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        {activeTab === 'assignments' ? 'Due Date' : 'Date Added'}
                      </div>
                      <div className="font-bold text-gray-900">
                        {activeTab === 'assignments' 
                          ? new Date(item.dueDate).toLocaleDateString()
                          : new Date(item.createdAt || item.dateAdded).toLocaleDateString()
                        }
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Files</div>
                      <div className="font-bold text-gray-900">
                        {activeTab === 'assignments'
                          ? ((item.assignmentFileAttachments?.length || 0) + (item.attachmentAttachments?.length || 0))
                          : (item.mainAttachment ? 1 : 0)
                        }
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => toggleBookmark(item)}
                      className={`p-2 rounded-xl ${
                        bookmarkedItems.has(item.id)
                          ? 'text-yellow-500 bg-yellow-50'
                          : 'text-gray-400 bg-gray-50'
                      }`}
                    >
                      <IoStar className="text-lg sm:text-xl" />
                    </button>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2"
                    >
                      <FiEye />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(item)}
                      className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                    >
                      <IoCloudDownload />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={selectedItem}
            type={activeTab}
            onClose={() => setSelectedItem(null)}
            onDownload={() => handleDownload(selectedItem)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm">
        <p>
          {totalItems} total items • {bookmarkedItems.size} bookmarked • 
          Last updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="mt-1 sm:mt-2 text-xs">
          All files are securely stored and downloaded directly from Supabase storage
        </p>
      </div>
    </div>
  );
}