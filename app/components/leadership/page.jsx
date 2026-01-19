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
import Image from "next/image"


const ModernStaffLeadership = () => {
  const [staff, setStaff] = useState([]);
  const [principal, setPrincipal] = useState(null); // Always principal
  const [featuredStaff, setFeaturedStaff] = useState(null); // Currently displayed (could be principal or other)
  const [deputyPrincipal, setDeputyPrincipal] = useState(null);
  const [randomStaff, setRandomStaff] = useState(null);
  const [randomBOM, setRandomBOM] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('principal'); // 'principal' or 'other'

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
        
        if (data.success && data.staff && Array.isArray(data.staff)) {
          setStaff(data.staff);
          
          // Find Principal (look for role or position containing "Principal")
          const foundPrincipal = data.staff.find(s => 
            (s.role && s.role.toLowerCase().includes('principal')) ||
            (s.position && s.position.toLowerCase().includes('principal'))
          ) || data.staff[0];
          
          setPrincipal(foundPrincipal);
          setFeaturedStaff(foundPrincipal); // Start with principal displayed
          
          // Find Deputy Principal
          const deputy = data.staff.find(s => 
            (s.role && s.role.toLowerCase().includes('deputy')) ||
            (s.position && s.position.toLowerCase().includes('deputy'))
          ) || data.staff.find(s => 
            s.role && s.role.toLowerCase().includes('administration') && 
            s.id !== foundPrincipal?.id
          );
          
          setDeputyPrincipal(deputy);
          
          // Find Teaching Staff (excluding principal and deputy)
          const teachingStaff = data.staff.filter(s => 
            (s.role && (s.role.toLowerCase().includes('teacher') || 
                       s.role.toLowerCase().includes('teaching'))) &&
            s.id !== foundPrincipal?.id && 
            s.id !== deputy?.id
          );
          
          // Random Teaching Staff
          if (teachingStaff.length > 0) {
            const randomIndex = Math.floor(Math.random() * teachingStaff.length);
            setRandomStaff(teachingStaff[randomIndex]);
          } else {
            // Fallback to any staff member (excluding principal and deputy)
            const otherStaff = data.staff.filter(s => 
              s.id !== foundPrincipal?.id && 
              s.id !== deputy?.id
            );
            if (otherStaff.length > 0) {
              const randomIndex = Math.floor(Math.random() * otherStaff.length);
              setRandomStaff(otherStaff[randomIndex]);
            }
          }
          
          // Find BOM Members (Board of Management)
          const bomMembers = data.staff.filter(s => 
            (s.role && s.role.toLowerCase().includes('bom')) ||
            (s.department && s.department.toLowerCase().includes('bom'))
          );
          
          // Random BOM Member (excluding principal and deputy)
          const availableBOM = bomMembers.filter(s => 
            s.id !== foundPrincipal?.id && 
            s.id !== deputy?.id
          );
          
          if (availableBOM.length > 0) {
            const randomBomIndex = Math.floor(Math.random() * availableBOM.length);
            setRandomBOM(availableBOM[randomBomIndex]);
          } else {
            // If no BOM members, use Support Staff or any other staff
            const supportStaff = data.staff.filter(s => 
              s.role && s.role.toLowerCase().includes('support') &&
              s.id !== foundPrincipal?.id && 
              s.id !== deputy?.id &&
              s.id !== randomStaff?.id
            );
            
            if (supportStaff.length > 0) {
              const randomSupportIndex = Math.floor(Math.random() * supportStaff.length);
              setRandomBOM(supportStaff[randomSupportIndex]);
            } else {
              // Fallback to any remaining staff
              const remainingStaff = data.staff.filter(s => 
                s.id !== foundPrincipal?.id && 
                s.id !== deputy?.id &&
                s.id !== randomStaff?.id
              );
              
              if (remainingStaff.length > 0) {
                const randomRemainingIndex = Math.floor(Math.random() * remainingStaff.length);
                setRandomBOM(remainingStaff[randomRemainingIndex]);
              }
            }
          }
          
        } else {
          throw new Error('Invalid staff data format');
        }
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStaff();
  }, []);

  // Handle subcard click - principal always stays as main
  const handleStaffClick = (staffMember) => {
    // If clicking on the principal, do nothing (already showing)
    if (principal?.id === staffMember.id) {
      return;
    }
    
    // Show the clicked staff member in the main card temporarily
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
    if (staffMember.position) return staffMember.position;
    if (staffMember.role) return staffMember.role;
    return 'Staff Member';
  };
