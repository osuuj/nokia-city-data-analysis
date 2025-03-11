'use client';

import { Providers } from '@/app/providers';
import { filters } from '@/components/filters/filters-data';
import Sidebar from '@/components/layout/sidebar';
import { sectionItems } from '@/components/layout/sidebar-items';
import Logo from '@/components/ui/osuuj-icon';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import {
  Button,
  Drawer, // ✅ Import Drawer for mobile sidebar
  DrawerBody,
  DrawerContent,
  ScrollShadow,
  Spacer,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // ✅ Controls sidebar visibility
  const pathname = usePathname();
  const currentPath = pathname.split('/')?.[1] || 'home';

  const sidebarContent = (
    <div className="relative flex h-full w-72 flex-1 flex-col p-6">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-15 w-15 items-center justify-center">
          <Logo />
        </div>
      </div>

      <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
        <Sidebar
          defaultSelectedKey="home"
          selectedKeys={[currentPath]}
          items={sectionItems}
          filters={filters}
        />
      </ScrollShadow>

      <Spacer y={4} />
      <div className="mt-auto flex flex-col">
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
        {/* ✅ Sidebar is always visible on large screens */}
        <div className="hidden sm:block w-72">{sidebarContent}</div>

        <div className="flex flex-1 flex-col p-4">
          <header className="flex h-16 items-center gap-2 rounded-medium border-small border-divider px-4">
            {/* ✅ Button to open sidebar on small screens */}
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

          {/* ✅ Mobile Sidebar Drawer */}
          <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
            <DrawerContent>
              <DrawerBody>{sidebarContent}</DrawerBody>
            </DrawerContent>
          </Drawer>

          {/* ✅ Forward the child content (which is the `page.tsx` content) */}
          <main className="mt-4 h-full w-full overflow-hidden">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
