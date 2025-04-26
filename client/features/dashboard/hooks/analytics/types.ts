/**
 * Analytics Types
 *
 * This file contains all the type definitions used in the analytics feature.
 * It serves as a central location for all analytics-related types to avoid duplication
 * and ensure consistency across the codebase.
 */

/**
 * Represents data for a top city in terms of business metrics
 */
export interface TopCityData {
  /** The name of the city */
  city: string;
  /** The total count of businesses in the city */
  count: number;
  /** The number of companies in the city */
  companyCount: number;
  /** The number of industries in the city */
  industryCount: number;
  /** The average number of companies per industry in the city */
  averageCompaniesPerIndustry: number;
}

/**
 * Represents data that has been pivoted for easier consumption in charts and tables
 * Each record contains a mix of string and number values
 */
export type PivotedData = Array<Record<string, string | number>>;

/**
 * Represents a raw distribution item with name and value
 */
export interface DistributionItemRaw {
  /** The name of the distribution item */
  name: string;
  /** The value of the distribution item */
  value: number;
  /** Optional breakdown of items that were grouped into "Others" */
  others_breakdown?: Array<{ name: string; value: number }>;
}

/**
 * Represents raw distribution data as an array of distribution items
 */
export type DistributionDataRaw = DistributionItemRaw[];

/**
 * Represents a transformed distribution item with industry name, count, and percentage
 */
export interface TransformedDistribution {
  /** The name of the industry */
  industry: string;
  /** The count of businesses in this industry */
  count: number;
  /** The percentage of total businesses in this industry */
  percentage: number;
}

/**
 * Represents industries by city data in a transformed format
 * Each record contains a city name and industry-specific counts
 */
export interface TransformedIndustriesByCity {
  /** The name of the city */
  city: string;
  /** Dynamic properties for industry counts */
  [key: string]: string | number;
}

/**
 * Represents city comparison data in a transformed format
 * Each record contains an industry and city-specific counts
 */
export interface TransformedCityComparison {
  /** The name of the industry */
  industry: string;
  /** Array of cities with their respective counts for this industry */
  cities: Array<{
    /** The name of the city */
    name: string;
    /** The count of businesses in this industry for this city */
    count: number;
  }>;
  /** Dynamic properties for additional data */
  [key: string]: string | number | Array<{ name: string; count: number }>;
}

/**
 * Represents a generic API response with data and status
 */
export interface ApiResponse<T> {
  /** The response data */
  data: T;
  /** The response status */
  status: string;
}

/**
 * Represents an industry distribution API response
 */
export interface IndustryDistributionResponse extends ApiResponse<DistributionDataRaw> {}

/**
 * Represents an industries by city API response
 */
export interface IndustriesByCityResponse extends ApiResponse<TransformedIndustriesByCity[]> {}

/**
 * Represents a city comparison API response
 */
export interface CityComparisonResponse extends ApiResponse<TransformedCityComparison[]> {}

/**
 * Represents a top cities API response
 */
export interface TopCitiesResponse extends ApiResponse<TopCityData[]> {}

/**
 * Represents a city entity
 */
export interface City {
  /** The name of the city */
  name: string;
  // Add other city properties as needed
}

/**
 * Represents an industry entity
 */
export interface Industry {
  /** The unique identifier for the industry */
  value: string;
  /** The display name for the industry */
  title: string;
  /** Optional icon for the industry */
  icon?: string;
  /** Optional color configuration for light/dark themes */
  color?: {
    /** Color for light theme */
    light: string;
    /** Color for dark theme */
    dark: string;
  };
}

/**
 * Represents a filter entity
 */
export interface Filter {
  /** The unique identifier for the filter */
  key: string;
  /** Optional array of filter options */
  options?: Industry[];
  /** Optional array of industries */
  industries?: Industry[];
  /** Optional name for the filter */
  name?: string;
  /** Optional dark theme color */
  darkColor?: string;
  /** Optional light theme color */
  lightColor?: string;
  /** Optional value for the filter */
  value?: string;
  /** Optional title for the filter */
  title?: string;
}

/**
 * Represents analytics data with ID, name, value, and timestamp
 */
export interface AnalyticsData {
  /** The unique identifier for the analytics data */
  id: string;
  /** The name of the analytics data */
  name: string;
  /** The value of the analytics data */
  value: number;
  /** The timestamp of the analytics data */
  timestamp: string;
  // Add other properties as needed
}

/**
 * Represents an error that combines standard Error and API error properties
 */
export interface ErrorWithApi {
  /** The name of the error */
  name: string;
  /** The error message */
  message: string;
  /** The HTTP status code */
  status: number;
  /** Optional error code */
  code?: string;
}
