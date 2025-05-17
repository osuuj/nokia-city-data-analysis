/**
 * Type definitions for team members and profiles in the About feature
 */

/**
 * Represents a skill with a name and proficiency level
 */
export interface Skill {
  /**
   * The name of the skill
   */
  name: string;

  /**
   * The proficiency level (0-100)
   */
  level: number;
}

/**
 * Represents an education item in the About feature
 */
export interface Education {
  /**
   * Unique identifier for the education item
   */
  id: string;

  /**
   * Degree or certification name
   */
  degree: string;

  /**
   * Institution name
   */
  institution: string;

  /**
   * Year or date range of education
   */
  year: string;

  /**
   * Optional description of the education
   */
  description?: string;
}

/**
 * Represents a work experience item in the About feature
 */
export interface Experience {
  /**
   * Unique identifier for the experience item
   */
  id?: string;

  /**
   * Job title
   */
  title: string;

  /**
   * Company name
   */
  company: string;

  /**
   * Year or date range of employment
   */
  year: string;

  /**
   * Description of responsibilities and achievements
   */
  description: string;
}

/**
 * Represents a project in the About feature
 */
export interface Project {
  /**
   * Unique identifier for the project
   */
  id?: string;

  /**
   * Project title
   */
  title: string;

  /**
   * Project description
   */
  description: string;

  /**
   * Technologies used in the project
   */
  tech: string[];

  /**
   * URL to project image
   */
  image: string;

  /**
   * URL to project page or demo
   */
  link: string;
}

/**
 * Represents an achievement in the About feature
 */
export interface Achievement {
  /**
   * Achievement title
   */
  title: string;

  /**
   * Achievement description
   */
  description: string;

  /**
   * Date or year of the achievement
   */
  date: string;
}

/**
 * Represents a team member in the About feature
 */
export interface TeamMember {
  /**
   * Unique identifier for the team member
   */
  id: string;

  /**
   * The name of the team member
   */
  name: string;

  /**
   * The job title or role of the team member
   */
  jobTitle?: string;

  /**
   * The title or role of the team member (alternative to jobTitle)
   */
  title?: string;

  /**
   * URL to the team member's avatar image
   */
  avatarUrl?: string;

  /**
   * Alternative URL to the team member's avatar image
   */
  avatarSrc?: string;

  /**
   * Full bio or description of the team member
   */
  bio?: string;

  /**
   * Short bio or summary of the team member
   */
  shortBio?: string;

  /**
   * URL to the team member's portfolio
   */
  portfolioLink?: string;

  /**
   * List of skills the team member possesses
   */
  skills?: string[] | Skill[];

  /**
   * Social media links for the team member
   */
  social?: {
    linkedIn?: string;
    github?: string;
    twitter?: string;
  };

  /**
   * Alternative social media links format
   */
  socialLinks?: Record<string, string>;

  /**
   * List of project IDs associated with the team member
   */
  projects?: string[];

  /**
   * List of achievements by the team member
   */
  achievements?: Achievement[];
}

/**
 * Extended profile for a team member with additional details
 */
export type TeamMemberProfile = TeamMember & {
  /**
   * Detailed education history
   */
  education?: Education[];

  /**
   * Detailed work experience
   */
  experience?: Experience[];

  /**
   * Detailed list of projects
   */
  projectDetails?: Project[];

  /**
   * Additional contact information
   */
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
  };
};
