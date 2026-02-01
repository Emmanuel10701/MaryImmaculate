'use client';
import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiHome, FiMapPin, 
  FiCalendar, FiBook, FiAward, FiHeart, 
  FiActivity, FiGlobe, FiBriefcase, FiUsers,
  FiCheckCircle, FiUpload, FiArrowRight, FiSearch,
  FiChevronDown, FiChevronUp, FiDownload, FiPrinter,
  FiShare2, FiCopy, FiExternalLink, FiEye, FiX,
  FiChevronRight, FiUserPlus 
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import Header from "../../components/apply/page.jsx";

// Kenya administrative data
import kenyaData from '../../../public/data.json';

const KatwanyaaAdmission = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    nationality: 'Kenyan',
    county: '',
    constituency: '',
    ward: '',
    village: '',
    
    // Contact Information
    email: '',
    phone: '',
    alternativePhone: '',
    postalAddress: '',
    postalCode: '',
    
    // Parent/Guardian Information
    fatherName: '',
    fatherPhone: '',
    fatherEmail: '',
    fatherOccupation: '',
    motherName: '',
    motherPhone: '',
    motherEmail: '',
    motherOccupation: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianOccupation: '',
    
    // Academic Information
    previousSchool: '',
    previousClass: '',
    kcpeYear: '',
    kcpeIndex: '',
    kcpeMarks: '',
    meanGrade: '',
    
    // Medical Information
    medicalCondition: '',
    allergies: '',
    
    // Extracurricular
    sportsInterests: '',
    clubsInterests: '',
    talents: ''
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  
  // Location modal states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationType, setLocationType] = useState('county');
  const [locationSearch, setLocationSearch] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);

  // Update API endpoint
  const API_ENDPOINT = '/api/applyadmission';

  // Modern notification function
  const showModernNotification = (message, type = 'info') => {
    const options = {
      duration: 4000,
      position: 'top-center',
      style: {
        background: type === 'error' ? '#ef4444' : 
                   type === 'success' ? '#10b981' : 
                   type === 'warning' ? '#f59e0b' : '#3b82f6',
        color: '#fff',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 20px',
        maxWidth: '90vw',
        width: 'auto',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      icon: type === 'success' ? '🎉' : 
            type === 'error' ? '⚠️' : 
            type === 'warning' ? '📢' : 'ℹ️',
    };

    if (type === 'success') {
      toast.success(message, options);
    } else if (type === 'error') {
      toast.error(message, options);
    } else if (type === 'warning') {
      toast(message, { ...options, icon: options.icon });
    } else {
      toast(message, options);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear dependent fields when parent changes
    if (name === 'county' && value !== formData.county) {
      setFormData(prev => ({
        ...prev,
        constituency: '',
        ward: '',
        village: ''
      }));
    }
    if (name === 'constituency' && value !== formData.constituency) {
      setFormData(prev => ({
        ...prev,
        ward: '',
        village: ''
      }));
    }
  };

  const validateStep = (step) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(07|01)\d{8}$/;

    switch(step) {
      case 1:
        if (!formData.firstName?.trim() || 
            !formData.lastName?.trim() || 
            !formData.gender || 
            !formData.dateOfBirth || 
            !formData.nationality?.trim() || 
            !formData.county) {
          showModernNotification('Please fill all required personal information fields', 'error');
          return false;
        }
        return true;
      case 2:
        if (!formData.email?.trim() || 
            !formData.postalAddress?.trim()) {
          showModernNotification('Please fill all required contact information fields', 'error');
          return false;
        }
        if (!emailRegex.test(formData.email)) {
          showModernNotification('Please enter a valid email address', 'error');
          return false;
        }
        // Phone is now optional, but if provided, validate format
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
          showModernNotification('Please enter a valid Kenyan phone number (07XXXXXXXX or 01XXXXXXXX)', 'error');
          return false;
        }
        return true;
      case 3:
        if (!formData.previousSchool?.trim() || 
            !formData.previousClass?.trim()) {
          showModernNotification('Please fill all required academic information fields', 'error');
          return false;
        }
        if (formData.kcpeMarks && (parseInt(formData.kcpeMarks) < 0 || parseInt(formData.kcpeMarks) > 500)) {
          showModernNotification('KCPE marks must be between 0 and 500', 'error');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setLoading(true);
    
    // Show submission in progress notification
    showModernNotification('Submitting your application...', 'warning');
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setApplicationNumber(data.applicationNumber);
        setSubmittedData({
          ...formData,
          applicationNumber: data.applicationNumber,
          submissionDate: new Date().toLocaleDateString(),
          submissionTime: new Date().toLocaleTimeString()
        });
        
        // Show success notification
        showModernNotification('Application submitted successfully! Check your confirmation details below.', 'success');
        
        // Reset form
        setFormData({
          firstName: '', middleName: '', lastName: '', gender: '', dateOfBirth: '',
          nationality: 'Kenyan', county: '', constituency: '', ward: '', village: '',
          email: '', phone: '', alternativePhone: '', postalAddress: '', postalCode: '',
          fatherName: '', fatherPhone: '', fatherEmail: '', fatherOccupation: '',
          motherName: '', motherPhone: '', motherEmail: '', motherOccupation: '',
          guardianName: '', guardianPhone: '', guardianEmail: '', guardianOccupation: '',
          previousSchool: '', previousClass: '', kcpeYear: '', kcpeIndex: '',
          kcpeMarks: '', meanGrade: '',
          medicalCondition: '', allergies: '',
          sportsInterests: '', clubsInterests: '', talents: ''
        });
        setStep(5);
        setShowSuccess(true);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        showModernNotification(data.error || 'Failed to submit application. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showModernNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const meanGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showModernNotification('Copied to clipboard!', 'success');
  };

  const printApplication = () => {
    window.print();
  };

  const shareApplication = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Marry Immculate Girls High SchoolAdmission - ${applicationNumber}`,
          text: `I've submitted my admission application to Marry Immculate Girls High  School. Application Number: ${applicationNumber}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(`${window.location.href}?app=${applicationNumber}`);
    }
  };

  // Location modal functions
  const openLocationModal = (type) => {
    setLocationType(type);
    setLocationSearch('');
    setFilteredLocations(getLocationsByType(type));
    setShowLocationModal(true);
  };

  const getLocationsByType = (type) => {
    switch(type) {
      case 'county':
        return kenyaData.map(county => ({
          name: county.name,
          count: county.constituencies?.length || 0
        }));
      case 'constituency':
        if (!formData.county) return [];
        const county = kenyaData.find(c => c.name === formData.county);
        return county?.constituencies?.map(constituency => ({
          name: constituency.name,
          count: constituency.wards?.length || 0
        })) || [];
      case 'ward':
        if (!formData.county || !formData.constituency) return [];
        const countyData = kenyaData.find(c => c.name === formData.county);
        const constituencyData = countyData?.constituencies?.find(c => c.name === formData.constituency);
        return constituencyData?.wards?.map(ward => ({ name: ward })) || [];
      default:
        return [];
    }
  };

  const selectLocation = (locationName) => {
    if (locationType === 'county') {
      setFormData(prev => ({ ...prev, county: locationName }));
    } else if (locationType === 'constituency') {
      setFormData(prev => ({ ...prev, constituency: locationName }));
    } else if (locationType === 'ward') {
      setFormData(prev => ({ ...prev, ward: locationName }));
    }
    setShowLocationModal(false);
  };

  // Filter locations based on search
  useEffect(() => {
    const allLocations = getLocationsByType(locationType);
    const filtered = allLocations.filter(location =>
      location.name.toLowerCase().includes(locationSearch.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [locationSearch, locationType, formData.county, formData.constituency]);

  // Modern Toaster Configuration
  const toasterConfig = {
    position: 'top-center',
    toastOptions: {
      duration: 4000,
      style: {
        background: '#363636',
        color: '#fff',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 20px',
        maxWidth: '90vw',
        width: 'auto',
      },
      success: {
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
        style: {
          background: '#10b981',
        },
      },
      error: {
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
        style: {
          background: '#ef4444',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/30 to-emerald-50/30 relative overflow-hidden">
      {/* Modern background with student image */}
      <div className="absolute inset-0 z-0">
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50"></div>
        
        {/* Student background image with low opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('/student.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'grayscale(30%) blur(1px)'
          }}
        ></div>
      </div>
      
      <Toaster {...toasterConfig} />

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {locationType === 'county' && 'Select County'}
                  {locationType === 'constituency' && `Select Constituency in ${formData.county}`}
                  {locationType === 'ward' && `Select Ward in ${formData.constituency}`}
                </h3>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="text-xl text-gray-600" />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="mt-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder={`Search ${locationType}...`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-bold"
                    autoFocus
                  />
                  {locationSearch && (
                    <button
                      onClick={() => setLocationSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="text-lg" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2 font-bold">
                  {filteredLocations.length} {locationType}(s) found
                </p>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredLocations.length > 0 ? (
                <div className="space-y-1">
                  {filteredLocations.map((location, index) => (
                    <button
                      key={`${location.name}-${index}`}
                      onClick={() => selectLocation(location.name)}
                      className="w-full text-left p-4 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <FiMapPin className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 group-hover:text-blue-700">
                            {location.name}
                          </div>
                          {location.count && (
                            <div className="text-sm text-gray-600 font-bold">
                              {location.count} {locationType === 'county' ? 'constituencies' : 'wards'}
                            </div>
                          )}
                        </div>
                      </div>
                      <FiChevronRight className="text-gray-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-lg font-semibold text-gray-600">No {locationType}s found</div>
                  <div className="text-gray-500 mt-2 font-bold">Try a different search term</div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t">
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

   <div>
    <Header />
   </div>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="relative mb-8">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div 
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 -z-10 transition-all duration-500"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          ></div>
          
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  step >= stepNum 
                    ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}>
                  {step > stepNum ? (
                    <FiCheckCircle className="text-lg" />
                  ) : stepNum === 5 ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span className="font-bold">{stepNum}</span>
                  )}
                </div>
                <span className={`text-xs font-semibold transition-colors ${
                  step >= stepNum ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {stepNum === 1 && 'Personal'}
                  {stepNum === 2 && 'Contact'}
                  {stepNum === 3 && 'Academic'}
                  {stepNum === 4 && 'Review'}
                  {stepNum === 5 && 'Complete'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {step === 5 ? (
            /* Enhanced Success Screen */
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative z-10">
              <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-8 text-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <FiCheckCircle className="text-5xl" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-2">
                  🎉 Application Submitted Successfully!
                </h2>
                <p className="text-center text-green-100 text-lg font-bold">
                  Your journey to excellence begins here
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Application Details Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                      <FiCheckCircle className="mr-2 text-blue-600" /> Application Details
                    </h3>
                    {applicationNumber && (
                      <div className="mb-6">
                        <div className="text-sm text-gray-600 mb-2 flex items-center font-bold">
                          <FiCopy className="mr-2" /> Application Number
                        </div>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-blue-800 font-mono bg-white px-4 py-2 rounded-lg border border-blue-200 flex-grow shadow-inner">
                            {applicationNumber}
                          </div>
                          <button
                            onClick={() => copyToClipboard(applicationNumber)}
                            className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FiCopy />
                          </button>
                        </div>
                      </div>
                    )}

                    {submittedData && (
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1 font-bold">Applicant Name</div>
                          <div className="font-semibold text-gray-800">
                            {submittedData.firstName} {submittedData.lastName}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1 font-bold">Submitted On</div>
                          <div className="font-semibold text-gray-800">
                            {submittedData.submissionDate} at {submittedData.submissionTime}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Next Steps Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                      📋 Next Steps
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Email Confirmation</h4>
                          <p className="text-sm text-gray-600 mt-1 font-bold">
                            Check your email ({formData.email}) for application confirmation.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 mt-1">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Parent Contact</h4>
                          <p className="text-sm text-gray-600 mt-1 font-bold">
                            Further communication will be sent to parent/guardian contacts provided.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 mt-1">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Document Verification</h4>
                          <p className="text-sm text-gray-600 mt-1 font-bold">
                            Bring original documents when requested for verification.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        📞 Need Help?
                      </h4>
                      <div className="text-sm text-gray-600 space-y-2 font-bold">
                        <p>Admissions Office: <strong>0712 345 678</strong></p>
                        <p>Email: <strong>admissions@Katwanyaa.ac.ke</strong></p>
                        <p>Office Hours: Mon-Fri, 8:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
<div className="mt-8 flex flex-nowrap gap-2 sm:gap-4 justify-center">
  <button
    onClick={() => {
      setStep(1);
      setShowSuccess(false);
    }}
    className="
      px-3 py-2 sm:px-6 sm:py-3
      bg-gradient-to-r from-blue-600 to-blue-700
      text-white
      rounded-lg sm:rounded-xl
      font-semibold
      text-xs sm:text-sm
      hover:from-blue-700 hover:to-blue-800
      transition-all hover:shadow-lg
      flex items-center
      shadow-md
      whitespace-nowrap
    "
  >
    <FiUser className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
    Submit Another
  </button>

  <button
    onClick={shareApplication}
    className="
      px-3 py-2 sm:px-6 sm:py-3
      bg-gradient-to-r from-emerald-600 to-emerald-700
      text-white
      rounded-lg sm:rounded-xl
      font-semibold
      text-xs sm:text-sm
      hover:from-emerald-700 hover:to-emerald-800
      transition-all hover:shadow-lg
      flex items-center
      shadow-md
      whitespace-nowrap
    "
  >
    <FiShare2 className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
    Share
  </button>
</div>

              </div>
            </div>
          ) : (
            /* Enhanced Form with Modern Design - 85% width on large screens */
<form
  onSubmit={handleSubmit}
  className="w-full mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative z-10"
>
  {/* Form Header with Step Indicator */}
  <div className="bg-gradient-to-r from-blue-50 via-emerald-50 to-blue-50 p-4 sm:p-6 md:p-8 border-b border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
          {step === 1 && '👤 Personal Information'}
          {step === 2 && '📱 Contact Details'}
          {step === 3 && '🎓 Academic Information'}
          {step === 4 && '📝 Review & Submit'}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 font-bold">
          {step === 1 && 'Tell us about the prospective student'}
          {step === 2 && 'How can we reach you? Provide contact details'}
          {step === 3 && 'Educational background and academic preferences'}
          {step === 4 && 'Final review before submission'}
        </p>
      </div>
      <div className="hidden lg:block">
        <div className="text-sm font-semibold text-gray-500">Progress</div>
        <div className="text-2xl font-bold text-blue-600">{step}/4</div>
      </div>
    </div>
  </div>

  {/* Form Content */}
  <div className="p-4 sm:p-6 md:p-8">
    {step === 1 && (
      <div className="space-y-6 sm:space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
            <FiUser className="mr-2 text-blue-600" /> Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {['firstName', 'middleName', 'lastName'].map((field) => (
              <div key={field} className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  {field === 'firstName' && 'First Name *'}
                  {field === 'middleName' && 'Middle Name'}
                  {field === 'lastName' && 'Last Name *'}
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                    placeholder={
                      field === 'firstName' ? 'John' :
                      field === 'middleName' ? 'Kamau' : 'Doe'
                    }
                    required={field !== 'middleName'}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                required
              >
                <option value="" className="text-gray-400">Select Gender</option>
                <option value="MALE" className="text-gray-800">Male</option>
                <option value="FEMALE" className="text-gray-800">Female</option>
              </select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Date of Birth *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              {formData.dateOfBirth && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1 font-semibold">
                  Age: {calculateAge(formData.dateOfBirth)} years
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location Information Section at TOP */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h3 className="text-base sm:text-md md:text-xl font-semibold text-gray-800 flex items-center">
              <FiMapPin className="mr-2 text-green-600" /> Location Information
            </h3>
            <div className="text-xs text-slate-900 px-2 sm:px-3 py-1 ">
              Select your location step-by-step
            </div>
          </div>
          
          {/* Location Selection Cards - Stacked on mobile, horizontal on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <FiMapPin className="text-blue-600" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-blue-800">County</span>
              </div>
              <div className="text-xs text-gray-600 font-bold">Required</div>
            </div>
            
            <div className={`bg-gradient-to-br ${formData.county ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-gray-50 to-gray-100 border-gray-200'} rounded-lg sm:rounded-xl p-3 sm:p-4 border`}>
              <div className="flex items-center mb-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 ${formData.county ? 'bg-emerald-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center mr-2 sm:mr-3`}>
                  <FiMapPin className={`${formData.county ? 'text-emerald-600' : 'text-gray-400'}`} />
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${formData.county ? 'text-emerald-800' : 'text-gray-400'}`}>Constituency</span>
              </div>
              <div className="text-xs text-gray-500 font-bold">{formData.county ? 'Now select' : 'Select county first'}</div>
            </div>
            
            <div className={`bg-gradient-to-br ${formData.constituency ? 'from-purple-50 to-purple-100 border-purple-200' : 'from-gray-50 to-gray-100 border-gray-200'} rounded-lg sm:rounded-xl p-3 sm:p-4 border`}>
              <div className="flex items-center mb-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 ${formData.constituency ? 'bg-purple-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center mr-2 sm:mr-3`}>
                  <FiMapPin className={`${formData.constituency ? 'text-purple-600' : 'text-gray-400'}`} />
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${formData.constituency ? 'text-purple-800' : 'text-gray-400'}`}>Ward</span>
              </div>
              <div className="text-xs text-gray-500 font-bold">{formData.constituency ? 'Now select' : 'Select constituency first'}</div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <FiHome className="text-gray-400" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-400">Village</span>
              </div>
              <div className="text-xs text-gray-500 font-bold">Optional</div>
            </div>
          </div>

          {/* Location Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Nationality *
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                required
              />
            </div>

            {/* County Selection with Modal */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                County *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.county}
                  readOnly
                  onClick={() => openLocationModal('county')}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold cursor-pointer bg-white"
                  placeholder="Click to select county..."
                  required
                />
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Constituency Selection with Modal */}
          {formData.county && (
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-emerald-800">
                Constituency *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.constituency}
                  readOnly
                  onClick={() => openLocationModal('constituency')}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-800 font-bold cursor-pointer bg-white"
                  placeholder="Click to select constituency..."
                  required
                />
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" />
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400" />
              </div>
            </div>
          )}

          {/* Ward Selection with Modal */}
          {formData.constituency && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-purple-800">
                  Ward *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.ward}
                    readOnly
                    onClick={() => openLocationModal('ward')}
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 font-bold cursor-pointer bg-white"
                    placeholder="Click to select ward..."
                    required
                  />
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Village / Estate
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all text-gray-800 font-bold"
                  placeholder="Enter village or estate name"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {step === 2 && (
      <div className="space-y-6 sm:space-y-8">
        {/* Contact Information */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
            <FiMail className="mr-2 text-blue-600" /> Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Email Address (For Parent) *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                  placeholder="student@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                  placeholder="Optional - 0712 345 678"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-bold">Format: 07XXXXXXXX or 01XXXXXXXX</p>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-800">
              Alternative Phone
            </label>
            <input
              type="tel"
              name="alternativePhone"
              value={formData.alternativePhone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
              placeholder="Optional alternative number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Postal Address *
              </label>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="postalAddress"
                  value={formData.postalAddress}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                  placeholder="P.O. Box 123-10100, Nairobi"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                placeholder="10100"
              />
            </div>
          </div>
        </div>

        {/* Parent/Guardian Information */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
            <FiUsers className="mr-2 text-blue-600" /> Parent/Guardian Information
          </h3>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
              <FiUser className="mr-2" /> Father's Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                  placeholder="Father's full name"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="fatherPhone"
                  value={formData.fatherPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                  placeholder="Father's phone"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  name="fatherEmail"
                  value={formData.fatherEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                  placeholder="father@example.com"
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Occupation
                </label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold"
                  placeholder="Father's occupation"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-pink-200">
            <h4 className="font-semibold text-pink-800 mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
              <FiUser className="mr-2" /> Mother's Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {['motherName', 'motherPhone', 'motherEmail', 'motherOccupation'].map((field) => (
                <div key={field} className="space-y-1 sm:space-y-2">
                  <label className="block text-sm sm:text-base font-semibold text-gray-800">
                    {field === 'motherName' && 'Full Name'}
                    {field === 'motherPhone' && 'Phone Number'}
                    {field === 'motherEmail' && 'Email'}
                    {field === 'motherOccupation' && 'Occupation'}
                  </label>
                  <input
                    type={field.includes('Email') ? 'email' : field.includes('Phone') ? 'tel' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-gray-800 font-bold"
                    placeholder={
                      field === 'motherName' ? "Mother's full name" :
                      field === 'motherPhone' ? "Mother's phone" :
                      field === 'motherEmail' ? "mother@example.com" :
                      "Mother's occupation"
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
              <FiUser className="mr-2" /> Guardian Information (If applicable)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {['guardianName', 'guardianPhone', 'guardianEmail', 'guardianOccupation'].map((field) => (
                <div key={field} className="space-y-1 sm:space-y-2">
                  <label className="block text-sm sm:text-base font-semibold text-gray-800">
                    {field === 'guardianName' && 'Full Name'}
                    {field === 'guardianPhone' && 'Phone Number'}
                    {field === 'guardianEmail' && 'Email'}
                    {field === 'guardianOccupation' && 'Occupation'}
                  </label>
                  <input
                    type={field.includes('Email') ? 'email' : field.includes('Phone') ? 'tel' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 font-bold text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-800 "
                    placeholder="Optional"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {step === 3 && (
      <div className="space-y-6 sm:space-y-8">
        {/* Academic Information */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
            <FiBook className="mr-2 text-blue-600" /> Academic Background
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Previous School *
              </label>
              <div className="relative">
                <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 font-bold sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 "
                  placeholder="Name of previous school"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Previous Class *
              </label>
              <input
                type="text"
                name="previousClass"
                value={formData.previousClass}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 font-bold text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                placeholder="e.g., Class 8, Form 2"
                required
              />
            </div>
          </div>
        </div>

        {/* KCPE Results */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-yellow-200">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-yellow-800 mb-3 sm:mb-4 flex items-center">
              <FiAward className="mr-2" /> KCPE Results (If Applicable)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  KCPE Year
                </label>
                <input
                  type="number"
                  name="kcpeYear"
                  value={formData.kcpeYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-gray-800 font-bold"
                  placeholder="2024"
                  min="2000"
                  max="2025"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  KCPE Index
                </label>
                <input
                  type="text"
                  name="kcpeIndex"
                  value={formData.kcpeIndex}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-gray-800 font-bold"
                  placeholder="12345678901"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  KCPE Marks
                </label>
                <input
                  type="number"
                  name="kcpeMarks"
                  value={formData.kcpeMarks}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-gray-800 font-bold"
                  placeholder="0-500"
                  min="0"
                  max="500"
                />
                {formData.kcpeMarks && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 sm:h-2 rounded-full"
                        style={{ width: `${(formData.kcpeMarks / 500) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 text-right font-semibold">
                      {formData.kcpeMarks}/500 ({((formData.kcpeMarks / 500) * 100).toFixed(1)}%)
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Mean Grade
                </label>
                <select
                  name="meanGrade"
                  value={formData.meanGrade}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-gray-800 font-bold"
                >
                  <option value="" className="text-gray-400">Select Grade</option>
                  {meanGrades.map(grade => (
                    <option key={grade} value={grade} className="text-gray-800">{grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Medical and Interests - Stacked on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
              <FiActivity className="mr-2 text-blue-600" /> Medical Information
            </h3>
            
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Medical Conditions
              </label>
              <textarea
                name="medicalCondition"
                value={formData.medicalCondition}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold min-h-[100px] sm:min-h-[120px]"
                placeholder="Any medical conditions we should be aware of..."
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-800">
                Allergies
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 font-bold min-h-[80px] sm:min-h-[80px]"
                placeholder="Food, drug allergies..."
              />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
              <FiHeart className="mr-2 text-red-600" /> Talents & Interests
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Sports Interests
                </label>
                <textarea
                  name="sportsInterests"
                  value={formData.sportsInterests}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-800 font-bold min-h-[60px] sm:min-h-[80px]"
                  placeholder="Football, Basketball, Athletics..."
                />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Club Interests
                </label>
                <textarea
                  name="clubsInterests"
                  value={formData.clubsInterests}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-800 font-bold min-h-[60px] sm:min-h-[80px]"
                  placeholder="Debate, Science Club, Drama..."
                />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-800">
                  Special Talents
                </label>
                <textarea
                  name="talents"
                  value={formData.talents}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 font-bold sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-800  min-h-[60px] sm:min-h-[80px]"
                  placeholder="Music, Art, Public Speaking..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {step === 4 && (
      <div className="space-y-6 sm:space-y-8">
        {/* Review Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 border border-green-200">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
              <FiEye className="text-lg sm:text-xl md:text-2xl text-green-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 mb-1 sm:mb-2">
                Review Your Application
              </h3>
              <p className="text-green-700 text-sm sm:text-base font-semibold">
                Please verify all information carefully. Once submitted, changes cannot be made.
              </p>
            </div>
          </div>
        </div>

        {/* Review Sections */}
        {[
          {
            title: '👤 Personal Information',
            icon: FiUser,
            color: 'blue',
            fields: [
              { label: 'Full Name', value: `${formData.firstName} ${formData.middleName || ''} ${formData.lastName}`.trim() },
              { label: 'Gender', value: formData.gender },
              { label: 'Date of Birth', value: formData.dateOfBirth, extra: formData.dateOfBirth ? `(Age: ${calculateAge(formData.dateOfBirth)} years)` : '' },
              { label: 'Nationality', value: formData.nationality },
              { label: 'County', value: formData.county },
              { label: 'Constituency', value: formData.constituency },
              { label: 'Ward', value: formData.ward },
              { label: 'Village', value: formData.village || 'Not provided' },
            ]
          },
          {
            title: '📱 Contact Information',
            icon: FiPhone,
            color: 'purple',
            fields: [
              { label: 'Email', value: formData.email },
              { label: 'Phone', value: formData.phone || 'Not provided' },
              { label: 'Alternative Phone', value: formData.alternativePhone || 'Not provided' },
              { label: 'Postal Address', value: formData.postalAddress },
              { label: 'Postal Code', value: formData.postalCode || 'Not provided' },
            ]
          },
          {
            title: '👨‍👩‍👧‍👦 Parent/Guardian Information',
            icon: FiUsers,
            color: 'pink',
            fields: [
              { label: "Father's Name", value: formData.fatherName || 'Not provided' },
              { label: "Father's Phone", value: formData.fatherPhone || 'Not provided' },
              { label: "Mother's Name", value: formData.motherName || 'Not provided' },
              { label: "Mother's Phone", value: formData.motherPhone || 'Not provided' },
            ]
          },
          {
            title: '🎓 Academic Information',
            icon: FiBook,
            color: 'yellow',
            fields: [
              { label: 'Previous School', value: formData.previousSchool },
              { label: 'Previous Class', value: formData.previousClass },
              ...(formData.kcpeYear ? [{ label: 'KCPE Year', value: formData.kcpeYear }] : []),
              ...(formData.kcpeMarks ? [{ label: 'KCPE Marks', value: formData.kcpeMarks }] : []),
              ...(formData.meanGrade ? [{ label: 'Mean Grade', value: formData.meanGrade }] : []),
            ]
          },
          {
            title: '⚕️ Health & Interests',
            icon: FiActivity,
            color: 'green',
            fields: [
              { label: 'Medical Conditions', value: formData.medicalCondition || 'None reported' },
              { label: 'Allergies', value: formData.allergies || 'None reported' },
              { label: 'Sports Interests', value: formData.sportsInterests || 'Not specified' },
              { label: 'Clubs Interests', value: formData.clubsInterests || 'Not specified' },
              { label: 'Special Talents', value: formData.talents || 'Not specified' },
            ]
          }
        ].map((section, sectionIndex) => (
          <div 
            key={section.title}
            className="border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden"
          >
            <div className={`bg-gradient-to-r from-${section.color}-50 to-${section.color}-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-${section.color}-200`}>
              <h4 className="font-bold text-gray-800 text-base sm:text-lg flex items-center">
                <section.icon className={`mr-2 sm:mr-3 text-${section.color}-600`} />
                {section.title}
              </h4>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="space-y-1">
                    <div className="text-xs sm:text-sm text-gray-700 font-semibold">{field.label}</div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg">
                      {field.value}
                      {field.extra && (
                        <span className="text-xs sm:text-sm text-gray-600 ml-2">{field.extra}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Terms and Conditions */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">📜 Terms & Conditions</h3>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 border border-gray-200">
            <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5 sm:mt-1"
              />
              <span className="text-xs sm:text-sm md:text-base text-gray-800 font-semibold">
                I certify that all information provided is accurate to the best of my knowledge and belief.
              </span>
            </label>
            <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5 sm:mt-1"
              />
              <span className="text-xs sm:text-sm md:text-base text-gray-800 font-semibold">
                I agree to the terms and conditions of Marry Immculate Girls High School's admission process.
              </span>
            </label>
            <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5 sm:mt-1"
              />
              <span className="text-xs sm:text-sm md:text-base text-gray-800 font-semibold">
                I consent to the school processing my personal data for admission purposes.
              </span>
            </label>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Form Footer with Navigation */}
  <div className="bg-gradient-to-r from-gray-50 to-slate-100 px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-6 border-t border-gray-200">
    <div className="flex flex-row justify-between items-center">
      {/* Step Indicator */}
      <div className="text-xs sm:text-sm text-gray-700 font-semibold mr-2">
        {step === 4 ? 'Ready?' : `Step ${step}/4`}
      </div>
      
      <div className="flex flex-nowrap items-center space-x-2 sm:space-x-3 md:space-x-4">
        {step > 1 && step < 4 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:bg-gray-50 transition-all flex items-center whitespace-nowrap shadow-sm"
          >
            <FiArrowRight className="mr-1 sm:mr-2 rotate-180" /> Back
          </button>
        )}
        
        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-3 sm:px-4 md:px-8 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center whitespace-nowrap shadow-md"
          >
            Continue <FiArrowRight className="ml-1 sm:ml-2" />
          </button>
        ) : step === 4 && (
          <div className="flex flex-nowrap space-x-2 sm:space-x-3 md:space-x-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:bg-gray-50 transition-all flex items-center whitespace-nowrap shadow-sm"
            >
              <FiEye className="mr-1 sm:mr-2" /> Preview
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-3 sm:px-4 md:px-10 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="hidden sm:inline">Submitting...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="mr-1 sm:mr-2 text-sm md:text-lg" /> 
                  <span >Submit</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
</form>
          )}
        </div>

        {/* Modern Footer */}
        <div className="mt-12 text-center relative z-10">
          <div className="bg-gradient-to-r from-blue-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📞 Need Assistance?</h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700 font-bold">
              <div className="flex items-center">
                <FiPhone className="mr-2 text-blue-600" />
                <span>Admissions: <strong className="text-gray-900">0712 345 678</strong></span>
              </div>
              <div className="flex items-center">
                <FiMail className="mr-2 text-green-600" />
                <span>Email: <strong className="text-gray-900">admissions@Katwanyaa.ac.ke</strong></span>
              </div>
              <div className="flex items-center">
                <FiHome className="mr-2 text-purple-600" />
                <span>Office Hours: <strong className="text-gray-900">Mon-Fri, 8:00 AM - 5:00 PM</strong></span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm font-semibold">
            © {new Date().getFullYear()} Marry Immculate Girls High  School. Excellence Through Discipline and Diligence.
          </p>
          <p className="text-gray-500 text-xs mt-2 font-bold">
            All applications are processed in accordance with our privacy policy and data protection regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KatwanyaaAdmission;