import { ContactLoadingSkeleton, ContactPageWrapper } from '@/features/contact/components';
import { teamMembers } from '@/features/contact/data';
import { Suspense } from 'react';

// Note: Metadata is now handled by the dedicated metadata.ts file

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
        email="team@osuuj.ai"
        description="Have questions about our city data analysis projects? Feel free to reach out to our team via email."
        responseTime="We typically respond to inquiries within 1-2 business days."
      />
    </Suspense>
  );
}
