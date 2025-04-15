'use client';

import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { clsx } from 'clsx';
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
  const [isNavigatingToHome, setIsNavigatingToHome] = useState(false);
  const [isBlurry, setIsBlurry] = useState(false);
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
      if (isLandingPage) {
        // If we're on the landing page, find and click the Start Exploring button
        const startButton = document.querySelector(
          '[aria-label="Start Exploring"]',
        ) as HTMLButtonElement;
        if (startButton) {
          setIsBlurry(true);
          startButton.click();
        }
      } else {
        // For other pages, show loading overlay and navigate
        setIsNavigatingToHome(true);
        setIsBlurry(true);
        if (!isDataReady) {
          setShowLoadingOverlay(true);
        }
        router.push('/home');
      }
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

  // Reset navigation states when pathname changes
  useEffect(() => {
    // If we're navigating to home and the pathname changes, reset the states
    if (isNavigatingToHome && pathname === '/home') {
      // Keep the blurry effect for a moment after navigation completes
      setTimeout(() => {
        setIsNavigatingToHome(false);
        setIsBlurry(false);
      }, 500);
    }
  }, [pathname, isNavigatingToHome]);

  return (
    <div
      className={`w-full sticky top-0 z-[100] ${
        isBlackBgPage
          ? 'bg-black text-white'
          : isBlurry
            ? 'bg-background/90 backdrop-blur-md text-foreground'
            : 'bg-background/90 backdrop-blur-md text-foreground'
      }`}
    >
      {showLoadingOverlay && <LoadingOverlay message="Loading data..." />}

      <Navbar
        maxWidth="2xl"
        classNames={{
          base: `pt-2 pb-2 lg:pt-4 lg:pb-4 ${isBlackBgPage ? 'bg-black' : ''}`,
          wrapper: 'px-4 sm:px-6 gap-4',
          item: 'data-[active=true]:font-medium data-[active=true]:text-primary',
          menuItem: 'data-[active=true]:font-medium data-[active=true]:text-primary',
          menu: 'mt-2 p-4 transition-transform duration-300 ease-in-out w-full',
        }}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Left: Logo + mobile toggle */}
        <NavbarMenuToggle
          className="sm:hidden"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
        <NavbarBrand className="flex-grow sm:flex-grow-0">
          <Link href="/" color="foreground" className="flex items-center gap-2">
            <OsuujLogo large={true} />
          </Link>
        </NavbarBrand>

        {/* Center: Navigation links */}
        <NavbarContent
          justify="center"
          className="hidden sm:flex flex-grow gap-6 max-w-[500px] h-12 "
        >
          <div className="flex gap-1 px-2 py-1 rounded-full bg-content2 dark:bg-content1 dark:bg-content1 backdrop-blur-md">
            {navbarItems.map((item) => (
              <NavbarItem
                key={item.href}
                isActive={pathname.startsWith(item.href)}
                className={`${clickedItem === item.href ? 'text-primary' : ''}`}
              >
                <Link
                  href={item.href}
                  color={pathname.startsWith(item.href) ? 'primary' : 'foreground'}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    pathname.startsWith(item.href)
                      ? 'bg-primary/10 font-medium'
                      : 'hover:bg-content3/50'
                  }`}
                  onPress={() => {
                    handleItemClick(item.href);
                  }}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
          </div>
        </NavbarContent>

        {/* Right: Actions (search, GitHub, theme) */}
        <NavbarContent justify="end" className="sm:flex max-w-fit">
          <div className="flex items-center gap-1 px-2 py-1">
            <NavbarItem className="lg:flex">
              <Button
                isIconOnly
                radius="full"
                variant="light"
                aria-label="GitHub"
                as="a"
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="text-default-700" />
              </Button>
            </NavbarItem>

            <NavbarItem>
              <ThemeSwitch aria-label="Toggle theme" />
            </NavbarItem>
          </div>
        </NavbarContent>

        {/* Mobile menu */}
        <NavbarMenu className="transition-transform duration-300 ease-in-out px-0 w-full left-0 right-0 z-[200]">
          <div className="w-full">
            {/* Add Home option at the top of the mobile menu */}
            <NavbarMenuItem
              isActive={pathname === '/home'}
              className={clsx(clickedItem === '/home' ? 'text-primary' : '')}
            >
              <Link
                className="text-inherit w-full px-4 py-2"
                href="/home"
                onPress={() => {
                  setIsMenuOpen(false);
                  handleItemClick('/home');
                }}
              >
                Home
              </Link>
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
                  <Link
                    className="text-inherit w-full px-4 py-2"
                    color="foreground"
                    href={item.href}
                    onPress={() => {
                      setIsMenuOpen(false);
                      handleItemClick(item.href);
                    }}
                  >
                    {item.label}
                  </Link>
                </NavbarMenuItem>
              ))}
          </div>
        </NavbarMenu>
      </Navbar>

      {/* Breadcrumbs section */}
      {shouldShowBreadcrumbs && (
        <div className="w-full py-2 border-t border-divider/40">
          <div className=" mx-auto w-full px-4 sm:px-6">
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
