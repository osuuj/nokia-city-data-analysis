'use client';

import { Card } from '@heroui/card';
import { motion } from 'framer-motion';
import React, { Suspense, lazy } from 'react';
import { useProfileData } from '../hooks/useProfileData';
import type { ProfilePageProps } from '../types';
import { AboutErrorBoundary } from './AboutErrorBoundary';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSkeleton } from './ProfileSkeleton';

// Lazy load section components
const LazySkillsSection = lazy(() => import('./lazy/LazySkillsSection'));
const LazyProjectsSection = lazy(() => import('./lazy/LazyProjectsSection'));
const LazyExperienceSection = lazy(() => import('./lazy/LazyExperienceSection'));
const LazyEducationSection = lazy(() => import('./lazy/LazyEducationSection'));

// Section loading skeletons
const SkillsSkeleton = () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />;

const ProjectsSkeleton = () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />;

const ExperienceSkeleton = () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />;

const EducationSkeleton = () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function ProfilePage({ id }: ProfilePageProps) {
  const { data: profile, isLoading, error } = useProfileData(id);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold text-danger mb-4">Error Loading Profile</h2>
        <p className="text-content2">Failed to load profile data. Please try again later.</p>
      </Card>
    );
  }

  return (
    <AboutErrorBoundary>
      <motion.main
        className="space-y-8 max-w-4xl mx-auto px-4 py-8"
        aria-label={`${profile.member.name}'s profile`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <ProfileHeader member={profile.member} />
        </motion.div>

        <Suspense fallback={<SkillsSkeleton />}>
          <motion.div variants={itemVariants}>
            <LazySkillsSection skills={profile.skills} />
          </motion.div>
        </Suspense>

        <Suspense fallback={<ProjectsSkeleton />}>
          <motion.div variants={itemVariants}>
            <LazyProjectsSection projects={profile.projects} />
          </motion.div>
        </Suspense>

        <Suspense fallback={<ExperienceSkeleton />}>
          <motion.div variants={itemVariants}>
            <LazyExperienceSection experiences={profile.experience || []} />
          </motion.div>
        </Suspense>

        <Suspense fallback={<EducationSkeleton />}>
          <motion.div variants={itemVariants}>
            <LazyEducationSection education={profile.education || []} />
          </motion.div>
        </Suspense>
      </motion.main>
    </AboutErrorBoundary>
  );
}
