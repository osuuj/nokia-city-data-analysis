import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';
import type { TeamMember } from '../hooks/useTeamMember';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSection } from './ProfileSection';

interface ProfileCardProps {
  member: TeamMember;
  className?: string;
}

export function ProfileCard({ member, className = '' }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden', className)}
    >
      <div className="p-6 space-y-6">
        <ProfileHeader
          name={member.name}
          role={member.jobTitle}
          image={member.avatarSrc}
          description={member.bio}
        />

        <div className="space-y-6">
          {member.skills && member.skills.length > 0 && (
            <ProfileSection title="Skills">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {member.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                  </motion.li>
                ))}
              </ul>
            </ProfileSection>
          )}

          {member.achievements && member.achievements.length > 0 && (
            <ProfileSection title="Achievements">
              <ul className="space-y-2">
                {member.achievements.map((achievement) => (
                  <motion.li
                    key={`${achievement.title}-${achievement.date}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start space-x-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div className="text-gray-700 dark:text-gray-300">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{achievement.date}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </ProfileSection>
          )}
        </div>
      </div>
    </motion.div>
  );
}
