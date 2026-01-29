'use client';
import { useState, useEffect } from 'react';

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
  FiUserCheck, FiClipboard, FiShield,
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

// Delete Confirmation Modal - UPDATED FOR BULK DELETE
function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  type = 'single',
  itemName = '',
  itemType = 'assignment',
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
                  ? `Delete ${count} ${count === 1 ? 'assignment' : 'assignments'}?`
                  : `Delete "${itemName}"?`
                }
              </h3>
              <p className="text-gray-600">
                {type === 'bulk'
                  ? `You are about to delete ${count} ${count === 1 ? 'assignment' : 'assignments'}. All associated data will be permanently removed.`
                  : `This ${itemType} will be permanently deleted. All associated data will be removed.`
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
                  <CircularProgress size={16} className="text-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 />
                  {type === 'bulk' ? `Delete ${count} Assignments` : `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}
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

// Modern Assignment Detail Modal - Uses cached data
function ModernAssignmentDetailModal({ assignment, onClose, onEdit }) {
  if (!assignment) return null;

  // Status colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'in progress': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'overdue': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'assigned': return { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return { bg: 'bg-red-100', text: 'text-red-800' };
      case 'medium': return { bg: 'bg-orange-100', text: 'text-orange-800' };
      case 'low': return { bg: 'bg-blue-100', text: 'text-blue-800' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const statusColor = getStatusColor(assignment.status);
  const priorityColor = getPriorityColor(assignment.priority);
  
  // Calculate days remaining
  const daysRemaining = assignment.dueDate ? 
    Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : 
    null;

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
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <IoDocumentTextOutline className="text-xl sm:text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold truncate">Assignment Details</h2>
                <p className="text-white/90 opacity-90 mt-1 text-sm sm:text-lg">
                  Complete overview of assignment
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
            {/* Assignment Title and Status */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 break-words">
                {assignment.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                  {assignment.status?.charAt(0).toUpperCase() + assignment.status?.slice(1) || 'Pending'}
                </span>
                {assignment.priority && (
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${priorityColor.bg} ${priorityColor.text}`}>
                    {assignment.priority} Priority
                  </span>
                )}
                {assignment.subject && (
                  <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    {assignment.subject}
                  </span>
                )}
                {assignment.className && (
                  <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-800 border border-blue-200">
                    Class: {assignment.className}
                  </span>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Information Panel */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description - Full Width */}
                <div className="w-full">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <IoDocumentTextOutline className="text-indigo-600" />
                    Description
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                      {assignment.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                {/* Instructions - Full Width */}
                {assignment.instructions && (
                  <div className="w-full">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FiBookOpen className="text-green-600" />
                      Instructions
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                        {assignment.instructions}
                      </p>
                    </div>
                  </div>
                )}

                {/* Learning Objectives - Full Width */}
                {assignment.learningObjectives && assignment.learningObjectives.length > 0 && (
                  <div className="w-full">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FiTarget className="text-purple-600" />
                      Learning Objectives
                    </h3>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <ul className="space-y-2">
                        {assignment.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                            <span className="text-gray-700 text-sm sm:text-base">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

             <div className="space-y-6">
  {/* Modernized Information Card */}
  <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm">
    <div className="flex items-center gap-2 mb-6">
      <div className="p-2 bg-indigo-50 rounded-lg">
        <FiBriefcase className="text-indigo-600" size={18} />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
        Assignment Details
      </h3>
    </div>

    {/* Details Grid: 2 columns on mobile for better space usage */}
    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
      {/* Teacher */}
      {assignment.teacher && (
        <div className="col-span-2 sm:col-span-1 flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teacher</span>
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
               <FiUserCheck className="text-indigo-500" size={14} />
            </div>
            <span className="text-slate-700 font-bold text-sm truncate">
              {assignment.teacher}
            </span>
          </div>
        </div>
      )}

      {/* Due Date */}
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Due Date</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
            <FiCalendar className="text-red-500" size={14} />
          </div>
          <span className="text-slate-700 font-bold text-sm">
            {new Date(assignment.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </span>
        </div>
      </div>

      {/* Date Assigned */}
      {assignment.dateAssigned && (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned</span>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <FiCalendar className="text-emerald-500" size={14} />
            </div>
            <span className="text-slate-700 font-bold text-sm">
              {new Date(assignment.dateAssigned).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>
      )}

      {/* Estimated Time */}
      {assignment.estimatedTime && (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Time Est.</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
              <FiClock className="text-amber-500" size={14} />
            </div>
            <span className="text-slate-700 font-bold text-sm">{assignment.estimatedTime}</span>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Modernized Files Card */}
  {assignment.assignmentFiles?.length > 0 && (
    <div className="bg-slate-900 rounded-[24px] p-5 text-white shadow-xl shadow-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiFileText className="text-blue-400" />
          <h3 className="text-sm font-bold tracking-wide">Resources</h3>
        </div>
        <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
          {assignment.assignmentFiles.length} Total
        </span>
      </div>
<div className="space-y-2">
  {assignment.assignmentFiles.slice(0, 3).map((file, index) => {
    // 1. Get the filename from the URL
    const rawFileName = file.split('/').pop();
    // 2. Remove the leading timestamps and dashes
    const cleanFileName = rawFileName.replace(/^[\d-]+/, "");

    return (
      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
            <FiFileText size={14} />
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate">
            {cleanFileName}
          </p>
        </div>
      </div>
    );
  })}
  
  {assignment.assignmentFiles.length > 3 && (
    <button className="w-full py-2 mt-2 text-center border border-dashed border-white/20 rounded-xl hover:border-white/40 transition-all">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        +{assignment.assignmentFiles.length - 3} more files
      </span>
    </button>
  )}
</div>
    </div>
  )}
</div>
            </div>

            {/* Additional Sections - Full Width */}
            <div className="space-y-8">
              {/* Additional Work - Full Width */}
              {assignment.additionalWork && (
                <div className="w-full">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiFileText className="text-amber-600" />
                    Additional Work
                  </h3>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                      {assignment.additionalWork}
                    </p>
                  </div>
                </div>
              )}

              {/* Teacher Remarks - Full Width */}
              {assignment.teacherRemarks && (
                <div className="w-full">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiEdit className="text-indigo-600" />
                    Teacher Remarks
                  </h3>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                      {assignment.teacherRemarks}
                    </p>
                  </div>
                </div>
              )}
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
                onClick={() => onEdit(assignment)} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg cursor-pointer text-sm sm:text-base"
              >
                <FiEdit size={16} /> Edit Assignment
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Modern Assignment Card Component - UPDATED WITH SELECTION CHECKBOX
function ModernAssignmentCard({ assignment, onEdit, onDelete, onView, selected, onSelect, actionLoading }) {
  // Status colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' };
      case 'in progress': return { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' };
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' };
      case 'overdue': return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
      case 'assigned': return { bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };
    }
  };

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500 ';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const statusColor = getStatusColor(assignment.status);
  const priorityColor = getPriorityColor(assignment.priority);
  
  // Calculate days remaining
  const daysRemaining = assignment.dueDate ? 
    Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : 
    null;

  return (
    <div className={`bg-white rounded-[2rem] shadow-xl border ${
      selected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-gray-100'
    } w-full max-w-md overflow-hidden transition-none hover:shadow-2xl  cursor-pointer`} onClick={() => onView(assignment)}>
      
      {/* Header with Status and Selection Checkbox */}
      <div className={`p-6 ${statusColor.bg} border-b ${statusColor.text} border-opacity-20 relative`}>
        {/* Selection Checkbox */}
        <div className="absolute top-4 left-4 z-10">
          <input 
            type="checkbox" 
            checked={selected} 
            onChange={(e) => {
              e.stopPropagation();
              onSelect(assignment.id, e.target.checked);
            }}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div className="flex items-center justify-between mb-4 pl-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColor.dot}`}></div>
            <span className={`text-xs font-bold ${statusColor.text} uppercase tracking-wider`}>
              {assignment.status || 'Pending'}
            </span>
          </div>
          {assignment.priority && (
            <div className="flex items-center gap-1">
              <FiTarget className={`text-xs ${priorityColor}`} />
              <span className={`text-xs font-bold ${priorityColor}`}>
                {assignment.priority}
              </span>
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 leading-tight line-clamp-2">
          {assignment.title}
        </h3>
        
        <p className="text-sm font-medium text-slate-400 mt-2 line-clamp-2">
          {assignment.description || 'No description available.'}
        </p>
      </div>

      {/* Information Section */}
      <div className="p-6">
        {/* Grid Info Mapping */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
          {/* Due Date */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Due Date</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
              <span className="text-xs font-bold text-slate-700">
                {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>
            {daysRemaining !== null && (
              <span className={`text-[10px] font-bold ${
                daysRemaining <= 0 ? 'text-red-500' : 
                daysRemaining <= 3 ? 'text-orange-500 ' : 'text-green-500'
              }`}>
                {daysRemaining <= 0 ? 'Overdue' : `${daysRemaining} days left`}
              </span>
            )}
          </div>
          
          {/* Subject */}
          <div className="space-y-1">
            <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Subject</span>
            <div className="flex items-center gap-2">
              <IoBookOutline className="text-indigo-400 text-sm" />
              <span className="text-xs font-bold text-slate-700 truncate">
                {assignment.subject || 'No Subject'}
              </span>
            </div>
          </div>

          {/* Class */}
          {assignment.className && (
            <div className="col-span-2 p-3 bg-indigo-50 rounded-2xl flex items-center justify-between border border-indigo-100/50">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.1em]">Class</span>
                <span className="text-xs font-bold text-indigo-800 truncate">{assignment.className}</span>
              </div>
              <FiUserCheck className="text-indigo-300 text-lg shrink-0 ml-2" />
            </div>
          )}

          {/* Teacher */}
          {assignment.teacher && (
            <div className="col-span-2 p-3 bg-blue-50 rounded-2xl flex items-center justify-between border border-blue-100/50">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-blue-400 font-black uppercase tracking-[0.1em]">Teacher</span>
                <span className="text-xs font-bold text-blue-800 truncate">{assignment.teacher}</span>
              </div>
              <FiUsers className="text-blue-300 text-lg shrink-0 ml-2" />
            </div>
          )}
        </div>

        {/* Progress Bar (if applicable) */}
        {assignment.completionRate !== undefined && (
          <div className="mb-6">
    
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${assignment.completionRate}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Modern Action Bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onView(assignment);
            }}
            className="px-5 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-none active:bg-slate-200 cursor-pointer"
          >
            View
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(assignment);
            }}
            disabled={actionLoading}
            className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-50 transition-none active:scale-[0.98] cursor-pointer"
          >
            Edit
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(assignment);
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


// Modern Assignment Modal Component (Create/Edit) - UPDATED
function ModernAssignmentModal({ onClose, onSave, assignment, loading }) {
  // Form fields state
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    dueDate: assignment?.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '',
    dateAssigned: assignment?.dateAssigned ? new Date(assignment.dateAssigned).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    subject: assignment?.subject || '',
    className: assignment?.className || '',
    teacher: assignment?.teacher || '',
    status: assignment?.status || 'pending',
    priority: assignment?.priority || 'medium',
    estimatedTime: assignment?.estimatedTime || '',
    instructions: assignment?.instructions || '',
    additionalWork: assignment?.additionalWork || '',
    teacherRemarks: assignment?.teacherRemarks || '',
  });

  // Separate state for files and learning objectives
  const [assignmentFiles, setAssignmentFiles] = useState(() => {
    if (assignment?.assignmentFiles && assignment.assignmentFiles.length > 0) {
      return assignment.assignmentFiles.map(url => ({
        name: url.split('/').pop(),
        url: url,
        isExisting: true
      }));
    }
    return [];
  });
  
  const [attachments, setAttachments] = useState(() => {
    if (assignment?.attachments && assignment.attachments.length > 0) {
      return assignment.attachments.map(url => ({
        name: url.split('/').pop(),
        url: url,
        isExisting: true
      }));
    }
    return [];
  });
  
  const [learningObjectives, setLearningObjectives] = useState(assignment?.learningObjectives || []);
  const [newObjective, setNewObjective] = useState('');

  // Track files to remove
  const [assignmentFilesToRemove, setAssignmentFilesToRemove] = useState([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState([]);

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

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setLearningObjectives(prev => [...prev, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index) => {
    setLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };

  const handleAssignmentFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)}KB`,
      type: file.type,
      file: file,
      isExisting: false
    }));
    setAssignmentFiles(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset file input
  };

  const handleAttachmentFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)}KB`,
      type: file.type,
      file: file,
      isExisting: false
    }));
    setAttachments(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset file input
  };

  const removeAssignmentFile = (index) => {
    const file = assignmentFiles[index];
    if (file.isExisting) {
      setAssignmentFilesToRemove(prev => [...prev, file.url]);
    }
    setAssignmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeAttachment = (index) => {
    const file = attachments[index];
    if (file.isExisting) {
      setAttachmentsToRemove(prev => [...prev, file.url]);
    }
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Call parent's onSave with all data
    await onSave(
      formData, 
      assignment?.id, 
      assignmentFiles, 
      attachments, 
      learningObjectives,
      assignmentFilesToRemove,
      attachmentsToRemove
    );
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal open={true} onClose={loading ? undefined : onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #faf5ff 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <IoDocumentTextOutline className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{assignment ? 'Edit' : 'Create'} Assignment</h2>
                <p className="text-white/90 opacity-90 mt-1 text-sm">
                  Manage assignment information
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
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
            {/* Title - Full Width */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full font-bold px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Enter assignment title"
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
                  className="w-full  px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
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
                Teacher
              </label>
              <input
                type="text"
                value={formData.teacher}
                onChange={(e) => handleChange('teacher', e.target.value)}
                className="w-full font-bold px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                placeholder="Enter teacher's name"
              />
            </div>

            {/* Description - Full Width */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="4"
                className="w-full font-bold px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Describe the assignment..."
              />
            </div>

            {/* Dates in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Date Assigned
                </label>
                <input
                  type="date"
                  value={formData.dateAssigned}
                  onChange={(e) => handleChange('dateAssigned', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                />
              </div>
            </div>

            {/* Status and Priority in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                  <option value="assigned">Assigned</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-bold text-gray-800 mb-3">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Estimated Time - Full Width */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Estimated Time
              </label>
              <input
                type="text"
                value={formData.estimatedTime}
                onChange={(e) => handleChange('estimatedTime', e.target.value)}
                className="w-full font-bold  px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                placeholder="e.g., 2 Weeks, 5 Months"
              />
            </div>

<div>
  {/* Label */}
  <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
    <div className="w-1.5 h-6 bg-purple-600 rounded-full" /> 
    Learning Objectives
  </label>

  <div className="space-y-4">
    {/* 1. Input Section - Modern Flex Row */}
    <div className="flex flex-row items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={newObjective}
          onChange={(e) => setNewObjective(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
          className="w-full font-medium px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-sm sm:text-base"
          placeholder="e.g., Master React Hooks..."
        />
      </div>
      <button
        type="button"
        onClick={handleAddObjective}
        className="shrink-0 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-sm flex items-center justify-center text-sm"
      >
        Add
      </button>
    </div>

    {/* 2. Mapping Section - Modern Visible Cards */}
    <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
      {learningObjectives.length > 0 ? (
        learningObjectives.map((objective, index) => (
          <div 
            key={index} 
            className="group flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all animate-in fade-in slide-in-from-left-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Decorative Bullet */}
              <div className="w-2 h-2 rounded-full bg-purple-500/20 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-purple-600" />
              </div>
              <span className="text-sm font-semibold text-slate-700 truncate">
                {objective}
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => handleRemoveObjective(index)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiX className="text-base" />
            </button>
          </div>
        ))
      ) : (
        /* Empty State */
        <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No objectives set yet</p>
        </div>
      )}
    </div>
  </div>
</div>

            {/* Instructions - Full Width */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border-2 font-bold  border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                placeholder="Provide detailed instructions..."
              />
            </div>

            {/* Additional Work - Full Width */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Additional Work
              </label>
              <textarea
                value={formData.additionalWork}
                onChange={(e) => handleChange('additionalWork', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Any additional work or extra credit..."
              />
            </div>

            {/* Teacher Remarks - Full Width */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-3">
                Teacher Remarks
              </label>
              <textarea
                value={formData.teacherRemarks}
                onChange={(e) => handleChange('teacherRemarks', e.target.value)}
                rows="2"
                className="w-full px-4 py-3 border-2 font-bold border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                placeholder="Teacher's remarks or notes..."
              />
            </div>
<div className="w-full lg:w-[75%] mx-auto flex flex-col space-y-8">
  {/* Modernized File Upload Section */}
  <section className="bg-white rounded-[32px] p-1 sm:p-2">
    <div className="flex items-center gap-3 mb-6 px-2">
      <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
      <label className="text-xl font-black text-slate-800 tracking-tight">
        Assignment Resources
      </label>
    </div>

    <div className="space-y-6">
      {/* 1. Dropzone-style Upload Button */}
      <div className="relative group">
        <input
          type="file"
          multiple
          onChange={handleAssignmentFileChange}
          className="hidden"
          id="assignment-files-input"
        />
        <div 
          onClick={() => document.getElementById('assignment-files-input').click()}
          className="w-full py-8 border-2 border-dashed border-slate-200 rounded-[24px] bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group-active:scale-[0.98]"
        >
          <div className="p-3 bg-white shadow-sm rounded-2xl group-hover:scale-110 transition-transform">
            <FiUpload className="text-blue-600 text-2xl" />
          </div>
          <div className="text-center">
            <p className="text-slate-800 font-bold text-sm sm:text-base">
              Click to upload assignment files
            </p>
            <p className="text-slate-400 text-xs font-medium mt-1">
              PDF, DOCX, or Images up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* 2. Modernized File List - Visible & Clean */}
      {assignmentFiles.length > 0 && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {assignmentFiles.map((file, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-blue-100 transition-all animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* File Icon with background */}
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <FiFileText className="text-blue-600 text-lg" />
                </div>
                
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      file.isExisting ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {file.isExisting ? 'Cloud' : 'Local'}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">
                      {file.isExisting ? 'Stored online' : file.size}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeAssignmentFile(index)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          ))}
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
                className="px-6 py-3 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-sm"
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} className="text-white" />
                    {assignment ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FiCheck className="text-sm" />
                    {assignment ? 'Update' : 'Create'} Assignment
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
// Main Assignments Manager Component
export default function AssignmentsManager() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState(null);
  
  // NEW: Bulk delete states
  const [selectedAssignments, setSelectedAssignments] = useState(new Set());
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
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'in progress', label: 'In Progress', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'overdue', label: 'Overdue', color: 'red' },
    { value: 'assigned', label: 'Assigned', color: 'indigo' }
  ];

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'blue' },
    { value: 'medium', label: 'Medium', color: 'orange' },
    { value: 'high', label: 'High', color: 'red' }
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

  // Class options
  const classOptions = [
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

  // NEW: Handle assignment selection for bulk delete
  const handleAssignmentSelect = (assignmentId, selected) => {
    setSelectedAssignments(prev => { 
      const newSet = new Set(prev); 
      selected ? newSet.add(assignmentId) : newSet.delete(assignmentId); 
      return newSet; 
    });
  };

  // NEW: Bulk delete function
  const handleBulkDelete = () => {
    if (selectedAssignments.size === 0) {
      showNotification('warning', 'No Selection', 'No assignments selected for deletion');
      return;
    }
    setDeleteType('bulk');
    setShowDeleteModal(true);
  };

  // Map JSON data to our component's expected structure
  const mapAssignmentData = (apiAssignment) => {
    return {
      id: apiAssignment.id,
      title: apiAssignment.title || 'Untitled Assignment',
      description: apiAssignment.description || '',
      dueDate: apiAssignment.dueDate || new Date().toISOString().split('T')[0],
      dateAssigned: apiAssignment.dateAssigned || new Date().toISOString(),
      subject: apiAssignment.subject || 'General',
      className: apiAssignment.className || apiAssignment.grade || '',
      teacher: apiAssignment.teacher || '',
      status: apiAssignment.status || 'pending',
      priority: apiAssignment.priority || 'medium',
      estimatedTime: apiAssignment.estimatedTime || '',
      instructions: apiAssignment.instructions || '',
      assignmentFiles: apiAssignment.assignmentFiles || [],
      attachments: apiAssignment.attachments || [],
      additionalWork: apiAssignment.additionalWork || '',
      teacherRemarks: apiAssignment.teacherRemarks || '',
      feedback: apiAssignment.feedback || null,
      learningObjectives: apiAssignment.learningObjectives || [],
      createdAt: apiAssignment.createdAt || new Date().toISOString(),
      updatedAt: apiAssignment.updatedAt || new Date().toISOString(),
      
      // Legacy fields for compatibility
      grade: apiAssignment.className || apiAssignment.grade || '',
      assignedTo: apiAssignment.teacher || '',
      points: 100,
      submissionType: 'online',
      maxScore: 100,
      completionRate: 0,
      averageScore: 0,
      submissionsCount: 0
    };
  };

  // Calculate statistics
  const calculateStats = (assignmentsList) => {
    const today = new Date();
    const stats = {
      total: assignmentsList.length,
      pending: assignmentsList.filter(a => a.status === 'pending').length,
      inProgress: assignmentsList.filter(a => a.status === 'in progress').length,
      completed: assignmentsList.filter(a => a.status === 'completed').length,
      assigned: assignmentsList.filter(a => a.status === 'assigned').length,
      overdue: assignmentsList.filter(a => 
        a.status !== 'completed' && 
        a.dueDate && 
        new Date(a.dueDate) < today
      ).length,
      highPriority: assignmentsList.filter(a => a.priority === 'high').length,
      thisWeek: assignmentsList.filter(a => {
        if (!a.dueDate) return false;
        const dueDate = new Date(a.dueDate);
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        return dueDate >= today && dueDate <= nextWeek;
      }).length,
      totalPoints: assignmentsList.reduce((acc, a) => acc + (parseInt(a.points) || 0), 0),
      avgCompletion: assignmentsList.reduce((acc, a) => acc + (a.completionRate || 0), 0) / (assignmentsList.length || 1),
      
      // Class stats
      form1: assignmentsList.filter(a => a.className === 'Form 1').length,
      form2: assignmentsList.filter(a => a.className === 'Form 2').length,
      form3: assignmentsList.filter(a => a.className === 'Form 3').length,
      form4: assignmentsList.filter(a => a.className === 'Form 4').length,
      form5: assignmentsList.filter(a => a.className === 'Form 5').length,
      form6: assignmentsList.filter(a => a.className === 'Form 6').length
    };
    setStats(stats);
  };

  // Fetch assignments with refresh support
  const fetchAssignments = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await fetch('/api/assignment', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && Array.isArray(result.assignments)) {
        const mappedAssignments = result.assignments.map(mapAssignmentData);
        setAssignments(mappedAssignments);
        setFilteredAssignments(mappedAssignments);
        calculateStats(mappedAssignments);
        
        if (mappedAssignments.length === 0) {
          showNotification('info', 'No Assignments', 'No assignments found in the system.');
        } else {
          showNotification('success', 'Loaded', `${mappedAssignments.length} assignments loaded successfully!`);
        }
      } else if (result.success && result.assignments === null) {
        setAssignments([]);
        setFilteredAssignments([]);
        calculateStats([]);
        showNotification('info', 'No Assignments', 'No assignments found in the system.');
      } else {
        throw new Error(result.error || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      showNotification('error', 'Load Failed', error.message || 'Failed to load assignments. Please try again.');
      setAssignments([]);
      setFilteredAssignments([]);
      calculateStats([]);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchAssignments();
  }, []);

  // Filter assignments
  useEffect(() => {
    let filtered = assignments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assignment.description && assignment.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (assignment.subject && assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (assignment.teacher && assignment.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === selectedStatus);
    }

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === selectedSubject);
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(assignment => assignment.priority === selectedPriority);
    }

    // Class filter
    if (selectedClass !== 'all') {
      filtered = filtered.filter(assignment => assignment.className === selectedClass);
    }

    setFilteredAssignments(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedSubject, selectedPriority, selectedClass, assignments]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // View assignment
  const handleView = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailModal(true);
  };

  // Edit assignment
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowModal(true);
  };

  // Delete assignment - single
  const handleDeleteClick = (assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteType('single');
    setShowDeleteModal(true);
  };

  // Confirm delete - handles both single and bulk
  const confirmDelete = async () => {
    if (deleteType === 'single' && !assignmentToDelete) return;
    
    setDeleting(true);
    setBulkDeleting(true);
    
    try {
      if (deleteType === 'single' && assignmentToDelete) {
        // Single delete
        const response = await fetch(`/api/assignment/${assignmentToDelete.id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Update local state without refetching
          setAssignments(prev => prev.filter(a => a.id !== assignmentToDelete.id));
          setFilteredAssignments(prev => prev.filter(a => a.id !== assignmentToDelete.id));
          showNotification('success', 'Deleted', 'Assignment deleted successfully!');
        } else {
          throw new Error(result.error);
        }
      } else if (deleteType === 'bulk') {
        // Bulk delete
        const deletedIds = [];
        const failedIds = [];
        
        // Delete each selected assignment
        for (const assignmentId of selectedAssignments) {
          try {
            const response = await fetch(`/api/assignment/${assignmentId}`, {
              method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (result.success) {
              deletedIds.push(assignmentId);
            } else {
              console.error(`Failed to delete assignment ${assignmentId}:`, result.error);
              failedIds.push(assignmentId);
            }
          } catch (error) {
            console.error(`Error deleting assignment ${assignmentId}:`, error);
            failedIds.push(assignmentId);
          }
        }
        
        // Refresh the list
        await fetchAssignments();
        setSelectedAssignments(new Set());
        
        if (deletedIds.length > 0 && failedIds.length === 0) {
          showNotification('success', 'Bulk Delete Successful', `Successfully deleted ${deletedIds.length} assignment(s)`);
        } else if (deletedIds.length > 0 && failedIds.length > 0) {
          showNotification('warning', 'Partial Success', `Deleted ${deletedIds.length} assignment(s), failed to delete ${failedIds.length}`);
        } else {
          showNotification('error', 'Delete Failed', 'Failed to delete selected assignments');
        }
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      showNotification('error', 'Delete Failed', 'Failed to delete assignment');
    } finally {
      setDeleting(false);
      setBulkDeleting(false);
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
    }
  };


const handleSubmit = async (formData, id, assignmentFiles = [], attachments = [], learningObjectives = [], assignmentFilesToRemove = [], attachmentsToRemove = []) => {
  setSaving(true);
  try {
    console.log('📤 Starting submission...');
    console.log('Files info:', {
      assignmentFilesCount: assignmentFiles?.length || 0,
      attachmentsCount: attachments?.length || 0,
      filesToRemoveCount: assignmentFilesToRemove?.length || 0,
      attachmentsToRemoveCount: attachmentsToRemove?.length || 0
    });

    // Create FormData object
    const formDataToSend = new FormData();
    
    // Add all form fields to FormData
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('dueDate', formData.dueDate);
    formDataToSend.append('dateAssigned', formData.dateAssigned || new Date().toISOString().split('T')[0]);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('className', formData.className);
    formDataToSend.append('teacher', formData.teacher);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('priority', formData.priority);
    formDataToSend.append('estimatedTime', formData.estimatedTime);
    formDataToSend.append('instructions', formData.instructions);
    formDataToSend.append('additionalWork', formData.additionalWork);
    formDataToSend.append('teacherRemarks', formData.teacherRemarks);
    
    // Handle learning objectives - MUST be JSON string
    const learningObjectivesString = JSON.stringify(learningObjectives || []);
    formDataToSend.append('learningObjectives', learningObjectivesString);
    console.log('Learning objectives:', learningObjectivesString.substring(0, 100));

    // Handle assignment files for UPDATE
    if (id && assignmentFiles) {
      // Get existing assignment files (those that weren't removed)
      const existingAssignmentFiles = assignmentFiles
        .filter(file => file.isExisting && file.url)
        .map(file => file.url);
      
      if (existingAssignmentFiles.length > 0) {
        formDataToSend.append('existingAssignmentFiles', JSON.stringify(existingAssignmentFiles));
        console.log('Existing assignment files:', existingAssignmentFiles.length);
      }
      
      // Add new assignment files (actual file objects)
      assignmentFiles.forEach((file) => {
        if (file.file && !file.isExisting) {
          formDataToSend.append('assignmentFiles', file.file);
          console.log('Adding new assignment file:', file.name);
        }
      });
      
      // Add assignment files to remove
      if (assignmentFilesToRemove.length > 0) {
        formDataToSend.append('assignmentFilesToRemove', JSON.stringify(assignmentFilesToRemove));
        console.log('Assignment files to remove:', assignmentFilesToRemove.length);
      }
    } else if (!id && assignmentFiles) {
      // For CREATE - add all assignment files
      assignmentFiles.forEach((file) => {
        if (file.file) {
          formDataToSend.append('assignmentFiles', file.file);
          console.log('Adding new assignment file (create):', file.name);
        }
      });
    }

    // Handle attachments for UPDATE
    if (id && attachments) {
      // Get existing attachments (those that weren't removed)
      const existingAttachments = attachments
        .filter(file => file.isExisting && file.url)
        .map(file => file.url);
      
      if (existingAttachments.length > 0) {
        formDataToSend.append('existingAttachments', JSON.stringify(existingAttachments));
        console.log('Existing attachments:', existingAttachments.length);
      }
      
      // Add new attachments (actual file objects)
      attachments.forEach((file) => {
        if (file.file && !file.isExisting) {
          formDataToSend.append('attachments', file.file);
          console.log('Adding new attachment:', file.name);
        }
      });
      
      // Add attachments to remove
      if (attachmentsToRemove.length > 0) {
        formDataToSend.append('attachmentsToRemove', JSON.stringify(attachmentsToRemove));
        console.log('Attachments to remove:', attachmentsToRemove.length);
      }
    } else if (!id && attachments) {
      // For CREATE - add all attachments
      attachments.forEach((file) => {
        if (file.file) {
          formDataToSend.append('attachments', file.file);
          console.log('Adding new attachment (create):', file.name);
        }
      });
    }

    // Log FormData contents for debugging
    console.log('FormData entries:');
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ':', 
        pair[1] instanceof File ? `File: ${pair[1].name} (${pair[1].size} bytes)` :
        typeof pair[1] === 'string' ? pair[1].substring(0, 100) + '...' : pair[1]
      );
    }

    let response;
    let url;
    
    if (id) {
      // Update existing assignment
      url = `/api/assignment/${id}`;
      console.log(`PUT request to: ${url}`);
      response = await fetch(url, {
        method: 'PUT',
        body: formDataToSend,
        // No Content-Type header for FormData
      });
    } else {
      // Create new assignment
      url = '/api/assignment';
      console.log(`POST request to: ${url}`);
      response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
        // No Content-Type header for FormData
      });
    }

    const result = await response.json();
    console.log('API Response:', result);

    if (result.success) {
      // Refresh the list
      await fetchAssignments();
      setShowModal(false);
      showNotification(
        'success',
        id ? 'Updated' : 'Created',
        `Assignment ${id ? 'updated' : 'created'} successfully!`
      );
    } else {
      throw new Error(result.error || 'Failed to save assignment');
    }
  } catch (error) {
    console.error('❌ Error saving assignment:', error);
    showNotification('error', 'Save Failed', error.message || `Failed to ${id ? 'update' : 'create'} assignment`);
  } finally {
    setSaving(false);
  }
};

  // Create new assignment
  const handleCreate = () => {
    setEditingAssignment(null);
    setShowModal(true);
  };

  // Pagination Component
  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700 font-medium">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAssignments.length)} of {filteredAssignments.length} assignments
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
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
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
  if (loading && assignments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Spinner size={48} />
          <p className="text-gray-700 text-lg mt-4 font-medium">
            Loading Assignments
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Please wait while we fetch school assignments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
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
        count={deleteType === 'bulk' ? selectedAssignments.size : 1}
        itemName={deleteType === 'single' ? assignmentToDelete?.title : ''}
        itemType="assignment"
        loading={deleting || bulkDeleting}
      />
{/* Modern Responsive Header – Assignments Theme */}
<div className="relative mb-6 sm:mb-8 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem]
                bg-gradient-to-br from-indigo-700 via-purple-700 to-violet-700
                p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl">

  {/* Subtle Background Overlay */}
  <div className="absolute inset-0 opacity-[0.08] sm:opacity-10 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10" />
  </div>

  {/* Glow Effects */}
  <div className="absolute -right-16 sm:-right-24 -top-16 sm:-top-24
                  w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96
                  bg-gradient-to-r from-indigo-500 to-purple-400
                  rounded-full opacity-15 sm:opacity-20
                  blur-xl sm:blur-2xl md:blur-3xl" />

  <div className="absolute -left-16 sm:-left-24 -bottom-16 sm:-bottom-24
                  w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96
                  bg-gradient-to-r from-purple-500 to-violet-400
                  rounded-full opacity-10 sm:opacity-15
                  blur-xl sm:blur-2xl md:blur-3xl" />

  <div className="relative z-10">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">

      {/* Left Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">

          {/* Icon */}
          <div className="relative self-start shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500
                            rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-70" />
            <div className="relative p-3 sm:p-4 bg-gradient-to-br from-indigo-600 to-purple-600
                            rounded-xl sm:rounded-2xl shadow-2xl">
              <FiClipboard className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">

            {/* Badge */}
            <div className="hidden xs:inline-flex items-center gap-1.5 sm:gap-2
                            px-2 sm:px-3 py-1
                            bg-white/20 backdrop-blur-sm
                            rounded-full mb-2 sm:mb-3 max-w-max">
              <FiShield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              <span className="text-[10px] xs:text-xs font-bold text-white uppercase tracking-widest">
                Academic Tasks
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl
                           font-black text-white tracking-tight leading-tight">
              Assignments <span className="block sm:inline">& </span>
              <span className="text-transparent bg-clip-text
                               bg-gradient-to-r from-purple-200 to-indigo-200">
                Manager
              </span>
            </h1>

            {/* Description */}
            <p className="mt-2 sm:mt-3 text-sm xs:text-base sm:text-lg
                          text-indigo-100/90 font-medium
                          max-w-2xl leading-relaxed
                          line-clamp-2 sm:line-clamp-none">
              Create, organize, distribute, and track student assignments across classes and subjects.
            </p>

          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between
                      lg:flex-col lg:items-end gap-3 sm:gap-4">

        {/* Actions */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">

          {/* Refresh */}
          <button
            onClick={() => fetchAssignments(true)}
            disabled={refreshing}
            className="group relative flex items-center justify-center gap-2
                       px-4 sm:px-5 py-2.5 sm:py-3
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

          {/* Create */}
          <button
            onClick={handleCreate}
            className="group relative overflow-hidden
                       px-4 sm:px-5 py-2.5 sm:py-3
                       bg-gradient-to-r from-indigo-500 to-purple-500
                       text-white rounded-xl sm:rounded-2xl font-semibold
                       hover:shadow-xl hover:shadow-purple-500/30
                       active:scale-95 transition-all w-full xs:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/0
                            opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2">
              <FiPlus className="w-4 h-4" />
              <span className="text-xs sm:text-sm whitespace-nowrap">
                Create Assignment
              </span>
            </div>
          </button>

        </div>
      </div>

    </div>
  </div>
</div>



      {/* Bulk Actions Section - NEW */}
      {selectedAssignments.size > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <FiTrash2 className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg">
                  {selectedAssignments.size} assignment{selectedAssignments.size === 1 ? '' : 's'} selected
                </h3>
                <p className="text-red-700 text-sm">
                  You can perform bulk actions on selected items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedAssignments(new Set())}
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
                    Delete Selected ({selectedAssignments.size})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Total</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <IoDocumentTextOutline className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">This Week</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
              </div>
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-2xl">
                <IoCalendarOutline className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Form 1</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.form1 || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <FiUsers className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Form 2</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.form2 || 0}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <FiUsers className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Form 3</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.form3 || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                <FiUsers className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Form 4</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.form4 || 0}</p>
              </div>
              <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                <FiUsers className="text-lg" />
              </div>
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
              placeholder="Search assignments by title, description, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Status</option>
            {statusOptions.map(option => (
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
            <option value="all">All Subjects</option>
            {subjectOptions.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Priorities</option>
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Classes</option>
            {classOptions.map(className => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignments Grid */}
      {filteredAssignments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {currentItems.map((assignment) => (
              <ModernAssignmentCard 
                key={assignment.id} 
                assignment={assignment}
                onEdit={handleEdit} 
                onDelete={handleDeleteClick} 
                onView={handleView}
                selected={selectedAssignments.has(assignment.id)} 
                onSelect={handleAssignmentSelect} 
                actionLoading={saving}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredAssignments.length > itemsPerPage && (
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
              <Pagination />
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
          <IoDocumentTextOutline className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            {searchTerm || selectedStatus !== 'all' || selectedSubject !== 'all' || selectedClass !== 'all' ? 
              'No assignments found' : 
              'No assignments available'}
          </h3>
          <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
            {searchTerm || selectedStatus !== 'all' || selectedSubject !== 'all' || selectedClass !== 'all' ? 
              'Try adjusting your search criteria' : 
              'There are no assignments in the system yet. Create your first assignment!'}
          </p>
          <button 
            onClick={handleCreate} 
            className="text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 mx-auto text-sm lg:text-base cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            <FiPlus /> Create First Assignment
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <ModernAssignmentModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSubmit} 
          assignment={editingAssignment}
          loading={saving} 
        />
      )}
      
      {/* Assignment Detail Modal */}
      {showDetailModal && selectedAssignment && (
        <ModernAssignmentDetailModal 
          assignment={selectedAssignment}
          onClose={() => setShowDetailModal(false)} 
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}