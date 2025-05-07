'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import type React from 'react';
import { memo, useState } from 'react';

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

export interface TeamMemberProps {
  name: string;
  role: string;
  email: string;
  socialLinks: SocialLink[];
}

/**
 * TeamMemberCard Component
 *
 * Displays information about a team member including their photo,
 * name, role, email and social links.
 *
 * Performance optimized with:
 * - Image optimization with proper size and loading attributes
 * - Memoization to prevent unnecessary re-renders
 * - Simple error handling
 */
export const TeamMemberCard: React.FC<TeamMemberProps> = memo(
  ({ name, role, email, socialLinks }) => {
    // Generate file name for team member image
    const imageName = name.toLowerCase().replace(/\s+/g, '-');
    const [imageSrc, setImageSrc] = useState(`/images/team/${imageName}.svg`);

    // Handle image loading error
    const handleImageError = () => {
      setImageSrc('/images/default-avatar.svg');
    };

    return (
      <Card className="backdrop-blur-md bg-opacity-90 transition-colors">
        <CardBody className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24 rounded-full border-2 border-primary overflow-hidden flex-shrink-0">
            <Image
              src={imageSrc}
              alt={name}
              fill
              sizes="96px"
              onError={handleImageError}
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0OCIgY3k9IjQ4IiByPSI0OCIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=="
            />
          </div>
          <div className="text-center w-full">
            <h3 className="text-xl font-semibold text-default-900 dark:text-default-50">{name}</h3>
            <p className="text-default-500 dark:text-default-400 mb-4">{role}</p>

            <a
              href={`mailto:${email}`}
              className="flex items-center justify-center gap-2 mb-2 text-primary-600 dark:text-primary-400 hover:underline"
              aria-label={`Email ${name} at ${email}`}
            >
              <Icon
                icon="lucide:mail"
                className="text-default-600 dark:text-default-400 flex-shrink-0"
                width={16}
                height={16}
              />
              <span>{email}</span>
            </a>

            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mb-2 text-primary-600 dark:text-primary-400 hover:underline"
                aria-label={`Visit ${name}'s ${link.label}`}
              >
                <Icon icon={link.icon} width={16} height={16} className="flex-shrink-0" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  },
);

TeamMemberCard.displayName = 'TeamMemberCard';
