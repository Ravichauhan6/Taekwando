import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, Play, X, ExternalLink, Filter, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TABS = ['All', 'Photos', 'Videos'];

interface MediaItem {
  _id: string;
  title: string;
  url: string;
  category: 'Images' | 'Videos';
  date: string;
}

export const Gallery = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetch('/api/media')
      .then(r => r.json())
      .then(data => setItems(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = items.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Photos') return item.category === 'Images';
    if (activeTab === 'Videos') return item.category === 'Videos';
    return true;
  });

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnail = (item: MediaItem) => {
    if (item.category === 'Videos' && isYouTube(item.url)) {
      const id = getYouTubeId(item.url);
      return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }
    return item.url;
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white relative flex flex-col items-center pb-20">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Header Section */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-32 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.2)] inline-flex">
              <ImageIcon className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-widest uppercase mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            MEDIA <span className="text-red-600">GALLERY</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-widest max-w-2xl mx-auto uppercase text-xs md:text-sm">
            Capturing the Spirit of Taekwondo — Moments of Power & Discipline
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-900 mx-auto mt-8 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.8)]" />
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="flex justify-center flex-wrap gap-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border transition-all duration-300 relative group overflow-hidden ${
                activeTab === tab
                  ? 'border-red-500/50 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-red-500/30 hover:text-white'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-900 -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab === 'Photos' && <ImageIcon className="w-3.5 h-3.5" />}
                {tab === 'Videos' && <Video className="w-3.5 h-3.5" />}
                {tab}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 relative z-10 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin shadow-[0_0_20px_rgba(255,0,0,0.2)]" />
            <p className="text-red-500 font-bold tracking-widest text-xs uppercase animate-pulse">Loading Moments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white/[0.02] border border-white/5 rounded-[32px] backdrop-blur-sm"
          >
            <ImageIcon className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-black text-white/50 mb-2 tracking-widest uppercase">The Gallery is Quiet</h3>
            <p className="text-gray-600 text-sm tracking-wide">New memories will be shared here soon.</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative aspect-square bg-[#111] rounded-[24px] overflow-hidden border border-white/5 hover:border-red-500/40 transition-all duration-500 cursor-pointer shadow-2xl"
                  onClick={() => setSelectedMedia(item)}
                >
                  {/* Thumbnail */}
                  <img
                    src={getThumbnail(item)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                    loading="lazy"
                    onError={(e) => {
                       (e.target as any).src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800';
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-xl shadow-lg">
                      {item.category === 'Videos' ? (
                        <Video className="w-4 h-4 text-red-500" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Play Button for Videos */}
                  {item.category === 'Videos' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-300">
                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Item Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {item.category === 'Images' ? 'Photography' : 'Featured Video'}
                    </p>
                    <h3 className="text-white font-bold text-sm tracking-wide leading-tight group-hover:text-red-500 transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  {/* Zoom Icon on Hover */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="w-5 h-5 text-white/50" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox / Video Player Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/95"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.05)_0%,transparent_70%)]" />
            
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-6 right-6 z-[110] bg-white/5 hover:bg-red-600 p-3 rounded-full text-white transition-all border border-white/10 hover:border-red-500 shadow-2xl"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(255,0,0,0.2)] border border-white/10"
            >
              {selectedMedia.category === 'Videos' ? (
                isYouTube(selectedMedia.url) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYouTubeId(selectedMedia.url)}?autoplay=1&rel=0`}
                    title={selectedMedia.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                  ></video>
                )
              ) : (
                <div className="w-full h-full flex flex-col">
                  <div className="flex-1 min-h-0">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="bg-black/50 backdrop-blur-xl p-8 border-t border-white/10">
                    <h3 className="text-2xl font-black text-white mb-2 tracking-widest uppercase">{selectedMedia.title}</h3>
                    <div className="flex items-center gap-4">
                       <span className="text-red-500 font-bold text-xs tracking-widest uppercase">HD Collection</span>
                       <div className="w-1 h-1 rounded-full bg-white/20" />
                       <span className="text-gray-400 text-xs tracking-widest">{new Date(selectedMedia.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
