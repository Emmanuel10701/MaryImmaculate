"use client"
import React, { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiArrowLeft, 
  FiBook, 
  FiMail, 
  FiCalendar, 
  FiBookOpen, 
  FiUsers, 
  FiBell,
  FiSearch,
  FiAlertCircle,
  FiMapPin,
  FiGlobe,
  FiChevronRight,
  FiStar
} from 'react-icons/fi';

const Modern404 = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const quickLinks = [
    { name: 'Home Base', href: '/', icon: FiHome, description: 'Back to assembly' },
    { name: 'Academics', href: '/pages/academics', icon: FiBook, description: 'Course directory' },
    { name: 'Gallery', href: '/pages/gallery', icon: FiBookOpen, description: 'School resources' },
    { name: 'Admissions', href: '/pages/admissions', icon: FiUsers, description: 'Join our family' },
    { name: 'Events & News', href: '/pages/eventsandnews', icon: FiCalendar, description: 'Upcoming terms' },
    { name: 'Support', href: '/pages/contact', icon: FiMail, description: 'Talk to the office' },
        { name: 'Portal', href: '/pages/StudentPortal', icon: FiMail, description: 'Navigate to Portal' },
    { name: 'Guidance', href: '/pages/Guidance-and-Coucelling', icon: FiMail, description: 'Guidance sessions' },

  ];

  const errorMessages = [
    "Looks like this page does not exist!",
    "This page is on a field trip!",
    "Assignment not found!",
    "This lesson hasn't been scheduled yet!",
    "Page is in detention!",
    "This classroom is empty!",
    "Lesson plan missing!",
    "This page graduated early!"
  ];

  useEffect(() => {
    setCurrentMessage(Math.floor(Math.random() * errorMessages.length));
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % errorMessages.length);
    }, 5000);
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50 overflow-hidden relative font-sans text-slate-900 antialiased">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute top-1/4 -left-8 text-rose-400 scale-[4] rotate-12"><FiGlobe /></div>
        <div className="absolute bottom-1/4 -right-8 text-purple-400 scale-[4] -rotate-12"><FiMapPin /></div>
        <div className="absolute top-1/2 left-1/4 text-slate-500 scale-[3] rotate-45"><FiSearch /></div>
        <div className="absolute top-3/4 right-1/3 text-indigo-400 scale-[3] -rotate-45"><FiAlertCircle /></div>
        <div className="absolute top-1/3 right-1/4 text-amber-300 scale-[2] rotate-90"><FiStar /></div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 md:py-12 relative z-10">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
            
            {/* Left Side: Error Message Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 rounded-full text-sm font-semibold tracking-wide border border-rose-200">
                <FiBell className="text-base animate-pulse" />
                <span>School Announcement</span>
              </div>

              <div className="relative">
                <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-slate-900 flex justify-center lg:justify-start items-baseline">
                  <span className="text-rose-600 drop-shadow-sm">4</span>
                  <span className="text-purple-500 mx-1 md:mx-2 drop-shadow-sm">0</span>
                  <span className="text-indigo-600 drop-shadow-sm">4</span>
                </h1>
                <div className="h-2 w-32 bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 mx-auto lg:mx-0 mt-2 md:mt-4 rounded-full shadow"></div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                  {errorMessages[currentMessage]}
                </h2>
                <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Even top students lose their way. This page seems to have wandered off-school. 
                  Let's guide you back to your studies with the options below.
                </p>
              </div>
<div className="flex flex-nowrap gap-3 sm:gap-4 pt-4 w-full">
  <a
    href="/"
    className="
      group
      flex items-center justify-center gap-2 sm:gap-3
      w-full sm:w-auto
      bg-gradient-to-r from-rose-600 to-purple-600
      hover:from-rose-700 hover:to-purple-700
      text-white
      px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4
      rounded-lg sm:rounded-xl md:rounded-2xl
      text-sm sm:text-base
      font-semibold
      transition-all duration-300
      shadow-lg shadow-rose-200
      hover:shadow-xl hover:shadow-purple-300
      active:scale-95
    "
  >
    <FiHome className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
    <span className="whitespace-nowrap">Back to Assembly</span>
    <FiChevronRight className="
      text-base sm:text-lg
      opacity-0 group-hover:opacity-100
      transform group-hover:translate-x-1
      transition-all duration-300
    " />
  </a>

  {/* Previous Lesson */}
  <button
    onClick={() => window.history.back()}
    className="
      group
      flex items-center justify-center gap-2 sm:gap-3
      w-full sm:w-auto
      bg-white
      border-2 border-slate-200
      hover:border-purple-200 hover:bg-purple-50
      text-slate-700
      px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4
      rounded-lg sm:rounded-xl md:rounded-2xl
      text-sm sm:text-base
      font-semibold
      transition-all duration-300
      shadow-md hover:shadow-lg
      active:scale-95
    "
  >
    <FiArrowLeft className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform duration-300" />
    <span className="whitespace-nowrap">Previous Lesson</span>
  </button>
