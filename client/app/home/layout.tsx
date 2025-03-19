'use client';
import { Providers } from '@/app/context/Providers';
import { ThemeSwitch } from '@/components/common/ThemeSwitch';
import { GithubIcon } from '@/components/icons/Icons';
import HomeFooter from '@/components/layout/HomeFooter';
import SidebarWrapper from '@/components/sidebar/SidebarWrapper';
import { siteConfig } from '@/config/site';
import { Button, Link, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isCompact = isCollapsed || isMobile; // ✅ Now available here

  const onToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* ✅ Sidebar */}
      <SidebarWrapper isCollapsed={isCollapsed} onToggle={onToggle} />

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col p-4 max-w-[calc(100vw-80px)]">
        {/* ✅ HEADER */}
        <header
          className={cn(
            'flex items-center justify-between w-full transition-all duration-300',
            !isCompact ? 'pl-72 md:pl-64 sm:pl-56' : 'pl-16',
          )}
        >
          {/* ✅ Sidebar Toggle (Left) - Moves when screen shrinks */}
          <div className="flex items-center flex-shrink-0 sm:hidden md:flex transition-all duration-300">
            <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
              <Icon
                className="text-default-500"
                height={24}
                icon="solar:sidebar-minimalistic-outline"
                width={24}
              />
            </Button>
          </div>

          {/* ✅ GitHub & Theme Switch (Right) - Always Visible */}
          <div className="flex items-center gap-2 ml-auto flex-shrink flex-wrap">
            <Button isIconOnly radius="full" variant="light" aria-label="GitHub">
              <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                <GithubIcon className="text-default-500" width={20} />
              </Link>
            </Button>
            <ThemeSwitch aria-label="Toggle theme" />
          </div>
        </header>

        {/* ✅ MAIN CONTENT */}
        <Providers>
          <main className="flex-1 mt-4 w-full overflow-x-auto">{children}</main>
        </Providers>

        {/* ✅ FOOTER */}
        <div className="mt-auto">
          <HomeFooter />
        </div>
      </div>
    </div>
  );
}
