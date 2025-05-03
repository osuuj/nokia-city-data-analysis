'use client';

import { BaseCard } from '@/features/dashboard/components/shared/BaseCard';
import type { TransformedIndustriesByCity } from '@/features/dashboard/types/analytics';
import type React from 'react';
import { useMemo } from 'react';
import { CityIndustryBars } from '../charts/CityIndustryBars';

/**
 * Interface for the data format expected by CityIndustryBars
 */
interface CityIndustryBarsData {
  city: string;
  [key: string]: string | number;
}

/**
 * Props for the IndustriesByCityCard component
 */
interface IndustriesByCityCardProps {
  /** The data to be displayed in the chart */
  data: TransformedIndustriesByCity[];
  /** Current theme of the application */
  currentTheme: 'light' | 'dark' | undefined;
  /** Whether the data is currently loading */
  isLoading: boolean;
  /** Error object if there's an error */
  error?: Error | null;
  /** Selected industry display names */
  selectedIndustryDisplayNames: Set<string>;
  /** Function to get industry key from display name */
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  /** List of potential "other" industries */
  potentialOthers: string[];
  /** Function to get themed industry color */
  getThemedIndustryColor: (name: string, theme?: 'light' | 'dark') => string;
  /** Whether multiple cities can be fetched */
  canFetchMultiCity: boolean;
}

/**
 * Card component that displays industries distribution by city
 *
 * Features:
 * - Bar chart visualization of industries across different cities
 * - Responsive layout
 * - Themed colors based on current application theme
 * - Loading and error states
 */
export const IndustriesByCityCard: React.FC<IndustriesByCityCardProps> = ({
  data,
  currentTheme,
  isLoading,
  error,
  selectedIndustryDisplayNames,
  getIndustryKeyFromName,
  potentialOthers,
  getThemedIndustryColor,
  canFetchMultiCity,
}) => {
  // Transform data for the chart component
  const chartData = useMemo<CityIndustryBarsData[]>(() => {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
      // Start with city property
      const result: CityIndustryBarsData = {
        city: item.city,
      };

      // Add all properties that are in the selectedIndustryDisplayNames
      const entries = Object.entries(item);
      for (const [key, value] of entries) {
        if (key !== 'city' && selectedIndustryDisplayNames.has(key)) {
          result[key] = value;
        }
      }

      return result;
    });
  }, [data, selectedIndustryDisplayNames]);

  return (
    <BaseCard
      title="Industries by City"
      isLoading={isLoading}
      error={error}
      emptyMessage={
        selectedIndustryDisplayNames.size === 0
          ? 'Select industries to view data.'
          : 'No industries data available for selected cities.'
      }
    >
      {selectedIndustryDisplayNames.size > 0 && chartData.length > 0 && (
        <CityIndustryBars
          data={chartData}
          currentTheme={currentTheme}
          getIndustryKeyFromName={getIndustryKeyFromName}
          potentialOthers={potentialOthers}
          getThemedIndustryColor={getThemedIndustryColor}
          selectedIndustryDisplayNames={selectedIndustryDisplayNames}
          canFetchMultiCity={canFetchMultiCity}
        />
      )}
    </BaseCard>
  );
};
