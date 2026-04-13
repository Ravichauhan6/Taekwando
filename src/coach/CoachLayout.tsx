import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Shield, Users, Trophy, LogOut, ChevronRight, Bell } from 'lucide-react';

export const CoachLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const coachName = localStorage.getItem('coachName');

  const handleLogout = () => {
    localStorage.removeItem('coachToken');
    localStorage.removeItem('coachName');
    navigate('/coach/login');
  };

  const menuItems = [
    { name: 'STUDENT ROSTER', icon: <Users size={18} />, path: '/coach/dashboard' },
    { name: 'TOURNAMENTS', icon: <Trophy size={18} />, path: '/coach/tournaments' },
    { name: 'NOTIFICATIONS', icon: <Bell size={18} />, path: '/coach/notifications' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-red-500/30">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Brand Area */}
        <div className="p-8 border-b border-[#1a1a1a] flex items-center gap-4 bg-gradient-to-b from-[#111] to-transparent">
          <div className="relative">
             <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 rounded-full"></div>
             <div className="w-12 h-12 bg-gradient-to-br from-[#ff0000] to-[#8b0000] rounded-xl flex items-center justify-center border border-[#ff4d4d]/30 shadow-[0_0_15px_rgba(255,0,0,0.4)] relative z-10">
               <Shield className="w-6 h-6 text-white" />
             </div>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
             <span className="text-[10px] sm:text-[11px] font-black uppercase text-white leading-snug drop-shadow-md break-words">
                 MAHARAJGANJ DISTRICT TAEKWONDO ASSOCIATION (Regd)
             </span>
             <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff1a1a] uppercase mt-1 leading-none truncate w-full">Coach Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-[12px] tracking-[0.1em] group relative overflow-hidden ${
                  isActive 
                  ? 'bg-gradient-to-r from-[#ff0000]/10 to-transparent text-white border border-[#ff0000]/30 shadow-[inset_0_0_20px_rgba(255,0,0,0.05)]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff0000] shadow-[0_0_10px_#ff0000]"></div>}
                
                <span className={`transition-colors duration-300 ${isActive ? 'text-[#ff1a1a]' : 'group-hover:text-gray-300'}`}>
                  {item.icon}
                </span>
                {item.name}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-red-500 opacity-50" />}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="p-6 border-t border-[#1a1a1a] bg-[#0a0a0a] space-y-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#111] hover:bg-[#1a1a1a] text-gray-300 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-colors border border-white/5"
          >
            RETURN TO WEBSITE
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/20 hover:bg-[#ff0000] text-red-500 hover:text-white rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border border-red-900/30 hover:border-[#ff0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] group"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform"/> LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#050505] relative overflow-hidden">
         {/* Top Header */}
         <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1a1a1a] flex items-center px-10 relative z-10 sticky top-0">
             <h1 className="text-[16px] font-black tracking-widest text-white uppercase opacity-90 drop-shadow-sm">
                 {menuItems.find(m => location.pathname.includes(m.path))?.name || 'Dashboard'}
             </h1>
         </header>

         {/* Content Wrapper */}
         <div className="flex-1 overflow-auto bg-[#000000] p-6 lg:p-10 relative z-0 hide-scrollbar pt-8">
            <Outlet />
         </div>
      </main>
    </div>
  );
};
