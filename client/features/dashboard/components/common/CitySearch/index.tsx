'use client';

import { CityAutocomplete } from '@/features/dashboard/components/common/CitySearch/Autocomplete';
import { useCitySearch } from '@/features/dashboard/hooks/useCitySearch';
import { Icon } from '@iconify/react';
import React, { useMemo } from 'react';

interface CitySearchProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

/**
 * CitySearch component for searching and selecting cities
 * Uses the useCitySearch hook for logic separation
 */
export const CitySearch = React.memo(function CitySearch({
  cities,
  selectedCity,
  onCityChange,
  isLoading,
  searchTerm,
  onSearchChange,
}: CitySearchProps) {
  const {
    localSearchTerm,
    filteredCities,
    selectionMade,
    handleSelectionChange,
    handleKeyDown,
    handleClear,
    handleLocalSearchChange,
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
        <div className="flex items-center text-xs text-success-500 mt-1">
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
    />
  );
});
