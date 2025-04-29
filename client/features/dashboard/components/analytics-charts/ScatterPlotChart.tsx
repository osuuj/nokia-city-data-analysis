import type React from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
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
 * Data item for scatter plot chart
 * Represents a point in the scatter plot with x, y coordinates and optional metadata
 */
export interface ScatterDataItem {
  /** X-coordinate of the data point */
  x: number;
  /** Y-coordinate of the data point */
  y: number;
  /** Optional size value for bubble size */
  z?: number;
  /** Optional name for the data point */
  name?: string;
  /** Optional category for grouping points */
  category?: string;
  /** Additional properties with specific types */
  [key: string]: number | string | undefined;
}

/**
 * Props for the ScatterPlotChart component
 */
interface ScatterPlotChartProps {
  /** Array of data points for the scatter plot */
  data: ScatterDataItem[];
  /** Current theme for styling the chart */
  currentTheme?: 'light' | 'dark';
  /** Height of the chart in pixels */
  height?: number;
  /** Label for the X-axis */
  xAxisLabel?: string;
  /** Label for the Y-axis */
  yAxisLabel?: string;
  /** Key to use for X-axis values (default: 'x') */
  xAxisKey?: string;
  /** Key to use for Y-axis values (default: 'y') */
  yAxisKey?: string;
  /** Key to use for Z-axis values (default: 'z') */
  zAxisKey?: string;
  /** Key to use for category grouping (default: 'category') */
  categoryKey?: string;
  /** Key to use for point names (default: 'name') */
  nameKey?: string;
  /** Callback when a point is clicked */
  onPointClick?: (data: ScatterDataItem) => void;
}

/**
 * ScatterPlotChart Component
 *
 * A responsive scatter plot for visualizing relationships between variables.
 * Supports grouping by category, interactive tooltips, and point click events.
 *
 * Features:
 * - Responsive design that adapts to container size
 * - Category-based grouping with different colors
 * - Themed colors for light and dark modes
 * - Customizable axis labels
 * - Interactive tooltips
 * - Optional bubble sizing with Z-axis values
 *
 * @example
 * ```tsx
 * <ScatterPlotChart
 *   data={[
 *     { x: 10, y: 20, name: 'Point A', category: 'Group 1' },
 *     { x: 15, y: 25, name: 'Point B', category: 'Group 1' },
 *     { x: 20, y: 15, name: 'Point C', category: 'Group 2' }
 *   ]}
 *   height={400}
 *   xAxisLabel="X Value"
 *   yAxisLabel="Y Value"
 *   onPointClick={(data) => console.log('Clicked:', data)}
 * />
 * ```
 */
export const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({
  data,
  currentTheme = 'light',
  height = 300,
  xAxisLabel,
  yAxisLabel,
  xAxisKey = 'x',
  yAxisKey = 'y',
  zAxisKey = 'z',
  categoryKey = 'category',
  nameKey = 'name',
  onPointClick,
}) => {
  // Get themed colors
  const textColor = getThemedColor(currentTheme, 'primary');
  const secondaryTextColor = getThemedColor(currentTheme, 'secondary');
  const gridColor = getThemedColor(currentTheme, 'grid');
  const tooltipBgColor = getThemedColor(currentTheme, 'tooltipBg');
  const tooltipBorderColor = getThemedColor(currentTheme, 'tooltipBorder');

  // Default colors for categories
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

  // Group data by category
  const categories = Array.from(new Set(data.map((item) => String(item[categoryKey] || ''))));
  const categoryMap = new Map<string, string>();
  categories.forEach((category, index) => {
    categoryMap.set(category, defaultColors[index % defaultColors.length]);
  });

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
  }: { active?: boolean; payload?: Array<{ payload: ScatterDataItem }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: tooltipBgColor,
            border: `1px solid ${tooltipBorderColor}`,
            borderRadius: '4px',
            padding: '8px',
            color: textColor,
          }}
        >
          {data[nameKey] && (
            <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{String(data[nameKey])}</p>
          )}
          <p>
            {xAxisLabel || 'X'}: {String(data[xAxisKey])}
          </p>
          <p>
            {yAxisLabel || 'Y'}: {String(data[yAxisKey])}
          </p>
          {data[zAxisKey] !== undefined && (
            <p>
              {zAxisKey}: {String(data[zAxisKey])}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No data available for scatter plot analysis
      </div>
    );
  }

  return (
    <div className={`h-[${height}px] w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey={xAxisKey}
            type="number"
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
            dataKey={yAxisKey}
            type="number"
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
          {categories.length > 0 && <ZAxis dataKey={zAxisKey} range={[50, 400]} />}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter
            data={data}
            fill={currentTheme === 'dark' ? '#ffffff' : '#000000'}
            name={nameKey}
            onClick={(data) => onPointClick?.(data.payload as ScatterDataItem)}
          >
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.x}-${entry.y}-${entry[categoryKey] || ''}`}
                fill={categoryMap.get(String(entry[categoryKey] || '')) || defaultColors[0]}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
