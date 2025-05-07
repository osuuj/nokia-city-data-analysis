import ContactLoadingSkeleton from '@/features/contact/components/ContactLoadingSkeleton';
import { Suspense } from 'react';
// Server Component
import ContactPageWrapper from '../../features/contact/components/ContactPageWrapper';

// Add explicit metadata export for better SEO
export const metadata = {
  title: 'Contact Us | Nokia City Data',
  description:
    'Get in touch with the Nokia City Data team. Contact information for our developers.',
  openGraph: {
    title: 'Contact the Nokia City Data Team',
    description:
      'Get in touch with our development team for any inquiries about city data analysis.',
  },
};

// Team member data that will be passed to the client component
const teamMembers = [
  {
    name: 'Juuso Juvonen',
    role: 'Lead Developer',
    email: 'superjuuso@gmail.com',
    socialLinks: [
      {
        icon: 'logos:linkedin-icon',
        href: 'https://linkedin.com/in/jutoju',
        label: 'linkedin.com/in/jutoju',
      },
      {
        icon: 'logos:github-icon',
        href: 'https://github.com/osuuj',
        label: 'github.com/osuuj',
      },
    ],
  },
  {
    name: 'Kasperi Rautio',
    role: 'Developer',
    email: 'kasperi.rautio@gmail.com',
    socialLinks: [
      {
        icon: 'logos:linkedin-icon',
        href: 'https://linkedin.com/in/kasperi-rautio',
        label: 'linkedin.com/in/kasperi-rautio',
      },
      {
        icon: 'logos:github-icon',
        href: 'https://github.com/kasperi-r',
        label: 'github.com/kasperi-r',
      },
    ],
  },
];

/**
 * Contact page component.
 * Server component that passes data to the client component.
 * Uses Suspense with skeleton loading for improved loading experience.
 */
export default function ContactPage() {
  return (
    <Suspense fallback={<ContactLoadingSkeleton />}>
      <ContactPageWrapper
        teamMembers={teamMembers}
        email="team@nokiacitydata.com"
        description="Have questions about our city data analysis projects? Feel free to reach out to our team via email."
        responseTime="We typically respond to inquiries within 1-2 business days."
      />
    </Suspense>
  );
}
