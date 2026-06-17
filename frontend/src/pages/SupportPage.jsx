import { useState, useRef, useEffect } from 'react';
import { HelpCircle, MessageSquare, Mail, Phone, ChevronDown, Send, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  { q: 'How do I search for specific sections?', a: 'Use the search bar in the Law Directory to search by keyword, section number, or legal topic.' },
  { q: 'Can I download laws for offline viewing?', a: 'Currently, the database is strictly online to ensure all legal references are perfectly up-to-date with recent amendments.' },
  { q: 'How do I bookmark a section?', a: 'Click the bookmark icon in the top right corner of any legal section card in the Directory to save it.' }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Hello! I am the LexVantage support bot. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    setChatInput('');

    // Mock bot reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Thanks for reaching out! Our live agents are currently busy, but your message has been recorded.' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full space-y-6 relative">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <HelpCircle size={28} className="text-[#d4af37]" />
          Help & Support
        </h1>
        <p className="text-slate-300 text-sm font-medium">Get assistance and answers to common questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* FAQs */}
        <div className="bg-black/50 backdrop-blur-xl backdrop-grayscale border border-white/10 rounded-[24px] p-6 sm:p-8 h-fit">
          <h2 className="font-heading text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i} 
                className="rounded-xl bg-black/50 border border-white/5 overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <h3 className={`text-sm font-bold transition-colors ${openFaq === i ? 'text-[#d4af37]' : 'text-white'}`}>
                    {faq.q}
                  </h3>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#d4af37]' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3 mt-1">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="space-y-6">
          <div className="bg-black/50 backdrop-blur-xl backdrop-grayscale border border-white/10 rounded-[24px] p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Contact Us</h2>
            <p className="text-slate-400 text-sm mb-6">Need specialized technical support or have a billing inquiry? Reach out to our dedicated team.</p>
            
            <div className="space-y-4">
              <a href="mailto:support@lexvantage.com" className="flex items-center gap-4 p-4 rounded-xl bg-black/50 border border-white/5 hover:border-[#d4af37]/30 transition-all cursor-pointer group outline-none focus:ring-2 focus:ring-[#d4af37]/50">
                <Mail className="text-slate-400 group-hover:text-[#d4af37]" size={20} />
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors">Email Support</h3>
                  <p className="text-xs text-slate-400">support@lexvantage.com</p>
                </div>
              </a>
              <a href="tel:+18001234567" className="flex items-center gap-4 p-4 rounded-xl bg-black/50 border border-white/5 hover:border-[#d4af37]/30 transition-all cursor-pointer group outline-none focus:ring-2 focus:ring-[#d4af37]/50">
                <Phone className="text-slate-400 group-hover:text-[#d4af37]" size={20} />
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors">Phone Support</h3>
                  <p className="text-xs text-slate-400">+1 (800) 123-4567</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-xl backdrop-grayscale border border-[#d4af37]/30 rounded-[24px] p-6 sm:p-8 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-white mb-1">Live Chat</h2>
              <p className="text-xs text-slate-300">Available 24/7 for premium members</p>
            </div>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-12 h-12 rounded-full bg-[#d4af37] text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              <MessageSquare size={20} className="fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-[calc(100%-2rem)] sm:w-[400px] h-[500px] bg-[#0a0c10] border border-white/10 rounded-[24px] z-50 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center border border-[#d4af37]/30">
                    <Bot size={20} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">LexVantage Support</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Messages */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[#d4af37] text-black font-medium rounded-tr-sm' 
                        : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/40 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50 placeholder:text-slate-500"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="w-10 h-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center border border-[#d4af37]/30 hover:bg-[#d4af37]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
