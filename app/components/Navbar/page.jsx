'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiInfo, 
  FiBook, 
  FiUserPlus,
  FiCalendar,
  FiImage,
  FiMail,
  FiLogIn,
  FiUsers,
  FiFileText,
  FiChevronDown,
  FiBriefcase,
  FiChevronRight,
  FiLock,
  FiGrid,
  FiShield,
  FiAward,
  FiTarget
} from 'react-icons/fi';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAcademicDropdownOpen, setIsAcademicDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileResourcesDropdownOpen, setIsMobileResourcesDropdownOpen] = useState(false);
  
  const academicDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileResourcesDropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setIsMobileDropdownOpen(false);
        setIsMobileResourcesDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (academicDropdownRef.current && !academicDropdownRef.current.contains(event.target)) {
        setIsAcademicDropdownOpen(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) {
        setIsResourcesDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
      }
      if (mobileResourcesDropdownRef.current && !mobileResourcesDropdownRef.current.contains(event.target)) {
        setIsMobileResourcesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Main navigation
  const mainNavigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: FiHome,
      exact: true
    },
    { 
      name: 'About', 
      href: '/pages/AboutUs',
      icon: FiInfo
    },
    { 
      name: 'Academics', 
      href: '/pages/academics',
      icon: FiBook,
      hasDropdown: true
    },
    { 
      name: 'Admissions', 
      href: '/pages/admissions',
      icon: FiUserPlus
    },
    { 
      name: 'Gallery', 
      href: '/pages/gallery', 
      icon: FiImage 
    },
    { 
      name: 'News & Events', 
      href: '/pages/eventsandnews', 
      icon: FiCalendar 
    },
    { 
      name: 'Contact', 
      href: '/pages/contact', 
      icon: FiMail 
    }
  ];

  const academicDropdownItems = [
    {
      name: 'Student Portal',
      href: '/pages/StudentPortal',
      icon: FiFileText
    },
    {
      name: 'Guidance & Counselling',
      href: '/pages/Guidance-and-Councelling',
      icon: FiUsers
    },
    {
      name: 'Apply Now',
      href: '/pages/apply-for-admissions',
      icon: FiUserPlus
    }
  ];

  // Resources dropdown items - INCLUDES ADMIN LOGIN
  const resourcesDropdownItems = [
    {
      name: 'Staff Directory',
      href: '/pages/staff',
      icon: FiUsers
    },
    {
      name: 'Careers',
      href: '/pages/careers',
      icon: FiBriefcase
    },
    {
      name: 'Admin Login',
      href: '/pages/adminLogin',
      icon: FiLock,
      isHighlighted: true
    }
  ];

  // Function to check if a link is active
  const isActiveLink = (href, exact = false) => {
    if (!pathname) return false;
    if (href === '/') {
      return pathname === '/';
    }
    if (exact) {
      return pathname === href;
    }
    return pathname && pathname.startsWith(href);
  };

  // Navigation handlers
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLogoKeyDown = (e) => {
    if (e.key === 'Enter') {
      window.location.href = '/';
    }
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-br from-amber-600/95 via-orange-600/95 to-red-600/95 backdrop-blur-xl shadow-2xl border-b border-white/20' 
            : 'bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 shadow-xl'
        }`}
      >
        {/* Enhanced Background Pattern - Matching PortalHeader */}
        <div className="absolute inset-0 opacity-[0.08] sm:opacity-[0.1] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.15)_1px,_transparent_0)] 
            bg-[size:20px_20px] sm:bg-[size:24px_24px] md:bg-[size:28px_28px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 to-red-400/5" />
        </div>
        
        {/* Glow Effects - Matching PortalHeader */}
        <div className="absolute -right-8 -top-8 
          w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 
          bg-gradient-to-r from-amber-300 to-orange-400 rounded-full opacity-15 sm:opacity-20 blur-xl md:blur-2xl animate-pulse" />
        
        <div className="absolute -left-10 -bottom-10
          w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 
          bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-10 sm:opacity-15 blur-lg sm:blur-xl" />

        <div className="relative z-10 w-full px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[4.5rem] sm:min-h-[5.2rem]">
            
            {/* Logo Section - Mobile Responsive */}
            <div 
              className="flex items-center gap-2 xs:gap-3  cursor-pointer hover:opacity-90 transition-opacity "
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyDown={handleLogoKeyDown}
            >
              <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 
                bg-white/20 rounded-lg xs:rounded-xl flex items-center justify-center 
                shadow-xl border border-white/30 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <Image
                  src="/ll.png"
                  alt="Mary Immaculate Girls Secondary School Logo"
                  width={48}
                  height={48}
                  className="relative z-10 filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14"
                  priority
                  sizes="(max-width: 480px) 48px, (max-width: 640px) 56px, 64px"
                />
                <div className="absolute inset-0 border-2 border-amber-400/20 rounded-lg xs:rounded-xl"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-amber-100 to-orange-50 bg-clip-text text-transparent whitespace-nowrap tracking-tight">
                  Mary Immaculate Girls Secondary
                </h1>
                <p className="text-xs sm:text-sm text-amber-100/90 font-medium tracking-wide whitespace-nowrap flex items-center gap-1">
                  <FiTarget className="text-amber-300" />
                  Prayer, Discipline and Hardwork 
                </p>
              </div>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-8 min-w-0">
              <div className="flex items-center justify-between w-full max-w-4xl">
                {mainNavigation.map((item) => {
                  const isActive = isActiveLink(item.href, item.exact);
                  
                  if (item.hasDropdown) {
                    return (
                      <div 
                        key={item.name} 
                        className="relative"
                        ref={academicDropdownRef}
                        onMouseEnter={() => setIsAcademicDropdownOpen(true)}
                        onMouseLeave={() => setIsAcademicDropdownOpen(false)}
                      >
                        <button
                          className={`group flex items-center gap-1.5 font-bold transition-all text-[0.7rem] uppercase tracking-wide whitespace-nowrap px-3 py-2.5 relative min-w-[80px] ${
                            isActive || isAcademicDropdownOpen
                              ? 'text-white drop-shadow-lg' 
                              : 'text-amber-100/90 hover:text-white'
                          }`}
                          aria-expanded={isAcademicDropdownOpen}
                          aria-haspopup="true"
                        >
                          <item.icon className="text-xs flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                          <FiChevronDown className={`text-xs transition-transform duration-200 ${
                            isAcademicDropdownOpen ? 'rotate-180' : ''
                          }`} />
                          
                          {/* Active underline indicator */}
                          {(isActive || isAcademicDropdownOpen) && (
                            <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-amber-300 to-orange-300 rounded-full"></span>
                          )}
                        </button>

                        {/* Academic Dropdown Menu */}
                        {isAcademicDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 w-52 bg-gradient-to-b from-white to-amber-50/95 rounded-xl shadow-2xl border border-amber-100/50 py-2 z-50 backdrop-blur-sm">
                            <div className="px-3 py-2 border-b border-amber-100/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-t-xl">
                              <h3 className="font-bold text-amber-900 text-[0.7rem] uppercase tracking-wider flex items-center gap-1.5">
                                <FiAward className="text-amber-600 text-xs" />
                                Academic Excellence
                              </h3>
                            </div>
                            
                            {academicDropdownItems.map((dropdownItem) => (
                              <a
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className={`group flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-all hover:pl-3.5 ${
                                  isActiveLink(dropdownItem.href)
                                    ? 'text-orange-700 bg-gradient-to-r from-amber-50/60 to-orange-50/60 border-l-3 border-orange-500'
                                    : 'text-amber-900/80 hover:text-orange-700 hover:bg-gradient-to-r hover:from-amber-50/40 hover:to-orange-50/40'
                                }`}
                                onClick={() => setIsAcademicDropdownOpen(false)}
                              >
                                <dropdownItem.icon className="text-xs flex-shrink-0" />
                                <span className="flex-1 truncate">{dropdownItem.name}</span>
                                <FiChevronRight className="text-amber-400 text-xs group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center gap-1.5 font-bold transition-all text-[0.7rem] uppercase tracking-wide whitespace-nowrap px-3 py-2.5 relative min-w-[70px] ${
                        isActive 
                          ? 'text-white drop-shadow-lg' 
                          : 'text-amber-100/90 hover:text-white'
                      }`}
                    >
                      <item.icon className="text-xs flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate">{item.name}</span>
                      
                      {/* Active underline indicator */}
                      {isActive && (
                        <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-amber-300 to-orange-300 rounded-full"></span>
                      )}
                      
                      {/* Hover underline indicator */}
                      <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-300/50 to-orange-300/50 rounded-full group-hover:w-6 transition-all duration-300"></span>
                    </a>
                  );
                })}
                
                {/* Resources Dropdown (Staff, Careers & Admin Login) - ALWAYS SHOWN */}
                <div 
                  className="relative"
                  ref={resourcesDropdownRef}
                  onMouseEnter={() => setIsResourcesDropdownOpen(true)}
                  onMouseLeave={() => setIsResourcesDropdownOpen(false)}
                >
                  <button
                    className={`group flex items-center gap-1.5 font-bold transition-all text-[0.7rem] uppercase tracking-wide whitespace-nowrap px-3 py-2.5 relative min-w-[80px] ${
                      isResourcesDropdownOpen || 
                      isActiveLink('/pages/staff') || 
                      isActiveLink('/pages/career') ||
                      isActiveLink('/pages/adminLogin')
                        ? 'text-white drop-shadow-lg' 
                        : 'text-amber-100/90 hover:text-white'
                    }`}
                    aria-expanded={isResourcesDropdownOpen}
                    aria-haspopup="true"
                  >
                    <FiGrid className="text-xs flex-shrink-0" />
                    <span className="truncate">Resources</span>
                    <FiChevronDown className={`text-xs transition-transform duration-200 ${
                      isResourcesDropdownOpen ? 'rotate-180' : ''
                    }`} />
                    
                    {/* Active underline indicator */}
                    {(isResourcesDropdownOpen || 
                      isActiveLink('/pages/staff') || 
                      isActiveLink('/pages/career') ||
                      isActiveLink('/pages/adminLogin')) && (
                      <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-amber-300 to-orange-300 rounded-full"></span>
                    )}
                  </button>

                  {/* Resources Dropdown Menu - INCLUDES ADMIN LOGIN */}
                  {isResourcesDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-gradient-to-b from-white to-amber-50/95 rounded-xl shadow-2xl border border-amber-100/50 py-2 z-50 backdrop-blur-sm">
                      <div className="px-3 py-2 border-b border-amber-100/50 bg-gradient-to-r from-orange-50/80 to-red-50/80 rounded-t-xl">
                        <h3 className="font-bold text-amber-900 text-[0.7rem] uppercase tracking-wider flex items-center gap-1.5">
                          <FiShield className="text-orange-600 text-xs" />
                          Resources & Admin
                        </h3>
                      </div>
                      
                      {resourcesDropdownItems.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className={`group flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-all hover:pl-3.5 ${
                            isActiveLink(dropdownItem.href)
                              ? dropdownItem.isHighlighted
                                ? 'bg-gradient-to-r from-orange-50/60 to-red-50/60 border-l-3 border-orange-600 text-orange-700'
                                : 'text-orange-700 bg-gradient-to-r from-amber-50/60 to-orange-50/60 border-l-3 border-orange-500'
                              : dropdownItem.isHighlighted
                                ? 'text-orange-600 hover:text-orange-700 hover:bg-gradient-to-r hover:from-orange-50/40 hover:to-red-50/40'
                                : 'text-amber-900/80 hover:text-orange-700 hover:bg-gradient-to-r hover:from-amber-50/40 hover:to-orange-50/40'
                          }`}
                          onClick={() => setIsResourcesDropdownOpen(false)}
                        >
                          <dropdownItem.icon className={`text-xs flex-shrink-0 ${
                            dropdownItem.isHighlighted ? 'text-orange-600' : ''
                          }`} />
                          <span className="flex-1 truncate">{dropdownItem.name}</span>
                          <FiChevronRight className={`text-xs ${
                            dropdownItem.isHighlighted 
                              ? 'text-orange-400 group-hover:text-orange-600' 
                              : 'text-amber-400 group-hover:text-orange-500'
                          } opacity-0 group-hover:opacity-100 transition-all`} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button - Responsive */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 xs:p-3 rounded-lg xs:rounded-xl text-white 
                bg-white/20 hover:bg-white/30 transition-all active:scale-95 ml-auto border border-white/30 shadow-lg"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <FiX className="text-xl xs:text-2xl sm:text-3xl" />
              ) : (
                <FiMenu className="text-xl xs:text-2xl sm:text-3xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Responsive */}
        {isOpen && (
          <div className="lg:hidden bg-gradient-to-br from-amber-700 via-orange-700 to-red-700 border-t border-white/20 backdrop-blur-xl">
            <div className="px-3 xs:px-4 sm:px-6 py-6 xs:py-8 max-w-2xl mx-auto">
              {/* Mobile Navigation */}
              <div className="space-y-1.5 xs:space-y-2 mb-6 xs:mb-8">
                {mainNavigation.map((item) => {
                  const isActive = isActiveLink(item.href, item.exact);
                  
                  if (item.hasDropdown) {
                    return (
                      <div key={item.name} className="space-y-1.5 xs:space-y-2" ref={mobileDropdownRef}>
                        <button
                          onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                          className={`w-full flex items-center justify-between p-3 xs:p-4 rounded-lg xs:rounded-xl text-left border border-white/20 shadow-lg ${
                            isActive || isMobileDropdownOpen
                              ? 'bg-white/30 text-white backdrop-blur-sm'
                              : 'text-amber-100/90 hover:bg-white/20 backdrop-blur-sm'
                          }`}
                          aria-expanded={isMobileDropdownOpen}
                        >
                          <div className="flex items-center gap-2 xs:gap-3">
                            <item.icon className="text-lg xs:text-xl" />
                            <span className="font-bold text-base xs:text-lg uppercase tracking-wide">{item.name}</span>
                          </div>
                          <FiChevronDown className={`text-lg xs:text-xl transition-transform duration-200 ${
                            isMobileDropdownOpen ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        {/* Mobile Academic Dropdown Items */}
                        {isMobileDropdownOpen && (
                          <div className="ml-6 xs:ml-8 space-y-1.5 xs:space-y-2 pl-3 xs:pl-4 border-l-2 border-white/30">
                            {academicDropdownItems.map((dropdownItem) => (
                              <a
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className={`flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg border border-white/10 ${
                                  isActiveLink(dropdownItem.href)
                                    ? 'bg-white/30 text-white backdrop-blur-sm'
                                    : 'text-amber-100/80 hover:bg-white/20 backdrop-blur-sm'
                                }`}
                                onClick={() => {
                                  setIsOpen(false);
                                  setIsMobileDropdownOpen(false);
                                }}
                              >
                                <dropdownItem.icon className="text-base xs:text-lg" />
                                <span className="font-medium text-sm xs:text-base">{dropdownItem.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 xs:gap-3 p-3 xs:p-4 rounded-lg xs:rounded-xl border border-white/20 shadow-lg ${
                        isActive
                          ? 'bg-white/30 text-white backdrop-blur-sm'
                          : 'text-amber-100/90 hover:bg-white/20 backdrop-blur-sm'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="text-lg xs:text-xl" />
                      <span className="font-bold text-base xs:text-lg uppercase tracking-wide">{item.name}</span>
                    </a>
                  );
                })}

                {/* Mobile Resources Dropdown (Staff, Careers & Admin Login) */}
                <div className="space-y-1.5 xs:space-y-2" ref={mobileResourcesDropdownRef}>
                  <button
                    onClick={() => setIsMobileResourcesDropdownOpen(!isMobileResourcesDropdownOpen)}
                    className={`w-full flex items-center justify-between p-3 xs:p-4 rounded-lg xs:rounded-xl text-left border border-white/20 shadow-lg ${
                      isMobileResourcesDropdownOpen ||
                      isActiveLink('/pages/staff') ||
                      isActiveLink('/pages/career') ||
                      isActiveLink('/pages/adminLogin')
                        ? 'bg-white/30 text-white backdrop-blur-sm'
                        : 'text-amber-100/90 hover:bg-white/20 backdrop-blur-sm'
                    }`}
                    aria-expanded={isMobileResourcesDropdownOpen}
                  >
                    <div className="flex items-center gap-2 xs:gap-3">
                      <FiGrid className="text-lg xs:text-xl" />
                      <span className="font-bold text-base xs:text-lg uppercase tracking-wide">Resources</span>
                    </div>
                    <FiChevronDown className={`text-lg xs:text-xl transition-transform duration-200 ${
                      isMobileResourcesDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Mobile Resources Dropdown Items */}
                  {isMobileResourcesDropdownOpen && (
                    <div className="ml-6 xs:ml-8 space-y-1.5 xs:space-y-2 pl-3 xs:pl-4 border-l-2 border-white/30">
                      {resourcesDropdownItems.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className={`flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg border border-white/10 ${
                            isActiveLink(dropdownItem.href)
                              ? dropdownItem.isHighlighted
                                ? 'bg-gradient-to-r from-orange-500/40 to-red-500/40 text-white backdrop-blur-sm'
                                : 'bg-white/30 text-white backdrop-blur-sm'
                              : dropdownItem.isHighlighted
                                ? 'text-white hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-red-500/30 backdrop-blur-sm'
                                : 'text-amber-100/80 hover:bg-white/20 backdrop-blur-sm'
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            setIsMobileResourcesDropdownOpen(false);
                          }}
                        >
                          <dropdownItem.icon className="text-base xs:text-lg" />
                          <span className={`font-medium text-sm xs:text-base ${
                            dropdownItem.isHighlighted ? 'font-bold' : ''
                          }`}>
                            {dropdownItem.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Footer - Responsive */}
              <div className="mt-6 xs:mt-8 pt-4 xs:pt-6 border-t border-white/30 text-center backdrop-blur-sm">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-700/40 to-orange-700/40 backdrop-blur-md rounded-full border border-white/20">
                  <FiShield className="text-amber-300" />
                  <p className="text-amber-200/90 text-sm font-bold tracking-wide">
                    Empowering Future Leaders Since 1995
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav - Responsive */}
      <div className="h-[4.5rem] xs:h-20 sm:h-22 lg:h-24 transition-all duration-300"></div>
    </>
  );
}