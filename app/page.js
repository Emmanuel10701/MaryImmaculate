'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, 
  FiStar, 
  FiUsers, 
  FiAward,
  FiPlay,
  FiCalendar,
  FiMapPin,
  FiChevronDown,
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
  FiShield
} from 'react-icons/fi';
import { 
  IoRocketOutline, 
  IoPeopleOutline,
  IoLibraryOutline,
  IoBusinessOutline,
  IoSparkles,
  IoSchoolOutline,
  IoStatsChart,
  IoMedalOutline,
  IoClose
} from 'react-icons/io5';
import { 
  GiGraduateCap, 
  GiModernCity,
  GiTreeGrowth,
  GiBrain,
  GiTeacher
} from 'react-icons/gi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Material-UI Components
import { 
  CircularProgress, 
  Backdrop,
  Box,
  Typography,
  Fade
} from '@mui/material';

// ChatBot Component
import ChatBot from './components/chat/page';




export default function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [apiData, setApiData] = useState({
    events: [],
    news: [],
    staff: [],
    schoolInfo: null,
    guidanceEvents: []
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const splashTimerRef = useRef(null);
  const router = useRouter();

  // Real images for Katwanyaa High School
  const defaultImages = {
    campus: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop",
    students: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop",
    scienceLab: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop",
    library: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=1200&h=800&fit=crop",
    sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop",
    arts: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=800&fit=crop",
    teacher1: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop",
    teacher2: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=400&fit=crop",
    teacher3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    event1: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
    event2: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop",
    event3: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop"
  };

  // Enhanced hero slides with rich content
  const heroSlides = [
    {
      title: "Excellence in Education",
      subtitle: "Nurturing Future Leaders Through Innovative Learning",
      description: "At Katwanyaa, we combine traditional values with modern educational approaches to create well-rounded individuals ready for the challenges of tomorrow.",
      background: "bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800",
      image: "/teachers.png",
      stats: { 
        students: "1300+", 
        excellence: "98% Success", 
        years: "Since 1985" 
      },
      features: ["Modern Curriculum", "Expert Faculty", "State-of-the-Art Facilities"],
      cta: "Start Your Journey"
    },
    {
      title: "Holistic Development",
      subtitle: "Balancing Academics, Sports, and Character Building",
      description: "Our comprehensive programs ensure students develop not just academically, but also physically, socially, and spiritually in a nurturing environment.",
      background: "bg-gradient-to-br from-emerald-600 via-teal-700 to-green-800",
      image: "/teachers.png",
      stats: { 
        teams: "8+", 
        clubs: "12+", 
        activities: "Daily" 
      },
      features: ["Sports Excellence", "Creative Arts", "Leadership Programs"],
      cta: "Explore Programs"
    },
    {
      title: "Modern Learning Environment",
      subtitle: "Technology-Enhanced Education for the Digital Age",
      description: "Experience cutting-edge learning with smart classrooms, advanced laboratories, and digital resources that prepare students for future careers.",
      background: "bg-gradient-to-br from-orange-500 via-red-600 to-pink-700",
      image: "/teachers.png",
      stats: { 
        labs: "4", 
        tech: "Smart Classes", 
        support: "24/7" 
      },
      features: ["Digital Classrooms", "Science Labs", "Computer Centers"],
      cta: "View Facilities"
    }
  ];

  // Enhanced API data fetching with better error handling
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        const endpoints = [
          { key: 'events', url: '/api/events' },
          { key: 'staff', url: '/api/staff' },
          { key: 'school', url: '/api/school' },
          { key: 'guidance', url: '/api/guidance' },
          { key: 'news', url: '/api/news' }
        ];

        const results = await Promise.allSettled(
          endpoints.map(endpoint => 
            fetch(endpoint.url)
              .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
              })
              .then(data => ({ key: endpoint.key, data }))
              .catch(error => ({ 
                key: endpoint.key, 
                data: getDefaultData(endpoint.key),
                error: error.message 
              }))
          )
        );

        const apiData = {
          events: [],
          news: [],
          staff: [],
          schoolInfo: null,
          guidanceEvents: []
        };

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            const { key, data } = result.value;
            switch (key) {
              case 'events':
                apiData.events = data.events && data.events.length > 0 ? data.events : sampleEvents;
                break;
              case 'staff':
                apiData.staff = data.staff && data.staff.length > 0 ? data.staff : sampleLeadershipStaff;
                break;
              case 'school':
                apiData.schoolInfo = data.school || data || getDefaultData('school').school;
                break;
              case 'guidance':
                apiData.guidanceEvents = data.events || data || [];
                break;
              case 'news':
                apiData.news = data.news || data || [];
                break;
            }
          }
        });

        console.log('Fetched API data:', {
          events: apiData.events.length,
          staff: apiData.staff.length,
          guidance: apiData.guidanceEvents.length,
          schoolInfo: apiData.schoolInfo ? 'Loaded' : 'Not loaded',
          news: apiData.news.length
        });

        setApiData(apiData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setApiData({
          events: sampleEvents,
          news: [],
          staff: sampleLeadershipStaff,
          schoolInfo: getDefaultData('school').school,
          guidanceEvents: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    const getDefaultData = (key) => {
      switch (key) {
        case 'events':
          return { events: sampleEvents };
        case 'staff':
          return { staff: sampleLeadershipStaff };
        case 'school':
          return { 
            school: {
              name: 'Katwanyaa Secondary School',
              motto: 'Striving for Excellence in Education',
              description: 'We are committed to bring the best quality of education to the students',
              established: 1985,
              location: {
                county: 'Machakos County, Kenya',
                subCounty: 'Matungulu Sub-County',
                postal: 'P.O. Box 363 – 90131, Tala, Machakos'
              },
              vision: 'To produce fully empowered, God-fearing citizens',
              mission: 'Dedicated to empowering our students through quality education, discipline, and integrity, while providing a safe and supportive environment where every child can discover their potential and thrive',
              coreValues: ['Integrity', 'Excellence', 'Discipline', 'Faith', 'Community', 'Respect'],
              studentCount: 1300,
              staffCount: 55,
              classrooms: 24,
              laboratories: 4,
              sportsTeams: 8,
              clubs: 12
            }
          };
        case 'guidance':
          return { events: [] };
        case 'news':
          return { news: [] };
        default:
          return {};
      }
    };

    fetchAllData();
  }, []);

  // Filter staff to show only Principal and Deputy Principals
  const leadershipStaff = apiData.staff
    .filter(member => 
      member.role?.includes('Principal') || 
      member.role?.includes('Deputy') ||
      member.role?.includes('Head') ||
      member.department?.includes('Administration')
    )
    .sort((a, b) => {
      // Sort by role importance
      const roleOrder = {
        'Principal': 1,
        'Deputy Principal': 2,
        'Head Teacher': 3,
        'Director': 4
      };
      return (roleOrder[a.role] || 5) - (roleOrder[b.role] || 5);
    })
    .slice(0, 3)
    .map(staff => ({
      ...staff,
      image: staff.image ? `/api/staff${staff.image}` : defaultImages.teacher1
    }));

  // Enhanced event filtering with better date handling
  const upcomingEvents = apiData.events
    .filter(event => {
      if (!event.date) return false;
      
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Only show future events and events for students (not staff-only)
      const isFutureEvent = eventDate >= today;
      const isStudentEvent = !event.attendees || event.attendees === 'students' || event.attendees === 'all';
      
      return isFutureEvent && isStudentEvent;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4)
    .map((event, index) => ({
      ...event,
      image: event.image ? `/api/event${event.image}` : defaultImages[`event${(index % 3) + 1}`],
      category: event.category || event.type || 'School Event',
      description: event.description || 'Join us for this school activity',
      registration: event.registration || false,
      formattedDate: new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      // Ensure required fields
      time: event.time || 'TBA',
      location: event.location || 'School Premises'
    }));

  // Enhanced stats data from real school info with fallbacks
  const stats = [
    { 
      value: apiData.schoolInfo?.studentCount || 1250, 
      suffix: '+', 
      label: 'Students Enrolled', 
      icon: FiUsers,
      growth: 8.5,
      description: 'Active students across all forms'
    },
    { 
      value: apiData.staff.length || apiData.schoolInfo?.staffCount || 48, 
      suffix: '+', 
      label: 'Teaching Staff', 
      icon: GiTeacher,
      growth: 12.3,
      description: 'Qualified educators'
    },
    { 
      value: apiData.schoolInfo?.completionRate || apiData.schoolInfo?.successRate || 96, 
      suffix: '%', 
      label: 'Success Rate', 
      icon: IoMedalOutline,
      growth: 3.2,
      description: 'Academic performance'
    },
    { 
      value: upcomingEvents.length, 
      suffix: '', 
      label: 'Upcoming Events', 
      icon: FiActivity,
      growth: 15.7,
      description: 'School activities'
    }
  ];

  // Academic Programs based on actual subjects
  const academicPrograms = [
    {
      department: "Sciences & Technology",
      programs: ["Physics", "Chemistry", "Biology", "Computer Studies"],
      icon: IoRocketOutline,
      color: "from-blue-500 to-cyan-500",
      description: "Hands-on scientific exploration with modern laboratories and cutting-edge technology",
      teachers: Math.floor((apiData.schoolInfo?.staffCount || 55) * 0.25),
      students: Math.floor((apiData.schoolInfo?.studentCount || 1300) * 0.35),
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      department: "Mathematics & Analytics",
      programs: ["Pure Mathematics", "Applied Mathematics", "Statistics"],
      icon: FiTarget,
      color: "from-purple-500 to-pink-500",
      description: "Developing critical thinking and problem-solving skills through mathematical excellence",
      teachers: Math.floor((apiData.schoolInfo?.staffCount || 55) * 0.15),
      students: Math.floor((apiData.schoolInfo?.studentCount || 1300) * 0.32),
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      department: "Humanities & Social Sciences",
      programs: ["History", "Geography", "Business Studies", "Religious Education"],
      icon: IoLibraryOutline,
      color: "from-green-500 to-teal-500",
      description: "Understanding human society, culture, and business principles for global citizenship",
      teachers: Math.floor((apiData.schoolInfo?.staffCount || 55) * 0.20),
      students: Math.floor((apiData.schoolInfo?.studentCount || 1300) * 0.28),
      image: "https://images.unsplash.com/photo-1588072432836-390afc58bfc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      department: "Languages & Communication",
      programs: ["English", "Kiswahili", "French", "German"],
      icon: FiBookOpen,
      color: "from-orange-500 to-red-500",
      description: "Mastering communication skills and linguistic proficiency for effective global interaction",
      teachers: Math.floor((apiData.schoolInfo?.staffCount || 55) * 0.18),
      students: Math.floor((apiData.schoolInfo?.studentCount || 1300) * 0.30),
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  // Why Choose Us Section
  const whyChooseUs = [
    {
      icon: FiShield,
      title: "Safe & Nurturing Environment",
      description: "Providing a secure, supportive atmosphere where every student can thrive and discover their unique potential",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FiTrendingUp,
      title: "Proven Academic Excellence",
      description: "Consistent outstanding results with 98% success rate in national examinations and university placements",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FiHeart,
      title: "Holistic Development",
      description: "Comprehensive programs nurturing academic, physical, spiritual, and social growth for complete development",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: FiGlobe,
      title: "Values-Based Education",
      description: "Rooted in strong moral principles to produce responsible, God-fearing citizens with integrity",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Auto-slide for hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Image loading and initialization
  useEffect(() => {
    const allImages = [
      ...Object.values(defaultImages),
      ...heroSlides.map(slide => slide.image),
      ...academicPrograms.map(program => program.image),
      ...leadershipStaff.map(staff => staff.image),
      ...upcomingEvents.map(event => event.image)
    ].filter(Boolean);
    
    const uniqueImages = [...new Set(allImages)];
    setTotalImages(uniqueImages.length);

    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);

    splashTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(splashTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (totalImages > 0 && imagesLoaded >= totalImages) {
      setIsLoading(false);
      clearTimeout(splashTimerRef.current);
    }
  }, [imagesLoaded, totalImages]);

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isLoading]);

  // Navigation handlers
  const handleAcademicsClick = () => {
    router.push('/pages/academics');
  };

  const handleWatchTour = () => {
    setShowVideoModal(true);
  };

  const closeVideoModal = () => setShowVideoModal(false);
  const handleEventClick = () => router.push('/pages/eventsandnews');
  const handleStaffClick = () => router.push('/pages/staff');

  // Enhanced YouTube video handling
  const getYouTubeVideoId = (url) => {
    if (!url) return 'iWHpv3ihfDQ'; // Default school tour video
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
      /youtube\.com\/embed\/([^?]+)/,
      /youtube\.com\/v\/([^?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return 'iWHpv3ihfDQ'; // Fallback
  };

  const youtubeVideoId = getYouTubeVideoId(apiData.schoolInfo?.videoTour);
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`;

  // Enhanced event sharing functionality
  const handleAddToCalendar = (event) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const calendarData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([calendarData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareEvent = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      setSelectedEvent(event);
      setShowShareModal(true);
    }
  };

  const handleSocialShare = (platform, event) => {
    const text = `Join us for: ${event.title} - ${event.description}`;
    const url = window.location.href;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Loading Screen Component
  const LoadingScreen = () => (
    <Fade in={isLoading} timeout={800}>
      <Backdrop
        sx={{
          backgroundColor: 'white',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={isLoading}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8"
          >
            <GiGraduateCap className="text-6xl gradient-text mx-auto" />
          </motion.div>

          <Box sx={{ display: 'inline-flex', mb: 3 }}>
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                color: '#667eea',
              }}
            />
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Typography 
              variant="h6" 
              className="text-gray-800 mb-2 font-semibold"
            >
              {apiData.schoolInfo?.name || 'Katwanyaa High School'}
            </Typography>
            <Typography 
              variant="body2" 
              className="text-gray-600"
            >
              Loading school information...
            </Typography>
          </motion.div>

          <div className="flex justify-center mt-4 space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </Backdrop>
    </Fade>
  );

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Enhanced Hero Section with Smooth Carousel */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 z-10 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 ${heroSlides[currentSlide]?.background}`}
          >
            {/* Background Image with Smooth Zoom */}
            <motion.div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url(${heroSlides[currentSlide]?.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              animate={{ scale: [1, 1.1] }}
              transition={{ duration: 10, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
        </AnimatePresence>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              className="text-white text-center lg:text-left"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 border border-white/20"
              >
                <FiStar className="text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  {apiData.schoolInfo?.motto || 'Excellence in Education Since 1985'}
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {apiData.schoolInfo?.name || 'Katwanyaa High School'}
                <motion.span 
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                  className="block gradient-text"
                >
                  {heroSlides[currentSlide]?.title}
                </motion.span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                transition={{ delay: 0.3 }}
                className="text-lg sm:text-xl text-gray-200 mb-4 leading-relaxed font-semibold"
              >
                {heroSlides[currentSlide]?.subtitle}
              </motion.p>
              
              <motion.p 
                variants={fadeInUp}
                transition={{ delay: 0.4 }}
                className="text-gray-300 mb-8 leading-relaxed max-w-2xl"
              >
                {heroSlides[currentSlide]?.description}
              </motion.p>

              {/* Features */}
              <motion.div 
                variants={fadeInUp}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {heroSlides[currentSlide]?.features.map((feature, index) => (
                  <motion.span 
                    key={index}
                    variants={fadeInUp}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30"
                  >
                    {feature}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAcademicsClick}
                  className="gradient-bg text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-3 text-base sm:text-lg shadow-lg"
                >
                  {heroSlides[currentSlide]?.cta} <FiArrowRight className="text-xl" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWatchTour}
                  className="bg-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold border border-white/20 flex items-center justify-center gap-3 text-base sm:text-lg transition-all duration-300 shadow-lg hover:bg-white/20"
                >
                  <FiPlay className="text-xl" />
                  Virtual Tour
                </motion.button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                variants={staggerContainer}
              >
                {Object.entries(heroSlides[currentSlide]?.stats || {}).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    variants={scaleIn}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center group cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                  >
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">{value}</div>
                    <p className="text-gray-300 text-xs sm:text-sm font-semibold capitalize">{key}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Interactive Showcase */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/20"
              >
                {/* Academic Programs Preview */}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-4">Academic Excellence</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {academicPrograms.slice(0, 4).map((program, index) => (
                      <motion.div
                        key={program.department}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                        onClick={handleAcademicsClick}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${program.color} flex items-center justify-center mb-2`}>
                          <program.icon className="text-white text-sm" />
                        </div>
                        <h4 className="text-white text-xs font-semibold">{program.department.split(' ')[0]}</h4>
                        <p className="text-gray-400 text-xs">{program.students}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <FiCalendar className="text-blue-400" />
                    Upcoming Events
                  </h4>
                  <div className="space-y-2">
                    {upcomingEvents.slice(0, 2).map((item, index) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedEvent(item)}
                        className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group transition-all duration-300"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-xs sm:text-sm flex-1 truncate">
                          {item.title}
                        </span>
                        <span className="text-xs text-gray-400 group-hover:text-gray-300">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Achievement Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 gradient-bg p-3 sm:p-4 rounded-2xl shadow-2xl"
              >
                <div className="text-white text-center">
                  <div className="font-bold text-sm sm:text-lg">
                    {apiData.schoolInfo?.grade || 'A'}
                  </div>
                  <div className="text-xs sm:text-sm">Grade</div>
                  <div className="text-xs mt-1">{new Date().getFullYear()}</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-500 ${
                currentSlide === index 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-white flex flex-col items-center gap-2">
            <span className="text-sm">Discover More</span>
            <FiChevronDown className="text-xl" />
          </div>
        </motion.div>
      </section>

      {/* Rest of the sections with white background */}
      <div className="bg-white">
        {/* MISSION & VISION SECTION */}
        <section className="relative py-16 sm:py-20 z-10 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Foundation</h2>
              <p className="text-gray-600 text-lg sm:text-xl">Built on strong values and a clear vision for the future</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-2xl">
                    <FiGlobe className="text-blue-600 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                    <p className="text-blue-600 font-semibold">Shaping Tomorrow's Leaders</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-blue-500 pl-4">
                  "{apiData.schoolInfo?.vision || 'To produce fully empowered, God-fearing citizens'}"
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <FiTrendingUp className="text-green-600 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                    <p className="text-green-600 font-semibold">Excellence in Education</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-green-500 pl-4">
                  "{apiData.schoolInfo?.mission || 'Dedicated to empowering our students through quality education, discipline, and integrity'}"
                </p>
              </motion.div>
            </div>

            {/* Core Values */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Core Values</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {(apiData.schoolInfo?.coreValues || ['Integrity', 'Excellence', 'Discipline', 'Faith', 'Community', 'Respect']).map((value, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white px-6 py-4 rounded-2xl shadow-md border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                      {value.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Continue with other sections in similar fashion... */}
        {/* ACADEMIC EXCELLENCE SECTION */}
        <section className="relative py-16 sm:py-20 z-10 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Academic Excellence</h2>
              <p className="text-gray-600 text-lg sm:text-xl">Comprehensive curriculum designed for success</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {academicPrograms.map((program, index) => (
                <motion.div
                  key={program.department}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
                >
                  <div className="flex items-center gap-6 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${program.color}`}>
                      <program.icon className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{program.department}</h3>
                      <p className="text-gray-600">{program.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-xl font-bold text-gray-900">{program.teachers}</div>
                      <div className="text-gray-600 text-sm">Teachers</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-xl font-bold text-gray-900">{program.students}</div>
                      <div className="text-gray-600 text-sm">Students</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Programs Offered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.programs.map((subject, idx) => (
                        <span key={idx} className="px-3 py-2 bg-blue-50 rounded-full text-sm text-blue-700">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ENHANCED EVENTS SECTION */}
        <section className="relative py-16 sm:py-20 z-10 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-gray-600 text-lg sm:text-xl">Stay updated with our school activities and programs</p>
            </motion.div>

            {upcomingEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-3xl overflow-hidden group cursor-pointer shadow-lg border border-gray-200"
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onLoad={handleImageLoad}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.category === 'Academic' ? 'bg-blue-500 text-white' :
                          event.category === 'Sports' ? 'bg-green-500 text-white' :
                          event.category === 'Music' ? 'bg-purple-500 text-white' :
                          event.category === 'Drama' ? 'bg-pink-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {event.category}
                        </span>
                      </div>
                      {event.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-3 text-gray-600">
                          <FiCalendar className="text-blue-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{event.formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <FiClock className="text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <FiMapPin className="text-red-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCalendar(event);
                          }}
                          className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-xl font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm border border-blue-200"
                        >
                          <FiCalendar /> Add to Calendar
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareEvent(event);
                          }}
                          className="flex-1 bg-purple-50 text-purple-700 py-2 rounded-xl font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 text-sm border border-purple-200"
                        >
                          <FiShare2 /> Share
                        </button>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick();
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                      >
                        Learn More <FiArrowRight />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center py-12"
              >
                <FiCalendar className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
                <p className="text-gray-500">Check back later for upcoming school events</p>
              </motion.div>
            )}

            {/* View All Events Button */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8 sm:mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEventClick}
                className="gradient-bg text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg border border-white/20"
              >
                View All School Events <FiArrowRight className="inline ml-2" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Continue with other sections in the same pattern... */}

      </div>

      {/* Share Event Modal */}
      <AnimatePresence>
        {showShareModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Share Event</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <IoClose className="text-2xl" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">{selectedEvent.title}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => handleSocialShare('facebook', selectedEvent)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  <span>Facebook</span>
                </button>
                <button 
                  onClick={() => handleSocialShare('twitter', selectedEvent)}
                  className="flex items-center justify-center gap-2 bg-blue-400 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors"
                >
                  <span>Twitter</span>
                </button>
                <button 
                  onClick={() => handleSocialShare('whatsapp', selectedEvent)}
                  className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  <span>WhatsApp</span>
                </button>
                <button 
                  onClick={() => handleSocialShare('linkedin', selectedEvent)}
                  className="flex items-center justify-center gap-2 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
                >
                  <span>LinkedIn</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Tour Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-black rounded-2xl overflow-hidden max-w-4xl w-full aspect-video"
            >
              <iframe
                src={youtubeEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${apiData.schoolInfo?.name || 'Katwanyaa High School'} Virtual Tour`}
              />
              <button
                onClick={closeVideoModal}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
}