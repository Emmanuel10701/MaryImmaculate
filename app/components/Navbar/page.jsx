'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiFileText
} from 'react-icons/fi';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '../../../images/logo.jpg'; 

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: FiHome 
    },
    { 
      name: 'About', 
      href: '/pages/AboutUs',
      icon: FiInfo
    },
    { 
      name: 'Academics', 
      href: '/pages/academics',
      icon: FiBook
    },
    { 
      name: 'Admissions', 
      href: '/pages/admissions',
      icon: FiUserPlus
    },
    { 
      name: 'Assignments', 
      href: '/pages/assignments',
      icon: FiFileText 
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
      name: 'Events', 
      href: '/pages/eventsandnews', 
      icon: FiCalendar 
    },
    { 
      name: 'Contact', 
      href: '/pages/contact', 
      icon: FiMail 
    }
  ];

  // Function to check if a link is active (JSX - no TypeScript types)
  const isActiveLink = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname && pathname.startsWith(href);
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
            : 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
        }`}
      >
        {/* Main Navigation */}
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Image
                  src={logo}
                  alt="Katwanyaa High School Logo"
                  width={24}
                  height={24}
                  className="filter brightness-0 invert"
                />
              </div>
              <div className="opacity-100">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Katwanyaa High
                </h1>
                <p className="text-sm text-gray-500 hidden lg:block">
                  Nurturing Excellence
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => {
                const isActive = isActiveLink(item.href);
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    whileHover={{ y: -2 }}
                    className={`flex items-center gap-2 font-semibold transition-colors text-base ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <item.icon className="text-lg" />
                    {item.name}
                  </motion.a>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.a
                href="/pages/login"
                whileHover={{ y: -2 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border transition-colors ${
                  isActiveLink('/pages/login')
                    ? 'text-blue-600 bg-blue-50 border-blue-200'
                    : 'text-blue-600 hover:bg-blue-50 border-blue-200'
                }`}
              >
                <FiLogIn className="text-lg" />
                Login
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 bg-gray-100 transition-colors"
            >
              {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6">
                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = isActiveLink(item.href);
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-base ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="text-xl" />
                        {item.name}
                      </a>
                    );
                  })}
                </div>

                {/* Mobile Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <a
                    href="/pages/login"
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-semibold text-base border ${
                      isActiveLink('/pages/login')
                        ? 'bg-blue-100 text-blue-600 border-blue-300'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <FiLogIn className="text-lg" />
                    Login
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed nav */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
}