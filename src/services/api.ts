import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import i18n from '../i18n';
import type { User } from '../types/domain';
import type { PaginatedApiResponse } from '../types/pagination';

/**
 * Creates and configures an axios HTTP client with DizieL API defaults.
 * Handles automatic language header updates and 401 authentication errors.
 * Each service function creates a fresh instance to ensure isolation.
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': i18n.language || 'en',
    },
  });

  // Add request interceptor to update locale header on each request
  client.interceptors.request.use(
    (config) => {
      // Sync the Accept-Language header with current i18n language on every request
      // This ensures the backend serves responses in the user's selected language
      if (config.headers) {
        config.headers['Accept-Language'] = i18n.language || 'en';
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Add response interceptor to handle 401 Unauthorized
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      // Handle 401 Unauthorized by clearing auth data and redirecting to login
      // This prevents users from accessing protected resources with expired/invalid tokens
      if (error.response?.status === 401) {
        // Don't redirect if this is a login request itself (to avoid redirect loops)
        const requestUrl = error.config?.url || '';
        const isLoginRequest = requestUrl.includes('/auth/login');

        if (!isLoginRequest) {
          // Only redirect if not already on login page to avoid infinite loops
          const currentPath = window.location.pathname;
          const loginRoute = import.meta.env.VITE_LOGIN_ROUTE || '/login';

          if (!currentPath.includes(loginRoute)) {
            // Clear stored auth data from localStorage
            // This matches what the logout action does in authSlice
            const userDataStorageKey = import.meta.env.VITE_USER_DATA_STORAGE;
            if (userDataStorageKey) {
              localStorage.removeItem(userDataStorageKey);
            }

            // Clear any other auth-related data if needed
            // Note: Redux state will be cleared on page reload/redirect

            // Redirect to login page
            window.location.href = loginRoute;
          }
        }
      }

      // Return the error so it can be handled by the calling code
      return Promise.reject(error);
    },
  );

  return client;
};

// Authentication Service - Handles user login, registration, and password management
export const authService = {
  login: (email: string, password: string) => {
    const client = createApiClient();
    return client.post('/auth/login', { email, password });
  },

  logout: () => {
    const client = createApiClient();
    return client.post('/auth/logout');
  },

  me: () => {
    const client = createApiClient();
    return client.get('/auth/me');
  },

  register: (data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.post('/auth/register', data);
  },

  forgotPassword: (email: string) => {
    const client = createApiClient();
    return client.post('/auth/forgot-password', { email });
  },

  resetPassword: (data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.post('/auth/reset-password', data);
  },
};

// User Service - Manages user CRUD operations and user-related data
export const userService = {
  getAll: (page = 1, limit = 10): Promise<AxiosResponse<PaginatedApiResponse<User>>> => {
    const client = createApiClient();
    return client.get('/users', {
      params: {
        page,
        limit,
      },
    });
  },

  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/users/${id}`);
  },

  create: (data: Record<string, unknown>) => {
    const client = createApiClient();
    // If data is FormData, don't set Content-Type - browser will set it with boundary
    if (data instanceof FormData) {
      return client.post('/users', data, {
        headers: {
          'Content-Type': undefined, // Let browser set Content-Type with boundary
        },
      });
    }
    return client.post('/users', data);
  },

  update: (id: number, data: Record<string, unknown>) => {
    // If data is FormData, use POST for file uploads
    // Laravel API routes don't support method spoofing, so we use POST directly
    if (data instanceof FormData) {
      const formDataClient = createApiClient();
      // Remove Content-Type header for FormData - browser will set it with boundary
      delete formDataClient.defaults.headers['Content-Type'];
      return formDataClient.post(`/users/${id}`, data);
    }
    const client = createApiClient();
    return client.put(`/users/${id}`, data);
  },

  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/users/${id}`);
  },
};

// Driver Service - Manages driver profiles, documents, and verification
export const driverService = {
  /**
   * Retrieves a paginated list of drivers with optional filtering
   * Supports filters like status, verification_status, rating, etc.
   */
  getAll: (page = 1, limit = 10, additionalParams?: Record<string, unknown>) => {
    const client = createApiClient();
    const params: Record<string, unknown> = { page, limit };

    // Merge any additional query parameters (like filters)
    if (additionalParams) {
      Object.keys(additionalParams).forEach((key) => {
        if (
          additionalParams[key] !== undefined &&
          additionalParams[key] !== null &&
          additionalParams[key] !== ''
        ) {
          params[key] = additionalParams[key];
        }
      });
    }

    return client.get('/drivers', { params });
  },

  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${id}`);
  },

  create: (data: Record<string, unknown>) => {
    const client = createApiClient();
    // If data is FormData, don't set Content-Type - browser will set it with boundary
    if (data instanceof FormData) {
      return client.post('/drivers', data, {
        headers: {
          'Content-Type': undefined, // Let browser set Content-Type with boundary
        },
      });
    }
    return client.post('/drivers', data);
  },

  update: (id: number, data: Record<string, unknown>) => {
    // If data is FormData, use POST for file uploads
    if (data instanceof FormData) {
      const formDataClient = createApiClient();
      // Remove Content-Type header for FormData - browser will set it with boundary
      delete formDataClient.defaults.headers['Content-Type'];
      return formDataClient.post(`/drivers/${id}`, data);
    }
    const client = createApiClient();
    return client.post(`/drivers/${id}`, data);
  },

  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/drivers/${id}`);
  },

  // Document management methods for driver verification
  getDocuments: (driverId: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${driverId}/documents`);
  },

  uploadDocument: (driverId: number, formData: FormData) => {
    const client = createApiClient();
    return client.post(`/drivers/${driverId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  verifyDocument: (driverId: number, documentId: number, rejectionReason?: string) => {
    const client = createApiClient();
    return client.post(`/drivers/${driverId}/documents/${documentId}/verify`, {
      rejection_reason: rejectionReason || null,
    });
  },

  rejectDocument: (driverId: number, documentId: number, rejectionReason: string) => {
    const client = createApiClient();
    return client.post(`/drivers/${driverId}/documents/${documentId}/verify`, {
      rejection_reason: rejectionReason,
    });
  },

  downloadDocument: (driverId: number, documentId: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${driverId}/documents/${documentId}/download`, {
      responseType: 'blob',
    });
  },

  updateDocument: (driverId: number, documentId: number, formData: FormData) => {
    const client = createApiClient();
    // Remove Content-Type header for FormData - browser will set it with boundary
    delete client.defaults.headers['Content-Type'];
    return client.put(`/drivers/${driverId}/documents/${documentId}`, formData);
  },

  deleteDocument: (driverId: number, documentId: number) => {
    const client = createApiClient();
    return client.delete(`/drivers/${driverId}/documents/${documentId}`);
  },

  expireDocument: (driverId: number, documentId: number) => {
    const client = createApiClient();
    return client.put(`/drivers/${driverId}/documents/${documentId}`, {
      verification_status: 'expired',
    });
  },
};

// Vehicle Service - Manages vehicle profiles and verification
export const vehicleService = {
  /**
   * Retrieves vehicles with advanced filtering options
   * Supports filtering by status, verification status, driver, type, and specs
   */
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    verification_status?: string;
    vehicle_type_id?: number | string;
    driver_id?: number;
    make?: string;
    model?: string;
    license_plate?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, unknown> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;
    if (params?.verification_status) queryParams.verification_status = params.verification_status;
    if (params?.vehicle_type_id) queryParams.vehicle_type_id = params.vehicle_type_id;
    if (params?.driver_id) queryParams.driver_id = params.driver_id;
    if (params?.make) queryParams.make = params.make;
    if (params?.model) queryParams.model = params.model;
    if (params?.license_plate) queryParams.license_plate = params.license_plate;

    return client.get('/vehicles', { params: queryParams });
  },

  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/vehicles/${id}`);
  },

  getByDriver: (driverId: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${driverId}/vehicles`);
  },

  create: (data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.post('/vehicles', data);
  },

  update: (id: number, data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.put(`/vehicles/${id}`, data);
  },

  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/vehicles/${id}`);
  },

  verify: (id: number, action: 'verify' | 'reject', notes?: string) => {
    const client = createApiClient();
    return client.post(`/vehicles/${id}/verify`, { action, notes });
  },

  setPrimary: (id: number) => {
    const client = createApiClient();
    return client.post(`/vehicles/${id}/set-primary`);
  },
};

