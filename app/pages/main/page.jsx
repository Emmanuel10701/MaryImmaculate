'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiStar, 
  FiBook, 
  FiTarget, 
  FiUsers,
  FiCalendar,
  FiArrowLeft,
  FiShare2,
  FiPrinter,
  FiAward,
  FiBriefcase,
  FiTool,
  FiCheckCircle,
  FiActivity,
  FiGlobe,
  FiHome,
  FiX,
   
} from 'react-icons/fi';
import { SiGmail } from 'react-icons/si';
import { FaGraduationCap, FaChalkboardTeacher, FaUserTie, FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function StaffProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // School description - mobile shortened version
  const schoolDescription = "Marry Immculate Girls High School provides exceptional education through trained professionals dedicated to holistic student development and academic excellence.";

// In the transformStaffData function, update the image handling:
const transformStaffData = (apiData) => {
  if (!apiData) return null;
  
  // Ensure arrays exist
  const expertise = Array.isArray(apiData.expertise) ? apiData.expertise : [];
  const responsibilities = Array.isArray(apiData.responsibilities) ? apiData.responsibilities : [];
  const achievements = Array.isArray(apiData.achievements) ? apiData.achievements : [];
  
  // Generate skills safely
  const skills = expertise.slice(0, 4).map((skill, index) => ({
    name: skill || `Skill ${index + 1}`,
    level: 75 + (index * 5)
  }));

  // FIXED: Proper image URL handling
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
      return '/male.png'; // Default fallback
    }
    
    // Handle Cloudinary URLs
    if (imagePath.includes('cloudinary.com')) {
      return imagePath;
    }
    
    // Handle local paths that already start with /
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Handle external URLs
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Handle base64 images
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // If it's just a filename, return as is (Next.js will handle it from public folder)
    return imagePath;
  };

  return {
    id: apiData.id || 'unknown',
    name: apiData.name || 'Professional Educator',
    position: apiData.position || 'Dedicated Teacher',
    department: apiData.department || 'Academic Department',
    email: apiData.email || '',
    phone: apiData.phone || '',
    image: getImageUrl(apiData.image), // Use the helper function
    bio: apiData.bio || `A committed educator at Marry Immculate Girls High School with a passion for student success and educational excellence.`,
    expertise: expertise,
    responsibilities: responsibilities,
    achievements: achievements,
    quote: apiData.quote || 'Education is the most powerful weapon which you can use to change the world.',
    joinDate: apiData.createdAt 
      ? new Date(apiData.createdAt).getFullYear().toString() 
      : '2020',
    officeHours: 'Monday - Friday: 8:00 AM - 4:00 PM',
    location: apiData.department ? `${apiData.department} Department` : 'Main Academic Building',
    skills: skills.length > 0 ? skills : [
      { name: 'Pedagogy', level: 92 },
      { name: 'Curriculum', level: 85 },
      { name: 'Mentorship', level: 88 },
      { name: 'Tech Skills', level: 80 }
    ]
  };
};

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/staff/${id}`);
        
        if (!response.ok) {
          throw new Error(`Staff member not available (${response.status})`);
        }
        
        const data = await response.json();
        
        if (data.success && data.staff) {
          const transformedData = transformStaffData(data.staff);
          setStaff(transformedData);
        } else {
          throw new Error('Unable to load staff information');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStaffData();
  }, [id]);

  // SEO Head Component
  const SeoHead = () => {
    if (!staff) return null;
    
    const profileTitle = `${staff.name} - ${staff.position} at Marry Immculate Girls High School`;
    const profileDescription = staff.bio || `Meet ${staff.name}, ${staff.position} at Marry Immculate Girls High School. ${schoolDescription}`;
    const profileUrl = typeof window !== 'undefined' ? window.location.href : `https://katwanyaahighschool.edu.ke/staff/${staff.id}`;
    
    return (
      <>
        <title>{profileTitle}</title>
        <meta name="title" content={profileTitle} />
        <meta name="description" content={profileDescription} />
        <meta name="keywords" content={`${staff.name}, ${staff.position}, Marry Immculate Girls High School, teacher profile, ${staff.department}`} />
        <meta name="author" content="Marry Immculate Girls High School" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={profileUrl} />
        <meta property="og:title" content={profileTitle} />
        <meta property="og:description" content={profileDescription} />
        <meta property="og:image" content={staff.image} />
        <meta property="og:site_name" content="Marry Immculate Girls High School" />
        <meta property="profile:first_name" content={staff.name.split(' ')[0]} />
        <meta property="profile:last_name" content={staff.name.split(' ').slice(1).join(' ')} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={profileUrl} />
        <meta property="twitter:title" content={profileTitle} />
        <meta property="twitter:description" content={profileDescription} />
        <meta property="twitter:image" content={staff.image} />
        <meta property="twitter:site" content="@KatwanyaaHS" />
        
        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": staff.name,
              "jobTitle": staff.position,
              "worksFor": {
                "@type": "EducationalOrganization",
                "name": "Marry Immculate Girls High School",
                "description": schoolDescription,
                "url": "https://katwanyaahighschool.edu.ke"
              },
              "description": profileDescription,
              "url": profileUrl,
              "image": staff.image,
              "alumniOf": staff.expertise?.length > 0 ? staff.expertise : undefined,
              "knowsAbout": staff.expertise,
              "memberOf": staff.department
            })
          }}
        />
      </>
    );
  };

