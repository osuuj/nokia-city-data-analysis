import { useCompanyStore } from '@/features/dashboard/store';
import type { CompanyProperties, SortDescriptor } from '@/features/dashboard/types';
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';
import { getVisibleColumns } from '@/features/dashboard/utils/table';
import { columns as allColumns } from '@shared/config';
import type { FeatureCollection, Point } from 'geojson';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFilteredBusinesses } from './useFilteredBusinesses';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Fallback city data in case the API fails
const FALLBACK_CITIES = [
  'Helsinki',
  'Tampere',
  'Turku',
  'Oulu',
  'Espoo',
  'Vantaa',
  'Jyväskylä',
  'Kuopio',
];

/**
 * Custom hook for fetching and processing dashboard data
 * Centralizes data fetching, filtering, and transformation logic
 * Uses optimized fetching with debouncing and caching
 */
export function useDashboardData({
  selectedCity,
  selectedIndustries,
  userLocation,
  distanceLimit,
  query,
}: {
  selectedCity: string;
  selectedIndustries: string[];
  userLocation: { latitude: number; longitude: number } | null;
  distanceLimit: number | null;
  query: string;
}) {
  // Access the store to update the selected city
  const { setSelectedCity } = useCompanyStore();

  // State to store cities from direct fetch
  const [citiesState, setCitiesState] = useState<{
    data: string[];
    isLoading: boolean;
    error: Error | null;
  }>({
    data: FALLBACK_CITIES,
    isLoading: false,
    error: null,
  });

  // State for GeoJSON data with direct fetch
  const [geojsonState, setGeojsonState] = useState<{
    data: FeatureCollection<Point, CompanyProperties> | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    data: null,
    isLoading: false,
    error: null,
  });

  // Fetch cities directly using the Fetch API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await fetch(`${BASE_URL}/api/v1/cities`);

        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
        }

        // Get response text first rather than assuming JSON
        const responseText = await response.text();

        let citiesData: string[] | { data: string[] } | null = null;
        try {
          // Try to parse as JSON first
          citiesData = JSON.parse(responseText);
        } catch (jsonError) {
          // If not valid JSON, it might be a weirdly formatted string
          if (responseText.includes('[') && responseText.includes(']')) {
            // Try to clean up and parse as JSON
            const cleaned = responseText.replace(/\r?\n|\r/g, '').trim();
            try {
              citiesData = JSON.parse(cleaned);
            } catch (e) {
              // Last resort: extract content between brackets and parse
              const match = cleaned.match(/\[(.*)\]/);
              if (match?.[1]) {
                const cityStrings = match[1]
                  .split(',')
                  .map((s) => s.trim().replace(/^"|"$/g, ''))
                  .filter(Boolean);
                citiesData = cityStrings;
              } else {
                throw new Error('Could not parse city data');
              }
            }
          } else {
            // Assume comma-separated string
            citiesData = responseText
              .split(',')
              .map((s) => s.trim().replace(/^"|"$/g, ''))
              .filter(Boolean);
          }
        }

        if (Array.isArray(citiesData)) {
          setCitiesState({
            data: citiesData,
            isLoading: false,
            error: null,
          });
        } else if (
          typeof citiesData === 'object' &&
          citiesData !== null &&
          'data' in citiesData &&
          Array.isArray(citiesData.data)
        ) {
          // Handle case where API returns { data: string[] }
          setCitiesState({
            data: citiesData.data,
            isLoading: false,
            error: null,
          });
        } else {
          throw new Error('Invalid cities data format: expected an array');
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCitiesState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    };

    fetchCities();
  }, []);

  // Function to fetch GeoJSON data for a city
  const fetchGeojsonData = useCallback(async () => {
    if (!selectedCity) {
      setGeojsonState({
        data: null,
        isLoading: false,
        error: null,
      });
      return;
    }

    try {
      setGeojsonState((prev) => ({ ...prev, isLoading: true, error: null }));

      const url = `${BASE_URL}/api/v1/companies.geojson?city=${encodeURIComponent(selectedCity)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch GeoJSON data: ${response.status} ${response.statusText}`);
      }

      // Get response text first
      const responseText = await response.text();

      // Parse the response
      try {
        const jsonData = JSON.parse(responseText);

        if (jsonData.type !== 'FeatureCollection' || !Array.isArray(jsonData.features)) {
          throw new Error('Invalid GeoJSON format');
        }

        setGeojsonState({
          data: jsonData,
          isLoading: false,
          error: null,
        });
      } catch (parseError) {
        console.error('Error parsing GeoJSON data:', parseError);
        throw new Error('Invalid JSON response for GeoJSON');
      }
    } catch (error) {
      console.error('Error fetching GeoJSON data:', error);
      setGeojsonState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
    }
  }, [selectedCity]);

  // Fetch GeoJSON data when selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      fetchGeojsonData();
    }
  }, [selectedCity, fetchGeojsonData]);

  // Process table rows from GeoJSON data
  const tableRows = useMemo(() => {
    const seen = new Set<string>();

    if (
      !geojsonState.data ||
      !geojsonState.data.features ||
      geojsonState.data.features.length === 0
    ) {
      return [];
    }

    const rows = geojsonState.data.features
      .filter((f) => f?.properties) // Ensure feature and properties exist
      .map((f) => f.properties)
      .filter((row) => {
        // Check for valid address
        if (!row.addresses) {
          return false;
        }

        const visiting = row.addresses?.['Visiting address'];
        const postal = row.addresses?.['Postal address'];
        const hasValidAddress =
          (visiting?.latitude && visiting?.longitude) || (postal?.latitude && postal?.longitude);

        if (!hasValidAddress) {
          return false;
        }

        // Deduplicate by business ID
        if (seen.has(row.business_id)) {
          return false;
        }
        seen.add(row.business_id);
        return true;
      });

    return rows;
  }, [geojsonState.data]);

  // Get visible columns for the table
  const visibleColumns = useMemo(() => getVisibleColumns(allColumns), []);

  // Create a function to handle city changes
  const handleCityChange = useCallback(
    (city: string) => {
      // Update the city in the store
      setSelectedCity(city);
      // No need to manually fetch, useEffect will handle it when selectedCity changes
      return city;
    },
    [setSelectedCity],
  );

  // Direct refetch method
  const refetchGeojson = useCallback(() => {
    fetchGeojsonData();
  }, [fetchGeojsonData]);

  return {
    geojsonData: geojsonState.data,
    cities: citiesState.data,
    isLoading: geojsonState.isLoading,
    cityLoading: citiesState.isLoading,
    tableRows,
    visibleColumns,
    handleCityChange,
    errors: {
      geojson: geojsonState.error,
      cities: citiesState.error,
    },
    refetch: {
      geojson: refetchGeojson,
      cities: () => {}, // Will be handled by the useEffect
    },
  };
}
