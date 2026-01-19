"use client";

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 z-50 flex flex-col items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Loader */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg">
        {/* Animated Rings - Smaller on mobile (w-24), original on desktop (md:w-32) */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8">
          <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
          <div className="absolute inset-3 md:inset-4 border-4 border-amber-500/30 rounded-full animate-ping"></div>
          <div className="absolute inset-6 md:inset-8 border-4 border-white/40 rounded-full animate-spin"></div>
          
          {/* Center Logo - Scaled proportionally */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
              <img 
                src="/ll.png" 
                alt="Mary Immaculate Girls Secondary Logo" 
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>
        </div>
        
        {/* Loading Content */}
        <div className="text-center space-y-4 md:space-y-6 px-4">
          {/* School Name - text-xl on mobile, text-3xl on desktop */}
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
              Mary Immaculate Girls Secondary School
            </h2>
            <div className="h-1 w-32 md:w-48 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-4">
            <p className="text-white/80 text-base md:text-lg px-2">
              Preparing an exceptional learning experience
            </p>
            
            {/* Animated Dots */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            
            {/* Progress Bar - Shorter on mobile */}
            <div className="w-48 md:w-64 h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-loading"></div>
            </div>
            
            <p className="text-white/60 text-xs md:text-sm">Loading your portal...</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.3;
          }
        }
        
        @keyframes gradient-loading {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: 200px 0;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-gradient-loading {
          background-size: 200% 100%;
          animation: gradient-loading 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}