import { motion } from 'framer-motion';
import { Heart, Target, Eye, Award, Users, Globe } from 'lucide-react';

const team = [
  {
    name: 'K Koushal', role: 'Admin & Founder', initials: 'KK',
    color: 'from-crimson-500 to-rose-600',
    bio: 'Visionary founder of Helping Hands, driven by a mission to harness technology for social good and build a more compassionate India.',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'M Vivek Varma', role: 'Admin 2', initials: 'MV',
    color: 'from-ocean-500 to-blue-600',
    bio: 'Dedicated administrator ensuring smooth operations, volunteer coordination, and community outreach across Andhra Pradesh.',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'K Raghava Ranjith', role: 'Application Manager', initials: 'KR',
    color: 'from-purple-500 to-violet-600',
    bio: 'Manages the technical backbone of Helping Hands, ensuring a seamless digital experience for donors and volunteers alike.',
    social: { linkedin: '#', twitter: '#' }
  },
];

const milestones = [
  { year: '2019', event: 'Helping Hands Founded at Vignan\'s University, Guntur' },
  { year: '2020', event: 'First blood donation camp — 120 units collected' },
  { year: '2021', event: 'Launched food donation program with 5 hotel partners' },
  { year: '2022', event: 'Expanded to 3 cities, 200+ active volunteers' },
  { year: '2023', event: 'Clothes drive reached 3,200 kg distributed' },
  { year: '2024', event: 'Launched digital platform — 2,847+ donors registered' },
  { year: '2025', event: 'Expanding to 12 cities across Andhra Pradesh & Telangana' },
];

const values = [
  { icon: Heart, title: 'Compassion', desc: 'Every action we take is rooted in genuine care for human dignity.' },
  { icon: Target, title: 'Impact-First', desc: 'We measure success in lives changed, not numbers on a page.' },
  { icon: Eye, title: 'Transparency', desc: 'Full accountability on every rupee donated — audited reports published quarterly.' },
  { icon: Globe, title: 'Inclusivity', desc: 'We serve everyone, regardless of caste, religion, or background.' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-crimson-50 via-white to-ocean-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 mesh-bg">
        <div className="max-w-4xl px-4 mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-semibold tracking-widest uppercase text-crimson-500">Our Story</span>
            <h1 className="mt-3 mb-6 section-title">About Helping Hands</h1>
            <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              Founded in 2019 at <strong>Vignan's University, Guntur</strong>, Helping Hands was born from a simple belief —
              that technology can bridge the gap between those who want to help and those who need it most.
              Today, we're a growing movement of volunteers, donors, and changemakers across Andhra Pradesh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2">
            {[
              { icon: Target, title: 'Our Mission', color: 'from-crimson-500 to-rose-400', text: 'To create a connected, compassionate community where every person — regardless of circumstance — has access to basic necessities like blood, food, and clothing through the power of collective giving.' },
              { icon: Eye, title: 'Our Vision', color: 'from-ocean-500 to-blue-400', text: 'A digital India where no life is lost due to lack of blood, no person sleeps hungry, and no child shivers in the cold — because neighbors help neighbors through Helping Hands.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 glass-card">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900 font-display dark:text-white">{item.title}</h3>
                <p className="leading-relaxed text-gray-500 dark:text-gray-400">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Values */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="mb-2 section-title">Our Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-2 gap-5 mb-20 md:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }} className="p-6 text-center glass-card">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-2xl bg-crimson-100 dark:bg-crimson-950/50">
                  <v.icon className="w-6 h-6 text-crimson-500" />
                </div>
                <h4 className="mb-2 font-bold text-gray-900 dark:text-white">{v.title}</h4>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <span className="text-sm font-semibold tracking-widest uppercase text-ocean-500">The People Behind It</span>
            <h2 className="mt-3 mb-4 section-title">Meet Our Team</h2>
            <p className="mx-auto section-subtitle">Driven by passion, powered by purpose — the founding team of Helping Hands.</p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }} className="p-8 text-center glass-card group">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-5 text-white font-display font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  {member.initials}
                </div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 font-display dark:text-white">{member.name}</h3>
                <p className="mb-4 text-sm font-semibold text-crimson-500">{member.role}</p>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
            <h2 className="mb-4 section-title">Our Journey</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-crimson-500 via-ocean-500 to-purple-500" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div key={m.year} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6 pl-0">
                  <div className="z-10 flex items-center justify-center w-16 h-16 text-sm font-bold text-white shadow-lg rounded-2xl bg-gradient-to-br from-crimson-500 to-rose-400 font-display shrink-0">
                    {m.year}
                  </div>
                  <div className="flex-1 p-4 mt-2 glass-card">
                    <p className="font-medium text-gray-700 dark:text-gray-300">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-crimson-600 to-rose-500">
        <div className="max-w-3xl px-4 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold text-white font-display">Be Part of Our Story</h2>
          <p className="mb-8 text-crimson-100">Join us as a donor, volunteer, or partner and help write the next chapter.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a href="/donate" className="bg-white text-crimson-600 font-bold px-8 py-3.5 rounded-xl hover:bg-crimson-50 transition-colors shadow-xl">Donate Now</a>
            <a href="/volunteer" className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">Volunteer</a>
          </div>
        </div>
      </section>
    </div>
  );
}
