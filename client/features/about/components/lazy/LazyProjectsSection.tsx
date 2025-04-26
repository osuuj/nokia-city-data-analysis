'use client';

import { Button, Card, CardBody, CardFooter, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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

// Memoized project card component to prevent unnecessary re-renders
const ProjectCard = memo(({ project, index }: { project: Project; index: number }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="backdrop-blur-md bg-opacity-90 h-full" isPressable isHoverable>
        <CardBody>
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-default-600 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech: string) => (
              <Chip key={tech} size="sm" variant="flat" color="primary">
                {tech}
              </Chip>
            ))}
          </div>
        </CardBody>
        <CardFooter className="justify-between">
          <Button
            as={Link}
            href={project.url || project.github || '#'}
            color="primary"
            variant="flat"
            size="sm"
            endContent={<Icon icon="mdi:arrow-right" />}
          >
            View Project
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const LazyProjectsSection = ({ projects, title = 'Featured Projects' }: ProjectsSectionProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="mb-8"
      aria-labelledby="projects-title"
    >
      <h2 id="projects-title" className="text-2xl font-semibold mb-6">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default memo(LazyProjectsSection);
