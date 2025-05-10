/**
 * API utilities for interacting with the server API
 */

import axios, { type AxiosError } from 'axios';

// Define base URL from environment variables or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Add common error handling
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  },
);

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
  const response = await api.get<string[]>('/companies/cities');
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
