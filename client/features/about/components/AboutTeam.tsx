import { TeamMemberCard, TeamMemberCardSkeleton } from '@/features/about/components';
import { useTeamMembers } from '@/features/about/hooks';

/**
 * Component that displays the team members section of the About page.
 */
export function AboutTeam() {
  const { data: teamMembers, isLoading, error } = useTeamMembers();

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-10 mb-4">Meet the Team</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <TeamMemberCardSkeleton />
            <TeamMemberCardSkeleton />
          </>
        ) : error ? (
          <div className="col-span-2 text-center text-danger">
            <p>Failed to load team members. Please try again later.</p>
          </div>
        ) : (
          teamMembers?.map((member) => <TeamMemberCard key={member.id} member={member} />)
        )}
      </div>
    </div>
  );
}
