'use client';
import { useEffect, useState } from 'react';
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
import Hero from "./components/hero/page";

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
import Image from 'next/image';
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
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  const router = useRouter();

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
  "Integrity and Discipline",
  "Holistic Student Development",
  "Academic Excellence",
  "Technology-Enhanced Learning",
  "Inclusivity and Equal Opportunity",
  "Environmental Responsibility",
  "Individualized Student Attention",
  "Strong Community Partnerships",
  "Global Perspective Education",
  "Career-Focused Curriculum",
  "Creativity and Innovation",
  "Leadership Development",
  "Responsible Citizenship",
  "Lifelong Learning Culture",
  "Collaboration and Teamwork",
  "Effective Communication Skills",
  "Emotional and Social Intelligence",
  "Ethical Decision-Making",
  "Resilience and Problem-Solving",
  "Cultural Appreciation and Identity"
]

    },
    achievements: {
      main: "Proven Track Record of Excellence",
      sub: "Consistently ranked among top performing schools in Nyamira County and beyond",
      stats: [
        { value: "94%", label: "KCSE Performance", icon: FiBarChart2, gradient: "from-blue-500 to-cyan-500" },
        { value: "98%", label: "University Placement", icon: GiGraduateCap, gradient: "from-purple-500 to-pink-500" },
        { value: "85%", label: "Sports Excellence", icon: GiTrophyCup, gradient: "from-green-500 to-emerald-500" },
        { value: "92%", label: "Parent Satisfaction", icon: FiHeart, gradient: "from-red-500 to-orange-500" }
      ]
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

  // Enhanced Core Values with Modern Design
  const coreValues = [
    {
      icon: FiTargetIcon,
      title: "Academic Excellence",
      gradient: "from-blue-500 to-cyan-500",
      description: "Consistent top performance with 94% KCSE success rate and excellent university placement records. Our proven teaching methodology ensures every student reaches their full potential.",
      stats: "94% Success Rate",
      details: ["Proven curriculum", "Expert teachers", "Regular assessments", "Research opportunities"],
      features: ["Scholarship programs", "Competition preparation", "Advanced placement"]
    },
    {
      icon: FiShieldIcon,
      title: "Character Building",
      gradient: "from-emerald-500 to-teal-500",
      description: "Developing responsible citizens through strong moral values, discipline, and ethical education. We prioritize integrity and good character alongside academic achievement.",
      stats: "Values Education",
      details: ["Moral instruction", "Discipline programs", "Community service", "Ethics training"],
      features: ["Leadership camps", "Peer counseling", "Character awards"]
    },
    {
      icon: FiUsersIcon,
      title: "Collaborative Learning",
      gradient: "from-purple-500 to-pink-500",
      description: "Fostering teamwork and mutual respect through group projects, peer learning, and collaborative activities that prepare students for real-world collaboration.",
      stats: "Team Projects",
      details: ["Group learning", "Peer mentoring", "Team competitions", "Collaborative research"],
      features: ["Group presentations", "Team sports", "Community projects"]
    },
    {
      icon: GiLightBulb,
      title: "Innovative Teaching",
      gradient: "from-orange-500 to-yellow-500",
      description: "Embracing modern teaching methods, technology integration, and creative approaches to make learning engaging and effective for the 21st century.",
      stats: "Digital Learning",
      details: ["Smart classrooms", "Online resources", "Interactive lessons", "Virtual labs"],
      features: ["E-learning platform", "Digital tools", "Innovation labs"]
    },
    {
      icon: IoHeartOutline,
      title: "Pastoral Care",
      gradient: "from-red-500 to-rose-500",
      description: "Providing comprehensive support including counseling, spiritual guidance, and personal development programs to ensure every student feels valued and supported.",
      stats: "Full Support",
      details: ["Counseling services", "Spiritual guidance", "Mentorship", "Health services"],
      features: ["Wellness programs", "Parent workshops", "Crisis support"]
    },
    {
      icon: GiGraduateCap,
      title: "Future Preparation",
      gradient: "from-indigo-500 to-blue-500",
      description: "Equipping students with skills for university success and future careers through career guidance, leadership programs, and practical life skills training.",
      stats: "Career Ready",
      details: ["Career counseling", "Leadership training", "Life skills", "Internship prep"],
      features: ["Career fairs", "University tours", "Skills workshops"]
    }
  ];

  // Enhanced School Features with Modern Design
  const schoolFeatures = [
    {
      icon: IoMedalOutline,
      title: "Proven Academic Track Record",
      gradient: "from-blue-500 to-cyan-500",
      description: "Ranked consistently among top schools with 94% KCSE success rate and outstanding university placement records across Kenya and abroad.",
      highlight: "Top Ranked School",
      details: ["94% KCSE success", "University placement", "Scholarship opportunities", "National recognition"],
      metrics: ["Top 5% nationally", "40+ awards", "98% placement"]
    },
    {
      icon: GiTeacher,
      title: "Expert Teaching Faculty",
      gradient: "from-green-500 to-emerald-500",
      description: "45+ highly qualified teachers with advanced degrees, specialized training, and years of experience in delivering quality education.",
      highlight: "45+ Qualified Staff",
      details: ["Degree qualifications", "Continuous training", "Subject specialists", "Individual attention"],
      metrics: ["PhD holders", "Master's degrees", "Certified trainers"]
    },
    {
      icon: IoSchoolOutline,
      title: "Modern Learning Facilities",
      gradient: "from-purple-500 to-pink-500",
      description: "State-of-the-art science laboratories, fully equipped computer labs, extensive digital library, and technology-enhanced smart classrooms.",
      highlight: "Advanced Facilities",
      details: ["Science laboratories", "Computer labs", "Digital library", "Sports facilities"],
      metrics: ["3 modern labs", "500+ computers", "10,000+ books"]
    },
    {
      icon: GiTreeGrowth,
      title: "Comprehensive Development",
      gradient: "from-teal-500 to-green-500",
      description: "Holistic approach balancing academics, sports, arts, and spiritual growth through diverse extracurricular programs and activities.",
      highlight: "15+ Programs",
      details: ["Sports teams", "Creative arts", "Clubs & societies", "Leadership programs"],
      metrics: ["10 sports", "15 clubs", "5 arts programs"]
    },
    {
      icon: IoLibraryOutline,
      title: "Rich Academic Curriculum",
      gradient: "from-orange-500 to-yellow-500",
      description: "Comprehensive curriculum covering sciences, humanities, technical subjects, and co-curricular activities aligned with national standards.",
      highlight: "Wide Subject Range",
      details: ["Science & Arts", "Technical subjects", "Languages", "Practical skills"],
      metrics: ["20+ subjects", "5 languages", "8 technical courses"]
    },
    {
      icon: IoPeopleOutline,
      title: "Strong Community Partnership",
      gradient: "from-indigo-500 to-blue-500",
      description: "Active collaboration with parents through PTA, alumni network, and community engagement programs for comprehensive student support.",
      highlight: "Active Community",
      details: ["Parent involvement", "Alumni network", "Community service", "Partnerships"],
      metrics: ["95% PTA", "500+ alumni", "10+ partners"]
    }
  ];

  // Enhanced Why Choose Us with Modern Design
  const whyChooseUs = [
    {
      icon: FiAward,
      title: "Consistent Excellence",
      gradient: "from-blue-500 to-cyan-500",
      description: "Year after year, our students achieve outstanding results, securing placements in top universities across Kenya and internationally.",
      metrics: "15 consecutive years of excellence"
    },
    {
      icon: FiMap,
      title: "Strategic Location",
      gradient: "from-green-500 to-emerald-500",
      description: "Located in a serene environment conducive to learning, with modern infrastructure and easy accessibility from major towns.",
      metrics: "Prime educational zone"
    },
    {
      icon: FiGlobeIcon,
      title: "Global Perspective",
      gradient: "from-purple-500 to-pink-500",
      description: "Curriculum designed to prepare students for global challenges with international standards and cultural awareness programs.",
      metrics: "Global partnerships"
    },
    {
      icon: FiBookmark,
      title: "Personalized Learning",
      gradient: "from-orange-500 to-yellow-500",
      description: "Small class sizes and individualized attention ensure each student's unique needs and talents are nurtured effectively.",
      metrics: "1:15 teacher ratio"
    }
  ];

  // API Data Fetching
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        const endpoints = [
          { key: 'events', url: '/api/events' },
          { key: 'school', url: '/api/school' }
        ];

        const results = await Promise.allSettled(
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
        );

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
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiData({
          events: [],
          staff: [],
          schoolInfo: null
        });
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
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


// School Video API Service - Separate function
const fetchSchoolVideo = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/school');
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    if (data.success && data.school) {
      setSchoolData(data.school);
      setError(null);
      console.log('Video data loaded:', {
        name: data.school.name,
        videoType: data.school.videoType,
        videoTour: data.school.videoTour
      });
    } else {
      throw new Error(data.message || 'No school data found');
    }
  } catch (err) {
    console.error('Error fetching school video:', err);
    setError(err.message);
    setSchoolData(null);
  } finally {
    setLoading(false);
  }
};