// Trip Service - Manages trip lifecycle and operations
export const tripService = {
  getAll: (params: Record<string, unknown> = {}) => {
    const client = createApiClient();
    return client.get('/trips', { params });
  },

  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/trips/${id}`);
  },

  create: (data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.post('/trips', data);
  },

  update: (id: number, data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.put(`/trips/${id}`, data);
  },

  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/trips/${id}`);
  },

  acceptOffer: (id: number, offerId: number) => {
    const client = createApiClient();
    return client.post(`/trips/${id}/accept-offer`, { offer_id: offerId });
  },

  start: (id: number) => {
    const client = createApiClient();
    return client.post(`/trips/${id}/start`);
  },

  complete: (id: number) => {
    const client = createApiClient();
    return client.post(`/trips/${id}/complete`);
  },

  cancel: (id: number, reason?: string) => {
    const client = createApiClient();
    return client.post(`/trips/${id}/cancel`, { reason });
  },
};

// Trip Offer Service - Manages driver offers on trips
export const tripOfferService = {
  getByTrip: (tripId: number) => {
    const client = createApiClient();
    return client.get(`/trips/${tripId}/offers`);
  },

  getById: (tripId: number, offerId: number) => {
    const client = createApiClient();
    return client.get(`/trips/${tripId}/offers/${offerId}`);
  },

  create: (tripId: number, data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.post(`/trips/${tripId}/offers`, data);
  },

  update: (tripId: number, offerId: number, data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.put(`/trips/${tripId}/offers/${offerId}`, data);
  },

  delete: (tripId: number, offerId: number) => {
    const client = createApiClient();
    return client.delete(`/trips/${tripId}/offers/${offerId}`);
  },

  withdraw: (tripId: number, offerId: number) => {
    const client = createApiClient();
    return client.post(`/trips/${tripId}/offers/${offerId}/withdraw`);
  },
};

