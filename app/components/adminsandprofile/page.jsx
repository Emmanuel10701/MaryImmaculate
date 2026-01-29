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

  // Fetch admins from API
  const fetchAdmins = async (showRefresh = false) => {
    if (status !== 'authenticated') {
      console.log('❌ Cannot fetch admins: Not authenticated');
      return;
    }
    
    try {
      console.log('📥 Fetching admins...');
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Check localStorage first for admin list
      const storedAdmins = localStorage.getItem('adminList');
      if (storedAdmins) {
        console.log('📁 Found admins in localStorage');
        const adminsData = JSON.parse(storedAdmins);
        setAdmins(adminsData);
        setFilteredAdmins(adminsData);
      } else {
        console.log('📝 Creating initial admin list from current user');
        // Create initial list from current user
        if (session?.user) {
          const initialAdmins = [{
            ...session.user,
            id: session.user.id || 'current-user',
            phone: session.user.phone || '+254700000000',
            role: session.user.role || 'ADMIN',
            status: 'active',
            permissions: {
              manageUsers: true,
              manageContent: true,
              manageSettings: true,
              viewReports: true
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }];
          setAdmins(initialAdmins);
          setFilteredAdmins(initialAdmins);
          localStorage.setItem('adminList', JSON.stringify(initialAdmins));
          console.log('✅ Initial admin list created:', initialAdmins);
        } else {
          console.log('⚠️ No session user found');
          setAdmins([]);
          setFilteredAdmins([]);
        }
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
      const updatedAdmins = admins.filter(admin => admin.id !== adminToDelete.id);
      setAdmins(updatedAdmins);
      localStorage.setItem('adminList', JSON.stringify(updatedAdmins));
      
      toast.success('Admin deleted successfully!');
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
      const token = localStorage.getItem('admin_token'); // Use correct key
      const adminPayload = {
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        role: adminData.role,
        permissions: adminData.permissions,
        status: adminData.status
      };

      if (adminData.password) {
        adminPayload.password = adminData.password;
      }

      let response;
      if (editingAdmin) {
        const updatedAdmins = admins.map(admin => 
          admin.id === editingAdmin.id 
            ? { 
                ...admin, 
                ...adminPayload, 
                updatedAt: new Date().toISOString(),
                id: admin.id
              }
            : admin
        );
        setAdmins(updatedAdmins);
        localStorage.setItem('adminList', JSON.stringify(updatedAdmins));
        toast.success('Admin updated successfully!');
      } else {
        // For demo purposes, we'll simulate API call
        // In production, uncomment the actual API call
        /*
        response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(adminPayload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create admin');
        }

        if (data.success) {
          const newAdmin = {
            ...data.user,
            phone: adminData.phone,
            role: adminData.role,
            permissions: adminData.permissions,
            status: adminData.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          const updatedAdmins = [...admins, newAdmin];
          setAdmins(updatedAdmins);
          localStorage.setItem('adminList', JSON.stringify(updatedAdmins));
          toast.success('Admin created successfully!');
        } else {
          throw new Error(data.error || 'Failed to create admin');
        }
        */
        
        // Demo implementation
        const newAdmin = {
          id: `admin-${Date.now()}`,
          ...adminPayload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const updatedAdmins = [...admins, newAdmin];
        setAdmins(updatedAdmins);
        localStorage.setItem('adminList', JSON.stringify(updatedAdmins));
        toast.success('Admin created successfully!');
      }

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
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 min-w-[300px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                    <User className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="font-bold text-md">Your Profile</h2>
                    <p className="text-blue-100 opacity-80 text-sm">Logged in as {session.user.role || 'ADMIN'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Status</p>
                  <span className="px-3 py-1 bg-green-500/20 text-orange-500  rounded-full text-xs font-bold border border-green-300/30">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl">
                  <User className="text-blue-200 text-sm" />
                  <div>
                    <p className="text-xs text-blue-200">Name</p>
                    <p className="font-semibold text-sm truncate">{session.user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl">
                  <Mail className="text-blue-200 text-sm" />
                  <div>
                    <p className="text-xs text-blue-200">Email</p>
                    <p className="font-semibold text-sm truncate">{session.user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl">
                  <Phone className="text-blue-200 text-sm" />
                  <div>
                    <p className="text-xs text-blue-200">Phone</p>
                    <p className="font-semibold text-sm truncate">{session.user.phone || '+254712345678'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/30 hover:border-white/50"
                >
                  <LogOut className="text-sm" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <button
          onClick={() => fetchAdmins(true)}
          disabled={refreshing}
          className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md p-4 text-sm"
        >
          {refreshing ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <RefreshCw className="text-lg" />
          )}
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
        
        <button
          onClick={exportToCSV}
          className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md p-4 text-sm"
        >
          <Download className="text-lg" />
          Export CSV
        </button>
        
        <button
          onClick={handleCreateAdmin}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-xl p-4 text-sm"
        >
          <Plus className="text-lg" />
          Add New Admin
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
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
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
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="+254700000000"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-sm">Role *</label>
                  <select
                    required
                    value={adminData.role}
                    onChange={(e) => setAdminData({ ...adminData, role: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
                      className="w-4 h-4 rounded cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
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
                      className="w-4 h-4 rounded cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
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