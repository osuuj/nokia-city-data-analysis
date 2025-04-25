import { useMemo } from 'react';
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
import { BaseCard } from '../shared/BaseCard';
import type { TransformedCityComparison } from './utils/types';

interface CityComparisonCardProps {
  data: TransformedCityComparison[];
  currentTheme: 'light' | 'dark' | undefined;
  isLoading: boolean;
  error?: Error | null;
}

export function CityComparisonCard({
  data,
  currentTheme,
  isLoading,
  error,
}: CityComparisonCardProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.industry,
      ...Object.fromEntries(item.cities.map((city) => [city.name, city.count])),
    }));
  }, [data]);

  return (
    <BaseCard
      title="City Comparison"
      isLoading={isLoading}
      error={error}
      emptyMessage="No city comparison data available."
    >
      {data && data.length > 0 && (
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(chartData[0] || {})
                .filter((key) => key !== 'name')
                .map((city, index) => (
                  <Bar
                    key={city}
                    dataKey={city}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </BaseCard>
  );
}
