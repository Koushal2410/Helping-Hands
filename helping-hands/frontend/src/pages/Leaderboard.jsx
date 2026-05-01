import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Heart, Crown } from 'lucide-react';

const topDonors = [
  { rank: 1, name: 'Vikram Desai', city: 'Mumbai', amount: 25000, donations: 18, badge: '👑', tier: 'Platinum' },
  { rank: 2, name: 'Arjun Nair', city: 'Bengaluru', amount: 15000, donations: 12, badge: '🥇', tier: 'Gold' },
  { rank: 3, name: 'Sneha Iyer', city: 'Hyderabad', amount: 10500, donations: 9, badge: '🥈', tier: 'Gold' },
  { rank: 4, name: 'Priya Patel', city: 'Pune', amount: 8000, donations: 14, badge: '🥉', tier: 'Silver' },
  { rank: 5, name: 'Rahul Sharma', city: 'Delhi', amount: 6500, donations: 8, badge: '⭐', tier: 'Silver' },
  { rank: 6, name: 'Meena Rao', city: 'Chennai', amount: 5000, donations: 11, badge: '⭐', tier: 'Silver' },
  { rank: 7, name: 'Kavitha Reddy', city: 'Guntur', amount: 4200, donations: 7, badge: '⭐', tier: 'Bronze' },
  { rank: 8, name: 'Suresh Babu', city: 'Vizag', amount: 3800, donations: 6, badge: '⭐', tier: 'Bronze' },
  { rank: 9, name: 'Divya Krishna', city: 'Guntur', amount: 2500, donations: 5, badge: '⭐', tier: 'Bronze' },
  { rank: 10, name: 'Amit Kumar', city: 'Kolkata', amount: 2000, donations: 4, badge: '⭐', tier: 'Bronze' },
];

const tierColor = {
  Platinum: 'from-purple-400 to-violet-500',
  Gold: 'from-amber-400 to-yellow-500',
  Silver: 'from-gray-300 to-gray-400',
  Bronze: 'from-amber-600 to-orange-600',
};

const tierBg = {
  Platinum: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  Gold: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Silver: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Bronze: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
};

export default function Leaderboard() {
  const top3 = topDonors.slice(0, 3);
  const rest = topDonors.slice(3);

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-widest">Hall of Fame</span>
          <h1 className="section-title mt-3 mb-4">Top Donors Leaderboard</h1>
          <p className="section-subtitle mx-auto">Celebrating our most generous hearts this month. Every act of giving counts!</p>
        </motion.div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-12">
          {[top3[1], top3[0], top3[2]].map((donor, i) => {
            const heights = ['h-32', 'h-40', 'h-28'];
            const positions = [2, 1, 3];
            const pos = positions[i];
            return (
              <motion.div key={donor.rank} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center gap-3 flex-1 max-w-[140px]">
                <div className="text-3xl mb-1">{donor.badge}</div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-crimson-500 to-rose-400 flex items-center justify-center text-white font-bold shadow-lg">
                  {donor.name.charAt(0)}
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{donor.name}</p>
                  <p className="text-xs text-gray-500">{donor.city}</p>
                  <p className="text-sm font-bold text-crimson-500 mt-0.5">₹{donor.amount.toLocaleString()}</p>
                </div>
                <div className={`w-full ${heights[i]} bg-gradient-to-t ${tierColor[donor.tier]} rounded-t-2xl flex items-center justify-center`}>
                  <span className="text-white font-display font-bold text-2xl">#{pos}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-3">
          {rest.map((donor, i) => (
            <motion.div key={donor.rank} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ x: 4 }}
              className="glass-card p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 text-sm shrink-0">
                #{donor.rank}
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-400 to-rose-500 flex items-center justify-center text-white font-bold shrink-0">
                {donor.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">{donor.name}</p>
                <p className="text-xs text-gray-500">{donor.city} • {donor.donations} donations</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tierBg[donor.tier]}`}>{donor.tier}</span>
              <p className="font-bold text-gray-900 dark:text-white shrink-0">₹{donor.amount.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-10 text-center p-8 glass-card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <Crown className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">Want to be on this list?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-5 text-sm">Make a donation today and join our community of changemakers!</p>
          <a href="/donate" className="btn-primary inline-flex items-center gap-2"><Heart className="w-4 h-4 fill-white" /> Donate Now</a>
        </motion.div>
      </div>
    </div>
  );
}
