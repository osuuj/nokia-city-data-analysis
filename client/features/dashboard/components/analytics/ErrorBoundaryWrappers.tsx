import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import type { ErrorWithApi } from '../../hooks/analytics/types';
import {
  CityComparisonCard,
  IndustriesByCityCard,
  IndustryDistributionCard,
  TopCitiesCard,
} from './cards';
import type {
  CityComparisonCardProps,
  IndustriesByCityCardProps,
  IndustryDistributionCardProps,
  TopCitiesCardProps,
} from './types';

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
}: IndustriesByCityCardProps & { error: ErrorWithApi | null }) => (
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
}: CityComparisonCardProps & { error: ErrorWithApi | null }) => (
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
}: TopCitiesCardProps & { error: ErrorWithApi | null }) => (
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
