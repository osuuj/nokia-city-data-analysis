'use client';

import ProjectDetailClient from '@/components/layout/project/ProjectDetailClient';
import { projectsData } from '@/types/project';
import { notFound, useRouter } from 'next/navigation';
import React from 'react';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const project = projectsData.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <p className="text-default-600 mb-6">The project you are looking for does not exist.</p>
        <button
          type="button"
          onClick={() => router.push('/project')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden px-0">
      <ProjectDetailClient project={project} />
    </div>
  );
}
