import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBookmarks, toggleBookmark, addToHistory } from '../utils/api';
import { BookMarked, Search, Loader2, AlertTriangle, Hash, ChevronRight, Bookmark, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_COLORS = {
  'Criminal': 'bg-white/10 text-white border-white/20',
  'Civil': 'bg-white/10 text-white border-white/20',
  'Family': 'bg-white/10 text-white border-white/20',
  'Evidence': 'bg-white/10 text-white border-white/20',
  'Traffic': 'bg-white/10 text-white border-white/20',
  'Financial': 'bg-white/10 text-white border-white/20',
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLaw, setSelectedLaw] = useState(null);
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      const res = await getBookmarks();
      setBookmarks(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (e, id) => {
    e.stopPropagation();
    try {
      // Optimitic update
      setBookmarks(prev => prev.filter(b => b._id !== id));
      await toggleBookmark(id);
    } catch (err) {
      console.error(err);
      fetchBookmarks(); // Revert on failure
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <BookMarked size={28} className="text-[#d4af37]" />
          Saved Bookmarks
        </h1>
        <p className="text-slate-300 text-sm font-medium">Access your frequently referenced legal sections</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 text-sm font-medium">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="text-[#d4af37] animate-spin" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-[24px] p-8">
          <div className="w-20 h-20 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6 border border-[#d4af37]/20 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <BookMarked size={32} className="text-[#d4af37]" />
          </div>
          <h2 className="font-heading font-bold text-xl text-white mb-2">No bookmarks yet</h2>
          <p className="text-slate-400 text-sm max-w-md text-center mb-8">
            You haven't saved any legal sections yet. Browse the Law Directory and click the bookmark icon on any section to save it here for quick access.
          </p>
          <button onClick={() => navigate('/directory')} className="px-6 py-3 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] font-semibold rounded-xl border border-[#d4af37]/30 transition-all flex items-center gap-2">
            <Search size={18} />
            Browse Law Directory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
          <AnimatePresence>
            {bookmarks.map((law, i) => (
              <motion.div 
                key={law._id} 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}
                onClick={() => {
                  setSelectedLaw(law);
                  addToHistory(law._id).catch(console.error);
                }}
                className="flex flex-col p-6 rounded-[20px] bg-black/50 backdrop-blur-xl backdrop-grayscale border border-white/20 hover:border-white/50 hover:bg-black/70 transition-all duration-300 cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative"
              >
                {/* Bookmark Button (Always active here) */}
                <button 
                  onClick={(e) => handleRemoveBookmark(e, law._id)}
                  className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10 bg-[#d4af37]/20 text-[#d4af37] hover:bg-red-500/20 hover:text-red-400"
                  title="Remove Bookmark"
                >
                  <Bookmark size={18} className="fill-current" />
                </button>

                <div className="flex items-start mb-4 gap-2 pr-10">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${CATEGORY_COLORS[law.category] || CATEGORY_COLORS['Civil']}`}>
                    {law.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-lg border border-[#d4af37]/20">
                    <Hash size={12} className="text-[#d4af37]" />
                    {law.section}
                  </span>
                </div>
                
                <h3 className="font-heading font-semibold text-lg text-white mb-2 line-clamp-2 leading-tight group-hover:text-[#d4af37] transition-colors">
                  {law.section_title}
                </h3>
                
                <p className="text-slate-300 text-sm line-clamp-3 mb-5 flex-1 leading-relaxed">
                  {law.section_desc}
                </p>
                
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold mt-auto">
                  <span className="text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">{law.act}</span>
                  <span className="text-[#d4af37] flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Read details <ChevronRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedLaw && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedLaw(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-[600px] max-h-[85vh] bg-[#0a0c10] border border-white/10 rounded-[24px] z-50 flex flex-col shadow-[0_10px_50px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 bg-black/40 flex items-start justify-between relative">
                <div className="pr-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${CATEGORY_COLORS[selectedLaw.category] || CATEGORY_COLORS['Civil']}`}>
                      {selectedLaw.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      {selectedLaw.act}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-white leading-tight">
                    {selectedLaw.section_title}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedLaw(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 text-sm font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 px-3 py-1.5 rounded-lg border border-[#d4af37]/20">
                    <Hash size={16} className="text-[#d4af37]" />
                    {selectedLaw.section}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Description</h3>
                  <div className="text-sm text-slate-200 leading-relaxed space-y-4 bg-white/5 border border-white/5 p-5 rounded-xl">
                    {selectedLaw.section_desc}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <button 
                    onClick={(e) => {
                      handleRemoveBookmark(e, selectedLaw._id);
                      setSelectedLaw(null);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                  >
                    <Bookmark size={16} className="fill-current" />
                    Remove Bookmark
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
