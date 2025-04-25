import type { DistributionItemRaw } from '@/features/dashboard/hooks/analytics/useAnalytics';
import type { Filter } from '@/shared/api/types';
import type { ApiResponse } from '@/shared/api/types';
import type {
  TopCityData,
  TransformedCityComparison,
  TransformedIndustriesByCity,
} from './utils/types';

// Define the response types
export interface CityComparisonResponse extends ApiResponse<TransformedCityComparison[]> {}
export interface IndustriesByCityResponse extends ApiResponse<TransformedIndustriesByCity[]> {}
export interface DistributionDataRaw extends Array<DistributionItemRaw> {}

export interface CitySelectionProps {
  cities: Filter[];
  selectedCities: string[];
  onCityChange: (cities: string[]) => void;
  maxSelections?: number;
}

export interface IndustrySelectionProps {
  industries: Filter[];
  selectedIndustries: string[];
  onIndustryChange: (industries: string[]) => void;
  maxSelections?: number;
}

export interface IndustryDistributionCardProps {
  data: DistributionItemRaw[];
  isLoading: boolean;
  error: Error | null;
}

export interface IndustriesByCityCardProps {
  data: IndustriesByCityResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedCities: string[];
  selectedIndustries: string[];
}

export interface CityComparisonCardProps {
  data: CityComparisonResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedCities: string[];
  selectedIndustries: string[];
}

export interface TopCitiesCardProps {
  data: TopCityData[];
  isLoading: boolean;
  error: Error | null;
  selectedCities: string[];
  selectedIndustries: string[];
}
