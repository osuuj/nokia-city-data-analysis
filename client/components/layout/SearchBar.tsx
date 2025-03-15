'use client';

import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  cities: string[]; // List of cities to show in the dropdown
  basePath?: string; // Optional: Base path to use in navigation (default: "/")
}

export default function SearchBar({ cities, basePath = '/' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Ensure selectedCity is always a string
  const [selectedCity, setSelectedCity] = useState<string>('');

  // ✅ Extract city from URL & update state when URL changes
  useEffect(() => {
    const city = searchParams.get('city') || '';
    if (city !== selectedCity) {
      setSelectedCity(city);
    }
  }, [searchParams, selectedCity]); // 🔹 FIXED: Added selectedCity to dependencies

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <Autocomplete
          className="max-w-xs"
          defaultItems={(cities || []).map((city) => ({ name: city }))}
          label="Search City"
          variant="underlined"
          selectedKey={selectedCity} // 🔹 FIXED: Ensure selectedKey is a string
          onFocus={() => console.log('🔍 SearchBar focused')}
          onSelectionChange={(selected) => {
            if (typeof selected === 'string') {
              // 🔹 FIXED: Ensure selected is a string
              console.log('✅ Selected city:', selected);
              setSelectedCity(selected);

              // ✅ Preserve other URL parameters
              const params = new URLSearchParams(searchParams);
              params.set('city', selected);

              router.replace(`${basePath}?${params.toString()}`); // ✅ Correct URL update
              console.log('✅ After navigation, new URL should be:', window.location.href);
            } else {
              console.warn('⚠ Unexpected non-string value selected:', selected);
            }
          }}
        >
          {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
        </Autocomplete>
      </div>
    </div>
  );
}
