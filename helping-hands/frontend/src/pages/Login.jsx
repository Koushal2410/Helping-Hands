import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Heart, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem('hh_users') || '[]');
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) {
      login(user);
      toast.success(`Welcome back, ${user.name}! 🎉`);
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) { toast.error('Please fill all required fields'); return; }
    if (signupForm.password !== signupForm.confirm) { toast.error('Passwords do not match'); return; }
    if (signupForm.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = signup({ ...signupForm, password: signupForm.password });
    if (result.success) {
      toast.success(`Welcome to Helping Hands, ${signupForm.name}! 🙌`);
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-gray-950 mesh-bg flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-crimson-500 to-ocean-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Helping Hands</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Connect. Care. Change.</p>
        </div>

        {/* Tabs */}
        <div className="glass-card p-1 flex rounded-2xl mb-6">
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-crimson-500 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'login' ? (
            <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin} className="glass-card p-7 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" placeholder="you@example.com" value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <div className="text-center text-sm text-gray-500">
                <Link to="/admin-login" className="text-crimson-500 hover:underline">Admin Login →</Link>
              </div>
            </motion.form>
          ) : (
            <motion.form key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSignup} className="glass-card p-7 space-y-4">
              {[
                { key: 'name', label: 'Full Name *', icon: User, type: 'text', placeholder: 'Your Name' },
                { key: 'email', label: 'Email Address *', icon: Mail, type: 'email', placeholder: 'you@example.com' },
                { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+91 98765 43210' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={f.type} placeholder={f.placeholder} value={signupForm[f.key]}
                      onChange={e => setSignupForm(p => ({ ...p, [f.key]: e.target.value }))} className="input-field pl-10" />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={signupForm.password}
                    onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))} className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="password" placeholder="Re-enter password" value={signupForm.confirm}
                    onChange={e => setSignupForm(p => ({ ...p, confirm: e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
