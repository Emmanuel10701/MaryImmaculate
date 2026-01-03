'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiUser, 
  FiCalendar, 
  FiFileText, 
  FiCheckCircle,
  FiArrowRight,
  FiClock,
  FiAward,
  FiUsers,
  FiBook,
  FiHome,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiStar,
  FiHelpCircle,
  FiPlay,
  FiShare2,
  FiChevronDown,
  FiBarChart2,
  FiHeart,
  FiTarget,
  FiGlobe,
  FiBookOpen,
  FiCpu,
  FiMusic,
  FiActivity,
  FiZap,
  FiTrendingUp,
  FiEye,
  FiLayers,
  FiPlus,
  FiX,
  FiFilter,
  FiSearch,
  FiRotateCw,
  FiEdit3,
  FiTrash2,
  FiMessageCircle,
  FiAlertTriangle,
  FiSave,
  FiImage,
  FiUpload,
  FiVideo,
  FiDollarSign,
  FiFile,
  FiClipboard,
  FiCreditCard,
  FiInfo,
  FiGrid,
  FiFolder,
  FiList,
  FiSettings,
  FiPieChart,
  FiTool,
  FiSmartphone,
  FiCode,
  FiShield,
  FiTarget as FiTargetIcon,
  FiBookmark,
  FiCalendar as FiCalendarIcon,
  FiBriefcase,
  FiGlobe as FiGlobeIcon,
  FiMic,
  FiCamera,
  FiMonitor,
  FiTrendingUp as FiTrendingUpIcon,
  FiTool as FiToolIcon,
  FiPenTool,
  FiDatabase,
  FiCloud,
  FiLock,
  FiShoppingBag,
  FiDroplet,
  FiTruck,
  FiScissors,
  FiChef,
  FiMusic as FiMusicIcon
} from 'react-icons/fi';
import { 
  IoSchoolOutline,
  IoDocumentsOutline,
  IoSpeedometerOutline,
  IoPeopleOutline,
  IoLibraryOutline,
  IoStatsChartOutline,
  IoRocketOutline,
  IoBookOutline,
  IoCalculatorOutline,
  IoSparkles,
  IoAccessibilityOutline,
  IoBuildOutline,
  IoAnalyticsOutline,
  IoBulbOutline,
  IoCheckmarkCircleOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoReceiptOutline,
  IoShirtOutline,
  IoVideocamOutline,
  IoCloudDownloadOutline,
  IoEyeOutline,
  IoMedkitOutline,
  IoConstructOutline,
  IoCarOutline,
  IoRestaurantOutline,
  IoFlaskOutline,
  IoCodeSlashOutline,
  IoBusinessOutline,
  IoNewspaperOutline,
  IoLanguageOutline
} from 'react-icons/io5';
import { useRouter } from 'next/navigation';

// Modern Modal Component
const ModernModal = ({ children, open, onClose, maxWidth = '700px' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
        style={{ 
          width: '85%',
          maxWidth: maxWidth,
          maxHeight: '85vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// New: Career Department Card Component
const CareerDepartmentCard = ({ department, icon: Icon, color, subjects, careerPaths, description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/70 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header with Gradient */}
      <div className={`p-6 bg-gradient-to-r ${color} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{department}</h3>
              <p className="text-white/90 text-sm mt-1">{description}</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <FiChevronDown className={`text-xl transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Subjects Section */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiBook className="text-blue-500" />
            Subjects Offered
          </h4>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Career Paths */}
        {expanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiBriefcase className="text-green-500" />
              Career Opportunities
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {careerPaths.map((career, idx) => (
                <div key={idx} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200/50 hover:border-blue-200 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiTrendingUpIcon className="text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{career.title}</h5>
                      <p className="text-gray-600 text-sm mt-1">{career.description}</p>
                      {career.examples && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-500">Examples:</span>
                          <p className="text-gray-700 text-sm">{career.examples}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {expanded ? 'Show Less' : 'Explore Career Paths'}
            <FiChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

// New: Education System Card Component
const EducationSystemCard = ({ system, icon: Icon, color, description, features, structure, advantages }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/70 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className={`p-6 bg-gradient-to-r ${color} text-white`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{system.name}</h3>
            <p className="text-white/90 text-sm mt-1">{system.fullName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>

        {/* Structure */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiLayers className="text-purple-500" />
            Educational Structure
          </h4>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex flex-wrap gap-3">
              {structure.map((stage, idx) => (
                <div key={idx} className="flex-1 min-w-[120px]">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="font-bold text-blue-600 text-lg">{stage.years}</div>
                    <div className="text-sm font-medium text-gray-700 mt-1">{stage.name}</div>
                    <div className="text-xs text-gray-500 mt-1">Years</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${color} bg-opacity-10 mt-1`}>
                <IoCheckmarkCircleOutline className="text-green-500" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">{feature.title}</h5>
                <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Advantages */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiAward className="text-amber-500" />
            Key Advantages
          </h4>
          <div className="space-y-2">
            {advantages.map((advantage, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg">
                <FiStar className="text-amber-500 flex-shrink-0" />
                <span className="text-gray-700">{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Card Component for Admission Paths
const AdmissionPathCard = ({ path, onApply, index }) => {
  // Use local images based on path type
  const getLocalImage = (type) => {
    switch(type) {
      case 'grade7':
        return '/images/admissions/form1.jpg';
      case 'transfer':
        return '/images/admissions/transfer.jpg';
      default:
        return '/images/admissions/default.jpg';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02]">
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={getLocalImage(path.type)}
          alt={path.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${path.color} shadow-sm`}>
            {path.deadline === 'Rolling Admission' ? 'Open' : 'Limited'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-r ${path.color} bg-opacity-10`}>
            {path.icon({ className: `text-lg ${path.color.split('from-')[1].split('to-')[0].replace('-500', '-600')}` })}
          </div>
          <h3 className="font-bold text-gray-900 text-lg">{path.title}</h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {path.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {path.features.slice(0, 2).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
              <IoCheckmarkCircleOutline className="text-green-500 flex-shrink-0" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
          {path.features.length > 2 && (
            <div className="text-xs text-blue-600 font-medium">
              +{path.features.length - 2} more features
            </div>
          )}
        </div>

        {/* Deadline and Apply Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <IoCalendarOutline className="text-gray-400" />
            <span>{path.deadline}</span>
          </div>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-200 hover:shadow-md"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ feature, onLearnMore }) => {
  const FeatureIcon = feature.icon;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      {/* Icon Header */}
      <div className={`p-5 bg-gradient-to-r ${feature.color} bg-opacity-10`}>
        <div className="flex items-center justify-between">
          <div className="p-2.5 bg-white rounded-xl shadow-xs">
            <FeatureIcon className={`text-xl ${feature.color.split('from-')[1].split('to-')[0].replace('-500', '-600')}`} />
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white/90 rounded-full text-gray-700">
            {feature.badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-3">{feature.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {feature.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50/70 rounded-lg p-3 text-center">
            <div className="font-bold text-gray-900">{feature.stats.students}</div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
          <div className="bg-gray-50/70 rounded-lg p-3 text-center">
            <div className="font-bold text-gray-900">{feature.stats.success}</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {feature.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
              <IoCheckmarkCircleOutline className="text-green-500 flex-shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onLearnMore}
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-200 hover:shadow-md"
        >
          Explore Feature
        </button>
      </div>
    </div>
  );
};

// Stats Card Component
const StatCard = ({ stat }) => {
  const StatIcon = stat.icon;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">{stat.label}</p>
          <p className="text-lg font-bold text-gray-900">{stat.number}</p>
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
          <StatIcon className={`text-lg ${stat.color.split('from-')[1].split('to-')[0].replace('-500', '-600')}`} />
        </div>
      </div>
      <p className="text-xs text-gray-500">{stat.sublabel}</p>
    </div>
  );
};

// Subject Card Component
const SubjectCard = ({ subject, index }) => {
  // Map subjects to icons
  const getSubjectIcon = (subjectName) => {
    const subjectMap = {
      'Biology': FiActivity,
      'Chemistry': FiZap,
      'Physics': FiZap,
      'Mathematics': FiCpu,
      'English': FiBook,
      'Kiswahili': FiGlobe,
      'geography': FiGlobe,
      'history': FiBook,
      'Agriculture': FiActivity,
      'Business studies': FiBarChart2,
      'Home science': FiHome,
      'Computer studies': FiCpu,
      'CRE': FiHeart,
      'IRe': FiHeart,
      'HRE': FiHeart,
      'CBC': FiBookOpen
    };
    
    return subjectMap[subjectName] || FiBook;
  };
  
  const SubjectIcon = getSubjectIcon(subject);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-sm">
          <SubjectIcon className="text-white text-lg" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{subject}</h4>
        </div>
      </div>
    </div>
  );
};

// Department Card Component
const DepartmentCard = ({ department, index }) => {
  // Map departments to icons
  const getDepartmentIcon = (deptName) => {
    const deptMap = {
      'CBC': FiBookOpen,
      'humanities': FiBook,
      'Mathematics': FiCpu,
      'Physical sciences': FiZap,
      'Languages': FiGlobe,
      'Technical skills': FiActivity,
      'Computer': FiCpu
    };
    
    return deptMap[deptName] || FiBook;
  };
  
  const DepartmentIcon = getDepartmentIcon(department);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-sm">
          <DepartmentIcon className="text-white text-lg" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{department}</h4>
        </div>
      </div>
    </div>
  );
};

// Fee Structure Card
const FeeCard = ({ feeType, total, distribution, pdfPath, pdfName, icon: Icon, color, term = "Annual" }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className="text-2xl text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{feeType}</h3>
          <p className="text-gray-500 text-sm">{term} Fee Structure</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {distribution && Object.entries(distribution).map(([category, amount], idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <p className="font-medium text-gray-700 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">KSh {parseInt(amount).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Total {term} Fees</p>
          <p className="font-bold text-gray-900 text-xl">KSh {total.toLocaleString()}</p>
        </div>
        {pdfPath && (
          <a 
            href={pdfPath} 
            download={pdfName}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-200 hover:shadow-md"
          >
            <IoCloudDownloadOutline className="w-4 h-4" />
            Download PDF
          </a>
        )}
      </div>
    </div>
  );
};

// Video Tour Component
const VideoTourSection = ({ videoTour, videoType, videoThumbnail }) => {
  if (!videoTour) return null;

  if (videoType === 'youtube') {
    // Extract YouTube video ID
    const getYouTubeId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(videoTour);
    
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <IoVideocamOutline className="text-white text-xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Virtual School Tour</h3>
        </div>
        <div className="aspect-video rounded-xl overflow-hidden shadow-sm">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            title="School Virtual Tour"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (videoType === 'file' && videoTour) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <IoVideocamOutline className="text-white text-xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Virtual School Tour</h3>
        </div>
        <div className="aspect-video rounded-xl overflow-hidden shadow-sm">
          <video
            controls
            className="w-full h-full"
            poster={videoThumbnail || ''}
          >
            <source src={videoTour} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }

  return null;
};

// Vision & Mission Section
const VisionMissionSection = ({ vision, mission, motto }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Vision Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm border border-blue-200/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-500 rounded-xl shadow-sm">
            <IoEyeOutline className="text-white text-xl" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Our Vision</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {vision || "To be a leading center of academic excellence and character development, nurturing future leaders who demonstrate high academic achievement, strong ethical values, and leadership skills."}
        </p>
      </div>

      {/* Mission Card */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl shadow-sm border border-purple-200/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-purple-500 rounded-xl shadow-sm">
            <FiTarget className="text-white text-xl" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Our Mission</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {mission || "To provide quality and relevant education through effective teaching, continuous assessment, and strong mentorship. We foster discipline, teamwork, innovation, and self-reliance while promoting integrity and respect for others."}
        </p>
      </div>

      {/* Motto Card */}
      {motto && (
        <div className="md:col-span-2 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl shadow-sm border border-emerald-200/60 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-500 rounded-xl mb-4 shadow-sm">
              <FiAward className="text-white text-2xl" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">School Motto</h3>
            <p className="text-gray-700 text-xl font-semibold italic">"{motto}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Uniform Requirements Card
const UniformRequirementsSection = ({ admissionFeeDistribution, admissionFeePdf, admissionFeePdfName }) => {
  const uniformItems = admissionFeeDistribution || {};

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Admission Uniform Requirements</h3>
          <p className="text-gray-600 text-sm mt-1">All items required for admission</p>
        </div>
        {admissionFeePdf && (
          <a 
            href={admissionFeePdf}
            download={admissionFeePdfName}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-200 hover:shadow-md"
          >
            <IoCloudDownloadOutline className="w-4 h-4" />
            Download Uniform List
          </a>
        )}
      </div>

      {Object.keys(uniformItems).length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(uniformItems).map(([item, cost], index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg hover:bg-gray-100/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-xs">
                  <IoCheckmarkCircleOutline className="text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 capitalize">{item.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">KSh {parseInt(cost).toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FiAlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Uniform requirements will be provided upon admission</p>
        </div>
      )}
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ faq, index, openFaq, setOpenFaq }) => {
  const isOpen = openFaq === index;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/70 overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setOpenFaq(isOpen ? null : index)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
      >
        <h3 className="font-semibold text-gray-900 pr-4 text-sm md:text-base">{faq.question}</h3>
        <FiChevronDown 
          className={`text-blue-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

// Application Form Modal
const ApplicationFormModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    currentGrade: '',
    admissionPath: '',
    preferredStartDate: new Date().toISOString().split('T')[0],
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Application submitted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!open) return null;

  return (
    <ModernModal open={true} onClose={onClose}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <IoRocketOutline className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Start Your Application</h2>
              <p className="text-blue-100 opacity-90 text-sm">
                Join our school community
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[calc(85vh-150px)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                required
                value={formData.studentName}
                onChange={(e) => updateField('studentName', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-sm"
                placeholder="Enter student full name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Parent/Guardian Name *
              </label>
              <input
                type="text"
                required
                value={formData.parentName}
                onChange={(e) => updateField('parentName', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-sm"
                placeholder="Enter parent/guardian name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-sm"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-sm"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Current Grade *
              </label>
              <select
                required
                value={formData.currentGrade}
                onChange={(e) => updateField('currentGrade', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-sm cursor-pointer"
              >
                <option value="">Select current grade</option>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
                <option value="Transfer">Transfer Student</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Admission Path *
              </label>
              <select
                required
                value={formData.admissionPath}
                onChange={(e) => updateField('admissionPath', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-sm cursor-pointer"
              >
                <option value="">Select admission path</option>
                <option value="Form 1 Entry">Form 1 Entry</option>
                <option value="Transfer Students">Transfer Students</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Preferred Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.preferredStartDate}
                onChange={(e) => updateField('preferredStartDate', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => updateField('message', e.target.value)}
              rows="3"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 text-sm resize-none"
              placeholder="Any additional information or questions..."
            />
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 hover:bg-gray-50"
          >
            <span className="text-sm">Cancel</span>
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-md"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span className="text-sm">Submit Application</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModernModal>
  );
};

export default function ComprehensiveAdmissions() {
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState(null);

  const router = useRouter();

  // Data for Career Departments
  const careerDepartments = [
    {
      department: 'SCIENCES',
      icon: IoFlaskOutline,
      color: 'from-blue-600 to-cyan-500',
      description: 'Explore the world through scientific inquiry and discovery',
      subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'Agriculture'],
      careerPaths: [
        {
          title: 'Medical & Health Sciences',
          description: 'Pursue careers in healthcare and medical research',
          examples: 'Doctors, Nurses, Pharmacists, Medical Researchers, Dentists'
        },
        {
          title: 'Engineering & Technology',
          description: 'Design and build innovative solutions for the future',
          examples: 'Civil Engineers, Electrical Engineers, Mechanical Engineers, Architects'
        },
        {
          title: 'Environmental Sciences',
          description: 'Protect and preserve our natural environment',
          examples: 'Environmental Scientists, Conservationists, Wildlife Biologists'
        },
        {
          title: 'Research & Development',
          description: 'Advance scientific knowledge through research',
          examples: 'Research Scientists, Laboratory Technicians, Biotechnologists'
        }
      ]
    },
    {
      department: 'MATHEMATICS',
      icon: IoCalculatorOutline,
      color: 'from-purple-600 to-pink-500',
      description: 'Master logical thinking and problem-solving skills',
      subjects: ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Business Mathematics'],
      careerPaths: [
        {
          title: 'Finance & Banking',
          description: 'Excel in financial analysis and economic planning',
          examples: 'Accountants, Financial Analysts, Bankers, Actuaries'
        },
        {
          title: 'Data Science & Analytics',
          description: 'Transform data into valuable insights',
          examples: 'Data Scientists, Statisticians, Market Researchers'
        },
        {
          title: 'Engineering & Architecture',
          description: 'Apply mathematical principles to design and construction',
          examples: 'Structural Engineers, Architects, Quantity Surveyors'
        },
        {
          title: 'Education & Research',
          description: 'Share mathematical knowledge and conduct research',
          examples: 'Mathematics Teachers, University Lecturers, Researchers'
        }
      ]
    },
    {
      department: 'LANGUAGES',
      icon: IoLanguageOutline,
      color: 'from-green-600 to-emerald-500',
      description: 'Develop communication skills and cultural understanding',
      subjects: ['English', 'Kiswahili', 'French', 'German', 'Chinese'],
      careerPaths: [
        {
          title: 'Communication & Media',
          description: 'Excel in writing, broadcasting, and media production',
          examples: 'Journalists, Editors, Translators, Content Writers'
        },
        {
          title: 'International Relations',
          description: 'Bridge cultural gaps in global contexts',
          examples: 'Diplomats, UN Officers, International Business Consultants'
        },
        {
          title: 'Education & Publishing',
          description: 'Teach languages and contribute to literary works',
          examples: 'Language Teachers, Publishers, Literary Critics'
        },
        {
          title: 'Tourism & Hospitality',
          description: 'Connect with people from around the world',
          examples: 'Tour Guides, Hotel Managers, Flight Attendants'
        }
      ]
    },
    {
      department: 'HUMANITIES',
      icon: IoNewspaperOutline,
      color: 'from-amber-600 to-orange-500',
      description: 'Understand human society, culture, and behavior',
      subjects: ['History', 'Geography', 'CRE/IRE/HRE', 'Life Skills', 'Government'],
      careerPaths: [
        {
          title: 'Law & Governance',
          description: 'Shape legal systems and public policy',
          examples: 'Lawyers, Judges, Policy Analysts, Human Rights Officers'
        },
        {
          title: 'Social Services',
          description: 'Support communities and individuals in need',
          examples: 'Social Workers, Counselors, Community Developers'
        },
        {
          title: 'Cultural Heritage',
          description: 'Preserve and promote cultural identity',
          examples: 'Museum Curators, Historians, Cultural Officers'
        },
        {
          title: 'Urban Planning',
          description: 'Design sustainable communities and cities',
          examples: 'Urban Planners, Environmental Consultants'
        }
      ]
    },
    {
      department: 'TECHNICAL & VOCATIONAL',
      icon: IoConstructOutline,
      color: 'from-red-600 to-rose-500',
      description: 'Develop practical skills for immediate employment',
      subjects: ['Computer Studies', 'Business Studies', 'Home Science', 'Agriculture', 'Art & Design'],
      careerPaths: [
        {
          title: 'Information Technology',
          description: 'Drive digital transformation and innovation',
          examples: 'Software Developers, Network Administrators, Cybersecurity Experts'
        },
        {
          title: 'Business & Entrepreneurship',
          description: 'Start and manage successful enterprises',
          examples: 'Business Owners, Marketing Managers, Financial Analysts'
        },
        {
          title: 'Hospitality & Home Economics',
          description: 'Excel in food, nutrition, and hospitality services',
          examples: 'Chefs, Nutritionists, Hotel Managers, Fashion Designers'
        },
        {
          title: 'Creative Arts & Design',
          description: 'Express creativity through various media',
          examples: 'Graphic Designers, Artists, Multimedia Specialists'
        }
      ]
    }
  ];

  // Data for Education Systems
  const educationSystems = [
    {
      system: {
        name: '8-4-4 SYSTEM',
        fullName: '8 Years Primary, 4 Years Secondary, 4 Years University'
      },
      icon: IoSchoolOutline,
      color: 'from-indigo-600 to-purple-500',
      description: 'The 8-4-4 system focuses on providing students with practical skills alongside academic knowledge. It emphasizes technical subjects and prepares students for both higher education and immediate employment opportunities.',
      structure: [
        { years: '8', name: 'Primary' },
        { years: '4', name: 'Secondary' },
        { years: '4', name: 'University' }
      ],
      features: [
        {
          title: 'Technical Emphasis',
          description: 'Strong focus on technical and vocational subjects'
        },
        {
          title: 'National Exams',
          description: 'KCPE at primary level and KCSE at secondary level'
        },
        {
          title: 'University Pathway',
          description: 'Direct progression to university education'
        },
        {
          title: 'Practical Skills',
          description: 'Emphasis on hands-on learning and real-world application'
        }
      ],
      advantages: [
        'Proven track record with decades of implementation',
        'Clear progression path to higher education',
        'Strong emphasis on technical and practical skills',
        'Nationally recognized certification (KCSE)',
        'Well-established university entry system'
      ]
    },
    {
      system: {
        name: 'CBC',
        fullName: 'Competency Based Curriculum'
      },
      icon: FiBookOpen,
      color: 'from-teal-600 to-green-500',
      description: 'The CBC system focuses on developing seven core competencies: communication, collaboration, critical thinking, creativity, citizenship, digital literacy, and learning to learn. It emphasizes practical skills and values over rote memorization.',
      structure: [
        { years: '2', name: 'Pre-Primary' },
        { years: '6', name: 'Primary' },
        { years: '6', name: 'Junior & Senior School' }
      ],
      features: [
        {
          title: 'Competency Based',
          description: 'Focus on skills and competencies rather than content'
        },
        {
          title: 'Continuous Assessment',
          description: 'Regular assessment throughout the learning process'
        },
        {
          title: 'Parental Involvement',
          description: 'Strong emphasis on parent-teacher collaboration'
        },
        {
          title: 'Digital Integration',
          description: 'Incorporation of technology in learning'
        }
      ],
      advantages: [
        'Develops practical life skills',
        'Encourages creativity and innovation',
        'Personalized learning paths',
        'Strong focus on values and citizenship',
        'Better preparation for the modern workforce'
      ]
    }
  ];

  // Fetch school data from API
  useEffect(() => {
    const fetchSchoolData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/school');
        const data = await response.json();
        if (data.success) {
          setSchoolData(data.school);
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        toast.error('Failed to load school information');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, []);

  // Dynamic stats from API data
  const dynamicStats = [
    { 
      icon: IoPeopleOutline, 
      number: schoolData?.studentCount ? schoolData.studentCount.toString() : '1,200+', 
      label: 'Total Students', 
      sublabel: 'Currently Enrolled',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: FiTrendingUp, 
      number: schoolData?.admissionCapacity ? schoolData.admissionCapacity.toString() : '300', 
      label: 'Admission Capacity', 
      sublabel: 'Annual Intake',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: IoSparkles, 
      number: schoolData?.staffCount ? `${schoolData.staffCount}:1` : '20:1', 
      label: 'Student-Teacher', 
      sublabel: 'Personalized Ratio',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: FiAward, 
      number: '98%', 
      label: 'Success Rate', 
      sublabel: 'Academic Excellence',
      color: 'from-orange-500 to-red-500'
    },
  ];

  // Admission paths - Updated based on your school's focus
  const admissionPaths = [
    {
      title: 'Form 1 Entry',
      icon: FiBookOpen,
      description: 'Join our Form 1 program with comprehensive academic curriculum and extracurricular activities',
      features: ['Academic Excellence', 'Extra-curricular Activities', 'Digital Literacy', 'Talent Development'],
      deadline: schoolData?.admissionCloseDate ? new Date(schoolData.admissionCloseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'May 30, 2024',
      color: 'from-blue-500 to-cyan-500',
      type: 'grade7'
    },
    {
      title: 'Transfer Students',
      icon: FiArrowRight,
      description: 'Seamless transfer from other schools with credit recognition and orientation support',
      features: ['Credit Transfer', 'Placement Assessment', 'Records Review', 'Orientation Program'],
      deadline: 'Rolling Admission',
      color: 'from-purple-500 to-pink-500',
      type: 'transfer'
    }
  ];

  // Academic Features
  const innovativeFeatures = [
    {
      icon: IoRocketOutline,
      title: 'Academic Excellence',
      description: 'Comprehensive curriculum with focus on core subjects and practical skills development',
      features: ['Quality Teaching', 'Regular Assessments', 'Exam Preparation', 'Academic Support'],
      badge: 'Advanced',
      color: 'from-blue-500 to-cyan-500',
      stats: { students: '500+', success: '95%' }
    },
    {
      icon: IoAccessibilityOutline,
      title: 'Holistic Development',
      description: 'Focus on academic, social, emotional, and physical growth through various programs',
      features: ['Sports Programs', 'Clubs & Societies', 'Leadership Training', 'Character Building'],
      badge: 'Comprehensive',
      color: 'from-purple-500 to-pink-500',
      stats: { students: '100%', success: '98%' }
    },
    {
      icon: IoBuildOutline,
      title: 'Practical Skills',
      description: 'Emphasis on practical competencies and real-world application of knowledge',
      features: ['Laboratory Work', 'Field Trips', 'Project Work', 'Skill Development'],
      badge: 'Practical',
      color: 'from-green-500 to-emerald-500',
      stats: { students: '300+', success: '90%' }
    }
  ];

  // Updated tabs based on your academic page design
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBook },
    { id: 'academics', label: 'Academics', icon: FiBookOpen },
    { id: 'career-paths', label: 'Career Paths', icon: FiBriefcase },
    { id: 'requirements', label: 'Requirements', icon: FiFileText },
    { id: 'fees', label: 'Fee Structure', icon: IoReceiptOutline },
    { id: 'facilities', label: 'Facilities', icon: FiSettings },
    { id: 'faq', label: 'FAQ', icon: FiHelpCircle },
  ];

  // Process steps for transfer
  const transferProcess = [
    {
      step: 1,
      title: 'Application Submission',
      description: 'Submit transfer documents and academic records for evaluation',
      duration: '2-3 days',
      requirements: ['Current school report', 'Birth certificate', 'Transfer letter']
    },
    {
      step: 2,
      title: 'Assessment & Placement',
      description: 'Academic assessment for proper grade placement and subject allocation',
      duration: '1 week',
      requirements: ['Placement tests', 'Subject evaluation', 'Skill assessment']
    },
    {
      step: 3,
      title: 'Credit Evaluation',
      description: 'Review and transfer of completed coursework and competencies',
      duration: '3-5 days',
      requirements: ['Transcript analysis', 'Credit approval', 'CBC competency mapping']
    },
    {
      step: 4,
      title: 'Admission & Orientation',
      description: 'Final admission and comprehensive student orientation program',
      duration: '1 week',
      requirements: ['Parent meeting', 'Student orientation', 'Resource distribution']
    }
  ];

  // Facilities Data from your academic page
  const facilitiesData = [
    {
      icon: FiCpu,
      title: 'Computer Labs',
      description: 'Modern computer labs with high-speed internet and latest software',
      features: ['Programming', 'Digital Literacy', 'Research', 'Online Learning']
    },
    {
      icon: FiActivity,
      title: 'Science Labs',
      description: 'Fully equipped laboratories for Physics, Chemistry and Biology',
      features: ['Experiments', 'Research', 'Practical Skills', 'Innovation']
    },
    {
      icon: IoLibraryOutline,
      title: 'Library',
      description: 'Digital and physical library with extensive resources',
      features: ['E-Books', 'Study Spaces', 'Research', 'Quiet Zones']
    },
    {
      icon: FiSmartphone,
      title: 'Smart Classrooms',
      description: 'Technology-enabled classrooms for interactive learning',
      features: ['Projectors', 'Digital Boards', 'Online Resources', 'Collaboration']
    }
  ];

  // FAQ Data updated with admission-specific questions
  const faqs = [
    {
      question: 'What are the admission requirements?',
      answer: 'Admission requires completion of primary education, KCPE results, birth certificate, and medical records. Transfer students need additional documents including previous school reports and transfer letter.'
    },
    {
      question: 'What is the fee structure and payment options?',
      answer: 'We offer both day and boarding options with transparent fee structures. Fees can be paid annually, per term, or in installments. We accept bank transfers, MPesa, and cash payments at the finance office.'
    },
    {
      question: 'Are there scholarships or financial aid available?',
      answer: 'Yes, we offer merit-based scholarships for academic excellence, talent scholarships in sports and arts, and need-based financial aid. Contact our admissions office for eligibility criteria and application details.'
    },
    {
      question: 'What curriculum do you follow?',
      answer: 'We follow the national curriculum with both CBC and 8-4-4 systems. We also integrate digital literacy and practical skills development across all subjects.'
    }
  ];

  const handleApply = (path) => {
    setShowApplicationForm(true);
  };

  const handleLearnMore = (feature) => {
    toast.success(`Learn more about ${feature.title}`);
  };

  const refreshData = () => {
    setLoading(true);
    const fetchSchoolData = async () => {
      try {
        const response = await fetch('/api/school');
        const data = await response.json();
        if (data.success) {
          setSchoolData(data.school);
          toast.success('Data refreshed successfully!');
        }
      } catch (error) {
        toast.error('Failed to refresh data');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  };

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <IoSchoolOutline className="text-white text-lg w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                  Admissions Portal
                </h1>
                <p className="text-gray-600 mt-1">
                  {schoolData?.name || 'Katwanyaa High School'} - Join Our Academic Community
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <button
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-sm border border-gray-200 font-medium disabled:opacity-50 text-sm md:text-base hover:shadow-md"
            >
              <FiRotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => router.push('/pages/applyadmission')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-lg font-medium text-sm md:text-base hover:shadow-xl hover:scale-[1.02]"
            >
              <FiPlus className="w-4 h-4" />
              Apply Online
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {dynamicStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Admission Dates Banner - Prominently Displayed */}
        {schoolData && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-5 md:p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  <IoCalendarOutline className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl">Admission Period Now Open</h3>
                  <p className="text-blue-100 opacity-90 text-sm">
                    Secure your place for the upcoming academic year
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-blue-100">Application Opens</p>
                  <p className="font-bold text-lg">{formatDate(schoolData.admissionOpenDate)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-blue-100">Application Closes</p>
                  <p className="font-bold text-lg">{formatDate(schoolData.admissionCloseDate)}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/pages/applyadmission')}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Apply Now
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs - Modernized */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 overflow-hidden mb-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <TabIcon className="text-lg" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-5">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Welcome to {schoolData?.name || 'Our School'} Admissions
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                  {schoolData?.description || 'We are committed to nurturing well-rounded individuals through comprehensive education, state-of-the-art facilities, and dedicated faculty.'}
                </p>
              </div>

              {/* Vision & Mission Section */}
              <VisionMissionSection 
                vision={schoolData?.vision}
                mission={schoolData?.mission}
                motto={schoolData?.motto}
              />

              {/* Admission Paths */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Your Admission Path</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {admissionPaths.map((path, index) => (
                    <AdmissionPathCard
                      key={path.title}
                      path={path}
                      index={index}
                      onApply={() => handleApply(path)}
                    />
                  ))}
                </div>
              </div>

              {/* Video Tour Section */}
              {schoolData?.videoTour && (
                <VideoTourSection 
                  videoTour={schoolData.videoTour}
                  videoType={schoolData.videoType}
                  videoThumbnail={schoolData.videoThumbnail}
                />
              )}

              {/* Key Features Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Our School?</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: IoBulbOutline,
                      title: 'Academic Excellence',
                      description: 'Proven track record of outstanding academic performance'
                    },
                    {
                      icon: FiUsers,
                      title: 'Expert Faculty',
                      description: 'Qualified and experienced teaching staff'
                    },
                    {
                      icon: FiCpu,
                      title: 'Modern Facilities',
                      description: 'Well-equipped classrooms and laboratories'
                    },
                    {
                      icon: FiHeart,
                      title: 'Holistic Care',
                      description: 'Academic and emotional support for all students'
                    }
                  ].map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <feature.icon className="text-2xl text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Academic Programs
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Comprehensive curriculum designed for academic excellence and holistic development.
                </p>
              </div>

              {/* Education Systems Section - New */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Education Systems We Offer</h3>
                <p className="text-gray-600 mb-8 max-w-3xl">
                  We provide both the traditional 8-4-4 system and the modern CBC curriculum, 
                  allowing students to choose the path that best suits their learning style and career aspirations.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  {educationSystems.map((system, index) => (
                    <EducationSystemCard key={index} {...system} />
                  ))}
                </div>
              </div>

              {/* Subjects Offered */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Subjects Offered</h3>
                  {schoolData?.curriculumPDF && (
                    <a 
                      href={schoolData.curriculumPDF}
                      download={schoolData.curriculumPdfName}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-200 hover:shadow-md"
                    >
                      <IoCloudDownloadOutline className="w-4 h-4" />
                      Download Curriculum
                    </a>
                  )}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {schoolData?.subjects?.map((subject, index) => (
                    <SubjectCard key={index} subject={subject} index={index} />
                  ))}
                </div>
              </div>

              {/* Departments */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Academic Departments</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {schoolData?.departments?.map((department, index) => (
                    <DepartmentCard key={index} department={department} index={index} />
                  ))}
                </div>
              </div>

              {/* Academic Features */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Academic Features</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {innovativeFeatures.map((feature, index) => (
                    <FeatureCard
                      key={feature.title}
                      feature={feature}
                      onLearnMore={() => handleLearnMore(feature)}
                    />
                  ))}
                </div>
              </div>

              {/* Academic Calendar */}
              {schoolData?.openDate && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Calendar</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-gray-200/70">
                      <div className="flex items-center gap-3 mb-2">
                        <FiCalendarIcon className="text-green-500" />
                        <h4 className="font-semibold text-gray-900">Academic Year Opens</h4>
                      </div>
                      <p className="text-gray-700">{formatDate(schoolData.openDate)}</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-gray-200/70">
                      <div className="flex items-center gap-3 mb-2">
                        <FiCalendarIcon className="text-red-500" />
                        <h4 className="font-semibold text-gray-900">Academic Year Closes</h4>
                      </div>
                      <p className="text-gray-700">{formatDate(schoolData.closeDate)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Career Paths Tab - New */}
          {activeTab === 'career-paths' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Career Pathways
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Explore diverse career opportunities across different academic departments. 
                  Our curriculum is designed to prepare students for success in various fields.
                </p>
              </div>

              {/* Career Guidance Banner */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Career Guidance Program</h3>
                    <p className="text-blue-100">
                      We provide comprehensive career counseling, university placement guidance, 
                      and internship opportunities to help students make informed career choices.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 shadow-md">
                      Book Career Session
                    </button>
                  </div>
                </div>
              </div>

              {/* Career Departments */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Academic Departments & Career Paths</h3>
                <div className="space-y-6">
                  {careerDepartments.map((dept, index) => (
                    <CareerDepartmentCard key={index} {...dept} />
                  ))}
                </div>
              </div>

              {/* University Partnerships */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">University Pathways</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Local Universities</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>University of Nairobi</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>Kenyatta University</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>Moi University</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>Technical University of Kenya</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">International Opportunities</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-blue-500" />
                        <span>Scholarship programs abroad</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-blue-500" />
                        <span>Student exchange programs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-blue-500" />
                        <span>International university partnerships</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-blue-500" />
                        <span>Online degree programs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Admission Requirements
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Complete information about what you need for successful admission.
                </p>
              </div>

              {/* Uniform Requirements */}
              <UniformRequirementsSection 
                admissionFeeDistribution={schoolData?.admissionFeeDistribution}
                admissionFeePdf={schoolData?.admissionFeePdf}
                admissionFeePdfName={schoolData?.admissionFeePdfName}
              />

              {/* Required Documents */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Required Documents</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {schoolData?.admissionDocumentsRequired?.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/70 rounded-lg hover:bg-gray-100/70 transition-colors">
                      <div className="p-2 bg-white rounded-lg shadow-xs">
                        <IoDocumentTextOutline className="text-blue-500" />
                      </div>
                      <span className="font-medium text-gray-800">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transfer Process */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Transfer Student Process</h3>
                <div className="space-y-6">
                  {transferProcess.map((step, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-6 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                            <div className="flex items-center gap-2 text-blue-600">
                              <FiClock className="text-lg" />
                              <span className="font-medium text-sm">{step.duration}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{step.description}</p>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Requirements:</p>
                            {step.requirements.map((req, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                <IoCheckmarkCircleOutline className="text-green-500 flex-shrink-0" />
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fee Structure Tab */}
          {activeTab === 'fees' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Transparent Fee Structure
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  We believe in providing quality education at an affordable cost with flexible payment options.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <FeeCard
                  feeType="Boarding School"
                  total={schoolData?.feesBoarding || 58700}
                  distribution={schoolData?.feesBoardingDistribution}
                  pdfPath={schoolData?.feesBoardingDistributionPdf}
                  pdfName={schoolData?.feesBoardingPdfName}
                  icon={IoBookOutline}
                  color="bg-blue-50"
                />
                <FeeCard
                  feeType="Day School"
                  total={schoolData?.feesDay || 30200}
                  distribution={schoolData?.feesDayDistribution}
                  pdfPath={schoolData?.feesDayDistributionPdf}
                  pdfName={schoolData?.feesDayPdfName}
                  icon={FiHome}
                  color="bg-green-50"
                />
              </div>

              {/* Admission Fee */}
              {schoolData?.admissionFee && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
                  <div className="flex items-start gap-4">
                    <IoReceiptOutline className="text-2xl text-amber-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">Admission Fee</h3>
                          <p className="text-gray-600">One-time payment upon admission</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">KSh {schoolData.admissionFee.toLocaleString()}</p>
                        </div>
                      </div>
                      {schoolData.admissionFeePdf && (
                        <a 
                          href={schoolData.admissionFeePdf}
                          download={schoolData.admissionFeePdfName}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-all duration-200 hover:shadow-md"
                        >
                          <IoCloudDownloadOutline className="w-4 h-4" />
                          Download Admission Fee Details
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Payment Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Payment Options:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>Bank Transfer</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>MPesa Paybill</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>Cash at School Finance Office</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Payment Terms:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>Annual fees payable in 3 installments</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>Discount for full annual payment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-green-500" />
                        <span>Sibling discount available</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === 'facilities' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Academic Facilities
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  State-of-the-art facilities designed to enhance learning and provide practical experiences.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {facilitiesData.map((facility, index) => (
                  <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm">
                        <facility.icon className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{facility.title}</h3>
                        <p className="text-gray-600 text-sm">{facility.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="font-medium text-gray-700 text-sm">Features:</p>
                      {facility.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                          <IoCheckmarkCircleOutline className="text-green-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Facilities */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Additional Learning Resources</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Study Resources:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-amber-500" />
                        <span>Online learning platform</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-amber-500" />
                        <span>Digital textbooks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-amber-500" />
                        <span>Research databases</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-amber-500" />
                        <span>Past papers library</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Support Facilities:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-amber-500" />
                        <span>Counseling rooms</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-amber-500" />
                        <span>Career guidance center</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-amber-500" />
                        <span>Group study rooms</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IoCheckmarkCircleOutline className="text-amber-500" />
                        <span>Audio-visual rooms</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Find answers to common questions about admissions, curriculum, fees, and more.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    faq={faq}
                    index={index}
                    openFaq={openFaq}
                    setOpenFaq={setOpenFaq}
                  />
                ))}
              </div>

              {/* Contact Support - No Email Displayed */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Still have questions?</h3>
                    <p className="text-gray-600">Our admissions team is here to help you.</p>
                  </div>
                  <div className="flex gap-4">
                    <a 
                      href={`tel:${schoolData?.admissionContactPhone || '+254793472960'}`}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    >
                      <FiPhone />
                      Call Admissions
                    </a>
                    <button 
                      onClick={() => router.push('/pages/applyadmission')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                    >
                      <FiMessageCircle />
                      Apply Online
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join our community dedicated to nurturing future leaders through quality education, 
            personalized attention, and a commitment to holistic development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/pages/applyadmission')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Apply Online Now
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-200">
              Download Prospectus
            </button>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      <ApplicationFormModal
        open={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        onSuccess={() => {
          router.push('/pages/applyadmission');
        }}
      />
    </div>
  );
}