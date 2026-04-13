import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, X, Upload, Shield, Pencil } from 'lucide-react';

const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

const EMPTY_FORM = { name: '', mobile: '', email: '' };

export const RefereesAdmin = () => {
  const [referees, setReferees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null); // null = Add mode, object = Edit mode
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { fetchReferees(); }, []);

  const fetchReferees = async () => {
    try {
      const res = await fetch('/api/verified-entities');
      const data = await res.json();
      setReferees(data.filter((e: any) => e.category === 'Referee'));
    } catch(err) { console.error(err); }
  };

  const openAddModal = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFile(null);
    setPreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (ref: any) => {
    setEditTarget(ref);
    setFormData({ name: ref.name || '', mobile: ref.mobile || '', email: ref.email || '' });
    setFile(null);
    setPreview(ref.image_url || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFile(null);
    setPreview('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadImage = async () => {
    if (!file) return '';
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    return data.url || '';
  };

  const handleSave = async () => {
    if (!formData.name) return;
    if (formData.email && !formData.email.toLowerCase().endsWith('@gmail.com')) {
      alert("Only Gmail addresses (@gmail.com) are allowed.");
      return;
    }
    if (formData.mobile && formData.mobile.replace(/\D/g, '').length !== 10) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    setIsUploading(true);
    try {
      let imageUrl = editTarget?.image_url || '';
      if (file) {
        imageUrl = await uploadImage();
      }

      if (editTarget) {
        // EDIT mode — PATCH
        await fetch(`/api/verified-entities/${editTarget._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, image_url: imageUrl })
        });
      } else {
        // ADD mode — POST
        await fetch('/api/verified-entities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, category: 'Referee', image_url: imageUrl })
        });
      }
      closeModal();
      fetchReferees();
    } catch(err) { console.error(err); }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this referee?")) {
      await fetch('/api/verified-entities/' + id, { method: 'DELETE' });
      fetchReferees();
    }
  };

  const filtered = referees.filter((r: any) => r.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">NATIONAL REFEREES</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage affiliated national referees</p>
        </div>
        <button onClick={openAddModal} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2 items-center">
          <Plus className="w-4 h-4"/> Add Referee
        </button>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search referee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-medium" />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Referee Details</th>
                <th className="px-6 py-4 font-bold">Mobile No.</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map((ref: any) => (
                <tr key={ref._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {ref.image_url ?
                        <img src={ref.image_url} alt="" className="w-12 h-12 object-cover rounded-full border border-white/10" /> :
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-inner"><Shield className="w-5 h-5 text-red-500" /></div>
                      }
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-[15px]">{ref.name}</span>
                        <span className="text-gray-500 text-xs font-medium mt-0.5">Added {new Date(ref.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{ref.mobile || <span className="text-gray-600 italic text-xs">Not set</span>}</td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{ref.email || <span className="text-gray-600 italic text-xs">Not set</span>}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(ref)} className="p-2.5 bg-white/5 hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 rounded-xl transition-all" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ref._id)} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-500">No referees found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h3 className="text-xl font-black text-white tracking-widest">
                {editTarget ? 'EDIT REFEREE' : 'ADD REFEREE'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Referee Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: toTitleCase(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Master Vinay Singh"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                <input type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. 9876543210"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. referee@mdta.org"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Photo {editTarget && '(leave blank to keep existing)'}</label>
                <div className="flex gap-4 items-center">
                  {preview && <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-white/10" />}
                  <label className="flex-1 border-2 border-dashed border-white/10 hover:border-red-500/50 hover:bg-white/5 transition-all text-gray-400 rounded-xl p-4 cursor-pointer text-center">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <Upload className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-bold uppercase tracking-widest">{preview ? 'Change Photo' : 'Upload Photo'}</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={closeModal} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
                <button onClick={handleSave} disabled={isUploading} className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all disabled:opacity-50">
                  {isUploading ? 'Saving...' : editTarget ? 'Update Referee' : 'Save Referee'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
