'use client';

import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';
import type { FadeInProps } from '../types';

/**
 * A component for creating fade-in animations
 *
 * @param props Component props
 * @returns Fade-in animated component
 *
 * @example
 * ```tsx
 * <FadeIn duration={0.5} delay={0.2}>
 *   <div>Content that fades in</div>
 * </FadeIn>
 * ```
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};
