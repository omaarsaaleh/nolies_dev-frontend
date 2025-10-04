import axios, { 
  type AxiosInstance, 
  type AxiosResponse, 
  type AxiosError,
  type InternalAxiosRequestConfig
} from "axios";
import { parseAPIError, type ErrorPayload } from './errors';

const baseURL = import.meta.env.PUB_BASE_URL;

// Types for refresh queue
type QueuedRequest = {
  retryRequest: (token: string | null) => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
};

type RefreshResponse = {
  access: string;
};

// Type guard to check if data is an ErrorPayload
function isErrorPayload(data: unknown): data is ErrorPayload {
  return (
    typeof data === 'object' &&
    data !== null &&
    'code' in data &&
    'message' in data &&
    'http_status' in data &&
    typeof (data as Record<string, unknown>).code === 'string' &&
    typeof (data as Record<string, unknown>).message === 'string' &&
    typeof (data as Record<string, unknown>).http_status === 'number'
  );
}

// Global state for token refresh
let isRefreshing = false;
let refreshQueue: QueuedRequest[] = [];

/**
 * Enqueues a request to be retried after token refresh
 */
function enqueueRequest(retryRequest: (token: string | null) => Promise<unknown>): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    refreshQueue.push({ retryRequest, resolve, reject });
  });
}

/**
 * Processes all queued requests after token refresh
 */
function processQueue(error: unknown, token: string | null = null): void {
  refreshQueue.forEach(({ retryRequest, resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      retryRequest(token).then(resolve).catch(reject);
    }
  });
  refreshQueue = [];
}

/**
 * Unauthenticated API instance for public endpoints like login, register, etc.
 * 
 * Features:
 * - Error parsing and transformation
 * - No authentication interceptors
 * - Suitable for public endpoints that don't require authentication
 * 
 * @example
 * ```typescript
 * import { unauthenticatedApi } from '@/api/base';
 * 
 * const response = await unauthenticatedApi.post('/auth/login', credentials);
 * ```
 */
export const unauthenticatedApi: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

/**
 * Authenticated API instance for protected endpoints
 * 
 * Features:
 * - Automatic token attachment to requests
 * - Token refresh logic with queue management
 * - Automatic logout and redirect on authentication failure
 * - Error parsing and transformation
 * 
 * @example
 * ```typescript
 * import { authenticatedApi } from '@/api/base';
 * 
 * const response = await authenticatedApi.get('/protected-endpoint');
 * ```
 */
export const authenticatedApi: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

/**
 * Legacy API instance (kept for backward compatibility)
 * 
 * @deprecated Use unauthenticatedApi or authenticatedApi instead
 * This will be removed in a future version
 */
export const api: AxiosInstance = unauthenticatedApi;

// Add error parsing to unauthenticated API
unauthenticatedApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const data = error.response?.data;
    const parsed = data && isErrorPayload(data) ? parseAPIError(data) : error;
    return Promise.reject(parsed);
  }
);

// Add authentication interceptor to authenticated API
authenticatedApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = sessionStorage.getItem("access");
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }
);

// Add response interceptor with token refresh logic to authenticated API
authenticatedApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error?.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (!originalRequest) return Promise.reject(error);
    if (!error.response) return Promise.reject(error);

    const data = error.response.data;
    const isTokenExpired = data && isErrorPayload(data) && data.code === "AUTHENTICATION_ERROR";

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return enqueueRequest((newAccess: string | null) => {
          originalRequest.headers = originalRequest.headers || {};
          if (newAccess) {
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          }
          return authenticatedApi.request(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const response = await unauthenticatedApi.post<RefreshResponse>("/auth/tokens/refresh/");
        const newAccess = response?.data?.access;
        
        if (!newAccess) {
          throw new Error("Refresh did not return an access token");
        }

        sessionStorage.setItem("access", newAccess);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        // Resolve queued requests
        processQueue(null, newAccess);

        return authenticatedApi.request(originalRequest);
      } catch (refreshErr) {
        sessionStorage.removeItem("access");
        processQueue(refreshErr, null);
        
        try {
          await unauthenticatedApi.post("/auth/logout");
        } catch {
          // Ignore logout errors
        } finally {
          // Only redirect if not already on login page
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        const parsed = refreshErr && 
          typeof refreshErr === 'object' &&
          refreshErr !== null &&
          'response' in refreshErr && 
          refreshErr.response && 
          typeof refreshErr.response === 'object' &&
          refreshErr.response !== null &&
          'data' in refreshErr.response && 
          isErrorPayload(refreshErr.response.data)
          ? parseAPIError(refreshErr.response.data) 
          : refreshErr;
        return Promise.reject(parsed);
      } finally {
        isRefreshing = false;
      }
    }

    const parsed = data && isErrorPayload(data) ? parseAPIError(data) : error;
    return Promise.reject(parsed);
  }
);
