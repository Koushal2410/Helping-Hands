import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Droplets, Utensils, Shirt, CreditCard, Calendar, Award, TrendingUp, Download } from 'lucide-react';
import { getDonationHistory } from '../utils/api';
import { CardSkeleton } from '../components/Skeleton';

const typeIcon = { Blood: Droplets, Food: Utensils, Clothes: Shirt, Money: CreditCard };
const typeColor = {
  Blood: 'from-red-500 to-crimson-500 text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400',
  Food: 'from-amber-500 to-orange-500 text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
  Clothes: 'from-ocean-500 to-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400',
  Money: 'from-purple-500 to-violet-500 text-purple-700 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400',
};

export default function Dashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDonationHistory().then(res => {
      setDonations(res.donations || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalAmount = donations.filter(d => d.amount > 0).reduce((sum, d) => sum + d.amount, 0);
  const byType = donations.reduce((acc, d) => { acc[d.type] = (acc[d.type] || 0) + 1; return acc; }, {});

  const summaryCards = [
    { icon: Heart, label: 'Total Donations', value: donations.length, color: 'from-crimson-500 to-rose-400', sub: 'All time' },
    { icon: CreditCard, label: 'Amount Donated', value: `₹${totalAmount.toLocaleString()}`, color: 'from-purple-500 to-violet-400', sub: 'Total' },
    { icon: Droplets, label: 'Blood Donations', value: byType.Blood || 0, color: 'from-red-500 to-crimson-400', sub: 'Units' },
    { icon: Award, label: 'Impact Score', value: '⭐ Gold', color: 'from-amber-500 to-orange-400', sub: 'Donor tier' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-2">My Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your donations, participation, and impact.</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {loading ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) :
            summaryCards.map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }} className="glass-card p-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{c.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{c.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{c.sub}</div>
              </motion.div>
            ))
          }
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation History */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Donation History</h2>
              <button className="text-sm text-crimson-500 hover:text-crimson-600 font-medium flex items-center gap-1">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
            <div className="glass-card overflow-hidden">
              {loading ? (
                <div className="p-6 space-y-4">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
              ) : donations.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No donations yet. <a href="/donate" className="text-crimson-500 font-medium">Make your first donation!</a></p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {donations.map((d, i) => {
                    const Icon = typeIcon[d.type] || Heart;
                    const colorCls = typeColor[d.type] || typeColor.Money;
                    const parts = colorCls.split(' ');
                    return (
                      <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${parts[2]} ${parts[3] || ''}`}>
                          <Icon className={`w-5 h-5 ${parts[1]}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{d.type} Donation</p>
                          <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {d.amount > 0 && <p className="font-semibold text-gray-900 dark:text-white">₹{d.amount.toLocaleString()}</p>}
                          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full">{d.status}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Achievements
              </h3>
              <div className="space-y-3">
                {[
                  { badge: '🩸', title: 'First Blood Donor', earned: true },
                  { badge: '🍱', title: '10 Meals Funded', earned: donations.filter(d=>d.type==='Food').length > 0 },
                  { badge: '⭐', title: 'Gold Tier Donor', earned: totalAmount >= 1000 },
                  { badge: '🤝', title: 'Community Hero', earned: donations.length >= 5 },
                ].map((a, i) => (
                  <div key={a.title} className={`flex items-center gap-3 p-2.5 rounded-xl ${a.earned ? 'bg-amber-50 dark:bg-amber-950/30' : 'opacity-40 bg-gray-50 dark:bg-gray-800'}`}>
                    <span className="text-xl">{a.badge}</span>
                    <span className={`text-sm font-medium ${a.earned ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{a.title}</span>
                    {a.earned && <span className="ml-auto text-xs text-amber-500">✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-ocean-500" /> Quick Actions
              </h3>
              <div className="space-y-2.5">
                <a href="/donate" className="block btn-primary text-sm py-2.5 text-center">Make a Donation</a>
                <a href="/volunteer" className="block btn-secondary text-sm py-2.5 text-center">Join Event</a>
                <a href="/events" className="block btn-ghost text-sm py-2.5 text-center">View Events</a>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="glass-card p-6 bg-gradient-to-br from-crimson-50 to-rose-50 dark:from-crimson-950/20 dark:to-rose-950/20 border-crimson-100 dark:border-crimson-900">
              <h3 className="font-semibold text-crimson-700 dark:text-crimson-400 mb-3">Your Impact</h3>
              <div className="space-y-2 text-sm text-crimson-600 dark:text-crimson-300">
                <p>❤️ {donations.length} lives touched</p>
                <p>🍱 ~{(totalAmount / 50).toFixed(0)} meals funded</p>
                <p>🌍 Part of India's top 5% donors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
