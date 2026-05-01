import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowRight, Filter } from 'lucide-react';

const events = [
  { id: 1, title: 'Mega Blood Donation Camp', date: '2025-04-20', time: '9:00 AM – 4:00 PM', location: 'HICC, Hyderabad', category: 'blood', status: 'upcoming', attendees: 245, capacity: 500, desc: 'Join our biggest blood donation camp of the year. Free health checkup, refreshments, and certificates for all donors.', emoji: '🩸' },
  { id: 2, title: 'Weekend Food Drive', date: '2025-04-13', time: '8:00 AM – 12:00 PM', location: 'Secunderbad Railway Station', category: 'food', status: 'upcoming', attendees: 89, capacity: 150, desc: 'Distributing hot meals and nutrition packets to daily wage workers and homeless individuals near the railway hub.', emoji: '🍱' },
  { id: 3, title: 'Summer Clothes Collection Drive', date: '2025-04-27', time: '10:00 AM – 6:00 PM', location: 'Inorbit Mall, Cyberabad', category: 'clothes', status: 'upcoming', attendees: 134, capacity: 300, desc: 'Collect and sort donated clothes for distribution across 5 rehabilitation centers before summer hits.', emoji: '👕' },
  { id: 4, title: 'Volunteer Training Workshop', date: '2025-04-19', time: '2:00 PM – 6:00 PM', location: 'Online (Zoom)', category: 'training', status: 'upcoming', attendees: 67, capacity: 100, desc: 'Orientation session for new volunteers covering protocols, safety, communication, and impact measurement.', emoji: '📚' },
  { id: 5, title: 'Annual Fundraising Gala', date: '2025-03-15', time: '7:00 PM – 11:00 PM', location: 'Taj Krishna, Hyderabad', category: 'fundraiser', status: 'past', attendees: 380, capacity: 400, desc: 'Our annual charity gala raised ₹28 lakhs for education and healthcare programs. Thank you to all attendees!', emoji: '🎪', raised: '₹28 Lakhs' },
  { id: 6, title: 'Republic Day Blood Camp', date: '2025-01-26', time: '9:00 AM – 3:00 PM', location: 'NTR Stadium, Hyderabad', category: 'blood', status: 'past', attendees: 612, capacity: 600, desc: 'Special Republic Day camp where 612 units of blood were collected. Record-breaking participation!', emoji: '🩸', units: '612 units' },
];

const filters = ['all', 'upcoming', 'past', 'blood', 'food', 'clothes', 'training'];

const catColor = {
  blood: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
  food: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  clothes: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  training: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
  fundraiser: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
};

export default function Events() {
  const [filter, setFilter] = useState('all');

  const filtered = events.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'upcoming' || filter === 'past') return e.status === filter;
    return e.category === filter;
  });

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-widest">Events & Programs</span>
          <h1 className="section-title mt-3 mb-4">Join Our Social Drives</h1>
          <p className="section-subtitle mx-auto">Participate in upcoming events or see the impact of past programs.</p>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <Filter className="w-4 h-4 text-gray-400 self-center mr-1" />
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-crimson-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="glass-card overflow-hidden group">
              {/* Top Banner */}
              <div className={`px-5 py-4 flex items-center justify-between ${event.status === 'upcoming' ? 'bg-gradient-to-r from-crimson-50 to-rose-50 dark:from-crimson-950/30 dark:to-rose-950/30' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                <div className="text-3xl">{event.emoji}</div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${catColor[event.category]}`}>
                    {event.category}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${event.status === 'upcoming' ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                    {event.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">{event.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">{event.desc}</p>

                <div className="space-y-2 text-sm mb-5">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-crimson-400 shrink-0" />
                    {new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-ocean-400 shrink-0" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4 text-purple-400 shrink-0" />
                    {event.attendees} / {event.capacity} registered
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${event.status === 'past' ? 'bg-gray-400' : 'bg-gradient-to-r from-crimson-500 to-rose-400'}`}
                      style={{ width: `${Math.min((event.attendees / event.capacity) * 100, 100)}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{Math.round((event.attendees / event.capacity) * 100)}% capacity filled</p>
                </div>

                {event.raised && <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3">💰 Raised: {event.raised}</div>}
                {event.units && <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">🩸 Collected: {event.units}</div>}

                {event.status === 'upcoming' ? (
                  <button className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                    Register Now <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-medium cursor-default">
                    Event Completed
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
