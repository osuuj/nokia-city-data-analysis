'use client';

import { Avatar, Button, Card, CardBody, Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import type { TeamMemberCardProps } from './types';

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { name, jobTitle, bio, shortBio, portfolioLink, avatarSrc, skills, socialLinks } = member;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="shadow-md h-full">
        <CardBody className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={avatarSrc}
                alt={name}
                fill
                className="rounded-full object-cover"
                sizes="96px"
                priority
              />
            </div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-default-500 mb-2">{jobTitle}</p>
            <p className="text-sm mb-4">{shortBio || bio}</p>

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mb-4">
                {skills.slice(0, 5).map((skill) => (
                  <Chip key={skill} size="sm" variant="flat" color="primary" className="text-xs">
                    {skill}
                  </Chip>
                ))}
                {skills.length > 5 && (
                  <Tooltip content={skills.slice(5).join(', ')}>
                    <Chip size="sm" variant="flat" color="default" className="text-xs">
                      +{skills.length - 5} more
                    </Chip>
                  </Tooltip>
                )}
              </div>
            )}

            {/* Social Links */}
            {socialLinks && (
              <div className="flex gap-2 mb-4">
                {socialLinks.github && (
                  <Tooltip content="GitHub">
                    <Link
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-default-500 hover:text-primary"
                    >
                      <Icon icon="lucide:github" width={20} height={20} />
                    </Link>
                  </Tooltip>
                )}
                {socialLinks.linkedin && (
                  <Tooltip content="LinkedIn">
                    <Link
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-default-500 hover:text-primary"
                    >
                      <Icon icon="lucide:linkedin" width={20} height={20} />
                    </Link>
                  </Tooltip>
                )}
                {socialLinks.website && (
                  <Tooltip content="Personal Website">
                    <Link
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-default-500 hover:text-primary"
                    >
                      <Icon icon="lucide:globe" width={20} height={20} />
                    </Link>
                  </Tooltip>
                )}
              </div>
            )}

            <Link href={portfolioLink}>
              <Button
                color="primary"
                variant="flat"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                View Profile
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
