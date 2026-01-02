'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CircularProgress, Modal, Box, Chip, Alert as MuiAlert, Snackbar } from '@mui/material';
import * as XLSX from 'xlsx';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, ComposedChart, Scatter, LabelList
} from 'recharts';
import {
  FiUpload, FiFile, FiDownload, FiUsers, FiUser, FiFilter, FiSearch,
  FiEye, FiEdit, FiTrash2, FiRefreshCw, FiCheckCircle, FiXCircle,
  FiAlertCircle, FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar,
  FiMail, FiPhone, FiMapPin, FiX, FiList, FiGrid, FiSettings,
  FiArrowLeft, FiArrowRight, FiSave, FiInfo, FiUserCheck, FiBook,
  FiSort, FiSortAsc, FiSchool, FiChevronRight, FiChevronUp, FiChevronDown,
  FiHome, FiUserPlus, FiClock, FiPercent, FiGlobe, FiBookOpen,
  FiHeart, FiCpu, FiSparkles, FiPlay, FiTarget, FiAward,
  FiMessageCircle, FiImage, FiTrendingDown, FiActivity, FiDollarSign,
  FiCreditCard, FiShield, FiLock, FiUnlock, FiBell, FiPrinter,
  FiCalendar as FiCalendarIcon, FiFileText, FiCheck, FiArchive,
  FiRepeat, FiTrendingUp as FiTrendingUpIcon, FiTrendingDown as FiTrendingDownIcon,
  FiMoreVertical, FiExternalLink, FiCopy, FiTag, FiCodesandbox
} from 'react-icons/fi';
import {
  IoPeopleCircle, IoNewspaper, IoClose, IoStatsChart,
  IoAnalytics, IoSchool, IoDocumentText, IoSparkles,
  IoCash, IoCard, IoWallet, IoReceipt, IoCheckmarkCircle,
  IoAlertCircle, IoTime, IoCalendarClear, IoDocuments,
  IoStatsChart as IoStatsChartIcon, IoFilter as IoFilterIcon
} from 'react-icons/io5';

