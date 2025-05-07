'use client';

import { FeatureErrorBoundary } from '@/shared/components/error';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Error boundary component for the project feature.
 * Catches and handles errors that occur within the project feature components.
 */
export function ProjectErrorBoundary({ children }: Props) {
  return (
    <FeatureErrorBoundary
      featureName="Project"
      errorMessage="An error occurred while loading the project content. Please try refreshing the page."
    >
      {children}
    </FeatureErrorBoundary>
  );
}
