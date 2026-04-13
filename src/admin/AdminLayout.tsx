import React from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Settings, LogOut, Download, Target, Home } from 'lucide-react';
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
    <div className="flex h-screen bg-[#050505] font-sans print:h-auto print:block print:bg-white print:overflow-visible selection:bg-red-500/30 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 text-white flex flex-col justify-between print:hidden">
        <div>
          <div className="p-8">
            <h1 className="flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">
              <Link to="/" className="bg-white p-1 rounded-xl border border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.3)] shrink-0 group/logo overflow-hidden h-11 w-11 flex items-center justify-center">
                <img src="/logo.png" alt="MDTA" className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform" />
              </Link>
              <div className="flex flex-col leading-none justify-center">
                <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-white mb-1 leading-snug drop-shadow-md break-words max-w-[160px]">
                  MAHARAJGANJ DISTRICT TAEKWONDO ASSOCIATION (Regd)
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-red-500 mt-1">
                  Dashboard Admin
                </span>
              </div>
            </h1>
          </div>
          
          <nav className="px-6 space-y-3 mt-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all font-bold text-[12px] uppercase tracking-widest ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-600 to-red-900 text-white shadow-[0_4px_15px_rgba(255,0,0,0.3)] border border-red-500/50' 
                      : 'text-gray-500 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  {item.icon}
                  {item.label}
               </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5 bg-[#111] space-y-3">
          <Link 
            to="/"
            className="flex w-full items-center justify-center gap-3 px-5 py-3.5 text-gray-400 hover:bg-white/5 hover:border-white/10 hover:text-white border border-white/5 rounded-xl transition-all font-bold text-[12px] uppercase tracking-widest shadow-inner group"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 px-5 py-3.5 text-gray-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 border border-white/5 rounded-xl transition-all font-bold text-[12px] uppercase tracking-widest shadow-inner group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 lg:p-12 print:p-0 print:overflow-visible print:block bg-gradient-to-br from-[#050505] to-[#0a0a0a]">
        <Outlet />
      </main>
    </div>
  );
};
