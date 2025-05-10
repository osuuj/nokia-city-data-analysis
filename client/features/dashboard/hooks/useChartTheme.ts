import { useTheme } from 'next-themes';
import { useMemo } from 'react';

// Define color types
export type ThemeColorType =
  | 'primary'
  | 'secondary'
  | 'grid'
  | 'tooltipBg'
  | 'tooltipBorder'
  | 'cursorFill'
  | 'barFill'
  | 'otherIndustry';

// Theme colors by theme type
type ThemeColors = {
  [key in ThemeColorType]: string;
};

// Define a more specific type for the filter config
export interface FilterOption {
  value: string;
  title: string;
  color?: string | { light: string; dark: string } | Record<string, string>;
}

export interface FilterConfig {
  key: string;
  options?: FilterOption[];
}

/**
 * Custom hook for chart theme colors
 * Returns theme-aware color functions and values
 */
export const useChartTheme = () => {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || theme) as 'light' | 'dark' | undefined;

  // Memoize theme colors to prevent unnecessary rerenders
  const themeColors: ThemeColors = useMemo(() => {
    const isDark = currentTheme === 'dark';
    return {
      primary: isDark ? '#FFFFFF' : '#000000', // Text, labels
      secondary: isDark ? '#A0A0A0' : '#666666', // Axis ticks, secondary text
      grid: isDark ? '#52525b' : '#a1a1aa', // Grid lines
      tooltipBg: isDark ? '#27272a' : '#FFFFFF', // Tooltip background
      tooltipBorder: isDark ? '#3f3f46' : '#e4e4e7', // Tooltip border
      cursorFill: isDark ? 'rgba(100, 100, 100, 0.5)' : 'rgba(200, 200, 200, 0.5)', // Tooltip cursor fill
      barFill: isDark ? '#8884d8' : '#8884d8', // Default bar fill (Recharts default purple)
      otherIndustry: isDark ? '#71717a' : '#a1a1aa', // Color for 'Others' category
    };
  }, [currentTheme]);

  const getThemedColor = (type: ThemeColorType): string => {
    return themeColors[type];
  };

  return {
    currentTheme,
    getThemedColor,
    textColor: themeColors.primary,
    secondaryTextColor: themeColors.secondary,
    gridColor: themeColors.grid,
    tooltipBgColor: themeColors.tooltipBg,
    tooltipBorderColor: themeColors.tooltipBorder,
    cursorFillColor: themeColors.cursorFill,
    barFillColor: themeColors.barFill,
    otherIndustryColor: themeColors.otherIndustry,
  };
};

/**
 * Get industry-specific color based on the current theme
 */
export const getThemedIndustryColor = (
  industryName: string,
  industryKey: string | undefined, // e.g., 'A', 'B', 'Other'
  filtersConfig: FilterConfig[],
  theme: 'light' | 'dark' | undefined,
): string => {
  const industryFilter = filtersConfig.find((f) => f.key === 'industries');
  const option = industryFilter?.options?.find((opt: FilterOption) => opt.value === industryKey);

  // Default color if not found
  const defaultColor = theme === 'dark' ? '#A0A0A0' : '#666666';

  // Check if color has the expected structure as an object with light/dark properties
  if (
    option?.color &&
    typeof option.color === 'object' &&
    'light' in option.color &&
    'dark' in option.color
  ) {
    return theme === 'dark' ? option.color.dark : option.color.light;
  }

  // If color is a direct string value
  if (option?.color && typeof option.color === 'string') {
    return option.color;
  }

  // Fallback for "Others" or if color not defined/invalid
  if (industryName === 'Others' || industryKey === 'Other') {
    return theme === 'dark' ? '#71717a' : '#a1a1aa'; // Consistent 'Others' color
  }

  return defaultColor;
};
