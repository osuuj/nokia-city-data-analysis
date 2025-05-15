'use client';

import { TeamMemberGrid } from '@/features/about/components';
import { motion, useReducedMotion } from 'framer-motion';

interface ProjectTeamSectionProps {
  team: string[];
  projectTitle: string;
  isLoading: boolean;
}

/**
 * Displays the team members for a project
 */
export function ProjectTeamSection({ team, projectTitle, isLoading }: ProjectTeamSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!team || team.length === 0) {
    return null;
  }

  // Skip animation if user prefers reduced motion
  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 },
        transition: { duration: 0.6, delay: 0.5 },
      };

  return (
    <motion.section {...animationProps} aria-labelledby="team-heading">
      <h2 className="text-2xl font-semibold mb-6" id="team-heading">
        Project Team
      </h2>
      <TeamMemberGrid
        team={team.map((name, index) => ({
          id: `team-member-${index}`,
          name,
          jobTitle: 'Team Member',
          bio: `Team member for ${projectTitle}`,
          portfolioLink: '#',
          avatarSrc: `/api/avatar?seed=${encodeURIComponent(name)}`,
        }))}
      />
    </motion.section>
  );
}
