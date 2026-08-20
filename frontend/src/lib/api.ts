import {
  Booking,
  BookingStatistics,
  BookingStatus,
  CreateBookingPayload,
  QueryBookingParams,
  Service,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred';
      if (data && typeof data === 'object') {
        if (Array.isArray(data.message)) {
          errorMessage = data.message.join(', ');
        } else if (typeof data.message === 'string') {
          errorMessage = data.message;
        }
      }
      throw new ApiError(errorMessage, response.status);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unable to connect to the backend server',
      500,
    );
  }
}

export const api = {
  // Services
  getServices: async (): Promise<Service[]> => {
    return request<Service[]>('/services');
  },

  getServiceById: async (id: string): Promise<Service> => {
    return request<Service>(`/services/${id}`);
  },

  // Bookings
  getBookings: async (params?: QueryBookingParams): Promise<Booking[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.serviceId) query.append('serviceId', params.serviceId);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const endpoint = queryString ? `/bookings?${queryString}` : '/bookings';
    return request<Booking[]>(endpoint);
  },

  getBookingById: async (id: string): Promise<Booking> => {
    return request<Booking>(`/bookings/${id}`);
  },

  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateBookingStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
    return request<Booking>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getStatistics: async (): Promise<BookingStatistics> => {
    return request<BookingStatistics>('/bookings/statistics');
  },
};
