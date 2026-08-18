import React, { createContext, useContext, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const activeMessagesRef = useRef(new Set());

  const showToast = (message, type = 'success', duration = 4500) => {
    if (!message) return;

    // Deduplication check: Do not show identical active message
    const msgKey = `${type}:${message.trim()}`;
    if (activeMessagesRef.current.has(msgKey)) {
      return;
    }

    activeMessagesRef.current.add(msgKey);
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, message, type, msgKey }]);

    setTimeout(() => {
      removeToast(id, msgKey);
    }, duration);
  };

  const removeToast = (id, msgKey) => {
    if (msgKey) {
      activeMessagesRef.current.delete(msgKey);
    }
    setToasts((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target && target.msgKey) {
        activeMessagesRef.current.delete(target.msgKey);
      }
      return prev.filter((t) => t.id !== id);
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-xl transition-all ${
                toast.type === 'success'
                  ? 'bg-[#12151C]/95 border-[#22C55E]/40 text-[#F8FAFC] shadow-[#22C55E]/5'
                  : toast.type === 'error'
                  ? 'bg-[#151214]/95 border-[#EF4444]/50 text-[#F8FAFC] shadow-[#EF4444]/10'
                  : toast.type === 'warning'
                  ? 'bg-[#181610]/95 border-[#F59E0B]/50 text-[#F8FAFC]'
                  : 'bg-[#151820]/95 border-[#FFD60A]/40 text-[#F8FAFC] shadow-[#FFD60A]/5'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />}
              {toast.type === 'warning' && <ShieldAlert className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#FFD60A] shrink-0 mt-0.5" />}
              <div className="flex-1 text-xs font-semibold leading-relaxed">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id, toast.msgKey)}
                className="text-text-muted hover:text-white transition-colors p-0.5 -mr-1 -mt-0.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
