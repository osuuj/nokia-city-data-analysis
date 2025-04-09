// ProjectDetailClient.tsx
'use client';

import GalleryViewer from '@/components/ui/project/GalleryViewer';
import TeamMemberCards from '@/components/ui/project/TeamMemberCards';
import TechStackShowcase from '@/components/ui/project/TechStackShowcase';
import TimelineSection from '@/components/ui/project/TimelineSection';
import type { Project } from '@/types/project';
import { Badge, Button, Card, CardBody, Divider, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function ProjectDetailClient({ project }: { project: Project }) {
  const progressValue = project.status === 'active' ? 75 : 25;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10" />
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
          <Badge
            color={project.status === 'active' ? 'success' : 'default'}
            variant="solid"
            className="mb-4"
          >
            {project.status === 'active' ? 'Active Project' : 'In Planning'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
          {project.subtitle && (
            <p className="mt-2 text-lg md:text-xl text-default-300 max-w-2xl">{project.subtitle}</p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-16">
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card shadow="lg">
            <CardBody className="space-y-6 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Overview</h2>
                {project.timeline && (
                  <div className="flex items-center gap-2 text-default-500">
                    <Icon icon="lucide:calendar" />
                    <span>{project.timeline}</span>
                  </div>
                )}
              </div>

              <p className="text-default-600 dark:text-default-400">{project.description}</p>

              {project.goals && (
                <>
                  <Divider />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Goals</h3>
                    <ul className="list-disc list-inside text-default-500 space-y-1">
                      {project.goals.map((goal) => (
                        <li key={goal}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div>
                <p className="text-sm font-medium mb-1 text-default-500">Progress</p>
                <Progress
                  value={progressValue}
                  color={project.status === 'active' ? 'success' : 'default'}
                  size="md"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Gallery */}
        <motion.section
          id="gallery"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Gallery</h2>
          <GalleryViewer gallery={project.gallery || []} projectTitle={project.title} />
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          id="tech"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Technologies Used</h2>
          <TechStackShowcase tags={project.tags} />
        </motion.section>

        {/* Timeline */}
        {project.timeline && (
          <motion.section
            id="timeline"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Project Timeline</h2>
            <TimelineSection timeline={project.timeline} />
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
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Team Members</h2>
            <TeamMemberCards team={project.team} />
          </motion.section>
        )}

        {/* CTA Buttons */}
        {(project.demoUrl || project.repoUrl) && (
          <div className="flex justify-center gap-4">
            {project.demoUrl && (
              <Button
                as="a"
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="solid"
                size="lg"
                endContent={<Icon icon="lucide:external-link" />}
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
                endContent={<Icon icon="lucide:github" />}
              >
                View Code
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
