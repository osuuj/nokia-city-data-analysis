import { Card, CardBody, CardHeader, Divider, Spinner } from '@heroui/react';
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
import type { TransformedCityComparison } from './utils/types';

interface CityComparisonCardProps {
  data: TransformedCityComparison[];
  currentTheme: 'light' | 'dark' | undefined;
  isLoading: boolean;
}

export function CityComparisonCard({ data, currentTheme, isLoading }: CityComparisonCardProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.industry,
      ...Object.fromEntries(item.cities.map((city) => [city.name, city.count])),
    }));
  }, [data]);

  return (
    <Card className="border border-default-200">
      <CardHeader className="flex justify-between items-center px-3 sm:px-6">
        <h2 className="text-lg font-bold">City Comparison</h2>
      </CardHeader>
      <Divider className="my-1 sm:my-2" />
      <CardBody className="px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
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
        ) : (
          <p className="text-center text-default-500">No city comparison data available.</p>
        )}
      </CardBody>
    </Card>
  );
}
