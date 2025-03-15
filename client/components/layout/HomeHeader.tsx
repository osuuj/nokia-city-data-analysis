'use client';

import { useSearch } from '@/components/hooks/useSearch';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useState } from 'react';

export default function HomeHeader({ onOpen }: { onOpen: () => void }) {
  const { cities, router } = useSearch();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <Autocomplete
          className="max-w-xs"
          defaultItems={(cities || []).map((city) => ({ name: city }))}
          label="Search City"
          variant="underlined"
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onSelectionChange={(selected) => {
            console.log('Selected city:', selected); // Log the selected value
            if (selected) {
              console.log('Navigating to:', `/?city=${selected}`);
              router.push(`/?city=${selected}`);
              console.log('Navigation complete');
            }
          }}
        >
          {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
        </Autocomplete>
      </div>
      {!isFocused && (
        <div data-overlay-container="true" aria-hidden="true">
          {/* Overlay content */}
        </div>
      )}
    </div>
  );
}
