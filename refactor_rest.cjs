const fs = require('fs');
const path = require('path');

const components = {
  'UserRoles.tsx': `import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';

export const UserRoles = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      setUsers(await res.json());
    } catch(err) { console.error(err); }
  };

  const handleAddUser = async () => {
    const username = prompt("Enter Username matching 'admin' format:");
    if(!username) return;
    const password = prompt("Enter Password:");
    if(!password) return;
    try {
      await fetch('/api/admin/users', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username, password}) });
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
        <button onClick={handleAddUser} className="bg-gradient-to-r from-red-600 to-red-900 text-white px-5 py-2.5 rounded-xl uppercase font-bold flex gap-2"><UserPlus className="w-4 h-4"/> Add User</button>
      </div>
      <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="bg-black/40 text-gray-400 text-xs uppercase"><th className="px-6 py-4">Username</th><th className="px-6 py-4 text-right">Delete</th></tr></thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-white font-bold">{u.username}</td>
                <td className="px-6 py-4 text-right"><button onClick={()=>handleDelete(u._id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};`,

  'Notifications.tsx': `import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';

export const Notifications = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/notifications');
    setItems(await res.json());
  };
  const handleAdd = async () => {
    const title = prompt("Notification Title:");
    if(!title) return;
    const message = prompt("Message:");
    await fetch('/api/notifications', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({title, message, audience: 'All'}) });
    fetchItems();
  };
  const handleDelete = async (id) => {
    if(window.confirm("Delete?")) { await fetch('/api/notifications/'+id, { method: 'DELETE' }); fetchItems(); }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-widest">NOTIFICATIONS</h2>
        <button onClick={handleAdd} className="bg-gradient-to-r from-red-600 to-red-900 text-white px-5 py-2.5 rounded-xl uppercase font-bold flex gap-2"><Plus className="w-4 h-4"/> New Notification</button>
      </div>
      <div className="grid gap-4">
        {items.map(n => (
          <div key={n._id} className="bg-[#111] p-4 border border-white/5 rounded-xl flex justify-between items-center">
            <div><h3 className="text-white font-bold">{n.title}</h3><p className="text-gray-400 text-sm">{n.message}</p></div>
            <button onClick={()=>handleDelete(n._id)} className="text-red-500 hover:bg-red-500/20 p-2 rounded-lg"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}
      </div>
    </div>
  );
};`,

  'EventCreation.tsx': `import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';

export const EventCreation = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/events');
    setItems(await res.json());
  };
  const handleAdd = async () => {
    const title = prompt("Event Title:");
    if(!title) return;
    const date = prompt("Event Date (e.g. Oct 20, 2026):");
    const location = prompt("Location:");
    await fetch('/api/events', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({title, date, location}) });
    fetchItems();
  };
  const handleDelete = async (id) => {
    if(window.confirm("Delete?")) { await fetch('/api/events/'+id, { method: 'DELETE' }); fetchItems(); }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-widest">EVENTS</h2>
        <button onClick={handleAdd} className="bg-gradient-to-r from-red-600 to-red-900 text-white px-5 py-2.5 rounded-xl uppercase font-bold flex gap-2"><Plus className="w-4 h-4"/> New Event</button>
      </div>
      <div className="grid gap-4">
        {items.map(n => (
          <div key={n._id} className="bg-[#111] p-4 border border-white/5 rounded-xl flex justify-between items-start">
            <div><h3 className="text-white font-bold text-lg">{n.title}</h3><p className="text-gray-400 text-sm mt-1">{n.date} - {n.location}</p></div>
            <button onClick={()=>handleDelete(n._id)} className="text-red-500 hover:bg-red-500/20 p-2 rounded-lg"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}
      </div>
    </div>
  );
};`,

  'MediaGallery.tsx': `import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

export const MediaGallery = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/media');
    setItems(await res.json());
  };
  const handleAdd = async () => {
    const title = prompt("Image Title:");
    if(!title) return;
    const url = prompt("URL link to Image/Video:");
    await fetch('/api/media', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({title, url, category: 'Images'}) });
    fetchItems();
  };
  const handleDelete = async (id) => {
    if(window.confirm("Delete?")) { await fetch('/api/media/'+id, { method: 'DELETE' }); fetchItems(); }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-widest">MEDIA GALLERY</h2>
        <button onClick={handleAdd} className="bg-gradient-to-r from-red-600 to-red-900 text-white px-5 py-2.5 rounded-xl uppercase font-bold flex gap-2"><Plus className="w-4 h-4"/> Add Link</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(n => (
          <div key={n._id} className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden group">
            <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center relative"><img src={n.url} alt={n.title} className="w-full h-full object-cover opacity-50" /><ImageIcon className="w-8 h-8 text-white/20 absolute" /></div>
            <div className="p-4 flex justify-between items-center">
              <h3 className="font-bold text-white truncate max-w-[200px]">{n.title}</h3>
              <button onClick={()=>handleDelete(n._id)} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};`,

  'DocumentDownloads.tsx': `import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';

export const DocumentDownloads = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/documents');
    setItems(await res.json());
  };
  const handleAdd = async () => {
    const title = prompt("Document Title:");
    if(!title) return;
    const url = prompt("Document URL Link:");
    await fetch('/api/documents', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({title, url, category: 'Forms'}) });
    fetchItems();
  };
  const handleDelete = async (id) => {
    if(window.confirm("Delete?")) { await fetch('/api/documents/'+id, { method: 'DELETE' }); fetchItems(); }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-widest">DOCUMENTS</h2>
        <button onClick={handleAdd} className="bg-gradient-to-r from-red-600 to-red-900 text-white px-5 py-2.5 rounded-xl uppercase font-bold flex gap-2"><Plus className="w-4 h-4"/> Add Document</button>
      </div>
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="bg-black/40 text-gray-400 text-xs uppercase"><th className="px-6 py-4">Title</th><th className="px-6 py-4">URL</th><th className="px-6 py-4 text-right">Delete</th></tr></thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {items.map(u => (
              <tr key={u._id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-white font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-red-500"/> {u.title}</td>
                <td className="px-6 py-4 text-gray-400 truncate max-w-[200px]"><a href={u.url} target="_blank" className="hover:text-blue-400">{u.url}</a></td>
                <td className="px-6 py-4 text-right"><button onClick={()=>handleDelete(u._id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};`

};

const keys = Object.keys(components);
keys.forEach(file => {
  fs.writeFileSync(path.join(__dirname, 'src/portal-admin', file), components[file]);
  console.log('Processed', file);
});
