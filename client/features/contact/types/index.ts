/**
 * Type definitions for the Contact feature
 */

/**
 * Social media link for team members
 */
export interface SocialLink {
  /**
   * Icon identifier for the social platform
   */
  icon: string;

  /**
   * URL to the team member's profile
   */
  href: string;

  /**
   * Display label for the link
   */
  label: string;
}

/**
 * Basic team member information
 */
export interface TeamMember {
  /**
   * Team member's full name
   */
  name: string;

  /**
   * Team member's role or position
   */
  role: string;

  /**
   * Team member's email address
   */
  email: string;

  /**
   * List of social media profiles
   */
  socialLinks: SocialLink[];
}

/**
 * Props for the ContactInfo component
 */
export interface ContactInfoProps {
  /**
   * Primary contact email address
   */
  email: string;

  /**
   * Description text for the contact section
   */
  description: string;

  /**
   * Optional text indicating expected response time
   */
  responseTime?: string;
}

/**
 * Props for the ContactPageWrapper component
 */
export interface ContactPageWrapperProps {
  /**
   * List of team members to display
   */
  teamMembers: TeamMember[];

  /**
   * Primary contact email address
   */
  email: string;

  /**
   * Description text for the contact section
   */
  description: string;

  /**
   * Expected response time text
   */
  responseTime: string;
}

/**
 * Re-export all contact types
 */
export * from './contact-types';
