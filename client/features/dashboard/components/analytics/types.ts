/**
 * Analytics Component Types
 *
 * This file contains all the component-specific type definitions used in the analytics feature.
 * It serves as a central location for all analytics component-related types.
 */

import type {
  ErrorWithApi,
  TopCityData,
  TransformedCityComparison,
  TransformedDistribution,
  TransformedIndustriesByCity,
} from '../../hooks/analytics/types';

/**
 * Props for the IndustryDistributionCard component
 */
export interface IndustryDistributionCardProps {
  /** The transformed distribution data to display */
  data: TransformedDistribution[];
  /** The current theme (light or dark) */
  currentTheme: 'light' | 'dark' | undefined;
  /** Function to get the industry key from its display name */
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  /** List of potential "Others" categories */
  potentialOthers: string[];
  /** Map of industry keys to display names */
  industryNameMap: Map<string, string>;
  /** Whether the data is currently loading */
  isLoading: boolean;
  /** Any error that occurred during data loading */
  error: Error | null;
  /** Set of selected industry display names */
  selectedIndustryDisplayNames: Set<string>;
  /** Function to get the themed color for an industry */
  getThemedIndustryColor: (industry: string) => string;
  /** List of selected cities */
  selectedCities: string[];
  /** The city currently focused in the pie chart */
  pieChartFocusCity: string | null;
  /** Callback when the pie chart focus changes */
  onPieFocusChange: (city: string | null) => void;
}

/**
 * Props for the IndustriesByCityCard component
 */
export interface IndustriesByCityCardProps {
  /** The transformed industries by city data to display */
  data: TransformedIndustriesByCity[];
  /** The current theme (light or dark) */
  currentTheme: 'light' | 'dark' | undefined;
  /** Function to get the industry key from its display name */
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  /** List of potential "Others" categories */
  potentialOthers: string[];
  /** Function to get the themed color for an industry */
  getThemedIndustryColor: (industry: string) => string;
  /** Whether the data is currently loading */
  isLoading: boolean;
  /** Any error that occurred during data loading */
  error: Error | null;
  /** Set of selected industry display names */
  selectedIndustryDisplayNames: Set<string>;
  /** Whether multiple cities can be fetched */
  canFetchMultiCity: boolean;
}

/**
 * Props for the CityComparisonCard component
 */
export interface CityComparisonCardProps {
  /** The transformed city comparison data to display */
  data: TransformedCityComparison[];
  /** The current theme (light or dark) */
  currentTheme: 'light' | 'dark' | undefined;
  /** Set of selected industry display names */
  selectedIndustryDisplayNames: Set<string>;
  /** Whether multiple cities can be fetched */
  canFetchMultiCity: boolean;
  /** Whether the data is currently loading */
  isLoading: boolean;
  /** Any error that occurred during data loading */
  error: Error | null;
}

/**
 * Props for the TopCitiesCard component
 */
export interface TopCitiesCardProps {
  /** The top cities data to display */
  data: TopCityData[];
  /** The current theme (light or dark) */
  currentTheme: 'light' | 'dark' | undefined;
  /** Whether the data is currently loading */
  isLoading: boolean;
  /** Any error that occurred during data loading */
  error: Error | null;
}

/**
 * Props for error boundary components
 */
export interface ErrorBoundaryProps {
  /** The error that occurred */
  error: ErrorWithApi | null;
  /** The component to render when an error occurs */
  fallback: React.ReactNode;
  /** The children to render when no error occurs */
  children: React.ReactNode;
}
