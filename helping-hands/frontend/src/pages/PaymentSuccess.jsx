import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Download, Share2, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

function Confetti() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#e11d48', '#3b82f6', '#f97316', '#10b981', '#a855f7'];
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      sway: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
    }));
    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
        p.y += p.speed;
        p.x += p.sway;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    setTimeout(() => cancelAnimationFrame(frame), 5000);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}

export default function PaymentSuccess() {
  const { state } = useLocation();
  const receiptId = `RCP-HH-${Date.now()}`;

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <Confetti />
      <div className="max-w-lg w-full mx-auto px-4 text-center">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {state?.nonMonetary ? 'Thank You!' : 'Payment Successful!'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {state?.nonMonetary
              ? `We've received your ${state?.type} donation request, ${state?.name}. Our team will contact you within 48 hours.`
              : `Your donation of ₹${state?.amount?.toLocaleString()} has been received. You're making a real difference!`}
          </p>

          {/* Receipt Card */}
          <div className="glass-card p-6 text-left mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-crimson-500 to-rose-400 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Helping Hands Foundation</p>
                <p className="text-xs text-gray-400">Official Donation Receipt</p>
              </div>
            </div>
            <div className="space-y-2.5 text-sm">
              {[
                { label: 'Receipt ID', value: receiptId },
                { label: 'Donor Name', value: state?.name || 'Anonymous' },
                { label: 'Donation Type', value: state?.type || 'General' },
                !state?.nonMonetary && { label: 'Amount', value: `₹${state?.amount?.toLocaleString() || '0'}` },
                { label: 'Payment ID', value: state?.paymentId || 'N/A' },
                { label: 'Date', value: new Date().toLocaleDateString('en-IN', { dateStyle: 'full' }) },
                { label: 'Tax Benefit', value: '80G Eligible ✓' },
              ].filter(Boolean).map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-ghost flex-1 flex items-center justify-center gap-2 text-sm">
              <Download className="w-4 h-4" /> Download Receipt
            </button>
            <button className="btn-ghost flex-1 flex items-center justify-center gap-2 text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <Link to="/dashboard" className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            A confirmation email with your 80G receipt will be sent to your registered email address.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
