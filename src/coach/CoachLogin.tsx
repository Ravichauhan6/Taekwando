import React, { useState } from 'react';
import { Shield, Lock, Mail, ChevronRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const CoachLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/coach/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('coachToken', data.token);
        localStorage.setItem('coachName', data.name);
        navigate('/coach/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] border-t-red-500/30">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10 mb-4 group/logo overflow-hidden">
               <img src="/logo.png" alt="MDTA Logo" className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform" />
            </Link>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">Coach Portal</h2>
            <p className="text-gray-400 text-sm font-medium mt-1 tracking-wide">Manage your dojo and students</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <p className="text-red-400 text-sm font-bold tracking-wide">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-medium text-[15px]"
                  placeholder="coach@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-medium text-[15px]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:from-red-500 hover:to-red-800 transition-all shadow-[0_0_20px_rgba(255,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-4 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Secure Login 
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs font-medium content-center">If you haven't received yours, default is <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">coach123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
