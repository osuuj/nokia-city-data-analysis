// ProjectDetailClient.tsx
'use client';

import { TeamMemberGrid } from '@/features/about/components';
import { AnimatedBackground } from '@/shared/components/ui';
import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ErrorMessage } from '@shared/components/error';
import { useBreadcrumb } from '@shared/context';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import type { Project } from '../types';
import { ProjectDetailHero, ProjectOverview } from './ui';

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
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
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
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            aria-labelledby="tech-stack-heading"
          >
            <h2 className="text-2xl font-semibold mb-6" id="tech-stack-heading">
              Technologies
            </h2>
            <Suspense fallback={<CardSkeleton />}>
              <TechStackShowcase tags={project.tags} />
            </Suspense>
          </motion.section>
        )}

        {/* Gallery Section - Lazy Loaded */}
        {galleryItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            aria-labelledby="gallery-heading"
          >
            <h2 className="text-2xl font-semibold mb-6" id="gallery-heading">
              Gallery
            </h2>
            <Suspense fallback={<CardSkeleton />}>
              <GalleryViewer items={galleryItems} />
            </Suspense>
          </motion.section>
        )}

        {/* Timeline Section - Lazy Loaded */}
        {project.timeline && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            aria-labelledby="timeline-heading"
          >
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
          </motion.section>
        )}

        {/* Team Section */}
        {project.team && project.team.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            aria-labelledby="team-heading"
          >
            <h2 className="text-2xl font-semibold mb-6" id="team-heading">
              Project Team
            </h2>
            <TeamMemberGrid
              team={project.team.map((name, index) => ({
                id: `team-member-${index}`,
                name,
                jobTitle: 'Team Member',
                bio: `Team member for ${project.title}`,
                portfolioLink: '#',
                avatarSrc: `/api/avatar?seed=${encodeURIComponent(name)}`,
              }))}
            />
          </motion.section>
        )}

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          aria-labelledby="cta-heading"
        >
          <Card className="border-b-1 border-divider bg-gradient-to-r from-default-100 via-primary-100 to-secondary-100 px-6 py-2">
            <CardBody className="py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2
                    className="text-2xl font-bold mb-2 text-black dark:text-white"
                    id="cta-heading"
                  >
                    Interested in this project?
                  </h2>
                  <p className="text-default-600 dark:text-gray-300">
                    Learn more about how we can help you with similar initiatives.
                  </p>
                </div>
                <Button
                  className="bg-primary text-white"
                  startContent={<Icon icon="lucide:message-circle" />}
                  href="/contact"
                  as="a"
                >
                  Get in touch
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.section>
      </div>
    </main>
  );
}
