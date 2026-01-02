'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Toaster, toast as sooner } from 'sonner';
import { CircularProgress, Modal, Box } from '@mui/material';
import * as XLSX from 'xlsx';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar
} from 'recharts';

import { IoSparkles } from 'react-icons/io5';

import { 
  FiAlertCircle,
  FiTrash2,
  FiXCircle,
  FiUpload,
  FiUser,
  FiX,
  FiBook,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiEdit,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiTarget,
  FiSave,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiGrid,
  FiList,
  FiChevronUp,
  FiChevronDown,
  FiSettings,
  FiDownload,
  FiEye,
  FiArrowLeft,
  FiArrowRight,
  FiInfo,
  FiFile,
  FiUsers
} from 'react-icons/fi';

import { IoSchool } from 'react-icons/io5';
import { IoDocumentText } from 'react-icons/io5';

// Custom Toaster with increased size
const CustomToaster = () => (
  <Toaster
    position="top-right"
    richColors
    expand={true}
    toastOptions={{
      style: {
        fontSize: '1.1rem',
        padding: '20px',
        margin: '10px',
        width: '140%',
        minHeight: '80px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      },
      className: 'custom-toast'
    }}
  />
);

// Modern Loading Spinner
function ModernLoadingSpinner({ message = "Loading student data...", size = "medium" }) {
  const sizes = {
    small: { outer: 48, inner: 24 },
    medium: { outer: 64, inner: 32 },
    large: { outer: 80, inner: 40 }
  }

  const { outer, inner } = sizes[size]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={5}
              className="text-indigo-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" style={{ width: inner, height: inner }}></div>
            </div>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-full blur-xl opacity-30"></div>
        </div>
        
        <div className="mt-8 space-y-3">
          <span className="block text-lg font-semibold text-gray-800">
            {message}
          </span>
          
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we fetch student records
          </p>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
function ModernDeleteModal({ 
  onClose, 
  onConfirm, 
  loading, 
  title = "Confirm Deletion",
  description = "This action cannot be undone",
  itemName = "",
  type = "student"
}) {
  const [confirmText, setConfirmText] = useState('')

  const getConfirmPhrase = () => {
    if (type === "batch") return "DELETE UPLOAD BATCH";
    if (type === "student") return "DELETE STUDENT";
    return "DELETE";
  }

  const handleConfirm = () => {
    const phrase = getConfirmPhrase();
    if (confirmText === phrase) {
      onConfirm()
    } else {
      sooner.error(`Please type "${phrase}" exactly to confirm deletion`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
              <FiAlertCircle className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-red-100 opacity-90 text-sm mt-1">{description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
              <FiTrash2 className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete {itemName ? `"${itemName}"` : `this ${type}`}?
            </h3>
            <p className="text-gray-600 text-sm">
              This will permanently delete the record and cannot be recovered.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              Type <span className="font-mono text-red-600 bg-red-50 px-3 py-1 rounded-lg text-xs border border-red-200">{getConfirmPhrase()}</span> to confirm:
            </label>
            <input 
              type="text" 
              value={confirmText} 
              onChange={(e) => setConfirmText(e.target.value)} 
              placeholder={`Type "${getConfirmPhrase()}" here`}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-base"
              autoFocus
            />
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200">
            <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
              <FiAlertCircle className="text-red-600 text-sm" />
              What will happen:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              {type === "batch" ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>All students from this upload batch will be deleted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Upload record will be removed from history</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Student record will be permanently deleted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>All associated data will be removed</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl transition-all duration-300 font-bold text-base disabled:opacity-50"
          >
            <FiXCircle className="text-base" /> Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={loading || confirmText !== getConfirmPhrase()}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white px-4 py-3 rounded-xl transition-all duration-300 font-bold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <CircularProgress size={14} className="text-white" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="text-base" /> Delete Forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// File Upload Component
function ModernFileUpload({ onFileSelect, file, onRemove, dragActive, onDrag }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validExtensions = ['.csv', '.xlsx', '.xls', '.xlsm'];
    
    if (selectedFile) {
      const ext = selectedFile.name.toLowerCase();
      if (validExtensions.some(valid => ext.endsWith(valid))) {
        onFileSelect(selectedFile);
        sooner.success('File selected successfully');
      } else {
        sooner.error('Please upload a CSV or Excel file');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={`border-3 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
        dragActive 
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 ring-4 ring-blue-100' 
          : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={(e) => {
        e.preventDefault();
        onDrag(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) handleFileChange({ target: { files } });
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <FiUpload className={`mx-auto text-3xl mb-4 ${
        dragActive ? 'text-blue-600' : 'text-gray-400'
      }`} />
      <p className="text-gray-800 mb-2 font-bold text-lg">
        {dragActive ? '📁 Drop file here!' : file ? 'Click to replace file' : 'Drag & drop or click to upload'}
      </p>
      <p className="text-sm text-gray-600">
        CSV, Excel (.xlsx, .xls) • Max 10MB
      </p>
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".csv,.xlsx,.xls,.xlsm"
        onChange={handleFileChange}
        className="hidden" 
      />
    </div>
  );
}

// Student Detail Modal
function ModernStudentDetailModal({ student, onClose, onEdit, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!student) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <>
  <Modal open={true} onClose={onClose}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '95vw',
      maxWidth: '960px',
      maxHeight: '92vh',
      bgcolor: 'background.paper',
      borderRadius: 3,
      boxShadow: 20,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    }}
  >
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <IoSchool className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Student Details</h2>
            <p className="text-xs text-blue-100 opacity-90">
              Complete student information
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/20 transition"
        >
          <FiX className="text-lg" />
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="max-h-[calc(92vh-64px)] overflow-y-auto p-6">
      {/* Profile */}
      <div className="flex flex-col md:flex-row items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center ring-2 ring-blue-100">
          <FiUser className="text-white text-2xl" />
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold text-gray-900">
            {student.firstName}{' '}
            {student.middleName ? student.middleName + ' ' : ''}
            {student.lastName}
          </h3>
          <p className="text-sm text-gray-600">
            Admission #{student.admissionNumber}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3 justify-center md:justify-start">
            <span
              className={`px-3 py-1 rounded-md text-xs font-medium text-white bg-gradient-to-r ${getFormColor(
                student.form
              )}`}
            >
              {student.form}
            </span>

            {student.stream && (
              <span className="px-3 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
                {student.stream}
              </span>
            )}

            <span
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                student.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {student.status}
            </span>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[
          {
            title: 'Academic Information',
            icon: <FiBook />,
            color: 'blue',
            items: [
              ['Form Level', student.form],
              ['Stream', student.stream || 'Not Assigned'],
              ['Status', student.status.toUpperCase()],
              ['Admission Date', formatDate(student.createdAt)],
            ],
          },
          {
            title: 'Personal Information',
            icon: <FiUser />,
            color: 'emerald',
            items: [
              ['Gender', student.gender || 'Not Specified'],
              ['Date of Birth', formatDate(student.dateOfBirth)],
              [
                'Age',
                `${calculateAge(student.dateOfBirth)} years`,
              ],
            ],
          },
        ].map(section => (
          <div
            key={section.title}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className={`text-${section.color}-600`}>
                {section.icon}
              </span>
              {section.title}
            </h4>

            <div className="space-y-2 text-sm">
              {section.items.map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between text-gray-700"
                >
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-200">
        <button
          onClick={onEdit}
          className="flex-1 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FiEdit className="inline mr-2" />
          Edit Student
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
        >
          <FiTrash2 className="inline mr-2" />
          Delete Student
        </button>
      </div>
    </div>
  </Box>
</Modal>


      {showDeleteModal && (
        <ModernDeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            onDelete(student.firstName + ' ' + student.lastName);
            setShowDeleteModal(false);
          }}
          loading={false}
          type="student"
          itemName={`${student.firstName} ${student.lastName}`}
        />
      )}
    </>
  );
}

// Student Edit Modal
function ModernStudentEditModal({ student, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    firstName: student?.firstName || '',
    middleName: student?.middleName || '',
    lastName: student?.lastName || '',
    admissionNumber: student?.admissionNumber || '',
    form: student?.form || 'Form 1',
    stream: student?.stream || '',
    gender: student?.gender || '',
    dateOfBirth: student?.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
    email: student?.email || '',
    parentPhone: student?.parentPhone || '',
    address: student?.address || '',
    status: student?.status || 'active'
  });

  const FORMS = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const STREAMS = ['A', 'B', 'C', 'D', 'E', 'East', 'West', 'North', 'South', 'Day', 'Boarding', 'Science', 'Arts', 'Commercial'];
  const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(student.id, formData);
  };

  return (
<Modal open={true} onClose={onClose}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '95vw',
      maxWidth: '880px',
      maxHeight: '92vh',
      bgcolor: 'background.paper',
      borderRadius: 3,
      boxShadow: 20,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    }}
  >
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <FiEdit className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Edit Student Information</h2>
            <p className="text-xs text-blue-100 opacity-90">
              Update student details
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/20 transition"
        >
          <FiX className="text-lg" />
        </button>
      </div>
    </div>

    {/* Form */}
    <div className="max-h-[calc(92vh-64px)] overflow-y-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['First Name *', 'firstName', 'text', true],
              ['Middle Name', 'middleName', 'text'],
              ['Last Name *', 'lastName', 'text', true],
            ].map(([label, key, type, required]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  required={required}
                  value={formData[key]}
                  onChange={e =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={e =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                {GENDERS.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={e =>
                  setFormData({
                    ...formData,
                    dateOfBirth: e.target.value,
                  })
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={e =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Full address"
              />
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Academic Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Admission Number *
              </label>
              <input
                type="text"
                required
                value={formData.admissionNumber}
                onChange={e =>
                  setFormData({
                    ...formData,
                    admissionNumber: e.target.value,
                  })
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                pattern="\d{4,10}"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Form *
              </label>
              <select
                required
                value={formData.form}
                onChange={e =>
                  setFormData({ ...formData, form: e.target.value })
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {FORMS.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Stream
              </label>
              <select
                value={formData.stream}
                onChange={e =>
                  setFormData({ ...formData, stream: e.target.value })
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Stream</option>
                {STREAMS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Status *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['active', 'inactive', 'graduated', 'transferred'].map(
                  status => (
                    <label
                      key={status}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-400 transition"
                    >
                      <input
                        type="radio"
                        value={status}
                        checked={formData.status === status}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            status: e.target.value,
                          })
                        }
                      />
                      <span className="text-sm capitalize">
                        {status}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Contact Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Parent / Guardian Phone
              </label>
              <input
                type="tel"
                value={formData.parentPhone}
                onChange={e =>
                  setFormData({
                    ...formData,
                    parentPhone: e.target.value,
                  })
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+254 700 000 000"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-sm font-semibold rounded-xl border border-gray-300 text-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <CircularProgress size={16} className="text-white" />
                Saving…
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
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

// Modern Chart Component with Recharts
function ModernChart({ 
  data, 
  type = 'pie', 
  title, 
  colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', 
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F43F5E', '#A855F7', '#EAB308'
  ],
  height = 400
}) {
  const chartColors = colors.slice(0, data.length);

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => [value, 'Students']}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <RechartsTooltip 
                formatter={(value) => [value, 'Students']}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Legend />
              <Bar dataKey="value" name="Students" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'radial':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadialBarChart 
              innerRadius="10%" 
              outerRadius="80%" 
              data={data} 
              startAngle={180} 
              endAngle={0}
            >
              <RadialBar 
                minAngle={15} 
                label={{ fill: '#fff', position: 'insideStart' }} 
                background 
                clockWise 
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </RadialBar>
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <RechartsTooltip 
                formatter={(value) => [value, 'Students']}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        );
      
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name="Students" dataKey="value" stroke={chartColors[0]} fill={chartColors[0]} fillOpacity={0.6} />
              <RechartsTooltip 
                formatter={(value) => [value, 'Students']}
              />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => [value, 'Students']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-60 h-60 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-60" />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-2xl ring-4 ring-blue-100">
              {type === 'pie' && <FiPieChart className="text-white text-xl" />}
              {type === 'bar' && <FiBarChart2 className="text-white text-xl" />}
              {type === 'radial' && <FiTrendingUp className="text-white text-xl" />}
              {type === 'radar' && <FiTarget className="text-white text-xl" />}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
              <p className="text-gray-600 text-sm">Visual distribution analysis</p>
            </div>
          </div>
        </div>

        <div className="h-96">
          {data && data.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FiBarChart2 className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No data available for chart</p>
              </div>
            </div>
          )}
        </div>

        {data && data.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-700">
                  {data.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-blue-900">Total Students</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <div className="text-2xl font-bold text-emerald-700">
                  {Math.max(...data.map(d => d.value)).toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-emerald-900">Highest</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                <div className="text-2xl font-bold text-amber-700">
                  {Math.min(...data.map(d => d.value)).toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-amber-900">Lowest</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="text-2xl font-bold text-purple-700">
                  {data.length}
                </div>
                <div className="text-sm font-semibold text-purple-900">Categories</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Modern Demographic Summary Card
function DemographicSummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div
      className="
        flex-shrink-0
        w-56 h-36
        rounded-2xl
        px-5 py-4
        bg-white/70 backdrop-blur-md
        border border-gray-200/60
        shadow-sm
        flex flex-col justify-between
      "
      style={{ minWidth: 220 }}
    >
      {/* Icon */}
      <div className="flex items-center justify-between">
        <div
          className={`
            flex items-center justify-center
            w-11 h-11
            rounded-xl
            bg-gradient-to-br ${color}
            shadow-sm
          `}
        >
          <Icon className="text-white text-lg" />
        </div>
      </div>

      {/* Value + Title */}
      <div>
        <div className="text-[28px] font-extrabold text-gray-900 leading-none tracking-tight">
          {Number(value || 0).toLocaleString()}
        </div>
        <div className="mt-1 text-sm font-medium text-gray-500">
          {title}
        </div>
      </div>
    </div>
  );
}


// Statistics Summary Card Component
function StatisticsSummaryCard({ stats, demographics, onRefresh }) {
  const [timeAgo, setTimeAgo] = useState('');
  
  useEffect(() => {
    if (stats.globalStats?.updatedAt) {
      const updateTime = new Date(stats.globalStats.updatedAt);
      const now = new Date();
      const diffMs = now - updateTime;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        setTimeAgo('Just now');
      } else if (diffMins < 60) {
        setTimeAgo(`${diffMins} minutes ago`);
      } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        setTimeAgo(`${hours} hours ago`);
      } else {
        const days = Math.floor(diffMins / 1440);
        setTimeAgo(`${days} days ago`);
      }
    }
  }, [stats.globalStats?.updatedAt]);
  
  const calculatePercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };
  
  const formDistribution = demographics.formDistribution || [];
  const totalStudents = stats.totalStudents || 0;
  
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl">
            <FiBarChart2 className="text-blue-700 text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Statistics Overview</h3>
            <p className="text-gray-600 text-sm">
              Real-time student analytics {timeAgo && `• Updated ${timeAgo}`}
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-bold flex items-center gap-3 text-sm hover:shadow-xl transition-all duration-300"
        >
          <FiRefreshCw className="text-sm" />
          Refresh Stats
        </button>
      </div>
      
      {/* Total Students Card */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-700 font-bold text-sm mb-2">TOTAL STUDENTS</p>
            <h4 className="text-4xl font-bold text-gray-900">
              {totalStudents.toLocaleString()}
            </h4>
          </div>
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
            <FiUsers className="text-blue-600 text-3xl" />
          </div>
        </div>
      </div>
      
      {/* Form Distribution Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {formDistribution.map((form, index) => (
          <div key={index} className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-900">{form.name}</span>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: form.color }} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {form.value.toLocaleString()}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: totalStudents > 0 ? `${(form.value / totalStudents) * 100}%` : '0%',
                  backgroundColor: form.color
                }}
              />
            </div>
            <div className="text-right text-sm text-gray-600 mt-1">
              {calculatePercentage(form.value, totalStudents)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-emerald-700">
            {(demographics.gender?.find(g => g.name === 'Male')?.value || 0).toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-emerald-900">Male Students</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-purple-700">
            {(demographics.gender?.find(g => g.name === 'Female')?.value || 0).toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-purple-900">Female Students</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-amber-700">
            {(demographics.statusDistribution?.find(s => s.name === 'Active')?.value || 0).toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-amber-900">Active Students</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-gray-700">
            {Object.keys(stats.streamStats || {}).length}
          </div>
          <div className="text-sm font-semibold text-gray-900">Streams</div>
        </div>
      </div>
      
      {/* Validation Status */}
      {stats.globalStats && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-bold">Data Consistency Check</span>
            <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
              stats.totalStudents === (stats.globalStats.form1 + stats.globalStats.form2 + 
                stats.globalStats.form3 + stats.globalStats.form4)
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {stats.totalStudents === (stats.globalStats.form1 + stats.globalStats.form2 + 
                stats.globalStats.form3 + stats.globalStats.form4)
                ? '✓ Consistent'
                : '⚠ Inconsistent'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Filter Component
function EnhancedFilterPanel({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  showAdvanced = false,
  onToggleAdvanced 
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters({ ...localFilters, [key]: value });
    onFilterChange(key, value);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      form: '',
      stream: '',
      gender: '',
      status: '',
      minAge: '',
      maxAge: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl mb-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <FiFilter className="text-blue-600" />
          Advanced Filters
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAdvanced}
            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Search Students
          </label>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Name, admission, email..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Form Level
          </label>
          <select
            value={localFilters.form}
            onChange={(e) => handleFilterChange('form', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
          >
            <option value="">All Forms</option>
            {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(form => (
              <option key={form} value={form}>{form}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Stream
          </label>
          <select
            value={localFilters.stream}
            onChange={(e) => handleFilterChange('stream', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
          >
            <option value="">All Streams</option>
            {['A', 'B', 'C', 'D', 'E', 'East', 'West', 'North', 'South', 'Science', 'Arts', 'Commercial'].map(stream => (
              <option key={stream} value={stream}>{stream}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
          >
            <option value="">All Status</option>
            {['active', 'inactive', 'graduated', 'transferred'].map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={localFilters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
            >
              <option value="">All Genders</option>
              {['Male', 'Female', 'Other'].map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Age Range
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                min="10"
                max="25"
                value={localFilters.minAge}
                onChange={(e) => handleFilterChange('minAge', e.target.value)}
                placeholder="Min"
                className="flex-1 px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
              />
              <input
                type="number"
                min="10"
                max="25"
                value={localFilters.maxAge}
                onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                placeholder="Max"
                className="flex-1 px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base"
            >
              <option value="createdAt">Date Created</option>
              <option value="admissionNumber">Admission Number</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="form">Form Level</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// Add a top-level helper so getFormColor is available across the file
function getFormColor(form) {
  switch (form) {
    case 'Form 1': return 'from-blue-500 to-blue-700';
    case 'Form 2': return 'from-emerald-500 to-emerald-700';
    case 'Form 3': return 'from-amber-500 to-amber-700';
    case 'Form 4': return 'from-purple-500 to-purple-700';
    default: return 'from-gray-400 to-gray-600';
  }
}



// Add this helper function after the imports
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Main Component


// Main Component
export default function ModernStudentBulkUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [view, setView] = useState('upload');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [displayMode, setDisplayMode] = useState('grid');
  const [replaceOption, setReplaceOption] = useState('skip');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: '', name: '' });
  
  const [filters, setFilters] = useState({
    search: '',
    form: '',
    stream: '',
    gender: '',
    status: '',
    minAge: '',
    maxAge: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [stats, setStats] = useState({
    totalStudents: 0,
    formStats: {},
    streamStats: {},
    genderStats: {},
    ageStats: {},
    globalStats: { totalStudents: 0, form1: 0, form2: 0, form3: 0, form4: 0 },
    validation: { isValid: true }
  });

  const [demographics, setDemographics] = useState({
    gender: [],
    ageGroups: [],
    formDistribution: [],
    streamDistribution: [],
    statusDistribution: []
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const fileInputRef = useRef(null);
  const FORMS = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

  // Helper function to process API responses
  const processApiResponse = (data) => {
    if (data.data && data.data.stats) {
      return data.data.stats;
    } else if (data.stats) {
      return data.stats;
    } else if (data.data) {
      return data.data;
    } else {
      return data;
    }
  };

  // Enhanced loadStats function
  const loadStats = async () => {
    setLoading(true);
    try {
      // Call the stats endpoint
      const res = await fetch('/api/studentupload?action=stats');
      const result = await res.json();
      
      if (result.success) {
        // Extract stats from the response structure
        const apiStats = processApiResponse(result) || {
          totalStudents: 0,
          form1: 0,
          form2: 0,
          form3: 0,
          form4: 0,
          updatedAt: new Date()
        };
        
        // Get student data for demographic calculations
        const studentsRes = await fetch('/api/studentupload?limit=1000');
        const studentsData = await studentsRes.json();
        
        if (studentsData.success) {
          const allStudents = studentsData.data?.students || studentsData.students || [];
          const totalStudents = apiStats.totalStudents || allStudents.length;
          
          // Calculate demographics
          const streamDistribution = {};
          const genderDistribution = {};
          const statusDistribution = {};
          
          allStudents.forEach(student => {
            // Stream distribution
            const stream = student.stream || 'Unassigned';
            streamDistribution[stream] = (streamDistribution[stream] || 0) + 1;
            
            // Gender distribution
            const gender = student.gender || 'Not Specified';
            genderDistribution[gender] = (genderDistribution[gender] || 0) + 1;
            
            // Status distribution
            const status = student.status || 'active';
            statusDistribution[status] = (statusDistribution[status] || 0) + 1;
          });
          
          // Calculate age distribution
          const ageDistribution = {
            'Under 13': 0,
            '13-15': 0,
            '16-17': 0,
            '18-20': 0,
            '21+': 0
          };
          
          allStudents.forEach(student => {
            if (student.dateOfBirth) {
              const dob = new Date(student.dateOfBirth);
              const age = new Date().getFullYear() - dob.getFullYear();
              
              if (age < 13) ageDistribution['Under 13']++;
              else if (age >= 13 && age <= 15) ageDistribution['13-15']++;
              else if (age >= 16 && age <= 17) ageDistribution['16-17']++;
              else if (age >= 18 && age <= 20) ageDistribution['18-20']++;
              else if (age > 20) ageDistribution['21+']++;
            }
          });
          
          // Calculate form distribution from API stats
          const formDistribution = {
            'Form 1': apiStats.form1 || 0,
            'Form 2': apiStats.form2 || 0,
            'Form 3': apiStats.form3 || 0,
            'Form 4': apiStats.form4 || 0
          };
          
          // Prepare chart data
          const genderChartData = Object.entries(genderDistribution).map(([name, value]) => ({
            name,
            value,
            color: name === 'Male' ? '#3B82F6' : name === 'Female' ? '#EC4899' : '#8B5CF6'
          }));
          
          const formChartData = Object.entries(formDistribution).map(([name, value]) => ({
            name,
            value,
            color: 
              name === 'Form 1' ? '#3B82F6' :
              name === 'Form 2' ? '#10B981' :
              name === 'Form 3' ? '#F59E0B' :
              '#8B5CF6'
          }));
          
          const streamChartData = Object.entries(streamDistribution)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, value], index) => ({
              name: name.length > 10 ? name.substring(0, 10) + '...' : name,
              fullName: name,
              value,
              color: [
                '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
                '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6'
              ][index % 10]
            }));
          
          const ageChartData = Object.entries(ageDistribution)
            .filter(([_, value]) => value > 0)
            .map(([name, value], index) => ({
              name,
              value,
              color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5]
            }));
          
          const statusChartData = [
            { name: 'Active', value: statusDistribution.active || 0, color: '#10B981' },
            { name: 'Inactive', value: statusDistribution.inactive || 0, color: '#EF4444' },
            { name: 'Graduated', value: statusDistribution.graduated || 0, color: '#8B5CF6' },
            { name: 'Transferred', value: statusDistribution.transferred || 0, color: '#F59E0B' }
          ];
          
          // Update state with all statistics
          setStats({
            totalStudents: totalStudents,
            globalStats: apiStats,
            formStats: formDistribution,
            streamStats: streamDistribution,
            genderStats: genderDistribution,
            statusStats: statusDistribution,
            ageStats: ageDistribution,
            validation: {
              isValid: totalStudents === (apiStats.form1 + apiStats.form2 + apiStats.form3 + apiStats.form4)
            }
          });
          
          setDemographics({
            gender: genderChartData,
            formDistribution: formChartData,
            streamDistribution: streamChartData,
            ageGroups: ageChartData,
            statusDistribution: statusChartData
          });
          
        } else {
          sooner.error('Failed to load student data for demographics');
        }
      } else {
        sooner.error('Failed to load statistics');
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      sooner.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };


  // Statistics refresh function
  const refreshStatistics = async () => {
    try {
      const res = await fetch('/api/studentupload?action=stats');
      const result = await res.json();
      
      if (result.success) {
        const apiStats = processApiResponse(result);
        
        if (apiStats) {
          setStats(prev => ({
            ...prev,
            globalStats: apiStats,
            totalStudents: apiStats.totalStudents || prev.totalStudents
          }));
          
          // Update form chart data
          const formChartData = [
            { name: 'Form 1', value: apiStats.form1 || 0, color: '#3B82F6' },
            { name: 'Form 2', value: apiStats.form2 || 0, color: '#10B981' },
            { name: 'Form 3', value: apiStats.form3 || 0, color: '#F59E0B' },
            { name: 'Form 4', value: apiStats.form4 || 0, color: '#8B5CF6' }
          ];
          
          setDemographics(prev => ({
            ...prev,
            formDistribution: formChartData
          }));
          
          sooner.success('Statistics updated successfully!');
        }
      }
    } catch (error) {
      console.error('Failed to refresh statistics:', error);
      sooner.error('Failed to refresh statistics');
    }
  };

  const loadStudents = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/studentupload?page=${page}&limit=${pagination.limit}&includeStats=false`;
      
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.form) url += `&form=${encodeURIComponent(filters.form)}`;
      if (filters.stream) url += `&stream=${encodeURIComponent(filters.stream)}`;
      if (filters.gender) url += `&gender=${encodeURIComponent(filters.gender)}`;
      if (filters.status) url += `&status=${encodeURIComponent(filters.status)}`;
      if (filters.sortBy) url += `&sortBy=${encodeURIComponent(filters.sortBy)}`;
      if (filters.sortOrder) url += `&sortOrder=${encodeURIComponent(filters.sortOrder)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to load students');
      
      if (data.success) {
        setStudents(data.data?.students || data.students || []);
        setPagination(data.data?.pagination || data.pagination || {
          page: page,
          limit: pagination.limit,
          total: 0,
          pages: 1
        });
      } else {
        sooner.error(data.message || 'Failed to load students');
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      sooner.error(error.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadUploadHistory = async (page = 1) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/studentupload?action=uploads&page=${page}&limit=5`);
      const data = await res.json();
      if (data.success) {
        setUploadHistory(data.uploads || []);
      } else {
        sooner.error('Failed to load upload history');
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      sooner.error('Failed to load upload history');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Auto-refresh for demographics view
  useEffect(() => {
    let intervalId;
    
    if (view === 'demographics') {
      // Refresh stats every 30 seconds when on demographics view
      intervalId = setInterval(() => {
        refreshStatistics();
      }, 30000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [view]);

  // Initial load
  useEffect(() => {
    loadStats();
    loadStudents();
    loadUploadHistory();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      form: '',
      stream: '',
      gender: '',
      status: '',
      minAge: '',
      maxAge: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    loadStudents(1);
  };

  const handleSort = (field) => {
    const newSortOrder = filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: newSortOrder
    }));
    loadStudents(pagination.page);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      sooner.error('Please select a file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('replaceExisting', replaceOption === 'replace');

    try {
      const response = await fetch('/api/studentupload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      setResult(data);
      
      if (data.success) {
        sooner.success(`✅ Upload successful! ${data.validRows || 0} students processed.`);
        
        if (data.errors && data.errors.length > 0) {
          data.errors.slice(0, 3).forEach(error => {
            sooner.error(error, { duration: 5000 });
          });
          if (data.errors.length > 3) {
            sooner.error(`... and ${data.errors.length - 3} more errors`, { duration: 5000 });
          }
        }
        
        await Promise.all([loadStudents(1), loadUploadHistory(1), loadStats()]);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        sooner.error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      sooner.error(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBatch = async (batchId, batchName) => {
    setDeleteTarget({ type: 'batch', id: batchId, name: batchName });
    setShowDeleteModal(true);
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    setDeleteTarget({ type: 'student', id: studentId, name: studentName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      let url;
      
      if (deleteTarget.type === 'batch') {
        url = `/api/studentupload?batchId=${deleteTarget.id}`;
      } else {
        url = `/api/studentupload?studentId=${deleteTarget.id}`;
      }

      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        sooner.success(data.message || 'Deleted successfully');
        await Promise.all([loadStudents(pagination.page), loadUploadHistory(1), loadStats()]);
        if (deleteTarget.type === 'student') {
          setSelectedStudent(null);
        }
      } else {
        sooner.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      sooner.error('Failed to delete');
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget({ type: '', id: '', name: '' });
    }
  };

  const updateStudent = async (studentId, studentData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/studentupload`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentId, ...studentData })
      });
      
      const data = await res.json();
      
      if (data.success) {
        sooner.success('Student updated successfully');
        await loadStudents(pagination.page);
        setEditingStudent(null);
        setSelectedStudent(data.data?.student || data.student);
      } else {
        sooner.error(data.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Update failed:', error);
      sooner.error('Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSVTemplate = () => {
    const template = `admissionNumber,firstName,middleName,lastName,form,stream,dateOfBirth,gender,parentPhone,email,address,status
3407,John,Michael,Doe,Form 1,A,2008-05-15,Male,+254712345678,john.doe@example.com,123 Main St,active
3408,Jane,,Smith,Form 2,B,2007-08-22,Female,+254723456789,jane.smith@example.com,456 Oak Ave,active
3409,Robert,James,Wilson,Form 3,C,2006-11-30,Male,+254734567890,robert.wilson@example.com,789 Pine Rd,active
3410,Sarah,Anne,Johnson,Form 4,D,2005-03-10,Female,+254745678901,sarah.johnson@example.com,321 Elm St,active`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sooner.success('CSV template downloaded');
  };

  const downloadExcelTemplate = () => {
    try {
      const sampleData = [
        ['admissionNumber', 'firstName', 'middleName', 'lastName', 'form', 'stream', 'dateOfBirth', 'gender', 'parentPhone', 'email', 'address', 'status'],
        ['3407', 'John', 'Michael', 'Doe', 'Form 1', 'A', '2008-05-15', 'Male', '+254712345678', 'john.doe@example.com', '123 Main St', 'active'],
        ['3408', 'Jane', '', 'Smith', 'Form 2', 'B', '2007-08-22', 'Female', '+254723456789', 'jane.smith@example.com', '456 Oak Ave', 'active']
      ];

      const ws = XLSX.utils.aoa_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");
      XLSX.writeFile(wb, 'student_template.xlsx');
      sooner.success('Excel template downloaded');
    } catch (error) {
      console.error('Error downloading Excel template:', error);
      sooner.error('Failed to download template');
    }
  };

  const exportStudentsToCSV = () => {
    if (students.length === 0) {
      sooner.error('No students to export');
      return;
    }

    const headers = ['Admission Number', 'First Name', 'Middle Name', 'Last Name', 'Form', 'Stream', 'Gender', 'Date of Birth', 'Age', 'Status', 'Email', 'Parent Phone', 'Address'];
    const data = students.map(student => {
      const dob = student.dateOfBirth ? new Date(student.dateOfBirth) : null;
      const age = dob ? new Date().getFullYear() - dob.getFullYear() : '';
      
      return [
        student.admissionNumber,
        student.firstName,
        student.middleName || '',
        student.lastName,
        student.form,
        student.stream || '',
        student.gender || '',
        dob ? dob.toLocaleDateString() : '',
        age,
        student.status,
        student.email || '',
        student.parentPhone || '',
        student.address || ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `students_export_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sooner.success(`Exported ${students.length} students to CSV`);
  };

  const exportStudentsToExcel = () => {
    if (!students || students.length === 0) {
      sooner.error('No students to export');
      return;
    }

    // Build worksheet data
    const worksheetData = [
      ['Admission Number', 'First Name', 'Middle Name', 'Last Name', 'Form', 'Stream', 'Gender', 'Date of Birth', 'Age', 'Status', 'Email', 'Parent Phone', 'Address'],
      ...students.map(student => {
        const dob = student.dateOfBirth ? new Date(student.dateOfBirth) : null;
        const age = dob ? new Date().getFullYear() - dob.getFullYear() : '';
        
        return [
          student.admissionNumber,
          student.firstName,
          student.middleName || '',
          student.lastName,
          student.form,
          student.stream || '',
          student.gender || '',
          dob ? dob.toLocaleDateString() : '',
          age,
          student.status,
          student.email || '',
          student.parentPhone || '',
          student.address || ''
        ];
      })
    ];

    // Create and download Excel file
    try {
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Students');
      XLSX.writeFile(wb, `students_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      sooner.success(`Exported ${students.length} students to Excel`);
    } catch (err) {
      console.error('Excel export failed', err);
      sooner.error('Failed to export to Excel');
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      loadStudents(1);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadStudents(newPage);
    }
  };

  if (loading && students.length === 0 && view !== 'upload' && view !== 'demographics') {
    return <ModernLoadingSpinner message="Loading student records..." size="large" />;
  }

  return (
    <div className="p-6 space-y-6">
      <CustomToaster />

      {/* Welcome Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <IoSparkles className="text-2xl text-yellow-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Student Bulk Upload & Analytics</h1>
              <p className="text-blue-100 text-lg mt-2 max-w-2xl">
                Comprehensive student management with bulk upload, real-time filtering, 
                demographic analytics, and distribution charts for all academic forms and streams.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => {
                setLoading(true);
                loadStats();
              }}
              disabled={loading}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 shadow-lg disabled:opacity-60 hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <CircularProgress size={16} color="inherit" thickness={6} />
              ) : (
                <FiRefreshCw className="text-base" />
              )}
              {loading ? 'Syncing...' : 'Refresh Stats'}
            </button>

            <button
              onClick={exportStudentsToCSV}
              disabled={students.length === 0 || loading}
              className="text-white/80 hover:text-white px-6 py-3 rounded-xl font-bold text-base border border-white/20 flex items-center gap-2 disabled:opacity-50 hover:bg-white/10 transition-all duration-300"
            >
              <FiDownload className="text-base" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-3 border-2 border-gray-200 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2 p-2">
          <button
            onClick={() => setView('upload')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base transition-all duration-300 ${
              view === 'upload'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            <FiUpload className="text-sm" />
            Bulk Upload
          </button>
          <button
            onClick={() => {
              setView('students');
              loadStudents(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base transition-all duration-300 ${
              view === 'students'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            <FiUsers className="text-sm" />
            Students ({stats.totalStudents || 0})
          </button>
          <button
            onClick={() => {
              setView('demographics');
              loadStats();
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base transition-all duration-300 ${
              view === 'demographics'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            <FiPieChart className="text-sm" />
            Demographics
          </button>
          <button
            onClick={() => {
              setView('history');
              loadUploadHistory(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base transition-all duration-300 ${
              view === 'history'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            <FiClock className="text-sm" />
            Upload History
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {view === 'upload' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DemographicSummaryCard
                title="Total Students"
                value={stats.totalStudents}
                icon={FiUsers}
                color="from-blue-500 to-blue-700"
                trend={12}
              />

              {FORMS.map(form => {
                const count = stats.formStats[form] || 0;
                const colors = {
                  'Form 1': 'from-blue-500 to-blue-700',
                  'Form 2': 'from-emerald-500 to-emerald-700',
                  'Form 3': 'from-amber-500 to-amber-700',
                  'Form 4': 'from-purple-500 to-purple-700'
                };

                return (
                  <DemographicSummaryCard
                    key={form}
                    title={form}
                    value={count}
                    icon={IoSchool}
                    color={colors[form]}
                    trend={Math.floor(Math.random() * 20) - 5}
                  />
                );
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300">
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                    <FiInfo className="text-blue-700 text-2xl" />
                    Duplicate Prevention Strategy
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-6 mb-4">
                    <div className="flex-1">
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border-3 cursor-pointer transition-all duration-300 ${
                        replaceOption === 'skip' 
                          ? 'border-blue-600 bg-blue-50 shadow-lg' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}>
                        <input
                          type="radio"
                          checked={replaceOption === 'skip'}
                          onChange={() => setReplaceOption('skip')}
                          className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 text-lg">Skip Duplicates</div>
                          <div className="text-gray-600 text-sm mt-2">Preserve existing records with unique admission numbers</div>
                        </div>
                      </label>
                    </div>
                    <div className="flex-1">
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border-3 cursor-pointer transition-all duration-300 ${
                        replaceOption === 'replace' 
                          ? 'border-blue-600 bg-blue-50 shadow-lg' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}>
                        <input
                          type="radio"
                          checked={replaceOption === 'replace'}
                          onChange={() => setReplaceOption('replace')}
                          className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 text-lg">Replace Records</div>
                          <div className="text-gray-600 text-sm mt-2">Update existing records with new data</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="bg-white/80 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-blue-800 font-semibold">
                      ⚠️ Admission numbers must be unique. Names can be duplicated but admission numbers cannot.
                    </p>
                  </div>
                </div>

                <ModernFileUpload
                  onFileSelect={handleFileSelect}
                  file={file}
                  onRemove={() => setFile(null)}
                  dragActive={dragActive}
                  onDrag={(active) => setDragActive(active)}
                />

                {file && (
                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl">
                          {file.name.endsWith('.csv') ? (
                            <FiFile className="text-blue-700 text-3xl" />
                          ) : (
                            <IoDocumentText className="text-green-700 text-3xl" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg truncate max-w-[200px] md:max-w-none">{file.name}</p>
                          <div className="flex flex-col md:flex-row md:items-center gap-6 mt-2">
                            <span className="text-gray-600 font-semibold text-base">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <span className="px-3 py-1.5 bg-gray-100 rounded-lg font-bold text-gray-700 text-sm">
                              {file.name.split('.').pop().toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setFile(null)}
                          className="p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <FiX className="text-xl" />
                        </button>
                        <button
                          onClick={handleUpload}
                          disabled={uploading}
                          className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl font-bold flex items-center gap-3 text-base shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all duration-300"
                        >
                          {uploading ? (
                            <>
                              <CircularProgress size={18} className="text-white" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <FiUpload className="text-base" />
                              <span>Upload Now</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Download Templates</h3>
                  <div className="space-y-4">
                    <button
                      onClick={downloadCSVTemplate}
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <FiFile className="text-blue-600 text-2xl" />
                      <span className="font-bold text-gray-900 text-base">CSV Template</span>
                    </button>
                    <button
                      onClick={downloadExcelTemplate}
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <IoDocumentText className="text-green-600 text-2xl" />
                      <span className="font-bold text-gray-900 text-base">Excel Template</span>
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-300 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-blue-900 mb-6">Upload Guidelines</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-base">1</span>
                      </div>
                      <span className="text-blue-800 font-semibold text-base">Use provided templates for correct format</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-base">2</span>
                      </div>
                      <span className="text-blue-800 font-semibold text-base">Admission numbers must be unique (4-10 digits)</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-base">3</span>
                      </div>
                      <span className="text-blue-800 font-semibold text-base">Keep file size under 10MB for optimal performance</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-base">4</span>
                      </div>
                      <span className="text-blue-800 font-semibold text-base">All required fields must be filled (marked with *)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'students' && (
          <div className="space-y-8">
            {showFilters && (
              <EnhancedFilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                showAdvanced={showFilters}
                onToggleAdvanced={() => setShowFilters(!showFilters)}
              />
            )}

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative max-w-full lg:max-w-lg">
                    <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      onKeyDown={handleSearch}
                      placeholder="Search students by name, admission number, email, or address"
                      className="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-400 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition-all duration-300 text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 lg:flex-none px-6 py-4 bg-white border-2 border-gray-400 rounded-2xl text-gray-700 font-bold flex items-center justify-center gap-3 text-base hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                  >
                    <FiFilter />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-2xl">
                    <button
                      onClick={() => setDisplayMode('grid')}
                      className={`p-3 rounded-xl transition-all duration-300 ${displayMode === 'grid' ? 'bg-white text-blue-700 shadow-lg' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      <FiGrid size={18} />
                    </button>
                    <button
                      onClick={() => setDisplayMode('list')}
                      className={`p-3 rounded-xl transition-all duration-300 ${displayMode === 'list' ? 'bg-white text-blue-700 shadow-lg' : 'text-gray-600 hover:text-blue-600'}`}
                    >
                      <FiList size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSearch({ type: 'click' })}
                    disabled={loading}
                    className="flex-1 lg:flex-none px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={18} className="text-white" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <FiSearch />
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <ModernLoadingSpinner message="Loading student records..." size="large" />
              </div>
            ) : (
              <>
                {displayMode === 'grid' && students.length > 0 && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Student Records ({pagination.total})
                      </h3>
                      <div className="text-gray-600 font-bold text-base">
                        Page {pagination.page} of {pagination.pages}
                      </div>
                    </div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {students.map(student => (
    <div
      key={student.id}
      className="group bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Top Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center ring-1 ring-blue-100">
            <FiUser className="text-white text-base" />
          </div>

          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-gray-900 leading-tight">
              {student.firstName} {student.lastName}
            </h4>
            <p className="text-xs text-gray-500">
              #{student.admissionNumber}
            </p>
          </div>
        </div>

        <button className="opacity-60 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-gray-100">
          <FiSettings className="text-sm text-gray-500" />
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        <span
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium text-white bg-gradient-to-r ${getFormColor(student.form)}`}
        >
          {student.form}
        </span>

        {student.stream && (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700">
            Stream {student.stream}
          </span>
        )}

        <span
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
            student.status === 'active'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {student.status}
        </span>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-100" />

      {/* Details */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">Form Level</span>
          <span className="font-medium text-gray-800">{student.form}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Stream</span>
          <span className="font-medium text-gray-800">
            {student.stream || '—'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              student.status === 'active'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {student.status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Admitted</span>
          <span className="font-medium text-gray-700 text-[11px]">
            {formatDate(student.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setSelectedStudent(student)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FiEye className="text-xs" />
          View
        </button>

        <button
          onClick={() => setEditingStudent(student)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          <FiEdit className="text-xs" />
          Edit
        </button>
      </div>
    </div>
  ))}
</div>

                  </>
                )}

                {displayMode === 'list' && students.length > 0 && (
                  <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b-2 border-gray-300 bg-gradient-to-r from-gray-100 to-white">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-2xl font-bold text-gray-900">Student Records</h3>
                        <div className="flex items-center gap-4">
                          <div className="text-gray-600 font-bold bg-white px-4 py-2 rounded-xl border-2 text-base">
                            {pagination.total} total students
                          </div>
                          <button
                            onClick={() => loadStudents(pagination.page)}
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl font-bold flex items-center gap-3 text-base shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all duration-300"
                          >
                            {loading ? (
                              <CircularProgress size={18} className="text-white" />
                            ) : (
                              <FiRefreshCw />
                            )}
                            {loading ? 'Refreshing...' : 'Refresh'}
                          </button>
                        </div>
                      </div>
                    </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
  <table className="w-full min-w-[760px] text-sm">
    <thead className="bg-gray-50 border-b border-gray-100">
      <tr>
        <th
          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:text-blue-600"
          onClick={() => handleSort('firstName')}
        >
          <div className="flex items-center gap-1.5">
            Student
            {filters.sortBy === 'firstName' &&
              (filters.sortOrder === 'asc' ? (
                <FiChevronUp className="text-xs" />
              ) : (
                <FiChevronDown className="text-xs" />
              ))}
          </div>
        </th>

        <th
          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:text-blue-600"
          onClick={() => handleSort('form')}
        >
          <div className="flex items-center gap-1.5">
            Form
            {filters.sortBy === 'form' &&
              (filters.sortOrder === 'asc' ? (
                <FiChevronUp className="text-xs" />
              ) : (
                <FiChevronDown className="text-xs" />
              ))}
          </div>
        </th>

        <th
          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:text-blue-600"
          onClick={() => handleSort('stream')}
        >
          <div className="flex items-center gap-1.5">
            Stream
            {filters.sortBy === 'stream' &&
              (filters.sortOrder === 'asc' ? (
                <FiChevronUp className="text-xs" />
              ) : (
                <FiChevronDown className="text-xs" />
              ))}
          </div>
        </th>

        <th
          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:text-blue-600"
          onClick={() => handleSort('status')}
        >
          <div className="flex items-center gap-1.5">
            Status
            {filters.sortBy === 'status' &&
              (filters.sortOrder === 'asc' ? (
                <FiChevronUp className="text-xs" />
              ) : (
                <FiChevronDown className="text-xs" />
              ))}
          </div>
        </th>

        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Actions
        </th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {students.map(student => (
        <tr
          key={student.id}
          className="hover:bg-gray-50 transition-colors"
        >
          {/* Student */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
                <FiUser className="text-white text-sm" />
              </div>

              <div className="leading-tight">
                <div className="font-semibold text-gray-900">
                  {student.firstName}{' '}
                  {student.middleName ? `${student.middleName} ` : ''}
                  {student.lastName}
                </div>
                <div className="text-xs text-gray-500">
                  #{student.admissionNumber}
                </div>
                {student.email && (
                  <div className="text-xs text-gray-400 max-w-[220px] truncate">
                    {student.email}
                  </div>
                )}
              </div>
            </div>
          </td>

          {/* Form */}
          <td className="px-6 py-4">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                student.form === 'Form 1'
                  ? 'bg-blue-50 text-blue-700'
                  : student.form === 'Form 2'
                  ? 'bg-emerald-50 text-emerald-700'
                  : student.form === 'Form 3'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-purple-50 text-purple-700'
              }`}
            >
              {student.form}
            </span>
          </td>

          {/* Stream */}
          <td className="px-6 py-4 text-gray-800 font-medium">
            {student.stream || '—'}
          </td>

          {/* Status */}
          <td className="px-6 py-4">
            <span
              className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
                student.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {student.status}
            </span>
          </td>

          {/* Actions */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedStudent(student)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
              >
                View
              </button>
              <button
                onClick={() => setEditingStudent(student)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
              >
                Edit
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

                  </div>
                )}

                {students.length === 0 && !loading && (
                  <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-300 shadow-xl">
                    <FiUsers className="text-6xl text-gray-300 mx-auto mb-6" />
                    <p className="text-gray-600 text-xl font-bold mb-4">No students found</p>
                    {(filters.search || filters.form || filters.stream) && (
                      <button
                        onClick={handleClearFilters}
                        className="text-blue-600 font-bold text-lg hover:text-blue-800 transition-colors"
                      >
                        Clear filters to see all students
                      </button>
                    )}
                  </div>
                )}

                {students.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t-2 border-gray-300">
                    <div className="text-gray-700 font-bold text-base">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <FiArrowLeft className="text-base" />
                      </button>
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-300 ${
                              pagination.page === pageNum
                                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-2xl'
                                : 'border-2 border-gray-400 hover:border-blue-500 hover:text-blue-600'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <FiArrowRight className="text-base" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {view === 'demographics' && (
          <div className="space-y-8">
            {/* Statistics Summary Card */}
            <StatisticsSummaryCard 
              stats={stats}
              demographics={demographics}
              onRefresh={refreshStatistics}
            />
            
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ModernChart
                data={demographics.formDistribution}
                type="pie"
                title="Form Distribution"
                colors={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']}
                height={400}
              />
              <ModernChart
                data={demographics.gender}
                type="radial"
                title="Gender Distribution"
                colors={['#3B82F6', '#EC4899', '#8B5CF6']}
                height={400}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ModernChart
                data={demographics.streamDistribution}
                type="bar"
                title="Stream Distribution"
                height={400}
              />
              <ModernChart
                data={demographics.ageGroups}
                type="pie"
                title="Age Distribution"
                colors={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']}
                height={400}
              />
            </div>
            
            {demographics.streamDistribution.length > 3 && (
              <ModernChart
                data={demographics.streamDistribution.slice(0, 8)}
                type="radar"
                title="Stream Performance Radar"
                height={400}
              />
            )}
            
            {/* Detailed Statistics Table */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Statistics Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Count</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Percentage</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {demographics.formDistribution.map((form, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: form.color }} />
                            <span className="font-bold text-gray-900">{form.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{form.value.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">
                            {stats.totalStudents > 0 ? `${((form.value / stats.totalStudents) * 100).toFixed(1)}%` : '0%'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiTrendingUp className="text-green-500" />
                            <span className="text-green-600 font-bold">+2.5%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Upload History</h3>
                <p className="text-gray-600 mt-2 text-base">Track all your bulk upload activities</p>
              </div>
              <button
                onClick={() => loadUploadHistory(1)}
                disabled={historyLoading}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all duration-300"
              >
                {historyLoading ? (
                  <>
                    <CircularProgress size={18} className="text-white" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <FiRefreshCw />
                    <span>Refresh History</span>
                  </>
                )}
              </button>
            </div>

            {uploadHistory.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-300 shadow-xl">
                <FiClock className="text-6xl text-gray-300 mx-auto mb-6" />
                <p className="text-gray-600 text-xl font-bold mb-4">No upload history found</p>
                <p className="text-gray-500 text-base">Upload your first file to see history here</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[768px]">
                    <thead className="bg-gradient-to-r from-gray-100 to-white">
                      <tr>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Upload Details
                        </th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Statistics
                        </th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-200">
                      {uploadHistory.map(upload => (
                        <tr key={upload.id} className="bg-white hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                                <FiFile className="text-blue-700 text-xl" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-base truncate max-w-[250px] lg:max-w-md">
                                  {upload.fileName}
                                </div>
                                <div className="text-gray-600 mt-2 font-semibold text-sm">
                                  {new Date(upload.uploadDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-5 py-2.5 rounded-xl text-sm font-bold ${
                              upload.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : upload.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {upload.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-2">
                              <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <span className="text-emerald-700 font-bold text-sm">{upload.validRows || 0} valid</span>
                                <span className="text-amber-700 font-bold text-sm">{upload.skippedRows || 0} skipped</span>
                                <span className="text-red-700 font-bold text-sm">{upload.errorRows || 0} errors</span>
                              </div>
                              <div className="text-gray-600 font-semibold text-sm">
                                Total: {upload.totalRows || 0} rows processed
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <button
                              onClick={() => handleDeleteBatch(upload.id, upload.fileName)}
                              className="px-5 py-2.5 bg-red-50 text-red-700 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedStudent && (
        <ModernStudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEdit={() => {
            setEditingStudent(selectedStudent);
            setSelectedStudent(null);
          }}
          onDelete={() => handleDeleteStudent(selectedStudent.id, `${selectedStudent.firstName} ${selectedStudent.lastName}`)}
        />
      )}

      {editingStudent && (
        <ModernStudentEditModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={updateStudent}
          loading={loading}
        />
      )}

      {showDeleteModal && (
        <ModernDeleteModal
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteTarget({ type: '', id: '', name: '' });
          }}
          onConfirm={confirmDelete}
          loading={loading} 
          type={deleteTarget.type}
          itemName={deleteTarget.name}
        />
      )}
    </div>
  );
}