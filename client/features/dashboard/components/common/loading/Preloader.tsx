'use client';

import { useEffect } from 'react';
import useSWR from 'swr';

// Smart default URL based on environment
const isProd = process.env.NODE_ENV === 'production';
const PROD_DEFAULT = 'https://api.osuuj.ai';
const DEV_DEFAULT = 'http://localhost:8000';
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? PROD_DEFAULT : DEV_DEFAULT);

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Preloader fetch error for ${url}:`, error);
    return null; // Return null instead of throwing to avoid breaking the component
  }
};

/**
 * Preloader component
 * Fetches initial data for the home page when the landing page loads
 * This helps reduce the perceived loading time when navigating to the home page
 */
export function Preloader() {
  // Prefetch cities data
  const { data: cities, error: citiesError } = useSWR<string[]>(
    `${BASE_URL}/api/v1/companies/cities`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // Cache for 5 minutes
      suspense: false,
    },
  );

  // Prefetch initial company data (using a default city)
  const { error: companiesError } = useSWR(
    `${BASE_URL}/api/v1/geojson_companies/companies.geojson?city=Helsinki`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
      suspense: false,
    },
  );

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
          fetch(
            `${BASE_URL}/api/v1/geojson_companies/companies.geojson?city=${encodeURIComponent(city)}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              cache: 'no-cache',
            },
          )
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
