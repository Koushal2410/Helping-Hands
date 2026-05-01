import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { id: 1, name: 'Rahul Sharma', role: 'Blood Donor, Hyderabad', avatar: 'RS', color: 'from-red-400 to-crimson-500', rating: 5, text: 'Donating blood through Helping Hands was the most meaningful thing I\'ve done. The staff was professional, the process was smooth, and I received a health report within 2 days. Truly life-changing.' },
  { id: 2, name: 'Priya Patel', role: 'Regular Volunteer, Pune', avatar: 'PP', color: 'from-ocean-400 to-blue-500', rating: 5, text: 'I\'ve been volunteering with Helping Hands every weekend for 2 years. The team is incredible and the impact is visible. We distributed 12,000 meals last year. I\'m proud to be part of this family.' },
  { id: 3, name: 'Arjun Nair', role: 'Corporate Donor, Bengaluru', avatar: 'AN', color: 'from-amber-400 to-orange-500', rating: 5, text: 'Our company donated ₹5 lakhs through Helping Hands. The transparency in fund utilization and the impact reports they provided were exceptional. We\'ll definitely partner again this year.' },
  { id: 4, name: 'Sneha Iyer', role: 'Clothes Drive Organizer', avatar: 'SI', color: 'from-purple-400 to-violet-500', rating: 5, text: 'I organized a clothes collection drive at my apartment complex. Helping Hands collected 200+ kg of clothes and distributed them to 3 shelters within a week. Super organized and transparent!' },
  { id: 5, name: 'Vikram Desai', role: 'Food Donor, Mumbai', avatar: 'VD', color: 'from-green-400 to-teal-500', rating: 5, text: 'As a hotel owner, partnering with Helping Hands for our surplus food has been amazing. Instead of wasting food, we now feed 100+ people daily. This is purpose-driven business!' },
  { id: 6, name: 'Kavitha Reddy', role: 'Beneficiary & Volunteer', avatar: 'KR', color: 'from-pink-400 to-rose-500', rating: 5, text: 'I received help from Helping Hands during a tough time. Now I volunteer with them every month. They don\'t just give aid — they restore dignity and build community. Forever grateful.' },
];

const stats = [
  { value: '4.9/5', label: 'Average Rating', emoji: '⭐' },
  { value: '98%', label: 'Would Recommend', emoji: '🤝' },
  { value: '2,847+', label: 'Happy Donors', emoji: '❤️' },
  { value: '891+', label: 'Active Volunteers', emoji: '🙌' },
];

export default function Testimonials() {
  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-pink-500 font-semibold text-sm uppercase tracking-widest">Real Stories</span>
          <h1 className="section-title mt-3 mb-4">Voices of Impact</h1>
          <p className="section-subtitle mx-auto">Hear from donors, volunteers, and community members whose lives have been touched by Helping Hands.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-5 text-center">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="font-display text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
              className="glass-card p-7 relative group">
              <Quote className="absolute top-5 right-5 w-8 h-8 text-gray-100 dark:text-gray-800 group-hover:text-crimson-100 dark:group-hover:text-crimson-950 transition-colors" />
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">"{t.text}"</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 text-center p-12 rounded-3xl bg-gradient-to-br from-crimson-50 to-rose-50 dark:from-crimson-950/30 dark:to-rose-950/30 border border-crimson-100 dark:border-crimson-900">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Story Could Be Next</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Join thousands of people who are already making a difference.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/donate" className="btn-primary">Start Donating</a>
            <a href="/volunteer" className="btn-ghost">Become a Volunteer</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
