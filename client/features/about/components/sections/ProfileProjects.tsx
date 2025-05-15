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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
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
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={{
                title: project.title,
                description: project.description,
                subtitle: project.subtitle,
                id: project.title.toLowerCase().replace(/\s+/g, '-'),
                status: ProjectStatus.Active,
                category: categoryDefault,
                tags: project.tech || [],
                image:
                  project.image ||
                  `https://img.heroui.chat/image/project?w=600&h=400&u=${project.title}`,
                demoUrl: project.link || '#',
                featured: index === 0,
              }}
            />
          ))}
        </div>

        {showAllLink && (
          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Button
                as={Link}
                href="/projects"
                color="primary"
                variant="ghost"
                size="lg"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                View All Projects
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
