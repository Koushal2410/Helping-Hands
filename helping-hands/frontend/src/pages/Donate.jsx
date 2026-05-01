import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Utensils, Shirt, CreditCard, Heart, CheckCircle, User, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePayment } from '../hooks/usePayment';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'blood', icon: Droplets, label: 'Blood Donation', color: 'from-red-500 to-crimson-600',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
    desc: 'Donate blood and save up to 3 lives. We organize camps every weekend.',
    amountNeeded: false,
    details: ['Free health checkup included', 'Certificate of donation', 'Snacks & refreshments provided', 'Camp locations across 12 cities'],
  },
  {
    id: 'food', icon: Utensils, label: 'Food Donation', color: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    desc: 'Partner with hotels to redirect surplus food or fund meal programs.',
    amountNeeded: true,
    presets: [100, 250, 500, 1000],
    details: ['₹100 feeds 2 people for a day', 'Hotel surplus food collection', 'Direct delivery to shelters', 'Monthly reports sent'],
  },
  {
    id: 'clothes', icon: Shirt, label: 'Clothes Donation', color: 'from-ocean-500 to-blue-600',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    desc: 'Donate gently used or new clothes for distribution to underprivileged communities.',
    amountNeeded: false,
    details: ['Schedule a pickup from your home', 'All seasons accepted', 'Clean & sorted before distribution', 'Tax benefit certificate available'],
  },
  {
    id: 'money', icon: CreditCard, label: 'Monetary Donation', color: 'from-purple-500 to-violet-600',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    desc: 'Support our programs directly. 80% of funds go directly to beneficiaries.',
    amountNeeded: true,
    presets: [500, 1000, 2500, 5000],
    details: ['80G tax exemption eligible', 'Quarterly utilization report', 'Donor wall recognition', 'Receipt via email immediately'],
  },
];

export default function Donate() {
  const [selected, setSelected] = useState('blood');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState(1); // 1=select, 2=details, 3=payment
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const { initiatePayment, loading } = usePayment();
  const navigate = useNavigate();

  const cat = categories.find(c => c.id === selected);

  const handlePreset = (val) => { setAmount(val); setCustomAmount(''); };

  const handleNext = () => {
    if (!form.name || !form.email) { toast.error('Please fill name and email'); return; }
    if (cat.amountNeeded && !amount && !customAmount) { toast.error('Please select or enter an amount'); return; }
    setStep(3);
  };

  const handlePay = async () => {
    const finalAmount = cat.amountNeeded ? (customAmount || amount) : 0;
    if (cat.amountNeeded && (!finalAmount || finalAmount < 1)) { toast.error('Enter valid amount'); return; }

    if (!cat.amountNeeded) {
      toast.success(`🎉 Thank you ${form.name}! We'll contact you to coordinate your ${cat.label.toLowerCase()}.`);
      navigate('/payment-success', { state: { type: cat.label, amount: 0, name: form.name, nonMonetary: true } });
      return;
    }

    // Money donation → redirect to Razorpay payment page
    if (selected === 'money') {
      toast.success('Redirecting to secure payment page...');
      setTimeout(() => { window.open('https://rzp.io/rzp/JLTZoOtN', '_blank'); }, 800);
      navigate('/payment-success', { state: { type: cat.label, amount: Number(finalAmount), name: form.name, nonMonetary: false, paymentId: `rzp_link_${Date.now()}` } });
      return;
    }

    await initiatePayment({
      amount: Number(finalAmount),
      donationType: cat.label,
      donorName: form.name,
      donorEmail: form.email,
      onSuccess: (data) => navigate('/payment-success', { state: { ...data, type: cat.label, name: form.name } }),
      onFailure: () => toast.error('Payment failed. Please try again.'),
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-gray-950 mesh-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-crimson-500 font-semibold text-sm uppercase tracking-widest">Make a Difference</span>
          <h1 className="section-title mt-3 mb-4">Choose Your Donation</h1>
          <p className="section-subtitle mx-auto">Every contribution, big or small, transforms lives across India.</p>
        </motion.div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {['Choose Type', 'Your Details', 'Confirm'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${step > i ? 'bg-crimson-500 text-white' : step === i + 1 ? 'bg-crimson-100 dark:bg-crimson-950 text-crimson-600 dark:text-crimson-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs border-2 border-current">
                  {step > i + 1 ? <CheckCircle className="w-3 h-3" /> : i + 1}
                </span>
                {s}
              </div>
              {i < 2 && <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {categories.map((c) => (
                  <motion.button
                    key={c.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(c.id)}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 ${selected === c.id ? 'border-crimson-500 shadow-lg shadow-crimson-500/20 bg-crimson-50 dark:bg-crimson-950/30' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200'}`}
                  >
                    {selected === c.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-crimson-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}>
                      <c.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.label}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{c.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Details panel */}
              <AnimatePresence mode="wait">
                <motion.div key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">{cat.label}</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-5">{cat.desc}</p>
                      <ul className="space-y-2.5">
                        {cat.details.map((d) => (
                          <li key={d} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {cat.amountNeeded && (
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Amount (₹)</p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {cat.presets.map(p => (
                            <button key={p} onClick={() => handlePreset(p)} className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${amount === p ? 'border-crimson-500 bg-crimson-50 dark:bg-crimson-950/30 text-crimson-600' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300'}`}>
                              ₹{p.toLocaleString()}
                            </button>
                          ))}
                        </div>
                        <input
                          type="number"
                          placeholder="Or enter custom amount"
                          value={customAmount}
                          onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
                          className="input-field"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button onClick={() => setStep(2)} className="btn-primary flex items-center gap-2">
                      Continue <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-lg mx-auto">
              <div className="glass-card p-8">
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Details</h3>
                <div className="space-y-4">
                  {[
                    { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Rahul Sharma' },
                    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'rahul@example.com' },
                    { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '98765 43210' },
                    { key: 'address', label: 'City / Area', icon: MapPin, type: 'text', placeholder: 'Hyderabad, Telangana' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
                      <div className="relative">
                        <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={f.type}
                          placeholder={f.placeholder}
                          value={form[f.key]}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
                  <button onClick={handleNext} className="btn-primary flex-1">Continue</button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-lg mx-auto">
              <div className="glass-card p-8">
                <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Confirm Donation</h3>
                <div className={`p-5 rounded-2xl bg-gradient-to-br ${cat.color} text-white mb-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <cat.icon className="w-8 h-8" />
                    <div>
                      <div className="font-bold text-lg">{cat.label}</div>
                      {cat.amountNeeded && <div className="text-2xl font-display font-bold">₹{(customAmount || amount || 0).toLocaleString()}</div>}
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500">Donor</span><span className="font-medium dark:text-white">{form.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500">Email</span><span className="font-medium dark:text-white">{form.email}</span>
                  </div>
                  {cat.amountNeeded && (
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-bold text-crimson-600">₹{(customAmount || amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Payment via</span>
                    <span className="font-medium dark:text-white">Razorpay (UPI / Card / NetBanking)</span>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-6 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" /> 80G Tax Exemption certificate will be emailed to you.
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost flex-1">Back</button>
                  <button onClick={handlePay} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {loading ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Heart className="w-4 h-4 fill-white" />}
                    {cat.amountNeeded ? 'Pay & Donate' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
