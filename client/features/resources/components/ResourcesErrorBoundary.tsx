import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import type { PropsWithChildren } from 'react';

/**
 * Error boundary component for the Resources page.
 * Wraps the Resources page content and handles any errors that occur.
 */
export function ResourcesErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Error Loading Resources"
          message="There was an error loading the resources. Please try again later."
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
}
