import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { toast.error('Please enter a valid email'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const subs = JSON.parse(localStorage.getItem('hh_newsletter') || '[]');
    if (subs.find(s => s.email === email)) { toast.error('Already subscribed!'); setLoading(false); return; }
    subs.push({ email, name, date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('hh_newsletter', JSON.stringify(subs));
    setSubscribed(true);
    toast.success('Subscribed successfully! 🎉');
    setLoading(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-ocean-600 via-ocean-500 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="max-w-2xl mx-auto px-4 text-center relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Bell className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-ocean-100 mb-8">Get updates on upcoming events, donation drives, impact reports, and new programs — delivered straight to your inbox.</p>

          {subscribed ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white/20 backdrop-blur rounded-2xl p-6 flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <p className="text-white font-semibold">You're subscribed! We'll keep you posted. 🎉</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)"
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email *" required
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" />
              <button type="submit" disabled={loading}
                className="px-6 py-3 bg-white text-ocean-600 font-bold rounded-xl hover:bg-ocean-50 transition-colors flex items-center justify-center gap-2 shrink-0 text-sm">
                {loading ? <span className="w-4 h-4 border-2 border-ocean-500/50 border-t-ocean-600 rounded-full animate-spin" /> : <Mail className="w-4 h-4" />}
                Subscribe
              </button>
            </form>
          )}
          <p className="text-ocean-200 text-xs mt-4">No spam. Unsubscribe anytime. We respect your privacy.</p>
        </motion.div>
      </div>
    </section>
  );
}
