import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Osuuj Company Search Platform',
  description:
    'Explore our data-driven projects showcasing local business analytics, market insights, and community development initiatives.',
  openGraph: {
    title: 'Projects | Osuuj Company Search Platform',
    description:
      'Explore our data-driven projects showcasing local business analytics, market insights, and community development initiatives.',
    type: 'website',
    url: 'https://osuuj.com/project',
    images: [
      {
        url: 'https://img.heroui.chat/image/og?w=1200&h=630&u=project',
        width: 1200,
        height: 630,
        alt: 'Osuuj Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Osuuj Company Search Platform',
    description:
      'Explore our data-driven projects showcasing local business analytics, market insights, and community development initiatives.',
    images: ['https://img.heroui.chat/image/og?w=1200&h=630&u=project'],
  },
};
