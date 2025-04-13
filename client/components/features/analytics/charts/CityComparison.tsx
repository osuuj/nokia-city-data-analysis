import type React from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// Define the expected data structure for this component
interface ChartDataItem {
  industry: string; // Industry display name (or 'Others')
  [cityName: string]: number | string; // City names as keys, values are counts
}

interface CityComparisonProps {
  data: ChartDataItem[]; // USE: Correctly defined type
  currentTheme?: 'light' | 'dark';
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#00C49F', '#FF8042'];

// Placeholder color function (assuming you have a real one)
const getCityColor = (city: string, theme: string | undefined) => {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#00C49F', '#FF8042', '#0088FE', '#FFBB28']; // Use COLORS
  let hash = 0; // Define hash
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length]; // Use COLORS
};

// Helper function to get theme-appropriate text color
const getThemedColor = (
  theme: string | undefined,
  type: 'primary' | 'secondary' | 'grid' | 'tooltipBg' | 'tooltipBorder',
) => {
  if (theme === 'dark') {
    switch (type) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#A0A0A0';
      case 'grid':
        return '#52525b'; // Use the same lighter grid for dark
      case 'tooltipBg':
        return '#27272a';
      case 'tooltipBorder':
        return '#3f3f46';
      default:
        return '#FFFFFF';
    }
  }
  // No else needed
  switch (type) {
    case 'primary':
      return '#000000';
    case 'secondary':
      return '#666666';
    case 'grid':
      return '#a1a1aa'; // Use the same darker grid for light
    case 'tooltipBg':
      return '#FFFFFF';
    case 'tooltipBorder':
      return '#e4e4e7';
    default:
      return '#000000';
  }
};

export const CityComparison: React.FC<CityComparisonProps> = ({ data, currentTheme = 'light' }) => {
  // Check if data is valid before proceeding
  if (!data || data.length === 0) {
    // Return null or a placeholder/message component
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No data available for comparison.
      </div>
    );
  }

  // Get all cities (except 'industry') from the first data item
  // This is safe now because we checked data.length > 0
  const cities = Object.keys(data[0]).filter((key) => key !== 'industry');

  // Check if there are cities to compare (besides 'industry')
  if (cities.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No cities found in data to compare.
      </div>
    );
  }

  // Get themed colors
  const textColor = getThemedColor(currentTheme, 'primary');
  const secondaryTextColor = getThemedColor(currentTheme, 'secondary');
  const gridColor = getThemedColor(currentTheme, 'grid');
  const tooltipBgColor = getThemedColor(currentTheme, 'tooltipBg');
  const tooltipBorderColor = getThemedColor(currentTheme, 'tooltipBorder');

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke={gridColor} />
          <PolarAngleAxis dataKey="industry" tick={{ fontSize: 12, fill: textColor }} />
          <PolarRadiusAxis axisLine={false} tick={{ fontSize: 10, fill: secondaryTextColor }} />
          {cities.map((city, index) => (
            <Radar
              key={city}
              name={city}
              dataKey={city}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.2}
            />
          ))}
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: '8px',
              border: `1px solid ${tooltipBorderColor}`,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              color: textColor,
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{ color: textColor, fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', color: textColor }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
