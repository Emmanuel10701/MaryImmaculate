"use client";

import React, { useState } from "react";

// Data for all terms and conditions with detailed descriptions for Mary Immaculate Girls Secondary School
const allTerms = [
  { 
    id: 1,
    title: "1. School Registration and Enrollment",
    intro: "Mary Immaculate Girls Secondary School maintains rigorous standards for student enrollment to ensure academic excellence and maintain our reputation as a leading educational institution for girls.",
    subSections: [
      { subTitle: "1.1. Eligibility Criteria:", content: "Admission is open to female students who have completed primary education (Class 8) and attained the minimum required KCPE score as determined by the school board annually." },
      { subTitle: "1.2. Documentation Required:", content: "Original birth certificate, KCPE result slip, transfer letter (if applicable), medical records, baptism certificate (if Catholic), and four passport-sized photographs must be submitted during registration." },
      { subTitle: "1.3. Age Requirement:", content: "Students must be between 13-15 years at the time of admission to Form 1. Special consideration may be given for exceptional circumstances upon board review." }
    ]
  },
  { 
    id: 2,
    title: "2. Academic Requirements and Expectations",
    intro: "Mary Immaculate Girls Secondary School is committed to academic excellence and expects students to maintain high standards of academic performance and conduct.",
    subSections: [
      { subTitle: "2.1. Minimum Attendance:", content: "Students must maintain at least 85% attendance in all subjects. Medical certificates must be provided for any absence exceeding two days." },
      { subTitle: "2.2. Academic Performance:", content: "Students must maintain a minimum grade of C- in all subjects. Those failing two or more subjects will be placed on academic probation with mandatory remedial classes." },
      { subTitle: "2.3. Examination Rules:", content: "Strict adherence to KNEC examination rules during national exams. Any form of examination malpractice will result in immediate expulsion and blacklisting from national exams." }
    ]
  },
  { 
    id: 3,
    title: "3. School Fees and Financial Obligations",
    intro: "Timely payment of school fees is essential for the smooth operation of the school and continued access to educational resources.",
    subSections: [
      { subTitle: "3.1. Fee Structure:", content: "School fees are payable in three installments: 40% in Term 1, 35% in Term 2, and 25% in Term 3. Fees include tuition, boarding, laboratory charges, and extracurricular activities." },
      { subTitle: "3.2. Payment Deadlines:", content: "Fees must be paid within the first two weeks of each term. Students with outstanding fees after the third week will be sent home until payment is cleared." },
      { subTitle: "3.3. Additional Charges:", content: "Extra charges apply for damage to school property, lost textbooks, and specialized activities. These must be settled before end of term." }
    ]
  },
  { 
    id: 4,
    title: "4. Code of Conduct and Discipline",
    intro: "Mary Immaculate Girls Secondary School maintains high standards of discipline to create a conducive learning environment for all students.",
    subSections: [
      { subTitle: "4.1. School Uniform:", content: "Complete school uniform must be worn at all times during school hours. Uniform includes prescribed shoes, socks, tie, badge, and veil for Mass. No alterations allowed." },
      { subTitle: "4.2. Prohibited Items:", content: "Mobile phones, electronic devices, drugs, alcohol, tobacco products, weapons, makeup, and inappropriate literature are strictly prohibited on school premises." },
      { subTitle: "4.3. Disciplinary Actions:", content: "Minor offenses: Detention. Moderate offenses: Manual work. Serious offenses: Suspension or expulsion depending on severity and frequency." }
    ]
  },
  { 
    id: 5,
    title: "5. Boarding School Regulations",
    intro: "As a boarding school, we provide structured residential facilities with specific rules to ensure safety and proper development of our girls.",
    subSections: [
      { subTitle: "5.1. Dormitory Rules:", content: "Lights out at 9:30 PM. Morning wake-up at 5:00 AM. Dormitory inspection daily at 7:00 AM. No visitors in dormitories without permission." },
      { subTitle: "5.2. Weekend Passes:", content: "Students may go home on weekends with written permission from parents/guardians. Must sign out and return by Sunday 6:00 PM." },
      { subTitle: "5.3. Health and Hygiene:", content: "Daily showers mandatory. Bedding washed weekly. Regular room cleaning. Medical check-ups monthly." }
    ]
  },
  { 
    id: 6,
    title: "6. Academic Resources and Facilities",
    intro: "The school provides various academic resources to support student learning and development.",
    subSections: [
      { subTitle: "6.1. Library Access:", content: "Library open Monday-Friday 7:30 AM to 6:00 PM, Saturday 8:00 AM to 1:00 PM. Maximum two books borrowed for two weeks." },
      { subTitle: "6.2. Laboratory Usage:", content: "Science laboratories accessible during practical lessons and supervised study sessions. Strict safety protocols must be followed." },
      { subTitle: "6.3. Computer Lab:", content: "Computer lab available for ICT lessons and research. Internet access filtered for educational purposes only." }
    ]
  },
  { 
    id: 7,
    title: "7. Extracurricular Activities",
    intro: "Participation in extracurricular activities is encouraged for holistic development of students.",
    subSections: [
      { subTitle: "7.1. Sports and Games:", content: "Mandatory participation in at least one sport. Training sessions Monday, Wednesday, Friday 4:00-6:00 PM. Inter-school competitions monthly." },
      { subTitle: "7.2. Clubs and Societies:", content: "Each student must join at least two clubs. Club meetings every Tuesday and Thursday 4:00-5:30 PM. Catholic Action Club mandatory for all." },
      { subTitle: "7.3. Cultural Activities:", content: "Music, drama, and art competitions held each term. Participation in annual music festival mandatory." }
    ]
  },
  { 
    id: 8,
    title: "8. Health and Safety Regulations",
    intro: "Student health and safety are our top priorities with comprehensive policies in place.",
    subSections: [
      { subTitle: "8.1. Medical Care:", content: "School nurse available 24/7. Serious cases referred to Mweiga Health Center. Parents notified immediately of any serious illness." },
      { subTitle: "8.2. Emergency Procedures:", content: "Fire drills conducted monthly. Emergency evacuation plans displayed in all rooms. First aid kits in every classroom and dormitory." },
      { subTitle: "8.3. COVID-19 Protocols:", content: "Masks mandatory in crowded areas. Hand sanitizers at all entrances. Temperature checks daily. Isolation room for suspected cases." }
    ]
  },
  { 
    id: 9,
    title: "9. Parent/Guardian Involvement",
    intro: "We believe in strong partnership between school and parents for student success.",
    subSections: [
      { subTitle: "9.1. Parent Meetings:", content: "PTA meetings held each term (second Saturday). Individual parent-teacher consultations available by appointment." },
      { subTitle: "9.2. Communication:", content: "School newsletter monthly. Progress reports end of each term. Emergency contacts updated annually." },
      { subTitle: "9.3. Visiting Days:", content: "Official visiting days: First Saturday of each month 9:00 AM - 4:00 PM. Special visits require prior approval." }
    ]
  },
  { 
    id: 10,
    title: "10. Examination and Assessment Policy",
    intro: "Comprehensive assessment system to monitor and evaluate student progress.",
    subSections: [
      { subTitle: "10.1. Continuous Assessment:", content: "Three CATs per term. End-term examinations each term. Form 4: Mock exams Terms 1 and 2." },
      { subTitle: "10.2. Grading System:", content: "CATs: 30%, End-term: 70%. Minimum passing grade: D+. Promotion to next form requires passing all subjects." },
      { subTitle: "10.3. KCSE Preparation:", content: "Form 4 students: Special revision classes Saturday mornings. Past paper practice from Term 2." }
    ]
  },
  { 
    id: 11,
    title: "11. Dress Code and Appearance",
    intro: "Maintaining proper appearance is part of instilling discipline and pride in the school.",
    subSections: [
      { subTitle: "11.1. Hair Regulations:", content: "Hair must be neat, clean, and tied back. No elaborate hairstyles, braids, or extensions. Hair must not touch the collar. No coloring or styling products allowed." },
      { subTitle: "11.2. Accessories:", content: "Simple watches and small stud earrings allowed (one per ear). No jewelry except religious medals worn inside uniform. No visible tattoos or body piercings." },
      { subTitle: "11.3. Sports Attire:", content: "Prescribed sports uniform for games. No personal sports gear allowed during school activities." }
    ]
  },
  { 
    id: 12,
    title: "12. Technology and Internet Usage",
    intro: "Responsible use of technology to enhance learning while maintaining safety.",
    subSections: [
      { subTitle: "12.1. Device Policy:", content: "Calculators allowed for Mathematics and Sciences only. No personal laptops, tablets, or smartphones on school premises." },
      { subTitle: "12.2. Internet Access:", content: "Filtered internet available in computer lab only. Social media access blocked. All browsing monitored and logged." },
      { subTitle: "12.3. Cyber Safety:", content: "No sharing of personal information online. Reporting of cyberbullying mandatory. Digital citizenship lessons monthly." }
    ]
  },
  { 
    id: 13,
    title: "13. Transportation and Travel",
    intro: "Safety regulations for student movement within and outside school.",
    subSections: [
      { subTitle: "13.1. School Transport:", content: "School buses available for official trips only. Seat belts mandatory. No standing in moving vehicles." },
      { subTitle: "13.2. Travel Authorization:", content: "Written permission required for any travel outside school. Parent/guardian must sign consent forms." },
      { subTitle: "13.3. Emergency Travel:", content: "School vehicle available for medical emergencies. Parents responsible for transport costs for non-emergencies." }
    ]
  },
  { 
    id: 14,
    title: "14. Counseling and Guidance",
    intro: "Comprehensive support system for student welfare and career development.",
    subSections: [
      { subTitle: "14.1. Guidance Office:", content: "Open Monday-Friday 8:00 AM-5:00 PM. Confidential counseling sessions available. Appointment system for privacy." },
      { subTitle: "14.2. Career Guidance:", content: "Career talks each term. University and college visits Form 3 and 4. Career profiling and subject selection assistance." },
      { subTitle: "14.3. Peer Counseling:", content: "Trained peer counselors available. Anonymous reporting system for sensitive issues." }
    ]
  },
  { 
    id: 15,
    title: "15. Environmental Conservation",
    intro: "Instilling responsibility towards the environment as part of holistic education.",
    subSections: [
      { subTitle: "15.1. Cleanliness:", content: "Daily cleaning of classrooms and compounds. Monthly environmental clean-up exercises. No littering policy strictly enforced." },
      { subTitle: "15.2. Conservation Projects:", content: "Tree planting each rainy season. Water conservation education. Renewable energy projects." },
      { subTitle: "15.3. Waste Management:", content: "Separate bins for biodegradable and non-biodegradable waste. Recycling program for paper and plastics." }
    ]
  }
];

