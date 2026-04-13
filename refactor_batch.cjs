const fs = require('fs');
const path = require('path');

const components = {
  'BeltManagement.tsx': `import React, { useState, useEffect } from 'react';
import { Award, Search, CheckCircle, XCircle } from 'lucide-react';

export const BeltManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [promotionRequests, setPromotionRequests] = useState([]);

  useEffect(() => { fetchPromotions(); }, []);
  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/belt-promotions');
      setPromotionRequests(await res.json());
    } catch(err) { console.error(err); }
  };

  const handleUpdate = async (id, status) => {
    try {
      await fetch('/api/belt-promotions/' + id, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({status}) });
      fetchPromotions();
    } catch(err) { console.error(err); }
  };

  const filtered = promotionRequests.filter(r => r.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">BELT PROMOTIONS</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage Poom/Dan and color belt graduation requests</p>
        </div>
      </div>
      <div className="bg-[#111] rounded-2xl border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by student name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Student Name</th><th className="px-6 py-4 font-bold">Current Belt</th>
                <th className="px-6 py-4 font-bold">Requested Belt</th><th className="px-6 py-4 font-bold">Date</th><th className="px-6 py-4 font-bold">Status</th><th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map(request => (
                <tr key={request._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-white font-medium">{request.name}</td>
                  <td className="px-6 py-4 text-gray-300"><span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-300">{request.currentBelt}</span></td>
                  <td className="px-6 py-4 text-gray-300"><span className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-xs font-bold text-red-400">{request.requestedBelt}</span></td>
                  <td className="px-6 py-4 text-gray-400">{new Date(request.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><span className={\`inline-block px-3 py-1 rounded-full text-xs font-bold border \${request.status === 'Approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : request.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}\`}>{request.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    {request.status === 'Pending' && <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleUpdate(request._id, 'Approved')} className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors border border-green-500/20" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                      <button onClick={() => handleUpdate(request._id, 'Rejected')} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20" title="Reject"><XCircle className="w-4 h-4" /></button>
                    </div>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-500">No requests found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
`,
  'CoachAcademy.tsx': `import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Trash2 } from 'lucide-react';

export const CoachAcademy = () => {
  const [coaches, setCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchCoaches(); }, []);
  const fetchCoaches = async () => {
    try {
      const res = await fetch('/api/coaches');
      setCoaches(await res.json());
    } catch(err) { console.error(err); }
  };

  const handleAdd = async () => {
    const name = prompt("Enter Coach Name:");
    if(!name) return;
    const academyName = prompt("Enter Academy Name:");
    try {
      await fetch('/api/coaches', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, academyName, status:'Active'}) });
      fetchCoaches();
    } catch(err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this coach?")) {
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
        <button onClick={handleAdd} className="bg-gradient-to-r from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,0,0,0.3)] border border-red-500/30 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Coach</button>
      </div>
      <div className="bg-[#111] rounded-2xl border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/5">
          <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search coaches..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50" /></div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider"><th className="px-6 py-4 font-bold">Coach Details</th><th className="px-6 py-4 font-bold">Academy</th><th className="px-6 py-4 font-bold">Status</th><th className="px-6 py-4 font-bold text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map(coach => (
                <tr key={coach._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Users className="w-4 h-4 text-gray-400" /></div><div className="flex flex-col"><span className="text-white font-bold">{coach.name}</span><span className="text-gray-500 text-xs">Joined {new Date(coach.date).getFullYear()}</span></div></div></td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{coach.academyName || 'Independent'}</td>
                  <td className="px-6 py-4"><span className="text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">{coach.status}</span></td>
                  <td className="px-6 py-4 text-right"><button onClick={()=>handleDelete(coach._id)} className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-500/20"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No coaches found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
`
  // Similar logic can be written for the rest...
};

const keys = Object.keys(components);
keys.forEach(file => {
  fs.writeFileSync(path.join(__dirname, 'src/portal-admin', file), components[file]);
  console.log('Processed', file);
});
