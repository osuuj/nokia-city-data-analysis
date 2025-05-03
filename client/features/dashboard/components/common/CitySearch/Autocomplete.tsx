'use client';

import {
  AutocompleteItem,
  type AutocompleteProps,
  Autocomplete as HeroUIAutocomplete,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useMemo, type Key, type ReactNode } from 'react';

// Define the city item type
interface CityItem {
  name: string;
}

interface CityAutocompleteProps extends Omit<AutocompleteProps, 'children' | 'items'> {
  cities: CityItem[];
  selectedCity?: string;
  onClear: () => void;
  isLoading: boolean;
  localSearchTerm: string;
  showSelectionIndicator?: boolean;
  selectionIndicator?: ReactNode;
  label?: string;
  placeholder?: string;
}

/**
 * Enhanced City Autocomplete component
 * Extracted from CitySearch for better separation of concerns
 */
export const CityAutocomplete = React.memo(function CityAutocomplete({
  cities,
  selectedCity,
  onClear,
  isLoading,
  localSearchTerm,
  showSelectionIndicator = false,
  selectionIndicator,
  label = 'Search by city',
  placeholder = 'Type to search...',
  ...props
}: CityAutocompleteProps) {
  // Custom endContent to avoid nested button issue
  const endContent = useMemo(() => {
    // Only show the clear button if there's a search term or selection
    if (localSearchTerm || selectedCity) {
      return (
        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClear();
              }
            }}
            className="cursor-pointer text-default-400 hover:text-default-600 p-1"
            aria-label="Clear city selection"
            type="button"
          >
            <Icon icon="lucide:x" width={16} />
          </button>
        </div>
      );
    }
    return null;
  }, [localSearchTerm, selectedCity, onClear]);

  // Memoize the class names
  const classNames = useMemo(
    () => ({
      base: 'md:max-w-xs max-w-[30vw] min-w-[200px]',
      listbox: 'max-h-[300px]',
      listboxWrapper: '',
      popoverContent: 'max-w-[40vw] md:max-w-xs',
      endContentWrapper: 'flex gap-1',
      selectorButton: '',
      label: 'text-primary-500 font-medium',
      mainWrapper: 'bg-content2 bg-opacity-20 rounded-lg p-2 hover:bg-opacity-30 transition-all',
      inputWrapper: 'border-b-2 border-primary-300',
    }),
    [],
  );

  // Render function for items
  const renderItem = (item: CityItem) => {
    return (
      <AutocompleteItem key={item.name} textValue={item.name}>
        <div className="flex items-center gap-2">
          <Icon icon="lucide:map-pin" className="text-primary-500" width={16} />
          <span>{item.name}</span>
        </div>
      </AutocompleteItem>
    );
  };

  return (
    <div className="flex flex-col">
      <HeroUIAutocomplete<CityItem>
        classNames={classNames}
        items={cities}
        label={label}
        labelPlacement="outside"
        placeholder={placeholder}
        variant="bordered"
        selectedKey={selectedCity}
        inputValue={localSearchTerm}
        endContent={endContent}
        isLoading={isLoading}
        startContent={<Icon icon="lucide:search" className="text-default-400" width={18} />}
        isClearable={false}
        {...props}
      >
        {renderItem}
      </HeroUIAutocomplete>
      {showSelectionIndicator && selectionIndicator}
    </div>
  );
});
