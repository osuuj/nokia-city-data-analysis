'use client';

import { ResourceCard } from '@/features/resources/components/ResourceCard';
import { AnimatedBackground } from '@/shared/components/ui/background';
import { Accordion, AccordionItem } from '@heroui/react';
import { Icon } from '@iconify/react';

interface Resource {
  title: string;
  description: string;
  icon: string;
  type: string;
  link: string;
}

export default function ResourcePage() {
  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6">
      {/* Animated background */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">Resource Center</h1>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Find all the tools, guides, and resources you need to help your business thrive in our
            community.
          </p>
        </div>

        <div className="mb-12">
          <Accordion
            variant="splitted"
            selectionMode="multiple"
            defaultSelectedKeys={['getting-started']}
          >
            {/* Getting Started Section */}
            <AccordionItem
              key="getting-started"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:rocket" className="text-xl text-primary" />
                  <span className="text-xl">Getting Started</span>
                </div>
              }
              textValue="Getting Started"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ResourceCard
                  title="How to Use the Dashboard"
                  description="A comprehensive guide to navigating and using all features of our platform."
                  icon="lucide:book-open"
                  type="Guide"
                  link="#"
                />
                <ResourceCard
                  title="Company Search & Map FAQ"
                  description="Answers to frequently asked questions about our search and map features."
                  icon="lucide:help-circle"
                  type="FAQ"
                  link="#"
                />
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
