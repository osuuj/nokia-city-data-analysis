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

// ADD BACK getThemedColor helper
const getThemedColor = (
  theme: string | undefined,
  type: 'primary' | 'secondary' | 'grid' | 'tooltipBg' | 'tooltipBorder',
) => {
  if (theme === 'dark') {
    switch (type) {
      case 'primary':
        return '#3B82F6'; // blue-500
      case 'secondary':
        return '#10B981'; // emerald-500
      case 'grid':
        return '#4B5563'; // gray-600
      case 'tooltipBg':
        return '#1F2937'; // gray-800
      case 'tooltipBorder':
        return '#374151'; // gray-700
      default:
        return '#3B82F6'; // blue-500
    }
  }

  switch (type) {
    case 'primary':
      return '#3B82F6'; // blue-500
    case 'secondary':
      return '#10B981'; // emerald-500
    case 'grid':
      return '#E5E7EB'; // gray-200
    case 'tooltipBg':
      return '#F9FAFB'; // gray-50
    case 'tooltipBorder':
      return '#E5E7EB'; // gray-200
    default:
      return '#3B82F6'; // blue-500
  }
};

export interface ChartDataItem {
  industry: string; // Industry display name (or 'Others')
  [cityName: string]: number | string; // City names as keys, values are counts
}

interface CityComparisonProps {
  data: ChartDataItem[]; // USE: Correctly defined type
  currentTheme?: 'light' | 'dark';
}

export const CityComparison: React.FC<CityComparisonProps> = ({ data, currentTheme = 'light' }) => {
  const cities = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'industry') : [];

  // ADD BACK themed color constants
  const textColor = getThemedColor(currentTheme, 'primary');
  const secondaryTextColor = getThemedColor(currentTheme, 'secondary');
  const gridColor = getThemedColor(currentTheme, 'grid');
  const tooltipBgColor = getThemedColor(currentTheme, 'tooltipBg');
  const tooltipBorderColor = getThemedColor(currentTheme, 'tooltipBorder');

  if (!data || data.length === 0 || cities.length === 0) {
    // Return null or a placeholder/message component
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No data available for comparison.
      </div>
    );
  }

  return (
    <div className="h-[300px] sm:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke={gridColor} strokeOpacity={0.5} />
          <PolarAngleAxis dataKey="industry" tick={{ fontSize: 10, fill: textColor }} />
          <PolarRadiusAxis axisLine={false} tick={{ fontSize: 9, fill: secondaryTextColor }} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: '8px',
              border: `1px solid ${tooltipBorderColor}`,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              color: textColor,
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{
              color: textColor,
              fontWeight: 'bold',
              marginBottom: '4px',
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              color: textColor,
              fontSize: '11px',
            }}
            iconSize={10}
          />
          {cities.map((city, index) => {
            // Use default Recharts fill or a simpler color scheme if needed
            const defaultFillColors = ['#8884d8', '#82ca9d', '#ffc658', '#00C49F', '#FF8042'];
            const fill = defaultFillColors[index % defaultFillColors.length];
            return (
              <Radar
                key={city}
                name={city}
                dataKey={city}
                stroke={fill}
                fill={fill}
                fillOpacity={0.3}
                animationDuration={1500}
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
