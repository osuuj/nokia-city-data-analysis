'use client';

import { useMemo, useState } from 'react';
import { CityComparison } from '../analytics/charts/CityComparison';
import type { TransformedCityComparison } from '../analytics/utils/types';
import { BaseCard } from '../shared/BaseCard';

interface ComparisonData {
  id: string;
  name: string;
  value: number;
  timestamp: string;
  // Add other properties as needed
}

interface ChartDataItem {
  industry: string;
  [cityName: string]: number | string;
}

interface CityComparisonViewProps {
  data: TransformedCityComparison[];
  currentTheme: 'light' | 'dark' | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedIndustryDisplayNames: Set<string>;
  canFetchMultiCity: boolean;
}

export const CityComparisonView: React.FC<CityComparisonViewProps> = ({
  data,
  currentTheme,
  isLoading,
  error,
  selectedIndustryDisplayNames,
  canFetchMultiCity,
}) => {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);

  const chartData = useMemo<ChartDataItem[]>(() => {
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

  const handleDataChange = (newData: ComparisonData[]) => {
    setComparisonData(newData);
  };

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
