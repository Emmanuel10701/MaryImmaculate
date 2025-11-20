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
  FiClock,
  FiUser,
  FiX,
  FiMenu,
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiAward
} from 'react-icons/fi';

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================

const DEPARTMENTS = [
  { id: 'administration', label: 'Administration', color: 'blue' },
  { id: 'sciences', label: 'Sciences', color: 'emerald' },
  { id: 'mathematics', label: 'Mathematics', color: 'orange' },
  { id: 'languages', label: 'Languages', color: 'violet' },
  { id: 'humanities', label: 'Humanities', color: 'amber' },
  { id: 'guidance', label: 'Guidance & Counseling', color: 'pink' },
  { id: 'sports', label: 'Sports & Athletics', color: 'teal' },
  { id: 'technical', label: 'Technical & IT', color: 'cyan' },
  { id: 'support', label: 'Support Staff', color: 'slate' }
];

const EXPERIENCE_RANGES = [
  { id: 'entry', label: '0 - 2 Years', min: 0, max: 2 },
  { id: 'mid', label: '3 - 5 Years', min: 3, max: 5 },
  { id: 'senior', label: '6 - 10 Years', min: 6, max: 10 },
  { id: 'expert', label: '10+ Years', min: 10, max: 99 }
];

const ITEMS_PER_PAGE = 12;

// ==========================================
// 2. UTILITY FUNCTIONS
// ==========================================

