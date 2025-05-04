/**
 * Dashboard API services
 * Centralizes all API calls related to the dashboard feature
 */

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Fetches the list of all available cities
 * @returns Promise<string[]> Array of city names
 */
export const fetchCities = async (): Promise<string[]> => {
  console.log('Fetching cities from API...');
  const response = await fetch(`${BASE_URL}/api/v1/cities`);

  if (!response.ok) {
    throw new Error(`Failed to fetch cities: ${response.status}`);
  }

  const cities = await response.json();
  console.log(`Fetched ${cities.length} cities successfully`);
  return cities;
};

/**
 * Fetches company data for a specific city in GeoJSON format
 * @param city City name to filter companies
 * @returns GeoJSON data with company features
 */
export const fetchCompanyGeoJSON = async (city: string) => {
  if (!city) {
    console.warn('City parameter is empty, skipping fetch');
    return { type: 'FeatureCollection', features: [] };
  }

  console.log(`Fetching GeoJSON data for city: ${city}`);
  const response = await fetch(
    `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(city)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch company data: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Fetched company data successfully: ${data.features?.length || 0} features`);
  return data;
};

/**
 * Fetches top cities by company count
 * @param limit Maximum number of cities to return
 * @returns Promise<Array<{city: string, count: number}>>
 */
export const fetchTopCities = async (limit = 10) => {
  const response = await fetch(`${BASE_URL}/api/v1/analytics/top-cities?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch top cities: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetches industry distribution data for cities
 * @param cities Array of city names or comma-separated city names
 * @returns Industry distribution data
 */
export const fetchIndustryDistribution = async (cities: string | string[]) => {
  const cityParam = Array.isArray(cities) ? cities.join(',') : cities;

  if (!cityParam) {
    console.warn('City parameter is empty, skipping fetch');
    return [];
  }

  const response = await fetch(
    `${BASE_URL}/api/v1/analytics/industry-distribution?cities=${encodeURIComponent(cityParam)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch industry distribution: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetches industries by city data for comparison
 * @param cities Array of city names or comma-separated city names
 * @returns Industries by city comparison data
 */
export const fetchIndustriesByCity = async (cities: string | string[]) => {
  const cityParam = Array.isArray(cities) ? cities.join(',') : cities;

  if (!cityParam) {
    console.warn('City parameter is empty, skipping fetch');
    return [];
  }

  const response = await fetch(
    `${BASE_URL}/api/v1/analytics/industries-by-city?cities=${encodeURIComponent(cityParam)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch industries by city: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetches city comparison data for selected cities
 * @param cities Array of city names or comma-separated city names
 * @returns City comparison data
 */
export const fetchCityComparison = async (cities: string | string[]) => {
  const cityParam = Array.isArray(cities) ? cities.join(',') : cities;

  if (!cityParam) {
    console.warn('City parameter is empty, skipping fetch');
    return [];
  }

  const response = await fetch(
    `${BASE_URL}/api/v1/analytics/city-comparison?cities=${encodeURIComponent(cityParam)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch city comparison: ${response.status}`);
  }

  return response.json();
};
