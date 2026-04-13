import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, X, ShieldAlert, LogIn, Activity, Users, User } from 'lucide-react';

export const Notifications = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', targetType: 'All', recipientId: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    try {
      const res = await fetch('/api/notifications');
      setItems(await res.json());
    } catch (e) {
      console.log(e);
    }
  };
  
  const handleAdd = async () => {
    if(!formData.title || !formData.message) return;
    const audienceStr = formData.targetType === 'Specific' ? formData.recipientId : formData.targetType;
    await fetch('/api/notifications', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...formData, audience: audienceStr}) });
    setIsModalOpen(false);
    setFormData({ title: '', message: '', targetType: 'All', recipientId: '' });
    fetchItems();
  };
  
  const handleDelete = async (id: string) => {
    if(window.confirm("Delete this notification?")) { await fetch('/api/notifications/'+id, { method: 'DELETE' }); fetchItems(); }
  };

  const systemAlerts = [
    { id: '1', title: 'Admin Login Detected', message: 'User "admin" logged into the dashboard.', time: '2 mins ago', icon: ShieldAlert, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { id: '2', title: 'Player Login', message: 'Siddharth Sharma accessed Player Portal.', time: '15 mins ago', icon: LogIn, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { id: '3', title: 'Portal Accessed', message: 'Role "portal_admin" initiated new session.', time: '1 hour ago', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">NOTIFICATIONS & LOGS</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Broadcast announcements and monitor system activity</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2"><Plus className="w-4 h-4"/> New Broadcast</button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] rounded-2xl border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
          <div className="p-4 border-b border-white/5 bg-white/5"><h3 className="text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2">Broadcasted Messages</h3></div>
          <div className="flex-1 overflow-auto custom-scrollbar p-5 space-y-4">
            {items.map((n: any) => (
              <div key={n._id} className="bg-black/40 p-5 border border-white/5 rounded-2xl flex justify-between items-start shadow-inner group hover:border-red-500/30 hover:bg-white/5 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20 shrink-0"><Bell className="w-5 h-5 text-red-500"/></div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-bold text-lg">{n.title}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        n.audience === 'All' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        n.audience === 'Coaches' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {n.audience === 'All' ? 'Public' : n.audience === 'Coaches' ? 'All Coaches' : 'Personal ID: ' + n.audience}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">{n.message}</p>
                  </div>
                </div>
                <button onClick={()=>handleDelete(n._id)} className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-all shrink-0"><Trash2 className="w-5 h-5"/></button>
              </div>
            ))}
            {items.length === 0 && <div className="text-center p-12 text-gray-500 bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center gap-2"><Bell className="w-8 h-8 opacity-20"/> No active broadcasts</div>}
          </div>
        </div>

        <div className="bg-[#111] rounded-2xl border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
          <div className="p-4 border-b border-white/5 bg-white/5"><h3 className="text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2">System Login Activity</h3></div>
          <div className="flex-1 overflow-auto custom-scrollbar p-5 space-y-4">
            {systemAlerts.map(alert => (
              <div key={alert.id} className="bg-black/40 p-5 border border-white/5 rounded-2xl flex items-start gap-4 shadow-inner hover:bg-white/5 transition-all">
                <div className={`p-3 rounded-full border shrink-0 ${alert.bg}`}><alert.icon className={`w-5 h-5 ${alert.color}`}/></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start w-full">
                    <h3 className="text-white font-bold text-[15px]">{alert.title}</h3>
                    <span className="text-xs font-bold text-gray-500 uppercase">{alert.time}</span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium mt-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">SEND NOTIFICATION</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              
              <div className="flex gap-4 p-1 bg-black/40 rounded-xl border border-white/10 flex-wrap sm:flex-nowrap">
                <button type="button" onClick={() => setFormData({...formData, targetType: 'All'})} className={`flex-1 flex items-center gap-2 justify-center py-2.5 px-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all ${formData.targetType === 'All' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                  <Users className="w-4 h-4"/> All
                </button>
                <button type="button" onClick={() => setFormData({...formData, targetType: 'Coaches'})} className={`flex-1 flex items-center gap-2 justify-center py-2.5 px-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all ${formData.targetType === 'Coaches' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                  <ShieldAlert className="w-4 h-4"/> Coaches
                </button>
                <button type="button" onClick={() => setFormData({...formData, targetType: 'Specific'})} className={`flex-1 flex items-center gap-2 justify-center py-2.5 px-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all ${formData.targetType === 'Specific' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                  <User className="w-4 h-4"/> Specific
                </button>
              </div>

              {formData.targetType === 'Specific' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><User className="w-3 h-3"/> Recipient ID / Aadhar</label>
                  <input type="text" value={formData.recipientId} onChange={(e)=>setFormData({...formData, recipientId: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. 123456789012 or Coach ID"/>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject Title</label>
                <input type="text" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="e.g. Server Maintenance or ID Card Approved"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message Description</label>
                <textarea rows={4} value={formData.message} onChange={(e)=>setFormData({...formData, message: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium resize-none" placeholder="Enter full notification details..."></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};