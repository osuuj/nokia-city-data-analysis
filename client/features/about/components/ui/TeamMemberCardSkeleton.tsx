'use client';

import { BasicCardSkeleton } from '@/shared/components/loading/CardSkeletons';

/**
 * @deprecated - Use BasicCardSkeleton from shared/components/loading/CardSkeletons instead
 * This component will be removed in a future release.
 */
export function TeamMemberCardSkeleton() {
  return <BasicCardSkeleton withImage={true} withFooter={true} descriptionLines={3} tagCount={3} />;
}
