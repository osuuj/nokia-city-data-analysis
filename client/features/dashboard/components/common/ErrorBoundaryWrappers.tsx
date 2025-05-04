import {
  CityComparisonCard,
  IndustriesByCityCard,
  IndustryDistributionCard,
  TopCitiesCard,
} from '@/features/dashboard/components/views/AnalyticsView/cards';
import { ErrorBoundary } from '@/shared/components/error';
import { ErrorMessage } from '@/shared/components/error';
import type React from 'react';

// Define a simple error type instead of importing it
type ErrorWithApi = Error | null;

// Define component props types
type IndustryDistributionCardProps = React.ComponentProps<typeof IndustryDistributionCard>;
type IndustriesByCityCardProps = React.ComponentProps<typeof IndustriesByCityCard>;
type CityComparisonCardProps = React.ComponentProps<typeof CityComparisonCard>;
type TopCitiesCardProps = React.ComponentProps<typeof TopCitiesCard>;

// Error boundary wrapper for IndustryDistributionCard
export const IndustryDistributionCardWithErrorBoundary = (props: IndustryDistributionCardProps) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error loading industry distribution"
        message="There was a problem loading the industry distribution data. Please try again later."
      />
    }
  >
    <IndustryDistributionCard {...props} />
  </ErrorBoundary>
);

// Error boundary wrapper for IndustriesByCityCard
export const IndustriesByCityCardWithErrorBoundary = ({
  data,
  error,
  ...props
}: IndustriesByCityCardProps & { error: ErrorWithApi }) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error loading industries by city"
        message="There was a problem loading the industries by city data. Please try again later."
      />
    }
  >
    <IndustriesByCityCard data={data} error={error} {...props} />
  </ErrorBoundary>
);

// Error boundary wrapper for CityComparisonCard
export const CityComparisonCardWithErrorBoundary = ({
  data,
  error,
  ...props
}: CityComparisonCardProps & { error: ErrorWithApi }) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error loading city comparison"
        message="There was a problem loading the city comparison data. Please try again later."
      />
    }
  >
    <CityComparisonCard data={data} error={error} {...props} />
  </ErrorBoundary>
);

// Error boundary wrapper for TopCitiesCard
export const TopCitiesCardWithErrorBoundary = ({
  data,
  error,
  ...props
}: TopCitiesCardProps & { error: ErrorWithApi }) => (
  <ErrorBoundary
    fallback={
      <ErrorMessage
        title="Error loading top cities"
        message="There was a problem loading the top cities data. Please try again later."
      />
    }
  >
    <TopCitiesCard data={data} error={error} {...props} />
  </ErrorBoundary>
);
