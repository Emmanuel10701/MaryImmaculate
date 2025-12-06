'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiDownload,
  FiEye,
  FiUser,
  FiBook,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMapPin,
  FiCalendar,
  FiAward,
  FiUsers,
  FiBarChart2,
  FiRefreshCcw, // ✅ Fixed from FiRefreshCw
  FiLoader, // ⚠️ This doesn't exist in Feather Icons - using FiClock as alternative
  FiArrowUpCircle, // ✅ Fixed from FiArrowUp
  FiTrendingUp,
  FiClock,
  FiArrowUpRight
    
} from 'react-icons/fi';


export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState('all');
  const [selectedStream, setSelectedStream] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [promotionClass, setPromotionClass] = useState('');
  const [promotionAction, setPromotionAction] = useState('promote');
  const [submitting, setSubmitting] = useState(false);
  const [promotionHistory, setPromotionHistory] = useState([]);

  const [showGraduatedModal, setShowGraduatedModal] = useState(false);
const [graduatedStudents, setGraduatedStudents] = useState([]);
const [graduationYearFilter, setGraduationYearFilter] = useState('all');
const [graduatedClassFilter, setGraduatedClassFilter] = useState('all');

const [showGraduationModal, setShowGraduationModal] = useState(false);
const [selectedGraduatedStudent, setSelectedGraduatedStudent] = useState(null);
const [showGraduatedDetailsModal, setShowGraduatedDetailsModal] = useState(false);
const [repeatForm, setRepeatForm] = useState('Form 4');

const [showConfirmModal, setShowConfirmModal] = useState(false);
const [studentToDelete, setStudentToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    admissionNumber: '',
    name: '',
    form: 'Form 1',
    stream: 'East',
    gender: 'Male',
    dateOfBirth: '',
    enrollmentDate: '',
    kcpeMarks: '',
    previousSchool: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    emergencyContact: '',
    address: '',
    medicalInfo: '',
    hobbies: '',
    academicPerformance: 'Average',
    attendance: '95%',
    disciplineRecord: 'Good',
    status: 'Active'
  });

  // Forms, Streams data
  const forms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const streams = ['East', 'West', 'North', 'South'];
  const academicLevels = ['Excellent', 'Good', 'Average', 'Below Average'];
  const disciplineRecords = ['Excellent', 'Good', 'Fair', 'Needs Improvement'];
  const statusOptions = ['Active', 'Inactive', 'Graduated', 'Transferred'];
  const attendanceOptions = ['95%', '90%', '85%', '80%', '75%', '70%'];



  const graduationYears = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);


  const fetchGraduatedStudents = async () => {
  try {
    const response = await fetch('/api/student');
    const result = await response.json();
    
    if (result.success) {
      const graduated = result.students.filter(student => 
        student.status === 'Graduated' && student.form === 'Form 4'
      );
      setGraduatedStudents(graduated);
    }
  } catch (error) {
    console.error('Error fetching graduated students:', error);
  }
};

const handleRepeatStudent = async (student) => {
  if (confirm(`Are you sure you want to move ${student.name} back to ${repeatForm}?`)) {
    try {
      const response = await fetch(`/api/student/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: repeatForm,
          stream: student.stream,
          status: 'Active'
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchGraduatedStudents();
        await fetchStudents();
        setShowGraduatedDetailsModal(false);
        toast.success(`${student.name} moved to ${repeatForm} successfully`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    }
  }
};


  // Export graduated students to CSV
const exportGraduatedToCSV = () => {
  const graduatedStudents = students.filter(s => s.status === 'Graduated');
  
  if (graduatedStudents.length === 0) {
    toast.warning('No graduated students to export');
    return;
  }

  const headers = [
    'Admission Number',
    'Name',
    'Final Class',
    'Stream',
    'Gender',
    'Graduation Year',
    'KCPE Marks',
    'Previous School',
    'Parent Name',
    'Parent Email',
    'Parent Phone'
  ];

  const csvData = graduatedStudents.map(student => [
    student.admissionNumber,
    student.name,
    student.form, // This will be their final class
    student.stream,
    student.gender,
    new Date().getFullYear().toString(), // You might want to store actual graduation year
    student.kcpeMarks || '',
    student.previousSchool || '',
    student.parentName,
    student.parentEmail || '',
    student.parentPhone
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `graduated_students_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  toast.success(`Exported ${graduatedStudents.length} graduated students to CSV`);
};

  // Promotion mapping
  const promotionMap = {
    'Form 1': 'Form 2',
    'Form 2': 'Form 3', 
    'Form 3': 'Form 4',
  'Form 4': 'Graduated' // Changed from promoting to graduated
  };

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/student');
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.students);
        setFilteredStudents(result.students);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students. Using sample data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };



  // Load graduated students when modal opens
useEffect(() => {
  if (showGraduatedModal) {
    const graduated = students.filter(s => s.status === 'Graduated')
      .map(student => ({
        ...student,
        graduationYear: new Date().getFullYear().toString(), // You might want to store this in your database
        finalClass: student.form
      }));
    setGraduatedStudents(graduated);
  }
}, [showGraduatedModal, students]);

  // Fetch promotion history
  const fetchPromotionHistory = async (studentId = null) => {
    try {
      const url = studentId 
        ? `/api/student?action=promotion-history&studentId=${studentId}`
        : '/api/student?action=promotion-history';
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setPromotionHistory(result.history);
      }
    } catch (error) {
      console.error('Error fetching promotion history:', error);
    }
  };



  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students
