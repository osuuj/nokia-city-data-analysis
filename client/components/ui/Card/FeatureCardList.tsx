'use client';

import type { CompanyProperties } from '@/types';
import { Button, Card, CardBody, CardHeader, Chip, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { Feature, Point } from 'geojson';
import Image from 'next/image';
import { useState } from 'react';

interface FeatureCardListProps {
  features: Feature<Point, CompanyProperties>[]; // Could also be CompanyFeatureWithAddressType
  activeFeature: Feature<Point, CompanyProperties> | null;
  onSelect: (feature: Feature<Point, CompanyProperties>) => void;
  selectedColor: string;
  theme?: string;
  flyTo?: (coords: [number, number], addressType?: string) => void;
}

export function FeatureCardList({
  features,
  theme = 'light',
  onSelect,
  flyTo,
}: FeatureCardListProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  const isMulti = features.length > 1;
  const selectedFeature = isMulti
    ? (features.find((f) => f.properties.business_id === selectedBusinessId) ?? null)
    : features[0];

  const reset = () => setSelectedBusinessId(null);
  const showList = isMulti && !selectedBusinessId;
  const showDetails = selectedFeature != null;

  const areCoordinatesDifferent = (
    a?: { latitude: number; longitude: number },
    b?: { latitude: number; longitude: number },
  ): boolean => {
    if (!a || !b) return false;
    return a.latitude !== b.latitude || a.longitude !== b.longitude;
  };

  const renderAddress = (
    label: string,
    address?: CompanyProperties['addresses'][string],
    coords?: [number, number],
    showZoom = false,
  ) => {
    if (!address) return <div className="text-danger text-sm">⚠️ Missing {label.toLowerCase()}</div>;

    return (
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm font-semibold text-default-700 uppercase">{label}</div>
          {showZoom && coords && flyTo && (
            <Button
              size="sm"
              variant="flat"
              onPress={() => flyTo(coords)}
              className="text-xs px-2 py-1 bg-default-100"
            >
              Zoom to
            </Button>
          )}
        </div>
        <div className="text-sm text-default-600 leading-snug">
          <div className="grid grid-cols-[80px_1fr] gap-x-2">
            <span>Street:</span> <span>{address.street ?? '—'}</span>
            <span>Number:</span> <span>{address.building_number ?? '—'}</span>
            <span>Entrance:</span> <span>{address.entrance || '—'}</span>
            <span>Postal:</span>
            <span>
              {address.postal_code ?? '—'} {address.city ?? '—'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-4 left-4 z-50 max-w-xs w-full">
      <Card>
        <CardHeader className="flex flex-col px-4 pt-3 pb-0">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <h4 className="text-large font-medium">
                {showList ? 'Companies at this location' : 'Company Details'}
              </h4>
              {showList && (
                <Chip size="sm" variant="flat">
                  {features.length}
                </Chip>
              )}
            </div>
          </div>
        </CardHeader>

        <CardBody className="px-4 pb-4 pt-2 text-sm">
          {showList ? (
            <ScrollShadow className="max-h-[400px] space-y-2">
              {features.map((feature) => (
                <Button
                  key={feature.properties.business_id}
                  variant="light"
                  className="justify-start w-full text-left px-2"
                  onPress={() => setSelectedBusinessId(feature.properties.business_id)}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/industries-${theme}/${feature.properties.industry_letter}.svg`}
                      alt="marker"
                      width={20}
                      height={20}
                    />
                    <span className="text-sm truncate">{feature.properties.company_name}</span>
                  </div>
                </Button>
              ))}
            </ScrollShadow>
          ) : showDetails && selectedFeature ? (
            <>
              <div className="font-semibold text-base mb-1">
                {selectedFeature.properties.company_name}
              </div>

              {/* 🏢 Addresses */}
              {(() => {
                let rawAddresses = selectedFeature.properties.addresses;
                if (typeof rawAddresses === 'string') {
                  try {
                    rawAddresses = JSON.parse(rawAddresses);
                  } catch (e) {
                    console.error('Failed to parse addresses JSON:', e);
                    rawAddresses = {};
                  }
                }

                const visiting = rawAddresses['Visiting address'];
                const postal = rawAddresses['Postal address'];

                if (!visiting && !postal) {
                  return <div>No address available</div>;
                }

                const coordsDiffer = areCoordinatesDifferent(visiting, postal);

                if (!coordsDiffer && visiting) {
                  return renderAddress('Visiting / Postal Address:', visiting);
                }

                return (
                  <>
                    {visiting &&
                      renderAddress(
                        'Visiting Address:',
                        visiting,
                        [visiting.longitude, visiting.latitude],
                        coordsDiffer,
                      )}
                    {postal &&
                      renderAddress(
                        'Postal Address:',
                        postal,
                        [postal.longitude, postal.latitude],
                        coordsDiffer,
                      )}
                  </>
                );
              })()}

              {/* 🏭 Industry */}
              {selectedFeature.properties.industry_description && (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-default-700 uppercase mb-1">
                    Industry
                  </div>
                  <div className="text-sm text-default-600">
                    {selectedFeature.properties.industry_description}
                  </div>
                </div>
              )}

              {/* 🌐 Website */}
              {selectedFeature.properties.website && (
                <div className="mt-3">
                  <div className="text-sm font-semibold text-default-700 uppercase mb-1">
                    Website
                  </div>
                  <a
                    href={selectedFeature.properties.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline"
                  >
                    {selectedFeature.properties.website}
                  </a>
                </div>
              )}

              {/* 🔙 Back */}
              {isMulti && (
                <Button size="sm" onPress={reset} className="mt-3 flex items-center gap-1">
                  <Icon icon="solar:arrow-left-linear" width={16} />
                  Back
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-default-400">
              <Icon icon="solar:building-linear" width={36} className="mb-2" />
              No company selected.
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
