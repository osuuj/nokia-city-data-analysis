import ProjectDetailClient from '@/components/layout/project/ProjectDetailClient';
import { projectsData } from '@/types/project';
import { notFound } from 'next/navigation';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  // First await the params to ensure they are ready
  const id = await Promise.resolve(params.id);

  // Then use the awaited id to find the project
  const project = projectsData.find((p) => p.id === id);
  if (!project) return notFound();

  return <ProjectDetailClient project={project} />;
}