// Filter students - EXCLUDE GRADUATED FROM MAIN VIEW
useEffect(() => {
  let filtered = students.filter(student => student.status !== 'Graduated'); // Exclude graduated

  if (searchTerm) {
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedForm !== 'all') {
    filtered = filtered.filter(student => student.form === selectedForm);
  }

  if (selectedStream !== 'all') {
    filtered = filtered.filter(student => student.stream === selectedStream);
  }

  if (selectedStatus !== 'all') {
    filtered = filtered.filter(student => student.status === selectedStatus);
  }

  setFilteredStudents(filtered);
  setCurrentPage(1);
}, [searchTerm, selectedForm, selectedStream, selectedStatus, students]);
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CRUD Operations
  const handleCreate = () => {
    setFormData({
      admissionNumber: '',
      name: '',
      form: 'Form 1',
      stream: 'East',
      gender: 'Male',
      dateOfBirth: '',
      enrollmentDate: '',
      kcpeMarks: '',
      previousSchool: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      emergencyContact: '',
      address: '',
      medicalInfo: '',
      hobbies: '',
      academicPerformance: 'Average',
      attendance: '95%',
      disciplineRecord: 'Good',
      status: 'Active'
    });
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setFormData({ 
      ...student,
      dateOfBirth: student.dateOfBirth.split('T')[0],
      enrollmentDate: student.enrollmentDate.split('T')[0],
      kcpeMarks: student.kcpeMarks?.toString() || ''
    });
    setEditingStudent(student);
    setShowModal(true);
  };
const handleViewDetails = async (student) => {
  try {
    // Use the existing student data immediately for better UX
    setSelectedStudent(student);
    setShowDetailModal(true);
    
    // Then fetch fresh data from API in background
    const freshStudentData = await fetchStudentDetails(student.id);
    if (freshStudentData) {
      setSelectedStudent(freshStudentData);
    }
  } catch (error) {
    console.error('Error loading student details:', error);
    // Keep using the existing student data if API fails
  }
};

  const handleViewHistory = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      fetchPromotionHistory(student.id);
    } else {
      fetchPromotionHistory();
    }
    setShowHistoryModal(true);
  };

const handleDelete = async (student) => {
  setStudentToDelete(student);
  setShowConfirmModal(true);
};

