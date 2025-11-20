'use client';
import { useState, useEffect, useMemo } from 'react';
import { 
  FiMail, FiPhone, FiShare2, FiX, FiAward, FiUsers, 
  FiArrowLeft, FiLink, FiStar, FiClock, FiTarget, FiMapPin,
  FiBook, FiUser, FiBriefcase, FiHeart, FiGlobe
} from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const ModernLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-800">Loading Profile</h3>
      <p className="text-gray-500 mt-1 text-sm">Getting staff information...</p>
    </div>
  </div>
);

export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [staffMember, setStaffMember] = useState(null);
  const [relatedStaff, setRelatedStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const extractIdFromSlug = (slug) => {
    if (!slug) return null;
    
    const matches = slug.match(/-(\d+)$/);
    if (matches && matches[1]) {
      return parseInt(matches[1]);
    }
    
    const numberMatch = slug.match(/\d+/);
    if (numberMatch) {
      return parseInt(numberMatch[0]);
    }
    
    return null;
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        
        const staffId = extractIdFromSlug(params.id);
        
        if (!staffId) {
          setError('Invalid staff URL');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/staff');
        if (!response.ok) throw new Error('Failed to fetch staff data');
        
        const data = await response.json();
        if (data.success && data.staff) {
          const foundStaff = data.staff.find(member => member.id === staffId);
          
          if (foundStaff) {
            setStaffMember(foundStaff);
            
            const related = data.staff
              .filter(member => 
                member.department === foundStaff.department && 
                member.id !== foundStaff.id
              )
              .slice(0, 4);
            setRelatedStaff(related);
          } else {
            setError('Staff member not found');
          }
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching staff details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStaffData();
    }
  }, [params.id]);

  const generateSlug = (name, id) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '') + `-${id}`;
  };

  const socialPlatforms = [
    { name: 'Facebook', icon: '🔵', color: 'hover:bg-blue-50 border-blue-200' },
    { name: 'Twitter', icon: '🐦', color: 'hover:bg-sky-50 border-sky-200' },
    { name: 'LinkedIn', icon: '💼', color: 'hover:bg-blue-50 border-blue-200' },
    { name: 'WhatsApp', icon: '💚', color: 'hover:bg-green-50 border-green-200' },
    { name: 'Email', icon: '📧', color: 'hover:bg-red-50 border-red-200' }
  ];

  const getImageSrc = (staff) => {
    if (staff?.image) {
      if (staff.image.startsWith('/')) {
        return `${process.env.NEXT_PUBLIC_SITE_URL || ''}${staff.image}`;
      }
      if (staff.image.startsWith('http')) return staff.image;
    }
    return '/images/default-staff.jpg';
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Administration': 'from-blue-500 to-blue-600',
      'Sciences': 'from-green-500 to-green-600',
      'Mathematics': 'from-orange-500 to-orange-600',
      'Languages': 'from-purple-500 to-purple-600',
      'Humanities': 'from-amber-500 to-amber-600',
      'Guidance': 'from-pink-500 to-pink-600',
      'Sports': 'from-teal-500 to-teal-600',
    };
    return colors[department] || 'from-gray-500 to-gray-600';
  };

  const getExperienceYears = (bio) => {
    if (!bio) return null;
    const match = bio.match(/\d+(?=\s*years?)/i);
    return match ? parseInt(match[0]) : null;
  };

  const handleShare = (platform) => {
    const shareUrl = platform.name === 'Email' 
      ? `mailto:?subject=Meet ${staffMember.name}&body=Check out ${staffMember.name} at Katwanyaa High School: ${window.location.href}`
      : `https://${platform.name.toLowerCase()}.com/share?url=${encodeURIComponent(window.location.href)}`;
    
    platform.name === 'Email' ? window.location.href = shareUrl : window.open(shareUrl, '_blank');
    setShowShareModal(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(false);
  };

  const staffStats = useMemo(() => [
    { label: 'Experience', value: getExperienceYears(staffMember?.bio) || '5+', icon: FiClock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Expertise Areas', value: staffMember?.expertise?.length || 0, icon: FiStar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Responsibilities', value: staffMember?.responsibilities?.length || 0, icon: FiTarget, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Achievements', value: staffMember?.achievements?.length || 0, icon: FiAward, color: 'text-purple-600', bg: 'bg-purple-50' }
  ], [staffMember]);

  if (loading) return <ModernLoader />;

  if (error || !staffMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiUsers className="text-3xl text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Staff Member Not Found</h1>
          <p className="text-gray-600 mb-6 text-base">{error || 'The staff member you are looking for does not exist.'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => router.back()} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl text-sm"
            >
              Go Back
            </button>
            <Link 
              href="/staff" 
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl text-center text-sm"
            >
              View All Staff
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const experienceYears = getExperienceYears(staffMember.bio);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link 
              href="/staff" 
              className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 transition-all hover:gap-3 text-sm group"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <FiArrowLeft className="text-base" />
              </div>
              Back to Directory
            </Link>
            <button 
              onClick={() => setShowShareModal(true)}
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl text-sm"
            >
              <FiShare2 className="text-base" />
              Share Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src={getImageSrc(staffMember)}
                      alt={staffMember.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getDepartmentColor(staffMember.department)} text-white shadow-sm`}>
                      {staffMember.department}
                    </span>
                    {experienceYears && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <FiClock className="text-xs" />
                        {experienceYears}+ years
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {staffMember.name}
                  </h1>
                  
                  <p className="text-lg text-blue-600 mb-3 font-semibold">
                    {staffMember.position}
                  </p>
                  
                  <p className="text-gray-600 mb-6 max-w-3xl leading-relaxed text-base">
                    {staffMember.role} at Katwanyaa High School
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {staffStats.map((stat, index) => {
                      const IconComponent = stat.icon;
                      return (
                        <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center border border-gray-200/50 shadow-sm`}>
                          <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
                          <div className="text-gray-600 text-xs flex items-center justify-center gap-1.5 font-medium">
                            <IconComponent className={stat.color} />
                            {stat.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {staffMember.email && (
                      <a 
                        href={`mailto:${staffMember.email}`}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl text-sm"
                      >
                        <FiMail className="text-base" />
                        Send Email
                      </a>
                    )}
                    {staffMember.phone && (
                      <a 
                        href={`tel:${staffMember.phone}`}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl text-sm"
                      >
                        <FiPhone className="text-base" />
                        Call Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Professional Profile */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser className="text-blue-600 text-lg" />
                  Professional Profile
                </h2>
                <p className="text-gray-700 leading-relaxed text-base mb-6">
                  {staffMember.bio}
                </p>

                {/* Key Responsibilities */}
                {staffMember.responsibilities && staffMember.responsibilities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiTarget className="text-green-600 text-base" />
                      Key Responsibilities
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {staffMember.responsibilities.map((resp, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200/50 hover:shadow-sm transition-all">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm font-medium">{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Areas of Expertise */}
                {staffMember.expertise && staffMember.expertise.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiStar className="text-amber-600 text-base" />
                      Areas of Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {staffMember.expertise.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-medium border border-blue-200 hover:shadow-sm transition-all text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional Journey */}
                {staffMember.achievements && staffMember.achievements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiAward className="text-purple-600 text-base" />
                      Professional Journey
                    </h3>
                    <div className="space-y-3">
                      {staffMember.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200/50 hover:shadow-sm transition-all">
                          <FiAward className="text-purple-600 text-base mt-0.5 flex-shrink-0" />
                          <p className="text-purple-800 text-sm font-medium">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiGlobe className="text-gray-600 text-base" />
                  Quick Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200/50">
                    <span className="text-gray-600 font-medium text-sm">Department</span>
                    <span className="text-gray-900 font-semibold text-sm">{staffMember.department}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200/50">
                    <span className="text-gray-600 font-medium text-sm">Position</span>
                    <span className="text-gray-900 font-semibold text-sm">{staffMember.position}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200/50">
                    <span className="text-gray-600 font-medium text-sm">Role</span>
                    <span className="text-gray-900 font-semibold text-sm">{staffMember.role}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiMail className="text-gray-600 text-base" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {staffMember.email && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200/50">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FiMail className="text-white text-base" />
                      </div>
                      <div className="flex-1">
                        <a 
                          href={`mailto:${staffMember.email}`}
                          className="text-green-800 hover:text-green-600 font-semibold block text-sm"
                        >
                          {staffMember.email}
                        </a>
                        <span className="text-green-600 text-xs">Email Address</span>
                      </div>
                    </div>
                  )}
                  {staffMember.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200/50">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FiPhone className="text-white text-base" />
                      </div>
                      <div className="flex-1">
                        <a 
                          href={`tel:${staffMember.phone}`}
                          className="text-blue-800 hover:text-blue-600 font-semibold block text-sm"
                        >
                          {staffMember.phone}
                        </a>
                        <span className="text-blue-600 text-xs">Phone Number</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members */}
              {relatedStaff.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiUsers className="text-gray-600 text-base" />
                    Team Members
                  </h3>
                  <div className="space-y-3">
                    {relatedStaff.map((related) => (
                      <Link 
                        key={related.id} 
                        href={`/staff/${generateSlug(related.name, related.id)}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200/50 hover:bg-gray-100 hover:shadow-sm transition-all group"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                          <Image 
                            src={getImageSrc(related)} 
                            alt={related.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
                            {related.name}
                          </p>
                          <p className="text-gray-600 truncate text-xs">{related.position}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200/50">
            <div className="p-5 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Share Profile</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="text-gray-600 text-lg" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-5">
                {socialPlatforms.map((platform, index) => (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className={`p-4 rounded-xl bg-white border ${platform.color} transition-all flex flex-col items-center justify-center gap-2 hover:scale-105 hover:shadow-md`}
                  >
                    <span className="text-2xl">{platform.icon}</span>
                    <span className="text-xs font-semibold text-gray-800">{platform.name}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={copyToClipboard}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-3 border border-gray-300 hover:shadow-md text-sm"
              >
                <FiLink className="text-base" />
                Copy Profile Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}