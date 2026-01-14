'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiHome, FiFileText, FiDollarSign, FiBook, FiRefreshCw, 
  FiUsers, FiActivity, FiHelpCircle, FiX, FiTrash2, FiMessageCircle,
  FiMapPin, FiPhone, FiMail, FiCalendar, FiAward, FiStar,
  FiGrid, FiBriefcase, FiUser, FiInfo, FiImage, FiLogIn
} from 'react-icons/fi';
import { MdMessage, MdSchool } from 'react-icons/md';

const iconMap = {
  'home': FiHome, 'file': FiFileText, 'dollar': FiDollarSign, 'book': FiBook,
  'refresh': FiRefreshCw, 'users': FiUsers, 'activity': FiActivity, 
  'help': FiHelpCircle, 'close': FiX, 'trash': FiTrash2, 'message': FiMessageCircle,
  'school': MdSchool, 'colored-message': MdMessage, 'map': FiMapPin,
  'phone': FiPhone, 'mail': FiMail, 'calendar': FiCalendar, 'award': FiAward,
  'star': FiStar, 'grid': FiGrid, 'briefcase': FiBriefcase, 'user': FiUser,
  'info': FiInfo, 'image': FiImage, 'login': FiLogIn
};

const SafeIcon = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || FiHelpCircle;
  return <IconComponent {...props} />;
};

// Student Portal content for Facilities section
const studentPortalContent = `🎓 STUDENT PORTAL

Our comprehensive Student Portal provides a centralized platform for:

**Academic Management:**
• Track academic progress and grades
• Access assignment submissions and feedback
• View exam schedules and timetables
• Monitor attendance records

**Learning Resources:**
• Digital library access
• Download course materials
• Access past papers and revision resources
• E-learning platform integration

**Fees Management:**
• View real-time fee statements
• Make secure online payments
• Download payment receipts
• Track payment history

**Academic Announcements:**
• Real-time school notifications
• Assignment deadlines
• Exam date updates
• Event announcements

**Student Resources:**
• Career guidance materials
• Scholarship opportunities
• Club and activity information
• Counseling session bookings

**Guidance & Counselling:**
• Schedule counseling appointments
• Access mental health resources
• Career guidance sessions
• Personal development tools

**24/7 Access:** Available anytime, anywhere for all registered students`;

