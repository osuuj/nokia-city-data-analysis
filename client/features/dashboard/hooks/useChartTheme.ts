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

// Define expected structure for filter options and the config
interface FilterOption {
  value: string;
  title: string;
  color?: { light: string; dark: string };
  // Add other potential properties if known
}

interface FilterConfigItem {
  key: string;
  options?: FilterOption[];
  // Add other potential properties if known
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

// Function to get specific industry color based on theme (extracted for reusability if needed outside the hook/component)
export const getThemedIndustryColor = (
  industryName: string,
  industryKey: string | undefined, // e.g., 'A', 'B', 'Other'
  filtersConfig: FilterConfigItem[], // Use defined type
  theme: 'light' | 'dark' | undefined,
): string => {
  const industryFilter = filtersConfig.find((f: FilterConfigItem) => f.key === 'industries');
  const option = industryFilter?.options?.find((opt: FilterOption) => opt.value === industryKey);

  // Default color if not found
  const defaultColor = theme === 'dark' ? '#A0A0A0' : '#666666';

  // Check if color has the expected structure
  const colorConfig = option?.color as { light: string; dark: string } | undefined;
  if (colorConfig?.light && colorConfig?.dark) {
    return theme === 'dark' ? colorConfig.dark : colorConfig.light;
  }

  // Fallback for "Others" or if color not defined/invalid
  if (industryName === 'Others' || industryKey === 'Other') {
    return theme === 'dark' ? '#71717a' : '#a1a1aa'; // Consistent 'Others' color
  }

  return defaultColor;
};
