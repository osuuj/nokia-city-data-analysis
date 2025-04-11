'use client';

import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
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
import { clsx } from 'clsx';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import Breadcrumbs from '@/components/layout/Navbar/Breadcrumbs';
import { DataLoader } from '@/components/ui/DataLoader';
import { ThemeSwitch } from '@/components/ui/Theme/ThemeSwitch';
import { siteConfig } from '@/config';
import { GithubIcon, OsuujLogo } from '@/icons';

const navbarItems = [
  { href: '/home', label: 'Home' },
  { href: '/project', label: 'Project' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Header
 * Responsive site navigation bar with logo, navigation items, search, GitHub, and theme toggle.
 */
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on the landing page
  const isLandingPage = pathname === '/';

  // Prefetch cities data
  const { data: cities } = useSWR<string[]>(`${BASE_URL}/api/v1/cities`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // Cache for 5 minutes
    suspense: false,
  });

  // Prefetch initial company data (using a default city)
  const { data: companies } = useSWR(
    `${BASE_URL}/api/v1/companies.geojson?city=Helsinki`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
      suspense: false,
    },
  );

  // Check if data is ready
  const isDataReady = cities && companies;

  // Check if current page should have black background
  const isBlackBgPage = false;

  // Check if breadcrumbs should be shown
  const shouldShowBreadcrumbs =
    !pathname.startsWith('/home') &&
    !['/project', '/resources', '/about', '/contact', '/'].includes(pathname);

  // Handle item click for immediate visual feedback
  const handleItemClick = (href: string) => {
    // Set clicked item for visual feedback
    setClickedItem(href);

    // Special handling for Home link
    if (href === '/home') {
      // Show loading overlay if data isn't ready
      if (!isDataReady) {
        setShowLoadingOverlay(true);
      }

      // Navigate to home page
      router.push('/home');
    } else {
      // For other links, navigate immediately
      router.push(href);
    }

    // Reset clicked item after a short delay
    setTimeout(() => {
      setClickedItem(null);
    }, 300);
  };

  // Function to handle data ready event
  const handleDataReady = () => {
    // This function is called when data is ready
    console.log('Data is ready');
  };

  // Use useEffect to handle side effects
  useEffect(() => {
    // Hide loading overlay when data is ready
    if (isDataReady && showLoadingOverlay) {
      setShowLoadingOverlay(false);
    }
  }, [isDataReady, showLoadingOverlay]);

  // Log navigation items for debugging
  useEffect(() => {
    console.log('Current pathname:', pathname);
    console.log('Navigation items:', navbarItems);
  }, [pathname]);

  return (
    <div
      className={`w-full sticky top-0 z-[100] ${isBlackBgPage ? 'bg-black text-white' : 'bg-background/80 backdrop-blur-md text-foreground'}`}
    >
      {showLoadingOverlay && <LoadingOverlay message="Loading data..." delay={500} />}

      <Navbar
        classNames={{
          base: `pt-2 pb-2 lg:pt-4 lg:pb-4 ${isBlackBgPage ? 'bg-black' : 'lg:bg-transparent lg:backdrop-filter-none'}`,
          wrapper: 'px-4 sm:px-6 flex items-center justify-between',
          item: 'data-[active=true]:text-primary',
          menuItem: 'data-[active=true]:text-primary w-full',
          menu: 'mt-2 transition-transform duration-300 ease-in-out w-full',
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
          <OsuujLogo large={true} />
        </NavbarBrand>

        {/* Center: Navigation links - only show if not on landing page */}
        {!isLandingPage && (
          <NavbarContent className="hidden md:flex flex-1 justify-center gap-6 max-w-[500px] h-12 w-full rounded-full bg-content2 px-4 dark:bg-content1">
            {navbarItems.map((item) => (
              <NavbarItem
                key={item.href}
                isActive={
                  item.href === '/home' ? pathname === '/home' : pathname.startsWith(item.href)
                }
                className={clsx(clickedItem === item.href ? 'text-primary' : '')}
              >
                <NextLink
                  className="flex gap-2 text-inherit"
                  href={item.href}
                  prefetch={item.href === '/home'}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item.href);
                  }}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </NavbarContent>
        )}

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
        <NavbarMenu className="transition-transform duration-300 ease-in-out px-0 w-full left-0 right-0 z-[200]">
          <div className="w-full">
            {/* Add Home option at the top of the mobile menu */}
            <NavbarMenuItem
              isActive={pathname === '/home'}
              className={clsx(clickedItem === '/home' ? 'text-primary' : '', 'pt-1')}
            >
              <NextLink
                className="text-inherit w-full px-4 py-2"
                href="/home"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  handleItemClick('/home');
                }}
                prefetch={true}
              >
                Home
              </NextLink>
            </NavbarMenuItem>

            {/* Existing menu items - filter out Home to avoid duplication */}
            {navbarItems
              .filter((item) => item.href !== '/home')
              .map((item) => (
                <NavbarMenuItem
                  key={item.href}
                  isActive={
                    item.href === '/home' ? pathname === '/home' : pathname.startsWith(item.href)
                  }
                  className={clsx(clickedItem === item.href ? 'text-primary' : '')}
                >
                  <NextLink
                    className="text-inherit w-full px-4 py-2"
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      handleItemClick(item.href);
                    }}
                    prefetch={item.href === '/home'}
                  >
                    {item.label}
                  </NextLink>
                </NavbarMenuItem>
              ))}
          </div>
        </NavbarMenu>
      </Navbar>

      {/* Breadcrumbs section */}
      {shouldShowBreadcrumbs && (
        <div className="w-full py-2 border-t border-default-100">
          <div className="max-w-5xl w-full px-4 sm:px-6 lg:px-8">
            <Breadcrumbs />
          </div>
        </div>
      )}

      {/* Hidden DataLoader to prefetch data */}
      <div className="hidden">
        <DataLoader onDataReady={handleDataReady}>
          <div>Data is ready</div>
        </DataLoader>
      </div>
    </div>
  );
};
