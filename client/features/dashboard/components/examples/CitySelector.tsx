'use client';

import { useCities } from '@/shared/hooks/data/useData';
import { useState } from 'react';

interface CitySelectorProps {
  onCityChange: (city: string | null) => void;
}

/**
 * Example component that uses React Query for data fetching
 */
export default function CitySelector({ onCityChange }: CitySelectorProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Use our custom React Query hook to fetch cities
  const { data: cities = [], isLoading, error } = useCities();

  // Handle city selection
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value === '' ? null : event.target.value;
    setSelectedCity(city);
    onCityChange(city);
  };

  if (isLoading) {
    return <div className="p-4 bg-gray-100 rounded-md">Loading cities...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        Error loading cities: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select a city:
      </label>
      <select
        id="city-select"
        value={selectedCity || ''}
        onChange={handleCityChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="">Select a city</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
}
