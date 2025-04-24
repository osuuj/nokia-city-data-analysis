import type { SidebarItem } from './Sidebar';

/**
 * sectionItems
 * Data for sidebar sections and navigation links.
 */
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
        href: '/about',
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
];
