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
  FiX
} from 'react-icons/fi';
import { IoPeopleOutline, IoRibbonOutline } from 'react-icons/io5';
import { GiGraduateCap } from 'react-icons/gi';
import CircularProgress from '@mui/material/CircularProgress';


const ModernStaffLeadership = () => {
  const [staff, setStaff] = useState([]);
  const [featuredStaff, setFeaturedStaff] = useState(null);
  const [deputyPrincipal, setDeputyPrincipal] = useState(null);
  const [randomStaff, setRandomStaff] = useState(null);
  const [randomBOM, setRandomBOM] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
          const principal = data.staff.find(s => 
            (s.role && s.role.toLowerCase().includes('principal')) ||
            (s.position && s.position.toLowerCase().includes('principal'))
          ) || data.staff[0];
          
          setFeaturedStaff(principal);
          
          // Find Deputy Principal
          const deputy = data.staff.find(s => 
            (s.role && s.role.toLowerCase().includes('deputy')) ||
            (s.position && s.position.toLowerCase().includes('deputy'))
          ) || data.staff.find(s => 
            s.role && s.role.toLowerCase().includes('administration') && 
            s.id !== principal?.id
          );
          
          setDeputyPrincipal(deputy);
          
          // Find Teaching Staff (excluding principal and deputy)
          const teachingStaff = data.staff.filter(s => 
            (s.role && (s.role.toLowerCase().includes('teacher') || 
                       s.role.toLowerCase().includes('teaching'))) &&
            s.id !== principal?.id && 
            s.id !== deputy?.id
          );
          
          // Random Teaching Staff
          if (teachingStaff.length > 0) {
            const randomIndex = Math.floor(Math.random() * teachingStaff.length);
            setRandomStaff(teachingStaff[randomIndex]);
          } else {
            // Fallback to any staff member (excluding principal and deputy)
            const otherStaff = data.staff.filter(s => 
              s.id !== principal?.id && 
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
            s.id !== principal?.id && 
            s.id !== deputy?.id
          );
          
          if (availableBOM.length > 0) {
            const randomBomIndex = Math.floor(Math.random() * availableBOM.length);
            setRandomBOM(availableBOM[randomBomIndex]);
          } else {
            // If no BOM members, use Support Staff or any other staff
            const supportStaff = data.staff.filter(s => 
              s.role && s.role.toLowerCase().includes('support') &&
              s.id !== principal?.id && 
              s.id !== deputy?.id &&
              s.id !== randomStaff?.id
            );
            
            if (supportStaff.length > 0) {
              const randomSupportIndex = Math.floor(Math.random() * supportStaff.length);
              setRandomBOM(supportStaff[randomSupportIndex]);
            } else {
              // Fallback to any remaining staff
              const remainingStaff = data.staff.filter(s => 
                s.id !== principal?.id && 
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

  // Handle subcard click
  const handleStaffClick = (staffMember) => {
    if (staffMember) {
      setFeaturedStaff(staffMember);
    }
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
    if (roleLower.includes('principal')) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
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
    <div className="min-h-[600px] w-full max-w-6xl mx-auto px-4 py-12">
      {/* Optional Header Skeleton */}
      <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-12 mx-auto" />
      
      {/* Grid of Team Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center p-6 space-y-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
            {/* Avatar Circle */}
            <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
            
            {/* Text Blocks */}
            <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-100 rounded-md animate-pulse" />
            
            {/* Social Icons Placeholder */}
            <div className="flex gap-2 pt-2">
              <div className="w-6 h-6 rounded-md bg-gray-100 animate-pulse" />
              <div className="w-6 h-6 rounded-md bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

  if (error && !featuredStaff) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to load staff data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-shadow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!featuredStaff) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">No staff data available</p>
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
          
          {/* Featured Hero Card (Principal) - Reduced width but taller image */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[600px] lg:min-h-[720px]">
            
            {/* Image Section - 50% taller */}
       {/* Image Section - Set to fill and anchor to top */}
<div className="relative h-80 md:h-96 lg:h-[40rem] overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent z-10"></div>
  
  {featuredStaff.image ? (
    <img
      src={featuredStaff.image.startsWith('/') ? featuredStaff.image : `/${featuredStaff.image}`}
      alt={featuredStaff.name}
      /* object-cover makes it fill the space, object-top ensures we see the head/shoulders */
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
  
  {/* Modernized Overlay: Darker bottom for text legibility, fading to transparent quickly */}
  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10 lg:p-12 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
    <div className="transform transition-transform duration-500 hover:translate-x-2">
      <span className={`px-4 py-1.5 ${getRoleColor(featuredStaff.role)} text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-sm inline-block mb-3 shadow-lg`}>
        {getRoleTitle(featuredStaff)}
      </span>
      
      {/* Modern Gradient Title */}
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
            {/* Deputy Principal Card - Always included */}
            {deputyPrincipal && (
              <button
                onClick={() => handleStaffClick(deputyPrincipal)}
                className={`w-full group relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 ${
                  featuredStaff?.id === deputyPrincipal.id ? 'border-blue-500' : 'border-slate-100'
                } hover:border-blue-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden">
                    {deputyPrincipal.image ? (
                      <img
                        src={deputyPrincipal.image.startsWith('/') ? deputyPrincipal.image : `/${deputyPrincipal.image}`}
                        alt={deputyPrincipal.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FiUser
                         className="text-white text-lg md:text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Deputy Principal
                      </span>
                      {featuredStaff?.id === deputyPrincipal.id && (
                        <span className="flex items-center gap-1 text-blue-600 text-[10px] md:text-xs font-bold">
                          <FiCheck className="text-xs" /> Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-base md:text-lg">
                      {deputyPrincipal.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 truncate">
                      {deputyPrincipal.department || 'Administration'}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-blue-600 mt-2 md:mt-3 font-bold tracking-tighter">
                      View Full Profile <FiChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
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
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
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
                          <FiCheck className="text-xs" /> Featured
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
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
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
                          <FiCheck className="text-xs" /> Featured
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
              Tap on any staff card to view their full profile above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernStaffLeadership;