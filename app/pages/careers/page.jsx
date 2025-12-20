'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

// Import icons from react-icons/fa
import { 
  FaBriefcase, FaFilter, FaCalendar, FaUsers,
  FaGraduationCap, FaBuilding, FaClock, FaArrowUpRightFromSquare,
  FaEnvelope, FaPhone, FaArrowRight,
  FaHeart, FaRegHeart, FaDownload,
  FaPrint, FaBookmark, FaBookmark as FaRegBookmark,
  FaEye, FaEyeSlash, FaSortAmountDown, FaSortAmountUp,
  FaChevronDown, FaChevronUp,
  FaSchool, FaUserGraduate, FaUserTie, 
  FaStethoscope, FaBookOpen, FaLaptopCode, FaCalculator, 
  FaFlask, FaCircleArrowRight, FaPaperPlane, FaFileContract,
  FaHandshake, FaRocket, FaAward, FaStar,
  FaLeaf, FaHandsHolding,
  FaUniversity, FaMonument,
  FaWhatsapp,
  FaMobile,
  FaFacebook, FaTwitter, FaInstagram,
  FaLinkedin, FaChalkboardUser, FaBell, FaBullhorn,
  FaSeedling, FaTree,
  FaDroplet, FaCloud, FaSun,
  FaShareAlt, FaTools, FaFileAlt
} from 'react-icons/fa';

// Import icons from lucide-react to avoid conflicts
import { 
  X,                    // For times/close
  MessageSquare,        // For message
  Utensils,             // For utensils
  Shield,               // For shield
  Mountain,             // For mountain
  Landmark,             // For landmark
  Globe,                // For globe/earth
  BookOpen as BookOpenIcon,  // Alternative book open
  GraduationCap as GradCapIcon, // Alternative graduation cap
  User,                 // Alternative user
  Briefcase as BriefcaseIcon // Alternative briefcase
} from 'lucide-react';

// Helper components for missing icons using lucide-react
const FaShieldAlt = () => <Shield className="w-4 h-4" />;
const FaUtensils = () => <Utensils className="w-4 h-4" />;
const FaMountainIcon = () => <Mountain className="w-6 h-6" />;
const FaLandmarkIcon = () => <Landmark className="w-4 h-4" />;
const FaEarthAfricaIcon = () => <Globe className="w-4 h-4" />;
const FaEarthAmericasIcon = () => <Globe className="w-4 h-4" />;
const FaMessageIcon = () => <MessageSquare className="w-4 h-4" />;

