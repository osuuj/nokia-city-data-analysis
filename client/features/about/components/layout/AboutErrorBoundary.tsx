import { ErrorBoundary } from '@/shared/components/error';
import { ErrorMessage } from '@/shared/components/error';
import type { PropsWithChildren } from 'react';

/**
 * Error boundary component for the About page.
 * Wraps the About page content and handles any errors that occur.
 */
export function AboutErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Error Loading About Page"
          message="There was an error loading the about page content. Please try again later."
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
}