if (loading) {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-6 py-20 bg-[#fafafa]">
      {/* Centered Modern Header Skeleton */}
      <div className="flex flex-col items-center mb-16 space-y-4">
        <div className="h-3 w-24 bg-indigo-100 rounded-full animate-pulse" />
        <div className="h-10 w-64 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
      
      {/* Modern Fluid Flex Layout: Better for zooming than standard grids */}
      <div className="flex flex-wrap justify-center gap-8">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="flex-1 min-w-[280px] max-w-[340px] p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
          >
            <div className="relative mb-8">
              {/* Avatar with Outer Ring */}
              <div className="w-32 h-32 mx-auto rounded-[2rem] bg-gray-100 animate-pulse rotate-3" />
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-[2rem] border-2 border-gray-50 -rotate-6 -z-10" />
            </div>
            
            <div className="space-y-3 flex flex-col items-center">
              <div className="h-6 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-lg animate-pulse" />
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 animate-pulse" />
              <div className="w-10 h-10 rounded-2xl bg-gray-50 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
if (!featuredStaff) {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
      {/* Container - Near full width on mobile, 80% on desktop */}
      <div className="w-[95%] md:max-w-[80%] min-h-[400px] md:min-h-[500px] relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-white border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center p-6 md:p-20 text-center">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-yellow-50/40 blur-[100px] -z-10" />

        {/* Branding Badge */}
        <div className="mb-6 md:mb-8">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-yellow-600 mb-2">
            Mary Immaculate Girls
          </p>
          <div className="h-1 w-10 md:w-12 bg-yellow-400 mx-auto rounded-full" />
        </div>

        {/* Main Icon - Scaled for mobile */}
        <div className="mb-6 md:mb-10 text-gray-200">
          <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        {/* Primary Content - text-2xl for mobile, text-5xl for desktop */}
        <h2 className="text-2xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 tracking-tight px-2">
          No Staff Available
        </h2>
        
        <p className="text-gray-500 text-base md:text-xl leading-relaxed max-w-xl mb-8 md:mb-12 px-4">
          "Play Your Part to Better Your Best." We are currently updating our directory for the new term. 
          Please refresh to see the latest updates.
        </p>

        {/* Refresh Button - Adjusted padding for mobile */}
        <button 
          onClick={() => window.location.reload()}
          className="group flex items-center gap-3 px-8 py-4 md:px-12 md:py-5 bg-gray-900 text-white text-sm md:text-base font-bold rounded-xl md:rounded-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-gray-200"
        >
          <svg 
            className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-180 transition-transform duration-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Gallery
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-4 md:mb-6">
            <IoPeopleOutline className="text-blue-600" />
            <span className="text-blue-700 font-bold text-xs md:text-sm uppercase tracking-widest">
              Leadership Team
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3 md:mb-4 px-2">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">School Leadership</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto px-4">
            Committed professionals dedicated to academic excellence, student development, and community engagement
          </p>
        </div>

        {/* Main Grid - Mobile: Stack, Desktop: Side-by-side */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Featured Hero Card (Principal by default) */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[600px] lg:min-h-[720px]">
            
            {/* Header with Back Button (when viewing other staff) */}
            {viewMode === 'other' && (
              <div className="absolute top-4 left-4 z-50">
                <button
                  onClick={returnToPrincipal}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-700 font-bold text-sm hover:bg-white transition-all shadow-lg border border-slate-200"
                >
                  <FiArrowLeft /> Back to Principal
                </button>
              </div>
            )}

            {/* Image Section */}
            <div className="relative h-80 md:h-96 lg:h-[40rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent z-10"></div>
              
              {featuredStaff.image ? (
                <img
                  src={featuredStaff.image.startsWith('/') ? featuredStaff.image : `/${featuredStaff.image}`}
                  alt={featuredStaff.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                  <div className="text-white text-center p-6 md:p-8">
                    <GiGraduateCap className="text-6xl md:text-8xl mx-auto opacity-40" />
                    <p className="mt-4 text-xl md:text-2xl font-black tracking-tight">{featuredStaff.name}</p>
                    <p className="mt-2 text-sm md:text-base font-medium opacity-80 uppercase tracking-widest">{getRoleTitle(featuredStaff)}</p>
                  </div>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10 lg:p-12 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <div className="transform transition-transform duration-500 hover:translate-x-2">
                  <span className={`px-4 py-1.5 ${getRoleColor(featuredStaff.role)} text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-sm inline-block mb-3 shadow-lg`}>
                    {getRoleTitle(featuredStaff)}
                    {viewMode === 'other' && ' (Viewing)'}
                  </span>
                  
                  {/* Name */}
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tighter">
                    {featuredStaff.name.split(' ')[0]} 
                    <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                      {featuredStaff.name.split(' ').slice(1).join(' ')}
                    </span>
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80 font-medium">
                    <span className="flex items-center gap-2 text-sm md:text-base">
                      <FiMapPin className="text-blue-400" />
                      {featuredStaff.department || 'Administration'}
                    </span>
                    {featuredStaff.phone && (
                      <>
                        <span className="hidden md:inline w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        <a href={`tel:${featuredStaff.phone}`} className="flex items-center gap-2 text-sm md:text-base hover:text-white transition-colors">
                          <FiPhone className="text-blue-400" />
                          {formatPhone(featuredStaff.phone)}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow p-4 md:p-6 lg:p-8 -mt-4 bg-white relative rounded-t-2xl md:rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-30">
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
                
                {/* Left Column: Bio & Details */}
                <div className="lg:col-span-3 space-y-6 md:space-y-8">
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2">
                        <FiUser className="text-blue-500" /> Professional Biography
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base lg:text-lg">
                        {featuredStaff.bio || `${featuredStaff.name} is a dedicated member of our school's leadership team with a passion for education and student development.`}
                      </p>
                    </div>

                    {featuredStaff.quote && (
                      <div className="relative p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-r-xl md:rounded-r-2xl">
                        <div className="absolute top-3 md:top-4 right-3 md:right-4 text-blue-200">
                          <FiAward className="text-2xl md:text-3xl" />
                        </div>
                        <p className="relative z-10 text-slate-700 italic font-medium leading-relaxed text-sm md:text-base">
                          "{featuredStaff.quote}"
                        </p>
                      </div>
                    )}

                    {featuredStaff.expertise && featuredStaff.expertise.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2">
                          <FiStar className="text-yellow-500" /> Areas of Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {featuredStaff.expertise.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 md:px-3 md:py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg md:rounded-xl shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Responsibilities & Contact */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  <div className="space-y-4 md:space-y-6">
                    {featuredStaff.responsibilities && featuredStaff.responsibilities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2">
                          <FiBriefcase className="text-green-500" /> Key Responsibilities
                        </h4>
                        <ul className="space-y-2 md:space-y-3">
                          {featuredStaff.responsibilities.slice(0, 5).map((item, i) => (
                            <li key={i} className="text-xs md:text-sm text-slate-700 font-medium flex items-start gap-2 md:gap-3">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 mt-1.5 md:mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-3 md:pt-4 border-t border-slate-200">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2">
                        <IoRibbonOutline className="text-amber-500" /> Notable Achievements
                      </h4>
                      <ul className="space-y-2 md:space-y-3">
                        {(featuredStaff.achievements && featuredStaff.achievements.length > 0) ? (
                          featuredStaff.achievements.slice(0, 3).map((item, i) => (
                            <li key={i} className="text-xs md:text-sm text-slate-700 font-medium flex items-start gap-2 md:gap-3">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 mt-1.5 md:mt-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-xs md:text-sm text-slate-500 italic">Contributing to educational excellence</li>
                        )}
                      </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 md:mb-4">Contact Information</h4>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FiMail className="text-blue-600 text-xs md:text-sm" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">Email Address</p>
                            <a 
                              href={`mailto:${featuredStaff.email}`}
                              className="text-blue-600 hover:text-blue-700 font-medium text-xs md:text-sm break-all truncate block"
                            >
                              {featuredStaff.email}
                            </a>
                          </div>
                        </div>
                        
                        {featuredStaff.phone && (
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                              <FiPhone className="text-green-600 text-xs md:text-sm" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Phone Number</p>
                              <a 
                                href={`tel:${featuredStaff.phone}`}
                                className="text-slate-900 hover:text-blue-600 font-medium text-xs md:text-sm"
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
          <div className="lg:col-span-4 space-y-4 md:space-y-6 mt-6 lg:mt-0">
            {/* Principal Card - Always shown and highlighted */}
            {principal && (
              <button
                onClick={() => {
                  setFeaturedStaff(principal);
                  setViewMode('principal');
                }}
                className={`w-full group relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 ${
                  viewMode === 'principal' 
                    ? 'border-amber-900 shadow-xl scale-[1.02]' 
                    : 'border-slate-100 hover:border-amber-300 hover:shadow-xl'
                } transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden">
                    {principal.image ? (
                      <img
                        src={principal.image.startsWith('/') ? principal.image : `/${principal.image}`}
                        alt={principal.name}
                        className="w-full h-full object-cover object-top group-hover:scale-100 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-indigo-900 to-purple-900 bg-fixed text-white flex items-center justify-center">
                        <FiUser className="text-white text-lg md:text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <span className="px-2 md:px-3 py-1 bg-gradient-to-br from-slate-800 via-indigo-900 to-purple-900 bg-fixed  text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Principal
                      </span>
                      {viewMode === 'principal' && (
                        <span className="flex items-center gap-1 text-amber-600 text-[10px] md:text-xs font-bold">
                          <FiCheck className="text-xs" /> Currently Viewing
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate text-base md:text-lg">
                      {principal.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 truncate">
                      {principal.department || 'Administration'}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-amber-600 mt-2 md:mt-3 font-bold tracking-tighter">
                      {viewMode === 'principal' ? '✓ Current View' : 'View Full Profile'} 
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
                className={`w-full group relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 ${
                  featuredStaff?.id === deputyPrincipal.id ? 'border-purple-500' : 'border-slate-100'
                } hover:border-purple-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden">
                    {deputyPrincipal.image ? (
                      <img
                        src={deputyPrincipal.image.startsWith('/') ? deputyPrincipal.image : `/${deputyPrincipal.image}`}
                        alt={deputyPrincipal.name}
                        className="w-full h-full object-cover object-top group-hover:scale-100 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FiUser className="text-white text-lg md:text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Deputy Principal
                      </span>
                      {featuredStaff?.id === deputyPrincipal.id && (
                        <span className="flex items-center gap-1 text-purple-600 text-[10px] md:text-xs font-bold">
                          <FiCheck className="text-xs" /> Viewing
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate text-base md:text-lg">
                      {deputyPrincipal.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 truncate">
                      {deputyPrincipal.department || 'Administration'}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-purple-600 mt-2 md:mt-3 font-bold tracking-tighter">
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
                className={`w-full group relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 ${
                  featuredStaff?.id === randomStaff.id ? 'border-green-500' : 'border-slate-100'
                } hover:border-green-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden">
                    {randomStaff.image ? (
                      <img
                        src={randomStaff.image.startsWith('/') ? randomStaff.image : `/${randomStaff.image}`}
                        alt={randomStaff.name}
                        className="w-full h-full object-cover object-top group-hover:scale-100 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <FiBookOpen className="text-white text-lg md:text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {randomStaff.role || 'Teaching Staff'}
                      </span>
                      {featuredStaff?.id === randomStaff.id && (
                        <span className="flex items-center gap-1 text-green-600 text-[10px] md:text-xs font-bold">
                          <FiCheck className="text-xs" /> Viewing
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors truncate text-base md:text-lg">
                      {randomStaff.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 truncate">
                      {randomStaff.position || randomStaff.department}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-green-600 mt-2 md:mt-3 font-bold tracking-tighter">
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
                className={`w-full group relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 ${
                  featuredStaff?.id === randomBOM.id ? 'border-amber-500' : 'border-slate-100'
                } hover:border-amber-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden">
                    {randomBOM.image ? (
                      <img
                        src={randomBOM.image.startsWith('/') ? randomBOM.image : `/${randomBOM.image}`}
                        alt={randomBOM.name}
                        className="w-full h-full object-cover object-top group-hover:scale-100 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <FiShield className="text-white text-lg md:text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {randomBOM.role?.toLowerCase().includes('support') ? 'Support Staff' : 'Staff Member'}
                      </span>
                      {featuredStaff?.id === randomBOM.id && (
                        <span className="flex items-center gap-1 text-amber-600 text-[10px] md:text-xs font-bold">
                          <FiCheck className="text-xs" /> Viewing
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate text-base md:text-lg">
                      {randomBOM.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 truncate">
                      {randomBOM.position || randomBOM.department}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-amber-600 mt-2 md:mt-3 font-bold tracking-tighter">
                      View Details <FiChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl">
                  <IoPeopleOutline className="text-lg md:text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-90 mb-1">Staff Overview</p>
                  <p className="text-xl md:text-2xl font-black">{staff.length} Team Members</p>
                </div>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm opacity-90">Leadership</span>
                  <span className="font-bold">
                    {staff.filter(s => 
                      s.role?.toLowerCase().includes('principal') || 
                      s.position?.toLowerCase().includes('principal') ||
                      s.role?.toLowerCase().includes('deputy')
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm opacity-90">Teaching Staff</span>
                  <span className="font-bold">
                    {staff.filter(s => 
                      s.role?.toLowerCase().includes('teacher') || 
                      s.role?.toLowerCase().includes('teaching')
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm opacity-90">Support Staff</span>
                  <span className="font-bold">
                    {staff.filter(s => 
                      s.role?.toLowerCase().includes('support')
                    ).length}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/20">
                <button 
                  onClick={() => window.location.href = '/pages/staff'}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 md:py-3 rounded-lg md:rounded-xl transition-colors flex items-center justify-center gap-2 text-xs md:text-sm"
                >
                  View Complete Staff Directory <FiChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Hint (only on mobile) */}
        {isMobile && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Tap on any staff card to view their profile. Tap "Back to Principal" to return to principal view.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernStaffLeadership;