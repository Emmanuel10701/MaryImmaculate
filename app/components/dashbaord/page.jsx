'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  FiUsers, 
  FiBook, 
  FiCalendar,
  FiFileText,
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiDownload,
  FiMail,
  FiUserPlus,
  FiArrowUpRight,
  FiStar,
  FiUser,
  FiImage,
  FiMessageCircle,
  FiX,
  FiPlay,
  FiBarChart2,
  FiAward,
  FiTarget,
  FiActivity,
  FiRefreshCw,
  // Admission icons
  FiClipboard,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiThumbsUp,
  FiThumbsDown,
  FiPercent,
  FiDollarSign,
  FiZap,
  FiGlobe,
  FiMapPin,
  FiBookOpen,
  FiHeart,
  FiCpu,
  FiTrendingUp as FiTrendingUpSolid,
  FiTrendingDown as FiTrendingDownSolid,
  FiActivity as FiActivitySolid
} from 'react-icons/fi';
import { 
  IoPeopleCircle,
  IoNewspaper,
  IoSparkles,
  IoClose,
  IoStatsChart,
  IoAnalytics,
  IoSchool,
  IoDocumentText
} from 'react-icons/io5';
import { CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// Decode JWT token
const decodeToken = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// ========== ENGAGEMENT CALCULATION LOGIC ==========
const calculateStudentEngagement = (student, allResults) => {
  // Get results for this specific student
  const studentResults = allResults.filter(result => 
    result.admissionNumber === student.admissionNumber
  );
  
  if (studentResults.length === 0) {
    return {
      score: 0,
      level: 'No Data',
      reasons: ['No results data available'],
      trend: 'stable',
      resultsCount: 0,
      lastActivity: student.updatedAt || student.createdAt,
      subjects: []
    };
  }
  
  let engagementScore = 0;
  const reasons = [];
  const recentSubjects = new Set();
  
  // 1. Recency of results (max 30 points)
  const latestResult = studentResults.sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  )[0];
  
  const daysSinceLastResult = Math.floor(
    (new Date() - new Date(latestResult.updatedAt)) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceLastResult <= 7) {
    engagementScore += 30;
    reasons.push('Active in last week');
  } else if (daysSinceLastResult <= 30) {
    engagementScore += 20;
    reasons.push('Active in last month');
  } else if (daysSinceLastResult <= 90) {
    engagementScore += 10;
    reasons.push('Active in last quarter');
  }
  
  // 2. Frequency of results (max 30 points)
  const resultsLast90Days = studentResults.filter(result => {
    const resultDate = new Date(result.updatedAt);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return resultDate >= ninetyDaysAgo;
  }).length;
  
  if (resultsLast90Days >= 3) {
    engagementScore += 30;
    reasons.push(`Consistent performance (${resultsLast90Days} results in 90 days)`);
  } else if (resultsLast90Days >= 2) {
    engagementScore += 20;
    reasons.push(`Regular activity (${resultsLast90Days} results in 90 days)`);
  } else if (resultsLast90Days >= 1) {
    engagementScore += 10;
    reasons.push(`Some activity (${resultsLast90Days} result in 90 days)`);
  }
  
  // 3. Academic performance (max 40 points)
  let totalAvgScore = 0;
  let totalResultsWithScores = 0;
  let subjectScores = {};
  
  studentResults.forEach(result => {
    try {
      let subjects = [];
      if (typeof result.subjects === 'string') {
        subjects = JSON.parse(result.subjects);
      } else if (Array.isArray(result.subjects)) {
        subjects = result.subjects;
      }
      
      subjects.forEach(subject => {
        const score = subject.score || 0;
        if (score > 0) {
          recentSubjects.add(subject.subject);
          
          if (!subjectScores[subject.subject]) {
            subjectScores[subject.subject] = { total: 0, count: 0 };
          }
          subjectScores[subject.subject].total += score;
          subjectScores[subject.subject].count++;
        }
      });
      
      if (subjects.length > 0) {
        const resultAvg = subjects.reduce((sum, s) => sum + (s.score || 0), 0) / subjects.length;
        totalAvgScore += resultAvg;
        totalResultsWithScores++;
      }
    } catch (error) {
      console.error('Error parsing subjects:', error);
    }
  });
  
  if (totalResultsWithScores > 0) {
    const overallAvg = totalAvgScore / totalResultsWithScores;
    
    if (overallAvg >= 80) {
      engagementScore += 40;
      reasons.push(`Excellent performance (${overallAvg.toFixed(1)}% avg)`);
    } else if (overallAvg >= 70) {
      engagementScore += 30;
      reasons.push(`Good performance (${overallAvg.toFixed(1)}% avg)`);
    } else if (overallAvg >= 60) {
      engagementScore += 20;
      reasons.push(`Average performance (${overallAvg.toFixed(1)}% avg)`);
    } else if (overallAvg >= 50) {
      engagementScore += 10;
      reasons.push(`Passing performance (${overallAvg.toFixed(1)}% avg)`);
    }
  }
  
  // Calculate subject performance metrics
  const subjectPerformance = Object.keys(subjectScores).map(subjectName => ({
    subject: subjectName,
    average: subjectScores[subjectName].total / subjectScores[subjectName].count,
    count: subjectScores[subjectName].count
  }));
  
  // Determine engagement level
  let engagementLevel = 'Low';
  if (engagementScore >= 80) engagementLevel = 'Excellent';
  else if (engagementScore >= 70) engagementLevel = 'High';
  else if (engagementScore >= 50) engagementLevel = 'Medium';
  else if (engagementScore >= 30) engagementLevel = 'Fair';
  
  // Calculate trend (simplified - compare last two results)
  let trend = 'stable';
  if (studentResults.length >= 2) {
    const sortedResults = [...studentResults].sort((a, b) => 
      new Date(a.updatedAt) - new Date(b.updatedAt)
    );
    const secondLastResult = sortedResults[sortedResults.length - 2];
    
    try {
      let currentSubjects = [];
      let previousSubjects = [];
      
      if (typeof latestResult.subjects === 'string') {
        currentSubjects = JSON.parse(latestResult.subjects);
      } else if (Array.isArray(latestResult.subjects)) {
        currentSubjects = latestResult.subjects;
      }
      
      if (typeof secondLastResult.subjects === 'string') {
        previousSubjects = JSON.parse(secondLastResult.subjects);
      } else if (Array.isArray(secondLastResult.subjects)) {
        previousSubjects = secondLastResult.subjects;
      }
      
      const currentAvg = currentSubjects.length > 0 
        ? currentSubjects.reduce((sum, s) => sum + (s.score || 0), 0) / currentSubjects.length 
        : 0;
      
      const previousAvg = previousSubjects.length > 0 
        ? previousSubjects.reduce((sum, s) => sum + (s.score || 0), 0) / previousSubjects.length 
        : 0;
      
      if (currentAvg > previousAvg) trend = 'up';
      else if (currentAvg < previousAvg) trend = 'down';
    } catch (error) {
      console.error('Error calculating trend:', error);
    }
  }
  
  return {
    score: Math.min(Math.round(engagementScore), 100),
    level: engagementLevel,
    reasons: reasons.slice(0, 3), // Top 3 reasons
    trend,
    resultsCount: studentResults.length,
    lastActivity: latestResult.updatedAt,
    subjectPerformance,
    recentSubjects: Array.from(recentSubjects).slice(0, 5)
  };
};

