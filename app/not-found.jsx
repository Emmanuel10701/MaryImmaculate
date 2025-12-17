'use client';
import { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiArrowLeft, 
  FiBook,
  FiMail,
  FiCalendar
} from 'react-icons/fi';
import { 
  IoLibraryOutline,
  IoPeopleOutline
} from 'react-icons/io5';
import Link from 'next/link';

// ✅ FIXED: Changed 'modern404' to 'Modern404' (uppercase)
const Modern404 = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const quickLinks = [
    { name: 'Home', href: '/', icon: FiHome, description: 'Return to homepage' },
    { name: 'Academics', href: '/pages/academics', icon: FiBook, description: 'Explore academic programs' },
    { name: 'Gallery', href: '/pages/gallery', icon: IoLibraryOutline, description: 'View school gallery' },
    { name: 'Admissions', href: '/pages/admissions', icon: IoPeopleOutline, description: 'Admission process' },
    { name: 'Events', href: '/pages/eventsandnews', icon: FiCalendar, description: 'Upcoming events' },
    { name: 'Contact', href: '/pages/contact', icon: FiMail, description: 'Get in touch' },
  ];

  const errorMessages = [
    "Looks like this page skipped class!",
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

    return () => {
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Side - 404 Display */}
            <div className="text-center lg:text-left w-full">
              {/* 404 Number */}
              <div className="relative mb-6 sm:mb-8">
                <div className="text-6xl sm:text-8xl lg:text-9xl font-bold text-gray-900 mb-4 relative break-all">
                  <span className="text-blue-600 inline-block min-w-[1ch]">4</span>
                  <span className="text-purple-600 inline-block min-w-[1ch]">0</span>
                  <span className="text-pink-600 inline-block min-w-[1ch]">4</span>
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-6 w-full">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 break-words">
                  {errorMessages[currentMessage]}
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed break-words">
                  Don't worry, even the best students get lost sometimes. 
                  Let's get you back on track to amazing educational content.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
                <Link href="/" className="w-full sm:w-auto">
                  <button className="w-full bg-blue-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <FiHome className="text-lg sm:text-xl" />
                    Back to Homepage
                  </button>
                </Link>

                <button
                  onClick={() => window.history.back()}
                  className="w-full sm:w-auto bg-gray-100 text-gray-700 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold border border-gray-300 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
                >
                  <FiArrowLeft className="text-lg sm:text-xl" />
                  Go Back
                </button>
              </div>
            </div>

            {/* Right Side - Quick Links */}
            <div className="space-y-4 sm:space-y-6 w-full">
              {/* Quick Navigation Card */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200 p-4 sm:p-6 lg:p-8 w-full">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Quick Navigation
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.name} href={link.href} className="w-full">
                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 w-full min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 w-full">
                            <div className="p-1 sm:p-2 bg-gray-100 rounded-lg flex-shrink-0">
                              <Icon className="text-gray-700 text-base sm:text-lg lg:text-xl" />
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <h4 className="text-gray-900 font-semibold text-sm sm:text-base break-words">
                                {link.name}
                              </h4>
                              <p className="text-gray-600 text-xs sm:text-sm break-words">
                                {link.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-blue-50 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-blue-200 p-4 sm:p-6 w-full">
                <h3 className="text-gray-900 font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <IoLibraryOutline className="text-blue-600 text-base sm:text-lg" />
                  While You're Here...
                </h3>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                  <div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">500+</div>
                    <div className="text-gray-600 text-xs sm:text-xs break-words">Students</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">15+</div>
                    <div className="text-gray-600 text-xs sm:text-xs break-words">Teachers</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">78%+</div>
                    <div className="text-gray-600 text-xs sm:text-xs break-words">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="text-center mt-8 sm:mt-12">
            <div className="text-gray-400 text-xs sm:text-sm break-words">
              © {new Date().getFullYear()}  Nyaribo Secondary School. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modern404;