import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Icon } from '@iconify/react';
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
  const [selectionMade, setSelectionMade] = useState(false);

  // Create a debounced version of onSearchChange
  const debouncedSearchChange = useMemo(() => {
    // Create a function with the correct signature for debounce
    const debouncedFn = debounce((value: unknown) => {
      if (typeof value === 'string') {
        // Only update search term, but don't propagate to company search
        // onSearchChange(value);
      }
    }, 300);

    // Return a wrapper that accepts string and passes it to the debounced function
    return (term: string) => debouncedFn(term);
  }, []);

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

  // Handle local search term changes
  const handleLocalSearchChange = useCallback(
    (term: string) => {
      setLocalSearchTerm(term);
      setSelectionMade(false);
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
        setSelectionMade(true);
        onCityChange(key);
        router.replace(`/dashboard?city=${encodeURIComponent(key)}`);
        console.log('Selected city:', key);
      }
    },
    [onCityChange, router],
  );

  // Handle keydown to properly process Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && localSearchTerm) {
        e.preventDefault(); // Prevent default form submission

        // Find the first matching city
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
      }
    },
    [filteredCities, localSearchTerm, onCityChange, router],
  );

  // Handle clear button click
  const handleClear = useCallback(() => {
    // Clear the selected city
    onCityChange('');
    // Reset the search term
    setLocalSearchTerm('');
    // Reset selection state
    setSelectionMade(false);
    // Update URL to remove city parameter
    router.replace('/dashboard');
  }, [onCityChange, router]);

  // Memoize the render item function
  const renderItem = useCallback(
    (item: { name: string }) => (
      <AutocompleteItem key={item.name} textValue={item.name}>
        <div className="flex items-center gap-2">
          <Icon icon="lucide:map-pin" className="text-primary-500" width={16} />
          <span>{item.name}</span>
        </div>
      </AutocompleteItem>
    ),
    [],
  );

  // Memoize the class names
  const classNames = useMemo(
    () => ({
      base: 'md:max-w-xs max-w-[30vw] min-w-[200px]',
      listbox: 'max-h-[300px]',
      listboxWrapper: '',
      popoverContent: 'max-w-[40vw] md:max-w-xs',
      endContentWrapper: '',
      clearButton: 'text-default-400 hover:text-default-600',
      selectorButton: '',
      label: 'text-primary-500 font-medium',
      mainWrapper: 'bg-content2 bg-opacity-20 rounded-lg p-2 hover:bg-opacity-30 transition-all',
      inputWrapper: 'border-b-2 border-primary-300',
    }),
    [],
  );

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
    <div className="flex flex-col">
      <Autocomplete
        classNames={classNames}
        items={filteredCities}
        label="Search by city"
        labelPlacement="outside"
        placeholder="Type to search..."
        variant="bordered"
        selectedKey={selectedCity}
        inputValue={localSearchTerm}
        onInputChange={handleLocalSearchChange}
        onSelectionChange={handleSelectionChange}
        onKeyDown={handleKeyDown}
        onClear={handleClear}
        isClearable={true}
        isLoading={isLoading}
        startContent={<Icon icon="lucide:search" className="text-default-400" width={16} />}
      >
        {renderItem}
      </Autocomplete>
      {selectionIndicator}
    </div>
  );
});
