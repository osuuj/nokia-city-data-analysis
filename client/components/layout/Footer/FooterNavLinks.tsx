'use client';

import { siteConfig } from '@/config';
import Link from 'next/link';

/**
 * FooterNavLinks
 * Displays site-wide footer navigation links.
 */
export const FooterNavLinks = () => {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
      {siteConfig.footerNav.map((item) => (
        <Link key={item.name} href={item.href} className="text-default-500 text-sm">
          {item.name}
        </Link>
      ))}
    </div>
  );
};
