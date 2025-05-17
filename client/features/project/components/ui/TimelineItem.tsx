import { Card, CardBody } from '@heroui/react';
import { motion, useReducedMotion } from 'framer-motion';
import type React from 'react';
import { useInView } from 'react-intersection-observer';

interface TimelineItemProps {
  year: string;
  title: string;
  company?: string;
  description: string;
  index: number;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  year,
  title,
  company,
  description,
  index,
  isLast = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const alignRight = index % 2 === 0;

  // If user prefers reduced motion, provide empty animation objects
  const getAnimationProps = () => {
    if (prefersReducedMotion) {
      return { initial: {}, animate: {}, exit: {} };
    }
    return {};
  };

  return (
    <div ref={ref} className="relative mb-12">
      {/* Mobile Layout (vertical timeline) */}
      <div className="md:hidden relative pl-14">
        {/* Timeline line */}
        <div
          className={`absolute left-5 top-0 bottom-0 w-px bg-default-200 ${isLast ? 'h-6' : 'h-full'}`}
        />

        {/* Year marker - Mobile */}
        <div className="absolute left-5 top-0 -translate-x-1/2 flex flex-col items-center z-10">
          <motion.div
            {...getAnimationProps()}
            initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? {}
                : inView
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0, opacity: 0 }
            }
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="w-5 h-5 rounded-full bg-primary border-4 border-content1 shadow-sm"
          />
        </div>

        {/* Year pill - Mobile */}
        <motion.div
          {...getAnimationProps()}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={
            prefersReducedMotion ? {} : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
          }
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
          className="mb-3 inline-block py-1 px-3 bg-primary-100 dark:bg-primary-900 rounded-full text-xs font-medium text-primary-700 dark:text-primary-300"
        >
          {year}
        </motion.div>

        {/* Content Card - Mobile */}
        <motion.div
          {...getAnimationProps()}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={
            prefersReducedMotion ? {} : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
        >
          <Card className="shadow-md w-full">
            <CardBody>
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              {company && <p className="text-sm text-primary-500 mb-3">{company}</p>}
              <p className="text-sm text-default-600">{description}</p>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Desktop Layout (centered timeline with alternating sides) */}
      <div className="hidden md:block">
        {/* Timeline line */}
        <div
          className={`absolute left-1/2 h-full w-px bg-default-200 transform -translate-x-1/2 ${isLast ? 'hidden' : ''}`}
        />

        {/* Year marker */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/3 flex flex-col items-center">
          <motion.div
            {...getAnimationProps()}
            initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? {}
                : inView
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0, opacity: 0 }
            }
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="w-5 h-5 rounded-full bg-primary border-4 border-content1 z-10 shadow-sm"
          />
          <motion.div
            {...getAnimationProps()}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={
              prefersReducedMotion ? {} : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            className="mt-2 py-1 px-3 bg-primary-100 dark:bg-primary-900 rounded-full text-xs font-medium text-primary-700 dark:text-primary-300 whitespace-nowrap"
          >
            {year}
          </motion.div>
        </div>

        {/* Content Card - Desktop alternating sides */}
        <div className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}>
          <motion.div
            {...getAnimationProps()}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: alignRight ? 50 : -50 }}
            animate={
              prefersReducedMotion
                ? {}
                : inView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: alignRight ? 50 : -50 }
            }
            transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
            className={`w-5/12 z-10 ${alignRight ? 'mr-8' : 'ml-8'}`}
          >
            <Card className="shadow-md">
              <CardBody>
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                {company && <p className="text-sm text-primary-500 mb-3">{company}</p>}
                <p className="text-sm text-default-600">{description}</p>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
