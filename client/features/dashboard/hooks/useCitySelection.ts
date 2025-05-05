'use client';

import { useCallback, useMemo, useState } from 'react';

interface UseCitySelectionProps {
  maxCities?: number;
  allCities?: string[];
  onSelectionChange?: (cities: Set<string>) => void;
}

/**
 * Custom hook to manage city selection with our enhanced CitySearch component
 */
export function useCitySelection({
  maxCities = 5,
  allCities = [],
  onSelectionChange,
}: UseCitySelectionProps = {}) {
  // State
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [focusedCity, setFocusedCity] = useState<string | null>(null);

  // Filtered cities for search
  const filteredCities = useMemo(() => {
    return allCities
      .filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((city) => ({ name: city }));
  }, [allCities, searchQuery]);

  // Add a city
  const handleAddCity = useCallback(
    (city: string) => {
      if (!city) return;

      if (selectedCities.size >= maxCities) {
        setShowMaxWarning(true);
        setTimeout(() => setShowMaxWarning(false), 3000);
        return;
      }

      const newSelection = new Set(selectedCities);
      newSelection.add(city);
      setSelectedCities(newSelection);
      setSearchQuery('');

      // Call external handler if provided
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }
    },
    [selectedCities, maxCities, onSelectionChange],
  );

  // Remove a city
  const handleRemoveCity = useCallback(
    (city: string) => {
      const newSelection = new Set(selectedCities);
      newSelection.delete(city);
      setSelectedCities(newSelection);

      // Reset focus city if it was removed
      if (focusedCity === city) {
        setFocusedCity(null);
      }

      // Call external handler if provided
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }
    },
    [selectedCities, focusedCity, onSelectionChange],
  );

  // Clear all cities
  const handleClearAllCities = useCallback(() => {
    setSelectedCities(new Set());
    setFocusedCity(null);

    // Call external handler if provided
    if (onSelectionChange) {
      onSelectionChange(new Set());
    }
  }, [onSelectionChange]);

  // Set focus city
  const handleSetFocusCity = useCallback(
    (city: string | null) => {
      if (city === null || selectedCities.has(city)) {
        setFocusedCity(city);
      }
    },
    [selectedCities],
  );

  return {
    selectedCities,
    searchQuery,
    setSearchQuery,
    showMaxWarning,
    filteredCities,
    focusedCity,
    handleAddCity,
    handleRemoveCity,
    handleClearAllCities,
    handleSetFocusCity,
    isAtMaxCities: selectedCities.size >= maxCities,
  };
}
