'use client';

import { 
  useState, useMemo, useEffect, useCallback 
} from 'react';
import {
  FiAward, FiBook, FiTrendingUp, FiTrendingDown,
  FiDownload, FiRefreshCw, FiAlertTriangle, FiFilter,
  FiFile, FiImage, FiFileText, FiExternalLink,
  FiGrid, FiList, FiChevronRight, FiChevronUp,
  FiChevronDown, FiSearch, FiEye, FiEdit,
  FiTrash2, FiPlus, FiX, FiCheckCircle,
  FiInfo, FiCalendar, FiUser, FiClock,
  FiBarChart2, FiPercent, FiActivity,
  FiChevronLeft, FiChevronRight as FiChevronRightIcon, FiDownloadCloud, FiArrowRight  
} from 'react-icons/fi';

import {
  IoSchool, IoDocumentText, IoStatsChart,
  IoAnalytics, IoSparkles, IoClose,
  IoFilter as IoFilterIcon
} from 'react-icons/io5';
import {
  CircularProgress,
  Modal,
  Box
} from '@mui/material';

// Loading Spinner Component
function ResultsLoadingSpinner({ message = "Loading academic results...", size = "medium" }) {
  const sizes = {
    small: { outer: 48, inner: 24 },
    medium: { outer: 64, inner: 32 },
    large: { outer: 80, inner: 40 }
  };

  const { outer, inner } = sizes[size];

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
              <div key={i} className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Grade Calculation Helper
const calculateGrade = (score) => {
  const numericScore = parseFloat(score) || 0;
  if (numericScore >= 80) return 'A';
  if (numericScore >= 70) return 'A-';
  if (numericScore >= 60) return 'B+';
  if (numericScore >= 55) return 'B';
  if (numericScore >= 50) return 'B-';
  if (numericScore >= 45) return 'C+';
  if (numericScore >= 40) return 'C';
  if (numericScore >= 35) return 'C-';
  if (numericScore >= 30) return 'D+';
  if (numericScore >= 25) return 'D';
  return 'E';
};

// Grade Status Helper
const getGradeStatus = (grade) => {
  const g = grade?.toUpperCase();
  if (['A'].includes(g)) return { 
    color: 'text-emerald-600',
    bgColor: 'from-emerald-500 to-emerald-700',
    lightBg: 'bg-emerald-50',
    remark: 'Excellent! Outstanding performance.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconColor: 'text-emerald-500'
  };
  if (['A-'].includes(g)) return { 
    color: 'text-green-600',
    bgColor: 'from-green-500 to-green-700',
    lightBg: 'bg-green-50',
    remark: 'Very Good. Excellent understanding.',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    iconColor: 'text-green-500'
  };
  if (['B+'].includes(g)) return { 
    color: 'text-blue-600',
    bgColor: 'from-blue-500 to-blue-700',
    lightBg: 'bg-blue-50',
    remark: 'Good work. Solid grasp of concepts.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconColor: 'text-blue-500'
  };
  if (['B'].includes(g)) return { 
    color: 'text-cyan-600',
    bgColor: 'from-cyan-500 to-cyan-700',
    lightBg: 'bg-cyan-50',
    remark: 'Satisfactory. Good effort shown.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    iconColor: 'text-cyan-500'
  };
  if (['B-'].includes(g)) return { 
    color: 'text-amber-600',
    bgColor: 'from-amber-500 to-amber-700',
    lightBg: 'bg-amber-50',
    remark: 'Fair. Basic understanding achieved.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    iconColor: 'text-amber-500'
  };
  if (['C+'].includes(g)) return { 
    color: 'text-orange-600',
    bgColor: 'from-orange-500 to-orange-700',
    lightBg: 'bg-orange-50',
    remark: 'Below average. Needs more practice.',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    iconColor: 'text-orange-500'
  };
  return { 
    color: 'text-rose-600',
    bgColor: 'from-rose-500 to-rose-700',
    lightBg: 'bg-rose-50',
    remark: 'Weak. Requires additional support.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    iconColor: 'text-rose-500'
  };
};

// Statistics Card Component
function ResultsStatisticsCard({ title, value, icon: Icon, color, trend = 0, prefix = '', suffix = '' }) {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return prefix + val.toLocaleString() + suffix;
    }
    return prefix + val + suffix;
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="text-white text-xl md:text-2xl" />
        </div>
      </div>
      <h4 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{formatValue(value)}</h4>
      <p className="text-gray-600 text-xs md:text-sm font-semibold">{title}</p>
    </div>
  );
}