// Calculate overall engagement statistics
const calculateEngagementStats = (students, allResults) => {
  if (!students || students.length === 0 || !allResults) {
    return {
      totalStudents: 0,
      engagedStudents: 0,
      averageEngagement: 0,
      engagementRate: 0,
      distribution: { excellent: 0, high: 0, medium: 0, fair: 0, low: 0 },
      topPerformingSubjects: [],
      recentActivityCount: 0
    };
  }
  
  // Calculate engagement for each student
  const engagements = students.map(student => 
    calculateStudentEngagement(student, allResults)
  );
  
  // Count engaged students (score >= 50)
  const engagedStudents = engagements.filter(e => e.score >= 50).length;
  const excellentEngagement = engagements.filter(e => e.level === 'Excellent').length;
  const highEngagement = engagements.filter(e => e.level === 'High').length;
  const mediumEngagement = engagements.filter(e => e.level === 'Medium').length;
  const fairEngagement = engagements.filter(e => e.level === 'Fair').length;
  const lowEngagement = engagements.filter(e => e.level === 'Low').length;
  
  // Calculate average engagement
  const averageEngagement = engagements.reduce((sum, e) => sum + e.score, 0) / engagements.length;
  
  // Count recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentActivityCount = allResults.filter(result => 
    new Date(result.updatedAt) >= sevenDaysAgo
  ).length;
  
  // Find top performing subjects across all students
  const subjectPerformanceMap = {};
  allResults.forEach(result => {
    try {
      let subjects = [];
      if (typeof result.subjects === 'string') {
        subjects = JSON.parse(result.subjects);
      } else if (Array.isArray(result.subjects)) {
        subjects = result.subjects;
      }
      
      subjects.forEach(subject => {
        const score = subject.score || 0;
        if (score > 0) {
          if (!subjectPerformanceMap[subject.subject]) {
            subjectPerformanceMap[subject.subject] = { total: 0, count: 0 };
          }
          subjectPerformanceMap[subject.subject].total += score;
          subjectPerformanceMap[subject.subject].count++;
        }
      });
    } catch (error) {
      console.error('Error processing subject performance:', error);
    }
  });
  
  const topPerformingSubjects = Object.keys(subjectPerformanceMap)
    .map(subject => ({
      subject,
      average: subjectPerformanceMap[subject].total / subjectPerformanceMap[subject].count,
      count: subjectPerformanceMap[subject].count
    }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);
  
  return {
    totalStudents: students.length,
    engagedStudents,
    averageEngagement: Math.round(averageEngagement),
    engagementRate: Math.round((engagedStudents / students.length) * 100),
    distribution: {
      excellent: excellentEngagement,
      high: highEngagement,
      medium: mediumEngagement,
      fair: fairEngagement,
      low: lowEngagement
    },
    topPerformingSubjects,
    recentActivityCount,
    totalResults: allResults.length
  };
};

const listenForRecentActivity = async () => {
  try {
    console.log('📊 Fetching recent activity data...');
    
    // Poll for recent activity from all APIs with better error handling
    const [studentsRes, resultsRes, uploadsRes, guidanceRes] = await Promise.allSettled([
      fetch('/api/studentupload?limit=5&sortBy=updatedAt&sortOrder=desc', {
        headers: { 'Cache-Control': 'no-cache' }
      }),
      fetch('/api/results?limit=5&sortBy=updatedAt&sortOrder=desc', {
        headers: { 'Cache-Control': 'no-cache' }
      }),
      fetch('/api/studentupload?action=uploads&limit=3', {
        headers: { 'Cache-Control': 'no-cache' }
      }),
      fetch('/api/guidance?limit=3&sortBy=createdAt&sortOrder=desc', {
        headers: { 'Cache-Control': 'no-cache' }
      })
    ]);

    const activities = [];
    const now = new Date();

    // Helper function to validate and format date
    const formatActivityDate = (dateString) => {
      if (!dateString) return 'Unknown date';
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        
        // Show "Today", "Yesterday", or date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        date.setHours(0, 0, 0, 0);
        
        if (date.getTime() === today.getTime()) {
          return 'Today';
        } else if (date.getTime() === yesterday.getTime()) {
          return 'Yesterday';
        } else {
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
      } catch (e) {
        return 'Unknown date';
      }
    };

    // Helper function to get relative time
    const getRelativeTime = (dateString) => {
      if (!dateString) return 'Recently';
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Recently';
        
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      } catch (e) {
        return 'Recently';
      }
    };

    // Process recent students with improved validation
    if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
      try {
        const studentsData = await studentsRes.value.json();
        console.log('📋 Students API response:', studentsData);
        
        const students = studentsData.data?.students || studentsData.students || [];
        
        students.slice(0, 2).forEach(student => {
          if (!student?.id) return;
          
          const isNew = student.createdAt && student.updatedAt && 
                       new Date(student.createdAt).getTime() === new Date(student.updatedAt).getTime();
          
          const studentName = student.firstName || student.lastName ? 
            `${student.firstName || ''} ${student.lastName || ''}`.trim() : 
            `Student #${student.admissionNumber || student.id}`;
          
          const form = student.form || student.Form || 'Unknown Form';
          
          activities.push({
            id: `student-${student.id}-${Date.now()}`,
            action: isNew ? 'New student registered' : 'Student profile updated',
            target: `${studentName} - ${form}`,
            time: getRelativeTime(student.updatedAt || student.createdAt),
            formattedDate: formatActivityDate(student.updatedAt || student.createdAt),
            type: 'student',
            icon: isNew ? FiUserPlus : FiUser,
            color: isNew ? 'emerald' : 'blue',
            timestamp: new Date(student.updatedAt || student.createdAt || now),
            admissionNumber: student.admissionNumber,
            details: {
              name: studentName,
              form: form,
              isNew: isNew
            }
          });
        });
      } catch (error) {
        console.error('❌ Error processing students data:', error);
      }
    } else {
      console.warn('⚠️ Students API request failed:', studentsRes.reason);
    }

    // Process recent results with improved validation
    if (resultsRes.status === 'fulfilled' && resultsRes.value.ok) {
      try {
        const resultsData = await resultsRes.value.json();
        console.log('📊 Results API response:', resultsData);
        
        const results = resultsData.data?.results || resultsData.results || [];
        
        results.slice(0, 2).forEach(result => {
          if (!result?.id) return;
          
          const hasSubjects = result.subjects && 
            (Array.isArray(result.subjects) || 
             (typeof result.subjects === 'string' && result.subjects.length > 0));
          
          const subjectCount = hasSubjects ? 
            (Array.isArray(result.subjects) ? result.subjects.length : 
             JSON.parse(result.subjects).length) : 0;
          
          const term = result.term || result.Term || 'Unknown Term';
          const form = result.form || result.Form || 'Unknown Form';
          
          activities.push({
            id: `result-${result.id}-${Date.now()}`,
            action: 'Academic results updated',
            target: `${result.admissionNumber} - ${form} ${term}`,
            time: getRelativeTime(result.updatedAt || result.createdAt),
            formattedDate: formatActivityDate(result.updatedAt || result.createdAt),
            type: 'result',
            icon: FiAward,
            color: 'purple',
            timestamp: new Date(result.updatedAt || result.createdAt || now),
            admissionNumber: result.admissionNumber,
            details: {
              term: term,
              form: form,
              subjectCount: subjectCount,
              academicYear: result.academicYear || result.year || 'N/A'
            }
          });
        });
      } catch (error) {
        console.error('❌ Error processing results data:', error);
      }
    } else {
      console.warn('⚠️ Results API request failed:', resultsRes.reason);
    }

    // Process recent uploads with improved validation
    if (uploadsRes.status === 'fulfilled' && uploadsRes.value.ok) {
      try {
        const uploadsData = await uploadsRes.value.json();
        console.log('📤 Uploads API response:', uploadsData);
        
        const uploads = uploadsData.uploads || uploadsData.data?.uploads || [];
        
        uploads.slice(0, 2).forEach(upload => {
          if (!upload?.id) return;
          
          const uploadDate = upload.processedDate || upload.uploadDate || upload.createdAt;
          const fileName = upload.fileName || upload.originalName || 'Unknown file';
          const fileExt = fileName.split('.').pop().toUpperCase();
          
          const statusColors = {
            'completed': 'green',
            'processing': 'blue',
            'failed': 'red',
            'pending': 'yellow',
            'partial': 'orange'
          };
          
          activities.push({
            id: `upload-${upload.id}-${Date.now()}`,
            action: 'Bulk upload processed',
            target: `${fileName} (${fileExt})`,
            time: getRelativeTime(uploadDate),
            formattedDate: formatActivityDate(uploadDate),
            type: 'upload',
            icon: FiDownload,
            color: statusColors[upload.status?.toLowerCase()] || 'gray',
            timestamp: new Date(uploadDate || now),
            details: {
              fileName: fileName,
              fileType: fileExt,
              status: upload.status || 'unknown',
              rows: upload.totalRows || upload.validRows || 0,
              type: upload.uploadType || upload.type || 'unknown'
            }
          });
        });
      } catch (error) {
        console.error('❌ Error processing uploads data:', error);
      }
    } else {
      console.warn('⚠️ Uploads API request failed:', uploadsRes.reason);
    }

    // Process recent guidance sessions with improved validation
    if (guidanceRes.status === 'fulfilled' && guidanceRes.value.ok) {
      try {
        const guidanceData = await guidanceRes.value.json();
        console.log('💬 Guidance API response:', guidanceData);
        
        const sessions = guidanceData.events || guidanceData.sessions || guidanceData.data?.events || [];
        
        sessions.slice(0, 2).forEach(session => {
          if (!session?.id) return;
          
          const counselor = session.counselor || session.teacher || session.staffName || 'Counselor';
          const category = session.category || session.type || session.reason || 'Session';
          const studentName = session.studentName || 
            (session.student ? `${session.student.firstName || ''} ${session.student.lastName || ''}`.trim() : '');
          
          const displayTarget = studentName ? 
            `${counselor} with ${studentName}` : 
            `${counselor} - ${category}`;
          
          activities.push({
            id: `guidance-${session.id}-${Date.now()}`,
            action: 'Guidance session conducted',
            target: displayTarget,
            time: getRelativeTime(session.date || session.createdAt),
            formattedDate: formatActivityDate(session.date || session.createdAt),
            type: 'guidance',
            icon: FiMessageCircle,
            color: 'teal',
            timestamp: new Date(session.date || session.createdAt || now),
            details: {
              counselor: counselor,
              category: category,
              studentName: studentName,
              duration: session.duration || session.length || 'N/A',
              status: session.status || 'completed'
            }
          });
        });
      } catch (error) {
        console.error('❌ Error processing guidance data:', error);
      }
    } else {
      console.warn('⚠️ Guidance API request failed:', guidanceRes.reason);
    }

    // Sort by timestamp (most recent first) and remove duplicates
    const uniqueActivities = Array.from(
      new Map(activities.map(activity => [activity.id, activity])).values()
    );

    const sortedActivities = uniqueActivities
      .filter(activity => activity.timestamp && !isNaN(activity.timestamp.getTime()))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);

    console.log(`✅ Loaded ${sortedActivities.length} recent activities`);
    
    // Add activity summary for debugging
    if (sortedActivities.length > 0) {
      console.table(sortedActivities.map(act => ({
        Type: act.type,
        Action: act.action,
        Time: act.time,
        Target: act.target
      })));
    }

    return sortedActivities;

  } catch (error) {
    console.error('🚨 Critical error in listenForRecentActivity:', error);
    
    // Return fallback activities if everything fails
    return [{
      id: 'fallback-activity',
      action: 'System online',
      target: 'Dashboard is monitoring activities',
      time: 'Just now',
      formattedDate: 'Today',
      type: 'system',
      icon: FiActivity,
      color: 'blue',
      timestamp: new Date(),
      details: {
        note: 'Activities will appear here as they occur'
      }
    }];
  }
};

