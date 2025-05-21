'use client';

import { OsuujLogo } from '@/shared/icons';
import { Button, ScrollShadow, Spacer, Tooltip, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
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

  if (!mounted) {
    return null; // Prevent flash of unstyled content
  }

  return (
    <nav
      className={cn(
        'relative flex h-screen flex-col border-r border-divider p-6 transition-all duration-300 overflow-y-auto',
        {
          'w-72 md:w-52 sm:w-5 px-4': !isCompact,
          'w-16 items-center px-2 py-6': isCompact,
        },
      )}
      aria-label="Main Navigation"
    >
      {/* Top: Logo + collapse toggle */}
      <div
        className={cn('flex items-center gap-3 px-3 flex-shrink-0', {
          'justify-center gap-0': isCompact,
        })}
      >
        <Link href="/" className="flex h-10 w-10 items-center justify-center">
          <OsuujLogo />
        </Link>

        {showCollapseButton && (
          <Tooltip
            content={<span className="text-foreground">Collapse sidebar</span>}
            placement="right"
          >
            <Button
              isIconOnly
              variant="light"
              className="ml-auto h-9 w-9 text-default-500"
              onPress={handleToggle}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon
                icon="solar:sidebar-minimalistic-outline"
                className="text-default-500"
                width={18}
                aria-hidden="true"
              />
            </Button>
          </Tooltip>
        )}
      </div>

      <Spacer y={2} />

      {/* Middle: Sidebar */}
      <ScrollShadow className="-mr-6 flex-1 overflow-y-auto py-6 pr-6">
        <Sidebar defaultSelectedKey="dashboard" isCompact={isCompact} items={sectionItems} />
      </ScrollShadow>

      <Spacer y={2} />

      {/* Bottom: Help + expand toggle */}
      <div
        className={cn('mt-auto flex flex-col gap-2 flex-shrink-0', { 'items-center': isCompact })}
      >
        <Tooltip content="Help & Feedback" isDisabled={!isCompact} placement="right">
          <Link href="/resources" className="w-full">
            <Button
              fullWidth
              className={cn('justify-start truncate text-default-500 hover:text-foreground', {
                'justify-center': isCompact,
              })}
              isIconOnly={isCompact}
              startContent={
                isCompact ? null : (
                  <Icon
                    className="text-default-500"
                    icon="solar:info-circle-line-duotone"
                    width={24}
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
                />
              ) : (
                'Help & Information'
              )}
            </Button>
          </Link>
        </Tooltip>

        {isCompact && mounted && !isMobile && (
          <Tooltip
            content={<span className="text-foreground">Expand sidebar</span>}
            placement="right"
          >
            <Button
              isIconOnly
              variant="light"
              className="mt-2 h-10 w-10 text-default-500"
              onPress={handleToggle}
              aria-expanded={!isCollapsed}
              aria-label="Expand sidebar"
            >
              <Icon
                icon="solar:sidebar-minimalistic-outline"
                className="text-default-500"
                width={18}
                aria-hidden="true"
              />
            </Button>
          </Tooltip>
        )}
      </div>
    </nav>
  );
};
