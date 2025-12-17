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

// Modern Scrollbar Styles
const modernScrollbarStyles = `
  .modern-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
  }
  
  .modern-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
`;

// Confirmation Modal Component
const ConfirmationModal = ({ 
  open, 
  onClose, 
  title, 
  message, 
  confirmText = "Delete", 
  cancelText = "Cancel",
  onConfirm,
  isDanger = true,
  loading = false
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${isDanger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium transition-colors hover:bg-gray-50"
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium transition-all ${
                isDanger 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  sending...
                </span>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Modal Component with modern scrollbar
const ModernModal = ({ children, open, onClose, maxWidth = '800px' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <style>{modernScrollbarStyles}</style>
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

// Modern Campaign Card Component
const CampaignCard = ({ 
  campaign, 
  isSelected, 
  onSelect, 
  onView, 
  onEdit, 
  onSend, 
  onDelete,
  loadingStates
}) => {
  const recipientCount = campaign.recipients ? campaign.recipients.split(',').length : 0;
  
  const getStatusBadge = (status) => {
    if (status === 'published') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100/80 backdrop-blur-sm text-emerald-800 border border-emerald-200/50 shadow-xs">
          <CheckCircle2 className="w-3 h-3" />
          Sent
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100/80 backdrop-blur-sm text-yellow-800 border border-yellow-200/50 shadow-xs">
        <Clock className="w-3 h-3" />
        Draft
      </span>
    );
  };

  const getRecipientGroupBadge = (groupValue) => {
    const groupLabels = {
      'all': 'All',
      'parents': 'Parents',
      'teachers': 'Teachers',
      'administration': 'Admin',
      'bom': 'BOM',
      'support': 'Support',
      'staff': 'Staff'
    };
    
    return (
      <span 
        title={groupLabels[groupValue] || groupValue}
        className="inline-flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-medium bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm text-blue-800 border border-blue-200/50 min-w-[60px] shadow-xs"
      >
        {groupLabels[groupValue] || groupValue}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 ${
      isSelected 
        ? 'border-blue-300/50 bg-blue-50/30 backdrop-blur-sm shadow-lg shadow-blue-100/50' 
        : 'border-gray-200/60 bg-white/60 backdrop-blur-sm hover:border-gray-300/60 hover:shadow-lg hover:shadow-gray-200/50'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onSelect(campaign.id)}
              className="p-1.5 rounded-full hover:bg-gray-100/50 transition-colors"
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
{/* Campaign Content */}
<div className="flex-1 min-w-0">
  <div className="flex items-start justify-between mb-3">
    <div className="min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
          <Mail className="text-white w-4 h-4" />
        </div>
        <h4 className="font-bold text-gray-900 truncate text-base bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
          {campaign.title || 'Untitled Campaign'}
        </h4>
      </div>
      <p className="text-base text-gray-700 mb-3 truncate">
        Subject: <span className="font-medium text-gray-900">{campaign.subject || 'No subject'}</span>
      </p>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
      {getStatusBadge(campaign.status)}
    </div>
  </div>

  {/* Stats and Info */}
  <div className="grid grid-cols-3 gap-4 mb-4">
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 font-medium">Recipients:</span>
      <span className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
        {recipientCount}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 font-medium">Group:</span>
      {getRecipientGroupBadge(campaign.recipientType)}
    </div>
    <div className="flex items-center gap-2">
      <CalendarDays className="w-4 h-4 text-gray-500" />
      <span className="text-sm text-gray-700 font-medium">
        {formatDate(campaign.sentAt || campaign.createdAt)}
      </span>
    </div>
  </div>

  {/* Content Preview */}
  <div className="mb-4">
    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
      {campaign.content?.substring(0, 150)}...
    </p>
  </div>

  {/* Modernized Action Buttons - 20% larger, no hover scale */}
  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
    <div className="flex items-center gap-3">
      <button
        onClick={() => onView(campaign)}
        className="
          inline-flex items-center gap-2
          px-4 py-2 text-sm
          text-blue-700
          bg-blue-50
          border border-blue-200
          rounded-xl
          shadow-sm
          hover:bg-blue-100
          hover:border-blue-300
          hover:text-blue-800
          transition-all duration-200
          active:scale-98
          font-medium
        "
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>

      {campaign.status === 'draft' && (
        <button
          onClick={() => onEdit(campaign)}
          className="
            inline-flex items-center gap-2
            px-4 py-2 text-sm
            text-purple-700
            bg-purple-50
            border border-purple-200
            rounded-xl
            shadow-sm
            hover:bg-purple-100
            hover:border-purple-300
            hover:text-purple-800
            transition-all duration-200
            active:scale-98
            font-medium
          "
        >
          <Edit className="w-4 h-4" />
          Edit Campaign
        </button>
      )}
    </div>
    
    <div className="flex items-center gap-3">
      {campaign.status === 'draft' && (
        <button
          onClick={() => onSend(campaign)}
          disabled={loadingStates.send}
          className="
            inline-flex items-center gap-2
            px-4 py-2 text-sm
            text-emerald-700
            bg-emerald-50
            border border-emerald-200
            rounded-xl
            shadow-sm
            hover:bg-emerald-100
            hover:border-emerald-300
            hover:text-emerald-800
            transition-all duration-200
            active:scale-98
            disabled:opacity-50 
            disabled:cursor-not-allowed
            font-medium
          "
        >
          <Send className="w-4 h-4" />
          Send Now
        </button>
      )}
      <button
        onClick={() => onDelete(campaign)}
        className="
          inline-flex items-center gap-2
          px-4 py-2 text-sm
          text-rose-700
          bg-rose-50
          border border-rose-200
          rounded-xl
          shadow-sm
          hover:bg-rose-100
          hover:border-rose-300
          hover:text-rose-800
          transition-all duration-200
          active:scale-98
          font-medium
        "
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

// Modern Email Skeleton Component
const ModernEmailSkeleton = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-200/60 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-7 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200%_100%] animate-shimmer"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* View Toggle Skeleton */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/50 rounded-xl border border-gray-200/60 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  <div className="h-5 w-12 bg-gray-300 rounded-lg"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="h-11 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-11 w-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/50 rounded-xl border border-gray-200/60 p-4">
            <div className="flex items-start gap-3">
              <div className="h-4 w-4 bg-gray-200 rounded mt-1"></div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-3 w-48 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="flex justify-between pt-3">
                  <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Notification Toast Component
const NotificationToast = ({ type, message, onClose }) => {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle
  };
  
  const colors = {
    success: 'bg-emerald-50/80 backdrop-blur-sm border-emerald-200/50 text-emerald-800',
    error: 'bg-red-50/80 backdrop-blur-sm border-red-200/50 text-red-800',
    info: 'bg-blue-50/80 backdrop-blur-sm border-blue-200/50 text-blue-800',
    warning: 'bg-yellow-50/80 backdrop-blur-sm border-yellow-200/50 text-yellow-800'
  };
  
  const Icon = icons[type] || Info;
  
  return (
    <div className={`fixed top-4 right-4 z-50 rounded-xl border p-4 shadow-lg animate-in slide-in-from-right-5 duration-300 ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
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
  
  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [showSendConfirmationModal, setShowSendConfirmationModal] = useState(false);
  const [campaignToSend, setCampaignToSend] = useState(null);
  
  // Notification State
  const [notification, setNotification] = useState(null);
  
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
    delete: false,
    bulk: false,
    fetching: false
  });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    totalRecipients: 0,
    successRate: 0,
    openedRate: 0
  });
  
  // Color palette for different card elements
  const cardColors = useMemo(() => ({
    title: 'from-blue-900 to-indigo-900',
    subject: 'from-gray-700 to-gray-600',
    recipients: 'from-emerald-700 to-teal-600',
    date: 'from-purple-700 to-violet-600',
    status: {
      draft: 'from-amber-600 to-orange-500',
      published: 'from-emerald-600 to-green-500'
    }
  }), []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };
  
  // ==================== HELPER FUNCTIONS ====================
  
  const getRecipientCount = useCallback((campaign) => {
    if (!campaign || !campaign.recipients) return 0;
    return campaign.recipients.split(',').length;
  }, []);
  
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
        shortLabel: 'All',
        count: calculateTotalRecipients(),
        color: 'from-blue-500 to-cyan-500',
        icon: Users,
        gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500'
      },
      { 
        value: 'parents', 
        label: 'Parents & Guardians',
        shortLabel: 'Parents',
        count: getParentEmails(),
        color: 'from-green-500 to-emerald-500',
        icon: Users,
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-500'
      },
      { 
        value: 'teachers', 
        label: 'Teaching Staff',
        shortLabel: 'Teachers',
        count: getTeachingStaffCount(),
        color: 'from-purple-500 to-pink-500',
        icon: GraduationCap,
        gradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
      },
      { 
        value: 'administration', 
        label: 'Administration',
        shortLabel: 'Admin',
        count: getAdminStaffCount(),
        color: 'from-orange-500 to-amber-500',
        icon: Award,
        gradient: 'bg-gradient-to-r from-orange-500 to-amber-500'
      },
      { 
        value: 'bom', 
        label: 'Board of Management',
        shortLabel: 'BOM',
        count: getBOMCount(),
        color: 'from-red-500 to-rose-500',
        icon: ShieldCheck,
        gradient: 'bg-gradient-to-r from-red-500 to-rose-500'
      },
      { 
        value: 'support', 
        label: 'Support Staff',
        shortLabel: 'Support',
        count: getSupportStaffCount(),
        color: 'from-indigo-500 to-violet-500',
        icon: Users,
        gradient: 'bg-gradient-to-r from-indigo-500 to-violet-500'
      },
      { 
        value: 'staff', 
        label: 'All School Staff',
        shortLabel: 'Staff',
        count: getAllStaffCount(),
        color: 'from-cyan-500 to-blue-500',
        icon: Users,
        gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500'
      }
    ];
  }, [students, staff]);
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft', color: 'bg-yellow-100/80 backdrop-blur-sm text-yellow-800 border-yellow-200/50', icon: Clock },
    { value: 'published', label: 'Sent', color: 'bg-emerald-100/80 backdrop-blur-sm text-emerald-800 border-emerald-200/50', icon: CheckCircle2 }
  ];
  
  // ==================== DATA FETCHING ====================
  
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
          showNotification('success', `Refreshed ${campaignsList.length} campaigns`);
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
      showNotification('error', 'Network error. Please check connection.');
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
      published: 0,
      totalRecipients: 0,
      successRate: 0,
      openedRate: 0
    };
    
    campaignsList.forEach(campaign => {
      if (campaign.status === 'draft') newStats.draft++;
      if (campaign.status === 'published') newStats.published++;
      
      const count = getRecipientCount(campaign);
      newStats.totalRecipients += count;
      
      if (campaign.successRate) {
        newStats.successRate += campaign.successRate;
      }
    });
    
    if (newStats.published > 0) {
      newStats.successRate = Math.round(newStats.successRate / newStats.published);
    }
    
    setStats(newStats);
  };
  
  // ==================== FILTERING & SORTING ====================
  
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
        } else if (activeView === 'published') {
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
  
  // ==================== CAMPAIGN OPERATIONS ====================
  
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
  
  const openDetailModal = (campaign) => {
    if (!campaign) return;
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };
  
  const openDeleteModal = (campaign) => {
    if (!campaign) return;
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };
  
  const openSendConfirmationModal = (campaign) => {
    if (!campaign) return;
    setCampaignToSend(campaign);
    setShowSendConfirmationModal(true);
  };
  
  const openBulkDeleteModal = () => {
    if (selectedCampaigns.size === 0) {
      showNotification('error', 'Please select campaigns to delete');
      return;
    }
    setShowBulkDeleteModal(true);
  };
  
  const handleCreateOrUpdateCampaign = async () => {
    if (!campaignForm.title || !campaignForm.subject || !campaignForm.content) {
      showNotification('error', 'Please fill all required fields');
      return;
    }
    
    try {
      setLoadingStates(prev => ({ ...prev, create: true }));
      
      const recipientEmails = getRecipientEmails(campaignForm.recipientType);
      
      if (recipientEmails.length === 0) {
        showNotification('error', 'No recipients found for the selected group');
        setLoadingStates(prev => ({ ...prev, create: false }));
        return;
      }
      
      const campaignData = {
        title: campaignForm.title.trim(),
        subject: campaignForm.subject.trim(),
        content: campaignForm.content,
        recipients: recipientEmails.join(', '),
        status: campaignForm.status,
        recipientType: campaignForm.recipientType
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
        if (selectedCampaign) {
          setCampaigns(prev => prev.map(c => 
            c.id === selectedCampaign.id ? result.campaign : c
          ));
        } else {
          setCampaigns(prev => [result.campaign, ...prev]);
        }
        
        setShowCreateModal(false);
        setSelectedCampaign(null);
        
        setCampaignForm({
          title: '',
          subject: '',
          content: '',
          recipientType: 'all',
          status: 'draft',
          recipients: []
        });
        
        if (campaignForm.status === 'published' && result.emailResults?.summary?.successful > 0) {
          showNotification('success', `Campaign created and ${result.emailResults.summary.successful} emails sent successfully!`);
        } else {
          showNotification('success', `Campaign ${selectedCampaign ? 'updated' : 'created'} successfully!`);
        }
      } else {
        showNotification('error', result.error || `Failed to ${selectedCampaign ? 'update' : 'create'} campaign`);
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, create: false }));
    }
  };
  
  const handleSendCampaign = async () => {
    if (!campaignToSend) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, send: true }));
      
      const response = await fetch(`/api/emails/${campaignToSend.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(prev => prev.map(c => 
          c.id === campaignToSend.id ? { ...c, status: 'published', sentAt: new Date().toISOString() } : c
        ));
        
        setShowSendConfirmationModal(false);
        setCampaignToSend(null);
        
        showNotification('success', `Campaign sent successfully!`);
      } else {
        showNotification('error', result.error || 'Failed to send campaign');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, send: false }));
    }
  };
  
  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, delete: true }));
      
      const response = await fetch(`/api/emails/${campaignToDelete.id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete.id));
        setSelectedCampaigns(prev => {
          const newSet = new Set(prev);
          newSet.delete(campaignToDelete.id);
          return newSet;
        });
        showNotification('success', 'Campaign deleted successfully!');
        setShowDeleteModal(false);
        setCampaignToDelete(null);
      } else {
        showNotification('error', result.error || 'Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedCampaigns.size === 0) return;
    
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
        setCampaigns(prev => prev.filter(c => !selectedCampaigns.has(c.id)));
        setSelectedCampaigns(new Set());
        showNotification('success', `${successfulDeletes.length} campaign(s) deleted successfully!`);
        setShowBulkDeleteModal(false);
      } else {
        showNotification('error', 'Failed to delete campaigns');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Network error. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, bulk: false }));
    }
  };
  
  // Modern Reset Filters button
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterRecipientType('all');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
    showNotification('info', 'Filters reset to default');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6 modern-scrollbar">
      <style>{modernScrollbarStyles}</style>
      <Toaster position="top-right" richColors />
      
      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      {/* Modernized Header with transparent buttons */}
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
<div className="flex gap-4 flex-wrap">
  {/* Refresh */}
  <button
    onClick={fetchData}
    disabled={refreshing || loadingStates.fetching}
    className="
      inline-flex items-center gap-2.5
      px-4 py-2.5
      rounded-2xl
      font-medium text-base
      text-gray-700
      bg-transparent
      border border-gray-300/60
      shadow-[0_1px_0_rgba(0,0,0,0.05)]
      transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
    "
  >
    <RefreshCw
      className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
    />
    {refreshing ? 'Refreshing…' : 'Refresh'}
  </button>

  {/* New Campaign */}
  <button
    onClick={openCreateModal}
    className="
      inline-flex items-center gap-2.5
      px-4 py-2.5
      rounded-2xl
      font-semibold text-base
      text-emerald-600
      bg-transparent
      border border-emerald-300/60
      shadow-[0_1px_0_rgba(0,0,0,0.05)]
      transition-colors
    "
  >
    <Plus className="w-5 h-5" />
    New Campaign
  </button>
</div>

      </div>

      {/* Modern View Toggle */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { view: 'all', label: 'All', count: stats.total, icon: Mail, color: 'from-gray-800 to-gray-700' },
          { view: 'draft', label: 'Draft', count: stats.draft, icon: Clock, color: 'from-blue-500 to-cyan-500' },
          { view: 'published', label: 'Sent', count: stats.published, icon: CheckCircle2, color: 'from-emerald-500 to-green-500' }
        ].map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`
              px-4 py-2.5 rounded-xl font-medium
              transition-all duration-300 flex items-center gap-2
              ${activeView === item.view
                ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                : 'bg-white/40 backdrop-blur-md text-gray-700 border border-gray-200/50 hover:border-gray-300/60 hover:shadow-md'
              }
              hover:scale-101
            `}
          >
            <item.icon className="w-4 h-4" />
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total Campaigns', value: stats.total, icon: Mail, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Draft', value: stats.draft, icon: Clock, color: 'amber', gradient: 'from-amber-500 to-yellow-500' },
          { label: 'Sent', value: stats.published, icon: CheckCircle2, color: 'emerald', gradient: 'from-emerald-500 to-green-500' },
          { label: 'Total Recipients', value: stats.totalRecipients, icon: Users, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
          { label: 'Success Rate', value: `${stats.successRate}%`, icon: BarChart3, color: 'cyan', gradient: 'from-cyan-500 to-blue-500' }
        ].map((stat, index) => (
          <div key={stat.label} className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300 hover:shadow-md hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
              </div>
              <div className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-lg shadow-sm`}>
                <stat.icon className="text-white text-base w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selection Actions Bar */}
      {selectedCampaigns.size > 0 && (
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 mb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100/80 backdrop-blur-sm text-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
                {selectedCampaigns.size} selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={openBulkDeleteModal}
                  className="
                    inline-flex items-center gap-2
                    bg-gradient-to-r from-red-500 to-pink-500
                    text-white px-3 py-1.5 rounded-lg
                    transition-all duration-300
                    text-sm font-medium shadow-sm
                    hover:shadow-md hover:scale-101
                    hover:from-red-600 hover:to-pink-600
                    hover:shadow-red-500/25
                  "
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedCampaigns(new Set())}
              className="text-gray-500 p-1 rounded-lg hover:bg-gray-100/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Filters Section with Modern Reset Button */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full pl-9 pr-3 py-2.5
                bg-gray-50/80 backdrop-blur-sm
                border border-gray-200/60
                rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/50
                focus:border-transparent
                transition-all duration-200
                text-sm modern-scrollbar
              "
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="
                px-3 py-2.5
                bg-gray-50/80 backdrop-blur-sm
                border border-gray-200/60
                rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/50
                focus:border-transparent
                text-sm cursor-pointer
                modern-scrollbar
              "
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            
            <select 
              value={filterRecipientType}
              onChange={(e) => setFilterRecipientType(e.target.value)}
              className="
                px-3 py-2.5
                bg-gray-50/80 backdrop-blur-sm
                border border-gray-200/60
                rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/50
                focus:border-transparent
                text-sm cursor-pointer
                modern-scrollbar
              "
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
                className="
                  px-3 py-2.5
                  bg-gray-50/80 backdrop-blur-sm
                  border border-gray-200/60
                  rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/50
                  focus:border-transparent
                  text-sm
                  modern-scrollbar
                "
                placeholder="From"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="
                  px-3 py-2.5
                  bg-gray-50/80 backdrop-blur-sm
                  border border-gray-200/60
                  rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-blue-500/50
                  focus:border-transparent
                  text-sm
                  modern-scrollbar
                "
                placeholder="To"
              />
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="
                px-3 py-2.5
                bg-gray-50/80 backdrop-blur-sm
                border border-gray-200/60
                rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500/50
                focus:border-transparent
                text-sm cursor-pointer
                modern-scrollbar
              "
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="recipients-high">Most Recipients</option>
              <option value="recipients-low">Fewest Recipients</option>
            </select>
            
            {/* Modern Reset Button */}
            <button
              onClick={resetFilters}
              className="
                inline-flex items-center gap-2
                px-3 py-2.5
                bg-gradient-to-r from-gray-100/80 to-gray-200/80
                backdrop-blur-md
                border border-gray-200/60
                rounded-lg
                transition-all duration-300
                text-sm font-medium
                text-gray-700
                shadow-sm hover:shadow-md
                hover:scale-101
                hover:from-gray-200/80 hover:to-gray-300/80
                hover:border-gray-300/60
                hover:text-gray-900
              "
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns List with modern scrollbar */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden">
        {loading ? (
          <ModernEmailSkeleton />
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="text-gray-400 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Campaigns Found</h3>
            <p className="text-gray-600 mb-6">
              {activeView === 'draft' 
                ? 'No draft campaigns found'
                : activeView === 'published'
                ? 'No sent campaigns found'
                : 'No campaigns match your filters'
              }
            </p>
            <button
              onClick={openCreateModal}
              className="
                inline-flex items-center gap-2
                bg-gradient-to-r from-blue-500 to-cyan-500
                text-white px-4 py-2.5 rounded-xl
                transition-all duration-300 font-medium
                shadow-lg hover:shadow-xl
                hover:scale-105
                hover:from-blue-600 hover:to-cyan-600
                hover:shadow-blue-500/25
              "
            >
              <Plus className="w-4 h-4" />
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <>
            {/* List Header */}
            <div className="p-4 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="p-1.5 rounded hover:bg-gray-100/50"
                  >
                    {selectedCampaigns.size === filteredCampaigns.length && filteredCampaigns.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    Select All ({filteredCampaigns.length})
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredCampaigns.length} of {campaigns.length} campaigns
                </div>
              </div>
            </div>

            {/* Campaign Cards with modern scrollbar */}
            <div className="p-4 space-y-4 modern-scrollbar max-h-[600px] overflow-y-auto">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  isSelected={selectedCampaigns.has(campaign.id)}
                  onSelect={toggleSelectCampaign}
                  onView={openDetailModal}
                  onEdit={openEditModal}
                  onSend={openSendConfirmationModal}
                  onDelete={openDeleteModal}
                  loadingStates={loadingStates}
                />
              ))}
            </div>
            
            {/* List Footer */}
            <div className="px-6 py-4 border-t border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredCampaigns.length}</span> of{' '}
                  <span className="font-semibold">{campaigns.length}</span> campaigns
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openBulkDeleteModal}
                    disabled={selectedCampaigns.size === 0}
                    className="
                      inline-flex items-center gap-2
                      px-3 py-1.5
                      bg-white/40 backdrop-blur-md
                      border border-gray-200/50
                      rounded-lg transition-all duration-300
                      text-sm font-medium text-gray-700
                      disabled:opacity-50
                      hover:bg-red-50/60
                      hover:text-red-600
                      hover:border-red-200/60
                      hover:shadow-sm
                    "
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

      {/* Single Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCampaignToDelete(null);
        }}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaignToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Campaign"
        onConfirm={handleDeleteCampaign}
        loading={loadingStates.delete}
      />

      {/* Send Campaign Confirmation Modal */}
      <ConfirmationModal
        open={showSendConfirmationModal}
        onClose={() => {
          setShowSendConfirmationModal(false);
          setCampaignToSend(null);
        }}
        title="Send Campaign"
        message={`Send "${campaignToSend?.title}" to ${getRecipientCount(campaignToSend)} recipients? This will mark it as published and send emails immediately.`}
        confirmText="Send Campaign"
        cancelText="Cancel"
        onConfirm={handleSendCampaign}
        isDanger={false}
        loading={loadingStates.send}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        open={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        title="Delete Multiple Campaigns"
        message={`Are you sure you want to delete ${selectedCampaigns.size} selected campaign(s)? This action cannot be undone.`}
        confirmText={`Delete ${selectedCampaigns.size} Campaigns`}
        onConfirm={handleBulkDelete}
        loading={loadingStates.bulk}
      />

      {/* Campaign Detail Modal with modern scrollbar */}
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
                <button onClick={() => setShowDetailModal(false)} className="p-1 rounded-lg cursor-pointer hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content with modern scrollbar */}
            <div className="max-h-[calc(85vh-150px)] overflow-y-auto p-6 modern-scrollbar">
              <div className="space-y-6">
                {/* Campaign Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200/50">
                    <h3 className="font-bold text-gray-900 mb-2">Campaign Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedCampaign.status === 'published' 
                            ? 'bg-emerald-100/80 backdrop-blur-sm text-emerald-800 border-emerald-200/50'
                            : 'bg-yellow-100/80 backdrop-blur-sm text-yellow-800 border-yellow-200/50'
                        }`}>
                          {selectedCampaign.status === 'published' ? 'Sent' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipient Group:</span>
                        <span className="font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
                          {selectedCampaign.recipientType || 'All'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipients:</span>
                        <span className="font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                          {getRecipientCount(selectedCampaign)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-bold bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
                          {new Date(selectedCampaign.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {selectedCampaign.sentAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sent:</span>
                          <span className="font-bold bg-gradient-to-r from-violet-700 to-violet-800 bg-clip-text text-transparent">
                            {new Date(selectedCampaign.sentAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200/50">
                    <h3 className="font-bold text-gray-900 mb-2">Performance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className={`font-bold ${
                          (selectedCampaign.successRate || 0) >= 80 
                            ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 bg-clip-text text-transparent'
                            : (selectedCampaign.successRate || 0) >= 50 
                            ? 'bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent'
                            : 'bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent'
                        }`}>
                          {selectedCampaign.successRate || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Emails Sent:</span>
                        <span className="font-bold bg-gradient-to-r from-cyan-700 to-cyan-800 bg-clip-text text-transparent">
                          {selectedCampaign.sentCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Failed:</span>
                        <span className="font-bold bg-gradient-to-r from-rose-700 to-rose-800 bg-clip-text text-transparent">
                          {selectedCampaign.failedCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subject */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Subject</h3>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60">
                    <p className="text-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                      {selectedCampaign.subject}
                    </p>
                  </div>
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Content</h3>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60 max-h-64 overflow-y-auto modern-scrollbar">
                    <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm">
                      {selectedCampaign.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with modern buttons */}
            <div className="p-4 border-t border-gray-100/50">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditModal(selectedCampaign);
                  }}
                  className="
                    flex-1
                    bg-gradient-to-r from-blue-500 to-cyan-500
                    text-white py-2.5 rounded-lg
                    transition-all duration-300
                    font-medium shadow-lg
                    hover:shadow-xl hover:scale-101
                    hover:from-blue-600 hover:to-cyan-600
                    hover:shadow-blue-500/25
                  "
                >
                  Edit Campaign
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="
                    flex-1
                    border border-gray-300/60
                    text-gray-700 py-2.5 rounded-lg
                    transition-all duration-300
                    font-medium
                    hover:bg-gray-50/80
                    hover:border-gray-400/60
                    hover:shadow-sm
                  "
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
              className="p-1 rounded-lg cursor-pointer hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
{/* Content with modern scrollbar */}
<div className="max-h-[calc(85vh-150px)] overflow-y-auto p-6 modern-scrollbar">
  <div className="space-y-4">
    {/* Title */}
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1">Campaign Title *</label>
      <input
        type="text"
        value={campaignForm.title}
        onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
        placeholder="Enter campaign title"
        className="
          w-full px-3 py-2.5
          bg-gray-50/80 backdrop-blur-sm
          border border-gray-200/60
          rounded-lg focus:outline-none
          focus:ring-2 focus:ring-emerald-500/50
          focus:border-transparent text-sm
          modern-scrollbar
        "
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
        className="
          w-full px-3 py-2.5
          bg-gray-50/80 backdrop-blur-sm
          border border-gray-200/60
          rounded-lg focus:outline-none
          focus:ring-2 focus:ring-emerald-500/50
          focus:border-transparent text-sm
          modern-scrollbar
        "
      />
    </div>
    
    {/* Recipient Group */}
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1">Recipient Group *</label>
      <select 
        value={campaignForm.recipientType}
        onChange={(e) => setCampaignForm({...campaignForm, recipientType: e.target.value})}
        className="
          w-full px-3 py-2.5
          bg-gray-50/80 backdrop-blur-sm
          border border-gray-200/60
          rounded-lg focus:outline-none
          focus:ring-2 focus:ring-emerald-500/50
          focus:border-transparent text-sm
          modern-scrollbar
        "
      >
        {recipientGroups.map(group => (
          <option key={group.value} value={group.value}>
            {group.label} ({group.count} recipients)
          </option>
        ))}
      </select>
    </div>
    
    {/* Content with modern scrollbar - 4x height */}
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-1">Email Content *</label>
      <textarea
        value={campaignForm.content}
        onChange={(e) => setCampaignForm({...campaignForm, content: e.target.value})}
        placeholder="Write your email content here..."
        className="
          w-full px-3 py-3
          bg-gray-50/80 backdrop-blur-sm
          border border-gray-200/60
          rounded-lg focus:outline-none
          focus:ring-2 focus:ring-emerald-500/50
          focus:border-transparent text-sm
          resize-y
          modern-scrollbar
          min-h-[200px]
        "
        rows={30}
        style={{
          height: 'calc( 1.5rem * 20)', /* 4 times the original height */
        }}
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
          className="w-4 h-4 text-emerald-600 border-gray-300/60 rounded focus:ring-emerald-500/50"
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
        <div className="p-4 border-t border-gray-100/50">
          <div className="flex gap-2">
            <button
              onClick={handleCreateOrUpdateCampaign}
              disabled={loadingStates.create}
              className="
                flex-1
                bg-gradient-to-r from-emerald-500 to-green-500
                text-white py-2.5 rounded-lg
                transition-all duration-300
                font-medium disabled:opacity-50
                disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl
                hover:scale-101
                hover:from-emerald-600 hover:to-green-600
                hover:shadow-emerald-500/25
                disabled:hover:scale-100
                disabled:hover:shadow-lg
              "
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
              className="
                flex-1
                border border-gray-300/60
                text-gray-700 py-2.5 rounded-lg
                transition-all duration-300
                font-medium
                hover:bg-gray-50/80
                hover:border-gray-400/60
                hover:shadow-sm
              "
            >
              <span className="text-sm">Cancel</span>
            </button>
          </div>
        </div>
      </ModernModal>
    </div>
  );
}