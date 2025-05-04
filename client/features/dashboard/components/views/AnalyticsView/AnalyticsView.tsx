'use client';

import { filters } from '@/features/dashboard/utils/filters'; // Import filters config
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Select,
  SelectItem,
  Spinner,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { CityComparison, CityIndustryBars, IndustryDistribution, TopCitiesChart } from './cards';

export interface TopCityData {
  city: string;
  count: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Define the name for the grouped category from backend
const OTHER_CATEGORY_NAME_FROM_BACKEND = 'Other';
const OTHER_CATEGORY_DISPLAY_NAME = 'Others'; // How to display it

// Helper function to get industry name from letter or handle "Other"
const getIndustryName = (key: string, map: Map<string, string>): string => {
  if (key === OTHER_CATEGORY_NAME_FROM_BACKEND) {
    return OTHER_CATEGORY_DISPLAY_NAME;
  }
  return map.get(key) || key; // Return letter if name not found (shouldn't happen for priority)
};

const MAX_SELECTED_CITIES = 5;
const MAX_SELECTED_INDUSTRIES = 5;

// --- Type Definitions ---
// Type for data coming from /industries-by-city and /city-comparison (after backend processing)
// Keys will be city names or industry letters/'Other'
type PivotedData = Array<Record<string, string | number>>; // Allow string (for city/industry name) or number (for counts)
// Type for data from /industry-distribution (after backend processing)
type DistributionItemRaw = {
  name: string;
  value: number;
  others_breakdown?: Array<{ name: string; value: number }>; // Optional breakdown
};
type DistributionDataRaw = Array<DistributionItemRaw>;
// Type for transformed data passed to charts (display names used)
type TransformedIndustriesByCity = {
  city: string;
  [key: string]: string | number; // Allow string for city, number for others
};
type TransformedCityComparison = {
  industry: string;
  [key: string]: string | number; // Allow string for industry, number for others
};
type TransformedDistribution = Array<{ name: string; value: number }>;

// Define interface for filter and option to fix type issues
interface FilterItem {
  key: string;
  title: string;
  options?: Array<{
    title: string;
    value: string;
    description?: string;
    icon?: string;
    color?: string | { light: string; dark: string };
  }>;
}

export const AnalyticsView: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = theme as 'light' | 'dark' | undefined;

  // State for selected cities - Limit to 5
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  // State for pie chart focus city
  const [pieChartFocusCity, setPieChartFocusCity] = useState<string | null>(null);
  const [showMaxCityWarning, setShowMaxCityWarning] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState(''); // For Autocomplete input
  // State for selected industries (store letters: 'A', 'C', etc.)
  const [selectedIndustryNames, setSelectedIndustryNames] = useState<string[]>([]);
  const [showMaxIndustryWarning, setShowMaxIndustryWarning] = useState(false);

  // Fetch list of all cities
  const { data: allCities = [], isLoading: citiesLoading } = useSWR<string[]>(
    `${BASE_URL}/api/v1/cities`,
    fetcher,
    { fallbackData: [] },
  );

  // Effect to reset pie chart focus city if selection changes
  useEffect(() => {
    if (selectedCities.size <= 1) {
      setPieChartFocusCity(null); // Reset if 0 or 1 city selected
    } else if (pieChartFocusCity && !selectedCities.has(pieChartFocusCity)) {
      setPieChartFocusCity(null); // Reset if focus city is no longer selected
    }
  }, [selectedCities, pieChartFocusCity]);

  // Filter cities for Autocomplete based on search query
  const filteredCitiesForAutocomplete = useMemo(() => {
    return allCities
      .filter((city) => city.toLowerCase().includes(citySearchQuery.toLowerCase()))
      .map((city) => ({ key: city, label: city })); // Map to objects
  }, [allCities, citySearchQuery]);

