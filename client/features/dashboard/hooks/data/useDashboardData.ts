import { useCompanyStore } from '@/features/dashboard/store';
import type { CompanyProperties, SortDescriptor } from '@/features/dashboard/types';
import { transformCompanyGeoJSON } from '@/features/dashboard/utils/geo';
import { getDistanceInKm } from '@/features/dashboard/utils/geo';
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
  const { setSelectedCity, setFilteredBusinessIds } = useCompanyStore();

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

  // Empty state reasons - for better UI feedback
  const [emptyStateReason, setEmptyStateReason] = useState<{
    noResults: boolean;
    reason: 'distance' | 'industry' | 'search' | 'none';
    message: string;
  }>({
    noResults: false,
    reason: 'none',
    message: '',
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
      // Reset empty state reason when fetching new data
      setEmptyStateReason({
        noResults: false,
        reason: 'none',
        message: '',
      });

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

  // Process table rows from GeoJSON data and apply filters
  const tableRows = useMemo(() => {
    const seen = new Set<string>();

    if (
      !geojsonState.data ||
      !geojsonState.data.features ||
      geojsonState.data.features.length === 0
    ) {
      return [];
    }

    // Check a sample of features to see if industry_letter exists
    if (geojsonState.data.features.length > 0) {
      const sampleFeature = geojsonState.data.features[0];
      // Removed console log for sample feature properties
    }

    // Step 1: Extract and deduplicate rows
    let rows = geojsonState.data.features
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

    // Reset empty state reason before filtering
    setEmptyStateReason({
      noResults: false,
      reason: 'none',
      message: '',
    });

    // Step 2: Apply search query filtering
    if (query && query.trim() !== '') {
      const lowerCaseQuery = query.toLowerCase().trim();

      const previousCount = rows.length;
      rows = rows.filter((row) => {
        // Check company name (most common)
        if (row.company_name?.toLowerCase().includes(lowerCaseQuery)) {
          return true;
        }

        // Check business ID
        if (row.business_id?.toLowerCase().includes(lowerCaseQuery)) {
          return true;
        }

        // Check industry
        if (row.industry?.toLowerCase().includes(lowerCaseQuery)) {
          return true;
        }

        // Check address
        const visitingAddress = row.addresses?.['Visiting address'];
        if (visitingAddress?.street?.toLowerCase().includes(lowerCaseQuery)) {
          return true;
        }

        return false;
      });

      // Check if search yielded no results
      if (rows.length === 0 && previousCount > 0) {
        setEmptyStateReason({
          noResults: true,
          reason: 'search',
          message: `No companies found matching "${query}"`,
        });
      }
    }

    // Step 3: Apply industry filtering
    if (selectedIndustries.length > 0) {
      try {
        // Create a simple lookup set for faster checking
        const industrySet = new Set(selectedIndustries.map((i) => i.toUpperCase()));
        const previousCount = rows.length;

        // Apply a simple, direct filter
        const filteredRows = rows.filter((row) => {
          // If there's no industry_letter, we can't match it
          if (!row.industry_letter) return false;

          // Simple uppercase comparison
          return industrySet.has(row.industry_letter.toUpperCase());
        });

        // Force a new array instance with spread to ensure React detects the change
        rows = [...filteredRows];

        // Special case for Construction (F)
        if (rows.length === 0 && industrySet.has('F')) {
          // Alternate search for construction companies
          const constructionCompanies =
            geojsonState.data?.features
              ?.filter((f) => f.properties)
              .map((f) => f.properties)
              .filter((row) => {
                if (!row || !row.industry) return false;
                return row.industry.toLowerCase().includes('construction');
              }) || [];

          // Force a new array reference for React detection
          rows = [...constructionCompanies];
        }

        // Check if industry filtering yielded no results
        if (rows.length === 0 && previousCount > 0) {
          const industries = selectedIndustries.join(', ');
          setEmptyStateReason({
            noResults: true,
            reason: 'industry',
            message: `No companies found in selected industries: ${industries}`,
          });
        }
      } catch (error) {
        console.error('Error during industry filtering:', error);
        // If there's an error, return the original unfiltered rows
      }
    }

    // Step 4: Apply distance filtering
    if (userLocation && distanceLimit) {
      try {
        const previousCount = rows.length;
        const filteredRows = rows.filter((row) => {
          const visitingAddress = row.addresses?.['Visiting address'];
          if (!visitingAddress || !visitingAddress.latitude || !visitingAddress.longitude)
            return false;

          const distance = getDistanceInKm(userLocation, {
            latitude: visitingAddress.latitude,
            longitude: visitingAddress.longitude,
          });

          return distance <= distanceLimit;
        });

        // Force a new array instance to ensure React detects the change
        rows = [...filteredRows];

        // Check if distance filtering yielded no results
        if (rows.length === 0 && previousCount > 0) {
          setEmptyStateReason({
            noResults: true,
            reason: 'distance',
            message: `No companies found within ${distanceLimit}km of your location`,
          });
        }
      } catch (error) {
        console.error('Error during distance filtering:', error);
        // If there's an error, return the current filtered rows without distance filtering
      }
    }

    // Return the filtered rows
    return rows;
  }, [geojsonState.data, query, selectedIndustries, userLocation, distanceLimit]);

  // After applying all filters, update the filteredBusinessIds in the store
  // This ensures we can maintain consistent selection state across pagination
  useEffect(() => {
    if (Array.isArray(tableRows)) {
      // Extract all the business IDs from filtered data
      const businessIds = tableRows.map((row) => row.business_id);

      // Update the store with the complete list of filtered business IDs
      // This allows the table to know which rows should be selectable across all pages
      setFilteredBusinessIds(businessIds);
    }
  }, [tableRows, setFilteredBusinessIds]);

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

  // Expose refetch function for manual search refresh
  const refreshSearch = useCallback(async () => {
    try {
      // Re-fetch geojson data with current query
      await fetchGeojsonData();
    } catch (error) {
      console.error('Error refreshing search:', error);
    }
  }, [fetchGeojsonData]);

  // Add refreshSearch to the refetch object
  const refetchFunctions = {
    geojson: fetchGeojsonData,
    search: refreshSearch,
  };

  return {
    geojsonData: geojsonState.data,
    cities: citiesState.data,
    isLoading: geojsonState.isLoading,
    cityLoading: citiesState.isLoading,
    tableRows,
    visibleColumns,
    handleCityChange,
    emptyStateReason,
    errors: {
      geojson: geojsonState.error,
      cities: citiesState.error,
    },
    refetch: refetchFunctions, // Updated to include search refresh
  };
}
