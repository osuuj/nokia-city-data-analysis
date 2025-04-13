import type React from 'react';
import { useMemo } from 'react';
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

// ADD BACK getThemedColor helper
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
        return '#52525b'; // Lighter grid for dark
      case 'tooltipBg':
        return '#27272a';
      case 'tooltipBorder':
        return '#3f3f46';
      case 'barFill':
        return '#8884d8';
      default:
        return '#FFFFFF';
    }
  }
  switch (type) {
    case 'primary':
      return '#000000';
    case 'secondary':
      return '#666666';
    case 'grid':
      return '#a1a1aa'; // Darker grid for light
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

// Define the expected data structure for this component
interface ChartDataItem {
  city: string;
  count: number;
}

interface TopCitiesChartProps {
  data: ChartDataItem[]; // USE: Correctly defined type
  currentTheme?: 'light' | 'dark';
}

export const TopCitiesChart: React.FC<TopCitiesChartProps> = ({ data, currentTheme = 'light' }) => {
  // ADD BACK themed color constants
  const textColor = getThemedColor(currentTheme, 'primary');
  const secondaryTextColor = getThemedColor(currentTheme, 'secondary');
  const gridColor = getThemedColor(currentTheme, 'grid');
  const tooltipBgColor = getThemedColor(currentTheme, 'tooltipBg');
  const tooltipBorderColor = getThemedColor(currentTheme, 'tooltipBorder');
  const barFillColor = getThemedColor(currentTheme, 'barFill'); // Keep using for bar fill

  const optimizedData = useMemo(() => {
    return data.slice(0, 10).map((item) => ({
      ...item,
      formattedCount: item.count > 999 ? `${(item.count / 1000).toFixed(1)}k` : item.count,
    }));
  }, [data]);

  // Check for empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No top cities data available.
      </div>
    );
  }

  return (
    <div className="h-[300px] sm:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={optimizedData}
          margin={{
            top: 5,
            right: 25,
            left: 5,
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
            tick={{ fontSize: 10, fill: textColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="city"
            type="category"
            tick={{ fontSize: 10, fill: secondaryTextColor }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value: number, name: string, props) => [
              `${props.payload.count} companies`,
              props.payload.city,
            ]}
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: '8px',
              border: `1px solid ${tooltipBorderColor}`,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              color: textColor,
              fontSize: '12px',
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
            <LabelList
              dataKey="formattedCount"
              position="right"
              style={{ fill: textColor, fontSize: 10 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
