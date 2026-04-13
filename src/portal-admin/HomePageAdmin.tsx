import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Shield, UploadCloud, Camera, Loader2, Image as ImageIcon, RotateCcw } from 'lucide-react';

export const HomePageAdmin = () => {
  const [data, setData] = useState({
    hero_bg: '',
    why_choose_us_img: '',
    training_programs_img: '',
    training_centers_img: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/content/homepage_assets')
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.content) {
          try {
            const parsed = JSON.parse(resData.content);
            setData(prev => ({ ...prev, ...parsed }));
          } catch (e) {
            console.error('Failed to parse content', e);
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
      alert("Failed to upload image.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleReset = (field: string) => {
    setData(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_name: 'homepage_assets', content: JSON.stringify(data) })
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch(err) {
      console.error(err);
      alert("Failed to save changes.");
    }
    setIsSaving(false);
  };

  const AssetCard = ({ title, field, description }: { title: string, field: string, description: string }) => (
    <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 flex flex-col gap-6 hover:border-red-600/20 transition-all group/card shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h3 className="text-white font-black text-sm uppercase tracking-widest">{title}</h3>
          <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wider">{description}</p>
        </div>
        {data[field as keyof typeof data] && (
           <button 
             onClick={() => handleReset(field)} 
             className="p-2 bg-white/5 hover:bg-red-600/20 text-gray-500 hover:text-red-500 rounded-lg transition-all"
             title="Reset to Default"
           >
             <RotateCcw className="w-4 h-4" />
           </button>
        )}
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border-2 border-dashed border-white/10 hover:border-red-600/40 transition-all cursor-pointer group/upload">
        {data[field as keyof typeof data] ? (
          <img 
            src={data[field as keyof typeof data]} 
            alt={title} 
            className={`w-full h-full object-cover transition-all duration-700 group-hover/upload:scale-105 ${uploadingField === field ? 'opacity-30' : 'opacity-100'}`} 
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-600 group-hover/upload:text-red-500 transition-colors">
            <ImageIcon className="w-10 h-10" />
            <span className="text-[10px] font-black uppercase tracking-widest">Using Default Image</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white">
          <UploadCloud className="w-8 h-8 text-red-600" />
          <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 px-4 py-1.5 rounded-full shadow-lg">Upload New Image</span>
        </div>

        {uploadingField === field && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-3">Uploading to Cloud...</span>
          </div>
        )}

        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleImageUpload(e, field)}
          className="absolute inset-0 opacity-0 cursor-pointer z-30" 
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="sticky top-0 z-20 flex justify-between items-center bg-black/60 backdrop-blur-xl p-6 rounded-[24px] border border-white/5 shadow-2xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-red-600" />
            Homepage <span className="text-red-600">Assets</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 font-bold tracking-widest uppercase opacity-70">Dynamic Landing Page Image Manager</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-gradient-to-br from-red-600 to-red-950 border border-red-500/30 text-white px-8 py-3.5 rounded-2xl uppercase tracking-[0.15em] font-black flex flex-row items-center justify-center shadow-[0_10px_40px_rgba(255,0,0,0.3)] gap-3 disabled:opacity-50 hover:scale-105 transition-all group"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform"/>} 
          {isSaving ? 'Saving Assets...' : 'Save All Changes'}
        </button>
      </div>

      {success && (
        <div className="bg-red-600/10 border border-red-600/30 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-4 font-black uppercase tracking-widest text-[11px] animate-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.4)]">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          Homepage visuals updated successfully!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <AssetCard 
          title="Hero Main Background" 
          field="hero_bg" 
          description="Large background image behind the hero section"
        />
        <AssetCard 
          title="Why Choose Us Image" 
          field="why_choose_us_img" 
          description="Featured illustration in Why Choose Us section"
        />
        <AssetCard 
          title="Training Programs Image" 
          field="training_programs_img" 
          description="Featured illustration in Training Programs section"
        />
        <AssetCard 
          title="Training Centers Image" 
          field="training_centers_img" 
          description="Card image for the training centers section"
        />
      </div>

      <div className="bg-[#111] border border-white/5 rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 rounded-[20px] bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">Information System Tip</h4>
          <p className="text-gray-500 text-xs leading-relaxed font-medium">To revert to the associations's official photography, click the <span className="text-red-500 font-bold">Reset</span> button on any card. Ensure all uploaded images are optimized for web to maintain fast load times.</p>
        </div>
      </div>
    </div>
  );
};
