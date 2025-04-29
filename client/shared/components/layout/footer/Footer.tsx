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
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-6 lg:py-6 md:py-5 sm:py-4 xs:py-3">
        <div className="flex items-center justify-center">
          <OsuujLogo className="min-w-[40px] min-h-[40px] sm:scale-90 xs:scale-75" />
        </div>

        <Spacer y={4} className="sm:hidden" />
        <Spacer y={2} className="hidden sm:block" />

        <p className="mt-1 text-center text-small text-default-400">
          &copy; {new Date().getFullYear()} Osuuj. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