// ========== HELPER FUNCTIONS ==========
const calculateMonthOverMonthGrowth = (currentCount, previousCount) => {
  if (!previousCount || previousCount === 0) {
    return currentCount > 0 ? 100 : 0;
  }
  return ((currentCount - previousCount) / previousCount) * 100;
};

const countRecordsByMonth = (dataArray, monthOffset = 0) => {
  const now = new Date();
  const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
  const nextMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1);
  
  return dataArray.filter(item => {
    if (!item.createdAt) return false;
    const itemDate = new Date(item.createdAt);
    return itemDate >= targetMonth && itemDate < nextMonth;
  }).length;
};

// ========== DASHBOARD COMPONENT ==========
function ModernLoadingSpinner({ message = "Loading sessions from the database…", size = "medium" }) {
  const sizes = {
    small: { outer: 48, inner: 24 },
    medium: { outer: 64, inner: 32 },
    large: { outer: 80, inner: 40 }
  }

  const { outer, inner } = sizes[size] || sizes.medium;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Main spinner */}
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={5}
              className="text-indigo-600"
            />
            {/* Pulsing inner circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full animate-ping opacity-25"
                   style={{ width: inner, height: inner }}></div>
            </div>
          </div>
          {/* Outer glow effect */}
          <div className="absolute -inset-6 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-full blur-xl opacity-30 animate-pulse"></div>
        </div>
        
        {/* Text content */}
        <div className="mt-6 space-y-3">
          <span className="block text-lg font-semibold text-gray-800">
            {message}
          </span>
          
          {/* Bouncing dots */}
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
          
          {/* Optional subtitle */}
          <p className="text-gray-500 text-sm mt-2">
            Please wait while we fetch school public data
          </p>
        </div>
      </div>
    </div>
  );
}

// Add this helper function to decode JWT tokens
const decodeJWTToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// ========== MAIN DASHBOARD COMPONENT ==========
export default function DashboardOverview() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalSubscribers: 0,
    pendingEmails: 0,
    activeAssignments: 0,
    upcomingEvents: 0,
    galleryItems: 0,
    guidanceSessions: 0,
    totalNews: 0,
    
    // Admission stats
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    underReviewApplications: 0,
    interviewedApplications: 0,
    waitlistedApplications: 0,
    conditionalApplications: 0,
    withdrawnApplications: 0,
    monthlyApplications: 0,
    dailyApplications: 0,
    applicationConversionRate: 0,
    averageProcessingTime: 0,
    
    // Admission analytics
    scienceApplications: 0,
    artsApplications: 0,
    businessApplications: 0,
    technicalApplications: 0,
    maleApplications: 0,
    femaleApplications: 0,
    topCountyApplications: '',
    averageKCPEScore: 0,
    averageAge: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [quickStats, setQuickStats] = useState([]);
  const [admissionStats, setAdmissionStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [growthMetrics, setGrowthMetrics] = useState({});
  const [admissionGrowth, setAdmissionGrowth] = useState({});
  const [showQuickTour, setShowQuickTour] = useState(false);
  const [schoolVideo, setSchoolVideo] = useState(null);
  
  // New state for dynamic data
  const [staffDistribution, setStaffDistribution] = useState([]);
  const [assignmentsDistribution, setAssignmentsDistribution] = useState([]);
  const [resourcesDistribution, setResourcesDistribution] = useState([]);
  const [careers, setCareers] = useState([]);
  const [emailCampaigns, setEmailCampaigns] = useState([]);
  
  // NEW: Engagement and performance state
  const [engagementStats, setEngagementStats] = useState({
    totalStudents: 0,
    engagedStudents: 0,
    averageEngagement: 0,
    engagementRate: 0,
    distribution: { excellent: 0, high: 0, medium: 0, fair: 0, low: 0 },
    topPerformingSubjects: [],
    recentActivityCount: 0,
    totalResults: 0
  });
  
  const [studentEngagements, setStudentEngagements] = useState([]);
  
  // NEW: Student Population & Distribution state
  const [studentPopulation, setStudentPopulation] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byForm: { 'Form 1': 0, 'Form 2': 0, 'Form 3': 0, 'Form 4': 0 },
    byGender: { male: 0, female: 0, other: 0 },
    byStream: {},
    byStatus: { active: 0, inactive: 0 }
  });
  
  // Calculate percentages for charts
  const calculatePercentages = (data, key) => {
    const counts = {};
    data.forEach(item => {
      const value = item[key] || 'Unknown';
      counts[value] = (counts[value] || 0) + 1;
    });
    
    const total = data.length;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100)
    }));
  };
  
  // Authentication check
  const checkAuthentication = useCallback(() => {
    console.log('🔍 Checking localStorage for user data...');
    
    const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
    const possibleTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token', 'access_token'];
    
    let userData = null;
    let token = null;
    let extractedUserFromToken = null;
    
    // Find token first
    for (const key of possibleTokenKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        token = data;
        extractedUserFromToken = decodeJWTToken(data);
        if (extractedUserFromToken) break;
      }
    }
    
    // Find user data
    for (const key of possibleUserKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        userData = data;
        break;
      }
    }
    
    // Priority: Use user from token if available
    let user = extractedUserFromToken;
    
    if (!user && userData) {
      try {
        user = JSON.parse(userData);
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
      }
    }
    
    if (!user) {
      console.log('❌ No user data found');
      window.location.href = '/pages/adminLogin';
      return null;
    }
    
    // Verify token is still valid
    if (token) {
      try {
        const tokenPayload = decodeJWTToken(token);
        if (!tokenPayload) {
          window.location.href = '/pages/adminLogin';
          return null;
        }
        
        const currentTime = Date.now() / 1000;
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          possibleUserKeys.forEach(key => localStorage.removeItem(key));
          possibleTokenKeys.forEach(key => localStorage.removeItem(key));
          window.location.href = '/pages/adminLogin';
          return null;
        }
        
        // Update user data with token information
        if (tokenPayload) {
          user = {
            ...user,
            ...tokenPayload,
            id: tokenPayload.id || tokenPayload.userId || tokenPayload.sub || user.id,
            email: tokenPayload.email || user.email,
            name: tokenPayload.name || tokenPayload.fullName || user.name,
            role: tokenPayload.role || tokenPayload.scope || user.role
          };
        }
      } catch (tokenError) {
        console.log('⚠️ Token validation skipped:', tokenError.message);
      }
    }
    
    // Check if user has valid role
    const userRole = user.role;
    const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL', 'STAFF'];
    
    if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
      window.location.href = '/pages/adminLogin';
      return null;
    }
    
    return user;
  }, []);
  
