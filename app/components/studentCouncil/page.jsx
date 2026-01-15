'use client';
import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  FiUsers, 
  FiAward, 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX,
  FiUser,
  FiCalendar,
  FiStar,
  FiTarget,
  FiCheck,
  FiRefreshCw,
  FiFilter,
  FiDownload,
  FiBook,
  FiActivity,
  FiMusic,
  FiCoffee,
  FiBell,
  FiShield,
  FiTruck,
  FiCloud,
  FiCpu,
  FiHeart,
  FiHome,
  FiImage,
  FiUpload,
  FiCamera,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiMapPin,
  FiBarChart2,
  FiArrowUpRight,
  FiInfo,
  FiArrowRight,
  FiEdit2,
  FiUserPlus,
  FiHash
} from 'react-icons/fi';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';

// Modern Modal Component - Updated with 20% larger size and custom scrollbar
const ModernModal = ({ children, open, onClose, maxWidth = '800px' }) => {
  if (!open) return null;

  // Increase maxWidth by 20%
  const originalWidth = parseInt(maxWidth);
  const increasedWidth = originalWidth * 1.2;
  const newMaxWidth = `${increasedWidth}px`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col"
        style={{ 
          width: '90%',
          maxWidth: newMaxWidth,
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Search Button Component
const SearchButton = ({ onClick, loading = false }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="inline-flex items-center gap-2 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-3 rounded-xl transition-all duration-200 shadow-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? (
      <CircularProgress size={20} color="inherit" />
    ) : (
      <FiSearch className="w-4 h-4" />
    )}
    {loading ? 'Searching...' : 'Search Students'}
  </button>
);

const StudentCouncil = () => {
  const [councilMembers, setCouncilMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedForm, setSelectedForm] = useState('all');
  const [selectedStream, setSelectedStream] = useState('all');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchButtonVisible, setSearchButtonVisible] = useState(false);

  const councilPositions = [
    { value: 'President', label: 'President of the School', department: 'Presidency', level: 1 },
    { value: 'DeputyPresident', label: 'Deputy President', department: 'Presidency', level: 2 },
    { value: 'SchoolCaptain', label: 'School Captain', department: 'General', level: 1 },
    { value: 'DeputyCaptain', label: 'Deputy Captain', department: 'General', level: 2 },
    { value: 'AcademicsSecretary', label: 'Academics Secretary', department: 'Academics', level: 1 },
    { value: 'SportsSecretary', label: 'Sports Secretary', department: 'Sports', level: 1 },
    { value: 'EntertainmentSecretary', label: 'Entertainment Secretary', department: 'Entertainment', level: 1 },
    { value: 'CleaningSecretary', label: 'Cleaning Secretary', department: 'Cleaning', level: 1 },
    { value: 'MealsSecretary', label: 'Meals Secretary', department: 'Meals', level: 1 },
    { value: 'DisciplineSecretary', label: 'Discipline Secretary', department: 'Discipline', level: 1 },
    { value: 'HealthSecretary', label: 'Health Secretary', department: 'Health', level: 1 },
    { value: 'LibrarySecretary', label: 'Library Secretary', department: 'Library', level: 1 },
    { value: 'ClassRepresentative', label: 'Class Representative', department: 'Class', level: 3, requiresClass: true },
    { value: 'BellRinger', label: 'Bell Ringer', department: 'General', level: 3 },
    { value: 'TransportSecretary', label: 'Transport Secretary', department: 'Transport', level: 1 },
    { value: 'EnvironmentSecretary', label: 'Environment Secretary', department: 'Environment', level: 1 },
    { value: 'SpiritualSecretary', label: 'Spiritual Secretary', department: 'Spiritual', level: 1 },
    { value: 'TechnologySecretary', label: 'Technology Secretary', department: 'Technology', level: 1 },
  ];

  const councilDepartments = [
    { value: 'Presidency', label: 'Presidency', color: 'from-purple-500 to-pink-600', icon: FiAward },
    { value: 'Academics', label: 'Academics', color: 'from-blue-500 to-cyan-600', icon: FiBook },
    { value: 'Sports', label: 'Sports', color: 'from-green-500 to-emerald-600', icon: FiActivity },
    { value: 'Entertainment', label: 'Entertainment', color: 'from-yellow-500 to-orange-600', icon: FiMusic },
    { value: 'Cleaning', label: 'Cleaning', color: 'from-indigo-500 to-purple-600', icon: FiHome },
    { value: 'Meals', label: 'Meals', color: 'from-red-500 to-pink-600', icon: FiCoffee },
    { value: 'Discipline', label: 'Discipline', color: 'from-gray-500 to-gray-700', icon: FiShield },
    { value: 'Health', label: 'Health', color: 'from-pink-500 to-rose-600', icon: FiHeart },
    { value: 'Library', label: 'Library', color: 'from-teal-500 to-green-600', icon: FiBook },
    { value: 'Transport', label: 'Transport', color: 'from-orange-500 to-red-600', icon: FiTruck },
    { value: 'Environment', label: 'Environment', color: 'from-lime-500 to-green-600', icon: FiHome },
    { value: 'Spiritual', label: 'Spiritual', color: 'from-violet-500 to-purple-600', icon: FiCloud },
    { value: 'Technology', label: 'Technology', color: 'from-cyan-500 to-blue-600', icon: FiCpu },
    { value: 'Class', label: 'Class Leadership', color: 'from-amber-500 to-orange-600', icon: FiUsers },
    { value: 'General', label: 'General', color: 'from-slate-500 to-gray-600', icon: FiUsers },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active', color: 'from-green-500 to-emerald-600' },
    { value: 'Inactive', label: 'Inactive', color: 'from-gray-500 to-gray-600' },
    { value: 'Graduated', label: 'Graduated', color: 'from-blue-500 to-cyan-600' }
  ];

  const [formData, setFormData] = useState({
    position: '',
    department: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
    achievements: '',
    status: 'Active',
    form: '',
    stream: ''
  });

  // Fetch council members
  const fetchCouncilMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/studentCouncil');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (result.success) {
        setCouncilMembers(result.councilMembers || []);
        setFilteredMembers(result.councilMembers || []);
      } else {
        throw new Error(result.error || 'Failed to fetch council members');
      }
    } catch (error) {
      console.error('Error fetching council members:', error);
      toast.error('Failed to load council members');
      setCouncilMembers([]);
      setFilteredMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced search function with fuzzy matching
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter search terms');
      return;
    }

    try {
      setSearchLoading(true);
      
      // Normalize search term for better matching
      const normalizedSearch = searchTerm.toLowerCase().trim();
      
      // Call the API with search term
      const response = await fetch(`/api/student?action=search-students&search=${encodeURIComponent(normalizedSearch)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (result.success && result.students) {
        // Apply client-side fuzzy matching for better results
        const fuzzyMatchedStudents = result.students.filter(student => {
          // Create a searchable string with all relevant fields
          const searchableString = `
            ${student.name || ''}
            ${student.admissionNumber || ''}
            ${student.form || ''}
            ${student.stream || ''}
            ${student.gender || ''}
          `.toLowerCase();

          // Split search term into words for partial matching
          const searchWords = normalizedSearch.split(/\s+/);
          
          // Check if all search words appear in any part of the searchable string
          return searchWords.every(word => 
            searchableString.includes(word) ||
            // Try soundex-like matching for names
            fuzzyMatch(student.name?.toLowerCase() || '', word)
          );
        });

        setStudents(fuzzyMatchedStudents);
        setFilteredStudents(fuzzyMatchedStudents);
        
        if (fuzzyMatchedStudents.length > 0) {
          toast.success(`Found ${fuzzyMatchedStudents.length} students`);
        } else {
          toast.info('No students found matching your search');
        }
        
        // Reset filters
        setSelectedForm('all');
        setSelectedStream('all');
      } else {
        toast.error(result.error || 'No students found');
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error('Error searching students:', error);
      toast.error('Failed to search students');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Simple fuzzy matching function
  const fuzzyMatch = (str, pattern) => {
    if (!str || !pattern) return false;
    
    // Remove whitespace and convert to lowercase
    str = str.toLowerCase().replace(/\s+/g, '');
    pattern = pattern.toLowerCase().replace(/\s+/g, '');
    
    // Check if pattern is a substring
    if (str.includes(pattern)) return true;
    
    // Check for similar sounding names (simplified)
    if (str.length > 0 && pattern.length > 0) {
      // Check first few characters
      if (str.startsWith(pattern.substring(0, Math.min(3, pattern.length)))) return true;
      
      // Check for common name variations
      const nameParts = str.split('');
      const patternParts = pattern.split('');
      
      let matches = 0;
      let patternIndex = 0;
      
      for (let i = 0; i < nameParts.length && patternIndex < patternParts.length; i++) {
        if (nameParts[i] === patternParts[patternIndex]) {
          matches++;
          patternIndex++;
        }
      }
      
      // If most pattern characters match in order
      return matches >= Math.max(2, patternParts.length * 0.6);
    }
    
    return false;
  };

  // Handle real-time search with debouncing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setStudents([]);
      setFilteredStudents([]);
      setSearchButtonVisible(false);
      return;
    }

    setSearchButtonVisible(true);
  }, [searchTerm]);

  useEffect(() => {
    fetchCouncilMembers();
  }, []);

  // Filter members
  useEffect(() => {
    let filtered = councilMembers;

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(member => member.department === selectedDepartment);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(member => member.status === selectedStatus);
    }

    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [selectedDepartment, selectedStatus, councilMembers]);

  // Filter students based on form and stream
  useEffect(() => {
    let filtered = students;

    if (selectedForm !== 'all') {
      filtered = filtered.filter(student => student.form === selectedForm);
    }

    if (selectedStream !== 'all') {
      filtered = filtered.filter(student => student.stream === selectedStream);
    }

    setFilteredStudents(filtered);
  }, [students, selectedForm, selectedStream]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      <p className="text-sm text-gray-700">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMembers.length)} of {filteredMembers.length} members
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-50 transition-colors"
        >
          <FiChevronLeft className="w-4 h-4" />
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
                <span className="px-1 text-gray-500">...</span>
              )}
              <button
                onClick={() => paginate(page)}
                className={`px-2.5 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
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
          className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-50 transition-colors"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const handleCreate = () => {
    setFormData({
      position: '',
      department: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      responsibilities: '',
      achievements: '',
      status: 'Active',
      form: '',
      stream: ''
    });
    setEditingMember(null);
    setSelectedStudent(null);
    setImagePreview(null);
    setImageFile(null);
    setSearchTerm('');
    setStudents([]);
    setFilteredStudents([]);
    setSearchButtonVisible(false);
    setShowStudentSearch(true);
  };

  const handleEdit = (member) => {
    setFormData({
      position: member.position,
      department: member.department,
      startDate: member.startDate.split('T')[0],
      endDate: member.endDate ? member.endDate.split('T')[0] : '',
      responsibilities: member.responsibilities,
      achievements: member.achievements || '',
      status: member.status,
      form: member.form || '',
      stream: member.stream || ''
    });
    setEditingMember(member);
    setSelectedStudent(member.student);
    setImagePreview(member.image || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    
    if (formData.position && ['ClassRepresentative'].includes(formData.position)) {
      setFormData(prev => ({
        ...prev,
        form: student.form,
        stream: student.stream
      }));
    }
    
    setShowStudentSearch(false);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }
    
    if (['ClassRepresentative'].includes(formData.position)) {
      if (!formData.form || !formData.stream) {
        toast.error('Form and stream are required for class positions');
        return;
      }
      
      if (selectedStudent && (selectedStudent.form !== formData.form || selectedStudent.stream !== formData.stream)) {
        toast.error(`Selected student is in ${selectedStudent.form} ${selectedStudent.stream}, but position is for ${formData.form} ${formData.stream}`);
        return;
      }
    }

    try {
      setSubmitting(true);
      
      const formDataToSend = new FormData();

      if (editingMember) {
        formDataToSend.append('position', formData.position);
        formDataToSend.append('department', formData.department);
        formDataToSend.append('startDate', formData.startDate);
        formDataToSend.append('endDate', formData.endDate || '');
        formDataToSend.append('responsibilities', formData.responsibilities);
        formDataToSend.append('achievements', formData.achievements || '');
        formDataToSend.append('status', formData.status);
        formDataToSend.append('form', formData.form || '');
        formDataToSend.append('stream', formData.stream || '');
        
        if (!imagePreview && editingMember.image) {
          formDataToSend.append('removeImage', 'true');
        }
      } else {
        formDataToSend.append('studentId', selectedStudent.id);
        formDataToSend.append('position', formData.position);
        formDataToSend.append('department', formData.department);
        formDataToSend.append('startDate', formData.startDate);
        formDataToSend.append('endDate', formData.endDate || '');
        formDataToSend.append('responsibilities', formData.responsibilities);
        formDataToSend.append('achievements', formData.achievements || '');
        formDataToSend.append('status', 'Active');
        formDataToSend.append('form', formData.form || '');
        formDataToSend.append('stream', formData.stream || '');
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const url = editingMember 
        ? `/api/studentCouncil/${editingMember.id}`
        : '/api/studentCouncil';

      const method = editingMember ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        await fetchCouncilMembers();
        setShowModal(false);
        setSelectedStudent(null);
        setImagePreview(null);
        setImageFile(null);
        toast.success(editingMember ? 'Council member updated successfully' : 'Council member added successfully');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving council member:', error);
      toast.error(error.message || 'Failed to save council member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (member) => {
    if (confirm(`Are you sure you want to remove ${member.student.name} from the council?`)) {
      try {
        const response = await fetch(`/api/studentCouncil/${member.id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          await fetchCouncilMembers();
          toast.success('Council member removed successfully');
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error deleting council member:', error);
        toast.error('Failed to remove council member');
      }
    }
  };

  const getPositionIcon = (position) => {
    const pos = councilPositions.find(p => p.value === position);
    const dept = councilDepartments.find(d => d.value === (pos?.department || 'General'));
    return dept ? dept.icon : FiUser;
  };

  const getDepartmentColor = (department) => {
    const dept = councilDepartments.find(d => d.value === department);
    return dept ? dept.color : 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status) => {
    const stat = statusOptions.find(s => s.value === status);
    return stat ? stat.color : 'from-gray-500 to-gray-600';
  };

  const getPositionLabel = (position, department, form = null, stream = null) => {
    const pos = councilPositions.find(p => p.value === position && p.department === department);
    const baseLabel = pos ? pos.label : position;
    
    if (form && stream && ['ClassRepresentative'].includes(position)) {
      return `${baseLabel} - ${form} ${stream}`;
    }
    
    return baseLabel;
  };

  const StatusBadge = ({ status }) => (
    <span className={`bg-gradient-to-r ${getStatusColor(status)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
      {status}
    </span>
  );

  const DepartmentBadge = ({ department }) => {
    const dept = councilDepartments.find(d => d.value === department);
    const DeptIcon = dept?.icon || FiUsers;
    
    return (
      <span className={`bg-gradient-to-r ${getDepartmentColor(department)} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
        <DeptIcon className="w-3 h-3" />
        {dept?.label || department}
      </span>
    );
  };

  const getMembersByDepartment = (department) => {
    return councilMembers.filter(m => m.department === department).length;
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl p-4 shadow-xs border border-gray-200/60">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-gray-300 h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              <div className="h-2 bg-gray-300 rounded w-1/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Loading state with Material-UI spinner - FIXED
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Box
          sx={{
            textAlign: 'center'
          }}
        >
          <CircularProgress size={60} />
          <Box sx={{ mt: 2 }}>
            <p className="text-gray-600 font-medium">Loading Student Council Data...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait while we fetch the data</p>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6 space-y-4">
      <Toaster position="top-right" richColors />
      
      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }

        .modal-scrollable {
          flex: 1;
          overflow-y: auto;
          padding-right: 4px; /* Add space for scrollbar */
        }
      `}</style>
      
      {/* Material-UI Backdrop for loading */}
      <Backdrop
        sx={{ color: '#fff', zIndex: 9999 }}
        open={searchLoading || submitting}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Box sx={{ mt: 2 }}>
            <p className="text-white font-medium">
              {searchLoading ? 'Searching Students...' : 'Saving Council Member...'}
            </p>
          </Box>
        </Box>
      </Backdrop>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="mb-3 lg:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <FiUsers className="text-white text-lg w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                Student Council
              </h1>
              <p className="text-gray-600 mt-1 text-sm">Manage student leadership positions and departmental responsibilities</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-lg font-medium text-sm md:text-base"
        >
          <FiPlus className="w-4 h-4" />
          Add Council Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Total Members</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{councilMembers.length}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <FiUsers className="text-purple-600 text-base w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Active Members</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                {councilMembers.filter(m => m.status === 'Active').length}
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiAward className="text-blue-600 text-base w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Departments</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                {new Set(councilMembers.map(m => m.department)).size}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <FiTarget className="text-green-600 text-base w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Leadership</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                {councilMembers.filter(m => 
                  ['President', 'DeputyPresident', 'SchoolCaptain'].includes(m.position)
                ).length}
              </p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <FiStar className="text-amber-600 text-base w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-2 mb-4">
        {councilDepartments.slice(0, 7).map(dept => (
          <div
            key={dept.value}
            className={`bg-gradient-to-br ${dept.color} rounded-xl p-3 text-white cursor-pointer transition-transform ${
              selectedDepartment === dept.value ? 'ring-2 ring-white ring-opacity-50' : ''
            }`}
            onClick={() => setSelectedDepartment(selectedDepartment === dept.value ? 'all' : dept.value)}
          >
            <div className="flex flex-col items-center text-center">
              <dept.icon className="text-lg mb-1" />
              <p className="text-xs font-medium opacity-90">{dept.label}</p>
              <p className="text-sm font-bold mt-1">{getMembersByDepartment(dept.value)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Departments</option>
              {councilDepartments.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchCouncilMembers}
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2.5 rounded-xl transition-all duration-200 shadow-xs border border-gray-200 font-medium text-sm md:text-base"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Council Members Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Member</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tenure</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentMembers.length > 0 ? (
                currentMembers.map((member) => {
                  const PositionIcon = getPositionIcon(member.position);
                  
                  return (
                    <tr
                      key={member.id}
                      className="transition-colors duration-150 cursor-pointer"
                      onClick={() => handleViewDetails(member)}
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            {member.image ? (
                              <img 
                                src={member.image} 
                                alt={member.student?.name || 'Member'}
                                className="h-8 w-8 rounded-lg object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium text-xs">
                                {member.student?.name?.charAt(0) || 'M'}
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{member.student?.name || 'Unknown Student'}</div>
                            <div className="text-xs text-gray-500">{member.student?.admissionNumber || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-gray-100">
                            <PositionIcon className="text-gray-600 text-sm" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getPositionLabel(member.position, member.department, member.form, member.stream)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <DepartmentBadge department={member.department} />
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.startDate ? new Date(member.startDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.endDate ? `to ${new Date(member.endDate).toLocaleDateString()}` : 'Present'}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(member);
                            }}
                            className="p-1.5 text-blue-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(member);
                            }}
                            className="p-1.5 text-blue-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(member);
                            }}
                            className="p-1.5 text-rose-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FiUsers className="text-4xl text-gray-400 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No council members found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add new members</p>
                      <button
                        onClick={handleCreate}
                        className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg font-medium text-sm"
                      >
                        <FiPlus className="w-4 h-4" />
                        Add Your First Member
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredMembers.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4">
          <Pagination />
        </div>
      )}

      {/* Student Search Modal - Updated */}
      {showStudentSearch && (
        <ModernModal open={showStudentSearch} onClose={() => setShowStudentSearch(false)} maxWidth="720px">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <FiUser className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Select Student for Council</h2>
                  <p className="text-blue-100 opacity-90 text-sm mt-1">Choose a student to add to the student council</p>
                </div>
              </div>
              <button 
                onClick={() => setShowStudentSearch(false)} 
                className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable area */}
          <div className="modal-scrollable custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Search Section */}
              <div className="space-y-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search students by name, admission number, form, or stream..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>
                
                {/* Search Button */}
                {searchButtonVisible && (
                  <div className="flex justify-center">
                    <SearchButton onClick={handleSearch} loading={searchLoading} />
                  </div>
                )}

                {/* Search Tips */}
                {!searchButtonVisible && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="font-medium text-blue-800 mb-2 text-sm">Search tips:</p>
                    <ul className="space-y-1 text-sm text-blue-600">
                      <li className="flex items-center gap-2">
                        <FiSearch className="w-3 h-3" />
                        <span>Enter name (e.g., "Faith Mwangi") to find similar names</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiHash className="w-3 h-3" />
                        <span>Enter admission number (e.g., "ADM001")</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiBook className="w-3 h-3" />
                        <span>Search by form and stream (e.g., "Form 3 East")</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiInfo className="w-3 h-3" />
                        <span>Type your search terms and click "Search Students"</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Filters - Only show when students are loaded */}
              {students.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Form</label>
                    <select
                      value={selectedForm}
                      onChange={(e) => setSelectedForm(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base cursor-pointer"
                    >
                      <option value="all">All Forms</option>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Stream</label>
                    <select
                      value={selectedStream}
                      onChange={(e) => setSelectedStream(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base cursor-pointer"
                    >
                      <option value="all">All Streams</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Students List - Fixed height with custom scroll */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {searchLoading ? (
                  <div className="text-center py-12">
                    <CircularProgress size={32} />
                    <p className="text-gray-500 text-base mt-3">Searching students...</p>
                  </div>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                      onClick={() => handleStudentSelect(student)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-800 truncate">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.admissionNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {student.form} {student.stream}
                          </span>
                          <span className="text-xs text-gray-500">
                            • {student.gender}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded-lg">
                          Select
                        </span>
                        <FiArrowRight className="text-gray-400" />
                      </div>
                    </div>
                  ))
                ) : searchTerm && !searchLoading ? (
                  <div className="text-center py-12">
                    <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500 text-base">No students found matching your search</p>
                    <p className="text-sm text-gray-400 mt-2">Try different search terms or check the spelling</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiSearch className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500 text-base">Enter search terms above to find students</p>
                    <p className="text-sm text-gray-400 mt-2">Search by name, admission number, class, or stream</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
            <button
              onClick={() => setShowStudentSearch(false)}
              className="w-full border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-base"
            >
              Cancel Search
            </button>
          </div>
        </ModernModal>
      )}

      {/* Council Member Detail Modal - Updated */}
      {showDetailModal && selectedMember && (
        <ModernModal open={showDetailModal} onClose={() => setShowDetailModal(false)} maxWidth="720px">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <FiUser className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Member Details</h2>
                  <p className="text-blue-100 opacity-90 text-sm mt-1">
                    {selectedMember.student?.name || 'Unknown Student'} • Council Member
                  </p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable area */}
          <div className="modal-scrollable custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                {selectedMember.image ? (
                  <img 
                    src={selectedMember.image} 
                    alt={selectedMember.student?.name || 'Member'}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {selectedMember.student?.name?.charAt(0) || 'M'}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedMember.student?.name || 'Unknown Student'}</h3>
                  <p className="text-base text-gray-600">{selectedMember.student?.admissionNumber || 'N/A'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={selectedMember.status} />
                    <DepartmentBadge department={selectedMember.department} />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Class</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {selectedMember.student?.form || selectedMember.form || 'N/A'} {selectedMember.student?.stream || selectedMember.stream || ''}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Gender</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{selectedMember.student?.gender || 'N/A'}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Start Date</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {selectedMember.startDate ? new Date(selectedMember.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">End Date</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {selectedMember.endDate ? new Date(selectedMember.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Present'}
                  </p>
                </div>
              </div>

              {/* Position and Responsibilities */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <h4 className="text-base font-bold text-gray-800 mb-2">Position</h4>
                  <p className="text-base text-gray-700 font-medium">
                    {getPositionLabel(selectedMember.position, selectedMember.department, selectedMember.form, selectedMember.stream)}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <h4 className="text-base font-bold text-gray-800 mb-2">Responsibilities</h4>
                  <p className="text-base text-gray-700 whitespace-pre-line">
                    {selectedMember.responsibilities}
                  </p>
                </div>

                {selectedMember.achievements && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                    <h4 className="text-base font-bold text-gray-800 mb-2">Notable Achievements</h4>
                    <p className="text-base text-gray-700 whitespace-pre-line">
                      {selectedMember.achievements}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedMember);
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3.5 rounded-xl transition-all duration-200 font-medium text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit Member
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-base"
              >
                Close Details
              </button>
            </div>
          </div>
        </ModernModal>
      )}

      {/* Council Member Form Modal - Updated */}
      {showModal && (
        <ModernModal open={showModal} onClose={() => !submitting && setShowModal(false)} maxWidth="720px">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <FiUser className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingMember ? 'Edit Council Member' : 'Add Council Member'}
                  </h2>
                  <p className="text-blue-100 opacity-90 text-sm mt-1">
                    {editingMember ? 'Update member information' : 'Add new member to the student council'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => !submitting && setShowModal(false)}
                disabled={submitting}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Student Info */}
          {selectedStudent && (
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{selectedStudent.name}</h3>
                  <p className="text-base text-gray-600">{selectedStudent.admissionNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-lg border">
                      {selectedStudent.form} {selectedStudent.stream}
                    </span>
                    <span className="text-sm text-gray-500">
                      • {selectedStudent.gender}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Student Selected</p>
                  <FiCheck className="text-green-500 text-xl mx-auto mt-1" />
                </div>
              </div>
            </div>
          )}

          {/* Form Content - Scrollable area */}
          <div className="modal-scrollable custom-scrollbar">
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
              {/* Image Upload Section */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <h3 className="text-base font-bold text-gray-800 mb-4">Member Photo</h3>
                
                <div className="flex flex-col items-center gap-4">
                  {/* Image Preview */}
                  <div className="relative">
                    {imagePreview ? (
                      <>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 rounded-xl object-cover border-2 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </>
                    ) : editingMember?.image ? (
                      <>
                        <img 
                          src={editingMember.image} 
                          alt="Current" 
                          className="w-32 h-32 rounded-xl object-cover border-2 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-gray-400 p-4">
                        <FiImage className="text-3xl mb-2" />
                        <span className="text-sm text-center">No Image Selected</span>
                      </div>
                    )}
                  </div>

                  {/* File Input */}
                  <div className="text-center w-full">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-3 rounded-xl transition-all duration-200 font-medium text-base shadow-md hover:shadow-lg"
                    >
                      <FiUpload className="w-4 h-4" />
                      {imagePreview || editingMember?.image ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      JPEG, PNG, or WebP • Maximum 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                <div className="md:col-span-2">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        department: e.target.value,
                        position: ''
                      });
                    }}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <option value="">Select Department</option>
                    {councilDepartments.map(dept => (
                      <option key={dept.value} value={dept.value}>{dept.label}</option>
                    ))}
                  </select>
                </div>

                {/* Position */}
                <div className="md:col-span-2">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    disabled={!formData.department}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Position</option>
                    {formData.department && councilPositions
                      .filter(pos => pos.department === formData.department)
                      .map(position => (
                        <option key={position.value} value={position.value}>
                          {position.label}
                        </option>
                      ))
                    }
                  </select>
                  {!formData.department && (
                    <p className="text-sm text-gray-500 mt-2">Please select a department first</p>
                  )}
                </div>

                {/* Conditional Fields for Class Representative */}
                {(formData.position === 'ClassRepresentative') && (
                  <>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">
                        Form *
                      </label>
                      <select
                        required
                        value={formData.form}
                        onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <option value="">Select Form</option>
                        <option value="Form 1">Form 1</option>
                        <option value="Form 2">Form 2</option>
                        <option value="Form 3">Form 3</option>
                        <option value="Form 4">Form 4</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">
                        Stream *
                      </label>
                      <select
                        required
                        value={formData.stream}
                        onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <option value="">Select Stream</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Date Fields */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base hover:bg-gray-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base hover:bg-gray-100 transition-colors"
                  />
                </div>

                {/* Text Areas */}
                <div className="md:col-span-2">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Responsibilities *
                  </label>
                  <textarea
                    required
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-y hover:bg-gray-100 transition-colors"
                    placeholder="Describe key responsibilities and duties..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Achievements (Optional)
                  </label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-y hover:bg-gray-100 transition-colors"
                    placeholder="Notable achievements or awards..."
                  />
                </div>

                {/* Status Field - Only for editing */}
                {editingMember && (
                  <div className="md:col-span-2">
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 mt-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-base disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3.5 rounded-xl transition-all duration-200 font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    <span className="text-base">{editingMember ? 'Updating...' : 'Adding...'}</span>
                  </>
                ) : (
                  <>
                    {editingMember ? (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Update Member
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="w-4 h-4" />
                        Add to Council
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </ModernModal>
      )}
    </div>
  );
};

export default StudentCouncil;