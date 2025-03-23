'use client';

import { siteConfig } from '@/config/site';
import { Icon } from '@iconify/react';

/**
 * FooterSocialLinks
 * Displays external social media icons in the footer.
 */
export const FooterSocialLinks = () => {
  return (
    <div className="flex justify-center gap-x-4">
      {siteConfig.socialLinks.map((item) => (
        <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer">
          <span className="sr-only">{item.name}</span>
          <Icon aria-hidden="true" icon={item.icon} className="w-5 text-default-400" />
        </a>
      ))}
    </div>
  );
};
