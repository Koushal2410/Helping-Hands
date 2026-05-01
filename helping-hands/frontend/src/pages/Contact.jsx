import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendContact } from '../utils/api';

const contactInfo = [
  { icon: MapPin, label: 'Address', value: '12, Seva Marg, Banjara Hills, Hyderabad – 500034', color: 'text-crimson-500' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', color: 'text-ocean-500' },
  { icon: Mail, label: 'Email', value: 'hello@helpinghands.org.in', color: 'text-amber-500' },
  { icon: Clock, label: 'Office Hours', value: 'Mon–Sat: 9:00 AM – 6:00 PM', color: 'text-purple-500' },
];

const faqs = [
  { q: 'How do I know my donation is used properly?', a: 'We publish quarterly utilization reports and provide individual receipts for every donation with 80G tax exemption eligibility.' },
  { q: 'Can I volunteer on weekends only?', a: 'Absolutely! We have flexible schedules. Most of our community programs happen on weekends to accommodate working professionals.' },
  { q: 'How do I donate clothes?', a: 'Schedule a free home pickup through our website or drop off at any of our 8 collection centers across Hyderabad.' },
  { q: 'Is my payment information secure?', a: 'Yes. All payments are processed through Razorpay with bank-grade 256-bit SSL encryption. We never store card details.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    try {
      await sendContact(form);
      setSent(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    } catch {
      toast.error('Failed to send. Please email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-gray-950 mesh-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-ocean-500 font-semibold text-sm uppercase tracking-widest">Get in Touch</span>
          <h1 className="section-title mt-3 mb-4">We'd Love to Hear from You</h1>
          <p className="section-subtitle mx-auto">Have questions, ideas, or want to partner with us? Drop us a message.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-5 flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-0.5">{c.label}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Banjara Hills, Hyderabad</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-xs text-ocean-500 mt-1 block">Open in Maps →</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-10 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Message Sent!</h3>
                <p className="text-gray-500 dark:text-gray-400">We'll respond to <strong>{form.email}</strong> within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn-primary mt-6">Send Another</button>
              </motion.div>
            ) : (
              <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card p-8 space-y-5">
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-crimson-500" /> Send a Message
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field pl-10" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field pl-10" /></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                  <input type="text" placeholder="How can we help?" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                  <textarea rows={5} placeholder="Tell us more about your query, feedback, or partnership idea..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="input-field resize-none" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                  {loading ? <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </motion.form>
            )}

            {/* FAQs */}
            <div className="mt-8 space-y-4">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Frequently Asked Questions</h3>
              {faqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-5">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">{faq.q}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