// Vehicle Type Service - Manages vehicle classifications for the platform
export const vehicleTypeService = {
  /**
   * Retrieves vehicle types with optional status filtering
   * Vehicle types define the categories (sedan, SUV, etc.) available on DizieL
   */
  getAll: (params?: { page?: number; limit?: number; status?: 'active' | 'inactive' }) => {
    const client = createApiClient();
    const queryParams: Record<string, unknown> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;

    return client.get('/vehicle-types', { params: queryParams });
  },

  getActive: () => {
    const client = createApiClient();
    return client.get('/vehicle-types/active');
  },

  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/vehicle-types/${id}`);
  },

  create: (data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.post('/vehicle-types', data);
  },

  update: (id: number, data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.put(`/vehicle-types/${id}`, data);
  },

  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/vehicle-types/${id}`);
  },
};

// Coupon Service - Admin-only coupon management for promotional campaigns
export const couponService = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) => {
    const client = createApiClient();
    const queryParams: Record<string, unknown> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;

    return client.get('/admin/coupons', { params: queryParams });
  },

  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/admin/coupons/${id}`);
  },

  create: (data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.post('/admin/coupons', data);
  },

  update: (id: number, data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.put(`/admin/coupons/${id}`, data);
  },

  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/admin/coupons/${id}`);
  },
};

