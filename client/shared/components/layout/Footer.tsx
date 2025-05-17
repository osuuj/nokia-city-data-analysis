'use client';

import { Spacer } from '@heroui/react';
import { OsuujLogo } from '@shared/icons';

/**
 * Footer
 * Renders the main site footer including logo, nav links, social links, and copyright.
 */
export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-background py-12 md:py-12 sm:py-6 xs:py-4 px-6"
      data-testid="footer"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <OsuujLogo className="min-w-[40px] min-h-[40px] sm:scale-90 xs:scale-75" />
        </div>

        <Spacer y={4} className="sm:hidden" />
        <Spacer y={2} className="hidden sm:block xs:hidden" />
        <Spacer y={1} className="hidden xs:block" />

        <p className="mt-1 text-center text-small text-default-400 xs:text-xs">
          &copy; {year} Osuuj. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