</div>

            </div>

            {/* Right Side: Quick Links Section */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-rose-100 via-white to-indigo-100 rounded-[2rem] sm:rounded-[3rem] blur-xl opacity-60 -z-10"></div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100/80 p-6 sm:p-8 md:p-10">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2 bg-gradient-to-r from-rose-700 to-indigo-700 bg-clip-text text-transparent">
                      <FiMapPin className="text-rose-600" />
                      School Directory
                    </h3>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-rose-400 animate-pulse"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400 animate-pulse delay-75"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-indigo-400 animate-pulse delay-150"></div>
                    </div>
                  </div>
                  
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  {quickLinks.map((link) => {
    const Icon = link.icon;

    return (
      <a
        key={link.name}
        href={link.href}
        className="
          group
          p-3 sm:p-4
          rounded-xl
          border border-slate-100
          hover:border-rose-200
          hover:bg-gradient-to-br hover:from-rose-50/50 hover:to-white
          transition-all duration-300
          hover:shadow-md hover:shadow-rose-100
          active:scale-[0.98]
        "
      >
        <div className="flex items-start gap-3 sm:gap-4 flex-nowrap">
          {/* Icon */}
          <div
            className="
              p-2 sm:p-3
              bg-gradient-to-br from-slate-50 to-white
              group-hover:from-rose-500 group-hover:to-purple-600
              group-hover:text-white
              rounded-lg
              transition-all duration-300
              group-hover:scale-110
              shadow-sm
              flex-shrink-0
            "
          >
            <Icon className="text-base sm:text-xl" />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1 text-left">
            <h4 className="font-semibold text-slate-800 group-hover:text-rose-700 truncate">
              {link.name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 group-hover:text-slate-600 truncate italic">
              {link.description}
            </p>
          </div>

          {/* Arrow */}
          <FiChevronRight
            className="
              text-slate-400
              group-hover:text-rose-500
              mt-1
              flex-shrink-0
              opacity-0 group-hover:opacity-100
              transform group-hover:translate-x-1
              transition-all duration-300
            "
          />
        </div>
      </a>
    );
  })}
</div>

<div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100">
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 p-4 sm:p-6 text-white">
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-nowrap">
      
      {/* Left content */}
      <div className="space-y-1 min-w-0">
        <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
          Enrollment Status
        </p>

        <div className="flex items-baseline gap-2 flex-nowrap">
          <span className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow">
            1200+
          </span>
          <span className="text-xs sm:text-sm text-slate-300 italic">
            Active students
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          Need immediate assistance?
        </p>
      </div>

      {/* Button */}
      <a
        href="/pages/contact"
        className="
          inline-flex
          items-center
          gap-2
          px-4 py-2
          text-xs sm:text-sm
          rounded-lg
          border border-white/20
          bg-white/10 hover:bg-white/20
          backdrop-blur-sm
          transition-colors
          hover:border-white/30
          flex-shrink-0
        "
      >
        <FiMail className="text-sm" />
        Contact Office
      </a>
    </div>

    {/* Decorative element */}
    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-rose-500/10 to-purple-500/10 -rotate-45 translate-x-8 -translate-y-8 rounded-full" />
  </div>
</div>

                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <footer className="mt-8 md:mt-12 lg:mt-16 text-center">
            <p className="text-slate-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} Katwanyaa High in Matungulu 
              <span className="mx-2 text-slate-300">•</span>
               Education is Light 
              <span className="mx-2 text-slate-300">•</span>
              <a href="/" className="text-rose-600 hover:text-rose-800 transition-colors font-medium">
                Site Map
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Modern404;