// Static categories as fallback
const staticCategories = {
  general: {
    name: "Overview",
    icon: 'school',
    content: `🏫 NYARIBU SECONDARY SCHOOL

**A Public Day School**

Quick Facts:
• Established: 1985
• Location: Kiganjo, Nyeri
• Students: 400+
• Staff: 30+

School Type:
• Public Day School
• Mixed (Boys & Girls)
• 8-4-4 Curriculum

Contact:
• Phone: +254 720 123 456
• Email: info@nyaribusecondary.sc.ke
• Address: P.O. Box 123-10100

Hours:
• Mon-Fri: 7:30 AM - 5:00 PM
• Sat: 8:00 AM - 1:00 PM

Learn more by selecting other categories!`,
    links: [
      { label: 'About', path: '/pages/AboutUs', icon: 'info' },
      { label: 'Overview', path: '/pages/overview', icon: 'grid' }
    ]
  },
  admissions: {
    name: "Admissions",
    icon: 'file',
    content: `📋 ADMISSIONS

Requirements:
• KCPE: 250+ Marks
• Age: 13-16 years
• Good conduct

Documents:
1. KCPE certificate
2. Birth certificate
3. School reports
4. Passport photos
5. Medical report

Steps:
1. Get form
2. Submit docs
3. Assessment
4. Interview
5. Admission

Transfer Students:
• Forms 2 & 3
• Good record
• Limited spaces`,
    links: [
      { label: 'Admissions', path: '/pages/admissions', icon: 'file' },
      { label: 'Apply Now', path: '/pages/applyadmission', icon: 'user' }
    ]
  },
  fees: {
    name: "Fees",
    icon: 'dollar',
    content: `💰 FEES 2024

Day School Fees (Term):
• Tuition: KES 12,000
• Activities: KES 2,000
• Total: KES 14,000

Optional:
• Lunch: KES 4,500
• Transport: Varies

Payment:
• Bank Transfer
• M-Pesa: 123456
• Cash
• Installment plans

Scholarships:
• Academic
• Sports
• Needy

Affordable quality education!`,
    links: [
      { label: 'Student Portal', path: '/pages/StudentPortal', icon: 'book' }
    ]
  },
  academics: {
    name: "Academics",
    icon: 'book',
    content: `📚 ACADEMICS

Curriculum: 8-4-4 System

Form 1 & 2 (Core):
• English • Kiswahili
• Mathematics • Sciences
• Humanities • Business
• Computer Studies
• Life Skills

Streams (Form 3/4):
1. Sciences
2. Humanities
3. Business

Features:
• Computer Lab
• Science Labs
• Library
• Career Guidance
• Remedial Classes

Exams:
• CATs • Term
• Mock • KCSE

Quality education for all!`,
    links: [
      { label: 'Academics', path: '/pages/academics', icon: 'book' },
      { label: 'Guidance & Counselling', path: '/pages/Guidance-and-Councelling', icon: 'users' }
    ]
  },
  facilities: {
    name: "Facilities",
    icon: 'users',
    content: studentPortalContent,
    links: [
      { label: 'Gallery', path: '/pages/gallery', icon: 'image' },
      { label: 'Student Portal', path: '/pages/StudentPortal', icon: 'grid' }
    ]
  },
  activities: {
    name: "Activities",
    icon: 'activity',
    content: `⚽ ACTIVITIES

Sports:
• Football
• Basketball
• Volleyball
• Athletics
• Table Tennis

Clubs:
1. Science Club
2. Drama Club
3. Music Club
4. Environmental Club
5. Debate Club

Competitions:
• Music Festivals
• Sports Days
• Science Fairs
• Academic Contests

Leadership:
• Student Council
• Class Prefects
• Club Leaders
• Peer Counselors`,
    links: [
      { label: 'News & Events', path: '/pages/eventsandnews', icon: 'calendar' },
      { label: 'Sports', path: '/pages/sports', icon: 'activity' }
    ]
  },
  achievements: {
    name: "Achievements",
    icon: 'award',
    content: `🏆 ACHIEVEMENTS

Academic:
• 2023 KCSE: B-
• 85% University placement
• Consistent improvement
• Subject awards

Sports:
• County champions (Football)
• Regional athletics medals
• Basketball trophies
• Sportsmanship awards

Talent:
• Music festival winners
• Drama competition finalists
• Art exhibition participants

Community:
• Cleanest school award
• Environmental champions
• Community service awards`,
    links: [
      { label: 'News & Events', path: '/pages/eventsandnews', icon: 'calendar' },
      { label: 'Results', path: '/results', icon: 'award' }
    ]
  },
  contact: {
    name: "Contact",
    icon: 'phone',
    content: `📞 CONTACT US

Administration:
• Principal: Mr. Mwangi
• Deputy Principal (Academics)
• Deputy Principal (Administration)
• Bursar: Mrs. Njeri

Contacts:
• Phone: +254 720 123 456
• Email: info@nyaribusecondary.sc.ke
• Admissions: admissions@nyaribusecondary.sc.ke

Address:
Nyaribu Secondary School
Kiganjo, Nyeri County
P.O. Box 123-10100

Office Hours:
• Monday-Friday: 8:00 AM - 5:00 PM
• Saturday: 8:00 AM - 1:00 PM`,
    links: [
      { label: 'Contact', path: '/pages/contact', icon: 'phone' },
      { label: 'Staff Directory', path: '/pages/staff', icon: 'users' },
      { label: 'Careers', path: '/pages/career', icon: 'briefcase' },
      { label: 'Admin Login', path: '/pages/adminLogin', icon: 'login' }
    ]
  }
};

