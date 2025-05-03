import { z } from 'zod';
import { ProjectCategory, ProjectStatus } from './enums';

/**
 * Zod schemas for project data validation
 *
 * These schemas are used to validate project data at runtime,
 * ensuring type safety and data integrity.
 */

// Gallery item schema
export const GalleryItemSchema = z.object({
  src: z.string().url(),
  alt: z.string().min(1),
  caption: z.string().optional(),
});

// Project schema
export const ProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().min(1),
  image: z.string().url(),
  gallery: z.array(GalleryItemSchema).optional(),
  category: z.nativeEnum(ProjectCategory),
  tags: z.array(z.string()).min(1),
  goals: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  role: z.string().optional(),
  team: z.array(z.string()).optional(),
  demoUrl: z.string().url(),
  repoUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
  status: z.nativeEnum(ProjectStatus).optional().default(ProjectStatus.Active),
});

// Project card props schema
export const ProjectCardPropsSchema = z.object({
  project: ProjectSchema,
});

// Projects data schema
export const ProjectsDataSchema = z.array(ProjectSchema);

/**
 * Type inference from Zod schemas
 *
 * These types are derived from the Zod schemas and can be used
 * throughout the application to ensure type safety.
 */
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectCardProps = z.infer<typeof ProjectCardPropsSchema>;
export type ProjectsData = z.infer<typeof ProjectsDataSchema>;

/**
 * Validation functions
 *
 * These functions can be used to validate data at runtime.
 */
export const validateProject = (data: unknown): Project => {
  return ProjectSchema.parse(data);
};

export const validateProjects = (data: unknown): ProjectsData => {
  return ProjectsDataSchema.parse(data);
};

export const validateProjectCardProps = (data: unknown): ProjectCardProps => {
  return ProjectCardPropsSchema.parse(data);
};
