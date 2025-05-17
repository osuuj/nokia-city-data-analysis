'use client';

import { type Address, AddressTypeEnum } from '@/features/dashboard/types/addressTypes';
import type { CompanyProperties } from '@/features/dashboard/types/business';
import { Button, Card, CardBody, CardHeader, Chip, Divider, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import type { Feature, Point } from 'geojson';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface FeatureCardListProps {
  features: Feature<Point, CompanyProperties>[];
  activeFeature: Feature<Point, CompanyProperties> | null;
  onSelect: (feature: Feature<Point, CompanyProperties>) => void;
  selectedColor: string;
  isDark?: boolean;
  flyTo?: (coords: [number, number], addressType?: string) => void;
  onClose?: () => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

// Use our shared Address type from the addressTypes.ts file
type AddressDetail = Address;

interface AddressMap {
  [AddressTypeEnum.VISITING]?: AddressDetail;
  [AddressTypeEnum.POSTAL]?: AddressDetail;
  [key: string]: AddressDetail | undefined;
}

interface CompanyPropertiesWithWebsite extends CompanyProperties {
  website: string;
}

interface CompanyPropertiesWithIndustry extends CompanyProperties {
  industry_description: string;
}

/**
 * Type guard function to check if the properties include a valid website
 */
function hasValidWebsite(
  properties: CompanyProperties,
): properties is CompanyPropertiesWithWebsite {
  return typeof properties.website === 'string' && properties.website.trim().length > 0;
}

/**
 * Type guard function to check if the properties include a valid industry description
 */
function hasValidIndustryDescription(
  properties: CompanyProperties,
): properties is CompanyPropertiesWithIndustry {
  return (
    typeof properties.industry_description === 'string' &&
    properties.industry_description.trim().length > 0
  );
}

export function FeatureCardList({
  features,
  activeFeature,
  isDark = false,
  onSelect,
  flyTo,
  onClose,
  isCollapsed = false,
  onCollapseChange,
}: FeatureCardListProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Handle collapse/expand state
  const handleCollapse = () => {
    if (onCollapseChange) {
      onCollapseChange(true);
    }
  };

  const handleExpand = () => {
    if (onCollapseChange) {
      onCollapseChange(false);
    }
  };

  // Simple close handler
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Detect mobile/compact view
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && window.innerHeight < 700) {
        setIsCompact(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set the selected business when features or active feature changes
  useEffect(() => {
    if (activeFeature) {
      setSelectedBusinessId(activeFeature.properties.business_id);
    } else if (features.length > 0) {
      setSelectedBusinessId(features[0].properties.business_id);
    } else {
      setSelectedBusinessId(null);
    }
  }, [features, activeFeature]);

  // Handle feature list item click
  const handleFeatureSelect = (feature: Feature<Point, CompanyProperties>) => {
    onSelect(feature);
  };

  // Reset selection to show all features
  const reset = () => {
    setSelectedBusinessId(null);
  };

  const isMulti = features.length > 1;
  const selectedFeature =
    isMulti && selectedBusinessId
      ? features.find((f) => f.properties.business_id === selectedBusinessId) || features[0]
      : activeFeature || features[0];

  const showList = isMulti && !selectedBusinessId;
  const showDetails = selectedFeature != null;

  // Get the letter for the icon
  const letter = selectedFeature
    ? (selectedFeature.properties.industry_letter || 'broken').trim().toUpperCase()
    : features.length > 0
      ? (features[0].properties.industry_letter || 'broken').trim().toUpperCase()
      : 'broken';

  // Determine if we should use the multi icon for multiple businesses
  const useMultiIcon = isMulti && !selectedBusinessId;

  const areCoordinatesDifferent = (a?: AddressDetail, b?: AddressDetail) => {
    if (!a || !b || !a.latitude || !a.longitude || !b.latitude || !b.longitude) return false;
    return a.latitude !== b.latitude || a.longitude !== b.longitude;
  };

  const renderAddress = (
    label: string,
    address?: AddressDetail,
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
              onPress={() => flyTo(coords)}
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
    <div
      ref={cardContainerRef}
      className="feature-card-wrapper"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      tabIndex={-1}
      role="presentation"
    >
      {/* Collapsed view */}
      <div
        className={`absolute z-[100] top-4 left-4 ${isCollapsed ? 'block' : 'hidden'} feature-card-container`}
      >
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            isIconOnly
            className="shadow-md bg-background/80 backdrop-blur-md border border-default-200 hover:bg-primary-100 active:bg-primary-200 transition-colors"
            onPress={handleExpand}
          >
            <Image
              src={`/industries-${isDark ? 'dark' : 'light'}/${useMultiIcon ? 'multi' : letter}.svg`}
              alt="industry"
              width={isMobile ? 18 : 24}
              height={isMobile ? 18 : 24}
            />
          </Button>
          {onClose && (
            <Button
              size="sm"
              variant="flat"
              color="danger"
              isIconOnly
              className="shadow-md bg-background/80 backdrop-blur-md border border-default-200 hover:bg-danger-100 active:bg-danger-200 transition-colors"
              onPress={handleClose}
            >
              <Icon icon="lucide:x" width={isMobile ? 18 : 24} />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded view */}
      <div
        className={`z-50 ${isCollapsed ? 'hidden' : 'block'} ${
          isMobile
            ? 'absolute bottom-4 left-4 right-4 max-w-[280px] mx-auto'
            : 'absolute top-4 left-4 max-w-xs'
        } feature-card-container`}
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

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  isIconOnly
                  variant="light"
                  onPress={handleCollapse}
                  className="w-6 h-6 hover:bg-default-200 active:bg-default-300 transition-colors"
                >
                  <Icon icon="lucide:minimize-2" width={16} />
                </Button>
                {onClose && (
                  <Button
                    size="sm"
                    isIconOnly
                    variant="light"
                    onPress={handleClose}
                    className="w-6 h-6 hover:bg-danger-100 active:bg-danger-200 transition-colors"
                  >
                    <Icon icon="lucide:x" width={16} />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className={`${isMobile ? 'px-2 py-1.5' : 'px-3 pb-3 pt-2'} text-xs md:text-sm`}>
            {showList ? (
              <ScrollShadow
                isEnabled={false}
                className={`${
                  isMobile ? (isCompact ? 'max-h-[100px]' : 'max-h-[150px]') : 'max-h-[400px]'
                } space-y-1 overflow-y-auto`}
                hideScrollBar={false}
              >
                {features.map((feature) => {
                  const letter = (feature.properties.industry_letter || 'broken')
                    .trim()
                    .toUpperCase();
                  return (
                    <Button
                      key={feature.properties.business_id}
                      variant="flat"
                      className="justify-start w-full text-left px-2 py-2 mb-1 bg-content1 border border-default-200 hover:bg-default-50 active:bg-default-100 focus:outline-none focus:ring-0 outline-none transition-colors"
                      onPress={() => handleFeatureSelect(feature)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="flex-shrink-0 flex items-center justify-center bg-default-100 rounded-md"
                          style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24 }}
                        >
                          <Image
                            src={`/industries-${isDark ? 'dark' : 'light'}/${letter}.svg`}
                            alt="industry"
                            width={isMobile ? 16 : 20}
                            height={isMobile ? 16 : 20}
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
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <div className="bg-default-100 p-1.5 rounded-md flex items-center justify-center mt-1">
                    <Image
                      src={`/industries-${isDark ? 'dark' : 'light'}/${selectedFeature.properties.industry_letter || 'broken'}.svg`}
                      alt="industry"
                      width={isMobile ? 18 : 24}
                      height={isMobile ? 18 : 24}
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
                  isEnabled={false}
                  className={isMobile ? (isCompact ? 'max-h-[80px]' : 'max-h-[120px]') : ''}
                >
                  {(() => {
                    let rawAddresses: AddressMap = {};

                    if (selectedFeature.properties.addresses) {
                      if (typeof selectedFeature.properties.addresses === 'string') {
                        try {
                          rawAddresses = JSON.parse(selectedFeature.properties.addresses);
                        } catch {
                          rawAddresses = {};
                        }
                      } else {
                        rawAddresses = selectedFeature.properties.addresses as AddressMap;
                      }
                    }

                    const visiting = rawAddresses[AddressTypeEnum.VISITING];
                    const postal = rawAddresses[AddressTypeEnum.POSTAL];
                    const coordsDiffer = areCoordinatesDifferent(visiting, postal);

                    if (!visiting && !postal) {
                      return (
                        <div className="text-center py-2 text-default-400 bg-default-50 rounded-lg border border-default-200">
                          <Icon icon="lucide:map-off" width={18} className="mb-1" />
                          <div className="text-xs">No address available</div>
                        </div>
                      );
                    }

                    if (!coordsDiffer && visiting) {
                      return renderAddress('Visiting / Postal Address:', visiting);
                    }

                    return (
                      <>
                        {visiting?.longitude &&
                          visiting.latitude &&
                          renderAddress(
                            'Visiting Address:',
                            visiting,
                            [visiting.longitude, visiting.latitude],
                            coordsDiffer,
                          )}
                        {postal?.longitude &&
                          postal.latitude &&
                          renderAddress(
                            'Postal Address:',
                            postal,
                            [postal.longitude, postal.latitude],
                            coordsDiffer,
                          )}
                      </>
                    );
                  })()}

                  {(!isCompact || !isMobile) && selectedFeature && (
                    <div className="space-y-2">
                      {hasValidIndustryDescription(selectedFeature.properties) && (
                        <div className="mt-2">
                          <div className="text-xs md:text-sm font-semibold text-default-700 uppercase mb-1">
                            Industry
                          </div>
                          <div className="text-xs md:text-sm text-default-600 p-2 bg-default-50 rounded-lg border border-default-200">
                            {selectedFeature.properties.industry_description}
                          </div>
                        </div>
                      )}

                      {hasValidWebsite(selectedFeature.properties) && (
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
                    </div>
                  )}
                </ScrollShadow>

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
              <div className="text-center py-5 text-default-400 bg-default-50 rounded-lg border border-default-200">
                <Icon icon="lucide:building" width={24} className="mb-2" />
                <div className="text-sm">No company selected.</div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
