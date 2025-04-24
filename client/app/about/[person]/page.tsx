'use client';

import { useBreadcrumb } from '@/shared/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

// Import profile components
import JuusoProfile from './juuso';
import KassuProfile from './kassu';

export default function ProfilePage({ params }: { params: Promise<{ person: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { person } = resolvedParams;
  const { setCurrentPageTitle } = useBreadcrumb();

  // Format the person name for display
  const formattedName = person.charAt(0).toUpperCase() + person.slice(1);

  // Set the current page title
  useEffect(() => {
    document.title = `${formattedName} | Profile`;
    setCurrentPageTitle(formattedName);
  }, [formattedName, setCurrentPageTitle]);

  // Render the appropriate profile component based on the person parameter
  switch (person.toLowerCase()) {
    case 'juuso':
      return <JuusoProfile />;
    case 'kassu':
      return <KassuProfile />;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-default-600 mb-6">The profile you are looking for does not exist.</p>
          <button
            type="button"
            onClick={() => router.push('/about')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to About
          </button>
        </div>
      );
  }
}
