import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface CitySearchProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  isLoading: boolean;
}

/**
 * CitySearch component for searching and selecting cities
 * Extracted from the dashboard page for better separation of concerns
 */
export function CitySearch({ cities, selectedCity, onCityChange, isLoading }: CitySearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    return cities
      .filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((city) => ({ name: city }));
  }, [cities, searchQuery]);

  return (
    <Autocomplete
      classNames={{ base: 'md:max-w-xs max-w-[30vw] min-w-[200px]' }}
      popoverProps={{ classNames: { content: 'max-w-[40vw] md:max-w-xs' } }}
      items={filteredCities}
      label="Search by city"
      variant="underlined"
      selectedKey={selectedCity}
      onInputChange={setSearchQuery}
      onSelectionChange={(selected) => {
        if (typeof selected === 'string') {
          onCityChange(selected);
          router.replace(`/dashboard?city=${encodeURIComponent(selected)}`);
        }
      }}
      isLoading={isLoading}
    >
      {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
    </Autocomplete>
  );
}
