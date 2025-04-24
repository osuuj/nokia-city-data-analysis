'use client';

import { Card, CardBody, CardHeader, Divider, Spinner } from '@heroui/react';
import type React from 'react';
import { CityIndustryBars } from '../charts';
import type { TransformedIndustriesByCity } from '../types';

interface IndustriesByCityCardProps {
  data: TransformedIndustriesByCity[];
  currentTheme: 'light' | 'dark' | undefined;
  getIndustryKeyFromName: (name: string) => string | undefined;
  potentialOthers: string[];
  getThemedIndustryColor: (name: string, theme: string | undefined) => string;
  isLoading: boolean;
  selectedIndustryDisplayNames: Set<string>;
  canFetchMultiCity: boolean;
}

export const IndustriesByCityCard: React.FC<IndustriesByCityCardProps> = ({
  data,
  currentTheme,
  getIndustryKeyFromName,
  potentialOthers,
  getThemedIndustryColor,
  isLoading,
  selectedIndustryDisplayNames,
  canFetchMultiCity,
}) => {
  if (!canFetchMultiCity) return null;

  return (
    <Card className="border border-default-200">
      <CardHeader className="flex justify-between items-center px-3 sm:px-6">
        <h2 className="text-lg font-bold">Industries by City</h2>
      </CardHeader>
      <Divider className="my-1 sm:my-2" />
      <CardBody className="px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : selectedIndustryDisplayNames.size > 0 ? (
          <CityIndustryBars
            data={data}
            currentTheme={currentTheme}
            getIndustryKeyFromName={getIndustryKeyFromName}
            potentialOthers={potentialOthers}
            getThemedIndustryColor={getThemedIndustryColor}
          />
        ) : (
          <p className="text-center text-default-500">Select industries to view details.</p>
        )}
      </CardBody>
    </Card>
  );
};
