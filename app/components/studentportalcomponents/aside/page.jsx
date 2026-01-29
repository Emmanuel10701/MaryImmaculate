'use client';

import { 
  FiHome, 
  FiBarChart2, 
  FiFolder, 
  FiMessageSquare, 
  FiLogOut,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';
import Image from 'next/image';

export default function NavigationSidebar({ 
  student, 
  onLogout, 
  currentView, 
  setCurrentView,
  onRefresh,
  onMenuClose
}) {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: <FiHome /> },
    { id: 'results', label: 'Academic Results', icon: <FiBarChart2 /> },
    { id: 'resources', label: 'Resources & Assignments', icon: <FiFolder /> },
    { id: 'guidance', label: 'Guidance & Events', icon: <FiMessageSquare /> },
  ];

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'ST';
  };

  return (
<aside className="fixed lg:relative inset-y-0 left-0 z-50  bg-white border-r border-gray-200 w-full max-w-[300px] lg:max-w-[280px] xl:max-w-[300px] flex flex-col">
      <div className=" flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo - Using image like Admin sidebar */}
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <img 
                    src="/katz.png" 
                    alt="School Logo" 
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900 text-base sm:text-lg lg:text-xl truncate">
                  Student Portal
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm truncate">Katwanyaa High</p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={onMenuClose}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <FiX size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Student Profile */}
        <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">
                {getInitials(student?.fullName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate">
                {student?.fullName || 'Student Name'}
              </h3>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap">
                  {student?.form} {student?.stream}
                </span>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-1.5 sm:mt-2 truncate">
                {student?.admissionNumber || 'ADM-0000'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto">
          <div className="space-y-2 sm:space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl transition-all duration-200 ${
                  currentView === item.id 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-4 border-blue-600 shadow-lg shadow-blue-500/10 backdrop-blur-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`text-lg sm:text-xl ${
                  currentView === item.id 
                    ? 'text-blue-600' 
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {item.icon}
                </span>
                <span className={`font-semibold text-left text-sm sm:text-base ${
                  currentView === item.id 
                    ? 'text-blue-700' 
                    : 'text-gray-800 group-hover:text-gray-900'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

        </nav>
               <div className="p-3 sm:p-4 lg:p-6 mb-[12%] bg-white/50 backdrop-blur-sm border-t border-gray-100">
          <div className="flex flex-row items-center gap-2 sm:gap-3 w-full">
            
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="group flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 
              bg-white border border-blue-100 text-blue-600 rounded-xl sm:rounded-2xl 
              text-xs sm:text-sm font-bold tracking-tight shadow-[0_4px_12px_rgba(59,130,246,0.08)] 
              active:bg-blue-50 active:shadow-none transition-all duration-200 min-w-0"
            >
              <FiRefreshCw className="text-sm sm:text-lg" />
              <span className="truncate">Refresh</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 
              bg-rose-50/50 border border-rose-100 text-rose-600 rounded-xl sm:rounded-2xl 
              text-xs sm:text-sm font-bold tracking-tight shadow-[0_4px_12px_rgba(225,29,72,0.08)] 
              active:bg-rose-100 active:shadow-none transition-all duration-200 min-w-0"
            >
              <FiLogOut className="text-sm sm:text-lg" />
              <span className="truncate">Logout</span>
            </button>
            
          </div>
        </div>
   
      </div>
    </aside>
  );
}