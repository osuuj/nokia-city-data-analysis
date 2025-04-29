/**
 * City Service
 * Handles city data operations including fetching, filtering, and geocoding
 */

import type { City } from '../hooks/analytics/types';
import { fetchWithErrorHandling } from './analyticsService';

// Constants
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

/**
 * Fetches all available cities
 */
export async function fetchCities() {
  return fetchWithErrorHandling<City[]>(`${BASE_URL}/api/v1/cities`);
}

/**
 * Fetches companies for a specific city
 */
export async function fetchCompaniesForCity(cityName: string) {
  return fetchWithErrorHandling<GeoJSON.FeatureCollection>(
    `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(cityName)}`,
  );
}

/**
 * Fetches city details
 */
export async function fetchCityDetails(cityName: string) {
  return fetchWithErrorHandling<City>(`${BASE_URL}/api/v1/cities/${encodeURIComponent(cityName)}`);
}

/**
 * Filters cities by search term
 * Client-side filtering for performance and reduced API calls
 */
export function filterCitiesBySearchTerm(cities: City[], searchTerm: string): City[] {
  if (!searchTerm) {
    return cities;
  }

  const lowercaseSearch = searchTerm.toLowerCase();
  return cities.filter((city) => city.name.toLowerCase().includes(lowercaseSearch));
}

/**
 * Gets popular/featured cities
 * Returns either from API or a predetermined list
 */
export async function getFeaturedCities(count = 5) {
  try {
    // Try to get featured cities from API
    const { data, error } = await fetchWithErrorHandling<City[]>(
      `${BASE_URL}/api/v1/cities/featured?limit=${count}`,
    );

    if (data) {
      return data;
    }

    // Fallback to default list if API fails
    return [
      { name: 'Helsinki' },
      { name: 'Tampere' },
      { name: 'Oulu' },
      { name: 'Turku' },
      { name: 'Espoo' },
    ].slice(0, count);
  } catch (error) {
    console.error('Error fetching featured cities:', error);
    // Return default list on error
    return [
      { name: 'Helsinki' },
      { name: 'Tampere' },
      { name: 'Oulu' },
      { name: 'Turku' },
      { name: 'Espoo' },
    ].slice(0, count);
  }
}
