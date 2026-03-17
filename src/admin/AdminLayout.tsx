import React from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Settings, LogOut, Download, Target } from 'lucide-react';
import { isAuthenticated, removeToken } from './auth';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    removeToken();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Players', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/categories', label: 'Weight Categories', icon: <Settings className="w-5 h-5" /> },
    { path: '/admin/tiesheets', label: 'Draws & Brackets', icon: <Target className="w-5 h-5" /> },
    { path: '/admin/reports', label: 'Export Reports', icon: <Download className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            MDTA Admin
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
             </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