const generateSlug = (name, id) => {
  // Clean the name and create a proper slug
  const cleanName = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
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

const extractExperience = (bio) => {
  if (!bio) return 0;
  const match = bio.match(/\d+(?=\s*years?)/i);
  return match ? parseInt(match[0]) : 0;
};

// ==========================================
// 3. SUB-COMPONENTS
// ==========================================

const Badge = ({ children, color = 'slate', className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColorStyles(color)} ${className}`}>
    {children}
  </span>
);

const StaffSkeleton = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-4 p-4 border border-slate-200 rounded-xl bg-white animate-pulse">
        <div className="w-20 h-20 bg-slate-200 rounded-lg shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-10 bg-slate-200 rounded w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="border border-slate-200 rounded-2xl bg-white p-4 space-y-4 animate-pulse">
      <div className="w-full aspect-[4/5] bg-slate-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
  );
};

const Checkbox = ({ label, count, checked, onChange, color }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
      checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'
    }`}>
      {checked && <FiUser className="text-white text-xs" />}
    </div>
    <input 
      type="checkbox" 
      className="hidden" 
      checked={checked} 
      onChange={onChange} 
    />
    <span className={`flex-1 text-sm ${checked ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
      {label}
    </span>
    {count !== undefined && (
      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </label>
);

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================

export default function StaffDirectory() {
  // -- State: Data & Loading --
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- State: Filters --
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [experienceRange, setExperienceRange] = useState('all');
  
  // -- State: UI --
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // -- Data Fetching --
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/staff');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch staff data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.staff) {
          // Map API data to match our expected format
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
            experience: extractExperience(staff.bio),
            location: 'Main Campus',
            expertise: staff.expertise || [],
            bio: staff.bio,
            responsibilities: staff.responsibilities || [],
            achievements: staff.achievements || []
          }));
          
          setStaffData(mappedStaff);
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

    fetchStaffData();
  }, []);

  // -- Filter Logic --
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

      // 3. Experience
      let matchesExp = true;
      if (experienceRange !== 'all') {
        const range = EXPERIENCE_RANGES.find(r => r.id === experienceRange);
        if (range) {
          matchesExp = staff.experience >= range.min && staff.experience <= range.max;
        }
      }

      return matchesSearch && matchesDept && matchesExp;
    });
  }, [staffData, searchQuery, selectedDepts, experienceRange]);

  // -- Pagination Logic --
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStaff.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStaff, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepts, experienceRange]);

  // -- Handlers --
  const toggleDept = (id) => {
    setSelectedDepts(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDepts([]);
    setExperienceRange('all');
  };

  // -- Stats Calculation --
  const getDeptCount = (id) => staffData.filter(s => s.departmentId === id).length;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-2xl text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Staff Directory</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Mobile Filter Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <FiMenu size={24} />
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                K
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                Katwanyaa<span className="text-blue-600">Staff</span>
              </span>
            </Link>
          </div>

          {/* Top Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, or expertise..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                aria-label="Grid View"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                aria-label="List View"
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTERS */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 w-[280px] bg-white lg:bg-transparent z-50 transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none overflow-y-auto lg:overflow-visible border-r lg:border-r-0 border-slate-200
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="p-6 lg:p-0 lg:sticky lg:top-24 space-y-6">
              
              <div className="flex items-center justify-between lg:hidden mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <FiX size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="lg:hidden mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search staff..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Departments Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FiBriefcase className="text-slate-500" /> Departments
                  </h3>
                  {selectedDepts.length > 0 && (
                    <button 
                      onClick={() => setSelectedDepts([])}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                  {DEPARTMENTS.map((dept) => (
                    <Checkbox
                      key={dept.id}
                      label={dept.label}
                      count={getDeptCount(dept.id)}
                      checked={selectedDepts.includes(dept.id)}
                      onChange={() => toggleDept(dept.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Experience Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FiClock className="text-slate-500" /> Experience
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="experience" 
                      className="text-blue-600 focus:ring-blue-500"
                      checked={experienceRange === 'all'}
                      onChange={() => setExperienceRange('all')}
                    />
                    <span className="text-sm text-slate-700">Any Experience</span>
                  </label>
                  {EXPERIENCE_RANGES.map((range) => (
                    <label key={range.id} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="experience"
                        className="text-blue-600 focus:ring-blue-500"
                        checked={experienceRange === range.id}
                        onChange={() => setExperienceRange(range.id)}
                      />
                      <span className="text-sm text-slate-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {(selectedDepts.length > 0 || experienceRange !== 'all' || searchQuery) && (
                 <button
                  onClick={clearAllFilters}
                  className="w-full py-3 rounded-lg border border-dashed border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all text-sm font-medium flex items-center justify-center gap-2"
                 >
                   <FiX /> Clear All Filters
                 </button>
              )}

            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            
            {/* Results Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Staff Directory</h1>
                <p className="text-slate-500 text-sm mt-1">
                  {loading ? 'Loading...' : `Showing ${filteredStaff.length} members`}
                  {!loading && filteredStaff.length !== staffData.length && ` (filtered from ${staffData.length})`}
                </p>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative inline-block">
                <select className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm hover:border-slate-300">
                  <option>Sort by Name (A-Z)</option>
                  <option>Sort by Role</option>
                  <option>Most Experienced</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* STAFF LISTING */}
            {loading ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {[...Array(6)].map((_, i) => <StaffSkeleton key={i} viewMode={viewMode} />)}
              </div>
            ) : filteredStaff.length > 0 ? (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    {paginatedStaff.map((staff) => {
                      const deptConfig = DEPARTMENTS.find(d => d.id === staff.departmentId);
                      
                      return (
                        <div 
                          key={staff.id}
                          className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col h-full"
                        >
                          {/* Card Image Area */}
                          <div className="relative h-56 bg-slate-100 overflow-hidden">
                            <Image
                              src={getImageSrc(staff)}
                              alt={staff.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={(e) => {
                                e.target.src = '/images/default-staff.jpg';
                              }}
                            />
                            <div className="absolute top-3 right-3">
                              <Badge color={deptConfig?.color}>{staff.department}</Badge>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5 flex flex-col flex-1">
                            <div className="mb-4">
                              <Link href={`/pages/staff/${generateSlug(staff.name, staff.id)}`}>
                                <h3 className="text-lg font-bold text-slate-900 mb-1 hover:text-blue-600 transition-colors line-clamp-1">
                                  {staff.name}
                                </h3>
                              </Link>
                              <p className="text-blue-600 font-medium text-sm mb-2">{staff.position}</p>
                              <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <span className="flex items-center gap-1"><FiMapPin size={10}/> {staff.location}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="flex items-center gap-1">
                                  <FiClock size={10}/> {staff.experience || 0}y Exp
                                </span>
                              </div>
                            </div>

                            {/* Expertise Tags */}
                            {staff.expertise && staff.expertise.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-6">
                                {staff.expertise.slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] uppercase tracking-wider font-semibold rounded-md border border-slate-100">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Action Footer */}
                            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                              {staff.email && (
                                <a 
                                  href={`mailto:${staff.email}`}
                                  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-700 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 border border-transparent transition-all"
                                >
                                  <FiMail /> Email
                                </a>
                              )}
                              <Link
                                href={`/staff/${generateSlug(staff.name, staff.id)}`}
                                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-slate-300 hover:bg-slate-50 transition-all"
                              >
                                Profile <FiArrowRight size={14}/>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    {paginatedStaff.map((staff) => {
                      const deptConfig = DEPARTMENTS.find(d => d.id === staff.departmentId);
                      return (
                        <div 
                          key={staff.id}
                          className="group bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row gap-6 items-center hover:border-blue-300 transition-all hover:shadow-md"
                        >
                          <div className="relative w-full md:w-24 h-24 rounded-full md:rounded-lg overflow-hidden shrink-0 bg-slate-100">
                            <Image
                              src={getImageSrc(staff)}
                              alt={staff.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.target.src = '/images/default-staff.jpg';
                              }}
                            />
                          </div>

                          <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">
                                <Link href={`/staff/${generateSlug(staff.name, staff.id)}`} className="hover:text-blue-600">
                                  {staff.name}
                                </Link>
                              </h3>
                              <Badge color={deptConfig?.color} className="mx-auto md:mx-0 w-fit">{staff.department}</Badge>
                            </div>
                            <p className="text-blue-600 font-medium text-sm mb-2">{staff.position}</p>
                            <p className="text-slate-500 text-sm line-clamp-1 max-w-2xl">{staff.bio}</p>
                          </div>

                          <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                            {staff.email && (
                              <a 
                                href={`mailto:${staff.email}`}
                                className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors"
                              >
                                <FiMail /> <span className="md:hidden lg:inline">Email</span>
                              </a>
                            )}
                            <Link
                              href={`/staff/${generateSlug(staff.name, staff.id)}`}
                              className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors"
                            >
                              <FiUser /> <span className="md:hidden lg:inline">Profile</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
                    <div className="hidden sm:block text-sm text-slate-500">
                      Page <span className="font-medium text-slate-900">{currentPage}</span> of <span className="font-medium text-slate-900">{totalPages}</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-center">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <FiArrowLeft /> Previous
                      </button>
                      <div className="flex gap-1">
                        {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                          let pageNum = i + 1; 
                          if(totalPages > 5 && currentPage > 3) pageNum = currentPage - 2 + i;
                          if(pageNum > totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNum 
                                  ? 'bg-blue-600 text-white' 
                                  : 'text-slate-600 hover:bg-slate-100'
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
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Next <FiArrowRight />
                      </button>
                    </div>
                  </div>
                )}

              </>
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <FiSearch className="text-3xl text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No staff members found</h3>
                <p className="text-slate-500 max-w-md mb-8">
                  We couldn't find anyone matching your current filters. Try searching for a different name or clearing your filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-blue-600/20"
                >
                  Clear All Filters
                </button>
              </div>
            )}
            
          </main>
        </div>
      </div>
    </div>
  );
}