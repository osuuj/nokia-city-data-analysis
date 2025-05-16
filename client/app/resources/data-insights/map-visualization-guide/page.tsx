'use client';

import { AnimatedBackground } from '@/shared/components/ui/background';
import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Divider, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UseCaseBox } from '../../components';

/**
 * Map Visualization Guide
 *
 * Documentation page for using the map visualization features
 */
export default function MapVisualizationGuidePage() {
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
          <BreadcrumbItem>Data Insights</BreadcrumbItem>
          <BreadcrumbItem>Map Visualization Guide</BreadcrumbItem>
        </Breadcrumbs>

        {/* Documentation header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon icon="lucide:map" className="text-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold inline-block relative text-black dark:text-white">
              Map Visualization Guide
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
            How to use the interactive map to discover geographic patterns in company data
          </p>
          <div className="flex gap-2 mt-4">
            <span className="text-xs px-2 py-1 bg-default-100 rounded-full">visualization</span>
            <span className="text-xs px-2 py-1 bg-default-100 rounded-full">map</span>
            <span className="text-xs px-2 py-1 bg-default-100 rounded-full">geographic</span>
          </div>

          {/* Work in progress banner */}
          <div className="mt-6 p-4 border border-warning-400 bg-warning-50 dark:bg-warning-900/20 rounded-large flex items-center gap-3">
            <Icon icon="lucide:construction" className="text-warning-600 text-xl" />
            <p className="text-warning-700 dark:text-warning-500">
              This guide is currently under development. Some sections may be incomplete.
            </p>
          </div>
        </div>

        {/* Main content card */}
        <Card className="mb-8 backdrop-blur-md bg-opacity-90">
          <CardBody className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Map Features Overview</h2>

            <div className="mb-6 text-center">
              <div className="bg-default-100 rounded-xl p-4 text-center flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <Icon icon="lucide:map" className="text-5xl text-default-400 mb-4" />
                  <p className="text-default-500">Map screenshot will be added here</p>
                </div>
              </div>
              <p className="text-sm text-default-500 mt-2 italic">
                The Nokia City Data Analysis map interface with company data visualization
              </p>
            </div>

            <p className="mb-6">
              The interactive map is a powerful tool for visualizing the geographic distribution of
              companies across Finland. It allows you to identify patterns, clusters, and outliers
              based on location, with filtering capabilities for:
            </p>

            <ul className="list-disc list-inside mb-6 space-y-2">
              <li className="text-default-700">
                <span className="font-medium">Industry filtering</span> - Focus on specific business
                sectors to analyze industry-specific distribution
              </li>
              <li className="text-default-700">
                <span className="font-medium">Distance filtering</span> - Define geographic
                boundaries to study localized patterns
              </li>
            </ul>

            <p className="mb-6">
              These filter options enable precise analysis of company distribution patterns across
              different regions and industries in Finland.
            </p>

            <Divider className="my-6" />

            <h2 className="text-2xl font-semibold mb-4">Use Cases</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <UseCaseBox
                title="Industry Distribution"
                description="Filter by industry to identify regions with high concentrations of specific business sectors."
                icon="lucide:briefcase"
              />
              <UseCaseBox
                title="Local Area Analysis"
                description="Use distance filters to analyze companies within a specific geographic radius."
                icon="lucide:map-pin"
              />
              <UseCaseBox
                title="Industry Comparison"
                description="Compare the geographic distribution patterns of different industries."
                icon="lucide:bar-chart-2"
              />
              <UseCaseBox
                title="Regional Coverage"
                description="Identify areas with high and low business presence across different parts of Finland."
                icon="lucide:map"
              />
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
              <Link href="/dashboard" className="flex items-center justify-between gap-2 group">
                <span>Try it yourself</span>
                <Icon
                  icon="lucide:external-link"
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
