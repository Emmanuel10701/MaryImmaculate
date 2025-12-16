'use client';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import {
  Mail,
  Send,
  Edit,
  Trash2,
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
  FileUp,
  CheckSquare,
  Square,
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
  CheckCheck,
  Plus,
  Eye
} from 'lucide-react';

// Modern Modal Component
const ModernModal = ({ children, open, onClose, maxWidth = '800px' }) => {
  if (!open) return null;

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
  );
};

export default function ModernEmailCampaignsManager() {
  // Main State
  const [campaigns, setCampaigns] = useState([]);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // View States
  const [activeView, setActiveView] = useState('all');
  const [selectedCampaigns, setSelectedCampaigns] = useState(new Set());
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRecipientType, setFilterRecipientType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Campaign Form State
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    subject: '',
    content: '',
    recipientType: 'all',
    status: 'draft',
    recipients: []
  });
  
  // Loading States
  const [loadingStates, setLoadingStates] = useState({
    create: false,
    send: false,
    bulk: false,
    fetching: false
  });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    totalRecipients: 0,
    successRate: 0,
    openedRate: 0
  });
  
  // ==================== HELPER FUNCTIONS ====================
  
  // FIXED: Get recipient count with null check
  const getRecipientCount = useCallback((campaign) => {
    // First, check if the campaign object exists
    if (!campaign || typeof campaign !== 'object') return 0;
    
    // Then check for recipientCount property
    if (campaign.recipientCount !== undefined && campaign.recipientCount !== null) {
      return Number(campaign.recipientCount) || 0;
    }
    
    // Finally, fall back to string parsing
    if (typeof campaign.recipients === 'string' && campaign.recipients.trim()) {
      return campaign.recipients.split(',').filter(email => email.trim()).length;
    }
    
    return 0;
  }, []);
  
  // Get recipient emails based on type
  const getRecipientEmails = useCallback((recipientType) => {
    const getEmailList = (list) => 
      list
        .filter(email => email && typeof email === 'string' && email.trim() !== '')
        .map(email => email.trim());
    
    switch (recipientType) {
      case 'parents':
        return getEmailList(students.map(s => s.parentEmail));
      case 'teachers':
        const teachers = staff.filter(s => 
          s.role === 'Teacher' || 
          ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Sports'].includes(s.department)
        );
        return getEmailList(teachers.map(s => s.email));
      case 'administration':
        const admins = staff.filter(s => 
          s.role === 'Principal' || 
          s.role === 'Deputy Principal' ||
          s.department === 'Administration'
        );
        return getEmailList(admins.map(s => s.email));
      case 'bom':
        const bom = staff.filter(s => 
          s.role === 'BOM Member' || 
          (s.position && s.position.toLowerCase().includes('board'))
        );
        return getEmailList(bom.map(s => s.email));
      case 'support':
        const support = staff.filter(s => 
          s.role === 'Support Staff' || 
          s.role === 'Librarian' || 
          s.role === 'Counselor'
        );
        return getEmailList(support.map(s => s.email));
      case 'staff':
        return getEmailList(staff.map(s => s.email));
      case 'all':
      default:
        return [
          ...getEmailList(students.map(s => s.parentEmail)),
          ...getEmailList(staff.map(s => s.email))
        ];
    }
  }, [students, staff]);
  
  // Recipient groups (mapped similar to your applications)
  const recipientGroups = useMemo(() => {
    const getParentEmails = () => 
      students.filter(s => s.parentEmail && typeof s.parentEmail === 'string' && s.parentEmail.trim() !== '').length;

    const getTeachingStaffCount = () => 
      staff.filter(s => 
        s.role === 'Teacher' || 
        ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Sports'].includes(s.department)
      ).length;

    const getAdminStaffCount = () => 
      staff.filter(s => 
        s.role === 'Principal' || 
        s.role === 'Deputy Principal' ||
        s.department === 'Administration'
      ).length;

    const getBOMCount = () => 
      staff.filter(s => 
        s.role === 'BOM Member' || 
        (s.position && s.position.toLowerCase().includes('board'))
      ).length;

    const getSupportStaffCount = () => 
      staff.filter(s => 
        s.role === 'Support Staff' || 
        s.role === 'Librarian' || 
        s.role === 'Counselor'
      ).length;

    const getAllStaffCount = () => 
      staff.filter(s => s.email && typeof s.email === 'string' && s.email.trim() !== '').length;

    const calculateTotalRecipients = () => 
      getParentEmails() + getAllStaffCount();

    return [
      { 
        value: 'all', 
        label: 'All Recipients', 
        count: calculateTotalRecipients(),
        color: 'from-blue-500 to-cyan-500',
        icon: Users
      },
      { 
        value: 'parents', 
        label: 'Parents Only', 
        count: getParentEmails(),
        color: 'from-green-500 to-emerald-500',
        icon: Users
      },
      { 
        value: 'teachers', 
        label: 'Teaching Staff', 
        count: getTeachingStaffCount(),
        color: 'from-purple-500 to-pink-500',
        icon: GraduationCap
      },
      { 
        value: 'administration', 
        label: 'Administration', 
        count: getAdminStaffCount(),
        color: 'from-orange-500 to-amber-500',
        icon: Award
      },
      { 
        value: 'bom', 
        label: 'Board of Management', 
        count: getBOMCount(),
        color: 'from-red-500 to-rose-500',
        icon: ShieldCheck
      },
      { 
        value: 'support', 
        label: 'Support Staff', 
        count: getSupportStaffCount(),
        color: 'from-indigo-500 to-violet-500',
        icon: Users
      },
      { 
        value: 'staff', 
        label: 'All Staff', 
        count: getAllStaffCount(),
        color: 'from-cyan-500 to-blue-500',
        icon: Users
      }
    ];
  }, [students, staff]);
  
  // Status options (mapped like your applications)
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    { value: 'published', label: 'Sent', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CalendarDays }
  ];
  
  // Table columns
  const columns = [
    { key: 'select', label: '', width: 'w-12' },
    { key: 'title', label: 'Campaign', width: 'w-48' },
    { key: 'subject', label: 'Subject', width: 'w-48' },
    { key: 'recipientType', label: 'Recipient Group', width: 'w-32' },
    { key: 'recipientCount', label: 'Recipients', width: 'w-28' },
    { key: 'status', label: 'Status', width: 'w-36' },
    { key: 'sentAt', label: 'Date Sent', width: 'w-36' },
    { key: 'actions', label: 'Actions', width: 'w-24' }
  ];
  
  // ==================== DATA FETCHING ====================
  
  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, fetching: true }));
      setRefreshing(true);
      
      const [campaignsRes, studentRes, staffRes] = await Promise.all([
        fetch('/api/emails'),
        fetch('/api/student'),
        fetch('/api/staff')
      ]);
      
      const campaignsData = await campaignsRes.json();
      const studentData = await studentRes.json();
      const staffData = await staffRes.json();
      
      if (campaignsData.success) {
        const campaignsList = campaignsData.campaigns || [];
        setCampaigns(campaignsList);
        updateStats(campaignsList);
        if (refreshing) {
          toast.success(`Refreshed ${campaignsList.length} campaigns`);
        }
      }
      
      if (studentData.success) {
        setStudents(studentData.students || studentData.data || []);
      }
      
      if (staffData.success) {
        setStaff(staffData.staff || staffData.data || []);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Network error. Please check connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingStates(prev => ({ ...prev, fetching: false }));
    }
  }, [refreshing]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const updateStats = (campaignsList) => {
    const newStats = {
      total: campaignsList.length,
      draft: 0,
      sent: 0,
      totalRecipients: 0,
      successRate: 0,
      openedRate: 0
    };
    
    campaignsList.forEach(campaign => {
      if (campaign.status === 'draft') newStats.draft++;
      if (campaign.status === 'published') newStats.sent++;
      
      // Calculate recipient count using the fixed helper
      const count = getRecipientCount(campaign);
      newStats.totalRecipients += count;
      
      // Calculate success rate
      if (campaign.successRate) {
        newStats.successRate += campaign.successRate;
      }
    });
    
    // Average success rate
    if (newStats.sent > 0) {
      newStats.successRate = Math.round(newStats.successRate / newStats.sent);
    }
    
    setStats(newStats);
  };
  
  // ==================== FILTERING & SORTING ====================
  
  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    if (!Array.isArray(campaigns)) return [];
    
    return campaigns
      .filter(campaign => {
        if (!campaign || typeof campaign !== 'object') return false;
        
        const matchesSearch = 
          (campaign.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (campaign.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
        const matchesRecipientType = filterRecipientType === 'all' || campaign.recipientType === filterRecipientType;
        
        let matchesDate = true;
        if (startDate || endDate) {
          const campaignDate = new Date(campaign.sentAt || campaign.createdAt);
          if (startDate) {
            const start = new Date(startDate);
            if (campaignDate < start) matchesDate = false;
          }
          if (endDate) {
            const end = new Date(endDate);
            if (campaignDate > end) matchesDate = false;
          }
        }
        
        let matchesView = true;
        if (activeView === 'draft') {
          matchesView = campaign.status === 'draft';
        } else if (activeView === 'sent') {
          matchesView = campaign.status === 'published';
        }
        
        return matchesSearch && matchesStatus && matchesRecipientType && matchesDate && matchesView;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.sentAt || b.createdAt || 0) - new Date(a.sentAt || a.createdAt || 0);
          case 'oldest':
            return new Date(a.sentAt || a.createdAt || 0) - new Date(b.sentAt || b.createdAt || 0);
          case 'title-asc':
            return (a.title || '').localeCompare(b.title || '');
          case 'title-desc':
            return (b.title || '').localeCompare(a.title || '');
          case 'recipients-high':
            return getRecipientCount(b) - getRecipientCount(a);
          case 'recipients-low':
            return getRecipientCount(a) - getRecipientCount(b);
          default:
            return 0;
        }
      });
  }, [campaigns, searchTerm, filterStatus, filterRecipientType, startDate, endDate, activeView, sortBy, getRecipientCount]);
  
  // ==================== SELECTION HANDLERS ====================
  
  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedCampaigns.size === filteredCampaigns.length) {
      setSelectedCampaigns(new Set());
    } else {
      const allIds = new Set(filteredCampaigns.map(campaign => campaign.id).filter(Boolean));
      setSelectedCampaigns(allIds);
    }
  };
  
  const toggleSelectCampaign = (id) => {
    if (!id) return;
    const newSelection = new Set(selectedCampaigns);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedCampaigns(newSelection);
  };
  
  // ==================== UI HELPERS ====================
  
  // Get status badge (similar to applications)
  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    if (!statusConfig) return null;
    
    const Icon = statusConfig.icon || CheckCircle2;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
        <Icon className="w-3 h-3" />
        {statusConfig.label}
      </span>
    );
  };
  
  // Get recipient group badge
  const getRecipientGroupBadge = (groupValue) => {
    const group = recipientGroups.find(g => g.value === groupValue) || recipientGroups[0];
    const Icon = group.icon || Users;
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border border-blue-200">
        <Icon className="w-3 h-3" />
        {group.label}
      </span>
    );
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };
  
  // ==================== CAMPAIGN OPERATIONS ====================
  
  // Open create modal
  const openCreateModal = () => {
    setCampaignForm({
      title: '',
      subject: '',
      content: '',
      recipientType: 'all',
      status: 'draft',
      recipients: []
    });
    setSelectedCampaign(null);
    setShowCreateModal(true);
  };
  
  // Open edit modal
  const openEditModal = (campaign) => {
    if (!campaign) return;
    
    setCampaignForm({
      title: campaign.title || '',
      subject: campaign.subject || '',
      content: campaign.content || '',
      recipientType: campaign.recipientType || 'all',
      status: campaign.status || 'draft',
      recipients: []
    });
    setSelectedCampaign(campaign);
    setShowCreateModal(true);
  };
  
  // Open detail modal
  const openDetailModal = (campaign) => {
    if (!campaign) return;
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };
  
  // FIXED: Create or update campaign WITHOUT auto-refresh
  const handleCreateOrUpdateCampaign = async () => {
    if (!campaignForm.title || !campaignForm.subject || !campaignForm.content) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setLoadingStates(prev => ({ ...prev, create: true }));
      
      const recipientEmails = getRecipientEmails(campaignForm.recipientType);
      
      if (recipientEmails.length === 0) {
        toast.error('No recipients found for the selected group');
        setLoadingStates(prev => ({ ...prev, create: false }));
        return;
      }
      
      const campaignData = {
        title: campaignForm.title.trim(),
        subject: campaignForm.subject.trim(),
        content: campaignForm.content,
        recipients: recipientEmails.join(', '),
        status: campaignForm.status,
        recipientType: campaignForm.recipientType,
        recipientCount: recipientEmails.length
      };
      
      const url = selectedCampaign 
        ? `/api/emails/${selectedCampaign.id}`
        : '/api/emails';
      
      const method = selectedCampaign ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // FIXED: Update local state instead of refreshing all data
        if (selectedCampaign) {
          // Update existing campaign in the list
          setCampaigns(prev => prev.map(c => 
            c.id === selectedCampaign.id ? result.campaign : c
          ));
        } else {
          // Add new campaign to the beginning of the list
          setCampaigns(prev => [result.campaign, ...prev]);
        }
        
        setShowCreateModal(false);
        setSelectedCampaign(null);
        
        // Clear form after success
        setCampaignForm({
          title: '',
          subject: '',
          content: '',
          recipientType: 'all',
          status: 'draft',
          recipients: []
        });
        
        if (campaignForm.status === 'published' && result.emailResults?.summary?.successful > 0) {
          toast.success(`Campaign created and ${result.emailResults.summary.successful} emails sent successfully!`);
        } else {
          toast.success(`Campaign ${selectedCampaign ? 'updated' : 'created'} successfully!`);
        }
      } else {
        toast.error(result.error || `Failed to ${selectedCampaign ? 'update' : 'create'} campaign`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, create: false }));
    }
  };
  
  // Send campaign
  const handleSendCampaign = async (campaign) => {
    if (!campaign) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, send: true }));
      
      const recipientCount = getRecipientCount(campaign);
      
      if (!window.confirm(`Send this campaign to ${recipientCount} recipients?`)) {
        setLoadingStates(prev => ({ ...prev, send: false }));
        return;
      }
      
      const response = await fetch(`/api/emails/${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state instead of refreshing all data
        setCampaigns(prev => prev.map(c => 
          c.id === campaign.id ? { ...c, status: 'published', sentAt: new Date().toISOString() } : c
        ));
        
        if (result.emailResults?.summary?.successful > 0) {
          toast.success(`Campaign sent to ${result.emailResults.summary.successful} recipients successfully!`);
        } else {
          toast.warning('Campaign sent but no emails were delivered');
        }
      } else {
        toast.error(result.error || 'Failed to send campaign');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, send: false }));
    }
  };
  
  // Delete campaign
  const handleDeleteCampaign = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      const response = await fetch(`/api/emails/${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        // Update local state instead of refreshing all data
        setCampaigns(prev => prev.filter(c => c.id !== id));
        setSelectedCampaigns(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success('Campaign deleted successfully!');
      } else {
        toast.error(result.error || 'Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error. Please try again.');
    }
  };
  
  // Bulk delete campaigns
  const handleBulkDelete = async () => {
    if (selectedCampaigns.size === 0) {
      toast.error('Please select campaigns to delete');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedCampaigns.size} campaign(s)?`)) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, bulk: true }));
      
      const deletePromises = Array.from(selectedCampaigns).map(id =>
        fetch(`/api/emails/${id}`, { method: 'DELETE' })
      );
      
      const results = await Promise.allSettled(deletePromises);
      
      const successfulDeletes = results.filter(result => 
        result.status === 'fulfilled' && result.value.ok
      );
      
      if (successfulDeletes.length > 0) {
        // Update local state instead of refreshing all data
        setCampaigns(prev => prev.filter(c => !selectedCampaigns.has(c.id)));
        setSelectedCampaigns(new Set());
        toast.success(`${successfulDeletes.length} campaign(s) deleted successfully!`);
      } else {
        toast.error('Failed to delete campaigns');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, bulk: false }));
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterRecipientType('all');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
  };
  
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <Mail className="text-white text-lg w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent">
                Email Campaign Manager
              </h1>
              <p className="text-gray-600 mt-1">Create and manage email campaigns for school communication</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 flex-wrap">
          <button
            onClick={fetchData}
            disabled={refreshing || loadingStates.fetching}
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-xs border border-gray-200 font-medium disabled:opacity-50 text-sm md:text-base"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-lg font-medium text-sm md:text-base"
          >
            <Plus className="w-4 h-4" />
            New Campaign
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
          <Mail className="w-4 h-4" />
          All ({stats.total})
        </button>
        <button
          onClick={() => setActiveView('draft')}
          className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
            activeView === 'draft'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Draft ({stats.draft})
        </button>
        <button
          onClick={() => setActiveView('sent')}
          className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
            activeView === 'sent'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Sent ({stats.sent})
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total Campaigns', value: stats.total, icon: Mail, color: 'blue' },
          { label: 'Draft', value: stats.draft, icon: Clock, color: 'yellow' },
          { label: 'Sent', value: stats.sent, icon: CheckCircle2, color: 'emerald' },
          { label: 'Total Recipients', value: stats.totalRecipients, icon: Users, color: 'purple' },
          { label: 'Opened Rate', value: `${stats.openedRate}%`, icon: BarChart3, color: 'cyan' }
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
      {selectedCampaigns.size > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {selectedCampaigns.size} selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedCampaigns(new Set())}
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
              placeholder="Search campaigns..."
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
              value={filterRecipientType}
              onChange={(e) => setFilterRecipientType(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Groups</option>
              {recipientGroups.map(group => (
                <option key={group.value} value={group.value}>{group.label}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="From"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="recipients-high">Most Recipients</option>
              <option value="recipients-low">Fewest Recipients</option>
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

      {/* Campaigns Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden">
        {loading ? (
          <LoadingSkeleton />
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="text-gray-400 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Campaigns Found</h3>
            <p className="text-gray-600 mb-6">
              {activeView === 'draft' 
                ? 'No draft campaigns found'
                : activeView === 'sent'
                ? 'No sent campaigns found'
                : 'No campaigns match your filters'
              }
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl transition-all duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Your First Campaign
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
            {selectedCampaigns.size === filteredCampaigns.length && filteredCampaigns.length > 0 ? (
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
      {filteredCampaigns.map((campaign) => {
        if (!campaign || !campaign.id) return null;
        
        const recipientCount = getRecipientCount(campaign);
        const isSelected = selectedCampaigns.has(campaign.id);
        
        return (
          <tr 
            key={campaign.id} 
            className={`transition-colors duration-150 ${isSelected ? 'bg-blue-50/50' : ''}`}
            onClick={() => toggleSelectCampaign(campaign.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* Select checkbox */}
            <td className="p-4" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleSelectCampaign(campaign.id)}
                className="p-1.5 rounded-full"
              >
                {isSelected ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </td>
            
            {/* Campaign */}
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Mail className="text-white w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900 truncate text-sm">
                    {campaign.title || 'Untitled Campaign'}
                  </h4>
                  <div className="text-xs text-gray-500 truncate">
                    Subject: {campaign.subject || 'No subject'}
                  </div>
                </div>
              </div>
            </td>
            
            {/* Subject */}
            <td className="p-4">
              <span className="text-sm text-gray-700 truncate block max-w-xs">
                {campaign.subject || 'No subject'}
              </span>
            </td>
            
            {/* Recipient Group */}
            <td className="p-4">
              {getRecipientGroupBadge(campaign.recipientType)}
            </td>
            
            {/* Recipients */}
            <td className="p-4">
              <div className="text-center">
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm">
                  <span className="font-bold">{recipientCount}</span>
                  <span className="text-xs ml-1">recipients</span>
                </button>
              </div>
            </td>
            
            {/* Status */}
            <td className="p-4">
              (campaign.status)
            </td>
            
            {/* Date Sent */}
            <td className="p-4">
              <div className="text-xs text-gray-600 flex items-center gap-2">
                <CalendarDays className="w-3 h-3" />
                {formatDate(campaign.sentAt || campaign.createdAt)}
              </div>
            </td>
            
            {/* Actions */}
            <td className="p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openDetailModal(campaign)}
                  className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full transition-colors hover:opacity-90"
                >
                  view
                </button>
                
                <button
                  onClick={() => openEditModal(campaign)}
                  className="px-2.5 py-1 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full transition-colors hover:opacity-90"
                >
                  edit
                </button>
                
                {campaign.status === 'draft' && (
                  <button
                    onClick={() => handleSendCampaign(campaign)}
                    disabled={loadingStates.send}
                    className="px-2.5 py-1 text-xs bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full transition-colors hover:opacity-90 disabled:opacity-50"
                  >
                    send
                  </button>
                )}
                
                <button
                  onClick={() => handleDeleteCampaign(campaign.id)}
                  className="px-2.5 py-1 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full transition-colors hover:opacity-90"
                >
                  delete
                </button>
              </div>
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
</div>
            
            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredCampaigns.length}</span> of{' '}
                  <span className="font-semibold">{campaigns.length}</span> campaigns
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedCampaigns.size === 0}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected ({selectedCampaigns.size})
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Campaign Detail Modal */}
      <ModernModal open={showDetailModal} onClose={() => setShowDetailModal(false)} maxWidth="800px">
        {selectedCampaign && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Campaign Details</h2>
                    <p className="text-blue-100 opacity-90 text-sm">
                      {selectedCampaign.title}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-1 rounded-lg cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(85vh-150px)] overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Campaign Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-2">Campaign Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {getStatusBadge(selectedCampaign.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipient Group:</span>
                        <span className="font-bold">{selectedCampaign.recipientType || 'All'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipients:</span>
                        <span className="font-bold">{getRecipientCount(selectedCampaign)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-bold">{formatDate(selectedCampaign.createdAt)}</span>
                      </div>
                      {selectedCampaign.sentAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sent:</span>
                          <span className="font-bold">{formatDate(selectedCampaign.sentAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <h3 className="font-bold text-gray-900 mb-2">Performance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className={`font-bold ${(selectedCampaign.successRate || 0) >= 80 ? 'text-emerald-600' : (selectedCampaign.successRate || 0) >= 50 ? 'text-blue-600' : 'text-amber-600'}`}>
                          {selectedCampaign.successRate || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Emails Sent:</span>
                        <span className="font-bold">{selectedCampaign.sentCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Failed:</span>
                        <span className="font-bold">{selectedCampaign.failedCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subject */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Subject</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">{selectedCampaign.subject}</p>
                  </div>
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Content</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
                    <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm">
                      {selectedCampaign.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditModal(selectedCampaign);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium"
                >
                  Edit Campaign
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg transition-all duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </ModernModal>

      {/* Create/Edit Campaign Modal */}
      <ModernModal open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="700px">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                {selectedCampaign ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                </h2>
                <p className="text-emerald-100 opacity-90 text-sm">
                  {selectedCampaign ? 'Update your campaign details' : 'Create a new email campaign'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateModal(false)} 
              className="p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(85vh-150px)] overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Campaign Title *</label>
              <input
                type="text"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                placeholder="Enter campaign title"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Subject */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Email Subject *</label>
              <input
                type="text"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
                placeholder="Enter email subject"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Recipient Group */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Recipient Group *</label>
              <select 
                value={campaignForm.recipientType}
                onChange={(e) => setCampaignForm({...campaignForm, recipientType: e.target.value})}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                {recipientGroups.map(group => (
                  <option key={group.value} value={group.value}>
                    {group.label} ({group.count} recipients)
                  </option>
                ))}
              </select>
            </div>
            
            {/* Content */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Email Content *</label>
              <textarea
                value={campaignForm.content}
                onChange={(e) => setCampaignForm({...campaignForm, content: e.target.value})}
                placeholder="Write your email content here..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                rows="8"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {campaignForm.content.length} characters
              </div>
            </div>
            
            {/* Status */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={campaignForm.status === 'draft'}
                  onChange={(e) => setCampaignForm({...campaignForm, status: e.target.checked ? 'draft' : 'published'})}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Save as Draft
                </span>
              </label>
              <div className="text-xs text-gray-500">
                {campaignForm.status === 'draft' 
                  ? 'Campaign will be saved as draft' 
                  : 'Campaign will be sent immediately'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={handleCreateOrUpdateCampaign}
              disabled={loadingStates.create}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingStates.create ? (
                <span className="flex items-center justify-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </span>
              ) : (
                <span className="text-sm">
                  {selectedCampaign ? 'Update Campaign' : campaignForm.status === 'draft' ? 'Save Draft' : 'Send Campaign'}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg transition-all duration-200 font-medium"
            >
              <span className="text-sm">Cancel</span>
            </button>
          </div>
        </div>
      </ModernModal>
    </div>
  );
}