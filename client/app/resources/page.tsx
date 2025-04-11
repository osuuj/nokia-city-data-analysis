'use client';

import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ResourceCard } from '@/components/ui/Card/ResourceCard';
import SuggestResourceForm from '@/components/ui/ResourcePage/SuggestForm';
import resourcesData from '@/data/resources-data';
import { Accordion, AccordionItem, Divider } from '@heroui/react';
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

            {/* City & Business Resources */}
            <AccordionItem
              key="city-resources"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:building" className="text-xl text-primary" />
                  <span className="text-xl">City & Business Resources</span>
                </div>
              }
              textValue="City & Business Resources"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {resourcesData.cityResources.map((resource: Resource) => (
                  <ResourceCard
                    key={`city-${resource.title}`}
                    title={resource.title}
                    description={resource.description}
                    icon={resource.icon}
                    type={resource.type}
                    link={resource.link}
                  />
                ))}
              </div>
            </AccordionItem>

            {/* Toolkits for Users */}
            <AccordionItem
              key="toolkits"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:tool" className="text-xl text-primary" />
                  <span className="text-xl">Toolkits for Users</span>
                </div>
              }
              textValue="Toolkits for Users"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {resourcesData.toolkits.map((resource: Resource) => (
                  <ResourceCard
                    key={`toolkit-${resource.title}`}
                    title={resource.title}
                    description={resource.description}
                    icon={resource.icon}
                    type={resource.type}
                    link={resource.link}
                  />
                ))}
              </div>
            </AccordionItem>

            {/* Educational Resources */}
            <AccordionItem
              key="educational"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:graduation-cap" className="text-xl text-primary" />
                  <span className="text-xl">Educational Resources</span>
                </div>
              }
              textValue="Educational Resources"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {resourcesData.educational.map((resource: Resource) => (
                  <ResourceCard
                    key={`edu-${resource.title}`}
                    title={resource.title}
                    description={resource.description}
                    icon={resource.icon}
                    type={resource.type}
                    link={resource.link}
                  />
                ))}
              </div>
            </AccordionItem>

            {/* Downloadables */}
            <AccordionItem
              key="downloadables"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:download" className="text-xl text-primary" />
                  <span className="text-xl">Downloadables</span>
                </div>
              }
              textValue="Downloadables"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {resourcesData.downloadables.map((resource: Resource) => (
                  <ResourceCard
                    key={`download-${resource.title}`}
                    title={resource.title}
                    description={resource.description}
                    icon={resource.icon}
                    type={resource.type}
                    link={resource.link}
                  />
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        </div>

        <Divider className="my-10" />

        {/* Suggest a Resource Section */}
        <div className="rounded-large bg-content1 p-6 shadow-small backdrop-blur-md bg-opacity-85 border border-content2">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon icon="lucide:lightbulb" className="text-primary" />
            Suggest a Resource
          </h2>
          <p className="mb-6 text-default-600">
            Know a tool, guide, or resource that would benefit our community? Let us know and we'll
            consider adding it to our library.
          </p>
          <SuggestResourceForm />
        </div>
      </div>
    </div>
  );
}
