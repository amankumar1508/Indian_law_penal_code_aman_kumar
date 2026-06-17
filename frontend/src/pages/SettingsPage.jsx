import { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Key, Loader2, CheckCircle2, Copy } from 'lucide-react';
import { getMe } from '../utils/api';

const TABS = [
  { id: 'profile', icon: User, label: 'Profile Information' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'privacy', icon: Shield, label: 'Privacy & Security' },
  { id: 'api', icon: Key, label: 'API Keys' }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', bio: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
        setFormData({ name: res.data.name || '', email: res.data.email || '', bio: res.data.bio || '' });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="text-[#d4af37] animate-spin" />
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSave} className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-[#d4af37]/20 flex items-center justify-center border border-[#d4af37]/40 text-2xl font-bold text-[#d4af37]">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <button type="button" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors border border-white/10">
                  Change Avatar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full bg-black/50 border border-white/10 text-white opacity-60 rounded-xl px-4 py-3 text-sm outline-none cursor-not-allowed" 
                />
                <p className="text-[10px] text-slate-500 mt-2">Email address cannot be changed</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Bio / Legal Focus</label>
              <textarea 
                rows={4} 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50 resize-none" 
                placeholder="e.g. Practicing corporate law..."
              />
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-[#c69a45] to-[#dfb867] text-[#111] text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? <><Loader2 size={16} className="animate-spin"/> Saving...</> : 
                 saved ? <><CheckCircle2 size={16}/> Saved</> : 'Save Changes'}
              </button>
            </div>
          </form>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Notification Preferences</h2>
            
            <div className="space-y-4">
              {[
                { title: 'Email Alerts', desc: 'Receive emails when new laws are added to your bookmarked categories.' },
                { title: 'Newsletter', desc: 'Weekly roundup of major legal amendments and supreme court rulings.' },
                { title: 'Security Alerts', desc: 'Get notified of new sign-ins or password changes.' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/50 border border-white/5">
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i !== 1} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button onClick={handleSave} className="px-6 py-3 bg-gradient-to-r from-[#c69a45] to-[#dfb867] text-[#111] text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                {saving ? 'Saving...' : saved ? 'Saved' : 'Save Preferences'}
              </button>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Privacy & Security</h2>
            
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-start">
              <button onClick={handleSave} className="px-6 py-3 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-all">
                {saving ? 'Updating...' : saved ? 'Updated' : 'Update Password'}
              </button>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-heading text-xl font-bold text-white">API Keys</h2>
              <button className="px-4 py-2 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 text-xs font-bold rounded-lg hover:bg-[#d4af37]/20 transition-all">
                + Generate Key
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mb-6">Use these keys to authenticate API requests from your own applications.</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/50 border border-[#d4af37]/30">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white">Production Key</h3>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md uppercase">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black/50 px-3 py-2 rounded-lg text-xs font-mono text-[#d4af37] border border-white/5">
                    lx_prod_9f8e7d6c5b4a3...
                  </code>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Copy Key">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-3">Created on Oct 12, 2025 • Last used 2 hours ago</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <Settings size={28} className="text-[#d4af37]" />
          Settings
        </h1>
        <p className="text-slate-300 text-sm font-medium">Manage your account preferences and security</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 pb-8">
        
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {TABS.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id 
                  ? 'bg-white/10 border border-white/30 text-white' 
                  : 'bg-black/40 border border-white/5 text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-3 bg-black/50 backdrop-blur-xl backdrop-grayscale border border-white/10 rounded-[24px] p-6 sm:p-8 h-fit">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
