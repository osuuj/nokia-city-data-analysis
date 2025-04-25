'use client';

import { Spacer } from '@heroui/react';
import { OsuujLogo } from '@shared/icons';

/**
 * Footer
 * Renders the main site footer including logo, nav links, social links, and copyright.
 */
export const Footer = () => {
  // Use global theme classes for light/dark mode
  const footerClassName = 'flex w-full flex-col bg-background text-foreground';

  return (
    <footer className={footerClassName}>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-6 lg:px-8">
        <div className="flex items-center justify-center">
          <OsuujLogo />
        </div>

        <Spacer y={4} />

        <p className="mt-1 text-center text-small text-default-400">
          &copy; {new Date().getFullYear()} Osuuj. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
