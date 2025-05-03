'use client';

import { ResourceCard } from '@/features/resources/components';
import { ResourcesSkeleton } from '@/features/resources/components';
import { useResourceCategories } from '@/features/resources/hooks';
import { ErrorBoundary, ErrorMessage } from '@/shared/components/error';
import { AnimatedBackground } from '@/shared/components/ui/AnimatedBackground';
import { Accordion, AccordionItem } from '@heroui/react';
import { Icon } from '@iconify/react';

/**
 * Resources page component
 *
 * Displays resource categories in an accordion with resource cards.
 */
export default function ResourcePage() {
  const { data: categories, isLoading, error } = useResourceCategories();

  if (isLoading) {
    return <ResourcesSkeleton />;
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
      <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
        {/* Animated background */}
        <AnimatedBackground />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary mb-4">Resource Center</h1>
            <p className="text-lg text-default-600 max-w-2xl mx-auto">
              Find all the tools, guides, and resources you need to help your business thrive in our
              community.
            </p>
          </div>

          <div className="mb-12">
            <Accordion
              variant="splitted"
              selectionMode="multiple"
              defaultSelectedKeys={['getting-started']}
            >
              {categories.map((category) => (
                <AccordionItem
                  key={category.id}
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon={category.icon} className="text-xl text-primary" />
                      <span className="text-xl">{category.title}</span>
                    </div>
                  }
                  textValue={category.title}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {category.resources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
