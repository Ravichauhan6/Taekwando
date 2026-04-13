import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, X, MapPin } from 'lucide-react';

export const EventCreation = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', location: '', type: 'Upcoming', image: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch('/api/events');
    setItems(await res.json());
  };
  
  const handleAdd = async () => {
    if(!formData.title || !formData.date || !formData.location) return;
    await fetch('/api/events', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) });
    setIsModalOpen(false);
    setFormData({ title: '', date: '', location: '', type: 'Upcoming', image: '' });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(n => (
          <div key={n._id} className="bg-[#111] border border-white/5 rounded-[24px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] group hover:border-red-500/30 transition-all duration-500 flex flex-col">
            <div className="h-48 relative overflow-hidden">
               {n.image ? (
                 <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-red-600/20 to-black flex items-center justify-center">
                   <Calendar className="w-12 h-12 text-red-500/40" />
                 </div>
               )}
               <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                 {n.type || 'Upcoming'}
               </div>
            </div>
            <div className="p-6 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-white font-black text-xl tracking-tight leading-tight group-hover:text-red-500 transition-colors">{n.title}</h3>
                   <div className="flex items-center gap-4 mt-3">
                      <p className="text-gray-400 font-bold text-[12px] flex items-center gap-1.5 uppercase tracking-wider"><Calendar className="w-3.5 h-3.5 text-red-500"/> {n.date}</p>
                      <p className="text-gray-400 font-bold text-[12px] flex items-center gap-1.5 uppercase tracking-wider"><MapPin className="w-3.5 h-3.5 text-red-500"/> {n.location}</p>
                   </div>
                </div>
                <button onClick={()=>handleDelete(n._id)} className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-xl transition-all shadow-inner"><Trash2 className="w-5 h-5"/></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full text-center p-20 text-gray-500 bg-[#111] rounded-[24px] border border-white/5 border-dashed border-2">No events scheduled. Start by adding a new one!</div>}
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
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Event Type</label>
                  <select value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-all font-bold tracking-wider">
                    <option value="Upcoming">UPCOMING EVENT</option>
                    <option value="Past">PAST EVENT</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location Venue</label>
                <input type="text" value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Indoor Stadium, Main Branch"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Event Image URL</label>
                <input type="text" value={formData.image} onChange={(e)=>setFormData({...formData, image: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="https://unsplash.com/... or /event1.jpg"/>
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
};