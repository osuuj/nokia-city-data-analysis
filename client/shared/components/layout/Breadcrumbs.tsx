'use client';

import { useBreadcrumb } from '@/shared/context';
import { capitalizeFirst, formatLabel } from '@/shared/utils/formatting';
import {
  BreadcrumbItem as HeroBreadcrumbItem,
  Breadcrumbs as HeroBreadcrumbs,
} from '@heroui/react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentPageTitle } = useBreadcrumb();
  const [isNavigating, setIsNavigating] = useState(false);

  // Cache the previous valid pathname to prevent flashing during navigation
  const [previousValidPathname, setPreviousValidPathname] = useState<string | null>(null);

  // Track landing page navigation
  const isNavigatingToLanding =
    isNavigating && (previousValidPathname === '/' || previousValidPathname === '/dashboard');

  // Update previous valid pathname when pathname changes and it's not during navigation
  useEffect(() => {
    if (!isNavigating && pathname && pathname !== '/') {
      setPreviousValidPathname(pathname);
    }
  }, [pathname, isNavigating]);

  // Reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
  }, []);

  // If no items provided, generate them based on pathname
  const breadcrumbItems = useMemo(
    () => items || getDefaultBreadcrumbItems(pathname, currentPageTitle),
    [items, pathname, currentPageTitle],
  );

  // Don't show breadcrumbs on dashboard page or main navigation pages
  // Also don't show when navigating to landing page
  if (shouldHideBreadcrumbs(pathname) || isNavigatingToLanding) {
    return null;
  }

  // Handle navigation when clicking on breadcrumb items
  const handleNavigation = (href?: string) => {
    if (href) {
      setIsNavigating(true);

      // If navigating to root or dashboard, set a flag
      if (href === '/' || href === '/dashboard') {
        setPreviousValidPathname(href);
      }

      router.push(href);
    }
  };

  return (
    <div className={`w-full flex items-center justify-between ${className}`}>
      <div className="flex-1">
        <HeroBreadcrumbs size="lg" className="hidden sm:flex text-lg" underline="hover">
          {breadcrumbItems.map((item) => (
            <HeroBreadcrumbItem key={`${item.label}-${item.href || 'current'}`}>
              {item.href ? (
                <NextLink
                  href={item.href}
                  className="text-inherit hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                >
                  {item.label}
                </NextLink>
              ) : (
                <span>{item.label}</span>
              )}
            </HeroBreadcrumbItem>
          ))}
        </HeroBreadcrumbs>
        <HeroBreadcrumbs color="primary" size="sm" className="sm:hidden text-sm">
          {breadcrumbItems.map((item) => (
            <HeroBreadcrumbItem key={`${item.label}-${item.href || 'current'}`}>
              {item.href ? (
                <NextLink
                  href={item.href}
                  className="text-inherit hover:text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                >
                  {item.label}
                </NextLink>
              ) : (
                <span>{item.label}</span>
              )}
            </HeroBreadcrumbItem>
          ))}
        </HeroBreadcrumbs>
      </div>
    </div>
  );
}

// Helper function to determine if breadcrumbs should be hidden
function shouldHideBreadcrumbs(pathname: string): boolean {
  // Hide on landing page and dashboard page
  if (pathname === '/dashboard' || pathname === '/') {
    return true;
  }

  // Hide on main navigation pages (no deeper paths)
  const mainNavPaths = ['/resources', '/about', '/contact'];
  if (mainNavPaths.includes(pathname)) {
    return true;
  }

  // Always show breadcrumbs for project detail pages
  if (pathname.startsWith('/project/')) {
    return false;
  }

  return false;
}

// Helper function to generate breadcrumb items based on pathname
function getDefaultBreadcrumbItems(pathname: string, currentPageTitle?: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }];

  // Split pathname into segments
  const segments = pathname.split('/').filter(Boolean);

  // Build breadcrumb items based on segments
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // For the last segment, don't add href (current page)
    if (index === segments.length - 1) {
      // Special handling for project IDs
      if (segment.match(/^\d+$/) && segments[0] === 'project') {
        // Use the current page title if available, otherwise use a placeholder
        items.push({ label: currentPageTitle || 'Project Details' });
      } else {
        // Use shared utility to format the label
        items.push({ label: formatLabel(segment) });
      }
    } else {
      // For intermediate segments, capitalize and add href
      items.push({ label: capitalizeFirst(segment), href: currentPath });
    }
  });

  return items;
}
