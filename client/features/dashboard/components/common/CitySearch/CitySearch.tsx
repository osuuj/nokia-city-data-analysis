'use client';

import { useCitySelect } from '@/shared/hooks/api/useCitySelect';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { CityAutocomplete } from './Autocomplete';

interface CitySearchProps {
  /** Callback when a city is selected */
  onCityChange: (city: string) => void;

  /** Currently selected city (controlled component) */
  selectedCity?: string;

  /** Additional class names */
  className?: string;

  /** Label for the autocomplete */
  label?: string;
}

/**
 * CitySearch component that uses our centralized data fetching
 *
 * This component uses the React Query based data hooks
 * for fetching cities from the API
 */
export function CitySearch({
  onCityChange,
  selectedCity = '',
  className = '',
  label = 'Search by city',
}: CitySearchProps) {
  const { cities, isLoading, searchTerm, setSearchTerm, setSelectedCity } =
    useCitySelect(selectedCity);

  // Sync selected city with the hook's state
  useEffect(() => {
    setSelectedCity(selectedCity);
  }, [selectedCity, setSelectedCity]);

  // Track local search term for the autocomplete component
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Track if a selection was made
  const [selectionMade, setSelectionMade] = useState(false);

  // Handle city selection
  const handleSelectionChange = (key: React.Key | null) => {
    if (key) {
      const selectedCityValue = key.toString();
      setSelectedCity(selectedCityValue);
      onCityChange(selectedCityValue);
      setSelectionMade(true);
    }
  };

  // Handle search term changes
  const handleLocalSearchChange = (term: string) => {
    setLocalSearchTerm(term);
    setSearchTerm(term);
  };

  // Handle clearing the selection
  const handleClear = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
    setSelectedCity('');
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
      cities={cities}
      selectedCity={selectedCity}
      onClear={handleClear}
      isLoading={isLoading}
      localSearchTerm={localSearchTerm}
      onInputChange={handleLocalSearchChange}
      onSelectionChange={handleSelectionChange}
      showSelectionIndicator={true}
      selectionIndicator={selectionIndicator}
      activeIndex={-1}
      highlightedCity={null}
      className={className}
      label={label}
    />
  );
}
