'use client';
import { useState, React, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiFilter,
  FiDownload,
  FiEye,
  FiX,
  FiClock,
  FiBarChart2,
  FiUsers,
  FiPaperclip,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiSave,
  FiUpload,
  FiBook,
  FiCalendar,
  FiFileText,
  FiLink,
  FiAward,
  FiMessageSquare,
  FiRotateCw,
  FiCheck,FiUser ,FiCheckCircle,FiArrowLeft,FiChevronDown ,
} from 'react-icons/fi';

import { useRef } from 'react'; // Add this import


// Material-UI Components
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, Box, TextField, TextareaAutosize, Chip, Tooltip } from '@mui/material';

export default function AssignmentsManager() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAssignment, setViewAssignment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    className: '',
    teacher: '',
    dueDate: '',
    dateAssigned: '',
    status: 'assigned',
    description: '',
    instructions: '',
    assignmentFiles: [],
    attachments: [],
    priority: 'medium',
    estimatedTime: '',
    additionalWork: '',
    teacherRemarks: '',
    feedback: '',
    learningObjectives: ['']
  });
  const [newAssignmentFiles, setNewAssignmentFiles] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);

  // API Integration
  const fetchAssignments = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const queryParams = new URLSearchParams({
        search: searchTerm,
        class: selectedClass !== 'all' ? selectedClass : '',
        subject: selectedSubject !== 'all' ? selectedSubject : '',
        status: selectedStatus !== 'all' ? selectedStatus : '',
        page: currentPage,
        limit: itemsPerPage
      }).toString();

      const response = await fetch(`/api/assignment?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setAssignments(data.assignments || []);
        setFilteredAssignments(data.assignments || []);
        if (showRefresh) {
          toast.success('Assignments refreshed successfully!', {
            icon: '🔄'
          });
        }
      } else {
        throw new Error(data.error || 'Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error(error.message || 'Failed to fetch assignments', {
        icon: '❌'
      });
      setAssignments([]);
      setFilteredAssignments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAssignment = async (id) => {
    try {
      const response = await fetch(`/api/assignment/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return data.assignment;
      } else {
        throw new Error(data.error || 'Failed to fetch assignment');
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
      toast.error(error.message || 'Failed to fetch assignment', {
        icon: '❌'
      });
      return null;
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [currentPage, searchTerm, selectedClass, selectedSubject, selectedStatus]);

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };
  



  // Then inside component:
const assignmentFileInputRef = useRef(null);
const attachmentInputRef = useRef(null);


// File Upload Handlers - UPDATED TO APPEND FILES
const handleAssignmentFilesChange = (e) => {
  const files = Array.from(e.target.files);
  // Append new files to existing ones instead of replacing
  setNewAssignmentFiles(prev => [...prev, ...files]);
  toast.info(`${files.length} assignment file(s) added`, {
    icon: '📁'
  });
  // Reset input to allow selecting same files again
  if (assignmentFileInputRef.current) {
    assignmentFileInputRef.current.value = '';
  }
};