// Loading Spinner
function ModernLoadingSpinner({ message = "Loading fee data...", size = "medium" }) {
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
          <div className="absolute -inset-6 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-full blur-xl opacity-30" />
        </div>
        
        <div className="mt-8 space-y-3">
          <span className="block text-lg font-semibold text-gray-800">{message}</span>
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            ))}
          </div>
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
  type = "fee",
  showNotification
}) {
  const [confirmText, setConfirmText] = useState('')

  const getConfirmPhrase = () => {
    if (type === "batch") return "DELETE BATCH";
    if (type === "fee") return "DELETE FEE";
    return "DELETE";
  }

  const handleConfirm = () => {
    const phrase = getConfirmPhrase();
    if (confirmText === phrase) {
      onConfirm()
    } else {
      showNotification(`Please type "${phrase}" exactly to confirm deletion`, 'warning')
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
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-base disabled:opacity-50"
          >
            <FiXCircle className="text-base" /> Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={loading || confirmText !== getConfirmPhrase()}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white px-4 py-3 rounded-xl font-bold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
function ModernFileUpload({ onFileSelect, file, onRemove, dragActive, onDrag, showNotification }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validExtensions = ['.csv', '.xlsx', '.xls', '.xlsm'];
    
    if (selectedFile) {
      const ext = selectedFile.name.toLowerCase();
      if (validExtensions.some(valid => ext.endsWith(valid))) {
        onFileSelect(selectedFile);
        showNotification('File selected successfully', 'success');
      } else {
        showNotification('Please upload a CSV or Excel file', 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={`border-3 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer ${
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
      <FiUpload className={`mx-auto text-3xl mb-4 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
      <p className="text-gray-800 mb-2 font-bold text-lg">
        {dragActive ? '📁 Drop file here!' : file ? 'Click to replace file' : 'Drag & drop or click to upload'}
      </p>
      <p className="text-sm text-gray-600">CSV, Excel (.xlsx, .xls) • Max 10MB</p>
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

// Fee Detail Modal
function ModernFeeDetailModal({ fee, student, onClose, onEdit, onDelete, showNotification }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!fee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'from-green-500 to-green-700';
      case 'partial': return 'from-amber-500 to-amber-700';
      case 'pending': return 'from-red-500 to-red-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const calculateProgress = () => {
    if (fee.amount <= 0) return 0;
    return (fee.amountPaid / fee.amount) * 100;
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
      width: '96vw',
      maxWidth: '880px',
      maxHeight: '95vh',
      bgcolor: 'background.paper',
      borderRadius: 3,
      boxShadow: 24,
      overflow: 'hidden',
    }}
  >
    {/* Header */}
    <div className="bg-slate-900 px-6 py-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10">
            <IoCash className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Fee Details</h2>
            <p className="text-xs text-slate-300">
              Balance & payment overview
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <FiX />
        </button>
      </div>
    </div>

    <div className="max-h-[calc(95vh-64px)] overflow-y-auto p-6 space-y-6">
      {/* Student Summary */}
      <div className="flex items-center gap-4 bg-white rounded-xl p-4 border shadow-sm">
        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white">
          <FiDollarSign />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            {student?.firstName} {student?.lastName}
          </h3>
          <p className="text-xs text-gray-500">
            Admission #{fee.admissionNumber}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            fee.paymentStatus === 'paid'
              ? 'bg-green-100 text-green-700'
              : fee.paymentStatus === 'partial'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {fee.paymentStatus.toUpperCase()}
        </span>
      </div>

      {/* Payment Progress */}
      <div className="bg-slate-50 rounded-xl p-5 border">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-800">
            Payment Progress
          </h4>
          <span className="text-sm font-semibold text-blue-600">
            {calculateProgress().toFixed(1)}%
          </span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-sm font-semibold">
              {formatCurrency(fee.amount)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs text-gray-500">Paid</p>
            <p className="text-sm font-semibold">
              {formatCurrency(fee.amountPaid)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs text-gray-500">Balance</p>
            <p className="text-sm font-semibold">
              {formatCurrency(fee.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Academic */}
        <div className="bg-white rounded-xl border p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Academic Info
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Term</span>
              <span className="font-medium">{fee.term}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Year</span>
              <span className="font-medium">{fee.academicYear}</span>
            </div>
            {student && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Form</span>
                  <span className="font-medium">{student.form}</span>
                </div>
                {student.stream && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stream</span>
                    <span className="font-medium">{student.stream}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Payment Info
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium">
                {fee.paymentStatus.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Due Date</span>
              <span className="font-medium">
                {fee.dueDate ? formatDate(fee.dueDate) : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Updated</span>
              <span className="font-medium">
                {formatDate(fee.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onEdit}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Edit Fee
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </Box>
</Modal>


      {showDeleteModal && (
        <ModernDeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            onDelete(fee.admissionNumber);
            setShowDeleteModal(false);
          }}
          loading={false}
          type="fee"
          itemName={`Fee for ${fee.admissionNumber} - ${fee.term} ${fee.academicYear}`}
          showNotification={showNotification}
        />
      )}
    </>
  );
}

// Fee Edit Modal
function ModernFeeEditModal({ fee, student, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    amount: fee?.amount || 0,
    amountPaid: fee?.amountPaid || 0,
    term: fee?.term || '',
    academicYear: fee?.academicYear || '',
    dueDate: fee?.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
    paymentStatus: fee?.paymentStatus || 'pending'
  });

  const [calculatedBalance, setCalculatedBalance] = useState(fee?.balance || 0);

  useEffect(() => {
    const balance = formData.amount - formData.amountPaid;
    setCalculatedBalance(balance);
    
    // Auto-update payment status based on balance
    let status = 'pending';
    if (balance <= 0) {
      status = 'paid';
    } else if (formData.amountPaid > 0) {
      status = 'partial';
    }
    setFormData(prev => ({ ...prev, paymentStatus: status }));
  }, [formData.amount, formData.amountPaid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFee = {
      ...formData,
      balance: calculatedBalance
    };
    await onSave(fee.id, updatedFee);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '800px',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiEdit className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Fee Balance</h2>
                <p className="text-blue-100 opacity-90 text-sm mt-1">
                  Update fee details for {student ? `${student.firstName} ${student.lastName}` : 'Student'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white bg-opacity-20 rounded-2xl">
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(95vh-80px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Info */}
            {student && (
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Student Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={`${student.firstName || ''} ${student.lastName || ''}`}
                      disabled
                      className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50 text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Admission Number
                    </label>
                    <input
                      type="text"
                      value={fee.admissionNumber}
                      disabled
                      className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50 text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Amount Information */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Amount Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Total Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">KES</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                      className="w-full pl-14 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Amount Paid *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">KES</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={formData.amount}
                      required
                      value={formData.amountPaid}
                      onChange={(e) => setFormData({...formData, amountPaid: parseFloat(e.target.value) || 0})}
                      className="w-full pl-14 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Balance
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">KES</span>
                    <input
                      type="text"
                      value={formatCurrency(calculatedBalance)}
                      disabled
                      className={`w-full pl-14 pr-4 py-3.5 border-2 rounded-xl bg-gray-50 text-base font-bold ${
                        calculatedBalance > 0 ? 'border-red-300 text-red-700' : 'border-green-300 text-green-700'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Payment Progress</span>
                  <span className="text-sm font-bold text-blue-700">
                    {formData.amount > 0 ? ((formData.amountPaid / formData.amount) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                    style={{ 
                      width: `${formData.amount > 0 ? Math.min((formData.amountPaid / formData.amount) * 100, 100) : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Term *
                  </label>
                  <select
                    required
                    value={formData.term}
                    onChange={(e) => setFormData({...formData, term: e.target.value})}
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                  >
                    <option value="">Select Term</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                    placeholder="e.g., 2024/2025"
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                  />
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Payment Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'pending', label: 'Pending', color: 'from-red-500 to-red-700' },
                  { value: 'partial', label: 'Partial', color: 'from-amber-500 to-amber-700' },
                  { value: 'paid', label: 'Paid', color: 'from-green-500 to-green-700' }
                ].map(status => (
                  <label key={status.value} className={`flex items-center gap-3 p-4 rounded-xl border-3 cursor-pointer ${
                    formData.paymentStatus === status.value 
                      ? `border-blue-600 bg-gradient-to-r ${status.color} text-white shadow-lg` 
                      : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value={status.value}
                      checked={formData.paymentStatus === status.value}
                      onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-base">{status.label}</div>
                      <div className="text-sm opacity-90">
                        {status.value === 'paid' ? 'All fees cleared' :
                         status.value === 'partial' ? 'Partially paid' :
                         'Payment pending'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 border-2 border-gray-400 text-gray-700 rounded-2xl font-bold text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl font-bold text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <CircularProgress size={18} className="text-white" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="text-lg" />
                    <span>Update Fee Balance</span>
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

// Statistics Card Component
function StatisticsCard({ title, value, icon: Icon, color, trend = 0, prefix = '', suffix = '' }) {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return prefix + val.toLocaleString() + suffix;
    }
    return prefix + val + suffix;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="text-white text-2xl" />
        </div>
        <div className={`text-sm font-bold px-3 py-1 rounded-lg ${
          trend > 0 
            ? 'bg-green-100 text-green-800' 
            : trend < 0 
            ? 'bg-red-100 text-red-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : '0%'}
        </div>
      </div>
      <h4 className="text-3xl font-bold text-gray-900 mb-2">{formatValue(value)}</h4>
      <p className="text-gray-600 text-sm font-semibold">{title}</p>
    </div>
  );
}

// Fee Chart Component
function ModernFeeChart({ 
  data, 
  type = 'bar', 
  title, 
  colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', 
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6'
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
              <RechartsTooltip formatter={(value) => [value, 'Count']} />
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
              <RechartsTooltip formatter={(value) => [`KES ${value.toLocaleString()}`, 'Amount']} />
              <Legend />
              <Bar dataKey="value" name="Amount (KES)" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <RechartsTooltip formatter={(value, name) => {
                if (name === 'amount') return [`KES ${value.toLocaleString()}`, 'Total Amount'];
                if (name === 'paid') return [`KES ${value.toLocaleString()}`, 'Amount Paid'];
                if (name === 'balance') return [`KES ${value.toLocaleString()}`, 'Balance'];
                return [value, name];
              }} />
              <Legend />
              <Bar dataKey="balance" name="Balance" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="paid" name="Amount Paid" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="amount" name="Total Amount" stroke="#3B82F6" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'radial':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadialBarChart innerRadius="20%" outerRadius="90%" data={data} startAngle={180} endAngle={0}>
              <RadialBar minAngle={15} label={{ fill: '#fff', position: 'insideStart' }} background clockWise dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </RadialBar>
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <RechartsTooltip formatter={(value) => [value, 'Count']} />
            </RadialBarChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="value" name="Amount" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-40 h-40 md:w-60 md:h-60 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-60" />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-2xl ring-4 ring-blue-100">
              {type === 'pie' && <FiPieChart className="text-white text-xl" />}
              {type === 'bar' && <FiBarChart2 className="text-white text-xl" />}
              {type === 'composed' && <IoStatsChart className="text-white text-xl" />}
              {type === 'radial' && <FiTrendingUp className="text-white text-xl" />}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
              <p className="text-gray-600 text-sm">Visual fee analysis</p>
            </div>
          </div>
        </div>

        <div className="h-72 md:h-96">
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
      </div>
    </div>
  );
}

// Filter Panel Component
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
      term: '',
      academicYear: '',
      paymentStatus: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl mb-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <IoFilterIcon className="text-blue-600" />
          Advanced Filters
        </h3>
        <div className="flex items-center gap-3">
          <button onClick={onToggleAdvanced} className="px-4 py-2 text-sm font-bold text-gray-700">{showAdvanced ? 'Hide Advanced' : 'Show Advanced'}</button>
          <button onClick={clearAllFilters} className="px-4 py-2 text-sm font-bold text-red-600">Clear All</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Search</label>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input type="text" value={localFilters.search} onChange={(e) => handleFilterChange('search', e.target.value)} placeholder="Admission number, student name..." className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Term</label>
          <select value={localFilters.term} onChange={(e) => handleFilterChange('term', e.target.value)} className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base">
            <option value="">All Terms</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Academic Year</label>
          <select value={localFilters.academicYear} onChange={(e) => handleFilterChange('academicYear', e.target.value)} className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base">
            <option value="">All Years</option>
            <option value="2024/2025">2024/2025</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2022/2023">2022/2023</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Payment Status</label>
          <select value={localFilters.paymentStatus} onChange={(e) => handleFilterChange('paymentStatus', e.target.value)} className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base">
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Min Amount (KES)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={localFilters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Max Amount (KES)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={localFilters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              placeholder="100000.00"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            >
              <option value="updatedAt">Last Updated</option>
              <option value="createdAt">Date Created</option>
              <option value="admissionNumber">Admission Number</option>
              <option value="amount">Total Amount</option>
              <option value="balance">Balance</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Component
export default function ModernFeeManagement() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [view, setView] = useState('dashboard');
  const [feeBalances, setFeeBalances] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: '', name: '' });
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' // 'success', 'error', 'warning', 'info'
  });

  const [filters, setFilters] = useState({
    search: '',
    term: '',
    academicYear: '',
    paymentStatus: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  const [stats, setStats] = useState({
    totalAmount: 0,
    totalPaid: 0,
    totalBalance: 0,
    totalRecords: 0,
    paymentStatusDistribution: {},
    termDistribution: {},
    yearDistribution: {}
  });

  const [chartData, setChartData] = useState({
    statusDistribution: [],
    termDistribution: [],
    yearDistribution: [],
    monthlyTrends: []
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  const [formData, setFormData] = useState({
    term: 'Term 1',
    academicYear: '2024/2025',
    uploadedBy: 'Admin'
  });

  const fileInputRef = useRef(null);

  // Show notification function
  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Load fee balances - Only for existing students
  const loadFeeBalances = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/feebalances?page=${page}&limit=${pagination.limit}&includeStudent=true`;
      
      if (filters.search) url += `&admissionNumber=${encodeURIComponent(filters.search)}`;
      if (filters.term) url += `&term=${encodeURIComponent(filters.term)}`;
      if (filters.academicYear) url += `&academicYear=${encodeURIComponent(filters.academicYear)}`;
      if (filters.paymentStatus) url += `&paymentStatus=${encodeURIComponent(filters.paymentStatus)}`;
      if (filters.sortBy) url += `&sortBy=${encodeURIComponent(filters.sortBy)}`;
      if (filters.sortOrder) url += `&sortOrder=${encodeURIComponent(filters.sortOrder)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to load fee balances');
      
      if (data.success) {
        // Filter out fees for non-existent students
        const validFees = (data.data?.feeBalances || []).filter(fee => fee.student);
        setFeeBalances(validFees);
        setPagination({
          ...data.data?.pagination,
          total: validFees.length
        } || {
          page: page,
          limit: pagination.limit,
          total: validFees.length,
          pages: Math.ceil(validFees.length / pagination.limit)
        });
      } else {
        showNotification(data.error || 'Failed to load fee balances', 'error');
      }
    } catch (error) {
      console.error('Failed to load fee balances:', error);
      showNotification(error.message || 'Failed to load fee balances', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics - Only count fees for existing students
  const loadStatistics = async () => {
    try {
      const res = await fetch('/api/feebalances?action=stats');
      const data = await res.json();
      
      if (data.success) {
        // First load all fees to filter for existing students
        const feesRes = await fetch('/api/feebalances?limit=1000&includeStudent=true');
        const feesData = await feesRes.json();
        
        if (feesData.success) {
          const validFees = feesData.data?.feeBalances?.filter(fee => fee.student) || [];
          
          // Calculate totals from valid fees only
          const totals = validFees.reduce((acc, fee) => ({
            totalAmount: acc.totalAmount + (fee.amount || 0),
            totalPaid: acc.totalPaid + (fee.amountPaid || 0),
            totalBalance: acc.totalBalance + (fee.balance || 0),
            totalRecords: acc.totalRecords + 1
          }), { totalAmount: 0, totalPaid: 0, totalBalance: 0, totalRecords: 0 });
          
          // Calculate distributions from valid fees
          const statusDistribution = {};
          const termDistribution = {};
          const yearDistribution = {};
          
          validFees.forEach(fee => {
            statusDistribution[fee.paymentStatus] = (statusDistribution[fee.paymentStatus] || 0) + 1;
            termDistribution[fee.term] = (termDistribution[fee.term] || 0) + 1;
            yearDistribution[fee.academicYear] = (yearDistribution[fee.academicYear] || 0) + 1;
          });
          
          setStats({
            totalAmount: totals.totalAmount,
            totalPaid: totals.totalPaid,
            totalBalance: totals.totalBalance,
            totalRecords: totals.totalRecords,
            paymentStatusDistribution: statusDistribution,
            termDistribution: termDistribution,
            yearDistribution: yearDistribution
          });

          // Prepare chart data from valid fees
          const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
            name: status,
            value: count,
            color: status === 'paid' ? '#10B981' : status === 'partial' ? '#F59E0B' : '#EF4444'
          }));

          const termData = Object.entries(termDistribution).map(([term, count]) => ({
            name: term,
            value: count,
            color: term === 'Term 1' ? '#3B82F6' : term === 'Term 2' ? '#10B981' : '#8B5CF6'
          }));

          const yearData = Object.entries(yearDistribution).map(([year, count]) => ({
            name: year,
            value: count,
            color: '#6366F1'
          }));

          setChartData({
            statusDistribution: statusData,
            termDistribution: termData,
            yearDistribution: yearData,
            monthlyTrends: []
          });
        }
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
      showNotification('Failed to load statistics', 'error');
    }
  };

  // Load upload history
  const loadUploadHistory = async (page = 1) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/feebalances?action=uploads&page=${page}&limit=5`);
      const data = await res.json();
      if (data.success) {
        setUploadHistory(data.uploads || []);
      } else {
        showNotification('Failed to load upload history', 'error');
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      showNotification('Failed to load upload history', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load student info for a fee
  const loadStudentInfo = async (admissionNumber) => {
    try {
      const res = await fetch(`/api/feebalances?action=student-fees&admissionNumber=${admissionNumber}&includeStudent=true`);
      const data = await res.json();
      if (data.success) {
        return data.student || null;
      }
    } catch (error) {
      console.error('Failed to load student info:', error);
    }
    return null;
  };

  // Initial load
  useEffect(() => {
    loadFeeBalances();
    loadStatistics();
    loadUploadHistory();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      term: '',
      academicYear: '',
      paymentStatus: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    });
    loadFeeBalances(1);
  };

  const handleSort = (field) => {
    const newSortOrder = filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: newSortOrder
    }));
    loadFeeBalances(pagination.page);
  };

  const handleDrag = (active) => {
    setDragActive(active);
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification('Please select a file first', 'warning');
      return;
    }

    if (!formData.term || !formData.academicYear) {
      showNotification('Please select term and academic year', 'warning');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('term', formData.term);
    uploadFormData.append('academicYear', formData.academicYear);
    uploadFormData.append('uploadedBy', formData.uploadedBy);

    try {
      const response = await fetch('/api/feebalances', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      setResult(data);
      
      if (data.success) {
        showNotification(`✅ Upload successful! ${data.stats?.valid || 0} fee records processed.`, 'success');
        
        await Promise.all([loadFeeBalances(1), loadUploadHistory(1), loadStatistics()]);
        setFile(null);
        setFormData({
          term: 'Term 1',
          academicYear: '2024/2025',
          uploadedBy: 'Admin'
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        showNotification(data.error || 'Upload failed', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showNotification(error.message || 'Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (type, id, name) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      let url;
      let method = 'DELETE';
      
      if (deleteTarget.type === 'batch') {
        url = `/api/feebalances?batchId=${deleteTarget.id}`;
      } else {
        url = `/api/feebalances?feeId=${deleteTarget.id}`;
      }

      const res = await fetch(url, { method });
      const data = await res.json();
      
      if (data.success) {
        showNotification(data.message || 'Deleted successfully', 'success');
        await Promise.all([loadFeeBalances(pagination.page), loadUploadHistory(1), loadStatistics()]);
        if (deleteTarget.type === 'fee') {
          setSelectedFee(null);
          setSelectedStudent(null);
        }
      } else {
        showNotification(data.message || 'Failed to delete', 'error');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showNotification('Failed to delete', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget({ type: '', id: '', name: '' });
    }
  };

  const updateFee = async (feeId, feeData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feebalances`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: feeId, ...feeData })
      });
      
      const data = await res.json();
      
      if (data.success) {
        showNotification('Fee balance updated successfully', 'success');
        await loadFeeBalances(pagination.page);
        setEditingFee(null);
        setSelectedFee(data.data);
      } else {
        showNotification(data.error || 'Failed to update fee balance', 'error');
      }
    } catch (error) {
      console.error('Update failed:', error);
      showNotification('Failed to update fee balance', 'error');
    } finally {
      setLoading(false);
    }
  };

  const viewFeeDetails = async (fee) => {
    setSelectedFee(fee);
    const student = await loadStudentInfo(fee.admissionNumber);
    setSelectedStudent(student);
  };

  const editFee = async (fee) => {
    setSelectedFee(fee);
    const student = await loadStudentInfo(fee.admissionNumber);
    setSelectedStudent(student);
    setEditingFee(fee);
  };

  const downloadCSVTemplate = () => {
    const template = `admissionNumber,amount,amountPaid,term,academicYear,dueDate
3407,50000,25000,Term 1,2024/2025,2024-03-31
3408,45000,45000,Term 1,2024/2025,2024-03-31
3409,50000,30000,Term 1,2024/2025,2024-03-31
3410,45000,0,Term 1,2024/2025,2024-03-31`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fee_balance_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('CSV template downloaded', 'success');
  };

  const downloadExcelTemplate = () => {
    try {
      const sampleData = [
        ['admissionNumber', 'amount', 'amountPaid', 'term', 'academicYear', 'dueDate'],
        ['3407', '50000', '25000', 'Term 1', '2024/2025', '2024-03-31'],
        ['3408', '45000', '45000', 'Term 1', '2024/2025', '2024-03-31']
      ];

      const ws = XLSX.utils.aoa_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Fee Balances");
      XLSX.writeFile(wb, 'fee_balance_template.xlsx');
      showNotification('Excel template downloaded', 'success');
    } catch (error) {
      console.error('Error downloading Excel template:', error);
      showNotification('Failed to download template', 'error');
    }
  };

  const exportFeesToCSV = () => {
    const validFees = feeBalances.filter(fee => fee.student);
    
    if (validFees.length === 0) {
      showNotification('No valid fees to export', 'warning');
      return;
    }

    const headers = ['Admission Number', 'Student Name', 'Term', 'Academic Year', 'Total Amount', 'Amount Paid', 'Balance', 'Payment Status', 'Due Date'];
    const data = validFees.map(fee => {
      return [
        fee.admissionNumber,
        fee.student ? `${fee.student.firstName} ${fee.student.lastName}` : 'Unknown Student',
        fee.term,
        fee.academicYear,
        fee.amount,
        fee.amountPaid,
        fee.balance,
        fee.paymentStatus,
        fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : ''
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
    a.download = `fee_balances_export_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Exported ${validFees.length} fee records to CSV`, 'success');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadFeeBalances(newPage);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading && view === 'balances' && feeBalances.length === 0) {
    return <ModernLoadingSpinner message="Loading fee balances..." size="large" />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <IoCash className="text-2xl text-yellow-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Fee Management System</h1>
              <p className="text-blue-100 text-lg mt-2 max-w-2xl">
                Comprehensive fee tracking, management, and analytics for all students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => {
                setLoading(true);
                loadStatistics();
                loadFeeBalances();
              }}
              disabled={loading}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <CircularProgress size={16} color="inherit" thickness={6} />
              ) : (
                <FiRefreshCw className="text-base" />
              )}
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>

            <button
              onClick={exportFeesToCSV}
              disabled={feeBalances.length === 0 || loading}
              className="text-white/80 px-6 py-3 rounded-xl font-bold text-base border border-white/20 flex items-center gap-2 disabled:opacity-50"
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
            onClick={() => setView('dashboard')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'dashboard'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <FiBarChart2 className="text-sm" />
            Dashboard
          </button>
          <button
            onClick={() => {
              setView('upload');
              setFile(null);
              setResult(null);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'upload'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <FiUpload className="text-sm" />
            Bulk Upload
          </button>
          <button
            onClick={() => {
              setView('balances');
              loadFeeBalances(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'balances'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <IoWallet className="text-sm" />
            Fee Balances ({stats.totalRecords || 0})
          </button>
          <button
            onClick={() => {
              setView('history');
              loadUploadHistory(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'history'
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <FiClock className="text-sm" />
            Upload History
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatisticsCard title="Total Fees Amount" value={stats.totalAmount} icon={IoCash} color="from-blue-500 to-blue-700" trend={5.2} prefix="KES " />
              <StatisticsCard title="Total Amount Paid" value={stats.totalPaid} icon={FiCheckCircle} color="from-emerald-500 to-emerald-700" trend={8.7} prefix="KES " />
              <StatisticsCard title="Total Balance" value={stats.totalBalance} icon={FiAlertCircle} color="from-red-500 to-red-700" trend={-3.1} prefix="KES " />
              <StatisticsCard title="Total Records" value={stats.totalRecords} icon={FiUsers} color="from-purple-500 to-purple-700" trend={12.5} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ModernFeeChart data={chartData.statusDistribution} type="pie" title="Payment Status Distribution" colors={['#10B981', '#F59E0B', '#EF4444']} height={400} />
              <ModernFeeChart data={chartData.termDistribution} type="bar" title="Term Distribution" height={400} />
            </div>

            {/* Recent Fee Balances */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Recent Fee Balances</h3>
                <button onClick={() => setView('balances')} className="px-4 py-2 text-blue-600 font-bold text-base flex items-center gap-2">View All <FiChevronRight /></button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Term/Year</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Paid</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Balance</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {feeBalances.slice(0, 5).map(fee => (
                      <tr key={fee.id}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">#{fee.admissionNumber}</div>
                          {fee.student && <div className="text-gray-600 text-sm">{fee.student.firstName} {fee.student.lastName}</div>}
                        </td>
                        <td className="px-6 py-4"><div className="text-gray-700">{fee.term} {fee.academicYear}</div></td>
                        <td className="px-6 py-4"><div className="font-bold text-gray-900">{formatCurrency(fee.amount)}</div></td>
                        <td className="px-6 py-4"><div className="font-bold text-emerald-700">{formatCurrency(fee.amountPaid)}</div></td>
                        <td className="px-6 py-4"><div className={`font-bold ${fee.balance > 0 ? 'text-red-700' : 'text-green-700'}`}>{formatCurrency(fee.balance)}</div></td>
                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${fee.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : fee.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{fee.paymentStatus.toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Upload View */}
        {view === 'upload' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300">
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                    <FiInfo className="text-blue-700 text-2xl" /> Upload Configuration
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Term *</label>
                      <select value={formData.term} onChange={(e) => setFormData({...formData, term: e.target.value})} className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base">
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Academic Year *</label>
                      <input type="text" required value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})} placeholder="e.g., 2024/2025" className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base" />
                    </div>
                  </div>
                </div>

                <ModernFileUpload onFileSelect={handleFileSelect} file={file} onRemove={() => setFile(null)} dragActive={dragActive} onDrag={handleDrag} showNotification={showNotification} />

                {file && (
                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl">
                          {file.name.endsWith('.csv') ? <FiFile className="text-blue-700 text-3xl" /> : <IoDocumentText className="text-green-700 text-3xl" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg truncate max-w-[200px] md:max-w-none">{file.name}</p>
                          <div className="flex flex-col md:flex-row md:items-center gap-6 mt-2">
                            <span className="text-gray-600 font-semibold text-base">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span className="px-3 py-1.5 bg-gray-100 rounded-lg font-bold text-gray-700 text-sm">{file.name.split('.').pop().toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setFile(null)} className="p-3 rounded-xl text-gray-600"><FiX className="text-xl" /></button>
                        <button
                          onClick={handleUpload}
                          disabled={uploading || !formData.term || !formData.academicYear}
                          className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl font-bold flex items-center gap-3 text-base shadow-xl disabled:opacity-50"
                        >
                          {uploading ? (<><CircularProgress size={18} className="text-white" /><span>Processing...</span></>) : (<><FiUpload className="text-base" /><span>Upload Now</span></>)}
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
                    <button onClick={downloadCSVTemplate} className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <FiFile className="text-blue-600 text-2xl" />
                      <span className="font-bold text-gray-900 text-base">CSV Template</span>
                    </button>
                    <button onClick={downloadExcelTemplate} className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
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
                      <span className="text-blue-800 font-semibold text-base">Admission numbers must match existing students</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-base">3</span>
                      </div>
                      <span className="text-blue-800 font-semibold text-base">Keep file size under 10MB</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-base">4</span>
                      </div>
                      <span className="text-blue-800 font-semibold text-base">Amounts should be in KES (Kenyan Shillings)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Balances View */}
        {view === 'balances' && (
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
                      onKeyDown={(e) => e.key === 'Enter' && loadFeeBalances(1)}
                      placeholder="Search by admission number or student name..."
                      className="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-400 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-600 text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 lg:flex-none px-6 py-4 bg-white border-2 border-gray-400 rounded-2xl text-gray-700 font-bold flex items-center justify-center gap-3 text-base"
                  >
                    <IoFilterIcon />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  <button
                    onClick={() => loadFeeBalances(1)}
                    disabled={loading}
                    className="flex-1 lg:flex-none px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50"
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
                <ModernLoadingSpinner message="Loading fee balances..." size="large" />
              </div>
            ) : (
              <>
                {feeBalances.length > 0 ? (
                  <>
                    <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-2xl">
                      <div className="px-8 py-6 border-b-2 border-gray-300 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <h3 className="text-2xl font-bold text-gray-900">Fee Balances ({pagination.total})</h3>
                          <div className="flex items-center gap-4">
                            <div className="text-gray-600 font-bold bg-white px-4 py-2 rounded-xl border-2 text-base">
                              Page {pagination.page} of {pagination.pages}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[768px]">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Student
                              </th>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Term/Year
                              </th>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Amount Details
                              </th>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                     <tbody className="divide-y divide-gray-100">
  {feeBalances.map(fee => (
    <tr
      key={fee.id}
      className="hover:bg-gray-50 transition"
    >
      {/* Student */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
            <FiUser className="text-sm" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              #{fee.admissionNumber}
            </div>
            {fee.student && (
              <div className="text-xs text-gray-500">
                {fee.student.firstName} {fee.student.lastName}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Term */}
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">
          {fee.term}
        </div>
        <div className="text-xs text-gray-500">
          {fee.academicYear}
        </div>
      </td>

      {/* Amounts */}
      <td className="px-6 py-4">
        <div className="space-y-0.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Total</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(fee.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Paid</span>
            <span className="font-medium text-emerald-600">
              {formatCurrency(fee.amountPaid)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Balance</span>
            <span
              className={`font-medium ${
                fee.balance > 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {formatCurrency(fee.balance)}
            </span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
            fee.paymentStatus === 'paid'
              ? 'bg-green-50 text-green-700'
              : fee.paymentStatus === 'partial'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {fee.paymentStatus.toUpperCase()}
        </span>

        {fee.dueDate && (
          <div className="text-xs text-gray-500 mt-1">
            Due {new Date(fee.dueDate).toLocaleDateString()}
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => viewFeeDetails(fee)}
            className="px-2.5 py-1.5 text-xs rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
          >
            View
          </button>
          <button
            onClick={() => editFee(fee)}
            className="px-2.5 py-1.5 text-xs rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
          >
            Edit
          </button>
          <button
            onClick={() =>
              handleDelete('fee', fee.id, `Fee for ${fee.admissionNumber}`)
            }
            className="px-2.5 py-1.5 text-xs rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t-2 border-gray-300">
                        <div className="text-gray-700 font-bold text-base">
                          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} fees
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                className={`w-12 h-12 rounded-xl font-bold text-sm ${
                                  pagination.page === pageNum
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-2xl'
                                    : 'border-2 border-gray-400'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiArrowRight className="text-base" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-300 shadow-xl">
                    <IoWallet className="text-6xl text-gray-300 mx-auto mb-6" />
                    <p className="text-gray-600 text-xl font-bold mb-4">No fee balances found</p>
                    {(filters.search || filters.term || filters.academicYear) && (
                      <button
                        onClick={handleClearFilters}
                        className="text-blue-600 font-bold text-lg"
                      >
                        Clear filters to see all fees
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* History View */}
        {view === 'history' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Upload History</h3>
                <p className="text-gray-600 mt-2 text-base">Track all your fee bulk upload activities</p>
              </div>
              <button
                onClick={() => loadUploadHistory(1)}
                disabled={historyLoading}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50"
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
                <p className="text-gray-500 text-xl font-bold mb-4">No upload history found</p>
                <p className="text-gray-400 text-base">Upload your first file to see history here</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[768px]">
                    <thead className="bg-gradient-to-r from-gray-100 to-white">
                      <tr>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">Upload Details</th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">Statistics</th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-200">
                      {uploadHistory.map(upload => (
                        <tr key={upload.id}>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                                <FiFile className="text-blue-700 text-xl" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-base truncate max-w-[250px] lg:max-w-md">
                                  {upload.fileName}
                                </div>
                                <div className="text-gray-600 mt-2 space-y-1">
                                  <div className="text-sm font-semibold">
                                    {upload.term} • {upload.academicYear}
                                  </div>
                                  <div className="text-sm">
                                    {new Date(upload.uploadDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    By: {upload.uploadedBy}
                                  </div>
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
                              {upload.feeCount > 0 && (
                                <div className="text-blue-700 font-bold text-sm">
                                  {upload.feeCount} fee records created
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <button
                              onClick={() => handleDelete('batch', upload.id, upload.fileName)}
                              className="px-5 py-2.5 bg-red-50 text-red-700 rounded-xl font-bold text-sm"
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

      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {notification.message}
        </MuiAlert>
      </Snackbar>

      {/* Modals */}
      {selectedFee && !editingFee && (
        <ModernFeeDetailModal
          fee={selectedFee}
          student={selectedStudent}
          onClose={() => {
            setSelectedFee(null);
            setSelectedStudent(null);
          }}
          onEdit={() => editFee(selectedFee)}
          onDelete={(admissionNumber) => handleDelete('fee', selectedFee.id, `Fee for ${admissionNumber}`)}
          showNotification={showNotification}
        />
      )}

      {editingFee && (
        <ModernFeeEditModal
          fee={editingFee}
          student={selectedStudent}
          onClose={() => {
            setEditingFee(null);
            setSelectedFee(null);
            setSelectedStudent(null);
          }}
          onSave={updateFee}
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
          showNotification={showNotification}
        />
      )}
    </div>
  );
}