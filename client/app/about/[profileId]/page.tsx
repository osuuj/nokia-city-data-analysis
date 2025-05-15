'use client';

import { profileDataMap } from '@/features/about/data';
import DynamicProfilePage from '@/features/about/pages/DynamicProfilePage';
import { ErrorMessage } from '@/shared/components/error';
import { Header } from '@/shared/components/layout';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Dynamic route handler for profile pages
 * This provides a single entry point for all team member profiles
 */
export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  // Extract profileId from pathname
  const profileId = pathname.split('/').pop() || '';

  // Validate that the profile exists in our data map
  const isValidProfile = profileId in profileDataMap;

  // Redirect to about page for invalid profiles
  useEffect(() => {
    if (!isValidProfile) {
      // Display error briefly before redirecting
      const timer = setTimeout(() => {
        router.push('/about');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isValidProfile, router]);

  if (!isValidProfile) {
    return (
      <>
        <AnimatedBackground priority="high" />
        <Header />
        <main className="pt-16 relative z-10">
          <ErrorMessage message={`Profile not found: ${profileId}`} />
        </main>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground priority="high" />
      <Header />
      <main className="pt-16 relative z-10">
        <DynamicProfilePage profileId={profileId} />
      </main>
    </>
  );
}
