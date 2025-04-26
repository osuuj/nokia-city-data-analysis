'use client';

import { Button, Card, CardBody, CardFooter, CardHeader, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';
import type { Project } from '../types';

/**
 * Props for the ProjectCard component
 */
interface ProjectCardProps {
  /**
   * The project data to display in the card
   */
  project: Project;
}

/**
 * ProjectCard component
 *
 * A card component that displays project information in a visually appealing way.
 * Features:
 * - Project image with hover effect
 * - Category badge with icon
 * - Featured project indicator
 * - Planning status indicator
 * - Project tags
 * - Demo and repository links
 *
 * @example
 * ```tsx
 * <ProjectCard project={projectData} />
 * ```
 */
export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const isPlanning = project.status === 'planning';
  const imageSrc = project.image || '/images/placeholder-project.jpg';

  /**
   * Mapping of project categories to their corresponding icons
   */
  const categoryIcons: Record<string, string> = useMemo(
    () => ({
      web: 'lucide:globe',
      mobile: 'lucide:smartphone',
      ai: 'lucide:brain',
      design: 'lucide:palette',
    }),
    [],
  );

  /**
   * Mapping of project categories to their corresponding colors
   */
  const categoryColors: Record<
    string,
    'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'
  > = useMemo(
    () => ({
      web: 'primary',
      mobile: 'secondary',
      ai: 'success',
      design: 'warning',
      etl: 'warning',
      api: 'secondary',
      map: 'secondary',
      analytics: 'danger',
    }),
    [],
  );

  /**
   * Handles navigation to the project detail page
   */
  const handleCardPress = useCallback(() => {
    router.push(`/project/${project.id}`);
  }, [router, project.id]);

  /**
   * Handles the demo button click
   */
  const handleDemoClick = useCallback(() => {
    // No need to prevent default or stop propagation as the Button component handles this
  }, []);

  /**
   * Handles the repository button click
   */
  const handleRepoClick = useCallback(() => {
    // No need to prevent default or stop propagation as the Button component handles this
  }, []);

  return (
    <Card
      onPress={handleCardPress}
      className={`overflow-hidden h-full relative transition-all cursor-pointer ${
        isPlanning ? 'opacity-60 grayscale pointer-events-none' : ''
      }`}
      isHoverable={!isPlanning}
      isPressable={!isPlanning}
      disableRipple
    >
      <CardHeader className="p-0 overflow-hidden h-48 relative">
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform transition-transform hover:scale-105"
            priority={project.featured}
            loading={project.featured ? 'eager' : 'lazy'}
          />
        </div>

        {project.featured && (
          <div className="absolute top-2 right-2 z-10">
            <Chip
              color="warning"
              variant="solid"
              size="sm"
              startContent={<Icon icon="lucide:star" width={16} height={16} />}
            >
              Featured
            </Chip>
          </div>
        )}

        {isPlanning && (
          <div className="absolute top-2 left-2 z-10">
            <Chip
              color="default"
              variant="flat"
              size="sm"
              startContent={<Icon icon="lucide:clock" width={16} height={16} />}
            >
              Planning
            </Chip>
          </div>
        )}
      </CardHeader>

      <CardBody className="pb-0">
        <div className="flex items-center gap-2 mb-2">
          <Chip
            color={categoryColors[project.category || ''] || 'default'}
            variant="flat"
            size="sm"
            startContent={
              <Icon
                icon={categoryIcons[project.category || ''] || 'lucide:folder'}
                width={16}
                height={16}
              />
            }
          >
            {project.category
              ? project.category.charAt(0).toUpperCase() + project.category.slice(1)
              : 'Other'}
          </Chip>
        </div>
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-default-500">{project.description}</p>

        <div className="flex flex-wrap gap-1 mt-4">
          {project.tags?.map((tag: string) => (
            <Chip key={tag} size="sm" variant="flat" color="default">
              {tag}
            </Chip>
          ))}
        </div>
      </CardBody>

      {!isPlanning && (
        <CardFooter className="flex justify-between mt-4">
          {project.demoUrl && (
            <Button
              color="primary"
              variant="flat"
              size="sm"
              as="a"
              href={project.demoUrl}
              rel="noopener noreferrer"
              onPress={handleDemoClick}
            >
              Live Demo
            </Button>
          )}
          {project.repoUrl && (
            <Button
              color="default"
              variant="light"
              size="sm"
              as="a"
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onPress={handleRepoClick}
            >
              View Code
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
});
