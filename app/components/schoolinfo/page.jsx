'use client';
import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSave, 
  FiEdit3, 
  FiTrash2, 
  FiPlus, 
  FiX, 
  FiUpload, 
  FiVideo, 
  FiFileText,
  FiDollarSign,
  FiUsers,
  FiBook,
  FiCalendar,
  FiUser,
  FiAward,
  FiBriefcase,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiCheck,
  FiHome,
  FiUserCheck,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiTarget,
  FiStar,
  FiActivity,
  FiCoffee,
  FiShield,
  FiHeart,
  FiImage,
  FiCamera,
  FiEye,
  FiBarChart2,
  FiArrowUpRight,
  FiArrowRight,
  FiEdit2,
  FiHash,
  FiLoader
} from 'react-icons/fi';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';

// Modern Modal Component - Consistent with council page
const ModernModal = ({ children, open, onClose, maxWidth = '800px' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in-0">
      <div 
        className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col"
        style={{ 
          width: '95%',
          maxWidth: maxWidth,
          maxHeight: '95vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Custom File Upload Component - Modernized
const CustomFileUpload = ({ 
  accept, 
  onFileSelect, 
  currentFile, 
  placeholder, 
  maxSize,
  className = ""
}) => {
  const fileInputRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (maxSize && file.size > maxSize) {
        toast.error(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      onFileSelect(file);
    }
    e.target.value = '';
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleClick}
        className="border-2 border-dashed border-gray-300 rounded-xl p-3 sm:p-4 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white/80 hover:bg-white group"
      >
        <FiUpload className="mx-auto text-gray-400 text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-blue-500 transition-colors" />
        <p className="text-gray-600 font-medium text-xs sm:text-sm mb-1 truncate">
          {currentFile ? currentFile.name : placeholder}
        </p>
        <p className="text-gray-400 text-xs">
          {currentFile ? 'Click to change file' : 'Click to browse files'}
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

// Stats Cards Component - Consistent design
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`bg-gradient-to-br ${color} p-3 sm:p-4 rounded-xl text-white shadow-lg transition-all duration-200 cursor-pointer w-full`}
  >
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-white/80 text-xs font-medium truncate">{label}</p>
        <p className="text-lg sm:text-xl font-bold mt-1 truncate">{value}</p>
      </div>
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
        <Icon className="text-sm sm:text-base" />
      </div>
    </div>
  </motion.div>
);

// Tag Component for subjects/departments
const Tag = ({ children, color = "blue", onRemove, removable = false }) => (
  <span className={`inline-flex items-center gap-1 bg-${color}-100 text-${color}-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium`}>
    {children}
    {removable && onRemove && (
      <button
        onClick={onRemove}
        className={`text-${color}-600 hover:text-${color}-800 transition-colors ml-1`}
      >
        <FiX size={10} className="sm:w-3 sm:h-3" />
      </button>
    )}
  </span>
);

// Video Player Component - Mobile responsive
const VideoPlayer = ({ videoTour, videoType }) => {
  if (!videoTour) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-500 p-4">
          <FiVideo className="text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3 opacity-50" />
          <p className="text-xs sm:text-sm">No video available</p>
        </div>
      </div>
    );
  }

  if (videoType === 'youtube') {
    const getYouTubeId = (url) => {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      return match ? match[1] : null;
    };

    const videoId = getYouTubeId(videoTour);
    if (!videoId) {
      return (
        <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-500 p-4">
            <FiVideo className="text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3 opacity-50" />
            <p className="text-xs sm:text-sm">Invalid YouTube URL</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="School Video Tour"
        />
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
      <video
        controls
        className="w-full h-full"
        src={videoTour}
        title="School Video Tour"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

// PDF Viewer Component - Mobile responsive
const PDFViewer = ({ curriculumPDF }) => {
  if (!curriculumPDF) {
    return (
      <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-500 p-4">
          <FiFileText className="text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3 opacity-50" />
          <p className="text-xs sm:text-sm">No curriculum PDF available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-40 sm:h-48 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white p-4">
      <div className="text-center">
        <FiFileText className="text-2xl sm:text-3xl text-blue-500 mx-auto mb-2 sm:mb-3" />
        <p className="text-gray-700 font-medium text-xs sm:text-sm mb-2 sm:mb-3">Curriculum PDF</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <a
            href={curriculumPDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 sm:gap-2 bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-blue-600 transition-colors text-xs sm:text-sm"
          >
            <FiFileText size={12} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">View PDF</span>
            <span className="sm:hidden">View</span>
          </a>
          <a
            href={curriculumPDF}
            download
            className="inline-flex items-center gap-1 sm:gap-2 bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-green-600 transition-colors text-xs sm:text-sm"
          >
            <FiUpload size={12} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">DL</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getDepartmentsData = (departments) => {
  if (!departments) return [];
  
  if (Array.isArray(departments)) {
    return departments.map(dept => {
      if (typeof dept === 'string') return dept;
      if (typeof dept === 'object' && dept.name) return dept.name;
      return dept;
    });
  }
  
  if (typeof departments === 'object') {
    const allDepartments = [];
    Object.values(departments).forEach(deptArray => {
      if (Array.isArray(deptArray)) {
        deptArray.forEach(dept => {
          if (typeof dept === 'string') allDepartments.push(dept);
          if (typeof dept === 'object' && dept.name) allDepartments.push(dept.name);
        });
      }
    });
    return allDepartments;
  }
  
  return [];
};

const getSubjectsData = (subjects) => {
  if (!subjects) return [];
  return Array.isArray(subjects) ? subjects : [];
};

// Edit Dialog Component - Modernized with better mobile responsiveness
const SchoolInfoEditDialog = ({ schoolInfo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    studentCount: '',
    staffCount: '',
    feesBoarding: '',
    feesDay: '',
    feesDistribution: {},
    openDate: '',
    closeDate: '',
    subjects: [],
    departments: [],
    youtubeLink: '',
    videoTour: null,
    curriculumPDF: null,
    admissionOpenDate: '',
    admissionCloseDate: '',
    admissionRequirements: '',
    admissionFee: '',
    admissionCapacity: '',
    admissionContactEmail: '',
    admissionContactPhone: '',
    admissionWebsite: '',
    admissionLocation: '',
    admissionOfficeHours: '',
    admissionDocumentsRequired: []
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [feeItems, setFeeItems] = useState([]);
  const [newDocument, setNewDocument] = useState('');

  useEffect(() => {
    if (schoolInfo) {
      const initialData = {
        ...schoolInfo,
        studentCount: schoolInfo.studentCount?.toString() || '',
        staffCount: schoolInfo.staffCount?.toString() || '',
        feesBoarding: schoolInfo.feesBoarding?.toString() || '',
        feesDay: schoolInfo.feesDay?.toString() || '',
        openDate: schoolInfo.openDate ? new Date(schoolInfo.openDate).toISOString().split('T')[0] : '',
        closeDate: schoolInfo.closeDate ? new Date(schoolInfo.closeDate).toISOString().split('T')[0] : '',
        youtubeLink: schoolInfo.videoType === 'youtube' ? schoolInfo.videoTour : '',
        videoTour: null,
        curriculumPDF: null,
        subjects: getSubjectsData(schoolInfo.subjects),
        departments: getDepartmentsData(schoolInfo.departments),
        admissionOpenDate: schoolInfo.admissionOpenDate ? new Date(schoolInfo.admissionOpenDate).toISOString().split('T')[0] : '',
        admissionCloseDate: schoolInfo.admissionCloseDate ? new Date(schoolInfo.admissionCloseDate).toISOString().split('T')[0] : '',
        admissionRequirements: schoolInfo.admissionRequirements || '',
        admissionFee: schoolInfo.admissionFee?.toString() || '',
        admissionCapacity: schoolInfo.admissionCapacity?.toString() || '',
        admissionContactEmail: schoolInfo.admissionContactEmail || '',
        admissionContactPhone: schoolInfo.admissionContactPhone || '',
        admissionWebsite: schoolInfo.admissionWebsite || '',
        admissionLocation: schoolInfo.admissionLocation || '',
        admissionOfficeHours: schoolInfo.admissionOfficeHours || '',
        admissionDocumentsRequired: Array.isArray(schoolInfo.admissionDocumentsRequired) ? schoolInfo.admissionDocumentsRequired : []
      };
      
      setFormData(initialData);
      
      if (schoolInfo.feesDistribution && typeof schoolInfo.feesDistribution === 'object') {
        const items = [];
        Object.entries(schoolInfo.feesDistribution).forEach(([name, amount]) => {
          if (typeof amount === 'number') {
            items.push({ 
              type: 'general', 
              name, 
              amount: amount.toString()
            });
          }
        });
        setFeeItems(items);
      }
    }
  }, [schoolInfo]);

  const handleAddSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
      toast.success('Subject added');
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
    toast.info('Subject removed');
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !formData.departments.includes(newDepartment.trim())) {
      setFormData(prev => ({
        ...prev,
        departments: [...prev.departments, newDepartment.trim()]
      }));
      setNewDepartment('');
      toast.success('Department added');
    }
  };

  const handleRemoveDepartment = (department) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d !== department)
    }));
    toast.info('Department removed');
  };

  const handleAddDocument = () => {
    if (newDocument.trim() && !formData.admissionDocumentsRequired.includes(newDocument.trim())) {
      setFormData(prev => ({
        ...prev,
        admissionDocumentsRequired: [...prev.admissionDocumentsRequired, newDocument.trim()]
      }));
      setNewDocument('');
      toast.success('Document requirement added');
    }
  };

  const handleRemoveDocument = (document) => {
    setFormData(prev => ({
      ...prev,
      admissionDocumentsRequired: prev.admissionDocumentsRequired.filter(d => d !== document)
    }));
    toast.info('Document requirement removed');
  };

  const handleAddFeeItem = () => {
    setFeeItems(prev => [...prev, { type: 'general', name: '', amount: '' }]);
  };

  const handleUpdateFeeItem = (index, field, value) => {
    setFeeItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveFeeItem = (index) => {
    setFeeItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('School name is required');
      return;
    }

    if (!formData.studentCount || parseInt(formData.studentCount) < 0) {
      toast.error('Student count must be a positive number');
      return;
    }

    if (!formData.staffCount || parseInt(formData.staffCount) < 0) {
      toast.error('Staff count must be a positive number');
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Saving school information...');
    
    try {
      const feesDistribution = {};
      feeItems.forEach(item => {
        if (item.name.trim() && item.amount && parseFloat(item.amount) > 0) {
          feesDistribution[item.name] = parseFloat(item.amount);
        }
      });

      const submitData = new FormData();
      
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('studentCount', formData.studentCount);
      submitData.append('staffCount', formData.staffCount);
      submitData.append('feesBoarding', formData.feesBoarding);
      submitData.append('feesDay', formData.feesDay);
      submitData.append('feesDistribution', JSON.stringify(feesDistribution));
      submitData.append('openDate', formData.openDate);
      submitData.append('closeDate', formData.closeDate);
      submitData.append('subjects', JSON.stringify(formData.subjects));
      submitData.append('departments', JSON.stringify(formData.departments));
      submitData.append('admissionOpenDate', formData.admissionOpenDate);
      submitData.append('admissionCloseDate', formData.admissionCloseDate);
      submitData.append('admissionRequirements', formData.admissionRequirements);
      submitData.append('admissionFee', formData.admissionFee);
      submitData.append('admissionCapacity', formData.admissionCapacity);
      submitData.append('admissionContactEmail', formData.admissionContactEmail);
      submitData.append('admissionContactPhone', formData.admissionContactPhone);
      submitData.append('admissionWebsite', formData.admissionWebsite);
      submitData.append('admissionLocation', formData.admissionLocation);
      submitData.append('admissionOfficeHours', formData.admissionOfficeHours);
      submitData.append('admissionDocumentsRequired', JSON.stringify(formData.admissionDocumentsRequired));

      if (formData.youtubeLink.trim()) {
        submitData.append('youtubeLink', formData.youtubeLink.trim());
      } else if (formData.videoTour) {
        submitData.append('videoTour', formData.videoTour);
      }

      if (formData.curriculumPDF) {
        submitData.append('curriculumPDF', formData.curriculumPDF);
      }

      const response = await fetch('/api/school', {
        method: schoolInfo ? 'PUT' : 'POST',
        body: submitData,
      });

      const result = await response.json();
      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success(
          schoolInfo ? 'School information updated successfully!' : 'School information created successfully!'
        );
        onSave();
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.error || 'An error occurred while saving');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.dismiss(loadingToast);
      toast.error('Network error: Could not save school information');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      updateField(field, file);
      if (field === 'videoTour') {
        updateField('youtubeLink', '');
      }
      toast.success('File uploaded successfully');
    }
  };

  const handleYouTubeLinkChange = (link) => {
    updateField('youtubeLink', link);
    if (link) {
      updateField('videoTour', null);
    }
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <ModernModal open={true} onClose={onCancel} maxWidth="960px">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 truncate">
              {schoolInfo ? 'Edit School Information' : 'Create School Information'}
            </h2>
            <p className="text-blue-100 opacity-90 text-xs sm:text-sm truncate">
              {schoolInfo ? 'Update your school details and information' : 'Set up your school information to get started'}
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="p-1 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors flex-shrink-0 disabled:opacity-50"
          >
            <FiX size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Basic Information Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200/50">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <FiHome className="text-blue-500" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base"
                    placeholder="Enter school name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base resize-none"
                    placeholder="Describe your school's mission, values, and unique features..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Student Count *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.studentCount}
                      onChange={(e) => updateField('studentCount', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Staff Count *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.staffCount}
                      onChange={(e) => updateField('staffCount', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Boarding Fees (KES) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.feesBoarding}
                      onChange={(e) => updateField('feesBoarding', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Day Fees (KES) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.feesDay}
                      onChange={(e) => updateField('feesDay', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Opening Date *
                    </label>
                    <input
                      type="date"
                      value={formData.openDate}
                      onChange={(e) => updateField('openDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Closing Date *
                    </label>
                    <input
                      type="date"
                      value={formData.closeDate}
                      onChange={(e) => updateField('closeDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media & Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {/* Video Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200/50">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                School Video Tour
              </label>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    YouTube Link
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeLink}
                    onChange={(e) => handleYouTubeLinkChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="text-center text-gray-500 text-xs font-medium">OR</div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Upload Video File (MP4, max 100MB)
                  </label>
                  <CustomFileUpload
                    accept="video/mp4,video/*"
                    onFileSelect={(file) => handleFileUpload('videoTour', file)}
                    currentFile={formData.videoTour}
                    placeholder="Upload school video tour"
                    maxSize={100 * 1024 * 1024}
                  />
                </div>
              </div>
            </div>

            {/* Curriculum PDF */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4 border border-blue-200/50">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                Curriculum PDF
              </label>
              <CustomFileUpload
                accept=".pdf,application/pdf"
                onFileSelect={(file) => handleFileUpload('curriculumPDF', file)}
                currentFile={formData.curriculumPDF}
                placeholder="Upload curriculum PDF"
                maxSize={20 * 1024 * 1024}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {/* Subjects */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 border border-green-200/50">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                Subjects ({formData.subjects.length})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddSubject)}
                  className="flex-1 border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm"
                  placeholder="Add a subject"
                />
                <button
                  onClick={handleAddSubject}
                  disabled={!newSubject.trim()}
                  className="bg-green-500 text-white p-2 rounded-lg sm:rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {formData.subjects.map((subject, index) => (
                  <Tag key={index} color="green" onRemove={() => handleRemoveSubject(subject)} removable>
                    {subject}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Departments */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 border border-purple-200/50">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                Departments ({formData.departments.length})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddDepartment)}
                  className="flex-1 border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm"
                  placeholder="Add a department"
                />
                <button
                  onClick={handleAddDepartment}
                  disabled={!newDepartment.trim()}
                  className="bg-purple-500 text-white p-2 rounded-lg sm:rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {formData.departments.map((department, index) => (
                  <Tag key={index} color="purple" onRemove={() => handleRemoveDepartment(department)} removable>
                    {department}
                  </Tag>
                ))}
              </div>
            </div>
          </div>

          {/* Fee Distribution Section */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 sm:p-4 md:p-6 border border-orange-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                  Fee Distribution Breakdown
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Break down your fees into specific categories and amounts
                </p>
              </div>
              <button
                onClick={handleAddFeeItem}
                className="bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <FiPlus size={12} className="sm:w-4 sm:h-4" />
                Add Fee Item
              </button>
            </div>
            
            <div className="space-y-2">
              {feeItems.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateFeeItem(index, 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm"
                      placeholder="Fee item name"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.amount}
                      onChange={(e) => handleUpdateFeeItem(index, 'amount', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm"
                      placeholder="Amount"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      onClick={() => handleRemoveFeeItem(index)}
                      className="w-full bg-red-500 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <FiTrash2 size={12} className="sm:w-3 sm:h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              {feeItems.length === 0 && (
                <div className="text-center py-4 sm:py-6 text-gray-500">
                  <FiDollarSign className="text-xl sm:text-2xl mx-auto mb-2 opacity-50" />
                  <p className="text-xs sm:text-sm">No fee items added yet. Click "Add Fee Item" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 sm:p-4 md:p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100/80">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg sm:rounded-xl border border-gray-300 hover:border-gray-400 transition-all duration-300 bg-white shadow-sm hover:shadow text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {isSaving ? (
            <>
              <CircularProgress size={16} color="inherit" />
              Saving...
            </>
          ) : (
            <>
              <FiSave />
              {schoolInfo ? 'Update School Info' : 'Create School Info'}
            </>
          )}
        </button>
      </div>
    </ModernModal>
  );
};

// Main Component - Modernized with better mobile responsiveness
export default function SchoolInfoTab() {
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchSchoolInfo();
  }, []);

  const fetchSchoolInfo = async () => {
    const loadingToast = toast.loading('Loading school information...');
    try {
      setLoading(true);
      const response = await fetch('/api/school');
      const result = await response.json();
      
      if (result.success && result.school) {
        setSchoolInfo(result.school);
        toast.dismiss(loadingToast);
        toast.success('School information loaded successfully');
      } else {
        setSchoolInfo(null);
        toast.dismiss(loadingToast);
        toast.info('No school information found');
      }
    } catch (error) {
      console.error('Error fetching school info:', error);
      toast.dismiss(loadingToast);
      toast.error('Error loading school information');
      setSchoolInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete all school information? This action cannot be undone.')) {
      const deleteToast = toast.loading('Deleting school information...');
      try {
        setFetching(true);
        const response = await fetch('/api/school', { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          setSchoolInfo(null);
          toast.dismiss(deleteToast);
          toast.success('School information deleted successfully!');
        } else {
          toast.dismiss(deleteToast);
          toast.error(result.error || 'Error deleting school information');
        }
      } catch (error) {
        toast.dismiss(deleteToast);
        toast.error('Error deleting school information');
      } finally {
        setFetching(false);
      }
    }
  };

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
            <p className="text-gray-600 font-medium">Loading School Information...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait while we fetch the data</p>
          </Box>
        </Box>
      </Box>
    );
  }

  const displaySubjects = getSubjectsData(schoolInfo?.subjects);
  const displayDepartments = getDepartmentsData(schoolInfo?.departments);
  const displayFeesDistribution = schoolInfo?.feesDistribution || {};

  return (
    <>
      <style jsx global>{`
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
      `}</style>
      
      <Toaster position="top-right" richColors />
      
      <Backdrop
        sx={{ color: '#fff', zIndex: 9999 }}
        open={fetching}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Box sx={{ mt: 2 }}>
            <p className="text-white font-medium">
              {fetching ? 'Processing...' : 'Loading...'}
            </p>
          </Box>
        </Box>
      </Backdrop>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 sm:mb-4">
          <div className="mb-3 lg:mb-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl shadow-lg">
                <FiHome className="text-white text-sm sm:text-lg w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-cyan-900 bg-clip-text text-transparent">
                  School Information
                </h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm">Manage your school details, admission information, and resources</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg font-medium text-xs sm:text-sm md:text-base w-full sm:w-auto"
            >
              <FiEdit3 className="w-3 h-3 sm:w-4 sm:h-4" />
              {schoolInfo ? 'Edit Information' : 'Create Information'}
            </button>
            
            {schoolInfo && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg font-medium text-xs sm:text-sm md:text-base w-full sm:w-auto"
              >
                <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Delete All
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid - Fixed elongated cards */}
        {schoolInfo && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <StatsCard
              icon={FiUsers}
              label="Total Students"
              value={schoolInfo.studentCount?.toLocaleString() || '0'}
              color="from-blue-500 to-cyan-500"
            />
            <StatsCard
              icon={FiUser}
              label="Staff Members"
              value={schoolInfo.staffCount?.toLocaleString() || '0'}
              color="from-purple-500 to-pink-500"
            />
            <StatsCard
              icon={FiDollarSign}
              label="Boarding Fees"
              value={`KES ${schoolInfo.feesBoarding?.toLocaleString() || '0'}`}
              color="from-green-500 to-teal-500"
            />
            <StatsCard
              icon={FiDollarSign}
              label="Day Fees"
              value={`KES ${schoolInfo.feesDay?.toLocaleString() || '0'}`}
              color="from-orange-500 to-red-500"
            />
          </div>
        )}

        {schoolInfo ? (
          <>
            {/* Media Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Video Tour */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FiVideo className="text-blue-500" />
                  School Video Tour
                </h3>
                <VideoPlayer 
                  videoTour={schoolInfo.videoTour} 
                  videoType={schoolInfo.videoType} 
                />
              </div>

              {/* Curriculum PDF */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FiBook className="text-green-500" />
                  Curriculum
                </h3>
                <PDFViewer curriculumPDF={schoolInfo.curriculumPDF} />
              </div>
            </div>

            {/* Subjects & Departments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Subjects */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FiBook className="text-purple-500" />
                  Subjects ({displaySubjects.length})
                </h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {displaySubjects.length > 0 ? (
                    displaySubjects.map((subject, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs sm:text-sm">No subjects added yet</p>
                  )}
                </div>
              </div>

              {/* Departments */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FiAward className="text-orange-500" />
                  Departments ({displayDepartments.length})
                </h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {displayDepartments.length > 0 ? (
                    displayDepartments.map((department, index) => {
                      const deptName = typeof department === 'object' ? department.name : department;
                      return (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium"
                        >
                          {deptName}
                        </span>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-xs sm:text-sm">No departments added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Admission Information */}
            {schoolInfo.admissionOpenDate && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                  <FiUserCheck className="text-blue-500" />
                  Admission Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                    <p className="text-blue-800 font-semibold text-xs sm:text-sm mb-1 sm:mb-2">Admission Period</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600">
                      {new Date(schoolInfo.admissionOpenDate).toLocaleDateString()} - {new Date(schoolInfo.admissionCloseDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {schoolInfo.admissionFee && (
                    <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
                      <p className="text-green-800 font-semibold text-xs sm:text-sm mb-1 sm:mb-2">Admission Fee</p>
                      <p className="text-base sm:text-lg md:text-xl font-bold text-green-600">
                        KES {schoolInfo.admissionFee?.toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  {schoolInfo.admissionCapacity && (
                    <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
                      <p className="text-purple-800 font-semibold text-xs sm:text-sm mb-1 sm:mb-2">Admission Capacity</p>
                      <p className="text-base sm:text-lg md:text-xl font-bold text-purple-600">
                        {schoolInfo.admissionCapacity?.toLocaleString()} Students
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Fee Distribution */}
            {Object.keys(displayFeesDistribution).length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FiDollarSign className="text-green-500" />
                  Fee Distribution
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {Object.entries(displayFeesDistribution).map(([category, amount], index) => (
                    <div key={index} className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
                      <p className="text-green-800 font-semibold text-xs sm:text-sm capitalize truncate">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-base sm:text-lg md:text-xl font-bold text-green-600 truncate">
                        KES {amount?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Academic Calendar */}
            {schoolInfo.openDate && schoolInfo.closeDate && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                  <FiCalendar className="text-cyan-500" />
                  Academic Calendar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="text-center p-3 sm:p-4 md:p-6 bg-cyan-50 rounded-lg sm:rounded-xl border border-cyan-200">
                    <FiCalendar className="text-cyan-500 text-lg sm:text-xl md:text-2xl lg:text-3xl mx-auto mb-2 sm:mb-3" />
                    <p className="text-cyan-800 font-semibold text-xs sm:text-sm">Opening Date</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-cyan-600 mt-1 sm:mt-2">
                      {new Date(schoolInfo.openDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-4 md:p-6 bg-red-50 rounded-lg sm:rounded-xl border border-red-200">
                    <FiCalendar className="text-red-500 text-lg sm:text-xl md:text-2xl lg:text-3xl mx-auto mb-2 sm:mb-3" />
                    <p className="text-red-800 font-semibold text-xs sm:text-sm">Closing Date</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-red-600 mt-1 sm:mt-2">
                      {new Date(schoolInfo.closeDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 sm:p-8 md:p-16 text-center">
            <div className="text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4 md:mb-6">🏫</div>
            <h3 className="text-base sm:text-lg md:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">No School Information Found</h3>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto">
              Set up your school information to showcase your institution to students and parents.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg sm:rounded-xl md:rounded-2xl px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto text-xs sm:text-sm md:text-base"
            >
              <FiPlus /> Create School Information
            </button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {isEditing && (
        <SchoolInfoEditDialog
          schoolInfo={schoolInfo}
          onSave={() => {
            setIsEditing(false);
            fetchSchoolInfo();
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
}