import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const PortalLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'portaladmin' && password === 'portal@123') {
      localStorage.setItem('portal_token', 'true');
      navigate('/portal-admin');
    } else {
      setError('Invalid Portal Admin credentials. Try portaladmin / portal@123');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-red-500/30">
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.15)] border border-red-500/20 w-full max-w-md relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-[40px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-[40px] pointer-events-none"></div>

        <div className="text-center mb-6 relative z-10">
           <Link to="/" className="inline-flex mb-4 group/logo">
             <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10 group-hover/logo:scale-110 transition-transform overflow-hidden">
               <img src="/logo.png" alt="MDTA Logo" className="w-full h-full object-contain" />
             </div>
           </Link>
           <h2 className="text-[28px] font-black text-white tracking-widest uppercase mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Portal Admin</h2>
           <p className="text-gray-400 text-sm font-medium">Sign in to manage portal content & forms</p>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-[13px] font-bold text-center animate-in fade-in slide-in-from-top-2">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Username</label>
            <input 
              type="text" 
              className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white transition-all text-sm font-medium shadow-inner"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="portaladmin"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white transition-all text-sm font-medium shadow-inner"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#ff0000] to-[#990000] hover:from-[#ff1a1a] hover:to-[#cc0000] text-white font-black py-4 rounded-xl text-[13px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all transform active:scale-[0.98] border border-red-500/50"
            >
              Access Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
