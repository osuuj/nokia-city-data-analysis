// ProjectDetailClient.tsx
'use client';

import TimelineSection from '@/components/features/project/TimelineSection';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import TeamMemberGrid from '@/components/ui/TeamMemberGrid';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import GalleryViewer from '@/features/project/components/GalleryViewer';
import TechStackShowcase from '@/features/project/components/TechStackShowcase';
import type { Project } from '@/types/project';
import { projectsData } from '@/types/project';
import { Badge, Button, Card, CardBody, Divider, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project: { id } }: ProjectDetailClientProps) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const { setCurrentPageTitle } = useBreadcrumb();

  // Find the project data
  const project = projectsData.find((p: Project) => p.id === id);
  if (!project) return null;

  // Set the current page title for breadcrumbs
  useEffect(() => {
    setCurrentPageTitle(project.title);
  }, [project.title, setCurrentPageTitle]);

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

      {/* Hero */}
      <header className="relative h-[40vh] overflow-hidden" aria-label="Project hero image">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover scale-110"
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
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          role="region"
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
                    aria-label={`Timeline: ${project.timeline}`}
                  >
                    <Icon icon="lucide:calendar" aria-hidden="true" />
                    <span>{project.timeline}</span>
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
        </motion.div>

        {/* Gallery */}
        <motion.section
          id="gallery"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
          role="region"
          aria-labelledby="gallery-heading"
        >
          <h2 className="text-2xl font-bold mb-6" id="gallery-heading">
            Project Gallery
          </h2>
          <GalleryViewer
            gallery={gallery}
            projectTitle={project.title}
            aria-labelledby="gallery-heading"
          />
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          id="tech"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          role="region"
          aria-labelledby="tech-heading"
        >
          <h2 className="text-2xl font-bold mb-6 text-center" id="tech-heading">
            Technologies Used
          </h2>
          <TechStackShowcase tags={project.tags} aria-labelledby="tech-heading" />
        </motion.section>

        {/* Timeline */}
        {project.timeline && (
          <motion.section
            id="timeline"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            role="region"
            aria-labelledby="timeline-heading"
          >
            <h2 className="text-2xl font-bold mb-6 text-center" id="timeline-heading">
              Project Timeline
            </h2>
            <TimelineSection timeline={project.timeline} aria-labelledby="timeline-heading" />
          </motion.section>
        )}

        {/* Team */}
        {project.team && project.team.length > 0 && (
          <motion.section
            id="team"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            role="region"
            aria-labelledby="team-heading"
          >
            <h2 className="text-2xl font-bold mb-6 text-center" id="team-heading">
              Team Members
            </h2>
            <TeamMemberGrid
              team={project.team.map((member) => ({
                name: member,
                jobTitle: 'Team Member',
                bio: '',
                portfolioLink: '#',
                avatarSrc: `https://img.heroui.chat/image/avatar?w=200&h=200&u=${member}`,
              }))}
              aria-labelledby="team-heading"
            />
          </motion.section>
        )}

        {/* CTA Buttons */}
        {(project.demoUrl || project.repoUrl) && (
          <section className="flex justify-center gap-4" aria-label="Project actions">
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
          </section>
        )}
      </div>
    </main>
  );
}
