import ProjectDetailClient from '@/components/layout/project/ProjectDetailClient';
import { projectsData } from '@/types/project';
import { notFound } from 'next/navigation';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = projectsData.find((p) => p.id === params.id);
  if (!project) return notFound();

  return <ProjectDetailClient project={project} />;
}
