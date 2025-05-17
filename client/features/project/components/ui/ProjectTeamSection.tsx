'use client';

import { TeamMemberGrid } from '@/features/about/components';
import { useAnimationProps } from '@/shared/hooks';
import { motion } from 'framer-motion';

interface ProjectTeamSectionProps {
  team: string[];
  projectTitle: string;
  isLoading: boolean;
}

/**
 * Displays the team members for a project
 */
export function ProjectTeamSection({ team, projectTitle, isLoading }: ProjectTeamSectionProps) {
  if (!team || team.length === 0) {
    return null;
  }

  const animationProps = useAnimationProps('fadeInUp', {
    duration: 0.6,
    delay: 0.5,
    animate: isLoading ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 },
  });

  // Get avatar source based on team member name
  const getAvatarSrc = (name: string) => {
    const firstName = name.split(' ')[0].toLowerCase();

    // Use SVG files for known team members
    if (firstName === 'juuso') {
      return '/images/team/juuso-juvonen.svg';
    }
    if (firstName === 'kasperi') {
      return '/images/team/kasperi-rautio.svg';
    }

    // Fallback to generated avatar
    return `/api/avatar?seed=${encodeURIComponent(name)}`;
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
          portfolioLink: `/about/${name.split(' ')[0].toLowerCase()}`,
          avatarSrc: getAvatarSrc(name),
        }))}
      />
    </motion.section>
  );
}