// Call this when modal opens
// Add this useEffect inside your ModernHero component
useEffect(() => {
  if (showVideoModal) {
    console.log('Fetching video data...');
    fetchSchoolVideo();
  }
}, [showVideoModal]);

// And this helper function anywhere in your component:
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


// Usage example:
const getSchoolVideo = async () => {
  const result = await fetchSchoolVideo();
  
  if (result.success) {
    const videoData = result.data;
    
    // Check video type and handle accordingly
    if (videoData.videoType === 'youtube') {
      console.log('YouTube Video:', videoData.youtubeEmbedUrl);
      // Use in iframe: <iframe src={videoData.youtubeEmbedUrl} />
    } else if (videoData.videoType === 'file') {
      console.log('Local Video:', videoData.localVideoPath);
      // Use in video tag: <video src={videoData.localVideoPath} />
    }
    
    return videoData;
  } else {
    console.error('Failed to fetch video:', result.error);
    return null;
  }
};

// React Hook version for useState/useEffect:
const useSchoolVideo = () => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const result = await fetchSchoolVideo();
        
        if (result.success) {
          setVideoData(result.data);
          setError(null);
        } else {
          setError(result.error);
          setVideoData(null);
        }
      } catch (err) {
        setError(err.message);
        setVideoData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, []);
  
  return { videoData, loading, error, refetch: fetchSchoolVideo };
};


  // Navigation handlers
  const handleAcademicsClick = () => router.push('/pages/academics');
  const handleWatchTour = () => setShowVideoModal(true);
  const closeVideoModal = () => setShowVideoModal(false);
  const handleEventClick = () => router.push('/pages/eventsandnews');
  const handleStaffClick = () => router.push('/pages/staff');
  const handleAdmissionsClick = () => router.push('/pages/admissions');
  const handleContactClick = () => router.push('/pages/admissions');

  // Modern Loading Screen with Enhanced Design
  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 z-50 flex flex-col items-center justify-center">
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

 {/* Main Loader */}
