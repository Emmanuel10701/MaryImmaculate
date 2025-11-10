'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiBriefcase,
  FiGraduationCap,
  FiCalendar,
  FiAward,
  FiShare2,
  FiArrowLeft,
  FiGlobe,
  FiLinkedin,
  FiTwitter,
  FiUsers,
  FiBook
} from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Simple icon fallbacks
const IoSchoolOutline = FiBook;
const IoPeopleOutline = FiUsers;
const IoRibbonOutline = FiAward;

// Sample data - in real app, this would come from API/database
const profileDatabase = {
  // Alumni Profiles
  'james-mwandy': {
    id: 'james-mwandy',
    name: 'JAMES MWANDY',
    type: 'alumni',
    graduationYear: 2018,
    currentPosition: 'Software Engineer',
    company: 'Google',
    location: 'Nairobi, Kenya',
    email: 'james.mwandy@example.com',
    phone: '+254 712 345 678',
    bio: 'Former student at Katwanyaa High School where I developed my passion for technology and innovation. Currently working as a Software Engineer at Google, specializing in web technologies and cloud computing. My time at Katwanyaa laid the foundation for my career in tech through excellent STEM programs and dedicated teachers.',
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    achievements: [
      'Valedictorian - Class of 2018',
      'National Science Fair Winner 2017',
      'Google Developer Expert 2022',
      'Best Computer Science Student Award 2018'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Cloud Computing', 'AI/ML'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jamesmwandy',
      twitter: 'https://twitter.com/jamesmwandy',
      portfolio: 'https://jamesmwandy.dev'
    },
    katwanyaaMemories: [
      'Head of Science Club 2017-2018',
      'Member of winning Robotics Team 2017',
      'School Prefect 2018'
    ],
    education: [
      {
        institution: 'University of Nairobi',
        degree: 'BSc Computer Science',
        period: '2019-2023',
        achievements: ['First Class Honors', 'Best Final Year Project']
      },
      {
        institution: 'Katwanyaa High School',
        degree: 'KCSE',
        period: '2014-2018',
        achievements: ['Grade A', 'Best in Mathematics & Sciences']
      }
    ]
  },
  'jane-mwende': {
    id: 'jane-mwende',
    name: 'JANE MWENDE',
    type: 'alumni',
    graduationYear: 2019,
    currentPosition: 'Medical Doctor',
    company: 'Kenyatta National Hospital',
    location: 'Nairobi, Kenya',
    email: 'jane.mwende@example.com',
    phone: '+254 723 456 789',
    bio: 'Medical professional passionate about community health and healthcare innovation. My journey in medicine started at Katwanyaa High School through the excellent science program and mentorship from dedicated teachers.',
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    achievements: [
      'Top Medical School Graduate 2023',
      'Community Health Award 2022',
      'Best Biology Student Award 2019'
    ],
    skills: ['General Medicine', 'Community Health', 'Medical Research', 'Patient Care'],
    katwanyaaMemories: [
      'Science Club President',
      'Health & Wellness Committee',
      'Volleyball Team Captain'
    ]
  },

  // Teacher Profiles
  'john-mwangi': {
    id: 'john-mwangi',
    name: 'MR. JOHN MWANGI',
    type: 'teacher',
    position: 'Principal',
    department: 'Administration',
    yearsOfService: 15,
    location: 'Katwanyaa, Kenya',
    email: 'principal@katwanyaa.ac.ke',
    phone: '+254 722 111 113',
    bio: 'Dedicated educational leader with over 15 years of experience in school management and academic excellence. Committed to nurturing future leaders through quality education and character development.',
    image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400",
    expertise: ['Educational Leadership', 'Curriculum Development', 'Staff Management', 'Strategic Planning'],
    achievements: [
      'National School of the Year 2023',
      'Infrastructure Modernization Project Lead',
      'Best Performing Principal Award 2022'
    ],
    education: [
      {
        institution: 'Kenyatta University',
        degree: 'Masters in Educational Administration',
        period: '2015-2017'
      },
      {
        institution: 'University of Nairobi',
        degree: 'BEd Arts',
        period: '2005-2009'
      }
    ],
    responsibilities: [
      'Overall school management and administration',
      'Academic oversight and quality assurance',
      'Staff supervision and development',
      'Strategic planning and implementation'
    ]
  }
};

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params?.id) {
      const profileId = Array.isArray(params.id) ? params.id[0] : params.id;
      const profileData = profileDatabase[profileId];
      setProfile(profileData || null);
    }
  }, [params?.id]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
          {params?.id && (
            <p className="text-gray-500 text-sm mt-2">Profile ID: {params.id}</p>
          )}
        </div>
      </div>
    );
  }

  const generateAvatar = (name) => {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const color = colors[name.length % colors.length];

    return (
      <div className={`w-32 h-32 ${color} rounded-full flex items-center justify-center text-white font-bold text-3xl`}>
        {initials}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/alumni-directory" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
              <FiArrowLeft className="text-xl" />
              <span className="font-semibold">Back to Directory</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Katwanyaa High School</h1>
              <p className="text-gray-600 text-sm">Excellence in Education Since 1985</p>
            </div>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Profile Hero Section */}
      <section className="relative py-12 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-center gap-8"
          >
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {profile.image ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              ) : (
                generateAvatar(profile.name)
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{profile.name}</h1>
              
              {profile.type === 'alumni' ? (
                <div className="space-y-2">
                  <p className="text-xl text-blue-100">{profile.currentPosition}</p>
                  <p className="text-lg text-blue-200">
                    {profile.company} • Class of {profile.graduationYear}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xl text-blue-100">{profile.position}</p>
                  <p className="text-lg text-blue-200">
                    {profile.department} • {profile.yearsOfService} years of service
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                  >
                    <FiMail className="text-lg" />
                    Send Email
                  </a>
                )}
                <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 backdrop-blur-sm">
                  <FiShare2 className="text-lg" />
                  Share Profile
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-30">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto gap-8 scrollbar-hide">
            {['overview', 'achievements', 'education', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <IoPeopleOutline className="text-blue-600 text-2xl" />
                      Professional Overview
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                      {profile.bio}
                    </p>

                    {/* Katwanyaa Connection */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <IoSchoolOutline className="text-blue-600" />
                        Katwanyaa High School Connection
                      </h3>
                      {profile.type === 'alumni' ? (
                        <div>
                          <p className="text-blue-800 mb-3">
                            Graduated in {profile.graduationYear} - Contributing to the legacy of excellence
                          </p>
                          {profile.katwanyaaMemories && (
                            <div>
                              <h4 className="font-medium text-blue-900 mb-2">School Involvement:</h4>
                              <ul className="space-y-2">
                                {profile.katwanyaaMemories.map((memory, index) => (
                                  <li key={index} className="flex items-center gap-3 text-blue-700">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                    {memory}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-blue-800">
                          Dedicated educator shaping future leaders at Katwanyaa High School for {profile.yearsOfService} years
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Info */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Facts</h3>
                    <div className="space-y-4">
                      {profile.location && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FiMapPin className="text-red-500 text-lg" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.type === 'alumni' && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FiGraduationCap className="text-blue-500 text-lg" />
                          <span>Class of {profile.graduationYear}</span>
                        </div>
                      )}
                      {profile.type === 'teacher' && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FiCalendar className="text-green-500 text-lg" />
                          <span>{profile.yearsOfService} years service</span>
                        </div>
                      )}
                      {profile.company && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FiBriefcase className="text-purple-500 text-lg" />
                          <span>{profile.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills/Expertise */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {profile.type === 'alumni' ? 'Skills' : 'Areas of Expertise'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(profile.skills || profile.expertise || []).map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <IoRibbonOutline className="text-yellow-600 text-2xl" />
                  {profile.type === 'alumni' ? 'Achievements & Awards' : 'Professional Contributions'}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {(profile.achievements || []).map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                    >
                      <FiAward className="text-yellow-600 text-xl mt-1 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <IoSchoolOutline className="text-green-600 text-2xl" />
                  Education Background
                </h2>
                <div className="space-y-6">
                  {(profile.education || []).map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-6 py-2">
                      <h3 className="font-bold text-gray-900 text-lg">{edu.institution}</h3>
                      <p className="text-gray-700 font-medium">{edu.degree}</p>
                      <p className="text-gray-500 text-sm mb-2">{edu.period}</p>
                      {edu.achievements && (
                        <ul className="space-y-1">
                          {edu.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  
                  {/* Katwanyaa Education Highlight */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 mt-8">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <IoSchoolOutline className="text-green-600" />
                      Katwanyaa High School Education
                    </h3>
                    <p className="text-green-800">
                      {profile.type === 'alumni' 
                        ? `Graduated in ${profile.graduationYear} - Proud alumnus contributing to society`
                        : `Dedicated staff member since ${new Date().getFullYear() - profile.yearsOfService}`
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Contact Details */}
                  <div className="space-y-6">
                    <h3 className="font-semibold text-gray-800 text-lg">Get in Touch</h3>
                    
                    {profile.email && (
                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiMail className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Email Address</p>
                          <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                            {profile.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.phone && (
                      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FiPhone className="text-green-600 text-xl" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Phone Number</p>
                          <a href={`tel:${profile.phone}`} className="text-green-600 hover:underline">
                            {profile.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="space-y-6">
                    <h3 className="font-semibold text-gray-800 text-lg">Social Profiles</h3>
                    
                    {profile.socialLinks && (
                      <div className="space-y-4">
                        {profile.socialLinks.linkedin && (
                          <a
                            href={profile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <FiLinkedin className="text-blue-700 text-xl" />
                            <span className="font-medium text-gray-900">LinkedIn Profile</span>
                          </a>
                        )}
                        
                        {profile.socialLinks.twitter && (
                          <a
                            href={profile.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <FiTwitter className="text-blue-400 text-xl" />
                            <span className="font-medium text-gray-900">Twitter Profile</span>
                          </a>
                        )}
                        
                        {profile.socialLinks.portfolio && (
                          <a
                            href={profile.socialLinks.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <FiGlobe className="text-green-600 text-xl" />
                            <span className="font-medium text-gray-900">Personal Website</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Katwanyaa Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Katwanyaa High School</h3>
          <p className="text-gray-400 mb-6">Excellence in Education Since 1985</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>Proud Alumni & Staff Network</span>
            <span>•</span>
            <span>Building Future Leaders</span>
            <span>•</span>
            <span>Community of Excellence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}