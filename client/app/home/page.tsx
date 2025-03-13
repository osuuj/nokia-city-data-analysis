'use client';

import { Card, CardBody, Tab, Tabs } from '@heroui/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// ✅ Dynamically Import Components
const MapComponent = dynamic(() => import('@/components/map/map'), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});
const TableComponent = dynamic(() => import('@/components/table/table'), {
  ssr: false,
  loading: () => <p>Loading Table...</p>,
});
const AnalyticsComponent = dynamic(() => import('@/components/analytics/analytics'), {
  ssr: false,
  loading: () => <p>Loading Analytics...</p>,
});

interface Location {
  name: string;
  coordinates: [number, number];
  industry: string;
}

// ✅ Dummy Locations for Map
const locations: Location[] = [
  { name: 'Location 1', coordinates: [-74.5, 40], industry: 'Tech' },
  { name: 'Location 2', coordinates: [-74.6, 40.2], industry: 'Finance' },
  { name: 'Location 3', coordinates: [-74.7, 40.4], industry: 'Healthcare' },
];

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState('map');

  return (
    <div className="flex-1 flex-col h-full w-full p-6 rounded-medium border-small border-divider">
      {/* ✅ Tabs Navigation */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(String(key))}
        aria-label="Data Views"
      >
        <Tab key="map" title="Map">
          <Card>
            <CardBody>
              <div className="relative w-full h-[500px]">
                <MapComponent locations={locations} />
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="analytics" title="Analytics">
          <Card>
            <CardBody>
              <div className="relative flex-1 w-full h-[500px]">
                <AnalyticsComponent />
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="table" title="Table">
          <Card>
            <CardBody>
              <div className="relative flex-1 w-full h-[500px]">
                <TableComponent />
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