<div className="relative z-10 flex flex-col items-center justify-center">
  {/* Animated Rings */}
  <div className="relative w-32 h-32 mb-8">
    <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
    <div className="absolute inset-4 border-4 border-amber-500/30 rounded-full animate-ping"></div>
    <div className="absolute inset-8 border-4 border-white/40 rounded-full animate-spin"></div>
    
    {/* Center Logo */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center overflow-hidden">
        <img 
          src="/ll.png" 
          alt="Mary Immaculate Girls Secondary Logo" 
          className="w-full h-full object-contain p-2"
        />
      </div>
    </div>
  </div>
  
  {/* Loading Content */}
  <div className="text-center space-y-6">
    {/* School Name with Gradient */}
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">
        Mary Immaculate Girls Secondary School
      </h2>
      <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </div>
    
    {/* Loading Text */}
    <div className="space-y-4">
      <p className="text-white/80 text-lg">Preparing an exceptional learning experience</p>
      
      {/* Animated Dots */}
      <div className="flex items-center justify-center gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
        <div className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-loading"></div>
      </div>
      
      <p className="text-white/60 text-sm">Loading the School website...</p>
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


<Hero />


     {/* Modern Value Proposition Section */}
<section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
    
  {/* Header Section - Refined Modern */}
<div className="text-center mb-12 md:mb-16 px-4">
  
  {/* Subtle Badge */}
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 mb-8 shadow-xs">
    <div className="w-2 h-2 bg-blue-500 rounded-full" />
    <span className="text-sm font-medium text-gray-700">
      Educational Excellence
    </span>
  </div>

  {/* Main Heading - Clean & Proportional */}
  <div className="max-w-3xl mx-auto mb-8 md:mb-10">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        {marketingDescriptions.valueProposition.main}
      </span>
    </h1>
    
    {/* Subtitle */}
    <p className="text-lg text-gray-600 leading-relaxed">
      {marketingDescriptions.valueProposition.sub}
    </p>
  </div>

{/* Card Container for Tags */}
  
  
  
 {/* Wide Card Container for Core Values (90% Width) */}
<div className="w-full lg:w-full mx-auto p-8 
             bg-white 
             rounded-2xl shadow-2xl border border-gray-100 
             transform transition-all duration-300">
  
  <h3 className="text-2xl font-extrabold text-center text-gray-800 mb-6">
    Our Student Core Values
  </h3>
  
  {/* Tag Section (Flexbox handles wrapping) */}
  <div className="flex flex-wrap justify-center gap-3">
    {marketingDescriptions.valueProposition.points.map((point, idx) => (
      <div 
        key={idx}
        // Sizing & Base Style (Clean Pill)
        className="px-4 py-2 
                   bg-white 
                   rounded-full 
                   border border-gray-200 
                   text-gray-700 text-sm font-medium 
                   shadow-sm 
                   
                   // Interactive Hover Effect
                   hover:bg-blue-600 hover:border-blue-600 hover:text-white 
                   transform hover:scale-[1.05] transition-all duration-200 ease-in-out
                   cursor-default select-none" 
      >
        {point}
      </div>
    ))}
  
</div>
  
</div>

</div>

    {/* Modern Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      {coreValues.map((value, index) => (
        <div
          key={index}
          className="group relative"
        >
          {/* Card Shadow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Main Card */}
          <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            
            {/* Gradient Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
            
            {/* Icon with Modern Background */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <value.icon className="text-white text-2xl" />
              </div>
            </div>

            {/* Card Content */}
            <div className="space-y-6">
              {/* Title and Stats */}
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {value.title}
                </h3>
                <span className="text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg border border-gray-200 shadow-sm">
                  {value.stats}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>

              {/* Details List */}
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  {value.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3 group/item">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover/item:scale-125 transition-transform duration-300" />
                      <span className="text-sm text-gray-700 group-hover/item:text-gray-900 transition-colors duration-300">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            {/* Features Badges */}
<div className="pt-4">
  <div className="flex flex-wrap gap-2">
    {value.features.map((feature, idx) => (
      <span
        key={idx}
        className="group relative px-3 py-1.5 bg-white/10 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        {/* Gradient Background on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg`} />
        
        {/* Icon */}
        <div className="absolute -left-1.5 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Text */}
        <span className="relative z-10">{feature}</span>
        
        {/* Hover Glow */}
        <div className="absolute inset-0 shadow-lg shadow-current/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      </span>
    ))}
  </div>
</div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Modern Stats Section */}
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 rounded-3xl" />
      
      {/* Stats Grid */}
      <div className="relative bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-3xl p-8 md:p-12 border border-blue-100/50 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {[
            { value: "94%", label: "KCSE Success Rate", desc: "Consistent excellence", color: "from-blue-600 to-cyan-600" },
            { value: "98%", label: "University Placement", desc: "Top institutions", color: "from-blue-600 to-purple-600" },
            { value: "45+", label: "Qualified Staff", desc: "Expert educators", color: "from-purple-600 to-cyan-600" },
            { value: "15+", label: "Extracurriculars", desc: "Holistic development", color: "from-cyan-600 to-blue-600" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center group/stat">
              <div className="relative inline-block mb-4">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-full blur-lg opacity-0 group-hover/stat:opacity-50 transition-opacity duration-500`} />
                <div className={`relative text-5xl md:text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {stat.label}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

{/* Modern Achievements & Stats Section */}
<section className="py-12 md:py-16 bg-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    
    {/* Header Section */}
    <div className="text-center mb-12 md:mb-16">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
        <GiAchievement className="text-blue-600 text-lg" />
        <span className="text-sm font-medium text-blue-700">Our Achievements</span>
      </div>
      
      {/* Main Heading */}
      <div className="max-w-3xl mx-auto mb-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {marketingDescriptions.achievements.main}
        </h2>
        
        {/* Subtitle */}
        <p className="text-base text-gray-600">
          {marketingDescriptions.achievements.sub}
        </p>
      </div>
    </div>

    {/* Stats Grid - Clean with Colors */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
      {marketingDescriptions.achievements.stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = [
          'bg-blue-50 text-blue-600 border-blue-200',
          'bg-green-50 text-green-600 border-green-200',
          'bg-purple-50 text-purple-600 border-purple-200',
          'bg-orange-50 text-orange-600 border-orange-200'
        ];
        
        return (
          <div
            key={index}
            className={`bg-white rounded-xl p-5 md:p-6 border ${colors[index]} hover:shadow-md transition-shadow duration-300`}
          >
            {/* Icon */}
            <div className={`w-16 h-16 rounded-xl ${colors[index].split(' ')[0]} flex items-center justify-center mb-4`}>
              <Icon className={`text-2xl ${colors[index].split(' ')[1]}`} />
            </div>
            
            {/* Stats */}
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Why Choose Us */}
    <div className="mb-12 md:mb-16">
      <div className="text-center mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          Why Parents Choose Mary Immaculate Girls Secondary School
        </h3>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Discover what makes us the preferred choice for quality education
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {whyChooseUs.map((item, index) => {
          const titleColors = [
            'text-blue-700',
            'text-green-700',
            'text-purple-700',
            'text-orange-700'
          ];
          const bgColors = [
            'bg-blue-50 border-blue-200',
            'bg-green-50 border-green-200',
            'bg-purple-50 border-purple-200',
            'bg-orange-50 border-orange-200'
          ];
          
          return (
            <div
              key={index}
              className={`bg-white rounded-xl p-5 md:p-6 border ${bgColors[index]} hover:shadow-md transition-shadow duration-300`}
            >
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${bgColors[index].split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="text-xl" style={{color: titleColors[index].split('text-')[1] + '700'}} />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h4 className={`text-lg font-semibold ${titleColors[index]} mb-2`}>
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiTrendingUp className="text-gray-600" />
                    <span className="font-medium">{item.metrics}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* School Features */}
    <div className="mb-12 md:mb-16">
      <div className="text-center mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          School Features
        </h3>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Everything you need for a complete educational experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {schoolFeatures.map((feature, index) => {
          const titleColors = [
            'text-blue-700',
            'text-green-700', 
            'text-purple-700',
            'text-orange-700',
            'text-red-700',
            'text-indigo-700'
          ];
          const bgColors = [
            'bg-blue-50 border-blue-200',
            'bg-green-50 border-green-200',
            'bg-purple-50 border-purple-200',
            'bg-orange-50 border-orange-200',
            'bg-red-50 border-red-200',
            'bg-indigo-50 border-indigo-200'
          ];
          
          return (
            <div
              key={index}
              className={`bg-white rounded-xl p-5 md:p-6 border ${bgColors[index]} hover:shadow-md transition-shadow duration-300`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl ${bgColors[index].split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="text-xl" style={{color: titleColors[index].split('text-')[1] + '700'}} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${titleColors[index]} mb-1`}>
                    {feature.title}
                  </h3>
                  <div className="text-xs font-medium text-gray-600 px-2 py-1 bg-gray-50 rounded">
                    {feature.highlight}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {feature.description}
              </p>
              
              {/* Details */}
              <div className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 ${bgColors[index].split(' ')[0].replace('bg-', 'bg-')} rounded-full`}></div>
                    <span className="text-xs text-gray-600">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Final CTA */}
    <div className="bg-gray-900 rounded-xl p-6 md:p-8">
      <div className="text-center">
        {/* Badge */}
       <div
  className="
    inline-flex items-center gap-2 
    px-4 py-1.5 
    bg-gray-900/80 backdrop-blur-sm 
    rounded-full mb-6 
    shadow-md border border-gray-700/40
  "
>
  <GiRingingBell className="text-gray-200 text-lg animate-pulse" />

  {/* Live Fire Emoji */}
  <span className="text-sm font-semibold text-orange-400 flex items-center gap-1">
    Open Time Opportunity 
    <span className="animate-bounce"><GiRingingBell /></span>
  </span>
</div>

        
        {/* Heading */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
          Secure Your Child's Future Today
        </h3>
        
        {/* Description */}
        <p className="text-gray-300 text-sm mb-6 max-w-2xl mx-auto">
          Get  spots available for 2024 intake. Join Nyeri's Kiganjo leading educational institution
          and give your child the competitive advantage they deserve.
        </p>
        
       {/* Action Buttons */}
<div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
  
  <button
    onClick={handleAdmissionsClick}
    className="
      px-6 py-3
      bg-white text-gray-900
      rounded-xl font-semibold
      shadow-md
      hover:shadow-lg hover:bg-gray-50
      active:scale-[0.97]
      transition-all duration-300
    "
  >
    Apply for Admission
  </button>

  <button
    onClick={handleContactClick}
    className="
      px-6 py-3
      bg-gray-900 text-white
      rounded-xl font-semibold
      shadow-md border border-gray-700
      hover:bg-gray-800 hover:shadow-lg
      active:scale-[0.97]
      transition-all duration-300
    "
  >
    Contact Admissions
  </button>

</div>

        
        {/* Additional Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-xs">
          <div className="flex items-center gap-2">
            <FiCalendar />
            <span>Admissions close October 31, 2024</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
          <div className="flex items-center gap-2">
            <FiUsers />
            <span>Limited seats available</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
          <div className="flex items-center gap-2">
            <FiAward />
            <span>Scholarships available</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      <ModernLeadershipSection  />

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
        {loading ? (
          // Loading state
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-white">Loading video tour...</p>
          </div>
        ) : error ? (
          // Error state
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <FiAlertCircle className="text-5xl text-red-500 mb-4" />
            <p className="text-white text-center mb-4">{error}</p>
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
              onLoadedData={() => console.log('Video loaded successfully')}
              onError={(e) => {
                console.error('Video loading error:', e);
                const video = e.target;
                if (video.error) {
                  console.error('Video error details:', video.error);
                  video.style.display = 'none';
                  video.parentElement.innerHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-center p-8">
                      <svg class="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-white text-center mb-2">Unable to load video file</p>
                      <p class="text-white/60 text-sm text-center">
                        The video file may be corrupted or in an unsupported format
                      </p>
                    </div>
                  `;
                }
              }}
            >
              {/* Fallback message */}
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <FiAlertCircle className="text-5xl text-gray-400 mb-4" />
                <p className="text-white text-center">
                  Your browser does not support the video tag.
                </p>
              </div>
            </video>
            
            {/* Loading overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center video-loading-overlay">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
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
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Get To Know Us More
          </button>
        </div>
      </div>
    </div>
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
        
        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        
        /* Improve scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #06b6d4);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #0891b2);
        }
      `}</style>
    </div>
  );
}