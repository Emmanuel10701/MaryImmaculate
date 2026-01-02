'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Toaster, toast } from 'sonner'
import {
  User,
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
  const [showDetailSidebar, setShowDetailSidebar] = useState(false)
  
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
    bulk: false
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
    { key: 'applicationNumber', label: 'Application #', width: 'w-32' },
    { key: 'kcpeMarks', label: 'KCPE Score', width: 'w-28' },
    { key: 'preferredStream', label: 'Stream', width: 'w-28' },
    { key: 'status', label: 'Status', width: 'w-36' },
    { key: 'submitted', label: 'Submitted', width: 'w-36' },
    { key: 'score', label: 'Score', width: 'w-28' },
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
    if (selectedApplications.size === 0) {
      toast.error('Please select applications to delete')
      return
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedApplications.size} application(s)? This action cannot be undone.`)) {
      return
    }
    
    try {
      const deletes = Array.from(selectedApplications).map(async (applicationId) => {
        return fetch(`/api/applyadmission/${applicationId}`, {
          method: 'DELETE'
        })
      })
      
      const responses = await Promise.all(deletes)
      const results = await Promise.all(responses.map(res => res.json()))
      
      const allSuccess = results.every(result => result.success)
      
      if (allSuccess) {
        toast.success(`Deleted ${selectedApplications.size} application(s)`)
        
        // Update local state
        const updatedApplications = applications.filter(app => !selectedApplications.has(app.id))
        setApplications(updatedApplications)
        updateStats(updatedApplications)
        setSelectedApplications(new Set())
      } else {
        toast.error('Some deletions failed')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Network error. Please try again.')
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
  
  // Reset filters
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <GraduationCap className="text-white text-lg w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent">
                Admissions Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage and review student applications</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 flex-wrap">
          <button
            onClick={fetchApplications}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-xs border border-gray-200 font-medium disabled:opacity-50 text-sm md:text-base"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={exportApplications}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-lg font-medium text-sm md:text-base"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveView('all')}
          className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
            activeView === 'all'
              ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          All ({stats.total})
        </button>
        <button
          onClick={() => setActiveView('pending')}
          className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
            activeView === 'pending'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending ({stats.pending + stats.underReview})
        </button>
        <button
          onClick={() => setActiveView('decided')}
          className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
            activeView === 'decided'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Decided ({stats.total - (stats.pending + stats.underReview)})
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: Users, color: 'blue' },
          { label: 'Pending', value: stats.pending + stats.underReview, icon: Clock, color: 'yellow' },
          { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'emerald' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'rose' },
          { label: 'Interview', value: stats.interviewScheduled + stats.interviewed, icon: UserCheck, color: 'purple' },
          { label: 'Decision Rate', value: `${stats.decisionRate}%`, icon: Percent, color: 'indigo' }
        ].map((stat, index) => (
          <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
              </div>
              <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600 text-base w-5 h-5`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selection Actions Bar */}
      {selectedApplications.size > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {selectedApplications.size} selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openBulkModal('ACCEPTED')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => openBulkModal('REJECTED')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => openBulkModal()}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  Update
                </button>
                <button
                  onClick={deleteApplications}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedApplications(new Set())}
              className="text-gray-500 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            
            <select 
              value={filterStream}
              onChange={(e) => setFilterStream(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Streams</option>
              {streams.map(stream => (
                <option key={stream.value} value={stream.value}>{stream.label}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <ModernCalendar
                value={startDate}
                onChange={setStartDate}
                placeholder="From"
              />
              <ModernCalendar
                value={endDate}
                onChange={setEndDate}
                placeholder="To"
              />
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="score-high">Highest Score</option>
              <option value="score-low">Lowest Score</option>
            </select>
            
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700"
            >
              <FilterX className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden">
        {loading ? (
          <LoadingSkeleton />
        ) : groupedApplications.length === 0 ? (
          <div className="text-center py-16">
            <Users className="text-gray-400 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6">
              {activeView === 'pending' 
                ? 'No pending applications to review'
                : activeView === 'decided'
                ? 'No decisions have been made yet'
                : 'No applications match your filters'
              }
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl transition-all duration-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <th className="p-4 text-left">
                      <button
                        onClick={toggleSelectAll}
                        className="p-1.5 rounded"
                      >
                        {selectedApplications.size === filteredApplications.length ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    {columns.slice(1).map((column) => (
                      <th key={column.key} className={`p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.width}`}>
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groupedApplications.map((group) => (
                    <>
                      {/* Date Group Header */}
                      <DateGroupHeader key={`group-${group.label}`} dateLabel={group.label} />
                      
                      {/* Group Applications */}
                      {group.applications.map((application) => {
                        const score = getApplicationScore(application)
                        const isSelected = selectedApplications.has(application.id)
                        
                        return (
                          <tr 
                            key={application.id} 
                            className={`transition-colors duration-150 ${isSelected ? 'bg-blue-50/50' : ''}`}
                            onClick={() => toggleSelectApplication(application.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* Select checkbox */}
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => toggleSelectApplication(application.id)}
                                className="p-1.5 rounded-full"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </td>
                            
                            {/* Applicant */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                  <User className="text-white w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate text-sm">
                                    {application.firstName} {application.lastName}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail className="w-3 h-3" />
                                    <span className="truncate">{application.email}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            {/* Application Number */}
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                <Hash className="w-3 h-3" />
                                {application.applicationNumber.substring(0, 8)}...
                              </span>
                            </td>
                            
                            {/* KCPE Score */}
                            <td className="p-4">
                              <div className="text-center">
                                <span className="text-base font-bold text-gray-900">{application.kcpeMarks || 0}</span>
                                <span className="text-xs text-gray-500 ml-1">/500</span>
                              </div>
                            </td>
                            
                            {/* Stream */}
                            <td className="p-4">
                              {getStreamBadge(application.preferredStream)}
                            </td>
                            
                            {/* Status */}
                            <td className="p-4">
                              {getStatusBadge(application.status)}
                            </td>
                            
                            {/* Submitted */}
                            <td className="p-4">
                              <div className="text-xs text-gray-600 flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {formatDate(application.createdAt)}
                              </div>
                            </td>
                            
                            {/* Score */}
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-12">
                                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-500' : score >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                                      style={{ width: `${score}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <span className={`text-xs font-bold ${score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-blue-700' : 'text-amber-700'}`}>
                                  {score}
                                </span>
                              </div>
                            </td>
                            
                            {/* Actions */}
                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openDecisionModal(application)}
                                  className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full transition-colors"
                                  title="Make Decision"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setSelectedApplication(application)
                                    setShowDetailSidebar(true)
                                  }}
                                  className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredApplications.length}</span> of{' '}
                  <span className="font-semibold">{applications.length}</span> applications
                  <span className="ml-3 text-gray-500">
                    • Organized by {groupedApplications.length} date groups
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const emailIds = filteredApplications.map(app => app.email).filter(Boolean).join(',')
                      if (emailIds) {
                        window.location.href = `mailto:?bcc=${emailIds}`
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700"
                    disabled={filteredApplications.length === 0}
                  >
                    <Mail className="w-4 h-4" />
                    Email All
                  </button>
                  <button
                    onClick={exportApplications}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700"
                  >
                    <Download className="w-4 h-4" />
                    Export List
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Decision Modal - Modern Design */}
      <ModernModal open={showDecisionModal} onClose={() => setShowDecisionModal(false)} maxWidth="700px">
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
        <div className="max-h-[calc(85vh-150px)] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Decision Type Selection */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Target className="text-blue-600 w-4 h-4" />
                Decision Type
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {decisionTypes.map((decision) => {
                  const Icon = decision.icon
                  const isSelected = decisionType === decision.value
                  
                  return (
                    <button
                      key={decision.value}
                      onClick={() => setDecisionType(decision.value)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${isSelected ? decision.color : 'bg-gray-100'}`}>
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{decision.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Decision Details */}
            {decisionType && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Details</h3>
                  
                  {decisionType === 'ACCEPTED' && (
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">Assigned Stream</label>
                        <select 
                          value={decisionData.assignedStream}
                          onChange={(e) => setDecisionData({...decisionData, assignedStream: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Select Stream</option>
                          {streams.map(stream => (
                            <option key={stream.value} value={stream.value}>{stream.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">Admission Class</label>
                        <input
                          type="text"
                          value={decisionData.admissionClass}
                          onChange={(e) => setDecisionData({...decisionData, admissionClass: e.target.value})}
                          placeholder="Form 1A"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">Reporting Date</label>
                        <ModernCalendar
                          value={decisionData.reportingDate}
                          onChange={(value) => setDecisionData({...decisionData, reportingDate: value})}
                          placeholder="Select date"
                        />
                      </div>
                    </div>
                  )}
                  
                  {decisionType === 'REJECTED' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">Reason</label>
                      <textarea
                        value={decisionData.rejectionReason}
                        onChange={(e) => setDecisionData({...decisionData, rejectionReason: e.target.value})}
                        placeholder="Enter reason..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        rows="2"
                      />
                    </div>
                  )}
                  
                  {/* Decision Notes */}
                  <div className="mt-3">
                    <label className="block text-xs font-bold text-gray-800 mb-1">Notes</label>
                    <textarea
                      value={decisionData.notes}
                      onChange={(e) => setDecisionData({...decisionData, notes: e.target.value})}
                      placeholder="Add notes..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      rows="2"
                    />
                  </div>
                  
                  {/* Email Notification */}
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mt-3">
                    <Mail className="text-blue-600 w-4 h-4" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sendEmail"
                          checked={decisionData.sendEmail}
                          onChange={(e) => setDecisionData({...decisionData, sendEmail: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="sendEmail" className="text-xs font-medium text-gray-700">
                          Send email notification
                        </label>
                      </div>
                    </div>
                  </div>
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

      {/* Bulk Decision Modal - Modern Design */}
      <ModernModal open={showBulkModal} onClose={() => setShowBulkModal(false)} maxWidth="600px">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Bulk Decision</h2>
                <p className="text-blue-100 opacity-90 text-sm">
                  {selectedApplications.size} selected applications
                </p>
              </div>
            </div>
            <button onClick={() => setShowBulkModal(false)} className="p-1 rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(85vh-150px)] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Decision Type Selection */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">Decision Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {decisionTypes.slice(0, 4).map((decision) => {
                  const Icon = decision.icon
                  const isSelected = bulkDecisionType === decision.value
                  
                  return (
                    <button
                      key={decision.value}
                      onClick={() => setBulkDecisionType(decision.value)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${isSelected ? decision.color : 'bg-gray-100'}`}>
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{decision.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Bulk Decision Details */}
            {bulkDecisionType && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Details</h3>
                  
                  {/* Decision Notes */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">Notes</label>
                    <textarea
                      value={bulkDecisionData.notes}
                      onChange={(e) => setBulkDecisionData({...bulkDecisionData, notes: e.target.value})}
                      placeholder="Add notes..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      rows="2"
                    />
                  </div>
                  
                  {/* Email Notification */}
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg mt-3">
                    <Mail className="text-purple-600 w-4 h-4" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="bulkSendEmail"
                          checked={bulkDecisionData.sendEmail}
                          onChange={(e) => setBulkDecisionData({...bulkDecisionData, sendEmail: e.target.checked})}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="bulkSendEmail" className="text-xs font-medium text-gray-700">
                          Send email notifications
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Warning */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mt-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="text-amber-600 w-4 h-4 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-800">Notice</p>
                        <p className="text-xs text-amber-700 mt-1">
                          This will update {selectedApplications.size} applications.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={updateBulkApplicationStatus}
              disabled={!bulkDecisionType || loadingStates.bulk}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingStates.bulk ? (
                <span className="flex items-center justify-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </span>
              ) : (
                <span className="text-sm">Apply to {selectedApplications.size} Selected</span>
              )}
            </button>
            <button
              onClick={() => setShowBulkModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg transition-all duration-200 font-medium"
            >
              <span className="text-sm">Cancel</span>
            </button>
          </div>
        </div>
      </ModernModal>
    </div>
  )
}