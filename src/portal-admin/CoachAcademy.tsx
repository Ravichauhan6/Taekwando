import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Trash2, X, MapPin, Edit3, Image as ImageIcon, UploadCloud, Loader2 } from 'lucide-react';

const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const CoachAcademy = () => {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', academyName: '', address: '', contactNumber: '', email: '', qualifications: '' });
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => { fetchCoaches(); }, []);

  const fetchCoaches = async () => {
    try {
      const res = await fetch('/api/coaches');
      if(res.ok) setCoaches(await res.json());
    } catch(err) { console.error(err); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', academyName: '', address: '', contactNumber: '', email: '', qualifications: '' });
    setSelectedCoachId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (coach: any) => {
    setSelectedCoachId(coach._id);
    setFormData({
       name: coach.name || '',
       academyName: coach.academyName || '',
       address: coach.address || '',
       contactNumber: coach.contactNumber || '',
       email: coach.email || '',
       qualifications: coach.qualifications || ''
    });
    setImageFile(null);
    setImagePreview(coach.image_url || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if(!formData.name || !formData.email) {
       alert("Name and Email are required!");
       return;
    }
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
       alert("Only Gmail addresses (@gmail.com) are allowed.");
       return;
    }
    if (formData.contactNumber && formData.contactNumber.length !== 10) {
       alert("Mobile number must be exactly 10 digits.");
       return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = imagePreview && imagePreview.startsWith('http') ? imagePreview : null;

      // 1. Upload new image if a file was selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          finalImageUrl = uploadJson.url;
        } else {
           console.error("Image upload failed");
        }
      }

      // 2. Build Payload
      const payload = {
         ...formData,
         status: 'Active',
         image_url: finalImageUrl
      };

      // 3. Save to Database
      if (selectedCoachId) {
         await fetch(`/api/coaches/${selectedCoachId}`, { 
            method: 'PUT', 
            headers: {'Content-Type':'application/json'}, 
            body: JSON.stringify(payload) 
         });
      } else {
         await fetch('/api/coaches', { 
            method: 'POST', 
            headers: {'Content-Type':'application/json'}, 
            body: JSON.stringify(payload) 
         });
      }

      setIsModalOpen(false);
      resetForm();
      fetchCoaches();
    } catch(err) { 
       console.error(err); 
    } finally {
       setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm("Delete this coach profile completely?")) {
      await fetch('/api/coaches/'+id, { method: 'DELETE' });
      fetchCoaches();
    }
  };

  const filtered = coaches.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.academyName?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest drop-shadow-[0_2px_10px_rgba(255,0,0,0.4)]">COACH & ACADEMY</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Manage affiliated coaches and their centers</p>
        </div>
        <button onClick={openAddModal} className="bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white px-5 py-2.5 rounded-xl uppercase tracking-widest font-bold flex shadow-[0_0_20px_rgba(255,0,0,0.3)] gap-2 hover:from-red-500 hover:to-red-800 transition-all"><Plus className="w-4 h-4"/> Add Coach</button>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/5">
          <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by coach name or center..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-medium" /></div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider"><th className="px-6 py-4 font-bold w-16">Profile</th><th className="px-6 py-4 font-bold">Coach Details</th><th className="px-6 py-4 font-bold">Academy & Address</th><th className="px-6 py-4 font-bold">Status</th><th className="px-6 py-4 font-bold text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map(coach => (
                <tr key={coach._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                     {coach.image_url ? (
                        <div className="w-12 h-12 rounded-full border-2 border-red-500/30 overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.2)]">
                           <img src={coach.image_url} alt={coach.name} className="w-full h-full object-cover" />
                        </div>
                     ) : (
                        <div className="w-12 h-12 rounded-full border-2 border-red-500/30 bg-red-500/10 flex items-center justify-center shadow-inner">
                           <Users className="w-5 h-5 text-red-500" />
                        </div>
                     )}
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="text-white font-bold text-[15px]">{coach.name}</span>
                        <span className="text-[10.5px] text-red-400 font-bold tracking-wider mt-0.5 leading-tight">{coach.qualifications || 'No Qualifications Added'}</span>
                        <div className="flex gap-2 mt-1">
                           <span className="text-[10px] text-gray-400 font-medium">{coach.contactNumber || 'No Phone'}</span>
                           <span className="text-[10px] text-gray-400 font-medium">{coach.email && `• ${coach.email}`}</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-bold whitespace-nowrap">
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-red-500"/> {coach.academyName || 'Independent Coach'}</div>
                        <div className="text-[11px] text-gray-500 font-medium ml-5 mt-0.5 whitespace-normal max-w-xs leading-snug">{coach.address || 'Address: Not Provided'}</div>
                     </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-black border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">{coach.status}</span></td>
                  <td className="px-6 py-4 text-right space-x-2">
                     <button onClick={()=>openEditModal(coach)} className="p-2.5 bg-white/5 hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                     <button onClick={()=>handleDelete(coach._id)} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-gray-500">No matching coaches found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-red-500/30 shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            
            <div className="p-6 flex justify-between items-center border-b border-white/10 bg-black/40">
              <h3 className="text-xl font-black text-white tracking-widest">
                 {selectedCoachId ? 'EDIT COACH DETAILS' : 'REGISTER NEW COACH'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto grid md:grid-cols-3 gap-8">
               {/* Left Column: Image Upload */}
               <div className="md:col-span-1 space-y-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Coach Portrait</label>
                  <div className="w-full aspect-square bg-black/50 border-2 border-dashed border-white/10 hover:border-red-500/50 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all group">
                     {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                        <div className="text-gray-500 flex flex-col items-center gap-2 group-hover:text-red-400 transition-colors">
                           <UploadCloud className="w-8 h-8" />
                           <span className="text-xs font-bold uppercase tracking-widest text-center px-4">Click to upload photo</span>
                        </div>
                     )}
                     <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                  {imagePreview && (
                     <p className="text-[10px] text-gray-500 text-center">Click the image to select a different photo.</p>
                  )}
               </div>

               {/* Right Column: Details */}
               <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Coach Full Name *</label>
                    <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: toTitleCase(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Master Anil Kumar" required/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email ID *</label>
                      <input type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="Essential for login password" required/>
                      {!selectedCoachId && <p className="text-[9px] text-red-500 mt-1 uppercase tracking-widest">Password generated & emailed automatically.</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                      <input type="tel" value={formData.contactNumber} onChange={(e)=>setFormData({...formData, contactNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="10-digit Mobile"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Academy / Training Center Name</label>
                    <input type="text" value={formData.academyName} onChange={(e)=>setFormData({...formData, academyName: toTitleCase(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Dragon Taekwondo"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Qualifications & DAN</label>
                    <input type="text" value={formData.qualifications} onChange={(e)=>setFormData({...formData, qualifications: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. B.P.Ed. 3rd DAN BLACK BELT"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Training Center Address</label>
                    <input type="text" value={formData.address} onChange={(e)=>setFormData({...formData, address: toTitleCase(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium" placeholder="E.g. Main Market, Gorakhpur"/>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
               <button onClick={() => setIsModalOpen(false)} className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all">Cancel</button>
               <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-900 border border-red-500/50 hover:from-red-500 hover:to-red-800 disabled:opacity-50 text-white rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,0,0.3)] flex items-center gap-2 transition-all">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (selectedCoachId ? "SAVE CHANGES" : "REGISTER COACH")}
               </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};