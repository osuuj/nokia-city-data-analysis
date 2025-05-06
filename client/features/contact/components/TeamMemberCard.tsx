import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
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
 *
 * Performance optimized: uses static images for mobile devices.
 */
export const TeamMemberCard: React.FC<TeamMemberProps> = ({ name, role, email, socialLinks }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile for performance optimization
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate avatar image path based on device and name
  const avatarSrc = isMobile
    ? `/images/team/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`
    : `/api/avatar?seed=${encodeURIComponent(name)}`;

  // Fallback path in case static image doesn't exist
  const fallbackAvatar = '/images/default-avatar.jpg';

  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fall back to API if static image fails
    e.currentTarget.src = `/api/avatar?seed=${encodeURIComponent(name)}`;
  };

  return (
    <Card className="backdrop-blur-md bg-opacity-90">
      <CardBody className="flex flex-col items-center gap-4">
        <img
          src={avatarSrc}
          alt={name}
          className="w-24 h-24 rounded-full border-2 border-primary"
          onError={handleImageError}
          loading="eager"
          width={96}
          height={96}
        />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-default-900 dark:text-default-50">{name}</h3>
          <p className="text-default-500 dark:text-default-400 mb-4">{role}</p>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon icon="lucide:mail" className="text-default-600 dark:text-default-400" />
            <a
              href={`mailto:${email}`}
              className="text-primary-600 dark:text-primary-400 hover:underline"
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
