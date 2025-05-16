'use client';

import { AnimatedBackground } from '@/shared/components/ui/background';
import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Platform Overview Documentation Page
 *
 * This template can be used for other documentation pages with consistent styling
 */
export default function PlatformOverviewPage() {
  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6 pt-24">
      <AnimatedBackground priority="high" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Documentation header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon icon="lucide:layers" className="text-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold inline-block relative text-black dark:text-white">
              Platform Overview
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 h-1 bg-primary rounded"
              />
            </h1>
          </div>
          <p className="text-lg text-default-600 mt-2">
            Learn about the Osuuj Data Analysis platform and its key features
          </p>
          <div className="flex gap-2 mt-4">
            <span className="text-xs px-2 py-1 bg-default-100 rounded-full">overview</span>
            <span className="text-xs px-2 py-1 bg-default-100 rounded-full">beginner</span>
            <span className="text-xs px-2 py-1 bg-default-100 rounded-full">introduction</span>
          </div>
        </div>

        {/* Main content card */}
        <Card className="mb-8 backdrop-blur-md bg-opacity-90">
          <CardBody className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              The Osuuj Data Analysis platform is a comprehensive tool designed to help researchers,
              analysts, and business professionals explore and analyze Finnish company data through
              interactive visualizations.
            </p>

            <p className="mb-4">
              Our platform combines a robust ETL (Extract, Transform, Load) data pipeline with a
              user-friendly web interface to provide geographic insights about company distributions
              across Finland.
            </p>

            <Divider className="my-6" />

            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon icon="lucide:map" className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Interactive Map View</h3>
                  <p>
                    Visualize company locations across Finland with our interactive map. Filter by
                    industry and distance to explore geographic distribution patterns.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon icon="lucide:table" className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Comprehensive Table View</h3>
                  <p>
                    Access detailed company information in a sortable, filterable table format.
                    Quickly find and compare data across multiple companies and sectors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon icon="lucide:bar-chart-2" className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Analytics Dashboard</h3>
                  <p>
                    View location-based company data with simple visualizations to explore the
                    geographic distribution of businesses across Finland.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Navigation section */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Card className="w-full md:w-1/2 backdrop-blur-md bg-opacity-90">
            <CardBody className="p-6">
              <Link href="/resources" className="flex items-center gap-2 group">
                <Icon
                  icon="lucide:arrow-left"
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span>Back to Resources</span>
              </Link>
            </CardBody>
          </Card>

          <Card className="w-full md:w-1/2 backdrop-blur-md bg-opacity-90">
            <CardBody className="p-6">
              <Link
                href="/resources/dashboard-guide"
                className="flex items-center justify-between gap-2 group"
              >
                <span>Next: Dashboard Guide</span>
                <Icon
                  icon="lucide:arrow-right"
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
