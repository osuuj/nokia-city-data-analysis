'use client';

import { TeamMemberCard } from '@/features/about/components/ui/TeamMemberCard';
import { useTeamMembers } from '@/features/about/hooks';
import { BasicCardSkeleton } from '@/shared/components/loading';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Enhanced Team component that displays team story and members
 * Replaces AboutStory and AboutTeam components
 */
export function Team() {
  const { data: teamMembers, isLoading, error } = useTeamMembers();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Team Story Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
              Our Story
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 h-1 bg-primary rounded"
              />
            </h1>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
            <p className="mb-6 text-default-700">
              We started this project to help people discover local companies with powerful tools
              like interactive search and maps. Our mission is to connect communities with local
              businesses and provide resources that help both sides thrive.
            </p>
            <p className="mb-6 text-default-700">
              What began as a simple idea has grown into a comprehensive platform that serves
              thousands of users. We're constantly expanding our features and improving the
              experience based on community feedback.
            </p>
            <p className="text-default-700">
              Our team is passionate about supporting local economies and building technology that
              makes a real difference in how people discover and connect with businesses in their
              communities.
            </p>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative">
            Meet the Team
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-0 h-1 bg-primary rounded"
            />
          </h2>
          <p className="text-default-600 max-w-3xl mx-auto mb-10">
            Our talented team is dedicated to building innovative solutions for local businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {isLoading ? (
            <>
              <BasicCardSkeleton
                withImage={true}
                withFooter={true}
                descriptionLines={3}
                tagCount={3}
              />
              <BasicCardSkeleton
                withImage={true}
                withFooter={true}
                descriptionLines={3}
                tagCount={3}
              />
            </>
          ) : error ? (
            <div className="col-span-2 text-center text-danger">
              <p>Failed to load team members. Please try again later.</p>
            </div>
          ) : (
            teamMembers?.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <TeamMemberCard member={member} />
              </motion.div>
            ))
          )}
        </div>

        {/* Join The Team CTA */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="mb-6 text-default-600 max-w-3xl mx-auto">
              Interested in joining our mission? We're always looking for talented and passionate
              individuals to join our team.
            </p>
            <Button
              as={Link}
              href="/contact"
              color="primary"
              size="lg"
              endContent={<Icon icon="lucide:users" />}
            >
              Join Our Team
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
