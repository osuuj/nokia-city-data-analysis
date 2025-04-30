'use client';

import type { FeatureCollection, Point } from 'geojson';
import { useEffect, useState } from 'react';
import type { CompanyProperties } from '../../types';

/**
 * Debug component for inspecting map data and issues
 */
export function MapDebugger({
  geojson,
  mapboxToken,
  theme,
}: {
  geojson: FeatureCollection<Point, CompanyProperties>;
  mapboxToken?: string;
  theme?: string;
}) {
  const [debugInfo, setDebugInfo] = useState({
    mapboxGlLoaded: false,
    browserSupport: true,
    webGLSupport: true,
    errorMessages: [] as string[],
  });

  useEffect(() => {
    // Check if mapbox-gl is loaded
    const checkMapboxGl = async () => {
      try {
        await import('mapbox-gl');
        setDebugInfo((prev) => ({ ...prev, mapboxGlLoaded: true }));
      } catch (err) {
        console.error('Error loading mapbox-gl:', err);
        setDebugInfo((prev) => ({
          ...prev,
          mapboxGlLoaded: false,
          errorMessages: [...prev.errorMessages, `Mapbox GL load error: ${err}`],
        }));
      }
    };

    // Check WebGL support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const hasWebGL = !!gl;
        setDebugInfo((prev) => ({ ...prev, webGLSupport: hasWebGL }));

        if (!hasWebGL) {
          setDebugInfo((prev) => ({
            ...prev,
            errorMessages: [...prev.errorMessages, 'WebGL is not supported in your browser'],
          }));
        }
      } catch (e) {
        setDebugInfo((prev) => ({
          ...prev,
          webGLSupport: false,
          errorMessages: [...prev.errorMessages, 'WebGL check error'],
        }));
      }
    };

    checkMapboxGl();
    checkWebGL();
  }, []);

  return (
    <div className="border border-warning bg-warning-50 rounded-lg p-4 mt-4 text-left">
      <h3 className="text-warning font-bold text-lg mb-2">Map Debugger</h3>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div>
          <strong>Mapbox Token:</strong> {mapboxToken ? '✅ Present' : '❌ Missing'}
        </div>
        <div>
          <strong>Theme:</strong> {theme || 'Not set'}
        </div>
        <div>
          <strong>MapboxGL:</strong> {debugInfo.mapboxGlLoaded ? '✅ Loaded' : '❌ Not loaded'}
        </div>
        <div>
          <strong>WebGL:</strong> {debugInfo.webGLSupport ? '✅ Supported' : '❌ Not supported'}
        </div>
        <div>
          <strong>Browser:</strong>{' '}
          {debugInfo.browserSupport ? '✅ Compatible' : '❌ Not compatible'}
        </div>
        <div>
          <strong>GeoJSON Features:</strong> {geojson?.features?.length || 0}
        </div>
      </div>

      {debugInfo.errorMessages.length > 0 && (
        <div className="mt-2">
          <h4 className="font-bold text-sm text-warning mb-1">Error Messages:</h4>
          <ul className="text-xs list-disc pl-4">
            {debugInfo.errorMessages.map((msg, i) => (
              <li key={`error-${msg.substring(0, 10)}-${i}`}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {geojson?.features?.length > 0 && (
        <div className="mt-2">
          <h4 className="font-bold text-sm mb-1">Sample Feature:</h4>
          <pre className="text-xs bg-black/10 p-2 rounded overflow-auto max-h-20">
            {JSON.stringify(geojson.features[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
