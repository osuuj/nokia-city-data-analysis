import type {
  DistributionItemRaw,
  PivotedData,
} from '@/features/dashboard/hooks/analytics/useAnalytics';
import type { TransformedCityComparison, TransformedIndustriesByCity } from './types';

// Define the name for the grouped category from backend
export const OTHER_CATEGORY_NAME_FROM_BACKEND = 'Other';
export const OTHER_CATEGORY_DISPLAY_NAME = 'Others'; // How to display it

// Helper function to get industry name from letter or handle "Other"
export const getIndustryName = (key: string, map: Map<string, string>): string => {
  if (key === OTHER_CATEGORY_NAME_FROM_BACKEND) {
    return OTHER_CATEGORY_DISPLAY_NAME;
  }
  return map.get(key) || key;
};

// Transform industries by city data
export const transformIndustriesByCity = (
  data: PivotedData | undefined,
): TransformedIndustriesByCity[] => {
  if (!data) return [];

  return (data as unknown as Array<{ city: string; [key: string]: string | number }>)
    .map((item) => {
      const city = item.city;
      if (!city) return null;

      // Create a new object with the city property
      const result: TransformedIndustriesByCity = { city: String(city) };

      // Add each industry count as a separate property
      const entries = Object.entries(item).filter(([key]) => key !== 'city');
      for (const [industry, count] of entries) {
        result[industry] = Number(count);
      }

      return result;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};

// Transform city comparison data
export const transformCityComparison = (
  data: PivotedData | undefined,
): TransformedCityComparison[] => {
  if (!data) return [];

  return (
    data as unknown as Array<{
      industry: string;
      [key: string]: string | number;
    }>
  )
    .map((item) => {
      const industry = item.industry;
      if (!industry) return null;

      // Create a new object with the industry property
      const result: TransformedCityComparison = { industry: String(industry) };

      // Add each city count as a separate property
      const entries = Object.entries(item).filter(([key]) => key !== 'industry');
      for (const [city, count] of entries) {
        result[city] = Number(count);
      }

      return result;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};

// Get potential "Others" category
export const getPotentialOthers = (data: Array<DistributionItemRaw> | undefined): string[] => {
  if (!data) return [];
  return data
    .filter((item: DistributionItemRaw) => item.name === OTHER_CATEGORY_NAME_FROM_BACKEND)
    .flatMap((item: DistributionItemRaw) => item.others_breakdown || [])
    .map((item) => item.name);
};

// Get industry key from display name
export const getIndustryKeyFromName = (
  displayName: string,
  filters: Array<{
    key: string;
    options?: Array<{ value: string; title: string }>;
  }>,
): string | undefined => {
  if (displayName === OTHER_CATEGORY_DISPLAY_NAME) {
    return OTHER_CATEGORY_NAME_FROM_BACKEND;
  }
  const industriesFilter = filters.find((f) => f.key === 'industries');
  const industry = industriesFilter?.options?.find((opt) => opt.title === displayName);
  return industry?.value;
};

// Get themed industry color
export const getThemedIndustryColor = (
  industryName: string,
  theme: string | undefined,
  filters: Array<{
    key: string;
    options?: Array<{
      title: string;
      color?: string | { light: string; dark: string };
    }>;
  }>,
): string => {
  const industriesFilter = filters.find((f) => f.key === 'industries');
  const industry = industriesFilter?.options?.find((i) => i.title === industryName);
  if (!industry?.color) return theme === 'dark' ? '#ffffff' : '#000000';
  return typeof industry.color === 'string'
    ? industry.color
    : theme === 'dark'
      ? industry.color.dark
      : industry.color.light;
};
