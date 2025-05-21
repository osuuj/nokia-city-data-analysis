'use client';

import { AnimatedBackground } from '@/shared/components/ui/background';
import { BreadcrumbItem, Breadcrumbs, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * API Overview Documentation Page
 *
 * Following the same template pattern for consistent documentation styling
 */
export default function ApiOverviewPage() {
  return (
    <div className="relative w-full min-h-screen px-4 py-8 md:px-6 pt-24">
      <AnimatedBackground priority="high" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Breadcrumbs navigation */}
        <Breadcrumbs className="mb-6">
          <BreadcrumbItem>
            <Link href="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href="/resources">Resources</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>API Overview</BreadcrumbItem>
        </Breadcrumbs>

        {/* Documentation header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon icon="lucide:file-json" className="text-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold inline-block relative text-black dark:text-white">
              API Overview
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
            Introduction to our REST API and available endpoints
          </p>
          <div className="flex gap-2 mt-4">
            <span className="text-xs px-2 py-1 bg-default-100 rounded-full">api</span>
            <span className="text-xs px-2 py-1 bg-default-100 rounded-full">documentation</span>
            <span className="text-xs px-2 py-1 bg-default-100 rounded-full">integration</span>
          </div>

          {/* Work in progress banner */}
          <div className="mt-6 p-4 border border-warning-400 bg-warning-50 dark:bg-warning-900/20 rounded-large flex items-center gap-3">
            <Icon icon="lucide:construction" className="text-warning-600 text-xl" />
            <p className="text-warning-700 dark:text-warning-500">
              This API documentation is currently under development. Check back soon for the
              complete guide.
            </p>
          </div>
        </div>

        {/* Main content card - Coming soon placeholder */}
        <Card className="mb-8 backdrop-blur-md bg-opacity-90">
          <CardBody className="p-6 md:p-8">
            <div className="text-center py-10">
              <Icon icon="lucide:code" className="text-4xl text-default-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
              <p className="text-default-600 max-w-md mx-auto">
                Our API documentation is under development. Full documentation with endpoint details
                and examples will be available soon.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Navigation section */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Card className="w-full md:w-1/2 backdrop-blur-md bg-opacity-90">
            <CardBody className="p-6">
              <Link href="/resources/dashboard-guide" className="flex items-center gap-2 group">
                <Icon
                  icon="lucide:arrow-left"
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span>Previous: Dashboard Guide</span>
              </Link>
            </CardBody>
          </Card>

          <Card className="w-full backdrop-blur-md bg-opacity-90 md:w-1/2">
            <CardBody className="p-6">
              <Link href="/resources" className="flex items-center justify-between gap-2 group">
                <span>Back to Resources</span>
                <Icon
                  icon="lucide:home"
                  className="group-hover:translate-y-[-2px] transition-transform"
                />
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
