import type { SidebarItem } from '@/components/layout/sidebar';

export const sectionItems: SidebarItem[] = [
  {
    key: 'overview',
    title: 'Overview',
    items: [
      {
        key: 'home',
        href: '/home',
        icon: 'solar:home-bold',
        title: 'Home',
      },
      {
        key: 'project',
        href: '/project',
        icon: 'solar:clipboard-heart-bold',
        title: 'Project',
      },
      {
        key: 'resources',
        href: '/resources',
        icon: 'solar:lightbulb-bolt-bold',
        title: 'Resources',
      },
      {
        key: 'about-us',
        href: '#',
        icon: 'solar:ghost-smile-bold',
        title: 'About Us',
        // type: SidebarItemType.Nest,
        // items: [
        //   {
        //     key: 'about-juuso',
        //     href: '/about/juuso',
        //     icon: 'solar:ghost-bold',
        //     title: 'Juuso',
        //   },
        //   {
        //     key: 'about-kassu',
        //     href: '/about/kassu',
        //     icon: 'solar:incognito-bold',
        //     title: 'Kassu',
        //   },
        // ],
      },
      {
        key: 'contact',
        href: '/contact',
        icon: 'solar:hand-shake-bold',
        title: 'Contact',
      },
    ],
  },
  {
    key: 'tabs',
    title: 'Tabs',
    items: [
      {
        key: 'map',
        href: '#',
        title: 'Map',
        icon: 'solar:compass-big-bold',
      },
      {
        key: 'table',
        href: '#',
        icon: 'solar:window-frame-bold',
        title: 'Table',
      },
      {
        key: 'analytics',
        href: '#',
        icon: 'solar:chart-bold',
        title: 'Analytics',
      },
    ],
  },
];

export const sectionItemsWithTabs: SidebarItem[] = [...sectionItems];
