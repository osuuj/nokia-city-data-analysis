'use client';

import { useResourceCategories } from '@/features/resources/hooks/resourceHooks';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import { StandardFallback } from '@/shared/components/loading';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { Suspense } from 'react';
import { CategoryAccordionItem, ResourcesHeader } from './components';
import './mobile.css';

/**
 * Resources page component
 *
 * Displays resource categories in an accordion format.
 * Implements performance optimizations including:
 * - Code splitting through separate component files
 * - Lazy loading of resources only when a category is expanded
 * - Optimized rendering for mobile devices
 */
export default function ResourcePage() {
  const { data: categories, isLoading, error } = useResourceCategories();

  if (isLoading) {
    return <StandardFallback text="Loading resources..." />;
  }

  if (error) {
    return (
      <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
        <AnimatedBackground />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary mb-4">Error Loading Resources</h1>
            <p className="text-lg text-default-600 max-w-2xl mx-auto">
              There was an error loading the resources. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If categories is undefined, show a message
  if (!categories || categories.length === 0) {
    return (
      <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
        <AnimatedBackground />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary mb-4">No Resources Available</h1>
            <p className="text-lg text-default-600 max-w-2xl mx-auto">
              There are no resources available at the moment. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Error Loading Resources"
          message="There was an error loading the resources. Please try again later."
        />
      }
    >
      <Suspense fallback={<StandardFallback text="Loading resources..." />}>
        <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
          <AnimatedBackground priority="high" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <ResourcesHeader />

            <div className="mb-12">
              {/* Render categories with the first one expanded by default */}
              {categories.map((category, index) => (
                <CategoryAccordionItem
                  key={category.id}
                  category={category}
                  defaultExpanded={index === 0 || category.id === 'getting-started'}
                />
              ))}
            </div>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
