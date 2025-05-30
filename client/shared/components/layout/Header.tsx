'use client';

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { NotificationsCard } from '@/shared/components/ui/notifications-card';
import { ThemeSwitch } from '@/shared/components/ui/theme';
import { useNotificationStore } from '@/shared/context/notifications/store';
import { dedupeClasses, siteConfig } from '@shared/config';
import { GithubIcon, OsuujLogo } from '@shared/icons';
import Breadcrumbs from './Breadcrumbs';

const navbarItems = [
  { href: '/dashboard', label: 'Dashboard' },
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
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const currentPathname = usePathname() || '';
  const router = useRouter();

  // Get unread count from notification store
  const unreadCount = useNotificationStore(
    (state) => state.notifications.filter((n) => !n.isRead).length,
  );

  // Set mounted state after hydration to prevent mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if we're on the landing page
  const isLandingPage = currentPathname === '/';

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

    // Navigate to the destination
    router.push(href);

    // Reset clicked item after a short delay
    setTimeout(() => {
      setClickedItem(null);
    }, 300);
  };

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

  // Only render client-side to prevent hydration issues
  if (!isMounted) return null;

  return (
    <header ref={headerRef} className="fixed top-0 inset-x-0 z-[100]" data-testid="header">
      <div
        className={`w-full ${
          isBlackBgPage
            ? 'bg-black text-white'
            : 'bg-background/90 backdrop-blur-md text-foreground'
        } ${isMenuOpen ? 'shadow-md' : ''}`}
      >
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
            <div
              className={dedupeClasses(
                'flex gap-1 px-2 py-1 rounded-full bg-content2 dark:bg-content1 backdrop-blur-md',
              )}
            >
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
              <NavbarItem>
                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <Button
                      isIconOnly
                      radius="none"
                      variant="light"
                      aria-label="Notifications"
                      className="relative hover:rounded-md"
                    >
                      <Icon icon="solar:bell-linear" className="text-default-700" width={24} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-warning-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium px-[2px]">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <NotificationsCard className="border-none shadow-none" />
                  </PopoverContent>
                </Popover>
              </NavbarItem>
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
                {isMounted && (
                  <ThemeSwitch className="theme-switch-triangle-hover" aria-label="Toggle theme" />
                )}
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
        {isMounted && shouldShowBreadcrumbs && (
          <div className={`w-full py-2 border-divider/40 ${isLandingPage ? 'hidden' : ''}`}>
            <div className="mx-auto w-full px-4 sm:px-6">
              <Breadcrumbs />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