// Helper function to format dynamic content
const buildDynamicCategories = (schoolData) => {
  if (!schoolData) return staticCategories;

  return {
    general: {
      name: "Overview",
      icon: 'school',
      content: `🏫 ${schoolData.name}

**Motto:** ${schoolData.motto}

**Vision:**
${schoolData.vision}

**Mission:**
${schoolData.mission}

**About Our School:**
${schoolData.description}

Quick Facts:
• Students: ${schoolData.studentCount}
• Staff: ${schoolData.staffCount}
• Academic Term: ${new Date(schoolData.openDate).toLocaleDateString()} - ${new Date(schoolData.closeDate).toLocaleDateString()}

**School Philosophy:**
We provide a supportive learning environment that promotes intellectual growth, moral values, and holistic development through qualified staff and modern facilities.`,
      links: staticCategories.general.links
    },
    admissions: {
      name: "Admissions",
      icon: 'file',
      content: `📋 ADMISSIONS INFORMATION

**Admission Period:**
• Opens: ${new Date(schoolData.admissionOpenDate).toLocaleDateString()}
• Closes: ${new Date(schoolData.admissionCloseDate).toLocaleDateString()}

**Admission Fee:** KES ${schoolData.admissionFee.toLocaleString()}
**Admission Capacity:** ${schoolData.admissionCapacity} students

**Fee Distribution:**
${Object.entries(schoolData.admissionFeeDistribution || {}).map(([key, value]) => `• ${key}: KES ${value.toLocaleString()}`).join('\n')}

**Contact Admissions:**
• Email: ${schoolData.admissionContactEmail}
• Phone: ${schoolData.admissionContactPhone}
• Location: ${schoolData.admissionLocation}
• Office Hours: ${schoolData.admissionOfficeHours}

**Requirements:**
${schoolData.admissionRequirements || 'Please contact admissions office for specific requirements'}

**Apply through our website for seamless admission processing.`,
      links: staticCategories.admissions.links
    },
    fees: {
      name: "Fees",
      icon: 'dollar',
      content: `💰 FEE STRUCTURE

**Day School Fees (Per Term):** KES ${schoolData.feesDay.toLocaleString()}

**Day Fee Distribution:**
${Object.entries(schoolData.feesDayDistribution || {}).map(([key, value]) => `• ${key}: KES ${value.toLocaleString()}`).join('\n')}

**Boarding School Fees (Per Term):** KES ${schoolData.feesBoarding.toLocaleString()}

**Boarding Fee Distribution:**
${Object.entries(schoolData.feesBoardingDistribution || {}).map(([key, value]) => `• ${key}: KES ${value.toLocaleString()}`).join('\n')}

**Payment Information:**
• Detailed fee structure available for download
• Multiple payment options available
• Contact bursar for payment plans

**Note:** All fees are subject to review as per school policies.`,
      links: staticCategories.fees.links
    },
    academics: {
      name: "Academics",
      icon: 'book',
      content: `📚 ACADEMIC PROGRAM

**Subjects Offered:**
${schoolData.subjects.map(subject => `• ${subject}`).join('\n')}

**Academic Departments:**
${schoolData.departments.map(dept => `• ${dept}`).join('\n')}

**Curriculum:**
• Comprehensive 8-4-4 curriculum
• Download curriculum details: ${schoolData.curriculumPdfName}

**Examination Results:**
• KCSE ${schoolData.examResults?.kcse?.year} results available
• Download performance reports
• Continuous assessment and monitoring

**Academic Support:**
• Regular assessments and evaluations
• Remedial classes
• Career guidance programs`,
      links: staticCategories.academics.links
    },
    facilities: {
      name: "Facilities",
      icon: 'users',
      content: studentPortalContent,
      links: staticCategories.facilities.links
    },
    activities: staticCategories.activities,
    achievements: {
      name: "Achievements",
      icon: 'award',
      content: `🏆 SCHOOL ACHIEVEMENTS

**Academic Excellence:**
• KCSE ${schoolData.examResults?.kcse?.year} results documented
• Consistent academic improvement
• Subject specialization achievements

**Examination Results:**
• Download KCSE results: ${schoolData.examResults?.kcse?.name}
• Additional performance reports available

**Student Success:**
• Holistic development focus
• Talent nurturing programs
• Leadership development initiatives

**Quality Assurance:**
• Regular academic reviews
• Performance tracking systems
• Continuous improvement programs`,
      links: staticCategories.achievements.links
    },
    contact: {
      name: "Contact",
      icon: 'phone',
      content: `📞 CONTACT INFORMATION

**School Contacts:**
• Phone: ${schoolData.admissionContactPhone}
• Email: ${schoolData.admissionContactEmail}
• Location: ${schoolData.admissionLocation}
• Website: ${schoolData.admissionWebsite}

**Office Hours:**
${schoolData.admissionOfficeHours}

**Administration:**
• Comprehensive administrative support
• Dedicated staff team
• Efficient communication channels

**Visit Us:**
We welcome parents and guardians for consultations during office hours.`,
      links: staticCategories.contact.links
    }
  };
};

