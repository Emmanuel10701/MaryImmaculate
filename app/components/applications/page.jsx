'use client'

import { useState, React, useEffect, useMemo, useRef } from 'react'
import { Toaster, toast } from 'sonner'
import { Fragment } from 'react'; // Add this line at the top
import { FcAdvertising, FcClock, FcOk, FcConferenceCall, FcLineChart } from 'react-icons/fc';
import { HiOutlineMail, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi';

import {
  User,
  Plus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Search,
  Filter,
  X,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Users,
  RefreshCw,
  Star,
  GraduationCap,
  Hash,
  TrendingUp,
  TrendingDown,
  Grid,
  List,
  Download,
  Percent,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Award,
  Trophy,
  Check,
  MoreVertical,
  Trash2,
  FileUp,
  CheckSquare,
  Square,
  Send,
  FileText,
  Upload,
  FileSpreadsheet,
  Archive,
  FileX,
  AlertTriangle,
  UserPlus,
  MailCheck,
  FileCheck,
  Columns,
  Settings,
  Bell,
  ExternalLink,
  Briefcase,
  School,
  Home,
  Globe,
  Map,
  Heart,
  TargetIcon,
  BookMarked,
  BookOpenCheck,
  AwardIcon,
  Crown,
  Sparkles,
  Zap,
  Rocket,
  TrendingUp as TrendingUpIcon,
  ChevronRight,
  ChevronLeft,
  FileDown,
  Printer,
  Share2,
  Copy,
  FilterX,
  CalendarDays,
  UserCircle,
  MailOpen,
  Smartphone,
  MessageSquare,
  FilePlus,
  CheckCheck
} from 'lucide-react'

// Modern Calendar Component
const ModernCalendar = ({ value, onChange, placeholder = "Select date" }) => {
  return (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        placeholder={placeholder}
      />
    </div>
  )
}

// Modern Modal Component
const ModernModal = ({ children, open, onClose, maxWidth = '800px' }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
        style={{ 
          width: '85%',
          maxWidth: maxWidth,
          maxHeight: '85vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  type = 'bulk',
  count = 1,
  loading = false 
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
           style={{ 
             width: '90%',
             maxWidth: '500px',
             background: 'linear-gradient(135deg, #fef3f7 0%, #f8fafc 100%)'
           }}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <AlertTriangle className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Confirm Deletion</h2>
                <p className="text-red-100 opacity-90 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
            {!loading && (
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl cursor-pointer">
                <X className="text-xl" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <AlertTriangle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {type === 'bulk' 
                  ? `Delete ${count} Application${count === 1 ? '' : 's'}?`
                  : 'Delete Application?'
                }
              </h3>
              <p className="text-gray-600">
                {type === 'bulk'
                  ? `You are about to delete ${count} application${count === 1 ? '' : 's'}. All associated data will be permanently removed.`
                  : 'This application will be permanently deleted. All associated data will be removed.'
                }
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">
                <span className="font-bold">Warning:</span> This action cannot be undone. All application data will be permanently deleted from the system.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            
            <button 
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  {type === 'bulk' ? `Delete ${count} Application${count === 1 ? '' : 's'}` : 'Delete Application'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Date Group Header Component
const DateGroupHeader = ({ dateLabel }) => {
  return (
    <tr className="bg-gray-50/80 sticky top-0 z-10">
      <td colSpan={9} className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">{dateLabel}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-300/50 via-gray-300 to-gray-300/50 ml-3"></div>
        </div>
      </td>
    </tr>
  )
}

// Application Detail Modal Component
const ApplicationDetailModal = ({ application, open, onClose }) => {
  if (!open || !application) return null

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to format gender
  const formatGender = (gender) => {
    if (!gender) return 'Not provided'
    return gender === 'MALE' ? 'Male' : 'Female'
  }

  // Group the application data into sections
  const sections = [
    {
      title: "Personal Information",
      icon: <User className="w-5 h-5" />,
      fields: [
        { label: "Full Name", value: application.fullName || `${application.firstName} ${application.middleName || ''} ${application.lastName}`.trim() },
        { label: "Application Number", value: application.applicationNumber, highlight: true },
        { label: "Gender", value: formatGender(application.gender) },
        { label: "Date of Birth", value: formatDate(application.dateOfBirth) },
        { label: "Age", value: application.age || "Not specified" },
        { label: "Nationality", value: application.nationality || "Not provided" },
      ]
    },
    {
      title: "Contact Information",
      icon: <Phone className="w-5 h-5" />,
      fields: [
        { label: "Email", value: application.email, type: "email" },
        { label: "Phone", value: application.phone, type: "phone" },
        { label: "Alternative Phone", value: application.alternativePhone || "Not provided", type: "phone" },
        { label: "Postal Address", value: `${application.postalAddress || ''} ${application.postalCode || ''}`.trim() || "Not provided" },
      ]
    },
    {
      title: "Location Details",
      icon: <MapPin className="w-5 h-5" />,
      fields: [
        { label: "County", value: application.county },
        { label: "Constituency", value: application.constituency },
        { label: "Ward", value: application.ward },
        { label: "Village", value: application.village },
      ]
    },
    {
      title: "Parent/Guardian Information",
      icon: <Users className="w-5 h-5" />,
      fields: [
        { label: "Father's Name", value: application.fatherName || "Not provided" },
        { label: "Father's Phone", value: application.fatherPhone || "Not provided", type: "phone" },
        { label: "Father's Email", value: application.fatherEmail || "Not provided", type: "email" },
        { label: "Father's Occupation", value: application.fatherOccupation || "Not provided" },
        { label: "Mother's Name", value: application.motherName || "Not provided" },
        { label: "Mother's Phone", value: application.motherPhone || "Not provided", type: "phone" },
        { label: "Mother's Email", value: application.motherEmail || "Not provided", type: "email" },
        { label: "Mother's Occupation", value: application.motherOccupation || "Not provided" },
        { label: "Guardian's Name", value: application.guardianName || "Not provided" },
        { label: "Guardian's Phone", value: application.guardianPhone || "Not provided", type: "phone" },
        { label: "Guardian's Email", value: application.guardianEmail || "Not provided", type: "email" },
        { label: "Guardian's Occupation", value: application.guardianOccupation || "Not provided" },
      ]
    },
    {
      title: "Academic Information",
      icon: <GraduationCap className="w-5 h-5" />,
      fields: [
        { label: "Previous School", value: application.previousSchool },
        { label: "Previous Class", value: application.previousClass },
        { label: "KCPE Year", value: application.kcpeYear },
        { label: "KCPE Index", value: application.kcpeIndex },
        { label: "KCPE Marks", value: `${application.kcpeMarks || 0} / 500`, highlight: true },
        { label: "Mean Grade", value: application.meanGrade || "Not provided" },
      ]
    },
    {
      title: "Health & Interests",
      icon: <Heart className="w-5 h-5" />,
      fields: [
        { label: "Medical Condition", value: application.medicalCondition || "None" },
        { label: "Allergies", value: application.allergies || "None" },
        { label: "Blood Group", value: application.bloodGroup || "Not specified" },
        { label: "Sports Interests", value: application.sportsInterests || "Not specified" },
        { label: "Clubs Interests", value: application.clubsInterests || "Not specified" },
        { label: "Talents", value: application.talents || "Not specified" },
      ]
    },
    {
      title: "Application Details",
      icon: <FileText className="w-5 h-5" />,
      fields: [
        { label: "Status", value: application.statusLabel || application.status },
        { label: "Submitted On", value: formatDate(application.createdAt) },
        { label: "Last Updated", value: formatDate(application.updatedAt) },
        { label: "Application ID", value: application.id },
      ]
    }
  ]

  return (
    <ModernModal open={open} onClose={onClose} maxWidth="1000px">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{application.firstName} {application.lastName}</h2>
              <div className="flex items-center gap-4 mt-1 text-blue-100">
                <span className="text-sm">#{application.applicationNumber}</span>
                <span className="text-sm">•</span>
                <span className="text-sm">{application.email}</span>
                <span className="text-sm">•</span>
                <span className="text-sm">{application.phone}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[calc(85vh-120px)] overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white/80 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                  {section.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
              </div>
              
              <div className="space-y-3">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="flex flex-col sm:flex-row sm:items-start gap-1">
                    <div className="w-full sm:w-2/5">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {field.label}
                      </span>
                    </div>
                    <div className="w-full sm:w-3/5">
                      <span className={`text-sm ${field.highlight ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                        {field.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information Section */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Additional Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Decision Notes
              </span>
              <span className="text-sm text-gray-700">
                {application.decisionNotes || "No decision notes available"}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Documents Verification
              </span>
              <span className={`text-sm font-bold ${application.documentsVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                {application.documentsVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Application Score: </span>
            <span className="font-bold text-blue-600">
              {/* You can add a scoring function here */}
              {application.kcpeMarks ? `${Math.round((application.kcpeMarks / 500) * 100)}%` : 'Not calculated'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg transition-all duration-200 font-medium hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                // You can add print functionality here
                window.print()
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg transition-all duration-200 font-medium hover:opacity-90"
            >
              Print Application
            </button>
          </div>
        </div>
      </div>
    </ModernModal>
  )
}

export default function ModernApplicationsDashboard() {
  // Main State
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // View States
  const [activeView, setActiveView] = useState('all')
  const [selectedApplications, setSelectedApplications] = useState(new Set())
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false) // New state for delete modal
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterStream, setFilterStream] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  
  // Decision State
  const [decisionType, setDecisionType] = useState('')
  const [decisionData, setDecisionData] = useState({
    status: '',
    notes: '',
    admissionClass: '',
    assignedStream: '',
    reportingDate: '',
    conditions: '',
    conditionDeadline: '',
    rejectionReason: '',
    alternativeSuggestions: '',
    waitlistPosition: '',
    waitlistNotes: '',
    sendEmail: true,
    admissionOfficer: 'Admissions Committee'
  })
  
  // Bulk Decision State
  const [bulkDecisionType, setBulkDecisionType] = useState('')
  const [bulkDecisionData, setBulkDecisionData] = useState({
    status: '',
    notes: '',
    sendEmail: true
  })
  
  // Loading States
  const [loadingStates, setLoadingStates] = useState({
    detail: false,
    decision: false,
    bulk: false,
    delete: false
  })
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    interviewScheduled: 0,
    interviewed: 0,
    accepted: 0,
    conditional: 0,
    waitlisted: 0,
    rejected: 0,
    withdrawn: 0,
    decisionRate: 0
  })
  
  // Stream data
  const streams = [
    { value: 'SCIENCE', label: 'Science', icon: '🔬', color: 'from-blue-500 to-cyan-500' },
    { value: 'ARTS', label: 'Arts', icon: '🎨', color: 'from-purple-500 to-pink-500' },
    { value: 'BUSINESS', label: 'Business', icon: '💼', color: 'from-green-500 to-emerald-500' },
    { value: 'TECHNICAL', label: 'Technical', icon: '⚙️', color: 'from-orange-500 to-red-500' }
  ]
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Eye },
    { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: CalendarDays },
    { value: 'INTERVIEWED', label: 'Interviewed', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: UserCheck },
    { value: 'ACCEPTED', label: 'Accepted', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    { value: 'CONDITIONAL_ACCEPTANCE', label: 'Conditional', color: 'bg-teal-100 text-teal-800 border-teal-200', icon: ShieldCheck },
    { value: 'WAITLISTED', label: 'Waitlisted', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: XCircle }
  ]
  
  // Decision types
  const decisionTypes = [
    { 
      value: 'ACCEPTED', 
      label: 'Accept', 
      color: 'bg-gradient-to-r from-emerald-500 to-green-500', 
      icon: CheckCircle2 
    },
    { 
      value: 'CONDITIONAL_ACCEPTANCE', 
      label: 'Conditional', 
      color: 'bg-gradient-to-r from-teal-500 to-cyan-500', 
      icon: ShieldCheck 
    },
    { 
      value: 'WAITLISTED', 
      label: 'Waitlist', 
      color: 'bg-gradient-to-r from-amber-500 to-orange-500', 
      icon: Clock 
    },
    { 
      value: 'REJECTED', 
      label: 'Reject', 
      color: 'bg-gradient-to-r from-rose-500 to-pink-500', 
      icon: XCircle 
    },
    { 
      value: 'INTERVIEW_SCHEDULED', 
      label: 'Schedule Interview', 
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500', 
      icon: Calendar 
    }
  ]
  
  // Table columns
  const columns = [
    { key: 'select', label: '', width: 'w-12' },
    { key: 'applicant', label: 'Applicant', width: 'w-48' },
    { key: 'kcpeMarks', label: 'KCPE Score', width: 'w-28' },
    { key: 'status', label: 'Status', width: 'w-36' },
    { key: 'submitted', label: 'Submitted', width: 'w-36' },
    { key: 'actions', label: 'Actions', width: 'w-24' }
  ]
  
  // Helper function to group applications by date
  const groupApplicationsByDate = (apps) => {
    if (!apps || !apps.length) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const groups = [];
    let currentGroup = null;
    
    apps.forEach((app, index) => {
      if (!app.createdAt) return;
      
      const appDate = new Date(app.createdAt);
      appDate.setHours(0, 0, 0, 0);
      
      let groupLabel = '';
      
      // Determine group label
      if (appDate.getTime() === today.getTime()) {
        groupLabel = 'Today';
      } else if (appDate.getTime() === yesterday.getTime()) {
        groupLabel = 'Yesterday';
      } else {
        // Format date as "23 Jan 2025"
        groupLabel = appDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
      
      // Create new group or add to existing
      if (!currentGroup || currentGroup.label !== groupLabel) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          label: groupLabel,
          date: appDate,
          applications: [app]
        };
      } else {
        currentGroup.applications.push(app);
      }
      
      // Add last group
      if (index === apps.length - 1 && currentGroup) {
        groups.push(currentGroup);
      }
    });
    
    return groups;
  };
  
  // Fetch applications
  useEffect(() => {
    fetchApplications()
  }, [])
  
  const fetchApplications = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/applyadmission')
      
      if (!response.ok) throw new Error('Failed to fetch applications')
      
      const data = await response.json()
      
      if (data.success) {
        // Handle the nested applications array from your API response
        const apps = data.applications || []
        setApplications(apps)
        updateStats(apps)
        toast.success(`Loaded ${apps.length} applications`)
      } else {
        toast.error(data.error || 'Failed to load applications')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Network error. Please check connection.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }
  
  const updateStats = (apps) => {
    const newStats = {
      total: apps.length,
      pending: 0,
      underReview: 0,
      interviewScheduled: 0,
      interviewed: 0,
      accepted: 0,
      conditional: 0,
      waitlisted: 0,
      rejected: 0,
      withdrawn: 0,
      decisionRate: 0
    }
    
    apps.forEach(app => {
      if (app.status === 'PENDING') newStats.pending++
      if (app.status === 'UNDER_REVIEW') newStats.underReview++
      if (app.status === 'INTERVIEW_SCHEDULED') newStats.interviewScheduled++
      if (app.status === 'INTERVIEWED') newStats.interviewed++
      if (app.status === 'ACCEPTED') newStats.accepted++
      if (app.status === 'CONDITIONAL_ACCEPTANCE') newStats.conditional++
      if (app.status === 'WAITLISTED') newStats.waitlisted++
      if (app.status === 'REJECTED') newStats.rejected++
    })
    
    const decided = apps.filter(app => 
      app.status !== 'PENDING' && app.status !== 'UNDER_REVIEW'
    ).length
    newStats.decisionRate = newStats.total > 0 
      ? Math.round((decided / newStats.total) * 100) 
      : 0
    
    setStats(newStats)
  }
  
  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter(app => {
        const matchesSearch = 
          (app.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (app.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (app.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (app.phone?.includes(searchTerm) || false) ||
          (app.applicationNumber?.includes(searchTerm) || false)
        
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus
        const matchesStream = filterStream === 'all' || app.preferredStream === filterStream
        
        let matchesDate = true
        if (startDate || endDate) {
          const appDate = new Date(app.createdAt)
          if (startDate) {
            const start = new Date(startDate)
            if (appDate < start) matchesDate = false
          }
          if (endDate) {
            const end = new Date(endDate)
            if (appDate > end) matchesDate = false
          }
        }
        
        let matchesView = true
        if (activeView === 'pending') {
          matchesView = app.status === 'PENDING' || app.status === 'UNDER_REVIEW'
        } else if (activeView === 'decided') {
          matchesView = app.status !== 'PENDING' && app.status !== 'UNDER_REVIEW'
        }
        
        return matchesSearch && matchesStatus && matchesStream && matchesDate && matchesView
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          case 'oldest':
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
          case 'name-asc':
            return `${a.firstName || ''} ${a.lastName || ''}`.localeCompare(`${b.firstName || ''} ${b.lastName || ''}`)
          case 'name-desc':
            return `${b.firstName || ''} ${b.lastName || ''}`.localeCompare(`${a.firstName || ''} ${a.lastName || ''}`)
          case 'score-high':
            return (b.kcpeMarks || 0) - (a.kcpeMarks || 0)
          case 'score-low':
            return (a.kcpeMarks || 0) - (b.kcpeMarks || 0)
          default:
            return 0
        }
      })
  }, [applications, searchTerm, filterStatus, filterStream, startDate, endDate, activeView, sortBy])
  
  // Group filtered applications by date
  const groupedApplications = useMemo(() => {
    return groupApplicationsByDate(filteredApplications);
  }, [filteredApplications]);
  
  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedApplications.size === filteredApplications.length) {
      setSelectedApplications(new Set())
    } else {
      const allIds = new Set(filteredApplications.map(app => app.id))
      setSelectedApplications(allIds)
    }
  }
  
  const toggleSelectApplication = (id) => {
    const newSelection = new Set(selectedApplications)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedApplications(newSelection)
  }
  
  // Calculate application score
  const getApplicationScore = (application) => {
    let score = 0
    
    if (application.kcpeMarks) {
      score += (application.kcpeMarks / 500) * 40
    }
    
    if (application.meanGrade && ['A', 'A-'].includes(application.meanGrade.toUpperCase())) score += 20
    
    const hasExtracurricular = application.sportsInterests || application.clubsInterests || application.talents
    if (hasExtracurricular) score += 10
    
    const completeFields = ['fatherName', 'motherName', 'medicalCondition', 'bloodGroup']
    const completed = completeFields.filter(field => application[field]).length
    score += (completed / completeFields.length) * 20
    
    return Math.min(100, Math.round(score))
  }
  
  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    if (!statusConfig) return null
    
    const Icon = statusConfig.icon || CheckCircle2
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
        <Icon className="w-3 h-3" />
        {statusConfig.label}
      </span>
    )
  }
  
  // Get stream badge
  const getStreamBadge = (streamValue) => {
    const stream = streams.find(s => s.value === streamValue) || streams[0]
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border border-blue-200">
        <span>{stream.icon}</span>
        {stream.label}
      </span>
    )
  }
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  // Open detail modal
  const openDetailModal = (application) => {
    setSelectedApplication(application)
    setShowDetailModal(true)
  }
  
  // Open decision modal for single application
  const openDecisionModal = (application, type = '') => {
    setSelectedApplication(application)
    setDecisionType(type)
    setDecisionData({
      status: type || application.status,
      notes: '',
      admissionClass: application.admissionClass || '',
      assignedStream: application.assignedStream || application.preferredStream || '',
      reportingDate: application.reportingDate || '',
      conditions: application.conditions || '',
      conditionDeadline: application.conditionDeadline || '',
      rejectionReason: application.rejectionReason || '',
      alternativeSuggestions: application.alternativeSuggestions || '',
      waitlistPosition: application.waitlistPosition || '',
      waitlistNotes: application.waitlistNotes || '',
      sendEmail: true,
      admissionOfficer: 'Admissions Committee'
    })
    setShowDecisionModal(true)
  }
  
  // Open bulk decision modal
  const openBulkModal = (type = '') => {
    if (selectedApplications.size === 0) {
      toast.error('Please select applications first')
      return
    }
    
    setBulkDecisionType(type)
    setBulkDecisionData({
      status: type || '',
      notes: '',
      sendEmail: true
    })
    setShowBulkModal(true)
  }
  
  // Open delete confirmation modal
  const openDeleteModal = () => {
    if (selectedApplications.size === 0) {
      toast.error('Please select applications first')
      return
    }
    
    setShowDeleteModal(true)
  }
  
  // Update single application status
  const updateApplicationStatus = async () => {
    if (!selectedApplication || !decisionType) return
    
    try {
      setLoadingStates(prev => ({ ...prev, decision: true }))
      
      const requestBody = {
        status: decisionType,
        notes: decisionData.notes,
        admissionOfficer: decisionData.admissionOfficer,
        decisionDate: new Date().toISOString()
      }
      
      // Add decision-specific data
      if (decisionType === 'ACCEPTED') {
        requestBody.assignedStream = decisionData.assignedStream
        requestBody.admissionClass = decisionData.admissionClass
        requestBody.reportingDate = decisionData.reportingDate
        requestBody.admissionDate = new Date().toISOString()
      } else if (decisionType === 'REJECTED') {
        requestBody.rejectionReason = decisionData.rejectionReason
        requestBody.alternativeSuggestions = decisionData.alternativeSuggestions
        requestBody.rejectionDate = new Date().toISOString()
      } else if (decisionType === 'WAITLISTED') {
        requestBody.waitlistPosition = decisionData.waitlistPosition
        requestBody.waitlistNotes = decisionData.waitlistNotes
      } else if (decisionType === 'CONDITIONAL_ACCEPTANCE') {
        requestBody.conditions = decisionData.conditions
        requestBody.conditionDeadline = decisionData.conditionDeadline
      }
      
      const response = await fetch(`/api/applyadmission/${selectedApplication.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Application ${decisionType.toLowerCase()} successfully`)
        
        // Update local state
        const updatedApplications = applications.map(app => 
          app.id === selectedApplication.id ? { 
            ...app, 
            ...requestBody,
            status: decisionType
          } : app
        )
        
        setApplications(updatedApplications)
        updateStats(updatedApplications)
        setShowDecisionModal(false)
        setSelectedApplication(null)
      } else {
        toast.error(data.error || 'Failed to update application')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setLoadingStates(prev => ({ ...prev, decision: false }))
    }
  }
  
  // Bulk update application status
  const updateBulkApplicationStatus = async () => {
    if (selectedApplications.size === 0 || !bulkDecisionType) {
      toast.error('Please select applications and a decision type')
      return
    }
    
    try {
      setLoadingStates(prev => ({ ...prev, bulk: true }))
      
      const updates = Array.from(selectedApplications).map(async (applicationId) => {
        const requestBody = {
          status: bulkDecisionType,
          notes: bulkDecisionData.notes,
          decisionDate: new Date().toISOString(),
          admissionOfficer: 'Admissions Committee'
        }
        
        return fetch(`/api/applyadmission/${applicationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        })
      })
      
      const responses = await Promise.all(updates)
      const results = await Promise.all(responses.map(res => res.json()))
      
      const allSuccess = results.every(result => result.success)
      
      if (allSuccess) {
        toast.success(`Updated ${selectedApplications.size} applications to ${bulkDecisionType}`)
        
        // Update local state
        const updatedApplications = applications.map(app => 
          selectedApplications.has(app.id) ? { 
            ...app, 
            status: bulkDecisionType,
            notes: bulkDecisionData.notes
          } : app
        )
        
        setApplications(updatedApplications)
        updateStats(updatedApplications)
        setShowBulkModal(false)
        setSelectedApplications(new Set())
      } else {
        toast.error('Some updates failed')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setLoadingStates(prev => ({ ...prev, bulk: false }))
    }
  }
  
  // Delete applications
  const deleteApplications = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, delete: true }))
      
      const deletes = Array.from(selectedApplications).map(async (applicationId) => {
        return fetch(`/api/applyadmission/${applicationId}`, {
          method: 'DELETE'
        })
      })
      
      const responses = await Promise.all(deletes)
      const results = await Promise.all(responses.map(res => res.json()))
      
      const allSuccess = results.every(result => result.success)
      
      if (allSuccess) {
        toast.success(`Deleted ${selectedApplications.size} application${selectedApplications.size === 1 ? '' : 's'}`)
        
        // Update local state
        const updatedApplications = applications.filter(app => !selectedApplications.has(app.id))
        setApplications(updatedApplications)
        updateStats(updatedApplications)
        setSelectedApplications(new Set())
        setShowDeleteModal(false)
      } else {
        toast.error('Some deletions failed')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }))
    }
  }
  
  // Export applications
  const exportApplications = () => {
    const dataToExport = filteredApplications.map(app => ({
      'Application Number': app.applicationNumber,
      'First Name': app.firstName,
      'Last Name': app.lastName,
      'Email': app.email,
      'Phone': app.phone,
      'KCPE Marks': app.kcpeMarks,
      'Preferred Stream': app.preferredStream,
      'Status': app.status,
      'Submitted Date': formatDate(app.createdAt),
      'County': app.county,
      'Previous School': app.previousSchool
    }))
    
    const csvContent = [
      Object.keys(dataToExport[0] || {}).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success('Applications exported successfully')
  }
  
  // Reset filters - FIXED FUNCTION
  const resetFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    setFilterStream('all')
    setStartDate('')
    setEndDate('')
    setSortBy('newest')
  }
  
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col, index) => (
                <th key={index} className="p-4 text-left">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="border-b border-gray-50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )


// Empty State Component - Add this after LoadingSkeleton component
const EmptyState = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden">
    <div className="p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
        <FileText className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">No applications found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
      <button
        onClick={resetFilters}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Clear All Filters
      </button>
    </div>
  </div>
)


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />

<div className="relative mb-6 sm:mb-8 overflow-hidden
                rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem]
                bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-700
                p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl">

  {/* Background Overlay */}
  <div className="absolute inset-0 opacity-[0.08] sm:opacity-10 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 to-indigo-400/10" />
  </div>

  {/* Glow Effects */}
  <div className="absolute -right-16 sm:-right-24 -top-16 sm:-top-24
                  w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96
                  bg-gradient-to-r from-purple-500 to-blue-400
                  rounded-full opacity-15 sm:opacity-20
                  blur-xl sm:blur-2xl md:blur-3xl" />

  <div className="absolute -left-16 sm:-left-24 -bottom-16 sm:-bottom-24
                  w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96
                  bg-gradient-to-r from-indigo-500 to-purple-400
                  rounded-full opacity-10 sm:opacity-15
                  blur-xl sm:blur-2xl md:blur-3xl" />

  <div className="relative z-10">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">

      {/* Left Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">

          {/* Icon */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500
                            rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-70" />
            <div className="relative p-3 sm:p-4 bg-gradient-to-br from-blue-600 to-purple-600
                            rounded-xl sm:rounded-2xl shadow-2xl">
              <GraduationCap className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">

            {/* Badge */}
            <div className="hidden xs:inline-flex items-center gap-1.5 sm:gap-2
                            px-2 sm:px-3 py-1
                            bg-white/20 backdrop-blur-sm
                            rounded-full mb-2 sm:mb-3 max-w-max">
              <span className="text-[10px] xs:text-xs font-bold text-white uppercase tracking-widest">
                Admissions
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl
                           font-black text-white tracking-tight leading-tight">
              Admissions
              <span className="block sm:inline"> </span>
              <span className="text-transparent bg-clip-text
                               bg-gradient-to-r from-cyan-200 to-purple-200">
                Dashboard
              </span>
            </h1>

            {/* Description */}
            <p className="mt-2 sm:mt-3 text-sm xs:text-base sm:text-lg
                          text-cyan-100/90 font-medium
                          max-w-2xl leading-relaxed
                          line-clamp-2 sm:line-clamp-none">
              Manage and review student applications efficiently with real-time updates.
            </p>

          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between
                      lg:flex-col lg:items-end gap-3 sm:gap-4">

        {/* Actions */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">

          {/* Refresh */}
          <button
            onClick={fetchApplications}
            disabled={refreshing || loadingStates?.fetching}
            className="group relative flex items-center justify-center gap-2
                       px-4 sm:px-5 py-2.5 sm:py-3
                       bg-white/10 backdrop-blur-sm border border-white/20
                       rounded-xl sm:rounded-2xl text-white font-semibold
                       hover:bg-white/15 active:scale-95 transition-all
                       disabled:opacity-60 w-full xs:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-xs sm:text-sm">
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </span>
          </button>

        

        </div>
      </div>

    </div>
  </div>
</div>


<div className="mb-8 space-y-6">

  {/* 1. Modern View Toggle - Floating Glass Tray */}
  <div className="inline-flex p-1.5 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-sm overflow-x-auto max-w-full no-scrollbar">
    <div className="flex items-center gap-1.5">
      {[
        { view: 'all', label: 'All', count: stats.total, icon: HiOutlineMail, color: 'text-slate-600', activeBg: 'bg-slate-900 text-white' },
        { view: 'pending', label: 'Pending', count: stats.pending + stats.underReview, icon: HiOutlineClock, color: 'text-blue-500', activeBg: 'bg-blue-600 text-white' },
        { view: 'decided', label: 'Decided', count: stats.total - (stats.pending + stats.underReview), icon: HiOutlineCheckCircle, color: 'text-emerald-500', activeBg: 'bg-emerald-600 text-white' }
      ].map((item) => (
        <button
          key={item.view}
          onClick={() => setActiveView(item.view)}
          className={`
            group flex items-center gap-2.5 
            px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold 
            whitespace-nowrap transition-all duration-300
            ${activeView === item.view 
              ? `${item.activeBg} shadow-lg shadow-blue-500/20` 
              : 'text-gray-500 hover:bg-gray-100'
            }
          `}
        >
          <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activeView === item.view ? 'text-white' : item.color}`} />
          <span className="tracking-tight">{item.label}</span>
          <span className={`
            ml-1 px-2 py-0.5 rounded-lg text-[10px] font-black transition-colors
            ${activeView === item.view ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
          `}>
            {item.count}
          </span>
        </button>
      ))}
    </div>
  </div>

  {/* 2. Modern Stats Grid - Zoom Responsive */}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
    {[
      { label: 'Total', value: stats.total, icon: <FcAdvertising />, bg: 'hover:border-blue-200' },
      { label: 'Pending', value: stats.pending + stats.underReview, icon: <FcClock />, bg: 'hover:border-amber-200' },
      { label: 'Accepted', value: stats.accepted, icon: <FcOk />, bg: 'hover:border-emerald-200' },
      { label: 'Rejected', value: stats.rejected, icon: <XCircle className="text-rose-500 text-3xl sm:text-4xl" />, bg: 'hover:border-rose-200' },
      { label: 'Interview', value: stats.interviewScheduled + stats.interviewed, icon: <FcConferenceCall />, bg: 'hover:border-purple-200' },
      { label: 'Decision Rate', value: `${stats.decisionRate}%`, icon: <FcLineChart />, bg: 'hover:border-indigo-200' }
    ].map((stat) => (
      <div
        key={stat.label}
        className={`
          group relative bg-white rounded-[2rem] border border-gray-100 
          p-6 transition-all duration-500 
          hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]
          ${stat.bg}
        `}
      >
        <div className="flex flex-col items-start gap-4">
          {/* Icon with Soft Glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-current opacity-10 blur-xl rounded-full group-hover:opacity-20 transition-opacity" />
            <div className="relative text-3xl sm:text-4xl transition-transform duration-500 group-hover:scale-100 group-hover:rotate-3">
              {stat.icon}
            </div>
          </div>

          <div className="space-y-1 w-full">
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
              {stat.label}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">
                {stat.value}
              </p>
            </div>
          </div>
        </div>

        {/* Glossy Overlay effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-[2rem] pointer-events-none" />
      </div>
    ))}
  </div>

</div>

    {/* Selection Actions Bar */}
{selectedApplications.size > 0 && (
  <div className="sticky top-4 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg px-4 py-3 rounded-2xl mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
    <div className="flex items-center gap-6">
      {/* Selection Count */}
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 text-white flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold">
          {selectedApplications.size}
        </div>
        <span className="text-sm font-semibold text-slate-700 underline-offset-4 decoration-indigo-200 decoration-2">
          Applications Selected
        </span>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-slate-200" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => openBulkModal('ACCEPTED')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50 rounded-xl transition-all duration-200 text-sm font-semibold"
        >
          <CheckCircle2 className="w-4 h-4" />
          Accept
        </button>

        <button
          onClick={() => openBulkModal('REJECTED')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/50 rounded-xl transition-all duration-200 text-sm font-semibold"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>

        {/* Delete button now opens confirmation modal */}
        <button
          onClick={openDeleteModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-rose-600 border border-slate-200 rounded-xl transition-all duration-200 text-sm font-semibold"
        >
          <Trash2 className="w-4 h-4" />
          Delete Selected
        </button>
      </div>
    </div>

    {/* Clear Selection */}
    <button
      onClick={() => setSelectedApplications(new Set())}
      className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors px-2 py-1"
    >
      <span className="text-xs font-medium uppercase tracking-wider">Clear</span>
      <X className="w-4 h-4" />
    </button>
  </div>
)}
  {/* Filters Section - Modernized */}
<div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 mb-8 shadow-xl shadow-gray-200/20">
  <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
    
    {/* 1. Search Bar - Enhanced with inner depth */}
    <div className="flex-1 relative group">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
      <input
        type="text"
        placeholder="Search applications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full pl-12 pr-4 py-3.5
          bg-gray-100/50 border border-transparent
          rounded-2xl focus:outline-none
          focus:bg-white focus:ring-4 focus:ring-blue-500/10
          focus:border-blue-500/50
          transition-all duration-300
          text-sm font-medium placeholder:text-gray-400
          hover:bg-gray-200/50
        "
      />
    </div>

    {/* 2. Filter Controls Group */}
    <div className="flex flex-wrap items-center gap-3">
      
      {/* Status Filter */}
      <div className="relative flex-1 min-w-[160px] sm:flex-none group">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="
            w-full pl-11 pr-10 py-3.5 
            bg-gradient-to-r from-gray-100/50 to-gray-100/30 
            border-none rounded-2xl 
            text-xs font-bold text-gray-600 
            appearance-none 
            focus:ring-2 focus:ring-blue-500/20 
            cursor-pointer 
            hover:from-gray-200/50 hover:to-gray-200/30 
            transition-all duration-200
          "
        >
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>

      {/* Stream Filter */}
      <div className="relative flex-1 min-w-[160px] sm:flex-none group">
        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        <select 
          value={filterStream}
          onChange={(e) => setFilterStream(e.target.value)}
          className="
            w-full pl-11 pr-10 py-3.5 
            bg-gradient-to-r from-gray-100/50 to-gray-100/30 
            border-none rounded-2xl 
            text-xs font-bold text-gray-600 
            appearance-none 
            focus:ring-2 focus:ring-blue-500/20 
            cursor-pointer 
            hover:from-gray-200/50 hover:to-gray-200/30 
            transition-all duration-200
          "
        >
          <option value="all">All Streams</option>
          {streams.map(stream => (
            <option key={stream.value} value={stream.value}>{stream.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>

      {/* Date Range Group - Modernized */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-gray-100/50 to-gray-100/30 p-2 rounded-2xl border border-gray-200/20">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="
              pl-10 pr-3 py-2.5 
              bg-transparent border-none 
              text-xs font-bold text-gray-600 
              focus:ring-0 cursor-pointer
              focus:outline-none
              min-w-[130px]
            "
          />
        </div>
        <span className="text-gray-400 font-bold text-xs">→</span>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="
              pl-10 pr-3 py-2.5 
              bg-transparent border-none 
              text-xs font-bold text-gray-600 
              focus:ring-0 cursor-pointer
              focus:outline-none
              min-w-[130px]
            "
          />
        </div>
      </div>

      {/* Sort Dropdown - Modernized */}
      <div className="relative flex-1 min-w-[180px] sm:flex-none">
        <TrendingUpIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="
            w-full pl-11 pr-10 py-3.5 
            bg-gradient-to-r from-gray-900 to-black 
            text-slate-100 border-none 
            rounded-2xl 
            text-xs font-bold 
            appearance-none 
            focus:ring-4 focus:ring-blue-500/20 
            cursor-pointer 
            hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 
            transition-all duration-200
            shadow-lg
          "
        >
          <option className='text-slate-900' value="newest">Newest First</option>
          <option className='text-slate-900' value="oldest">Oldest First</option>
          <option className='text-slate-900' value="name-asc">Name A-Z</option>
          <option className='text-slate-900' value="name-desc">Name Z-A</option>
          <option className='text-slate-900' value="score-high">Highest Score</option>
          <option className='text-slate-900' value="score-low">Lowest Score</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 pointer-events-none" />
      </div>

      {/* Clear Filters Button - Now properly connected */}
      <button
        onClick={resetFilters}
        title="Clear All Filters"
        className="
          flex items-center justify-center gap-2
          px-4 py-3.5
          bg-gradient-to-r from-red-500 to-pink-500 
          text-white border-none 
          rounded-2xl 
          text-xs font-bold 
          transition-all duration-200
          hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600
          hover:shadow-lg hover:shadow-red-100
          active:scale-95
          group min-w-[120px]
        "
      >
        <FilterX className="w-4 h-4" />
        <span>Clear Filters</span>
      </button>

    </div>
  </div>
</div>

   {/* Applications Container */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
  {loading ? (
    <LoadingSkeleton />
  ) : groupedApplications.length === 0 ? (
    <EmptyState />
  ) : (
  <>
  {/* 1. DESKTOP TABLE VIEW (Visible on md and up) */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full border-separate border-spacing-0">
      <thead>
        <tr className="bg-slate-50/80 sticky top-0 z-20 backdrop-blur-md">
          <th className="p-5 text-left border-b border-slate-200 w-16">
            <button 
              onClick={toggleSelectAll} 
              className="w-6 h-6 rounded-md border-2 border-slate-300 flex items-center justify-center transition-colors hover:border-indigo-500 bg-white"
            >
              {selectedApplications.size === filteredApplications.length ? (
                <CheckSquare className="w-5 h-5 text-indigo-600" />
              ) : (
                <Square className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </th>
          {columns.slice(1).map((column) => (
            <th 
              key={column.key} 
              className="p-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody className="divide-y divide-slate-100 bg-white">
        {groupedApplications.map((group) => (
          <Fragment key={`group-${group.label}`}>
            {/* Group Header Row */}
            <tr className="bg-slate-50/40">
              <td colSpan={columns.length} className="px-6 py-2 border-y border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {group.label}
                  </span>
                </div>
              </td>
            </tr>

            {/* Application Rows - Replaces TableRow to fix the Error */}
            {group.applications.map((application) => {
              const isSelected = selectedApplications.has(application.id);
              return (
                <tr 
                  key={application.id} 
                  className={`group transition-all duration-200 hover:bg-slate-50/80 ${
                    isSelected ? 'bg-indigo-50/40' : ''
                  }`}
                  onClick={() => toggleSelectApplication(application.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="p-5" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelectApplication(application.id)}>
                      {isSelected ? (
                        <CheckSquare className="w-6 h-6 text-indigo-600" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-200 group-hover:text-slate-400 transition-colors" />
                      )}
                    </button>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center font-bold text-lg border border-slate-200 shadow-sm">
                        {application.firstName[0]}{application.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-base leading-tight truncate">
                          {application.firstName} {application.lastName}
                        </h4>
                        <div className="flex items-center gap-1 text-slate-400 mt-1">
                          <Mail className="w-3 h-3" />
                          <span className="text-sm font-medium truncate">{application.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="inline-flex items-baseline gap-1 bg-slate-100 px-3 py-1 rounded-lg">
                      <span className="text-lg font-black text-slate-800">{application.kcpeMarks || 0}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pts</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="scale-105 origin-left">
                      {getStatusBadge(application.status)}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm font-bold text-slate-700">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDecisionModal(application)}
                        className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black tracking-widest rounded-lg hover:bg-indigo-600 transition-all active:scale-95"
                      >
                        REVIEW
                      </button>
                      <button
                        onClick={() => openDetailModal(application)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-black tracking-widest rounded-lg hover:bg-slate-50 transition-all active:scale-95"
                      >
                        VIEW
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Fragment>
        ))}
      </tbody>
    </table>
  </div>

  {/* 2. MOBILE CARD VIEW (Visible below md) */}
  <div className="md:hidden divide-y divide-slate-100 bg-white">
    {groupedApplications.map((group) => (
      <Fragment key={`mobile-group-${group.label}`}>
        <div className="bg-slate-50 px-5 py-3 border-y border-slate-100 flex items-center gap-2">
           <Calendar className="w-3 h-3 text-slate-400" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.label}</span>
        </div>
        {group.applications.map((application) => {
          const isSelected = selectedApplications.has(application.id);
          return (
            <div 
              key={application.id}
              className={`p-5 space-y-4 active:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50/50' : 'bg-white'}`}
              onClick={() => toggleSelectApplication(application.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSelectApplication(application.id); }}
                    className="w-6 h-6 flex items-center justify-center"
                  >
                    {isSelected ? <CheckSquare className="w-6 h-6 text-indigo-600" /> : <Square className="w-6 h-6 text-slate-200" />}
                  </button>
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-700 border border-slate-200 shadow-sm">
                    {application.firstName[0]}{application.lastName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base leading-tight">
                      {application.firstName} {application.lastName}
                    </h4>
                    <p className="text-sm text-slate-500 truncate max-w-[160px]">{application.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-800 leading-none">{application.kcpeMarks}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Marks</div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-slate-50">
                <div className="scale-110 origin-left">{getStatusBadge(application.status)}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {new Date(application.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); openDecisionModal(application); }}
                  className="w-full py-3 bg-slate-900 text-white text-[10px] font-black tracking-widest rounded-xl shadow-lg shadow-slate-200 active:scale-95 transition-transform"
                >
                  REVIEW
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); openDetailModal(application); }}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-600 text-[10px] font-black tracking-widest rounded-xl active:scale-95 transition-transform"
                >
                  VIEW
                </button>
              </div>
            </div>
          );
        })}
      </Fragment>
    ))}
  </div>

  {/* Mobile-Friendly Footer */}
  <div className="px-8 py-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
    <div className="flex items-center gap-6">
      <div className="text-sm font-bold text-slate-500">
        Results Found: <span className="text-indigo-600 font-black ml-1">{filteredApplications.length}</span>
      </div>
      <div className="h-4 w-px bg-slate-200 hidden md:block" />
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <div className={`w-2 h-2 rounded-full ${selectedApplications.size > 0 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />
        {selectedApplications.size} Selected
      </div>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-60">
      Application Registry System
    </div>
  </div>
</>
  )}
</div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal 
        application={selectedApplication} 
        open={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        open={showDeleteModal}
        onClose={() => !loadingStates.delete && setShowDeleteModal(false)}
        onConfirm={deleteApplications}
        type="bulk"
        count={selectedApplications.size}
        loading={loadingStates.delete}
      />

      {/* Decision Modal - Modern Design */}
      <ModernModal open={showDecisionModal} onClose={() => setShowDecisionModal(false)} maxWidth="860px">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Make Decision</h2>
                <p className="text-blue-100 opacity-90 text-sm">
                  {selectedApplication ? `${selectedApplication.firstName} ${selectedApplication.lastName}` : 'Select application'}
                </p>
              </div>
            </div>
            <button onClick={() => setShowDecisionModal(false)} className="p-1 rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

{/* Content */}
<div className="max-h-[calc(90vh-180px)] overflow-y-auto custom-scrollbar">
  <div className="p-6 space-y-8">
    
    {/* Decision Type Selection */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2.5">
        <Target className="text-indigo-600 w-5 h-5" />
        Action Required
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {decisionTypes.map((decision) => {
          const Icon = decision.icon;
          const isSelected = decisionType === decision.value;
          
          return (
            <button
              key={decision.value}
              onClick={() => setDecisionType(decision.value)}
              className={`group flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' 
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2.5 rounded-xl mb-3 transition-colors ${
                isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-base font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                {decision.label}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                {decision.value === 'ACCEPTED' ? 'Approve for enrollment' : 'Decline application'}
              </span>
            </button>
          );
        })}
      </div>
    </div>

    {/* Decision Details Container */}
    {decisionType && (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200 space-y-6">
          
          {decisionType === 'ACCEPTED' && (
            <div className="grid grid-cols-1 gap-6">
              {/* Admission Class - Increased Font & Padding */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Admission Class</label>
                <input
                  type="text"
                  value={decisionData.admissionClass}
                  onChange={(e) => setDecisionData({...decisionData, admissionClass: e.target.value})}
                  placeholder="e.g. Form 1A"
                  className="w-full text-md font-semibold px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base shadow-sm placeholder:text-slate-400"
                />
              </div>
              
              {/* Reporting Date */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Reporting Date</label>
                <div className="relative">
                  <ModernCalendar
                    value={decisionData.reportingDate}
                    onChange={(value) => setDecisionData({...decisionData, reportingDate: value})}
                    placeholder="Select start date"
                  />
                </div>
              </div>
            </div>
          )}
          
          {decisionType === 'REJECTED' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Rejection Reason</label>
              <textarea
                value={decisionData.rejectionReason}
                onChange={(e) => setDecisionData({...decisionData, rejectionReason: e.target.value})}
                placeholder="Briefly explain the decision..."
                className="w-full px-4 py-3.5 text-md font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base shadow-sm min-h-[120px]"
                rows={12}
              />
            </div>
          )}
          
          {/* Decision Notes - Increased rows and text size */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Internal Notes</label>
            <textarea
              value={decisionData.notes}
              onChange={(e) => setDecisionData({...decisionData, notes: e.target.value})}
              placeholder="Private notes for the administration team..."
              className="w-full px-4 py-3.5 text-md font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base shadow-sm min-h-[100px]"
              rows={12}
            />
          </div>
          
          {/* Email Notification - Modern Toggle Style */}
          <label className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <div className={`p-2 rounded-lg ${decisionData.sendEmail ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">Send Notification</p>
              <p className="text-xs text-slate-500">Applicant will receive an automated email</p>
            </div>
            <input
              type="checkbox"
              checked={decisionData.sendEmail}
              onChange={(e) => setDecisionData({...decisionData, sendEmail: e.target.checked})}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>
    )}
  </div>
</div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={updateApplicationStatus}
              disabled={!decisionType || loadingStates.decision}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingStates.decision ? (
                <span className="flex items-center justify-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </span>
              ) : (
                <span className="text-sm">Submit Decision</span>
              )}
            </button>
            <button
              onClick={() => setShowDecisionModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg transition-all duration-200 font-medium"
            >
              <span className="text-sm">Cancel</span>
            </button>
          </div>
        </div>
      </ModernModal>

{/* Bulk Decision Modal - Modern & Spacious Design */}
<ModernModal open={showBulkModal} onClose={() => setShowBulkModal(false)} maxWidth="700px">
  {/* Modern Header */}
  <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
    {/* Decorative background element */}
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
    
    <div className="flex items-center justify-between relative z-10">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
          <Users className="w-6 h-6 text-indigo-300" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bulk Decision</h2>
          <p className="text-slate-400 text-sm font-medium mt-0.5">
            Processing <span className="text-indigo-400">{selectedApplications.size}</span> application records
          </p>
        </div>
      </div>
      <button 
        onClick={() => setShowBulkModal(false)} 
        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  </div>

  {/* Floating Action Buttons - Always Visible & Accessible */}
  <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
    {/* Primary Action Button */}
    <button
      onClick={() => {/* Add your primary action */}}
      className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      title="Primary Action"
      aria-label="Primary Action"
    >
      <Check className="w-6 h-6" />
    </button>
    
    {/* Secondary Action Button */}
    <button
      onClick={() => {/* Add your secondary action */}}
      className="p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      title="Secondary Action"
      aria-label="Secondary Action"
    >
      <RefreshCw className="w-6 h-6" />
    </button>
    
    {/* Tertiary Action Button */}
    <button
      onClick={() => {/* Add your tertiary action */}}
      className="p-4 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      title="Tertiary Action"
      aria-label="Tertiary Action"
    >
      <AlertCircle className="w-6 h-6" />
    </button>
  </div>

  {/* Content Area - Increased Height & Spacing */}
  <div className="max-h-[75vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
    <div className="p-8 space-y-8">
      
      {/* Decision Type Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Select Action</h3>
        <div className="grid grid-cols-2 gap-4">
          {decisionTypes.slice(0, 4).map((decision) => {
            const Icon = decision.icon;
            const isSelected = bulkDecisionType === decision.value;
            
            return (
              <button
                key={decision.value}
                onClick={() => setBulkDecisionType(decision.value)}
                className={`group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                  isSelected 
                    ? 'border-indigo-600 bg-white shadow-md ring-4 ring-indigo-50' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-xl transition-all ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-base ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {decision.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Set all selected as {decision.label.toLowerCase()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Batch Details Section */}
      {bulkDecisionType && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Batch Configurations</h3>
              <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
                Action Required
              </div>
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Admin Context (Notes)</label>
              <textarea
                value={bulkDecisionData.notes}
                onChange={(e) => setBulkDecisionData({...bulkDecisionData, notes: e.target.value})}
                placeholder="Ex: Approved based on Q3 entrance exam results..."
                className="w-full px-5 py-4 text-md font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base transition-all min-h-[120px]"
                rows={12}
              />
            </div>

            {/* Email Toggle Card */}
            <label className="flex items-center gap-4 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-all group">
              <div className={`p-3 rounded-xl transition-all ${bulkDecisionData.sendEmail ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-200'}`}>
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-slate-800 group-hover:text-indigo-900">Send Notifications</p>
                <p className="text-sm text-slate-500">Broadcast updates to all selected email addresses</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${bulkDecisionData.sendEmail ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${bulkDecisionData.sendEmail ? 'left-7' : 'left-1'}`} />
                <input
                  type="checkbox"
                  className="hidden"
                  checked={bulkDecisionData.sendEmail}
                  onChange={(e) => setBulkDecisionData({...bulkDecisionData, sendEmail: e.target.checked})}
                />
              </div>
            </label>

            {/* Safety Notice */}
            <div className="flex items-start gap-4 p-5 bg-slate-900 rounded-2xl">
              <div className="bg-amber-400 p-2 rounded-lg">
                <AlertTriangle className="text-slate-900 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Security Review</p>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  You are about to modify <span className="text-white font-semibold">{selectedApplications.size}</span> records. Ensure the internal notes are accurate before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Footer Actions */}
  <div className="p-6 bg-white border-t border-slate-100 flex gap-4">
    <button
      onClick={() => setShowBulkModal(false)}
      className="flex-1 px-6 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl transition-all hover:bg-slate-50 hover:border-slate-200 font-bold text-base"
    >
      Cancel Action
    </button>
    <button
      onClick={updateBulkApplicationStatus}
      disabled={!bulkDecisionType || loadingStates.bulk}
      className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl transition-all font-bold text-base shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
    >
      {loadingStates.bulk ? (
        <span className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          Updating Records...
        </span>
      ) : (
        `Confirm & Process ${selectedApplications.size} Updates`
      )}
    </button>
  </div>
</ModernModal>
    </div>
  )
}