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
  FiUserPlus,
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
  FiEdit2,
  FiPercent,
  FiStar,
  FiBookOpen,
  FiArchive,
  FiTag,
  FiMail,
  FiUserCheck, 
  FiClipboard, 
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

import {
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlinePresentationChartBar,
  HiOutlineSparkles
} from 'react-icons/hi';

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
  );
}

// Modern Assignment Detail Modal - Using ResourcesManager style
function ModernAssignmentDetailModal({ assignment, onClose, onEdit }) {
  if (!assignment) return null;

  // Status colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: 'bg-green-500' };
      case 'in progress': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: 'bg-blue-500' };
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: 'bg-yellow-500' };
      case 'overdue': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: 'bg-red-500' };
      case 'assigned': return { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', icon: 'bg-indigo-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: 'bg-gray-500' };
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

  const getFileIcon = (type) => {
    if (!type) return <FiFile />;
    switch (type.toLowerCase()) {
      case 'pdf': return <FiFileText />;
      case 'video': return <FiVideo />;
      case 'image': return <FiImage />;
      case 'document': return <HiOutlineDocumentText />;
      case 'presentation': return <HiOutlinePresentationChartBar />;
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
                <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
                  <FiClipboard size={16} />
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600/70">Academic Assignment</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {assignment.title}
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
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
              <span className={`w-2 h-2 rounded-full ${statusColor.icon}`}></span>
              {assignment.status?.charAt(0).toUpperCase() + assignment.status?.slice(1) || 'Pending'}
            </div>
            {assignment.priority && (
              <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-100">
                {assignment.priority} Priority
              </div>
            )}
            {assignment.subject && (
              <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                {assignment.subject}
              </div>
            )}
            {assignment.className && (
              <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                {assignment.className}
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Description & Files */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Description Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <IoDocumentTextOutline />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Assignment Description</h3>
                </div>
                <div className="bg-slate-50/50 p-6 rounded-[24px] border border-slate-100">
                  <p className="text-slate-600 leading-relaxed text-base">
                    {assignment.description || "No detailed description provided."}
                  </p>
                </div>
              </section>

              {/* Instructions Section */}
              {assignment.instructions && (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <FiBookOpen />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Instructions</h3>
                  </div>
                  <div className="bg-blue-50/50 p-6 rounded-[24px] border border-blue-100">
                    <p className="text-slate-600 leading-relaxed text-base">
                      {assignment.instructions}
                    </p>
                  </div>
                </section>
              )}

              {/* Files Grid - Modernized */}
              {(assignment.assignmentFiles?.length > 0 || assignment.attachments?.length > 0) && (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <FiPaperclip />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Attachments ({assignment.assignmentFiles?.length + assignment.attachments?.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...(assignment.assignmentFiles || []), ...(assignment.attachments || [])].map((file, idx) => {
                      const fileName = typeof file === 'string' ? file.split('/').pop() : file.name || 'File';
                      const fileExt = fileName.split('.').pop()?.toLowerCase();
                      
                      return (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
                          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {getFileIcon(fileExt)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {fileName.replace(/^[\d-]+/, "")}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                              {fileExt?.toUpperCase()} • Assignment File
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Metadata Cards */}
            <div className="lg:col-span-4">
              <div className="sticky top-0 space-y-4">
                <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Assignment Details</h3>
                  
                  <div className="space-y-6">
                    {/* Teacher */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                        <FiUserCheck className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase">Teacher</p>
                        <p className="text-sm font-bold">{assignment.teacher || 'Unassigned'}</p>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                        <FiCalendar className="text-rose-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase">Due Date</p>
                        <p className="text-sm font-bold">
                          {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Not set'}
                        </p>
                      </div>
                    </div>

                    {/* Assigned Date */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                        <IoCalendarOutline className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase">Assigned On</p>
                        <p className="text-sm font-bold">
                          {assignment.dateAssigned ? new Date(assignment.dateAssigned).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          }) : 'Today'}
                        </p>
                      </div>
                    </div>

                    {/* Estimated Time */}
                    {assignment.estimatedTime && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                          <FiClock className="text-amber-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-white/40 uppercase">Time Estimate</p>
                          <p className="text-sm font-bold">{assignment.estimatedTime}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Learning Objectives Card */}
                {assignment.learningObjectives?.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[24px] p-6 border border-purple-100">
                    <div className="flex items-center gap-2 mb-4">
                      <FiTarget className="text-purple-600" />
                      <h3 className="text-sm font-bold text-purple-900">Learning Objectives</h3>
                    </div>
                    <div className="space-y-3">
                      {assignment.learningObjectives.slice(0, 3).map((objective, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <FiCheck className="text-purple-500 mt-1 flex-shrink-0" size={12} />
                          <p className="text-xs text-purple-800 font-medium">{objective}</p>
                        </div>
                      ))}
                      {assignment.learningObjectives.length > 3 && (
                        <p className="text-[10px] font-bold text-purple-600/70 uppercase tracking-wider mt-2">
                          +{assignment.learningObjectives.length - 3} more objectives
                        </p>
                      )}
                    </div>
                  </div>
                )}
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
            onClick={() => onEdit(assignment)}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black transition-all duration-300 shadow-lg shadow-slate-200"
          >
            <FiEdit size={18} /> Edit Assignment
          </button>
        </div>
      </Box>
    </Modal>
  );
}

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

  // File states with size tracking
  const [assignmentFiles, setAssignmentFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [learningObjectives, setLearningObjectives] = useState(assignment?.learningObjectives || []);
  const [newObjective, setNewObjective] = useState('');
  
  // Track files to remove
  const [assignmentFilesToRemove, setAssignmentFilesToRemove] = useState([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState([]);
  
  // File size validation states
  const [totalSizeMB, setTotalSizeMB] = useState(0);
  const [fileSizeError, setFileSizeError] = useState('');
  
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

  // Initialize with assignment data
  useEffect(() => {
    if (assignment) {
      // Initialize assignment files
      if (assignment.assignmentFiles && assignment.assignmentFiles.length > 0) {
        const files = assignment.assignmentFiles.map((url, index) => ({
          id: `existing-assignment-${index}`,
          name: url.split('/').pop() || `Assignment File ${index + 1}`,
          url: url,
          isExisting: true,
          size: 0 // We don't know the size of existing files
        }));
        setAssignmentFiles(files);
      }
      
      // Initialize attachments
      if (assignment.attachments && assignment.attachments.length > 0) {
        const attach = assignment.attachments.map((url, index) => ({
          id: `existing-attachment-${index}`,
          name: url.split('/').pop() || `Attachment ${index + 1}`,
          url: url,
          isExisting: true,
          size: 0 // We don't know the size of existing files
        }));
        setAttachments(attach);
      }
    }
  }, [assignment]);

  // Calculate total file size whenever files change
  useEffect(() => {
    let totalBytes = 0;
    
    // Add size of new assignment files
    assignmentFiles.forEach(file => {
      if (file.file && file.file.size && !file.isExisting) {
        totalBytes += file.file.size;
      }
    });
    
    // Add size of new attachments
    attachments.forEach(file => {
      if (file.file && file.file.size && !file.isExisting) {
        totalBytes += file.file.size;
      }
    });
    
    const totalMB = totalBytes / (1024 * 1024);
    setTotalSizeMB(parseFloat(totalMB.toFixed(2)));
    
    // Check Vercel's 4.5MB limit
    const VERCEL_LIMIT_MB = 4.5;
    if (totalMB > VERCEL_LIMIT_MB) {
      setFileSizeError(`Total file size (${totalMB.toFixed(1)}MB) exceeds Vercel's ${VERCEL_LIMIT_MB}MB limit`);
    } else {
      setFileSizeError('');
    }
  }, [assignmentFiles, attachments]);

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setLearningObjectives(prev => [...prev, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index) => {
    setLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };

  // Handle assignment file upload with size validation
  const handleAssignmentFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;
    
    // Validate each file
    const validFiles = selectedFiles.filter(file => {
      if (!file || !file.type) {
        return false;
      }
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      const isValidType = allowedTypes.some(type => file.type.includes(type));
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB per file
      
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      alert('Please select valid files (max 10MB each, PDF, DOC, PPT, Images)');
      e.target.value = '';
      return;
    }

    // Calculate total size if we add these files
    let newFilesTotalBytes = 0;
    validFiles.forEach(file => {
      newFilesTotalBytes += file.size;
    });

    const currentTotalMB = totalSizeMB;
    const newTotalMB = currentTotalMB + (newFilesTotalBytes / (1024 * 1024));
    const VERCEL_LIMIT_MB = 4.5;

    // Check Vercel total size limit
    if (newTotalMB > VERCEL_LIMIT_MB) {
      const availableSpace = VERCEL_LIMIT_MB - currentTotalMB;
      alert(
        `Cannot add these files. Available space: ${availableSpace.toFixed(1)}MB\n` +
        `Total would be: ${newTotalMB.toFixed(1)}MB (Limit: ${VERCEL_LIMIT_MB}MB)`
      );
      e.target.value = '';
      return;
    }

    // Create file objects
    const newFiles = validFiles.map(file => ({
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      isExisting: false
    }));
    
    setAssignmentFiles(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset file input
  };

  // Handle attachment file upload with size validation
  const handleAttachmentFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;
    
    // Validate each file
    const validFiles = selectedFiles.filter(file => {
      if (!file || !file.type) {
        return false;
      }
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      const isValidType = allowedTypes.some(type => file.type.includes(type));
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB per file
      
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      alert('Please select valid files (max 10MB each, PDF, DOC, PPT, Images)');
      e.target.value = '';
      return;
    }

    // Calculate total size if we add these files
    let newFilesTotalBytes = 0;
    validFiles.forEach(file => {
      newFilesTotalBytes += file.size;
    });

    const currentTotalMB = totalSizeMB;
    const newTotalMB = currentTotalMB + (newFilesTotalBytes / (1024 * 1024));
    const VERCEL_LIMIT_MB = 4.5;

    // Check Vercel total size limit
    if (newTotalMB > VERCEL_LIMIT_MB) {
      const availableSpace = VERCEL_LIMIT_MB - currentTotalMB;
      alert(
        `Cannot add these files. Available space: ${availableSpace.toFixed(1)}MB\n` +
        `Total would be: ${newTotalMB.toFixed(1)}MB (Limit: ${VERCEL_LIMIT_MB}MB)`
      );
      e.target.value = '';
      return;
    }

    // Create file objects
    const newFiles = validFiles.map(file => ({
      id: `new-attach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      isExisting: false
    }));
    
    setAttachments(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset file input
  };

  // Remove assignment file
  const removeAssignmentFile = (fileId) => {
    const file = assignmentFiles.find(f => f.id === fileId);
    if (file && file.isExisting) {
      setAssignmentFilesToRemove(prev => [...prev, file.url]);
    }
    setAssignmentFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Remove attachment
  const removeAttachment = (fileId) => {
    const file = attachments.find(f => f.id === fileId);
    if (file && file.isExisting) {
      setAttachmentsToRemove(prev => [...prev, file.url]);
    }
    setAttachments(prev => prev.filter(f => f.id !== fileId));
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get size color based on current usage
  const getSizeColor = () => {
    if (totalSizeMB > 4.5) return 'text-red-600';
    if (totalSizeMB > 3.5) return 'text-amber-600';
    return 'text-green-600';
  };

  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Check file size limit before submitting
    const VERCEL_LIMIT_MB = 4.5;
    if (totalSizeMB > VERCEL_LIMIT_MB) {
      alert(`Total file size (${totalSizeMB.toFixed(1)}MB) exceeds the ${VERCEL_LIMIT_MB}MB limit`);
      return;
    }
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.subject) {
      alert('Please select a subject');
      return;
    }
    
    if (!formData.className) {
      alert('Please select a class');
      return;
    }
    
    if (!formData.dueDate) {
      alert('Please select a due date');
      return;
    }
    
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
                  Manage assignment information and files
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
            {/* File Size Warning */}
            {fileSizeError && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-700 font-bold">{fileSizeError}</p>
                    <p className="text-red-600 text-sm mt-1">
                      Remove files or reduce file sizes to continue
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Title - Full Width */}
            <div>
              <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-red-500">*</span>
                <FiTag className="text-indigo-500" />
                Assignment Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full font-bold px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Enter assignment title"
                disabled={loading}
              />
            </div>

            {/* Subject and Class in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <FiBookOpen className="text-purple-500" />
                  Subject
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full  px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                  disabled={loading}
                >
                  <option value="">Select Subject</option>
                  {subjectOptions.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <FiUsers className="text-green-500" />
                  Class
                </label>
                <select
                  required
                  value={formData.className}
                  onChange={(e) => handleChange('className', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                  disabled={loading}
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
              <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiUserCheck className="text-amber-500" />
                Teacher
              </label>
              <input
                type="text"
                value={formData.teacher}
                onChange={(e) => handleChange('teacher', e.target.value)}
                className="w-full font-bold px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                placeholder="Enter teacher's name"
                disabled={loading}
              />
            </div>

            {/* Description - Full Width */}
            <div>
              <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-red-500">*</span>
                <FiFileText className="text-blue-500" />
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="4"
                className="w-full font-bold px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Describe the assignment..."
                disabled={loading}
              />
            </div>

            {/* Dates in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <FiCalendar className="text-indigo-500" />
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FiCalendar className="text-indigo-500" />
                  Date Assigned
                </label>
                <input
                  type="date"
                  value={formData.dateAssigned}
                  onChange={(e) => handleChange('dateAssigned', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Status and Priority in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                  <option value="assigned">Assigned</option>
                </select>
              </div>

              <div>
                <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FiTarget className="text-orange-500" />
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                  disabled={loading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Estimated Time - Full Width */}
            <div>
              <label className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiClock className="text-amber-500" />
                Estimated Time
              </label>
              <input
                type="text"
                value={formData.estimatedTime}
                onChange={(e) => handleChange('estimatedTime', e.target.value)}
                className="w-full font-bold  px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                placeholder="e.g., 2 Weeks, 5 Months"
                disabled={loading}
              />
            </div>

            {/* Learning Objectives */}
            <div>
              <label className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiTarget className="text-purple-500" />
                Learning Objectives
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                    placeholder="Enter learning objective..."
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    disabled={loading || !newObjective.trim()}
                    className="px-4 py-3 bg-purple-600 text-white rounded-xl font-bold disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                
                {learningObjectives.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {learningObjectives.map((objective, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-2">
                          <FiCheckCircle className="text-purple-500" />
                          <span className="text-sm font-medium text-gray-800">{objective}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveObjective(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          disabled={loading}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions - Full Width */}
            <div>
              <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiBookOpen className="text-green-500" />
                Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border-2 font-bold  border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                placeholder="Provide detailed instructions..."
                disabled={loading}
              />
            </div>

            {/* Additional Work - Full Width */}
            <div>
              <label className=" text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiFileText className="text-blue-500" />
                Additional Work
              </label>
              <textarea
                value={formData.additionalWork}
                onChange={(e) => handleChange('additionalWork', e.target.value)}
                rows="3"
                className="w-full px-4 py-3 font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Any additional work or extra credit..."
                disabled={loading}
              />
            </div>

            {/* Teacher Remarks - Full Width */}
            <div>
              <label className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiEdit className="text-amber-500" />
                Teacher Remarks
              </label>
              <textarea
                value={formData.teacherRemarks}
                onChange={(e) => handleChange('teacherRemarks', e.target.value)}
                rows="2"
                className="w-full px-4 py-3 border-2 font-bold border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                placeholder="Teacher's remarks or notes..."
                disabled={loading}
              />
            </div>

            {/* File Upload Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FiUpload className="text-blue-500" />
                    <span>File Upload</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Max 10MB per file • Total limit: 4.5MB • PDF, DOC, PPT, Images
                  </p>
                </div>
                
                {/* Size Indicator */}
                <div className={`flex items-center gap-3 ${getSizeColor()}`}>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalSizeMB.toFixed(1)} MB</p>
                    <p className="text-xs">of 4.5 MB</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        totalSizeMB > 4.5 
                          ? 'bg-red-500' 
                          : totalSizeMB > 3.5
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((totalSizeMB / 4.5) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Modern Assignment Resource Manager */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black uppercase tracking-[0.15em] text-slate-500 ml-1">
                    Assignment Resources
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold ${totalSizeMB > 4.5 ? 'text-red-500' : 'text-slate-400'}`}>
                      {totalSizeMB.toFixed(1)}MB / 4.5MB
                    </span>
                  </div>
                </div>

                {/* Vercel Size Warning */}
                {totalSizeMB > 4.5 && (
                  <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-500 text-white rounded-lg shadow-lg shadow-red-200">
                        <FiAlertCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-red-900">Storage Limit Exceeded</p>
                        <p className="text-xs text-red-700 font-medium">Please remove some files to proceed with the upload.</p>
                      </div>
                      <button
                        onClick={() => { setAssignmentFiles([]); setAttachments([]); }}
                        className="px-4 py-2 bg-white text-red-600 text-xs font-black uppercase tracking-wider rounded-xl border border-red-100 shadow-sm hover:bg-red-50 transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {/* Size Progress Bar */}
                <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
                      totalSizeMB > 4.5 ? 'bg-red-500' : totalSizeMB > 3.5 ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min((totalSizeMB / 4.5) * 100, 100)}%` }}
                  />
                </div>

                {/* Modern Dropzone Area for Assignment Files */}
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    onChange={handleAssignmentFileChange}
                    className="hidden"
                    id="assignment-files"
                    disabled={loading || totalSizeMB > 4.5}
                  />
                  <label 
                    htmlFor="assignment-files" 
                    className={`cursor-pointer w-full py-12 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center text-center px-6 transition-all duration-300 ${
                      totalSizeMB > 4.5
                        ? 'border-slate-200 bg-slate-50/50 opacity-50 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/30'
                    }`}
                  >
                    <div className={`p-5 rounded-3xl mb-4 transition-all duration-300 ${
                      totalSizeMB > 4.5 
                        ? 'bg-slate-100 text-slate-400' 
                        : 'bg-slate-50 text-indigo-600 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-indigo-100'
                    }`}>
                      <FiUpload size={32} />
                    </div>
                    <p className={`text-lg font-black tracking-tight mb-1 ${totalSizeMB > 4.5 ? 'text-slate-400' : 'text-slate-900'}`}>
                      {totalSizeMB > 4.5 ? 'Storage Capacity Reached' : 'Drop assignment files here'}
                    </p>
                    <p className="text-slate-500 text-sm font-medium">
                      Support PDF, DOCX, PPT, or Images up to 10MB
                    </p>
                  </label>
                </div>

                {/* Asset List Section */}
                {(assignmentFiles.length > 0 || attachments.length > 0) && (
                  <div className="pt-4 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-px flex-1 bg-slate-100" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Managed Assets ({assignmentFiles.length + attachments.length})
                      </span>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                      {/* Assignment Files */}
                      {assignmentFiles.map((file, idx) => {
                        const fileSize = file.size ? (file.size / (1024 * 1024)).toFixed(1) : '0.0';
                        return (
                          <div 
                            key={file.id || idx} 
                            className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                file.isExisting ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                              }`}>
                                <FiFileText size={20} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate pr-4">
                                  {file.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                    file.isExisting ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                                  }`}>
                                    {file.isExisting ? 'Cloud' : 'New'}
                                  </span>
                                  <span className="text-[11px] font-bold text-slate-400">
                                    {fileSize} MB
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeAssignmentFile(file.id)}
                              className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                        );
                      })}

                      {/* Attachments */}
                      {attachments.map((file, idx) => {
                        const fileSize = file.size ? (file.size / (1024 * 1024)).toFixed(1) : '0.0';
                        return (
                          <div 
                            key={`attach-${file.id || idx}`} 
                            className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-50/50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                file.isExisting ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                <FiPaperclip size={20} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate pr-4">
                                  {file.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                    file.isExisting ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {file.isExisting ? 'Cloud' : 'New'}
                                  </span>
                                  <span className="text-[11px] font-bold text-slate-400">
                                    {fileSize} MB
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeAttachment(file.id)}
                              className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button 
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 cursor-pointer text-sm"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={loading || totalSizeMB > 4.5 || !formData.title.trim() || !formData.subject || !formData.className || !formData.dueDate}
                className="px-6 py-3 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-sm hover:from-indigo-700 hover:to-purple-700 transition-all"
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

// Main Assignments Manager Component with Modern Table
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
  
  // Bulk delete states
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

  // Handle assignment selection for bulk delete
  const handleAssignmentSelect = (assignmentId, selected) => {
    setSelectedAssignments(prev => { 
      const newSet = new Set(prev); 
      selected ? newSet.add(assignmentId) : newSet.delete(assignmentId); 
      return newSet; 
    });
  };

  // Bulk delete function
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

  // Helper function to get authentication headers for PROTECTED endpoints
  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('admin_token');
    const deviceToken = localStorage.getItem('device_token');
    
    if (!adminToken || !deviceToken) {
      throw new Error('Authentication required. Please login to perform this action.');
    }
    
    return {
      'Authorization': `Bearer ${adminToken}`,
      'x-device-token': deviceToken
    };
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

  const confirmDelete = async () => {
    if (deleteType === 'single' && !assignmentToDelete) return;
    
    setDeleting(true);
    setBulkDeleting(true);
    
    try {
      // ✅ PROTECTED ENDPOINT - Add authentication for DELETE
      const headers = getAuthHeaders();
      
      if (deleteType === 'single' && assignmentToDelete) {
        // Single delete - PROTECTED
        const response = await fetch(`/api/assignment/${assignmentToDelete.id}`, {
          method: 'DELETE',
          headers: headers, // ✅ AUTHENTICATION HEADERS ADDED
        });
        
        // Handle authentication errors
        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          throw new Error('Session expired. Please login again.');
        }
        
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
        // Bulk delete - PROTECTED
        const deletedIds = [];
        const failedIds = [];
        
        // Delete each selected assignment
        for (const assignmentId of selectedAssignments) {
          try {
            const response = await fetch(`/api/assignment/${assignmentId}`, {
              method: 'DELETE',
              headers: headers, // ✅ AUTHENTICATION HEADERS ADDED
            });
            
            // Handle authentication errors
            if (response.status === 401) {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              throw new Error('Session expired. Please login again.');
            }
            
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
      
      // Handle authentication errors
      if (error.message.includes('Authentication required') || 
          error.message.includes('Session expired')) {
        showNotification('error', 'Authentication Required', 'Please login to continue');
        setTimeout(() => {
          window.location.href = '/pages/adminLogin';
        }, 2000);
      } else {
        showNotification('error', 'Delete Failed', 'Failed to delete assignment');
      }
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
      console.log('📤 Starting assignment submission...');
      
      // ✅ PROTECTED ENDPOINT - Add authentication for CREATE/UPDATE
      const headers = getAuthHeaders();
      
      // IMPORTANT: Calculate total file size BEFORE sending to API
      let totalBytes = 0;
      
      // Calculate size for new assignment files
      if (assignmentFiles && Array.isArray(assignmentFiles)) {
        assignmentFiles.forEach(file => {
          if (file && file.file && file.file.size && !file.isExisting) {
            totalBytes += file.file.size;
          }
        });
      }
      
      // Calculate size for new attachments
      if (attachments && Array.isArray(attachments)) {
        attachments.forEach(file => {
          if (file && file.file && file.file.size && !file.isExisting) {
            totalBytes += file.file.size;
          }
        });
      }
      
      const totalMB = totalBytes / (1024 * 1024);
      const VERCEL_LIMIT_MB = 4.5;
      
      // Check Vercel total size limit before sending
      if (totalMB > VERCEL_LIMIT_MB) {
        showNotification('error', 'File Size Limit', `Total file size (${totalMB.toFixed(1)}MB) exceeds Vercel's ${VERCEL_LIMIT_MB}MB limit`);
        setSaving(false);
        return;
      }
      
      console.log('File upload details:', {
        assignmentFilesCount: assignmentFiles?.length || 0,
        attachmentsCount: attachments?.length || 0,
        totalSizeMB: totalMB.toFixed(1),
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
      
      // Handle learning objectives
      const learningObjectivesString = JSON.stringify(learningObjectives || []);
      formDataToSend.append('learningObjectives', learningObjectivesString);

      // Handle assignment files for UPDATE
      if (id && assignmentFiles && Array.isArray(assignmentFiles)) {
        // Get existing assignment files (those that weren't removed)
        const existingAssignmentFiles = assignmentFiles
          .filter(file => file && file.isExisting && file.url)
          .map(file => file.url);
        
        if (existingAssignmentFiles.length > 0) {
          formDataToSend.append('existingAssignmentFiles', JSON.stringify(existingAssignmentFiles));
        }
        
        // Add new assignment files (actual file objects)
        assignmentFiles.forEach((file) => {
          if (file && file.file && !file.isExisting) {
            formDataToSend.append('assignmentFiles', file.file);
          }
        });
        
        // Add assignment files to remove
        if (assignmentFilesToRemove && assignmentFilesToRemove.length > 0) {
          formDataToSend.append('assignmentFilesToRemove', JSON.stringify(assignmentFilesToRemove));
        }
      } else if (!id && assignmentFiles && Array.isArray(assignmentFiles)) {
        // For CREATE - add all assignment files
        assignmentFiles.forEach((file) => {
          if (file && file.file) {
            formDataToSend.append('assignmentFiles', file.file);
          }
        });
      }

      // Handle attachments for UPDATE
      if (id && attachments && Array.isArray(attachments)) {
        // Get existing attachments (those that weren't removed)
        const existingAttachments = attachments
          .filter(file => file && file.isExisting && file.url)
          .map(file => file.url);
        
        if (existingAttachments.length > 0) {
          formDataToSend.append('existingAttachments', JSON.stringify(existingAttachments));
        }
        
        // Add new attachments (actual file objects)
        attachments.forEach((file) => {
          if (file && file.file && !file.isExisting) {
            formDataToSend.append('attachments', file.file);
          }
        });
        
        // Add attachments to remove
        if (attachmentsToRemove && attachmentsToRemove.length > 0) {
          formDataToSend.append('attachmentsToRemove', JSON.stringify(attachmentsToRemove));
        }
      } else if (!id && attachments && Array.isArray(attachments)) {
        // For CREATE - add all attachments
        attachments.forEach((file) => {
          if (file && file.file) {
            formDataToSend.append('attachments', file.file);
          }
        });
      }

      let response;
      let url;
      
      if (id) {
        // Update existing assignment
        url = `/api/assignment/${id}`;
        console.log(`PUT request to: ${url}`);
        response = await fetch(url, {
          method: 'PUT',
          headers: headers, // ✅ AUTHENTICATION HEADERS ADDED
          body: formDataToSend,
        });
      } else {
        // Create new assignment
        url = '/api/assignment';
        console.log(`POST request to: ${url}`);
        response = await fetch(url, {
          method: 'POST',
          headers: headers, // ✅ AUTHENTICATION HEADERS ADDED
          body: formDataToSend,
        });
      }

      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        throw new Error('Session expired. Please login again.');
      }

      const result = await response.json();

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
      
      // Handle authentication errors
      if (error.message.includes('Authentication required') || 
          error.message.includes('Session expired')) {
        showNotification('error', 'Authentication Required', 'Please login to continue');
        setTimeout(() => {
          window.location.href = '/pages/adminLogin';
        }, 2000);
      } else {
        showNotification('error', 'Save Failed', error.message || `Failed to ${id ? 'update' : 'create'} assignment`);
      }
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
        <div className="absolute inset-0 opacity-[0.08] sm:opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10" />
        </div>

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

      {/* Bulk Actions Section */}
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

      {/* Modern Assignments Table - Using ResourcesManager Style */}
      {filteredAssignments.length > 0 ? (
        <>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/5 border border-slate-200/50 overflow-hidden relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
            
            {/* Enhanced Table Header */}
            <div className="border-b border-slate-200/50">
              <div className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedAssignments.size === currentItems.length && currentItems.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const newSelection = new Set(selectedAssignments);
                          currentItems.forEach(assignment => newSelection.add(assignment.id));
                          setSelectedAssignments(newSelection);
                        } else {
                          const newSelection = new Set(selectedAssignments);
                          currentItems.forEach(assignment => newSelection.delete(assignment.id));
                          setSelectedAssignments(newSelection);
                        }
                      }}
                      className="w-5 h-5 rounded-xl border-2 border-slate-300 bg-white checked:bg-gradient-to-r checked:from-indigo-500 checked:to-purple-600 checked:border-0 focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-200"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Academic Assignments
                      <span className="ml-2 px-2.5 py-0.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-semibold rounded-full">
                        {filteredAssignments.length} items
                      </span>
                    </h3>
                    <p className="text-sm text-slate-800 mt-1 flex items-center gap-2">
                      <FiClock className="w-3 h-3" />
                      Updated today
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm">
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800 uppercase tracking-[0.2em] w-16">
                      Select
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800 uppercase tracking-[0.2em] min-w-[300px]">
                      <div className="flex items-center gap-2">
                        <HiOutlineSparkles className="w-4 h-4 text-indigo-500" />
                        Assignment
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800 uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <FiBookOpen className="w-4 h-4 text-emerald-500" />
                        Subject & Class
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800 uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-rose-500" />
                        Due Date & Status
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800 uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <FiUserCheck className="w-4 h-4 text-amber-500" />
                        Teacher & Priority
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800 uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <FiPaperclip className="w-4 h-4 text-blue-500" />
                        Resources
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left text-xs font-bold text-slate-800 uppercase tracking-[0.2em]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {currentItems.map((assignment) => {
                    // Calculate days remaining
                    const daysRemaining = assignment.dueDate ? 
                      Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : 
                      null;
                    
                    // Status colors
                    const getStatusColor = (status) => {
                      switch (status?.toLowerCase()) {
                        case 'completed': return 'bg-green-100 text-green-800';
                        case 'in progress': return 'bg-blue-100 text-blue-800';
                        case 'pending': return 'bg-yellow-100 text-yellow-800';
                        case 'overdue': return 'bg-red-100 text-red-800';
                        case 'assigned': return 'bg-indigo-100 text-indigo-800';
                        default: return 'bg-gray-100 text-gray-800';
                      }
                    };
                    
                    // Priority colors
                    const getPriorityColor = (priority) => {
                      switch (priority?.toLowerCase()) {
                        case 'high': return 'bg-red-100 text-red-700';
                        case 'medium': return 'bg-orange-100 text-orange-700';
                        case 'low': return 'bg-blue-100 text-blue-700';
                        default: return 'bg-gray-100 text-gray-700';
                      }
                    };

                    return (
                      <tr 
                        key={assignment.id} 
                        className={`group hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/20 transition-all duration-300  ${
                          selectedAssignments.has(assignment.id) ? 'bg-gradient-to-r from-indigo-50/50 to-purple-50/30' : ''
                        }`}
                      >
                        {/* Checkbox Column */}
                        <td className="py-5 px-8" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedAssignments.has(assignment.id)}
                              onChange={(e) => handleAssignmentSelect(assignment.id, e.target.checked)}
                              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors"
                            />
                          </div>
                        </td>

                        {/* Assignment Details Column */}
                        <td className="py-5 px-8 cursor-pointer" onClick={() => handleView(assignment)}>
                          <div className="flex items-start gap-4">
                            <div className={`relative p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                              assignment.priority === 'high' 
                                ? 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 shadow-sm shadow-red-500/10' 
                                : assignment.priority === 'medium' 
                                ? 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 shadow-sm shadow-orange-500/10'
                                : assignment.priority === 'low' 
                                ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-sm shadow-blue-500/10'
                                : 'bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 shadow-sm shadow-slate-500/10'
                            }`}>
                              <IoDocumentTextOutline className={`text-xl ${
                                assignment.priority === 'high' ? 'text-red-600' :
                                assignment.priority === 'medium' ? 'text-orange-600' :
                                assignment.priority === 'low' ? 'text-blue-600' :
                                'text-gray-600'
                              }`} />
                              {assignment.status === 'overdue' && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center">
                                  <FiAlertTriangle className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                                  {assignment.title || 'Untitled Assignment'}
                                </h4>
                              </div>
                              <p className="text-slate-900 text-xs line-clamp-2 mb-3">
                                {assignment.description || 'No description provided'}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-slate-800">
                                <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
                                  <FiClock className="w-3 h-3" />
                                  {assignment.estimatedTime || 'No time estimate'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Subject & Class Column */}
                        <td className="py-5 px-8">
                          <div className="space-y-3">
                            <div className="inline-flex flex-col gap-1.5">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
                                <FiBookOpen className="w-3 h-3" />
                                {assignment.subject || 'General Studies'}
                              </span>
                              <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-100">
                                <FiUsers className="w-3 h-3" />
                                {assignment.className || 'All Classes'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Due Date & Status Column */}
                        <td className="py-5 px-8">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="text-indigo-500" />
                              <span className="text-sm font-medium text-slate-900">
                                {new Date(assignment.dueDate).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${getStatusColor(assignment.status)}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  assignment.status === 'completed' ? 'bg-green-500' :
                                  assignment.status === 'in progress' ? 'bg-blue-500' :
                                  assignment.status === 'pending' ? 'bg-yellow-500' :
                                  assignment.status === 'overdue' ? 'bg-red-500' :
                                  assignment.status === 'assigned' ? 'bg-indigo-500' :
                                  'bg-gray-500'
                                }`}></div>
                                {assignment.status?.charAt(0).toUpperCase() + assignment.status?.slice(1) || 'Pending'}
                              </span>
                              {daysRemaining !== null && (
                                <span className={`text-xs font-medium ${
                                  daysRemaining <= 0 ? 'text-red-500' : 
                                  daysRemaining <= 3 ? 'text-orange-500' : 'text-green-500'
                                }`}>
                                  {daysRemaining <= 0 ? 'Overdue' : `${daysRemaining}d left`}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Teacher & Priority Column */}
                        <td className="py-5 px-8">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 group/author">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-amber-500/25">
                                {assignment.teacher?.split(' ').map(n => n[0]).join('') || 'A'}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 group-hover/author:text-indigo-600 transition-colors">
                                  {assignment.teacher || 'System Admin'}
                                </span>
                                <span className="text-xs text-slate-800 font-medium">
                                  Teacher
                                </span>
                              </div>
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${getPriorityColor(assignment.priority)}`}>
                              <FiTarget className={`w-3 h-3 ${
                                assignment.priority === 'high' ? 'text-red-600' :
                                assignment.priority === 'medium' ? 'text-orange-600' :
                                assignment.priority === 'low' ? 'text-blue-600' :
                                'text-gray-600'
                              }`} />
                              {assignment.priority || 'medium'} priority
                            </div>
                          </div>
                        </td>

                        {/* Files Column */}
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${
                              (assignment.assignmentFiles?.length || 0) + (assignment.attachments?.length || 0) > 0 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'bg-slate-50 text-slate-400'
                            }`}>
                              <FiPaperclip className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900">
                                {(assignment.assignmentFiles?.length || 0) + (assignment.attachments?.length || 0)}
                              </span>
                              <span className="text-xs text-slate-800 font-medium">
                                files
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="py-5 px-8 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <button
                              onClick={() => handleView(assignment)}
                              className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm cursor-pointer"
                            >
                              <FiEye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                            
                            <button
                              onClick={() => handleEdit(assignment)}
                              className="flex items-center gap-1.5 text-slate-600 font-bold text-sm cursor-pointer"
                            >
                              <FiEdit2 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modern Table Footer */}
            <div className="px-8 py-6 border-t border-slate-200/50 bg-gradient-to-r from-white to-slate-50/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600 font-medium">
                  <span className="font-bold text-slate-900">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAssignments.length)}</span> 
                  of <span className="font-bold text-slate-900">{filteredAssignments.length}</span> assignments
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all duration-200 group"
                  >
                    <FiChevronLeft className="w-5 h-5 text-slate-800 group-hover:text-indigo-600" />
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
                          className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                            currentPage === page 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
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
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all duration-200 group"
                  >
                    <FiChevronRight className="w-5 h-5 text-slate-800 group-hover:text-indigo-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Modern Empty State */
        <div className="relative bg-gradient-to-br from-white/90 to-indigo-50/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/5 border border-indigo-100/50 text-center py-16 px-8 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400"></div>
          </div>
          
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/10">
              <IoDocumentTextOutline className="text-4xl text-gradient-to-r from-indigo-500 to-purple-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {searchTerm || selectedStatus !== 'all' || selectedSubject !== 'all' || selectedClass !== 'all' 
                ? 'No assignments match your search' 
                : 'Your assignment library is empty'}
            </h3>
            
            <p className="text-slate-600 text-base mb-8 max-w-md mx-auto">
              {searchTerm || selectedStatus !== 'all' || selectedSubject !== 'all' || selectedClass !== 'all' 
                ? 'Try adjusting your filters or search keywords to find what you need.' 
                : 'Start building your academic tasks by creating your first assignment.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={handleCreate} 
                className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 flex items-center gap-2 mx-auto transition-all duration-300 hover:-translate-y-0.5"
              >
                <FiPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Create Assignment
              </button>
              
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedSubject('all');
                  setSelectedClass('all');
                }}
                className="px-6 py-3.5 rounded-2xl font-semibold border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
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