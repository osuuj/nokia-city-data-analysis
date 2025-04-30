import { useQuery } from '@tanstack/react-query';
import type { FeatureCollection, Point } from 'geojson';
import type { CompanyProperties } from '../../types';

// Fix the BASE_URL to prevent double /api/v1 prefix
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const API_PATH = '/api/v1';

// Fallback GeoJSON data for development/testing
const FALLBACK_GEOJSON: FeatureCollection<Point, CompanyProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [25.4651, 65.0121], // Example: Oulu coordinates
      },
      properties: {
        business_id: 'mock-1',
        company_name: 'Mock Company 1',
        company_type: 'Limited',
        registration_date: '2020-01-01',
        website: 'https://example.com',
        industry: 'Computer programming',
        industry_letter: 'J',
        industry_description: 'Computer programming activities',
        addresses: {
          'Visiting address': {
            street: 'Test Street 1',
            building_number: '1',
            postal_code: '12345',
            city: 'Oulu',
            latitude: 65.0121,
            longitude: 25.4651,
          },
          'Postal address': {
            street: 'Test Street 1',
            building_number: '1',
            postal_code: '12345',
            city: 'Oulu',
            latitude: 65.0121,
            longitude: 25.4651,
          },
        },
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [25.5861, 64.9136], // Different point in Oulu
      },
      properties: {
        business_id: 'mock-2',
        company_name: 'Mock Company 2',
        company_type: 'Limited',
        registration_date: '2019-02-15',
        website: 'https://example2.com',
        industry: 'Computer consultancy',
        industry_letter: 'J',
        industry_description: 'Computer consultancy activities',
        addresses: {
          'Visiting address': {
            street: 'Business Park',
            building_number: '5',
            postal_code: '90570',
            city: 'Oulu',
            latitude: 64.9136,
            longitude: 25.5861,
          },
        },
      },
    },
  ],
};

/**
 * Custom hook for fetching GeoJSON data for a specific city
 *
 * @param city - The city to fetch data for
 * @returns Query result containing GeoJSON data, loading state, and error
 */
export function useGeoJSONData(city?: string) {
  return useQuery<FeatureCollection<Point, CompanyProperties>>({
    queryKey: ['geojson', city],
    queryFn: async () => {
      if (!city) {
        console.log('No city selected for GeoJSON fetch');
        return { type: 'FeatureCollection', features: [] };
      }

      // Log the URL we're fetching from with correct path
      const url = `${BASE_URL}${API_PATH}/companies.geojson?city=${encodeURIComponent(city)}`;
      console.log('Fetching GeoJSON data from:', url);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`Failed to fetch GeoJSON data: ${response.status} ${response.statusText}`);
          // In development, return fallback data instead of throwing
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Using fallback GeoJSON data for development');
            return FALLBACK_GEOJSON;
          }
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        console.log(`GeoJSON data fetched for ${city}:`, {
          type: data.type,
          featureCount: data.features?.length || 0,
        });

        // Filter out features with invalid geometries
        const validFeatures = data.features.filter((feature) => feature.geometry?.coordinates);

        console.log(
          `GeoJSON data processed: ${validFeatures.length}/${data.features.length} valid features`,
        );

        return {
          ...data,
          features: validFeatures,
        };
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
        // Return fallback data in development mode
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Using fallback GeoJSON data due to fetch error');
          return FALLBACK_GEOJSON;
        }
        throw error;
      }
    },
    enabled: !!city,
    staleTime: 60000, // Cache for 1 minute
    gcTime: 300000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });
}

/**
 * Custom hook for fetching available cities
 *
 * @returns Query result containing array of cities, loading state, and error
 */
export function useCitiesData() {
  return useQuery<string[]>({
    queryKey: ['cities'],
    queryFn: async () => {
      // Log the URL we're fetching from with correct path
      const url = `${BASE_URL}${API_PATH}/cities`;
      console.log('Fetching cities data from:', url);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          console.error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
          // In development, return fallback cities
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Using fallback cities data for development');
            return ['Helsinki', 'Tampere', 'Oulu', 'Turku', 'Espoo'];
          }
          throw new Error(`Failed to fetch cities: ${response.status}`);
        }

        const data = await response.json();
        console.log('Cities data fetched:', data.length);

        return data;
      } catch (error) {
        console.error('Error fetching cities:', error);
        // Return fallback data in development mode
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Using fallback cities due to fetch error');
          return ['Helsinki', 'Tampere', 'Oulu', 'Turku', 'Espoo'];
        }
        throw error;
      }
    },
    staleTime: 300000, // Cache for 5 minutes
    gcTime: 600000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
