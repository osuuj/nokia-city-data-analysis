'use client';

import type { LandingErrorBoundaryProps } from '@/features/landing/types';
import { FeatureErrorBoundary } from '@/shared/components/error';

/**
 * Error boundary specifically for the landing page.
 * Catches errors in the landing page component tree.
 */
export function LandingErrorBoundary({ children }: LandingErrorBoundaryProps) {
  return (
    <FeatureErrorBoundary
      featureName="Landing"
      errorTitle="Something went wrong on the landing page"
      errorMessage="An unexpected error occurred. Please try refreshing the page."
    >
      {children}
    </FeatureErrorBoundary>
  );
}
