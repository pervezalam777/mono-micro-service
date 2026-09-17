import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Microservice base URLs from environment variables
export const API_BASE_URLS = {
  gateway: import.meta.env.VITE_API_ALL_URL || 'http://localhost:4000/api/v1',
} as const;

// Base API instance (can be used for shared endpoints)
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URLS.gateway, // Default base URL (gateway for local dev)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Helper function to convert snake_case keys to camelCase
const convertToCamelCase = <T extends object>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCase(item)) as unknown as T;
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = typeof value === 'object' ? convertToCamelCase(value) : value;
  }
  return result as T;
};


// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Convert response data to camelCase
    if (response.data) {
      response.data = convertToCamelCase(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await api.post(`/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
