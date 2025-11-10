'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiCalendar
} from 'react-icons/fi';

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
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    teacher: '',
    dueDate: '',
    description: '',
    points: '',
    priority: 'medium',
    estimatedTime: '',
    instructions: '',
    learningObjectives: [''],
    attachments: [],
    status: 'assigned'
  });

  useEffect(() => {
    const sampleAssignments = Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      title: `Assignment ${i + 1} - ${['Algebra', 'Geometry', 'Calculus', 'Biology', 'Chemistry', 'Physics'][i % 6]}`,
      subject: ['Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'][i % 8],
      class: `Form ${(i % 4) + 1}`,
      teacher: `Mr. ${['Njoroge', 'Kamau', 'Mwangi', 'Ochieng', 'Mutiso'][i % 5]}`,
      dueDate: `2024-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      status: ['assigned', 'in-progress', 'completed', 'overdue'][i % 4],
      description: 'Comprehensive assignment covering key concepts with practical applications and problem-solving exercises.',
      attachments: Math.random() > 0.5 ? ['worksheet.pdf'] : [],
      assignmentFiles: ['problems.pdf', 'guidelines.docx'],
      points: [50, 100, 150, 200][i % 4],
      priority: ['high', 'medium', 'low'][i % 3],
      estimatedTime: `${[1, 2, 3][i % 3]} hours`,
      instructions: 'Complete all problems showing step-by-step solutions. Submit your work by the deadline.',
      learningObjectives: [
        'Solve quadratic equations using factorization',
        'Apply the quadratic formula correctly',
        'Solve simultaneous equations algebraically'
      ],
      submissions: Math.floor(Math.random() * 30),
      graded: Math.floor(Math.random() * 20),
      createdAt: `2024-03-${String(Math.floor(Math.random() * 15) + 1).padStart(2, '0')}`
    }));
    setAssignments(sampleAssignments);
    setFilteredAssignments(sampleAssignments);
  }, []);

  // deterministic date formatter (DD/MM/YYYY)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };
  
  // CRUD Operations
  const handleCreate = () => {
    setFormData({
      title: '',
      subject: '',
      class: '',
      teacher: '',
      dueDate: '',
      description: '',
      points: '',
      priority: 'medium',
      estimatedTime: '',
      instructions: '',
      learningObjectives: [''],
      attachments: [],
      status: 'assigned'
    });
    setEditingAssignment(null);
    setShowModal(true);
  };

  const handleEdit = (assignment) => {
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      class: assignment.class,
      teacher: assignment.teacher,
      dueDate: assignment.dueDate,
      description: assignment.description,
      points: assignment.points,
      priority: assignment.priority,
      estimatedTime: assignment.estimatedTime,
      instructions: assignment.instructions,
      learningObjectives: assignment.learningObjectives,
      attachments: assignment.attachments,
      status: assignment.status
    });
    setEditingAssignment(assignment);
    setShowModal(true);
  };

  // show confirmation instead of immediate delete
  const handleDelete = (id) => {
    const toDelete = assignments.find(a => a.id === id);
    setAssignmentToDelete(toDelete || { id });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!assignmentToDelete) return;
    setAssignments(prev => prev.filter(a => a.id !== assignmentToDelete.id));
    setFilteredAssignments(prev => prev.filter(a => a.id !== assignmentToDelete.id));
    setShowDeleteConfirm(false);
    setAssignmentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setAssignmentToDelete(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAssignment) {
      // Update assignment
      setAssignments(assignments.map(assignment => 
        assignment.id === editingAssignment.id 
          ? { ...formData, id: editingAssignment.id, submissions: editingAssignment.submissions, graded: editingAssignment.graded }
          : assignment
      ));
    } else {
      // Create new assignment
      const newAssignment = {
        ...formData,
        id: Date.now(),
        submissions: 0,
        graded: 0,
        assignmentFiles: [],
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAssignments([...assignments, newAssignment]);
    }
    setShowModal(false);
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

  // Filtering and pagination
  useEffect(() => {
    filterAssignments();
    setCurrentPage(1);
  }, [searchTerm, selectedClass, selectedSubject, selectedStatus, assignments]);

  const filterAssignments = () => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.teacher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(assignment => assignment.class === selectedClass);
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === selectedSubject);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === selectedStatus);
    }

    setFilteredAssignments(filtered);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignments = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
  const subjects = ['Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'];
  const teachers = ['Mr. Njoroge', 'Mr. Kamau', 'Mr. Mwangi', 'Mrs. Ochieng', 'Ms. Mutiso', 'Dr. Wanjiku'];

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAssignments.length)} of {filteredAssignments.length} assignments
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
                className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-700 hover:bg-gray-100'
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
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <FiChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Assignments Manager
          </h1>
          <p className="text-gray-600 mt-2">Create, manage, and track student assignments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 lg:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/25 w-full lg:w-auto justify-center"
        >
          <FiPlus className="text-lg" />
          Create Assignment
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Assignments</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">{assignments.length}</p>
            </div>
            <FiBarChart2 className="text-xl lg:text-2xl text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">{assignments.filter(a => a.status === 'completed').length}</p>
            </div>
            <FiUsers className="text-xl lg:text-2xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">In Progress</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">{assignments.filter(a => a.status === 'in-progress').length}</p>
            </div>
            <FiClock className="text-xl lg:text-2xl text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Overdue</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">{assignments.filter(a => a.status === 'overdue').length}</p>
            </div>
            <FiAlertCircle className="text-xl lg:text-2xl text-red-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
        {currentAssignments.map((assignment) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusColor(assignment.status)}-100 text-${getStatusColor(assignment.status)}-800`}>
                    {assignment.status.replace('-', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getPriorityColor(assignment.priority)}-100 text-${getPriorityColor(assignment.priority)}-800`}>
                    {assignment.priority} priority
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {assignment.subject}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                    {assignment.class}
                  </span>
                </div>
                
                <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {assignment.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm lg:text-base">{assignment.description}</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-sm">
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
                      {assignment.dueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Points</p>
                    <p className="font-semibold text-gray-800">{assignment.points}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Submissions</p>
                    <p className="font-semibold text-gray-800">
                      {assignment.submissions}/{assignment.graded} graded
                    </p>
                  </div>
                </div>

                {assignment.attachments.length > 0 && (
                  <div className="flex items-center gap-2 mt-4">
                    <FiPaperclip className="text-gray-400" />
                    <span className="text-sm text-gray-600">{assignment.attachments.length} attachment(s)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 lg:flex-col lg:gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(assignment)}
                  className="p-2 lg:p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors shadow-sm"
                  title="Edit Assignment"
                >
                  <FiEdit className="text-sm lg:text-lg" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(assignment.id)}
                  className="p-2 lg:p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors shadow-sm"
                  title="Delete Assignment"
                >
                  <FiTrash2 className="text-sm lg:text-lg" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleView(assignment)}
                  className="p-2 lg:p-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors shadow-sm"
                  title="View Submissions"
                >
                  <FiEye className="text-sm lg:text-lg" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {filteredAssignments.length > 0 && (
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50">
          <Pagination />
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <select
                      required
                      value={formData.teacher}
                      onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher} value={teacher}>{teacher}</option>
                      ))}
                    </select>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter points"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2 hours"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter assignment description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter specific instructions for students"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Learning Objectives
                    </label>
                    <button
                      type="button"
                      onClick={addLearningObjective}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
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
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Learning objective ${index + 1}`}
                        />
                        {formData.learningObjectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLearningObjective(index)}
                            className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <FiX className="text-lg" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.status === 'assigned'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'assigned' : 'draft' })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Assign Immediately</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Assignment Modal */}
      <AnimatePresence>
        {showViewModal && viewAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeView}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Assignment Details
                  </h2>
                  <button
                    onClick={closeView}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Title</p>
                    <p className="text-gray-800">{viewAssignment.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Subject</p>
                    <p className="text-gray-800">{viewAssignment.subject}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Class</p>
                    <p className="text-gray-800">{viewAssignment.class}</p>
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
                    <p className="text-gray-500 text-sm font-semibold mb-1">Points</p>
                    <p className="text-gray-800">{viewAssignment.points}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Priority</p>
                    <p className="text-gray-800">{viewAssignment.priority}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Status</p>
                    <p className="text-gray-800">{viewAssignment.status}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Description</p>
                  <p className="text-gray-800 leading-relaxed">{viewAssignment.description}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Instructions</p>
                  <p className="text-gray-800 leading-relaxed">{viewAssignment.instructions}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Learning Objectives</p>
                  <ul className="list-disc list-inside space-y-1">
                    {viewAssignment.learningObjectives.map((objective, index) => (
                      <li key={index} className="text-gray-800">
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                {viewAssignment.attachments.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {viewAssignment.attachments.map((file, index) => (
                        <a
                          key={index}
                          href={file}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.split('/').pop()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this assignment? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                >
                  Delete Assignment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}