import { useChartTheme } from '@/features/dashboard/hooks/useChartTheme';
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
  data: ChartDataItem[];
  currentTheme?: 'light' | 'dark';
}

export const CityComparison: React.FC<CityComparisonProps> = ({ data, currentTheme = 'light' }) => {
  const cities = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'industry') : [];

  // Use shared chart theme hook
  const { textColor, secondaryTextColor, gridColor, tooltipBgColor, tooltipBorderColor } =
    useChartTheme();

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
            labelStyle={{ color: textColor, fontWeight: 'bold', marginBottom: '4px' }}
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
