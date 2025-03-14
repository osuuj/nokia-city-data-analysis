'use client';

import { Spacer } from '@heroui/react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

import Logo from '@/components/icons/OsuujIcon';
import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer className="flex w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Logo />
        </div>

        <Spacer y={2} />

        {/* Navigation Links */}
        <FooterNavLinks />

        <Spacer y={2} />

        {/* Social Links */}
        <FooterSocialLinks />

        <Spacer y={4} />

        {/* Copyright */}
        <p className="mt-1 text-center text-small text-default-400">
          &copy; {new Date().getFullYear()} Osuuj All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ✅ Footer Navigation Links Component */
function FooterNavLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
      {siteConfig.footerNav.map((item) => (
        <Link key={item.name} href={item.href} className="text-default-500 text-sm">
          {item.name}
        </Link>
      ))}
    </div>
  );
}

/* ✅ Footer Social Links Component */
function FooterSocialLinks() {
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
}
