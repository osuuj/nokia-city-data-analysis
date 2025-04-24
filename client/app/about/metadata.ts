import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Osuuj Company Search Platform',
  description:
    'Learn about our team and mission to connect communities with local businesses through powerful search and analytics tools.',
  openGraph: {
    title: 'About Us | Osuuj Company Search Platform',
    description:
      'Learn about our team and mission to connect communities with local businesses through powerful search and analytics tools.',
    type: 'website',
    url: 'https://osuuj.com/about',
    images: [
      {
        url: 'https://img.heroui.chat/image/og?w=1200&h=630&u=about',
        width: 1200,
        height: 630,
        alt: 'Osuuj Team',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Osuuj Company Search Platform',
    description:
      'Learn about our team and mission to connect communities with local businesses through powerful search and analytics tools.',
    images: ['https://img.heroui.chat/image/og?w=1200&h=630&u=about'],
  },
};
