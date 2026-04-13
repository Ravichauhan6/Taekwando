const fs = require('fs');
const path = require('path');

const components = {
  'UserRoles.tsx': `import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, X } from 'lucide-react';

export const UserRoles = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      setUsers(await res.json());
    } catch(err) { console.error(err); }
  };

  const handleAddUser = async () => {
    if(!formData.username || !formData.password) return;
    try {
      await fetch('/api/admin/users', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) });
      setIsModalOpen(false);
      setFormData({ username: '', password: '' });
      fetchUsers();
    } catch(err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this admin user?")) {
      await fetch('/api/admin/users/'+id, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">USER ROLES</h2></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2"><UserPlus className="w-4 h-4"/> Add User</button>
      </div>
      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left">
          <thead><tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider"><th className="px-6 py-4">Username</th><th className="px-6 py-4 text-right">Delete</th></tr></thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-bold">{u.username}</td>
                <td className="px-6 py-4 text-right"><button onClick={()=>handleDelete(u._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button></td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-gray-500">No users found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">ADD NEW ADMIN</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
                <input type="text" value={formData.username} onChange={(e)=>setFormData({...formData, username: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="e.g. admin_xyz"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input type="password" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="••••••••"/>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleAddUser} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`,

  'Notifications.tsx': `import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, X } from 'lucide-react';

export const Notifications = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/notifications');
    setItems(await res.json());
  };
  
  const handleAdd = async () => {
    if(!formData.title || !formData.message) return;
    await fetch('/api/notifications', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...formData, audience: 'All'}) });
    setIsModalOpen(false);
    setFormData({ title: '', message: '' });
    fetchItems();
  };
  
  const handleDelete = async (id) => {
    if(window.confirm("Delete this notification?")) { await fetch('/api/notifications/'+id, { method: 'DELETE' }); fetchItems(); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">NOTIFICATIONS</h2></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2"><Plus className="w-4 h-4"/> New Broadcast</button>
      </div>
      <div className="grid gap-4">
        {items.map(n => (
          <div key={n._id} className="bg-[#111] p-5 border border-white/5 rounded-2xl flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.5)] group hover:border-red-500/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20"><Bell className="w-5 h-5 text-red-500"/></div>
              <div><h3 className="text-white font-bold text-lg mb-1">{n.title}</h3><p className="text-gray-400 text-sm font-medium">{n.message}</p></div>
            </div>
            <button onClick={()=>handleDelete(n._id)} className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-all"><Trash2 className="w-5 h-5"/></button>
          </div>
        ))}
        {items.length === 0 && <div className="text-center p-12 text-gray-500 bg-[#111] rounded-2xl border border-white/5">No active notifications</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">SEND NOTIFICATION</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject Title</label>
                <input type="text" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="e.g. Server Maintenance"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Broadcast Message</label>
                <textarea rows="4" value={formData.message} onChange={(e)=>setFormData({...formData, message: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium resize-none" placeholder="Enter full notification details..."></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">Broadcast</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`,

  'EventCreation.tsx': `import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, X, MapPin } from 'lucide-react';

export const EventCreation = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', location: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/events');
    setItems(await res.json());
  };
  
  const handleAdd = async () => {
    if(!formData.title || !formData.date || !formData.location) return;
    await fetch('/api/events', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) });
    setIsModalOpen(false);
    setFormData({ title: '', date: '', location: '' });
    fetchItems();
  };
  
  const handleDelete = async (id) => {
    if(window.confirm("Delete this event?")) { await fetch('/api/events/'+id, { method: 'DELETE' }); fetchItems(); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">EVENTS & CHAMPIONSHIPS</h2></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2"><Plus className="w-4 h-4"/> Schedule Event</button>
      </div>
      <div className="grid gap-4">
        {items.map(n => (
          <div key={n._id} className="bg-[#111] p-5 border border-white/5 rounded-2xl flex justify-between items-start shadow-[0_4px_30px_rgba(0,0,0,0.5)] group hover:border-white/10 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center min-w-[80px]">
                 <Calendar className="w-6 h-6 text-red-500 mb-1" />
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{n.date.split(' ')[0] || 'TBD'}</span>
              </div>
              <div className="pt-1">
                 <h3 className="text-white font-bold text-[19px] tracking-wide mb-2">{n.title}</h3>
                 <p className="text-gray-400 font-medium text-[14px] flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500/70"/> {n.location}</p>
                 <span className="inline-block mt-3 bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">{n.status || 'Upcoming'}</span>
              </div>
            </div>
            <button onClick={()=>handleDelete(n._id)} className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-all"><Trash2 className="w-5 h-5"/></button>
          </div>
        ))}
        {items.length === 0 && <div className="text-center p-12 text-gray-500 bg-[#111] rounded-2xl border border-white/5">No events scheduled.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">SCHEDULE EVENT</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Event Title</label>
                <input type="text" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="e.g. State Championship 2026"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Event Date</label>
                  <input type="text" value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="Oct 20, 2026"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Duration / Type</label>
                  <input type="text" disabled className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 text-gray-500 font-medium" value="Standard"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location Venue</label>
                <input type="text" value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Indoor Stadium, Main Branch"/>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`,

  'MediaGallery.tsx': `import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, X, ExternalLink } from 'lucide-react';

export const MediaGallery = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/media');
    setItems(await res.json());
  };
  
  const handleAdd = async () => {
    if(!formData.title || !formData.url) return;
    await fetch('/api/media', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...formData, category: 'Images'}) });
    setIsModalOpen(false);
    setFormData({ title: '', url: '' });
    fetchItems();
  };
  
  const handleDelete = async (id) => {
    if(window.confirm("Delete this media?")) { await fetch('/api/media/'+id, { method: 'DELETE' }); fetchItems(); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">MEDIA GALLERY</h2></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2"><Plus className="w-4 h-4"/> Add Media Link</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(n => (
          <div key={n._id} className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(255,0,0,0.15)] transition-all">
            <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
               <img src={n.url} alt={n.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'} />
               <ImageIcon className="w-10 h-10 text-white/20 absolute z-0 group-hover:opacity-0 transition-opacity" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
            </div>
            <div className="p-5 flex justify-between items-center relative z-20">
              <div className="truncate pr-4 w-full">
                <h3 className="font-bold text-white tracking-wide truncate">{n.title}</h3>
                <a href={n.url} target="_blank" className="text-xs text-red-500 hover:text-red-400 tracking-wider flex items-center gap-1 mt-1 opacity-80"><ExternalLink className="w-3 h-3"/> View Source</a>
              </div>
              <button onClick={()=>handleDelete(n._id)} className="text-gray-500 hover:bg-red-500/20 hover:text-red-500 rounded-lg p-2.5 transition-colors"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-3 text-center p-12 text-gray-500 bg-[#111] rounded-2xl border border-white/5">No media entries found.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">ADD MEDIA LINK</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Media Title</label>
                <input type="text" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Tournament Highlights"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Direct Cloud URL (Image/Video)</label>
                <input type="url" value={formData.url} onChange={(e)=>setFormData({...formData, url: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="https://res.cloudinary.com/..."/>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">Add Link</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`,

  'DocumentDownloads.tsx': `import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, X, Download } from 'lucide-react';

export const DocumentDownloads = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/documents');
    setItems(await res.json());
  };
  
  const handleAdd = async () => {
    if(!formData.title || !formData.url) return;
    await fetch('/api/documents', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...formData, category: 'Forms'}) });
    setIsModalOpen(false);
    setFormData({ title: '', url: '' });
    fetchItems();
  };
  
  const handleDelete = async (id) => {
    if(window.confirm("Delete this document link?")) { await fetch('/api/documents/'+id, { method: 'DELETE' }); fetchItems(); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">DOCUMENTS & FORMS</h2></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2"><Plus className="w-4 h-4"/> Add Document</button>
      </div>
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left">
          <thead><tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider"><th className="px-6 py-4 font-bold">Document Title</th><th className="px-6 py-4 font-bold">Reference Link</th><th className="px-6 py-4 font-bold text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {items.map(u => (
              <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5 text-white font-bold flex items-center gap-3"><div className="p-2 bg-red-500/10 rounded-lg"><FileText className="w-5 h-5 text-red-500"/></div> {u.title}</td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                     <span className="text-gray-400 truncate max-w-[250px] font-medium">{u.url}</span>
                     <a href={u.url} target="_blank" className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-gray-400 transition-all ml-2" title="View Source"><Download className="w-3 h-3"/></a>
                   </div>
                </td>
                <td className="px-6 py-5 text-right"><button onClick={()=>handleDelete(u._id)} className="p-2.5 text-gray-500 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-5 h-5"/></button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan="3" className="p-12 text-center text-gray-500">No documents available.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">ADD NEW DOCUMENT</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Document Title</label>
                <input type="text" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Official Rulebook 2026"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">File Hosting URL (PDF/Doc link)</label>
                <input type="url" value={formData.url} onChange={(e)=>setFormData({...formData, url: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="https://drive.google.com/..."/>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">Add File</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`,

  'CoachAcademy.tsx': `import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Trash2, X, MapPin } from 'lucide-react';

export const CoachAcademy = () => {
  const [coaches, setCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', academyName: '' });

  useEffect(() => { fetchCoaches(); }, []);
  const fetchCoaches = async () => {
    try {
      const res = await fetch('/api/coaches');
      setCoaches(await res.json());
    } catch(err) { console.error(err); }
  };

  const handleAdd = async () => {
    if(!formData.name) return;
    try {
      await fetch('/api/coaches', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...formData, status:'Active'}) });
      setIsModalOpen(false);
      setFormData({ name: '', academyName: '' });
      fetchCoaches();
    } catch(err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this coach profile?")) {
      await fetch('/api/coaches/'+id, { method: 'DELETE' });
      fetchCoaches();
    }
  };

  const filtered = coaches.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">COACH & ACADEMY</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage affiliated coaches and their centers</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2"><Plus className="w-4 h-4"/> Add Coach</button>
      </div>
      <div className="bg-[#111] rounded-2xl border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/5">
          <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by coach name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-medium" /></div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider"><th className="px-6 py-4 font-bold">Coach Details</th><th className="px-6 py-4 font-bold">Associated Academy</th><th className="px-6 py-4 font-bold">Status</th><th className="px-6 py-4 font-bold text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map(coach => (
                <tr key={coach._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-inner"><Users className="w-5 h-5 text-red-500" /></div><div className="flex flex-col"><span className="text-white font-bold text-[15px]">{coach.name}</span><span className="text-gray-500 text-xs font-medium mt-0.5">Joined {new Date(coach.date).getFullYear()}</span></div></div></td>
                  <td className="px-6 py-4 text-gray-300 font-bold whitespace-nowrap"><div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-500"/> {coach.academyName || 'Independent Coach'}</div></td>
                  <td className="px-6 py-4"><span className="text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-black border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">{coach.status}</span></td>
                  <td className="px-6 py-4 text-right"><button onClick={()=>handleDelete(coach._id)} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="4" className="p-12 text-center text-gray-500">No matching coaches found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">REGISTER NEW COACH</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Coach Full Name</label>
                <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Master Anil Kumar"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Academy / Training Center Name</label>
                <input type="text" value={formData.academyName} onChange={(e)=>setFormData({...formData, academyName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Dragon Taekwondo Dojo (Optional)"/>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">Register Coach</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`
};

const keys = Object.keys(components);
keys.forEach(file => {
  fs.writeFileSync(path.join(__dirname, 'src/portal-admin', file), components[file]);
  console.log('Updated UIs in', file);
});
