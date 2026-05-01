import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Clock, Star, MessageSquare, CheckCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerVolunteer } from '../utils/api';

const skills = ['Teaching', 'Medical', 'Driving', 'Cooking', 'Photography', 'Event Management', 'Social Media', 'Fundraising', 'Counseling', 'First Aid'];

const perks = [
  { emoji: '🏅', title: 'Volunteer Certificate', desc: 'Get certified recognition for your service hours.' },
  { emoji: '🌟', title: 'Skill Development', desc: 'Training workshops and leadership programs.' },
  { emoji: '🤝', title: 'Community Network', desc: 'Connect with 800+ like-minded volunteers.' },
  { emoji: '📊', title: 'Impact Reports', desc: 'See exactly how your contribution is making a difference.' },
];

export default function Volunteer() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', availability: '', skills: [], message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (skill) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter(s => s !== skill) : [...p.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.location || !form.availability) {
      toast.error('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      await registerVolunteer(form);
      setSubmitted(true);
      toast.success('Welcome to the Helping Hands family! 🎉');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">You're In! 🎉</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Welcome, <strong>{form.name}</strong>! Your volunteer registration is confirmed. Our coordinator will reach out to you at <strong>{form.email}</strong> within 48 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setSubmitted(false)} className="btn-ghost">Register Another</button>
            <a href="/events" className="btn-primary">View Events</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-gray-950 mesh-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-ocean-500 font-semibold text-sm uppercase tracking-widest">Join the Movement</span>
          <h1 className="section-title mt-3 mb-4">Become a Volunteer</h1>
          <p className="section-subtitle mx-auto">Give your time, skills, and energy to make our society a better place for everyone.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Perks */}
          <div className="space-y-5">
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">Why Volunteer with Us?</h3>
            {perks.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-5 flex gap-4">
                <div className="text-3xl">{p.emoji}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{p.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{p.desc}</p>
                </div>
              </motion.div>
            ))}
            <div className="glass-card p-5 bg-gradient-to-br from-ocean-50 to-blue-50 dark:from-ocean-950/30 dark:to-blue-950/30 border-ocean-200 dark:border-ocean-800">
              <p className="text-sm text-ocean-700 dark:text-ocean-300 font-medium">💬 "Volunteering with Helping Hands changed my life. I've met incredible people and made a real difference."</p>
              <p className="text-xs text-ocean-500 mt-2">— Priya R., Volunteer since 2022</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: 'name', label: 'Full Name *', icon: User, type: 'text', placeholder: 'Rahul Sharma' },
                  { key: 'email', label: 'Email Address *', icon: Mail, type: 'email', placeholder: 'rahul@example.com' },
                  { key: 'phone', label: 'Phone Number *', icon: Phone, type: 'tel', placeholder: '98765 43210' },
                  { key: 'location', label: 'City / Area *', icon: MapPin, type: 'text', placeholder: 'Hyderabad, Telangana' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
                    <div className="relative">
                      <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="input-field pl-10" />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <Clock className="inline w-4 h-4 mr-1" />Availability *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { val: 'weekdays', label: 'Weekdays' },
                    { val: 'weekends', label: 'Weekends' },
                    { val: 'both', label: 'Both' },
                    { val: 'flexible', label: 'Flexible' },
                  ].map(o => (
                    <button type="button" key={o.val}
                      onClick={() => setForm(p => ({ ...p, availability: o.val }))}
                      className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${form.availability === o.val ? 'border-ocean-500 bg-ocean-50 dark:bg-ocean-950/30 text-ocean-600 dark:text-ocean-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <Star className="inline w-4 h-4 mr-1" />Skills (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <button type="button" key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.skills.includes(skill) ? 'border-crimson-500 bg-crimson-50 dark:bg-crimson-950/30 text-crimson-600 dark:text-crimson-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <MessageSquare className="inline w-4 h-4 mr-1" />Why do you want to volunteer?
                </label>
                <textarea rows={4} placeholder="Tell us your motivation and how you'd like to contribute..."
                  value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="input-field resize-none" />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                {loading ? <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}
