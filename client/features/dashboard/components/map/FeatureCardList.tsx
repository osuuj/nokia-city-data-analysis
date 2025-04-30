'use client';

import { Button, Card, CardBody, CardHeader, Chip, Divider, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { Feature, Point } from 'geojson';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CompanyProperties } from '../../types';

// Define a more specific Feature type
type MapFeature = Feature<
  Point,
  CompanyProperties & {
    addressType?: 'Visiting address' | 'Postal address';
    isActive?: boolean;
    isOverlapping?: boolean;
  }
>;

export interface FeatureCardListProps {
  features: MapFeature[];
  activeFeature: MapFeature;
  onSelect: (feature: MapFeature) => void;
  selectedColor?: string;
  theme: string;
  flyTo?: (coords: [number, number], businessId?: string, addressType?: string) => void;
}

export function FeatureCardList({
  features,
  activeFeature,
  onSelect,
  theme = 'light',
  flyTo,
  selectedColor = '#9C27B0', // Default color
}: FeatureCardListProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Track the current feature IDs to reset selection when they change
  const currentIds = features
    .map((f) => f.properties.business_id)
    .sort()
    .join(',');
  const previousIdsRef = useRef('');

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && window.innerHeight < 700) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset selection when features change
  useEffect(() => {
    if (previousIdsRef.current !== currentIds) {
      previousIdsRef.current = currentIds;
      setSelectedBusinessId(null);
    }
  }, [currentIds]);

  const isMulti = features.length > 1;
  const selectedFeature = isMulti
    ? (features.find((f) => f.properties.business_id === selectedBusinessId) ?? null)
    : features[0];

  const reset = () => setSelectedBusinessId(null);
  const showList = isMulti && !selectedBusinessId;
  const showDetails = selectedFeature != null;

  // Get industry letter for icon
  const letter = selectedFeature
    ? (selectedFeature.properties.industry_letter || 'U').trim().toUpperCase()
    : features.length > 0
      ? (features[0].properties.industry_letter || 'U').trim().toUpperCase()
      : 'U';

  // Determine if coordinates differ between addresses
  const areCoordinatesDifferent = (
    a?: { latitude: number; longitude: number },
    b?: { latitude: number; longitude: number },
  ) => {
    if (!a || !b) return false;
    return a.latitude !== b.latitude || a.longitude !== b.longitude;
  };

  // Render address information
  const renderAddress = (
    label: string,
    address?: {
      street?: string;
      building_number?: string;
      postal_code?: string;
      city?: string;
      latitude?: number;
      longitude?: number;
      entrance?: string;
    },
    coords?: [number, number],
    showZoom = false,
  ) => {
    if (!address) return <div className="text-danger text-xs">⚠️ Missing {label.toLowerCase()}</div>;

    return (
      <div className="mt-2 p-2 bg-default-50 border border-default-200 rounded-lg">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs md:text-sm font-semibold text-default-700 uppercase">{label}</div>
          {showZoom && coords && flyTo && (
            <Button
              size="sm"
              variant="flat"
              onPress={() => flyTo(coords, selectedFeature?.properties?.business_id, label)}
              className="text-xs px-3 h-8 bg-default-100 text-default-800 focus:outline-none focus:ring-0 outline-none"
              startContent={<Icon icon="lucide:map-pin" width={12} className="outline-none" />}
            >
              Zoom
            </Button>
          )}
        </div>
        <div className="text-xs md:text-sm text-default-600 leading-snug">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-[80px_1fr]'} gap-x-2`}>
            {!isMobile && <span className="text-default-500">Street:</span>}
            <span>
              {address.street ?? '—'} {address.building_number ?? ''}
            </span>
            {!isMobile && (
              <>
                <span className="text-default-500">Number:</span>
                <span>{address.building_number ?? '—'}</span>
                <span className="text-default-500">Entrance:</span>
                <span>{address.entrance || '—'}</span>
              </>
            )}
            {!isMobile && <span className="text-default-500">Postal:</span>}
            <span>
              {address.postal_code ?? '—'} {address.city ?? '—'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Collapsed view - just a button with the icon */}
      <div className={`absolute z-[100] top-4 left-4 ${isCollapsed ? 'block' : 'hidden'}`}>
        <Button
          size="sm"
          variant="flat"
          color="primary"
          isIconOnly
          className="shadow-md bg-background/80 backdrop-blur-md border border-default-200 hover:bg-primary-100 active:bg-primary-200 transition-colors"
          onPress={() => setIsCollapsed(false)}
        >
          <Icon icon="lucide:info" width={isMobile ? 18 : 24} />
        </Button>
      </div>

      {/* Expanded card list */}
      <div
        className={`z-50 ${isCollapsed ? 'hidden' : 'block'} ${
          isMobile
            ? 'absolute bottom-4 left-4 right-4 max-w-[280px] mx-auto'
            : 'absolute top-4 left-4 max-w-xs'
        }`}
      >
        <Card className="shadow-md border border-default-200">
          <CardHeader
            className={`flex flex-col ${isMobile ? 'px-2 py-1' : 'px-3 pt-2 pb-1'} bg-content2/50 relative`}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1">
                <h4 className={`${isMobile ? 'text-sm' : 'text-base md:text-large'} font-medium`}>
                  {showList ? 'Companies at this location' : 'Company Details'}
                </h4>
                {showList && (
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-primary-50 text-primary-700 border-primary-200"
                  >
                    {features.length}
                  </Chip>
                )}
              </div>

              <Button
                size="sm"
                isIconOnly
                variant="light"
                onPress={() => setIsCollapsed(true)}
                className="w-6 h-6 hover:bg-default-200 active:bg-default-300 transition-colors"
              >
                <Icon icon="lucide:minimize-2" width={16} />
              </Button>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className={`${isMobile ? 'px-2 py-1.5' : 'px-3 pb-3 pt-2'} text-xs md:text-sm`}>
            {showList ? (
              /* List of companies */
              <ScrollShadow
                className={`${
                  isMobile ? (isCompact ? 'max-h-[100px]' : 'max-h-[150px]') : 'max-h-[400px]'
                } space-y-1 overflow-y-auto`}
                hideScrollBar={false}
              >
                {features.map((feature) => {
                  const industryLetter = (feature.properties.industry_letter || 'U')
                    .trim()
                    .toUpperCase();
                  return (
                    <Button
                      key={feature.properties.business_id}
                      variant="flat"
                      className="justify-start w-full text-left px-2 py-2 mb-1 bg-content1 border border-default-200 hover:bg-default-50 active:bg-default-100 focus:outline-none focus:ring-0 outline-none transition-colors"
                      onPress={() => setSelectedBusinessId(feature.properties.business_id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="flex-shrink-0 flex items-center justify-center bg-default-100 rounded-md"
                          style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24 }}
                        >
                          <div
                            className="rounded-full w-4 h-4"
                            style={{
                              backgroundColor: getIndustryColor(industryLetter),
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs md:text-sm font-medium truncate block">
                            {feature.properties.company_name}
                          </span>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </ScrollShadow>
            ) : showDetails && selectedFeature ? (
              /* Company details */
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <div className="bg-default-100 p-1.5 rounded-md flex items-center justify-center mt-1">
                    <div
                      className="rounded-full w-5 h-5"
                      style={{
                        backgroundColor: getIndustryColor(letter),
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm md:text-base">
                      {selectedFeature.properties.company_name}
                    </div>
                  </div>
                </div>

                {!isCompact && <Divider className="my-1" />}

                <ScrollShadow
                  className={isMobile ? (isCompact ? 'max-h-[80px]' : 'max-h-[120px]') : ''}
                >
                  {(() => {
                    // Parse addresses if needed (sometimes they come as a string)
                    let addresses = selectedFeature.properties.addresses;
                    if (typeof addresses === 'string') {
                      try {
                        addresses = JSON.parse(addresses);
                      } catch {
                        addresses = {};
                      }
                    }

                    const visiting = addresses?.['Visiting address'];
                    const postal = addresses?.['Postal address'];
                    const coordsDiffer = areCoordinatesDifferent(visiting, postal);

                    // If no addresses are available
                    if (!visiting && !postal) {
                      return (
                        <div className="text-center py-2 text-default-400 bg-default-50 rounded-lg border border-default-200">
                          <Icon icon="lucide:map-off" width={18} className="mb-1" />
                          <div className="text-xs">No address available</div>
                        </div>
                      );
                    }

                    // If coordinates are the same or only one address is available
                    if (!coordsDiffer && visiting) {
                      return renderAddress('Visiting / Postal Address:', visiting);
                    }

                    // Otherwise, show both addresses separately
                    return (
                      <>
                        {visiting &&
                          renderAddress(
                            'Visiting Address',
                            visiting,
                            [visiting.longitude, visiting.latitude],
                            coordsDiffer,
                          )}
                        {postal &&
                          renderAddress(
                            'Postal Address',
                            postal,
                            [postal.longitude, postal.latitude],
                            coordsDiffer,
                          )}
                      </>
                    );
                  })()}

                  {/* Additional company info */}
                  {(!isCompact || !isMobile) && (
                    <>
                      {selectedFeature.properties.industry_description && (
                        <div className="mt-2">
                          <div className="text-xs md:text-sm font-semibold text-default-700 uppercase mb-1">
                            Industry
                          </div>
                          <div className="text-xs md:text-sm text-default-600 p-2 bg-default-50 rounded-lg border border-default-200">
                            {selectedFeature.properties.industry_description}
                          </div>
                        </div>
                      )}

                      {selectedFeature.properties.website && (
                        <div className="mt-2">
                          <div className="text-xs md:text-sm font-semibold text-default-700 uppercase mb-1">
                            Website
                          </div>
                          <div className="p-2 bg-default-50 rounded-lg border border-default-200">
                            <a
                              href={selectedFeature.properties.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs md:text-sm text-primary flex items-center gap-1"
                            >
                              <Icon icon="lucide:external-link" width={12} />
                              <span className="truncate">{selectedFeature.properties.website}</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </ScrollShadow>

                {/* Show a back button for multi-feature views */}
                {isMulti && (
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={reset}
                    className={`w-full mt-3 ${isMobile ? 'h-8 text-xs' : 'h-10 text-sm'} flex items-center justify-center gap-1 bg-default-100 text-default-800 hover:bg-default-200 active:bg-default-300 transition-colors`}
                    startContent={<Icon icon="lucide:chevron-left" width={isMobile ? 12 : 14} />}
                  >
                    Back to list
                  </Button>
                )}
              </div>
            ) : (
              /* No selection state */
              <div className="text-center py-5 text-default-400 bg-default-50 rounded-lg border border-default-200">
                <Icon icon="lucide:building" width={24} className="mb-2" />
                <div className="text-sm">No company selected.</div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

// Helper function to get color for industry
function getIndustryColor(letter: string): string {
  const colors: Record<string, string> = {
    A: '#4CAF50', // Agriculture
    B: '#8BC34A', // Mining
    C: '#795548', // Manufacturing
    D: '#FF9800', // Energy
    E: '#009688', // Water
    F: '#F44336', // Construction
    G: '#673AB7', // Retail
    H: '#3F51B5', // Transportation
    I: '#2196F3', // Accommodation
    J: '#00BCD4', // IT
    K: '#9C27B0', // Finance
    L: '#E91E63', // Real Estate
    M: '#CDDC39', // Professional
    N: '#FFEB3B', // Administrative
    O: '#607D8B', // Public Administration
    P: '#FFC107', // Education
    Q: '#03A9F4', // Health
    R: '#9E9E9E', // Arts
    S: '#FFEB3B', // Other Services
    T: '#8D6E63', // Households
  };

  return colors[letter] || '#78909C'; // Default color
}
