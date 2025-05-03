'use client';

import { debounce } from '@/features/dashboard/utils/debounce';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Key } from 'react';

interface UseCitySearchProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  searchTerm: string;
  onSearchChange?: (term: string) => void;
}

interface UseCitySearchResult {
  localSearchTerm: string;
  setLocalSearchTerm: (term: string) => void;
  filteredCities: Array<{ name: string }>;
  selectionMade: boolean;
  handleSelectionChange: (key: Key | null) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleClear: () => void;
  handleLocalSearchChange: (term: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  highlightedCity: string | null;
}

/**
 * Custom hook for city search functionality
 * Extracts the logic from CitySearch component for better reusability
 * Enhanced with improved keyboard navigation
 */
export function useCitySearch({
  cities,
  selectedCity,
  onCityChange,
  searchTerm,
  onSearchChange,
}: UseCitySearchProps): UseCitySearchResult {
  const router = useRouter();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [selectionMade, setSelectionMade] = useState(false);
  // Add state for keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1);
  const [highlightedCity, setHighlightedCity] = useState<string | null>(null);
  // Reference to track if popover is open
  const popoverOpenRef = useRef(false);

  // Create a debounced version of onSearchChange
  const debouncedSearchChange = useMemo(() => {
    // Create a function with the correct signature for debounce
    const debouncedFn = debounce((value: unknown) => {
      if (typeof value === 'string' && onSearchChange) {
        onSearchChange(value);
      }
    }, 300);

    // Return a wrapper that accepts string and passes it to the debounced function
    return (term: string) => debouncedFn(term);
  }, [onSearchChange]);

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Reset selection indicator when city changes
  useEffect(() => {
    if (selectedCity) {
      setSelectionMade(true);
    }
  }, [selectedCity]);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    return cities
      .filter((city) => city.toLowerCase().includes(localSearchTerm.toLowerCase()))
      .map((city) => ({ name: city }));
  }, [cities, localSearchTerm]);

  // Update highlighted city when active index changes
  useEffect(() => {
    if (activeIndex >= 0 && activeIndex < filteredCities.length) {
      setHighlightedCity(filteredCities[activeIndex].name);
    } else {
      setHighlightedCity(null);
    }
  }, [activeIndex, filteredCities]);

  // Reset active index when filtered cities change
  useEffect(() => {
    setActiveIndex(-1);
  }, []);

  // Handle local search term changes
  const handleLocalSearchChange = useCallback(
    (term: string) => {
      setLocalSearchTerm(term);
      setSelectionMade(false);
      debouncedSearchChange(term);
      // When typing, assume popover is open
      popoverOpenRef.current = true;
    },
    [debouncedSearchChange],
  );

  // Selection change handler
  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (typeof key === 'string') {
        setSelectionMade(true);
        onCityChange(key);
        router.replace(`/dashboard?city=${encodeURIComponent(key)}`);
        // Reset active index after selection
        setActiveIndex(-1);
        popoverOpenRef.current = false;
      }
    },
    [onCityChange, router],
  );

  // Handle keydown to properly process Enter key and arrow keys
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Only process keyboard navigation when popover is open
      if (!popoverOpenRef.current && e.key !== 'Enter') return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault(); // Prevent page scrolling
          setActiveIndex((prevIndex) => {
            // If we're at the end, loop to the beginning
            if (prevIndex >= filteredCities.length - 1) {
              return 0;
            }
            // Otherwise, move to the next item
            return prevIndex + 1;
          });
          popoverOpenRef.current = true;
          break;

        case 'ArrowUp':
          e.preventDefault(); // Prevent page scrolling
          setActiveIndex((prevIndex) => {
            // If we're at the beginning, loop to the end
            if (prevIndex <= 0) {
              return filteredCities.length - 1;
            }
            // Otherwise, move to the previous item
            return prevIndex - 1;
          });
          popoverOpenRef.current = true;
          break;

        case 'Enter': {
          e.preventDefault(); // Prevent default form submission

          // If we have an active item, select it
          if (activeIndex >= 0 && activeIndex < filteredCities.length) {
            const city = filteredCities[activeIndex].name;
            setSelectionMade(true);
            onCityChange(city);
            router.replace(`/dashboard?city=${encodeURIComponent(city)}`);
            setActiveIndex(-1);
            popoverOpenRef.current = false;
            return;
          }

          // Otherwise, find a matching city
          const matchingCity = filteredCities.find(
            (city) => city.name.toLowerCase() === localSearchTerm.toLowerCase(),
          );

          // If we have an exact match, select it
          if (matchingCity) {
            setSelectionMade(true);
            onCityChange(matchingCity.name);
            router.replace(`/dashboard?city=${encodeURIComponent(matchingCity.name)}`);
          } else if (filteredCities.length > 0) {
            // Or select the first match
            setSelectionMade(true);
            onCityChange(filteredCities[0].name);
            router.replace(`/dashboard?city=${encodeURIComponent(filteredCities[0].name)}`);
          }
          popoverOpenRef.current = false;
          break;
        }

        case 'Escape':
          // Close the popover
          setActiveIndex(-1);
          popoverOpenRef.current = false;
          break;

        default:
          break;
      }
    },
    [filteredCities, localSearchTerm, onCityChange, router, activeIndex],
  );

  // Handle focus event
  const handleFocus = useCallback(() => {
    popoverOpenRef.current = true;
  }, []);

  // Handle blur event
  const handleBlur = useCallback(() => {
    // Use a timeout to prevent closing when clicking an item
    setTimeout(() => {
      popoverOpenRef.current = false;
      setActiveIndex(-1);
    }, 150);
  }, []);

  // Handle clear button click
  const handleClear = useCallback(() => {
    // Clear the selected city
    onCityChange('');
    // Reset the search term
    setLocalSearchTerm('');
    // Reset selection state
    setSelectionMade(false);
    // Reset active index
    setActiveIndex(-1);
    // Update URL to remove city parameter
    router.replace('/dashboard');
    // Close popover
    popoverOpenRef.current = false;
  }, [onCityChange, router]);

  return {
    localSearchTerm,
    setLocalSearchTerm,
    filteredCities,
    selectionMade,
    handleSelectionChange,
    handleKeyDown,
    handleClear,
    handleLocalSearchChange,
    activeIndex,
    setActiveIndex,
    highlightedCity,
  };
}
