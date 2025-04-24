'use client';

import { Button, Card, CardBody, CardFooter, CardHeader, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import type { ProjectCardProps } from '../types';

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const router = useRouter();
  const isPlanning = project.status === 'planning';

  const categoryIcons: Record<string, string> = {
    web: 'lucide:globe',
    mobile: 'lucide:smartphone',
    ai: 'lucide:brain',
    design: 'lucide:palette',
  };

  const categoryColors: Record<
    string,
    'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'
  > = {
    web: 'primary',
    mobile: 'secondary',
    ai: 'success',
    design: 'warning',
    etl: 'warning',
    api: 'secondary',
    map: 'secondary', // Changed from 'info' to 'secondary' to match allowed types
    analytics: 'danger',
  };

  return (
    <Card
      onPress={() => router.push(`/project/${project.id}`)}
      className={`overflow-hidden h-full relative transition-all cursor-pointer ${
        isPlanning ? 'opacity-60 grayscale pointer-events-none' : ''
      }`}
      isHoverable={!isPlanning}
      isPressable={!isPlanning}
      disableRipple
    >
      <CardHeader className="p-0 overflow-hidden h-48 relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform transition-transform hover:scale-105"
        />

        {project.featured && (
          <div className="absolute top-2 right-2">
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
          <div className="absolute top-2 left-2">
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
            color={categoryColors[project.category] || 'default'}
            variant="flat"
            size="sm"
            startContent={
              <Icon
                icon={categoryIcons[project.category] || 'lucide:folder'}
                width={16}
                height={16}
              />
            }
          >
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </Chip>
        </div>
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-default-500">{project.description}</p>

        <div className="flex flex-wrap gap-1 mt-4">
          {project.tags.map((tag) => (
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
            >
              View Code
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
