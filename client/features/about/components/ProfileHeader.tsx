'use client';

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import type { ProfileHeaderProps } from '../types';

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const socialButtonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
};

export function ProfileHeader({ member }: ProfileHeaderProps) {
  return (
    <motion.div variants={headerVariants} initial="hidden" animate="visible">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar
            src={member.avatar}
            alt={member.name}
            className="w-32 h-32"
            fallback={member.name.charAt(0)}
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
            <p className="text-xl text-content2 mb-4">{member.role}</p>
            <p className="text-content2 mb-6">{member.bio}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {member.social?.github && (
                <motion.div variants={socialButtonVariants} whileHover="hover">
                  <Button
                    as="a"
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    className="gap-2"
                  >
                    <Image
                      src="/icons/github.svg"
                      alt="GitHub"
                      width={20}
                      height={20}
                      className="dark:invert"
                    />
                    GitHub
                  </Button>
                </motion.div>
              )}
              {member.social?.linkedin && (
                <motion.div variants={socialButtonVariants} whileHover="hover">
                  <Button
                    as="a"
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    className="gap-2"
                  >
                    <Image
                      src="/icons/linkedin.svg"
                      alt="LinkedIn"
                      width={20}
                      height={20}
                      className="dark:invert"
                    />
                    LinkedIn
                  </Button>
                </motion.div>
              )}
              {member.social?.twitter && (
                <motion.div variants={socialButtonVariants} whileHover="hover">
                  <Button
                    as="a"
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    className="gap-2"
                  >
                    <Image
                      src="/icons/twitter.svg"
                      alt="Twitter"
                      width={20}
                      height={20}
                      className="dark:invert"
                    />
                    Twitter
                  </Button>
                </motion.div>
              )}
              <motion.div variants={socialButtonVariants} whileHover="hover">
                <Button as="a" href={`mailto:${member.email}`} variant="ghost" className="gap-2">
                  <Image
                    src="/icons/email.svg"
                    alt="Email"
                    width={20}
                    height={20}
                    className="dark:invert"
                  />
                  Email
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
