'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';

// React Icons from fa6 (only the ones you're actually using)
import { 
  FaX,
  FaSchool,
  FaUser,
  FaTrash,
  FaDownload,
  FaUsers,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaEdit,
  FaCalendar,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaInfo,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaUserGraduate,
  FaBuilding,
  FaAward,
  FaCrown,
  FaChartLine,
  FaChartPie,
  FaPaperclip,
  FaQuoteLeft,
  FaQuoteRight,
  FaExclamationTriangle,
  FaLogOut
} from 'react-icons/fa6';

// Import Lucide React icons for the rest
import {
  Search,
  School,
  Users,
  User,
  Trash2,
  Download,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Calendar,
  Shield,
  Mail,
  Phone,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  EyeOff,
  Check,
  X,
  GraduationCap,
  Building2,
  Award,
  Crown,
  TrendingUp,
  PieChart,
  Paperclip,
  Quote,
  AlertTriangle,
  LogOut,
  // Add other Lucide icons as needed
  Book,
  Video,
  MapPin,
  Globe,
  Clock,
  Upload,
  Settings,
  Save,
  ExternalLink,
  Rocket,
  Hash,
  Palette,
  Zap,
  Gem,
  Flame,
  FileText,
  LayoutGrid,
  List,
  CalendarDays,
  FileDown,
  FileUp,
  Percent,
  ClipboardList,
  UserCheck,
  DollarSign,
  Receipt,
  Calculator,
  AreaChart,
  Share2,
  ListChecks,
  StarHalf,
  Lightbulb,
  Newspaper,
  StickyNote,
  Sun,
  Moon,
  Youtube,
  FileVideo,
  FileCode,
  FileAudio,
  File,
  Tags,
  Cog,
  University,
  Briefcase,
  PlayCircle
} from 'lucide-react';

export default function AdminManager() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('loading');
  const router = useRouter();
  
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [selectedAdmins, setSelectedAdmins] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  // Add these states
const [showViewModal, setShowViewModal] = useState(false);
const [viewingAdmin, setViewingAdmin] = useState(null);
  const itemsPerPage = 8;

  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '+254',
    role: 'ADMIN',
    permissions: {
      manageUsers: false,
      manageContent: true,
      manageSettings: false,
      viewReports: true
    },
    status: 'active'
  });




// Handle view admin details
const handleViewAdmin = (admin) => {
  setViewingAdmin(admin);
  setShowViewModal(true);
};  
  // Check authentication on component mount - CORRECTED
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('🔍 AdminManager: Checking authentication...');
        
        // Use the correct keys from localStorage
        const token = localStorage.getItem('admin_token');
        const user = localStorage.getItem('admin_user');
        
        console.log('Token found:', !!token);
        console.log('User found:', !!user);
        
        if (token && user) {
          const userData = JSON.parse(user);
          console.log('User data:', userData);
          
          // Verify token expiration
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (tokenPayload.exp < currentTime) {
              console.log('❌ Token expired');
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              setStatus('unauthenticated');
              toast.error('Session expired. Please login again.');
              router.push('/adminLogin');
              return;
            }
            
            console.log('✅ Token valid, expires:', new Date(tokenPayload.exp * 1000).toLocaleString());
          } catch (tokenError) {
            console.log('⚠️ Token validation skipped:', tokenError.message);
          }
          
          setSession({ user: userData, token });
          setStatus('authenticated');
          console.log('✅ Authentication successful');
        } else {
          console.log('❌ No valid auth data found');
          setStatus('unauthenticated');
          toast.error('Please login to access this page');
          router.push('/adminLogin');
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setStatus('unauthenticated');
        router.push('/adminLogin');
      }
    };

    checkAuth();
  }, [router]);

