// ProjectDetailClient.tsx
'use client';

import { AnimatedBackground } from '@/shared/components/ui';
import { ErrorMessage } from '@shared/components/error';
import { useBreadcrumb } from '@shared/context';
import { useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import type { Project } from '../types';
import { ProjectCallToAction, ProjectDetailHero, ProjectOverview, ProjectTeamSection } from './ui';

// Loading placeholder component
const CardSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

// Dynamically import components with loading fallbacks
const GalleryViewer = dynamic(() => import('./ui/GalleryViewer'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

const TechStackShowcase = dynamic(() => import('./ui/TechStackShowcase'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

const TimelineSection = dynamic(() => import('./ui/TimelineSection'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

interface ProjectDetailClientProps {
  project: Project;
}

/**
 * ProjectDetailClient component
 *
 * Displays the entire project detail page with various sections.
 * Uses code splitting to optimize loading.
 */
export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { scrollYProgress } = useScroll();
  const { setCurrentPageTitle } = useBreadcrumb();
  const [isLoading, setIsLoading] = useState(true);

  // Set page title and prefetch components
  useEffect(() => {
    const prefetchComponents = async () => {
      // Prefetch all dynamic components
      const components = [
        import('./ui/GalleryViewer'),
        import('./ui/TechStackShowcase'),
        import('./ui/TimelineSection'),
      ];
      await Promise.all(components);
      setIsLoading(false);
    };

    prefetchComponents();
    setCurrentPageTitle(project.title);
  }, [project.title, setCurrentPageTitle]);

  if (!project) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ErrorMessage
          title="Project Not Found"
          message="The requested project could not be found. Please check the URL and try again."
        />
      </div>
    );
  }

  // Ensure gallery is properly typed
  const galleryItems = project.gallery || [];

  return (
    <main
      className="relative min-h-screen bg-background text-foreground pb-24 w-full overflow-x-hidden"
      aria-label="Project details"
    >
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Hero Section */}
      <ProjectDetailHero project={project} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-8">
        {/* Overview Section */}
        <ProjectOverview project={project} />

        {/* Tech Stack Section - Lazy Loaded */}
        {project.tags && project.tags.length > 0 && (
          <section aria-labelledby="tech-stack-heading" className="tech-stack-section">
            <h2 className="text-2xl font-semibold mb-6" id="tech-stack-heading">
              Technologies
            </h2>
            <Suspense fallback={<CardSkeleton />}>
              <TechStackShowcase tags={project.tags} />
            </Suspense>
          </section>
        )}

        {/* Gallery Section - Lazy Loaded */}
        {galleryItems.length > 0 && (
          <section aria-labelledby="gallery-heading" className="gallery-section">
            <h2 className="text-2xl font-semibold mb-6" id="gallery-heading">
              Gallery
            </h2>
            <Suspense fallback={<CardSkeleton />}>
              <GalleryViewer items={galleryItems} />
            </Suspense>
          </section>
        )}

        {/* Timeline Section - Lazy Loaded */}
        {project.timeline && (
          <section aria-labelledby="timeline-heading" className="timeline-section">
            <h2 className="text-2xl font-semibold mb-6" id="timeline-heading">
              Project Timeline
            </h2>
            <Suspense fallback={<CardSkeleton />}>
              <TimelineSection
                timeline={
                  typeof project.timeline === 'string'
                    ? project.timeline
                    : JSON.stringify(project.timeline)
                }
              />
            </Suspense>
          </section>
        )}

        {/* Team Section */}
        <ProjectTeamSection
          team={project.team || []}
          projectTitle={project.title}
          isLoading={isLoading}
        />

        {/* Call to Action */}
        <ProjectCallToAction isLoading={isLoading} />
      </div>
    </main>
  );
}
