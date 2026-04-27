import React, { useState } from 'react';
import { Shield, ArrowRight, ArrowLeft, Mail, KeyRound, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Step type: 'login' | 'enter-email' | 'enter-otp' | 'new-password'
type Step = 'login' | 'enter-email' | 'enter-otp' | 'new-password';

export const PlayerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<Step>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const inputClass = "w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-600";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2";

  // ---- LOGIN ----
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/players/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid email or password.'); setLoading(false); return; }
      localStorage.setItem('current_player', JSON.stringify(data.player));
      navigate('/player/dashboard');
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  // ---- STEP 1: Send OTP ----
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!email) { setError('Please enter your registered email.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/players/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to send OTP.'); setLoading(false); return; }
      setSuccess('OTP sent! Check your email inbox.');
      setStep('enter-otp');
      // Start 60s resend timer
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
      }, 1000);
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  // ---- STEP 2: Verify OTP ----
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (otp.length !== 6) { setError('Please enter the 6-digit OTP.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/players/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), otp })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Incorrect OTP.'); setLoading(false); return; }
      setSuccess('OTP verified! Set your new password.');
      setStep('new-password');
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  // ---- STEP 3: Reset Password ----
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/players/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), newPassword })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Password reset failed.'); setLoading(false); return; }
      setSuccess('Password reset successfully! Please log in.');
      setStep('login');
      setOtp(''); setNewPassword(''); setConfirmPassword('');
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  const resetToLogin = () => {
    setStep('login'); setError(''); setSuccess('');
    setOtp(''); setNewPassword(''); setConfirmPassword('');
  };

  const stepTitles: Record<Step, string> = {
    'login': 'Player Login',
    'enter-email': 'Forgot Password',
    'enter-otp': 'Verify OTP',
    'new-password': 'New Password',
  };

  const stepSubtitles: Record<Step, string> = {
    'login': 'Access your MDTA Dashboard and ID Card',
    'enter-email': 'Enter your registered email to receive OTP',
    'enter-otp': `OTP sent to ${email}`,
    'new-password': 'Create your new password',
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-red-500/30">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.1)] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>

        {/* Header */}
        <div className="px-8 pt-10 pb-8 text-center relative z-10">
          <Link to="/" className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] group/logo overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1.5 group-hover/logo:scale-110 transition-transform" />
          </Link>
          <h2 className="text-[28px] font-black text-white tracking-widest uppercase mb-2">{stepTitles[step]}</h2>
          <p className="text-gray-400 font-medium text-sm">{stepSubtitles[step]}</p>

          {/* OTP Step Indicator */}
          {step !== 'login' && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {(['enter-email', 'enter-otp', 'new-password'] as Step[]).map((s, i) => (
                <React.Fragment key={s}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    s === step ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' :
                    (['enter-otp', 'new-password'].indexOf(s) <= ['enter-email', 'enter-otp', 'new-password'].indexOf(step))
                      ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-500'
                  }`}>{i + 1}</div>
                  {i < 2 && <div className={`h-[1px] w-8 ${['enter-otp', 'new-password'].indexOf(s) < ['enter-email', 'enter-otp', 'new-password'].indexOf(step) ? 'bg-green-600' : 'bg-white/10'}`}></div>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 pb-10 space-y-5 relative z-10">
          {/* Error / Success */}
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold text-center">{error}</div>}
          {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm font-bold text-center">{success}</div>}

          {/* ===== LOGIN STEP ===== */}
          {step === 'login' && (
            <>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="Enter your email" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass}>Password</label>
                  <button type="button" onClick={() => { setStep('enter-email'); setError(''); setSuccess(''); }} className="text-[10px] font-bold text-[#3b82f6] hover:text-[#2563eb] transition-colors uppercase tracking-widest">
                    Forgot Password?
                  </button>
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
              </div>
              <button type="button" onClick={handleLogin} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(255,0,0,0.4)]">
                {loading ? 'Signing In...' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </>
          )}

          {/* ===== STEP 1: Enter Email ===== */}
          {step === 'enter-email' && (
            <>
              <div>
                <label className={labelClass}>Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`${inputClass} pl-10`} placeholder="Enter your registered email" />
                </div>
              </div>
              <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)]">
                {loading ? 'Sending OTP...' : <><Mail className="w-4 h-4" /><span>Send OTP to Email</span></>}
              </button>
              <button type="button" onClick={resetToLogin} className="w-full flex items-center justify-center gap-2 bg-[#111] border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </>
          )}

          {/* ===== STEP 2: Enter OTP ===== */}
          {step === 'enter-otp' && (
            <>
              <div>
                <label className={labelClass}>Enter 6-Digit OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`${inputClass} pl-10 text-center text-2xl font-black tracking-[0.5em]`}
                    placeholder="------"
                    maxLength={6}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600 text-[11px]">Check your email inbox / spam</span>
                  {resendTimer > 0 ? (
                    <span className="text-gray-500 text-[11px] font-bold">Resend in {resendTimer}s</span>
                  ) : (
                    <button type="button" onClick={handleSendOtp} className="text-[11px] font-bold text-[#3b82f6] hover:text-blue-400 transition-colors">Resend OTP</button>
                  )}
                </div>
              </div>
              <button type="button" onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)]">
                {loading ? 'Verifying...' : <><KeyRound className="w-4 h-4" /><span>Verify OTP</span></>}
              </button>
              <button type="button" onClick={() => setStep('enter-email')} className="w-full flex items-center justify-center gap-2 bg-[#111] border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </>
          )}

          {/* ===== STEP 3: New Password ===== */}
          {step === 'new-password' && (
            <>
              <div>
                <label className={labelClass}>New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`${inputClass} pl-10`} placeholder="Create new password (min 6 chars)" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`${inputClass} pl-10`} placeholder="Re-enter new password" />
                </div>
              </div>
              <button type="button" onClick={handleResetPassword} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.4)]">
                {loading ? 'Resetting...' : <><Lock className="w-4 h-4" /><span>Reset Password</span></>}
              </button>
            </>
          )}
        </div>

        <div className="border-t border-white/5 p-6 bg-[#111] text-center flex flex-col gap-3">
          <Link to="/" className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};