// Subject Details Modal Component
function SubjectDetailsModal({ result, onClose }) {
  if (!result) return null;

  const subjects = result.subjects || [];
  
  const overallStatus = getGradeStatus(result.overallGrade);
  const totalScore = result.totalScore || subjects.reduce((sum, s) => sum + (parseFloat(s.score) || 0), 0);
  const averageScore = result.averageScore || (subjects.length > 0 ? totalScore / subjects.length : 0);
  const subjectCount = subjects.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border-2 border-gray-300 shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-3 sm:p-4 md:p-6 text-white">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <div className="p-2 md:p-3 bg-white/20 rounded-2xl flex-shrink-0 mt-1">
                <FiBook className="text-lg sm:text-xl md:text-2xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg md:text-2xl font-bold truncate">Subject Performance Details</h2>
                <p className="text-blue-100 opacity-90 text-xs sm:text-sm mt-1 truncate">
                  Adm: {result.admissionNumber} • {result.term} {result.academicYear} • {result.form}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors flex-shrink-0 ml-2"
            >
              <IoClose className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-70px)] overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-blue-300">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs font-semibold text-blue-700 truncate">Avg Score</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1 truncate">{averageScore.toFixed(2)}%</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs font-semibold text-blue-700 truncate">Total Score</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1 truncate">{totalScore}</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs font-semibold text-blue-700 truncate">Grade</div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold mt-1 truncate ${overallStatus.color}`}>
                  {result.overallGrade || 'N/A'}
                </div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs font-semibold text-blue-700 truncate">Subjects</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1 truncate">{subjectCount}</div>
              </div>
              <div className="col-span-2 sm:col-span-3 md:col-span-1 text-center p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs font-semibold text-blue-700 truncate">Form</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1 truncate">{result.form}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Subject Performance</h3>
              <p className="text-gray-600 text-xs sm:text-sm truncate">Scores, grades, and comments per subject</p>
            </div>
            <div className="overflow-x-auto -webkit-scrollbar-hide md:scrollbar-default">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate">Subject</th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate">Score</th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate">Grade</th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate">Points</th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate hidden sm:table-cell">Teacher's Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subjects.map((subject, index) => {
                    const score = parseFloat(subject.score) || 0;
                    const grade = subject.grade || calculateGrade(score);
                    const points = subject.points || 0;
                    const status = getGradeStatus(grade);

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 sm:px-3 md:px-4 py-2">
                          <div className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{subject.subject}</div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-12 sm:w-16 md:w-20 bg-gray-200 rounded-full h-1.5 sm:h-2">
                              <div 
                                className={`h-full rounded-full ${status.color.replace('text-', 'bg-')}`}
                                style={{ width: `${Math.min(score, 100)}%` }}
                              />
                            </div>
                            <span className={`font-bold text-xs sm:text-sm min-w-8 sm:min-w-10 ${status.color}`}>{score}%</span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2">
                          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold ${status.badgeColor}`}>
                            {grade}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2">
                          <span className="font-bold text-gray-900 text-xs sm:text-sm">{points}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2 hidden sm:table-cell">
                          <span className="text-xs text-gray-600 italic truncate max-w-[150px] md:max-w-none block">{subject.comment || 'No comment'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-gray-300">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Performance Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Highest Subject</h4>
                {subjects.length > 0 ? (
                  (() => {
                    const highest = subjects.reduce((max, s) => 
                      parseFloat(s.score) > parseFloat(max.score) ? s : max, subjects[0]);
                    const status = getGradeStatus(highest.grade);
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs sm:text-sm truncate">{highest.subject}</span>
                          <span className={`font-bold text-xs sm:text-sm ${status.color}`}>{highest.score}%</span>
                        </div>
                        <div className="text-xs text-gray-600 truncate">{highest.comment}</div>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-gray-500 text-xs sm:text-sm">No data</span>
                )}
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Lowest Subject</h4>
                {subjects.length > 0 ? (
                  (() => {
                    const lowest = subjects.reduce((min, s) => 
                      parseFloat(s.score) < parseFloat(min.score) ? s : min, subjects[0]);
                    const status = getGradeStatus(lowest.grade);
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs sm:text-sm truncate">{lowest.subject}</span>
                          <span className={`font-bold text-xs sm:text-sm ${status.color}`}>{lowest.score}%</span>
                        </div>
                        <div className="text-xs text-gray-600 truncate">{lowest.comment}</div>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-gray-500 text-xs sm:text-sm">No data</span>
                )}
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 sm:col-span-2 md:col-span-1">
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Overall</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm">Grade:</span>
                    <span className={`font-bold text-xs sm:text-sm ${overallStatus.color}`}>{result.overallGrade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm">Average:</span>
                    <span className="font-bold text-gray-900 text-xs sm:text-sm">{averageScore.toFixed(2)}%</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 sm:mt-2 truncate">{overallStatus.remark}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Result Card Component
function ResultCard({ result, studentAdmissionNumber, onViewSubjects }) {
  const overallStatus = getGradeStatus(result.overallGrade);
  const isStudentResult = result.admissionNumber === studentAdmissionNumber;
  const averageScore = result.averageScore || 0;
  const totalScore = result.totalScore || 0;

  return (
    <div 
      className={`bg-white rounded-2xl border-2 ${
        isStudentResult 
          ? 'border-blue-500 border-l-4 shadow-lg' 
          : 'border-gray-200'
      } hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group`}
    >
      {isStudentResult && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-[10px] xs:text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-bl-lg font-bold shadow-lg">
            Your Result
          </div>
        </div>
      )}
      
      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">{result.term}</h3>
            <p className="text-xs text-gray-600 truncate">{result.academicYear}</p>
          </div>
          <div className={`px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r ${overallStatus.bgColor} text-white shadow-lg flex-shrink-0 ml-2`}>
            {result.overallGrade || 'N/A'}
          </div>
        </div>
        
        <div className="mb-3 sm:mb-4 space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700">
            <FiUser className="text-blue-500 text-xs sm:text-sm md:text-base flex-shrink-0" />
            <span className="font-semibold truncate">Adm: {result.admissionNumber}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <IoSchool className="text-gray-400 text-xs sm:text-sm md:text-base flex-shrink-0" />
            <span className="truncate">{result.form}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <FiBarChart2 className="text-gray-400 text-xs sm:text-sm md:text-base flex-shrink-0" />
            <span>Avg:</span>
            <span className="font-bold text-gray-900 truncate">{averageScore.toFixed(2)}%</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <FiActivity className="text-gray-400 text-xs sm:text-sm md:text-base flex-shrink-0" />
            <span>Total:</span>
            <span className="font-bold text-gray-900 truncate">{totalScore}</span>
          </div>
        </div>
        
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-gray-700 truncate">Performance:</span>
            <span className={overallStatus.color}>{averageScore.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${overallStatus.bgColor}`}
              style={{ width: `${Math.min(averageScore, 100)}%` }}
            />
          </div>
        </div>
        
        <button
          onClick={() => onViewSubjects(result)}
          className="w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-xl text-xs sm:text-sm font-semibold hover:from-blue-100 hover:to-blue-200 transition-all flex items-center justify-center gap-1 sm:gap-2 group-hover:shadow-md"
        >
          <FiEye className="text-xs sm:text-sm md:size-14" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}

// Helper function for PDF display
const getDisplayablePdfUrl = (url) => {
  if (!url) return url;
  
  if (url.includes('cloudinary.com') && url.includes('/raw/upload/')) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    if (pathname.toLowerCase().endsWith('.pdf')) {
      if (url.includes('?')) {
        return `${url}&fl_attachment`;
      } else {
        return `${url}?fl_attachment`;
      }
    }
  }
  
  return url;
};

// Document Card Component
function DocumentCard({ document, type = 'additional' }) {
  const getIcon = () => {
    const iconBase = "text-lg sm:text-xl md:text-2xl";
    
    const fileName = document.name || document.filename || '';
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf' || type === 'exam') {
      return <FiFileText className={`${iconBase} text-rose-500`} />;
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      return <FiFileText className={`${iconBase} text-blue-500`} />;
    } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
      return <FiImage className={`${iconBase} text-emerald-500`} />;
    }
    return <FiFile className={`${iconBase} text-amber-500`} />;
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const getFileType = () => {
    const fileName = document.name || document.filename || '';
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf') return 'PDF Document';
    if (fileExtension === 'docx' || fileExtension === 'doc') return 'Word Document';
    if (fileExtension === 'jpg' || fileExtension === 'jpeg') return 'JPEG Image';
    if (fileExtension === 'png') return 'PNG Image';
    if (fileExtension === 'xlsx' || fileExtension === 'xls') return 'Excel Spreadsheet';
    return 'Document';
  };

  const displayUrl = getDisplayablePdfUrl(document.pdf || document.filepath);
  const fileName = document.name || document.filename || '';
  const fileExtension = fileName.split('.').pop().toLowerCase();
  const isPdf = fileExtension === 'pdf';

  return (
    <div className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      
      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h5 className="font-bold text-gray-800 text-sm sm:text-base leading-tight truncate pr-1">
              {fileName}
            </h5>
            {document.year && (
              <span className="flex-shrink-0 text-[10px] xs:text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full ml-1">
                {document.year}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">
              {type === 'exam' ? `Form ${document.form}` : document.term || 'General'}
            </span>
            
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[9px] xs:text-[10px] sm:text-xs font-medium">
              {getFileType()}
            </span>
            
            {document.uploadDate && (
              <span className="inline-flex items-center text-gray-400 text-[9px] xs:text-[10px] sm:text-xs font-medium">
                <FiCalendar className="mr-0.5 text-xs" />
                {formatDate(document.uploadDate)}
              </span>
            )}
            <span className="inline-flex items-center text-gray-400 text-[9px] xs:text-[10px] sm:text-xs font-medium truncate">
              <FiDownloadCloud className="mr-0.5 sm:mr-1 text-xs" />
              {formatSize(document.size || document.filesize)}
            </span>
          </div>
        </div>
      </div>

      {document.description && (
        <div className="mt-2 sm:mt-3">
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
            {document.description}
          </p>
        </div>
      )}

      <div className="mt-3 sm:mt-4">
        {isPdf ? (
          <button
            onClick={() => {
              const pdfWindow = window.open();
              if (pdfWindow) {
                pdfWindow.location.href = displayUrl;
              }
            }}
            className="flex items-center justify-center gap-1 sm:gap-2 w-full py-2 px-3 sm:py-2.5 sm:px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-md hover:shadow-rose-500/25 active:scale-[0.98]"
          >
            <FiEye className="text-xs sm:text-sm" />
            <span>View PDF</span>
          </button>
        ) : (
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={!isPdf}
            className="flex items-center justify-center gap-1 sm:gap-2 w-full py-2 px-3 sm:py-2.5 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-md hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            <FiDownload className="text-xs sm:text-sm" />
            <span>Download File</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function ModernResultsView({ 
  student, 
  studentResults, 
  resultsLoading, 
  resultsError, 
  onRefreshResults 
}) {
  const [selectedTerm, setSelectedTerm] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [selectedResult, setSelectedResult] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [documentError, setDocumentError] = useState(null);
  
  const [stats, setStats] = useState({
    totalResults: 0,
    averageScore: 0,
    yourGrade: 'N/A',
    currentTerm: 'N/A',
    currentTermResults: 0
  });

  // Transform studentResults
  const transformedResults = useMemo(() => {
    if (!studentResults || !Array.isArray(studentResults)) return [];
    
    return studentResults.map(result => ({
      ...result,
      class: result.form,
      meanGrade: result.overallGrade,
      subjects: Array.isArray(result.subjects) ? result.subjects : [],
      averageScore: parseFloat(result.averageScore) || 0,
      totalScore: parseFloat(result.totalScore) || 0
    }));
  }, [studentResults]);

  // Fetch school document data - INDEPENDENTLY, ALWAYS FETCH
  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setDocumentLoading(true);
        setDocumentError(null);
        
        console.log('📥 Fetching school documents independently...');
        const response = await fetch('/api/schooldocuments');
        
        if (!response.ok) {
          // Don't throw error, just use empty structure
          console.warn('⚠️ School documents API not available, using empty structure');
          setDocumentData({
            form1ResultsPdf: null,
            form2ResultsPdf: null,
            form3ResultsPdf: null,
            form4ResultsPdf: null,
            kcseResultsPdf: null,
            mockExamsResultsPdf: null,
            additionalDocuments: []
          });
          return;
        }
        
        const data = await response.json();
        
        // Always set documentData regardless of response
        if (data && data.document) {
          setDocumentData(data.document);
          console.log('✅ School documents loaded successfully');
        } else {
          // Empty but valid structure
          setDocumentData({
            form1ResultsPdf: null,
            form2ResultsPdf: null,
            form3ResultsPdf: null,
            form4ResultsPdf: null,
            kcseResultsPdf: null,
            mockExamsResultsPdf: null,
            additionalDocuments: []
          });
        }
      } catch (error) {
        console.error('❌ Error in school documents fetch:', error);
        // Still set empty data - never break the UI
        setDocumentData({
          form1ResultsPdf: null,
          form2ResultsPdf: null,
          form3ResultsPdf: null,
          form4ResultsPdf: null,
          kcseResultsPdf: null,
          mockExamsResultsPdf: null,
          additionalDocuments: []
        });
      } finally {
        setDocumentLoading(false);
      }
    };

    // ALWAYS FETCH - NO CONDITIONS
    fetchDocumentData();
  }, []); // Empty dependency array - fetch once on mount

  // Calculate statistics - STUDENT RESULTS ONLY
  useEffect(() => {
    if (transformedResults.length > 0 && student?.admissionNumber) {
      const studentResults = transformedResults.filter(result => 
        result.admissionNumber === student.admissionNumber
      );
      
      const totalResults = studentResults.length;
      const averageScore = studentResults.reduce((sum, result) => 
        sum + (result.averageScore || 0), 0) / totalResults;
      
      const currentTerm = selectedTerm !== 'all' 
        ? selectedTerm 
        : studentResults.length > 0 ? studentResults[studentResults.length - 1].term : 'N/A';
      
      const currentTermResults = studentResults.filter(result => 
        result.term === currentTerm
      ).length;

      let yourGrade = 'N/A';
      if (currentTerm !== 'N/A') {
        const currentTermResult = studentResults.find(r => r.term === currentTerm);
        yourGrade = currentTermResult?.overallGrade || 'N/A';
      } else if (studentResults.length > 0) {
        yourGrade = studentResults[studentResults.length - 1].overallGrade || 'N/A';
      }

      setStats({
        totalResults,
        averageScore: parseFloat(averageScore.toFixed(2)),
        yourGrade,
        currentTerm,
        currentTermResults
      });
    } else {
      setStats({
        totalResults: 0,
        averageScore: 0,
        yourGrade: 'N/A',
        currentTerm: 'N/A',
        currentTermResults: 0
      });
    }
  }, [transformedResults, selectedTerm, student]);

  // Filter and sort results - ONLY STUDENT'S RESULTS
  const filteredResults = useMemo(() => {
    let results = [...transformedResults];
    
    if (student?.admissionNumber) {
      results = results.filter(result => result.admissionNumber === student.admissionNumber);
    }
    
    if (selectedTerm !== 'all') {
      results = results.filter(result => result.term === selectedTerm);
    }
    
    if (selectedYear !== 'all') {
      results = results.filter(result => result.academicYear === selectedYear);
    }
    
    results.sort((a, b) => {
      if (a.academicYear !== b.academicYear) {
        return b.academicYear.localeCompare(a.academicYear);
      }
      
      const termOrder = { 'Term 1': 1, 'Term 2': 2, 'Term 3': 3 };
      return (termOrder[a.term] || 0) - (termOrder[b.term] || 0);
    });
    
    return results;
  }, [transformedResults, selectedTerm, selectedYear, student]);

  const uniqueTerms = useMemo(() => {
    const terms = [...new Set(transformedResults.map(r => r.term))].filter(Boolean);
    return ['all', ...terms];
  }, [transformedResults]);

  const uniqueYears = useMemo(() => {
    const years = [...new Set(transformedResults.map(r => r.academicYear))].filter(Boolean);
    return ['all', ...years];
  }, [transformedResults]);

  // Process exam results from documentData - ALWAYS PROCESS
  const prioritizedExamResults = useMemo(() => {
    if (!documentData) return [];
    
    const results = [];
    const studentForm = student?.form?.replace('Form ', '') || '4';
    
    const examFields = [
      { key: 'form1ResultsPdf', form: '1', name: 'Form 1 Results' },
      { key: 'form2ResultsPdf', form: '2', name: 'Form 2 Results' },
      { key: 'form3ResultsPdf', form: '3', name: 'Form 3 Results' },
      { key: 'form4ResultsPdf', form: '4', name: 'Form 4 Results' },
      { key: 'mockExamsResultsPdf', form: '4', name: 'Mock Exams Results' },
      { key: 'kcseResultsPdf', form: '4', name: 'KCSE Results' }
    ];
    
    examFields.forEach(({ key, form, name }) => {
      const pdfUrl = documentData[key];
      if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.trim() !== '') {
        const formKey = key.replace('Pdf', '');
        results.push({
          name: documentData[`${formKey}Name`] || name,
          pdf: pdfUrl,
          form: form,
          type: 'exam',
          priority: form === studentForm ? 0 : parseInt(form) || 99,
          description: documentData[`${formKey}Description`] || '',
          year: documentData[`${formKey}Year`] || '',
          term: documentData[`${formKey}Term`] || '',
          size: documentData[`${formKey}Size`] || documentData[`${formKey}PdfSize`] || 0,
          uploadDate: documentData[`${formKey}UploadDate`] || ''
        });
      }
    });
    
    return results.sort((a, b) => a.priority - b.priority);
  }, [documentData, student]);

  // Process additional documents - ALWAYS PROCESS
  const additionalResultsFiles = useMemo(() => {
    if (!documentData || !documentData.additionalDocuments) return [];
    
    const additionalDocs = Array.isArray(documentData.additionalDocuments) 
      ? documentData.additionalDocuments 
      : [];
    
    const resultsOnly = additionalDocs.filter(doc => {
      if (!doc) return false;
      
      const filename = (doc.filename || '').toLowerCase();
      const description = (doc.description || '').toLowerCase();
      
      return (
        filename.includes('result') ||
        filename.includes('exam') ||
        filename.includes('test') ||
        filename.includes('mark') ||
        description.includes('result') ||
        description.includes('exam') ||
        description.includes('test') ||
        description.includes('mark') ||
        description.includes('score') ||
        description.includes('grade')
      );
    });
    
    return resultsOnly
      .sort((a, b) => {
        if (a.year && b.year && a.year !== b.year) {
          return parseInt(b.year) - parseInt(a.year);
        }
        const dateA = a.uploadedAt ? new Date(a.uploadedAt) : 0;
        const dateB = b.uploadedAt ? new Date(b.uploadedAt) : 0;
        return dateB - dateA;
      })
      .map(doc => ({
        filename: doc.filename || '',
        filepath: doc.filepath || '',
        filetype: doc.filetype || '',
        description: doc.description || '',
        year: doc.year || '',
        term: doc.term || '',
        filesize: doc.filesize || 0,
        uploadedAt: doc.uploadedAt || ''
      }));
  }, [documentData]);

  const handleViewSubjects = (result) => {
    setSelectedResult(result);
  };

  if (resultsLoading) {
    return <ResultsLoadingSpinner />;
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-3 md:p-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 rounded-2xl p-3 sm:p-4 md:p-6 text-white overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-0 md:flex-row md:items-center justify-between">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-2xl flex-shrink-0">
                <FiAward className="text-lg sm:text-xl md:text-2xl text-yellow-300" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-3xl font-bold truncate">Academic Results Portal</h1>
                <p className="text-purple-100 text-xs sm:text-sm md:text-lg mt-0.5 truncate">
                  Your personal academic performance
                  {student?.admissionNumber && (
                    <span className="ml-1 sm:ml-2 text-yellow-300 font-semibold">
                      (Adm: {student.admissionNumber})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onRefreshResults}
              disabled={resultsLoading}
              className="mt-2 sm:mt-0 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-white/20 text-white rounded-xl font-bold text-xs sm:text-sm md:text-base hover:bg-white/30 disabled:opacity-50 flex items-center gap-1 sm:gap-2 justify-center w-full sm:w-auto"
            >
              <FiRefreshCw className={`text-sm sm:text-base ${resultsLoading ? 'animate-spin' : ''}`} />
              <span>{resultsLoading ? 'Refreshing...' : 'Refresh Results'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
        <ResultsStatisticsCard
          title="Total Results"
          value={stats.totalResults}
          icon={FiBook}
          color="from-purple-500 to-purple-700"
          trend={8.5}
        />
        <ResultsStatisticsCard
          title="Average Score"
          value={stats.averageScore}
          icon={FiTrendingUp}
          color="from-blue-500 to-blue-700"
          trend={2.3}
          suffix="%"
        />
        <ResultsStatisticsCard
          title="Your Grade"
          value={stats.yourGrade}
          icon={FiAward}
          color="from-emerald-500 to-emerald-700"
          trend={1.7}
        />
        <ResultsStatisticsCard
          title={stats.currentTerm}
          value={stats.currentTermResults}
          icon={FiCalendar}
          color="from-indigo-500 to-indigo-700"
          trend={5.2}
        />
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 border-2 border-gray-200">
        <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <IoFilterIcon className="text-purple-600 text-sm sm:text-base" />
              <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Filter Results</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiList className="text-xs sm:text-sm" />
                  <span className="hidden xs:inline">List</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiGrid className="text-xs sm:text-sm" />
                  <span className="hidden xs:inline">Grid</span>
                </button>
              </div>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="p-1 sm:p-1.5 text-gray-600 hover:text-gray-900"
              >
                <FiChevronDown className={`text-sm sm:text-base transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-4 md:gap-3">
            <div className="xs:col-span-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              >
                {uniqueTerms.map(term => (
                  <option key={term} value={term}>
                    {term === 'all' ? 'All Terms' : term}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="xs:col-span-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              >
                {uniqueYears.map(year => (
                  <option key={year} value={year}>
                    {year === 'all' ? 'All Years' : year}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-span-1 xs:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Quick Actions</label>
              <div className="flex gap-1.5 sm:gap-2">
                {(selectedTerm !== 'all' || selectedYear !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedTerm('all');
                      setSelectedYear('all');
                    }}
                    className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-bold text-xs sm:text-sm hover:from-purple-100 hover:to-purple-200 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2"
                >
                  <FiFilter className="text-xs sm:text-sm" />
                  {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
                </button>
              </div>
            </div>
          </div>
          
          {showAdvancedFilters && (
            <div className="pt-2 sm:pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Min Grade</label>
                  <select className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-gray-300 rounded-lg text-xs sm:text-sm">
                    <option value="">Any Grade</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Form/Class</label>
                  <select className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-gray-300 rounded-lg text-xs sm:text-sm">
                    <option value="">All Forms</option>
                    <option value="Form 4">Form 4</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 1">Form 1</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STUDENT RESULTS SECTION */}
      {resultsError ? (
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl md:rounded-2xl border-2 border-red-300 p-3 sm:p-4 md:p-6 text-center">
          <FiAlertTriangle className="text-red-500 text-xl sm:text-2xl md:text-3xl mx-auto mb-2 sm:mb-3" />
          <h3 className="text-sm sm:text-base md:text-xl font-bold text-red-800 mb-1 sm:mb-2">Unable to load results</h3>
          <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4">{resultsError}</p>
          <button
            onClick={onRefreshResults}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-bold text-xs sm:text-sm hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white rounded-xl md:rounded-2xl border-2 border-gray-300 p-4 sm:p-6 md:p-8 text-center">
          <FiAward className="text-gray-300 text-2xl sm:text-3xl md:text-4xl mx-auto mb-3 sm:mb-4" />
          <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-800 mb-1 sm:mb-2">No student results found</h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            {selectedTerm !== 'all' || selectedYear !== 'all' 
              ? 'Try changing your filters' 
              : 'Your academic results will appear here when available'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Results Display */}
          <div>
            <div className="mb-2 sm:mb-3 md:mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1 truncate">Your Academic Results</h3>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">
                    Showing {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} • Click for details
                  </p>
                </div>
                <div className="text-xs font-semibold text-gray-500 mt-1 sm:mt-0">
                  {selectedTerm !== 'all' && `${selectedTerm} • `}
                  {selectedYear !== 'all' && `${selectedYear}`}
                </div>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div className="bg-white rounded-xl md:rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto -webkit-scrollbar-hide md:scrollbar-default">
                  <div className="min-w-[600px]">
                    <div className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
                      <div className="grid grid-cols-12 gap-1 sm:gap-2 px-2 sm:px-3 md:px-6 py-2 sm:py-3">
                        <div className="col-span-3 text-xs font-bold text-gray-700 uppercase truncate">Admission</div>
                        <div className="col-span-3 text-xs font-bold text-gray-700 uppercase truncate">Term & Year</div>
                        <div className="col-span-2 text-xs font-bold text-gray-700 uppercase truncate hidden xs:block">Form</div>
                        <div className="col-span-2 xs:col-span-1 text-xs font-bold text-gray-700 uppercase text-center truncate">Avg</div>
                        <div className="col-span-2 xs:col-span-1 text-xs font-bold text-gray-700 uppercase text-center truncate">Grade</div>
                        <div className="col-span-2 xs:col-span-1 text-xs font-bold text-gray-700 uppercase text-center truncate">View</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {filteredResults.map((result, index) => {
                        const overallStatus = getGradeStatus(result.overallGrade);
                        const isStudentResult = result.admissionNumber === student?.admissionNumber;
                        
                        return (
                          <div 
                            key={index} 
                            className={`grid grid-cols-12 gap-1 sm:gap-2 px-2 sm:px-3 md:px-6 py-2 sm:py-3 hover:bg-gray-50 transition-colors ${isStudentResult ? 'bg-blue-50' : ''}`}
                          >
<div className="col-span-3 flex flex-col items-start gap-0.5">
  <div className="flex items-center gap-2 max-w-full">
    <div className="font-black text-slate-900 text-xs sm:text-sm tracking-tight truncate">
      {result.admissionNumber}
    </div>
    
    {isStudentResult && (
      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] xs:text-[11px] font-black uppercase tracking-wider rounded-md border border-blue-100 leading-none">
        You
      </span>
    )}
  </div>

  <button
    onClick={() => handleViewSubjects(result)}
    className="group flex items-center gap-1 mt-0.5 text-[11px] sm:text-xs text-blue-600 hover:text-blue-700 font-bold transition-all"
  >
    <span className="border-b border-blue-600/30 group-hover:border-blue-700 transition-colors">
      View Results
    </span>
    <FiArrowRight  size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
  </button>
</div>

                            <div className="col-span-3">
                              <div className="font-bold text-gray-900 text-xs sm:text-sm truncate">{result.term}</div>
                              <div className="text-gray-600 text-[10px] xs:text-xs truncate">{result.academicYear}</div>
                            </div>
                            <div className="col-span-2 hidden xs:block">
                              <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{result.form}</div>
                            </div>
                            <div className="col-span-2 xs:col-span-1 text-center">
                              <div className="text-sm sm:text-base font-bold text-gray-900 truncate">{result.averageScore.toFixed(1)}%</div>
                              <div className="text-gray-500 text-[10px] xs:text-xs hidden xs:block">Total: {result.totalScore}</div>
                            </div>
                            <div className="col-span-2 xs:col-span-1 text-center">
                              <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-[10px] xs:text-xs font-bold ${overallStatus.badgeColor}`}>
                                {result.overallGrade || 'N/A'}
                              </span>
                            </div>
                            <div className="col-span-2 xs:col-span-1 text-center">
                              <button
                                onClick={() => handleViewSubjects(result)}
                                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:from-blue-100 hover:to-blue-200 transition-all flex items-center gap-0.5 sm:gap-1 justify-center mx-auto"
                              >
                                <FiEye className="text-xs" />
                                <span className="hidden xs:inline text-xs">View</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
                {filteredResults.map((result, index) => (
                  <ResultCard
                    key={index}
                    result={result}
                    studentAdmissionNumber={student?.admissionNumber}
                    onViewSubjects={handleViewSubjects}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* SCHOOL DOCUMENTS SECTION - ALWAYS SHOWS, INDEPENDENT OF STUDENT RESULTS */}
      <div className="mt-6 pt-6 border-t-2 border-gray-300">
        <div className="mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <IoDocumentText className="text-indigo-600 text-lg sm:text-xl" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              School Exam Results Documents
            </h3>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm">
            Access class exam results, mock exams, and KCSE results from school administration.
            {documentLoading && ' (Loading documents...)'}
          </p>
        </div>

        {documentLoading ? (
          <div className="text-center py-6 sm:py-8">
            <CircularProgress size={20} className="text-purple-600" />
            <p className="text-gray-600 text-xs sm:text-sm mt-2">Loading exam documents...</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Exam Results */}
            {prioritizedExamResults.length > 0 && (
              <div>
                <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1.5 sm:mb-2 md:mb-3">
                  Class Exam Results
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 md:gap-3">
                  {prioritizedExamResults.map((result, index) => (
                    <DocumentCard key={index} document={result} type="exam" />
                  ))}
                </div>
              </div>
            )}

            {/* Additional Results Files */}
            {additionalResultsFiles.length > 0 && (
              <div>
                <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1.5 sm:mb-2 md:mb-3">
                  Additional Exam Reports
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                  Supplementary results, test scores, and performance reports.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 md:gap-3">
                  {additionalResultsFiles.map((file, index) => (
                    <DocumentCard key={index} document={file} type="exam" />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State for Documents - Show only if BOTH are empty */}
            {!documentLoading && prioritizedExamResults.length === 0 && additionalResultsFiles.length === 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 p-4 sm:p-6 text-center">
                <FiAward className="text-gray-300 text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3" />
                <h4 className="text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">No exam results documents</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Class exam results and reports will appear here when uploaded by school administration.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subject Details Modal */}
      {selectedResult && (
        <SubjectDetailsModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .-webkit-scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          .-webkit-scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
        
        @media (min-width: 768px) {
          .md\\:scrollbar-default::-webkit-scrollbar {
            display: block;
          }
          
          .md\\:scrollbar-default {
            -ms-overflow-style: auto;
            scrollbar-width: auto;
          }
        }
      `}</style>
    </div>
  );
}