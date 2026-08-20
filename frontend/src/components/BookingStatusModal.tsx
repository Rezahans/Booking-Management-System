'use client';

import React, { useState } from 'react';
import { Booking, BookingStatus } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { X, Check, AlertTriangle } from 'lucide-react';

interface BookingStatusModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
  booking,
  isOpen,
  onClose,
  onStatusUpdated,
  showToast,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(
    booking?.status || 'PENDING',
  );
  const [loading, setLoading] = useState(false);

  // Sync state when booking changes
  React.useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status);
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const statuses: { value: BookingStatus; label: string; desc: string }[] = [
    {
      value: 'PENDING',
      label: 'Pending',
      desc: 'Booking is recorded and awaiting staff confirmation.',
    },
    {
      value: 'CONFIRMED',
      label: 'Confirmed',
      desc: 'Booking is approved and schedule is locked in.',
    },
    {
      value: 'COMPLETED',
      label: 'Completed',
      desc: 'Customer attended and service was successfully rendered.',
    },
    {
      value: 'CANCELLED',
      label: 'Cancelled',
      desc: 'Booking was called off by customer or staff.',
    },
  ];

  const handleUpdate = async () => {
    if (selectedStatus === booking.status) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/bookings/${booking.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: selectedStatus }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update status');
      }

      showToast('success', `Status updated to ${selectedStatus} for ${booking.customerName}`);
      onStatusUpdated();
      onClose();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Update Booking Status
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Customer: <span className="font-semibold text-slate-900 dark:text-slate-200">{booking.customerName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Current Status:</span>
            <StatusBadge status={booking.status} />
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select New Status
            </label>

            <div className="space-y-2">
              {statuses.map((item) => {
                const isSelected = selectedStatus === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedStatus(item.value)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-400 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.label}
                        </span>
                        <StatusBadge status={item.value} size="sm" showIcon={false} />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Save Status</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
