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
  FiClock,
  FiTrendingUp,
  FiEye,
  FiExternalLink,
  FiDownload,
  FiMessageSquare,
  FiSend,
  FiCopy
} from 'react-icons/fi';
import { SiGmail } from 'react-icons/si';
import { FaGraduationCap, FaChalkboardTeacher, FaUserTie, FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaQuoteRight } from 'react-icons/fa';

export default function StaffProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // School description - enhanced
  const schoolDescription = "Marry Immculate Girls High School is a premier educational institution dedicated to empowering young women through academic excellence, character development, and holistic education. Our professional educators are committed to nurturing future leaders.";

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
      image: getImageUrl(apiData.image),
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
      ],
      // Additional enhanced data
      rating: apiData.rating || 4.7,
      studentsTaught: apiData.studentsTaught || 250,
      experienceYears: apiData.experienceYears || 8,
      publications: apiData.publications || 3
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
    const shareText = `Check out ${staff.name}'s profile - ${staff.position} at Marry Immculate Girls High School`;
    
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
        name: 'Twitter', 
        icon: <FaTwitter />, 
        color: 'bg-[#1DA1F2]', 
        link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}` 
      },
      { 
        name: 'LinkedIn', 
        icon: <FaLinkedin />, 
        color: 'bg-[#0077B5]', 
        link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}` 
      },
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
        
        {/* Modal Card */}
        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Share Profile</h3>
                <p className="text-sm text-gray-500">Share {staff.name}'s profile with others</p>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {channels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-2 p-4 ${channel.color} text-white rounded-2xl hover:opacity-90 transition-opacity`}
                >
                  {channel.icon}
                  <span className="text-xs font-semibold">{channel.name}</span>
                </a>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  readOnly
                  value={profileUrl}
                  className="flex-1 bg-gray-100 border-none rounded-xl py-3 px-4 text-sm"
                />
                <button
                  onClick={handleCopy}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm ${
                    copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          <FaGraduationCap className="absolute inset-0 m-auto text-blue-600 text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Profile</h2>
        <p className="text-gray-500 text-sm">Fetching staff information...</p>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full p-8 bg-white rounded-3xl shadow-xl">
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 font-sans">
        
        {/* Enhanced Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              <button
                onClick={() => router.push('/pages/staff')}
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <FiArrowLeft className="text-blue-600" size={18} />
                </div>
                <span className="font-semibold hidden sm:block">Back to Directory</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FaGraduationCap className="text-white" />
                </div>
                <div className="hidden md:block">
                  <h1 className="font-bold text-gray-800">Marry Immculate Girls HS</h1>
                  <p className="text-xs text-gray-500">Professional Staff Directory</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                  title="Share Profile"
                >
                  <FiShare2 size={18} />
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Print Profile"
                >
                  <FiPrinter size={18} />
                </button>
                <button 
                  onClick={() => {
                    const profileUrl = window.location.href;
                    navigator.clipboard.writeText(profileUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors relative"
                  title="Copy Profile Link"
                >
                  <FiCopy size={18} />
                  {copied && (
                    <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-bounce">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl overflow-hidden shadow-2xl mb-8">
            <div className="p-8 sm:p-12 text-white">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl bg-white">
                    {staff.image && staff.image.startsWith('http') ? (
                      <img
                        src={staff.image}
                        alt={`${staff.name} - ${staff.position}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/male.png';
                        }}
                      />
                    ) : (
                      <Image
                        src={staff.image || '/male.png'}
                        alt={`${staff.name} - ${staff.position}`}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                        priority
                      />
                    )}
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <FiCheckCircle className="text-white" size={20} />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
                      <FaChalkboardTeacher className="text-blue-200" />
                      <span className="font-semibold">{staff.department}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">{staff.name}</h1>
                    <p className="text-xl sm:text-2xl text-blue-100 font-semibold">{staff.position}</p>
                  </div>
                  
                  <p className="text-blue-100/90 text-lg leading-relaxed mb-6 max-w-3xl">
                    {staff.bio}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                      <FiCalendar className="text-blue-200" />
                      <div>
                        <div className="font-semibold">Since {staff.joinDate}</div>
                        <div className="text-xs text-blue-200/80">Experience</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                      <FiMapPin className="text-blue-200" />
                      <div>
                        <div className="font-semibold">{staff.location}</div>
                        <div className="text-xs text-blue-200/80">Location</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl w-fit">
              {['overview', 'expertise', 'achievements', 'contact'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Card */}
              {activeTab === 'overview' && (
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FiEye className="text-blue-600" />
                    Professional Overview
                  </h2>
                  <div className="space-y-6">
                    <p className="text-gray-600 leading-relaxed">
                      {staff.bio}
                    </p>
                    
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Years Experience', value: staff.experienceYears, icon: FiClock, color: 'blue' },
                        { label: 'Students Taught', value: staff.studentsTaught, icon: FiUsers, color: 'green' },
                        { label: 'Rating', value: staff.rating, icon: FiStar, color: 'amber' },
                        { label: 'Publications', value: staff.publications, icon: FiBook, color: 'purple' },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                              <stat.icon className={`text-${stat.color}-600`} />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                              <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Expertise Card */}
              {activeTab === 'expertise' && (
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FiTarget className="text-blue-600" />
                    Areas of Expertise
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {staff.expertise?.map((item, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-colors cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Card */}
              {activeTab === 'achievements' && (
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FiAward className="text-blue-600" />
                    Professional Achievements
                  </h2>
                  <div className="space-y-4">
                    {staff.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                          <FiAward className="text-white" size={16} />
                        </div>
                        <p className="text-gray-700">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Card */}
              {activeTab === 'contact' && (
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FiSend className="text-blue-600" />
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Email', value: staff.email, icon: FiMail, color: 'red', href: `mailto:${staff.email}` },
                      { label: 'Phone', value: staff.phone, icon: FiPhone, color: 'green', href: `tel:${staff.phone}` },
                      { label: 'Office Hours', value: staff.officeHours, icon: FiClock, color: 'blue' },
                      { label: 'Location', value: staff.location, icon: FiMapPin, color: 'purple' },
                    ].map((contact) => (
                      <div key={contact.label} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                        <div className={`w-12 h-12 rounded-xl bg-${contact.color}-100 flex items-center justify-center`}>
                          <contact.icon className={`text-${contact.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-500">{contact.label}</div>
                          {contact.href ? (
                            <a href={contact.href} className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                              {contact.value}
                            </a>
                          ) : (
                            <div className="text-lg font-semibold text-gray-800">{contact.value}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Skills Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FiTrendingUp className="text-blue-600" />
                  Core Skills
                </h3>
                <div className="space-y-4">
                  {staff.skills?.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{skill.name}</span>
                        <span className="text-sm font-bold text-blue-600">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsibilities Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FiBriefcase className="text-blue-600" />
                  Key Responsibilities
                </h3>
                <div className="space-y-3">
                  {staff.responsibilities?.map((responsibility, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <span className="text-gray-600">{responsibility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
                <FaQuoteRight className="text-white/20 text-4xl mb-4" />
                <p className="text-lg font-semibold italic mb-4">"{staff.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-white/30" />
                  <span className="font-semibold">{staff.name.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">Marry Immculate Girls High School</h3>
                  <p className="text-gray-400 mt-1">Excellence in Education</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => router.push('/pages/staff')}
                  className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                >
                  Staff Directory
                </button>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors"
                >
                  Back to Top
                </button>
              </div>

              <p className="text-gray-400 text-sm text-center">
                © {new Date().getFullYear()} Marry Immculate Girls High School. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Share Modal */}
      <ShareModal />
    </>
  );
}