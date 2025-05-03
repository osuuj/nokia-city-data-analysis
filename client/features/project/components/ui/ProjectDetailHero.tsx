import { Badge } from '@heroui/react';
import { useState } from 'react';
import type { Project } from '../../types';

interface ProjectDetailHeroProps {
  project: Project;
}

/**
 * ProjectDetailHero component
 *
 * Displays the hero section of a project detail page with image, title, and status.
 */
export const ProjectDetailHero = ({ project }: ProjectDetailHeroProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
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
  );
};
