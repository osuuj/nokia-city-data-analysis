'use client';

import { OsuujLogo } from '@/icons';
import { Spacer } from '@heroui/react';
import { usePathname } from 'next/navigation';

/**
 * Footer
 * Renders the main site footer including logo, nav links, social links, and copyright.
 */
export const Footer = () => {
  const pathname = usePathname();

  // Check if current page should have black background
  const isBlackBgPage =
    pathname.startsWith('/resources') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact');

  return (
    <footer className={`flex w-full flex-col ${isBlackBgPage ? 'bg-black' : ''}`}>
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
