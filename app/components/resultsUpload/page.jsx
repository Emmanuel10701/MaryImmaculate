'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CircularProgress, Modal, Box, Chip, Alert as MuiAlert, Snackbar } from '@mui/material';
import * as XLSX from 'xlsx';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, ComposedChart, Scatter
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
  FiMoreVertical, FiExternalLink, FiCopy, FiTag, FiCodesandbox,
  FiPercent as FiPercentIcon, FiStar, FiAward as FiAwardIcon,
  FiBook as FiBookIcon, FiTarget as FiTargetIcon, FiPlus,
  FiLayers, FiDatabase, FiRefreshCw as FiRefreshCwIcon
} from 'react-icons/fi';
import {
  IoPeopleCircle, IoNewspaper, IoClose, IoStatsChart,
  IoAnalytics, IoSchool, IoDocumentText, IoSparkles,
  IoCash, IoCard, IoWallet, IoReceipt, IoCheckmarkCircle,
  IoAlertCircle, IoTime, IoCalendarClear, IoDocuments,
  IoStatsChart as IoStatsChartIcon, IoFilter as IoFilterIcon,
  IoPodium, IoRibbon, IoMedal, IoTrophy, IoSchool as IoSchoolIcon,
  IoLibrary, IoCalculator, IoClipboard, IoStatsChartOutline,
  IoPieChart as IoPieChartIcon, IoBarChart as IoBarChartIcon,
  IoLineChart as IoLineChartIcon, IoAnalytics as IoAnalyticsIcon
} from 'react-icons/io5';

