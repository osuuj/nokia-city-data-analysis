'use client';

import { LoadingOverlay } from '@/shared/components/loading';
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
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { DataLoader } from '@/shared/components/data';
import { ThemeSwitch } from '@/shared/components/ui/theme';
import { siteConfig } from '@shared/config';
import { GithubIcon, OsuujLogo } from '@shared/icons';
import Breadcrumbs from './Breadcrumbs';

const navbarItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/project', label: 'Project' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Header
 * Responsive site navigation bar with logo, navigation items, search, GitHub, and theme toggle.
 */
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [isNavigatingToDashboard, setIsNavigatingToDashboard] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const isBlurry = false;
  const currentPathname = usePathname() || '';
  const router = useRouter();

  // Check if we're on the landing page
  const isLandingPage = currentPathname === '/';
  // Check if we're on dashboard page
  const isDashboardPage = currentPathname === '/dashboard';

  // Prefetch cities data
  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: () => fetch(`${BASE_URL}/api/v1/cities`).then((res) => res.json()),
    staleTime: 300000, // 5 minutes (same as the SWR dedupingInterval)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Prefetch initial company data (using a default city)
  const { data: companies } = useQuery({
    queryKey: ['companies', 'geojson', 'Helsinki'],
    queryFn: () =>
      fetch(`${BASE_URL}/api/v1/companies.geojson?city=Helsinki`).then((res) => res.json()),
    staleTime: 60000, // 1 minute (same as the SWR dedupingInterval)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Check if data is ready
  const isDataReady = cities && companies;

  // Check if current page should have black background
  const isBlackBgPage = false;

  // Check if breadcrumbs should be shown
  const shouldShowBreadcrumbs =
    !currentPathname.startsWith('/home') &&
    !['/project', '/resources', '/about', '/contact', '/'].includes(currentPathname);

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPathname === '/dashboard';
    }
    return currentPathname.startsWith(path);
  };

  // Handle item click for immediate visual feedback
  const handleItemClick = (href: string) => {
    // Set clicked item for visual feedback
    setClickedItem(href);

    // Special handling for Home link
    if (href === '/dashboard') {
      setShowLoadingOverlay(true);
      setIsNavigatingToDashboard(true);
      router.push('/dashboard');
      return;
    }
    // For other links, navigate immediately
    router.push(href);

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

  // Remove scroll-related effects
  useEffect(() => {
    // Hide loading overlay when data is ready
    if (isDataReady && showLoadingOverlay) {
      setShowLoadingOverlay(false);
    }
  }, [isDataReady, showLoadingOverlay]);

  // Reset navigation states when pathname changes
  useEffect(() => {
    // Handle both dashboard navigation and landing page navigation
    if ((isNavigatingToDashboard && currentPathname === '/dashboard') || currentPathname === '/') {
      // Hide loading overlay immediately when reaching dashboard or landing page
      setShowLoadingOverlay(false);
      setIsNavigatingToDashboard(false);
    }

    // This ensures the loading overlay is never shown when navigating to the landing page
    if (currentPathname === '/') {
      setShowLoadingOverlay(false);
    }
  }, [currentPathname, isNavigatingToDashboard]);

  // Add effect to handle body overflow when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Just prevent scrolling without changing overflow
      // This prevents layout shifts that might cause the header to disappear
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
    };
  }, [isMenuOpen]);

  // Add this effect to close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header ref={headerRef} className="fixed top-0 inset-x-0 z-[100] shadow-sm">
      <div
        className={`w-full ${
          isBlackBgPage
            ? 'bg-black text-white'
            : 'bg-background/90 backdrop-blur-md text-foreground'
        } ${isMenuOpen ? 'shadow-md' : ''}`}
      >
        {showLoadingOverlay && <LoadingOverlay message="Loading data..." />}

        <Navbar
          maxWidth="2xl"
          classNames={{
            base: `pt-2 pb-2 lg:pt-4 lg:pb-4 ${isBlackBgPage ? 'bg-black' : ''}`,
            wrapper: 'px-4 sm:px-6 gap-4',
            item: 'data-[active=true]:font-medium data-[active=true]:text-primary',
            menuItem: 'data-[active=true]:font-medium data-[active=true]:text-primary',
            menu: 'pt-2 pb-4 max-h-[calc(100vh-64px)] overflow-auto',
          }}
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
        >
          {/* Left: Logo + mobile toggle */}
          <NavbarMenuToggle
            className="sm:hidden relative w-8 h-8 flex items-center justify-center"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            icon={
              <div className="relative flex flex-col justify-center items-center w-6 h-6">
                <span
                  className={`w-5 h-0.5 rounded-full bg-foreground absolute transition-all duration-300 ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}
                />
                <span
                  className={`w-5 h-0.5 rounded-full bg-foreground absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                />
                <span
                  className={`w-5 h-0.5 rounded-full bg-foreground absolute transition-all duration-300 ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}
                />
              </div>
            }
          />
          <NavbarBrand className="flex-grow sm:flex-grow-0">
            <Link href="/" color="foreground" className="flex items-center gap-2">
              <OsuujLogo className="min-w-[40px] min-h-[40px]" />
            </Link>
          </NavbarBrand>

          {/* Center: Navigation links */}
          <NavbarContent
            justify="center"
            className="hidden sm:flex flex-grow gap-6 max-w-[500px] h-12"
          >
            <div className="flex gap-1 px-2 py-1 rounded-full bg-content2 dark:bg-content1 dark:bg-content1 backdrop-blur-md">
              {navbarItems.map((item) => (
                <NavbarItem
                  key={item.href}
                  isActive={isPathActive(item.href)}
                  className={`${clickedItem === item.href ? 'text-primary' : ''}`}
                >
                  <Link
                    href={item.href}
                    color={isPathActive(item.href) ? 'primary' : 'foreground'}
                    className={`px-3 py-1.5 rounded-full transition-colors ${
                      isPathActive(item.href) ? 'bg-primary/10 font-medium' : 'hover:bg-content3/50'
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

          {/* Mobile menu with animation */}
          <NavbarMenu className="bg-background/95 backdrop-blur-md fixed top-[60px] left-0 right-0 bottom-0 overflow-y-auto border-t border-divider/30 shadow-lg transition-opacity duration-300 ease-in-out">
            <div className="px-4 pb-2 pt-2">
              {/* Dashboard option */}
              <NavbarMenuItem
                key="dashboard"
                isActive={currentPathname === '/dashboard'}
                className="border-b border-divider/30 mb-2 pb-2"
              >
                <Link
                  href="/dashboard"
                  className={`w-full px-4 py-3 rounded-md block ${
                    currentPathname === '/dashboard'
                      ? 'bg-primary text-white font-medium'
                      : 'text-foreground hover:bg-default-100'
                  }`}
                  onPress={() => {
                    setIsMenuOpen(false);
                    handleItemClick('/dashboard');
                  }}
                >
                  Dashboard
                </Link>
              </NavbarMenuItem>

              {/* Other menu items */}
              <div className="space-y-2">
                {navbarItems
                  .filter((item) => item.href !== '/dashboard')
                  .map((item) => (
                    <NavbarMenuItem key={item.href} isActive={isPathActive(item.href)}>
                      <Link
                        href={item.href}
                        className={`w-full px-4 py-2 block rounded-md ${
                          isPathActive(item.href)
                            ? 'text-primary font-medium'
                            : 'text-foreground hover:text-primary hover:bg-default-100/50'
                        }`}
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
            </div>
          </NavbarMenu>
        </Navbar>

        {/* Breadcrumbs section */}
        {shouldShowBreadcrumbs && (
          <div className="w-full py-2 border-t border-divider/40">
            <div className="mx-auto w-full px-4 sm:px-6">
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
    </header>
  );
};
