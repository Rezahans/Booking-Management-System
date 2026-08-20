'use client';

import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, Service } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDateTime, formatDateOnly, formatTimeOnly } from '@/lib/utils';
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Calendar,
  Clock,
  User,
  Mail,
  Sparkles,
  RefreshCw,
  Eye,
  X,
  ChevronDown,
} from 'lucide-react';

interface BookingTableProps {
  bookings: Booking[];
  services: Service[];
  loading: boolean;
  activeStatusFilter: BookingStatus | 'ALL';
  onStatusFilterChange: (status: BookingStatus | 'ALL') => void;
  onOpenStatusModal: (booking: Booking) => void;
  onOpenDetailModal: (booking: Booking) => void;
  onOpenCreateModal: () => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  services,
  loading,
  activeStatusFilter,
  onStatusFilterChange,
  onOpenStatusModal,
  onOpenDetailModal,
  onOpenCreateModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'startTime' | 'customerName' | 'createdAt'>('startTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and Sort bookings client-side for ultra-fast UX
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        // Status filter
        if (activeStatusFilter !== 'ALL' && booking.status !== activeStatusFilter) {
          return false;
        }

        // Service filter
        if (selectedServiceId !== 'ALL' && booking.serviceId !== selectedServiceId) {
          return false;
        }

        // Search term filter
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          const matchesName = booking.customerName.toLowerCase().includes(term);
          const matchesEmail = booking.customerEmail.toLowerCase().includes(term);
          const matchesService = booking.service?.name?.toLowerCase().includes(term);
          if (!matchesName && !matchesEmail && !matchesService) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'startTime') {
          const timeA = new Date(a.startTime).getTime();
          const timeB = new Date(b.startTime).getTime();
          return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        }
        if (sortBy === 'createdAt') {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        }
        if (sortBy === 'customerName') {
          return sortOrder === 'asc'
            ? a.customerName.localeCompare(b.customerName)
            : b.customerName.localeCompare(a.customerName);
        }
        return 0;
      });
  }, [bookings, activeStatusFilter, selectedServiceId, searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const statusTabs: { id: BookingStatus | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Table Top Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {statusTabs.map((tab) => {
            const count =
              tab.id === 'ALL'
                ? bookings.length
                : bookings.filter((b) => b.status === tab.id).length;
            const isActive = activeStatusFilter === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onStatusFilterChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[11px] ${
                    isActive
                      ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Service Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="ALL">All Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration}m)
                </option>
              ))}
            </select>

            {/* Sort Order Toggle */}
            <button
              onClick={toggleSortOrder}
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer flex items-center gap-1 text-xs font-medium"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden md:inline uppercase text-[10px] font-bold tracking-wider">
                {sortOrder}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Service</th>
              <th className="px-5 py-3.5">Schedule</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4">
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-1" />
                    <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800/50 rounded" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        No bookings found
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {searchTerm
                          ? 'Try adjusting your search query or filters.'
                          : 'Create a new customer booking to get started.'}
                      </p>
                    </div>
                    {!searchTerm && (
                      <button
                        onClick={onOpenCreateModal}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                      >
                        + Create First Booking
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs shrink-0">
                        {booking.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {booking.customerName}
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1 text-[11px]">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[180px]">{booking.customerEmail}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{booking.service?.name}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{booking.service?.duration} mins</span>
                      {booking.service?.price != null && (
                        <span>• {formatCurrency(booking.service.price)}</span>
                      )}
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 shrink-0" />
                      <span>{formatDateOnly(booking.startTime)}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px] flex items-center gap-1 mt-0.5 font-mono">
                      <span>{formatTimeOnly(booking.startTime)}</span>
                      <span>→</span>
                      <span>{formatTimeOnly(booking.endTime)}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenStatusModal(booking)}
                        title="Change Status"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span className="hidden sm:inline">Status</span>
                      </button>

                      <button
                        onClick={() => onOpenDetailModal(booking)}
                        title="View Details"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <span>
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredBookings.length}</span> of{' '}
          <span className="font-semibold text-slate-900 dark:text-white">{bookings.length}</span> bookings
        </span>
        <span className="text-[11px] text-slate-600 dark:text-slate-300">
          Staff Internal Tools • Auto-synced
        </span>
      </div>
    </div>
  );
};
