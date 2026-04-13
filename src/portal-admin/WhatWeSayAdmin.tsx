import React, { useState, useEffect } from 'react';
import { Quote, Save, CheckCircle, User, Shield, UploadCloud, Camera, Loader2, Image as ImageIcon } from 'lucide-react';

export const WhatWeSayAdmin = () => {
  const [data, setData] = useState({
    president_name: 'Mr. Shardendu Kumar Pandey',
    president_title: 'President (MDTA)',
    president_message: '',
    president_image: '',
    secretary_name: 'Abhishek Kumar Vishwakarma',
    secretary_title: 'Secretary (MDTA)',
    secretary_message: '',
    secretary_image: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/content/what_we_say')
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          try {
            const parsed = JSON.parse(data.content);
            setData(prev => ({ ...prev, ...parsed }));
          } catch (e) {
            console.error('Failed to parse content', e);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'president_image' | 'secretary_image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setData(prev => ({ ...prev, [field]: result.url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_name: 'what_we_say', content: JSON.stringify(data) })
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch(err) {
      console.error(err);
      alert("Failed to save changes.");
    }
    setIsSaving(false);
  };

  const inputClass = "w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all font-medium text-sm placeholder-gray-600";
  const labelClass = "block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2.5 ml-1";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Sticky Bar */}
      <div className="sticky top-0 z-20 flex justify-between items-center bg-black/60 backdrop-blur-xl p-6 rounded-[24px] border border-white/5 shadow-2xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-600" />
            Leadership <span className="text-red-600">Messages</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 font-bold tracking-widest uppercase opacity-70">MDTA Executive Panel Content Manager</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-gradient-to-br from-red-600 to-red-950 border border-red-500/30 text-white px-8 py-3.5 rounded-2xl uppercase tracking-[0.15em] font-black flex flex-row items-center justify-center shadow-[0_10px_40px_rgba(255,0,0,0.3)] gap-3 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all group"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform"/>} 
          {isSaving ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>

      {success && (
        <div className="bg-red-600/10 border border-red-600/30 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-4 font-black uppercase tracking-widest text-[11px] animate-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          Updates are live on the homepage!
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* President Profile Section */}
        <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 shadow-3xl p-10 relative overflow-hidden group/card hover:border-red-600/20 transition-all duration-500">
          {/* Subtle Glow */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg">
                  <User className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">President</h3>
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em]">{data.president_title}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {/* Photo Area */}
              <div className="md:col-span-2">
                <label className={labelClass}>Official Portrait</label>
                <div className="relative aspect-[1/1.2] rounded-[32px] overflow-hidden bg-black/60 border-2 border-dashed border-white/10 hover:border-red-600/50 transition-all group/upload cursor-pointer">
                  {data.president_image ? (
                    <img 
                      src={data.president_image} 
                      alt="President preview" 
                      className={`w-full h-full object-cover grayscale transition-all duration-700 group-hover/upload:grayscale-0 group-hover/upload:scale-110 ${uploadingField === 'president_image' ? 'opacity-30' : 'opacity-100'}`} 
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-600 group-hover/upload:text-red-500 transition-colors">
                      <Camera className="w-10 h-10" />
                      <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white">
                    <UploadCloud className="w-8 h-8 opacity-70" />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 px-3 py-1 rounded-full">Change Photo</span>
                  </div>

                  {uploadingField === 'president_image' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                      <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mt-3">Uploading...</span>
                    </div>
                  )}

                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'president_image')}
                    className="absolute inset-0 opacity-0 cursor-pointer z-30" 
                  />
                </div>
              </div>

              {/* Text Fields */}
              <div className="md:col-span-3 space-y-6">
                <div>
                  <label className={labelClass}>President Name</label>
                  <input 
                    type="text" 
                    value={data.president_name}
                    onChange={(e) => setData({...data, president_name: e.target.value})}
                    className={inputClass}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Designation</label>
                  <input 
                    type="text" 
                    value={data.president_title}
                    onChange={(e) => setData({...data, president_title: e.target.value})}
                    className={inputClass}
                    placeholder="e.g. President (MDTA)"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Official Message Content</label>
              <div className="relative">
                <Quote className="absolute top-4 left-4 w-5 h-5 text-red-600/30 -rotate-12" />
                <textarea 
                  rows={6}
                  value={data.president_message}
                  onChange={(e) => setData({...data, president_message: e.target.value})}
                  className={`${inputClass} pl-12 resize-none leading-relaxed italic text-[13px]`}
                  placeholder="Enter the official presidential message here..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Secretary Profile Section */}
        <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 shadow-3xl p-10 relative overflow-hidden group/card hover:border-red-600/20 transition-all duration-500">
          {/* Subtle Glow */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg">
                  <User className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Secretary</h3>
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em]">{data.secretary_title}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {/* Photo Area */}
              <div className="md:col-span-2">
                <label className={labelClass}>Official Portrait</label>
                <div className="relative aspect-[1/1.2] rounded-[32px] overflow-hidden bg-black/60 border-2 border-dashed border-white/10 hover:border-red-600/50 transition-all group/upload cursor-pointer">
                  {data.secretary_image ? (
                    <img 
                      src={data.secretary_image} 
                      alt="Secretary preview" 
                      className={`w-full h-full object-cover grayscale transition-all duration-700 group-hover/upload:grayscale-0 group-hover/upload:scale-110 ${uploadingField === 'secretary_image' ? 'opacity-30' : 'opacity-100'}`} 
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-600 group-hover/upload:text-red-500 transition-colors">
                      <Camera className="w-10 h-10" />
                      <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white">
                    <UploadCloud className="w-8 h-8 opacity-70" />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 px-3 py-1 rounded-full">Change Photo</span>
                  </div>

                  {uploadingField === 'secretary_image' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                      <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mt-3">Uploading...</span>
                    </div>
                  )}

                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'secretary_image')}
                    className="absolute inset-0 opacity-0 cursor-pointer z-30" 
                  />
                </div>
              </div>

              {/* Text Fields */}
              <div className="md:col-span-3 space-y-6">
                <div>
                  <label className={labelClass}>Secretary Name</label>
                  <input 
                    type="text" 
                    value={data.secretary_name}
                    onChange={(e) => setData({...data, secretary_name: e.target.value})}
                    className={inputClass}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Designation</label>
                  <input 
                    type="text" 
                    value={data.secretary_title}
                    onChange={(e) => setData({...data, secretary_title: e.target.value})}
                    className={inputClass}
                    placeholder="e.g. Secretary (MDTA)"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Official Message Content</label>
              <div className="relative">
                <Quote className="absolute top-4 left-4 w-5 h-5 text-red-600/30 -rotate-12" />
                <textarea 
                  rows={6}
                  value={data.secretary_message}
                  onChange={(e) => setData({...data, secretary_message: e.target.value})}
                  className={`${inputClass} pl-12 resize-none leading-relaxed italic text-[13px]`}
                  placeholder="Enter the official secretary's message here..."
                />
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Dynamic Summary Bar */}
      <div className="bg-gradient-to-r from-red-600/10 via-[#111] to-transparent border border-red-600/20 p-8 rounded-[40px] shadow-xl flex flex-col md:flex-row items-center gap-10">
         <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-red-600" />
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Global Leadership Updates</h4>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed font-medium">When you click <span className="text-red-600 font-bold">Publish Changes</span>, these messages and portraits will be instantly updated across the entire portal. Ensure images are high contrast and clear.</p>
         </div>
         <div className="flex gap-6">
            <div className="text-center">
              <span className="block text-xl font-black text-white">{data.president_message.split(' ').length}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Words (Pres.)</span>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center">
              <span className="block text-xl font-black text-white">{data.secretary_message.split(' ').length}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Words (Sec.)</span>
            </div>
         </div>
      </div>
    </div>
  );
};

