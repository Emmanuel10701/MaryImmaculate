'use client';
import { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiUsers,
  FiStar,
  FiChevronRight,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiUser,
  FiCheck,
  FiMenu,
  FiX,
  FiArrowLeft
} from 'react-icons/fi';
import { IoPeopleOutline, IoRibbonOutline } from 'react-icons/io5';
import { GiGraduateCap } from 'react-icons/gi';
import CircularProgress from '@mui/material/CircularProgress';

// Helper function for image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return null;
  }
  
  // Handle null, undefined, or empty string after trim
  const trimmedPath = imagePath.trim();
  if (!trimmedPath) {
    return null;
  }
  
  if (trimmedPath.includes('cloudinary.com')) {
    return trimmedPath;
  }
  
  if (trimmedPath.startsWith('/') || trimmedPath.startsWith('http')) {
    return trimmedPath;
  }
  
  if (trimmedPath.startsWith('data:image')) {
    return trimmedPath;
  }
  
  return trimmedPath;
};

const ModernStaffLeadership = () => {
  const [staff, setStaff] = useState([]);
  const [principal, setPrincipal] = useState(null);
  const [featuredStaff, setFeaturedStaff] = useState(null);
  const [deputyPrincipal, setDeputyPrincipal] = useState(null);
  const [randomStaff, setRandomStaff] = useState(null);
  const [randomBOM, setRandomBOM] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('principal');

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch staff data from API
useEffect(() => {
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/staff');
      const data = await response.json();

      if (data.success && Array.isArray(data.staff)) {
        const allStaff = data.staff;
        setStaff(allStaff);

        // 1. Identify Principal (Mr. Muange) - Strict check to avoid Deputy overlap
        const foundPrincipal = allStaff.find(s => 
          s.position?.toLowerCase() === 'chief principal' || 
          s.role?.toLowerCase() === 'principal'
        ) || allStaff[0];

        setPrincipal(foundPrincipal);
        setFeaturedStaff(foundPrincipal);

        // 2. Identify Deputy Principal (Mr. Paul Mwanzia)
        const deputy = allStaff.find(s => 
          s.id !== foundPrincipal?.id && 
          (s.role?.toLowerCase().includes('deputy') || s.position?.toLowerCase().includes('deputy'))
        );
        setDeputyPrincipal(deputy);

        // 3. Filter out Admins to find Teaching and BOM staff
        const nonAdminStaff = allStaff.filter(s => s.id !== foundPrincipal?.id && s.id !== deputy?.id);

        // 4. Categorize Teaching Staff
        const teachingStaff = nonAdminStaff.filter(s => 
          s.role?.toLowerCase().includes('teacher') || 
          s.department?.toLowerCase().includes('science') || // Catching HODs
          s.expertise?.some(exp => exp.toLowerCase().includes('teacher'))
        );

        // 5. Categorize BOM/Support Staff
        const bomStaff = allStaff.filter(s => 
          s.role?.toLowerCase().includes('bom') || 
          s.department?.toLowerCase().includes('administration') && s.id !== foundPrincipal?.id && s.id !== deputy?.id
        );

        // 6. Set Random Featured Staff (Randomization Logic)
        if (teachingStaff.length > 0) {
          setRandomStaff(teachingStaff[Math.floor(Math.random() * teachingStaff.length)]);
        }

        if (bomStaff.length > 0) {
          setRandomBOM(bomStaff[Math.floor(Math.random() * bomStaff.length)]);
        } else {
          // Fallback if no specific BOM found
          const remaining = nonAdminStaff.filter(s => s.id !== randomStaff?.id);
          if (remaining.length > 0) setRandomBOM(remaining[0]);
        }

      } else {
        throw new Error('Format error: Expected successful staff array');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStaff();
}, []);
  // Handle subcard click
  const handleStaffClick = (staffMember) => {
    if (principal?.id === staffMember.id) {
      return; // Don't change if clicking on principal
    }
    
    setFeaturedStaff(staffMember);
    setViewMode('other');
  };

  // Function to return to principal view
  const returnToPrincipal = () => {
    setFeaturedStaff(principal);
    setViewMode('principal');
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone;
  };

  // Get role color
  const getRoleColor = (role) => {
    if (!role) return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    
    const roleLower = role.toLowerCase();
    if (roleLower.includes('principal')) return 'bg-gradient-to-br from-slate-800 via-indigo-900 to-purple-900 bg-fixed text-white';
    if (roleLower.includes('deputy')) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (roleLower.includes('teacher') || roleLower.includes('teaching')) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (roleLower.includes('bom')) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    if (roleLower.includes('support')) return 'bg-gradient-to-r from-gray-500 to-gray-700';
    if (roleLower.includes('administration')) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    return 'bg-gradient-to-r from-indigo-500 to-purple-500';
  };

  // Get role title for display
  const getRoleTitle = (staffMember) => {
    if (!staffMember) return 'Staff Member';
    if (staffMember.position) return staffMember.position;
    if (staffMember.role) return staffMember.role;
    return 'Staff Member';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center">
          <CircularProgress className="text-blue-600" size={60} />
          <p className="mt-4 text-slate-600 font-medium">Loading leadership team...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Data</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!featuredStaff || !principal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center p-8">
          <div className="text-slate-400 text-6xl mb-4">👨‍🏫</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Staff Data Available</h3>
          <p className="text-slate-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-3 sm:mb-4 md:mb-6">
            <IoPeopleOutline className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-blue-700 font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wider sm:tracking-widest">
              Leadership Team
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3 md:mb-4 px-2">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">School Leadership</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-3 sm:px-4">
            Committed professionals dedicated to academic excellence, student development, and community engagement
          </p>
        </div>

        {/* Main Grid - Mobile: Stack, Desktop: Side-by-side */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-start">
          {/* Featured Hero Card (Principal by default) */}
          <div className="lg:col-span-8 w-full mx-auto flex flex-col bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl border border-slate-100 overflow-hidden min-h-[400px] sm:min-h-[550px] md:min-h-[500px] lg:min-h-[620px]">
            
            {/* Header with Back Button (when viewing other staff) */}
            {viewMode === 'other' && (
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-50">
                <button
                  onClick={returnToPrincipal}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl text-slate-700 font-bold text-xs sm:text-sm hover:bg-white transition-all shadow-lg border border-slate-200"
                >
                  <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> 
                  <span className="whitespace-nowrap">Back to Principal</span>
                </button>
              </div>
            )}

            {/* Image Section - 80% height */}
      <div className="relative h-[60vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent z-10"></div>
              
              {getImageUrl(featuredStaff?.image) ? (
                <img
                  src={getImageUrl(featuredStaff.image)}
                  alt={featuredStaff?.name || 'Staff Member'}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(featuredStaff?.name || 'Staff')}&background=4f46e5&color=fff&bold=true&size=256`;
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                  <div className="text-white text-center p-4 sm:p-6 md:p-8">
                    <GiGraduateCap className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl mx-auto opacity-40" />
                    <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl font-black tracking-tight">{featuredStaff?.name || 'School Leadership'}</p>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base font-medium opacity-80 uppercase tracking-widest">{getRoleTitle(featuredStaff)}</p>
                  </div>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <div className="transform transition-transform duration-500 hover:translate-x-2">
                  <span className={`px-3 sm:px-4 py-1 ${getRoleColor(featuredStaff?.role)} text-white text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-sm inline-block mb-2 sm:mb-3 shadow-lg`}>
                    {getRoleTitle(featuredStaff)}
                    {viewMode === 'other' && ' (Viewing)'}
                  </span>
                  
                  {/* Name */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black text-white leading-tight tracking-tighter">
                    {featuredStaff?.name?.split(' ')[0] || 'School'} 
                    <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                      {featuredStaff?.name?.split(' ').slice(1).join(' ') || 'Leadership'}
                    </span>
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 md:mt-4 text-white/80 font-medium">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm md:text-base">
                      <FiMapPin className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4" />
                      {featuredStaff?.department || 'Administration'}
                    </span>
                    {featuredStaff?.phone && (
                      <>
                        <span className="hidden sm:inline w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></span>
                        <a href={`tel:${featuredStaff.phone}`} className="flex items-center gap-1.5 text-xs sm:text-sm md:text-base hover:text-white transition-colors">
                          <FiPhone className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4" />
                          {formatPhone(featuredStaff.phone)}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow p-3 sm:p-4 md:p-6 lg:p-8 -mt-2 sm:-mt-3 md:-mt-4 bg-white relative rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl shadow-[0_-15px_30px_rgba(0,0,0,0.03)] sm:shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-30">
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                
                {/* Left Column: Bio & Details */}
                <div className="lg:col-span-3 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                        <FiUser className="text-blue-500 w-3 h-3 sm:w-4 sm:h-4" /> Professional Biography
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                        {featuredStaff?.bio || `${featuredStaff?.name || 'This staff member'} is a dedicated member of our school's leadership team with a passion for education and student development.`}
                      </p>
                    </div>

                    {featuredStaff?.quote && (
                      <div className="relative p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-r-lg sm:rounded-r-xl md:rounded-r-2xl">
                        <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 text-blue-200">
                          <FiAward className="text-lg sm:text-xl md:text-2xl lg:text-3xl" />
                        </div>
                        <p className="relative z-10 text-slate-700 italic font-medium leading-relaxed text-sm sm:text-base">
                          "{featuredStaff?.quote}"
                        </p>
                      </div>
                    )}

                    {featuredStaff?.expertise && featuredStaff.expertise.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                          <FiStar className="text-yellow-500 w-3 h-3 sm:w-4 sm:h-4" /> Areas of Expertise
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {featuredStaff.expertise.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-3 md:py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg md:rounded-xl shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Responsibilities & Contact */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    {featuredStaff?.responsibilities && featuredStaff.responsibilities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                          <FiBriefcase className="text-green-500 w-3 h-3 sm:w-4 sm:h-4" /> Key Responsibilities
                        </h4>
                        <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
                          {featuredStaff.responsibilities.slice(0, 5).map((item, i) => (
                            <li key={i} className="text-xs md:text-sm text-slate-700 font-medium flex items-start gap-2 md:gap-3">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 mt-1 md:mt-1.5 lg:mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 sm:pt-3 md:pt-4 border-t border-slate-200">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
                        <IoRibbonOutline className="text-amber-500 w-3 h-3 sm:w-4 sm:h-4" /> Notable Achievements
                      </h4>
                      <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
                        {(featuredStaff?.achievements && featuredStaff.achievements.length > 0) ? (
                          featuredStaff.achievements.slice(0, 3).map((item, i) => (
                            <li key={i} className="text-xs md:text-sm text-slate-700 font-medium flex items-start gap-2 md:gap-3">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 mt-1 md:mt-1.5 lg:mt-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-xs md:text-sm text-slate-500 italic">Contributing to educational excellence</li>
                        )}
                      </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 mb-2 sm:mb-3 md:mb-4">Contact Information</h4>
                      <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-lg md:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FiMail className="text-blue-600 text-xs sm:text-xs md:text-sm" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500">Email Address</p>
                            <a 
                              href={`mailto:${featuredStaff?.email || ''}`}
                              className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-xs md:text-sm break-all truncate block"
                            >
                              {featuredStaff?.email || 'Email not available'}
                            </a>
                          </div>
                        </div>
                        
                        {featuredStaff?.phone && (
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-lg md:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                              <FiPhone className="text-green-600 text-xs sm:text-xs md:text-sm" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-slate-500">Phone Number</p>
                              <a 
                                href={`tel:${featuredStaff.phone}`}
                                className="text-slate-900 hover:text-blue-600 font-medium text-xs sm:text-xs md:text-sm truncate block"
                              >
                                {formatPhone(featuredStaff.phone)}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Sub-Card Sidebar */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4 md:space-y-6 mt-4 sm:mt-5 md:mt-6 lg:mt-0">
            {/* Principal Card */}
            {principal && (
              <button
                onClick={() => {
                  if (viewMode !== 'principal') {
                    setFeaturedStaff(principal);
                    setViewMode('principal');
                  }
                }}
                className={`w-full group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow border-2 ${
                  viewMode === 'principal' 
                    ? 'border-amber-900 shadow-lg sm:shadow-xl scale-[1.02]' 
                    : 'border-slate-100 hover:border-amber-300 hover:shadow-lg sm:hover:shadow-xl'
                } transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden">
                    {principal.image ? (
                      <img
                        src={getImageUrl(principal.image)}
                        alt={principal.name}
                        className="w-full h-full object-cover object-top group-hover:scale-100 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(principal.name)}&background=1e293b&color=fff&bold=true&size=128`;
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-indigo-900 to-purple-900 bg-fixed text-white flex items-center justify-center">
                        <FiUser className="text-white text-sm sm:text-lg md:text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <span className="px-2 sm:px-2.5 md:px-3 py-1 bg-gradient-to-br from-slate-800 via-indigo-900 to-purple-900 bg-fixed text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest rounded-full">
                        Principal
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate text-sm sm:text-base md:text-lg">
                      {principal.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5 sm:mt-1 truncate">
                      {principal.department || 'Administration'}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs text-amber-600 mt-1.5 sm:mt-2 md:mt-3 font-bold tracking-tighter">
                      {viewMode === 'principal' ? '✓ In Main View' : 'View Full Profile'} 
                      {viewMode !== 'principal' && <FiChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />}
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Deputy Principal Card */}
            {deputyPrincipal && (
              <button
                onClick={() => handleStaffClick(deputyPrincipal)}
                className={`w-full group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow border-2 ${
                  featuredStaff?.id === deputyPrincipal.id ? 'border-purple-500' : 'border-slate-100'
                } hover:border-purple-300 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden">
                    {deputyPrincipal.image ? (
                      <img
                        src={getImageUrl(deputyPrincipal.image)}
                        alt={deputyPrincipal.name}
                        className="w-full h-full object-cover object-top group-hover:scale-100 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(deputyPrincipal.name)}&background=8b5cf6&color=fff&bold=true&size=128`;
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FiUser className="text-white text-sm sm:text-lg md:text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <span className="px-2 sm:px-2.5 md:px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest rounded-full">
                        Deputy Principal
                      </span>
                      {featuredStaff?.id === deputyPrincipal.id && (
                        <span className="flex items-center gap-1 text-purple-600 text-[9px] sm:text-[10px] md:text-xs font-bold">
                          <FiCheck className="text-xs" /> Viewing
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate text-sm sm:text-base md:text-lg">
                      {deputyPrincipal.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5 sm:mt-1 truncate">
                      {deputyPrincipal.department || 'Administration'}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs text-purple-600 mt-1.5 sm:mt-2 md:mt-3 font-bold tracking-tighter">
                      View Profile <FiChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Random Teaching Staff Card */}
            {randomStaff && (
              <button
                onClick={() => handleStaffClick(randomStaff)}
                className={`w-full group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow border-2 ${
                  featuredStaff?.id === randomStaff.id ? 'border-green-500' : 'border-slate-100'
                } hover:border-green-300 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden">
                    {randomStaff.image ? (
                      <img
                        src={getImageUrl(randomStaff.image)}
                        alt={randomStaff.name}
                        className="w-full h-full object-cover object-top group-hover:scale-100 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(randomStaff.name)}&background=10b981&color=fff&bold=true&size=128`;
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <FiBookOpen className="text-white text-sm sm:text-lg md:text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <span className="px-2 sm:px-2.5 md:px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest rounded-full">
                        {randomStaff.role || 'Teaching Staff'}
                      </span>
                      {featuredStaff?.id === randomStaff.id && (
                        <span className="flex items-center gap-1 text-green-600 text-[9px] sm:text-[10px] md:text-xs font-bold">
                          <FiCheck className="text-xs" /> Viewing
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors truncate text-sm sm:text-base md:text-lg">
                      {randomStaff.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5 sm:mt-1 truncate">
                      {randomStaff.position || randomStaff.department}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs text-green-600 mt-1.5 sm:mt-2 md:mt-3 font-bold tracking-tighter">
                      View Profile <FiChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Random BOM/Support Staff Card */}
            {randomBOM && (
              <button
                onClick={() => handleStaffClick(randomBOM)}
                className={`w-full group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow border-2 ${
                  featuredStaff?.id === randomBOM.id ? 'border-amber-500' : 'border-slate-100'
                } hover:border-amber-300 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden">
                    {randomBOM.image ? (
                      <img
                        src={getImageUrl(randomBOM.image)}
                        alt={randomBOM.name}
                        className="w-full h-full object-cover object-top group-hover:scale-100 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(randomBOM.name)}&background=f59e0b&color=fff&bold=true&size=128`;
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <FiShield className="text-white text-sm sm:text-lg md:text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <span className="px-2 sm:px-2.5 md:px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest rounded-full">
                        {randomBOM.role?.toLowerCase().includes('support') ? 'Support Staff' : 'Staff Member'}
                      </span>
                      {featuredStaff?.id === randomBOM.id && (
                        <span className="flex items-center gap-1 text-amber-600 text-[9px] sm:text-[10px] md:text-xs font-bold">
                          <FiCheck className="text-xs" /> Viewing
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate text-sm sm:text-base md:text-lg">
                      {randomBOM.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5 sm:mt-1 truncate">
                      {randomBOM.position || randomBOM.department}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs text-amber-600 mt-1.5 sm:mt-2 md:mt-3 font-bold tracking-tighter">
                      View Details <FiChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-white">
              <div className="flex items-center gap-2 md:gap-3 mb-2.5 sm:mb-3 md:mb-4">
                <div className="p-1.5 sm:p-2 md:p-3 bg-white/20 rounded-lg sm:rounded-xl md:rounded-2xl">
                  <IoPeopleOutline className="text-base sm:text-lg md:text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] opacity-90 mb-0.5 sm:mb-1">Staff Overview</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-black">{staff.length} Team Members</p>
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm opacity-90">Leadership</span>
                  <span className="font-bold text-sm sm:text-base">
                    {staff.filter(s => 
                      s.role?.toLowerCase().includes('principal') || 
                      s.position?.toLowerCase().includes('principal') ||
                      s.role?.toLowerCase().includes('deputy')
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm opacity-90">Teaching Staff</span>
                  <span className="font-bold text-sm sm:text-base">
                    {staff.filter(s => 
                      s.role?.toLowerCase().includes('teacher') || 
                      s.role?.toLowerCase().includes('teaching')
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm opacity-90">Support Staff</span>
                  <span className="font-bold text-sm sm:text-base">
                    {staff.filter(s => 
                      s.role?.toLowerCase().includes('support')
                    ).length}
                  </span>
                </div>
              </div>
              
              <div className="mt-2.5 sm:mt-3 md:mt-4 pt-2.5 sm:pt-3 md:pt-4 border-t border-white/20">
                <button 
                  onClick={() => window.location.href = '/pages/staff'}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                >
                  <span className="truncate">View Complete Staff Directory</span> 
                  <FiChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Hint (only on mobile) */}
        {isMobile && (
          <div className="mt-6 sm:mt-8 text-center px-3">
            <p className="text-xs sm:text-sm text-slate-500">
              Tap on any staff card to view their profile. Tap "Back to Principal" to return to principal view.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernStaffLeadership;