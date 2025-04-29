'use client';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';
import { useState } from 'react';
import { ScatterPlotChart } from '../analytics-charts/ScatterPlotChart';
import type { ScatterDataItem } from '../analytics-charts/ScatterPlotChart';
import { TimeSeriesChart } from '../analytics-charts/TimeSeriesChart';
import type { TimeSeriesDataItem } from '../analytics-charts/TimeSeriesChart';

/**
 * Represents the different dimensions for data comparison
 * - time: Compare data over time periods
 * - industry: Compare data across different industries
 * - city: Compare data across different cities
 */
export type ComparisonDimension = 'time' | 'industry' | 'city';

/**
 * Data structure for comparison visualization
 * Contains datasets for different comparison dimensions
 */
export interface ComparisonData {
  /** Time series data with labels and datasets */
  time?: {
    /** Time period labels (e.g., months, quarters, years) */
    labels: string[];
    /** Array of datasets, each with a label and corresponding data points */
    datasets: {
      /** Name of the dataset (e.g., "Manufacturing", "Technology") */
      label: string;
      /** Array of numeric values corresponding to each label */
      data: number[];
    }[];
  };
  /** Industry comparison data */
  industry?: {
    /** Industry names */
    labels: string[];
    /** Array of datasets for different metrics or time periods */
    datasets: {
      /** Name of the dataset (e.g., "2022", "2023") */
      label: string;
      /** Array of numeric values for each industry */
      data: number[];
    }[];
  };
  /** City comparison data */
  city?: {
    /** City names */
    labels: string[];
    /** Array of datasets for different metrics or time periods */
    datasets: {
      /** Name of the dataset (e.g., "2022", "2023") */
      label: string;
      /** Array of numeric values for each city */
      data: number[];
    }[];
  };
}

/**
 * Props for the DataComparison component
 */
export interface DataComparisonProps {
  /** Comparison data for different dimensions */
  data: ComparisonData;
  /** Callback when the comparison dimension changes */
  onDimensionChange: (dimension: ComparisonDimension) => void;
  /** Callback when the selected metric changes */
  onMetricChange: (metric: string) => void;
  /** Available metrics for comparison */
  availableMetrics: { value: string; label: string }[];
  /** Optional CSS class name */
  className?: string;
}

/**
 * DataComparison Component
 *
 * A versatile component for comparing data across different dimensions:
 * - Time series visualization for temporal data
 * - Scatter plot for industry comparisons
 * - Scatter plot for city comparisons
 *
 * Features:
 * - Interactive chart switching between dimensions
 * - Metric selection for data comparison
 * - Responsive design with tabs and dropdowns
 * - Automatic data transformation for different chart types
 *
 * @example
 * ```tsx
 * <DataComparison
 *   data={comparisonData}
 *   onDimensionChange={(dimension) => console.log(`Changed to ${dimension}`)}
 *   onMetricChange={(metric) => console.log(`Changed to ${metric}`)}
 *   availableMetrics={[
 *     { value: 'revenue', label: 'Revenue' },
 *     { value: 'employees', label: 'Employees' }
 *   ]}
 * />
 * ```
 */
export const DataComparison: React.FC<DataComparisonProps> = ({
  data,
  onDimensionChange,
  onMetricChange,
  availableMetrics,
  className = '',
}) => {
  const [selectedDimension, setSelectedDimension] = useState<ComparisonDimension>('time');
  const [selectedMetric, setSelectedMetric] = useState(availableMetrics[0]?.value || '');

  /**
   * Handles dimension change and notifies parent component
   * @param dimension - The new comparison dimension
   */
  const handleDimensionChange = (dimension: ComparisonDimension) => {
    setSelectedDimension(dimension);
    onDimensionChange(dimension);
  };

  /**
   * Handles metric change and notifies parent component
   * @param metric - The new selected metric
   */
  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
    onMetricChange(metric);
  };

  /**
   * Renders the appropriate chart based on the selected dimension
   * Transforms data to the format required by each chart type
   * @returns React element with the appropriate chart
   */
  const renderComparisonChart = () => {
    const chartData = data[selectedDimension];
    if (!chartData) return null;

    switch (selectedDimension) {
      case 'time': {
        // Transform data for TimeSeriesChart
        const timeSeriesData: TimeSeriesDataItem[] = chartData.labels.map((date, index) => {
          const dataPoint: TimeSeriesDataItem = { date };
          for (const dataset of chartData.datasets) {
            dataPoint[dataset.label] = dataset.data[index];
          }
          return dataPoint;
        });

        return <TimeSeriesChart data={timeSeriesData} height={400} />;
      }

      case 'industry':
      case 'city': {
        // Transform data for ScatterPlotChart
        const scatterData: ScatterDataItem[] = chartData.datasets.flatMap((dataset) => {
          return chartData.labels.map((label: string, index: number) => ({
            x: index,
            y: dataset.data[index],
            name: label,
            category: dataset.label,
          }));
        });

        return (
          <ScatterPlotChart
            data={scatterData}
            height={400}
            xAxisLabel={selectedDimension === 'industry' ? 'Industry' : 'City'}
            yAxisLabel={availableMetrics.find((m) => m.value === selectedMetric)?.label || ''}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Data Comparison</h3>
        <div className="flex items-center gap-2">
          <Select
            value={selectedMetric}
            onSelectionChange={(value) => handleMetricChange(value as string)}
            className="w-48"
          >
            {availableMetrics.map((metric) => (
              <SelectItem key={metric.value}>{metric.label}</SelectItem>
            ))}
          </Select>
          <Dropdown>
            <DropdownTrigger>
              <Button size="sm" variant="flat">
                <Icon icon="mdi:chart-box" className="mr-2" />
                Change View
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Comparison dimensions">
              <DropdownItem
                key="time"
                onPress={() => handleDimensionChange('time')}
                isSelected={selectedDimension === 'time'}
              >
                <Icon icon="mdi:clock-outline" className="mr-2" />
                Time Series
              </DropdownItem>
              <DropdownItem
                key="industry"
                onPress={() => handleDimensionChange('industry')}
                isSelected={selectedDimension === 'industry'}
              >
                <Icon icon="mdi:factory" className="mr-2" />
                Industry
              </DropdownItem>
              <DropdownItem
                key="city"
                onPress={() => handleDimensionChange('city')}
                isSelected={selectedDimension === 'city'}
              >
                <Icon icon="mdi:city" className="mr-2" />
                City
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardBody>
        <Tabs
          selectedKey={selectedDimension}
          onSelectionChange={(key) => handleDimensionChange(key as ComparisonDimension)}
        >
          <Tab
            key="time"
            title={
              <div className="flex items-center">
                <Icon icon="mdi:clock-outline" className="mr-2" />
                Time Series
              </div>
            }
          >
            {renderComparisonChart()}
          </Tab>
          <Tab
            key="industry"
            title={
              <div className="flex items-center">
                <Icon icon="mdi:factory" className="mr-2" />
                Industry
              </div>
            }
          >
            {renderComparisonChart()}
          </Tab>
          <Tab
            key="city"
            title={
              <div className="flex items-center">
                <Icon icon="mdi:city" className="mr-2" />
                City
              </div>
            }
          >
            {renderComparisonChart()}
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};
