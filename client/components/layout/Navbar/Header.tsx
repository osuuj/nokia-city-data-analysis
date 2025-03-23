'use client';

import {
  Button,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { ThemeSwitch } from '@/components/common/Theme';
import { GithubIcon, OsuujLogo } from '@/components/icons';
import { siteConfig } from '@/config/site';

const navbarItems = [
  { href: '/home', label: 'Home' },
  { href: '/project', label: 'Project' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

/**
 * Header
 * Responsive site navigation bar with logo, navigation items, search, GitHub, and theme toggle.
 */
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="w-full">
      <Navbar
        classNames={{
          base: 'pt-2 pb-2 lg:pt-4 lg:pb-4 lg:bg-transparent lg:backdrop-filter-none',
          wrapper: 'px-4 sm:px-6 flex items-center justify-between',
          item: 'data-[active=true]:text-primary',
          menuItem: 'data-[active=true]:text-primary',
          menu: 'mt-2 transition-transform duration-300 ease-in-out',
        }}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        height="60px"
      >
        {/* Left: Logo + mobile toggle */}
        <NavbarBrand className="flex items-center flex-auto min-w-0 md:justify-start">
          <NavbarMenuToggle
            className="mr-2 h-6 md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
          <OsuujLogo />
        </NavbarBrand>

        {/* Center: Navigation links */}
        <NavbarContent className="hidden md:flex flex-1 justify-center gap-6 max-w-[500px] h-12 w-full rounded-full bg-content2 px-4 dark:bg-content1">
          {navbarItems.map((item) => (
            <NavbarItem key={item.href} isActive={pathname === item.href}>
              <NextLink className="flex gap-2 text-inherit" href={item.href}>
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Right: Actions (search, GitHub, theme) */}
        <NavbarContent className="flex flex-1 justify-end items-center gap-0 min-w-[150px] h-12 max-w-fit rounded-full p-0 lg:bg-content2 lg:px-1 lg:dark:bg-content1">
          <NavbarItem className="hidden lg:flex">
            <Input
              aria-label="Search"
              id="search-input"
              name="search"
              placeholder="Search..."
              radius="full"
              classNames={{
                inputWrapper:
                  'bg-default-100 group-data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-100',
              }}
              startContent={
                <Icon className="text-default-500" icon="solar:magnifer-linear" width={20} />
              }
            />
          </NavbarItem>

          <NavbarItem className="lg:hidden">
            <Button isIconOnly radius="full" variant="light" aria-label="Search">
              <Icon className="text-default-500" icon="solar:magnifer-linear" width={20} />
            </Button>
          </NavbarItem>

          <NavbarItem className="lg:flex">
            <Button isIconOnly radius="full" variant="light" aria-label="GitHub">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon className="text-default-500" width={24} />
              </a>
            </Button>
          </NavbarItem>

          <NavbarItem className="lg:flex">
            <ThemeSwitch aria-label="Toggle theme" />
          </NavbarItem>
        </NavbarContent>

        {/* Mobile menu */}
        <NavbarMenu className="transition-transform duration-300 ease-in-out">
          {navbarItems.map((item) => (
            <NavbarMenuItem key={item.href} isActive={pathname === item.href}>
              <NextLink
                className="text-inherit"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
};
