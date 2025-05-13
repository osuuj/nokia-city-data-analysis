'use client';

import { useEffect } from 'react';
import useSWR from 'swr';

// Smart default URL based on environment
const isProd = process.env.NODE_ENV === 'production';
const PROD_DEFAULT = 'https://api.osuuj.ai';
const DEV_DEFAULT = 'http://localhost:8000';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? PROD_DEFAULT : DEV_DEFAULT);

// Log the API base URL on component load
console.log('Preloader - API Base URL:', BASE_URL);

// Use proxy endpoint to avoid CORS issues
const USE_PROXY = true;

const fetcher = async (url: string) => {
  console.log(`Preloader - Fetching from: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });

    console.log(`Preloader - Response status for ${url}: ${res.status}`);

    if (!res.ok) {
      console.error(
        `Preloader - Fetch failed for ${url}: Status ${res.status} - ${res.statusText}`,
      );
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`Preloader - Successfully fetched data from ${url}`);
    return data;
  } catch (error) {
    console.error(`Preloader - Fetch error for ${url}:`, error);
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error(
          'This is likely a CORS or network error. Check if your API server is accessible and has proper CORS headers.',
        );
      }
    }
    return null; // Return null instead of throwing to avoid breaking the component
  }
};

/**
 * Preloader component
 * Fetches initial data for the home page when the landing page loads
 * This helps reduce the perceived loading time when navigating to the home page
 */
export function Preloader() {
  // Determine API endpoints based on whether to use proxy
  const citiesEndpoint = USE_PROXY ? '/api/proxy/cities' : `${BASE_URL}/api/v1/cities`;

  const companiesEndpoint = USE_PROXY
    ? '/api/proxy/geojson_companies/companies.geojson?city=Helsinki'
    : `${BASE_URL}/api/v1/geojson_companies/companies.geojson?city=Helsinki`;

  // Prefetch cities data
  const { data: cities, error: citiesError } = useSWR<string[]>(citiesEndpoint, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // Cache for 5 minutes
    suspense: false,
  });

  // Prefetch initial company data (using a default city)
  const { error: companiesError } = useSWR(companiesEndpoint, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // Cache for 1 minute
    suspense: false,
  });

  // Log errors if they occur
  useEffect(() => {
    if (citiesError) {
      console.error('Failed to prefetch cities:', citiesError);
    }
    if (companiesError) {
      console.error('Failed to prefetch companies:', companiesError);
    }
  }, [citiesError, companiesError]);

  // Prefetch additional data for other cities to improve initial load
  useEffect(() => {
    if (cities && cities.length > 0) {
      // Prefetch data for the top 3 cities
      const topCities = cities.slice(0, 3);
      for (const city of topCities) {
        if (city !== 'Helsinki') {
          const cityEndpoint = USE_PROXY
            ? `/api/proxy/geojson_companies/companies.geojson?city=${encodeURIComponent(city)}`
            : `${BASE_URL}/api/v1/geojson_companies/companies.geojson?city=${encodeURIComponent(city)}`;

          fetch(cityEndpoint, {
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-cache',
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(`Failed to prefetch data for ${city}: ${res.status}`);
              }
              return res.json();
            })
            .catch((err) => console.error(`Failed to prefetch data for ${city}:`, err));
        }
      }
    }
  }, [cities]);

  // This component doesn't render anything visible
  return null;
}
