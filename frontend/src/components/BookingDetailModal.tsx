'use client';

import React from 'react';
import { Booking } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { X, Calendar, Clock, User, Mail, Sparkles, FileText, CheckCircle, RefreshCw } from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusModal: (booking: Booking) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
  onOpenStatusModal,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Booking Information
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Ref ID: <span className="font-mono">{booking.id.substring(0, 8)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Header */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Booking Status
              </span>
              <StatusBadge status={booking.status} size="lg" />
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenStatusModal(booking);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Change Status
            </button>
          </div>

          {/* Customer Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Name</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {booking.customerName}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 block">Email</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate block">
                    {booking.customerEmail}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Service Details
            </h3>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {booking.service?.name}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {booking.service?.duration} mins
                </span>
              </div>
              {booking.service?.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {booking.service.description}
                </p>
              )}
              {booking.service?.price != null && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Standard Price:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(booking.service.price)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Schedule Timeline
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-slate-600 dark:text-slate-300 block mb-1">Start Time</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatDateTime(booking.startTime)}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-slate-600 dark:text-slate-300 block mb-1">End Time</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatDateTime(booking.endTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Staff / Customer Notes
              </h3>
              <p className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-700 dark:text-slate-300 italic">
                "{booking.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
