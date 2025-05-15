'use client';

import { ProjectErrorBoundary } from '@/features/project/components';
import { AnimatedProjectHero } from '@/features/project/components/hero';
import { useProjects } from '@/features/project/hooks/useProjects';
import { ErrorMessage } from '@/shared/components/error';
import { StandardFallback } from '@/shared/components/loading';
import { AnimatedBackground } from '@/shared/components/ui';
import { Button, Card, CardBody, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { Suspense, lazy, useState } from 'react';

// Lazy load the ProjectCard component for code splitting
const ProjectCard = lazy(() =>
  import('@/features/project/components/ProjectCard').then((module) => ({
    default: module.ProjectCard,
  })),
);

/**
 * Project page component displaying a grid of projects.
 * This page shows all available projects with loading states and error handling.
 *
 * @returns {JSX.Element} The rendered project page component
 */
export default function ProjectPage(): JSX.Element {
  const { data: projects = [], isLoading, isError, error } = useProjects();
  const router = useRouter();
  const [showEmptyState, setShowEmptyState] = useState(projects.length === 0);

  // Function to handle resetting filters
  const handleClearFilters = () => {
    // For demonstration, simply refresh the page to clear any URL params
    // In a real app, we would reset filter state and refetch data
    router.refresh();
    setShowEmptyState(false);
  };

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ErrorMessage
          title="Error Loading Projects"
          message="There was an error loading the projects. Please try again later."
          error={error}
        />
      </div>
    );
  }

  return (
    <ProjectErrorBoundary>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated background */}
        <AnimatedBackground />

        {/* 🔥 Hero Section */}
        <Suspense fallback={<StandardFallback text="Loading project hero..." fullHeight={false} />}>
          <AnimatedProjectHero />
        </Suspense>

        {/* 🧱 Projects Grid */}
        <Suspense fallback={<StandardFallback text="Loading projects..." />}>
          {isLoading ? (
            <StandardFallback text="Loading projects..." />
          ) : projects.length > 0 || !showEmptyState ? (
            <div className="flex justify-center">
              <div
                className={`
                  grid gap-6 mb-2 max-w-5xl
                  grid-cols-1
                  ${projects.length === 2 ? 'sm:grid-cols-2 justify-center' : ''}
                  ${projects.length >= 3 ? 'lg:grid-cols-3' : ''}
                `}
              >
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          ) : (
            <Card className="w-full py-12 mb-8">
              <CardBody className="flex flex-col items-center justify-center">
                <Icon icon="lucide:search-x" width={48} className="text-default-300 mb-4" />
                <h3 className="text-xl font-medium">No projects found</h3>
                <p className="text-default-500 text-center mt-2 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Icon icon="lucide:x-circle" />}
                  className="mt-2 px-6"
                  onPress={handleClearFilters}
                >
                  Clear filters
                </Button>
              </CardBody>
            </Card>
          )}
        </Suspense>

        {/* 📣 Call to Action */}
        <Card className="mt-10 shadow-lg border-b-1 border-divider bg-gradient-to-r from-default-100 via-danger-50 to-secondary-100 px-6 rounded-xl overflow-hidden">
          <CardBody className="py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                  Have a project idea?
                </h3>
                <p className="text-default-600 dark:text-gray-300 max-w-lg">
                  We're always looking for new challenges and collaborations. Reach out to discuss
                  how we can bring your data visualization project to life.
                </p>
              </div>
              <Button
                as={Link}
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg transition-all duration-300"
                endContent={
                  <Icon
                    className="flex-none outline-none transition-transform group-data-[hover=true]:translate-x-1 [&>path]:stroke-[2]"
                    icon="solar:arrow-right-linear"
                    width={20}
                  />
                }
                href="/contact"
              >
                Get in touch
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </ProjectErrorBoundary>
  );
}
