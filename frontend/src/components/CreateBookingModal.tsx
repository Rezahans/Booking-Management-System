'use client';

import React, { useState, useEffect } from 'react';
import { Service, CreateBookingPayload } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { X, Calendar, Clock, User, Mail, FileText, Sparkles, AlertCircle, Check, ArrowRight } from 'lucide-react';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  initialServiceId?: string;
  onBookingCreated: () => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  isOpen,
  onClose,
  services,
  initialServiceId,
  onBookingCreated,
  showToast,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId || '');
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initial service when opened or changed
  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [initialServiceId, services, selectedServiceId]);

  if (!isOpen) return null;

  const selectedService = services.find((s) => s.id === selectedServiceId);

  // Calculate live start and end time preview
  let calculatedStartTimeStr = '-';
  let calculatedEndTimeStr = '-';
  let isValidDateTime = false;

  try {
    if (bookingDate && bookingTime && selectedService) {
      const [hours, minutes] = bookingTime.split(':').map(Number);
      const [year, month, day] = bookingDate.split('-').map(Number);
      const start = new Date(year, month - 1, day, hours, minutes, 0);

      if (!isNaN(start.getTime())) {
        isValidDateTime = true;
        const end = new Date(start.getTime() + selectedService.duration * 60 * 1000);

        calculatedStartTimeStr = new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(start);

        calculatedEndTimeStr = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(end);
      }
    }
  } catch {
    isValidDateTime = false;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validations
    if (!customerName.trim()) {
      setErrorMessage('Please enter the customer name');
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid customer email address');
      return;
    }

    if (!selectedServiceId) {
      setErrorMessage('Please select a service');
      return;
    }

    if (!bookingDate || !bookingTime) {
      setErrorMessage('Please specify both booking date and time');
      return;
    }

    setLoading(true);

    try {
      // Build ISO Start Time
      const [hours, minutes] = bookingTime.split(':').map(Number);
      const [year, month, day] = bookingDate.split('-').map(Number);
      const startDateTime = new Date(year, month - 1, day, hours, minutes, 0);

      const payload: CreateBookingPayload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        serviceId: selectedServiceId,
        startTime: startDateTime.toISOString(),
        notes: notes.trim() || undefined,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json().catch(() => null);

      if (!response.ok) {
        let msg = 'Failed to create booking';
        if (resData?.message) {
          msg = Array.isArray(resData.message) ? resData.message.join(', ') : resData.message;
        }
        throw new Error(msg);
      }

      showToast('success', `Booking created successfully for ${customerName}!`);
      onBookingCreated();
      onClose();

      // Reset form
      setCustomerName('');
      setCustomerEmail('');
      setNotes('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit booking');
      showToast('error', err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                New Customer Booking
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Fill in customer details and assign an available service
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Indah"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Customer Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              Customer Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. maya.indah@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Service Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                Select Service <span className="text-rose-500">*</span>
              </span>
              {selectedService && (
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedService.duration} mins • {formatCurrency(selectedService.price)}
                </span>
              )}
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.duration} mins) - {formatCurrency(service.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Schedule Calculation Preview Card */}
          {isValidDateTime && selectedService && (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
              <div className="flex items-center justify-between font-semibold mb-1">
                <span>Calculated Schedule</span>
                <span className="bg-indigo-200/60 dark:bg-indigo-900/80 px-2 py-0.5 rounded text-[11px]">
                  Duration: {selectedService.duration} min
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium mt-1">
                <span className="text-slate-900 dark:text-white font-bold">{calculatedStartTimeStr}</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="text-slate-900 dark:text-white font-bold">{calculatedEndTimeStr}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Any specific requests or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
