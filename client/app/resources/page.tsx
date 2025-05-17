'use client';

import { CategoryAccordionItem, ResourcesHeader } from '@/features/resources/components';
import { useResourceCategories } from '@/features/resources/hooks/resourceHooks';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import { StandardFallback } from '@/shared/components/loading';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { useEffect, useState } from 'react';
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
  // Add a mounted state to prevent content flash before header loads
  const [mounted, setMounted] = useState(false);

  // Wait for the component to mount to ensure header is loaded first
  useEffect(() => {
    // Short timeout to ensure header has time to render
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Don't show content until mounted
  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <StandardFallback text="Loading..." />
      </div>
    );
  }

  // Use a common wrapper for consistent layout
  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6 pt-24">
      <AnimatedBackground priority="high" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <ResourcesHeader />
        {children}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <PageWrapper>
        <StandardFallback text="Loading resources..." />
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">Error Loading Resources</h1>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            There was an error loading the resources. Please try again later.
          </p>
        </div>
      </PageWrapper>
    );
  }

  // If categories is undefined, show a message
  if (!categories || categories.length === 0) {
    return (
      <PageWrapper>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">No Resources Available</h1>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            There are no resources available at the moment. Please check back later.
          </p>
        </div>
      </PageWrapper>
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
      <div className="relative w-full min-h-screen px-4 py-8 md:px-6 pt-24">
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
    </ErrorBoundary>
  );
}
