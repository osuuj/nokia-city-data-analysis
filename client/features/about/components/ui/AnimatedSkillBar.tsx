import { motion } from 'framer-motion';
import type React from 'react';
import { useInView } from 'react-intersection-observer';

interface SkillProps {
  name: string;
  level: number;
  color?: string;
  index: number;
}

export const AnimatedSkillBar: React.FC<SkillProps> = ({
  name,
  level,
  color = 'primary',
  index,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className="bg-content1 p-4 rounded-xl backdrop-blur-md border border-content2 shadow-sm mb-3"
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-sm font-medium text-black dark:text-white">{name}</span>
        </div>
        <motion.span
          className="text-sm font-semibold text-[#D4D4D8]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-2 bg-default-100 dark:bg-default-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
