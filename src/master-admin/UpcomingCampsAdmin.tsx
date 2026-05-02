import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X, Upload, Calendar, MapPin, Pencil, Image as ImageIcon } from 'lucide-react';

const EMPTY_FORM = {
  title: '',
  date: '',
  location: '',
  description: '',
  status: 'Upcoming'
};

export const UpcomingCampsAdmin = () => {
  const [camps, setCamps] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { fetchCamps(); }, []);

  const fetchCamps = async () => {
    try {
      const res = await fetch('/api/training-camps');
      const data = await res.json();
      setCamps(data);
    } catch (err) { console.error(err); }
  };

  const openAddModal = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFile(null); setPreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (camp: any) => {
    setEditTarget(camp);
    setFormData({
      title: camp.title || '',
      date: camp.date || '',
      location: camp.location || '',
      description: camp.description || '',
      status: camp.status || 'Upcoming'
    });
    setFile(null);
    setPreview(camp.image_url || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); setEditTarget(null);
    setFormData(EMPTY_FORM); setFile(null); setPreview('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadImage = async () => {
    if (!file) return '';
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    return (await res.json()).url || '';
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date) {
      alert("Title and Date are required.");
      return;
    }
    
    setIsUploading(true);
    try {
      let image_url = editTarget?.image_url || '';
      if (file) image_url = await uploadImage();
      const payload = { ...formData, image_url };

      if (editTarget) {
        await fetch(`/api/training-camps/${editTarget._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/training-camps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      closeModal(); fetchCamps();
    } catch (err) { console.error(err); }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this training camp?')) {
      await fetch('/api/training-camps/' + id, { method: 'DELETE' });
      fetchCamps();
    }
  };

  const filtered = camps.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2 flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(255,0,0,0.2)]">
            <Calendar className="w-6 h-6 text-red-600" />
            Upcoming <span className="text-red-600">Training Camps</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage all upcoming training camps and events</p>
        </div>
        <button onClick={openAddModal}
          className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2 items-center hover:from-red-500 hover:to-red-800 transition-all">
          <Plus className="w-4 h-4" /> Add Camp
        </button>
      </div>

      <div className="bg-[#0e0e0e] rounded-2xl border border-red-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/[0.02]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search by title or location..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-medium" />
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4 font-bold">Camp Info</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Description</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-sm">
              {filtered.map((camp: any) => (
                <tr key={camp._id} className="hover:bg-red-500/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {camp.image_url ? (
                        <img src={camp.image_url} alt="" className="w-14 h-14 object-cover rounded-xl border-2 border-red-500/20 bg-white/5 p-1 shadow-[0_0_10px_rgba(255,0,0,0.1)]" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-700 to-red-950 border border-red-500/20 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white/70" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-black text-[14px] leading-tight">{camp.title}</p>
                        <p className="text-red-400 text-xs font-bold mt-1 tracking-wider uppercase">{camp.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs leading-snug max-w-[180px]">{camp.location || <span className="text-gray-600 italic">Not set</span>}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-gray-400 text-xs line-clamp-2 max-w-xs">{camp.description || <span className="text-gray-600 italic">No description</span>}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${camp.status === 'Completed' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' : camp.status === 'Ongoing' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {camp.status || 'Upcoming'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(camp)}
                        className="p-2.5 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(camp._id)}
                        className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-16 text-center">
                  <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">No training camps found</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0d0d0d] border border-red-500/20 shadow-[0_0_60px_rgba(255,0,0,0.12)] rounded-3xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 my-4">
            <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 bg-gradient-to-r from-red-900/30 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/15">
                  <Calendar className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-black text-white tracking-widest">
                  {editTarget ? 'EDIT CAMP' : 'ADD TRAINING CAMP'}
                </h3>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Camp Title *</label>
                <input type="text" value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                  placeholder="E.g. Summer Elite Taekwondo Camp" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date *</label>
                <input type="text" value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                  placeholder="E.g. 15th June - 20th June 2026" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location</label>
                <input type="text" value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                  placeholder="E.g. Sports Stadium, Maharajganj" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status</label>
                <select value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea value={formData.description} rows={3}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium placeholder-gray-600"
                  placeholder="Details about the training camp..." />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Camp Poster / Image {editTarget && <span className="text-gray-600 normal-case font-normal">(leave blank to keep existing)</span>}
                </label>
                <div className="flex gap-4 items-center">
                  {preview && (
                    <img src={preview} alt="Poster Preview"
                      className="w-20 h-20 object-cover rounded-xl border border-red-500/20 bg-white/5 p-1 shadow-[0_0_12px_rgba(255,0,0,0.1)]" />
                  )}
                  <label className="flex-1 border-2 border-dashed border-white/10 hover:border-red-500/40 hover:bg-red-500/5 transition-all text-gray-500 rounded-xl p-4 cursor-pointer text-center">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <Upload className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-bold uppercase tracking-widest">{preview ? 'Change Image' : 'Upload Image'}</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={closeModal}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all border border-white/5">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isUploading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(255,0,0,0.25)] transition-all disabled:opacity-50">
                  {isUploading ? 'Saving...' : editTarget ? 'Update Camp' : 'Save Camp'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
