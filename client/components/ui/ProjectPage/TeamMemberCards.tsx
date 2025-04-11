// TeamMemberCards.tsx
'use client';

import { Avatar, Button, Card, CardBody, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import React from 'react';

interface TeamMemberCardsProps {
  team: string[];
}

export default function TeamMemberCards({ team }: TeamMemberCardsProps) {
  const getRoleForName = (name: string): string => {
    const roles = [
      'Frontend Developer',
      'Backend Developer',
      'UX Designer',
      'Project Manager',
      'QA Engineer',
      'DevOps Engineer',
      'Data Scientist',
      'Product Owner',
      'UI Designer',
      'Full Stack Developer',
    ];
    const nameSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return roles[nameSum % roles.length];
  };

  const getAvatarUrl = (name: string, index: number): string => {
    return `https://img.heroui.chat/image/avatar?w=200&h=200&u=${index + 10}`;
  };

  const getFirstName = (fullName: string): string => {
    return fullName.split(' ')[0];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {team.map((member, index) => (
        <motion.div
          key={member}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <Card className="shadow-md">
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar
                  src={getAvatarUrl(member, index)}
                  name={member}
                  className="w-24 h-24 mb-4"
                  isBordered
                  color="primary"
                />
                <h3 className="text-xl font-bold">{member}</h3>
                <p className="text-default-500 mb-4">{getRoleForName(member)}</p>
                <div className="flex gap-2 mt-2">
                  <Tooltip content={`Email ${getFirstName(member)}`}>
                    <Button isIconOnly variant="light" size="sm">
                      <Icon icon="lucide:mail" />
                    </Button>
                  </Tooltip>
                  <Tooltip content={`${getFirstName(member)}'s LinkedIn`}>
                    <Button isIconOnly variant="light" size="sm">
                      <Icon icon="lucide:linkedin" />
                    </Button>
                  </Tooltip>
                  <Tooltip content={`${getFirstName(member)}'s GitHub`}>
                    <Button isIconOnly variant="light" size="sm">
                      <Icon icon="lucide:github" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
