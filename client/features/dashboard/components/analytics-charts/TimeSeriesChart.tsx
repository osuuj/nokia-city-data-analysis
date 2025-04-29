import type React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * Helper function to get themed colors based on the current theme
 * @param theme - The current theme ('light' or 'dark')
 * @param type - The type of color to retrieve
 * @returns A color string in hex format
 */
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

/**
 * Data item for time series chart
 * Each item represents a data point with a date and multiple series values
 */
export interface TimeSeriesDataItem {
  /** Date or time period for this data point */
  date: string;
  /** Dynamic properties for each series, where the key is the series name and the value is the data point */
  [seriesName: string]: number | string;
}

/**
 * Props for the TimeSeriesChart component
 */
interface TimeSeriesChartProps {
  /** Array of data points for the time series chart */
  data: TimeSeriesDataItem[];
  /** Current theme for styling the chart */
  currentTheme?: 'light' | 'dark';
  /** Height of the chart in pixels */
  height?: number;
  /** Label for the X-axis */
  xAxisLabel?: string;
  /** Label for the Y-axis */
  yAxisLabel?: string;
}

/**
 * TimeSeriesChart Component
 *
 * A responsive line chart for visualizing time series data.
 * Automatically extracts series from the data and renders them as separate lines.
 * Supports theming for light and dark modes.
 *
 * Features:
 * - Responsive design that adapts to container size
 * - Automatic series extraction from data
 * - Themed colors for light and dark modes
 * - Customizable axis labels
 * - Interactive tooltips
 *
 * @example
 * ```tsx
 * <TimeSeriesChart
 *   data={[
 *     { date: '2021-01', Revenue: 1000, Profit: 200 },
 *     { date: '2021-02', Revenue: 1200, Profit: 250 },
 *     { date: '2021-03', Revenue: 1100, Profit: 220 }
 *   ]}
 *   height={400}
 *   xAxisLabel="Month"
 *   yAxisLabel="Amount ($)"
 * />
 * ```
 */
export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  currentTheme = 'light',
  height = 300,
  xAxisLabel,
  yAxisLabel,
}) => {
  // Extract series names from the first data point (excluding 'date')
  const series = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'date') : [];

  // Get themed colors
  const textColor = getThemedColor(currentTheme, 'primary');
  const secondaryTextColor = getThemedColor(currentTheme, 'secondary');
  const gridColor = getThemedColor(currentTheme, 'grid');
  const tooltipBgColor = getThemedColor(currentTheme, 'tooltipBg');
  const tooltipBorderColor = getThemedColor(currentTheme, 'tooltipBorder');

  // Default colors for lines
  const defaultColors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
  ];

  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No data available for time series analysis
      </div>
    );
  }

  return (
    <div className={`h-[${height}px] w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            tick={{ fill: textColor }}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: 'insideBottom',
                    offset: -5,
                    fill: textColor,
                  }
                : undefined
            }
          />
          <YAxis
            tick={{ fill: secondaryTextColor }}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    fill: textColor,
                  }
                : undefined
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBgColor,
              border: `1px solid ${tooltipBorderColor}`,
              borderRadius: '4px',
            }}
            labelStyle={{ color: textColor }}
            itemStyle={{ color: textColor }}
          />
          <Legend />
          {series.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={defaultColors[index % defaultColors.length]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
