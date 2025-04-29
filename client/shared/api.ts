/**
 * API Bridge Module
 *
 * This file serves as a compatibility layer for components that were
 * previously using the old API structure. It re-exports the new API
 * functionality with the same interface to minimize code changes.
 */

// Re-export from the new hooks
export * from './hooks/api/useApi';
export * from './api/endpoints';

// Default export for old imports
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Define proper types for the API
interface ApiConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

// Simple fetcher implementation
const api = {
  get: async <T>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> => {
    let queryParams = '';

    if (config?.params) {
      const filteredParams: Record<string, string> = {};
      for (const [k, v] of Object.entries(config.params)) {
        if (v !== undefined && v !== null) {
          filteredParams[k] = String(v);
        }
      }

      queryParams = `?${new URLSearchParams(filteredParams).toString()}`;
    }

    const response = await fetch(`${BASE_API_URL}/${url}${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  },

  post: async <T>(url: string, data?: unknown, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      data: result,
      success: true,
    };
  },

  put: async <T>(url: string, data?: unknown, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      data: result,
      success: true,
    };
  },

  delete: async <T>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      data: result,
      success: true,
    };
  },

  patch: async <T>(url: string, data?: unknown, config?: ApiConfig): Promise<ApiResponse<T>> => {
    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      data: result,
      success: true,
    };
  },
};

export default api;
