'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-3 ${
        isSuccess
          ? 'bg-slate-900 text-white border-slate-800 dark:bg-white dark:text-slate-900 dark:border-slate-200'
          : 'bg-rose-950 text-white border-rose-800'
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-400" />
        )}
      </div>
      <div className="flex-1 text-xs font-medium">{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white dark:hover:text-slate-900 cursor-pointer p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
