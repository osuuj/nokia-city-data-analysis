import type { Filter } from '@/shared/api/types';
import type {
  CityComparisonResponse,
  DistributionItemRaw,
  IndustriesByCityResponse,
  TopCityData,
} from './types';

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
