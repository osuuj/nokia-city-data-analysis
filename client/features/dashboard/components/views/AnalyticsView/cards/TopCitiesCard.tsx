'use client';

import { BaseCard } from '@/features/dashboard/components/common/BaseCard';
import type { TopCityData } from '@/features/dashboard/types/analytics';
import type React from 'react';
import { useMemo } from 'react';
import { TopCitiesChart } from '../charts';

/**
 * Props for the TopCitiesCard component
 */
interface TopCitiesCardProps {
  /** The data to be displayed in the chart */
  data: TopCityData[];
  /** Current theme of the application */
  currentTheme: 'light' | 'dark' | undefined;
  /** Whether the data is currently loading */
  isLoading: boolean;
  /** Error object if there's an error */
  error?: Error | null;
}

export const TopCitiesCard: React.FC<TopCitiesCardProps> = ({
  data,
  currentTheme,
  isLoading,
  error,
}) => {
  // Transform TopCityData to the format expected by TopCitiesChart
  const chartData = useMemo(() => {
    return data.map((item) => ({
      city: item.city,
      count: item.count,
    }));
  }, [data]);

  return (
    <BaseCard
      title="Top Cities by Active Company Count"
      isLoading={isLoading}
      error={error}
      emptyMessage="Could not load top cities data."
    >
      {data && data.length > 0 && <TopCitiesChart data={chartData} currentTheme={currentTheme} />}
    </BaseCard>
  );
};
