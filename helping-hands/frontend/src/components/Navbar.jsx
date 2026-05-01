import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Heart, User, LogOut, Shield, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/donate', label: 'Donate' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/events', label: 'Events' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar({ darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); setUserMenu(false); };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 shadow-lg border-b border-white/20 dark:border-gray-800/50' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-crimson-500 to-ocean-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">Helping<span className="text-crimson-500">Hands</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className={`nav-link text-sm font-medium pb-0.5 ${location.pathname === link.href ? 'text-crimson-600 dark:text-crimson-400 after:w-full' : ''}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <AnimatePresence mode="wait">
                <motion.div key={darkMode ? 'sun' : 'moon'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {isAdmin && (
              <Link to="/admin" className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-crimson-400 rounded-lg text-xs font-semibold border border-gray-700 hover:bg-gray-800 transition-colors">
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            )}

            {user ? (
              <div className="hidden lg:block relative">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 px-3 py-1.5 bg-crimson-50 dark:bg-crimson-950/40 text-crimson-700 dark:text-crimson-400 rounded-xl text-sm font-medium border border-crimson-200 dark:border-crimson-800 hover:bg-crimson-100 transition-colors">
                  <User className="w-4 h-4" /> {user.name.split(' ')[0]}
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
                      <Link to="/dashboard" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <User className="w-4 h-4" /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex items-center gap-1.5 btn-ghost text-sm py-2 px-4">
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}

            <Link to="/donate" className="hidden lg:block btn-primary text-sm py-2 px-5">Donate Now</Link>

            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-gray-950/95 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <Link to={link.href} className={`block px-4 py-2.5 rounded-xl font-medium transition-colors ${location.pathname === link.href ? 'bg-crimson-50 dark:bg-crimson-950/50 text-crimson-600 dark:text-crimson-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 flex gap-3">
                {user ? (
                  <button onClick={handleLogout} className="flex-1 btn-ghost text-sm py-2.5 text-center text-red-500">Sign Out</button>
                ) : (
                  <Link to="/login" className="flex-1 btn-ghost text-sm py-2.5 text-center">Sign In</Link>
                )}
                <Link to="/donate" className="flex-1 btn-primary text-sm py-2.5 text-center">Donate</Link>
              </div>
              {isAdmin && <Link to="/admin" className="mt-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-crimson-400 rounded-xl text-sm font-semibold"><Shield className="w-4 h-4" /> Admin Panel</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
