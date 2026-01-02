// components/studentportalcomponents/aside/page.jsx
'use client';

import { 
  FiHome, 
  FiBarChart2, 
  FiFolder, 
  FiMessageSquare, 
  FiLogOut,
  FiX,
  FiUser,
  FiRefreshCw
} from 'react-icons/fi';

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
    { id: 'resources', label: 'Resources and assignments', icon: <FiFolder /> },
    { id: 'guidance', label: 'Guidance & Events', icon: <FiMessageSquare /> },
  ];

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'ST';
  };

  return (
    <aside className="h-full bg-white border-r border-gray-200 w-80 flex flex-col">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">NS</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-xl">Student Portal</h2>
                <p className="text-sm text-gray-500">Nyaribu Secondary</p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={onMenuClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close sidebar"
            >
              <FiX size={22} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Student Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {getInitials(student?.fullName)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">
                {student?.fullName || 'Student Name'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  Form {student?.form} {student?.stream}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {student?.admissionNumber || 'ADM-0000'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-lg ${
                  currentView === item.id 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                    : 'text-gray-700'
                }`}
              >
                <span className={`text-xl ${currentView === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                <span className={`font-semibold text-left ${currentView === item.id ? 'text-blue-700' : 'text-gray-800'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer Actions - Flex Mode */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={onRefresh}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-semibold"
            >
              <FiRefreshCw /> Refresh
            </button>
            <button
              onClick={onLogout}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 rounded-lg font-semibold"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}