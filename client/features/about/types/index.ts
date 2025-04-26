/**
 * About Types
 *
 * This file exports all types for the about feature.
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  skills: string[];
  projects: string[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
}

export interface Skill {
  name: string;
  level: number;
  category?: 'frontend' | 'backend' | 'devops' | 'design' | 'other';
  yearsOfExperience?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  url?: string;
  github?: string;
  startDate: string;
  endDate?: string;
}

export interface Experience {
  id?: string;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies?: string[];
  achievements?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  gpa?: number;
}

export interface TeamMemberProfile {
  member: TeamMember;
  skills: Skill[];
  projects: Project[];
  experience?: Experience[];
  education?: Education[];
}

export interface ProfilePageProps {
  id: string;
}

export interface ProfileHeaderProps {
  member: TeamMember;
}

export interface SkillsSectionProps {
  skills: Skill[];
  title?: string;
}

export interface ProjectsSectionProps {
  projects: Project[];
  title?: string;
}

export interface ExperienceSectionProps {
  experiences: Experience[];
  title?: string;
}

export interface EducationSectionProps {
  education: Education[];
  title?: string;
}
