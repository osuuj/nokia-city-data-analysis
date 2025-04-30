'use client';

import { FeatureCardList } from '@/features/dashboard/components/controls/FeatureCardList';
import { filters } from '@/features/dashboard/data/filters';
import type { CompanyProperties } from '@/features/dashboard/types';
import type { Feature, FeatureCollection, Point } from 'geojson';
import type { GeoJSONSource } from 'mapbox-gl';
import type { Feature as MapboxFeature } from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';
import MapboxMap from 'react-map-gl/mapbox';
import { MapDebugger } from './MapDebugger';

// Fallback Mapbox token for development (public token with limited usage)
const FALLBACK_MAPBOX_TOKEN =
  'pk.eyJ1IjoibWFwYm94LXB1YmxpYyIsImEiOiJja3lwZGJhc2kyb2drMzFwaGY0Z2ZnbHl5In0.oJPzXUBQcKCA-rH3BbR_bQ';

export interface MapViewProps {
  geojson: FeatureCollection<
    Point,
    CompanyProperties & { addressType?: 'Visiting address' | 'Postal address' }
  >;
  selectedBusinesses?: CompanyProperties[];
}

export function MapView({ geojson, selectedBusinesses }: MapViewProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<Array<MapboxFeature>>([]);
  const [activeFeature, setActiveFeature] = useState<MapboxFeature | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInitError, setMapInitError] = useState<string | null>(null);
  const mapRef = useRef<MapRef>(null);
  const { theme } = useTheme();
  const prevThemeRef = useRef(theme);

  // Log the incoming geojson data
  useEffect(() => {
    console.log('MapView received geojson:', {
      type: geojson?.type,
      featureCount: geojson?.features?.length || 0,
    });
  }, [geojson]);

  // Reset mapLoaded when theme changes
  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      setMapLoaded(false);
      prevThemeRef.current = theme;
    }
  }, [theme]);

  // Get the Mapbox token, use fallback in development
  const envMapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxToken = useMemo(() => {
    // In development, use fallback token if environment token is missing
    if (!envMapboxToken && process.env.NODE_ENV !== 'production') {
      console.log('Using fallback Mapbox token for development');
      return FALLBACK_MAPBOX_TOKEN;
    }
    return envMapboxToken;
  }, [envMapboxToken]);

  // Check if mapbox token is missing
  useEffect(() => {
    if (!mapboxToken) {
      console.error('Mapbox access token is missing! Add it to your environment variables.');
      setMapInitError('Mapbox access token is missing');
    } else {
      // Clear any previous error related to token
      if (mapInitError === 'Mapbox access token is missing') {
        setMapInitError(null);
      }
    }
  }, [mapboxToken, mapInitError]);

  // Use different styles based on theme
  const mapStyle =
    theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';

  // Get the business ID of the active feature
  const activeBusinessId = activeFeature?.properties?.business_id ?? null;

  // Handle map click to select features
  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) {
      console.warn('Map reference is not available on click');
      return;
    }

    // Query features at the clicked point
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['company-icons', 'multi-marker-icons', 'cluster-count-layer'],
    });

    console.log('Map click detected, features found:', features.length);

    if (features.length > 0) {
      const clicked = features[0];

      // Safety check: Make sure properties exists
      if (!clicked.properties) {
        console.warn('Clicked feature has no properties');
        return;
      }

      // Handle clicking on clusters
      if ('cluster_id' in clicked.properties && clicked.properties.cluster_id !== undefined) {
        const source = map.getSource('companies') as GeoJSONSource;
        const clusterId = clicked.properties.cluster_id;

        if (clusterId == null) return;

        // Zoom to the clicked cluster
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !clicked.geometry || zoom == null) {
            console.error('Error expanding cluster:', err);
            return;
          }

          // Ensure geometry is a Point with coordinates
          if (clicked.geometry.type !== 'Point') {
            console.warn('Clicked geometry is not a Point');
            return;
          }

          const coordinates = clicked.geometry.coordinates as [number, number];
          map.easeTo({ center: coordinates, zoom: zoom ?? 10, duration: 500 });
        });
        return;
      }

      // Set the clicked feature as active
      setSelectedFeatures(features);
      setActiveFeature(clicked);
      console.log('Selected feature:', clicked.properties.company_name);
    } else {
      // Clear selection if clicking on empty space
      setSelectedFeatures([]);
      setActiveFeature(null);
    }
  };

  // Update map when data or selected feature changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      if (mapLoaded) {
        console.warn('Map reference is not available even though map is loaded');
      }
      return;
    }

    if (!mapLoaded) {
      console.log('Map not yet loaded, skipping data update');
      return;
    }

    if (!geojson || !geojson.features || geojson.features.length === 0) {
      console.warn('No valid GeoJSON data to display on map');
      return;
    }

    console.log('Updating map with GeoJSON data:', {
      featureCount: geojson.features.length,
      activeFeature: activeBusinessId ? 'yes' : 'no',
    });

    // Find overlapping coordinates
    const coordMap = new Map<string, number>();
    for (const feature of geojson.features) {
      if (!feature.geometry) continue;
      const coords = feature.geometry.coordinates.join(',');
      coordMap.set(coords, (coordMap.get(coords) || 0) + 1);
    }

    // Add isOverlapping and isActive properties to features
    const taggedGeojson = {
      ...geojson,
      features: geojson.features.map((feature) => {
        if (!feature.geometry) return feature;

        const coords = feature.geometry.coordinates.join(',');
        const isOverlapping = (coordMap.get(coords) ?? 0) > 1;
        const isActive = feature.properties.business_id === activeBusinessId;

        return {
          ...feature,
          properties: {
            ...feature.properties,
            isOverlapping,
            isActive,
            industry_letter: feature.properties.industry_letter || 'U', // Use 'U' for unknown
          },
        };
      }),
    };

    // Add or update the GeoJSON source
    const sourceId = 'companies';
    const existingSource = map.getSource(sourceId);

    try {
      if (!existingSource) {
        console.log('Creating new GeoJSON source and layers');
        // First time - add the source and layers
        map.addSource(sourceId, {
          type: 'geojson',
          data: taggedGeojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        // Add cluster layer
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: sourceId,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1',
            ],
            'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
          },
        });

        // Add cluster count layer
        map.addLayer({
          id: 'cluster-count-layer',
          type: 'symbol',
          source: sourceId,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 14,
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          },
          paint: {
            'text-color': theme === 'dark' ? '#ffffff' : '#000000',
          },
        });

        // Add layer for overlapping markers
        map.addLayer({
          id: 'multi-marker-icons',
          type: 'circle',
          source: sourceId,
          filter: ['==', ['get', 'isOverlapping'], true],
          paint: {
            'circle-radius': 8,
            'circle-color': '#888888',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
          },
        });

        // Add layer for individual company markers
        map.addLayer({
          id: 'company-icons',
          type: 'circle',
          source: sourceId,
          filter: ['==', ['get', 'isOverlapping'], false],
          paint: {
            'circle-radius': 8,
            'circle-color': [
              'match',
              ['get', 'industry_letter'],
              'A',
              '#4CAF50', // Agriculture
              'B',
              '#8BC34A', // Mining
              'C',
              '#795548', // Manufacturing
              'D',
              '#FF9800', // Energy
              'E',
              '#009688', // Water
              'F',
              '#F44336', // Construction
              'G',
              '#673AB7', // Retail
              'H',
              '#3F51B5', // Transportation
              'I',
              '#2196F3', // Accommodation
              'J',
              '#00BCD4', // IT
              'K',
              '#9C27B0', // Finance
              'L',
              '#E91E63', // Real Estate
              'M',
              '#CDDC39', // Professional
              'N',
              '#FFEB3B', // Administrative
              'O',
              '#607D8B', // Public Administration
              'P',
              '#FFC107', // Education
              'Q',
              '#03A9F4', // Health
              'R',
              '#9E9E9E', // Arts
              'S',
              '#FFEB3B', // Other Services
              'T',
              '#8D6E63', // Households
              'U',
              '#78909C', // Unknown/Other
              '#78909C', // Default color for other values
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
          },
        });

        // Add highlight for active marker
        map.addLayer({
          id: 'active-marker-highlight',
          type: 'circle',
          source: sourceId,
          filter: ['==', ['get', 'isActive'], true],
          paint: {
            'circle-radius': 16,
            'circle-color': 'rgba(255, 255, 255, 0.3)',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });

        // Ensure the highlight is below the markers
        map.moveLayer('active-marker-highlight', 'company-icons');
      } else {
        // Update existing source with new data
        console.log('Updating existing GeoJSON source');
        (existingSource as GeoJSONSource).setData(taggedGeojson);

        // Update the color of text based on theme
        if (map.getLayer('cluster-count-layer')) {
          map.setPaintProperty(
            'cluster-count-layer',
            'text-color',
            theme === 'dark' ? '#ffffff' : '#000000',
          );
        }
      }
    } catch (err) {
      console.error('Error updating map:', err);
      setMapInitError(`Error updating map: ${err}`);
    }
  }, [mapLoaded, geojson, activeBusinessId, theme]);

  // Fly to a specific location
  const flyTo = (coords: [number, number], businessId?: string, addressType?: string) => {
    const map = mapRef.current?.getMap();
    if (!map) {
      console.warn('Map reference is not available for flyTo');
      return;
    }

    console.log(`Flying to: [${coords[0]}, ${coords[1]}]`);
    map.flyTo({ center: coords, zoom: 14, duration: 800 });

    // Find the feature that matches the coordinates and address type
    const matchingFeature = geojson.features.find((f) => {
      if (!f.geometry) return false;

      const [lng, lat] = f.geometry.coordinates;
      const matchesCoords = lng === coords[0] && lat === coords[1];
      const matchesId = businessId ? f.properties.business_id === businessId : true;
      const matchesType = addressType ? f.properties.addressType === addressType : true;

      return matchesCoords && matchesId && matchesType;
    });

    if (matchingFeature) {
      setActiveFeature(matchingFeature);
      setSelectedFeatures([matchingFeature]);
    } else {
      console.warn('No matching feature found for coordinates:', coords);
    }
  };

  if (mapInitError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-default-100 rounded-lg border border-default-200 p-4">
        <div className="text-center">
          <div className="text-danger mb-2 text-xl">⚠️ Map Error</div>
          <p className="text-default-600">{mapInitError}</p>
          <p className="text-sm mt-2 text-default-400">
            Please check the console for more details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {mapboxToken ? (
        <MapboxMap
          key={`${theme}-${mapboxToken?.substring(0, 8)}-${Date.now()}`} // Force re-render
          ref={mapRef}
          initialViewState={{ longitude: 25.171, latitude: 64.296, zoom: 5 }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={mapStyle}
          mapboxAccessToken={mapboxToken}
          onLoad={() => {
            console.log('Mapbox map loaded successfully');
            setMapLoaded(true);
          }}
          onError={(err) => {
            console.error('Mapbox error:', err);
            setMapInitError(`Mapbox error: ${err.error?.message || 'Unknown error'}`);
          }}
          onClick={handleMapClick}
          interactiveLayerIds={['company-icons', 'multi-marker-icons', 'clusters']}
          attributionControl={true}
          reuseMaps={false} // Disable map reuse to ensure clean initialization
          hash={true} // Enable hash for sharing map position
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-default-100 rounded-lg border border-default-200 p-4">
          <div className="text-center">
            <div className="text-danger mb-2 text-xl">⚠️ Configuration Error</div>
            <p className="text-default-600">Mapbox access token is missing</p>
            <p className="text-sm mt-2 text-default-400">
              Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables.
            </p>
          </div>
        </div>
      )}

      {selectedFeatures.length > 0 && (
        <FeatureCardList
          features={selectedFeatures}
          activeFeature={activeFeature}
          onSelect={setActiveFeature}
          theme={theme || 'light'}
          flyTo={flyTo}
          selectedColor="#9C27B0" // Default color
        />
      )}

      {/* Debug overlay */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded text-xs">
          <div>Features: {geojson?.features?.length || 0}</div>
          <div>Selected: {selectedFeatures.length}</div>
          <div>Map Loaded: {mapLoaded ? 'Yes' : 'No'}</div>
          <div>Token: {mapboxToken ? '✓' : '✗'}</div>
          {geojson?.features?.some((f) => f.properties.business_id?.startsWith('mock-')) && (
            <div className="mt-1 text-yellow-300 font-bold">Using Mock Data</div>
          )}
        </div>
      )}

      {process.env.NODE_ENV !== 'production' && (
        <div className="absolute bottom-2 left-2 right-2 bg-background/95 rounded-lg shadow-md z-10">
          <MapDebugger geojson={geojson} mapboxToken={mapboxToken} theme={theme} />

          {/* Add simple fallback display if Mapbox fails and we're in development */}
          {!mapLoaded && geojson?.features?.length > 0 && (
            <div className="p-2 mt-2 bg-default-100 rounded-lg max-h-60 overflow-auto">
              <h3 className="text-sm font-bold mb-2">GeoJSON Data Preview (Fallback)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {geojson.features.slice(0, 5).map((feature, index) => (
                  <div
                    key={feature.properties.business_id || `feature-${index}`}
                    className="p-2 text-xs bg-default-200 rounded-lg"
                  >
                    <div>
                      <strong>Name:</strong> {feature.properties.company_name}
                    </div>
                  </div>
                ))}
              </div>
              {geojson.features.length > 5 && (
                <div className="text-xs text-default-500 mt-1">
                  And {geojson.features.length - 5} more features...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
