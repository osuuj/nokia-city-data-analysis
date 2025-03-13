'use client';
import { Providers } from '@/app/providers';
import { filters } from '@/components/filters/filters-data';
import Sidebar from '@/components/layout/sidebar';
import SidebarDrawer from '@/components/layout/sidebar-drawer';
import { sectionItems } from '@/components/layout/sidebar-items';
import Logo from '@/components/ui/osuuj-icon';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { Button, Divider, ScrollShadow, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();
  const currentPath = pathname.split('/')?.[1] || 'home';

  const content = (
    <div className="relative flex h-full w-80 flex-1 flex-col p-4">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-15 w-15 items-center justify-center">
          <Logo />
        </div>
      </div>

      <ScrollShadow className=" h-full max-h-full py-4 pr-6">
        <Sidebar
          defaultSelectedKey="home"
          selectedKeys={[currentPath]}
          items={sectionItems}
          filters={filters}
        />
      </ScrollShadow>

      <div className="mt-auto flex flex-col">
        <Divider className="my-2" />
        <Button
          fullWidth
          className="justify-start text-default-500 data-[hover=true]:text-foreground"
          startContent={
            <Icon className="text-default-500" icon="solar:info-circle-line-duotone" width={24} />
          }
          variant="light"
        >
          Help & Information
        </Button>
      </div>
    </div>
  );

  return (
    <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
      <div className="flex h-dvh w-full">
        <SidebarDrawer isOpen={isOpen} onOpenChange={onOpenChange}>
          {content}
        </SidebarDrawer>
        <div className="flex flex-1 flex-col p-4">
          <header className="flex h-16 items-center gap-2 rounded-medium border-small border-divider px-4">
            <Button
              isIconOnly
              className="flex sm:hidden"
              size="sm"
              variant="light"
              onPress={onOpen}
            >
              <Icon
                className="text-default-500"
                height={24}
                icon="solar:hamburger-menu-outline"
                width={24}
              />
            </Button>
            <ThemeSwitch className="fixed right-4 z-50 p-2 shadow-lg" />
            <h2 className="text-medium font-medium text-default-700">Overview</h2>
          </header>
          <main className="flex-1 mt-4 h-full w-full overflow-hidden">{children}</main>
          <footer className="flex h-16 items-center justify-center gap-2 rounded-medium border-small border-divider px-4">
            <p className="text-default-500 text-small">
              © 2025 <strong>Osuuj</strong>. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </Providers>
  );
}
