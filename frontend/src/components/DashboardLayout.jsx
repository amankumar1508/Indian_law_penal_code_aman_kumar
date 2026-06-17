import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, BookOpen, Search, BarChart3, Shield, LogOut, Menu, X, ChevronRight, Bookmark, Settings, History, HelpCircle } from 'lucide-react';

const NAV = [
  { id: 'directory', path: '/directory', icon: BookOpen,  label: 'Law Directory' },
  { id: 'history',   path: '/history',   icon: History,   label: 'Search History' },
  { id: 'bookmarks', path: '/bookmarks', icon: Bookmark,  label: 'Bookmarks' },
  { id: 'analytics', path: '/analytics', icon: BarChart3, label: 'Analytics', admin: true },
  { id: 'admin',     path: '/admin',     icon: Shield,    label: 'Admin Panel', admin: true },
  { id: 'settings',  path: '/settings',  icon: Settings,  label: 'Settings' },
  { id: 'support',   path: '/support',   icon: HelpCircle,label: 'Help & Support' },
];

export default function DashboardLayout({ children, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black/60 backdrop-blur-2xl border-r border-white/10">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-[14px] bg-black/40 flex items-center justify-center shadow-lg border border-[#d4af37]/30">
          <Scale size={20} className="text-[#d4af37]" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-lg text-white leading-tight tracking-tight">LexVantage</h1>
          <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Database</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Menu</p>
        {NAV.map(({ id, path, icon: Icon, label, admin }) => {
          if (admin && user?.role !== 'Admin') return null;
          const isActive = location.pathname.startsWith(path);
          return (
            <button key={id} onClick={() => handleNav(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                isActive 
                  ? 'bg-[#000000] text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/20' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}>
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span className="flex-1 text-left">{label}</span>
              {isActive && <ChevronRight size={14} className="opacity-50" />}
            </button>
          );
        })}
      </div>

      {/* User / Logout */}
      <div className="p-4 border-t border-white/10">
        {user && (
          <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-black/40 backdrop-blur-xl backdrop-grayscale rounded-xl border border-white/10">
            <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-sm font-bold text-[#d4af37] border border-[#d4af37]/30">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-100 truncate">{user.name}</div>
              <div className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">{user.role}</div>
            </div>
          </div>
        )}
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-transparent hover:border-red-500/20">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen text-slate-50 overflow-hidden relative font-sans">
      
      {/* Background Image adapted from Auth Page */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: 'linear-gradient(to bottom, rgba(10, 12, 16, 0.85), rgba(10, 12, 16, 0.95)), url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop")' 
        }}
      />

      {/* Background glow removed as requested */}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] h-full relative z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
        {/* Topbar Mobile (only visible on mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-black/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-[#d4af37]" />
            <span className="font-heading font-bold text-lg text-white">LexVantage</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative custom-scrollbar">
          <div className="relative z-10 max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
