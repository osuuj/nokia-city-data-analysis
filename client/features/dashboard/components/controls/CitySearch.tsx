import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState, type Key } from 'react';
import { debounce } from '../../utils/debounce';

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
 * Extracted from the dashboard page for better separation of concerns
 */
export const CitySearch = React.memo(function CitySearch({
  cities,
  selectedCity,
  onCityChange,
  isLoading,
  searchTerm,
  onSearchChange,
}: CitySearchProps) {
  const router = useRouter();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Create a debounced version of onSearchChange
  const debouncedSearchChange = useMemo(
    () =>
      debounce((term: string) => {
        onSearchChange(term);
      }, 300),
    [onSearchChange],
  );

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Handle local search term changes
  const handleLocalSearchChange = useCallback(
    (term: string) => {
      setLocalSearchTerm(term);
      debouncedSearchChange(term);
    },
    [debouncedSearchChange],
  );

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    return cities
      .filter((city) => city.toLowerCase().includes(localSearchTerm.toLowerCase()))
      .map((city) => ({ name: city }));
  }, [cities, localSearchTerm]);

  // Memoize the selection change handler
  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (typeof key === 'string') {
        onCityChange(key);
        router.replace(`/dashboard?city=${encodeURIComponent(key)}`);
      }
    },
    [onCityChange, router],
  );

  // Memoize the render item function
  const renderItem = useCallback(
    (item: { name: string }) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>,
    [],
  );

  // Memoize the class names
  const classNames = useMemo(
    () => ({
      base: 'md:max-w-xs max-w-[30vw] min-w-[200px]',
      listbox: '',
      listboxWrapper: '',
      popoverContent: 'max-w-[40vw] md:max-w-xs',
      endContentWrapper: '',
      clearButton: '',
      selectorButton: '',
    }),
    [],
  );

  return (
    <Autocomplete
      classNames={classNames}
      items={filteredCities}
      label="Search by city"
      variant="underlined"
      selectedKey={selectedCity}
      inputValue={localSearchTerm}
      onInputChange={handleLocalSearchChange}
      onSelectionChange={handleSelectionChange}
      isLoading={isLoading}
    >
      {renderItem}
    </Autocomplete>
  );
});
