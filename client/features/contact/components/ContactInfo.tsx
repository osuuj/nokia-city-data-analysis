'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, useReducedMotion } from 'framer-motion';
import type React from 'react';
import { memo, useEffect, useState } from 'react';

interface ContactInfoProps {
  email: string;
  description: string;
  responseTime?: string;
}

/**
 * ContactInfo Component
 *
 * Displays general contact information with an email address
 * and additional information.
 *
 * Performance optimized with:
 * - Proper media query usage instead of resize event
 * - Respects user's reduced motion preferences
 * - Memoized to prevent unnecessary re-renders
 */
export const ContactInfo: React.FC<ContactInfoProps> = memo(
  ({ email, description, responseTime }) => {
    const [isMobile, setIsMobile] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    // Efficient mobile detection using matchMedia
    useEffect(() => {
      const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
      const handleMobileChange = (e: MediaQueryListEvent | MediaQueryList) => {
        setIsMobile(e.matches);
      };

      // Initial check
      handleMobileChange(mobileMediaQuery);

      // Add listener with browser compatibility
      if (typeof mobileMediaQuery.addEventListener === 'function') {
        mobileMediaQuery.addEventListener('change', handleMobileChange);
        return () => mobileMediaQuery.removeEventListener('change', handleMobileChange);
      }

      // Fallback for older browsers
      window.addEventListener('resize', () => {
        setIsMobile(window.innerWidth <= 768);
      });
      return () =>
        window.removeEventListener('resize', () => {
          setIsMobile(window.innerWidth <= 768);
        });
    }, []);

    // Determine if animations should be used
    const shouldAnimate = !prefersReducedMotion && !isMobile;

    // Motion props based on animation preference
    const motionProps = shouldAnimate
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        }
      : {};

    // Component wrapper based on animation preference
    const WrapperComponent = shouldAnimate ? motion.div : 'div';

    return (
      <WrapperComponent {...motionProps} className="mb-12">
        <Card className="backdrop-blur-md bg-opacity-90 transition-colors">
          <CardBody className="p-6">
            <h2 className="text-2xl font-semibold text-default-800 dark:text-default-200 mb-4 text-center">
              Get in Touch
            </h2>
            <p className="text-default-600 dark:text-default-400 text-center mb-6">{description}</p>

            <div className="flex items-center justify-center gap-3 mb-4">
              <Icon icon="lucide:mail" className="text-xl text-primary-500" />
              <a
                href={`mailto:${email}`}
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {email}
              </a>
            </div>

            {responseTime && (
              <div className="text-center text-sm text-default-500 dark:text-default-400 mt-6">
                {responseTime}
              </div>
            )}
          </CardBody>
        </Card>
      </WrapperComponent>
    );
  },
);

ContactInfo.displayName = 'ContactInfo';
