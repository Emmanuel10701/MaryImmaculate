"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, 
  Globe, Rocket, Trophy, BookOpen, Clock, Users, 
  Calendar, Play, X, Menu, X as XIcon
} from 'lucide-react';
import { 
  GiGraduateCap, 
  GiTrophyCup 
} from 'react-icons/gi';
import { IoRocketOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

// Enhanced Hero Slides with Modern Design - Updated with accurate Katwanyaa High School in Matungulu information
const heroSlides = [
  {
    title: "Katwanyaa High School",
    subtitle: "Matungulu, Machakos County",
    gradient: "from-blue-500 via-cyan-400 to-purple-600",
    description: "Katwanyaa High School is a public secondary school located in Matungulu sub-county, Machakos County, Kenya. The school is committed to providing quality education and holistic development to students from the region.",
    background: "bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-purple-900/70",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    stats: { 
      students: "Public School", 
      excellence: "Quality Education", 
      years: "Serving Community" 
    },
    features: ["Academic Excellence", "Co-curricular Activities", "Character Building", "Community Focus"],
    cta: "Admissions",
    link: "/pages/admissions",
    highlightColor: "blue",
    testimonial: "\"A school dedicated to nurturing talents and academic potential of students in Matungulu.\"",
    icon: GiGraduateCap
  },
  {
    title: "Holistic Education",
    subtitle: "Beyond Academics",
    gradient: "from-emerald-500 via-teal-400 to-green-600",
    description: "The school emphasizes all-round development through sports, clubs, and community engagement. Students are encouraged to participate in various activities to develop leadership and life skills.",
    background: "bg-gradient-to-br from-emerald-900/90 via-green-900/80 to-teal-900/70",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2170&auto=format&fit=crop",
    stats: { 
      teams: "Sports Programs", 
      clubs: "Student Societies", 
      success: "Talent Nurturing" 
    },
    features: ["Sports Development", "Music & Arts", "Leadership Programs", "Agricultural Projects"],
    cta: "About Us",
    link: "/pages/AboutUs",
    highlightColor: "green",
    testimonial: "\"The school provides opportunities for students to discover and develop their talents.\"",
    icon: GiTrophyCup
  },
  {
    title: "Community Partnership",
    subtitle: "Local Engagement",
    gradient: "from-cyan-500 via-blue-400 to-indigo-600",
    description: "As a community-based institution in Matungulu, Katwanyaa High School works closely with parents and local stakeholders to provide relevant education that addresses community needs.",
    background: "bg-gradient-to-br from-cyan-900/90 via-blue-900/80 to-indigo-900/70",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    stats: { 
      labs: "Practical Learning", 
      tech: "Skill Development", 
      innovation: "Local Solutions" 
    },
    features: ["Parent Engagement", "Local Partnerships", "Skill Training", "Career Preparation"],
    cta: "Apply Now",
    link: "/pages/apply-for-admissions",
    highlightColor: "cyan",
    testimonial: "\"An important educational institution serving the Matungulu community.\"",
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
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

      {/* Welcome Banner - Mobile Responsive */}
      <div className="absolute top-4 sm:top-6 left-0 right-0 z-30 flex justify-center px-2 sm:px-4">
        <div className="relative inline-flex items-center gap-2 sm:gap-4 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 
          bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30
          backdrop-blur-xl rounded-full border border-white/30 shadow-lg sm:shadow-2xl
          max-w-[90%] sm:max-w-none overflow-hidden">

          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-white/10 blur-xl -z-10" />

          {/* Text - Reduced size */}
          <span className="text-white text-xs sm:text-sm md:text-base 
            font-semibold italic tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
            Welcome to <span className="font-bold hidden sm:inline">Katwanyaa High School</span>
            <span className="font-bold inline sm:hidden">KHS</span>
          </span>

          {/* Live Indicator */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400/50 rounded-full animate-ping" />
          </div>
        </div>
      </div>

      {/* Main Content Area - Responsive adjustments */}
      <div className="relative z-20 h-full flex flex-col mt-[5%] items-center justify-center px-3 sm:px-4 md:px-6 lg:px-12 text-center">
        <div className={`w-full max-w-4xl transition-all duration-500 transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} px-2`}>
          
          {/* Tagline - Reduced size */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-2 mb-4 sm:mb-4">
            <div className="h-[1px] w-5 sm:w-6 md:w-8 bg-white/40" />

            <span
              className={`
                uppercase
                tracking-[0.10em] xs:tracking-[0.12em] sm:tracking-[0.15em]
                text-xs xs:text-sm sm:text-sm
                font-bold
                ${getHighlightColorClass(slide.highlightColor)}
              `}
            >
              {isMobile ? slide.subtitle.substring(0, 22) + '...' : slide.subtitle}
            </span>

            <div className="h-[1px] w-5 sm:w-6 md:w-8 bg-white/40" />
          </div>

          {/* Dynamic Heading - REDUCED SIZE from 7xl to 5xl */}
          <h1 className="
            text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl
            font-extrabold
            text-white
            leading-tight
            mb-3 sm:mb-4 md:mb-5
            drop-shadow-lg
            px-2
          ">
            {slide.title.split(' ').map((word, i) => (
              <span
                key={i}
                className={`
                  ${i === slide.title.split(' ').length - 1 ? getHighlightColorClass(slide.highlightColor) : ""}
                  ${isMobile && word.length > 8 ? 'block' : ''}
                `}
              >
                {word}{' '}
              </span>
            ))}
          </h1>

          {/* Description - Reduced size and improved readability */}
          <p className="
            text-sm xs:text-base sm:text-lg
            text-gray-300
            mb-4 sm:mb-5 md:mb-6
            mx-auto
            max-w-sm xs:max-w-md sm:max-w-xl md:max-w-2xl
            font-normal
            leading-relaxed
            line-clamp-3 sm:line-clamp-none
          ">
            {isMobile ? slide.description.substring(0, 120) + '...' : slide.description}
          </p>

          {/* Stats - Responsive Grid */}
          <div className="grid grid-cols-3 gap-1 xs:gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl mx-auto">
            {Object.entries(slide.stats).map(([key, value], i) => (
              <div key={i} className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 p-1 xs:p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className={`text-sm xs:text-base sm:text-lg md:text-xl font-bold ${getHighlightColorClass(slide.highlightColor)} mb-0.5 sm:mb-1`}>
                  {value.split(' ')[0]}
                </div>
                <span className="text-white/80 text-[8px] xs:text-xs uppercase tracking-wider text-center leading-tight">
                  {isMobile ? value.split(' ').slice(1, 2).join(' ') + '...' : value.split(' ').slice(1).join(' ')}
                </span>
              </div>
            ))}
          </div>

          {/* Features - Responsive Grid */}
          <div className="grid grid-cols-2 gap-1 xs:gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-8 max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
            {slide.features.map((feature, i) => (
              <div key={i} className="flex items-center justify-center space-x-1 xs:space-x-2 
                bg-white/5 backdrop-blur-sm border border-white/10 p-1 xs:p-2 sm:p-3 rounded-lg sm:rounded-xl 
                hover:bg-white/10 transition-all duration-300 group overflow-hidden">
                <IconComponent className={`w-3 h-3 xs:w-4 xs:h-4 ${getHighlightColorClass(slide.highlightColor)} flex-shrink-0`} />
                <span className="text-white font-medium text-[10px] xs:text-xs sm:text-sm group-hover:text-white/90 whitespace-nowrap overflow-hidden text-ellipsis">
                  {isMobile && feature.length > 12 ? feature.substring(0, 10) + '...' : feature}
                </span>
              </div>
            ))}
          </div>

          {/* Testimonial - Reduced size */}
          <div className="mb-3 sm:mb-4 md:mb-6 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-xl mx-auto">
            <div className={`border-l-2 sm:border-l-4 ${getBorderColorClass(slide.highlightColor)} pl-2 sm:pl-3 md:pl-4 py-1 sm:py-2 bg-white/5 backdrop-blur-sm rounded-r-lg`}>
              <p className="text-white/70 text-[10px] xs:text-xs sm:text-sm italic">
                {isMobile ? slide.testimonial.substring(0, 80) + '...' : slide.testimonial}
              </p>
            </div>
          </div>

          {/* Action Buttons - Mobile Optimized */}
          <div className="
            flex items-center justify-center gap-3
            sm:flex-row sm:gap-4
            px-2
          ">
            <button
              onClick={handleSlideButtonClick}
              disabled={navigationBlocked}
              className="
                px-4 sm:px-6
                py-2 sm:py-3
                bg-white text-black
                rounded-full font-semibold
                text-sm
                hover:bg-gray-200
                transition-all
                flex items-center justify-center gap-2
                shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {slide.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={openVideoModal}
              className="
                px-4 sm:px-6
                py-2 sm:py-3
                bg-transparent
                border border-white/40
                text-white
                rounded-full font-semibold
                text-sm
                hover:bg-white/10 hover:border-white/70
                backdrop-blur-sm
                transition-all duration-300
                flex items-center justify-center gap-2
              "
            >
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {isMobile ? 'Tour' : 'View Tour'}
            </button>
          </div>
        </div>
      </div>

      {/* Modern Controls - Mobile Responsive Position */}
      <div className={`absolute z-30 flex space-x-3 sm:space-y-3 sm:flex-col ${isMobile ? 'bottom-4 right-4 flex-row' : 'bottom-10 right-8 flex-col'}`}>
        <button 
          onClick={prevSlide}
          className={`rounded-full border border-white/10 text-white hover:bg-white hover:text-black 
            transition-all group backdrop-blur-sm hover:scale-110 duration-300
            ${isMobile ? 'p-2' : 'p-3'}`}
        >
          <ChevronLeft className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </button>
        <button 
          onClick={nextSlide}
          className={`rounded-full border border-white/10 text-white hover:bg-white hover:text-black 
            transition-all group backdrop-blur-sm hover:scale-110 duration-300
            ${isMobile ? 'p-2' : 'p-3'}`}
        >
          <ChevronRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </button>
      </div>

      {/* Progress Indicators - Mobile Responsive */}
      {!isMobile && (
        <div className="absolute top-1/2 right-4 sm:right-6 md:right-8 -translate-y-1/2 z-30 hidden sm:flex flex-col space-y-4 sm:space-y-6">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className="group flex items-center justify-end"
            >
              <span className={`mr-2 sm:mr-3 text-[8px] sm:text-[10px] font-mono transition-all ${currentSlide === index ? 'text-white' : 'text-white/30 opacity-0 group-hover:opacity-100'}`}>
                0{index + 1}
              </span>
              <div className={`w-[1px] sm:w-[2px] transition-all duration-300 rounded-full ${currentSlide === index ? `h-6 sm:h-8 ${getProgressColorClass(heroSlides[index].highlightColor)}` : 'h-2 sm:h-3 bg-white/20 group-hover:bg-white/40'}`} />
            </button>
          ))}
        </div>
      )}

      {/* Mobile Progress Dots */}
      {isMobile && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: currentSlide === index 
                  ? getProgressColorValue(heroSlides[index].highlightColor)
                  : 'rgba(255, 255, 255, 0.3)'
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom Info Strip - Mobile Responsive */}
      <div className={`absolute bottom-0 left-0 w-full z-10 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 lg:px-12 
        border-t border-white/5 bg-black/80 backdrop-blur-lg 
        ${isMobile ? 'flex flex-col items-center justify-center gap-1' : 'hidden md:flex items-center justify-between'} 
        text-white/70 text-[8px] xs:text-[10px] tracking-[0.1em] sm:tracking-[0.15em] uppercase font-semibold`}>
        
        {isMobile ? (
          <>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-nowrap">
                <BookOpen className="w-2 h-2 xs:w-3 xs:h-3 mr-1" />
                Matungulu
              </span>
              <span className="flex items-center text-nowrap">
                <Trophy className="w-2 h-2 xs:w-3 xs:h-3 mr-1" />
                Public School
              </span>
            </div>
            <button 
              onClick={openVideoModal}
              className="flex items-center text-white/80 hover:text-white transition-colors duration-300 group text-nowrap"
            >
              <Play className="w-2 h-2 xs:w-3 xs:h-3 mr-1 group-hover:scale-110 transition-transform" />
              Virtual Tour
            </button>
          </>
        ) : (
          <>
            <div className="flex space-x-4 md:space-x-6 lg:space-x-8">
              <span className="flex items-center">
                <BookOpen className="w-3 h-3 mr-2" />
                Matungulu, Machakos
              </span>
              <span className="flex items-center">
                <Trophy className="w-3 h-3 mr-2" />
                Public Secondary School
              </span>
            </div>
            <div className="flex space-x-4 md:space-x-6 lg:space-x-8">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-2" />
                Quality Education
              </span>
              <button 
                onClick={openVideoModal}
                className="flex items-center text-white/80 hover:text-white transition-colors duration-300 group"
              >
                <Play className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
                Virtual Tour
              </button>
            </div>
          </>
        )}
      </div>

      {/* Video Tour Modal - Mobile Responsive */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-black/80 to-transparent p-2 sm:p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-lg 
                  bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center flex-shrink-0">
                  <Play className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-white font-bold text-xs sm:text-sm md:text-base truncate">Katwanyaa High School Tour</h4>
                  <p className="text-white/60 text-[10px] sm:text-xs md:text-sm truncate">
                    {schoolData?.name || 'Katwanyaa High School - Matungulu'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeVideoModal}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-black/50 text-white 
                  hover:bg-black/70 transition-colors flex items-center justify-center 
                  hover:scale-110 duration-300 flex-shrink-0"
                aria-label="Close video"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
              </button>
            </div>
            
            {/* Video Container */}
            <div className="relative bg-black aspect-video">
              {loading ? (
                // Loading state
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white mb-2 sm:mb-4"></div>
                  <p className="text-white text-sm sm:text-base">Loading video tour...</p>
                </div>
              ) : error ? (
                // Error state
                <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
                  <div className="text-3xl sm:text-4xl md:text-5xl text-red-500 mb-2 sm:mb-4">!</div>
                  <p className="text-white text-center text-xs sm:text-sm md:text-base mb-2 sm:mb-4 px-2">{error}</p>
                  <button
                    onClick={retryVideoLoad}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white 
                      rounded-lg transition-colors text-xs sm:text-sm"
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
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
                      <div className="text-3xl sm:text-4xl md:text-5xl text-gray-400 mb-2 sm:mb-4">!</div>
                      <p className="text-white text-center text-sm sm:text-base">
                        Your browser does not support the video tag.
                      </p>
                    </div>
                  </video>
                </div>
              ) : (
                // No video available or no schoolData yet
                <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
                  <div className="text-3xl sm:text-4xl md:text-5xl text-gray-400 mb-2 sm:mb-4">!</div>
                  <p className="text-white text-center text-xs sm:text-sm md:text-base mb-2 sm:mb-4">
                    {schoolData ? 'No video tour available' : 'Loading...'}
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm text-center px-2">
                    {schoolData 
                      ? 'Please check back later for our virtual tour' 
                      : 'Fetching video data...'
                    }
                  </p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-transparent to-black/80 p-2 sm:p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div className="text-white/80 text-xs sm:text-sm hidden sm:block truncate">
                  {schoolData?.description?.substring(0, isMobile ? 50 : 100) + '...' || 'Experience Katwanyaa High School from anywhere in the world'}
                </div>
                <button
                  onClick={handleContactClick}
                  className="px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 
                    text-xs sm:text-sm md:text-base bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 
                    text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 
                    disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  disabled={navigationBlocked}
                >
                  {isMobile ? 'Learn More' : 'Get To Know Us More'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Blocker Overlay (temporary) */}
      {navigationBlocked && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 
            bg-black/70 text-white text-[10px] xs:text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
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

const getProgressColorValue = (color) => {
  switch(color) {
    case 'blue': return '#3b82f6';
    case 'green': return '#10b981';
    case 'cyan': return '#06b6d4';
    default: return '#3b82f6';
  }
};

export default ModernHero;