// Add this new function to actually perform deletion
const confirmDelete = async () => {
  if (!studentToDelete) return;
  
  try {
    setLoading(true);
    const response = await fetch(`/api/student/${studentToDelete.id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      setStudents(students.filter(s => s.id !== studentToDelete.id));
      toast.success('Student deleted successfully');
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    toast.error(error.message || 'Failed to delete student');
  } finally {
    setLoading(false);
    setShowConfirmModal(false);
    setStudentToDelete(null);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setSubmitting(true);

    const method = editingStudent ? 'PUT' : 'POST';
    const url = editingStudent 
      ? `/api/student/${editingStudent.id}`  // Dynamic route for update
      : '/api/student';
      
    // For PUT, don't send the id in the body since it's in the URL
    const payload = editingStudent 
      ? { ...formData }
      : formData;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      if (editingStudent) {
        setStudents(students.map(student => 
          student.id === editingStudent.id 
            ? result.student
            : student
        ));
        toast.success('Student updated successfully');
      } else {
        setStudents([result.student, ...students]);
        toast.success('Student created successfully');
      }
      setShowModal(false);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error saving student:', error);
    toast.error(error.message || 'Failed to save student');
  } finally {
    setSubmitting(false);
  }
};

  // Export to CSV
  const exportToCSV = () => {
    if (filteredStudents.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const headers = [
      'Admission Number',
      'Name',
      'Form',
      'Stream',
      'Gender',
      'Status',
      'Date of Birth',
      'Enrollment Date',
      'KCPE Marks',
      'Previous School',
      'Parent Name',
      'Parent Email',
      'Parent Phone',
      'Emergency Contact',
      'Address',
      'Medical Info',
      'Hobbies',
      'Academic Performance',
      'Attendance',
      'Discipline Record'
    ];

    const csvData = filteredStudents.map(student => [
      student.admissionNumber,
      student.name,
      student.form,
      student.stream,
      student.gender,
      student.status,
      student.dateOfBirth.split('T')[0],
      student.enrollmentDate.split('T')[0],
      student.kcpeMarks || '',
      student.previousSchool || '',
      student.parentName,
      student.parentEmail || '',
      student.parentPhone,
      student.emergencyContact,
      student.address,
      student.medicalInfo || '',
      student.hobbies || '',
      student.academicPerformance,
      student.attendance,
      student.disciplineRecord
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filteredStudents.length} students to CSV`);
  };



// Update the handlePromotion function to handle graduation properly
const handlePromotion = async () => {
  if (!promotionClass) {
    toast.error('Please select a class');
    return;
  }

  // Prevent promoting graduated students
  if (promotionClass === 'Form 4' && promotionAction === 'promote') {
    toast.error('Form 4 students cannot be promoted. Use "Graduate Class" instead.');
    return;
  }

  const actionText = promotionAction === 'promote' 
    ? `promote all ${promotionClass} students to ${promotionMap[promotionClass]}`
    : `graduate all ${promotionClass} students`;

  if (!confirm(`Are you sure you want to ${actionText}? This action cannot be undone.`)) {
    return;
  }

  try {
    setLoading(true);
    const response = await fetch('/api/student', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        form: promotionClass, 
        action: promotionAction 
      }),
    });

    const result = await response.json();

    if (result.success) {
      await fetchStudents();
      setPromotionClass('');
      setPromotionAction('promote');
      setShowPromotionModal(false);
      
      const successMessage = promotionAction === 'promote'
        ? `${result.count} students promoted from ${promotionClass} to ${promotionMap[promotionClass]}`
        : `${result.count} students graduated successfully`;
        
      toast.success(successMessage);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error processing promotion:', error);
    toast.error('Failed to process promotion/graduation');
  } finally {
    setLoading(false);
  }
};

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} students
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
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
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

  const PerformanceBadge = ({ level }) => {
    const colors = {
      'Excellent': 'from-green-500 to-emerald-600',
      'Good': 'from-blue-500 to-cyan-600',
      'Average': 'from-yellow-500 to-orange-600',
      'Below Average': 'from-red-500 to-pink-600'
    };

    return (
      <span className={`bg-gradient-to-r ${colors[level] || 'from-gray-500 to-gray-600'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
        {level}
      </span>
    );
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      'Active': 'from-green-500 to-emerald-600',
      'Inactive': 'from-gray-500 to-gray-600',
      'Graduated': 'from-blue-500 to-cyan-600',
      'Transferred': 'from-orange-500 to-red-600'
    };

    return (
      <span className={`bg-gradient-to-r ${colors[status] || 'from-gray-500 to-gray-600'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
        {status}
      </span>
    );
  };

// Material-UI Loading Spinner (Themed)
const LoadingSkeleton = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    sx={{ 
      py: 10,
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: 2,
      margin: 2
    }}
  >
    <CircularProgress 
      size={70}
      sx={{
        color: '#6366f1', // Purple color matching your theme
      }}
    />
  </Box>
);
  // Get students count by form
 // Get students count by form - EXCLUDE GRADUATED STUDENTS
const getStudentsByForm = (form) => {
  return students.filter(s => s.form === form && s.status !== 'Graduated').length;
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 space-y-6">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-gray-600 mt-2">Manage student records, enrollment, and academic information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 lg:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-green-500/25 w-full lg:w-auto justify-center disabled:opacity-50"
          >
<FiRefreshCcw className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPromotionModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 lg:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/25 w-full lg:w-auto justify-center"
          >
            <FiTrendingUp className="text-lg" />
            Promote/Graduate
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 lg:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/25 w-full lg:w-auto justify-center"
          >
            <FiPlus className="text-lg" />
            Add Student
          </motion.button>
        </div>
      </div>

      {/* Student Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Students</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">{students.length}</p>
            </div>
            <FiUsers className="text-xl lg:text-2xl text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Form 1</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">
                {getStudentsByForm('Form 1')}
              </p>
            </div>
            <FiBook className="text-xl lg:text-2xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Form 2</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">
                {getStudentsByForm('Form 2')}
              </p>
            </div>
            <FiBook className="text-xl lg:text-2xl text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Form 3</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">
                {getStudentsByForm('Form 3')}
              </p>
            </div>
            <FiBook className="text-xl lg:text-2xl text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 lg:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Form 4</p>
              <p className="text-xl lg:text-3xl font-bold mt-2">
                {getStudentsByForm('Form 4')}
              </p>
            </div>
            <FiBook className="text-xl lg:text-2xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, admission number, or parent email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Forms</option>
            {forms.map(form => (
              <option key={form} value={form}>{form}</option>
            ))}
          </select>

          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Streams</option>
            {streams.map(stream => (
              <option key={stream} value={stream}>{stream}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToCSV}
            disabled={filteredStudents.length === 0}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="text-lg" />
            Export CSV
          </motion.button>
        </div>

     {/* Additional Actions */}
<div className="flex flex-col sm:flex-row md:gap-[35%] gap-5 mt-4">
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => handleViewHistory()}
    className="bg-gradient-to-r from-gray-500 to-gray-700  hover:from-gray-600 hover:to-gray-800 text-white px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 justify-center flex-1 min-w-0"
  >
    <FiMapPin className="text-sm flex-shrink-0" />
    <span className="truncate"> Promotion History</span>
  </motion.button>
  
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => setShowGraduatedModal(true)}
    className="bg-gradient-to-r from-purple-500  to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 justify-center flex-1 min-w-0"
  >
    <FiAward className="text-sm flex-shrink-0" />
    <span className="truncate"> Graduated Students</span>
  </motion.button>
