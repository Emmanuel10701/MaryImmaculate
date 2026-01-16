"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, 
  Globe, Rocket, Trophy, BookOpen, Clock, Users, 
  Calendar, Play, X
} from 'lucide-react';
import { 
  GiGraduateCap, 
  GiTrophyCup 
} from 'react-icons/gi';
import { IoRocketOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

// Enhanced Hero Slides with Modern Design
const heroSlides = [
  {
    title: "Academic Excellence",
    subtitle: "Redefined Through Innovation",
    gradient: "from-blue-500 via-cyan-400 to-purple-600",
    description: "At Mary Immaculate Girls School, we're pioneering a new era of education. With a 94% KCSE success rate and state-of-the-art STEM facilities, we're not just teaching—we're inspiring the next generation of leaders and innovators.",
    background: "bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-purple-900/70",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    stats: { 
      students: "400+ Active Learners", 
      excellence: "94% KCSE Success", 
      years: "10+ Years Excellence" 
    },
    features: ["Modern STEM Labs", "Digital Library", "Expert Faculty", "Research Programs"],
    cta: "Admissions",
    link: "/pages/admissions",
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
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2170&auto=format&fit=crop",
    stats: { 
      teams: "10+ Sports Teams", 
      clubs: "15+ Clubs", 
      success: "National Awards" 
    },
    features: ["Sports Excellence", "Creative Arts", "Leadership Training", "Community Service"],
    cta: "About Us",
    link: "/pages/AboutUs",
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
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    stats: { 
      labs: "3 Modern Labs", 
      tech: "Digital Classrooms", 
      innovation: "STEM Programs" 
    },
    features: ["Computer Studies", "Science Innovation", "Career Guidance", "Coding Classes"],
    cta: "Apply Now",
    link: "/pages/apply-for-admissions",
    highlightColor: "cyan",
    testimonial: "\"The advanced computer labs gave me skills that directly contributed to securing my university scholarship in Computer Science.\" - 2022 Alumni",
    icon: IoRocketOutline
  }
];

// Extract YouTube ID from URL
const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ModernHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navigationBlocked, setNavigationBlocked] = useState(true);

  const router = useRouter();

  // DEBUG: Add this to track automatic navigation
  useEffect(() => {
    console.log('=== DEBUG: ModernHero Component Mounted ===');
    console.log('Initial state - showVideoModal:', showVideoModal);
    console.log('Initial state - currentSlide:', currentSlide);
    console.log('Initial slide link:', heroSlides[currentSlide].link);
    
    // Check if there's any automatic navigation attempt on mount
    if (typeof window !== 'undefined') {
      console.log('Current URL:', window.location.href);
      
      // Clear any hash that might trigger navigation
      if (window.location.hash) {
        console.log('Found hash, clearing:', window.location.hash);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, []);

  // Block automatic navigation for first 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigationBlocked(false);
      console.log('Navigation is now allowed');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // REMOVED: router.events code - causing error
  // Next.js App Router doesn't have router.events

  const handleSlideChange = useCallback((index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const nextSlide = useCallback(() => {
    handleSlideChange(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1);
  }, [currentSlide, handleSlideChange]);

  const prevSlide = useCallback(() => {
    handleSlideChange(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1);
  }, [currentSlide, handleSlideChange]);

  const openVideoModal = useCallback(() => {
    console.log('DEBUG: Opening video modal');
    setShowVideoModal(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    console.log('DEBUG: Closing video modal');
    setShowVideoModal(false);
    setSchoolData(null);
    setError(null);
  }, []);

  // Safe navigation handler for slide buttons
  const handleSlideButtonClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('DEBUG: Navigation blocked (cooling period)');
      return;
    }
    
    const link = heroSlides[currentSlide].link;
    console.log('DEBUG: Navigating to slide link:', link);
    console.log('DEBUG: From slide index:', currentSlide);
    
    // Add a small delay to prevent accidental clicks
    setTimeout(() => {
      router.push(link);
    }, 100);
  }, [currentSlide, router, navigationBlocked]);

  // Safe contact handler for modal button
  const handleContactClick = useCallback(() => {
    console.log('DEBUG: Contact button clicked');
    closeVideoModal();
    
    if (navigationBlocked) {
      console.log('DEBUG: Navigation blocked (cooling period)');
      return;
    }
    
    // Navigate to About Us page with delay
    setTimeout(() => {
      router.push('/pages/AboutUs');
    }, 100);
  }, [closeVideoModal, router, navigationBlocked]);

  // Fetch video data when modal opens - USING .then() instead of async/await
  useEffect(() => {
    if (showVideoModal) {
      console.log('Fetching video data...');
      setLoading(true);
      setError(null);
      
      // Use .then() syntax instead of async/await
      fetch('/api/school')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.success && data.school) {
            console.log('Video data loaded:', {
              name: data.school.name,
              videoType: data.school.videoType,
              videoTour: data.school.videoTour
            });
            setSchoolData(data.school);
            setError(null);
          } else {
            throw new Error(data.message || 'No school data found');
          }
        })
        .catch(err => {
          console.error('Error fetching school video:', err);
          setError(err.message);
          setSchoolData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showVideoModal]);

  // Auto-slide effect with safety check
  useEffect(() => {
    // Don't auto-slide if modal is open
    if (showVideoModal) {
      console.log('DEBUG: Auto-slide paused (modal open)');
      return;
    }
    
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    
    return () => clearInterval(timer);
  }, [currentSlide, nextSlide, showVideoModal]);

  // Retry function for video loading
  const retryVideoLoad = useCallback(() => {
    setLoading(true);
    setError(null);
    
    fetch('/api/school')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success && data.school) {
          setSchoolData(data.school);
          setError(null);
        } else {
          throw new Error(data.message || 'No school data found');
        }
      })
      .catch(err => {
        console.error('Error fetching school video:', err);
        setError(err.message);
        setSchoolData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const slide = heroSlides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Background Image Layers with Enhanced Dark Overlay */}
      {heroSlides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s.image})` }}
          />
          {/* Enhanced dark overlay - much darker at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          {/* Additional gradient overlay for visual depth */}
          <div className={`absolute inset-0 opacity-20 ${s.background}`} />
        </div>
      ))}

      {/* Welcome Banner */}
      <div className="absolute top-6 left-0 right-0 z-30 flex justify-center px-4">
        <div className="relative inline-flex items-center gap-4 px-8 py-4 
          bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30
          backdrop-blur-xl rounded-full border border-white/30 shadow-2xl">

          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-white/10 blur-xl -z-10" />

          {/* Text */}
          <span className="text-white text-base sm:text-lg md:text-xl 
            font-semibold italic tracking-wide">
            Welcome to <span className="font-bold">Mary Immaculate Girls</span>
          </span>

          {/* Live Indicator */}
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="w-2.5 h-2.5 bg-emerald-400/50 rounded-full animate-ping" />
          </div>
        </div>
      </div>

      {/* Main Content Area - Centered alignment */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 md:px-12 text-center">
        <div className={`max-w-4xl transition-all duration-500 transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          
          {/* Tagline - Centered */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-[1px] w-8 bg-white/40" />
            <span className={`uppercase tracking-[0.2em] text-xs font-bold ${getHighlightColorClass(slide.highlightColor)}`}>
              {slide.subtitle}
            </span>
            <div className="h-[1px] w-8 bg-white/40" />
          </div>

          {/* Dynamic Heading - Centered text */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
            {slide.title.split(' ').map((word, i) => (
              <span key={i} className={i === slide.title.split(' ').length - 1 ? getHighlightColorClass(slide.highlightColor) : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>

          {/* Description - Centered and max-width restricted */}
          <p className="text-base md:text-lg text-gray-300 mb-8 mx-auto max-w-2xl font-normal leading-relaxed">
            {slide.description}
          </p>

          {/* Stats - Centered Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            {Object.entries(slide.stats).map(([key, value], i) => (
              <div key={i} className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className={`text-2xl font-bold ${getHighlightColorClass(slide.highlightColor)} mb-1`}>
                  {value.split(' ')[0]}
                </div>
                <span className="text-white/80 text-xs uppercase tracking-wider">
                  {value.split(' ').slice(1).join(' ')}
                </span>
              </div>
            ))}
          </div>

          {/* Features - Centered Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-3xl mx-auto">
            {slide.features.map((feature, i) => (
              <div key={i} className="flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group">
                <IconComponent className={`w-4 h-4 ${getHighlightColorClass(slide.highlightColor)}`} />
                <span className="text-white font-medium text-xs group-hover:text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className={`border-l-4 ${getBorderColorClass(slide.highlightColor)} pl-4 py-2 bg-white/5 backdrop-blur-sm rounded-r-lg`}>
              <p className="text-white/70 text-sm italic">{slide.testimonial}</p>
            </div>
          </div>

          {/* Action Buttons - Centered Flex */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={handleSlideButtonClick} 
              className="px-8 py-3.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-all flex items-center group shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={navigationBlocked}
            >
              {slide.cta}
              <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={openVideoModal}
              className="px-8 py-3.5 bg-transparent border border-white/30 text-white rounded-full font-bold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center gap-2 hover:border-white/50 duration-300 group"
            >
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              View Tour
            </button>
          </div>
        </div>
      </div>

      {/* Modern Controls - Bottom Right */}
      <div className="absolute bottom-10 right-8 z-30 flex flex-col space-y-3">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all group backdrop-blur-sm hover:scale-110 duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all group backdrop-blur-sm hover:scale-110 duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Indicators - Vertical Right */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 z-30 hidden lg:flex flex-col space-y-6">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className="group flex items-center justify-end"
          >
            <span className={`mr-3 text-[10px] font-mono transition-all ${currentSlide === index ? 'text-white' : 'text-white/30 opacity-0 group-hover:opacity-100'}`}>
              0{index + 1}
            </span>
            <div className={`w-[2px] transition-all duration-300 rounded-full ${currentSlide === index ? `h-8 ${getProgressColorClass(heroSlides[index].highlightColor)}` : 'h-3 bg-white/20 group-hover:bg-white/40'}`} />
          </button>
        ))}
      </div>

      {/* Bottom Info Strip - Much Darker */}
      <div className="absolute bottom-0 left-0 w-full z-10 py-4 px-6 md:px-12 border-t border-white/5 bg-black/80 backdrop-blur-lg hidden md:flex items-center justify-between text-white/70 text-[10px] tracking-[0.15em] uppercase font-semibold">
        <div className="flex space-x-8">
          <span className="flex items-center">
            <BookOpen className="w-3 h-3 mr-2" />
            Est. 1962
          </span>
          <span className="flex items-center">
            <Trophy className="w-3 h-3 mr-2" />
            Mary Immaculate Girls
          </span>
        </div>
        <div className="flex space-x-8">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-2" />
            94% KCSE Success Rate
          </span>
          <button 
            onClick={openVideoModal}
            className="flex items-center text-white/80 hover:text-white transition-colors duration-300 group"
          >
            <Play className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
            Virtual Tour
          </button>
        </div>
      </div>

      {/* Video Tour Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-black/80 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center">
                  <Play className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Virtual School Tour</h4>
                  <p className="text-white/60 text-sm">
                    {schoolData?.name || 'Mary Immaculate Girls School'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeVideoModal}
                className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors flex items-center justify-center hover:scale-110 duration-300"
                aria-label="Close video"
              >
                <X className="w-6 h-6" />
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
                  <div className="text-5xl text-red-500 mb-4">!</div>
                  <p className="text-white text-center mb-4">{error}</p>
                  <button
                    onClick={retryVideoLoad}
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
                  >
                    {/* Fallback message */}
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                      <div className="text-5xl text-gray-400 mb-4">!</div>
                      <p className="text-white text-center">
                        Your browser does not support the video tag.
                      </p>
                    </div>
                  </video>
                </div>
              ) : (
                // No video available or no schoolData yet
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <div className="text-5xl text-gray-400 mb-4">!</div>
                  <p className="text-white text-center mb-4">
                    {schoolData ? 'No video tour available' : 'Loading...'}
                  </p>
                  <p className="text-white/60 text-sm text-center">
                    {schoolData 
                      ? 'Please check back later for our virtual tour' 
                      : 'Fetching video data...'
                    }
                  </p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-transparent to-black/80 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm hidden sm:block">
                  {schoolData?.description?.substring(0, 100) + '...' || 'Experience our school from anywhere in the world'}
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

      {/* Navigation Blocker Overlay (temporary) */}
      {navigationBlocked && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm">
            Navigation cooling period... {new Date().getSeconds() % 2 === 0 ? '▰▰▰▰▰' : '▰▰▱▱▱'}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for dynamic color classes
const getHighlightColorClass = (color) => {
  switch(color) {
    case 'blue': return 'text-blue-400';
    case 'green': return 'text-emerald-400';
    case 'cyan': return 'text-cyan-400';
    default: return 'text-blue-400';
  }
};

const getBorderColorClass = (color) => {
  switch(color) {
    case 'blue': return 'border-blue-500';
    case 'green': return 'border-emerald-500';
    case 'cyan': return 'border-cyan-500';
    default: return 'border-blue-500';
  }
};

const getProgressColorClass = (color) => {
  switch(color) {
    case 'blue': return 'bg-blue-500';
    case 'green': return 'bg-emerald-500';
    case 'cyan': return 'bg-cyan-500';
    default: return 'bg-blue-500';
  }
};

export default ModernHero;