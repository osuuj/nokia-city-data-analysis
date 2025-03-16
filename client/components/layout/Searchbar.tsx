'use client';

import { useCompanyStore } from '@/app/state/useCompanyStore';
import { useFetchCities } from '@/components/hooks/useFetchData';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

// ✅ Define the expected type for Autocomplete items
interface CityOption {
  name: string;
}

export default function SearchBar({ basePath = '/' }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Zustand state for selected city & available cities
  const { selectedCity, setSelectedCity, availableCities } = useCompanyStore();
  
  // ✅ Fetch cities if not already loaded
  useFetchCities();

  // ✅ Convert `string[]` → `{ name: string }[]`
  const cityOptions: CityOption[] = availableCities.map((city) => ({ name: city }));

  // ✅ Track search input for filtering cities
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Filter cities dynamically based on input
  const filteredCities = cityOptions.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <Autocomplete
          className="max-w-xs"
          items={filteredCities} // ✅ Filters cities dynamically
          label="Search City"
          variant="underlined"
          selectedKey={selectedCity || undefined}
          isDisabled={availableCities.length === 0}
          onInputChange={(input) => setSearchQuery(input)} // ✅ Enables typing & filtering
          onSelectionChange={(selected) => {
            if (typeof selected === 'string') {
              console.log('✅ Selected city:', selected);
              setSelectedCity(selected);

              // ✅ Preserve other URL parameters
              const params = new URLSearchParams(searchParams);
              params.set('city', selected);

              router.replace(`${basePath}?${params.toString()}`);
              console.log('✅ Updated URL:', window.location.href);
            } else {
              console.warn('⚠ Unexpected non-string value selected:', selected);
            }
          }}
        >
          {(item: CityOption) => (
            <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
    </div>
  );
}