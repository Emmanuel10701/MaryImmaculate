'use client';
import { useEffect, useState, useCallback } from 'react';
import { 
  FiArrowRight, 
  FiStar, 
  FiUsers, 
  FiPlay,
  FiCalendar,
  FiMapPin,
  FiBook,
  FiActivity,
  FiShare2,
  FiMail,
  FiUser,
  FiBookOpen,
  FiHome,
  FiPhone,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiCheckCircle,
  FiGlobe,
  FiHeart,
  FiShield,
  FiCheck,
  FiTarget as FiTargetIcon,
  FiShield as FiShieldIcon,
  FiUsers as FiUsersIcon,
  FiBook as FiBookIcon,
  FiAward,
  FiMap,
  FiGlobe as FiGlobeIcon,
  FiBookmark,
  FiBarChart2,
  FiActivity as FiActivityIcon,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiExternalLink,
  FiLoader 
} from 'react-icons/fi';
import { FiAlertCircle, FiPhoneCall } from 'react-icons/fi';
import Hero from "./components/Hero/page";
import Why from "./components/why/page";
import { Trophy, Sparkles, GraduationCap, Target, Users, Globe, BookOpen } from 'lucide-react';

import { 
  IoRocketOutline, 
  IoPeopleOutline,
  IoLibraryOutline,
  IoBusinessOutline,
  IoSparkles,
  IoSchoolOutline,
  IoStatsChart,
  IoMedalOutline,
  IoClose,
  IoHeartOutline,
  IoBulbOutline,
  IoStarOutline,
  IoRibbonOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoArrowForward,
  IoBookOutline,
  IoDesktopOutline
} from 'react-icons/io5';
import { FaCalendarAlt, FaWhatsapp, FaChalkboardTeacher  } from 'react-icons/fa';
import { 
  GiGraduateCap, 
  GiModernCity,
  GiTreeGrowth,
  GiBrain,
  GiTeacher,
  GiLightBulb,
  GiAchievement,
  GiStoneBridge,
  GiBookPile,
  GiBurningBook,
  GiRingingBell,
  GiTrophyCup,
  GiChemicalDrop,
  GiAbstract066,
  GiCircuitry
} from 'react-icons/gi';
import { BsArrowRightCircle, BsLightningCharge } from 'react-icons/bs';
import { TbUsersGroup } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

// External Components
import ChatBot from './components/chat/page';
import EnhancedEventsSection from './components/events/page';
import ModernLeadershipSection from './components/leadership/page';

