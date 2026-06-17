import { useState, useEffect } from 'react';
import { History, Book, Clock, ChevronRight, Loader2, AlertTriangle, Hash, Trash2 } from 'lucide-react';
import { getHistory, clearHistory } from '../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      setHistoryItems(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your viewing history?')) return;
    setClearing(true);
    try {
      await clearHistory();
      setHistoryItems([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <History size={28} className="text-[#d4af37]" />
          Recently Viewed Laws
        </h1>
        <p className="text-slate-300 text-sm font-medium">Review your recently accessed legal sections</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 text-sm font-medium">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 bg-black/50 backdrop-blur-xl backdrop-grayscale border border-white/10 rounded-[24px] p-6 sm:p-8 flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h2 className="font-heading text-xl font-bold text-white">Recent Activity</h2>
          {historyItems.length > 0 && (
            <button 
              onClick={handleClearHistory}
              disabled={clearing}
              className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {clearing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Clear History
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 size={32} className="text-[#d4af37] animate-spin" />
          </div>
        ) : historyItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <History size={32} className="opacity-50" />
            </div>
            <p className="text-lg font-medium text-white mb-1">No history found</p>
            <p className="text-sm text-center max-w-sm">You haven't viewed any laws yet. Browse the directory to start building your history.</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {historyItems.map((item, idx) => {
              if (!item.law) return null; // Handle cases where law might have been deleted from DB
              return (
                <div 
                  key={`${item._id}-${idx}`} 
                  onClick={() => navigate('/directory')}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-black/50 border border-white/5 hover:border-[#d4af37]/30 hover:bg-black/60 transition-all cursor-pointer group gap-4 sm:gap-0"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-[#d4af37]/10 group-hover:text-[#d4af37] transition-colors mt-1 sm:mt-0">
                      <Book size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                          <Hash size={10} className="text-[#d4af37]" />
                          {item.law.section}
                        </span>
                        <h3 className="font-semibold text-white group-hover:text-[#d4af37] transition-colors line-clamp-1">{item.law.section_title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Clock size={12} /> {formatDistanceToNow(new Date(item.viewedAt), { addSuffix: true })}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="truncate max-w-[120px] sm:max-w-none">{item.law.act}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block"></span>
                        <span className="hidden sm:block">{item.law.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                    <span className="sm:hidden text-xs text-slate-500 font-medium">{item.law.category}</span>
                    <ChevronRight size={18} className="text-slate-500 group-hover:text-[#d4af37] sm:opacity-0 sm:group-hover:opacity-100 sm:-translate-x-2 sm:group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
