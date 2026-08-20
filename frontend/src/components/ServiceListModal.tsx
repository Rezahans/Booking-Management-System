'use client';

import React from 'react';
import { Service } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { X, Clock, Sparkles, Tag, PlusCircle } from 'lucide-react';

interface ServiceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onSelectServiceForBooking?: (serviceId: string) => void;
}

export const ServiceListModal: React.FC<ServiceListModalProps> = ({
  isOpen,
  onClose,
  services,
  onSelectServiceForBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Available Services
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Pre-configured service catalog with durations and standard pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3.5">
          {services.length === 0 ? (
            <div className="text-center py-8 text-slate-600 dark:text-slate-300">
              No services found in the database.
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all bg-white dark:bg-slate-900/80 shadow-2xs hover:shadow-xs flex items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {service.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      <Clock className="w-3 h-3" />
                      {service.duration} mins
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {service.price != null && (
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatCurrency(service.price)}
                    </span>
                  )}
                  {onSelectServiceForBooking && (
                    <button
                      onClick={() => {
                        onSelectServiceForBooking(service.id);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer border border-indigo-200 dark:border-indigo-900"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Book This
                    </button>
                  )}
                </div>
              </div>
            ))
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
