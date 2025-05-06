import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useState } from 'react';
import type React from 'react';

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
 */
export const TeamMemberCard: React.FC<TeamMemberProps> = ({ name, role, email, socialLinks }) => {
  // Generate file name for team member image
  const imageName = name.toLowerCase().replace(/\s+/g, '-');
  const [imageSrc, setImageSrc] = useState(`/images/team/${imageName}.svg`);

  // Handle image loading error
  const handleImageError = () => {
    setImageSrc('/images/default-avatar.svg');
  };

  return (
    <Card className="backdrop-blur-md bg-opacity-90">
      <CardBody className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24 rounded-full border-2 border-primary overflow-hidden">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="96px"
            priority
            onError={handleImageError}
            className="object-cover"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-default-900 dark:text-default-50">{name}</h3>
          <p className="text-default-500 dark:text-default-400 mb-4">{role}</p>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon icon="lucide:mail" className="text-default-600 dark:text-default-400" />
            <a
              href={`mailto:${email}`}
              className="text-primary-600 dark:text-primary-400 hover:underline"
              aria-label={`Email ${name} at ${email}`}
            >
              {email}
            </a>
          </div>

          {socialLinks.map((link) => (
            <div key={link.href} className="flex items-center justify-center gap-2 mb-2">
              <Icon icon={link.icon} />
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
                aria-label={`Visit ${name}'s ${link.label}`}
              >
                {link.label}
              </a>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
