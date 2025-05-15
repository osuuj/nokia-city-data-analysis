'use client';

import { Icon } from '@iconify/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import React from 'react';

/**
 * Project categories with their associated icons and colors
 *
 * @remarks
 * Each category has a unique ID, display name, icon, and color theme.
 * The icons are from the Lucide icon set.
 */
const categories = [
  {
    id: 'web',
    name: 'Web Platform',
    icon: 'lucide:globe',
    color: 'primary-500',
  },
  {
    id: 'ai',
    name: 'AI & ML',
    icon: 'lucide:brain',
    color: 'success-500',
  },
  {
    id: 'etl',
    name: 'Data Pipeline (ETL)',
    icon: 'lucide:database',
    color: 'warning-500',
  },
  {
    id: 'api',
    name: 'Backend API',
    icon: 'lucide:server',
    color: 'secondary-500',
  },
  {
    id: 'map',
    name: 'Geospatial (Mapbox)',
    icon: 'lucide:map',
    color: 'default-500',
  },
  {
    id: 'analytics',
    name: 'Company Analytics',
    icon: 'lucide:bar-chart-2',
    color: 'danger-500',
  },
] as const;

/**
 * Get the appropriate CSS class for a category's color
 */
const getCategoryColorClass = (color: string) => {
  switch (color) {
    case 'primary-500':
      return 'text-primary-500';
    case 'success-500':
      return 'text-success-500';
    case 'warning-500':
      return 'text-warning-500';
    case 'secondary-500':
      return 'text-secondary-500';
    case 'default-500':
      return 'text-default-500';
    case 'danger-500':
      return 'text-danger-500';
    default:
      return 'text-primary-500';
  }
};

/**
 * Animated hero section for the projects page
 *
 * Features:
 * - Rotating category icons with smooth animations
 * - Animated background blobs
 * - Gradient text effects
 * - Responsive design
 * - Respects user's reduced motion preference
 *
 * @example
 * ```tsx
 * <AnimatedProjectHero />
 * ```
 */
export function AnimatedProjectHero() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentCategory = categories[currentIndex];
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion) return; // Don't animate if user prefers reduced motion

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const getAnimationProps = (duration = 0.8, delay = 0) => {
    if (prefersReducedMotion) {
      return { initial: {}, animate: {}, exit: {} };
    }
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay },
    };
  };

  const getBlobAnimationProps = (options: { duration?: number } = {}) => {
    if (prefersReducedMotion) return {};

    return {
      animate: { scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] },
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'reverse' as const,
        ...options,
      },
    };
  };

  return (
    <div className="relative overflow-hidden pt-1 pb-1 md:pt-3 md:pb-3">
      {/* 💫 Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <motion.div className="absolute inset-0 bg-gradient-to-b from-background to-content2" />
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-100 dark:bg-primary-900/30 opacity-30 blur-3xl"
          {...getBlobAnimationProps()}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary-100 dark:bg-secondary-900/30 opacity-30 blur-3xl"
          {...getBlobAnimationProps({ duration: 10 })}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* 🔁 Animated Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, scale: 0.8 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: -20, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto">
                  <Icon
                    icon={currentCategory.icon}
                    className={`${getCategoryColorClass(currentCategory.color)} text-4xl`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 📝 Heading */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500"
          {...getAnimationProps(0.8, 0.2)}
        >
          Our Projects
        </motion.h1>

        {/* 💬 Description */}
        <motion.p
          className="text-default-600 text-base md:text-lg max-w-2xl mx-auto mb-4"
          {...getAnimationProps(0.8, 0.4)}
        >
          Discover our diverse portfolio of cutting-edge projects, each driven by innovation,
          collaboration, and a passion for solving real-world challenges. From concept to execution,
          we bring ideas to life across a wide range of technologies and industries.
        </motion.p>
      </div>
    </div>
  );
}
