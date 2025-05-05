'use client';

import { Icon } from '@iconify/react';
import type { DashboardError } from '../../../types/error';
import { FadeIn } from '../Animations';

interface ErrorDisplayProps {
  error?: Error | null;
  message?: string;
  showDetails?: boolean;
}

/**
 * ErrorDisplay component
 * Displays error messages with optional details for debugging
 */
export function ErrorDisplay({ error, message, showDetails = false }: ErrorDisplayProps) {
  const errorMessage = message || 'An error occurred';
  const errorDetails = error?.message || 'Unknown error';

  return (
    <FadeIn>
      <div className="w-full p-6 rounded-lg border border-danger-200 bg-danger-50 dark:bg-danger-900/10 dark:border-danger-800">
        <div className="flex items-start gap-3">
          <div className="text-danger-500">
            <Icon icon="solar:danger-triangle-bold" width={24} height={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-danger-700 dark:text-danger-400">
              {errorMessage}
            </h3>
            <p className="mt-1 text-danger-600 dark:text-danger-300">{errorDetails}</p>

            {showDetails && error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-danger-600 dark:text-danger-300">
                  Technical details
                </summary>
                <pre className="mt-2 p-2 text-xs bg-danger-100 dark:bg-danger-900/20 rounded overflow-auto">
                  {JSON.stringify(
                    { name: error.name, message: error.message, stack: error.stack },
                    null,
                    2,
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
