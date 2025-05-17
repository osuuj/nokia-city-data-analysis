'use client';

import {
  AutocompleteItem,
  type AutocompleteProps,
  Autocomplete as HeroUIAutocomplete,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useCallback, useMemo, type ReactNode } from 'react';

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
  activeIndex?: number;
  highlightedCity?: string | null;
}

// Maximum number of items to render in the autocomplete dropdown
const MAX_RENDERED_ITEMS = 50;

/**
 * Enhanced City Autocomplete component
 * Extracted from CitySearch for better separation of concerns
 * Now with improved accessibility and keyboard navigation
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
  activeIndex = -1,
  highlightedCity,
  ...props
}: CityAutocompleteProps) {
  // Limit the number of displayed results to improve performance
  const limitedCities = useMemo(() => {
    return cities.slice(0, MAX_RENDERED_ITEMS);
  }, [cities]);

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
            title="Clear selection"
            type="button"
          >
            <Icon icon="lucide:x" width={16} />
            <span className="sr-only">Clear</span>
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
      item: (active: boolean) =>
        active ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' : '',
    }),
    [],
  );

  // ARIA attributes for better accessibility
  const ariaProps = {
    'aria-expanded': cities.length > 0,
    'aria-autocomplete': 'list' as const,
    'aria-controls': 'city-autocomplete-listbox',
    'aria-activedescendant': highlightedCity ? `city-option-${highlightedCity}` : undefined,
    role: 'combobox',
  };

  // Status message for screen readers
  const statusMessage = useMemo(() => {
    if (isLoading) {
      return 'Loading cities...';
    }
    if (cities.length === 0 && localSearchTerm) {
      return 'No cities found matching your search.';
    }
    if (cities.length > 0) {
      const displayCount = Math.min(cities.length, MAX_RENDERED_ITEMS);
      const hasMore = cities.length > MAX_RENDERED_ITEMS;
      return `${cities.length} cities found${hasMore ? `, showing first ${displayCount}` : ''}. Use up and down arrow keys to navigate.`;
    }
    return '';
  }, [cities.length, isLoading, localSearchTerm]);

  // Render function for items
  const renderItem = useCallback(
    (item: CityItem) => {
      const isHighlighted = item.name === highlightedCity;
      return (
        <AutocompleteItem
          key={item.name}
          textValue={item.name}
          id={`city-option-${item.name}`}
          aria-selected={item.name === selectedCity}
          className={
            isHighlighted
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
              : ''
          }
        >
          <div className="flex items-center gap-2">
            <Icon icon="lucide:map-pin" className="text-primary-500" width={16} />
            <span className="text-foreground">{item.name}</span>
          </div>
        </AutocompleteItem>
      );
    },
    [highlightedCity, selectedCity],
  );

  return (
    <div className="flex flex-col">
      {/* Status message for screen readers */}
      <div aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      {/* @ts-ignore - Type definitions in HeroUIAutocomplete are not fully compatible with our usage */}
      <HeroUIAutocomplete<CityItem>
        classNames={classNames}
        items={limitedCities}
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
        aria-label="Search cities"
        {...ariaProps}
        {...props}
      >
        {renderItem}
      </HeroUIAutocomplete>
      {showSelectionIndicator && selectionIndicator}
    </div>
  );
});
