/**
 * API utilities for interacting with the server API
 */

import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Determine environment for better defaults
const isProd = process.env.NODE_ENV === 'production';
const PROD_DEFAULT = 'https://api.osuuj.ai';
const DEV_DEFAULT = 'http://localhost:8000';

// Define API configuration from environment variables with fallbacks
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (isProd ? PROD_DEFAULT : DEV_DEFAULT);
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';

// Maximum number of retries for network errors
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// API error types for better error handling
export enum ApiErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

export interface ApiError {
  type: ApiErrorType;
  status?: number;
  message: string;
  data?: Record<string, unknown>;
}

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

/**
 * Categorize errors into more usable types
 */
const categorizeError = (error: AxiosError): ApiError => {
  if (!error.response) {
    return {
      type: ApiErrorType.NETWORK,
      message: 'Network error. Please check your connection.',
    };
  }

  const status = error.response.status;
  const data = error.response.data as Record<string, unknown>;

  switch (status) {
    case 401:
      return {
        type: ApiErrorType.UNAUTHORIZED,
        status,
        message: 'Unauthorized. Please log in.',
        data,
      };
    case 403:
      return {
        type: ApiErrorType.FORBIDDEN,
        status,
        message: "Forbidden. You don't have permission.",
        data,
      };
    case 404:
      return {
        type: ApiErrorType.NOT_FOUND,
        status,
        message: 'Resource not found.',
        data,
      };
    case 422:
      return {
        type: ApiErrorType.VALIDATION,
        status,
        message: 'Validation error.',
        data,
      };
    default:
      if (status >= 500) {
        return {
          type: ApiErrorType.SERVER,
          status,
          message: 'Server error. Please try again later.',
          data,
        };
      }
      return {
        type: ApiErrorType.UNKNOWN,
        status,
        message: 'An unexpected error occurred.',
        data,
      };
  }
};

/**
 * Implement retry logic for transient errors
 */
const requestWithRetry = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
): Promise<T> => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    if (
      retries > 0 &&
      axios.isAxiosError(error) &&
      !error.response // Only retry network errors
    ) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return requestWithRetry(requestFn, retries - 1, delay * 1.5);
    }

    if (axios.isAxiosError(error)) {
      const apiError = categorizeError(error);
      throw apiError;
    }

    throw error;
  }
};

// Define type for request data
type RequestData = Record<string, unknown>;

// Enhanced API client with retry logic and better error handling
export const apiClient = {
  get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    return requestWithRetry<T>(() => api.get<T>(endpoint, config));
  },

  post: async <T>(
    endpoint: string,
    data?: RequestData,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return requestWithRetry<T>(() => api.post<T>(endpoint, data, config));
  },

  put: async <T>(endpoint: string, data?: RequestData, config?: AxiosRequestConfig): Promise<T> => {
    return requestWithRetry<T>(() => api.put<T>(endpoint, data, config));
  },

  delete: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    return requestWithRetry<T>(() => api.delete<T>(endpoint, config));
  },
};

// API interfaces
interface BusinessData {
  business_id: string;
  company_name: string;
  company_type: string;
  street: string;
  building_number: string;
  entrance: string;
  postal_code: string;
  city: string;
  latitude_wgs84: string;
  longitude_wgs84: string;
  address_type: string;
  active: string;
  industry_description: string;
  industry_letter: string;
  industry: string;
  registration_date: string;
  website: string;
}

interface IndustryDistribution {
  industry_letter: string;
  count: number;
  percentage: number;
  industry_description: string;
}

interface IndustryComparison {
  industry_letter: string;
  industry_description: string;
  city1_count: number;
  city2_count: number;
  city1_percentage: number;
  city2_percentage: number;
  difference: number;
}

// Company growth interface
interface CompanyGrowth {
  year: number;
  count: number;
  cumulative_count: number;
}

// GeoJSON interfaces
interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    business_id: string;
    company_name: string;
    industry: string;
    industry_letter: string;
    [key: string]: string | number | null;
  };
}

interface GeoJSONResponse {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// API functions

// Companies endpoints
export const getBusinessesByCity = async (city: string): Promise<BusinessData[]> => {
  const response = await api.get<BusinessData[]>('/companies/businesses_by_city', {
    params: { city },
  });
  return response.data;
};

export const getBusinessesByIndustry = async (
  industry_letter: string,
  city?: string,
  limit = 100,
): Promise<BusinessData[]> => {
  const response = await api.get<BusinessData[]>('/companies/businesses_by_industry', {
    params: { industry_letter, city, limit },
  });
  return response.data;
};

export const getCities = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/cities');
  return response.data;
};

export const getIndustries = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/companies/industries');
  return response.data;
};

// Analytics endpoints
export const getIndustryDistribution = async (cities?: string): Promise<IndustryDistribution[]> => {
  const response = await api.get<IndustryDistribution[]>('/analytics/industry-distribution', {
    params: { cities },
  });
  return response.data;
};

export const getIndustryComparison = async (
  city1: string,
  city2: string,
): Promise<IndustryComparison[]> => {
  const response = await api.get<IndustryComparison[]>('/analytics/industry_comparison_by_cities', {
    params: { city1, city2 },
  });
  return response.data;
};

export const getCompanyGrowth = async (city: string): Promise<CompanyGrowth[]> => {
  const response = await api.get('/analytics/company_growth', {
    params: { city },
  });
  return response.data;
};

// GeoJSON endpoint
export const getCompaniesGeoJSON = async (city: string): Promise<GeoJSONResponse> => {
  const response = await api.get('/geojson_companies/companies.geojson', {
    params: { city },
  });
  return response.data;
};

export default api;
