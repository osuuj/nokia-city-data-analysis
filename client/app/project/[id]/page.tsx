'use client';

import { ProjectDetailSkeleton } from '@/features/project/components';
import ProjectDetailClient from '@/features/project/components/ProjectDetailClient';
import { useProject } from '@/features/project/hooks/useProjects';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { useEffect } from 'react';
import { use } from 'react';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const { data: project, isLoading, isError, error } = useProject(unwrappedParams.id);

  // Log any errors to help with debugging
  useEffect(() => {
    if (isError && error instanceof Error) {
      console.error('Project loading error:', error.message);
    }
  }, [isError, error]);

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ErrorMessage
          title="Error Loading Project"
          message={
            error instanceof Error
              ? error.message
              : 'There was an error loading the project details. Please try again later.'
          }
          error={error}
        />
      </div>
    );
  }

  if (isLoading || !project) {
    return <ProjectDetailSkeleton />;
  }

  return (
    <div className="w-full overflow-x-hidden px-0">
      <ProjectDetailClient project={project} />
    </div>
  );
}
