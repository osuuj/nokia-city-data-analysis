'use client';

import { useAnimationProps } from '@/shared/hooks';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import type { Project } from '../types';
import { formatCategoryName, getCategoryColor, getCategoryIcon } from '../utils/categoryUtils';

/**
 * Props for the ProjectCard component
 */
interface ProjectCardProps {
  /**
   * The project data to display in the card
   */
  project: Project & {
    /**
     * Flag to indicate if the project has a live demo available
     */
    hasDemo?: boolean;
  };
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
  const showDemoButton = project.hasDemo !== false;

  /**
   * Handles navigation to the project detail page
   */
  const handleCardPress = useCallback(() => {
    // Check if project has an external link (starting with http)
    if (project.demoUrl?.startsWith('http')) {
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(`/project/${project.id}`);
    }
  }, [router, project.id, project.demoUrl]);

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
            priority
            loading="eager"
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
            color={getCategoryColor(project.category || '')}
            variant="flat"
            size="sm"
            startContent={
              <Icon icon={getCategoryIcon(project.category || '')} width={16} height={16} />
            }
          >
            {formatCategoryName(project.category || 'Other')}
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
          {showDemoButton && project.demoUrl && (
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
