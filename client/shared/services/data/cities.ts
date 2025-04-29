import { cache } from 'react';

// Types
export interface City {
  id: string;
  name: string;
  country: string;
  population: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Base API URL - this should come from environment variables in production
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Get all cities (cached with React cache())
 */
export const getCities = cache(async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_API_URL}/cities`, {
      // Allow stale data to be shown while revalidation happens
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Error fetching cities: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    throw error;
  }
});

/**
 * Get a single city by ID (cached)
 */
export const getCityById = cache(async (id: string): Promise<City> => {
  try {
    const response = await fetch(`${BASE_API_URL}/cities/${id}`, {
      // Allow stale data to be shown while revalidation happens
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Error fetching city: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Failed to fetch city ${id}:`, error);
    throw error;
  }
});

/**
 * Get companies by city (cached)
 */
export const getCompaniesByCity = cache(async (city: string) => {
  try {
    const response = await fetch(`${BASE_API_URL}/companies?city=${encodeURIComponent(city)}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Error fetching companies for city ${city}: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Failed to fetch companies for city ${city}:`, error);
    throw error;
  }
});

/**
 * Get companies as GeoJSON by city (cached)
 */
export const getCompaniesGeoJsonByCity = cache(async (city: string) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}/companies.geojson?city=${encodeURIComponent(city)}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching GeoJSON data for city ${city}: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Failed to fetch GeoJSON data for city ${city}:`, error);
    throw error;
  }
});
