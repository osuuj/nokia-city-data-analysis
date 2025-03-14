'use client';
console.log('✅ HomePage Component Mounted');
import { useSearch } from '@/components/hooks/search-data';
import { Card, CardBody, Tab, Tabs } from '@heroui/react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState('map');
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const city = searchParams.get('city') || undefined; // ✅ Extract city from URL and handle `null`

  // ✅ Fetch businesses for the selected city
  const { paginatedData, isLoading: searchLoading, pages, page, setPage } = useSearch(city);

  const router = useRouter();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setSelectedTab(tab);
    }
    setIsLoading(false);
  }, [searchParams]);
  console.log('Table Data:', paginatedData);
  if (isLoading || searchLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative flex flex-col p-4 rounded-medium border-small border-divider">
      {/* ✅ Tabs Navigation */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => {
          setSelectedTab(String(key));
          router.push(`?tab=${key}`);
        }}
        aria-label="Data Views"
      >
        <Tab key="map" title="Map">
          <Card>
            <CardBody>
              <div className="relative w-full h-[710px]">
                <MapComponent
                  locations={paginatedData.map((business) => ({
                    name: business.company_name, // ✅ Map `company_name` to `name`
                    coordinates: [business.latitude_wgs84, business.longitude_wgs84], // ✅ Create coordinate array
                    industry: business.industry_description || 'Unknown', // ✅ Use industry description or default
                  }))}
                />
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="analytics" title="Analytics">
          <Card>
            <CardBody>
              <div className="relative w-full h-[710px]">
                <AnalyticsComponent />
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="table" title="Table">
          <Card>
            <CardBody>
              <div className="relative w-full h-[710px] max-w-4xl mx-auto overflow-hidden">
                <TableComponent
                  data={paginatedData.map((business) => ({
                    id: Number(business.business_id),
                    workerID: 0,
                    externalWorkerID: '',
                    memberInfo: {
                      name: business.company_name,
                      email: '',
                      avatar: '',
                    },
                    country: { name: '', icon: null },
                    role: business.industry_description || 'Unknown',
                    workerType: 'Employee',
                    status: 'Active',
                    startDate: new Date(),
                    teams: [],
                  }))}
                  pages={pages}
                  page={page}
                  setPage={setPage}
                />
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
