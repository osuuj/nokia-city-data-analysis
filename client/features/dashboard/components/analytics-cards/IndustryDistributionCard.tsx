'use client';

import { Select, SelectItem } from '@heroui/react';
import { useMemo } from 'react';
import type React from 'react';
import { IndustryDistribution } from '../analytics-charts/IndustryDistribution';
import type { TransformedDistribution } from '../analytics-utils/types';
import { BaseCard } from '../shared/BaseCard';

interface IndustryDistributionCardProps {
  data: TransformedDistribution[];
  currentTheme: 'light' | 'dark' | undefined;
  getIndustryKeyFromName: (name: string) => string | undefined;
  potentialOthers: string[];
  industryNameMap: Map<string, string>;
  getThemedIndustryColor: (name: string) => string;
  selectedCities: string[];
  pieChartFocusCity: string | null;
  onPieFocusChange: (city: string | null) => void;
  isLoading: boolean;
  error: Error | null;
  selectedIndustryDisplayNames: Set<string>;
}

export const IndustryDistributionCard: React.FC<IndustryDistributionCardProps> = ({
  data,
  currentTheme,
  getIndustryKeyFromName,
  potentialOthers,
  industryNameMap,
  getThemedIndustryColor,
  selectedCities,
  pieChartFocusCity,
  onPieFocusChange,
  isLoading,
  error,
  selectedIndustryDisplayNames,
}) => {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.industry,
      value: item.count,
    }));
  }, [data]);

  const citySelector = selectedCities.length > 1 && (
    <Select
      label="Focus City"
      placeholder="Select city"
      size="sm"
      className="w-full sm:w-auto sm:max-w-xs sm:min-w-[250px]"
      selectedKeys={pieChartFocusCity ? [pieChartFocusCity] : []}
      onSelectionChange={(keys) =>
        onPieFocusChange(keys instanceof Set ? (Array.from(keys)[0] as string) : null)
      }
      popoverProps={{
        className: 'min-w-[200px]',
      }}
    >
      {selectedCities.map((city) => (
        <SelectItem key={city}>{city}</SelectItem>
      ))}
    </Select>
  );

  let emptyMessage = 'No data available.';
  if (selectedCities.length > 1 && !pieChartFocusCity) {
    emptyMessage = 'Select a city from the dropdown above.';
  } else if (selectedCities.length > 0 && selectedIndustryDisplayNames.size === 0) {
    emptyMessage = 'Select industries to view distribution.';
  } else if (selectedCities.length === 0) {
    emptyMessage = 'Select a city first.';
  }

  return (
    <BaseCard
      title="Industry Distribution"
      headerContent={citySelector}
      isLoading={isLoading}
      error={error}
      emptyMessage={emptyMessage}
    >
      {selectedIndustryDisplayNames.size > 0 && (
        <IndustryDistribution
          data={chartData}
          currentTheme={currentTheme}
          getIndustryKeyFromName={getIndustryKeyFromName}
          potentialOthers={potentialOthers}
          industryNameMap={industryNameMap}
          getThemedIndustryColor={getThemedIndustryColor}
        />
      )}
    </BaseCard>
  );
};
