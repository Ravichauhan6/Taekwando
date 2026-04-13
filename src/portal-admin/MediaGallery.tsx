import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, X, ExternalLink } from 'lucide-react';

export const MediaGallery = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '', category: 'Images' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/media');
    setItems(await res.json());
  };
  
  const handleAdd = async () => {
    if(!formData.title || !formData.url) return;
    await fetch('/api/media', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) });
    setIsModalOpen(false);
    setFormData({ title: '', url: '', category: 'Images' });
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
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e)=>setFormData({...formData, category: e.target.value})} 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium"
                >
                  <option value="Images">Image</option>
                  <option value="Videos">Video</option>
                </select>
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
};