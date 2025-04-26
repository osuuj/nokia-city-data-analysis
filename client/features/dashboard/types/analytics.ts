import type { ApiError, ApiResponse } from '@/shared/api/types';
import type { UseQueryOptions } from '@tanstack/react-query';

/**
 * Types for analytics data responses
 */

export interface TopCity {
  id: string;
  name: string;
  score: number;
  rank: number;
}

export interface IndustryDistribution {
  industryId: string;
  industryName: string;
  percentage: number;
  count: number;
}

export interface IndustryByCity {
  cityId: string;
  cityName: string;
  industries: {
    industryId: string;
    industryName: string;
    count: number;
  }[];
}

export interface CityComparison {
  cityId: string;
  cityName: string;
  metrics: {
    name: string;
    value: number;
  }[];
}

/**
 * Common query options type for analytics hooks
 */
export type AnalyticsQueryOptions<TData> = Omit<
  UseQueryOptions<ApiResponse<TData>, ApiError, ApiResponse<TData>>,
  'queryKey' | 'queryFn'
>;
