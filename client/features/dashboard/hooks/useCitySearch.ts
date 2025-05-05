'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Cache for recent searches
const SEARCH_CACHE_SIZE = 20;
const searchCache = new Map<string, { name: string }[]>();

/**
 * Simple utility to create a debounced callback
 * Using a simpler typing approach to avoid TypeScript errors
 */
function useDebounce(fn: (value: string) => void, delay: number) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = useCallback(
    (value: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        fn(value);
      }, delay);
    },
    [fn, delay],
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedFn;
}

interface UseCitySearchProps {
  cities: string[] | { name: string }[];
  selectedCity?: string;
  onCityChange: (city: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

/**
 * Custom hook to manage city search behavior
 */
export function useCitySearch({
  cities,
  selectedCity,
  onCityChange,
  searchTerm,
  onSearchChange,
}: UseCitySearchProps) {
  // Local state - use empty string as default if searchTerm is undefined
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm || '');
  const [selectionMade, setSelectionMade] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [highlightedCity, setHighlightedCity] = useState<string | null>(null);

  // Ref for last filtered cities
  const lastFilteredCitiesRef = useRef<{ name: string }[]>([]);

  // Ensure local search term is synced with external searchTerm
  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  // Create debounced search handler
  const debouncedSearchChange = useDebounce(onSearchChange, 250);

  // Format cities to the expected format - only process when cities change
  const formattedCities = useMemo(() => {
    return cities.map((city) => {
      if (typeof city === 'string') {
        return { name: city };
      }
      return city;
    });
  }, [cities]);

  // Filter cities based on search term with caching
  const filteredCities = useMemo(() => {
    const searchValue = localSearchTerm || '';
    if (!searchValue) return formattedCities;

    // Check if we have a cached result
    const lowerCaseKey = searchValue.toLowerCase();

    if (searchCache.has(lowerCaseKey)) {
      // Use optional chaining and provide a default empty array
      const cachedResult = searchCache.get(lowerCaseKey) || [];
      lastFilteredCitiesRef.current = cachedResult;
      return cachedResult;
    }

    // Perform the filtering - using a more optimized string check
    const result = formattedCities.filter((city) => {
      // Fast path: direct match at start
      const cityNameLower = city.name.toLowerCase();
      if (cityNameLower === lowerCaseKey) return true;

      // Normal path: includes
      return cityNameLower.includes(lowerCaseKey);
    });

    // Cache the result
    if (searchCache.size >= SEARCH_CACHE_SIZE) {
      // Remove oldest entry if cache is full
      const firstKey = searchCache.keys().next().value;
      if (firstKey) {
        searchCache.delete(firstKey);
      }
    }
    searchCache.set(lowerCaseKey, result);

    // Update last filtered
    lastFilteredCitiesRef.current = result;
    return result;
  }, [formattedCities, localSearchTerm]);

  // Handle selection change
  const handleSelectionChange = useCallback(
    (key: string | number | null) => {
      if (typeof key === 'string') {
        onCityChange(key);
        setSelectionMade(true);
        // Reset search term after selection
        setLocalSearchTerm('');
      }
    },
    [onCityChange],
  );

  // Handle local search term change with debouncing
  const handleLocalSearchChange = useCallback(
    (value: string) => {
      setLocalSearchTerm(value);
      debouncedSearchChange(value);
      setSelectionMade(false);
      // Reset active index when search term changes
      setActiveIndex(-1);
      setHighlightedCity(null);
    },
    [debouncedSearchChange],
  );

  // Handle clear button click
  const handleClear = useCallback(() => {
    setLocalSearchTerm('');
    onSearchChange('');
    setSelectionMade(false);
    setActiveIndex(-1);
    setHighlightedCity(null);
  }, [onSearchChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentFiltered =
        lastFilteredCitiesRef.current.length > 0 ? lastFilteredCitiesRef.current : filteredCities;

      if (currentFiltered.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = activeIndex < currentFiltered.length - 1 ? activeIndex + 1 : 0;
        setActiveIndex(nextIndex);
        // Use optional chaining and provide a default null value
        const nextCity = currentFiltered[nextIndex];
        setHighlightedCity(nextCity ? nextCity.name : null);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : currentFiltered.length - 1;
        setActiveIndex(prevIndex);
        // Use optional chaining and provide a default null value
        const prevCity = currentFiltered[prevIndex];
        setHighlightedCity(prevCity ? prevCity.name : null);
      } else if (e.key === 'Enter' && highlightedCity) {
        e.preventDefault();
        onCityChange(highlightedCity);
        setSelectionMade(true);
        setLocalSearchTerm('');
        onSearchChange('');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    },
    [activeIndex, filteredCities, highlightedCity, handleClear, onCityChange, onSearchChange],
  );

  return {
    localSearchTerm,
    filteredCities,
    selectionMade,
    handleSelectionChange,
    handleKeyDown,
    handleClear,
    handleLocalSearchChange,
    activeIndex,
    highlightedCity,
  };
}
