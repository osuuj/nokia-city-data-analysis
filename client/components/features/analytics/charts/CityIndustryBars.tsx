import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Placeholder color function (needed for bar fills)
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
  type: 'primary' | 'secondary' | 'grid' | 'tooltipBg' | 'tooltipBorder' | 'cursorFill',
) => {
  if (theme === 'dark') {
    switch (type) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#A0A0A0';
      case 'grid':
        return '#52525b'; // Lighter grid for dark (zinc-600)
      case 'tooltipBg':
        return '#27272a';
      case 'tooltipBorder':
        return '#3f3f46';
      case 'cursorFill':
        return 'rgba(100, 100, 100, 0.5)';
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
      return '#a1a1aa'; // Darker grid for light (zinc-400)
    case 'tooltipBg':
      return '#FFFFFF';
    case 'tooltipBorder':
      return '#e4e4e7';
    case 'cursorFill':
      return 'rgba(200, 200, 200, 0.5)';
    default:
      return '#000000';
  }
};

interface CityIndustryBarsData {
  city: string;
  [key: string]: string | number;
}

interface CityIndustryBarsProps {
  data: CityIndustryBarsData[];
  currentTheme?: 'light' | 'dark';
}

export const CityIndustryBars: React.FC<CityIndustryBarsProps> = ({
  data,
  currentTheme = 'light',
}) => {
  const industries = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'city') : [];
  const [activeIndustry, setActiveIndustry] = React.useState<string | null>(null);

  // Determine text color based on theme
  const textColor = getThemedColor(currentTheme, 'primary');
  const secondaryTextColor = getThemedColor(currentTheme, 'secondary');
  const tooltipBgColor = getThemedColor(currentTheme, 'tooltipBg');
  const tooltipBorderColor = getThemedColor(currentTheme, 'tooltipBorder');
  const gridStrokeColor = getThemedColor(currentTheme, 'grid'); // Use the helper
  const cursorFillColor = getThemedColor(currentTheme, 'cursorFill'); // Use the helper

  // Empty data checks
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No data selected.
      </div>
    );
  }
  if (industries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No industry data found for selected city/cities.
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      {/* Ensure container height is sufficient */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          // Margins from your snippet
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
          // Gaps from your snippet
          barGap={2}
          barCategoryGap="20%"
        >
          {/* Grid styling from your snippet - Use themed stroke */}
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.3}
            vertical={false}
            stroke={gridStrokeColor}
          />
          <XAxis
            dataKey="city"
            angle={-45}
            textAnchor="end"
            // Tick fill uses theme variable
            tick={{ fontSize: 12, fill: textColor }}
            height={60}
            // Tick line and axis line from snippet
            tickLine={false}
            axisLine={false} // No axis line in snippet
          />
          <YAxis
            name="Count"
            // Tick fill uses theme variable
            tick={{ fontSize: 12, fill: secondaryTextColor }}
            // Axis/tick lines from snippet
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            // Styling from snippet
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: '8px',
              border: `1px solid ${tooltipBorderColor}`,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              color: textColor, // Ensure tooltip text color is set
            }}
            itemStyle={{ color: textColor }} // Set item color explicitly
            labelStyle={{ color: textColor, fontWeight: 'bold', marginBottom: '4px' }}
            cursor={{ fill: cursorFillColor }} // Themed cursor
          />
          <Legend
            // Styling from snippet - ensure text color
            wrapperStyle={{ paddingTop: '20px', color: textColor }} // Explicit text color
            onMouseEnter={(e) => setActiveIndustry(e.dataKey as string)}
            onMouseLeave={() => setActiveIndustry(null)}
          />
          {industries.map((industry, index) => (
            <Bar
              key={industry}
              dataKey={industry}
              // Grouped bar
              fill={getIndustryColor(industry, currentTheme)}
              name={industry}
              // Styling from snippet
              radius={[4, 4, 0, 0]}
              opacity={activeIndustry === null || activeIndustry === industry ? 1 : 0.5}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
