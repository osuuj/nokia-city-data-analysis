import type React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Define the expected data structure for this component
interface ChartDataItem {
  name: string; // Industry display name (or 'Others')
  value: number; // Count for this industry
}

// Placeholder implementation
const getIndustryColor = (industry: string, theme: string | undefined) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#00C49F', '#FF8042', '#0088FE', '#FFBB28'];
  let hash = 0;
  for (let i = 0; i < industry.length; i++) {
    hash = industry.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Helper function to get theme-appropriate text color
const getThemedColor = (
  theme: string | undefined,
  type: 'primary' | 'tooltipBg' | 'tooltipBorder',
) => {
  if (theme === 'dark') {
    switch (type) {
      case 'primary':
        return '#FFFFFF'; // White text for dark mode
      case 'tooltipBg':
        return '#27272a'; // Dark bg for tooltip
      case 'tooltipBorder':
        return '#3f3f46';
      default:
        return '#FFFFFF';
    }
  }
  // No else needed, execution continues if theme is not 'dark'
  switch (type) {
    case 'primary':
      return '#000000'; // Black text for light mode
    case 'tooltipBg':
      return '#FFFFFF'; // White bg for tooltip
    case 'tooltipBorder':
      return '#e4e4e7';
    default:
      return '#000000';
  }
};

interface IndustryDistributionProps {
  data: ChartDataItem[]; // USE: Correctly defined type
  currentTheme?: 'light' | 'dark';
}

// Define props for the customized label component
interface CustomizedPieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string; // From the data
  value: number; // From the data
  theme?: 'light' | 'dark'; // Passed in
}

// Custom label component for Pie chart
const RADIAN = Math.PI / 180;
const renderCustomizedPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
  theme,
}: CustomizedPieLabelProps) => {
  // Position label slightly outside the outer radius
  const radius = outerRadius + 15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = x > cx ? 'start' : 'end';

  return (
    <text
      x={x}
      y={y}
      fill={getThemedColor(theme, 'primary')} // Use themed color for fill
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize={12} // Optional: set font size
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const IndustryDistribution: React.FC<IndustryDistributionProps> = ({
  data,
  currentTheme = 'light',
}) => {
  // Check for empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No distribution data available.
      </div>
    );
  }

  // Get themed colors
  const textColor = getThemedColor(currentTheme, 'primary');
  const tooltipBgColor = getThemedColor(currentTheme, 'tooltipBg');
  const tooltipBorderColor = getThemedColor(currentTheme, 'tooltipBorder');

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            labelLine={false}
            label={(props) => renderCustomizedPieLabel({ ...props, theme: currentTheme })}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={getIndustryColor(entry.name, currentTheme)} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} companies`, name]}
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: '8px',
              border: `1px solid ${tooltipBorderColor}`,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              color: textColor, // Explicit text color
            }}
            itemStyle={{ color: textColor }} // Explicit item color
            labelStyle={{ color: textColor }} // Explicit label color
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '10px',
              color: textColor, // Explicit text color
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
