'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiMail, 
  FiPhone, 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiChevronDown, 
  FiChevronRight, 
  FiBriefcase,
  FiUser,
  FiX,
  FiMenu,
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiAward,
  FiStar,
  FiBook,
  FiTarget,
  FiUsers,
  FiBookOpen,
  FiRefreshCw  // Added for refresh button
} from 'react-icons/fi';

// ==========================================
// 1. ENHANCED CONFIGURATION WITH HIERARCHY
// ==========================================

const STAFF_HIERARCHY = [
  {
    level: 'leadership',
    label: 'School Leadership',
    color: 'blue',
    icon: '👑',
    positions: ['Principal', 'Deputy Principal', 'Senior Teacher', 'Head of Department']
  },
  {
    level: 'teaching',
    label: 'Teaching Staff',
    color: 'emerald',
    icon: '📚',
    positions: ['Teacher', 'Subject Teacher', 'Class Teacher', 'Assistant Teacher']
  },
  {
    level: 'support',
    label: 'Support Staff',
    color: 'orange',
    icon: '🛠️',
    positions: ['Librarian', 'Laboratory Technician', 'Accountant', 'Secretary', 'Support Staff']
  }
];

const DEPARTMENTS = [
  { id: 'administration', label: 'Administration', color: 'blue', icon: '👑', hierarchy: 'leadership' },
  { id: 'sciences', label: 'Sciences', color: 'emerald', icon: '🔬', hierarchy: 'teaching' },
  { id: 'mathematics', label: 'Mathematics', color: 'orange', icon: '📊', hierarchy: 'teaching' },
  { id: 'languages', label: 'Languages', color: 'violet', icon: '🌐', hierarchy: 'teaching' },
  { id: 'humanities', label: 'Humanities', color: 'amber', icon: '📚', hierarchy: 'teaching' },
  { id: 'guidance', label: 'Guidance & Counseling', color: 'pink', icon: '💝', hierarchy: 'support' },
  { id: 'sports', label: 'Sports & Athletics', color: 'teal', icon: '⚽', hierarchy: 'teaching' },
  { id: 'technical', label: 'Technical & IT', color: 'cyan', icon: '💻', hierarchy: 'support' },
  { id: 'support', label: 'Support Staff', color: 'slate', icon: '🛠️', hierarchy: 'support' }
];

const ITEMS_PER_PAGE = 12;

// ==========================================
// 2. ENHANCED UTILITY FUNCTIONS WITH HIERARCHY
// ==========================================

const generateSlug = (name, id) => {
  const cleanName = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `${cleanName}-${id}`;
};

const getBadgeColorStyles = (colorName) => {
  const map = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  return map[colorName] || map.slate;
};

const getImageSrc = (staff) => {
  if (staff?.image) {
    if (staff.image.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_SITE_URL || ''}${staff.image}`;
    }
    if (staff.image.startsWith('http')) return staff.image;
  }
  return '/images/default-staff.jpg';
};

const extractExpertiseCount = (staff) => {
  return staff?.expertise?.length || 0;
};

const extractResponsibilitiesCount = (staff) => {
  return staff?.responsibilities?.length || 0;
};

const extractAchievementsCount = (staff) => {
  return staff?.achievements?.length || 0;
};

const getStaffHierarchy = (position) => {
  if (!position) return 'teaching';
  
  const positionLower = position.toLowerCase();
  if (positionLower.includes('principal') || positionLower.includes('head') || positionLower.includes('senior')) {
    return 'leadership';
  } else if (positionLower.includes('teacher') || positionLower.includes('lecturer') || positionLower.includes('tutor')) {
    return 'teaching';
  } else {
    return 'support';
  }
};

const sortStaffByHierarchy = (staff) => {
  const hierarchyOrder = { leadership: 1, teaching: 2, support: 3 };
  
  return [...staff].sort((a, b) => {
    const aHierarchy = getStaffHierarchy(a.position);
    const bHierarchy = getStaffHierarchy(b.position);
    
    if (hierarchyOrder[aHierarchy] !== hierarchyOrder[bHierarchy]) {
      return hierarchyOrder[aHierarchy] - hierarchyOrder[bHierarchy];
    }
    
    // Within same hierarchy, sort by position importance
    const positionOrder = {
      'principal': 1,
      'deputy principal': 2,
      'senior teacher': 3,
      'head of department': 4,
      'teacher': 5,
      'support staff': 6
    };
    
    const aPositionOrder = positionOrder[a.position?.toLowerCase()] || 99;
    const bPositionOrder = positionOrder[b.position?.toLowerCase()] || 99;
    
    return aPositionOrder - bPositionOrder;
  });
};

// ==========================================
// 3. ENHANCED SUB-COMPONENTS
// ==========================================

const Badge = ({ children, color = 'slate', className = '', icon }) => (
  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getBadgeColorStyles(color)} ${className}`}>
    {icon && <span className="mr-1.5">{icon}</span>}
    {children}
  </span>
);

