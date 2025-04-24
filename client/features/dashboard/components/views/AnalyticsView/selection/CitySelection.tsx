'use client';

import { Autocomplete, AutocompleteItem, Button, Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';
import { useMemo } from 'react';

interface CitySelectionProps {
  cities: string[];
  selectedCities: Set<string>;
  onCityAdd: (city: string) => void;
  onCityRemove: (city: string) => void;
  onClearAll: () => void;
  isLoading: boolean;
  showMaxWarning: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CitySelection: React.FC<CitySelectionProps> = ({
  cities,
  selectedCities,
  onCityAdd,
  onCityRemove,
  onClearAll,
  isLoading,
  showMaxWarning,
  searchQuery,
  onSearchChange,
}) => {
  // Filter cities for Autocomplete based on search query
  const filteredCitiesForAutocomplete = useMemo(() => {
    return cities.map((city) => ({ key: city, label: city }));
  }, [cities]);

  // Handle adding a city from Autocomplete
  const handleCitySelectionAdd = (key: React.Key | null) => {
    if (typeof key === 'string') {
      onCityAdd(key);
      onSearchChange(''); // Clear input AFTER successful addition
    } else {
      // Key is null (e.g., user cleared selection from dropdown/input)
      onSearchChange(''); // Clear input if selection is cleared
    }
  };

  return (
    <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
      <Tooltip content="Select up to 5 cities to compare." placement="bottom">
        <div className="w-full sm:w-auto">
          <Autocomplete
            label="Search & Add Cities"
            placeholder="Type to search..."
            className="w-full sm:max-w-xs sm:min-w-[250px]"
            isLoading={isLoading}
            items={filteredCitiesForAutocomplete}
            inputValue={searchQuery}
            onInputChange={onSearchChange}
            onSelectionChange={handleCitySelectionAdd}
            allowsCustomValue={false}
          >
            {(item: { key: string; label: string }) => (
              <AutocompleteItem key={item.key} textValue={item.label}>
                {item.label}
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
      </Tooltip>
      {selectedCities.size > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-1 w-full">
          {Array.from(selectedCities).map((city) => (
            <Chip key={city} onClose={() => onCityRemove(city)} variant="flat" size="sm">
              {city}
            </Chip>
          ))}
          <Button
            isIconOnly
            size="sm"
            variant="light"
            aria-label="Clear cities"
            onPress={onClearAll}
            className="ml-auto"
          >
            <Icon icon="lucide:x" width={16} />
          </Button>
        </div>
      )}
      {showMaxWarning && <p className="text-tiny text-danger">Max 5 cities allowed.</p>}
    </div>
  );
};
