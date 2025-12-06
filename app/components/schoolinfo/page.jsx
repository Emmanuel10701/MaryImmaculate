'use client';
import { useState, useEffect, useRef } from 'react';
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
  FiAward
} from 'react-icons/fi';

// Helper function to safely handle departments data
const getDepartmentsData = (departments) => {
  if (!departments) return [];
  
  if (Array.isArray(departments)) {
    // Handle both department objects and department strings
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
// Helper function to safely handle subjects data
const getSubjectsData = (subjects) => {
  if (!subjects) return [];
  return Array.isArray(subjects) ? subjects : [];
};

// Video Player Component
const VideoPlayer = ({ videoTour, videoType }) => {
  if (!videoTour) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FiVideo className="text-4xl mx-auto mb-2" />
          <p>No video available</p>
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
        <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FiVideo className="text-4xl mx-auto mb-2" />
            <p>Invalid YouTube URL</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black">
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
    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black">
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

// PDF Viewer Component
const PDFViewer = ({ curriculumPDF }) => {
  if (!curriculumPDF) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FiFileText className="text-4xl mx-auto mb-2" />
          <p>No curriculum PDF available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white">
      <div className="text-center">
        <FiFileText className="text-4xl text-blue-500 mx-auto mb-3" />
        <p className="text-gray-700 font-medium mb-2">Curriculum PDF</p>
        <div className="flex gap-2 justify-center">
          <a
            href={curriculumPDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
          >
            <FiFileText size={16} />
            View PDF
          </a>
          <a
            href={curriculumPDF}
            download
            className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
          >
            <FiUpload size={16} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

// Stats Cards Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl text-white shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
        <Icon className="text-xl" />
      </div>
    </div>
  </div>
);

// Custom File Upload Component
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
        alert(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
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
        className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white/80 hover:bg-white"
      >
        <FiUpload className="mx-auto text-gray-400 text-2xl mb-3" />
        <p className="text-gray-600 font-medium mb-1">
          {currentFile ? currentFile.name : placeholder}
        </p>
        <p className="text-gray-400 text-sm">
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

// Edit Dialog Component
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
    curriculumPDF: null
  });
  const [isSaving, setIsSaving] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [feeItems, setFeeItems] = useState([]);

  useEffect(() => {
    if (schoolInfo) {
      // Initialize form with existing school info
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
        departments: getDepartmentsData(schoolInfo.departments)
      };
      
      setFormData(initialData);
      
      // Initialize fee items from existing distribution
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
    } else {
      // Initialize empty form for new school
      setFormData({
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
        curriculumPDF: null
      });
      setFeeItems([]);
    }
  }, [schoolInfo]);

  const handleAddSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !formData.departments.includes(newDepartment.trim())) {
      setFormData(prev => ({
        ...prev,
        departments: [...prev.departments, newDepartment.trim()]
      }));
      setNewDepartment('');
    }
  };

  const handleRemoveDepartment = (department) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d !== department)
    }));
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
    // Validation
    if (!formData.name.trim()) {
      alert('School name is required');
      return;
    }

    if (!formData.studentCount || parseInt(formData.studentCount) < 0) {
      alert('Student count must be a positive number');
      return;
    }

    if (!formData.staffCount || parseInt(formData.staffCount) < 0) {
      alert('Staff count must be a positive number');
      return;
    }

    if (!formData.feesBoarding || parseFloat(formData.feesBoarding) < 0) {
      alert('Boarding fees must be a positive number');
      return;
    }

    if (!formData.feesDay || parseFloat(formData.feesDay) < 0) {
      alert('Day fees must be a positive number');
      return;
    }

    if (!formData.openDate || !formData.closeDate) {
      alert('Opening and closing dates are required');
      return;
    }

    if (new Date(formData.openDate) >= new Date(formData.closeDate)) {
      alert('Opening date must be before closing date');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare fee distribution as a simple object
      const feesDistribution = {};
      feeItems.forEach(item => {
        if (item.name.trim() && item.amount && parseFloat(item.amount) > 0) {
          feesDistribution[item.name] = parseFloat(item.amount);
        }
      });

      const submitData = new FormData();
      
      // Append basic fields
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

      // Handle video - YouTube link takes priority
      if (formData.youtubeLink.trim()) {
        submitData.append('youtubeLink', formData.youtubeLink.trim());
      } else if (formData.videoTour) {
        submitData.append('videoTour', formData.videoTour);
      }

      // Handle curriculum PDF
      if (formData.curriculumPDF) {
        submitData.append('curriculumPDF', formData.curriculumPDF);
      }

      const response = await fetch('/api/school', {
        method: schoolInfo ? 'PUT' : 'POST',
        body: submitData,
      });

      const result = await response.json();
      if (result.success) {
        onSave();
        alert(
          schoolInfo ? 'School information updated successfully!' : 'School information created successfully!'
        );
      } else {
        alert(result.error || 'An error occurred while saving');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Network error: Could not save school information');
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
      // Clear YouTube link if uploading a video file
      if (field === 'videoTour') {
        updateField('youtubeLink', '');
      }
    }
  };

  const handleYouTubeLinkChange = (link) => {
    updateField('youtubeLink', link);
    // Clear video file if setting YouTube link
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {schoolInfo ? 'Edit School Information' : 'Create School Information'}
              </h2>
              <p className="text-blue-100 opacity-90">
                {schoolInfo ? 'Update your school details and information' : 'Set up your school information to get started'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  School Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                  placeholder="Enter school name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 resize-none"
                  placeholder="Describe your school's mission, values, and unique features..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Student Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.studentCount}
                    onChange={(e) => updateField('studentCount', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Staff Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.staffCount}
                    onChange={(e) => updateField('staffCount', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Boarding Fees (KES) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.feesBoarding}
                    onChange={(e) => updateField('feesBoarding', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Day Fees (KES) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.feesDay}
                    onChange={(e) => updateField('feesDay', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Opening Date *
                  </label>
                  <input
                    type="date"
                    value={formData.openDate}
                    onChange={(e) => updateField('openDate', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Closing Date *
                  </label>
                  <input
                    type="date"
                    value={formData.closeDate}
                    onChange={(e) => updateField('closeDate', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Media & Lists */}
            <div className="space-y-6">
              {/* Video Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  School Video Tour
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      YouTube Link
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeLink}
                      onChange={(e) => handleYouTubeLinkChange(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="text-center text-gray-500 text-sm font-medium">OR</div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
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
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
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

              {/* Subjects */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Subjects ({formData.subjects.length})
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddSubject)}
                    className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                    placeholder="Add a subject"
                  />
                  <button
                    onClick={handleAddSubject}
                    disabled={!newSubject.trim()}
                    className="bg-green-500 text-white p-2 rounded-2xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {formData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {subject}
                      <button
                        onClick={() => handleRemoveSubject(subject)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Departments */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Departments ({formData.departments.length})
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddDepartment)}
                    className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                    placeholder="Add a department"
                  />
                  <button
                    onClick={handleAddDepartment}
                    disabled={!newDepartment.trim()}
                    className="bg-purple-500 text-white p-2 rounded-2xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {formData.departments.map((department, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {department}
                      <button
                        onClick={() => handleRemoveDepartment(department)}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fee Distribution Section */}
          <div className="mt-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Fee Distribution Breakdown
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Break down your fees into specific categories and amounts
                </p>
              </div>
              <button
                onClick={handleAddFeeItem}
                className="bg-orange-500 text-white px-4 py-2 rounded-2xl hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <FiPlus size={16} />
                Add Fee Item
              </button>
            </div>
            
            <div className="space-y-3">
              {feeItems.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateFeeItem(index, 'name', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-2xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                      placeholder="Fee item name (e.g., Tuition, Accommodation)"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.amount}
                      onChange={(e) => handleUpdateFeeItem(index, 'amount', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-2xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80"
                      placeholder="Amount"
                    />
                  </div>
                  <div className="col-span-3">
                    <button
                      onClick={() => handleRemoveFeeItem(index)}
                      className="w-full bg-red-500 text-white p-2 rounded-2xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiTrash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              {feeItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FiDollarSign className="text-3xl mx-auto mb-2 opacity-50" />
                  <p>No fee items added yet. Click "Add Fee Item" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-8 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100/80">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-8 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-2xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 bg-white shadow-lg hover:shadow-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl px-8 py-3 font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      </div>
    </div>
  );
};

// Main Component
export default function SchoolInfoTab() {
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchoolInfo();
  }, []);

  const fetchSchoolInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school');
      const result = await response.json();
      
      if (result.success && result.school) {
        setSchoolInfo(result.school);
      } else {
        setSchoolInfo(null);
      }
    } catch (error) {
      console.error('Error fetching school info:', error);
      alert('Error loading school information');
      setSchoolInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete all school information? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/school', { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
          setSchoolInfo(null);
          alert('School information deleted successfully!');
        } else {
          alert(result.error || 'Error deleting school information');
        }
      } catch (error) {
        alert('Error deleting school information');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 text-lg">Loading school information...</p>
        </div>
      </div>
    );
  }

  // Safely get data for display
  const displaySubjects = getSubjectsData(schoolInfo?.subjects);
  const displayDepartments = getDepartmentsData(schoolInfo?.departments);
  const displayFeesDistribution = schoolInfo?.feesDistribution || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            <div className="lg:col-span-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                {schoolInfo ? schoolInfo.name : 'School Information'}
              </h1>
              <p className="text-cyan-100 text-lg sm:text-xl opacity-90 mb-6">
                {schoolInfo ? schoolInfo.description || 'Manage your school information and details' : 'Set up your school information to get started'}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-white/20 backdrop-blur-sm text-white rounded-2xl px-6 py-4 font-bold hover:bg-white/30 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 text-lg border border-white/20"
              >
                <FiEdit3 />
                {schoolInfo ? 'Edit Information' : 'Create Information'}
              </button>
              
              {schoolInfo && (
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500/20 backdrop-blur-sm text-red-100 rounded-2xl px-6 py-4 font-bold hover:bg-red-500/30 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 text-lg border border-red-500/20"
                >
                  <FiTrash2 />
                  Delete All
                </button>
              )}
            </div>
          </div>
        </div>

        {schoolInfo ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video Tour */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <FiVideo className="text-blue-500" />
                  School Video Tour
                </h3>
                <VideoPlayer 
                  videoTour={schoolInfo.videoTour} 
                  videoType={schoolInfo.videoType} 
                />
              </div>

              {/* Curriculum PDF */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <FiBook className="text-green-500" />
                  Curriculum
                </h3>
                <PDFViewer curriculumPDF={schoolInfo.curriculumPDF} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subjects */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <FiBook className="text-purple-500" />
                  Subjects ({displaySubjects.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {displaySubjects.length > 0 ? (
                    displaySubjects.map((subject, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-2 rounded-xl text-sm font-medium"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No subjects added yet</p>
                  )}
                </div>
              </div>

              {/* Departments */}
        {/* Departments */}
<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6">
  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
    <FiAward className="text-orange-500" />
    Departments ({displayDepartments.length})
  </h3>
  <div className="flex flex-wrap gap-2">
    {displayDepartments.length > 0 ? (
      displayDepartments.map((department, index) => {
        // Handle both string and object departments
        const deptName = typeof department === 'object' ? department.name : department;
        return (
          <span
            key={index}
            className="bg-orange-100 text-orange-800 px-3 py-2 rounded-xl text-sm font-medium"
          >
            {deptName}
          </span>
        );
      })
    ) : (
      <p className="text-gray-500 text-sm">No departments added yet</p>
    )}
  </div>
</div>
            </div>

            {/* Fee Distribution Display */}
            {Object.keys(displayFeesDistribution).length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <FiDollarSign className="text-green-500" />
                  Fee Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(displayFeesDistribution).map(([category, amount], index) => (
                    <div key={index} className="bg-green-50 rounded-2xl p-4 border border-green-200">
                      <p className="text-green-800 font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-2xl font-bold text-green-600">KES {amount?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Academic Calendar */}
            {schoolInfo.openDate && schoolInfo.closeDate && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FiCalendar className="text-cyan-500" />
                  Academic Calendar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-cyan-50 rounded-2xl border border-cyan-200">
                    <FiCalendar className="text-cyan-500 text-3xl mx-auto mb-3" />
                    <p className="text-cyan-800 font-semibold">Opening Date</p>
                    <p className="text-2xl font-bold text-cyan-600 mt-2">
                      {new Date(schoolInfo.openDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-200">
                    <FiCalendar className="text-red-500 text-3xl mx-auto mb-3" />
                    <p className="text-red-800 font-semibold">Closing Date</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">
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
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-16 text-center">
            <div className="text-8xl mb-6">🏫</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No School Information Found</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Set up your school information to showcase your institution to students and parents.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl px-8 py-4 font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-2xl flex items-center gap-3 mx-auto text-lg"
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
            fetchSchoolInfo(); // Refresh data
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}