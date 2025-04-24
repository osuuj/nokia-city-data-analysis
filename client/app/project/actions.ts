'use server';

import { projectsData } from '@/features/project/types';

export async function getProjectById(id: string) {
  // Simulate a database call with artificial delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return projectsData.find((p) => p.id === id) || null;
}