  // Create industry letter -> name map
  const industryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    const industryFilter = filters.find((f: FilterItem) => f.key === 'industries');
    if (industryFilter?.options) {
      for (const opt of industryFilter.options) {
        map.set(opt.value, opt.title);
      }
    }
    return map;
  }, []);

  // Get the correct color based on theme and industry display name
  const getThemedIndustryColor = (industryName: string, theme: string | undefined): string => {
    const industryKey = getIndustryKeyFromName(industryName);
    const industryFilter = filters.find((f: FilterItem) => f.key === 'industries');
    const option = industryFilter?.options?.find((opt) => opt.value === industryKey);

    // Default color if not found
    const defaultColor = theme === 'dark' ? '#A0A0A0' : '#666666';

    // Check if color has the expected structure
    const colorConfig = option?.color as { light: string; dark: string } | undefined;
    if (colorConfig?.light && colorConfig?.dark) {
      return theme === 'dark' ? colorConfig.dark : colorConfig.light;
    }

    // Fallback for "Others" or if color not defined/invalid
    if (industryName === OTHER_CATEGORY_DISPLAY_NAME) {
      return theme === 'dark' ? '#71717a' : '#a1a1aa'; // zinc-500 / zinc-400
    }
    return defaultColor;
  };

  // Determine URL for Industry Distribution fetch
  const distributionFetchUrl = useMemo(() => {
    if (selectedCities.size === 1) {
      const city = Array.from(selectedCities)[0];
      return `${BASE_URL}/api/v1/analytics/industry-distribution?cities=${encodeURIComponent(city)}`;
    }
    if (selectedCities.size > 1 && pieChartFocusCity) {
      // Fetch only for the focused city when multiple are selected
      return `${BASE_URL}/api/v1/analytics/industry-distribution?cities=${encodeURIComponent(pieChartFocusCity)}`;
    }
    return null; // Don't fetch if 0 or >1 selected without focus
  }, [selectedCities, pieChartFocusCity]);

  // Only fetch multi-city data if 1 to MAX_SELECTED_CITIES are selected
  const canFetchMultiCity = selectedCities.size > 0 && selectedCities.size <= MAX_SELECTED_CITIES;
  const multiCityQueryParam = canFetchMultiCity ? Array.from(selectedCities).join(',') : null;

  // --- Fetch Raw Data ---
  const { data: rawIndustryDistributionData, isLoading: loadingIndustryDistribution } =
    useSWR<DistributionDataRaw>(
      distributionFetchUrl, // Use dynamic URL
      fetcher,
      { fallbackData: [] },
    );

  const { data: rawIndustriesByCityData, isLoading: loadingIndustriesByCity } = useSWR<PivotedData>(
    // Use multiCityQueryParam - runs only if 1-5 cities selected
    multiCityQueryParam
      ? `${BASE_URL}/api/v1/analytics/industries-by-city?cities=${multiCityQueryParam}`
      : null,
    fetcher,
    { fallbackData: [] },
  );

  const { data: rawCityComparisonData, isLoading: loadingCityComparison } = useSWR<PivotedData>(
    // Use multiCityQueryParam - runs only if 1-5 cities selected
    multiCityQueryParam
      ? `${BASE_URL}/api/v1/analytics/city-comparison?cities=${multiCityQueryParam}`
      : null,
    fetcher,
    { fallbackData: [] },
  );

  // Top cities fetch remains unchanged (always fetches top N overall)
  const { data: topCitiesData, isLoading: loadingTopCities } = useSWR<TopCityData[]>(
    `${BASE_URL}/api/v1/analytics/top-cities?limit=10`,
    fetcher,
    { fallbackData: [] },
  );

  // --- Transform Data for Charts ---
  const industryDistributionDataAll: TransformedDistribution = useMemo(() => {
    if (!rawIndustryDistributionData) return [];
    return rawIndustryDistributionData.map((item) => ({
      ...item,
      name: getIndustryName(item.name, industryNameMap),
    }));
  }, [rawIndustryDistributionData, industryNameMap]);

  const industriesByCityDataAll: TransformedIndustriesByCity[] = useMemo(() => {
    if (!rawIndustriesByCityData) return [];
    return rawIndustriesByCityData.map((cityData) => {
      // Cast initial object
      const transformedData = { city: cityData.city as string } as TransformedIndustriesByCity;
      for (const key of Object.keys(cityData)) {
        if (key !== 'city') {
          // Values associated with industry keys should be numbers
          transformedData[getIndustryName(key, industryNameMap)] = Number(cityData[key]) || 0;
        }
      }
      return transformedData;
    });
  }, [rawIndustriesByCityData, industryNameMap]);

  const cityComparisonDataAll: TransformedCityComparison[] = useMemo(() => {
    if (!rawCityComparisonData) return [];
    return rawCityComparisonData.map((item) => {
      // Cast initial object
      const transformedData = {
        industry: getIndustryName(item.industry as string, industryNameMap),
      } as TransformedCityComparison;
      for (const key of Object.keys(item)) {
        if (key !== 'industry') {
          // Values associated with city keys should be numbers
          transformedData[key] = Number(item[key]) || 0;
        }
      }
      return transformedData;
    });
  }, [rawCityComparisonData, industryNameMap]);

  // Calculate available industries and sort them by total count across selected cities
  const availableSortedIndustries = useMemo(() => {
    if (!industriesByCityDataAll || industriesByCityDataAll.length === 0) return [];

    const industryTotals: Record<string, number> = {};
    const industryKeys = new Set<string>();

    // Sum counts for each industry across all selected cities
    for (const cityData of industriesByCityDataAll) {
      // Use for...of
      for (const key of Object.keys(cityData)) {
        // Use for...of
        if (key !== 'city') {
          industryKeys.add(key);
          // Ensure value is treated as number before adding
          industryTotals[key] = (industryTotals[key] || 0) + (Number(cityData[key]) || 0);
        }
      }
    }

    // Convert to array and sort
    return Array.from(industryKeys)
      .map((name) => ({ name, total: industryTotals[name] }))
      .sort((a, b) => b.total - a.total);
  }, [industriesByCityDataAll]);

  // Find corresponding key (letter or 'Other') for a given display name
  const getIndustryKeyFromName = (displayName: string): string | undefined => {
    if (displayName === OTHER_CATEGORY_DISPLAY_NAME) return OTHER_CATEGORY_NAME_FROM_BACKEND;
    for (const [key, value] of industryNameMap.entries()) {
      if (value === displayName) return key;
    }
    return undefined;
  };

  // Filter the data for the bar chart based on selected industries
  const filteredIndustriesByCityData = useMemo(() => {
    if (!industriesByCityDataAll || industriesByCityDataAll.length === 0) return [];

    let keysToShow: Set<string>;
    if (selectedIndustryNames.length > 0) {
      // User has selected specific industries (use their display names)
      keysToShow = new Set(selectedIndustryNames);
    } else {
      // No selection, default to top 5 available sorted industries
      keysToShow = new Set(
        availableSortedIndustries.slice(0, MAX_SELECTED_INDUSTRIES).map((i) => i.name),
      );
    }

    return industriesByCityDataAll.map((cityData) => {
      // Cast initial object
      const filteredData = { city: cityData.city } as TransformedIndustriesByCity;
      for (const industryName of keysToShow) {
        // Use for...of
        // Check using Object.hasOwn for safety
        if (Object.hasOwn(cityData, industryName)) {
          // Ensure value is treated as number
          filteredData[industryName] = Number(cityData[industryName]) || 0;
        }
      }
      return filteredData;
    });
  }, [industriesByCityDataAll, selectedIndustryNames, availableSortedIndustries]);

  // Handle adding a city from Autocomplete
  const handleCitySelectionAdd = (key: React.Key | null) => {
    // Clear search input only after successful add or if selection is explicitly cleared
    // setCitySearchQuery(''); // REMOVE from here

    if (typeof key === 'string') {
      const cityToAdd = key;
      if (selectedCities.size < MAX_SELECTED_CITIES) {
        setSelectedCities((prev) => new Set(prev).add(cityToAdd));
        setShowMaxCityWarning(false);
        setCitySearchQuery(''); // Clear input AFTER successful addition
      } else {
        setShowMaxCityWarning(true);
        setTimeout(() => setShowMaxCityWarning(false), 3000);
        // Don't add the city, but also don't clear input if max is reached, let user see what they typed
      }
    } else {
      // Key is null (e.g., user cleared selection from dropdown/input)
      setCitySearchQuery(''); // Clear input if selection is cleared
    }
  };

  // Handle removing a city via Chip close button
  const handleCitySelectionRemove = (cityToRemove: string) => {
    setSelectedCities((prev) => {
      const next = new Set(prev);
      next.delete(cityToRemove);
      return next;
    });
    setShowMaxCityWarning(false); // Hide warning on removal
  };

  // Handle clearing all selections
  const handleClearAllCities = () => {
    setSelectedCities(new Set());
    setSelectedIndustryNames([]); // Clear industries when cities cleared
    setShowMaxCityWarning(false);
  };

  // Handle changing the focus city for the pie chart
  const handlePieFocusChange = (key: React.Key | null) => {
    if (typeof key === 'string') {
      setPieChartFocusCity(key);
    } else {
      setPieChartFocusCity(null); // Handle case where selection is cleared/invalid
    }
  };

  // Handle industry selection change from Select dropdown
  const handleIndustrySelectionChange = (keys: unknown) => {
    if (!(keys instanceof Set)) return;
    const currentSelectionKeys = keys as Set<React.Key>;

    const namesToStore: string[] = [];
    for (const key of currentSelectionKeys) {
      // Use for...of
      if (typeof key === 'string') namesToStore.push(key);
    }

    if (namesToStore.length <= MAX_SELECTED_INDUSTRIES) {
      setSelectedIndustryNames(namesToStore); // Store the selected display names
      setShowMaxIndustryWarning(false);
    } else {
      // Revert selection or just show warning
      // To revert: setSelectedIndustryNames(selectedIndustryNames);
      setShowMaxIndustryWarning(true);
      setTimeout(() => setShowMaxIndustryWarning(false), 3000);
    }
  };

  // Handle removing an industry via its Chip close button
  const handleIndustrySelectionRemove = (industryNameToRemove: string) => {
    setSelectedIndustryNames((prev) => prev.filter((name) => name !== industryNameToRemove));
    setShowMaxIndustryWarning(false);
  };

  // Handle clearing all selected industries
  const handleClearAllIndustries = () => {
    setSelectedIndustryNames([]);
    setShowMaxIndustryWarning(false);
  };

  // Determine overall loading state
  const isMultiCityLoading = loadingIndustriesByCity || loadingCityComparison;
  const isTopCityLoading = loadingTopCities;
  const isLoading =
    (!!distributionFetchUrl && loadingIndustryDistribution) ||
    (canFetchMultiCity && isMultiCityLoading) ||
    isTopCityLoading ||
    citiesLoading;

  // Determine placeholder message for the main grid area
  let gridPlaceholderMessage = '';
  if (!isLoading && selectedCities.size === 0) {
    gridPlaceholderMessage = 'Please select one or more cities to view analytics.';
  }

  // --- Filtering Based on Selected Industries ---
  const selectedIndustryDisplayNames = useMemo(() => {
    if (selectedIndustryNames.length > 0) {
      return new Set(selectedIndustryNames);
    }
    if (selectedCities.size > 0 && availableSortedIndustries.length > 0) {
      return new Set(
        availableSortedIndustries.slice(0, MAX_SELECTED_INDUSTRIES).map((i) => i.name),
      );
    }
    return new Set<string>();
  }, [selectedIndustryNames, availableSortedIndustries, selectedCities]);

  // Filter Pie Chart Data
  const filteredIndustryDistributionData = useMemo(() => {
    if (!industryDistributionDataAll) return [];
    return industryDistributionDataAll.filter((item) =>
      selectedIndustryDisplayNames.has(item.name),
    );
  }, [industryDistributionDataAll, selectedIndustryDisplayNames]);

  // Filter Radar Chart Data
  const filteredCityComparisonData = useMemo(() => {
    if (!cityComparisonDataAll) return [];
    return cityComparisonDataAll.filter((item) => selectedIndustryDisplayNames.has(item.industry));
  }, [cityComparisonDataAll, selectedIndustryDisplayNames]);

  // Determine which industries are potentially grouped into "Others"
  const potentialOthersIndustries = useMemo(() => {
    const allKnownDisplayNames = Array.from(industryNameMap.values());
    // Names currently displayed individually (either selected or top N default)
    const displayedNames = selectedIndustryDisplayNames;
    return allKnownDisplayNames.filter(
      (name) => name !== OTHER_CATEGORY_DISPLAY_NAME && !displayedNames.has(name),
    );
  }, [industryNameMap, selectedIndustryDisplayNames]);

  return (
    <div className="w-full p-2 sm:p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Industry Analytics</h1>
        <div className="flex flex-col lg:flex-row flex-wrap items-start gap-4">
          {/* City selection section - made more responsive */}
          <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
            <Tooltip
              content={`Select up to ${MAX_SELECTED_CITIES} cities to compare.`}
              placement="bottom"
            >
              <div className="w-full sm:w-auto">
                <Autocomplete
                  label="Search & Add Cities"
                  placeholder="Type to search..."
                  className="w-full sm:max-w-xs sm:min-w-[250px]"
                  isLoading={citiesLoading}
                  items={filteredCitiesForAutocomplete}
                  inputValue={citySearchQuery}
                  onInputChange={setCitySearchQuery}
                  onSelectionChange={handleCitySelectionAdd}
                  allowsCustomValue={false}
                >
                  {(item) => (
                    <AutocompleteItem key={item.key} textValue={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </Tooltip>
            {selectedCities.size > 0 && (
              <div className="flex flex-wrap items-center gap-1 pt-1 w-full">
                {Array.from(selectedCities).map((city) => (
                  <Chip
                    key={city}
                    onClose={() => handleCitySelectionRemove(city)}
                    variant="flat"
                    size="sm"
                  >
                    {city}
                  </Chip>
                ))}
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  aria-label="Clear cities"
                  onPress={handleClearAllCities}
                  className="ml-auto"
                >
                  <Icon icon="lucide:x" width={16} />
                </Button>
              </div>
            )}
            {showMaxCityWarning && (
              <p className="text-tiny text-danger">Max {MAX_SELECTED_CITIES} cities allowed.</p>
            )}
          </div>

          {/* Industry selection section - made more responsive */}
          {selectedCities.size > 0 && (
            <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
              <Tooltip
                content={`Select up to ${MAX_SELECTED_INDUSTRIES} industries to display.`}
                placement="bottom"
              >
                <div className="w-full sm:w-auto">
                  <Select
                    label="Select Industries"
                    placeholder="Defaults to Top 5"
                    selectionMode="multiple"
                    className="w-full sm:max-w-xs sm:min-w-[250px]"
                    selectedKeys={selectedIndustryNames}
                    onSelectionChange={handleIndustrySelectionChange}
                  >
                    {availableSortedIndustries.map((industry) => (
                      <SelectItem key={industry.name}>
                        {`${industry.name} (${industry.total})`}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </Tooltip>
              {selectedIndustryNames.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1 w-full">
                  {selectedIndustryNames.map((name) => (
                    <Chip
                      key={name}
                      onClose={() => handleIndustrySelectionRemove(name)}
                      variant="flat"
                      color="primary"
                      size="sm"
                    >
                      {name}
                    </Chip>
                  ))}
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Clear selected industries"
                    onPress={handleClearAllIndustries}
                    className="ml-auto"
                  >
                    <Icon icon="lucide:x" width={16} />
                  </Button>
                </div>
              )}
              {showMaxIndustryWarning && (
                <p className="text-tiny text-danger">
                  Max {MAX_SELECTED_INDUSTRIES} industries allowed.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {isLoading && !citiesLoading && (
        <Spinner label="Loading analytics data..." className="mx-auto py-10" />
      )}
      {!isLoading && gridPlaceholderMessage && (
        <p className="text-center text-default-500 py-10">{gridPlaceholderMessage}</p>
      )}

      {/* Chart grid - changed to single column on mobile, two columns on md+ screens */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${selectedCities.size === 0 || isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {/* Industry Distribution Card */}
        <Card className="border border-default-200">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-3 sm:px-6">
            <h2 className="text-lg font-bold">Industry Distribution</h2>
            {selectedCities.size > 1 && (
              <Select
                label="Focus City"
                placeholder="Select city"
                size="sm"
                className="w-full sm:w-auto sm:max-w-xs sm:min-w-[250px]"
                selectedKeys={pieChartFocusCity ? [pieChartFocusCity] : []}
                onSelectionChange={(keys) =>
                  handlePieFocusChange(keys instanceof Set ? (Array.from(keys)[0] as string) : null)
                }
                popoverProps={{
                  className: 'min-w-[200px]', // Set minimum width for the dropdown popover
                }}
              >
                {Array.from(selectedCities)
                  .sort()
                  .map((city) => (
                    <SelectItem key={city}>{city}</SelectItem>
                  ))}
              </Select>
            )}
          </CardHeader>
          <Divider className="my-1 sm:my-2" />
          <CardBody className="px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
            {!!distributionFetchUrl && loadingIndustryDistribution ? (
              <Spinner />
            ) : distributionFetchUrl && selectedIndustryDisplayNames.size > 0 ? (
              <IndustryDistribution
                data={filteredIndustryDistributionData}
                currentTheme={currentTheme}
                getIndustryKeyFromName={getIndustryKeyFromName}
                potentialOthers={potentialOthersIndustries}
                industryNameMap={industryNameMap}
                getThemedIndustryColor={getThemedIndustryColor}
              />
            ) : selectedCities.size > 1 && !pieChartFocusCity ? (
              <p className="text-center text-default-500">Select a city from the dropdown above.</p>
            ) : selectedCities.size > 0 ? (
              <p className="text-center text-default-500">
                Select industries to view distribution.
              </p>
            ) : (
              <p className="text-center text-default-500">Select a city first.</p>
            )}
          </CardBody>
        </Card>

        {/* Industries by City Card */}
        <Card className={`${!canFetchMultiCity ? 'hidden' : ''} border border-default-200`}>
          <CardHeader className="flex justify-between items-center px-3 sm:px-6">
            <h2 className="text-lg font-bold">Industries by City</h2>
          </CardHeader>
          <Divider className="my-1 sm:my-2" />
          <CardBody className="px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
            {loadingIndustriesByCity ? (
              <Spinner />
            ) : selectedIndustryDisplayNames.size > 0 ? (
              <CityIndustryBars
                data={filteredIndustriesByCityData}
                currentTheme={currentTheme}
                getIndustryKeyFromName={getIndustryKeyFromName}
                potentialOthers={potentialOthersIndustries}
                getThemedIndustryColor={getThemedIndustryColor}
              />
            ) : (
              <p className="text-center text-default-500">Select industries to view details.</p>
            )}
          </CardBody>
        </Card>

        {/* City Comparison Card */}
        <Card className={`${!canFetchMultiCity ? 'hidden' : ''} border border-default-200`}>
          <CardHeader className="flex justify-between items-center px-3 sm:px-6">
            <h2 className="text-lg font-bold">City Comparison</h2>
          </CardHeader>
          <Divider className="my-1 sm:my-2" />
          <CardBody className="px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
            {loadingCityComparison ? (
              <Spinner />
            ) : selectedIndustryDisplayNames.size > 0 ? (
              <CityComparison data={filteredCityComparisonData} currentTheme={currentTheme} />
            ) : (
              <p className="text-center text-default-500">Select industries to compare cities.</p>
            )}
          </CardBody>
        </Card>

        {/* Top Cities Card */}
        <Card className="border border-default-200">
          <CardHeader className="flex justify-between items-center px-3 sm:px-6">
            <h2 className="text-lg font-bold">Top Cities by Active Company Count</h2>
          </CardHeader>
          <Divider className="my-1 sm:my-2" />
          <CardBody className="px-2 sm:px-6 py-2 sm:py-4 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
            {loadingTopCities ? (
              <Spinner />
            ) : topCitiesData && topCitiesData.length > 0 ? (
              <TopCitiesChart data={topCitiesData} currentTheme={currentTheme} />
            ) : (
              <p className="text-center text-default-500">Could not load top cities data.</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
