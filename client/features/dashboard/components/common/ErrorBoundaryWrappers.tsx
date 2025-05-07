import {
  CityComparison,
  CityIndustryBars,
  IndustryDistribution,
  TopCitiesChart,
} from '@/features/dashboard/components/views/AnalyticsView/cards';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import type React from 'react';

// Define a simple error type instead of importing it
type ErrorWithApi = Error | null;

// Define component props types
type IndustryDistributionProps = React.ComponentProps<typeof IndustryDistribution>;
type CityIndustryBarsProps = React.ComponentProps<typeof CityIndustryBars>;
type CityComparisonProps = React.ComponentProps<typeof CityComparison>;
type TopCitiesChartProps = React.ComponentProps<typeof TopCitiesChart>;

// Error boundary wrapper for IndustryDistribution
export const IndustryDistributionWithErrorBoundary = (props: IndustryDistributionProps) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error loading industry distribution"
        message="There was a problem loading the industry distribution data. Please try again later."
      />
    }
  >
    <IndustryDistribution {...props} />
  </ErrorBoundary>
);

// Error boundary wrapper for CityIndustryBars
export const CityIndustryBarsWithErrorBoundary = (props: CityIndustryBarsProps) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error loading industries by city"
        message="There was a problem loading the industries by city data. Please try again later."
      />
    }
  >
    <CityIndustryBars {...props} />
  </ErrorBoundary>
);

// Error boundary wrapper for CityComparison
export const CityComparisonWithErrorBoundary = (props: CityComparisonProps) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error loading city comparison"
        message="There was a problem loading the city comparison data. Please try again later."
      />
    }
  >
    <CityComparison {...props} />
  </ErrorBoundary>
);

// Error boundary wrapper for TopCitiesChart
export const TopCitiesChartWithErrorBoundary = (props: TopCitiesChartProps) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error loading top cities"
        message="There was a problem loading the top cities data. Please try again later."
      />
    }
  >
    <TopCitiesChart {...props} />
  </ErrorBoundary>
);