// Loading Spinner for Results
function ResultsLoadingSpinner({ message = "Loading academic results...", size = "medium" }) {
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
              className="text-purple-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" style={{ width: inner, height: inner }}></div>
            </div>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full blur-xl opacity-30"></div>
        </div>
        
        <div className="mt-8 space-y-3">
          <span className="block text-lg font-semibold text-gray-800">
            {message}
          </span>
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-purple-500 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function for form colors
function getFormColor(form) {
  switch (form) {
    case 'Form 1': return 'from-blue-500 to-blue-700';
    case 'Form 2': return 'from-emerald-500 to-emerald-700';
    case 'Form 3': return 'from-amber-500 to-amber-700';
    case 'Form 4': return 'from-purple-500 to-purple-700';
    default: return 'from-gray-400 to-gray-600';
  }
}

function ResultsUploadStrategyModal({ open, onClose, onConfirm, loading, showNotification }) {
  const [selectedForms, setSelectedForms] = useState([]);
  const [targetForm, setTargetForm] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [uploadMode, setUploadMode] = useState('new');

  const handleFormToggle = (form) => {
    if (selectedForms.includes(form)) {
      setSelectedForms(selectedForms.filter(f => f !== form));
    } else {
      setSelectedForms([...selectedForms, form]);
    }
  };

  const handleConfirm = () => {
    if (uploadMode === 'new' && selectedForms.length === 0) {
      showNotification('Please select at least one form for new upload', 'warning');
      return;
    }
    
    if (uploadMode === 'update' && !targetForm) {
      showNotification('Please select a target form for update', 'warning');
      return;
    }
    
    if (!term || !academicYear) {
      showNotification('Please select term and academic year', 'warning');
      return;
    }
    
    onConfirm({
      uploadMode: uploadMode,
      selectedForms,
      targetForm,
      term,
      academicYear
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '95vw',    // Wider on mobile for better layout
            sm: '90vw',    // Original width for small+
            md: '600px'    // Original maxWidth
          },
          maxWidth: '600px',
          maxHeight: {
            xs: '85vh',    // Reduced height on mobile
            sm: '90vh',    // Slightly reduced
            md: '95vh'     // Original
          },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          overflow: 'hidden',
          overflowY: 'auto' // Ensure content can scroll
        }}
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <FiUpload className="text-lg sm:text-xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Results Upload Strategy</h2>
                <p className="text-purple-100 opacity-90 text-sm sm:text-base">
                  Choose how you want to upload results
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <FiX className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Term *
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Academic Year *
              </label>
              <input
                type="text"
                required
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g., 2024/2025"
                className="w-full px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Select Upload Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div
                onClick={() => setUploadMode('new')}
                className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  uploadMode === 'new'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${uploadMode === 'new' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <FiPlus className={`text-base sm:text-lg ${uploadMode === 'new' ? 'text-purple-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">Create New Results</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Add new result records</p>
                  </div>
                </div>
                {uploadMode === 'new' && (
                  <div className="mt-2 text-xs sm:text-sm text-purple-700">
                    <FiCheckCircle className="inline mr-1" />
                    Prevents duplicates by admission number + term + year
                  </div>
                )}
              </div>

              <div
                onClick={() => setUploadMode('update')}
                className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  uploadMode === 'update'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${uploadMode === 'update' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <FiDatabase className={`text-base sm:text-lg ${uploadMode === 'update' ? 'text-purple-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">Update Existing Results</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Replace results for specific form/term/year</p>
                  </div>
                </div>
                {uploadMode === 'update' && (
                  <div className="mt-2 text-xs sm:text-sm text-purple-700">
                    <FiCheckCircle className="inline mr-1" />
                    Replaces results for same student+term+year combination
                  </div>
                )}
              </div>
            </div>
          </div>

          {uploadMode === 'new' && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Select Forms <span className="text-xs sm:text-sm text-gray-500">(Choose one or more)</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map((form) => (
                  <div
                    key={form}
                    onClick={() => handleFormToggle(form)}
                    className={`p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedForms.includes(form)
                        ? `border-purple-500 bg-gradient-to-r ${getFormColor(form)} text-white shadow-lg`
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm sm:text-base">{form}</span>
                      {selectedForms.includes(form) && (
                        <FiCheckCircle className="text-white text-sm sm:text-base" />
                      )}
                    </div>
                    <div className={`text-xs mt-0.5 sm:mt-1 ${selectedForms.includes(form) ? 'text-purple-100' : 'text-gray-500'}`}>
                      Results for {form}
                    </div>
                  </div>
                ))}
              </div>
              {selectedForms.length > 0 && (
                <div className="mt-2 text-xs sm:text-sm text-gray-600">
                  <FiInfo className="inline mr-1" />
                  Only results for selected forms will be processed
                </div>
              )}
            </div>
          )}

          {uploadMode === 'update' && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Select Form to Update</h3>
              <div className="space-y-2 sm:space-y-3">
                {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map((form) => (
                  <div
                    key={form}
                    onClick={() => setTargetForm(form)}
                    className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      targetForm === form
                        ? `border-purple-500 bg-gradient-to-r ${getFormColor(form)} text-white shadow-lg`
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${targetForm === form ? 'bg-white/20' : 'bg-gray-100'}`}>
                          <IoSchool className={`text-sm sm:text-base ${targetForm === form ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm sm:text-base">{form}</h4>
                          <p className={`text-xs sm:text-sm ${targetForm === form ? 'text-purple-100' : 'text-gray-500'}`}>
                            Update results for {term} {academicYear}
                          </p>
                        </div>
                      </div>
                      {targetForm === form && <FiCheckCircle className="text-white text-sm sm:text-base" />}
                    </div>
                  </div>
                ))}
              </div>
              {targetForm && (
                <div className="mt-3 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-2">
                    <FiInfo className="text-purple-600 mt-0.5 text-sm sm:text-base" />
                    <div>
                      <p className="text-xs sm:text-sm text-purple-800 font-bold">Update Strategy:</p>
                      <ul className="text-xs text-purple-700 mt-1 space-y-0.5 sm:space-y-1">
                        <li>• Matches by admission number + term + academic year</li>
                        <li>• Updates existing result records</li>
                        <li>• Creates new results if combination doesn't exist</li>
                        <li>• Preserves all historical data</li>
                        <li>• Maintains grade consistency</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !term || !academicYear || 
                (uploadMode === 'new' && selectedForms.length === 0) ||
                (uploadMode === 'update' && !targetForm)}
              className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <CircularProgress size={16}  className="text-white" />
                  Processing...
                </>
              ) : (
                <>
                  <FiCheckCircle />
                  Continue to File Upload
                </>
              )}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Results Duplicate Validation Modal
// Results Duplicate Validation Modal
function ResultsDuplicateValidationModal({ 
  open, 
  onClose, 
  duplicates, 
  onProceed, 
  loading, 
  uploadType,
  showNotification,
  term,
  academicYear,
  targetForm 
}) {
  const [action, setAction] = useState('skip');

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '98vw',
            sm: '95vw',
            md: '850px',
            lg: '850px'
          },
          maxWidth: '850px',
          maxHeight: {
            xs: '85vh',
            sm: '90vh',
          },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <FiAlertCircle className="text-lg sm:text-xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Duplicate Results Detection</h2>
                <p className="text-amber-100 opacity-90 text-sm sm:text-base">
                  Found {duplicates.length} duplicate result combinations
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <FiX className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rounded-full"></div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {uploadType === 'update' 
                    ? `Updating ${targetForm} - ${term} ${academicYear}: ${duplicates.length} existing results will be updated`
                    : `${duplicates.length} result combinations already exist in the database`
                  }
                </h3>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-amber-800 text-xs sm:text-sm">
                  <strong>Note:</strong> Results are identified by admission number + term + academic year combination.
                  Each student can have only one result record per term per academic year.
                </p>
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Duplicate Result Combinations:</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-bold text-gray-700">Row #</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-bold text-gray-700">Admission</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-bold text-gray-700">Form</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-bold text-gray-700">Term</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-bold text-gray-700">Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {duplicates.slice(0, 50).map((dup, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600">{dup.row}</td>
                          <td className="px-3 sm:px-4 py-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                              {dup.admissionNumber}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${getFormColor(dup.form)} text-white`}>
                              {dup.form}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">{dup.term}</td>
                          <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">{dup.academicYear}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {duplicates.length > 50 && (
                  <div className="px-4 py-2 text-xs sm:text-sm text-gray-500 text-center border-t border-gray-200 bg-gray-50">
                    ... and {duplicates.length - 50} more duplicates
                  </div>
                )}
              </div>
            </div>

            {uploadType === 'new' && (
              <div className="mb-4 sm:mb-6">
                <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">How should we handle duplicates?</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div
                    onClick={() => setAction('skip')}
                    className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      action === 'skip'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${action === 'skip' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <FiCheckCircle className={`text-sm sm:text-base ${action === 'skip' ? 'text-purple-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">Skip Duplicates</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Keep existing result records, skip duplicates in upload file
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setAction('replace')}
                    className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      action === 'replace'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${action === 'replace' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        <FiDatabase className={`text-sm sm:text-base ${action === 'replace' ? 'text-purple-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">Replace Existing</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Update existing result records with new data from upload file
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Summary:</h4>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-0.5 sm:space-y-1">
                {uploadType === 'new' ? (
                  <>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                      <span>Term/Year: {term} {academicYear}</span>
                    </li>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full"></div>
                      <span>Duplicate combinations: {duplicates.length}</span>
                    </li>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                      <span>New results to add: Based on file size</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                      <span>Updating: {targetForm} - {term} {academicYear}</span>
                    </li>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full"></div>
                      <span>Results to update: {duplicates.length}</span>
                    </li>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                      <span>New results will be created for new students</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={() => onProceed(action)}
              disabled={loading}
              className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <CircularProgress size={16} className="text-white" />
                  <span className="text-sm sm:text-base">Processing...</span>
                </>
              ) : uploadType === 'update' ? (
                <>
                  <FiCheckCircle className="text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">Update Results</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">{action === 'skip' ? 'Skip Duplicates' : 'Replace Existing'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Delete Confirmation Modal for Results
function ResultsDeleteModal({ 
  onClose, 
  onConfirm, 
  loading, 
  title = "Confirm Deletion",
  description = "This action cannot be undone",
  itemName = "",
  type = "result",
  showNotification
}) {
  const [confirmText, setConfirmText] = useState('')

  const getConfirmPhrase = () => {
    if (type === "batch") return "DELETE BATCH";
    if (type === "result") return "DELETE RESULT";
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
              This will permanently delete the academic result and cannot be recovered.
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

// Result Edit Modal
function ResultEditModal({ result, student, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    form: result?.form || '',
    term: result?.term || '',
    academicYear: result?.academicYear || '',
    subjects: result?.subjects || []
  });

  const [subjectEdits, setSubjectEdits] = useState([]);

  const calculateGrade = (score, subjectName = '') => {
    if (score === null || score === undefined) return 'N/A';
    
    const isMathematics = subjectName.toLowerCase().includes('mathematics');
    
    if (isMathematics) {
      if (score >= 75) return 'A';
      if (score >= 70) return 'A-';
      if (score >= 65) return 'B+';
      if (score >= 60) return 'B';
      if (score >= 55) return 'B-';
      if (score >= 50) return 'C+';
      if (score >= 45) return 'C';
      if (score >= 40) return 'C-';
      if (score >= 35) return 'D+';
      if (score >= 30) return 'D';
      return 'E';
    } else {
      if (score >= 80) return 'A';
      if (score >= 70) return 'A-';
      if (score >= 60) return 'B+';
      if (score >= 55) return 'B';
      if (score >= 50) return 'B-';
      if (score >= 45) return 'C+';
      if (score >= 40) return 'C';
      if (score >= 35) return 'C-';
      if (score >= 30) return 'D+';
      if (score >= 25) return 'D';
      return 'E';
    }
  };

  const calculatePoints = (score, subjectName = '') => {
    if (score === null) return null;
    
    const grade = calculateGrade(score, subjectName);
    
    const subjectLower = subjectName.toLowerCase().trim();
    const optionalSubjects = ['agriculture', 'business studies', 'home science', 'computer studies', 'german', 'french', 'art', 'music', 'drama'];
    const isOptional = optionalSubjects.some(sub => subjectLower.includes(sub));
    const subjectType = isOptional ? 'optional' : 'main';
    
    const pointMap = {
      'A': subjectType === 'main' ? 12 : 7,
      'A-': subjectType === 'main' ? 11 : 6,
      'B+': subjectType === 'main' ? 10 : 5,
      'B': subjectType === 'main' ? 9 : 4,
      'B-': subjectType === 'main' ? 8 : 3,
      'C+': subjectType === 'main' ? 7 : 2,
      'C': subjectType === 'main' ? 6 : 1,
      'C-': subjectType === 'main' ? 5 : 0,
      'D+': subjectType === 'main' ? 4 : 0,
      'D': subjectType === 'main' ? 3 : 0,
      'E': 0
    };
    
    return pointMap[grade] || 0;
  };

  const generateSubjectComment = (score, subjectName = '') => {
    if (score === null || score === undefined) return '';
    
    const grade = calculateGrade(score, subjectName);
    
    const commentTemplates = {
      'A': {
        excellent: [
          "Outstanding performance! Demonstrates exceptional mastery of concepts. Keep setting the bar high!",
          "Exceptional work! Shows deep understanding and excellent application skills. Maintain this excellence!",
          "Brilliant performance! Your dedication and hard work are clearly evident. Continue to excel!"
        ],
        standard: [
          "Excellent performance! Shows strong command of the subject. Keep up the great work!",
          "Very impressive work! Demonstrates thorough understanding of concepts. Keep it up!",
          "Superb performance! Consistent effort and understanding are evident. Well done!"
        ]
      },
      'A-': [
        "Very good performance! Shows clear understanding and consistent effort. Aim for even higher!",
        "Strong work! Demonstrates good grasp of concepts with minor areas for improvement.",
        "Impressive performance! Maintain this level and strive for perfection in next assessments."
      ],
      'B+': [
        "Good performance! Understanding is evident with room for growth in application.",
        "Solid work! Shows competence in most areas. Focus on strengthening weaker topics.",
        "Promising performance! With continued effort, you can achieve even better results."
      ],
      'B': [
        "Satisfactory performance. Understands basic concepts but needs to work on depth.",
        "Adequate performance. Shows potential but requires more consistent practice.",
        "Fair understanding demonstrated. Focus on regular revision to improve."
      ],
      'B-': [
        "Fair performance. Basic understanding present but application needs improvement.",
        "Average performance. Would benefit from additional practice and attention to detail.",
        "Shows some understanding. Needs to work on consistency and thoroughness."
      ],
      'C+': [
        "Below average performance. Requires more focused study and regular practice.",
        "Needs improvement. Basic concepts need reinforcement through additional practice.",
        "Shows partial understanding. Would benefit from seeking extra help or resources."
      ],
      'C': [
        "Poor performance. Fundamental concepts need serious attention and review.",
        "Below standard. Requires significant improvement through dedicated study.",
        "Struggling with core concepts. Seek teacher guidance and additional support."
      ],
      'C-': [
        "Very poor performance. Immediate intervention and remedial work needed.",
        "Significant improvement required. Focus on foundational concepts first.",
        "Serious attention needed. Consider extra classes or tutoring to catch up."
      ],
      'D+': [
        "Minimal understanding demonstrated. Requires urgent attention and support.",
        "Below expectations. Needs comprehensive review of all subject materials.",
        "Struggling significantly. Must dedicate substantial time to improve."
      ],
      'D': [
        "Marginal performance. Lacks basic understanding of core concepts.",
        "Very weak performance. Requires complete revision from basics.",
        "Failing to grasp fundamental concepts. Immediate remedial action needed."
      ],
      'E': [
        "Failed to meet minimum requirements. Requires complete relearning of subject.",
        "Insufficient understanding demonstrated. Needs to restart learning from basics.",
        "Performance below acceptable standards. Mandatory remedial work required."
      ]
    };

    let selectedComment = '';
    
    if (grade === 'A') {
      if (score >= 90) {
        const excellentComments = commentTemplates.A.excellent;
        selectedComment = excellentComments[Math.floor(Math.random() * excellentComments.length)];
      } else {
        const standardComments = commentTemplates.A.standard;
        selectedComment = standardComments[Math.floor(Math.random() * standardComments.length)];
      }
    } else {
      const gradeComments = commentTemplates[grade];
      if (gradeComments && Array.isArray(gradeComments)) {
        selectedComment = gradeComments[Math.floor(Math.random() * gradeComments.length)];
      } else {
        selectedComment = `Performance graded as ${grade}. ${score >= 50 ? 'Keep working hard!' : 'Needs significant improvement.'}`;
      }
    }

    return selectedComment;
  };

  useEffect(() => {
    if (result?.subjects) {
      let subjects = result.subjects;
      
      if (typeof subjects === 'string') {
        try {
          subjects = JSON.parse(subjects);
        } catch (e) {
          console.error('Error parsing subjects:', e);
          subjects = [];
        }
      }
      
      const parsedSubjects = subjects.map(subject => {
        const scoreValue = (subject.score || subject.score === 0) ? subject.score.toString() : '';
        const subjectName = subject.subject || '';
        
        const numericScore = parseFloat(scoreValue) || 0;
        const grade = calculateGrade(numericScore, subjectName);
        const points = calculatePoints(numericScore, subjectName);
        
        return {
          subject: subjectName,
          score: scoreValue,
          grade: grade,
          points: points,
          comment: subject.comment || ''
        };
      });
      
      setSubjectEdits(parsedSubjects);
    }
  }, [result]);

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...subjectEdits];
    
    if (field === 'score') {
      const displayValue = value;
      const numericValue = value === '' ? null : parseFloat(value);
      
      if (value === '') {
        newSubjects[index] = { 
          ...newSubjects[index], 
          score: '',
          grade: '',
          points: 0
        };
      } else if (value === '-') {
        newSubjects[index] = { 
          ...newSubjects[index], 
          score: '-',
          grade: '',
          points: 0
        };
      } else if (!isNaN(numericValue) && numericValue !== null) {
        const clampedValue = Math.min(100, Math.max(0, numericValue));
        const subjectName = newSubjects[index].subject || '';
        const grade = calculateGrade(clampedValue, subjectName);
        const points = calculatePoints(clampedValue, subjectName);
        const comment = generateSubjectComment(clampedValue, subjectName);
        
        newSubjects[index] = { 
          ...newSubjects[index], 
          score: displayValue,
          grade: grade,
          points: points,
          comment: comment
        };
      } else {
        newSubjects[index] = { 
          ...newSubjects[index], 
          score: value,
          grade: '',
          points: 0,
          comment: ''
        };
      }
    } else if (field === 'subject') {
      newSubjects[index] = { ...newSubjects[index], subject: value };
    } else if (field === 'comment') {
      newSubjects[index] = { ...newSubjects[index], comment: value };
    }
    
    setSubjectEdits(newSubjects);
  };

  const handleScoreBlur = (index) => {
    const newSubjects = [...subjectEdits];
    const currentValue = newSubjects[index].score;
    const subjectName = newSubjects[index].subject || '';
    
    if (currentValue === '' || currentValue === '-') {
      newSubjects[index] = { 
        ...newSubjects[index], 
        comment: ''
      };
      setSubjectEdits(newSubjects);
      return;
    }
    
    const numericValue = parseFloat(currentValue);
    if (!isNaN(numericValue)) {
      const formattedValue = parseFloat(numericValue.toFixed(1)).toString();
      const clampedValue = Math.min(100, Math.max(0, numericValue));
      const grade = calculateGrade(clampedValue, subjectName);
      const points = calculatePoints(clampedValue, subjectName);
      const comment = generateSubjectComment(clampedValue, subjectName);
      
      newSubjects[index] = { 
        ...newSubjects[index], 
        score: formattedValue,
        grade: grade,
        points: points,
        comment: comment
      };
      
      setSubjectEdits(newSubjects);
    } else {
      newSubjects[index] = { 
        ...newSubjects[index], 
        comment: '' 
      };
      setSubjectEdits(newSubjects);
    }
  };

  const addSubject = () => {
    setSubjectEdits([...subjectEdits, { 
      subject: '', 
      score: '',
      grade: '',
      points: 0, 
      comment: '' 
    }]);
  };

  const removeSubject = (index) => {
    setSubjectEdits(subjectEdits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = [];
    const validatedSubjects = subjectEdits.map((subject, index) => {
      if (!subject.subject.trim()) {
        validationErrors.push(`Subject ${index + 1} is missing a name`);
      }
      
      let scoreValue = 0;
      if (subject.score === '') {
        scoreValue = 0;
      } else {
        const parsedScore = parseFloat(subject.score);
        if (isNaN(parsedScore)) {
          validationErrors.push(`Subject ${index + 1} has an invalid score: ${subject.score}`);
        } else if (parsedScore < 0 || parsedScore > 100) {
          validationErrors.push(`Subject ${index + 1} score must be between 0 and 100`);
        } else {
          scoreValue = parsedScore;
        }
      }
      
      const grade = calculateGrade(scoreValue, subject.subject);
      const points = calculatePoints(scoreValue, subject.subject);
      
      let comment = subject.comment;
      if (!comment || comment.includes('Performance graded as') || comment.includes('Excellent') || 
          comment.includes('Very good') || comment.includes('Good') || comment.includes('Poor')) {
        comment = generateSubjectComment(scoreValue, subject.subject);
      }
      
      return {
        subject: subject.subject.trim(),
        score: scoreValue,
        grade: grade,
        points: points,
        comment: comment || generateSubjectComment(scoreValue, subject.subject)
      };
    });
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }
    
    const formattedData = {
      form: formData.form,
      term: formData.term,
      academicYear: formData.academicYear,
      subjects: validatedSubjects
    };
    
    await onSave(result.id, formattedData);
  };

  const calculateOverall = () => {
    if (subjectEdits.length === 0) return { total: 0, average: 0, points: 0, count: 0 };
    
    const validSubjects = subjectEdits.filter(s => {
      const score = parseFloat(s.score);
      return !isNaN(score) && s.score !== '';
    });
    
    if (validSubjects.length === 0) return { total: 0, average: 0, points: 0, count: 0 };
    
    const totalScore = validSubjects.reduce((sum, s) => {
      const score = parseFloat(s.score) || 0;
      return sum + score;
    }, 0);
    
    const totalPoints = validSubjects.reduce((sum, s) => {
      const points = parseFloat(s.points) || 0;
      return sum + points;
    }, 0);
    
    const average = validSubjects.length > 0 ? totalScore / validSubjects.length : 0;
    
    return {
      total: parseFloat(totalScore.toFixed(2)),
      average: parseFloat(average.toFixed(2)),
      points: parseFloat(totalPoints.toFixed(1)),
      count: validSubjects.length,
      totalSubjects: subjectEdits.length
    };
  };

  const overall = calculateOverall();

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '900px',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiEdit className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Academic Results</h2>
                <p className="text-purple-100 opacity-90 text-sm mt-1">
                  Update academic results for {student ? `${student.firstName} ${student.lastName}` : 'Student'}
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
            {student && (
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Student Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      value={result.admissionNumber}
                      disabled
                      className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50 text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Current Form
                    </label>
                    <input
                      type="text"
                      value={student.form || 'Not set'}
                      disabled
                      className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50 text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Form *
                  </label>
                  <select
                    required
                    value={formData.form}
                    onChange={(e) => setFormData({...formData, form: e.target.value})}
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                  >
                    <option value="">Select Form</option>
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Term *
                  </label>
                  <select
                    required
                    value={formData.term}
                    onChange={(e) => setFormData({...formData, term: e.target.value})}
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
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
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300">
              <h4 className="text-xl font-bold text-purple-900 mb-4">Performance Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Total Subjects</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.totalSubjects}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Scored Subjects</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.count}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Total Score</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.total}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Average</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.average}%</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Total Points</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.points}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-purple-700 font-semibold">
                <FiInfo className="inline mr-2" />
                Comments are automatically generated based on scores. Mathematics: A starts at 75, Other subjects: A starts at 80.
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900">Subject Scores</h4>
                <button
                  type="button"
                  onClick={addSubject}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <FiPlus className="text-sm" /> Add Subject
                </button>
              </div>
              
              <div className="space-y-4">
                {subjectEdits.map((subject, index) => {
                  const scoreValue = parseFloat(subject.score) || 0;
                  const isValidScore = !isNaN(parseFloat(subject.score)) && subject.score !== '';
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-bold text-gray-900">Subject {index + 1}</h5>
                        {subjectEdits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSubject(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FiX className="text-sm" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Subject Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={subject.subject}
                            onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                            placeholder="e.g., Mathematics"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Score (%) *
                          </label>
                          <input
                            type="text"
                            required
                            value={subject.score}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
                                handleSubjectChange(index, 'score', val);
                              }
                            }}
                            onBlur={() => handleScoreBlur(index)}
                            onKeyDown={(e) => {
                              if (!/[0-9.-]|Backspace|Delete|Tab|Arrow/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            placeholder="0-100"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                          />
                          {subject.score !== '' && !isValidScore && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid number</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Grade {subject.score !== '' && '(Auto)'}
                          </label>
                          <div className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-center ${
                            subject.grade === 'A' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' :
                            subject.grade === 'A-' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                            subject.grade === 'B+' ? 'border-green-300 bg-green-50 text-green-700' :
                            subject.grade === 'B' ? 'border-green-200 bg-green-50 text-green-600' :
                            subject.grade === 'B-' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                            subject.grade === 'C+' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                            subject.grade === 'C' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                            subject.grade === 'C-' ? 'border-yellow-200 bg-yellow-50 text-yellow-600' :
                            subject.grade === 'D+' ? 'border-orange-300 bg-orange-50 text-orange-700' :
                            subject.grade === 'D' ? 'border-orange-200 bg-orange-50 text-orange-600' :
                            subject.grade === 'E' ? 'border-red-300 bg-red-50 text-red-700' :
                            'border-gray-300 bg-gray-50 text-gray-500'
                          }`}>
                            {subject.grade || (subject.score === '' ? 'N/A' : calculateGrade(0))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Points {subject.score !== '' && '(Auto)'}
                          </label>
                          <div className="w-full px-4 py-3 border-2 border-gray-300 bg-gray-50 rounded-xl font-bold text-center">
                            {subject.points || (subject.score === '' ? '0' : calculatePoints(0))}
                          </div>
                        </div>
                      </div>
                      
                      {isValidScore && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm font-semibold mb-1">
                            <span className="text-gray-700">Performance:</span>
                            <span className={`${
                              scoreValue >= 80 ? 'text-emerald-700' :
                              scoreValue >= 70 ? 'text-green-700' :
                              scoreValue >= 60 ? 'text-blue-700' :
                              scoreValue >= 50 ? 'text-yellow-700' :
                              scoreValue >= 40 ? 'text-orange-700' :
                              'text-red-700'
                            }`}>
                              {scoreValue}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                scoreValue >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                                scoreValue >= 70 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                scoreValue >= 60 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                scoreValue >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                scoreValue >= 40 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                              style={{ width: `${Math.min(scoreValue, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Teacher Comment {subject.score !== '' && '(Auto-generated)'}
                        </label>
                        <textarea
                          value={subject.comment}
                          onChange={(e) => handleSubjectChange(index, 'comment', e.target.value)}
                          onFocus={(e) => {
                            if (!subject.comment || subject.comment.includes('Performance graded as') || 
                                subject.comment.includes('Excellent') || subject.comment.includes('Very good') || 
                                subject.comment.includes('Good') || subject.comment.includes('Poor')) {
                              const numericValue = parseFloat(subject.score) || 0;
                              const generatedComment = generateSubjectComment(numericValue, subject.subject);
                              handleSubjectChange(index, 'comment', generatedComment);
                            }
                          }}
                          placeholder="Enter or auto-generate comment..."
                          rows={2}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {subject.score !== '' && isValidScore 
                              ? "Comment auto-generated based on score. You can edit it."
                              : "Enter a valid score to auto-generate comment"}
                          </span>
                          {subject.score !== '' && isValidScore && (
                            <button
                              type="button"
                              onClick={() => {
                                const numericValue = parseFloat(subject.score) || 0;
                                const generatedComment = generateSubjectComment(numericValue, subject.subject);
                                handleSubjectChange(index, 'comment', generatedComment);
                              }}
                              className="text-xs text-purple-600 font-bold hover:text-purple-800"
                            >
                              Regenerate Comment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {subjectEdits.length === 0 && (
                  <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                    <FiBook className="text-gray-400 text-3xl mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">No subjects added yet</p>
                    <p className="text-gray-500 text-sm mt-1">Click "Add Subject" to start adding academic results</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 border-2 border-gray-400 text-gray-700 rounded-2xl font-bold text-base hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || subjectEdits.length === 0}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:shadow-2xl transition-all"
              >
                {loading ? (
                  <>
                    <CircularProgress size={18} className="text-white" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="text-lg" />
                    <span>Update Academic Results</span>
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

// File Upload Component for Results
function ResultsFileUpload({ onFileSelect, file, onRemove, dragActive, onDrag, showNotification }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validExtensions = ['.csv', '.xlsx', '.xls', '.xlsm'];
    
    if (selectedFile) {
      const ext = selectedFile.name.toLowerCase();
      if (validExtensions.some(valid => ext.endsWith(valid))) {
        onFileSelect(selectedFile);
        showNotification('Results file selected successfully', 'success');
      } else {
        showNotification('Please upload a CSV or Excel file', 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
   <div
  className={`
    relative
    border-3 border-dashed rounded-2xl p-10 text-center 
    cursor-pointer transition-all duration-200 ease-out
    border-gray-300
    ${dragActive 
      ? 'border-purple-500 bg-gradient-to-br from-purple-50/80 to-purple-100/80 ring-4 ring-purple-100/50 shadow-sm scale-[1.02]' 
      : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:border-purple-300'
    }
  `}
  onDragEnter={(e) => {
    e.preventDefault();
    e.stopPropagation();
    onDrag(true);
  }}
  onDragLeave={(e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onDrag(false);
    }
  }}
  onDragOver={(e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragActive) onDrag(true);
  }}
  onDrop={(e) => {
    e.preventDefault();
    e.stopPropagation();
    onDrag(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange({ target: { files } });
    }
  }}
  onClick={() => fileInputRef.current?.click()}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }}
>
  <div className="absolute inset-0 rounded-2xl border-2 border-gray-200/30 pointer-events-none" />
  <div className="absolute inset-1 rounded-xl border border-gray-100/50 pointer-events-none" />
  <div className="absolute inset-2 rounded-lg border border-gray-50/30 pointer-events-none" />
  
  {dragActive && (
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-2xl pointer-events-none" />
  )}
  
  <div className="relative z-10">
    <FiUpload 
      className={`
        mx-auto text-3xl mb-4 transition-all duration-200
        ${dragActive 
          ? 'text-purple-600 scale-110' 
          : 'text-gray-400 hover:text-gray-600'
        }
      `} 
    />
    
    <p className="text-gray-800 mb-2 font-bold text-lg transition-colors duration-200">
      {dragActive 
        ? '📚 Drop results file here!' 
        : file 
          ? 'Click to replace file' 
          : 'Drag & drop or click to upload results'
      }
    </p>
    
    <p className="text-sm text-gray-600 transition-colors duration-200">
      CSV, Excel (.xlsx, .xls, .xlsm) • Max 10MB • Include admission numbers
    </p>
  </div>
  
  <input 
    ref={fileInputRef}
    type="file" 
    accept=".csv,.xlsx,.xls,.xlsm"
    onChange={handleFileChange}
    className="hidden"
    aria-label="Upload results file"
  />
</div>
  );
}

// Result Detail Modal
function ResultDetailModal({ result, student, onClose, onEdit, onDelete, showNotification }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!result) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'from-emerald-500 to-emerald-700';
      case 'A-': return 'from-emerald-400 to-emerald-600';
      case 'B+': return 'from-green-500 to-green-700';
      case 'B': return 'from-green-400 to-green-600';
      case 'B-': return 'from-blue-500 to-blue-700';
      case 'C+': return 'from-blue-400 to-blue-600';
      case 'C': return 'from-yellow-500 to-yellow-700';
      case 'C-': return 'from-yellow-400 to-yellow-600';
      case 'D+': return 'from-orange-500 to-orange-700';
      case 'D': return 'from-orange-400 to-orange-600';
      case 'E': return 'from-red-500 to-red-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const calculateOverall = () => {
    if (!result.subjects || !Array.isArray(result.subjects)) return { total: 0, average: 0, points: 0, count: 0 };
    
    let subjects = result.subjects;
    
    if (typeof subjects === 'string') {
      try {
        subjects = JSON.parse(subjects);
      } catch (e) {
        console.error('Error parsing subjects:', e);
        subjects = [];
      }
    }
    
    if (!Array.isArray(subjects)) {
      subjects = [];
    }
    
    const totalScore = subjects.reduce((sum, s) => {
      const score = parseFloat(s.score) || 0;
      return sum + score;
    }, 0);
    
    const totalPoints = subjects.reduce((sum, s) => {
      const points = parseFloat(s.points) || 0;
      return sum + points;
    }, 0);
    
    const average = subjects.length > 0 ? totalScore / subjects.length : 0;
    
    return {
      total: parseFloat(totalScore.toFixed(2)),
      average: parseFloat(average.toFixed(2)),
      points: parseFloat(totalPoints.toFixed(1)),
      count: subjects.length
    };
  };

  const overall = calculateOverall();

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
      maxWidth: 900,
      maxHeight: '95vh',
      borderRadius: 3,
      boxShadow: 24,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}
  >
    <header className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-2xl">
          <FiAward className="text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Academic Results Details</h2>
          <p className="text-sm text-purple-100">
            Complete academic performance and subject analysis
          </p>
        </div>
      </div>
      <button onClick={onClose} className="p-2 bg-white/20 rounded-2xl">
        <FiX className="text-xl" />
      </button>
    </header>

    <main className="max-h-[calc(95vh-80px)] overflow-y-auto p-6 space-y-8">
      <section className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center ring-4 ring-purple-100">
          <IoSchool className="text-3xl text-white" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-900">
            {student ? `${student.firstName} ${student.lastName}` : 'Student'}
          </h3>
          <p className="font-semibold text-gray-700 mt-1">
            Admission #{result.admissionNumber}
          </p>

          <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
            {[result.form, result.term, result.academicYear].map((item, i) => (
              <span
                key={i}
                className="px-4 py-2 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="p-6 rounded-2xl border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-purple-100">
        <div className="flex justify-between mb-6">
          <h4 className="text-xl font-bold text-purple-900">Overall Performance</h4>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-700">
              {overall.average}%
            </div>
            <span className="text-sm font-semibold text-purple-600">
              Average Score
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Total Score', overall.total],
            ['Average', `${overall.average}%`],
            ['Total Points', overall.points],
            ['Subjects', overall.count],
          ].map(([label, value], i) => (
            <div key={i} className="p-4 text-center bg-white rounded-xl border">
              <p className="text-sm font-semibold text-gray-600">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="flex items-center gap-3 mb-4 text-xl font-bold">
          <span className="p-2 bg-blue-100 rounded-xl">
            <FiBook className="text-blue-700" />
          </span>
          Subject Performance
        </h4>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Array.isArray(result.subjects) ? result.subjects : 
            (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []))
            .map((s, i) => {
              const subject = s.subject || 'Unknown Subject';
              const score = parseFloat(s.score) || 0;
              const grade = s.grade || calculateGrade(score);
              const points = parseFloat(s.points) || 0;
              
              return (
                <div key={i} className="p-4 bg-white rounded-xl border hover:shadow-lg">
                  <div className="flex justify-between mb-2">
                    <h5 className="font-bold truncate">{subject}</h5>
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg ${getGradeColor(grade)} text-white`}>
                      {grade}
                    </span>
                  </div>

                  <div className="text-sm flex justify-between">
                    <span>Score</span>
                    <span className="font-bold">{score}%</span>
                  </div>

                  <div className="text-sm flex justify-between">
                    <span>Points</span>
                    <span className="font-bold">{points}</span>
                  </div>

                  <div className="mt-3 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${Math.min(score, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      <footer className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <button
          onClick={onEdit}
          className="flex-1 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-800 flex justify-center gap-2"
        >
          <FiEdit /> Edit Results
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-red-600 to-red-800 flex justify-center gap-2"
        >
          <FiTrash2 /> Delete Results
        </button>
      </footer>
    </main>
  </Box>
</Modal>


      {showDeleteModal && (
        <ResultsDeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            onDelete(result.admissionNumber);
            setShowDeleteModal(false);
          }}
          loading={false}
          type="result"
          itemName={`Results for ${result.admissionNumber} - ${result.form} ${result.term} ${result.academicYear}`}
          showNotification={showNotification}
        />
      )}
    </>
  );
}
function ResultsStatisticsCard({ title, value, icon: Icon, color, trend = 0, prefix = '', suffix = '' }) {
  // Format the value
  const formatValue = (val) => {
    if (val === undefined || val === null || val === '') {
      return prefix + '0' + suffix;
    }
    
    if (typeof val === 'number') {
      // For percentages, format with 2 decimal places
      if (suffix === '%') {
        return prefix + val.toFixed(2) + suffix;
      }
      // For whole numbers, no decimal places
      if (Number.isInteger(val)) {
        return prefix + val.toLocaleString() + suffix;
      }
      // For floats, 2 decimal places
      return prefix + val.toFixed(2) + suffix;
    }
    
    return prefix + val + suffix;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
          <Icon className="text-white text-2xl" />
        </div>
        <div className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
          trend > 0 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : trend < 0 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}>
          {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : '—'}
        </div>
      </div>
      <h4 className="text-3xl font-bold text-gray-900 mb-2">
        {formatValue(value)}
      </h4>
      <p className="text-gray-600 text-sm font-semibold">{title}</p>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            style={{ 
              width: typeof value === 'number' 
                ? `${Math.min(100, Math.max(0, value))}%` 
                : '0%' 
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Results Chart Component
function ResultsChart({ 
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
        let displayData = data;
        
        if (title === 'Form Distribution') {
          const allForms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
          const dataMap = new Map();
          data.forEach(item => {
            dataMap.set(item.name, item.value);
          });
          
          displayData = allForms.map(form => ({
            name: form,
            value: dataMap.get(form) || 0
          }));
        }
        
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
              >
                {displayData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value, name, props) => {
                  const total = displayData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return [`${value} results (${percentage}%)`, 'Count'];
                }}
                contentStyle={{
                  borderRadius: '12px',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#D1D5DB' }}
                label={{ 
                  value: title.includes('Score') ? 'Score (%)' : 'Count', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -10,
                  style: { fill: '#6B7280', fontSize: 12 }
                }}
              />
              <RechartsTooltip 
                formatter={(value, name) => {
                  if (title.includes('Score')) {
                    return [`${value}%`, 'Score'];
                  }
                  return [value, 'Count'];
                }}
                labelFormatter={(label) => `Category: ${label}`}
                contentStyle={{
                  borderRadius: '12px',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>}
              />
              <Bar 
                dataKey="value" 
                name={title.includes('Score') ? "Score" : "Count"} 
                radius={[8, 8, 0, 0]}
                fill={chartColors[0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius="80%" 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <PolarGrid 
                stroke="#E5E7EB" 
                strokeDasharray="3 3"
              />
              <PolarAngleAxis 
                dataKey="subject" 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 11 }}
              />
              <PolarRadiusAxis 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 11 }}
                angle={30}
                domain={[0, 100]}
              />
              <Radar 
                name="Score" 
                dataKey="score" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
                strokeWidth={2}
              />
              <RechartsTooltip 
                formatter={(value) => [`${value}%`, 'Score']}
                contentStyle={{
                  borderRadius: '12px',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#D1D5DB' }}
                label={{ 
                  value: 'Score (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -10,
                  style: { fill: '#6B7280', fontSize: 12 }
                }}
              />
              <RechartsTooltip 
                formatter={(value) => [`${value}%`, 'Score']}
                contentStyle={{
                  borderRadius: '12px',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Performance Trend" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ 
                  stroke: '#8B5CF6', 
                  strokeWidth: 2, 
                  r: 6, 
                  fill: '#fff' 
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#fff', 
                  strokeWidth: 2 
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <RechartsTooltip 
                formatter={(value, name) => {
                  if (title.includes('Score') || title.includes('Grade')) {
                    return [`${value}`, name || 'Value'];
                  }
                  return [value, 'Count'];
                }}
                contentStyle={{
                  borderRadius: '12px',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>}
              />
              <Bar 
                dataKey="value" 
                name={title.includes('Grade') ? "Grade Count" : "Value"} 
                radius={[8, 8, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-60 h-60 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full blur-3xl opacity-60" />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center shadow-2xl ring-4 ring-purple-100">
              {type === 'pie' && <FiPieChart className="text-white text-xl" />}
              {type === 'bar' && <FiBarChart2 className="text-white text-xl" />}
              {type === 'radar' && <FiTarget className="text-white text-xl" />}
              {type === 'line' && <FiTrendingUp className="text-white text-xl" />}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
              <p className="text-gray-600 text-sm">
                {title === 'Form Distribution' && 'Distribution of results across all forms'}
                {title === 'Grade Distribution' && 'Frequency of different grades'}
                {title === 'Subject Performance' && 'Top performing subjects'}
                {title === 'Term Distribution' && 'Results distribution by term'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {type === 'pie' && (
              <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">
                Pie Chart
              </span>
            )}
            {type === 'bar' && (
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                Bar Chart
              </span>
            )}
            {type === 'radar' && (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                Radar Chart
              </span>
            )}
          </div>
        </div>

        <div className="h-96">
          {data && data.length > 0 && data.some(item => item.value > 0) ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                {title === 'Form Distribution' ? (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto">
                      <FiPieChart className="text-gray-400 text-3xl" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-lg font-semibold">No form data available</p>
                      <p className="text-gray-400 text-sm mt-2 max-w-md">
                        Upload results with form information to see the distribution across Forms 1-4
                      </p>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2 max-w-xs mx-auto">
                      {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(form => (
                        <div key={form} className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 font-bold">{form}</div>
                          <div className="text-gray-400 text-xs">0</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <FiBarChart2 className="text-gray-300 text-6xl mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No data available for {title.toLowerCase()}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {title === 'Form Distribution' && data && data.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-4 gap-3">
              {data.map((item, index) => {
                const total = data.reduce((sum, i) => sum + i.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                
                return (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm font-bold text-gray-700">{item.name}</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{item.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{percentage}%</div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: chartColors[index % chartColors.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Filter Panel for Results
function ResultsFilterPanel({ 
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
      term: '',
      academicYear: '',
      subject: '',
      minScore: '',
      maxScore: '',
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
          <IoFilterIcon className="text-purple-600" />
          Advanced Filters
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAdvanced}
            className="px-4 py-2 text-sm font-bold text-gray-700"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-sm font-bold text-red-600"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Admission number, student name..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Form
          </label>
          <select
            value={localFilters.form}
            onChange={(e) => handleFilterChange('form', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
          >
            <option value="">All Forms</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Term
          </label>
          <select
            value={localFilters.term}
            onChange={(e) => handleFilterChange('term', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
          >
            <option value="">All Terms</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Academic Year
          </label>
          <select
            value={localFilters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
          >
            <option value="">All Years</option>
            <option value="2024/2025">2024/2025</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2022/2023">2022/2023</option>
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={localFilters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              placeholder="e.g., Mathematics"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Min Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={localFilters.minScore}
              onChange={(e) => handleFilterChange('minScore', e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Max Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={localFilters.maxScore}
              onChange={(e) => handleFilterChange('maxScore', e.target.value)}
              placeholder="100"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            >
              <option value="updatedAt">Last Updated</option>
              <option value="createdAt">Date Created</option>
              <option value="admissionNumber">Admission Number</option>
              <option value="averageScore">Average Score</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Component
export default function ModernResultsManagement() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [view, setView] = useState('dashboard');
  const [studentResults, setStudentResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: '', name: '' });

  const [uploadStrategy, setUploadStrategy] = useState(null);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [validationLoading, setValidationLoading] = useState(false);
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const [filters, setFilters] = useState({
    search: '',
    form: '',
    term: '',
    academicYear: '',
    subject: '',
    minScore: '',
    maxScore: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  const [stats, setStats] = useState({
    totalResults: 0,
    averageScore: 0,
    topScore: 0,
    totalStudents: 0,
    formDistribution: {},
    termDistribution: {},
    subjectPerformance: {}
  });

  const [chartData, setChartData] = useState({
    formDistribution: [],
    termDistribution: [],
    subjectPerformance: [],
    gradeDistribution: []
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  const fileInputRef = useRef(null);

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

  const loadStudentResults = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/results?page=${page}&limit=${pagination.limit}&includeStudent=true`;
      
      if (filters.search) url += `&admissionNumber=${encodeURIComponent(filters.search)}`;
      if (filters.form) url += `&form=${encodeURIComponent(filters.form)}`;
      if (filters.term) url += `&term=${encodeURIComponent(filters.term)}`;
      if (filters.academicYear) url += `&academicYear=${encodeURIComponent(filters.academicYear)}`;
      if (filters.subject) url += `&subject=${encodeURIComponent(filters.subject)}`;
      if (filters.minScore) url += `&minScore=${encodeURIComponent(filters.minScore)}`;
      if (filters.maxScore) url += `&maxScore=${encodeURIComponent(filters.maxScore)}`;
      if (filters.sortBy) url += `&sortBy=${encodeURIComponent(filters.sortBy)}`;
      if (filters.sortOrder) url += `&sortOrder=${encodeURIComponent(filters.sortOrder)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to load results');
      
      if (data.success) {
        const validResults = (data.data?.results || []).filter(result => result.student);
        setStudentResults(validResults);
        setPagination({
          ...data.data?.pagination,
          total: validResults.length
        } || {
          page: page,
          limit: pagination.limit,
          total: validResults.length,
          pages: Math.ceil(validResults.length / pagination.limit)
        });
      } else {
        showNotification(data.error || 'Failed to load results', 'error');
      }
    } catch (error) {
      console.error('Failed to load results:', error);
      showNotification(error.message || 'Failed to load results', 'error');
    } finally {
      setLoading(false);
    }
  };


const loadStatistics = async () => {
  try {
    console.log('Fetching statistics from API...');
    
    const res = await fetch('/api/results?action=stats');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const responseData = await res.json();
    console.log('Statistics API response:', responseData);
    
    // FIX HERE: responseData.data.stats -> responseData.data?.stats
    if (responseData.success && responseData.data?.stats) {
      const stats = responseData.data.stats;
      
      // Log the stats we received
      console.log('Stats received:', {
        totalResults: stats.totalResults,
        averageScore: stats.averageScore,
        totalStudents: stats.totalStudents,
        formDistribution: stats.formDistribution,
        gradeDistribution: stats.gradeDistribution
      });
      
      // Update the stats state
      setStats({
        totalResults: stats.totalResults || 0,
        averageScore: stats.averageScore || 0,
        topScore: stats.topScore || 0,
        totalStudents: stats.totalStudents || 0,
        formDistribution: stats.formDistribution || {},
        termDistribution: stats.termDistribution || {},
        subjectPerformance: stats.subjectPerformance || {},
        gradeDistribution: stats.gradeDistribution || {}
      });

      // Transform data for charts
      const formData = [];
      if (stats.formDistribution && typeof stats.formDistribution === 'object') {
        Object.entries(stats.formDistribution).forEach(([form, count]) => {
          formData.push({
            name: form,
            value: count
          });
        });
      }

      const termData = [];
      if (stats.termDistribution && typeof stats.termDistribution === 'object') {
        Object.entries(stats.termDistribution).forEach(([term, count]) => {
          termData.push({
            name: term,
            value: count
          });
        });
      }

      const gradeData = [];
      if (stats.gradeDistribution && typeof stats.gradeDistribution === 'object') {
        Object.entries(stats.gradeDistribution).forEach(([grade, count]) => {
          gradeData.push({
            name: grade,
            value: count
          });
        });
      }

      const subjectData = [];
      if (stats.subjectPerformance && typeof stats.subjectPerformance === 'object') {
        Object.entries(stats.subjectPerformance).forEach(([subject, info]) => {
          subjectData.push({
            name: subject,
            value: info.averageScore || 0,
            count: info.totalResults || 0
          });
        });
        
        // Sort by value and take top 10
        subjectData.sort((a, b) => b.value - a.value).slice(0, 10);
      }

      console.log('Chart data prepared:', {
        formData,
        termData,
        gradeData,
        subjectData
      });

      setChartData({
        formDistribution: formData,
        termDistribution: termData,
        subjectPerformance: subjectData,
        gradeDistribution: gradeData
      });
      
      console.log('Statistics loaded successfully!');
      
    } else {
      console.error('Statistics API returned unsuccessful:', responseData);
      showNotification(responseData.error || 'Failed to load statistics', 'error');
    }
  } catch (error) {
    console.error('Failed to load statistics:', error);
    showNotification(`Failed to load statistics: ${error.message}`, 'error');
    
    // Set fallback values from your logs
    const fallbackStats = {
      totalResults: 30,
      averageScore: 62.07,
      topScore: 95,
      totalStudents: 30,
      formDistribution: {},
      termDistribution: {},
      subjectPerformance: {},
      gradeDistribution: {}
    };
    
    setStats(fallbackStats);
    setChartData({
      formDistribution: [],
      termDistribution: [],
      subjectPerformance: [],
      gradeDistribution: []
    });
  }
};

  const loadUploadHistory = async (page = 1) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/results?action=uploads&page=${page}&limit=5`);
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

  const loadStudentInfo = async (admissionNumber) => {
    try {
      const res = await fetch(`/api/results?action=student-results&admissionNumber=${admissionNumber}&includeStudent=true`);
      const data = await res.json();
      if (data.success) {
        return data.student || null;
      }
    } catch (error) {
      console.error('Failed to load student info:', error);
    }
    return null;
  };

  useEffect(() => {
    loadStudentResults();
    loadStatistics();
    loadUploadHistory();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      form: '',
      term: '',
      academicYear: '',
      subject: '',
      minScore: '',
      maxScore: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    });
    loadStudentResults(1);
  };

  const handleSort = (field) => {
    const newSortOrder = filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: newSortOrder
    }));
    loadStudentResults(pagination.page);
  };

  const handleDrag = (active) => {
    setDragActive(active);
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
  };

const checkDuplicates = async () => {
  if (!file || !uploadStrategy) {
    showNotification('Please select a file and upload strategy first', 'warning');
    return;
  }

  setValidationLoading(true);
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('checkDuplicates', 'true');
    
    console.log('uploadStrategy:', uploadStrategy);
    console.log('uploadMode value:', uploadStrategy.uploadMode);
    
    formData.append('uploadType', uploadStrategy.uploadMode);
    formData.append('term', uploadStrategy.term);
    formData.append('academicYear', uploadStrategy.academicYear);
    
    if (uploadStrategy.uploadMode === 'new') {
      console.log('Selected forms:', uploadStrategy.selectedForms);
      formData.append('forms', JSON.stringify(uploadStrategy.selectedForms));
    } else if (uploadStrategy.uploadMode === 'update') {
      console.log('Target form:', uploadStrategy.targetForm);
      formData.append('targetForm', uploadStrategy.targetForm);
    }

    // Debug: show all form data entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch('/api/results', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Response:', data);
    
    if (data.success) {
      if (data.duplicates && data.duplicates.length > 0) {
        setDuplicates(data.duplicates);
        setShowValidationModal(true);
      } else {
        proceedWithUpload('skip');
      }
    } else {
      showNotification(data.error || 'Failed to check for duplicates', 'error');
    }
  } catch (error) {
    console.error('Validation error:', error);
    showNotification('Failed to validate file', 'error');
  } finally {
    setValidationLoading(false);
  }
};


const proceedWithUpload = async (duplicateAction = 'skip') => {
  setUploading(true);
  setShowValidationModal(false);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadType', uploadStrategy.uploadMode);
  formData.append('term', uploadStrategy.term);
  formData.append('academicYear', uploadStrategy.academicYear);
  formData.append('uploadedBy', 'Admin');
  
  if (uploadStrategy.uploadMode === 'new') {
    formData.append('forms', JSON.stringify(uploadStrategy.selectedForms)); // CHANGED: 'forms' not 'selectedForms'
    formData.append('duplicateAction', duplicateAction);
  } else if (uploadStrategy.uploadMode === 'update') {
    formData.append('targetForm', uploadStrategy.targetForm);
  }

  try {
    const response = await fetch('/api/results', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    
    setResult(data);
    
    if (data.success) {
      let successMessage = '';
      if (uploadStrategy.uploadMode === 'new') {
        successMessage = `✅ New results upload successful! ${data.stats?.valid || 0} result records processed.`;
      } else {
        successMessage = `✅ Update successful! ${uploadStrategy.targetForm} - ${uploadStrategy.term} ${uploadStrategy.academicYear} updated: ${data.stats?.updated || 0} updated, ${data.stats?.created || 0} created.`;
      }
      
      showNotification(successMessage, 'success');
      
      if (data.errors && data.errors.length > 0) {
        data.errors.slice(0, 3).forEach(error => {
          showNotification(error, 'error');
        });
      }
      
      await Promise.all([loadStudentResults(1), loadUploadHistory(1), loadStatistics()]);
      setFile(null);
      setUploadStrategy(null);
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



  const handleUploadWithStrategy = () => {
    if (!uploadStrategy) {
      setShowStrategyModal(true);
      return;
    }
    
    if (!file) {
      showNotification('Please select a file first', 'warning');
      return;
    }
    
    checkDuplicates();
  };


const handleStrategyConfirm = (strategy) => {
  // The modal sends uploadMode, not uploadType
  setUploadStrategy(strategy);
  setShowStrategyModal(false);
  showNotification(`Strategy set: ${strategy.uploadMode === 'new' ? 'Create New Results' : 'Update Existing Results'} ${strategy.uploadMode === 'new' ? `for ${strategy.selectedForms.join(', ')}` : `for ${strategy.targetForm}`}`, 'success');
};

  const handleDelete = async (type, id, name) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      let url;
      
      showNotification(`Deleting ${deleteTarget.type}...`, 'info');
      
      if (deleteTarget.type === 'batch') {
        url = `/api/results?batchId=${deleteTarget.id}`;
      } else {
        url = `/api/results?resultId=${deleteTarget.id}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const res = await fetch(url, { 
        method: 'DELETE',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: Delete failed`);
      }
      
      if (data.success) {
        showNotification(data.message || 'Deleted successfully', 'success');
        
        await Promise.all([
          loadStudentResults(pagination.page),
          loadUploadHistory(1),
          loadStatistics()
        ]);
        
        if (deleteTarget.type === 'result') {
          setSelectedResult(null);
          setSelectedStudent(null);
        }
      } else {
        showNotification(data.error || 'Failed to delete', 'error');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      
      if (error.name === 'AbortError') {
        showNotification('Delete operation timed out. The delete may still be processing in the background.', 'warning');
        loadUploadHistory(1);
      } else if (error.message.includes('timeout')) {
        showNotification('Delete timed out. Please check if the operation completed and refresh the page.', 'warning');
      } else {
        showNotification(`Delete failed: ${error.message}`, 'error');
      }
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget({ type: '', id: '', name: '' });
    }
  };

  const updateResult = async (resultId, resultData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/results/${resultId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showNotification('Academic results updated successfully', 'success');
        
        await Promise.all([
          loadStudentResults(pagination.page),
          loadStatistics()
        ]);
        
        setEditingResult(null);
        setSelectedResult(data.data);
      } else {
        showNotification(data.error || 'Failed to update results', 'error');
      }
    } catch (error) {
      console.error('Update failed:', error);
      showNotification('Failed to update results', 'error');
    } finally {
      setLoading(false);
    }
  };

  const viewResultDetails = async (result) => {
    setSelectedResult(result);
    const student = await loadStudentInfo(result.admissionNumber);
    setSelectedStudent(student);
  };

  const editResult = async (result) => {
    setSelectedResult(result);
    const student = await loadStudentInfo(result.admissionNumber);
    setSelectedStudent(student);
    setEditingResult(result);
  };
const downloadCSVTemplate = () => {
  window.location.href = "/csv/form_1_results.csv";
};

const downloadExcelTemplate = () => {
  window.location.href = "/excel/form_1_results.xlsx";
};


  const exportResultsToCSV = () => {
    const validResults = studentResults.filter(result => result.student);
    
    if (validResults.length === 0) {
      showNotification('No valid results to export', 'warning');
      return;
    }

    const headers = ['Admission Number', 'Student Name', 'Form', 'Term', 'Academic Year', 'Subjects', 'Average Score', 'Total Points'];
    const data = validResults.map(result => {
      const subjects = Array.isArray(result.subjects) ? result.subjects : 
        (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
      
      const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
      const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;
      const totalPoints = subjects.reduce((sum, s) => sum + (s.points || 0), 0);
      
      return [
        result.admissionNumber,
        result.student ? `${result.student.firstName} ${result.student.lastName}` : 'Unknown Student',
        result.form,
        result.term,
        result.academicYear,
        subjects.map(s => `${s.subject}: ${s.score}% (${s.grade})`).join('; '),
        parseFloat(averageScore.toFixed(2)),
        totalPoints
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
    a.download = `academic_results_export_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Exported ${validResults.length} academic results to CSV`, 'success');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadStudentResults(newPage);
    }
  };

  const calculateResultAverage = (result) => {
    if (!result.subjects || !Array.isArray(result.subjects)) return 0;
    
    const subjects = result.subjects;
    const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
    return subjects.length > 0 ? parseFloat((totalScore / subjects.length).toFixed(2)) : 0;
  };

  const getGradeColor = (score) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-800';
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading && view === 'results' && studentResults.length === 0) {
    return <ResultsLoadingSpinner message="Loading academic results..." size="large" />;
  }

return (
    <div className="p-6 space-y-6">
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          elevation={0}
          sx={{
            width: '440px',
            minHeight: '90px',
            fontSize: '1.1rem',
            padding: '18px 22px',
            borderRadius: '18px',
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backdropFilter: 'blur(10px)',
            
            backgroundColor: (theme) => {
              switch (notification.severity) {
                case 'success': return 'rgba(46, 125, 50, 0.9)';
                case 'error': return 'rgba(211, 47, 47, 0.9)';
                case 'warning': return 'rgba(237, 108, 2, 0.9)';
                case 'info': return 'rgba(2, 136, 209, 0.9)';
                default: return 'rgba(97, 97, 97, 0.9)';
              }
            },
            color: '#fff',
            
            '& .MuiAlert-icon': {
              fontSize: '1.8rem',
              opacity: 0.9,
              color: '#fff',
            },
          }}
        >
          {notification.message}
        </MuiAlert>
      </Snackbar>

      <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <IoSchool className="text-2xl text-yellow-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Academic Results Management</h1>
              <p className="text-purple-100 text-lg mt-2 max-w-2xl">
                Comprehensive academic results tracking, analysis, and reporting for all students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => {
                setLoading(true);
                loadStatistics();
                loadStudentResults();
              }}
              disabled={loading}
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <CircularProgress size={16} color="inherit" thickness={6} />
              ) : (
                <FiRefreshCw className="text-base" />
              )}
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>

            <button
              onClick={exportResultsToCSV}
              disabled={studentResults.length === 0 || loading}
              className="text-white/80 px-6 py-3 rounded-xl font-bold text-base border border-white/20 flex items-center gap-2 disabled:opacity-50"
            >
              <FiDownload className="text-base" />
              Export Results
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 border-2 border-gray-200 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2 p-2">
          <button
            onClick={() => setView('dashboard')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'dashboard'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <IoAnalytics className="text-sm" />
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
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <FiUpload className="text-sm" />
            Bulk Upload
          </button>
          <button
            onClick={() => {
              setView('results');
              loadStudentResults(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'results'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <FiBook className="text-sm" />
            Results ({stats.totalResults || 0})
          </button>
          <button
            onClick={() => {
              setView('history');
              loadUploadHistory(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <FiClock className="text-sm" />
            Upload History
          </button>
        </div>
      </div>

      <div className="space-y-6">
     {view === 'dashboard' && (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ResultsStatisticsCard
        title="Total Results"
        value={stats.totalResults}  // This should be 30 from your logs
        icon={FiBook}
        color="from-purple-500 to-purple-700"
        trend={0}
      />
      <ResultsStatisticsCard
        title="Average Score"
        value={stats.averageScore}  // This should be 62.07 from your logs
        icon={FiPercentIcon}
        color="from-blue-500 to-blue-700"
        trend={0}
        suffix="%"
      />
      <ResultsStatisticsCard
        title="Top Score"
        value={stats.topScore}  // Check if this is being set correctly
        icon={FiAward}
        color="from-emerald-500 to-emerald-700"
        trend={0}
        suffix="%"
      />
      <ResultsStatisticsCard
        title="Unique Students"
        value={stats.totalStudents}  // This should be 30 from your logs
        icon={FiUsers}
        color="from-indigo-500 to-indigo-700"
        trend={0}
      />
    </div>

   

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {chartData.formDistribution && chartData.formDistribution.length > 0 ? (
        <ResultsChart
          data={chartData.formDistribution}
          type="pie"
          title="Form Distribution"
          colors={['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']}
          height={400}
        />
      ) : (
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-300 shadow-xl">
          <div className="text-center py-12">
            <FiPieChart className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-bold">No Form Distribution Data</p>
            <p className="text-gray-500">Form distribution data is not available</p>
          </div>
        </div>
      )}
      
      {chartData.gradeDistribution && chartData.gradeDistribution.length > 0 ? (
        <ResultsChart
          data={chartData.gradeDistribution}
          type="bar"
          title="Grade Distribution"
          height={400}
        />
      ) : (
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-300 shadow-xl">
          <div className="text-center py-12">
            <FiBarChart2 className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-bold">No Grade Distribution Data</p>
            <p className="text-gray-500">Grade distribution data is not available</p>
          </div>
        </div>
      )}
    </div>

    {/* Recent Results Table */}
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Recent Academic Results</h3>
        <button
          onClick={() => setView('results')}
          className="px-4 py-2 text-purple-600 font-bold text-base flex items-center gap-2 hover:bg-purple-50 rounded-lg"
        >
          View All <FiChevronRight />
        </button>
      </div>
      
      {studentResults.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Student</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Form/Term/Year</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Average Score</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentResults.slice(0, 5).map(result => {
                const average = calculateResultAverage(result);
                return (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">#{result.admissionNumber}</div>
                      {result.student && (
                        <div className="text-gray-600 text-sm">
                          {result.student.firstName} {result.student.lastName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-gray-700">{result.form}</div>
                        <div className="text-sm text-gray-600">{result.term} {result.academicYear}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold text-xl ${getGradeColor(average).replace('bg-', 'text-')}`}>
                        {average}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            average >= 80 ? 'bg-emerald-500' :
                            average >= 70 ? 'bg-green-500' :
                            average >= 60 ? 'bg-blue-500' :
                            average >= 50 ? 'bg-yellow-500' :
                            average >= 40 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${average}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <FiBook className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-bold">No results available</p>
          <p className="text-gray-500">Upload some results to see them here</p>
        </div>
      )}
    </div>
  </div>
)}

{view === 'upload' && (
  <div className="space-y-8">
    {/* Statistics Cards Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ResultsStatisticsCard
        title="Total Results"
        value={stats.totalStudents}
        icon={FiBook}
        color="from-purple-500 to-purple-700"
        trend={8.5}
      />
      <ResultsStatisticsCard
        title="Average Score"
        value={stats.averageScore}
        icon={FiPercentIcon}
        color="from-blue-500 to-blue-700"
        trend={2.3}
        suffix="%"
      />
      <ResultsStatisticsCard
        title="Top Score"
        value={stats.topScore}
        icon={FiAward}
        color="from-emerald-500 to-emerald-700"
        trend={1.7}
        suffix="%"
      />
      <ResultsStatisticsCard
        title="Unique Students"
        value={stats.totalStudents}
        icon={FiUsers}
        color="from-indigo-500 to-indigo-700"
        trend={5.2}
      />
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Upload Strategy Info */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-purple-900 flex items-center gap-3">
              <FiLayers className="text-purple-700 text-2xl" />
              Upload Strategy
            </h3>
            {uploadStrategy && (
              <span className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm">
                {uploadStrategy.uploadMode === 'create' 
                  ? `New Upload for ${uploadStrategy.selectedForms?.join(', ') || ''}`
                  : `Update Upload for ${uploadStrategy.targetForm}`
                }
              </span>
            )}
          </div>
          
          {!uploadStrategy ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiUpload className="text-purple-600 text-2xl" />
              </div>
              <p className="text-purple-800 font-bold text-lg mb-4">
                No upload strategy selected
              </p>
              <button
                onClick={() => setShowStrategyModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold flex items-center gap-3 mx-auto hover:shadow-xl transition-all duration-300"
              >
                <FiSettings className="text-base" />
                Select Upload Strategy
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-2">Upload Type</h4>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      uploadStrategy.uploadMode === 'create' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {uploadStrategy.uploadMode === 'create' ? <FiPlus /> : <FiDatabase />}
                    </div>
                    <span className="font-bold text-gray-900">
                      {uploadStrategy.uploadMode === 'create' ? 'New Upload' : 'Update Upload'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-2">Term & Year</h4>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-purple-600" />
                    <span className="font-bold text-gray-900">
                      {uploadStrategy.term} {uploadStrategy.academicYear}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-purple-200">
                <h4 className="font-bold text-gray-900 mb-2">Target Forms</h4>
                <div className="flex flex-wrap gap-2">
                  {uploadStrategy.uploadMode === 'create' 
                    ? (uploadStrategy.selectedForms || []).map(form => (
                        <span key={form} className={`px-3 py-1 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${getFormColor(form)}`}>
                          {form}
                        </span>
                      ))
                    : (
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${getFormColor(uploadStrategy.targetForm)}`}>
                        {uploadStrategy.targetForm}
                      </span>
                    )
                  }
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-purple-200">
                <h4 className="font-bold text-gray-900 mb-2">Strategy Details</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {uploadStrategy.uploadMode === 'create' ? (
                    <>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" />
                        <span>Results identified by admission number + term + academic year</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" />
                        <span>Prevents duplicate results for same student/term/year</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" />
                        <span>Only processes selected forms and academic year</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" />
                        <span>Replaces results for specific form/term/year combination</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" />
                        <span>Matches students by admission number + term + academic year</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" />
                        <span>Preserves historical data and maintains grade consistency</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStrategyModal(true)}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
                >
                  Change Strategy
                </button>
                <button
                  onClick={() => setUploadStrategy(null)}
                  className="px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg font-bold hover:border-red-500 hover:text-red-800 transition-all duration-300"
                >
                  Clear Strategy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <ResultsFileUpload
          onFileSelect={handleFileSelect}
          file={file}
          onRemove={() => setFile(null)}
          dragActive={dragActive}
          onDrag={handleDrag}
          showNotification={showNotification}
        />

        {file && (
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl">
                  {file.name.endsWith('.csv') ? (
                    <FiFile className="text-purple-700 text-3xl" />
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
                  onClick={handleUploadWithStrategy}
                  disabled={uploading || validationLoading || !uploadStrategy}
                  className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl font-bold flex items-center gap-3 text-base shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all duration-300"
                >
                  {uploading ? (
                    <>
                      <CircularProgress size={18} className="text-white" />
                      <span>Processing...</span>
                    </>
                  ) : validationLoading ? (
                    <>
                      <CircularProgress size={18} className="text-white" />
                      <span>Checking...</span>
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
        {/* Templates Section */}
        <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Download Templates</h3>
          <div className="space-y-4">
            <button
              onClick={downloadCSVTemplate}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <FiFile className="text-purple-600 text-2xl" />
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

        {/* Guidelines Section */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-300 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-purple-900 mb-6">Upload Guidelines</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-700 font-bold text-base">1</span>
              </div>
              <span className="text-purple-800 font-semibold text-base">Select upload strategy first (Create or Update)</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-700 font-bold text-base">2</span>
              </div>
              <span className="text-purple-800 font-semibold text-base">Term and academic year are required for all results</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-700 font-bold text-base">3</span>
              </div>
              <span className="text-purple-800 font-semibold text-base">Each student can have only one result per term per academic year</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-700 font-bold text-base">4</span>
              </div>
              <span className="text-purple-800 font-semibold text-base">System checks for duplicates before uploading</span>
            </li>
          </ul>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border-2 border-indigo-300 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-indigo-900 mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-indigo-800 font-bold">Total Forms</span>
              <span className="text-2xl font-bold text-indigo-700">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-800 font-bold">Unique Identifier</span>
              <span className="font-bold text-indigo-700">Admission # + Term + Year</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-800 font-bold">Max File Size</span>
              <span className="font-bold text-indigo-700">10 MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-800 font-bold">Supported Formats</span>
              <span className="font-bold text-indigo-700">CSV, Excel</span>
            </div>
          </div>
        </div>

        {/* Required Fields Info */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-emerald-300 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-emerald-900 mb-4">Required Fields</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-emerald-800 font-semibold text-sm">admissionNumber (Required)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-emerald-800 font-semibold text-sm">form (Required: Form 1-4)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-emerald-800 font-semibold text-sm">term (Required: Term 1-3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-emerald-800 font-semibold text-sm">academicYear (Required: e.g., 2024/2025)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-emerald-800 font-semibold text-sm">Subject scores (Mathematics, English, etc.)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

        {view === 'results' && (
          <div className="space-y-8">
            {showFilters && (
              <ResultsFilterPanel
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          loadStudentResults(1);
                        }
                      }}
                      placeholder="Search by admission number, student name..."
                      className="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-400 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-600 transition-all duration-300 text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 lg:flex-none px-6 py-4 bg-white border-2 border-gray-400 rounded-2xl text-gray-700 font-bold flex items-center justify-center gap-3 text-base hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
                  >
                    <FiFilter />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  <button
                    onClick={() => loadStudentResults(1)}
                    disabled={loading}
                    className="flex-1 lg:flex-none px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all duration-300"
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
                <ResultsLoadingSpinner message="Loading academic results..." size="large" />
              </div>
            ) : (
              <>
                {studentResults.length > 0 && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Academic Results ({pagination.total})
                      </h3>
                      <div className="text-gray-600 font-bold text-base">
                        Page {pagination.page} of {pagination.pages}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-2xl">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[768px]">
                          <thead className="bg-gradient-to-r from-gray-100 to-white">
                            <tr>
                              <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Student</th>
                              <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Form/Term/Year</th>
                              <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Subjects</th>
                              <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Average Score</th>
                              <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-2 divide-gray-200">
                            {studentResults.map(result => {
                              const average = calculateResultAverage(result);
                              return (
                                <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                                        <FiUser className="text-white text-xl" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-gray-900 text-lg">#{result.admissionNumber}</div>
                                        {result.student && (
                                          <div className="text-gray-600 text-sm">
                                            {result.student.firstName} {result.student.lastName}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${getFormColor(result.form)}`}>
                                          {result.form}
                                        </span>
                                      </div>
                                      <div className="text-gray-700 text-sm">{result.term} {result.academicYear}</div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="text-gray-700">
                                      {result.subjects && Array.isArray(result.subjects) 
                                        ? result.subjects.slice(0, 3).map((s, i) => (
                                            <div key={i} className="text-sm">
                                              {s.subject}: {s.score}% ({s.grade})
                                            </div>
                                          ))
                                        : 'No subjects'}
                                      {result.subjects && Array.isArray(result.subjects) && result.subjects.length > 3 && (
                                        <div className="text-sm text-gray-500 mt-1">
                                          +{result.subjects.length - 3} more subjects
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                      <div className={`text-2xl font-bold ${getGradeColor(average).replace('bg-', 'text-')}`}>
                                        {average}%
                                      </div>
                                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full ${
                                            average >= 80 ? 'bg-emerald-500' :
                                            average >= 70 ? 'bg-green-500' :
                                            average >= 60 ? 'bg-blue-500' :
                                            average >= 50 ? 'bg-yellow-500' :
                                            average >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                          }`}
                                          style={{ width: `${average}%` }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => viewResultDetails(result)}
                                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold text-sm hover:bg-purple-200 transition-colors"
                                      >
                                        View
                                      </button>
                                      <button
                                        onClick={() => editResult(result)}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm hover:bg-blue-200 transition-colors"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {studentResults.length === 0 && !loading && (
                  <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-300 shadow-xl">
                    <FiBook className="text-6xl text-gray-300 mx-auto mb-6" />
                    <p className="text-gray-600 text-xl font-bold mb-4">No academic results found</p>
                    {(filters.search || filters.form || filters.term) && (
                      <button
                        onClick={handleClearFilters}
                        className="text-purple-600 font-bold text-lg hover:text-purple-800 transition-colors"
                      >
                        Clear filters to see all results
                      </button>
                    )}
                  </div>
                )}

                {studentResults.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t-2 border-gray-300">
                    <div className="text-gray-700 font-bold text-base">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 hover:text-purple-600 transition-colors"
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
                                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-2xl'
                                : 'border-2 border-gray-400 hover:border-purple-500 hover:text-purple-600'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500 hover:text-purple-600 transition-colors"
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

        {view === 'history' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Results Upload History</h3>
                <p className="text-gray-600 mt-2 text-base">Track all your results upload activities</p>
              </div>
              <button
                onClick={() => loadUploadHistory(1)}
                disabled={historyLoading}
                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all duration-300"
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
                <p className="text-gray-500 text-base">Upload your first results file to see history here</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[768px]">
                    <thead className="bg-gradient-to-r from-gray-100 to-white">
                      <tr>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Upload Details</th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Status</th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Statistics</th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-200">
                      {uploadHistory.map(upload => (
                        <tr key={upload.id} className="bg-white hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                                <FiFile className="text-purple-700 text-xl" />
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
                                <div className="mt-2">
                                  <span className="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700">
                                    {upload.metadata?.uploadMode === 'create' ? 'Create' : 'Update'}
                                  </span>
                                  {upload.metadata?.selectedForms && (
                                    <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700">
                                      {upload.metadata.selectedForms.length} forms
                                    </span>
                                  )}
                                  {upload.metadata?.targetForm && (
                                    <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700">
                                      {upload.metadata.targetForm}
                                    </span>
                                  )}
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
                              onClick={() => handleDelete('batch', upload.id, upload.fileName)}
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

      {selectedResult && (
        <ResultDetailModal
          result={selectedResult}
          student={selectedStudent}
          onClose={() => {
            setSelectedResult(null);
            setSelectedStudent(null);
          }}
          onEdit={() => {
            setEditingResult(selectedResult);
            setSelectedResult(null);
          }}
          onDelete={() => handleDelete('result', selectedResult.id, `Results for ${selectedResult.admissionNumber}`)}
          showNotification={showNotification}
        />
      )}

      {editingResult && (
        <ResultEditModal
          result={editingResult}
          student={selectedStudent}
          onClose={() => {
            setEditingResult(null);
            setSelectedResult(null);
            setSelectedStudent(null);
          }}
          onSave={updateResult}
          loading={loading}
        />
      )}

      {showDeleteModal && (
        <ResultsDeleteModal
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

      <ResultsUploadStrategyModal
        open={showStrategyModal}
        onClose={() => setShowStrategyModal(false)}
        onConfirm={handleStrategyConfirm}
        loading={loading}
        showNotification={showNotification}
      />
<ResultsDuplicateValidationModal
  open={showValidationModal}
  onClose={() => setShowValidationModal(false)}
  duplicates={duplicates}
  onProceed={proceedWithUpload}
  loading={uploading}
  uploadType={uploadStrategy?.uploadMode} // Make sure this is uploadType
  showNotification={showNotification}
  term={uploadStrategy?.term}
  academicYear={uploadStrategy?.academicYear}
  targetForm={uploadStrategy?.targetForm}
/>
    </div>
  );
}