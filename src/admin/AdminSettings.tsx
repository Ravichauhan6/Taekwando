import React, { useState } from 'react';
import { Shield, Key, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      
      setSuccess('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2 flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">
          <Shield className="w-6 h-6 text-red-600" />
          Security <span className="text-red-600">Settings</span>
        </h2>
        <p className="text-gray-400 font-medium">Update your dashboard admin password securely.</p>
      </div>

      <div className="bg-[#111] p-8 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.1)] border border-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] pointer-events-none rounded-full"></div>

        <h3 className="text-xl font-black text-white tracking-widest uppercase mb-6 flex items-center gap-3 relative z-10">
          <Shield className="w-5 h-5 text-red-500" />
          Change Password
        </h3>

        {error && (
          <div className="mb-6 relative z-10 bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl text-xs font-bold uppercase tracking-wide flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 relative z-10 bg-green-500/10 text-green-500 border border-green-500/20 p-4 rounded-xl text-xs font-bold uppercase tracking-wide flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5 relative z-10">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Current Password</label>
            <input 
              type="password" 
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">New Password</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm New Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full bg-[#0a0a0a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm transition-all placeholder-gray-700"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_4px_20px_rgba(255,0,0,0.4)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            <Key className="w-4 h-4" />
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
