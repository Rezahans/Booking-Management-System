'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Booking, BookingStatistics, BookingStatus, Service } from '@/lib/types';
import { api } from '@/lib/api';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { BookingTable } from '@/components/BookingTable';
import { CreateBookingModal } from '@/components/CreateBookingModal';
import { ServiceListModal } from '@/components/ServiceListModal';
import { BookingStatusModal } from '@/components/BookingStatusModal';
import { BookingDetailModal } from '@/components/BookingDetailModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, Clock, RefreshCw, AlertCircle, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function BookingDashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filter State
  const [activeStatusFilter, setActiveStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [selectedInitialServiceId, setSelectedInitialServiceId] = useState<string | undefined>();
  const [statusModalBooking, setStatusModalBooking] = useState<Booking | null>(null);
  const [detailModalBooking, setDetailModalBooking] = useState<Booking | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all initial dashboard data
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setApiError(null);

    try {
      const [servicesData, bookingsData, statsData] = await Promise.all([
        api.getServices(),
        api.getBookings(),
        api.getStatistics(),
      ]);

      setServices(servicesData);
      setBookings(bookingsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Data fetch error:', err);
      setApiError(
        err.message || 'Unable to connect to the backend server. Please ensure the API is running.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreateWithService = (serviceId: string) => {
    setSelectedInitialServiceId(serviceId);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        totalServices={services.length}
        onOpenCreateModal={() => {
          setSelectedInitialServiceId(undefined);
          setIsCreateModalOpen(true);
        }}
        onOpenServicesModal={() => setIsServicesModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Error Banner */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-start justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div>
                <p className="font-bold">Backend Connection Notice</p>
                <p className="mt-0.5 text-rose-700 dark:text-rose-300">{apiError}</p>
              </div>
            </div>
            <button
              onClick={() => fetchData(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 font-semibold hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Title & Quick Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Staff Operations Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Monitor real-time bookings, verify service allocations, and manage lifecycle statuses.
            </p>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {/* Metric KPI Cards */}
        <StatsCards
          stats={stats}
          activeStatusFilter={activeStatusFilter}
          onSelectFilter={(status) => setActiveStatusFilter(status)}
          loading={loading}
        />

        {/* Quick Service Catalog Strip */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Available Services Catalog
              </h3>
            </div>
            <button
              onClick={() => setIsServicesModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              View All ({services.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-2 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="overflow-hidden">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                    {service.name}
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {service.duration} mins • {formatCurrency(service.price)}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenCreateWithService(service.id)}
                  title={`Book ${service.name}`}
                  className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings Management Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Customer Bookings
            </h3>
          </div>

          <BookingTable
            bookings={bookings}
            services={services}
            loading={loading}
            activeStatusFilter={activeStatusFilter}
            onStatusFilterChange={setActiveStatusFilter}
            onOpenStatusModal={(booking) => setStatusModalBooking(booking)}
            onOpenDetailModal={(booking) => setDetailModalBooking(booking)}
            onOpenCreateModal={() => {
              setSelectedInitialServiceId(undefined);
              setIsCreateModalOpen(true);
            }}
          />
        </section>
      </main>

      {/* Modals */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        services={services}
        initialServiceId={selectedInitialServiceId}
        onBookingCreated={() => fetchData()}
        showToast={showToast}
      />

      <ServiceListModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        services={services}
        onSelectServiceForBooking={handleOpenCreateWithService}
      />

      <BookingStatusModal
        booking={statusModalBooking}
        isOpen={!!statusModalBooking}
        onClose={() => setStatusModalBooking(null)}
        onStatusUpdated={() => fetchData()}
        showToast={showToast}
      />

      <BookingDetailModal
        booking={detailModalBooking}
        isOpen={!!detailModalBooking}
        onClose={() => setDetailModalBooking(null)}
        onOpenStatusModal={(booking) => setStatusModalBooking(booking)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
