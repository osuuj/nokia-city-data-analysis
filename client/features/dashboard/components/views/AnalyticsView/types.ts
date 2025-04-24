import type { ApiResponse } from '@/shared/api/types';

/**
 * Raw data structure for pivoted data from the API
 */
export type PivotedData = Array<Record<string, string | number>>;

/**
 * Raw data structure for distribution items
 */
export type DistributionItemRaw = {
  name: string;
  value: number;
  others_breakdown?: Array<{ name: string; value: number }>;
};

/**
 * Raw data structure for distribution data
 */
export type DistributionDataRaw = Array<DistributionItemRaw>;

/**
 * Transformed industries by city data
 */
export interface TransformedIndustriesByCity {
  city: string;
  industries: {
    industry: string;
    count: number;
  }[];
}

/**
 * Transformed city comparison data
 */
export interface TransformedCityComparison {
  industry: string;
  cities: {
    city: string;
    count: number;
  }[];
}

/**
 * Transformed distribution data
 */
export interface TransformedDistribution {
  industry: string;
  count: number;
  percentage: number;
}

/**
 * Response type for industries by city data
 */
export type IndustriesByCityResponse = ApiResponse<TransformedIndustriesByCity[]>;

/**
 * Response type for city comparison data
 */
export type CityComparisonResponse = ApiResponse<TransformedCityComparison[]>;

/**
 * Top city data structure
 */
export interface TopCityData {
  city: string;
  companyCount: number;
  industryCount: number;
  averageCompaniesPerIndustry: number;
}
