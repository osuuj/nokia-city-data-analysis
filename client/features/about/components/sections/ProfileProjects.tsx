'use client';

import { ProjectCard } from '@/features/project/components';
import { ProjectCategory, ProjectStatus } from '@/features/project/types';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

type Project = {
  title: string;
  description: string;
  tech?: string[];
  image?: string;
  link?: string;
  subtitle?: string;
  id?: string;
  hasDemo?: boolean;
};

type ProfileProjectsProps = {
  projects: Project[];
  title?: string;
  description?: string;
  showAllLink?: boolean;
  categoryDefault?: ProjectCategory;
};

export function ProfileProjects({
  projects,
  title = 'Featured Projects',
  description = 'Explore some of my recent work',
  showAllLink = true,
  categoryDefault = ProjectCategory.Web,
}: ProfileProjectsProps) {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative text-black dark:text-white">
            {title}
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-0 h-1 bg-primary rounded"
            />
          </h2>
          <p className="text-default-600 max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const projectId = project.id || project.title.toLowerCase().replace(/\s+/g, '-');

            return (
              <ProjectCard
                key={project.title}
                project={{
                  title: project.title,
                  description: project.description,
                  subtitle: project.subtitle,
                  id: projectId,
                  status: ProjectStatus.Active,
                  category: categoryDefault,
                  tags: project.tech || [],
                  image: project.image || `/images/projects/${projectId}.webp`,
                  // Always provide demoUrl (required by schema) but use hasDemo flag to control visibility
                  demoUrl: project.link || '#',
                  hasDemo: project.hasDemo,
                  featured: index === 0,
                }}
              />
            );
          })}
        </div>

        {showAllLink && (
          <div className="flex justify-center mt-12">
            <Button
              as={Link}
              href="/projects"
              color="primary"
              variant="bordered"
              endContent={<Icon icon="lucide:arrow-right" />}
            >
              View All Projects
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
