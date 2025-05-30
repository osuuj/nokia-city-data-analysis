'use client';

import { Card, CardBody, Tab, Tabs, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, useReducedMotion } from 'framer-motion';
import React, { useState } from 'react';
import { getCategoryForTech, getTechIcon } from '../../data/techStack';

interface TechStackShowcaseProps {
  tags: string[];
}

export default function TechStackShowcase({ tags = [] }: TechStackShowcaseProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const prefersReducedMotion = useReducedMotion();

  const filteredTags =
    activeTab === 'all' ? tags : tags.filter((tag) => getCategoryForTech(tag) === activeTab);

  // Animation config - no hooks
  const containerAnimation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      };

  // Item animation - no hooks
  const getItemAnimation = (index: number) => {
    if (prefersReducedMotion) return {};

    return {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, delay: 0.05 * index },
    };
  };

  return (
    <div>
      <Tabs
        aria-label="Technology categories"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="mb-8"
        variant="underlined"
        color="primary"
      >
        <Tab key="all" title="All Technologies" />
        <Tab key="frontend" title="Frontend" />
        <Tab key="backend" title="Backend" />
        <Tab key="database" title="Database" />
        <Tab key="devops" title="DevOps" />
        <Tab key="mobile" title="Mobile" />
        <Tab key="ai" title="AI & ML" />
      </Tabs>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        {...containerAnimation}
      >
        {filteredTags.length > 0 ? (
          filteredTags.map((tech, index) => (
            <motion.div key={tech} {...getItemAnimation(index)}>
              <Tooltip content={tech}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardBody className="flex flex-col items-center justify-center p-4">
                    <Icon icon={getTechIcon(tech)} className="text-4xl mb-2" />
                    <p className="text-center text-sm font-medium truncate w-full">{tech}</p>
                  </CardBody>
                </Card>
              </Tooltip>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <Icon icon="lucide:search-x" className="text-4xl mx-auto mb-2 text-default-400" />
            <p className="text-default-500">No technologies found in this category</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
