// ProjectDetailClient.tsx
'use client';

import { TeamMemberGrid } from '@/features/about/components/team';
import { AnimatedBackground } from '@/shared/components/ui';
import { Badge, Button, Card, CardBody, Divider, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ErrorMessage } from '@shared/components/error';
import { useBreadcrumb } from '@shared/context';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import type { Project } from '../types';

// Loading components for better UX
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
const GalleryViewer = dynamic(
  () =>
    import('../components/ui/GalleryViewer').then((mod) => {
      // Artificial delay removal
      return mod;
    }),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  },
);

const TechStackShowcase = dynamic(() => import('../components/ui/TechStackShowcase'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

const TimelineSection = dynamic(() => import('../components/ui/TimelineSection'), {
  loading: () => <CardSkeleton />,
  ssr: false,
});

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const { setCurrentPageTitle } = useBreadcrumb();
  const [isLoading, setIsLoading] = useState(true);

  // Prefetch and setup
  useEffect(() => {
    const prefetchComponents = async () => {
      // Prefetch all dynamic components
      const components = [
        import('../components/ui/GalleryViewer'),
        import('../components/ui/TechStackShowcase'),
        import('../components/ui/TimelineSection'),
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
  const gallery =
    project.gallery?.map((item) => ({
      src: item.src,
      alt: item.alt,
      caption: item.caption,
    })) || [];

  const progressValue = project.status === 'active' ? 95 : 25;

  return (
    <main
      className="relative min-h-screen bg-background text-foreground pb-24 w-full overflow-x-hidden"
      aria-label="Project details"
    >
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Hero Section - Preloaded */}
      <header className="relative h-[40vh] overflow-hidden" aria-label="Project hero image">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover scale-110"
            loading="eager"
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
          <Badge
            color={project.status === 'active' ? 'success' : 'default'}
            variant="solid"
            className="mb-4"
            aria-label={`Project status: ${project.status === 'active' ? 'Active' : 'In Planning'}`}
          >
            {project.status === 'active' ? 'Active Project' : 'In Planning'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
          {project.subtitle && (
            <p className="mt-2 text-lg md:text-xl text-default-300 max-w-2xl">{project.subtitle}</p>
          )}
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-8">
        {/* Overview Section - Always Rendered */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          aria-labelledby="overview-heading"
        >
          <Card shadow="lg">
            <CardBody className="space-y-6 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold" id="overview-heading">
                  Overview
                </h2>
                {project.timeline && (
                  <div
                    className="flex items-center gap-2 text-default-500"
                    aria-label={`Timeline: ${typeof project.timeline === 'string' ? project.timeline : 'Project Timeline'}`}
                  >
                    <Icon icon="lucide:calendar" aria-hidden="true" />
                    <span>
                      {typeof project.timeline === 'string' ? project.timeline : 'Project Timeline'}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-default-600 dark:text-default-400">{project.description}</p>

              {project.goals && (
                <>
                  <Divider />
                  <section aria-labelledby="goals-heading">
                    <h3 className="text-lg font-medium mb-2" id="goals-heading">
                      Key Goals
                    </h3>
                    <ul className="list-disc list-inside text-default-500 space-y-1">
                      {project.goals.map((goal) => (
                        <li
                          key={`goal-${goal.substring(0, 20)}`}
                          id={`goal-${goal.substring(0, 20)}`}
                        >
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}

              <section aria-labelledby="progress-heading">
                <p className="text-sm font-medium mb-1 text-default-500" id="progress-heading">
                  Progress
                </p>
                <Progress
                  value={progressValue}
                  color={project.status === 'active' ? 'success' : 'default'}
                  size="md"
                  aria-label={`Project progress: ${progressValue}%`}
                />
              </section>
            </CardBody>
          </Card>
        </motion.section>

        {/* Lazy Loaded Sections */}
        <Suspense fallback={<CardSkeleton />}>
          {/* Gallery Section */}
          {project.gallery && project.gallery.length > 0 && (
            <motion.section
              id="gallery"
              aria-labelledby="gallery-heading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 id="gallery-heading" className="text-2xl font-bold mb-6">
                Project Gallery
              </h2>
              <GalleryViewer items={project.gallery} className="w-full" />
            </motion.section>
          )}

          {/* Tech Stack Section */}
          {project.tags && project.tags.length > 0 && (
            <motion.section
              id="tech-stack"
              aria-labelledby="tech-stack-heading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 id="tech-stack-heading" className="text-2xl font-bold mb-6">
                Technologies Used
              </h2>
              <TechStackShowcase tags={project.tags} />
            </motion.section>
          )}

          {/* Team Section */}
          {project.team && project.team.length > 0 && (
            <motion.section
              id="team"
              aria-labelledby="team-heading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 id="team-heading" className="text-2xl font-bold mb-6">
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
        </Suspense>

        {/* CTA Section - Always Rendered */}
        {(project.demoUrl || project.repoUrl) && (
          <motion.section
            className="flex justify-center gap-4"
            aria-label="Project actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {project.demoUrl && (
              <Button
                as="a"
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="solid"
                size="lg"
                endContent={<Icon icon="lucide:external-link" aria-hidden="true" />}
                aria-label="View live demo"
              >
                Live Demo
              </Button>
            )}
            {project.repoUrl && (
              <Button
                as="a"
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="default"
                variant="bordered"
                size="lg"
                endContent={<Icon icon="lucide:github" aria-hidden="true" />}
                aria-label="View source code on GitHub"
              >
                View Code
              </Button>
            )}
          </motion.section>
        )}
      </div>
    </main>
  );
}
