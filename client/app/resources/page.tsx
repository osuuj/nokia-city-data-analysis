'use client';

import { ResourceAccordion } from '@/features/resources/components/ResourceAccordion';
import { useResourceCategories } from '@/features/resources/hooks/useResources';
import type { ResourceCategoryData } from '@/features/resources/types';
import { ErrorMessage } from '@/shared/components/error';
import { Spinner } from '@heroui/react';

export default function ResourcesPage() {
  const { data: categories, isLoading, error } = useResourceCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !categories) {
    return (
      <div className="container mx-auto px-4">
        <ErrorMessage
          title="Failed to Load Resources"
          message="We couldn't load the resources at this time. Please try again later."
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-2">Resources</h1>
        <p className="text-gray-600 mb-8">
          Explore our collection of resources to help you get started with the project.
        </p>

        <div className="space-y-6">
          {categories.map((category: ResourceCategoryData) => (
            <ResourceAccordion key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
