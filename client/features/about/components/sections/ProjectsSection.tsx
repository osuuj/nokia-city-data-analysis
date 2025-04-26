'use client';

import { Button, Card, CardBody, CardFooter, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { memo } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Project, ProjectsSectionProps } from '../../types';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Formats a date range for display
 * @param startDate - The start date of the project
 * @param endDate - The end date of the project (optional)
 * @returns Formatted date range string
 */
const formatDateRange = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate);
  const formattedStart = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  if (!endDate) {
    return `${formattedStart} - Present`;
  }

  const end = new Date(endDate);
  const formattedEnd = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${formattedStart} - ${formattedEnd}`;
};

/**
 * ProjectCard component displays a single project with its details
 */
const ProjectCard = memo(({ project }: { project: Project }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
    >
      <div className="aspect-video w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          width={400}
          height={225}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDateRange(project.startDate, project.endDate)}
          </span>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Chip key={tech} size="sm" variant="flat">
              {tech}
            </Chip>
          ))}
        </div>
        <div className="flex gap-4">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Icon icon="lucide:external-link" className="h-4 w-4" />
              View Project
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Icon icon="lucide:github" className="h-4 w-4" />
              View Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

/**
 * ProjectsSection component displays a grid of project cards
 * @param projects - Array of projects to display
 * @param title - Optional section title
 */
export const ProjectsSection = memo(({ projects, title = 'Projects' }: ProjectsSectionProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8 text-3xl font-bold text-center"
        >
          {title}
        </motion.h2>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';
