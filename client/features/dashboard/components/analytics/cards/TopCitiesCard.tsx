'use client';

import type { TopCityData } from '@/features/dashboard/hooks/analytics/useAnalytics';
import type React from 'react';
import { BaseCard } from '../../shared/BaseCard';
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
  return (
    <BaseCard
      title="Top Cities by Active Company Count"
      isLoading={isLoading}
      error={error}
      emptyMessage="Could not load top cities data."
    >
      {data && data.length > 0 && <TopCitiesChart data={data} currentTheme={currentTheme} />}
    </BaseCard>
  );
};
