'use client';

import { Avatar, Button, ScrollShadow, Spacer, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';

import { AcmeIcon } from '@/components/acme';
import MapComponent from '@/components/map/map';
import Sidebar from '@/components/sidebar';
import SidebarDrawer from '@/components/sidebar-drawer';
import { sectionItemsWithTeams } from '@/components/sidebar-items';

/**
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */

// Define Location interface
interface Location {
  name: string;
  coordinates: [number, number]; // Ensure it's a tuple
}

// Define locations using the interface
const locations: Location[] = [
  { name: 'Location 1', coordinates: [-74.5, 40] },
  { name: 'Location 2', coordinates: [-74.6, 40.2] },
  { name: 'Location 3', coordinates: [-74.7, 40.4] },
];

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const content = (
    <div className="relative flex h-full w-72 flex-1 flex-col p-6">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
          <AcmeIcon className="text-background" />
        </div>
        <span className="text-small font-bold uppercase text-foreground">Acme</span>
      </div>
      <Spacer y={4} />
      <div className="flex items-center gap-3 px-3">
        <Avatar isBordered size="sm" src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
        <div className="flex flex-col">
          <p className="text-small font-medium text-default-600">John Doe</p>
          <p className="text-tiny text-default-400">Product Designer</p>
        </div>
      </div>

      <Spacer y={4} />

      <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
        <Sidebar defaultSelectedKey="home" items={sectionItemsWithTeams} />
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
        {/* <Button
          className="justify-start text-default-500 data-[hover=true]:text-foreground"
          startContent={
            <Icon
              className="rotate-180 text-default-500"
              icon="solar:minus-circle-line-duotone"
              width={24}
            />
          }
          variant="light"
        >
          Log Out
        </Button> */}
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh w-full">
      <SidebarDrawer
        className="!border-r-small border-divider"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        {content}
      </SidebarDrawer>
      <div className="w-full flex-1 flex-col p-4">
        <header className="flex h-16 items-center gap-2 rounded-medium border-small border-divider px-4">
          <Button isIconOnly className="flex sm:hidden" size="sm" variant="light" onPress={onOpen}>
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:hamburger-menu-outline"
              width={24}
            />
          </Button>
          <h2 className="text-medium font-medium text-default-700">Overview</h2>
        </header>
        <main className="mt-4 h-full w-full overflow-hidden">
          <div className="flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider">
            <div className="flex-1 flex flex-col">
              <h1>My Mapbox Map</h1>
              <div className="relative flex-1 w-full">
                <MapComponent locations={locations} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
