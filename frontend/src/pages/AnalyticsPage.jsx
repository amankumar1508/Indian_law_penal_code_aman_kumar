import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Eye, Database, TrendingUp, Crown, Loader2, AlertTriangle, Hash } from 'lucide-react';
import { getStats, getTopLaws } from '../utils/api';

const COLORS = {
  indigo:  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  amber:   { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  violet:  { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400' },
};

function KPICard({ icon: Icon, label, value, color, delay }) {
  const c = COLORS[color];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
      className={`rounded-2xl p-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-lg relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-32 h-32 ${c.bg} rounded-full blur-[50px] -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity`} />
      <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center mb-4 relative z-10`}>
        <Icon size={20} className={c.text} />
      </div>
      <div className="font-heading font-bold text-3xl text-white mb-1 relative z-10">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 relative z-10">{label}</div>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats]     = useState(null);
  const [topLaws, setTopLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [s, t] = await Promise.all([getStats(), getTopLaws()]);
        setStats(s.data);
        setTopLaws(t.data || []);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 size={32} className="text-indigo-500 animate-spin" /></div>;

  if (error) return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-8 text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-amber-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-slate-400 text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-heading font-bold text-3xl text-white flex items-center gap-3 mb-2">
          <BarChart3 size={28} className="text-indigo-400" /> Platform Analytics
        </h1>
        <p className="text-slate-400 text-sm">Live metrics and performance data</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard icon={Database} label="Total Laws in DB" value={stats?.totalLaws} color="indigo" delay={0} />
        <KPICard icon={Users} label="Registered Users" value={stats?.totalUsers} color="emerald" delay={0.1} />
        <KPICard icon={Eye} label="Platform Views" value={stats?.totalPlatformViews} color="amber" delay={0.2} />
        <KPICard icon={TrendingUp} label="Uptime (Hours)" value={Math.floor((stats?.uptime || 0) / 3600)} color="violet" delay={0.3} />
      </div>

      {/* Top laws table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3 bg-black/20">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Crown size={16} className="text-amber-400" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-100">Most Viewed Laws</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/20 border-b border-white/5">
                {['Rank', 'Section', 'Title', 'Category', 'Views'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topLaws.map((law, i) => (
                <tr key={law._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold ${i < 3 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-500 bg-white/5'}`}>
                      {i+1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                      <Hash size={12} className="text-slate-500" /> {law.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-200 font-medium max-w-sm truncate">{law.section_title}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/5 px-2.5 py-1 rounded-md">
                      {law.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-300">{(law.views || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
