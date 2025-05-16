'use client';

import { TeamMemberCard } from '@/features/about/components/ui/TeamMemberCard';
import { useTeamMembers } from '@/features/about/hooks';
import { BasicCardSkeleton } from '@/shared/components/loading';
import { motion } from 'framer-motion';

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
              We first met back in 2010 at Turku University of Applied Sciences, both studying
              electronic engineering. Back then, we shared a clear goal — we wanted to work at
              Nokia. At the time, it was the place to be if you were an engineer in Finland. But
              things didn’t quite go the way we planned. Before we even finished our degrees, Nokia
              started going through big changes. The opportunities we had hoped for were suddenly
              gone, and we had to start thinking about new directions for our futures.
            </p>
            <p className="mb-6 text-default-700">
              After that, life took us on different paths. Juuso decided to dive into finance and
              continued his studies at the Turku School of Economics. Kassu, on the other hand,
              found a new passion in programming and went on to study computer science at the
              University of Turku.
            </p>
            <p className="mb-6 text-default-700">
              And then came another challenge. Just as we were both finishing our studies and
              getting ready to enter the job market, the COVID-19 pandemic hit. Everything slowed
              down. Companies froze hiring, and the uncertainty made it hard to plan anything. Kassu
              was lucky and managed to land a job in software development. For Juuso, it wasn’t that
              simple. There were a lot of applications sent, a lot of waiting, and not many replies.
              It was a tough period — full of setbacks and second-guessing — but we both kept going.
            </p>
            <p className="mb-6 text-default-700">
              Eventually, our paths crossed again — and this time, it felt like the right moment.
              Generative AI was just starting to take off, and it opened up a whole new world of
              possibilities. We found ourselves talking more, bouncing around ideas, and realizing
              that we still had that drive to create something meaningful — something of our own. AI
              became like a quiet third team member. It didn’t solve everything, but it gave us
              momentum — the ability to prototype faster, test ideas quickly, and keep moving even
              when we weren’t sure what the next step was. That made all the difference.
            </p>
            <p className="mb-6 text-default-700">
              But there’s some irony, too. The same AI that helped us build this project is also
              making it harder for people like us to get hired. Many companies are hiring less,
              especially for junior-level roles, because they expect AI to fill the gaps. So while
              AI opened one door, it closed another — at least for now.
            </p>
            <p className="mb-6 text-default-700">
              Still, we decided to build something real. Not just a tech demo or portfolio project,
              but something people could actually use. That’s how this platform started — as a way
              to help people discover local businesses, find opportunities close to home, and
              connect with their communities in a more meaningful way. It hasn’t been easy. We’ve
              had to learn everything by doing — from tech to design to understanding what people
              actually need. We’ve made mistakes, changed directions, and hit plenty of dead ends.
              But we’re still here. Still building. Still listening to feedback and improving as we
              go.
            </p>
            <p className="mb-6 text-default-700">
              We don’t have all the answers. But we believe in what we’re doing, and we’re not
              giving up.
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

        {/*
        // --- Save for later use: Join The Team CTA ---
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
      */}
      </div>
    </section>
  );
}