const StaffSkeleton = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-6 p-6 border border-gray-200/50 rounded-2xl bg-white/80 animate-pulse">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4" />
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="border border-gray-200/50 rounded-3xl bg-white/80 p-6 space-y-6 animate-pulse">
      <div className="w-full aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2" />
      </div>
    </div>
  );
};

const Checkbox = ({ label, count, checked, onChange, color, icon }) => (
  <label className="flex items-center gap-4 cursor-pointer p-3 rounded-xl">
    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
      checked 
        ? 'bg-blue-600 border-blue-600' 
        : 'bg-white border-gray-300'
    }`}>
      {checked && <FiUser className="text-white text-xs" />}
    </div>
    <input 
      type="checkbox" 
      className="hidden" 
      checked={checked} 
      onChange={onChange} 
    />
    <div className="flex-1 flex items-center gap-3">
      {icon && <span className="text-lg">{icon}</span>}
      <span className={`text-sm font-medium ${checked ? 'text-gray-900' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full min-w-[2rem] text-center">
        {count}
      </span>
    )}
  </label>
);

const StatsPill = ({ icon, value, label, color = 'blue' }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200/50 shadow-sm">
    <div className="text-lg">{icon}</div>
    <div className="text-center">
      <div className="text-sm font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  </div>
);

const HierarchySection = ({ title, icon, staff, viewMode, isFirst = false }) => {
  if (!staff?.length) return null;

  return (
    <section className={isFirst ? "animate-in fade-in slide-in-from-bottom-4 duration-700" : "mt-16 sm:mt-24"}>
      {/* Header: Modern Minimalist */}
      <div className="flex items-center gap-4 mb-8 px-2">
        <div className="relative shrink-0 w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/10 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 text-2xl">{icon}</span>
        </div>
        
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">
            {title}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-blue-600 tracking-widest uppercase opacity-80">
            {staff.length} {staff.length === 1 ? 'Expert' : 'Professionals'}
          </p>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-4 hidden sm:block" />
      </div>
      
      {/* View Switcher Logic: Responsive & Zoom-Aware */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 sm:gap-8" 
          : "flex flex-col gap-4"
      }>
        {staff.map((member) => (
          <div key={member.id} className="transition-all duration-300 hover:translate-y-[-4px]">
            {viewMode === 'grid' 
              ? <StaffCard staff={member} /> 
              : <StaffListCard staff={member} />
            }
          </div>
        ))}
      </div>
    </section>
  );
};

