'use client';

import { useCityData } from '@/features/dashboard/hooks/useCityData';
import { useDashboardStore } from '@/features/dashboard/store/useDashboardStore';
import React from 'react';
import { CitySearch } from './index';

/**
 * Container component for CitySearch
 * Connects the CitySearch component with our data fetching and state management
 */
export function CitySearchContainer() {
  // Get city data from React Query
  const { data: cities = [], isLoading } = useCityData();

  // Get state and actions from dashboard store
  const selectedCity = useDashboardStore((state) => state.selectedCity);
  const citySearchTerm = useDashboardStore((state) => state.citySearchTerm);
  const setSelectedCity = useDashboardStore((state) => state.setSelectedCity);
  const setCitySearchTerm = useDashboardStore((state) => state.setCitySearchTerm);

  // Handle city change
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  // Handle search term change
  const handleSearchChange = (term: string) => {
    setCitySearchTerm(term);
  };

  return (
    <CitySearch
      cities={cities}
      selectedCity={selectedCity}
      onCityChange={handleCityChange}
      isLoading={isLoading}
      searchTerm={citySearchTerm}
      onSearchChange={handleSearchChange}
    />
  );
}
