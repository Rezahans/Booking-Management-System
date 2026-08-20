export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  description?: string | null;
  price?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceId: string;
  service: Service;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  customerName: string;
  customerEmail: string;
  serviceId: string;
  startTime: string; // ISO format
  notes?: string;
}

export interface BookingStatistics {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
}

export interface QueryBookingParams {
  status?: BookingStatus;
  search?: string;
  serviceId?: string;
  sortBy?: 'startTime' | 'createdAt' | 'customerName' | 'status' | 'endTime';
  sortOrder?: 'asc' | 'desc';
}