// Ad Service - Admin-only advertisement management system
export const adService = {
  /**
   * Retrieves advertisements with filtering by active status and date ranges
   * Used for managing promotional content throughout the DizieL platform
   */
  getAll: (params?: {
    page?: number;
    limit?: number;
    is_active?: string;
    valid_from?: string;
    valid_until?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, unknown> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.is_active) queryParams.is_active = params.is_active;
    if (params?.valid_from) queryParams.valid_from = params.valid_from;
    if (params?.valid_until) queryParams.valid_until = params.valid_until;

    return client.get('/admin/ads', { params: queryParams });
  },

  getActive: () => {
    const client = createApiClient();
    return client.get('/ads');
  },

  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/admin/ads/${id}`);
  },

  create: (data: Record<string, unknown>) => {
    const client = createApiClient();
    // If data is FormData, don't set Content-Type - browser will set it with boundary
    if (data instanceof FormData) {
      return client.post('/admin/ads', data, {
        headers: {
          'Content-Type': undefined, // Let browser set Content-Type with boundary
        },
      });
    }
    return client.post('/admin/ads', data);
  },

  update: (id: number, data: Record<string, unknown>) => {
    // If data is FormData, use POST for file uploads with method spoofing
    if (data instanceof FormData) {
      const formDataClient = createApiClient();
      // Add _method=PUT for Laravel method spoofing
      if (!data.has('_method')) {
        data.append('_method', 'PUT');
      }
      // Remove Content-Type header for FormData - browser will set it with boundary
      delete formDataClient.defaults.headers['Content-Type'];
      return formDataClient.post(`/admin/ads/${id}`, data);
    }
    const client = createApiClient();
    return client.put(`/admin/ads/${id}`, data);
  },

  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/admin/ads/${id}`);
  },
};

// Complaint Service - Manages user complaints against drivers or other issues
export const complaintService = {
  /**
   * Retrieves complaints with advanced filtering capabilities
   * Admins can filter by status, user, type, subject for better issue management
   */
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    user_id?: number | string;
    complaintable_type?: string;
    subject?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, unknown> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;
    if (params?.user_id) queryParams.user_id = params.user_id;
    if (params?.complaintable_type) queryParams.complaintable_type = params.complaintable_type;
    if (params?.subject) queryParams.subject = params.subject;

    return client.get('/complaints', { params: queryParams });
  },

  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/complaints/${id}`);
  },

  create: (data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.post('/complaints', data);
  },

  update: (id: number, data: Record<string, unknown>) => {
    const client = createApiClient();
    return client.put(`/complaints/${id}`, data);
  },

  resolve: (id: number, data: { resolution_notes?: string }) => {
    const client = createApiClient();
    return client.post(`/admin/complaints/${id}/resolve`, data);
  },

  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/complaints/${id}`);
  },
};

// Rating Service - Manages user and driver ratings and reviews
export const ratingService = {
  submitRating: (tripId: number, data: Partial<Record<string, unknown>>) => {
    const client = createApiClient();
    return client.post(`/trips/${tripId}/ratings`, data);
  },

  getTripRatings: (tripId: number) => {
    const client = createApiClient();
    return client.get(`/trips/${tripId}/ratings`);
  },

  getDriverRatings: (driverId: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${driverId}/ratings`);
  },

  getUserRatings: (userId: number) => {
    const client = createApiClient();
    return client.get(`/users/${userId}/ratings`);
  },

  canRate: (tripId: number) => {
    const client = createApiClient();
    return client.get(`/trips/${tripId}/can-rate`);
  },
};

// Notification Service - Admin-only push notifications for users and drivers
export const notificationService = {
  /**
   * Retrieves paginated notifications with optional filtering by target type
   * Used by admins to track notification history and delivery
   */
  getAll: (params?: { page?: number; limit?: number; target_type?: string }) => {
    const client = createApiClient();
    const queryParams: Record<string, unknown> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.target_type) queryParams.target_type = params.target_type;

    return client.get('/admin/notifications', { params: queryParams });
  },

  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/admin/notifications/${id}`);
  },

  send: (data: {
    title: string;
    body: string;
    target_type: 'user' | 'driver' | 'all_users' | 'all_drivers';
    user_id?: number;
    driver_id?: number;
  }) => {
    const client = createApiClient();
    return client.post('/admin/notifications/send', data);
  },

  test: (data: {
    title: string;
    body: string;
    target_type: 'user' | 'driver' | 'all_users' | 'all_drivers';
    user_id?: number;
    driver_id?: number;
  }) => {
    const client = createApiClient();
    return client.post('/admin/notifications/test', data);
  },
};

// Statistics Service - Admin-only analytics and platform metrics
export const statisticsService = {
  /**
   * Retrieves comprehensive platform statistics including:
   * - Active users and drivers
   * - Total trips and revenue
   * - Performance metrics and growth trends
   */
  getStatistics: () => {
    const client = createApiClient();
    return client.get('/admin/statistics');
  },
};
