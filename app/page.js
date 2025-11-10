'use client';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
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
  FiMail
} from 'react-icons/fi';
import { 
  IoRocketOutline, 
  IoPeopleOutline
} from 'react-icons/io5';
import { 
  GiGraduateCap, 
  GiModernCity,
  GiTreeGrowth
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

export default function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const videoRef = useRef(null);
  const splashTimerRef = useRef(null);
  const router = useRouter();

  // YouTube video ID extracted from the URL
  const youtubeVideoId = 'iWHpv3ihfDQ';
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}`;

  // Simple image URLs with reduced size for faster loading
  const onlineImages = {
    campus: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    students: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    scienceLab: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
    library: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800",
    sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    arts: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
    teacher1: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400",
    teacher2: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400",
    teacher3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    teacher4: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    graduation: "https://images.unsplash.com-1523050854058-8df90110c9f1?w=800",
    event1: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    event2: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    event3: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800"
  };

  const stats = [
    { value: 98, suffix: '%', label: 'Graduation Rate', icon: FiAward, image: onlineImages.graduation },
    { value: 2000, suffix: '+', label: 'Students Enrolled', icon: FiUsers, image: onlineImages.students },
    { value: 150, suffix: '+', label: 'Expert Faculty', icon: IoPeopleOutline, image: onlineImages.teacher1 },
    { value: 25, suffix: '', label: 'Sports Teams', icon: FiActivity, image: onlineImages.sports }
  ];

  const features = [
    {
      icon: GiGraduateCap,
      title: 'College Prep',
      description: 'Advanced placement and honors programs',
      image: onlineImages.library
    },
    {
      icon: IoRocketOutline,
      title: 'STEM Focus',
      description: 'State-of-the-art labs and technology',
      image: onlineImages.scienceLab
    },
    {
      icon: GiModernCity,
      title: 'Urban Campus',
      description: 'Located in the heart of the city',
      image: onlineImages.campus
    },
    {
      icon: GiTreeGrowth,
      title: 'Personal Growth',
      description: 'Leadership and character development',
      image: onlineImages.arts
    }
  ];

  // STAFF SECTION DATA
  const staffMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Principal',
      department: 'Administration',
      image: onlineImages.teacher1,
      experience: '15+ years',
      specialization: 'Educational Leadership',
      email: 's.johnson@school.edu'
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Head of Science',
      department: 'STEM Department',
      image: onlineImages.teacher2,
      experience: '12+ years',
      specialization: 'Physics & Robotics',
      email: 'm.chen@school.edu'
    },
    {
      name: 'Ms. Emily Rodriguez',
      role: 'Art Director',
      department: 'Creative Arts',
      image: onlineImages.teacher3,
      experience: '10+ years',
      specialization: 'Visual Arts & Design',
      email: 'e.rodriguez@school.edu'
    },
    {
      name: 'Coach David Wilson',
      role: 'Athletic Director',
      department: 'Sports & Wellness',
      image: onlineImages.teacher4,
      experience: '8+ years',
      specialization: 'Sports Science',
      email: 'd.wilson@school.edu'
    }
  ];

  // EVENTS SECTION DATA
  const upcomingEvents = [
    {
      title: 'Annual Science Fair 2024',
      date: 'March 25, 2024',
      time: '9:00 AM - 3:00 PM',
      location: 'Science Building',
      image: onlineImages.event1,
      category: 'Academic',
      description: 'Showcasing innovative student projects in STEM fields',
      registration: true
    },
    {
      title: 'Spring Music Festival',
      date: 'April 12, 2024',
      time: '6:00 PM - 9:00 PM',
      location: 'Auditorium',
      image: onlineImages.event2,
      category: 'Cultural',
      description: 'An evening of musical performances by our talented students',
      registration: false
    },
    {
      title: 'Robotics Competition',
      date: 'May 5, 2024',
      time: '10:00 AM - 5:00 PM',
      location: 'Innovation Lab',
      image: onlineImages.event3,
      category: 'Competition',
      description: 'Inter-school robotics challenge showcasing engineering skills',
      registration: true
    }
  ];

  const campusGallery = [
    {
      title: 'Modern Library',
      image: onlineImages.library,
      description: '24/7 access to digital and physical resources'
    },
    {
      title: 'Science Labs',
      image: onlineImages.scienceLab,
      description: 'Cutting-edge equipment for hands-on learning'
    },
    {
      title: 'Athletic Center',
      image: onlineImages.sports,
      description: 'Olympic-grade training facilities'
    },
    {
      title: 'Arts Studio',
      image: onlineImages.arts,
      description: 'Creative spaces for artistic expression'
    }
  ];

  useEffect(() => {
    // Calculate total images to load
    const allImages = [
      ...Object.values(onlineImages),
      ...stats.map(stat => stat.image),
      ...features.map(feature => feature.image),
      ...staffMembers.map(staff => staff.image),
      ...upcomingEvents.map(event => event.image),
      ...campusGallery.map(item => item.image)
    ];
    
    const uniqueImages = [...new Set(allImages)];
    setTotalImages(uniqueImages.length);

    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);

    // fallback splash so loader never hangs — ~900ms branded splash
    splashTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(splashTimerRef.current);
    };
  }, []);
 
  useEffect(() => {
    // If all assets loaded earlier than the splash fallback, hide loader immediately
    if (totalImages > 0 && imagesLoaded >= totalImages) {
      setIsLoading(false);
      clearTimeout(splashTimerRef.current);
    }
  }, [imagesLoaded, totalImages]);
 
  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };
 
  // disable page scroll while loading
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isLoading]);

  // Loading Component (overlay)
   const LoadingScreen = () => (
     <Fade in={isLoading} timeout={800}>
       <Backdrop
         sx={{
           backgroundColor: 'rgba(15, 23, 42, 0.95)',
           backdropFilter: 'blur(10px)',
           zIndex: 9999,
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           justifyContent: 'center',
         }}
         open={isLoading}
       >
         <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.5 }}
           className="text-center"
         >
           {/* Animated Logo/Icon */}
           <motion.div
             animate={{ 
               rotate: 360,
               scale: [1, 1.1, 1]
             }}
             transition={{ 
               rotate: { duration: 2, repeat: Infinity, ease: "linear" },
               scale: { duration: 1.5, repeat: Infinity }
             }}
             className="mb-8"
           >
             <GiGraduateCap className="text-6xl text-blue-400 mx-auto" />
           </motion.div>
 
           {/* Indeterminate spinner (no percentage) */}
           <Box sx={{ display: 'inline-flex', mb: 3 }}>
             <CircularProgress
               size={80}
               thickness={4}
               sx={{
                 color: 'primary.main',
                 '& .MuiCircularProgress-circle': {
                   strokeLinecap: 'round',
                 }
               }}
             />
           </Box>
 
           {/* Loading Text */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
           >
             <Typography 
               variant="h6" 
               className="text-white mb-2 font-semibold"
             >
               Preparing Your Journey
             </Typography>
             <Typography 
               variant="body2" 
               className="text-blue-200"
             >
               Loading katz Wewbpage...
             </Typography>
           </motion.div>
 
           {/* Animated Dots */}
           <motion.div className="flex justify-center mt-4 space-x-1">
             {[0, 1, 2].map((index) => (
               <motion.div
                 key={index}
                 animate={{ 
                   y: [0, -10, 0],
                   opacity: [0.5, 1, 0.5]
                 }}
                 transition={{ 
                   duration: 1.5,
                   repeat: Infinity,
                   delay: index * 0.2
                 }}
                 className="w-2 h-2 bg-blue-400 rounded-full"
               />
             ))}
           </motion.div>
         </motion.div>
       </Backdrop>
     </Fade>
   );

   // Navigation / UI handlers (single definitions)
   const handleAcademicsClick = () => {
     router.push('/pages/academics');
   };
   const handleWatchTour = () => setShowVideoModal(true);
   const closeVideoModal = () => setShowVideoModal(false);
   const handleEventClick = () => router.push('/pages/eventsandnews'); // fixed typo
   const handleStaffClick = () => router.push('/pages/staff');
 
 // Main content rendering
   return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Loading Screen overlay */}
      <LoadingScreen />
 
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={onlineImages.campus}
            alt="School Campus"
            fill
            className="object-cover opacity-20"
            priority
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90"></div>
        </div>
      </div>

      {/* Main Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }} 
              className="text-white"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 border border-white/20">
                <FiStar className="text-yellow-400" />
                <span className="text-sm font-medium">Ranked #1 in State for STEM Programs</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Where Future
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Innovators Thrive
                </span>
              </h1>

              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Join a community of curious minds, passionate educators, and future leaders. 
                Our cutting-edge campus and innovative curriculum prepare students for the world of tomorrow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAcademicsClick}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 text-lg"
                >
                  Our Schools <FiArrowRight className="text-xl" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWatchTour}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold border border-white/20 flex items-center justify-center gap-3 text-lg"
                >
                  <FiPlay className="text-xl" />
                  Watch Tour
                </motion.button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }} 
                    className="text-center group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-3 h-20">
                      <Image
                        src={stat.image}
                        alt={stat.label}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        onLoad={handleImageLoad}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <stat.icon className="text-white text-2xl" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-2xl font-bold text-white">
                        {stat.value}{stat.suffix}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Interactive Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative"
            >
              {/* Main Showcase Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 relative overflow-hidden">
                {/* Image Gallery Slider */}
                <div className="relative rounded-2xl overflow-hidden bg-black mb-6 h-64">
                  <Image
                    src={features[currentSlide].image}
                    alt={features[currentSlide].title}
                    fill
                    className="object-cover"
                    onLoad={handleImageLoad}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex gap-1">
                      {features.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            currentSlide === index ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                      {features[currentSlide].title}
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      transition={{ duration: 0.2 }} 
                      className="p-4 rounded-xl border border-white/10 cursor-pointer group"
                      onClick={() => setCurrentSlide(index)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <feature.icon className="text-blue-400 text-2xl" />
                        <h3 className="text-white font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Upcoming Events */}
                <div className="bg-white/5 rounded-2xl p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <FiCalendar className="text-blue-400" />
                    Upcoming Events
                  </h4>
                  <div className="space-y-3">
                    {upcomingEvents.slice(0, 2).map((item, index) => (
                      <motion.div
                        key={item.title}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }} 
                        onClick={handleEventClick}
                        className="flex items-center gap-3 text-white/80 hover:text-white cursor-pointer group"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm flex-1">{item.title}</span>
                        <span className="text-xs text-white/40 group-hover:text-white/60">
                          {item.date}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }} 
                className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-2xl shadow-2xl"
              >
                <div className="text-white text-center">
                  <div className="font-bold text-lg">Open</div>
                  <div className="text-sm">House</div>
                  <div className="text-xs mt-1">May 15</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }} 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-white/60 flex flex-col items-center gap-2">
            <span className="text-sm">Explore More</span>
            <FiChevronDown className="text-xl" />
          </div>
        </motion.div>
      </section>

      {/* EVENTS SECTION */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }} 
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Upcoming Events</h2>
            <p className="text-white/60 text-xl">Join us for these exciting upcoming events</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }} 
                whileHover={{ y: -5 }}
                onClick={handleEventClick}
                className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden group cursor-pointer"
              >
               <div className="relative h-48 overflow-hidden">
                 <Image
                   src={event.image}
                   alt={event.title}
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-300"
                   onLoad={handleImageLoad}
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 />
                 <div className="absolute top-4 right-4">
                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                     event.category === 'Academic' ? 'bg-blue-500/80' :
                     event.category === 'Cultural' ? 'bg-purple-500/80' :
                     'bg-green-500/80'
                   } text-white backdrop-blur-sm`}>
                     {event.category}
                   </span>
                 </div>
               </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                  <p className="text-white/70 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <FiCalendar className="text-blue-400" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <FiMapPin className="text-red-400" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold text-sm"
                    >
                      {event.registration ? 'Register Now' : 'Learn More'}
                    </motion.button>
                    <button className="text-white/60 hover:text-white transition-colors">
                      <FiShare2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STAFF SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }} 
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Faculty</h2>
            <p className="text-white/60 text-xl">Dedicated educators shaping future leaders</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {staffMembers.map((staff, index) => (
              <motion.div
                key={staff.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -5 }}
                onClick={handleStaffClick}
                className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 text-center group cursor-pointer"
              >
               <div className="relative w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden">
                 <Image
                   src={staff.image}
                   alt={staff.name}
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-300"
                   onLoad={handleImageLoad}
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                 />
               </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{staff.name}</h3>
                <p className="text-blue-300 font-semibold mb-1">{staff.role}</p>
                <p className="text-white/70 text-sm mb-3">{staff.department}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                    <FiAward className="text-yellow-400" />
                    <span>{staff.experience} Experience</span>
                  </div>
                  <div className="text-white/60 text-sm">
                    {staff.specialization}
                  </div>
                </div>
                
                <motion.a
                  href={`mailto:${staff.email}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }} 
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  <FiMail className="text-lg" />
                  Contact
                </motion.a>
              </motion.div>
            ))}
          </div>

          {/* View Our Talented Staff Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }} 
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }} 
              onClick={handleStaffClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg"
            >
              View Our Talented Staff
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Campus Gallery Section - Now "Our Schools" */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }} 
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Schools</h2>
            <p className="text-white/60 text-xl">Explore our diverse academic programs and facilities</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campusGallery.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }} 
                whileHover={{ y: -5 }}
                onClick={handleAcademicsClick}
                className="group cursor-pointer"
              >
               <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                 <Image
                   src={item.image}
                   alt={item.title}
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-300"
                   onLoad={handleImageLoad}
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                 />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                 <div className="absolute bottom-4 left-4 text-white">
                   <h3 className="font-semibold text-lg">{item.title}</h3>
                   <p className="text-sm opacity-90">{item.description}</p>
                 </div>
               </div>
             </motion.div>
           ))}
         </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }} 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeVideoModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }} 
            className="relative bg-black rounded-2xl overflow-hidden max-w-4xl w-full aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`${youtubeEmbedUrl}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="School Campus Tour"
            />
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}