</div>
      </div>


      {/* Students Table */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admission</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Form/Stream</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
  <tbody className="divide-y divide-gray-200">
  {currentStudents.map((student) => (
    <motion.tr
      key={student.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => handleViewDetails(student)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
            {student.name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.gender}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-mono text-gray-900">{student.admissionNumber}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">{student.form}</div>
        <div className="text-sm text-gray-500">{student.stream} Stream</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={student.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <PerformanceBadge level={student.academicPerformance} />
        <div className="text-sm text-gray-500 mt-1">Attendance: {student.attendance}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{student.parentName}</div>
        <div className="text-sm text-gray-500">{student.parentPhone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(student);
            }}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors min-w-[40px]"
            title="View Details"
          >
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewHistory(student);
            }}
            className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded transition-colors min-w-[45px]"
            title="Promotion History"
          >
            History
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(student);
            }}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors min-w-[40px]"
            title="Edit"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(student);
            }}
            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors min-w-[45px]"
            title="Delete"
          >
            Delete
          </button>
        </div>
      </td>
    </motion.tr>
  ))}
</tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No students found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredStudents.length > 0 && (
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
            onClick={() => !submitting && setShowModal(false)}
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
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </h2>
                  <button
                    onClick={() => !submitting && setShowModal(false)}
                    disabled={submitting}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admission Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.admissionNumber}
                      onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., ADM/2024/001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter student's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Form *
                    </label>
                    <select
                      required
                      value={formData.form}
                      onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {forms.map(form => (
                        <option key={form} value={form}>{form}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stream *
                    </label>
                    <select
                      required
                      value={formData.stream}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {streams.map(stream => (
                        <option key={stream} value={stream}>{stream}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enrollment Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.enrollmentDate}
                      onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      KCPE Marks
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={formData.kcpeMarks}
                      onChange={(e) => setFormData({ ...formData, kcpeMarks: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter KCPE marks (0-500)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Previous School
                    </label>
                    <input
                      type="text"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter previous school name"
                    />
                  </div>
                </div>

                {/* Parent Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Parent/Guardian Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Parent Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter parent's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Parent Email
                      </label>
                      <input
                        type="email"
                        value={formData.parentEmail}
                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter parent's email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Parent Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Emergency Contact *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Academic Performance
                      </label>
                      <select
                        value={formData.academicPerformance}
                        onChange={(e) => setFormData({ ...formData, academicPerformance: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {academicLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Attendance
                      </label>
                      <select
                        value={formData.attendance}
                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {attendanceOptions.map(attendance => (
                          <option key={attendance} value={attendance}>{attendance}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Discipline Record
                      </label>
                      <select
                        value={formData.disciplineRecord}
                        onChange={(e) => setFormData({ ...formData, disciplineRecord: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {disciplineRecords.map(record => (
                          <option key={record} value={record}>{record}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Hobbies & Interests
                      </label>
                      <input
                        type="text"
                        value={formData.hobbies}
                        onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Football, Music, Reading"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full address"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Medical Information
                      </label>
                      <textarea
                        value={formData.medicalInfo}
                        onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any medical conditions, allergies, or special needs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
<FiMapPin className="animate-spin" />
                        {editingStudent ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingStudent ? 'Update Student' : 'Add Student'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailModal(false)}
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
                  <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {selectedStudent.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedStudent.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <StatusBadge status={selectedStudent.status} />
                      <PerformanceBadge level={selectedStudent.academicPerformance} />
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {selectedStudent.attendance} Attendance
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Admission: <span className="font-semibold text-gray-800">{selectedStudent.admissionNumber}</span></p>
                        <p className="text-gray-600">Form: <span className="font-semibold text-gray-800">{selectedStudent.form} {selectedStudent.stream}</span></p>
                      </div>
                      <div>
                        <p className="text-gray-600">Gender: <span className="font-semibold text-gray-800">{selectedStudent.gender}</span></p>
                        <p className="text-gray-600">KCPE: <span className="font-semibold text-gray-800">{selectedStudent.kcpeMarks || 'N/A'} marks</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiUser className="text-blue-500" />
                        Personal Information
                      </h4>
                      <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-xl">
                        <p><span className="font-medium">Date of Birth:</span> {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p>
                        <p><span className="font-medium">Enrollment Date:</span> {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</p>
                        <p><span className="font-medium">Previous School:</span> {selectedStudent.previousSchool || 'N/A'}</p>
                        <p><span className="font-medium">Hobbies:</span> {selectedStudent.hobbies || 'N/A'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiAward className="text-blue-500" />
                        Academic Information
                      </h4>
                      <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-xl">
                        <p><span className="font-medium">Performance:</span> {selectedStudent.academicPerformance}</p>
                        <p><span className="font-medium">Attendance:</span> {selectedStudent.attendance}</p>
                        <p><span className="font-medium">Discipline:</span> {selectedStudent.disciplineRecord}</p>
                        <p><span className="font-medium">KCPE Marks:</span> {selectedStudent.kcpeMarks || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiUsers className="text-blue-500" />
                        Parent/Guardian
                      </h4>
                      <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-xl">
                        <p><span className="font-medium">Name:</span> {selectedStudent.parentName}</p>
                        <p><span className="font-medium">Email:</span> {selectedStudent.parentEmail || 'N/A'}</p>
                        <p><span className="font-medium">Phone:</span> {selectedStudent.parentPhone}</p>
                        <p><span className="font-medium">Emergency:</span> {selectedStudent.emergencyContact}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiMapPin className="text-blue-500" />
                        Contact & Medical
                      </h4>
                      <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-xl">
                        <p><span className="font-medium">Address:</span> {selectedStudent.address}</p>
                        <p><span className="font-medium">Medical Info:</span> {selectedStudent.medicalInfo || 'None'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEdit(selectedStudent);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Edit Student
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promotion History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowHistoryModal(false)}
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
                    {selectedStudent ? `${selectedStudent.name}'s Promotion History` : 'All Promotion History'}
                  </h2>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {promotionHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <FiMapPin className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No promotion history found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {promotionHistory.map((record, index) => (
                      <div key={record.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {record.student.name} ({record.student.admissionNumber})
                            </h4>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-600">
                                From: <span className="font-semibold">{record.fromForm} {record.fromStream}</span>
                              </span>
                               <FiArrowUpRight className="text-green-500" />                              <span className="text-sm text-gray-600">
                                To: <span className="font-semibold">{record.toForm} {record.toStream}</span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date(record.promotedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(record.promotedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


{/* Graduated Students Modal */}
<AnimatePresence>
  {showGraduatedModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setShowGraduatedModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Graduated Students</h2>
            <button
              onClick={() => setShowGraduatedModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Filters and Export Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Graduation Year
              </label>
              <select
                value={graduationYearFilter}
                onChange={(e) => setGraduationYearFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Years</option>
                {graduationYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stream
              </label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Streams</option>
                {streams.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportGraduatedToCSV}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 w-full justify-center"
              >
                <FiDownload className="text-lg" />
                Export CSV
              </motion.button>
            </div>
          </div>

          {/* Graduated Students Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admission</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stream Graduated With</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Graduation Year</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">KCPE Marks</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {graduatedStudents
                    .filter(student => 
                      (graduationYearFilter === 'all' || student.graduationYear === graduationYearFilter) &&
                      (selectedStream === 'all' || student.stream === selectedStream)
                    )
                    .map((student) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedGraduatedStudent(student);
                        setShowGraduatedDetailsModal(true);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{student.admissionNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{student.stream} Stream</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{student.graduationYear}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{student.kcpeMarks || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PerformanceBadge level={student.academicPerformance} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {graduatedStudents.length === 0 && (
              <div className="text-center py-12">
                <FiAward className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No graduated students found</p>
                <p className="text-gray-400 text-sm mt-2">Graduated students will appear here</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* Graduated Student Details Modal */}
<AnimatePresence>
  {showGraduatedDetailsModal && selectedGraduatedStudent && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setShowGraduatedDetailsModal(false)}
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
            <h2 className="text-2xl font-bold text-gray-800">Graduated Student Details</h2>
            <button
              onClick={() => setShowGraduatedDetailsModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {selectedGraduatedStudent.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedGraduatedStudent.name}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <StatusBadge status={selectedGraduatedStudent.status} />
                <PerformanceBadge level={selectedGraduatedStudent.academicPerformance} />
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Graduated {selectedGraduatedStudent.graduationYear}
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Admission</p>
                  <p className="font-semibold text-gray-800">{selectedGraduatedStudent.admissionNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Stream</p>
                  <p className="font-semibold text-gray-800">{selectedGraduatedStudent.stream}</p>
                </div>
                <div>
                  <p className="text-gray-600">Gender</p>
                  <p className="font-semibold text-gray-800">{selectedGraduatedStudent.gender}</p>
                </div>
                <div>
                  <p className="text-gray-600">KCPE Marks</p>
                  <p className="font-semibold text-gray-800">{selectedGraduatedStudent.kcpeMarks || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiUser className="text-purple-500" />
                  Personal Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(selectedGraduatedStudent.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrollment Date:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(selectedGraduatedStudent.enrollmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Previous School:</span>
                    <span className="font-medium text-gray-800">
                      {selectedGraduatedStudent.previousSchool || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hobbies & Interests:</span>
                    <span className="font-medium text-gray-800 text-right">
                      {selectedGraduatedStudent.hobbies || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiAward className="text-purple-500" />
                  Academic Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Academic Performance:</span>
                    <PerformanceBadge level={selectedGraduatedStudent.academicPerformance} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance Record:</span>
                    <span className="font-medium text-gray-800">{selectedGraduatedStudent.attendance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discipline Record:</span>
                    <span className="font-medium text-gray-800">{selectedGraduatedStudent.disciplineRecord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">KCPE Marks:</span>
                    <span className="font-medium text-gray-800">{selectedGraduatedStudent.kcpeMarks || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Parent/Guardian Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiUsers className="text-purple-500" />
                  Parent/Guardian Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parent Name:</span>
                    <span className="font-medium text-gray-800">{selectedGraduatedStudent.parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parent Email:</span>
                    <span className="font-medium text-gray-800">{selectedGraduatedStudent.parentEmail || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parent Phone:</span>
                    <span className="font-medium text-gray-800">{selectedGraduatedStudent.parentPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Contact:</span>
                    <span className="font-medium text-gray-800">{selectedGraduatedStudent.emergencyContact}</span>
                  </div>
                </div>
              </div>

              {/* Contact & Medical Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiMapPin className="text-purple-500" />
                  Contact & Medical Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Address:</p>
                    <p className="font-medium text-gray-800">{selectedGraduatedStudent.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Medical Information:</p>
                    <p className="font-medium text-gray-800">
                      {selectedGraduatedStudent.medicalInfo || 'No medical conditions reported'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Move Student Back Section */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FiRefreshCcw className="text-yellow-600" />
                  Move Student Back to School
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  This will move the student back to active status in the selected form.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={repeatForm}
                    onChange={(e) => setRepeatForm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Form 4">Form 4</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 1">Form 1</option>
                  </select>
                  <button
                    onClick={() => handleRepeatStudent(selectedGraduatedStudent)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <FiRefreshCcw className="text-lg" />
                    Move to {repeatForm}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8 mt-8 border-t border-gray-200">
            <button
              onClick={() => {
                setShowGraduatedDetailsModal(false);
                handleEdit(selectedGraduatedStudent);
              }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FiEdit className="text-lg" />
              Edit Student
            </button>
            <button
              onClick={() => setShowGraduatedDetailsModal(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


{/* Confirmation Modal */}
<AnimatePresence>
  {showConfirmModal && studentToDelete && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
      onClick={() => setShowConfirmModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiXCircle className="text-red-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-800">{studentToDelete.name}</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowConfirmModal(false);
                setStudentToDelete(null);
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiRefreshCcw className="animate-spin text-sm" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="text-sm" />
                  Delete Student
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


     {/* Promotion/Graduation Modal */}
<AnimatePresence>
  {showPromotionModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setShowPromotionModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Promote/Graduate Class</h2>
            <button
              onClick={() => setShowPromotionModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={promotionClass}
              onChange={(e) => setPromotionClass(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a class</option>
              {forms.map(form => (
                <option key={form} value={form}>{form}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Action
            </label>
            <select
              value={promotionAction}
              onChange={(e) => setPromotionAction(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="promote">Promote to Next Class</option>
              <option value="graduate">Graduate Class</option>
            </select>
          </div>

          {promotionClass && (
            <div className={`p-4 rounded-xl ${
              promotionAction === 'promote' && promotionClass !== 'Form 4' 
                ? 'bg-yellow-50 border border-yellow-200' 
                : 'bg-blue-50'
            }`}>
              <h4 className="font-semibold mb-2 ${
                promotionAction === 'promote' && promotionClass !== 'Form 4' 
                  ? 'text-yellow-800' 
                  : 'text-blue-800'
              }">
                Action Preview:
              </h4>
              <p className={`text-sm ${
                promotionAction === 'promote' && promotionClass !== 'Form 4' 
                  ? 'text-yellow-700' 
                  : 'text-blue-700'
              }`}>
                {promotionAction === 'promote' ? (
                  <>
                    All <span className="font-bold">{promotionClass}</span> students will be promoted to{' '}
                    <span className="font-bold">{promotionMap[promotionClass]}</span>
                    {promotionMap[promotionClass] === 'Graduated' && ' and marked as Graduated'}
                    {promotionClass !== 'Form 4' && (
                      <>
                        <br /><br />
                        <span className="font-semibold text-yellow-600">
                          ⚠️ Important: Promotion will only succeed if {promotionMap[promotionClass]} is empty.
                          If there are existing students in {promotionMap[promotionClass]}, 
                          you must graduate them first.
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    All <span className="font-bold">{promotionClass}</span> students will be marked as{' '}
                    <span className="font-bold">Graduated</span>
                  </>
                )}
              </p>
              <p className={`text-xs mt-2 ${
                promotionAction === 'promote' && promotionClass !== 'Form 4' 
                  ? 'text-yellow-600' 
                  : 'text-blue-600'
              }`}>
                Affected students: {getStudentsByForm(promotionClass)}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowPromotionModal(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePromotion}
              disabled={!promotionClass || loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Processing...
                </>
              ) : promotionAction === 'promote' ? (
                <>
                  <FiTrendingUp />
                  Promote Class
                </>
              ) : (
                <>
                  <FiAward />
                  Graduate Class
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}