// Helper function for safe data access
const safeSubstring = (text, length = 150) => {
  if (!text || typeof text !== 'string') return 'No description available.';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// WhatsApp Integration Component
function WhatsAppButton({ phoneNumber, jobTitle, size = 'medium' }) {
  const message = `Hello, I am interested in applying for the ${jobTitle || 'this'} position at Nyaribu Secondary School. Could you please share more details about the application process?`;
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  return (
    <a
      href={`https://wa.me/${phoneNumber?.replace(/\D/g, '') || '254712345678'}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold shadow hover:from-green-600 hover:to-green-700 transition-all duration-200 ${sizeClasses[size]}`}
      onClick={() => toast.success('Opening WhatsApp...')}
    >
      <FaWhatsapp className="text-xl" />
      WhatsApp
    </a>
  );
}

// Phone Call Button Component
function CallButton({ phoneNumber, size = 'medium' }) {
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  return (
    <a
      href={`tel:${phoneNumber || '+254712345678'}`}
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ${sizeClasses[size]}`}
      onClick={() => toast.success('Dialing number...')}
    >
      <FaPhone />
      Call Now
    </a>
  );
}

// Email Button Component
function EmailButton({ email, jobTitle, size = 'medium' }) {
  const subject = `Job Application: ${jobTitle || 'Position'} - Nyaribu Secondary School`;
  const body = `Dear Hiring Manager,\n\nI am writing to apply for the ${jobTitle || 'this'} position at Nyaribu Secondary School that I saw on your website.\n\nPlease find my application details below:\n\n[Your Name]\n[Your Contact Information]\n[Brief Introduction]\n\nThank you for considering my application.\n\nSincerely,\n[Your Name]`;
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  return (
    <a
      href={`mailto:${email || 'nyaribucareers@gmail.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-bold shadow hover:from-purple-600 hover:to-purple-700 transition-all duration-200 ${sizeClasses[size]}`}
      onClick={() => toast.success('Opening email client...')}
    >
      <FaEnvelope />
      Email
    </a>
  );
}

// SMS Button Component
function SMSButton({ phoneNumber, jobTitle, size = 'medium' }) {
  const message = `Interested in ${jobTitle || 'position'} at Nyaribu Secondary School. Please share application details.`;
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  return (
    <a
      href={`sms:${phoneNumber || '+254712345678'}?body=${encodeURIComponent(message)}`}
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-bold shadow hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 ${sizeClasses[size]}`}
      onClick={() => toast.success('Opening SMS...')}
    >
      <MessageSquare className="w-4 h-4" />
      SMS
    </a>
  );
}

// Submit Resume Button Component (Gmail Integration)
function SubmitResumeButton({ email, jobTitle }) {
  const subject = `General Application - CV Submission for Future Opportunities`;
  const body = `Dear Nyaribu Secondary School Hiring Team,\n\nPlease find my CV attached for future job opportunities at your esteemed institution.\n\nI am interested in roles related to: [Your field of interest]\n\nMy key qualifications include:\n- [Qualification 1]\n- [Qualification 2]\n- [Qualification 3]\n\nI am available for interviews at your convenience.\n\nThank you for considering my application.\n\nSincerely,\n[Your Name]\n[Your Phone Number]\n[Your Email]`;
  
  return (
    <a
      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email || 'nyaribucareers@gmail.com'}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
      onClick={() => toast.success('Opening Gmail to submit CV...')}
    >
      <FaFileAlt /> Submit CV via Gmail
    </a>
  );
}

// Direct Gmail Compose Component
function DirectGmailButton({ email, jobTitle, label = "Apply via Gmail" }) {
  const subject = `Job Application: ${jobTitle || 'Position'} - Nyaribu Secondary School`;
  const body = `Dear Hiring Manager,\n\nI am writing to apply for the ${jobTitle || 'this'} position at Nyaribu Secondary School.\n\nPlease find my application attached:\n• CV/Resume\n• Cover Letter\n• Certificates\n• References\n\nI look forward to discussing my qualifications further.\n\nSincerely,\n[Your Name]`;
  
  return (
    <a
      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email || 'nyaribucareers@gmail.com'}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold shadow hover:from-red-600 hover:to-red-700 transition-all duration-200"
    >
      <FaEnvelope /> {label}
    </a>
  );
}

// Contact Methods Display Component
function ContactMethods({ job, showLabels = true }) {
  const hasPhone = job?.contactPhone;
  const hasEmail = job?.contactEmail;
  
  return (
    <div className="space-y-3">
      {showLabels && (
        <div className="text-center mb-2">
          <span className="text-xs font-bold text-gray-700 bg-gradient-to-r from-green-50 to-green-100 px-3 py-1 rounded-full">
            Apply Via:
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        {hasPhone && (
          <>
            <WhatsAppButton phoneNumber={job.contactPhone} jobTitle={job.jobTitle} />
            <CallButton phoneNumber={job.contactPhone} />
          </>
        )}
        {hasEmail && (
          <>
            <DirectGmailButton email={job.contactEmail} jobTitle={job.jobTitle} label="Gmail" />
            {hasPhone && <SMSButton phoneNumber={job.contactPhone} jobTitle={job.jobTitle} />}
          </>
        )}
        
        {/* Fallback if no contact info */}
        {!hasPhone && !hasEmail && (
          <>
            <WhatsAppButton phoneNumber="+254712345678" jobTitle={job?.jobTitle} />
            <CallButton phoneNumber="+254712345678" />
          </>
        )}
      </div>
    </div>
  );
}

// Modern Job Card for Public View
function PublicJobCard({ job }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Safely extract job data with defaults
  const jobData = {
    id: job?.id || '',
    jobTitle: job?.jobTitle || 'Untitled Position',
    department: job?.department || 'Not Specified',
    category: job?.category || 'General',
    jobDescription: job?.jobDescription || '',
    requirements: job?.requirements || '',
    qualifications: job?.qualifications || '',
    experience: job?.experience || 'Not specified',
    positionsAvailable: job?.positionsAvailable || 1,
    jobType: job?.jobType || 'full-time',
    applicationDeadline: job?.applicationDeadline || new Date().toISOString(),
    contactEmail: job?.contactEmail || 'nyaribucareers@gmail.com',
    contactPhone: job?.contactPhone || '+254712345678',
    createdAt: job?.createdAt || new Date().toISOString()
  };

  const getJobTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'full-time': return 'from-green-500 to-emerald-600';
      case 'part-time': return 'from-blue-500 to-cyan-600';
      case 'contract': return 'from-purple-500 to-pink-600';
      case 'internship': return 'from-amber-500 to-orange-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'teaching': return <FaUserGraduate />;
      case 'administrative': return <FaUserTie />;
      case 'support staff': return <FaTools />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'catering': return <Utensils className="w-4 h-4" />;
      case 'medical': return <FaStethoscope />;
      case 'academic': return <FaBookOpen />;
      case 'technical': return <FaLaptopCode />;
      case 'accounting': return <FaCalculator />;
      case 'science': return <FaFlask />;
      default: return <FaBriefcase />;
    }
  };

  const isDeadlinePassed = new Date(jobData.applicationDeadline) < new Date();
  const daysLeft = Math.max(0, Math.ceil((new Date(jobData.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)));

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved jobs' : 'Job saved to your list!');
  };

  const handleShareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${jobData.jobTitle} - Nyaribu Secondary School`,
        text: `Check out this job opportunity at Nyaribu Secondary School: ${jobData.jobTitle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'No deadline';
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'No deadline';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Job Header */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getCategoryIcon(jobData.category)}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{jobData.jobTitle}</h3>
                <div className="flex flex-wrap items-center gap-2 text-gray-600 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    <FaBuilding className="text-gray-400" /> {jobData.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    {jobData.category}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-4 py-1.5 bg-gradient-to-r ${getJobTypeColor(jobData.jobType)} text-white rounded-full text-xs font-bold shadow-sm`}>
                {jobData.jobType.replace('-', ' ').toUpperCase()}
              </span>
              <span className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                <FaUsers /> {jobData.positionsAvailable} position{jobData.positionsAvailable > 1 ? 's' : ''}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 ${
                isDeadlinePassed 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              }`}>
                <FaCalendar /> 
                {isDeadlinePassed ? 'CLOSED' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
              </span>
            </div>
            
            {/* Description Preview */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {safeSubstring(jobData.jobDescription)}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <FaGraduationCap className="text-gray-400 text-sm" />
                  <span className="text-xs font-medium text-gray-500">Experience</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{jobData.experience}</span>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <FaClock className="text-gray-400 text-sm" />
                  <span className="text-xs font-medium text-gray-500">Deadline</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatDate(jobData.applicationDeadline)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <ContactMethods job={jobData} />
            
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveJob}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg border border-gray-200 font-medium text-sm flex items-center justify-center gap-1.5 hover:from-gray-100 hover:to-gray-200"
              >
                {isSaved ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleShareJob}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg border border-gray-200 font-medium text-sm flex items-center justify-center gap-1.5 hover:from-gray-100 hover:to-gray-200"
              >
                <FaShareAlt /> Share
              </button>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mt-2"
            >
              {isExpanded ? 'Show Less' : 'View Details'} 
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>
        
        {/* Expanded Details */}
        {isExpanded && (
          <div className="pt-5 border-t border-gray-200 space-y-4 animate-fadeIn">
            {/* Job Description */}
            {jobData.jobDescription && (
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaFileContract className="text-blue-600" />
                  Job Description
                </h4>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{jobData.jobDescription}</p>
                </div>
              </div>
            )}
            
            {/* Requirements */}
            {jobData.requirements && (
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaGraduationCap className="text-emerald-600" />
                  Requirements
                </h4>
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-4 border border-emerald-200">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{jobData.requirements}</p>
                </div>
              </div>
            )}
            
            {/* Qualifications */}
            {jobData.qualifications && (
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaAward className="text-purple-600" />
                  Qualifications
                </h4>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{jobData.qualifications}</p>
                </div>
              </div>
            )}
            
            {/* How to Apply Section */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaPaperPlane className="text-amber-600" />
                How to Apply
              </h4>
              <div className="space-y-3">
                <p className="text-gray-700 text-sm">
                  Choose your preferred method to apply for this position:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaWhatsapp className="text-green-600" />
                      <span className="text-sm font-bold text-gray-900">WhatsApp Application</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Click the WhatsApp button to send a pre-filled message. Our HR team responds within 24 hours.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-red-600" />
                      <span className="text-sm font-bold text-gray-900">Gmail Application</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Opens Gmail with pre-filled subject and body. Attach your CV and certificates.
                    </p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-amber-200">
                  <p className="text-xs text-gray-600">
                    <strong>Note:</strong> All applications should include: CV, Cover Letter, Certificates, and ID copy.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl p-4 border border-cyan-200">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaEnvelope className="text-cyan-600" />
                  Email Contact
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${jobData.contactEmail}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {jobData.contactEmail}
                    </a>
                  </div>
                  <p className="text-xs text-gray-600">
                    Send your application via Gmail for faster processing
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FaPhone className="text-green-600" />
                  Phone Contact
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    <a href={`tel:${jobData.contactPhone}`} className="text-green-600 hover:text-green-800 font-medium text-sm">
                      {jobData.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <FaWhatsapp className="text-gray-400" />
                    <span className="text-xs text-gray-600">
                      WhatsApp available for quick inquiries (Mon-Fri, 8AM-5PM)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Filter Sidebar Component
function FilterSidebar({ 
  categories, 
  departments, 
  jobTypes, 
  selectedFilters, 
  onFilterChange,
  onClearFilters 
}) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:from-blue-700 hover:to-blue-800"
        >
          <FaFilter /> Filter Jobs
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden ${isMobileFiltersOpen ? '' : 'hidden'}`}>
        <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filter Jobs</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <FilterContent 
              categories={categories}
              departments={departments}
              jobTypes={jobTypes}
              selectedFilters={selectedFilters}
              onFilterChange={onFilterChange}
              onClearFilters={onClearFilters}
              onClose={() => setIsMobileFiltersOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block">
        <FilterContent 
          categories={categories}
          departments={departments}
          jobTypes={jobTypes}
          selectedFilters={selectedFilters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
        />
      </div>
    </>
  );
}

function FilterContent({ 
  categories, 
  departments, 
  jobTypes, 
  selectedFilters, 
  onFilterChange,
  onClearFilters,
  onClose 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filter By</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <FaBriefcase className="text-blue-600" />
          Job Category
        </h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.categories?.includes(category) || false}
                onChange={(e) => onFilterChange('categories', category, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Departments */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <FaBuilding className="text-purple-600" />
          Department
        </h4>
        <div className="space-y-2">
          {departments.map(dept => (
            <label key={dept} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.departments?.includes(dept) || false}
                onChange={(e) => onFilterChange('departments', dept, e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{dept}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Job Types */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <FaClock className="text-emerald-600" />
          Job Type
        </h4>
        <div className="space-y-2">
          {jobTypes.map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.jobTypes?.includes(type) || false}
                onChange={(e) => onFilterChange('jobTypes', type, e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700 capitalize">{type.replace('-', ' ')}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-800"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}

// Main Public Careers Page for Nyaribu Secondary School
export default function NyaribuCareersPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    departments: [],
    jobTypes: [],
  });
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  // Updated to match API data
  const categories = ['Teaching', 'Support Staff', 'Security', 'Catering'];
  const departments = ['Academics', 'Student Affairs', 'Support Staff'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract'];

  // Updated school info with Gmail
  const schoolInfo = {
    name: 'Nyaribu Secondary School',
    location: 'Kiganjo, Kenya',
    phone: '+254 712 345 678',
    email: 'nyaribucareers@gmail.com',
    whatsapp: '+254 712 345 678',
    motto: 'Excellence Through Discipline and Hard Work',
    established: '1995',
    workingHours: 'Mon-Fri: 8:00 AM - 5:00 PM'
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, search, selectedFilters, sortBy, showOnlyActive]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/career?limit=50');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load job listings');
      }
      
      const jobsArray = Array.isArray(data.jobs) ? data.jobs : [];
      setJobs(jobsArray);
      setFilteredJobs(jobsArray);
      
      // Extract unique categories and departments from API data
      if (jobsArray.length > 0) {
        const uniqueCategories = [...new Set(jobsArray.map(job => job.category).filter(Boolean))];
        const uniqueDepartments = [...new Set(jobsArray.map(job => job.department).filter(Boolean))];
        
        // Update categories and departments based on actual data
        if (uniqueCategories.length > 0) {
          console.log('Available categories:', uniqueCategories);
        }
        if (uniqueDepartments.length > 0) {
          console.log('Available departments:', uniqueDepartments);
        }
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setError(error.message);
      toast.error(`Failed to load job listings: ${error.message}`);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortJobs = () => {
    try {
      let filtered = [...jobs];

      // Filter by search
      if (search) {
        filtered = filtered.filter(job => 
          (job?.jobTitle?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (job?.department?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (job?.category?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (job?.jobDescription?.toLowerCase() || '').includes(search.toLowerCase())
        );
      }

      // Filter by categories
      if (selectedFilters.categories.length > 0) {
        filtered = filtered.filter(job => selectedFilters.categories.includes(job?.category));
      }

      // Filter by departments
      if (selectedFilters.departments.length > 0) {
        filtered = filtered.filter(job => selectedFilters.departments.includes(job?.department));
      }

      // Filter by job types
      if (selectedFilters.jobTypes.length > 0) {
        filtered = filtered.filter(job => selectedFilters.jobTypes.includes(job?.jobType));
      }

      // Filter by active status
      if (showOnlyActive) {
        filtered = filtered.filter(job => {
          try {
            return new Date(job?.applicationDeadline) > new Date();
          } catch {
            return true;
          }
        });
      }

      // Sort jobs
      filtered.sort((a, b) => {
        try {
          switch (sortBy) {
            case 'newest':
              return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
            case 'oldest':
              return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
            case 'deadline':
              return new Date(a?.applicationDeadline || 0) - new Date(b?.applicationDeadline || 0);
            case 'positions':
              return (b?.positionsAvailable || 0) - (a?.positionsAvailable || 0);
            default:
              return 0;
        }
        } catch {
          return 0;
        }
      });

      setFilteredJobs(filtered);
    } catch (error) {
      console.error('Error filtering jobs:', error);
      toast.error('Error applying filters');
    }
  };

  const handleFilterChange = (filterType, value, checked) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType] || []), value]
        : (prev[filterType] || []).filter(item => item !== value)
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      categories: [],
      departments: [],
      jobTypes: [],
    });
    setSearch('');
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const getActiveJobsCount = () => {
    return jobs.filter(job => {
      try {
        return new Date(job?.applicationDeadline) > new Date();
      } catch {
        return false;
      }
    }).length;
  };

  const getTotalPositions = () => {
    return filteredJobs.reduce((sum, job) => sum + (job?.positionsAvailable || 0), 0);
  };

  const getUniqueDepartmentsCount = () => {
    const departments = filteredJobs
      .map(job => job?.department)
      .filter(dept => dept);
    return [...new Set(departments)].length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading career opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-300">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Error Loading Jobs</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={loadJobs}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:from-green-700 hover:to-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Toaster position="top-right" richColors />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full blur-xl"></div>
                <div className="relative p-6 bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm border border-white border-opacity-20">
                  <div className="flex items-center gap-3">
                    <Mountain className="w-10 h-10 text-yellow-300" />
                    <div className="text-left">
                      <h2 className="text-2xl font-bold">Nyaribu</h2>
                      <p className="text-sm text-blue-100">Secondary School</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Join Our <span className="text-yellow-300">Academic</span> Family
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Shape young minds and build your career at Nyaribu Secondary School, Kiganjo
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search teaching positions, departments, or keywords..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold shadow hover:from-green-600 hover:to-green-700">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1440 120" fill="currentColor">
            <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,101.3C960,117,1056,139,1152,138.7C1248,139,1344,117,1392,106.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
                <FaBriefcase className="text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{getActiveJobsCount()}</p>
                <p className="text-sm text-gray-600">Open Positions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                <FaUsers className="text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{getTotalPositions()}</p>
                <p className="text-sm text-gray-600">Total Vacancies</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white">
                <FaUserGraduate className="text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{getUniqueDepartmentsCount()}</p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <FilterSidebar
              categories={categories}
              departments={departments}
              jobTypes={jobTypes}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            
            {/* School Info Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
                  <FaSchool className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Nyaribu Secondary</h3>
                  <p className="text-sm text-gray-600">Kiganjo, Kenya</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-green-400" />
                  <span>Kiganjo, Central Kenya</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-400" />
                  <a href={`tel:${schoolInfo.phone}`} className="text-blue-600 hover:text-blue-800">
                    {schoolInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="text-green-500" />
                  <a 
                    href={`https://wa.me/${schoolInfo.whatsapp.replace(/\D/g, '')}?text=Hello, I have a question about Nyaribu Secondary School job opportunities.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800"
                  >
                    WhatsApp Available
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-red-400" />
                  <a 
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${schoolInfo.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800"
                  >
                    {schoolInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-amber-400" />
                  <span>{schoolInfo.workingHours}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                  "{schoolInfo.motto}"
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Established {schoolInfo.established} • Excellence in Education
                </p>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-100 rounded-2xl shadow-xl border border-blue-200 p-5 mt-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaPaperPlane className="text-blue-600" />
                Quick Inquiry
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/${schoolInfo.whatsapp.replace(/\D/g, '')}?text=Hello, I have a question about job opportunities at Nyaribu Secondary School.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold text-sm text-center hover:from-green-600 hover:to-green-700"
                  >
                    <FaWhatsapp className="inline mr-1" /> WhatsApp
                  </a>
                  <a
                    href={`tel:${schoolInfo.phone}`}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-sm text-center hover:from-blue-600 hover:to-blue-700"
                  >
                    <FaPhone className="inline mr-1" /> Call
                  </a>
                </div>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${schoolInfo.email}&su=Job%20Inquiry%20-%20Nyaribu%20Secondary%20School`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold text-sm text-center hover:from-red-600 hover:to-red-700"
                >
                  <FaEnvelope className="inline mr-1" /> Gmail Inquiry
                </a>
              </div>
            </div>
          </div>

          {/* Main Job Listings */}
          <div className="lg:w-3/4">
            {/* Controls Bar */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Available
                  </h2>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOnlyActive}
                      onChange={(e) => setShowOnlyActive(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Show only active jobs</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 pl-4 pr-8 py-2"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="deadline">Deadline Soonest</option>
                      <option value="positions">Most Positions</option>
                    </select>
                    <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
                  <FaUserGraduate className="w-10 h-10 text-gradient-to-r from-green-600 to-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Current Openings</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  {search || selectedFilters.categories.length > 0 || selectedFilters.departments.length > 0 || selectedFilters.jobTypes.length > 0
                    ? 'No jobs match your search criteria. Try different filters.'
                    : 'There are currently no active job openings. Please check back later or send us your CV for future opportunities.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={handleClearFilters}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
                  >
                    Clear All Filters
                  </button>
                  <SubmitResumeButton email={schoolInfo.email} />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job, index) => (
                  <PublicJobCard key={job?.id || index} job={job} />
                ))}
              </div>
            )}

            {/* Application Guide */}
            <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl shadow-xl p-8 border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FaPaperPlane className="text-green-600" />
                How to Apply - Step by Step Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <span className="font-bold text-lg">1</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Choose Contact Method</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Select WhatsApp for instant chat, Gmail for formal application, or Call for direct conversation.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <span className="font-bold text-lg">2</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Prepare Documents</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Have your CV, academic certificates, cover letter, and ID copy ready in PDF format.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                      <span className="font-bold text-lg">3</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Submit via Gmail</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Use Gmail integration for professional submission. Attach all documents before sending.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <span className="font-bold text-lg">4</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Follow Up</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Wait for response (3-5 working days) or follow up via WhatsApp for quick updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-32 -translate-y-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 translate-y-32"></div>
              </div>
              
              <div className="relative max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Need Help with Your Application?</h3>
                <p className="text-blue-100 mb-6">
                  Our HR team is ready to assist you with any questions about the application process
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`https://wa.me/${schoolInfo.whatsapp.replace(/\D/g, '')}?text=Hello, I need help with my job application at Nyaribu Secondary School.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-green-600 rounded-xl font-bold shadow-lg hover:bg-gray-100 flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="text-xl" /> WhatsApp Support
                  </a>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${schoolInfo.email}&su=Application%20Assistance%20-%20Nyaribu%20Secondary%20School`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-red-600 flex items-center justify-center gap-2"
                  >
                    <FaEnvelope /> Email Assistance
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Nyaribu Secondary School. All rights reserved.</p>
          <p className="mt-1">Job applications are processed within 5-7 working days. Preferred communication: WhatsApp & Gmail.</p>
        </div>
      </div>
    </div>
  );
}

// Add CSS animations
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`;