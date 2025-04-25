'use client';

import { SelectItem } from '@heroui/react';
import type React from 'react';
import { BaseCard } from '../../shared/BaseCard';
import { CityIndustryBars } from '../charts';
import type { TransformedIndustriesByCity } from '../utils/types';

/**
 * Props for the IndustriesByCityCard component
 */
interface IndustriesByCityCardProps {
  /** The transformed data to be displayed in the chart */
  data: TransformedIndustriesByCity[];
  /** Current theme of the application */
  currentTheme: 'light' | 'dark' | undefined;
  /** Function to get the industry key from its display name */
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  /** List of potential "other" categories */
  potentialOthers: string[];
  /** Function to get the themed color for an industry */
  getThemedIndustryColor: (industry: string) => string;
  /** Whether the data is currently loading */
  isLoading: boolean;
  /** Error object if there's an error */
  error: Error | null;
  /** Set of selected industry display names */
  selectedIndustryDisplayNames: Set<string>;
  /** Whether multiple cities can be fetched */
  canFetchMultiCity: boolean;
}

export const IndustriesByCityCard: React.FC<IndustriesByCityCardProps> = ({
  data,
  currentTheme,
  getIndustryKeyFromName,
  potentialOthers,
  getThemedIndustryColor,
  isLoading,
  error,
  selectedIndustryDisplayNames,
  canFetchMultiCity,
}) => {
  if (!canFetchMultiCity) return null;

  return (
    <BaseCard
      title="Industries by City"
      isLoading={isLoading}
      error={error}
      emptyMessage="Select industries to view details."
    >
      {selectedIndustryDisplayNames.size > 0 && (
        <CityIndustryBars
          data={data}
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