export default function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState({
    events: [],
    news: [],
    staff: [],
    schoolInfo: null,
    guidanceEvents: []
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [navigationBlocked, setNavigationBlocked] = useState(true);

  const router = useRouter();

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: 'Mary Immaculate Girls Secondary School',
    image: 'https://mary-immaculate.vercel.app/ll.png',
    description: 'Premier Catholic girls secondary school in Mweiga, Nyeri County offering academic excellence and holistic development.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mweiga',
      addressLocality: 'Nyeri',
      addressRegion: 'Nyeri County',
      postalCode: '10100',
      addressCountry: 'KE'
    },
    url: 'https://mary-immaculate.vercel.app',
    telephone: '+254700000000',
    sameAs: [
      'https://facebook.com/your-school',
      'https://twitter.com/your-school',
      'https://instagram.com/your-school'
    ],
    foundingDate: '2000',
    founder: 'Catholic Diocese of Nyeri',
    numberOfStudents: '400',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Educational Programs',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Form 1-4 Secondary Education'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'STEM Programs'
          }
        }
      ]
    }
  };

  // Block automatic navigation on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigationBlocked(false);
      console.log('Navigation unblocked after 2 seconds');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Modern Marketing Descriptions with Enhanced Content
  const marketingDescriptions = {
    hero: {
      main: "Mary Immaculate Girls Secondary School",
      sub: "Where Academic Excellence Meets Character Development",
      highlights: [
        "94% KCSE Success Rate",
        "State-of-the-art Facilities",
        "Experienced Teaching Staff",
        "Comprehensive Extracurricular Programs",
        "Top University Placement",
        "Digital Learning Environment"
      ]
    },
    valueProposition: {
      main: "Transforming Education in Our Community",
      sub: "We offer a dynamic and supportive learning environment built on strong core values—empowering students with character, skills, and confidence for university success and lifelong achievement.",
      points: [
        "Integrity",
        "Discipline",
        "Holistic Growth",
        "Academic Excellence",
        "Innovation",
        "Inclusivity",
        "Creativity",
        "Leadership",
        "Citizenship",
        "Lifelong Learning",
        "Collaboration",
        "Effective Communication",
        "Emotional Intelligence",
        "Ethical Excellence",
        "Resilience",
        "Problem Solving",
        "Cultural Identity"
      ]
    },
    achievements: {
      main: "Proven Track Record of Excellence",
      sub: "Consistently ranked among top performing schools in Nyamira County and beyond",
    }
  };

  // Enhanced Hero Slides with Modern Design
  const heroSlides = [
    {
      title: "Academic Excellence",
      subtitle: "Redefined Through Innovation",
      gradient: "from-blue-500 via-cyan-400 to-purple-600",
      description: "At Mary Immaculate Girls Secondary School, we're pioneering a new era of education. With a 94% KCSE success rate and state-of-the-art STEM facilities, we're not just teaching—we're inspiring the next generation of leaders and innovators.",
      background: "bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-purple-900/70",
      image: "/student.jpg",
      stats: { 
        students: "400+ Active Learners", 
        excellence: "94% KCSE Success", 
        years: "10+ Years Excellence" 
      },
      features: ["Modern STEM Labs", "Digital Library", "Expert Faculty", "Research Programs"],
      cta: "Explore Our Programs",
      highlightColor: "blue",
      testimonial: "\"The academic rigor combined with innovative teaching transformed my child's approach to learning.\" - Parent of 2023 Graduate",
      icon: GiGraduateCap
    },
    {
      title: "Holistic Development",
      subtitle: "Nurturing Complete Individuals",
      gradient: "from-emerald-500 via-teal-400 to-green-600",
      description: "Beyond academics, we cultivate well-rounded individuals through 15+ clubs, competitive sports teams, and comprehensive life skills training. Our balanced approach ensures students develop essential competencies for lifelong success.",
      background: "bg-gradient-to-br from-emerald-900/90 via-green-900/80 to-teal-900/70",
      image: "/im.jpg",
      stats: { 
        teams: "10+ Sports Teams", 
        clubs: "15+ Clubs", 
        success: "National Awards" 
      },
      features: ["Sports Excellence", "Creative Arts", "Leadership Training", "Community Service"],
      cta: "View Our Facilities",
      highlightColor: "green",
      testimonial: "\"The extracurricular programs helped my child discover their passion for drama and develop crucial leadership skills.\" - Current Parent",
      icon: GiTrophyCup
    },
    {
      title: "Future-Ready Education",
      subtitle: "Preparing for the Digital Age",
      gradient: "from-cyan-500 via-blue-400 to-indigo-600",
      description: "Experience cutting-edge education with our technology-enhanced smart classrooms, advanced computer labs, and comprehensive digital literacy programs. We prepare students for careers in an increasingly technological world.",
      background: "bg-gradient-to-br from-cyan-900/90 via-blue-900/80 to-indigo-900/70",
      image: "/im2.jpeg",
      stats: { 
        labs: "3 Modern Labs", 
        tech: "Digital Classrooms", 
        innovation: "STEM Programs" 
      },
      features: ["Computer Studies", "Science Innovation", "Career Guidance", "Coding Classes"],
      cta: "Apply Now",
      highlightColor: "cyan",
      testimonial: "\"The advanced computer labs gave me skills that directly contributed to securing my university scholarship in Computer Science.\" - 2022 Alumni",
      icon: IoRocketOutline
    }
  ];

  // API Data Fetching - Fixed to avoid async/await in client component
  useEffect(() => {
    const fetchAllData = () => {
      try {
        setIsLoading(true);
        
        const endpoints = [
          { key: 'events', url: '/api/events' },
          { key: 'school', url: '/api/school' }
        ];

        Promise.allSettled(
          endpoints.map(endpoint => 
            fetch(endpoint.url)
              .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
              })
              .then(data => ({ key: endpoint.key, data }))
              .catch(() => ({ 
                key: endpoint.key, 
                data: null
              }))
          )
        ).then(results => {
          const fetchedData = {
            events: [],
            staff: [],
            schoolInfo: null
          };

          results.forEach(result => {
            if (result.status === 'fulfilled') {
              const { key, data } = result.value;
              if (data) {
                switch (key) {
                  case 'events':
                    fetchedData.events = data.events || [];
                    break;
                  case 'staff':
                    fetchedData.staff = data.staff || [];
                    break;
                  case 'school':
                    fetchedData.schoolInfo = data.school || data;
                    break;
                }
              }
            }
          });

          setApiData(fetchedData);
        }).catch(error => {
          console.error('Error fetching data:', error);
          setApiData({
            events: [],
            staff: [],
            schoolInfo: null
          });
        }).finally(() => {
          setTimeout(() => setIsLoading(false), 1000);
        });

      } catch (error) {
        console.error('Error in fetchAllData:', error);
        setApiData({
          events: [],
          staff: [],
          schoolInfo: null
        });
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Auto-slide for hero carousel with animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  // School Video API Service - Fixed to avoid async/await
  const fetchSchoolVideo = useCallback(() => {
    setVideoLoading(true);
    setVideoError(null);
    
    fetch('/api/school')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.success && data.school) {
          setSchoolData(data.school);
          setVideoError(null);
          console.log('Video data loaded:', {
            name: data.school.name,
            videoType: data.school.videoType,
            videoTour: data.school.videoTour
          });
        } else {
          throw new Error(data.message || 'No school data found');
        }
      })
      .catch(err => {
        console.error('Error fetching school video:', err);
        setVideoError(err.message);
        setSchoolData(null);
      })
      .finally(() => {
        setVideoLoading(false);
      });
  }, []);

  // Call this when modal opens
  useEffect(() => {
    if (showVideoModal) {
      console.log('Fetching video data...');
      fetchSchoolVideo();
    }
  }, [showVideoModal, fetchSchoolVideo]);

  // Extract YouTube ID
  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Navigation handlers - FIXED to prevent automatic navigation
  const handleAcademicsClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    router.push('/pages/academics');
  }, [router, navigationBlocked]);

  const handleWatchTour = useCallback(() => {
    setShowVideoModal(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    setShowVideoModal(false);
    setSchoolData(null);
    setVideoError(null);
  }, []);

  const handleEventClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    router.push('/pages/eventsandnews');
  }, [router, navigationBlocked]);

  const handleStaffClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    router.push('/pages/staff');
  }, [router, navigationBlocked]);

  // FIXED: Changed from automatic admissions to manual click only
  const handleAdmissionsClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    router.push('/pages/admissions');
  }, [router, navigationBlocked]);

  // FIXED: Changed from admissions to AboutUs
  const handleContactClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    closeVideoModal();
    // Navigate to AboutUs instead of admissions
    setTimeout(() => {
      router.push('/pages/AboutUs');
    }, 100);
  }, [router, closeVideoModal, navigationBlocked]);

  // Modern Loading Screen with Enhanced Design
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 z-50 flex flex-col items-center justify-center p-4">
    {/* Animated Background */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${4 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md">
      {/* Animated Rings - Scaled for small screens (w-24), original (w-32) on md+ */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8">
        <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
        <div className="absolute inset-3 md:inset-4 border-4 border-amber-500/30 rounded-full animate-ping"></div>
        <div className="absolute inset-6 md:inset-8 border-4 border-white/40 rounded-full animate-spin"></div>
        
        {/* Center Logo - Scaled for small screens (w-12), original (w-16) on md+ */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden">
            <img 
              src="/ll.png" 
              alt="Mary Immaculate Girls Secondary Logo" 
              className="w-full h-full object-contain p-2"
            />
          </div>
        </div>
      </div>
      
      {/* Loading Content */}
      <div className="text-center space-y-4 md:space-y-6 px-2">
        {/* School Name - Scaled text-xl for small screens, text-3xl for md+ */}
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Mary Immaculate Girls Secondary School
          </h2>
          <div className="h-1 w-32 md:w-48 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-4">
          <p className="text-white/80 text-base md:text-lg">Preparing an exceptional learning experience</p>
          
          {/* Animated Dots */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          
          {/* Progress Bar - Scaled width for small screens */}
          <div className="w-48 md:w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-loading"></div>
          </div>
          
          <p className="text-white/60 text-xs md:text-sm">Loading the School website...</p>
        </div>
      </div>
    </div>
  </div>
);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Inject JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />

      {/* Modern Achievements & Stats Section */}
      <section className="py-12 md:py-16 bg-white">
        <Why/>
      </section>

      <ModernLeadershipSection />

      {/* External Components */}
      <EnhancedEventsSection 
        events={apiData.events}
        onViewAll={handleEventClick}
        schoolInfo={apiData.schoolInfo}
      />

      {showVideoModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-black/80 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FiPlay className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Virtual Campus Tour</h4>
                  <p className="text-white/60 text-sm">
                    {schoolData?.name || 'Loading...'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeVideoModal}
                className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors flex items-center justify-center"
                aria-label="Close video"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            
            {/* Video Container */}
            <div className="relative bg-black aspect-video">
              {videoLoading ? (
                // Loading state
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <p className="text-white">Loading video tour...</p>
                </div>
              ) : videoError ? (
                // Error state
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiAlertCircle className="text-5xl text-red-500 mb-4" />
                  <p className="text-white text-center mb-4">{videoError}</p>
                  <button
                    onClick={fetchSchoolVideo}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : schoolData?.videoType === 'youtube' && schoolData?.videoTour ? (
                // YouTube Video
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(schoolData.videoTour)}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${schoolData.name} Virtual Tour`}
                />
              ) : schoolData?.videoType === 'file' && schoolData?.videoTour ? (
                // Local MP4 Video
                <div className="relative w-full h-full">
                  <video
                    src={schoolData.videoTour}
                    className="w-full h-full"
                    autoPlay
                    controls
                    title={`${schoolData.name} Virtual Tour`}
                    poster={schoolData?.videoThumbnail}
                  >
                    {/* Fallback message */}
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                      <FiAlertCircle className="text-5xl text-gray-400 mb-4" />
                      <p className="text-white text-center">
                        Your browser does not support the video tag.
                      </p>
                    </div>
                  </video>
                </div>
              ) : (
                // No video available
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiAlertCircle className="text-5xl text-gray-400 mb-4" />
                  <p className="text-white text-center mb-4">No video tour available</p>
                  <p className="text-white/60 text-sm text-center">
                    Please check back later for our virtual tour
                  </p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-transparent to-black/80 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm">
                  {schoolData?.description?.substring(0, 100) + '...' || 'Experience our campus from anywhere'}
                </div>
                <button
                  onClick={handleContactClick}
                  className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={navigationBlocked}
                >
                  Get To Know Us More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Blocker Indicator */}
      {navigationBlocked && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
          Navigation Cooling Period...
        </div>
      )}

      <ChatBot />

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-light {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-10px); opacity: 0.4; }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient-loading {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-light {
          animation: float-light 4s ease-in-out infinite;
        }
        
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-gradient-loading {
          animation: gradient-loading 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}