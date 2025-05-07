import { useChartTheme } from '@/features/dashboard/hooks/useChartTheme';
import { FeatureErrorBoundary } from '@/shared/components/error';
import { Tooltip } from '@heroui/react';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultLegendContent';

interface ChartDataItem {
  name: string;
  value: number;
  others_breakdown?: Array<{ name: string; value: number }>;
}

interface IndustryDistributionProps {
  data: ChartDataItem[];
  currentTheme?: 'light' | 'dark';
  getIndustryKeyFromName: (displayName: string) => string | undefined;
  potentialOthers: string[];
  industryNameMap: Map<string, string>;
  getThemedIndustryColor: (name: string, theme?: 'light' | 'dark') => string;
}

interface CustomizedPieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
  value: number;
  theme?: 'light' | 'dark';
  textColor: string;
}

const RADIAN = Math.PI / 180;

const renderCustomizedPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius: _innerRadius,
  outerRadius,
  percent,
  index: _index,
  name: _name,
  value: _value,
  textColor,
}: CustomizedPieLabelProps) => {
  if (percent < 0.08) return null;

  const radius = outerRadius + 10;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = x > cx ? 'start' : 'end';

  const label = `${(percent * 100).toFixed(0)}%`;

  return (
    <text
      x={x}
      y={y}
      fill={textColor}
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize={10}
    >
      {label}
    </text>
  );
};

interface CustomLegendProps {
  payload?: Payload[];
  theme?: 'light' | 'dark';
  getIndustryKeyFromName: (name: string) => string | undefined;
  potentialOthers: string[];
  industryNameMap: Map<string, string>;
  data: ChartDataItem[];
}

const RenderCustomLegend = (props: CustomLegendProps) => {
  const { payload, theme, getIndustryKeyFromName, potentialOthers, industryNameMap, data } = props;
  const folder = theme === 'dark' ? 'industries-dark' : 'industries-light';
  const { textColor } = useChartTheme();

  if (!payload) return null;

  const totalValue = payload.reduce((sum, entry) => sum + (entry.payload?.value || 0), 0);

  return (
    <ul className="list-none p-0 m-0 flex flex-wrap justify-center gap-x-2 gap-y-1 mt-2 text-[10px] sm:text-xs">
      {payload.map((entry, index) => {
        const industryName = entry.value as string;
        const value = entry.payload?.value || 0;
        const originalDataItem = data.find((item) => item.name === industryName);
        const breakdownData = originalDataItem?.others_breakdown;
        const percent = totalValue > 0 ? (value / totalValue) * 100 : 0;
        const displayPercent = `(${(percent).toFixed(0)}%)`;

        let industryKey = 'broken';
        let iconPath = `/${folder}/broken.svg`;

        if (industryName === 'Others') {
          industryKey = 'multi';
          iconPath = `/${folder}/multi.svg`;
        } else {
          industryKey = getIndustryKeyFromName(industryName) ?? 'broken';
          iconPath = `/${folder}/${industryKey}.svg`;
        }

        if (industryName === 'Others') {
          return (
            <Tooltip
              key={industryName}
              content={
                <div className="p-1 text-tiny">
                  <p className="font-bold mb-1">Includes:</p>
                  <ul className="list-none pl-0 max-h-40 overflow-y-auto">
                    {breakdownData
                      ? breakdownData.map((detail, detailIndex) => {
                          const detailName = industryNameMap.get(detail.name) || detail.name;
                          const detailKey = detail.name ?? 'broken';
                          const detailPercent =
                            totalValue > 0 ? (detail.value / totalValue) * 100 : 0;
                          return (
                            <li
                              key={detail.name}
                              className="flex items-center justify-between"
                              style={{ color: textColor }}
                            >
                              <span className="flex items-center">
                                <img
                                  src={`/${folder}/${detailKey}.svg`}
                                  alt={`${detailName} icon`}
                                  width={12}
                                  height={12}
                                  className="mr-1"
                                  onError={(e) => {
                                    e.currentTarget.src = `/${folder}/broken.svg`;
                                  }}
                                />
                                {detailName}
                              </span>
                              <span>({detailPercent.toFixed(1)}%)</span>
                            </li>
                          );
                        })
                      : potentialOthers.map((otherName, otherIndex) => (
                          <li
                            key={otherName}
                            className="flex items-center"
                            style={{ color: textColor }}
                          >
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
                            {otherName} (Count unknown)
                          </li>
                        ))}
                  </ul>
                </div>
              }
              placement="top"
              closeDelay={0}
            >
              <li style={{ display: 'flex', alignItems: 'center', color: textColor }}>
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
                {industryName} {displayPercent}
              </li>
            </Tooltip>
          );
        }

        return (
          <li
            key={industryName}
            style={{ display: 'flex', alignItems: 'center', color: textColor }}
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
            {industryName} {displayPercent}
          </li>
        );
      })}
    </ul>
  );
};

export const IndustryDistribution: React.FC<IndustryDistributionProps> = ({
  data,
  currentTheme = 'light',
  getIndustryKeyFromName,
  potentialOthers,
  industryNameMap,
  getThemedIndustryColor,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { textColor, tooltipBgColor, tooltipBorderColor } = useChartTheme();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-default-500">
        No distribution data available.
      </div>
    );
  }

  const fallbackContent = (
    <div className="flex items-center justify-center h-full text-default-500">
      <p>Unable to render chart. Please try refreshing.</p>
    </div>
  );

  return (
    <div className="h-[300px] sm:h-[400px] w-full">
      {isTransitioning ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse bg-default-100 rounded-full h-16 w-16" />
        </div>
      ) : (
        <FeatureErrorBoundary featureName="IndustryChart" fallback={fallbackContent}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={40}
                outerRadius={70}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                labelLine={false}
                label={(props) => renderCustomizedPieLabel({ ...props, textColor })}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={getThemedIndustryColor(entry.name, currentTheme)}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: number, name: string) => [`${value} companies`, name]}
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
              />
              <Legend
                content={(legendProps) => (
                  <RenderCustomLegend
                    payload={legendProps.payload}
                    theme={currentTheme}
                    getIndustryKeyFromName={getIndustryKeyFromName}
                    potentialOthers={potentialOthers}
                    industryNameMap={industryNameMap}
                    data={data}
                  />
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </FeatureErrorBoundary>
      )}
    </div>
  );
};
