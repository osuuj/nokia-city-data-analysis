'use client';

import type { TopCityData } from '@/features/dashboard/hooks/analytics/useAnalytics';
import { Card, CardBody, CardHeader, Divider, Spinner } from '@heroui/react';
import type React from 'react';
import { TopCitiesChart } from '../charts';

interface TopCitiesCardProps {
  data: TopCityData[];
  currentTheme: 'light' | 'dark' | undefined;
  isLoading: boolean;
}

export const TopCitiesCard: React.FC<TopCitiesCardProps> = ({ data, currentTheme, isLoading }) => {
  return (
    <Card className="border border-default-200">
      <CardHeader className="flex justify-between items-center px-3 sm:px-6">
        <h2 className="text-lg font-bold">Top Cities by Active Company Count</h2>
      </CardHeader>
      <Divider className="my-1 sm:my-2" />
      <CardBody className="px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
          <TopCitiesChart data={data} currentTheme={currentTheme} />
        ) : (
          <p className="text-center text-default-500">Could not load top cities data.</p>
        )}
      </CardBody>
    </Card>
  );
};
