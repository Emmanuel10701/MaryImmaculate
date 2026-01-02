'use client';
import { useState, useEffect } from 'react';
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
  FiCpu
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
import { Modal, Box, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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

// Helper function to calculate month-over-month growth
const calculateMonthOverMonthGrowth = (currentCount, previousCount) => {
  if (!previousCount || previousCount === 0) {
    return currentCount > 0 ? 100 : 0;
  }
  return ((currentCount - previousCount) / previousCount) * 100;
};

// Helper function to count records by month
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
  )
}

// Chart component for percentage-based displays
const PercentageChart = ({ data, colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'] }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default function DashboardOverview() {
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [stats, setStats] = useState({
    // School Management Stats
    totalStudents: 0,
    totalStaff: 0,
    totalSubscribers: 0,
    pendingEmails: 0,
    activeAssignments: 0,
    upcomingEvents: 0,
    galleryItems: 0,
    studentCouncil: 0,
    guidanceSessions: 0,
    totalNews: 0,
    
    // Admission Application Stats
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
    
    // Admission Analytics
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
  const [growthMetrics, setGrowthMetrics] = useState({});
  const [admissionGrowth, setAdmissionGrowth] = useState({});
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showQuickTour, setShowQuickTour] = useState(false);
  const [schoolVideo, setSchoolVideo] = useState(null);
  
  // New state for dynamic data
  const [staffDistribution, setStaffDistribution] = useState([]);
  const [assignmentsDistribution, setAssignmentsDistribution] = useState([]);
  const [resourcesDistribution, setResourcesDistribution] = useState([]);
  const [careers, setCareers] = useState([]);
  const [emailCampaigns, setEmailCampaigns] = useState([]);
  
  // Get user from token on component mount
  useEffect(() => {
    const userData = decodeToken();
    if (userData) {
      setUser(userData);
    }
  }, []);
  
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

  // Fetch all data from APIs including admissions
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from all endpoints
        const [
          studentsRes,
          staffRes,
          subscribersRes,
          assignmentsRes,
          eventsRes,
          galleryRes,
          councilRes,
          guidanceRes,
          newsRes,
          schoolInfoRes,
          adminsRes,
          admissionsRes,
          resourcesRes,
          careersRes,
          emailCampaignsRes
        ] = await Promise.allSettled([
          fetch('/api/student'),
          fetch('/api/staff'),
          fetch('/api/subscriber'),
          fetch('/api/assignment'),
          fetch('/api/events'),
          fetch('/api/gallery'),
          fetch('/api/studentCouncil'),
          fetch('/api/guidance'),
          fetch('/api/news'),
          fetch('/api/school'),
          fetch('/api/register'),
          fetch('/api/applyadmission'),
          fetch('/api/resources'),
          fetch('/api/career'),
          fetch('/api/emails')
        ]);

        // Process responses
        const students = studentsRes.status === 'fulfilled' ? await studentsRes.value.json() : { students: [] };
        const staff = staffRes.status === 'fulfilled' ? await staffRes.value.json() : { staff: [] };
        const subscribers = subscribersRes.status === 'fulfilled' ? await subscribersRes.value.json() : { subscribers: [] };
        const assignments = assignmentsRes.status === 'fulfilled' ? await assignmentsRes.value.json() : { assignments: [] };
        const events = eventsRes.status === 'fulfilled' ? await eventsRes.value.json() : { events: [] };
        const gallery = galleryRes.status === 'fulfilled' ? await galleryRes.value.json() : { galleries: [] };
        const council = councilRes.status === 'fulfilled' ? await councilRes.value.json() : { councilMembers: [] };
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
            type: schoolInfo.school.videoType // 'youtube' or 'file'
          });
        }

        // Calculate staff distribution percentages
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
          setCareers(careersData.jobs.slice(0, 3)); // Show only 3 latest careers
        }

        // Set email campaigns
        if (emailCampaignsData.campaigns && emailCampaignsData.campaigns.length > 0) {
          setEmailCampaigns(emailCampaignsData.campaigns.slice(0, 2)); // Show only 2 active campaigns
        }

        // Calculate school management stats
        const activeStudents = students.students?.filter(s => s.status === 'Active').length || 0;
        const inactiveStudents = students.students?.filter(s => s.status !== 'Active').length || 0;
        const activeAssignments = assignments.assignments?.filter(a => a.status === 'assigned').length || 0;
        const upcomingEvents = events.events?.filter(e => new Date(e.date) > new Date()).length || 0;
        const activeCouncil = council.councilMembers?.filter(c => c.status === 'Active').length || 0;
        const completedAssignments = assignments.assignments?.filter(a => a.status === 'completed').length || 0;
        const totalAssignments = assignments.assignments?.length || 1;

        // Calculate admission statistics
        const applications = admissions.applications || [];
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Admission calculations
        const monthlyApplications = applications.filter(app => {
          const appDate = new Date(app.createdAt);
          return appDate.getMonth() === today.getMonth() && appDate.getFullYear() === today.getFullYear();
        }).length;

        const dailyApplications = applications.filter(app => {
          const appDate = new Date(app.createdAt);
          return appDate.toDateString() === today.toDateString();
        }).length;

        const pendingApps = applications.filter(app => app.status === 'PENDING').length;
        const acceptedApps = applications.filter(app => app.status === 'ACCEPTED').length;
        const rejectedApps = applications.filter(app => app.status === 'REJECTED').length;
        const underReviewApps = applications.filter(app => app.status === 'UNDER_REVIEW').length;
        const interviewedApps = applications.filter(app => app.status === 'INTERVIEWED').length;
        const waitlistedApps = applications.filter(app => app.status === 'WAITLISTED').length;
        const conditionalApps = applications.filter(app => app.status === 'CONDITIONAL_ACCEPTANCE').length;
        const withdrawnApps = applications.filter(app => app.status === 'WITHDRAWN').length;

        // Calculate conversion rate
        const conversionRate = applications.length > 0 ? 
          Math.round((acceptedApps / applications.length) * 100) : 0;

        // Calculate average processing time (in days)
        const processedApps = applications.filter(app => 
          ['ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(app.status)
        );
        
        let totalProcessingTime = 0;
        processedApps.forEach(app => {
          const submittedDate = new Date(app.createdAt);
          const processedDate = app.updatedAt ? new Date(app.updatedAt) : today;
          const daysDiff = Math.ceil((processedDate - submittedDate) / (1000 * 60 * 60 * 24));
          totalProcessingTime += daysDiff;
        });
        
        const avgProcessingTime = processedApps.length > 0 ? 
          Math.round(totalProcessingTime / processedApps.length) : 0;

        // Calculate month-over-month growth for all metrics
        const calculateGrowth = (dataArray) => {
          const currentMonthCount = countRecordsByMonth(dataArray, 0);
          const previousMonthCount = countRecordsByMonth(dataArray, 1);
          return calculateMonthOverMonthGrowth(currentMonthCount, previousMonthCount);
        };

        // Calculate growth metrics using actual API data
        const studentGrowth = calculateGrowth(students.students || []);
        const staffGrowth = calculateGrowth(staff.staff || []);
        const subscriberGrowth = calculateGrowth(subscribers.subscribers || []);
        const assignmentGrowth = calculateGrowth(assignments.assignments || []);
        const councilGrowth = calculateGrowth(council.councilMembers || []);
        const eventGrowth = calculateGrowth(events.events || []);
        const galleryGrowth = calculateGrowth(gallery.galleries || []);
        const guidanceGrowth = calculateGrowth(guidance.events || []);
        const newsGrowth = calculateGrowth(news.news || []);
        const admissionMonthlyGrowth = calculateGrowth(applications);

        // Update growth metrics with actual calculations
        setGrowthMetrics({
          studentGrowth: parseFloat(studentGrowth.toFixed(1)),
          staffGrowth: parseFloat(staffGrowth.toFixed(1)),
          subscriberGrowth: parseFloat(subscriberGrowth.toFixed(1)),
          assignmentGrowth: parseFloat(assignmentGrowth.toFixed(1)),
          councilGrowth: parseFloat(councilGrowth.toFixed(1)),
          eventGrowth: parseFloat(eventGrowth.toFixed(1)),
          galleryGrowth: parseFloat(galleryGrowth.toFixed(1)),
          guidanceGrowth: parseFloat(guidanceGrowth.toFixed(1)),
          newsGrowth: parseFloat(newsGrowth.toFixed(1))
        });

        // Admission analytics
        const scienceApps = applications.filter(app => app.preferredStream === 'SCIENCE').length;
        const artsApps = applications.filter(app => app.preferredStream === 'ARTS').length;
        const businessApps = applications.filter(app => app.preferredStream === 'BUSINESS').length;
        const technicalApps = applications.filter(app => app.preferredStream === 'TECHNICAL').length;
        
        const maleApps = applications.filter(app => app.gender === 'MALE').length;
        const femaleApps = applications.filter(app => app.gender === 'FEMALE').length;
        
        // Find top county
        const countyCounts = {};
        applications.forEach(app => {
          if (app.county) {
            countyCounts[app.county] = (countyCounts[app.county] || 0) + 1;
          }
        });
        const topCounty = Object.entries(countyCounts).sort((a, b) => b[1] - a[1])[0];
        
        // Calculate average KCPE score
        const kcpeScores = applications
          .filter(app => app.kcpeMarks && !isNaN(app.kcpeMarks))
          .map(app => parseInt(app.kcpeMarks));
        const avgKCPEScore = kcpeScores.length > 0 ? 
          Math.round(kcpeScores.reduce((a, b) => a + b, 0) / kcpeScores.length) : 0;
        
        // Calculate average age
        const ages = applications
          .filter(app => app.dateOfBirth)
          .map(app => {
            const birthDate = new Date(app.dateOfBirth);
            const age = today.getFullYear() - birthDate.getFullYear();
            return age;
          });
        const avgAge = ages.length > 0 ? 
          Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

        // Update stats with all data
        setStats({
          // School Management
          totalStudents: students.students?.length || 0,
          activeStudents,
          inactiveStudents,
          totalStaff: staff.staff?.length || 0,
          totalSubscribers: subscribers.subscribers?.length || 0,
          pendingEmails: 0,
          activeAssignments,
          upcomingEvents,
          galleryItems: gallery.galleries?.length || 0,
          studentCouncil: activeCouncil,
          guidanceSessions: guidance.events?.length || 0,
          totalNews: news.news?.length || 0,
          completedAssignments,
          totalAssignments,
          
          // Admission Applications
          totalApplications: applications.length,
          pendingApplications: pendingApps,
          acceptedApplications: acceptedApps,
          rejectedApplications: rejectedApps,
          underReviewApplications: underReviewApps,
          interviewedApplications: interviewedApps,
          waitlistedApplications: waitlistedApps,
          conditionalApplications: conditionalApps,
          withdrawnApplications: withdrawnApps,
          monthlyApplications,
          dailyApplications,
          applicationConversionRate: conversionRate,
          averageProcessingTime: avgProcessingTime,
          
          // Admission Analytics
          scienceApplications: scienceApps,
          artsApplications: artsApps,
          businessApplications: businessApps,
          technicalApplications: technicalApps,
          maleApplications: maleApps,
          femaleApplications: femaleApps,
          topCountyApplications: topCounty ? topCounty[0] : 'N/A',
          averageKCPEScore: avgKCPEScore,
          averageAge: avgAge
        });

        // Update admission growth with actual calculations
        setAdmissionGrowth({
          monthlyGrowth: parseFloat(admissionMonthlyGrowth.toFixed(1)),
          dailyGrowth: dailyApplications,
          acceptanceGrowth: conversionRate,
          scienceGrowth: scienceApps > 0 ? Math.round((scienceApps / applications.length) * 100) : 0,
          businessGrowth: businessApps > 0 ? Math.round((businessApps / applications.length) * 100) : 0,
          processingEfficiency: avgProcessingTime > 0 ? 
            Math.round((30 / avgProcessingTime) * 100) : 100
        });

        // Generate unified recent activity from all APIs
        const generateRecentActivity = () => {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const activities = [];
          
          // Helper function to add recent activities
          const addRecentActivities = (dataArray, type, actionPrefix, getTarget, icon, color, limit = 2) => {
            if (!dataArray || dataArray.length === 0) return;
            
            const recent = dataArray
              .filter(item => item.createdAt && new Date(item.createdAt) >= thirtyDaysAgo)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, limit);
            
            recent.forEach(item => {
              activities.push({
                id: `${type}-${item.id || item._id || Math.random()}`,
                action: `${actionPrefix}`,
                target: getTarget(item),
                time: new Date(item.createdAt).toLocaleDateString(),
                type,
                icon,
                color,
                timestamp: new Date(item.createdAt)
              });
            });
          };

          // Students - 2 most recent
          addRecentActivities(
            students.students,
            'student',
            'New student registered',
            (s) => `${s.name || 'New Student'} - ${s.form || 'Unknown Form'} ${s.stream || ''}`,
            FiUserPlus,
            'emerald',
            2
          );

          // Admission applications - 2 most recent
          const recentAdmissions = applications
            .filter(app => app.createdAt && new Date(app.createdAt) >= thirtyDaysAgo)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2);
          
          recentAdmissions.forEach(application => {
            const statusIcon = {
              'PENDING': FiClock,
              'ACCEPTED': FiCheckCircle,
              'REJECTED': FiX,
              'UNDER_REVIEW': FiEye,
              'INTERVIEWED': FiCalendar
            }[application.status] || FiClipboard;

            const statusColor = {
              'PENDING': 'yellow',
              'ACCEPTED': 'green',
              'REJECTED': 'red',
              'UNDER_REVIEW': 'blue',
              'INTERVIEWED': 'purple'
            }[application.status] || 'gray';

            activities.push({
              id: `admission-${application._id}`,
              action: 'Admission application submitted',
              target: `${application.firstName} ${application.lastName} - ${application.preferredStream || 'Unknown Stream'}`,
              status: application.status,
              time: new Date(application.createdAt).toLocaleDateString(),
              type: 'admission',
              icon: statusIcon,
              color: statusColor,
              timestamp: new Date(application.createdAt)
            });
          });

          // Staff - 1 most recent
          addRecentActivities(
            staff.staff,
            'staff',
            'New staff added',
            (s) => `${s.name || 'New Staff'} - ${s.department || 'Unknown Department'}`,
            FiUsers,
            'blue',
            1
          );

          // Assignments - 1 most recent
          addRecentActivities(
            assignments.assignments,
            'assignment',
            'Assignment created',
            (a) => `${a.title || 'New Assignment'} - ${a.className || 'Unknown Class'}`,
            FiBook,
            'indigo',
            1
          );

          // Events - 1 most recent
          addRecentActivities(
            events.events,
            'event',
            'Event scheduled',
            (e) => `${e.title || 'New Event'} - ${e.date ? new Date(e.date).toLocaleDateString() : 'Unknown Date'}`,
            FiCalendar,
            'red',
            1
          );

          // News - 1 most recent
          addRecentActivities(
            news.news,
            'news',
            'News published',
            (n) => n.title || 'New News Article',
            IoNewspaper,
            'amber',
            1
          );

          // Resources - 1 most recent
          addRecentActivities(
            resources.resources,
            'resource',
            'Resource uploaded',
            (r) => `${r.title || 'New Resource'} - ${r.category || 'Unknown Category'}`,
            FiFileText,
            'purple',
            1
          );

          // Careers - 1 most recent
          addRecentActivities(
            careersData.jobs,
            'career',
            'Career posted',
            (j) => `${j.jobTitle || 'New Job'} - ${j.department || 'Unknown Department'}`,
            IoDocumentText,
            'orange',
            1
          );

          // Email campaigns - 1 most recent
          addRecentActivities(
            emailCampaignsData.campaigns,
            'email',
            'Email campaign sent',
            (c) => c.title || 'New Email Campaign',
            FiMail,
            'red',
            1
          );

          // Sort by timestamp and limit to 8 most recent
          return activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 8);
        };

        setRecentActivity(generateRecentActivity());

        // Performance metrics including admissions and calculated percentages
        const calculatePerformanceMetrics = () => {
          const totalStudents = students.students?.length || 1;
          const activeStudents = students.students?.filter(s => s.status === 'Active').length || 0;
          const assignmentCompletionRate = Math.round((completedAssignments / totalAssignments) * 100);
          const councilEngagement = Math.round((activeCouncil / totalStudents) * 100);
          
          // Calculate staff distribution efficiency (based on department distribution)
          const staffDistEfficiency = staffDistribution.length > 0 ? 
            Math.min(100, Math.round((staffDistribution.length / 5) * 100)) : 0;
          
          // Calculate resource utilization
          const totalResources = resources.resources?.length || 1;
          const downloadedResources = resources.resources?.filter(r => r.downloads > 0).length || 0;
          const resourceUtilization = Math.round((downloadedResources / totalResources) * 100);

          return [
            { 
              label: 'Student Activity Rate', 
              value: Math.round((activeStudents / totalStudents) * 100),
              change: studentGrowth >= 0 ? studentGrowth : -studentGrowth,
              color: studentGrowth >= 0 ? 'green' : 'red',
              description: 'Percentage of active students'
            },
            { 
              label: 'Admission Conversion Rate', 
              value: conversionRate,
              change: admissionMonthlyGrowth,
              color: admissionMonthlyGrowth >= 0 ? 'purple' : 'red',
              description: 'Applications to acceptances'
            },
            { 
              label: 'Assignment Completion', 
              value: assignmentCompletionRate,
              change: assignmentGrowth,
              color: assignmentGrowth >= 0 ? 'blue' : 'red',
              description: 'Completed vs total assignments'
            },
            { 
              label: 'Council Engagement', 
              value: councilEngagement,
              change: councilGrowth,
              color: councilGrowth >= 0 ? 'indigo' : 'red',
              description: 'Student participation in council'
            },
            { 
              label: 'Resource Utilization', 
              value: resourceUtilization,
              change: 0, // No growth data for resource downloads
              color: 'orange',
              description: 'Resource downloads rate'
            }
          ];
        };

        setPerformanceData(calculatePerformanceMetrics());

        // Quick stats - dynamically calculated with actual growth
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
            label: 'Admission Growth', 
            value: `${monthlyApplications}`, 
            change: parseFloat(admissionMonthlyGrowth.toFixed(1)), 
            icon: admissionMonthlyGrowth >= 0 ? FiTrendingUp : FiTrendingDown, 
            color: admissionMonthlyGrowth >= 0 ? 'purple' : 'red',
            calculation: 'Monthly applications'
          },
          { 
            label: 'Student Engagement', 
            value: `${Math.round((activeCouncil / (students.students?.length || 1)) * 100) || 0}%`, 
            change: parseFloat(councilGrowth.toFixed(1)), 
            icon: councilGrowth >= 0 ? FiActivity : FiTrendingDown, 
            color: councilGrowth >= 0 ? 'blue' : 'red',
            calculation: 'Council participation rate'
          }
        ];

        setQuickStats(quickStatsData);

        // Admission specific stats with actual growth
        const admissionStatsData = [
          { 
            label: 'Total Applications', 
            value: applications.length, 
            change: parseFloat(admissionMonthlyGrowth.toFixed(1)),
            icon: IoDocumentText, 
            color: 'purple',
            trend: admissionMonthlyGrowth >= 0 ? 'up' : 'down',
            subtitle: `${dailyApplications} today`
          },
          { 
            label: 'Pending Review', 
            value: pendingApps, 
            change: 0, // No month-over-month data for pending status
            icon: FiClock, 
            color: 'yellow',
            trend: pendingApps > 5 ? 'warning' : 'stable',
            subtitle: 'Requires attention'
          },
          { 
            label: 'Acceptance Rate', 
            value: `${conversionRate}%`, 
            change: 0, // No month-over-month data for conversion rate
            icon: FiPercent, 
            color: 'green',
            trend: conversionRate > 20 ? 'up' : 'down',
            subtitle: `${acceptedApps} accepted`
          },
          { 
            label: 'Avg Processing Time', 
            value: `${avgProcessingTime}d`, 
            change: 0, // No month-over-month data for processing time
            icon: FiZap, 
            color: 'blue',
            trend: avgProcessingTime < 7 ? 'good' : 'slow',
            subtitle: 'Days to process'
          }
        ];

        setAdmissionStats(admissionStatsData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Enhanced Analytics Modal with Admission Analytics
  const AnalyticsModal = () => (
    showAnalyticsModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <IoAnalytics className="text-blue-500" />
              Advanced Analytics Dashboard
            </h2>
            <button
              onClick={() => setShowAnalyticsModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>

          {/* Admission Analytics Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiClipboard className="text-purple-500" />
              Admission Application Analytics
            </h3>
            
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Admission Overview */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-800 mb-4">Application Overview</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-sm text-purple-600 font-medium">Total Applications</p>
                      <p className="text-2xl font-bold text-purple-800">{stats.totalApplications}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-600 font-medium">Conversion Rate</p>
                      <p className="text-2xl font-bold text-green-800">{stats.applicationConversionRate}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium">Monthly Growth</p>
                      <p className="text-2xl font-bold text-blue-800">{stats.monthlyApplications}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <p className="text-sm text-orange-600 font-medium">Avg Processing Time</p>
                      <p className="text-2xl font-bold text-orange-800">{stats.averageProcessingTime} days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stream Distribution */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">Stream Preference Analysis</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Science', value: stats.scienceApplications, color: 'blue' },
                    { label: 'Arts', value: stats.artsApplications, color: 'purple' },
                    { label: 'Business', value: stats.businessApplications, color: 'green' },
                    { label: 'Technical', value: stats.technicalApplications, color: 'orange' }
                  ].map((stream) => (
                    <div key={stream.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${stream.color}-500`}></div>
                        <span className="text-sm text-gray-700">{stream.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-${stream.color}-500 h-2 rounded-full`}
                            style={{ 
                              width: `${(stream.value / stats.totalApplications) * 100 || 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{stream.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Application Status Breakdown</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Pending', value: stats.pendingApplications, color: 'yellow', icon: FiClock },
                  { label: 'Under Review', value: stats.underReviewApplications, color: 'blue', icon: FiEye },
                  { label: 'Interviewed', value: stats.interviewedApplications, color: 'purple', icon: FiCalendar },
                  { label: 'Accepted', value: stats.acceptedApplications, color: 'green', icon: FiCheckCircle },
                  { label: 'Rejected', value: stats.rejectedApplications, color: 'red', icon: FiX },
                  { label: 'Waitlisted', value: stats.waitlistedApplications, color: 'orange', icon: FiClock },
                  { label: 'Conditional', value: stats.conditionalApplications, color: 'teal', icon: FiAlertCircle },
                  { label: 'Withdrawn', value: stats.withdrawnApplications, color: 'gray', icon: FiUser }
                ].map((status) => (
                  <div key={status.label} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 bg-${status.color}-100 rounded-lg`}>
                        <status.icon className={`text-${status.color}-600`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{status.label}</p>
                        <p className="text-xl font-bold text-gray-800">{status.value}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((status.value / stats.totalApplications) * 100) || 0}% of total
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demographic Analysis */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <FiGlobe className="text-green-600" />
                  Top County
                </h4>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-800 mb-2">{stats.topCountyApplications}</p>
                  <p className="text-sm text-green-600">Most applications received</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                <h4 className="text-lg font-semibold text-pink-800 mb-4 flex items-center gap-2">
                  <FiUser className="text-pink-600" />
                  Gender Distribution
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-pink-700">Male</span>
                    <span className="font-semibold text-pink-800">{stats.maleApplications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-pink-700">Female</span>
                    <span className="font-semibold text-pink-800">{stats.femaleApplications}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <h4 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                  <FiBookOpen className="text-orange-600" />
                  Academic Profile
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700">Avg KCPE Score</span>
                    <span className="font-semibold text-orange-800">{stats.averageKCPEScore}/500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700">Avg Age</span>
                    <span className="font-semibold text-orange-800">{stats.averageAge} years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics Chart */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
            <h4 className="text-lg font-semibold text-indigo-800 mb-4">Admission Performance Metrics</h4>
            <div className="space-y-4">
              {performanceData.map((metric, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <span className="font-medium text-gray-700 text-sm">{metric.label}</span>
                    <span className="text-xs text-gray-500 block">{metric.description}</span>
                  </div>
                  <div className="flex items-center gap-4 w-64">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        style={{ width: `${metric.value}%` }}
                        className={`bg-${metric.color}-500 h-2 rounded-full`}
                      />
                    </div>
                    <div className="flex items-center gap-2 w-20">
                      <span className="text-sm font-bold text-gray-800">{metric.value}%</span>
                      {metric.change > 0 ? (
                        <FiTrendingUp className="text-green-500 text-sm" />
                      ) : (
                        <FiTrendingDown className="text-red-500 text-sm" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Quick Tour Modal Component
  const QuickTourModal = () => (
    showQuickTour && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FiPlay className="text-blue-500" />
              School Virtual Tour
            </h2>
            <button
              onClick={() => setShowQuickTour(false)}
              className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>

          {schoolVideo ? (
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              {schoolVideo.type === 'youtube' ? (
                <iframe
                  src={schoolVideo.url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  title="School Virtual Tour"
                />
              ) : (
                <video
                  src={schoolVideo.url}
                  controls
                  className="w-full h-full"
                  poster="/school-poster.jpg"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiPlay className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No school tour video available</p>
              <p className="text-gray-500">Please upload a video in School Information section</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowQuickTour(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl cursor-pointer font-semibold"
            >
              Close Tour
            </button>
          </div>
        </div>
      </div>
    )
  );

  const StatCard = ({ icon: Icon, label, value, change, color, subtitle, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' || change > 0 ? (
                <FiTrendingUp className="text-green-500 text-sm" />
              ) : (
                <FiTrendingDown className="text-red-500 text-sm" /> 
              )}
              <span className={`text-sm font-semibold ${trend === 'up' || change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl bg-${color}-100`}>
          <Icon className={`text-2xl text-${color}-600`} />
        </div>
      </div>
    </div>
  );

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
      <AnalyticsModal />
      <QuickTourModal />
      
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <IoSparkles className="text-2xl text-yellow-300" />
              </div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              Managing <strong>{stats.totalStudents} students</strong>, <strong>{stats.totalStaff} staff members</strong>, and <strong>{stats.totalSubscribers} subscribers</strong>. You have <span className="text-yellow-300 font-semibold">{stats.activeAssignments} active assignments</span> and <span className="text-green-300 font-semibold">{stats.upcomingEvents} upcoming events</span>.
            </p>
            
            <div className="flex items-center gap-3 sm:gap-4 mt-6">
              <button
                onClick={() => setShowAnalyticsModal(true)}
                className="
                  bg-white text-blue-600
                  px-4 py-2 text-sm
                  sm:px-6 sm:py-3 sm:text-base
                  rounded-xl font-semibold
                  flex items-center gap-2
                  shadow-lg cursor-pointer
                "
              >
                <FiBarChart2 className="text-base sm:text-lg" />
                View Analytics
                <FiArrowUpRight className="text-base sm:text-lg" />
              </button>

              <button
                onClick={() => setShowQuickTour(true)}
                className="
                  text-white/80 hover:text-white
                  px-4 py-2 text-sm
                  sm:px-6 sm:py-3 sm:text-base
                  rounded-xl font-semibold
                  border border-white/20
                  flex items-center gap-2
                  cursor-pointer
                "
              >
                <FiPlay className="text-base sm:text-lg" />
                Quick Tour
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.calculation}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`text-xl text-${stat.color}-600`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.change >= 0 ? (
                  <FiTrendingUp className="text-green-500 text-sm" />
                ) : (
                  <FiTrendingDown className="text-red-500 text-sm" />
                )}
                <span className={`text-sm font-semibold ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change >= 0 ? '+' : ''}{stat.change}%
                </span>
                <span className="text-gray-500 text-sm ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Admission Growth Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Admission Growth</h3>
              <FiUserPlus className="text-2xl text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalApplications}</p>
              <p className="text-sm text-gray-600">Total Applications</p>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Monthly Growth</span>
                  <span className={`text-sm font-semibold ${admissionGrowth.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {admissionGrowth.monthlyGrowth >= 0 ? '+' : ''}{admissionGrowth.monthlyGrowth}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Daily Applications</span>
                  <span className="text-sm font-semibold text-blue-600">{stats.dailyApplications}</span>
                </div>
              </div>
            </div>
          </div>

{/* Staff Distribution Card - Updated with ResultsChart */}
<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-800">Staff Distribution</h3>
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
            // Bolder, more prominent labels
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
      
      {/* Enhanced department breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {staffDistribution.map((dept, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6366F1'][index % 6]
                }}
              />
              <span className="text-xs font-semibold text-gray-700 truncate">{dept.name}</span>
            </div>
            <span className="text-xs font-bold text-gray-900">{dept.value}</span>
          </div>
        ))}
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

          {/* Assignments & Resources Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Assignments & Resources</h3>
              <FiBook className="text-2xl text-orange-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Assignments</h4>
                {assignmentsDistribution.length > 0 ? (
                  <div className="space-y-2">
                    {assignmentsDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{item.name}</span>
                        <span className="text-xs font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No assignment data</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Resources</h4>
                {resourcesDistribution.length > 0 ? (
                  <div className="space-y-2">
                    {resourcesDistribution.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{item.name}</span>
                        <span className="text-xs font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No resource data</p>
                )}
              </div>
            </div>
          </div>

          {/* Careers Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Career Opportunities</h3>
              <IoDocumentText className="text-2xl text-green-600" />
            </div>
            {careers.length > 0 ? (
              <div className="space-y-3">
                {careers.map((career) => (
                  <div key={career.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm text-gray-800">{career.jobTitle}</p>
                    <p className="text-xs text-gray-600">{career.department}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center">
                <p className="text-gray-500">No career opportunities</p>
              </div>
            )}
          </div>

          {/* Email Campaigns Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Email Campaigns</h3>
              <FiMail className="text-2xl text-red-600" />
            </div>
            {emailCampaigns.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {emailCampaigns.map((campaign) => {
                  const recipients = campaign.recipients ? campaign.recipients.split(',').length : 0;
                  return (
                    <div key={campaign.id} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-800">{campaign.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">Recipients</span>
                        <span className="text-xs font-semibold">{recipients}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Status</span>
                        <span className={`text-xs font-semibold ${
                          campaign.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center">
                <p className="text-gray-500">No active email campaigns</p>
              </div>
            )}
          </div>

          {/* Academic Performance Card - Empty */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Academic Performance</h3>
              <FiAward className="text-2xl text-indigo-600" />
            </div>
            <div className="h-32 flex items-center justify-center">
              <p className="text-gray-500">Performance metrics calculated dynamically</p>
            </div>
          </div>

          {/* Student Engagement Card - Empty */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Student Engagement</h3>
              <FiActivity className="text-2xl text-teal-600" />
            </div>
            <div className="h-32 flex items-center justify-center">
              <p className="text-gray-500">Engagement metrics calculated dynamically</p>
            </div>
          </div>
        </div>

        {/* Additional Stat Cards with corrected growth metrics */}
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
            icon={FiActivity} 
            label="Student Council" 
            value={stats.studentCouncil} 
            change={parseFloat(growthMetrics.councilGrowth)} 
            trend={parseFloat(growthMetrics.councilGrowth) >= 0 ? "up" : "down"}
            color="indigo" 
            subtitle="Active members" 
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity - Now unified from all APIs */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiStar className="text-yellow-500" />
                Recent Activity
              </h2>
              <button className="text-blue-600 font-semibold text-sm flex items-center gap-1 cursor-pointer">
                View All
                <FiArrowUpRight className="text-sm" />
              </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-xl"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-${activity.color}-100 flex items-center justify-center`}>
                      <activity.icon className={`text-xl text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.target}</p>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {activity.time}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-green-500" />
              Performance Metrics
            </h2>
            <div className="space-y-1">
              {performanceData.map((metric, index) => (
                <PerformanceBar
                  key={index}
                  label={metric.label}
                  value={metric.value}
                  change={metric.change}
                  color={metric.color}
                  description={metric.description}
                />
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Overall School Rating</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-800">4.8/5.0</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Student Engagement</span>
                <span className="font-semibold text-blue-600">
                  {Math.round((stats.studentCouncil / stats.totalStudents) * 100) || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );  
}