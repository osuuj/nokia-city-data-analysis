'use client';

import { Link, Spacer } from '@heroui/react';
import type { IconProps } from '@iconify/react';
import { Icon } from '@iconify/react';

import Logo from '@/components/ui/osuuj-icon';

type SocialIconProps = Omit<IconProps, 'icon'>;

const navLinks = [
  {
    name: 'Home',
    href: '/home',
  },
  {
    name: 'Project',
    href: '/project',
  },
  {
    name: 'Resources',
    href: '/resources',
  },
  {
    name: 'About Us',
    href: '/about',
  },
  {
    name: 'Contact',
    href: '/contact',
  },
];

const socialItems = [
  {
    name: 'GitHub',
    href: '#',
    icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:github" />,
  },
];

export default function Footer() {
  return (
    <footer className="flex w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-6 lg:px-8">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <Spacer y={2} />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              isExternal
              className="text-default-500"
              href={item.href}
              size="sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Spacer y={2} />
        <div className="flex justify-center gap-x-4">
          {socialItems.map((item) => (
            <Link key={item.name} isExternal className="text-default-400" href={item.href}>
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="w-5" />
            </Link>
          ))}
        </div>
        <Spacer y={4} />
        <p className="mt-1 text-center text-small text-default-400">
          &copy; 2025 Osuuj All rights reserved.
        </p>
      </div>
    </footer>
  );
}
