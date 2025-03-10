'use client';
import {
  Button,
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { ThemeSwitch } from '@/components/ui/theme-switch';

import { GithubIcon } from '@/components/ui/icons';
import Logo from '@/components/ui/osuuj-icon';
import { siteConfig } from '@/config/site';

const navbarItems = [
  { href: '/home', label: 'Home' },
  { href: '/project', label: 'Project' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="w-full">
      <Navbar
        classNames={{
          base: 'pt-2 lg:pt-4 lg:bg-transparent lg:backdrop-filter-none',
          wrapper: 'px-4 sm:px-6',
          item: 'data-[active=true]:text-primary',
          menuItem: 'data-[active=true]:text-primary',
          menu: 'mt-2',
        }}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        height="60px"
      >
        <NavbarBrand>
          <NavbarMenuToggle
            className="mr-2 h-6 sm:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
          <Logo />
        </NavbarBrand>
        <NavbarContent
          className="ml-4 hidden h-12 w-full max-w-fit gap-4 rounded-full bg-content2 px-4 dark:bg-content1 sm:flex"
          justify="start"
        >
          {navbarItems.map((item) => (
            <NavbarItem key={item.href} isActive={pathname === item.href}>
              <Link className="flex gap-2 text-inherit" href={item.href}>
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        {/* Right Menu */}
        <NavbarContent
          className="ml-auto flex h-12 max-w-fit items-center gap-0 rounded-full p-0 lg:bg-content2 lg:px-1 lg:dark:bg-content1"
          justify="end"
        >
          {/* Search */}
          <NavbarItem className="mr-2 hidden lg:flex">
            <Input
              aria-label="Search"
              id="search-input"
              name="search"
              classNames={{
                inputWrapper:
                  'bg-default-100 group-data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-100',
              }}
              labelPlacement="outside"
              placeholder="Search..."
              radius="full"
              startContent={
                <Icon className="text-default-500" icon="solar:magnifer-linear" width={20} />
              }
            />
          </NavbarItem>
          {/* Mobile search */}
          <NavbarItem className="lg:hidden">
            <Button isIconOnly radius="full" variant="light" aria-label="Search">
              <Icon className="text-default-500" icon="solar:magnifer-linear" width={20} />
            </Button>
          </NavbarItem>
          {/* GitHub */}
          <NavbarItem className="lg:flex">
            <Button isIconOnly radius="full" variant="light" aria-label="GitHub">
              <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                <GithubIcon className="text-default-500" width={24} />
              </Link>
            </Button>
          </NavbarItem>
          {/* Theme change */}
          <NavbarItem className="hidden lg:flex">
            <ThemeSwitch aria-label="Toggle theme" />
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {navbarItems.map((item) => (
            <NavbarMenuItem key={item.href} isActive={pathname === item.href}>
              <Link className="text-inherit" href={item.href} onPress={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
