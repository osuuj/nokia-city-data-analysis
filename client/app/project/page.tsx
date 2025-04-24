'use client';

import { ProjectCard } from '@/features/project/components/ProjectCard';
import { AnimatedProjectHero } from '@/features/project/components/hero';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { projectsData } from '@/types/project';
import { Button, Card, CardBody, Link } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function ProjectPage() {
  const currentProjects = projectsData;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <AnimatedBackground />
      {/* 🔥 Hero Section */}
      <AnimatedProjectHero />

      {/* 🧱 Projects Grid */}
      {currentProjects.length > 0 ? (
        <div className="flex justify-center">
          <div
            className={`
              grid gap-6 mb-2 max-w-5xl
              grid-cols-1
              ${currentProjects.length === 2 ? 'sm:grid-cols-2 justify-center' : ''}
              ${currentProjects.length >= 3 ? 'lg:grid-cols-3' : ''}
            `}
          >
            {currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      ) : (
        <Card className="w-full py-12">
          <CardBody className="flex flex-col items-center justify-center">
            <Icon icon="lucide:search-x" width={48} className="text-default-300 mb-4" />
            <h3 className="text-xl font-medium">No projects found</h3>
            <p className="text-default-500 text-center mt-2">
              Try adjusting your search or filter criteria
            </p>
            <Button color="primary" variant="flat" className="mt-4" onPress={() => {}}>
              Clear filters
            </Button>
          </CardBody>
        </Card>
      )}

      {/* 📣 Call to Action */}
      <Card className="mt-6 border-b-1 border-divider bg-gradient-to-r from-default-100 via-danger-100 to-secondary-100 px-6 py-2 sm:px-3.5 sm:before:flex-1">
        <CardBody className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">
                Have a project idea?
              </h3>
              <p className="text-default-600 dark:text-gray-300">
                We're always looking for new challenges and collaborations.
              </p>
            </div>
            <Button
              as={Link}
              className="group relative h-9 overflow-hidden bg-transparent text-small font-normal"
              color="default"
              endContent={
                <Icon
                  className="flex-none outline-none transition-transform group-data-[hover=true]:translate-x-0.5 [&>path]:stroke-[2]"
                  icon="solar:arrow-right-linear"
                  width={16}
                />
              }
              href="/contact"
              style={{
                border: 'solid 2px transparent',
                backgroundImage:
                  'linear-gradient(hsl(var(--heroui-background)), hsl(var(--heroui-background))), linear-gradient(to right, #F871A0, #9353D3)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
              variant="bordered"
            >
              Contact Us
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