const handleAttachmentsChange = (e) => {
  const files = Array.from(e.target.files);
  // Append new files to existing ones instead of replacing
  setNewAttachments(prev => [...prev, ...files]);
  toast.info(`${files.length} attachment(s) added`, {
    icon: '📎'
  });
  // Reset input to allow selecting same files again
  if (attachmentInputRef.current) {
    attachmentInputRef.current.value = '';
  }
};


  const removeAssignmentFile = (index) => {
    setNewAssignmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeAttachment = (index) => {
    setNewAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // CRUD Operations
  const handleCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      title: '',
      subject: '',
      className: '',
      teacher: '',
      dueDate: '',
      dateAssigned: today,
      status: 'assigned',
      description: '',
      instructions: '',
      assignmentFiles: [],
      attachments: [],
      priority: 'medium',
      estimatedTime: '',
      additionalWork: '',
      teacherRemarks: '',
      feedback: '',
      learningObjectives: ['']
    });
    setNewAssignmentFiles([]);
    setNewAttachments([]);
    setEditingAssignment(null);
    setShowModal(true);
  };

  const handleEdit = async (assignment) => {
    try {
      const fullAssignment = await fetchAssignment(assignment.id);
      if (fullAssignment) {
        setFormData({
          title: fullAssignment.title,
          subject: fullAssignment.subject,
          className: fullAssignment.className,
          teacher: fullAssignment.teacher,
          dueDate: fullAssignment.dueDate.split('T')[0],
          dateAssigned: fullAssignment.dateAssigned.split('T')[0],
          status: fullAssignment.status,
          description: fullAssignment.description,
          instructions: fullAssignment.instructions,
          assignmentFiles: fullAssignment.assignmentFiles || [],
          attachments: fullAssignment.attachments || [],
          priority: fullAssignment.priority,
          estimatedTime: fullAssignment.estimatedTime,
          additionalWork: fullAssignment.additionalWork || '',
          teacherRemarks: fullAssignment.teacherRemarks || '',
          feedback: fullAssignment.feedback || '',
          learningObjectives: fullAssignment.learningObjectives || ['']
        });
        setNewAssignmentFiles([]);
        setNewAttachments([]);
        setEditingAssignment(fullAssignment);
        setShowModal(true);
      }
    } catch (error) {
      toast.error('Failed to load assignment details', {
        icon: '❌'
      });
    }
  };

  const handleView = async (assignment) => {
    try {
      const fullAssignment = await fetchAssignment(assignment.id);
      if (fullAssignment) {
        setViewAssignment(fullAssignment);
        setShowViewModal(true);
      }
    } catch (error) {
      toast.error('Failed to load assignment details', {
        icon: '❌'
      });
    }
  };

  const handleDelete = (assignment) => {
    setAssignmentToDelete(assignment);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!assignmentToDelete) return;
    
    try {
      const response = await fetch(`/api/assignment/${assignmentToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchAssignments();
        toast.success('Assignment deleted successfully!', {
          icon: '🗑️'
        });
      } else {
        throw new Error(data.error || 'Failed to delete assignment');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error(error.message || 'Failed to delete assignment', {
        icon: '❌'
      });
    } finally {
      setShowDeleteConfirm(false);
      setAssignmentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setAssignmentToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUploading(true);

    try {
      const submitData = new FormData();
      
      // Add all required text fields
      submitData.append('title', formData.title.trim());
      submitData.append('subject', formData.subject);
      submitData.append('className', formData.className);
      submitData.append('teacher', formData.teacher);
      submitData.append('dueDate', formData.dueDate);
      submitData.append('dateAssigned', formData.dateAssigned);
      submitData.append('status', formData.status);
      submitData.append('description', formData.description.trim());
      submitData.append('instructions', formData.instructions.trim());
      submitData.append('priority', formData.priority);
      submitData.append('estimatedTime', formData.estimatedTime);
      submitData.append('additionalWork', formData.additionalWork);
      submitData.append('teacherRemarks', formData.teacherRemarks);
      submitData.append('feedback', formData.feedback);
      submitData.append('learningObjectives', JSON.stringify(formData.learningObjectives.filter(obj => obj.trim() !== '')));

      // Add files
      newAssignmentFiles.forEach(file => {
        submitData.append('assignmentFiles', file);
      });
      
      newAttachments.forEach(file => {
        submitData.append('attachments', file);
      });

      let response;
      if (editingAssignment) {
        response = await fetch(`/api/assignment/${editingAssignment.id}`, {
          method: 'PUT',
          body: submitData,
        });
      } else {
        response = await fetch('/api/assignment', {
          method: 'POST',
          body: submitData,
        });
      }

      const data = await response.json();

      if (data.success) {
        await fetchAssignments();
        setShowModal(false);
        setNewAssignmentFiles([]);
        setNewAttachments([]);
        toast.success(
          `Assignment ${editingAssignment ? 'updated' : 'created'} successfully!`,
          {
            icon: '✅'
          }
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error(
        error.message || `Failed to ${editingAssignment ? 'update' : 'create'} assignment`,
        {
          icon: '❌'
        }
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const addLearningObjective = () => {
    setFormData({
      ...formData,
      learningObjectives: [...formData.learningObjectives, '']
    });
  };

  const updateLearningObjective = (index, value) => {
    const updatedObjectives = [...formData.learningObjectives];
    updatedObjectives[index] = value;
    setFormData({
      ...formData,
      learningObjectives: updatedObjectives
    });
  };

  const removeLearningObjective = (index) => {
    const updatedObjectives = formData.learningObjectives.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      learningObjectives: updatedObjectives
    });
  };


  // Clear all files functions
const clearAllAssignmentFiles = () => {
  setNewAssignmentFiles([]);
  toast.info('All assignment files cleared', {
    icon: '🗑️'
  });
};

const clearAllAttachments = () => {
  setNewAttachments([]);
  toast.info('All attachments cleared', {
    icon: '🗑️'
  });
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'blue';
      case 'in-progress': return 'yellow';
      case 'completed': return 'green';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const classes = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const subjects = ['Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Science'];

  const Pagination = () => {
    const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <p className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAssignments.length)} of {filteredAssignments.length} assignments
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
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
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-semibold ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {page}
                </button>
              </div>
            ))
          }

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    );
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4">
        <div className="text-center">
          <CircularProgress size={60} sx={{ color: 'blue' }} />
          <p className="text-gray-600 text-lg mt-4 font-medium">Loading Assignments...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-4 lg:p-6 space-y-6">
      {/* Toast container removed - sonner renders its own portal */}
{/* Modern Academic Assignments Header with Full Gradient Background */}
<div className="relative mb-6 sm:mb-8 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-6 lg:p-8 shadow-xl sm:shadow-2xl">
  {/* Background Pattern */}
  <div className="absolute inset-0 opacity-[0.08] sm:opacity-10 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5" />
  </div>
  
  {/* Blue Glow Effects */}
  <div className="absolute -right-16 sm:-right-24 -top-16 sm:-top-24 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-blue-400 to-indigo-300 rounded-full opacity-15 sm:opacity-20 blur-xl sm:blur-2xl lg:blur-3xl" />
  <div className="absolute -left-16 sm:-left-24 -bottom-16 sm:-bottom-24 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-indigo-400 to-violet-300 rounded-full opacity-10 sm:opacity-15 blur-xl sm:blur-2xl lg:blur-3xl" />
  
  <div className="relative z-10">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
      {/* Left Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Icon Container */}
          <div className="relative self-start shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-60 sm:opacity-70" />
            <div className="relative p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl">
              <FiBook className="text-white text-lg sm:text-xl md:text-2xl w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-3">
              <FiAward className="text-white/90 w-4 h-4" />
              <span className="text-white/90 text-xs font-bold uppercase tracking-wider">Academic Management</span>
            </div>
   <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">
  Academic
  <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
    Assignments Manager
  </span>
</h1>

            
            <p className="text-white/80 text-sm sm:text-base font-medium max-w-2xl">
              {loading ? 'Loading academic assignments...' : `Managing ${assignments.length} assignments across ${new Set(assignments.map(a => a.className)).size} classes`}
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Content - Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <button
          onClick={() => fetchAssignments(true)}
          disabled={refreshing}
          className="group relative overflow-hidden px-4 sm:px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl text-white font-semibold hover:bg-white/15 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <div className="relative flex items-center justify-center gap-2">
            <FiRotateCw className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm whitespace-nowrap">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </div>
        </button>
        
        <button
          onClick={handleCreate}
          className="group relative overflow-hidden px-5 sm:px-6 py-3 bg-gradient-to-r from-white to-blue-100 text-blue-900 rounded-xl sm:rounded-2xl font-semibold hover:shadow-lg sm:hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center gap-3">
            <FiPlus className="text-xl" />
            <span className="text-sm font-semibold whitespace-nowrap">
              Create Assignment
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
{/* Stats Overview */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  {[
    { 
      label: 'Total Assignments', 
      value: assignments.length, 
      color: 'blue', 
      icon: FiBarChart2,
      trend: assignments.length > 10 ? '+12%' : null 
    },
    { 
      label: 'Completed', 
      value: assignments.filter(a => a.status === 'completed').length, 
      color: 'green', 
      icon: FiUsers,
      trend: assignments.filter(a => a.status === 'completed').length > 5 ? '+24%' : null
    },
    { 
      label: 'In Progress', 
      value: assignments.filter(a => a.status === 'in-progress').length, 
      color: 'orange', 
      icon: FiClock 
    },
    { 
      label: 'Overdue', 
      value: assignments.filter(a => a.status === 'overdue').length, 
      color: 'red', 
      icon: FiAlertCircle,
      trend: assignments.filter(a => a.status === 'overdue').length > 0 ? '−8%' : null
    }
  ].map((stat, index) => {
    const Icon = stat.icon;
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        gradient: 'from-blue-500 to-blue-600',
        light: 'bg-blue-100/20',
        text: 'text-blue-100',
        icon: 'text-blue-200',
        border: 'border-blue-400/20'
      },
      green: {
        bg: 'bg-green-500',
        gradient: 'from-green-500 to-green-600',
        light: 'bg-green-100/20',
        text: 'text-green-100',
        icon: 'text-green-200',
        border: 'border-green-400/20'
      },
      orange: {
        bg: 'bg-orange-500',
        gradient: 'from-orange-500 to-orange-600',
        light: 'bg-orange-100/20',
        text: 'text-orange-100',
        icon: 'text-orange-200',
        border: 'border-orange-400/20'
      },
      red: {
        bg: 'bg-red-500',
        gradient: 'from-red-500 to-red-600',
        light: 'bg-red-100/20',
        text: 'text-red-100',
        icon: 'text-red-200',
        border: 'border-red-400/20'
      }
    }[stat.color];

    return (
      <div 
        key={index} 
        className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Glow effect */}
        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${colors.bg} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
        
        <div className={`relative bg-gradient-to-br ${colors.gradient} rounded-2xl p-4 lg:p-6 text-white border ${colors.border} shadow-lg shadow-slate-500/10 dark:shadow-slate-900/30 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-slate-500/20 dark:group-hover:shadow-slate-900/50`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 lg:p-3 rounded-xl ${colors.light} backdrop-blur-sm border ${colors.border}`}>
                <Icon className="text-lg lg:text-xl" />
              </div>
              
              {/* Trend indicator */}
              {stat.trend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${colors.light} backdrop-blur-sm`}>
                  {stat.trend.startsWith('−') ? (
                    <span className="text-xs font-bold">↓</span>
                  ) : stat.trend.startsWith('+') ? (
                    <span className="text-xs font-bold">↑</span>
                  ) : null}
                  <span className="text-xs font-bold">{stat.trend}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className={`${colors.text} text-xs lg:text-sm font-semibold opacity-90`}>
                {stat.label}
              </p>
              <p className="text-2xl lg:text-4xl font-black tracking-tight">
                {stat.value}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    );
  })}
</div>

    {/* Modern Filters Section */}
<div className="relative group">
  {/* Background effects */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  
  <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-slate-100/50 dark:shadow-slate-900/30 border border-white/50 dark:border-slate-800/50 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Filter Assignments</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Refine your view by class, subject, or status
        </p>
      </div>
      
      {/* Active filters count & Clear button */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Active filters:
          </span>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
            {[searchTerm, selectedClass, selectedSubject, selectedStatus].filter(v => v !== 'all' && v !== '').length}
          </span>
        </div>
        
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedClass('all');
            setSelectedSubject('all');
            setSelectedStatus('all');
          }}
          disabled={[searchTerm, selectedClass, selectedSubject, selectedStatus].every(v => v === 'all' || v === '')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group/clear"
        >
          <svg className="w-4 h-4 group-hover/clear:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Search Input */}
      <div className="md:col-span-2 lg:col-span-2 relative group/search">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg transition-colors group-focus-within/search:text-blue-500" />
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Class Filter */}
      <div className="relative group/select">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within/select:opacity-100 transition-opacity duration-300" />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="relative w-full px-4 py-3.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 appearance-none cursor-pointer transition-all duration-300"
        >
          <option value="all">All Classes</option>
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Subject Filter */}
      <div className="relative group/select">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-focus-within/select:opacity-100 transition-opacity duration-300" />
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="relative w-full px-4 py-3.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 appearance-none cursor-pointer transition-all duration-300"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Status Filter */}
      <div className="relative group/select">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl opacity-0 group-focus-within/select:opacity-100 transition-opacity duration-300" />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="relative w-full px-4 py-3.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 appearance-none cursor-pointer transition-all duration-300"
        >
          <option value="all">All Status</option>
          <option value="assigned" className="text-slate-700 dark:text-slate-300">Assigned</option>
          <option value="in-progress" className="text-orange-600 dark:text-orange-400">In Progress</option>
          <option value="completed" className="text-green-600 dark:text-green-400">Completed</option>
          <option value="overdue" className="text-red-600 dark:text-red-400">Overdue</option>
        </select>
        <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>

    {/* Active Filters Display */}
    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
      {searchTerm && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Search:</span>
          <span className="text-xs font-bold text-blue-900 dark:text-blue-100">{searchTerm}</span>
          <button
            onClick={() => setSearchTerm('')}
            className="ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {selectedClass !== 'all' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Class:</span>
          <span className="text-xs font-bold text-purple-900 dark:text-purple-100">{selectedClass}</span>
          <button
            onClick={() => setSelectedClass('all')}
            className="ml-1 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {selectedSubject !== 'all' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800">
          <span className="text-xs font-medium text-pink-700 dark:text-pink-300">Subject:</span>
          <span className="text-xs font-bold text-pink-900 dark:text-pink-100">{selectedSubject}</span>
          <button
            onClick={() => setSelectedSubject('all')}
            className="ml-1 text-pink-500 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {selectedStatus !== 'all' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800">
          <span className="text-xs font-medium text-rose-700 dark:text-rose-300">Status:</span>
          <span className="text-xs font-bold text-rose-900 dark:text-rose-100 capitalize">{selectedStatus}</span>
          <button
            onClick={() => setSelectedStatus('all')}
            className="ml-1 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  </div>
</div>

         {/* Modern Assignments Grid */}
      <div className="space-y-4 lg:space-y-6">
        {filteredAssignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((assignment) => (
          <div
            key={assignment.id}
            className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden cursor-pointer"
            onClick={() => handleView(assignment)}
          >
            <div className="flex flex-col lg:flex-row items-stretch">
              
              {/* Left Decorator/Priority */}
              <div className={`w-2 lg:w-3 ${assignment.priority === 'high' ? 'bg-red-500' : assignment.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />

              {/* Content Area */}
              <div className="flex-1 p-5 md:p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                
                {/* Main Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {assignment.subject}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <FiClock size={12} /> {assignment.className}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-${getStatusColor(assignment.status)}-100 text-${getStatusColor(assignment.status)}-800`}>
                      {assignment.status.replace('-', ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1">
                    {assignment.description}
                  </p>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap items-center gap-4 md:gap-8 lg:px-8 lg:border-x lg:border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Due Date</span>
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                      <FiCalendar size={14} className="text-slate-400" />
                      {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Teacher</span>
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                      <FiUser size={14} className="text-slate-400" />
                      {assignment.teacher.split('for')[0]}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Files</span>
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                      <FiPaperclip size={14} className="text-slate-400" />
                      {(assignment.assignmentFiles?.length || 0) + (assignment.attachments?.length || 0)} Total
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center gap-3 min-w-max">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(assignment);
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200"
                  >
                    <FiEdit size={16} />
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(assignment);
                    }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

   {/* Modern Assignment View Modal with Loading */}
   {showViewModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
    {/* Loading State */}
    {!viewAssignment ? (
      <div className="bg-white rounded-[2rem] p-12 text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <FiBook className="text-3xl text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Loading Assignment...</h3>
        <div className="flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    ) : (
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-5xl bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-widest">
              <FiCheck size={16} />
              Assignment Details
            </div>
            <h2 className="text-2xl font-black text-slate-900">{viewAssignment.title}</h2>
          </div>
          <button 
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
          
          {/* Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Subject', val: viewAssignment.subject, icon: <FiBook />, color: 'blue' },
              { label: 'Class', val: viewAssignment.className, icon: <FiClock />, color: 'purple' },
              { label: 'Priority', val: viewAssignment.priority, icon: <FiAlertCircle />, color: 'red' },
              { label: 'Duration', val: viewAssignment.estimatedTime, icon: <FiAward />, color: 'amber' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className={`text-${item.color}-500 mb-2`}>{React.cloneElement(item.icon, { size: 18 })}</div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{item.label}</p>
                <p className="font-bold text-slate-800 truncate capitalize">{item.val}</p>
              </div>
            ))}
          </div>

          {/* Teacher & Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="text-blue-500" size={16} />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Teacher</p>
              </div>
              <p className="font-bold text-slate-900">{viewAssignment.teacher}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="text-emerald-500" size={16} />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Due Date</p>
              </div>
              <p className="font-bold text-slate-900">{formatDate(viewAssignment.dueDate)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="text-purple-500" size={16} />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned</p>
              </div>
              <p className="font-bold text-slate-900">{formatDate(viewAssignment.dateAssigned)}</p>
            </div>
          </div>

          {/* Description & Instructions */}
          <div className="grid md:grid-cols-2 gap-8">
            <section className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FiFileText size={18} className="text-blue-500" /> Description
              </h4>
              <div className="text-slate-600 text-sm leading-relaxed p-5 bg-slate-50 rounded-2xl border border-slate-100">
                {viewAssignment.description}
              </div>
            </section>
            <section className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FiAlertCircle size={18} className="text-amber-500" /> Instructions
              </h4>
              <div className="text-slate-600 text-sm leading-relaxed p-5 bg-amber-50/30 rounded-2xl border border-amber-100/50">
                {viewAssignment.instructions}
              </div>
            </section>
          </div>

          {/* Learning Objectives */}
          {viewAssignment.learningObjectives && viewAssignment.learningObjectives.length > 0 && (
            <section className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FiAward size={18} className="text-purple-500" /> 
                Learning Objectives
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {viewAssignment.learningObjectives.map((objective, i) => (
                  <div key={i} className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="text-sm font-bold text-slate-900">Objective {i + 1}</p>
                    </div>
                    <p className="text-sm text-slate-700">{objective}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Work */}
          {viewAssignment.additionalWork && (
            <section className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FiPlus size={18} className="text-emerald-500" /> 
                Additional Work
              </h4>
              <div className="text-slate-600 text-sm leading-relaxed p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                {viewAssignment.additionalWork}
              </div>
            </section>
          )}

          {/* File Grid */}
          {(viewAssignment.assignmentFiles?.length > 0 || viewAssignment.attachments?.length > 0) && (
            <div className="space-y-6">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FiPaperclip size={18} className="text-slate-400" /> 
                Attached Documents & Assets
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {[...(viewAssignment.assignmentFiles || []), ...(viewAssignment.attachments || [])].map((file, i) => (
                  <a 
                    key={i} 
                    href={file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500">
                        <FiFileText size={16} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {file.split('/').pop()}
                      </span>
                    </div>
                    <FiDownload size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Remarks Banner */}
          {viewAssignment.teacherRemarks && (
            <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FiMessageSquare size={120} />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-blue-400">
                  <FiMessageSquare size={20} />
                  Teacher's Remarks
                </h3>
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  "{viewAssignment.teacherRemarks}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button 
            onClick={() => setShowViewModal(false)}
            className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleEdit(viewAssignment)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              <FiEdit size={16} />
              Edit Assignment
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-100 flex items-center gap-2">
              <FiDownload size={16} />
              Download All Files
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

      {/* Empty State */}
      {filteredAssignments.length === 0 && !loading && (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiBook className="text-4xl text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No assignments found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm || selectedClass !== 'all' || selectedSubject !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search terms or filters to find what you\'re looking for.' 
              : 'Get started by creating your first assignment for your students.'
            }
          </p>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 mx-auto"
          >
            <FiPlus className="text-xl" />
            Create Your First Assignment
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredAssignments.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <Pagination />
        </div>
      )}

   {showModal && (
  <Modal open={true} onClose={() => setShowModal(false)}>
    <Box sx={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '1000px',
      maxHeight: '95vh', 
      bgcolor: 'background.paper',
      borderRadius: 3, 
      boxShadow: 24, 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {/* Fixed Header */}
      <div className="p-6 lg:p-8 border-b border-gray-200/60 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <FiBook className="text-white text-xl" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
              {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
            </h2>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 text-gray-600"
          >
            <FiX className="text-xl" />
          </button>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
          {/* File Upload Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assignment Files */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Assignment Files
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                <input
                  type="file"
                  multiple
                  onChange={handleAssignmentFilesChange}
                  className="hidden"
                  ref={assignmentFileInputRef} // Add this ref

                  id="assignmentFiles"
                />
                <label htmlFor="assignmentFiles" className="cursor-pointer block text-center">
                  <FiUpload className="text-2xl text-blue-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700">
                    Upload Assignment Files
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, PPT up to 10MB each
                  </p>
                </label>
              </div>
  {newAssignmentFiles.length > 0 && (
  <div className="mt-3">
    <div className="space-y-2">
      {newAssignmentFiles.map((file, index) => (
        <div key={index} className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <FiFileText className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={() => removeAssignmentFile(index)}
            className="text-red-500"
          >
            <FiX className="text-lg" />
          </button>
        </div>
      ))}
    </div>
    <button
      type="button"
      onClick={clearAllAssignmentFiles}
      className="mt-2 text-sm text-red-600 font-medium hover:text-red-700"
    >
      Clear All Assignment Files
    </button>
  </div>
)}
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Additional Attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                <input
                  type="file"
                  multiple
                  onChange={handleAttachmentsChange}
                  className="hidden"
                  id="attachments"
                  ref={attachmentInputRef} // Add this ref

                />
                <label htmlFor="attachments" className="cursor-pointer block text-center">
                  <FiLink className="text-2xl text-green-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700">
                    Upload Attachments
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Images, ZIP, etc. up to 10MB each
                  </p>
                </label>
              </div>
              {newAttachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {newAttachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <FiPaperclip className="text-green-500" />
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                placeholder="Enter assignment title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject *
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Class *
              </label>
              <select
                required
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teacher *
              </label>
          <input
  type="text"
  required
  value={formData.teacher}
  onChange={(e) =>
    setFormData({ ...formData, teacher: e.target.value })
  }
  placeholder="Enter teacher name"
  className="
    w-full
    px-4 py-3.5
    border border-gray-300
    rounded-xl
    bg-white/50
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-transparent
  "
/>

            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date Assigned *
              </label>
              <input
                type="date"
                required
                value={formData.dateAssigned}
                onChange={(e) => setFormData({ ...formData, dateAssigned: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Time
              </label>
              <input
                type="text"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                placeholder="e.g., 2 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              >
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Description and Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 resize-none"
              placeholder="Enter detailed assignment description..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows="4"
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 resize-none"
              placeholder="Enter specific instructions for students..."
            />
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Work
              </label>
              <textarea
                value={formData.additionalWork}
                onChange={(e) => setFormData({ ...formData, additionalWork: e.target.value })}
                rows="3"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 resize-none"
                placeholder="Optional additional work or readings..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teacher Remarks
              </label>
              <textarea
                value={formData.teacherRemarks}
                onChange={(e) => setFormData({ ...formData, teacherRemarks: e.target.value })}
                rows="3"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 resize-none"
                placeholder="Any special remarks or notes..."
              />
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Learning Objectives
              </label>
              <button
                type="button"
                onClick={addLearningObjective}
                className="text-blue-600 text-sm font-semibold flex items-center gap-1"
              >
                <FiPlus className="text-sm" />
                Add Objective
              </button>
            </div>
            <div className="space-y-3">
              {formData.learningObjectives.map((objective, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => updateLearningObjective(index, e.target.value)}
                    className="flex-1 px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                    placeholder={`Learning objective ${index + 1}`}
                  />
                  {formData.learningObjectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLearningObjective(index)}
                      className="px-4 py-3.5 text-red-600 rounded-xl"
                    >
                      <FiX className="text-lg" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Submit Buttons at Bottom */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200/60 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <FiX className="text-lg" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(saving || uploading) ? (
                <>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  {editingAssignment ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {editingAssignment ? <FiEdit className="text-lg" /> : <FiPlus className="text-lg" />}
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Box>
  </Modal>
)}

   {/* Modern Assignment View Modal */}
{showViewModal && viewAssignment && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
    {/* Modal Container */}
    <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
      
      {/* Close Button - Floating & Premium */}
      <button 
        onClick={() => setShowViewModal(false)}
        className="absolute top-5 right-5 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90"
      >
        <FiX size={24} />
      </button>

      {/* 1. Header with Gradient */}
      <div className="relative h-[20vh] sm:h-[180px] w-full shrink-0 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20" />
        <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <FiBook className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                Assignment Details
              </h2>
              <p className="text-white/70 text-sm mt-1">
                Complete assignment information and requirements
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Title Section */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Assignment Title</h3>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
              {viewAssignment.title}
            </h2>
            
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiBook className="text-blue-600" />
                  <p className="text-[10px] uppercase font-bold text-slate-400">Subject</p>
                </div>
                <p className="font-bold text-slate-900">{viewAssignment.subject}</p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiUsers className="text-purple-600" />
                  <p className="text-[10px] uppercase font-bold text-slate-400">Class</p>
                </div>
                <p className="font-bold text-slate-900">{viewAssignment.className}</p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiUser className="text-amber-600" />
                  <p className="text-[10px] uppercase font-bold text-slate-400">Teacher</p>
                </div>
                <p className="font-bold text-slate-900">{viewAssignment.teacher}</p>
              </div>
            </div>
          </section>

          {/* Dates & Priority Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Timeline & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiCalendar className="text-blue-600" />
                  <p className="text-[10px] uppercase font-bold text-blue-400">Due Date</p>
                </div>
                <p className="font-bold text-slate-900">{formatDate(viewAssignment.dueDate)}</p>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiCalendar className="text-emerald-600" />
                  <p className="text-[10px] uppercase font-bold text-emerald-400">Assigned</p>
                </div>
                <p className="font-bold text-slate-900">{formatDate(viewAssignment.dateAssigned)}</p>
              </div>
              
              <div className="p-4 bg-rose-50 rounded-3xl border border-rose-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlertCircle className="text-rose-600" />
                  <p className="text-[10px] uppercase font-bold text-rose-400">Priority</p>
                </div>
                <p className="font-bold text-slate-900 capitalize">{viewAssignment.priority}</p>
              </div>
            </div>
            
            {/* Status & Time Estimate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheckCircle className="text-slate-600" />
                  <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                </div>
                <p className="font-bold text-slate-900 capitalize">{viewAssignment.status}</p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <FiClock className="text-slate-600" />
                  <p className="text-[10px] uppercase font-bold text-slate-400">Estimated Time</p>
                </div>
                <p className="font-bold text-slate-900">{viewAssignment.estimatedTime}</p>
              </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Description</h3>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {viewAssignment.description}
              </p>
            </div>
          </section>

          {/* Instructions Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Instructions</h3>
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {viewAssignment.instructions}
              </p>
            </div>
          </section>

          {/* Additional Work - Conditional */}
          {viewAssignment.additionalWork && (
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Additional Work</h3>
              <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {viewAssignment.additionalWork}
                </p>
              </div>
            </section>
          )}

          {/* Teacher Remarks - Conditional */}
          {viewAssignment.teacherRemarks && (
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Teacher Remarks</h3>
              <div className="p-6 bg-purple-50/50 rounded-3xl border border-purple-100">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {viewAssignment.teacherRemarks}
                </p>
              </div>
            </section>
          )}

          {/* Learning Objectives - Conditional */}
          {viewAssignment.learningObjectives && viewAssignment.learningObjectives.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Learning Objectives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {viewAssignment.learningObjectives.map((objective, index) => (
                  <div key={index} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="font-bold text-slate-900">Objective {index + 1}</p>
                    </div>
                    <p className="text-slate-700 text-sm">{objective}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Attachments Section - Conditional */}
          {(viewAssignment.assignmentFiles?.length > 0 || viewAssignment.attachments?.length > 0) && (
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewAssignment.assignmentFiles?.map((file, index) => (
                  <a
                    key={index}
                    href={file}
                    className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl border border-blue-200 hover:border-blue-300 transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="p-3 bg-white rounded-2xl">
                      <FiFileText className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-blue-800 truncate">
                        {file.split('/').pop()}
                      </p>
                      <p className="text-xs text-blue-600">Assignment File</p>
                    </div>
                    <FiChevronRight className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                  </a>
                ))}
                
                {viewAssignment.attachments?.map((file, index) => (
                  <a
                    key={index}
                    href={file}
                    className="group flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-3xl border border-emerald-200 hover:border-emerald-300 transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="p-3 bg-white rounded-2xl">
                      <FiPaperclip className="text-emerald-600 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-emerald-800 truncate">
                        {file.split('/').pop()}
                      </p>
                      <p className="text-xs text-emerald-600">Supporting Document</p>
                    </div>
                    <FiChevronRight className="text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* 3. Action Footer */}
      <div className="shrink-0 p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-100">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={() => setShowViewModal(false)}
            className="flex-[2] h-14 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <FiArrowLeft size={20} />
            Back to Assignments
          </button>
        
        </div>
      </div>
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                  <FiAlertCircle className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Confirm Deletion</h2>
                  <p className="text-red-100 opacity-90 mt-1 text-sm">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 border border-red-200">
                  <FiTrash2 className="text-red-600 text-lg" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Delete "{assignmentToDelete?.title}"?</h3>
                <p className="text-gray-600 text-sm">This will permanently delete the assignment and all associated data.</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={cancelDelete} 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-sm"
              >
                <FiX /> Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-3 rounded-xl font-bold text-sm"
              >
                <FiTrash2 /> Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}