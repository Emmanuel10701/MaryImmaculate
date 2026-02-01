'use client'
import React from 'react';
import { 
  Shield, 
  Plus, 
  RotateCw, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  Smile,
  RefreshCw
} from 'lucide-react';

const PortalHeader = ({ stats = { today: 45 }, refreshing = false, fetchEvents = () => {}, handleNewEvent = () => {} }) => {
  
  // Function to refresh the page
  const handleRefresh = () => {
    if (refreshing) return;
    fetchEvents(true); // Trigger data refresh
    window.location.reload(); // Also refresh the page
  };

  return (
    <div className="w-full font-sans">
      {/* Main Header Container - Updated to orange gradient */}
      <div className="relative overflow-hidden 
        bg-gradient-to-br from-amber-900 via-orange-900 to-red-800 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl">
        
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-[0.08] sm:opacity-[0.1] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.15)_1px,_transparent_0)] 
            bg-[size:20px_20px] sm:bg-[size:24px_24px] md:bg-[size:28px_28px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 to-red-400/5" />
        </div>
        
        {/* Glow Effects - Updated colors to match orange theme */}
        <div className="absolute -right-6 -top-6 xs:-right-8 xs:-top-8 sm:-right-10 sm:-top-10 
          md:-right-12 md:-top-12 lg:-right-16 lg:-top-16 
          w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 
          bg-gradient-to-r from-amber-300 to-orange-400 rounded-full opacity-20 sm:opacity-25 blur-xl sm:blur-2xl md:blur-3xl animate-pulse" />
        
        <div className="absolute -left-8 -bottom-8 xs:-left-10 xs:-bottom-10 sm:-left-12 sm:-bottom-12 
          w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 
          bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-15 sm:opacity-20 blur-lg sm:blur-xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-2 xs:px-3 sm:px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 xs:gap-5 sm:gap-6 md:gap-8">
            
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-row items-start gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-5">
                {/* Icon Container */}
                <div className="relative shrink-0 mt-0.5 xs:mt-0">
                  <div className="absolute inset-0 bg-amber-300 rounded-lg xs:rounded-xl blur-sm xs:blur-md opacity-60 xs:opacity-70" />
                  <div className="relative p-2 xs:p-2.5 sm:p-3 bg-gradient-to-br from-amber-400 to-orange-500 
                    rounded-lg xs:rounded-xl shadow-xl xs:shadow-2xl border border-white/20">
                    <GraduationCap className="text-white w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 xs:px-2.5 xs:py-1 
                    bg-white/15 backdrop-blur-md xs:backdrop-blur-lg rounded-full mb-2 xs:mb-3 border border-white/20">
                    <Shield className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-amber-200" />
                    <span className="text-[9px] xs:text-[10px] font-black text-white uppercase tracking-widest">
                      Official Admissions Portal
                    </span>
                  </div>
                  
                  {/* Main Title - Increased font sizes */}
                  <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                    font-black text-white tracking-tight leading-tight xs:leading-none">
                    Mary Immaculate <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-100">
                      Girls Secondary
                    </span>
                  </h1>
                  
                  {/* Subtitle - Increased font size */}
                  <p className="text-orange-100/90 mt-2 xs:mt-3 text-sm xs:text-base sm:text-lg font-medium max-w-2xl leading-relaxed">
                    Secure digital gateway for student applications and admission coordination. 
                    Excellence in girls' education since 1995.
                  </p>

                  {/* Motto Section */}
                  <div className="mt-3 xs:mt-4 animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 
                      bg-gradient-to-r from-orange-700/40 to-red-700/40 backdrop-blur-sm 
                      rounded-full border border-white/10">
                      <span className="text-xs xs:text-sm font-bold text-amber-200 tracking-wide">
                        ✨ Empowering Future Leaders
                      </span>
                    </div>
                  </div>

             {/* Social Proof Section */}
<div className="flex items-center gap-2 xs:gap-3 mt-4 xs:mt-5 animate-in fade-in slide-in-from-left-4 duration-700">
  {/* Avatar Group */}
  <div className="flex -space-x-2 xs:-space-x-2.5 sm:-space-x-3">
    {[1, 2, 3, 4, 5].map((num) => (
      <div 
        key={num} 
        className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 
                   rounded-full border-2 border-orange-800 bg-slate-200
                   overflow-hidden shadow-lg transform hover:-translate-y-1 
                   transition-transform cursor-pointer relative z-[10]"
      >
        <img 
          src={`demo/${num}.jpg`} 
          alt={`Student ${num}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
    
    {/* The Counter Badge */}
    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 
                    rounded-full border-2 border-orange-800 bg-white/25 backdrop-blur-sm 
                    flex items-center justify-center text-[10px] xs:text-xs font-black text-white z-[11]">
      500+
    </div>
  </div>
  
  {/* Social Proof Text */}
  <div className="flex flex-col min-w-0">
    <div className="flex items-center gap-1 xs:gap-1.5">
      <span className="text-[11px] xs:text-sm font-black text-white tracking-tight truncate uppercase">
        Join 500+ Successful students
      </span>
      <TrendingUp size={12} className="xs:size-4 text-emerald-400 flex-shrink-0" />
    </div>
    <p className="text-[8px] xs:text-[9px] font-bold text-amber-200/70 uppercase tracking-widest truncate leading-none mt-0.5">
      Your Journey Starts Here
    </p>
  </div>
</div>
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 xs:gap-4 self-stretch">
              {/* Stats Card */}
              <div className="bg-black/25 backdrop-blur-lg px-4 py-2 xs:px-5 xs:py-2.5 sm:px-6 sm:py-3
                rounded-xl xs:rounded-2xl border border-white/10 flex items-center gap-3 xs:gap-4 flex-shrink-0
                hover:bg-black/30 transition-colors duration-300">
                <div className="flex flex-col">
                  <span className="text-[8px] xs:text-[9px] font-black text-amber-200/80 uppercase tracking-widest">
                    Applications Today
                  </span>
                  <span className="text-xl xs:text-2xl sm:text-3xl font-black text-white">{stats.today || 0}</span>
                </div>
                <div className="h-6 xs:h-8 w-px bg-white/15" />
                <Sparkles size={14} className="xs:size-4 sm:size-5 text-amber-400 animate-pulse" />
              </div>

              {/* Action Buttons - Enhanced refresh functionality */}
              <div className="flex gap-2 xs:gap-3">
                {/* Refresh/Sync Button */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="group p-2 xs:p-2.5 sm:p-3 bg-white/15 rounded-xl text-white 
                    hover:bg-white/25 transition-all duration-300 border border-white/15 
                    flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed
                    hover:shadow-lg hover:scale-105 active:scale-95"
                  title="Refresh Portal"
                >
                  <div className="relative">
                    <RefreshCw size={16} className="xs:size-5 sm:size-6"
                      style={refreshing ? { 
                        animation: 'spin 1s linear infinite',
                        transformOrigin: 'center'
                      } : {}} />
                    {refreshing && (
                      <div className="absolute -inset-1 rounded-full border-2 border-amber-400/30 animate-ping" />
                    )}
                  </div>
                </button>
                
                {/* Apply Button */}
                <button
                  onClick={handleNewEvent}
                  className="group flex items-center gap-2 xs:gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white 
                    px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 
                    rounded-xl xs:rounded-2xl font-bold text-xs xs:text-sm sm:text-base
                    hover:shadow-xl hover:scale-105 transition-all duration-300 
                    whitespace-nowrap flex-shrink-0
                    hover:from-amber-600 hover:to-orange-700
                    active:scale-95"
                >
                  <Plus size={14} className="xs:size-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden xs:inline">START APPLICATION</span>
                  <span className="xs:hidden">APPLY NOW</span>
                  <ArrowRight size={14} className="xs:size-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Refresh Animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PortalHeader;