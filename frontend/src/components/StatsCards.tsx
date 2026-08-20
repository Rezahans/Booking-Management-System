'use client';

import React from 'react';
import { BookingStatistics, BookingStatus } from '@/lib/types';
import { Calendar, Clock, CheckCircle2, CheckCheck, XCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: BookingStatistics | null;
  activeStatusFilter?: BookingStatus | 'ALL';
  onSelectFilter?: (status: BookingStatus | 'ALL') => void;
  loading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  activeStatusFilter = 'ALL',
  onSelectFilter,
  loading = false,
}) => {
  const cards = [
    {
      id: 'ALL' as const,
      label: 'Total Bookings',
      value: stats?.total ?? 0,
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-900/50',
      accent: 'group-hover:border-indigo-500',
    },
    {
      id: 'PENDING' as const,
      label: 'Pending Action',
      value: stats?.pending ?? 0,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-900/50',
      accent: 'group-hover:border-amber-500',
    },
    {
      id: 'CONFIRMED' as const,
      label: 'Confirmed',
      value: stats?.confirmed ?? 0,
      icon: CheckCircle2,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-900/50',
      accent: 'group-hover:border-blue-500',
    },
    {
      id: 'COMPLETED' as const,
      label: 'Completed',
      value: stats?.completed ?? 0,
      icon: CheckCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-900/50',
      accent: 'group-hover:border-emerald-500',
    },
    {
      id: 'CANCELLED' as const,
      label: 'Cancelled',
      value: stats?.cancelled ?? 0,
      icon: XCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-900/50',
      accent: 'group-hover:border-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatusFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter?.(card.id)}
            disabled={!onSelectFilter}
            className={cn(
              'group relative text-left p-4 rounded-xl border transition-all duration-200 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xs hover:shadow-md cursor-pointer',
              card.border,
              isActive && 'ring-2 ring-indigo-500/70 border-transparent shadow-md scale-[1.02]',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {card.label}
              </span>
              <div className={cn('p-2 rounded-lg transition-transform group-hover:scale-110', card.bg)}>
                <Icon className={cn('w-4 h-4', card.color)} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              {loading ? (
                <div className="h-8 w-14 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md" />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {card.value}
                </span>
              )}
              {card.id === 'ALL' && stats?.today !== undefined && (
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  ({stats.today} today)
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
