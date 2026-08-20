'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Sparkles, ShieldCheck, Clock } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenServicesModal: () => void;
  totalServices: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onOpenServicesModal,
  totalServices,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Booking Management
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
                <ShieldCheck className="w-3 h-3" />
                Staff Portal
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 hidden sm:block">
              Internal Service Scheduling & Customer Booking System
            </p>
          </div>
        </div>

        {/* Right Actions & Clock */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live Clock */}
          {timeStr && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{timeStr}</span>
            </div>
          )}

          {/* View Services Catalog Button */}
          <button
            type="button"
            onClick={onOpenServicesModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Services</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {totalServices}
            </span>
          </button>

          {/* New Booking Primary Button */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Booking</span>
          </button>
        </div>
      </div>
    </header>
  );
};
