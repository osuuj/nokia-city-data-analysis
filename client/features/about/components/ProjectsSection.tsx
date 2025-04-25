import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  title?: string;
}

export default function ProjectsSection({
  projects,
  title = 'Featured Projects',
}: ProjectsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Card key={project.title} className="backdrop-blur-md bg-opacity-90">
            <CardBody>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-default-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <Button
                as={Link}
                href={project.link}
                color="primary"
                variant="flat"
                size="sm"
                endContent={<Icon icon="mdi:arrow-right" />}
              >
                View Project
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
