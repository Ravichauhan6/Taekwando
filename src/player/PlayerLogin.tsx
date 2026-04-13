import React, { useState } from 'react';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const PlayerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const savedRegs = localStorage.getItem('portal_registrations');
    if (!savedRegs) {
      setError('No registered users found.');
      return;
    }

    const users = JSON.parse(savedRegs);
    const user = users.find((u: any) => 
      u.email?.toLowerCase().trim() === email.toLowerCase().trim() && 
      u.password === password
    );

    if (user) {
      localStorage.setItem('current_player', JSON.stringify(user));
      navigate('/player/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const savedRegs = localStorage.getItem('portal_registrations');
    if (!savedRegs) {
      setError('No registered users found.');
      return;
    }

    const users = JSON.parse(savedRegs);
    const userIndex = users.findIndex((u: any) => 
      u.email?.toLowerCase().trim() === email.toLowerCase().trim() && 
      u.aadhar === aadhar
    );

    if (userIndex !== -1) {
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      users[userIndex].password = newPassword;
      localStorage.setItem('portal_registrations', JSON.stringify(users));
      setSuccess('Password reset successfully! Please log in.');
      setIsForgotPassword(false);
      setPassword('');
      setAadhar('');
      setNewPassword('');
    } else {
      setError('No account found with this Email and Aadhar combination.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-red-500/30">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.1)] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
        <div className="px-8 pt-10 pb-8 text-center relative z-10">
          <Link to="/" className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] group/logo overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1.5 group-hover/logo:scale-110 transition-transform" />
          </Link>
          <h2 className="text-[28px] font-black text-white tracking-widest uppercase mb-2">Player Login</h2>
          <p className="text-gray-400 font-medium text-sm">Access your MDTA Dashboard and ID Card</p>
        </div>

        <form onSubmit={handleLogin} className="px-8 pb-10 space-y-6 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-bold text-center animate-pulse">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl text-sm font-bold text-center">
              {success}
            </div>
          )}

          {!isForgotPassword ? (
            <>
              {/* Login Fields */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-600"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setIsForgotPassword(true); setError(''); setSuccess(''); }} 
                    className="text-[10px] font-bold text-[#3b82f6] hover:text-[#2563eb] transition-colors uppercase tracking-widest"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="button" 
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(255,0,0,0.4)]"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {/* Forgot Password Fields */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Registered Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-600"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Aadhar Number</label>
                <input 
                  type="text" 
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-600"
                  placeholder="Enter 12 digit Aadhar as security check"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-600"
                  placeholder="Create new password"
                  required
                />
              </div>

              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)]"
              >
                Reset Password <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                type="button" 
                onClick={() => { setIsForgotPassword(false); setError(''); setSuccess(''); }} 
                className="w-full flex items-center justify-center gap-2 bg-[#111] border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </>
          )}
        </form>
        
        <div className="border-t border-white/5 p-6 bg-[#111] text-center flex flex-col gap-3">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};