const StaffCard = ({ staff }) => {
  const deptConfig = DEPARTMENTS.find(d => d.id === staff.departmentId);
  const hierarchy = getStaffHierarchy(staff.position);
  
  return (
    <div className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden flex flex-col h-full relative z-10 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 ">
      
      {/* Image Header with Modern Overlay */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <Image
          src={getImageSrc(staff)}
          alt={staff.name}
          fill
          className="w-full h-full object-cover object-top"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => { e.target.src = '/images/default-staff.jpg'; }}
        />
        
        {/* Glassmorphic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        {/* Department Badge - Floating Style */}
        <div className="absolute top-4 right-4 backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-3 py-1 shadow-xl">
           <Badge color={deptConfig?.color} icon={deptConfig?.icon} className="font-black uppercase tracking-wider text-[10px]">
            {staff.department}
          </Badge>
        </div>

        {/* Leadership Crown/Star */}
        {hierarchy === 'leadership' && (
          <div className="absolute top-4 left-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-2xl rotate-12 flex items-center justify-center shadow-lg border border-white/50">
              <span className="text-xl -rotate-12">👑</span>
            </div>
          </div>
        )}

        {/* Name & Position - High Contrast */}
        <div className="absolute bottom-4 left-5 right-5">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-0.5 tracking-tight drop-shadow-md">
            {staff.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="h-1 w-4 bg-blue-400 rounded-full"></span>
            <p className="text-blue-100 font-black text-xs sm:text-sm uppercase tracking-widest opacity-90">
              {staff.position}
            </p>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50/50">
        
        {/* Modern Stats Grid - "Floating Card" Style */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:border-blue-100 transition-colors">
            <span className="text-sm font-black text-blue-600">{extractExpertiseCount(staff)}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Skills</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:border-green-100 transition-colors">
            <span className="text-sm font-black text-green-600">{extractResponsibilitiesCount(staff)}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Roles</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:border-purple-100 transition-colors">
            <span className="text-sm font-black text-purple-600">{extractAchievementsCount(staff)}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Awards</span>
          </div>
        </div>

        {/* Expertise - Pill Tags */}
        {staff.expertise && staff.expertise.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {staff.expertise.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-white text-gray-600 text-[11px] font-black rounded-full border border-gray-200 shadow-sm transition-all hover:border-blue-400 hover:text-blue-600 cursor-default">
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons - High Definition */}
        <div className="mt-auto pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
          {staff.email && (
            <a 
              href={`mailto:${staff.email}`}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-black transition-all hover:bg-blue-600 active:scale-95 shadow-lg shadow-slate-200"
            >
              <FiMail size={16} /> <span>EMAIL</span>
            </a>
          )}
          <Link
            href={`/pages/staff/${staff.id}/${generateSlug(staff.name, staff.id)}`}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border-2 border-gray-900 text-gray-900 text-xs sm:text-sm font-black transition-all hover:bg-gray-900 hover:text-white active:scale-95"
          >
            <span>PROFILE</span> <FiArrowRight size={14}/>
          </Link>
        </div>
      </div>
    </div>
  );
};
const StaffListCard = ({ staff }) => {
  const deptConfig = DEPARTMENTS.find(d => d.id === staff.departmentId);
  const hierarchy = getStaffHierarchy(staff.position);
  
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/50 p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 items-center relative z-10"> {/* Added z-10 */}
      <div className="relative">
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
          <Image
            src={getImageSrc(staff)}
            alt={staff.name}
            fill
            className="object-cover"
            sizes="80px"
            onError={(e) => {
              e.target.src = '/images/default-staff.jpg';
            }}
          />
        </div>
        {hierarchy === 'leadership' && (
          <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white text-xs">⭐</span>
          </div>
        )}
      </div>

      <div className="flex-1 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {/* Updated profile link to [id]/[slug] format */}
            <Link href={`/pages/staff/${staff.id}/${generateSlug(staff.name, staff.id)}`} className="text-gray-900">
              {staff.name}
            </Link>
          </h3>
          <Badge color={deptConfig?.color} icon={deptConfig?.icon} className="mx-auto lg:mx-0 w-fit">
            {staff.department}
          </Badge>
        </div>
        <p className="text-blue-600 font-semibold text-sm sm:text-base mb-2 sm:mb-3">{staff.position}</p>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 max-w-4xl mb-3 sm:mb-4">{staff.bio}</p>
        
        {/* Quick Stats for List View */}
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <FiStar className="text-amber-500" />
            <span className="font-semibold">{extractExpertiseCount(staff)} skills</span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <FiTarget className="text-green-500" />
            <span className="font-semibold">{extractResponsibilitiesCount(staff)} roles</span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <FiAward className="text-purple-500" />
            <span className="font-semibold">{extractAchievementsCount(staff)} awards</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 shrink-0 w-full lg:w-auto">
        {staff.email && (
          <a 
            href={`mailto:${staff.email}`}
            className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs sm:text-sm font-semibold"
          >
            <FiMail /> <span className="hidden sm:inline">Email</span>
          </a>
        )}
        {/* Updated profile link to [id]/[slug] format */}
        <Link
          href={`/pages/staff/${staff.id}/${generateSlug(staff.name, staff.id)}`}
          className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 text-gray-700 text-xs sm:text-sm font-semibold"
        >
          <FiUser /> <span className="hidden sm:inline">Profile</span>
        </Link>
      </div>
    </div>
  );
};

// ==========================================
// 4. ENHANCED MAIN PAGE COMPONENT
// ==========================================

export default function StaffDirectory() {
  // -- State: Data & Loading --
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- State: Filters --
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState('all');
  
  // -- State: UI --
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // -- Data Fetching --
  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/staff');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch staff data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.staff) {
        const mappedStaff = data.staff.map(staff => ({
          id: staff.id,
          name: staff.name,
          role: staff.role,
          position: staff.position,
          department: staff.department,
          departmentId: staff.department.toLowerCase().replace(/\s+/g, '-'),
          email: staff.email,
          phone: staff.phone,
          image: staff.image,
          expertise: staff.expertise || [],
          bio: staff.bio,
          responsibilities: staff.responsibilities || [],
          achievements: staff.achievements || [],
          location: 'Mary ImmaculateSchool',
          joinDate: '2020'
        }));
        
        // Sort by hierarchy: Leadership first, then Teaching, then Support
        const sortedStaff = sortStaffByHierarchy(mappedStaff);
        setStaffData(sortedStaff);
      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (err) {
      console.error('Error fetching staff data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  // -- Enhanced Filter Logic with Hierarchy --
  const filteredStaff = useMemo(() => {
    return staffData.filter(staff => {
      // 1. Search Text
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        staff.name.toLowerCase().includes(searchLower) ||
        staff.role.toLowerCase().includes(searchLower) ||
        staff.position.toLowerCase().includes(searchLower) ||
        (staff.bio && staff.bio.toLowerCase().includes(searchLower)) ||
        staff.expertise.some(exp => exp.toLowerCase().includes(searchLower));

      // 2. Departments
      const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(staff.departmentId);

      // 3. Hierarchy
      const staffHierarchy = getStaffHierarchy(staff.position);
      const matchesHierarchy = selectedHierarchy === 'all' || selectedHierarchy === staffHierarchy;

      return matchesSearch && matchesDept && matchesHierarchy;
    });
  }, [staffData, searchQuery, selectedDepts, selectedHierarchy]);

  // -- Group staff by hierarchy --
  const staffByHierarchy = useMemo(() => {
    const grouped = {
      leadership: filteredStaff.filter(staff => getStaffHierarchy(staff.position) === 'leadership'),
      teaching: filteredStaff.filter(staff => getStaffHierarchy(staff.position) === 'teaching'),
      support: filteredStaff.filter(staff => getStaffHierarchy(staff.position) === 'support')
    };
    return grouped;
  }, [filteredStaff]);

  // -- Enhanced Pagination Logic --
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStaff.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStaff, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepts, selectedHierarchy]);

  // -- Enhanced Handlers --
  const toggleDept = (id) => {
    setSelectedDepts(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDepts([]);
    setSelectedHierarchy('all');
  };

  // -- Enhanced Stats Calculation --
  const getDeptCount = (id) => staffData.filter(s => s.departmentId === id).length;

  const departmentStats = useMemo(() => [
    { icon: '👑', value: staffByHierarchy.leadership.length, label: 'Leadership', color: 'blue' },
    { icon: '📚', value: staffByHierarchy.teaching.length, label: 'Teachers', color: 'emerald' },
    { icon: '🛠️', value: staffByHierarchy.support.length, label: 'Support Staff', color: 'orange' },
    { icon: '🏢', value: DEPARTMENTS.length, label: 'Departments', color: 'violet' }
  ], [staffByHierarchy]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full mx-auto p-6 sm:p-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <FiUser className="text-2xl sm:text-3xl text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Error Loading Staff Directory</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-lg w-full sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-gray-900">
      
      {/* Mobile Filter Drawer Overlay - Fixed z-index and opacity */}
      {isSidebarOpen && (
        <div 
    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" // Keep this at z-40 (below navbar)
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ENHANCED HEADER SECTION */}
<header className="bg-white border-b border-gray-200/50 sticky top-0 z-80"> {/* Increased from z-50 to z-60 */} 
       <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600"
            >
              <FiMenu size={20} />
            </button>
            
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                MI
              </div>
              <div className="hidden sm:block">
                <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  Mary Immaculate Staff
                </span>
                <p className="text-xs text-gray-500 mt-0.5">Prayer, Discipline and Hardwork</p>
              </div>
            </Link>
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 sm:mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-base sm:text-lg" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, expertise..."
                className="block w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl sm:rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Added Refresh Button */}
            <button
              onClick={fetchStaffData}
              className="p-2 sm:p-2.5 text-gray-600 hover:text-blue-600 transition-colors"
              title="Refresh staff data"
              aria-label="Refresh"
            >
              <FiRefreshCw size={18} />
            </button>
            
            <div className="hidden sm:flex bg-white p-1 rounded-2xl border border-gray-200/50 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 sm:p-3 rounded-xl ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg' 
                    : 'text-gray-500'
                }`}
                aria-label="Grid View"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 sm:p-3 rounded-xl ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg' 
                    : 'text-gray-500'
                }`}
                aria-label="List View"
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          
        <aside className={`
            fixed lg:static inset-y-0 left-0 w-80 bg-white transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none overflow-y-auto lg:overflow-visible border-r lg:border-r-0 border-gray-200/50
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
  <div className="p-4 sm:p-6 lg:p-0 lg:sticky lg:top-24 space-y-6">
    
    {/* Mobile Header: High Contrast */}
    <div className="flex items-center justify-between lg:hidden pb-4 border-b border-gray-100">
      <h2 className="text-xl font-black text-gray-900 tracking-tight">FILTERS</h2>
      <button 
        onClick={() => setIsSidebarOpen(false)} 
        className="p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <FiX size={24} />
      </button>
    </div>

    {/* Mobile Search: Bold & Accessible */}
    <div className="lg:hidden">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search staff members..."
          className="w-full px-4 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-base font-medium"
        />
      </div>
    </div>

    {/* Hierarchy Filter: "Button Style" Selection */}
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
      <div className="p-5 bg-slate-900 border-b border-slate-800">
        <h3 className="font-black text-white flex items-center gap-3 text-sm uppercase tracking-widest">
          <FiUsers className="text-blue-400" /> 
          Staff Hierarchy
        </h3>
      </div>
      <div className="p-3 space-y-1">
        {/* All Staff Option */}
        <button
          onClick={() => setSelectedHierarchy('all')}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
            selectedHierarchy === 'all' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
            : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <span className="text-sm font-black uppercase tracking-tight">All Staff</span>
          <span className={`text-[10px] font-black px-2 py-1 rounded-md ${selectedHierarchy === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>
            {staffData.length}
          </span>
        </button>

        {STAFF_HIERARCHY.map((level) => (
          <button
            key={level.level}
            onClick={() => setSelectedHierarchy(level.level)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
              selectedHierarchy === level.level 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{level.icon}</span>
              <span className="text-sm font-black uppercase tracking-tight">{level.label}</span>
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded-md ${selectedHierarchy === level.level ? 'bg-white/20' : 'bg-gray-100'}`}>
               {staffByHierarchy[level.level]?.length || 0}
            </span>
          </button>
        ))}
      </div>
    </div>

    {/* Enhanced Departments Section */}
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
      <div className="p-5 bg-white border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-black text-gray-900 flex items-center gap-3 text-sm uppercase tracking-widest">
          <FiBriefcase className="text-blue-600" /> 
          Departments
        </h3>
        {selectedDepts.length > 0 && (
          <button 
            onClick={() => setSelectedDepts([])}
            className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-tighter bg-red-50 px-2 py-1 rounded-md"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Scrollable container with hidden scrollbar */}
      <div className="p-3 space-y-1 max-h-[350px] overflow-y-auto scrollbar-hide">
        {DEPARTMENTS.map((dept) => (
          <div 
            key={dept.id}
            onClick={() => toggleDept(dept.id)}
            className={`cursor-pointer flex items-center justify-between p-3 rounded-xl border transition-all ${
              selectedDepts.includes(dept.id)
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-transparent hover:bg-gray-50'
            }`}
          >
             <div className="flex items-center gap-3 min-w-0">
                <span className={`p-2 rounded-lg ${selectedDepts.includes(dept.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {dept.icon}
                </span>
                <span className="text-sm font-bold text-gray-700 truncate">{dept.label}</span>
             </div>
             <span className="text-[10px] font-black text-gray-400 ml-2">
                {getDeptCount(dept.id)}
             </span>
          </div>
        ))}
      </div>
    </div>

    {/* Clear All - Modern Floating Style */}
    {(selectedDepts.length > 0 || searchQuery || selectedHierarchy !== 'all') && (
       <button
        onClick={clearAllFilters}
        className="w-full py-4 rounded-2xl bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
       >
         <FiX size={16} /> Reset All
       </button>
    )}

  </div>
</aside>

          {/* ENHANCED MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0 relative z-10"> {/* Added z-10 */}
            
            {/* Enhanced Results Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                  Meet Our Team
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg">
                  {loading ? 'Discovering our talented educators...' : `Showing ${filteredStaff.length} dedicated professionals`}
                  {!loading && filteredStaff.length !== staffData.length && (
                    <span className="text-blue-600 font-semibold"> • Filtered from {staffData.length}</span>
                  )}
                </p>
              </div>
              
              {/* Enhanced Sort Dropdown */}
              <div className="relative w-full lg:w-auto">
                <select className="appearance-none bg-white border border-gray-200/50 pl-3 sm:pl-5 pr-8 sm:pr-12 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm w-full">
                  <option>Sort by Hierarchy</option>
                  <option>Sort by Name (A-Z)</option>
                  <option>Sort by Department</option>
                  <option>Most Expertise</option>
                </select>
                <FiChevronDown className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm sm:text-lg" />
              </div>
            </div>

            {/* Enhanced Statistics Cards */}
            {!loading && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {departmentStats.map((stat, index) => (
                  <StatsPill
                    key={index}
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                    color={stat.color}
                  />
                ))}
              </div>
            )}

            {/* ENHANCED STAFF LISTING WITH HIERARCHY */}
            {loading ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" : "space-y-4 sm:space-y-6"}>
                {[...Array(6)].map((_, i) => <StaffSkeleton key={i} viewMode={viewMode} />)}
              </div>
            ) : filteredStaff.length > 0 ? (
              <>
                {/* Show hierarchy sections when not filtered by specific hierarchy */}
                {selectedHierarchy === 'all' ? (
                  <div className="space-y-8 sm:space-y-12">
                    <HierarchySection
                      title="School Leadership"
                      icon="👑"
                      staff={staffByHierarchy.leadership}
                      viewMode={viewMode}
                      isFirst={true}
                    />
                    <HierarchySection
                      title="Teaching Staff"
                      icon="📚"
                      staff={staffByHierarchy.teaching}
                      viewMode={viewMode}
                    />
                    <HierarchySection
                      title="Support Staff"
                      icon="🛠️"
                      staff={staffByHierarchy.support}
                      viewMode={viewMode}
                    />
                  </div>
                ) : (
                  /* Show flat list when filtered by specific hierarchy */
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {paginatedStaff.map((staff) => (
                        <StaffCard key={staff.id} staff={staff} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {paginatedStaff.map((staff) => (
                        <StaffListCard key={staff.id} staff={staff} />
                      ))}
                    </div>
                  )
                )}

                {/* Enhanced Pagination Controls */}
                {totalPages > 1 && selectedHierarchy !== 'all' && (
                  <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 border-t border-gray-200/50 pt-6 sm:pt-8">
                    <div className="text-xs sm:text-sm text-gray-500 font-medium">
                      Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
                      <span className="text-blue-600 ml-2">• {filteredStaff.length} total staff</span>
                    </div>
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <FiArrowLeft /> <span className="hidden sm:inline">Previous</span>
                      </button>
                      <div className="flex gap-1 sm:gap-2">
                        {Array.from({length: Math.min(3, totalPages)}, (_, i) => {
                          let pageNum = i + 1; 
                          if(totalPages > 3 && currentPage > 2) pageNum = currentPage - 1 + i;
                          if(pageNum > totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold ${
                                currentPage === pageNum 
                                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg' 
                                  : 'text-gray-600'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <span className="hidden sm:inline">Next</span> <FiArrowRight />
                      </button>
                    </div>
                  </div>
                )}

              </>
            ) : (
              /* ENHANCED EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 sm:px-6 text-center bg-white rounded-2xl sm:rounded-3xl border border-dashed border-gray-300 shadow-sm sm:shadow-lg">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-8 shadow-lg">
                  <FiSearch className="text-2xl sm:text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No staff members found</h3>
                <p className="text-gray-600 max-w-md text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                  We couldn't find anyone matching your current search criteria. Try adjusting your filters or search terms to discover our talented team members.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl sm:rounded-2xl font-bold shadow-lg w-full sm:w-auto"
                >
                  Clear All Filters & Search
                </button>
              </div>
            )}
            
          </main>
        </div>
      </div>
    </div>
  );
}