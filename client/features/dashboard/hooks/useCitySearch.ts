'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

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
  // Local state
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [selectionMade, setSelectionMade] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [highlightedCity, setHighlightedCity] = useState<string | null>(null);

  // Ensure local search term is synced with external searchTerm
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Format cities to the expected format
  const formattedCities = useMemo(() => {
    return cities.map((city) => {
      if (typeof city === 'string') {
        return { name: city };
      }
      return city;
    });
  }, [cities]);

  // Filter cities based on search term
  const filteredCities = useMemo(() => {
    if (!localSearchTerm) return formattedCities;
    return formattedCities.filter((city) =>
      city.name.toLowerCase().includes(localSearchTerm.toLowerCase()),
    );
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

  // Handle local search term change
  const handleLocalSearchChange = useCallback(
    (value: string) => {
      setLocalSearchTerm(value);
      onSearchChange(value);
      setSelectionMade(false);
      // Reset active index when search term changes
      setActiveIndex(-1);
      setHighlightedCity(null);
    },
    [onSearchChange],
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
      if (filteredCities.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = activeIndex < filteredCities.length - 1 ? activeIndex + 1 : 0;
        setActiveIndex(nextIndex);
        setHighlightedCity(filteredCities[nextIndex].name);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : filteredCities.length - 1;
        setActiveIndex(prevIndex);
        setHighlightedCity(filteredCities[prevIndex].name);
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
