import { z } from 'zod';

// Base schemas for nested objects
const socialSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
});

const skillSchema = z.object({
  name: z.string(),
  level: z.number().min(0).max(100),
  category: z.string(),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  url: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  image: z.string().optional(),
});

const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string(),
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
});

const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

// Main profile schema
export const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  avatar: z.string(),
  email: z.string().email(),
  social: socialSchema.optional(),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
});

// API response schemas
export const profileResponseSchema = z.object({
  success: z.boolean(),
  data: profileSchema,
});

export const profilesListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(profileSchema),
});

// TypeScript types derived from Zod schemas
export type TeamMemberProfile = z.infer<typeof profileSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ProfilesListResponse = z.infer<typeof profilesListResponseSchema>;
