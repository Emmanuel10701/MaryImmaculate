// Modern Loading Screen with Enhanced Design
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 z-50 flex flex-col items-center justify-center">
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
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Animated Rings */}
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
          <div className="absolute inset-4 border-4 border-amber-500/30 rounded-full animate-ping"></div>
          <div className="absolute inset-8 border-4 border-white/40 rounded-full animate-spin"></div>
          
          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
              <img 
                src="/ll.png" 
                alt="Mary Immaculate Girls Secondary Logo" 
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>
        </div>
        
        {/* Loading Content */}
        <div className="text-center space-y-6">
          {/* School Name with Gradient */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Mary Immaculate Girls Secondary School
            </h2>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-4">
            <p className="text-white/80 text-lg">Preparing an exceptional learning experience</p>
            
            {/* Animated Dots */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient-loading"></div>
            </div>
            
            <p className="text-white/60 text-sm">Loading your portal...</p>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
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