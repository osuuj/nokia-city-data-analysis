import { useChartTheme } from '@/features/dashboard/hooks/useChartTheme';
import { Tooltip } from '@heroui/react';
import React, { useCallback, useEffect, useState } from 'react';
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
}

interface CustomLegendProps {
  payload?: Payload[];
  theme?: 'light' | 'dark';
  getIndustryKeyFromName: (name: string) => string | undefined;
  onMouseEnter?: (industryName: string) => void;
  onMouseLeave?: (industryName: string) => void;
  activeIndustry: string | null;
  potentialOthers: string[];
  textColor: string;
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
    textColor,
  } = props;
  const folder = theme === 'dark' ? 'industries-dark' : 'industries-light';

  if (!payload) return null;

  return (
    <ul className="list-none p-0 m-0 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 mt-2 text-[10px] sm:text-xs">
      {payload.map((entry) => {
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
                    {potentialOthers.map((otherName) => (
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
                onMouseEnter={() => onMouseEnter?.(industryName)}
                onMouseLeave={() => onMouseLeave?.(industryName)}
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
            onMouseEnter={() => onMouseEnter?.(industryName)}
            onMouseLeave={() => onMouseLeave?.(industryName)}
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
}) => {
  const industries = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'city') : [];
  const [activeIndustry, setActiveIndustry] = React.useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const {
    textColor,
    secondaryTextColor,
    tooltipBgColor,
    tooltipBorderColor,
    gridColor: gridStrokeColor,
    cursorFillColor,
  } = useChartTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleIndustryHover = useCallback((industryName: string) => {
    setActiveIndustry(industryName);
  }, []);

  const handleIndustryLeave = useCallback(() => {
    setActiveIndustry(null);
  }, []);

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

  const chartMargin =
    containerWidth < 400
      ? { top: 5, right: 5, left: 0, bottom: 40 }
      : { top: 10, right: 10, left: 0, bottom: 50 };

  const fontSize = containerWidth < 400 ? 8 : 10;

  return (
    <div className="h-[300px] sm:h-[400px] w-full" ref={containerRef}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={chartMargin} barGap={1} barCategoryGap="15%">
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
            tick={{ fontSize: fontSize, fill: textColor }}
            height={60}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            name="Count"
            tick={{ fontSize: fontSize, fill: secondaryTextColor }}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: '8px',
              border: `1px solid ${tooltipBorderColor}`,
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
              color: textColor,
              fontSize: '12px',
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{ color: textColor, fontWeight: 'bold', marginBottom: '4px' }}
            cursor={{ fill: cursorFillColor }}
          />
          <Legend
            content={(legendProps) => (
              <RenderCustomLegend
                payload={legendProps.payload}
                theme={currentTheme}
                getIndustryKeyFromName={getIndustryKeyFromName}
                onMouseEnter={handleIndustryHover}
                onMouseLeave={handleIndustryLeave}
                activeIndustry={activeIndustry}
                potentialOthers={potentialOthers}
                textColor={textColor}
              />
            )}
          />
          {industries.map((industry) => (
            <Bar
              key={industry}
              dataKey={industry}
              fill={getThemedIndustryColor(industry, currentTheme)}
              name={industry}
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
