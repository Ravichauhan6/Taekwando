import React, { useState, useEffect } from 'react';
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
};