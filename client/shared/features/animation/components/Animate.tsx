'use client';

import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';
import type { AnimationProps } from '../types';

/**
 * A component for creating simple animations with configurable properties
 *
 * @param props Component props
 * @returns Animated component
 *
 * @example
 * ```tsx
 * <Animate
 *   initial={{ opacity: 0, y: 20 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   exit={{ opacity: 0, y: -20 }}
 *   transition={{ duration: 0.5 }}
 * >
 *   <div>Animated content</div>
 * </Animate>
 * ```
 */
export const Animate: React.FC<AnimationProps> = ({
  children,
  initial,
  animate,
  exit,
  transition,
  className,
}) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};
