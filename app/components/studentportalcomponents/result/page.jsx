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
  FiChevronLeft, FiChevronRight as FiChevronRightIcon, FiDownloadCloud 
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
import { result } from 'lodash';

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

// Statistics Card Component - UPDATED to match second code
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
        <div className={`text-xs md:text-sm font-bold px-2 py-1 md:px-3 md:py-1 rounded-lg ${
          trend > 0 
            ? 'bg-green-100 text-green-800' 
            : trend < 0 
            ? 'bg-red-100 text-red-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : '0%'}
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border-2 border-gray-300 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-white/20 rounded-2xl">
                <FiBook className="text-xl md:text-2xl" />
              </div>
              <div>
                <h2 className="text-lg md:text-2xl font-bold">Subject Performance Details</h2>
                <p className="text-blue-100 opacity-90 text-xs md:text-sm mt-1">
                  Admission No: {result.admissionNumber} • {result.term} {result.academicYear} • {result.form}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors"
            >
              <IoClose className="text-lg md:text-xl" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Overall Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 md:p-6 border-2 border-blue-300">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs md:text-sm font-semibold text-blue-700">Average Score</div>
                <div className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{averageScore.toFixed(2)}%</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs md:text-sm font-semibold text-blue-700">Total Score</div>
                <div className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{totalScore}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs md:text-sm font-semibold text-blue-700">Overall Grade</div>
                <div className={`text-lg md:text-2xl font-bold mt-1 ${overallStatus.color}`}>
                  {result.overallGrade || 'N/A'}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs md:text-sm font-semibold text-blue-700">Subjects</div>
                <div className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{subjectCount}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs md:text-sm font-semibold text-blue-700">Form</div>
                <div className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{result.form}</div>
              </div>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Subject Performance Breakdown</h3>
              <p className="text-gray-600 text-sm">Detailed scores, grades, and comments for each subject</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Grade</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Points</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Teacher's Comment</th>
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
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{subject.subject}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-full rounded-full ${status.color.replace('text-', 'bg-')}`}
                                style={{ width: `${Math.min(score, 100)}%` }}
                              />
                            </div>
                            <span className={`font-bold min-w-10 ${status.color}`}>{score}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.badgeColor}`}>
                            {grade}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-gray-900">{points}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600 italic">{subject.comment || 'No comment'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 border-2 border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Performance Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Highest Scoring Subject</h4>
                {subjects.length > 0 ? (
                  (() => {
                    const highest = subjects.reduce((max, s) => 
                      parseFloat(s.score) > parseFloat(max.score) ? s : max, subjects[0]);
                    const status = getGradeStatus(highest.grade);
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{highest.subject}</span>
                          <span className={`font-bold ${status.color}`}>{highest.score}%</span>
                        </div>
                        <div className="text-sm text-gray-600">{highest.comment}</div>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-gray-500">No data</span>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Lowest Scoring Subject</h4>
                {subjects.length > 0 ? (
                  (() => {
                    const lowest = subjects.reduce((min, s) => 
                      parseFloat(s.score) < parseFloat(min.score) ? s : min, subjects[0]);
                    const status = getGradeStatus(lowest.grade);
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{lowest.subject}</span>
                          <span className={`font-bold ${status.color}`}>{lowest.score}%</span>
                        </div>
                        <div className="text-sm text-gray-600">{lowest.comment}</div>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-gray-500">No data</span>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Overall Performance</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Grade:</span>
                    <span className={`font-bold ${overallStatus.color}`}>{result.overallGrade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Average:</span>
                    <span className="font-bold text-gray-900">{averageScore.toFixed(2)}%</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">{overallStatus.remark}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Result Card Component for Grid View - FROM SECOND CODE
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs px-3 py-1 rounded-bl-lg font-bold shadow-lg">
            Your Result
          </div>
        </div>
      )}
      
      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">{result.term}</h3>
            <p className="text-xs md:text-sm text-gray-600">{result.academicYear}</p>
          </div>
          <div className={`px-3 py-1 md:px-4 md:py-2 rounded-xl font-bold text-sm bg-gradient-to-r ${overallStatus.bgColor} text-white shadow-lg`}>
            {result.overallGrade || 'N/A'}
          </div>
        </div>
        
        {/* Student Info */}
        <div className="mb-3 md:mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FiUser className="text-blue-500 text-sm md:text-base" />
            <span className="font-semibold text-xs md:text-sm">Adm: {result.admissionNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoSchool className="text-gray-400 text-sm md:text-base" />
            <span className="text-xs md:text-sm">{result.form}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiBarChart2 className="text-gray-400 text-sm md:text-base" />
            <span className="text-xs md:text-sm">Average:</span>
            <span className="font-bold text-gray-900 text-sm md:text-base">{averageScore.toFixed(2)}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiActivity className="text-gray-400 text-sm md:text-base" />
            <span className="text-xs md:text-sm">Total Score:</span>
            <span className="font-bold text-gray-900 text-sm md:text-base">{totalScore}</span>
          </div>
        </div>
        
        {/* Performance Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs md:text-sm font-semibold mb-1">
            <span className="text-gray-700">Overall Performance:</span>
            <span className={overallStatus.color}>{averageScore.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${overallStatus.bgColor}`}
              style={{ width: `${Math.min(averageScore, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Action Button */}
        <button
          onClick={() => onViewSubjects(result)}
          className="w-full px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-xl text-xs md:text-sm font-semibold hover:from-blue-100 hover:to-blue-200 transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
        >
          <FiEye size={12} className="md:size-14" />
          View Full Details
        </button>
      </div>
    </div>
  );
}

// Document Card Component
function DocumentCard({ document, type = 'additional' }) {
  const getIcon = () => {
    const iconBase = "text-xl md:text-2xl";
    if (type === 'exam') return <FiFileText className={`${iconBase} text-rose-500`} />;
    if (document.filetype?.includes('pdf')) return <FiFileText className={`${iconBase} text-rose-500`} />;
    if (document.filetype?.includes('image')) return <FiImage className={`${iconBase} text-emerald-500`} />;
    return <FiFile className={`${iconBase} text-amber-500`} />;
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-sm transition-all duration-300">
      
      {/* Top Section: Icon & Info */}
      <div className="flex items-start gap-4">
        {/* Modern Icon Container */}
        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-100 transition-transform duration-300">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h5 className="font-bold text-gray-800 text-sm md:text-base leading-tight truncate pr-2">
              {document.name || document.filename}
            </h5>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold uppercase tracking-wider">
              {type === 'exam' ? `Form ${document.form}` : document.year || 'General'}
            </span>
            <span className="inline-flex items-center text-gray-400 text-[10px] md:text-xs font-medium">
              <FiDownloadCloud className="mr-1" />
              {formatSize(document.size || document.filesize)}
            </span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {document.description && (
        <p className="text-gray-500 text-xs mt-3 leading-relaxed line-clamp-2 italic">
          "{document.description}"
        </p>
      )}

      {/* Action Button */}
      <div className="mt-4">
        <a
          href={document.pdf || document.filepath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-900 hover:bg-blue-600 text-white rounded-xl text-xs md:text-sm font-bold transition-all duration-300 shadow-md hover:shadow-blue-500/25 active:scale-[0.98]"
        >
          <span>View Document</span>
          <FiExternalLink className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Hover Decorative Element */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
  const [schoolData, setSchoolData] = useState(null);
  const [schoolLoading, setSchoolLoading] = useState(true);
  const [schoolError, setSchoolError] = useState(null);
  
  // CHANGED: Updated stats to match second code (4 cards, student-specific)
  const [stats, setStats] = useState({
    totalResults: 0,
    averageScore: 0,
    yourGrade: 'N/A',
    currentTerm: 'N/A',
    currentTermResults: 0
  });

  // Transform studentResults to match expected format
  const transformedResults = useMemo(() => {
    if (!studentResults || !Array.isArray(studentResults)) return [];
    
    return studentResults.map(result => ({
      ...result,
      // Map form to class for compatibility
      class: result.form,
      // Map overallGrade to meanGrade for compatibility
      meanGrade: result.overallGrade,
      // Ensure subjects is an array
      subjects: Array.isArray(result.subjects) ? result.subjects : [],
      // Ensure scores are numbers
      averageScore: parseFloat(result.averageScore) || 0,
      totalScore: parseFloat(result.totalScore) || 0
    }));
  }, [studentResults]);

  // Fetch school data
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setSchoolLoading(true);
        const response = await fetch('/api/school');
        const data = await response.json();
        
        if (data.success) {
          setSchoolData(data.school);
        } else {
          throw new Error('Failed to load school data');
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        setSchoolError(error.message);
      } finally {
        setSchoolLoading(false);
      }
    };

    fetchSchoolData();
  }, []);

  // CHANGED: Calculate statistics from transformed results - STUDENT-SPECIFIC ONLY (from second code)
  useEffect(() => {
    if (transformedResults.length > 0 && student?.admissionNumber) {
      // Filter to only show current student's results
      const studentResults = transformedResults.filter(result => 
        result.admissionNumber === student.admissionNumber
      );
      
      const totalResults = studentResults.length;
      const averageScore = studentResults.reduce((sum, result) => 
        sum + (result.averageScore || 0), 0) / totalResults;
      
      // Get current term from filtered term or latest result
      const currentTerm = selectedTerm !== 'all' 
        ? selectedTerm 
        : studentResults.length > 0 ? studentResults[studentResults.length - 1].term : 'N/A';
      
      const currentTermResults = studentResults.filter(result => 
        result.term === currentTerm
      ).length;

      // Get student's grade from current term
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
      // Reset stats if no student results
      setStats({
        totalResults: 0,
        averageScore: 0,
        yourGrade: 'N/A',
        currentTerm: 'N/A',
        currentTermResults: 0
      });
    }
  }, [transformedResults, selectedTerm, student]);

  // Filter and sort results - ONLY STUDENT'S RESULTS (from second code)
  const filteredResults = useMemo(() => {
    let results = [...transformedResults];
    
    // Filter to show only student's results
    if (student?.admissionNumber) {
      results = results.filter(result => result.admissionNumber === student.admissionNumber);
    }
    
    if (selectedTerm !== 'all') {
      results = results.filter(result => result.term === selectedTerm);
    }
    
    if (selectedYear !== 'all') {
      results = results.filter(result => result.academicYear === selectedYear);
    }
    
    // Sort by academic year (newest first) and then by term order
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

  // Process school exam results
  const prioritizedExamResults = useMemo(() => {
    if (!schoolData?.examResults) return [];
    
    const results = [];
    const examResults = schoolData.examResults;
    const studentForm = student?.form || '4';
    
    // Add student's own form first
    const studentFormKey = `form${studentForm}`;
    if (examResults[studentFormKey]) {
      results.push({
        ...examResults[studentFormKey],
        form: studentForm,
        type: 'exam',
        priority: 1
      });
    }
    
    // Add other forms
    const forms = ['form4', 'form3', 'form2', 'form1', 'mockExams', 'kcse'];
    forms.forEach(formKey => {
      if (formKey !== studentFormKey && examResults[formKey]) {
        results.push({
          ...examResults[formKey],
          form: formKey.replace('form', ''),
          type: 'exam',
          priority: formKey === 'mockExams' || formKey === 'kcse' ? 3 : 2
        });
      }
    });
    
    return results.sort((a, b) => a.priority - b.priority);
  }, [schoolData, student]);

  // Process additional results files
  const additionalResultsFiles = useMemo(() => {
    if (!schoolData?.additionalResultsFiles) return [];
    
    return [...schoolData.additionalResultsFiles]
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 6);
  }, [schoolData]);

  const handleViewSubjects = (result) => {
    setSelectedResult(result);
  };

  if (resultsLoading) {
    return <ResultsLoadingSpinner />;
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 rounded-2xl p-4 md:p-6 text-white overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-2xl">
                <FiAward className="text-xl md:text-2xl text-yellow-300" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold">Academic Results Portal</h1>
                <p className="text-purple-100 text-sm md:text-lg mt-1">
                  Your personal academic performance and results history
                  {student?.admissionNumber && (
                    <span className="ml-2 text-yellow-300 font-semibold">
                      (Admission: {student.admissionNumber})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onRefreshResults}
              disabled={resultsLoading}
              className="mt-2 md:mt-0 px-4 py-2 md:px-6 md:py-3 bg-white/20 text-white rounded-xl font-bold text-sm md:text-base hover:bg-white/30 disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              <FiRefreshCw className={resultsLoading ? 'animate-spin' : ''} />
              {resultsLoading ? 'Refreshing...' : 'Refresh Results'}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards - CHANGED to 4 cards, student-specific */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
      <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-gray-200">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IoFilterIcon className="text-purple-600" />
              <span className="text-base md:text-lg font-bold text-gray-900">Filter Results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiList size={12} />
                  List View
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiGrid size={12} />
                  Grid View
                </button>
              </div>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="p-1.5 text-gray-600 hover:text-gray-900"
              >
                <FiChevronDown className={`transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Select Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              >
                {uniqueTerms.map(term => (
                  <option key={term} value={term}>
                    {term === 'all' ? 'All Terms' : term}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              >
                {uniqueYears.map(year => (
                  <option key={year} value={year}>
                    {year === 'all' ? 'All Years' : year}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Quick Actions</label>
              <div className="flex gap-2">
                {(selectedTerm !== 'all' || selectedYear !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedTerm('all');
                      setSelectedYear('all');
                    }}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-bold text-sm hover:from-purple-100 hover:to-purple-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiFilter size={12} />
                  {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
                </button>
              </div>
            </div>
          </div>
          
          {showAdvancedFilters && (
            <div className="pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Minimum Grade</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm">
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
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm">
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

      {/* Main Content */}
      {resultsError ? (
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl md:rounded-2xl border-2 border-red-300 p-4 md:p-6 text-center">
          <FiAlertTriangle className="text-red-500 text-2xl md:text-3xl mx-auto mb-3" />
          <h3 className="text-base md:text-xl font-bold text-red-800 mb-2">Unable to load results</h3>
          <p className="text-red-600 text-sm mb-4">{resultsError}</p>
          <button
            onClick={onRefreshResults}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-bold text-sm hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white rounded-xl md:rounded-2xl border-2 border-gray-300 p-6 md:p-8 text-center">
          <FiAward className="text-gray-300 text-3xl md:text-4xl mx-auto mb-4" />
          <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2">No results found</h3>
          <p className="text-gray-600 text-sm">
            {selectedTerm !== 'all' || selectedYear !== 'all' 
              ? 'Try changing your filters' 
              : 'No academic results available yet'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Results Display - CHANGED header text to match second code */}
          <div>
            <div className="mb-3 md:mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Your Academic Results</h3>
                  <p className="text-gray-600 text-sm">
                    Showing {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for {student?.admissionNumber || 'you'} • Click to view detailed breakdown
                  </p>
                </div>
                <div className="text-xs font-semibold text-gray-500">
                  {selectedTerm !== 'all' && `${selectedTerm} • `}
                  {selectedYear !== 'all' && `${selectedYear}`}
                </div>
              </div>
            </div>

            {viewMode === 'list' ? (
              // List View
              <div className="bg-white rounded-xl md:rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
                      <div className="grid grid-cols-12 gap-2 px-3 md:px-6 py-3">
                        <div className="col-span-3 md:col-span-2 text-xs font-bold text-gray-700 uppercase">Admission</div>
                        <div className="col-span-3 md:col-span-2 text-xs font-bold text-gray-700 uppercase">Term & Year</div>
                        <div className="col-span-2 text-xs font-bold text-gray-700 uppercase">Form</div>
                        <div className="col-span-2 text-xs font-bold text-gray-700 uppercase text-center">Average</div>
                        <div className="col-span-1 text-xs font-bold text-gray-700 uppercase text-center">Grade</div>
                        <div className="col-span-1 text-xs font-bold text-gray-700 uppercase text-center">View</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {filteredResults.map((result, index) => {
                        const overallStatus = getGradeStatus(result.overallGrade);
                        const isStudentResult = result.admissionNumber === student?.admissionNumber;
                        
                        return (
                          <div 
                            key={index} 
                            className={`grid grid-cols-12 gap-2 px-3 md:px-6 py-3 hover:bg-gray-50 transition-colors ${isStudentResult ? 'bg-blue-50' : ''}`}
                          >
                            <div className="col-span-3 md:col-span-2">
                              <div className="font-bold text-gray-900 text-sm">{result.admissionNumber}</div>
                              {isStudentResult && (
                                <div className="text-blue-600 text-xs font-semibold">You</div>
                              )}
                            </div>
                            <div className="col-span-3 md:col-span-2">
                              <div className="font-bold text-gray-900 text-sm">{result.term}</div>
                              <div className="text-gray-600 text-xs">{result.academicYear}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="font-medium text-gray-900 text-sm">{result.form}</div>
                            </div>
                            <div className="col-span-2 text-center">
                              <div className="text-base font-bold text-gray-900">{result.averageScore.toFixed(1)}%</div>
                              <div className="text-gray-500 text-xs">Total: {result.totalScore}</div>
                            </div>
                            <div className="col-span-1 text-center">
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${overallStatus.badgeColor}`}>
                                {result.overallGrade || 'N/A'}
                              </span>
                            </div>
                            <div className="col-span-1 text-center">
                              <button
                                onClick={() => handleViewSubjects(result)}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:from-blue-100 hover:to-blue-200 transition-all flex items-center gap-1 justify-center mx-auto"
                              >
                                <FiEye size={10} />
                                <span className="hidden md:inline">View</span>
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
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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

          {/* School Documents Section */}
          <div>
            <div className="mb-3 md:mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                School Documents & Resources
              </h3>
              <p className="text-gray-600 text-sm">
                Access and download all your class exam results, term reports, and additional academic resources. Track your individual performance as well as your class ranking for this term, and stay informed about all relevant assessments and documents that contribute to your academic progress.
              </p>
            </div>

            {schoolLoading ? (
              <div className="text-center py-8">
                <CircularProgress size={24} className="text-purple-600" />
                <p className="text-gray-600 text-sm mt-2">Loading school documents...</p>
              </div>
            ) : schoolError ? (
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-2 border-red-300 p-4 text-center">
                <FiAlertTriangle className="text-red-500 text-xl mx-auto mb-2" />
                <p className="text-red-700 font-bold text-sm mb-1">Unable to load documents</p>
                <p className="text-red-600 text-xs">{schoolError}</p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {/* Exam Results */}
                {prioritizedExamResults.length > 0 && (
                  <div>
                    <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">
                      Class Exam Results
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                      {prioritizedExamResults.map((result, index) => (
                        <DocumentCard key={index} document={result} type="exam" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Documents / Resources */}
                {additionalResultsFiles.length > 0 && (
                  <div>
                    <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">
                      Additional Resources & School Updates
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base mb-3">
                      Explore these documents for important information that complements your studies. They may include curriculum updates, school announcements, guidelines, extra learning materials, and other key resources to keep you informed and up-to-date on everything happening this term.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                      {additionalResultsFiles.map((file, index) => (
                        <DocumentCard key={index} document={file} type="additional" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Subject Details Modal */}
      {selectedResult && (
        <SubjectDetailsModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
}