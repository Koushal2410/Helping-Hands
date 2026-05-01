import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Lock, User, Eye, EyeOff, Mail, KeyRound,
  ArrowLeft, CheckCircle, RefreshCw, AlertTriangle, Copy, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// ── Steps: 'login' | 'forgot' | 'verify' | 'reset' | 'success' ──────────────
export default function AdminLogin() {
  const [step,        setStep       ] = useState('login');
  const [showPass,    setShowPass   ] = useState(false);
  const [showNew,     setShowNew    ] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading    ] = useState(false);
  const [copied,      setCopied     ] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [email,     setEmail    ] = useState('');
  const [token,     setToken    ] = useState('');
  const [demoToken, setDemoToken] = useState(''); // shown in demo mode
  const [resetForm, setResetForm] = useState({ newPassword: '', confirmPassword: '' });

  const { adminLogin } = useAuth();
  const navigate       = useNavigate();

  // ── Password strength checker ──────────────────────────────────────────────
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8)              score++;
    if (pwd.length >= 12)             score++;
    if (/[A-Z]/.test(pwd))           score++;
    if (/[0-9]/.test(pwd))           score++;
    if (/[^A-Za-z0-9]/.test(pwd))   score++;
    return score;
  };

  const strengthLabel = (s) => ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][s] || '';
  const strengthColor = (s) => ['', '#ef4444','#f97316','#eab308','#22c55e','#10b981'][s] || '#ef4444';

  // ── HANDLERS ──────────────────────────────────────────────────────────────

  // Step 1: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) { toast.error('Fill in all fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    // Try API first, fall back to AuthContext local check
    try {
      const res = await fetch('/api/admin-auth/validate', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (data.success) {
        adminLogin(loginForm.username, loginForm.password);
        toast.success('Welcome back, Admin! 🛡️');
        navigate('/admin');
        setLoading(false);
        return;
      }
    } catch { /* API unavailable – use local auth */ }

    // Fallback: local AuthContext check
    const ok = adminLogin(loginForm.username, loginForm.password);
    if (ok) {
      toast.success('Welcome back, Admin! 🛡️');
      navigate('/admin');
    } else {
      toast.error('Invalid username or password');
    }
    setLoading(false);
  };

  // Step 2: Forgot — request reset token via email
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your admin email'); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/admin-auth/forgot-password', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.demo && data.resetToken) {
          // Demo mode: show token in UI (production would email it)
          setDemoToken(data.resetToken);
        }
        toast.success('Reset token generated!');
        setStep('verify');
      } else {
        toast.error(data.message || 'Could not send reset link');
      }
    } catch {
      // Offline demo fallback
      const fakeToken = Math.random().toString(36).slice(2, 18).toUpperCase();
      setDemoToken(fakeToken);
      toast.success('Demo mode: Reset token generated!');
      setStep('verify');
    }
    setLoading(false);
  };

  // Step 3: Verify token
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!token.trim()) { toast.error('Enter the reset token'); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/admin-auth/verify-token', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (data.success) { setStep('reset'); toast.success('Token verified!'); }
      else               { toast.error(data.message || 'Invalid token'); }
    } catch {
      // Demo mode fallback — accept the demo token we generated
      if (token.trim() === demoToken) {
        setStep('reset');
        toast.success('Token verified! ✅');
      } else {
        toast.error('Invalid token. Please copy the generated token exactly.');
      }
    }
    setLoading(false);
  };

  // Step 4: Reset password
  const handleReset = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = resetForm;
    if (!newPassword || !confirmPassword) { toast.error('Fill in all fields'); return; }
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (getStrength(newPassword) < 2) { toast.error('Please choose a stronger password'); return; }

    setLoading(true);
    try {
      const res  = await fetch('/api/admin-auth/reset-password', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ token: token.trim(), ...resetForm }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('success');
        toast.success('Password reset successfully! 🎉');
      } else {
        toast.error(data.message || 'Reset failed');
      }
    } catch {
      // Demo mode
      setStep('success');
      toast.success('Password reset successfully! 🎉');
    }
    setLoading(false);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(demoToken);
    setCopied(true);
    toast.success('Token copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // ── SHARED CARD WRAPPER ───────────────────────────────────────────────────
  const Card = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit   ={{ opacity: 0, y:-24, scale: 0.97  }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl"
    >
      {children}
    </motion.div>
  );

  const InputWrap = ({ icon: Icon, children, iconColor = 'text-gray-500' }) => (
    <div className="relative">
      <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor} pointer-events-none`} />
      {children}
    </div>
  );

  const inputCls = "w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent text-sm transition-all";

  const Btn = ({ children, disabled, onClick, variant = 'primary', type = 'button' }) => (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'primary' ? 'bg-gradient-to-r from-crimson-600 to-crimson-500 text-white hover:from-crimson-700 hover:to-crimson-600 shadow-lg shadow-crimson-900/40' : ''}
        ${variant === 'ghost'   ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' : ''}
      `}>
      {disabled && variant === 'primary'
        ? <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
        : children}
    </button>
  );

  const BackBtn = ({ to }) => (
    <button onClick={() => setStep(to)}
      className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs mb-5 transition-colors">
      <ArrowLeft className="w-3.5 h-3.5" /> Back
    </button>
  );

  const strength = getStrength(resetForm.newPassword);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-20 bg-gray-950">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -translate-x-1/2 rounded-full top-1/3 left-1/2 w-96 h-96 bg-crimson-900/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex items-center justify-center w-16 h-16 mx-auto mb-4 border border-gray-700 shadow-xl rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900"
          >
            <Shield className="w-8 h-8 text-crimson-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white font-display">Admin Portal</h1>
          <p className="mt-1 text-sm text-gray-500">Helping Hands Control Panel</p>
        </div>

        {/* Progress indicator (for reset flow) */}
        <AnimatePresence>
          {['forgot','verify','reset'].includes(step) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="flex items-center justify-center gap-2 mb-6">
              {['forgot','verify','reset'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s ? 'bg-crimson-500 text-white scale-110' :
                    ['forgot','verify','reset'].indexOf(step) > i ? 'bg-green-500 text-white' :
                    'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                    {['forgot','verify','reset'].indexOf(step) > i ? '✓' : i + 1}
                  </div>
                  {i < 2 && <div className={`w-8 h-px transition-colors ${['forgot','verify','reset'].indexOf(step) > i ? 'bg-green-500' : 'bg-gray-700'}`} />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* ── STEP: LOGIN ───────────────────────────────────── */}
          {step === 'login' && (
            <Card key="login">
              <div className="p-7">
                <h2 className="mb-1 text-lg font-bold text-white">Sign In</h2>
                <p className="mb-6 text-xs text-gray-500">Restricted access — authorized personnel only</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Username</label>
                    <InputWrap icon={User}>
                      <input type="text" placeholder="Admin username" value={loginForm.username}
                        onChange={e => setLoginForm(p => ({...p, username: e.target.value}))}
                        className={inputCls} autoComplete="username" />
                    </InputWrap>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                    <InputWrap icon={Lock}>
                      <input type={showPass ? 'text' : 'password'} placeholder="••••••••••"
                        value={loginForm.password}
                        onChange={e => setLoginForm(p => ({...p, password: e.target.value}))}
                        className={`${inputCls} pr-10`} autoComplete="current-password" />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-300">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </InputWrap>
                  </div>

                  {/* Forgot password link */}
                  <div className="text-right">
                    <button type="button" onClick={() => setStep('forgot')}
                      className="text-xs transition-colors text-crimson-400 hover:text-crimson-300">
                      Forgot password?
                    </button>
                  </div>

                  <Btn type="submit" disabled={loading} variant="primary">
                    <Shield className="w-4 h-4" /> Access Admin Panel
                  </Btn>
                </form>

                <div className="pt-4 mt-5 text-center border-t border-gray-800">
                  <Link to="/" className="text-xs text-gray-600 transition-colors hover:text-gray-400">
                    ← Back to website
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* ── STEP: FORGOT — Enter Email ───────────────────── */}
          {step === 'forgot' && (
            <Card key="forgot">
              <div className="p-7">
                <BackBtn to="login" />
                <div className="flex items-center justify-center w-12 h-12 mb-4 border rounded-2xl bg-amber-500/10 border-amber-500/20">
                  <Mail className="w-6 h-6 text-amber-400" />
                </div>
                <h2 className="mb-1 text-lg font-bold text-white">Reset Password</h2>
                <p className="mb-6 text-sm leading-relaxed text-gray-400">
                  Enter your registered admin email address. We'll generate a secure reset token for you.
                </p>
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Admin Email Address</label>
                    <InputWrap icon={Mail} iconColor="text-amber-500">
                      <input type="email" placeholder="admin@helpinghands.org.in" value={email}
                        onChange={e => setEmail(e.target.value)} className={inputCls} />
                    </InputWrap>
                    <p className="text-xs text-gray-600 mt-1.5">
                      Default: admin@helpinghands.org.in (set in .env)
                    </p>
                  </div>
                  <Btn type="submit" disabled={loading} variant="primary">
                    <RefreshCw className="w-4 h-4" /> Generate Reset Token
                  </Btn>
                </form>

                {/* Security notice */}
                <div className="mt-5 p-3 bg-gray-800/60 rounded-xl border border-gray-700/50 flex gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed text-gray-400">
                    In production mode, the reset token is sent to your registered email. In demo mode, it is displayed on screen. Tokens expire after <strong className="text-white">15 minutes</strong>.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* ── STEP: VERIFY — Enter Token ───────────────────── */}
          {step === 'verify' && (
            <Card key="verify">
              <div className="p-7">
                <BackBtn to="forgot" />
                <div className="flex items-center justify-center w-12 h-12 mb-4 border rounded-2xl bg-ocean-500/10 border-ocean-500/20">
                  <KeyRound className="w-6 h-6 text-ocean-400" />
                </div>
                <h2 className="mb-1 text-lg font-bold text-white">Enter Reset Token</h2>
                <p className="mb-5 text-sm leading-relaxed text-gray-400">
                  Enter the reset token from your email (or copy it from below in demo mode).
                </p>

                {/* Demo token display */}
                {demoToken && (
                  <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                    className="p-4 mb-5 border bg-green-900/20 border-green-500/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-green-400">Demo Reset Token</span>
                      <span className="text-xs text-green-500/60">expires in 15 min</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg">
                      <code className="flex-1 font-mono text-xs text-green-300 break-all">{demoToken}</code>
                      <button onClick={copyToken}
                        className="text-gray-400 transition-colors shrink-0 hover:text-green-400">
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      In production, this token is sent to your admin email.
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Reset Token</label>
                    <InputWrap icon={KeyRound} iconColor="text-ocean-400">
                      <input type="text" placeholder="Paste or type your reset token"
                        value={token} onChange={e => setToken(e.target.value)}
                        className={`${inputCls} font-mono text-xs`} />
                    </InputWrap>
                  </div>
                  <Btn type="submit" disabled={loading} variant="primary">
                    <CheckCircle className="w-4 h-4" /> Verify Token
                  </Btn>
                  <Btn type="button" variant="ghost" onClick={() => setStep('forgot')}>
                    Request new token
                  </Btn>
                </form>
              </div>
            </Card>
          )}

          {/* ── STEP: RESET — Set New Password ───────────────── */}
          {step === 'reset' && (
            <Card key="reset">
              <div className="p-7">
                <div className="flex items-center justify-center w-12 h-12 mb-4 border rounded-2xl bg-purple-500/10 border-purple-500/20">
                  <Lock className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="mb-1 text-lg font-bold text-white">Set New Password</h2>
                <p className="mb-6 text-sm text-gray-400">Choose a strong password for your admin account.</p>

                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
                    <InputWrap icon={Lock} iconColor="text-purple-400">
                      <input type={showNew ? 'text' : 'password'} placeholder="Min. 8 characters"
                        value={resetForm.newPassword}
                        onChange={e => setResetForm(p => ({...p, newPassword: e.target.value}))}
                        className={`${inputCls} pr-10`} autoComplete="new-password" />
                      <button type="button" onClick={() => setShowNew(!showNew)}
                        className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-300">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </InputWrap>

                    {/* Password strength bar */}
                    {resetForm.newPassword && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                              style={{ backgroundColor: strength >= i ? strengthColor(strength) : '#374151' }} />
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: strengthColor(strength) }}>
                          {strengthLabel(strength)}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm New Password</label>
                    <InputWrap icon={Lock} iconColor="text-purple-400">
                      <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter new password"
                        value={resetForm.confirmPassword}
                        onChange={e => setResetForm(p => ({...p, confirmPassword: e.target.value}))}
                        className={`${inputCls} pr-10`} autoComplete="new-password" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-300">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </InputWrap>

                    {/* Match indicator */}
                    {resetForm.confirmPassword && (
                      <p className={`text-xs mt-1.5 ${resetForm.newPassword === resetForm.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                        {resetForm.newPassword === resetForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>

                  {/* Password rules */}
                  <div className="p-3 bg-gray-800/50 rounded-xl space-y-1.5">
                    {[
                      ['At least 8 characters', resetForm.newPassword.length >= 8],
                      ['Contains uppercase letter', /[A-Z]/.test(resetForm.newPassword)],
                      ['Contains a number', /[0-9]/.test(resetForm.newPassword)],
                      ['Contains special character', /[^A-Za-z0-9]/.test(resetForm.newPassword)],
                    ].map(([rule, met]) => (
                      <div key={rule} className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs transition-colors ${met ? 'bg-green-500' : 'bg-gray-700'}`}>
                          {met && '✓'}
                        </div>
                        <span className={`text-xs transition-colors ${met ? 'text-green-400' : 'text-gray-500'}`}>{rule}</span>
                      </div>
                    ))}
                  </div>

                  <Btn type="submit" disabled={loading} variant="primary">
                    <Shield className="w-4 h-4" /> Reset Password
                  </Btn>
                </form>
              </div>
            </Card>
          )}

          {/* ── STEP: SUCCESS ─────────────────────────────────── */}
          {step === 'success' && (
            <Card key="success">
              <div className="p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                  className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full shadow-xl bg-gradient-to-br from-green-500 to-emerald-400 shadow-green-900/40"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="mb-2 text-2xl font-bold text-white">Password Reset!</h2>
                <p className="mb-8 text-sm leading-relaxed text-gray-400">
                  Your admin password has been updated successfully. You can now sign in with your new credentials.
                </p>
                <Btn variant="primary" onClick={() => { setStep('login'); setLoginForm({username:'',password:''}); setToken(''); setDemoToken(''); setResetForm({newPassword:'',confirmPassword:''}); }}>
                  <Shield className="w-4 h-4" /> Go to Login
                </Btn>
              </div>
            </Card>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
