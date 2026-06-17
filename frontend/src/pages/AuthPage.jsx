import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Scale, Loader2, AlertTriangle, ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { login, register, googleAuth } from '../utils/api';

export default function AuthPage({ onAuth }) {
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPw, setShowPw]   = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = mode === 'login'
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);
      onAuth(res.token);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const res = await googleAuth(credentialResponse.credential);
      onAuth(res.token);
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#0a0c10] relative overflow-hidden text-slate-50 font-sans">
      
      {/* Background Image - NO DARK OVERLAY */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop")' 
        }}
      />

      {/* Subtle background gradient */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px] relative z-10 flex flex-col items-center"
      >
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)] mb-6 bg-black/40 backdrop-blur-md">
            <Scale size={32} className="text-[#d4af37]" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading font-medium text-3xl tracking-tight text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-300 text-sm font-medium">
            {mode === 'login' ? 'Sign in to continue your legal journey' : 'Register to start your legal journey'}
          </p>
        </div>

        {/* Auth Container with Border */}
        <div className="w-full bg-black/40 backdrop-blur-2xl border border-[#d4af37]/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-[24px] p-8 sm:p-10 relative overflow-hidden">
          
          {/* Underline Tabs */}
          <div className="flex border-b border-white/10 mb-8">
            <button onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 pb-3 text-base font-semibold transition-all duration-300 relative ${
                mode === 'login' ? 'text-[#d4af37]' : 'text-slate-400 hover:text-slate-200'
              }`}>
              Sign In
              {mode === 'login' && <motion.div layoutId="tab-indicator" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#d4af37]" />}
            </button>
            <button onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 pb-3 text-base font-semibold transition-all duration-300 relative ${
                mode === 'register' ? 'text-[#d4af37]' : 'text-slate-400 hover:text-slate-200'
              }`}>
              Create Account
              {mode === 'register' && <motion.div layoutId="tab-indicator" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#d4af37]" />}
            </button>
          </div>

          <div className="relative z-10 w-full">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0, mb: 0 }} animate={{ opacity: 1, height: 'auto', mb: 24 }} exit={{ opacity: 0, height: 0, mb: 0 }}
                  className="overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 text-sm font-medium">
                    <AlertTriangle size={18} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form key={mode}
                initial={{ opacity: 0, x: mode === 'register' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'register' ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={submit}
                className="space-y-6"
              >
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input className="w-full bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-xl pl-11 pr-4 py-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60" placeholder="Enter your name" value={form.name} onChange={e => set('name', e.target.value)} required />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest cursor-pointer">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input type="email" className="w-full bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-xl pl-11 pr-4 py-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60" placeholder="Enter your email" value={form.email} onChange={e => set('email', e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest cursor-pointer">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input type={showPw ? 'text' : 'password'} className="w-full bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-xl pl-11 pr-12 py-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60" placeholder="Enter your password"
                      value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {mode === 'login' && (
                    <div className="flex justify-end mt-3">
                      <button type="button" className="text-sm font-semibold text-[#d4af37] hover:text-[#e5c358] transition-colors cursor-pointer drop-shadow-md">
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading}
                  style={{ background: 'linear-gradient(to right, #c69a45, #dfb867)', color: '#111' }}
                  className="w-full py-4 mt-4 rounded-xl text-base font-bold flex items-center justify-between px-6 hover:brightness-110 transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  <span className="flex-1 text-center pl-4">{loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In' : 'Create Account')}</span>
                  {loading ? <Loader2 size={20} className="animate-spin text-[#111]" /> : <ArrowRight size={20} className="text-[#111]" />}
                </button>

                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-widest drop-shadow-md">Or continue with</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>

                <div className="flex justify-center w-full cursor-pointer bg-white rounded flex items-center justify-center overflow-hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Sign-In failed')}
                    theme="outline"
                    width="100%"
                    shape="rectangular"
                    size="large"
                    text={mode === 'login' ? 'signin_with' : 'signup_with'}
                  />
                </div>

              </motion.form>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck size={16} />
          <p className="text-[11px] font-medium">
            Your data is secure with enterprise-grade encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}
