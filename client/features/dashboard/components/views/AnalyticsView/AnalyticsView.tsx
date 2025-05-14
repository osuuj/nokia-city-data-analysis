'use client';

import { CitySearch } from '@/features/dashboard/components/common/CitySearch/CitySearch';
import { getThemedIndustryColor, useChartTheme } from '@/features/dashboard/hooks/useChartTheme';
import { useCitySelection } from '@/features/dashboard/hooks/useCitySelection';
import { filters } from '@/features/dashboard/utils/filters';
import {
  useCityComparison,
  useIndustriesByCity,
  useIndustryDistribution,
  useTopCities,
} from '@/shared/hooks/api/useAnalytics';
import { useCities } from '@/shared/hooks/api/useData';
import {
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
import { useCallback, useMemo, useState } from 'react';
import { CityComparison, CityIndustryBars, IndustryDistribution, TopCitiesChart } from './cards';

// Constants
const MAX_SELECTED_CITIES = 5;
const MAX_SELECTED_INDUSTRIES = 5;
const OTHER_CATEGORY_NAME_FROM_BACKEND = 'Other';
const OTHER_CATEGORY_DISPLAY_NAME = 'Others';

// Type definitions
type TransformedIndustriesByCity = {
  city: string;
  [key: string]: string | number; // Allow string for city, number for others
};

type TransformedCityComparison = {
  industry: string;
  [key: string]: string | number; // Allow string for industry, number for others
};

/**
 * AnalyticsView component that uses React Query hooks
 *
 * Key features:
 * - Uses the centralized API hooks from shared/hooks/api
 * - Implements proper caching with React Query
 * - Better error handling and loading states
 * - Consistent data fetching approach with the rest of the application
 * - More efficient data transformations with proper memoization
 */
export function AnalyticsView() {
  // Theme
  const { currentTheme } = useChartTheme();

  // Fetch cities using our React Query hook
  const { data: allCities = [], isLoading: citiesLoading } = useCities();

  // Use our custom hook for city selection management
  const {
    selectedCities,
    searchQuery: citySearchQuery,
    setSearchQuery: setCitySearchQuery,
    showMaxWarning: showMaxCityWarning,
    filteredCities: filteredCitiesForSearch,
    focusedCity: pieChartFocusCity,
    handleAddCity: handleCitySelectionAdd,
    handleRemoveCity: handleCitySelectionRemove,
    handleClearAllCities,
    handleSetFocusCity: handlePieFocusChange,
    isAtMaxCities,
  } = useCitySelection({
    maxCities: MAX_SELECTED_CITIES,
    allCities,
    onSelectionChange: (cities) => {
      // Any additional logic when cities change
      if (cities.size <= 1) {
        handlePieFocusChange(null);
      }
    },
  });

  // Industry selection state
  const [selectedIndustryNames, setSelectedIndustryNames] = useState<string[]>([]);
  const [showMaxIndustryWarning, setShowMaxIndustryWarning] = useState(false);

  // Create industry letter -> name map
  const industryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    const industryFilter = filters.find((f) => f.key === 'industries');
    if (industryFilter?.options) {
      for (const opt of industryFilter.options) {
        map.set(opt.value, opt.title);
      }
    }
    return map;
  }, []);

  // Helper function to get industry name from letter - MEMOIZED
  const getIndustryName = useCallback(
    (key: string): string => {
      if (key === OTHER_CATEGORY_NAME_FROM_BACKEND) {
        return OTHER_CATEGORY_DISPLAY_NAME;
      }
      return industryNameMap.get(key) || key;
    },
    [industryNameMap],
  );

  // Helper to get industry key from name - MEMOIZED
  const getIndustryKeyFromName = useCallback(
    (displayName: string): string | undefined => {
      if (displayName === OTHER_CATEGORY_DISPLAY_NAME) {
        return OTHER_CATEGORY_NAME_FROM_BACKEND;
      }

      // Reverse lookup in our map
      for (const [key, name] of industryNameMap.entries()) {
        if (name === displayName) {
          return key;
        }
      }

      return undefined;
    },
    [industryNameMap],
  );

  // Get industry icon path with proper fallback
  const getIndustryIconPath = useCallback(
    (industryName: string): string => {
      // Special case for Others/Other category to avoid 404
      if (
        industryName === OTHER_CATEGORY_DISPLAY_NAME ||
        industryName === OTHER_CATEGORY_NAME_FROM_BACKEND
      ) {
        return `/industries-${currentTheme || 'light'}/broken.svg`;
      }

      const key = getIndustryKeyFromName(industryName);
      return `/industries-${currentTheme || 'light'}/${key || 'broken'}.svg`;
    },
    [getIndustryKeyFromName, currentTheme],
  );

  // Get industry color based on theme
  const getIndustryColor = useCallback(
    (industryName: string): string => {
      const industryKey = getIndustryKeyFromName(industryName);
      return getThemedIndustryColor(industryName, industryKey, filters, currentTheme);
    },
    [getIndustryKeyFromName, currentTheme],
  );

  // Handlers for industry selection
  const handleIndustrySelectionChange = (keys: unknown) => {
    if (!(keys instanceof Set)) return;
    const currentSelectionKeys = keys as Set<React.Key>;

    const namesToStore: string[] = [];
    for (const key of currentSelectionKeys) {
      if (typeof key === 'string') namesToStore.push(key);
    }

    if (namesToStore.length <= MAX_SELECTED_INDUSTRIES) {
      setSelectedIndustryNames(namesToStore);
      setShowMaxIndustryWarning(false);
    } else {
      setShowMaxIndustryWarning(true);
      setTimeout(() => setShowMaxIndustryWarning(false), 3000);
    }
  };

  const handleIndustrySelectionRemove = (industryNameToRemove: string) => {
    setSelectedIndustryNames((prev) => prev.filter((name) => name !== industryNameToRemove));
    setShowMaxIndustryWarning(false);
  };

  const handleClearAllIndustries = () => {
    setSelectedIndustryNames([]);
    setShowMaxIndustryWarning(false);
  };

  // Get city arrays for queries
  const selectedCitiesArray = useMemo(() => {
    return Array.from(selectedCities);
  }, [selectedCities]);

  // Determine URL for industry distribution fetch based on selection
  const distributionFetchUrl = useMemo(() => {
    if (selectedCities.size === 1) {
      return selectedCitiesArray[0];
    }
    if (selectedCities.size > 1 && pieChartFocusCity) {
      return pieChartFocusCity;
    }
    return null;
  }, [selectedCities, selectedCitiesArray, pieChartFocusCity]);

  // Fetch data using React Query hooks
  const { data: industryDistributionData = [], isLoading: loadingIndustryDistribution } =
    useIndustryDistribution(distributionFetchUrl);

  const { data: industriesByCityData = [], isLoading: loadingIndustriesByCity } =
    useIndustriesByCity(selectedCitiesArray);

  const { data: cityComparisonData = [], isLoading: loadingCityComparison } =
    useCityComparison(selectedCitiesArray);

  const { data: topCitiesData = [], isLoading: loadingTopCities } = useTopCities();

  // Only fetch multi-city data if at least one city is selected
  const canFetchMultiCity = selectedCities.size > 0 && selectedCities.size <= MAX_SELECTED_CITIES;

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

  // Get available sorted industries to know which to display by default
  const availableSortedIndustries = useMemo(() => {
    if (!industriesByCityData || industriesByCityData.length === 0) return [];

    const industryTotals: Record<string, number> = {};
    const industryKeys = new Set<string>();

    // Sum counts for each industry across all selected cities
    for (const cityData of industriesByCityData) {
      for (const key of Object.keys(cityData)) {
        if (key !== 'city') {
          const industryName = getIndustryName(key);
          industryKeys.add(industryName);
          industryTotals[industryName] =
            (industryTotals[industryName] || 0) + (Number(cityData[key]) || 0);
        }
      }
    }

    // Convert to array and sort
    return Array.from(industryKeys)
      .map((name) => ({ name, total: industryTotals[name] }))
      .sort((a, b) => b.total - a.total);
  }, [industriesByCityData, getIndustryName]);

  // Select the top industries by default if none selected
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

  // Transform industry distribution data for our component
  const industryDistributionDataAll = useMemo(() => {
    if (!industryDistributionData) return [];

    return industryDistributionData.map((item, index) => {
      // Ensure the item is valid
      if (!item || typeof item !== 'object') {
        console.warn(`Invalid industry item at index ${index}:`, item);
        return { name: `Unknown-${index}`, value: 0 };
      }

      // Get name with proper mapping
      const name = item.name ? getIndustryName(item.name) : `Unknown-${index}`;

      // Ensure value is a number
      const value =
        typeof item.value === 'number'
          ? item.value
          : Number.parseInt(item.value as unknown as string, 10) || 0;

      return {
        ...item,
        name,
        value,
      };
    });
  }, [industryDistributionData, getIndustryName]);

  // Filter Industry Distribution data based on selected industries
  const filteredIndustryDistributionData = useMemo(() => {
    if (!industryDistributionDataAll) return [];
    return industryDistributionDataAll.filter((item) =>
      selectedIndustryDisplayNames.has(item.name),
    );
  }, [industryDistributionDataAll, selectedIndustryDisplayNames]);

  // Transform data for City Industry Bars chart
  const industriesByCityDataAll = useMemo(() => {
    if (!industriesByCityData) return [];

    return industriesByCityData.map((cityData) => {
      // Cast initial object
      const transformedData = { city: cityData.city as string } as TransformedIndustriesByCity;
      for (const key of Object.keys(cityData)) {
        if (key !== 'city') {
          // Get proper industry name
          const industryName = getIndustryName(key);
          // Values associated with industry keys should be numbers
          transformedData[industryName] = Number(cityData[key]) || 0;
        }
      }
      return transformedData;
    });
  }, [industriesByCityData, getIndustryName]);

  // Filter Industries by City data based on selected industries
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
        // Check using Object.hasOwn for safety
        if (Object.hasOwn(cityData, industryName)) {
          // Ensure value is treated as number
          filteredData[industryName] = Number(cityData[industryName]) || 0;
        }
      }
      return filteredData;
    });
  }, [industriesByCityDataAll, selectedIndustryNames, availableSortedIndustries]);

  // Transform data for City Comparison chart
  const cityComparisonDataAll = useMemo(() => {
    if (!cityComparisonData) return [];

    return cityComparisonData.map((item) => {
      // Cast initial object
      const transformedData = {
        industry: getIndustryName(item.industry as string),
      } as TransformedCityComparison;
      for (const key of Object.keys(item)) {
        if (key !== 'industry') {
          // Values associated with city keys should be numbers
          transformedData[key] = Number(item[key]) || 0;
        }
      }
      return transformedData;
    });
  }, [cityComparisonData, getIndustryName]);

  // Filter City Comparison data based on selected industries
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

  // Handler for selecting a city from the TopCitiesChart
  const handleTopCitySelect = (city: string) => {
    handleCitySelectionAdd(city);
  };

  // --- UI LAYOUT FROM OLD VERSION ---
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
                <div className="flex flex-col gap-2 md:min-w-[280px]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-default-600">
                      Selected Cities ({selectedCities.size}/{MAX_SELECTED_CITIES})
                    </span>
                    {selectedCities.size > 0 && (
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="h-6 px-2 min-w-0"
                        onPress={handleClearAllCities}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  <CitySearch selectedCity="" onCityChange={handleCitySelectionAdd} />

                  {showMaxCityWarning && (
                    <p className="text-danger text-xs">
                      Maximum of {MAX_SELECTED_CITIES} cities can be selected.
                    </p>
                  )}

                  {/* Display selected cities as chips */}
                  {selectedCities.size > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array.from(selectedCities).map((city) => (
                        <Chip
                          key={city}
                          onClose={() => handleCitySelectionRemove(city)}
                          variant="flat"
                          color="primary"
                          size="sm"
                          className={`my-1 ${pieChartFocusCity === city ? 'border-primary' : ''}`}
                        >
                          {city}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Tooltip>
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
                      <SelectItem key={industry.name} textValue={industry.name}>
                        <div className="flex items-center gap-2">
                          <img
                            src={getIndustryIconPath(industry.name)}
                            alt={industry.name}
                            className="w-4 h-4"
                          />
                          <span>{`${industry.name} (${industry.total})`}</span>
                        </div>
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
                      style={{
                        backgroundColor: `${getIndustryColor(name)}40`, // Use template literal
                        color: getIndustryColor(name),
                      }}
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
                getThemedIndustryColor={getIndustryColor}
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
                getThemedIndustryColor={getIndustryColor}
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
              <CityComparison
                data={filteredCityComparisonData}
                cities={selectedCitiesArray}
                theme={currentTheme}
              />
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
              <TopCitiesChart data={topCitiesData} onCityClick={handleTopCitySelect} />
            ) : (
              <p className="text-center text-default-500">Could not load top cities data.</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
