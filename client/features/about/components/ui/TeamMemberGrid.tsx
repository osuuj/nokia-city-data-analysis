'use client';

import type { TeamMember } from '@/features/about/types/profileTypes';
import { motion } from 'framer-motion';
import { TeamMemberCard } from './TeamMemberCard';

interface TeamMemberGridProps {
  team: TeamMember[];
}

export function TeamMemberGrid({ team }: TeamMemberGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {team.map((member, index) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <TeamMemberCard {...member} />
        </motion.div>
      ))}
    </div>
  );
}
