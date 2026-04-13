import React, { useState, useEffect } from 'react';
import { Bell, Clock, ChevronRight, Shield } from 'lucide-react';

export const CoachNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        // Filter for "All" or "Coaches"
        const filtered = data.filter((n: any) => n.audience === 'All' || n.audience === 'Coaches');
        setNotifications(filtered.reverse());
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20">
          <Bell className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest uppercase">Admin Broadcasts</h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Messages from Maharajganj District Taekwondo Association</p>
        </div>
      </div>

      <div className="grid gap-4">
        {notifications.map((n: any) => (
          <div key={n._id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-red-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[50px] pointer-events-none"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="flex gap-5">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors uppercase tracking-wide">{n.title}</h3>
                  <p className="text-gray-400 mt-2 leading-relaxed text-sm font-medium">{n.message}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md">
                      <Clock className="w-3 h-3" /> Recent
                    </span>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-500/20 px-2.5 py-1 rounded-md">
                      Official
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-all group-hover:translate-x-1" />
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-20 bg-[#0a0a0a] border border-white/5 border-dashed rounded-3xl">
            <Bell className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">No notifications available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};
