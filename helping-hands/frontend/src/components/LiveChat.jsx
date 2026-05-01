import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Shield, Minimize2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BOT_RESPONSES = {
  default: "I'm here to help! You can ask me about blood donation, food programs, volunteering, or how to donate.",
  blood: "🩸 We organize blood donation camps every weekend across Guntur and nearby areas. You just need to be 18–65 years old, weigh above 50kg, and be healthy. Visit our Donate page to register!",
  food: "🍱 Our food donation program works with partner hotels to redirect surplus food to shelters. You can also fund meals — ₹100 feeds 2 people for a day! Check our Donate page.",
  clothes: "👕 We accept clean, gently used clothes of all sizes. Schedule a free home pickup or drop off at our center at Vignan's University, Guntur. Visit the Donate page to start.",
  volunteer: "🤝 We'd love to have you! Fill out our volunteer registration form on the Volunteer page. We have weekend and weekday slots available across Guntur, AP.",
  donate: "❤️ You can donate blood, food, clothes, or money. Head to our Donate page and choose your preferred type. All monetary donations go through secure Razorpay payment.",
  contact: "📞 Reach us at +91 7989444394 or email hello@helpinghands.org.in. We're at Vignan's University, Guntur, Andhra Pradesh. Office hours: Mon–Sat 9AM–6PM.",
  events: "📅 We have upcoming blood donation camps and food drives! Check our Events page for dates, locations, and registration links.",
  tax: "✅ Yes! All monetary donations are 80G eligible — you'll receive a tax exemption certificate via email after your donation.",
  payment: "🔒 We use Razorpay for secure payments. We support UPI, Credit/Debit cards, and Net Banking. Your payment data is never stored on our servers.",
};

const getResponse = (text) => {
  const t = text.toLowerCase();
  if (t.includes('blood')) return BOT_RESPONSES.blood;
  if (t.includes('food') || t.includes('meal')) return BOT_RESPONSES.food;
  if (t.includes('cloth')) return BOT_RESPONSES.clothes;
  if (t.includes('volunteer')) return BOT_RESPONSES.volunteer;
  if (t.includes('donat')) return BOT_RESPONSES.donate;
  if (t.includes('contact') || t.includes('phone') || t.includes('address')) return BOT_RESPONSES.contact;
  if (t.includes('event') || t.includes('camp')) return BOT_RESPONSES.events;
  if (t.includes('tax') || t.includes('80g') || t.includes('receipt')) return BOT_RESPONSES.tax;
  if (t.includes('pay') || t.includes('razorpay') || t.includes('upi')) return BOT_RESPONSES.payment;
  return BOT_RESPONSES.default;
};

const QUICK_QUESTIONS = ['Blood Donation', 'Food Program', 'Volunteer', 'Contact Us'];

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: '👋 Hi! I\'m the Helping Hands assistant. How can I help you today?', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const { isAdmin } = useAuth();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: text.trim(), time: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput('');

    if (!adminMode) {
      setTyping(true);
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      setTyping(false);
      const botMsg = { id: Date.now() + 1, from: 'bot', text: getResponse(text), time: new Date() };
      setMessages(p => [...p, botMsg]);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };

  const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-crimson-500 to-crimson-600 rounded-full shadow-2xl shadow-crimson-500/40 flex items-center justify-center text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-6 h-6" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle className="w-6 h-6" /></motion.div>
          }
        </AnimatePresence>
        {!open && <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
            style={{ height: '480px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-crimson-600 to-crimson-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  {adminMode ? <Shield className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{adminMode ? 'Admin Support' : 'HH Assistant'}</p>
                  <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" /><span className="text-white/70 text-xs">Online</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button onClick={() => setAdminMode(!adminMode)}
                    className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors ${adminMode ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                    {adminMode ? '🛡️ Admin' : '🤖 Bot'}
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white"><Minimize2 className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {msg.from !== 'user' && (
                    <div className="w-7 h-7 rounded-full bg-crimson-100 dark:bg-crimson-900 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-crimson-500" />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-crimson-500 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-400">{fmt(msg.time)}</span>
                  </div>
                  {msg.from === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-ocean-100 dark:bg-ocean-900 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-ocean-500" />
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-crimson-100 dark:bg-crimson-900 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-crimson-500" /></div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1">
                    {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-3 pt-2 pb-1 flex gap-1.5 overflow-x-auto bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="shrink-0 text-xs px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-crimson-50 hover:text-crimson-600 dark:hover:bg-crimson-950 dark:hover:text-crimson-400 transition-colors">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input
                value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Type a message..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-crimson-500 placeholder-gray-400"
              />
              <button onClick={() => sendMessage(input)} disabled={!input.trim()}
                className="w-10 h-10 bg-crimson-500 hover:bg-crimson-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
