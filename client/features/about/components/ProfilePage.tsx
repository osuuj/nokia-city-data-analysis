import React from 'react';
import { useProfileData } from '../hooks/useProfileData';
import AboutErrorBoundary from './AboutErrorBoundary';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';
import ProfileHeader from './ProfileHeader';
import ProfileSkeleton from './ProfileSkeleton';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';

interface ProfilePageProps {
  id: string;
}

export default function ProfilePage({ id }: ProfilePageProps) {
  const { data: profile, isLoading, error } = useProfileData(id);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-danger mb-4">Error Loading Profile</h2>
        <p className="text-content2">Failed to load profile data. Please try again later.</p>
      </div>
    );
  }

  return (
    <AboutErrorBoundary>
      <main className="space-y-8" aria-label={`${profile.member.name}'s profile`}>
        <ProfileHeader member={profile.member} />
        <SkillsSection skills={profile.skills} />
        <ProjectsSection projects={profile.projects} />
        <ExperienceSection experiences={profile.experience || []} />
        <EducationSection education={profile.education || []} />
      </main>
    </AboutErrorBoundary>
  );
}
