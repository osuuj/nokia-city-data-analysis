'use client';

import { useMemo, useState } from 'react';
import { useCities } from './useData';

/**
 * Hook for managing city selection using our centralized data fetching
 *
 * @returns City selection state and utilities
 *
 * @example
 * function MyCitySelector() {
 *   const {
 *     cities,
 *     isLoading,
 *     selectedCity,
 *     setSelectedCity,
 *     searchTerm,
 *     setSearchTerm
 *   } = useCitySelect();
 *
 *   return (
 *     <div>
 *       {isLoading ? 'Loading...' : `${cities.length} cities available`}
 *     </div>
 *   );
 * }
 */
export function useCitySelect(initialCity = '') {
  // Fetch cities using our new data hook
  const { data: rawCities = [], isLoading, error } = useCities();

  // Local state for selection and search
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and format cities based on search term
  const formattedCities = useMemo(() => {
    // If there's a search term, filter the cities
    const filteredCities = searchTerm
      ? rawCities.filter((city) => city.toLowerCase().includes(searchTerm.toLowerCase()))
      : rawCities;

    // Format the filtered cities for the component
    return filteredCities.map((city) => ({ name: city }));
  }, [rawCities, searchTerm]);

  return {
    cities: formattedCities,
    rawCities,
    selectedCity,
    setSelectedCity,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
  };
}