// Format message content
const formatMessage = (content) => {
  return content
    .split('\n')
    .map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-bold text-sm text-white mb-1 mt-2 first:mt-0">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      else if (line.endsWith(':') && !line.startsWith('•') && !line.startsWith('*')) {
        return (
          <div key={index} className="font-semibold text-blue-300 mt-2 mb-1 text-xs">
            {line}
          </div>
        );
      }
      else if (line.startsWith('•')) {
        return (
          <div key={index} className="flex items-start ml-1 mb-0.5">
            <span className="text-blue-300 mr-1 text-xs">•</span>
            <span className="text-gray-100 text-xs">{line.substring(1).trim()}</span>
          </div>
        );
      }
      else if (/^\d+\./.test(line)) {
        return (
          <div key={index} className="flex items-start ml-1 mb-0.5">
            <span className="text-green-300 mr-1 text-xs font-semibold">
              {line.match(/^\d+/)[0]}.
            </span>
            <span className="text-gray-100 text-xs">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      else if (line.startsWith('*') && line.endsWith('*')) {
        return (
          <div key={index} className="text-gray-300 italic text-xs mt-1">
            {line.replace(/\*/g, '')}
          </div>
        );
      }
      else if (line.trim()) {
        return (
          <div key={index} className="text-gray-100 text-xs mb-1">
            {line}
          </div>
        );
      }
      else {
        return <div key={index} className="h-2" />;
      }
    });
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const router = useRouter();

  // Fetch school data from API
  useEffect(() => {
    const fetchSchoolData = async () => {
      // Only fetch once and if not already fetched
      if (hasFetchedData || isFetchingData) return;
      
      setIsFetchingData(true);
      try {
        const response = await fetch('/api/school');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.school) {
            setSchoolData(data.school);
          }
        }
      } catch (error) {
        console.error('Failed to fetch school data:', error);
        // Silently fall back to static content - no UI disruption
      } finally {
        setHasFetchedData(true);
        setIsFetchingData(false);
      }
    };

    fetchSchoolData();
  }, [hasFetchedData, isFetchingData]);

  // Get categories based on data availability
  const getCategories = () => {
    if (schoolData) {
      return buildDynamicCategories(schoolData);
    }
    return staticCategories;
  };

  const categories = getCategories();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    const handleResize = () => {
      checkMobile();
      if (chatContainerRef.current) {
        const chatRect = chatContainerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (chatRect.right > viewportWidth - 10) {
          chatContainerRef.current.style.right = '10px';
        }
        if (chatRect.bottom > viewportHeight - 10) {
          chatContainerRef.current.style.bottom = '10px';
        }
      }
    };

    checkMobile();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const chatData = localStorage.getItem('nyaribu_chat');
    if (chatData) {
      const { messages: savedMessages, timestamp } = JSON.parse(chatData);
      const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
      
      if (timestamp > fourHoursAgo) {
        setMessages(savedMessages);
      } else {
        localStorage.removeItem('nyaribu_chat');
        setMessages([getWelcomeMessage()]);
      }
    } else {
      setMessages([getWelcomeMessage()]);
    }
  }, []);

  const getWelcomeMessage = () => {
    const schoolName = schoolData?.name || 'NYARIBU SECONDARY SCHOOL';
    const motto = schoolData?.motto ? `\n\n**${schoolData.motto}** ✨` : '\n\n**SOARING FOR EXCELLENCE** ✨';
    const studentCount = schoolData?.studentCount || '400+';
    const staffCount = schoolData?.staffCount || '30+';
    
    return {
      id: 1,
      role: 'assistant',
      content: `🎓 WELCOME TO ${schoolName.toUpperCase()}!${motto}

Hello! I'm Nyari, your assistant.

About Our School:
• Public Day School (Mixed)
• Established: 1985
• Location: Kiganjo, Nyeri
• Students: ${studentCount} | Teachers: ${staffCount}
• 8-4-4 Curriculum System

${schoolData ? 'For the most current information, choose a category below! 👇' : 'Choose a category below to learn more! 👇'}`,
      links: [
        { label: 'Home', path: '/', icon: 'home' },
        { label: 'About', path: '/pages/AboutUs', icon: 'info' },
        { label: 'Contact', path: '/pages/contact', icon: 'phone' }
      ],
      timestamp: new Date().toISOString()
    };
  };

  useEffect(() => {
    if (messages.length > 0) {
      const chatData = {
        messages: messages,
        timestamp: Date.now()
      };
      localStorage.setItem('nyaribu_chat', JSON.stringify(chatData));
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const typeMessage = (message, onComplete) => {
    setIsTyping(true);
    setTypedMessage('');
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setTypedMessage(prev => prev + message[index]);
        index++;
        if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          const isAtBottom = 
            container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
          
          if (isAtBottom) {
            scrollToBottom();
          }
        }
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        onComplete();
        setTimeout(() => {
          setShowCategories(true);
          scrollToBottom();
        }, 300);
      }
    }, 15);
  };

  const handleCategoryClick = (categoryKey) => {
    const category = categories[categoryKey];
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: `Selected: ${category.name}`,
      timestamp: new Date().toISOString()
    };

    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      links: category.links,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);
    setShowCategories(false);

    typeMessage(category.content, () => {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: category.content, links: category.links }
          : msg
      ));
      setIsLoading(false);
    });
  };

  const clearChat = () => {
    localStorage.removeItem('nyaribu_chat');
    setMessages([getWelcomeMessage()]);
    setShowCategories(true);
  };

  const handleLinkClick = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div 
      ref={chatContainerRef}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
      style={{
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 32px)'
      }}
    >
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-105 active:scale-95"
          aria-label="Open chat assistant"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        >
          <SafeIcon name="colored-message" className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div 
          className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-lg shadow-xl flex flex-col border border-white/10"
          style={{
            width: isMobile ? 'calc(100vw - 32px)' : '500px',
            height: isMobile ? 'calc(100vh - 100px)' : '600px',
            maxWidth: '500px',
            maxHeight: '600px',
            overflow: 'hidden',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        >
          {/* Header with logo */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white flex-shrink-0">
                  <img 
                    src="/logo.jpg" 
                    alt="Nyaribu Secondary School Logo" 
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'auto' }}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                    {schoolData?.name || 'Nyaribu Secondary School'}
                  </h3>
                  <p className="text-blue-200 text-xs sm:text-sm truncate">
                    {schoolData?.motto || 'Soaring for Excellence'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                {isFetchingData && (
                  <div className="flex items-center mr-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                  </div>
                )}
                <button
                  onClick={clearChat}
                  className="text-white/80 hover:text-white transition p-1.5 hover:bg-white/10 rounded"
                  title="Clear chat"
                  aria-label="Clear chat"
                >
                  <SafeIcon name="trash" className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition p-1.5 hover:bg-white/10 rounded"
                  aria-label="Close chat"
                >
                  <SafeIcon name="close" className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-slate-800/50"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            <style jsx>{`
              .flex-1::-webkit-scrollbar {
                width: 6px;
              }
              .flex-1::-webkit-scrollbar-track {
                background: transparent;
              }
              .flex-1::-webkit-scrollbar-thumb {
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
              }
              @media (max-width: 640px) {
                .flex-1::-webkit-scrollbar {
                  width: 4px;
                }
              }
            `}</style>
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[95%] w-full rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                      : 'bg-slate-700/80 text-white rounded-bl-none'
                  }`}
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  {message.role === 'assistant' && isTyping && message.id === messages[messages.length - 1]?.id ? (
                    <div className="text-xs sm:text-sm leading-relaxed text-white w-full">
                      {formatMessage(typedMessage)}
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm leading-relaxed text-white w-full">
                      {formatMessage(message.content)}
                    </div>
                  )}
                  
                  {/* Links Section */}
                  {message.links && message.role === 'assistant' && !isTyping && (
                    <div className="mt-2 sm:mt-3 pt-2 border-t border-white/20 w-full">
                      <p className="text-xs text-blue-300 mb-2 font-medium flex items-center gap-1">
                        <SafeIcon name="star" className="w-3 h-3 flex-shrink-0" />
                        Quick Links:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.links.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => handleLinkClick(link.path)}
                            className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2 py-1.5 rounded transition-all font-medium whitespace-nowrap flex-shrink-0"
                          >
                            {link.icon && <SafeIcon name={link.icon} className="w-3 h-3" />}
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 sm:mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/80 text-white rounded-lg rounded-bl-none px-3 py-2 sm:px-4 sm:py-3 max-w-[95%]">
                  <div className="flex space-x-2 items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-300">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </div>

          {/* Categories Section */}
          {showCategories && (
            <div className="border-t border-white/10 bg-slate-700/80 p-3 sm:p-4 flex-shrink-0">
              <div className="w-full">
                <p className="text-xs text-blue-300 font-medium mb-2 flex items-center gap-1">
                  <SafeIcon name="help" className="w-3 h-3 flex-shrink-0" />
                  What would you like to know?
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full">
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => handleCategoryClick(key)}
                      className="flex flex-col items-center justify-center space-y-1 px-2 py-2 sm:px-2 sm:py-3 rounded text-xs font-medium transition-all text-gray-300 hover:bg-slate-600/80 hover:text-white border border-white/10 w-full min-h-[60px] sm:min-h-[70px]"
                      aria-label={`Learn about ${category.name}`}
                      style={{
                        transform: 'translateZ(0)',
                        willChange: 'transform'
                      }}
                    >
                      <SafeIcon name={category.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate w-full text-center text-[11px] sm:text-xs">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}