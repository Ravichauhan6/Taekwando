import React, { useState, useEffect } from 'react';
import { Award, Search, CheckCircle, XCircle, Plus, Trash2, X } from 'lucide-react';

export const BeltManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [promotionRequests, setPromotionRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', currentBelt: '', requestedBelt: '' });

  useEffect(() => { fetchPromotions(); }, []);
  const fetchPromotions = async () => {
    try {
      const res = await fetch('/api/belt-promotions');
      setPromotionRequests(await res.json());
    } catch(err) { console.error(err); }
  };

  const handleAdd = async () => {
    if(!formData.name || !formData.currentBelt || !formData.requestedBelt) return;
    try {
      await fetch('/api/belt-promotions', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({...formData, status:'Pending'}) 
      });
      setIsModalOpen(false);
      setFormData({ name: '', currentBelt: '', requestedBelt: '' });
      fetchPromotions();
    } catch(err) { console.error(err); }
  };

  const handleUpdate = async (id, status) => {
    try {
      await fetch('/api/belt-promotions/' + id, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({status}) });
      fetchPromotions();
    } catch(err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this request?")) {
      await fetch('/api/belt-promotions/' + id, { method: 'DELETE' });
      fetchPromotions();
    }
  };

  const filtered = promotionRequests.filter(r => r.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">BELT PROMOTIONS</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage Poom/Dan and color belt graduation requests</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2"><Plus className="w-4 h-4"/> Add Request</button>
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
                  <td className="px-6 py-4"><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${request.status === 'Approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : request.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>{request.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {request.status === 'Pending' && <>
                        <button onClick={() => handleUpdate(request._id, 'Approved')} className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors border border-green-500/20" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => handleUpdate(request._id, 'Rejected')} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20" title="Reject"><XCircle className="w-4 h-4" /></button>
                      </>}
                      <button onClick={() => handleDelete(request._id)} className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-500">No requests found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">ADD BELT REQUEST</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Student Name</label>
                <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. John Doe"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Belt</label>
                <input type="text" value={formData.currentBelt} onChange={(e)=>setFormData({...formData, currentBelt: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Red, Poom 1"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Requested Belt</label>
                <input type="text" value={formData.requestedBelt} onChange={(e)=>setFormData({...formData, requestedBelt: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Black, Poom 2"/>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all">Add Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
