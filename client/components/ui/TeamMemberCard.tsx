'use client';

import { Avatar, Button, Card, CardBody, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

interface TeamMemberCardProps {
  name: string;
  jobTitle: string;
  bio: string;
  portfolioLink: string;
  avatarSrc: string;
}

export default function TeamMemberCard({
  name,
  jobTitle,
  bio,
  portfolioLink,
  avatarSrc,
}: TeamMemberCardProps) {
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
            <Avatar
              src={avatarSrc}
              name={name}
              className="w-24 h-24 mb-4"
              isBordered
              color="primary"
            />
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-default-500 mb-2">{jobTitle}</p>
            <p className="text-sm mb-4">{bio}</p>
            <Link href={portfolioLink}>
              <Button color="primary" variant="flat">
                View Profile
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
