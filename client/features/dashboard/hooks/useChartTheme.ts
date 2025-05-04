import { useTheme } from 'next-themes';

export type ThemeColorType =
  | 'primary'
  | 'secondary'
  | 'grid'
  | 'tooltipBg'
  | 'tooltipBorder'
  | 'cursorFill'
  | 'barFill'
  | 'otherIndustry';

// Define a more specific type for the filter config
interface BaseFilterOption {
  value: string;
  title: string;
  color?: string | { light: string; dark: string } | Record<string, string>;
}

interface BaseFilterConfig {
  key: string;
  options?: BaseFilterOption[];
}

export const useChartTheme = () => {
  const { theme } = useTheme();
  const currentTheme = theme as 'light' | 'dark' | undefined;

  const getThemedColor = (type: ThemeColorType): string => {
    if (currentTheme === 'dark') {
      switch (type) {
        case 'primary':
          return '#FFFFFF'; // Text, labels
        case 'secondary':
          return '#A0A0A0'; // Axis ticks, secondary text
        case 'grid':
          return '#52525b'; // Grid lines (zinc-600)
        case 'tooltipBg':
          return '#27272a'; // Tooltip background (zinc-800)
        case 'tooltipBorder':
          return '#3f3f46'; // Tooltip border (zinc-700)
        case 'cursorFill':
          return 'rgba(100, 100, 100, 0.5)'; // Tooltip cursor fill
        case 'barFill':
          return '#8884d8'; // Default bar fill (Recharts default purple)
        case 'otherIndustry':
          return '#71717a'; // Color for 'Others' category (zinc-500)
        default:
          return '#FFFFFF'; // Default fallback for dark
      }
    }
    // Light theme (or default)
    switch (type) {
      case 'primary':
        return '#000000'; // Text, labels
      case 'secondary':
        return '#666666'; // Axis ticks, secondary text
      case 'grid':
        return '#a1a1aa'; // Grid lines (zinc-400)
      case 'tooltipBg':
        return '#FFFFFF'; // Tooltip background (white)
      case 'tooltipBorder':
        return '#e4e4e7'; // Tooltip border (zinc-200)
      case 'cursorFill':
        return 'rgba(200, 200, 200, 0.5)'; // Tooltip cursor fill
      case 'barFill':
        return '#8884d8'; // Default bar fill (Recharts default purple)
      case 'otherIndustry':
        return '#a1a1aa'; // Color for 'Others' category (zinc-400)
      default:
        return '#000000'; // Default fallback for light
    }
  };

  return {
    currentTheme,
    getThemedColor,
    textColor: getThemedColor('primary'),
    secondaryTextColor: getThemedColor('secondary'),
    gridColor: getThemedColor('grid'),
    tooltipBgColor: getThemedColor('tooltipBg'),
    tooltipBorderColor: getThemedColor('tooltipBorder'),
    cursorFillColor: getThemedColor('cursorFill'),
    barFillColor: getThemedColor('barFill'),
    otherIndustryColor: getThemedColor('otherIndustry'),
  };
};

// Update the getThemedIndustryColor function to use the specific types
export const getThemedIndustryColor = (
  industryName: string,
  industryKey: string | undefined, // e.g., 'A', 'B', 'Other'
  filtersConfig: BaseFilterConfig[], // Use specific type instead of any[]
  theme: 'light' | 'dark' | undefined,
): string => {
  const industryFilter = filtersConfig.find((f) => f.key === 'industries');
  const option = industryFilter?.options?.find(
    (opt: BaseFilterOption) => opt.value === industryKey,
  );

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
