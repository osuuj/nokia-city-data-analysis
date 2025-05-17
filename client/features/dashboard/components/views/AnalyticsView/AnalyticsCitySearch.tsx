'use client';

import { CityAutocomplete } from '@/features/dashboard/components/common/CitySearch/Autocomplete';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface AnalyticsCitySearchProps {
  /** Callback when a city is selected */
  onCityChange: (city: string) => void;

  /** Currently selected city (controlled component) */
  selectedCity?: string;

  /** Search query for filtering cities */
  searchQuery: string;

  /** Function to update search query */
  setSearchQuery: (query: string) => void;

  /** List of filtered cities based on search */
  filteredCities: Array<{ name: string }>;

  /** Whether data is loading */
  isLoading?: boolean;

  /** Additional class names */
  className?: string;
}

/**
 * City search component specifically for the Analytics view
 * Adapts the common CitySearch component to work with the useCitySelection hook
 */
export function AnalyticsCitySearch({
  onCityChange,
  selectedCity = '',
  searchQuery,
  setSearchQuery,
  filteredCities,
  isLoading = false,
  className = '',
}: AnalyticsCitySearchProps) {
  // Track if a selection was made to show selection indicator
  const [selectionMade, setSelectionMade] = useState(false);

  // Handle city selection
  const handleSelectionChange = (key: React.Key | null) => {
    if (key) {
      const selectedCityValue = key.toString();
      onCityChange(selectedCityValue);
      setSelectionMade(true);
    }
  };

  // Handle search term changes
  const handleSearchChange = (term: string) => {
    setSearchQuery(term);
  };

  // Handle clearing the selection
  const handleClear = () => {
    setSearchQuery('');
    onCityChange('');
    setSelectionMade(false);
  };

  // Create selection indicator for the autocomplete
  const selectionIndicator =
    selectedCity && selectionMade ? (
      <div className="flex items-center text-xs text-success-500 mt-1" aria-live="polite">
        <Icon icon="lucide:check-circle" className="mr-1" width={12} />
        <span>{selectedCity} selected</span>
      </div>
    ) : null;

  return (
    <CityAutocomplete
      cities={filteredCities}
      selectedCity={selectedCity}
      onClear={handleClear}
      isLoading={isLoading}
      localSearchTerm={searchQuery}
      onInputChange={handleSearchChange}
      onSelectionChange={handleSelectionChange}
      showSelectionIndicator={true}
      selectionIndicator={selectionIndicator}
      activeIndex={-1}
      highlightedCity={null}
      className={className}
    />
  );
}
