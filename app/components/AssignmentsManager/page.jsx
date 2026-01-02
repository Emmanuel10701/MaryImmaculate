'use client';
import { useState, useEffect, useCallback } from 'react';
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
  FiCheck
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

      {/* Header with Refresh Button */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <FiBook className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Assignments Manager
                </h1>
                <p className="text-gray-600 mt-1">Create, manage, and track student assignments</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => fetchAssignments(true)}
              disabled={refreshing}
              className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {refreshing ? (
                <CircularProgress size={20} sx={{ color: 'gray' }} />
              ) : (
                <FiRotateCw className="text-lg" />
              )}
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3"
            >
              <FiPlus className="text-xl" />
              Create Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Assignments', value: assignments.length, color: 'blue', icon: FiBarChart2 },
          { label: 'Completed', value: assignments.filter(a => a.status === 'completed').length, color: 'green', icon: FiUsers },
          { label: 'In Progress', value: assignments.filter(a => a.status === 'in-progress').length, color: 'orange', icon: FiClock },
          { label: 'Overdue', value: assignments.filter(a => a.status === 'overdue').length, color: 'red', icon: FiAlertCircle }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl p-4 lg:p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-${stat.color}-100 text-sm`}>{stat.label}</p>
                  <p className="text-xl lg:text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className={`text-xl lg:text-2xl text-${stat.color}-200`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search assignments by title, description, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
          >
            <option value="all">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-4 lg:gap-6">
        {filteredAssignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 cursor-pointer"
            onClick={() => handleView(assignment)}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-${getStatusColor(assignment.status)}-100 text-${getStatusColor(assignment.status)}-800`}>
                    {assignment.status.replace('-', ' ')}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-${getPriorityColor(assignment.priority)}-100 text-${getPriorityColor(assignment.priority)}-800`}>
                    {assignment.priority} priority
                  </span>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {assignment.subject}
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                    {assignment.className}
                  </span>
                </div>
                
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
                  {assignment.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-base lg:text-lg line-clamp-2">
                  {assignment.description}
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Teacher</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiUsers className="text-gray-400" />
                      {assignment.teacher}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Due Date</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      {formatDate(assignment.dueDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Estimated Time</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiClock className="text-gray-400" />
                      {assignment.estimatedTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Attachments</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FiPaperclip className="text-gray-400" />
                      {(assignment.assignmentFiles?.length || 0) + (assignment.attachments?.length || 0)}
                    </p>
                  </div>
                </div>

                {assignment.learningObjectives && assignment.learningObjectives.length > 0 && (
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm mb-2">Learning Objectives:</p>
                    <div className="flex flex-wrap gap-2">
                      {assignment.learningObjectives.slice(0, 3).map((objective, index) => (
                        <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                          {objective}
                        </span>
                      ))}
                      {assignment.learningObjectives.length > 3 && (
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                          +{assignment.learningObjectives.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(assignment);
                  }}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl font-semibold min-w-[120px] justify-center"
                >
                  <FiEdit className="text-lg" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(assignment);
                  }}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold min-w-[120px] justify-center"
                >
                  <FiTrash2 className="text-lg" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

      {/* View Assignment Modal */}
      {showViewModal && viewAssignment && (
        <Modal open={true} onClose={() => setShowViewModal(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '1000px',
            maxHeight: '95vh', bgcolor: 'background.paper',
            borderRadius: 3, boxShadow: 24, overflow: 'hidden',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
          }}>
            <div className="p-6 lg:p-8 border-b border-gray-200/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <FiBook className="text-white text-xl" />
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                    Assignment Details
                  </h2>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 text-gray-600"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6 lg:p-8 space-y-6 max-h-[calc(95vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Title</p>
                  <p className="text-gray-800 text-lg font-semibold">{viewAssignment.title}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Subject</p>
                  <p className="text-gray-800">{viewAssignment.subject}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Class</p>
                  <p className="text-gray-800">{viewAssignment.className}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Teacher</p>
                  <p className="text-gray-800">{viewAssignment.teacher}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Due Date</p>
                  <p className="text-gray-800">{formatDate(viewAssignment.dueDate)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Date Assigned</p>
                  <p className="text-gray-800">{formatDate(viewAssignment.dateAssigned)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Priority</p>
                  <p className="text-gray-800 capitalize">{viewAssignment.priority}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Status</p>
                  <p className="text-gray-800 capitalize">{viewAssignment.status}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Estimated Time</p>
                  <p className="text-gray-800">{viewAssignment.estimatedTime}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1">Description</p>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{viewAssignment.description}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1">Instructions</p>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{viewAssignment.instructions}</p>
              </div>

              {viewAssignment.additionalWork && (
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Additional Work</p>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">{viewAssignment.additionalWork}</p>
                </div>
              )}

              {viewAssignment.teacherRemarks && (
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Teacher Remarks</p>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">{viewAssignment.teacherRemarks}</p>
                </div>
              )}

              {viewAssignment.learningObjectives && viewAssignment.learningObjectives.length > 0 && (
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Learning Objectives</p>
                  <ul className="list-disc list-inside space-y-2">
                    {viewAssignment.learningObjectives.map((objective, index) => (
                      <li key={index} className="text-gray-800">
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(viewAssignment.assignmentFiles?.length > 0 || viewAssignment.attachments?.length > 0) && (
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Attachments</p>
                  <div className="grid grid-cols-1 gap-3">
                    {viewAssignment.assignmentFiles?.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiFileText className="text-blue-500 text-lg" />
                        <span className="text-blue-600 font-medium">{file.split('/').pop()}</span>
                      </a>
                    ))}
                    {viewAssignment.attachments?.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiPaperclip className="text-green-500 text-lg" />
                        <span className="text-green-600 font-medium">{file.split('/').pop()}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Box>
        </Modal>
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