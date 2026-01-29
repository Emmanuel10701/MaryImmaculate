'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  FaBriefcase, FaPlus, FaCalendar, FaUsers, FaGraduationCap, 
  FaClock, FaFilter, FaChevronLeft, FaChevronRight,
  FaBuilding, FaUserTie, FaStethoscope, FaEnvelope, FaPhone, 
  FaBookOpen, FaLaptopCode, FaCalculator, FaFlask,
  FaRocket, FaSparkles, FaMagic, FaPalette, FaGem,FaUserNurse,
FaHardHa,  FaChartLine, FaTrendingUp, FaAward, FaStar, FaCrown,
  FaLightbulb, FaBrain, FaHandshake, FaHeart,
  FaLock, FaGlobe, FaCloudUpload, FaArrowRight,
  FaRegHeart, FaHeartbeat, FaFire, FaBolt,
  FaRegClock, FaCalendarCheck, FaUserFriends, 
  FaUserPlus, FaUserCheck, FaRoute, FaDirections, 
  FaChartBar, FaChartPie, FaChartArea, FaQrcode, 
  FaFingerprint, FaIdCard, FaDesktop,
  FaMagicWandSparkles, FaWandMagicSparkles
} from 'react-icons/fa6';
import { 
  FaEdit, FaTrash, FaSearch, FaSync, FaCheckCircle, 
  FaTimesCircle, FaTools, FaHistory, FaChalkboardTeacher, 
  FaFileAlt, FaExternalLinkAlt, FaShieldAlt, FaExpandAlt, 
  FaCompressAlt, FaMapMarkerAlt, FaMobileAlt, FaTabletAlt 
} from 'react-icons/fa';


import { CircularProgress, Modal, Box, TextField, TextareaAutosize } from '@mui/material';


const ModernLoadingSpinner = ({ message = "Loading", size = "medium" }) => {
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // 👈 FULL SCREEN CENTER
        width: "100%",
        gap: "20px",
      }}
    >
      <CircularProgress
        size={sizeMap[size]}
        style={{ color: "#3b82f6" }}
      />

      <div
        style={{
          fontSize: "14px",
          color: "#6b7280",
          fontWeight: 500,
          letterSpacing: "0.5px",
          textAlign: "center",
          maxWidth: "250px",
          lineHeight: 1.6,
        }}
      >
        {message}
      </div>
    </div>
  );
};



