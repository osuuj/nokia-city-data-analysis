'use client';

import { Card, CardBody, CardHeader, Divider, Spinner } from '@heroui/react';
import { useMemo } from 'react';
import type React from 'react';
import { CityComparison } from '../charts/CityComparison';
import type { ChartDataItem } from '../charts/CityComparison';
import type { TransformedCityComparison } from '../utils/types';

interface CityComparisonCardProps {
  data: TransformedCityComparison[];
  currentTheme: 'light' | 'dark' | undefined;
  isLoading: boolean;
}

export const CityComparisonCard: React.FC<CityComparisonCardProps> = ({
  data,
  currentTheme,
  isLoading,
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

  return (
    <Card className="border border-default-200">
      <CardHeader className="flex justify-between items-center px-3 sm:px-6">
        <h2 className="text-lg font-bold">City Comparison</h2>
      </CardHeader>
      <Divider className="my-1 sm:my-2" />
      <CardBody className="px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
          <CityComparison data={chartData} currentTheme={currentTheme} />
        ) : (
          <p className="text-center text-default-500">No city comparison data available.</p>
        )}
      </CardBody>
    </Card>
  );
};
