'use client';

import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Skill, TeamMember } from '../../types';

interface TeamMemberCardProps {
  member?: TeamMember;
  // Allow passing TeamMember fields directly as props for flexibility
  name?: string;
  jobTitle?: string;
  bio?: string;
  shortBio?: string;
  portfolioLink?: string;
  avatarSrc?: string;
  skills?: string[] | Skill[];
  socialLinks?: Record<string, string>;
}

export function TeamMemberCard(props: TeamMemberCardProps) {
  // Handle both direct props and member object
  const member = props.member || props;

  // Provide default values for all properties
  const {
    name = 'Team Member',
    jobTitle = 'Team Member',
    bio = '',
    shortBio = bio,
    portfolioLink = '#',
    avatarSrc = `https://img.heroui.chat/image/avatar?w=200&h=200&u=${name.toLowerCase()}`,
    skills = [],
    socialLinks = {},
  } = member;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="shadow-md h-full backdrop-blur-md bg-opacity-85 border border-content2">
        <CardHeader className="flex flex-col items-center gap-2 p-4">
          <div className="relative w-24 h-24">
            <img
              src={avatarSrc}
              alt={name}
              width={96}
              height={96}
              className="rounded-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="text-xl font-semibold text-center">{name}</h3>
          <p className="text-default-500 text-center">{jobTitle}</p>
        </CardHeader>
        <CardBody className="p-4">
          <p className="text-default-600 text-center mb-4">{shortBio}</p>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {skills.map((skill: string | Skill) => {
                // Handle both string and Skill object
                const skillName = typeof skill === 'string' ? skill : skill.name;
                return (
                  <Chip key={skillName} size="sm" variant="flat">
                    {skillName}
                  </Chip>
                );
              })}
            </div>
          )}
        </CardBody>
        <CardFooter className="flex justify-center gap-2 p-4">
          <Link href={portfolioLink}>
            <Button
              color="primary"
              variant="flat"
              endContent={<Icon icon="mdi:arrow-right" className="text-lg" />}
            >
              View Portfolio
            </Button>
          </Link>
          {(Object.entries(socialLinks) as [string, string][]).map(([platform, url]) => (
            <Tooltip key={platform} content={platform}>
              <Link href={url} target="_blank" rel="noopener noreferrer">
                <Button isIconOnly variant="light" size="sm">
                  <Icon icon={`mdi:${platform.toLowerCase()}`} className="text-lg" />
                </Button>
              </Link>
            </Tooltip>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
