import {
  CityComparison,
  CityIndustryBars,
  IndustryDistribution,
  TopCitiesChart,
} from '@/features/dashboard/components/views/AnalyticsView/cards';
import { FeatureErrorBoundary } from '@/shared/components/error';
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
  <FeatureErrorBoundary
    featureName="IndustryDistribution"
    errorTitle="Error loading industry distribution"
    errorMessage="There was a problem loading the industry distribution data. Please try again later."
  >
    <IndustryDistribution {...props} />
  </FeatureErrorBoundary>
);

// Error boundary wrapper for CityIndustryBars
export const CityIndustryBarsWithErrorBoundary = (props: CityIndustryBarsProps) => (
  <FeatureErrorBoundary
    featureName="CityIndustryBars"
    errorTitle="Error loading industries by city"
    errorMessage="There was a problem loading the industries by city data. Please try again later."
  >
    <CityIndustryBars {...props} />
  </FeatureErrorBoundary>
);

// Error boundary wrapper for CityComparison
export const CityComparisonWithErrorBoundary = (props: CityComparisonProps) => (
  <FeatureErrorBoundary
    featureName="CityComparison"
    errorTitle="Error loading city comparison"
    errorMessage="There was a problem loading the city comparison data. Please try again later."
  >
    <CityComparison {...props} />
  </FeatureErrorBoundary>
);

// Error boundary wrapper for TopCitiesChart
export const TopCitiesChartWithErrorBoundary = (props: TopCitiesChartProps) => (
  <FeatureErrorBoundary
    featureName="TopCitiesChart"
    errorTitle="Error loading top cities"
    errorMessage="There was a problem loading the top cities data. Please try again later."
  >
    <TopCitiesChart {...props} />
  </FeatureErrorBoundary>
);
