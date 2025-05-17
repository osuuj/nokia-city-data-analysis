'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import type React from 'react';
import { memo } from 'react';
import { useAnimationSettings } from '../hooks';
import type { ContactInfoProps } from '../types/contact-types';

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
    // Use the shared animation settings hook
    const { shouldAnimate, fadeInProps } = useAnimationSettings();

    // Component wrapper based on animation preference
    const WrapperComponent = shouldAnimate ? motion.div : 'div';

    return (
      <WrapperComponent {...fadeInProps} className="mb-12">
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