const TERMS_PER_PAGE = 5;
const totalPages = Math.ceil(allTerms.length / TERMS_PER_PAGE);

export default function TermsAndConditions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const startIndex = (currentPage - 1) * TERMS_PER_PAGE;
  const endIndex = startIndex + TERMS_PER_PAGE;
  
  // Filter terms based on search
  const filteredTerms = allTerms.filter(term => 
    term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.intro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.subSections.some(sub => 
      sub.subTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  const currentTerms = filteredTerms.slice(startIndex, endIndex);
  const filteredPages = Math.ceil(filteredTerms.length / TERMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 p-4 sm:p-6 md:p-8">
      {/* Modern Header */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12 md:mb-16">
          {/* School Logo and Info */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl border border-orange-200 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MI</span>
                </div>
                <span className="text-sm font-bold text-orange-900 uppercase tracking-wider">Mary Immaculate Girls Secondary</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-2 leading-tight">
                School Rules & Regulations
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Official policies and guidelines governing student conduct, academics, and school operations at Mary Immaculate Girls Secondary School
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-700">{allTerms.length}</div>
                <div className="text-xs font-medium text-slate-500">Total Sections</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-700">{new Date().getFullYear()}</div>
                <div className="text-xs font-medium text-slate-500">Academic Year</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search rules and regulations..."
                className="w-full px-4 py-3 pl-12 text-base sm:text-lg border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 bg-white shadow-sm"
                style={{ fontSize: '16px' }}
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-xs font-medium text-slate-600">Showing {currentTerms.length} of {filteredTerms.length} rules</span>
              </div>
              {searchTerm && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  Search: "{searchTerm}"
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Page {currentPage} of {filteredPages}
            </div>
          </div>
        </div>

        {/* Terms Grid - Responsive */}
        <div className="space-y-4 sm:space-y-6 mb-10">
          {currentTerms.length > 0 ? (
            currentTerms.map((term) => (
              <div 
                key={term.id} 
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Term Header with Gradient */}
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 sm:p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-sm sm:text-lg font-bold">{term.id}</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-1 rounded-full">
                          Section {term.id}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">{term.title}</h2>
                    </div>
                    <div className="hidden sm:block">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Term Content */}
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="mb-4 sm:mb-6">
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{term.intro}</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {term.subSections.map((sub, index) => (
                      <div 
                        key={index} 
                        className="p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-xl sm:rounded-2xl"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">{sub.subTitle}</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{sub.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8 sm:p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No Rules Found</h3>
                <p className="text-slate-600 mb-4">Try searching with different keywords or browse all sections</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Show All Rules
                </button>
              </div>
            </div>
          )}
        </div>

     {/* Modern Pagination */}
{filteredPages > 1 && (
  <div className="sticky bottom-4 z-10 px-4">
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl p-4 max-w-2xl mx-auto">
      {/* Container: Stacked on Mobile (col), Row on Desktop (sm:row) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4">
        
        {/* 1. Page Info - Smaller text on mobile */}
        <div className="text-center sm:text-left shrink-0">
          <div className="text-[11px] sm:text-sm font-black text-slate-800 uppercase tracking-tight">
            Page {currentPage} of {filteredPages}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
            {filteredTerms.length} Rules available
          </div>
        </div>

        {/* 2. Page Numbers - Reduced gap on mobile to fit */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(filteredPages > 4 ? 3 : 5, filteredPages) }, (_, i) => {
              // Logic for page numbering stays the same, but we show fewer on tiny screens
              let pageNum;
              if (filteredPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= filteredPages - 2) pageNum = filteredPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              
              if (!pageNum) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-[11px] sm:text-sm font-black transition-all ${
                    currentPage === pageNum
                      ? 'bg-slate-900 text-white shadow-md scale-105'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(Math.min(filteredPages, currentPage + 1))}
            disabled={currentPage === filteredPages}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 3. Quick Jump - Hidden on very small screens or moved to a neat row */}
        <div className="flex items-center gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 w-full sm:w-auto justify-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jump:</span>
          <select
            value={currentPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            className="pl-2 pr-8 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold bg-slate-50 focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Length19l-7 7-7-7' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
          >
            {Array.from({ length: filteredPages }, (_, i) => i + 1).map(page => (
              <option key={page} value={page}>P. {page}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  </div>
)}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
              <h4 className="font-bold text-orange-900 mb-2">Important Notice</h4>
              <p className="text-sm text-slate-700">These rules are binding for all students. Parents/guardians must ensure students understand and comply.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2">Last Updated</h4>
              <p className="text-sm text-slate-700">January 6, {new Date().getFullYear()}. Rules are reviewed annually and may be updated.</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 border border-red-100">
              <h4 className="font-bold text-red-900 mb-2">Enforcement</h4>
              <p className="text-sm text-slate-700">Rules enforced by school administration. Appeals to be made in writing to Principal's office.</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Mary Immaculate Girls Secondary School. All rights reserved. 
              <span className="block mt-1">For queries, contact: principal@maryimmaculate.sc.ke | Tel: +254 712 345 678 | Mweiga, Nyeri</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}