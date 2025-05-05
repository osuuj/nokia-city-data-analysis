'use client';

import { CityAutocomplete } from '@/features/dashboard/components/common/CitySearch/Autocomplete';
import { useCitySearch } from '@/features/dashboard/hooks/useCitySearch';
import { Icon } from '@iconify/react';
import React, { useMemo, useRef, useEffect } from 'react';

interface CitySearchProps {
  /** List of cities to display in the autocomplete */
  cities: { name: string }[] | string[];
  /** Currently selected city */
  selectedCity: string;
  /** Callback when a city is selected */
  onCityChange: (city: string) => void;
  /** Whether cities are currently loading */
  isLoading?: boolean;
  /** Current search term */
  searchTerm: string;
  /** Callback when search term changes */
  onSearchChange: (term: string) => void;
  /** Additional class names */
  className?: string;
}

/**
 * CitySearch component for searching and selecting cities
 * Uses the useCitySearch hook for logic separation
 * Enhanced with accessibility features and better keyboard navigation
 */
export const CitySearch = React.memo(function CitySearch({
  cities,
  selectedCity,
  onCityChange,
  isLoading = false,
  searchTerm,
  onSearchChange,
  className = '',
}: CitySearchProps) {
  // Track if we should process next search - helps prevent expensive processing during typing
  const shouldProcessRef = useRef(true);
  const lastSearchTimeRef = useRef(0);

  // Rate limiting for search processing
  useEffect(() => {
    const now = Date.now();
    if (now - lastSearchTimeRef.current < 150) {
      // If typing fast, don't process every keystroke
      shouldProcessRef.current = false;

      // Schedule processing after delay
      const timerId = setTimeout(() => {
        shouldProcessRef.current = true;
        lastSearchTimeRef.current = Date.now();
      }, 200);

      return () => clearTimeout(timerId);
    }

    shouldProcessRef.current = true;
    lastSearchTimeRef.current = now;
  }, []); // Remove searchTerm as it's not needed since we're using refs

  const {
    localSearchTerm,
    filteredCities,
    selectionMade,
    handleSelectionChange,
    handleKeyDown,
    handleClear,
    handleLocalSearchChange,
    activeIndex,
    highlightedCity,
  } = useCitySearch({
    cities,
    selectedCity,
    onCityChange,
    searchTerm,
    onSearchChange,
  });

  // Current selection indicator
  const selectionIndicator = useMemo(() => {
    if (selectedCity && selectionMade) {
      return (
        <div className="flex items-center text-xs text-success-500 mt-1" aria-live="polite">
          <Icon icon="lucide:check-circle" className="mr-1" width={12} />
          <span>{selectedCity} selected</span>
        </div>
      );
    }
    return null;
  }, [selectedCity, selectionMade]);

  return (
    <CityAutocomplete
      cities={filteredCities}
      selectedCity={selectedCity}
      onClear={handleClear}
      isLoading={isLoading}
      localSearchTerm={localSearchTerm}
      onInputChange={handleLocalSearchChange}
      onSelectionChange={handleSelectionChange}
      onKeyDown={handleKeyDown}
      showSelectionIndicator={true}
      selectionIndicator={selectionIndicator}
      activeIndex={activeIndex}
      highlightedCity={highlightedCity}
      className={className}
    />
  );
});

CitySearch.displayName = 'CitySearch';
