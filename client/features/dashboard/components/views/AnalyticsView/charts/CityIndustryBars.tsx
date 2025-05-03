import { Tooltip } from '@heroui/react';
import type React from 'react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultLegendContent';

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
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  potentialOthers: string[];
  getThemedIndustryColor: (name: string, theme?: 'light' | 'dark') => string;
  selectedIndustryDisplayNames: Set<string>;
  canFetchMultiCity: boolean;
}

interface CustomLegendProps {
  payload?: Payload[];
  theme?: 'light' | 'dark';
  getIndustryKeyFromName: (name: string) => string | undefined;
  onMouseEnter?: (data: Payload) => void;
  onMouseLeave?: (data: Payload) => void;
  activeIndustry: string | null;
  potentialOthers: string[];
}

const RenderCustomLegend = (props: CustomLegendProps) => {
  const {
    payload,
    theme,
    getIndustryKeyFromName,
    onMouseEnter,
    onMouseLeave,
    activeIndustry,
    potentialOthers,
  } = props;
  const folder = theme === 'dark' ? 'industries-dark' : 'industries-light';
  const textColor = getThemedColor(theme, 'primary');

  if (!payload) return null;

  return (
    <ul className="list-none p-0 m-0 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 mt-2 text-[10px] sm:text-xs">
      {payload.map((entry, index) => {
        const industryName = entry.value as string;
        let industryKey = 'broken';
        let iconPath = `/${folder}/broken.svg`;

        if (industryName === 'Others') {
          industryKey = 'multi';
          iconPath = `/${folder}/multi.svg`;
        } else {
          industryKey = getIndustryKeyFromName(industryName) ?? 'broken';
          iconPath = `/${folder}/${industryKey}.svg`;
        }

        const isInactive = activeIndustry !== null && activeIndustry !== industryName;

        if (industryName === 'Others') {
          return (
            <Tooltip
              key={industryName}
              content={
                <div className="p-1 text-tiny">
                  <p className="font-bold mb-1">Includes:</p>
                  <ul className="list-none pl-0 max-h-40 overflow-y-auto">
                    {potentialOthers.map((otherName, otherIndex) => (
                      <li key={otherName} className="flex items-center">
                        <img
                          src={`/${folder}/${getIndustryKeyFromName(otherName) ?? 'broken'}.svg`}
                          alt={`${otherName} icon`}
                          width={12}
                          height={12}
                          className="mr-1"
                          onError={(e) => {
                            e.currentTarget.src = `/${folder}/broken.svg`;
                          }}
                        />
                        {otherName}
                      </li>
                    ))}
                  </ul>
                </div>
              }
              placement="top"
              closeDelay={0}
            >
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: textColor,
                  opacity: isInactive ? 0.5 : 1,
                  transition: 'opacity 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  const value = e.currentTarget.dataset.value;
                  if (value) {
                    onMouseEnter?.({ value } as unknown as Payload);
                  }
                }}
                onMouseLeave={(e) => {
                  const value = e.currentTarget.dataset.value;
                  if (value) {
                    onMouseLeave?.({ value } as unknown as Payload);
                  }
                }}
              >
                <img
                  src={iconPath}
                  alt={`${industryName} icon`}
                  width={14}
                  height={14}
                  style={{ marginRight: '3px' }}
                  onError={(e) => {
                    e.currentTarget.src = `/${folder}/broken.svg`;
                  }}
                />
                {industryName}
              </li>
            </Tooltip>
          );
        }

        return (
          <li
            key={industryName}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: textColor,
              opacity: isInactive ? 0.5 : 1,
              transition: 'opacity 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              const value = e.currentTarget.dataset.value;
              if (value) {
                onMouseEnter?.({ value } as unknown as Payload);
              }
            }}
            onMouseLeave={(e) => {
              const value = e.currentTarget.dataset.value;
              if (value) {
                onMouseLeave?.({ value } as unknown as Payload);
              }
            }}
          >
            <img
              src={iconPath}
              alt={`${industryName} icon`}
              width={14}
              height={14}
              style={{ marginRight: '3px' }}
              onError={(e) => {
                e.currentTarget.src = `/${folder}/broken.svg`;
              }}
            />
            {industryName}
          </li>
        );
      })}
    </ul>
  );
};

export const CityIndustryBars: React.FC<CityIndustryBarsProps> = ({
  data,
  currentTheme = 'light',
  getIndustryKeyFromName,
  potentialOthers,
  getThemedIndustryColor,
  selectedIndustryDisplayNames,
  canFetchMultiCity,
}) => {
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  // Filter industries based on selectedIndustryDisplayNames
  const industries = useMemo(() => {
    if (!data.length) return [];
    const allIndustries = Object.keys(data[0]).filter((key) => key !== 'city');
    return allIndustries.filter((industry) => selectedIndustryDisplayNames.has(industry));
  }, [data, selectedIndustryDisplayNames]);

  // Only show data if we can fetch multiple cities
  if (!canFetchMultiCity || !data.length) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No data available for comparison.
      </div>
    );
  }

  const textColor = getThemedColor(currentTheme, 'primary');
  const secondaryTextColor = getThemedColor(currentTheme, 'secondary');
  const gridColor = getThemedColor(currentTheme, 'grid');
  const tooltipBgColor = getThemedColor(currentTheme, 'tooltipBg');
  const tooltipBorderColor = getThemedColor(currentTheme, 'tooltipBorder');
  const cursorFill = getThemedColor(currentTheme, 'cursorFill');

  const handleLegendMouseEnter = (entry: Payload): void => {
    if (entry?.value) {
      setActiveIndustry(entry.value as string);
    }
  };

  const handleLegendMouseLeave = (): void => {
    setActiveIndustry(null);
  };

  return (
    <div className="h-[300px] sm:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 100,
          }}
          barSize={18}
          barGap={2}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke={gridColor}
            opacity={0.5}
          />
          <XAxis
            dataKey="city"
            tick={{ fill: secondaryTextColor, fontSize: 10 }}
            textAnchor="middle"
            height={60}
            stroke={gridColor}
            tickMargin={5}
            axisLine={false}
            tickLine={false}
            angle={-45}
            interval={0}
          />
          <YAxis
            tick={{ fill: textColor, fontSize: 10 }}
            stroke={gridColor}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip
            formatter={(value: number, name: string) => [
              `${value} companies`,
              name === 'Others' ? 'Various Industries' : name,
            ]}
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: '8px',
              border: `1px solid ${tooltipBorderColor}`,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              color: textColor,
              fontSize: '12px',
            }}
            labelStyle={{ fontWeight: 'bold', color: textColor }}
            itemStyle={{ color: textColor }}
            cursor={{ fill: cursorFill }}
          />
          <Legend
            content={
              <RenderCustomLegend
                theme={currentTheme}
                getIndustryKeyFromName={getIndustryKeyFromName}
                onMouseEnter={handleLegendMouseEnter}
                onMouseLeave={handleLegendMouseLeave}
                activeIndustry={activeIndustry}
                potentialOthers={potentialOthers}
              />
            }
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '5px', color: textColor, fontSize: '12px' }}
          />

          {industries.map((industry) => (
            <Bar
              key={industry}
              dataKey={industry}
              name={industry}
              fill={getThemedIndustryColor(industry, currentTheme)}
              opacity={activeIndustry && activeIndustry !== industry ? 0.3 : 1}
              barSize={20}
              isAnimationActive={true}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