// Modern Job Card Component
function ModernJobCard({ job, onEdit, onDelete, onView }) {
  const getJobTypeColor = (type) => {
    switch(type) {
      case 'full-time': return 'from-emerald-500 to-green-600';
      case 'part-time': return 'from-blue-500 to-cyan-600';
      case 'contract': return 'from-purple-500 to-pink-600';
      case 'internship': return 'from-amber-500 to-orange-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'teaching': return <FaChalkboardTeacher />;
      case 'administrative': return <FaUserTie />;
      case 'support staff': return <FaTools />;
      case 'medical': return <FaStethoscope />;
      case 'academic': return <FaBookOpen />;
      case 'technical': return <FaLaptopCode />;
      case 'accounting': return <FaCalculator />;
      case 'science': return <FaFlask />;
      default: return <FaBriefcase />;
    }
  };

  const isDeadlinePassed = new Date(job.applicationDeadline) < new Date();
  const daysLeft = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
              <div className="relative p-3 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getCategoryIcon(job.category)}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1.5">{job.jobTitle}</h3>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  <FaBuilding className="text-gray-400" /> {job.department}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  {job.category}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(job)}
              className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg border border-blue-200 shadow-sm"
            >
              <FaExpandAlt />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`px-4 py-1.5 bg-gradient-to-r ${getJobTypeColor(job.jobType)} text-white rounded-full text-xs font-bold shadow-sm`}>
            {job.jobType.replace('-', ' ').toUpperCase()}
          </span>
          <span className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
            <FaUsers /> {job.positionsAvailable} position{job.positionsAvailable > 1 ? 's' : ''}
          </span>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 ${
            isDeadlinePassed 
              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
              : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
          }`}>
            <FaCalendar /> 
            {isDeadlinePassed ? 'Closed' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
          {job.jobDescription.substring(0, 120)}...
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <FaGraduationCap className="text-gray-400 text-sm" />
              <span className="text-xs font-medium text-gray-500">Experience</span>
            </div>
            <span className="text-sm  text-gray-900">{job.experience}</span>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <FaClock className="text-gray-400 text-sm" />
              <span className="text-xs font-medium text-gray-500">Posted</span>
            </div>
            <span className="text-sm  text-gray-900">
              {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(job)}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-bold text-sm shadow flex items-center gap-2"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => onDelete(job)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold text-sm shadow flex items-center gap-2"
            >
              <FaTrash /> Delete
            </button>
          </div>
          <button
            onClick={() => onView(job)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-sm shadow flex items-center gap-2"
          >
            View Details <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// Modern Job Modal Component
function ModernJobModal({ open, onClose, onSave, job, loading }) {
  const [formData, setFormData] = useState({
    jobTitle: job?.jobTitle || '',
    department: job?.department || '',
    category: job?.category || '',
    jobDescription: job?.jobDescription || '',
    requirements: job?.requirements || '',
    experience: job?.experience || '',
    qualifications: job?.qualifications || '',
    positionsAvailable: job?.positionsAvailable?.toString() || '1',
    jobType: job?.jobType || 'full-time',
    applicationDeadline: job?.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
    contactEmail: job?.contactEmail || '',
    contactPhone: job?.contactPhone || '',
  });

  const jobTypes = [
    { value: 'full-time', label: 'Full Time', color: 'from-emerald-500 to-green-600' },
    { value: 'part-time', label: 'Part Time', color: 'from-blue-500 to-cyan-600' },
    { value: 'contract', label: 'Contract', color: 'from-purple-500 to-pink-600' },
    { value: 'internship', label: 'Internship', color: 'from-amber-500 to-orange-600' }
  ];

const categories = [
  { value: 'Teaching', icon: <FaChalkboardTeacher /> },
  { value: 'Administrative', icon: <FaUserTie /> },
  { value: 'Support Staff', icon: <FaTools /> },
  { value: 'Medical', icon: <FaStethoscope /> },
  { value: 'Academic', icon: <FaBookOpen /> },
  { value: 'Technical', icon: <FaLaptopCode /> },
  { value: 'Accounting', icon: <FaCalculator /> },
  { value: 'Science', icon: <FaFlask /> }
];

  const departments = [
    'Primary School', 'High School', 'Administration', 'Finance', 
    'IT', 'Maintenance', 'Medical', 'Library', 'Sports', 'Arts', 'Music',"security","Cafeteria", 'Cooking', 'Transportation',"Cleaning","farming"
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.jobTitle.trim()) {
      toast.error('Job title is required');
      return;
    }
    
    if (!formData.applicationDeadline) {
      toast.error('Application deadline is required');
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      toast.error(error.message || 'Failed to save job');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95%',
        maxWidth: '900px',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: '20px',
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        {/* Modern Header with Gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-20"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <FaBriefcase className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{job ? 'Edit Job Listing' : 'Create New Job'}</h2>
                  <p className="text-blue-100 opacity-90 text-sm mt-1">
                    {job ? 'Update existing opportunity' : 'Add new career position'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2.5 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaTimesCircle className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(90vh-100px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title & Department Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-red-500">*</span> Job Title
                </label>
                <TextField 
                  fullWidth 
                  size="medium"
                  value={formData.jobTitle} 
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  placeholder="e.g., Senior Mathematics Teacher" 
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f9fafb',
                      fontSize: '0.95rem',
                      fontWeight: '500'
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                <div className="relative">
                  <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Category & Job Type Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((categories) => (
                    <button
                      key={categories.value}
                      type="button"
                      onClick={() => handleChange('category', categories.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.category === categories.value
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="text-xl mb-">
                        {categories.icon}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{categories.value}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Job Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {jobTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleChange('jobType', type.value)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        formData.jobType === type.value
                          ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                          : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <span className="text-xs font-bold">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Positions & Deadline Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUsers /> Positions Available
                </label>
                <TextField 
                  fullWidth 
                  size="medium"
                  type="number"
                  min="1"
                  value={formData.positionsAvailable} 
                  onChange={(e) => handleChange('positionsAvailable', e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f9fafb',
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendar /> Application Deadline
                </label>
                <TextField 
                  fullWidth 
                  size="medium"
                  type="date"
                  value={formData.applicationDeadline} 
                  onChange={(e) => handleChange('applicationDeadline', e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f9fafb',
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
              <label className=" text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaFileAlt className="text-blue-600" /> Job Description
              </label>
              <TextareaAutosize 
                minRows={4} 
                value={formData.jobDescription} 
                onChange={(e) => handleChange('jobDescription', e.target.value)}
                placeholder="Describe the role, responsibilities, and impact..."
                className="w-full p-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white font-medium text-sm"
                required
              />
            </div>

            {/* Requirements */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-5 border border-emerald-200">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaShieldAlt className="text-emerald-600" /> Requirements
              </label>
              <TextareaAutosize 
                minRows={4} 
                value={formData.requirements} 
                onChange={(e) => handleChange('requirements', e.target.value)}
                placeholder="List specific requirements, skills, and expectations..."
                className="w-full p-4 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white font-medium text-sm"
                required
              />
            </div>

            {/* Experience & Qualifications Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
                <label className=" text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaGraduationCap className="text-purple-600" /> Required Experience
                </label>
                <TextField 
                  fullWidth 
                  size="medium"
                  value={formData.experience} 
                  onChange={(e) => handleChange('experience', e.target.value)}
                  placeholder="e.g., 3+ years teaching experience"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-5 border border-pink-200">
                <label className=" text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaAward className="text-pink-600" /> Qualifications
                </label>
                <TextareaAutosize 
                  minRows={4} 
                  value={formData.qualifications} 
                  onChange={(e) => handleChange('qualifications', e.target.value)}
                  placeholder="Required education, certifications, training..."
                  className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none bg-white font-medium text-sm"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
              <label className=" text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaEnvelope className="text-gray-600" /> Contact Information
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Contact Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                      placeholder="careers@school.edu"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Contact Phone</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange('contactPhone', e.target.value)}
                      placeholder="+254 700 000 000"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <span className="font-bold">Required fields marked with *</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} className="text-white" />
                      <span>{job ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-lg" />
                      <span>{job ? 'Update Job' : 'Create Job'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}

// Modern Job Details Modal
function ModernJobDetailsModal({ open, onClose, job }) {
  if (!job) return null;

  const getJobTypeColor = (type) => {
    switch(type) {
      case 'full-time': return 'from-emerald-500 to-green-600';
      case 'part-time': return 'from-blue-500 to-cyan-600';
      case 'contract': return 'from-purple-500 to-pink-600';
      case 'internship': return 'from-amber-500 to-orange-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const isDeadlinePassed = new Date(job.applicationDeadline) < new Date();
  const daysLeft = Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95%',
        maxWidth: '900px',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: '20px',
        boxShadow: 24,
        overflow: 'hidden',
      }}>
        {/* Modern Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          <div className="relative p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <FaBriefcase className="text-3xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{job.jobTitle}</h2>
                  <p className="text-blue-100 opacity-90 text-lg mt-2">
                    {job.department} • {job.category}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaTimesCircle className="text-2xl" />
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <span className={`px-6 py-2.5 bg-gradient-to-r ${getJobTypeColor(job.jobType)} text-white rounded-full text-sm font-bold shadow-lg`}>
                {job.jobType.replace('-', ' ').toUpperCase()}
              </span>
              <span className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <FaUsers /> {job.positionsAvailable} position{job.positionsAvailable > 1 ? 's' : ''}
              </span>
              <span className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 ${
                isDeadlinePassed 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              }`}>
                <FaCalendar /> 
                {isDeadlinePassed ? 'CLOSED' : `Apply in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-8">
          <div className="space-y-8">
            {/* Experience & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                    <FaGraduationCap className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-700">Experience Required</h3>
                    <p className="text-md  text-gray-900">{job.experience}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white">
                    <FaCalendar className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-700">Application Deadline</h3>
                    <p className="text-md  text-gray-900">
                      {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-white">
                    <FaClock className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-700">Posted Date</h3>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                  <FaFileAlt />
                </div>
                Job Description
              </h3>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.jobDescription}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg text-white">
                  <FaShieldAlt />
                </div>
                Requirements
              </h3>
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border border-emerald-200">
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white">
                  <FaAward />
                </div>
                Qualifications
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border border-purple-200">
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.qualifications}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {(job.contactEmail || job.contactPhone) && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white">
                    <FaEnvelope />
                  </div>
                  Contact Information
                </h3>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-2xl p-6 border border-cyan-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {job.contactEmail && (
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <FaEnvelope className="text-cyan-600 text-xl" />
                          <h4 className="font-bold text-gray-900">Email</h4>
                        </div>
                        <a href={`mailto:${job.contactEmail}`} className="text-cyan-600 hover:text-cyan-800 font-medium">
                          {job.contactEmail}
                        </a>
                      </div>
                    )}
                    {job.contactPhone && (
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <FaPhone className="text-blue-600 text-xl" />
                          <h4 className="font-bold text-gray-900">Phone</h4>
                        </div>
                        <a href={`tel:${job.contactPhone}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {job.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    <FaRegClock className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Posted</p>
                    <p className="font-bold text-gray-900">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    <FaHistory className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-bold text-gray-900">
                      {new Date(job.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Modern Delete Confirmation Modal
function ModernDeleteConfirmationModal({ open, onClose, onConfirm, job, loading }) {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4 ${open ? '' : 'hidden'}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
        {/* Gradient Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-red-600"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <FaTrash className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Confirm Deletion</h2>
                <p className="text-red-100 opacity-90 text-sm mt-0.5">Permanent action - Cannot be undone</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-300">
              <FaTrash className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Job Listing?</h3>
            <p className="text-gray-600 text-sm mb-4">
              You are about to delete the job <span className="font-bold text-gray-900">"{job?.jobTitle}"</span>. This will permanently remove it from the system.
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
            <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <FaTimesCircle className="text-red-600" />
              What will be deleted:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                <span>Job Title: <span className="font-bold">{job?.jobTitle}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                <span>Department: <span className="font-bold">{job?.department}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                <span>All job details and requirements</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <CircularProgress size={16} className="text-white" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <FaTrash /> Delete Job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Modern Careers Component
export default function ModernCareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [jobType, setJobType] = useState('');

  const categories = ['Teaching', 'Administrative', 'Support Staff', 'Medical', 'Academic', 'Technical', 'Accounting', 'Science'];
  const departments = ['Primary School', 'High School', 'Administration', 'Finance', 'IT', 'Maintenance', 'Medical', 'Library', 'Sports'];
  const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];

  useEffect(() => {
    loadJobs();
  }, [pagination.page, search, category, department, jobType]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (department) params.append('department', department);
      if (jobType) params.append('jobType', jobType);
      
      const response = await fetch(`/api/career?${params}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (formData) => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create job');
      }
      
      toast.success('🎉 Job created successfully!');
      setShowJobModal(false);
      loadJobs();
    } catch (error) {
      toast.error(error.message || 'Failed to create job');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateJob = async (formData) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/career/${selectedJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update job');
      }
      
      toast.success('✨ Job updated successfully!');
      setShowJobModal(false);
      setSelectedJob(null);
      loadJobs();
    } catch (error) {
      toast.error(error.message || 'Failed to update job');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/career/${selectedJob.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete job');
      }
      
      toast.success('🗑️ Job deleted successfully!');
      setShowDeleteModal(false);
      setSelectedJob(null);
      loadJobs();
    } catch (error) {
      toast.error(error.message || 'Failed to delete job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setDepartment('');
    setJobType('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

if (loading && jobs.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center">
        <CircularProgress size={48} />

        <p className="text-gray-700 text-lg mt-4 font-medium">
          Loading Career Opportunities…
        </p>

        <p className="text-gray-400 text-sm mt-1">
          Please wait while we fetch career opportunities
        </p>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <Toaster position="top-right" richColors />

      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-30"></div>
        <div className="relative p-8 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <FaBriefcase className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">Career Management</h1>
                  <p className="text-blue-100 opacity-90 text-lg mt-2">Manage job opportunities and positions</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <FaUsers className="text-blue-200" />
                  <span className="font-bold">{pagination.total} Total Jobs</span>
                </span>
                <span className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <FaBuilding className="text-purple-200" />
                  <span className="font-bold">{[...new Set(jobs.map(job => job.department))].length} Departments</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={loadJobs} className="px-5 py-2.5 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl font-bold flex items-center gap-2">
                <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
              
              <button 
                onClick={() => {
                  setSelectedJob(null);
                  setShowJobModal(true);
                }} 
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2"
              >
                <FaPlus /> Create New Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filters Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Job Listings</h2>
            <p className="text-gray-600 text-sm">Filter and search through available positions</p>
          </div>
          <div className="text-lg font-bold text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Search Jobs</label>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, department..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
            <div className="relative">
              <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
            <div className="relative">
              <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
              >
                <option value="">All Job Types</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleResetFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-bold flex items-center gap-2"
          >
            <FaTimesCircle /> Clear All Filters
          </button>
          <div className="text-sm text-gray-600">
            Showing {jobs.length} of {pagination.total} jobs
          </div>
        </div>
      </div>

      {/* Modern Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-200">
            <FaBriefcase className="w-10 h-10 text-gradient-to-r from-blue-600 to-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Job Listings Found</h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            {search || category || department || jobType 
              ? 'No jobs match your current filters. Try adjusting your search criteria.'
              : 'Start by creating your first job listing to attract talent to your institution.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleResetFilters}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold"
            >
              Clear Filters
            </button>
            <button 
              onClick={() => {
                setSelectedJob(null);
                setShowJobModal(true);
              }} 
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <FaPlus /> Create First Job
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Modern Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map(job => (
              <ModernJobCard
                key={job.id}
                job={job}
                onEdit={handleEditJob}
                onDelete={handleDeleteClick}
                onView={handleViewJob}
              />
            ))}
          </div>

          {/* Modern Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-gray-600">
                  Showing <span className="font-bold text-gray-900">{((pagination.page - 1) * pagination.limit) + 1}</span>-
                  <span className="font-bold text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of 
                  <span className="font-bold text-gray-900"> {pagination.total}</span> jobs
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="p-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold ${
                            pagination.page === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="p-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showJobModal && (
        <ModernJobModal
          open={showJobModal}
          onClose={() => {
            setShowJobModal(false);
            setSelectedJob(null);
          }}
          onSave={selectedJob ? handleUpdateJob : handleCreateJob}
          job={selectedJob}
          loading={actionLoading}
        />
      )}

      {showDetailsModal && (
        <ModernJobDetailsModal
          open={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
        />
      )}

      {showDeleteModal && (
        <ModernDeleteConfirmationModal
          open={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedJob(null);
          }}
          onConfirm={handleDeleteJob}
          job={selectedJob}
          loading={actionLoading}
        />
      )}
    </div>
  );
}