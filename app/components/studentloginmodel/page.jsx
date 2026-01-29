'use client';

import { useState, useEffect } from 'react';
import { 
  FiUser, FiLock, FiAlertCircle, FiX, 
  FiHelpCircle, FiBook, FiShield, FiClock,
  FiLogIn, FiEdit2, FiCheckCircle
} from 'react-icons/fi';
import { IoSchool } from 'react-icons/io5';

import CircularProgress from "@mui/material/CircularProgress";


export default function StudentLoginModal({ 
  isOpen, 
  onClose, 
  onLogin,
  isLoading = false,
  error = null,
  requiresContact = false
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: ''
  });
  const [localError, setLocalError] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (error) {
      setLocalError(error);
      if (requiresContact) {
        setShowContactInfo(true);
      }
    } else {
      setLocalError(null);
      setShowContactInfo(false);
    }
  }, [error, requiresContact]);

  if (!isOpen) return null;

  const validateInputs = () => {
    const errors = {};
    
    // Name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your name';
    } else {
      const nameParts = formData.fullName.trim().split(/\s+/).filter(part => part.length > 0);
      if (nameParts.length < 1) {
        errors.fullName = 'Please enter at least your first name';
      }
    }

    // Admission number validation
    if (!formData.admissionNumber.trim()) {
      errors.admissionNumber = 'Please enter your admission number';
    } else if (!/^[A-Z0-9]{2,10}$/i.test(formData.admissionNumber.trim())) {
      errors.admissionNumber = 'Admission number should be 2-10 letters or numbers';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    setShowContactInfo(false);
    setValidationErrors({});
    
    if (!validateInputs()) {
      return;
    }

    onLogin(formData.fullName.trim(), formData.admissionNumber.trim());
  };

  const handleClear = () => {
    setFormData({ fullName: '', admissionNumber: '' });
    setLocalError(null);
    setShowContactInfo(false);
    setValidationErrors({});
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (localError) setLocalError(null);
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Updated with Kamba names
  const studentExamples = [
    { name: "Musau Mwanzia Mutuku", admission: "2903" },
    { name: "Mwende Mumbua Kalondu", admission: "2902" },
    { name: "Mwikali Kasimu", admission: "1234" },
    { name: "Mutinda Kitheka", admission: "5678" },
    { name: "Kalondu Mutua", admission: "9012" }
  ];

  const nameFormats = [
    "Musau Mutuku",
    "Musau Mwanzia Mutuku", 
    "MUSAU MUTUKU",
    "musau mutuku",
    "M. Mutuku",
    "Mutuku Musau",
    "Mwanzia Mutuku",
    "Mwende Mumbua",
    "Mumbua Kalondu",
    "Mwikali Kasimu"
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-1 sm:p-2 animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <main className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-3xl border-2 border-blue-200 overflow-hidden transform transition-all duration-300 scale-100 my-auto max-h-[85vh] flex flex-col">
        {/* Header - Compact */}
        <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-4 py-3 sm:px-5 sm:py-3 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <figure className="p-1.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <IoSchool className="text-lg sm:text-xl" aria-hidden="true" />
              </figure>
              <div>
                <h1 id="login-modal-title" className="text-lg sm:text-xl font-bold">Student Login Portal</h1>
                <p id="login-modal-description" className="text-blue-100/90 text-xs mt-0.5">Access Katwanyaa Portal learning resources</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Close login modal"
            >
              <FiX className="text-lg" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Body - Compact Scrollable */}
        <article className="p-3 sm:p-4 overflow-y-auto flex-grow">
          {/* Flexible Name Instructions - Compact */}
          <section className="mb-3 sm:mb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2.5 sm:p-3 border border-emerald-200">
            <div className="flex items-start gap-2">
              <FiCheckCircle className="text-emerald-600 text-sm mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <h2 className="text-xs font-bold text-emerald-800 mb-0.5">Flexible Name Entry</h2>
                <p className="text-emerald-700 text-xs">
                  Any format: uppercase, lowercase, 2 or 3 names, any order
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {nameFormats.slice(0, 4).map((format, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleInputChange('fullName', format)}
                      className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs cursor-pointer hover:bg-emerald-200 transition-colors border border-emerald-300"
                      type="button"
                      aria-label={`Use name format: ${format}`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Error/Contact Info Section - Compact */}
          <aside>
            {(showContactInfo || localError) && (
              <div className="mb-3 sm:mb-4 animate-slideDown">
                <div className="flex items-start gap-2 mb-2">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 border ${showContactInfo ? 'bg-red-100 border-red-200' : 'bg-yellow-100 border-yellow-200'}`}>
                    <FiAlertCircle className={`text-sm ${showContactInfo ? 'text-red-600' : 'text-yellow-600'}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                      {showContactInfo ? 'Record Verification Needed' : 'Login Issue'}
                    </h3>
                    <p className="text-gray-600 text-xs">
                      {localError}
                    </p>
                    
                    {showContactInfo && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-blue-700">
                          <FiHelpCircle className="text-blue-500 text-xs" aria-hidden="true" />
                          <span className="font-medium">You can:</span>
                        </div>
                        <ol className="text-xs text-gray-700 space-y-0.5 pl-3">
                          <li className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px]">1</span>
                            <span>Re-enter details below</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px]">2</span>
                            <span>Contact class teacher</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px]">3</span>
                            <span>Visit school office</span>
                          </li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Login Form - Compact */}
          <section>
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                  <FiShield className="text-blue-700 text-sm" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Secure Student Login</h3>
                  <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <FiClock className="text-blue-500 text-xs" aria-hidden="true" />
                    <time>Session: <strong>2 hours</strong></time>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-2.5 sm:p-3 border border-blue-200">
                <p className="text-blue-700 text-xs">
                  <strong>Note:</strong> Use official admission number. Names in any format to access Katwanyaa Portal.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" aria-label="Student login form">
              {/* Name Input - Enhanced Border Visibility */}
              <fieldset>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <FiUser className="text-blue-600 text-xs" aria-hidden="true" />
                    <span>Your Name (Any Format)</span>
                  </label>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    Flexible
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Examples: Musau Mutuku, MUSAU MUTUKU, M. Mutuku, Mutuku Musau"
                  className={`
                    w-full px-3 py-2.5 sm:px-4 sm:py-3 
                    border-[3px] rounded-xl
                    focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 
                  
                    active:border-blue-700 active:ring-2 active:ring-blue-500/30
                    text-sm sm:text-base placeholder:text-gray-400
                    bg-white shadow-md
                    font-medium tracking-wide
                    ${validationErrors.fullName 
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-500/40' 
                      : 'border-blue-400'
                    }
                  `}
                  disabled={isLoading}
                  autoComplete="name"
                  aria-label="Full Name"
                  aria-invalid={!!validationErrors.fullName}
                  aria-describedby={validationErrors.fullName ? "name-error" : undefined}
                />
                {validationErrors.fullName && (
                  <p id="name-error" className="text-red-600 text-[10px] mt-0.5 font-medium flex items-center gap-1">
                    <FiAlertCircle className="text-xs" />
                    {validationErrors.fullName}
                  </p>
                )}
                <div className="mt-1.5">
                  <p className="text-gray-500 text-[10px] mb-1">Click examples:</p>
                  <div className="flex flex-wrap gap-1">
                    {studentExamples.slice(0, 3).map((student, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          handleInputChange('fullName', student.name);
                          handleInputChange('admissionNumber', student.admission);
                        }}
                        className="
                          px-1.5 py-1 
                          bg-gradient-to-r from-blue-100 to-blue-200 
                          hover:from-blue-200 hover:to-blue-300
                          active:from-blue-300 active:to-blue-400
                          text-blue-700 rounded text-[10px] 
                          border border-blue-400
                          shadow-sm hover:shadow-md
                          font-medium
                        "
                        aria-label={`Fill with student ${student.name}, admission ${student.admission}`}
                      >
                        {student.name.split(' ')[0]} - {student.admission}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>

              {/* Admission Number Input - Enhanced Border Visibility */}
              <fieldset>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <FiLock className="text-blue-600 text-xs" aria-hidden="true" />
                    <span>Admission Number</span>
                  </label>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    Unique ID
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.admissionNumber}
                  onChange={(e) => handleInputChange('admissionNumber', e.target.value.toUpperCase())}
                  placeholder="Enter your unique admission number"
                  className={`
                    w-full px-3 py-2.5 sm:px-4 sm:py-3 
                    border-[3px] rounded-xl
                    focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 
                    active:border-blue-700 active:ring-2 active:ring-blue-500/30
                    text-sm sm:text-base placeholder:text-gray-400
                    bg-white shadow-md
                    font-medium tracking-wide
                    ${validationErrors.admissionNumber 
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-500/40' 
                      : 'border-blue-400'
                    }
                  `}
                  disabled={isLoading}
                  autoComplete="off"
                  aria-label="Admission Number"
                  aria-invalid={!!validationErrors.admissionNumber}
                  aria-describedby={validationErrors.admissionNumber ? "admission-error" : undefined}
                />
                {validationErrors.admissionNumber && (
                  <p id="admission-error" className="text-red-600 text-[10px] mt-0.5 font-medium flex items-center gap-1">
                    <FiAlertCircle className="text-xs" />
                    {validationErrors.admissionNumber}
                  </p>
                )}
                <div className="mt-1.5">
                  <p className="text-gray-500 text-[10px] mb-1">Format: 2-10 letters/numbers</p>
                  <div className="flex flex-wrap gap-1">
                    {['1234', 'AB12', '2023001', 'STU456', 'KM001'].map((example, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInputChange('admissionNumber', example)}
                        className="
                          px-1.5 py-1 
                          bg-gradient-to-r from-green-100 to-emerald-200 
                          hover:from-green-200 hover:to-emerald-300
                          active:from-green-300 active:to-emerald-400
                          text-green-700 rounded text-[10px] 
                          transition-all duration-150 
                          border border-green-400
                          shadow-sm hover:shadow-md
                          font-medium
                        "
                        aria-label={`Use admission number: ${example}`}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>

              {/* Modernized Buttons */}
              <div className="flex gap-2 pt-1 flex-nowrap">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="
                    flex-1
                    py-3
                    px-4
                    bg-gradient-to-r from-gray-200 to-gray-300
                    hover:from-gray-300 hover:to-gray-400
                    active:from-gray-400 active:to-gray-500
                    text-gray-700
                    rounded-xl
                    font-bold
                    text-sm
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    order-2 sm:order-1
                    transition-all duration-200
                    shadow-md hover:shadow-lg
                    border-2 border-gray-400 hover:border-gray-500
                    active:scale-[0.98]
                  "
                  aria-label="Clear all inputs"
                >
                  <FiX className="text-sm" aria-hidden="true" />
                  <span>Clear All</span>
                </button>

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !formData.fullName.trim() ||
                    !formData.admissionNumber.trim()
                  }
                  className="
                    flex-1
                    py-3
                    px-4
                    bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700
                    hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800
                    active:from-blue-800 active:via-blue-900 active:to-indigo-900
                    text-white
                    rounded-xl
                    font-bold
                    text-sm
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    order-1 sm:order-2
                    transition-all duration-200
                    shadow-lg hover:shadow-xl
                    border-2 border-blue-600 hover:border-blue-700
                    active:scale-[0.98]
                    transform hover:-translate-y-0.5
                  "
                  aria-label="Login to Katwanyaa Portal"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <CircularProgress size={16} thickness={4} sx={{ color: "white" }} aria-label="Verifying" />
                      <span>Verifying...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FiLogIn className="text-sm" aria-hidden="true" />
                      <span>Login  o Portal</span>
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Features - Compact */}
            <section className="mt-3 sm:mt-4 pt-3 border-t border-gray-200">
              <h3 className="sr-only">Katwanyaa Portal Features</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="text-center p-1.5 sm:p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <FiBook className="text-blue-600 text-xs sm:text-sm mx-auto mb-1" aria-hidden="true" />
                  <p className="text-[10px] font-semibold text-blue-800">Resources</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                  <FiShield className="text-emerald-600 text-xs sm:text-sm mx-auto mb-1" aria-hidden="true" />
                  <p className="text-[10px] font-semibold text-emerald-800">Secure</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <FiClock className="text-purple-600 text-xs sm:text-sm mx-auto mb-1" aria-hidden="true" />
                  <p className="text-[10px] font-semibold text-purple-800">2 Hours</p>
                </div>
              </div>
            </section>
          </section>
        </article>

        {/* Footer - Compact */}
        <footer className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex-shrink-0">
          <p className="text-center text-gray-600 text-[10px] sm:text-xs">
            For assistance with Katwanyaa Portal: Contact class teacher or school office
          </p>
        </footer>
      </main>

      {/* Global Styles for Responsiveness */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .text-xl { font-size: 1.125rem; }
          .text-lg { font-size: 1rem; }
          .text-base { font-size: 0.875rem; }
        }
        
        @media (max-width: 480px) {
          .text-xl { font-size: 1rem; }
          .max-w-3xl { max-width: 95vw; }
        }
        
        /* Prevent zoom issues */
        html {
          text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        
        body {
          overflow-x: hidden;
        }
        
        /* Animation for error messages */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        
        /* Prevent iOS zoom on input focus */
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
        
        /* Responsive handling for high zoom levels */
        @media (min-width: 768px) and (max-width: 1200px) {
          .max-w-3xl {
            max-width: 85vw !important;
          }
        }
        
        /* For very small screens */
        @media (max-width: 320px) {
          .max-w-3xl {
            max-width: 98vw !important;
            margin: 0.25rem;
          }
        }
        
        /* Custom scrollbar for modal body */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Enhanced focus styles for better accessibility */
        *:focus-visible {
          outline: 3px solid #3b82f6;
          outline-offset: 3px;
        }
        
        /* Better input placeholder visibility */
        ::placeholder {
          color: #9ca3af;
          opacity: 0.9;
          font-weight: 500;
        }
        
        /* Smooth transitions for interactive elements */
        button, input, a {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Enhanced border visibility for all inputs */
        input {
          border-width: 3px !important;
        }
        
        /* Make focused inputs more prominent */
        input:focus {
          border-width: 3px !important;
          transform: translateY(-1px);
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2) !important;
        }
        
        /* Error state enhancement */
        input:invalid, input.error-border {
          border-width: 3px !important;
          animation: pulseError 0.5s ease-in-out;
        }
        
        @keyframes pulseError {
          0%, 100% { border-color: #ef4444; }
          50% { border-color: #fca5a5; }
        }
        
        /* Active state enhancement */
        input:active {
          border-width: 3px !important;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}