// Fetch all data including engagement calculations - FIXED VERSION
const fetchAllData = useCallback(async () => {
  try {
    setLoading(true);
    
    // First check authentication
    const authenticatedUser = checkAuthentication();
    if (!authenticatedUser) return;
    
    setUser(authenticatedUser);
    
    // Fetch data from all endpoints - USING CORRECT API ENDPOINTS
    const [
      studentsRes,
      staffRes,
      subscribersRes,
      assignmentsRes,
      eventsRes,
      galleryRes,
      guidanceRes,
      newsRes,
      schoolInfoRes,
      adminsRes,
      admissionsRes,
      resourcesRes,
      careersRes,
      emailCampaignsRes,
      resultsRes // Results data for engagement calculation
    ] = await Promise.allSettled([
      fetch('/api/studentupload?includeStats=true&limit=1000'), // Get all students with stats
      fetch('/api/staff'),
      fetch('/api/subscriber'),
      fetch('/api/assignment'),
      fetch('/api/events'),
      fetch('/api/gallery'),
      fetch('/api/guidance'),
      fetch('/api/news'),
      fetch('/api/school'),
      fetch('/api/register'),
      fetch('/api/applyadmission'),
      fetch('/api/resources'),
      fetch('/api/career'),
      fetch('/api/emails'),
      fetch('/api/results?limit=1000&includeStudent=true') // Get all results with student data
    ]);
    
    // Process responses with better error handling
    const studentsData = studentsRes.status === 'fulfilled' 
      ? await studentsRes.value.json() 
      : { success: false, data: { students: [] } };
    
    const resultsData = resultsRes.status === 'fulfilled' 
      ? await resultsRes.value.json() 
      : { success: false, data: { results: [] } };
    
    const staff = staffRes.status === 'fulfilled' ? await staffRes.value.json() : { staff: [] };
    const subscribers = subscribersRes.status === 'fulfilled' ? await subscribersRes.value.json() : { subscribers: [] };
    const assignments = assignmentsRes.status === 'fulfilled' ? await assignmentsRes.value.json() : { assignments: [] };
    const events = eventsRes.status === 'fulfilled' ? await eventsRes.value.json() : { events: [] };
    const gallery = galleryRes.status === 'fulfilled' ? await galleryRes.value.json() : { galleries: [] };
    const guidance = guidanceRes.status === 'fulfilled' ? await guidanceRes.value.json() : { events: [] };
    const news = newsRes.status === 'fulfilled' ? await newsRes.value.json() : { news: [] };
    const schoolInfo = schoolInfoRes.status === 'fulfilled' ? await schoolInfoRes.value.json() : { school: {} };
    const admins = adminsRes.status === 'fulfilled' ? await adminsRes.value.json() : { users: [] };
    const admissions = admissionsRes.status === 'fulfilled' ? await admissionsRes.value.json() : { applications: [] };
    const resources = resourcesRes.status === 'fulfilled' ? await resourcesRes.value.json() : { resources: [] };
    const careersData = careersRes.status === 'fulfilled' ? await careersRes.value.json() : { jobs: [] };
    const emailCampaignsData = emailCampaignsRes.status === 'fulfilled' ? await emailCampaignsRes.value.json() : { campaigns: [] };
    
    // Store school video for quick tour
    if (schoolInfo.school?.videoTour) {
      setSchoolVideo({
        url: schoolInfo.school.videoTour,
        type: schoolInfo.school.videoType
      });
    }
    
    // Extract student and result data properly
    const studentList = studentsData.success ? 
      (studentsData.data?.students || studentsData.students || []) : [];
    
    const allResults = resultsData.success ?
      (resultsData.data?.results || resultsData.results || []) : [];
    
    console.log('Student data loaded:', studentList.length, 'students');
    console.log('Results data loaded:', allResults.length, 'results');
    
    // Calculate student population and distribution
    if (studentList.length > 0) {
      const formDistribution = { 'Form 1': 0, 'Form 2': 0, 'Form 3': 0, 'Form 4': 0 };
      const genderDistribution = { male: 0, female: 0, other: 0 };
      const streamDistribution = {};
      const statusDistribution = { active: 0, inactive: 0 };
      
      studentList.forEach(student => {
        // Form distribution
        const form = student.form || student.Form || '';
        if (formDistribution[form] !== undefined) {
          formDistribution[form]++;
        } else if (form) {
          formDistribution[form] = (formDistribution[form] || 0) + 1;
        }
        
        // Gender distribution
        const gender = student.gender?.toLowerCase() || student.Gender?.toLowerCase() || 'other';
        if (gender === 'male' || gender === 'm') genderDistribution.male++;
        else if (gender === 'female' || gender === 'f') genderDistribution.female++;
        else genderDistribution.other++;
        
        // Stream distribution
        const stream = student.stream || student.Stream || '';
        if (stream) {
          streamDistribution[stream] = (streamDistribution[stream] || 0) + 1;
        }
        
        // Status distribution
        const status = student.status?.toLowerCase() || student.Status?.toLowerCase() || 'active';
        if (status === 'active' || status === 'active') statusDistribution.active++;
        else statusDistribution.inactive++;
      });
      
      setStudentPopulation({
        total: studentList.length,
        active: statusDistribution.active,
        inactive: statusDistribution.inactive,
        byForm: formDistribution,
        byGender: genderDistribution,
        byStream: streamDistribution,
        byStatus: statusDistribution
      });
    }
    
    // Calculate staff distribution
    if (staff.staff && staff.staff.length > 0) {
      const staffDist = calculatePercentages(staff.staff, 'department');
      setStaffDistribution(staffDist);
    }
    
    // Calculate assignments distribution
    if (assignments.assignments && assignments.assignments.length > 0) {
      const assignDist = calculatePercentages(assignments.assignments, 'status');
      setAssignmentsDistribution(assignDist);
    }
    
    // Calculate resources distribution
    if (resources.resources && resources.resources.length > 0) {
      const resourcesDist = calculatePercentages(resources.resources, 'category');
      setResourcesDistribution(resourcesDist);
    }
    
    // Set careers data
    if (careersData.jobs && careersData.jobs.length > 0) {
      setCareers(careersData.jobs.slice(0, 3));
    }
    
    // Set email campaigns
    if (emailCampaignsData.campaigns && emailCampaignsData.campaigns.length > 0) {
      setEmailCampaigns(emailCampaignsData.campaigns.slice(0, 2));
    }
    
    // Calculate statistics
    const activeStudents = studentList.filter(s => 
      (s.status || s.Status || '').toLowerCase() === 'active'
    ).length || 0;
    
    const inactiveStudents = studentList.length - activeStudents;
    const activeAssignments = assignments.assignments?.filter(a => 
      (a.status || '').toLowerCase() === 'assigned'
    ).length || 0;
    
    const upcomingEvents = events.events?.filter(e => {
      if (!e.date) return false;
      return new Date(e.date) > new Date();
    }).length || 0;
    
    const guidanceSessionsCount = guidance.events?.length || 0;
    const completedAssignments = assignments.assignments?.filter(a => 
      (a.status || '').toLowerCase() === 'completed'
    ).length || 0;
    
    const totalAssignments = assignments.assignments?.length || 1;
    
    // Calculate admission statistics
    const applications = admissions.applications || [];
    const today = new Date();
    
    const monthlyApplications = applications.filter(app => {
      if (!app.createdAt) return false;
      const appDate = new Date(app.createdAt);
      return appDate.getMonth() === today.getMonth() && 
             appDate.getFullYear() === today.getFullYear();
    }).length;
    
    const dailyApplications = applications.filter(app => {
      if (!app.createdAt) return false;
      const appDate = new Date(app.createdAt);
      return appDate.toDateString() === today.toDateString();
    }).length;
    
    const pendingApps = applications.filter(app => 
      (app.status || '').toUpperCase() === 'PENDING'
    ).length;
    
    const acceptedApps = applications.filter(app => 
      (app.status || '').toUpperCase() === 'ACCEPTED'
    ).length;
    
    const rejectedApps = applications.filter(app => 
      (app.status || '').toUpperCase() === 'REJECTED'
    ).length;
    
    // Calculate conversion rate
    const conversionRate = applications.length > 0 ? 
      Math.round((acceptedApps / applications.length) * 100) : 0;
    
    // ========== ENGAGEMENT CALCULATIONS ==========
    // Calculate engagement for each student
    const engagements = studentList.map(student => ({
      ...student,
      engagement: calculateStudentEngagement(student, allResults)
    }));
    
    // Calculate overall engagement statistics
    const calculatedEngagementStats = calculateEngagementStats(studentList, allResults);
    setEngagementStats(calculatedEngagementStats);
    setStudentEngagements(engagements.slice(0, 10));
    
    // Update stats with engagement data
    const updatedStats = {
      totalStudents: studentList.length || 0,
      activeStudents,
      inactiveStudents,
      totalStaff: staff.staff?.length || 0,
      totalSubscribers: subscribers.subscribers?.length || 0,
      pendingEmails: 0,
      activeAssignments,
      upcomingEvents,
      galleryItems: gallery.galleries?.length || 0,
      guidanceSessions: guidanceSessionsCount,
      totalNews: news.news?.length || 0,
      completedAssignments,
      totalAssignments,
      
      // Admission Applications
      totalApplications: applications.length,
      pendingApplications: pendingApps,
      acceptedApplications: acceptedApps,
      rejectedApplications: rejectedApps,
      underReviewApplications: applications.filter(app => 
        (app.status || '').toUpperCase() === 'UNDER_REVIEW'
      ).length,
      interviewedApplications: applications.filter(app => 
        (app.status || '').toUpperCase() === 'INTERVIEWED'
      ).length,
      waitlistedApplications: applications.filter(app => 
        (app.status || '').toUpperCase() === 'WAITLISTED'
      ).length,
      conditionalApplications: applications.filter(app => 
        (app.status || '').toUpperCase() === 'CONDITIONAL_ACCEPTANCE'
      ).length,
      withdrawnApplications: applications.filter(app => 
        (app.status || '').toUpperCase() === 'WITHDRAWN'
      ).length,
      monthlyApplications,
      dailyApplications,
      applicationConversionRate: conversionRate,
      averageProcessingTime: 0, // You might want to calculate this
      
      // Admission Analytics
      scienceApplications: applications.filter(app => 
        (app.preferredStream || '').toUpperCase() === 'SCIENCE'
      ).length,
      artsApplications: applications.filter(app => 
        (app.preferredStream || '').toUpperCase() === 'ARTS'
      ).length,
      businessApplications: applications.filter(app => 
        (app.preferredStream || '').toUpperCase() === 'BUSINESS'
      ).length,
      technicalApplications: applications.filter(app => 
        (app.preferredStream || '').toUpperCase() === 'TECHNICAL'
      ).length,
      maleApplications: applications.filter(app => 
        (app.gender || '').toUpperCase() === 'MALE'
      ).length,
      femaleApplications: applications.filter(app => 
        (app.gender || '').toUpperCase() === 'FEMALE'
      ).length,
      topCountyApplications: 'N/A', // You can calculate this
      averageKCPEScore: 0,
      averageAge: 0
    };
    
    setStats(updatedStats);
    
    // ========== RECENT ACTIVITY ==========
    const recentActivities = await listenForRecentActivity();
    setRecentActivity(recentActivities);
    
    // ========== PERFORMANCE METRICS ==========
    const studentGrowth = calculateMonthOverMonthGrowth(
      updatedStats.totalStudents,
      0 // You should track previous month's data
    );
    
    const assignmentGrowth = calculateMonthOverMonthGrowth(
      updatedStats.completedAssignments,
      0
    );
    
    const performanceMetrics = [
      { 
        label: 'Student Engagement', 
        value: calculatedEngagementStats.engagementRate,
        change: studentGrowth,
        color: studentGrowth >= 0 ? 'green' : 'red',
        description: 'Active and performing students'
      },
      { 
        label: 'Academic Excellence', 
        value: Math.round((completedAssignments / totalAssignments) * 100) || 0,
        change: assignmentGrowth,
        color: assignmentGrowth >= 0 ? 'blue' : 'red',
        description: 'Assignment completion rate'
      },
      { 
        label: 'Admission Conversion', 
        value: conversionRate,
        change: 0,
        color: conversionRate > 50 ? 'purple' : 'red',
        description: 'Applications to acceptances'
      },
      { 
        label: 'Guidance Sessions', 
        value: Math.round((guidanceSessionsCount / (studentList.length || 1)) * 100) || 0,
        change: 0,
        color: 'indigo',
        description: 'Student support engagement'
      },
      { 
        label: 'Recent Activity', 
        value: Math.min(100, (calculatedEngagementStats.recentActivityCount / 10) * 100),
        change: 0,
        color: 'orange',
        description: 'Recent submissions and updates'
      }
    ];
    
    setPerformanceData(performanceMetrics);
    
    // ========== QUICK STATS ==========
    const quickStatsData = [
      { 
        label: 'Academic Excellence', 
        value: `${Math.round((completedAssignments / totalAssignments) * 100) || 0}%`, 
        change: parseFloat(assignmentGrowth.toFixed(1)), 
        icon: assignmentGrowth >= 0 ? FiTrendingUp : FiTrendingDown, 
        color: assignmentGrowth >= 0 ? 'green' : 'red',
        calculation: 'Based on assignment completion'
      },
      { 
        label: 'Student Engagement', 
        value: `${calculatedEngagementStats.engagementRate}%`, 
        change: parseFloat(studentGrowth.toFixed(1)), 
        icon: studentGrowth >= 0 ? FiActivity : FiTrendingDown, 
        color: studentGrowth >= 0 ? 'blue' : 'red',
        calculation: 'Active and performing students'
      },
      { 
        label: 'Admission Growth', 
        value: `${monthlyApplications}`, 
        change: 0, 
        icon: monthlyApplications > 0 ? FiTrendingUp : FiTrendingDown, 
        color: monthlyApplications > 0 ? 'purple' : 'red',
        calculation: 'Monthly applications'
      }
    ];
    
    setQuickStats(quickStatsData);
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    sooner.error('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
}, [checkAuthentication]);
  
  // Initialize dashboard
  useEffect(() => {
    fetchAllData();
    
    // Set up polling for recent activity (every 60 seconds)
    const intervalId = setInterval(async () => {
      if (!refreshing) {
        const newActivities = await listenForRecentActivity();
        if (newActivities.length > 0) {
          setRecentActivity(prev => {
            const merged = [...newActivities, ...prev];
            const unique = merged.filter((item, index, self) =>
              index === self.findIndex(t => t.id === item.id)
            );
            return unique.slice(0, 8);
          });
        }
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchAllData, refreshing]);
  
  // Refresh dashboard data
  const refreshDashboard = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };
  
  // Quick Tour Modal Component
  const QuickTourModal = () => (
    showQuickTour && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Cinematic Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500" 
          onClick={() => setShowQuickTour(false)}
        />
        
        {/* Modal Container */}
        <div className="relative bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] w-full max-w-5xl 
          max-h-[90vh] overflow-y-auto overflow-x-hidden 
          animate-in zoom-in-95 duration-300 flex flex-col"
        >
          
          {/* Header Section */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,99,235,0.5)]" />
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
                  Katwanyaa High School
                </h2>
                <p className="text-[10px] italic font-medium text-white/60 tracking-widest uppercase">
                  "Education is Light"
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowQuickTour(false)}
              className="group p-3 hover:bg-rose-50 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-rose-100"
            >
              <FiX className="text-2xl text-slate-400 group-hover:text-rose-500" />
            </button>
          </div>
          
          {/* Video Content Area */}
          <div className="p-2 sm:p-6 bg-slate-50 flex-grow">
            <div className="relative aspect-video bg-slate-900 rounded-[1.5rem] overflow-hidden shadow-inner ring-4 md:ring-8 ring-white">
              {schoolVideo ? (
                <div className="w-full h-full">
                  {schoolVideo.type === 'youtube' ? (
                    <iframe
                      src={`${schoolVideo.url.replace('watch?v=', 'embed/')}?autoplay=1&rel=0`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={schoolVideo.url} autoPlay controls className="w-full h-full object-cover" poster="/school-poster.jpg" />
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <FiPlay className="text-4xl text-slate-500 mb-4" />
                  <h3 className="text-white font-bold text-lg mb-1">Tour Content Unavailable</h3>
                  <p className="text-slate-500 text-xs md:text-sm max-w-xs">Please upload a campus video in settings.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="px-8 py-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-30">
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-500 tracking-tight">
                Join 1200+ students on the virtual tour
              </p>
            </div>
            
            <button
              onClick={() => setShowQuickTour(false)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all"
            >
              Exit Tour
            </button>
          </div>
        </div>
      </div>
    )
  );
  
  // StatCard Component
  const StatCard = ({ icon: Icon, label, value, change, color, subtitle, trend }) => {
    const isPositive = trend === 'up' || change > 0;
    
    const colorMap = {
      blue: 'from-blue-500/10 to-blue-500/5 text-blue-600 border-blue-100',
      green: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-100',
      red: 'from-rose-500/10 to-rose-500/5 text-rose-600 border-rose-100',
      purple: 'from-purple-500/10 to-purple-500/5 text-purple-600 border-purple-100',
      orange: 'from-orange-500/10 to-orange-500/5 text-orange-600 border-orange-100',
      yellow: 'from-yellow-500/10 to-yellow-500/5 text-yellow-600 border-yellow-100',
      indigo: 'from-indigo-500/10 to-indigo-500/5 text-indigo-600 border-indigo-100',
      teal: 'from-teal-500/10 to-teal-500/5 text-teal-600 border-teal-100'
    };
    
    const selectedColor = colorMap[color] || colorMap.blue;
    
    return (
      <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hove overflow-hidden">
        
        {/* Background Decorative Glow */}
        <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${selectedColor} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
        
        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-3">
            {/* Label Section */}
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                {label}
              </span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                {value.toLocaleString()}
              </h3>
            </div>
            
            {/* Change & Subtitle Section */}
            <div className="flex flex-col gap-1.5">
              {change !== undefined && (
                <div className={`inline-flex items-center w-fit gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  isPositive 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                  <span>{change > 0 ? '+' : ''}{change}%</span>
                </div>
              )}
              
              {subtitle && (
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          
          {/* Modern Icon Container */}
          <div className={`p-4 rounded-2xl bg-gradient-to-br border shadow-sm ${selectedColor}`}>
            <Icon className="text-2xl" />
          </div>
        </div>
      </div>
    );
  };
  
  const PerformanceBar = ({ label, value, change, color, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <span className="font-medium text-gray-700 text-sm block mb-1">{label}</span>
        {description && <span className="text-xs text-gray-500">{description}</span>}
      </div>
      <div className="flex items-center gap-4 flex-1 max-w-xs">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            style={{ width: `${value}%` }}
            className={`bg-${color}-500 h-2 rounded-full shadow-sm`}
          />
        </div>
        <div className="flex items-center gap-1 w-16">
          <span className="text-sm font-bold text-gray-800">{value}%</span>
          {change > 0 ? (
            <FiTrendingUp className="text-green-500 text-sm" />
          ) : (
            <FiTrendingDown className="text-red-500 text-sm" />
          )}
        </div>
      </div>
    </div>
  );
  
  // Student Engagement Card Component
  const StudentEngagementCard = () => (
    <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
      
      {/* Top Glow Accent */}
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-teal-500/10 blur-2xl group-hover:bg-teal-500/20 transition-colors" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Student Engagement</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Live Monitoring</p>
        </div>
        <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 shadow-sm transition-transform group-hover:scale-100">
          <FiActivity className="text-xl" />
        </div>
      </div>
      
      {/* Engagement Score Display */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Overall Engagement</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-slate-900">
                {engagementStats.engagementRate}%
              </span>
              <span className="text-sm font-bold text-slate-400">
                ({engagementStats.engagedStudents}/{engagementStats.totalStudents} students)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              engagementStats.engagementRate >= 70 ? 'bg-emerald-50 text-emerald-600' :
              engagementStats.engagementRate >= 50 ? 'bg-blue-50 text-blue-600' :
              engagementStats.engagementRate >= 30 ? 'bg-yellow-50 text-yellow-600' :
              'bg-rose-50 text-rose-600'
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                engagementStats.engagementRate >= 70 ? 'bg-emerald-500 animate-pulse' :
                engagementStats.engagementRate >= 50 ? 'bg-blue-500' :
                engagementStats.engagementRate >= 30 ? 'bg-yellow-500' :
                'bg-rose-500'
              }`} />
              {engagementStats.engagementRate >= 70 ? 'Excellent' :
               engagementStats.engagementRate >= 50 ? 'Good' :
               engagementStats.engagementRate >= 30 ? 'Fair' : 'Needs Attention'}
            </div>
          </div>
        </div>
        
        {/* Engagement Distribution */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {Object.entries(engagementStats.distribution).map(([level, count]) => (
            <div key={level} className="text-center">
              <div className={`h-8 rounded-lg mb-1 flex items-center justify-center text-xs font-bold text-white
                ${level === 'excellent' ? 'bg-emerald-500' :
                  level === 'high' ? 'bg-blue-500' :
                  level === 'medium' ? 'bg-yellow-500' :
                  level === 'fair' ? 'bg-orange-500' :
                  'bg-rose-500'}`}
              >
                {count}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {level}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top Performing Subjects */}
      <div className="mb-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3">Top Performing Subjects</h4>
        <div className="space-y-2">
          {engagementStats.topPerformingSubjects.slice(0, 3).map((subject, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 truncate">{subject.subject}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{subject.average.toFixed(1)}%</span>
                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      subject.average >= 80 ? 'bg-emerald-500' :
                      subject.average >= 70 ? 'bg-blue-500' :
                      subject.average >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${subject.average}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Recent Activity</span>
          <span className="text-xs font-bold text-blue-600">{engagementStats.recentActivityCount} updates</span>
        </div>
        <p className="text-sm text-slate-500">
          Based on student results, uploads, and submissions from the last 7 days.
        </p>
      </div>
    </div>
  );
  
  // Student Population Card Component
  const StudentPopulationCard = () => {
    // Prepare data for form distribution bar chart
    const formData = Object.entries(studentPopulation.byForm).map(([form, count]) => ({
      name: form,
      students: count,
      fill: form === 'Form 1' ? '#3B82F6' : 
             form === 'Form 2' ? '#10B981' : 
             form === 'Form 3' ? '#F59E0B' : '#8B5CF6'
    }));
    
    // Prepare data for gender distribution pie chart
    const genderData = [
      { name: 'Male', value: studentPopulation.byGender.male, color: '#3B82F6' },
      { name: 'Female', value: studentPopulation.byGender.female, color: '#EC4899' },
      { name: 'Other', value: studentPopulation.byGender.other, color: '#6B7280' }
    ];
    
    return (
      <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
        
        {/* Top Glow Accent */}
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-colors" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Student Population</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Overview & Distribution</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm transition-transform group-hover:scale-100">
            <FiUsers className="text-xl" />
          </div>
        </div>
        
        {/* Population Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Students</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">{studentPopulation.total}</span>
              <span className="text-xs font-bold text-slate-400">enrolled</span>
            </div>
          </div>
          
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Active</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-600">{studentPopulation.active}</span>
              <span className="text-xs font-bold text-slate-400">
                ({studentPopulation.total > 0 ? Math.round((studentPopulation.active / studentPopulation.total) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
        
        {/* Form Distribution Chart */}
        <div className="mb-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3">Distribution by Form</h4>
          <div className="space-y-2">
            {formData.map((form, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{form.name}</span>
                  <span className="font-black text-slate-900">{form.students}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${studentPopulation.total > 0 ? (form.students / studentPopulation.total) * 100 : 0}%`,
                      backgroundColor: form.fill
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gender Distribution */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3">Gender Distribution</h4>
          <div className="flex items-center justify-between">
            {genderData.map((gender, index) => (
              <div key={index} className="text-center">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-3 h-3 rounded-full mb-1"
                    style={{ backgroundColor: gender.color }}
                  />
                  <span className="text-xs font-bold text-slate-700">{gender.value}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{gender.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Student Distribution Card Component
  const StudentDistributionCard = () => {
    // Prepare data for detailed distribution
    const streamData = Object.entries(studentPopulation.byStream)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([stream, count]) => ({
        name: stream,
        students: count
      }));
    
    // Calculate form percentages
    const formPercentages = Object.entries(studentPopulation.byForm).map(([form, count]) => ({
      form,
      percentage: studentPopulation.total > 0 ? (count / studentPopulation.total) * 100 : 0
    }));
    
    return (
      <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
        
        {/* Top Glow Accent */}
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-colors" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Student Distribution</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Detailed Analysis</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 shadow-sm transition-transform group-hover:scale-100">
            <FiBarChart2 className="text-xl" />
          </div>
        </div>
        
        {/* Form Distribution Pie Chart */}
        <div className="h-40 mb-6">
          {studentPopulation.total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formPercentages}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="percentage"
                  label={({ form, percentage }) => `${form}: ${percentage.toFixed(1)}%`}
                >
                  {formPercentages.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 4]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    const form = props.payload?.form || '';
                    const count = studentPopulation.byForm[form] || 0;
                    return [`${value.toFixed(1)}% (${count} students)`, 'Percentage'];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              No student data available
            </div>
          )}
        </div>
        
        {/* Top Streams */}
        <div className="mb-4">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3">Top Streams</h4>
          <div className="space-y-2">
            {streamData.length > 0 ? (
              streamData.map((stream, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 truncate">{stream.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{stream.students}</span>
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ 
                          width: `${studentPopulation.total > 0 ? (stream.students / studentPopulation.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-2">No stream data available</p>
            )}
          </div>
        </div>
        
        {/* Status Summary */}
        <div className="pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Active</span>
              <div className="text-lg font-black text-emerald-700">{studentPopulation.active}</div>
            </div>
            <div className="text-center p-2 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider">Inactive</span>
              <div className="text-lg font-black text-rose-700">{studentPopulation.inactive}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <ModernLoadingSpinner 
        message="Loading dashboard data..." 
        size="medium" 
      />
    );
  }
  
  return (
    <>
      <QuickTourModal />
      
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="relative bg-[#0F172A] rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white overflow-hidden shadow-2xl border border-white/5">
          
          {/* Abstract Mesh Gradient Background */}
          <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                {/* Institutional Branding */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,99,235,0.5)]" />
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
                      Katwanyaa High School
                    </h2>
                    <p className="text-[10px] italic font-medium text-white/60 tracking-widest uppercase">
                      "Education is Light"
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                  <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 w-fit">
                    <IoSparkles className="text-2xl sm:text-3xl text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" />
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200">{user?.name || 'Admin'}</span>!
                  </h1>
                </div>
              </div>
              
              {/* Modern Glass Refresh Button */}
              <button
                onClick={refreshDashboard}
                disabled={refreshing}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm tracking-wide transition-all hover:bg-white/20 disabled:opacity-50 w-full sm:w-fit"
              >
                <FiRefreshCw className={`text-lg transition-transform ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'UPDATING...' : 'REFRESH DATA'}</span>
              </button>
            </div>
            
            {/* Summary Text */}
            <div className="mb-8">
              <p className="text-blue-100/80 text-base sm:text-md font-medium leading-relaxed">
                Currently overseeing <span className="text-white font-bold underline decoration-blue-500/50 decoration-2 underline-offset-4">{stats.totalStudents} students</span> and <span className="text-white font-bold underline decoration-purple-500/50 decoration-2 underline-offset-4">{stats.totalStaff} staff</span>. 
                You have <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-400/20 mx-1">{stats.activeAssignments} active tasks</span> 
                and <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/20 mx-1">{stats.upcomingEvents} events</span> scheduled.
              </p>
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => setShowQuickTour(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl sm:rounded-2xl font-bold sm:font-black text-sm uppercase tracking-widest shadow-lg transition-all w-full sm:w-auto"
              >
                <FiPlay />
                Video Tour
              </button>
              
              <div className="h-[1px] w-full sm:h-10 sm:w-[1px] bg-white/10 sm:mx-2" />
              
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest text-center sm:text-left">
                System Status: <span className="text-emerald-400">Operational</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => {
            const isPositive = stat.change >= 0;
            
            const colorStyles = {
              blue: 'bg-blue-50 border-blue-100 text-blue-600 glow-blue',
              emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600 glow-emerald',
              purple: 'bg-purple-50 border-purple-100 text-purple-600 glow-purple',
              amber: 'bg-amber-50 border-amber-100 text-amber-600 glow-amber',
              rose: 'bg-rose-50 border-rose-100 text-rose-600 glow-rose'
            };
            
            const style = colorStyles[stat.color] || colorStyles.blue;
            
            return (
              <div 
                key={index} 
                className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]  overflow-hidden"
              >
                {/* Background Accent Blur */}
                <div className={`absolute -right-2 -top-2 h-20 w-20 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity ${style}`} />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                      {stat.label}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                        {stat.value}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 italic">
                        {stat.calculation}
                      </span>
                    </div>
                  </div>
                  
                  {/* Modern Icon Pod */}
                  <div className={`p-3.5 rounded-2xl border shadow-sm transition-transform group-hover:scale-100 duration-500 ${style}`}>
                    <stat.icon className="text-xl" />
                  </div>
                </div>
                
                {/* Trend Footer */}
                <div className="mt-6 flex items-center justify-between relative z-10">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-tight border ${
                    isPositive 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {isPositive ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                    <span>{isPositive ? '+' : ''}{stat.change}%</span>
                  </div>
                  
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    vs. Last Month
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Main Stats Grid - Updated to include Engagement Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Student Engagement Card */}
          <StudentEngagementCard />
          
          {/* Staff Distribution Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Staff Distribution</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Department Breakdown</p>
              </div>
              <FiUsers className="text-2xl text-blue-600" />
            </div>
            {staffDistribution.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={staffDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={4}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {staffDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6366F1'][index % 6]}
                          stroke="#fff"
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => {
                        const total = staffDistribution.reduce((sum, item) => sum + item.value, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return [`${value} staff (${percentage}%)`, 'Department'];
                      }}
                      contentStyle={{
                        borderRadius: '12px',
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.97)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        border: '2px solid #e5e7eb',
                        fontSize: '8px',
                        fontWeight: 'bold'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Department breakdown */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {staffDistribution.map((dept, index) => {
                    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F43F5E', '#6366F1'];
                    const currentColor = colors[index % colors.length];
                    
                    return (
                      <div 
                        key={index} 
                        className="group/dept flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl transition-all duration-300 hover:shadow-md hover:border-slate-200 "
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div 
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: currentColor }}
                            />
                            <div 
                              className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-0 group-hover/dept:opacity-40"
                              style={{ backgroundColor: currentColor }}
                            />
                          </div>
                          
                          <span className="text-xs font-bold text-slate-600 truncate tracking-tight group-hover/dept:text-slate-900 transition-colors">
                            {dept.name}
                          </span>
                        </div>
                        
                        {/* Counter Badge */}
                        <div 
                          className="ml-2 px-2.5 py-1 rounded-lg text-[11px] font-black tabular-nums transition-all"
                          style={{ 
                            backgroundColor: `${currentColor}10`,
                            color: currentColor 
                          }}
                        >
                          {dept.value.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center">
                <FiUsers className="text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No staff data available</p>
                <p className="text-gray-400 text-sm mt-1">Staff information will appear here</p>
              </div>
            )}
          </div>
          
          {/* Admission Growth Card */}
          <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]  overflow-hidden">
            
            {/* Background Decorative Glow */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Enrollment Pipe
                  </span>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight mt-1">Admission Growth</h3>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 shadow-sm transition-transform group-hover:scale-100">
                  <FiUserPlus className="text-xl" />
                </div>
              </div>
              
              {/* Main Value Display */}
              <div className="text-center py-4 bg-slate-50/50 rounded-2xl border border-slate-100 mb-6 group-hover:bg-white transition-colors">
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
                  {stats.totalApplications.toLocaleString()}
                </h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">Total Applications</p>
              </div>
              
              {/* Secondary Metrics Split */}
              <div className="grid grid-cols-2 gap-3">
                {/* Monthly Growth Tile */}
                <div className="p-3 rounded-2xl border border-slate-50 bg-white shadow-sm flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Monthly</span>
                  <div className={`flex items-center gap-1 font-black text-sm ${
                    admissionGrowth.monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {admissionGrowth.monthlyGrowth >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                    <span>{admissionGrowth.monthlyGrowth >= 0 ? '+' : ''}{admissionGrowth.monthlyGrowth}%</span>
                  </div>
                </div>
                
                {/* Daily Applications Tile */}
                <div className="p-3 rounded-2xl border border-slate-50 bg-white shadow-sm flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Today</span>
                  <span className="font-black text-blue-600 text-sm tabular-nums">
                    {stats.dailyApplications}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Academic Content Card */}
          <div className="group relative bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
            
            {/* Decorative Glow */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Academic Content</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Distribution</p>
              </div>
              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 shadow-sm transition-transform group-hover:scale-100">
                <FiBook className="text-xl" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {/* Assignments Column */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  Assignments
                </h4>
                {assignmentsDistribution.length > 0 ? (
                  <div className="space-y-4">
                    {assignmentsDistribution.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{item.name}</span>
                          <span className="font-black text-slate-900 tabular-nums">{item.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${item.value}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic py-2">No assignment data available</p>
                )}
              </div>
              
              {/* Resources Column */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Resources
                </h4>
                {resourcesDistribution.length > 0 ? (
                  <div className="space-y-4">
                    {resourcesDistribution.slice(0, 3).map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{item.name}</span>
                          <span className="font-black text-slate-900 tabular-nums">{item.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${item.value}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic py-2">No resource data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={FiCalendar} 
            label="Upcoming Events" 
            value={stats.upcomingEvents} 
            change={parseFloat(growthMetrics.eventGrowth)} 
            trend={parseFloat(growthMetrics.eventGrowth) >= 0 ? "up" : "down"}
            color="red" 
            subtitle="Scheduled events" 
          />
          <StatCard 
            icon={FiMessageCircle} 
            label="Guidance Sessions" 
            value={stats.guidanceSessions} 
            change={parseFloat(growthMetrics.guidanceGrowth)} 
            trend={parseFloat(growthMetrics.guidanceGrowth) >= 0 ? "up" : "down"}
            color="teal" 
            subtitle="Counseling sessions" 
          />
          <StatCard 
            icon={FiImage} 
            label="Gallery Items" 
            value={stats.galleryItems} 
            change={parseFloat(growthMetrics.galleryGrowth)} 
            trend={parseFloat(growthMetrics.galleryGrowth) >= 0 ? "up" : "down"}
            color="pink" 
            subtitle="Media content" 
          />
          <StatCard 
            icon={IoNewspaper} 
            label="News Articles" 
            value={stats.totalNews} 
            change={parseFloat(growthMetrics.newsGrowth)} 
            trend={parseFloat(growthMetrics.newsGrowth) >= 0 ? "up" : "down"}
            color="amber" 
            subtitle="Published news" 
          />
        </div>
        
        {/* Email Campaigns with Student Population Cards - NEW LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Campaigns Card - Now takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group h-full">
              {/* Decorative Glow */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-red-500/10 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Email Campaigns</h3>
                  <p className="text-xs text-slate-400 font-medium">Recent marketing performance</p>
                </div>
                <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 shadow-sm">
                  <FiMail className="text-xl" />
                </div>
              </div>

              {emailCampaigns.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  {emailCampaigns.map((campaign) => {
                    const recipients = campaign.recipients ? campaign.recipients.split(',').length : 0;
                    const isPublished = campaign.status === 'published';

                    return (
                      <div key={campaign.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-300 group/item">
                        <p className="font-bold text-sm text-slate-800 mb-3 truncate">{campaign.title}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-bold uppercase tracking-wider">Recipients</span>
                            <span className="text-slate-900 font-black tabular-nums bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">
                              {recipients.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-bold uppercase tracking-wider">Status</span>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter ${
                              isPublished ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                              {campaign.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                  <FiMail className="text-3xl text-slate-200 mb-2" />
                  <p className="text-slate-400 text-sm font-medium">No active campaigns found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Student Population Card - NEW ADDITION */}
          <StudentPopulationCard />
        </div>
        
        {/* Student Distribution Card - NEW ADDITION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudentDistributionCard />
          
          {/* Recent Activity Card */}
          <div className="group relative bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
            
            {/* Decorative Glow */}
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-3xl opacity-50 transition-opacity group-hover:opacity-80" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    History Log
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 mt-1">
                    Recent Activity
                  </h2>
                </div>
                <button 
                  onClick={refreshDashboard}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 text-blue-600 font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                >
                  Refresh
                  <FiRefreshCw className="text-sm" />
                </button>
              </div>
              
              {/* Timeline Content */}
              <div className="relative space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {/* The Timeline Track Line */}
                <div className="absolute left-6 top-2 bottom-2 w-[2px] bg-slate-100 hidden sm:block" />
                
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="group/item flex flex-col sm:flex-row sm:items-center gap-4 relative transition-all duration-300 "
                    >
                      {/* Icon Container with Timeline Pulse */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-all duration-300 group-hover/item:shadow-md `}>
                          {/* Subtle Inner Tint */}
                          <div className={`absolute inset-1.5 rounded-xl opacity-10 bg-${activity.color}-500`} />
                          <activity.icon className={`text-xl text-${activity.color}-600 relative z-10`} />
                        </div>
                      </div>
                      
                      {/* Action Text */}
                      <div className="flex-1 space-y-0.5">
                        <p className="font-bold text-slate-800 text-[15px] leading-tight group-hover/item:text-blue-600 transition-colors">
                          {activity.action}
                        </p>
                        <p className="text-sm text-slate-500 font-medium tracking-tight">
                          {activity.target}
                        </p>
                      </div>
                      
                      {/* Timestamp Badge */}
                      <div className="flex sm:block">
                        <span className="inline-block text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg group-hover/item:bg-white group-hover/item:border-slate-200 transition-all">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                    <FiStar className="text-4xl mb-2" />
                    <p className="font-bold uppercase tracking-widest text-xs">No Recent Activity</p>
                    <p className="text-xs text-slate-400 mt-1">Recent submissions will appear here</p>
                  </div>
                )}
              </div>
              
              {/* Auto-refresh notice */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center">
                  Updates automatically every few minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}