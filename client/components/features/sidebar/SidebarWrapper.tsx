'use client';

import { OsuujLogo } from '@/icons';
import { Button, ScrollShadow, Spacer, Tooltip, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMediaQuery } from 'usehooks-ts';
import { Sidebar } from './Sidebar';
import { sectionItems } from './SidebarItems';

export interface SidebarWrapperProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * SidebarWrapper
 * A container for the Sidebar component with layout logic and responsiveness.
 */
export const SidebarWrapper = ({ isCollapsed, onToggle }: SidebarWrapperProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isCompact = isCollapsed || isMobile;

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
      <div className={cn('flex items-center gap-3 px-3', { 'justify-center gap-0': isCompact })}>
        <div className="flex h-10 w-10 items-center justify-center">
          <OsuujLogo />
        </div>
      </div>

      <Spacer y={2} />

      <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
        <Sidebar defaultSelectedKey="home" isCompact={isCompact} items={sectionItems} />
      </ScrollShadow>

      <Spacer y={2} />

      <div className={cn('mt-auto flex flex-col', { 'items-center': isCompact })}>
        <Tooltip content="Help & Feedback" isDisabled={!isCompact} placement="right">
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
              <Icon className="text-default-500" icon="solar:info-circle-line-duotone" width={24} />
            ) : (
              'Help & Information'
            )}
          </Button>
        </Tooltip>
      </div>
    </aside>
  );
};
