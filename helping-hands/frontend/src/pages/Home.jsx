import { useRef, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { ArrowRight, Heart, Users, Droplets, Utensils, Shirt, ChevronDown, Shield, Zap, Globe } from 'lucide-react';
import StatsCounter from '../components/StatsCounter';

// 3D Animated Sphere
function AnimatedSphere() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[1.6, 100, 200]} scale={1}>
        <MeshDistortMaterial
          color="#e11d48"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

function InnerSphere() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[0.6, 64, 64]} position={[2.5, 1, -1]}>
        <MeshDistortMaterial color="#3b82f6" distort={0.5} speed={3} roughness={0} metalness={0.5} transparent opacity={0.7} />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <AnimatedSphere />
      <InnerSphere />
    </>
  );
}

// Floating particle canvas
function ParticleBackground() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animFrame;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#e11d48' : '#3b82f6',
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.o;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const programs = [
  { icon: Droplets, title: 'Blood Donation', desc: 'Organize and participate in life-saving blood donation camps across the city.', color: 'from-red-500 to-crimson-600', link: '/donate' },
  { icon: Utensils, title: 'Food Donation', desc: 'Partner with hotels to redirect surplus food to shelters and those in need.', color: 'from-amber-500 to-orange-500', link: '/donate' },
  { icon: Shirt, title: 'Clothes Donation', desc: 'Collect and distribute clothes to underprivileged communities seasonally.', color: 'from-ocean-500 to-blue-600', link: '/donate' },
  { icon: Users, title: 'Volunteer Programs', desc: 'Join our network of 800+ volunteers making an impact every weekend.', color: 'from-purple-500 to-violet-600', link: '/volunteer' },
];

const whyUs = [
  { icon: Shield, title: 'Verified & Trusted', desc: 'Registered NGO with transparent fund utilization and audit reports.' },
  { icon: Zap, title: 'Instant Impact', desc: 'Your donation reaches beneficiaries within 24 hours of contribution.' },
  { icon: Globe, title: 'Pan-India Reach', desc: 'Operating across 12 cities with 50+ partner organizations.' },
];

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-gray-950 overflow-hidden">
        <ParticleBackground />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-crimson-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-ocean-600 rounded-full blur-[100px]" />
        </div>

        {/* 3D Canvas */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none"
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }} className="!absolute inset-0">
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-crimson-500/10 border border-crimson-500/20 text-crimson-400 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-crimson-400 rounded-full animate-pulse" />
              2,847+ Lives Changed This Year
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            >
              Every Act of{' '}
              <span className="relative">
                <span className="text-crimson-400">Kindness</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C50 1.5 150 1.5 199 5.5" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>{' '}
              <br />Creates a Ripple
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10"
            >
              Helping Hands connects compassionate individuals with people in need through blood donation, food programs, and volunteer initiatives across India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/donate" className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8">
                <Heart className="w-5 h-5 fill-white" /> Donate Now
              </Link>
              <Link to="/volunteer" className="btn-ghost border-gray-600 text-gray-300 hover:text-white hover:border-crimson-400 flex items-center justify-center gap-2 text-base py-4 px-8">
                Become a Volunteer <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap items-center gap-5 text-sm text-gray-500"
            >
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-400" /> Registered NGO</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full" />
              <span className="flex items-center gap-1.5">🏆 Award-winning 2024</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full" />
              <span className="flex items-center gap-1.5">🔒 Secure Payments</span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* STATS */}
      <StatsCounter />

      {/* PROGRAMS */}
      <section className="py-24 bg-white dark:bg-gray-950 mesh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-crimson-500 font-semibold text-sm uppercase tracking-widest">What We Do</span>
            <h2 className="section-title mt-3 mb-4">Our Programs</h2>
            <p className="section-subtitle mx-auto">Four pillars of our social mission — each designed for maximum impact and community reach.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-7 group cursor-pointer card-3d"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <p.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-3">{p.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">{p.desc}</p>
                <Link to={p.link} className="text-crimson-500 text-sm font-semibold flex items-center gap-1.5 group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-ocean-500 font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
              <h2 className="section-title mt-3 mb-6">Trusted by Thousands Across India</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                We're not just an NGO — we're a movement. Every rupee donated, every unit of blood given, every meal shared creates a chain reaction of positive change.
              </p>
              <div className="space-y-6">
                {whyUs.map((w, i) => (
                  <motion.div key={w.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-ocean-100 dark:bg-ocean-950 flex items-center justify-center shrink-0">
                      <w.icon className="w-6 h-6 text-ocean-600 dark:text-ocean-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{w.title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{w.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Link to="/donate" className="btn-primary">Start Donating</Link>
                <Link to="/events" className="btn-ghost">View Events</Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Cities Active', value: '12', color: 'bg-crimson-500' },
                  { label: 'Partner Hotels', value: '48', color: 'bg-ocean-500' },
                  { label: 'Events/Year', value: '200+', color: 'bg-amber-500' },
                  { label: 'Satisfaction', value: '98%', color: 'bg-green-500' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05 }}
                    className="glass-card p-6 text-center"
                  >
                    <div className={`text-3xl font-display font-bold mb-1 ${item.color.replace('bg-', 'text-')}`}>{item.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-crimson-600 via-crimson-500 to-rose-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-white mb-5"
          >
            Ready to Make a Difference?
          </motion.h2>
          <p className="text-crimson-100 text-lg mb-10">Join 2,847 donors and 891 volunteers who are already changing lives today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate" className="bg-white text-crimson-600 font-bold px-9 py-4 rounded-xl hover:bg-crimson-50 transition-colors shadow-xl hover:-translate-y-1 duration-200 inline-block">
              Donate Now
            </Link>
            <Link to="/volunteer" className="border-2 border-white text-white font-bold px-9 py-4 rounded-xl hover:bg-white/10 transition-colors inline-block">
              Volunteer Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