const fetchAdmins = async (showRefresh = false) => {
  if (status !== 'authenticated') {
    console.log('❌ Cannot fetch admins: Not authenticated');
    return;
  }
  
  try {
    console.log('📥 Fetching admins from API...');
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const token = localStorage.getItem('admin_token');
    
    // Fetch from your API endpoint
    const response = await fetch('/api/register', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      // Map the data to match your expected format
      const adminsData = (data.users || []).map(user => ({
        ...user,
        permissions: {
          manageUsers: user.role === 'ADMIN' || user.role === 'SUPER_ADMIN',
          manageContent: true,
          manageSettings: user.role === 'SUPER_ADMIN',
          viewReports: true
        },
        status: 'active' // You'll need to add status field to your User model
      }));
      
      setAdmins(adminsData);
      setFilteredAdmins(adminsData);
      console.log('✅ Admins fetched successfully:', adminsData.length);
    } else {
      throw new Error(data.error || 'Failed to fetch admins');
    }

    if (showRefresh) {
      toast.success('Admins refreshed successfully!');
    }
  } catch (error) {
    console.error('❌ Error fetching admins:', error);
    toast.error('Failed to load admins');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAdmins();
    }
  }, [status]);

  // Calculate statistics with safe access
  const calculateStats = () => {
    const adminArray = admins || [];
    const totalAdmins = adminArray.length;
    const activeAdmins = adminArray.filter(admin => admin.status === 'active').length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthAdmins = adminArray.filter(admin => {
      if (!admin.createdAt) return false;
      const adminDate = new Date(admin.createdAt);
      return adminDate.getMonth() === currentMonth && adminDate.getFullYear() === currentYear;
    }).length;
    
    const lastMonthAdmins = adminArray.filter(admin => {
      if (!admin.createdAt) return false;
      const adminDate = new Date(admin.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const year = currentMonth === 0 ? currentYear - 1 : currentYear;
      return adminDate.getMonth() === lastMonth && adminDate.getFullYear() === year;
    }).length;
    
    const growthRate = lastMonthAdmins > 0 
      ? ((thisMonthAdmins - lastMonthAdmins) / lastMonthAdmins * 100).toFixed(1)
      : thisMonthAdmins > 0 ? 100 : 0;

    return {
      totalAdmins,
      activeAdmins,
      thisMonthAdmins,
      lastMonthAdmins,
      growthRate: parseFloat(growthRate),
      growthCount: thisMonthAdmins - lastMonthAdmins
    };
  };

  const stats = calculateStats();

  // Filter admins by search
  useEffect(() => {
    let filtered = admins || [];

    if (searchTerm) {
      filtered = filtered.filter(admin =>
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.phone?.includes(searchTerm)
      );
    }

    setFilteredAdmins(filtered);
    setCurrentPage(1);
  }, [searchTerm, admins]);

  // Pagination logic
  const totalPages = Math.ceil((filteredAdmins?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAdmins = (filteredAdmins || []).slice(startIndex, startIndex + itemsPerPage);

  // Handle admin selection
  const toggleAdminSelection = (adminId) => {
    const newSelected = new Set(selectedAdmins);
    if (newSelected.has(adminId)) {
      newSelected.delete(adminId);
    } else {
      newSelected.add(adminId);
    }
    setSelectedAdmins(newSelected);
  };

  const selectAllAdmins = () => {
    if (selectedAdmins.size === currentAdmins.length) {
      setSelectedAdmins(new Set());
    } else {
      setSelectedAdmins(new Set(currentAdmins.map(admin => admin.id)));
    }
  };

  // Handle admin deletion
  const handleDelete = (admin) => {
    if (session?.user && admin.id === session.user.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    setAdminToDelete(admin);
    setShowDeleteConfirm(true);
  };
const confirmDelete = async () => {
  if (!adminToDelete) return;
  
  try {
    const token = localStorage.getItem('admin_token');
    
    const response = await fetch(`/api/register/${adminToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete admin');
    }

    if (data.success) {
      // Remove from local state
      const updatedAdmins = admins.filter(admin => admin.id !== adminToDelete.id);
      setAdmins(updatedAdmins);
      
      toast.success('Admin deleted successfully!');
    } else {
      throw new Error(data.error || 'Failed to delete admin');
    }
  } catch (error) {
    console.error('Error deleting admin:', error);
    toast.error('Failed to delete admin');
  } finally {
    setShowDeleteConfirm(false);
    setAdminToDelete(null);
  }
};

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setAdminToDelete(null);
  };

  // Handle admin creation/editing
  const handleCreateAdmin = () => {
    setAdminData({
      name: '',
      email: '',
      password: '',
      phone: '+254',
      role: 'ADMIN',
      permissions: {
        manageUsers: false,
        manageContent: true,
        manageSettings: false,
        viewReports: true
      },
      status: 'active'
    });
    setEditingAdmin(null);
    setShowAdminModal(true);
  };

  const handleEditAdmin = (admin) => {
    setAdminData({
      name: admin.name || '',
      email: admin.email || '',
      password: '',
      phone: admin.phone || '+254',
      role: admin.role || 'ADMIN',
      permissions: admin.permissions || {
        manageUsers: false,
        manageContent: true,
        manageSettings: false,
        viewReports: true
      },
      status: admin.status || 'active'
    });
    setEditingAdmin(admin);
    setShowAdminModal(true);
  };

const handleSaveAdmin = async (e) => {
  e.preventDefault();
  setSavingAdmin(true);

  try {
    const token = localStorage.getItem('admin_token');
    
    const adminPayload = {
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone,
      role: adminData.role,
      // Note: You'll need to add permissions and status to your User model
      // or handle them separately
      status: adminData.status
    };

    if (adminData.password) {
      adminPayload.password = adminData.password;
    }

    let url = '/api/register';
    let method = 'POST';
    
    if (editingAdmin) {
      // Use the update endpoint for existing users
      url = `/api/register/${editingAdmin.id}`;
      method = 'PUT';
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adminPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to ${editingAdmin ? 'update' : 'create'} admin`);
    }

    if (data.success) {
      toast.success(`Admin ${editingAdmin ? 'updated' : 'created'} successfully!`);
      
      // Refresh the admin list
      await fetchAdmins();
      
      setShowAdminModal(false);
      setAdminData({
        name: '',
        email: '',
        password: '',
        phone: '+254',
        role: 'ADMIN',
        permissions: {
          manageUsers: false,
          manageContent: true,
          manageSettings: false,
          viewReports: true
        },
        status: 'active'
      });
    } else {
      throw new Error(data.error || `Failed to ${editingAdmin ? 'update' : 'create'} admin`);
    }
    
  } catch (error) {
    console.error('Error saving admin:', error);
    toast.error(error.message);
  } finally {
    setSavingAdmin(false);
  }
};

  // Update permission
  const updatePermission = (permission, value) => {
    setAdminData({
      ...adminData,
      permissions: {
        ...adminData.permissions,
        [permission]: value
      }
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Created At'];
      const csvData = (filteredAdmins || []).map(admin => [
        admin.name,
        admin.email,
        admin.phone,
        admin.role,
        admin.status,
        new Date(admin.createdAt).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admins-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  // Handle logout - CORRECTED
  const handleLogout = () => {
    // Clear admin-specific auth data
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    console.log('👋 Logged out successfully');
    toast.info('Logged out successfully');
    router.push('/adminLogin');
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg mt-4 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg mt-4 font-medium">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 lg:p-8 space-y-8">
      <Toaster position="top-right" richColors />

      {/* Modern Header with Profile Card */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-3xl shadow-2xl border border-blue-200/50 p-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Shield className="text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold">Admin Management Dashboard</h1>
                <p className="text-blue-100 opacity-90 mt-2 text-lg">Manage system administrators and permissions</p>
              </div>
            </div>
          </div>
          
          {/* Profile Card */}
{session?.user && (
  <div className="bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-5 sm:p-7 border border-white/10 w-full max-w-[450px] shadow-2xl relative overflow-hidden group">
    {/* Subtle Background Glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
    
    {/* Header Section */}
    <div className="flex items-start justify-between mb-6 relative z-10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <User className="text-white" size={20} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm" />
        </div>
        <div>
          <h2 className="font-black text-white text-sm uppercase tracking-widest leading-none mb-1">
            {session.user.name.split(' ')[0]}'s Profile
          </h2>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter opacity-80">
            {session.user.role || 'System Administrator'}
          </p>
        </div>
      </div>

      {/* Modern Compact Logout */}
      <button
        onClick={handleLogout}
        title="Logout"
        className="p-2.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl border border-white/10 hover:border-red-500/30 transition-all duration-300 active:scale-90"
      >
        <LogOut size={16} />
      </button>
    </div>

    {/* Info Grid - Adaptive for Zooming */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 relative z-10">
      {[
        { label: 'Ident', val: session.user.name, icon: <User size={12} /> },
        { label: 'Mail', val: session.user.email, icon: <Mail size={12} /> },
        { label: 'Call', val: session.user.phone || '+2547...', icon: <Phone size={12} /> }
      ].map((item, i) => (
        <div key={i} className="flex flex-col p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-1.5 mb-1 text-blue-300/60 uppercase font-black text-[8px] tracking-[0.15em]">
            {item.icon} {item.label}
          </div>
          <p className="text-[11px] font-bold text-slate-100 truncate tracking-tight">
            {item.val}
          </p>
        </div>
      ))}
    </div>

    {/* Bottom Status Bar */}
    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
       <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Session Active</span>
       </div>
       <span className="text-[9px] font-black text-slate-500 italic">v2.0.26</span>
    </div>
  </div>
)}
        </div>
      </div>

{/* MODERN QUICK ACTIONS - Left Aligned & Compact */}
<div className="flex flex-col sm:flex-row gap-3 w-fit ml-0">
  
  {/* Refresh Action */}
  <button
    onClick={() => fetchAdmins(true)}
    disabled={refreshing}
    className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50"
  >
    <div className={`${refreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`}>
      <RefreshCw size={18} className={refreshing ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'} />
    </div>
    <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
      {refreshing ? 'Syncing...' : 'Refresh'}
    </span>
  </button>
  
  {/* Create Action */}
  <button
    onClick={handleCreateAdmin}
    className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-200/50 transition-all duration-300 active:scale-95"
  >
    <div className="bg-white/20 p-1 rounded-lg">
      <Plus size={18} strokeWidth={3} />
    </div>
    <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
      Add Admin
    </span>
  </button>

</div>

      {/* Stats Cards - Modern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 relative overflow-hidden group hover:shadow-xl transition-all duration-200">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl transition-colors duration-200 group-hover:bg-blue-100">
                <Users className="text-blue-600 text-2xl" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{stats.totalAdmins}</div>
                <div className="text-blue-600 text-sm font-bold">Total Admins</div>
              </div>
            </div>
            <div className="text-gray-600 text-sm">All system administrators</div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-200"></div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 relative overflow-hidden group hover:shadow-xl transition-all duration-200">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-2xl transition-colors duration-200 group-hover:bg-green-100">
                <CheckCircle className="text-green-600 text-2xl" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{stats.activeAdmins}</div>
                <div className="text-green-600 text-sm font-bold">Active Admins</div>
              </div>
            </div>
            <div className="text-gray-600 text-sm">Currently active administrators</div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-200"></div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 relative overflow-hidden group hover:shadow-xl transition-all duration-200">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-2xl transition-colors duration-200 group-hover:bg-orange-100">
                <TrendingUp className="text-orange-600 text-2xl" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{stats.growthRate}%</div>
                <div className="text-orange-600 text-sm font-bold">
                  {stats.growthCount >= 0 ? '+' : ''}{stats.growthCount} this month
                </div>
              </div>
            </div>
            <div className="text-gray-600 text-sm">Monthly growth rate</div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-200"></div>
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search admins by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 font-bold bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-gray-600 text-sm font-bold">
              {selectedAdmins.size > 0 
                ? `${selectedAdmins.size} selected` 
                : `${filteredAdmins.length} admins found`
              }
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedAdmins.size === currentAdmins.length && currentAdmins.length > 0}
                      onChange={selectAllAdmins}
                      className="w-4 h-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-sm font-bold uppercase tracking-wider">Admin Information</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-gray-700 text-sm font-bold uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-gray-700 text-sm font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-gray-700 text-sm font-bold uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-left text-gray-700 text-sm font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAdmins.has(admin.id)}
                        onChange={() => toggleAdminSelection(admin.id)}
                        className="w-4 h-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                          <User className="text-blue-600" />
                        </div>
                        <div>
                       {/* In the table row, update the admin name to be clickable */}
<p 
  onClick={() => handleViewAdmin(admin)}
  className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm cursor-pointer hover:underline"
>
  {admin.name}
  {session?.user && admin.id === session.user.id && (
    <span className="ml-2 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full font-bold">You</span>
  )}
</p>
                          <p className="text-xs text-gray-500 mt-1">{admin.email}</p>
                          <p className="text-xs text-gray-400">{admin.phone}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      admin.role === 'SUPER_ADMIN' 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        : admin.role === 'ADMIN'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      admin.status === 'active' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="text-gray-400" />
                      {new Date(admin.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 rounded-xl transition-all duration-200 border border-blue-200 hover:scale-100 active:scale-95"
                      >
                        <Edit className="text-sm" />
                      </button>
                      {session?.user && admin.id !== session.user.id && (
                        <button
                          onClick={() => handleDelete(admin)}
                          className="p-2 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 rounded-xl transition-all duration-200 border border-red-200 hover:scale-100 active:scale-95"
                        >
                          <Trash2 className="text-sm" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAdmins.length === 0 && (
            <div className="text-center py-16">
              <User className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                {searchTerm ? 'No admins found matching your search.' : 'No admins found.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination - Modern */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="text-gray-600 text-sm font-medium">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAdmins.length)} of {filteredAdmins.length}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-2xl text-gray-700 disabled:opacity-30 transition-all duration-200 hover:scale-100 active:scale-95 disabled:hover:scale-100"
              >
                <ChevronLeft className="text-lg" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-3 rounded-2xl font-bold transition-all duration-200 hover:scale-100 active:scale-95 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-2xl text-gray-700 disabled:opacity-30 transition-all duration-200 hover:scale-100 active:scale-95 disabled:hover:scale-100"
              >
                <ChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modern Admin Modal */}
      {showAdminModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowAdminModal(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <User className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                    </h2>
                    <p className="text-blue-100 opacity-90 mt-1">Manage admin details and permissions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-200 hover:scale-100"
                >
                  <FaX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAdmin} className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-sm">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={adminData.name}
                    onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                    className="w-full px-4 py-4 font-bold bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-sm">Email *</label>
                  <input
                    type="email"
                    required
                    value={adminData.email}
                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                    className="w-full px-4 py-4 font-bold bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-sm">
                    {editingAdmin ? 'New Password (optional)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    required={!editingAdmin}
                    value={adminData.password}
                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                    className="w-full px-4 py-4 font-bold bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-sm">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={adminData.phone}
                    onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                    className="w-full px-4 py-4 font-bold bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="+254700000000"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-sm">Role *</label>
                  <select
                    required
                    value={adminData.role}
                    onChange={(e) => setAdminData({ ...adminData, role: e.target.value })}
                    className="w-full px-4 py-4  font-bold bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="MODERATOR">Moderator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-sm">Status *</label>
                  <select
                    required
                    value={adminData.status}
                    onChange={(e) => setAdminData({ ...adminData, status: e.target.value })}
                    className="w-full px-4 py-4 font-bold bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Permissions Grid */}
              <div>
                <label className="block text-gray-900 font-bold mb-4 text-sm">Permissions</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={adminData.permissions.manageUsers}
                      onChange={(e) => updatePermission('manageUsers', e.target.checked)}
                      className="w-4 h-4 rounded  font-bold cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Manage Users</p>
                      <p className="text-xs text-gray-600">Create, edit, and delete users</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={adminData.permissions.manageContent}
                      onChange={(e) => updatePermission('manageContent', e.target.checked)}
                      className="w-4 h-4 rounded  cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Manage Content</p>
                      <p className="text-xs text-gray-600">Create and edit website content</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={adminData.permissions.manageSettings}
                      onChange={(e) => updatePermission('manageSettings', e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Manage Settings</p>
                      <p className="text-xs text-gray-600">Modify system settings</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={adminData.permissions.viewReports}
                      onChange={(e) => updatePermission('viewReports', e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">View Reports</p>
                      <p className="text-xs text-gray-600">Access analytics and reports</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 px-6 py-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-3 hover:scale-100 active:scale-95 text-sm"
                >
                  <X className="text-sm" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdmin}
                  className="flex-1 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-100 active:scale-99 text-sm"
                >
                  {savingAdmin ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="text-sm" />
                      {editingAdmin ? 'Update Admin' : 'Create Admin'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


{/* MODERN VIEW ADMIN MODAL */}
{showViewModal && viewingAdmin && (
  <div 
    className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center p-4 z-[100]"
    onClick={() => setShowViewModal(false)}
  >
    <div 
      className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <User className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-black">Admin Profile</h2>
                <p className="text-slate-200 opacity-90 mt-1 text-sm">Complete account information and permissions</p>
              </div>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-200 hover:scale-105"
            >
              <FaX className="text-xl" />
            </button>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
              <span className="text-sm font-bold">ID: </span>
              <span className="text-slate-200 text-sm">{viewingAdmin.id.substring(0, 8)}...</span>
            </div>
            <div className={`px-4 py-2 rounded-full border ${
              viewingAdmin.status === 'active' 
                ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                : 'bg-red-500/20 text-red-300 border-red-400/30'
            }`}>
              <span className="text-sm font-bold">Status: </span>
              <span className="text-sm">{viewingAdmin.status}</span>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
              <span className="text-sm font-bold">Role: </span>
              <span className="text-sm">{viewingAdmin.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content with Scroll */}
      <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
        {/* Personal Information Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <User className="text-blue-600" size={18} />
            </div>
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="text-gray-400" size={16} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <p className="text-lg font-black text-gray-900">{viewingAdmin.name}</p>
              </div>
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="text-gray-400" size={16} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <p className="text-lg font-black text-gray-900">{viewingAdmin.email}</p>
                <p className="text-xs text-gray-500 mt-1">Primary contact email</p>
              </div>
            </div>
            
            {/* Phone Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="text-gray-400" size={16} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <p className="text-lg font-black text-gray-900">{viewingAdmin.phone || 'Not provided'}</p>
              </div>
            </div>
            
            {/* Account Created */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400" size={16} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Member Since</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <p className="text-lg font-black text-gray-900">
                  {new Date(viewingAdmin.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.floor((new Date() - new Date(viewingAdmin.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions & Role Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Shield className="text-purple-600" size={18} />
            </div>
            Role & Permissions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Badge */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Current Role</span>
                <div className={`px-6 py-4 rounded-2xl font-black text-center ${
                  viewingAdmin.role === 'SUPER_ADMIN'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                    : viewingAdmin.role === 'ADMIN'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                }`}>
                  {viewingAdmin.role.replace('_', ' ')}
                </div>
              </div>
              
              {/* Status Badge */}
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Account Status</span>
                <div className={`px-6 py-4 rounded-2xl font-black text-center ${
                  viewingAdmin.status === 'active'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                }`}>
                  {viewingAdmin.status.toUpperCase()}
                </div>
              </div>
            </div>
            
            {/* Permissions Grid */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">System Permissions</span>
              <div className="grid grid-cols-2 gap-3">
                {viewingAdmin.permissions && Object.entries(viewingAdmin.permissions).map(([key, value]) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-2xl border transition-all duration-200 ${
                      value 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {value ? 'Allowed' : 'Restricted'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Security Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Clock className="text-orange-600" size={18} />
            </div>
            Activity & Security
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Last Updated */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Updated</span>
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <p className="font-black text-gray-900">
                  {viewingAdmin.updatedAt 
                    ? new Date(viewingAdmin.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'Never'
                  }
                </p>
              </div>
            </div>
            
            {/* Account Age */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Age</span>
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <p className="font-black text-gray-900">
                  {Math.floor((new Date() - new Date(viewingAdmin.createdAt)) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
            
            {/* Permission Level */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Permission Level</span>
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <p className="font-black text-gray-900">
                  {Object.values(viewingAdmin.permissions || {}).filter(Boolean).length} / 4
                </p>
                <p className="text-xs text-gray-500">Active permissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-8 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowViewModal(false)}
            className="flex-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-6 py-4 rounded-2xl font-black transition-all duration-200 hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-wider"
          >
            Close Details
          </button>
          <button
            onClick={() => {
              setShowViewModal(false);
              handleEditAdmin(viewingAdmin);
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-2xl font-black transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-wider flex items-center justify-center gap-3"
          >
            <Edit size={16} />
            Edit Admin
          </button>
          {session?.user && viewingAdmin.id !== session.user.id && (
            <button
              onClick={() => {
                setShowViewModal(false);
                handleDelete(viewingAdmin);
              }}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-2xl font-black transition-all duration-200 shadow-lg shadow-red-500/25 hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-wider flex items-center justify-center gap-3"
            >
              <Trash2 size={16} />
              Delete Admin
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
)}

      {/* Modern Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 border border-gray-200 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-200">
                <Trash2 className="text-3xl text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Delete Admin</h3>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete <strong className="text-gray-900">{adminToDelete?.name}</strong>?
              </p>
              <p className="text-gray-500 text-xs mt-3">This action cannot be undone.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 px-6 py-4 rounded-2xl font-bold transition-all duration-200 hover:scale-100 active:scale-95 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-red-500/25 hover:scale-100 active:scale-95 text-sm"
              >
                Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}