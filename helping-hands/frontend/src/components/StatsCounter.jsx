import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const stats = [
  { value: 2847, suffix: '+', label: 'Total Donors', color: 'from-crimson-500 to-rose-400', emoji: '❤️' },
  { value: 634, suffix: '+', label: 'Blood Units', color: 'from-red-600 to-crimson-400', emoji: '🩸' },
  { value: 12400, suffix: '+', label: 'Meals Served', color: 'from-amber-500 to-orange-400', emoji: '🍱' },
  { value: 891, suffix: '+', label: 'Volunteers', color: 'from-ocean-500 to-blue-400', emoji: '🤝' },
];

export default function StatsCounter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="py-20 bg-gray-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-crimson-600/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-ocean-600/10 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-4xl mb-3">{s.emoji}</div>
              <div className={`text-4xl md:text-5xl font-display font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-1`}>
                {inView ? <CountUp end={s.value} duration={2.5} separator="," suffix={s.suffix} /> : '0'}
              </div>
              <p className="text-gray-400 text-sm font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
