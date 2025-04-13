import type React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Define the expected data structure for this component
interface ChartDataItem {
  city: string;
  count: number;
}

// Helper function to get theme-appropriate text color
const getThemedColor = (
  theme: string | undefined,
  type: 'primary' | 'secondary' | 'grid' | 'tooltipBg' | 'tooltipBorder' | 'barFill',
) => {
  if (theme === 'dark') {
    switch (type) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#A0A0A0';
      case 'grid':
        return '#52525b'; // Lighter grid for dark (zinc-600) - KEEP THIS
      case 'tooltipBg':
        return '#27272a';
      case 'tooltipBorder':
        return '#3f3f46';
      case 'barFill':
        return '#8884d8'; // Keep consistent bar color or make it theme-dependent if needed
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
      return '#a1a1aa'; // Darker grid for light (zinc-400) - CHANGE THIS
    case 'tooltipBg':
      return '#FFFFFF';
    case 'tooltipBorder':
      return '#e4e4e7';
    case 'barFill':
      return '#8884d8';
    default:
      return '#000000';
  }
};

interface TopCitiesChartProps {
  data: ChartDataItem[]; // USE: Correctly defined type
  currentTheme?: 'light' | 'dark';
}

export const TopCitiesChart: React.FC<TopCitiesChartProps> = ({ data, currentTheme = 'light' }) => {
  // Get themed colors
  const textColor = getThemedColor(currentTheme, 'primary');
  const secondaryTextColor = getThemedColor(currentTheme, 'secondary');
  const gridColor = getThemedColor(currentTheme, 'grid');
  const tooltipBgColor = getThemedColor(currentTheme, 'tooltipBg');
  const tooltipBorderColor = getThemedColor(currentTheme, 'tooltipBorder');
  const barFillColor = getThemedColor(currentTheme, 'barFill');

  // Check for empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No top cities data available.
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            horizontal={true}
            vertical={false}
            opacity={0.4}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="city"
            type="category"
            tick={{ fontSize: 12, fill: secondaryTextColor }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip
            formatter={(value, name, props) => [`${value} companies`, props.payload.city]}
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: '8px',
              border: `1px solid ${tooltipBorderColor}`,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              color: textColor,
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{ color: textColor, fontWeight: 'bold' }}
            cursor={{ fill: 'transparent' }}
          />
          <Bar
            dataKey="count"
            fill={barFillColor}
            name="Active Companies"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          >
            <LabelList dataKey="count" position="right" style={{ fill: textColor }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
