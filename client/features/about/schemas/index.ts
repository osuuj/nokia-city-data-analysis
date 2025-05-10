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
  category: z.enum(['frontend', 'backend', 'devops', 'design', 'other']).optional(),
  yearsOfExperience: z.number().optional(),
});

const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  image: z.string(),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
});

const experienceSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  period: z.string(),
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
  gpa: z.number().optional(),
});

// TeamMember schema
const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  avatar: z.string(),
  email: z.string().email(),
  social: socialSchema.optional(),
  skills: z.array(z.string()),
  projects: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
});

// TeamMemberProfile schema
const teamMemberProfileSchema = z.object({
  member: teamMemberSchema,
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
});

// API response schemas
export const profileResponseSchema = z.object({
  success: z.boolean(),
  data: teamMemberProfileSchema,
});

export const profilesListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(teamMemberProfileSchema),
});

// TypeScript types derived from Zod schemas
export type TeamMemberProfile = z.infer<typeof teamMemberProfileSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ProfilesListResponse = z.infer<typeof profilesListResponseSchema>;
