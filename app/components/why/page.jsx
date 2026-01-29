"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

// --- Modern Minimalist SVGs ---
const TrophyIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0V9.403c0-.621-.504-1.125-1.125-1.125h-4.5c-.621 0-1.125.504-1.125 1.125v5.972M6.75 7.125V4.875c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v2.25M9 6h6" />
  </svg>
);

const SparklesIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147L12 15l7.74-4.853a4.5 4.5 0 00-4.853-7.74L12 6l-2.887-1.453a4.5 4.5 0 00-4.853 5.6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v6M9 18h6" />
  </svg>
);

const ModernSchoolLayout = () => {
  const router = useRouter();
  
  const handleExplorePathways = () => {
    router.push("/pages/admissions");
  };

  const whyChooseUs = [
    {
      title: "Academic Excellence",
      gradient: "from-blue-500 to-cyan-500",
      description: "Consistently ranked among top-performing schools in Nyeri County with impressive KCSE results year after year.",
      metrics: "Top Nyeri County School"
    },
    {
      title: "Holistic Development",
      gradient: "from-green-500 to-emerald-500",
      description: "Balancing academic rigor with spiritual growth, sports, arts, and leadership programs for well-rounded individuals.",
      metrics: "Complete Education"
    },
    {
      title: "Christian  Values",
      gradient: "from-purple-500 to-pink-500",
      description: "Founded on strong Christian principles, nurturing girls with moral integrity, discipline, and service to community.",
      metrics: "Values-Based Education"
    },
    {
      title: "Modern Facilities",
      gradient: "from-orange-500 to-yellow-500",
      description: "State-of-the-art laboratories, well-equipped classrooms, and serene learning environment in Matungulu's beautiful landscape.",
      metrics: "Premier Infrastructure"
    }
  ];

  const schoolFeatures = [
    {
      title: "Proven Academic Excellence",
      gradient: "from-blue-500 to-cyan-500",
      description: "Katwanyaa high  School maintains outstanding academic performance with consistent high KCSE results. Our dedicated faculty and rigorous curriculum ensure students excel in sciences, humanities, and technical subjects.",
      highlight: "Academic Distinction",
      details: ["High KCSE Performance", "University Scholarships", "National Recognition", "Science & Arts Excellence"],
      metrics: ["90%+ KCSE", "Merit Awards", "100+ Scholarships"]
    },
    {
      title: "Experienced Teaching Faculty",
      gradient: "from-green-500 to-emerald-500",
      description: "Our team comprises qualified, experienced educators with specialized training in girl-child education. Small teacher-student ratios ensure personalized attention and mentorship for every learner.",
      highlight: "Qualified Educators",
      details: ["TSC Certified", "Subject Specialists", "Continuous Training", "Individual Mentoring"],
      metrics: ["40+ Teachers", "15+ Years Experience", "100% Certified"]
    },
    {
      title: "Modern Learning Environment",
      gradient: "from-purple-500 to-pink-500",
      description: "Located in scenic Matungulu, our campus features well-equipped science laboratories, computer labs, digital resources, and spacious classrooms that create an ideal atmosphere for learning and innovation.",
      highlight: "Advanced Facilities",
      details: ["Science Laboratories", "Computer Labs", "Library Resources", "Sports Facilities"],
      metrics: ["4 Science Labs", "2 Computer Labs", "10,000+ Books"]
    },
    {
      title: "Comprehensive Co-curricular",
      gradient: "from-teal-500 to-green-500",
      description: "We offer diverse extracurricular activities including sports, music, drama, clubs, and leadership programs that develop talents, confidence, and teamwork skills essential for holistic growth.",
      highlight: "15+ Activities",
      details: ["Sports Teams", "Music & Drama", "Clubs & Societies", "Leadership Training"],
      metrics: ["8 Sports", "12 Clubs", "Annual Events"]
    },
    {
      title: "Spiritual & Moral Formation",
      gradient: "from-orange-500 to-yellow-500",
      description: "As a Christian  institution, we emphasize spiritual growth, moral values, and character development. Regular religious education, retreats, and community service build responsible citizens.",
      highlight: "Values Education",
      details: ["Christian  Teachings", "Character Building", "Community Service", "Ethical Education"],
      metrics: ["Weekly Mass", "Retreats", "Service Projects"]
    },
    {
      title: "University & Career Preparation",
      gradient: "from-slate-800 to-slate-900",
      description: "We provide comprehensive career guidance, university linkage programs, and mentorship partnerships with leading Kenyan universities to ensure smooth transition to higher education and professional success.",
      highlight: "University Pathways",
      details: ["Career Counseling", "University Tours", "Alumni Network", "Scholarship Guidance"],
      metrics: ["University Partners", "Career Fairs", "Alumni Success"],
      isPremium: true
    }
  ];

  return (
    <div className="bg-slate-50 py-10 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* --- WHY CHOOSE US SECTION --- */}
        <section className="mb-16 sm:mb-24 md:mb-32">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div>
              <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
                Why Choose Katwanyaa high School
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] mb-4 sm:mb-6 md:mb-8">
                Excellence in Education, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                  Character in Action.
                </span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {whyChooseUs.map((item, idx) => (
                  <div key={idx} className="group bg-white p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-lg sm:hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-0.5 sm:hover:-translate-y-1">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-3 sm:mb-4 shadow-md sm:shadow-lg`}>
                      <TrophyIcon />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 sm:mb-2">{item.title}</h4>
                    <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed mb-2 sm:mb-3">
                      {item.description}
                    </p>
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-tight bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded">
                      {item.metrics}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative h-[400px] md:h-[500px] lg:h-[550px] bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-xl md:shadow-2xl group">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
               <div className="absolute bottom-6 md:bottom-8 lg:bottom-10 left-6 md:left-8 lg:left-10 right-6 md:right-8 lg:right-10 z-20">
                  <div className="backdrop-blur-md bg-white/10 p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border border-white/20">
                     <p className="text-white text-xl md:text-2xl lg:text-3xl font-black tracking-tighter">Katwanyaa high</p>
                     <p className="text-white/70 text-xs md:text-sm font-bold uppercase tracking-wider">Matungulu, Machakos County</p>
                  </div>
               </div>
               <div className="overflow-hidden rounded-[1.5rem] md:rounded-[1.8rem]">
                  <img 
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000" 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                    alt="Katwanyaa  High School Tour"
                    loading="lazy"
                  />
               </div>
            </div>
          </div>
        </section>

        {/* --- SCHOOL FEATURES: BENTO GRID --- */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 px-2">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3 sm:mb-4">
              Our Educational Pillars
            </h3>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium">
              Building academic excellence, strong character, and future-ready skills at Katwanyaa  High School, Matungulu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
            {schoolFeatures.map((feature, index) => {
              const spans = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-6"];
              const isDark = feature.isPremium;
              
              return (
                <div 
                  key={index} 
                  className={`${spans[index] || "md:col-span-2"} relative overflow-hidden ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} border ${isDark ? 'border-slate-800' : 'border-slate-200'} rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-5 md:p-6 lg:p-8 group hover:border-blue-400 transition-all duration-300 md:duration-500 shadow-sm`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br ${feature.gradient} opacity-[0.05] group-hover:opacity-10 sm:group-hover:opacity-20 transition-opacity rounded-bl-full`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg mb-4 sm:mb-5 md:mb-6`}>
                       {isDark ? <GraduationCapIcon /> : <SparklesIcon />}
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <span className={`text-[10px] font-black ${isDark ? 'text-blue-400' : 'text-blue-600'} uppercase tracking-widest mb-1.5 sm:mb-2 block`}>
                        {feature.highlight}
                      </span>
                      <h4 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-tight mb-2 sm:mb-3">
                        {feature.title}
                      </h4>
                      <p className={`${isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-semibold'} text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-none`}>
                        {feature.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto pt-4 sm:pt-5 md:pt-6">
                      {feature.details.map((detail, dIdx) => (
                        <span key={dIdx} className={`px-2 sm:px-3 py-0.5 sm:py-1 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'} border ${isDark ? 'border-slate-700' : 'border-slate-100'} rounded-full text-[10px] font-bold uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] sm:max-w-none`}>
                          {detail}
                        </span>
                      ))}
                    </div>

                    {isDark && (
                       <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                          <button 
                            onClick={handleExplorePathways} 
                            className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-md sm:shadow-lg shadow-blue-900/20 active:scale-95 whitespace-nowrap w-full sm:w-auto"
                          >
                            Apply for Admission
                          </button>
                          <div className="flex -space-x-2 sm:-space-x-3">
                             {[1,2,3,4].map(i => (
                                <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[8px] font-bold">
                                   UNI
                                </div>
                             ))}
                             <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[8px] font-bold">
                                +8
                             </div>
                          </div>
                       </div>
                    )}

                    <div className={`mt-4 sm:mt-5 md:mt-6 lg:mt-8 flex items-center justify-between border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} pt-4 sm:pt-5 md:pt-6`}>
                       {feature.metrics.map((metric, mIdx) => (
                         <div key={mIdx} className="text-center px-1">
                            <p className={`text-xs sm:text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'} leading-none`}>
                              {metric.split(' ')[0]}
                            </p>
                            <p className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'} font-bold uppercase tracking-tighter line-clamp-1 sm:line-clamp-none`}>
                              {metric.split(' ').slice(1).join(' ')}
                            </p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModernSchoolLayout;