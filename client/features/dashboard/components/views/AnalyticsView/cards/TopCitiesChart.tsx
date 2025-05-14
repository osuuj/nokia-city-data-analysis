import { useChartTheme } from '@/features/dashboard/hooks/useChartTheme';
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

// Define the expected data structure for this component
interface ChartDataItem {
  city: string;
  count: number;
}

interface TopCitiesChartProps {
  data: ChartDataItem[];
  onCityClick?: (city: string) => void;
}

export const TopCitiesChart: React.FC<TopCitiesChartProps> = ({ data, onCityClick }) => {
  // Use shared chart theme hook
  const {
    textColor,
    secondaryTextColor,
    gridColor,
    tooltipBgColor,
    tooltipBorderColor,
    barFillColor,
  } = useChartTheme();

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

  // Handle bar click to select city
  const handleBarClick = (data: ChartDataItem) => {
    if (onCityClick && data && data.city) {
      onCityClick(data.city);
    }
  };

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
            formatter={(_, __, props) => [`${props.payload.count} companies`, props.payload.city]}
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
            onClick={handleBarClick}
            style={{ cursor: onCityClick ? 'pointer' : 'default' }}
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
