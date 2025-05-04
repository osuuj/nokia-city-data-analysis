'use client';

import { Button, ScrollShadow, Spacer, Tooltip, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import { OsuujLogo } from '@shared/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { Sidebar } from './Sidebar';
import { sectionItems } from './SidebarItems';

/**
 * SidebarWrapper
 * Handles sidebar layout, collapse toggle, and responsive behavior.
 */
export const SidebarWrapper = () => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only update isCompact after component is mounted to prevent hydration mismatch
  useEffect(() => {
    if (mounted) {
      setIsCompact(isMobile || isCollapsed);
    }
  }, [mounted, isMobile, isCollapsed]);

  // Explicitly determine if we should show the collapse button
  const showCollapseButton = mounted && !isCompact && !isMobile;

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Handle navigation to home page
  const handleHomeNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    router.push('/');
  };

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-divider transition-all duration-300',
        {
          'w-72 md:w-64 sm:w-20 p-6': !isCompact,
          'w-20 p-4': isCompact,
        },
      )}
    >
      {/* Top: Logo + collapse toggle */}
      <div className={cn('flex items-center', { 'justify-center': isCompact })}>
        <button
          type="button"
          onClick={handleHomeNavigation}
          className="flex h-10 w-10 items-center justify-center outline-none focus:outline-none border-none bg-transparent cursor-pointer"
          aria-label="Go to home page"
          disabled={isNavigating}
        >
          <OsuujLogo />
        </button>

        {showCollapseButton && (
          <Tooltip content="Collapse sidebar" placement="right">
            <Button
              isIconOnly
              variant="light"
              className="ml-auto h-9 w-9 text-default-500"
              onPress={handleToggle}
            >
              <Icon
                icon="solar:sidebar-minimalistic-outline"
                className="text-default-500"
                width={18}
              />
            </Button>
          </Tooltip>
        )}
      </div>

      <Spacer y={4} />

      {/* Middle: Sidebar */}
      <ScrollShadow className="h-full max-h-full">
        <Sidebar defaultSelectedKey="dashboard" isCompact={isCompact} items={sectionItems} />
      </ScrollShadow>

      <Spacer y={4} />

      {/* Bottom: Help + expand toggle */}
      <div
        className={cn('mt-auto flex flex-col gap-2', {
          'items-center': isCompact,
        })}
      >
        <Tooltip content="Help & Feedback" isDisabled={!isCompact} placement="right">
          <Link
            href="/resources"
            className={cn('w-full', {
              'flex justify-center': isCompact,
            })}
          >
            <Button
              fullWidth={!isCompact}
              className={cn('truncate text-default-500 hover:text-foreground', {
                'justify-center w-10 h-10': isCompact,
                'justify-start': !isCompact,
              })}
              isIconOnly={isCompact}
              startContent={
                isCompact ? null : (
                  <Icon
                    className="text-default-500"
                    icon="solar:info-circle-line-duotone"
                    width={24}
                    height={24}
                  />
                )
              }
              variant="light"
            >
              {isCompact ? (
                <Icon
                  className="text-default-500"
                  icon="solar:info-circle-line-duotone"
                  width={24}
                  height={24}
                />
              ) : (
                'Help & Information'
              )}
            </Button>
          </Link>
        </Tooltip>

        {isCompact && mounted && !isMobile && (
          <Tooltip content="Expand sidebar" placement="right">
            <Button
              isIconOnly
              variant="light"
              className="flex items-center justify-center h-10 w-10 text-default-500"
              onPress={handleToggle}
            >
              <Icon
                icon="solar:sidebar-minimalistic-outline"
                className="text-default-500"
                width={18}
                height={18}
              />
            </Button>
          </Tooltip>
        )}
      </div>
    </aside>
  );
};
