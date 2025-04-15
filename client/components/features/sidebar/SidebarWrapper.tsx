'use client';

import { OsuujLogo } from '@/icons';
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

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r border-divider p-6 transition-all duration-300',
        {
          'w-72 md:w-52 sm:w-5 px-4': !isCompact,
          'w-16 items-center px-2 py-6': isCompact,
        },
      )}
    >
      {/* Top: Logo + collapse toggle */}
      <div className={cn('flex items-center gap-3 px-3', { 'justify-center gap-0': isCompact })}>
        <Link href="/" className="flex h-10 w-10 items-center justify-center">
          <OsuujLogo />
        </Link>

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

      <Spacer y={2} />

      {/* Middle: Sidebar */}
      <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
        <Sidebar defaultSelectedKey="home" isCompact={isCompact} items={sectionItems} />
      </ScrollShadow>

      <Spacer y={2} />

      {/* Bottom: Help + expand toggle */}
      <div className={cn('mt-auto flex flex-col gap-2', { 'items-center': isCompact })}>
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
          <Tooltip content="Expand sidebar" placement="right">
            <Button
              isIconOnly
              variant="light"
              className="mt-2 h-10 w-10 text-default-500"
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
    </aside>
  );
};