const ShareModal = () => {
  const [copied, setCopied] = useState(false);
  if (!showShareModal || !staff) return null;

  const profileUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out ${staff.name}'s profile - ${staff.position} at Marry Immaculate`;
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const channels = [
    { 
      name: 'WhatsApp', 
      icon: <FaWhatsapp />, 
      color: 'bg-[#25D366]', 
      link: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + profileUrl)}` 
    },
    { 
      name: 'Facebook', 
      icon: <FaFacebook />, 
      color: 'bg-[#1877F2]', 
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}` 
    },
    { 
      name: 'Instagram', 
      icon: <FaInstagram />, 
      color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]', 
      action: handleCopy 
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowShareModal(false)} />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Share</h3>
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Professional Profile</p>
            </div>
            <button onClick={() => setShowShareModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
              <FiX size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {channels.map((ch) => (
              <a 
                key={ch.name}
                href={ch.link || '#'}
                target={ch.link ? "_blank" : "_self"}
                onClick={ch.action}
                className="group flex items-center gap-4 p-2 pr-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
              >
                <div className={`w-12 h-12 ${ch.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {ch.icon}
                </div>
                <div className="flex-1">
                  <span className="block font-black text-slate-900 text-sm uppercase tracking-tight">{ch.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                    {ch.name === 'Instagram' ? 'Copy Link to Post' : `Share to ${ch.name}`}
                  </span>
                </div>
                <FiShare2 className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </a>
            ))}
          </div>

          {/* Smart Link Bar */}
          <div className="mt-8 relative">
            <input 
              readOnly 
              value={profileUrl} 
              className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-5 pr-16 text-xs font-bold text-slate-500 focus:ring-2 ring-blue-500"
            />
            <button 
              onClick={handleCopy}
              className={`absolute right-2 top-2 bottom-2 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'
              }`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Marry Immaculate Girls High School</p>
        </div>
      </div>
    </div>
  );
};

if (loading) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* Dynamic Brand Logo Loader */}
      <div className="relative mb-12">
        {/* Animated Rings */}
        <div className="absolute inset-0 rounded-[2rem] border-2 border-blue-600/20 animate-ping" />
        <div className="absolute inset-0 rounded-[2rem] border-4 border-slate-900/5 animate-pulse" />
        
        {/* Central Icon */}
        <div className="relative w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3">
          <FaGraduationCap className="text-white text-4xl animate-bounce" />
        </div>
      </div>

      {/* Loading Text with Modern Letter Spacing */}
      <div className="space-y-3">
        <h2 className="text-xs font-black tracking-[0.3em] text-slate-900 uppercase">
          Authenticating
        </h2>
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" 
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px] leading-relaxed">
          Marry Immaculate Professional Directory
        </p>
      </div>

      {/* Subtle Progress Bar */}
      <div className="mt-12 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-slate-900 w-1/3 rounded-full animate-[loading_1.5s_infinite_ease-in-out]" />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

  if (error || !staff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaUserTie className="text-2xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile Unavailable</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We're unable to retrieve this staff member's profile at the moment.
          </p>
          <button 
            onClick={() => router.push('/pages/staff')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow w-full"
          >
            Return to Staff Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SeoHead />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 font-sans">
        {/* MOBILE Header - Optimized for small screens */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40 sm:bg-white/80">
          <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
            <button
              onClick={() => router.push('/pages/staff')}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 group transition-all duration-300"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 sm:bg-gradient-to-br sm:from-blue-50 sm:to-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-blue-100">
                <FiArrowLeft className="text-blue-600 sm:text-blue-600" size={16} />
              </div>
              <span className="font-medium text-sm hidden sm:block">Back to Directory</span>
            </button>
            
            {/* School Logo/Name - Mobile Optimized */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded flex items-center justify-center">
                <FaGraduationCap className="text-white text-xs sm:text-sm" />
              </div>
              <span className="font-bold text-gray-800 text-xs sm:text-sm hidden xs:block sm:hidden md:block">
                Marry Immculate Girls HS
              </span>
              <span className="font-bold text-gray-800 hidden sm:block md:hidden">KHS</span>
              <span className="font-bold text-gray-800 hidden md:block lg:hidden">Mary Immculate</span>
              <span className="font-bold text-gray-800 hidden lg:block">Marry Immculate Girls High School</span>
            </div>

            <div className="flex gap-1 sm:gap-2">
              <button 
                onClick={() => setShowShareModal(true)}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 sm:bg-gradient-to-br sm:from-gray-100 sm:to-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-600 hover:text-blue-600"
                title="Share Profile"
              >
                <FiShare2 size={14} />
              </button>
              <button 
                onClick={() => window.print()}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 sm:bg-gradient-to-br sm:from-gray-100 sm:to-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-600 hover:text-blue-600"
                title="Print Profile"
              >
                <FiPrinter />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-8">
          {/* MOBILE Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 sm:from-blue-600 sm:via-blue-700 sm:to-indigo-800 rounded-xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl mb-4 sm:mb-8">
            <div className="relative p-4 sm:p-6 lg:p-8 xl:p-12 text-white">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                {/* Mobile Profile Image */}
                <div className="relative">
<div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 xl:w-56 xl:h-56 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden border-3 sm:border-4 border-white/30 sm:border-white/40 shadow-md sm:shadow-2xl">
  {staff.image && staff.image.startsWith('http') ? (
    <img
      src={staff.image}
      alt={`Professional portrait of ${staff.name} - ${staff.position} at Marry Immculate Girls High School`}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/male.png';
      }}
    />
  ) : (
    // For local images, use Next.js Image component
    <Image
      src={staff.image || '/male.png'}
      alt={`Professional portrait of ${staff.name} - ${staff.position} at Marry Immculate Girls High School`}
      fill
      className="object-cover"
      priority
      sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 160px, 224px"
    />
  )}
</div>
                  {/* Status Badge - Smaller on mobile */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-emerald-400 sm:bg-gradient-to-br sm:from-emerald-500 sm:to-emerald-600 rounded-full border-2 sm:border-3 border-white shadow">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full m-auto mt-1 sm:mt-1.5"></div>
                  </div>
                </div>

                {/* Mobile Profile Information */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight truncate">
                      {staff.name}
                    </h1>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full mx-auto sm:mx-0 w-fit">
                      <FaChalkboardTeacher className="text-blue-200 text-sm sm:text-base" />
                      <span className="font-semibold text-xs sm:text-sm lg:text-base">{staff.department}</span>
                    </div>
                  </div>
                  
                  <p className="text-blue-100 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6">
                    {staff.position}
                  </p>
                  
                  <p className="text-blue-100/90 leading-relaxed text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 lg:mb-8 max-w-3xl line-clamp-3 sm:line-clamp-none">
                    {staff.bio}
                  </p>

                  {/* Mobile Quick Info */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl">
                      <FiCalendar className="text-blue-200 text-xs sm:text-sm" />
                      <span className="font-medium text-xs sm:text-sm">Since {staff.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl">
                      <FiMapPin className="text-blue-200 text-xs sm:text-sm" />
                      <span className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{staff.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

{/* MODERN BENTO GRID - Zoom & Mobile Optimized */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 auto-rows-min">
  
  {/* LEFT COLUMN: Profile Context (md: 4-cols) */}
  <div className="md:col-span-4 space-y-4 sm:space-y-6 lg:space-y-8">
    
    {/* School Trust Banner - Compact & Modern */}
    <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group shadow-2xl">
      <div className="absolute -right-4 -bottom-4 text-white/5 text-8xl rotate-12 group-hover:scale-110 transition-transform duration-500">
        <FiHome />
      </div>
      <div className="relative z-10 flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
          <FiHome className="text-white text-lg" />
        </div>
        <div>
          <h3 className="font-black text-xs uppercase tracking-widest leading-tight">Marry Immaculate</h3>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Excellence in Education</p>
        </div>
      </div>
      <p className="relative z-10 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
        {schoolDescription}
      </p>
    </div>

    {/* Contact Card - High Contrast */}
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
      <h3 className="font-black text-slate-900 text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
        <FiUsers className="text-blue-600" /> Contact
      </h3>
      <div className="space-y-3">
        {[
{ 
  label: 'Email', 
  val: staff.email, 
  icon: <FiMail />, 
  color: 'red', 
  href: `https://mail.google.com/mail/?view=cm&fs=1&to=${staff.email}&su=${encodeURIComponent("Inquiry regarding " + staff.name)}` 
},          { label: 'Phone', val: staff.phone, icon: <FiPhone />, color: 'emerald', href: `tel:${staff.phone}` }
        ].map((item, i) => (
          item.val && (
            <a key={i} href={item.href} className={`flex items-center gap-4 p-3 rounded-2xl bg-${item.color}-50/50 border border-${item.color}-100 hover:bg-${item.color}-100 transition-all group`}>
              <div className={`w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                <p className="font-bold text-slate-800 text-xs truncate">{item.val}</p>
              </div>
            </a>
          )
        ))}
      </div>
    </div>

{/* Skills Card - Enhanced Neumorphic Design */}
<div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
  {/* Sublte Background Glow */}
  <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700" />
  
  <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
      <FiActivity size={16} className="animate-pulse" />
    </div> 
    Core Competencies
  </h3>

  <div className="space-y-7">
    {staff.skills?.slice(0, 4).map((skill, i) => (
      <div key={i} className="group/item relative">
        {/* Label Row */}
        <div className="flex justify-between items-center mb-2.5 px-1">
          <div className="flex flex-col">
            <span className="font-black text-[10px] uppercase tracking-wider text-slate-700 group-hover/item:text-blue-600 transition-colors">
              {skill.name}
            </span>
          </div>
          <div className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg group-hover/item:scale-110 transition-transform">
            {skill.level}%
          </div>
        </div>

        {/* Outer Track */}
        <div className="h-3 bg-slate-100 rounded-full p-[3px] shadow-inner relative overflow-hidden">
          {/* Inner Shimmering Progress */}
          <div 
            className="h-full rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative transition-all duration-[1500ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/item:from-blue-600 group-hover/item:to-indigo-600 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
            style={{ 
              width: `${skill.level}%`,
              transitionDelay: `${i * 150}ms` // Staggered entry effect
            }}
          >
            {/* Animated Highlight Streak */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Footer Indicator - Only visible on wide/zoom */}
  <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified by Academic Board</p>
    <div className="flex gap-1">
      {[1, 2, 3].map(dot => <div key={dot} className="w-1 h-1 rounded-full bg-slate-200" />)}
    </div>
  </div>

  <style jsx>{`
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `}</style>
</div>
  </div>

{/* RIGHT COLUMN: Expertise & Impact (Adaptive md: 8-cols) */}
<div className="md:col-span-8 space-y-6 sm:space-y-8 lg:space-y-10">
  
  {/* Specialized Expertise - Bento Tag Cloud */}
  <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-[5rem] transition-transform group-hover:scale-110" />
    
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 relative z-10">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-amber-200 rotate-3 group-hover:rotate-0 transition-transform">
          <FiStar />
        </div>
        <div>
          <h3 className="font-black text-2xl text-slate-900 tracking-tight uppercase">Expertise</h3>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Specialized Knowledge</p>
        </div>
      </div>
      <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {staff.expertise?.length || 0} Domains
      </div>
    </div>

    <div className="flex flex-wrap gap-3 relative z-10">
      {staff.expertise?.map((item, i) => (
        <span 
          key={i} 
          className="px-5 py-3 bg-white hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-black rounded-2xl border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg cursor-default active:scale-95"
        >
          {item}
        </span>
      ))}
    </div>
  </div>

  {/* Feature Grid: Responsibilities & Achievements */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
    
    {/* Focus Areas (Responsibilities) */}
    <div className="bg-slate-900 rounded-[3rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-blue-400 relative z-10">
        <FiBriefcase /> Focus Areas
      </h4>
      <ul className="space-y-6 relative z-10">
        {staff.responsibilities?.map((item, i) => (
          <li key={i} className="flex gap-4 items-start group/item">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-blue-500 transition-colors">
              <FiCheckCircle className="text-blue-400 group-hover/item:text-white transition-colors" size={14} />
            </div>
            <span className="text-sm font-bold text-slate-300 group-hover/item:text-white leading-relaxed transition-colors tracking-tight">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* Key Milestones (Achievements) */}
    <div className="bg-white rounded-[3rem] p-8 sm:p-10 border border-slate-100 shadow-xl relative group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[5rem] -mr-2 -mt-2 transition-all group-hover:w-32 group-hover:h-32" />
      <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-amber-600 relative z-10">
        <FiAward /> Milestones
      </h4>
      <ul className="space-y-6 relative z-10">
        {staff.achievements?.map((item, i) => (
          <li key={i} className="flex gap-4 items-start group/item">
            <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.6)] group-hover/item:scale-150 transition-transform" />
            <span className="text-sm font-bold text-slate-600 group-hover/item:text-slate-900 leading-relaxed transition-colors">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* Summary Dashboard - Optimized for High-Zoom & Mobile */}
  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
    
    {/* Dynamic Stats Row */}
    <div className="xl:col-span-7 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white flex justify-around items-center border border-white/5 shadow-2xl">
      {[
        { v: staff.expertise?.length || 0, l: 'Skills', c: 'text-blue-400' },
        { v: staff.responsibilities?.length || 0, l: 'Roles', c: 'text-emerald-400' },
        { v: 'Lvl 4', l: 'Tier', c: 'text-amber-400' }
      ].map((stat, i) => (
        <div key={i} className="text-center group">
          <div className={`text-3xl font-black mb-1 transition-transform group-hover:-translate-y-1 ${stat.c}`}>
            {stat.v}
          </div>
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            {stat.l}
          </div>
        </div>
      ))}
    </div>

    {/* Quote Card - Modern Glassmorphism */}
    <div className="xl:col-span-5 bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-blue-200">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
      <FiBook className="absolute -right-2 -top-2 text-white/10 text-7xl rotate-12" />
      
      <div className="relative z-10 h-full flex flex-col justify-center">
        <p className="text-sm font-black italic leading-relaxed mb-4 tracking-tight">
          "{staff.quote}"
        </p>
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-blue-300" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
            {staff.name.split(' ')[0]}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
        </div>

{/* MODERN BRAND FOOTER - Zoom & Mobile Optimized */}
<footer className="mt-12 sm:mt-20 border-t border-slate-100 bg-white/50 backdrop-blur-sm relative overflow-hidden">
  {/* Sublte Decorative Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 pointer-events-none" />

  <div className="max-w-7xl mx-auto px-6 py-10 sm:py-16 relative z-10">
    <div className="flex flex-col items-center justify-center space-y-6">
      
      {/* Brand Mark */}
      <div className="flex flex-col items-center group cursor-default">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-900/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
          <FaGraduationCap className="text-white text-xl sm:text-2xl" />
        </div>
        
        <div className="mt-6 text-center">
          <h4 className="font-black text-slate-900 text-sm sm:text-lg uppercase tracking-[0.3em] leading-none mb-2">
            Marry Immaculate
          </h4>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-4 bg-blue-600/30" />
            <span className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-widest">
              Girls High School
            </span>
            <div className="h-px w-4 bg-blue-600/30" />
          </div>
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-slate-400">
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-tighter">
          Excellence in Education
        </p>
        <div className="w-1 h-1 rounded-full bg-slate-200" />
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-tighter">
          Professional Staff Directory
        </p>
        <div className="w-1 h-1 rounded-full bg-slate-200" />
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-tighter text-slate-300">
          © {new Date().getFullYear()} Marry Immaculate Girls High School
        </p>
      </div>

      {/* Modern Interaction: Quick Action */}
      <div className="pt-4">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-6 py-2 rounded-full border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95"
        >
          Back to Top
        </button>
      </div>
    </div>
  </div>
</footer>
      </div>

      {/* Share Modal */}
      <ShareModal />
    </>
  );
}