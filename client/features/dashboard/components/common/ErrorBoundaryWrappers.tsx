import type { Error as ApiError } from '@/features/dashboard/types';
import { ErrorBoundary } from '@/shared/components/error';
import { ErrorMessage } from '@/shared/components/error';
import {
  CityComparisonCard,
  IndustriesByCityCard,
  IndustryDistributionCard,
  TopCitiesCard,
} from '../views/AnalyticsView/cards';
import type { CityComparisonCardProps } from '../views/AnalyticsView/cards/CityComparisonCard';
import type { IndustriesByCityCardProps } from '../views/AnalyticsView/cards/IndustriesByCityCard';
import type { IndustryDistributionCardProps } from '../views/AnalyticsView/cards/IndustryDistributionCard';
import type { TopCitiesCardProps } from '../views/AnalyticsView/cards/TopCitiesCard';

// Define a simple ErrorWithApi type since the original is no longer available
type ErrorWithApi = Error | ApiError | null;

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
