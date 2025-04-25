import type { TeamMember } from '@/features/team/types';
import { Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

interface ProfileHeaderProps {
  member: TeamMember;
}

export default function ProfileHeader({ member }: ProfileHeaderProps) {
  const { name, jobTitle, bio, avatarSrc, socialLinks } = member;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <header
        className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-large bg-content1 shadow-small backdrop-blur-md bg-opacity-85 border border-content2"
        aria-labelledby="profile-name"
      >
        <Avatar
          src={avatarSrc}
          className="w-32 h-32"
          isBordered
          color="primary"
          size="lg"
          alt={`${name}'s profile picture`}
        />
        <div className="flex-grow text-center md:text-left">
          <h1 id="profile-name" className="text-3xl font-bold mb-2">
            {name}
          </h1>
          <p className="text-xl text-default-500 mb-4" aria-label="Job title">
            {jobTitle}
          </p>
          <p className="text-default-600 mb-4">{bio}</p>
          <nav aria-label="Social links" className="flex gap-4 justify-center md:justify-start">
            {socialLinks?.github && (
              <Button
                as={Link}
                href={socialLinks.github}
                color="primary"
                variant="flat"
                startContent={<Icon icon="mdi:github" aria-hidden="true" />}
                aria-label={`Visit ${name}'s GitHub profile`}
              >
                GitHub
              </Button>
            )}
            {socialLinks?.linkedin && (
              <Button
                as={Link}
                href={socialLinks.linkedin}
                color="primary"
                variant="flat"
                startContent={<Icon icon="mdi:linkedin" aria-hidden="true" />}
                aria-label={`Visit ${name}'s LinkedIn profile`}
              >
                LinkedIn
              </Button>
            )}
          </nav>
        </div>
      </header>
    </motion.div>
  );
}
