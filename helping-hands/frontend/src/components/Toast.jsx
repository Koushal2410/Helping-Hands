import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-xl
              ${t.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : ''}
              ${t.type === 'error' ? 'bg-red-50/95 border-red-200 text-red-800' : ''}
              ${t.type === 'info' ? 'bg-blue-50/95 border-blue-200 text-blue-800' : ''}
            `}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />}
            {t.type === 'error' && <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
            {t.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
