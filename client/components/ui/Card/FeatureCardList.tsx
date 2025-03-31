'use client';

import type { CompanyProperties } from '@/types';
import { Button, Card, CardBody, CardHeader, Chip, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { Feature, Point } from 'geojson';
import Image from 'next/image';
import { useState } from 'react';

interface FeatureCardListProps {
  features: Feature<Point, CompanyProperties>[];
  activeFeature: Feature<Point, CompanyProperties> | null;
  onSelect: (feature: Feature<Point, CompanyProperties>) => void;
  selectedColor: string;
  theme?: string;
}

export function FeatureCardList({ features, theme = 'light', onSelect }: FeatureCardListProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  const isMulti = features.length > 1;
  const selectedFeature = isMulti
    ? (features.find((f) => f.properties.business_id === selectedBusinessId) ?? null)
    : features[0];

  const reset = () => setSelectedBusinessId(null);
  const showList = isMulti && !selectedBusinessId;
  const showDetails = selectedFeature != null;

  const renderAddress = (label: string, address?: CompanyProperties['addresses'][string]) => {
    console.log(`[renderAddress] ${label}:`, address);

    if (!address) return <div>⚠️ Missing {label.toLowerCase()}</div>;

    return (
      <div className="mb-1">
        <strong>{label}</strong>
        <br />
        Street: {address.street ?? '—'}
        <br />
        Number: {address.building_number ?? '—'}
        <br />
        Entrance: {address.entrance || '—'}
        <br />
        Postal: {address.postal_code ?? '—'} {address.city ?? '—'}
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

                console.log('Raw addresses:', rawAddresses);

                if (!visiting && !postal) {
                  return <div>No address available</div>;
                }

                const isSameAddress =
                  visiting &&
                  postal &&
                  visiting.street === postal.street &&
                  visiting.building_number === postal.building_number &&
                  visiting.entrance === postal.entrance &&
                  visiting.postal_code === postal.postal_code &&
                  visiting.city === postal.city;

                if (isSameAddress && visiting) {
                  return renderAddress('Visiting / Postal Address:', visiting);
                }

                return (
                  <>
                    {renderAddress('Visiting Address:', visiting)}
                    {renderAddress('Postal Address:', postal)}
                  </>
                );
              })()}

              {/* 🏭 Industry */}
              {selectedFeature.properties.industry_description && (
                <div>
                  <strong>Industry:</strong> {selectedFeature.properties.industry_description}
                </div>
              )}

              {/* 🌐 Website */}
              {selectedFeature.properties.website && (
                <a
                  href={selectedFeature.properties.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline block mt-1"
                >
                  {selectedFeature.properties.website}
                </a>
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
