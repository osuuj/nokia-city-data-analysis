'use client';

import type React from 'react';
import { useMemo } from 'react';
import { CityComparison } from '../analytics-charts/CityComparison';
import type { ChartDataItem } from '../analytics-charts/CityComparison';
import type { TransformedCityComparison } from '../analytics-utils/types';
import { BaseCard } from '../shared/BaseCard';

/**
 * Props for the CityComparisonCard component
 */
interface CityComparisonCardProps {
  /** The transformed data to be displayed in the chart */
  data: TransformedCityComparison[];
  /** Current theme of the application */
  currentTheme: 'light' | 'dark' | undefined;
  /** Whether the data is currently loading */
  isLoading: boolean;
  /** Error object if there's an error */
  error: Error | null;
  /** Set of selected industry display names */
  selectedIndustryDisplayNames: Set<string>;
  /** Whether multiple cities can be fetched */
  canFetchMultiCity: boolean;
}

export const CityComparisonCard: React.FC<CityComparisonCardProps> = ({
  data,
  currentTheme,
  isLoading,
  error,
  selectedIndustryDisplayNames,
  canFetchMultiCity,
}) => {
  const chartData = useMemo(() => {
    return data.map((item) => {
      const result: ChartDataItem = {
        industry: item.industry,
      };
      // Add each city's count as a property
      for (const city of item.cities) {
        result[city.name] = city.count;
      }
      return result;
    });
  }, [data]);

  if (!canFetchMultiCity) return null;

  return (
    <BaseCard
      title="City Comparison"
      isLoading={isLoading}
      error={error}
      emptyMessage={
        selectedIndustryDisplayNames.size === 0
          ? 'Select industries to view comparison.'
          : 'No comparison data available.'
      }
    >
      {selectedIndustryDisplayNames.size > 0 && data.length > 0 && (
        <CityComparison data={chartData} currentTheme={currentTheme} />
      )}
    </BaseCard>
  );
};
