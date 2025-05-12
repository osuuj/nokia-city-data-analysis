/**
 * Configuration object for site-wide metadata and navigation.
 */
export const siteConfig = {
  name: 'Osuuj.ai',
  description:
    'Find Companies in Finland Close to You - Business Data Analytics and Visualization Platform',

  hero: {
    title: {
      before: 'Find ',
      highlight: 'Companies in Finland ',
      after: 'Close to You.',
    },
    description:
      "We built this platform to showcase our skills and abilities. Without industry experience, it's challenging to get opportunities—so we created this project to prove our expertise in real-world applications.",
  },

  navItems: [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
  ],

  footerNav: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Project', href: '/project' },
    { name: 'Resources', href: '/resources' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],

  links: {
    github: 'https://github.com/osuuj/nokia-city-data-analysis',
    website: 'https://osuuj.ai',
  },

  socialLinks: [
    {
      name: 'GitHub',
      href: 'https://github.com/osuuj/nokia-city-data-analysis',
      icon: 'fontisto:github',
    },
  ],
};

/**
 * Type definition for the `siteConfig` object.
 */
export type SiteConfig = typeof siteConfig;
