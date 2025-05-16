'use client';

import {
  ProfileContact,
  ProfileExperience,
  ProfileHero,
  ProfileProjects,
  ProfileSkills,
  ProfileTestimonials,
} from '@/features/about/components/sections';
import { useProfileData } from '@/features/about/hooks';
import { ErrorMessage } from '@/shared/components/error';
import { StandardFallback } from '@/shared/components/loading';
import { Suspense } from 'react';
import { ProfilePage } from './ProfilePage';

type DynamicProfilePageProps = {
  profileId: string;
};

/**
 * Dynamic profile page that loads data based on profile ID
 * This replaces the need for individual profile page components
 */
export default function DynamicProfilePage({ profileId }: DynamicProfilePageProps) {
  const { data, error, isLoading } = useProfileData(profileId);

  if (error) {
    return <ErrorMessage message={`Error loading profile: ${error.message}`} />;
  }

  if (isLoading) {
    return <StandardFallback />;
  }

  if (!data) {
    return <ErrorMessage message={`Profile not found: ${profileId}`} />;
  }

  return (
    <Suspense fallback={<StandardFallback />}>
      <ProfilePage
        name={profileId}
        heroSection={<ProfileHero {...data.hero} />}
        skillsSection={
          <ProfileSkills
            skills={data.skills.items}
            title={data.skills.title}
            description={data.skills.description}
          />
        }
        experienceSection={
          <ProfileExperience
            experience={data.experience}
            description={
              profileId === 'juuso'
                ? 'Development journey and key achievements'
                : 'Backend engineering journey and key achievements'
            }
            profileId={profileId}
            showCVButton={false}
          />
        }
        projectsSection={
          <ProfileProjects
            projects={data.projects.items}
            title={data.projects.title}
            description={data.projects.description}
            categoryDefault={data.projects.categoryDefault}
          />
        }
        testimonialsSection={<ProfileTestimonials testimonials={data.testimonials} />}
        contactSection={
          <ProfileContact
            contact={data.contact}
            socialLinks={data.socialLinks}
            specialization={profileId === 'juuso' ? 'frontend development' : 'backend architecture'}
            profileId={profileId}
          />
        }
      />
    </Suspense>
  );
}
