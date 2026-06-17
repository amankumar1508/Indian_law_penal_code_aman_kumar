import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Ban, UserCog, Loader2, AlertTriangle, RefreshCw, MoreVertical } from 'lucide-react';
import { getUsers, toggleBan, changeRole } from '../utils/api';

export default function AdminPanel() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBan = async (id) => {
    setActionLoading(id + '_ban');
    try {
      await toggleBan(id);
      await fetchUsers();
    } catch (e) { alert(e.message); }
    finally { setActionLoading(null); }
  };

  const handleRoleChange = async (id, newRole) => {
    setActionLoading(id + '_role');
    try {
      await changeRole(id, newRole);
      await fetchUsers();
    } catch (e) { alert(e.message); }
    finally { setActionLoading(null); }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-3xl text-white flex items-center gap-3 mb-2">
            <Shield size={28} className="text-indigo-400" /> Admin Panel
          </h1>
          <p className="text-slate-400 text-sm">Manage user access, roles, and platform moderation</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-lg rounded-2xl p-6">
          <Users size={20} className="text-indigo-400 mb-3" />
          <div className="font-heading font-bold text-3xl text-white mb-1">{users.length}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Users</div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-lg rounded-2xl p-6">
          <UserCog size={20} className="text-emerald-400 mb-3" />
          <div className="font-heading font-bold text-3xl text-emerald-400 mb-1">{users.filter(u => u.role === 'Admin').length}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Administrators</div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-lg rounded-2xl p-6">
          <Ban size={20} className="text-red-400 mb-3" />
          <div className="font-heading font-bold text-3xl text-red-400 mb-1">{users.filter(u => u.isBanned).length}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Banned Accounts</div>
        </div>
      </div>

      {/* User table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/20 border-b border-white/5">
                {['User', 'Email', 'Role & Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {users.map((u, i) => (
                  <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-slate-100 font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${u.role === 'Admin' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-300 border-white/10'}`}>
                          {u.role}
                        </span>
                        {u.isBanned && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                            Banned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleBan(u._id)} disabled={actionLoading === u._id + '_ban'}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-w-[70px] flex justify-center border ${
                            u.isBanned 
                              ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' 
                              : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                          }`}>
                          {actionLoading === u._id + '_ban' ? <Loader2 size={14} className="animate-spin" /> : (u.isBanned ? 'Unban' : 'Ban')}
                        </button>
                        <button onClick={() => handleRoleChange(u._id, u.role === 'Admin' ? 'User' : 'Admin')} disabled={actionLoading === u._id + '_role'}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all min-w-[90px] flex justify-center">
                          {actionLoading === u._id + '_role' ? <Loader2 size={14} className="animate-spin" /> : (u.role === 'Admin' ? 'Demote' : 'Make Admin')}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
