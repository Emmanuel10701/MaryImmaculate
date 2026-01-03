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
  FiChevronDown
} from 'react-icons/fi';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAcademicDropdownOpen, setIsAcademicDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAcademicDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
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
      name: 'Staff', 
      href: '/pages/staff',
      icon: FiUsers 
    },
    { 
      name: 'Gallery', 
      href: '/pages/gallery', 
      icon: FiImage 
    },
    { 
      name: 'Contact', 
      href: '/pages/contact', 
      icon: FiMail 
    }
  ];

  // Function to check if a link is active
  const isActiveLink = (href, exact = false) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (exact) {
      return pathname === href;
    }
    return pathname && pathname.startsWith(href);
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-700/95 backdrop-blur-sm shadow-lg border-b border-white/20' 
            : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 shadow-md'
        }`}
      >
        {/* Main Navigation */}
        <div className="w-full px-3 sm:px-4 lg:px-6">
          {/* Increased height by 20% (from h-14/h-16 to h-17/h-19.2) - using min-height for better control */}
<div className="flex items-center justify-between min-h-[68px] lg:min-h-[77px]">
            {/* Logo - Keep original size */}
            <div 
              className="flex items-center gap-2 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.location.href = '/'}
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-white/20 rounded-xl flex items-center justify-center shadow border border-white/30 overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="Nyaribu Secondary School Logo"
                 width={32}
                  height={32}
                  className="relative z-10 filter drop-shadow"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent whitespace-nowrap">
                  Nyaribu Secondary
                </h1>
                <p className="text-xs text-white/80 hidden lg:block whitespace-nowrap">
                  Soaring for Excellence
                </p>
              </div>
            </div>

            {/* Desktop Navigation - Keep original font sizes and spacing */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center mx-2">
              {navigation.map((item) => {
                const isActive = isActiveLink(item.href, item.exact);
                
                if (item.hasDropdown) {
                  return (
                    <div 
                      key={item.name} 
                      className="relative" 
                      ref={dropdownRef}
                      onMouseEnter={() => setIsAcademicDropdownOpen(true)}
                      onMouseLeave={() => setIsAcademicDropdownOpen(false)}
                    >
                      <button
                        className={`flex items-center gap-1.5 font-medium transition-all text-[13px] whitespace-nowrap px-3 py-3 rounded-lg ${
                          isActive || isAcademicDropdownOpen
                            ? 'text-white bg-white/25' 
                            : 'text-white/90 hover:text-white hover:bg-white/15'
                        }`}
                      >
                        <item.icon className="text-[14px] flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                        <FiChevronDown className={`text-[12px] transition-transform duration-200 ${
                          isAcademicDropdownOpen ? 'rotate-180' : ''
                        }`} />
                      </button>

                  {/* Dropdown Menu */}
{isAcademicDropdownOpen && (
  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
    <div className="px-3 py-2 border-b border-gray-100">
      <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wider">Academics</h3>
    </div>
    
    
    <a
      href="/pages/StudentPortal"
      className={`flex items-center gap-2 px-3 py-2 text-xs font-medium ${
        isActiveLink('/pages/StudentPortal')
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
      }`}
      onClick={() => setIsAcademicDropdownOpen(false)}
    >
      <FiFileText className="text-[12px]" />
      <span>Student Portal</span>
    </a>

    <a
      href="/pages/Guidance-and-Councelling"
      className={`flex items-center gap-2 px-3 py-2 text-xs font-medium ${
        isActiveLink('/pages/Guidance-and-Councelling')
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
      }`}
      onClick={() => setIsAcademicDropdownOpen(false)}
    >
      <FiUsers className="text-[12px]" />
      <span>Guidance & Counselling</span>
    </a>

    <a
      href="/pages/eventsandnews"
      className={`flex items-center gap-2 px-3 py-2 text-xs font-medium ${
        isActiveLink('/pages/eventsandnews')
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
      }`}
      onClick={() => setIsAcademicDropdownOpen(false)}
    >
      <FiCalendar className="text-[12px]" />
      <span>Events & News</span>
    </a>




        <a
      href="/pages/applyadmission"
      className={`flex items-center gap-2 px-3 py-2 text-xs font-medium ${
        isActiveLink('/pages/applyadmission')
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
      }`}
      onClick={() => setIsAcademicDropdownOpen(false)}
    >
      <FiBook className="text-[12px]" />
      <span>Apply Now</span>
    </a>
  </div>
)}
                    </div>
                  );
                }

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1.5 font-medium transition-all text-[13px] whitespace-nowrap px-3 py-3 rounded-lg ${
                      isActive 
                        ? 'text-white bg-white/25' 
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <item.icon className="text-[14px] flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Desktop Actions - Keep original font sizes */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <a
                href="/pages/career"
                className="flex items-center gap-1.5 font-medium text-[13px] whitespace-nowrap px-3 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/15"
              >
                <FiCalendar className="text-[14px]" />
                <span>Careers</span>
              </a>
              <a
                href="/pages/adminLogin"
                className={`flex items-center gap-1.5 font-medium text-[13px] whitespace-nowrap px-3 py-3 rounded-lg ${
                  isActiveLink('/pages/adminLogin')
                    ? 'text-blue-600 bg-white'
                    : 'text-white bg-white/20 hover:bg-white hover:text-blue-600'
                }`}
              >
                <FiLogIn className="text-[14px] flex-shrink-0" />
                <span>Admin</span>
              </a>
            </div>

            {/* Mobile Menu Button - Increased padding for taller navbar */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-lg text-white bg-white/20 hover:bg-white/30 transition-all"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-gradient-to-b from-blue-600 to-purple-700 border-t border-white/20">
            <div className="px-3 py-4">
              {/* Mobile Navigation */}
              <div className="space-y-1">
                {[
                  { name: 'Home', href: '/', icon: FiHome },
                  { name: 'About', href: '/pages/AboutUs', icon: FiInfo },
                  { name: 'Academics', href: '/pages/academics', icon: FiBook },
                  // ADDED: Assignments & Resources as main link in mobile
                  { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiFileText },
                  { name: 'Admissions', href: '/pages/admissions', icon: FiUserPlus },
                  { name: 'Staff', href: '/pages/staff', icon: FiUsers },
                  { name: 'Gallery', href: '/pages/gallery', icon: FiImage },
                  { name: 'Events', href: '/pages/eventsandnews', icon: FiCalendar },
                  { name: 'Contact', href: '/pages/contact', icon: FiMail }
                ].map((item) => {
                  const isActive = isActiveLink(item.href);
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'text-white/90 hover:text-white hover:bg-white/15'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="text-base flex-shrink-0" />
                      <span>{item.name}</span>
                    </a>
                  );
                })}

                {/* REMOVED: Academic Dropdown Items in Mobile since Assignments is now a main link */}
              </div>

              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t border-white/30">
                <a
                  href="/pages/adminLogin"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${
                    isActiveLink('/pages/adminLogin')
                      ? 'bg-white text-blue-600'
                      : 'bg-white/20 hover:bg-white hover:text-blue-600 text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <FiLogIn className="text-base" />
                  <span>Admin Login</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav - Increased height by 20% */}
      <div className="h-14 lg:h-16"></div>
    </>
  );
}