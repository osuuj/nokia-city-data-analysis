import type { DistributionItemRaw } from '@/features/dashboard/hooks/analytics/useAnalytics';

export interface TransformedDistribution {
  industry: string;
  count: number;
  percentage: number;
}

export interface TransformedIndustriesByCity {
  city: string;
  [key: string]: string | number;
}

export interface TransformedCityComparison {
  industry: string;
  cities: Array<{
    name: string;
    count: number;
  }>;
  [key: string]: string | number | Array<{ name: string; count: number }>;
}

export interface TopCityData {
  city: string;
  count: number;
  companyCount: number;
  industryCount: number;
  averageCompaniesPerIndustry: number;
}

export type DistributionDataRaw = DistributionItemRaw[];
