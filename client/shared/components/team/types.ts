/**
 * Team Component Types
 *
 * This file contains TypeScript types for the team components.
 */

export interface Achievement {
  title: string;
  description: string;
  date: string;
  icon?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  jobTitle: string;
  bio: string;
  shortBio?: string;
  portfolioLink: string;
  avatarSrc: string;
  skills?: string[];
  socialLinks?: SocialLinks;
  projects?: string[]; // References to project IDs
  achievements?: Achievement[];
  role?: string;
  department?: string;
  joinDate?: string;
  location?: string;
  languages?: string[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
}

export interface TeamMemberCardProps {
  member?: Partial<TeamMember> & { name: string }; // Make member optional
  name?: string;
  jobTitle?: string;
  bio?: string;
  shortBio?: string;
  portfolioLink?: string;
  avatarSrc?: string;
  skills?: string[];
  socialLinks?: SocialLinks;
}
