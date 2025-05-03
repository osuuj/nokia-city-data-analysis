/**
 * Analytics view types
 */

/**
 * Represents a city with its company count in comparative analytics
 */
export interface CityCount {
  name: string;
  count: number;
}

/**
 * Transformed data for city comparison chart
 */
export interface TransformedCityComparison {
  industry: string;
  cities: CityCount[];
}

/**
 * Transformed data for industries by city chart
 */
export interface TransformedIndustriesByCity {
  city: string;
  [industry: string]: string | number;
}

/**
 * Transformed data for industry distribution chart
 */
export interface TransformedDistribution {
  industry: string;
  count: number;
}

/**
 * Top city data structure
 */
export interface TopCityData {
  city: string;
  count: number;
}
