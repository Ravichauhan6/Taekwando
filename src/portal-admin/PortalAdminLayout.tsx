import React from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Users, Newspaper, Bell, LogOut, Shield, Award, Building, Building2, Image as ImageIcon, FileText, Settings, Trophy, MapPin, Quote } from 'lucide-react';

export const PortalAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!localStorage.getItem('portal_token')) {
    return <Navigate to="/portal-admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('portal_token');
    navigate('/portal-admin/login');
  };

  const menuItems = [
    { path: '/portal-admin', label: 'Registrations Data', icon: <Users className="w-5 h-5" /> },
    { path: '/portal-admin/belts', label: 'Belt Management', icon: <Award className="w-5 h-5" /> },
    { path: '/portal-admin/academy', label: 'Coach/Academy', icon: <Building className="w-5 h-5" /> },
    { path: '/portal-admin/training-centers', label: 'Training Centers', icon: <MapPin className="w-5 h-5" /> },
    { path: '/portal-admin/events', label: 'Event Creation', icon: <Trophy className="w-5 h-5" /> },
    { path: '/portal-admin/gallery', label: 'Media Gallery', icon: <ImageIcon className="w-5 h-5" /> },
    { path: '/portal-admin/documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
    { path: '/portal-admin/news', label: 'News Updates', icon: <Newspaper className="w-5 h-5" /> },
    { path: '/portal-admin/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { path: '/portal-admin/what-we-say', label: 'Leadership Messages', icon: <Quote className="w-5 h-5" /> },
    { path: '/portal-admin/referees', label: 'National Referees', icon: <Shield className="w-5 h-5" /> },
    { path: '/portal-admin/black-belts', label: 'Black Belt Holders', icon: <Award className="w-5 h-5" /> },
    { path: '/portal-admin/national-players', label: 'National Players', icon: <Trophy className="w-5 h-5" /> },
    { path: '/portal-admin/roles', label: 'User Roles', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-[#050505] font-sans text-gray-200 selection:bg-red-500/30">
      {/* Sidebar */}
      <aside className="w-72 bg-[#111] border-r border-white/5 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-20 relative">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="bg-white p-1 rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.4)] border border-red-500/30 shrink-0 group/logo overflow-hidden h-11 w-11 flex items-center justify-center">
              <img src="/logo.png" alt="MDTA" className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform" />
            </Link>
            <div className="flex flex-col">
               <h1 className="text-[10px] sm:text-[11px] font-black tracking-widest text-white leading-snug uppercase drop-shadow-md">
                 MAHARAJGANJ DISTRICT TAEKWONDO ASSOCIATION (Regd)
               </h1>
               <h2 className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-0.5">Portal Admin</h2>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/portal-admin' && item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all font-bold tracking-wide text-[13px] uppercase ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#ff0000]/20 to-transparent text-white border-l-[3px] border-[#ff0000] shadow-[inset_20px_0_30px_rgba(255,0,0,0.05)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent hover:border-white/10'
                }`}
              >
                <div className={`${isActive ? 'text-[#ff0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'text-gray-500 group-hover:text-gray-300'} transition-all`}>
                  {item.icon}
                </div>
                {item.label}
             </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-3">
          <Link 
            to="/"
            className="flex items-center justify-center gap-3 px-4 py-3.5 w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-all font-bold text-[13px] uppercase tracking-wide border border-white/5 hover:border-white/20"
          >
            <Globe className="w-4 h-4" />
            Return to Website
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 px-4 py-3.5 w-full bg-[#ff0000]/10 hover:bg-[#ff0000]/20 text-[#ff0000] hover:text-[#ff1a1a] rounded-xl transition-all font-bold text-[13px] uppercase tracking-wide border border-[#ff0000]/20 hover:border-[#ff0000]/50 shadow-[0_0_15px_rgba(255,0,0,0.1)] hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]"
          >
            <LogOut className="w-4 h-4" />
            Logout Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0a0a0a] p-8 md:p-12 relative z-10 w-full">
        {/* Decorative Background Blur */}
        <div className="fixed top-[-50px] right-[-50px] w-[500px] h-[500px] bg-[#ff0000]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-[-100px] left-[250px] w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <Outlet />
      </main>
    </div>
  );
};
