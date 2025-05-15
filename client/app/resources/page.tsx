'use client';

import { useResourceCategories } from '@/features/resources/hooks';
import type { ResourceCategoryData } from '@/features/resources/types';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import { StandardFallback } from '@/shared/components/loading';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import './mobile.css';

// Break down the component for better code splitting
const ResourcesHeader = () => (
  <div className="text-center mb-10">
    <h1 className="text-4xl font-bold text-primary mb-4">Resource Center</h1>
    <p className="text-lg text-default-600 max-w-2xl mx-auto">
      Find all the tools, guides, and resources you need to help your business thrive in our
      community.
    </p>
  </div>
);

// Dynamically import components for better performance
const Icon = dynamic(() => import('@iconify/react').then((mod) => mod.Icon), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-primary/20 rounded-full animate-pulse" />,
});

const ResourceCard = dynamic(
  () => import('@/features/resources/components').then((mod) => mod.ResourceCard),
  {
    loading: () => (
      <div
        data-testid="standard-fallback"
        className="h-36 rounded-lg bg-background dark:bg-background animate-pulse"
      />
    ),
  },
);

// Custom accordion item that visually matches HeroUI Accordion but avoids runtime errors
const CategoryAccordionItem = ({ category }: { category: ResourceCategoryData }) => {
  const [isExpanded, setIsExpanded] = useState(category.id === 'getting-started');
  const [hasLoaded, setHasLoaded] = useState(isExpanded);

  return (
    <div className="border border-default-200 dark:border-default-100/20 rounded-large overflow-hidden mb-4 bg-content1 shadow-sm">
      <button
        type="button"
        className="w-full flex items-center justify-between p-6 text-left bg-default-50 dark:bg-default-100/5 hover:bg-default-100 dark:hover:bg-default-100/10 transition-colors"
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!hasLoaded) setHasLoaded(true);
        }}
        aria-expanded={isExpanded}
        aria-controls={`category-${category.id}`}
      >
        <div className="flex items-center gap-3">
          {/* Static icon placeholder with dynamic loading */}
          <div className="text-2xl text-primary w-6 h-6 flex items-center justify-center">
            {category.icon && <Icon icon={category.icon} />}
          </div>
          <h3 className="text-xl font-medium">{category.title}</h3>
          {category.description && (
            <p className="text-sm text-default-500 hidden sm:block ml-2 truncate max-w-[300px]">
              {category.description}
            </p>
          )}
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-default-100 dark:bg-default-100/20">
          {isExpanded ? (
            <ChevronUpIcon
              className="w-5 h-5 text-default-700 dark:text-default-500"
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="w-5 h-5 text-default-700 dark:text-default-500"
              aria-hidden="true"
            />
          )}
        </div>
      </button>

      {isExpanded && (
        <div id={`category-${category.id}`} className="p-6 pt-1 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
            {hasLoaded &&
              category.resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Resources page component
 *
 * Displays resource categories in an accordion format.
 * Implements performance optimizations including:
 * - Code splitting
 * - Lazy loading
 * - Only loading resources when a category is expanded
 * - Optimized loading indicators
 */
export default function ResourcePage() {
  const { data: categories, isLoading, error } = useResourceCategories();

  // Add preload hints and early signals to the browser
  useEffect(() => {
    // Preconnect to critical domains
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = window.location.origin;
    document.head.appendChild(preconnect);

    // Signal importance of main content
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('fetchpriority', 'high');
    }

    return () => {
      if (preconnect.parentNode) {
        document.head.removeChild(preconnect);
      }
    };
  }, []);

  if (isLoading) {
    return <StandardFallback text="Loading resources..." />;
  }

  if (error) {
    return (
      <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
        {/* Use the direct import like project and about pages */}
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
        {/* Use the direct import like project and about pages */}
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
          {/* Use the direct import like project and about pages */}
          <AnimatedBackground priority="high" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <ResourcesHeader />

            <div className="mb-12">
              {/* Only render the first 2 categories immediately to speed up initial render */}
              {categories.slice(0, 2).map((category) => (
                <CategoryAccordionItem key={category.id} category={category} />
              ))}

              {/* Load remaining categories after initial render */}
              {categories.length > 2 && (
                <div className="mt-4">
                  {categories.slice(2).map((category) => (
                    <CategoryAccordionItem key={category.id} category={category} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
