import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ProfileSection({ title, children, className = '' }: ProfileSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn('space-y-4', className)}
    >
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h4>
      <div className="space-y-2">{children}</div>
    </motion.div>
  );
}
