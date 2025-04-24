'use client';

import { Card, CardBody, CardHeader, Divider, Select, SelectItem, Spinner } from '@heroui/react';
import type React from 'react';
import { IndustryDistribution } from '../charts';
import type { TransformedDistribution } from '../types';

interface IndustryDistributionCardProps {
  data: TransformedDistribution;
  currentTheme: 'light' | 'dark' | undefined;
  getIndustryKeyFromName: (name: string) => string | undefined;
  potentialOthers: string[];
  industryNameMap: Map<string, string>;
  getThemedIndustryColor: (name: string, theme: string | undefined) => string;
  selectedCities: Set<string>;
  pieChartFocusCity: string | null;
  onPieFocusChange: (city: string | null) => void;
  isLoading: boolean;
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
  selectedIndustryDisplayNames,
}) => {
  return (
    <Card className="border border-default-200">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-3 sm:px-6">
        <h2 className="text-lg font-bold">Industry Distribution</h2>
        {selectedCities.size > 1 && (
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
              className: 'min-w-[200px]', // Set minimum width for the dropdown popover
            }}
          >
            {Array.from(selectedCities)
              .sort()
              .map((city) => (
                <SelectItem key={city}>{city}</SelectItem>
              ))}
          </Select>
        )}
      </CardHeader>
      <Divider className="my-1 sm:my-2" />
      <CardBody className="px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : selectedIndustryDisplayNames.size > 0 ? (
          <IndustryDistribution
            data={data}
            currentTheme={currentTheme}
            getIndustryKeyFromName={getIndustryKeyFromName}
            potentialOthers={potentialOthers}
            industryNameMap={industryNameMap}
            getThemedIndustryColor={getThemedIndustryColor}
          />
        ) : selectedCities.size > 1 && !pieChartFocusCity ? (
          <p className="text-center text-default-500">Select a city from the dropdown above.</p>
        ) : selectedCities.size > 0 ? (
          <p className="text-center text-default-500">Select industries to view distribution.</p>
        ) : (
          <p className="text-center text-default-500">Select a city first.</p>
        )}
      </CardBody>
    </Card>
  );
};
