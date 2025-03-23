'use client';

import { Providers } from '@/app/context/Providers';
import { ThemeSwitch } from '@/components/common/Theme/ThemeSwitch';
import { GithubIcon } from '@/components/icons/Icons';
import { HomeFooter } from '@/components/layout/HomeFooter/HomeFooter';
import { SidebarWrapper } from '@/components/sidebar/SidebarWrapper';
import { siteConfig } from '@/config/site';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

/**
 * Layout for the `/home` route.
 * Includes sidebar, header, theme switch, and GitHub link.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isCompact = isCollapsed || isMobile;

  const onToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen flex-row w-full overflow-hidden">
      <SidebarWrapper isCollapsed={isCollapsed} onToggle={onToggle} />

      <div className="flex-1 flex-grow transition-all duration-300 min-w-0 h-full">
        <header className="flex items-center justify-between w-full transition-all duration-300 border-b border-divider md:p-4 p-1">
          <div className="flex items-center flex-shrink-0 md:flex transition-all duration-300">
            <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
              <Icon
                className="text-default-500"
                height={24}
                icon="solar:sidebar-minimalistic-outline"
                width={24}
              />
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto flex-shrink flex-wrap">
            <Button isIconOnly radius="full" variant="light" aria-label="GitHub">
              <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                <GithubIcon className="text-default-500" width={20} />
              </Link>
            </Button>
            <ThemeSwitch aria-label="Toggle theme" />
          </div>
        </header>

        <Providers>
          <main className="flex-1 mt-1 w-full overflow-x-auto">{children}</main>
        </Providers>

        <HomeFooter />
      </div>
    </div>
  );
}
